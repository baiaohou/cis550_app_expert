import React from 'react';
import '../style/Dashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import PageNavbar from './PageNavbar';
import GenreButton from './GenreButton';
import DashboardMovieRow from './DashboardMovieRow';
import AppDetail from './AppDetail';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
import { Constants } from './Constants';
// import { Switch } from 'antd';
import { Rate } from 'antd';
import { Menu, Button } from 'antd';
import Chart from "react-google-charts";
import Layout from 'antd/lib/layout/layout';
import { getCookie } from './Home';
const { Header, Content, Sider } = Layout;
const { Item: MenuItem } = Menu;


// const { SubMenu } = Menu;

export default class Dashboard extends React.Component {
  constructor(props) {
    super(props);

    // The state maintained by this React Component. This component maintains the list of genres,
    // and a list of movies for a specified genre.
    this.state = {
      genres: [],
      category_info: [],
      url: "..\public\category_bg.jpg",
      apps: [],
      topRatingApps:[],
      topInstallApps:[],
      four_star: 0,
      three_star: 0,
      two_star: 0,
      cate_data: [["stars","apps"],["Positve", 0],["Neutral", 0],["Negative",0]],
      userName: getCookie("first_name") + " " + getCookie("last_name"), // e.g. Zimao Wang
      email: getCookie("email"), // e.g. "zimaow@gmail.com",
    }
    this.showCategory = this.showCategory.bind(this);
    this.showMovies = this.showMovies.bind(this);
    // this.addToWishList = this.addToWishList.bind(this);
  }

  // React function that is called when the page load.
  componentDidMount() {
    // Send an HTTP request to the server.
    fetch(`${Constants.servaddr_prefix}/genres`, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(genreList => {
        if (!genreList) return;
        // Map each genreObj in genreList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        console.log('genrelist')
        console.log(genreList)
        let genreDivs = genreList.map((genreObj, i) =>
          <Menu.Item key = {i} color="grey" onClick={() => {this.showMovies(genreObj.genre);this.showCategory(genreObj.genre)}} genre={genreObj.genre}> {genreObj.genre.replace(/_/g, " ")}</Menu.Item> 
          //<GenreButton id={"button-" + genreObj.genre} onClick={() => this.showMovies(genreObj.genre)} genre={genreObj.genre} />
        );
        
        console.log('menu items')
        console.log(genreDivs)

        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          genres: genreDivs
        })
      })
      .catch(err => console.log(err))	// Print the error if there is one.

      fetch(`${Constants.servaddr_prefix}/category/`+`GAME`, {
        method: 'GET' // The type of HTTP request.
      })
    
        .then(res => res.json()) // Convert the response data to a JSON.
        .then(cateList => {
          console.log(cateList);
          if (!cateList) return;
          // Map each genreObj in genreList to an HTML element:
          // A button which triggers the showMovies function for each genre.
          
          let cateDivs = cateList.map((cate, i) =>
          
          <tr>
              <td>
                  <div class="product-item">
                      {/* <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(app.app_name)}><img src={app.icon} alt="Product"></img></a> */}
                      <div class="product-info">
                          <h4><b>{cate.category}</b></h4>
                          {/* <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(app.app_name)}>{app.app_name}</a></h4> */}
                          <div><Rate disabled defaultValue={0} value={cate.average} />&nbsp;&nbsp;&nbsp;{cate.average}</div>
                          <div><b>Category Ranking:</b> <a style={{color:'darkred'}}>No. {cate.avg_rank}</a> </div>
                          <div><b>Total Apps Count:</b> <a style={{color:'darkblue'}}>{cate.num}</a></div>
                          <div><b style={{color:'purple'}}>{cate.user_num + 0}</b> of our users added <b>{cate.category.replace(/_/g, " ")}</b> apps to their wishlist! </div>
                          <div><b>Popularity Rank:</b> <a style={{color:'darkred'}}>No. {cate.user_rank}</a></div><br></br>
                          <h6>Don't hesitate to explore! 😸</h6>
                          
                          {/* <div class="text-lg text-medium text-muted">${app.price}</div>
                          <div class="text-lg text-medium">{app.summary}</div> */}
                      </div>
                  </div>
              </td>
              <td class="text-center"><a class="remove-from-cart" href="" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
          </tr>
          );
  
          console.log("cateinfo")
          console.log(cateList[0].four_star)
          // data_cate = []
          const data_list = [["stars","apps"],["Positve", cateList[0].four_star],["Neutral", cateList[0].three_star],["Negative",cateList[0].two_star]]
          console.log(data_list)
          // Set the state of the genres list to the value returned by the HTTP response from the server.
          this.setState({
            category_info: cateDivs,
            four_star: cateList[0].four_star,
            data_cate: data_list
            // data_cate: [["stars","apps"],["four stars", cateList[0].four_star],["three stars", cateList[0].three_star]]
          })
        })
        .catch(err => console.log(err))	// Print the error if there is one.


