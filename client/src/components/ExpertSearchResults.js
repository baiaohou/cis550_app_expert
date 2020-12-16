import React from 'react';
import { Button } from 'antd';
import { Constants } from './Constants';
import PageNavbar from './PageNavbar';
import { Rate } from 'antd';
import { getCookie } from './Home';

export default class ExpertSearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
			appName: this.props.query_term,
            recApps: [],
            topApps:[],
            userName: getCookie("first_name") + " " + getCookie("last_name"), // e.g. Zimao Wang
            email: getCookie("email"), // e.g. "zimaow@gmail.com",
            
        }
        
        // this.submitApp = this.submitApp.bind(this);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.componentWillReceiveProps = this.componentWillReceiveProps.bind(this)
        this.onLoadMore = this.onLoadMore.bind(this);
        this.addToWishListSearch = this.addToWishListSearch.bind(this);
    }

    componentDidMount() {
        this.setState({                  
            appName: this.props.query_term,
            email: getCookie("email")
        })

        fetch(`${Constants.servaddr_prefix}/recommendations/`+this.props.query_term, {
			method: 'GET' // The type of HTTP request.
		})
		  
		.then(res => res.json()) // Convert the response data to a JSON.
		//   .then(text => console.log(text))
		.then(appList => {
            console.log(appList)
            // topDivs = []
			if (!appList) return;
                // Map each genreObj in genreList to an HTML element:
            let topDivs = []
            
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
                    {/* <td class="text-center">
                        <SearchButton app_name={app.app_name} email={this.state.email} />
                    </td> */}
                </tr>
                )
            });
                console.log(appDivs)
                
                // topDivs = [];
                // topDivs = appDivs.slice(0,5)
				// Set the state of the genres list to the value returned by the HTTP response from the server.
				this.setState({
                    
                    recApps: appDivs.slice(0,5)
                    
				})
		})
		.catch(err => console.log(err))	// Print the error if there is one.
    }

    addToWishListSearch(appName, email) {
        fetch(`${Constants.servaddr_prefix}/addToWishList?appName=`+encodeURIComponent(appName)+"&email="+email, {
          method: 'GET' // The type of HTTP request.
        })
          .then(res => res.json()) // Convert the response data to a JSON.
          .catch(err => console.log(err))	// Print the error if there is one.
        //   .then(window.navigate(`${Constants.frontend_prefix}/recommanded`,'_self'))
        
    }

    componentWillReceiveProps(nextProps) {
        this.setState({                  
            appName: nextProps.query_term
        })
        fetch(`${Constants.servaddr_prefix}/recommendations/`+this.state.appName, {
			method: 'GET' // The type of HTTP request.
		})
		  
		.then(res => res.json()) // Convert the response data to a JSON.
		//   .then(text => console.log(text))
		.then(appList => {
            console.log(appList)
            // topDivs = []
			if (!appList) return;
                // Map each genreObj in genreList to an HTML element:
            let topDivs = []
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
                    {/* <td class="text-center">
                        <AppDetailWishlistButton app_name={app.app_name} email={this.state.email} />
                    </td> */}
                </tr>
                )
            });
				console.log(appDivs)
                // topDivs = [];
                
				// Set the state of the genres list to the value returned by the HTTP response from the server.
				this.setState({    
                    recApps: appDivs.slice(0,5)
				})
		})
		.catch(err => console.log(err))	// Print the error if there is one.
    }


    onLoadMore() {
        fetch(`${Constants.servaddr_prefix}/recommendations/`+this.state.appName, {
			method: 'GET' // The type of HTTP request.
		})
		  
		.then(res => res.json()) // Convert the response data to a JSON.
		//   .then(text => console.log(text))
		.then(appList => {
			console.log(appList)
			if (!appList) return;
				// Map each genreObj in genreList to an HTML element:
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
                        {/* <td class="text-center">
                            <AppDetailWishlistButton app_name={app.app_name} email={this.state.email} />
                        </td> */}
                    </tr>
                    )
                });
				console.log(appDivs);

				// Set the state of the genres list to the value returned by the HTTP response from the server.
				this.setState({
                    
                    recApps: appDivs
                    
				})
		})
		.catch(err => console.log(err))	// Print the error if there is one.
    }
    

    render() {
        return (
            <div>
                <PageNavbar />

                <div className="container recommendations-container">
			    	{/* <div className="jumbotron"> */}
                    <br></br>
                    <div class="col-lg-12">
			    		<div class="row">
                            <div class="col-lg-6"><div className="h6">Are these apps you want to search for? Click load more or search again!</div></div>
                            <div class="col-lg-3"><Button onClick={this.onLoadMore}>load more</Button></div>
                        </div>
                    </div>
						<div class="col-lg-12">
							<div class="padding-top-2x mt-2 hidden-lg-up"></div>
							<div class="table-responsive wishlist-table margin-bottom-none">
							<table class="table">
								<tbody>
									{this.state.recApps}
								</tbody>
							</table>
							</div>
						</div>
			    		{/* </div> */}
			    	{/* </div> */}
			    </div>
            </div>
        )
    }
}