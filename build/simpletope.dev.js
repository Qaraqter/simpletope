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

        container.each(function(idx, elm) {
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
        var $clearers = container;

        $clearers.each(function(idx, elm) {
            var $elm = $(elm);

            $elm.hide().removeClass("hide").on('click', function(e) {
                e.preventDefault();

                if($self.useHash === true) {
                    $self.hash._setHash.call($self, $instance.isotope, $defaultFilter);
                } else {
                    $instance.isotope.arrange({
                        filter: $defaultFilter,
                        sortBy: $defaultSort
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
                    filterMethod: 'data-filter-method',
                    sortBy: 'data-sort-by',
                    sortBySelector: 'data-sort-selector',
                    sortDirection: 'data-sort-direction',
                    forContainer: 'data-for-container',
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

    this.filterMultiple = this.container.attr(this.settings.dataSelectors.type) || "";
    this.filterMultiple = (this.filterMultiple.toLowerCase() == "multiple");

    this.filterMethod = this.container.attr(this.settings.dataSelectors.filterMethod) || "";
    this.filterMethod = this.filterMethod.toLowerCase();

    this.encodeURI = false;

    //First time init isotope
    this.instances[this.guid] = {
        isotope: new Isotope(this.container.context, {
            filter: theHash || "*",
            itemSelector: $self.settings.itemSelector || '.item',
            layoutMode: $self.container.data("layout") || "fitRows",
            getSortData: $self.utils._getSortData.call(this)
        }),
        filterContainer: {},
        sortContainer: {},
        clearContainer: {},
        feedbackContainer: {}
    };

    this.utils._setContainers.call(this, this.instances[this.guid].isotope);

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
            var elm = container.find("["+$dataFilter+"=\""+filter+"\"]");

            if(elm.prop("tagName") && elm.prop("tagName").toLowerCase() === "option") {

                elm.attr('selected','selected');

            } else {

                if(index === 0) {
                    //Remove all active classes first time
                    container.find("["+$dataFilter+"]").removeClass($activeClass);
                }

                //Add active classes
                var active = elm.addClass($activeClass);

                if(active.length > 0 && filter != $defaultFilter) {
                    container.find("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
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
        var $filters = container.find('['+$dataFilter+']');

        $filters.each(function(idx, elm) {
            var $elm = $(elm),
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

                var $dataFilterAttr = $elm.attr($dataFilter),
                    $filterValue = $dataFilterAttr,
                    val = $dataFilterAttr;

                if($self.useHash === true) {

                    $self.hash._setHash.call($self, $instance.isotope, $filterValue);

                } else {

                    if($self.filterMultiple) {

                        if($instance.isotope.options.filter === "*" || $filterValue === "*") {
                            //Do nothing
                        } else if($instance.isotope.options.filter.indexOf($filterValue) === -1) {
                            $filterValue = $instance.isotope.options.filter.split(",");
                            $filterValue.push(val);
                            $filterValue = $filterValue.join(",");
                        } else {
                            $filterValue = $instance.isotope.options.filter.split(",");
                            $filterValue.splice($filterValue.indexOf(val), 1);
                            $filterValue = $filterValue.join(",");
                        }

                        if($filterValue === "") {
                            $filterValue = "*";
                        }
                    }

                    $instance.isotope.arrange({
                        filter: $filterValue
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
        $sortHistory = $instance.isotope.sortHistory;

    $.each($instance.sortContainer, function( idx, container ) {

        //Remove all active classes first time
        container.find("["+$dataSort+"]").removeClass($activeClass);

        //Add active classes
        var active = container.find("["+$dataSort+"=\""+ $sortHistory[0] +"\"]").addClass($activeClass);

        if(active.length > 0 && $sortHistory[0] != $defaultSort) {
            container.find("["+$dataSort+"=\""+$defaultSort+"\"]").removeClass($activeClass);
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
        var $sorters = container.find('['+$dataSortBy+']');

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

                var $sortByValue = '';
                if($self.filterMultiple !== false) {

                    $sortByValue = [];

                    if($dataSortAttr == $defaultSort) {
                        $sortArray = [];
                    } else {
                        if($sortArray.indexOf($dataSortAttr) === -1) {
                            $sortArray.push($dataSortAttr);
                        } else {
                            $sortArray.splice($sortArray.indexOf($dataSortAttr), 1);
                        }

                    }

                    if($sortArray.length === 0) {
                        $sortByValue = $defaultSort;
                    } else {
                        $sortByValue = $sortArray;
                    }

                } else {
                    $sortByValue = $dataSortAttr;
                }

                var $sortAsc = false;

                if($elm.attr($dataSortDirection) !== null && $elm.attr($dataSortDirection) !== undefined) {
                    if($elm.attr($dataSortDirection).toLowerCase() == "asc") {
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
        var $feedback = container;

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

};

},{}],18:[function(require,module,exports){
/**
* _getForContainerAndId: Get an id or fallback to a parent div
* @since 0.2.2
* @param {object} $elm
* @param {object} timestamp
*/
module.exports = function($elm, timestamp) {
    var forElement = false,
        container = false,
        forContainer, idContainer, parentContainer, idElement;

    //Check if this container is assisnged to a specified isotope instance
    forContainer = $elm.closest('[data-for-container]');
    if( forContainer.length > 0 ) {

        forElement = forContainer.attr('data-for-container');
        container = forContainer;

    }

    //Get the closest id
    idContainer = $elm.closest('[id]');
    if( idContainer.length > 0 ) {

        idElement = idContainer.attr('id');
        container = (!container) ? idContainer : container;//If container has not been defined, define it.

    } else {

        var formatted = $($elm.parent()).text().trim().replace(/[^!a-zA-Z0-9]/g, "");
        idElement = (formatted === "") ? timestamp : formatted ;
        container = (!container) ? $elm.parent() : container;//If container has not been defined, define it.
    }

    return {
        for: forElement,
        id: idElement,
        container: container
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
* @param {object} $instance
*/

module.exports = function($instance) {
    var $self = this,
        sh = $self.instances[$self.guid],
        timestamp = new Date().getTime();

    $.each($('[data-filter], [data-sort-by], [data-clear-filter], [data-feedback]'), function(ind, elm) {
        var $elm = $(elm),
            filterContainer = $self.utils._getForContainerAndId.call($self, $elm, timestamp);

        if( $self.guid === filterContainer.for || filterContainer.for === false) {
            if( $elm.attr('data-filter') !== undefined ) {
                sh.filterContainer[filterContainer.id] = $(filterContainer.container);
            } else if ( $elm.attr('data-sort-by') !== undefined ) {
                sh.sortContainer[filterContainer.id] = $(filterContainer.container);
            } else if ( $elm.attr('data-clear-filter') !== undefined ) {
                sh.clearContainer[filterContainer.id] = $(filterContainer.container);
            } else if ( $elm.attr('data-feedback') !== undefined ) {
                sh.feedbackContainer[filterContainer.id] = $(filterContainer.container);
            }
        }
    });
};

},{}]},{},[12])(12)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic291cmNlL2NsZWFyL19fY2hlY2suanMiLCJzb3VyY2UvY2xlYXIvX2NoZWNrLmpzIiwic291cmNlL2NsZWFyL19jcmVhdGVDbGVhcmVycy5qcyIsInNvdXJjZS9jb25zdHJ1Y3Rvci9qcXVlcnkuanMiLCJzb3VyY2UvY29uc3RydWN0b3IvcHJvdG90eXBlLmpzIiwic291cmNlL2ZpbHRlci9fY2hlY2suanMiLCJzb3VyY2UvZmlsdGVyL19jcmVhdGVGaWx0ZXJzLmpzIiwic291cmNlL2hhc2gvX2Zvcm1hdEhhc2guanMiLCJzb3VyY2UvaGFzaC9fZ2V0SGFzaC5qcyIsInNvdXJjZS9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzIiwic291cmNlL2hhc2gvX3NldEhhc2guanMiLCJzb3VyY2Uvc2ltcGxldG9wZS5hbWQuanMiLCJzb3VyY2Uvc29ydGVyL19jaGVjay5qcyIsInNvdXJjZS9zb3J0ZXIvX2NyZWF0ZVNvcnRlcnMuanMiLCJzb3VyY2UvdGV4dC9fZmVlZGJhY2suanMiLCJzb3VyY2UvdXRpbHMvX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZS5qcyIsInNvdXJjZS91dGlscy9fZ2V0RmlsdGVyVGVzdC5qcyIsInNvdXJjZS91dGlscy9fZ2V0Rm9yQ29udGFpbmVyQW5kSWQuanMiLCJzb3VyY2UvdXRpbHMvX2dldEluc3RhbmNlcy5qcyIsInNvdXJjZS91dGlscy9fZ2V0U29ydERhdGEuanMiLCJzb3VyY2UvdXRpbHMvX3NldENvbnRhaW5lcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeEVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDYkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiogX2NoZWNrOiBDaGVjayBpZiB3ZSBuZWVkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBjbGVhciBkaXYgd2l0aG91dCBhbiBpbnN0YW5jZVxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fb25Jc290b3BlQ2hhbmdlLmNhbGwodGhpcywgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSk7XHJcbn07XHJcbiIsIi8qKlxyXG4qIF9jaGVjazogQ2hlY2sgaWYgd2UgbmVlZCB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgY2xlYXIgZGl2LlxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlKSB7XHJcblxyXG4gICAgdmFyICRjbGVhckZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5jbGVhckZpbHRlcixcclxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAgICAgJGRlZmF1bHRGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmZpbHRlcixcclxuICAgICAgICAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmUsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5jbGVhckNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuXHJcbiAgICAgICAgY29udGFpbmVyLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICAkaGlzdG9yeSA9ICRpbnN0YW5jZS5pc290b3BlLnNvcnRIaXN0b3J5O1xyXG5cclxuICAgICAgICAgICAgaWYoJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIgIT0gJGRlZmF1bHRGaWx0ZXIgfHwgJGhpc3RvcnlbJGhpc3RvcnkubGVuZ3RoIC0gMV0gIT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAkZWxtLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5zaG93KCk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkY2xlYXJGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5jbGVhckNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgICAgICB2YXIgJGNsZWFyZXJzID0gY29udGFpbmVyO1xyXG5cclxuICAgICAgICAkY2xlYXJlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKTtcclxuXHJcbiAgICAgICAgICAgICRlbG0uaGlkZSgpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLmhhc2guX3NldEhhc2guY2FsbCgkc2VsZiwgJGluc3RhbmNlLmlzb3RvcGUsICRkZWZhdWx0RmlsdGVyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGluc3RhbmNlLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJGRlZmF1bHRGaWx0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJGRlZmF1bHRTb3J0XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciAkYXJncyA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgICAgaW5zdGFuY2VzID0gW107XG5cbiAgICBpZih0eXBlb2Ygd2luZG93Lklzb3RvcGUgIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGFsZXJ0KFwic2ltcGxlSXNvdG9wZTogSXNvdG9wZS5KUyBjb3VsZG4ndCBiZSBmb3VuZC4gUGxlYXNlIGluY2x1ZGUgJ2lzb3RvcGUuanMnLlwiKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJC5lYWNoKHRoaXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICBjb250YWluZXI6ICQoZWxtKSxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaXRlbVNlbGVjdG9yOiAnLml0ZW0nLFxuICAgICAgICAgICAgICAgIGRhdGFTZWxlY3RvcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAnZGF0YS1maWx0ZXInLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0YS1maWx0ZXItdHlwZScsXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlck1ldGhvZDogJ2RhdGEtZmlsdGVyLW1ldGhvZCcsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJ2RhdGEtc29ydC1ieScsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeVNlbGVjdG9yOiAnZGF0YS1zb3J0LXNlbGVjdG9yJyxcbiAgICAgICAgICAgICAgICAgICAgc29ydERpcmVjdGlvbjogJ2RhdGEtc29ydC1kaXJlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBmb3JDb250YWluZXI6ICdkYXRhLWZvci1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICAgICBjbGVhckZpbHRlcjogJ2RhdGEtY2xlYXItZmlsdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgZmVlZGJhY2s6ICdkYXRhLWZlZWRiYWNrJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgc29ydDogXCJvcmlnaW5hbC1vcmRlclwiLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6ICdhY3RpdmUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaW5zdGFuY2VzLnB1c2gobmV3ICQuc2ltcGxlSXNvdG9wZSgkLmV4dGVuZChvYmosICRhcmdzKSkpO1xuICAgIH0pO1xuXG4gICAgJC5lYWNoKGluc3RhbmNlcywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcbiAgICAgICAgZWxtLnNvcnRlci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS5maWx0ZXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0uY2xlYXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0udGV4dC5fZmVlZGJhY2suY2FsbChlbG0pO1xuICAgICAgICBlbG0uY2xlYXIuX19jaGVjay5jYWxsKGVsbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5zdGFuY2VzO1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkYXJncyl7XG4gICAgJC5leHRlbmQodGhpcywgJGFyZ3MpO1xuXG4gICAgdmFyICRzZWxmID0gdGhpcyxcbiAgICAgICAgdGhlSGFzaCA9IHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5fZ2V0RmlsdGVyVGVzdE9yZ2luYWwgPSBJc290b3BlLnByb3RvdHlwZS5fZ2V0RmlsdGVyVGVzdDtcbiAgICBJc290b3BlLnByb3RvdHlwZS5fZ2V0RmlsdGVyVGVzdCA9IHRoaXMudXRpbHMuX2dldEZpbHRlclRlc3QuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZ3VpZCA9IHRoaXMuY29udGFpbmVyLmF0dHIoXCJpZFwiKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIHRoaXMuZmlsdGVyTXVsdGlwbGUgPSB0aGlzLmNvbnRhaW5lci5hdHRyKHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy50eXBlKSB8fCBcIlwiO1xuICAgIHRoaXMuZmlsdGVyTXVsdGlwbGUgPSAodGhpcy5maWx0ZXJNdWx0aXBsZS50b0xvd2VyQ2FzZSgpID09IFwibXVsdGlwbGVcIik7XG5cbiAgICB0aGlzLmZpbHRlck1ldGhvZCA9IHRoaXMuY29udGFpbmVyLmF0dHIodGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlck1ldGhvZCkgfHwgXCJcIjtcbiAgICB0aGlzLmZpbHRlck1ldGhvZCA9IHRoaXMuZmlsdGVyTWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVuY29kZVVSSSA9IGZhbHNlO1xuXG4gICAgLy9GaXJzdCB0aW1lIGluaXQgaXNvdG9wZVxuICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0gPSB7XG4gICAgICAgIGlzb3RvcGU6IG5ldyBJc290b3BlKHRoaXMuY29udGFpbmVyLmNvbnRleHQsIHtcbiAgICAgICAgICAgIGZpbHRlcjogdGhlSGFzaCB8fCBcIipcIixcbiAgICAgICAgICAgIGl0ZW1TZWxlY3RvcjogJHNlbGYuc2V0dGluZ3MuaXRlbVNlbGVjdG9yIHx8ICcuaXRlbScsXG4gICAgICAgICAgICBsYXlvdXRNb2RlOiAkc2VsZi5jb250YWluZXIuZGF0YShcImxheW91dFwiKSB8fCBcImZpdFJvd3NcIixcbiAgICAgICAgICAgIGdldFNvcnREYXRhOiAkc2VsZi51dGlscy5fZ2V0U29ydERhdGEuY2FsbCh0aGlzKVxuICAgICAgICB9KSxcbiAgICAgICAgZmlsdGVyQ29udGFpbmVyOiB7fSxcbiAgICAgICAgc29ydENvbnRhaW5lcjoge30sXG4gICAgICAgIGNsZWFyQ29udGFpbmVyOiB7fSxcbiAgICAgICAgZmVlZGJhY2tDb250YWluZXI6IHt9XG4gICAgfTtcblxuICAgIHRoaXMudXRpbHMuX3NldENvbnRhaW5lcnMuY2FsbCh0aGlzLCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUpO1xuXG4gICAgaWYodGhpcy5jb250YWluZXIuZGF0YShcImhhc2hcIikgIT09IG51bGwgJiYgdGhpcy5jb250YWluZXIuZGF0YShcImhhc2hcIikgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnVzZUhhc2ggPSB0cnVlO1xuICAgIH1cblxuICAgIGlmKHdpbmRvdy5pbWFnZXNMb2FkZWQgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLmNvbnRhaW5lci5pbWFnZXNMb2FkZWQoIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLmlzb3RvcGUubGF5b3V0KCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIC8vQWRkIGhhc2ggc3VwcG9ydFxuICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIHRoaXMuaGFzaC5fb25IYXNoQ2hhbmdlZC5iaW5kKHRoaXMpKTtcblxuIH07XG4iLCIvKipcbiAqIF9jaGVja0FjdGl2ZTogQ2hlY2sgaWYgYnV0dG9ucyBuZWVkIGFuIGFjdGl2ZSBjbGFzc1xuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcblxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXG4gICAgICAgICRpbnN0YW5jZSA9ICRpbnN0YW5jZSB8fCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlO1xuXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuZmlsdGVyLnNwbGl0KFwiLFwiKSwgZnVuY3Rpb24oIGluZGV4LCBmaWx0ZXIgKSB7XG5cbiAgICAgICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKCBpZHgsIGNvbnRhaW5lciApIHtcbiAgICAgICAgICAgIHZhciBlbG0gPSBjb250YWluZXIuZmluZChcIltcIiskZGF0YUZpbHRlcitcIj1cXFwiXCIrZmlsdGVyK1wiXFxcIl1cIik7XG5cbiAgICAgICAgICAgIGlmKGVsbS5wcm9wKFwidGFnTmFtZVwiKSAmJiBlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PT0gXCJvcHRpb25cIikge1xuXG4gICAgICAgICAgICAgICAgZWxtLmF0dHIoJ3NlbGVjdGVkJywnc2VsZWN0ZWQnKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vUmVtb3ZlIGFsbCBhY3RpdmUgY2xhc3NlcyBmaXJzdCB0aW1lXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQWRkIGFjdGl2ZSBjbGFzc2VzXG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZSA9IGVsbS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgaWYoYWN0aXZlLmxlbmd0aCA+IDAgJiYgZmlsdGVyICE9ICRkZWZhdWx0RmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIiskZGVmYXVsdEZpbHRlcitcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn07XG4iLCIvKipcclxuKiBfY3JlYXRlRmlsdGVyczogY3JlYXRlIGJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKiBAdXBkYXRlZCAwLjIuMVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRmaWx0ZXJzID0gY29udGFpbmVyLmZpbmQoJ1snKyRkYXRhRmlsdGVyKyddJyk7XHJcblxyXG4gICAgICAgICRmaWx0ZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICBob3cgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/IFwiY2hhbmdlXCIgOiBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyAkZWxtLmNsb3Nlc3QoXCJzZWxlY3RcIikgOiAkZWxtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaG93LmVsZW1lbnQub24oaG93LmV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGhvdy5ldmVudE5hbWUgPT0gXCJjaGFuZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGhvdy5lbGVtZW50LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdICE9IGVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkZGF0YUZpbHRlckF0dHIgPSAkZWxtLmF0dHIoJGRhdGFGaWx0ZXIpLFxyXG4gICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRkYXRhRmlsdGVyQXR0cixcclxuICAgICAgICAgICAgICAgICAgICB2YWwgPSAkZGF0YUZpbHRlckF0dHI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZmlsdGVyVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRzZWxmLmZpbHRlck11bHRpcGxlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlciA9PT0gXCIqXCIgfHwgJGZpbHRlclZhbHVlID09PSBcIipcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9EbyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZigkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlci5pbmRleE9mKCRmaWx0ZXJWYWx1ZSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUucHVzaCh2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGZpbHRlclZhbHVlLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlLnNwbGljZSgkZmlsdGVyVmFsdWUuaW5kZXhPZih2YWwpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRmaWx0ZXJWYWx1ZS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJGZpbHRlclZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSBcIipcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGluc3RhbmNlLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJGZpbHRlclZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuIiwiLyoqXG4qIF9mb3JtYXRIYXNoOiBGb3JtYXQgbXVsdGlwbGUgZmlsdGVycyBpbnRvIG9uZSBzdHJpbmcgYmFzZWQgb24gYSByZWd1bGFyIGV4cHJlc3Npb25cbiogQHNpbmNlIDAuMS4wXG4qIEBwYXJhbSB7cmVnZXh9IHJlXG4qIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlLCBzdHIpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IHt9LFxuICAgICAgICBtYXRjaDtcblxuICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKHN0cikpICE9PSBudWxsKSB7XG4gICAgICAgIGlmIChtYXRjaC5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XG4gICAgICAgICAgICByZS5sYXN0SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG1hdGNoWzNdICE9PSBudWxsICYmIG1hdGNoWzNdICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFszXV0gPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmKG1hdGNoZXNbbWF0Y2hbMV1dID09PSBudWxsIHx8IG1hdGNoZXNbbWF0Y2hbMV1dID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFsxXV0ucHVzaChtYXRjaFsyXSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXM7XG59O1xuIiwiLyoqXG4gKiBfZ2V0SGFzaDogR2V0IHdpbmRvdy5sb2NhdGlvbi5oYXNoIGFuZCBmb3JtYXQgaXQgZm9yIElzb3RvcGVcbiAqIEBzaW5jZSAwLjEuMFxuICovXG5cbiBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGZhbHNlLFxuICAgICAgICAkbmV3SGFzaCA9IFwiXCI7XG5cbiAgICAkaGFzaCA9ICgkaGFzaCAhPT0gZmFsc2UgJiYgJGhhc2ggIT09IFwiI1wiICYmICRoYXNoICE9PSBcIlwiKSA/IGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaGFzaCkgOiAnKic7XG5cbiAgICAvL1JlbW92ZSBoYXNoIGZyb20gZmlyc3QgY2hhcmFjdGVyIGlmIGl0cyBleGlzdFxuICAgIGlmICgkaGFzaC5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgICAgJGhhc2ggPSAkaGFzaC5zbGljZSgxKTtcbiAgICB9XG5cbiAgICB2YXIgaGFzaEFycmF5ID0gJGhhc2guc3BsaXQoXCImXCIpO1xuICAgICQuZWFjaChoYXNoQXJyYXksIGZ1bmN0aW9uKGtleSwgJHBhcnRIYXNoKSB7XG5cbiAgICAgICAgaWYoJHBhcnRIYXNoLmluZGV4T2YoXCI9XCIpICE9PSAtMSkge1xuXG4gICAgICAgICAgICB2YXIgdG1wID0gJHBhcnRIYXNoLnNwbGl0KFwiPVwiKSxcbiAgICAgICAgICAgICAgICBhcnIgPSBbXSwgdmFsdWVzLCBuYW1lO1xuXG4gICAgICAgICAgICBpZih0bXAubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIG5hbWUgPSB0bXBbMF07XG4gICAgICAgICAgICAgICAgdmFsdWVzID0gdG1wWzFdLnJlcGxhY2UoL1xcJy9nLCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaChcIltkYXRhLVwiICsgbmFtZSArIFwiPSdcIiArIHZhbHVlc1tpXSArIFwiJ11cIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRuZXdIYXNoICs9IGFyci5qb2luKFwiLFwiKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJG5ld0hhc2ggKz0gKCRwYXJ0SGFzaCA9PSBcIipcIiB8fCAkcGFydEhhc2guY2hhckF0KDApID09ICcuJykgPyAkcGFydEhhc2g6IFwiLlwiICsgJHBhcnRIYXNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoa2V5ICE9IChoYXNoQXJyYXkubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICRuZXdIYXNoICs9IFwiLFwiO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgICByZXR1cm4gJG5ld0hhc2g7XG5cbiB9O1xuIiwiLyoqXHJcbiogX29uSGFzaENoYW5nZTogZmlyZXMgd2hlbiBsb2NhdGlvbi5oYXNoIGhhcyBiZWVuIGNoYW5nZWRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX3NldElzb3RvcGUuY2FsbCh0aGlzLCB0aGlzLmhhc2guX2dldEhhc2guY2FsbCh0aGlzKSk7XHJcbn07XHJcbiIsIi8qKlxuICogX3NldEhhc2g6IFNldCBhIG5ldyBsb2NhdGlvbi5oYXNoIGFmdGVyIGZvcm1hdHRpbmcgaXRcbiAqIEBzaW5jZSAwLjEuMFxuICogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxuICogQHBhcmFtIHtzdHJpbmd9ICRuZXdIYXNoXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UsICRuZXdIYXNoKSB7XG4gICAgdmFyICRjdXJyZW50SGFzaCA9ICgkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIgPT0gXCIqXCIpID8gXCJcIiA6ICRpbnN0YW5jZS5vcHRpb25zLmZpbHRlcixcbiAgICAgICAgJGNvbWJpbmVkSGFzaCxcbiAgICAgICAgJGVuZEhhc2ggPSBbXTtcblxuICAgIGlmKCRuZXdIYXNoICE9IFwiKlwiKSB7XG5cbiAgICAgICAgaWYoJGN1cnJlbnRIYXNoLmluZGV4T2YoJG5ld0hhc2gpID09PSAtMSkge1xuICAgICAgICAgICAgJGNvbWJpbmVkSGFzaCA9ICRjdXJyZW50SGFzaCArICRuZXdIYXNoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGNvbWJpbmVkSGFzaCA9ICRjdXJyZW50SGFzaC5yZXBsYWNlKCRuZXdIYXNoLCBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciAkZm9ybWF0dGVkSGFzaCA9IHRoaXMuaGFzaC5fZm9ybWF0SGFzaCgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF18KC5bQS1aYS16MC05XSspL2csICRjb21iaW5lZEhhc2gpO1xuXG4gICAgICAgICQuZWFjaCgkZm9ybWF0dGVkSGFzaCwgZnVuY3Rpb24oa2V5LCBlbG0pIHtcbiAgICAgICAgICAgIGlmKGVsbSA9PT0gdHJ1ZSkgey8vaXNDbGFzc1xuICAgICAgICAgICAgICAgICRlbmRIYXNoLnB1c2goIChrZXkuY2hhckF0KDApID09ICcuJykgPyBrZXkuc2xpY2UoMSkgOiBrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7Ly9pc09iamVjdFxuICAgICAgICAgICAgICAgICRlbmRIYXNoLnB1c2goa2V5ICsgXCI9XCIgKyBlbG0uam9pbihcIixcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkZW5kSGFzaCA9ICRlbmRIYXNoLmpvaW4oXCImXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRlbmRIYXNoID0gJG5ld0hhc2g7XG4gICAgfVxuXG4gICAgaWYoJGVuZEhhc2ggPT09IFwiKlwiIHx8ICRlbmRIYXNoID09PSBcIlwiKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICh0aGlzLmVuY29kZVVSSSA9PT0gdHJ1ZSkgPyBlbmNvZGVVUklDb21wb25lbnQoJGVuZEhhc2gpIDogJGVuZEhhc2g7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbmRIYXNoO1xufTtcbiIsInZhciAkID0gd2luZG93LmpRdWVyeTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZSA9IHJlcXVpcmUoXCIuL2NvbnN0cnVjdG9yL3Byb3RvdHlwZS5qc1wiKTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZS5wcm90b3R5cGUgPSB7XHJcbiAgICBpbnN0YW5jZXM6IHt9LFxyXG4gICAgY29uc3RydWN0b3I6ICQuc2ltcGxlSXNvdG9wZSxcclxuXHJcbiAgICBoYXNoOiB7XHJcbiAgICAgICAgX2dldEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX2dldEhhc2guanNcIiksXHJcbiAgICAgICAgX3NldEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX3NldEhhc2guanNcIiksXHJcbiAgICAgICAgX2Zvcm1hdEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX2Zvcm1hdEhhc2guanNcIiksXHJcbiAgICAgICAgX29uSGFzaENoYW5nZWQ6IHJlcXVpcmUoXCIuL2hhc2gvX29uSGFzaENoYW5nZWQuanNcIilcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vZmlsdGVyL19jcmVhdGVGaWx0ZXJzLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vZmlsdGVyL19jaGVjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIHNvcnRlcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9zb3J0ZXIvX2NyZWF0ZVNvcnRlcnMuanNcIiksXHJcbiAgICAgICAgX2NoZWNrOiByZXF1aXJlKFwiLi9zb3J0ZXIvX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgY2xlYXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vY2xlYXIvX2NyZWF0ZUNsZWFyZXJzLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vY2xlYXIvX2NoZWNrLmpzXCIpLFxyXG4gICAgICAgIF9fY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICB0ZXh0OiB7XHJcbiAgICAgICAgX2ZlZWRiYWNrOiByZXF1aXJlKFwiLi90ZXh0L19mZWVkYmFjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIHV0aWxzOiB7XHJcbiAgICAgICAgX3NldENvbnRhaW5lcnM6IHJlcXVpcmUoXCIuL3V0aWxzL19zZXRDb250YWluZXJzLmpzXCIpLFxyXG4gICAgICAgIF9nZXRGb3JDb250YWluZXJBbmRJZDogcmVxdWlyZShcIi4vdXRpbHMvX2dldEZvckNvbnRhaW5lckFuZElkLmpzXCIpLFxyXG4gICAgICAgIF9nZXRTb3J0RGF0YTogcmVxdWlyZShcIi4vdXRpbHMvX2dldFNvcnREYXRhLmpzXCIpLFxyXG4gICAgICAgIF9nZXRFbGVtZW50RnJvbURhdGFBdHRyaWJ1dGU6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRFbGVtZW50RnJvbURhdGFBdHRyaWJ1dGUuanNcIiksXHJcbiAgICAgICAgX2dldEZpbHRlclRlc3Q6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRGaWx0ZXJUZXN0LmpzXCIpLFxyXG4gICAgICAgIF9nZXRJbnN0YW5jZXM6IHJlcXVpcmUoXCIuL3V0aWxzL19nZXRJbnN0YW5jZXMuanNcIilcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9vbkJlZm9yZUlzb3RvcGVDaGFuZ2U6IGZpcmVzIGJlZm9yZSB0aGUgSXNvdG9wZSBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZFxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9vbkJlZm9yZUlzb3RvcGVDaGFuZ2U6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge30sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9vbklzb3RvcGVDaGFuZ2U6IGZpcmVzIHdoZW4gdGhlIElzb3RvcGUgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWRcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuICAgICovXHJcbiAgICBfb25Jc290b3BlQ2hhbmdlOiBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuICAgICAgICB0aGlzLmZpbHRlci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgIHRoaXMuc29ydGVyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXIuX2NoZWNrLmNhbGwodGhpcywgJGluc3RhbmNlLmlzb3RvcGUpO1xyXG4gICAgICAgIHRoaXMudGV4dC5fZmVlZGJhY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UuaXNvdG9wZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfc2V0SXNvdG9wZTogUmVjb25maWd1cmUgaXNvdG9wZVxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRzZWxlY3RvclxyXG4gICAgKi9cclxuICAgIF9zZXRJc290b3BlOiBmdW5jdGlvbigkc2VsZWN0b3IpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgIGZpbHRlcjogJHNlbGVjdG9yXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX29uSXNvdG9wZUNoYW5nZSh0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdKTtcclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4kLmZuLnNpbXBsZUlzb3RvcGUgPSByZXF1aXJlKFwiLi9jb25zdHJ1Y3Rvci9qcXVlcnkuanNcIik7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQuZWFjaCgkKFwiW2RhdGEtaXNvdG9wZV1cIiksIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgJChlbG0pLnNpbXBsZUlzb3RvcGUoKTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcbi8vIEFkZCBiaW5kIHN1cHBvcnRcclxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUuYmluZCkge1xyXG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ob1RoaXMpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAvLyBjbG9zZXN0IHRoaW5nIHBvc3NpYmxlIHRvIHRoZSBFQ01BU2NyaXB0IDVcclxuICAgICAgLy8gaW50ZXJuYWwgSXNDYWxsYWJsZSBmdW5jdGlvblxyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCAtIHdoYXQgaXMgdHJ5aW5nIHRvIGJlIGJvdW5kIGlzIG5vdCBjYWxsYWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBhQXJncyAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcclxuICAgICAgICBmVG9CaW5kID0gdGhpcyxcclxuICAgICAgICBmTk9QICAgID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICBmQm91bmQgID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmVG9CaW5kLmFwcGx5KHRoaXMgaW5zdGFuY2VvZiBmTk9QICYmIG9UaGlzID8gdGhpcyA6IG9UaGlzLCBhQXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgZk5PUC5wcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcclxuICAgIGZCb3VuZC5wcm90b3R5cGUgPSBuZXcgZk5PUCgpO1xyXG5cclxuICAgIHJldHVybiBmQm91bmQ7XHJcbiAgfTtcclxufVxyXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS50cmltKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICB9O1xyXG59XHJcbiIsIi8qKlxuICogX2NoZWNrQWN0aXZlOiBDaGVjayBpZiBidXR0b25zIG5lZWQgYW4gYWN0aXZlIGNsYXNzXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBwYXJhbSB7b2JqZWN0fSAkaW5zdGFuY2VcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xuXG4gICAgdmFyICRkYXRhU29ydCA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcbiAgICAgICAgJGluc3RhbmNlID0gJGluc3RhbmNlIHx8IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmUsXG4gICAgICAgICRzb3J0SGlzdG9yeSA9ICRpbnN0YW5jZS5pc290b3BlLnNvcnRIaXN0b3J5O1xuXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5zb3J0Q29udGFpbmVyLCBmdW5jdGlvbiggaWR4LCBjb250YWluZXIgKSB7XG5cbiAgICAgICAgLy9SZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIGZpcnN0IHRpbWVcbiAgICAgICAgY29udGFpbmVyLmZpbmQoXCJbXCIrJGRhdGFTb3J0K1wiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgIC8vQWRkIGFjdGl2ZSBjbGFzc2VzXG4gICAgICAgIHZhciBhY3RpdmUgPSBjb250YWluZXIuZmluZChcIltcIiskZGF0YVNvcnQrXCI9XFxcIlwiKyAkc29ydEhpc3RvcnlbMF0gK1wiXFxcIl1cIikuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcblxuICAgICAgICBpZihhY3RpdmUubGVuZ3RoID4gMCAmJiAkc29ydEhpc3RvcnlbMF0gIT0gJGRlZmF1bHRTb3J0KSB7XG4gICAgICAgICAgICBjb250YWluZXIuZmluZChcIltcIiskZGF0YVNvcnQrXCI9XFxcIlwiKyRkZWZhdWx0U29ydCtcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59O1xuIiwiLyoqXHJcbiogX2NyZWF0ZUJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICRkYXRhU29ydERpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkc29ydEFycmF5ID0gW10sXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5zb3J0Q29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHZhciAkc29ydGVycyA9IGNvbnRhaW5lci5maW5kKCdbJyskZGF0YVNvcnRCeSsnXScpO1xyXG5cclxuICAgICAgICAkc29ydGVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgJGRhdGFTb3J0QXR0ciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeSksXHJcbiAgICAgICAgICAgICAgICBob3cgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/IFwiY2hhbmdlXCIgOiBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyAkZWxtLmNsb3Nlc3QoXCJzZWxlY3RcIikgOiAkZWxtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaG93LmVsZW1lbnQub24oaG93LmV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGhvdy5ldmVudE5hbWUgPT0gXCJjaGFuZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGhvdy5lbGVtZW50LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdICE9IGVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkc29ydEJ5VmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmKCRzZWxmLmZpbHRlck11bHRpcGxlICE9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJGRhdGFTb3J0QXR0ciA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkucHVzaCgkZGF0YVNvcnRBdHRyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkuc3BsaWNlKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5Lmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSAkZGVmYXVsdFNvcnQ7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJHNvcnRBcnJheTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSAkZGF0YVNvcnRBdHRyO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkc29ydEFzYyA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pICE9PSBudWxsICYmICRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKS50b0xvd2VyQ2FzZSgpID09IFwiYXNjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRBc2MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnRCeSkgPT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRBc2MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJHNvcnRCeVZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRBc2NlbmRpbmc6ICRzb3J0QXNjXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG5cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLmZlZWRiYWNrQ29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHZhciAkZmVlZGJhY2sgPSBjb250YWluZXI7XHJcblxyXG4gICAgICAgICRmZWVkYmFjay5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG4gICAgICAgICAgICAkZWxtLnRleHQoJGVsbS5hdHRyKFwiZGF0YS1mZWVkYmFja1wiKS5yZXBsYWNlKFwie2RlbHRhfVwiLCAkaW5zdGFuY2UuaXNvdG9wZS5maWx0ZXJlZEl0ZW1zLmxlbmd0aCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiIsIi8qKlxyXG4qIF9nZXRFbGVtZW50RnJvbURhdGFBdHRyaWJ1dGVcclxuKiBAc2luY2UgMC4xLjBcclxuKiBAdXBkYXRlIDAuMi4xXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgIHZhciAkdG1wO1xyXG5cclxuICAgIGlmKHNlbGVjdG9yID09PSBcIlwiIHx8IHNlbGVjdG9yID09PSBmYWxzZSB8fCBzZWxlY3RvciA9PT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHNlbGVjdG9yIGluc3RhbmNlb2YgalF1ZXJ5KSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKHNlbGVjdG9yLmNoYXJBdCgwKSA9PT0gXCIjXCIgfHwgc2VsZWN0b3IuY2hhckF0KDApID09PSBcIi5cIikge1x0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICB9IGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZihcIiNcIikgIT09IC0xIHx8IHNlbGVjdG9yLmluZGV4T2YoXCIuXCIpICE9PSAtMSkge1x0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICB9IGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZihcIiBcIikgIT09IC0xKSB7XHRcdFx0XHRcdFx0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICB9IGVsc2Uge1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvL2V2dWxhdGUgdGhlIHN0cmluZyBhcyBhbiBpZFxyXG4gICAgICAgICR0bXAgPSAkKFwiI1wiICsgc2VsZWN0b3IpO1xyXG4gICAgfVxyXG5cclxuICAgIGlmKCR0bXAubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwic2ltcGxldG9wZTogV2UgY2Fubm90IGZpbmQgYW55IERPTSBlbGVtZW50IHdpdGggdGhlIENTUyBzZWxlY3RvcjogJ1wiICsgc2VsZWN0b3IgKyBcIidcIik7XHJcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgfSBlbHNlIHtcclxuICAgICAgICByZXR1cm4gJHRtcDtcclxuICAgIH1cclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihmaWx0ZXIpIHtcclxuICAgIHZhciAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgcmV0dXJuIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cclxuICAgICAgICB2YXIgZmlsdGVycyA9IGZpbHRlci5zcGxpdChcIixcIiksXHJcbiAgICAgICAgICAgIGFjdGl2ZSA9IFtdO1xyXG5cclxuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cclxuICAgICAgICAgICAgaWYoZmlsdGVyc1tpXS5pbmRleE9mKFwiZGF0YS1cIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIGNhdCA9IGZpbHRlcnNbaV0ucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMVwiKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBmaWx0ZXJzW2ldLnJlcGxhY2UoL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csIFwiJDJcIikudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkgIT09IHVuZGVmaW5lZCAmJiBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkuaW5kZXhPZiggdmFsdWUgKSAhPT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmlzKCBmaWx0ZXJzW2ldICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2goZmlsdGVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoJHNlbGYuZmlsdGVyTWV0aG9kID09IFwib3JcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZS5sZW5ndGggPT0gZmlsdGVycy5sZW5ndGg7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH07XHJcblxyXG59O1xyXG4iLCIvKipcclxuKiBfZ2V0Rm9yQ29udGFpbmVyQW5kSWQ6IEdldCBhbiBpZCBvciBmYWxsYmFjayB0byBhIHBhcmVudCBkaXZcclxuKiBAc2luY2UgMC4yLjJcclxuKiBAcGFyYW0ge29iamVjdH0gJGVsbVxyXG4qIEBwYXJhbSB7b2JqZWN0fSB0aW1lc3RhbXBcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkZWxtLCB0aW1lc3RhbXApIHtcclxuICAgIHZhciBmb3JFbGVtZW50ID0gZmFsc2UsXHJcbiAgICAgICAgY29udGFpbmVyID0gZmFsc2UsXHJcbiAgICAgICAgZm9yQ29udGFpbmVyLCBpZENvbnRhaW5lciwgcGFyZW50Q29udGFpbmVyLCBpZEVsZW1lbnQ7XHJcblxyXG4gICAgLy9DaGVjayBpZiB0aGlzIGNvbnRhaW5lciBpcyBhc3Npc25nZWQgdG8gYSBzcGVjaWZpZWQgaXNvdG9wZSBpbnN0YW5jZVxyXG4gICAgZm9yQ29udGFpbmVyID0gJGVsbS5jbG9zZXN0KCdbZGF0YS1mb3ItY29udGFpbmVyXScpO1xyXG4gICAgaWYoIGZvckNvbnRhaW5lci5sZW5ndGggPiAwICkge1xyXG5cclxuICAgICAgICBmb3JFbGVtZW50ID0gZm9yQ29udGFpbmVyLmF0dHIoJ2RhdGEtZm9yLWNvbnRhaW5lcicpO1xyXG4gICAgICAgIGNvbnRhaW5lciA9IGZvckNvbnRhaW5lcjtcclxuXHJcbiAgICB9XHJcblxyXG4gICAgLy9HZXQgdGhlIGNsb3Nlc3QgaWRcclxuICAgIGlkQ29udGFpbmVyID0gJGVsbS5jbG9zZXN0KCdbaWRdJyk7XHJcbiAgICBpZiggaWRDb250YWluZXIubGVuZ3RoID4gMCApIHtcclxuXHJcbiAgICAgICAgaWRFbGVtZW50ID0gaWRDb250YWluZXIuYXR0cignaWQnKTtcclxuICAgICAgICBjb250YWluZXIgPSAoIWNvbnRhaW5lcikgPyBpZENvbnRhaW5lciA6IGNvbnRhaW5lcjsvL0lmIGNvbnRhaW5lciBoYXMgbm90IGJlZW4gZGVmaW5lZCwgZGVmaW5lIGl0LlxyXG5cclxuICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgIHZhciBmb3JtYXR0ZWQgPSAkKCRlbG0ucGFyZW50KCkpLnRleHQoKS50cmltKCkucmVwbGFjZSgvW14hYS16QS1aMC05XS9nLCBcIlwiKTtcclxuICAgICAgICBpZEVsZW1lbnQgPSAoZm9ybWF0dGVkID09PSBcIlwiKSA/IHRpbWVzdGFtcCA6IGZvcm1hdHRlZCA7XHJcbiAgICAgICAgY29udGFpbmVyID0gKCFjb250YWluZXIpID8gJGVsbS5wYXJlbnQoKSA6IGNvbnRhaW5lcjsvL0lmIGNvbnRhaW5lciBoYXMgbm90IGJlZW4gZGVmaW5lZCwgZGVmaW5lIGl0LlxyXG4gICAgfVxyXG5cclxuICAgIHJldHVybiB7XHJcbiAgICAgICAgZm9yOiBmb3JFbGVtZW50LFxyXG4gICAgICAgIGlkOiBpZEVsZW1lbnQsXHJcbiAgICAgICAgY29udGFpbmVyOiBjb250YWluZXJcclxuICAgIH07XHJcblxyXG59O1xyXG4iLCIvKipcclxuKiBfZ2V0SW5zdGFuY2VzXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gIGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyIHRtcCA9IFtdO1xyXG5cclxuICAgICQuZWFjaCh0aGlzLmluc3RhbmNlcywgZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICB0bXAucHVzaChlbG0uaXNvdG9wZSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gdG1wO1xyXG59O1xyXG4iLCIvKipcclxuICogX2dldFNvcnREYXRhOiBHZXQgdGhlIGRhdGEtc29ydC1ieSBhdHRyaWJ1dGVzIGFuZCBtYWtlIHRoZW0gaW50byBhbiBJc290b3BlIFwiZ2V0U29ydERhdGFcIiBvYmplY3RcclxuICogQHNpbmNlIDAuMS4wXHJcbiAqL1xyXG5tb2R1bGUuZXhwb3J0cyA9ICBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkc29ydERhdGEgPSB7fSxcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGRhdGFTb3J0QnlTZWxlY3RvciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnlTZWxlY3RvcixcclxuICAgICAgICAkZGF0YVNvcnRCeURlZmF1bHQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQ7XHJcblxyXG4gICAgJCgnWycgKyAkZGF0YVNvcnRCeSArICddLCBbJyArICRkYXRhU29ydEJ5U2VsZWN0b3IgKyAnXScpLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgJG5hbWUgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpIHx8IG51bGwsXHJcbiAgICAgICAgICAgICRzZWxlY3RvciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeVNlbGVjdG9yKSB8fCBudWxsO1xyXG5cclxuICAgICAgICBpZigkbmFtZSAhPSAkZGF0YVNvcnRCeURlZmF1bHQpIHtcclxuICAgICAgICAgICAgaWYoJG5hbWUgIT09IG51bGwgJiYgJHNlbGVjdG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAkc29ydERhdGFbJG5hbWVdID0gJHNlbGVjdG9yO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJJc290b3BlIHNvcnRpbmc6IFwiKyRkYXRhU29ydEJ5K1wiIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiIGFyZSByZXF1aXJlZC4gQ3VycmVudGx5IGNvbmZpZ3VyZWQgXCIrJGRhdGFTb3J0QnkrXCI9J1wiICsgJG5hbWUgKyBcIicgYW5kIFwiKyRkYXRhU29ydEJ5U2VsZWN0b3IrXCI9J1wiICsgJHNlbGVjdG9yICsgXCInXCIpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG4gICAgcmV0dXJuICRzb3J0RGF0YTtcclxufTtcclxuIiwiLyoqXG4qIF9zZXRDb250YWluZXJzOiBTZXQgdGhlIGZpbHRlcnMvc29ydGVycy9jbGVhciBjb250YWluZXJzIHRvIHRoZSByaWdodCBJc290b3BlIGNvbnRhaW5lclxuKiBAc2luY2UgMC4xLjBcbiogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxuKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcbiAgICB2YXIgJHNlbGYgPSB0aGlzLFxuICAgICAgICBzaCA9ICRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXSxcbiAgICAgICAgdGltZXN0YW1wID0gbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICAkLmVhY2goJCgnW2RhdGEtZmlsdGVyXSwgW2RhdGEtc29ydC1ieV0sIFtkYXRhLWNsZWFyLWZpbHRlcl0sIFtkYXRhLWZlZWRiYWNrXScpLCBmdW5jdGlvbihpbmQsIGVsbSkge1xuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcbiAgICAgICAgICAgIGZpbHRlckNvbnRhaW5lciA9ICRzZWxmLnV0aWxzLl9nZXRGb3JDb250YWluZXJBbmRJZC5jYWxsKCRzZWxmLCAkZWxtLCB0aW1lc3RhbXApO1xuXG4gICAgICAgIGlmKCAkc2VsZi5ndWlkID09PSBmaWx0ZXJDb250YWluZXIuZm9yIHx8IGZpbHRlckNvbnRhaW5lci5mb3IgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICBpZiggJGVsbS5hdHRyKCdkYXRhLWZpbHRlcicpICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgc2guZmlsdGVyQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lci5pZF0gPSAkKGZpbHRlckNvbnRhaW5lci5jb250YWluZXIpO1xuICAgICAgICAgICAgfSBlbHNlIGlmICggJGVsbS5hdHRyKCdkYXRhLXNvcnQtYnknKSAhPT0gdW5kZWZpbmVkICkge1xuICAgICAgICAgICAgICAgIHNoLnNvcnRDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9ICQoZmlsdGVyQ29udGFpbmVyLmNvbnRhaW5lcik7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKCAkZWxtLmF0dHIoJ2RhdGEtY2xlYXItZmlsdGVyJykgIT09IHVuZGVmaW5lZCApIHtcbiAgICAgICAgICAgICAgICBzaC5jbGVhckNvbnRhaW5lcltmaWx0ZXJDb250YWluZXIuaWRdID0gJChmaWx0ZXJDb250YWluZXIuY29udGFpbmVyKTtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICRlbG0uYXR0cignZGF0YS1mZWVkYmFjaycpICE9PSB1bmRlZmluZWQgKSB7XG4gICAgICAgICAgICAgICAgc2guZmVlZGJhY2tDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9ICQoZmlsdGVyQ29udGFpbmVyLmNvbnRhaW5lcik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9KTtcbn07XG4iXX0=
