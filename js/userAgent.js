let ua = navigator.userAgent.toLowerCase(),
    isIOS = /iphone|ipad/.test(ua),
    isAPP = !isIOS && ua.indexOf("mso_app") != -1;
module.exports = {
	isIOS: isIOS,
	isAPP: isAPP
}