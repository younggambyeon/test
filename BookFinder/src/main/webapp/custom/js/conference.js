var Conference = function() {

};

var colors = [ '#ffdc73', '#70e5cc', '#c7ade6', '#e6d8ad', '#e6b1ad',
		'#c6b0b0', '#acacac', '#95a8db', '#add8e6', '#bce6ad', '#e4af73',
		'#e377b5', '#7b77e1', '#be8a8a', '#93be8a', '#898989', '#575c89',
		'#828657', '#865757', '#e35151' ]

/* --- conference history --- */
Conference.prototype.callHistoryCalendar = function() {
	var calendar = $('.calendar');
	var view = calendar.fullCalendar('getView');

	var start = Conference.prototype.getStartDate(view);
	var end = Conference.prototype.getEndDate(view);

	var data = {
		start : start,
		end : end
	}

	data = JSON.stringify(data);

	$.ajax({
		type : 'POST',
		url : "/office/conference/history/calendar",
		data : data,
		contentType : 'application/json',
		dataType : 'json',

		success : function(response) {
			var conferenceList = response;
			var events = [];

			var colorDiv = "#colorDiv";
			var placeList = JSON.parse($("#placeListJson").val());

			for (var j = 0; j < placeList.length; j++) {
				var place = placeList[j];

				var colorCode = colors[j]
				$(colorDiv + j).css('background-color', colorCode);

				if (0 < conferenceList.length) {
					for (i = 0; i < conferenceList.length; i++) {
						var conference = conferenceList[i];

						if (place.idx == conference.placeIdx) {
							Conference.prototype
									.addEventInCalendarEventBackgroundColor(
											conference, events, colorCode);
						}
					}
				}
			}

			calendar.fullCalendar('removeEvents');
			calendar.fullCalendar('addEventSource', events);
			calendar.fullCalendar('rerenderEvents');
		},
		error : function(request, status, error) {

		}
	});
}

/* --- conference home --- */
Conference.prototype.clickTimeTableTab = function(tab) {
	$('ul.nav-tabs').find('li').removeClass('nav-active');
	tab.addClass('nav-active');
	$('.timetable').show();
	$('.conference_timetable__calendar').hide();
};

Conference.prototype.clickCalendarTab = function(tab) {
	$('ul.nav-tabs').find('li').removeClass('nav-active');
	tab.addClass('nav-active');
	$('.timetable').hide();

	$('.conference_timetable__calendar').show();
	$('.calendar').fullCalendar('render');
};

Conference.prototype.changeCalendarByPlaceIdx = function(placeIdx) {
	Conference.prototype.callCalendar(placeIdx);
};

Conference.prototype.callCalendar = function(placeIdx) {
	if (placeIdx == undefined) {
		return false;
	}

	var calendar = $('.calendar');
	var view = calendar.fullCalendar('getView');

	var start = Conference.prototype.getStartDate(view);
	var end = Conference.prototype.getEndDate(view);

	var data = {
		start : start,
		end : end
	}

	data = JSON.stringify(data);

	$
			.ajax({
				type : 'POST',
				url : "/office/place/" + placeIdx + "/conference/calendar",
				data : data,
				contentType : 'application/json',
				dataType : 'json',

				success : function(response) {
					var conferenceList = response;

					var events = [];
					if (0 < conferenceList.length) {
						for (i = 0; i < conferenceList.length; i++) {
							var conference = conferenceList[i];

							Conference.prototype.addEventInCalendar(conference,
									events);
						}
					}

					calendar.fullCalendar('removeEvents');
					calendar.fullCalendar('addEventSource', events);
					calendar.fullCalendar('rerenderEvents');
				},
				error : function(request, status, error) {

				}
			});
};

Conference.prototype.setCalendar = function() {
	$('.calendar')
			.fullCalendar(
					{
						minTime : "08:00:00",
						maxTime : "21:00:00",
						header : {
							left : 'prev, next',
							center : 'title',
							right : 'month,agendaWeek,agendaDay,list'
						},
						monthNames : [ "1월", "2월", "3월", "4월", "5월", "6월",
								"7월", "8월", "9월", "10월", "11월", "12월" ],
						monthNamesShort : [ "1월", "2월", "3월", "4월", "5월", "6월",
								"7월", "8월", "9월", "10월", "11월", "12월" ],
						dayNames : [ "일요일", "월요일", "화요일", "수요일", "목요일", "금요일",
								"토요일" ],
						dayNamesShort : [ "일", "월", "화", "수", "목", "금", "토" ],

						viewRender : function(view, element) {
							var activePlace = $('.calendar__side_navigation--active');
							var placeIdx = activePlace.find(
									"input[type=hidden]").val();

							if (placeIdx == undefined || placeIdx == null
									|| placeIdx == "") {
								Conference.prototype.callHistoryCalendar();

							} else {
								Conference.prototype.callCalendar(placeIdx);
							}
						}
					});
};

