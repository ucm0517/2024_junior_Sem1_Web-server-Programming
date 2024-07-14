"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var express = require('express');

var bodyParser = require('body-parser');

var axios = require('axios');

var path = require('path');

var _require = require('html-entities'),
    decode = _require.decode;

var multer = require('multer');

var mysql = require('mysql2');

var session = require('express-session');

var cors = require('cors');

var bcrypt = require('bcrypt');

var app = express();
var port = 3000;
var saltRounds = 10; // 공공 데이터 API 서비스 키

var serviceKey = 'J5hAO%2B3ZBCbL%2F51zkmt9Bbjlr7PK2HQxBHfTOSyxxGzD%2F%2BQsohXJBM5rxp3mVb%2FAK7V0%2F71ej13eDH27LFFE5Q%3D%3D'; // 날씨 API 키

var weatherApiKey = '6b1ef54b6f3279928ef1900844f03f1e'; // 지역 코드 매핑

var areaCodes = {
  '서울': '1',
  '인천': '2',
  '대전': '3',
  '경기도': '31',
  '강원특별자치도': '32',
  '충청북도': '33',
  '충청남도': '34',
  '경상북도': '35',
  '경상남도': '36',
  '전북특별자치도': '37',
  '전라남도': '38',
  '제주도': '39',
  '대구': '4',
  '광주': '5',
  '부산': '6',
  '울산': '7',
  '세종특별자치시': '8'
}; // 미들웨어 설정

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
})); // 업로드 폴더 설정

var storage = multer.diskStorage({
  destination: function destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function filename(req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
var upload = multer({
  storage: storage
});
app.use(cors()); // CORS 설정

app.use(express.json()); // JSON 요청

app.use(express.urlencoded({
  extended: true
})); // URL 인코딩된 요청 파싱
// 정적 파일 경로 설정

app.use('/uploads', express["static"]('uploads'));
app.use(express["static"](path.join(__dirname, 'public')));
app.use('/css', express["static"](path.join(__dirname, 'public', 'css')));
app.use('/js', express["static"](path.join(__dirname, 'public', 'js'))); // 세션 설정

app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
})); // MySQL 데이터베이스 연결

var db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '0517',
  database: 'webserver3'
});
db.connect(function (err) {
  if (err) {
    throw err;
  }

  console.log('MySQL Connected...');
}); // 기본 라우트 설정

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});
app.get('/area-detail/:id', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'area-detail.html'));
});
app.get('/details', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'details.html'));
});
app.get('/details/:id', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'details.html'));
});
app.get('/tourist-spot/:id', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'tourist-spot.html'));
});
app.get('/tourist-spot', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'tourist-spot.html'));
}); // API 엔드포인트: 지역별 여행지 검색

app.post('/search-region', function _callee(req, res) {
  var _req$body, region, pageNo, areaCode, apiKey, apiUrl, response, items, totalCount;

  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _req$body = req.body, region = _req$body.region, pageNo = _req$body.pageNo;
          areaCode = areaCodes[region];
          apiKey = serviceKey;
          apiUrl = "https://apis.data.go.kr/B551011/KorWithService1/areaBasedList1?MobileOS=ETC&MobileApp=Web&serviceKey=".concat(apiKey, "&numOfRows=5&pageNo=").concat(pageNo, "&listYN=Y&arrange=O&_type=json&contentTypeId=12&areaCode=").concat(areaCode);
          console.log("Requesting data from API: ".concat(apiUrl));
          _context.prev = 5;
          _context.next = 8;
          return regeneratorRuntime.awrap(axios.get(apiUrl));

        case 8:
          response = _context.sent;
          console.log("API Response: ".concat(JSON.stringify(response.data)));
          items = response.data.response.body.items.item;
          totalCount = response.data.response.body.totalCount;
          res.json({
            items: items || [],
            totalCount: totalCount || 0
          });
          _context.next = 19;
          break;

        case 15:
          _context.prev = 15;
          _context.t0 = _context["catch"](5);
          console.error('Error fetching data:', _context.t0.message);
          res.status(500).send('Error fetching data.');

        case 19:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[5, 15]]);
}); // 배리어 프리 정보 API

