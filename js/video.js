'use strict'
require('../style/video.css');
require('./customElem');
let ua = navigator.userAgent.toLowerCase(),
    isAPP = ua.indexOf("mso_app") != -1
let formatTime = require('./formatTime');
let requestAnimate = require('./requestAnimate');
let fullscreen = require('./fullscreen');

function Video(wrapper, options) {
    const self = this;

    this.wrapper = wrapper;
    self.options = $.extend({
        sources: [],
        autoPlay: false,
        width: 0,
        height: 0,
        poster: ''
    }, options);
    self.video = null;
    self.videoId = 'qhv-v-' + +new Date();
    self.volume = 0.5;
    self.firstplay = false;
    self.isEnded = false;
    self.ctrlsIsShow = false;
    this.init();

}

Video.prototype.init = function() {
    const self = this;

    self.renderVideo();
};
/**
 * 渲染video标签
 * @return {[type]} [description]
 */
Video.prototype.renderVideo = function() {
    let self = this,
        options = self.options,
        source = '',
        video = '',
        videoWH = 'width="100%"',
        boxWH = '',
        poster = '',
        src = options.sources[0],
        autoPlay = options.autoPlay ? ' autoPlay' : '';

    options.sources.forEach(function(v, i) {
        source += `<source src="${v}"></source>`;
    });

    if (options.width && options.height) {
        videoWH = ` width="${options.width}" height="${options.height}"`;
        boxWH = ` style="width:${options.width}px;height:${options.height}px"`;
    }

    if (options.poster) {
        poster = `poster=${options.poster}`;
    }

    video = `<qhvdiv class="qhv-v-box" ${boxWH}>
                    <video id="${self.videoId}" src="${src}" ${poster} ${videoWH}>${source}您的浏览器不支持video标签</video>
                    <qhvdiv class="qhv-overlay">
                        <qhvdiv class="qhv-ctrls">
                            <qhvdiv class="qhv-ctrls-box">
                                <qhvdiv class="qhv-ctrl qhv-playpausebtn qhv-play-btn"></qhvdiv>
                                <qhvdiv class="qhv-ctrl qhv-progressbar">
                                    <qhvdiv class="qhv-sliderbar qhv-p-sliderbar">
                                        <qhvdiv class="qhv-slider-buffer"></qhvdiv>
                                        <qhvdiv class="qhv-slider-bg"></qhvdiv>
                                        <qhvdiv class="qhv-slider qhv-p-slider"></qhvdiv>
                                    </qhvdiv>
                                    <qhvdiv class="qhv-current-time">00:00</qhvdiv>
                                    <qhvdiv class="qhv-sep">/</qhvdiv>
                                    <qhvdiv class="qhv-duration">00:00</qhvdiv>
                                </qhvdiv>
                                <qhvdiv class="qhv-ctrl qhv-screen qhv-fullscreen">全屏</qhvdiv>
                            </qhvdiv>
                        </qhvdiv>
                        <qhvdiv class="qhv-overlay-btn">
                            <qhvdiv class="qhv-playpausebtn qhv-play-btn"></qhvdiv> 
                        </qhvdiv>
                        <qhvdiv class="qhv-volumebar">
                            <qhvdiv class="qhv-v-sliderbar">
                                <qhvdiv class="qhv-slider-bg"></qhvdiv>
                                <qhvdiv class="qhv-v-slider"></qhvdiv>
                            </qhvdiv>
                            <qhvdiv class="qhv-volume-icon"></qhvdiv>
                        </qhvdiv>
                    </qhvdiv>
                </qhvdiv>`;

    $(video).appendTo(self.wrapper);
    self.video = document.getElementById(self.videoId);
    $(self.video).ready(function() {
        self.renderControls();
        self.video.volume = self.volume;
    })

    self.addListener();

}
Video.prototype.setDuration = function(duration = 0) {
        let self = this;
        self.wrapper.find('.qhv-duration').html(duration);
    }
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
    }
    /**
     * 更新视频播放时长
     * @param  {Number} time 当前视频播放的时长
     * @return {[type]}      [description]
     */
Video.prototype.updatePlayTime = function(time) {
        const self = this;
        self.wrapper.find('.qhv-current-time').html(formatTime.format(time));
    }
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

    }
    /**
     * 更新声音条
     * @param {Number} h 声音条高度
     * @return {[type]} [description]
     */
Video.prototype.updateVolume = function(volume, h) {
    let self = this;
    volume.height(h);
    self.video.volume = h / 100;
    self.volume = h / 100;
}


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
    // if (bufferedDuration === duration) {
    //     return;
    // }
}
/**
 * 添加自定义控件上的事件
 * @return {[type]} [description]
 */
