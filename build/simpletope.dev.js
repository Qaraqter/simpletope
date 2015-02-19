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
    var $self = this;

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
                if($self.allFilters[$self.guid][elm].filterMethod === "or") {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic291cmNlL2NsZWFyL19fY2hlY2suanMiLCJzb3VyY2UvY2xlYXIvX2NoZWNrLmpzIiwic291cmNlL2NsZWFyL19jcmVhdGVDbGVhcmVycy5qcyIsInNvdXJjZS9jb25zdHJ1Y3Rvci9qcXVlcnkuanMiLCJzb3VyY2UvY29uc3RydWN0b3IvcHJvdG90eXBlLmpzIiwic291cmNlL2ZpbHRlci9fY2hlY2suanMiLCJzb3VyY2UvZmlsdGVyL19jcmVhdGVGaWx0ZXJzLmpzIiwic291cmNlL2hhc2gvX2Zvcm1hdEhhc2guanMiLCJzb3VyY2UvaGFzaC9fZ2V0SGFzaC5qcyIsInNvdXJjZS9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzIiwic291cmNlL2hhc2gvX3NldEhhc2guanMiLCJzb3VyY2UvcG9seWZpbGxzLmpzIiwic291cmNlL3NpbXBsZXRvcGUuYW1kLmpzIiwic291cmNlL3NvcnRlci9fY2hlY2suanMiLCJzb3VyY2Uvc29ydGVyL19jcmVhdGVTb3J0ZXJzLmpzIiwic291cmNlL3RleHQvX2ZlZWRiYWNrLmpzIiwic291cmNlL3V0aWxzL19nZXRFbGVtZW50RnJvbURhdGFBdHRyaWJ1dGUuanMiLCJzb3VyY2UvdXRpbHMvX2dldEZpbHRlclRlc3QuanMiLCJzb3VyY2UvdXRpbHMvX2dldEZvckNvbnRhaW5lckFuZElkLmpzIiwic291cmNlL3V0aWxzL19nZXRJbnN0YW5jZXMuanMiLCJzb3VyY2UvdXRpbHMvX2dldFNvcnREYXRhLmpzIiwic291cmNlL3V0aWxzL19zZXRDb250YWluZXJzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuKiBfY2hlY2s6IENoZWNrIGlmIHdlIG5lZWQgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIGNsZWFyIGRpdiB3aXRob3V0IGFuIGluc3RhbmNlXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCh0aGlzLCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdKTtcclxufTtcclxuIiwiLyoqXHJcbiogX2NoZWNrOiBDaGVjayBpZiB3ZSBuZWVkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBjbGVhciBkaXYuXHJcbiogQHNpbmNlIDAuMS4wXHJcbiogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuXHJcbiAgICB2YXIgJGNsZWFyRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkZGVmYXVsdEZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcixcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcclxuICAgICAgICAkaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLmNsZWFyQ29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG5cclxuICAgICAgICBjb250YWluZXIuZWxtLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICAkaGlzdG9yeSA9ICRpbnN0YW5jZS5pc290b3BlLnNvcnRIaXN0b3J5O1xyXG5cclxuICAgICAgICAgICAgaWYoJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIgIT0gJGRlZmF1bHRGaWx0ZXIgfHwgJGhpc3RvcnlbJGhpc3RvcnkubGVuZ3RoIC0gMV0gIT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAkZWxtLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkY2xlYXJGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5jbGVhckNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgICAgICB2YXIgJGNsZWFyZXJzID0gY29udGFpbmVyLmVsbTtcclxuXHJcbiAgICAgICAgJGNsZWFyZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcblxyXG4gICAgICAgICAgICAkZWxtLmhpZGUoKS5yZW1vdmVDbGFzcyhcImhpZGVcIikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRzZWxmLnVzZUhhc2ggPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZGVmYXVsdEZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICRkZWZhdWx0RmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIHNvcnRCeTogJGRlZmF1bHRTb3J0XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcclxuXHJcbiAgICB2YXIgJGFyZ3MgPSBhcmd1bWVudHNbMF0gfHwge30sXHJcbiAgICAgICAgaW5zdGFuY2VzID0gW107XHJcblxyXG4gICAgaWYodHlwZW9mIHdpbmRvdy5Jc290b3BlICE9IFwiZnVuY3Rpb25cIikge1xyXG4gICAgICAgIGFsZXJ0KFwic2ltcGxlSXNvdG9wZTogSXNvdG9wZS5KUyBjb3VsZG4ndCBiZSBmb3VuZC4gUGxlYXNlIGluY2x1ZGUgJ2lzb3RvcGUuanMnLlwiKVxyXG4gICAgICAgIHJldHVybjtcclxuICAgIH1cclxuXHJcbiAgICAkLmVhY2godGhpcywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICB2YXIgb2JqID0ge1xyXG4gICAgICAgICAgICBjb250YWluZXI6ICQoZWxtKSxcclxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcclxuICAgICAgICAgICAgICAgIGl0ZW1TZWxlY3RvcjogJy5pdGVtJyxcclxuICAgICAgICAgICAgICAgIGRhdGFTZWxlY3RvcnM6IHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICdkYXRhLWZpbHRlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RhdGEtZmlsdGVyLXR5cGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlck1ldGhvZDogJ2RhdGEtZmlsdGVyLW1ldGhvZCcsLy9EZXByYWNhdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyTXVsdGlwbGU6ICdkYXRhLWZpbHRlci1tdWx0aXBsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5OiAnZGF0YS1zb3J0LWJ5JyxcclxuICAgICAgICAgICAgICAgICAgICBzb3J0QnlTZWxlY3RvcjogJ2RhdGEtc29ydC1zZWxlY3RvcicsXHJcbiAgICAgICAgICAgICAgICAgICAgc29ydERpcmVjdGlvbjogJ2RhdGEtc29ydC1kaXJlY3Rpb24nLFxyXG4gICAgICAgICAgICAgICAgICAgIGZvckNvbnRhaW5lcjogJ2RhdGEtaXNvdG9wZS1jb250YWluZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyRmlsdGVyOiAnZGF0YS1jbGVhci1maWx0ZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrOiAnZGF0YS1mZWVkYmFjaydcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICBkZWZhdWx0czoge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogXCIqXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgc29ydDogXCJvcmlnaW5hbC1vcmRlclwiLFxyXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiAnYWN0aXZlJ1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKG5ldyAkLnNpbXBsZUlzb3RvcGUoJC5leHRlbmQob2JqLCAkYXJncykpKTtcclxuICAgIH0pO1xyXG5cclxuICAgICQuZWFjaChpbnN0YW5jZXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgZWxtLnNvcnRlci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XHJcbiAgICAgICAgZWxtLmZpbHRlci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XHJcbiAgICAgICAgZWxtLmNsZWFyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcclxuICAgICAgICBlbG0udGV4dC5fZmVlZGJhY2suY2FsbChlbG0pO1xyXG4gICAgICAgIGVsbS5jbGVhci5fX2NoZWNrLmNhbGwoZWxtKTtcclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiBpbnN0YW5jZXM7XHJcblxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRhcmdzKXtcclxuICAgICQuZXh0ZW5kKHRoaXMsICRhcmdzKTtcclxuXHJcbiAgICB2YXIgJHNlbGYgPSB0aGlzLFxyXG4gICAgICAgIHRoZUhhc2ggPSB0aGlzLmhhc2guX2dldEhhc2guY2FsbCh0aGlzKTtcclxuXHJcbiAgICB0aGlzLl9nZXRGaWx0ZXJUZXN0T3JnaW5hbCA9IElzb3RvcGUucHJvdG90eXBlLl9nZXRGaWx0ZXJUZXN0O1xyXG4gICAgSXNvdG9wZS5wcm90b3R5cGUuX2dldEZpbHRlclRlc3QgPSB0aGlzLnV0aWxzLl9nZXRGaWx0ZXJUZXN0LmJpbmQodGhpcyk7XHJcblxyXG4gICAgdGhpcy5ndWlkID0gdGhpcy5jb250YWluZXIuYXR0cihcImlkXCIpIHx8IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xyXG5cclxuICAgIHRoaXMuZW5jb2RlVVJJID0gZmFsc2U7XHJcblxyXG4gICAgdGhpcy5hbGxGaWx0ZXJzW3RoaXMuZ3VpZF0gPSB0aGlzLmFsbEZpbHRlcnNbdGhpcy5ndWlkXSB8fCB7fTtcclxuICAgIHRoaXMuYWxsU29ydGVyc1t0aGlzLmd1aWRdID0gdGhpcy5hbGxTb3J0ZXJzW3RoaXMuZ3VpZF0gfHwge307XHJcblxyXG4gICAgLy9GaXJzdCB0aW1lIGluaXQgaXNvdG9wZVxyXG4gICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSA9IHtcclxuICAgICAgICBpc290b3BlOiBmYWxzZSxcclxuICAgICAgICBmaWx0ZXJDb250YWluZXI6IHt9LFxyXG4gICAgICAgIHNvcnRDb250YWluZXI6IHt9LFxyXG4gICAgICAgIGNsZWFyQ29udGFpbmVyOiB7fSxcclxuICAgICAgICBmZWVkYmFja0NvbnRhaW5lcjoge31cclxuICAgIH07XHJcblxyXG4gICAgLy9HZXQgY29udGFpbmVycyBvZiBmaWx0ZXJzXHJcbiAgICB0aGlzLnV0aWxzLl9zZXRDb250YWluZXJzLmNhbGwodGhpcywgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlKTtcclxuXHJcbiAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUgPSBuZXcgSXNvdG9wZSh0aGlzLmNvbnRhaW5lci5jb250ZXh0LCB7XHJcbiAgICAgICAgZmlsdGVyOiB0aGVIYXNoIHx8IFwiKlwiLFxyXG4gICAgICAgIGl0ZW1TZWxlY3RvcjogJHNlbGYuc2V0dGluZ3MuaXRlbVNlbGVjdG9yIHx8ICcuaXRlbScsXHJcbiAgICAgICAgbGF5b3V0TW9kZTogJHNlbGYuY29udGFpbmVyLmRhdGEoXCJsYXlvdXRcIikgfHwgXCJmaXRSb3dzXCIsXHJcbiAgICAgICAgZ2V0U29ydERhdGE6ICRzZWxmLnV0aWxzLl9nZXRTb3J0RGF0YS5jYWxsKHRoaXMpXHJcbiAgICB9KTtcclxuXHJcbiAgICBpZih0aGlzLmNvbnRhaW5lci5kYXRhKFwiaGFzaFwiKSAhPT0gbnVsbCAmJiB0aGlzLmNvbnRhaW5lci5kYXRhKFwiaGFzaFwiKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgdGhpcy51c2VIYXNoID0gdHJ1ZTtcclxuICAgIH1cclxuXHJcbiAgICBpZih3aW5kb3cuaW1hZ2VzTG9hZGVkICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uaXNvdG9wZS5sYXlvdXQoKTtcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICAvL0FkZCBoYXNoIHN1cHBvcnRcclxuICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIHRoaXMuaGFzaC5fb25IYXNoQ2hhbmdlZC5iaW5kKHRoaXMpKTtcclxuXHJcbiB9O1xyXG4iLCIvKipcclxuICogX2NoZWNrQWN0aXZlOiBDaGVjayBpZiBidXR0b25zIG5lZWQgYW4gYWN0aXZlIGNsYXNzXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuXHJcbiAgICB2YXIgJGRhdGFGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyLFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gJGluc3RhbmNlIHx8IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZTtcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIuc3BsaXQoXCIsXCIpLCBmdW5jdGlvbiggaW5kZXgsIGZpbHRlciApIHtcclxuXHJcbiAgICAgICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKCBpZHgsIGNvbnRhaW5lciApIHtcclxuICAgICAgICAgICAgdmFyIGVsbSA9IGNvbnRhaW5lci5lbG0uZmluZChcIltcIiskZGF0YUZpbHRlcitcIj1cXFwiXCIrZmlsdGVyK1wiXFxcIl1cIik7XHJcblxyXG4gICAgICAgICAgICBpZihlbG0ucHJvcChcInRhZ05hbWVcIikgJiYgZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwib3B0aW9uXCIpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBlbG0uYXR0cignc2VsZWN0ZWQnLCdzZWxlY3RlZCcpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihpbmRleCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vUmVtb3ZlIGFsbCBhY3RpdmUgY2xhc3NlcyBmaXJzdCB0aW1lXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmVsbS5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIC8vQWRkIGFjdGl2ZSBjbGFzc2VzXHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gZWxtLmFkZENsYXNzKCRhY3RpdmVDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoYWN0aXZlLmxlbmd0aCA+IDAgJiYgZmlsdGVyICE9ICRkZWZhdWx0RmlsdGVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmVsbS5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIiskZGVmYXVsdEZpbHRlcitcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcblxyXG59O1xyXG4iLCIvKipcclxuKiBfY3JlYXRlRmlsdGVyczogY3JlYXRlIGJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKiBAdXBkYXRlZCAwLjIuMVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRmaWx0ZXJzID0gY29udGFpbmVyLmVsbS5maW5kKCdbJyskZGF0YUZpbHRlcisnXScpO1xyXG5cclxuICAgICAgICAkZmlsdGVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyBcImNoYW5nZVwiIDogXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gJGVsbS5jbG9zZXN0KFwic2VsZWN0XCIpIDogJGVsbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGhvdy5lbGVtZW50Lm9uKGhvdy5ldmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBEbyBub3QgcmV0dXJuIGZhbHNlIGJlZm9yZSBzZXR0aW5nIGlzb3RvcGUgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgaWYoaG93LmV2ZW50TmFtZSA9PSBcImNoYW5nZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaG93LmVsZW1lbnQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0gIT0gZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRkYXRhRmlsdGVyQXR0ciA9ICRlbG0uYXR0cigkZGF0YUZpbHRlciksXHJcbiAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGRhdGFGaWx0ZXJBdHRyLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMgPSAkZGF0YUZpbHRlckF0dHIsXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlRmlsdGVycywgY3VycmVudEZpbHRlcnM7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZmlsdGVyVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBjdXJyZW50IGFjdGl2ZSBmaWx0ZXJzIGZyb20gaXNvdG9wZSBpbnN0YW5jZVxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUZpbHRlcnMgPSAkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY2xpY2tlZCBmaWx0ZXIncyB2YWx1ZSBpcyBub3QgYSB3aWxkY2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGFjdGl2ZUZpbHRlcnMgIT09IFwiKlwiICYmICRmaWx0ZXJWYWx1ZSAhPT0gXCIqXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlRmlsdGVycyA9IGFjdGl2ZUZpbHRlcnMuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0xvb3AgdGhyb3VnaCBhbGwgYWN0aXZlIGZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGFjdGl2ZUZpbHRlcnMsIGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2V0dGluZyA9ICRzZWxmLmFsbEZpbHRlcnNbJHNlbGYuZ3VpZF1bZWxlbWVudF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiB0aGlzIGNvbnRhaW5lciBhbGxvd3MgbXVsdGlwbGUgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2V0dGluZy5maWx0ZXJNdWx0aXBsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMucHVzaChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvbnRhaW5lciBvbmx5IGFsbG93cyBvbmUgZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Bhc3Mgb24gZmlsdGVycyB0aGF0IGFyZSBub3QgaW4gc2FtZSBjb250YWluZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb250YWluZXIuZWxtICE9PSBzZXR0aW5nLmVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBjb250YWluZXIgYWxsb3dzIG11bHRpcGxlIGZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29udGFpbmVyLmZpbHRlck11bHRpcGxlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiBmaWx0ZXIgaXMgYWxyZWFkeSBkZWZpbmVkLCBpZiBzbyB0b2dnbGUgaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBuZXdGaWx0ZXJzLmluZGV4T2YoJGZpbHRlclZhbHVlKSA9PT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsdGVycy5wdXNoKCRmaWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMuc3BsaWNlKG5ld0ZpbHRlcnMuaW5kZXhPZigkZmlsdGVyVmFsdWUpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ29udGFpbmVyIG9ubHkgYWxsb3dzIG9uZSBmaWx0ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Bhc3Mgb24gdGhlIGNsaWNrZWQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMucHVzaCgkZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzID0gbmV3RmlsdGVycy5qb2luKFwiLFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL0lmIGZpbHRlcnMgaXMgZW1wdHkgdGhlbiByZXNldCBpdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICBpZihuZXdGaWx0ZXJzID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMgPSBcIipcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IG5ld0ZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLCIvKipcclxuKiBfZm9ybWF0SGFzaDogRm9ybWF0IG11bHRpcGxlIGZpbHRlcnMgaW50byBvbmUgc3RyaW5nIGJhc2VkIG9uIGEgcmVndWxhciBleHByZXNzaW9uXHJcbiogQHNpbmNlIDAuMS4wXHJcbiogQHBhcmFtIHtyZWdleH0gcmVcclxuKiBAcGFyYW0ge3N0cmluZ30gc3RyXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmUsIHN0cikge1xyXG4gICAgdmFyIG1hdGNoZXMgPSB7fSxcclxuICAgICAgICBtYXRjaDtcclxuXHJcbiAgICB3aGlsZSAoKG1hdGNoID0gcmUuZXhlYyhzdHIpKSAhPT0gbnVsbCkge1xyXG4gICAgICAgIGlmIChtYXRjaC5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XHJcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCsrO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYobWF0Y2hbM10gIT09IG51bGwgJiYgbWF0Y2hbM10gIT09IHVuZGVmaW5lZCkge1xyXG5cclxuICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFszXV0gPSB0cnVlO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgaWYobWF0Y2hlc1ttYXRjaFsxXV0gPT09IG51bGwgfHwgbWF0Y2hlc1ttYXRjaFsxXV0gPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFsxXV0gPSBbXTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXS5wdXNoKG1hdGNoWzJdKTtcclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbiAgICByZXR1cm4gbWF0Y2hlcztcclxufTtcclxuIiwiLyoqXHJcbiAqIF9nZXRIYXNoOiBHZXQgd2luZG93LmxvY2F0aW9uLmhhc2ggYW5kIGZvcm1hdCBpdCBmb3IgSXNvdG9wZVxyXG4gKiBAc2luY2UgMC4xLjBcclxuICovXHJcblxyXG4gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGZhbHNlLFxyXG4gICAgICAgICRuZXdIYXNoID0gXCJcIjtcclxuXHJcbiAgICAkaGFzaCA9ICgkaGFzaCAhPT0gZmFsc2UgJiYgJGhhc2ggIT09IFwiI1wiICYmICRoYXNoICE9PSBcIlwiKSA/IGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaGFzaCkgOiAnKic7XHJcblxyXG4gICAgLy9SZW1vdmUgaGFzaCBmcm9tIGZpcnN0IGNoYXJhY3RlciBpZiBpdHMgZXhpc3RcclxuICAgIGlmICgkaGFzaC5jaGFyQXQoMCkgPT09ICcjJykge1xyXG4gICAgICAgICAkaGFzaCA9ICRoYXNoLnNsaWNlKDEpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBoYXNoQXJyYXkgPSAkaGFzaC5zcGxpdChcIiZcIik7XHJcbiAgICAkLmVhY2goaGFzaEFycmF5LCBmdW5jdGlvbihrZXksICRwYXJ0SGFzaCkge1xyXG5cclxuICAgICAgICBpZigkcGFydEhhc2guaW5kZXhPZihcIj1cIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgdG1wID0gJHBhcnRIYXNoLnNwbGl0KFwiPVwiKSxcclxuICAgICAgICAgICAgICAgIGFyciA9IFtdLCB2YWx1ZXMsIG5hbWU7XHJcblxyXG4gICAgICAgICAgICBpZih0bXAubGVuZ3RoID4gMSkge1xyXG4gICAgICAgICAgICAgICAgbmFtZSA9IHRtcFswXTtcclxuICAgICAgICAgICAgICAgIHZhbHVlcyA9IHRtcFsxXS5yZXBsYWNlKC9cXCcvZywgXCJcIik7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgICAgIGFyci5wdXNoKFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVwiKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJG5ld0hhc2ggKz0gYXJyLmpvaW4oXCIsXCIpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkbmV3SGFzaCArPSAoJHBhcnRIYXNoID09IFwiKlwiIHx8ICRwYXJ0SGFzaC5jaGFyQXQoMCkgPT0gJy4nKSA/ICRwYXJ0SGFzaDogXCIuXCIgKyAkcGFydEhhc2g7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihrZXkgIT0gKGhhc2hBcnJheS5sZW5ndGggLSAxKSkge1xyXG4gICAgICAgICAgICAkbmV3SGFzaCArPSBcIixcIjtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSk7XHJcblxyXG4gICAgIHJldHVybiAkbmV3SGFzaDtcclxuXHJcbiB9O1xyXG4iLCIvKipcclxuKiBfb25IYXNoQ2hhbmdlOiBmaXJlcyB3aGVuIGxvY2F0aW9uLmhhc2ggaGFzIGJlZW4gY2hhbmdlZFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fc2V0SXNvdG9wZS5jYWxsKHRoaXMsIHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpKTtcclxufTtcclxuIiwiLyoqXHJcbiAqIF9zZXRIYXNoOiBTZXQgYSBuZXcgbG9jYXRpb24uaGFzaCBhZnRlciBmb3JtYXR0aW5nIGl0XHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXHJcbiAqIEBwYXJhbSB7c3RyaW5nfSAkbmV3SGFzaFxyXG4gKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlLCAkbmV3SGFzaCkge1xyXG4gICAgdmFyICRjdXJyZW50SGFzaCA9ICgkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIgPT0gXCIqXCIpID8gXCJcIiA6ICRpbnN0YW5jZS5vcHRpb25zLmZpbHRlcixcclxuICAgICAgICAkY29tYmluZWRIYXNoLFxyXG4gICAgICAgICRlbmRIYXNoID0gW107XHJcblxyXG4gICAgaWYoJG5ld0hhc2ggIT0gXCIqXCIpIHtcclxuXHJcbiAgICAgICAgaWYoJGN1cnJlbnRIYXNoLmluZGV4T2YoJG5ld0hhc2gpID09PSAtMSkge1xyXG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoICsgJG5ld0hhc2g7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGNvbWJpbmVkSGFzaCA9ICRjdXJyZW50SGFzaC5yZXBsYWNlKCRuZXdIYXNoLCBcIlwiKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciAkZm9ybWF0dGVkSGFzaCA9IHRoaXMuaGFzaC5fZm9ybWF0SGFzaCgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF18KC5bQS1aYS16MC05XSspL2csICRjb21iaW5lZEhhc2gpO1xyXG5cclxuICAgICAgICAkLmVhY2goJGZvcm1hdHRlZEhhc2gsIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgICAgIGlmKGVsbSA9PT0gdHJ1ZSkgey8vaXNDbGFzc1xyXG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaCggKGtleS5jaGFyQXQoMCkgPT0gJy4nKSA/IGtleS5zbGljZSgxKSA6IGtleSApO1xyXG4gICAgICAgICAgICB9IGVsc2Ugey8vaXNPYmplY3RcclxuICAgICAgICAgICAgICAgICRlbmRIYXNoLnB1c2goa2V5ICsgXCI9XCIgKyBlbG0uam9pbihcIixcIikpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRlbmRIYXNoID0gJGVuZEhhc2guam9pbihcIiZcIik7XHJcbiAgICB9IGVsc2Uge1xyXG4gICAgICAgICRlbmRIYXNoID0gJG5ld0hhc2g7XHJcbiAgICB9XHJcblxyXG4gICAgaWYoJGVuZEhhc2ggPT09IFwiKlwiIHx8ICRlbmRIYXNoID09PSBcIlwiKSB7XHJcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIlwiO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICh0aGlzLmVuY29kZVVSSSA9PT0gdHJ1ZSkgPyBlbmNvZGVVUklDb21wb25lbnQoJGVuZEhhc2gpIDogJGVuZEhhc2g7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuICRlbmRIYXNoO1xyXG59O1xyXG4iLCJpZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XHJcbiAgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihvVGhpcykge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIC8vIGNsb3Nlc3QgdGhpbmcgcG9zc2libGUgdG8gdGhlIEVDTUFTY3JpcHQgNVxyXG4gICAgICAvLyBpbnRlcm5hbCBJc0NhbGxhYmxlIGZ1bmN0aW9uXHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIC0gd2hhdCBpcyB0cnlpbmcgdG8gYmUgYm91bmQgaXMgbm90IGNhbGxhYmxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFBcmdzICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxyXG4gICAgICAgIGZUb0JpbmQgPSB0aGlzLFxyXG4gICAgICAgIGZOT1AgICAgPSBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgIGZCb3VuZCAgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZUb0JpbmQuYXBwbHkodGhpcyBpbnN0YW5jZW9mIGZOT1AgJiYgb1RoaXMgPyB0aGlzIDogb1RoaXMsIGFBcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICBmTk9QLnByb3RvdHlwZSA9IHRoaXMucHJvdG90eXBlO1xyXG4gICAgZkJvdW5kLnByb3RvdHlwZSA9IG5ldyBmTk9QKCk7XHJcblxyXG4gICAgcmV0dXJuIGZCb3VuZDtcclxuICB9O1xyXG59XHJcblxyXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS50cmltKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICB9O1xyXG59XHJcblxyXG5pZiAoIUFycmF5LnByb3RvdHlwZS5pbmRleE9mKSB7XHJcbiAgQXJyYXkucHJvdG90eXBlLmluZGV4T2YgPSBmdW5jdGlvbihzZWFyY2hFbGVtZW50LCBmcm9tSW5kZXgpIHtcclxuXHJcbiAgICB2YXIgaztcclxuXHJcbiAgICAvLyAxLiBMZXQgTyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgVG9PYmplY3QgcGFzc2luZ1xyXG4gICAgLy8gICAgdGhlIHRoaXMgdmFsdWUgYXMgdGhlIGFyZ3VtZW50LlxyXG4gICAgaWYgKHRoaXMgPT0gbnVsbCkge1xyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdcInRoaXNcIiBpcyBudWxsIG9yIG5vdCBkZWZpbmVkJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIE8gPSBPYmplY3QodGhpcyk7XHJcblxyXG4gICAgLy8gMi4gTGV0IGxlblZhbHVlIGJlIHRoZSByZXN1bHQgb2YgY2FsbGluZyB0aGUgR2V0XHJcbiAgICAvLyAgICBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIHRoZSBhcmd1bWVudCBcImxlbmd0aFwiLlxyXG4gICAgLy8gMy4gTGV0IGxlbiBiZSBUb1VpbnQzMihsZW5WYWx1ZSkuXHJcbiAgICB2YXIgbGVuID0gTy5sZW5ndGggPj4+IDA7XHJcblxyXG4gICAgLy8gNC4gSWYgbGVuIGlzIDAsIHJldHVybiAtMS5cclxuICAgIGlmIChsZW4gPT09IDApIHtcclxuICAgICAgcmV0dXJuIC0xO1xyXG4gICAgfVxyXG5cclxuICAgIC8vIDUuIElmIGFyZ3VtZW50IGZyb21JbmRleCB3YXMgcGFzc2VkIGxldCBuIGJlXHJcbiAgICAvLyAgICBUb0ludGVnZXIoZnJvbUluZGV4KTsgZWxzZSBsZXQgbiBiZSAwLlxyXG4gICAgdmFyIG4gPSArZnJvbUluZGV4IHx8IDA7XHJcblxyXG4gICAgaWYgKE1hdGguYWJzKG4pID09PSBJbmZpbml0eSkge1xyXG4gICAgICBuID0gMDtcclxuICAgIH1cclxuXHJcbiAgICAvLyA2LiBJZiBuID49IGxlbiwgcmV0dXJuIC0xLlxyXG4gICAgaWYgKG4gPj0gbGVuKSB7XHJcbiAgICAgIHJldHVybiAtMTtcclxuICAgIH1cclxuXHJcbiAgICAvLyA3LiBJZiBuID49IDAsIHRoZW4gTGV0IGsgYmUgbi5cclxuICAgIC8vIDguIEVsc2UsIG48MCwgTGV0IGsgYmUgbGVuIC0gYWJzKG4pLlxyXG4gICAgLy8gICAgSWYgayBpcyBsZXNzIHRoYW4gMCwgdGhlbiBsZXQgayBiZSAwLlxyXG4gICAgayA9IE1hdGgubWF4KG4gPj0gMCA/IG4gOiBsZW4gLSBNYXRoLmFicyhuKSwgMCk7XHJcblxyXG4gICAgLy8gOS4gUmVwZWF0LCB3aGlsZSBrIDwgbGVuXHJcbiAgICB3aGlsZSAoayA8IGxlbikge1xyXG4gICAgICAvLyBhLiBMZXQgUGsgYmUgVG9TdHJpbmcoaykuXHJcbiAgICAgIC8vICAgVGhpcyBpcyBpbXBsaWNpdCBmb3IgTEhTIG9wZXJhbmRzIG9mIHRoZSBpbiBvcGVyYXRvclxyXG4gICAgICAvLyBiLiBMZXQga1ByZXNlbnQgYmUgdGhlIHJlc3VsdCBvZiBjYWxsaW5nIHRoZVxyXG4gICAgICAvLyAgICBIYXNQcm9wZXJ0eSBpbnRlcm5hbCBtZXRob2Qgb2YgTyB3aXRoIGFyZ3VtZW50IFBrLlxyXG4gICAgICAvLyAgIFRoaXMgc3RlcCBjYW4gYmUgY29tYmluZWQgd2l0aCBjXHJcbiAgICAgIC8vIGMuIElmIGtQcmVzZW50IGlzIHRydWUsIHRoZW5cclxuICAgICAgLy8gICAgaS4gIExldCBlbGVtZW50SyBiZSB0aGUgcmVzdWx0IG9mIGNhbGxpbmcgdGhlIEdldFxyXG4gICAgICAvLyAgICAgICAgaW50ZXJuYWwgbWV0aG9kIG9mIE8gd2l0aCB0aGUgYXJndW1lbnQgVG9TdHJpbmcoaykuXHJcbiAgICAgIC8vICAgaWkuICBMZXQgc2FtZSBiZSB0aGUgcmVzdWx0IG9mIGFwcGx5aW5nIHRoZVxyXG4gICAgICAvLyAgICAgICAgU3RyaWN0IEVxdWFsaXR5IENvbXBhcmlzb24gQWxnb3JpdGhtIHRvXHJcbiAgICAgIC8vICAgICAgICBzZWFyY2hFbGVtZW50IGFuZCBlbGVtZW50Sy5cclxuICAgICAgLy8gIGlpaS4gIElmIHNhbWUgaXMgdHJ1ZSwgcmV0dXJuIGsuXHJcbiAgICAgIGlmIChrIGluIE8gJiYgT1trXSA9PT0gc2VhcmNoRWxlbWVudCkge1xyXG4gICAgICAgIHJldHVybiBrO1xyXG4gICAgICB9XHJcbiAgICAgIGsrKztcclxuICAgIH1cclxuICAgIHJldHVybiAtMTtcclxuICB9O1xyXG59XHJcbiIsInZhciAkID0gd2luZG93LmpRdWVyeTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZSA9IHJlcXVpcmUoXCIuL2NvbnN0cnVjdG9yL3Byb3RvdHlwZS5qc1wiKTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZS5wcm90b3R5cGUgPSB7XHJcbiAgICBpbnN0YW5jZXM6IHt9LFxyXG4gICAgYWxsRmlsdGVyczoge30sXHJcbiAgICBhbGxTb3J0ZXJzOiB7fSxcclxuXHJcbiAgICBjb25zdHJ1Y3RvcjogJC5zaW1wbGVJc290b3BlLFxyXG5cclxuICAgIGhhc2g6IHtcclxuICAgICAgICBfZ2V0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fZ2V0SGFzaC5qc1wiKSxcclxuICAgICAgICBfc2V0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fc2V0SGFzaC5qc1wiKSxcclxuICAgICAgICBfZm9ybWF0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fZm9ybWF0SGFzaC5qc1wiKSxcclxuICAgICAgICBfb25IYXNoQ2hhbmdlZDogcmVxdWlyZShcIi4vaGFzaC9fb25IYXNoQ2hhbmdlZC5qc1wiKVxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9maWx0ZXIvX2NyZWF0ZUZpbHRlcnMuanNcIiksXHJcbiAgICAgICAgX2NoZWNrOiByZXF1aXJlKFwiLi9maWx0ZXIvX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgc29ydGVyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL3NvcnRlci9fY3JlYXRlU29ydGVycy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL3NvcnRlci9fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICBjbGVhcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9jbGVhci9fY3JlYXRlQ2xlYXJlcnMuanNcIiksXHJcbiAgICAgICAgX2NoZWNrOiByZXF1aXJlKFwiLi9jbGVhci9fY2hlY2suanNcIiksXHJcbiAgICAgICAgX19jaGVjazogcmVxdWlyZShcIi4vY2xlYXIvX19jaGVjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIHRleHQ6IHtcclxuICAgICAgICBfZmVlZGJhY2s6IHJlcXVpcmUoXCIuL3RleHQvX2ZlZWRiYWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgdXRpbHM6IHtcclxuICAgICAgICBfc2V0Q29udGFpbmVyczogcmVxdWlyZShcIi4vdXRpbHMvX3NldENvbnRhaW5lcnMuanNcIiksXHJcbiAgICAgICAgX2dldEZvckNvbnRhaW5lckFuZElkOiByZXF1aXJlKFwiLi91dGlscy9fZ2V0Rm9yQ29udGFpbmVyQW5kSWQuanNcIiksXHJcbiAgICAgICAgX2dldFNvcnREYXRhOiByZXF1aXJlKFwiLi91dGlscy9fZ2V0U29ydERhdGEuanNcIiksXHJcbiAgICAgICAgX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZTogcmVxdWlyZShcIi4vdXRpbHMvX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZS5qc1wiKSxcclxuICAgICAgICBfZ2V0RmlsdGVyVGVzdDogcmVxdWlyZShcIi4vdXRpbHMvX2dldEZpbHRlclRlc3QuanNcIiksXHJcbiAgICAgICAgX2dldEluc3RhbmNlczogcmVxdWlyZShcIi4vdXRpbHMvX2dldEluc3RhbmNlcy5qc1wiKVxyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX29uQmVmb3JlSXNvdG9wZUNoYW5nZTogZmlyZXMgYmVmb3JlIHRoZSBJc290b3BlIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiAgICAqL1xyXG4gICAgX29uQmVmb3JlSXNvdG9wZUNoYW5nZTogZnVuY3Rpb24oJGluc3RhbmNlKSB7fSxcclxuXHJcbiAgICAvKipcclxuICAgICogX29uSXNvdG9wZUNoYW5nZTogZmlyZXMgd2hlbiB0aGUgSXNvdG9wZSBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZFxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9vbklzb3RvcGVDaGFuZ2U6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy5zb3J0ZXIuX2NoZWNrLmNhbGwodGhpcywgJGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UuaXNvdG9wZSk7XHJcbiAgICAgICAgdGhpcy50ZXh0Ll9mZWVkYmFjay5jYWxsKHRoaXMsICRpbnN0YW5jZS5pc290b3BlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9zZXRJc290b3BlOiBSZWNvbmZpZ3VyZSBpc290b3BlXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJHNlbGVjdG9yXHJcbiAgICAqL1xyXG4gICAgX3NldElzb3RvcGU6IGZ1bmN0aW9uKCRzZWxlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgZmlsdGVyOiAkc2VsZWN0b3JcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fb25Jc290b3BlQ2hhbmdlKHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0pO1xyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbiQuZm4uc2ltcGxlSXNvdG9wZSA9IHJlcXVpcmUoXCIuL2NvbnN0cnVjdG9yL2pxdWVyeS5qc1wiKTtcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgJC5lYWNoKCQoXCJbZGF0YS1pc290b3BlXVwiKSwgZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICAkKGVsbSkuc2ltcGxlSXNvdG9wZSgpO1xyXG4gICAgfSk7XHJcbn0pO1xyXG4iLCIvKipcclxuICogX2NoZWNrQWN0aXZlOiBDaGVjayBpZiBidXR0b25zIG5lZWQgYW4gYWN0aXZlIGNsYXNzXHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXHJcbiAqL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuXHJcbiAgICB2YXIgJGRhdGFTb3J0ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAgICAgJGluc3RhbmNlID0gJGluc3RhbmNlIHx8IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcclxuICAgICAgICAkc29ydEhpc3RvcnkgPSAkaW5zdGFuY2UuaXNvdG9wZS5zb3J0SGlzdG9yeSxcclxuICAgICAgICAkc29ydEFzY2VuZGluZyA9ICRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuc29ydEFzY2VuZGluZztcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLnNvcnRDb250YWluZXIsIGZ1bmN0aW9uKCBpZHgsIGNvbnRhaW5lciApIHtcclxuICAgICAgICB2YXIgZWxtID0gY29udGFpbmVyLmVsbS5maW5kKFwiW1wiKyRkYXRhU29ydCtcIl1cIiksXHJcbiAgICAgICAgICAgIHNvcnREaXJlY3Rpb24gPSBcImRlc2NcIjtcclxuXHJcbiAgICAgICAgaWYoJHNvcnRBc2NlbmRpbmcpIHtcclxuICAgICAgICAgICAgc29ydERpcmVjdGlvbiA9IFwiYXNjXCI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZihlbG0ucHJvcChcInRhZ05hbWVcIikgJiYgZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwib3B0aW9uXCIpIHtcclxuXHJcbiAgICAgICAgICAgIC8vIGVsbS5wcm9wKCdzZWxlY3RlZCcsIGZhbHNlKTtcclxuICAgICAgICAgICAgLy8gdmFyIGFjdGl2ZSA9IGNvbnRhaW5lci5lbG0uZmluZCgnWycrJGRhdGFTb3J0Kyc9XCInKyAkc29ydEhpc3RvcnlbMF0gKydcIl1bZGF0YS1zb3J0LWRpcmVjdGlvbj1cIicgKyBzb3J0RGlyZWN0aW9uICsgJ1wiXScpLnByb3AoJ3NlbGVjdGVkJywgJ3NlbGVjdGVkJyk7XHJcbiAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKGFjdGl2ZSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG5cclxuICAgICAgICAgICAgLy9SZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIGZpcnN0IHRpbWVcclxuICAgICAgICAgICAgZWxtLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XHJcblxyXG4gICAgICAgICAgICAvL0FkZCBhY3RpdmUgY2xhc3Nlc1xyXG4gICAgICAgICAgICB2YXIgYWN0aXZlID0gY29udGFpbmVyLmVsbS5maW5kKCdbJyskZGF0YVNvcnQrJz1cIicrICRzb3J0SGlzdG9yeVswXSArJ1wiXVtkYXRhLXNvcnQtZGlyZWN0aW9uPVwiJyArIHNvcnREaXJlY3Rpb24gKyAnXCJdJykuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGFjdGl2ZS5sZW5ndGggPiAwICYmICRzb3J0SGlzdG9yeVswXSAhPSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5lbG0uZmluZChcIltcIiskZGF0YVNvcnQrXCI9XFxcIlwiKyRkZWZhdWx0U29ydCtcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFTb3J0K1wiPVxcXCJcIiskZGVmYXVsdFNvcnQrXCJcXFwiXVwiKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH0pO1xyXG5cclxufTtcclxuIiwiLyoqXHJcbiogX2NyZWF0ZUJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICRkYXRhU29ydERpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkc29ydEFycmF5ID0gW10sXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5zb3J0Q29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHZhciAkc29ydGVycyA9IGNvbnRhaW5lci5lbG0uZmluZCgnWycrJGRhdGFTb3J0QnkrJ10nKTtcclxuXHJcbiAgICAgICAgJHNvcnRlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgICAgICRkYXRhU29ydEF0dHIgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpLFxyXG4gICAgICAgICAgICAgICAgaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyBcImNoYW5nZVwiIDogXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gJGVsbS5jbG9zZXN0KFwic2VsZWN0XCIpIDogJGVsbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGhvdy5lbGVtZW50Lm9uKGhvdy5ldmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihob3cuZXZlbnROYW1lID09IFwiY2hhbmdlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihob3cuZWxlbWVudC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXSAhPSBlbG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJHNvcnRCeVZhbHVlID0gJycsXHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRBc2MgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBJJ20gZ2FubmEgbGVhdmUgdGhpcyBjb2RlIGhlcmUgZm9yIG5vdywgaWYgd2UgZXZlciBuZWVkIHRvIGFkZCBtdWx0aXBsZSBzdXBwb3J0IG9uIHNvcnRlcnNcclxuICAgICAgICAgICAgICAgIC8vIGlmKCRzZWxmLmZpbHRlck11bHRpcGxlKSB7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICRzb3J0QnlWYWx1ZSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICBpZigkZGF0YVNvcnRBdHRyID09ICRkZWZhdWx0U29ydCkge1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJHNvcnRBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgaWYoJHNvcnRBcnJheS5pbmRleE9mKCRkYXRhU29ydEF0dHIpID09PSAtMSkgey8vaXRlbSBub3QgZmlsdGVyZWRcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAkc29ydEFycmF5LnB1c2goJGRhdGFTb3J0QXR0cik7XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9IGVsc2Ugey8vaXRlbSBhbHJlYWR5IGZpbHRlcmVkXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgaWYoJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5zb3J0QXNjZW5kaW5nICE9PSAoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikudG9Mb3dlckNhc2UoKSA9PT0gXCJhc2NcIikpIHsvL0FyZSB3ZSBjaGFuZ2luZyBkZXNjIG9yIGFzYz9cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgICAgICAvL0RvIG5vdGhpbmcsIGFycmF5IHdpbGwgYmUgdGhlIHNhbWUsIHdlJ3JlIG9ubHkgY2hhbmlnbmcgc29ydCBkaXJlY3Rpb25cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgJHNvcnRBcnJheS5zcGxpY2UoJHNvcnRBcnJheS5pbmRleE9mKCRkYXRhU29ydEF0dHIpLCAxKTsgLy9zYW1lIGl0ZW0gZmlsdGVyZWQsIHJlbW92ZSB0aGlzIGl0ZW0gZnJvbSBhcnJheVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgaWYoJHNvcnRBcnJheS5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRlZmF1bHRTb3J0O1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRzb3J0QXJyYXk7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgJHNvcnRCeVZhbHVlID0gJGRhdGFTb3J0QXR0cjtcclxuICAgICAgICAgICAgICAgIC8vIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSAkZGF0YVNvcnRBdHRyO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pICE9PSBudWxsICYmICRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKS50b0xvd2VyQ2FzZSgpID09PSBcImFzY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJGluc3RhbmNlLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5OiAkc29ydEJ5VmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEFzY2VuZGluZzogJHNvcnRBc2NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyICRpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQuZWFjaCgkaW5zdGFuY2UuZmVlZGJhY2tDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRmZWVkYmFjayA9IGNvbnRhaW5lci5lbG07XHJcblxyXG4gICAgICAgICRmZWVkYmFjay5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG4gICAgICAgICAgICAkZWxtLnRleHQoJGVsbS5hdHRyKFwiZGF0YS1mZWVkYmFja1wiKS5yZXBsYWNlKFwie2RlbHRhfVwiLCAkaW5zdGFuY2UuaXNvdG9wZS5maWx0ZXJlZEl0ZW1zLmxlbmd0aCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiIsIi8qKlxyXG4qIF9nZXRFbGVtZW50RnJvbURhdGFBdHRyaWJ1dGVcclxuKiBAc2luY2UgMC4xLjBcclxuKiBAdXBkYXRlIDAuMi4xXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgIHZhciAkdG1wO1xyXG5cclxuICAgIGlmKHNlbGVjdG9yID09PSBcIlwiIHx8IHNlbGVjdG9yID09PSBmYWxzZSB8fCBzZWxlY3RvciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHNlbGVjdG9yIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHNlbGVjdG9yLmNoYXJBdCgwKSA9PT0gXCIjXCIgfHwgc2VsZWN0b3IuY2hhckF0KDApID09PSBcIi5cIikge1x0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICB9IGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZihcIiNcIikgIT09IC0xIHx8IHNlbGVjdG9yLmluZGV4T2YoXCIuXCIpICE9PSAtMSkge1x0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICB9IGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZihcIiBcIikgIT09IC0xKSB7XHRcdFx0XHRcdFx0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICB9IGVsc2Uge1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvL2V2dWxhdGUgdGhlIHN0cmluZyBhcyBhbiBpZFxyXG4gICAgICAgICR0bXAgPSAkKFwiI1wiICsgc2VsZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCR0bXAubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwic2ltcGxldG9wZTogV2UgY2Fubm90IGZpbmQgYW55IERPTSBlbGVtZW50IHdpdGggdGhlIENTUyBzZWxlY3RvcjogJ1wiICsgc2VsZWN0b3IgKyBcIidcIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gJHRtcDtcclxuICAgIH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmaWx0ZXIpIHtcclxuICAgIHZhciAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cclxuICAgICAgICB2YXIgZmlsdGVycyA9IGZpbHRlci5zcGxpdChcIixcIiksXHJcbiAgICAgICAgICAgIGFjdGl2ZSA9IFtdLFxyXG4gICAgICAgICAgICBjb250YWluZXIgPSBbXTtcclxuXHJcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgIC8vRW5hYmxlIGZpbHRlcmluZyB3aXRoIGRhdGEtYXR0cmlidXRlc1xyXG4gICAgICAgICAgICBpZihmaWx0ZXJzW2ldLmluZGV4T2YoXCJkYXRhLVwiKSAhPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgY2F0ID0gZmlsdGVyc1tpXS5yZXBsYWNlKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXS9nLCBcIiQxXCIpLnRyaW0oKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWx1ZSA9IGZpbHRlcnNbaV0ucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMlwiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoalF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5kYXRhKCBjYXQgKSAhPT0gdW5kZWZpbmVkICYmIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiggalF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5kYXRhKCBjYXQgKS5pbmRleE9mKCB2YWx1ZSApICE9PSAtMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgLy9EZWZhdWx0IGZpbHRlcmluZ1xyXG4gICAgICAgICAgICAgICAgaWYoIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuaXMoIGZpbHRlcnNbaV0gKSApIHtcclxuICAgICAgICAgICAgICAgICAgICBhY3RpdmUucHVzaChmaWx0ZXJzW2ldKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZmlsdGVyTWV0aG9kO1xyXG4gICAgICAgIGlmKGZpbHRlcnMuaW5kZXhPZihcIipcIikgPT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goZmlsdGVycywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgICAgIGlmKCRzZWxmLmFsbEZpbHRlcnNbJHNlbGYuZ3VpZF1bZWxtXS5maWx0ZXJNZXRob2QgPT09IFwib3JcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlck1ldGhvZCA9IFwib3JcIjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyTWV0aG9kID0gXCJhbmRcIjtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoZmlsdGVyTWV0aG9kID09IFwib3JcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZS5sZW5ndGggPT0gZmlsdGVycy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59O1xyXG4iLCIvKipcclxuKiBfZ2V0Rm9yQ29udGFpbmVyQW5kSWQ6IEdldCBhbiBpZCBvciBmYWxsYmFjayB0byBhIHBhcmVudCBkaXZcclxuKiBAc2luY2UgMC4yLjJcclxuKiBAcGFyYW0ge29iamVjdH0gJGVsbVxyXG4qIEBwYXJhbSB7b2JqZWN0fSB0aW1lc3RhbXBcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkZWxtLCB0aW1lc3RhbXApIHtcclxuICAgIHZhciBmb3JFbGVtZW50LCBjb250YWluZXIsIGZvckNvbnRhaW5lcixcclxuICAgICAgICBpZENvbnRhaW5lciwgcGFyZW50Q29udGFpbmVyLCBpZEVsZW1lbnQ7XHJcblxyXG4gICAgLy8gQ2hlY2sgaWYgdGhpcyBjb250YWluZXIgaXMgYXNzaXNuZ2VkIHRvIGEgc3BlY2lmaWVkIGlzb3RvcGUgaW5zdGFuY2VcclxuICAgIGZvckNvbnRhaW5lciA9ICRlbG0uY2xvc2VzdCgnWycgKyB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyICsgJ10nKTtcclxuICAgIGlmKCBmb3JDb250YWluZXIubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgZm9yRWxlbWVudCA9IGZvckNvbnRhaW5lci5hdHRyKHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIpO1xyXG4gICAgICAgIGNvbnRhaW5lciA9IGZvckNvbnRhaW5lcjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy8gR2V0IHRoZSBjbG9zZXN0IGlkXHJcbiAgICBpZENvbnRhaW5lciA9ICRlbG0uY2xvc2VzdCgnW2lkXScpO1xyXG4gICAgaWYoIGlkQ29udGFpbmVyLmxlbmd0aCA+IDAgKSB7XHJcblxyXG4gICAgICAgIGlkRWxlbWVudCA9IGlkQ29udGFpbmVyLmF0dHIoJ2lkJyk7XHJcbiAgICAgICAgY29udGFpbmVyID0gKCFjb250YWluZXIpID8gaWRDb250YWluZXIgOiBjb250YWluZXI7IC8vSWYgY29udGFpbmVyIGhhcyBub3QgYmVlbiBkZWZpbmVkLCBkZWZpbmUgaXQuXHJcblxyXG4gICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgdmFyIGZvcm1hdHRlZCA9ICQoJGVsbS5wYXJlbnQoKSkudGV4dCgpLnRyaW0oKS5yZXBsYWNlKC9bXiFhLXpBLVowLTldL2csIFwiXCIpO1xyXG4gICAgICAgIGlkRWxlbWVudCA9IChmb3JtYXR0ZWQgPT09IFwiXCIpID8gdGltZXN0YW1wIDogZm9ybWF0dGVkIDtcclxuICAgICAgICBjb250YWluZXIgPSAoIWNvbnRhaW5lcikgPyAkZWxtLnBhcmVudCgpIDogY29udGFpbmVyOyAvL0lmIGNvbnRhaW5lciBoYXMgbm90IGJlZW4gZGVmaW5lZCwgZGVmaW5lIGl0LlxyXG5cclxuICAgIH1cclxuXHJcbiAgICB2YXIgZmlsdGVyQ29udGFpbmVyTXVsdGlwbGUgPSAkKGNvbnRhaW5lcikuYXR0cih0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyTXVsdGlwbGUpLFxyXG4gICAgICAgIGZpbHRlck11bHRpcGxlID0gKCBmaWx0ZXJDb250YWluZXJNdWx0aXBsZSAhPT0gbnVsbCAmJiBmaWx0ZXJDb250YWluZXJNdWx0aXBsZSAhPT0gdW5kZWZpbmVkICksXHJcbiAgICAgICAgZmlsdGVyTWV0aG9kID0gZmlsdGVyQ29udGFpbmVyTXVsdGlwbGUgfHwgXCJvclwiO1xyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgaXNGb3I6IGZvckVsZW1lbnQgfHwgdGhpcy5ndWlkLFxyXG4gICAgICAgIGlkOiBpZEVsZW1lbnQsXHJcbiAgICAgICAgZWxtOiAkKGNvbnRhaW5lciksXHJcbiAgICAgICAgZmlsdGVyTXVsdGlwbGU6IGZpbHRlck11bHRpcGxlLFxyXG4gICAgICAgIGZpbHRlck1ldGhvZDogZmlsdGVyTWV0aG9kXHJcbiAgICB9O1xyXG5cclxufTtcclxuIiwiLyoqXHJcbiogX2dldEluc3RhbmNlc1xyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9ICBmdW5jdGlvbigpIHtcclxuICAgIHZhciB0bXAgPSBbXTtcclxuXHJcbiAgICAkLmVhY2godGhpcy5pbnN0YW5jZXMsIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgdG1wLnB1c2goZWxtLmlzb3RvcGUpO1xyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuIHRtcDtcclxufTtcclxuIiwiLyoqXHJcbiAqIF9nZXRTb3J0RGF0YTogR2V0IHRoZSBkYXRhLXNvcnQtYnkgYXR0cmlidXRlcyBhbmQgbWFrZSB0aGVtIGludG8gYW4gSXNvdG9wZSBcImdldFNvcnREYXRhXCIgb2JqZWN0XHJcbiAqIEBzaW5jZSAwLjEuMFxyXG4gKi9cclxubW9kdWxlLmV4cG9ydHMgPSAgZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJHNvcnREYXRhID0ge30sXHJcbiAgICAgICAgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICRkYXRhU29ydEJ5U2VsZWN0b3IgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5U2VsZWN0b3IsXHJcbiAgICAgICAgJGRhdGFTb3J0QnlEZWZhdWx0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0O1xyXG5cclxuICAgICQoJ1snICsgJGRhdGFTb3J0QnkgKyAnXSwgWycgKyAkZGF0YVNvcnRCeVNlbGVjdG9yICsgJ10nKS5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICRuYW1lID0gJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSB8fCBudWxsLFxyXG4gICAgICAgICAgICAkc2VsZWN0b3IgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnlTZWxlY3RvcikgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgaWYoJG5hbWUgIT0gJGRhdGFTb3J0QnlEZWZhdWx0KSB7XHJcbiAgICAgICAgICAgIGlmKCRuYW1lICE9PSBudWxsICYmICRzZWxlY3RvciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgJHNvcnREYXRhWyRuYW1lXSA9ICRzZWxlY3RvcjtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIGFsZXJ0KFwiSXNvdG9wZSBzb3J0aW5nOiBcIiskZGF0YVNvcnRCeStcIiBhbmQgXCIrJGRhdGFTb3J0QnlTZWxlY3RvcitcIiBhcmUgcmVxdWlyZWQuIEN1cnJlbnRseSBjb25maWd1cmVkIFwiKyRkYXRhU29ydEJ5K1wiPSdcIiArICRuYW1lICsgXCInIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiPSdcIiArICRzZWxlY3RvciArIFwiJ1wiKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxuICAgIHJldHVybiAkc29ydERhdGE7XHJcbn07XHJcbiIsIi8qKlxyXG4qIF9zZXRDb250YWluZXJzOiBTZXQgdGhlIGZpbHRlcnMvc29ydGVycy9jbGVhciBjb250YWluZXJzIHRvIHRoZSByaWdodCBJc290b3BlIGNvbnRhaW5lclxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qIEB1cGRhdGVkIDAuMi4yXHJcbiogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuICAgIHZhciAkc2VsZiA9IHRoaXMsXHJcbiAgICAgICAgc2ggPSAkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0sXHJcbiAgICAgICAgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XHJcblxyXG4gICAgJCgnW2RhdGEtZmlsdGVyXTpmaXJzdC1jaGlsZCcpLmVhY2goZWFjaEl0ZW0uYmluZCh7IGRhdGFUeXBlOiAnZGF0YS1maWx0ZXInIH0pKTtcclxuICAgICQoJ1tkYXRhLXNvcnQtYnldOmZpcnN0LWNoaWxkJykuZWFjaChlYWNoSXRlbS5iaW5kKHsgZGF0YVR5cGU6ICdkYXRhLXNvcnQtYnknIH0pKTtcclxuICAgICQoJ1tkYXRhLWNsZWFyLWZpbHRlcl0nKS5lYWNoKGVhY2hJdGVtLmJpbmQoeyBkYXRhVHlwZTogJ2RhdGEtY2xlYXItZmlsdGVyJyB9KSk7XHJcbiAgICAkKCdbZGF0YS1mZWVkYmFja10nKS5lYWNoKGVhY2hJdGVtLmJpbmQoeyBkYXRhVHlwZTogJ2RhdGEtZmVlZGJhY2snIH0pKTtcclxuXHJcbiAgICBmdW5jdGlvbiBlYWNoSXRlbShpbmQsIGVsbSkge1xyXG4gICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICBkYXRhVHlwZSA9IHRoaXMuZGF0YVR5cGUsXHJcbiAgICAgICAgICAgIGZpbHRlckNvbnRhaW5lciA9ICRzZWxmLnV0aWxzLl9nZXRGb3JDb250YWluZXJBbmRJZC5jYWxsKCRzZWxmLCAkZWxtLCB0aW1lc3RhbXApO1xyXG5cclxuICAgICAgICBpZiggJHNlbGYuZ3VpZCA9PT0gZmlsdGVyQ29udGFpbmVyLmlzRm9yIHx8IGZpbHRlckNvbnRhaW5lci5pc0ZvciA9PT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtZmlsdGVyXCIgKSB7XHJcbiAgICAgICAgICAgICAgICBzaC5maWx0ZXJDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9IGZpbHRlckNvbnRhaW5lcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCBkYXRhVHlwZSA9PT0gXCJkYXRhLXNvcnQtYnlcIiApIHtcclxuICAgICAgICAgICAgICAgIHNoLnNvcnRDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9IGZpbHRlckNvbnRhaW5lcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCBkYXRhVHlwZSA9PT0gXCJkYXRhLWNsZWFyLWZpbHRlclwiICkge1xyXG4gICAgICAgICAgICAgICAgc2guY2xlYXJDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9IGZpbHRlckNvbnRhaW5lcjtcclxuICAgICAgICAgICAgfSBlbHNlIGlmKCBkYXRhVHlwZSA9PT0gXCJkYXRhLWZlZWRiYWNrXCIgKSB7XHJcbiAgICAgICAgICAgICAgICBzaC5mZWVkYmFja0NvbnRhaW5lcltmaWx0ZXJDb250YWluZXIuaWRdID0gZmlsdGVyQ29udGFpbmVyO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZiggZGF0YVR5cGUgPT09IFwiZGF0YS1maWx0ZXJcIiB8fCBkYXRhVHlwZSA9PT0gXCJkYXRhLXNvcnQtYnlcIiApIHtcclxuICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSBmaWx0ZXJDb250YWluZXIuZWxtLmZpbmQoJ1snK2RhdGFUeXBlKyddJyk7XHJcblxyXG4gICAgICAgICAgICBmaWx0ZXJzLmVhY2goZnVuY3Rpb24oaW5kZXgsIGZpbHRlcikge1xyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYuZ3VpZCA9PT0gZmlsdGVyQ29udGFpbmVyLmlzRm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoICQoZmlsdGVyKS5hdHRyKGRhdGFUeXBlKSAhPT0gXCIqXCIgKSB7IC8vVE9ETzogaG93IHRvIGhhbmRsZSB3aWxkY2FyZD9cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtZmlsdGVyXCIgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5hbGxGaWx0ZXJzW2ZpbHRlckNvbnRhaW5lci5pc0Zvcl1bJChmaWx0ZXIpLmF0dHIoZGF0YVR5cGUpXSA9IHNoLmZpbHRlckNvbnRhaW5lcltmaWx0ZXJDb250YWluZXIuaWRdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtc29ydC1ieVwiICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuYWxsU29ydGVyc1tmaWx0ZXJDb250YWluZXIuaXNGb3JdWyQoZmlsdGVyKS5hdHRyKGRhdGFUeXBlKV0gPSBzaC5zb3J0Q29udGFpbmVyW2ZpbHRlckNvbnRhaW5lci5pZF07XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufTtcclxuIl19
