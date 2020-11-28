import React from 'react';
import { Constants } from './Constants';

export default class AppDetailDescription extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            description: ""
        }
    }

    componentWillReceiveProps(nextProps) {
        fetch(`${Constants.servaddr_prefix}/app_detail/description/${nextProps.package_name}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(res => {
                this.setState({
                    description: "<br>" + res
                })
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            <div dangerouslySetInnerHTML={{__html: this.state.description}}></div>
        );
    }
}