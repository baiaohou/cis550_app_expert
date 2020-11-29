import React from 'react';
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
        // look up in db to determine whether nextProps.user has nextProps.app_name in his wishlist
        var list = [];
        if (list.length == 0) {
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
    if (checked) {
        // add it to db
        console.log("add" + app_name_to_fav);
    } else {
        // delete it from db
        console.log("delete" + app_name_to_fav);
    }
}