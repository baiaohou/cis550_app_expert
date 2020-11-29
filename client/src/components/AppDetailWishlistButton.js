import React from 'react';
import { Constants } from './Constants';
import { getCookie } from './Home';
import { Switch } from 'antd';

var app_name_to_fav;

export default class AppDetailWishlistButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            button: ""
        }
    }

    componentWillReceiveProps(nextProps) {
        app_name_to_fav = nextProps.app_name;
        fetch(`${Constants.servaddr_prefix}/isInWishList?email=${nextProps.email}&appName=${nextProps.app_name}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(res => {
                if (res.length == 0) {
                    this.setState({
                        button: <Switch
                            checkedChildren="In Wishlist"
                            unCheckedChildren="Not In Wishlist"
                            onChange={onChange}
                        />
                    })
                } else {
                    this.setState({
                        button: <Switch
                            checkedChildren="In Wishlist"
                            unCheckedChildren="Not In Wishlist"
                            defaultChecked
                            onChange={onChange}
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

function onChange(checked) {
    fetch(`${Constants.servaddr_prefix}/addToWishList?email=${getCookie("email")}&appName=${app_name_to_fav}`, {
        method: 'GET'
    })
        .then(res => res.json())
        .catch(err => console.log(err));
}