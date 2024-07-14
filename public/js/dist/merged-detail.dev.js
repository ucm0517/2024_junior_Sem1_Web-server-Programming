"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var urlParams = new URLSearchParams(window.location.search);
  var contentId = urlParams.get('contentId');

  if (!contentId) {
    document.getElementById('detailContent').innerText = 'No content ID provided';
    return;
  } // Fetch basic details


  fetch('/barrier-free-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contentId: contentId
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    if (data.response && data.response.body && data.response.body.items && data.response.body.items.item) {
      displayDetails(data.response.body.items.item);
    } else {
      document.getElementById('detailContent').innerText = 'No details available';
    }
  })["catch"](function (error) {
    console.error('Error fetching detail data:', error);
    document.getElementById('detailContent').innerText = 'Error fetching detail data';
  }); // Fetch additional info (disability info and images)

  fetch('/get-disability-info-and-images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contentId: contentId
    })
  }).then(function (response) {
    return response.json();
  }).then(function (data) {
    displayAdditionalInfo(data);
  })["catch"](function (error) {
    console.error('Error fetching additional data:', error);
    document.getElementById('detailContent').innerText = 'Error fetching additional data';
  });
});

function displayDetails(item) {
  var detailsContent = document.getElementById('detailContent'); // 제목

  var title = document.createElement('h2');
  title.innerText = item.title || '제목 없음';
  detailsContent.appendChild(title); // 주소

  var addr = document.createElement('p');
  addr.innerText = item.addr1 || '주소 없음';
  detailsContent.appendChild(addr); // 상세 설명

  var description = document.createElement('p');
  description.innerText = item.overview || 'No description available';
  detailsContent.appendChild(description); // 이미지 갤러리

  if (item.firstimage) {
    var imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';
    item.firstimage.split('|').forEach(function (img) {
      var imgElement = document.createElement('img');
      imgElement.src = img;
      imageGallery.appendChild(imgElement);
    });
    detailsContent.appendChild(imageGallery);
  } else {
    var noImages = document.createElement('p');
    noImages.innerText = '이미지 없음';
    detailsContent.appendChild(noImages);
  } // 홈페이지 링크


  if (item.homepage) {
    var homepageLink = document.createElement('a');
    homepageLink.href = item.homepage;
    homepageLink.textContent = '홈페이지 이동';
    homepageLink.target = '_blank';
    detailsContent.appendChild(homepageLink);
  } else {
    var noHomepage = document.createElement('p');
    noHomepage.innerText = '홈페이지 정보 없음';
    detailsContent.appendChild(noHomepage);
  } // 카카오 지도 API 설정


  if (item.mapx && item.mapy) {
    var mapContainer = document.getElementById('map');
    var mapOption = {
      center: new kakao.maps.LatLng(item.mapy, item.mapx),
      level: 3
    };
    var map = new kakao.maps.Map(mapContainer, mapOption);
    var marker = new kakao.maps.Marker({
      position: new kakao.maps.LatLng(item.mapy, item.mapx)
    });
    marker.setMap(map);
  } // 무장애 정보


  if (item.bfree_content) {
    var barrierFreeInfo = document.createElement('div');
    barrierFreeInfo.innerHTML = "\n            <h3>Barrier-Free Information</h3>\n            <p>".concat(item.bfree_content, "</p>\n        ");
    detailsContent.appendChild(barrierFreeInfo);
  } else {
    var noBarrierFreeInfo = document.createElement('p');
    noBarrierFreeInfo.innerText = 'No barrier-free information available';
    detailsContent.appendChild(noBarrierFreeInfo);
  }
}

