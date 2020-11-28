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
                    let urlList = [<div>
                        <div style={contentStyle}>
                            <div style={style2}><Image width={512} height={512} src="../default_screenshot.png" alt="Android Application" /></div>
                        </div>
                    </div>];
                    this.setState({
                        screenshots: urlList
                    })
                    return;
                }
                let urlList = scrennshot_urls.map((ele, i) => <div key={i}>
                    <div style={contentStyle}>
                        <div style={style2}>
                            <Image src={ele} alt="Android Application" placeholder={
                                <Image
                                    src="../default_screenshot.png"
                                />} />
                        </div>
                    </div>
                </div>);
                this.setState({
                    screenshots: urlList
                })
            })
            .catch(err => console.log(err));
    }



    render() {
        return (
            <Carousel autoplay >
                {this.state.screenshots}
            </Carousel>
        )
    }
}

const contentStyle = {
    height: '560px',
    width: "560px",
    color: '#fff',
    lineHeight: '560px',
    textAlign: 'center',
    background: "#E5E7E9",
    // width: "fit-content",
    // width: "50",
    margin: "auto",
    "border-radius": "15px"
};

const style2 = {
    "padding-top": "2%",
}