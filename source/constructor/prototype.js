module.exports = function($args){
    $.extend(this, $args);

    var $self = this,
        theHash = this.hash._getHash.call(this);

    this.guid = this.container.attr("id") || new Date().getTime();
    this.encodeURI = false;

    //First time init isotope
    this.instances[this.guid] = {
        isotope: new Isotope(this.container.context, {
            filter: theHash || "*",
            itemSelector: $self.settings.itemSelector || '.item',
            layoutMode: $self.container.data("layout") || "fitRows",
            getSortData: $self._getSortData()
        })
    };

    if(this.container.data("hash") !== null && this.container.data("hash") !== undefined) {
        this.useHash = true;
    }

    //Add hash support
    $(window).on('hashchange', this.hash._onHashChanged.bind(this));

 };
