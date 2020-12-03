import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import { Constants } from './Constants';
import DashboardMovieRow from './DashboardMovieRow';
import AppDetail from './AppDetail';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
import '../style/WishList.css';
import { Rate } from 'antd';
import { getCookie } from './Home';





export default class Following extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      followeeList: new Set(),
      wishList: [],
      userName: getCookie("first_name") + " " + getCookie("last_name"), // e.g. Zimao Wang
      email: getCookie("email"), // e.g. "zimaow@gmail.com",
      rcmdList: []
    }

    // this.addToWL = this.addToWL.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    console.log("into Following.js Mount");
    // Send an HTTP request to the server to get 10 apps to test.
    fetch(`${Constants.servaddr_prefix}/getFollowing/` + getCookie("email"), {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(followeeList => {
        if (!followeeList) return;
        followeeList.map((followeeObj, i) => {
          let tmpSet = this.state.followeeList;
          tmpSet.add(followeeObj.following);
          this.setState({followeeList: tmpSet});
        });
        console.log("followeeList", this.state.followeeList);
      })
      .catch(err => console.log(err));	// Print the error if there is one.

      // fetch(`${Constants.servaddr_prefix}/getFollowing/` + getCookie("email"), {
      //   method: 'GET' // The type of HTTP request.
      // })
      //   .then(res => res.json()) // Convert the response data to a JSON.
      //   .then(tenAppList => {
      //     if (!tenAppList) return;
      //     // Map each tenAppObj in tenAppList to an HTML element:
      //     // A button which triggers the showMovies function for each genre.
      //     let tenAppDivs = tenAppList.map((tenAppObj, i) =>
      //        <GenreButton id={"button-" + tenAppObj.app_name} onClick={() => this.addToWishList(tenAppObj.app_name, this.state.email)} genre={tenAppObj.app_name} />
  
      //     );
      //     console.log("tenAppDivs: " + tenAppDivs);
      //     // Set the state of the genres list to the value returned by the HTTP response from the server.
      //     this.setState({
      //       tenApps: tenAppDivs
      //     });
      //     console.log("state's tenApps: " + this.state.tenApps);
      //   })
      //   .catch(err => console.log(err));	// Print the error if there is one.

    // send an HTTP request to the server to fetch wishlist
  }

  getWishList(email) {
    fetch(`${Constants.servaddr_prefix}/getWishlist/`+email, {
    method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(wishList => {
        if (!wishList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let wishDivs = wishList.map((wishObj, i) =>
          <tr>
            <td>
                <div class="product-item">
                    <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}><img src={wishObj.icon} alt="Product"></img></a>
                    <div class="product-info">
                        <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}>{wishObj.app_name}</a></h4>
                        ReactDOM.render(<Rate disabled defaultValue={0} value={wishObj.rating} />, mountNode);
                        <div class="text-lg text-medium text-muted">${wishObj.price}</div>
                        <div class="text-lg text-medium">{wishObj.summary}</div>
                    </div>
                </div>
            </td>
            <td class="text-center"><a class="remove-from-cart" href="" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
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


  

  render() {    
    return (
      
      // template: https://www.bootdey.com/snippets/view/Wishlist-profile#html
     <div> 
       <PageNavbar active="Following" />
       <br></br><p></p>
      <div class="container padding-bottom-3x mb-2">
        <div className="container movies-container">
        </div>
        <div class="row">
          <div class="col-lg-4">
            <aside class="user-info-wrapper">
              <div class="user-cover" style={{backgroundImage: 'url(https://source.unsplash.com/random)'}}></div>
              <div class="user-info">
                <div class="user-avatar">
                  <a class="edit-avatar" href="#"></a><img src="../user-profile-pic1.png" alt="User"></img>
                </div>
                <div class="user-data">
                  <h4>{this.state.userName}</h4><span>Last Login on {getCookie("date")}</span>
                </div>
              </div>
            </aside>
            <nav class="list-group">
                <a class="list-group-item active" href="/following"> <i class="fa fa-user"> </i> Following</a>
                <a class="list-group-item with-badge " href="/wishlist"><i class="fa fa-heart"></i>My Wishlist<span class="badge badge-primary badge-pill">{this.state.wishList.length}</span></a>
                <a class="list-group-item with-badge " href="/recommended"><i class="fa fa-puzzle-piece"></i>Recommendations</a>
            </nav>
          </div>
          <div class="col-lg-8">
            <div class="padding-top-2x mt-2 hidden-lg-up"></div>
            <div class="table-responsive wishlist-table margin-bottom-none">
              <table class="table">
                <thead>
                    <tr>
                        <th>🚧 UNDER CONSRUCTION 🚧</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.rcmdList}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
    );
  }
}