Video.prototype.on = function() {
    const self = this;
    const video = self.video;
    const wrapper = self.wrapper[0];
    const duration = video.duration;
    // 播放进度条
    const $progressbar = self.wrapper.find('.qhv-progressbar .qhv-sliderbar');
    const $poffset = $progressbar.offset() || { left: 0 };
    const $slider = $progressbar.find('.qhv-slider');

    // 声音
    const $volumebar = self.wrapper.find('.qhv-volumebar .qhv-v-sliderbar');
    const $vslider = $volumebar.find('.qhv-v-slider');


    let pStartX = 0;
    let pStartL = 0;
    let vStartX = 0;
    let vStartL = 0;

    let startY = 0;


    let moved = false;

    // 点击播放暂停按钮
    self.wrapper.on('touchstart', '.qhv-playpausebtn', function(ev) {

            let $playpausebtn = self.wrapper.find('.qhv-playpausebtn');
            self.firstplay = true;

            // 已经播放结束后再次点击播放按钮即重播
            if (self.isEnded) {
                self.isEnded = false;
                video.currentTime = 0;
                self.updateSliderbar(self.wrapper.find('.qhv-p-sliderbar').closest('.qhv-sliderbar'), 0);
            }

            if (video.paused) {
                video.play();
                $playpausebtn.removeClass('qhv-play-btn').addClass('qhv-pause-btn');
            } else {
                video.pause();
                $playpausebtn.removeClass('qhv-pause-btn').addClass('qhv-play-btn');
            }



        })
        // 点击显示隐藏控制条
        .on('touchstart', '.qhv-overlay', function(ev) {
            ev.stopPropagation();
            if (ev.target !== this) {
                return;
            }
            startY = ev.touches[0].screenY;

        })
        .on('touchmove', '.qhv-overlay', function(ev) {
            ev.stopPropagation();
            if (ev.target !== this || Math.abs(startY - ev.touches[0].screenY) < 10) {
                return;
            }
            let $this = $(this);
            let moveY = (startY - ev.touches[0].screenY) / 10 + $vslider.height();

            moveY = Math.min($volumebar.height(), Math.max(0, moveY));
            self.updateVolume($vslider, moveY);
        })
        .on('touchend', '.qhv-overlay', function(ev) {
            ev.stopPropagation();
            if (ev.target !== this || !self.firstplay) {
                return;
            }
            self.showCtrls();

        })
        // 点击声音静音按钮
        .on('touchstart', '.qhv-volume-icon', function(ev) {
            ev.stopPropagation();
            let $this = $('this');
            if (video.muted) {
                $this.removeClass('qhv-volume-muted');
                video.volume = self.volume;
                self.updateVolume($vslider, self.volume * $volumebar.height());
                video.muted = false;
            } else {
                $this.addClass('qhv-volume-muted');
                video.volume = 0;
                self.updateVolume($vslider, 0);
                video.muted = true;
            }

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

            self.updateSliderbar($(this).closest('.qhv-sliderbar'), offset);

            video.currentTime = offset / progressMax * duration;

        });

}
Video.prototype.showCtrls = function() {
    let self = this;
    let $wrapper = self.wrapper;

    let $overlay = $wrapper.find('.qhv-overlay');
    let $ctrl = $overlay.find('.qhv-ctrls');
    let $midbtn = $overlay.find('.qhv-overlay-btn');
    let $volume = $overlay.find('.qhv-volumebar');
    $midbtn.add($volume).show();
    $ctrl.css('opacity', 1);
    self.ctrlsIsShow = true;

}

Video.prototype.hideCtrls = function() {
    let self = this;
    let $wrapper = self.wrapper;

    let $overlay = $wrapper.find('.qhv-overlay');
    let $ctrl = $overlay.find('.qhv-ctrls');
    let $midbtn = $overlay.find('.qhv-overlay-btn');
    let $volume = $overlay.find('.qhv-volumebar');

    $midbtn.add($volume).hide();
    $ctrl.css('opacity', 0);
    self.ctrlsIsShow = false;

}

