import React from 'react';
import { Input, Image } from 'antd';
import ReactDOM from 'react-dom';
import ExpertSearchResults from './ExpertSearchResults';

const { Search } = Input;

export default class ExpertSearch extends React.Component {

    //此乃用户按下搜索键或者回车时的回调函数
    searchHandler = (value) => {
        if (value) {
            //这里通过query_term把用户输入的内容传给了ExpertSearchResults这个component
            //在ExpertSearchResults这个component中用 this.props.query_term接受
            ReactDOM.render(<ExpertSearchResults query_term={value} />, document.getElementById('root'));
        }
    }

    render() {
        return (
            <div>
                <Search style={{ width: 200}} placeholder="App Expert Search" addonBefore={<Image width={32} height={32} src="/new-icon6.png" alt="App Expert Search"/>} allowClear size="middle" onSearch={this.searchHandler} />
            </div>
        )
    }
}