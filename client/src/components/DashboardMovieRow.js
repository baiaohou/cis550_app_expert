import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css'

export default class DashboardMovieRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movie">
				<div className="App">App</div>
				<div className="Rating">Rating</div>
				<div className="Installs">Installs</div>
			</div>
		);
	}
}
