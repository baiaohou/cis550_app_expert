import React from 'react';
import {
	BrowserRouter as Router,
	Route,
	Switch
} from 'react-router-dom';
import Dashboard from './Dashboard';
import Recommendations from './Recommendations';
import BestGenres from './BestGenres';
import AppDetail from './AppDetail';
import Login from './Login';
import LoginFailed from './LoginFailed';
import LoginReEnter from './LoginReEnter';
import Register from './Register';
import RegisterFailed from './RegisterFailed';
import ResetPassword from './ResetPassword';
import ResetPasswordFailed from './ResetPasswordFailed';
import Wishlist from './Wishlist';

export default class App extends React.Component {

	render() {
		return (
			<div className="App">
				<Router>
					<Switch>
						<Route
							exact
							path="/"
							render={() => (
								<Login />
							)}
						/>
						<Route
							exact
							path="/Login"
							render={() => (
								<Login />
							)}
						/>
						<Route
							exact
							path="/LoginFailed"
							render={() => (
								<LoginFailed />
							)}
						/>
						<Route
							exact
							path="/LoginReEnter"
							render={() => (
								<LoginReEnter />
							)}
						/>
						<Route
							exact
							path="/Register"
							render={() => (
								<Register />
							)}
						/>
						<Route
							exact
							path="/RegisterFailed"
							render={() => (
								<RegisterFailed />
							)}
						/>
						<Route
							exact
							path="/ResetPassword"
							render={() => (
								<ResetPassword />
							)}
						/>
						<Route
							exact
							path="/ResetPasswordFailed"
							render={() => (
								<ResetPasswordFailed />
							)}
						/>
						<Route
							exact
							path="/dashboard"
							render={() => (
								<Dashboard />
							)}
						/>
						<Route
							path="/recommendations"
							render={() => (
								<Recommendations />
							)}
						/>
						<Route
							path="/bestgenres"
							render={() => (
								<BestGenres />
							)}
						/>
						<Route
							path="/app_detail/:app_name"
							component={AppDetail}
						/>
						<Route
							path="/wishlist"
							component={Wishlist}
						/>
					</Switch>
				</Router>
			</div>
		);
	}
}