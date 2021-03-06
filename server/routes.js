const Constants = require('./Constants.js');
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
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      var num = rows.length;
      if (num === 0) {
        console.log("No such user, goto login failed page");
        res.redirect(301, `${Constants.frontend_prefix}/loginfailed`);
      } else {
        console.log("We have this user!");
        res.writeHead(302, {
          'Set-Cookie': [
            "isVisit=1",
            "email=" + rows[0].email,
            "first_name=" + rows[0].first_name + " " + rows[0].last_name,
            // "first_name=" + rows[0].first_name,
            "last_name=" + " ",
            // "last_name=" + rows[0].last_name,
            "date=" + ((new Date()).getFullYear()) + "/" + ((new Date()).getMonth() + 1) + "/" + (new Date()).getDate()
          ],
          'Content-Type': 'text/plain',
          'Location': `${Constants.frontend_prefix}/home`

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
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      var num = rows.affectedRows;
      if (num === 0) {
        console.log("Change password failed - no such user");
        res.redirect(301, `${Constants.frontend_prefix}/resetpasswordfailed`);
      } else {
        console.log("Change password OK");
        res.writeHead(302, {
          'Content-Type': 'text/plain',
          'Location': `${Constants.frontend_prefix}/loginreenter`
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
  connection.query(query, function (err, rows, fields) {
    if (err) {
      // console.log(err);
      console.log("Register failed - already exist this user");
      res.redirect(301, `${Constants.frontend_prefix}/registerfailed`);
    } else {

      console.log("Register OK");
      var query2 = `
        insert into follow
        values (
          '${req.query.email}', 
          'baiaohou@gmail.com' 
        )
      `;
      connection.query(query2, function () {});

      res.writeHead(302, {
        'Content-Type': 'text/plain',
        'Location': `${Constants.frontend_prefix}/loginreenter`
      });
      res.end();
      console.log(rows);

    }
  });
};


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
      // console.log(rows);
    }
  });
};

function getCategory(req, res) {
  console.log('call routes getCategory');
  var genre = req.params.genre;
  var query = `
    WITH categories AS (
      SELECT category,  AVG (rating) AS average, count(app_name) AS num
        FROM app_detail
        group by category
    ),
    wish_category AS (
      SELECT category, count(distinct email) AS user_num
        FROM wishlist w JOIN app_detail a ON w.app_name = a.app_name
        GROUP BY category
    ),
    stars AS (
      SELECT category, SUM(if(rating >= 4, 1, 0)) AS four_star, 
        SUM(if(rating >= 3 AND rating < 4, 1, 0)) AS three_star , 
        SUM(if(rating <= 3, 1, 0)) AS two_star
        FROM app_detail 
        GROUP BY category
    ),
    statistics AS (
      SELECT c.category, c.average, c.num, s.four_star, s.three_star, s.two_star,
      w.user_num
      FROM categories c LEFT JOIN wish_category w ON c.category = w.category 
      JOIN stars s ON c.category = s.category
    ), 
    overall_data AS(
      SELECT s.category, s.num, s.user_num, s.four_star, s.three_star, s.two_star,
      ROUND(s.average,2) AS average, RANK() OVER (ORDER BY s.average) avg_rank,
      RANK() OVER (ORDER BY s.four_star) fourstar_rank,
      RANK() OVER (ORDER BY s.user_num DESC) user_rank
      FROM statistics s
    )
    SELECT * FROM overall_data o
    WHERE o.category = '${genre}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
};

function getTopInGenre(req, res) {
  console.log('call routes getTopInGenre');
  var genre = req.params.genre;
  console.log(genre)
  var query = `
    (SELECT app_name, rating, installs, icon, summary, price 
    FROM full_app_info
    WHERE Category = '${genre}' 
    ORDER BY installs DESC, rating DESC
    LIMIT 5)
    UNION ALL
    (SELECT app_name, rating, installs, icon, summary, price 
      FROM full_app_info
      WHERE Category = '${genre}' AND installs > 10000
      ORDER BY rating DESC, installs DESC
      LIMIT 5
    )
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      // console.log(rows);
    }
  });
};

