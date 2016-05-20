title: HTML5--video事件汇总
speaker: 刘经济
transition: cards

[slide]

# HTML5--video事件汇总
## 演讲者：刘经济

[slide]
#video事件abort {:&.flexbox.vleft}
触发机制：

+ 视频被放弃加载

+ 媒体数据被放弃加载时触发而且不是因为错误

__Windows7下IE11不支持__


[slide]
#video事件canplay {:&.flexbox.vleft}
触发机制：

+ 当浏览器能开始播放视频时即缓存足够时触发


[slide]
#video事件canplaythrough {:&.flexbox.vleft}
触发机制：

+ 当浏览器推算它能顺畅的播放视频而不必停止时触发

[slide]
#video事件canplaythrough {:&.flexbox.vleft}
触发机制：

+ 当视频总时长改变时触发(视频加载时，duration会由NaN变为实际的时长)


[slide]
#video事件emptied {:&.flexbox.vleft}
触发机制：

+ 当当前的播放列表为空时触发

[slide]
#video事件ended {:&.flexbox.vleft}
触发机制：

+ 当视频播放完毕时触发


[slide]
#video事件error {:&.flexbox.vleft}
触发机制：

+ 当视频加载时遇到错误时触发


[slide]
#video事件loadeddata {:&.flexbox.vleft}
触发机制：

+ 当当前帧的数据加载完成但又不无足够数据播放下一帧时触发


[slide]
#video事件loadedmetadata {:&.flexbox.vleft}
触发机制：

+ 当元数据已经加载时触发

[slide]
#video事件loadstart {:&.flexbox.vleft}
触发机制：

+ 当浏览器开始寻找视频时触发


[slide]
#video事件pause {:&.flexbox.vleft}
触发机制：

+ 当视频暂停时触发


[slide]
#video事件play {:&.flexbox.vleft}
触发机制：

+ 当视频已经开始播放或不再暂停时触发

[slide]
#video事件playing {:&.flexbox.vleft}
触发机制：

+ 当视频暂停或停止去缓冲后触发


[slide]
#video事件progress {:&.flexbox.vleft}
触发机制：

+ 当浏览器正在下载视频时触发


[slide]
#video事件ratechange {:&.flexbox.vleft}
触发机制：

+ 当视频播放的速度改变时触发


[slide]
#video事件seeked {:&.flexbox.vleft}
触发机制：

+ 当用户寻址结束时触发


[slide]
#video事件seeking {:&.flexbox.vleft}
触发机制：

+ 当用户开始寻址时触发


[slide]
#video事件stalled {:&.flexbox.vleft}
触发机制：

+ 当浏览器尝试去获取数据但是数据不可得的时候触发即卡顿


[slide]
#video事件suspend {:&.flexbox.vleft}
触发机制：

+ 当浏览器故意没有得到数据时触发

+ 下载完成时触发

+ 因为某种原因已经暂停时触发


[slide]
#video事件timeupdate {:&.flexbox.vleft}
触发机制：

+ 当当前播放时间改变时触发


[slide]
#video事件volumechange {:&.flexbox.vleft}
触发机制：

+ 当音量改变时触发


[slide]
#video事件waiting {:&.flexbox.vleft}
触发机制：

+ 当视频需要缓冲而停止播放时触发


[slide]
#video加载视频时触发事件顺序 {:&.flexbox.vleft}

1. loadstart
2. durationchange
3. loadedmetadata
4. loadeddata
5. progress
6. canplay
7. canplaythrough