Conference.prototype.addEventInCalendar = function(conference, events) {
	events.push({
		title : conference.title,
		start : conference.startDate,
		end : conference.endDate,
		url : "/office/conference/" + conference.idx + "/confirmation",
		allDay : false,
	});
};

Conference.prototype.addEventInCalendarEventBackgroundColor = function(
		conference, events, colorCode) {
	events.push({
		title : conference.title,
		start : conference.startDate,
		end : conference.endDate,
		url : "/office/conference/" + conference.idx + "/confirmation",
		allDay : false,
		backgroundColor : colorCode,
	});
};

Conference.prototype.getEndDate = function(view) {
	var milliSeconds = Date.parse(view.intervalEnd);
	var d = (milliSeconds - (60 * 60 * 24 * 1000));
	var date = new Date(d);
	var end = moment(date).format('YYYY-MM-DD');

	return end;
};

Conference.prototype.getStartDate = function(view) {
	var start = view.intervalStart.format();

	return start;
};

Conference.prototype.setTimeTableInConferenceHome = function() {
	var placeListJson = JSON.parse($("#placeListJson").val());
	var conferenceListJson = JSON.parse($("#conferenceListJson").val());

	var timetable = Conference.prototype.setTimetable();

	if (0 < placeListJson.length) {
		for (var i = 0; i < placeListJson.length; i++) {
			var place = placeListJson[i];
			Conference.prototype.addLocationToTimetable(timetable, place);
		}
	}

	if (0 < conferenceListJson.length) {
		for (i = 0; i < conferenceListJson.length; i++) {
			var conference = conferenceListJson[i];

			Conference.prototype.addEventToTimetable(timetable, conference);
		}
	}

	if (0 < placeListJson.length) {
		// draw
		Conference.prototype.drawTimetable(timetable);
	}

};

/*------- rooms -------*/

Conference.prototype.choiceConferenceCard = function(panel) {
	$(".btn-r").css('visibility', 'visible');
	$(".thumb-pane").removeClass("main_bg_color");

	panel.find(".thumb-pane").addClass("main_bg_color");

	$(".btn_next").css('display', 'block');
};

Conference.prototype.moveNextByPlaceIdx = function() {
	var placeIdx = $(".main_bg_color").find("input[type=hidden]").val();

	var data = {
		idx : placeIdx
	};

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/conference/cookie/place",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			document.location.href = "/office/conference/participants";
		},

		error : function(request, status, error) {

		}
	});
};

Conference.prototype.showRooms = function() {
	var placeIdx = $("#placeIdx").val();

	var pageTag = $("#rooms_page");
	var offset = (parseInt(pageTag.val()) + 1);

	pageTag.val(offset);

	$.ajax({
		url : "/office/conference/rooms/paging?offset=" + offset,
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var rooms = response;
			var target = $("#rooms_box");

			if (0 < rooms.length) {
				for (var i = 0; i < rooms.length; i++) {
					var place = rooms[i];

					if (placeIdx != place.idx) {
						Conference.prototype.appendRoom(target, place);

					} else {
						Conference.prototype.appendChosenRoom(target, place);
					}
				}

				$('img.lazy').lazyload({
					placeholder : "/office/custom/img/spinner.gif"
				});

				if (placeIdx > 0) {
					$(".btn-r").css('visibility', 'visible');
					$(".btn_next").css('display', 'block');
				}

				var isTutorial = $('#isTutorial').val();

				if (isTutorial == 'true') {
					$('#isTutorial').val("false");

					Conference.prototype.showRoomTutorial();
				}

			} else {
				if (offset == 1) {
					$('#room_empty').show();
				}
			}
		},

		error : function(request, status, error) {

		}
	});
};

Conference.prototype.showRoomTutorial = function() {
	$('.overlay').show();
	$('.overlay').css('background', '#000');
	$('#loading-img').hide();

	$('.tutorial__btn_next').fadeIn(4000);
	$('.tutorial__conference_room--arrow1').fadeIn(1000);
	$('#confirm-room-tutorial-button').fadeIn(8000);
};

