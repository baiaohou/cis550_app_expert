import React from 'react';

export default class AppDetail extends React.Component {
    constructor(props) {
        super(props);

        // state maintained by app detail page, which is actually the detail itself
        this.state = {
            app_name: "",
            category: "",
            rating: 0.0,
            reviews_count: 0,
            size: "",
            installs: 0,
            type: "",
            price: 0.0,
            content_rating: "",
            genres: "",
            last_updated: "",
            curr_ver: "",
            android_ver: "",
            package_name: "",
            icon: "",
            gp_url: "",
            developer: "",
            developer_id: "",
            summary: "",
            title: "",
            reviews: []
        };
    }

    componentDidMount() {
        fetch(`http://localhost:8081/app_detail/${this.props.app_name}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(appList => {
            if (!appList) {
                console.log('No such application exists!');
                return;
            }
            // app name is the primary key of the APP_DETAIL table, which should be unique
            let thisAppDetail = appList[0];
            console.log(thisAppDetail);
            this.setState({
                app_name: thisAppDetail.app_name,
                category: thisAppDetail.category,
                rating: thisAppDetail.rating,
                reviews_count: thisAppDetail.reviews,
                size: thisAppDetail.size,
                installs: thisAppDetail.size,
                type: thisAppDetail.type,
                price: thisAppDetail.price,
                content_rating: thisAppDetail.content_rating,
                genres: thisAppDetail.genres,
                last_updated: thisAppDetail.ast_updated,
                curr_ver: thisAppDetail.curr_ver,
                android_ver: thisAppDetail.android_ver,
                package_name: thisAppDetail.package_name,
                icon: thisAppDetail.icon,
                gp_url: thisAppDetail.gp_url,
                developer: thisAppDetail.developer,
                developer_id: thisAppDetail.developer_id,
                summary: thisAppDetail.summary,
                title: thisAppDetail.title,
                reviews: []
            })
        })
    }


    render() {    
        return (
          <div className="app_detail_holder">

            <div className="app_detail_header">
              <img src={this.state.icon} alt={this.state.app_name} />
              <div className="app_name">{this.state.app_name}</div>
              <a href={this.state.gp_url} target="_blank">
                <img src="google-play.png" alt="Get it on Google Play"/>
              </a>
              <div className="app_developer">{this.state.developer}</div>
              <div className="app_category">{this.state.category}</div>
              <div className="app_rating">{this.state.rating}</div>
              <div className="reviews_count">{this.state.reviews_count}</div>
            </div>

            <br></br>

            <div className="app_summary">{this.state.summary}</div>


          </div>
        );
      }
}