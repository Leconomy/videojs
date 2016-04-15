'use strict'
require('../style/video.css');
require('./customElem');
let formatTime = require('./formatTime');
let requestAnimate = require('./requestAnimate');
class Video {
    constructor(wrapper, options) {
        const self = this;

        this.wrapper = wrapper;
        self.options = $.extend({
            sources: [],
            autoPlay: false,
            width: 0,
            height: 0
        }, options);
        self.video = null;
        self.videoId = 'qhv-v-' + +new Date();
        self.volume = 0.5;
        self.ctrlsHideTimer = null;
        self.firstplay = false;
        self.loading = false;
        this.init();
    }

    init() {
            const self = this;

            self.renderVideo();
            self.listener();

        }
        /**
         * 渲染video标签
         * @return {[type]} [description]
         */
    renderVideo() {
        let self = this,
            options = self.options,
            source = '',
            video = '',
            videoWH = 'width="100%"',
            boxWH = '',
            autoPlay = options.autoPlay ? ' autoPlay' : '';

        options.sources.forEach(function(v, i) {
            source += `<source src="${v}"></source>`;
        });

        if(options.width && options.height) {
        	videoWH = ` width="${options.width}" height="${options.height}"` ;
        	boxWH = ` style="width:${options.width}px;height:${options.height}px"` ;
        }

        video = `<qhvdiv class="qhv-v-box" ${boxWH}>
					<video id="${self.videoId}" ${videoWH}>${source}您的浏览器不支持video标签</video>
					<qhvdiv class="qhv-overlay">
						<qhvdiv class="qhv-ctrls">
							<qhvdiv class="qhv-ctrls-box">
								<qhvdiv class="qhv-ctrl qhv-playpausebtn"></qhvdiv>
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
							<qhvdiv class="qhv-playpausebtn"></qhvdiv>	
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

            requestAnimate(self.buffer.bind(self));
        })
        
        self.addListener();

    }

    setDuration(duration = 0) {
            let self = this;
            self.wrapper.find('.qhv-duration').html(duration);
        }
        /**
         * 渲染自定义控件
         * @return {[type]} [description]
         */
    renderControls() {
            const self = this;
            if (self.options.autoPlay) {
                self.video.play();
            }

            self.wrapper.find('.qhv-ctrls').css('opacity', 1);
        }
        /**
         * 更新视频播放时长
         * @param  {Number} time 当前视频播放的时长
         * @return {[type]}      [description]
         */
    updatePlayTime(time) {
        const self = this;
        self.wrapper.find('.qhv-current-time').html(formatTime.format(time));
    }

    /**
     * 更新滑块条位置
     * @param  {Number} l 进度条位置
     * @param  {Object} sliderbar 需要更新滑块的对象
     * @return {[type]}   [description]
     */
    updateSliderbar(sliderbar, l) {

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
    updateVolume(volume, h) {
        let self = this;
        volume.height(h);
        self.video.volume = h / 100;
    }

    buffer() {
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
        if (bufferedDuration === duration) {
            return;
        }
        requestAnimate(self.buffer.bind(self));
    }

    /**
     * 添加自定义控件上的事件
     * @return {[type]} [description]
     */
    on() {
        const self = this;
        const video = self.video;
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
                if (ev.target !== this) {
                    return;
                }
                startY = ev.touches[0].screenY;

            })
            .on('touchmove', '.qhv-overlay', function(ev) {
                if (ev.target !== this) {
                    return;
                }
                clearTimeout(self.ctrlsHideTimer);
                let $this = $(this);
                let moveY = (startY - ev.touches[0].screenY) / 4 + $vslider.height();

                moveY = Math.min(100, Math.max(0, moveY));
                self.updateVolume($vslider, moveY);
            })
            .on('touchend', '.qhv-overlay', function(ev) {
                if (ev.target !== this || !self.firstplay) {
                    return;
                }
                $(self).trigger('controlls.show')
                if(!video.paused) {
                	$(self).trigger('controlls.delayhide');
                }

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
            // 点击全屏按钮
            .on('touchstart', '.qhv-fullscreen', (ev) => {
                ev.stopPropagation();
                if (video.webkitRequestFullscreen) {
                    video.webkitRequestFullscreen();
                } else if (video.requestFullscreen) {
                    video.requestFullscreen();
                } else if (video.mozRequestFullscreen) {
                    video.mozRequestFullscreen();
                } else if (video.msRequestFullscreen) {
                    video.msRequestFullscreen();
                } else if (video.oRequestFullscreen) {
                    video.oRequestFullscreen();
                }

            })
            .on('touchstart', '.qhv-exit-fullscreen', (ev) => {
                ev.stopPropagation();
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                } else if (document.mozCancelFullScreen) {
                    document.mozCancelFullScreen();
                } else if (document.webkitExitFullscreen) {
                    document.webkitExitFullscreen();
                } else if (document.oExitFullscreen) {
                    document.oExitFullscreen();
                } else if (document.msExitFullscreen) {
                    document.msExitFullscreen();
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

    listener() {
        let self = this;
        let $self = $(self);
        $(self).on('controlls.show', function(ev) {
                let $overlay = self.wrapper.find('.qhv-overlay');
                let $ctrl = $overlay.find('.qhv-ctrls');
                let $midbtn = $overlay.find('.qhv-overlay-btn');
                let $volume = $overlay.find('.qhv-volumebar');
                $midbtn.add($volume).show();
                $ctrl.css('opacity', 1);

            })
            .on('controlls.delayhide', function() {
                
                self.ctrlsHideTimer = setTimeout(function() {
                    $self.trigger('controlls.hide');
                    self.ctrlsHideTimer = null;
                }, 3000)
            })
            .on('controlls.hide', function() {
                let $overlay = self.wrapper.find('.qhv-overlay');
                let $ctrl = $overlay.find('.qhv-ctrls');
                let $midbtn = $overlay.find('.qhv-overlay-btn');
                let $volume = $overlay.find('.qhv-volumebar');

                $midbtn.add($volume).hide();
                $ctrl.css('opacity', 0);
                self.ctrlsHideTimer = null;
            })
            .on('loading', function() {
            	self.wrapper.find('.qhv-overlay-btn .qhv-playpausebtn').addClass('qhv-loading');
            	self.loading = true;
            })
            .on('loaded', function() {
            	self.wrapper.find('.qhv-overlay-btn .qhv-playpausebtn').removeClass('qhv-loading');
            	self.loading = false;
            })
            .on('playing', function() {
            	$self.trigger('loaded');
                self.wrapper.find('.qhv-playpausebtn').addClass('qhv-pause-btn').removeClass('qhv-play-btn');
            })
            .on('paused', function() {
            	$self.trigger('loaded');
                self.wrapper.find('.qhv-playpausebtn').removeClass('qhv-pause-btn').addClass('qhv-play-btn');
            })
            .on('canplaythrough', function() {
            	$self.trigger('loaded');
            })
            .on('ended', function() {
                $self.trigger('controlls.show').trigger('paused');
            })
            .on('waiting', function() {
            	clearTimeout(self.ctrlsHideTimer);
                $self.trigger('controlls.show').trigger('loading');
            });
    }

    /**
     * 监听video自身的一些事件
     */
    addListener() {

        const self = this;
        const $self = $(self);
        const video = self.video;
        const $progressbar = self.wrapper.find('.qhv-progressbar .qhv-sliderbar');
        const $sliderbar = $progressbar.find('.qhv-slider');

        const $screen = self.wrapper.find('.qhv-screen');

        function toggleScreen(type) {
            if (type === 1) {
                $screen.removeClass('qhv-fullscreen').addClass('qhv-exit-fullscreen');
                return;
            }
            $screen.addClass('qhv-fullscreen').removeClass('qhv-exit-fullscreen');
        }

        // 视频播放的进度
        video.addEventListener('timeupdate', function(ev) {
            // console.log('timeupdate')
            const max = $progressbar.width() - $sliderbar.width();

            self.updatePlayTime(video.currentTime);
            self.updateSliderbar($progressbar, video.currentTime / video.duration * max);

        }, false);

        video.addEventListener('fullscreenchange', (ev) => {

            if (document.fullscreenElement) {
                toggleScreen(1);
            } else {
                toggleScreen(0);
            }

        }, false);

        video.addEventListener('webkitfullscreenchange', function(ev) {

            if (document.webkitFullscreenElement) {
                toggleScreen(1);
            } else {
                toggleScreen(0);
            }

        }, false);

        video.addEventListener('msfullscreenchange', (ev) => {

            if (document.msFullscreenElement) {
                toggleScreen(1);
            } else {
                toggleScreen(0);
            }

        }, false);

        video.addEventListener('mozfullscreenchange', (ev) => {

            if (document.mozFullscreenElement) {
                toggleScreen(1);
            } else {
                toggleScreen(0);
            }

        }, false);

        video.addEventListener('ofullscreenchange', (ev) => {

            if (document.oFullscreenElement) {
                toggleScreen(1);
            } else {
                toggleScreen(0);
            }

        }, false);


        video.addEventListener('loadstart', function() {
            $self.trigger('waiting');
        }, false);

        video.addEventListener('waiting', function() {
            $self.trigger('waiting');
            if(!video.paused) {
            	video.pause();
            	setTimeout(function() {
            		video.play();
            	}, 2000);
            }
            // console.log('waiting');
        }, false);

        video.addEventListener('canplay', function() {
            // console.log('canplay')
            if(!self.firstplay) {
            	$self.trigger('loaded');
            } else {
            	if(self.loading) {
            		$self.trigger('loaded');
            		if(video.paused) {

            		} else {
            			$self.trigger('controlls.hide')
            		}
            	}
            }
        }, false);

        // video.addEventListener('canplaythrough', function() {
        //     // console.log('canplaythrough')
        //     // $self.trigger('canplaythrough')
        // }, false);

        // video.addEventListener('playing', function() {
        // 	// console.log('playing')
        // }, false);
        
        video.addEventListener('ended', function() {
            $self.trigger('ended');
        }, false);

        video.addEventListener('seeking', function() {
            $self.trigger('waiting');
        }, false);

        // video.addEventListener('seeked', function() {

        // }, false);

        video.addEventListener('play', function() {
            $self.trigger('controlls.delayhide');
        }, false);
        
        video.addEventListener('pause', function() {
            $self.trigger('controlls.show');
            clearTimeout(self.ctrlsHideTimer);
        }, false);
        
        // video.addEventListener('progress', function(ev) {
        	
        // }, false);

        // video.addEventListener('durationchange', type, false);
        // video.addEventListener('fullscreenchange', type, false);
        // video.addEventListener('error', function() {
        //     // console.log('error')
        // }, false);

        // video.addEventListener('suspend', function() {
        //     // console.log('suspend')
        //         // $self.trigger('waiting');
        // }, false);

        // video.addEventListener('abort', function() {
        //     // console.log('abort');
        // }, false);

        // video.addEventListener('emptied', function() {
        //     // console.log('emptied')
        // }, false);

        video.addEventListener('stalled', function() {
            // console.log('stalled')
            // 如果已经点击播放了，再出现stalled则触发waiting事件
            if(self.firstplay) {
            	$self.trigger('waiting');
            }
        }, false);

        // video.addEventListener('loadeddata', function() {
        //     // console.log('loadeddata')
        // }, false);

        video.addEventListener('loadedmetadata', function() {
            let $volumebar = self.wrapper.find('.qhv-volumebar .qhv-sliderbar');
            self.updateSliderbar($volumebar, self.volume * $volumebar.width() - $volumebar.find('.qhv-slider').width() / 2);
            self.setDuration(formatTime.format(self.video.duration));
            self.updatePlayTime(self.video.duration);
            self.on();
        }, false);

        // video.addEventListener('ratechange', type, false);
        // video.addEventListener('volumechange', type, false);
        // video.addEventListener('texttrackchange', type, false);
        
        // video.addEventListener('posterchange', function() {
        //     // console.log('posterchange')
        // }, false);
    }
}

window.Video = Video;
