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

module.exports = function($instance) {

    var $clearFilter = this.settings.dataSelectors.clearFilter,
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $dataFilter = this.settings.dataSelectors.filter,
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $activeClass = this.settings.defaults.classNames.active,
        $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.clearContainer, function(key, container) {

        container.elm.each(function(idx, elm) {
            var $elm = $(elm),
                $history = $instance.isotope.sortHistory;

            if($instance.isotope.options.filter != $defaultFilter || $history[$history.length - 1] != $defaultSort) {
                $elm.removeClass("hide").show();
            } else {
                $elm.hide();
            }

        });
    });

};

},{}],3:[function(require,module,exports){
module.exports = function() {
    var $clearFilter = this.settings.dataSelectors.clearFilter,
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.clearContainer, function(key, container) {
        var $clearers = container.elm;

        $clearers.each(function(idx, elm) {
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
                    filterMethod: 'data-filter-method',//Depracated
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

    $.each(instances, function(idx, elm) {
        elm.sorter._createButtons.call(elm);
        elm.filter._createButtons.call(elm);
        elm.clear._createButtons.call(elm);
        elm.text._feedback.call(elm);
        elm.clear.__check.call(elm);
    });

    return instances;

};

},{}],5:[function(require,module,exports){
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

},{}],6:[function(require,module,exports){
/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function($instance) {

    var $dataFilter = this.settings.dataSelectors.filter,
        $defaultFilter = this.settings.defaults.filter,
        $instance = $instance || this.instances[this.guid],
        $activeClass = this.settings.defaults.classNames.active;

    $.each($instance.isotope.options.filter.split(","), function( index, filter ) {

        $.each($instance.filterContainer, function( idx, container ) {
            var elm = container.elm.find("["+$dataFilter+"=\""+filter+"\"]");

            if(elm.prop("tagName") && elm.prop("tagName").toLowerCase() === "option") {

                elm.attr('selected','selected');

            } else {

                if(index === 0) {
                    //Remove all active classes first time
                    container.elm.find("["+$dataFilter+"]").removeClass($activeClass);
                }

                //Add active classes
                var active = elm.addClass($activeClass);

                if(active.length > 0 && filter != $defaultFilter) {
                    container.elm.find("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
                }

            }
        });

    });

};

},{}],7:[function(require,module,exports){
/**
* _createFilters: create buttons and add events to it
* @since 0.1.0
* @updated 0.2.1
*/

module.exports = function() {
    var $dataFilter = this.settings.dataSelectors.filter,
        $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.filterContainer, function(key, container) {
        var $filters = container.elm.find('['+$dataFilter+']');

        $filters.each(function(idx, elm) {
            var $elm = $(elm),
                how = {
                    eventName: $elm.prop("tagName").toLowerCase() == "option" ? "change" : "click",
                    element: $elm.prop("tagName").toLowerCase() == "option" ? $elm.closest("select") : $elm
                };

            how.element.on(how.eventName, function(e) {
                e.preventDefault();

                // TODO: Do not return false before setting isotope filters
                if(how.eventName == "change") {
                    if(how.element.find('option:selected')[0] != elm) {
                        return false;
                    }
                }

                var $dataFilterAttr = $elm.attr($dataFilter),
                    $filterValue = $dataFilterAttr,
                    newFilters = $dataFilterAttr,
                    activeFilters, currentFilters;

                if($self.useHash === true) {

                    $self.hash._setHash.call($self, $instance.isotope, $filterValue);

                } else {

                    // Get current active filters from isotope instance
                    activeFilters = $instance.isotope.options.filter;

                    // Check if clicked filter's value is not a wildcard
                    if(activeFilters !== "*" && $filterValue !== "*") {
                        activeFilters = activeFilters.split(",");
                        newFilters = [];

                        //Loop through all active filters
                        $.each(activeFilters, function(index, element) {
                            var setting = $self.allFilters[$self.guid][element];

                            //Check if this container allows multiple filters
                            if(setting.filterMultiple) {
                                newFilters.push(element);

                            //Container only allows one filter
                            } else {

                                //Pass on filters that are not in same container
                                if(container.elm !== setting.elm) {
                                    newFilters.push(element);
                                }
                            }
                        });

                        //Check if this container allows multiple filters
                        if(container.filterMultiple) {

                            //Check if filter is already defined, if so toggle it
                            if( newFilters.indexOf($filterValue) === -1 ) {
                                newFilters.push($filterValue);
                            } else {
                                newFilters.splice(newFilters.indexOf($filterValue), 1);
                            }

                        //Container only allows one filter
                        } else {

                            //Pass on the clicked value
                            newFilters.push($filterValue);
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

                    $self._onIsotopeChange.call($self, $instance);
                }

            });

        });

    });
};

},{}],8:[function(require,module,exports){
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

},{}],9:[function(require,module,exports){
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

},{}],10:[function(require,module,exports){
/**
* _onHashChange: fires when location.hash has been changed
* @since 0.1.0
*/
module.exports = function() {
    this._setIsotope.call(this, this.hash._getHash.call(this));
};

},{}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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
    utils: {
        _setContainers: require("./utils/_setContainers.js"),
        _getForContainerAndId: require("./utils/_getForContainerAndId.js"),
        _getSortData: require("./utils/_getSortData.js"),
        _getElementFromDataAttribute: require("./utils/_getElementFromDataAttribute.js"),
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
    }

};

$.fn.simpleIsotope = require("./constructor/jquery.js");

$(document).ready(function() {
    $.each($("[data-isotope]"), function(key, elm) {
        $(elm).simpleIsotope();
    });
});

},{"./clear/__check.js":1,"./clear/_check.js":2,"./clear/_createClearers.js":3,"./constructor/jquery.js":4,"./constructor/prototype.js":5,"./filter/_check.js":6,"./filter/_createFilters.js":7,"./hash/_formatHash.js":8,"./hash/_getHash.js":9,"./hash/_onHashChanged.js":10,"./hash/_setHash.js":11,"./sorter/_check.js":14,"./sorter/_createSorters.js":15,"./text/_feedback.js":16,"./utils/_getElementFromDataAttribute.js":17,"./utils/_getFilterTest.js":18,"./utils/_getForContainerAndId.js":19,"./utils/_getInstances.js":20,"./utils/_getSortData.js":21,"./utils/_setContainers.js":22}],14:[function(require,module,exports){
/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function($instance) {

    var $dataSort = this.settings.dataSelectors.sortBy,
        $defaultSort = this.settings.defaults.sort,
        $instance = $instance || this.instances[this.guid],
        $activeClass = this.settings.defaults.classNames.active,
        $sortHistory = $instance.isotope.sortHistory,
        $sortAscending = $instance.isotope.options.sortAscending;

    $.each($instance.sortContainer, function( idx, container ) {
        var elm = container.elm.find("["+$dataSort+"]"),
            sortDirection = "desc";

        if($sortAscending) {
            sortDirection = "asc";
        }

        if(elm.prop("tagName") && elm.prop("tagName").toLowerCase() === "option") {

            // elm.prop('selected', false);
            // var active = container.elm.find('['+$dataSort+'="'+ $sortHistory[0] +'"][data-sort-direction="' + sortDirection + '"]').prop('selected', 'selected');
            //
            // console.log(active);

        } else {


            //Remove all active classes first time
            elm.removeClass($activeClass);

            //Add active classes
            var active = container.elm.find('['+$dataSort+'="'+ $sortHistory[0] +'"][data-sort-direction="' + sortDirection + '"]').addClass($activeClass);

            if(active.length > 0 && $sortHistory[0] != $defaultSort) {
                container.elm.find("["+$dataSort+"=\""+$defaultSort+"\"]").removeClass($activeClass);
            } else {
                container.elm.find("["+$dataSort+"=\""+$defaultSort+"\"]").addClass($activeClass);
            }
        }

    });

};

},{}],15:[function(require,module,exports){
/**
* _createButtons and add events to it
* @since 0.1.0
*/

module.exports = function() {
    var $dataSortBy = this.settings.dataSelectors.sortBy,
        $dataSortDirection = this.settings.dataSelectors.sortDirection,
        $defaultSort = this.settings.defaults.sort,
        $sortArray = [],
        $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.sortContainer, function(key, container) {
        var $sorters = container.elm.find('['+$dataSortBy+']');

        $sorters.each(function(idx, elm) {
            var $elm = $(elm),
                $dataSortAttr = $elm.attr($dataSortBy),
                how = {
                    eventName: $elm.prop("tagName").toLowerCase() == "option" ? "change" : "click",
                    element: $elm.prop("tagName").toLowerCase() == "option" ? $elm.closest("select") : $elm
                };

            how.element.on(how.eventName, function(e) {
                e.preventDefault();

                if(how.eventName == "change") {
                    if(how.element.find('option:selected')[0] != elm) {
                        return false;
                    }
                }

                var $sortByValue = '',
                    $sortAsc = false;

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

            });
        });
    });

};

},{}],16:[function(require,module,exports){
module.exports = function() {
    var $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.feedbackContainer, function(key, container) {
        var $feedback = container.elm;

        $feedback.each(function(idx, elm) {
            var $elm = $(elm);
            $elm.text($elm.attr("data-feedback").replace("{delta}", $instance.isotope.filteredItems.length));
        });
    });
};

},{}],17:[function(require,module,exports){
/**
* _getElementFromDataAttribute
* @since 0.1.0
* @update 0.2.1
*/
module.exports = function(selector) {
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
};

},{}],18:[function(require,module,exports){
module.exports = function(filter) {
    var guid = this.guid,
        allFilters = this.allFilters[guid];

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

        var filterMethod;
        if(filters.indexOf("*") === -1) {

            $.each(filters, function(idx, elm) {
                if(allFilters[elm].filterMethod === "or") {
                    filterMethod = "or";
                } else {
                    filterMethod = "and";
                }
            });

        } else {
            return true;
        }

        if(filterMethod == "or") {
            return active.length > 0;
        } else {
            return active.length == filters.length;
        }

    };

};

},{}],19:[function(require,module,exports){
/**
* _getForContainerAndId: Get an id or fallback to a parent div
* @since 0.2.2
* @param {object} $elm
* @param {object} timestamp
*/
module.exports = function($elm, timestamp) {
    var forElement, container, forContainer,
        idContainer, parentContainer, idElement;

    // Check if this container is assisnged to a specified isotope instance
    forContainer = $elm.closest('[' + this.settings.dataSelectors.forContainer + ']');
    if( forContainer.length > 0 ) {

        forElement = forContainer.attr(this.settings.dataSelectors.forContainer);
        container = forContainer;

    }

    // Get the closest id
    idContainer = $elm.closest('[id]');
    if( idContainer.length > 0 ) {

        idElement = idContainer.attr('id');
        container = (!container) ? idContainer : container; //If container has not been defined, define it.

    } else {

        var formatted = $($elm.parent()).text().trim().replace(/[^!a-zA-Z0-9]/g, "");
        idElement = (formatted === "") ? timestamp : formatted ;
        container = (!container) ? $elm.parent() : container; //If container has not been defined, define it.

    }

    var filterContainerMultiple = $(container).attr(this.settings.dataSelectors.filterMultiple),
        filterMultiple = ( filterContainerMultiple !== null && filterContainerMultiple !== undefined ),
        filterMethod = filterContainerMultiple || "or";

    return {
        isFor: forElement || this.guid,
        id: idElement,
        elm: $(container),
        filterMultiple: filterMultiple,
        filterMethod: filterMethod
    };

};

},{}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
/**
* _setContainers: Set the filters/sorters/clear containers to the right Isotope container
* @since 0.1.0
* @updated 0.2.2
* @param {object} $instance
*/

module.exports = function($instance) {
    var $self = this,
        sh = $self.instances[$self.guid],
        timestamp = new Date().getTime();

    $('[data-filter]:first-child').each(eachItem.bind({ dataType: 'data-filter' }));
    $('[data-sort-by]:first-child').each(eachItem.bind({ dataType: 'data-sort-by' }));
    $('[data-clear-filter]').each(eachItem.bind({ dataType: 'data-clear-filter' }));
    $('[data-feedback]').each(eachItem.bind({ dataType: 'data-feedback' }));

    function eachItem(ind, elm) {
        var $elm = $(elm),
            dataType = this.dataType,
            filterContainer = $self.utils._getForContainerAndId.call($self, $elm, timestamp);

        if( $self.guid === filterContainer.isFor || filterContainer.isFor === false) {
            if( dataType === "data-filter" ) {
                sh.filterContainer[filterContainer.id] = filterContainer;
            } else if( dataType === "data-sort-by" ) {
                sh.sortContainer[filterContainer.id] = filterContainer;
            } else if( dataType === "data-clear-filter" ) {
                sh.clearContainer[filterContainer.id] = filterContainer;
            } else if( dataType === "data-feedback" ) {
                sh.feedbackContainer[filterContainer.id] = filterContainer;
            }
        }

        if( dataType === "data-filter" || dataType === "data-sort-by" ) {
            var filters = filterContainer.elm.find('['+dataType+']');

            filters.each(function(index, filter) {
                if($self.guid === filterContainer.isFor) {
                    if( $(filter).attr(dataType) !== "*" ) { //TODO: how to handle wildcard?
                        if( dataType === "data-filter" ) {
                            $self.allFilters[filterContainer.isFor][$(filter).attr(dataType)] = sh.filterContainer[filterContainer.id];
                        } else if( dataType === "data-sort-by" ) {
                            $self.allSorters[filterContainer.isFor][$(filter).attr(dataType)] = sh.sortContainer[filterContainer.id];
                        }
                    }
                }
            });
        }
    }
};

},{}]},{},[13,12])(13)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic291cmNlL2NsZWFyL19fY2hlY2suanMiLCJzb3VyY2UvY2xlYXIvX2NoZWNrLmpzIiwic291cmNlL2NsZWFyL19jcmVhdGVDbGVhcmVycy5qcyIsInNvdXJjZS9jb25zdHJ1Y3Rvci9qcXVlcnkuanMiLCJzb3VyY2UvY29uc3RydWN0b3IvcHJvdG90eXBlLmpzIiwic291cmNlL2ZpbHRlci9fY2hlY2suanMiLCJzb3VyY2UvZmlsdGVyL19jcmVhdGVGaWx0ZXJzLmpzIiwic291cmNlL2hhc2gvX2Zvcm1hdEhhc2guanMiLCJzb3VyY2UvaGFzaC9fZ2V0SGFzaC5qcyIsInNvdXJjZS9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzIiwic291cmNlL2hhc2gvX3NldEhhc2guanMiLCJzb3VyY2UvcG9seWZpbGxzLmpzIiwic291cmNlL3NpbXBsZXRvcGUuYW1kLmpzIiwic291cmNlL3NvcnRlci9fY2hlY2suanMiLCJzb3VyY2Uvc29ydGVyL19jcmVhdGVTb3J0ZXJzLmpzIiwic291cmNlL3RleHQvX2ZlZWRiYWNrLmpzIiwic291cmNlL3V0aWxzL19nZXRFbGVtZW50RnJvbURhdGFBdHRyaWJ1dGUuanMiLCJzb3VyY2UvdXRpbHMvX2dldEZpbHRlclRlc3QuanMiLCJzb3VyY2UvdXRpbHMvX2dldEZvckNvbnRhaW5lckFuZElkLmpzIiwic291cmNlL3V0aWxzL19nZXRJbnN0YW5jZXMuanMiLCJzb3VyY2UvdXRpbHMvX2dldFNvcnREYXRhLmpzIiwic291cmNlL3V0aWxzL19zZXRDb250YWluZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuKiBfY2hlY2s6IENoZWNrIGlmIHdlIG5lZWQgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIGNsZWFyIGRpdiB3aXRob3V0IGFuIGluc3RhbmNlXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCh0aGlzLCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdKTtcclxufTtcclxuIiwiLyoqXHJcbiogX2NoZWNrOiBDaGVjayBpZiB3ZSBuZWVkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBjbGVhciBkaXYuXHJcbiogQHNpbmNlIDAuMS4wXHJcbiogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuXHJcbiAgICB2YXIgJGNsZWFyRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkZGVmYXVsdEZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcixcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcclxuICAgICAgICAkaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLmNsZWFyQ29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBjb250YWluZXIuZWxtLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICAkaGlzdG9yeSA9ICRpbnN0YW5jZS5pc290b3BlLnNvcnRIaXN0b3J5O1xyXG5cclxuICAgICAgICAgICAgaWYoJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIgIT0gJGRlZmF1bHRGaWx0ZXIgfHwgJGhpc3RvcnlbJGhpc3RvcnkubGVuZ3RoIC0gMV0gIT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAkZWxtLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkY2xlYXJGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5jbGVhckNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgICAgICB2YXIgJGNsZWFyZXJzID0gY29udGFpbmVyLmVsbTtcclxuXHJcbiAgICAgICAgJGNsZWFyZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcblxyXG4gICAgICAgICAgICAkZWxtLmhpZGUoKS5yZW1vdmVDbGFzcyhcImhpZGVcIikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRzZWxmLnVzZUhhc2ggPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZGVmYXVsdEZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICRkZWZhdWx0RmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvcnRCeTogJGRlZmF1bHRTb3J0XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciAkYXJncyA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgICAgaW5zdGFuY2VzID0gW107XG5cbiAgICBpZih0eXBlb2Ygd2luZG93Lklzb3RvcGUgIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGFsZXJ0KFwic2ltcGxlSXNvdG9wZTogSXNvdG9wZS5KUyBjb3VsZG4ndCBiZSBmb3VuZC4gUGxlYXNlIGluY2x1ZGUgJ2lzb3RvcGUuanMnLlwiKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJC5lYWNoKHRoaXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICBjb250YWluZXI6ICQoZWxtKSxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaXRlbVNlbGVjdG9yOiAnLml0ZW0nLFxuICAgICAgICAgICAgICAgIGRhdGFTZWxlY3RvcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAnZGF0YS1maWx0ZXInLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0YS1maWx0ZXItdHlwZScsXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlck1ldGhvZDogJ2RhdGEtZmlsdGVyLW1ldGhvZCcsLy9EZXByYWNhdGVkXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlck11bHRpcGxlOiAnZGF0YS1maWx0ZXItbXVsdGlwbGUnLFxuICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICdkYXRhLXNvcnQtYnknLFxuICAgICAgICAgICAgICAgICAgICBzb3J0QnlTZWxlY3RvcjogJ2RhdGEtc29ydC1zZWxlY3RvcicsXG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXJlY3Rpb246ICdkYXRhLXNvcnQtZGlyZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZm9yQ29udGFpbmVyOiAnZGF0YS1pc290b3BlLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyRmlsdGVyOiAnZGF0YS1jbGVhci1maWx0ZXInLFxuICAgICAgICAgICAgICAgICAgICBmZWVkYmFjazogJ2RhdGEtZmVlZGJhY2snXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IFwiKlwiLFxuICAgICAgICAgICAgICAgICAgICBzb3J0OiBcIm9yaWdpbmFsLW9yZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogJ2FjdGl2ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpbnN0YW5jZXMucHVzaChuZXcgJC5zaW1wbGVJc290b3BlKCQuZXh0ZW5kKG9iaiwgJGFyZ3MpKSk7XG4gICAgfSk7XG5cbiAgICAkLmVhY2goaW5zdGFuY2VzLCBmdW5jdGlvbihpZHgsIGVsbSkge1xuICAgICAgICBlbG0uc29ydGVyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLmZpbHRlci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS5jbGVhci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS50ZXh0Ll9mZWVkYmFjay5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS5jbGVhci5fX2NoZWNrLmNhbGwoZWxtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpbnN0YW5jZXM7XG5cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRhcmdzKXtcclxuICAgICQuZXh0ZW5kKHRoaXMsICRhcmdzKTtcclxuXHJcbiAgICB2YXIgJHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIHRoZUhhc2g7XHJcblxyXG4gICAgdGhpcy5ndWlkID0gdGhpcy5jb250YWluZXIuYXR0cihcImlkXCIpIHx8IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG4gICAgdGhpcy5lbmNvZGVVUkkgPSBmYWxzZTtcclxuXHJcbiAgICB0aGlzLmFsbEZpbHRlcnNbdGhpcy5ndWlkXSA9IHRoaXMuYWxsRmlsdGVyc1t0aGlzLmd1aWRdIHx8IHt9O1xyXG4gICAgdGhpcy5hbGxTb3J0ZXJzW3RoaXMuZ3VpZF0gPSB0aGlzLmFsbFNvcnRlcnNbdGhpcy5ndWlkXSB8fCB7fTtcclxuXHJcbiAgICAvL0ZpcnN0IHRpbWUgaW5pdCBpc290b3BlXHJcbiAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdID0ge1xyXG4gICAgICAgIGlzb3RvcGU6IGZhbHNlLFxyXG4gICAgICAgIGZpbHRlckNvbnRhaW5lcjoge30sXHJcbiAgICAgICAgc29ydENvbnRhaW5lcjoge30sXHJcbiAgICAgICAgY2xlYXJDb250YWluZXI6IHt9LFxyXG4gICAgICAgIGZlZWRiYWNrQ29udGFpbmVyOiB7fVxyXG4gICAgfTtcclxuXHJcbiAgICAvL0FkZCBoYXNoIHN1cHBvcnRcclxuICAgIGlmKHRoaXMuY29udGFpbmVyLmRhdGEoXCJoYXNoXCIpICE9PSBudWxsICYmIHRoaXMuY29udGFpbmVyLmRhdGEoXCJoYXNoXCIpICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGVIYXNoID0gdGhpcy5oYXNoLl9nZXRIYXNoLmNhbGwodGhpcyk7XHJcblxyXG4gICAgICAgIHRoaXMudXNlSGFzaCA9IHRydWU7XHJcblxyXG4gICAgICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIHRoaXMuaGFzaC5fb25IYXNoQ2hhbmdlZC5iaW5kKHRoaXMpKTtcclxuICAgIH1cclxuXHJcbiAgICAvL0dldCBjb250YWluZXJzIG9mIGZpbHRlcnNcclxuICAgIHRoaXMudXRpbHMuX3NldENvbnRhaW5lcnMuY2FsbCh0aGlzLCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUpO1xyXG5cclxuICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZSA9IG5ldyBJc290b3BlKHRoaXMuY29udGFpbmVyLmNvbnRleHQsIHtcclxuICAgICAgICBmaWx0ZXI6IHRoZUhhc2ggfHwgXCIqXCIsXHJcbiAgICAgICAgaXRlbVNlbGVjdG9yOiAkc2VsZi5zZXR0aW5ncy5pdGVtU2VsZWN0b3IgfHwgJy5pdGVtJyxcclxuICAgICAgICBsYXlvdXRNb2RlOiAkc2VsZi5jb250YWluZXIuZGF0YShcImxheW91dFwiKSB8fCBcImZpdFJvd3NcIixcclxuICAgICAgICBnZXRTb3J0RGF0YTogJHNlbGYudXRpbHMuX2dldFNvcnREYXRhLmNhbGwodGhpcyksXHJcbiAgICAgICAgZ2V0RmlsdGVyVGVzdDogJHNlbGYudXRpbHMuX2dldEZpbHRlclRlc3QuY2FsbCh0aGlzKVxyXG4gICAgfSk7XHJcblxyXG4gICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlLl9fZ2V0RmlsdGVyVGVzdCA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZS5fZ2V0RmlsdGVyVGVzdDtcclxuICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZS5fZ2V0RmlsdGVyVGVzdCA9IHRoaXMudXRpbHMuX2dldEZpbHRlclRlc3QuYmluZCh0aGlzKTtcclxuXHJcbiAgICBpZih3aW5kb3cuaW1hZ2VzTG9hZGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uaXNvdG9wZS5sYXlvdXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiB9O1xyXG4iLCIvKipcbiAqIF9jaGVja0FjdGl2ZTogQ2hlY2sgaWYgYnV0dG9ucyBuZWVkIGFuIGFjdGl2ZSBjbGFzc1xuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcblxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXG4gICAgICAgICRpbnN0YW5jZSA9ICRpbnN0YW5jZSB8fCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlO1xuXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuZmlsdGVyLnNwbGl0KFwiLFwiKSwgZnVuY3Rpb24oIGluZGV4LCBmaWx0ZXIgKSB7XG5cbiAgICAgICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKCBpZHgsIGNvbnRhaW5lciApIHtcbiAgICAgICAgICAgIHZhciBlbG0gPSBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFGaWx0ZXIrXCI9XFxcIlwiK2ZpbHRlcitcIlxcXCJdXCIpO1xuXG4gICAgICAgICAgICBpZihlbG0ucHJvcChcInRhZ05hbWVcIikgJiYgZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwib3B0aW9uXCIpIHtcblxuICAgICAgICAgICAgICAgIGVsbS5hdHRyKCdzZWxlY3RlZCcsJ3NlbGVjdGVkJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZihpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvL1JlbW92ZSBhbGwgYWN0aXZlIGNsYXNzZXMgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFGaWx0ZXIrXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9BZGQgYWN0aXZlIGNsYXNzZXNcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gZWxtLmFkZENsYXNzKCRhY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgICAgICAgICBpZihhY3RpdmUubGVuZ3RoID4gMCAmJiBmaWx0ZXIgIT0gJGRlZmF1bHRGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmVsbS5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIiskZGVmYXVsdEZpbHRlcitcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn07XG4iLCIvKipcclxuKiBfY3JlYXRlRmlsdGVyczogY3JlYXRlIGJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKiBAdXBkYXRlZCAwLjIuMVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRmaWx0ZXJzID0gY29udGFpbmVyLmVsbS5maW5kKCdbJyskZGF0YUZpbHRlcisnXScpO1xyXG5cclxuICAgICAgICAkZmlsdGVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyBcImNoYW5nZVwiIDogXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gJGVsbS5jbG9zZXN0KFwic2VsZWN0XCIpIDogJGVsbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGhvdy5lbGVtZW50Lm9uKGhvdy5ldmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBEbyBub3QgcmV0dXJuIGZhbHNlIGJlZm9yZSBzZXR0aW5nIGlzb3RvcGUgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgaWYoaG93LmV2ZW50TmFtZSA9PSBcImNoYW5nZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaG93LmVsZW1lbnQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0gIT0gZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRkYXRhRmlsdGVyQXR0ciA9ICRlbG0uYXR0cigkZGF0YUZpbHRlciksXHJcbiAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGRhdGFGaWx0ZXJBdHRyLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMgPSAkZGF0YUZpbHRlckF0dHIsXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlRmlsdGVycywgY3VycmVudEZpbHRlcnM7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZmlsdGVyVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBjdXJyZW50IGFjdGl2ZSBmaWx0ZXJzIGZyb20gaXNvdG9wZSBpbnN0YW5jZVxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUZpbHRlcnMgPSAkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY2xpY2tlZCBmaWx0ZXIncyB2YWx1ZSBpcyBub3QgYSB3aWxkY2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGFjdGl2ZUZpbHRlcnMgIT09IFwiKlwiICYmICRmaWx0ZXJWYWx1ZSAhPT0gXCIqXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlRmlsdGVycyA9IGFjdGl2ZUZpbHRlcnMuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0xvb3AgdGhyb3VnaCBhbGwgYWN0aXZlIGZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGFjdGl2ZUZpbHRlcnMsIGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2V0dGluZyA9ICRzZWxmLmFsbEZpbHRlcnNbJHNlbGYuZ3VpZF1bZWxlbWVudF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiB0aGlzIGNvbnRhaW5lciBhbGxvd3MgbXVsdGlwbGUgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2V0dGluZy5maWx0ZXJNdWx0aXBsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMucHVzaChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvbnRhaW5lciBvbmx5IGFsbG93cyBvbmUgZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Bhc3Mgb24gZmlsdGVycyB0aGF0IGFyZSBub3QgaW4gc2FtZSBjb250YWluZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb250YWluZXIuZWxtICE9PSBzZXR0aW5nLmVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBjb250YWluZXIgYWxsb3dzIG11bHRpcGxlIGZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29udGFpbmVyLmZpbHRlck11bHRpcGxlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiBmaWx0ZXIgaXMgYWxyZWFkeSBkZWZpbmVkLCBpZiBzbyB0b2dnbGUgaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBuZXdGaWx0ZXJzLmluZGV4T2YoJGZpbHRlclZhbHVlKSA9PT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsdGVycy5wdXNoKCRmaWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMuc3BsaWNlKG5ld0ZpbHRlcnMuaW5kZXhPZigkZmlsdGVyVmFsdWUpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ29udGFpbmVyIG9ubHkgYWxsb3dzIG9uZSBmaWx0ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Bhc3Mgb24gdGhlIGNsaWNrZWQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMucHVzaCgkZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzID0gbmV3RmlsdGVycy5qb2luKFwiLFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL0lmIGZpbHRlcnMgaXMgZW1wdHkgdGhlbiByZXNldCBpdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICBpZihuZXdGaWx0ZXJzID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMgPSBcIipcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IG5ld0ZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLCIvKipcbiogX2Zvcm1hdEhhc2g6IEZvcm1hdCBtdWx0aXBsZSBmaWx0ZXJzIGludG8gb25lIHN0cmluZyBiYXNlZCBvbiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuKiBAc2luY2UgMC4xLjBcbiogQHBhcmFtIHtyZWdleH0gcmVcbiogQHBhcmFtIHtzdHJpbmd9IHN0clxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmUsIHN0cikge1xuICAgIHZhciBtYXRjaGVzID0ge30sXG4gICAgICAgIG1hdGNoO1xuXG4gICAgd2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKG1hdGNoLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWF0Y2hbM10gIT09IG51bGwgJiYgbWF0Y2hbM10gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzNdXSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYobWF0Y2hlc1ttYXRjaFsxXV0gPT09IG51bGwgfHwgbWF0Y2hlc1ttYXRjaFsxXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2hbMV1dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXS5wdXNoKG1hdGNoWzJdKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlcztcbn07XG4iLCIvKipcbiAqIF9nZXRIYXNoOiBHZXQgd2luZG93LmxvY2F0aW9uLmhhc2ggYW5kIGZvcm1hdCBpdCBmb3IgSXNvdG9wZVxuICogQHNpbmNlIDAuMS4wXG4gKi9cblxuIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyICRoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2ggfHwgZmFsc2UsXG4gICAgICAgICRuZXdIYXNoID0gXCJcIjtcblxuICAgICRoYXNoID0gKCRoYXNoICE9PSBmYWxzZSAmJiAkaGFzaCAhPT0gXCIjXCIgJiYgJGhhc2ggIT09IFwiXCIpID8gZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSA6ICcqJztcblxuICAgIC8vUmVtb3ZlIGhhc2ggZnJvbSBmaXJzdCBjaGFyYWN0ZXIgaWYgaXRzIGV4aXN0XG4gICAgaWYgKCRoYXNoLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgICAkaGFzaCA9ICRoYXNoLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIHZhciBoYXNoQXJyYXkgPSAkaGFzaC5zcGxpdChcIiZcIik7XG4gICAgJC5lYWNoKGhhc2hBcnJheSwgZnVuY3Rpb24oa2V5LCAkcGFydEhhc2gpIHtcblxuICAgICAgICBpZigkcGFydEhhc2guaW5kZXhPZihcIj1cIikgIT09IC0xKSB7XG5cbiAgICAgICAgICAgIHZhciB0bXAgPSAkcGFydEhhc2guc3BsaXQoXCI9XCIpLFxuICAgICAgICAgICAgICAgIGFyciA9IFtdLCB2YWx1ZXMsIG5hbWU7XG5cbiAgICAgICAgICAgIGlmKHRtcC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IHRtcFswXTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMgPSB0bXBbMV0ucmVwbGFjZSgvXFwnL2csIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJG5ld0hhc2ggKz0gYXJyLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbmV3SGFzaCArPSAoJHBhcnRIYXNoID09IFwiKlwiIHx8ICRwYXJ0SGFzaC5jaGFyQXQoMCkgPT0gJy4nKSA/ICRwYXJ0SGFzaDogXCIuXCIgKyAkcGFydEhhc2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZihrZXkgIT0gKGhhc2hBcnJheS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgJG5ld0hhc2ggKz0gXCIsXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgIHJldHVybiAkbmV3SGFzaDtcblxuIH07XG4iLCIvKipcclxuKiBfb25IYXNoQ2hhbmdlOiBmaXJlcyB3aGVuIGxvY2F0aW9uLmhhc2ggaGFzIGJlZW4gY2hhbmdlZFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fc2V0SXNvdG9wZS5jYWxsKHRoaXMsIHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpKTtcclxufTtcclxuIiwiLyoqXG4gKiBfc2V0SGFzaDogU2V0IGEgbmV3IGxvY2F0aW9uLmhhc2ggYWZ0ZXIgZm9ybWF0dGluZyBpdFxuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gJG5ld0hhc2hcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSwgJG5ld0hhc2gpIHtcbiAgICB2YXIgJGN1cnJlbnRIYXNoID0gKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlciA9PSBcIipcIikgPyBcIlwiIDogJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyLFxuICAgICAgICAkY29tYmluZWRIYXNoLFxuICAgICAgICAkZW5kSGFzaCA9IFtdO1xuXG4gICAgaWYoJG5ld0hhc2ggIT0gXCIqXCIpIHtcblxuICAgICAgICBpZigkY3VycmVudEhhc2guaW5kZXhPZigkbmV3SGFzaCkgPT09IC0xKSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoICsgJG5ld0hhc2g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoLnJlcGxhY2UoJG5ld0hhc2gsIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRmb3JtYXR0ZWRIYXNoID0gdGhpcy5oYXNoLl9mb3JtYXRIYXNoKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXXwoLltBLVphLXowLTldKykvZywgJGNvbWJpbmVkSGFzaCk7XG5cbiAgICAgICAgJC5lYWNoKCRmb3JtYXR0ZWRIYXNoLCBmdW5jdGlvbihrZXksIGVsbSkge1xuICAgICAgICAgICAgaWYoZWxtID09PSB0cnVlKSB7Ly9pc0NsYXNzXG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaCggKGtleS5jaGFyQXQoMCkgPT0gJy4nKSA/IGtleS5zbGljZSgxKSA6IGtleSApO1xuICAgICAgICAgICAgfSBlbHNlIHsvL2lzT2JqZWN0XG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaChrZXkgKyBcIj1cIiArIGVsbS5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRlbmRIYXNoID0gJGVuZEhhc2guam9pbihcIiZcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGVuZEhhc2ggPSAkbmV3SGFzaDtcbiAgICB9XG5cbiAgICBpZigkZW5kSGFzaCA9PT0gXCIqXCIgfHwgJGVuZEhhc2ggPT09IFwiXCIpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gKHRoaXMuZW5jb2RlVVJJID09PSB0cnVlKSA/IGVuY29kZVVSSUNvbXBvbmVudCgkZW5kSGFzaCkgOiAkZW5kSGFzaDtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVuZEhhc2g7XG59O1xuIiwiaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUuYmluZCkge1xyXG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ob1RoaXMpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAvLyBjbG9zZXN0IHRoaW5nIHBvc3NpYmxlIHRvIHRoZSBFQ01BU2NyaXB0IDVcclxuICAgICAgLy8gaW50ZXJuYWwgSXNDYWxsYWJsZSBmdW5jdGlvblxyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCAtIHdoYXQgaXMgdHJ5aW5nIHRvIGJlIGJvdW5kIGlzIG5vdCBjYWxsYWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBhQXJncyAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcclxuICAgICAgICBmVG9CaW5kID0gdGhpcyxcclxuICAgICAgICBmTk9QICAgID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICBmQm91bmQgID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmVG9CaW5kLmFwcGx5KHRoaXMgaW5zdGFuY2VvZiBmTk9QICYmIG9UaGlzID8gdGhpcyA6IG9UaGlzLCBhQXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgZk5PUC5wcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcclxuICAgIGZCb3VuZC5wcm90b3R5cGUgPSBuZXcgZk5PUCgpO1xyXG5cclxuICAgIHJldHVybiBmQm91bmQ7XHJcbiAgfTtcclxufVxyXG5cclxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUudHJpbSkge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG4gICAgfTtcclxufVxyXG5cclxuaWYgKCFBcnJheS5wcm90b3R5cGUuaW5kZXhPZikge1xyXG4gIEFycmF5LnByb3RvdHlwZS5pbmRleE9mID0gZnVuY3Rpb24oc2VhcmNoRWxlbWVudCwgZnJvbUluZGV4KSB7XHJcblxyXG4gICAgdmFyIGs7XHJcblxyXG4gICAgLy8gMS4gTGV0IE8gYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIFRvT2JqZWN0IHBhc3NpbmdcclxuICAgIC8vICAgIHRoZSB0aGlzIHZhbHVlIGFzIHRoZSBhcmd1bWVudC5cclxuICAgIGlmICh0aGlzID09IG51bGwpIHtcclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignXCJ0aGlzXCIgaXMgbnVsbCBvciBub3QgZGVmaW5lZCcpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBPID0gT2JqZWN0KHRoaXMpO1xyXG5cclxuICAgIC8vIDIuIExldCBsZW5WYWx1ZSBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldFxyXG4gICAgLy8gICAgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCB0aGUgYXJndW1lbnQgXCJsZW5ndGhcIi5cclxuICAgIC8vIDMuIExldCBsZW4gYmUgVG9VaW50MzIobGVuVmFsdWUpLlxyXG4gICAgdmFyIGxlbiA9IE8ubGVuZ3RoID4+PiAwO1xyXG5cclxuICAgIC8vIDQuIElmIGxlbiBpcyAwLCByZXR1cm4gLTEuXHJcbiAgICBpZiAobGVuID09PSAwKSB7XHJcbiAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA1LiBJZiBhcmd1bWVudCBmcm9tSW5kZXggd2FzIHBhc3NlZCBsZXQgbiBiZVxyXG4gICAgLy8gICAgVG9JbnRlZ2VyKGZyb21JbmRleCk7IGVsc2UgbGV0IG4gYmUgMC5cclxuICAgIHZhciBuID0gK2Zyb21JbmRleCB8fCAwO1xyXG5cclxuICAgIGlmIChNYXRoLmFicyhuKSA9PT0gSW5maW5pdHkpIHtcclxuICAgICAgbiA9IDA7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNi4gSWYgbiA+PSBsZW4sIHJldHVybiAtMS5cclxuICAgIGlmIChuID49IGxlbikge1xyXG4gICAgICByZXR1cm4gLTE7XHJcbiAgICB9XHJcblxyXG4gICAgLy8gNy4gSWYgbiA+PSAwLCB0aGVuIExldCBrIGJlIG4uXHJcbiAgICAvLyA4LiBFbHNlLCBuPDAsIExldCBrIGJlIGxlbiAtIGFicyhuKS5cclxuICAgIC8vICAgIElmIGsgaXMgbGVzcyB0aGFuIDAsIHRoZW4gbGV0IGsgYmUgMC5cclxuICAgIGsgPSBNYXRoLm1heChuID49IDAgPyBuIDogbGVuIC0gTWF0aC5hYnMobiksIDApO1xyXG5cclxuICAgIC8vIDkuIFJlcGVhdCwgd2hpbGUgayA8IGxlblxyXG4gICAgd2hpbGUgKGsgPCBsZW4pIHtcclxuICAgICAgLy8gYS4gTGV0IFBrIGJlIFRvU3RyaW5nKGspLlxyXG4gICAgICAvLyAgIFRoaXMgaXMgaW1wbGljaXQgZm9yIExIUyBvcGVyYW5kcyBvZiB0aGUgaW4gb3BlcmF0b3JcclxuICAgICAgLy8gYi4gTGV0IGtQcmVzZW50IGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGVcclxuICAgICAgLy8gICAgSGFzUHJvcGVydHkgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCBhcmd1bWVudCBQay5cclxuICAgICAgLy8gICBUaGlzIHN0ZXAgY2FuIGJlIGNvbWJpbmVkIHdpdGggY1xyXG4gICAgICAvLyBjLiBJZiBrUHJlc2VudCBpcyB0cnVlLCB0aGVuXHJcbiAgICAgIC8vICAgIGkuICBMZXQgZWxlbWVudEsgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZSBHZXRcclxuICAgICAgLy8gICAgICAgIGludGVybmFsIG1ldGhvZCBvZiBPIHdpdGggdGhlIGFyZ3VtZW50IFRvU3RyaW5nKGspLlxyXG4gICAgICAvLyAgIGlpLiAgTGV0IHNhbWUgYmUgdGhlIHJlc3VsdCBvZiBhcHBseWluZyB0aGVcclxuICAgICAgLy8gICAgICAgIFN0cmljdCBFcXVhbGl0eSBDb21wYXJpc29uIEFsZ29yaXRobSB0b1xyXG4gICAgICAvLyAgICAgICAgc2VhcmNoRWxlbWVudCBhbmQgZWxlbWVudEsuXHJcbiAgICAgIC8vICBpaWkuICBJZiBzYW1lIGlzIHRydWUsIHJldHVybiBrLlxyXG4gICAgICBpZiAoayBpbiBPICYmIE9ba10gPT09IHNlYXJjaEVsZW1lbnQpIHtcclxuICAgICAgICByZXR1cm4gaztcclxuICAgICAgfVxyXG4gICAgICBrKys7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gLTE7XHJcbiAgfTtcclxufVxyXG4iLCJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XHJcblxyXG4kLnNpbXBsZUlzb3RvcGUgPSByZXF1aXJlKFwiLi9jb25zdHJ1Y3Rvci9wcm90b3R5cGUuanNcIik7XHJcblxyXG4kLnNpbXBsZUlzb3RvcGUucHJvdG90eXBlID0ge1xyXG4gICAgaW5zdGFuY2VzOiB7fSxcclxuICAgIGFsbEZpbHRlcnM6IHt9LFxyXG4gICAgYWxsU29ydGVyczoge30sXHJcblxyXG4gICAgY29uc3RydWN0b3I6ICQuc2ltcGxlSXNvdG9wZSxcclxuXHJcbiAgICBoYXNoOiB7XHJcbiAgICAgICAgX2dldEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX2dldEhhc2guanNcIiksXHJcbiAgICAgICAgX3NldEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX3NldEhhc2guanNcIiksXHJcbiAgICAgICAgX2Zvcm1hdEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX2Zvcm1hdEhhc2guanNcIiksXHJcbiAgICAgICAgX29uSGFzaENoYW5nZWQ6IHJlcXVpcmUoXCIuL2hhc2gvX29uSGFzaENoYW5nZWQuanNcIilcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vZmlsdGVyL19jcmVhdGVGaWx0ZXJzLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vZmlsdGVyL19jaGVjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIHNvcnRlcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9zb3J0ZXIvX2NyZWF0ZVNvcnRlcnMuanNcIiksXHJcbiAgICAgICAgX2NoZWNrOiByZXF1aXJlKFwiLi9zb3J0ZXIvX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgY2xlYXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vY2xlYXIvX2NyZWF0ZUNsZWFyZXJzLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vY2xlYXIvX2NoZWNrLmpzXCIpLFxyXG4gICAgICAgIF9fY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICB0ZXh0OiB7XHJcbiAgICAgICAgX2ZlZWRiYWNrOiByZXF1aXJlKFwiLi90ZXh0L19mZWVkYmFjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIHV0aWxzOiB7XHJcbiAgICAgICAgX3NldENvbnRhaW5lcnM6IHJlcXVpcmUoXCIuL3V0aWxzL19zZXRDb250YWluZXJzLmpzXCIpLFxyXG4gICAgICAgIF9nZXRGb3JDb250YWluZXJBbmRJZDogcmVxdWlyZShcIi4vdXRpbHMvX2dldEZvckNvbnRhaW5lckFuZElkLmpzXCIpLFxyXG4gICAgICAgIF9nZXRTb3J0RGF0YTogcmVxdWlyZShcIi4vdXRpbHMvX2dldFNvcnREYXRhLmpzXCIpLFxyXG4gICAgICAgIF9nZXRFbGVtZW50RnJvbURhdGFBdHRyaWJ1dGU6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRFbGVtZW50RnJvbURhdGFBdHRyaWJ1dGUuanNcIiksXHJcbiAgICAgICAgX2dldEZpbHRlclRlc3Q6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRGaWx0ZXJUZXN0LmpzXCIpLFxyXG4gICAgICAgIF9nZXRJbnN0YW5jZXM6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRJbnN0YW5jZXMuanNcIilcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9vbkJlZm9yZUlzb3RvcGVDaGFuZ2U6IGZpcmVzIGJlZm9yZSB0aGUgSXNvdG9wZSBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZFxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9vbkJlZm9yZUlzb3RvcGVDaGFuZ2U6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge30sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9vbklzb3RvcGVDaGFuZ2U6IGZpcmVzIHdoZW4gdGhlIElzb3RvcGUgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWRcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuICAgICovXHJcbiAgICBfb25Jc290b3BlQ2hhbmdlOiBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuICAgICAgICB0aGlzLmZpbHRlci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgIHRoaXMuc29ydGVyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXIuX2NoZWNrLmNhbGwodGhpcywgJGluc3RhbmNlLmlzb3RvcGUpO1xyXG4gICAgICAgIHRoaXMudGV4dC5fZmVlZGJhY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UuaXNvdG9wZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfc2V0SXNvdG9wZTogUmVjb25maWd1cmUgaXNvdG9wZVxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRzZWxlY3RvclxyXG4gICAgKi9cclxuICAgIF9zZXRJc290b3BlOiBmdW5jdGlvbigkc2VsZWN0b3IpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgIGZpbHRlcjogJHNlbGVjdG9yXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX29uSXNvdG9wZUNoYW5nZSh0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4kLmZuLnNpbXBsZUlzb3RvcGUgPSByZXF1aXJlKFwiLi9jb25zdHJ1Y3Rvci9qcXVlcnkuanNcIik7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQuZWFjaCgkKFwiW2RhdGEtaXNvdG9wZV1cIiksIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgJChlbG0pLnNpbXBsZUlzb3RvcGUoKTtcclxuICAgIH0pO1xyXG59KTtcclxuIiwiLyoqXG4gKiBfY2hlY2tBY3RpdmU6IENoZWNrIGlmIGJ1dHRvbnMgbmVlZCBhbiBhY3RpdmUgY2xhc3NcbiAqIEBzaW5jZSAwLjEuMFxuICogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlKSB7XG5cbiAgICB2YXIgJGRhdGFTb3J0ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxuICAgICAgICAkaW5zdGFuY2UgPSAkaW5zdGFuY2UgfHwgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcbiAgICAgICAgJHNvcnRIaXN0b3J5ID0gJGluc3RhbmNlLmlzb3RvcGUuc29ydEhpc3RvcnksXG4gICAgICAgICRzb3J0QXNjZW5kaW5nID0gJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5zb3J0QXNjZW5kaW5nO1xuXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5zb3J0Q29udGFpbmVyLCBmdW5jdGlvbiggaWR4LCBjb250YWluZXIgKSB7XG4gICAgICAgIHZhciBlbG0gPSBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFTb3J0K1wiXVwiKSxcbiAgICAgICAgICAgIHNvcnREaXJlY3Rpb24gPSBcImRlc2NcIjtcblxuICAgICAgICBpZigkc29ydEFzY2VuZGluZykge1xuICAgICAgICAgICAgc29ydERpcmVjdGlvbiA9IFwiYXNjXCI7XG4gICAgICAgIH1cblxuICAgICAgICBpZihlbG0ucHJvcChcInRhZ05hbWVcIikgJiYgZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwib3B0aW9uXCIpIHtcblxuICAgICAgICAgICAgLy8gZWxtLnByb3AoJ3NlbGVjdGVkJywgZmFsc2UpO1xuICAgICAgICAgICAgLy8gdmFyIGFjdGl2ZSA9IGNvbnRhaW5lci5lbG0uZmluZCgnWycrJGRhdGFTb3J0Kyc9XCInKyAkc29ydEhpc3RvcnlbMF0gKydcIl1bZGF0YS1zb3J0LWRpcmVjdGlvbj1cIicgKyBzb3J0RGlyZWN0aW9uICsgJ1wiXScpLnByb3AoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XG4gICAgICAgICAgICAvL1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coYWN0aXZlKTtcblxuICAgICAgICB9IGVsc2Uge1xuXG5cbiAgICAgICAgICAgIC8vUmVtb3ZlIGFsbCBhY3RpdmUgY2xhc3NlcyBmaXJzdCB0aW1lXG4gICAgICAgICAgICBlbG0ucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcblxuICAgICAgICAgICAgLy9BZGQgYWN0aXZlIGNsYXNzZXNcbiAgICAgICAgICAgIHZhciBhY3RpdmUgPSBjb250YWluZXIuZWxtLmZpbmQoJ1snKyRkYXRhU29ydCsnPVwiJysgJHNvcnRIaXN0b3J5WzBdICsnXCJdW2RhdGEtc29ydC1kaXJlY3Rpb249XCInICsgc29ydERpcmVjdGlvbiArICdcIl0nKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgICAgICBpZihhY3RpdmUubGVuZ3RoID4gMCAmJiAkc29ydEhpc3RvcnlbMF0gIT0gJGRlZmF1bHRTb3J0KSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmVsbS5maW5kKFwiW1wiKyRkYXRhU29ydCtcIj1cXFwiXCIrJGRlZmF1bHRTb3J0K1wiXFxcIl1cIikucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmVsbS5maW5kKFwiW1wiKyRkYXRhU29ydCtcIj1cXFwiXCIrJGRlZmF1bHRTb3J0K1wiXFxcIl1cIikuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbn07XG4iLCIvKipcclxuKiBfY3JlYXRlQnV0dG9ucyBhbmQgYWRkIGV2ZW50cyB0byBpdFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGRhdGFTb3J0RGlyZWN0aW9uID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRzb3J0QXJyYXkgPSBbXSxcclxuICAgICAgICAkaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLnNvcnRDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRzb3J0ZXJzID0gY29udGFpbmVyLmVsbS5maW5kKCdbJyskZGF0YVNvcnRCeSsnXScpO1xyXG5cclxuICAgICAgICAkc29ydGVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgJGRhdGFTb3J0QXR0ciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeSksXHJcbiAgICAgICAgICAgICAgICBob3cgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/IFwiY2hhbmdlXCIgOiBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyAkZWxtLmNsb3Nlc3QoXCJzZWxlY3RcIikgOiAkZWxtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaG93LmVsZW1lbnQub24oaG93LmV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGhvdy5ldmVudE5hbWUgPT0gXCJjaGFuZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGhvdy5lbGVtZW50LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdICE9IGVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkc29ydEJ5VmFsdWUgPSAnJyxcclxuICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIFRPRE86IEknbSBnYW5uYSBsZWF2ZSB0aGlzIGNvZGUgaGVyZSBmb3Igbm93LCBpZiB3ZSBldmVyIG5lZWQgdG8gYWRkIG11bHRpcGxlIHN1cHBvcnQgb24gc29ydGVyc1xyXG4gICAgICAgICAgICAgICAgLy8gaWYoJHNlbGYuZmlsdGVyTXVsdGlwbGUpIHtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJHNvcnRCeVZhbHVlID0gW107XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGlmKCRkYXRhU29ydEF0dHIgPT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAkc29ydEFycmF5ID0gW107XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICBpZigkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0cikgPT09IC0xKSB7Ly9pdGVtIG5vdCBmaWx0ZXJlZFxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICRzb3J0QXJyYXkucHVzaCgkZGF0YVNvcnRBdHRyKTtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH0gZWxzZSB7Ly9pdGVtIGFscmVhZHkgZmlsdGVyZWRcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICBpZigkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLnNvcnRBc2NlbmRpbmcgIT09ICgkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKS50b0xvd2VyQ2FzZSgpID09PSBcImFzY1wiKSkgey8vQXJlIHdlIGNoYW5naW5nIGRlc2Mgb3IgYXNjP1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgIC8vRG8gbm90aGluZywgYXJyYXkgd2lsbCBiZSB0aGUgc2FtZSwgd2UncmUgb25seSBjaGFuaWduZyBzb3J0IGRpcmVjdGlvblxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAkc29ydEFycmF5LnNwbGljZSgkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0ciksIDEpOyAvL3NhbWUgaXRlbSBmaWx0ZXJlZCwgcmVtb3ZlIHRoaXMgaXRlbSBmcm9tIGFycmF5XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICBpZigkc29ydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAkc29ydEJ5VmFsdWUgPSAkZGVmYXVsdFNvcnQ7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJHNvcnRCeVZhbHVlID0gJHNvcnRBcnJheTtcclxuICAgICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAkc29ydEJ5VmFsdWUgPSAkZGF0YVNvcnRBdHRyO1xyXG4gICAgICAgICAgICAgICAgLy8gfVxyXG5cclxuICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkYXRhU29ydEF0dHI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IG51bGwgJiYgJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pLnRvTG93ZXJDYXNlKCkgPT09IFwiYXNjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRBc2MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0QnkpID09ICRkZWZhdWx0U29ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkaW5zdGFuY2UuaXNvdG9wZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICRzb3J0QnlWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzb3J0QXNjZW5kaW5nOiAkc29ydEFzY1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5mZWVkYmFja0NvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgICAgICB2YXIgJGZlZWRiYWNrID0gY29udGFpbmVyLmVsbTtcclxuXHJcbiAgICAgICAgJGZlZWRiYWNrLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcbiAgICAgICAgICAgICRlbG0udGV4dCgkZWxtLmF0dHIoXCJkYXRhLWZlZWRiYWNrXCIpLnJlcGxhY2UoXCJ7ZGVsdGF9XCIsICRpbnN0YW5jZS5pc290b3BlLmZpbHRlcmVkSXRlbXMubGVuZ3RoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuIiwiLyoqXHJcbiogX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZVxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qIEB1cGRhdGUgMC4yLjFcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgdmFyICR0bXA7XHJcblxyXG4gICAgaWYoc2VsZWN0b3IgPT09IFwiXCIgfHwgc2VsZWN0b3IgPT09IGZhbHNlIHx8IHNlbGVjdG9yID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoc2VsZWN0b3IgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICByZXR1cm4gc2VsZWN0b3I7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoc2VsZWN0b3IuY2hhckF0KDApID09PSBcIiNcIiB8fCBzZWxlY3Rvci5jaGFyQXQoMCkgPT09IFwiLlwiKSB7XHRcdFx0XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgIH0gZWxzZSBpZihzZWxlY3Rvci5pbmRleE9mKFwiI1wiKSAhPT0gLTEgfHwgc2VsZWN0b3IuaW5kZXhPZihcIi5cIikgIT09IC0xKSB7XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgIH0gZWxzZSBpZihzZWxlY3Rvci5pbmRleE9mKFwiIFwiKSAhPT0gLTEpIHtcdFx0XHRcdFx0XHRcdFx0XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgIH0gZWxzZSB7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vZXZ1bGF0ZSB0aGUgc3RyaW5nIGFzIGFuIGlkXHJcbiAgICAgICAgJHRtcCA9ICQoXCIjXCIgKyBzZWxlY3Rvcik7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoJHRtcC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAvLyB0aHJvdyBuZXcgRXJyb3IoXCJzaW1wbGV0b3BlOiBXZSBjYW5ub3QgZmluZCBhbnkgRE9NIGVsZW1lbnQgd2l0aCB0aGUgQ1NTIHNlbGVjdG9yOiAnXCIgKyBzZWxlY3RvciArIFwiJ1wiKTtcclxuICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgIHJldHVybiAkdG1wO1xyXG4gICAgfVxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZpbHRlcikge1xyXG4gICAgdmFyIGd1aWQgPSB0aGlzLmd1aWQsXHJcbiAgICAgICAgYWxsRmlsdGVycyA9IHRoaXMuYWxsRmlsdGVyc1tndWlkXTtcclxuXHJcbiAgICByZXR1cm4gZnVuY3Rpb24oIGl0ZW0gKSB7XHJcblxyXG4gICAgICAgIHZhciBmaWx0ZXJzID0gZmlsdGVyLnNwbGl0KFwiLFwiKSxcclxuICAgICAgICAgICAgYWN0aXZlID0gW10sXHJcbiAgICAgICAgICAgIGNvbnRhaW5lciA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cclxuICAgICAgICAgICAgLy9FbmFibGUgZmlsdGVyaW5nIHdpdGggZGF0YS1hdHRyaWJ1dGVzXHJcbiAgICAgICAgICAgIGlmKGZpbHRlcnNbaV0uaW5kZXhPZihcImRhdGEtXCIpICE9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgIHZhciBjYXQgPSBmaWx0ZXJzW2ldLnJlcGxhY2UoL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csIFwiJDFcIikudHJpbSgpLFxyXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlID0gZmlsdGVyc1tpXS5yZXBsYWNlKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXS9nLCBcIiQyXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApICE9PSB1bmRlZmluZWQgJiYgalF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5kYXRhKCBjYXQgKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApLmluZGV4T2YoIHZhbHVlICkgIT09IC0xICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUucHVzaCh2YWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAvL0RlZmF1bHQgZmlsdGVyaW5nXHJcbiAgICAgICAgICAgICAgICBpZiggalF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5pcyggZmlsdGVyc1tpXSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKGZpbHRlcnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBmaWx0ZXJNZXRob2Q7XHJcbiAgICAgICAgaWYoZmlsdGVycy5pbmRleE9mKFwiKlwiKSA9PT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaChmaWx0ZXJzLCBmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICAgICAgaWYoYWxsRmlsdGVyc1tlbG1dLmZpbHRlck1ldGhvZCA9PT0gXCJvclwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyTWV0aG9kID0gXCJvclwiO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJNZXRob2QgPSBcImFuZFwiO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIHRydWU7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihmaWx0ZXJNZXRob2QgPT0gXCJvclwiKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhY3RpdmUubGVuZ3RoID4gMDtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA9PSBmaWx0ZXJzLmxlbmd0aDtcclxuICAgICAgICB9XHJcblxyXG4gICAgfTtcclxuXHJcbn07XHJcbiIsIi8qKlxyXG4qIF9nZXRGb3JDb250YWluZXJBbmRJZDogR2V0IGFuIGlkIG9yIGZhbGxiYWNrIHRvIGEgcGFyZW50IGRpdlxyXG4qIEBzaW5jZSAwLjIuMlxyXG4qIEBwYXJhbSB7b2JqZWN0fSAkZWxtXHJcbiogQHBhcmFtIHtvYmplY3R9IHRpbWVzdGFtcFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRlbG0sIHRpbWVzdGFtcCkge1xyXG4gICAgdmFyIGZvckVsZW1lbnQsIGNvbnRhaW5lciwgZm9yQ29udGFpbmVyLFxyXG4gICAgICAgIGlkQ29udGFpbmVyLCBwYXJlbnRDb250YWluZXIsIGlkRWxlbWVudDtcclxuXHJcbiAgICAvLyBDaGVjayBpZiB0aGlzIGNvbnRhaW5lciBpcyBhc3Npc25nZWQgdG8gYSBzcGVjaWZpZWQgaXNvdG9wZSBpbnN0YW5jZVxyXG4gICAgZm9yQ29udGFpbmVyID0gJGVsbS5jbG9zZXN0KCdbJyArIHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIgKyAnXScpO1xyXG4gICAgaWYoIGZvckNvbnRhaW5lci5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICBmb3JFbGVtZW50ID0gZm9yQ29udGFpbmVyLmF0dHIodGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZvckNvbnRhaW5lcik7XHJcbiAgICAgICAgY29udGFpbmVyID0gZm9yQ29udGFpbmVyO1xyXG5cclxuICAgIH1cclxuXHJcbiAgICAvLyBHZXQgdGhlIGNsb3Nlc3QgaWRcclxuICAgIGlkQ29udGFpbmVyID0gJGVsbS5jbG9zZXN0KCdbaWRdJyk7XHJcbiAgICBpZiggaWRDb250YWluZXIubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgaWRFbGVtZW50ID0gaWRDb250YWluZXIuYXR0cignaWQnKTtcclxuICAgICAgICBjb250YWluZXIgPSAoIWNvbnRhaW5lcikgPyBpZENvbnRhaW5lciA6IGNvbnRhaW5lcjsgLy9JZiBjb250YWluZXIgaGFzIG5vdCBiZWVuIGRlZmluZWQsIGRlZmluZSBpdC5cclxuXHJcbiAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICB2YXIgZm9ybWF0dGVkID0gJCgkZWxtLnBhcmVudCgpKS50ZXh0KCkudHJpbSgpLnJlcGxhY2UoL1teIWEtekEtWjAtOV0vZywgXCJcIik7XHJcbiAgICAgICAgaWRFbGVtZW50ID0gKGZvcm1hdHRlZCA9PT0gXCJcIikgPyB0aW1lc3RhbXAgOiBmb3JtYXR0ZWQgO1xyXG4gICAgICAgIGNvbnRhaW5lciA9ICghY29udGFpbmVyKSA/ICRlbG0ucGFyZW50KCkgOiBjb250YWluZXI7IC8vSWYgY29udGFpbmVyIGhhcyBub3QgYmVlbiBkZWZpbmVkLCBkZWZpbmUgaXQuXHJcblxyXG4gICAgfVxyXG5cclxuICAgIHZhciBmaWx0ZXJDb250YWluZXJNdWx0aXBsZSA9ICQoY29udGFpbmVyKS5hdHRyKHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXJNdWx0aXBsZSksXHJcbiAgICAgICAgZmlsdGVyTXVsdGlwbGUgPSAoIGZpbHRlckNvbnRhaW5lck11bHRpcGxlICE9PSBudWxsICYmIGZpbHRlckNvbnRhaW5lck11bHRpcGxlICE9PSB1bmRlZmluZWQgKSxcclxuICAgICAgICBmaWx0ZXJNZXRob2QgPSBmaWx0ZXJDb250YWluZXJNdWx0aXBsZSB8fCBcIm9yXCI7XHJcblxyXG4gICAgcmV0dXJuIHtcclxuICAgICAgICBpc0ZvcjogZm9yRWxlbWVudCB8fCB0aGlzLmd1aWQsXHJcbiAgICAgICAgaWQ6IGlkRWxlbWVudCxcclxuICAgICAgICBlbG06ICQoY29udGFpbmVyKSxcclxuICAgICAgICBmaWx0ZXJNdWx0aXBsZTogZmlsdGVyTXVsdGlwbGUsXHJcbiAgICAgICAgZmlsdGVyTWV0aG9kOiBmaWx0ZXJNZXRob2RcclxuICAgIH07XHJcblxyXG59O1xyXG4iLCIvKipcclxuKiBfZ2V0SW5zdGFuY2VzXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRtcCA9IFtdO1xyXG5cclxuICAgICQuZWFjaCh0aGlzLmluc3RhbmNlcywgZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICB0bXAucHVzaChlbG0uaXNvdG9wZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdG1wO1xyXG59O1xyXG4iLCIvKipcclxuICogX2dldFNvcnREYXRhOiBHZXQgdGhlIGRhdGEtc29ydC1ieSBhdHRyaWJ1dGVzIGFuZCBtYWtlIHRoZW0gaW50byBhbiBJc290b3BlIFwiZ2V0U29ydERhdGFcIiBvYmplY3RcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9ICBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkc29ydERhdGEgPSB7fSxcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGRhdGFTb3J0QnlTZWxlY3RvciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnlTZWxlY3RvcixcclxuICAgICAgICAkZGF0YVNvcnRCeURlZmF1bHQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQ7XHJcblxyXG4gICAgJCgnWycgKyAkZGF0YVNvcnRCeSArICddLCBbJyArICRkYXRhU29ydEJ5U2VsZWN0b3IgKyAnXScpLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgJG5hbWUgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpIHx8IG51bGwsXHJcbiAgICAgICAgICAgICRzZWxlY3RvciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeVNlbGVjdG9yKSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZigkbmFtZSAhPSAkZGF0YVNvcnRCeURlZmF1bHQpIHtcclxuICAgICAgICAgICAgaWYoJG5hbWUgIT09IG51bGwgJiYgJHNlbGVjdG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAkc29ydERhdGFbJG5hbWVdID0gJHNlbGVjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJJc290b3BlIHNvcnRpbmc6IFwiKyRkYXRhU29ydEJ5K1wiIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiIGFyZSByZXF1aXJlZC4gQ3VycmVudGx5IGNvbmZpZ3VyZWQgXCIrJGRhdGFTb3J0QnkrXCI9J1wiICsgJG5hbWUgKyBcIicgYW5kIFwiKyRkYXRhU29ydEJ5U2VsZWN0b3IrXCI9J1wiICsgJHNlbGVjdG9yICsgXCInXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuICRzb3J0RGF0YTtcclxufTtcclxuIiwiLyoqXHJcbiogX3NldENvbnRhaW5lcnM6IFNldCB0aGUgZmlsdGVycy9zb3J0ZXJzL2NsZWFyIGNvbnRhaW5lcnMgdG8gdGhlIHJpZ2h0IElzb3RvcGUgY29udGFpbmVyXHJcbiogQHNpbmNlIDAuMS4wXHJcbiogQHVwZGF0ZWQgMC4yLjJcclxuKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xyXG4gICAgdmFyICRzZWxmID0gdGhpcyxcclxuICAgICAgICBzaCA9ICRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXSxcclxuICAgICAgICB0aW1lc3RhbXAgPSBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcclxuXHJcbiAgICAkKCdbZGF0YS1maWx0ZXJdOmZpcnN0LWNoaWxkJykuZWFjaChlYWNoSXRlbS5iaW5kKHsgZGF0YVR5cGU6ICdkYXRhLWZpbHRlcicgfSkpO1xyXG4gICAgJCgnW2RhdGEtc29ydC1ieV06Zmlyc3QtY2hpbGQnKS5lYWNoKGVhY2hJdGVtLmJpbmQoeyBkYXRhVHlwZTogJ2RhdGEtc29ydC1ieScgfSkpO1xyXG4gICAgJCgnW2RhdGEtY2xlYXItZmlsdGVyXScpLmVhY2goZWFjaEl0ZW0uYmluZCh7IGRhdGFUeXBlOiAnZGF0YS1jbGVhci1maWx0ZXInIH0pKTtcclxuICAgICQoJ1tkYXRhLWZlZWRiYWNrXScpLmVhY2goZWFjaEl0ZW0uYmluZCh7IGRhdGFUeXBlOiAnZGF0YS1mZWVkYmFjaycgfSkpO1xyXG5cclxuICAgIGZ1bmN0aW9uIGVhY2hJdGVtKGluZCwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgIGRhdGFUeXBlID0gdGhpcy5kYXRhVHlwZSxcclxuICAgICAgICAgICAgZmlsdGVyQ29udGFpbmVyID0gJHNlbGYudXRpbHMuX2dldEZvckNvbnRhaW5lckFuZElkLmNhbGwoJHNlbGYsICRlbG0sIHRpbWVzdGFtcCk7XHJcblxyXG4gICAgICAgIGlmKCAkc2VsZi5ndWlkID09PSBmaWx0ZXJDb250YWluZXIuaXNGb3IgfHwgZmlsdGVyQ29udGFpbmVyLmlzRm9yID09PSBmYWxzZSkge1xyXG4gICAgICAgICAgICBpZiggZGF0YVR5cGUgPT09IFwiZGF0YS1maWx0ZXJcIiApIHtcclxuICAgICAgICAgICAgICAgIHNoLmZpbHRlckNvbnRhaW5lcltmaWx0ZXJDb250YWluZXIuaWRdID0gZmlsdGVyQ29udGFpbmVyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtc29ydC1ieVwiICkge1xyXG4gICAgICAgICAgICAgICAgc2guc29ydENvbnRhaW5lcltmaWx0ZXJDb250YWluZXIuaWRdID0gZmlsdGVyQ29udGFpbmVyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtY2xlYXItZmlsdGVyXCIgKSB7XHJcbiAgICAgICAgICAgICAgICBzaC5jbGVhckNvbnRhaW5lcltmaWx0ZXJDb250YWluZXIuaWRdID0gZmlsdGVyQ29udGFpbmVyO1xyXG4gICAgICAgICAgICB9IGVsc2UgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtZmVlZGJhY2tcIiApIHtcclxuICAgICAgICAgICAgICAgIHNoLmZlZWRiYWNrQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lci5pZF0gPSBmaWx0ZXJDb250YWluZXI7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCBkYXRhVHlwZSA9PT0gXCJkYXRhLWZpbHRlclwiIHx8IGRhdGFUeXBlID09PSBcImRhdGEtc29ydC1ieVwiICkge1xyXG4gICAgICAgICAgICB2YXIgZmlsdGVycyA9IGZpbHRlckNvbnRhaW5lci5lbG0uZmluZCgnWycrZGF0YVR5cGUrJ10nKTtcclxuXHJcbiAgICAgICAgICAgIGZpbHRlcnMuZWFjaChmdW5jdGlvbihpbmRleCwgZmlsdGVyKSB7XHJcbiAgICAgICAgICAgICAgICBpZigkc2VsZi5ndWlkID09PSBmaWx0ZXJDb250YWluZXIuaXNGb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiggJChmaWx0ZXIpLmF0dHIoZGF0YVR5cGUpICE9PSBcIipcIiApIHsgLy9UT0RPOiBob3cgdG8gaGFuZGxlIHdpbGRjYXJkP1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggZGF0YVR5cGUgPT09IFwiZGF0YS1maWx0ZXJcIiApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLmFsbEZpbHRlcnNbZmlsdGVyQ29udGFpbmVyLmlzRm9yXVskKGZpbHRlcikuYXR0cihkYXRhVHlwZSldID0gc2guZmlsdGVyQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lci5pZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZiggZGF0YVR5cGUgPT09IFwiZGF0YS1zb3J0LWJ5XCIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5hbGxTb3J0ZXJzW2ZpbHRlckNvbnRhaW5lci5pc0Zvcl1bJChmaWx0ZXIpLmF0dHIoZGF0YVR5cGUpXSA9IHNoLnNvcnRDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59O1xyXG4iXX0=
