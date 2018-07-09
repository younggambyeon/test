var SmartService = function() {

};

SmartService.prototype.showPlaces = function() {
	var pageTag = $("#place_page");
	var offset = (parseInt(pageTag.val()) + 1);

	pageTag.val(offset);

	$.ajax({
		url : "/office/places/paging?offset=" + offset,
		type : 'GET',
		dataType : 'json',
		success : function(response) {
			var places = response;
			var target = $("#places_box");

			if (0 < places.length) {
				for (var i = 0; i < places.length; i++) {
					var place = places[i];

					SmartService.prototype.appendPlace(target, place);
				}

				$('img.lazy').lazyload({
					placeholder : "/office/custom/img/spinner.gif"
				});
			} else {
				if (offset == 1) {
					$("#smart_place_room").show();
				}
			}
		},

		error : function(request, status, error) {

		}
	});
};

SmartService.prototype.appendPlace = function(target, place) {
	// SmartService.prototype.showPendingMsg()
	// 브레인 서비스 준비되면 SmartService.prototype.showDevice('+place.idx+') 로 교체

	var html = '<div class="col-md-4 place">'
			+ '<div class="thumbnail-box-wrapper pointer" onclick="SmartService.prototype.showPendingMsg()">'
			+ '<div class="thumbnail-box"><div class="thumb-overlay bg-white"></div>'
			+ '<img data-original="/office' + place.imagePath
			+ '" class="lazy" /></div>'
			+ '<div class="thumb-pane"><h3 class="thumb-heading"><span> '
			+ place.name + ' </span>' + '</h3></div></div></div>';

	target.append(html);
}

SmartService.prototype.showPendingMsg = function() {
	var message = '서비스 준비중입니다.';

	var box = $('.box_alert_message');
	box.text(message);
	box.show();
}

SmartService.prototype.showDevice = function(placeIdx) {
	var data = {
		idx : placeIdx
	};

	data = JSON.stringify(data);

	$.ajax({
		url : "/office/places/device",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'text',
		success : function(response) {
			// show spinner
			// append

		},

		error : function(request, status, error) {

		}
	});
}