function getRecs(req, res) {
  console.log('call routes getRecs');
  var appName = req.params.appName;
  console.log(appName)
  var query = `
  SELECT p.app_name, a.rating, a.installs, p.icon, p.summary, a.price 
  FROM package_info p JOIN app_detail a ON p.app_name = a.app_name
  WHERE a.app_name LIKE '%${appName}%' 
  ORDER BY a.installs DESC, a.rating DESC;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) console.log(err);
    else {
      res.json(rows);
      console.log(rows);
    }
  });
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

function setUserRating(req, res) {
  var query = "REPLACE INTO user_review(`user`, app_name, rating)" + `VALUES("${req.query.email}", "${req.query.app_name}", ${req.query.rating});`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  })
}

function getPeerRatings(req, res) {
  var query = `
    SELECT app_name, SUM(rating) AS rating_sum, COUNT(rating) AS rating_num
    FROM user_review
    WHERE app_name = "${req.query.app_name}"
    GROUP BY app_name;`;
  connection.query(query, function(err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      res.json(rows);
    }
  })
}

function getAppVideoById(req, res) {
  gplay.app({ appId: `${req.params.package_name}` })
    .then(queryResult => {
      if (queryResult) {
        res.json(queryResult);
      } else {
        console.log("Cannot find the app");
      }
    });
}


function addToWishList(req, res) {
  console.log("Into addToWishList function");
  console.log("appName: ", req.query.appName);
  console.log("email: ", req.query.email);
  var query = `SELECT * FROM wishlist WHERE email='${req.query.email}' AND app_name="${req.query.appName}";`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      if (rows.length == 0) {
        console.log("Wishlist does not have this, insert it.");
        query = `INSERT INTO wishlist (email, app_name) VALUES ('${req.query.email}', "${req.query.appName}");`;
      } else {
        console.log("Wishlist already has this, delete it.");
        query = `DELETE FROM wishlist WHERE email='${req.query.email}' AND app_name="${req.query.appName}";`;
      }
      connection.query(query, function (err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          res.json(rows);
          console.log("addToWishList query result: ", rows);
        }
      });
    }
  });
}

function isInWishList(req, res) {
  console.log("Into isInWishList function");
  console.log("appName: ", req.query.appName);
  console.log("email: ", req.query.email);
  var query = `SELECT * FROM wishlist WHERE email='${req.query.email}' AND app_name="${req.query.appName}";`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("isInWishList query result: ", rows);
      res.json(rows);
    }
  });
}

// get details of apps in wishlist
// notice that here we get two different genres in a row for the apps with dual genres
function getWishList(req, res) {
  console.log("Into getWishList function");
  var query = `
    WITH wishApp AS ( -- get apps in the wishlist
      SELECT app_name
      FROM wishlist
      WHERE email='${req.params.email}'
    ), wishAppAndGenre AS ( -- have two rows for the app with two genres
      SELECT w.app_name, genre
      FROM wishApp w JOIN has_genre g ON w.app_name=g.app_name
      ORDER BY w.app_name
    ), wishAppAndGenreSelfJoin AS ( -- join two wishAppAndGenre together, to show two genres in a row
      SELECT w1.app_name, w1.genre AS genre1, w2.genre AS genre2
      FROM wishAppAndGenre w1 JOIN wishAppAndGenre w2 ON w1.app_name=w2.app_name
      ORDER BY app_name, genre1
    ), dualGenreApp AS ( -- get the apps with two genres and rank two rows of the same app
      SELECT *
      FROM wishAppAndGenreSelfJoin
      WHERE genre1<genre2
    ), singleAndDualGenreApp AS ( -- get apps with genre1 and genre2 in one row
      ( -- get the apps with only one genre
        SELECT app_name, genre1, genre2
        FROM wishAppAndGenreSelfJoin
        WHERE app_name NOT IN (SELECT app_name FROM dualGenreApp)
      )
      UNION
      (
        SELECT app_name, genre1, genre2
        FROM dualGenreApp
      )
    )
    SELECT s.app_name, genre1, if(genre1=genre2,null,genre2) AS genre2, rating, installs, price, icon, summary
    FROM singleAndDualGenreApp s JOIN full_app_info f ON s.app_name = f.app_name
    ORDER BY app_name
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getWishList query result: ", rows);
      res.json(rows);
    }
  });
}

