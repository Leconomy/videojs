var UA = require('./userAgent');
function GetVideoUI() {

}
/**
 * 拼接video的sources的字符串
 * @param  {Array} sourcesArr 配置的sources的数组
 * @return {String}            sources的字符串
 */
GetVideoUI.prototype.pureSources = function(sourcesArr) {
    let sources = '';
    sourcesArr.forEach(function(v) {
        sources += `<source src="${v}"></source>`;
    });
    return sources;
};
/**
 * 拼接video高宽的字符串
 * @param  {Number} width  高
 * @param  {Number} height 宽
 * @return {String}        高宽拼接后的字符串
 */
GetVideoUI.prototype.pureVideoWH = function(width, height) {

    if(!height) {
        return ` width="${width}"`;
    }

    if (height) {
        return ` width="${width}" height="${height}"`;
    }


    return '';
};
/**
 * 拼接v-box高宽的字符串
 * @param  {Number} width  高
 * @param  {Number} height 宽
 * @return {String}        高宽拼接后的字符串
 */
GetVideoUI.prototype.pureBoxWH = function(width, height) {
    if (!height) {
        return ` style="width:${width}px;"`;
    }
    if (width && height) {
        return ` style="width:${width}px;height:${height}px"`;
    }
    return '';
};
/**
 * 拼接video的poster字符串
 * @param  {String} poster poster的地址
 * @return {String}        拼接后的字符串
 */
GetVideoUI.prototype.purePoster = function(poster) {
    if (poster) {
        return `poster=${poster}`;
    }
    return '';
};
/**
 * 拼接自定义控制条字符串
 * @param  {Boolean} isIOS  是不是ios系统
 * @return {String}        拼接后的字符串
 */
GetVideoUI.prototype.pureCtrls = function(isIOS) {
    if (!isIOS) {
        return `<qhvdiv class="qhv-ctrls">
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
                </qhvdiv>`;
    }

    return '';
};

GetVideoUI.prototype.purePlaybtn = function() {

    return `<qhvdiv class="qhv-overlay-btn">
                <qhvdiv class="qhv-playpausebtn qhv-play-btn"></qhvdiv> 
            </qhvdiv>`;

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
GetVideoUI.prototype.getVideo = function(videoId = 'video00000', src = '', sources = [], width = window.innerWidth, height = 0, poster = '') {

    let self = this;
    let isIOS = UA.isIOS;
    let source = self.pureSources(sources);
    let videoWH = self.pureVideoWH(width, height);
    let boxWH = self.pureBoxWH(width, height);
    let ctrls = self.pureCtrls(isIOS);
    let playbtn = self.purePlaybtn();

        poster = self.purePoster(poster);

    return `<qhvdiv class="qhv-v-box" ${boxWH}>
                <video id="${videoId}" src="${src}" ${poster} ${videoWH}>${source}您的浏览器不支持video标签</video>
                <qhvdiv class="qhv-overlay">
                    ${ctrls}
                    ${playbtn}
                </qhvdiv>
            </qhvdiv>`;
};

let getVideoUI = new GetVideoUI();

module.exports = getVideoUI;