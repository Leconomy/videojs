'use strict'

require('../style/video.css');
require('./customElem');


let UA = require('./userAgent');
let formatTime = require('./formatTime');
let requestAnimate = require('./requestAnimate');
let fullscreen = require('./fullscreen');
let getVideoUI = require('./getVideoUI');
let isIOS = UA.isIOS;
let isAPP = UA.isApp;

function Video(wrapper, options) {
    const self = this;

    self.wrapper = wrapper;

    self.options = $.extend({
        sources: [],
        autoPlay: false,
        width: window.innerWidth,
        height: 0,
        poster: ''
    }, options);

    self.video = null;
    self.videoId = 'qhv-v-' + +new Date();
    self.firstplay = false;
    self.isEnded = false;
    self.ctrlsIsShow = false;

    self.init();

}

Video.prototype.init = function() {
    const self = this;

    self.renderVideo();
};



Video.prototype.handleWH = function(width, height) {
    let winW = window.innerWidth,
        calcH = 0,
        calcW = 0,
        scale = 1;

    if (width >= winW) {
        calcW = Math.min(width, winW);
        calcH = winW / width * height;
    } else {
        calcW = Math.max(width, winW)
        calcH = width / winW * height;
    }

    return { w: calcW, h: calcH };


};
/**
 * 渲染video标签
 * @return {[type]} [description]
 */
Video.prototype.renderVideo = function() {
    let self = this,
        options = self.options,
        video = '',
        oWH = null,
        src = options.sources[0],
        autoPlay = options.autoPlay ? ' autoPlay' : '';


    oWH = self.handleWH(options.width, options.height);
    video = getVideoUI.getVideo(self.videoId, src, options.sources, oWH.w, oWH.h, options.poster);

    $(video).appendTo(self.wrapper);

    self.video = document.getElementById(self.videoId);
    $(self.video).ready(function() {
        self.renderControls();
    });

    // video加载失败的事件
    self.addErrorListener();

    if(isIOS) {
        self.wrapper.addClass('qhv-ios');
        // video的元数据加载完成的事件
        self.addLoadedDataListener();
    } else {
        // video的元数据加载完成的事件
        self.addAndroidLoadedDataListener();
        // video的waiting、canplay、suspend等事件
        self.addAndroidListener();
        // 全屏
        self.fullscreen();
    }
};

Video.prototype.setDuration = function(duration = 0) {
    let self = this;
    self.wrapper.find('.qhv-duration').html(duration);
};
/**
 * 渲染自定义控件
 * @return {[type]} [description]
 */
Video.prototype.renderControls = function() {
    const self = this;
    if (self.options.autoPlay) {
        self.video.play();
        self.firstplay = true;
    }

    self.wrapper.find('.qhv-ctrls').css('opacity', 1);
};
/**
 * 更新视频播放时长
 * @param  {Number} time 当前视频播放的时长
 * @return {[type]}      [description]
 */
Video.prototype.updatePlayTime = function(time) {
    const self = this;
    self.wrapper.find('.qhv-current-time').html(formatTime.format(time));
};
/**
 * 更新滑块条位置
 * @param  {Number} l 进度条位置
 * @param  {Object} sliderbar 需要更新滑块的对象
 * @return {[type]}   [description]
 */
Video.prototype.updateSliderbar = function(sliderbar, l) {

    let self = this;
    let $slider = sliderbar.find('.qhv-slider');
    $slider.css('left', l);
    sliderbar.find('.qhv-slider-bg').width(l + $slider.width() / 2);

};
/**
 * 计算已经缓冲的进度
 * @return {[type]} [description]
 */
Video.prototype.buffer = function() {
    let self = this;
    let max = self.wrapper.find('.qhv-p-sliderbar').width();
    let buffered = self.video.buffered;
    let start, end;
    let bufferedDuration = 0;
    let duration = self.video.duration;

    for (let i = 0, len = buffered.length; i < len; i++) {
        start = buffered.start(i);
        end = buffered.end(i);
        if (end > duration) {
            end = duration;
        }
        bufferedDuration += end - start;
    }
    self.wrapper.find('.qhv-slider-buffer').width(bufferedDuration / duration * max);
};
/**
 * android下video加载失败的事件
 */
