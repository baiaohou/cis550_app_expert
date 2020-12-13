import React from 'react';
import { List, Button, Skeleton } from 'antd';
import { Constants } from './Constants';
import PageNavbar from './PageNavbar';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
import { Rate } from 'antd';
import { getCookie } from './Home';
import AppDetailWishlistButton from './AppDetailWishlistButton';
import SearchButton from './SearchButton';

// var pageSize = 10;
// var currPage = 0;
// var term = "Android Apps";

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
        // 这个是此组件第一次渲染到网页上的回调
        // 可通过 this.props.query_term接收ExpertSearch传来的参数
        // do something, like setState
        // this.setState({
		// 	appName: this.props.query_term
        // });
        // this.componentWillReceiveProps(this.props)

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
                    <td class="text-center">
                        <SearchButton app_name={app.app_name} email={this.state.email} />
                    </td>
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
                    <td class="text-center">
                        <AppDetailWishlistButton app_name={app.app_name} email={this.state.email} />
                    </td>
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
                        <td class="text-center">
                            <AppDetailWishlistButton app_name={app.app_name} email={this.state.email} />
                        </td>
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


/* 下面的是我的Bing Search result list的源码，可以实现分页load more的功能，可参考之 */
    // constructor(props) {
    //     super(props);

    //     this.state = {
    //         initLoading: true,
    //         loading: false,
    //         data: [],
    //         list: [],
    //     };
    // }

    // componentDidMount() {
    //     pageSize = this.props.maxNumOfRes;
    //     term = this.props.query_term;
    //     this.setState({
    //         initLoading: false,
    //         data: this.props.bing_res,
    //         list: this.props.bing_res
    //     })
    // }

    // componentDidUpdate(prevProps) {
    //     if (this.props.query_term != prevProps.query_term) {
    //         pageSize = this.props.maxNumOfRes;
    //         term = this.props.query_term;
    //         this.setState({
    //             initLoading: false,
    //             data: this.props.bing_res,
    //             list: this.props.bing_res
    //         })
    //     }
    // }

    // getData = callback => {
    //     fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(term)}&count=${pageSize}&offset=${currPage * pageSize}&setLang=en`, {
    //         method: 'GET',
    //         headers: {
    //             'Ocp-Apim-Subscription-Key': `${Constants.bing_api_key}`
    //         }
    //     })
    //         .then(res => res.json())
    //         .then(res => {
    //             callback(res.webPages.value)
    //         })
    //         .catch(err => console.log(err));
    // };

    // onLoadMore = () => {
    //     currPage++;
    //     this.setState({
    //         loading: true,
    //         list: this.state.data.concat([...new Array(pageSize)].map(() => ({ loading: true, name: "" }))),
    //     });
    //     this.getData(res => {
    //         const data = this.state.data.concat(res);
    //         this.setState(
    //             {
    //                 data,
    //                 list: data,
    //                 loading: false,
    //             },
    //             () => {
    //                 // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
    //                 // In real scene, you can using public method of react-virtualized:
    //                 // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
    //                 window.dispatchEvent(new Event('resize'));
    //             },
    //         );
    //     });
    // };

    // render() {
    //     const { initLoading, loading, list } = this.state;
    //     const loadMore =
    //         !initLoading && !loading ? (
    //             <div
    //                 style={{
    //                     textAlign: 'center',
    //                     marginTop: 12,
    //                     height: 32,
    //                     lineHeight: '32px',
    //                 }}
    //             >
    //                 <Button onClick={this.onLoadMore}>loading more</Button>
    //             </div>
    //         ) : null;

    //     return (
    //         <div>
    //             <PageNavbar />
    //             <div className="bing_result_page">
    //                 <List
    //                     className="bing_result_list"
    //                     loading={initLoading}
    //                     itemLayout="horizontal"
    //                     loadMore={loadMore}
    //                     dataSource={list}
    //                     renderItem={item => (
    //                         <List.Item>
    //                             <Skeleton title={false} loading={item.loading} active>
    //                                 <div>
    //                                     <h4><a href={item.url} target="_blank">{decodeURIComponent(item.name)}</a></h4>
    //                                     <p>{decodeURIComponent(item.snippet)}</p>
    //                                     <div><a href={item.url} target="_blank" className="bing_display_url">{item.displayUrl}</a></div>
    //                                 </div>
    //                             </Skeleton>
    //                         </List.Item>
    //                     )}
    //                 />
    //             </div>
    //         </div>
    //     );
    // }
}