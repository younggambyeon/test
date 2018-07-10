$(document).ready(function() {

	var user = new User();

	/* --- join --- */
	$('#join_button').click(function() {
		user.saveUser();
	});

	$("#refresh_button").click(function(e) {
		user.refreshAuthenticationKey();
	});

	$(document).on("click", ".ip_delete_button", function(e) {
		var panel = $(this);
		user.deleteAccessIpByIdx(panel);
	});

	$("#ip_add_button").click(function(e) {
		user.addIpInputTag();
	});

	$("#save_button").click(function(e) {
		user.saveAccessIp();
	});

	$('#change_password_button').click(function() {
		user.changePassword();
	});

	$('#save_account_button').click(function() {
		admin.addAccount();
	});

	$('#search_user_button').click(function() {
		admin.searchUser();
	})
});