Video.prototype.addErrorListener = function() {
    const self = this;
    const video = self.video;

    let loadCount = 0;

    video.addEventListener('error', function() {

        if (++loadCount < 4) {
            video.load();
        }

    }, false);
};
/**
 * android下video加载元数据的事件
 */
Video.prototype.addAndroidLoadedDataListener = function() {
    const self = this;
    const video = self.video;
    video.addEventListener('loadedmetadata', function() {

        self.setDuration(formatTime.format(self.video.duration));
        self.updatePlayTime(self.video.duration);
        self.changeStatus();
        self.addAndroidListener();
        
        self.androidOn();

    }, false);
};
/**
 * android下才需要监听这些事件
 */
Video.prototype.addAndroidListener = function() {

    const self = this;
    const video = self.video;

    const $progressbar = self.wrapper.find('.qhv-progressbar .qhv-sliderbar');
    const $overlay = self.wrapper.find('.qhv-overlay');
    const $ctrls = self.wrapper.find('.qhv-ctrls');
    const $sliderbar = $progressbar.find('.qhv-slider');

    video.addEventListener('loadstart', function() {
        self.waiting();
    }, false);

    video.addEventListener('waiting', function() {
        self.waiting();
    }, false);

    video.addEventListener('canplay', function() {
        self.loaded();
    }, false);

    video.addEventListener('ended', function() {
        self.ended();
    }, false);

    video.addEventListener('pause', function() {
        self.showCtrls();
    }, false);

    video.addEventListener('seeking', function() {
        self.waiting();
    }, false);


    video.addEventListener('seeked', function() {
        video.paused ? self.paused() : self.play();
    }, false);

    video.addEventListener('canplaythrough', function() {

    }, false);

    video.addEventListener('playing', function() {

    }, false);

    video.addEventListener('play', function() {

    }, false);

    video.addEventListener('progress', function(ev) {

    }, false);

    // video.addEventListener('durationchange', type, false);
    // video.addEventListener('fullscreenchange', type, false);

    // 不能触发waiting事件，因为有时候播放正常，缓冲加载足够播放的数据，但是仍然会出现suspend的情况
    video.addEventListener('suspend', function() {

    }, false);

    video.addEventListener('abort', function() {

    }, false);

    video.addEventListener('emptied', function() {

    }, false);

    // 失速
    video.addEventListener('stalled', function() {
        // 如果已经点击播放了，再出现stalled则触发waiting事件
        if (self.firstplay) {
            self.waiting();
        }
    }, false);

    // 视频播放的进度
    video.addEventListener('timeupdate', function(ev) {

        const max = $progressbar.width() - $sliderbar.width();
        self.updatePlayTime(video.currentTime);
        self.updateSliderbar($progressbar, video.currentTime / video.duration * max);

    }, false);
};
/**
 * android的事件绑定
 * @return {[type]} [description]
 */
