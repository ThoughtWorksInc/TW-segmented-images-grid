var React = require('react');
var ReactDOM = require('react-dom');
var sortable = require('./react-sortable-mixin');
var ItemView = React.createClass({
    getImageUrl: function(url){
        var domainName="";
        try{
            if(opensocial){
                domainName = opensocial.getEnvironment()['jiveUrl'];
            }
        }
        catch(err){};
        if(url.startsWith("/resources/statics/"))
            return domainName + url;
        else
            return url;
    },

    render: function () {
        var backgroundStyle = {
            background: "url('"+this.getImageUrl(this.props.item.imageURL)+"') center center #00BCCE"
        };
        return (<div className="b_col2 block">
            <div className="featured-items-item" style={backgroundStyle}>
                <a href={this.props.item.linkURL} target="_blank" className="dm-content">{this.props.item.linkTitle.toUpperCase()}</a>
                <div className="note">{this.props.item.note}</div>
            </div>
        </div>)
    }
});


var ItemsView = React.createClass({
    render: function () {
        return (<div className="block-group">
            {this.props.items.map(function (item,index) {
                return (<ItemView key={item.id} item={item} />)
            })}
        </div>)
    }
});

var MainView = React.createClass({
    getInitialState: function(){
        if(!this.props.configData.items) return {items: [], tileTitle: ""};
        return this.props.configData;
    },

    componentDidMount(){
        gadgets.window.adjustHeight();
    },

    render: function () {
        return (<div className="featured-items">
            <div className="title padding-to-bottom" style={{color:this.props.configData.color}}>{this.props.configData.tileTitle}</div>
            <ItemsView items={this.props.configData.items} />
        </div>);
    }
});

var initView = function(configData){
    ReactDOM.render(React.createElement(MainView, {configData: configData}), document.getElementById('view'));
};
window.initView = initView;