Conference.prototype.appendRoom = function(target, place) {
	var html = '<div class="col-md-4"><div class="thumbnail-box-wrapper room-card" onclick="Conference.prototype.choiceConferenceCard($(this))">'
			+ '<div class="thumbnail-box"><a class="thumb-link" title=""></a>'
			+ '<div class="thumb-content"><div class="center-vertical"><div class="center-content">'
			+ '<i class="icon-helper icon-center font-white glyph-icon"></i></div>'
			+ '</div></div><div class="thumb-overlay bg-white"></div>'
			+ '<img data-original="/office'
			+ place.imagePath
			+ '" class="lazy" />'
			+ '</div><div class="thumb-pane"><h3 class="thumb-heading"><span>'
			+ place.name
			+ '</span>'
			+ '</h3><input type="hidden" value="'
			+ place.idx + '" /></div></div></div>';

	target.append(html);
};

Conference.prototype.appendChosenRoom = function(target, place) {
	var html = '<div class="col-md-4"><div class="thumbnail-box-wrapper room-card" onclick="Conference.prototype.choiceConferenceCard($(this))">'
			+ '<div class="thumbnail-box"><a class="thumb-link" title=""></a>'
			+ '<div class="thumb-content"><div class="center-vertical"><div class="center-content">'
			+ '<i class="icon-helper icon-center font-white glyph-icon"></i></div>'
			+ '</div></div><div class="thumb-overlay bg-white"></div>'
			+ '<img data-original="/office'
			+ place.imagePath
			+ '" class="lazy" />'
			+ '</div><div class="thumb-pane main_bg_color"><h3 class="thumb-heading"><span>'
			+ place.name
			+ '</span>'
			+ '</h3><input type="hidden" value="'
			+ place.idx + '" /></div></div></div>';

	target.append(html);
};

/* ------- participants ------- */

Conference.prototype.showAutocomplete = function() {
	$("#search_bar").autocomplete({
		source : function(request, response) {
			$.ajax({
				type : 'POST',
				url : "/office/conference/participants/autocomplete",
				dataType : "json",
				data : {
					searchValue : request.term
				},
				success : function(data) {
					response($.map(data, function(item) {
						return {
							label : item.name,
							value : item.name
						}
					}));
				}
			});
		},
		delay : 500,
		select : function(event, ui) {

		},
		focus : function(event, ui) {
			return false;
		}
	});
};

Conference.prototype.searchKeyword = function(keyword) {
	$("#formSearch").submit();
};

Conference.prototype.checkFavritesOnOff = function(panel) {
	var root = panel.parent().parent();

	var input = root.find("input");
	var idx = input.val();
	var teamOrMember = input.attr("class");

	var favoritesTeamCard = $(".favoritesTeam_card");
	var favoritesMemberCard = $(".favoritesMember_card");

	var iTag = panel.find('i');

	if (iTag.hasClass("fa fa-star-o")) {

		iTag.removeClass("fa fa-star-o");
		iTag.addClass("fa fa-star");

		// append 즐겨찾기
		if ("team" == teamOrMember) {
			Conference.prototype.appendFavoritesTeamCard(root, idx);
		} else {
			Conference.prototype.appendFavoritesMemberCard(root, idx);
		}

	} else {
		var cardType = root.parent();
		var favoritesCard = $("#favorites_card");

		if (favoritesCard[0] === cardType[0]) {
			// 즐겨찾기 카드에서 즐겨찾기 해제 클릭 시 -> 기본 카드에 즐겨찾기 해제
			if ("team" == teamOrMember) {
				Conference.prototype.setTeamCardFavritesOff(idx);

			} else {
				Conference.prototype.setMemberCardFavritesOff(idx);
			}
		} else {
			// 기본카드 즐겨찾기 해제
			iTag.removeClass("fa fa-star");
			iTag.addClass("fa fa-star-o");
		}

		// 카드 삭제
		if ("team" == teamOrMember) {
			Conference.prototype
					.removeFavoritesTeamCard(favoritesTeamCard, idx);

		} else {
			Conference.prototype.removeFavoritesMemberCard(favoritesMemberCard,
					idx);
		}

		Conference.prototype.isExistTeamOrMember();
	}

	// save or delete
	Conference.prototype.callFavritesOnOff(idx, teamOrMember);
};

Conference.prototype.teamOrMemberCount = function() {
	var teamCount = $('.favoritesTeam_card').length;
	var memberCount = $('.favoritesMember_card').length;

	var totalCount = teamCount + memberCount;

	return totalCount;
};

Conference.prototype.isExistTeamOrMember = function() {
	var count = Conference.prototype.teamOrMemberCount();

	if (count > 0) {
		$('#favorites_empty').hide();
	} else {
		$('#favorites_empty').show();
	}
};

