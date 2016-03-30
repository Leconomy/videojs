'use strict'
require('../style/video.css');
import {formatTime} from './formatTime';
import {requestAnimate} from './requestAnimate';
class Video {
	constructor(wrapper, options) {
		const self = this;

		this.wrapper = wrapper;
		self.options = $.extend({
	    	sources:[],
	    	autoPlay: false
	    },options);
		self.video = null;
		self.videoId = 'ctm-v-' + +new Date();
		self.volume = 0.5;
	    this.init();
	}

	init() {
		const self = this;

		self.renderVideo();
		

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
			autoPlay = options.autoPlay ? ' autoPlay' : '';

		options.sources.forEach(function(v, i) {
			source += `<source src="${v}"></source>`;
		});

		video = `<div class="ctm-v-box">
					<video width="100%" id="${self.videoId}">${source}您的浏览器不支持video标签</video>
					<div class="ctm-ctrls">
						<div class="ctm-ctrl ctm-playbtn">||</div>
						<div class="ctm-ctrl ctm-progressbar">
							<div class="ctm-sliderbar ctm-p-sliderbar">
								<div class="ctm-slider-bg"></div>
								<div class="ctm-slider ctm-p-slider"></div>
							</div>
							<div class="ctm-duration"></div>
						</div>
						<div class="ctm-ctrl ctm-volumebar">
							<div class="ctm-volume-icon"></div>
							<div class="ctm-sliderbar ctm-v-sliderbar">
								<div class="ctm-slider-bg"></div>
								<div class="ctm-slider ctm-v-slider"></div>
							</div>
						</div>
						<div class="ctm-ctrl ctm-screen ctm-fullscreen">全屏</div>
					</div>
				</div>`;

		$(video).appendTo(self.wrapper);

		self.video = document.getElementById(self.videoId);
		self.video.oncanplay = function() {
			self.video.volume = self.volume;
			self.renderControls();
			
		};

	}
	/**
	 * 渲染自定义控件
	 * @return {[type]} [description]
	 */
	renderControls() {
		const self = this;
		if(self.options.autoPlay) {
			self.video.play();
		}
		let $volumebar = self.wrapper.find('.ctm-volumebar .ctm-sliderbar'); 
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
	updatePlayTime(time) {
		const self = this;
		self.wrapper.find('.ctm-duration').html(formatTime.format(time));
	}

	/**
	 * 更新滑块条位置
	 * @param  {Number} l 进度条位置
	 * @param  {Object} sliderbar 需要更新滑块的对象
	 * @return {[type]}   [description]
	 */
	updateSliderbar(sliderbar, l) {

		var self = this;
		sliderbar.find('.ctm-slider').css('left', l);
		sliderbar.find('.ctm-slider-bg').width(l);

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
		const $progressbar = self.wrapper.find('.ctm-progressbar .ctm-sliderbar');
		const barW = $progressbar.width();
		const $slider = $progressbar.find('.ctm-slider');
		const sliderW = $slider.width();
		const sliderL = $progressbar.offset().left + sliderW / 2 ;
		const progressMax = barW - sliderW;
		const progressMin = 0;
		// 声音
		const $volumebar = self.wrapper.find('.ctm-volumebar .ctm-sliderbar');
		const vbarW = $volumebar.width();
		const $vslider = $volumebar.find('.ctm-slider');
		const vsliderW = $vslider.width();
		const vsliderL = $volumebar.offset().left + vsliderW / 2;
		const volumeMax = vbarW - vsliderW;
		const volumeMin = 0;

		let pStartX = 0;
		let pStartL = 0;
		let vStartX = 0;
		let vStartL = 0;

		// 点击播放暂停按钮
		self.wrapper.on('click', `.ctm-playbtn,#${self.videoId}`, (ev) => {

			if(video.paused) {
				video.play();
			} else {
				video.pause();
			}

		})
		// 点击声音静音按钮
		.on('click', '.ctm-volume-icon', (ev) => {

			if(video.muted) {
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
		.on('click', '.ctm-fullscreen', (ev) => {

			if(video.webkitRequestFullscreen) {
				video.webkitRequestFullscreen();
			} else if(video.requestFullscreen) {
				video.requestFullscreen();
			} else if(video.mozRequestFullscreen) {
				video.mozRequestFullscreen();
			} else if(video.msRequestFullscreen) {
				video.msRequestFullscreen();
			} else if(video.oRequestFullscreen) {
				video.oRequestFullscreen();
			}

		})
		.on('click', '.ctm-exit-fullscreen', (ev) => {
			if(document.exitFullscreen) {
				document.exitFullscreen();
			} else if(document.mozCancelFullScreen) {
				document.mozCancelFullScreen();
			} else if(document.webkitExitFullscreen) {
				document.webkitExitFullscreen();
			} else if(document.oExitFullscreen) {
				document.oExitFullscreen();
			} else if(document.msExitFullscreen) {
				document.msExitFullscreen();
			}
		})
		// 点击播放进度条
		.on('click', '.ctm-p-sliderbar', function(ev) {
			
			let offset = ev.clientX - sliderL;

			offset = offset < progressMin ? progressMin : offset;
			offset = offset > progressMax ? progressMax : offset;
			self.updateSliderbar($(this), offset);
			video.currentTime = offset / progressMax * duration;

		})
		// 点击声音条
		.on('click', '.ctm-v-sliderbar', function(ev) {

			let offset = ev.clientX - vsliderL;

			offset = offset < volumeMin ? volumeMin : offset;
			offset = offset > volumeMax ? volumeMax : offset;
			self.updateSliderbar($(this), offset);
			self.volume = video.volume = offset / volumeMax;

		})
		// 进度条滑块
		.on('touchstart', '.ctm-p-slider', function(ev) {
			ev.stopPropagation();
			pStartX = ev.touches[0].screenX;
			pStartL = parseInt($(this).css('left'));

		})
		.on('touchmove', '.ctm-p-slider', function(ev) {
			ev.stopPropagation();
			
			let offset = pStartL + ev.touches[0].screenX - pStartX;

			offset = offset < progressMin ? progressMin : offset;
			offset = offset > progressMax ? progressMax : offset;
			self.updateSliderbar($(this).closest('.ctm-sliderbar'), offset);
			video.currentTime = offset / progressMax * duration;

		})
		
		// 声音条滑块
		.on('touchstart', '.ctm-v-slider', function(ev) {
			ev.stopPropagation();
			vStartX = ev.touches[0].screenX;
			vStartL = parseInt($(this).css('left'));
		})
		.on('touchmove', '.ctm-v-slider', function(ev) {
			ev.stopPropagation();
			
			let offset = vStartL + ev.touches[0].screenX - vStartX;

			offset = offset < volumeMin ? volumeMin : offset;
			offset = offset > volumeMax ? volumeMax : offset;
			self.updateSliderbar($(this).closest('.ctm-sliderbar'), offset);
			self.volume = video.volume = offset / volumeMax;

		});
		
	}



	/**
	 * 监听video自身的一些事件
	 */
	addListener() {
		
		const self = this;
		const video = self.video;
		const duration = video.duration;
		const $progressbar = self.wrapper.find('.ctm-progressbar .ctm-sliderbar');
		const $sliderbar = $progressbar.find('.ctm-slider');
		const max = $progressbar.width() - $sliderbar.width();
		const $screen = self.wrapper.find('.ctm-screen');

		function toggleScreen(type) {
			if(type === 1) {
				$screen.removeClass('ctm-fullscreen').addClass('ctm-exit-fullscreen');
				return;
			} 
			$screen.addClass('ctm-fullscreen').removeClass('ctm-exit-fullscreen');
		}

		// 视频播放的进度
		video.addEventListener('timeupdate', function(ev) {
			self.updatePlayTime(video.currentTime);
			self.updateSliderbar($progressbar, video.currentTime / duration * max);
		}, false);

		video.addEventListener('fullscreenchange', (ev) => {

			if(document.fullscreenElement) {
				toggleScreen(1);
			} else {
				toggleScreen(0);
			}

		}, false);

		video.addEventListener('webkitfullscreenchange', function(ev) {
			
			if(document.webkitFullscreenElement) {
				toggleScreen(1);
			} else {
				toggleScreen(0);
			}

		}, false);

		video.addEventListener('msfullscreenchange', (ev) => {

			if(document.msFullscreenElement) {
				toggleScreen(1);
			} else {
				toggleScreen(0);
			}

		}, false);

		video.addEventListener('mozfullscreenchange', (ev) => {

			if(document.mozFullscreenElement) {
				toggleScreen(1);
			} else {
				toggleScreen(0);
			}

		}, false);

		video.addEventListener('ofullscreenchange', (ev) => {

			if(document.oFullscreenElement) {
				toggleScreen(1);
			} else {
				toggleScreen(0);
			}

		}, false);

	}
}

window.Video = Video;