        fetch(`${Constants.servaddr_prefix}/genres/`+`GAME`, {
          method: 'GET' // The type of HTTP request.
        })
      
          .then(res => res.json()) // Convert the response data to a JSON.
          .then(appList => {
            
            if (!appList) return;
            let topRating = []
            let topInstalls = []
            // Map each genreObj in genreList to an HTML element:
            // A button which triggers the showMovies function for each genre.
            let appDivs = appList.map((app, i) =>{
              
              let resultPrice = "";
              if (app.price == 0) {
                  resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;Free&nbsp;&nbsp;</div>;
              } else {
                  resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;${app.price}&nbsp;&nbsp;</div>;
              }
              return(
              <tr>
                  <td>
                      <div class="product-item">
                          <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(app.app_name)}><img src={app.icon} alt="Product"></img></a>
                          <div class="product-info">
                              <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(app.app_name)}>{app.app_name}</a></h4>
                              <div class="divs-inline"><Rate disabled defaultValue={0} value={app.rating} />&nbsp;&nbsp;&nbsp;{app.rating}</div>
                              &nbsp;&nbsp;{resultPrice}&nbsp;&nbsp;
                              {/* {resultGenre} */}
                              <div>{app.installs}+ installs</div>
                              <div dangerouslySetInnerHTML={{__html: app.summary}}></div>
                          </div>
                      </div>
                  </td>
                  <td class="text-center">
                      <a class="add-to-wishlist" href="" data-toggle="tooltip" title="" data-original-title="Remove item">
                          <i class="fa fa-plus-circle fa-2x" aria-hidden="true" onClick={() => this.addToWishListDashboard(app.app_name, this.state.email)}></i>
                      </a>
                  </td>
              </tr>
              )
          });
            // console.log(appList);
            topInstalls = appDivs.slice(0,5)
            topRating = appDivs.slice(5,10)
            // Set the state of the genres list to the value returned by the HTTP response from the server.
            this.setState({
              topRatingApps: topRating,
              topInstallApps: topInstalls,
              apps: appDivs
            })
          })
          .catch(err => console.log(err))	// Print the error if there is one.



  }

  showCategory(genre){
    fetch(`${Constants.servaddr_prefix}/category/`+genre, {
      method: 'GET' // The type of HTTP request.
    })
  
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(cateList => {
        console.log(cateList);
        if (!cateList) return;
        // Map each genreObj in genreList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        
        let cateDivs = cateList.map((cate, i) =>
        
        <tr>
            <td>
                <div class="product-item">
                    {/* <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(app.app_name)}><img src={app.icon} alt="Product"></img></a> */}
                    <div class="product-info">
                        <h4>{cate.category.replace(/_/g, " ")}</h4>
                        {/* <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(app.app_name)}>{app.app_name}</a></h4> */}
                        <div><Rate disabled defaultValue={0} value={cate.average} />&nbsp;&nbsp;&nbsp;{cate.average}</div>
                          <div><b>Category Ranking:</b> <a style={{color:'darkred'}}>No. {cate.avg_rank}</a> </div>
                          <div><b>Total Apps Count:</b> <a style={{color:'darkblue'}}>{cate.num}</a></div>
                          <div><b style={{color:'purple'}}>{cate.user_num + 0}</b> of our users added <b>{cate.category.replace(/_/g, " ")}</b> apps to their wishlist! </div>
                          <div><b>Popularity Rank:</b> <a style={{color:'darkred'}}>No. {cate.user_rank}</a></div><br></br>
                          <h6>Don't hesitate to explore! 😸</h6>
                        
                        {/* <div class="text-lg text-medium text-muted">${app.price}</div>
                        <div class="text-lg text-medium">{app.summary}</div> */}
                    </div>
                </div>
            </td>
            <td class="text-center"><a class="remove-from-cart" href="" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
        </tr>
        );

        console.log("cateinfo")
        console.log(cateList[0].four_star)
        // data_cate = []
        const data_list = [["stars","apps"],["Positve", cateList[0].four_star],["Neutral", cateList[0].three_star],["Negative",cateList[0].two_star]]
        console.log(data_list)
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          category_info: cateDivs,
          four_star: cateList[0].four_star,
          data_cate: data_list
          // data_cate: [["stars","apps"],["four stars", cateList[0].four_star],["three stars", cateList[0].three_star]]
        })
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }
  /* ---- Q1b (Dashboard) ---- */
  /* Set this.state.movies to a list of <DashboardMovieRow />'s. */
  addToWishListDashboard(appName, email) {
    fetch(`${Constants.servaddr_prefix}/addToWishList?appName=`+encodeURIComponent(appName)+"&email="+email, {
      method: 'GET' // The type of HTTP request.
    })
      .then(res => res.json()) // Convert the response data to a JSON.
      .catch(err => console.log(err))	// Print the error if there is one.
      
  }

  

  showMovies(genre) {
    fetch(`${Constants.servaddr_prefix}/genres/`+genre, {
      method: 'GET' // The type of HTTP request.
    })
  
      .then(res => res.json()) // Convert the response data to a JSON.
      .then(appList => {
        
        if (!appList) return;
        let topRating = []
        let topInstalls = []
        // Map each genreObj in genreList to an HTML element:
        // A button which triggers the showMovies function for each genre.
        let appDivs = appList.map((app, i) =>{
          
          let resultPrice = "";
          if (app.price == 0) {
              resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;Free&nbsp;&nbsp;</div>;
          } else {
              resultPrice = <div class="divs-inline text-lg text-medium text-muted">&nbsp;&nbsp;${app.price}&nbsp;&nbsp;</div>;
          }
          return(
          <tr>
              <td>
                  <div class="product-item">
                      <a class="product-thumb" href={"/app_detail/"+ encodeURIComponent(app.app_name)}><img src={app.icon} alt="Product"></img></a>
                      <div class="product-info">
                          <h4 class="product-title"><a href={"/app_detail/"+ encodeURIComponent(app.app_name)}>{app.app_name}</a></h4>
                          <div class="divs-inline"><Rate disabled defaultValue={0} value={app.rating} />&nbsp;&nbsp;&nbsp;{app.rating}</div>
                          &nbsp;&nbsp;{resultPrice}&nbsp;&nbsp;
                          {/* {resultGenre} */}
                          <div>{app.installs}+ installs</div>
                          <div dangerouslySetInnerHTML={{__html: app.summary}}></div>
                      </div>
                  </div>
              </td>
              <td class="text-center">
                  <a class="add-to-wishlist" href="" data-toggle="tooltip" title="" data-original-title="Remove item">
                      <i class="fa fa-plus-circle fa-2x" aria-hidden="true" onClick={() => this.addToWishListDashboard(app.app_name, this.state.email)}></i>
                  </a>
              </td>
          </tr>
          )
      });
        // console.log(appList);
        topInstalls = appDivs.slice(0,5)
        topRating = appDivs.slice(5,10)
        // Set the state of the genres list to the value returned by the HTTP response from the server.
        this.setState({
          topRatingApps: topRating,
          topInstallApps: topInstalls,
          apps: appDivs
        })
      })
      .catch(err => console.log(err))	// Print the error if there is one.
  }

  render() {  
  //   const data = [
  //     ['Stats', 'All Stats'],
  //     ['Submitted', submitted.length],
  //     ['Reviewed', 5],
  //     ['Approved', 3],
  //     ['Rejected', 2],
  // ];  
    return (
      
      <div className="Dashboard">

        <PageNavbar active="Categories" />

        <br></br>
        <div className="container movies-container">
          {/* <div className="jumbotron"> */}
            
            <div className="h5">Top Apps By Categories </div>
            <br></br>
            <div class = "row">
              <div class = "col-lg-3">
                <aside>
                  <div className="genres-container">
                    {/* {this.state.genres} */}
                    <Menu defaultSelectedKeys={['0']}>
                    {this.state.genres}
                    </Menu>                
                  </div>
                </aside>
              </div>
          
              
              {/* <div class="col-lg-9" style={{backgroundColor:"gainsboro"}}> */}
              <div class="col-lg-9">
                <div class="padding-top-2x mt-2 hidden-lg-up"></div>
                  <div class="table-responsive wishlist-table margin-bottom-none">
                    <table class="table">
                        <thead>
                            <tr>
                                <th>Category Statistics 📈</th>
                            </tr>
                        </thead>
                          
                     
                          <div id="block_container">
                          <div id="chart" style={{paddingTop: "1em" }}>
                          <Chart
                            
                            width={'300px'}
                            height={'210px'}
                            chartType="PieChart"
                            loader={<div>Loading Chart</div>}

                            data = {this.state.data_cate}
                            options={{
                              // title: 'Rating Distribution',
                              chartArea:{width:"90%",height:"90%"}
                            }}
                            rootProps={{ 'data-testid': '1' }}
                          /></div>
                          
                          <div id = "category_text">
                          <tbody>
                            {this.state.category_info}
                          </tbody>
                          </div>
                          </div>
                     
                      </table>
                    <table class="table">
                      <thead>
                          <tr>
                              <th>🏆 Top 5 Popular Apps (by installs)</th>
                          </tr>
                      </thead>
                      <tbody>
                          {this.state.topInstallApps}
                      </tbody>
                    </table>
                    <table class="table">
                      <thead>
                          <tr>
                              <th>🏆 Top 5 Rated Apps (by scores)</th>
                          </tr>
                      </thead>
                      <tbody>
                          {this.state.topRatingApps}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
              
             </div>
        {/* </div> */}
      </div>
    );
  }
}