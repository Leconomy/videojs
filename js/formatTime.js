'use strict'

var FormatTime = function() {
}
FormatTime.prototype = {
	second: function(time = 0) {
		return this.zero(time);
	},

	minute: function(time = 0) {
		let t = time / 60;
		return this.zero(t);
	},

	hour: function(time = 0) {
		let t = time / 3600;
		return this.zero(t);
	},

	zero: function(num = 0) {
		num = parseInt(num);
		return num * 1 > 9 ? (num + '') : ('0' + num); 
	},
	format: function(time = 0) {
		let hour = 0,
			minute = 0,
			second = 0;
		hour = this.hour(time);
		time %= 3600;
		minute = this.minute(time);
		time %= 60;
		second = this.second(time);

		if(hour === '00') {
			return `${minute}:${second}`;
		}
		return `${hour}:${minute}:${second}`;
	}
}
var formatTime = new FormatTime();
module.exports = formatTime;
