module.exports = function($args){
    $.extend(this, $args);

    var $self = this,
        theHash = this.hash._getHash.call(this);

    this._getFilterTestOrginal = Isotope.prototype._getFilterTest;
    Isotope.prototype._getFilterTest = this.utils._getFilterTest.bind(this);

    this.guid = this.container.attr("id") || new Date().getTime();

    this.encodeURI = false;

    this.allFilters[this.guid] = this.allFilters[this.guid] || {};
    this.allSorters[this.guid] = this.allSorters[this.guid] || {};

    //First time init isotope
    this.instances[this.guid] = {
        isotope: false,
        filterContainer: {},
        sortContainer: {},
        clearContainer: {},
        feedbackContainer: {}
    };

    //Get containers of filters
    this.utils._setContainers.call(this, this.instances[this.guid].isotope);

    this.instances[this.guid].isotope = new Isotope(this.container.context, {
        filter: theHash || "*",
        itemSelector: $self.settings.itemSelector || '.item',
        layoutMode: $self.container.data("layout") || "fitRows",
        getSortData: $self.utils._getSortData.call(this)
    });

    if(this.container.data("hash") !== null && this.container.data("hash") !== undefined) {
        this.useHash = true;
    }

    if(window.imagesLoaded !== undefined) {
        this.container.imagesLoaded( function() {
            $self.instances[$self.guid].isotope.layout();
        });
    }

    //Add hash support
    $(window).on('hashchange', this.hash._onHashChanged.bind(this));

 };
