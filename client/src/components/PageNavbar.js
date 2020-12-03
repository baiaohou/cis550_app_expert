import React from 'react';
import BingSearch from './BingSearch';
import ExpertSearch from './ExpertSearch';
import '../style/PageNavbar.css';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class PageNavbar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			navDivs: []
		}
	}

	componentDidMount() {
		const pageList = ['Home', 'Top Apps', 'Search', 'My Wishlist', 'Recommendations', 'Following'];
		const urls = ['/home', '/dashboard', '/recommendations', '/wishlist', '/recommended', '/following'];

		let navbarDivs = pageList.map((page, i) => {
			if (this.props.active === page) {
				return (
					// <a className="nav-item nav-link active" key={i} href={"/" + page}>
					<a className="nav-item nav-link active" key={i} href={urls[i]}>
						{page.charAt(0).toUpperCase() + page.substring(1, page.length)}
					</a>
				)
			}
			else {
				return (
					// <a className="nav-item nav-link" key={i} href={"/" + page}>
					<a className="nav-item nav-link" key={i} href={urls[i]}>
						{page.charAt(0).toUpperCase() + page.substring(1, page.length)}
					</a>
				)
			}
		})

		this.setState({
			navDivs: navbarDivs
		});
	}

	render() {
		return (
			<div className="PageNavbar">
				<nav className="navbar navbar-expand-lg navbar-light bg-light">
					<span className="navbar-brand center"><b>🦧 AppExpert</b></span>
					<div className="collapse navbar-collapse" id="navbarNavAltMarkup">
						<div className="navbar-nav">
							{this.state.navDivs}
						</div>
					</div>
					<div className="search-bars">
						<div className="bing-search-bar"><ExpertSearch /></div>
						<div className="expert-search-bar"><BingSearch /></div>
					</div>
				</nav>
			</div>
		);
	}
}