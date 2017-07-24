jive.tile.onOpen(function(config, options) {
    if(!config["data"])
        initReact({});
    initReact(config["data"]);

    var appHeight = 0;
    setInterval(function(){
        var newHeight = $('body').outerHeight();
        if ( appHeight !== newHeight) {
            appHeight = newHeight;
            gadgets.window.adjustHeight(appHeight);
        }
    }, 200);
});
