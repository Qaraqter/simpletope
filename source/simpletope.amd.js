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
        _createButtons: require("./filter/_createFilters.js"),
        _check: require("./filter/_check.js")
    },
    sorter: {
        _createButtons: require("./sorter/_createSorters.js"),
        _check: require("./sorter/_check.js")
    },
    clear: {
        _createButtons: require("./clear/_createClearers.js"),
        _check: require("./clear/_check.js"),
        __check: require("./clear/__check.js")
    },
    text: {
        _feedback: require("./text/_feedback.js")
    },

    /**
    * _setContainers: Set the filters/sorters/clear containers to the right Isotope container
    * @since 0.1.0
    * @param {object} $instance
    */
    _setContainers: function($instance) {
        var $self = this,
            sh = $self.instances[$self.guid];

        $.each($('[data-filter], [data-sort-by], [data-clear-filter], [data-feedback]'), function(ind, elm) {
            var $elm = $(elm),
                filterContainer = $self._createUniqueContainerId($elm);

            if( $elm.attr('data-filter') !== undefined ) {
                sh.filterContainer[filterContainer.id] = $(filterContainer.elm);
            } else if ( $elm.attr('data-sort-by') !== undefined ) {
                sh.sortContainer[filterContainer.id] = $(filterContainer.elm);
            } else if ( $elm.attr('data-clear-filter') !== undefined ) {
                sh.clearContainer[filterContainer.id] = $(filterContainer.elm);
            } else if ( $elm.attr('data-feedback') !== undefined ) {
                sh.feedbackContainer[filterContainer.id] = $(filterContainer.elm);
            }
        });
    },

    /**
    * _createUniqueContainerId: Get an id or fallback to a parent div
    * @since 0.2.1
    * @param {object} $elm
    */
    _createUniqueContainerId: function($elm) {
        var tmpElm;

        //Get the closest container with attribute data-for-container
        var filterContainerId = $elm.closest('[data-for-container]');
        if( filterContainerId.length > 0 ) {
            tmpElm = filterContainerId[0];
        } else {

            //No parents with data attribute found, lets try something else
            filterContainerId = $elm.prop("tagName").toLowerCase() == "option" ? $elm.parent('select') : $elm.parents('div[id]');
            if( filterContainerId.length > 0 ) {
                tmpElm = filterContainerId[0];
            } else {

                //No id or select parent found: lets just use the parent, evertything failed
                filterContainerId = $elm.parent();
                if( filterContainerId.length > 0 ) {
                    tmpElm = filterContainerId[0];
                } else {
                    //Major fail; this shouldn't get called
                    return {
                        id: new Date().getTime(),
                        elm: tmpElm
                    };
                }

            }

        }

        var formatted = $(tmpElm).text().trim().replace(/[^!a-zA-Z0-9]/g, "");
        if( formatted === "" ) {
            return {
                id: new Date().getTime(),
                elm: tmpElm
            };
        }

        return {
            id: formatted,
            elm: tmpElm
        };

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
        this.filter._check.call(this, $instance);
        this.sorter._check.call(this, $instance);

        this.clear._check.call(this, $instance.isotope);
        this.text._feedback.call(this, $instance.isotope);
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
                    alert("Isotope sorting: "+$dataSortBy+" and "+$dataSortBySelector+" are required. Currently configured "+$dataSortBy+"='" + $name + "' and "+$dataSortBySelector+"='" + $selector + "'");
                }
            }
        });

        return $sortData;
    },

    /**
    * _getInstances
    * @since 0.1.0
    */
    _getInstances: function() {
        var tmp = [];

        $.each(this.instances, function(key, elm) {
            tmp.push(elm.isotope);
        });

        return tmp;
    },

    /**
    * _getElementFromDataAttribute
    * @since 0.1.0
    * @update 0.2.1
    */
    _getElementFromDataAttribute: function(selector) {
        var $tmp;

        if(selector === "" || selector === false || selector === undefined) {
            return false;
        }

        if(selector instanceof jQuery) {
            return selector;
        }

        if(selector.charAt(0) === "#" || selector.charAt(0) === ".") {				//this looks like a valid CSS selector
            $tmp = $(selector);
        } else if(selector.indexOf("#") !== -1 || selector.indexOf(".") !== -1) {	//this looks like a valid CSS selector
            $tmp = $(selector);
        } else if(selector.indexOf(" ") !== -1) {									//this looks like a valid CSS selector
            $tmp = $(selector);
        } else {																	//evulate the string as an id
            $tmp = $("#" + selector);
        }

        if($tmp.length === 0) {
            // throw new Error("simpletope: We cannot find any DOM element with the CSS selector: '" + selector + "'");
            return false;
        } else {
            return $tmp;
        }
    },

    _getFilterTest: function(filter) {
        var $self = this;

        return function( item ) {

            var filters = filter.split(","),
                active = [];

            for (var i = 0, len = filters.length; i < len; i++) {

                if(filters[i].indexOf("data-") !== -1) {

                    var cat = filters[i].replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$1").trim();
                    var value = filters[i].replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$2").trim();

                    if(jQuery( item.element ).data( cat ) !== undefined && jQuery( item.element ).data( cat ) !== null) {
                        if( jQuery( item.element ).data( cat ).indexOf( value ) !== -1 ) {
                            active.push(value);
                        }
                    }

                } else {

                    if( jQuery( item.element ).is( filters[i] ) ) {
                        active.push(filters[i]);
                    }

                }

            }

            if($self.filterMethod == "or") {
                return active.length > 0;
            } else {
                return active.length == filters.length;
            }

        };

    }

};

$.fn.simpleIsotope = require("./constructor/jquery.js");

$(document).ready(function() {
    $.each($("[data-isotope]"), function(key, elm) {
        $(elm).simpleIsotope();
    });
});

// Add bind support
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
            return fToBind.apply(this instanceof fNOP && oThis ? this : oThis, aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
if (!Function.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    };
}
