"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var button = document.querySelector('.button'); // 버튼 클릭 이벤트 생성

  button.addEventListener('click', function () {
    navigator.geolocation.getCurrentPosition(success, fail); // 위치 정보 요청
  });

  window.onload = function () {
    // 새로 고침하면 바로 위치 정보를 요청
    navigator.geolocation.getCurrentPosition(success, fail);
  };

  var success = function success(position) {
    var latitude = position.coords.latitude; // 위도

    var longitude = position.coords.longitude; // 경도

    getWeather(latitude, longitude);
  };

  var fail = function fail() {
    alert("위치 접근이 허용되지 않았습니다.");
  };

  var tempSection = document.querySelector('.temperature');
  var placeSection = document.querySelector('.place');
  var descSection = document.querySelector('.description');
  var iconSection = document.querySelector('.icon');

  var getWeather = function getWeather(lat, lon) {
    var response, json, temperature, place, description, icon, iconURL;
    return regeneratorRuntime.async(function getWeather$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.prev = 0;
            _context.next = 3;
            return regeneratorRuntime.awrap(fetch('http://localhost:3000/get-weather', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                lat: lat,
                lon: lon
              })
            }));

          case 3:
            response = _context.sent;

            if (response.ok) {
              _context.next = 6;
              break;
            }

            throw new Error('Network response was not ok');

          case 6:
            _context.next = 8;
            return regeneratorRuntime.awrap(response.json());

          case 8:
            json = _context.sent;
            temperature = json.main.temp;
            place = json.name;
            description = json.weather[0].description;
            tempSection.innerText = "".concat(temperature, "\xB0C");
            placeSection.innerText = place;
            descSection.innerText = description;
            icon = json.weather[0].icon;
            iconURL = "http://openweathermap.org/img/wn/".concat(icon, "@2x.png");
            iconSection.setAttribute('src', iconURL);
            iconSection.style.display = 'block'; // 이미지 로드 후 표시

            _context.next = 24;
            break;

          case 21:
            _context.prev = 21;
            _context.t0 = _context["catch"](0);
            alert('날씨 정보를 불러오는 데 실패했습니다: ' + _context.t0.message);

          case 24:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[0, 21]]);
  };
});
//# sourceMappingURL=weather.dev.js.map
