!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.simpleIsotope=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* _check: Check if we need to enable or disable the clear div without an instance
* @since 0.1.0
*/
module.exports = function() {
    this._onIsotopeChange.call(this, this.instances[this.guid]);
};

},{}],2:[function(require,module,exports){
/**
* _check: Check if we need to enable or disable the clear div.
* @since 0.1.0
* @param {string} $instance
*/

module.exports = function(instance) {

    var $clearFilter = this.settings.dataSelectors.clearFilter,
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $dataFilter = this.settings.dataSelectors.filter,
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $activeClass = this.settings.defaults.classNames.active,
        $instance = instance || this.instances[this.guid],
        $history = $instance.isotope.sortHistory,

        forContainerFull = this.settings.dataSelectors.forContainer + '="' + this.container.attr("id") + '"',

        theClearer = $('[' + forContainerFull + '][' + $clearFilter + ']').exists() || $('[' + $clearFilter + ']'),

        $elm = $(theClearer);


    if($instance.isotope.options.filter != $defaultFilter || $history[$history.length - 1] != $defaultSort) {
        $elm.removeClass("hide").show();
    } else {
        $elm.hide();
    }

};

},{}],3:[function(require,module,exports){
module.exports = function(instance, elements) {
    var $clearFilter = this.settings.dataSelectors.clearFilter,
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $instance = this.instances[this.guid],
        $self = this;

    $.each(elements, function(idx, elm) {
        var $elm = $(elm);

        $elm.hide().removeClass("hide").on('click', function(e) {
            e.preventDefault();

            if($self.useHash === true) {
                $self.hash._setHash.call($self, $instance.isotope, $defaultFilter);
            } else {
                $instance.isotope.arrange({
                    filter: $defaultFilter
                    // sortBy: $defaultSort
                });

                $self._onIsotopeChange.call($self, $instance);
            }

            $elm.hide();
        });
    });
};

},{}],4:[function(require,module,exports){
module.exports = function(){

    var $args = arguments[0] || {},
        instances = [];

    if(typeof window.Isotope != "function") {
        alert("simpleIsotope: Isotope.JS couldn't be found. Please include 'isotope.js'.")
        return;
    }

    $.each(this, function(idx, elm) {
        var obj = {
            container: $(elm),
            settings: {
                itemSelector: '.item',
                dataSelectors: {
                    filter: 'data-filter',
                    type: 'data-filter-type',
                    filterMultiple: 'data-filter-multiple',
                    sortBy: 'data-sort-by',
                    sortBySelector: 'data-sort-selector',
                    sortDirection: 'data-sort-direction',
                    forContainer: 'data-isotope-container',
                    clearFilter: 'data-clear-filter',
                    feedback: 'data-feedback'
                },
                defaults: {
                    filter: "*",
                    sort: "original-order",
                    classNames: {
                        active: 'active'
                    }
                }
            }
        };

        instances.push(new $.simpleIsotope($.extend(obj, $args)));
    });

    // $.each(instances, function(idx, elm) {
    //     elm.sorter._createButtons.call(elm);
    //     elm.filter._createButtons.call(elm);
    //     elm.clear._createButtons.call(elm);
    //     elm.text._feedback.call(elm);
    //     elm.clear.__check.call(elm);
    // });

    return instances;

};

},{}],5:[function(require,module,exports){
module.exports = function($args){
    $.extend(this, $args);

    var $self = this,
        theHash;

    this.guid = this.container.attr("id") || new Date().getTime();
    this.encodeURI = false;

    this.instances[this.guid] = {
        isotope: false
    };

    //Add hash support
    if(this.container.data("hash") !== null && this.container.data("hash") !== undefined) {
        theHash = this.hash._getHash.call(this);

        this.useHash = true;

        $(window).on('hashchange', this.hash._onHashChanged.bind(this));
    }

    //Get containers of filters
    // this.utils._setContainers.call(this, this.instances[this.guid].isotope);

    //First time init isotope
    this.instances[this.guid].isotope = new Isotope(this.container.context, {
        filter: theHash || "*",
        itemSelector: $self.settings.itemSelector || '.item',
        layoutMode: $self.container.data("layout") || "fitRows",
        getSortData: $self.utils._getSortData.call(this),
        getFilterTest: $self.utils._getFilterTest.call(this),
    });

    // Check if this is a multiple filter
    this.instances[this.guid].isotope.isMultiple = this.container.attr(this.settings.dataSelectors.filterMultiple) || false;

    //Add events to Filters and Sorters
    this.events._attach.call(this, this.instances[this.guid].isotope);

    // Init clear
    this.clear._initClearers.call(this, this.instances[this.guid], this.eventElements.clear);

    // Init feedback
    this.text._feedback.call(this, this.instances[this.guid]);

    this.instances[this.guid].isotope.__getFilterTest = this.instances[this.guid].isotope._getFilterTest;
    this.instances[this.guid].isotope._getFilterTest = this.utils._getFilterTest.bind(this);

    if(window.imagesLoaded !== undefined) {
        this.container.imagesLoaded( function() {
            $self.instances[$self.guid].isotope.layout();
        });
    }

 };

},{}],6:[function(require,module,exports){
/**
* _attach: Attach click events to filters, sorters, feedback, clear
* @since 0.2.4
* @param {object} $instance
*/

module.exports = function($instance) {
    var $self = this,
        instance = $self.instances[$self.guid],
        timestamp = new Date().getTime(),

        forContainerFull = $self.settings.dataSelectors.forContainer + '="' + this.container.attr("id") + '"',

        clicked = function(e) {
            e.preventDefault();

            var $elm = $(e.delegateTarget);

            // If element is SELECT, get selected
            if(e.type == "change") {
                $elm = $elm.find('option:selected');
            }

            if( $elm.is('[' + $self.settings.dataSelectors.filter + ']') ) {

                $self.filter._initFilters.call($self, $elm);

            } else if( $elm.is('[' + $self.settings.dataSelectors.sortBy + ']') ) {

                $self.sorter._initSorters.call($self, $elm);

            }
        };

    // Lets first check if anything is tied to an instance
    this.eventElements = {
        filters: $('[' + forContainerFull + '] [' + $self.settings.dataSelectors.filter + ']').exists() || $('[' + $self.settings.dataSelectors.filter + ']'),
        sorters: $('[' + forContainerFull + '] [' + $self.settings.dataSelectors.sortBy + ']').exists() || $('[' + $self.settings.dataSelectors.sortBy + ']'),
        clear: $('[' + forContainerFull + '][' + $self.settings.dataSelectors.clearFilter + ']').exists() || $('[' + $self.settings.dataSelectors.clearFilter + ']'),
        feedback: $('[' + forContainerFull + '] [' + $self.settings.dataSelectors.feedback + ']').exists() || $('[' + $self.settings.dataSelectors.feedback + ']'),

        all: {}
    };

    // Combine results to one jQuery object
    this.eventElements.all = this.eventElements.filters.add(this.eventElements.sorters);

    // Add the events
    this.eventElements.all.off('click').on('click', clicked);
    this.eventElements.all.parent('select').off('change').on('change', clicked);

};

},{}],7:[function(require,module,exports){
/**
* _checkFilters: create buttons and add events to it
* @updated 0.2.4
* @param {object} $filter
*/

module.exports = function($elm) {
    var $self = this,
        $dataFilter = this.settings.dataSelectors.filter,
        $dataChain = this.settings.dataSelectors.filterChain,
        $instance = this.instances[this.guid],

        $dataChainAttr = $elm.closest('[' + $dataChain + ']'),
        $dataFilterAttr = $elm.attr($dataFilter),

        newFilters = $dataFilterAttr,
        $filterValue = $dataFilterAttr,

        chainGroupName = $instance.isotope.isGrouped || "*",

        activeFilters, currentFilters;

    if(this.useHash === true) {

        this.hash._setHash.call(this, $instance.isotope, $filterValue);

    } else {

        // Get current active filters from isotope instance
        activeFilters = $instance.isotope.options.filter;

        // Check if clicked filter's value is not a wildcard
        if(activeFilters !== "*" && $filterValue !== "*") {
            activeFilters = activeFilters.split(",");
            newFilters = [];

            //Loop through all active filters
            $.each(activeFilters, function(index, element) {

                //Check if this container allows multiple filters
                if($instance.isotope.isMultiple) {

                    newFilters.push(element);

                } else {//Container only allows one filter

                    var container = $elm.closest('ul');//Check if parent has an UL
                        container = (container.length === 0) ? $elm.closest('select') : container;//Check if select
                        container = (container.length === 0) ? $elm.parent() : container;//Check if select

                    //Pass on filters that are not in same container
                    if( container.find('[' + $dataFilter + '="' + element + '"]').length === 0 || element === $filterValue ) {
                        newFilters.push(element);
                    }
                }
            });

            if( newFilters.indexOf($filterValue) === -1 ) {
                newFilters.push($filterValue);
            } else {
                newFilters.splice(newFilters.indexOf($filterValue), 1);
            }

            newFilters = newFilters.join(",");

        }

        //If filters is empty then reset it all
        if(newFilters === "") {
            newFilters = "*";
        }

        $instance.isotope.arrange({
            filter: newFilters
        });

        this._onIsotopeChange.call(this, $instance);
    }

};

},{}],8:[function(require,module,exports){
/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function($instance, elm) {

    var $dataFilter = this.settings.dataSelectors.filter,
        $defaultFilter = this.settings.defaults.filter,
        $instance = $instance || this.instances[this.guid],
        $activeClass = this.settings.defaults.classNames.active,

        forContainerFull = this.settings.dataSelectors.forContainer + '="' + this.container.attr("id") + '"';

    $.each($instance.isotope.options.filter.split(","), function( index, filter ) {

        var theFilter = $('[' + forContainerFull + '] [' + $dataFilter + '="' + filter + '"]').exists() || $('[' + $dataFilter + '="' + filter + '"]'),
            allFilters = $('[' + forContainerFull + '] [' + $dataFilter + ']').exists() || $('[' + $dataFilter + ']'),
            defaultFilter =  $('[' + forContainerFull + '] [' + $dataFilter + '="' + $defaultFilter + '"]').exists() || $('[' + $dataFilter + '="' + $defaultFilter + '"]');

        if(theFilter.prop("tagName") && theFilter.prop("tagName").toLowerCase() === "option") {

            theFilter.attr('selected','selected');

        } else {

            if(index === 0) {
                //Remove all active classes first time
                allFilters.removeClass($activeClass);
            }

            //Add active classes
            var active = theFilter.addClass($activeClass);

            if(active.length > 0 && filter != $defaultFilter) {
                defaultFilter.removeClass($activeClass);
            }

        }

        // $.each($instance.filterContainer, function( idx, container ) {
        //     var elm = container.elm.find("["+$dataFilter+"=\""+filter+"\"]");
        //
        //     if(elm.prop("tagName") && elm.prop("tagName").toLowerCase() === "option") {
        //
        //         elm.attr('selected','selected');
        //
        //     } else {
        //
        //         if(index === 0) {
        //             //Remove all active classes first time
        //             container.elm.find("["+$dataFilter+"]").removeClass($activeClass);
        //         }
        //
        //         //Add active classes
        //         var active = elm.addClass($activeClass);
        //
        //         if(active.length > 0 && filter != $defaultFilter) {
        //             container.elm.find("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
        //         }
        //
        //     }
        // });

    });

};

},{}],9:[function(require,module,exports){
/**
* _formatHash: Format multiple filters into one string based on a regular expression
* @since 0.1.0
* @param {regex} re
* @param {string} str
*/
module.exports = function(re, str) {
    var matches = {},
        match;

    while ((match = re.exec(str)) !== null) {
        if (match.index === re.lastIndex) {
            re.lastIndex++;
        }

        if(match[3] !== null && match[3] !== undefined) {

            matches[match[3]] = true;

        } else {

            if(matches[match[1]] === null || matches[match[1]] === undefined) {
                matches[match[1]] = [];
            }
            matches[match[1]].push(match[2]);

        }

    }

    return matches;
};

},{}],10:[function(require,module,exports){
/**
 * _getHash: Get window.location.hash and format it for Isotope
 * @since 0.1.0
 */

 module.exports = function() {
    var $hash = window.location.hash || false,
        $newHash = "";

    $hash = ($hash !== false && $hash !== "#" && $hash !== "") ? decodeURIComponent(window.location.hash) : '*';

    //Remove hash from first character if its exist
    if ($hash.charAt(0) === '#') {
         $hash = $hash.slice(1);
    }

    var hashArray = $hash.split("&");
    $.each(hashArray, function(key, $partHash) {

        if($partHash.indexOf("=") !== -1) {

            var tmp = $partHash.split("="),
                arr = [], values, name;

            if(tmp.length > 1) {
                name = tmp[0];
                values = tmp[1].replace(/\'/g, "");
            }

            values = values.split(",");
            for (var i=0; i<values.length; i++) {
                arr.push("[data-" + name + "='" + values[i] + "']");
            }

            $newHash += arr.join(",");

        } else {
            $newHash += ($partHash == "*" || $partHash.charAt(0) == '.') ? $partHash: "." + $partHash;
        }

        if(key != (hashArray.length - 1)) {
            $newHash += ",";
        }

    });

     return $newHash;

 };

},{}],11:[function(require,module,exports){
/**
* _onHashChange: fires when location.hash has been changed
* @since 0.1.0
*/
module.exports = function() {
    this._setIsotope.call(this, this.hash._getHash.call(this));
};

},{}],12:[function(require,module,exports){
/**
 * _setHash: Set a new location.hash after formatting it
 * @since 0.1.0
 * @param {object} $instance
 * @param {string} $newHash
 */

module.exports = function($instance, $newHash) {
    var $currentHash = ($instance.options.filter == "*") ? "" : $instance.options.filter,
        $combinedHash,
        $endHash = [];

    if($newHash != "*") {

        if($currentHash.indexOf($newHash) === -1) {
            $combinedHash = $currentHash + $newHash;
        } else {
            $combinedHash = $currentHash.replace($newHash, "");
        }

        var $formattedHash = this.hash._formatHash(/\[data\-(.+?)\=\'(.+?)\'\]|(.[A-Za-z0-9]+)/g, $combinedHash);

        $.each($formattedHash, function(key, elm) {
            if(elm === true) {//isClass
                $endHash.push( (key.charAt(0) == '.') ? key.slice(1) : key );
            } else {//isObject
                $endHash.push(key + "=" + elm.join(","));
            }
        });

        $endHash = $endHash.join("&");
    } else {
        $endHash = $newHash;
    }

    if($endHash === "*" || $endHash === "") {
        window.location.hash = "";
    } else {
        window.location.hash = (this.encodeURI === true) ? encodeURIComponent($endHash) : $endHash;
    }

    return $endHash;
};

},{}],13:[function(require,module,exports){
jQuery.fn.exists = function(){
    return (this.length > 0) ? this : false;
};

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

if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(searchElement, fromIndex) {

    var k;

    // 1. Let O be the result of calling ToObject passing
    //    the this value as the argument.
    if (this == null) {
      throw new TypeError('"this" is null or not defined');
    }

    var O = Object(this);

    // 2. Let lenValue be the result of calling the Get
    //    internal method of O with the argument "length".
    // 3. Let len be ToUint32(lenValue).
    var len = O.length >>> 0;

    // 4. If len is 0, return -1.
    if (len === 0) {
      return -1;
    }

    // 5. If argument fromIndex was passed let n be
    //    ToInteger(fromIndex); else let n be 0.
    var n = +fromIndex || 0;

    if (Math.abs(n) === Infinity) {
      n = 0;
    }

    // 6. If n >= len, return -1.
    if (n >= len) {
      return -1;
    }

    // 7. If n >= 0, then Let k be n.
    // 8. Else, n<0, Let k be len - abs(n).
    //    If k is less than 0, then let k be 0.
    k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

    // 9. Repeat, while k < len
    while (k < len) {
      // a. Let Pk be ToString(k).
      //   This is implicit for LHS operands of the in operator
      // b. Let kPresent be the result of calling the
      //    HasProperty internal method of O with argument Pk.
      //   This step can be combined with c
      // c. If kPresent is true, then
      //    i.  Let elementK be the result of calling the Get
      //        internal method of O with the argument ToString(k).
      //   ii.  Let same be the result of applying the
      //        Strict Equality Comparison Algorithm to
      //        searchElement and elementK.
      //  iii.  If same is true, return k.
      if (k in O && O[k] === searchElement) {
        return k;
      }
      k++;
    }
    return -1;
  };
}

},{}],14:[function(require,module,exports){
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

},{"./clear/__check.js":1,"./clear/_check.js":2,"./clear/_initClearers.js":3,"./constructor/jquery.js":4,"./constructor/prototype.js":5,"./events/_attach.js":6,"./filter/_initFilters.js":7,"./filter/_setActiveClass.js":8,"./hash/_formatHash.js":9,"./hash/_getHash.js":10,"./hash/_onHashChanged.js":11,"./hash/_setHash.js":12,"./sorter/_initSorters.js":15,"./sorter/_setActiveClass.js":16,"./text/_feedback.js":17,"./utils/_getFilterTest.js":18,"./utils/_getInstances.js":19,"./utils/_getSortData.js":20}],15:[function(require,module,exports){
/**
* _checkSort: create buttons and add events to it
* @updated 0.2.4
* @param {object} $filter
*/

module.exports = function($elm) {
    var $self = this,
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $dataSortDirection = this.settings.dataSelectors.sortDirection,
        $defaultSort = this.settings.defaults.sort,
        $sortArray = [],
        $instance = this.instances[this.guid],

        $sortByValue = '',
        $sortAsc = false,
        $dataSortAttr = $elm.attr($dataSortBy);

    // TODO: I'm ganna leave this code here for now, if we ever need to add multiple support on sorters
    // if($self.filterMultiple) {
    //
    //     $sortByValue = [];
    //
    //     if($dataSortAttr == $defaultSort) {
    //
    //         $sortArray = [];
    //
    //     } else {
    //
    //         if($sortArray.indexOf($dataSortAttr) === -1) {//item not filtered
    //
    //             $sortArray.push($dataSortAttr);
    //
    //         } else {//item already filtered
    //
    //             if($instance.isotope.options.sortAscending !== ($elm.attr($dataSortDirection).toLowerCase() === "asc")) {//Are we changing desc or asc?
    //                 //Do nothing, array will be the same, we're only chanigng sort direction
    //             } else {
    //                 $sortArray.splice($sortArray.indexOf($dataSortAttr), 1); //same item filtered, remove this item from array
    //             }
    //         }
    //
    //     }
    //
    //     if($sortArray.length === 0) {
    //         $sortByValue = $defaultSort;
    //     } else {
    //         $sortByValue = $sortArray;
    //     }
    //
    // } else {
    //     $sortByValue = $dataSortAttr;
    // }

    $sortByValue = $dataSortAttr;

    if($elm.attr($dataSortDirection) !== null && $elm.attr($dataSortDirection) !== undefined) {
        if($elm.attr($dataSortDirection).toLowerCase() === "asc") {
            $sortAsc = true;
        }
    }

    if($elm.attr($dataSortBy) == $defaultSort) {
        $sortAsc = true;
    }

    $instance.isotope.arrange({
        sortBy: $sortByValue,
        sortAscending: $sortAsc
    });

    $self._onIsotopeChange.call($self, $instance);

};

},{}],16:[function(require,module,exports){
/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function(instance) {

    var $dataSort = this.settings.dataSelectors.sortBy,
        $defaultSort = this.settings.defaults.sort,
        $instance = instance || this.instances[this.guid],
        $activeClass = this.settings.defaults.classNames.active,
        $sortHistory = $instance.isotope.sortHistory,
        $sortAscending = $instance.isotope.options.sortAscending,

        forContainerFull = this.settings.dataSelectors.forContainer + '="' + this.container.attr("id") + '"',
        sortDirection = "desc";

    if($sortAscending) {
        sortDirection = "asc";
    }

    var theSorter = $('[' + forContainerFull + '] [' + $dataSort + '="' + $sortHistory[0] + '"][data-sort-direction="' + sortDirection + '"]').exists() || $('[' + $dataSort + '="' + $sortHistory[0] + '"][data-sort-direction="' + sortDirection + '"]'),
        allSorters = $('[' + forContainerFull + '] [' + $dataSort + ']').exists() || $('[' + $dataSort + ']'),
        defaultSorter =  $('[' + forContainerFull + '] [' + $dataSort + '="' + $defaultSort + '"]').exists() || $('[' + $dataSort + '="' + $defaultSort + '"]');

    if(theSorter.prop("tagName") && theSorter.prop("tagName").toLowerCase() === "option") {

    } else {

        //Remove all active classes first time
        allSorters.removeClass($activeClass);

        //Add active classes
        var active = theSorter.addClass($activeClass);

        if(active.length > 0 && $sortHistory[0] != $defaultSort) {
            defaultSorter.removeClass($activeClass);
        } else {
            defaultSorter.addClass($activeClass);
        }
    }

};

},{}],17:[function(require,module,exports){
module.exports = function(instance) {
    var $instance = instance || this.instances[this.guid],
        $self = this;

    $.each(this.eventElements.feedback, function(idx, elm) {
        var $feedback = $(elm);

        $feedback.each(function(idx, elm) {
            var $elm = $(elm);

            $elm.text($elm.attr("data-feedback").replace("{delta}", $instance.isotope.filteredItems.length));
        });
    });
};

},{}],18:[function(require,module,exports){
module.exports = function(filter) {
    var guid = this.guid,
        $instance = this.instances[this.guid];

    return function( item ) {

        var filters = filter.split(","),
            active = [],
            container = [];

        for (var i = 0, len = filters.length; i < len; i++) {

            //Enable filtering with data-attributes
            if(filters[i].indexOf("data-") !== -1) {

                var cat = filters[i].replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$1").trim(),
                    value = filters[i].replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$2").trim();

                if(jQuery( item.element ).data( cat ) !== undefined && jQuery( item.element ).data( cat ) !== null) {
                    if( jQuery( item.element ).data( cat ).indexOf( value ) !== -1 ) {
                        active.push(value);
                    }
                }

            } else {

                //Default filtering
                if( jQuery( item.element ).is( filters[i] ) ) {
                    active.push(filters[i]);
                }

            }

        }

        if(filters.indexOf("*") !== -1) {
            return true;
        }

        if($instance.isotope.isMultiple == "or") {
            return active.length > 0;
        } else {
            return active.length == filters.length;
        }

    };

};

},{}],19:[function(require,module,exports){
/**
* _getInstances
* @since 0.1.0
*/
module.exports =  function() {
    var tmp = [];

    $.each(this.instances, function(key, elm) {
        tmp.push(elm.isotope);
    });

    return tmp;
};

},{}],20:[function(require,module,exports){
/**
 * _getSortData: Get the data-sort-by attributes and make them into an Isotope "getSortData" object
 * @since 0.1.0
 */
module.exports =  function() {
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
};

},{}]},{},[14,13])(14)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic291cmNlL2NsZWFyL19fY2hlY2suanMiLCJzb3VyY2UvY2xlYXIvX2NoZWNrLmpzIiwic291cmNlL2NsZWFyL19pbml0Q2xlYXJlcnMuanMiLCJzb3VyY2UvY29uc3RydWN0b3IvanF1ZXJ5LmpzIiwic291cmNlL2NvbnN0cnVjdG9yL3Byb3RvdHlwZS5qcyIsInNvdXJjZS9ldmVudHMvX2F0dGFjaC5qcyIsInNvdXJjZS9maWx0ZXIvX2luaXRGaWx0ZXJzLmpzIiwic291cmNlL2ZpbHRlci9fc2V0QWN0aXZlQ2xhc3MuanMiLCJzb3VyY2UvaGFzaC9fZm9ybWF0SGFzaC5qcyIsInNvdXJjZS9oYXNoL19nZXRIYXNoLmpzIiwic291cmNlL2hhc2gvX29uSGFzaENoYW5nZWQuanMiLCJzb3VyY2UvaGFzaC9fc2V0SGFzaC5qcyIsInNvdXJjZS9wb2x5ZmlsbHMuanMiLCJzb3VyY2Uvc2ltcGxldG9wZS5hbWQuanMiLCJzb3VyY2Uvc29ydGVyL19pbml0U29ydGVycy5qcyIsInNvdXJjZS9zb3J0ZXIvX3NldEFjdGl2ZUNsYXNzLmpzIiwic291cmNlL3RleHQvX2ZlZWRiYWNrLmpzIiwic291cmNlL3V0aWxzL19nZXRGaWx0ZXJUZXN0LmpzIiwic291cmNlL3V0aWxzL19nZXRJbnN0YW5jZXMuanMiLCJzb3VyY2UvdXRpbHMvX2dldFNvcnREYXRhLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuKiBfY2hlY2s6IENoZWNrIGlmIHdlIG5lZWQgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIGNsZWFyIGRpdiB3aXRob3V0IGFuIGluc3RhbmNlXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCh0aGlzLCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdKTtcclxufTtcclxuIiwiLyoqXHJcbiogX2NoZWNrOiBDaGVjayBpZiB3ZSBuZWVkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBjbGVhciBkaXYuXHJcbiogQHNpbmNlIDAuMS4wXHJcbiogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG5cclxuICAgIHZhciAkY2xlYXJGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlLFxyXG4gICAgICAgICRpbnN0YW5jZSA9IGluc3RhbmNlIHx8IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJGhpc3RvcnkgPSAkaW5zdGFuY2UuaXNvdG9wZS5zb3J0SGlzdG9yeSxcclxuXHJcbiAgICAgICAgZm9yQ29udGFpbmVyRnVsbCA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIgKyAnPVwiJyArIHRoaXMuY29udGFpbmVyLmF0dHIoXCJpZFwiKSArICdcIicsXHJcblxyXG4gICAgICAgIHRoZUNsZWFyZXIgPSAkKCdbJyArIGZvckNvbnRhaW5lckZ1bGwgKyAnXVsnICsgJGNsZWFyRmlsdGVyICsgJ10nKS5leGlzdHMoKSB8fCAkKCdbJyArICRjbGVhckZpbHRlciArICddJyksXHJcblxyXG4gICAgICAgICRlbG0gPSAkKHRoZUNsZWFyZXIpO1xyXG5cclxuXHJcbiAgICBpZigkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlciAhPSAkZGVmYXVsdEZpbHRlciB8fCAkaGlzdG9yeVskaGlzdG9yeS5sZW5ndGggLSAxXSAhPSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAkZWxtLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5zaG93KCk7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRlbG0uaGlkZSgpO1xyXG4gICAgfVxyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbnN0YW5jZSwgZWxlbWVudHMpIHtcclxuICAgIHZhciAkY2xlYXJGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKGVsZW1lbnRzLCBmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG5cclxuICAgICAgICAkZWxtLmhpZGUoKS5yZW1vdmVDbGFzcyhcImhpZGVcIikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICBpZigkc2VsZi51c2VIYXNoID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZGVmYXVsdEZpbHRlcik7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkaW5zdGFuY2UuaXNvdG9wZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICRkZWZhdWx0RmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc29ydEJ5OiAkZGVmYXVsdFNvcnRcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJGVsbS5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyICRhcmdzID0gYXJndW1lbnRzWzBdIHx8IHt9LFxuICAgICAgICBpbnN0YW5jZXMgPSBbXTtcblxuICAgIGlmKHR5cGVvZiB3aW5kb3cuSXNvdG9wZSAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYWxlcnQoXCJzaW1wbGVJc290b3BlOiBJc290b3BlLkpTIGNvdWxkbid0IGJlIGZvdW5kLiBQbGVhc2UgaW5jbHVkZSAnaXNvdG9wZS5qcycuXCIpXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkLmVhY2godGhpcywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogJChlbG0pLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBpdGVtU2VsZWN0b3I6ICcuaXRlbScsXG4gICAgICAgICAgICAgICAgZGF0YVNlbGVjdG9yczoge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICdkYXRhLWZpbHRlcicsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRhLWZpbHRlci10eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyTXVsdGlwbGU6ICdkYXRhLWZpbHRlci1tdWx0aXBsZScsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJ2RhdGEtc29ydC1ieScsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeVNlbGVjdG9yOiAnZGF0YS1zb3J0LXNlbGVjdG9yJyxcbiAgICAgICAgICAgICAgICAgICAgc29ydERpcmVjdGlvbjogJ2RhdGEtc29ydC1kaXJlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBmb3JDb250YWluZXI6ICdkYXRhLWlzb3RvcGUtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJGaWx0ZXI6ICdkYXRhLWNsZWFyLWZpbHRlcicsXG4gICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrOiAnZGF0YS1mZWVkYmFjaydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IFwib3JpZ2luYWwtb3JkZXJcIixcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiAnYWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKG5ldyAkLnNpbXBsZUlzb3RvcGUoJC5leHRlbmQob2JqLCAkYXJncykpKTtcbiAgICB9KTtcblxuICAgIC8vICQuZWFjaChpbnN0YW5jZXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgLy8gICAgIGVsbS5zb3J0ZXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgIC8vICAgICBlbG0uZmlsdGVyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAvLyAgICAgZWxtLmNsZWFyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAvLyAgICAgZWxtLnRleHQuX2ZlZWRiYWNrLmNhbGwoZWxtKTtcbiAgICAvLyAgICAgZWxtLmNsZWFyLl9fY2hlY2suY2FsbChlbG0pO1xuICAgIC8vIH0pO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlcztcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGFyZ3Mpe1xyXG4gICAgJC5leHRlbmQodGhpcywgJGFyZ3MpO1xyXG5cclxuICAgIHZhciAkc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgdGhlSGFzaDtcclxuXHJcbiAgICB0aGlzLmd1aWQgPSB0aGlzLmNvbnRhaW5lci5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcbiAgICB0aGlzLmVuY29kZVVSSSA9IGZhbHNlO1xyXG5cclxuICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0gPSB7XHJcbiAgICAgICAgaXNvdG9wZTogZmFsc2VcclxuICAgIH07XHJcblxyXG4gICAgLy9BZGQgaGFzaCBzdXBwb3J0XHJcbiAgICBpZih0aGlzLmNvbnRhaW5lci5kYXRhKFwiaGFzaFwiKSAhPT0gbnVsbCAmJiB0aGlzLmNvbnRhaW5lci5kYXRhKFwiaGFzaFwiKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhlSGFzaCA9IHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpO1xyXG5cclxuICAgICAgICB0aGlzLnVzZUhhc2ggPSB0cnVlO1xyXG5cclxuICAgICAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2guX29uSGFzaENoYW5nZWQuYmluZCh0aGlzKSk7XHJcbiAgICB9XHJcblxyXG4gICAgLy9HZXQgY29udGFpbmVycyBvZiBmaWx0ZXJzXHJcbiAgICAvLyB0aGlzLnV0aWxzLl9zZXRDb250YWluZXJzLmNhbGwodGhpcywgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlKTtcclxuXHJcbiAgICAvL0ZpcnN0IHRpbWUgaW5pdCBpc290b3BlXHJcbiAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUgPSBuZXcgSXNvdG9wZSh0aGlzLmNvbnRhaW5lci5jb250ZXh0LCB7XHJcbiAgICAgICAgZmlsdGVyOiB0aGVIYXNoIHx8IFwiKlwiLFxyXG4gICAgICAgIGl0ZW1TZWxlY3RvcjogJHNlbGYuc2V0dGluZ3MuaXRlbVNlbGVjdG9yIHx8ICcuaXRlbScsXHJcbiAgICAgICAgbGF5b3V0TW9kZTogJHNlbGYuY29udGFpbmVyLmRhdGEoXCJsYXlvdXRcIikgfHwgXCJmaXRSb3dzXCIsXHJcbiAgICAgICAgZ2V0U29ydERhdGE6ICRzZWxmLnV0aWxzLl9nZXRTb3J0RGF0YS5jYWxsKHRoaXMpLFxyXG4gICAgICAgIGdldEZpbHRlclRlc3Q6ICRzZWxmLnV0aWxzLl9nZXRGaWx0ZXJUZXN0LmNhbGwodGhpcyksXHJcbiAgICB9KTtcclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGlzIGlzIGEgbXVsdGlwbGUgZmlsdGVyXHJcbiAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUuaXNNdWx0aXBsZSA9IHRoaXMuY29udGFpbmVyLmF0dHIodGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlck11bHRpcGxlKSB8fCBmYWxzZTtcclxuXHJcbiAgICAvL0FkZCBldmVudHMgdG8gRmlsdGVycyBhbmQgU29ydGVyc1xyXG4gICAgdGhpcy5ldmVudHMuX2F0dGFjaC5jYWxsKHRoaXMsIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZSk7XHJcblxyXG4gICAgLy8gSW5pdCBjbGVhclxyXG4gICAgdGhpcy5jbGVhci5faW5pdENsZWFyZXJzLmNhbGwodGhpcywgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSwgdGhpcy5ldmVudEVsZW1lbnRzLmNsZWFyKTtcclxuXHJcbiAgICAvLyBJbml0IGZlZWRiYWNrXHJcbiAgICB0aGlzLnRleHQuX2ZlZWRiYWNrLmNhbGwodGhpcywgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSk7XHJcblxyXG4gICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlLl9fZ2V0RmlsdGVyVGVzdCA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZS5fZ2V0RmlsdGVyVGVzdDtcclxuICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZS5fZ2V0RmlsdGVyVGVzdCA9IHRoaXMudXRpbHMuX2dldEZpbHRlclRlc3QuYmluZCh0aGlzKTtcclxuXHJcbiAgICBpZih3aW5kb3cuaW1hZ2VzTG9hZGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uaXNvdG9wZS5sYXlvdXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiB9O1xyXG4iLCIvKipcclxuKiBfYXR0YWNoOiBBdHRhY2ggY2xpY2sgZXZlbnRzIHRvIGZpbHRlcnMsIHNvcnRlcnMsIGZlZWRiYWNrLCBjbGVhclxyXG4qIEBzaW5jZSAwLjIuNFxyXG4qIEBwYXJhbSB7b2JqZWN0fSAkaW5zdGFuY2VcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlKSB7XHJcbiAgICB2YXIgJHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIGluc3RhbmNlID0gJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLFxyXG4gICAgICAgIHRpbWVzdGFtcCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxyXG5cclxuICAgICAgICBmb3JDb250YWluZXJGdWxsID0gJHNlbGYuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIgKyAnPVwiJyArIHRoaXMuY29udGFpbmVyLmF0dHIoXCJpZFwiKSArICdcIicsXHJcblxyXG4gICAgICAgIGNsaWNrZWQgPSBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlLmRlbGVnYXRlVGFyZ2V0KTtcclxuXHJcbiAgICAgICAgICAgIC8vIElmIGVsZW1lbnQgaXMgU0VMRUNULCBnZXQgc2VsZWN0ZWRcclxuICAgICAgICAgICAgaWYoZS50eXBlID09IFwiY2hhbmdlXCIpIHtcclxuICAgICAgICAgICAgICAgICRlbG0gPSAkZWxtLmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZiggJGVsbS5pcygnWycgKyAkc2VsZi5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlciArICddJykgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNlbGYuZmlsdGVyLl9pbml0RmlsdGVycy5jYWxsKCRzZWxmLCAkZWxtKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiggJGVsbS5pcygnWycgKyAkc2VsZi5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSArICddJykgKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNlbGYuc29ydGVyLl9pbml0U29ydGVycy5jYWxsKCRzZWxmLCAkZWxtKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgIC8vIExldHMgZmlyc3QgY2hlY2sgaWYgYW55dGhpbmcgaXMgdGllZCB0byBhbiBpbnN0YW5jZVxyXG4gICAgdGhpcy5ldmVudEVsZW1lbnRzID0ge1xyXG4gICAgICAgIGZpbHRlcnM6ICQoJ1snICsgZm9yQ29udGFpbmVyRnVsbCArICddIFsnICsgJHNlbGYuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIgKyAnXScpLmV4aXN0cygpIHx8ICQoJ1snICsgJHNlbGYuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIgKyAnXScpLFxyXG4gICAgICAgIHNvcnRlcnM6ICQoJ1snICsgZm9yQ29udGFpbmVyRnVsbCArICddIFsnICsgJHNlbGYuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnkgKyAnXScpLmV4aXN0cygpIHx8ICQoJ1snICsgJHNlbGYuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnkgKyAnXScpLFxyXG4gICAgICAgIGNsZWFyOiAkKCdbJyArIGZvckNvbnRhaW5lckZ1bGwgKyAnXVsnICsgJHNlbGYuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5jbGVhckZpbHRlciArICddJykuZXhpc3RzKCkgfHwgJCgnWycgKyAkc2VsZi5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyICsgJ10nKSxcclxuICAgICAgICBmZWVkYmFjazogJCgnWycgKyBmb3JDb250YWluZXJGdWxsICsgJ10gWycgKyAkc2VsZi5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZlZWRiYWNrICsgJ10nKS5leGlzdHMoKSB8fCAkKCdbJyArICRzZWxmLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmVlZGJhY2sgKyAnXScpLFxyXG5cclxuICAgICAgICBhbGw6IHt9XHJcbiAgICB9O1xyXG5cclxuICAgIC8vIENvbWJpbmUgcmVzdWx0cyB0byBvbmUgalF1ZXJ5IG9iamVjdFxyXG4gICAgdGhpcy5ldmVudEVsZW1lbnRzLmFsbCA9IHRoaXMuZXZlbnRFbGVtZW50cy5maWx0ZXJzLmFkZCh0aGlzLmV2ZW50RWxlbWVudHMuc29ydGVycyk7XHJcblxyXG4gICAgLy8gQWRkIHRoZSBldmVudHNcclxuICAgIHRoaXMuZXZlbnRFbGVtZW50cy5hbGwub2ZmKCdjbGljaycpLm9uKCdjbGljaycsIGNsaWNrZWQpO1xyXG4gICAgdGhpcy5ldmVudEVsZW1lbnRzLmFsbC5wYXJlbnQoJ3NlbGVjdCcpLm9mZignY2hhbmdlJykub24oJ2NoYW5nZScsIGNsaWNrZWQpO1xyXG5cclxufTtcclxuIiwiLyoqXHJcbiogX2NoZWNrRmlsdGVyczogY3JlYXRlIGJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAdXBkYXRlZCAwLjIuNFxyXG4qIEBwYXJhbSB7b2JqZWN0fSAkZmlsdGVyXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRlbG0pIHtcclxuICAgIHZhciAkc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgJGRhdGFGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhQ2hhaW4gPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyQ2hhaW4sXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuXHJcbiAgICAgICAgJGRhdGFDaGFpbkF0dHIgPSAkZWxtLmNsb3Nlc3QoJ1snICsgJGRhdGFDaGFpbiArICddJyksXHJcbiAgICAgICAgJGRhdGFGaWx0ZXJBdHRyID0gJGVsbS5hdHRyKCRkYXRhRmlsdGVyKSxcclxuXHJcbiAgICAgICAgbmV3RmlsdGVycyA9ICRkYXRhRmlsdGVyQXR0cixcclxuICAgICAgICAkZmlsdGVyVmFsdWUgPSAkZGF0YUZpbHRlckF0dHIsXHJcblxyXG4gICAgICAgIGNoYWluR3JvdXBOYW1lID0gJGluc3RhbmNlLmlzb3RvcGUuaXNHcm91cGVkIHx8IFwiKlwiLFxyXG5cclxuICAgICAgICBhY3RpdmVGaWx0ZXJzLCBjdXJyZW50RmlsdGVycztcclxuXHJcbiAgICBpZih0aGlzLnVzZUhhc2ggPT09IHRydWUpIHtcclxuXHJcbiAgICAgICAgdGhpcy5oYXNoLl9zZXRIYXNoLmNhbGwodGhpcywgJGluc3RhbmNlLmlzb3RvcGUsICRmaWx0ZXJWYWx1ZSk7XHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgLy8gR2V0IGN1cnJlbnQgYWN0aXZlIGZpbHRlcnMgZnJvbSBpc290b3BlIGluc3RhbmNlXHJcbiAgICAgICAgYWN0aXZlRmlsdGVycyA9ICRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuZmlsdGVyO1xyXG5cclxuICAgICAgICAvLyBDaGVjayBpZiBjbGlja2VkIGZpbHRlcidzIHZhbHVlIGlzIG5vdCBhIHdpbGRjYXJkXHJcbiAgICAgICAgaWYoYWN0aXZlRmlsdGVycyAhPT0gXCIqXCIgJiYgJGZpbHRlclZhbHVlICE9PSBcIipcIikge1xyXG4gICAgICAgICAgICBhY3RpdmVGaWx0ZXJzID0gYWN0aXZlRmlsdGVycy5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgIG5ld0ZpbHRlcnMgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIC8vTG9vcCB0aHJvdWdoIGFsbCBhY3RpdmUgZmlsdGVyc1xyXG4gICAgICAgICAgICAkLmVhY2goYWN0aXZlRmlsdGVycywgZnVuY3Rpb24oaW5kZXgsIGVsZW1lbnQpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0NoZWNrIGlmIHRoaXMgY29udGFpbmVyIGFsbG93cyBtdWx0aXBsZSBmaWx0ZXJzXHJcbiAgICAgICAgICAgICAgICBpZigkaW5zdGFuY2UuaXNvdG9wZS5pc011bHRpcGxlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMucHVzaChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Ugey8vQ29udGFpbmVyIG9ubHkgYWxsb3dzIG9uZSBmaWx0ZXJcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNvbnRhaW5lciA9ICRlbG0uY2xvc2VzdCgndWwnKTsvL0NoZWNrIGlmIHBhcmVudCBoYXMgYW4gVUxcclxuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyID0gKGNvbnRhaW5lci5sZW5ndGggPT09IDApID8gJGVsbS5jbG9zZXN0KCdzZWxlY3QnKSA6IGNvbnRhaW5lcjsvL0NoZWNrIGlmIHNlbGVjdFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjb250YWluZXIgPSAoY29udGFpbmVyLmxlbmd0aCA9PT0gMCkgPyAkZWxtLnBhcmVudCgpIDogY29udGFpbmVyOy8vQ2hlY2sgaWYgc2VsZWN0XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vUGFzcyBvbiBmaWx0ZXJzIHRoYXQgYXJlIG5vdCBpbiBzYW1lIGNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCBjb250YWluZXIuZmluZCgnWycgKyAkZGF0YUZpbHRlciArICc9XCInICsgZWxlbWVudCArICdcIl0nKS5sZW5ndGggPT09IDAgfHwgZWxlbWVudCA9PT0gJGZpbHRlclZhbHVlICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmKCBuZXdGaWx0ZXJzLmluZGV4T2YoJGZpbHRlclZhbHVlKSA9PT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzLnB1c2goJGZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMuc3BsaWNlKG5ld0ZpbHRlcnMuaW5kZXhPZigkZmlsdGVyVmFsdWUpLCAxKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgbmV3RmlsdGVycyA9IG5ld0ZpbHRlcnMuam9pbihcIixcIik7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy9JZiBmaWx0ZXJzIGlzIGVtcHR5IHRoZW4gcmVzZXQgaXQgYWxsXHJcbiAgICAgICAgaWYobmV3RmlsdGVycyA9PT0gXCJcIikge1xyXG4gICAgICAgICAgICBuZXdGaWx0ZXJzID0gXCIqXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAkaW5zdGFuY2UuaXNvdG9wZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgZmlsdGVyOiBuZXdGaWx0ZXJzXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX29uSXNvdG9wZUNoYW5nZS5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcbiAgICB9XHJcblxyXG59O1xyXG4iLCIvKipcbiAqIF9jaGVja0FjdGl2ZTogQ2hlY2sgaWYgYnV0dG9ucyBuZWVkIGFuIGFjdGl2ZSBjbGFzc1xuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UsIGVsbSkge1xuXG4gICAgdmFyICRkYXRhRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcixcbiAgICAgICAgJGRlZmF1bHRGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmZpbHRlcixcbiAgICAgICAgJGluc3RhbmNlID0gJGluc3RhbmNlIHx8IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmUsXG5cbiAgICAgICAgZm9yQ29udGFpbmVyRnVsbCA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIgKyAnPVwiJyArIHRoaXMuY29udGFpbmVyLmF0dHIoXCJpZFwiKSArICdcIic7XG5cbiAgICAkLmVhY2goJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIuc3BsaXQoXCIsXCIpLCBmdW5jdGlvbiggaW5kZXgsIGZpbHRlciApIHtcblxuICAgICAgICB2YXIgdGhlRmlsdGVyID0gJCgnWycgKyBmb3JDb250YWluZXJGdWxsICsgJ10gWycgKyAkZGF0YUZpbHRlciArICc9XCInICsgZmlsdGVyICsgJ1wiXScpLmV4aXN0cygpIHx8ICQoJ1snICsgJGRhdGFGaWx0ZXIgKyAnPVwiJyArIGZpbHRlciArICdcIl0nKSxcbiAgICAgICAgICAgIGFsbEZpbHRlcnMgPSAkKCdbJyArIGZvckNvbnRhaW5lckZ1bGwgKyAnXSBbJyArICRkYXRhRmlsdGVyICsgJ10nKS5leGlzdHMoKSB8fCAkKCdbJyArICRkYXRhRmlsdGVyICsgJ10nKSxcbiAgICAgICAgICAgIGRlZmF1bHRGaWx0ZXIgPSAgJCgnWycgKyBmb3JDb250YWluZXJGdWxsICsgJ10gWycgKyAkZGF0YUZpbHRlciArICc9XCInICsgJGRlZmF1bHRGaWx0ZXIgKyAnXCJdJykuZXhpc3RzKCkgfHwgJCgnWycgKyAkZGF0YUZpbHRlciArICc9XCInICsgJGRlZmF1bHRGaWx0ZXIgKyAnXCJdJyk7XG5cbiAgICAgICAgaWYodGhlRmlsdGVyLnByb3AoXCJ0YWdOYW1lXCIpICYmIHRoZUZpbHRlci5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09PSBcIm9wdGlvblwiKSB7XG5cbiAgICAgICAgICAgIHRoZUZpbHRlci5hdHRyKCdzZWxlY3RlZCcsJ3NlbGVjdGVkJyk7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYoaW5kZXggPT09IDApIHtcbiAgICAgICAgICAgICAgICAvL1JlbW92ZSBhbGwgYWN0aXZlIGNsYXNzZXMgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgIGFsbEZpbHRlcnMucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy9BZGQgYWN0aXZlIGNsYXNzZXNcbiAgICAgICAgICAgIHZhciBhY3RpdmUgPSB0aGVGaWx0ZXIuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcblxuICAgICAgICAgICAgaWYoYWN0aXZlLmxlbmd0aCA+IDAgJiYgZmlsdGVyICE9ICRkZWZhdWx0RmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgZGVmYXVsdEZpbHRlci5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgIH1cblxuICAgICAgICAvLyAkLmVhY2goJGluc3RhbmNlLmZpbHRlckNvbnRhaW5lciwgZnVuY3Rpb24oIGlkeCwgY29udGFpbmVyICkge1xuICAgICAgICAvLyAgICAgdmFyIGVsbSA9IGNvbnRhaW5lci5lbG0uZmluZChcIltcIiskZGF0YUZpbHRlcitcIj1cXFwiXCIrZmlsdGVyK1wiXFxcIl1cIik7XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICBpZihlbG0ucHJvcChcInRhZ05hbWVcIikgJiYgZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwib3B0aW9uXCIpIHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICBlbG0uYXR0cignc2VsZWN0ZWQnLCdzZWxlY3RlZCcpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgfSBlbHNlIHtcbiAgICAgICAgLy9cbiAgICAgICAgLy8gICAgICAgICBpZihpbmRleCA9PT0gMCkge1xuICAgICAgICAvLyAgICAgICAgICAgICAvL1JlbW92ZSBhbGwgYWN0aXZlIGNsYXNzZXMgZmlyc3QgdGltZVxuICAgICAgICAvLyAgICAgICAgICAgICBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFGaWx0ZXIrXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgIC8vICAgICAgICAgfVxuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgIC8vQWRkIGFjdGl2ZSBjbGFzc2VzXG4gICAgICAgIC8vICAgICAgICAgdmFyIGFjdGl2ZSA9IGVsbS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICAvL1xuICAgICAgICAvLyAgICAgICAgIGlmKGFjdGl2ZS5sZW5ndGggPiAwICYmIGZpbHRlciAhPSAkZGVmYXVsdEZpbHRlcikge1xuICAgICAgICAvLyAgICAgICAgICAgICBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFGaWx0ZXIrXCI9XFxcIlwiKyRkZWZhdWx0RmlsdGVyK1wiXFxcIl1cIikucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgLy8gICAgICAgICB9XG4gICAgICAgIC8vXG4gICAgICAgIC8vICAgICB9XG4gICAgICAgIC8vIH0pO1xuXG4gICAgfSk7XG5cbn07XG4iLCIvKipcbiogX2Zvcm1hdEhhc2g6IEZvcm1hdCBtdWx0aXBsZSBmaWx0ZXJzIGludG8gb25lIHN0cmluZyBiYXNlZCBvbiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuKiBAc2luY2UgMC4xLjBcbiogQHBhcmFtIHtyZWdleH0gcmVcbiogQHBhcmFtIHtzdHJpbmd9IHN0clxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmUsIHN0cikge1xuICAgIHZhciBtYXRjaGVzID0ge30sXG4gICAgICAgIG1hdGNoO1xuXG4gICAgd2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKG1hdGNoLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWF0Y2hbM10gIT09IG51bGwgJiYgbWF0Y2hbM10gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzNdXSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYobWF0Y2hlc1ttYXRjaFsxXV0gPT09IG51bGwgfHwgbWF0Y2hlc1ttYXRjaFsxXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2hbMV1dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXS5wdXNoKG1hdGNoWzJdKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlcztcbn07XG4iLCIvKipcbiAqIF9nZXRIYXNoOiBHZXQgd2luZG93LmxvY2F0aW9uLmhhc2ggYW5kIGZvcm1hdCBpdCBmb3IgSXNvdG9wZVxuICogQHNpbmNlIDAuMS4wXG4gKi9cblxuIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyICRoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2ggfHwgZmFsc2UsXG4gICAgICAgICRuZXdIYXNoID0gXCJcIjtcblxuICAgICRoYXNoID0gKCRoYXNoICE9PSBmYWxzZSAmJiAkaGFzaCAhPT0gXCIjXCIgJiYgJGhhc2ggIT09IFwiXCIpID8gZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSA6ICcqJztcblxuICAgIC8vUmVtb3ZlIGhhc2ggZnJvbSBmaXJzdCBjaGFyYWN0ZXIgaWYgaXRzIGV4aXN0XG4gICAgaWYgKCRoYXNoLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgICAkaGFzaCA9ICRoYXNoLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIHZhciBoYXNoQXJyYXkgPSAkaGFzaC5zcGxpdChcIiZcIik7XG4gICAgJC5lYWNoKGhhc2hBcnJheSwgZnVuY3Rpb24oa2V5LCAkcGFydEhhc2gpIHtcblxuICAgICAgICBpZigkcGFydEhhc2guaW5kZXhPZihcIj1cIikgIT09IC0xKSB7XG5cbiAgICAgICAgICAgIHZhciB0bXAgPSAkcGFydEhhc2guc3BsaXQoXCI9XCIpLFxuICAgICAgICAgICAgICAgIGFyciA9IFtdLCB2YWx1ZXMsIG5hbWU7XG5cbiAgICAgICAgICAgIGlmKHRtcC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IHRtcFswXTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMgPSB0bXBbMV0ucmVwbGFjZSgvXFwnL2csIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJG5ld0hhc2ggKz0gYXJyLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbmV3SGFzaCArPSAoJHBhcnRIYXNoID09IFwiKlwiIHx8ICRwYXJ0SGFzaC5jaGFyQXQoMCkgPT0gJy4nKSA/ICRwYXJ0SGFzaDogXCIuXCIgKyAkcGFydEhhc2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZihrZXkgIT0gKGhhc2hBcnJheS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgJG5ld0hhc2ggKz0gXCIsXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgIHJldHVybiAkbmV3SGFzaDtcblxuIH07XG4iLCIvKipcclxuKiBfb25IYXNoQ2hhbmdlOiBmaXJlcyB3aGVuIGxvY2F0aW9uLmhhc2ggaGFzIGJlZW4gY2hhbmdlZFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fc2V0SXNvdG9wZS5jYWxsKHRoaXMsIHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpKTtcclxufTtcclxuIiwiLyoqXG4gKiBfc2V0SGFzaDogU2V0IGEgbmV3IGxvY2F0aW9uLmhhc2ggYWZ0ZXIgZm9ybWF0dGluZyBpdFxuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gJG5ld0hhc2hcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSwgJG5ld0hhc2gpIHtcbiAgICB2YXIgJGN1cnJlbnRIYXNoID0gKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlciA9PSBcIipcIikgPyBcIlwiIDogJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyLFxuICAgICAgICAkY29tYmluZWRIYXNoLFxuICAgICAgICAkZW5kSGFzaCA9IFtdO1xuXG4gICAgaWYoJG5ld0hhc2ggIT0gXCIqXCIpIHtcblxuICAgICAgICBpZigkY3VycmVudEhhc2guaW5kZXhPZigkbmV3SGFzaCkgPT09IC0xKSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoICsgJG5ld0hhc2g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoLnJlcGxhY2UoJG5ld0hhc2gsIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRmb3JtYXR0ZWRIYXNoID0gdGhpcy5oYXNoLl9mb3JtYXRIYXNoKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXXwoLltBLVphLXowLTldKykvZywgJGNvbWJpbmVkSGFzaCk7XG5cbiAgICAgICAgJC5lYWNoKCRmb3JtYXR0ZWRIYXNoLCBmdW5jdGlvbihrZXksIGVsbSkge1xuICAgICAgICAgICAgaWYoZWxtID09PSB0cnVlKSB7Ly9pc0NsYXNzXG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaCggKGtleS5jaGFyQXQoMCkgPT0gJy4nKSA/IGtleS5zbGljZSgxKSA6IGtleSApO1xuICAgICAgICAgICAgfSBlbHNlIHsvL2lzT2JqZWN0XG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaChrZXkgKyBcIj1cIiArIGVsbS5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRlbmRIYXNoID0gJGVuZEhhc2guam9pbihcIiZcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGVuZEhhc2ggPSAkbmV3SGFzaDtcbiAgICB9XG5cbiAgICBpZigkZW5kSGFzaCA9PT0gXCIqXCIgfHwgJGVuZEhhc2ggPT09IFwiXCIpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gKHRoaXMuZW5jb2RlVVJJID09PSB0cnVlKSA/IGVuY29kZVVSSUNvbXBvbmVudCgkZW5kSGFzaCkgOiAkZW5kSGFzaDtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVuZEhhc2g7XG59O1xuIiwialF1ZXJ5LmZuLmV4aXN0cyA9IGZ1bmN0aW9uKCl7XHJcbiAgICByZXR1cm4gKHRoaXMubGVuZ3RoID4gMCkgPyB0aGlzIDogZmFsc2U7XHJcbn07XHJcblxyXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XHJcbiAgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihvVGhpcykge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIC8vIGNsb3Nlc3QgdGhpbmcgcG9zc2libGUgdG8gdGhlIEVDTUFTY3JpcHQgNVxyXG4gICAgICAvLyBpbnRlcm5hbCBJc0NhbGxhYmxlIGZ1bmN0aW9uXHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIC0gd2hhdCBpcyB0cnlpbmcgdG8gYmUgYm91bmQgaXMgbm90IGNhbGxhYmxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFBcmdzICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxyXG4gICAgICAgIGZUb0JpbmQgPSB0aGlzLFxyXG4gICAgICAgIGZOT1AgICAgPSBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgIGZCb3VuZCAgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZUb0JpbmQuYXBwbHkodGhpcyBpbnN0YW5jZW9mIGZOT1AgJiYgb1RoaXMgPyB0aGlzIDogb1RoaXMsIGFBcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICBmTk9QLnByb3RvdHlwZSA9IHRoaXMucHJvdG90eXBlO1xyXG4gICAgZkJvdW5kLnByb3RvdHlwZSA9IG5ldyBmTk9QKCk7XHJcblxyXG4gICAgcmV0dXJuIGZCb3VuZDtcclxuICB9O1xyXG59XHJcblxyXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS50cmltKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XHJcbiAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXgpIHtcclxuXHJcbiAgICB2YXIgaztcclxuXHJcbiAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZ1xyXG4gICAgLy8gICAgdGhlIHRoaXMgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxyXG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcblxyXG4gICAgLy8gMi4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0XHJcbiAgICAvLyAgICBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxyXG4gICAgLy8gMy4gTGV0IGxlbiBiZSBUb1VpbnQzMihsZW5WYWx1ZSkuXHJcbiAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XHJcblxyXG4gICAgLy8gNC4gSWYgbGVuIGlzIDAsIHJldHVybiAtMS5cclxuICAgIGlmIChsZW4gPT09IDApIHtcclxuICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDUuIElmIGFyZ3VtZW50IGZyb21JbmRleCB3YXMgcGFzc2VkIGxldCBuIGJlXHJcbiAgICAvLyAgICBUb0ludGVnZXIoZnJvbUluZGV4KTsgZWxzZSBsZXQgbiBiZSAwLlxyXG4gICAgdmFyIG4gPSArZnJvbUluZGV4IHx8IDA7XHJcblxyXG4gICAgaWYgKE1hdGguYWJzKG4pID09PSBJbmZpbml0eSkge1xyXG4gICAgICBuID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyA2LiBJZiBuID49IGxlbiwgcmV0dXJuIC0xLlxyXG4gICAgaWYgKG4gPj0gbGVuKSB7XHJcbiAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA3LiBJZiBuID49IDAsIHRoZW4gTGV0IGsgYmUgbi5cclxuICAgIC8vIDguIEVsc2UsIG48MCwgTGV0IGsgYmUgbGVuIC0gYWJzKG4pLlxyXG4gICAgLy8gICAgSWYgayBpcyBsZXNzIHRoYW4gMCwgdGhlbiBsZXQgayBiZSAwLlxyXG4gICAgayA9IE1hdGgubWF4KG4gPj0gMCA/IG4gOiBsZW4gLSBNYXRoLmFicyhuKSwgMCk7XHJcblxyXG4gICAgLy8gOS4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXHJcbiAgICB3aGlsZSAoayA8IGxlbikge1xyXG4gICAgICAvLyBhLiBMZXQgUGsgYmUgVG9TdHJpbmcoaykuXHJcbiAgICAgIC8vICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxyXG4gICAgICAvLyBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZVxyXG4gICAgICAvLyAgICBIYXNQcm9wZXJ0eSBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxyXG4gICAgICAvLyAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjXHJcbiAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cclxuICAgICAgLy8gICAgaS4gIExldCBlbGVtZW50SyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldFxyXG4gICAgICAvLyAgICAgICAgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCB0aGUgYXJndW1lbnQgVG9TdHJpbmcoaykuXHJcbiAgICAgIC8vICAgaWkuICBMZXQgc2FtZSBiZSB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIHRoZVxyXG4gICAgICAvLyAgICAgICAgU3RyaWN0IEVxdWFsaXR5IENvbXBhcmlzb24gQWxnb3JpdGhtIHRvXHJcbiAgICAgIC8vICAgICAgICBzZWFyY2hFbGVtZW50IGFuZCBlbGVtZW50Sy5cclxuICAgICAgLy8gIGlpaS4gIElmIHNhbWUgaXMgdHJ1ZSwgcmV0dXJuIGsuXHJcbiAgICAgIGlmIChrIGluIE8gJiYgT1trXSA9PT0gc2VhcmNoRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBrO1xyXG4gICAgICB9XHJcbiAgICAgIGsrKztcclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxuICB9O1xyXG59XHJcbiIsInZhciAkID0gd2luZG93LmpRdWVyeTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZSA9IHJlcXVpcmUoXCIuL2NvbnN0cnVjdG9yL3Byb3RvdHlwZS5qc1wiKTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZS5wcm90b3R5cGUgPSB7XHJcbiAgICBpbnN0YW5jZXM6IHt9LFxyXG4gICAgYWxsRmlsdGVyczoge30sXHJcbiAgICBhbGxTb3J0ZXJzOiB7fSxcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogJC5zaW1wbGVJc290b3BlLFxyXG5cclxuICAgIGhhc2g6IHtcclxuICAgICAgICBfZ2V0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fZ2V0SGFzaC5qc1wiKSxcclxuICAgICAgICBfc2V0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fc2V0SGFzaC5qc1wiKSxcclxuICAgICAgICBfZm9ybWF0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fZm9ybWF0SGFzaC5qc1wiKSxcclxuICAgICAgICBfb25IYXNoQ2hhbmdlZDogcmVxdWlyZShcIi4vaGFzaC9fb25IYXNoQ2hhbmdlZC5qc1wiKVxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIF9pbml0RmlsdGVyczogcmVxdWlyZShcIi4vZmlsdGVyL19pbml0RmlsdGVycy5qc1wiKSxcclxuICAgICAgICBfc2V0QWN0aXZlQ2xhc3M6IHJlcXVpcmUoXCIuL2ZpbHRlci9fc2V0QWN0aXZlQ2xhc3MuanNcIilcclxuICAgIH0sXHJcbiAgICBzb3J0ZXI6IHtcclxuICAgICAgICBfaW5pdFNvcnRlcnM6IHJlcXVpcmUoXCIuL3NvcnRlci9faW5pdFNvcnRlcnMuanNcIiksXHJcbiAgICAgICAgX3NldEFjdGl2ZUNsYXNzOiByZXF1aXJlKFwiLi9zb3J0ZXIvX3NldEFjdGl2ZUNsYXNzLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgY2xlYXI6IHtcclxuICAgICAgICBfaW5pdENsZWFyZXJzOiByZXF1aXJlKFwiLi9jbGVhci9faW5pdENsZWFyZXJzLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vY2xlYXIvX2NoZWNrLmpzXCIpLFxyXG4gICAgICAgIF9fY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICB0ZXh0OiB7XHJcbiAgICAgICAgX2ZlZWRiYWNrOiByZXF1aXJlKFwiLi90ZXh0L19mZWVkYmFjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIGV2ZW50czoge1xyXG4gICAgICAgIF9hdHRhY2g6IHJlcXVpcmUoXCIuL2V2ZW50cy9fYXR0YWNoLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgdXRpbHM6IHtcclxuICAgICAgICAvLyBfc2V0Q29udGFpbmVyczogcmVxdWlyZShcIi4vdXRpbHMvX3NldENvbnRhaW5lcnMuanNcIiksXHJcbiAgICAgICAgLy8gX2dldEZvckNvbnRhaW5lckFuZElkOiByZXF1aXJlKFwiLi91dGlscy9fZ2V0Rm9yQ29udGFpbmVyQW5kSWQuanNcIiksXHJcbiAgICAgICAgLy8gX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZTogcmVxdWlyZShcIi4vdXRpbHMvX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZS5qc1wiKSxcclxuICAgICAgICBfZ2V0U29ydERhdGE6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRTb3J0RGF0YS5qc1wiKSxcclxuICAgICAgICBfZ2V0RmlsdGVyVGVzdDogcmVxdWlyZShcIi4vdXRpbHMvX2dldEZpbHRlclRlc3QuanNcIiksXHJcbiAgICAgICAgX2dldEluc3RhbmNlczogcmVxdWlyZShcIi4vdXRpbHMvX2dldEluc3RhbmNlcy5qc1wiKVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX29uQmVmb3JlSXNvdG9wZUNoYW5nZTogZmlyZXMgYmVmb3JlIHRoZSBJc290b3BlIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiAgICAqL1xyXG4gICAgX29uQmVmb3JlSXNvdG9wZUNoYW5nZTogZnVuY3Rpb24oJGluc3RhbmNlKSB7fSxcclxuXHJcbiAgICAvKipcclxuICAgICogX29uSXNvdG9wZUNoYW5nZTogZmlyZXMgd2hlbiB0aGUgSXNvdG9wZSBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZFxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9vbklzb3RvcGVDaGFuZ2U6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyLl9zZXRBY3RpdmVDbGFzcy5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy5zb3J0ZXIuX3NldEFjdGl2ZUNsYXNzLmNhbGwodGhpcywgJGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgIHRoaXMudGV4dC5fZmVlZGJhY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX3NldElzb3RvcGU6IFJlY29uZmlndXJlIGlzb3RvcGVcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkc2VsZWN0b3JcclxuICAgICovXHJcbiAgICBfc2V0SXNvdG9wZTogZnVuY3Rpb24oJHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICBmaWx0ZXI6ICRzZWxlY3RvclxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UodGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuJC5mbi5zaW1wbGVJc290b3BlID0gcmVxdWlyZShcIi4vY29uc3RydWN0b3IvanF1ZXJ5LmpzXCIpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkLmVhY2goJChcIltkYXRhLWlzb3RvcGVdXCIpLCBmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgICQoZWxtKS5zaW1wbGVJc290b3BlKCk7XHJcbiAgICB9KTtcclxufSk7XHJcbiIsIi8qKlxyXG4qIF9jaGVja1NvcnQ6IGNyZWF0ZSBidXR0b25zIGFuZCBhZGQgZXZlbnRzIHRvIGl0XHJcbiogQHVwZGF0ZWQgMC4yLjRcclxuKiBAcGFyYW0ge29iamVjdH0gJGZpbHRlclxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkZWxtKSB7XHJcbiAgICB2YXIgJHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkZGF0YVNvcnREaXJlY3Rpb24gPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydERpcmVjdGlvbixcclxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAgICAgJHNvcnRBcnJheSA9IFtdLFxyXG4gICAgICAgICRpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcblxyXG4gICAgICAgICRzb3J0QnlWYWx1ZSA9ICcnLFxyXG4gICAgICAgICRzb3J0QXNjID0gZmFsc2UsXHJcbiAgICAgICAgJGRhdGFTb3J0QXR0ciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeSk7XHJcblxyXG4gICAgLy8gVE9ETzogSSdtIGdhbm5hIGxlYXZlIHRoaXMgY29kZSBoZXJlIGZvciBub3csIGlmIHdlIGV2ZXIgbmVlZCB0byBhZGQgbXVsdGlwbGUgc3VwcG9ydCBvbiBzb3J0ZXJzXHJcbiAgICAvLyBpZigkc2VsZi5maWx0ZXJNdWx0aXBsZSkge1xyXG4gICAgLy9cclxuICAgIC8vICAgICAkc29ydEJ5VmFsdWUgPSBbXTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgaWYoJGRhdGFTb3J0QXR0ciA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICRzb3J0QXJyYXkgPSBbXTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGlmKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSA9PT0gLTEpIHsvL2l0ZW0gbm90IGZpbHRlcmVkXHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgJHNvcnRBcnJheS5wdXNoKCRkYXRhU29ydEF0dHIpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgfSBlbHNlIHsvL2l0ZW0gYWxyZWFkeSBmaWx0ZXJlZFxyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGlmKCRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuc29ydEFzY2VuZGluZyAhPT0gKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pLnRvTG93ZXJDYXNlKCkgPT09IFwiYXNjXCIpKSB7Ly9BcmUgd2UgY2hhbmdpbmcgZGVzYyBvciBhc2M/XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgLy9EbyBub3RoaW5nLCBhcnJheSB3aWxsIGJlIHRoZSBzYW1lLCB3ZSdyZSBvbmx5IGNoYW5pZ25nIHNvcnQgZGlyZWN0aW9uXHJcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICRzb3J0QXJyYXkuc3BsaWNlKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSwgMSk7IC8vc2FtZSBpdGVtIGZpbHRlcmVkLCByZW1vdmUgdGhpcyBpdGVtIGZyb20gYXJyYXlcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGlmKCRzb3J0QXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAvLyAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkZWZhdWx0U29ydDtcclxuICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAkc29ydEJ5VmFsdWUgPSAkc29ydEFycmF5O1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyB9IGVsc2Uge1xyXG4gICAgLy8gICAgICRzb3J0QnlWYWx1ZSA9ICRkYXRhU29ydEF0dHI7XHJcbiAgICAvLyB9XHJcblxyXG4gICAgJHNvcnRCeVZhbHVlID0gJGRhdGFTb3J0QXR0cjtcclxuXHJcbiAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKSAhPT0gbnVsbCAmJiAkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikudG9Mb3dlckNhc2UoKSA9PT0gXCJhc2NcIikge1xyXG4gICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG5cclxuICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnRCeSkgPT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgJHNvcnRBc2MgPSB0cnVlO1xyXG4gICAgfVxyXG5cclxuICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgIHNvcnRCeTogJHNvcnRCeVZhbHVlLFxyXG4gICAgICAgIHNvcnRBc2NlbmRpbmc6ICRzb3J0QXNjXHJcbiAgICB9KTtcclxuXHJcbiAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcblxyXG59O1xyXG4iLCIvKipcbiAqIF9jaGVja0FjdGl2ZTogQ2hlY2sgaWYgYnV0dG9ucyBuZWVkIGFuIGFjdGl2ZSBjbGFzc1xuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xuXG4gICAgdmFyICRkYXRhU29ydCA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcbiAgICAgICAgJGluc3RhbmNlID0gaW5zdGFuY2UgfHwgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcbiAgICAgICAgJHNvcnRIaXN0b3J5ID0gJGluc3RhbmNlLmlzb3RvcGUuc29ydEhpc3RvcnksXG4gICAgICAgICRzb3J0QXNjZW5kaW5nID0gJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5zb3J0QXNjZW5kaW5nLFxuXG4gICAgICAgIGZvckNvbnRhaW5lckZ1bGwgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyICsgJz1cIicgKyB0aGlzLmNvbnRhaW5lci5hdHRyKFwiaWRcIikgKyAnXCInLFxuICAgICAgICBzb3J0RGlyZWN0aW9uID0gXCJkZXNjXCI7XG5cbiAgICBpZigkc29ydEFzY2VuZGluZykge1xuICAgICAgICBzb3J0RGlyZWN0aW9uID0gXCJhc2NcIjtcbiAgICB9XG5cbiAgICB2YXIgdGhlU29ydGVyID0gJCgnWycgKyBmb3JDb250YWluZXJGdWxsICsgJ10gWycgKyAkZGF0YVNvcnQgKyAnPVwiJyArICRzb3J0SGlzdG9yeVswXSArICdcIl1bZGF0YS1zb3J0LWRpcmVjdGlvbj1cIicgKyBzb3J0RGlyZWN0aW9uICsgJ1wiXScpLmV4aXN0cygpIHx8ICQoJ1snICsgJGRhdGFTb3J0ICsgJz1cIicgKyAkc29ydEhpc3RvcnlbMF0gKyAnXCJdW2RhdGEtc29ydC1kaXJlY3Rpb249XCInICsgc29ydERpcmVjdGlvbiArICdcIl0nKSxcbiAgICAgICAgYWxsU29ydGVycyA9ICQoJ1snICsgZm9yQ29udGFpbmVyRnVsbCArICddIFsnICsgJGRhdGFTb3J0ICsgJ10nKS5leGlzdHMoKSB8fCAkKCdbJyArICRkYXRhU29ydCArICddJyksXG4gICAgICAgIGRlZmF1bHRTb3J0ZXIgPSAgJCgnWycgKyBmb3JDb250YWluZXJGdWxsICsgJ10gWycgKyAkZGF0YVNvcnQgKyAnPVwiJyArICRkZWZhdWx0U29ydCArICdcIl0nKS5leGlzdHMoKSB8fCAkKCdbJyArICRkYXRhU29ydCArICc9XCInICsgJGRlZmF1bHRTb3J0ICsgJ1wiXScpO1xuXG4gICAgaWYodGhlU29ydGVyLnByb3AoXCJ0YWdOYW1lXCIpICYmIHRoZVNvcnRlci5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09PSBcIm9wdGlvblwiKSB7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAgIC8vUmVtb3ZlIGFsbCBhY3RpdmUgY2xhc3NlcyBmaXJzdCB0aW1lXG4gICAgICAgIGFsbFNvcnRlcnMucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcblxuICAgICAgICAvL0FkZCBhY3RpdmUgY2xhc3Nlc1xuICAgICAgICB2YXIgYWN0aXZlID0gdGhlU29ydGVyLmFkZENsYXNzKCRhY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgaWYoYWN0aXZlLmxlbmd0aCA+IDAgJiYgJHNvcnRIaXN0b3J5WzBdICE9ICRkZWZhdWx0U29ydCkge1xuICAgICAgICAgICAgZGVmYXVsdFNvcnRlci5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZGVmYXVsdFNvcnRlci5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgfVxuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpbnN0YW5jZSkge1xyXG4gICAgdmFyICRpbnN0YW5jZSA9IGluc3RhbmNlIHx8IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQuZWFjaCh0aGlzLmV2ZW50RWxlbWVudHMuZmVlZGJhY2ssIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRmZWVkYmFjayA9ICQoZWxtKTtcclxuXHJcbiAgICAgICAgJGZlZWRiYWNrLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcblxyXG4gICAgICAgICAgICAkZWxtLnRleHQoJGVsbS5hdHRyKFwiZGF0YS1mZWVkYmFja1wiKS5yZXBsYWNlKFwie2RlbHRhfVwiLCAkaW5zdGFuY2UuaXNvdG9wZS5maWx0ZXJlZEl0ZW1zLmxlbmd0aCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZmlsdGVyKSB7XHJcbiAgICB2YXIgZ3VpZCA9IHRoaXMuZ3VpZCxcclxuICAgICAgICAkaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiggaXRlbSApIHtcclxuXHJcbiAgICAgICAgdmFyIGZpbHRlcnMgPSBmaWx0ZXIuc3BsaXQoXCIsXCIpLFxyXG4gICAgICAgICAgICBhY3RpdmUgPSBbXSxcclxuICAgICAgICAgICAgY29udGFpbmVyID0gW107XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAvL0VuYWJsZSBmaWx0ZXJpbmcgd2l0aCBkYXRhLWF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgaWYoZmlsdGVyc1tpXS5pbmRleE9mKFwiZGF0YS1cIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNhdCA9IGZpbHRlcnNbaV0ucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMVwiKS50cmltKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBmaWx0ZXJzW2ldLnJlcGxhY2UoL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csIFwiJDJcIikudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkgIT09IHVuZGVmaW5lZCAmJiBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkuaW5kZXhPZiggdmFsdWUgKSAhPT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vRGVmYXVsdCBmaWx0ZXJpbmdcclxuICAgICAgICAgICAgICAgIGlmKCBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmlzKCBmaWx0ZXJzW2ldICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2goZmlsdGVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZmlsdGVycy5pbmRleE9mKFwiKlwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZigkaW5zdGFuY2UuaXNvdG9wZS5pc011bHRpcGxlID09IFwib3JcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZS5sZW5ndGggPT0gZmlsdGVycy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59O1xyXG4iLCIvKipcclxuKiBfZ2V0SW5zdGFuY2VzXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRtcCA9IFtdO1xyXG5cclxuICAgICQuZWFjaCh0aGlzLmluc3RhbmNlcywgZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICB0bXAucHVzaChlbG0uaXNvdG9wZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdG1wO1xyXG59O1xyXG4iLCIvKipcclxuICogX2dldFNvcnREYXRhOiBHZXQgdGhlIGRhdGEtc29ydC1ieSBhdHRyaWJ1dGVzIGFuZCBtYWtlIHRoZW0gaW50byBhbiBJc290b3BlIFwiZ2V0U29ydERhdGFcIiBvYmplY3RcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9ICBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkc29ydERhdGEgPSB7fSxcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGRhdGFTb3J0QnlTZWxlY3RvciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnlTZWxlY3RvcixcclxuICAgICAgICAkZGF0YVNvcnRCeURlZmF1bHQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQ7XHJcblxyXG4gICAgJCgnWycgKyAkZGF0YVNvcnRCeSArICddLCBbJyArICRkYXRhU29ydEJ5U2VsZWN0b3IgKyAnXScpLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgJG5hbWUgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpIHx8IG51bGwsXHJcbiAgICAgICAgICAgICRzZWxlY3RvciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeVNlbGVjdG9yKSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZigkbmFtZSAhPSAkZGF0YVNvcnRCeURlZmF1bHQpIHtcclxuICAgICAgICAgICAgaWYoJG5hbWUgIT09IG51bGwgJiYgJHNlbGVjdG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAkc29ydERhdGFbJG5hbWVdID0gJHNlbGVjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJJc290b3BlIHNvcnRpbmc6IFwiKyRkYXRhU29ydEJ5K1wiIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiIGFyZSByZXF1aXJlZC4gQ3VycmVudGx5IGNvbmZpZ3VyZWQgXCIrJGRhdGFTb3J0QnkrXCI9J1wiICsgJG5hbWUgKyBcIicgYW5kIFwiKyRkYXRhU29ydEJ5U2VsZWN0b3IrXCI9J1wiICsgJHNlbGVjdG9yICsgXCInXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuICRzb3J0RGF0YTtcclxufTtcclxuIl19
