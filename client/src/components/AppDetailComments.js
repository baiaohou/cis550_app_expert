import React from 'react';
import { List, Avatar, Button, Skeleton } from 'antd';
import AppDetailCommentsRatingPic from './AppDetailCommentsRatingPic';
import { UserOutlined } from '@ant-design/icons';
import { Constants } from './Constants';

const pageSize = 3;
var currPage = 1;

var app_to_comment = "";

export default class AppDetailComments extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            initLoading: true,
            loading: false,
            data: [],
            list: [],
        };
    }

    componentWillReceiveProps(nextProps) {
        app_to_comment = encodeURIComponent(nextProps.app_name);
        this.getData(res => {
            this.setState({
                initLoading: false,
                data: res,
                list: res,
            });
        });
    }

    getData = callback => {
        fetch(`${Constants.servaddr_prefix}/app_comments?app_name=${app_to_comment}&curr_page=${currPage}&page_size=${pageSize}`, {
            method: 'GET'
        })
        .then(res => res.json())
        .then(queryRes => {
            callback(queryRes);
        })
        .catch(err => console.log(err));
    };

    onLoadMore = () => {
        currPage++;
        this.setState({
            loading: true,
            list: this.state.data.concat([...new Array(pageSize)].map(() => ({ loading: true, name: "" }))),
        });
        this.getData(res => {
            const data = this.state.data.concat(res);
            this.setState(
                {
                    data,
                    list: data,
                    loading: false,
                },
                () => {
                    // Resetting window's offsetTop so as to display react-virtualized demo underfloor.
                    // In real scene, you can using public method of react-virtualized:
                    // https://stackoverflow.com/questions/46700726/how-to-use-public-method-updateposition-of-react-virtualized
                    window.dispatchEvent(new Event('resize'));
                },
            );
        });
    };

    render() {
        const { initLoading, loading, list } = this.state;
        const loadMore =
            !initLoading && !loading ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 12,
                        height: 32,
                        lineHeight: '32px',
                    }}
                >
                    <Button onClick={this.onLoadMore}>loading more</Button>
                </div>
            ) : null;

        return (
            <List
                className="comment-list"
                loading={initLoading}
                itemLayout="horizontal"
                loadMore={loadMore}
                dataSource={list}
                renderItem={item => (
                    <List.Item>
                        <Skeleton avatar title={false} loading={item.loading} active>
                            <List.Item.Meta
                                avatar={
                                    <Avatar size="small" icon={<UserOutlined />} />
                                }
                                title={<div>Anonymous User: {<AppDetailCommentsRatingPic sentiment={item.sentiment} />}</div>}
                                description={item.review_content}
                            />
                        </Skeleton>
                    </List.Item>
                )}
            />
        );
    }
}