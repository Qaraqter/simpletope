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