Video.prototype.androidOn = function() {
    const self = this;

    const video = self.video;
    const wrapper = self.wrapper;

    const duration = video.duration;

    // 播放进度条
    const $progressbar = wrapper.find('.qhv-progressbar .qhv-sliderbar');
    const $poffset = $progressbar.offset() || { left: 0 };
    const $slider = $progressbar.find('.qhv-slider');
    const $sliderbg = $progressbar.find('.qhv-slider-bg');


    let pStartX = 0;
    let pStartL = 0;

    let startY = 0;
    let startX = 0;
    let moveX = 0;

    let moved = false;

    // 点击播放暂停按钮
    self.wrapper.on('touchstart', '.qhv-playpausebtn', function(ev) {

        let $playpausebtn = wrapper.find('.qhv-playpausebtn');
        self.firstplay = true;

        // 已经播放结束后再次点击播放按钮即重播
        if (self.isEnded) {
            self.isEnded = false;
            video.currentTime = 0;
            self.updateSliderbar(wrapper.find('.qhv-p-sliderbar').closest('.qhv-sliderbar'), 0);
        }

        if (video.paused) {
            video.play();
            $playpausebtn.removeClass('qhv-play-btn').addClass('qhv-pause-btn');
        } else {
            video.pause();
            $playpausebtn.removeClass('qhv-pause-btn').addClass('qhv-play-btn');
        }

    });
    // 点击显示隐藏控制条

    self.wrapper.on('touchstart', '.qhv-overlay', function(ev) {

            ev.stopPropagation();

            if (ev.target !== this) {
                return;
            }

            startY = ev.touches[0].screenY;
            startX = ev.touches[0].screenX;

            moved = false;
            moveX = 0;

        })
        .on('touchmove', '.qhv-overlay', function(ev) {

            ev.stopPropagation();

            let $this = $(this);

            if (ev.target !== this || !$this.hasClass('qhv-full-screen')) {
                return;
            }

            moveX = (ev.touches[0].screenX - startX) / 2 + $sliderbg.width();
            moveX = Math.min($progressbar.width(), Math.max(0, moveX));

            moved = true;

        })
        .on('touchend', '.qhv-overlay', function(ev) {

            ev.stopPropagation();

            if (ev.target !== this || !self.firstplay) {
                return;
            }

            if (moved) {
                self.showCtrls();
                video.currentTime = moveX / $progressbar.width() * duration;
                self.updateSliderbar($progressbar, moveX);
                return;
            }

            self.ctrlsIsShow ? self.hideCtrls() : self.showCtrls();

        })
        // 点击播放进度条
        .on('touchstart', '.qhv-p-sliderbar', function(ev) {

            const barW = $progressbar.width();
            const sliderW = $slider.width();
            const sliderL = $poffset.left + sliderW / 2;
            const progressMax = barW - sliderW;

            let offset = ev.touches[0].pageX - sliderL;

            offset = Math.min(Math.max(offset, 0), progressMax);

            video.currentTime = offset / progressMax * duration;

            self.updateSliderbar($(this).closest('.qhv-sliderbar'), offset);

        })
        // 进度条滑块
        .on('touchstart', '.qhv-p-slider', function(ev) {

            ev.stopPropagation();

            pStartX = ev.touches[0].pageX;
            pStartL = parseInt($(this).css('left'));

        })
        .on('touchmove', '.qhv-p-slider', function(ev) {

            ev.stopPropagation();

            let offset = pStartL + ev.touches[0].pageX - pStartX;

            const barW = $progressbar.width();
            const sliderW = $slider.width();
            const sliderL = $poffset.left + sliderW / 2;
            const progressMax = barW - sliderW;

            offset = Math.min(Math.max(offset, 0), progressMax);

            video.currentTime = offset / progressMax * duration;

            self.updateSliderbar($(this).closest('.qhv-sliderbar'), offset);

        });
};
/**
 * 添加自定义控件上的事件
 * @return {[type]} [description]
 */
Video.prototype.on = function() {
    const self = this;

    const video = self.video;

    // 点击播放暂停按钮
    // 不能用touchstart事件,ios9.1下点击播放无反映。分析是ios再不点击播放的情况下是不加载资源的
    self.wrapper.on('click', '.qhv-playpausebtn', function(ev) {
        video.play();
    });

};
Video.prototype.showCtrls = function() {
    let self = this;
    let $wrapper = self.wrapper;

    let $overlay = $wrapper.find('.qhv-overlay');
    let $ctrl = $overlay.find('.qhv-ctrls');
    let $midbtn = $overlay.find('.qhv-overlay-btn');

    $midbtn.show();
    $ctrl.css('opacity', 1);
    self.ctrlsIsShow = true;

};

Video.prototype.hideCtrls = function() {
    let self = this;
    let $wrapper = self.wrapper;

    let $overlay = $wrapper.find('.qhv-overlay');
    let $ctrl = $overlay.find('.qhv-ctrls');
    let $midbtn = $overlay.find('.qhv-overlay-btn');


    $midbtn.hide();
    $ctrl.css('opacity', 0);
    self.ctrlsIsShow = false;

};

