!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.simpleIsotope=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"d:\\Web\\simpletope\\source\\clear\\__check.js":[function(require,module,exports){
/**
* _check: Check if we need to enable or disable the clear div without an instance
* @since 0.1.0
*/
module.exports = function() {
    this._onIsotopeChange.call(this, this.instances[this.guid]);
};

},{}],"d:\\Web\\simpletope\\source\\clear\\_check.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\clear\\_createClearers.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\constructor\\jquery.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\constructor\\prototype.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\filter\\_check.js":[function(require,module,exports){
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

            if(container.prop("tagName").toLowerCase() === "select") {

                container.find("["+$dataFilter+"=\""+filter+"\"]").attr('selected','selected');

            } else {

                if(index === 0) {
                    //Remove all active classes first time
                    container.find("["+$dataFilter+"]").removeClass($activeClass);
                }

                //Add active classes
                var active = container.find("["+$dataFilter+"=\""+filter+"\"]").addClass($activeClass);

                if(active.length > 0 && filter != $defaultFilter) {
                    container.find("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
                }

            }
        });

    });

};

},{}],"d:\\Web\\simpletope\\source\\filter\\_createFilters.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\hash\\_formatHash.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\hash\\_getHash.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\hash\\_onHashChanged.js":[function(require,module,exports){
/**
* _onHashChange: fires when location.hash has been changed
* @since 0.1.0
*/
module.exports = function() {
    this._setIsotope.call(this, this.hash._getHash.call(this));
};

},{}],"d:\\Web\\simpletope\\source\\hash\\_setHash.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\simpletope.amd.js":[function(require,module,exports){
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

},{"./clear/__check.js":"d:\\Web\\simpletope\\source\\clear\\__check.js","./clear/_check.js":"d:\\Web\\simpletope\\source\\clear\\_check.js","./clear/_createClearers.js":"d:\\Web\\simpletope\\source\\clear\\_createClearers.js","./constructor/jquery.js":"d:\\Web\\simpletope\\source\\constructor\\jquery.js","./constructor/prototype.js":"d:\\Web\\simpletope\\source\\constructor\\prototype.js","./filter/_check.js":"d:\\Web\\simpletope\\source\\filter\\_check.js","./filter/_createFilters.js":"d:\\Web\\simpletope\\source\\filter\\_createFilters.js","./hash/_formatHash.js":"d:\\Web\\simpletope\\source\\hash\\_formatHash.js","./hash/_getHash.js":"d:\\Web\\simpletope\\source\\hash\\_getHash.js","./hash/_onHashChanged.js":"d:\\Web\\simpletope\\source\\hash\\_onHashChanged.js","./hash/_setHash.js":"d:\\Web\\simpletope\\source\\hash\\_setHash.js","./sorter/_check.js":"d:\\Web\\simpletope\\source\\sorter\\_check.js","./sorter/_createSorters.js":"d:\\Web\\simpletope\\source\\sorter\\_createSorters.js","./text/_feedback.js":"d:\\Web\\simpletope\\source\\text\\_feedback.js"}],"d:\\Web\\simpletope\\source\\sorter\\_check.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\sorter\\_createSorters.js":[function(require,module,exports){
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

},{}],"d:\\Web\\simpletope\\source\\text\\_feedback.js":[function(require,module,exports){
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

},{}]},{},["d:\\Web\\simpletope\\source\\simpletope.amd.js"])("d:\\Web\\simpletope\\source\\simpletope.amd.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic291cmNlL2NsZWFyL19fY2hlY2suanMiLCJzb3VyY2UvY2xlYXIvX2NoZWNrLmpzIiwic291cmNlL2NsZWFyL19jcmVhdGVDbGVhcmVycy5qcyIsInNvdXJjZS9jb25zdHJ1Y3Rvci9qcXVlcnkuanMiLCJzb3VyY2UvY29uc3RydWN0b3IvcHJvdG90eXBlLmpzIiwic291cmNlL2ZpbHRlci9fY2hlY2suanMiLCJzb3VyY2UvZmlsdGVyL19jcmVhdGVGaWx0ZXJzLmpzIiwic291cmNlL2hhc2gvX2Zvcm1hdEhhc2guanMiLCJzb3VyY2UvaGFzaC9fZ2V0SGFzaC5qcyIsInNvdXJjZS9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzIiwic291cmNlL2hhc2gvX3NldEhhc2guanMiLCJzb3VyY2Uvc2ltcGxldG9wZS5hbWQuanMiLCJzb3VyY2Uvc29ydGVyL19jaGVjay5qcyIsInNvdXJjZS9zb3J0ZXIvX2NyZWF0ZVNvcnRlcnMuanMiLCJzb3VyY2UvdGV4dC9fZmVlZGJhY2suanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN0Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDclNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6S0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuKiBfY2hlY2s6IENoZWNrIGlmIHdlIG5lZWQgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIGNsZWFyIGRpdiB3aXRob3V0IGFuIGluc3RhbmNlXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCh0aGlzLCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdKTtcclxufTtcclxuIiwiLyoqXHJcbiogX2NoZWNrOiBDaGVjayBpZiB3ZSBuZWVkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBjbGVhciBkaXYuXHJcbiogQHNpbmNlIDAuMS4wXHJcbiogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuXHJcbiAgICB2YXIgJGNsZWFyRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkZGVmYXVsdEZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcixcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcclxuICAgICAgICAkaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLmNsZWFyQ29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHZhciAkY2xlYXJlcnMgPSBjb250YWluZXI7XHJcblxyXG4gICAgICAgICRjbGVhcmVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgJGhpc3RvcnkgPSAkaW5zdGFuY2UuaXNvdG9wZS5zb3J0SGlzdG9yeTtcclxuXHJcbiAgICAgICAgICAgIGlmKCRpbnN0YW5jZS5pc290b3BlLm9wdGlvbnMuZmlsdGVyICE9ICRkZWZhdWx0RmlsdGVyIHx8ICRoaXN0b3J5WyRoaXN0b3J5Lmxlbmd0aCAtIDFdICE9ICRkZWZhdWx0U29ydCkge1xyXG5cclxuICAgICAgICAgICAgICAgICRlbG0ucmVtb3ZlQ2xhc3MoXCJoaWRlXCIpLnNob3coKTtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJGVsbS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcblxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJGNsZWFyRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkZGVmYXVsdEZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuZmlsdGVyLFxyXG4gICAgICAgICRpbnN0YW5jZSA9IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICQuZWFjaCgkaW5zdGFuY2UuY2xlYXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRjbGVhcmVycyA9IGNvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgJGNsZWFyZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcblxyXG4gICAgICAgICAgICAkZWxtLmhpZGUoKS5yZW1vdmVDbGFzcyhcImhpZGVcIikub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRzZWxmLnVzZUhhc2ggPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZGVmYXVsdEZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICRkZWZhdWx0RmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICRkZWZhdWx0U29ydFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJGVsbS5oaWRlKCk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuICAgIH0pO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgJGFyZ3MgPSBhcmd1bWVudHNbMF0gfHwge30sXG4gICAgICAgIGluc3RhbmNlcyA9IFtdO1xuXG4gICAgaWYodHlwZW9mIHdpbmRvdy5Jc290b3BlICE9IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBhbGVydChcInNpbXBsZUlzb3RvcGU6IElzb3RvcGUuSlMgY291bGRuJ3QgYmUgZm91bmQuIFBsZWFzZSBpbmNsdWRlICdpc290b3BlLnBrZ2QubWluLmpzJy5cIilcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICQuZWFjaCh0aGlzLCBmdW5jdGlvbihpZHgsIGVsbSkge1xuICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgICAgY29udGFpbmVyOiAkKGVsbSksXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIGl0ZW1TZWxlY3RvcjogJy5pdGVtJyxcbiAgICAgICAgICAgICAgICBkYXRhU2VsZWN0b3JzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJ2RhdGEtZmlsdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5OiAnZGF0YS1zb3J0LWJ5JyxcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5U2VsZWN0b3I6ICdkYXRhLXNvcnQtc2VsZWN0b3InLFxuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyZWN0aW9uOiAnZGF0YS1zb3J0LWRpcmVjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGZvckNvbnRhaW5lcjogJ2RhdGEtZm9yLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyRmlsdGVyOiAnZGF0YS1jbGVhci1maWx0ZXInLFxuICAgICAgICAgICAgICAgICAgICBmZWVkYmFjazogJ2RhdGEtZmVlZGJhY2snLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0YS1maWx0ZXItdHlwZScsXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlck1ldGhvZDogJ2RhdGEtZmlsdGVyLW1ldGhvZCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IFwib3JpZ2luYWwtb3JkZXJcIixcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiAnYWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKG5ldyAkLnNpbXBsZUlzb3RvcGUoJC5leHRlbmQob2JqLCAkYXJncykpKTtcbiAgICB9KTtcblxuICAgICQuZWFjaChpbnN0YW5jZXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgICAgIGVsbS5zb3J0ZXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0uZmlsdGVyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLmNsZWFyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLnRleHQuX2ZlZWRiYWNrLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLmNsZWFyLl9fY2hlY2suY2FsbChlbG0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlcztcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGFyZ3Mpe1xuICAgICQuZXh0ZW5kKHRoaXMsICRhcmdzKTtcblxuICAgIHZhciAkc2VsZiA9IHRoaXMsXG4gICAgICAgIHRoZUhhc2ggPSB0aGlzLmhhc2guX2dldEhhc2guY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuX2dldEZpbHRlclRlc3RPcmdpbmFsID0gSXNvdG9wZS5wcm90b3R5cGUuX2dldEZpbHRlclRlc3Q7XG4gICAgSXNvdG9wZS5wcm90b3R5cGUuX2dldEZpbHRlclRlc3QgPSB0aGlzLl9nZXRGaWx0ZXJUZXN0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmd1aWQgPSB0aGlzLmNvbnRhaW5lci5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG5cbiAgICB0aGlzLmZpbHRlck11bHRpcGxlID0gdGhpcy5jb250YWluZXIuYXR0cih0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMudHlwZSkgfHwgXCJcIjtcbiAgICB0aGlzLmZpbHRlck11bHRpcGxlID0gKHRoaXMuZmlsdGVyTXVsdGlwbGUudG9Mb3dlckNhc2UoKSA9PSBcIm11bHRpcGxlXCIpO1xuXG4gICAgdGhpcy5maWx0ZXJNZXRob2QgPSB0aGlzLmNvbnRhaW5lci5hdHRyKHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXJNZXRob2QpIHx8IFwiXCI7XG4gICAgdGhpcy5maWx0ZXJNZXRob2QgPSB0aGlzLmZpbHRlck1ldGhvZC50b0xvd2VyQ2FzZSgpO1xuXG4gICAgdGhpcy5lbmNvZGVVUkkgPSBmYWxzZTtcblxuICAgIC8vRmlyc3QgdGltZSBpbml0IGlzb3RvcGVcbiAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdID0ge1xuICAgICAgICBpc290b3BlOiBuZXcgSXNvdG9wZSh0aGlzLmNvbnRhaW5lci5jb250ZXh0LCB7XG4gICAgICAgICAgICBmaWx0ZXI6IHRoZUhhc2ggfHwgXCIqXCIsXG4gICAgICAgICAgICBpdGVtU2VsZWN0b3I6ICRzZWxmLnNldHRpbmdzLml0ZW1TZWxlY3RvciB8fCAnLml0ZW0nLFxuICAgICAgICAgICAgbGF5b3V0TW9kZTogJHNlbGYuY29udGFpbmVyLmRhdGEoXCJsYXlvdXRcIikgfHwgXCJmaXRSb3dzXCIsXG4gICAgICAgICAgICBnZXRTb3J0RGF0YTogJHNlbGYuX2dldFNvcnREYXRhKClcbiAgICAgICAgfSksXG4gICAgICAgIGZpbHRlckNvbnRhaW5lcjoge30sXG4gICAgICAgIHNvcnRDb250YWluZXI6IHt9LFxuICAgICAgICBjbGVhckNvbnRhaW5lcjoge30sXG4gICAgICAgIGZlZWRiYWNrQ29udGFpbmVyOiB7fVxuICAgIH07XG5cbiAgICB0aGlzLl9zZXRDb250YWluZXJzKHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZSk7XG5cbiAgICBpZih0aGlzLmNvbnRhaW5lci5kYXRhKFwiaGFzaFwiKSAhPT0gbnVsbCAmJiB0aGlzLmNvbnRhaW5lci5kYXRhKFwiaGFzaFwiKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudXNlSGFzaCA9IHRydWU7XG4gICAgfVxuXG4gICAgaWYod2luZG93LmltYWdlc0xvYWRlZCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMuY29udGFpbmVyLmltYWdlc0xvYWRlZCggZnVuY3Rpb24oKSB7XG4gICAgICAgICAgICAkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uaXNvdG9wZS5sYXlvdXQoKTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgLy9BZGQgaGFzaCBzdXBwb3J0XG4gICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgdGhpcy5oYXNoLl9vbkhhc2hDaGFuZ2VkLmJpbmQodGhpcykpO1xuXG4gfTtcbiIsIi8qKlxuICogX2NoZWNrQWN0aXZlOiBDaGVjayBpZiBidXR0b25zIG5lZWQgYW4gYWN0aXZlIGNsYXNzXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBwYXJhbSB7b2JqZWN0fSAkaW5zdGFuY2VcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xuXG4gICAgdmFyICRkYXRhRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcixcbiAgICAgICAgJGRlZmF1bHRGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmZpbHRlcixcbiAgICAgICAgJGluc3RhbmNlID0gJGluc3RhbmNlIHx8IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmU7XG5cbiAgICAkLmVhY2goJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIuc3BsaXQoXCIsXCIpLCBmdW5jdGlvbiggaW5kZXgsIGZpbHRlciApIHtcblxuICAgICAgICAkLmVhY2goJGluc3RhbmNlLmZpbHRlckNvbnRhaW5lciwgZnVuY3Rpb24oIGlkeCwgY29udGFpbmVyICkge1xuXG4gICAgICAgICAgICBpZihjb250YWluZXIucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PT0gXCJzZWxlY3RcIikge1xuXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmZpbmQoXCJbXCIrJGRhdGFGaWx0ZXIrXCI9XFxcIlwiK2ZpbHRlcitcIlxcXCJdXCIpLmF0dHIoJ3NlbGVjdGVkJywnc2VsZWN0ZWQnKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgICAgIGlmKGluZGV4ID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vUmVtb3ZlIGFsbCBhY3RpdmUgY2xhc3NlcyBmaXJzdCB0aW1lXG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vQWRkIGFjdGl2ZSBjbGFzc2VzXG4gICAgICAgICAgICAgICAgdmFyIGFjdGl2ZSA9IGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIitmaWx0ZXIrXCJcXFwiXVwiKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgICAgICAgICAgaWYoYWN0aXZlLmxlbmd0aCA+IDAgJiYgZmlsdGVyICE9ICRkZWZhdWx0RmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRhaW5lci5maW5kKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIiskZGVmYXVsdEZpbHRlcitcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgfSk7XG5cbn07XG4iLCIvKipcclxuKiBfY3JlYXRlRmlsdGVyczogY3JlYXRlIGJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKiBAdXBkYXRlZCAwLjIuMVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5maWx0ZXJDb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgdmFyICRmaWx0ZXJzID0gY29udGFpbmVyLmZpbmQoJ1snKyRkYXRhRmlsdGVyKyddJyk7XHJcblxyXG4gICAgICAgICRmaWx0ZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICBob3cgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/IFwiY2hhbmdlXCIgOiBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyAkZWxtLmNsb3Nlc3QoXCJzZWxlY3RcIikgOiAkZWxtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaG93LmVsZW1lbnQub24oaG93LmV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGhvdy5ldmVudE5hbWUgPT0gXCJjaGFuZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGhvdy5lbGVtZW50LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdICE9IGVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkZGF0YUZpbHRlckF0dHIgPSAkZWxtLmF0dHIoJGRhdGFGaWx0ZXIpLFxyXG4gICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRkYXRhRmlsdGVyQXR0cixcclxuICAgICAgICAgICAgICAgICAgICB2YWwgPSAkZGF0YUZpbHRlckF0dHI7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZS5pc290b3BlLCAkZmlsdGVyVmFsdWUpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRzZWxmLmZpbHRlck11bHRpcGxlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlciA9PT0gXCIqXCIgfHwgJGZpbHRlclZhbHVlID09PSBcIipcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9EbyBub3RoaW5nXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZigkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlci5pbmRleE9mKCRmaWx0ZXJWYWx1ZSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkaW5zdGFuY2UuaXNvdG9wZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUucHVzaCh2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGZpbHRlclZhbHVlLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGluc3RhbmNlLmlzb3RvcGUub3B0aW9ucy5maWx0ZXIuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlLnNwbGljZSgkZmlsdGVyVmFsdWUuaW5kZXhPZih2YWwpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRmaWx0ZXJWYWx1ZS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJGZpbHRlclZhbHVlID09PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSBcIipcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGluc3RhbmNlLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJGZpbHRlclZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuIiwiLyoqXG4qIF9mb3JtYXRIYXNoOiBGb3JtYXQgbXVsdGlwbGUgZmlsdGVycyBpbnRvIG9uZSBzdHJpbmcgYmFzZWQgb24gYSByZWd1bGFyIGV4cHJlc3Npb25cbiogQHNpbmNlIDAuMS4wXG4qIEBwYXJhbSB7cmVnZXh9IHJlXG4qIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlLCBzdHIpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IHt9LFxuICAgICAgICBtYXRjaDtcblxuICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKHN0cikpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKG1hdGNoLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWF0Y2hbM10gIT09IG51bGwgJiYgbWF0Y2hbM10gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzNdXSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYobWF0Y2hlc1ttYXRjaFsxXV0gPT0gbnVsbCB8fCBtYXRjaGVzW21hdGNoWzFdXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFsxXV0ucHVzaChtYXRjaFsyXSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXM7XG59O1xuIiwiLyoqXG4gKiBfZ2V0SGFzaDogR2V0IHdpbmRvdy5sb2NhdGlvbi5oYXNoIGFuZCBmb3JtYXQgaXQgZm9yIElzb3RvcGVcbiAqIEBzaW5jZSAwLjEuMFxuICovXG5cbiBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGZhbHNlLFxuICAgICAgICAkbmV3SGFzaCA9IFwiXCI7XG5cbiAgICAkaGFzaCA9ICgkaGFzaCAhPT0gZmFsc2UgJiYgJGhhc2ggIT0gXCIjXCIgJiYgJGhhc2ggIT0gXCJcIikgPyBkZWNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhhc2gpIDogJyonO1xuXG4gICAgLy9SZW1vdmUgaGFzaCBmcm9tIGZpcnN0IGNoYXJhY3RlciBpZiBpdHMgZXhpc3RcbiAgICBpZiAoJGhhc2guY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgICRoYXNoID0gJGhhc2guc2xpY2UoMSk7XG4gICAgfVxuXG4gICAgdmFyIGhhc2hBcnJheSA9ICRoYXNoLnNwbGl0KFwiJlwiKTtcbiAgICAkLmVhY2goaGFzaEFycmF5LCBmdW5jdGlvbihrZXksICRwYXJ0SGFzaCkge1xuXG4gICAgICAgIGlmKCRwYXJ0SGFzaC5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIHtcblxuICAgICAgICAgICAgdmFyIHRtcCA9ICRwYXJ0SGFzaC5zcGxpdChcIj1cIiksXG4gICAgICAgICAgICAgICAgYXJyID0gW107XG5cbiAgICAgICAgICAgIGlmKHRtcC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB0bXBbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IHRtcFsxXS5yZXBsYWNlKC9cXCcvZywgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goXCJbZGF0YS1cIiArIG5hbWUgKyBcIj0nXCIgKyB2YWx1ZXNbaV0gKyBcIiddXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gJChcIltkYXRhLWZpbHRlcj1cXFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVxcXCJdXCIpLmFkZENsYXNzKCRzZWxmLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJG5ld0hhc2ggKz0gYXJyLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbmV3SGFzaCArPSAoJHBhcnRIYXNoID09IFwiKlwiIHx8ICRwYXJ0SGFzaC5jaGFyQXQoMCkgPT0gJy4nKSA/ICRwYXJ0SGFzaDogXCIuXCIgKyAkcGFydEhhc2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZihrZXkgIT0gKGhhc2hBcnJheS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgJG5ld0hhc2ggKz0gXCIsXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgIHJldHVybiAkbmV3SGFzaDtcblxuIH07XG4iLCIvKipcclxuKiBfb25IYXNoQ2hhbmdlOiBmaXJlcyB3aGVuIGxvY2F0aW9uLmhhc2ggaGFzIGJlZW4gY2hhbmdlZFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fc2V0SXNvdG9wZS5jYWxsKHRoaXMsIHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpKTtcclxufTtcclxuIiwiLyoqXG4gKiBfc2V0SGFzaDogU2V0IGEgbmV3IGxvY2F0aW9uLmhhc2ggYWZ0ZXIgZm9ybWF0dGluZyBpdFxuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gJG5ld0hhc2hcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSwgJG5ld0hhc2gpIHtcbiAgICB2YXIgJGN1cnJlbnRIYXNoID0gKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlciA9PSBcIipcIikgPyBcIlwiIDogJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyLFxuICAgICAgICAkY29tYmluZWRIYXNoO1xuXG4gICAgaWYoJG5ld0hhc2ggIT0gXCIqXCIpIHtcblxuICAgICAgICBpZigkY3VycmVudEhhc2guaW5kZXhPZigkbmV3SGFzaCkgPT09IC0xKSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoICsgJG5ld0hhc2g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoLnJlcGxhY2UoJG5ld0hhc2gsIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRmb3JtYXR0ZWRIYXNoID0gdGhpcy5oYXNoLl9mb3JtYXRIYXNoKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXXwoLltBLVphLXowLTldKykvZywgJGNvbWJpbmVkSGFzaCksXG4gICAgICAgICAgICAkZW5kSGFzaCA9IFtdO1xuXG4gICAgICAgICQuZWFjaCgkZm9ybWF0dGVkSGFzaCwgZnVuY3Rpb24oa2V5LCBlbG0pIHtcbiAgICAgICAgICAgIGlmKGVsbSA9PT0gdHJ1ZSkgey8vaXNDbGFzc1xuICAgICAgICAgICAgICAgICRlbmRIYXNoLnB1c2goIChrZXkuY2hhckF0KDApID09ICcuJykgPyBrZXkuc2xpY2UoMSkgOiBrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7Ly9pc09iamVjdFxuICAgICAgICAgICAgICAgICRlbmRIYXNoLnB1c2goa2V5ICsgXCI9XCIgKyBlbG0uam9pbihcIixcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkZW5kSGFzaCA9ICRlbmRIYXNoLmpvaW4oXCImXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRlbmRIYXNoID0gJG5ld0hhc2g7XG4gICAgfVxuXG4gICAgaWYoJGVuZEhhc2ggPT0gXCIqXCIgfHwgJGVuZEhhc2ggPT0gXCJcIikge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAodGhpcy5lbmNvZGVVUkkgPT09IHRydWUpID8gZW5jb2RlVVJJQ29tcG9uZW50KCRlbmRIYXNoKSA6ICRlbmRIYXNoO1xuICAgIH1cblxuICAgIHJldHVybiAkZW5kSGFzaDtcbn07XG4iLCJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XHJcblxyXG4kLnNpbXBsZUlzb3RvcGUgPSByZXF1aXJlKFwiLi9jb25zdHJ1Y3Rvci9wcm90b3R5cGUuanNcIik7XHJcblxyXG4kLnNpbXBsZUlzb3RvcGUucHJvdG90eXBlID0ge1xyXG4gICAgaW5zdGFuY2VzOiB7fSxcclxuICAgIGNvbnN0cnVjdG9yOiAkLnNpbXBsZUlzb3RvcGUsXHJcblxyXG4gICAgaGFzaDoge1xyXG4gICAgICAgIF9nZXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19nZXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9zZXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19zZXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9mb3JtYXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19mb3JtYXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9vbkhhc2hDaGFuZ2VkOiByZXF1aXJlKFwiLi9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL2ZpbHRlci9fY3JlYXRlRmlsdGVycy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL2ZpbHRlci9fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICBzb3J0ZXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vc29ydGVyL19jcmVhdGVTb3J0ZXJzLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vc29ydGVyL19jaGVjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIGNsZWFyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL2NsZWFyL19jcmVhdGVDbGVhcmVycy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19jaGVjay5qc1wiKSxcclxuICAgICAgICBfX2NoZWNrOiByZXF1aXJlKFwiLi9jbGVhci9fX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgdGV4dDoge1xyXG4gICAgICAgIF9mZWVkYmFjazogcmVxdWlyZShcIi4vdGV4dC9fZmVlZGJhY2suanNcIilcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9zZXRDb250YWluZXJzOiBTZXQgdGhlIGZpbHRlcnMvc29ydGVycy9jbGVhciBjb250YWluZXJzIHRvIHRoZSByaWdodCBJc290b3BlIGNvbnRhaW5lclxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9zZXRDb250YWluZXJzOiBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuICAgICAgICB2YXIgJHNlbGYgPSB0aGlzLFxyXG4gICAgICAgICAgICBzaCA9ICRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXTtcclxuXHJcbiAgICAgICAgJC5lYWNoKCQoJ1tkYXRhLWZpbHRlcl0sIFtkYXRhLXNvcnQtYnldLCBbZGF0YS1jbGVhci1maWx0ZXJdLCBbZGF0YS1mZWVkYmFja10nKSwgZnVuY3Rpb24oaW5kLCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICBmaWx0ZXJDb250YWluZXIgPSAkc2VsZi5fY3JlYXRlVW5pcXVlQ29udGFpbmVySWQoJGVsbSk7XHJcblxyXG4gICAgICAgICAgICBpZiggJGVsbS5hdHRyKCdkYXRhLWZpbHRlcicpICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBzaC5maWx0ZXJDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9ICQoZmlsdGVyQ29udGFpbmVyLmVsbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICRlbG0uYXR0cignZGF0YS1zb3J0LWJ5JykgIT09IHVuZGVmaW5lZCApIHtcclxuICAgICAgICAgICAgICAgIHNoLnNvcnRDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9ICQoZmlsdGVyQ29udGFpbmVyLmVsbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICRlbG0uYXR0cignZGF0YS1jbGVhci1maWx0ZXInKSAhPT0gdW5kZWZpbmVkICkge1xyXG4gICAgICAgICAgICAgICAgc2guY2xlYXJDb250YWluZXJbZmlsdGVyQ29udGFpbmVyLmlkXSA9ICQoZmlsdGVyQ29udGFpbmVyLmVsbSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoICRlbG0uYXR0cignZGF0YS1mZWVkYmFjaycpICE9PSB1bmRlZmluZWQgKSB7XHJcbiAgICAgICAgICAgICAgICBzaC5mZWVkYmFja0NvbnRhaW5lcltmaWx0ZXJDb250YWluZXIuaWRdID0gJChmaWx0ZXJDb250YWluZXIuZWxtKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX2NyZWF0ZVVuaXF1ZUNvbnRhaW5lcklkOiBHZXQgYW4gaWQgb3IgZmFsbGJhY2sgdG8gYSBwYXJlbnQgZGl2XHJcbiAgICAqIEBzaW5jZSAwLjIuMVxyXG4gICAgKiBAcGFyYW0ge29iamVjdH0gJGVsbVxyXG4gICAgKi9cclxuICAgIF9jcmVhdGVVbmlxdWVDb250YWluZXJJZDogZnVuY3Rpb24oJGVsbSkge1xyXG4gICAgICAgIHZhciB0bXBFbG07XHJcblxyXG4gICAgICAgIC8vR2V0IHRoZSBjbG9zZXN0IGNvbnRhaW5lciB3aXRoIGF0dHJpYnV0ZSBkYXRhLWZvci1jb250YWluZXJcclxuICAgICAgICB2YXIgZmlsdGVyQ29udGFpbmVySWQgPSAkZWxtLmNsb3Nlc3QoJ1tkYXRhLWZvci1jb250YWluZXJdJyk7XHJcbiAgICAgICAgaWYoIGZpbHRlckNvbnRhaW5lcklkLmxlbmd0aCA+IDAgKSB7XHJcbiAgICAgICAgICAgIHRtcEVsbSA9IGZpbHRlckNvbnRhaW5lcklkWzBdO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAvL05vIHBhcmVudHMgd2l0aCBkYXRhIGF0dHJpYnV0ZSBmb3VuZCwgbGV0cyB0cnkgc29tZXRoaW5nIGVsc2VcclxuICAgICAgICAgICAgZmlsdGVyQ29udGFpbmVySWQgPSAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/ICRlbG0ucGFyZW50KCdzZWxlY3QnKSA6ICRlbG0ucGFyZW50cygnZGl2W2lkXScpO1xyXG4gICAgICAgICAgICBpZiggZmlsdGVyQ29udGFpbmVySWQubGVuZ3RoID4gMCApIHtcclxuICAgICAgICAgICAgICAgIHRtcEVsbSA9IGZpbHRlckNvbnRhaW5lcklkWzBdO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgICAgIC8vTm8gaWQgb3Igc2VsZWN0IHBhcmVudCBmb3VuZDogbGV0cyBqdXN0IHVzZSB0aGUgcGFyZW50LCBldmVydHl0aGluZyBmYWlsZWRcclxuICAgICAgICAgICAgICAgIGZpbHRlckNvbnRhaW5lcklkID0gJGVsbS5wYXJlbnQoKTtcclxuICAgICAgICAgICAgICAgIGlmKCBmaWx0ZXJDb250YWluZXJJZC5sZW5ndGggPiAwICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHRtcEVsbSA9IGZpbHRlckNvbnRhaW5lcklkWzBdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAvL01ham9yIGZhaWw7IHRoaXMgc2hvdWxkbid0IGdldCBjYWxsZWRcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZDogbmV3IERhdGUoKS5nZXRUaW1lKCksXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsbTogdG1wRWxtXHJcbiAgICAgICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgZm9ybWF0dGVkID0gJCh0bXBFbG0pLnRleHQoKS50cmltKCkucmVwbGFjZSgvW14hYS16QS1aMC05XS9nLCBcIlwiKTtcclxuICAgICAgICBpZiggZm9ybWF0dGVkID09PSBcIlwiICkge1xyXG4gICAgICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICAgICAgaWQ6IG5ldyBEYXRlKCkuZ2V0VGltZSgpLFxyXG4gICAgICAgICAgICAgICAgZWxtOiB0bXBFbG1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIGlkOiBmb3JtYXR0ZWQsXHJcbiAgICAgICAgICAgIGVsbTogdG1wRWxtXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfb25CZWZvcmVJc290b3BlQ2hhbmdlOiBmaXJlcyBiZWZvcmUgdGhlIElzb3RvcGUgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWRcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuICAgICovXHJcbiAgICBfb25CZWZvcmVJc290b3BlQ2hhbmdlOiBmdW5jdGlvbigkaW5zdGFuY2UpIHt9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfb25Jc290b3BlQ2hhbmdlOiBmaXJlcyB3aGVuIHRoZSBJc290b3BlIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiAgICAqL1xyXG4gICAgX29uSXNvdG9wZUNoYW5nZTogZnVuY3Rpb24oJGluc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy5maWx0ZXIuX2NoZWNrLmNhbGwodGhpcywgJGluc3RhbmNlKTtcclxuICAgICAgICB0aGlzLnNvcnRlci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICB0aGlzLmNsZWFyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZS5pc290b3BlKTtcclxuICAgICAgICB0aGlzLnRleHQuX2ZlZWRiYWNrLmNhbGwodGhpcywgJGluc3RhbmNlLmlzb3RvcGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX3NldElzb3RvcGU6IFJlY29uZmlndXJlIGlzb3RvcGVcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkc2VsZWN0b3JcclxuICAgICovXHJcbiAgICBfc2V0SXNvdG9wZTogZnVuY3Rpb24oJHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICBmaWx0ZXI6ICRzZWxlY3RvclxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UodGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogX2dldFNvcnREYXRhOiBHZXQgdGhlIGRhdGEtc29ydC1ieSBhdHRyaWJ1dGVzIGFuZCBtYWtlIHRoZW0gaW50byBhbiBJc290b3BlIFwiZ2V0U29ydERhdGFcIiBvYmplY3RcclxuICAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgICovXHJcbiAgICBfZ2V0U29ydERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciAkc29ydERhdGEgPSB7fSxcclxuICAgICAgICAgICAgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICAgICAkZGF0YVNvcnRCeVNlbGVjdG9yID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeVNlbGVjdG9yLFxyXG4gICAgICAgICAgICAkZGF0YVNvcnRCeURlZmF1bHQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQ7XHJcblxyXG4gICAgICAgICQoJ1snICsgJGRhdGFTb3J0QnkgKyAnXSwgWycgKyAkZGF0YVNvcnRCeVNlbGVjdG9yICsgJ10nKS5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgJG5hbWUgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICAkc2VsZWN0b3IgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnlTZWxlY3RvcikgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmKCRuYW1lICE9ICRkYXRhU29ydEJ5RGVmYXVsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYoJG5hbWUgIT09IG51bGwgJiYgJHNlbGVjdG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnREYXRhWyRuYW1lXSA9ICRzZWxlY3RvcjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJJc290b3BlIHNvcnRpbmc6IFwiKyRkYXRhU29ydEJ5K1wiIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiIGFyZSByZXF1aXJlZC4gQ3VycmVudGx5IGNvbmZpZ3VyZWQgXCIrJGRhdGFTb3J0QnkrXCI9J1wiICsgJG5hbWUgKyBcIicgYW5kIFwiKyRkYXRhU29ydEJ5U2VsZWN0b3IrXCI9J1wiICsgJHNlbGVjdG9yICsgXCInXCIpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAkc29ydERhdGE7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfZ2V0SW5zdGFuY2VzXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKi9cclxuICAgIF9nZXRJbnN0YW5jZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0bXAgPSBbXTtcclxuXHJcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5zdGFuY2VzLCBmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgICAgICB0bXAucHVzaChlbG0uaXNvdG9wZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0bXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfZ2V0RWxlbWVudEZyb21EYXRhQXR0cmlidXRlXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAdXBkYXRlIDAuMi4xXHJcbiAgICAqL1xyXG4gICAgX2dldEVsZW1lbnRGcm9tRGF0YUF0dHJpYnV0ZTogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgJHRtcDtcclxuXHJcbiAgICAgICAgaWYoc2VsZWN0b3IgPT09IFwiXCIgfHwgc2VsZWN0b3IgPT09IGZhbHNlIHx8IHNlbGVjdG9yID09PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2VsZWN0b3IgaW5zdGFuY2VvZiBqUXVlcnkpIHtcclxuICAgICAgICAgICAgcmV0dXJuIHNlbGVjdG9yO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoc2VsZWN0b3IuY2hhckF0KDApID09PSBcIiNcIiB8fCBzZWxlY3Rvci5jaGFyQXQoMCkgPT09IFwiLlwiKSB7XHRcdFx0XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoXCIjXCIpICE9PSAtMSB8fCBzZWxlY3Rvci5pbmRleE9mKFwiLlwiKSAhPT0gLTEpIHtcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZihcIiBcIikgIT09IC0xKSB7XHRcdFx0XHRcdFx0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vZXZ1bGF0ZSB0aGUgc3RyaW5nIGFzIGFuIGlkXHJcbiAgICAgICAgICAgICR0bXAgPSAkKFwiI1wiICsgc2VsZWN0b3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoJHRtcC5sZW5ndGggPT09IDApIHtcclxuICAgICAgICAgICAgLy8gdGhyb3cgbmV3IEVycm9yKFwic2ltcGxldG9wZTogV2UgY2Fubm90IGZpbmQgYW55IERPTSBlbGVtZW50IHdpdGggdGhlIENTUyBzZWxlY3RvcjogJ1wiICsgc2VsZWN0b3IgKyBcIidcIik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4gJHRtcDtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG5cclxuICAgIF9nZXRGaWx0ZXJUZXN0OiBmdW5jdGlvbihmaWx0ZXIpIHtcclxuICAgICAgICB2YXIgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGl0ZW0gKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZmlsdGVycyA9IGZpbHRlci5zcGxpdChcIixcIiksXHJcbiAgICAgICAgICAgICAgICBhY3RpdmUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZmlsdGVyc1tpXS5pbmRleE9mKFwiZGF0YS1cIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXQgPSBmaWx0ZXJzW2ldLnJlcGxhY2UoL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csIFwiJDFcIikudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGZpbHRlcnNbaV0ucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMlwiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkgIT09IHVuZGVmaW5lZCAmJiBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApLmluZGV4T2YoIHZhbHVlICkgIT09IC0xICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmlzKCBmaWx0ZXJzW2ldICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKGZpbHRlcnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZigkc2VsZi5maWx0ZXJNZXRob2QgPT0gXCJvclwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA9PSBmaWx0ZXJzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgIH1cclxuXHJcbn07XHJcblxyXG4kLmZuLnNpbXBsZUlzb3RvcGUgPSByZXF1aXJlKFwiLi9jb25zdHJ1Y3Rvci9qcXVlcnkuanNcIik7XHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQuZWFjaCgkKFwiW2RhdGEtaXNvdG9wZV1cIiksIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgJChlbG0pLnNpbXBsZUlzb3RvcGUoKTtcclxuICAgIH0pO1xyXG59KTtcclxuXHJcbi8vIEFkZCBiaW5kIHN1cHBvcnRcclxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUuYmluZCkge1xyXG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ob1RoaXMpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAvLyBjbG9zZXN0IHRoaW5nIHBvc3NpYmxlIHRvIHRoZSBFQ01BU2NyaXB0IDVcclxuICAgICAgLy8gaW50ZXJuYWwgSXNDYWxsYWJsZSBmdW5jdGlvblxyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCAtIHdoYXQgaXMgdHJ5aW5nIHRvIGJlIGJvdW5kIGlzIG5vdCBjYWxsYWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBhQXJncyAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcclxuICAgICAgICBmVG9CaW5kID0gdGhpcyxcclxuICAgICAgICBmTk9QICAgID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICBmQm91bmQgID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBmVG9CaW5kLmFwcGx5KHRoaXMgaW5zdGFuY2VvZiBmTk9QICYmIG9UaGlzID8gdGhpcyA6IG9UaGlzLCBhQXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgZk5PUC5wcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcclxuICAgIGZCb3VuZC5wcm90b3R5cGUgPSBuZXcgZk5PUCgpO1xyXG5cclxuICAgIHJldHVybiBmQm91bmQ7XHJcbiAgfTtcclxufVxyXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS50cmltKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICB9O1xyXG59XHJcbiIsIi8qKlxuICogX2NoZWNrQWN0aXZlOiBDaGVjayBpZiBidXR0b25zIG5lZWQgYW4gYWN0aXZlIGNsYXNzXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBwYXJhbSB7b2JqZWN0fSAkaW5zdGFuY2VcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xuXG4gICAgdmFyICRkYXRhU29ydCA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcbiAgICAgICAgJGluc3RhbmNlID0gJGluc3RhbmNlIHx8IHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0sXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmUsXG4gICAgICAgICRzb3J0SGlzdG9yeSA9ICRpbnN0YW5jZS5pc290b3BlLnNvcnRIaXN0b3J5O1xuXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5zb3J0Q29udGFpbmVyLCBmdW5jdGlvbiggaWR4LCBjb250YWluZXIgKSB7XG5cbiAgICAgICAgLy9SZW1vdmUgYWxsIGFjdGl2ZSBjbGFzc2VzIGZpcnN0IHRpbWVcbiAgICAgICAgY29udGFpbmVyLmZpbmQoXCJbXCIrJGRhdGFTb3J0K1wiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgIC8vQWRkIGFjdGl2ZSBjbGFzc2VzXG4gICAgICAgIHZhciBhY3RpdmUgPSBjb250YWluZXIuZmluZChcIltcIiskZGF0YVNvcnQrXCI9XFxcIlwiKyAkc29ydEhpc3RvcnlbMF0gK1wiXFxcIl1cIikuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcblxuICAgICAgICBpZihhY3RpdmUubGVuZ3RoID4gMCAmJiAkc29ydEhpc3RvcnlbMF0gIT0gJGRlZmF1bHRTb3J0KSB7XG4gICAgICAgICAgICBjb250YWluZXIuZmluZChcIltcIiskZGF0YVNvcnQrXCI9XFxcIlwiKyRkZWZhdWx0U29ydCtcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG59O1xuIiwiLyoqXHJcbiogX2NyZWF0ZUJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICRkYXRhU29ydERpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkc29ydEFycmF5ID0gW10sXHJcbiAgICAgICAgJGluc3RhbmNlID0gdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5zb3J0Q29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHZhciAkc29ydGVycyA9IGNvbnRhaW5lci5maW5kKCdbJyskZGF0YVNvcnRCeSsnXScpO1xyXG5cclxuICAgICAgICAkc29ydGVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgJGRhdGFTb3J0QXR0ciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeSksXHJcbiAgICAgICAgICAgICAgICBob3cgPSB7XHJcbiAgICAgICAgICAgICAgICAgICAgZXZlbnROYW1lOiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/IFwiY2hhbmdlXCIgOiBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgZWxlbWVudDogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyAkZWxtLmNsb3Nlc3QoXCJzZWxlY3RcIikgOiAkZWxtXHJcbiAgICAgICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaG93LmVsZW1lbnQub24oaG93LmV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGhvdy5ldmVudE5hbWUgPT0gXCJjaGFuZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGhvdy5lbGVtZW50LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdICE9IGVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkc29ydEJ5VmFsdWUgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmKCRzZWxmLmZpbHRlck11bHRpcGxlICE9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJGRhdGFTb3J0QXR0ciA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkucHVzaCgkZGF0YVNvcnRBdHRyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkuc3BsaWNlKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRlZmF1bHRTb3J0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRzb3J0QXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRhdGFTb3J0QXR0cjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJHNvcnRBc2MgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKSAhPT0gbnVsbCAmJiAkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikudG9Mb3dlckNhc2UoKSA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0QnkpID09ICRkZWZhdWx0U29ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkaW5zdGFuY2UuaXNvdG9wZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICRzb3J0QnlWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICBzb3J0QXNjZW5kaW5nOiAkc29ydEFzY1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcblxyXG4gICAgLy8gdmFyICRzb3J0ZXJzID0gJCgnWycrdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSsnXScpLC8vR2V0IGFsbCBzb3J0IGVsZW1lbnRzXHJcbiAgICAvLyAgICAgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgLy8gICAgICRkYXRhRm9yQ29udGFpbmVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZvckNvbnRhaW5lcixcclxuICAgIC8vICAgICAkZGF0YVNvcnREaXJlY3Rpb24gPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydERpcmVjdGlvbixcclxuICAgIC8vICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAvLyAgICAgJHNvcnRBcnJheSA9IFtdLFxyXG4gICAgLy8gICAgICRzZWxmID0gdGhpcztcclxuICAgIC8vXHJcbiAgICAvLyAkc29ydGVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAvLyAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIHZhciAkc29ydENvbnRhaW5lciA9ICAgJGVsbS5jbG9zZXN0KCdbJyskZGF0YUZvckNvbnRhaW5lcisnXScpLFxyXG4gICAgLy8gICAgICAgICAkY29udGFpbmVyID0gICAgICAgKCRzb3J0Q29udGFpbmVyLmxlbmd0aCA9PSAwKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3Rvcigkc29ydENvbnRhaW5lci5hdHRyKCRkYXRhRm9yQ29udGFpbmVyKSksXHJcbiAgICAvLyAgICAgICAgICRkYXRhU29ydEF0dHIgPSAgICAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpLFxyXG4gICAgLy8gICAgICAgICBzb3J0Q29udGFpbmVySWQgPSAgKCRzb3J0Q29udGFpbmVyLmF0dHIoXCJpZFwiKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgIGlmKCRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5zb3J0Q29udGFpbmVyW3NvcnRDb250YWluZXJJZF0gPT0gbnVsbCkge1xyXG4gICAgLy8gICAgICAgICAkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uc29ydENvbnRhaW5lcltzb3J0Q29udGFpbmVySWRdID0gJHNvcnRDb250YWluZXI7XHJcbiAgICAvLyAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICB2YXIgaG93ID0ge1xyXG4gICAgLy8gICAgICAgICBldmVudE5hbWU6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gXCJjaGFuZ2VcIiA6IFwiY2xpY2tcIixcclxuICAgIC8vICAgICAgICAgZWxlbWVudDogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyAkZWxtLmNsb3Nlc3QoXCJzZWxlY3RcIikgOiAkZWxtXHJcbiAgICAvLyAgICAgfTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgaWYoaG93LmVsZW1lbnQuZGF0YShcImlzLXNldFwiKSAhPSBcInRydWVcIikge1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgaG93LmVsZW1lbnQub24oaG93LmV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xyXG4gICAgLy8gICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIGlmKGhvdy5ldmVudE5hbWUgPT0gXCJjaGFuZ2VcIikge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmKGhvdy5lbGVtZW50LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdICE9IGVsbSkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIHZhciAkc29ydEJ5VmFsdWUgPSAnJztcclxuICAgIC8vICAgICAgICAgICAgIGlmKCRzZWxmLmZpbHRlck11bHRpcGxlICE9PSBmYWxzZSkge1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSBbXTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYoJGRhdGFTb3J0QXR0ciA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNvcnRBcnJheSA9IFtdO1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSA9PT0gLTEpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkucHVzaCgkZGF0YVNvcnRBdHRyKTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkuc3BsaWNlKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSwgMSlcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICB9XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRlZmF1bHRTb3J0O1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRzb3J0QXJyYXk7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRhdGFTb3J0QXR0cjtcclxuICAgIC8vICAgICAgICAgICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAkLmVhY2goJGNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICB2YXIgJHNvcnRBc2MgPSBmYWxzZTtcclxuICAgIC8vXHJcbiAgICAvLyAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IG51bGwgJiYgJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKS50b0xvd2VyQ2FzZSgpID09IFwiYXNjXCIpIHtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gdHJ1ZTtcclxuICAgIC8vICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy8gICAgICAgICAgICAgICAgIH1cclxuICAgIC8vICAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0QnkpID09ICRkZWZhdWx0U29ydCkge1xyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgfVxyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICBjb250YWluZXIuYXJyYW5nZSh7XHJcbiAgICAvLyAgICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJHNvcnRCeVZhbHVlLFxyXG4gICAgLy8gICAgICAgICAgICAgICAgICAgICBzb3J0QXNjZW5kaW5nOiAkc29ydEFzY1xyXG4gICAgLy8gICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgLy9cclxuICAgIC8vICAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsIGNvbnRhaW5lcik7XHJcbiAgICAvL1xyXG4gICAgLy8gICAgICAgICAgICAgfSk7XHJcbiAgICAvLyAgICAgICAgIH0pLmRhdGEoXCJpcy1zZXRcIiwgXCJ0cnVlXCIpO1xyXG4gICAgLy8gICAgIH1cclxuICAgIC8vXHJcbiAgICAvLyB9KTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkaW5zdGFuY2UgPSB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkLmVhY2goJGluc3RhbmNlLmZlZWRiYWNrQ29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG4gICAgICAgIHZhciAkZmVlZGJhY2sgPSBjb250YWluZXI7XHJcblxyXG4gICAgICAgICRmZWVkYmFjay5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG4gICAgICAgICAgICAkZWxtLnRleHQoJGVsbS5hdHRyKFwiZGF0YS1mZWVkYmFja1wiKS5yZXBsYWNlKFwie2RlbHRhfVwiLCAkaW5zdGFuY2UuaXNvdG9wZS5maWx0ZXJlZEl0ZW1zLmxlbmd0aCkpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSk7XHJcbn07XHJcbiJdfQ==
