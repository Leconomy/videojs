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

	__webpack_require__(1);
	__webpack_require__(6);

	var UA = __webpack_require__(7);
	var formatTime = __webpack_require__(8);
	var requestAnimate = __webpack_require__(9);
	var fullscreen = __webpack_require__(10);
	var getVideoUI = __webpack_require__(11);
	var isIOS = UA.isIOS;
	var isAPP = UA.isApp;

	function Video(wrapper, options) {
	    var self = this;

	    self.wrapper = wrapper;

	    self.options = $.extend({
	        sources: [],
	        autoPlay: false,
	        width: window.innerWidth,
	        height: 0,
	        poster: '',
	        duration: 0
	    }, options);

	    self.video = null;
	    self.videoId = 'qhv-v-' + +new Date();
	    self.firstplay = false;
	    self.isEnded = false;
	    self.ctrlsIsShow = false;

	    self.init();
	}

	Video.prototype.init = function () {
	    var self = this;

	    self.renderVideo();
	};

	Video.prototype.handleWH = function (width, height) {
	    var winW = window.innerWidth,
	        calcH = 0,
	        calcW = 0,
	        scale = 1;

	    if (width >= winW) {
	        calcW = Math.min(width, winW);
	        calcH = winW / width * height;
	    } else {
	        calcW = Math.max(width, winW);
	        calcH = width / winW * height;
	    }

	    return { w: calcW, h: calcH };
	};
	/**
	 * 渲染video标签
	 * @return {[type]} [description]
	 */
	Video.prototype.renderVideo = function () {
	    var self = this,
	        options = self.options,
	        video = '',
	        oWH = null,
	        src = options.sources[0],
	        autoPlay = options.autoPlay ? ' autoPlay' : '';

	    oWH = self.handleWH(options.width, options.height);
	    video = getVideoUI.getVideo(self.videoId, src, options.sources, oWH.w, oWH.h, options.poster);

	    $(video).appendTo(self.wrapper);

	    self.video = document.getElementById(self.videoId);
	    $(self.video).ready(function () {
	        self.renderControls();
	    });

	    // video加载失败的事件
	    self.addErrorListener();

	    if (isIOS) {
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

	Video.prototype.setDuration = function () {
	    var duration = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	    var self = this;
	    self.wrapper.find('.qhv-duration').html(duration);
	};
	/**
	 * 渲染自定义控件
	 * @return {[type]} [description]
	 */
	Video.prototype.renderControls = function () {
	    var self = this;
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
	Video.prototype.updatePlayTime = function (time) {
	    var self = this;
	    self.wrapper.find('.qhv-current-time').html(formatTime.format(time));
	};
	/**
	 * 更新滑块条位置
	 * @param  {Number} l 进度条位置
	 * @param  {Object} sliderbar 需要更新滑块的对象
	 * @return {[type]}   [description]
	 */
	Video.prototype.updateSliderbar = function (sliderbar, l) {

	    var self = this;
	    var $slider = sliderbar.find('.qhv-slider');
	    $slider.css('left', l);
	    sliderbar.find('.qhv-slider-bg').width(l + $slider.width() / 2);
	};
	/**
	 * 计算已经缓冲的进度
	 * @return {[type]} [description]
	 */
	Video.prototype.buffer = function () {
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
	};
	/**
	 * android下video加载失败的事件
	 */
	Video.prototype.addErrorListener = function () {
	    var self = this;
	    var video = self.video;

	    var loadCount = 0;

	    video.addEventListener('error', function () {

	        if (++loadCount < 4) {
	            video.load();
	        }
	    }, false);
	};
	/**
	 * android下video加载元数据的事件
	 */
	Video.prototype.addAndroidLoadedDataListener = function () {
	    var self = this;
	    var video = self.video;
	    var duration = self.options.duration;
	    video.addEventListener('loadedmetadata', function () {

	        self.setDuration(formatTime.format(duration || self.video.duration));
	        self.updatePlayTime(duration || self.video.duration);
	        self.changeStatus();
	        self.addAndroidListener();

	        self.androidOn();
	    }, false);
	};
	/**
	 * android下才需要监听这些事件
	 */
	Video.prototype.addAndroidListener = function () {

	    var self = this;
	    var video = self.video;

	    var $progressbar = self.wrapper.find('.qhv-progressbar .qhv-sliderbar');
	    var $overlay = self.wrapper.find('.qhv-overlay');
	    var $ctrls = self.wrapper.find('.qhv-ctrls');
	    var $sliderbar = $progressbar.find('.qhv-slider');

	    video.addEventListener('loadstart', function () {
	        self.waiting();
	    }, false);

	    video.addEventListener('waiting', function () {
	        self.waiting();
	    }, false);

	    video.addEventListener('canplay', function () {
	        self.loaded();
	    }, false);

	    video.addEventListener('ended', function () {
	        self.ended();
	    }, false);

	    video.addEventListener('pause', function () {
	        self.showCtrls();
	    }, false);

	    video.addEventListener('seeking', function () {
	        self.waiting();
	    }, false);

	    video.addEventListener('seeked', function () {
	        video.paused ? self.paused() : self.play();
	    }, false);

	    video.addEventListener('canplaythrough', function () {}, false);

	    video.addEventListener('playing', function () {}, false);

	    video.addEventListener('play', function () {}, false);

	    video.addEventListener('progress', function (ev) {}, false);

	    // video.addEventListener('durationchange', type, false);
	    // video.addEventListener('fullscreenchange', type, false);

	    // 不能触发waiting事件，因为有时候播放正常，缓冲加载足够播放的数据，但是仍然会出现suspend的情况
	    video.addEventListener('suspend', function () {}, false);

	    video.addEventListener('abort', function () {}, false);

	    video.addEventListener('emptied', function () {}, false);

	    // 失速
	    video.addEventListener('stalled', function () {
	        // 如果已经点击播放了，再出现stalled则触发waiting事件
	        if (self.firstplay) {
	            self.waiting();
	        }
	    }, false);

	    // 视频播放的进度
	    video.addEventListener('timeupdate', function (ev) {

	        var max = $progressbar.width() - $sliderbar.width();
	        self.updatePlayTime(video.currentTime);
	        self.updateSliderbar($progressbar, video.currentTime / video.duration * max);
	    }, false);
	};
	/**
	 * android的事件绑定
	 * @return {[type]} [description]
	 */
	Video.prototype.androidOn = function () {
	    var self = this;

	    var video = self.video;
	    var wrapper = self.wrapper;

	    var duration = video.duration;

	    // 播放进度条
	    var $progressbar = wrapper.find('.qhv-progressbar .qhv-sliderbar');
	    var $poffset = $progressbar.offset() || { left: 0 };
	    var $slider = $progressbar.find('.qhv-slider');
	    var $sliderbg = $progressbar.find('.qhv-slider-bg');

	    var pStartX = 0;
	    var pStartL = 0;

	    var startY = 0;
	    var startX = 0;
	    var moveX = 0;

	    var moved = false;

	    // 点击播放暂停按钮
	    self.wrapper.on('touchstart', '.qhv-playpausebtn', function (ev) {

	        var $playpausebtn = wrapper.find('.qhv-playpausebtn');
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

	    self.wrapper.on('touchstart', '.qhv-overlay', function (ev) {

	        ev.stopPropagation();

	        if (ev.target !== this) {
	            return;
	        }

	        startY = ev.touches[0].screenY;
	        startX = ev.touches[0].screenX;

	        moved = false;
	        moveX = 0;
	    }).on('touchmove', '.qhv-overlay', function (ev) {

	        ev.stopPropagation();

	        var $this = $(this);

	        if (ev.target !== this || !$this.hasClass('qhv-full-screen')) {
	            return;
	        }

	        moveX = (ev.touches[0].screenX - startX) / 2 + $sliderbg.width();
	        moveX = Math.min($progressbar.width(), Math.max(0, moveX));

	        moved = true;
	    }).on('touchend', '.qhv-overlay', function (ev) {

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

	        video.currentTime = offset / progressMax * duration;

	        self.updateSliderbar($(this).closest('.qhv-sliderbar'), offset);
	    });
	};
	/**
	 * 添加自定义控件上的事件
	 * @return {[type]} [description]
	 */
	Video.prototype.on = function () {
	    var self = this;

	    var video = self.video;

	    // 点击播放暂停按钮
	    // 不能用touchstart事件,ios9.1下点击播放无反映。
	    self.wrapper.on('click', '.qhv-playpausebtn', function (ev) {
	        video.play();
	    });
	};
	Video.prototype.showCtrls = function () {
	    var self = this;
	    var $wrapper = self.wrapper;

	    var $overlay = $wrapper.find('.qhv-overlay');
	    var $ctrl = $overlay.find('.qhv-ctrls');
	    var $midbtn = $overlay.find('.qhv-overlay-btn');

	    $midbtn.show();
	    $ctrl.css('opacity', 1);
	    self.ctrlsIsShow = true;
	};

	Video.prototype.hideCtrls = function () {
	    var self = this;
	    var $wrapper = self.wrapper;

	    var $overlay = $wrapper.find('.qhv-overlay');
	    var $ctrl = $overlay.find('.qhv-ctrls');
	    var $midbtn = $overlay.find('.qhv-overlay-btn');

	    $midbtn.hide();
	    $ctrl.css('opacity', 0);
	    self.ctrlsIsShow = false;
	};

	Video.prototype.play = function () {
	    var self = this;

	    self.wrapper.find('.qhv-playpausebtn').removeClass('qhv-play-btn qhv-loading').addClass('qhv-pause-btn');
	};
	Video.prototype.paused = function () {
	    var self = this;

	    self.wrapper.find('.qhv-playpausebtn').removeClass('qhv-pause-btn qhv-loading').addClass('qhv-play-btn');
	};
	Video.prototype.loaded = function () {
	    var self = this;
	    var video = self.video;

	    if (video.paused) {
	        self.wrapper.find('.qhv-playpausebtn').addClass('qhv-play-btn').removeClass('qhv-loading');
	    } else {
	        self.wrapper.find('.qhv-playpausebtn').addClass('qhv-pause-btn').removeClass('qhv-loading');
	    }
	};
	Video.prototype.ended = function () {
	    var self = this;

	    self.showCtrls();
	    self.paused();
	    self.isEnded = true;
	};
	Video.prototype.waiting = function () {
	    var self = this;

	    self.showCtrls();
	    self.wrapper.find('.qhv-overlay-btn .qhv-playpausebtn').removeClass('qhv-play-btn qhv-pause-btn').addClass('qhv-loading');
	};

	/**
	 * 改变播放状态
	 * @return {[type]} [description]
	 */
	Video.prototype.changeStatus = function () {
	    var self = this,
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
	Video.prototype.fullscreen = function () {
	    var self = this;
	    var video = self.video;
	    var $wrapper = self.wrapper;
	    var wrapper = $wrapper[0];

	    var $ctrls = $wrapper.find('.qhv-ctrls');
	    var $overlay = $wrapper.find('.qhv-overlay');
	    var $screen = $wrapper.find('.qhv-screen');

	    var fullscreenElem = video;

	    function toggleScreen(type) {
	        if (type === 1) {
	            $overlay.add($ctrls).css('zIndex', 2147483647);
	            $overlay.addClass('qhv-full-screen');
	            $screen.removeClass('qhv-fullscreen').addClass('qhv-exit-fullscreen').html('退出');
	            return;
	        }
	        $overlay.hide().show().add($ctrls).css('zIndex', '');
	        $overlay.removeClass('qhv-full-screen');
	        $screen.addClass('qhv-fullscreen').removeClass('qhv-exit-fullscreen').html('全屏');
	        self.buffer();
	        if (self.isEnded) {
	            var $progressbar = self.wrapper.find('.qhv-progressbar .qhv-sliderbar');
	            var $sliderbar = $progressbar.find('.qhv-slider');
	            self.updateSliderbar($progressbar, $progressbar.width() - $sliderbar.width());
	        }
	    }

	    if (isAPP) {
	        fullscreenElem = wrapper;
	    }

	    fullscreen(self.wrapper, 'click', '.qhv-screen', fullscreenElem, toggleScreen);
	};

	/**
	 * video加载元数据的事件
	 */
	Video.prototype.addLoadedDataListener = function () {
	    var self = this;
	    var video = self.video;

	    video.addEventListener('loadedmetadata', function () {
	        self.on();
	    }, false);
	};

	window.Video = Video;

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(2);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(5)(content, {});
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
	exports.push([module.id, "qhvdiv {\r\n    display: block;\r\n}\r\n\r\n:-webkit-full-screen {\r\n    z-index: 21474836 !important;\r\n}\r\n/*全屏时隐藏控件  https://css-tricks.com/custom-controls-in-html5-video-full-screen/ */\r\n.qhv-v-box video::-webkit-media-controls-enclosure, .qhv-v-box video::-webkit-media-controls, .qhv-v-box video::-webkit-media-controls-start-playback-button {\r\n  display: none !important;\r\n}\r\n\r\n.qhv-v-box {\r\n    position: relative;\r\n    width: 100%;\r\n    height: 100%;\r\n    font-size: 16px;\r\n}\r\n\r\n.qhv-v-box video {\r\n    position: relative;\r\n    display: block;\r\n}\r\n\r\n.qhv-overlay {\r\n    width: 100%;\r\n    height: 100%;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    z-index: 2147483647;\r\n}\r\n\r\n.qhv-v-box .qhv-ctrls-box {\r\n    width: 100%;\r\n    height: 100%;\r\n    display: -webkit-box;\r\n    -webkit-box-flex: 1;\r\n    line-height: 1em;\r\n}\r\n.qhv-ios .qhv-v-box .qhv-ctrls, .qhv-ios .qhv-v-box .qhv-volumebar {\r\n    display: none;\r\n}\r\n.qhv-v-box .qhv-ctrls {\r\n    width: 100%;\r\n    height: 2.5em;\r\n    padding: .625em;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n    position: absolute;\r\n    left: 0;\r\n    bottom: 0;\r\n    background: rgba(0, 0, 0, .4);\r\n    opacity: 0;\r\n    font-size: .75em;\r\n}\r\n\r\n.qhv-v-box .qhv-ctrls-box .qhv-playpausebtn {\r\n    width: 1em;\r\n    height: 1em;\r\n    color: #FFF;\r\n    font-size: 1em;\r\n    position: relative;\r\n}\r\n\r\n.qhv-v-box .qhv-ctrls-box .qhv-play-btn:after {\r\n    width: 0;\r\n    height: 0;\r\n    border-top: .5em solid transparent;\r\n    border-left: 1em solid #fff;\r\n    border-bottom: .5em solid transparent;\r\n    content: '';\r\n    position: absolute;\r\n    left: 50%;\r\n    top: 50%;\r\n    margin-left: -.5em;\r\n    margin-top: -.5em;\r\n}\r\n.qhv-v-box .qhv-ctrls-box .qhv-pause-btn:after {\r\n    width: 1em;\r\n    height: 1em;\r\n    border-left: .4em solid #fff;\r\n    border-right: .4em solid #fff;\r\n    content: '';\r\n    position: absolute;\r\n    left: 50%;\r\n    top: 50%;\r\n    margin-left: -.5em;\r\n    margin-top: -.5em;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n}\r\n.qhv-v-box .qhv-progressbar {\r\n    display: -webkit-box;\r\n    -webkit-box-flex: 1;\r\n    padding-left: .833333334em;\r\n}\r\n\r\n.qhv-v-box .qhv-slider-bg,\r\n.qhv-v-box .qhv-slider-buffer {\r\n    height: 100%;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 0;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n}\r\n\r\n.qhv-v-box .qhv-slider-bg {\r\n    border-radius: .5em;\r\n    background-color: #fff;\r\n}\r\n\r\n.qhv-v-box .qhv-slider-buffer {\r\n    background-color: #999;\r\n    border-radius: .5em;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar .qhv-sliderbar {\r\n    width: 100%;\r\n    height: .625em;\r\n    padding-top: .25em;\r\n    position: relative;\r\n    border: 1px solid #aaa;\r\n    border-radius: .5em;\r\n    background: #333;\r\n    margin-top: .0625em;\r\n    -webkit-box-flex: 1;\r\n    display: -webkit-box;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar .qhv-slider {\r\n    width: 2em;\r\n    height: 1em;\r\n    position: absolute;\r\n    top: -.0625em;\r\n    left: 0;\r\n    background-color: #fff;\r\n    border-radius: .5em;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar .qhv-duration,\r\n.qhv-v-box .qhv-progressbar .qhv-current-time,\r\n.qhv-v-box .qhv-progressbar .qhv-sep {\r\n    color: #fff;\r\n    max-width: 4em;\r\n}\r\n\r\n.qhv-v-box .qhv-progressbar .qhv-current-time {\r\n    padding-left: .625em;\r\n}\r\n\r\n\r\n\r\n/*声音条*/\r\n\r\n.qhv-v-box .qhv-volumebar {\r\n    width: 1em;\r\n    height: 7.25em;\r\n    position: absolute;\r\n    left: 1em;\r\n    bottom: 1.5em;\r\n}\r\n\r\n.qhv-v-box .qhv-volumebar .qhv-volume-icon {\r\n    width: 1em;\r\n    height: 1em;\r\n    margin-bottom: .5em;\r\n    margin-top: .5em;\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    background: url(" + __webpack_require__(4) + ") no-repeat -16px -16px;\r\n}\r\n\r\n.qhv-v-box .qhv-volumebar .qhv-volume-muted {\r\n    background-position: -16px 0;\r\n}\r\n\r\n.qhv-v-box .qhv-volumebar .qhv-v-sliderbar {\r\n    width: .25em;\r\n    height: 5.25em;\r\n    position: absolute;\r\n    top: 0;\r\n    left: 50%;\r\n    margin-left: -.125em;\r\n    background: #fff;\r\n}\r\n\r\n.qhv-v-box .qhv-volumebar .qhv-v-slider {\r\n    width: 100%;\r\n    height: 50%;\r\n    position: absolute;\r\n    bottom: 0;\r\n    left: 0;\r\n    background-color: red;\r\n}\r\n\r\n\r\n/*全屏按钮*/\r\n\r\n.qhv-v-box .qhv-screen {\r\n    color: #fff;\r\n    padding-left: .625em;\r\n}\r\n\r\n\r\n/*视频上的暂停播放按钮*/\r\n\r\n.qhv-overlay-btn {\r\n    width: 3.125em;\r\n    height: 3.125em;\r\n    position: absolute;\r\n    top: 50%;\r\n    left: 50%;\r\n    margin-top: -1.5625em;\r\n    margin-left: -1.5625em;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n\r\n}\r\n\r\n\r\n.qhv-full-screen .qhv-overlay-btn {\r\n    width: 5em;\r\n    height: 5em;\r\n    margin-top: -2.5em;\r\n    margin-left: -2.5em;\r\n}\r\n\r\n.qhv-overlay-btn .qhv-playpausebtn {\r\n    width: 100%;\r\n    height: 100%;\r\n    /*background: url(../images/bigplay.png) no-repeat;\r\n    background-size: cover;*/\r\n    border: .5em solid #fff;\r\n    border-radius: 50%;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n    position: relative;\r\n}\r\n\r\n.qhv-overlay-btn .qhv-loading {\r\n    background-color: #fff;\r\n    width: 100%;\r\n    height: 100%;\r\n    border-radius: 100%;\r\n    -webkit-animation-fill-mode: both;\r\n    animation-fill-mode: both;\r\n    border: .5em solid #fff;\r\n    border-bottom-color: transparent;\r\n    background: transparent !important;\r\n    -webkit-animation: rotate 0.75s 0s linear infinite;\r\n    animation: rotate 0.75s 0s linear infinite;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n}\r\n\r\n@keyframes rotate {\r\n    0% {\r\n        -webkit-transform: rotate(0deg);\r\n        transform: rotate(0deg);\r\n    }\r\n    50% {\r\n        -webkit-transform: rotate(180deg);\r\n        transform: rotate(180deg);\r\n    }\r\n    100% {\r\n        -webkit-transform: rotate(360deg);\r\n        transform: rotate(360deg);\r\n    }\r\n}\r\n\r\n.qhv-overlay-btn .qhv-play-btn:after {\r\n    width: 0;\r\n    height: 0;\r\n    border-top: .8em solid transparent;\r\n    border-left: 1.4em solid #fff;\r\n    border-bottom: .8em solid transparent;\r\n    content: '';\r\n    position: absolute;\r\n    left: 50%;\r\n    top: 50%;\r\n    margin-left: -.5em;\r\n    margin-top: -.8em;\r\n}\r\n.qhv-overlay-btn .qhv-pause-btn:after {\r\n    width: 1em;\r\n    height: 1.4em;\r\n    border-left: .4em solid #fff;\r\n    border-right: .4em solid #fff;\r\n    content: '';\r\n    position: absolute;\r\n    left: 50%;\r\n    top: 50%;\r\n    margin-left: -.5em;\r\n    margin-top: -.7em;\r\n    box-sizing: border-box;\r\n    -webkit-box-sizing: border-box;\r\n}", ""]);

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
/* 6 */
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
/* 7 */
/***/ function(module, exports) {

	"use strict";

	var ua = navigator.userAgent.toLowerCase(),
	    isIOS = /iphone|ipad/.test(ua),
	    isAPP = !isIOS && ua.indexOf("mso_app") != -1;
	module.exports = {
	  isIOS: isIOS,
	  isAPP: isAPP
	};

/***/ },
/* 8 */
/***/ function(module, exports) {

	'use strict';

	var FormatTime = function FormatTime() {};
	FormatTime.prototype.second = function () {
	    var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	    return this.zero(time);
	};

	FormatTime.prototype.minute = function () {
	    var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	    var t = time / 60;
	    return this.zero(t);
	};

	FormatTime.prototype.hour = function () {
	    var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	    var t = time / 3600;
	    return this.zero(t);
	};

	FormatTime.prototype.zero = function () {
	    var num = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

	    num = parseInt(num);
	    return num * 1 > 9 ? num + '' : '0' + num;
	};
	FormatTime.prototype.format = function () {
	    var time = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];

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
	};

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

/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';

	var requestFullscreenArr = ['requestFullscreen', 'webkitEnterFullscreen', 'webkitRequestFullscreen', 'mozRequestFullscreen', 'msRequestFullscreen', 'oRequestFullscreen'];
	var exitFullscreenArr = ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen', 'oExitFullscreen'];
	var fullscreenchangeArr = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange', 'ofullscreenchange'];
	var fullscreenElementArr = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullscreenElement', 'msFullscreenElement', 'ofullscreenchange'];
	var Fullscreen = function Fullscreen(bindElem, event, selector, fullscreenElem) {
	    var callback = arguments.length <= 4 || arguments[4] === undefined ? function () {} : arguments[4];


	    // 点击让wrapper元素全屏而不是让video元素全屏
	    // 从而解决video全屏时native controls仍显示以及自定义控制条不显示的问题的
	    // http://stackoverflow.com/questions/7130397/how-do-i-make-a-div-full-screen
	    // https://css-tricks.com/custom-controls-in-html5-video-full-screen/#comment-561384
	    // 点击全屏按钮
	    bindElem.on(event, selector, function (ev) {
	        ev.stopPropagation();

	        var $_self = $(this);
	        var i = 0,
	            len = requestFullscreenArr.length,
	            requestFullscreen = void 0;

	        var k = 0,
	            l = exitFullscreenArr.length,
	            exitFullscreen = void 0;

	        if ($_self.hasClass('qhv-fullscreen')) {

	            for (; i < len; i++) {
	                requestFullscreen = requestFullscreenArr[i];
	                if (fullscreenElem[requestFullscreen]) {
	                    fullscreenElem[requestFullscreen]();
	                    return;
	                }
	            }
	        }

	        if ($_self.hasClass('qhv-exit-fullscreen')) {

	            for (; k < l; k++) {
	                exitFullscreen = exitFullscreenArr[k];
	                if (document[exitFullscreen]) {
	                    document[exitFullscreen]();
	                    return;
	                }
	            }
	        }
	    });

	    fullscreenElem.addEventListener('fullscreenchange', function (ev) {

	        if (document.fullscreenElement) {
	            callback(1);
	        } else {
	            callback(0);
	        }
	    }, false);

	    fullscreenElem.addEventListener('webkitfullscreenchange', function (ev) {

	        if (document.webkitFullscreenElement) {
	            callback(1);
	        } else {
	            callback(0);
	        }
	    }, false);

	    fullscreenElem.addEventListener('msfullscreenchange', function (ev) {

	        if (document.msFullscreenElement) {
	            callback(1);
	        } else {
	            callback(0);
	        }
	    }, false);

	    fullscreenElem.addEventListener('mozfullscreenchange', function (ev) {

	        if (document.mozFullscreenElement) {
	            callback(1);
	        } else {
	            callback(0);
	        }
	    }, false);

	    fullscreenElem.addEventListener('ofullscreenchange', function (ev) {

	        if (document.oFullscreenElement) {
	            callback(1);
	        } else {
	            callback(0);
	        }
	    }, false);
	};

	module.exports = Fullscreen;

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var UA = __webpack_require__(7);
	function GetVideoUI() {}
	/**
	 * 拼接video的sources的字符串
	 * @param  {Array} sourcesArr 配置的sources的数组
	 * @return {String}            sources的字符串
	 */
	GetVideoUI.prototype.pureSources = function (sourcesArr) {
	    var sources = '';
	    sourcesArr.forEach(function (v) {
	        sources += '<source src="' + v + '"></source>';
	    });
	    return sources;
	};
	/**
	 * 拼接video高宽的字符串
	 * @param  {Number} width  高
	 * @param  {Number} height 宽
	 * @return {String}        高宽拼接后的字符串
	 */
	GetVideoUI.prototype.pureVideoWH = function (width, height) {

	    if (!height) {
	        return ' width="' + width + '"';
	    }

	    if (height) {
	        return ' width="' + width + '" height="' + height + '"';
	    }

	    return '';
	};
	/**
	 * 拼接v-box高宽的字符串
	 * @param  {Number} width  高
	 * @param  {Number} height 宽
	 * @return {String}        高宽拼接后的字符串
	 */
	GetVideoUI.prototype.pureBoxWH = function (width, height) {
	    if (!height) {
	        return ' style="width:' + width + 'px;"';
	    }
	    if (width && height) {
	        return ' style="width:' + width + 'px;height:' + height + 'px"';
	    }
	    return '';
	};
	/**
	 * 拼接video的poster字符串
	 * @param  {String} poster poster的地址
	 * @return {String}        拼接后的字符串
	 */
	GetVideoUI.prototype.purePoster = function (poster) {
	    if (poster) {
	        return 'poster=' + poster;
	    }
	    return '';
	};
	/**
	 * 拼接自定义控制条字符串
	 * @param  {Boolean} isIOS  是不是ios系统
	 * @return {String}        拼接后的字符串
	 */
	GetVideoUI.prototype.pureCtrls = function (isIOS) {
	    if (!isIOS) {
	        return '<qhvdiv class="qhv-ctrls">\n                    <qhvdiv class="qhv-ctrls-box">\n                        <qhvdiv class="qhv-ctrl qhv-playpausebtn qhv-play-btn"></qhvdiv>\n                        <qhvdiv class="qhv-ctrl qhv-progressbar">\n                            <qhvdiv class="qhv-sliderbar qhv-p-sliderbar">\n                                <qhvdiv class="qhv-slider-buffer"></qhvdiv>\n                                <qhvdiv class="qhv-slider-bg"></qhvdiv>\n                                <qhvdiv class="qhv-slider qhv-p-slider"></qhvdiv>\n                            </qhvdiv>\n                            <qhvdiv class="qhv-current-time">00:00</qhvdiv>\n                            <qhvdiv class="qhv-sep">/</qhvdiv>\n                            <qhvdiv class="qhv-duration">00:00</qhvdiv>\n                        </qhvdiv>\n                        <qhvdiv class="qhv-ctrl qhv-screen qhv-fullscreen">全屏</qhvdiv>\n                    </qhvdiv>\n                </qhvdiv>';
	    }

	    return '';
	};

	GetVideoUI.prototype.purePlaybtn = function () {

	    return '<qhvdiv class="qhv-overlay-btn">\n                <qhvdiv class="qhv-playpausebtn qhv-play-btn"></qhvdiv> \n            </qhvdiv>';
	};

	/**
	 * 拼接video字符串
	 * @param  {String} videoId   video标签的id值
	 * @param  {String} src       video标签src值
	 * @param  {String} source    video标签下的source
	 * @param  {Number} width     video宽
	 * @param  {Number} height    video高
	 * @param  {String} poster    video标签的poster
	 * @param  {String} ctrls     自定义控制条
	 * @return {String}           拼接后的字符串
	 */
	GetVideoUI.prototype.getVideo = function () {
	    var videoId = arguments.length <= 0 || arguments[0] === undefined ? 'video00000' : arguments[0];
	    var src = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
	    var sources = arguments.length <= 2 || arguments[2] === undefined ? [] : arguments[2];
	    var width = arguments.length <= 3 || arguments[3] === undefined ? window.innerWidth : arguments[3];
	    var height = arguments.length <= 4 || arguments[4] === undefined ? 0 : arguments[4];
	    var poster = arguments.length <= 5 || arguments[5] === undefined ? '' : arguments[5];


	    var self = this;
	    var isIOS = UA.isIOS;
	    var source = self.pureSources(sources);
	    var videoWH = self.pureVideoWH(width, height);
	    var boxWH = self.pureBoxWH(width, height);
	    var ctrls = self.pureCtrls(isIOS);
	    var playbtn = self.purePlaybtn();

	    poster = self.purePoster(poster);

	    return '<qhvdiv class="qhv-v-box" ' + boxWH + '>\n                <video id="' + videoId + '" src="' + src + '" ' + poster + ' ' + videoWH + '>' + source + '您的浏览器不支持video标签</video>\n                <qhvdiv class="qhv-overlay">\n                    ' + ctrls + '\n                    ' + playbtn + '\n                </qhvdiv>\n            </qhvdiv>';
	};

	var getVideoUI = new GetVideoUI();

	module.exports = getVideoUI;

/***/ }
/******/ ]);