Video.prototype.play = function() {
    let self = this;

    self.wrapper.find('.qhv-playpausebtn').removeClass('qhv-play-btn qhv-loading').addClass('qhv-pause-btn');

};
Video.prototype.paused = function() {
    let self = this;

    self.wrapper.find('.qhv-playpausebtn').removeClass('qhv-pause-btn qhv-loading').addClass('qhv-play-btn');
};
Video.prototype.loaded = function() {
    let self = this;
    let video = self.video;

    if (video.paused) {
        self.wrapper.find('.qhv-playpausebtn').addClass('qhv-play-btn').removeClass('qhv-loading');
    } else {
        self.wrapper.find('.qhv-playpausebtn').addClass('qhv-pause-btn').removeClass('qhv-loading');
    }
};
Video.prototype.ended = function() {
    let self = this;

    self.showCtrls();
    self.paused();
    self.isEnded = true;
};
Video.prototype.waiting = function() {
    let self = this;

    self.showCtrls()
    self.wrapper.find('.qhv-overlay-btn .qhv-playpausebtn').removeClass('qhv-play-btn qhv-pause-btn').addClass('qhv-loading');
};

/**
 * 改变播放状态
 * @return {[type]} [description]
 */
Video.prototype.changeStatus = function() {
    let self = this,
        $self = $(self),
        video = self.video,
        lastVideoTime = video.currentTime,
        showTime = 0,
        lastTime = 0;

    function changeStatus(time) {
        self.buffer();
        // 如果是暂停状态
        if (video.paused) {
            lastTime = time;
            showTime = time;
            self.paused();
        } else {
            // 间隔300ms检查一次， 如果当前的播放时间和上次的播放时间不相同那就是正常播放
            if (time - lastTime >= 300) {
                lastTime = time;
                if (lastVideoTime != video.currentTime) {
                    lastVideoTime = video.currentTime;
                    if (self.isEnded) {
                        self.ended();
                        return;
                    }
                    self.play();
                } else {
                    self.waiting();
                }
            }
            // 如果是正常播放并且控件是显示的，那隔5s后隐藏控件
            if (lastVideoTime != video.currentTime) {
                if (self.ctrlsIsShow) {
                    if (time - showTime >= 3000) {
                        self.hideCtrls();
                    }
                } else {
                    showTime = time;
                }
            }
        }

        requestAnimate(changeStatus);
    }

    requestAnimate(changeStatus);
};

/**
 * 全屏
 * @return {[type]} [description]
 */
Video.prototype.fullscreen = function() {
    const self = this;
    const video = self.video;
    const $wrapper = self.wrapper;
    const wrapper = $wrapper[0];

    const $ctrls = $wrapper.find('.qhv-ctrls');
    const $overlay = $wrapper.find('.qhv-overlay');
    const $screen = $wrapper.find('.qhv-screen');

    let fullscreenElem = video;

    function toggleScreen(type) {
        if (type === 1) {
            $overlay.add($ctrls).css('zIndex', 2147483647);
            $overlay.addClass('qhv-full-screen');
            $screen.removeClass('qhv-fullscreen').addClass('qhv-exit-fullscreen').html('退出');
            return;
        }
        $overlay.add($ctrls).css('zIndex', '');
        $overlay.removeClass('qhv-full-screen');
        $screen.addClass('qhv-fullscreen').removeClass('qhv-exit-fullscreen').html('全屏');
        self.buffer();
    }

    if (isAPP) {
        fullscreenElem = wrapper;
    }

    fullscreen(self.wrapper, 'click', '.qhv-screen', fullscreenElem, toggleScreen);

};

/**
 * video加载元数据的事件
 */
Video.prototype.addLoadedDataListener = function() {
    const self = this;
    const video = self.video;

    video.addEventListener('loadedmetadata', function() {
        self.on();
    }, false);

};


window.Video = Video;
