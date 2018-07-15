var User = function() {

};

User.prototype.saveUser = function() {
	var contextPath = $("#context-path").attr("content");
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

	var rsa = new RSAKey();
	rsa.setPublic($('#RSAModulus').val(), $('#RSAExponent').val());

	var data = {
		email : rsa.encrypt(email),
		password : rsa.encrypt(password)
	}

	data = JSON.stringify(data);

	$.ajax({
		url : contextPath + 'join',
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if (response == "duplicate user") {
				box.text("이미 존재하는 계정입니다.");
				message.css('visibility', 'visible');
				message.addClass('bounce animated');
				return false;
			}

			document.location.href = contextPath + "login";
		}
	});
}
