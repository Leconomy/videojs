'use strict'

function Video(wrapper, options) {
    var self = this;

    this.wrapper = wrapper;
    self.options = $.extend({
        sources: [],
        autoPlay: false,
        width: window.innerWidth,
        height: 0,
        poster: ''
    }, options);
    self.video = null;
    self.videoId = 'qhv-v-' + +new Date();
    self.volume = 1;
    self.firstplay = false;
    self.isEnded = false;
    self.ctrlsIsShow = false;

    this.init();

}

Video.prototype.init = function() {
    var self = this;

    self.renderVideo();
};

/**
 * 渲染video标签
 * @return {[type]} [description]
 */
Video.prototype.renderVideo = function() {
    var self = this,
        options = self.options,
        video = '',
        src = options.sources[0],
        autoPlay = options.autoPlay ? ' autoPlay' : '';
    
    video = '<div class="qhv-v-box" style="width:320px;height:176px">' +
                '<video id="qhv-v-1463554003136" src="http://v.news.so.com/video/filter_video/sohu_20160401_103.mp4" width="320" height="176"></video>' +
                '<div class="qhv-overlay">' +
                    '<div class="qhv-overlay-btn" style="width: 40px; height: 40px;background-color:#000">' +
                        '<div class="qhv-playpausebtn qhv-pause-btn" style="width:100%; height:100%;border-radius: 50%"></div> ' +
                    '</div>' +
                '</div>' +
            '</div>';

    $(video).appendTo(self.wrapper);

    self.video = document.getElementById('qhv-v-1463554003136');

    $(self.video).ready(function() {
        self.renderControls();
        
    });
    self.video.addEventListener('loadedmetadata', function() {
        self.on();
    })


};


/**
 * 渲染自定义控件
 * @return {[type]} [description]
 */
Video.prototype.renderControls = function() {
    var self = this;
    if (self.options.autoPlay) {
        self.video.play();
        self.firstplay = true;
    }

    self.wrapper.find('.qhv-ctrls').css('opacity', 1);
};

/**
 * 添加自定义控件上的事件
 * @return {[type]} [description]
 */
Video.prototype.on = function() {
    var self = this;
    var video = self.video;

    // 点击播放暂停按钮
    self.wrapper.on('touchstart', '.qhv-playpausebtn', function(ev) {

            var $playpausebtn = self.wrapper.find('.qhv-playpausebtn');

            if (video.paused) {
                video.play();
                $playpausebtn.removeClass('qhv-play-btn').addClass('qhv-pause-btn');
            } else {
                video.pause();
                $playpausebtn.removeClass('qhv-pause-btn').addClass('qhv-play-btn');
            }

        })
    

};

window.Video = Video;
