var Book = function() {

};

Book.prototype.searchBook = function() {
	var keyword = $('#keyword').val();
	var page = $('#page').val();

	if (!keyword) {
		alert("검색하실 책 정보를 입력해주세요.");
		return false;
	}

	document.location.href = "/finder/book?keyword=" + keyword + "&page=" + page;
}
