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
import Chart from "react-google-charts";
import ReactTooltip from "react-tooltip";


import { UserOutlined, AntDesignOutlined } from '@ant-design/icons';
import { Comment, Tooltip, Avatar } from 'antd';

import { Input } from 'antd';
const { Search } = Input;


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
      pieData: [],
      barData: [],
      top3Apps: [],
      top3Picks: [],
      top3Ratings: [],
      top3Installs: [],
      top3Price: [],
      followingWishList: [],
      content: []
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
      this.getFollowingCategoryData(this.state.email);
      this.getWishList(this.state.email); // to update the number on the badge
      this.getFollowingWishList(this.state.email);
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
                        <div dangerouslySetInnerHTML={{__html: wishObj.summary}}></div>
                    </div>
                </div>
            </td>
            <td class="text-center"><a class="remove-from-cart" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
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

  getFollowingCategoryData(email) {
    console.log("call getFollowingCategoryData");
    fetch(`${Constants.servaddr_prefix}/getFollowingCategoryData/`+email, {
      method: 'GET' // The type of HTTP request.
      })
        .then(res => res.json()) // Convert the response data to a JSON.
        .then(dataList => {
          if (!dataList) return;
          let newPieData = [['Category', 'Proportion', 'max', 'min', 'avg']];
          let newBarData = [['Category', 'max', 'min', 'avg']]
          dataList.map((dataObj, i) => {
            let tmpList = [dataObj.category.replace(/_/g, " "), dataObj.num, dataObj.max_rating, dataObj.min_rating, dataObj.avg_rating];
            newPieData.push(tmpList);
            if (dataObj.num > 1) { // for bar chart, only consider category with num>1
              tmpList = [dataObj.category.replace(/_/g, " "), dataObj.max_rating, dataObj.min_rating, dataObj.avg_rating];
              newBarData.push(tmpList);
            }
          });
          console.log("newPieData: ", newPieData);
          console.log("newBarData: ", newBarData);
          this.setState({pieData: newPieData, barData: newBarData});
          console.log("state pieData: ", this.state.pieData);
          console.log("state barData: ", this.state.barData);
        })
        .catch(err => console.log(err));	// Print the error if there is one.

    // get top3 apps with number
    fetch(`${Constants.servaddr_prefix}/getTop3Apps/`+email, {
      method: 'GET' // The type of HTTP request.
      })
        .then(res => res.json()) // Convert the response data to a JSON.
        .then(dataList => {
          if (!dataList) return;
          let tmpTop3Apps = [];
          let tmpTop3Picks = [];
          let tmpTop3Ratings = [];
          let tmpTop3Installs = [];
          let tmpTop3Price = [];
          dataList.map((dataObj, i) => {
            if (i < 3) {
              console.log("rating: ", dataObj.general_rating);
              console.log("price: ", dataObj.price);
              tmpTop3Apps.push(dataObj.app_name);
              tmpTop3Picks.push(dataObj.picks);
              tmpTop3Ratings.push(dataObj.general_rating);
              tmpTop3Installs.push(dataObj.installs);
              tmpTop3Price.push(dataObj.price);
            }
          });
          this.setState({top3Apps: tmpTop3Apps,
                        top3Picks: tmpTop3Picks,
                        top3Ratings: tmpTop3Ratings,
                        top3Installs: tmpTop3Installs,
                        top3Price: tmpTop3Price
          });
        })
        .catch(err => console.log(err));	// Print the error if there is one.
  }

  getFollowingWishList(email) {
    console.log("call getFollowingWishList");
    fetch(`${Constants.servaddr_prefix}/getFollowingWishList/`+email, {
      method: 'GET' // The type of HTTP request.
      })
        .then(res => res.json()) // Convert the response data to a JSON.
        .then(dataList => {
          if (!dataList) return;
          let lastemail = "";
          let tmpDiv = "";
          let dataDivs =  [];
          let tmpContent = [];
          let avatars = [];// avatars in avatar.group
          dataList.map((dataObj, i) => {
            
            
            if (i == 0) {
              avatars.push(<Tooltip title={dataObj.app_name} placement="top"><Avatar src={dataObj.icon} /></Tooltip>);
            tmpDiv = <Comment author={<a>{dataObj.first_name} {dataObj.last_name} ({dataObj.email})</a>} avatar={ <Avatar src="../user-profile-pic1.png" />} content={<Avatar.Group maxCount={5} size="large" maxStyle={{color: '#f56a00',backgroundColor: '#fde3cf',}}>{avatars}</Avatar.Group>}/>
            } else if (dataObj.email!=lastemail) {
              dataDivs.push(tmpDiv);
              avatars = [];// clear avatars for new user
              avatars.push(<Tooltip title={dataObj.app_name} placement="top"><Avatar src={dataObj.icon} /></Tooltip>);
              tmpDiv = <Comment author={<a>{dataObj.first_name} {dataObj.last_name} ({dataObj.email})</a>} avatar={ <Avatar src="../user-profile-pic1.png" />} content={<Avatar.Group maxCount={5} size="large" maxStyle={{color: '#f56a00',backgroundColor: '#fde3cf',}}>{avatars}</Avatar.Group>}/>
            } else {
              avatars.push(<Tooltip title={dataObj.app_name} placement="top"><Avatar src={dataObj.icon} /></Tooltip>);
            }
            lastemail=dataObj.email;// record last email, to divide by emails
          });
          dataDivs.push(tmpDiv);// add the last dataObj
          this.setState({
            followingWishList: dataDivs
          });
        })
        .catch(err => console.log(err));	// Print the error if there is one.
        console.log("state followingwishlist: ", this.state.followingWishList);
  }

  addFollow(email) {
    console.log("call addFollow", email);// onSearch will pass value here
    let thisemail = this.state.email;
    console.log("this email", thisemail);
    fetch(`${Constants.servaddr_prefix}/addFollow?self=`+getCookie("email")+"&following="+email, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(oneAppList => {
        // reload following's wishlist
        this.getFollowingCategoryData(thisemail);
        this.getFollowingWishList(thisemail);
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }
  

  render() {    
    return (
      
      // template: https://www.bootdey.com/snippets/view/Wishlist-profile#html
     <div> 
       <PageNavbar active="Community" />
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
                      <Search placeholder=" Enter user email to follow/unfollow" prefix={<UserOutlined className="site-form-item-icon"/>} allowClear enterButton="Follow/Unfollow"  onSearch={this.addFollow.bind(this)} />
                    </tr>
                    <p></p>
                    <tr>
                        <th>People You Follow 👬</th>
                    </tr>
                    {/* <tr>
                      <Search placeholder="input search email" suffix="+" prefix={<UserOutlined />} allowClear onSearch={this.getWishList} style={{ width: 200, margin: '0 10px' }} />
                    </tr>
                    <tr>
                    <Input placeholder="search email and follow" prefix={<UserOutlined className="site-form-item-icon"/>} suffix="follow" />
                    </tr> */}
                </thead>
                <tbody>
                    {this.state.followingWishList}
                    
                    <tr>
                        <th>
                        <b>TOP 3 POPULAR <b style={{color:'darkcyan'}}>MOBILE APPS</b> PICKED BY YOUR FOLLOWEES &nbsp;🏵</b><br></br><br></br>
                        {/* example data, need to replace this */}
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a data-tip data-for="1st" align="center">
                        🥇  &nbsp;<b style={{color:'orange'}}>{this.state.top3Apps[0]}</b> ({this.state.top3Picks[0]} picks) 
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a data-tip data-for="2nd" align="center">
                        🥈  &nbsp;<b style={{color:'gray'}}>{this.state.top3Apps[1]}</b> ({this.state.top3Picks[1]} picks)
                        </a>
                        &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        <a data-tip data-for="3rd" align="center">
                        🥉  &nbsp;<b style={{color:'brown'}}>{this.state.top3Apps[2]}</b> ({this.state.top3Picks[2]} picks)
                        </a>

                        <ReactTooltip id="1st" place="right" >
                          <b>{this.state.top3Apps[0]}</b>
                          <br></br>
                          Rating: {this.state.top3Ratings[0]}
                          <br></br>
                          Installs: {this.state.top3Installs[0]}+
                          <br></br>
                          Price: ${this.state.top3Price[0]}
                        </ReactTooltip>

                        <ReactTooltip id="2nd" place="right" >
                          <b>{this.state.top3Apps[1]}</b>
                          <br></br>
                          Rating: {this.state.top3Ratings[1]}
                          <br></br>
                          Installs: {this.state.top3Installs[1]}+
                          <br></br>
                          Price: ${this.state.top3Price[1]}
                        </ReactTooltip>

                        <ReactTooltip id="3rd" place="right" >
                          <b>{this.state.top3Apps[2]}</b>
                          <br></br>
                          Rating: {this.state.top3Ratings[2]}
                          <br></br>
                          Installs: {this.state.top3Installs[2]}+
                          <br></br>
                          Price: ${this.state.top3Price[2]}
                        </ReactTooltip> 

                        <hr></hr>
                        <b>TOP 3 RATED <b style={{color:'darkblue'}}>CATEGORIES</b> AMONG YOUR FOLLOWEES &nbsp;🏆</b>
                        {/* Top Categories Picked By Your Following */}
                        <Chart
                          width={'600px'}
                          height={'300px'}
                          chartType="PieChart"
                          loader={<div>Loading Chart</div>}
                          data={this.state.pieData}
                          options={{
                            // title: 'Top Categories Picked By Your Followees',
                            // pieSliceText: 'label',
                            pieHole:0.4,
                            slices: {
                              4: { offset: 0.2 },
                              12: { offset: 0.3 },
                              14: { offset: 0.4 },
                              15: { offset: 0.5 },
                            }
                          }}
                          rootProps={{ 'data-testid': '5' }}
                        />


                        <hr></hr>
                        <b> <b style={{color:'purple'}}>RATINGS STATISTICS</b> AMONG YOUR FOLLOWEES &nbsp;🧮</b>
                        
                        {/* User Ratings By Your Following */}
                        
                        <Chart
                          width={'600px'}
                          height={'300px'}
                          chartType="ComboChart"
                          loader={<div>Loading Chart</div>}
                          data={this.state.barData}
                          options={{
                            // title: 'Category Ratings By Your Followees',
                            vAxis: { title: 'Rating🌟' },
                            // hAxis: { title: 'Categories' },
                            seriesType: 'bars',
                            series: { 2: { type: 'line' } },
                          }}
                          rootProps={{ 'data-testid': '1' }}
                        />

                        </th>
                    </tr>
                  

                    {/* <b>TOP 3 APPS PICKED BY YOUR FOLLOWING</b><br></br> */}
                    {/* <a data-tip data-for="1st" align="center">
                    🏅  &nbsp;<b style={{color:'orange'}}>{this.state.top3Apps[0]}</b> ({this.state.top3Picks[0]} picks) 
                    </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a data-tip data-for="2nd" align="center">
                    🥈  &nbsp;<b style={{color:'gray'}}>{this.state.top3Apps[1]}</b> ({this.state.top3Picks[1]} picks)
                    </a>
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <a data-tip data-for="3rd" align="center">
                    🥉  &nbsp;<b style={{color:'brown'}}>{this.state.top3Apps[2]}</b> ({this.state.top3Picks[2]} picks)
                    </a>

                    <ReactTooltip id="1st" place="right" >
                      <b>{this.state.top3Apps[0]}</b>
                      <br></br>
                      Rating: {this.state.top3Ratings[0]}
                      <br></br>
                      Installs: {this.state.top3Installs[0]}+
                      <br></br>
                      Price: ${this.state.top3Price[0]}
                    </ReactTooltip>

                    <ReactTooltip id="2nd" place="right" >
                      <b>{this.state.top3Apps[1]}</b>
                      <br></br>
                      Rating: {this.state.top3Ratings[1]}
                      <br></br>
                      Installs: {this.state.top3Installs[1]}+
                      <br></br>
                      Price: ${this.state.top3Price[1]}
                    </ReactTooltip>

                    <ReactTooltip id="3rd" place="right" >
                      <b>{this.state.top3Apps[2]}</b>
                      <br></br>
                      Rating: {this.state.top3Ratings[2]}
                      <br></br>
                      Installs: {this.state.top3Installs[2]}+
                      <br></br>
                      Price: ${this.state.top3Price[2]}
                    </ReactTooltip> */}

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