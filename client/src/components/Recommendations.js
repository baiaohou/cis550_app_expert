import React from 'react';
import PageNavbar from './PageNavbar';
import RecommendationsRow from './RecommendationsRow';
import '../style/Recommendations.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, NavLink, Switch, Redirect } from "react-router-dom";
import { Constants } from './Constants';
import { Rate } from 'antd';

export default class Recommendations extends React.Component {
	constructor(props) {
		super(props);

		// State maintained by this React component is the selected movie name,
		// and the list of recommended movies.
		this.state = {
			appName: "",
			recApps: []
		}

		this.handleAppNameChange = this.handleAppNameChange.bind(this);
		this.submitApp = this.submitApp.bind(this);
	}

	handleAppNameChange(e) {
		this.setState({
			appName: e.target.value
		});
	}

	/* ---- Q2 (Recommendations) ---- */
	// Hint: Name of movie submitted is contained in `this.state.movieName`.
	submitApp() {
		fetch(`${Constants.servaddr_prefix}/recommendations/`+this.state.appName, {
			method: 'GET' // The type of HTTP request.
		})
		  
		.then(res => res.json()) // Convert the response data to a JSON.
		//   .then(text => console.log(text))
		.then(appList => {
			console.log(appList)
			if (!appList) return;
				// Map each genreObj in genreList to an HTML element:
			let appDivs = appList.map((app, i) =>
				<tr>
				<td>
					<div class="product-item">
						<a class="product-thumb" href={"/app_detail/"+app.app_name}><img src={app.icon} alt="Product"></img></a>
						<div class="product-info">
							<h4 class="product-title"><a href={"/app_detail/"+app.app_name}>{app.app_name}</a></h4>
							<div><Rate disabled defaultValue={0} value={app.rating} />&nbsp;{app.rating}</div>
							<div>{app.installs}+ installs</div>
							<div class="text-lg text-medium text-muted">${app.price}</div>
							<div class="text-lg text-medium">{app.summary}</div>
						</div>
					</div>
				</td>
				<td class="text-center"><a class="remove-from-cart" href="" data-toggle="tooltip" title="" data-original-title="Remove item"><i class="icon-cross"></i></a></td>
				</tr>
				);
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
			<div className="Recommendations">
				<PageNavbar active="Search" />

			    <div className="container recommendations-container">
			    	<div className="jumbotron">
			    		<div className="h5">Search and Recommendations </div>
			    		<br></br>
			    		<div className="input-container">
			    			<input type='text' placeholder="Enter App Name" value={this.state.appName} onChange={this.handleAppNameChange} id="appName" className="app-input"/>
			    			<button id="submitMovieBtn" className="submit-btn" onClick={this.submitApp}>Submit</button>
			    		</div>
			    		<div className="header-container">
			    			<div className="h6">You may like ...</div>
						<div class="col-lg-8">
							<div class="padding-top-2x mt-2 hidden-lg-up"></div>
							<div class="table-responsive wishlist-table margin-bottom-none">
							<table class="table">
								<tbody>
									{this.state.recApps}
								</tbody>
							</table>
							</div>
						</div>
			    		</div>
			    	</div>
			    </div>
		    </div>
		);
	}
}