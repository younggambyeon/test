var Book = function() {

};

Book.prototype.searchBook = function() {
	var keyword = $('#keyword').val();
	if (!keyword) {
		alert("검색하실 책 정보를 입력해주세요.");
		return false;
	}

	var sort = $("#search_sort_select").val();
	$('#sort').val(sort);
	$('#startPage').val(1);

	$("#search_form").submit();
};

Book.prototype.clickBookmark = function(bookmark_button) {
	var i = bookmark_button.children();
	var dt = bookmark_button.parent();
	var isbn = dt.children("input").val();
	var userIdx = $("#userIdx").val();

	if (i.hasClass("fa-bookmark-o")) {
		i.removeClass("fa-bookmark-o");
		i.addClass("fa-bookmark");

	} else {
		i.removeClass("fa-bookmark");
		i.addClass("fa-bookmark-o");
	}

};