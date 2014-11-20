!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.simpleIsotope=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/**
* _check: Check if we need to enable or disable the clear div without an instance
* @since 0.1.0
*/
module.exports = function() {
    this._onIsotopeChange.call(this, this.instances[this.guid].isotope);
};

},{}],2:[function(require,module,exports){
/**
* _check: Check if we need to enable or disable the clear div.
* @since 0.1.0
* @param {string} $instance
*/

module.exports = function($instance) {
    var $clear = $('['+this.settings.dataSelectors.clearFilter+']'),
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $dataFilter = this.settings.dataSelectors.filter,
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $activeClass = this.settings.defaults.classNames.active,
        $self = this;

    $clear.each(function(key, elm) {
        var $elm = $(elm);

        if($instance.options.filter != $defaultFilter) {

            $elm.show();

        } else {

            $elm.hide();

            var fn = function(idx, elm) {
                elm.find('.'+$activeClass).removeClass($activeClass);
                elm.find('['+$dataFilter+'="'+$defaultFilter+'"]').addClass($activeClass);
                elm.find('['+$dataSortBy+'="'+$defaultSort+'"]').addClass($activeClass);
            };

            $.each($self.instances[$self.guid].filterContainer, fn);
            $.each($self.instances[$self.guid].sortContainer, fn);

        }
    });

}

},{}],3:[function(require,module,exports){
module.exports = function() {
    var $clear = $('['+this.settings.dataSelectors.clearFilter+']'),
        $dataForContainer = this.settings.dataSelectors.forContainer,
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $self = this;

    $clear.each(function(key, elm) {
        var $elm = $(elm),
            $isFor = $clear.attr($dataForContainer) || false,
            $container = ($isFor === false) ? $self._getInstances() : $self._getElementsFromSelector($isFor);

        $elm.hide().on('click', function(e) {
            e.preventDefault();

            $.each($container, function($key, $instance) {

                if($self.useHash === true) {
                    $self.hash._setHash.call($self, $instance, $defaultFilter);
                } else {
                    $instance.arrange({
                        filter: $defaultFilter,
                        sortBy: $defaultSort
                    });

                    $self._onIsotopeChange.call($self, $instance);
                }
            });

            $elm.hide();
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
    this.filterMultiple = (this.container.attr(this.settings.dataSelectors.type).toLowerCase() == "multiple");
    this.filterMethod = this.container.attr(this.settings.dataSelectors.filterMethod).toLowerCase();

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
        sortContainer: {}
    };

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
 * @param {string} $dataFilter
 */

module.exports = function($instance, $dataFilter) {

    var $dataFilter = this.settings.dataSelectors.filter,
        $defaultFilter = this.settings.defaults.filter,
        $activeClass = this.settings.defaults.classNames.active;

    $("["+$dataFilter+"]").removeClass($activeClass);

    $.each($instance.options.filter.split(","), function( index, filter ) {
        var active = $("["+$dataFilter+"=\""+filter+"\"]").addClass($activeClass);

        if(active.length > 0) {
            $("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
        }
    });

};

},{}],7:[function(require,module,exports){
/**
* _createButtons and add events to it
* @since 0.1.0
*/

module.exports = function() {

    var $filters = $('['+this.settings.dataSelectors.filter+']'),//Get all filter elements
        $dataFilter = this.settings.dataSelectors.filter,
        $dataForContainer = this.settings.dataSelectors.forContainer,
        $self = this;

    $filters.each(function(idx, elm) {
        elm = $(elm);

        var $filterContainer =   elm.closest('['+$dataForContainer+']'), //Get parent with data-for-container
            $container =         ($filterContainer.length == 0) ? $self._getInstances() : $self._getElementsFromSelector($filterContainer.attr($dataForContainer)),
            $dataFilterAttr =    elm.attr($dataFilter),
            filterContainerId =  ($filterContainer.attr("id") || new Date().getTime());

        if($self.instances[$self.guid].filterContainer[filterContainerId] == null) {
            $self.instances[$self.guid].filterContainer[filterContainerId] = $filterContainer;
        }

        elm.on('click', function(e) {
            e.preventDefault();

            var $filterValue = '',
                val = $filterValue = $dataFilterAttr;

            $.each($container, function(key, $instance) {

                if($self.useHash === true) {
                    $self.hash._setHash.call($self, $instance, $filterValue);
                } else {

                    if($self.filterMultiple) {

                        if($instance.options.filter == "*" || $filterValue == "*") {
                            //Do nothing
                        } else if($instance.options.filter.indexOf($filterValue) === -1) {
                            $filterValue = $instance.options.filter.split(",");
                            $filterValue.push(val);
                            $filterValue = $filterValue.join(",");
                        } else {
                            $filterValue = $instance.options.filter.split(",");
                            $filterValue.splice($filterValue.indexOf(val), 1);
                            $filterValue = $filterValue.join(",");
                        }

                        if($filterValue == "") {
                            $filterValue = "*";
                        }
                    }

                    $instance.arrange({
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

    utils: require("./utils/index.js"),

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

        this._onIsotopeChange(this.instances[this.guid].isotope);
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
    * _toggleClass: Helper to toggle or remove classes easier
    * @since 0.1.0
    * @param {element} $elm
    * @param {element} $container
    * @param {string} className
    * @param {boolean} multiple
    * @param {boolean} match
    * @param {string} findDefault
    */
    _toggleClass: function($elm, $container, className, multiple, match, findDefault) {
        match = match || false;
        multiple = multiple || false;

        if(multiple !== false) {

            if(match) {
                $container.find('.'+className).removeClass(className);
                $elm.addClass(className);
            } else {
                $container.find(findDefault).removeClass(className);
                $elm.toggleClass(className);
            }

        } else {
            $container.find('.'+className).removeClass(className);
            $elm.addClass(className);
        }

        return $elm.hasClass(className);
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

    /**
    * _getElementsFromSelector
    * @since 0.1.0
    */
    _getElementsFromSelector: function(selector) {
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
            console.error("simpleIsotope: We cannot find any DOM element with the CSS selector: " + selector);
            return false;
        } else {
            var $tmpArr = [];
            $.each(this.instances, function(key, instance) {
                if($(instance.isotope.element)[0] === $tmp[0]) {
                    $tmpArr.push(instance.isotope);
                }
            });
            return $tmpArr;
        }

        // return $tmp;
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

},{"./clear/__check.js":1,"./clear/_check.js":2,"./clear/_createButtons.js":3,"./constructor/jquery.js":4,"./constructor/prototype.js":5,"./filter/_check.js":6,"./filter/_createButtons.js":7,"./hash/_formatHash.js":8,"./hash/_getHash.js":9,"./hash/_onHashChanged.js":10,"./hash/_setHash.js":11,"./sorter/_check.js":13,"./sorter/_createButtons.js":14,"./text/_feedback.js":15,"./utils/index.js":16}],13:[function(require,module,exports){
/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function($instance) {
    //Do nothing for now
};

},{}],14:[function(require,module,exports){
/**
* _createButtons and add events to it
* @since 0.1.0
*/

module.exports = function() {
    var $sorters = $('['+this.settings.dataSelectors.sortBy+']'),//Get all sort elements
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $dataForContainer = this.settings.dataSelectors.forContainer,
        $dataSortDirection = this.settings.dataSelectors.sortDirection,
        $defaultSort = this.settings.defaults.sort,
        $sortArray = [],
        $self = this;

    $sorters.each(function(idx, elm) {
        var $elm = $(elm);

        var $sortContainer =   $elm.closest('['+$dataForContainer+']'),
            $container =       ($sortContainer.length == 0) ? $self._getInstances() : $self._getElementsFromSelector($sortContainer.attr($dataForContainer)),
            $dataSortAttr =    $elm.attr($dataSortBy),
            sortContainerId =  ($sortContainer.attr("id") || new Date().getTime());

        if($self.instances[$self.guid].sortContainer[sortContainerId] == null) {
            $self.instances[$self.guid].sortContainer[sortContainerId] = $sortContainer;
        }

        var how = {
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

            $.each($container, function(key, container) {
                var $sortAsc = false;

                if($elm.attr($dataSortDirection) !== null && $elm.attr($dataSortDirection) !== undefined) {
                    if($elm.attr($dataSortDirection).toLowerCase() == "asc") {
                        $sortAsc = true;
                    }
                }
                if($elm.attr($dataSortBy) == $defaultSort) {
                    $sortAsc = true;
                }

                container.arrange({
                    sortBy: $sortByValue,
                    sortAscending: $sortAsc
                });

                $self._onIsotopeChange.call($self, container);

            });
        });

    });
};

},{}],15:[function(require,module,exports){
module.exports = function() {
    var $feedback = $('['+this.settings.dataSelectors.feedback+']'),
        $dataForContainer = this.settings.dataSelectors.forContainer,
        $self = this;

    $feedback.each(function(key, elm) {
        var $elm = $(elm),
            $isFor = $feedback.attr($dataForContainer) || false,
            $container = ($isFor === false) ? $self._getInstances() : $self._getElementsFromSelector($isFor);

        $.each($container, function($key, $instance) {
            $elm.text($elm.attr("data-feedback").replace("{delta}", $instance.filteredItems.length));
        });

    });
};

},{}],16:[function(require,module,exports){

},{}]},{},[12])(12)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxVc2Vyc1xcUGF1bFxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsInNvdXJjZVxcY2xlYXJcXF9fY2hlY2suanMiLCJzb3VyY2VcXGNsZWFyXFxfY2hlY2suanMiLCJzb3VyY2VcXGNsZWFyXFxfY3JlYXRlQnV0dG9ucy5qcyIsInNvdXJjZVxcY29uc3RydWN0b3JcXGpxdWVyeS5qcyIsInNvdXJjZVxcY29uc3RydWN0b3JcXHByb3RvdHlwZS5qcyIsInNvdXJjZVxcZmlsdGVyXFxfY2hlY2suanMiLCJzb3VyY2VcXGZpbHRlclxcX2NyZWF0ZUJ1dHRvbnMuanMiLCJzb3VyY2VcXGhhc2hcXF9mb3JtYXRIYXNoLmpzIiwic291cmNlXFxoYXNoXFxfZ2V0SGFzaC5qcyIsInNvdXJjZVxcaGFzaFxcX29uSGFzaENoYW5nZWQuanMiLCJzb3VyY2VcXGhhc2hcXF9zZXRIYXNoLmpzIiwic291cmNlXFxzaW1wbGUtaXNvdG9wZS5hbWQuanMiLCJzb3VyY2VcXHNvcnRlclxcX2NoZWNrLmpzIiwic291cmNlXFxzb3J0ZXJcXF9jcmVhdGVCdXR0b25zLmpzIiwic291cmNlXFx0ZXh0XFxfZmVlZGJhY2suanMiLCJzb3VyY2VcXHV0aWxzXFxpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3UEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIF9jaGVjazogQ2hlY2sgaWYgd2UgbmVlZCB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgY2xlYXIgZGl2IHdpdGhvdXQgYW4gaW5zdGFuY2VcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX29uSXNvdG9wZUNoYW5nZS5jYWxsKHRoaXMsIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZSk7XHJcbn07XHJcbiIsIi8qKlxyXG4qIF9jaGVjazogQ2hlY2sgaWYgd2UgbmVlZCB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgY2xlYXIgZGl2LlxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlKSB7XHJcbiAgICB2YXIgJGNsZWFyID0gJCgnWycrdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyKyddJyksXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkY2xlYXIuZWFjaChmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG5cclxuICAgICAgICBpZigkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIgIT0gJGRlZmF1bHRGaWx0ZXIpIHtcclxuXHJcbiAgICAgICAgICAgICRlbG0uc2hvdygpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgJGVsbS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICB2YXIgZm4gPSBmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICAgICAgZWxtLmZpbmQoJy4nKyRhY3RpdmVDbGFzcykucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcclxuICAgICAgICAgICAgICAgIGVsbS5maW5kKCdbJyskZGF0YUZpbHRlcisnPVwiJyskZGVmYXVsdEZpbHRlcisnXCJdJykuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcclxuICAgICAgICAgICAgICAgIGVsbS5maW5kKCdbJyskZGF0YVNvcnRCeSsnPVwiJyskZGVmYXVsdFNvcnQrJ1wiXScpLmFkZENsYXNzKCRhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLmZpbHRlckNvbnRhaW5lciwgZm4pO1xyXG4gICAgICAgICAgICAkLmVhY2goJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLnNvcnRDb250YWluZXIsIGZuKTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgfSk7XHJcblxyXG59XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJGNsZWFyID0gJCgnWycrdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyKyddJyksXHJcbiAgICAgICAgJGRhdGFGb3JDb250YWluZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkZGVmYXVsdEZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuZmlsdGVyLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkY2xlYXIuZWFjaChmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAkaXNGb3IgPSAkY2xlYXIuYXR0cigkZGF0YUZvckNvbnRhaW5lcikgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICRjb250YWluZXIgPSAoJGlzRm9yID09PSBmYWxzZSkgPyAkc2VsZi5fZ2V0SW5zdGFuY2VzKCkgOiAkc2VsZi5fZ2V0RWxlbWVudHNGcm9tU2VsZWN0b3IoJGlzRm9yKTtcclxuXHJcbiAgICAgICAgJGVsbS5oaWRlKCkub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAkLmVhY2goJGNvbnRhaW5lciwgZnVuY3Rpb24oJGtleSwgJGluc3RhbmNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLmhhc2guX3NldEhhc2guY2FsbCgkc2VsZiwgJGluc3RhbmNlLCAkZGVmYXVsdEZpbHRlcik7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAkZGVmYXVsdEZpbHRlcixcclxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydEJ5OiAkZGVmYXVsdFNvcnRcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICRlbG0uaGlkZSgpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCl7XG5cbiAgICB2YXIgJGFyZ3MgPSBhcmd1bWVudHNbMF0gfHwge30sXG4gICAgICAgIGluc3RhbmNlcyA9IFtdO1xuXG4gICAgaWYodHlwZW9mIHdpbmRvdy5Jc290b3BlICE9IFwiZnVuY3Rpb25cIikge1xuICAgICAgICBhbGVydChcInNpbXBsZUlzb3RvcGU6IElzb3RvcGUuSlMgY291bGRuJ3QgYmUgZm91bmQuIFBsZWFzZSBpbmNsdWRlICdpc290b3BlLnBrZ2QubWluLmpzJy5cIilcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgICQuZWFjaCh0aGlzLCBmdW5jdGlvbihpZHgsIGVsbSkge1xuICAgICAgICB2YXIgb2JqID0ge1xuICAgICAgICAgICAgY29udGFpbmVyOiAkKGVsbSksXG4gICAgICAgICAgICBzZXR0aW5nczoge1xuICAgICAgICAgICAgICAgIGl0ZW1TZWxlY3RvcjogJy5pdGVtJyxcbiAgICAgICAgICAgICAgICBkYXRhU2VsZWN0b3JzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJ2RhdGEtZmlsdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5OiAnZGF0YS1zb3J0LWJ5JyxcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5U2VsZWN0b3I6ICdkYXRhLXNvcnQtc2VsZWN0b3InLFxuICAgICAgICAgICAgICAgICAgICBzb3J0RGlyZWN0aW9uOiAnZGF0YS1zb3J0LWRpcmVjdGlvbicsXG4gICAgICAgICAgICAgICAgICAgIGZvckNvbnRhaW5lcjogJ2RhdGEtZm9yLWNvbnRhaW5lcicsXG4gICAgICAgICAgICAgICAgICAgIGNsZWFyRmlsdGVyOiAnZGF0YS1jbGVhci1maWx0ZXInLFxuICAgICAgICAgICAgICAgICAgICBmZWVkYmFjazogJ2RhdGEtZmVlZGJhY2snLFxuICAgICAgICAgICAgICAgICAgICB0eXBlOiAnZGF0YS1maWx0ZXItdHlwZScsXG4gICAgICAgICAgICAgICAgICAgIGZpbHRlck1ldGhvZDogJ2RhdGEtZmlsdGVyLW1ldGhvZCdcbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIGRlZmF1bHRzOiB7XG4gICAgICAgICAgICAgICAgICAgIGZpbHRlcjogXCIqXCIsXG4gICAgICAgICAgICAgICAgICAgIHNvcnQ6IFwib3JpZ2luYWwtb3JkZXJcIixcbiAgICAgICAgICAgICAgICAgICAgY2xhc3NOYW1lczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlOiAnYWN0aXZlJ1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuXG4gICAgICAgIGluc3RhbmNlcy5wdXNoKG5ldyAkLnNpbXBsZUlzb3RvcGUoJC5leHRlbmQob2JqLCAkYXJncykpKTtcbiAgICB9KTtcblxuICAgICQuZWFjaChpbnN0YW5jZXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgICAgIGVsbS5zb3J0ZXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0uZmlsdGVyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLmNsZWFyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLnRleHQuX2ZlZWRiYWNrLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLmNsZWFyLl9fY2hlY2suY2FsbChlbG0pO1xuICAgIH0pO1xuXG4gICAgcmV0dXJuIGluc3RhbmNlcztcblxufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGFyZ3Mpe1xuICAgICQuZXh0ZW5kKHRoaXMsICRhcmdzKTtcblxuICAgIHZhciAkc2VsZiA9IHRoaXMsXG4gICAgICAgIHRoZUhhc2ggPSB0aGlzLmhhc2guX2dldEhhc2guY2FsbCh0aGlzKTtcblxuICAgIHRoaXMuX2dldEZpbHRlclRlc3RPcmdpbmFsID0gSXNvdG9wZS5wcm90b3R5cGUuX2dldEZpbHRlclRlc3Q7XG4gICAgSXNvdG9wZS5wcm90b3R5cGUuX2dldEZpbHRlclRlc3QgPSB0aGlzLl9nZXRGaWx0ZXJUZXN0LmJpbmQodGhpcyk7XG5cbiAgICB0aGlzLmd1aWQgPSB0aGlzLmNvbnRhaW5lci5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy5maWx0ZXJNdWx0aXBsZSA9ICh0aGlzLmNvbnRhaW5lci5hdHRyKHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy50eXBlKS50b0xvd2VyQ2FzZSgpID09IFwibXVsdGlwbGVcIik7XG4gICAgdGhpcy5maWx0ZXJNZXRob2QgPSB0aGlzLmNvbnRhaW5lci5hdHRyKHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXJNZXRob2QpLnRvTG93ZXJDYXNlKCk7XG5cbiAgICB0aGlzLmVuY29kZVVSSSA9IGZhbHNlO1xuXG4gICAgLy9GaXJzdCB0aW1lIGluaXQgaXNvdG9wZVxuICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0gPSB7XG4gICAgICAgIGlzb3RvcGU6IG5ldyBJc290b3BlKHRoaXMuY29udGFpbmVyLmNvbnRleHQsIHtcbiAgICAgICAgICAgIGZpbHRlcjogdGhlSGFzaCB8fCBcIipcIixcbiAgICAgICAgICAgIGl0ZW1TZWxlY3RvcjogJHNlbGYuc2V0dGluZ3MuaXRlbVNlbGVjdG9yIHx8ICcuaXRlbScsXG4gICAgICAgICAgICBsYXlvdXRNb2RlOiAkc2VsZi5jb250YWluZXIuZGF0YShcImxheW91dFwiKSB8fCBcImZpdFJvd3NcIixcbiAgICAgICAgICAgIGdldFNvcnREYXRhOiAkc2VsZi5fZ2V0U29ydERhdGEoKVxuICAgICAgICB9KSxcbiAgICAgICAgZmlsdGVyQ29udGFpbmVyOiB7fSxcbiAgICAgICAgc29ydENvbnRhaW5lcjoge31cbiAgICB9O1xuXG4gICAgaWYodGhpcy5jb250YWluZXIuZGF0YShcImhhc2hcIikgIT09IG51bGwgJiYgdGhpcy5jb250YWluZXIuZGF0YShcImhhc2hcIikgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB0aGlzLnVzZUhhc2ggPSB0cnVlO1xuICAgIH1cblxuICAgIC8vQWRkIGhhc2ggc3VwcG9ydFxuICAgICQod2luZG93KS5vbignaGFzaGNoYW5nZScsIHRoaXMuaGFzaC5fb25IYXNoQ2hhbmdlZC5iaW5kKHRoaXMpKTtcblxuIH07XG4iLCIvKipcbiAqIF9jaGVja0FjdGl2ZTogQ2hlY2sgaWYgYnV0dG9ucyBuZWVkIGFuIGFjdGl2ZSBjbGFzc1xuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gJGRhdGFGaWx0ZXJcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSwgJGRhdGFGaWx0ZXIpIHtcblxuICAgIHZhciAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmU7XG5cbiAgICAkKFwiW1wiKyRkYXRhRmlsdGVyK1wiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuXG4gICAgJC5lYWNoKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIiksIGZ1bmN0aW9uKCBpbmRleCwgZmlsdGVyICkge1xuICAgICAgICB2YXIgYWN0aXZlID0gJChcIltcIiskZGF0YUZpbHRlcitcIj1cXFwiXCIrZmlsdGVyK1wiXFxcIl1cIikuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcblxuICAgICAgICBpZihhY3RpdmUubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgJChcIltcIiskZGF0YUZpbHRlcitcIj1cXFwiXCIrJGRlZmF1bHRGaWx0ZXIrXCJcXFwiXVwiKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xuICAgICAgICB9XG4gICAgfSk7XG5cbn07XG4iLCIvKipcclxuKiBfY3JlYXRlQnV0dG9ucyBhbmQgYWRkIGV2ZW50cyB0byBpdFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuXHJcbiAgICB2YXIgJGZpbHRlcnMgPSAkKCdbJyt0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyKyddJyksLy9HZXQgYWxsIGZpbHRlciBlbGVtZW50c1xyXG4gICAgICAgICRkYXRhRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcixcclxuICAgICAgICAkZGF0YUZvckNvbnRhaW5lciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIsXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICRmaWx0ZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICBlbG0gPSAkKGVsbSk7XHJcblxyXG4gICAgICAgIHZhciAkZmlsdGVyQ29udGFpbmVyID0gICBlbG0uY2xvc2VzdCgnWycrJGRhdGFGb3JDb250YWluZXIrJ10nKSwgLy9HZXQgcGFyZW50IHdpdGggZGF0YS1mb3ItY29udGFpbmVyXHJcbiAgICAgICAgICAgICRjb250YWluZXIgPSAgICAgICAgICgkZmlsdGVyQ29udGFpbmVyLmxlbmd0aCA9PSAwKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3RvcigkZmlsdGVyQ29udGFpbmVyLmF0dHIoJGRhdGFGb3JDb250YWluZXIpKSxcclxuICAgICAgICAgICAgJGRhdGFGaWx0ZXJBdHRyID0gICAgZWxtLmF0dHIoJGRhdGFGaWx0ZXIpLFxyXG4gICAgICAgICAgICBmaWx0ZXJDb250YWluZXJJZCA9ICAoJGZpbHRlckNvbnRhaW5lci5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xyXG5cclxuICAgICAgICBpZigkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uZmlsdGVyQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lcklkXSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5maWx0ZXJDb250YWluZXJbZmlsdGVyQ29udGFpbmVySWRdID0gJGZpbHRlckNvbnRhaW5lcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGVsbS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciAkZmlsdGVyVmFsdWUgPSAnJyxcclxuICAgICAgICAgICAgICAgIHZhbCA9ICRmaWx0ZXJWYWx1ZSA9ICRkYXRhRmlsdGVyQXR0cjtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCgkY29udGFpbmVyLCBmdW5jdGlvbihrZXksICRpbnN0YW5jZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRzZWxmLnVzZUhhc2ggPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZSwgJGZpbHRlclZhbHVlKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRzZWxmLmZpbHRlck11bHRpcGxlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIgPT0gXCIqXCIgfHwgJGZpbHRlclZhbHVlID09IFwiKlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0RvIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIGlmKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlci5pbmRleE9mKCRmaWx0ZXJWYWx1ZSkgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIuc3BsaXQoXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlLnB1c2godmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRmaWx0ZXJWYWx1ZS5qb2luKFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRpbnN0YW5jZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUuc3BsaWNlKCRmaWx0ZXJWYWx1ZS5pbmRleE9mKHZhbCksIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGZpbHRlclZhbHVlLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkZmlsdGVyVmFsdWUgPT0gXCJcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gXCIqXCI7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAkZmlsdGVyVmFsdWVcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH0pO1xyXG5cclxuXHJcbiAgICB9KTtcclxufTtcclxuIiwiLyoqXG4qIF9mb3JtYXRIYXNoOiBGb3JtYXQgbXVsdGlwbGUgZmlsdGVycyBpbnRvIG9uZSBzdHJpbmcgYmFzZWQgb24gYSByZWd1bGFyIGV4cHJlc3Npb25cbiogQHNpbmNlIDAuMS4wXG4qIEBwYXJhbSB7cmVnZXh9IHJlXG4qIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlLCBzdHIpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IHt9LFxuICAgICAgICBtYXRjaDtcblxuICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKHN0cikpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKG1hdGNoLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWF0Y2hbM10gIT09IG51bGwgJiYgbWF0Y2hbM10gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzNdXSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYobWF0Y2hlc1ttYXRjaFsxXV0gPT0gbnVsbCB8fCBtYXRjaGVzW21hdGNoWzFdXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFsxXV0ucHVzaChtYXRjaFsyXSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXM7XG59O1xuIiwiLyoqXG4gKiBfZ2V0SGFzaDogR2V0IHdpbmRvdy5sb2NhdGlvbi5oYXNoIGFuZCBmb3JtYXQgaXQgZm9yIElzb3RvcGVcbiAqIEBzaW5jZSAwLjEuMFxuICovXG5cbiBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGZhbHNlLFxuICAgICAgICAkbmV3SGFzaCA9IFwiXCI7XG5cbiAgICAkaGFzaCA9ICgkaGFzaCAhPT0gZmFsc2UgJiYgJGhhc2ggIT0gXCIjXCIgJiYgJGhhc2ggIT0gXCJcIikgPyBkZWNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhhc2gpIDogJyonO1xuXG4gICAgLy9SZW1vdmUgaGFzaCBmcm9tIGZpcnN0IGNoYXJhY3RlciBpZiBpdHMgZXhpc3RcbiAgICBpZiAoJGhhc2guY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgICRoYXNoID0gJGhhc2guc2xpY2UoMSk7XG4gICAgfVxuXG4gICAgdmFyIGhhc2hBcnJheSA9ICRoYXNoLnNwbGl0KFwiJlwiKTtcbiAgICAkLmVhY2goaGFzaEFycmF5LCBmdW5jdGlvbihrZXksICRwYXJ0SGFzaCkge1xuXG4gICAgICAgIGlmKCRwYXJ0SGFzaC5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIHtcblxuICAgICAgICAgICAgdmFyIHRtcCA9ICRwYXJ0SGFzaC5zcGxpdChcIj1cIiksXG4gICAgICAgICAgICAgICAgYXJyID0gW107XG5cbiAgICAgICAgICAgIGlmKHRtcC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB0bXBbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IHRtcFsxXS5yZXBsYWNlKC9cXCcvZywgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goXCJbZGF0YS1cIiArIG5hbWUgKyBcIj0nXCIgKyB2YWx1ZXNbaV0gKyBcIiddXCIpO1xuXG4gICAgICAgICAgICAgICAgLy8gJChcIltkYXRhLWZpbHRlcj1cXFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVxcXCJdXCIpLmFkZENsYXNzKCRzZWxmLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJG5ld0hhc2ggKz0gYXJyLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbmV3SGFzaCArPSAoJHBhcnRIYXNoID09IFwiKlwiIHx8ICRwYXJ0SGFzaC5jaGFyQXQoMCkgPT0gJy4nKSA/ICRwYXJ0SGFzaDogXCIuXCIgKyAkcGFydEhhc2g7XG4gICAgICAgIH1cblxuICAgICAgICBpZihrZXkgIT0gKGhhc2hBcnJheS5sZW5ndGggLSAxKSkge1xuICAgICAgICAgICAgJG5ld0hhc2ggKz0gXCIsXCI7XG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgIHJldHVybiAkbmV3SGFzaDtcblxuIH07XG4iLCIvKipcclxuKiBfb25IYXNoQ2hhbmdlOiBmaXJlcyB3aGVuIGxvY2F0aW9uLmhhc2ggaGFzIGJlZW4gY2hhbmdlZFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fc2V0SXNvdG9wZS5jYWxsKHRoaXMsIHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpKTtcclxufTtcclxuIiwiLyoqXG4gKiBfc2V0SGFzaDogU2V0IGEgbmV3IGxvY2F0aW9uLmhhc2ggYWZ0ZXIgZm9ybWF0dGluZyBpdFxuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gJG5ld0hhc2hcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSwgJG5ld0hhc2gpIHtcbiAgICB2YXIgJGN1cnJlbnRIYXNoID0gKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlciA9PSBcIipcIikgPyBcIlwiIDogJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyLFxuICAgICAgICAkY29tYmluZWRIYXNoO1xuXG4gICAgaWYoJG5ld0hhc2ggIT0gXCIqXCIpIHtcblxuICAgICAgICBpZigkY3VycmVudEhhc2guaW5kZXhPZigkbmV3SGFzaCkgPT09IC0xKSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoICsgJG5ld0hhc2g7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkY29tYmluZWRIYXNoID0gJGN1cnJlbnRIYXNoLnJlcGxhY2UoJG5ld0hhc2gsIFwiXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyICRmb3JtYXR0ZWRIYXNoID0gdGhpcy5oYXNoLl9mb3JtYXRIYXNoKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXXwoLltBLVphLXowLTldKykvZywgJGNvbWJpbmVkSGFzaCksXG4gICAgICAgICAgICAkZW5kSGFzaCA9IFtdO1xuXG4gICAgICAgICQuZWFjaCgkZm9ybWF0dGVkSGFzaCwgZnVuY3Rpb24oa2V5LCBlbG0pIHtcbiAgICAgICAgICAgIGlmKGVsbSA9PT0gdHJ1ZSkgey8vaXNDbGFzc1xuICAgICAgICAgICAgICAgICRlbmRIYXNoLnB1c2goIChrZXkuY2hhckF0KDApID09ICcuJykgPyBrZXkuc2xpY2UoMSkgOiBrZXkgKTtcbiAgICAgICAgICAgIH0gZWxzZSB7Ly9pc09iamVjdFxuICAgICAgICAgICAgICAgICRlbmRIYXNoLnB1c2goa2V5ICsgXCI9XCIgKyBlbG0uam9pbihcIixcIikpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAkZW5kSGFzaCA9ICRlbmRIYXNoLmpvaW4oXCImXCIpO1xuICAgIH0gZWxzZSB7XG4gICAgICAgICRlbmRIYXNoID0gJG5ld0hhc2g7XG4gICAgfVxuXG4gICAgaWYoJGVuZEhhc2ggPT0gXCIqXCIgfHwgJGVuZEhhc2ggPT0gXCJcIikge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAodGhpcy5lbmNvZGVVUkkgPT09IHRydWUpID8gZW5jb2RlVVJJQ29tcG9uZW50KCRlbmRIYXNoKSA6ICRlbmRIYXNoO1xuICAgIH1cblxuICAgIHJldHVybiAkZW5kSGFzaDtcbn07XG4iLCJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XHJcblxyXG4kLnNpbXBsZUlzb3RvcGUgPSByZXF1aXJlKFwiLi9jb25zdHJ1Y3Rvci9wcm90b3R5cGUuanNcIik7XHJcblxyXG4kLnNpbXBsZUlzb3RvcGUucHJvdG90eXBlID0ge1xyXG4gICAgaW5zdGFuY2VzOiB7fSxcclxuICAgIGNvbnN0cnVjdG9yOiAkLnNpbXBsZUlzb3RvcGUsXHJcblxyXG4gICAgaGFzaDoge1xyXG4gICAgICAgIF9nZXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19nZXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9zZXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19zZXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9mb3JtYXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19mb3JtYXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9vbkhhc2hDaGFuZ2VkOiByZXF1aXJlKFwiLi9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL2ZpbHRlci9fY3JlYXRlQnV0dG9ucy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL2ZpbHRlci9fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICBzb3J0ZXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vc29ydGVyL19jcmVhdGVCdXR0b25zLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vc29ydGVyL19jaGVjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIGNsZWFyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL2NsZWFyL19jcmVhdGVCdXR0b25zLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vY2xlYXIvX2NoZWNrLmpzXCIpLFxyXG4gICAgICAgIF9fY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICB0ZXh0OiB7XHJcbiAgICAgICAgX2ZlZWRiYWNrOiByZXF1aXJlKFwiLi90ZXh0L19mZWVkYmFjay5qc1wiKVxyXG4gICAgfSxcclxuXHJcbiAgICB1dGlsczogcmVxdWlyZShcIi4vdXRpbHMvaW5kZXguanNcIiksXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9vbkJlZm9yZUlzb3RvcGVDaGFuZ2U6IGZpcmVzIGJlZm9yZSB0aGUgSXNvdG9wZSBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZFxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9vbkJlZm9yZUlzb3RvcGVDaGFuZ2U6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge30sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9vbklzb3RvcGVDaGFuZ2U6IGZpcmVzIHdoZW4gdGhlIElzb3RvcGUgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWRcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuICAgICovXHJcbiAgICBfb25Jc290b3BlQ2hhbmdlOiBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuICAgICAgICB0aGlzLmZpbHRlci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgIHRoaXMuc29ydGVyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcblxyXG4gICAgICAgIHRoaXMuY2xlYXIuX2NoZWNrLmNhbGwodGhpcywgJGluc3RhbmNlKTtcclxuICAgICAgICB0aGlzLnRleHQuX2ZlZWRiYWNrLmNhbGwodGhpcywgJGluc3RhbmNlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9zZXRJc290b3BlOiBSZWNvbmZpZ3VyZSBpc290b3BlXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJHNlbGVjdG9yXHJcbiAgICAqL1xyXG4gICAgX3NldElzb3RvcGU6IGZ1bmN0aW9uKCRzZWxlY3Rvcikge1xyXG4gICAgICAgIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgZmlsdGVyOiAkc2VsZWN0b3JcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5fb25Jc290b3BlQ2hhbmdlKHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgICogX2dldFNvcnREYXRhOiBHZXQgdGhlIGRhdGEtc29ydC1ieSBhdHRyaWJ1dGVzIGFuZCBtYWtlIHRoZW0gaW50byBhbiBJc290b3BlIFwiZ2V0U29ydERhdGFcIiBvYmplY3RcclxuICAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgICovXHJcbiAgICBfZ2V0U29ydERhdGE6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciAkc29ydERhdGEgPSB7fSxcclxuICAgICAgICAgICAgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICAgICAkZGF0YVNvcnRCeVNlbGVjdG9yID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeVNlbGVjdG9yLFxyXG4gICAgICAgICAgICAkZGF0YVNvcnRCeURlZmF1bHQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQ7XHJcblxyXG4gICAgICAgICQoJ1snICsgJGRhdGFTb3J0QnkgKyAnXSwgWycgKyAkZGF0YVNvcnRCeVNlbGVjdG9yICsgJ10nKS5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgIHZhciAkZWxtID0gJChlbG0pLFxyXG4gICAgICAgICAgICAgICAgJG5hbWUgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpIHx8IG51bGwsXHJcbiAgICAgICAgICAgICAgICAkc2VsZWN0b3IgPSAkZWxtLmF0dHIoJGRhdGFTb3J0QnlTZWxlY3RvcikgfHwgbnVsbDtcclxuXHJcbiAgICAgICAgICAgIGlmKCRuYW1lICE9ICRkYXRhU29ydEJ5RGVmYXVsdCkge1xyXG4gICAgICAgICAgICAgICAgaWYoJG5hbWUgIT09IG51bGwgJiYgJHNlbGVjdG9yICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnREYXRhWyRuYW1lXSA9ICRzZWxlY3RvcjtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgYWxlcnQoXCJJc290b3BlIHNvcnRpbmc6IFwiKyRkYXRhU29ydEJ5K1wiIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiIGFyZSByZXF1aXJlZC4gQ3VycmVudGx5IGNvbmZpZ3VyZWQgXCIrJGRhdGFTb3J0QnkrXCI9J1wiICsgJG5hbWUgKyBcIicgYW5kIFwiKyRkYXRhU29ydEJ5U2VsZWN0b3IrXCI9J1wiICsgJHNlbGVjdG9yICsgXCInXCIpXHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuICRzb3J0RGF0YTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF90b2dnbGVDbGFzczogSGVscGVyIHRvIHRvZ2dsZSBvciByZW1vdmUgY2xhc3NlcyBlYXNpZXJcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7ZWxlbWVudH0gJGVsbVxyXG4gICAgKiBAcGFyYW0ge2VsZW1lbnR9ICRjb250YWluZXJcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IGNsYXNzTmFtZVxyXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG11bHRpcGxlXHJcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbWF0Y2hcclxuICAgICogQHBhcmFtIHtzdHJpbmd9IGZpbmREZWZhdWx0XHJcbiAgICAqL1xyXG4gICAgX3RvZ2dsZUNsYXNzOiBmdW5jdGlvbigkZWxtLCAkY29udGFpbmVyLCBjbGFzc05hbWUsIG11bHRpcGxlLCBtYXRjaCwgZmluZERlZmF1bHQpIHtcclxuICAgICAgICBtYXRjaCA9IG1hdGNoIHx8IGZhbHNlO1xyXG4gICAgICAgIG11bHRpcGxlID0gbXVsdGlwbGUgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKG11bHRpcGxlICE9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgaWYobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnLicrY2xhc3NOYW1lKS5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgJGVsbS5hZGRDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKGZpbmREZWZhdWx0KS5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgJGVsbS50b2dnbGVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnLicrY2xhc3NOYW1lKS5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAkZWxtLmFkZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJGVsbS5oYXNDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX2dldEluc3RhbmNlc1xyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICovXHJcbiAgICBfZ2V0SW5zdGFuY2VzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdG1wID0gW11cclxuXHJcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5zdGFuY2VzLCBmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgICAgICB0bXAucHVzaChlbG0uaXNvdG9wZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0bXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfZ2V0RWxlbWVudHNGcm9tU2VsZWN0b3JcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqL1xyXG4gICAgX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciAkdG1wO1xyXG5cclxuICAgICAgICBpZihzZWxlY3Rvci5jaGFyQXQoMCkgPT0gXCIjXCIgfHwgc2VsZWN0b3IuY2hhckF0KDApID09IFwiLlwiKSB7XHRcdFx0XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoXCIjXCIpICE9PSAtMSB8fCBzZWxlY3Rvci5pbmRleE9mKFwiLlwiKSAhPT0gLTEpIHtcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZihcIiBcIikgIT09IC0xKSB7XHRcdFx0XHRcdFx0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vZXZ1bGF0ZSB0aGUgc3RyaW5nIGFzIGFuIGlkXHJcbiAgICAgICAgICAgICR0bXAgPSAkKFwiI1wiICsgc2VsZWN0b3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoJHRtcC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwic2ltcGxlSXNvdG9wZTogV2UgY2Fubm90IGZpbmQgYW55IERPTSBlbGVtZW50IHdpdGggdGhlIENTUyBzZWxlY3RvcjogXCIgKyBzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgJHRtcEFyciA9IFtdO1xyXG4gICAgICAgICAgICAkLmVhY2godGhpcy5pbnN0YW5jZXMsIGZ1bmN0aW9uKGtleSwgaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmKCQoaW5zdGFuY2UuaXNvdG9wZS5lbGVtZW50KVswXSA9PT0gJHRtcFswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICR0bXBBcnIucHVzaChpbnN0YW5jZS5pc290b3BlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiAkdG1wQXJyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmV0dXJuICR0bXA7XHJcbiAgICB9LFxyXG5cclxuICAgIF9nZXRGaWx0ZXJUZXN0OiBmdW5jdGlvbihmaWx0ZXIpIHtcclxuICAgICAgICB2YXIgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24oIGl0ZW0gKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgZmlsdGVycyA9IGZpbHRlci5zcGxpdChcIixcIiksXHJcbiAgICAgICAgICAgICAgICBhY3RpdmUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmaWx0ZXJzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoZmlsdGVyc1tpXS5pbmRleE9mKFwiZGF0YS1cIikgIT09IC0xKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIHZhciBjYXQgPSBmaWx0ZXJzW2ldLnJlcGxhY2UoL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csIFwiJDFcIikudHJpbSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGZpbHRlcnNbaV0ucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMlwiKS50cmltKCk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkgIT09IHVuZGVmaW5lZCAmJiBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApICE9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdCApLmluZGV4T2YoIHZhbHVlICkgIT09IC0xICkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2godmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmlzKCBmaWx0ZXJzW2ldICkgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKGZpbHRlcnNbaV0pO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBpZigkc2VsZi5maWx0ZXJNZXRob2QgPT0gXCJvclwiKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA+IDA7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA9PSBmaWx0ZXJzLmxlbmd0aDtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgfVxyXG5cclxufTtcclxuXHJcbiQuZm4uc2ltcGxlSXNvdG9wZSA9IHJlcXVpcmUoXCIuL2NvbnN0cnVjdG9yL2pxdWVyeS5qc1wiKVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkLmVhY2goJChcIltkYXRhLWlzb3RvcGVdXCIpLCBmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgICQoZWxtKS5zaW1wbGVJc290b3BlKCk7XHJcbiAgICB9KVxyXG59KTtcclxuXHJcbi8vIEFkZCBiaW5kIHN1cHBvcnRcclxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUuYmluZCkge1xyXG4gIEZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kID0gZnVuY3Rpb24ob1RoaXMpIHtcclxuICAgIGlmICh0eXBlb2YgdGhpcyAhPT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAvLyBjbG9zZXN0IHRoaW5nIHBvc3NpYmxlIHRvIHRoZSBFQ01BU2NyaXB0IDVcclxuICAgICAgLy8gaW50ZXJuYWwgSXNDYWxsYWJsZSBmdW5jdGlvblxyXG4gICAgICB0aHJvdyBuZXcgVHlwZUVycm9yKCdGdW5jdGlvbi5wcm90b3R5cGUuYmluZCAtIHdoYXQgaXMgdHJ5aW5nIHRvIGJlIGJvdW5kIGlzIG5vdCBjYWxsYWJsZScpO1xyXG4gICAgfVxyXG5cclxuICAgIHZhciBhQXJncyAgID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAxKSxcclxuICAgICAgICBmVG9CaW5kID0gdGhpcyxcclxuICAgICAgICBmTk9QICAgID0gZnVuY3Rpb24oKSB7fSxcclxuICAgICAgICBmQm91bmQgID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICByZXR1cm4gZlRvQmluZC5hcHBseSh0aGlzIGluc3RhbmNlb2YgZk5PUCAmJiBvVGhpc1xyXG4gICAgICAgICAgICAgICAgID8gdGhpc1xyXG4gICAgICAgICAgICAgICAgIDogb1RoaXMsXHJcbiAgICAgICAgICAgICAgICAgYUFyZ3MuY29uY2F0KEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cykpKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgIGZOT1AucHJvdG90eXBlID0gdGhpcy5wcm90b3R5cGU7XHJcbiAgICBmQm91bmQucHJvdG90eXBlID0gbmV3IGZOT1AoKTtcclxuXHJcbiAgICByZXR1cm4gZkJvdW5kO1xyXG4gIH07XHJcbn1cclxuaWYgKCFGdW5jdGlvbi5wcm90b3R5cGUudHJpbSkge1xyXG4gICAgU3RyaW5nLnByb3RvdHlwZS50cmltID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpO1xyXG4gICAgfVxyXG59XHJcbiIsIi8qKlxuICogX2NoZWNrQWN0aXZlOiBDaGVjayBpZiBidXR0b25zIG5lZWQgYW4gYWN0aXZlIGNsYXNzXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBwYXJhbSB7b2JqZWN0fSAkaW5zdGFuY2VcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xuICAgIC8vRG8gbm90aGluZyBmb3Igbm93XG59O1xuIiwiLyoqXHJcbiogX2NyZWF0ZUJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJHNvcnRlcnMgPSAkKCdbJyt0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5KyddJyksLy9HZXQgYWxsIHNvcnQgZWxlbWVudHNcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGRhdGFGb3JDb250YWluZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyLFxyXG4gICAgICAgICRkYXRhU29ydERpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkc29ydEFycmF5ID0gW10sXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICRzb3J0ZXJzLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKTtcclxuXHJcbiAgICAgICAgdmFyICRzb3J0Q29udGFpbmVyID0gICAkZWxtLmNsb3Nlc3QoJ1snKyRkYXRhRm9yQ29udGFpbmVyKyddJyksXHJcbiAgICAgICAgICAgICRjb250YWluZXIgPSAgICAgICAoJHNvcnRDb250YWluZXIubGVuZ3RoID09IDApID8gJHNlbGYuX2dldEluc3RhbmNlcygpIDogJHNlbGYuX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yKCRzb3J0Q29udGFpbmVyLmF0dHIoJGRhdGFGb3JDb250YWluZXIpKSxcclxuICAgICAgICAgICAgJGRhdGFTb3J0QXR0ciA9ICAgICRlbG0uYXR0cigkZGF0YVNvcnRCeSksXHJcbiAgICAgICAgICAgIHNvcnRDb250YWluZXJJZCA9ICAoJHNvcnRDb250YWluZXIuYXR0cihcImlkXCIpIHx8IG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgaWYoJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLnNvcnRDb250YWluZXJbc29ydENvbnRhaW5lcklkXSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5zb3J0Q29udGFpbmVyW3NvcnRDb250YWluZXJJZF0gPSAkc29ydENvbnRhaW5lcjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciBob3cgPSB7XHJcbiAgICAgICAgICAgIGV2ZW50TmFtZTogJGVsbS5wcm9wKFwidGFnTmFtZVwiKS50b0xvd2VyQ2FzZSgpID09IFwib3B0aW9uXCIgPyBcImNoYW5nZVwiIDogXCJjbGlja1wiLFxyXG4gICAgICAgICAgICBlbGVtZW50OiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/ICRlbG0uY2xvc2VzdChcInNlbGVjdFwiKSA6ICRlbG1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBob3cuZWxlbWVudC5vbihob3cuZXZlbnROYW1lLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgIGlmKGhvdy5ldmVudE5hbWUgPT0gXCJjaGFuZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgaWYoaG93LmVsZW1lbnQuZmluZCgnb3B0aW9uOnNlbGVjdGVkJylbMF0gIT0gZWxtKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgJHNvcnRCeVZhbHVlID0gJyc7XHJcbiAgICAgICAgICAgIGlmKCRzZWxmLmZpbHRlck11bHRpcGxlICE9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRkYXRhU29ydEF0dHIgPT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0cikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkucHVzaCgkZGF0YVNvcnRBdHRyKTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFycmF5LnNwbGljZSgkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0ciksIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRlZmF1bHRTb3J0O1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSAkc29ydEFycmF5O1xyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkYXRhU29ydEF0dHI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICQuZWFjaCgkY29udGFpbmVyLCBmdW5jdGlvbihrZXksIGNvbnRhaW5lcikge1xyXG4gICAgICAgICAgICAgICAgdmFyICRzb3J0QXNjID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IG51bGwgJiYgJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pLnRvTG93ZXJDYXNlKCkgPT0gXCJhc2NcIikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgY29udGFpbmVyLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJHNvcnRCeVZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgIHNvcnRBc2NlbmRpbmc6ICRzb3J0QXNjXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZmVlZGJhY2sgPSAkKCdbJyt0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmVlZGJhY2srJ10nKSxcclxuICAgICAgICAkZGF0YUZvckNvbnRhaW5lciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIsXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICRmZWVkYmFjay5lYWNoKGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICRpc0ZvciA9ICRmZWVkYmFjay5hdHRyKCRkYXRhRm9yQ29udGFpbmVyKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgJGNvbnRhaW5lciA9ICgkaXNGb3IgPT09IGZhbHNlKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3RvcigkaXNGb3IpO1xyXG5cclxuICAgICAgICAkLmVhY2goJGNvbnRhaW5lciwgZnVuY3Rpb24oJGtleSwgJGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICRlbG0udGV4dCgkZWxtLmF0dHIoXCJkYXRhLWZlZWRiYWNrXCIpLnJlcGxhY2UoXCJ7ZGVsdGF9XCIsICRpbnN0YW5jZS5maWx0ZXJlZEl0ZW1zLmxlbmd0aCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLG51bGxdfQ==
