const Constants = require("./Constants.js");
const bodyParser = require('body-parser');
const express = require('express');
var routes = require("./routes.js");
const cors = require('cors');

const app = express();

app.use(cors({ credentials: true, origin: `${Constants.frontend_prefix}` }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/* ---------------------------------------------------------------- */
/* ------------------- Route handler registration ----------------- */
/* ---------------------------------------------------------------- */


/* ---- login validate ---- */
app.get('/loginvalidate', routes.loginCheck);
/* ---- change password ---- */
app.get('/changepwd', routes.changePassword)
/* ---- register ---- */
app.get('/registervalidate', routes.register)

/* ---- (Dashboard) ---- */
// The route localhost:8081/genres is registered to the function
// routes.getAllGenres, specified in routes.js.
app.get('/genres', routes.getAllGenres);






/* ---- Q1b (Dashboard) ---- */
app.get('/genres/:genre', routes.getTopInGenre); // Hint: Replace () => {} with the appropriate route handler.
app.get('/category/:genre', routes.getCategory);







/* ---- Q2 (Recommendations) ---- */

app.get('/recommendations/:appName', routes.getRecs);




/* ---- (Best Genre) ---- */
app.get('/decades', routes.getDecades);



app.get('/app_detail/:app_name', routes.getAppDetailByName);


app.get('/app_detail/screenshot/:package_name', routes.getAppScreenshotsById);

app.get('/app_detail/description/:package_name', routes.getAppDescriptionById);

app.get('/app_comments', routes.loadMoreCommentsByAppName);

app.get('/app_peer_rating', routes.getPeerRatings);


app.get('/getWishList/:email', routes.getWishList);
app.get('/addToWishList', routes.addToWishList);
app.get('/isInWishList', routes.isInWishList);
app.get('/clearWishList/:email', routes.clearWishList);
app.get('/getRecommended/:email', routes.getRecommended);
app.get('/getRecommendedByFollowees/:email', routes.getRecommendedByFollowees);

app.get('/getFollowing/:email', routes.getFollowing);
app.get('/getFollowingCategoryData/:email', routes.getFollowingCategoryData);
app.get('/getTop3Apps/:email', routes.getTop3Apps);
app.get('/getFollowingWishList/:email', routes.getFollowingWishList);
app.get('/addFollow', routes.addFollow);

app.get('/rating', routes.setUserRating);
app.get('/video/:package_name', routes.getAppVideoById);

app.listen(8081, () => {
	console.log(`Server listening on PORT 8081`);
});