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
        var $clearers = container;

        $clearers.each(function(idx, elm) {
            var $elm = $(elm),
                $history = $instance.isotope.sortHistory;

            if($instance.isotope.options.filter != $defaultFilter || $history[$history.length - 1] != $defaultSort) {

                $elm.removeClass("hide").show();

            } else {

                $elm.hide();

            }

        });
    });

}

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
        alert("simpleIsotope: Isotope.JS couldn't be found. Please include 'isotope.pkgd.min.js'.")
        return;
    }

    $.each(this, function(idx, elm) {
        var obj = {
            container: $(elm),
            settings: {
                itemSelector: '.item',
                dataSelectors: {
                    filter: 'data-filter',
                    sortBy: 'data-sort-by',
                    sortBySelector: 'data-sort-selector',
                    sortDirection: 'data-sort-direction',
                    forContainer: 'data-for-container',
                    clearFilter: 'data-clear-filter',
                    feedback: 'data-feedback',
                    type: 'data-filter-type',
                    filterMethod: 'data-filter-method'
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
    Isotope.prototype._getFilterTest = this._getFilterTest.bind(this);

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
            getSortData: $self._getSortData()
        }),
        filterContainer: {},
        sortContainer: {},
        clearContainer: {},
        feedbackContainer: {}
    };

    this._setContainers(this.instances[this.guid].isotope);

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

            if(index === 0) {
                //Remove all active classes first time
                container.find("["+$dataFilter+"]").removeClass($activeClass);
            }

            //Add active classes
            var active = container.find("["+$dataFilter+"=\""+filter+"\"]").addClass($activeClass);

            if(active.length > 0 && filter != $defaultFilter) {
                container.find("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
            }
        });

    });

};

},{}],7:[function(require,module,exports){
/**
* _createFilters: create buttons and add events to it
* @since 0.1.0
*/

module.exports = function() {
    var $dataFilter = this.settings.dataSelectors.filter,
        $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.filterContainer, function(key, container) {
        var $filters = container.find('['+$dataFilter+']');
        console.log(container);

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

    while ((match = re.exec(str)) != null) {
        if (match.index === re.lastIndex) {
            re.lastIndex++;
        }

        if(match[3] !== null && match[3] !== undefined) {

            matches[match[3]] = true;

        } else {

            if(matches[match[1]] == null || matches[match[1]] == undefined) {
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

    $hash = ($hash !== false && $hash != "#" && $hash != "") ? decodeURIComponent(window.location.hash) : '*';

    //Remove hash from first character if its exist
    if ($hash.charAt(0) === '#') {
         $hash = $hash.slice(1);
    }

    var hashArray = $hash.split("&");
    $.each(hashArray, function(key, $partHash) {

        if($partHash.indexOf("=") !== -1) {

            var tmp = $partHash.split("="),
                arr = [];

            if(tmp.length > 1) {
                var name = tmp[0],
                    values = tmp[1].replace(/\'/g, "");
            }

            values = values.split(",");
            for (var i=0; i<values.length; i++) {
                arr.push("[data-" + name + "='" + values[i] + "']");

                // $("[data-filter=\"[data-" + name + "='" + values[i] + "']\"]").addClass($self.settings.defaults.classNames.active);
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
        $combinedHash;

    if($newHash != "*") {

        if($currentHash.indexOf($newHash) === -1) {
            $combinedHash = $currentHash + $newHash;
        } else {
            $combinedHash = $currentHash.replace($newHash, "");
        }

        var $formattedHash = this.hash._formatHash(/\[data\-(.+?)\=\'(.+?)\'\]|(.[A-Za-z0-9]+)/g, $combinedHash),
            $endHash = [];

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

    if($endHash == "*" || $endHash == "") {
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

    /**
    * _setContainers: Set the filters/sorters/clear containers to the right Isotope container
    * @since 0.1.0
    * @param {object} $instance
    */
    _setContainers: function($instance) {
        var $self = this,
            time = new Date().getTime(),
            sh = $self.instances[$self.guid];

        console.log($('data-filter'));

/*        $.each($('[data-for-container]'), function(idx, elm) {
            var $elm = $(elm),
                $filterContainer = $self._getElementFromDataAttribute($elm.attr('data-for-container') || false),
                filterContainerId = ($elm !== false) ? ($elm.attr("id") || time) : time;

            console.log($filterContainer);
            if($filterContainer.is($instance.element)) {
                if($elm.find("[data-filter]").length > 0) {
                    sh.filterContainer[filterContainerId] = $elm;
                } else if($elm.find("[data-sort-by]").length > 0) {
                    sh.sortContainer[filterContainerId] = $elm;
                } else if($elm.attr("data-clear-filter") !== undefined) {
                    sh.clearContainer[filterContainerId] = $elm;
                } else if($elm.attr("data-feedback") !== undefined) {
                    sh.feedbackContainer[filterContainerId] = $elm;
                }
            }
        });*/
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
    * _getAttribute
    * @since 0.1.0
    * @update 0.2.1
    */
    _getElementFromDataAttribute: function(selector) {
        var $tmp;

        if(selector === "" || selector === false) {
            return false;
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

},{"./clear/__check.js":1,"./clear/_check.js":2,"./clear/_createClearers.js":3,"./constructor/jquery.js":4,"./constructor/prototype.js":5,"./filter/_check.js":6,"./filter/_createFilters.js":7,"./hash/_formatHash.js":8,"./hash/_getHash.js":9,"./hash/_onHashChanged.js":10,"./hash/_setHash.js":11,"./sorter/_check.js":13,"./sorter/_createSorters.js":14,"./text/_feedback.js":15}],13:[function(require,module,exports){
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
                            $sortArray.splice($sortArray.indexOf($dataSortAttr), 1)
                        }

                    }

                    if($sortArray.length == 0) {
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


    // var $sorters = $('['+this.settings.dataSelectors.sortBy+']'),//Get all sort elements
    //     $dataSortBy = this.settings.dataSelectors.sortBy,
    //     $dataForContainer = this.settings.dataSelectors.forContainer,
    //     $dataSortDirection = this.settings.dataSelectors.sortDirection,
    //     $defaultSort = this.settings.defaults.sort,
    //     $sortArray = [],
    //     $self = this;
    //
    // $sorters.each(function(idx, elm) {
    //     var $elm = $(elm);
    //
    //     var $sortContainer =   $elm.closest('['+$dataForContainer+']'),
    //         $container =       ($sortContainer.length == 0) ? $self._getInstances() : $self._getElementsFromSelector($sortContainer.attr($dataForContainer)),
    //         $dataSortAttr =    $elm.attr($dataSortBy),
    //         sortContainerId =  ($sortContainer.attr("id") || new Date().getTime());
    //
    //     if($self.instances[$self.guid].sortContainer[sortContainerId] == null) {
    //         $self.instances[$self.guid].sortContainer[sortContainerId] = $sortContainer;
    //     }
    //
    //     var how = {
    //         eventName: $elm.prop("tagName").toLowerCase() == "option" ? "change" : "click",
    //         element: $elm.prop("tagName").toLowerCase() == "option" ? $elm.closest("select") : $elm
    //     };
    //
    //     if(how.element.data("is-set") != "true") {
    //
    //         how.element.on(how.eventName, function(e) {
    //             e.preventDefault();
    //
    //             if(how.eventName == "change") {
    //                 if(how.element.find('option:selected')[0] != elm) {
    //                     return false;
    //                 }
    //             }
    //
    //             var $sortByValue = '';
    //             if($self.filterMultiple !== false) {
    //
    //                 $sortByValue = [];
    //
    //                 if($dataSortAttr == $defaultSort) {
    //                     $sortArray = [];
    //                 } else {
    //                     if($sortArray.indexOf($dataSortAttr) === -1) {
    //                         $sortArray.push($dataSortAttr);
    //                     } else {
    //                         $sortArray.splice($sortArray.indexOf($dataSortAttr), 1)
    //                     }
    //
    //                 }
    //
    //                 if($sortArray.length == 0) {
    //                     $sortByValue = $defaultSort;
    //                 } else {
    //                     $sortByValue = $sortArray;
    //                 }
    //
    //             } else {
    //                 $sortByValue = $dataSortAttr;
    //             }
    //
    //             $.each($container, function(key, container) {
    //                 var $sortAsc = false;
    //
    //                 if($elm.attr($dataSortDirection) !== null && $elm.attr($dataSortDirection) !== undefined) {
    //                     if($elm.attr($dataSortDirection).toLowerCase() == "asc") {
    //                         $sortAsc = true;
    //                     }
    //                 }
    //                 if($elm.attr($dataSortBy) == $defaultSort) {
    //                     $sortAsc = true;
    //                 }
    //
    //                 container.arrange({
    //                     sortBy: $sortByValue,
    //                     sortAscending: $sortAsc
    //                 });
    //
    //                 $self._onIsotopeChange.call($self, container);
    //
    //             });
    //         }).data("is-set", "true");
    //     }
    //
    // });
};

},{}],15:[function(require,module,exports){
module.exports = function() {
//     var $feedback = $('['+this.settings.dataSelectors.feedback+']'),
//         $dataForContainer = this.settings.dataSelectors.forContainer,
//         $self = this;
//
//     $feedback.each(function(key, elm) {
//         var $elm = $(elm),
//             $isFor = $elm.attr($dataForContainer) || false,
//             $container = ($isFor === false) ? $self._getInstances() : $self._getElementsFromSelector($isFor);
//
//         $.each($container, function($key, $instance) {
//             $elm.text($elm.attr("data-feedback").replace("{delta}", $instance.filteredItems.length));
//         });
//
//     });

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

},{}]},{},[12])(12)
});