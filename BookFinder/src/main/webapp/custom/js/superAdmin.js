var SuperAdmin = function() {
	
};

SuperAdmin.prototype.saveGroupCompany = function() {
	var name = $('#groupCompanyName').val();
	var tel1 = $('#groupCompany_tel_1').val();
	var tel2 = $('#groupCompany_tel_2').val();
	var tel3 = $('#groupCompany_tel_3').val();
	var address = $('#companyAddress').val();
	
	var tel = tel1 + "-" + tel2 + "-" + tel3;
	var file = $("#logoFile")[0].files[0];

	var box = $('.admin_box_alert');
	box.css('width', '45%');
	
	var message = '';
	
	if (!file) {
		message = '로고 이미지 등록이 필요합니다.';
		box.show();
		box.text(message);
		return false;
	}

	if (!name) {
		message = '회사명을 입력해주세요.';
		box.show();
		box.text(message);
		$("#groupCompanyName").focus();
		return false;
	}

	if (!Common.prototype.isTelephone(tel)) {
		message = '전화번호가 올바르지 않습니다.';
		box.show();
		box.text(message);
		$("#groupCompany_tel_1").focus();
		return false;
	}

	if (!address) {
		message = '주소를 입력해주세요.';
		box.show();
		box.text(message);
		$("#groupCompanyAddress").focus();
		return false;
	}

	var formData = new FormData();
	formData.append("file", file);
	formData.append("name", name);
	formData.append("tel", tel);
	formData.append("address", address);
	
	$.ajax({
		url : '/office/super/admin/company',
		type : 'POST',
		data : formData,
		enctype : 'multipart/form-data',
		processData : false,
		contentType : false,
		dataType : 'text'
	}).then(function(response) {
		if ("save to logo failed" === response) {
			message = '로고 이미지 저장에 실패하였습니다. 잠시 후 다시 시도해주세요.';
			box.show();
			box.text(message);
			return false;
		} else if("address lookup failed" === response) {
			message = '정확한 주소 정보가 필요합니다. 검색을 이용하여 주소를 입력하세요.';
			box.show();
			box.text(message);
			return false;
		} else {
			window.location.href = '/office/super/admin/home';
		}
	});
};

SuperAdmin.prototype.changeGroupCompanyLogo = function() {
	var idx = $('#groupCompanyIdx').val();
	var file = $("#logoFile")[0].files[0];

	var box = $('.admin_box_alert');
	box.css('width', '45%');

	if (!file) {
		var message = '로고 이미지 등록이 필요합니다.';
		box.show();
		box.text(message);
		return false;
	}
	
	var formData = new FormData();
	formData.append("file", file);
	
	$.ajax({
		url : '/office/super/admin/company/' + idx + '/logo',
		type : 'POST',
		data : formData,
		enctype : 'multipart/form-data',
		processData : false,
		contentType : false,
		dataType : 'text',
		success : function(response) {
			if ("save to logo failed" === response) {
				var message = '로고 이미지 저장에 실패하였습니다. 잠시 후 다시 시도해주세요.';
				box.show();
				box.text(message);
				return false;
			} else {
				window.location.reload();
			}
		}
	});
};

SuperAdmin.prototype.modifyGroupCompany = function() {
	var idx = $('#groupCompanyIdx').val();
	
	var name = $('#groupCompanyName').val();
	var tel1 = $('#groupCompany_tel_1').val();
	var tel2 = $('#groupCompany_tel_2').val();
	var tel3 = $('#groupCompany_tel_3').val();
	var address = $('#companyAddress').val();
	
	var tel = tel1 + "-" + tel2 + "-" + tel3;

	var box = $('.admin_box_alert');
	box.css('width', '45%');

	var message = '';
		
	if (!name) {
		message = '회사명을 입력해주세요.';
		box.show();
		box.text(message);
		$("#groupCompanyName").focus();
		return false;
	}

	if (!Common.prototype.isTelephone(tel)) {
		message = '전화번호가 올바르지 않습니다.';
		box.show();
		box.text(message);
		$("#groupCompany_tel_1").focus();
		return false;
	}

	if (!address) {
		message = '주소를 입력해주세요.';
		box.show();
		box.text(message);
		$("#groupCompanyAddress").focus();
		return false;
	}

	var jdata = {
		name : name,
		tel : tel,
		address : address
	};

	$.ajax({
		url : '/office/super/admin/company/' + idx,
		type : 'PATCH',
		data : JSON.stringify(jdata),
		contentType : "application/json",
		dataType : "text",
		success : function(response) {
			if("address lookup failed" === response) {
				message = '정확한 주소 정보가 필요합니다. 검색을 이용하여 주소를 입력하세요.';
				box.show();
				box.text(message);
				return false;
			} else {
				window.location.reload();
			}
		}
	});
};

SuperAdmin.prototype.groupCompanyAccount = function(idx) {
	document.location.href = '/office/super/admin/company/' + idx + '/account';
};

