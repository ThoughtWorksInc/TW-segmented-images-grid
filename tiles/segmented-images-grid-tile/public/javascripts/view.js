jive.tile.onOpen(function(config, options) {
    console.log(config);
    if(!config)
        initView({});
    else{
        initView(config);
    }
});