Video.prototype.play = function() {
    let self = this;

    self.wrapper.find('.qhv-playpausebtn').removeClass('qhv-play-btn qhv-loading').addClass('qhv-pause-btn');

}
Video.prototype.paused = function() {
    let self = this;

    self.wrapper.find('.qhv-playpausebtn').removeClass('qhv-pause-btn qhv-loading').addClass('qhv-play-btn');
}
Video.prototype.loaded = function() {
    let self = this;
    let video = self.video;

    if (video.paused) {
        self.wrapper.find('.qhv-playpausebtn').addClass('qhv-play-btn').removeClass('qhv-loading');
    } else {
        self.wrapper.find('.qhv-playpausebtn').addClass('qhv-pause-btn').removeClass('qhv-loading');
    }
}
Video.prototype.ended = function() {
    let self = this;

    self.showCtrls();
    self.paused();
    self.isEnded = true;
}
Video.prototype.waiting = function() {
    let self = this;

    self.showCtrls()
    self.wrapper.find('.qhv-overlay-btn .qhv-playpausebtn').removeClass('qhv-play-btn qhv-pause-btn').addClass('qhv-loading');
}

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
                    if(self.ctrlsIsShow) {
                        if(time - showTime >= 5000) {
                            self.hideCtrls();
                        }
                    }  else {
                        showTime = time;
                    }
                }
            }

            

            requestAnimate(changeStatus);
        }
        requestAnimate(changeStatus);
    }
    /**
     * 监听video自身的一些事件
     */
Video.prototype.addListener = function() {

    const self = this;
    const $self = $(self);
    const video = self.video;
    const wrapper = self.wrapper[0];
    const $progressbar = self.wrapper.find('.qhv-progressbar .qhv-sliderbar');
    const $overlay = self.wrapper.find('.qhv-overlay');
    const $ctrls = self.wrapper.find('.qhv-ctrls');
    const $sliderbar = $progressbar.find('.qhv-slider');

    const $screen = self.wrapper.find('.qhv-screen');

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

    if(isAPP) {
        fullscreenElem = wrapper;
    }

    fullscreen(self.wrapper, 'click', '.qhv-screen', fullscreenElem, toggleScreen);

    // 视频播放的进度
    video.addEventListener('timeupdate', function(ev) {
        // console.log('timeupdate')
        const max = $progressbar.width() - $sliderbar.width();
        self.updatePlayTime(video.currentTime);
        self.updateSliderbar($progressbar, video.currentTime / video.duration * max);

    }, false);


    video.addEventListener('loadstart', function() {
        self.waiting();
        
    }, false);

    video.addEventListener('waiting', function() {
        self.waiting();
        console.log('waiting');
    }, false);

    video.addEventListener('canplay', function() {
        console.log('canplay')
        self.loaded();
    }, false);

    video.addEventListener('canplaythrough', function() {
        console.log('canplaythrough')
    }, false);

    video.addEventListener('playing', function() {
        console.log('playing')
    }, false);

    video.addEventListener('ended', function() {
        self.ended();
    }, false);

    video.addEventListener('seeking', function() {
        console.log('seeking')
        self.waiting();
    }, false);

    video.addEventListener('seeked', function() {
        console.log('seeked')
        video.paused ? self.paused() : self.play();

    }, false);

    video.addEventListener('play', function() {
        console.log('play')
    }, false);

    video.addEventListener('pause', function() {
        self.showCtrls();
    }, false);

    video.addEventListener('progress', function(ev) {
        console.log('progress')
    }, false);

    // video.addEventListener('durationchange', type, false);
    // video.addEventListener('fullscreenchange', type, false);
    video.addEventListener('error', function() {
        console.log('error')
        video.load();
    }, false);

    // 不能触发waiting事件，因为有时候播放正常，缓冲加载足够播放的数据，但是仍然会出现suspend的情况
    video.addEventListener('suspend', function() {
        console.log('suspend')
    }, false);

    video.addEventListener('abort', function() {
        console.log('abort');
    }, false);

    video.addEventListener('emptied', function() {
        console.log('emptied')
    }, false);

    // 失速
    video.addEventListener('stalled', function() {
        console.log('stalled')
            // 如果已经点击播放了，再出现stalled则触发waiting事件
        if (self.firstplay) {
            self.waiting();
        }
    }, false);

    video.addEventListener('loadedmetadata', function() {
        let $volumebar = self.wrapper.find('.qhv-volumebar .qhv-sliderbar');
        self.updateSliderbar($volumebar, self.volume * $volumebar.width() - $volumebar.find('.qhv-slider').width() / 2);
        self.setDuration(formatTime.format(self.video.duration));
        self.updatePlayTime(self.video.duration);
        self.on();
        self.changeStatus();
    }, false);

    // video.addEventListener('ratechange', type, false);
    // video.addEventListener('volumechange', type, false);
    // video.addEventListener('texttrackchange', type, false);

    // video.addEventListener('posterchange', function() {
    //     // console.log('posterchange')
    // }, false);
}


window.Video = Video;
