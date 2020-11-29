var config = require('./db-config.js');
var mysql = require('mysql');
var gplay = require('google-play-scraper');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


/* ---- Login validate ---- */

function loginCheck(req, res) {
  console.log('call routes loginCheck');
  var url = require('url');
  console.log(encodeURI(req.url));
  var parseObj = url.parse(req.url, true);
  console.log(parseObj);

  req.query = parseObj.query;

  var query = `
    SELECT *
    FROM user
    WHERE email = '${req.query.email}' AND password = '${req.query.password}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      var num = rows.length;
      if (num === 0) {
        console.log("No such user, goto login failed page");
        res.redirect(301, 'http://localhost:3000/loginfailed');
      } else {
        console.log("We have this user!");
        res.writeHead(302, {
          'Set-Cookie': [
            "isVisit=1",
            "email=" + rows[0].email,
            "first_name=" + rows[0].first_name
          ],
          'Content-Type': 'text/plain',
          'Location': 'http://localhost:3000/home'
          
        });
        res.end();
        console.log(rows);
      }
    }
  });
};

/* ---- change password ---- */
function changePassword(req, res) {
  console.log('call routes changePassword');
  var url = require('url');
  console.log(encodeURI(req.url));
  var parseObj = url.parse(req.url, true);
  console.log(parseObj);

  req.query = parseObj.query;

  var query = `
    update user 
    set password='${req.query.password}' 
    where email='${req.query.email}'
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) console.log(err);
    else {
      var num = rows.affectedRows;
      if (num === 0) {
        console.log("Change password failed - no such user");
        res.redirect(301, 'http://localhost:3000/resetpasswordfailed');
      } else {
        console.log("Change password OK");
        res.writeHead(302, {
          'Content-Type': 'text/plain',
          'Location': 'http://localhost:3000/loginreenter'
        });
        res.end();
        console.log(rows);
      }
    }
  });
};

/* ---- register validate ---- */
function register(req, res) {
  console.log('call routes register');
  var url = require('url');
  console.log(encodeURI(req.url));
  var parseObj = url.parse(req.url, true);
  console.log(parseObj);

  req.query = parseObj.query;

  var query = `
  insert into user
  values (
    '${req.query.email}', 
    '${req.query.password}', 
    '${req.query.firstName}', 
    '${req.query.lastName}'
  )
  `;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      // console.log(err);
      console.log("Register failed - already exist this user");
      res.redirect(301, 'http://localhost:3000/registerfailed');
    } else {

      console.log("Register OK");
      res.writeHead(302, {
        'Content-Type': 'text/plain',
        'Location': 'http://localhost:3000/loginreenter'
      });
      res.end();
      console.log(rows);
      
    }
  });
};


/* ---- Q1a (Dashboard) ---- */
function getAllGenres(req, res) {
  console.log('call routes getAllGenres');
  var query = `
    SELECT DISTINCT Category AS genre
    FROM app_detail;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
};


/* ---- Q1b (Dashboard) ---- */
function getTopInGenre(req, res) {
  console.log('call routes getTopInGenre');
  var genre = req.params.genre;
  console.log(genre)
  var query = `
    SELECT a.App, a.Rating, a.Installs
    FROM app_detail a
    WHERE a.Category = '${genre}' 
    ORDER BY a.Rating DESC, a.Reviews_Count DESC
    LIMIT 15;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
};

/* ---- Q2 (Recommendations) ---- */
function getRecs(req, res) {
  console.log('call routes getRecs');
  var appName = req.params.appName;
  console.log(appName)
  var query = `
    SELECT a.App, a.Rating, a.Installs
    FROM app_detail a
    WHERE a.App LIKE '%${appName}%' ;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
};

/* ---- (Best Genres) ---- */
function getDecades(req, res) {
  var query = `
    SELECT DISTINCT (FLOOR(year/10)*10) AS decade
    FROM (
      SELECT DISTINCT release_year as year
      FROM Movies
      ORDER BY release_year
    ) 
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
    }
  });
}

/* ---- Q3 (Best Genres) ---- */
function bestGenresPerDecade(req, res) {

};


/* Used for app detail page */

function getAppDetailByName(req, res) {
  var query = `SELECT * FROM app_detail a NATURAL JOIN package_info p WHERE a.app_name = "${req.params.app_name}";`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
}

function getAppScreenshotsById(req, res) {
  gplay.app({ appId: `${req.params.package_name}` })
    .then(queryResult => {
      if (queryResult) {
        res.json(queryResult.screenshots);
      } else {
        console.log("Cannot find the screenshots");
      }
    });
}

function getAppDescriptionById(req, res) {
  gplay.app({ appId: `${req.params.package_name}` })
    .then(queryResult => {
      if (queryResult) {
        res.json(queryResult.descriptionHTML);
      } else {
        console.log("Cannot find the description");
      }
    });
}

function loadMoreCommentsByAppName(req, res) {
  var query =
    `SELECT review_content, sentiment FROM app_review WHERE app_name = "${req.query.app_name}" 
    LIMIT ${(req.query.curr_page - 1) * req.query.page_size},${req.query.page_size};`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
}



function get10Apps(req, res) {
  console.log("Into get10Apps function");
  var query = `SELECT * FROM app_detail LIMIT 10;`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("query result: " + rows);
      res.json(rows);
      console.log(rows);
    }
  });
}

function addToWishList(req, res) {
  console.log("Into addToWishList function");
  console.log("appName: ", req.query.appName);
  console.log("email: ", req.query.email);
  var query = `SELECT * FROM wishlist WHERE email='${req.query.email}' AND app_name='${req.query.appName}';`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      if (rows.length == 0) {
        console.log("Wishlist does not have this, insert it.");
        query = `INSERT INTO wishlist (email, app_name) VALUES ('${req.query.email}', '${req.query.appName}');`;
      } else {
        console.log("Wishlist already has this, delete it.");
        query = `DELETE FROM wishlist WHERE email='${req.query.email}' AND app_name='${req.query.appName}';`;
      }
      connection.query(query, function(err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          res.json(rows);
          console.log("query result: ", rows);
        }
      });
    }
  });
}

function isInWishList(req, res) {
  console.log("Into isInWishList function");
  console.log("appName: ", req.query.appName);
  console.log("email: ", req.query.email);
  var query = `SELECT * FROM wishlist WHERE email='${req.query.email}' AND app_name='${req.query.appName}';`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("query result: " + rows);
      res.json(rows);
    }
  });
}

function getWishlist(req, res) {
  console.log("Into getWishlist function");
  var query = `SELECT * FROM wishlist w JOIN package_info p ON w.app_name=p.app_name WHERE email='${req.params.email}';`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("query result: " + rows);
      res.json(rows);
    }
  });
}


// The exported functions, which can be accessed in index.js.
module.exports = {
  loginCheck: loginCheck,
  changePassword: changePassword,
  register: register,
  getAllGenres: getAllGenres,
  getTopInGenre: getTopInGenre,
  getRecs: getRecs,
  getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
  getAppDetailByName: getAppDetailByName,
  getAppScreenshotsById: getAppScreenshotsById,
  getAppDescriptionById:getAppDescriptionById,
  loadMoreCommentsByAppName: loadMoreCommentsByAppName,
  get10Apps: get10Apps,
  addToWishList: addToWishList,
  getWishlist: getWishlist,
  isInWishList: isInWishList
}