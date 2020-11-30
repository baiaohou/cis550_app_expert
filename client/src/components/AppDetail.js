import React from 'react';
import { Divider, Image } from 'antd';
import { Descriptions } from 'antd';
import AppDetailRating from './AppDetailRating';
import AppDetailScreenshots from './AppDetailScreenshots';
import AppDetailComments from './AppDetailComments';
import AppDetailTitleBar from './AppDetailTitleBar';
import AppDetailDescription from './AppDetailDescription';
import AppDetailWishlistButton from './AppDetailWishlistButton';
import { Constants } from './Constants';
import { getCookie } from './Home';
import 'antd/dist/antd.css';
import '../style/AppDetail.css';
import PageNavbar from './PageNavbar';

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
    fetch(`${Constants.servaddr_prefix}/app_detail/${this.props.match.params.app_name}`, {
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
        this.setState({
          app_name: thisAppDetail.app_name,
          category: thisAppDetail.category.replace(/_/g, " "),
          rating: thisAppDetail.rating,
          reviews_count: thisAppDetail.reviews_count,
          size: thisAppDetail.size,
          installs: thisAppDetail.installs,
          type: thisAppDetail.type,
          price: thisAppDetail.price,
          content_rating: thisAppDetail.content_rating,
          // genres: thisAppDetail.genres,
          last_updated: thisAppDetail.last_updated,
          curr_ver: thisAppDetail.current_ver,
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
      .catch(err => console.log(err));
  }


  render() {
    return (
      <div> 
        <PageNavbar />
        <div className="app_detail_holder">

          {/* Header of the app detail */}
          <div className="app_detail_header">

            {/* App icon */}
            <div className="app-icon">
              <Image height={230} width={230} src={this.state.icon} alt="Android Application" placeholder={
                <Image
                  src="../default_app_icon.png"
                  height={200}
                  width={200}
                />
              } />
            </div>

            <div className="app_overview">
              {/* App brief description */}
              <Descriptions
                className="app-description"
                title={<h3>{this.state.app_name}</h3>}
                bordered
                // column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
              >
                
                <Descriptions.Item label="Category">{this.state.category}</Descriptions.Item>
                <Descriptions.Item label="Developer">{this.state.developer}</Descriptions.Item>
                <Descriptions.Item label="Price">{this.state.type == 'Free' ? "Free" : this.state.price}</Descriptions.Item>
                <Descriptions.Item label="Rating">{<AppDetailRating rating={this.state.rating}  reviews_count={this.state.reviews_count} />}</Descriptions.Item>
              </Descriptions>

              <br></br>

              {/* Actions */}
              <div className="user_actions">

                {/* Wishlist button */}
                <AppDetailWishlistButton app_name={this.state.app_name} email={getCookie("email")} />
                
                {/* Download button */}
                <div className="download-button">
                  <a href={this.state.gp_url} target="_blank">
                    <Image width={200} height={59} preview={false} src="../google-play.png" alt="Get it on Google Play" />
                  </a>
                </div>

              </div>
            </div>

          </div>

          {/* Divider line */}
          <Divider className="divider"></Divider>

          {/* Summary of the app */}
          <AppDetailTitleBar text="Summary" />
          <div className="app_summary">{this.state.summary}</div>
          <AppDetailDescription package_name={this.state.package_name} />

          <p></p><p></p>

          {/* Scrennshots of the app */}
          <AppDetailTitleBar text="Screenshots" />
          <AppDetailScreenshots package_name={this.state.package_name} />

          <p></p><p></p>

          {/* Comments of the app */}
          <AppDetailTitleBar text="Comments" />
          <AppDetailComments app_name={this.state.app_name} />
          <p></p><p></p><p></p><p></p><p></p>
        </div>
      </div>
    );
  }
}