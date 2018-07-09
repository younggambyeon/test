function whereAmI() {
	var idx = $("#userIdx").val();

	var options = {
		enableHighAccuracy : false,
		maximumAge : 30000,
		timeout : 15000
	}

	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(success, error, options);
	} else {
		var message = '이 브라우저에서는 Geolocation이 지원되지 않습니다.';
		showWeatherAlert(message);
	}

	function error(e) {
		// 1: 위치 권한, 2: 브라우저 문제, 3: 타임아웃이 발생됨.
		console.log("Geolocation error code : [ " + e.code + " ] " + e.message);

		callWeatherAPI(idx, 0, 0, false)
	}

	function success(pos) {
		var latitude = pos.coords.latitude;
		var longitude = pos.coords.longitude;

		callWeatherAPI(idx, latitude, longitude, true)
	}
}

function callWeatherAPI(idx, latitude, longitude, flag) {
	var myLatlng = {
		latitude : latitude,
		longitude : longitude
	};

	data = JSON.stringify(myLatlng);

	$.ajax({
		url : "/office/api/user/" + idx + "/location/weather/forecast",
		type : 'POST',
		data : data,
		contentType : 'application/json',
		dataType : 'json',
		success : function(response) {
			var weatherList = response;

			if (0 < weatherList.length) {
				var weatherToday = weatherList[0];

				// today
				var todayTd = $("#today_td");

				if (!flag) {
					todayTd.find("#today_tile").text("회사 위치");
				} else {
					todayTd.find("#today_tile").text("내 위치");
				}

				todayTd.find('img').attr("src",
						"/office/design/img/" + weatherToday.weather + ".png");

				todayTd.find('#today_temp').text(weatherToday.temp + "°");

				// today detail
				var todayDetailTd = $("#today_detail_td");
				todayDetailTd.find("#detail_title").text(weatherToday.dt_txt);

				todayDetailTd.find('img').attr("src",
						"/office/design/img/" + weatherToday.weather + ".png");
				todayDetailTd.find('#detail_temp')
						.text(weatherToday.temp + "°");

				// forecast
				var forecastTd = $("#forecast_td");

				for (i = 0; i < weatherList.length; i++) {
					if (i != 0) {
						var weather = weatherList[i];

						var html = '<td class="B"><h5 id="forecast_title">'
								+ weather.dt_txt + '</h5>'
								+ '<img src="/office/design/img/'
								+ weather.weather
								+ '.png" style="width: 70%" />'
								+ '<h5 id="forecast_temp">' + weather.temp
								+ '°</h5></td>';

						forecastTd.append(html);
					}
				}

				$("#spiner").hide();
				$("#home_weather_box").show();

			} else {
				var message = '날씨 서비스 오류입니다. 잠시 후 시도하세요.';
				showWeatherAlert(message);
			}
		},
		error : function(request, status, error) {
			var message = '날씨 서비스 오류입니다. 잠시 후 시도하세요.';
			showWeatherAlert(message);
		}
	});
}

function showWeatherAlert(message) {
	var weatherMessage = $('.weather_message');
	var weatherSpan = weatherMessage.find('span');

	weatherMessage.show();
	weatherSpan.empty();
	weatherSpan.append(message);
}