Conference.prototype.appendFavoritesTeamCard = function(teamCard, idx) {
	var root = $("#favorites_card");
	var teamName = teamCard.find(".card_team").find("span").text();

	root
			.append('<div class="col-md-2 card favoritesTeam_card">'
					+ '<div class="card_team">'
					+ '<span class="team_box_font">'
					+ teamName
					+ '</span></div>'
					+ '<div class="box_wrap_btn">'
					+ '<div class="hover-scale chkBox checkBox" onclick="Conference.prototype.checkInvitationOnOff($(this))">'
					+ '<i class="fa fa-square-o fa_square_style"></i>'
					+ '</div><div class="hover-scale bookmark" onclick="Conference.prototype.checkFavritesOnOff($(this))">'
					+ '<i class="fa fa-star fa_star_style"></i></div></div>'
					+ '<br /> <input type="hidden" value="' + idx
					+ '" class="team" /></div>');
};

Conference.prototype.appendFavoritesMemberCard = function(memberCard, idx) {
	var root = $("#favorites_card");
	var memberImage = memberCard.find(".memberImage").attr("src");

	var teamName = memberCard.find("#teamName").text();
	var userName = memberCard.find(".userName").text();
	var rankName = memberCard.find("#rankName").text();

	root
			.append('<div class="col-md-2 card favoritesMember_card">'
					+ '<div class="card_user">' + '<div class="card_img_user">'
					+ '<img class="w6 memberImage"' + 'src="'
					+ memberImage
					+ '" /></div>'
					+ '<div class="card_user_info">'
					+

					'<span>'
					+ teamName
					+ '</span>'
					+ '<br /> <span class="userName">'
					+ userName
					+ ' '
					+ rankName
					+ '</span>'
					+ '</div></div>'
					+ '<div class="box_wrap_btn">'
					+ '<div class="hover-scale chkBox checkBox" onclick="Conference.prototype.checkInvitationOnOff($(this))">'
					+ '<i class="fa fa-square-o fa_square_style"></i>'
					+ '</div><div class="hover-scale bookmark" onclick="Conference.prototype.checkFavritesOnOff($(this))">'
					+ '<i class="fa fa-star fa_star_style"></i>'
					+ '</div></div><br />'
					+ ' <input type="hidden" value="'
					+ idx + '" class="member" />' + '</div>');
};

Conference.prototype.setTeamCardFavritesOff = function(idx) {
	var teamCard = $(".team_card");

	for (var i = 0; i < teamCard.size(); i++) {
		var item = teamCard.eq(i);
		var input = item.find('.team');
		var teamIdx = input.val();

		if (teamIdx == idx) {
			var iTag = item.find(".bookmark").find("i");

			iTag.removeClass("fa fa-star");
			iTag.addClass("fa fa-star-o");
			break;
		}
	}
};

Conference.prototype.setMemberCardFavritesOff = function(idx) {
	var memberCard = $(".member_card");

	for (var i = 0; i < memberCard.size(); i++) {
		var item = memberCard.eq(i);
		var input = item.find('.member');
		var memberIdx = input.val();

		if (memberIdx == idx) {
			var iTag = item.find(".bookmark").find("i");

			iTag.removeClass("fa fa-star");
			iTag.addClass("fa fa-star-o");
			break;
		}
	}
};

Conference.prototype.removeFavoritesTeamCard = function(target, idx) {
	for (var i = 0; i < target.size(); i++) {
		var item = target.eq(i);
		var input = item.find('.team');
		var teamIdx = input.val();

		if (teamIdx == idx) {
			item.remove();
			break;
		}
	}
};

Conference.prototype.removeFavoritesMemberCard = function(target, idx) {
	for (var i = 0; i < target.size(); i++) {
		var item = target.eq(i);
		var input = item.find('.member');
		var teamIdx = input.val();

		if (teamIdx == idx) {
			item.remove();
			break;
		}
	}
};

Conference.prototype.callFavritesOnOff = function(targetIdx, teamOrMember) {
	$.ajax({
		type : 'GET',
		url : "/office/conference/participants/favorites/" + teamOrMember + "/"
				+ targetIdx,
		contentType : 'text',
		dataType : 'text',

		success : function(data) {

		},
		error : function(request, status, error) {

		}
	});
};

Conference.prototype.moveInTeamCard = function(panel) {
	var inputTag = panel.parent().find("input");
	var teamIdx = inputTag.val();

	document.location.href = "/office/conference/participants/team/" + teamIdx;
};

Conference.prototype.moveInBackCard = function(panel) {
	var inputTag = panel.find("input");
	var backTeamIdx = inputTag.val();

	if (backTeamIdx != null && backTeamIdx != "") {
		document.location.href = "/office/conference/participants/team/"
				+ backTeamIdx + "/back";
	} else {
		document.location.href = "/office/conference/participants";
	}
};

Conference.prototype.fadeInSelectContainer = function() {
	$(".select2-container").fadeIn(1000);
	$(".btn_next").css('display', 'inline');
};

