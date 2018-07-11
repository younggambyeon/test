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

	$("#keyword").autocomplete({
		source : function(request, response) {
			$.ajax({
				type : 'GET',
				url : "/finder/book/history",
				dataType : "json",
				success : function(data) {
					response($.map(data, function(item) {
						return {
							label : item.name,
							value : item.name
						}
					}));
				},
				minChars : 0,
				max : 10,
				autoFill : false,
				mustMatch : true,
				matchContains : true,
				scrollHeight : 220
			});
		}
	});

});