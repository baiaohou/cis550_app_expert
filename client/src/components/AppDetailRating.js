import React from 'react';
import { Rate } from 'antd';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import 'antd/dist/antd.css';

export default class AppDetailRating extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <span>
                <Rate allowHalf disabled defaultValue={0} value={this.props.rating} />
                {this.props.rating ? <span className="ant-rate-text">{this.props.reviews_count}</span> : ''}
                <Avatar shape="square" size="small" icon={<UserOutlined />} />
            </span>
        );
    }
}