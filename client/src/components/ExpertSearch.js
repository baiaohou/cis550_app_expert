import React from 'react';
import { Input, Image } from 'antd';
import ReactDOM from 'react-dom';
import ExpertSearchResults from './ExpertSearchResults';

const { Search } = Input;

export default class ExpertSearch extends React.Component {

    searchHandler = (value) => {
        if (value) {
            ReactDOM.render(<ExpertSearchResults query_term={value} />, document.getElementById('root'));
        }
    }

    render() {
        return (
            <div>
                <Search style={{ width: 200}} placeholder="Search" addonBefore={<Image width={32} height={32} src="/new-icon6.png" alt="App Expert Search"/>} allowClear size="middle" onSearch={this.searchHandler} />
            </div>
        )
    }
}