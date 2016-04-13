'use strict'
class Fullscreen() {
    constructor(video, $screen) {
        this.video = video;
        this.$screen = $screen;
        this.on();
    }

    toggleScreen(type) {
        var self = this;
        if (type === 1) {
            self.$screen.removeClass('qhv-fullscreen').addClass('qhv-exit-fullscreen');
            return;
        }
        self.$screen.addClass('qhv-fullscreen').removeClass('qhv-exit-fullscreen');
    }

    on() {
        let self = this;
        const video = self.video;
        video.addEventListener('fullscreenchange', self.fullscreenchange.bind(this, self), false);
        video.addEventListener('webkitfullscreenchange', self.webkitfullscreenchange.bind(this, self), false);
        video.addEventListener('msfullscreenchange', self.msfullscreenchange.bind(this, self), false);
        video.addEventListener('mozfullscreenchange', self.mozfullscreenchange.bind(this, self), false);
        video.addEventListener('ofullscreenchange', self.ofullscreenchange.bind(this, self), false);
    }

    fullscreenchange() {

        if (document.fullscreenElement) {
            this.toggleScreen(1);
        } else {
            this.toggleScreen(0);
        }

    }

    webkitfullscreenchange{

        if (document.webkitFullscreenElement) {
            this.toggleScreen(1);
        } else {
            this.toggleScreen(0);
        }

    }

    msfullscreenchange{

        if (document.msFullscreenElement) {
            this.toggleScreen(1);
        } else {
            this.toggleScreen(0);
        }

    }

    mozfullscreenchange{

        if (document.mozFullscreenElement) {
            this.toggleScreen(1);
        } else {
            this.toggleScreen(0);
        }

    }

    ofullscreenchange{

        if (document.oFullscreenElement) {
            this.toggleScreen(1);
        } else {
            this.toggleScreen(0);
        }

    }
}
