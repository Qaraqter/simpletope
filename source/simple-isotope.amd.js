var $ = window.jQuery;

$.simpleIsotope = require("./constructor/prototype.js");

$.simpleIsotope.prototype = {
    instances: {},
    constructor: $.simpleIsotope,

    hash: {
        _getHash: require("./hash/_getHash.js"),
        _setHash: require("./hash/_setHash.js"),
        _formatHash: require("./hash/_formatHash.js"),
        _onHashChanged: require("./hash/_onHashChanged.js")
    },
    filter: {
        _createButtons: require("./filter/_createButtons.js")
    },
    sorter: {
        _createButtons: require("./sorter/_createButtons.js")
    },
    clear: {
        _createButtons: require("./clear/_createButtons.js"),
        _check: require("./clear/_check.js"),
        __check: require("./clear/__check.js")
    },
    text: {
        _feedback: require("./text/_feedback.js")
    },

    utils: require("./utils/index.js"),

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

        this._onIsotopeChange(this.instances[this.guid].isotope);
    },

    /**
     * _getSortData: Get the data-sort-by attributes and make them into an Isotope "getSortData" object
     * @since 0.1.0
     */
    _getSortData: function() {
        var $sortData = {},
            $dataSortBy = this.settings.dataSelectors.sortBy,
            $dataSortBySelector = this.settings.dataSelectors.sortBySelector,
            $dataSortByDefault = this.settings.defaults.sort;

        $('[' + $dataSortBy + '], [' + $dataSortBySelector + ']').each(function(idx, elm) {
            var $elm = $(elm),
                $name = $elm.attr($dataSortBy) || null,
                $selector = $elm.attr($dataSortBySelector) || null;

            if($name != $dataSortByDefault) {
                if($name !== null && $selector !== null) {
                    $sortData[$name] = $selector;
                } else {
                    alert("Isotope sorting: "+$dataSortBy+" and "+$dataSortBySelector+" are required. Currently configured "+$dataSortBy+"='" + $name + "' and "+$dataSortBySelector+"='" + $selector + "'")
                }
            }
        });

        return $sortData;
    },

    /**
    * _toggleClass: Helper to toggle or remove classes easier
    * @since 0.1.0
    * @param {element} $elm
    * @param {element} $container
    * @param {string} className
    * @param {boolean} multiple
    * @param {boolean} match
    */
    _toggleClass: function($elm, $container, className, multiple, match, findDefault) {
        match = match || false;
        multiple = multiple || false;

        if(multiple !== false) {

            if(match) {
                $container.find('.'+className).removeClass(className);
                $elm.addClass(className);
            } else {
                $container.find(findDefault).removeClass(className);
                $elm.toggleClass(className);
            }

        } else {
            $container.find('.'+className).removeClass(className);
            $elm.addClass(className);
        }

        return $elm.hasClass(className);
    },

    /**
    * _getInstances
    * @since 0.1.0
    */
    _getInstances: function() {
        var tmp = []

        $.each(this.instances, function(key, elm) {
            tmp.push(elm.isotope);
        });

        return tmp;
    },

    /**
    * _getElementsFromSelector
    * @since 0.1.0
    */
    _getElementsFromSelector: function(selector) {
        var $tmp;

        if(selector.charAt(0) == "#" || selector.charAt(0) == ".") {				//this looks like a valid CSS selector
            $tmp = $(selector);
        } else if(selector.indexOf("#") !== -1 || selector.indexOf(".") !== -1) {	//this looks like a valid CSS selector
            $tmp = $(selector);
        } else if(selector.indexOf(" ") !== -1) {									//this looks like a valid CSS selector
            $tmp = $(selector);
        } else {																	//evulate the string as an id
            $tmp = $("#" + selector);
        }

        if($tmp.length == 0) {
            console.error("simpleIsotope: We cannot find any DOM element with the CSS selector: " + selector);
            return false;
        } else {
            var $tmpArr = [];
            $.each(this.instances, function(key, instance) {
                if($(instance.isotope.element)[0] === $tmp[0]) {
                    $tmpArr.push(instance.isotope);
                }
            });
            return $tmpArr;
        }

        // return $tmp;
    }
};

$.fn.simpleIsotope = require("./constructor/jquery.js")

$(document).ready(function() {
    $.each($("[data-isotope]"), function(key, elm) {
        $(elm).simpleIsotope();
    })
});
