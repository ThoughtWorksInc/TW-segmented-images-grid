"use strict";

var MAX_ITEMS_LIMIT = 30;
var React = require('react');
var ReactDOM = require('react-dom');
var sortable = require('./react-sortable-mixin');

var validUrl = function(url){
    var reg = /^(http(s)?:\/\/)?(www\.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/;

    if(url){
        return reg.test(url);
    }
    return false;
};

var Title = React.createClass({
    render: function () {
        return (<div className="item-container bg-color-gray margin-top-xl">
            <h2 className="title">Title
                <span className="required-mark"></span>
            </h2>
            <input type="text" placeholder="Max 90 Char" value={this.props.val} onChange={this.props.onSaveTitle}></input>
        </div>);
    }
});

var Header = React.createClass({
    render: function () {
        return (<div className="row margin-bottom-sm  margin-top-lg">
            <div className="col-3">
                <h2 className="title">Image Url
                    <span className="required-mark"></span>
                </h2>
            </div>
            <div className="col-3">
                <h2 className="title">Link Text
                    <span className="required-mark"></span>
                </h2>
            </div>
            <div className="col-3">
                <h2 className="title">Link Url
                    <span className="required-mark"></span>
                </h2>
            </div>
            <div className="col-3">
                <h2 className="title">Description Text
                    <span className="required-mark"></span>
                </h2>
            </div>
        </div>)
    }
});

var Item = React.createClass({
    mixins: [sortable.ItemMixin],
    itemOptions:{
        handle: "ItemHandle",
        placeholder: "dashed"
    },
    onChange: function(value, type) {
        var item = this.props.itemVal;
        item[type] = value;
        this.setState(item);
    },
    onChangeImageURL: function (e) {
        var imageURL = e.target.value;
        this.onChange(imageURL, "imageURL");
    },

    onChangeLinkTitle: function (e) {
        var linkTitle = e.target.value.slice(0, 50);
        this.onChange(linkTitle, "linkTitle");
    },

    onChangeLinkURL: function (e) {
        var linkURL = e.target.value;
        this.onChange(linkURL, "linkURL");
    },

    onChangeNote: function (e) {
        var note = e.target.value.slice(0, 80);
        this.onChange(note, "note");
    },

    removeDataItem: function () {
        var item = this.props.itemVal;
        var currentState = this.props.currentState;
        currentState.items = currentState.items.filter(function (key) {
            return key.id != item.id;
        });
        this.props.changeState(currentState);
        gadgets.window.adjustHeight();
    },

    checkEmptyValidations: function (url) {
        if(url.length == 0 && this.props.currentState.validation)
            return (<RequiredValidation />);
    },

    checkURLValidations: function (url) {
        if(this.props.currentState.validation && !validUrl(url))
            return (<UrlValidation />);
    },

    componentDidMount: function(){
        var node = $(ReactDOM.findDOMNode(this));
        var id = node.data("docid");
        node.draggable({containment: "parent",
            cursor: "move",
            opacity: 0.8,
            helper: "clone",
            axis: "y",
            start: function(){
                this.props.setDroppedId(null);
                this.props.setDraggedId(id);
            }.bind(this),
            stop: function(e, ui){
                var node = $(e["target"]);
                node.css("top", "0px");
                node.css("left", "0px");
            }});

        node.droppable({drop: function(){
            this.props.setDroppedId(id);
            this.props.reorderItems();
        }.bind(this)});
        gadgets.window.adjustHeight();
    },

    render:function(){
        var imageURLValidation = this.checkEmptyValidations(this.props.itemVal.imageURL) || this.checkURLValidations(this.props.itemVal.imageURL);
        var linkTitleValidation = this.checkEmptyValidations(this.props.itemVal.linkTitle);
        var linkURLValidation = this.checkEmptyValidations(this.props.itemVal.linkURL) || this.checkURLValidations(this.props.itemVal.linkURL);
        var noteValidation = this.checkEmptyValidations(this.props.itemVal.note);

        return (<div className="row margin-bottom-sm" data-docid={this.props.itemVal.id}>
            <i className="fa fa-ellipsis-v dragable-icon" ref="ItemHandle"></i>
            <div className="col-3">
                <input type="text" placeholder="http://image" onChange={this.onChangeImageURL} value={this.props.itemVal.imageURL} />
                {imageURLValidation}
            </div>
            <div className="col-3">
                <input type="text" placeholder="Max 50 Characters" value={this.props.itemVal.linkTitle} onChange={this.onChangeLinkTitle} />
                {linkTitleValidation}
            </div>
            <div className="col-3">
                <input type="text" value={this.props.itemVal.linkURL} placeholder="http://link" onChange={this.onChangeLinkURL} />
                {linkURLValidation}
            </div>
            <div className="col-3">
                <div className="margin-right-lg">
                    <input type="text" value={this.props.itemVal.note} placeholder="Max 80 Characters" onChange={this.onChangeNote} />
                    {noteValidation}
                </div>
                {this.props.currentState.items.length === 1 ? null : <i className="fa fa-trash fa-lg trash-icon" onClick={this.removeDataItem}></i>}
            </div>
        </div>);
    }
});

var Items = React.createClass({
    mixins: [sortable.ListMixin],
    listOptions:{
        resortFuncName: "reorderItems",
        left : 0,
        side : "y",
        restrict : "parent",
        model: "item"
    },
    setDraggedId: function(id){
        this.setState({dragged_id: id});
    },
    setDroppedId: function(id){
        this.setState({dropped_id: id});
    },

    getItem: function(id){
        return _.find(this.props.currentState.items, function(item){
            return item.id === id;
        });
    },

    reorderItems: function(sourceIdx,targetIdx){
        var tmp = this.props.currentState.items[sourceIdx];
        this.props.currentState.items.splice(sourceIdx, 1);
        this.props.currentState.items.splice(targetIdx, 0, tmp);
        this.props.currentState.items.map(function(item, idx){
            this.props.currentState.items[idx].order = idx + 1;
        }.bind(this));
        this.setState({"items": this.props.currentState.items});
    },

    render: function () {
        var that = this;
        return (<div className="row margin-bottom-sm">
            <div>
                {that.props.items.map(function(item,idx){
                    return (<Item
                        reorderItems={this.reorderItems}
                        setDraggedId={this.setDraggedId}
                        setDroppedId={this.setDroppedId}
                        key={idx}
                        index={idx}
                        itemVal={item}
                        changeState={that.props.changeState}
                        currentState={that.props.currentState}
                        {...this.movableProps}/>);
                }.bind(this))}
            </div>
        </div>)
    }

});

var AddItem = React.createClass({
    addItem: function () {
        var newItem = {id: this.getNextId(), imageURL: '', linkTitle: '', linkURL: '', note: ''};
        var currentState = this.props.currentState;
        currentState.validation = false;
        currentState.items.push(newItem);
        this.props.changeState(currentState);
        gadgets.window.adjustHeight();

    },

    getNextId: function(){
        if(this.props.currentState.items.length == 0)
            return 1;
        else{
            var maxId = _.reduce(this.props.currentState.items, function(max, n){
                if (max.id > n.id)
                    return max;
                else
                    return n;
            });
        }
        return maxId.id + 1;
    },

    render: function () {
        var message = (this.props.currentState.items.length < MAX_ITEMS_LIMIT) ? "(You can add a maximum of 30 items)" :"(You have added maximum number of items.)";
        return (<div className="margin-top-md">
                <a className={(this.props.currentState.items.length >= MAX_ITEMS_LIMIT) ? "add-button disabled": "add-button"} href="#" onClick={this.addItem}>+ Add</a>
                <span className="hint">{message}</span>
            </div>);
    }
});

var ApplyChanges = React.createClass({
    cancelClickHandler: function () {
        jive.tile.close();
    },

    render: function () {
        return (<div className="margin-top-lg">
            <a href="#" className="btn btn-primary" onClick={this.props.clickHandler}>Apply</a>
            <a href="#" className="btn btn-secondary margin-left-md" onClick={this.cancelClickHandler}>Cancel</a>
        </div>)
    }
});

var RequiredValidation = React.createClass({
    render: function(){
        return (
            <div className="inline-error-message">Required</div>
        );
    }
});

var UrlValidation = React.createClass({
    render: function(){
        return (
            <div className="inline-error-message">Invalid Url</div>
        );
    }
});

var ColorPicker = React.createClass({

  selectColor : function (e) {
    const unSelectedColors = $('.color-palette-item').filter(function () {
      return $(e.target).attr("class") != $(this).attr("class");
    });
    unSelectedColors.removeClass("selected");
    $(e.target).addClass("selected");
    const state = this.props.state;
    state.color = $(e.target).css('backgroundColor');
    this.props.updateState(state);
  },

  render: function () {
    return (<div>
        <div className="horizontal-line"></div>
        <h2 className="margin-top-md">
            Please pick a color for the tile title.
        </h2>
        <div className="margin-top-sm">
            <div className="color-palette-item bg-color-black " onClick={this.selectColor}></div>
            <div className="color-palette-item bg-color-brown" onClick={this.selectColor}></div>
            <div className="color-palette-item bg-color-blue" onClick={this.selectColor}></div>
            <div className="color-palette-item bg-color-purple" onClick={this.selectColor}></div>
            <div className="color-palette-item bg-color-rhodo" onClick={this.selectColor}></div>
            <div className="color-palette-item bg-color-red " onClick={this.selectColor}></div>
            <div className="color-palette-item bg-color-orange" onClick={this.selectColor}></div>
            <div className="color-palette-item bg-color-pink" onClick={this.selectColor}></div>
            <div className="color-palette-item bg-color-green" onClick={this.selectColor}></div>
        </div>
    </div>);
  }
});

var MainView = React.createClass({
    getInitialState: function() {
        if(this.props.configData.items){
            this.props.configData.validation = false;
            return this.props.configData;
        }
        return {items: [{id:1, imageURL:'',linkTitle:'',linkURL:'',note:''}],tileTitle:'', validation:false};
    },

    saveTitle: function (e) {
        this.state.tileTitle = e.target.value.slice(0,90);
        this.setState(this.state)
    },

    changeMainState:function(state){
        this.setState(state);
    },

    hasPrefix: function(url){
        return /^(http|https):\/\//.test(url);
    },

    checkEmptyValidations: function (item) {
        return (item.imageURL.length == 0 || item.linkURL.length == 0 || item.linkTitle.length == 0 || item.note.length == 0 );
    },

    checkURLValidations: function (item) {
        return (!validUrl(item.imageURL) || !validUrl(item.linkURL));
    },

    isValid: function () {
        var dataItems = this.state.items;
        var invalidItems = dataItems.filter(function (item) {
            return (this.checkURLValidations(item) || this.checkEmptyValidations(item))
        }.bind(this));
        return invalidItems.length == 0;
    },

    appendPrefixes: function(){
        _.map(this.state.items, function(item){
            if(!this.hasPrefix(item.linkURL)){
                item.linkURL = "http://".concat(item.linkURL);
            }
            if(!this.hasPrefix(item.imageURL)){
                item.imageURL = "http://".concat(item.imageURL);
            }
            return item;
        }.bind(this));
    },

    applyChanges: function () {
        this.state.validation = true;
        if(this.isValid()){
            this.appendPrefixes();
            jive.tile.close({data:this.state});
        }
        this.setState(this.state);
        setTimeout(function(){
            gadgets.window.adjustHeight();
        },50);
    },

    updateState: function(state){
      this.setState(state);
    },

    render: function () {
        return (<div className="j-wrapper">
            <div>
                <h1 className="margin-bottom-sm">
                    Segmented Images Grid
                </h1>
                <p className="description">
                    Create a set of segmented tiles with image backgrounds and a small blurb for easy access to important links.
                </p>
            </div>
            <Title val={this.state.tileTitle} onSaveTitle={this.saveTitle}/>
            <div className="item-container bg-color-gray">
                <Header />
                <Items currentState={this.state} changeState={this.changeMainState} items={this.state.items}/>
            </div>
            <span className="hint">We recommend you resize/crop your images to 676x255 for best results.</span>
            <AddItem currentState={this.state} changeState={this.changeMainState}/>
            <ColorPicker state={this.state} updateState={this.updateState}/>
            <ApplyChanges clickHandler={this.applyChanges}/>

        </div>)
    }
});

var initReact = function(configData){
    ReactDOM.render( React.createElement(MainView, {configData: configData}), document.getElementById('index'));
};
window.initReact = initReact;