app.post('/barrier-free-info', function _callee2(req, res) {
  var contentId, apiKey, apiUrl, response;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          contentId = req.body.contentId;
          apiKey = 'K02B7xjfQanY0D0uqbmZ4%2F4wpTBKpZfbm9%2FJ1phXZxRFiDw6dPUGZ4NyeP9MZTiKro6k5aSEjG1InPCB6UNW%2BA%3D%3D';
          apiUrl = "https://apis.data.go.kr/B551011/KorWithService1/detailCommon1?MobileOS=ETC&MobileApp=AppTest&contentId=".concat(contentId, "&defaultYN=Y&overviewYN=Y&addrinfoYN=Y&mapinfoYN=Y&_type=json&serviceKey=").concat(apiKey);
          console.log("Requesting barrier-free info data from API: ".concat(apiUrl)); // 로그 추가

          _context2.prev = 4;
          _context2.next = 7;
          return regeneratorRuntime.awrap(axios.get(apiUrl));

        case 7:
          response = _context2.sent;
          console.log('Barrier-free info API response:', response.data); // 로그 추가

          res.json(response.data);
          _context2.next = 16;
          break;

        case 12:
          _context2.prev = 12;
          _context2.t0 = _context2["catch"](4);
          console.error('Error fetching barrier-free info data:', _context2.t0.message); // 로그 추가

          res.status(500).send('Error fetching barrier-free info data');

        case 16:
        case "end":
          return _context2.stop();
      }
    }
  }, null, null, [[4, 12]]);
}); // 새 API 엔드포인트

app.post('/new-api-endpoint', function _callee3(req, res) {
  var contentId, apiKey, apiUrl, response;
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          contentId = req.body.contentId;
          apiKey = 'K02B7xjfQanY0D0uqbmZ4%2F4wpTBKpZfbm9%252FJ1phXZxRFiDw6dPUGZ4NyeP9MZTiKro6k5aSEjG1InPCB6UNW%252BA%253D%253D';
          apiUrl = "https://apis.data.go.kr/B551011/KorWithService1/detailCommon1?MobileOS=WIN&MobileApp=Test&contentId=".concat(contentId, "&_type=json&serviceKey=").concat(encodeURIComponent(apiKey));
          _context3.prev = 3;
          _context3.next = 6;
          return regeneratorRuntime.awrap(axios.get(apiUrl));

        case 6:
          response = _context3.sent;
          res.json(response.data);
          _context3.next = 14;
          break;

        case 10:
          _context3.prev = 10;
          _context3.t0 = _context3["catch"](3);
          console.error('Error fetching new API data:', _context3.t0);
          res.status(500).send('Error fetching new API data.');

        case 14:
        case "end":
          return _context3.stop();
      }
    }
  }, null, null, [[3, 10]]);
}); // 키워드 검색 API

app.post('/search-keyword', function _callee4(req, res) {
  var keyword, pageNo, encodedKeyword, numOfRows, url, response;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          keyword = req.body.keyword;
          pageNo = req.body.pageNo || 1;
          encodedKeyword = encodeURIComponent(keyword);
          numOfRows = 5;
          url = "https://apis.data.go.kr/B551011/KorWithService1/searchKeyword1?MobileOS=ETC&MobileApp=web&keyword=".concat(encodedKeyword, "&_type=json&numOfRows=").concat(numOfRows, "&pageNo=").concat(pageNo, "&serviceKey=").concat(serviceKey);
          console.log("Requesting data from API: ".concat(url)); // 추가된 로그

          _context4.prev = 6;
          _context4.next = 9;
          return regeneratorRuntime.awrap(axios.get(url));

        case 9:
          response = _context4.sent;
          console.log("API Response: ".concat(JSON.stringify(response.data))); // 추가된 로그

          if (response.data) {
            res.json(response.data);
          } else {
            res.status(404).send('No data found');
          }

          _context4.next = 18;
          break;

        case 14:
          _context4.prev = 14;
          _context4.t0 = _context4["catch"](6);
          console.error('Error fetching data:', _context4.t0.message); // 추가된 로그

          res.status(500).send('Error fetching data');

        case 18:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[6, 14]]);
}); // 공통 정보 가져오기 API

app.post('/get-common-info', function _callee5(req, res) {
  var contentId, url, response;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          contentId = req.body.contentId;
          url = "https://apis.data.go.kr/B551011/KorWithService1/detailCommon1?MobileOS=ETC&MobileApp=web&contentId=".concat(contentId, "&defaultYN=Y&overviewYN=Y&addrinfoYN=Y&mapinfoYN=Y&_type=json&serviceKey=").concat(encodeURIComponent(serviceKey));
          _context5.prev = 2;
          _context5.next = 5;
          return regeneratorRuntime.awrap(axios.get(url));

        case 5:
          response = _context5.sent;

          if (response.data) {
            res.json(response.data);
          } else {
            res.status(404).send('No data found');
          }

          _context5.next = 12;
          break;

        case 9:
          _context5.prev = 9;
          _context5.t0 = _context5["catch"](2);
          res.status(500).send('Error fetching data');

        case 12:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[2, 9]]);
}); // 장애인 정보 및 이미지 가져오기 API

