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
                    type: 'data-filter-type'
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

    this.guid = this.container.attr("id") || new Date().getTime();
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
* _createButtons and add events to it
* @since 0.1.0
*/

module.exports = function() {

    var $filters = $('['+this.settings.dataSelectors.filter+']'),//Get all filter elements
        $dataFilter = this.settings.dataSelectors.filter,
        $dataForContainer = this.settings.dataSelectors.forContainer,
        $dataType = this.settings.dataSelectors.type,
        $defaultFilter = this.settings.defaults.filter,
        $activeClass = this.settings.defaults.classNames.active,
        $self = this;

    $filters.each(function(idx, elm) {
        elm = $(elm);

        // if(elm.data("filter-set") != "1") {

            var $filterContainer =   elm.closest('['+$dataForContainer+']'), //Get parent with data-for-container
                $multiple =          ($filterContainer.length == 0) ? false : $filterContainer.attr($dataType) || false,
                $container =         ($filterContainer.length == 0) ? $self._getInstances() : $self._getElementsFromSelector($filterContainer.attr($dataForContainer)),
                $dataFilterAttr =    elm.attr($dataFilter),
                filterContainerId =  ($filterContainer.attr("id") || new Date().getTime());

            if($self.instances[$self.guid].filterContainer[filterContainerId] == null) {
                $self.instances[$self.guid].filterContainer[filterContainerId] = $filterContainer;
            }

            elm.on('click', function(e) {
                e.preventDefault();

                var $filterValue = '',
                    active = $self._toggleClass(elm, $filterContainer, $activeClass, $multiple, $dataFilterAttr == $defaultFilter, '['+$dataFilter+'="'+$defaultFilter+'"]');

                var val = $filterValue = $dataFilterAttr;
                $.each($container, function(key, $instance) {

                    if($self.useHash === true) {
                        $self.hash._setHash.call($self, $instance, $filterValue, active);
                    } else {

                        if($multiple) {

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

            // $(elm).data("filter-set", "1");
        // }

    });
};

},{}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
/**
 * _getHash: Get window.location.hash and format it for Isotope
 * @since 0.1.0
 */

 module.exports = function() {
    var $hash = window.location.hash || false,
        $newHash = "",
        $self = this;

    $hash = ($hash !== false && $hash != "#" && $hash != "") ? decodeURIComponent(window.location.hash) : '*';

    //Remove hash from first character if its exist
    if ($hash.charAt(0) === '#') {
         $hash = $hash.slice(1);
    }

    $.each($hash.split("&"), function(key, $partHash) {

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

                $("[data-filter=\"[data-" + name + "='" + values[i] + "']\"]").addClass($self.settings.defaults.classNames.active);
            }

            $newHash += arr.join(",");

        } else {
            $newHash += $partHash
                .replace("#", ".")	  //replace "#" with "."
                .replace(/&/g, ", .");  //replace "&" with ", ."
        }

    });

    //  //Check if this is a data group
    //  if($hash.indexOf("=") !== -1) {
    //      $hash = $hash.split("&");
     //
    //      for (var i=0; i<$hash.length; i++) {
    //          var tmp = $hash[i].split("="),
    //              arr = [];
     //
    //          if(tmp.length > 1) {
    //              var name = tmp[0],
    //                  values = tmp[1];
    //          }
     //
    //          values = values.split(",");
    //          for (var i=0; i<values.length; i++) {
    //
    //              arr.push("[data-"+name+"='"+values[i]+"']");
    //          }
    //         //  console.log(arr);
    //      }
     //
    //      $newHash = arr.join("");
     //
    //  } else {
     //
    //      $newHash = $hash
    //          .replace("#", ".")	  //replace "#" with "."
    //          .replace(/&/g, ", .");  //replace "&" with ", ."
     //
    //  }

     return $newHash;

 };

},{}],9:[function(require,module,exports){
/**
* _onHashChange: fires when location.hash has been changed
* @since 0.1.0
*/
module.exports = function(e) {
    this._setIsotope.call(this, this.hash._getHash.call(this));
};

},{}],10:[function(require,module,exports){
/**
 * _setHash: Set a new location.hash after formatting it
 * @since 0.1.0
 * @param {object} $instance
 * @param {string} $newHash
 * @param {boolean} $active
 */

module.exports = function($instance, $newHash, $active) {
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
                $endHash.push(key);
            } else {//isObject
                $endHash.push(key + "=" + elm.join(","));
            }
        });

        $endHash = $endHash.join("&");
    } else {
        $endHash = $newHash;
    }

    // if($combinedHash.indexOf("data-") !== -1) {//Check if we filter on classes or data attributes
    //     var $formattedHash = this.hash._formatHash(/\[data\-(.+?)\=\'(.+?)\'\]/g, $combinedHash);
    //         // .replace(/\'|\"|\[|\]|\{|\}/g, "");
    //         // .replace(/\:/g, "=");
    //
    //     $combinedHash = "";
    //     console.log($formattedHash);
    //     $formattedHash.each(function(key, $elm) {
    //         $elm = $(elm);
    //
    //         $combinedHash
    //     });
    //
    // } else {
    //     $combinedHash = $combinedHash
    //         .replace(/\'/g, "")
    //         .replace(/\./g,"")	  //replace "." with nothing
    //         .replace(/\s/g,"")	  //replace " " with ""
    //         .replace(/\,/g,"&");	//replace "," with "&"
    // }

    if($endHash == "*" || $endHash == "") {
        window.location.hash = "";
    } else {
        window.location.hash = (this.encodeURI === true) ? encodeURIComponent($endHash) : $endHash;
    }

    return $endHash;
};

},{}],11:[function(require,module,exports){
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
        _createButtons: require("./filter/_createButtons.js")
    },
    sorter: {
        _createButtons: require("./sorter/_createButtons.js")
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

        if(filter.indexOf("data-") !== -1) {
            var cat = filter.replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$1").split(",");
            var value = filter.replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$2").split(",");

            cat = cat.map(Function.prototype.call, String.prototype.trim);
            value = value.map(Function.prototype.call, String.prototype.trim);

            // Notice: below is the jQuery filter function not the isotope function
            var active = value.filter(function( filter, index ) {
                return jQuery( item.element ).data( cat[index] ).indexOf( filter ) !== -1;
            });

            console.log(active, active.length, cat, cat.length);

            return active.length == cat.length;

        } else {
            return jQuery( item.element ).is( filter );
        }

    }
};

$.fn.simpleIsotope = require("./constructor/jquery.js")

$(document).ready(function() {
    $.each($("[data-isotope]"), function(key, elm) {
        $(elm).simpleIsotope();
    })
});


