$(document)
		.ready(
				function() {
					var user = new User();
					var conference = new Conference();
					var admin = new Admin();
					var superAdmin = new SuperAdmin();

					/* --- conference home --- */
					$('.tab_table').click(function() {
						var tab = $(this);
						conference.clickTimeTableTab(tab);
						conference.setTimeTableInConferenceHome();
					});

					$('.tab_calendar')
							.click(
									function() {
										var tab = $(this);
										var placeMenu = $('#calendar__side_navigation > .conference_place__menu:first-child');
										var placeIdx = placeMenu.find(
												"input[type=hidden]").val();
										var placeName = placeMenu.find('a')
												.text();

										if (!$('.conference_place__menu')
												.hasClass(
														"calendar__side_navigation--active")) {

											placeMenu
													.addClass('calendar__side_navigation--active');
											$('.calendar__place_name').html(
													'<span>' + placeName
															+ '</span>');
										}

										conference.clickCalendarTab(tab);
										conference.callCalendar(placeIdx);
									});

					$('.conference_place__menu')
							.click(
									function() {
										var sidenav = $(
												'#calendar__side_navigation')
												.find(
														'.calendar__side_navigation--active');
										var placeName = $(this).find('a')
												.text();

										sidenav
												.removeClass('calendar__side_navigation--active');
										$(this)
												.addClass(
														'calendar__side_navigation--active');

										$('.calendar__place_name').html(
												'<span>' + placeName
														+ '</span>');
										var placeIdx = $(this).find(
												"input[type=hidden]").val();
										Conference.prototype
												.changeCalendarByPlaceIdx(placeIdx);
									});

					/* --- rooms --- */

					$(".room-card").click(function(e) {
						e.preventDefault();
						var panel = $(this);

						conference.choiceConferenceCard(panel);
					});

					$(".place-next").click(function(e) {
						conference.moveNextByPlaceIdx();
					});

					/* --- participants --- */

					$("#search_bar")
							.autocomplete(
									{
										source : function(request, response) {
											$
													.ajax({
														type : 'POST',
														url : "/office/conference/participants/autocomplete",
														dataType : "json",
														data : {
															searchValue : request.term
														},
														success : function(data) {
															response($
																	.map(
																			data,
																			function(
																					item) {
																				return {
																					label : item.name,
																					value : item.name
																				}
																			}));
														},
														minLength : 1
													});
										}
									});

					$("#btnSearch").click(function(e) {
						var keyword = $("#search_bar").val();

						if (keyword == null || keyword == "") {
							$("#search_bar").focus();
							message = '검색어를 입력해주세요.';
							Common.prototype.showMessgeInTooltip(message);
						} else {
							conference.searchKeyword(keyword);
						}
					});

					$("#search_bar").keyup(function(e) {
						if (e.keyCode == 13) {
							var keyword = $("#search_bar").val();
							conference.searchKeyword(keyword);
						}
					});

					$(".participant-back").click(function(e) {
						document.location.href = "/office/conference/rooms";
					});

					$(".participant-next")
							.click(
									function(e) {
										document.location.href = "/office/conference/information";
									});

					$(".bookmark").click(function(e) {
						e.preventDefault();
						var panel = $(this);

						conference.checkFavritesOnOff(panel);
					});

					$(".participants_check_box").click(function(e) {
						e.preventDefault();
						var panel = $(this);

						conference.checkInvitationOnOff(panel);
					});

					$(".default-list").click(function(e) {
						$("#favorites_card").hide();
						$("#default_card").show();

						$(".default-list").addClass("nav-active");
						$(".favorites-list").removeClass("nav-active");
					});

					$(".favorites-list").click(function(e) {
						Conference.prototype.isExistTeamOrMember();

						$("#favorites_card").show();
						$("#default_card").hide();

						$(".favorites-list").addClass("nav-active");
						$(".default-list").removeClass("nav-active");
					});

					$(".card_team").click(function(e) {
						var panel = $(this);

						conference.moveInTeamCard(panel);
					});

					$(".back_card").click(function(e) {
						var panel = $(this);

						conference.moveInBackCard(panel);
					});

					$(".remove_button").click(function(e) {
						var panel = $(this);

						conference.removePanel(panel);
					});

					/* --- conference information --- */

					$('#filesToUpload').on('change', function(e) {
						conference.appendFiles(e);
					});

					$(".filelist_remove_button").click(function(e) {
						conference.removeFileList();
					});

					$(".file_remove_button").click(function(e) {
						var panel = $(this);

						conference.removeFile(panel);
					});

					$("#information_icon_button").click(function() {
						$('.tutorial__conference_info--arrow1').hide();
						$('.tutorial__conference_participants--ok').hide();
						$('.overlay').hide();
						conference.confirmConferenceTimeTable();
					});

					$("#conference_save_button").click(function(e) {
						e.preventDefault();
						var flag = conference.saveConference();
						if (flag) {
							conference.uploadFiles(0);
							$(".overlay").show();
						}
					});

					$("#back_conferenceInfo_button")
							.click(
									function(e) {
										window.location.href = "/office/conference/participants";
									});

					$("#move_conference_home").click(function(e) {
						window.location.href = "/office/conference";
					});

					$("#show_brain_button").click(function(e) {
						$(".list_brain").slideToggle("900");
						$(".i-toggle").toggle();
					});

					/* --- conference confirmation --- */

					$(".download__btn").click(function(e) {
						var button = $(this);
						if (button.hasClass('download')) {
							conference.downloadConferenceFile(button);
						}
					});

					$("#extend_confirm_button").click(function(e) {
						conference.extendConferenceTime();
					});

					$('#reserve_extend_button').click(function(e) {
						conference.setTimePickerByComfirmation();
					});

					$('#open_conference_cancel_popup').click(function(e) {
						conference.setTimePickerByComfirmation();
					});

					$("#conference_cancel_button").click(function(e) {
						conference.cancelConference();
					});

					$("#conference_move_inbox").click(function(e) {
						location.href = "/office/user/inbox";
					});

					/* --- signup --- */

					$("#company_search_bar").autocomplete({
						source : function(request, response) {
							$.ajax({
								type : 'POST',
								url : "/office/join/company/autocomplete",
								dataType : "json",
								data : {
									companyName : request.term
								},
								success : function(data) {
									response($.map(data, function(item) {
										return {
											label : item.name,
											value : item.name
										}
									}));
								},
								minLength : 1
							});
						}
					});

					$("#search_company_button").click(function(e) {
						var keyword = $("#company_search_bar").val();
						if (null == keyword || "" == keyword) {
							$('#company_search_bar').focus();
							message = '검색어를 입력해주세요.';
							Common.prototype.showMessgeInTooltip(message);
						} else {
							$("#search_company_form").submit();
						}
					});

					$("#company_search_bar").keyup(function(e) {
						if (e.keyCode == 13) {
							var keyword = $("#company_search_bar").val();
							$("#search_company_form").submit();
						}
					});

					$('.company_name_div').click(function() {
						var target = $(this).find("#companyIdx");
						target.addClass("select_company");

						var companyIdx = target.val();
						user.appendTeamBox(companyIdx);
					});

					$("#account_create_button").click(function(e) {
						user.saveUser();
					});

					$("#move_login_home_button").click(function(e) {
						window.location.href = "/office/login";
					});

					$("#all_company_div").click(function(e) {
						window.location.href = "/office/join";
					});

					// 회원가입 email 중복체크
					$('#email').focusout(function() {
						$('#output__text').find('span').empty();
						user.checkEmailDuplication();
					});

					// validation focus 제거
					$(
							'#email, #password, #confirmPassword, #userName, #newPassword, #confirmNewPassword')
							.focusin(function() {
								$(this).css('background-color', '#fff');
							});

					/* --- starter --- */
					$("#search_address_button").click(function(e) {
						user.showAdressInformation();
					});

					$('#additional_info_next_button').click(function(e) {
						user.saveProfileByStarterPage();
					});

					$("#filePhoto").change(function(e) {
						user.drawProfilePicture();
					});

					$(".starter_upload_button").click(function(e) {
						var button = $(this);

						if (button.hasClass("checked")) {
							button.css('pointer-events', 'auto');
							user.uploadProfilePicture();
						} else {
							button.css('pointer-events', 'none');
						}
					});

					$(".sample_image").click(function(e) {
						var target = $(this);

						user.setDefaultImage(target);
					});

					$('#profile-sample-picture>.col-md-3')
							.click(
									function(e) {
										var uploadButton = $("#profile-picture-upload");

										$('#profile-sample-picture>.col-md-3')
												.removeClass('opacity10')
												.addClass('opacity4');
										$(this).removeClass('opacity4')
												.addClass('opacity10');

										uploadButton.addClass("checked");
									});

					// starter 추가 정보 입력 validation focus 제거
					$('#phone_number_1, #phone_number_2, #phone_number_3')
							.focusin(
									function() {
										$(
												'#phone_number_1, #phone_number_2, #phone_number_3')
												.css('background-color', '#fff');
									});

					$('#birth_year, #birth_month, #birth_day').focusin(
							function() {
								$('#birth_year, #birth_month, #birth_day').css(
										'background-color', '#fff');
							});

					$('#dateHired_year, #dateHired_month, #dateHired_day')
							.focusin(
									function() {
										$(
												'#dateHired_year, #dateHired_month, #dateHired_day')
												.css('background-color', '#fff');
									});

					$(".starter_box_clr").click(
							function() {
								var colorBox = $(this);

								$(".starter_box_clr").removeClass(
										"starter_select_clr");
								$(this).addClass("starter_select_clr");
							});

					$('.newsBox').on('click', function() {
						var checkBox = $(this);

						if (checkBox.hasClass('selectNewsBox')) {
							user.checkNewsTopicOff(checkBox);
						} else {
							user.checkNewsTopicOn(checkBox);
						}
					});

					$('#privacy_setting_btn').click(function() {
						user.saveUserSetByStarter();
					});

					/* --- profile --- */
					$("#update_user_information_button").click(function(e) {
						user.updateUserInformation();
					});

					$('#change-picture').click(function(e) {
						$('.profile-picture-popup').show();
					});

					$(".profile_sample_image").click(function(e) {
						var target = $(this).find("img");

						user.updateProfilePictureByDefualtImage(target);
					});

					$(".profile_upload_button").click(function(e) {
						var button = $(this);

						if (button.hasClass("checked")) {
							button.css('pointer-events', 'auto');
							user.updateUserProfilePicture();
						} else {
							button.css('pointer-events', 'none');
						}
					});

					$('#oldPassword').focusout(function() {
						var oldPassword = $("#oldPassword").val();

						user.confirmUserPassword(oldPassword);
					});

					$("#change_password_btn").click(function() {
						user.changeUserPassword();
					});

					// 색상 선택 시 활성화
					$('.box_clr').click(function() {
						$('.box_clr').removeClass('select_clr');
						$(this).addClass("select_clr");
					});

					$("#change_color_button").click(function() {
						var colorVal = $('.select_clr').find('span').text();
						user.changeUserPointColor(colorVal);
					});

					$("#change_topic_button").click(function() {
						user.changeUserNewsTopic();
					});

					$("#location_confirm_button").click(function() {
						acceptGeolocation();
					});

					/* --- inbox --- */
					$("#inbox_show_button").click(function() {
						user.showInbox();
					});

					$("#new_user_accept_button").click(function() {
						user.acceptNewUser();
					});

					/* --- notice --- */
					$("#notice_show_button").click(function() {
						user.showNotice();
					});

					$('#notice_write_button').click(function() {
						user.moveNoticeWriterView();
					});

					$('#files_input').on('change', function(e) {
						user.appendFiles(e);
					});

					$("#notice_files_remove_button").click(function() {
						user.removeFileList();
					});

					$('#save_notice_button').click(function(e) {
						e.preventDefault();
						var flag = user.writeNotice();
						if (flag) {
							user.uploadFiles(0);
							$(".overlay").show();
						}
					});

					$("#notice_delete_button").click(function(e) {
						user.deleteNotice();
					});

					$("#move_notice_button").click(function(e) {
						user.moveNoticeView();
					});

					/* --- reset password --- */
					$('#send_email_button').click(function() {
						user.sendEmailByResetPassword();
					});

					$('#save_repassword_button').click(function() {
						user.updateUserByResetPassword();
					});

					/* --- users --- */
					$("#users_search_bar").keyup(function(e) {
						if (e.keyCode == 13) {
							user.findUser();
						}
					});

					$("#find_users_button").click(function() {
						user.findUser();
					});

					$("#users_search_bar").autocomplete({
						source : function(request, response) {
							$.ajax({
								type : 'POST',
								url : "/office/users/autocomplete",
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
								},
								minLength : 1
							});
						}
					});

					$("#users_back_button").click(function() {
						location.href = "/office/users";
					});

					/* --- admin --- */

					$("#add_company_button").click(function(e) {
						admin.addCompany();
					});

					$("#logoFile").change(function(e) {
						admin.drawImage();
					});

					$("#company_logo_upload_button").click(function(e) {
						admin.uploadLogoImage();
					});

					$("#company_logo_close_button").click(function(e) {
						var button = $(this);

						if (button.hasClass("checked")) {
							$("#my-dialog,#dialog-background").toggle();
						}
					});

					$(".admin_company_logo").click(function() {
						$("#my-dialog").show();
					});

					$("#admin_search_address_button").click(function() {
						var panel = $('#companyAddress');

						admin.showAdressInformation(panel);
					});

					$('#edit_company_button').click(function() {
						admin.modifyCompany();
					});

					$("#admin_company_delete_button").click(function() {
						var target = $(".chosen");
						var companyIdx = target.val();

						admin.deleteCompany(companyIdx);
					});

					$('.index--card__btn--delete').click(function() {
						var button = $(this);

						$('.deleteCompany__popup').css('display', 'table');
						$('.overlay').show();
						$('.overlay').css('background', '#9c9c9c');

						var div = button.parent();
						var target = div.find("input");
						target.addClass("chosen");
					});

					$('.admin_company_div').click(function() {
						var div = $(this);

						admin.moveTeamViewByCompanyIdx(div);
					});

					/* --- admin position --- */

					$(".admin_position_remove_button").click(function() {
						var panel = $(this);

						admin.removePositionTag(panel);
					});

					$('.admin_position_tag').click(function() {
						var panel = $(this);

						admin.addPositionTag(panel);
					});

					$("#admin_position_modification_button").click(function(e) {
						var button = $(this);

						admin.clickPositionModificationButton(button);
					});

					$("#admin_position_add_button").click(function(e) {
						admin.showPositionPopup();
					});

					$('#save_position_button').click(function() {
						admin.addNewPosition();
					});

					/* --- admin rank --- */

					$('.admin_rank_tag').click(function() {
						var panel = $(this);

						admin.addRankTag(panel);
					});

					$(".admin_rank_remove_button").click(function() {
						var panel = $(this);

						admin.removeRankTag(panel);
					});

					$("#admin_rank_modification_button").click(function(e) {
						var button = $(this);

						admin.clickRankModificationButton(button);
					});

					$("#admin_rank_add_button").click(function(e) {
						admin.showRankPopup();
					});

					$('#save_rank_button').click(function() {
						admin.addNewRank();
					});

					/* --- admin users --- */

					$("#admin_find_users_button").click(function() {
						admin.findUser();
					});

					$("#admin_users_search_bar").keyup(function(e) {
						if (e.keyCode == 13) {
							admin.findUser();
						}
					});

					$("#admin_users_search_bar").autocomplete({
						source : function(request, response) {
							$.ajax({
								type : 'POST',
								url : "/office/admin/users/autocomplete",
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
								},
								minLength : 1
							});
						}
					});

					$("#admin_search_user_address_button").click(function(e) {
						var panel = $("#admin_address")

						Admin.prototype.showAdressInformation(panel);
					});

					$("#admin_remove_user_button").click(function() {
						admin.deleteUser();
					});

					$(".admin_profile_sample_image").click(function(e) {
						var target = $(this).find("img");

						admin.updateProfilePictureByDefualtImage(target);
					});

					$(".admin_profile_upload_button").click(function(e) {
						var button = $(this);

						if (button.hasClass("checked")) {
							button.css('pointer-events', 'auto');
							admin.updateUserProfilePicture();
						} else {
							button.css('pointer-events', 'none');
						}
					});

					$("#admin_edit_user_button").click(function(e) {
						admin.editUser();
					});
					
					/* 사원 뱃지 기능 */
					$('#set_badge_button').click(function(e) {
						admin.setUserBadge();
					});

					$("#admin_simple_join_button").click(function(e) {
						admin.joinUserSimple();
					});

					$(".admin_detail_user_profile_button").click(function(e) {
						var button = $(this);

						if (button.hasClass("checked")) {
							button.css('pointer-events', 'auto');
							$("#my-dialog").hide();
							$("#dialog-background").hide();

						} else {
							button.css('pointer-events', 'none');
						}
					});

					$("#admin_profile_file").change(function(e) {
						admin.drawProfileImage();
					});

					$("#admin_add_user_button").click(function(e) {
						admin.createDetilAccount();
					});

					/* --- group place --- */
					$("#admin_save_group_place_button").click(function(e) {
						admin.addGroupPlace();
					});

					$("#placeFile").change(function(e) {
						admin.drawPlaceImage();
					});

					$('#edit_group_place_button').click(function(e) {
						admin.editGroupPlace();
					});

					$('#change_group_place_image_button').click(function() {
						admin.changeGroupPlaceImage();
					});

					/* --- company place --- */
					$("#admin_save_place_button").click(function(e) {
						admin.addPlace();
					});

					$('#edit_place_button').click(function(e) {
						admin.editPlace();
					});

					$('#change_place_image_button').click(function() {
						admin.changePlaceImage();
					});

					// --------
					// 직급 추가
					$("#add_rank_button").click(function(e) {
						admin.addRank();
					});

					// 직급 삭제
					$(".remove_rank").click(function(e) {
						admin.removeRank();
					});

					// 직책 추가
					$("#add_position_button").click(function(e) {
						admin.addPosition();
					});

					// 직급 삭제
					$(".remove_position").click(function(e) {
						admin.removePosition();
					});

					$('#profile-picture-cancel').click(function(e) {
						$('.profile-picture-popup').hide();
					});

					$('#profile-sample-picture-btn').click(function(e) {
						$('#profile-sample-picture').show();
					});
					
					/* super admin */
					$('#save_groupCompany_button').click(function(e) {
						superAdmin.saveGroupCompany();
					});
					
					$('#group_company_logo_upload_button').click(function(e) {
						superAdmin.changeGroupCompanyLogo();
					});
					
					$('#modify_group_company').click(function(e) {
						superAdmin.modifyGroupCompany();
					});
					
					$('#send_remover_token_button').click(function(e) {
						var idx = $('#groupCompanyIdx').val();
						
						superAdmin.sendRemoverToken(idx);
					});
					
					$('#save_account_button').click(function(e) {
						var idx = $('#companyIdx').val();
						
						superAdmin.saveAccount(idx);
					});
					
					$('.account__wrapper--close').click(function(e) {
						var panel = $(this).closest('.account__wrapper');
						var idx = panel.find('input[type=hidden]').val();
						
						superAdmin.removeAccount(panel, idx);
					});
				});
