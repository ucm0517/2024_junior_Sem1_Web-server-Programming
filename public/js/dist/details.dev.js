"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

document.addEventListener('DOMContentLoaded', function () {
  var urlParams = new URLSearchParams(window.location.search);
  var contentId = urlParams.get('contentId');

  if (!contentId) {
    document.getElementById('detailContent').innerText = 'No content ID provided';
    return;
  } // 두 API에서 데이터를 모두 가져오기


  Promise.all([fetch('/barrier-free-info', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contentId: contentId
    })
  }).then(function (response) {
    return response.json();
  }), fetch('/get-disability-info-and-images', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contentId: contentId
    })
  }).then(function (response) {
    return response.json();
  })]).then(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        basicData = _ref2[0],
        additionalData = _ref2[1];

    console.log('Basic Data:', basicData); // 추가된 로그

    console.log('Additional Data:', additionalData); // 추가된 로그

    displayDetails(basicData, additionalData);
  })["catch"](function (error) {
    console.error('Error fetching data:', error);
    document.getElementById('detailContent').innerText = 'Error fetching data';
  });
});

function displayDetails(basicData, additionalData) {
  var detailsContent = document.getElementById('detailContent');
  detailsContent.innerHTML = ''; // Clear previous details
  // 기본 데이터 처리

  if (basicData.response && basicData.response.body && basicData.response.body.items) {
    var item = Array.isArray(basicData.response.body.items.item) ? basicData.response.body.items.item[0] : basicData.response.body.items.item;

    if (item) {
      var img = document.createElement('img');
      img.src = item.firstimage || 'images/default-image.jpg'; // Use default image

      img.alt = item.title || 'No title';
      var title = document.createElement('h2');
      title.textContent = item.title || '제목 없음';
      var addr = document.createElement('p');
      addr.textContent = item.addr1 || '주소 없음';
      var description = document.createElement('p');
      description.textContent = item.overview || 'No description available';
      var homepageLink = document.createElement('a');
      var parser = new DOMParser();
      var doc = parser.parseFromString(item.homepage, 'text/html');
      var link = doc.querySelector('a') ? doc.querySelector('a').href : '#';
      homepageLink.href = link;
      homepageLink.textContent = '홈페이지 이동';
      homepageLink.target = '_blank';
      detailsContent.appendChild(img);
      detailsContent.appendChild(title);
      detailsContent.appendChild(addr);
      detailsContent.appendChild(description);
      detailsContent.appendChild(homepageLink);
    } else {
      detailsContent.innerHTML = 'No details available';
    }
  } else {
    detailsContent.innerHTML = 'No details available';
  } // 추가 데이터 처리


  if (additionalData.disabilityInfo && additionalData.disabilityInfo.response.body.items.item) {
    var _item = additionalData.disabilityInfo.response.body.items.item[0];
    var barrierInfo = document.createElement('div');
    barrierInfo.classList.add('barrier-info');
    barrierInfo.innerHTML = "\n            <h3>\uBB34\uC7A5\uC560 \uD3B8\uC758 \uC815\uBCF4</h3>\n            ".concat(_item.wheelchair ? "<p>\uD720\uCCB4\uC5B4: ".concat(_item.wheelchair, "</p>") : '', "\n            ").concat(_item.exit ? "<p>\uCD9C\uAD6C: ".concat(_item.exit, "</p>") : '', "\n            ").concat(_item.elevator ? "<p>\uC5D8\uB9AC\uBCA0\uC774\uD130: ".concat(_item.elevator, "</p>") : '', "\n            ").concat(_item.restroom ? "<p>\uC7A5\uC560\uC778 \uD654\uC7A5\uC2E4: ".concat(_item.restroom, "</p>") : '', "\n            ").concat(_item.guidesystem ? "<p>\uC720\uB3C4 \uC2DC\uC2A4\uD15C: ".concat(_item.guidesystem, "</p>") : '', "\n            ").concat(_item.blindhandicapetc ? "<p>\uC2DC\uAC01 \uC7A5\uC560\uC778 \uAE30\uD0C0: ".concat(_item.blindhandicapetc, "</p>") : '', "\n            ").concat(_item.signguide ? "<p>\uD45C\uC9C0\uD310 \uC548\uB0B4: ".concat(_item.signguide, "</p>") : '', "\n            ").concat(_item.videoguide ? "<p>\uBE44\uB514\uC624 \uC548\uB0B4: ".concat(_item.videoguide, "</p>") : '', "\n            ").concat(_item.hearingroom ? "<p>\uCCAD\uAC01 \uC7A5\uC560\uC778 \uC2E4: ".concat(_item.hearingroom, "</p>") : '', "\n            ").concat(_item.hearinghandicapetc ? "<p>\uCCAD\uAC01 \uC7A5\uC560\uC778 \uAE30\uD0C0: ".concat(_item.hearinghandicapetc, "</p>") : '', "\n            ").concat(_item.stroller ? "<p>\uC720\uBAA8\uCC28: ".concat(_item.stroller, "</p>") : '', "\n            ").concat(_item.nursingroom ? "<p>\uC218\uC720\uC2E4: ".concat(_item.nursingroom, "</p>") : '', "\n            ").concat(_item.babysparechair ? "<p>\uC720\uC544 \uBCF4\uC870 \uC758\uC790: ".concat(_item.babysparechair, "</p>") : '', "\n            ").concat(_item.babycarriage ? "<p>\uC720\uC544 \uBC0F \uAC00\uC871 \uAE30\uD0C0: ".concat(_item.babycarriage, "</p>") : '', "\n            ").concat(_item.auditorium ? "<p>\uAC15\uB2F9: ".concat(_item.auditorium, "</p>") : '', "\n            ").concat(_item.room ? "<p>\uBC29: ".concat(_item.room, "</p>") : '', "\n            ").concat(_item.other ? "<p>\uAE30\uD0C0 \uC7A5\uC560\uC778 \uC2DC\uC124: ".concat(_item.other, "</p>") : '', "\n            ").concat(_item.braileblock ? "<p>\uC810\uC790 \uBE14\uB85D: ".concat(_item.braileblock, "</p>") : '', "\n            ").concat(_item.blindhandicapetc ? "<p>\uC548\uB0B4\uACAC: ".concat(_item.blindhandicapetc, "</p>") : '', "\n            ").concat(_item.guidesystem ? "<p>\uC548\uB0B4 \uC778\uB825: ".concat(_item.guidesystem, "</p>") : '', "\n            ").concat(_item.audioguide ? "<p>\uC624\uB514\uC624 \uC548\uB0B4: ".concat(_item.audioguide, "</p>") : '', "\n            ").concat(_item.largeprintguide ? "<p>\uD070 \uAE00\uC528 \uC548\uB0B4: ".concat(_item.largeprintguide, "</p>") : '', "\n            ").concat(_item.brailepromotionalmaterial ? "<p>\uC810\uC790 \uD64D\uBCF4\uBB3C: ".concat(_item.brailepromotionalmaterial, "</p>") : '', "\n            ").concat(_item.parking ? "<p>\uC8FC\uCC28: ".concat(_item.parking, "</p>") : '', "\n            ").concat(_item.route ? "<p>\uACBD\uB85C: ".concat(_item.route, "</p>") : '', "\n            ").concat(_item.publictransport ? "<p>\uB300\uC911\uAD50\uD1B5: ".concat(_item.publictransport, "</p>") : '', "\n            ").concat(_item.ticketoffice ? "<p>\uD2F0\uCF13 \uC624\uD53C\uC2A4: ".concat(_item.ticketoffice, "</p>") : '', "\n            ").concat(_item.promotionalmaterial ? "<p>\uD64D\uBCF4\uBB3C: ".concat(_item.promotionalmaterial, "</p>") : '', "\n        ");
    detailsContent.appendChild(barrierInfo);
  } else {
    var noBarrierFreeInfo = document.createElement('p');
    noBarrierFreeInfo.innerText = 'No barrier-free information available';
    detailsContent.appendChild(noBarrierFreeInfo);
  } // 이미지 갤러리 추가


  if (additionalData.images && additionalData.images.response.body.items.item) {
    var imageGallery = document.createElement('div');
    imageGallery.className = 'image-gallery';
    additionalData.images.response.body.items.item.forEach(function (img) {
      var imgElement = document.createElement('img');
      imgElement.src = img.originimgurl;
      imageGallery.appendChild(imgElement);
    });
    detailsContent.appendChild(imageGallery);
  } else {
    var noImages = document.createElement('p');
    noImages.innerText = '이미지 없음';
    detailsContent.appendChild(noImages);
  }
}
//# sourceMappingURL=details.dev.js.map
