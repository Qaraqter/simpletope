module.exports = function($args){
    $.extend(this, $args);

    var $self = this,
        theHash;

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

    //Add hash support
    if(this.container.data("hash") !== null && this.container.data("hash") !== undefined) {
        theHash = this.hash._getHash.call(this);

        this.useHash = true;

        $(window).on('hashchange', this.hash._onHashChanged.bind(this));
    }

    //Get containers of filters
    this.utils._setContainers.call(this, this.instances[this.guid].isotope);

    this.instances[this.guid].isotope = new Isotope(this.container.context, {
        filter: theHash || "*",
        itemSelector: $self.settings.itemSelector || '.item',
        layoutMode: $self.container.data("layout") || "fitRows",
        getSortData: $self.utils._getSortData.call(this),
        getFilterTest: $self.utils._getFilterTest.call(this)
    });

    this.instances[this.guid].isotope.__getFilterTest = this.instances[this.guid].isotope._getFilterTest;
    this.instances[this.guid].isotope._getFilterTest = this.utils._getFilterTest.bind(this);

    if(window.imagesLoaded !== undefined) {
        this.container.imagesLoaded( function() {
            $self.instances[$self.guid].isotope.layout();
        });
    }

 };