app.post('/get-disability-info-and-images', function _callee6(req, res) {
  var contentId, disabilityInfoUrl, imagesUrl, introInfoUrl, commonInfoUrl, _ref, _ref2, disabilityInfoResponse, imagesResponse, introInfoResponse, commonInfoResponse;

  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          contentId = req.body.contentId;
          disabilityInfoUrl = "https://apis.data.go.kr/B551011/KorWithService1/detailWithTour1?MobileOS=ETC&MobileApp=web&contentId=".concat(contentId, "&_type=json&serviceKey=").concat(serviceKey);
          imagesUrl = "https://apis.data.go.kr/B551011/KorWithService1/detailImage1?MobileOS=ETC&MobileApp=web&contentId=".concat(contentId, "&imageYN=Y&subImageYN=Y&_type=json&serviceKey=").concat(serviceKey);
          introInfoUrl = "https://apis.data.go.kr/B551011/KorWithService1/detailIntro1?MobileOS=ETC&MobileApp=web&contentId=".concat(contentId, "&contentTypeId=12&_type=json&serviceKey=").concat(serviceKey);
          commonInfoUrl = "https://apis.data.go.kr/B551011/KorWithService1/detailCommon1?MobileOS=ETC&MobileApp=web&contentId=".concat(contentId, "&defaultYN=Y&overviewYN=Y&addrinfoYN=Y&mapinfoYN=Y&_type=json&serviceKey=").concat(serviceKey);
          _context6.prev = 5;
          _context6.next = 8;
          return regeneratorRuntime.awrap(Promise.all([axios.get(disabilityInfoUrl), axios.get(imagesUrl), axios.get(introInfoUrl), axios.get(commonInfoUrl)]));

        case 8:
          _ref = _context6.sent;
          _ref2 = _slicedToArray(_ref, 4);
          disabilityInfoResponse = _ref2[0];
          imagesResponse = _ref2[1];
          introInfoResponse = _ref2[2];
          commonInfoResponse = _ref2[3];
          console.log('Disability info API response:', disabilityInfoResponse.data); // 로그 추가

          console.log('Images API response:', imagesResponse.data); // 로그 추가

          console.log('Intro info API response:', introInfoResponse.data); // 로그 추가

          console.log('Common info API response:', commonInfoResponse.data); // 로그 추가

          res.json({
            disabilityInfo: disabilityInfoResponse.data,
            images: imagesResponse.data,
            introInfo: introInfoResponse.data,
            commonInfo: commonInfoResponse.data
          });
          _context6.next = 25;
          break;

        case 21:
          _context6.prev = 21;
          _context6.t0 = _context6["catch"](5);
          console.error('Error fetching data from APIs:', _context6.t0.message); // 로그 추가

          res.status(500).send('Error fetching data from APIs');

        case 25:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[5, 21]]);
}); // 날씨 정보 가져오기 API

app.post('/get-weather', function _callee7(req, res) {
  var _req$body2, lat, lon, url, response;

  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body2 = req.body, lat = _req$body2.lat, lon = _req$body2.lon;
          url = "https://api.openweathermap.org/data/2.5/weather?lat=".concat(lat, "&lon=").concat(lon, "&appid=").concat(weatherApiKey, "&units=metric&lang=kr");
          _context7.prev = 2;
          _context7.next = 5;
          return regeneratorRuntime.awrap(axios.get(url));

        case 5:
          response = _context7.sent;

          if (response.data) {
            res.json(response.data);
          } else {
            res.status(404).send('No data found');
          }

          _context7.next = 12;
          break;

        case 9:
          _context7.prev = 9;
          _context7.t0 = _context7["catch"](2);
          res.status(500).send('Error fetching data');

        case 12:
        case "end":
          return _context7.stop();
      }
    }
  }, null, null, [[2, 9]]);
}); // 모든 관광지 정보 가져오기