function displayAdditionalInfo(data) {
  var disabilityInfo = data.disabilityInfo,
      images = data.images,
      introInfo = data.introInfo;
  var detailsContent = document.getElementById('detailContent'); // 추가 무장애 정보가 없으면 함수 종료

  if (!disabilityInfo.response.body.items.item) return;
  var item = disabilityInfo.response.body.items.item[0];
  var barrierInfo = document.createElement('div');
  barrierInfo.classList.add('barrier-info');
  barrierInfo.innerHTML = "\n        <h3>\uBB34\uC7A5\uC560 \uD3B8\uC758 \uC815\uBCF4</h3>\n        ".concat(item.wheelchair ? "<p>\uD720\uCCB4\uC5B4: ".concat(item.wheelchair, "</p>") : '', "\n        ").concat(item.exit ? "<p>\uCD9C\uAD6C: ".concat(item.exit, "</p>") : '', "\n        ").concat(item.elevator ? "<p>\uC5D8\uB9AC\uBCA0\uC774\uD130: ".concat(item.elevator, "</p>") : '', "\n        ").concat(item.restroom ? "<p>\uC7A5\uC560\uC778 \uD654\uC7A5\uC2E4: ".concat(item.restroom, "</p>") : '', "\n        ").concat(item.guidesystem ? "<p>\uC720\uB3C4 \uC2DC\uC2A4\uD15C: ".concat(item.guidesystem, "</p>") : '', "\n        ").concat(item.blindhandicapetc ? "<p>\uC2DC\uAC01 \uC7A5\uC560\uC778 \uAE30\uD0C0: ".concat(item.blindhandicapetc, "</p>") : '', "\n        ").concat(item.signguide ? "<p>\uD45C\uC9C0\uD310 \uC548\uB0B4: ".concat(item.signguide, "</p>") : '', "\n        ").concat(item.videoguide ? "<p>\uBE44\uB514\uC624 \uC548\uB0B4: ".concat(item.videoguide, "</p>") : '', "\n        ").concat(item.hearingroom ? "<p>\uCCAD\uAC01 \uC7A5\uC560\uC778 \uC2E4: ".concat(item.hearingroom, "</p>") : '', "\n        ").concat(item.hearinghandicapetc ? "<p>\uCCAD\uAC01 \uC7A5\uC560\uC778 \uAE30\uD0C0: ".concat(item.hearinghandicapetc, "</p>") : '', "\n        ").concat(item.stroller ? "<p>\uC720\uBAA8\uCC28: ".concat(item.stroller, "</p>") : '', "\n        ").concat(item.nursingroom ? "<p>\uC218\uC720\uC2E4: ".concat(item.nursingroom, "</p>") : '', "\n        ").concat(item.babysparechair ? "<p>\uC720\uC544 \uBCF4\uC870 \uC758\uC790: ".concat(item.babysparechair, "</p>") : '', "\n        ").concat(item.babycarriage ? "<p>\uC720\uC544 \uBC0F \uAC00\uC871 \uAE30\uD0C0: ".concat(item.babycarriage, "</p>") : '', "\n        ").concat(item.auditorium ? "<p>\uAC15\uB2F9: ".concat(item.auditorium, "</p>") : '', "\n        ").concat(item.room ? "<p>\uBC29: ".concat(item.room, "</p>") : '', "\n        ").concat(item.other ? "<p>\uAE30\uD0C0 \uC7A5\uC560\uC778 \uC2DC\uC124: ".concat(item.other, "</p>") : '', "\n        ").concat(item.braileblock ? "<p>\uC810\uC790 \uBE14\uB85D: ".concat(item.braileblock, "</p>") : '', "\n        ").concat(item.blindhandicapetc ? "<p>\uC548\uB0B4\uACAC: ".concat(item.blindhandicapetc, "</p>") : '', "\n        ").concat(item.guidesystem ? "<p>\uC548\uB0B4 \uC778\uB825: ".concat(item.guidesystem, "</p>") : '', "\n        ").concat(item.audioguide ? "<p>\uC624\uB514\uC624 \uC548\uB0B4: ".concat(item.audioguide, "</p>") : '', "\n        ").concat(item.largeprintguide ? "<p>\uD070 \uAE00\uC528 \uC548\uB0B4: ".concat(item.largeprintguide, "</p>") : '', "\n        ").concat(item.brailepromotionalmaterial ? "<p>\uC810\uC790 \uD64D\uBCF4\uBB3C: ".concat(item.brailepromotionalmaterial, "</p>") : '', "\n        ").concat(item.parking ? "<p>\uC8FC\uCC28: ".concat(item.parking, "</p>") : '', "\n        ").concat(item.route ? "<p>\uACBD\uB85C: ".concat(item.route, "</p>") : '', "\n        ").concat(item.publictransport ? "<p>\uB300\uC911\uAD50\uD1B5: ".concat(item.publictransport, "</p>") : '', "\n        ").concat(item.ticketoffice ? "<p>\uD2F0\uCF13 \uC624\uD53C\uC2A4: ".concat(item.ticketoffice, "</p>") : '', "\n        ").concat(item.promotionalmaterial ? "<p>\uD64D\uBCF4\uBB3C: ".concat(item.promotionalmaterial, "</p>") : '', "\n    ");
  detailsContent.appendChild(barrierInfo); // 이미지 갤러리 추가

  if (images.response.body.items.item) {
    var imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';
    images.response.body.items.item.forEach(function (img) {
      var imgElement = document.createElement('img');
      imgElement.src = img.originimgurl;
      imageGallery.appendChild(imgElement);
    });
    detailsContent.appendChild(imageGallery);
  } else {
    var noImages = document.createElement('p');
    noImages.innerText = '이미지 없음';
    detailsContent.appendChild(noImages);
  } // 소개 정보 추가


  if (introInfo && introInfo.response.body.items.item) {
    var introInfoDiv = document.createElement('div');
    introInfoDiv.innerHTML = "\n            <h3>\uC18C\uAC1C \uC815\uBCF4</h3>\n            <p>".concat(introInfo.response.body.items.item[0].overview || '소개 정보 없음', "</p>\n        ");
    detailsContent.appendChild(introInfoDiv);
  } else {
    var noIntroInfo = document.createElement('p');
    noIntroInfo.innerText = '소개 정보 없음';
    detailsContent.appendChild(noIntroInfo);
  }
}
//# sourceMappingURL=merged-detail.dev.js.map
