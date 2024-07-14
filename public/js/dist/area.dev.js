"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var urlParams = new URLSearchParams(window.location.search);
  var region = urlParams.get('region');
  var regionSelect = document.getElementById('regionSelect');

  if (region) {
    regionSelect.value = region;
    fetchTouristSpots();
  }
});
var currentPage = 1;
var currentRegion = '';

function fetchTouristSpots() {
  var region = document.getElementById('regionSelect').value;

  if (!region) {
    alert('Please select a region.');
    return;
  }

  currentRegion = region;
  currentPage = 1;
  searchRegion(region, currentPage);
}

function searchRegion(region, page) {
  var loadingSpinner, response, data;
  return regeneratorRuntime.async(function searchRegion$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          loadingSpinner = document.getElementById('loadingSpinner');
          loadingSpinner.style.display = 'block';
          _context.prev = 2;
          _context.next = 5;
          return regeneratorRuntime.awrap(fetch('/search-region', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              region: region,
              pageNo: page
            })
          }));

        case 5:
          response = _context.sent;

          if (!response.ok) {
            _context.next = 13;
            break;
          }

          _context.next = 9;
          return regeneratorRuntime.awrap(response.json());

        case 9:
          data = _context.sent;
          displayResults(data.items, data.totalCount);
          _context.next = 15;
          break;

        case 13:
          console.error('Error fetching data', response.status);
          document.getElementById('results').innerHTML = 'Error fetching data';

        case 15:
          _context.next = 21;
          break;

        case 17:
          _context.prev = 17;
          _context.t0 = _context["catch"](2);
          console.error('Error:', _context.t0);
          document.getElementById('results').innerHTML = 'Error fetching data';

        case 21:
          _context.prev = 21;
          loadingSpinner.style.display = 'none';
          return _context.finish(21);

        case 24:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[2, 17, 21, 24]]);
}

function displayResults(items, totalCount) {
  var resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = '';

  if (items.length > 0) {
    var list = document.createElement('ul');
    items.forEach(function (item) {
      var listItem = document.createElement('li');
      listItem.dataset.contentid = item.contentid;
      var img = document.createElement('img');
      img.src = item.firstimage || 'images/default-image.jpg';
      img.alt = item.title || 'No title';
      img.style.width = '100px';
      img.style.height = '100px';
      var itemInfo = document.createElement('div');
      itemInfo.className = 'item-info';
      var title = document.createElement('h3');
      title.textContent = item.title || 'No title';
      var addr = document.createElement('p');
      addr.textContent = item.addr1 || 'No address available';
      var description = document.createElement('p');
      description.textContent = item.overview || 'No description available';
      itemInfo.appendChild(title);
      itemInfo.appendChild(addr);
      itemInfo.appendChild(description);
      listItem.appendChild(img);
      listItem.appendChild(itemInfo);
      listItem.addEventListener('click', function () {
        window.location.href = "tourist-spot.html?contentId=".concat(item.contentid);
      });
      list.appendChild(listItem);
    });
    resultsDiv.appendChild(list);
    displayPagination(totalCount);
  } else {
    resultsDiv.innerHTML = 'No results found';
  }
}

function displayPagination(totalCount) {
  var paginationDiv = document.getElementById('pagination');
  paginationDiv.innerHTML = '';
  var totalPages = Math.ceil(totalCount / 5);
  var maxPagesToShow = 5;
  var startPage = currentPage - Math.floor(maxPagesToShow / 2);
  startPage = Math.max(startPage, 1);
  var endPage = startPage + maxPagesToShow - 1;
  endPage = Math.min(endPage, totalPages);

  if (startPage > 1) {
    var prevButton = document.createElement('button');
    prevButton.innerHTML = '&laquo;';
    prevButton.className = 'arrow';
    prevButton.addEventListener('click', function () {
      currentPage = startPage - 1;
      searchRegion(currentRegion, currentPage);
    });
    paginationDiv.appendChild(prevButton);
  }

  var _loop = function _loop(i) {
    var pageButton = document.createElement('button');
    pageButton.textContent = i;
    pageButton.addEventListener('click', function () {
      currentPage = i;
      searchRegion(currentRegion, currentPage);
    });

    if (i === currentPage) {
      pageButton.style.backgroundColor = '#0056b3';
    }

    paginationDiv.appendChild(pageButton);
  };

  for (var i = startPage; i <= endPage; i++) {
    _loop(i);
  }

  if (endPage < totalPages) {
    var nextButton = document.createElement('button');
    nextButton.innerHTML = '&raquo;';
    nextButton.className = 'arrow';
    nextButton.addEventListener('click', function () {
      currentPage = endPage + 1;
      searchRegion(currentRegion, currentPage);
    });
    paginationDiv.appendChild(nextButton);
  }
}
//# sourceMappingURL=area.dev.js.map