function fetchAllTouristSpots(req, res) {
  return regeneratorRuntime.async(function fetchAllTouristSpots$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.prev = 0;
          _context9.next = 3;
          return regeneratorRuntime.awrap(function _callee8() {
            var apiKey, allTouristSpots, region, areaCode, apiUrl, response, items;
            return regeneratorRuntime.async(function _callee8$(_context8) {
              while (1) {
                switch (_context8.prev = _context8.next) {
                  case 0:
                    apiKey = serviceKey;
                    allTouristSpots = [];
                    _context8.t0 = regeneratorRuntime.keys(areaCodes);

                  case 3:
                    if ((_context8.t1 = _context8.t0()).done) {
                      _context8.next = 14;
                      break;
                    }

                    region = _context8.t1.value;
                    areaCode = areaCodes[region];
                    apiUrl = "https://apis.data.go.kr/B551011/KorWithService1/areaBasedList1?MobileOS=ETC&MobileApp=Web&serviceKey=".concat(apiKey, "&numOfRows=1000&pageNo=1&listYN=Y&arrange=O&_type=json&contentTypeId=12&areaCode=").concat(areaCode);
                    _context8.next = 9;
                    return regeneratorRuntime.awrap(axios.get(apiUrl));

                  case 9:
                    response = _context8.sent;
                    items = response.data.response.body.items.item;

                    if (items && items.length > 0) {
                      items.forEach(function (item) {
                        var contentid = item.contentid,
                            contenttypeid = item.contenttypeid,
                            title = item.title,
                            createdtime = item.createdtime,
                            modifiedtime = item.modifiedtime,
                            tel = item.tel,
                            homepage = item.homepage,
                            booktour = item.booktour,
                            firstimage = item.firstimage,
                            firstimage2 = item.firstimage2,
                            cpyrhtDivCd = item.cpyrhtDivCd,
                            areacode = item.areacode,
                            sigungucode = item.sigungucode,
                            cat1 = item.cat1,
                            cat2 = item.cat2,
                            cat3 = item.cat3,
                            addr1 = item.addr1,
                            addr2 = item.addr2,
                            zipcode = item.zipcode,
                            mapx = item.mapx,
                            mapy = item.mapy,
                            mlevel = item.mlevel,
                            overview = item.overview;
                        var decodedHomepage = homepage ? decode(homepage) : '';
                        var decodedOverview = overview ? decode(overview) : '';
                        allTouristSpots.push({
                          contentid: contentid,
                          contenttypeid: contenttypeid,
                          title: title,
                          createdtime: createdtime,
                          modifiedtime: modifiedtime,
                          tel: tel,
                          homepage: decodedHomepage,
                          booktour: booktour,
                          firstimage: firstimage,
                          firstimage2: firstimage2,
                          cpyrhtDivCd: cpyrhtDivCd,
                          areacode: areacode,
                          sigungucode: sigungucode,
                          cat1: cat1,
                          cat2: cat2,
                          cat3: cat3,
                          addr1: addr1,
                          addr2: addr2,
                          zipcode: zipcode,
                          mapx: mapx,
                          mapy: mapy,
                          mlevel: mlevel,
                          overview: decodedOverview
                        });
                      });
                    } else {
                      console.log("No tourist spots available for the area code ".concat(areaCode, "."));
                    }

                    _context8.next = 3;
                    break;

                  case 14:
                    console.log('All tourist spots fetched.');
                    res.json(allTouristSpots);

                  case 16:
                  case "end":
                    return _context8.stop();
                }
              }
            });
          }());

        case 3:
          _context9.next = 9;
          break;

        case 5:
          _context9.prev = 5;
          _context9.t0 = _context9["catch"](0);
          console.error('Error fetching API data:', _context9.t0.message);
          res.status(500).send('Error fetching API data.');

        case 9:
        case "end":
          return _context9.stop();
      }
    }
  }, null, null, [[0, 5]]);
}

app.get('/fetch-all-tourist-spots', fetchAllTouristSpots);
app.get('/tourist-spot/:id', function (req, res) {
  res.sendFile(path.join(__dirname, 'public', 'tourist-spot.html'));
}); // 회원가입 핸들러

app.post('/register', function (req, res) {
  var _req$body3 = req.body,
      name = _req$body3.name,
      email = _req$body3.email,
      password = _req$body3.password;
  bcrypt.hash(password, saltRounds, function (err, hash) {
    if (err) {
      return res.status(500).json({
        error: '서버 오류'
      });
    } // 해시된 비밀번호를 데이터베이스에 저장


    var query = "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
    db.query(query, [name, email, hash], function (err) {
      if (err) {
        return res.status(500).json({
          error: '회원가입 실패'
        });
      }

      res.status(200).json({
        message: '회원가입 성공'
      });
    });
  });
}); // 로그인 핸들러

