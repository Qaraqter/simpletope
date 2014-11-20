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

                    if( jQuery( item.element ).data( cat ).indexOf( value ) !== -1 ) {
                        active.push(value);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxVc2Vyc1xcUGF1bFxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsInNvdXJjZVxcY2xlYXJcXF9fY2hlY2suanMiLCJzb3VyY2VcXGNsZWFyXFxfY2hlY2suanMiLCJzb3VyY2VcXGNsZWFyXFxfY3JlYXRlQnV0dG9ucy5qcyIsInNvdXJjZVxcY29uc3RydWN0b3JcXGpxdWVyeS5qcyIsInNvdXJjZVxcY29uc3RydWN0b3JcXHByb3RvdHlwZS5qcyIsInNvdXJjZVxcZmlsdGVyXFxfY2hlY2suanMiLCJzb3VyY2VcXGZpbHRlclxcX2NyZWF0ZUJ1dHRvbnMuanMiLCJzb3VyY2VcXGhhc2hcXF9mb3JtYXRIYXNoLmpzIiwic291cmNlXFxoYXNoXFxfZ2V0SGFzaC5qcyIsInNvdXJjZVxcaGFzaFxcX29uSGFzaENoYW5nZWQuanMiLCJzb3VyY2VcXGhhc2hcXF9zZXRIYXNoLmpzIiwic291cmNlXFxzaW1wbGUtaXNvdG9wZS5hbWQuanMiLCJzb3VyY2VcXHNvcnRlclxcX2NoZWNrLmpzIiwic291cmNlXFxzb3J0ZXJcXF9jcmVhdGVCdXR0b25zLmpzIiwic291cmNlXFx0ZXh0XFxfZmVlZGJhY2suanMiLCJzb3VyY2VcXHV0aWxzXFxpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdkNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkEiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyoqXHJcbiogX2NoZWNrOiBDaGVjayBpZiB3ZSBuZWVkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBjbGVhciBkaXYgd2l0aG91dCBhbiBpbnN0YW5jZVxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdGhpcy5fb25Jc290b3BlQ2hhbmdlLmNhbGwodGhpcywgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlKTtcclxufTtcclxuIiwiLyoqXHJcbiogX2NoZWNrOiBDaGVjayBpZiB3ZSBuZWVkIHRvIGVuYWJsZSBvciBkaXNhYmxlIHRoZSBjbGVhciBkaXYuXHJcbiogQHNpbmNlIDAuMS4wXHJcbiogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuICAgIHZhciAkY2xlYXIgPSAkKCdbJyt0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIrJ10nKSxcclxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAgICAgJGRlZmF1bHRGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmZpbHRlcixcclxuICAgICAgICAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFTb3J0QnkgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5LFxyXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmUsXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICRjbGVhci5lYWNoKGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcblxyXG4gICAgICAgIGlmKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlciAhPSAkZGVmYXVsdEZpbHRlcikge1xyXG5cclxuICAgICAgICAgICAgJGVsbS5zaG93KCk7XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcblxyXG4gICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuXHJcbiAgICAgICAgICAgIHZhciBmbiA9IGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgICAgICAgICBlbG0uZmluZCgnLicrJGFjdGl2ZUNsYXNzKS5yZW1vdmVDbGFzcygkYWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmZpbmQoJ1snKyRkYXRhRmlsdGVyKyc9XCInKyRkZWZhdWx0RmlsdGVyKydcIl0nKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgICAgICAgICAgZWxtLmZpbmQoJ1snKyRkYXRhU29ydEJ5Kyc9XCInKyRkZWZhdWx0U29ydCsnXCJdJykuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCgkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uZmlsdGVyQ29udGFpbmVyLCBmbik7XHJcbiAgICAgICAgICAgICQuZWFjaCgkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uc29ydENvbnRhaW5lciwgZm4pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkY2xlYXIgPSAkKCdbJyt0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIrJ10nKSxcclxuICAgICAgICAkZGF0YUZvckNvbnRhaW5lciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICRjbGVhci5lYWNoKGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICRpc0ZvciA9ICRjbGVhci5hdHRyKCRkYXRhRm9yQ29udGFpbmVyKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgJGNvbnRhaW5lciA9ICgkaXNGb3IgPT09IGZhbHNlKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3RvcigkaXNGb3IpO1xyXG5cclxuICAgICAgICAkZWxtLmhpZGUoKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCgkY29udGFpbmVyLCBmdW5jdGlvbigka2V5LCAkaW5zdGFuY2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkc2VsZi51c2VIYXNoID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuaGFzaC5fc2V0SGFzaC5jYWxsKCRzZWxmLCAkaW5zdGFuY2UsICRkZWZhdWx0RmlsdGVyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGluc3RhbmNlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICRkZWZhdWx0RmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICRkZWZhdWx0U29ydFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGVsbS5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciAkYXJncyA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgICAgaW5zdGFuY2VzID0gW107XG5cbiAgICBpZih0eXBlb2Ygd2luZG93Lklzb3RvcGUgIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGFsZXJ0KFwic2ltcGxlSXNvdG9wZTogSXNvdG9wZS5KUyBjb3VsZG4ndCBiZSBmb3VuZC4gUGxlYXNlIGluY2x1ZGUgJ2lzb3RvcGUucGtnZC5taW4uanMnLlwiKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJC5lYWNoKHRoaXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICBjb250YWluZXI6ICQoZWxtKSxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaXRlbVNlbGVjdG9yOiAnLml0ZW0nLFxuICAgICAgICAgICAgICAgIGRhdGFTZWxlY3RvcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAnZGF0YS1maWx0ZXInLFxuICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICdkYXRhLXNvcnQtYnknLFxuICAgICAgICAgICAgICAgICAgICBzb3J0QnlTZWxlY3RvcjogJ2RhdGEtc29ydC1zZWxlY3RvcicsXG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXJlY3Rpb246ICdkYXRhLXNvcnQtZGlyZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZm9yQ29udGFpbmVyOiAnZGF0YS1mb3ItY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJGaWx0ZXI6ICdkYXRhLWNsZWFyLWZpbHRlcicsXG4gICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrOiAnZGF0YS1mZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRhLWZpbHRlci10eXBlJyxcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyTWV0aG9kOiAnZGF0YS1maWx0ZXItbWV0aG9kJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgc29ydDogXCJvcmlnaW5hbC1vcmRlclwiLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6ICdhY3RpdmUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaW5zdGFuY2VzLnB1c2gobmV3ICQuc2ltcGxlSXNvdG9wZSgkLmV4dGVuZChvYmosICRhcmdzKSkpO1xuICAgIH0pO1xuXG4gICAgJC5lYWNoKGluc3RhbmNlcywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcbiAgICAgICAgZWxtLnNvcnRlci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS5maWx0ZXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0uY2xlYXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0udGV4dC5fZmVlZGJhY2suY2FsbChlbG0pO1xuICAgICAgICBlbG0uY2xlYXIuX19jaGVjay5jYWxsKGVsbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5zdGFuY2VzO1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkYXJncyl7XG4gICAgJC5leHRlbmQodGhpcywgJGFyZ3MpO1xuXG4gICAgdmFyICRzZWxmID0gdGhpcyxcbiAgICAgICAgdGhlSGFzaCA9IHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5fZ2V0RmlsdGVyVGVzdE9yZ2luYWwgPSBJc290b3BlLnByb3RvdHlwZS5fZ2V0RmlsdGVyVGVzdDtcbiAgICBJc290b3BlLnByb3RvdHlwZS5fZ2V0RmlsdGVyVGVzdCA9IHRoaXMuX2dldEZpbHRlclRlc3QuYmluZCh0aGlzKTtcblxuICAgIHRoaXMuZ3VpZCA9IHRoaXMuY29udGFpbmVyLmF0dHIoXCJpZFwiKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKTtcbiAgICB0aGlzLmZpbHRlck11bHRpcGxlID0gKHRoaXMuY29udGFpbmVyLmF0dHIodGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnR5cGUpLnRvTG93ZXJDYXNlKCkgPT0gXCJtdWx0aXBsZVwiKTtcbiAgICB0aGlzLmZpbHRlck1ldGhvZCA9IHRoaXMuY29udGFpbmVyLmF0dHIodGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlck1ldGhvZCkudG9Mb3dlckNhc2UoKTtcblxuICAgIHRoaXMuZW5jb2RlVVJJID0gZmFsc2U7XG5cbiAgICAvL0ZpcnN0IHRpbWUgaW5pdCBpc290b3BlXG4gICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSA9IHtcbiAgICAgICAgaXNvdG9wZTogbmV3IElzb3RvcGUodGhpcy5jb250YWluZXIuY29udGV4dCwge1xuICAgICAgICAgICAgZmlsdGVyOiB0aGVIYXNoIHx8IFwiKlwiLFxuICAgICAgICAgICAgaXRlbVNlbGVjdG9yOiAkc2VsZi5zZXR0aW5ncy5pdGVtU2VsZWN0b3IgfHwgJy5pdGVtJyxcbiAgICAgICAgICAgIGxheW91dE1vZGU6ICRzZWxmLmNvbnRhaW5lci5kYXRhKFwibGF5b3V0XCIpIHx8IFwiZml0Um93c1wiLFxuICAgICAgICAgICAgZ2V0U29ydERhdGE6ICRzZWxmLl9nZXRTb3J0RGF0YSgpXG4gICAgICAgIH0pLFxuICAgICAgICBmaWx0ZXJDb250YWluZXI6IHt9LFxuICAgICAgICBzb3J0Q29udGFpbmVyOiB7fVxuICAgIH07XG5cbiAgICBpZih0aGlzLmNvbnRhaW5lci5kYXRhKFwiaGFzaFwiKSAhPT0gbnVsbCAmJiB0aGlzLmNvbnRhaW5lci5kYXRhKFwiaGFzaFwiKSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHRoaXMudXNlSGFzaCA9IHRydWU7XG4gICAgfVxuXG4gICAgLy9BZGQgaGFzaCBzdXBwb3J0XG4gICAgJCh3aW5kb3cpLm9uKCdoYXNoY2hhbmdlJywgdGhpcy5oYXNoLl9vbkhhc2hDaGFuZ2VkLmJpbmQodGhpcykpO1xuXG4gfTtcbiIsIi8qKlxuICogX2NoZWNrQWN0aXZlOiBDaGVjayBpZiBidXR0b25zIG5lZWQgYW4gYWN0aXZlIGNsYXNzXG4gKiBAc2luY2UgMC4xLjBcbiAqIEBwYXJhbSB7b2JqZWN0fSAkaW5zdGFuY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSAkZGF0YUZpbHRlclxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlLCAkZGF0YUZpbHRlcikge1xuXG4gICAgdmFyICRkYXRhRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcixcbiAgICAgICAgJGRlZmF1bHRGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmZpbHRlcixcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZTtcblxuICAgICQoXCJbXCIrJGRhdGFGaWx0ZXIrXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG5cbiAgICAkLmVhY2goJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyLnNwbGl0KFwiLFwiKSwgZnVuY3Rpb24oIGluZGV4LCBmaWx0ZXIgKSB7XG4gICAgICAgIHZhciBhY3RpdmUgPSAkKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIitmaWx0ZXIrXCJcXFwiXVwiKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xuXG4gICAgICAgIGlmKGFjdGl2ZS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkKFwiW1wiKyRkYXRhRmlsdGVyK1wiPVxcXCJcIiskZGVmYXVsdEZpbHRlcitcIlxcXCJdXCIpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XG4gICAgICAgIH1cbiAgICB9KTtcblxufTtcbiIsIi8qKlxyXG4qIF9jcmVhdGVCdXR0b25zIGFuZCBhZGQgZXZlbnRzIHRvIGl0XHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG5cclxuICAgIHZhciAkZmlsdGVycyA9ICQoJ1snK3RoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIrJ10nKSwvL0dldCBhbGwgZmlsdGVyIGVsZW1lbnRzXHJcbiAgICAgICAgJGRhdGFGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhRm9yQ29udGFpbmVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZvckNvbnRhaW5lcixcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJGZpbHRlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgIGVsbSA9ICQoZWxtKTtcclxuXHJcbiAgICAgICAgdmFyICRmaWx0ZXJDb250YWluZXIgPSAgIGVsbS5jbG9zZXN0KCdbJyskZGF0YUZvckNvbnRhaW5lcisnXScpLCAvL0dldCBwYXJlbnQgd2l0aCBkYXRhLWZvci1jb250YWluZXJcclxuICAgICAgICAgICAgJGNvbnRhaW5lciA9ICAgICAgICAgKCRmaWx0ZXJDb250YWluZXIubGVuZ3RoID09IDApID8gJHNlbGYuX2dldEluc3RhbmNlcygpIDogJHNlbGYuX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yKCRmaWx0ZXJDb250YWluZXIuYXR0cigkZGF0YUZvckNvbnRhaW5lcikpLFxyXG4gICAgICAgICAgICAkZGF0YUZpbHRlckF0dHIgPSAgICBlbG0uYXR0cigkZGF0YUZpbHRlciksXHJcbiAgICAgICAgICAgIGZpbHRlckNvbnRhaW5lcklkID0gICgkZmlsdGVyQ29udGFpbmVyLmF0dHIoXCJpZFwiKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcblxyXG4gICAgICAgIGlmKCRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5maWx0ZXJDb250YWluZXJbZmlsdGVyQ29udGFpbmVySWRdID09IG51bGwpIHtcclxuICAgICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLmZpbHRlckNvbnRhaW5lcltmaWx0ZXJDb250YWluZXJJZF0gPSAkZmlsdGVyQ29udGFpbmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZWxtLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgdmFyICRmaWx0ZXJWYWx1ZSA9ICcnLFxyXG4gICAgICAgICAgICAgICAgdmFsID0gJGZpbHRlclZhbHVlID0gJGRhdGFGaWx0ZXJBdHRyO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKCRjb250YWluZXIsIGZ1bmN0aW9uKGtleSwgJGluc3RhbmNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLmhhc2guX3NldEhhc2guY2FsbCgkc2VsZiwgJGluc3RhbmNlLCAkZmlsdGVyVmFsdWUpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNlbGYuZmlsdGVyTXVsdGlwbGUpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlciA9PSBcIipcIiB8fCAkZmlsdGVyVmFsdWUgPT0gXCIqXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vRG8gbm90aGluZ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2UgaWYoJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyLmluZGV4T2YoJGZpbHRlclZhbHVlKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRpbnN0YW5jZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUucHVzaCh2YWwpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGZpbHRlclZhbHVlLmpvaW4oXCIsXCIpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlID0gJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZS5zcGxpY2UoJGZpbHRlclZhbHVlLmluZGV4T2YodmFsKSwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkZmlsdGVyVmFsdWUuam9pbihcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRmaWx0ZXJWYWx1ZSA9PSBcIlwiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSBcIipcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJGluc3RhbmNlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICRmaWx0ZXJWYWx1ZVxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfSk7XHJcblxyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLCIvKipcbiogX2Zvcm1hdEhhc2g6IEZvcm1hdCBtdWx0aXBsZSBmaWx0ZXJzIGludG8gb25lIHN0cmluZyBiYXNlZCBvbiBhIHJlZ3VsYXIgZXhwcmVzc2lvblxuKiBAc2luY2UgMC4xLjBcbiogQHBhcmFtIHtyZWdleH0gcmVcbiogQHBhcmFtIHtzdHJpbmd9IHN0clxuKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocmUsIHN0cikge1xuICAgIHZhciBtYXRjaGVzID0ge30sXG4gICAgICAgIG1hdGNoO1xuXG4gICAgd2hpbGUgKChtYXRjaCA9IHJlLmV4ZWMoc3RyKSkgIT0gbnVsbCkge1xuICAgICAgICBpZiAobWF0Y2guaW5kZXggPT09IHJlLmxhc3RJbmRleCkge1xuICAgICAgICAgICAgcmUubGFzdEluZGV4Kys7XG4gICAgICAgIH1cblxuICAgICAgICBpZihtYXRjaFszXSAhPT0gbnVsbCAmJiBtYXRjaFszXSAhPT0gdW5kZWZpbmVkKSB7XG5cbiAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2hbM11dID0gdHJ1ZTtcblxuICAgICAgICB9IGVsc2Uge1xuXG4gICAgICAgICAgICBpZihtYXRjaGVzW21hdGNoWzFdXSA9PSBudWxsIHx8IG1hdGNoZXNbbWF0Y2hbMV1dID09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2hbMV1dID0gW107XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXS5wdXNoKG1hdGNoWzJdKTtcblxuICAgICAgICB9XG5cbiAgICB9XG5cbiAgICByZXR1cm4gbWF0Y2hlcztcbn07XG4iLCIvKipcbiAqIF9nZXRIYXNoOiBHZXQgd2luZG93LmxvY2F0aW9uLmhhc2ggYW5kIGZvcm1hdCBpdCBmb3IgSXNvdG9wZVxuICogQHNpbmNlIDAuMS4wXG4gKi9cblxuIG1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyICRoYXNoID0gd2luZG93LmxvY2F0aW9uLmhhc2ggfHwgZmFsc2UsXG4gICAgICAgICRuZXdIYXNoID0gXCJcIjtcblxuICAgICRoYXNoID0gKCRoYXNoICE9PSBmYWxzZSAmJiAkaGFzaCAhPSBcIiNcIiAmJiAkaGFzaCAhPSBcIlwiKSA/IGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaGFzaCkgOiAnKic7XG5cbiAgICAvL1JlbW92ZSBoYXNoIGZyb20gZmlyc3QgY2hhcmFjdGVyIGlmIGl0cyBleGlzdFxuICAgIGlmICgkaGFzaC5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgICAgJGhhc2ggPSAkaGFzaC5zbGljZSgxKTtcbiAgICB9XG5cbiAgICB2YXIgaGFzaEFycmF5ID0gJGhhc2guc3BsaXQoXCImXCIpO1xuICAgICQuZWFjaChoYXNoQXJyYXksIGZ1bmN0aW9uKGtleSwgJHBhcnRIYXNoKSB7XG5cbiAgICAgICAgaWYoJHBhcnRIYXNoLmluZGV4T2YoXCI9XCIpICE9PSAtMSkge1xuXG4gICAgICAgICAgICB2YXIgdG1wID0gJHBhcnRIYXNoLnNwbGl0KFwiPVwiKSxcbiAgICAgICAgICAgICAgICBhcnIgPSBbXTtcblxuICAgICAgICAgICAgaWYodG1wLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgICAgICAgICB2YXIgbmFtZSA9IHRtcFswXSxcbiAgICAgICAgICAgICAgICAgICAgdmFsdWVzID0gdG1wWzFdLnJlcGxhY2UoL1xcJy9nLCBcIlwiKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFsdWVzID0gdmFsdWVzLnNwbGl0KFwiLFwiKTtcbiAgICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBhcnIucHVzaChcIltkYXRhLVwiICsgbmFtZSArIFwiPSdcIiArIHZhbHVlc1tpXSArIFwiJ11cIik7XG5cbiAgICAgICAgICAgICAgICAvLyAkKFwiW2RhdGEtZmlsdGVyPVxcXCJbZGF0YS1cIiArIG5hbWUgKyBcIj0nXCIgKyB2YWx1ZXNbaV0gKyBcIiddXFxcIl1cIikuYWRkQ2xhc3MoJHNlbGYuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmUpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAkbmV3SGFzaCArPSBhcnIuam9pbihcIixcIik7XG5cbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRuZXdIYXNoICs9ICgkcGFydEhhc2ggPT0gXCIqXCIgfHwgJHBhcnRIYXNoLmNoYXJBdCgwKSA9PSAnLicpID8gJHBhcnRIYXNoOiBcIi5cIiArICRwYXJ0SGFzaDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGtleSAhPSAoaGFzaEFycmF5Lmxlbmd0aCAtIDEpKSB7XG4gICAgICAgICAgICAkbmV3SGFzaCArPSBcIixcIjtcbiAgICAgICAgfVxuXG4gICAgfSk7XG5cbiAgICAgcmV0dXJuICRuZXdIYXNoO1xuXG4gfTtcbiIsIi8qKlxyXG4qIF9vbkhhc2hDaGFuZ2U6IGZpcmVzIHdoZW4gbG9jYXRpb24uaGFzaCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9zZXRJc290b3BlLmNhbGwodGhpcywgdGhpcy5oYXNoLl9nZXRIYXNoLmNhbGwodGhpcykpO1xyXG59O1xyXG4iLCIvKipcbiAqIF9zZXRIYXNoOiBTZXQgYSBuZXcgbG9jYXRpb24uaGFzaCBhZnRlciBmb3JtYXR0aW5nIGl0XG4gKiBAc2luY2UgMC4xLjBcbiAqIEBwYXJhbSB7b2JqZWN0fSAkaW5zdGFuY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSAkbmV3SGFzaFxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlLCAkbmV3SGFzaCkge1xuICAgIHZhciAkY3VycmVudEhhc2ggPSAoJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyID09IFwiKlwiKSA/IFwiXCIgOiAkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIsXG4gICAgICAgICRjb21iaW5lZEhhc2g7XG5cbiAgICBpZigkbmV3SGFzaCAhPSBcIipcIikge1xuXG4gICAgICAgIGlmKCRjdXJyZW50SGFzaC5pbmRleE9mKCRuZXdIYXNoKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICRjb21iaW5lZEhhc2ggPSAkY3VycmVudEhhc2ggKyAkbmV3SGFzaDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRjb21iaW5lZEhhc2ggPSAkY3VycmVudEhhc2gucmVwbGFjZSgkbmV3SGFzaCwgXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJGZvcm1hdHRlZEhhc2ggPSB0aGlzLmhhc2guX2Zvcm1hdEhhc2goL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdfCguW0EtWmEtejAtOV0rKS9nLCAkY29tYmluZWRIYXNoKSxcbiAgICAgICAgICAgICRlbmRIYXNoID0gW107XG5cbiAgICAgICAgJC5lYWNoKCRmb3JtYXR0ZWRIYXNoLCBmdW5jdGlvbihrZXksIGVsbSkge1xuICAgICAgICAgICAgaWYoZWxtID09PSB0cnVlKSB7Ly9pc0NsYXNzXG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaCggKGtleS5jaGFyQXQoMCkgPT0gJy4nKSA/IGtleS5zbGljZSgxKSA6IGtleSApO1xuICAgICAgICAgICAgfSBlbHNlIHsvL2lzT2JqZWN0XG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaChrZXkgKyBcIj1cIiArIGVsbS5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRlbmRIYXNoID0gJGVuZEhhc2guam9pbihcIiZcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGVuZEhhc2ggPSAkbmV3SGFzaDtcbiAgICB9XG5cbiAgICBpZigkZW5kSGFzaCA9PSBcIipcIiB8fCAkZW5kSGFzaCA9PSBcIlwiKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICh0aGlzLmVuY29kZVVSSSA9PT0gdHJ1ZSkgPyBlbmNvZGVVUklDb21wb25lbnQoJGVuZEhhc2gpIDogJGVuZEhhc2g7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbmRIYXNoO1xufTtcbiIsInZhciAkID0gd2luZG93LmpRdWVyeTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZSA9IHJlcXVpcmUoXCIuL2NvbnN0cnVjdG9yL3Byb3RvdHlwZS5qc1wiKTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZS5wcm90b3R5cGUgPSB7XHJcbiAgICBpbnN0YW5jZXM6IHt9LFxyXG4gICAgY29uc3RydWN0b3I6ICQuc2ltcGxlSXNvdG9wZSxcclxuXHJcbiAgICBoYXNoOiB7XHJcbiAgICAgICAgX2dldEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX2dldEhhc2guanNcIiksXHJcbiAgICAgICAgX3NldEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX3NldEhhc2guanNcIiksXHJcbiAgICAgICAgX2Zvcm1hdEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX2Zvcm1hdEhhc2guanNcIiksXHJcbiAgICAgICAgX29uSGFzaENoYW5nZWQ6IHJlcXVpcmUoXCIuL2hhc2gvX29uSGFzaENoYW5nZWQuanNcIilcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vZmlsdGVyL19jcmVhdGVCdXR0b25zLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vZmlsdGVyL19jaGVjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIHNvcnRlcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9zb3J0ZXIvX2NyZWF0ZUJ1dHRvbnMuanNcIiksXHJcbiAgICAgICAgX2NoZWNrOiByZXF1aXJlKFwiLi9zb3J0ZXIvX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgY2xlYXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vY2xlYXIvX2NyZWF0ZUJ1dHRvbnMuanNcIiksXHJcbiAgICAgICAgX2NoZWNrOiByZXF1aXJlKFwiLi9jbGVhci9fY2hlY2suanNcIiksXHJcbiAgICAgICAgX19jaGVjazogcmVxdWlyZShcIi4vY2xlYXIvX19jaGVjay5qc1wiKVxyXG4gICAgfSxcclxuICAgIHRleHQ6IHtcclxuICAgICAgICBfZmVlZGJhY2s6IHJlcXVpcmUoXCIuL3RleHQvX2ZlZWRiYWNrLmpzXCIpXHJcbiAgICB9LFxyXG5cclxuICAgIHV0aWxzOiByZXF1aXJlKFwiLi91dGlscy9pbmRleC5qc1wiKSxcclxuXHJcbiAgICAvKipcclxuICAgICogX29uQmVmb3JlSXNvdG9wZUNoYW5nZTogZmlyZXMgYmVmb3JlIHRoZSBJc290b3BlIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiAgICAqL1xyXG4gICAgX29uQmVmb3JlSXNvdG9wZUNoYW5nZTogZnVuY3Rpb24oJGluc3RhbmNlKSB7fSxcclxuXHJcbiAgICAvKipcclxuICAgICogX29uSXNvdG9wZUNoYW5nZTogZmlyZXMgd2hlbiB0aGUgSXNvdG9wZSBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZFxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9vbklzb3RvcGVDaGFuZ2U6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xyXG4gICAgICAgIHRoaXMuZmlsdGVyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy5zb3J0ZXIuX2NoZWNrLmNhbGwodGhpcywgJGluc3RhbmNlKTtcclxuXHJcbiAgICAgICAgdGhpcy5jbGVhci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgIHRoaXMudGV4dC5fZmVlZGJhY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX3NldElzb3RvcGU6IFJlY29uZmlndXJlIGlzb3RvcGVcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkc2VsZWN0b3JcclxuICAgICovXHJcbiAgICBfc2V0SXNvdG9wZTogZnVuY3Rpb24oJHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICBmaWx0ZXI6ICRzZWxlY3RvclxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UodGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBfZ2V0U29ydERhdGE6IEdldCB0aGUgZGF0YS1zb3J0LWJ5IGF0dHJpYnV0ZXMgYW5kIG1ha2UgdGhlbSBpbnRvIGFuIElzb3RvcGUgXCJnZXRTb3J0RGF0YVwiIG9iamVjdFxyXG4gICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAgKi9cclxuICAgIF9nZXRTb3J0RGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRzb3J0RGF0YSA9IHt9LFxyXG4gICAgICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgICAgICRkYXRhU29ydEJ5U2VsZWN0b3IgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5U2VsZWN0b3IsXHJcbiAgICAgICAgICAgICRkYXRhU29ydEJ5RGVmYXVsdCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydDtcclxuXHJcbiAgICAgICAgJCgnWycgKyAkZGF0YVNvcnRCeSArICddLCBbJyArICRkYXRhU29ydEJ5U2VsZWN0b3IgKyAnXScpLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICAkbmFtZSA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeSkgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgICRzZWxlY3RvciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeVNlbGVjdG9yKSB8fCBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYoJG5hbWUgIT0gJGRhdGFTb3J0QnlEZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZigkbmFtZSAhPT0gbnVsbCAmJiAkc2VsZWN0b3IgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydERhdGFbJG5hbWVdID0gJHNlbGVjdG9yO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIklzb3RvcGUgc29ydGluZzogXCIrJGRhdGFTb3J0QnkrXCIgYW5kIFwiKyRkYXRhU29ydEJ5U2VsZWN0b3IrXCIgYXJlIHJlcXVpcmVkLiBDdXJyZW50bHkgY29uZmlndXJlZCBcIiskZGF0YVNvcnRCeStcIj0nXCIgKyAkbmFtZSArIFwiJyBhbmQgXCIrJGRhdGFTb3J0QnlTZWxlY3RvcitcIj0nXCIgKyAkc2VsZWN0b3IgKyBcIidcIilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gJHNvcnREYXRhO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX3RvZ2dsZUNsYXNzOiBIZWxwZXIgdG8gdG9nZ2xlIG9yIHJlbW92ZSBjbGFzc2VzIGVhc2llclxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtlbGVtZW50fSAkZWxtXHJcbiAgICAqIEBwYXJhbSB7ZWxlbWVudH0gJGNvbnRhaW5lclxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXHJcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbXVsdGlwbGVcclxuICAgICogQHBhcmFtIHtib29sZWFufSBtYXRjaFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gZmluZERlZmF1bHRcclxuICAgICovXHJcbiAgICBfdG9nZ2xlQ2xhc3M6IGZ1bmN0aW9uKCRlbG0sICRjb250YWluZXIsIGNsYXNzTmFtZSwgbXVsdGlwbGUsIG1hdGNoLCBmaW5kRGVmYXVsdCkge1xyXG4gICAgICAgIG1hdGNoID0gbWF0Y2ggfHwgZmFsc2U7XHJcbiAgICAgICAgbXVsdGlwbGUgPSBtdWx0aXBsZSB8fCBmYWxzZTtcclxuXHJcbiAgICAgICAgaWYobXVsdGlwbGUgIT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICBpZihtYXRjaCkge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCcuJytjbGFzc05hbWUpLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAkZWxtLmFkZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoZmluZERlZmF1bHQpLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICAgICAkZWxtLnRvZ2dsZUNsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKCcuJytjbGFzc05hbWUpLnJlbW92ZUNsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgICAgICRlbG0uYWRkQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAkZWxtLmhhc0NsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfZ2V0SW5zdGFuY2VzXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKi9cclxuICAgIF9nZXRJbnN0YW5jZXM6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciB0bXAgPSBbXVxyXG5cclxuICAgICAgICAkLmVhY2godGhpcy5pbnN0YW5jZXMsIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgICAgIHRtcC5wdXNoKGVsbS5pc290b3BlKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHRtcDtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9nZXRFbGVtZW50c0Zyb21TZWxlY3RvclxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICovXHJcbiAgICBfZ2V0RWxlbWVudHNGcm9tU2VsZWN0b3I6IGZ1bmN0aW9uKHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdmFyICR0bXA7XHJcblxyXG4gICAgICAgIGlmKHNlbGVjdG9yLmNoYXJBdCgwKSA9PSBcIiNcIiB8fCBzZWxlY3Rvci5jaGFyQXQoMCkgPT0gXCIuXCIpIHtcdFx0XHRcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZihcIiNcIikgIT09IC0xIHx8IHNlbGVjdG9yLmluZGV4T2YoXCIuXCIpICE9PSAtMSkge1x0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZihzZWxlY3Rvci5pbmRleE9mKFwiIFwiKSAhPT0gLTEpIHtcdFx0XHRcdFx0XHRcdFx0XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICAgICAgfSBlbHNlIHtcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0Ly9ldnVsYXRlIHRoZSBzdHJpbmcgYXMgYW4gaWRcclxuICAgICAgICAgICAgJHRtcCA9ICQoXCIjXCIgKyBzZWxlY3Rvcik7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBpZigkdG1wLmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJzaW1wbGVJc290b3BlOiBXZSBjYW5ub3QgZmluZCBhbnkgRE9NIGVsZW1lbnQgd2l0aCB0aGUgQ1NTIHNlbGVjdG9yOiBcIiArIHNlbGVjdG9yKTtcclxuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgIHZhciAkdG1wQXJyID0gW107XHJcbiAgICAgICAgICAgICQuZWFjaCh0aGlzLmluc3RhbmNlcywgZnVuY3Rpb24oa2V5LCBpbnN0YW5jZSkge1xyXG4gICAgICAgICAgICAgICAgaWYoJChpbnN0YW5jZS5pc290b3BlLmVsZW1lbnQpWzBdID09PSAkdG1wWzBdKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHRtcEFyci5wdXNoKGluc3RhbmNlLmlzb3RvcGUpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgcmV0dXJuICR0bXBBcnI7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyByZXR1cm4gJHRtcDtcclxuICAgIH0sXHJcblxyXG4gICAgX2dldEZpbHRlclRlc3Q6IGZ1bmN0aW9uKGZpbHRlcikge1xyXG4gICAgICAgIHZhciAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgICAgIHJldHVybiBmdW5jdGlvbiggaXRlbSApIHtcclxuXHJcbiAgICAgICAgICAgIHZhciBmaWx0ZXJzID0gZmlsdGVyLnNwbGl0KFwiLFwiKSxcclxuICAgICAgICAgICAgICAgIGFjdGl2ZSA9IFtdO1xyXG5cclxuICAgICAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGZpbHRlcnMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihmaWx0ZXJzW2ldLmluZGV4T2YoXCJkYXRhLVwiKSAhPT0gLTEpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGNhdCA9IGZpbHRlcnNbaV0ucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMVwiKS50cmltKCk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbHVlID0gZmlsdGVyc1tpXS5yZXBsYWNlKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXS9nLCBcIiQyXCIpLnRyaW0oKTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0ICkuaW5kZXhPZiggdmFsdWUgKSAhPT0gLTEgKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZS5wdXNoKHZhbHVlKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuaXMoIGZpbHRlcnNbaV0gKSApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgYWN0aXZlLnB1c2goZmlsdGVyc1tpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGlmKCRzZWxmLmZpbHRlck1ldGhvZCA9PSBcIm9yXCIpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY3RpdmUubGVuZ3RoID4gMDtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBhY3RpdmUubGVuZ3RoID09IGZpbHRlcnMubGVuZ3RoO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcblxyXG59O1xyXG5cclxuJC5mbi5zaW1wbGVJc290b3BlID0gcmVxdWlyZShcIi4vY29uc3RydWN0b3IvanF1ZXJ5LmpzXCIpXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQuZWFjaCgkKFwiW2RhdGEtaXNvdG9wZV1cIiksIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgJChlbG0pLnNpbXBsZUlzb3RvcGUoKTtcclxuICAgIH0pXHJcbn0pO1xyXG5cclxuLy8gQWRkIGJpbmQgc3VwcG9ydFxyXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS5iaW5kKSB7XHJcbiAgRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQgPSBmdW5jdGlvbihvVGhpcykge1xyXG4gICAgaWYgKHR5cGVvZiB0aGlzICE9PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgIC8vIGNsb3Nlc3QgdGhpbmcgcG9zc2libGUgdG8gdGhlIEVDTUFTY3JpcHQgNVxyXG4gICAgICAvLyBpbnRlcm5hbCBJc0NhbGxhYmxlIGZ1bmN0aW9uXHJcbiAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoJ0Z1bmN0aW9uLnByb3RvdHlwZS5iaW5kIC0gd2hhdCBpcyB0cnlpbmcgdG8gYmUgYm91bmQgaXMgbm90IGNhbGxhYmxlJyk7XHJcbiAgICB9XHJcblxyXG4gICAgdmFyIGFBcmdzICAgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpLFxyXG4gICAgICAgIGZUb0JpbmQgPSB0aGlzLFxyXG4gICAgICAgIGZOT1AgICAgPSBmdW5jdGlvbigpIHt9LFxyXG4gICAgICAgIGZCb3VuZCAgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHJldHVybiBmVG9CaW5kLmFwcGx5KHRoaXMgaW5zdGFuY2VvZiBmTk9QICYmIG9UaGlzXHJcbiAgICAgICAgICAgICAgICAgPyB0aGlzXHJcbiAgICAgICAgICAgICAgICAgOiBvVGhpcyxcclxuICAgICAgICAgICAgICAgICBhQXJncy5jb25jYXQoQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSkpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgZk5PUC5wcm90b3R5cGUgPSB0aGlzLnByb3RvdHlwZTtcclxuICAgIGZCb3VuZC5wcm90b3R5cGUgPSBuZXcgZk5PUCgpO1xyXG5cclxuICAgIHJldHVybiBmQm91bmQ7XHJcbiAgfTtcclxufVxyXG5pZiAoIUZ1bmN0aW9uLnByb3RvdHlwZS50cmltKSB7XHJcbiAgICBTdHJpbmcucHJvdG90eXBlLnRyaW0gPSBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5yZXBsYWNlKC9eXFxzK3xcXHMrJC9nLCAnJyk7XHJcbiAgICB9XHJcbn1cclxuIiwiLyoqXG4gKiBfY2hlY2tBY3RpdmU6IENoZWNrIGlmIGJ1dHRvbnMgbmVlZCBhbiBhY3RpdmUgY2xhc3NcbiAqIEBzaW5jZSAwLjEuMFxuICogQHBhcmFtIHtvYmplY3R9ICRpbnN0YW5jZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlKSB7XG4gICAgLy9EbyBub3RoaW5nIGZvciBub3dcbn07XG4iLCIvKipcclxuKiBfY3JlYXRlQnV0dG9ucyBhbmQgYWRkIGV2ZW50cyB0byBpdFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkc29ydGVycyA9ICQoJ1snK3RoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnkrJ10nKSwvL0dldCBhbGwgc29ydCBlbGVtZW50c1xyXG4gICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkZGF0YUZvckNvbnRhaW5lciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIsXHJcbiAgICAgICAgJGRhdGFTb3J0RGlyZWN0aW9uID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRzb3J0QXJyYXkgPSBbXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJHNvcnRlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG5cclxuICAgICAgICB2YXIgJHNvcnRDb250YWluZXIgPSAgICRlbG0uY2xvc2VzdCgnWycrJGRhdGFGb3JDb250YWluZXIrJ10nKSxcclxuICAgICAgICAgICAgJGNvbnRhaW5lciA9ICAgICAgICgkc29ydENvbnRhaW5lci5sZW5ndGggPT0gMCkgPyAkc2VsZi5fZ2V0SW5zdGFuY2VzKCkgOiAkc2VsZi5fZ2V0RWxlbWVudHNGcm9tU2VsZWN0b3IoJHNvcnRDb250YWluZXIuYXR0cigkZGF0YUZvckNvbnRhaW5lcikpLFxyXG4gICAgICAgICAgICAkZGF0YVNvcnRBdHRyID0gICAgJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSxcclxuICAgICAgICAgICAgc29ydENvbnRhaW5lcklkID0gICgkc29ydENvbnRhaW5lci5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCkpO1xyXG5cclxuICAgICAgICBpZigkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uc29ydENvbnRhaW5lcltzb3J0Q29udGFpbmVySWRdID09IG51bGwpIHtcclxuICAgICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLnNvcnRDb250YWluZXJbc29ydENvbnRhaW5lcklkXSA9ICRzb3J0Q29udGFpbmVyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdmFyIGhvdyA9IHtcclxuICAgICAgICAgICAgZXZlbnROYW1lOiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/IFwiY2hhbmdlXCIgOiBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgIGVsZW1lbnQ6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gJGVsbS5jbG9zZXN0KFwic2VsZWN0XCIpIDogJGVsbVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGhvdy5lbGVtZW50Lm9uKGhvdy5ldmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgaWYoaG93LmV2ZW50TmFtZSA9PSBcImNoYW5nZVwiKSB7XHJcbiAgICAgICAgICAgICAgICBpZihob3cuZWxlbWVudC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXSAhPSBlbG0pIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciAkc29ydEJ5VmFsdWUgPSAnJztcclxuICAgICAgICAgICAgaWYoJHNlbGYuZmlsdGVyTXVsdGlwbGUgIT09IGZhbHNlKSB7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJGRhdGFTb3J0QXR0ciA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydEFycmF5ID0gW107XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRBcnJheS5wdXNoKCRkYXRhU29ydEF0dHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkuc3BsaWNlKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSwgMSlcclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSAkZGVmYXVsdFNvcnQ7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRzb3J0QXJyYXk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRhdGFTb3J0QXR0cjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgJC5lYWNoKCRjb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgJHNvcnRBc2MgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKSAhPT0gbnVsbCAmJiAkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikudG9Mb3dlckNhc2UoKSA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0QnkpID09ICRkZWZhdWx0U29ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICBjb250YWluZXIuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEJ5OiAkc29ydEJ5VmFsdWUsXHJcbiAgICAgICAgICAgICAgICAgICAgc29ydEFzY2VuZGluZzogJHNvcnRBc2NcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgY29udGFpbmVyKTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyICRmZWVkYmFjayA9ICQoJ1snK3RoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mZWVkYmFjaysnXScpLFxyXG4gICAgICAgICRkYXRhRm9yQ29udGFpbmVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZvckNvbnRhaW5lcixcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJGZlZWRiYWNrLmVhY2goZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgJGlzRm9yID0gJGZlZWRiYWNrLmF0dHIoJGRhdGFGb3JDb250YWluZXIpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAkY29udGFpbmVyID0gKCRpc0ZvciA9PT0gZmFsc2UpID8gJHNlbGYuX2dldEluc3RhbmNlcygpIDogJHNlbGYuX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yKCRpc0Zvcik7XHJcblxyXG4gICAgICAgICQuZWFjaCgkY29udGFpbmVyLCBmdW5jdGlvbigka2V5LCAkaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgJGVsbS50ZXh0KCRlbG0uYXR0cihcImRhdGEtZmVlZGJhY2tcIikucmVwbGFjZShcIntkZWx0YX1cIiwgJGluc3RhbmNlLmZpbHRlcmVkSXRlbXMubGVuZ3RoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcbiIsbnVsbF19