function clearWishList(req, res) {
  console.log("Into clearWishList function");
  console.log("email: ", req.params.email);
  var query = `DELETE FROM wishlist WHERE email='${req.params.email}';`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("clearWishList query result: ", rows);
      res.json(rows);
    }
  });
}



function getRecommended(req, res) {
  console.log("Into getRecommended function");
  var query = `
    WITH popGenre AS ( -- find most popular genre in this zimao's wishlist
      SELECT genre, COUNT(g.app_name) AS num
      FROM has_genre g JOIN wishlist w ON g.app_name=w.app_name
      WHERE w.email='${req.params.email}'
      GROUP BY genre
      ORDER BY num DESC
      LIMIT 1
    ), popGenreApp AS ( -- find apps of above genre, exclude those already in zimao's wishlist
      SELECT app_name
      FROM popGenre p JOIN has_genre g ON p.genre=g.genre
      WHERE app_name NOT IN (
        SELECT app_name
        FROM wishlist
        WHERE email='${req.params.email}'
      )
    ), popGenreAppAndGenre AS ( -- get the apps above with genres, some app has double rows
      SELECT p.app_name, genre
      FROM popGenreApp p JOIN has_genre g ON p.app_name=g.app_name
    ), popGenreAppSelfJoin AS (
      SELECT p1.app_name, p1.genre AS genre1, p2.genre AS genre2
      FROM popGenreAppAndGenre p1 JOIN popGenreAppAndGenre p2 ON p1.app_name=p2.app_name
      ORDER BY app_name, genre1
    ), dualGenreApp AS ( -- get the apps with two genres and rank two rows of the same app
      SELECT *
      FROM popGenreAppSelfJoin
      WHERE genre1<genre2
    ), singleAndDualGenreApp AS ( -- get apps with genre1 and genre2 in one row
      ( -- get the apps with only one genre
        SELECT app_name, genre1, genre2
        FROM popGenreAppSelfJoin
        WHERE app_name NOT IN (SELECT app_name FROM dualGenreApp)
      )
      UNION
      (
        SELECT app_name, genre1, genre2
        FROM dualGenreApp
      )
    )
    SELECT s.app_name, genre1, if(genre1=genre2,null,genre2) AS genre2, rating, installs, price, icon, summary
    FROM singleAndDualGenreApp s JOIN full_app_info f ON s.app_name = f.app_name
    ORDER BY installs DESC, rating DESC, app_name
    LIMIT 10
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getRecommended query result: ", rows);
      res.json(rows);
    }
  });
}

function getRecommendedByFollowees(req, res) {
  console.log("Into getRecommendedByFollowees");
  var query = `
    WITH Followings AS ( -- find all the users that zimao follows
      SELECT following AS user
      FROM Follow
      WHERE self='${req.params.email}'
    ), genreNumForEachFollowing AS ( -- count apps in each genre for each followed-user's wishlist
      SELECT f.user, g.genre, COUNT(g.app_name) AS num
      FROM Followings f JOIN wishlist w ON f.user=w.email JOIN has_genre g ON w.app_name=g.app_name
      GROUP BY f.user, g.genre
      ORDER BY f.user, num DESC
    ) , genreRankForEachFollowing AS ( -- give a ranking of genres for each followed-user
      SELECT user, genre, num,
      RANK() OVER (
        PARTITION BY user
        ORDER BY num DESC
      )new_rank
      FROM genreNumForEachFollowing
      ORDER BY user
    ), top2GenresForEachFollowing AS ( -- find top 2 genres for each user, and get the distinct genres
      SELECT DISTINCT genre
      FROM genreRankForEachFollowing
      WHERE new_rank <=2
    ), popGenreApp AS ( -- find all apps in the above genres, exclude those already in zimao's wishlist
      SELECT DISTINCT app_name
      FROM top2GenresForEachFollowing p JOIN has_genre g ON p.genre=g.genre
      WHERE app_name NOT IN (
        SELECT app_name
        FROM wishlist
        WHERE email='${req.params.email}'
      )
    ), popGenreAppAndGenre AS ( -- get the apps above with genres, some app has double rows
      SELECT p.app_name, genre
      FROM popGenreApp p JOIN has_genre g ON p.app_name=g.app_name
    ), popGenreAppSelfJoin AS ( -- join app_name and genre to themselves, to make 2 genres in a row
      SELECT p1.app_name, p1.genre AS genre1, p2.genre AS genre2
      FROM popGenreAppAndGenre p1 JOIN popGenreAppAndGenre p2 ON p1.app_name=p2.app_name
      ORDER BY app_name, genre1
    ), dualGenreApp AS ( -- get the apps with double genres and rank two rows of the same app
      SELECT *
      FROM popGenreAppSelfJoin
      WHERE genre1<genre2
    ), singleAndDualGenreApp AS ( -- get apps with genre1 and genre2 in one row
      ( -- get the apps with only one genre
        SELECT app_name, genre1, genre2
        FROM popGenreAppSelfJoin
        WHERE app_name NOT IN (SELECT app_name FROM dualGenreApp)
      )
      UNION
      ( -- get the apps with double genres, only take A,B instead of B,A
        SELECT app_name, genre1, genre2
        FROM dualGenreApp
      )
    )
    SELECT s.app_name, genre1, if(genre1=genre2,null,genre2) AS genre2, rating, installs, price, icon, summary
    FROM singleAndDualGenreApp s JOIN app_detail d ON s.app_name=d.app_name JOIN package_info p ON s.app_name=p.app_name
    ORDER BY installs DESC, rating DESC, app_name
    LIMIT 20
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getRecommendedByFollowees query result: ", rows);
      res.json(rows);
    }
  });
}


