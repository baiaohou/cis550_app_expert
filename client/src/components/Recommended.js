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
import { Rate, Tag } from 'antd';
import { getCookie } from './Home';
import { Constants } from './Constants';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';





export default class Recommended extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      tenApps: [],
      wishList: [],
      userName: getCookie("first_name") + " " + getCookie("last_name"), // e.g. Zimao Wang
      email: getCookie("email"), // e.g. "zimaow@gmail.com",
      rcmdList: [],
      recmdBySelf: 1,
      menu: "",
      whoseInterest: "Your own interest"
    }

    // this.addToWL = this.addToWL.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    console.log("into Recommended.js Mount");
    // send an HTTP request to the server to fetch wishlist
    this.getWishList(this.state.email);// to update this.state.wishList, displaying length in badge
    if (this.state.recmdBySelf == 1) {
      this.getRecommended(this.state.email);
    } else {
      this.getRecommendedByFollowees(this.state.email);
    }
    let menu = <Menu>
    <Menu.Item key="0">
        <a target="_blank" onClick={() => this.updateRcmdList(1)}>
          Your own interest
        </a>
      </Menu.Item>
      <Menu.Item key="1">
        <a target="_blank" onClick={() => this.updateRcmdList(0)}>
          Followees interest
        </a>
      </Menu.Item>
    </Menu>
    this.setState({
      menu: menu
    })
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
        let wishDivs = wishList.map((wishObj, i) => {
          if (wishObj.price == 0) {
            return (
              <tr>
                <td>
                    <div class="product-item">
                        <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}><img src={wishObj.icon} alt="Product"></img></a>
                        <div class="product-info">
                            <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}>{wishObj.app_name}</a></h4>
                            <div class="divs-inline"><Rate disabled defaultValue={0} value={wishObj.rating} />&nbsp;{wishObj.rating}</div>
                            <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;Free&nbsp;&nbsp;</div>
                            <div class="tag-inline-block"><Tag color="cyan">{wishObj.genre}</Tag></div>
                            <div>{wishObj.installs}+ installs</div>
                            <div class="text-lg text-medium">{wishObj.summary}</div>
                        </div>
                    </div>
                </td>
                <td class="text-center"><a class="remove-from-cart" href="" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
              </tr>
            )
          } else {
            return (
              <tr>
                <td>
                    <div class="product-item">
                        <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}><img src={wishObj.icon} alt="Product"></img></a>
                        <div class="product-info">
                            <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(wishObj.app_name)}>{wishObj.app_name}</a></h4>
                            <div class="divs-inline"><Rate disabled defaultValue={0} value={wishObj.rating} />&nbsp;{wishObj.rating}</div>
                            <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;${wishObj.price}&nbsp;&nbsp;</div>
                            <div class="tag-inline-block"><Tag color="cyan">{wishObj.genre}</Tag></div>
                            <div>{wishObj.installs}+ installs</div>
                            <div class="text-lg text-medium">{wishObj.summary}</div>
                        </div>
                    </div>
                </td>
                <td class="text-center"><a class="remove-from-cart" href="" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
            </tr>
            )
          }
        });
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
    fetch(`${Constants.servaddr_prefix}/addToWishList?appName=`+encodeURIComponent(appName)+"&email="+email, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(oneAppList => {
        // reload wishlist
        this.getWishList(email);
        if (this.state.recmdBySelf == 1) {
          this.getRecommended(this.state.email);
        } else {
          this.getRecommendedByFollowees(this.state.email);
        }
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }

  // clearWishList(email) {
  //   console.log("call clearWishList");
  //   console.log("clearWishList email: ", email);
  //   fetch(`${Constants.servaddr_prefix}/clearWishlist/`+email, {
  //     method: 'GET' // The type of HTTP request.
  //   })
  //     .then(res => res.json()) // Convert the response data to a JSON.
  //     .then(oneAppList => {
  //       // reload wishlist
  //       this.getWishList(email);
  //     })
  //     .catch(err => console.log(err))	// Print the error if there is one.
  // }

  getRecommended(email) {
    console.log("call getRecommended");
    fetch(`${Constants.servaddr_prefix}/getRecommended/`+email, {
    method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(rcmdList => {
        if (!rcmdList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let rcmdDivs = rcmdList.map((rcmdObj, i) => {
          let resultPrice = "";
          if (rcmdObj.price == 0) {
            resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;Free&nbsp;&nbsp;</div>;
          } else {
            resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;${rcmdObj.price}&nbsp;&nbsp;</div>;
          }
          let resultGenre = "";
          if (!rcmdObj.genre2) {
            resultGenre = <div class="tag-inline-block"><Tag color="cyan">{rcmdObj.genre1}</Tag></div>
          } else {
            resultGenre = <div class="tag-inline-block"><div class="tag-inline-block"><Tag color="cyan">{rcmdObj.genre1}</Tag></div><div class="tag-inline-block"><Tag color="cyan">{rcmdObj.genre2}</Tag></div></div>
          }
          return (
            <tr>
              <td>
                  <div class="product-item">
                      <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(rcmdObj.app_name)}><img src={rcmdObj.icon} alt="Product"></img></a>
                      <div class="product-info">
                          <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(rcmdObj.app_name)}>{rcmdObj.app_name}</a></h4>
                          <div class="divs-inline"><Rate disabled defaultValue={0} value={rcmdObj.rating} />&nbsp;&nbsp;&nbsp;{rcmdObj.rating}</div>
                          &nbsp;&nbsp;{resultPrice}&nbsp;&nbsp;
                          {resultGenre}
                          <div>{rcmdObj.installs}+ installs</div>
                          <div class="text-lg text-medium">{rcmdObj.summary}</div>
                      </div>
                  </div>
              </td>
              <td class="text-center">
                <a class="add-to-wishlist" href="" data-toggle="tooltip" title="" data-original-title="Remove item">
                  <i class="fa fa-plus-circle fa-2x" aria-hidden="true" onClick={() => this.addToWishList(rcmdObj.app_name, this.state.email)}></i>
                </a>
              </td>
            </tr>
          )
        });
        console.log("rcmdDivs: " + rcmdDivs);
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          rcmdList: rcmdDivs
        });
        console.log("state's rcmdList: " + this.state.rcmdList);
      })
      .catch(err => console.log(err));	// Print the error if there is one.
  }

  getRecommendedByFollowees(email) {
    console.log("call getRecommendedByFollowees");
    fetch(`${Constants.servaddr_prefix}/getRecommendedByFollowees/`+email, {
    method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(rcmdList => {
        if (!rcmdList) return;
        // Map each tenAppObj in tenAppList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let rcmdDivs = rcmdList.map((rcmdObj, i) => {
          let resultPrice = "";
          if (rcmdObj.price == 0) {
            resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;Free&nbsp;&nbsp;</div>;
          } else {
            resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;${rcmdObj.price}&nbsp;&nbsp;</div>;
          }
          let resultGenre = "";
          if (!rcmdObj.genre2) {
            resultGenre = <div class="tag-inline-block"><Tag color="cyan">{rcmdObj.genre1}</Tag></div>
          } else {
            resultGenre = <div class="tag-inline-block"><div class="tag-inline-block"><Tag color="cyan">{rcmdObj.genre1}</Tag></div><div class="tag-inline-block"><Tag color="cyan">{rcmdObj.genre2}</Tag></div></div>
          }
          return (
            <tr>
              <td>
                  <div class="product-item">
                      <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(rcmdObj.app_name)}><img src={rcmdObj.icon} alt="Product"></img></a>
                      <div class="product-info">
                          <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(rcmdObj.app_name)}>{rcmdObj.app_name}</a></h4>
                          <div class="divs-inline"><Rate disabled defaultValue={0} value={rcmdObj.rating} />&nbsp;&nbsp;&nbsp;{rcmdObj.rating}</div>
                          &nbsp;&nbsp;{resultPrice}&nbsp;&nbsp;
                          {resultGenre}
                          <div>{rcmdObj.installs}+ installs</div>
                          <div class="text-lg text-medium">{rcmdObj.summary}</div>
                      </div>
                  </div>
              </td>
              <td class="text-center">
                <a class="add-to-wishlist" href="" data-toggle="tooltip" title="" data-original-title="Remove item">
                  <i class="fa fa-plus-circle fa-2x" aria-hidden="true" onClick={() => this.addToWishList(rcmdObj.app_name, this.state.email)}></i>
                </a>
              </td>
            </tr>
          )
        });
        console.log("rcmdDivs: " + rcmdDivs);
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          rcmdList: rcmdDivs
        });
        console.log("state's rcmdList: " + this.state.rcmdList);
      })
      .catch(err => console.log(err));	// Print the error if there is one.
  }
  
  // change the way and update recommended list according to the button
  updateRcmdList(isBySelf) {
    // isBySelf=1 means true
    console.log("call updateRcmdList","recmdBySelf=",this.state.whoseInterest,"isByself=",isBySelf);
    if (this.state.recmdBySelf != isBySelf) {
      if (isBySelf == 1) {
        this.getRecommended(this.state.email);
        this.setState({whoseInterest: "Your own interest"});
      } else {
        this.getRecommendedByFollowees(this.state.email);
        this.setState({whoseInterest: "Followees interest"});
      }
      this.setState({recmdBySelf: 1-this.state.recmdBySelf});
    } else {
      console.log("already in this state");
    }
  }


  render() {    
    return (
      
      // template: https://www.bootdey.com/snippets/view/Wishlist-profile#html
     <div> 
       <PageNavbar active="Recommendations" />
       <br></br><p></p>
      <div class="container padding-bottom-3x mb-2">
        {/* <div className="container movies-container">
          <div className="jumbotron">
            <div className="h5">Test: some Apps to be added to wishlilst</div>
            <div className="genres-container">
              {this.state.tenApps}
            </div>
          </div>
        </div> */}
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
                <a class="list-group-item" href="/following"> <i class="fa fa-user"> </i> Following</a>
                <a class="list-group-item with-badge " href="/wishlist"><i class="fa fa-heart"></i>My Wishlist<span class="badge badge-primary badge-pill">{this.state.wishList.length}</span></a>
                <a class="list-group-item with-badge active" href="/recommended"><i class="fa fa-puzzle-piece"></i>Recommendations</a>
            </nav>
          </div>
          <div class="col-lg-8">
            <div class="padding-top-2x mt-2 hidden-lg-up"></div>
            <div class="table-responsive wishlist-table margin-bottom-none">
              <table class="table">
                <thead>
                    <tr>
                        <th>Recommendations For You</th>\
                        {/* <i class="fa fa-heart" onClick={() => {console.log(this.state.recmdBySelf); this.setState({recmdBySelf: 1-this.state.recmdBySelf});this.updateRcmdList();}}></i> */}
                    </tr>
                </thead>
                <tbody>
                  <td></td>
                  <td class="text-center">
                    <div style={{ textAlign: "right" }}>
                      <Dropdown overlay={this.state.menu}>
                        <Tag >
                          <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                            {this.state.whoseInterest} <DownOutlined />
                          </a>
                        </Tag>
                      </Dropdown>
                    </div>
                  </td>
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


