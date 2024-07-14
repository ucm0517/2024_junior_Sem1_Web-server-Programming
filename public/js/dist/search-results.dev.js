"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var urlParams = new URLSearchParams(window.location.search);
  var keyword = urlParams.get('keyword');
  var resultsDiv = document.getElementById('results');
  var loadingSpinner = document.getElementById('loadingSpinner');
  var paginationDiv = document.getElementById('pagination');
  var currentPage = 1;

  if (!keyword) {
    resultsDiv.innerHTML = '검색어가 제공되지 않았습니다.';
    return;
  }

  searchKeyword(keyword, currentPage);

  function searchKeyword(keyword, pageNo) {
    var response, data;
    return regeneratorRuntime.async(function searchKeyword$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            resultsDiv.innerHTML = '';
            paginationDiv.innerHTML = '';
            loadingSpinner.style.display = 'block';
            console.log("Searching for keyword: ".concat(keyword, ", page: ").concat(pageNo)); // 추가된 로그

            _context.prev = 4;
            _context.next = 7;
            return regeneratorRuntime.awrap(fetch('/search-keyword', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                keyword: keyword,
                pageNo: pageNo
              })
            }));

          case 7:
            response = _context.sent;

            if (!response.ok) {
              _context.next = 16;
              break;
            }

            _context.next = 11;
            return regeneratorRuntime.awrap(response.json());

          case 11:
            data = _context.sent;
            console.log("Search results: ".concat(JSON.stringify(data))); // 추가된 로그

            if (data.response && data.response.body && data.response.body.items && data.response.body.items.item) {
              displayResults(data.response.body.items.item, data.response.body.totalCount);
            } else {
              resultsDiv.innerHTML = 'No results found';
            }

            _context.next = 17;
            break;

          case 16:
            resultsDiv.innerHTML = 'Error fetching data';

          case 17:
            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](4);
            console.error('Error:', _context.t0); // 추가된 로그

            resultsDiv.innerHTML = 'Error fetching data';

          case 23:
            _context.prev = 23;
            loadingSpinner.style.display = 'none';
            return _context.finish(23);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[4, 19, 23, 26]]);
  }

  function displayResults(items, totalCount) {
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
          window.location.href = "details.html?contentId=".concat(item.contentid);
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
        searchKeyword(keyword, currentPage);
      });
      paginationDiv.appendChild(prevButton);
    }

    var _loop = function _loop(i) {
      var pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.addEventListener('click', function () {
        currentPage = i;
        searchKeyword(keyword, currentPage);
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
        searchKeyword(keyword, currentPage);
      });
      paginationDiv.appendChild(nextButton);
    }
  }
});
//# sourceMappingURL=search-results.dev.js.map
