import React from 'react';
import { Rate, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Constants } from './Constants';
import 'antd/dist/antd.css';

export default class AppDetailRating extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            rating: 0,
            reviews_count: 0
        }
    }

    componentWillReceiveProps(nextProps) {
        var original_rating = nextProps.rating;
        var original_reviews_count = nextProps.reviews_count;
        fetch(`${Constants.servaddr_prefix}/app_peer_rating?app_name=${encodeURIComponent(nextProps.app_name)}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(resList => {
                if (resList.length == 0) {
                    this.setState({
                        rating: original_rating,
                        reviews_count: original_reviews_count
                    });
                } else {
                    let adjusted_reviews_count = original_reviews_count + resList[0].rating_num;
                    let new_rating = (original_rating * original_reviews_count + resList[0].rating_sum) / adjusted_reviews_count;
                    this.setState({
                        rating: Math.floor(new_rating * 10) / 10,
                        reviews_count: adjusted_reviews_count
                    });
                }
            })
            .catch(err => console.log(err));
    }

    rateHandler = (value) => {
        message.success({
            content: `You rate ${value} on ${this.props.app_name}`,
            duration: 2
        });
        fetch(`${Constants.servaddr_prefix}/rating?email=${this.props.email}&app_name=${encodeURIComponent(this.props.app_name)}&rating=${value}`)
            .then(res => {
                var original_rating = this.props.rating;
                var original_reviews_count = this.props.reviews_count;
                fetch(`${Constants.servaddr_prefix}/app_peer_rating?app_name=${encodeURIComponent(this.props.app_name)}`, {
                    method: 'GET'
                })
                    .then(res => res.json())
                    .then(resList => {
                        if (resList.length == 0) {
                            this.setState({
                                rating: original_rating,
                                reviews_count: original_reviews_count
                            });
                        } else {
                            let adjusted_reviews_count = original_reviews_count + resList[0].rating_num;
                            let new_rating = (original_rating * original_reviews_count + resList[0].rating_sum) / adjusted_reviews_count;
                            this.setState({
                                rating: Math.floor(new_rating * 10) / 10,
                                reviews_count: adjusted_reviews_count
                            });
                        }
                    })
                    .catch(err => console.log(err));
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <span>
                <Rate allowHalf onChange={this.rateHandler} defaultValue={0} value={this.state.rating} />
                {this.state.rating ? <span className="ant-rate-text">{this.state.reviews_count}</span> : ''}
                <Avatar shape="square" size="small" icon={<UserOutlined />} />
            </span>
        );
    }
}