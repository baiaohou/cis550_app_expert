var config = require('./db-config.js');
var mysql = require('mysql');
var gplay = require('google-play-scraper');

config.connectionLimit = 10;
var connection = mysql.createPool(config);

/* -------------------------------------------------- */
/* ------------------- Route Handlers --------------- */
/* -------------------------------------------------- */


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


function getAppDetailByName(req, res) {
  var query = `SELECT * FROM tmp_table WHERE app_name = '${req.params.app_name}';`;
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

function loadMoreCommentsByAppName(req, res) {
  var query =
    `SELECT review, sentiment FROM APP_REVIEWS WHERE app_name = "${req.query.app_name}" 
    LIMIT ${(req.query.curr_page - 1) * req.query.page_size},${req.query.page_size};`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  });
}


// app.get('/wishlist', routes.getWishlist);
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
  var query = `SELECT * FROM app_detail WHERE App= '${req.params.app_name}';`;
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

// function getWishlist(req, res) {
//   var query = `SELECT * FROM app_detail LIMIT 10;`;
//   connection.query(query, function(err, rows, fields) {
//     if (err) {
//       console.log(err);
//     } else {
//       console.log("query result: " + rows);
//       res.json(rows);
//     }
//   });
// }


// The exported functions, which can be accessed in index.js.
module.exports = {
  getAllGenres: getAllGenres,
  getTopInGenre: getTopInGenre,
  getRecs: getRecs,
  getDecades: getDecades,
  bestGenresPerDecade: bestGenresPerDecade,
  getAppDetailByName: getAppDetailByName,
  getAppScreenshotsById: getAppScreenshotsById,
  loadMoreCommentsByAppName: loadMoreCommentsByAppName,
  get10Apps: get10Apps,
  addToWishList: addToWishList
}