Conference.prototype.fadeOutSelectContainer = function() {
	$(".select2-container").fadeOut(1000);
	$("#effect").val("fadeOut");
	$(".btn_next").css('display', 'none');
};

Conference.prototype.appendTeamCard = function(idx, name) {
	$('.team-list')
			.append(
					'<table class="team_table"><tbody><tr><td><div class="append_team">'
							+ '<span>'
							+ name
							+ '</span></div></td></tr><tr class="target_tr"><td class="remove_button" onclick="Conference.prototype.removePanel($(this))">'
							+ '<span class="select2-selection__choice__remove userDel" role="presentation">×</span>'
							+ '</td><td><input type="hidden" class="team" value="'
							+ idx + '" /></td></tr></tbody></table>');
};

Conference.prototype.appendUserCard = function(idx, name, img) {
	$('.user-list')
			.append(
					'<table class="user_table"><tr><td>'
							+ '<img src="'
							+ img
							+ '" class="img-circle img_append_user" />'
							+ '</td></tr><tr class="target_tr"><td class="remove_button" onclick="Conference.prototype.removePanel($(this))">'
							+ name
							+ '<span class="select2-selection__choice__remove userDel" role="presentation">×</span></td><td><input type="hidden" class="member" value="'
							+ idx + '" /></td></tr></table>');
};

Conference.prototype.checkCardListCount = function(panel) {
	var size = $(".team_table").size() + $(".user_table").size();

	if (0 == size) {
		Conference.prototype.fadeOutSelectContainer();
	} else {
		Conference.prototype.fadeInSelectContainer();
	}
};

Conference.prototype.checkInvitationOnOff = function(panel) {
	var card = panel.parent().parent();
	var target = card.find("input");
	var idx = target.val();
	var teamOrMember = target.attr("class");
	var iTag = panel.find('i');
	var on = "on";

	if (iTag.hasClass("fa fa-square-o")) {

		if (teamOrMember == "team") {

			var teamCard = $(".team_card");
			var favoritesTeamCard = $(".favoritesTeam_card");

			Conference.prototype.selectInvitationTeam(teamCard, idx, on);
			Conference.prototype.selectInvitationTeam(favoritesTeamCard, idx,
					on);

			var name = card.find(".card_team").children().text();
			Conference.prototype.appendTeamCard(idx, name);

		} else {

			var userCard = $(".member_card");
			var favoritesUserCard = $(".favoritesMember_card");

			Conference.prototype.selectInvitationMember(userCard, idx, on);
			Conference.prototype.selectInvitationMember(favoritesUserCard, idx,
					on);

			var name = card.find(".userName").text();
			var img = card.find(".memberImage").attr("src");

			Conference.prototype.appendUserCard(idx, name, img);
		}

		Conference.prototype.saveInvitationOnOff(idx, teamOrMember);
		Conference.prototype.checkCardListCount();

	} else {

		if (teamOrMember == "team") {
			var root = $(".team_table");
			Conference.prototype.selectRemoveButtonByTeam(root, idx);

		} else {
			var root = $(".user_table");
			Conference.prototype.selectRemoveButtonByMember(root, idx);
		}
	}
};

Conference.prototype.removePanel = function(panel) {
	var root = panel.parent().parent().parent();
	var input = panel.siblings("td").children();
	var idx = input.val();
	var teamOrMember = input.attr("class");
	var off = "off";

	if ("team" == teamOrMember) {
		var teamCard = $(".team_card");
		var favoritesTeamCard = $(".favoritesTeam_card");

		Conference.prototype.selectInvitationTeam(teamCard, idx, off);
		Conference.prototype.selectInvitationTeam(favoritesTeamCard, idx, off);

	} else {
		var userCard = $(".member_card");
		var favoritesUserCard = $(".favoritesMember_card");

		Conference.prototype.selectInvitationMember(userCard, idx, off);
		Conference.prototype
				.selectInvitationMember(favoritesUserCard, idx, off);
	}

	root.remove();
	Conference.prototype.checkCardListCount();
	Conference.prototype.saveInvitationOnOff(idx, teamOrMember);
};

Conference.prototype.selectInvitationMember = function(target, idx, onOrOff) {
	for (var i = 0; i < target.size(); i++) {
		var item = target.eq(i);
		var wrap = item.find(".box_wrap_btn");
		var chkBox = wrap.find(".chkBox");
		var iTag = chkBox.find('.fa_square_style');

		var input = item.find('.member');
		var teamIdx = input.val();

		if (teamIdx == idx) {
			Conference.prototype.setInvitationOnOff(onOrOff, iTag);
			break;
		}
	}
};

