import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import DashboardMovieRow from './DashboardMovieRow';
import AppDetail from './AppDetail';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
// import { Switch } from 'antd';
import '../style/WishList.css';





export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      tenApps: [],
      wishList: [],
      userName: "Zimao Wang"
      // wishList: new Set(), // store divs for wishlist
      // wishListNames: new Set() // divs in wishList cannot check duplicates, use wishListNames to check
    }

    // this.addToWL = this.addToWL.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    let email = "zimaow@gmail.com";
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
          <GenreButton id={"button-" + tenAppObj.app_name} onClick={() => this.addToWishList(tenAppObj.app_name, email)} genre={tenAppObj.app_name} />
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
    this.getWishList(email);
  }

  getWishList(email) {
    fetch("http://localhost:8081/getWishlist/"+email, {
    method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(wishList => {
        if (!wishList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let wishDivs = wishList.map((wishObj, i) =>
          // <GenreButton id={"button-" + wishObj.app_name} onClick={() => this.addToWishList(wishObj.app_name, email)} genre={wishObj.app_name} />
          <tr>
            <td>
                <div class="product-item">
                    <a class="product-thumb" href="#"><img src="https://via.placeholder.com/220x180/FF0000/000000" alt="Product"></img></a>
                    <div class="product-info">
                        <h4 class="product-title"><a href="#">{wishObj.app_name}</a></h4>
                        <div class="text-lg text-medium text-muted">$43.90</div>
                    </div>
                </div>
            </td>
            <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
        </tr>
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

  addToWishList(appName, email) {
    fetch("http://localhost:8081/addToWishList?appName="+appName+"&email="+email, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(oneAppList => {
        // reload wishlist
        this.getWishList(email);
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
      // <div className="Dashboard">

      //   <PageNavbar active="dashboard" />

      //   <br></br>
      //   <div className="container movies-container">
      //     <div className="jumbotron">
      //       <div className="h5">Test: some Apps to be added to wishlilst</div>
      //       <div className="genres-container">
      //         {this.state.tenApps}
      //       </div>
      //     </div>

      //     <br></br>
      //     <div className="jumbotron">
      //       <div className="h5">Wishlilst</div>
      //       <div className="genres-container">
      //         {this.state.wishList}
      //       </div>
      //     </div>
      //   </div>
        
      // </div>

      // template: https://www.bootdey.com/snippets/view/Wishlist-profile#html
      <div class="container padding-bottom-3x mb-2">
        <div class="row">
          <div class="col-lg-4">
            <aside class="user-info-wrapper">
              <div class="user-cover" style={{backgroundImage: 'url(https://bootdey.com/img/Content/bg1.jpg)'}}></div>
              <div class="user-info">
                <div class="user-avatar">
                  <a class="edit-avatar" href="#"></a><img src="https://play-lh.googleusercontent.com/eNgdaLP7p4F8HBygVcxdjNq9ZFlLSsOOrP2ZMU5_xwAHL_zRS3gd_KAQiw9fmK1dx04=s180-rw" alt="User"></img>
                </div>
                <div class="user-data">
                  <h4>{this.state.userName}</h4><span>Joined November 29, 2020</span>
                </div>
              </div>
            </aside>
            <nav class="list-group">
                <a class="list-group-item" href="#"><i class="fa fa-user"></i>Profile</a>
                <a class="list-group-item with-badge active" href="#"><i class="fa fa-heart"></i>Wishlist<span class="badge badge-primary badge-pill">3</span></a>
            </nav>
          </div>
          <div class="col-lg-8">
            <div class="padding-top-2x mt-2 hidden-lg-up"></div>
            <div class="table-responsive wishlist-table margin-bottom-none">
              <table class="table">
                <thead>
                    <tr>
                        <th>Product Name</th>
                        <th class="text-center"><a class="btn btn-sm btn-outline-danger" href="#">Clear Wishlist</a></th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.wishList}
                    <tr>
                        <td>
                            <div class="product-item">
                                <a class="product-thumb" href="#"><img src="https://via.placeholder.com/220x180/87CEFA/000000" alt="Product"></img></a>
                                <div class="product-info">
                                    <h4 class="product-title"><a href="#">Daily Fabric Cap</a></h4>
                                    <div class="text-lg text-medium text-muted">$24.70</div>
                                </div>
                            </div>
                        </td>
                        <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
                    </tr>
                    <tr>
                        <td>
                            <div class="product-item">
                                <a class="product-thumb" href="#"><img src="https://via.placeholder.com/220x180/483D8B/000000" alt="Product"></img></a>
                                <div class="product-info">
                                    <h4 class="product-title"><a href="#">Cole Haan Crossbody</a></h4>
                                    <div class="text-lg text-medium text-muted">$200.00</div>
                                </div>
                            </div>
                        </td>
                        <td class="text-center"><a class="remove-from-cart" href="#" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
                    </tr>
                </tbody>
              </table>
            </div>
            {/* <hr class="mb-4"> */}
            <div class="custom-control custom-checkbox">
                <input class="custom-control-input" type="checkbox" id="inform_me" checked=""></input>
                <label class="custom-control-label" for="inform_me">Inform me when item from my wishlist is on sale</label>
            </div>
          </div>
        </div>
      </div>
    );
  }
}