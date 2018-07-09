var Common = function() {

};

// 랜덤 색상 생성
Common.prototype.generateRandomColor = function() {
	var colorCode = "#" + Math.round(Math.random() * 0xffffff).toString(16);
	
	return colorCode;
}

Common.prototype.isDate = function(date) {
	var regex = /^(\d{4})(\/|-)(\d{1,2})(\/|-)(\d{1,2})$/;

	if(!regex.test(date)) {
		return false;
	} else {
		return regex.test(date);
	}
}

Common.prototype.isPassword = function(password) {
	var regex = /([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~,-])|([!,@,#,$,%,^,&,*,?,_,~,-].*[a-zA-Z0-9])/;
	
	if(password.length < 8) {
		return false;
	}
	if(!regex.test(password)) {
		return false;
	} else {
		return regex.test(password);
	}	
}

Common.prototype.isEmail = function(email) {
	var regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
	
	if(!regex.test(email)) {
		return false;
	} else {
		return regex.test(email);
	}	
}

Common.prototype.isPhone = function(phone) {
	var regex = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/;
	
	if(!regex.test(phone)) {
		return false;
	} else {
		return regex.test(phone);
	}
}

Common.prototype.isTelephone = function(telephone) {
	var regex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
	
	if(!regex.test(telephone)) {
		return false;
	} else {
		return regex.test(telephone);
	}
}

Common.prototype.isNumber = function(number) {
	var regex = /^[0-9]*$/;
	
	if(!regex.test(number)) {
		return false;
	} else {
		return regex.test(number);
	}
}

Common.prototype.isOnlyCharacter = function(character) {
	var regex = /^[가-힣a-zA-Z]+$/;
	
	if(!regex.test(character)) {
		return false;
	} else {
		return regex.test(character);
	}
}

Common.prototype.compareTime = function(time1, time2) {
	var startTime, endTime, timeArr;

	timeArr = time1.split(':');
	startTime = (timeArr[0] * 60) + timeArr[1];
	timeArr = time2.split(':');
	endTime = (timeArr[0] * 60) + timeArr[1];

	if (Number(startTime) >= Number(endTime)) {
		return false;
	} else {
		return true;
	}
}

// 12시간 표기(am, pm)에서 24시간 표기로 변환
Common.prototype.convertTime12to24 = function(time12h) {
	  const [time, modifier] = time12h.split(' ');
	  let [hours, minutes] = time.split(':');

	  if (hours === '12') {
	    hours = '00';
	  }

	  if (modifier === 'PM') {
	    hours = parseInt(hours, 10) + 12;
	  }

	  return hours + ':' + minutes;
}

Common.prototype.showMessageInformation = function(message) {
	var box = $('.box_alert_message');
	box.show();
	box.text(message);
}

Common.prototype.showMessgeInTooltip = function(message) {
	var panelElement = $(".panel *, .panel_ex *, #container *");
	var box = $(':focus');

	panelElement.removeAttr('data-tooltip');
	$(box).parent().attr('data-tooltip', message);
	setTimeout(function() {
		panelElement.removeAttr('data-tooltip');
	}, 5000);
}

Common.prototype.shadeColor2 = function(color, percent) {   
    var f = parseInt(color.slice(1), 16), 
    			t = percent < 0 ? 0 : 255, 
    			p = percent < 0? percent*-1 : percent, 
    			R = f>>16, G = f>>8&0x00FF, B = f&0x0000FF;
    return "#" + (0x1000000 + (Math.round((t-R) * p) + R) * 0x10000 
    		+ (Math.round((t-G) * p) + G) * 0x100 + (Math.round((t-B) * p) + B)).toString(16).slice(1);
}