Conference.prototype.selectInvitationTeam = function(target, idx, onOrOff) {
	for (var i = 0; i < target.size(); i++) {
		var item = target.eq(i);
		var wrap = item.find(".box_wrap_btn");
		var chkBox = wrap.find(".chkBox");
		var iTag = chkBox.find('.fa_square_style');

		var input = item.find('.team');
		var teamIdx = input.val();

		if (teamIdx == idx) {
			Conference.prototype.setInvitationOnOff(onOrOff, iTag);
			break;
		}
	}
};

Conference.prototype.setInvitationOnOff = function(onOrOff, iTag) {
	if ("on" == onOrOff) {
		iTag.removeClass("fa fa-square-o");
		iTag.addClass("fa fa-check-square-o");
	} else {
		iTag.removeClass("fa fa-check-square-o");
		iTag.addClass("fa fa-square-o");
	}
};

Conference.prototype.selectRemoveButtonByTeam = function(root, idx) {
	for (var i = 0; i < root.size(); i++) {
		var item = root.eq(i);
		var target = item.find(".target_tr");
		var input = target.find('.team');
		var td = target.find('.remove_button');
		var teamIdx = input.val();

		if (teamIdx == idx) {
			Conference.prototype.removePanel(td);
			break;
		}
	}
};

Conference.prototype.selectRemoveButtonByMember = function(root, idx) {
	for (var i = 0; i < root.size(); i++) {
		var item = root.eq(i);
		var target = item.find(".target_tr");
		var input = target.find('.member');
		var td = target.find('.remove_button');
		var userIdx = input.val();

		if (userIdx == idx) {
			Conference.prototype.removePanel(td);
			break;
		}
	}
};

Conference.prototype.reloadInvitationChecker = function() {
	var on = "on";
	var teamArry = new Array();
	var userArry = new Array();

	var oldTeams = $("#oldTeamsJson").val();
	if (oldTeams != "" && oldTeams != null) {
		oldTeams = JSON.parse(oldTeams);

		for (var i = 0; i < oldTeams.length; i++) {
			var object = oldTeams[i];

			teamArry.push(object);
		}
	}

	var oldUsers = $("#oldUsersJson").val();
	if (oldUsers != "" && oldUsers != null) {
		oldUsers = JSON.parse(oldUsers);

		for (var i = 0; i < oldUsers.length; i++) {
			var object = oldUsers[i];

			userArry.push(object);
		}
	}

	var teamSize = teamArry.length;
	var userSize = userArry.length;

	var teamCard = $(".team_card");
	var favoritesTeamCard = $(".favoritesTeam_card");

	var userCard = $(".member_card");
	var favoritesUserCard = $(".favoritesMember_card");

	if (0 < teamSize) {
		for (var i = 0; i < teamSize; i++) {
			var oldTeam = oldTeams[i];
			var idx = oldTeam.idx;

			Conference.prototype.selectInvitationTeam(teamCard, idx, on);
			Conference.prototype.selectInvitationTeam(favoritesTeamCard, idx,
					on);
		}
	}

	if (0 < userSize) {
		for (var i = 0; i < userSize; i++) {
			var oldUser = oldUsers[i];
			var idx = oldUser.idx;

			Conference.prototype.selectInvitationMember(userCard, idx, on);
			Conference.prototype.selectInvitationMember(favoritesUserCard, idx,
					on);
		}
	}
};

Conference.prototype.saveInvitationOnOff = function(targetIdx, teamOrMember) {

	$.ajax({
		type : 'GET',
		url : "/office/conference/participants/invitation/" + teamOrMember
				+ "/" + targetIdx,
		contentType : 'text',
		dataType : 'text',

		success : function(response) {
			if ("fail" == response) {
				document.location.href = "/office/conference/rooms";
			}

		},
		error : function(request, status, error) {

		}
	});
};

/* ------- information ------- */

var storedFiles = [];

Conference.prototype.appendFiles = function(event) {
	var fileTable = $(".file-table");
	var input = document.getElementById("filesToUpload");

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
										+ '<button class="btn cancel btn-file-remove" style="display:table-cell" onclick="Conference.prototype.removeFile($(this))"><span>cancel</span></button></tr>');
			});
};

Conference.prototype.removeFileList = function() {
	var tr = $(".files tr");
	var fileTable = $(".file-table");

	tr.remove();
	fileTable.css("margin", "0px");

	storedFiles = [];
};

