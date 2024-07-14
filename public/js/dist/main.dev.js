"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  var userId = sessionStorage.getItem('userId'); // userId를 세션에서 가져옴

  if (userId) {
    fetchUserReviews(userId); // userId를 사용하여 리뷰 가져오기
  } else {
    console.error('사용자 ID가 없습니다.');
  }

  dropdownToggles.forEach(function (toggle) {
    toggle.addEventListener('mouseover', function () {
      var dropdown = this.nextElementSibling;

      if (dropdown && dropdown.classList.contains('nav-dropdown')) {
        dropdown.style.display = 'block';
      }
    });
    toggle.addEventListener('mouseout', function () {
      var dropdown = this.nextElementSibling;

      if (dropdown && dropdown.classList.contains('nav-dropdown')) {
        dropdown.style.display = 'none';
      }
    });
  });
  var dropdowns = document.querySelectorAll('.nav-dropdown');
  dropdowns.forEach(function (dropdown) {
    dropdown.addEventListener('mouseover', function () {
      this.style.display = 'block';
    });
    dropdown.addEventListener('mouseout', function () {
      this.style.display = 'none';
    });
  });
  var currentPage = 1;
  var currentKeyword = '';
  document.getElementById('searchForm').addEventListener('submit', function (event) {
    event.preventDefault();
    var keyword = document.getElementById('keyword').value;

    if (!keyword) {
      alert('Please enter a keyword.');
      return;
    }

    currentKeyword = keyword;
    currentPage = 1;
    searchKeyword(keyword, currentPage);
  });

  function searchKeyword(keyword, page) {
    var loadingSpinner, response, data;
    return regeneratorRuntime.async(function searchKeyword$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            console.log("Searching for keyword: ".concat(keyword, ", page: ").concat(page));
            loadingSpinner = document.getElementById('loadingSpinner');
            loadingSpinner.style.display = 'block';
            _context.prev = 3;
            _context.next = 6;
            return regeneratorRuntime.awrap(fetch('http://localhost:3000/search-keyword', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                keyword: keyword,
                pageNo: page
              })
            }));

          case 6:
            response = _context.sent;

            if (!response.ok) {
              _context.next = 15;
              break;
            }

            _context.next = 10;
            return regeneratorRuntime.awrap(response.json());

          case 10:
            data = _context.sent;
            console.log('Received data:', data);
            displayResults(data);
            _context.next = 17;
            break;

          case 15:
            console.error('Error fetching data', response.status);
            document.getElementById('results').innerHTML = 'Error fetching data';

          case 17:
            _context.next = 23;
            break;

          case 19:
            _context.prev = 19;
            _context.t0 = _context["catch"](3);
            console.error('Error:', _context.t0);
            document.getElementById('results').innerHTML = 'Error fetching data';

          case 23:
            _context.prev = 23;
            loadingSpinner.style.display = 'none';
            return _context.finish(23);

          case 26:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[3, 19, 23, 26]]);
  }

  function fetchDetails(contentId) {
    var response, data;
    return regeneratorRuntime.async(function fetchDetails$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            console.log("Fetching details for contentId: ".concat(contentId));
            _context2.prev = 1;
            _context2.next = 4;
            return regeneratorRuntime.awrap(fetch('http://localhost:3000/get-disability-info-and-images', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                contentId: contentId
              })
            }));

          case 4:
            response = _context2.sent;

            if (!response.ok) {
              _context2.next = 14;
              break;
            }

            _context2.next = 8;
            return regeneratorRuntime.awrap(response.json());

          case 8:
            data = _context2.sent;
            console.log('Received detail data:', data);
            localStorage.setItem('detailData', JSON.stringify(data));
            window.location.href = 'details.html';
            _context2.next = 16;
            break;

          case 14:
            console.error('Error fetching detail data', response.status);
            document.getElementById('detailsContent').innerHTML = 'Error fetching detail data';

          case 16:
            _context2.next = 22;
            break;

          case 18:
            _context2.prev = 18;
            _context2.t0 = _context2["catch"](1);
            console.error('Error:', _context2.t0);
            document.getElementById('detailsContent').innerHTML = 'Error fetching detail data';

          case 22:
          case "end":
            return _context2.stop();
        }
      }
    }, null, null, [[1, 18]]);
  }

  function displayResults(data) {
    var resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = '';

    if (data.response && data.response.body && data.response.body.items) {
      var items = data.response.body.items.item;

      if (items && items.length > 0) {
        var list = document.createElement('ul');
        items.forEach(function (item) {
          var listItem = document.createElement('li');
          listItem.classList.add('search-result-item');
          var img = document.createElement('img');
          img.src = item.firstimage || 'default_image.png';
          img.alt = item.title;
          var itemInfo = document.createElement('div');
          itemInfo.className = 'item-info';
          var title = document.createElement('h3');
          title.textContent = item.title;
          var addr = document.createElement('p');
          addr.textContent = item.addr1;
          var description = document.createElement('p');
          description.textContent = item.overview || 'No description available';
          itemInfo.appendChild(title);
          itemInfo.appendChild(addr);
          itemInfo.appendChild(description);
          listItem.appendChild(img);
          listItem.appendChild(itemInfo);
          listItem.addEventListener('click', function () {
            return fetchDetails(item.contentid);
          });
          list.appendChild(listItem);
        });
        resultsDiv.appendChild(list);
        displayPagination(data.response.body.totalCount);
      } else {
        resultsDiv.innerHTML = 'No results found';
      }
    } else {
      resultsDiv.innerHTML = '검색 결과가 없습니다.';
    }
  }

  function displayPagination(totalCount) {
    var paginationDiv = document.getElementById('pagination');
    paginationDiv.innerHTML = '';
    var totalPages = Math.ceil(totalCount / 5);
    var startPage = Math.max(1, currentPage - 2);
    var endPage = Math.min(totalPages, startPage + 4);

    if (currentPage > 1) {
      var prevButton = document.createElement('button');
      prevButton.innerHTML = '&laquo;';
      prevButton.className = 'arrow';
      prevButton.addEventListener('click', function () {
        currentPage--;
        searchKeyword(currentKeyword, currentPage);
      });
      paginationDiv.appendChild(prevButton);
    }

    var _loop = function _loop(i) {
      var pageButton = document.createElement('button');
      pageButton.textContent = i;
      pageButton.addEventListener('click', function () {
        currentPage = i;
        searchKeyword(currentKeyword, currentPage);
      });
      paginationDiv.appendChild(pageButton);
    };

    for (var i = startPage; i <= endPage; i++) {
      _loop(i);
    }

    if (currentPage < totalPages) {
      var nextButton = document.createElement('button');
      nextButton.innerHTML = '&raquo;';
      nextButton.className = 'arrow';
      nextButton.addEventListener('click', function () {
        currentPage++;
        searchKeyword(currentKeyword, currentPage);
      });
      paginationDiv.appendChild(nextButton);
    }
  } // 로그인 상태 관리 로직 추가


  var loggedIn = sessionStorage.getItem('loggedIn');
  var username = sessionStorage.getItem('username');

  if (loggedIn) {
    document.getElementById('login-link').style.display = 'none';
    document.getElementById('logout-link').style.display = 'inline';
    document.getElementById('mypage-link').style.display = 'inline';
    document.getElementById('mypage-link').textContent = username + '의 페이지'; // 리뷰와 댓글을 가져오기

    fetchUserReviews(userId); // userId를 사용하여 리뷰 가져오기

    fetchUserComments(userId); // userId를 사용하여 댓글 가져오기
  } else {
    document.getElementById('login-link').style.display = 'inline';
    document.getElementById('logout-link').style.display = 'none';
    document.getElementById('mypage-link').style.display = 'none';
  }

  function logout() {
    sessionStorage.removeItem('loggedIn');
    sessionStorage.removeItem('username');
    window.location.href = 'index.html';
  }

  function fetchUserReviews(userId) {
    fetch('/user-reviews', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId
      }) // userId를 보냄

    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log('User Reviews:', data); // 서버에서 받은 데이터 로그 출력

      if (data.success) {
        displayUserReviews(data.reviews);
      } else {
        console.error('리뷰를 가져오는 중 오류가 발생했습니다.');
      }
    })["catch"](function (error) {
      return console.error('Error:', error);
    });
  }

  function displayUserReviews(reviews) {
    var reviewsContainer = document.getElementById('userReviews');
    reviewsContainer.innerHTML = ''; // 기존 내용을 지움

    reviews.forEach(function (review) {
      var reviewDiv = document.createElement('div');
      reviewDiv.classList.add('review-item');
      reviewDiv.innerHTML = "\n                <p>".concat(review.content, "</p>\n                ").concat(review.image ? "<img src=\"/uploads/".concat(review.image, "\" alt=\"Review Image\">") : '', "\n                <button onclick=\"editReview(").concat(review.id, ")\">\uC218\uC815</button>\n                <button onclick=\"deleteReview(").concat(review.id, ")\">\uC0AD\uC81C</button>\n            ");
      reviewsContainer.appendChild(reviewDiv);
    });
  }

  function editReview(reviewId) {
    var newContent = prompt('새로운 리뷰 내용을 입력하세요:');

    if (newContent) {
      fetch('/edit-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewId: reviewId,
          newContent: newContent
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.success) {
          alert('리뷰가 수정되었습니다.');
          location.reload(); // 수정된 리뷰를 표시하기 위해 페이지 새로고침
        } else {
          alert('리뷰 수정에 실패했습니다.');
        }
      })["catch"](function (error) {
        return console.error('Error:', error);
      });
    }
  }

  function deleteReview(reviewId) {
    if (confirm('정말로 이 리뷰를 삭제하시겠습니까?')) {
      fetch('/delete-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewId: reviewId
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.success) {
          alert('리뷰가 삭제되었습니다.');
          location.reload(); // 삭제된 리뷰를 표시하기 위해 페이지 새로고침
        } else {
          alert('리뷰 삭제에 실패했습니다.');
        }
      })["catch"](function (error) {
        return console.error('Error:', error);
      });
    }
  }

  function likeReview(reviewId) {
    var userId = sessionStorage.getItem('userId'); // userId 가져오기

    if (userId) {
      fetch('/like-review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          reviewId: reviewId,
          userId: userId
        })
      }).then(function (response) {
        return response.json();
      }).then(function (data) {
        if (data.success) {
          var likeCountSpan = document.getElementById("likeCount-".concat(reviewId));
          likeCountSpan.textContent = data.likes; // 새로운 좋아요 개수 업데이트
        } else {
          alert('좋아요를 누르는데 실패했습니다.');
        }
      })["catch"](function (error) {
        return console.error('Error:', error);
      });
    } else {
      alert('로그인이 필요합니다.');
    }
  }

  function fetchUserComments(userId) {
    fetch('/user-comments', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        userId: userId
      })
    }).then(function (response) {
      return response.json();
    }).then(function (data) {
      console.log('User Comments:', data); // 서버에서 받은 데이터 로그 출력

      var userComments = document.getElementById('userComments');
      userComments.innerHTML = ''; // 기존 댓글 내용 초기화

      data.comments.forEach(function (comment) {
        var commentDiv = document.createElement('div');
        commentDiv.className = 'comment';
        commentDiv.innerHTML = "<p>".concat(comment.content, "</p>");
        userComments.appendChild(commentDiv);
      });
    })["catch"](function (error) {
      return console.error('Error:', error);
    });
  }
}); // 여행 명언

var quotes = ["여행은 당신을 겸손하게 만든다. 세상에서 당신이 차지하는 위치가 얼마나 작은 것인지를 깨닫게 해준다. - 귀스타브 플로베르", "여행을 떠나는 이유는 돌아오기 위해서이다. - 체 게바라", "여행은 짧고, 인생은 더 짧다. - 공자", "여행을 떠나는 순간, 새로운 인생이 시작된다. - 마크 트웨인", "세상은 한 권의 책이며, 여행하지 않는 자는 그 책의 한 페이지만 읽는 것이다. - 성 아우구스티누스"];

function showNewQuote() {
  var quoteElement = document.getElementById("quote");
  var randomIndex = Math.floor(Math.random() * quotes.length);
  quoteElement.innerText = quotes[randomIndex];
}
//# sourceMappingURL=main.dev.js.map
