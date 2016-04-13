/**
 * 创建自定义标签
 * @return {[type]} [description]
 */
(function() {
    function createElem(elem) {
        document.createElement(elem);
    }
    var customElem = 'qhvdiv,qhvheader,qhvsection,qhvarticle,qhva,qhvspan,qhvuspan,qhvp,qhvstrong'.split(',');
    customElem.forEach(function(elem) {
        createElem(elem);
    })
})();