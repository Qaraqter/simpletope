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
                        filter: $defaultFilter,
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

},{"./clear/__check.js":1,"./clear/_check.js":2,"./clear/_createClearers.js":3,"./constructor/jquery.js":4,"./constructor/prototype.js":5,"./filter/_check.js":6,"./filter/_createFilters.js":7,"./hash/_formatHash.js":8,"./hash/_getHash.js":9,"./hash/_onHashChanged.js":10,"./hash/_setHash.js":11,"./sorter/_check.js":13,"./sorter/_createSorters.js":14,"./text/_feedback.js":15,"./utils/_getElementFromDataAttribute.js":16,"./utils/_getFilterTest.js":17,"./utils/_getForContainerAndId.js":18,"./utils/_getInstances.js":19,"./utils/_getSortData.js":20,"./utils/_setContainers.js":21}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
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

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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
        for: forElement || this.guid,
        id: idElement,
        elm: $(container),
        filterMultiple: filterMultiple,
        filterMethod: filterMethod
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

},{}],21:[function(require,module,exports){
/**
* _setContainers: Set the filters/sorters/clear containers to the right Isotope container
* @since 0.1.0
* @updated 0.3.3
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

        if( $self.guid === filterContainer.for || filterContainer.for === false) {
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
                if($self.guid === filterContainer.for) {
                    if( $(filter).attr(dataType) !== "*" ) { //TODO: how to handle wildcard?
                        if( dataType === "data-filter" ) {
                            $self.allFilters[filterContainer.for][$(filter).attr(dataType)] = sh.filterContainer[filterContainer.id];
                        } else if( dataType === "data-sort-by" ) {
                            $self.allSorters[filterContainer.for][$(filter).attr(dataType)] = sh.sortContainer[filterContainer.id];
                        }
                    }
                }
            });
        }
    }
};

},{}]},{},[12])(12)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic291cmNlL2NsZWFyL19fY2hlY2suanMiLCJzb3VyY2UvY2xlYXIvX2NoZWNrLmpzIiwic291cmNlL2NsZWFyL19jcmVhdGVDbGVhcmVycy5qcyIsInNvdXJjZS9jb25zdHJ1Y3Rvci9qcXVlcnkuanMiLCJzb3VyY2UvY29uc3RydWN0b3IvcHJvdG90eXBlLmpzIiwic291cmNlL2ZpbHRlci9fY2hlY2suanMiLCJzb3VyY2UvZmlsdGVyL19jcmVhdGVGaWx0ZXJzLmpzIiwic291cmNlL2hhc2gvX2Zvcm1hdEhhc2guanMiLCJzb3VyY2UvaGFzaC9fZ2V0SGFzaC5qcyIsInNvdXJjZS9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzIiwic291cmNlL2hhc2gvX3NldEhhc2guanMiLCJzb3VyY2Uvc2ltcGxldG9wZS5hbWQuanMiLCJzb3VyY2Uvc29ydGVyL19jaGVjay5qcyIsInNvdXJjZS9zb3J0ZXIvX2NyZWF0ZVNvcnRlcnMuanMiLCJzb3VyY2UvdGV4dC9fZmVlZGJhY2suanMiLCJzb3VyY2UvdXRpbHMvX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZS5qcyIsInNvdXJjZS91dGlscy9fZ2V0RmlsdGVyVGVzdC5qcyIsInNvdXJjZS91dGlscy9fZ2V0Rm9yQ29udGFpbmVyQW5kSWQuanMiLCJzb3VyY2UvdXRpbHMvX2dldEluc3RhbmNlcy5qcyIsInNvdXJjZS91dGlscy9fZ2V0U29ydERhdGEuanMiLCJzb3VyY2UvdXRpbHMvX3NldENvbnRhaW5lcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiogX2NoZWNrOiBDaGVjayBpZiB3ZSBuZWVkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBjbGVhciBkaXYgd2l0aG91dCBhbiBpbnN0YW5jZVxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fb25Jc290b3BlQ2hhbmdlLmNhbGwodGhpcywgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSk7XHJcbn07XHJcbiIsIi8qKlxyXG4qIF9jaGVjazogQ2hlY2sgaWYgd2UgbmVlZCB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgY2xlYXIgZGl2LlxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlKSB7XHJcblxyXG4gICAgdmFyICRjbGVhckZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5jbGVhckZpbHRlcixcclxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAgICAgJGRlZmF1bHRGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmZpbHRlcixcclxuICAgICAgICAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmUsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5jbGVhckNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmVsbS5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgJGhpc3RvcnkgPSAkaW5zdGFuY2UuaXNvdG9wZS5zb3J0SGlzdG9yeTtcclxuXHJcbiAgICAgICAgICAgIGlmKCRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuZmlsdGVyICE9ICRkZWZhdWx0RmlsdGVyIHx8ICRoaXN0b3J5WyRoaXN0b3J5Lmxlbmd0aCAtIDFdICE9ICRkZWZhdWx0U29ydCkge1xyXG4gICAgICAgICAgICAgICAgJGVsbS5yZW1vdmVDbGFzcyhcImhpZGVcIikuc2hvdygpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGVsbS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJGNsZWFyRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkZGVmYXVsdEZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuZmlsdGVyLFxyXG4gICAgICAgICRpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQuZWFjaCgkaW5zdGFuY2UuY2xlYXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRjbGVhcmVycyA9IGNvbnRhaW5lci5lbG07XHJcblxyXG4gICAgICAgICRjbGVhcmVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG5cclxuICAgICAgICAgICAgJGVsbS5oaWRlKCkucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkc2VsZi51c2VIYXNoID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuaGFzaC5fc2V0SGFzaC5jYWxsKCRzZWxmLCAkaW5zdGFuY2UuaXNvdG9wZSwgJGRlZmF1bHRGaWx0ZXIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW5zdGFuY2UuaXNvdG9wZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAkZGVmYXVsdEZpbHRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gc29ydEJ5OiAkZGVmYXVsdFNvcnRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRlbG0uaGlkZSgpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyICRhcmdzID0gYXJndW1lbnRzWzBdIHx8IHt9LFxuICAgICAgICBpbnN0YW5jZXMgPSBbXTtcblxuICAgIGlmKHR5cGVvZiB3aW5kb3cuSXNvdG9wZSAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYWxlcnQoXCJzaW1wbGVJc290b3BlOiBJc290b3BlLkpTIGNvdWxkbid0IGJlIGZvdW5kLiBQbGVhc2UgaW5jbHVkZSAnaXNvdG9wZS5qcycuXCIpXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkLmVhY2godGhpcywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogJChlbG0pLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBpdGVtU2VsZWN0b3I6ICcuaXRlbScsXG4gICAgICAgICAgICAgICAgZGF0YVNlbGVjdG9yczoge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICdkYXRhLWZpbHRlcicsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRhLWZpbHRlci10eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyTWV0aG9kOiAnZGF0YS1maWx0ZXItbWV0aG9kJywvL0RlcHJhY2F0ZWRcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyTXVsdGlwbGU6ICdkYXRhLWZpbHRlci1tdWx0aXBsZScsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJ2RhdGEtc29ydC1ieScsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeVNlbGVjdG9yOiAnZGF0YS1zb3J0LXNlbGVjdG9yJyxcbiAgICAgICAgICAgICAgICAgICAgc29ydERpcmVjdGlvbjogJ2RhdGEtc29ydC1kaXJlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBmb3JDb250YWluZXI6ICdkYXRhLWlzb3RvcGUtY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJGaWx0ZXI6ICdkYXRhLWNsZWFyLWZpbHRlcicsXG4gICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrOiAnZGF0YS1mZWVkYmFjaydcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IFwib3JpZ2luYWwtb3JkZXJcIixcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiAnYWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKG5ldyAkLnNpbXBsZUlzb3RvcGUoJC5leHRlbmQob2JqLCAkYXJncykpKTtcbiAgICB9KTtcblxuICAgICQuZWFjaChpbnN0YW5jZXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgICAgIGVsbS5zb3J0ZXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0uZmlsdGVyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLmNsZWFyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLnRleHQuX2ZlZWRiYWNrLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLmNsZWFyLl9fY2hlY2suY2FsbChlbG0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlcztcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGFyZ3Mpe1xuICAgICQuZXh0ZW5kKHRoaXMsICRhcmdzKTtcblxuICAgIHZhciAkc2VsZiA9IHRoaXMsXG4gICAgICAgIHRoZUhhc2ggPSB0aGlzLmhhc2guX2dldEhhc2guY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuX2dldEZpbHRlclRlc3RPcmdpbmFsID0gSXNvdG9wZS5wcm90b3R5cGUuX2dldEZpbHRlclRlc3Q7XG4gICAgSXNvdG9wZS5wcm90b3R5cGUuX2dldEZpbHRlclRlc3QgPSB0aGlzLnV0aWxzLl9nZXRGaWx0ZXJUZXN0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmd1aWQgPSB0aGlzLmNvbnRhaW5lci5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICB0aGlzLmVuY29kZVVSSSA9IGZhbHNlO1xuXG4gICAgdGhpcy5hbGxGaWx0ZXJzW3RoaXMuZ3VpZF0gPSB0aGlzLmFsbEZpbHRlcnNbdGhpcy5ndWlkXSB8fCB7fTtcbiAgICB0aGlzLmFsbFNvcnRlcnNbdGhpcy5ndWlkXSA9IHRoaXMuYWxsU29ydGVyc1t0aGlzLmd1aWRdIHx8IHt9O1xuXG4gICAgLy9GaXJzdCB0aW1lIGluaXQgaXNvdG9wZVxuICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0gPSB7XG4gICAgICAgIGlzb3RvcGU6IGZhbHNlLFxuICAgICAgICBmaWx0ZXJDb250YWluZXI6IHt9LFxuICAgICAgICBzb3J0Q29udGFpbmVyOiB7fSxcbiAgICAgICAgY2xlYXJDb250YWluZXI6IHt9LFxuICAgICAgICBmZWVkYmFja0NvbnRhaW5lcjoge31cbiAgICB9O1xuXG4gICAgLy9HZXQgY29udGFpbmVycyBvZiBmaWx0ZXJzXG4gICAgdGhpcy51dGlscy5fc2V0Q29udGFpbmVycy5jYWxsKHRoaXMsIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZSk7XG5cbiAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUgPSBuZXcgSXNvdG9wZSh0aGlzLmNvbnRhaW5lci5jb250ZXh0LCB7XG4gICAgICAgIGZpbHRlcjogdGhlSGFzaCB8fCBcIipcIixcbiAgICAgICAgaXRlbVNlbGVjdG9yOiAkc2VsZi5zZXR0aW5ncy5pdGVtU2VsZWN0b3IgfHwgJy5pdGVtJyxcbiAgICAgICAgbGF5b3V0TW9kZTogJHNlbGYuY29udGFpbmVyLmRhdGEoXCJsYXlvdXRcIikgfHwgXCJmaXRSb3dzXCIsXG4gICAgICAgIGdldFNvcnREYXRhOiAkc2VsZi51dGlscy5fZ2V0U29ydERhdGEuY2FsbCh0aGlzKVxuICAgIH0pO1xuXG4gICAgaWYodGhpcy5jb250YWluZXIuZGF0YShcImhhc2hcIikgIT09IG51bGwgJiYgdGhpcy5jb250YWluZXIuZGF0YShcImhhc2hcIikgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnVzZUhhc2ggPSB0cnVlO1xuICAgIH1cblxuICAgIGlmKHdpbmRvdy5pbWFnZXNMb2FkZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLmlzb3RvcGUubGF5b3V0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vQWRkIGhhc2ggc3VwcG9ydFxuICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIHRoaXMuaGFzaC5fb25IYXNoQ2hhbmdlZC5iaW5kKHRoaXMpKTtcblxuIH07XG4iLCIvKipcbiAqIF9jaGVja0FjdGl2ZTogQ2hlY2sgaWYgYnV0dG9ucyBuZWVkIGFuIGFjdGl2ZSBjbGFzc1xuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcblxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXG4gICAgICAgICRpbnN0YW5jZSA9ICRpbnN0YW5jZSB8fCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlO1xuXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuZmlsdGVyLnNwbGl0KFwiLFwiKSwgZnVuY3Rpb24oIGluZGV4LCBmaWx0ZXIgKSB7XG5cbiAgICAgICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKCBpZHgsIGNvbnRhaW5lciApIHtcbiAgICAgICAgICAgIHZhciBlbG0gPSBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFGaWx0ZXIrXCI9XFxcIlwiK2ZpbHRlcitcIlxcXCJdXCIpO1xuXG4gICAgICAgICAgICBpZihlbG0ucHJvcChcInRhZ05hbWVcIikgJiYgZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT09IFwib3B0aW9uXCIpIHtcblxuICAgICAgICAgICAgICAgIGVsbS5hdHRyKCdzZWxlY3RlZCcsJ3NlbGVjdGVkJyk7XG5cbiAgICAgICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgICAgICBpZihpbmRleCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAvL1JlbW92ZSBhbGwgYWN0aXZlIGNsYXNzZXMgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFGaWx0ZXIrXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgLy9BZGQgYWN0aXZlIGNsYXNzZXNcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gZWxtLmFkZENsYXNzKCRhY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgICAgICAgICBpZihhY3RpdmUubGVuZ3RoID4gMCAmJiBmaWx0ZXIgIT0gJGRlZmF1bHRGaWx0ZXIpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmVsbS5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIiskZGVmYXVsdEZpbHRlcitcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn07XG4iLCIvKipcclxuKiBfY3JlYXRlRmlsdGVyczogY3JlYXRlIGJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKiBAdXBkYXRlZCAwLjIuMVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRmaWx0ZXJzID0gY29udGFpbmVyLmVsbS5maW5kKCdbJyskZGF0YUZpbHRlcisnXScpO1xyXG5cclxuICAgICAgICAkZmlsdGVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyBcImNoYW5nZVwiIDogXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gJGVsbS5jbG9zZXN0KFwic2VsZWN0XCIpIDogJGVsbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGhvdy5lbGVtZW50Lm9uKGhvdy5ldmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBUT0RPOiBEbyBub3QgcmV0dXJuIGZhbHNlIGJlZm9yZSBzZXR0aW5nIGlzb3RvcGUgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgaWYoaG93LmV2ZW50TmFtZSA9PSBcImNoYW5nZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaG93LmVsZW1lbnQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0gIT0gZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRkYXRhRmlsdGVyQXR0ciA9ICRlbG0uYXR0cigkZGF0YUZpbHRlciksXHJcbiAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGRhdGFGaWx0ZXJBdHRyLFxyXG4gICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMgPSAkZGF0YUZpbHRlckF0dHIsXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlRmlsdGVycywgY3VycmVudEZpbHRlcnM7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZmlsdGVyVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIC8vIEdldCBjdXJyZW50IGFjdGl2ZSBmaWx0ZXJzIGZyb20gaXNvdG9wZSBpbnN0YW5jZVxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZUZpbHRlcnMgPSAkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlcjtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgLy8gQ2hlY2sgaWYgY2xpY2tlZCBmaWx0ZXIncyB2YWx1ZSBpcyBub3QgYSB3aWxkY2FyZFxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGFjdGl2ZUZpbHRlcnMgIT09IFwiKlwiICYmICRmaWx0ZXJWYWx1ZSAhPT0gXCIqXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlRmlsdGVycyA9IGFjdGl2ZUZpbHRlcnMuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL0xvb3AgdGhyb3VnaCBhbGwgYWN0aXZlIGZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgJC5lYWNoKGFjdGl2ZUZpbHRlcnMsIGZ1bmN0aW9uKGluZGV4LCBlbGVtZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgc2V0dGluZyA9ICRzZWxmLmFsbEZpbHRlcnNbJHNlbGYuZ3VpZF1bZWxlbWVudF07XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiB0aGlzIGNvbnRhaW5lciBhbGxvd3MgbXVsdGlwbGUgZmlsdGVyc1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoc2V0dGluZy5maWx0ZXJNdWx0aXBsZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMucHVzaChlbGVtZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0NvbnRhaW5lciBvbmx5IGFsbG93cyBvbmUgZmlsdGVyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Bhc3Mgb24gZmlsdGVycyB0aGF0IGFyZSBub3QgaW4gc2FtZSBjb250YWluZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihjb250YWluZXIuZWxtICE9PSBzZXR0aW5nLmVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzLnB1c2goZWxlbWVudCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ2hlY2sgaWYgdGhpcyBjb250YWluZXIgYWxsb3dzIG11bHRpcGxlIGZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoY29udGFpbmVyLmZpbHRlck11bHRpcGxlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9DaGVjayBpZiBmaWx0ZXIgaXMgYWxyZWFkeSBkZWZpbmVkLCBpZiBzbyB0b2dnbGUgaXRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBuZXdGaWx0ZXJzLmluZGV4T2YoJGZpbHRlclZhbHVlKSA9PT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbmV3RmlsdGVycy5wdXNoKCRmaWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMuc3BsaWNlKG5ld0ZpbHRlcnMuaW5kZXhPZigkZmlsdGVyVmFsdWUpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vQ29udGFpbmVyIG9ubHkgYWxsb3dzIG9uZSBmaWx0ZXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL1Bhc3Mgb24gdGhlIGNsaWNrZWQgdmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMucHVzaCgkZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWx0ZXJzID0gbmV3RmlsdGVycy5qb2luKFwiLFwiKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAvL0lmIGZpbHRlcnMgaXMgZW1wdHkgdGhlbiByZXNldCBpdCBhbGxcclxuICAgICAgICAgICAgICAgICAgICBpZihuZXdGaWx0ZXJzID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG5ld0ZpbHRlcnMgPSBcIipcIjtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IG5ld0ZpbHRlcnNcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLCIvKipcbiogX2Zvcm1hdEhhc2g6IEZvcm1hdCBtdWx0aXBsZSBmaWx0ZXJzIGludG8gb25lIHN0cmluZyBiYXNlZCBvbiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuKiBAc2luY2UgMC4xLjBcbiogQHBhcmFtIHtyZWdleH0gcmVcbiogQHBhcmFtIHtzdHJpbmd9IHN0clxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmUsIHN0cikge1xuICAgIHZhciBtYXRjaGVzID0ge30sXG4gICAgICAgIG1hdGNoO1xuXG4gICAgd2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMoc3RyKSkgIT09IG51bGwpIHtcbiAgICAgICAgaWYgKG1hdGNoLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWF0Y2hbM10gIT09IG51bGwgJiYgbWF0Y2hbM10gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzNdXSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYobWF0Y2hlc1ttYXRjaFsxXV0gPT09IG51bGwgfHwgbWF0Y2hlc1ttYXRjaFsxXV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2hbMV1dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXS5wdXNoKG1hdGNoWzJdKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlcztcbn07XG4iLCIvKipcbiAqIF9nZXRIYXNoOiBHZXQgd2luZG93LmxvY2F0aW9uLmhhc2ggYW5kIGZvcm1hdCBpdCBmb3IgSXNvdG9wZVxuICogQHNpbmNlIDAuMS4wXG4gKi9cblxuIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyICRoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2ggfHwgZmFsc2UsXG4gICAgICAgICRuZXdIYXNoID0gXCJcIjtcblxuICAgICRoYXNoID0gKCRoYXNoICE9PSBmYWxzZSAmJiAkaGFzaCAhPT0gXCIjXCIgJiYgJGhhc2ggIT09IFwiXCIpID8gZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSA6ICcqJztcblxuICAgIC8vUmVtb3ZlIGhhc2ggZnJvbSBmaXJzdCBjaGFyYWN0ZXIgaWYgaXRzIGV4aXN0XG4gICAgaWYgKCRoYXNoLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgICAkaGFzaCA9ICRoYXNoLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIHZhciBoYXNoQXJyYXkgPSAkaGFzaC5zcGxpdChcIiZcIik7XG4gICAgJC5lYWNoKGhhc2hBcnJheSwgZnVuY3Rpb24oa2V5LCAkcGFydEhhc2gpIHtcblxuICAgICAgICBpZigkcGFydEhhc2guaW5kZXhPZihcIj1cIikgIT09IC0xKSB7XG5cbiAgICAgICAgICAgIHZhciB0bXAgPSAkcGFydEhhc2guc3BsaXQoXCI9XCIpLFxuICAgICAgICAgICAgICAgIGFyciA9IFtdLCB2YWx1ZXMsIG5hbWU7XG5cbiAgICAgICAgICAgIGlmKHRtcC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgbmFtZSA9IHRtcFswXTtcbiAgICAgICAgICAgICAgICB2YWx1ZXMgPSB0bXBbMV0ucmVwbGFjZSgvXFwnL2csIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJG5ld0hhc2ggKz0gYXJyLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbmV3SGFzaCArPSAoJHBhcnRIYXNoID09IFwiKlwiIHx8ICRwYXJ0SGFzaC5jaGFyQXQoMCkgPT0gJy4nKSA/ICRwYXJ0SGFzaDogXCIuXCIgKyAkcGFydEhhc2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZihrZXkgIT0gKGhhc2hBcnJheS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgJG5ld0hhc2ggKz0gXCIsXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgIHJldHVybiAkbmV3SGFzaDtcblxuIH07XG4iLCIvKipcclxuKiBfb25IYXNoQ2hhbmdlOiBmaXJlcyB3aGVuIGxvY2F0aW9uLmhhc2ggaGFzIGJlZW4gY2hhbmdlZFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fc2V0SXNvdG9wZS5jYWxsKHRoaXMsIHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpKTtcclxufTtcclxuIiwiLyoqXG4gKiBfc2V0SGFzaDogU2V0IGEgbmV3IGxvY2F0aW9uLmhhc2ggYWZ0ZXIgZm9ybWF0dGluZyBpdFxuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gJG5ld0hhc2hcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSwgJG5ld0hhc2gpIHtcbiAgICB2YXIgJGN1cnJlbnRIYXNoID0gKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlciA9PSBcIipcIikgPyBcIlwiIDogJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyLFxuICAgICAgICAkY29tYmluZWRIYXNoLFxuICAgICAgICAkZW5kSGFzaCA9IFtdO1xuXG4gICAgaWYoJG5ld0hhc2ggIT0gXCIqXCIpIHtcblxuICAgICAgICBpZigkY3VycmVudEhhc2guaW5kZXhPZigkbmV3SGFzaCkgPT09IC0xKSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoICsgJG5ld0hhc2g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoLnJlcGxhY2UoJG5ld0hhc2gsIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRmb3JtYXR0ZWRIYXNoID0gdGhpcy5oYXNoLl9mb3JtYXRIYXNoKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXXwoLltBLVphLXowLTldKykvZywgJGNvbWJpbmVkSGFzaCk7XG5cbiAgICAgICAgJC5lYWNoKCRmb3JtYXR0ZWRIYXNoLCBmdW5jdGlvbihrZXksIGVsbSkge1xuICAgICAgICAgICAgaWYoZWxtID09PSB0cnVlKSB7Ly9pc0NsYXNzXG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaCggKGtleS5jaGFyQXQoMCkgPT0gJy4nKSA/IGtleS5zbGljZSgxKSA6IGtleSApO1xuICAgICAgICAgICAgfSBlbHNlIHsvL2lzT2JqZWN0XG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaChrZXkgKyBcIj1cIiArIGVsbS5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRlbmRIYXNoID0gJGVuZEhhc2guam9pbihcIiZcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGVuZEhhc2ggPSAkbmV3SGFzaDtcbiAgICB9XG5cbiAgICBpZigkZW5kSGFzaCA9PT0gXCIqXCIgfHwgJGVuZEhhc2ggPT09IFwiXCIpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gKHRoaXMuZW5jb2RlVVJJID09PSB0cnVlKSA/IGVuY29kZVVSSUNvbXBvbmVudCgkZW5kSGFzaCkgOiAkZW5kSGFzaDtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVuZEhhc2g7XG59O1xuIiwidmFyICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5cclxuJC5zaW1wbGVJc290b3BlID0gcmVxdWlyZShcIi4vY29uc3RydWN0b3IvcHJvdG90eXBlLmpzXCIpO1xyXG5cclxuJC5zaW1wbGVJc290b3BlLnByb3RvdHlwZSA9IHtcclxuICAgIGluc3RhbmNlczoge30sXHJcbiAgICBhbGxGaWx0ZXJzOiB7fSxcclxuICAgIGFsbFNvcnRlcnM6IHt9LFxyXG5cclxuICAgIGNvbnN0cnVjdG9yOiAkLnNpbXBsZUlzb3RvcGUsXHJcblxyXG4gICAgaGFzaDoge1xyXG4gICAgICAgIF9nZXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19nZXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9zZXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19zZXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9mb3JtYXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19mb3JtYXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9vbkhhc2hDaGFuZ2VkOiByZXF1aXJlKFwiLi9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL2ZpbHRlci9fY3JlYXRlRmlsdGVycy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL2ZpbHRlci9fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICBzb3J0ZXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vc29ydGVyL19jcmVhdGVTb3J0ZXJzLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vc29ydGVyL19jaGVjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIGNsZWFyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL2NsZWFyL19jcmVhdGVDbGVhcmVycy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19jaGVjay5qc1wiKSxcclxuICAgICAgICBfX2NoZWNrOiByZXF1aXJlKFwiLi9jbGVhci9fX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgdGV4dDoge1xyXG4gICAgICAgIF9mZWVkYmFjazogcmVxdWlyZShcIi4vdGV4dC9fZmVlZGJhY2suanNcIilcclxuICAgIH0sXHJcbiAgICB1dGlsczoge1xyXG4gICAgICAgIF9zZXRDb250YWluZXJzOiByZXF1aXJlKFwiLi91dGlscy9fc2V0Q29udGFpbmVycy5qc1wiKSxcclxuICAgICAgICBfZ2V0Rm9yQ29udGFpbmVyQW5kSWQ6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRGb3JDb250YWluZXJBbmRJZC5qc1wiKSxcclxuICAgICAgICBfZ2V0U29ydERhdGE6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRTb3J0RGF0YS5qc1wiKSxcclxuICAgICAgICBfZ2V0RWxlbWVudEZyb21EYXRhQXR0cmlidXRlOiByZXF1aXJlKFwiLi91dGlscy9fZ2V0RWxlbWVudEZyb21EYXRhQXR0cmlidXRlLmpzXCIpLFxyXG4gICAgICAgIF9nZXRGaWx0ZXJUZXN0OiByZXF1aXJlKFwiLi91dGlscy9fZ2V0RmlsdGVyVGVzdC5qc1wiKSxcclxuICAgICAgICBfZ2V0SW5zdGFuY2VzOiByZXF1aXJlKFwiLi91dGlscy9fZ2V0SW5zdGFuY2VzLmpzXCIpXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfb25CZWZvcmVJc290b3BlQ2hhbmdlOiBmaXJlcyBiZWZvcmUgdGhlIElzb3RvcGUgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWRcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuICAgICovXHJcbiAgICBfb25CZWZvcmVJc290b3BlQ2hhbmdlOiBmdW5jdGlvbigkaW5zdGFuY2UpIHt9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfb25Jc290b3BlQ2hhbmdlOiBmaXJlcyB3aGVuIHRoZSBJc290b3BlIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiAgICAqL1xyXG4gICAgX29uSXNvdG9wZUNoYW5nZTogZnVuY3Rpb24oJGluc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy5maWx0ZXIuX2NoZWNrLmNhbGwodGhpcywgJGluc3RhbmNlKTtcclxuICAgICAgICB0aGlzLnNvcnRlci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZS5pc290b3BlKTtcclxuICAgICAgICB0aGlzLnRleHQuX2ZlZWRiYWNrLmNhbGwodGhpcywgJGluc3RhbmNlLmlzb3RvcGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX3NldElzb3RvcGU6IFJlY29uZmlndXJlIGlzb3RvcGVcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkc2VsZWN0b3JcclxuICAgICovXHJcbiAgICBfc2V0SXNvdG9wZTogZnVuY3Rpb24oJHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICBmaWx0ZXI6ICRzZWxlY3RvclxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UodGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSk7XHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuJC5mbi5zaW1wbGVJc290b3BlID0gcmVxdWlyZShcIi4vY29uc3RydWN0b3IvanF1ZXJ5LmpzXCIpO1xyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkLmVhY2goJChcIltkYXRhLWlzb3RvcGVdXCIpLCBmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgICQoZWxtKS5zaW1wbGVJc290b3BlKCk7XHJcbiAgICB9KTtcclxufSk7XHJcblxyXG4vLyBBZGQgYmluZCBzdXBwb3J0XHJcbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcclxuICBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKG9UaGlzKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgLy8gY2xvc2VzdCB0aGluZyBwb3NzaWJsZSB0byB0aGUgRUNNQVNjcmlwdCA1XHJcbiAgICAgIC8vIGludGVybmFsIElzQ2FsbGFibGUgZnVuY3Rpb25cclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgLSB3aGF0IGlzIHRyeWluZyB0byBiZSBib3VuZCBpcyBub3QgY2FsbGFibGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYUFyZ3MgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXHJcbiAgICAgICAgZlRvQmluZCA9IHRoaXMsXHJcbiAgICAgICAgZk5PUCAgICA9IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgZkJvdW5kICA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICByZXR1cm4gZlRvQmluZC5hcHBseSh0aGlzIGluc3RhbmNlb2YgZk5PUCAmJiBvVGhpcyA/IHRoaXMgOiBvVGhpcywgYUFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIGZOT1AucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XHJcbiAgICBmQm91bmQucHJvdG90eXBlID0gbmV3IGZOT1AoKTtcclxuXHJcbiAgICByZXR1cm4gZkJvdW5kO1xyXG4gIH07XHJcbn1cclxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUudHJpbSkge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG4gICAgfTtcclxufVxyXG4iLCIvKipcbiAqIF9jaGVja0FjdGl2ZTogQ2hlY2sgaWYgYnV0dG9ucyBuZWVkIGFuIGFjdGl2ZSBjbGFzc1xuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcblxuICAgIHZhciAkZGF0YVNvcnQgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXG4gICAgICAgICRpbnN0YW5jZSA9ICRpbnN0YW5jZSB8fCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlLFxuICAgICAgICAkc29ydEhpc3RvcnkgPSAkaW5zdGFuY2UuaXNvdG9wZS5zb3J0SGlzdG9yeSxcbiAgICAgICAgJHNvcnRBc2NlbmRpbmcgPSAkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLnNvcnRBc2NlbmRpbmc7XG5cbiAgICAkLmVhY2goJGluc3RhbmNlLnNvcnRDb250YWluZXIsIGZ1bmN0aW9uKCBpZHgsIGNvbnRhaW5lciApIHtcbiAgICAgICAgdmFyIGVsbSA9IGNvbnRhaW5lci5lbG0uZmluZChcIltcIiskZGF0YVNvcnQrXCJdXCIpLFxuICAgICAgICAgICAgc29ydERpcmVjdGlvbiA9IFwiZGVzY1wiO1xuXG4gICAgICAgIGlmKCRzb3J0QXNjZW5kaW5nKSB7XG4gICAgICAgICAgICBzb3J0RGlyZWN0aW9uID0gXCJhc2NcIjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGVsbS5wcm9wKFwidGFnTmFtZVwiKSAmJiBlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PT0gXCJvcHRpb25cIikge1xuXG4gICAgICAgICAgICAvLyBlbG0ucHJvcCgnc2VsZWN0ZWQnLCBmYWxzZSk7XG4gICAgICAgICAgICAvLyB2YXIgYWN0aXZlID0gY29udGFpbmVyLmVsbS5maW5kKCdbJyskZGF0YVNvcnQrJz1cIicrICRzb3J0SGlzdG9yeVswXSArJ1wiXVtkYXRhLXNvcnQtZGlyZWN0aW9uPVwiJyArIHNvcnREaXJlY3Rpb24gKyAnXCJdJykucHJvcCgnc2VsZWN0ZWQnLCAnc2VsZWN0ZWQnKTtcbiAgICAgICAgICAgIC8vXG4gICAgICAgICAgICAvLyBjb25zb2xlLmxvZyhhY3RpdmUpO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cblxuICAgICAgICAgICAgLy9SZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIGZpcnN0IHRpbWVcbiAgICAgICAgICAgIGVsbS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgICAgICAvL0FkZCBhY3RpdmUgY2xhc3Nlc1xuICAgICAgICAgICAgdmFyIGFjdGl2ZSA9IGNvbnRhaW5lci5lbG0uZmluZCgnWycrJGRhdGFTb3J0Kyc9XCInKyAkc29ydEhpc3RvcnlbMF0gKydcIl1bZGF0YS1zb3J0LWRpcmVjdGlvbj1cIicgKyBzb3J0RGlyZWN0aW9uICsgJ1wiXScpLmFkZENsYXNzKCRhY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgICAgIGlmKGFjdGl2ZS5sZW5ndGggPiAwICYmICRzb3J0SGlzdG9yeVswXSAhPSAkZGVmYXVsdFNvcnQpIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFTb3J0K1wiPVxcXCJcIiskZGVmYXVsdFNvcnQrXCJcXFwiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBjb250YWluZXIuZWxtLmZpbmQoXCJbXCIrJGRhdGFTb3J0K1wiPVxcXCJcIiskZGVmYXVsdFNvcnQrXCJcXFwiXVwiKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICB9KTtcblxufTtcbiIsIi8qKlxyXG4qIF9jcmVhdGVCdXR0b25zIGFuZCBhZGQgZXZlbnRzIHRvIGl0XHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkZGF0YVNvcnREaXJlY3Rpb24gPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydERpcmVjdGlvbixcclxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAgICAgJHNvcnRBcnJheSA9IFtdLFxyXG4gICAgICAgICRpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQuZWFjaCgkaW5zdGFuY2Uuc29ydENvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgICAgICB2YXIgJHNvcnRlcnMgPSBjb250YWluZXIuZWxtLmZpbmQoJ1snKyRkYXRhU29ydEJ5KyddJyk7XHJcblxyXG4gICAgICAgICRzb3J0ZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICAkZGF0YVNvcnRBdHRyID0gJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSxcclxuICAgICAgICAgICAgICAgIGhvdyA9IHtcclxuICAgICAgICAgICAgICAgICAgICBldmVudE5hbWU6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gXCJjaGFuZ2VcIiA6IFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgICAgICBlbGVtZW50OiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/ICRlbG0uY2xvc2VzdChcInNlbGVjdFwiKSA6ICRlbG1cclxuICAgICAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBob3cuZWxlbWVudC5vbihob3cuZXZlbnROYW1lLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoaG93LmV2ZW50TmFtZSA9PSBcImNoYW5nZVwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoaG93LmVsZW1lbnQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0gIT0gZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRzb3J0QnlWYWx1ZSA9ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgLy8gVE9ETzogSSdtIGdhbm5hIGxlYXZlIHRoaXMgY29kZSBoZXJlIGZvciBub3csIGlmIHdlIGV2ZXIgbmVlZCB0byBhZGQgbXVsdGlwbGUgc3VwcG9ydCBvbiBzb3J0ZXJzXHJcbiAgICAgICAgICAgICAgICAvLyBpZigkc2VsZi5maWx0ZXJNdWx0aXBsZSkge1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICAkc29ydEJ5VmFsdWUgPSBbXTtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgaWYoJGRhdGFTb3J0QXR0ciA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICRzb3J0QXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgIGlmKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSA9PT0gLTEpIHsvL2l0ZW0gbm90IGZpbHRlcmVkXHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgJHNvcnRBcnJheS5wdXNoKCRkYXRhU29ydEF0dHIpO1xyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfSBlbHNlIHsvL2l0ZW0gYWxyZWFkeSBmaWx0ZXJlZFxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIGlmKCRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuc29ydEFzY2VuZGluZyAhPT0gKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pLnRvTG93ZXJDYXNlKCkgPT09IFwiYXNjXCIpKSB7Ly9BcmUgd2UgY2hhbmdpbmcgZGVzYyBvciBhc2M/XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICAgICAgLy9EbyBub3RoaW5nLCBhcnJheSB3aWxsIGJlIHRoZSBzYW1lLCB3ZSdyZSBvbmx5IGNoYW5pZ25nIHNvcnQgZGlyZWN0aW9uXHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAgICAgICAgICRzb3J0QXJyYXkuc3BsaWNlKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSwgMSk7IC8vc2FtZSBpdGVtIGZpbHRlcmVkLCByZW1vdmUgdGhpcyBpdGVtIGZyb20gYXJyYXlcclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIC8vICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgLy9cclxuICAgICAgICAgICAgICAgIC8vICAgICB9XHJcbiAgICAgICAgICAgICAgICAvL1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIGlmKCRzb3J0QXJyYXkubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAvLyAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkZWZhdWx0U29ydDtcclxuICAgICAgICAgICAgICAgIC8vICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICAgICAkc29ydEJ5VmFsdWUgPSAkc29ydEFycmF5O1xyXG4gICAgICAgICAgICAgICAgLy8gICAgIH1cclxuICAgICAgICAgICAgICAgIC8vXHJcbiAgICAgICAgICAgICAgICAvLyB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgLy8gICAgICRzb3J0QnlWYWx1ZSA9ICRkYXRhU29ydEF0dHI7XHJcbiAgICAgICAgICAgICAgICAvLyB9XHJcblxyXG4gICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRhdGFTb3J0QXR0cjtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKSAhPT0gbnVsbCAmJiAkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikudG9Mb3dlckNhc2UoKSA9PT0gXCJhc2NcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnRCeSkgPT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRBc2MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJHNvcnRCeVZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRBc2NlbmRpbmc6ICRzb3J0QXNjXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLmZlZWRiYWNrQ29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHZhciAkZmVlZGJhY2sgPSBjb250YWluZXIuZWxtO1xyXG5cclxuICAgICAgICAkZmVlZGJhY2suZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKTtcclxuICAgICAgICAgICAgJGVsbS50ZXh0KCRlbG0uYXR0cihcImRhdGEtZmVlZGJhY2tcIikucmVwbGFjZShcIntkZWx0YX1cIiwgJGluc3RhbmNlLmlzb3RvcGUuZmlsdGVyZWRJdGVtcy5sZW5ndGgpKTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG4iLCIvKipcclxuKiBfZ2V0RWxlbWVudEZyb21EYXRhQXR0cmlidXRlXHJcbiogQHNpbmNlIDAuMS4wXHJcbiogQHVwZGF0ZSAwLjIuMVxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICB2YXIgJHRtcDtcclxuXHJcbiAgICBpZihzZWxlY3RvciA9PT0gXCJcIiB8fCBzZWxlY3RvciA9PT0gZmFsc2UgfHwgc2VsZWN0b3IgPT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH1cclxuXHJcbiAgICBpZihzZWxlY3RvciBpbnN0YW5jZW9mIGpRdWVyeSkge1xyXG4gICAgICAgIHJldHVybiBzZWxlY3RvcjtcclxuICAgIH1cclxuXHJcbiAgICBpZihzZWxlY3Rvci5jaGFyQXQoMCkgPT09IFwiI1wiIHx8IHNlbGVjdG9yLmNoYXJBdCgwKSA9PT0gXCIuXCIpIHtcdFx0XHRcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgfSBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoXCIjXCIpICE9PSAtMSB8fCBzZWxlY3Rvci5pbmRleE9mKFwiLlwiKSAhPT0gLTEpIHtcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgfSBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoXCIgXCIpICE9PSAtMSkge1x0XHRcdFx0XHRcdFx0XHRcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgfSBlbHNlIHtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9ldnVsYXRlIHRoZSBzdHJpbmcgYXMgYW4gaWRcclxuICAgICAgICAkdG1wID0gJChcIiNcIiArIHNlbGVjdG9yKTtcclxuICAgIH1cclxuXHJcbiAgICBpZigkdG1wLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgIC8vIHRocm93IG5ldyBFcnJvcihcInNpbXBsZXRvcGU6IFdlIGNhbm5vdCBmaW5kIGFueSBET00gZWxlbWVudCB3aXRoIHRoZSBDU1Mgc2VsZWN0b3I6ICdcIiArIHNlbGVjdG9yICsgXCInXCIpO1xyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgIH0gZWxzZSB7XHJcbiAgICAgICAgcmV0dXJuICR0bXA7XHJcbiAgICB9XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZmlsdGVyKSB7XHJcbiAgICB2YXIgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgIHJldHVybiBmdW5jdGlvbiggaXRlbSApIHtcclxuXHJcbiAgICAgICAgdmFyIGZpbHRlcnMgPSBmaWx0ZXIuc3BsaXQoXCIsXCIpLFxyXG4gICAgICAgICAgICBhY3RpdmUgPSBbXSxcclxuICAgICAgICAgICAgY29udGFpbmVyID0gW107XHJcblxyXG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAvL0VuYWJsZSBmaWx0ZXJpbmcgd2l0aCBkYXRhLWF0dHJpYnV0ZXNcclxuICAgICAgICAgICAgaWYoZmlsdGVyc1tpXS5pbmRleE9mKFwiZGF0YS1cIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNhdCA9IGZpbHRlcnNbaV0ucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMVwiKS50cmltKCksXHJcbiAgICAgICAgICAgICAgICAgICAgdmFsdWUgPSBmaWx0ZXJzW2ldLnJlcGxhY2UoL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csIFwiJDJcIikudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkgIT09IHVuZGVmaW5lZCAmJiBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkuaW5kZXhPZiggdmFsdWUgKSAhPT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vRGVmYXVsdCBmaWx0ZXJpbmdcclxuICAgICAgICAgICAgICAgIGlmKCBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmlzKCBmaWx0ZXJzW2ldICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2goZmlsdGVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGZpbHRlck1ldGhvZDtcclxuICAgICAgICBpZihmaWx0ZXJzLmluZGV4T2YoXCIqXCIpID09PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKGZpbHRlcnMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgICAgICBpZigkc2VsZi5hbGxGaWx0ZXJzWyRzZWxmLmd1aWRdW2VsbV0uZmlsdGVyTWV0aG9kID09PSBcIm9yXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBmaWx0ZXJNZXRob2QgPSBcIm9yXCI7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlck1ldGhvZCA9IFwiYW5kXCI7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKGZpbHRlck1ldGhvZCA9PSBcIm9yXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZS5sZW5ndGggPiAwO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHJldHVybiBhY3RpdmUubGVuZ3RoID09IGZpbHRlcnMubGVuZ3RoO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9O1xyXG5cclxufTtcclxuIiwiLyoqXHJcbiogX2dldEZvckNvbnRhaW5lckFuZElkOiBHZXQgYW4gaWQgb3IgZmFsbGJhY2sgdG8gYSBwYXJlbnQgZGl2XHJcbiogQHNpbmNlIDAuMi4yXHJcbiogQHBhcmFtIHtvYmplY3R9ICRlbG1cclxuKiBAcGFyYW0ge29iamVjdH0gdGltZXN0YW1wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGVsbSwgdGltZXN0YW1wKSB7XHJcbiAgICB2YXIgZm9yRWxlbWVudCwgY29udGFpbmVyLCBmb3JDb250YWluZXIsXHJcbiAgICAgICAgaWRDb250YWluZXIsIHBhcmVudENvbnRhaW5lciwgaWRFbGVtZW50O1xyXG5cclxuICAgIC8vIENoZWNrIGlmIHRoaXMgY29udGFpbmVyIGlzIGFzc2lzbmdlZCB0byBhIHNwZWNpZmllZCBpc290b3BlIGluc3RhbmNlXHJcbiAgICBmb3JDb250YWluZXIgPSAkZWxtLmNsb3Nlc3QoJ1snICsgdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZvckNvbnRhaW5lciArICddJyk7XHJcbiAgICBpZiggZm9yQ29udGFpbmVyLmxlbmd0aCA+IDAgKSB7XHJcblxyXG4gICAgICAgIGZvckVsZW1lbnQgPSBmb3JDb250YWluZXIuYXR0cih0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyKTtcclxuICAgICAgICBjb250YWluZXIgPSBmb3JDb250YWluZXI7XHJcblxyXG4gICAgfVxyXG5cclxuICAgIC8vIEdldCB0aGUgY2xvc2VzdCBpZFxyXG4gICAgaWRDb250YWluZXIgPSAkZWxtLmNsb3Nlc3QoJ1tpZF0nKTtcclxuICAgIGlmKCBpZENvbnRhaW5lci5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICBpZEVsZW1lbnQgPSBpZENvbnRhaW5lci5hdHRyKCdpZCcpO1xyXG4gICAgICAgIGNvbnRhaW5lciA9ICghY29udGFpbmVyKSA/IGlkQ29udGFpbmVyIDogY29udGFpbmVyOyAvL0lmIGNvbnRhaW5lciBoYXMgbm90IGJlZW4gZGVmaW5lZCwgZGVmaW5lIGl0LlxyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHZhciBmb3JtYXR0ZWQgPSAkKCRlbG0ucGFyZW50KCkpLnRleHQoKS50cmltKCkucmVwbGFjZSgvW14hYS16QS1aMC05XS9nLCBcIlwiKTtcclxuICAgICAgICBpZEVsZW1lbnQgPSAoZm9ybWF0dGVkID09PSBcIlwiKSA/IHRpbWVzdGFtcCA6IGZvcm1hdHRlZCA7XHJcbiAgICAgICAgY29udGFpbmVyID0gKCFjb250YWluZXIpID8gJGVsbS5wYXJlbnQoKSA6IGNvbnRhaW5lcjsgLy9JZiBjb250YWluZXIgaGFzIG5vdCBiZWVuIGRlZmluZWQsIGRlZmluZSBpdC5cclxuXHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGZpbHRlckNvbnRhaW5lck11bHRpcGxlID0gJChjb250YWluZXIpLmF0dHIodGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlck11bHRpcGxlKSxcclxuICAgICAgICBmaWx0ZXJNdWx0aXBsZSA9ICggZmlsdGVyQ29udGFpbmVyTXVsdGlwbGUgIT09IG51bGwgJiYgZmlsdGVyQ29udGFpbmVyTXVsdGlwbGUgIT09IHVuZGVmaW5lZCApLFxyXG4gICAgICAgIGZpbHRlck1ldGhvZCA9IGZpbHRlckNvbnRhaW5lck11bHRpcGxlIHx8IFwib3JcIjtcclxuXHJcbiAgICByZXR1cm4ge1xyXG4gICAgICAgIGZvcjogZm9yRWxlbWVudCB8fCB0aGlzLmd1aWQsXHJcbiAgICAgICAgaWQ6IGlkRWxlbWVudCxcclxuICAgICAgICBlbG06ICQoY29udGFpbmVyKSxcclxuICAgICAgICBmaWx0ZXJNdWx0aXBsZTogZmlsdGVyTXVsdGlwbGUsXHJcbiAgICAgICAgZmlsdGVyTWV0aG9kOiBmaWx0ZXJNZXRob2RcclxuICAgIH07XHJcblxyXG59O1xyXG4iLCIvKipcclxuKiBfZ2V0SW5zdGFuY2VzXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRtcCA9IFtdO1xyXG5cclxuICAgICQuZWFjaCh0aGlzLmluc3RhbmNlcywgZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICB0bXAucHVzaChlbG0uaXNvdG9wZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdG1wO1xyXG59O1xyXG4iLCIvKipcclxuICogX2dldFNvcnREYXRhOiBHZXQgdGhlIGRhdGEtc29ydC1ieSBhdHRyaWJ1dGVzIGFuZCBtYWtlIHRoZW0gaW50byBhbiBJc290b3BlIFwiZ2V0U29ydERhdGFcIiBvYmplY3RcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9ICBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkc29ydERhdGEgPSB7fSxcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGRhdGFTb3J0QnlTZWxlY3RvciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnlTZWxlY3RvcixcclxuICAgICAgICAkZGF0YVNvcnRCeURlZmF1bHQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQ7XHJcblxyXG4gICAgJCgnWycgKyAkZGF0YVNvcnRCeSArICddLCBbJyArICRkYXRhU29ydEJ5U2VsZWN0b3IgKyAnXScpLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgJG5hbWUgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpIHx8IG51bGwsXHJcbiAgICAgICAgICAgICRzZWxlY3RvciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeVNlbGVjdG9yKSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZigkbmFtZSAhPSAkZGF0YVNvcnRCeURlZmF1bHQpIHtcclxuICAgICAgICAgICAgaWYoJG5hbWUgIT09IG51bGwgJiYgJHNlbGVjdG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAkc29ydERhdGFbJG5hbWVdID0gJHNlbGVjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJJc290b3BlIHNvcnRpbmc6IFwiKyRkYXRhU29ydEJ5K1wiIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiIGFyZSByZXF1aXJlZC4gQ3VycmVudGx5IGNvbmZpZ3VyZWQgXCIrJGRhdGFTb3J0QnkrXCI9J1wiICsgJG5hbWUgKyBcIicgYW5kIFwiKyRkYXRhU29ydEJ5U2VsZWN0b3IrXCI9J1wiICsgJHNlbGVjdG9yICsgXCInXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuICRzb3J0RGF0YTtcclxufTtcclxuIiwiLyoqXG4qIF9zZXRDb250YWluZXJzOiBTZXQgdGhlIGZpbHRlcnMvc29ydGVycy9jbGVhciBjb250YWluZXJzIHRvIHRoZSByaWdodCBJc290b3BlIGNvbnRhaW5lclxuKiBAc2luY2UgMC4xLjBcbiogQHVwZGF0ZWQgMC4zLjNcbiogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcbiAgICB2YXIgJHNlbGYgPSB0aGlzLFxuICAgICAgICBzaCA9ICRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXSxcbiAgICAgICAgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAkKCdbZGF0YS1maWx0ZXJdOmZpcnN0LWNoaWxkJykuZWFjaChlYWNoSXRlbS5iaW5kKHsgZGF0YVR5cGU6ICdkYXRhLWZpbHRlcicgfSkpO1xuICAgICQoJ1tkYXRhLXNvcnQtYnldOmZpcnN0LWNoaWxkJykuZWFjaChlYWNoSXRlbS5iaW5kKHsgZGF0YVR5cGU6ICdkYXRhLXNvcnQtYnknIH0pKTtcbiAgICAkKCdbZGF0YS1jbGVhci1maWx0ZXJdJykuZWFjaChlYWNoSXRlbS5iaW5kKHsgZGF0YVR5cGU6ICdkYXRhLWNsZWFyLWZpbHRlcicgfSkpO1xuICAgICQoJ1tkYXRhLWZlZWRiYWNrXScpLmVhY2goZWFjaEl0ZW0uYmluZCh7IGRhdGFUeXBlOiAnZGF0YS1mZWVkYmFjaycgfSkpO1xuXG4gICAgZnVuY3Rpb24gZWFjaEl0ZW0oaW5kLCBlbG0pIHtcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXG4gICAgICAgICAgICBkYXRhVHlwZSA9IHRoaXMuZGF0YVR5cGUsXG4gICAgICAgICAgICBmaWx0ZXJDb250YWluZXIgPSAkc2VsZi51dGlscy5fZ2V0Rm9yQ29udGFpbmVyQW5kSWQuY2FsbCgkc2VsZiwgJGVsbSwgdGltZXN0YW1wKTtcblxuICAgICAgICBpZiggJHNlbGYuZ3VpZCA9PT0gZmlsdGVyQ29udGFpbmVyLmZvciB8fCBmaWx0ZXJDb250YWluZXIuZm9yID09PSBmYWxzZSkge1xuICAgICAgICAgICAgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtZmlsdGVyXCIgKSB7XG4gICAgICAgICAgICAgICAgc2guZmlsdGVyQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lci5pZF0gPSBmaWx0ZXJDb250YWluZXI7XG4gICAgICAgICAgICB9IGVsc2UgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtc29ydC1ieVwiICkge1xuICAgICAgICAgICAgICAgIHNoLnNvcnRDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9IGZpbHRlckNvbnRhaW5lcjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiggZGF0YVR5cGUgPT09IFwiZGF0YS1jbGVhci1maWx0ZXJcIiApIHtcbiAgICAgICAgICAgICAgICBzaC5jbGVhckNvbnRhaW5lcltmaWx0ZXJDb250YWluZXIuaWRdID0gZmlsdGVyQ29udGFpbmVyO1xuICAgICAgICAgICAgfSBlbHNlIGlmKCBkYXRhVHlwZSA9PT0gXCJkYXRhLWZlZWRiYWNrXCIgKSB7XG4gICAgICAgICAgICAgICAgc2guZmVlZGJhY2tDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9IGZpbHRlckNvbnRhaW5lcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmKCBkYXRhVHlwZSA9PT0gXCJkYXRhLWZpbHRlclwiIHx8IGRhdGFUeXBlID09PSBcImRhdGEtc29ydC1ieVwiICkge1xuICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSBmaWx0ZXJDb250YWluZXIuZWxtLmZpbmQoJ1snK2RhdGFUeXBlKyddJyk7XG5cbiAgICAgICAgICAgIGZpbHRlcnMuZWFjaChmdW5jdGlvbihpbmRleCwgZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgaWYoJHNlbGYuZ3VpZCA9PT0gZmlsdGVyQ29udGFpbmVyLmZvcikge1xuICAgICAgICAgICAgICAgICAgICBpZiggJChmaWx0ZXIpLmF0dHIoZGF0YVR5cGUpICE9PSBcIipcIiApIHsgLy9UT0RPOiBob3cgdG8gaGFuZGxlIHdpbGRjYXJkP1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtZmlsdGVyXCIgKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuYWxsRmlsdGVyc1tmaWx0ZXJDb250YWluZXIuZm9yXVskKGZpbHRlcikuYXR0cihkYXRhVHlwZSldID0gc2guZmlsdGVyQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lci5pZF07XG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoIGRhdGFUeXBlID09PSBcImRhdGEtc29ydC1ieVwiICkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLmFsbFNvcnRlcnNbZmlsdGVyQ29udGFpbmVyLmZvcl1bJChmaWx0ZXIpLmF0dHIoZGF0YVR5cGUpXSA9IHNoLnNvcnRDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgfVxufTtcbiJdfQ==
