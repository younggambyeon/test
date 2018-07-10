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
		url : '/test/join',
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			document.location.href = "/test/login";
		}
	});

}

User.prototype.refreshAuthenticationKey = function() {

	$.ajax({
		url : "/geolocation/console/authentication",
		type : 'PUT',
		dataType : 'text',
		success : function(response) {
			var authKey = response;

			$("#authKey").val(authKey);
		},

		error : function(request, status, error) {

		}
	});

}

User.prototype.saveAccessIp = function() {
	var size = $(".ipList tr.ip").length;
	var target = $(".ipList tr.ip");

	var authIdx = $("#authenticationIdx").val();

	var apList = new Array();

	for (var i = 0; i < size; i++) {
		var tr = target.eq(i);

		var idx = tr.find("input[type=hidden]").val();
		var ip = tr.find("input[type=text]").val();

		if (isIp(ip)) {
			var data = {
				idx : idx,
				ip : ip,
				authenticationIdx : authIdx
			}

			apList.push(data);
		} else {
			tr.find("input[type=text]").focus();
			return;
		}
	}

	data = JSON.stringify(apList);

	$.ajax({
		url : "/geolocation/console/authentication/ip",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			document.location.reload(true);
		},

		error : function(request, status, error) {

		}
	});

}

User.prototype.deleteAccessIpByIdx = function(panel) {
	var idx = panel.siblings("input[type=hidden]").val();

	$.ajax({
		url : "/geolocation/console/authentication/ip/" + idx,
		type : 'DELETE',
		dataType : 'text',
		success : function(response) {
			document.location.reload(true);
		},

		error : function(request, status, error) {

		}
	});
}

/*
 * User.prototype.addIpInputTag = function(panel) { $(".ipList") .append( '<div><input
 * type="text" />' + ' <input type="button" class="ip_delete_button" value="삭제"
 * onclick=User.prototype.removeIpInputTag(this) />' + '<input type="hidden"
 * value="0" /></div>'); }
 */

User.prototype.addIpInputTag = function(panel) {
	$(".ipList")
			.find('tr:last')
			.prev()
			.after(
					'<tr class="ip"><td><input type="text" class="form-control mgt30 input_ip" placeholder="IP address"/>'
							+ '</td><td></td><td style="text-align: center">'
							+ '<i class="pointer fa fa-times fa-times-clr" onclick=User.prototype.removeIpInputTag(this)></i>'
							+ '<input type="hidden" value="0" /></td><td></td></tr><tr height="14"></tr>');
}

User.prototype.removeIpInputTag = function(button) {
	var panel = $(button);
	var tr = panel.parent().parent();
	tr.next("tr").remove();
	tr.remove();

}

User.prototype.changePassword = function() {
	var idx = $('#authenticationIdx').val();

	var oldPassword = $('#oldPassword').val();
	var newPassword = $('#newPassword').val();
	var rePassword = $('#rePassword').val();

	if (!oldPassword) {
		var panelElement = $(".content__wrapper *");
		panelElement.removeAttr('data-tooltip');

		$("#oldPassword").parent().attr('data-tooltip', '현재 비밀번호를 입력해주세요');
		$("#oldPassword").focus();
		return false;
	}

	if (!newPassword) {
		var panelElement = $(".content__wrapper *");
		panelElement.removeAttr('data-tooltip');

		$("#newPassword").parent().attr('data-tooltip', '새 비밀번호를 입력해주세요');
		$("#newPassword").focus();
		return false;
	}

	if (!isPassword(newPassword)) {
		var panelElement = $(".content__wrapper *");
		panelElement.removeAttr('data-tooltip');

		$("#newPassword").parent().attr('data-tooltip', '비밀번호 형식이 올바르지 않습니다');
		$("#newPassword").focus();
		return false;
	}

	if (!rePassword) {
		var panelElement = $(".content__wrapper *");
		panelElement.removeAttr('data-tooltip');

		$("#rePassword").parent().attr('data-tooltip', '새 비밀번호 확인을 입력해주세요');
		$("#rePassword").focus();
		return false;
	}

	if (newPassword != rePassword) {
		var panelElement = $(".content__wrapper *");
		panelElement.removeAttr('data-tooltip');

		$("#newPassword").parent().attr('data-tooltip',
				'새 비밀번호와 새 비밀번호 확인이 일치하지 않습니다');
		$('#newPassword').focus();
		return false;
	}

	var data = {
		oldPassword : oldPassword,
		newPassword : newPassword
	}

	data = JSON.stringify(data);

	$.ajax({
		url : '/geolocation/console/authentication/' + idx + '/password',
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("fail" == response) {
				var panelElement = $(".content__wrapper *");
				panelElement.removeAttr('data-tooltip');

				$("#oldPassword").parent().attr('data-tooltip',
						'비밀번호 변경에 실패하였습니다');
				$("#oldPassword").focus();
				return false;
			} else if ("not matches password" == response) {
				var panelElement = $(".content__wrapper *");
				panelElement.removeAttr('data-tooltip');

				$("#oldPassword").parent().attr('data-tooltip',
						'현재 비밀번호가 일치하지 않습니다');
				$("#oldPassword").focus();
				return false;
			} else {
				alert('비밀번호 변경이 완료되었습니다')
				window.location.reload();
			}
		}
	});
}