function getFollowing(req, res) {
  console.log("Into getFollowing function");
  console.log(req.params.email);
  var query = `
  select following
  from follow
  where self='${req.params.email}';
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getFollowing query result: ", rows);
      res.json(rows);
    }
  });
}



function getFollowingCategoryData(req, res) {
  console.log("Into getFollowingCategoryData");
  console.log(req.params.email);
  var query = `
    WITH followings AS (
      SELECT following
      FROM follow
      WHERE self='${req.params.email}'
    ), user_app_rating AS (
      SELECT *
      FROM followings f
      LEFT JOIN user_review u
      ON f.following=u.user
    ), user_app_rating_category AS (
      SELECT uar.following, uar.app_name, uar.rating, ad.category
      FROM user_app_rating uar
      LEFT JOIN app_detail ad
      ON uar.app_name=ad.app_name
    ) SELECT
        category,
        count(category) AS num,
        count(category) / (
                            SELECT count(category)
                            FROM user_app_rating_category
                          ) AS percentage,
        max(rating) AS max_rating,
        min(rating) AS min_rating,
        cast(avg(rating) as decimal(10, 2)) AS avg_rating
    FROM user_app_rating_category
    GROUP BY category
    ORDER BY percentage DESC, category, avg_rating;
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getFollowingCategoryData query result: ", rows);
      res.json(rows);
    }
  });
}

