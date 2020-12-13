import React from 'react';
import { Constants } from './Constants';
import { getCookie } from './Home';
import { Switch } from 'antd';

export default class AppDetailWishlistButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            button: ""
        }
    }

    onSwitchChange= (checked) => {
        fetch(`${Constants.servaddr_prefix}/addToWishList?email=${getCookie("email")}&appName=${encodeURIComponent(this.props.app_name)}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .catch(err => console.log(err));
    }

    componentWillReceiveProps(nextProps) {
        fetch(`${Constants.servaddr_prefix}/isInWishList?email=${nextProps.email}&appName=${encodeURIComponent(nextProps.app_name)}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(res => {
                if (res.length == 0) {
                    this.setState({
                        button: <Switch
                            checkedChildren="In Wishlist"
                            unCheckedChildren="Not In Wishlist"
                            onChange={this.onSwitchChange}
                        />
                    })
                } else {
                    this.setState({
                        button: <Switch
                            checkedChildren="In Wishlist"
                            unCheckedChildren="Not In Wishlist"
                            defaultChecked
                            onChange={this.onSwitchChange}
                        />
                    })
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div className="wishlist-button">
                {this.state.button}
            </div>
        )
    }
}