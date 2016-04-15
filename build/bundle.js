/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(1);
	__webpack_require__(7);
	var formatTime = __webpack_require__(8);
	var requestAnimate = __webpack_require__(9);

	var Video = function () {
	    function Video(wrapper, options) {
	        _classCallCheck(this, Video);

	        var self = this;

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

	    _createClass(Video, [{
	        key: 'init',
	        value: function init() {
	            var self = this;

	            self.renderVideo();
	            self.listener();
	        }
	        /**
	         * 渲染video标签
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'renderVideo',
	        value: function renderVideo() {
	            var self = this,
	                options = self.options,
	                source = '',
	                video = '',
	                videoWH = 'width="100%"',
	                boxWH = '',
	                autoPlay = options.autoPlay ? ' autoPlay' : '';

	            options.sources.forEach(function (v, i) {
	                source += '<source src="' + v + '"></source>';
	            });

	            if (options.width && options.height) {
	                videoWH = ' width="' + options.width + '" height="' + options.height + '"';
	                boxWH = ' style="width:' + options.width + 'px;height:' + options.height + 'px"';
	            }

	            video = '<qhvdiv class="qhv-v-box" ' + boxWH + '>\n\t\t\t\t\t<video id="' + self.videoId + '" ' + videoWH + '>' + source + '您的浏览器不支持video标签</video>\n\t\t\t\t\t<qhvdiv class="qhv-overlay">\n\t\t\t\t\t\t<qhvdiv class="qhv-ctrls">\n\t\t\t\t\t\t\t<qhvdiv class="qhv-ctrls-box">\n\t\t\t\t\t\t\t\t<qhvdiv class="qhv-ctrl qhv-playpausebtn"></qhvdiv>\n\t\t\t\t\t\t\t\t<qhvdiv class="qhv-ctrl qhv-progressbar">\n\t\t\t\t\t\t\t\t\t<qhvdiv class="qhv-sliderbar qhv-p-sliderbar">\n\t\t\t\t\t\t\t\t\t\t<qhvdiv class="qhv-slider-buffer"></qhvdiv>\n\t\t\t\t\t\t\t\t\t\t<qhvdiv class="qhv-slider-bg"></qhvdiv>\n\t\t\t\t\t\t\t\t\t\t<qhvdiv class="qhv-slider qhv-p-slider"></qhvdiv>\n\t\t\t\t\t\t\t\t\t</qhvdiv>\n\t\t\t\t\t\t\t\t\t<qhvdiv class="qhv-current-time">00:00</qhvdiv>\n\t\t\t\t\t\t\t\t\t<qhvdiv class="qhv-sep">/</qhvdiv>\n\t\t\t\t\t\t\t\t\t<qhvdiv class="qhv-duration">00:00</qhvdiv>\n\t\t\t\t\t\t\t\t</qhvdiv>\n\t\t\t\t\t\t\t\t<qhvdiv class="qhv-ctrl qhv-screen qhv-fullscreen">全屏</qhvdiv>\n\t\t\t\t\t\t\t</qhvdiv>\n\t\t\t\t\t\t</qhvdiv>\n\t\t\t\t\t\t<qhvdiv class="qhv-overlay-btn">\n\t\t\t\t\t\t\t<qhvdiv class="qhv-playpausebtn"></qhvdiv>\t\n\t\t\t\t\t\t</qhvdiv>\n\t\t\t\t\t\t<qhvdiv class="qhv-volumebar">\n\t\t\t\t\t\t\t<qhvdiv class="qhv-v-sliderbar">\n\t\t\t\t\t\t\t\t<qhvdiv class="qhv-slider-bg"></qhvdiv>\n\t\t\t\t\t\t\t\t<qhvdiv class="qhv-v-slider"></qhvdiv>\n\t\t\t\t\t\t\t</qhvdiv>\n\t\t\t\t\t\t\t<qhvdiv class="qhv-volume-icon"></qhvdiv>\n\t\t\t\t\t\t</qhvdiv>\n\t\t\t\t\t</qhvdiv>\n\t\t\t\t</qhvdiv>';

	            $(video).appendTo(self.wrapper);
	            self.video = document.getElementById(self.videoId);
	            $(self.video).ready(function () {
	                self.renderControls();
	                self.video.volume = self.volume;

	                requestAnimate(self.buffer.bind(self));
	            });

	            self.addListener();
	        }
	    }, {
	        key: 'setDuration',
	        value: function setDuration() {
	            var duration = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	            var self = this;
	            self.wrapper.find('.qhv-duration').html(duration);
	        }
	        /**
	         * 渲染自定义控件
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'renderControls',
	        value: function renderControls() {
	            var self = this;
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

	    }, {
	        key: 'updatePlayTime',
	        value: function updatePlayTime(time) {
	            var self = this;
	            self.wrapper.find('.qhv-current-time').html(formatTime.format(time));
	        }

	        /**
	         * 更新滑块条位置
	         * @param  {Number} l 进度条位置
	         * @param  {Object} sliderbar 需要更新滑块的对象
	         * @return {[type]}   [description]
	         */

	    }, {
	        key: 'updateSliderbar',
	        value: function updateSliderbar(sliderbar, l) {

	            var self = this;
	            var $slider = sliderbar.find('.qhv-slider');
	            $slider.css('left', l);
	            sliderbar.find('.qhv-slider-bg').width(l + $slider.width() / 2);
	        }
	        /**
	         * 更新声音条
	         * @param {Number} h 声音条高度
	         * @return {[type]} [description]
	         */

	    }, {
	        key: 'updateVolume',
	        value: function updateVolume(volume, h) {
	            var self = this;
	            volume.height(h);
	            self.video.volume = h / 100;
	        }
	    }, {
	        key: 'buffer',
	        value: function buffer() {
	            var self = this;
	            var max = self.wrapper.find('.qhv-p-sliderbar').width();
	            var buffered = self.video.buffered;
	            var start = void 0,
	                end = void 0;
	            var bufferedDuration = 0;
	            var duration = self.video.duration;

	            for (var i = 0, len = buffered.length; i < len; i++) {
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

	    }, {
	        key: 'on',
	        value: function on() {
	            var self = this;
	            var video = self.video;
	            var duration = video.duration;
	            // 播放进度条
	            var $progressbar = self.wrapper.find('.qhv-progressbar .qhv-sliderbar');
	            var $poffset = $progressbar.offset() || { left: 0 };
	            var $slider = $progressbar.find('.qhv-slider');

	            // 声音
	            var $volumebar = self.wrapper.find('.qhv-volumebar .qhv-v-sliderbar');
	            var $vslider = $volumebar.find('.qhv-v-slider');

	            var pStartX = 0;
	            var pStartL = 0;
	            var vStartX = 0;
	            var vStartL = 0;

	            var startY = 0;

	            var moved = false;

	            // 点击播放暂停按钮
	            self.wrapper.on('touchstart', '.qhv-playpausebtn', function (ev) {

	                var $playpausebtn = self.wrapper.find('.qhv-playpausebtn');
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
	            .on('touchstart', '.qhv-overlay', function (ev) {
	                if (ev.target !== this) {
	                    return;
	                }
	                startY = ev.touches[0].screenY;
	            }).on('touchmove', '.qhv-overlay', function (ev) {
	                if (ev.target !== this) {
	                    return;
	                }
	                clearTimeout(self.ctrlsHideTimer);
	                var $this = $(this);
	                var moveY = (startY - ev.touches[0].screenY) / 4 + $vslider.height();

	                moveY = Math.min(100, Math.max(0, moveY));
	                self.updateVolume($vslider, moveY);
	            }).on('touchend', '.qhv-overlay', function (ev) {
	                if (ev.target !== this || !self.firstplay) {
	                    return;
	                }
	                $(self).trigger('controlls.show');
	                if (!video.paused) {
	                    $(self).trigger('controlls.delayhide');
	                }
	            })
	            // 点击声音静音按钮
	            .on('touchstart', '.qhv-volume-icon', function (ev) {
	                ev.stopPropagation();
	                var $this = $('this');
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
	            .on('touchstart', '.qhv-fullscreen', function (ev) {
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
	            }).on('touchstart', '.qhv-exit-fullscreen', function (ev) {
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
	            .on('touchstart', '.qhv-p-sliderbar', function (ev) {

	                var barW = $progressbar.width();
	                var sliderW = $slider.width();
	                var sliderL = $poffset.left + sliderW / 2;
	                var progressMax = barW - sliderW;

	                var offset = ev.touches[0].pageX - sliderL;

	                offset = Math.min(Math.max(offset, 0), progressMax);
	                video.currentTime = offset / progressMax * duration;
	                self.updateSliderbar($(this).closest('.qhv-sliderbar'), offset);
	            })
	            // 进度条滑块
	            .on('touchstart', '.qhv-p-slider', function (ev) {
	                ev.stopPropagation();
	                pStartX = ev.touches[0].pageX;
	                pStartL = parseInt($(this).css('left'));
	            }).on('touchmove', '.qhv-p-slider', function (ev) {
	                ev.stopPropagation();

	                var offset = pStartL + ev.touches[0].pageX - pStartX;

	                var barW = $progressbar.width();
	                var sliderW = $slider.width();
	                var sliderL = $poffset.left + sliderW / 2;
	                var progressMax = barW - sliderW;

	                offset = Math.min(Math.max(offset, 0), progressMax);

	                self.updateSliderbar($(this).closest('.qhv-sliderbar'), offset);

	                video.currentTime = offset / progressMax * duration;
	            });
	        }
	    }, {
	        key: 'listener',
	        value: function listener() {
	            var self = this;
	            var $self = $(self);
	            $(self).on('controlls.show', function (ev) {
	                var $overlay = self.wrapper.find('.qhv-overlay');
	                var $ctrl = $overlay.find('.qhv-ctrls');
	                var $midbtn = $overlay.find('.qhv-overlay-btn');
	                var $volume = $overlay.find('.qhv-volumebar');
	                $midbtn.add($volume).show();
	                $ctrl.css('opacity', 1);
	            }).on('controlls.delayhide', function () {

	                self.ctrlsHideTimer = setTimeout(function () {
	                    $self.trigger('controlls.hide');
	                    self.ctrlsHideTimer = null;
	                }, 3000);
	            }).on('controlls.hide', function () {
	                var $overlay = self.wrapper.find('.qhv-overlay');
	                var $ctrl = $overlay.find('.qhv-ctrls');
	                var $midbtn = $overlay.find('.qhv-overlay-btn');
	                var $volume = $overlay.find('.qhv-volumebar');

	                $midbtn.add($volume).hide();
	                $ctrl.css('opacity', 0);
	                self.ctrlsHideTimer = null;
	            }).on('loading', function () {
	                self.wrapper.find('.qhv-overlay-btn .qhv-playpausebtn').addClass('qhv-loading');
	                self.loading = true;
	            }).on('loaded', function () {
	                self.wrapper.find('.qhv-overlay-btn .qhv-playpausebtn').removeClass('qhv-loading');
	                self.loading = false;
	            }).on('playing', function () {
	                $self.trigger('loaded');
	                self.wrapper.find('.qhv-playpausebtn').addClass('qhv-pause-btn').removeClass('qhv-play-btn');
	            }).on('paused', function () {
	                $self.trigger('loaded');
	                self.wrapper.find('.qhv-playpausebtn').removeClass('qhv-pause-btn').addClass('qhv-play-btn');
	            }).on('canplaythrough', function () {
	                $self.trigger('loaded');
	            }).on('ended', function () {
	                $self.trigger('controlls.show').trigger('paused');
	            }).on('waiting', function () {
	                clearTimeout(self.ctrlsHideTimer);
	                $self.trigger('controlls.show').trigger('loading');
	            });
	        }

	        /**
	         * 监听video自身的一些事件
	         */

	    }, {
	        key: 'addListener',
	        value: function addListener() {

	            var self = this;
	            var $self = $(self);
	            var video = self.video;
	            var $progressbar = self.wrapper.find('.qhv-progressbar .qhv-sliderbar');
	            var $sliderbar = $progressbar.find('.qhv-slider');

	            var $screen = self.wrapper.find('.qhv-screen');

	            function toggleScreen(type) {
	                if (type === 1) {
	                    $screen.removeClass('qhv-fullscreen').addClass('qhv-exit-fullscreen');
	                    return;
	                }
	                $screen.addClass('qhv-fullscreen').removeClass('qhv-exit-fullscreen');
	            }

	            // 视频播放的进度
	            video.addEventListener('timeupdate', function (ev) {
	                // console.log('timeupdate')
	                var max = $progressbar.width() - $sliderbar.width();

	                self.updatePlayTime(video.currentTime);
	                self.updateSliderbar($progressbar, video.currentTime / video.duration * max);
	            }, false);

	            video.addEventListener('fullscreenchange', function (ev) {

	                if (document.fullscreenElement) {
	                    toggleScreen(1);
	                } else {
	                    toggleScreen(0);
	                }
	            }, false);

	            video.addEventListener('webkitfullscreenchange', function (ev) {

	                if (document.webkitFullscreenElement) {
	                    toggleScreen(1);
	                } else {
	                    toggleScreen(0);
	                }
	            }, false);

	            video.addEventListener('msfullscreenchange', function (ev) {

	                if (document.msFullscreenElement) {
	                    toggleScreen(1);
	                } else {
	                    toggleScreen(0);
	                }
	            }, false);

	            video.addEventListener('mozfullscreenchange', function (ev) {

	                if (document.mozFullscreenElement) {
	                    toggleScreen(1);
	                } else {
	                    toggleScreen(0);
	                }
	            }, false);

	            video.addEventListener('ofullscreenchange', function (ev) {

	                if (document.oFullscreenElement) {
	                    toggleScreen(1);
	                } else {
	                    toggleScreen(0);
	                }
	            }, false);

	            video.addEventListener('loadstart', function () {
	                $self.trigger('waiting');
	            }, false);

	            video.addEventListener('waiting', function () {
	                $self.trigger('waiting');
	                if (!video.paused) {
	                    video.pause();
	                    setTimeout(function () {
	                        video.play();
	                    }, 2000);
	                }
	                // console.log('waiting');
	            }, false);

	            video.addEventListener('canplay', function () {
	                // console.log('canplay')
	                if (!self.firstplay) {
	                    $self.trigger('loaded');
	                } else {
	                    if (self.loading) {
	                        $self.trigger('loaded');
	                        if (video.paused) {} else {
	                            $self.trigger('controlls.hide');
	                        }
	                    }
	                }
	            }, false);

	            video.addEventListener('canplaythrough', function () {
	                // console.log('canplaythrough')
	                // $self.trigger('canplaythrough')
	            }, false);

	            video.addEventListener('playing', function () {
	                // console.log('playing')
	            }, false);
	            video.addEventListener('ended', function () {
	                $self.trigger('ended');
	            }, false);

	            video.addEventListener('seeking', function () {
	                $self.trigger('waiting');
	            }, false);

	            video.addEventListener('seeked', function () {}, false);

	            video.addEventListener('play', function () {
	                $self.trigger('controlls.delayhide');
	            }, false);

	            video.addEventListener('pause', function () {
	                $self.trigger('controlls.show');
	                clearTimeout(self.ctrlsHideTimer);
	            }, false);

	            video.addEventListener('progress', function (ev) {}, false);

	            // video.addEventListener('durationchange', type, false);
	            // video.addEventListener('fullscreenchange', type, false);
	            video.addEventListener('error', function () {
	                // console.log('error')
	            }, false);

	            video.addEventListener('suspend', function () {
	                // console.log('suspend')
	                // $self.trigger('waiting');
	            }, false);

	            video.addEventListener('abort', function () {
	                // console.log('abort');
	            }, false);

	            video.addEventListener('emptied', function () {
	                // console.log('emptied')
	            }, false);

	            video.addEventListener('stalled', function () {
	                // console.log('stalled')
	                // 如果已经点击播放了，再出现stalled则触发waiting事件
	                if (self.firstplay) {
	                    $self.trigger('waiting');
	                }
	            }, false);

	            video.addEventListener('loadeddata', function () {
	                // console.log('loadeddata')
	            }, false);

	            video.addEventListener('loadedmetadata', function () {
	                var $volumebar = self.wrapper.find('.qhv-volumebar .qhv-sliderbar');
	                self.updateSliderbar($volumebar, self.volume * $volumebar.width() - $volumebar.find('.qhv-slider').width() / 2);
	                self.setDuration(formatTime.format(self.video.duration));
	                self.updatePlayTime(self.video.duration);
	                self.on();
	            }, false);

	            // video.addEventListener('ratechange', type, false);
	            // video.addEventListener('volumechange', type, false);
	            // video.addEventListener('texttrackchange', type, false);

	            video.addEventListener('posterchange', function () {
	                // console.log('posterchange')
	            }, false);
	        }
	    }]);

	    return Video;
	}();

	window.Video = Video;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(6)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./video.css", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./video.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(3)();
	// imports


	// module
	exports.push([module.id, "qhvdiv {\r\n    display: block;\r\n}\r\n\r\n.qhv-v-box video::-webkit-media-controls-enclosure {\r\n    display: none !important;\r\n}\r\n\r\n.qhv-v-box {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 100%;\r\n    font-size: 16px;\r\n}\r\n\r\n.qhv-v-box video {\r\n    position: relative;\r\n}\r\n\r\n.qhv-overlay {\r\n    width: 100%;\r\n    height: 100%;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    z-index: 2147483648;\r\n}\r\n\r\n.qhv-v-box .qhv-ctrls-box {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: -webkit-box;\r\n    -webkit-box-flex: 1;\r\n}\r\n\r\n.qhv-v-box .qhv-ctrls {\r\n    width: 100%;\r\n    height: 2.5em;\r\n    padding: .625em;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n    position: absolute;\r\n    left: 0;\r\n    bottom: 0;\r\n    z-index: 2147483648;\r\n    background: rgba(0, 0, 0, .4);\r\n    opacity: 0;\r\n    font-size: .74em;\r\n}\r\n\r\n.qhv-v-box .qhv-ctrls-box .qhv-playpausebtn {\r\n    width: 1em;\r\n    height: 1em;\r\n    color: #FFF;\r\n    font-size: 1em;\r\n    background: url(" + __webpack_require__(4) + ") no-repeat;\r\n}\r\n\r\n\r\n\r\n.qhv-v-box .qhv-ctrls-box .qhv-play-btn {\r\n    background-position: 0 0;\r\n}\r\n\r\n.qhv-v-box .qhv-ctrls-box .qhv-pause-btn {\r\n    background-position: 0 -16px;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar {\r\n    display: -webkit-box;\r\n    -webkit-box-flex: 1;\r\n    padding-left: .625em;\r\n}\r\n\r\n.qhv-v-box .qhv-slider-bg,\r\n.qhv-v-box .qhv-slider-buffer {\r\n    height: 100%;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n}\r\n\r\n.qhv-v-box .qhv-slider-bg {\r\n    border-radius: .5em;\r\n    background-color: #fff;\r\n}\r\n\r\n.qhv-v-box .qhv-slider-buffer {\r\n    background-color: #999;\r\n    border-radius: .5em;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar .qhv-sliderbar {\r\n    width: 100%;\r\n    height: .625em;\r\n    padding-top: .25em;\r\n    position: relative;\r\n    border: .0625em solid #aaa;\r\n    border-radius: .5em;\r\n    background: #333;\r\n    margin-top: .0625em;\r\n    -webkit-box-flex: 1;\r\n    display: -webkit-box;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar .qhv-slider {\r\n    width: 2em;\r\n    height: 1em;\r\n    position: absolute;\r\n    top: -0.125em;\r\n    left: 0;\r\n    background-color: #fff;\r\n    border-radius: .5em;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar .qhv-duration,\r\n.qhv-v-box .qhv-progressbar .qhv-current-time,\r\n.qhv-v-box .qhv-progressbar .qhv-sep {\r\n    color: #fff;\r\n    max-width: 4em;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar .qhv-current-time {\r\n    padding-left: .625em;\r\n}\r\n\r\n\r\n\r\n/*声音条*/\r\n\r\n.qhv-v-box .qhv-volumebar {\r\n    width: 1em;\r\n    height: 8.25em;\r\n    position: absolute;\r\n    left: 1em;\r\n    top: 50%;\r\n    margin-top: -4.125em;\r\n}\r\n\r\n.qhv-v-box .qhv-volumebar .qhv-volume-icon {\r\n    width: 1em;\r\n    height: 1em;\r\n    margin-bottom: .5em;\r\n    margin-top: .5em;\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    background: url(" + __webpack_require__(4) + ") no-repeat -16px -16px;\r\n}\r\n\r\n.qhv-v-box .qhv-volumebar .qhv-volume-muted {\r\n    background-position: -16px 0;\r\n}\r\n\r\n.qhv-v-box .qhv-volumebar .qhv-v-sliderbar {\r\n    width: .25em;\r\n    height: 6.25em;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 50%;\r\n    margin-left: -.125em;\r\n    background: #fff;\r\n}\r\n\r\n.qhv-v-box .qhv-volumebar .qhv-v-slider {\r\n    width: 100%;\r\n    height: 50%;\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    background-color: red;\r\n}\r\n\r\n\r\n/*全屏按钮*/\r\n\r\n.qhv-v-box .qhv-screen {\r\n    color: #fff;\r\n    padding-left: .625em;\r\n}\r\n\r\n\r\n/*视频上的暂停播放按钮*/\r\n\r\n.qhv-overlay-btn {\r\n    width: 3.125em;\r\n    height: 3.125em;\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    margin-top: -1.5625em;\r\n    margin-left: -1.5625em;\r\n}\r\n\r\n.qhv-overlay-btn .qhv-playpausebtn {\r\n    width: 100%;\r\n    height: 100%;\r\n    background: url(" + __webpack_require__(5) + ") no-repeat;\r\n    background-size: cover;\r\n}\r\n.qhv-overlay-btn .qhv-loading {\r\n    background-color: #fff;\r\n    width: 100%;\r\n    height: 100%;\r\n    border-radius: 100%;\r\n    -webkit-animation-fill-mode: both;\r\n    animation-fill-mode: both;\r\n    border: .5em solid #fff;\r\n    border-bottom-color: transparent;\r\n    background: transparent !important;\r\n    -webkit-animation: rotate 0.75s 0s linear infinite;\r\n    animation: rotate 0.75s 0s linear infinite;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n}\r\n\r\n@keyframes rotate {\r\n    0% {\r\n        -webkit-transform: rotate(0deg);\r\n        transform: rotate(0deg);\r\n    }\r\n    50% {\r\n        -webkit-transform: rotate(180deg);\r\n        transform: rotate(180deg);\r\n    }\r\n    100% {\r\n        -webkit-transform: rotate(360deg);\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\n.qhv-overlay-btn .qhv-play-btn {\r\n    background-position: 0 0;\r\n}\r\n\r\n.qhv-overlay-btn .qhv-pause-btn {\r\n    background-position: 0 -3.125em;\r\n}\r\n", ""]);

	// exports


/***/ },
/* 3 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,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"

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAADICAMAAAAp4rTzAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDE0IDc5LjE1MTQ4MSwgMjAxMy8wMy8xMy0xMjowOToxNSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDo0ODBEREVDNkZGQjUxMUU1QThGNkNGN0M4QTM4OUVDNiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDo0ODBEREVDN0ZGQjUxMUU1QThGNkNGN0M4QTM4OUVDNiI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjQ4MERERUM0RkZCNTExRTVBOEY2Q0Y3QzhBMzg5RUM2IiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjQ4MERERUM1RkZCNTExRTVBOEY2Q0Y3QzhBMzg5RUM2Ii8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+LePlbAAAAE5QTFRF/////v7+/f39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"

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var media = obj.media;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	/**
	 * 创建自定义标签
	 * @return {[type]} [description]
	 */
	(function () {
	    function createElem(elem) {
	        document.createElement(elem);
	    }
	    var customElem = 'qhvdiv,qhvheader,qhvsection,qhvarticle,qhva,qhvspan,qhvuspan,qhvp,qhvstrong'.split(',');
	    customElem.forEach(function (elem) {
	        createElem(elem);
	    });
	})();

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	var FormatTime = function () {
		function FormatTime() {
			_classCallCheck(this, FormatTime);
		}

		_createClass(FormatTime, [{
			key: 'second',
			value: function second(time) {
				return this.zero(time);
			}
		}, {
			key: 'minute',
			value: function minute(time) {
				var t = time / 60;
				return this.zero(t);
			}
		}, {
			key: 'hour',
			value: function hour(time) {
				var t = time / 3600;
				return this.zero(t);
			}
		}, {
			key: 'zero',
			value: function zero(num) {
				num = parseInt(num);
				return num * 1 > 9 ? num + '' : '0' + num;
			}
		}, {
			key: 'format',
			value: function format(time) {
				var hour = 0,
				    minute = 0,
				    second = 0;
				hour = this.hour(time);
				time %= 3600;
				minute = this.minute(time);
				time %= 60;
				second = this.second(time);

				if (hour === '00') {
					return minute + ':' + second;
				}
				return hour + ':' + minute + ':' + second;
			}
		}]);

		return FormatTime;
	}();

	var formatTime = new FormatTime();
	module.exports = formatTime;

/***/ },
/* 9 */
/***/ function(module, exports) {

	"use strict";

	module.exports = function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
			window.setTimeout(callback, 24);
		};
	}();

/***/ }
/******/ ]);