SuperAdmin.prototype.showGroupCompanyRemovePopup = function(idx) {
	$('#groupCompanyIdx').val(idx);
	$('#input_token').val('');
	$('.token__message').css('visibility','hidden');
	$('.groupCompany__token__popup').show();
	
	$('.overlay').css('z-index', '1001');
	$('.overlay').css('background', '#9c9c9c');
	$('.overlay').show();
	$('#loading-img').hide();
};

SuperAdmin.prototype.sendRemoverToken = function(idx) {
	
	$.ajax({
		type : 'GET',
		url : '/office/super/admin/company/' + idx + '/token',
		contentType : 'text',
		dataType : 'text'
	}).then(function(response) {
		if(response === "fail") {
			var box = $('.admin_box_alert');
			var message = '이메일 전송에 실패했습니다.';
			box.show();
			box.text(message);
			
			$('.groupCompany__token__popup').hide();
			$('.overlay').hide();
		}
	});
};

SuperAdmin.prototype.verifyRemoverToken = function(token) {
	var idx = $('#groupCompanyIdx').val();
	
	$('.overlay').css('z-index', '1020');
	$('.overlay').css('background', '#fff');
	$('.overlay').show();
	$('#loading-img').show();
	
	$.ajax({
		type : 'GET',
		url : '/office/super/admin/company/' + idx + '/auth?token=' + token,
		contentType : 'text',
		dataType : 'text'
	}).then(function(response) {
		if(response === "fail") {
			$('.overlay').hide();
			$('.token__message').empty();
			$('.token__message').append('인증에 실패하였습니다.');
			$('.token__message').css('color','red');
			$('.token__message').css('visibility','visible');
		} else if(response === "token is null") {
			$('.overlay').hide();
			$('.token__message').empty();
			$('.token__message').append('토큰을 입력해주세요.');
			$('.token__message').css('color','red');
			$('.token__message').css('visibility','visible');
		} else if(response === "unauthorized token") {
			$('.overlay').hide();
			$('.token__message').empty();
			$('.token__message').append('토큰이 일치하지 않습니다.');
			$('.token__message').css('color','red');
			$('.token__message').css('visibility','visible');
		} else {
			//
			setTimeout(function(){
				$('.overlay').hide();
				$('.token__message').empty();
			}, 2000);
			
			setTimeout(function(){
				$('.token__message').append('인증이 완료되었습니다.');
				$('.token__message').css('color','var(--main-bg-color)');
				$('.token__message').css('visibility','visible');
			}, 2000);
			
			setTimeout(function() {
				$('.groupCompany__token__popup').hide();
				SuperAdmin.prototype.removeGroupCompany(idx);
			}, 4000);
		}
	});
};

SuperAdmin.prototype.removeGroupCompany = function(idx) {
	$.ajax({
		type : 'DELETE',
		url : '/office/super/admin/company/' + idx,
		dataType : 'text'
	}).then(function(response) {
		if(response === "success") {
			window.location.href = '/office/super/admin/home';
		}
	});
};

SuperAdmin.prototype.saveAccount = function(idx) {
	var email = $("#input_account").val();
	$('.adminAccount_message').empty();
	
	var message = '';
	
	if (!email) {
		$("#input_account").focus();
		
		message = '아이디(이메일)을 입력해주세요.';
		$('.adminAccount_message').append(message);
		$('.adminAccount_message').show();
		return false;
	}

	if (!Common.prototype.isEmail(email)) {
		$("#input_account").focus();

		message = '이메일 형식이 올바르지 않습니다.';
		$('.adminAccount_message').append(message);
		$('.adminAccount_message').show();
		return false;
	}
	
	$.ajax({
		type : 'POST',
		url : '/office/super/admin/company/' + idx + '/account?email=' + email
	}).then(function(response) {
		if(response === "success") {
			SuperAdmin.prototype.appendAccount(email);
			window.location.reload();
		} else {
			var box = $('.admin_box_alert');
			var message = '계정 추가를 실패하였습니다.';
			
			box.css('width', '45%');
			box.show();
			box.text(message);
		}
		
		$('.adminAccount__popup').hide();
		$('.overlay').hide();
	});
	
	$("#input_account").val('');
};

SuperAdmin.prototype.appendAccount = function(email) {
	$('.account__list').append(
		'<div class="col-md-2 account__wrapper">' +
		'<span class="account__wrapper--close">X</span>' +
		'<div><span class="account__text--id">' +
		email +
		'</span></div></div>'
	);
};

SuperAdmin.prototype.removeAccount = function(panel, idx) {
	$.ajax({
		type : 'DELETE',
		url : '/office/super/admin/account/' + idx,
		dataType : 'text'
	}).then(function(response) {
		if(response === "success") {
			panel.remove();
			window.location.reload();
		} else {
			var box = $('.admin_box_alert');
			var message = '계정 삭제를 실패하였습니다.';
			
			box.css('width', '45%');
			box.show();
			box.text(message);
		}
	});
};
