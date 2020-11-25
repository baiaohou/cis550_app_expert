import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default class BestGenreRow extends React.Component {
	constructor(props) {
		super(props);
	}

	render() {
		return (
			<div className="movieResults">
				<div className="genre">GENRE</div>
				<div className="rating">AVERAGE RATING</div>
			</div>
		);
	}
}
