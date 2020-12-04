import React from 'react';
import AppDetailTitleBar from './AppDetailTitleBar';
import { Constants } from './Constants';
import '../style/AppDetailVideo.css';

export default class AppDetailVideo extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            videoUrl: ""
        };
    }

    componentWillReceiveProps(nextProps) {
        fetch(`${Constants.servaddr_prefix}/video/${nextProps.package_name}`, {
            method: 'GET'
        })
            .then(res => res.json())
            .then(res => {
                if (res.video) {
                    this.setState({
                        videoUrl: res.video
                    })
                }
            })
            .catch(err => console.log(err));
    }

    render() {
        return (
            this.state.videoUrl ?
                <div className="app_detail_video_holder">
                    <AppDetailTitleBar text="Video" />
                    <div className="app_detail_video" >
                        <iframe width="840" height="473" src={this.state.videoUrl} frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                        {/* <iframe width="840" height="473" src="https://www.youtube.com/embed/Qi8jrtmUtJA?ps=play&vq=large&rel=0&autohide=1&showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe> */}
                    </div>
                </div> :
                <div></div>
        )
    }
}