Conference.prototype.removeFile = function(panel) {
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

Conference.prototype.saveConference = function() {
	var message = "";

	var date = $('#reserveDate').val();
	var startTime = $('#start_time').val();
	var endTime = $('#end_time').val();
	var title = $('#reserveTitle').val();
	var content = $('#reserveContent').val();

	if (!Common.prototype.isDate(date)) {
		$('#reserveDate').focus();
		message = "날짜 형식이 올바르지 않습니다.";
		Conference.prototype.showMessgeInConferenceInformation(message);
		return false;
	}

	if (!Common.prototype.compareTime(startTime, endTime)) {
		$('#start_time').focus();
		message = "회의 시간을 확인해주세요.";
		Conference.prototype.showMessgeInConferenceInformation(message);
		return false;
	}

	if (title == null || title == "") {
		$('#reserveTitle').focus();
		message = "회의 제목을 입력하세요.";
		Conference.prototype.showMessgeInConferenceInformation(message);
		return false;
	}

	if (30 < title.length) {
		$('#reserveTitle').focus();
		message = "회의 제목은 30자 이하로 작성해주세요";
		Conference.prototype.showMessgeInConferenceInformation(message);
		return false;
	}

	if (content == null || content == "") {
		$('#reserveContent').focus();
		message = "회의 내용을 입력하세요.";
		Conference.prototype.showMessgeInConferenceInformation(message);
		return false;
	}

	if (800 < content.length) {
		$('#reserveContent').focus();
		message = "회의 내용은 800자 이하로 작성해주세요.";
		Conference.prototype.showMessgeInConferenceInformation(message);
		return false;
	}

	var startDate = date + " " + startTime + ":00";
	var endDate = date + " " + endTime + ":00";

	var data = {
		title : title,
		content : content,
		startDate : startDate,
		endDate : endDate
	};

	var flag;
	data = JSON.stringify(data);

	$
			.ajax({
				async : false,
				url : "/office/conference/information",
				type : 'POST',
				data : data,
				contentType : 'application/json',
				dataType : 'text',

				success : function(response) {

					if ("fail" == response) {
						var message = "현재 초대하신 팀에 속한 사람이 존재하지 않습니다.";

						// 마리, 메시지 확인 필요.
						Common.prototype.showMessageInformation(message);
						flag = false;

					} else if ("duplication" == response) {
						$('#start_time').focus();
						message = "선택하신 시간에 이미 예약된 회의가 존재합니다.";

						// 마리, 메시지 확인 필요.
						Conference.prototype
								.showMessgeInConferenceInformation(message);

						Conference.prototype.showPlaceConferenceTimeTable();
						flag = false;

					} else {
						$("#conferenceIdx").val(response);
						flag = true;
					}
				},

				error : function(request, status, error) {

				}
			});

	return flag;
}

Conference.prototype.showMessgeInConferenceInformation = function(message) {
	var panelElement = $(".panel-body_ex *");
	var box = $(':focus').attr('id');

	panelElement.removeAttr('data-tooltip');
	$('#' + box).parent().attr('data-tooltip', message);
	setTimeout(function() {
		panelElement.removeAttr('data-tooltip');
	}, 5000);
}

Conference.prototype.uploadFiles = function(index) {
	var tr = $(".files tr");
	var rowCount = tr.length;
	var conferenceIdx = $("#conferenceIdx").val();

	if (0 == rowCount) {
		window.location.href = "/office/conference/" + conferenceIdx
				+ "/confirmation";
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
		url : "/office/conference/" + conferenceIdx + "/file",
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
					Conference.prototype.uploadFiles(index);
				} else {
					storedFiles = [];
					window.location.href = "/office/conference/"
							+ conferenceIdx + "/confirmation";
				}
			} else {

			}
		},
		error : function(jqXHR) {
			console.log('error');
		},
	});
};

Conference.prototype.confirmConferenceTimeTable = function() {
	var timetablePanel = $("#timeTable_conference_information");
	var none = timetablePanel.css("display");

	if (none == "none") {
		timetablePanel.show();
		Conference.prototype.getConferenceTimeTableByPlaceIdx();

	} else {
		timetablePanel.hide();
	}
};

Conference.prototype.showPlaceConferenceTimeTable = function() {
	var timetablePanel = $("#timeTable_conference_information");
	var none = timetablePanel.css("display");

	if (none == "none") {
		timetablePanel.show();
	}

	Conference.prototype.getConferenceTimeTableByPlaceIdx();
};

Conference.prototype.getConferenceTimeTableByPlaceIdx = function() {
	var placeIdx = $("#placeIdx").val();
	var date = $('#reserveDate').val();

	$.ajax({
		type : 'GET',
		url : "/office/place/" + placeIdx + "/conference/timetable?date="
				+ date,
		dataType : 'json',

		success : function(response) {
			var conferenceList = response;

			var timetable = Conference.prototype.setTimetable();

			var location = $("#placeName").val();
			timetable.addLocations([ location ]);

			if (0 < conferenceList.length) {
				for (i = 0; i < conferenceList.length; i++) {
					var conference = conferenceList[i];

					Conference.prototype.addEventToTimetable(timetable,
							conference);
				}
			}

			Conference.prototype.drawTimetable(timetable);

		},
		error : function(request, status, error) {

		}
	});
};

