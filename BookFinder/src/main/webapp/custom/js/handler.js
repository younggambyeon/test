$(document).ready(function() {

	var user = new User();
	var book = new Book();

	/* --- join --- */
	$('#join_button').click(function() {
		user.saveUser();
	});

	/* --- book --- */
	$("#search_button").click(function() {
		book.searchBook();
	});

	$("#search_sort_select").change(function() {
		book.setSortValue();
	});

});