function getTop3Apps(req, res) {
  console.log("Into getTop3Apps");
  console.log(req.params.email);
  var query = `
    WITH followings AS (
      SELECT following
      FROM follow
      WHERE self='${req.params.email}'
    ), user_app_rating AS (
      SELECT *
      FROM followings f
      LEFT JOIN wishlist u
      ON f.following=u.email
    ), user_app_rating_details AS (
      SELECT u1.email, u1.app_name, u2.rating, u2.installs, u2.price
      FROM user_app_rating u1
      LEFT JOIN app_detail u2
      ON u1.app_name=u2.app_name
    )
    SELECT app_name,
        count(app_name) AS picks,
        rating AS general_rating,
        installs,
        price
    FROM user_app_rating_details
    GROUP BY app_name
    ORDER BY picks DESC, general_rating DESC;
  `;
  // Note: the following query is no longer needed

  // var query = `
  // WITH followings AS (
  //   SELECT following
  //   FROM follow
  //   WHERE self='${req.params.email}'
  // ), user_app_rating AS (
  //   SELECT *
  //   FROM followings f
  //   LEFT JOIN user_review u
  //   ON f.following=u.user
  // ), user_app_rating_details AS (
  //   SELECT u1.user, u1.app_name, u2.rating, u2.installs, u2.price
  //   FROM user_app_rating u1
  //   LEFT JOIN app_detail u2
  //   ON u1.app_name=u2.app_name
  // )
  // SELECT app_name,
  //         count(app_name) AS picks,
  //         rating AS general_rating,
  //         installs,
  //         price
  // FROM user_app_rating_details
  // GROUP BY app_name
  // ORDER BY picks DESC, general_rating DESC;
  // `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getTop3Apps query result: ", rows);
      res.json(rows);
    }
  });
}

function getFollowingWishList(req, res) {
  console.log("Into getFollowingWishList");
  console.log(req.params.email);
  var query = `
    WITH followings AS (
      SELECT following
      FROM follow
      WHERE self='${req.params.email}'
    )
    SELECT w.email, w.app_name, u.first_name, u.last_name, p.icon
    FROM wishlist w
    JOIN followings f ON w.email=f.following
    JOIN package_info p ON p.app_name=w.app_name
    JOIN user u ON u. email=w.email
    ORDER BY email
  `;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      console.log("getFollowingWishList query result: ", rows);
      res.json(rows);
    }
  });
}

function addFollow(req, res) {
  console.log("Into addFollow");
  console.log("self", req.params.self);
  console.log("following", req.params.following);
  var query = `SELECT * FROM follow WHERE self='${req.query.self}' AND following="${req.query.following}";`;
  connection.query(query, function (err, rows, fields) {
    if (err) {
      console.log(err);
    } else {
      if (rows.length == 0) {
        console.log("follow does not have this pari, insert it.");
        query = `INSERT INTO follow (self, following) VALUES ('${req.query.self}', "${req.query.following}");`;
      } else {
        console.log("follow already has this, delete it.");
        query = `DELETE FROM follow WHERE self='${req.query.self}' AND following="${req.query.following}";`;
      }
      connection.query(query, function (err, rows, fields) {
        if (err) {
          console.log(err);
        } else {
          res.json(rows);
          console.log("addFollow query result: ", rows);
        }
      });
    }
  });
}

// The exported functions, which can be accessed in index.js.
module.exports = {
  loginCheck: loginCheck,
  changePassword: changePassword,
  register: register,
  getAllGenres: getAllGenres,
  getCategory: getCategory,
  getTopInGenre: getTopInGenre,
  getRecs: getRecs,
  getAppDetailByName: getAppDetailByName,
  getAppScreenshotsById: getAppScreenshotsById,
  getAppDescriptionById: getAppDescriptionById,
  loadMoreCommentsByAppName: loadMoreCommentsByAppName,
  addToWishList: addToWishList,
  getWishList: getWishList,
  isInWishList: isInWishList,
  clearWishList: clearWishList,
  getRecommended: getRecommended,
  getRecommendedByFollowees: getRecommendedByFollowees,
  getFollowing: getFollowing,
  setUserRating: setUserRating,
  getAppVideoById: getAppVideoById,
  getFollowingCategoryData: getFollowingCategoryData,
  getTop3Apps: getTop3Apps,
  getFollowingWishList: getFollowingWishList,
  addFollow: addFollow,
  getPeerRatings: getPeerRatings,
}