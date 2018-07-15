var Book = function() {
};

Book.prototype.setSortValue = function() {
	var sort = $("#search_sort_select").val();
	$('#sort').val(sort);
}

Book.prototype.searchBook = function() {
	var keyword = $('#keyword').val();
	if (!keyword) {
		alert("검색하실 책 정보를 입력해주세요.");
		return false;
	}

	Book.prototype.setSortValue();
	$('#startPage').val(1);

	$("#search_form").submit();
};

Book.prototype.clickBookmark = function(bookmark_button) {
	var contextPath = $("#context-path").attr("content");
	var name = $("#console_name").text();
	var i = bookmark_button.children();
	var dt = bookmark_button.parent();
	var isbn = dt.children("input").val();
	var userIdx = $("#userIdx").val();

	var data = {
		isbn : isbn
	}

	data = JSON.stringify(data);

	if (i.hasClass("fa-bookmark-o")) {
		$.ajax({
			url : contextPath + 'user/' + userIdx + '/bookmark',
			type : 'POST',
			data : data,
			contentType : 'application/json',
			dataType : 'text',
			success : function(response) {
				if ("duplicate bookmarks" == response) {
					alert("북마크에 해당 책이 이미 저장되어있습니다.");
				} else if ("fail" == response) {
					alert("북마크에 해당 책을 저장하지 못하였습니다. 죄송하지만 다시 한번 시도해주세요.");
				} else {
					i.removeClass("fa-bookmark-o");
					i.addClass("fa-bookmark");
				}
			}
		});

	} else {
		$.ajax({
			url : contextPath + 'user/' + userIdx + '/bookmark/',
			type : 'DELETE',
			data : data,
			contentType : 'application/json',
			dataType : 'text',
			success : function(response) {
				if ("fail" == response) {
					alert("북마크에 해당 책을 삭제하지 못하였습니다. 죄송하지만 다시 한번 시도해주세요.");
				} else {
					if (name == "북마크") {
						var td = dt.parent().parent();
						td.remove();
					} else {
						i.removeClass("fa-bookmark");
						i.addClass("fa-bookmark-o");
					}
				}
			}
		});
	}

};