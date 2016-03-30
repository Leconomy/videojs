'use strict'

class FormatTime {
	constructor() {

	}

	second(time) {
		return this.zero(time);
	}

	minute(time) {
		let t = time / 60;
		return this.zero(t);
	}

	hour(time) {
		let t = time / 3600;
		return this.zero(t);
	}

	zero(num) {
		num = parseInt(num);
		return num * 1 > 9 ? (num + '') : ('0' + num); 
	}
	format(time) {
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
export {formatTime}
