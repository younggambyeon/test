var Admin = function() {

}

/* --- company --- */
Admin.prototype.addCompany = function() {
	var name = $("#companyName").val();

	var tel1 = $("#company_tel_1").val();
	var tel2 = $("#company_tel_2").val();
	var tel3 = $("#company_tel_3").val();

	var address = $("#companyAddress").val();
	var tel = tel1 + "-" + tel2 + "-" + tel3;

	var file = $("#logoFile")[0].files[0];

	var box = $('.admin_box_alert');
	box.css('width', '45%');

	// validation
	if (file == null || file == "") {
		var message = '로고 이미지 등록이 필요합니다.';
		box.show();
		box.text(message);
		return false;
	}

	if (name == null || name == "") {
		var message = '회사명을 입력해주세요.';
		box.show();
		box.text(message);
		$("#companyName").focus();
		return false;
	}

	// if (!Common.prototype.isOnlyCharacter(name)) {
	// alert('한글 또는 영문만 입력해주세요.');
	// $("#companyName").focus();
	// return false;
	// }

	if ("" == name || null == name) {
		var message = '회사명을 입력해주세요.';
		box.show();
		box.text(message);
		$("#companyName").focus();
		return false;
	}

	if (!Common.prototype.isTelephone(tel)) {
		var message = '전화번호가 올바르지 않습니다.';
		box.show();
		box.text(message);
		$("#company_tel_1").focus();
		return false;
	}

	if (address == null || address == "") {
		var message = '주소를 입력해주세요.';
		box.show();
		box.text(message);
		$("#companyAddress").focus();
		return false;
	}

	var formData = new FormData();
	formData.append("file", file);
	formData.append("name", name);
	formData.append("tel", tel);
	formData.append("address", address);

	$.ajax({
		url : "/office/admin/company",
		type : 'POST',
		data : formData,
		enctype : 'multipart/form-data',
		processData : false,
		contentType : false,
		dataType : 'text',
		success : function(response) {
			if ("save to logo failed" == response) {
				var message = '로고 이미지 저장에 실패하였습니다. 잠시 후 다시 시도해주세요.';
				box.show();
				box.text(message);
				return false;

			} else if ("address lookup failed" == response) {
				var message = '정확한 주소 정보가 필요합니다. 검색을 이용하여 주소를 입력하세요.';
				box.show();
				box.text(message);
				$("#companyAddress").focus();
				return false;
			}

			document.location.href = "/office/admin/company/settings";
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.uploadLogoImage = function() {
	var idx = $("#adminCompanyIdx").val();
	var file = $("#logoFile")[0].files[0];

	if (file == undefined) {
		return false;
	}

	var formData = new FormData();
	formData.append("file", file);

	$.ajax({
		url : "/office/admin/company/" + idx + "/logo",
		type : 'POST',
		data : formData,
		processData : false,
		contentType : false,
		dataType : 'text',
		success : function(response) {
			if ("save to logo failed" == response) {
				var box = $('.admin_box_alert');
				var message = '로고 이미지 저장에 실패하였습니다. 잠시 후 다시 시도해주세요.';
				box.css('z-index', '1000010');
				box.show();
				box.text(message);
				return false;

			} else if ("fail" == response) {
				var box = $('.admin_box_alert');
				var message = '잘못된 접근입니다.';
				box.css('z-index', '1000010');
				box.show();
				box.text(message);
				return false;
			}

			window.location.reload();
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.modifyCompany = function() {
	var idx = $("#adminCompanyIdx").val();
	var name = $("#companyName").val();

	var tel1 = $("#company_tel_1").val();
	var tel2 = $("#company_tel_2").val();
	var tel3 = $("#company_tel_3").val();

	var address = $("#companyAddress").val();
	var tel = tel1 + "-" + tel2 + "-" + tel3;

	// var file = $("#logoFile")[0].files[0];

	var box = $('.admin_box_alert');
	box.css('width', '45%');

	// validation
	if (name == null || name == "") {
		var message = '회사명을 입력해주세요.';
		box.show();
		box.text(message);
		$("#companyName").focus();
		return false;
	}

	// if (!Common.prototype.isOnlyCharacter(name)) {
	// alert('한글 또는 영문만 입력해주세요.');
	// $("#companyName").focus();
	// return false;
	// }
	if ("" == name || null == name) {
		var message = '회사명을 입력해주세요.';
		box.show();
		box.text(message);
		$("#companyName").focus();
		return false;
	}

	if (!Common.prototype.isTelephone(tel)) {
		var message = '전화번호가 올바르지 않습니다.';
		box.show();
		box.text(message);
		$("#company_tel_1").focus();
		return false;
	}

	if (address == null || address == "") {
		var message = '주소를 입력해주세요.';
		box.show();
		box.text(message);
		$("#companyAddress").focus();
		return false;
	}

	var data = {
		name : name,
		tel : tel,
		address : address
	}

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/admin/company/" + idx,
		type : 'PATCH',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("address lookup failed" == response) {
				var message = '정확한 주소 정보가 필요합니다. 검색을 이용하여 주소를 입력하세요.';
				box.show();
				box.text(message);
				$("#companyAddress").focus();
				return false;
			} else if ("success" == response) {
				document.location.href = "/office/admin/company/settings";
			}
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.showAdressInformation = function(panel) {
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

			panel.val(fullAddr);
		}
	}).open();
};

Admin.prototype.drawImage = function() {
	var file = document.querySelector('#logoFile');

	var fileList = file.files;

	var reader = new FileReader();
	reader.readAsDataURL(fileList[0]);

	reader.onload = function() {
		document.querySelector('#logoImage').src = reader.result;
		document.querySelector('#profile_picture').src = reader.result;
	};

	Admin.prototype.setPopupDesign($(".company_logo_button"));
};

Admin.prototype.drawLogoImage = function() {
	var reader = new FileReader();
	var targetFile = $("#logoFile")[0].files[0];
	reader.readAsDataURL(targetFile);

	reader.onload = function() {
		document.querySelector('#logoImage').src = reader.result;
		document.querySelector('#profile_picture').src = reader.result;
	};

	Admin.prototype.setPopupDesign($(".company_logo_button"));
};

Admin.prototype.setPopupDesign = function(button) {
	// set design
	var uploadButton = button;
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
};

Admin.prototype.moveCompanyModificationView = function(idx) {
	document.location.href = "/office/admin/company/" + idx + "/modification";
};

Admin.prototype.moveTeamViewByCompanyIdx = function(panel) {
	var input = panel.find("input");
	var companyIdx = input.val();

	$.ajax({
		url : "/office/admin/company/" + companyIdx + "/cookie",
		type : 'POST',
		dataType : 'text',
		success : function(response) {
			if ("fail" == response) {
				var message = '다시 시도해주세요.';
				var box = $('.admin_box_alert');
				box.show();
				box.text(message);
				return false;

			} else if ("success" == response) {
				document.location.href = "/office/admin/team";
			}
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.deleteCompany = function(companyIdx) {
	$.ajax({
		url : "/office/admin/company/" + companyIdx,
		type : 'DELETE',
		dataType : 'text',
		success : function(response) {
			window.location.reload();
		},

		error : function(request, status, error) {

		}
	});
}

/* --- group place --- */

Admin.prototype.drawPlaceImage = function() {
	var file = document.querySelector('#placeFile');

	var fileList = file.files;

	var reader = new FileReader();
	reader.readAsDataURL(fileList[0]);

	reader.onload = function() {
		document.querySelector('#placeImage').src = reader.result;
		document.querySelector('#profile_picture').src = reader.result;
	};

	Admin.prototype.setPopupDesign($("#admin_upload_place_img_button"));
};

Admin.prototype.showGroupPlaceCard = function() {
	var pageTag = $("#admin_group_place_page");
	var offset = (parseInt(pageTag.val()) + 1);

	pageTag.val(offset);

	var limit = 8;

	$.ajax({
		url : "/office/admin/group/place/paging?offset=" + offset + "&limit="
				+ limit,
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var places = response;
			var target = $("#admin_group_place_box");

			if (0 < places.length) {
				for (var i = 0; i < places.length; i++) {
					var place = places[i];

					Admin.prototype.appendGroupPlaceCard(target, place);

				}

				$('img.lazy').lazyload({
					placeholder : "/office/custom/img/spinner.gif"
				});
			}
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.appendGroupPlaceCard = function(target, place) {
	// class="thumbnail-box" 추가

	var html = '<div class="col-md-3 place">'
			+ '<div class="groupPlace__wrapper">'
			+ '<div class="col-md-12 groupPlace__wrapper--close" onclick="Admin.prototype.removeGroupPlaceCard('
			+ place.idx
			+ ', $(this))">'
			+ '<p class="addGroupSpace__button--remove">X</p>'
			+ '</div><div style="padding: 5px 12px 6px 12px;">'
			+ '<a><img data-original="/office'
			+ place.imagePath
			+ '" class="lazy place__img" /></a>'
			+ '</div><div class="place__button__wrapper">'
			+ '<div class="place__button--brain" onclick="Admin.prototype.moveGroupPlaceBrainSettingViews()">'
			+ '<i class="fa fa-cog"></i></div>'
			+ '<div class="place__button--edit" onclick="Admin.prototype.moveGroupPlaceEditionViews('
			+ place.idx + ')"><i class="fa fa-pencil"></i></div></div>'
			+ '<div class="thumb-pane p10"><h3 class="place__title"><span>'
			+ place.name + '</span></h3></div></div></div>';

	target.append(html);
};

Admin.prototype.removeGroupPlaceCard = function(idx, div) {
	event.stopPropagation();

	$.ajax({
		url : "/office/admin/group/place/" + idx,
		type : 'DELETE',
		dataType : 'text',
		success : function(response) {
			if ("success" == response) {
				var root = div.parent().parent();
				root.remove();
			} else {
				var box = $('.admin_box_alert');
				var message = '잠시 후 다시 시도해주세요.';
				box.show();
				box.text(message);

				return false;
			}

		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.isPlaceNameDuplication = function(companyIdx, placeName) {
	var responseString = null;

	$.ajax({
		async : false,
		url : "/office/admin/company/" + companyIdx + "/place/duplication",
		type : 'GET',
		data : {
			placeName : placeName
		},
		dataType : 'text',
		success : function(response) {
			responseString = response;
		},

		error : function(request, status, error) {

		}
	});

	return responseString;
};

Admin.prototype.addGroupPlace = function() {
	var file = $("#placeFile")[0].files[0];

	var name = $("#placeName").val();
	var type = $("#admin_place_type option:selected").val();

	// validation
	if (file == null || file == "") {
		var box = $('.admin_box_alert');
		var message = '장소 이미지 등록이 필요합니다.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		return false;
	}

	if (name == null || name == "") {
		var box = $('.admin_box_alert');
		var message = '장소명을 입력해주세요.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		$("#placeName").focus();
		return false;
	}

	var companyIdx = $("#admin_common_company_idx").val();
	var response = Admin.prototype.isPlaceNameDuplication(companyIdx, name);
	if ("fail" == response) {
		var box = $('.admin_box_alert');
		var message = '잠시 후 시도해주세요.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		return false;
	} else if ("duplication" == response) {
		var box = $('.admin_box_alert');
		var message = '이미 존재하는 장소명입니다.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		$("#placeName").focus();
		return false;
	}

	Admin.prototype.showSpinner();

	var formData = new FormData();
	formData.append("file", file);
	formData.append("name", name);
	formData.append("type", type);

	$('.overlay').show();
	$('#loading-img').show();

	$.ajax({
		url : "/office/admin/group/place",
		type : 'POST',
		data : formData,
		enctype : 'multipart/form-data',
		processData : false,
		contentType : false,
		dataType : 'text',
		success : function(response) {
			if ("save to image failed" == response) {
				var box = $('.admin_box_alert');
				var message = '장소 이미지 저장에 실패하였습니다. 잠시 후 다시 시도해주세요.';
				box.show();
				box.text(message);
				Admin.prototype.hideSpinner();
				return false;
			} else {
				window.location.reload();
			}
		},
		error : function(request, status, error) {
			Admin.prototype.hideSpinner();
		}
	});
};

Admin.prototype.hideSpinner = function() {
	$('.addGroupSpace__popup').css('z-index', '1010');
	$('.overlay').hide();
	$('#loading-img').hide();
};

Admin.prototype.showSpinner = function() {
	$('.addGroupSpace__popup').css('z-index', '1000');
	$('.overlay').show();
	$('.overlay').css('background', '#fff');
	$('#loading-img').show();
};

Admin.prototype.moveGroupPlaceEditionViews = function(idx) {
	window.location.href = "/office/admin/group/place/" + idx;
};

Admin.prototype.moveGroupPlaceBrainSettingViews = function() {
	window.location.href = "/office/admin/group/place/brain";
};

Admin.prototype.editGroupPlace = function() {
	var idx = $('#placeIdx').val();
	var name = $('#groupPlaceName').val();
	var type = $('select[name=somename]').val();
	var box = $('.admin_box_alert');

	// validation
	if (name == null || name == "") {
		var message = '장소명을 입력해주세요.';
		box.css('z-index', '1000010');
		box.css('width', '50%');
		box.show();
		box.text(message);
		$("#placeName").focus();
		return false;
	}

	var companyIdx = $("#admin_common_company_idx").val();
	var response = Admin.prototype.isPlaceNameDuplication(companyIdx, name);
	if ("fail" == response) {
		var message = '잠시 후 시도해주세요.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		return false;

	} else if ("duplication" == response) {
		var message = '이미 존재하는 장소명입니다.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		$("#placeName").focus();
		return false;
	}

	var jdata = {
		name : name,
		type : type
	}

	$.ajax({
		type : "PATCH",
		dataType : "text",
		url : "/office/admin/group/place/" + idx,
		data : JSON.stringify(jdata),
		contentType : "application/json",
		success : function(result) {
			if (result == "success") {
				location.reload();
			}
		}
	});
};

Admin.prototype.changeGroupPlaceImage = function() {
	var idx = $('#placeIdx').val();
	var formData = new FormData();

	formData.append("file", $("#logoFile")[0].files[0]);

	$.ajax({
		url : '/office/admin/group/place/' + idx,
		processData : false,
		contentType : false,
		data : formData,
		type : 'POST',
		success : function(result) {
			$("#my-dialog,#dialog-background").hide();
		}
	});
}

/* --- position --- */

Admin.prototype.removePositionTag = function(panel) {
	var positionIdx = panel.siblings('.position').val();
	var positionBlank = $('.position__block--blank');

	for (var i = 0; i < positionBlank.size(); i++) {
		var item = positionBlank.eq(i);
		var input = item.find('.position');
		var idx = input.val();

		if (positionIdx == idx) {
			item.addClass('position__block');
			item.removeClass('position__block--blank');
		}
	}

	panel.closest('.position__table').remove();
};

Admin.prototype.addPositionTag = function(panel) {
	var position = panel.find('span').text();
	var positionIdx = panel.find('.position').val();

	$('.position__block__wrapper')
			.append(
					'<table class="position__table">'
							+ '<tbody><tr><td><div class="position__block--selected"><span>'
							+ position
							+ '</span>'
							+ '<input type="hidden" value="'
							+ positionIdx
							+ '" class="position" />'
							+ '<span class="position__block--remove" onclick="Admin.prototype.removePositionTag($(this))">X</span>'
							+ '</div></td></tr></tbody></table>');

	panel.removeClass('position__block');
	panel.addClass('position__block--blank');
};

Admin.prototype.clickPositionModificationButton = function(panel) {
	var companyIdx = $("#adminCompanyIdx").val();
	var buttonText = panel.text();

	if (buttonText == '수정') {
		$('.position__block--remove').show();
		$('.direct_input').css('visibility', 'visible');
		$('.position__wrapper').find('.overwrap').remove();
		panel.text('');
		panel.text('저장');

	} else if (buttonText == '저장') {
		var positionBlank = $('.position__block--blank');
		var positionArray = new Array();

		for (var i = 0; i < positionBlank.size(); i++) {
			var item = positionBlank.eq(i);
			var input = item.find('.position');
			var positionIdx = input.val();

			var data = {
				companyIdx : companyIdx,
				positionIdx : positionIdx
			}
			positionArray.push(data);
		}

		data = JSON.stringify(positionArray);

		$.ajax({
			url : "/office/admin/position",
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
};

Admin.prototype.showPositionPopup = function() {
	$('.addPosition__popup').show();
	$('#input_position').val('');
	$('#input_position').focus();
	$('.overlay').show();
	$('.overlay').css('background', '#9c9c9c');
};

Admin.prototype.appendNewPositionCard = function(positionName, positionIdx) {
	$('.position__wrapper--default')
			.append(
					'<div class="position__block blinkcss" onclick="Admin.prototype.addPositionTag($(this))"><span>'
							+ positionName
							+ '</span> <input type="hidden" class="position" value="'
							+ positionIdx + '" /></div>');
};

Admin.prototype.addNewPosition = function() {
	// set design
	$('.addPosition__popup').css('display', 'none');
	$('.overlay').hide();

	var positionName = $('#input_position').val();

	// validation
	if (null == positionName || "" == positionName) {
		var message = '추가하실 직책을 입력해주세요.';
		var box = $('.admin_box_alert');
		box.show();
		box.text(message);
		return false;
	}

	var data = {
		name : positionName
	}

	data = JSON.stringify(data);

	$.ajax({
		async : false,
		url : "/office/admin/position",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("duplication" == response) {
				var message = '이미 존재하는 직책입니다.';
				var box = $('.admin_box_alert');
				box.show();
				box.text(message);
				return false;
			}

			Admin.prototype.appendNewPositionCard(positionName, response);

			setTimeout('Admin.prototype.removePositionEffect()', 5000);
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.removePositionEffect = function() {
	$('.position__wrapper--default').find('.position__block').removeClass(
			'blinkcss');
};

/* --- rank --- */

Admin.prototype.removeRankTag = function(panel) {
	var rankIdx = panel.siblings('.rank').val();
	var rankBlank = $('.rank__block--blank');

	for (var i = 0; i < rankBlank.size(); i++) {
		var item = rankBlank.eq(i);
		var input = item.find('.rank');
		var idx = input.val();

		if (rankIdx == idx) {
			item.addClass('rank__block');
			item.removeClass('rank__block--blank');
		}
	}

	panel.closest('.rank__table').remove();
};

Admin.prototype.addRankTag = function(panel) {
	var rank = panel.find('span').text();
	var rankIdx = panel.find('.rank').val();

	$('.rank__block__wrapper')
			.append(
					'<table class="rank__table">'
							+ '<tbody><tr><td><div class="rank__block--selected"><span>'
							+ rank
							+ '</span>'
							+ '<input type="hidden" value="'
							+ rankIdx
							+ '" class="rank" />'
							+ '<span class="rank__block--remove" onclick="Admin.prototype.removeRankTag($(this))">X</span>'
							+ '</div></td></tr></tbody></table>');

	panel.removeClass('rank__block');
	panel.addClass('rank__block--blank');
};

Admin.prototype.clickRankModificationButton = function(panel) {
	var companyIdx = $("#adminCompanyIdx").val();
	var buttonText = panel.text();

	if (buttonText == '수정') {
		$('.rank__block--remove').show();
		$('.direct_input').css('visibility', 'visible');
		$('.rank__wrapper').find('.overwrap').remove();
		panel.text('');
		panel.text('저장');

	} else if (buttonText == '저장') {
		var rankBlank = $('.rank__block--blank');
		var rankArray = new Array();

		for (var i = 0; i < rankBlank.size(); i++) {
			var item = rankBlank.eq(i);
			var input = item.find('.rank');
			var rankIdx = input.val();

			var data = {
				companyIdx : companyIdx,
				rankIdx : rankIdx
			}
			rankArray.push(data);
		}

		data = JSON.stringify(rankArray);

		$.ajax({
			url : "/office/admin/rank",
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
};

Admin.prototype.showRankPopup = function() {
	$('.addRank__popup').show();
	$('#input_rank').val('');
	$('#input_rank').focus();
	$('.overlay').show();
	$('.overlay').css('background', '#9c9c9c');
};

Admin.prototype.appendNewRankCard = function(rankName, rankIdx) {
	$('.rank__wrapper--default')
			.append(
					'<div class="rank__block blinkcss" onclick="Admin.prototype.addRankTag($(this))"><span>'
							+ rankName
							+ '</span> <input type="hidden" class="rank" value="'
							+ rankIdx + '" /></div>');

};

Admin.prototype.addNewRank = function() {
	// set design
	$('.addRank__popup').css('display', 'none');
	$('.overlay').hide();

	var rankName = $('#input_rank').val();

	// validation
	if (null == rankName || "" == rankName) {
		var message = '추가하실 직급을 입력해주세요.';
		var box = $('.admin_box_alert');
		box.show();
		box.text(message);
		return false;
	}

	var data = {
		name : rankName
	}

	data = JSON.stringify(data);

	$.ajax({
		async : false,
		url : "/office/admin/rank",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("duplication" == response) {
				var message = '이미 존재하는 직급입니다.';
				var box = $('.admin_box_alert');
				box.show();
				box.text(message);
				return false;
			}

			Admin.prototype.appendNewRankCard(rankName, response);

			setTimeout('Admin.prototype.removeRankEffect()', 5000);
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.removeRankEffect = function() {
	$('.position__wrapper--default').find('.position__block').removeClass(
			'blinkcss');
};

/* --- users --- */
Admin.prototype.showUsers = function() {
	var pageTag = $("#admin_users_page");
	var offset = (parseInt(pageTag.val()) + 1);

	pageTag.val(offset);

	$.ajax({
		url : "/office/admin/users/paging?offset=" + offset,
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var users = response;
			var target = $("#admin_users_box");

			if (0 < users.length) {
				for (var i = 0; i < users.length; i++) {
					var user = users[i];

					Admin.prototype.appendUserCard(target, user);
				}
			}
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.appendUserCard = function(target, user) {
	var html = '<div class="col-md-2 userBox__wrapper"><div class="userCard__box">'
			+ '<div class="userCard--top" style="display: block;"><div class="userCard__img--top front__img">'
			+ '<div class="thumbnail-wrapper" style="width: 71px;">'
			+ '<div class="thumbnail-inner">'
			+ '<div class="centered"><img src="/office'
			+ user.thumbNail
			+ '"  />'
			+ '</div></div></div></div><div class="userCard__text--top">'
			+ '<span>'
			+ user.teamName
			+ '</span> <span class="fs12">'
			+ user.name
			+ '</span>'
			+ '<span class="fs12"> '
			+ user.rankName
			+ '</span></div></div><div class="userCard--bottom">'
			+ '<button class="userCard__button--edit" onclick="Admin.prototype.moveUserModificationView('
			+ user.idx
			+ ')">수정</button>'
			+ '<button class="userCard__button--delete" onclick="Admin.prototype.showUserRemoverPopup('
			+ user.idx + ')">삭제</button>' + '</div></div></div>';

	target.append(html);
};

Admin.prototype.findUser = function() {
	var keyword = $("#admin_users_search_bar").val();

	if (keyword != null && keyword != "") {
		$("#adminUsersForm").submit();
	} else {
		$('#admin_users_search_bar').focus();
		message = '이름을 입력해주세요.';
		Common.prototype.showMessgeInTooltip(message);
	}
};

Admin.prototype.moveUserModificationView = function(userIdx) {
	window.location.href = "/office/admin/user/" + userIdx;
};

Admin.prototype.showUserRemoverPopup = function(userIdx) {
	$("#admin_remove_user_idx").val(userIdx);

	$('.deleteUser__popup').css('display', 'table');
	$('.overlay').show();
	$('.overlay').css('background', '#9c9c9c');

	event.stopPropagation();
};

Admin.prototype.deleteUser = function() {
	var userIdx = $("#admin_remove_user_idx").val();

	$.ajax({
		url : "/office/admin/user/" + userIdx,
		type : 'DELETE',
		success : function(response) {
			if ("fail" == response) {
				var box = $('.admin_box_alert');
				var message = '잘못된 접근입니다.';
				box.show();
				box.text(message);
				return false;

			} else {
				window.location.reload();
			}

		},

		error : function(request, status, error) {

		}
	});

}

Admin.prototype.searchUsers = function(json) {
	var target = $("#admin_users_box");
	var users = JSON.parse(json);

	if (0 < users.length) {
		for (var i = 0; i < users.length; i++) {
			var user = users[i];

			Admin.prototype.appendUserCard(target, user);
		}
	}
};

Admin.prototype.setUsers = function() {
	var json = $("#admin_users_json").val();

	if (null != json && "" != json) {
		Admin.prototype.searchUsers(json);
	} else {
		Admin.prototype.showUsers();

		$(window).scroll(
				function() {
					if ($(document).height() - $(window).height() == $(window)
							.scrollTop()) {
						Admin.prototype.showUsers();
					}
				});
	}
}

Admin.prototype.putUserInformation = function() {
	var gender = $("#admin_gender").val();
	var genderBox = $("#admin_user_gender option");

	for (var i = 0; i < genderBox.length; i++) {
		var option = genderBox.eq(i);

		if (gender == option.val()) {
			option.attr("selected", "selected");
		}
	}

	var role = $("#admin_role").val();
	var roleBox = $("#admin_user_role option");

	for (var i = 0; i < roleBox.length; i++) {
		var option = roleBox.eq(i);

		if (role == option.val()) {
			option.attr("selected", "selected");
		}
	}

	var birth = $("#admin_birth").val().split('-');
	var birthYear = birth[0];
	var birthMonth = birth[1];
	var birthDay = birth[2];

	$("#birth_year").val(birthYear);
	$("#birth_day").val(birthDay);

	var birthMonthBox = $("#admin_birth_month option");

	for (var i = 0; i < birthMonthBox.length; i++) {
		var option = birthMonthBox.eq(i);

		if (birthMonth == option.val()) {
			option.attr("selected", "selected");
		}
	}

	var dateHired = $("#admin_dateHired").val().split('-');
	var dateHiredYear = dateHired[0];
	var dateHiredMonth = dateHired[1];
	var dateHiredDay = dateHired[2];

	$("#dateHired_year").val(dateHiredYear);
	$("#dateHired_day").val(dateHiredDay);

	var dateHiredMonthBox = $("#admin_dateHired_month option");

	for (var i = 0; i < dateHiredMonthBox.length; i++) {
		var option = dateHiredMonthBox.eq(i);

		if (dateHiredMonth == option.val()) {
			option.attr("selected", "selected");
		}
	}

	var phoneNumber = $("#admin_phoneNumber").val().split('-');
	var phoneNumber1 = phoneNumber[0];
	var phoneNumber2 = phoneNumber[1];
	var phoneNumber3 = phoneNumber[2];

	$("#phone_number_1").val(phoneNumber1);
	$("#phone_number_2").val(phoneNumber2);
	$("#phone_number_3").val(phoneNumber3);
};

Admin.prototype.updateProfilePictureByDefualtImage = function(target) {
	var idx = $("#admin_userIdx").val();

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
			window.location.reload();
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.updateUserProfilePicture = function() {
	var idx = $("#admin_userIdx").val();
	var file = $("#filePhoto")[0].files[0];

	var formData = new FormData();
	formData.append("file", file);

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
				box.css('z-index', '1000010');
				box.show();
				box.text(message);
				return false;
			}
		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.editUser = function() {
	var userIdx = $("#admin_userIdx").val();

	var userName = $("#admin_userName").val();
	var gender = $("#admin_user_gender option:selected").val();

	var birthYear = $("#birth_year").val();
	var birthMonth = $("#admin_birth_month option:selected").val();
	var birthDay = $("#birth_day").val();

	var teamName = $("#admin_team option:selected").val();
	var positionName = $("#admin_position option:selected").val();
	var rankName = $("#admin_rank option:selected").val();

	var dateHiredYear = $("#dateHired_year").val();
	var dateHiredMonth = $("#admin_dateHired_month option:selected").val();
	var dateHiredDay = $("#dateHired_day").val();

	var extensionNumber = $("#admin_extensionNumber").val();

	var phoneNumber1 = $("#phone_number_1").val();
	var phoneNumber2 = $("#phone_number_2").val();
	var phoneNumber3 = $("#phone_number_3").val();

	var address = $("#admin_address").val();
	var role = $("#admin_user_role option:selected").val();

	// set
	var birth = birthYear + "-" + birthMonth + "-" + birthDay;
	var dateHired = dateHiredYear + "-" + dateHiredMonth + "-" + dateHiredDay;
	var phoneNumber = phoneNumber1 + "-" + phoneNumber2 + "-" + phoneNumber3;

	var box = $('.admin_box_alert');

	// validation
	if (userName == null || userName == "") {
		message = "이름을 입력해주세요.";
		box.show();
		box.text(message);
		$('#userName').focus();
		return false;
	}

	if (!Common.prototype.isOnlyCharacter(userName)) {
		message = "이름은 한글 또는 영문자만을 입력하세요.";
		box.show();
		box.text(message);
		$('#userName').focus();
		return false;
	}

	if (!Common.prototype.isDate(birth)) {
		message = '날짜 형식이 올바르지 않습니다.';
		box.show();
		box.text(message);
		$('#birth_year').focus();
		return false;
	}

	if (!Common.prototype.isDate(dateHired)) {
		message = '날짜 형식이 올바르지 않습니다.';
		box.show();
		box.text(message);
		$('#dateHired_year').focus();
		return false;
	}

	if (!Common.prototype.isPhone(phoneNumber)) {
		message = '핸드폰 번호가 올바르지 않습니다.';
		box.show();
		box.text(message);
		$('#phone_number_1').focus();
		return false;
	}

	var data = {
		name : userName,
		gender : gender,
		address : address,
		role : role,

		birth : birth,
		dateHired : dateHired,

		phoneNumber : phoneNumber,
		extensionNumber : extensionNumber,

		teamName : teamName,
		positionName : positionName,
		rankName : rankName
	};

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/admin/user/" + userIdx,
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

/* 사원 뱃지 기능 */
Admin.prototype.setUserBadge = function() {
	
};

Admin.prototype.joinUserSimple = function() {
	var email = $("#admin_email").val();
	var userName = $("#admin_userName").val();
	var teamIdx = $("#admin_team option:selected").val();

	var box = $('.admin_box_alert');

	if (email == null || email == "") {
		message = '아이디(이메일)을 입력해주세요.';
		box.show();
		box.text(message);
		return false;
	}

	if (!Common.prototype.isEmail(email)) {
		message = '이메일 형식이 올바르지 않습니다.';
		box.show();
		box.text(message);
		return false;
	}

	if (userName == null || userName == "") {
		message = "이름을 입력해주세요.";
		box.show();
		box.text(message);
		return false;
	}

	if (!Common.prototype.isOnlyCharacter(userName)) {
		message = "이름은 한글 또는 영문자만을 입력하세요.";
		box.show();
		box.text(message);
		return false;
	}

	var data = {
		email : email,
		name : userName,
		teamIdx : teamIdx
	};

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/admin/user/join/simple",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("duplication user" == response) {
				message = '생성하려는 아이디(이메일)은 이미 존재합니다.';
				box.show();
				box.text(message);
				return false;

			} else {
				window.location.href = "/office/admin/users";
			}
		},
		error : function(request, status, error) {

		}
	});
};

Admin.prototype.drawProfileImage = function() {
	var reader = new FileReader();
	var targetFile = $("#admin_profile_file")[0].files[0];
	reader.readAsDataURL(targetFile);

	reader.onload = function() {
		document.querySelector('#admin_profile_img').src = reader.result;
		document.querySelector('#profile_picture').src = reader.result;
	};

	// set design
	var uploadButton = $(".admin_detail_user_profile_button");
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
};

Admin.prototype.createDetilAccount = function() {
	var email = $("#admin_email").val();
	var userName = $("#admin_userName").val();
	var gender = $("#admin_user_gender option:selected").val();

	var birthYear = $("#birth_year").val();
	var birthMonth = $("#admin_birth_month option:selected").val();
	var birthDay = $("#birth_day").val();

	var dateHiredYear = $("#dateHired_year").val();
	var dateHiredMonth = $("#admin_dateHired_month option:selected").val();
	var dateHiredDay = $("#dateHired_day").val();

	var extensionNumber = $("#admin_extensionNumber").val();

	var phoneNumber1 = $("#phone_number_1").val();
	var phoneNumber2 = $("#phone_number_2").val();
	var phoneNumber3 = $("#phone_number_3").val();

	var address = $("#admin_address").val();
	var role = $("#admin_user_role option:selected").val();

	var birth = birthYear + "-" + birthMonth + "-" + birthDay;
	var dateHired = dateHiredYear + "-" + dateHiredMonth + "-" + dateHiredDay;
	var phoneNumber = phoneNumber1 + "-" + phoneNumber2 + "-" + phoneNumber3;

	var box = $('.admin_box_alert');

	// validation
	if (email == null || email == "") {
		message = '아이디(이메일)을 입력해주세요.';
		box.show();
		box.text(message);
		$("#admin_email").focus();
		return false;
	}

	if (!Common.prototype.isEmail(email)) {
		message = '이메일 형식이 올바르지 않습니다.';
		box.show();
		box.text(message);
		$("#admin_email").focus();
		return false;
	}

	if (userName == null || userName == "") {
		message = "이름을 입력해주세요.";
		box.show();
		box.text(message);
		$("#admin_userName").focus();
		return false;
	}

	if (!Common.prototype.isOnlyCharacter(userName)) {
		message = "이름은 한글 또는 영문자만을 입력하세요.";
		box.show();
		box.text(message);
		$("#admin_userName").focus();
		return false;
	}

	if (address == null || address == "") {
		message = '주소를 입력해주세요.';
		box.show();
		box.text(message);
		$("#address").focus();
		return false;
	}

	if (!Common.prototype.isDate(birth)) {
		message = '날짜 형식이 올바르지 않습니다.';
		box.show();
		box.text(message);
		$('#birth_year').focus();
		return false;
	}

	if (!Common.prototype.isDate(dateHired)) {
		message = '날짜 형식이 올바르지 않습니다.';
		box.show();
		box.text(message);
		$('#dateHired_year').focus();
		return false;
	}

	if (!Common.prototype.isPhone(phoneNumber)) {
		message = '핸드폰 번호가 올바르지 않습니다.';
		box.show();
		box.text(message);
		$('#phone_number_1').focus();
		return false;
	}

	// set
	var teamIdx = $("#admin_team option:selected").val();
	var positionIdx = $("#admin_position option:selected").val();
	var rankIdx = $("#admin_rank option:selected").val();

	var file = $("#admin_profile_file")[0].files[0];

	var formData = new FormData();
	formData.append("file", file);

	formData.append("email", email);
	formData.append("name", userName);
	formData.append("gender", gender);
	formData.append("address", address);
	formData.append("role", role);

	formData.append("birth", birth);
	formData.append("dateHired", dateHired);

	formData.append("phoneNumber", phoneNumber);
	formData.append("extensionNumber", extensionNumber);

	formData.append("teamIdx", teamIdx);
	formData.append("cPositionIdx", positionIdx);
	formData.append("cRankIdx", rankIdx);

	$.ajax({
		url : "/office/admin/user/join/detail",
		type : 'POST',
		data : formData,
		enctype : 'multipart/form-data',
		processData : false,
		contentType : false,
		dataType : 'text',
		success : function(response) {
			if ("duplication user" == response) {
				message = '생성하려는 아이디(이메일)은 이미 존재합니다.';
				box.show();
				box.text(message);
				$("#admin_email").focus();
				return false;

			} else {
				window.location.href = "/office/admin/users";
			}
		},
		error : function(request, status, error) {

		}
	});
};

Admin.prototype.setOrgChart = function() {
	var orgChart = $("#orgChart").val();
	var teamList = JSON.parse(orgChart);

	if (0 < teamList.length) {
		var container = $('#chart_team').orgChart({

			data : teamList,
			showControls : true,
			allowEdit : true,
			onAddNode : function(node) {
				container.newNode(node.data.id);
			},
			onDeleteNode : function(node) {
				Admin.prototype.removeTeamInOrgChart(node.data);
				container.deleteNode(node.data.id);
			}
		});
	}
};

Admin.prototype.startOrgChartCommit = function(node) {
	var data = JSON.stringify(node);
	var flag = false;

	$.ajax({
		async : false,
		url : "/office/admin/team",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("fail" == response) {
				var box = $('.admin_box_alert');
				var message = '잘못된 접근입니다.';
				box.show();
				box.text(message);
				return false;

			} else if ("duplication" == response) {
				var box = $('.admin_box_alert');
				var message = '해당 팀은 이미 존재합니다.';
				box.show();
				box.text(message);
				return false;

			} else {
				flag = true;
			}
		},
		error : function(request, status, error) {

		}
	});

	return flag;
};

Admin.prototype.removeTeamInOrgChart = function(node) {
	var data = JSON.stringify(node);

	$.ajax({
		url : "/office/admin/team",
		type : 'DELETE',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			if ("fail" == response) {
				var box = $('.admin_box_alert');
				var message = '잘못된 접근입니다.';
				box.show();
				box.text(message);
			}
		},
		error : function(request, status, error) {

		}
	});
};

/* ---- company place ---- */

Admin.prototype.showPlaceCard = function() {
	var pageTag = $("#admin_place_page");
	var offset = (parseInt(pageTag.val()) + 1);

	pageTag.val(offset);

	var limit = 8;

	$
			.ajax({
				url : "/office/admin/place/paging?offset=" + offset + "&limit="
						+ limit,
				type : 'GET',
				dataType : 'json',
				success : function(response) {
					var places = response;
					var target = $("#admin_place_box");

					if (0 < places.length) {
						for (var i = 0; i < places.length; i++) {
							var place = places[i];

							Admin.prototype.appendPlaceCard(target, place);

						}

						$('img.lazy').lazyload({
							placeholder : "/office/custom/img/spinner.gif"
						});
					}
				},

				error : function(request, status, error) {

				}
			});
};

Admin.prototype.appendPlaceCard = function(target, place) {
	// class= pt05

	var html = '<div class="col-md-3 place"><div class="place__wrapper">'
			+ '<div class="col-md-12 place__wrapper--close" onclick="Admin.prototype.removePlaceCard('
			+ place.idx
			+ ', $(this))">'
			+ '<p class="addSpace__button--remove">X</p></div>'
			+ '<div style="padding: 5px 12px 6px 12px;"><a>'
			+ '<img data-original="/office'
			+ place.imagePath
			+ '" class="lazy place__img pt05" /></a>'
			+ '</div><div class="place__button__wrapper">'
			+ '<div class="place__button--brain" onclick="Admin.prototype.goPlaceBrainView()">'
			+ '<i class="fa fa-cog"></i></div>'
			+ '<div class="place__button--edit" onclick="Admin.prototype.goPlaceEditView('
			+ place.idx + ')"><i class="fa fa-pencil"></i></div></div>'
			+ '<div class="thumb-pane p10"><h3 class="place__title"><span>'
			+ place.name + '</span></h3></div></div></div>';

	target.append(html);
};

Admin.prototype.removePlaceCard = function(idx, div) {
	$.ajax({
		url : "/office/admin/place/" + idx,
		type : 'DELETE',
		dataType : 'text',
		success : function(response) {
			if ("success" == response) {
				var root = div.parent().parent();
				root.remove();

			} else {
				var box = $('.admin_box_alert');
				var message = '잠시 후 다시 시도해주세요.';
				box.show();
				box.text(message);
				return false;
			}

		},

		error : function(request, status, error) {

		}
	});
};

Admin.prototype.addPlace = function() {
	Admin.prototype.showSpinner();
	var file = $("#placeFile")[0].files[0];

	var name = $("#placeName").val();
	var type = $("#admin_place_type option:selected").val();
	var box = $('.admin_box_alert');

	// validation
	if (file == null || file == "") {
		var message = '장소 이미지 등록이 필요합니다.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		return false;
	}

	if (name == null || name == "") {
		message = '장소명을 입력해주세요.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		$("#placeName").focus();
		return false;
	}

	var companyIdx = $("#admin_company_idx").val();
	var response = Admin.prototype.isPlaceNameDuplication(companyIdx, name);
	if ("fail" == response) {
		var message = '잠시 후 시도해주세요.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		return false;
	} else if ("duplication" == response) {
		var message = '이미 존재하는 장소명입니다.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		$("#placeName").focus();
		return false;
	}

	var formData = new FormData();
	formData.append("file", file);
	formData.append("name", name);
	formData.append("type", type);

	$('.overlay').show();
	$('.overlay').css('z-index', '1020');
	$('.overlay').css('background', '#fff');
	$('#loading-img').show();
	$('#loading-img')
			.css('background',
					'url("/office/design/img/loader-black.gif") center center no-repeat')

	$.ajax({
		url : "/office/admin/place",
		type : 'POST',
		data : formData,
		enctype : 'multipart/form-data',
		processData : false,
		contentType : false,
		dataType : 'text',
		success : function(response) {
			if ("save to image failed" == response) {
				message = '장소 이미지 저장에 실패하였습니다. 잠시 후 다시 시도해주세요.';
				box.css('z-index', '1000010');
				box.show();
				box.text(message);
				Admin.prototype.hideSpinner();
				return false;

			} else {
				window.location.reload();
			}
		},
		error : function(request, status, error) {
			Admin.prototype.hideSpinner();
		}
	});
};

Admin.prototype.goPlaceEditView = function(idx) {
	window.location.href = "/office/admin/place/" + idx;
};

Admin.prototype.goPlaceBrainView = function(idx) {

}

Admin.prototype.editPlace = function() {
	var idx = $('#placeIdx').val();
	var name = $('#placeName').val();
	var type = $('select[name=somename]').val();
	var box = $('.admin_box_alert');

	if (name == null || name == "") {
		var message = '장소명을 입력해주세요.';
		box.show();
		box.text(message);
		$("#placeName").focus();
		return false;
	}

	var companyIdx = $("#admin_company_idx").val();
	var response = Admin.prototype.isPlaceNameDuplication(companyIdx, name);
	if ("fail" == response) {
		var message = '잠시 후 시도해주세요.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		return false;
	} else if ("duplication" == response) {
		var message = '이미 존재하는 장소명입니다.';
		box.css('z-index', '1000010');
		box.show();
		box.text(message);
		$("#placeName").focus();
		return false;
	}

	var jdata = {
		name : name,
		type : type
	}

	$.ajax({
		type : "PATCH",
		dataType : "text",
		url : "/office/admin/place/" + idx,
		data : JSON.stringify(jdata),
		contentType : "application/json",
		success : function(result) {
			if (result == "success") {
				location.reload();
			}
		}
	});
};

Admin.prototype.changePlaceImage = function() {
	var idx = $('#placeIdx').val();
	var formData = new FormData();

	formData.append("file", $("#logoFile")[0].files[0]);

	$.ajax({
		url : '/office/admin/place/' + idx,
		processData : false,
		contentType : false,
		data : formData,
		type : 'POST',
		success : function(result) {
			$("#my-dialog,#dialog-background").hide();
		}
	});
}

// -----------------------------------------

Admin.prototype.addRank = function() {
	var rank = $("#input_rank").val();
	var rankList = $(".rank_list");

	rankList
			.find('.col-md-12:last')
			.after(
					'<div class="col-md-12 rank_content">'
							+ '<div class="col-md-9"><span class="fs14">'
							+ rank
							+ '</span></div>'
							+ '<div class="col-md-3 L"><span>'
							+ '<i class="fa fa-close remove_rank" onclick="Admin.prototype.removeRank(this)"></i>'
							+ '</span></div></div>');

	$("#input_rank").val('');
};

Admin.prototype.removeRank = function(row) {
	var row = $(row).closest(".rank_content");
	var result = confirm('삭제 하시겠습니까?');

	if (result) {
		row.remove();
	} else {
		return;
	}
};

Admin.prototype.addPosition = function() {
	var position = $("#input_position").val();
	var positionList = $(".position_list");
	positionList
			.find('.col-md-12:last')
			.after(
					'<div class="col-md-12 position_content"><div class="col-md-9">'
							+ '<span class="fs14">'
							+ position
							+ '</span></div>'
							+ '<div class="col-md-3 L"><span>'
							+ '<i class="fa fa-close remove_position" onclick="Admin.prototype.removePosition(this)"></i>'
							+ '</span></div></div>');

	$("#input_position").val('');
};

Admin.prototype.removePosition = function(row) {
	var row = $(row).closest(".position_content");
	var result = confirm('삭제 하시겠습니까?');

	if (result) {
		row.remove();
	} else {
		return;
	}
};

Admin.prototype.showSubTeamList = function() {
	document.location.href = "/office/admin/subTeam";
};

Admin.prototype.showUserInfo = function() {
	$('.userInfo__popup').css('display', 'table');
	$('.overlay').show();
	$('.overlay').css('background', '#9c9c9c');
}