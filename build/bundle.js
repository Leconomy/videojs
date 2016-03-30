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
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

	var _formatTime = __webpack_require__(1);

	var _requestAnimate = __webpack_require__(6);

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	__webpack_require__(2);

	var Video = function () {
		function Video(wrapper, options) {
			_classCallCheck(this, Video);

			var self = this;

			this.wrapper = wrapper;
			self.options = $.extend({
				sources: [],
				autoPlay: false
			}, options);
			self.video = null;
			self.videoId = 'ctm-v-' + +new Date();
			self.volume = 0.5;
			this.init();
		}

		_createClass(Video, [{
			key: 'init',
			value: function init() {
				var self = this;

				self.renderVideo();
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
				    autoPlay = options.autoPlay ? ' autoPlay' : '';

				options.sources.forEach(function (v, i) {
					source += '<source src="' + v + '"></source>';
				});

				video = '<div class="ctm-v-box">\n\t\t\t\t\t<video width="100%" id="' + self.videoId + '">' + source + '您的浏览器不支持video标签</video>\n\t\t\t\t\t<div class="ctm-ctrls">\n\t\t\t\t\t\t<div class="ctm-ctrl ctm-playbtn">||</div>\n\t\t\t\t\t\t<div class="ctm-ctrl ctm-progressbar">\n\t\t\t\t\t\t\t<div class="ctm-sliderbar ctm-p-sliderbar">\n\t\t\t\t\t\t\t\t<div class="ctm-slider-bg"></div>\n\t\t\t\t\t\t\t\t<div class="ctm-slider ctm-p-slider"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t\t<div class="ctm-duration"></div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="ctm-ctrl ctm-volumebar">\n\t\t\t\t\t\t\t<div class="ctm-volume-icon"></div>\n\t\t\t\t\t\t\t<div class="ctm-sliderbar ctm-v-sliderbar">\n\t\t\t\t\t\t\t\t<div class="ctm-slider-bg"></div>\n\t\t\t\t\t\t\t\t<div class="ctm-slider ctm-v-slider"></div>\n\t\t\t\t\t\t\t</div>\n\t\t\t\t\t\t</div>\n\t\t\t\t\t\t<div class="ctm-ctrl ctm-screen ctm-fullscreen">全屏</div>\n\t\t\t\t\t</div>\n\t\t\t\t</div>';

				$(video).appendTo(self.wrapper);

				self.video = document.getElementById(self.videoId);
				self.video.oncanplay = function () {
					self.video.volume = self.volume;
					self.renderControls();
				};
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
				var $volumebar = self.wrapper.find('.ctm-volumebar .ctm-sliderbar');
				self.updateSliderbar($volumebar, self.volume * $volumebar.width() - $volumebar.find('.ctm-slider').width() / 2);
				self.wrapper.find('.ctm-ctrls').css('opacity', 1);
				self.updatePlayTime(self.video.duration);
				self.on();
				self.addListener();
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
				self.wrapper.find('.ctm-duration').html(_formatTime.formatTime.format(time));
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
				sliderbar.find('.ctm-slider').css('left', l);
				sliderbar.find('.ctm-slider-bg').width(l);
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
				var $progressbar = self.wrapper.find('.ctm-progressbar .ctm-sliderbar');
				var barW = $progressbar.width();
				var $slider = $progressbar.find('.ctm-slider');
				var sliderW = $slider.width();
				var sliderL = $progressbar.offset().left + sliderW / 2;
				var progressMax = barW - sliderW;
				var progressMin = 0;
				// 声音
				var $volumebar = self.wrapper.find('.ctm-volumebar .ctm-sliderbar');
				var vbarW = $volumebar.width();
				var $vslider = $volumebar.find('.ctm-slider');
				var vsliderW = $vslider.width();
				var vsliderL = $volumebar.offset().left + vsliderW / 2;
				var volumeMax = vbarW - vsliderW;
				var volumeMin = 0;

				var pStartX = 0;
				var pStartL = 0;
				var vStartX = 0;
				var vStartL = 0;

				// 点击播放暂停按钮
				self.wrapper.on('click', '.ctm-playbtn,#' + self.videoId, function (ev) {

					if (video.paused) {
						video.play();
					} else {
						video.pause();
					}
				})
				// 点击声音静音按钮
				.on('click', '.ctm-volume-icon', function (ev) {

					if (video.muted) {
						video.volume = self.volume;
						self.updateSliderbar($volumebar, self.volume * vbarW - vsliderW / 2);
						video.muted = false;
					} else {
						video.volume = 0;
						self.updateSliderbar($volumebar, 0);
						video.muted = true;
					}
				})
				// 点击全屏按钮
				.on('click', '.ctm-fullscreen', function (ev) {

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
				}).on('click', '.ctm-exit-fullscreen', function (ev) {
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
				.on('click', '.ctm-p-sliderbar', function (ev) {

					var offset = ev.clientX - sliderL;

					offset = offset < progressMin ? progressMin : offset;
					offset = offset > progressMax ? progressMax : offset;
					self.updateSliderbar($(this), offset);
					video.currentTime = offset / progressMax * duration;
				})
				// 点击声音条
				.on('click', '.ctm-v-sliderbar', function (ev) {

					var offset = ev.clientX - vsliderL;

					offset = offset < volumeMin ? volumeMin : offset;
					offset = offset > volumeMax ? volumeMax : offset;
					self.updateSliderbar($(this), offset);
					self.volume = video.volume = offset / volumeMax;
				})
				// 进度条滑块
				.on('touchstart', '.ctm-p-slider', function (ev) {
					ev.stopPropagation();
					pStartX = ev.touches[0].screenX;
					pStartL = parseInt($(this).css('left'));
				}).on('touchmove', '.ctm-p-slider', function (ev) {
					ev.stopPropagation();

					var offset = pStartL + ev.touches[0].screenX - pStartX;

					offset = offset < progressMin ? progressMin : offset;
					offset = offset > progressMax ? progressMax : offset;
					self.updateSliderbar($(this).closest('.ctm-sliderbar'), offset);
					video.currentTime = offset / progressMax * duration;
				})

				// 声音条滑块
				.on('touchstart', '.ctm-v-slider', function (ev) {
					ev.stopPropagation();
					vStartX = ev.touches[0].screenX;
					vStartL = parseInt($(this).css('left'));
				}).on('touchmove', '.ctm-v-slider', function (ev) {
					ev.stopPropagation();

					var offset = vStartL + ev.touches[0].screenX - vStartX;

					offset = offset < volumeMin ? volumeMin : offset;
					offset = offset > volumeMax ? volumeMax : offset;
					self.updateSliderbar($(this).closest('.ctm-sliderbar'), offset);
					self.volume = video.volume = offset / volumeMax;
				});
			}

			/**
	   * 监听video自身的一些事件
	   */

		}, {
			key: 'addListener',
			value: function addListener() {

				var self = this;
				var video = self.video;
				var duration = video.duration;
				var $progressbar = self.wrapper.find('.ctm-progressbar .ctm-sliderbar');
				var $sliderbar = $progressbar.find('.ctm-slider');
				var max = $progressbar.width() - $sliderbar.width();
				var $screen = self.wrapper.find('.ctm-screen');

				function toggleScreen(type) {
					if (type === 1) {
						$screen.removeClass('ctm-fullscreen').addClass('ctm-exit-fullscreen');
						return;
					}
					$screen.addClass('ctm-fullscreen').removeClass('ctm-exit-fullscreen');
				}

				// 视频播放的进度
				video.addEventListener('timeupdate', function (ev) {
					self.updatePlayTime(video.currentTime);
					self.updateSliderbar($progressbar, video.currentTime / duration * max);
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
			}
		}]);

		return Video;
	}();

	window.Video = Video;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

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
	exports.formatTime = formatTime;

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(3);
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
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(4)();
	// imports


	// module
	exports.push([module.id, ".ctm-v-box video::-webkit-media-controls-enclosure {\r\n  display:none !important;\r\n}\r\n.ctm-v-box{\r\n\tposition: relative;\r\n\twidth: 100%;\r\n}\r\n.ctm-v-box .ctm-ctrls {\r\n\twidth: 100%;\r\n\theight: 40px;\r\n\tposition: absolute;\r\n\tleft: 0;\r\n\ttop: 100%;\r\n\tz-index: 2147483648;\r\n\tbackground: rgba(0, 0, 0, .8);\r\n\topacity: 0;\r\n}\r\n.ctm-v-box .ctm-ctrl {\r\n\tfloat: left;\r\n\tmargin-top: 4px;\r\n}\r\n.ctm-v-box .ctm-playbtn{\r\n\twidth: 20px;\r\n\theight: 20px;\r\n\tcolor: #FFF;\r\n}\r\n\r\n.ctm-v-box .ctm-slider-bg{\r\n\theight: 100%;\r\n\tposition: absolute;\r\n\ttop: 0;\r\n\tleft: 0;\r\n\tbackground-color: #fff; \r\n}\r\n.ctm-v-box .ctm-progressbar .ctm-sliderbar{\r\n\twidth: 80px;\r\n\theight: 10px;\r\n\tposition: relative;\r\n\tborder: 1px solid #aaa;\r\n\tborder-radius: 4px;\r\n\tbackground: #333;\r\n\tdisplay: inline-block;\r\n}\r\n.ctm-v-box .ctm-progressbar .ctm-slider{\r\n\twidth: 20px;\r\n\theight: 16px;\r\n\tposition: absolute;\r\n\ttop: -2px;\r\n\tleft: 0;\r\n\tbackground-color: #fff;\r\n\tborder-radius: 40%;\r\n}\r\n.ctm-v-box .ctm-progressbar .ctm-duration{\r\n\tdisplay: inline-block;\r\n\tcolor: #fff;\r\n}\r\n.ctm-v-box .ctm-volumebar .ctm-volume-icon{\r\n\twidth: 10px;\r\n\theight: 10px;\r\n\tdisplay: inline-block;\r\n\tbackground: #fff;\r\n}\r\n.ctm-v-box .ctm-volumebar .ctm-sliderbar{\r\n\twidth: 80px;\r\n\theight: 10px;\r\n\tposition: relative;\r\n\tborder: 1px solid #aaa;\r\n\tborder-radius: 4px;\r\n\tbackground: #333;\r\n\tdisplay: inline-block;\r\n}\r\n.ctm-v-box .ctm-volumebar .ctm-slider{\r\n\twidth: 20px;\r\n\theight: 16px;\r\n\tposition: absolute;\r\n\ttop: -2px;\r\n\tbackground-color: #fff;\r\n\tborder-radius: 40%;\r\n}\r\n\r\n.ctm-v-box .ctm-screen {\r\n\tcolor: #fff;\r\n}", ""]);

	// exports


/***/ },
/* 4 */
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

	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function () {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || function (callback) {
			window.setTimeout(callback, 24);
		};
	}();

/***/ }
/******/ ]);