import React from 'react';

export default class AppDetailCommentsRatingPic extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            emoji: ""
        };
    }

    componentDidMount() {
        let sentiment = this.props.sentiment;
        if (sentiment.toLowerCase() == 'positive') {
            this.setState({
                emoji: <span role="img" aria-label="thumb_up">👍</span>
            });
        } else if (sentiment.toLowerCase() == 'neutral') {
            this.setState({
                emoji: <span role="img" aria-label="straight_face">😐</span>
            });
        } else if (sentiment.toLowerCase() == 'negative') {
            this.setState({
                emoji: <span role="img" aria-label="thumb_down">👎</span>
            });
        }
    }

    render() {
        return (
            <span>{this.state.emoji}</span>
        );
    }
}