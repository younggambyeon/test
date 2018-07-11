var User = function() {

};

User.prototype.saveUser = function() {
	var email = $('#email').val();
	var password = $('#password').val();
	var message = $('.forgot_password--message');
	var box = $("#signup_msg");

	if (!isEmail(email)) {
		box.text("이메일 형식이 아닙니다.");
		message.css('visibility', 'visible');
		message.addClass('bounce animated');
		return false;
	}

	if (!isPassword(password)) {
		box.text("비밀번호는 영문/숫자/특수문자로 8자 이상으로 구성해주세요.");
		message.css('visibility', 'visible');
		message.addClass('bounce animated');
		return false;
	}

	var data = {
		email : email,
		password : password
	}

	data = JSON.stringify(data);

	$.ajax({
		url : '/finder/join',
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			document.location.href = "/finder/login";
		}
	});

}


