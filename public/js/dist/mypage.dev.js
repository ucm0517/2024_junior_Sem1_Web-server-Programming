"use strict";

document.addEventListener('DOMContentLoaded', function () {
  var userId = sessionStorage.getItem('userId'); // userId를 세션에서 가져옴

  if (userId) {
    fetchUserReviews(userId);
    fetchUserComments(userId);
  } else {
    console.error('사용자 ID가 없습니다.');
  }
});

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
    reviewDiv.innerHTML = "\n            <p>".concat(review.content, "</p>\n            ").concat(review.image ? "<img src=\"/uploads/".concat(review.image, "\" alt=\"Review Image\">") : '', "\n            <button onclick=\"editReview(").concat(review.id, ")\">\uC218\uC815</button>\n            <button onclick=\"deleteReview(").concat(review.id, ")\">\uC0AD\uC81C</button>\n            <button onclick=\"likeReview(").concat(review.id, ")\">\uC88B\uC544\uC694</button> <!-- \uC88B\uC544\uC694 \uBC84\uD2BC \uCD94\uAC00 -->\n            <span id=\"likeCount-").concat(review.id, "\">").concat(review.likes, "</span> <!-- \uC88B\uC544\uC694 \uAC1C\uC218 \uD45C\uC2DC -->\n        ");
    reviewsContainer.appendChild(reviewDiv);
  });
}

function editReview(reviewId) {
  var newContent = prompt("새로운 리뷰 내용을 입력하세요:");

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
        alert("리뷰가 성공적으로 수정되었습니다.");
        fetchUserReviews(sessionStorage.getItem('userId')); // 리뷰 목록 새로고침
      } else {
        alert("리뷰 수정에 실패했습니다: " + data.message);
      }
    })["catch"](function (error) {
      return console.error('Error:', error);
    });
  }
}

function deleteReview(reviewId) {
  if (confirm("정말 이 리뷰를 삭제하시겠습니까?")) {
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
        alert("리뷰가 성공적으로 삭제되었습니다.");
        fetchUserReviews(sessionStorage.getItem('userId')); // 리뷰 목록 새로고침
      } else {
        alert("리뷰 삭제에 실패했습니다: " + data.message);
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

function deleteAccount() {
  if (confirm('정말로 회원 탈퇴하시겠습니까?')) {
    fetch('/delete-account', {
      method: 'DELETE',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(function (response) {
      if (response.ok) {
        alert('회원 탈퇴가 완료되었습니다.');
        sessionStorage.removeItem('loggedIn');
        sessionStorage.removeItem('username');
        sessionStorage.removeItem('userId'); // userId 제거

        window.location.href = 'index.html';
      } else {
        alert('회원 탈퇴 중 오류가 발생했습니다.');
      }
    })["catch"](function (error) {
      return console.error('Error:', error);
    });
  }
}

function logout() {
  sessionStorage.removeItem('loggedIn');
  sessionStorage.removeItem('username');
  sessionStorage.removeItem('userId'); // userId 제거

  window.location.href = 'index.html';
} // 쿠키 가져오기 함수 추가


function getCookie(name) {
  var matches = document.cookie.match(new RegExp("(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}
//# sourceMappingURL=mypage.dev.js.map