app.post('/login', function (req, res) {
  var _req$body4 = req.body,
      email = _req$body4.email,
      password = _req$body4.password;
  var query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], function (err, results) {
    if (err) {
      console.error(err);
      return res.status(500).send('로그인 중 오류가 발생했습니다.');
    }

    if (results.length > 0) {
      bcrypt.compare(password, results[0].password, function (err, isMatch) {
        if (err) {
          console.error(err);
          return res.status(500).send('로그인 중 오류가 발생했습니다.');
        }

        if (isMatch) {
          req.session.loggedin = true;
          req.session.userId = results[0].id; // userId를 세션에 저장

          req.session.email = email;
          return res.status(200).json({
            username: results[0].name
          });
        } else {
          return res.status(400).send('아이디 또는 비밀번호가 잘못되었습니다.');
        }
      });
    } else {
      return res.status(400).send('아이디 또는 비밀번호가 잘못되었습니다.');
    }
  });
}); // 회원탈퇴 핸들러

app["delete"]('/delete-account', function (req, res) {
  if (!req.session.userId) {
    return res.status(401).send('Unauthorized');
  }

  var deleteUserQuery = 'DELETE FROM users WHERE id = ?';
  db.query(deleteUserQuery, [req.session.userId], function (err, result) {
    if (err) {
      return res.status(500).send('Database error');
    }

    req.session.destroy(); // 남아있는 회원이 있는지 확인

    var checkUsersQuery = 'SELECT COUNT(*) AS count FROM users';
    db.query(checkUsersQuery, function (err, results) {
      if (err) {
        return res.status(500).send('Failed to check remaining users');
      }

      if (results[0].count === 0) {
        // 남아있는 회원이 없으면 AUTO_INCREMENT 값 재설정
        var resetAutoIncrementQuery = 'ALTER TABLE users AUTO_INCREMENT = 1';
        db.query(resetAutoIncrementQuery, function (err, result) {
          if (err) {
            return res.status(500).send('Failed to reset AUTO_INCREMENT');
          }

          res.send('Account deleted and AUTO_INCREMENT reset successfully');
        });
      } else {
        res.send('Account deleted successfully');
      }
    });
  });
}); // 리뷰 제출

app.post('/submit-review', upload.single('reviewImage'), function (req, res) {
  var userId = req.session.userId; // 세션에서 userId 가져오기

  var spotId = req.body.spotId;
  var reviewText = req.body.reviewText;
  var reviewImage = req.file ? req.file.filename : null;

  if (!userId) {
    return res.status(401).json({
      success: false,
      message: '로그인이 필요합니다.'
    });
  }

  var query = 'INSERT INTO reviews (user_id, spot_id, content, image) VALUES (?, ?, ?, ?)';
  db.query(query, [userId, spotId, reviewText, reviewImage], function (error, results) {
    if (error) {
      console.error(error);
      res.json({
        success: false,
        message: '리뷰 제출 중 오류가 발생했습니다.'
      });
    } else {
      res.json({
        success: true
      });
    }
  });
}); // 리뷰 가져오기

app.get('/reviews', function (req, res) {
  var contentId = req.query.contentId;
  var query = "\n      SELECT reviews.*, users.name AS user\n      FROM reviews\n      JOIN users ON reviews.user_id = users.id\n      WHERE reviews.spot_id = ?\n  ";
  db.query(query, [contentId], function (error, results) {
    if (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({
        success: false,
        message: '리뷰를 가져오는데 실패했습니다.'
      });
    } else {
      res.json({
        success: true,
        reviews: results
      });
    }
  });
}); // 내 리뷰 가져오기

app.post('/user-reviews', function (req, res) {
  var userId = req.body.userId; // req.body에서 userId 가져오기

  var query = 'SELECT * FROM reviews WHERE user_id = ?';
  db.query(query, [userId], function (error, results) {
    if (error) {
      console.error('Error fetching reviews:', error);
      res.json({
        success: false,
        message: 'Error fetching reviews'
      });
    } else {
      res.json({
        success: true,
        reviews: results
      });
    }
  });
});
app.listen(port, function () {
  console.log("Server running at http://localhost:".concat(port, "/"));
});
//# sourceMappingURL=server.dev.js.map
