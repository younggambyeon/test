function isIp(ip) {
	var regex = /^([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])(\.([1-9]?[0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])){3}$/;

	if (!regex.test(ip)) {
		alert("[0-255].[0-255].[0-255].[0-255] 형태로 입력해주세요 \n 예) 192.168.0.1");
	} else {
		return regex.test(ip);
	}
};

function isPassword(password) {
	var regex = /([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~,-])|([!,@,#,$,%,^,&,*,?,_,~,-].*[a-zA-Z0-9])/;

	if (password.length < 8) {
		return false;
	}
	if (!regex.test(password)) {
		return false;
	} else {
		return regex.test(password);
	}
};

function isEmail(email) {
	var regex = /([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;

	if (!regex.test(email)) {
		return false;
	} else {
		return regex.test(email);
	}
};
