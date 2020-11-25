import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class RecommendationsRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="title">TITLE</div>
				<div className="id">ID</div>
				<div className="rating">RATING</div>
				<div className="votes">VOTE_COUNT</div>
			</div>
		);
	}
}
