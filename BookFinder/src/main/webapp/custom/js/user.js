var User = function() {

};

/* --- signup --- */
User.prototype.appendTeamBox = function(companyIdx) {
	$.ajax({
		url : "/office/join/company/" + companyIdx + "/team",
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var teamList = response;

			if (0 < teamList.length) {
				var selectBox = $("#teamBox");

				for (i = 0; i < teamList.length; i++) {
					var team = teamList[i];

					if ("미정" != team.name) {
						selectBox.append('<option value="' + team.idx + '">'
								+ team.name + '</option>')
					}
				}

				$('.companyListDiv').hide();
				$('#inputInfoDiv').show();

				$('ol').find('li').removeClass('is-active');
				$('ol').find('li:nth-child(2)').addClass('is-active');

				$("#teamBox").chosen({
					allow_single_deselect : true,
					no_results_text : "존재하지 않습니다 : "
				});
			} else {
				// 필수
				var message = '선택하신 회사의 필수항목이 추가되지 않아, 회원가입 서비스를 이용하실 수 없습니다.';
				Common.prototype.showMessageInformation(message);
			}
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.saveUser = function() {
	var companyIdx = $(".select_company").val();
	var email = $("#email").val();
	var password = $("#password").val();
	var confirmPassword = $("#confirmPassword").val();
	var userName = $("#userName").val();
	var teamBox = $("#teamBox").val();

	if (email == null || email == "") {
		var inputBox = $('#email');
		message = '아이디(이메일)을 입력해주세요.';
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (!Common.prototype.isEmail(email)) {
		var inputBox = $('#email');
		message = '이메일 형식이 올바르지 않습니다.';
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (password == null || password == "") {
		var inputBox = $('#password');
		message = "비밀번호를 입력해주세요.";
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (!Common.prototype.isPassword(password)) {
		var inputBox = $('#password');
		message = '비밀번호는 영문(대소문자구분),숫자,특수문자(~!@#$%^&*()-_? 만 허용)를 혼용하여 8~16자를 입력해주세요.'
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (password != confirmPassword) {
		var inputBox = $('#confirmPassword');
		message = '비밀번호가 일치하지 않습니다.'
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (userName == null || userName == "") {
		var inputBox = $('#userName');
		message = "이름을 입력해주세요.";
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (!Common.prototype.isOnlyCharacter(userName)) {
		var inputBox = $('#userName');
		message = "이름은 한글 또는 영문자만을 입력하세요.";
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	var data = {
		email : email,
		password : password,
		confirmPassword : confirmPassword,
		name : userName,
		teamIdx : teamBox,
		companyIdx : companyIdx
	};

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/join/account",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("fail" == response) {
				var inputBox = $('#email');
				var message = '존재하는 아이디입니다.';
				User.prototype.showSignupValidationMessage(message, inputBox);

			} else if ("not exist default value" == response) {
				var message = '선택하신 회사는 서비스 이용의 필수인 직급과 직책이 구성되지 않았습니다.';
				User.prototype.showSignupValidationMessage(message);

			} else if ("not exist manager in team" == response) {
				var message = '선택하신 팀은 현재 팀장이 존재하지 않아, 관리자의 승인이 필요합니다.';
				$("#signup_msg").text(message);

				$('#inputInfoDiv').hide();
				$('#signupConfirmDiv').show();
				$('ol').find('li').removeClass('is-active');
				$('ol').find('li:nth-child(3)').addClass('is-active');

			} else if ("success" == response) {
				var message = '본인이 속한 팀의 승인이 필요합니다.';
				$("#signup_msg").text(message);

				$('#inputInfoDiv').hide();
				$('#signupConfirmDiv').show();
				$('ol').find('li').removeClass('is-active');
				$('ol').find('li:nth-child(3)').addClass('is-active');
			}
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.checkEmailDuplication = function() {
	var inputBox = $('#email');
	var email = $('#email').val();

	$.ajax({
		url : "/office/join/account/duplication",
		type : 'GET',
		data : {
			email : email
		},
		dataType : 'text',
		success : function(response) {
			if ("fail" == response) {
				var message = '사용 중인 아이디입니다.';
				User.prototype.showSignupValidationMessage(message, inputBox);
			}

			return false;
		},
		error : function(request, status, error) {

		}
	});
};

User.prototype.showSignupValidationMessage = function(message, inputBox) {
	$('#output__text').find('span').empty();
	$(inputBox).css('background-color', 'rgba(253, 77, 128, 0.19)');
	$('#output__text').css('visibility', 'visible');
	$('#output__text').find('span').append(message);
}

/* --- starter --- */

User.prototype.appendPositionBox = function(companyIdx) {
	$.ajax({
		url : "/office/company/" + companyIdx + "/position",
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var positionList = response;

			if (0 < positionList.length) {
				var selectBox = $("#positionBox");

				for (i = 0; i < positionList.length; i++) {
					var position = positionList[i];

					if ("미정" != position.name) {
						selectBox.append('<option value="' + position.idx
								+ '">' + position.name + '</option>');
					}

				}

				selectBox.chosen({
					allow_single_deselect : true,
					no_results_text : "존재하지 않습니다 : "
				});
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.appendRankBox = function(companyIdx) {
	$.ajax({
		url : "/office/company/" + companyIdx + "/rank",
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var rankList = response;

			if (0 < rankList.length) {
				var selectBox = $("#rankBox");

				for (i = 0; i < rankList.length; i++) {
					var rank = rankList[i];

					if ("미정" != rank.name) {
						selectBox.append('<option value="' + rank.idx + '">'
								+ rank.name + '</option>');
					}

				}

				selectBox.chosen({
					allow_single_deselect : true,
					'placeholder-text-single' : 'noResultsChosenPlaceholder',
					no_results_text : "존재하지 않습니다 : "
				});
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.showAdressInformation = function() {
	new daum.Postcode({
		oncomplete : function(data) {
			var fullAddr = '';
			var extraAddr = '';

			if (data.userSelectedType === 'R') {

				fullAddr = data.roadAddress;

			} else {
				fullAddr = data.jibunAddress;
			}

			if (data.userSelectedType === 'R') {
				if (data.bname !== '') {
					extraAddr += data.bname;
				}

				if (data.buildingName !== '') {
					extraAddr += (extraAddr !== '' ? ', ' + data.buildingName
							: data.buildingName);
				}

				fullAddr += (extraAddr !== '' ? ' (' + extraAddr + ')' : '');
			}

			$('#address').val(fullAddr);
		}
	}).open();
}

User.prototype.saveProfileByStarterPage = function() {
	var birthYear = $("#birth_year").val();
	var birthMonth = $("#birth_month").val();
	var birthDay = $("#birth_day").val();

	var dateHiredYear = $("#dateHired_year").val();
	var dateHiredMonth = $("#dateHired_month").val();
	var dateHiredDay = $("#dateHired_day").val();

	var phoneA = $("#phone_number_1").val();
	var phoneB = $("#phone_number_2").val();
	var phoneC = $("#phone_number_3").val();

	// target
	var birth = birthYear + "-" + birthMonth + "-" + birthDay;
	var dateHired = dateHiredYear + "-" + dateHiredMonth + "-" + dateHiredDay;
	var phoneNumber = phoneA + "-" + phoneB + "-" + phoneC;

	var gender = $('input[name="radio-group"]:checked').val();
	var address = $("#address").val();
	var positionIdx = $("#positionBox").val();
	var rankIdx = $("#rankBox").val();

	// validation.
	if (!Common.prototype.isDate(birth)) {
		var inputBox = $('#birth_year, #birth_month, #birth_day');
		message = '날짜 형식이 올바르지 않습니다.';
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (!Common.prototype.isPhone(phoneNumber)) {
		var inputBox = $('#phone_number_1, #phone_number_2, #phone_number_3');
		message = '핸드폰 번호가 올바르지 않습니다.';
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (address == null || address == "") {
		var inputBox = $("#address")
		message = '주소를 입력해주세요.';
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (!Common.prototype.isDate(dateHired)) {
		var inputBox = $('#dateHired_year, #dateHired_month, #dateHired_day');
		message = '날짜 형식이 올바르지 않습니다.';
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	var data = {
		birth : birth,
		dateHired : dateHired,
		phoneNumber : phoneNumber,
		gender : gender,
		address : address,
		companyRankIdx : rankIdx,
		companyPositionIdx : positionIdx
	};

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/starter/settings/profile",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			window.location.href = "/office/starter/settings/profile/picture";
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.drawProfilePicture = function() {
	var reader = new FileReader();
	var targetFile = $("#filePhoto")[0].files[0];
	reader.readAsDataURL(targetFile);

	reader.onload = function() {
		document.querySelector('#thumbnail').src = reader.result;
	};

	// set design
	var uploadButton = $("#profile-picture-upload");
	var bg_color = document.body.style.getPropertyValue('--main-bg-color');

	$('.modal-dropzone-default p').empty();
	$('#ani_pointer').hide();
	$('.modal-dropzone-default-img').hide();
	$('#profile-sample-picture>.col-md-3').removeClass('opacity10').addClass(
			'opacity4');

	if (bg_color != '') {
		uploadButton.css('background', bg_color);
	} else {
		uploadButton.css('background', '#7871ff');
	}
	uploadButton.css('cursor', 'pointer');
	uploadButton.addClass("checked");
}

User.prototype.setDefaultImage = function(target) {
	var src = target.attr("src");
	var uploadButton = $("#profile-picture-upload");
	var bg_color = document.body.style.getPropertyValue('--main-bg-color');

	document.querySelector('#thumbnail').src = src;
	var file = $("#filePhoto").val("");

	$('.modal-dropzone-default p').empty();
	$('#ani_pointer').hide();
	$('.modal-dropzone-default-img').hide();
	$('#profile-sample-picture>.col-md-3').removeClass('opacity10').addClass(
			'opacity4');

	if (bg_color != '') {
		uploadButton.css('background', bg_color);
	} else {
		uploadButton.css('background', '#7871ff');
	}

	uploadButton.css('cursor', 'pointer');
	uploadButton.addClass("checked");
};

User.prototype.uploadProfilePicture = function() {
	var file = $("#filePhoto")[0].files[0];

	var formData = new FormData();

	if (file == undefined) {
		formData.append("defaultImage", $("#thumbnail").attr('src'));
	} else {
		formData.append("file", file);
		formData.append("defaultImage", "null");
	}

	$('.overlay').css('z-index','11002');
	$('.overlay').show();
	$('#loading-img').show();
	
	$.ajax({
		url : "/office/starter/settings/profile/picture",
		type : 'POST',
		data : formData,
		processData : false,
		contentType : false,
		dataType : 'text',
		success : function(response) {
			if (response == "success") {
				window.location.href = "/office/starter"
						+ "/settings/profile/privacy";
			} else {
				var message = '다시 시도해주세요.';
				var messageSpan = $('.image--alert__messege');

				messageSpan.empty();
				messageSpan.append(message);
				messageSpan.show();
				// Common.prototype.showMessageInformation(message);
			}
		},

		error : function(request, status, error) {

		}
	});
};

// 뉴스 주제 선택 체크박스 ON
User.prototype.checkNewsTopicOn = function(newsBox) {
	newsBox.addClass("selectNewsBox");
}

// 뉴스 주제 선택 체크박스 OFF
User.prototype.checkNewsTopicOff = function(newsBox) {
	newsBox.removeClass("selectNewsBox");
}

User.prototype.saveUserSetByStarter = function() {
	$('#output__text').find('span').empty();

	if ($('.starter_select_clr').length != 1) {
		message = '색상을 선택해주세요.';
		User.prototype.showSignupValidationMessage(message);
		return false;
	}

	var newsTopics = $('.selectNewsBox');
	var array = newsTopics.slice();

	var topicCount = $('.selectNewsBox').length;
	if (topicCount == 0) {
		message = '뉴스 주제를 선택해주세요.';
		User.prototype.showSignupValidationMessage(message);
		return false;
	}

	if (topicCount > 2) {
		message = '뉴스 주제 선택은 최대 2개까지 가능합니다.';
		User.prototype.showSignupValidationMessage(message);
		return false;
	}

	if (2 == topicCount) {
		var newsA = array[0].innerText;
		var newsB = array[1].innerText;
	} else {
		var newsA = array[0].innerText;
		var newsB = "IoT";
	}

	var pointColor = $('.starter_select_clr').find('span').text();
	var newsTopic = newsA + "," + newsB;

	var data = {
		pointColor : pointColor,
		newsTopic : newsTopic
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/starter/settings/profile/privacy",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			$(".inputAdditionalInfoDiv").hide();

			$('#msg2').fadeIn(2000);
			$('#msg2').fadeOut(2000);

			setTimeout(function() {
				$('#msg3').fadeIn(2000);
				$('#msg3').fadeOut(2000);
			}, 4000);

			setTimeout(function() {
				window.location.href = "/office/home";
			}, 8000);
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.appendTeamBoxInProfile = function(companyIdx) {
	var teamIdx = $('#teamIdx').val();

	$.ajax({
		url : "/office/company/" + companyIdx + "/team",
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var teamList = response;

			if (0 < teamList.length) {
				var selectBox = $("#teamBox");

				for (i = 0; i < teamList.length; i++) {
					var team = teamList[i];

					if (teamIdx == team.idx) {
						selectBox.append('<option value="' + team.idx
								+ '" selected="selected">' + team.name
								+ '</option>');
					} else {
						selectBox.append('<option value="' + team.idx + '">'
								+ team.name + '</option>');
					}

				}

				selectBox.chosen({
					allow_single_deselect : true,
					'placeholder-text-single' : 'noResultsChosenPlaceholder',
					no_results_text : "존재하지 않습니다 : "
				});

				var teamTutorial = $("#isTeamTutorial").val();

				if (teamTutorial == "true") {
					User.prototype.showTeamTutorial();
				}
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.appendPositionBoxInProfile = function(companyIdx) {
	var companyPositionIdx = $("#companyPositionIdx").val();

	$.ajax({
		url : "/office/company/" + companyIdx + "/position",
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var positionList = response;

			if (0 < positionList.length) {
				var selectBox = $("#positionBox");

				for (i = 0; i < positionList.length; i++) {
					var position = positionList[i];

					if (companyPositionIdx == position.idx) {
						selectBox.append('<option value="' + position.idx
								+ '" selected="selected">' + position.name
								+ '</option>');
					} else {
						selectBox.append('<option value="' + position.idx
								+ '">' + position.name + '</option>');
					}

				}

				selectBox.chosen({
					allow_single_deselect : true,
					no_results_text : "존재하지 않습니다 : "
				});

				var positionTutorial = $("#isPositionTutorial").val();

				if (positionTutorial == "true") {
					User.prototype.showPositionTutorial();
				}
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.appendRankBoxInProfile = function(companyIdx) {
	var companyRankIdx = $("#companyRankIdx").val();

	$.ajax({
		url : "/office/company/" + companyIdx + "/rank",
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var rankList = response;

			if (0 < rankList.length) {
				var selectBox = $("#rankBox");

				for (i = 0; i < rankList.length; i++) {
					var rank = rankList[i];

					if (companyRankIdx == rank.idx) {
						selectBox.append('<option value="' + rank.idx
								+ '" selected="selected">' + rank.name
								+ '</option>');
					} else {
						selectBox.append('<option value="' + rank.idx + '">'
								+ rank.name + '</option>');
					}

				}

				selectBox.chosen({
					allow_single_deselect : true,
					'placeholder-text-single' : 'noResultsChosenPlaceholder',
					no_results_text : "존재하지 않습니다 : "
				});

				var rankTutorial = $("#isRankTutorial").val();

				if (rankTutorial == "true") {
					User.prototype.showRankTutorial();
				}
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.putUserInformation = function() {
	var companyIdx = $('#companyIdx').val();

	User.prototype.appendTeamBoxInProfile(companyIdx);
	User.prototype.appendPositionBoxInProfile(companyIdx);
	User.prototype.appendRankBoxInProfile(companyIdx);

	var gender = $("#gender").val();

	if ("남" == gender) {
		$("#male").attr('checked', 'checked');
	} else {
		$("#female").attr('checked', 'checked');
	}

	var birth = $("#birth").val().split('-');
	var birthYear = birth[0];
	var birthMonth = birth[1];
	var birthDay = birth[2];

	$("#birth_year").val(birthYear);
	$("#birth_month").val(birthMonth);
	$("#birth_day").val(birthDay);

	var dateHired = $("#dateHired").val().split('-');
	var dateHiredYear = dateHired[0];
	var dateHiredMonth = dateHired[1];
	var dateHiredDay = dateHired[2];

	$("#dateHired_year").val(dateHiredYear);
	$("#dateHired_month").val(dateHiredMonth);
	$("#dateHired_day").val(dateHiredDay);

	var phoneNumber = $("#phoneNumber").val().split('-');
	var phoneNumber1 = phoneNumber[0];
	var phoneNumber2 = phoneNumber[1];
	var phoneNumber3 = phoneNumber[2];

	$("#phone_number_1").val(phoneNumber1);
	$("#phone_number_2").val(phoneNumber2);
	$("#phone_number_3").val(phoneNumber3);
};

User.prototype.putPointColor = function() {
	var pointColor = $("#pointColor").val();
	var colorDiv = $(".box_clr");

	for (var i = 0; i < colorDiv.length; i++) {
		var divTag = colorDiv.eq(i);
		var span = divTag.find('.color_val');
		var colorValue = span.text();

		if (pointColor == colorValue) {
			divTag.addClass("select_clr");
		}
	}
};

User.prototype.putNewsTopics = function() {
	var newsTopic = $("#newsTopic").val();
	var array = newsTopic.split(",");
	var topic1 = array[0];
	var topic2 = array[1];

	var newsTopicDiv = $(".newsBox");

	for (var i = 0; i < newsTopicDiv.length; i++) {
		var div = newsTopicDiv.eq(i);
		var span = div.find('span');

		var newsTopcValue = span.text();

		if (topic1 == newsTopcValue) {
			div.addClass("selectNewsBox");
		}

		if (topic2 == newsTopcValue) {
			div.addClass("selectNewsBox");
		}
	}
};

User.prototype.updateUserInformation = function() {
	var idx = $("#userIdx").val();

	var birthYear = $("#birth_year").val();
	var birthMonth = $("#birth_month").val();
	var birthDay = $("#birth_day").val();

	var dateHiredYear = $("#dateHired_year").val();
	var dateHiredMonth = $("#dateHired_month").val();
	var dateHiredDay = $("#dateHired_day").val();

	var phoneNumber1 = $("#phone_number_1").val();
	var phoneNumber2 = $("#phone_number_2").val();
	var phoneNumber3 = $("#phone_number_3").val();

	// parameter
	var name = $("#name").val();
	var gender = $('input[name="radio-group"]:checked').val();
	var extensionNumber = $("#extensionNumber").val();
	var birth = birthYear + "-" + birthMonth + "-" + birthDay;
	var dateHired = dateHiredYear + "-" + dateHiredMonth + "-" + dateHiredDay;
	var phoneNumber = phoneNumber1 + "-" + phoneNumber2 + "-" + phoneNumber3;
	var address = $("#address").val();

	var teamIdx = $("#teamBox").val();
	var companyPositionIdx = $("#positionBox").val();
	var companyRankIdx = $("#rankBox").val();

	// validation
	if (name == null || name == "") {
		$("#name").focus();
		message = '이름을 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (!Common.prototype.isOnlyCharacter(name)) {
		$("#name").focus();
		message = '이름은 한글 또는 영문자만 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (!Common.prototype.isDate(birth)) {
		$('#birth_year, #birth_month, #birth_day').focus();
		message = '날짜 형식이 올바르지 않습니다.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (!Common.prototype.isDate(dateHired)) {
		var inputBox = $('#dateHired_year, #dateHired_month, #dateHired_day')
				.focus();
		message = '날짜 형식이 올바르지 않습니다.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (!Common.prototype.isPhone(phoneNumber)) {
		$('#phone_number_1, #phone_number_2, #phone_number_3').focus();
		message = '핸드폰 번호가 올바르지 않습니다.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (!Common.prototype.isNumber(extensionNumber)) {
		$("#extensionNumber").focus();
		message = '숫자만 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (address == null || address == "") {
		$("#address").focus();
		message = '주소를 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	var data = {
		name : name,
		gender : gender,
		birth : birth,
		dateHired : dateHired,
		extensionNumber : extensionNumber,
		phoneNumber : phoneNumber,
		address : address,
		teamIdx : teamIdx,
		companyPositionIdx : companyPositionIdx,
		companyRankIdx : companyRankIdx
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/user/" + idx + "/settings/profile",
		type : 'PATCH',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			location.reload();
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.verifyTutorialInProfile = function() {

	User.prototype.showPositionTutorial();
	User.prototype.showTeamTutorial();
	User.prototype.showRankTutorial();
};

User.prototype.showPositionTutorial = function() {
	$('.overlay').show();
	$('.overlay').css('background', '#000');
	$('#loading-img').hide();
	$('.position__wrapper').css('z-index', '1003');
	$('.settingProfile__position--overlay').show();
	$('.position__select').find('.chosen-single').find('span').css('color',
			'#fff');
	$('#update_user_information_button').css('z-index', '1002');
	$('#update_user_information_button').css('color', '#fff');
};

User.prototype.showRankTutorial = function() {
	$('.overlay').show();
	$('.overlay').css('background', '#000');
	$('#loading-img').hide();
	$('.rank__wrapper').css('z-index', '1002');
	$('.settingProfile__rank--overlay').show();
	$('.rank__select').find('.chosen-single').find('span').css('color', '#fff');
	$('#update_user_information_button').css('z-index', '1002');
	$('#update_user_information_button').css('color', '#fff');
};

User.prototype.showTeamTutorial = function() {
	$('.overlay').show();
	$('.overlay').css('background', '#000');
	$('#loading-img').hide();
	$('.team__wrapper').css('z-index', '1004');
	$('.settingProfile__team--overlay').show();
	$('.team__select').find('.chosen-single').find('span').css('color', '#fff');
	$('#update_user_information_button').css('z-index', '1002');
	$('#update_user_information_button').css('color', '#fff');
};

User.prototype.hidePositionTutorial = function() {
	$('.position__wrapper').css('z-index', '1000');
	$('.settingProfile__position--overlay').hide();
	$('.position__select').find('.chosen-single').find('span').css('color',
			'#595959');
};

User.prototype.hideRankTutorial = function() {
	$('.overlay').hide();
	$('.settingProfile__rank--overlay').hide();
	$('.rank__wrapper').css('z-index', '1000');
	$('.rank__select').find('.chosen-single').find('span').css('color',
			'#595959');
};

User.prototype.hideTeamTutorial = function() {
	$('.overlay').hide();
	$('.settingProfile__team--overlay').hide();
	$('.team__wrapper').css('z-index', '1000');
	$('.team__select').find('.chosen-single').find('span').css('color',
			'#595959');
};

User.prototype.updateProfilePictureByDefualtImage = function(target) {
	var idx = $("#userIdx").val();

	var data = {
		profileImage : target.attr("src")
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/user/" + idx + "/settings/profile/picture/default",
		type : 'PATCH',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			location.reload();
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.updateUserProfilePicture = function() {
	var idx = $("#userIdx").val();
	var file = $("#filePhoto")[0].files[0];

	var formData = new FormData();
	formData.append("file", file);
	
	$('.overlay').css('z-index','11002');
	$('.overlay').show();
	$('#loading-img').show();
	
	$.ajax({
		url : "/office/user/" + idx + "/settings/profile/picture",
		type : 'POST',
		data : formData,
		processData : false,
		contentType : false,
		dataType : 'text',
		success : function(response) {
			if (response == "success") {
				location.reload();
			} else {
				var message = '다시 시도해주세요.';
				var messageSpan = $('.image--alert__messege');

				messageSpan.empty();
				messageSpan.append(message);
				messageSpan.show();
				// Common.prototype.showMessageInformation(message);
			}
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.confirmUserPassword = function(password) {
	var idx = $("#userIdx").val();

	if (password == null || password == "") {
		$("#oldPassword").focus();
		var message = '현재 비밀번호를 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	var data = {
		password : password
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/user/" + idx + "/settings/profile/account/password",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("fail" == response) {
				$('#oldPassword').focus();
				$('#oldPassword').val('');
				var message = '입력하신 현재 비밀번호가 틀립니다.';
				Common.prototype.showMessgeInTooltip(message);
			} else {
				// var message = '비밀번호가 확인되었습니다.';
			}
		},
		error : function(request, status, error) {

		}
	});
}

User.prototype.changeUserPassword = function() {
	var idx = $("#userIdx").val();

	var oldPassword = $("#oldPassword").val();
	var newPassword = $("#new_password").val();
	var rePassword = $("#re_password").val();

	// validation
	if (oldPassword == null || oldPassword == '') {
		$("#oldPassword").focus();
		var message = '현재 비밀번호를 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (newPassword == null || newPassword == '') {
		$("#new_password").focus();
		var message = '새 비밀번호를 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (!Common.prototype.isPassword(newPassword)) {
		$("#new_password").focus();
		var message = '비밀번호는 영문(대소문자구분),숫자,특수문자를 혼용하여 8~16자를 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (newPassword != rePassword) {
		$('#re_password').focus();
		var message = '입력하신 새 비밀번호와 비밀번호 확인이 서로 다릅니다.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (newPassword == oldPassword) {
		$("#new_password").focus();
		var message = '입력하신 새 비밀번호와 현재 비밀번호가 같습니다.';
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	var data = {
		oldPassword : oldPassword,
		newPassword : newPassword
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/user/" + idx + "/settings/profile/account",
		type : 'PATCH',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("fail" == response) {
				$("#oldPassword").val("");
				$("#oldPassword").focus();
				var message = '입력하신 현재 비밀번호가 틀립니다.';
				Common.prototype.showMessgeInTooltip(message);
			} else {
				$("#oldPassword").val("");
				$("#new_password").val("");
				$("#re_password").val("");
				var message = '비밀번호 변경이 완료되었습니다.'
				Common.prototype.showMessageInformation(message);
			}
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.changeUserPointColor = function(color) {
	var idx = $("#userIdx").val();

	var data = {
		pointColor : color
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/user/" + idx + "/settings/profile/color",
		type : 'PATCH',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			window.location.reload();
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.changeUserNewsTopic = function(color) {
	var idx = $("#userIdx").val();

	var newsTopics = $('.selectNewsBox');
	var array = newsTopics.slice();

	var topicCount = $('.selectNewsBox').length;
	if (topicCount == 0) {
		var message = '뉴스 주제를 선택해주세요.';
		Common.prototype.showMessageInformation(message);
		return false;
	}

	if (topicCount > 2) {
		var message = '뉴스 주제 선택은 최대 2개까지 가능합니다.';
		Common.prototype.showMessageInformation(message);
		return false;
	}

	if (2 == topicCount) {
		var newsA = array[0].innerText;
		var newsB = array[1].innerText;
	} else {
		var newsA = array[0].innerText;
		var newsB = "IoT";
	}

	var newsTopic = newsA + "," + newsB;

	var data = {
		newsTopic : newsTopic
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/user/" + idx + "/settings/profile/topic",
		type : 'PATCH',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			Common.prototype.showMessageInformation('뉴스 주제가 성공적으로 변경되었습니다.');
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.isInboxCount = function() {
	var idx = $("#userIdx").val();

	$.ajax({
		url : "/office/user/" + idx + "/inbox/new/count",
		type : 'GET',
		dataType : 'text',
		success : function(response) {
			var count = response;
			if (0 < count)
				$("#inbox_count").text(count);
		},

		error : function(request, status, error) {

		}
	});
}

User.prototype.showInbox = function() {
	var idx = $("#userIdx").val();
	var pageTag = $("#inbox_page");
	var offset = (parseInt(pageTag.val()) + 1);

	pageTag.val(offset);

	$.ajax({
		url : "/office/user/" + idx + "/inbox?offset=" + offset,
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var inboxs = response;
			var target = $("#inbox_box");

			if (0 < inboxs.length) {
				$('#inbox_empty').hide();
				$("#inbox_box").show();
				$("#inbox_body_title").show();
				$("#inbox_button_div").show();

				for (var i = 0; i < inboxs.length; i++) {
					var inbox = inboxs[i];

					User.prototype.appendInbox(target, inbox);
				}

			} else {
				var newInboxs = $('.wrapper_inbox');

				if (offset == 1 && 0 == newInboxs.length) {
					$("#inbox_body_title").hide();
					$("#inbox_box").hide();
					$('#inbox_empty').show();
				}

				$("#inbox_button_div").hide();
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.clickInbox = function(url, idx) {
	$.ajax({
		url : "/office/inbox/" + idx,
		type : 'GET',
		dataType : 'text',
		success : function(response) {
			if (response == "success")
				window.location.href = url;
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.acceptNewUser = function() {
	var idx = $("#newUserIdx").val();

	$.ajax({
		url : "/office/new/user/" + idx,
		type : 'PATCH',
		dataType : 'text',
		success : function(response) {
			window.location.reload();
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.appendInbox = function(target, inbox) {
	var dateArray = inbox.date.split(" ");
	var date = dateArray[0];
	// var mmdd = date.substring(5, 10);
	// var time = dateArray[1];
	// var hhmm = time.substring(0, 5)

	var url = "/office" + inbox.url;

	var html = '<div class="col-md-12 wrapper_inbox_box inbox_permission" onclick="User.prototype.clickInbox( \''
			+ url
			+ '\', \''
			+ inbox.idx
			+ '\')">'
			+ '<div class="col-md-5 inbox_item_pre">'
			+ '<div class="inbox__image--wrapper">'
			+ '<div class="inbox__image--round">'
			+ '<div class="inbox__image--centered">'
			+ '<img src="/office'
			+ inbox.eventUserImage
			+ '" />'
			+ '</div></div></div><span>'
			+ inbox.eventUserName
			+ '</span>'
			+ '</div><div class="col-md-7 inbox_item_nxt">'
			+ '<span>'
			+ inbox.content
			+ '</span><span>'
			+ date
			+ '</span>'
			+ '</div></div>';

	target.append(html);
};

User.prototype.showNotice = function() {
	var idx = $("#companyIdx").val();
	var pageTag = $("#notice_page");
	var offset = (parseInt(pageTag.val()) + 1);

	pageTag.val(offset);

	$.ajax({
		url : "/office/company/" + idx + "/notification?offset=" + offset,
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var notices = response;

			if (0 < notices.length) {
				$("#notice_more_show_button").show();

				for (var i = 0; i < notices.length; i++) {
					var notice = notices[i];
					var clip = notice.fileName;

					if (clip == null || clip == "") {
						User.prototype.appendNoticeBox(notice);
					} else {
						User.prototype.appendNoticeClipBox(notice);
					}
				}

			} else {
				if (offset == 1) {
					$("#notice_empty").show();
				}

				$("#notice_show_button").hide();
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.appendNoticeBox = function(notice) {
	var tbody = $("#notice_tbody");

	var html = '<tr class="noti-tr" onclick="User.prototype.moveNoticeDetailView(\''
			+ notice.idx
			+ '\')">'
			+ '<td><span class="notice_item_title">'
			+ notice.title
			+ '&nbsp;<i class="fa" style="color: #595959;"></i>'
			+ '</span><p class="notice_item_p"><span>'
			+ notice.content
			+ '</span></p><div class="notice-list-item-info">'
			+ '<span class="blind"> '
			+ notice.date
			+ '</span></div></a></td></tr>';

	tbody.append(html);
};

User.prototype.appendNoticeClipBox = function(notice) {
	var tbody = $("#notice_tbody");

	var html = '<tr class="noti-tr" onclick="User.prototype.moveNoticeDetailView(\''
			+ notice.idx
			+ '\')">'
			+ '<td><span class="notice_item_title">'
			+ notice.title
			+ '&nbsp;<i class="fa fa-paperclip" style="color: #595959;"></i>'
			+ '</span><p class="notice_item_p"><span>'
			+ notice.content
			+ '</span></p><div class="notice-list-item-info">'
			+ '<span class="blind"> '
			+ notice.date
			+ '</span></div></a></td></tr>';

	tbody.append(html);
}

User.prototype.moveNoticeDetailView = function(noticeIdx) {
	document.location.href = "/office/company/notification/" + noticeIdx;
};

User.prototype.moveNoticeWriterView = function() {
	document.location.href = "/office/company/notification/new";
};

var storedFiles = [];

User.prototype.appendFiles = function(event) {
	var fileTable = $(".file-table");
	var input = document.getElementById("files_input");

	fileTable.css("margin", "10px 0px 10px 0px");

	var files = event.target.files;
	var filesArr = Array.prototype.slice.call(files);

	filesArr
			.forEach(function(file, i) {
				storedFiles.push(file);

				$('.files')
						.append(
								'<tr class="template-upload fade in"><td style="width:25%; padding-left:20px;"><p class="name">'
										+ input.files[i].name
										+ '</p><strong class="error text-danger"></strong></td><td class="file_td_p" style="width:35%;"><p class="size">'
										+ (input.files[i].size / 1048576)
												.toFixed(2)
										+ 'MB</p>'
										+ '<div class="progress progress-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0">'
										+ '<div class="progress-bar progress-bar-success bg-yellow" style="width:0%;"></div></div></td><td style="width:40%" class="td_file">'
										+ '<button class="btn cancel btn-file-remove" style="display:table-cell" onclick="User.prototype.removeFile($(this))"><span>cancel</span></button></tr>');
			});
};

User.prototype.removeFileList = function() {
	var tr = $(".files tr");
	var fileTable = $(".file-table");

	tr.remove();
	fileTable.css("margin", "0px");

	storedFiles = [];
};

User.prototype.removeFile = function(panel) {
	var root = panel.parent().parent();
	var targetFile = root.find(".name").text();

	for (var i = 0; i < storedFiles.length; i++) {
		var file = storedFiles[i];

		if (file.name == targetFile) {
			storedFiles.splice(i, 1);
			break;
		}
	}

	root.remove();
};

User.prototype.writeNotice = function() {
	var message = "";

	var title = $('#noticeTitle').val();
	var content = $('#noticeContent').val();
	content = content.replace(/(?:\r\n|\r|\n)/g, '<br />');

	if (title == null || title == "") {
		$('#noticeTitle').focus();
		message = "공지사항 제목을 입력하세요.";
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	if (content == null || content == "") {
		$('#noticeContent').focus();
		message = "공지사항 내용을 입력하세요.";
		Common.prototype.showMessgeInTooltip(message);
		return false;
	}

	var data = {
		title : title,
		content : content
	};

	var flag;
	data = JSON.stringify(data);

	$.ajax({
		async : false,
		url : "/office/company/notification/new",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',

		success : function(response) {
			$("#noticeIdx").val(response);
			flag = true;
		},

		error : function(request, status, error) {

		}
	});

	return flag;
};

User.prototype.uploadFiles = function(index) {
	var tr = $(".files tr");
	var rowCount = tr.length;
	var noticeIdx = $("#noticeIdx").val();

	var moveLink = "/office/company/notification/" + noticeIdx;
	if (0 == rowCount) {
		window.location.href = moveLink;
		return false;
	}

	if (storedFiles.length != rowCount) {
		$(".overlay").hide();
		return false;
	}

	var target = tr.eq(index);
	var bar = target.find(".progress-bar");
	var file = storedFiles[index];

	var formData = new FormData();
	formData.append("file", file);

	$.ajax({
		url : "/office/company/notification/" + noticeIdx + "/file",
		type : 'POST',
		xhr : function() {

			myXhr = $.ajaxSettings.xhr();
			if (myXhr.upload) {
				myXhr.upload.addEventListener('progress', function(evt) {
					if (evt.lengthComputable) {
						var pct = evt.loaded / evt.total;

						bar.css({
							width : pct * 100 + '%'
						});

					}
				}, false);
			}
			return myXhr;
		},
		data : formData,
		dataType : 'text',
		processData : false,
		contentType : false,
		success : function(response) {
			if (response == "success") {
				if (index < (storedFiles.length - 1)) {
					index++;
					User.prototype.uploadFiles(index);
				} else {
					storedFiles = [];
					window.location.href = moveLink;
				}
			} else {

			}
		},
		error : function(jqXHR) {
			console.log('error');
		},
	});
};

User.prototype.deleteNotice = function() {
	var noticeIdx = $("#noticeIdx").val();

	$.ajax({
		url : "/office/company/notification/" + noticeIdx,
		type : 'DELETE',
		dataType : 'text',
		success : function(response) {
			window.location.href = "/office/company/notification";
		},

		error : function(request, status, error) {

		}
	});

};

User.prototype.moveNoticeView = function() {
	window.location.href = "/office/company/notification";
};

User.prototype.sendEmailByResetPassword = function() {
	var emailInput = $("#reset_password_email");
	var email = emailInput.val();

	var box = $('.box_alert_message');

	if (!Common.prototype.isEmail(email)) {
		var inputBox = $('#email');
		message = '이메일 형식이 올바르지 않습니다.';
		box.show();
		box.text(message);

		return false;
	}

	var data = {
		email : email
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/account/password/reset/email",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("success" == response) {
				emailInput.val("");

				var message = '비밀번호 초기화 링크를 입력하신 이메일로 전송해드렸어요. '
						+ '링크를 이용하여 비밀번호는 초기화하세요.';
				box.show();
				box.text(message);

				setTimeout(function() {
					location.href = "/office/login";
				}, 7000);
			} else {
				var message = '입력하신 아이디는 존재하지 않습니다.';
				box.show();
				box.text(message);
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.updateUserByResetPassword = function() {
	var userIdx = $("#userIdx").val();
	var newPassword = $("#newPassword").val();
	var confirmNewPassword = $("#confirmNewPassword").val();

	if (!Common.prototype.isPassword(newPassword)) {
		var inputBox = $('#newPassword');
		message = '비밀번호는 영문(대소문자구분),숫자,특수문자(~!@#$%^&*()-_? 만 허용)를 혼용하여 8~16자를 입력해주세요.'
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	if (newPassword != confirmNewPassword) {
		var inputBox = $('#confirmNewPassword');
		message = '비밀번호가 일치하지 않아요.'
		User.prototype.showSignupValidationMessage(message, inputBox);
		return false;
	}

	var data = {
		userIdx : userIdx,
		password : newPassword
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/account/password/reset",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			location.href = "/office/login";
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.findUser = function() {
	var keyword = $("#users_search_bar").val();

	if (keyword != null && keyword != "") {
		$("#usersForm").submit();
	} else {
		$('#users_search_bar').focus();
		message = '이름을 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
	}
};

User.prototype.showUsers = function() {
	var pageTag = $("#users_page");
	var offset = (parseInt(pageTag.val()) + 1);

	pageTag.val(offset);

	$.ajax({
		url : "/office/users/paging?offset=" + offset,
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var users = response;
			var target = $("#users_box");

			if (0 < users.length) {
				for (var i = 0; i < users.length; i++) {
					var user = users[i];

					User.prototype.appendUser(target, user);
				}
			}
		},

		error : function(request, status, error) {

		}
	});
};

User.prototype.appendUser = function(target, user) {
	var emailArray = user.email.split("@");
	var id = emailArray[0];
	var emailAddress = emailArray[1];
	var extensionNumber = user.extensionNumber;

	if (extensionNumber == null) {
		extensionNumber = "";
	}

	// class="fs13" <span class="fs13">' user.positionName'</span> profileImage,
	// thumbNail
	var html = '<div class="col-md-2 card_container users_card_container" onclick="User.prototype.reverseUserCard($(this))">'
			+ '<div class="item_user_card"><div class="front" style="display: block;">'
			+ '<div class="front_img"><div class="thumbnail-wrapper">'

			+ '<div class="thumbnail-inner"><div class="user_centered">'
			+ '<img src="/office'
			+ user.thumbNail
			+ '" /></div></div></div></div>'

			+ '<div class="front_text"><span>'
			+ user.teamName
			+ '</span><span class="fs13">'
			+ user.name
			+ '</span>'
			+ '<span class="fs13"> '
			+ user.rankName
			+ '</span></div></div>'

			+ '<div class="back pt40"><div class="col-md-12 fs13 mgb07 ft_nanum">'
			+ '<div class="col-md-3 p0 L"><span class="fs12 bold">아이디</span></div>'
			+ '<div class="col-md-9 L"><span class="fs12" style="word-break: break-word;">'
			+ id
			+ '</span>'
			+ '</div></div><div class="col-md-12 fs13 mgb07 ft_nanum">'
			+ '<div class="col-md-3 p0 L"><span class="fs12 bold">직책</span></div>'
			+ '<div class="col-md-9 L"><span class="fs12" style="word-break: break-word;">'
			+ user.positionName
			+ '</span></div></div>'
			+ '<div class="col-md-12 fs13 mgb07 ft_nanum"><div class="col-md-3 p0 L">'
			+ '<span class="fs12 bold">입사일</span></div><div class="col-md-9 L"><span class="fs12">'
			+ user.dateHired
			+ '</span>'
			+ '</div></div>'
			// + '<div class="col-md-12 fs13 mgb07 ft_nanum">'
			// + '<div class="col-md-3 p0 L"><span class="fs11
			// bold">생일</span></div>'
			// + '<div class="col-md-9 L"><span class="fs11">'
			// + user.birth
			// + '</span></div></div>'
			+ '<div class="col-md-12 fs13 mgb07 ft_nanum"><div class="col-md-3 p0 L">'
			+ '<span class="fs11 bold">내선번호</span></div><div class="col-md-9 L">'
			+ '<span class="fs12">'
			+ extensionNumber
			+ '</span></div></div>'
			+ '<div class="col-md-12 fs13 mgb07 ft_nanum"><div class="col-md-3 p0 L">'
			+ '<span class="fs11 bold">이동전화</span></div><div class="col-md-9 L">'
			+ '<span class="fs12">'
			+ user.phoneNumber
			+ '</span></div></div>'
			+ '<div class="col-md-12 email_at_id">'
			+ emailAddress
			+ '</div>'
			+ '</div></div><div class="shine"></div></div>';

	target.append(html);
};

User.prototype.reverseUserCard = function(target) {
	var userCard = target.find('.item_user_card');

	userCard.toggleClass('flipped');
	var hasFlip = userCard.hasClass('flipped');

	if (hasFlip) {
		userCard.css('border-top', 'none');
		userCard.css('border-bottom', '40px solid #999')
		target.find('.front').hide();
		target.find('.back').show();
	} else {
		userCard.css('border-bottom', 'none');
		userCard.css('border-top', '25px solid #999');
		target.find('.front').show();
		target.find('.back').hide();
	}
};

User.prototype.searchUsers = function() {
	var target = $("#users_box");
	var users = $("#users_json").val();

	users = JSON.parse(users);

	if (0 < users.length) {
		if (0 < users.length) {
			for (var i = 0; i < users.length; i++) {
				var user = users[i];

				User.prototype.appendUser(target, user);
			}
		}
	}
};

User.prototype.setUsers = function() {
	var json = $("#users_json").val();

	if (null != json && "" != json) {
		User.prototype.searchUsers();
	} else {
		User.prototype.showUsers();

		$(window).scroll(
				function() {
					if ($(document).height() - $(window).height() == $(window)
							.scrollTop()) {
						User.prototype.showUsers();
					}
				});
	}
}