Conference.prototype.setTimetable = function() {
	var timetable = new Timetable();
	timetable.setScope(9, 21);

	return timetable;
};

Conference.prototype.addLocationToTimetable = function(timetable, place) {
	timetable.addLocations([ place.name ]);
};

Conference.prototype.addEventToTimetable = function(timetable, conference) {
	var startDate = moment(conference.startDate, "YYYY-MM-DD HH:mm:ss")
			.toDate();
	var endDate = moment(conference.endDate, "YYYY-MM-DD HH:mm:ss").toDate();

	timetable.addEvent(conference.title, conference.name, startDate, endDate, {
		url : "/office/conference/" + conference.idx + "/confirmation"
	});
};

Conference.prototype.drawTimetable = function(timetable) {
	var renderer = new Timetable.Renderer(timetable);
	renderer.draw('.timetable');
};

/* ------- confirmation ------- */

Conference.prototype.downloadConferenceFile = function(target) {
	var td = target.parent();
	var input = td.find(".fileIdx");
	var conferenceFileIdx = input.val();

	document.location.href = "/office/conference/file/" + conferenceFileIdx;
};

Conference.prototype.cancelConference = function() {
	var message = "";
	var idx = $("#conferenceIdx").val();
	var checked = $('input[name="radio_label"]:checked');
	var parent = checked.parent();
	var label = parent.find("label");

	var reason = label.text();
	if ("기타" == reason) {
		var reason = parent.find("#cancel_reason_etc").val();
	}

	if (null == reason || "" == reason) {
		var messageBox = $('.reserveCancel__popup--isValid');
		var messageSpan = messageBox.find('span');

		messageSpan.empty();
		messageSpan.append('취소사유를 적어주세요.');
		messageBox.show();
		return false;
	}

	var data = {
		reason : reason
	};

	data = JSON.stringify(data);

	$.ajax({
		type : 'DELETE',
		url : "/office/conference/" + idx,
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			location.href = "/office/conference";
		},
		error : function(request, status, error) {

		}
	});
};

Conference.prototype.extendConferenceTime = function() {
	var message = "";
	var messageBox = $('.reserveExtend__popup--isValid');
	var messageSpan = $('.reserveExtend__popup--isValid').find('span');

	var conferenceIdx = $("#conferenceIdx").val();
	var date = $('#coferenceDate').val();
	var extendTime = $('#reseve_extend_time').val();
	var endTime = $("#endTime").val();

	var nearStartTime = $("#nearStartTime").val();

	if (!Common.prototype.compareTime(endTime, extendTime)) {
		$('#reseve_extend_time').focus();

		messageBox.css('visibility', 'visible');
		messageSpan.empty();
		$('.reserveInfo__popup--extend').css('bottom', '-104px');
		messageSpan.append('회의 종료시간과 연장시간을 확인해주세요.');

		return false;
	}

	if (!Conference.prototype.compareTimeByConferenceExtension(nearStartTime,
			extendTime)) {
		$('#reseve_extend_time').focus();

		messageBox.css('visibility', 'visible');
		messageSpan.empty();
		$('.reserveInfo__popup--extend').css('bottom', '-104px');
		messageSpan.append(nearStartTime + ' 까지 연장 가능합니다.');

		return false;
	}

	var endDate = date + " " + extendTime + ":00";

	var data = {
		endDate : endDate
	};

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/conference/" + conferenceIdx + "/extension",
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

Conference.prototype.setTimePickerByComfirmation = function() {
	$('.reserveInfo__popup--extend').show();
	$('.reserveInfo__popup--cancel').hide();

	var maxHour = $("#maxHour").val();
	var endTime = $("#endTime").val();

	$('#reseve_extend_time').timepicker({
		showMeridian : false,
		minuteStep : 30,
		maxHours : parseInt(maxHour),
		snapToStep : true,
		defaultTime : endTime
	});
};

Conference.prototype.compareTimeByConferenceExtension = function(nearTime,
		extendTime) {
	var startTime, endTime, timeArr;

	timeArr = nearTime.split(':');
	startTime = (timeArr[0] * 60) + timeArr[1];
	timeArr = extendTime.split(':');
	endTime = (timeArr[0] * 60) + timeArr[1];

	if (Number(startTime) < Number(endTime)) {
		return false;
	} else {
		return true;
	}
};