/*Isotope.prototype._getFilterTest = function( filter ) {
    if ( jQuery && this.options.isJQueryFiltering ) {
        // use jQuery
        return function( item ) {

            if(filter.indexOf("data-") !== -1) {
                var cat = filter.replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$1").split(",");
                var value = filter.replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$2").split(",");

                cat = cat.map(Function.prototype.call, String.prototype.trim);
                value = value.map(Function.prototype.call, String.prototype.trim);

                // Notice: below is the jQuery filter function not the isotope function
                var active = value.filter(function( filter, index ) {
                    return jQuery( item.element ).data( cat[index] ).indexOf( filter ) !== -1;
                });

                console.log(active, active.length, cat, cat.length);

                return active.length == cat.length;

            } else {
                return jQuery( item.element ).is( filter );
            }

        };
    }
    if ( typeof filter === 'function' ) {
        // use filter as function
        return function( item ) {
            return filter( item.element );
        };
    }
    // default, use filter as selector string
    return function( item ) {
        return matchesSelector( item.element, filter );
    };
};
*/

},{"./clear/__check.js":1,"./clear/_check.js":2,"./clear/_createButtons.js":3,"./constructor/jquery.js":4,"./constructor/prototype.js":5,"./filter/_createButtons.js":6,"./hash/_formatHash.js":7,"./hash/_getHash.js":8,"./hash/_onHashChanged.js":9,"./hash/_setHash.js":10,"./sorter/_createButtons.js":12,"./text/_feedback.js":13,"./utils/index.js":14}],12:[function(require,module,exports){
/**
* _createButtons and add events to it
* @since 0.1.0
*/

module.exports = function() {
    var $sorters = $('['+this.settings.dataSelectors.sortBy+']'),//Get all sort elements
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $dataForContainer = this.settings.dataSelectors.forContainer,
        $dataSortDirection = this.settings.dataSelectors.sortDirection,
        $dataType = this.settings.dataSelectors.type,
        $defaultSort = this.settings.defaults.sort,
        $activeClass = this.settings.defaults.classNames.active,
        $sortArray = [],
        $self = this;

    $sorters.each(function(idx, elm) {
        var $elm = $(elm);

        // if(elm.data("sort-set") != "1") {

            var $sortContainer =   $elm.closest('['+$dataForContainer+']'),
                $multiple =        ($sortContainer.length == 0) ? false : $sortContainer.attr($dataType) || false,
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

                $self._toggleClass($elm, $sortContainer, $activeClass, $multiple, $dataSortAttr == $defaultSort, '['+$dataSortBy+'="'+$defaultSort+'"]');

                if($multiple !== false) {

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

            // elm.data("sort-set", "1");
        // }

    });
};

},{}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){

},{}]},{},[11])(11)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxVc2Vyc1xcUGF1bFxcQXBwRGF0YVxcUm9hbWluZ1xcbnBtXFxub2RlX21vZHVsZXNcXGJyb3dzZXJpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3Nlci1wYWNrXFxfcHJlbHVkZS5qcyIsInNvdXJjZVxcY2xlYXJcXF9fY2hlY2suanMiLCJzb3VyY2VcXGNsZWFyXFxfY2hlY2suanMiLCJzb3VyY2VcXGNsZWFyXFxfY3JlYXRlQnV0dG9ucy5qcyIsInNvdXJjZVxcY29uc3RydWN0b3JcXGpxdWVyeS5qcyIsInNvdXJjZVxcY29uc3RydWN0b3JcXHByb3RvdHlwZS5qcyIsInNvdXJjZVxcZmlsdGVyXFxfY3JlYXRlQnV0dG9ucy5qcyIsInNvdXJjZVxcaGFzaFxcX2Zvcm1hdEhhc2guanMiLCJzb3VyY2VcXGhhc2hcXF9nZXRIYXNoLmpzIiwic291cmNlXFxoYXNoXFxfb25IYXNoQ2hhbmdlZC5qcyIsInNvdXJjZVxcaGFzaFxcX3NldEhhc2guanMiLCJzb3VyY2VcXHNpbXBsZS1pc290b3BlLmFtZC5qcyIsInNvdXJjZVxcc29ydGVyXFxfY3JlYXRlQnV0dG9ucy5qcyIsInNvdXJjZVxcdGV4dFxcX2ZlZWRiYWNrLmpzIiwic291cmNlXFx1dGlsc1xcaW5kZXguanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2xDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvT0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKipcclxuKiBfY2hlY2s6IENoZWNrIGlmIHdlIG5lZWQgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIGNsZWFyIGRpdiB3aXRob3V0IGFuIGluc3RhbmNlXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCh0aGlzLCB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUpO1xyXG59O1xyXG4iLCIvKipcclxuKiBfY2hlY2s6IENoZWNrIGlmIHdlIG5lZWQgdG8gZW5hYmxlIG9yIGRpc2FibGUgdGhlIGNsZWFyIGRpdi5cclxuKiBAc2luY2UgMC4xLjBcclxuKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiovXHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRpbnN0YW5jZSkge1xyXG4gICAgdmFyICRjbGVhciA9ICQoJ1snK3RoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5jbGVhckZpbHRlcisnXScpLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkZGVmYXVsdEZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhRmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcixcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJGNsZWFyLmVhY2goZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKTtcclxuXHJcbiAgICAgICAgaWYoJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyICE9ICRkZWZhdWx0RmlsdGVyKSB7XHJcblxyXG4gICAgICAgICAgICAkZWxtLnNob3coKTtcclxuXHJcbiAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICRlbG0uaGlkZSgpO1xyXG5cclxuICAgICAgICAgICAgdmFyIGZuID0gZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgICAgIGVsbS5maW5kKCcuJyskYWN0aXZlQ2xhc3MpLnJlbW92ZUNsYXNzKCRhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICBlbG0uZmluZCgnWycrJGRhdGFGaWx0ZXIrJz1cIicrJGRlZmF1bHRGaWx0ZXIrJ1wiXScpLmFkZENsYXNzKCRhY3RpdmVDbGFzcyk7XHJcbiAgICAgICAgICAgICAgICBlbG0uZmluZCgnWycrJGRhdGFTb3J0QnkrJz1cIicrJGRlZmF1bHRTb3J0KydcIl0nKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKCRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5maWx0ZXJDb250YWluZXIsIGZuKTtcclxuICAgICAgICAgICAgJC5lYWNoKCRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5zb3J0Q29udGFpbmVyLCBmbik7XHJcblxyXG4gICAgICAgIH1cclxuICAgIH0pO1xyXG5cclxufVxyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyICRjbGVhciA9ICQoJ1snK3RoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5jbGVhckZpbHRlcisnXScpLFxyXG4gICAgICAgICRkYXRhRm9yQ29udGFpbmVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZvckNvbnRhaW5lcixcclxuICAgICAgICAkZGVmYXVsdFNvcnQgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLnNvcnQsXHJcbiAgICAgICAgJGRlZmF1bHRGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmZpbHRlcixcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJGNsZWFyLmVhY2goZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgJGlzRm9yID0gJGNsZWFyLmF0dHIoJGRhdGFGb3JDb250YWluZXIpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAkY29udGFpbmVyID0gKCRpc0ZvciA9PT0gZmFsc2UpID8gJHNlbGYuX2dldEluc3RhbmNlcygpIDogJHNlbGYuX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yKCRpc0Zvcik7XHJcblxyXG4gICAgICAgICRlbG0uaGlkZSgpLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgJC5lYWNoKCRjb250YWluZXIsIGZ1bmN0aW9uKCRrZXksICRpbnN0YW5jZSkge1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRzZWxmLnVzZUhhc2ggPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZSwgJGRlZmF1bHRGaWx0ZXIpO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkaW5zdGFuY2UuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJGRlZmF1bHRGaWx0ZXIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJGRlZmF1bHRTb3J0XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICRzZWxmLl9vbklzb3RvcGVDaGFuZ2UuY2FsbCgkc2VsZiwgJGluc3RhbmNlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAkZWxtLmhpZGUoKTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICB9KTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpe1xuXG4gICAgdmFyICRhcmdzID0gYXJndW1lbnRzWzBdIHx8IHt9LFxuICAgICAgICBpbnN0YW5jZXMgPSBbXTtcblxuICAgIGlmKHR5cGVvZiB3aW5kb3cuSXNvdG9wZSAhPSBcImZ1bmN0aW9uXCIpIHtcbiAgICAgICAgYWxlcnQoXCJzaW1wbGVJc290b3BlOiBJc290b3BlLkpTIGNvdWxkbid0IGJlIGZvdW5kLiBQbGVhc2UgaW5jbHVkZSAnaXNvdG9wZS5wa2dkLm1pbi5qcycuXCIpXG4gICAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAkLmVhY2godGhpcywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcbiAgICAgICAgdmFyIG9iaiA9IHtcbiAgICAgICAgICAgIGNvbnRhaW5lcjogJChlbG0pLFxuICAgICAgICAgICAgc2V0dGluZ3M6IHtcbiAgICAgICAgICAgICAgICBpdGVtU2VsZWN0b3I6ICcuaXRlbScsXG4gICAgICAgICAgICAgICAgZGF0YVNlbGVjdG9yczoge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICdkYXRhLWZpbHRlcicsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJ2RhdGEtc29ydC1ieScsXG4gICAgICAgICAgICAgICAgICAgIHNvcnRCeVNlbGVjdG9yOiAnZGF0YS1zb3J0LXNlbGVjdG9yJyxcbiAgICAgICAgICAgICAgICAgICAgc29ydERpcmVjdGlvbjogJ2RhdGEtc29ydC1kaXJlY3Rpb24nLFxuICAgICAgICAgICAgICAgICAgICBmb3JDb250YWluZXI6ICdkYXRhLWZvci1jb250YWluZXInLFxuICAgICAgICAgICAgICAgICAgICBjbGVhckZpbHRlcjogJ2RhdGEtY2xlYXItZmlsdGVyJyxcbiAgICAgICAgICAgICAgICAgICAgZmVlZGJhY2s6ICdkYXRhLWZlZWRiYWNrJyxcbiAgICAgICAgICAgICAgICAgICAgdHlwZTogJ2RhdGEtZmlsdGVyLXR5cGUnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBkZWZhdWx0czoge1xuICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6IFwiKlwiLFxuICAgICAgICAgICAgICAgICAgICBzb3J0OiBcIm9yaWdpbmFsLW9yZGVyXCIsXG4gICAgICAgICAgICAgICAgICAgIGNsYXNzTmFtZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGFjdGl2ZTogJ2FjdGl2ZSdcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcblxuICAgICAgICBpbnN0YW5jZXMucHVzaChuZXcgJC5zaW1wbGVJc290b3BlKCQuZXh0ZW5kKG9iaiwgJGFyZ3MpKSk7XG4gICAgfSk7XG5cbiAgICAkLmVhY2goaW5zdGFuY2VzLCBmdW5jdGlvbihpZHgsIGVsbSkge1xuICAgICAgICBlbG0uc29ydGVyLl9jcmVhdGVCdXR0b25zLmNhbGwoZWxtKTtcbiAgICAgICAgZWxtLmZpbHRlci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS5jbGVhci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS50ZXh0Ll9mZWVkYmFjay5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS5jbGVhci5fX2NoZWNrLmNhbGwoZWxtKTtcbiAgICB9KTtcblxuICAgIHJldHVybiBpbnN0YW5jZXM7XG5cbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCRhcmdzKXtcbiAgICAkLmV4dGVuZCh0aGlzLCAkYXJncyk7XG5cbiAgICB2YXIgJHNlbGYgPSB0aGlzLFxuICAgICAgICB0aGVIYXNoID0gdGhpcy5oYXNoLl9nZXRIYXNoLmNhbGwodGhpcyk7XG5cbiAgICB0aGlzLmd1aWQgPSB0aGlzLmNvbnRhaW5lci5hdHRyKFwiaWRcIikgfHwgbmV3IERhdGUoKS5nZXRUaW1lKCk7XG4gICAgdGhpcy5lbmNvZGVVUkkgPSBmYWxzZTtcblxuICAgIC8vRmlyc3QgdGltZSBpbml0IGlzb3RvcGVcbiAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdID0ge1xuICAgICAgICBpc290b3BlOiBuZXcgSXNvdG9wZSh0aGlzLmNvbnRhaW5lci5jb250ZXh0LCB7XG4gICAgICAgICAgICBmaWx0ZXI6IHRoZUhhc2ggfHwgXCIqXCIsXG4gICAgICAgICAgICBpdGVtU2VsZWN0b3I6ICRzZWxmLnNldHRpbmdzLml0ZW1TZWxlY3RvciB8fCAnLml0ZW0nLFxuICAgICAgICAgICAgbGF5b3V0TW9kZTogJHNlbGYuY29udGFpbmVyLmRhdGEoXCJsYXlvdXRcIikgfHwgXCJmaXRSb3dzXCIsXG4gICAgICAgICAgICBnZXRTb3J0RGF0YTogJHNlbGYuX2dldFNvcnREYXRhKClcbiAgICAgICAgfSksXG4gICAgICAgIGZpbHRlckNvbnRhaW5lcjoge30sXG4gICAgICAgIHNvcnRDb250YWluZXI6IHt9XG4gICAgfTtcblxuICAgIGlmKHRoaXMuY29udGFpbmVyLmRhdGEoXCJoYXNoXCIpICE9PSBudWxsICYmIHRoaXMuY29udGFpbmVyLmRhdGEoXCJoYXNoXCIpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy51c2VIYXNoID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvL0FkZCBoYXNoIHN1cHBvcnRcbiAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2guX29uSGFzaENoYW5nZWQuYmluZCh0aGlzKSk7XG5cbiB9O1xuIiwiLyoqXHJcbiogX2NyZWF0ZUJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyICRmaWx0ZXJzID0gJCgnWycrdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcisnXScpLC8vR2V0IGFsbCBmaWx0ZXIgZWxlbWVudHNcclxuICAgICAgICAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFGb3JDb250YWluZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyLFxyXG4gICAgICAgICRkYXRhVHlwZSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy50eXBlLFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJGZpbHRlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgIGVsbSA9ICQoZWxtKTtcclxuXHJcbiAgICAgICAgLy8gaWYoZWxtLmRhdGEoXCJmaWx0ZXItc2V0XCIpICE9IFwiMVwiKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGZpbHRlckNvbnRhaW5lciA9ICAgZWxtLmNsb3Nlc3QoJ1snKyRkYXRhRm9yQ29udGFpbmVyKyddJyksIC8vR2V0IHBhcmVudCB3aXRoIGRhdGEtZm9yLWNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgJG11bHRpcGxlID0gICAgICAgICAgKCRmaWx0ZXJDb250YWluZXIubGVuZ3RoID09IDApID8gZmFsc2UgOiAkZmlsdGVyQ29udGFpbmVyLmF0dHIoJGRhdGFUeXBlKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAgICAgICAgICgkZmlsdGVyQ29udGFpbmVyLmxlbmd0aCA9PSAwKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3RvcigkZmlsdGVyQ29udGFpbmVyLmF0dHIoJGRhdGFGb3JDb250YWluZXIpKSxcclxuICAgICAgICAgICAgICAgICRkYXRhRmlsdGVyQXR0ciA9ICAgIGVsbS5hdHRyKCRkYXRhRmlsdGVyKSxcclxuICAgICAgICAgICAgICAgIGZpbHRlckNvbnRhaW5lcklkID0gICgkZmlsdGVyQ29udGFpbmVyLmF0dHIoXCJpZFwiKSB8fCBuZXcgRGF0ZSgpLmdldFRpbWUoKSk7XHJcblxyXG4gICAgICAgICAgICBpZigkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uZmlsdGVyQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lcklkXSA9PSBudWxsKSB7XHJcbiAgICAgICAgICAgICAgICAkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uZmlsdGVyQ29udGFpbmVyW2ZpbHRlckNvbnRhaW5lcklkXSA9ICRmaWx0ZXJDb250YWluZXI7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIGVsbS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyICRmaWx0ZXJWYWx1ZSA9ICcnLFxyXG4gICAgICAgICAgICAgICAgICAgIGFjdGl2ZSA9ICRzZWxmLl90b2dnbGVDbGFzcyhlbG0sICRmaWx0ZXJDb250YWluZXIsICRhY3RpdmVDbGFzcywgJG11bHRpcGxlLCAkZGF0YUZpbHRlckF0dHIgPT0gJGRlZmF1bHRGaWx0ZXIsICdbJyskZGF0YUZpbHRlcisnPVwiJyskZGVmYXVsdEZpbHRlcisnXCJdJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgdmFyIHZhbCA9ICRmaWx0ZXJWYWx1ZSA9ICRkYXRhRmlsdGVyQXR0cjtcclxuICAgICAgICAgICAgICAgICQuZWFjaCgkY29udGFpbmVyLCBmdW5jdGlvbihrZXksICRpbnN0YW5jZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZigkc2VsZi51c2VIYXNoID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzZWxmLmhhc2guX3NldEhhc2guY2FsbCgkc2VsZiwgJGluc3RhbmNlLCAkZmlsdGVyVmFsdWUsIGFjdGl2ZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRtdWx0aXBsZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRpbnN0YW5jZS5vcHRpb25zLmZpbHRlciA9PSBcIipcIiB8fCAkZmlsdGVyVmFsdWUgPT0gXCIqXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL0RvIG5vdGhpbmdcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSBpZigkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIuaW5kZXhPZigkZmlsdGVyVmFsdWUpID09PSAtMSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRpbnN0YW5jZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlLnB1c2godmFsKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkZmlsdGVyVmFsdWUuam9pbihcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICRmaWx0ZXJWYWx1ZSA9ICRpbnN0YW5jZS5vcHRpb25zLmZpbHRlci5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgJGZpbHRlclZhbHVlLnNwbGljZSgkZmlsdGVyVmFsdWUuaW5kZXhPZih2YWwpLCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkZmlsdGVyVmFsdWUuam9pbihcIixcIik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoJGZpbHRlclZhbHVlID09IFwiXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSBcIipcIjtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJGluc3RhbmNlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAkZmlsdGVyVmFsdWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICAvLyAkKGVsbSkuZGF0YShcImZpbHRlci1zZXRcIiwgXCIxXCIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICB9KTtcclxufTtcclxuIiwiLyoqXG4qIF9mb3JtYXRIYXNoOiBGb3JtYXQgbXVsdGlwbGUgZmlsdGVycyBpbnRvIG9uZSBzdHJpbmcgYmFzZWQgb24gYSByZWd1bGFyIGV4cHJlc3Npb25cbiogQHNpbmNlIDAuMS4wXG4qIEBwYXJhbSB7cmVnZXh9IHJlXG4qIEBwYXJhbSB7c3RyaW5nfSBzdHJcbiovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHJlLCBzdHIpIHtcbiAgICB2YXIgbWF0Y2hlcyA9IHt9LFxuICAgICAgICBtYXRjaDtcblxuICAgIHdoaWxlICgobWF0Y2ggPSByZS5leGVjKHN0cikpICE9IG51bGwpIHtcbiAgICAgICAgaWYgKG1hdGNoLmluZGV4ID09PSByZS5sYXN0SW5kZXgpIHtcbiAgICAgICAgICAgIHJlLmxhc3RJbmRleCsrO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWF0Y2hbM10gIT09IG51bGwgJiYgbWF0Y2hbM10gIT09IHVuZGVmaW5lZCkge1xuXG4gICAgICAgICAgICBtYXRjaGVzW21hdGNoWzNdXSA9IHRydWU7XG5cbiAgICAgICAgfSBlbHNlIHtcblxuICAgICAgICAgICAgaWYobWF0Y2hlc1ttYXRjaFsxXV0gPT0gbnVsbCB8fCBtYXRjaGVzW21hdGNoWzFdXSA9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBtYXRjaGVzW21hdGNoWzFdXSA9IFtdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFsxXV0ucHVzaChtYXRjaFsyXSk7XG5cbiAgICAgICAgfVxuXG4gICAgfVxuXG4gICAgcmV0dXJuIG1hdGNoZXM7XG59O1xuIiwiLyoqXG4gKiBfZ2V0SGFzaDogR2V0IHdpbmRvdy5sb2NhdGlvbi5oYXNoIGFuZCBmb3JtYXQgaXQgZm9yIElzb3RvcGVcbiAqIEBzaW5jZSAwLjEuMFxuICovXG5cbiBtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciAkaGFzaCA9IHdpbmRvdy5sb2NhdGlvbi5oYXNoIHx8IGZhbHNlLFxuICAgICAgICAkbmV3SGFzaCA9IFwiXCIsXG4gICAgICAgICRzZWxmID0gdGhpcztcblxuICAgICRoYXNoID0gKCRoYXNoICE9PSBmYWxzZSAmJiAkaGFzaCAhPSBcIiNcIiAmJiAkaGFzaCAhPSBcIlwiKSA/IGRlY29kZVVSSUNvbXBvbmVudCh3aW5kb3cubG9jYXRpb24uaGFzaCkgOiAnKic7XG5cbiAgICAvL1JlbW92ZSBoYXNoIGZyb20gZmlyc3QgY2hhcmFjdGVyIGlmIGl0cyBleGlzdFxuICAgIGlmICgkaGFzaC5jaGFyQXQoMCkgPT09ICcjJykge1xuICAgICAgICAgJGhhc2ggPSAkaGFzaC5zbGljZSgxKTtcbiAgICB9XG5cbiAgICAkLmVhY2goJGhhc2guc3BsaXQoXCImXCIpLCBmdW5jdGlvbihrZXksICRwYXJ0SGFzaCkge1xuXG4gICAgICAgIGlmKCRwYXJ0SGFzaC5pbmRleE9mKFwiPVwiKSAhPT0gLTEpIHtcblxuICAgICAgICAgICAgdmFyIHRtcCA9ICRwYXJ0SGFzaC5zcGxpdChcIj1cIiksXG4gICAgICAgICAgICAgICAgYXJyID0gW107XG5cbiAgICAgICAgICAgIGlmKHRtcC5sZW5ndGggPiAxKSB7XG4gICAgICAgICAgICAgICAgdmFyIG5hbWUgPSB0bXBbMF0sXG4gICAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IHRtcFsxXS5yZXBsYWNlKC9cXCcvZywgXCJcIik7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhbHVlcyA9IHZhbHVlcy5zcGxpdChcIixcIik7XG4gICAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgYXJyLnB1c2goXCJbZGF0YS1cIiArIG5hbWUgKyBcIj0nXCIgKyB2YWx1ZXNbaV0gKyBcIiddXCIpO1xuXG4gICAgICAgICAgICAgICAgJChcIltkYXRhLWZpbHRlcj1cXFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVxcXCJdXCIpLmFkZENsYXNzKCRzZWxmLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgJG5ld0hhc2ggKz0gYXJyLmpvaW4oXCIsXCIpO1xuXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAkbmV3SGFzaCArPSAkcGFydEhhc2hcbiAgICAgICAgICAgICAgICAucmVwbGFjZShcIiNcIiwgXCIuXCIpXHQgIC8vcmVwbGFjZSBcIiNcIiB3aXRoIFwiLlwiXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoLyYvZywgXCIsIC5cIik7ICAvL3JlcGxhY2UgXCImXCIgd2l0aCBcIiwgLlwiXG4gICAgICAgIH1cblxuICAgIH0pO1xuXG4gICAgLy8gIC8vQ2hlY2sgaWYgdGhpcyBpcyBhIGRhdGEgZ3JvdXBcbiAgICAvLyAgaWYoJGhhc2guaW5kZXhPZihcIj1cIikgIT09IC0xKSB7XG4gICAgLy8gICAgICAkaGFzaCA9ICRoYXNoLnNwbGl0KFwiJlwiKTtcbiAgICAgLy9cbiAgICAvLyAgICAgIGZvciAodmFyIGk9MDsgaTwkaGFzaC5sZW5ndGg7IGkrKykge1xuICAgIC8vICAgICAgICAgIHZhciB0bXAgPSAkaGFzaFtpXS5zcGxpdChcIj1cIiksXG4gICAgLy8gICAgICAgICAgICAgIGFyciA9IFtdO1xuICAgICAvL1xuICAgIC8vICAgICAgICAgIGlmKHRtcC5sZW5ndGggPiAxKSB7XG4gICAgLy8gICAgICAgICAgICAgIHZhciBuYW1lID0gdG1wWzBdLFxuICAgIC8vICAgICAgICAgICAgICAgICAgdmFsdWVzID0gdG1wWzFdO1xuICAgIC8vICAgICAgICAgIH1cbiAgICAgLy9cbiAgICAvLyAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQoXCIsXCIpO1xuICAgIC8vICAgICAgICAgIGZvciAodmFyIGk9MDsgaTx2YWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAvL1xuICAgIC8vICAgICAgICAgICAgICBhcnIucHVzaChcIltkYXRhLVwiK25hbWUrXCI9J1wiK3ZhbHVlc1tpXStcIiddXCIpO1xuICAgIC8vICAgICAgICAgIH1cbiAgICAvLyAgICAgICAgIC8vICBjb25zb2xlLmxvZyhhcnIpO1xuICAgIC8vICAgICAgfVxuICAgICAvL1xuICAgIC8vICAgICAgJG5ld0hhc2ggPSBhcnIuam9pbihcIlwiKTtcbiAgICAgLy9cbiAgICAvLyAgfSBlbHNlIHtcbiAgICAgLy9cbiAgICAvLyAgICAgICRuZXdIYXNoID0gJGhhc2hcbiAgICAvLyAgICAgICAgICAucmVwbGFjZShcIiNcIiwgXCIuXCIpXHQgIC8vcmVwbGFjZSBcIiNcIiB3aXRoIFwiLlwiXG4gICAgLy8gICAgICAgICAgLnJlcGxhY2UoLyYvZywgXCIsIC5cIik7ICAvL3JlcGxhY2UgXCImXCIgd2l0aCBcIiwgLlwiXG4gICAgIC8vXG4gICAgLy8gIH1cblxuICAgICByZXR1cm4gJG5ld0hhc2g7XG5cbiB9O1xuIiwiLyoqXHJcbiogX29uSGFzaENoYW5nZTogZmlyZXMgd2hlbiBsb2NhdGlvbi5oYXNoIGhhcyBiZWVuIGNoYW5nZWRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihlKSB7XHJcbiAgICB0aGlzLl9zZXRJc290b3BlLmNhbGwodGhpcywgdGhpcy5oYXNoLl9nZXRIYXNoLmNhbGwodGhpcykpO1xyXG59O1xyXG4iLCIvKipcbiAqIF9zZXRIYXNoOiBTZXQgYSBuZXcgbG9jYXRpb24uaGFzaCBhZnRlciBmb3JtYXR0aW5nIGl0XG4gKiBAc2luY2UgMC4xLjBcbiAqIEBwYXJhbSB7b2JqZWN0fSAkaW5zdGFuY2VcbiAqIEBwYXJhbSB7c3RyaW5nfSAkbmV3SGFzaFxuICogQHBhcmFtIHtib29sZWFufSAkYWN0aXZlXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkaW5zdGFuY2UsICRuZXdIYXNoLCAkYWN0aXZlKSB7XG4gICAgdmFyICRjdXJyZW50SGFzaCA9ICgkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIgPT0gXCIqXCIpID8gXCJcIiA6ICRpbnN0YW5jZS5vcHRpb25zLmZpbHRlcixcbiAgICAgICAgJGNvbWJpbmVkSGFzaDtcblxuICAgIGlmKCRuZXdIYXNoICE9IFwiKlwiKSB7XG5cbiAgICAgICAgaWYoJGN1cnJlbnRIYXNoLmluZGV4T2YoJG5ld0hhc2gpID09PSAtMSkge1xuICAgICAgICAgICAgJGNvbWJpbmVkSGFzaCA9ICRjdXJyZW50SGFzaCArICRuZXdIYXNoO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJGNvbWJpbmVkSGFzaCA9ICRjdXJyZW50SGFzaC5yZXBsYWNlKCRuZXdIYXNoLCBcIlwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciAkZm9ybWF0dGVkSGFzaCA9IHRoaXMuaGFzaC5fZm9ybWF0SGFzaCgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF18KC5bQS1aYS16MC05XSspL2csICRjb21iaW5lZEhhc2gpLFxuICAgICAgICAgICAgJGVuZEhhc2ggPSBbXTtcblxuICAgICAgICAkLmVhY2goJGZvcm1hdHRlZEhhc2gsIGZ1bmN0aW9uKGtleSwgZWxtKSB7XG4gICAgICAgICAgICBpZihlbG0gPT09IHRydWUpIHsvL2lzQ2xhc3NcbiAgICAgICAgICAgICAgICAkZW5kSGFzaC5wdXNoKGtleSk7XG4gICAgICAgICAgICB9IGVsc2Ugey8vaXNPYmplY3RcbiAgICAgICAgICAgICAgICAkZW5kSGFzaC5wdXNoKGtleSArIFwiPVwiICsgZWxtLmpvaW4oXCIsXCIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgJGVuZEhhc2ggPSAkZW5kSGFzaC5qb2luKFwiJlwiKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICAkZW5kSGFzaCA9ICRuZXdIYXNoO1xuICAgIH1cblxuICAgIC8vIGlmKCRjb21iaW5lZEhhc2guaW5kZXhPZihcImRhdGEtXCIpICE9PSAtMSkgey8vQ2hlY2sgaWYgd2UgZmlsdGVyIG9uIGNsYXNzZXMgb3IgZGF0YSBhdHRyaWJ1dGVzXG4gICAgLy8gICAgIHZhciAkZm9ybWF0dGVkSGFzaCA9IHRoaXMuaGFzaC5fZm9ybWF0SGFzaCgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgJGNvbWJpbmVkSGFzaCk7XG4gICAgLy8gICAgICAgICAvLyAucmVwbGFjZSgvXFwnfFxcXCJ8XFxbfFxcXXxcXHt8XFx9L2csIFwiXCIpO1xuICAgIC8vICAgICAgICAgLy8gLnJlcGxhY2UoL1xcOi9nLCBcIj1cIik7XG4gICAgLy9cbiAgICAvLyAgICAgJGNvbWJpbmVkSGFzaCA9IFwiXCI7XG4gICAgLy8gICAgIGNvbnNvbGUubG9nKCRmb3JtYXR0ZWRIYXNoKTtcbiAgICAvLyAgICAgJGZvcm1hdHRlZEhhc2guZWFjaChmdW5jdGlvbihrZXksICRlbG0pIHtcbiAgICAvLyAgICAgICAgICRlbG0gPSAkKGVsbSk7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICRjb21iaW5lZEhhc2hcbiAgICAvLyAgICAgfSk7XG4gICAgLy9cbiAgICAvLyB9IGVsc2Uge1xuICAgIC8vICAgICAkY29tYmluZWRIYXNoID0gJGNvbWJpbmVkSGFzaFxuICAgIC8vICAgICAgICAgLnJlcGxhY2UoL1xcJy9nLCBcIlwiKVxuICAgIC8vICAgICAgICAgLnJlcGxhY2UoL1xcLi9nLFwiXCIpXHQgIC8vcmVwbGFjZSBcIi5cIiB3aXRoIG5vdGhpbmdcbiAgICAvLyAgICAgICAgIC5yZXBsYWNlKC9cXHMvZyxcIlwiKVx0ICAvL3JlcGxhY2UgXCIgXCIgd2l0aCBcIlwiXG4gICAgLy8gICAgICAgICAucmVwbGFjZSgvXFwsL2csXCImXCIpO1x0Ly9yZXBsYWNlIFwiLFwiIHdpdGggXCImXCJcbiAgICAvLyB9XG5cbiAgICBpZigkZW5kSGFzaCA9PSBcIipcIiB8fCAkZW5kSGFzaCA9PSBcIlwiKSB7XG4gICAgICAgIHdpbmRvdy5sb2NhdGlvbi5oYXNoID0gXCJcIjtcbiAgICB9IGVsc2Uge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9ICh0aGlzLmVuY29kZVVSSSA9PT0gdHJ1ZSkgPyBlbmNvZGVVUklDb21wb25lbnQoJGVuZEhhc2gpIDogJGVuZEhhc2g7XG4gICAgfVxuXG4gICAgcmV0dXJuICRlbmRIYXNoO1xufTtcbiIsInZhciAkID0gd2luZG93LmpRdWVyeTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZSA9IHJlcXVpcmUoXCIuL2NvbnN0cnVjdG9yL3Byb3RvdHlwZS5qc1wiKTtcclxuXHJcbiQuc2ltcGxlSXNvdG9wZS5wcm90b3R5cGUgPSB7XHJcbiAgICBpbnN0YW5jZXM6IHt9LFxyXG4gICAgY29uc3RydWN0b3I6ICQuc2ltcGxlSXNvdG9wZSxcclxuXHJcbiAgICBoYXNoOiB7XHJcbiAgICAgICAgX2dldEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX2dldEhhc2guanNcIiksXHJcbiAgICAgICAgX3NldEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX3NldEhhc2guanNcIiksXHJcbiAgICAgICAgX2Zvcm1hdEhhc2g6IHJlcXVpcmUoXCIuL2hhc2gvX2Zvcm1hdEhhc2guanNcIiksXHJcbiAgICAgICAgX29uSGFzaENoYW5nZWQ6IHJlcXVpcmUoXCIuL2hhc2gvX29uSGFzaENoYW5nZWQuanNcIilcclxuICAgIH0sXHJcbiAgICBmaWx0ZXI6IHtcclxuICAgICAgICBfY3JlYXRlQnV0dG9uczogcmVxdWlyZShcIi4vZmlsdGVyL19jcmVhdGVCdXR0b25zLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgc29ydGVyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL3NvcnRlci9fY3JlYXRlQnV0dG9ucy5qc1wiKVxyXG4gICAgfSxcclxuICAgIGNsZWFyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL2NsZWFyL19jcmVhdGVCdXR0b25zLmpzXCIpLFxyXG4gICAgICAgIF9jaGVjazogcmVxdWlyZShcIi4vY2xlYXIvX2NoZWNrLmpzXCIpLFxyXG4gICAgICAgIF9fY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19fY2hlY2suanNcIilcclxuICAgIH0sXHJcbiAgICB0ZXh0OiB7XHJcbiAgICAgICAgX2ZlZWRiYWNrOiByZXF1aXJlKFwiLi90ZXh0L19mZWVkYmFjay5qc1wiKVxyXG4gICAgfSxcclxuXHJcbiAgICB1dGlsczogcmVxdWlyZShcIi4vdXRpbHMvaW5kZXguanNcIiksXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9vbkJlZm9yZUlzb3RvcGVDaGFuZ2U6IGZpcmVzIGJlZm9yZSB0aGUgSXNvdG9wZSBsYXlvdXQgaGFzIGJlZW4gY2hhbmdlZFxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRpbnN0YW5jZVxyXG4gICAgKi9cclxuICAgIF9vbkJlZm9yZUlzb3RvcGVDaGFuZ2U6IGZ1bmN0aW9uKCRpbnN0YW5jZSkge30sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9vbklzb3RvcGVDaGFuZ2U6IGZpcmVzIHdoZW4gdGhlIElzb3RvcGUgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWRcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuICAgICovXHJcbiAgICBfb25Jc290b3BlQ2hhbmdlOiBmdW5jdGlvbigkaW5zdGFuY2UpIHtcclxuICAgICAgICB0aGlzLmNsZWFyLl9jaGVjay5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgdGhpcy50ZXh0Ll9mZWVkYmFjay5jYWxsKHRoaXMsICRpbnN0YW5jZSk7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfc2V0SXNvdG9wZTogUmVjb25maWd1cmUgaXNvdG9wZVxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtzdHJpbmd9ICRzZWxlY3RvclxyXG4gICAgKi9cclxuICAgIF9zZXRJc290b3BlOiBmdW5jdGlvbigkc2VsZWN0b3IpIHtcclxuICAgICAgICB0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgIGZpbHRlcjogJHNlbGVjdG9yXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuX29uSXNvdG9wZUNoYW5nZSh0aGlzLmluc3RhbmNlc1t0aGlzLmd1aWRdLmlzb3RvcGUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICAqIF9nZXRTb3J0RGF0YTogR2V0IHRoZSBkYXRhLXNvcnQtYnkgYXR0cmlidXRlcyBhbmQgbWFrZSB0aGVtIGludG8gYW4gSXNvdG9wZSBcImdldFNvcnREYXRhXCIgb2JqZWN0XHJcbiAgICAgKiBAc2luY2UgMC4xLjBcclxuICAgICAqL1xyXG4gICAgX2dldFNvcnREYXRhOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgJHNvcnREYXRhID0ge30sXHJcbiAgICAgICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAgICAgJGRhdGFTb3J0QnlTZWxlY3RvciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnlTZWxlY3RvcixcclxuICAgICAgICAgICAgJGRhdGFTb3J0QnlEZWZhdWx0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0O1xyXG5cclxuICAgICAgICAkKCdbJyArICRkYXRhU29ydEJ5ICsgJ10sIFsnICsgJGRhdGFTb3J0QnlTZWxlY3RvciArICddJykuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgICAgICRuYW1lID0gJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSB8fCBudWxsLFxyXG4gICAgICAgICAgICAgICAgJHNlbGVjdG9yID0gJGVsbS5hdHRyKCRkYXRhU29ydEJ5U2VsZWN0b3IpIHx8IG51bGw7XHJcblxyXG4gICAgICAgICAgICBpZigkbmFtZSAhPSAkZGF0YVNvcnRCeURlZmF1bHQpIHtcclxuICAgICAgICAgICAgICAgIGlmKCRuYW1lICE9PSBudWxsICYmICRzZWxlY3RvciAhPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0RGF0YVskbmFtZV0gPSAkc2VsZWN0b3I7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgIGFsZXJ0KFwiSXNvdG9wZSBzb3J0aW5nOiBcIiskZGF0YVNvcnRCeStcIiBhbmQgXCIrJGRhdGFTb3J0QnlTZWxlY3RvcitcIiBhcmUgcmVxdWlyZWQuIEN1cnJlbnRseSBjb25maWd1cmVkIFwiKyRkYXRhU29ydEJ5K1wiPSdcIiArICRuYW1lICsgXCInIGFuZCBcIiskZGF0YVNvcnRCeVNlbGVjdG9yK1wiPSdcIiArICRzZWxlY3RvciArIFwiJ1wiKVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiAkc29ydERhdGE7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfdG9nZ2xlQ2xhc3M6IEhlbHBlciB0byB0b2dnbGUgb3IgcmVtb3ZlIGNsYXNzZXMgZWFzaWVyXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge2VsZW1lbnR9ICRlbG1cclxuICAgICogQHBhcmFtIHtlbGVtZW50fSAkY29udGFpbmVyXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSBjbGFzc05hbWVcclxuICAgICogQHBhcmFtIHtib29sZWFufSBtdWx0aXBsZVxyXG4gICAgKiBAcGFyYW0ge2Jvb2xlYW59IG1hdGNoXHJcbiAgICAqL1xyXG4gICAgX3RvZ2dsZUNsYXNzOiBmdW5jdGlvbigkZWxtLCAkY29udGFpbmVyLCBjbGFzc05hbWUsIG11bHRpcGxlLCBtYXRjaCwgZmluZERlZmF1bHQpIHtcclxuICAgICAgICBtYXRjaCA9IG1hdGNoIHx8IGZhbHNlO1xyXG4gICAgICAgIG11bHRpcGxlID0gbXVsdGlwbGUgfHwgZmFsc2U7XHJcblxyXG4gICAgICAgIGlmKG11bHRpcGxlICE9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgaWYobWF0Y2gpIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnLicrY2xhc3NOYW1lKS5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgJGVsbS5hZGRDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgJGNvbnRhaW5lci5maW5kKGZpbmREZWZhdWx0KS5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAgICAgJGVsbS50b2dnbGVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICRjb250YWluZXIuZmluZCgnLicrY2xhc3NOYW1lKS5yZW1vdmVDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgICAgICAkZWxtLmFkZENsYXNzKGNsYXNzTmFtZSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gJGVsbS5oYXNDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX2dldEluc3RhbmNlc1xyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICovXHJcbiAgICBfZ2V0SW5zdGFuY2VzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgdG1wID0gW11cclxuXHJcbiAgICAgICAgJC5lYWNoKHRoaXMuaW5zdGFuY2VzLCBmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgICAgICB0bXAucHVzaChlbG0uaXNvdG9wZSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiB0bXA7XHJcbiAgICB9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfZ2V0RWxlbWVudHNGcm9tU2VsZWN0b3JcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqL1xyXG4gICAgX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yOiBmdW5jdGlvbihzZWxlY3Rvcikge1xyXG4gICAgICAgIHZhciAkdG1wO1xyXG5cclxuICAgICAgICBpZihzZWxlY3Rvci5jaGFyQXQoMCkgPT0gXCIjXCIgfHwgc2VsZWN0b3IuY2hhckF0KDApID09IFwiLlwiKSB7XHRcdFx0XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoXCIjXCIpICE9PSAtMSB8fCBzZWxlY3Rvci5pbmRleE9mKFwiLlwiKSAhPT0gLTEpIHtcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgICAgICB9IGVsc2UgaWYoc2VsZWN0b3IuaW5kZXhPZihcIiBcIikgIT09IC0xKSB7XHRcdFx0XHRcdFx0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSB7XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdC8vZXZ1bGF0ZSB0aGUgc3RyaW5nIGFzIGFuIGlkXHJcbiAgICAgICAgICAgICR0bXAgPSAkKFwiI1wiICsgc2VsZWN0b3IpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgaWYoJHRtcC5sZW5ndGggPT0gMCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwic2ltcGxlSXNvdG9wZTogV2UgY2Fubm90IGZpbmQgYW55IERPTSBlbGVtZW50IHdpdGggdGhlIENTUyBzZWxlY3RvcjogXCIgKyBzZWxlY3Rvcik7XHJcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICB2YXIgJHRtcEFyciA9IFtdO1xyXG4gICAgICAgICAgICAkLmVhY2godGhpcy5pbnN0YW5jZXMsIGZ1bmN0aW9uKGtleSwgaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgICAgIGlmKCQoaW5zdGFuY2UuaXNvdG9wZS5lbGVtZW50KVswXSA9PT0gJHRtcFswXSkge1xyXG4gICAgICAgICAgICAgICAgICAgICR0bXBBcnIucHVzaChpbnN0YW5jZS5pc290b3BlKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIHJldHVybiAkdG1wQXJyO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8gcmV0dXJuICR0bXA7XHJcbiAgICB9LFxyXG5cclxuICAgIF9nZXRGaWx0ZXJUZXN0OiBmdW5jdGlvbihmaWx0ZXIpIHtcclxuXHJcbiAgICAgICAgaWYoZmlsdGVyLmluZGV4T2YoXCJkYXRhLVwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgdmFyIGNhdCA9IGZpbHRlci5yZXBsYWNlKC9cXFtkYXRhXFwtKC4rPylcXD1cXCcoLis/KVxcJ1xcXS9nLCBcIiQxXCIpLnNwbGl0KFwiLFwiKTtcclxuICAgICAgICAgICAgdmFyIHZhbHVlID0gZmlsdGVyLnJlcGxhY2UoL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csIFwiJDJcIikuc3BsaXQoXCIsXCIpO1xyXG5cclxuICAgICAgICAgICAgY2F0ID0gY2F0Lm1hcChGdW5jdGlvbi5wcm90b3R5cGUuY2FsbCwgU3RyaW5nLnByb3RvdHlwZS50cmltKTtcclxuICAgICAgICAgICAgdmFsdWUgPSB2YWx1ZS5tYXAoRnVuY3Rpb24ucHJvdG90eXBlLmNhbGwsIFN0cmluZy5wcm90b3R5cGUudHJpbSk7XHJcblxyXG4gICAgICAgICAgICAvLyBOb3RpY2U6IGJlbG93IGlzIHRoZSBqUXVlcnkgZmlsdGVyIGZ1bmN0aW9uIG5vdCB0aGUgaXNvdG9wZSBmdW5jdGlvblxyXG4gICAgICAgICAgICB2YXIgYWN0aXZlID0gdmFsdWUuZmlsdGVyKGZ1bmN0aW9uKCBmaWx0ZXIsIGluZGV4ICkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGpRdWVyeSggaXRlbS5lbGVtZW50ICkuZGF0YSggY2F0W2luZGV4XSApLmluZGV4T2YoIGZpbHRlciApICE9PSAtMTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhhY3RpdmUsIGFjdGl2ZS5sZW5ndGgsIGNhdCwgY2F0Lmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gYWN0aXZlLmxlbmd0aCA9PSBjYXQubGVuZ3RoO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICByZXR1cm4galF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5pcyggZmlsdGVyICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgIH1cclxufTtcclxuXHJcbiQuZm4uc2ltcGxlSXNvdG9wZSA9IHJlcXVpcmUoXCIuL2NvbnN0cnVjdG9yL2pxdWVyeS5qc1wiKVxyXG5cclxuJChkb2N1bWVudCkucmVhZHkoZnVuY3Rpb24oKSB7XHJcbiAgICAkLmVhY2goJChcIltkYXRhLWlzb3RvcGVdXCIpLCBmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgICQoZWxtKS5zaW1wbGVJc290b3BlKCk7XHJcbiAgICB9KVxyXG59KTtcclxuXHJcblxyXG4vKklzb3RvcGUucHJvdG90eXBlLl9nZXRGaWx0ZXJUZXN0ID0gZnVuY3Rpb24oIGZpbHRlciApIHtcclxuICAgIGlmICggalF1ZXJ5ICYmIHRoaXMub3B0aW9ucy5pc0pRdWVyeUZpbHRlcmluZyApIHtcclxuICAgICAgICAvLyB1c2UgalF1ZXJ5XHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBpdGVtICkge1xyXG5cclxuICAgICAgICAgICAgaWYoZmlsdGVyLmluZGV4T2YoXCJkYXRhLVwiKSAhPT0gLTEpIHtcclxuICAgICAgICAgICAgICAgIHZhciBjYXQgPSBmaWx0ZXIucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMVwiKS5zcGxpdChcIixcIik7XHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsdWUgPSBmaWx0ZXIucmVwbGFjZSgvXFxbZGF0YVxcLSguKz8pXFw9XFwnKC4rPylcXCdcXF0vZywgXCIkMlwiKS5zcGxpdChcIixcIik7XHJcblxyXG4gICAgICAgICAgICAgICAgY2F0ID0gY2F0Lm1hcChGdW5jdGlvbi5wcm90b3R5cGUuY2FsbCwgU3RyaW5nLnByb3RvdHlwZS50cmltKTtcclxuICAgICAgICAgICAgICAgIHZhbHVlID0gdmFsdWUubWFwKEZ1bmN0aW9uLnByb3RvdHlwZS5jYWxsLCBTdHJpbmcucHJvdG90eXBlLnRyaW0pO1xyXG5cclxuICAgICAgICAgICAgICAgIC8vIE5vdGljZTogYmVsb3cgaXMgdGhlIGpRdWVyeSBmaWx0ZXIgZnVuY3Rpb24gbm90IHRoZSBpc290b3BlIGZ1bmN0aW9uXHJcbiAgICAgICAgICAgICAgICB2YXIgYWN0aXZlID0gdmFsdWUuZmlsdGVyKGZ1bmN0aW9uKCBmaWx0ZXIsIGluZGV4ICkge1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBqUXVlcnkoIGl0ZW0uZWxlbWVudCApLmRhdGEoIGNhdFtpbmRleF0gKS5pbmRleE9mKCBmaWx0ZXIgKSAhPT0gLTE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhY3RpdmUsIGFjdGl2ZS5sZW5ndGgsIGNhdCwgY2F0Lmxlbmd0aCk7XHJcblxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGFjdGl2ZS5sZW5ndGggPT0gY2F0Lmxlbmd0aDtcclxuXHJcbiAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4galF1ZXJ5KCBpdGVtLmVsZW1lbnQgKS5pcyggZmlsdGVyICk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuICAgIGlmICggdHlwZW9mIGZpbHRlciA9PT0gJ2Z1bmN0aW9uJyApIHtcclxuICAgICAgICAvLyB1c2UgZmlsdGVyIGFzIGZ1bmN0aW9uXHJcbiAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCBpdGVtICkge1xyXG4gICAgICAgICAgICByZXR1cm4gZmlsdGVyKCBpdGVtLmVsZW1lbnQgKTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG4gICAgLy8gZGVmYXVsdCwgdXNlIGZpbHRlciBhcyBzZWxlY3RvciBzdHJpbmdcclxuICAgIHJldHVybiBmdW5jdGlvbiggaXRlbSApIHtcclxuICAgICAgICByZXR1cm4gbWF0Y2hlc1NlbGVjdG9yKCBpdGVtLmVsZW1lbnQsIGZpbHRlciApO1xyXG4gICAgfTtcclxufTtcclxuKi9cclxuIiwiLyoqXHJcbiogX2NyZWF0ZUJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcbiAgICB2YXIgJHNvcnRlcnMgPSAkKCdbJyt0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5KyddJyksLy9HZXQgYWxsIHNvcnQgZWxlbWVudHNcclxuICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgJGRhdGFGb3JDb250YWluZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyLFxyXG4gICAgICAgICRkYXRhU29ydERpcmVjdGlvbiA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0RGlyZWN0aW9uLFxyXG4gICAgICAgICRkYXRhVHlwZSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy50eXBlLFxyXG4gICAgICAgICRkZWZhdWx0U29ydCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydCxcclxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlLFxyXG4gICAgICAgICRzb3J0QXJyYXkgPSBbXSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJHNvcnRlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG5cclxuICAgICAgICAvLyBpZihlbG0uZGF0YShcInNvcnQtc2V0XCIpICE9IFwiMVwiKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgJHNvcnRDb250YWluZXIgPSAgICRlbG0uY2xvc2VzdCgnWycrJGRhdGFGb3JDb250YWluZXIrJ10nKSxcclxuICAgICAgICAgICAgICAgICRtdWx0aXBsZSA9ICAgICAgICAoJHNvcnRDb250YWluZXIubGVuZ3RoID09IDApID8gZmFsc2UgOiAkc29ydENvbnRhaW5lci5hdHRyKCRkYXRhVHlwZSkgfHwgZmFsc2UsXHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyID0gICAgICAgKCRzb3J0Q29udGFpbmVyLmxlbmd0aCA9PSAwKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3Rvcigkc29ydENvbnRhaW5lci5hdHRyKCRkYXRhRm9yQ29udGFpbmVyKSksXHJcbiAgICAgICAgICAgICAgICAkZGF0YVNvcnRBdHRyID0gICAgJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSxcclxuICAgICAgICAgICAgICAgIHNvcnRDb250YWluZXJJZCA9ICAoJHNvcnRDb250YWluZXIuYXR0cihcImlkXCIpIHx8IG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcclxuXHJcbiAgICAgICAgICAgIGlmKCRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5zb3J0Q29udGFpbmVyW3NvcnRDb250YWluZXJJZF0gPT0gbnVsbCkge1xyXG4gICAgICAgICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLnNvcnRDb250YWluZXJbc29ydENvbnRhaW5lcklkXSA9ICRzb3J0Q29udGFpbmVyO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB2YXIgaG93ID0ge1xyXG4gICAgICAgICAgICAgICAgZXZlbnROYW1lOiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/IFwiY2hhbmdlXCIgOiBcImNsaWNrXCIsXHJcbiAgICAgICAgICAgICAgICBlbGVtZW50OiAkZWxtLnByb3AoXCJ0YWdOYW1lXCIpLnRvTG93ZXJDYXNlKCkgPT0gXCJvcHRpb25cIiA/ICRlbG0uY2xvc2VzdChcInNlbGVjdFwiKSA6ICRlbG1cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGhvdy5lbGVtZW50Lm9uKGhvdy5ldmVudE5hbWUsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICBpZihob3cuZXZlbnROYW1lID09IFwiY2hhbmdlXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZihob3cuZWxlbWVudC5maW5kKCdvcHRpb246c2VsZWN0ZWQnKVswXSAhPSBlbG0pIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJHNvcnRCeVZhbHVlID0gJyc7XHJcblxyXG4gICAgICAgICAgICAgICAgJHNlbGYuX3RvZ2dsZUNsYXNzKCRlbG0sICRzb3J0Q29udGFpbmVyLCAkYWN0aXZlQ2xhc3MsICRtdWx0aXBsZSwgJGRhdGFTb3J0QXR0ciA9PSAkZGVmYXVsdFNvcnQsICdbJyskZGF0YVNvcnRCeSsnPVwiJyskZGVmYXVsdFNvcnQrJ1wiXScpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRtdWx0aXBsZSAhPT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gW107XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRkYXRhU29ydEF0dHIgPT0gJGRlZmF1bHRTb3J0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkgPSBbXTtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0cikgPT09IC0xKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFycmF5LnB1c2goJGRhdGFTb3J0QXR0cik7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFycmF5LnNwbGljZSgkc29ydEFycmF5LmluZGV4T2YoJGRhdGFTb3J0QXR0ciksIDEpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBpZigkc29ydEFycmF5Lmxlbmd0aCA9PSAwKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkZWZhdWx0U29ydDtcclxuICAgICAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSAkc29ydEFycmF5O1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRkYXRhU29ydEF0dHI7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgJC5lYWNoKCRjb250YWluZXIsIGZ1bmN0aW9uKGtleSwgY29udGFpbmVyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyICRzb3J0QXNjID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pICE9PSBudWxsICYmICRlbG0uYXR0cigkZGF0YVNvcnREaXJlY3Rpb24pICE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikudG9Mb3dlckNhc2UoKSA9PSBcImFzY1wiKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydEJ5KSA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRBc2MgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGFpbmVyLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICRzb3J0QnlWYWx1ZSxcclxuICAgICAgICAgICAgICAgICAgICAgICAgc29ydEFzY2VuZGluZzogJHNvcnRBc2NcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCBjb250YWluZXIpO1xyXG5cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIC8vIGVsbS5kYXRhKFwic29ydC1zZXRcIiwgXCIxXCIpO1xyXG4gICAgICAgIC8vIH1cclxuXHJcbiAgICB9KTtcclxufTtcclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkZmVlZGJhY2sgPSAkKCdbJyt0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmVlZGJhY2srJ10nKSxcclxuICAgICAgICAkZGF0YUZvckNvbnRhaW5lciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIsXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICRmZWVkYmFjay5lYWNoKGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICRpc0ZvciA9ICRmZWVkYmFjay5hdHRyKCRkYXRhRm9yQ29udGFpbmVyKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgJGNvbnRhaW5lciA9ICgkaXNGb3IgPT09IGZhbHNlKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3RvcigkaXNGb3IpO1xyXG5cclxuICAgICAgICAkLmVhY2goJGNvbnRhaW5lciwgZnVuY3Rpb24oJGtleSwgJGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICRlbG0udGV4dCgkZWxtLmF0dHIoXCJkYXRhLWZlZWRiYWNrXCIpLnJlcGxhY2UoXCJ7ZGVsdGF9XCIsICRpbnN0YW5jZS5maWx0ZXJlZEl0ZW1zLmxlbmd0aCkpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLG51bGxdfQ==
