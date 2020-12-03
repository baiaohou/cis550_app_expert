import React from 'react';
import { Rate, Avatar, message } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Constants } from './Constants';
import 'antd/dist/antd.css';

export default class AppDetailRating extends React.Component {
    constructor(props) {
        super(props);
    }

    rateHandler = (value) => {
        message.success({
            content: `You rate ${value} on ${this.props.app_name}`,
            duration: 2
        });
        fetch(`${Constants.servaddr_prefix}/rating?email=${this.props.email}&app_name=${encodeURIComponent(this.props.app_name)}&rating=${value}`)
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    render() {
        return (
            <span>
                <Rate allowHalf onChange={this.rateHandler} defaultValue={0} value={this.props.rating} />
                {this.props.rating ? <span className="ant-rate-text">{this.props.reviews_count}</span> : ''}
                <Avatar shape="square" size="small" icon={<UserOutlined />} />
            </span>
        );
    }
}