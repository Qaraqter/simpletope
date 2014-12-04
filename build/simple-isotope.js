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

            if(index == 0) {
                //Remove all active classes first time
                container.find("["+$dataFilter+"]").removeClass($activeClass);
            }

            //Add active classes
            var active = container.find("["+$dataFilter+"=\""+filter+"\"]").addClass($activeClass);
            // console.log("["+$dataFilter+"=\""+filter+"\"]", container.find("["+$dataFilter+"=\""+filter+"\"]"));

            if(active.length > 0 && filter != $defaultFilter) {
                container.find("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
            }
        });

    });

};

},{}],7:[function(require,module,exports){
/**
* _createButtons and add events to it
* @since 0.1.0
*/

module.exports = function() {
    var $dataFilter = this.settings.dataSelectors.filter,
        $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.filterContainer, function(key, container) {
        var $filters = container.find('['+$dataFilter+']');

        $filters.each(function(idx, elm) {
            var $elm = $(elm);

            $elm.on('click', function(e) {
                e.preventDefault();

                var $filterValue = '',
                    $dataFilterAttr = $elm.attr($dataFilter),
                    val = $filterValue = $dataFilterAttr;

                if($self.useHash === true) {
                    $self.hash._setHash.call($self, $instance.isotope, $filterValue);
                } else {

                    if($self.filterMultiple) {

                        if($instance.isotope.options.filter == "*" || $filterValue == "*") {
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

                        if($filterValue == "") {
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
        _createButtons: require("./filter/_createButtons.js"),
        _check: require("./filter/_check.js")
    },
    sorter: {
        _createButtons: require("./sorter/_createButtons.js"),
        _check: require("./sorter/_check.js")
    },
    clear: {
        _createButtons: require("./clear/_createButtons.js"),
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

        $.each( $('[data-filter], [data-sort-by], [data-clear-filter], [data-feedback]') , function( idx, elm ) {
            var $elm = $(elm),
                $filterContainer = $self._getElementFromDataAttribute($elm.closest('[data-for-container]').attr('data-for-container') || ""),
                filterContainerId = ($filterContainer.attr("id") || time);

            if($filterContainer !== false) {
                if($filterContainer.is($instance.element)) {
                    // console.log($elm, $filterContainer, $self.instances, filterContainerId);
                }
            }
        });

        $.each($('[data-for-container]'), function(idx, elm) {
            var $elm = $(elm),
                $filterContainer = $self._getElementFromDataAttribute($elm.attr('data-for-container')),
                filterContainerId = ($elm.attr("id") || new Date().getTime());

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
        });
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
                    alert("Isotope sorting: "+$dataSortBy+" and "+$dataSortBySelector+" are required. Currently configured "+$dataSortBy+"='" + $name + "' and "+$dataSortBySelector+"='" + $selector + "'")
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
        var tmp = []

        $.each(this.instances, function(key, elm) {
            tmp.push(elm.isotope);
        });

        return tmp;
    },

    _getElementFromDataAttribute: function(selector) {
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
            // console.error("simpleIsotope: We cannot find any DOM element with the CSS selector: " + selector);
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

        }

    }

};

$.fn.simpleIsotope = require("./constructor/jquery.js")

$(document).ready(function() {
    $.each($("[data-isotope]"), function(key, elm) {
        $(elm).simpleIsotope();
    })
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
          return fToBind.apply(this instanceof fNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
if (!Function.prototype.trim) {
    String.prototype.trim = function() {
        return this.replace(/^\s+|\s+$/g, '');
    }
}

},{"./clear/__check.js":1,"./clear/_check.js":2,"./clear/_createButtons.js":3,"./constructor/jquery.js":4,"./constructor/prototype.js":5,"./filter/_check.js":6,"./filter/_createButtons.js":7,"./hash/_formatHash.js":8,"./hash/_getHash.js":9,"./hash/_onHashChanged.js":10,"./hash/_setHash.js":11,"./sorter/_check.js":13,"./sorter/_createButtons.js":14,"./text/_feedback.js":15}],13:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxVc2Vyc1xcUGF1bFxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsInNvdXJjZVxcY2xlYXJcXF9fY2hlY2suanMiLCJzb3VyY2VcXGNsZWFyXFxfY2hlY2suanMiLCJzb3VyY2VcXGNsZWFyXFxfY3JlYXRlQnV0dG9ucy5qcyIsInNvdXJjZVxcY29uc3RydWN0b3JcXGpxdWVyeS5qcyIsInNvdXJjZVxcY29uc3RydWN0b3JcXHByb3RvdHlwZS5qcyIsInNvdXJjZVxcZmlsdGVyXFxfY2hlY2suanMiLCJzb3VyY2VcXGZpbHRlclxcX2NyZWF0ZUJ1dHRvbnMuanMiLCJzb3VyY2VcXGhhc2hcXF9mb3JtYXRIYXNoLmpzIiwic291cmNlXFxoYXNoXFxfZ2V0SGFzaC5qcyIsInNvdXJjZVxcaGFzaFxcX29uSGFzaENoYW5nZWQuanMiLCJzb3VyY2VcXGhhc2hcXF9zZXRIYXNoLmpzIiwic291cmNlXFxzaW1wbGUtaXNvdG9wZS5hbWQuanMiLCJzb3VyY2VcXHNvcnRlclxcX2NoZWNrLmpzIiwic291cmNlXFxzb3J0ZXJcXF9jcmVhdGVCdXR0b25zLmpzIiwic291cmNlXFx0ZXh0XFxfZmVlZGJhY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIF9jaGVjazogQ2hlY2sgaWYgd2UgbmVlZCB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgY2xlYXIgZGl2IHdpdGhvdXQgYW4gaW5zdGFuY2VcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX29uSXNvdG9wZUNoYW5nZS5jYWxsKHRoaXMsIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0pO1xyXG59O1xyXG4iLCIvKipcclxuKiBfY2hlY2s6IENoZWNrIGlmIHdlIG5lZWQgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIGNsZWFyIGRpdi5cclxuKiBAc2luY2UgMC4xLjBcclxuKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xyXG5cclxuICAgIHZhciAkY2xlYXJGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlLFxyXG4gICAgICAgICRpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQuZWFjaCgkaW5zdGFuY2UuY2xlYXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRjbGVhcmVycyA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgJGNsZWFyZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICAkaGlzdG9yeSA9ICRpbnN0YW5jZS5pc290b3BlLnNvcnRIaXN0b3J5O1xyXG5cclxuICAgICAgICAgICAgaWYoJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIgIT0gJGRlZmF1bHRGaWx0ZXIgfHwgJGhpc3RvcnlbJGhpc3RvcnkubGVuZ3RoIC0gMV0gIT0gJGRlZmF1bHRTb3J0KSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJGVsbS5yZW1vdmVDbGFzcyhcImhpZGVcIikuc2hvdygpO1xyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkY2xlYXJGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5jbGVhckNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgICAgICB2YXIgJGNsZWFyZXJzID0gY29udGFpbmVyO1xyXG5cclxuICAgICAgICAkY2xlYXJlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKTtcclxuXHJcbiAgICAgICAgICAgICRlbG0uaGlkZSgpLnJlbW92ZUNsYXNzKFwiaGlkZVwiKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLmhhc2guX3NldEhhc2guY2FsbCgkc2VsZiwgJGluc3RhbmNlLmlzb3RvcGUsICRkZWZhdWx0RmlsdGVyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGluc3RhbmNlLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJGRlZmF1bHRGaWx0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJGRlZmF1bHRTb3J0XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciAkYXJncyA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgICAgaW5zdGFuY2VzID0gW107XG5cbiAgICBpZih0eXBlb2Ygd2luZG93Lklzb3RvcGUgIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGFsZXJ0KFwic2ltcGxlSXNvdG9wZTogSXNvdG9wZS5KUyBjb3VsZG4ndCBiZSBmb3VuZC4gUGxlYXNlIGluY2x1ZGUgJ2lzb3RvcGUucGtnZC5taW4uanMnLlwiKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJC5lYWNoKHRoaXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICBjb250YWluZXI6ICQoZWxtKSxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaXRlbVNlbGVjdG9yOiAnLml0ZW0nLFxuICAgICAgICAgICAgICAgIGRhdGFTZWxlY3RvcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAnZGF0YS1maWx0ZXInLFxuICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICdkYXRhLXNvcnQtYnknLFxuICAgICAgICAgICAgICAgICAgICBzb3J0QnlTZWxlY3RvcjogJ2RhdGEtc29ydC1zZWxlY3RvcicsXG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXJlY3Rpb246ICdkYXRhLXNvcnQtZGlyZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZm9yQ29udGFpbmVyOiAnZGF0YS1mb3ItY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJGaWx0ZXI6ICdkYXRhLWNsZWFyLWZpbHRlcicsXG4gICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrOiAnZGF0YS1mZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRhLWZpbHRlci10eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyTWV0aG9kOiAnZGF0YS1maWx0ZXItbWV0aG9kJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgc29ydDogXCJvcmlnaW5hbC1vcmRlclwiLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6ICdhY3RpdmUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaW5zdGFuY2VzLnB1c2gobmV3ICQuc2ltcGxlSXNvdG9wZSgkLmV4dGVuZChvYmosICRhcmdzKSkpO1xuICAgIH0pO1xuXG4gICAgJC5lYWNoKGluc3RhbmNlcywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcbiAgICAgICAgZWxtLnNvcnRlci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS5maWx0ZXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0uY2xlYXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0udGV4dC5fZmVlZGJhY2suY2FsbChlbG0pO1xuICAgICAgICBlbG0uY2xlYXIuX19jaGVjay5jYWxsKGVsbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5zdGFuY2VzO1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkYXJncyl7XG4gICAgJC5leHRlbmQodGhpcywgJGFyZ3MpO1xuXG4gICAgdmFyICRzZWxmID0gdGhpcyxcbiAgICAgICAgdGhlSGFzaCA9IHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5fZ2V0RmlsdGVyVGVzdE9yZ2luYWwgPSBJc290b3BlLnByb3RvdHlwZS5fZ2V0RmlsdGVyVGVzdDtcbiAgICBJc290b3BlLnByb3RvdHlwZS5fZ2V0RmlsdGVyVGVzdCA9IHRoaXMuX2dldEZpbHRlclRlc3QuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZ3VpZCA9IHRoaXMuY29udGFpbmVyLmF0dHIoXCJpZFwiKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcblxuICAgIHRoaXMuZmlsdGVyTXVsdGlwbGUgPSB0aGlzLmNvbnRhaW5lci5hdHRyKHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy50eXBlKSB8fCBcIlwiO1xuICAgIHRoaXMuZmlsdGVyTXVsdGlwbGUgPSAodGhpcy5maWx0ZXJNdWx0aXBsZS50b0xvd2VyQ2FzZSgpID09IFwibXVsdGlwbGVcIik7XG5cbiAgICB0aGlzLmZpbHRlck1ldGhvZCA9IHRoaXMuY29udGFpbmVyLmF0dHIodGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlck1ldGhvZCkgfHwgXCJcIjtcbiAgICB0aGlzLmZpbHRlck1ldGhvZCA9IHRoaXMuZmlsdGVyTWV0aG9kLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVuY29kZVVSSSA9IGZhbHNlO1xuXG4gICAgLy9GaXJzdCB0aW1lIGluaXQgaXNvdG9wZVxuICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0gPSB7XG4gICAgICAgIGlzb3RvcGU6IG5ldyBJc290b3BlKHRoaXMuY29udGFpbmVyLmNvbnRleHQsIHtcbiAgICAgICAgICAgIGZpbHRlcjogdGhlSGFzaCB8fCBcIipcIixcbiAgICAgICAgICAgIGl0ZW1TZWxlY3RvcjogJHNlbGYuc2V0dGluZ3MuaXRlbVNlbGVjdG9yIHx8ICcuaXRlbScsXG4gICAgICAgICAgICBsYXlvdXRNb2RlOiAkc2VsZi5jb250YWluZXIuZGF0YShcImxheW91dFwiKSB8fCBcImZpdFJvd3NcIixcbiAgICAgICAgICAgIGdldFNvcnREYXRhOiAkc2VsZi5fZ2V0U29ydERhdGEoKVxuICAgICAgICB9KSxcbiAgICAgICAgZmlsdGVyQ29udGFpbmVyOiB7fSxcbiAgICAgICAgc29ydENvbnRhaW5lcjoge30sXG4gICAgICAgIGNsZWFyQ29udGFpbmVyOiB7fSxcbiAgICAgICAgZmVlZGJhY2tDb250YWluZXI6IHt9XG4gICAgfTtcblxuICAgIHRoaXMuX3NldENvbnRhaW5lcnModGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlKTtcblxuICAgIGlmKHRoaXMuY29udGFpbmVyLmRhdGEoXCJoYXNoXCIpICE9PSBudWxsICYmIHRoaXMuY29udGFpbmVyLmRhdGEoXCJoYXNoXCIpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy51c2VIYXNoID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvL0FkZCBoYXNoIHN1cHBvcnRcbiAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2guX29uSGFzaENoYW5nZWQuYmluZCh0aGlzKSk7XG5cbiB9O1xuIiwiLyoqXG4gKiBfY2hlY2tBY3RpdmU6IENoZWNrIGlmIGJ1dHRvbnMgbmVlZCBhbiBhY3RpdmUgY2xhc3NcbiAqIEBzaW5jZSAwLjEuMFxuICogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlKSB7XG5cbiAgICB2YXIgJGRhdGFGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyLFxuICAgICAgICAkZGVmYXVsdEZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuZmlsdGVyLFxuICAgICAgICAkaW5zdGFuY2UgPSAkaW5zdGFuY2UgfHwgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZTtcblxuICAgICQuZWFjaCgkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIiksIGZ1bmN0aW9uKCBpbmRleCwgZmlsdGVyICkge1xuXG4gICAgICAgICQuZWFjaCgkaW5zdGFuY2UuZmlsdGVyQ29udGFpbmVyLCBmdW5jdGlvbiggaWR4LCBjb250YWluZXIgKSB7XG5cbiAgICAgICAgICAgIGlmKGluZGV4ID09IDApIHtcbiAgICAgICAgICAgICAgICAvL1JlbW92ZSBhbGwgYWN0aXZlIGNsYXNzZXMgZmlyc3QgdGltZVxuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvL0FkZCBhY3RpdmUgY2xhc3Nlc1xuICAgICAgICAgICAgdmFyIGFjdGl2ZSA9IGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIitmaWx0ZXIrXCJcXFwiXVwiKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgLy8gY29uc29sZS5sb2coXCJbXCIrJGRhdGFGaWx0ZXIrXCI9XFxcIlwiK2ZpbHRlcitcIlxcXCJdXCIsIGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIitmaWx0ZXIrXCJcXFwiXVwiKSk7XG5cbiAgICAgICAgICAgIGlmKGFjdGl2ZS5sZW5ndGggPiAwICYmIGZpbHRlciAhPSAkZGVmYXVsdEZpbHRlcikge1xuICAgICAgICAgICAgICAgIGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIiskZGVmYXVsdEZpbHRlcitcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn07XG4iLCIvKipcclxuKiBfY3JlYXRlQnV0dG9ucyBhbmQgYWRkIGV2ZW50cyB0byBpdFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRmaWx0ZXJzID0gY29udGFpbmVyLmZpbmQoJ1snKyRkYXRhRmlsdGVyKyddJyk7XHJcblxyXG4gICAgICAgICRmaWx0ZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcblxyXG4gICAgICAgICAgICAkZWxtLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJGZpbHRlclZhbHVlID0gJycsXHJcbiAgICAgICAgICAgICAgICAgICAgJGRhdGFGaWx0ZXJBdHRyID0gJGVsbS5hdHRyKCRkYXRhRmlsdGVyKSxcclxuICAgICAgICAgICAgICAgICAgICB2YWwgPSAkZmlsdGVyVmFsdWUgPSAkZGF0YUZpbHRlckF0dHI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLmhhc2guX3NldEhhc2guY2FsbCgkc2VsZiwgJGluc3RhbmNlLmlzb3RvcGUsICRmaWx0ZXJWYWx1ZSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZigkc2VsZi5maWx0ZXJNdWx0aXBsZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIgPT0gXCIqXCIgfHwgJGZpbHRlclZhbHVlID09IFwiKlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0RvIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKCRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuZmlsdGVyLmluZGV4T2YoJGZpbHRlclZhbHVlKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuZmlsdGVyLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZS5wdXNoKHZhbCk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkZmlsdGVyVmFsdWUuam9pbihcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUuc3BsaWNlKCRmaWx0ZXJWYWx1ZS5pbmRleE9mKHZhbCksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGZpbHRlclZhbHVlLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkZmlsdGVyVmFsdWUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gXCIqXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICRmaWx0ZXJWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcbiIsIi8qKlxuKiBfZm9ybWF0SGFzaDogRm9ybWF0IG11bHRpcGxlIGZpbHRlcnMgaW50byBvbmUgc3RyaW5nIGJhc2VkIG9uIGEgcmVndWxhciBleHByZXNzaW9uXG4qIEBzaW5jZSAwLjEuMFxuKiBAcGFyYW0ge3JlZ2V4fSByZVxuKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZSwgc3RyKSB7XG4gICAgdmFyIG1hdGNoZXMgPSB7fSxcbiAgICAgICAgbWF0Y2g7XG5cbiAgICB3aGlsZSAoKG1hdGNoID0gcmUuZXhlYyhzdHIpKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChtYXRjaC5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XG4gICAgICAgICAgICByZS5sYXN0SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG1hdGNoWzNdICE9PSBudWxsICYmIG1hdGNoWzNdICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFszXV0gPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmKG1hdGNoZXNbbWF0Y2hbMV1dID09IG51bGwgfHwgbWF0Y2hlc1ttYXRjaFsxXV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFsxXV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2hbMV1dLnB1c2gobWF0Y2hbMl0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBtYXRjaGVzO1xufTtcbiIsIi8qKlxuICogX2dldEhhc2g6IEdldCB3aW5kb3cubG9jYXRpb24uaGFzaCBhbmQgZm9ybWF0IGl0IGZvciBJc290b3BlXG4gKiBAc2luY2UgMC4xLjBcbiAqL1xuXG4gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaCB8fCBmYWxzZSxcbiAgICAgICAgJG5ld0hhc2ggPSBcIlwiO1xuXG4gICAgJGhhc2ggPSAoJGhhc2ggIT09IGZhbHNlICYmICRoYXNoICE9IFwiI1wiICYmICRoYXNoICE9IFwiXCIpID8gZGVjb2RlVVJJQ29tcG9uZW50KHdpbmRvdy5sb2NhdGlvbi5oYXNoKSA6ICcqJztcblxuICAgIC8vUmVtb3ZlIGhhc2ggZnJvbSBmaXJzdCBjaGFyYWN0ZXIgaWYgaXRzIGV4aXN0XG4gICAgaWYgKCRoYXNoLmNoYXJBdCgwKSA9PT0gJyMnKSB7XG4gICAgICAgICAkaGFzaCA9ICRoYXNoLnNsaWNlKDEpO1xuICAgIH1cblxuICAgIHZhciBoYXNoQXJyYXkgPSAkaGFzaC5zcGxpdChcIiZcIik7XG4gICAgJC5lYWNoKGhhc2hBcnJheSwgZnVuY3Rpb24oa2V5LCAkcGFydEhhc2gpIHtcblxuICAgICAgICBpZigkcGFydEhhc2guaW5kZXhPZihcIj1cIikgIT09IC0xKSB7XG5cbiAgICAgICAgICAgIHZhciB0bXAgPSAkcGFydEhhc2guc3BsaXQoXCI9XCIpLFxuICAgICAgICAgICAgICAgIGFyciA9IFtdO1xuXG4gICAgICAgICAgICBpZih0bXAubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gdG1wWzBdLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB0bXBbMV0ucmVwbGFjZSgvXFwnL2csIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVwiKTtcblxuICAgICAgICAgICAgICAgIC8vICQoXCJbZGF0YS1maWx0ZXI9XFxcIltkYXRhLVwiICsgbmFtZSArIFwiPSdcIiArIHZhbHVlc1tpXSArIFwiJ11cXFwiXVwiKS5hZGRDbGFzcygkc2VsZi5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRuZXdIYXNoICs9IGFyci5qb2luKFwiLFwiKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJG5ld0hhc2ggKz0gKCRwYXJ0SGFzaCA9PSBcIipcIiB8fCAkcGFydEhhc2guY2hhckF0KDApID09ICcuJykgPyAkcGFydEhhc2g6IFwiLlwiICsgJHBhcnRIYXNoO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYoa2V5ICE9IChoYXNoQXJyYXkubGVuZ3RoIC0gMSkpIHtcbiAgICAgICAgICAgICRuZXdIYXNoICs9IFwiLFwiO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgICByZXR1cm4gJG5ld0hhc2g7XG5cbiB9O1xuIiwiLyoqXHJcbiogX29uSGFzaENoYW5nZTogZmlyZXMgd2hlbiBsb2NhdGlvbi5oYXNoIGhhcyBiZWVuIGNoYW5nZWRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX3NldElzb3RvcGUuY2FsbCh0aGlzLCB0aGlzLmhhc2guX2dldEhhc2guY2FsbCh0aGlzKSk7XHJcbn07XHJcbiIsIi8qKlxuICogX3NldEhhc2g6IFNldCBhIG5ldyBsb2NhdGlvbi5oYXNoIGFmdGVyIGZvcm1hdHRpbmcgaXRcbiAqIEBzaW5jZSAwLjEuMFxuICogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxuICogQHBhcmFtIHtzdHJpbmd9ICRuZXdIYXNoXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UsICRuZXdIYXNoKSB7XG4gICAgdmFyICRjdXJyZW50SGFzaCA9ICgkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIgPT0gXCIqXCIpID8gXCJcIiA6ICRpbnN0YW5jZS5vcHRpb25zLmZpbHRlcixcbiAgICAgICAgJGNvbWJpbmVkSGFzaDtcblxuICAgIGlmKCRuZXdIYXNoICE9IFwiKlwiKSB7XG5cbiAgICAgICAgaWYoJGN1cnJlbnRIYXNoLmluZGV4T2YoJG5ld0hhc2gpID09PSAtMSkge1xuICAgICAgICAgICAgJGNvbWJpbmVkSGFzaCA9ICRjdXJyZW50SGFzaCArICRuZXdIYXNoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGNvbWJpbmVkSGFzaCA9ICRjdXJyZW50SGFzaC5yZXBsYWNlKCRuZXdIYXNoLCBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciAkZm9ybWF0dGVkSGFzaCA9IHRoaXMuaGFzaC5fZm9ybWF0SGFzaCgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF18KC5bQS1aYS16MC05XSspL2csICRjb21iaW5lZEhhc2gpLFxuICAgICAgICAgICAgJGVuZEhhc2ggPSBbXTtcblxuICAgICAgICAkLmVhY2goJGZvcm1hdHRlZEhhc2gsIGZ1bmN0aW9uKGtleSwgZWxtKSB7XG4gICAgICAgICAgICBpZihlbG0gPT09IHRydWUpIHsvL2lzQ2xhc3NcbiAgICAgICAgICAgICAgICAkZW5kSGFzaC5wdXNoKCAoa2V5LmNoYXJBdCgwKSA9PSAnLicpID8ga2V5LnNsaWNlKDEpIDoga2V5ICk7XG4gICAgICAgICAgICB9IGVsc2Ugey8vaXNPYmplY3RcbiAgICAgICAgICAgICAgICAkZW5kSGFzaC5wdXNoKGtleSArIFwiPVwiICsgZWxtLmpvaW4oXCIsXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGVuZEhhc2ggPSAkZW5kSGFzaC5qb2luKFwiJlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkZW5kSGFzaCA9ICRuZXdIYXNoO1xuICAgIH1cblxuICAgIGlmKCRlbmRIYXNoID09IFwiKlwiIHx8ICRlbmRIYXNoID09IFwiXCIpIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSBcIlwiO1xuICAgIH0gZWxzZSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gKHRoaXMuZW5jb2RlVVJJID09PSB0cnVlKSA/IGVuY29kZVVSSUNvbXBvbmVudCgkZW5kSGFzaCkgOiAkZW5kSGFzaDtcbiAgICB9XG5cbiAgICByZXR1cm4gJGVuZEhhc2g7XG59O1xuIiwidmFyICQgPSB3aW5kb3cualF1ZXJ5O1xyXG5cclxuJC5zaW1wbGVJc290b3BlID0gcmVxdWlyZShcIi4vY29uc3RydWN0b3IvcHJvdG90eXBlLmpzXCIpO1xyXG5cclxuJC5zaW1wbGVJc290b3BlLnByb3RvdHlwZSA9IHtcclxuICAgIGluc3RhbmNlczoge30sXHJcbiAgICBjb25zdHJ1Y3RvcjogJC5zaW1wbGVJc290b3BlLFxyXG5cclxuICAgIGhhc2g6IHtcclxuICAgICAgICBfZ2V0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fZ2V0SGFzaC5qc1wiKSxcclxuICAgICAgICBfc2V0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fc2V0SGFzaC5qc1wiKSxcclxuICAgICAgICBfZm9ybWF0SGFzaDogcmVxdWlyZShcIi4vaGFzaC9fZm9ybWF0SGFzaC5qc1wiKSxcclxuICAgICAgICBfb25IYXNoQ2hhbmdlZDogcmVxdWlyZShcIi4vaGFzaC9fb25IYXNoQ2hhbmdlZC5qc1wiKVxyXG4gICAgfSxcclxuICAgIGZpbHRlcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9maWx0ZXIvX2NyZWF0ZUJ1dHRvbnMuanNcIiksXHJcbiAgICAgICAgX2NoZWNrOiByZXF1aXJlKFwiLi9maWx0ZXIvX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgc29ydGVyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL3NvcnRlci9fY3JlYXRlQnV0dG9ucy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL3NvcnRlci9fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICBjbGVhcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9jbGVhci9fY3JlYXRlQnV0dG9ucy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19jaGVjay5qc1wiKSxcclxuICAgICAgICBfX2NoZWNrOiByZXF1aXJlKFwiLi9jbGVhci9fX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgdGV4dDoge1xyXG4gICAgICAgIF9mZWVkYmFjazogcmVxdWlyZShcIi4vdGV4dC9fZmVlZGJhY2suanNcIilcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9zZXRDb250YWluZXJzOiBTZXQgdGhlIGZpbHRlcnMvc29ydGVycy9jbGVhciBjb250YWluZXJzIHRvIHRoZSByaWdodCBJc290b3BlIGNvbnRhaW5lclxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9zZXRDb250YWluZXJzOiBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgJHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICAgICB0aW1lID0gbmV3IERhdGUoKS5nZXRUaW1lKCksXHJcbiAgICAgICAgICAgIHNoID0gJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdO1xyXG5cclxuICAgICAgICAkLmVhY2goICQoJ1tkYXRhLWZpbHRlcl0sIFtkYXRhLXNvcnQtYnldLCBbZGF0YS1jbGVhci1maWx0ZXJdLCBbZGF0YS1mZWVkYmFja10nKSAsIGZ1bmN0aW9uKCBpZHgsIGVsbSApIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICAkZmlsdGVyQ29udGFpbmVyID0gJHNlbGYuX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZSgkZWxtLmNsb3Nlc3QoJ1tkYXRhLWZvci1jb250YWluZXJdJykuYXR0cignZGF0YS1mb3ItY29udGFpbmVyJykgfHwgXCJcIiksXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJDb250YWluZXJJZCA9ICgkZmlsdGVyQ29udGFpbmVyLmF0dHIoXCJpZFwiKSB8fCB0aW1lKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCRmaWx0ZXJDb250YWluZXIgIT09IGZhbHNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZigkZmlsdGVyQ29udGFpbmVyLmlzKCRpbnN0YW5jZS5lbGVtZW50KSkge1xyXG4gICAgICAgICAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCRlbG0sICRmaWx0ZXJDb250YWluZXIsICRzZWxmLmluc3RhbmNlcywgZmlsdGVyQ29udGFpbmVySWQpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICQuZWFjaCgkKCdbZGF0YS1mb3ItY29udGFpbmVyXScpLCBmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgICAgICRmaWx0ZXJDb250YWluZXIgPSAkc2VsZi5fZ2V0RWxlbWVudEZyb21EYXRhQXR0cmlidXRlKCRlbG0uYXR0cignZGF0YS1mb3ItY29udGFpbmVyJykpLFxyXG4gICAgICAgICAgICAgICAgZmlsdGVyQ29udGFpbmVySWQgPSAoJGVsbS5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xyXG5cclxuICAgICAgICAgICAgaWYoJGZpbHRlckNvbnRhaW5lci5pcygkaW5zdGFuY2UuZWxlbWVudCkpIHtcclxuICAgICAgICAgICAgICAgIGlmKCRlbG0uZmluZChcIltkYXRhLWZpbHRlcl1cIikubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoLmZpbHRlckNvbnRhaW5lcltmaWx0ZXJDb250YWluZXJJZF0gPSAkZWxtO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIGlmKCRlbG0uZmluZChcIltkYXRhLXNvcnQtYnldXCIpLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgICAgICAgICBzaC5zb3J0Q29udGFpbmVyW2ZpbHRlckNvbnRhaW5lcklkXSA9ICRlbG07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoJGVsbS5hdHRyKFwiZGF0YS1jbGVhci1maWx0ZXJcIikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHNoLmNsZWFyQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lcklkXSA9ICRlbG07XHJcbiAgICAgICAgICAgICAgICB9IGVsc2UgaWYoJGVsbS5hdHRyKFwiZGF0YS1mZWVkYmFja1wiKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgc2guZmVlZGJhY2tDb250YWluZXJbZmlsdGVyQ29udGFpbmVySWRdID0gJGVsbTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX29uQmVmb3JlSXNvdG9wZUNoYW5nZTogZmlyZXMgYmVmb3JlIHRoZSBJc290b3BlIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiAgICAqL1xyXG4gICAgX29uQmVmb3JlSXNvdG9wZUNoYW5nZTogZnVuY3Rpb24oJGluc3RhbmNlKSB7fSxcclxuXHJcbiAgICAvKipcclxuICAgICogX29uSXNvdG9wZUNoYW5nZTogZmlyZXMgd2hlbiB0aGUgSXNvdG9wZSBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZFxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9vbklzb3RvcGVDaGFuZ2U6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy5zb3J0ZXIuX2NoZWNrLmNhbGwodGhpcywgJGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UuaXNvdG9wZSk7XHJcbiAgICAgICAgdGhpcy50ZXh0Ll9mZWVkYmFjay5jYWxsKHRoaXMsICRpbnN0YW5jZS5pc290b3BlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9zZXRJc290b3BlOiBSZWNvbmZpZ3VyZSBpc290b3BlXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJHNlbGVjdG9yXHJcbiAgICAqL1xyXG4gICAgX3NldElzb3RvcGU6IGZ1bmN0aW9uKCRzZWxlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgZmlsdGVyOiAkc2VsZWN0b3JcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fb25Jc290b3BlQ2hhbmdlKHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIF9nZXRTb3J0RGF0YTogR2V0IHRoZSBkYXRhLXNvcnQtYnkgYXR0cmlidXRlcyBhbmQgbWFrZSB0aGVtIGludG8gYW4gSXNvdG9wZSBcImdldFNvcnREYXRhXCIgb2JqZWN0XHJcbiAgICAgKiBAc2luY2UgMC4xLjBcclxuICAgICAqL1xyXG4gICAgX2dldFNvcnREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgJHNvcnREYXRhID0ge30sXHJcbiAgICAgICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAgICAgJGRhdGFTb3J0QnlTZWxlY3RvciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnlTZWxlY3RvcixcclxuICAgICAgICAgICAgJGRhdGFTb3J0QnlEZWZhdWx0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0O1xyXG5cclxuICAgICAgICAkKCdbJyArICRkYXRhU29ydEJ5ICsgJ10sIFsnICsgJGRhdGFTb3J0QnlTZWxlY3RvciArICddJykuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgICAgICRuYW1lID0gJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgJHNlbGVjdG9yID0gJGVsbS5hdHRyKCRkYXRhU29ydEJ5U2VsZWN0b3IpIHx8IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZigkbmFtZSAhPSAkZGF0YVNvcnRCeURlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmKCRuYW1lICE9PSBudWxsICYmICRzZWxlY3RvciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0RGF0YVskbmFtZV0gPSAkc2VsZWN0b3I7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiSXNvdG9wZSBzb3J0aW5nOiBcIiskZGF0YVNvcnRCeStcIiBhbmQgXCIrJGRhdGFTb3J0QnlTZWxlY3RvcitcIiBhcmUgcmVxdWlyZWQuIEN1cnJlbnRseSBjb25maWd1cmVkIFwiKyRkYXRhU29ydEJ5K1wiPSdcIiArICRuYW1lICsgXCInIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiPSdcIiArICRzZWxlY3RvciArIFwiJ1wiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAkc29ydERhdGE7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfZ2V0SW5zdGFuY2VzXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKi9cclxuICAgIF9nZXRJbnN0YW5jZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0bXAgPSBbXVxyXG5cclxuICAgICAgICAkLmVhY2godGhpcy5pbnN0YW5jZXMsIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgICAgIHRtcC5wdXNoKGVsbS5pc290b3BlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRtcDtcclxuICAgIH0sXHJcblxyXG4gICAgX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZTogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgJHRtcDtcclxuXHJcbiAgICAgICAgaWYoc2VsZWN0b3IuY2hhckF0KDApID09IFwiI1wiIHx8IHNlbGVjdG9yLmNoYXJBdCgwKSA9PSBcIi5cIikge1x0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZihzZWxlY3Rvci5pbmRleE9mKFwiI1wiKSAhPT0gLTEgfHwgc2VsZWN0b3IuaW5kZXhPZihcIi5cIikgIT09IC0xKSB7XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoXCIgXCIpICE9PSAtMSkge1x0XHRcdFx0XHRcdFx0XHRcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgICAgICB9IGVsc2Uge1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvL2V2dWxhdGUgdGhlIHN0cmluZyBhcyBhbiBpZFxyXG4gICAgICAgICAgICAkdG1wID0gJChcIiNcIiArIHNlbGVjdG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCR0bXAubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgLy8gY29uc29sZS5lcnJvcihcInNpbXBsZUlzb3RvcGU6IFdlIGNhbm5vdCBmaW5kIGFueSBET00gZWxlbWVudCB3aXRoIHRoZSBDU1Mgc2VsZWN0b3I6IFwiICsgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgcmV0dXJuICR0bXA7XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBfZ2V0RmlsdGVyVGVzdDogZnVuY3Rpb24oZmlsdGVyKSB7XHJcbiAgICAgICAgdmFyICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cclxuICAgICAgICAgICAgdmFyIGZpbHRlcnMgPSBmaWx0ZXIuc3BsaXQoXCIsXCIpLFxyXG4gICAgICAgICAgICAgICAgYWN0aXZlID0gW107XHJcblxyXG4gICAgICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZmlsdGVycy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGZpbHRlcnNbaV0uaW5kZXhPZihcImRhdGEtXCIpICE9PSAtMSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICB2YXIgY2F0ID0gZmlsdGVyc1tpXS5yZXBsYWNlKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXS9nLCBcIiQxXCIpLnRyaW0oKTtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBmaWx0ZXJzW2ldLnJlcGxhY2UoL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csIFwiJDJcIikudHJpbSgpO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZihqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApICE9PSB1bmRlZmluZWQgJiYgalF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5kYXRhKCBjYXQgKSAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZiggalF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5kYXRhKCBjYXQgKS5pbmRleE9mKCB2YWx1ZSApICE9PSAtMSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZiggalF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5pcyggZmlsdGVyc1tpXSApICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmUucHVzaChmaWx0ZXJzW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgaWYoJHNlbGYuZmlsdGVyTWV0aG9kID09IFwib3JcIikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZS5sZW5ndGggPiAwO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZS5sZW5ndGggPT0gZmlsdGVycy5sZW5ndGg7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4kLmZuLnNpbXBsZUlzb3RvcGUgPSByZXF1aXJlKFwiLi9jb25zdHJ1Y3Rvci9qcXVlcnkuanNcIilcclxuXHJcbiQoZG9jdW1lbnQpLnJlYWR5KGZ1bmN0aW9uKCkge1xyXG4gICAgJC5lYWNoKCQoXCJbZGF0YS1pc290b3BlXVwiKSwgZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICAkKGVsbSkuc2ltcGxlSXNvdG9wZSgpO1xyXG4gICAgfSlcclxufSk7XHJcblxyXG4vLyBBZGQgYmluZCBzdXBwb3J0XHJcbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQpIHtcclxuICBGdW5jdGlvbi5wcm90b3R5cGUuYmluZCA9IGZ1bmN0aW9uKG9UaGlzKSB7XHJcbiAgICBpZiAodHlwZW9mIHRoaXMgIT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgLy8gY2xvc2VzdCB0aGluZyBwb3NzaWJsZSB0byB0aGUgRUNNQVNjcmlwdCA1XHJcbiAgICAgIC8vIGludGVybmFsIElzQ2FsbGFibGUgZnVuY3Rpb25cclxuICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcignRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgLSB3aGF0IGlzIHRyeWluZyB0byBiZSBib3VuZCBpcyBub3QgY2FsbGFibGUnKTtcclxuICAgIH1cclxuXHJcbiAgICB2YXIgYUFyZ3MgICA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSksXHJcbiAgICAgICAgZlRvQmluZCA9IHRoaXMsXHJcbiAgICAgICAgZk5PUCAgICA9IGZ1bmN0aW9uKCkge30sXHJcbiAgICAgICAgZkJvdW5kICA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgcmV0dXJuIGZUb0JpbmQuYXBwbHkodGhpcyBpbnN0YW5jZW9mIGZOT1AgJiYgb1RoaXNcclxuICAgICAgICAgICAgICAgICA/IHRoaXNcclxuICAgICAgICAgICAgICAgICA6IG9UaGlzLFxyXG4gICAgICAgICAgICAgICAgIGFBcmdzLmNvbmNhdChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpKSk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICBmTk9QLnByb3RvdHlwZSA9IHRoaXMucHJvdG90eXBlO1xyXG4gICAgZkJvdW5kLnByb3RvdHlwZSA9IG5ldyBmTk9QKCk7XHJcblxyXG4gICAgcmV0dXJuIGZCb3VuZDtcclxuICB9O1xyXG59XHJcbmlmICghRnVuY3Rpb24ucHJvdG90eXBlLnRyaW0pIHtcclxuICAgIFN0cmluZy5wcm90b3R5cGUudHJpbSA9IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnJlcGxhY2UoL15cXHMrfFxccyskL2csICcnKTtcclxuICAgIH1cclxufVxyXG4iLCIvKipcbiAqIF9jaGVja0FjdGl2ZTogQ2hlY2sgaWYgYnV0dG9ucyBuZWVkIGFuIGFjdGl2ZSBjbGFzc1xuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcblxuICAgIHZhciAkZGF0YVNvcnQgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXG4gICAgICAgICRpbnN0YW5jZSA9ICRpbnN0YW5jZSB8fCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlLFxuICAgICAgICAkc29ydEhpc3RvcnkgPSAkaW5zdGFuY2UuaXNvdG9wZS5zb3J0SGlzdG9yeTtcblxuICAgICQuZWFjaCgkaW5zdGFuY2Uuc29ydENvbnRhaW5lciwgZnVuY3Rpb24oIGlkeCwgY29udGFpbmVyICkge1xuXG4gICAgICAgIC8vUmVtb3ZlIGFsbCBhY3RpdmUgY2xhc3NlcyBmaXJzdCB0aW1lXG4gICAgICAgIGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhU29ydCtcIl1cIikucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcblxuICAgICAgICAvL0FkZCBhY3RpdmUgY2xhc3Nlc1xuICAgICAgICB2YXIgYWN0aXZlID0gY29udGFpbmVyLmZpbmQoXCJbXCIrJGRhdGFTb3J0K1wiPVxcXCJcIisgJHNvcnRIaXN0b3J5WzBdICtcIlxcXCJdXCIpLmFkZENsYXNzKCRhY3RpdmVDbGFzcyk7XG5cbiAgICAgICAgaWYoYWN0aXZlLmxlbmd0aCA+IDAgJiYgJHNvcnRIaXN0b3J5WzBdICE9ICRkZWZhdWx0U29ydCkge1xuICAgICAgICAgICAgY29udGFpbmVyLmZpbmQoXCJbXCIrJGRhdGFTb3J0K1wiPVxcXCJcIiskZGVmYXVsdFNvcnQrXCJcXFwiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG5cbiAgICB9KTtcblxufTtcbiIsIi8qKlxyXG4qIF9jcmVhdGVCdXR0b25zIGFuZCBhZGQgZXZlbnRzIHRvIGl0XHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkZGF0YVNvcnREaXJlY3Rpb24gPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydERpcmVjdGlvbixcclxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAgICAgJHNvcnRBcnJheSA9IFtdLFxyXG4gICAgICAgICRpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQuZWFjaCgkaW5zdGFuY2Uuc29ydENvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgICAgICB2YXIgJHNvcnRlcnMgPSBjb250YWluZXIuZmluZCgnWycrJGRhdGFTb3J0QnkrJ10nKTtcclxuXHJcbiAgICAgICAgJHNvcnRlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgICAgICRkYXRhU29ydEF0dHIgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpLFxyXG4gICAgICAgICAgICAgICAgaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgICAgIGV2ZW50TmFtZTogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyBcImNoYW5nZVwiIDogXCJjbGlja1wiLFxyXG4gICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gJGVsbS5jbG9zZXN0KFwic2VsZWN0XCIpIDogJGVsbVxyXG4gICAgICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGhvdy5lbGVtZW50Lm9uKGhvdy5ldmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihob3cuZXZlbnROYW1lID09IFwiY2hhbmdlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihob3cuZWxlbWVudC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXSAhPSBlbG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJHNvcnRCeVZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgICAgICBpZigkc2VsZi5maWx0ZXJNdWx0aXBsZSAhPT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRkYXRhU29ydEF0dHIgPT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0cikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFycmF5LnB1c2goJGRhdGFTb3J0QXR0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFycmF5LnNwbGljZSgkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0ciksIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkZWZhdWx0U29ydDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSAkc29ydEFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkYXRhU29ydEF0dHI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRzb3J0QXNjID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IG51bGwgJiYgJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pLnRvTG93ZXJDYXNlKCkgPT0gXCJhc2NcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJGluc3RhbmNlLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5OiAkc29ydEJ5VmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEFzY2VuZGluZzogJHNvcnRBc2NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG5cclxuICAgIC8vIHZhciAkc29ydGVycyA9ICQoJ1snK3RoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnkrJ10nKSwvL0dldCBhbGwgc29ydCBlbGVtZW50c1xyXG4gICAgLy8gICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgIC8vICAgICAkZGF0YUZvckNvbnRhaW5lciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIsXHJcbiAgICAvLyAgICAgJGRhdGFTb3J0RGlyZWN0aW9uID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnREaXJlY3Rpb24sXHJcbiAgICAvLyAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgLy8gICAgICRzb3J0QXJyYXkgPSBbXSxcclxuICAgIC8vICAgICAkc2VsZiA9IHRoaXM7XHJcbiAgICAvL1xyXG4gICAgLy8gJHNvcnRlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgLy8gICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG4gICAgLy9cclxuICAgIC8vICAgICB2YXIgJHNvcnRDb250YWluZXIgPSAgICRlbG0uY2xvc2VzdCgnWycrJGRhdGFGb3JDb250YWluZXIrJ10nKSxcclxuICAgIC8vICAgICAgICAgJGNvbnRhaW5lciA9ICAgICAgICgkc29ydENvbnRhaW5lci5sZW5ndGggPT0gMCkgPyAkc2VsZi5fZ2V0SW5zdGFuY2VzKCkgOiAkc2VsZi5fZ2V0RWxlbWVudHNGcm9tU2VsZWN0b3IoJHNvcnRDb250YWluZXIuYXR0cigkZGF0YUZvckNvbnRhaW5lcikpLFxyXG4gICAgLy8gICAgICAgICAkZGF0YVNvcnRBdHRyID0gICAgJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSxcclxuICAgIC8vICAgICAgICAgc29ydENvbnRhaW5lcklkID0gICgkc29ydENvbnRhaW5lci5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICBpZigkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uc29ydENvbnRhaW5lcltzb3J0Q29udGFpbmVySWRdID09IG51bGwpIHtcclxuICAgIC8vICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLnNvcnRDb250YWluZXJbc29ydENvbnRhaW5lcklkXSA9ICRzb3J0Q29udGFpbmVyO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgdmFyIGhvdyA9IHtcclxuICAgIC8vICAgICAgICAgZXZlbnROYW1lOiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/IFwiY2hhbmdlXCIgOiBcImNsaWNrXCIsXHJcbiAgICAvLyAgICAgICAgIGVsZW1lbnQ6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gJGVsbS5jbG9zZXN0KFwic2VsZWN0XCIpIDogJGVsbVxyXG4gICAgLy8gICAgIH07XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGlmKGhvdy5lbGVtZW50LmRhdGEoXCJpcy1zZXRcIikgIT0gXCJ0cnVlXCIpIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgIGhvdy5lbGVtZW50Lm9uKGhvdy5ldmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcclxuICAgIC8vICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICBpZihob3cuZXZlbnROYW1lID09IFwiY2hhbmdlXCIpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICBpZihob3cuZWxlbWVudC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXSAhPSBlbG0pIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICB2YXIgJHNvcnRCeVZhbHVlID0gJyc7XHJcbiAgICAvLyAgICAgICAgICAgICBpZigkc2VsZi5maWx0ZXJNdWx0aXBsZSAhPT0gZmFsc2UpIHtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gW107XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmKCRkYXRhU29ydEF0dHIgPT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkgPSBbXTtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0cikgPT09IC0xKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFycmF5LnB1c2goJGRhdGFTb3J0QXR0cik7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFycmF5LnNwbGljZSgkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0ciksIDEpXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkZWZhdWx0U29ydDtcclxuICAgIC8vICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSAkc29ydEFycmF5O1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkYXRhU29ydEF0dHI7XHJcbiAgICAvLyAgICAgICAgICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgJC5lYWNoKCRjb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgdmFyICRzb3J0QXNjID0gZmFsc2U7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pICE9PSBudWxsICYmICRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pICE9PSB1bmRlZmluZWQpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikudG9Mb3dlckNhc2UoKSA9PSBcImFzY1wiKSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNvcnRBc2MgPSB0cnVlO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFycmFuZ2Uoe1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICRzb3J0QnlWYWx1ZSxcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgc29ydEFzY2VuZGluZzogJHNvcnRBc2NcclxuICAgIC8vICAgICAgICAgICAgICAgICB9KTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCBjb250YWluZXIpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIH0pO1xyXG4gICAgLy8gICAgICAgICB9KS5kYXRhKFwiaXMtc2V0XCIsIFwidHJ1ZVwiKTtcclxuICAgIC8vICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbi8vICAgICB2YXIgJGZlZWRiYWNrID0gJCgnWycrdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZlZWRiYWNrKyddJyksXHJcbi8vICAgICAgICAgJGRhdGFGb3JDb250YWluZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyLFxyXG4vLyAgICAgICAgICRzZWxmID0gdGhpcztcclxuLy9cclxuLy8gICAgICRmZWVkYmFjay5lYWNoKGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbi8vICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbi8vICAgICAgICAgICAgICRpc0ZvciA9ICRlbG0uYXR0cigkZGF0YUZvckNvbnRhaW5lcikgfHwgZmFsc2UsXHJcbi8vICAgICAgICAgICAgICRjb250YWluZXIgPSAoJGlzRm9yID09PSBmYWxzZSkgPyAkc2VsZi5fZ2V0SW5zdGFuY2VzKCkgOiAkc2VsZi5fZ2V0RWxlbWVudHNGcm9tU2VsZWN0b3IoJGlzRm9yKTtcclxuLy9cclxuLy8gICAgICAgICAkLmVhY2goJGNvbnRhaW5lciwgZnVuY3Rpb24oJGtleSwgJGluc3RhbmNlKSB7XHJcbi8vICAgICAgICAgICAgICRlbG0udGV4dCgkZWxtLmF0dHIoXCJkYXRhLWZlZWRiYWNrXCIpLnJlcGxhY2UoXCJ7ZGVsdGF9XCIsICRpbnN0YW5jZS5maWx0ZXJlZEl0ZW1zLmxlbmd0aCkpO1xyXG4vLyAgICAgICAgIH0pO1xyXG4vL1xyXG4vLyAgICAgfSk7XHJcblxyXG4gICAgdmFyICRpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQuZWFjaCgkaW5zdGFuY2UuZmVlZGJhY2tDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRmZWVkYmFjayA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgJGZlZWRiYWNrLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcbiAgICAgICAgICAgICRlbG0udGV4dCgkZWxtLmF0dHIoXCJkYXRhLWZlZWRiYWNrXCIpLnJlcGxhY2UoXCJ7ZGVsdGF9XCIsICRpbnN0YW5jZS5pc290b3BlLmZpbHRlcmVkSXRlbXMubGVuZ3RoKSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxufTtcclxuIl19
