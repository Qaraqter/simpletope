var $ = window.jQuery;

$.simpleIsotope = require("./constructor/prototype.js");

$.simpleIsotope.prototype = {
    instances: {},
    allFilters: {},
    allSorters: {},

    constructor: $.simpleIsotope,

    hash: {
        _getHash: require("./hash/_getHash.js"),
        _setHash: require("./hash/_setHash.js"),
        _formatHash: require("./hash/_formatHash.js"),
        _onHashChanged: require("./hash/_onHashChanged.js")
    },
    filter: {
        _initFilters: require("./filter/_initFilters.js"),
        _setActiveClass: require("./filter/_setActiveClass.js")
    },
    sorter: {
        _initSorters: require("./sorter/_initSorters.js"),
        _setActiveClass: require("./sorter/_setActiveClass.js")
    },
    clear: {
        _initClearers: require("./clear/_initClearers.js"),
        _check: require("./clear/_check.js"),
        __check: require("./clear/__check.js")
    },
    text: {
        _feedback: require("./text/_feedback.js")
    },
    events: {
        _attach: require("./events/_attach.js")
    },
    utils: {
        // _setContainers: require("./utils/_setContainers.js"),
        // _getForContainerAndId: require("./utils/_getForContainerAndId.js"),
        // _getElementFromDataAttribute: require("./utils/_getElementFromDataAttribute.js"),
        _getSortData: require("./utils/_getSortData.js"),
        _getFilterTest: require("./utils/_getFilterTest.js"),
        _getInstances: require("./utils/_getInstances.js")
    },

    /**
    * _onBeforeIsotopeChange: fires before the Isotope layout has been changed
    * @since 0.1.0
    * @param {string} $instance
    */
    _onBeforeIsotopeChange: function($instance) {},

    /**
    * _onIsotopeChange: fires when the Isotope layout has been changed
    * @since 0.1.0
    * @param {string} $instance
    */
    _onIsotopeChange: function($instance) {
        this.filter._setActiveClass.call(this, $instance);
        this.sorter._setActiveClass.call(this, $instance);

        this.clear._check.call(this, $instance);
        this.text._feedback.call(this, $instance);
    },

    /**
    * _setIsotope: Reconfigure isotope
    * @since 0.1.0
    * @param {string} $selector
    */
    _setIsotope: function($selector) {
        this.instances[this.guid].isotope.arrange({
            filter: $selector
        });

        this._onIsotopeChange(this.instances[this.guid]);
    }

};

$.fn.simpleIsotope = require("./constructor/jquery.js");

$(document).ready(function() {
    $.each($("[data-isotope]"), function(key, elm) {
        $(elm).simpleIsotope();
    });
});
