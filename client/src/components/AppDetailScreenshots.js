import React from 'react';
import { Carousel } from 'antd';
import { Image } from 'antd';
import 'antd/dist/antd.css';
import { Constants } from './Constants';

export default class AppDetailScreenshots extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screenshots: []
        };
    }

    componentWillReceiveProps(nextProps) {
        fetch(`${Constants.servaddr_prefix}/app_detail/screenshot/${nextProps.package_name}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(scrennshot_urls => {
                if (!scrennshot_urls) {
                    return;
                }
                let urlList = scrennshot_urls.map((ele, i) => <div key={i}>
                    <h3 style={contentStyle}>
                        <Image src={ele} alt="Android Application" />
                    </h3>
                </div>);
                this.setState({
                    screenshots: urlList
                })
            })
            .catch(err => console.log(err));
    }



    render() {
        return (
            <Carousel autoplay>
                {this.state.screenshots}
            </Carousel>
        )
    }
}

const contentStyle = {
    height: '550px',
    color: '#fff',
    lineHeight: '550px',
    textAlign: 'center',
    background: "#E5E7E9"
};