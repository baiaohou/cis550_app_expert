import React from 'react';
import { Input, Image } from 'antd';
import ReactDOM from 'react-dom';
import BingSearchResultList from './BingSearchResultList';
import { Constants } from './Constants';

const { Search } = Input;
const maxNumOfRes = 10;

export default class BingSearch extends React.Component {

    searchHandler = (value) => {
        if (value) {
            fetch(`https://api.bing.microsoft.com/v7.0/search?q=${encodeURIComponent(value)}&count=${maxNumOfRes}&offset=0&setLang=en`, {
                method: 'GET',
                headers: {
                    'Ocp-Apim-Subscription-Key': `${Constants.bing_api_key}`
                }
            })
                .then(res => res.json())
                .then(res => {
                    ReactDOM.render(<BingSearchResultList query_term={value} bing_res={res.webPages.value} maxNumOfRes={maxNumOfRes} />, document.getElementById('root'));
                })
                .catch(err => console.log(err));
        }
    }

    render() {
        return (
            <div>
                <Search style={{ width: 200}} placeholder="Bing Search" addonBefore={<Image width={32} height={32} src="/bing_button.png" alt="Bing Search"/>} allowClear size="middle" onSearch={this.searchHandler} />
            </div>
        )
    }
}