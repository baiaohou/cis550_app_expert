import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="title">App</div>
				<div className="rating">Rating</div>
				<div className="votes">Installs</div>
			</div>
		);
	}
}
