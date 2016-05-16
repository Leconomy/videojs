### 移动自定义视频播放器 采坑总结
1. 360浏览器里全屏自定义控件显示不出来
	解决方案：
	* 修改全屏时video默认的z-index值
	
	```javascript
	:-webkit-full-screen {
	    z-index: 21474836 !important;
	}
	```

	* 全屏时修改自定义控件的z-index值

	```javascript
	$overlay.add($ctrls).css('zIndex', 2147483647);
	```

2. 全屏时浏览器默认控件仍显示
	解决方案:
	* 添加css样式 [参考文章](https://css-tricks.com/custom-controls-in-html5-video-full-screen/)

	```javascript
	video::-webkit-media-controls-enclosure {
	    display: none !important;
	}
	```

3. 360浏览器全屏时中间默认显示一个播放暂停按钮
	解决方案:
	把自定义的按钮放大盖住它
4. 360浏览器全屏时顶部会显示一个"< xxxxxxxx "的东西，取的页面head元素下的title内容
	解决方案:
	设置title为空但是仍会显示一个"<", 建议保留默认显示
5. 为了彻底解决坑1,2,3,4可以采用video父元素全屏的方式
	[参考文章](http://stackoverflow.com/questions/7130397/how-do-i-make-a-div-full-screen)
	[参考文章](https://css-tricks.com/custom-controls-in-html5-video-full-screen/#comment-561384)
	但是在360浏览器下盖不住底部的状态栏
6. 360搜索app里采用video元素的全屏，自定义控件完全不显示，设置1，2完全无效
7. 360搜索app里裁员video父元素全屏，第一次点击播放按钮，会自动全屏且全屏后video的所有事件都捕获不到，
	退出全屏后，video的播放进度仍然为0且是暂停状态，有时候还会出现白屏状态。
	如果刷新页面，再此点击播放按钮，自动全屏后，会接着上次播放的位置继续播放而不是从0开始播放。
	第二次点击播放按钮便不会触发自动全屏。

8. UC浏览器、QQ浏览器都有自己默认的控件UI，完全去不掉，且自定义控件也覆盖不到它们的上面。
9. 事件play,canplay,canplaythrough时间不会在suspend,stalled,waiting事件触发后触发。
	如因为网速原因造成视频播放卡顿会触发stalled事件，此时可以添加自定义loading的UI，但是当网速缓冲能正常播放后
	不会触发play,canplay,canplaythrough任何一个事件去取消loading的状态
	解决方案：
	通过requestAnimationFrame去监听状态

	```javascript
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
                    return;
                }
                self.play();
            } else {
                self.waiting();
            }
        }
        // 如果是正常播放并且控件是显示的，那隔5s后隐藏控件
        if (lastVideoTime != video.currentTime) {
            if(self.ctrlsIsShow) {
                if(time - showTime >= 5000) {
                    self.hideCtrls();
                }
            }  else {
                showTime = time;
            }
        }
    }
	```

10. ios上点击播放按钮会自动全屏播放。google搜索结果给出的方案是在video上添加一个webkit-playsinline，经过实践证明不好使。
	同时也有人提出webkit-playsinline属性可以在app里配合Object-c一起使用才能有效。在safari浏览器里无解。
	[参考文章](http://www.cnblogs.com/moqiutao/p/4830438.html)
	
11. ios上自定义全屏按钮，调用webkitEnterFullscreen()进入全屏。在safari浏览器里起作用，在搜索app里会闪一下而无作用。
	[参考文章](https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/ControllingMediaWithJavaScript/ControllingMediaWithJavaScript.html#//apple_ref/doc/uid/TP40009523-CH3-SW20)
12. ios上声音只能通过设备去调控，video.volume总是返回1.
	[参考文章](https://developer.apple.com/library/safari/documentation/AudioVideo/Conceptual/Using_HTML5_Audio_Video/Device-SpecificConsiderations/Device-SpecificConsiderations.html)中的Volume Control in JavaScript。
	> On the desktop, you can set and read the volume property of an <audio> or <video> element. This allows you to set the element’s audio volume relative to the computer’s current volume setting. A value of 1 plays sound at the normal level. A value of 0 silences the audio. Values between 0 and 1 attenuate the audio.

	> This volume adjustment can be useful, because it allows the user to mute a game, for example, while still listening to music on the computer.

	> On iOS devices, the audio level is always under the user’s physical control. The volume property is not settable in JavaScript. Reading the volume property always returns 1.
13. 在ios里，如果设备设置成静音，搜索app里没有声音,打开其他网站的视频同样没有声音,调节声音大小也无效，但是safari却有声音。


