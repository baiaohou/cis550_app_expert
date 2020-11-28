import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import DashboardMovieRow from './DashboardMovieRow';
import AppDetail from './AppDetail';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
// import { Switch } from 'antd';

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      tenApps: [],
      wishList: []
      // wishList: new Set(), // store divs for wishlist
      // wishListNames: new Set() // divs in wishList cannot check duplicates, use wishListNames to check
    }

    // this.addToWL = this.addToWL.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    console.log("into Wishlist.js Mount");
    // Send an HTTP request to the server to get 10 apps to test.
    fetch("http://localhost:8081/get10apps", {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(tenAppList => {
        if (!tenAppList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let tenAppDivs = tenAppList.map((tenAppObj, i) =>
          <GenreButton id={"button-" + tenAppObj.app_name} onClick={() => this.addToWishList(tenAppObj.app_name, "zimaow@gmail.com")} genre={tenAppObj.app_name} />
        );
        console.log("tenAppDivs: " + tenAppDivs);
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          tenApps: tenAppDivs
        });
        console.log("state's tenApps: " + this.state.tenApps);
      })
      .catch(err => console.log(err));	// Print the error if there is one.

    // send an HTTP request to the server to fetch wishlist
    let user = "zimaow@gmail.com";
    fetch("http://localhost:8081/getWishlist/"+user, {
    method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(wishList => {
        if (!wishList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let wishDivs = wishList.map((wishObj, i) =>
          <GenreButton id={"button-" + wishObj.app_name} onClick={() => this.addToWishList(wishObj.app_name, "zimaow@gmail.com")} genre={wishObj.app_name} />
        );
        console.log("wishDivs: " + wishDivs);
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          wishList: wishDivs
        });
        console.log("state's wishList: " + this.state.wishList);
      })
      .catch(err => console.log(err));	// Print the error if there is one.
  }


  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */

  addToWishList(appName, user) {
    fetch("http://localhost:8081/addToWishList?appName="+appName+"&user="+user, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(oneAppList => {
        // reload wishlist
        let user = "zimaow@gmail.com";
        fetch("http://localhost:8081/getWishlist/"+user, {
        method: 'GET' // The type of HTTP request.
        })
          .then(res => res.json()) // Convert the response data to a JSON.
          .then(wishList => {
            if (!wishList) return;
            // Map each tenAppObj in tenAppList to an HTML element:
            // A button which triggers the showMovies function for each genre.
            let wishDivs = wishList.map((wishObj, i) =>
              <GenreButton id={"button-" + wishObj.app_name} onClick={() => this.addToWishList(wishObj.app_name, "zimaow@gmail.com")} genre={wishObj.app_name} />
            );
            console.log("wishDivs: " + wishDivs);
            // Set the state of the genres list to the value returned by the HTTP response from the server.
            this.setState({
              wishList: wishDivs
            });
            console.log("state's wishList: " + this.state.wishList);
          })
          .catch(err => console.log(err));	// Print the error if there is one.
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }

  // addToWL(appName) {
  //   fetch("http://localhost:8081/addToWishList/"+appName, {
  //     method: 'GET' // The type of HTTP request.
  //   })
  //     .then(res => res.json()) // Convert the response data to a JSON.
  //     .then(oneAppList => {
  //       if (!oneAppList) return;
  //       // Map each genreObj in genreList to an HTML element:
  //       // A button which triggers the showMovies function for each genre.

  //       // Set the state of the genres list to the value returned by the HTTP response from the server.
  //       oneAppList.map((oneAppObj) => {
  //         let {wishList} = this.state;
  //         let {wishListNames} = this.state;
  //         if (wishListNames.has(oneAppObj.App)) {
  //           console.log("The wishlist already has this app");
  //           wishListNames.delete(oneAppObj.App);
  //           for (let x of wishList) {
  //             if (x.props.id == "button-" + oneAppObj.App) {
  //               wishList.delete(x);
  //             }
  //           }
  //         } else {
  //           console.log("The wishlist already has does not have this app");
  //           wishListNames.add(oneAppObj.App);
  //           wishList.add(<GenreButton id={"button-" + oneAppObj.App} onClick={() => this.addToWL(oneAppObj.App)} genre={oneAppObj.App} />);
  //           console.log("wishList: ", wishList);
  //         }
  //         this.setState({
  //           wishList: wishList,
  //           wishListNames: wishListNames
  //         });
  //       });
  //     })
  //     .catch(err => console.log(err))	// Print the error if there is one.
  // }

  render() {    
    return (
      <div className="Dashboard">

        <PageNavbar active="dashboard" />

        <br></br>
        <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Test: some Apps to be added to wishlilst</div>
            <div className="genres-container">
              {this.state.tenApps}
            </div>
          </div>

          <br></br>
          <div className="jumbotron">
            <div className="h5">Wishlilst</div>
            <div className="genres-container">
              {this.state.wishList}
            </div>
          </div>
        </div>
      </div>
    );
  }
}