'use strict'
let requestFullscreenArr = ['requestFullscreen', 'webkitRequestFullscreen', 'mozRequestFullscreen', 'msRequestFullscreen', 'oRequestFullscreen']
let exitFullscreenArr = ['exitFullscreen', 'webkitExitFullscreen', 'mozCancelFullScreen', 'msExitFullscreen', 'oExitFullscreen'];
let fullscreenchangeArr = ['fullscreenchange', 'webkitfullscreenchange', 'mozfullscreenchange', 'msfullscreenchange', 'ofullscreenchange'];
let fullscreenElementArr = ['fullscreenElement', 'webkitFullscreenElement', 'mozFullscreenElement', 'msFullscreenElement', 'ofullscreenchange'];
let Fullscreen = function(bindElem, event, selector, fullscreenElem, callback) {
    // 点击让wrapper元素全屏而不是让video元素全屏
    // 从而解决video全屏时native controls仍显示以及自定义控制条不显示的问题的
    // http://stackoverflow.com/questions/7130397/how-do-i-make-a-div-full-screen
    // https://css-tricks.com/custom-controls-in-html5-video-full-screen/#comment-561384
    // 点击全屏按钮
    bindElem.on(event, selector, function(ev) {
        ev.stopPropagation();

        let $_self = $(this);
        let i = 0,
            len = requestFullscreenArr.length,
            requestFullscreen;

        let k = 0,
            l = exitFullscreenArr.length,
            exitFullscreen;

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


    fullscreenElem.addEventListener('fullscreenchange', (ev) => {

        if (document.fullscreenElement) {
            callback(1);
        } else {
            callback(0);
        }

    }, false);

    fullscreenElem.addEventListener('webkitfullscreenchange', function(ev) {

        if (document.webkitFullscreenElement) {
            callback(1);
        } else {
            callback(0);
        }

    }, false);

    fullscreenElem.addEventListener('msfullscreenchange', (ev) => {

        if (document.msFullscreenElement) {
            callback(1);
        } else {
            callback(0);
        }

    }, false);

    fullscreenElem.addEventListener('mozfullscreenchange', (ev) => {

        if (document.mozFullscreenElement) {
            callback(1);
        } else {
            callback(0);
        }

    }, false);

    fullscreenElem.addEventListener('ofullscreenchange', (ev) => {

        if (document.oFullscreenElement) {
            callback(1);
        } else {
            callback(0);
        }

    }, false);
}

module.exports = Fullscreen;