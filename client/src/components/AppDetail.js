import React from 'react';
import { Avatar } from 'antd';
import { Image } from 'antd';
import { Descriptions } from 'antd';
import { Rate } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import AppDetailRating from './AppDetailRating';
import AppDetailScreenshots from './AppDetailScreenshots';
import 'antd/dist/antd.css';

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
    fetch(`http://localhost:8081/app_detail/${this.props.match.params.app_name}`, {
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
          category: thisAppDetail.category,
          rating: thisAppDetail.rating,
          reviews_count: thisAppDetail.reviews,
          size: thisAppDetail.size,
          installs: thisAppDetail.installs,
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
      .catch(err => console.log(err));
  }


  render() {
    return (
      <div className="app_detail_holder">

        {/* Header of the app detail */}
        <div className="app_detail_header">

          {/* App icon */}
          <Image width={200} src={this.state.icon} alt="Android Application" placeholder={
            <Image
              src="../default_app_icon.png"
              width={200}
            />
          } />

          {/* App brief description */}
          <Descriptions
            title={this.state.app_name}
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Category">{this.state.category}</Descriptions.Item>
            <Descriptions.Item label="Developer">{this.state.developer}</Descriptions.Item>
            <Descriptions.Item label="Price">{this.state.type == 'Free' ? "Free" : this.state.price}</Descriptions.Item>
            <Descriptions.Item label="rating">{<AppDetailRating rating={this.state.rating} reviews_count={this.state.reviews_count} />}</Descriptions.Item>
          </Descriptions>

          {/* Download button */}
          <a href={this.state.gp_url} target="_blank">
            <Image width={200} preview={false} src="../google-play.png" alt="Get it on Google Play" />
          </a>

        </div>

        <br></br>

        {/* Summary of the app */}
        <div className="app_summary">{this.state.summary}</div>

        <br></br>

        {/* Scrennshots of the app */}
        <AppDetailScreenshots package_name={this.state.package_name} />

      </div>
    );
  }
}