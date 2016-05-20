title: HTML5--video属性总结
speaker: 刘经济
transition: cards

[slide]

# HTML5--video属性总结
## 演讲者：刘经济

[slide]
#video常用属性 {:&.flexbox.vleft}

属性名   | 值       | 描述|
:---:    | :---:    | :---:
autoplay | true or false | 设置或返回视频就绪后是否自动播放
controls | true or false | 设置或返回视频是否显示控件
height   | pixels   | 设置或返回视频播放器的高度
width    | pixels   | 设置或返回视频播放器的宽度
loop     | true or false     | 设置或返回视频是否循环播放
preload  | auto metadata none  | 设置或返回视频是否自动加载.有此属性,视频在页面加载时进行加载,并预备播放.<br>如果有autoplay属性,则忽略该属性.
src      | url      | 播放视频资源的地址


[slide]
#video属性buffered {:&.flexbox.vleft}

获取视频的缓冲范围

返回一个TimeRanges对象，此对象保存缓存的时间范围

属性只读

Type                | Description      
:---                | :--- 
TimeRanges Object   | TimeRanges Object属性: <br> 	length 缓冲范围的个数 <br>  	start(index) 获取一个缓存范围开始位置 <br>  	end(index) 获取一个缓存范围结束位置 


[slide]
#video属性currentSrc {:&.flexbox.vleft}

property     | Details      
:---         | :--- 
currentSrc   | 返回视频当前播放的绝对路径


[slide]
#video属性currentTime {:&.flexbox.vleft}

property     | Details      
:---         | :--- 
currentTime  | 设置或返回视频当前播放时间


[slide]
#video属性defaultMuted {:&.flexbox.vleft}

property     | 值   | Details      
:---         | :--- | :--- 
defaultMuted | true or false | 设置视频默认是否是静音

__IE不支持此属性__



[slide]
#video属性defaultPlaybackRate {:&.flexbox.vleft}

property            | 值     | Details      
:---                | :---   | :--- 
defaultPlaybackRate | Number | 设置或返回视频默认的播放速度,并不是当前的播放速度

__Safari不支持此属性__



[slide]
#video属性duration  {:&.flexbox.vleft}

property  | Details      
:---      | :--- 
duration  | 返回视频的总长度，单位是秒

__只读属性__

__如果视频是流，则返回是Inf(Infinity)__


[slide]
#video属性ended  {:&.flexbox.vleft}

property  | Details      
:---      | :--- 
ended     | 返回视频是否播放结束


[slide]
#video属性muted  {:&.flexbox.vleft}

property  | Details      
:---      | :--- 
muted     | 设置或返回视频是否静音



[slide]
#video属性networkState  {:&.flexbox.vleft}

property         | Details      
:---             | :--- 
networkState     | 返回视频当前的网络状态 <br> · 0 = NETWORK_EMPTY - 视频还没初始化 <br> · 1 = NETWORK_IDLE - 视频激活且选择了一个资源，但是还没有加载 <br> · 2 = NETWORK_LOADING - 浏览器正在下载数据 <br> · 3 = NETWORK_NO_SOURCE - 没有找到资源



[slide]
#video属性playbackRate  {:&.flexbox.vleft}

property         | Details      
:---             | :--- 
playbackRate     | 设置或返回视频当前播放的速度

__区别与defaultPlaybackRate__



[slide]
#video属性played {:&.flexbox.vleft}

获取视频的已经播放的范围

返回一个TimeRanges对象，此对象保存播放过的时间范围

属性只读

Type                | Description      
:---                | :--- 
TimeRanges Object   | TimeRanges Object属性: <br> 	length 播放范围的个数 <br>  	start(index) 获取一个播放范围开始位置 <br>  	end(index) 获取一个播放范围结束位置 


[slide]
#video属性readyState  {:&.flexbox.vleft}

property         | Details      
:---             | :--- 
readyState       | 获取视频当前的就绪状态值 <br> · 0 = HAVE_NOTHING - 没有信息标识视频是否就绪 <br> · 1 = HAVE_METADATA - 元数据已经就绪 <br> · 2 = HAVE_CURRENT_DATA - 当前播放位置有效，但是没有足够的下一帧数据 <br> · 3 = HAVE_FUTURE_DATA - 至少能播放下一帧 <br> · 4 = HAVE_ENOUGH_DATA - 有足够的数据可以开始播放



[slide]
#video属性seekable {:&.flexbox.vleft}

获取视频可寻址的范围

返回一个TimeRanges对象，此对象保存可寻址的时间范围

不是流视频，是可寻址在任何地方即使视频没有缓冲

属性只读

Type                | Description      
:---                | :--- 
TimeRanges Object   | TimeRanges Object属性: <br> 	length 可寻址范围的个数 <br>  	start(index) 获取一个可寻址范围开始位置 <br>  	end(index) 获取一个可寻址范围结束位置 


[slide]
#video属性seeking  {:&.flexbox.vleft}

property         | Details      
:---             | :--- 
seeking          | 返回用户当前是否在寻址


[slide]
#video属性volume  {:&.flexbox.vleft}

property         | Details      
:---             | :--- 
volume           | 设置或返回视频的音量值
