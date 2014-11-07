!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.simpleIsotope=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"d:\\Web\\isotope2\\source\\clear\\__check.js":[function(require,module,exports){
/**
* _check: Check if we need to enable or disable the clear div without an instance
* @since 0.1.0
*/
module.exports = function() {
    this._onIsotopeChange.call(this, this.instances[this.guid].isotope);
};

},{}],"d:\\Web\\isotope2\\source\\clear\\_check.js":[function(require,module,exports){
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

            $self.instances[$self.guid].filterContainer.find('.'+$activeClass).removeClass($activeClass);
            $self.instances[$self.guid].filterContainer.find('['+$dataFilter+'="'+$defaultFilter+'"]').addClass($activeClass);

            $self.instances[$self.guid].sortContainer.find('.'+$activeClass).removeClass($activeClass);
            $self.instances[$self.guid].sortContainer.find('['+$dataSortBy+'="'+$defaultSort+'"]').addClass($activeClass);

        }
    });

}

},{}],"d:\\Web\\isotope2\\source\\clear\\_createButtons.js":[function(require,module,exports){
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

},{}],"d:\\Web\\isotope2\\source\\constructor\\jquery.js":[function(require,module,exports){
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

},{}],"d:\\Web\\isotope2\\source\\constructor\\prototype.js":[function(require,module,exports){
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
        })
    };

    if(this.container.data("hash") !== null && this.container.data("hash") !== undefined) {
        this.useHash = true;
    }

    //Add hash support
    $(window).on('hashchange', this.hash._onHashChanged.bind(this));

 };

},{}],"d:\\Web\\isotope2\\source\\filter\\_createButtons.js":[function(require,module,exports){
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
                $dataFilterAttr =    elm.attr($dataFilter);

            $self.instances[$self.guid].filterContainer = $filterContainer;

            elm.on('click', function(e) {
                e.preventDefault();

                var $filterValue = '',
                    active = $self._toggleClass(elm, $filterContainer, $activeClass, $multiple, $dataFilterAttr == $defaultFilter, '['+$dataFilter+'="'+$defaultFilter+'"]');

                $filterValue = $dataFilterAttr;
                $.each($container, function(key, $instance) {

                    if($self.useHash === true) {
                        $self.hash._setHash.call($self, $instance, $filterValue, active);
                    } else {
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

},{}],"d:\\Web\\isotope2\\source\\hash\\_formatHash.js":[function(require,module,exports){
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

},{}],"d:\\Web\\isotope2\\source\\hash\\_getHash.js":[function(require,module,exports){
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

},{}],"d:\\Web\\isotope2\\source\\hash\\_onHashChanged.js":[function(require,module,exports){
/**
* _onHashChange: fires when location.hash has been changed
* @since 0.1.0
*/
module.exports = function(e) {
    this._setIsotope.call(this, this.hash._getHash.call(this));
};

},{}],"d:\\Web\\isotope2\\source\\hash\\_setHash.js":[function(require,module,exports){
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

},{}],"d:\\Web\\isotope2\\source\\simple-isotope.amd.js":[function(require,module,exports){
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
    }
};

$.fn.simpleIsotope = require("./constructor/jquery.js")

$(document).ready(function() {
    $.each($("[data-isotope]"), function(key, elm) {
        $(elm).simpleIsotope();
    })
});

},{"./clear/__check.js":"d:\\Web\\isotope2\\source\\clear\\__check.js","./clear/_check.js":"d:\\Web\\isotope2\\source\\clear\\_check.js","./clear/_createButtons.js":"d:\\Web\\isotope2\\source\\clear\\_createButtons.js","./constructor/jquery.js":"d:\\Web\\isotope2\\source\\constructor\\jquery.js","./constructor/prototype.js":"d:\\Web\\isotope2\\source\\constructor\\prototype.js","./filter/_createButtons.js":"d:\\Web\\isotope2\\source\\filter\\_createButtons.js","./hash/_formatHash.js":"d:\\Web\\isotope2\\source\\hash\\_formatHash.js","./hash/_getHash.js":"d:\\Web\\isotope2\\source\\hash\\_getHash.js","./hash/_onHashChanged.js":"d:\\Web\\isotope2\\source\\hash\\_onHashChanged.js","./hash/_setHash.js":"d:\\Web\\isotope2\\source\\hash\\_setHash.js","./sorter/_createButtons.js":"d:\\Web\\isotope2\\source\\sorter\\_createButtons.js","./text/_feedback.js":"d:\\Web\\isotope2\\source\\text\\_feedback.js","./utils/index.js":"d:\\Web\\isotope2\\source\\utils\\index.js"}],"d:\\Web\\isotope2\\source\\sorter\\_createButtons.js":[function(require,module,exports){
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
                $dataSortAttr =    $elm.attr($dataSortBy);

            $self.instances[$self.guid].sortContainer = $sortContainer;

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

},{}],"d:\\Web\\isotope2\\source\\text\\_feedback.js":[function(require,module,exports){
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

},{}],"d:\\Web\\isotope2\\source\\utils\\index.js":[function(require,module,exports){

},{}]},{},["d:\\Web\\isotope2\\source\\simple-isotope.amd.js"])("d:\\Web\\isotope2\\source\\simple-isotope.amd.js")
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImM6XFxQcm9ncmFtIEZpbGVzXFxub2RlanNcXG5vZGVfbW9kdWxlc1xcd2F0Y2hpZnlcXG5vZGVfbW9kdWxlc1xcYnJvd3NlcmlmeVxcbm9kZV9tb2R1bGVzXFxicm93c2VyLXBhY2tcXF9wcmVsdWRlLmpzIiwic291cmNlXFxjbGVhclxcX19jaGVjay5qcyIsInNvdXJjZVxcY2xlYXJcXF9jaGVjay5qcyIsInNvdXJjZVxcY2xlYXJcXF9jcmVhdGVCdXR0b25zLmpzIiwic291cmNlXFxjb25zdHJ1Y3RvclxcanF1ZXJ5LmpzIiwic291cmNlXFxjb25zdHJ1Y3RvclxccHJvdG90eXBlLmpzIiwic291cmNlXFxmaWx0ZXJcXF9jcmVhdGVCdXR0b25zLmpzIiwic291cmNlXFxoYXNoXFxfZm9ybWF0SGFzaC5qcyIsInNvdXJjZVxcaGFzaFxcX2dldEhhc2guanMiLCJzb3VyY2VcXGhhc2hcXF9vbkhhc2hDaGFuZ2VkLmpzIiwic291cmNlXFxoYXNoXFxfc2V0SGFzaC5qcyIsInNvdXJjZVxcc2ltcGxlLWlzb3RvcGUuYW1kLmpzIiwic291cmNlXFxzb3J0ZXJcXF9jcmVhdGVCdXR0b25zLmpzIiwic291cmNlXFx0ZXh0XFxfZmVlZGJhY2suanMiLCJzb3VyY2VcXHV0aWxzXFxpbmRleC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbEdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qKlxyXG4qIF9jaGVjazogQ2hlY2sgaWYgd2UgbmVlZCB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgY2xlYXIgZGl2IHdpdGhvdXQgYW4gaW5zdGFuY2VcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHRoaXMuX29uSXNvdG9wZUNoYW5nZS5jYWxsKHRoaXMsIHRoaXMuaW5zdGFuY2VzW3RoaXMuZ3VpZF0uaXNvdG9wZSk7XHJcbn07XHJcbiIsIi8qKlxyXG4qIF9jaGVjazogQ2hlY2sgaWYgd2UgbmVlZCB0byBlbmFibGUgb3IgZGlzYWJsZSB0aGUgY2xlYXIgZGl2LlxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlKSB7XHJcbiAgICB2YXIgJGNsZWFyID0gJCgnWycrdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmNsZWFyRmlsdGVyKyddJyksXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFGaWx0ZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZmlsdGVyLFxyXG4gICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkYWN0aXZlQ2xhc3MgPSB0aGlzLnNldHRpbmdzLmRlZmF1bHRzLmNsYXNzTmFtZXMuYWN0aXZlLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkY2xlYXIuZWFjaChmdW5jdGlvbihrZXksIGVsbSkge1xyXG4gICAgICAgIHZhciAkZWxtID0gJChlbG0pO1xyXG5cclxuICAgICAgICBpZigkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIgIT0gJGRlZmF1bHRGaWx0ZXIpIHtcclxuXHJcbiAgICAgICAgICAgICRlbG0uc2hvdygpO1xyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG5cclxuICAgICAgICAgICAgJGVsbS5oaWRlKCk7XHJcblxyXG4gICAgICAgICAgICAkc2VsZi5pbnN0YW5jZXNbJHNlbGYuZ3VpZF0uZmlsdGVyQ29udGFpbmVyLmZpbmQoJy4nKyRhY3RpdmVDbGFzcykucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcclxuICAgICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLmZpbHRlckNvbnRhaW5lci5maW5kKCdbJyskZGF0YUZpbHRlcisnPVwiJyskZGVmYXVsdEZpbHRlcisnXCJdJykuYWRkQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcclxuXHJcbiAgICAgICAgICAgICRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5zb3J0Q29udGFpbmVyLmZpbmQoJy4nKyRhY3RpdmVDbGFzcykucmVtb3ZlQ2xhc3MoJGFjdGl2ZUNsYXNzKTtcclxuICAgICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLnNvcnRDb250YWluZXIuZmluZCgnWycrJGRhdGFTb3J0QnkrJz1cIicrJGRlZmF1bHRTb3J0KydcIl0nKS5hZGRDbGFzcygkYWN0aXZlQ2xhc3MpO1xyXG5cclxuICAgICAgICB9XHJcbiAgICB9KTtcclxuXHJcbn1cclxuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkY2xlYXIgPSAkKCdbJyt0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuY2xlYXJGaWx0ZXIrJ10nKSxcclxuICAgICAgICAkZGF0YUZvckNvbnRhaW5lciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJHNlbGYgPSB0aGlzO1xyXG5cclxuICAgICRjbGVhci5lYWNoKGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICRpc0ZvciA9ICRjbGVhci5hdHRyKCRkYXRhRm9yQ29udGFpbmVyKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgJGNvbnRhaW5lciA9ICgkaXNGb3IgPT09IGZhbHNlKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3RvcigkaXNGb3IpO1xyXG5cclxuICAgICAgICAkZWxtLmhpZGUoKS5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XHJcbiAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICQuZWFjaCgkY29udGFpbmVyLCBmdW5jdGlvbigka2V5LCAkaW5zdGFuY2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICBpZigkc2VsZi51c2VIYXNoID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNlbGYuaGFzaC5fc2V0SGFzaC5jYWxsKCRzZWxmLCAkaW5zdGFuY2UsICRkZWZhdWx0RmlsdGVyKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJGluc3RhbmNlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWx0ZXI6ICRkZWZhdWx0RmlsdGVyLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICRkZWZhdWx0U29ydFxyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsICRpbnN0YW5jZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgJGVsbS5oaWRlKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXtcblxuICAgIHZhciAkYXJncyA9IGFyZ3VtZW50c1swXSB8fCB7fSxcbiAgICAgICAgaW5zdGFuY2VzID0gW107XG5cbiAgICBpZih0eXBlb2Ygd2luZG93Lklzb3RvcGUgIT0gXCJmdW5jdGlvblwiKSB7XG4gICAgICAgIGFsZXJ0KFwic2ltcGxlSXNvdG9wZTogSXNvdG9wZS5KUyBjb3VsZG4ndCBiZSBmb3VuZC4gUGxlYXNlIGluY2x1ZGUgJ2lzb3RvcGUucGtnZC5taW4uanMnLlwiKVxuICAgICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgJC5lYWNoKHRoaXMsIGZ1bmN0aW9uKGlkeCwgZWxtKSB7XG4gICAgICAgIHZhciBvYmogPSB7XG4gICAgICAgICAgICBjb250YWluZXI6ICQoZWxtKSxcbiAgICAgICAgICAgIHNldHRpbmdzOiB7XG4gICAgICAgICAgICAgICAgaXRlbVNlbGVjdG9yOiAnLml0ZW0nLFxuICAgICAgICAgICAgICAgIGRhdGFTZWxlY3RvcnM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiAnZGF0YS1maWx0ZXInLFxuICAgICAgICAgICAgICAgICAgICBzb3J0Qnk6ICdkYXRhLXNvcnQtYnknLFxuICAgICAgICAgICAgICAgICAgICBzb3J0QnlTZWxlY3RvcjogJ2RhdGEtc29ydC1zZWxlY3RvcicsXG4gICAgICAgICAgICAgICAgICAgIHNvcnREaXJlY3Rpb246ICdkYXRhLXNvcnQtZGlyZWN0aW9uJyxcbiAgICAgICAgICAgICAgICAgICAgZm9yQ29udGFpbmVyOiAnZGF0YS1mb3ItY29udGFpbmVyJyxcbiAgICAgICAgICAgICAgICAgICAgY2xlYXJGaWx0ZXI6ICdkYXRhLWNsZWFyLWZpbHRlcicsXG4gICAgICAgICAgICAgICAgICAgIGZlZWRiYWNrOiAnZGF0YS1mZWVkYmFjaycsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6ICdkYXRhLWZpbHRlci10eXBlJ1xuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgZGVmYXVsdHM6IHtcbiAgICAgICAgICAgICAgICAgICAgZmlsdGVyOiBcIipcIixcbiAgICAgICAgICAgICAgICAgICAgc29ydDogXCJvcmlnaW5hbC1vcmRlclwiLFxuICAgICAgICAgICAgICAgICAgICBjbGFzc05hbWVzOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhY3RpdmU6ICdhY3RpdmUnXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH07XG5cbiAgICAgICAgaW5zdGFuY2VzLnB1c2gobmV3ICQuc2ltcGxlSXNvdG9wZSgkLmV4dGVuZChvYmosICRhcmdzKSkpO1xuICAgIH0pO1xuXG4gICAgJC5lYWNoKGluc3RhbmNlcywgZnVuY3Rpb24oaWR4LCBlbG0pIHtcbiAgICAgICAgZWxtLnNvcnRlci5fY3JlYXRlQnV0dG9ucy5jYWxsKGVsbSk7XG4gICAgICAgIGVsbS5maWx0ZXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0uY2xlYXIuX2NyZWF0ZUJ1dHRvbnMuY2FsbChlbG0pO1xuICAgICAgICBlbG0udGV4dC5fZmVlZGJhY2suY2FsbChlbG0pO1xuICAgICAgICBlbG0uY2xlYXIuX19jaGVjay5jYWxsKGVsbSk7XG4gICAgfSk7XG5cbiAgICByZXR1cm4gaW5zdGFuY2VzO1xuXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigkYXJncyl7XG4gICAgJC5leHRlbmQodGhpcywgJGFyZ3MpO1xuXG4gICAgdmFyICRzZWxmID0gdGhpcyxcbiAgICAgICAgdGhlSGFzaCA9IHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpO1xuXG4gICAgdGhpcy5ndWlkID0gdGhpcy5jb250YWluZXIuYXR0cihcImlkXCIpIHx8IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICAgIHRoaXMuZW5jb2RlVVJJID0gZmFsc2U7XG5cbiAgICAvL0ZpcnN0IHRpbWUgaW5pdCBpc290b3BlXG4gICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXSA9IHtcbiAgICAgICAgaXNvdG9wZTogbmV3IElzb3RvcGUodGhpcy5jb250YWluZXIuY29udGV4dCwge1xuICAgICAgICAgICAgZmlsdGVyOiB0aGVIYXNoIHx8IFwiKlwiLFxuICAgICAgICAgICAgaXRlbVNlbGVjdG9yOiAkc2VsZi5zZXR0aW5ncy5pdGVtU2VsZWN0b3IgfHwgJy5pdGVtJyxcbiAgICAgICAgICAgIGxheW91dE1vZGU6ICRzZWxmLmNvbnRhaW5lci5kYXRhKFwibGF5b3V0XCIpIHx8IFwiZml0Um93c1wiLFxuICAgICAgICAgICAgZ2V0U29ydERhdGE6ICRzZWxmLl9nZXRTb3J0RGF0YSgpXG4gICAgICAgIH0pXG4gICAgfTtcblxuICAgIGlmKHRoaXMuY29udGFpbmVyLmRhdGEoXCJoYXNoXCIpICE9PSBudWxsICYmIHRoaXMuY29udGFpbmVyLmRhdGEoXCJoYXNoXCIpICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhpcy51c2VIYXNoID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvL0FkZCBoYXNoIHN1cHBvcnRcbiAgICAkKHdpbmRvdykub24oJ2hhc2hjaGFuZ2UnLCB0aGlzLmhhc2guX29uSGFzaENoYW5nZWQuYmluZCh0aGlzKSk7XG5cbiB9O1xuIiwiLyoqXHJcbiogX2NyZWF0ZUJ1dHRvbnMgYW5kIGFkZCBldmVudHMgdG8gaXRcclxuKiBAc2luY2UgMC4xLjBcclxuKi9cclxuXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgdmFyICRmaWx0ZXJzID0gJCgnWycrdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZpbHRlcisnXScpLC8vR2V0IGFsbCBmaWx0ZXIgZWxlbWVudHNcclxuICAgICAgICAkZGF0YUZpbHRlciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5maWx0ZXIsXHJcbiAgICAgICAgJGRhdGFGb3JDb250YWluZXIgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuZm9yQ29udGFpbmVyLFxyXG4gICAgICAgICRkYXRhVHlwZSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy50eXBlLFxyXG4gICAgICAgICRkZWZhdWx0RmlsdGVyID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5maWx0ZXIsXHJcbiAgICAgICAgJGFjdGl2ZUNsYXNzID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSxcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJGZpbHRlcnMuZWFjaChmdW5jdGlvbihpZHgsIGVsbSkge1xyXG4gICAgICAgIGVsbSA9ICQoZWxtKTtcclxuXHJcbiAgICAgICAgLy8gaWYoZWxtLmRhdGEoXCJmaWx0ZXItc2V0XCIpICE9IFwiMVwiKSB7XHJcblxyXG4gICAgICAgICAgICB2YXIgJGZpbHRlckNvbnRhaW5lciA9ICAgZWxtLmNsb3Nlc3QoJ1snKyRkYXRhRm9yQ29udGFpbmVyKyddJyksIC8vR2V0IHBhcmVudCB3aXRoIGRhdGEtZm9yLWNvbnRhaW5lclxyXG4gICAgICAgICAgICAgICAgJG11bHRpcGxlID0gICAgICAgICAgKCRmaWx0ZXJDb250YWluZXIubGVuZ3RoID09IDApID8gZmFsc2UgOiAkZmlsdGVyQ29udGFpbmVyLmF0dHIoJGRhdGFUeXBlKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAgICAgICAgICgkZmlsdGVyQ29udGFpbmVyLmxlbmd0aCA9PSAwKSA/ICRzZWxmLl9nZXRJbnN0YW5jZXMoKSA6ICRzZWxmLl9nZXRFbGVtZW50c0Zyb21TZWxlY3RvcigkZmlsdGVyQ29udGFpbmVyLmF0dHIoJGRhdGFGb3JDb250YWluZXIpKSxcclxuICAgICAgICAgICAgICAgICRkYXRhRmlsdGVyQXR0ciA9ICAgIGVsbS5hdHRyKCRkYXRhRmlsdGVyKTtcclxuXHJcbiAgICAgICAgICAgICRzZWxmLmluc3RhbmNlc1skc2VsZi5ndWlkXS5maWx0ZXJDb250YWluZXIgPSAkZmlsdGVyQ29udGFpbmVyO1xyXG5cclxuICAgICAgICAgICAgZWxtLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcclxuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgJGZpbHRlclZhbHVlID0gJycsXHJcbiAgICAgICAgICAgICAgICAgICAgYWN0aXZlID0gJHNlbGYuX3RvZ2dsZUNsYXNzKGVsbSwgJGZpbHRlckNvbnRhaW5lciwgJGFjdGl2ZUNsYXNzLCAkbXVsdGlwbGUsICRkYXRhRmlsdGVyQXR0ciA9PSAkZGVmYXVsdEZpbHRlciwgJ1snKyRkYXRhRmlsdGVyKyc9XCInKyRkZWZhdWx0RmlsdGVyKydcIl0nKTtcclxuXHJcbiAgICAgICAgICAgICAgICAkZmlsdGVyVmFsdWUgPSAkZGF0YUZpbHRlckF0dHI7XHJcbiAgICAgICAgICAgICAgICAkLmVhY2goJGNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCAkaW5zdGFuY2UpIHtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNlbGYudXNlSGFzaCA9PT0gdHJ1ZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2VsZi5oYXNoLl9zZXRIYXNoLmNhbGwoJHNlbGYsICRpbnN0YW5jZSwgJGZpbHRlclZhbHVlLCBhY3RpdmUpO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRpbnN0YW5jZS5hcnJhbmdlKHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcjogJGZpbHRlclZhbHVlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNlbGYuX29uSXNvdG9wZUNoYW5nZS5jYWxsKCRzZWxmLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gJChlbG0pLmRhdGEoXCJmaWx0ZXItc2V0XCIsIFwiMVwiKTtcclxuICAgICAgICAvLyB9XHJcblxyXG4gICAgfSk7XHJcbn07XHJcbiIsIi8qKlxuKiBfZm9ybWF0SGFzaDogRm9ybWF0IG11bHRpcGxlIGZpbHRlcnMgaW50byBvbmUgc3RyaW5nIGJhc2VkIG9uIGEgcmVndWxhciBleHByZXNzaW9uXG4qIEBzaW5jZSAwLjEuMFxuKiBAcGFyYW0ge3JlZ2V4fSByZVxuKiBAcGFyYW0ge3N0cmluZ30gc3RyXG4qL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihyZSwgc3RyKSB7XG4gICAgdmFyIG1hdGNoZXMgPSB7fSxcbiAgICAgICAgbWF0Y2g7XG5cbiAgICB3aGlsZSAoKG1hdGNoID0gcmUuZXhlYyhzdHIpKSAhPSBudWxsKSB7XG4gICAgICAgIGlmIChtYXRjaC5pbmRleCA9PT0gcmUubGFzdEluZGV4KSB7XG4gICAgICAgICAgICByZS5sYXN0SW5kZXgrKztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKG1hdGNoWzNdICE9PSBudWxsICYmIG1hdGNoWzNdICE9PSB1bmRlZmluZWQpIHtcblxuICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFszXV0gPSB0cnVlO1xuXG4gICAgICAgIH0gZWxzZSB7XG5cbiAgICAgICAgICAgIGlmKG1hdGNoZXNbbWF0Y2hbMV1dID09IG51bGwgfHwgbWF0Y2hlc1ttYXRjaFsxXV0gPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgICAgbWF0Y2hlc1ttYXRjaFsxXV0gPSBbXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIG1hdGNoZXNbbWF0Y2hbMV1dLnB1c2gobWF0Y2hbMl0pO1xuXG4gICAgICAgIH1cblxuICAgIH1cblxuICAgIHJldHVybiBtYXRjaGVzO1xufTtcbiIsIi8qKlxuICogX2dldEhhc2g6IEdldCB3aW5kb3cubG9jYXRpb24uaGFzaCBhbmQgZm9ybWF0IGl0IGZvciBJc290b3BlXG4gKiBAc2luY2UgMC4xLjBcbiAqL1xuXG4gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgJGhhc2ggPSB3aW5kb3cubG9jYXRpb24uaGFzaCB8fCBmYWxzZSxcbiAgICAgICAgJG5ld0hhc2ggPSBcIlwiLFxuICAgICAgICAkc2VsZiA9IHRoaXM7XG5cbiAgICAkaGFzaCA9ICgkaGFzaCAhPT0gZmFsc2UgJiYgJGhhc2ggIT0gXCIjXCIgJiYgJGhhc2ggIT0gXCJcIikgPyBkZWNvZGVVUklDb21wb25lbnQod2luZG93LmxvY2F0aW9uLmhhc2gpIDogJyonO1xuXG4gICAgLy9SZW1vdmUgaGFzaCBmcm9tIGZpcnN0IGNoYXJhY3RlciBpZiBpdHMgZXhpc3RcbiAgICBpZiAoJGhhc2guY2hhckF0KDApID09PSAnIycpIHtcbiAgICAgICAgICRoYXNoID0gJGhhc2guc2xpY2UoMSk7XG4gICAgfVxuXG4gICAgJC5lYWNoKCRoYXNoLnNwbGl0KFwiJlwiKSwgZnVuY3Rpb24oa2V5LCAkcGFydEhhc2gpIHtcblxuICAgICAgICBpZigkcGFydEhhc2guaW5kZXhPZihcIj1cIikgIT09IC0xKSB7XG5cbiAgICAgICAgICAgIHZhciB0bXAgPSAkcGFydEhhc2guc3BsaXQoXCI9XCIpLFxuICAgICAgICAgICAgICAgIGFyciA9IFtdO1xuXG4gICAgICAgICAgICBpZih0bXAubGVuZ3RoID4gMSkge1xuICAgICAgICAgICAgICAgIHZhciBuYW1lID0gdG1wWzBdLFxuICAgICAgICAgICAgICAgICAgICB2YWx1ZXMgPSB0bXBbMV0ucmVwbGFjZSgvXFwnL2csIFwiXCIpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YWx1ZXMgPSB2YWx1ZXMuc3BsaXQoXCIsXCIpO1xuICAgICAgICAgICAgZm9yICh2YXIgaT0wOyBpPHZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGFyci5wdXNoKFwiW2RhdGEtXCIgKyBuYW1lICsgXCI9J1wiICsgdmFsdWVzW2ldICsgXCInXVwiKTtcblxuICAgICAgICAgICAgICAgICQoXCJbZGF0YS1maWx0ZXI9XFxcIltkYXRhLVwiICsgbmFtZSArIFwiPSdcIiArIHZhbHVlc1tpXSArIFwiJ11cXFwiXVwiKS5hZGRDbGFzcygkc2VsZi5zZXR0aW5ncy5kZWZhdWx0cy5jbGFzc05hbWVzLmFjdGl2ZSk7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICRuZXdIYXNoICs9IGFyci5qb2luKFwiLFwiKTtcblxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgJG5ld0hhc2ggKz0gJHBhcnRIYXNoXG4gICAgICAgICAgICAgICAgLnJlcGxhY2UoXCIjXCIsIFwiLlwiKVx0ICAvL3JlcGxhY2UgXCIjXCIgd2l0aCBcIi5cIlxuICAgICAgICAgICAgICAgIC5yZXBsYWNlKC8mL2csIFwiLCAuXCIpOyAgLy9yZXBsYWNlIFwiJlwiIHdpdGggXCIsIC5cIlxuICAgICAgICB9XG5cbiAgICB9KTtcblxuICAgIC8vICAvL0NoZWNrIGlmIHRoaXMgaXMgYSBkYXRhIGdyb3VwXG4gICAgLy8gIGlmKCRoYXNoLmluZGV4T2YoXCI9XCIpICE9PSAtMSkge1xuICAgIC8vICAgICAgJGhhc2ggPSAkaGFzaC5zcGxpdChcIiZcIik7XG4gICAgIC8vXG4gICAgLy8gICAgICBmb3IgKHZhciBpPTA7IGk8JGhhc2gubGVuZ3RoOyBpKyspIHtcbiAgICAvLyAgICAgICAgICB2YXIgdG1wID0gJGhhc2hbaV0uc3BsaXQoXCI9XCIpLFxuICAgIC8vICAgICAgICAgICAgICBhcnIgPSBbXTtcbiAgICAgLy9cbiAgICAvLyAgICAgICAgICBpZih0bXAubGVuZ3RoID4gMSkge1xuICAgIC8vICAgICAgICAgICAgICB2YXIgbmFtZSA9IHRtcFswXSxcbiAgICAvLyAgICAgICAgICAgICAgICAgIHZhbHVlcyA9IHRtcFsxXTtcbiAgICAvLyAgICAgICAgICB9XG4gICAgIC8vXG4gICAgLy8gICAgICAgICAgdmFsdWVzID0gdmFsdWVzLnNwbGl0KFwiLFwiKTtcbiAgICAvLyAgICAgICAgICBmb3IgKHZhciBpPTA7IGk8dmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgLy9cbiAgICAvLyAgICAgICAgICAgICAgYXJyLnB1c2goXCJbZGF0YS1cIituYW1lK1wiPSdcIit2YWx1ZXNbaV0rXCInXVwiKTtcbiAgICAvLyAgICAgICAgICB9XG4gICAgLy8gICAgICAgICAvLyAgY29uc29sZS5sb2coYXJyKTtcbiAgICAvLyAgICAgIH1cbiAgICAgLy9cbiAgICAvLyAgICAgICRuZXdIYXNoID0gYXJyLmpvaW4oXCJcIik7XG4gICAgIC8vXG4gICAgLy8gIH0gZWxzZSB7XG4gICAgIC8vXG4gICAgLy8gICAgICAkbmV3SGFzaCA9ICRoYXNoXG4gICAgLy8gICAgICAgICAgLnJlcGxhY2UoXCIjXCIsIFwiLlwiKVx0ICAvL3JlcGxhY2UgXCIjXCIgd2l0aCBcIi5cIlxuICAgIC8vICAgICAgICAgIC5yZXBsYWNlKC8mL2csIFwiLCAuXCIpOyAgLy9yZXBsYWNlIFwiJlwiIHdpdGggXCIsIC5cIlxuICAgICAvL1xuICAgIC8vICB9XG5cbiAgICAgcmV0dXJuICRuZXdIYXNoO1xuXG4gfTtcbiIsIi8qKlxyXG4qIF9vbkhhc2hDaGFuZ2U6IGZpcmVzIHdoZW4gbG9jYXRpb24uaGFzaCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiogQHNpbmNlIDAuMS4wXHJcbiovXHJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZSkge1xyXG4gICAgdGhpcy5fc2V0SXNvdG9wZS5jYWxsKHRoaXMsIHRoaXMuaGFzaC5fZ2V0SGFzaC5jYWxsKHRoaXMpKTtcclxufTtcclxuIiwiLyoqXG4gKiBfc2V0SGFzaDogU2V0IGEgbmV3IGxvY2F0aW9uLmhhc2ggYWZ0ZXIgZm9ybWF0dGluZyBpdFxuICogQHNpbmNlIDAuMS4wXG4gKiBAcGFyYW0ge29iamVjdH0gJGluc3RhbmNlXG4gKiBAcGFyYW0ge3N0cmluZ30gJG5ld0hhc2hcbiAqIEBwYXJhbSB7Ym9vbGVhbn0gJGFjdGl2ZVxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oJGluc3RhbmNlLCAkbmV3SGFzaCwgJGFjdGl2ZSkge1xuICAgIHZhciAkY3VycmVudEhhc2ggPSAoJGluc3RhbmNlLm9wdGlvbnMuZmlsdGVyID09IFwiKlwiKSA/IFwiXCIgOiAkaW5zdGFuY2Uub3B0aW9ucy5maWx0ZXIsXG4gICAgICAgICRjb21iaW5lZEhhc2g7XG5cbiAgICBpZigkbmV3SGFzaCAhPSBcIipcIikge1xuXG4gICAgICAgIGlmKCRjdXJyZW50SGFzaC5pbmRleE9mKCRuZXdIYXNoKSA9PT0gLTEpIHtcbiAgICAgICAgICAgICRjb21iaW5lZEhhc2ggPSAkY3VycmVudEhhc2ggKyAkbmV3SGFzaDtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICRjb21iaW5lZEhhc2ggPSAkY3VycmVudEhhc2gucmVwbGFjZSgkbmV3SGFzaCwgXCJcIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgJGZvcm1hdHRlZEhhc2ggPSB0aGlzLmhhc2guX2Zvcm1hdEhhc2goL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdfCguW0EtWmEtejAtOV0rKS9nLCAkY29tYmluZWRIYXNoKSxcbiAgICAgICAgICAgICRlbmRIYXNoID0gW107XG5cbiAgICAgICAgJC5lYWNoKCRmb3JtYXR0ZWRIYXNoLCBmdW5jdGlvbihrZXksIGVsbSkge1xuICAgICAgICAgICAgaWYoZWxtID09PSB0cnVlKSB7Ly9pc0NsYXNzXG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaChrZXkpO1xuICAgICAgICAgICAgfSBlbHNlIHsvL2lzT2JqZWN0XG4gICAgICAgICAgICAgICAgJGVuZEhhc2gucHVzaChrZXkgKyBcIj1cIiArIGVsbS5qb2luKFwiLFwiKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgICRlbmRIYXNoID0gJGVuZEhhc2guam9pbihcIiZcIik7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgJGVuZEhhc2ggPSAkbmV3SGFzaDtcbiAgICB9XG5cbiAgICAvLyBpZigkY29tYmluZWRIYXNoLmluZGV4T2YoXCJkYXRhLVwiKSAhPT0gLTEpIHsvL0NoZWNrIGlmIHdlIGZpbHRlciBvbiBjbGFzc2VzIG9yIGRhdGEgYXR0cmlidXRlc1xuICAgIC8vICAgICB2YXIgJGZvcm1hdHRlZEhhc2ggPSB0aGlzLmhhc2guX2Zvcm1hdEhhc2goL1xcW2RhdGFcXC0oLis/KVxcPVxcJyguKz8pXFwnXFxdL2csICRjb21iaW5lZEhhc2gpO1xuICAgIC8vICAgICAgICAgLy8gLnJlcGxhY2UoL1xcJ3xcXFwifFxcW3xcXF18XFx7fFxcfS9nLCBcIlwiKTtcbiAgICAvLyAgICAgICAgIC8vIC5yZXBsYWNlKC9cXDovZywgXCI9XCIpO1xuICAgIC8vXG4gICAgLy8gICAgICRjb21iaW5lZEhhc2ggPSBcIlwiO1xuICAgIC8vICAgICBjb25zb2xlLmxvZygkZm9ybWF0dGVkSGFzaCk7XG4gICAgLy8gICAgICRmb3JtYXR0ZWRIYXNoLmVhY2goZnVuY3Rpb24oa2V5LCAkZWxtKSB7XG4gICAgLy8gICAgICAgICAkZWxtID0gJChlbG0pO1xuICAgIC8vXG4gICAgLy8gICAgICAgICAkY29tYmluZWRIYXNoXG4gICAgLy8gICAgIH0pO1xuICAgIC8vXG4gICAgLy8gfSBlbHNlIHtcbiAgICAvLyAgICAgJGNvbWJpbmVkSGFzaCA9ICRjb21iaW5lZEhhc2hcbiAgICAvLyAgICAgICAgIC5yZXBsYWNlKC9cXCcvZywgXCJcIilcbiAgICAvLyAgICAgICAgIC5yZXBsYWNlKC9cXC4vZyxcIlwiKVx0ICAvL3JlcGxhY2UgXCIuXCIgd2l0aCBub3RoaW5nXG4gICAgLy8gICAgICAgICAucmVwbGFjZSgvXFxzL2csXCJcIilcdCAgLy9yZXBsYWNlIFwiIFwiIHdpdGggXCJcIlxuICAgIC8vICAgICAgICAgLnJlcGxhY2UoL1xcLC9nLFwiJlwiKTtcdC8vcmVwbGFjZSBcIixcIiB3aXRoIFwiJlwiXG4gICAgLy8gfVxuXG4gICAgaWYoJGVuZEhhc2ggPT0gXCIqXCIgfHwgJGVuZEhhc2ggPT0gXCJcIikge1xuICAgICAgICB3aW5kb3cubG9jYXRpb24uaGFzaCA9IFwiXCI7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgd2luZG93LmxvY2F0aW9uLmhhc2ggPSAodGhpcy5lbmNvZGVVUkkgPT09IHRydWUpID8gZW5jb2RlVVJJQ29tcG9uZW50KCRlbmRIYXNoKSA6ICRlbmRIYXNoO1xuICAgIH1cblxuICAgIHJldHVybiAkZW5kSGFzaDtcbn07XG4iLCJ2YXIgJCA9IHdpbmRvdy5qUXVlcnk7XHJcblxyXG4kLnNpbXBsZUlzb3RvcGUgPSByZXF1aXJlKFwiLi9jb25zdHJ1Y3Rvci9wcm90b3R5cGUuanNcIik7XHJcblxyXG4kLnNpbXBsZUlzb3RvcGUucHJvdG90eXBlID0ge1xyXG4gICAgaW5zdGFuY2VzOiB7fSxcclxuICAgIGNvbnN0cnVjdG9yOiAkLnNpbXBsZUlzb3RvcGUsXHJcblxyXG4gICAgaGFzaDoge1xyXG4gICAgICAgIF9nZXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19nZXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9zZXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19zZXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9mb3JtYXRIYXNoOiByZXF1aXJlKFwiLi9oYXNoL19mb3JtYXRIYXNoLmpzXCIpLFxyXG4gICAgICAgIF9vbkhhc2hDaGFuZ2VkOiByZXF1aXJlKFwiLi9oYXNoL19vbkhhc2hDaGFuZ2VkLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgZmlsdGVyOiB7XHJcbiAgICAgICAgX2NyZWF0ZUJ1dHRvbnM6IHJlcXVpcmUoXCIuL2ZpbHRlci9fY3JlYXRlQnV0dG9ucy5qc1wiKVxyXG4gICAgfSxcclxuICAgIHNvcnRlcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9zb3J0ZXIvX2NyZWF0ZUJ1dHRvbnMuanNcIilcclxuICAgIH0sXHJcbiAgICBjbGVhcjoge1xyXG4gICAgICAgIF9jcmVhdGVCdXR0b25zOiByZXF1aXJlKFwiLi9jbGVhci9fY3JlYXRlQnV0dG9ucy5qc1wiKSxcclxuICAgICAgICBfY2hlY2s6IHJlcXVpcmUoXCIuL2NsZWFyL19jaGVjay5qc1wiKSxcclxuICAgICAgICBfX2NoZWNrOiByZXF1aXJlKFwiLi9jbGVhci9fX2NoZWNrLmpzXCIpXHJcbiAgICB9LFxyXG4gICAgdGV4dDoge1xyXG4gICAgICAgIF9mZWVkYmFjazogcmVxdWlyZShcIi4vdGV4dC9fZmVlZGJhY2suanNcIilcclxuICAgIH0sXHJcblxyXG4gICAgdXRpbHM6IHJlcXVpcmUoXCIuL3V0aWxzL2luZGV4LmpzXCIpLFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfb25CZWZvcmVJc290b3BlQ2hhbmdlOiBmaXJlcyBiZWZvcmUgdGhlIElzb3RvcGUgbGF5b3V0IGhhcyBiZWVuIGNoYW5nZWRcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkaW5zdGFuY2VcclxuICAgICovXHJcbiAgICBfb25CZWZvcmVJc290b3BlQ2hhbmdlOiBmdW5jdGlvbigkaW5zdGFuY2UpIHt9LFxyXG5cclxuICAgIC8qKlxyXG4gICAgKiBfb25Jc290b3BlQ2hhbmdlOiBmaXJlcyB3aGVuIHRoZSBJc290b3BlIGxheW91dCBoYXMgYmVlbiBjaGFuZ2VkXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gJGluc3RhbmNlXHJcbiAgICAqL1xyXG4gICAgX29uSXNvdG9wZUNoYW5nZTogZnVuY3Rpb24oJGluc3RhbmNlKSB7XHJcbiAgICAgICAgdGhpcy5jbGVhci5fY2hlY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgICAgIHRoaXMudGV4dC5fZmVlZGJhY2suY2FsbCh0aGlzLCAkaW5zdGFuY2UpO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX3NldElzb3RvcGU6IFJlY29uZmlndXJlIGlzb3RvcGVcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqIEBwYXJhbSB7c3RyaW5nfSAkc2VsZWN0b3JcclxuICAgICovXHJcbiAgICBfc2V0SXNvdG9wZTogZnVuY3Rpb24oJHNlbGVjdG9yKSB7XHJcbiAgICAgICAgdGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlLmFycmFuZ2Uoe1xyXG4gICAgICAgICAgICBmaWx0ZXI6ICRzZWxlY3RvclxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLl9vbklzb3RvcGVDaGFuZ2UodGhpcy5pbnN0YW5jZXNbdGhpcy5ndWlkXS5pc290b3BlKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAgKiBfZ2V0U29ydERhdGE6IEdldCB0aGUgZGF0YS1zb3J0LWJ5IGF0dHJpYnV0ZXMgYW5kIG1ha2UgdGhlbSBpbnRvIGFuIElzb3RvcGUgXCJnZXRTb3J0RGF0YVwiIG9iamVjdFxyXG4gICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAgKi9cclxuICAgIF9nZXRTb3J0RGF0YTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyICRzb3J0RGF0YSA9IHt9LFxyXG4gICAgICAgICAgICAkZGF0YVNvcnRCeSA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnksXHJcbiAgICAgICAgICAgICRkYXRhU29ydEJ5U2VsZWN0b3IgPSB0aGlzLnNldHRpbmdzLmRhdGFTZWxlY3RvcnMuc29ydEJ5U2VsZWN0b3IsXHJcbiAgICAgICAgICAgICRkYXRhU29ydEJ5RGVmYXVsdCA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuc29ydDtcclxuXHJcbiAgICAgICAgJCgnWycgKyAkZGF0YVNvcnRCeSArICddLCBbJyArICRkYXRhU29ydEJ5U2VsZWN0b3IgKyAnXScpLmVhY2goZnVuY3Rpb24oaWR4LCBlbG0pIHtcclxuICAgICAgICAgICAgdmFyICRlbG0gPSAkKGVsbSksXHJcbiAgICAgICAgICAgICAgICAkbmFtZSA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeSkgfHwgbnVsbCxcclxuICAgICAgICAgICAgICAgICRzZWxlY3RvciA9ICRlbG0uYXR0cigkZGF0YVNvcnRCeVNlbGVjdG9yKSB8fCBudWxsO1xyXG5cclxuICAgICAgICAgICAgaWYoJG5hbWUgIT0gJGRhdGFTb3J0QnlEZWZhdWx0KSB7XHJcbiAgICAgICAgICAgICAgICBpZigkbmFtZSAhPT0gbnVsbCAmJiAkc2VsZWN0b3IgIT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc29ydERhdGFbJG5hbWVdID0gJHNlbGVjdG9yO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICBhbGVydChcIklzb3RvcGUgc29ydGluZzogXCIrJGRhdGFTb3J0QnkrXCIgYW5kIFwiKyRkYXRhU29ydEJ5U2VsZWN0b3IrXCIgYXJlIHJlcXVpcmVkLiBDdXJyZW50bHkgY29uZmlndXJlZCBcIiskZGF0YVNvcnRCeStcIj0nXCIgKyAkbmFtZSArIFwiJyBhbmQgXCIrJGRhdGFTb3J0QnlTZWxlY3RvcitcIj0nXCIgKyAkc2VsZWN0b3IgKyBcIidcIilcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gJHNvcnREYXRhO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX3RvZ2dsZUNsYXNzOiBIZWxwZXIgdG8gdG9nZ2xlIG9yIHJlbW92ZSBjbGFzc2VzIGVhc2llclxyXG4gICAgKiBAc2luY2UgMC4xLjBcclxuICAgICogQHBhcmFtIHtlbGVtZW50fSAkZWxtXHJcbiAgICAqIEBwYXJhbSB7ZWxlbWVudH0gJGNvbnRhaW5lclxyXG4gICAgKiBAcGFyYW0ge3N0cmluZ30gY2xhc3NOYW1lXHJcbiAgICAqIEBwYXJhbSB7Ym9vbGVhbn0gbXVsdGlwbGVcclxuICAgICogQHBhcmFtIHtib29sZWFufSBtYXRjaFxyXG4gICAgKi9cclxuICAgIF90b2dnbGVDbGFzczogZnVuY3Rpb24oJGVsbSwgJGNvbnRhaW5lciwgY2xhc3NOYW1lLCBtdWx0aXBsZSwgbWF0Y2gsIGZpbmREZWZhdWx0KSB7XHJcbiAgICAgICAgbWF0Y2ggPSBtYXRjaCB8fCBmYWxzZTtcclxuICAgICAgICBtdWx0aXBsZSA9IG11bHRpcGxlIHx8IGZhbHNlO1xyXG5cclxuICAgICAgICBpZihtdWx0aXBsZSAhPT0gZmFsc2UpIHtcclxuXHJcbiAgICAgICAgICAgIGlmKG1hdGNoKSB7XHJcbiAgICAgICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJy4nK2NsYXNzTmFtZSkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICRlbG0uYWRkQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIuZmluZChmaW5kRGVmYXVsdCkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgICAgICRlbG0udG9nZ2xlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAkY29udGFpbmVyLmZpbmQoJy4nK2NsYXNzTmFtZSkucmVtb3ZlQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgICAgICAgICAgJGVsbS5hZGRDbGFzcyhjbGFzc05hbWUpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuICRlbG0uaGFzQ2xhc3MoY2xhc3NOYW1lKTtcclxuICAgIH0sXHJcblxyXG4gICAgLyoqXHJcbiAgICAqIF9nZXRJbnN0YW5jZXNcclxuICAgICogQHNpbmNlIDAuMS4wXHJcbiAgICAqL1xyXG4gICAgX2dldEluc3RhbmNlczogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgdmFyIHRtcCA9IFtdXHJcblxyXG4gICAgICAgICQuZWFjaCh0aGlzLmluc3RhbmNlcywgZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICAgICAgdG1wLnB1c2goZWxtLmlzb3RvcGUpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gdG1wO1xyXG4gICAgfSxcclxuXHJcbiAgICAvKipcclxuICAgICogX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yXHJcbiAgICAqIEBzaW5jZSAwLjEuMFxyXG4gICAgKi9cclxuICAgIF9nZXRFbGVtZW50c0Zyb21TZWxlY3RvcjogZnVuY3Rpb24oc2VsZWN0b3IpIHtcclxuICAgICAgICB2YXIgJHRtcDtcclxuXHJcbiAgICAgICAgaWYoc2VsZWN0b3IuY2hhckF0KDApID09IFwiI1wiIHx8IHNlbGVjdG9yLmNoYXJBdCgwKSA9PSBcIi5cIikge1x0XHRcdFx0Ly90aGlzIGxvb2tzIGxpa2UgYSB2YWxpZCBDU1Mgc2VsZWN0b3JcclxuICAgICAgICAgICAgJHRtcCA9ICQoc2VsZWN0b3IpO1xyXG4gICAgICAgIH0gZWxzZSBpZihzZWxlY3Rvci5pbmRleE9mKFwiI1wiKSAhPT0gLTEgfHwgc2VsZWN0b3IuaW5kZXhPZihcIi5cIikgIT09IC0xKSB7XHQvL3RoaXMgbG9va3MgbGlrZSBhIHZhbGlkIENTUyBzZWxlY3RvclxyXG4gICAgICAgICAgICAkdG1wID0gJChzZWxlY3Rvcik7XHJcbiAgICAgICAgfSBlbHNlIGlmKHNlbGVjdG9yLmluZGV4T2YoXCIgXCIpICE9PSAtMSkge1x0XHRcdFx0XHRcdFx0XHRcdC8vdGhpcyBsb29rcyBsaWtlIGEgdmFsaWQgQ1NTIHNlbGVjdG9yXHJcbiAgICAgICAgICAgICR0bXAgPSAkKHNlbGVjdG9yKTtcclxuICAgICAgICB9IGVsc2Uge1x0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHRcdFx0XHQvL2V2dWxhdGUgdGhlIHN0cmluZyBhcyBhbiBpZFxyXG4gICAgICAgICAgICAkdG1wID0gJChcIiNcIiArIHNlbGVjdG9yKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGlmKCR0bXAubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcInNpbXBsZUlzb3RvcGU6IFdlIGNhbm5vdCBmaW5kIGFueSBET00gZWxlbWVudCB3aXRoIHRoZSBDU1Mgc2VsZWN0b3I6IFwiICsgc2VsZWN0b3IpO1xyXG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgdmFyICR0bXBBcnIgPSBbXTtcclxuICAgICAgICAgICAgJC5lYWNoKHRoaXMuaW5zdGFuY2VzLCBmdW5jdGlvbihrZXksIGluc3RhbmNlKSB7XHJcbiAgICAgICAgICAgICAgICBpZigkKGluc3RhbmNlLmlzb3RvcGUuZWxlbWVudClbMF0gPT09ICR0bXBbMF0pIHtcclxuICAgICAgICAgICAgICAgICAgICAkdG1wQXJyLnB1c2goaW5zdGFuY2UuaXNvdG9wZSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICByZXR1cm4gJHRtcEFycjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIHJldHVybiAkdG1wO1xyXG4gICAgfVxyXG59O1xyXG5cclxuJC5mbi5zaW1wbGVJc290b3BlID0gcmVxdWlyZShcIi4vY29uc3RydWN0b3IvanF1ZXJ5LmpzXCIpXHJcblxyXG4kKGRvY3VtZW50KS5yZWFkeShmdW5jdGlvbigpIHtcclxuICAgICQuZWFjaCgkKFwiW2RhdGEtaXNvdG9wZV1cIiksIGZ1bmN0aW9uKGtleSwgZWxtKSB7XHJcbiAgICAgICAgJChlbG0pLnNpbXBsZUlzb3RvcGUoKTtcclxuICAgIH0pXHJcbn0pO1xyXG4iLCIvKipcclxuKiBfY3JlYXRlQnV0dG9ucyBhbmQgYWRkIGV2ZW50cyB0byBpdFxyXG4qIEBzaW5jZSAwLjEuMFxyXG4qL1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpIHtcclxuICAgIHZhciAkc29ydGVycyA9ICQoJ1snK3RoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5zb3J0QnkrJ10nKSwvL0dldCBhbGwgc29ydCBlbGVtZW50c1xyXG4gICAgICAgICRkYXRhU29ydEJ5ID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnRCeSxcclxuICAgICAgICAkZGF0YUZvckNvbnRhaW5lciA9IHRoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mb3JDb250YWluZXIsXHJcbiAgICAgICAgJGRhdGFTb3J0RGlyZWN0aW9uID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnNvcnREaXJlY3Rpb24sXHJcbiAgICAgICAgJGRhdGFUeXBlID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLnR5cGUsXHJcbiAgICAgICAgJGRlZmF1bHRTb3J0ID0gdGhpcy5zZXR0aW5ncy5kZWZhdWx0cy5zb3J0LFxyXG4gICAgICAgICRhY3RpdmVDbGFzcyA9IHRoaXMuc2V0dGluZ3MuZGVmYXVsdHMuY2xhc3NOYW1lcy5hY3RpdmUsXHJcbiAgICAgICAgJHNvcnRBcnJheSA9IFtdLFxyXG4gICAgICAgICRzZWxmID0gdGhpcztcclxuXHJcbiAgICAkc29ydGVycy5lYWNoKGZ1bmN0aW9uKGlkeCwgZWxtKSB7XHJcbiAgICAgICAgdmFyICRlbG0gPSAkKGVsbSk7XHJcblxyXG4gICAgICAgIC8vIGlmKGVsbS5kYXRhKFwic29ydC1zZXRcIikgIT0gXCIxXCIpIHtcclxuXHJcbiAgICAgICAgICAgIHZhciAkc29ydENvbnRhaW5lciA9ICAgJGVsbS5jbG9zZXN0KCdbJyskZGF0YUZvckNvbnRhaW5lcisnXScpLFxyXG4gICAgICAgICAgICAgICAgJG11bHRpcGxlID0gICAgICAgICgkc29ydENvbnRhaW5lci5sZW5ndGggPT0gMCkgPyBmYWxzZSA6ICRzb3J0Q29udGFpbmVyLmF0dHIoJGRhdGFUeXBlKSB8fCBmYWxzZSxcclxuICAgICAgICAgICAgICAgICRjb250YWluZXIgPSAgICAgICAoJHNvcnRDb250YWluZXIubGVuZ3RoID09IDApID8gJHNlbGYuX2dldEluc3RhbmNlcygpIDogJHNlbGYuX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yKCRzb3J0Q29udGFpbmVyLmF0dHIoJGRhdGFGb3JDb250YWluZXIpKSxcclxuICAgICAgICAgICAgICAgICRkYXRhU29ydEF0dHIgPSAgICAkZWxtLmF0dHIoJGRhdGFTb3J0QnkpO1xyXG5cclxuICAgICAgICAgICAgJHNlbGYuaW5zdGFuY2VzWyRzZWxmLmd1aWRdLnNvcnRDb250YWluZXIgPSAkc29ydENvbnRhaW5lcjtcclxuXHJcbiAgICAgICAgICAgIHZhciBob3cgPSB7XHJcbiAgICAgICAgICAgICAgICBldmVudE5hbWU6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gXCJjaGFuZ2VcIiA6IFwiY2xpY2tcIixcclxuICAgICAgICAgICAgICAgIGVsZW1lbnQ6ICRlbG0ucHJvcChcInRhZ05hbWVcIikudG9Mb3dlckNhc2UoKSA9PSBcIm9wdGlvblwiID8gJGVsbS5jbG9zZXN0KFwic2VsZWN0XCIpIDogJGVsbVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgaG93LmVsZW1lbnQub24oaG93LmV2ZW50TmFtZSwgZnVuY3Rpb24oZSkge1xyXG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKGhvdy5ldmVudE5hbWUgPT0gXCJjaGFuZ2VcIikge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGhvdy5lbGVtZW50LmZpbmQoJ29wdGlvbjpzZWxlY3RlZCcpWzBdICE9IGVsbSkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIHZhciAkc29ydEJ5VmFsdWUgPSAnJztcclxuXHJcbiAgICAgICAgICAgICAgICAkc2VsZi5fdG9nZ2xlQ2xhc3MoJGVsbSwgJHNvcnRDb250YWluZXIsICRhY3RpdmVDbGFzcywgJG11bHRpcGxlLCAkZGF0YVNvcnRBdHRyID09ICRkZWZhdWx0U29ydCwgJ1snKyRkYXRhU29ydEJ5Kyc9XCInKyRkZWZhdWx0U29ydCsnXCJdJyk7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJG11bHRpcGxlICE9PSBmYWxzZSkge1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc29ydEJ5VmFsdWUgPSBbXTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJGRhdGFTb3J0QXR0ciA9PSAkZGVmYXVsdFNvcnQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRBcnJheSA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSA9PT0gLTEpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkucHVzaCgkZGF0YVNvcnRBdHRyKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXJyYXkuc3BsaWNlKCRzb3J0QXJyYXkuaW5kZXhPZigkZGF0YVNvcnRBdHRyKSwgMSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRzb3J0QXJyYXkubGVuZ3RoID09IDApIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRlZmF1bHRTb3J0O1xyXG4gICAgICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QnlWYWx1ZSA9ICRzb3J0QXJyYXk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNvcnRCeVZhbHVlID0gJGRhdGFTb3J0QXR0cjtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgICAgICAkLmVhY2goJGNvbnRhaW5lciwgZnVuY3Rpb24oa2V5LCBjb250YWluZXIpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgJHNvcnRBc2MgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IG51bGwgJiYgJGVsbS5hdHRyKCRkYXRhU29ydERpcmVjdGlvbikgIT09IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0RGlyZWN0aW9uKS50b0xvd2VyQ2FzZSgpID09IFwiYXNjXCIpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzb3J0QXNjID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBpZigkZWxtLmF0dHIoJGRhdGFTb3J0QnkpID09ICRkZWZhdWx0U29ydCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc29ydEFzYyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICBjb250YWluZXIuYXJyYW5nZSh7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNvcnRCeTogJHNvcnRCeVZhbHVlLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3J0QXNjZW5kaW5nOiAkc29ydEFzY1xyXG4gICAgICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAkc2VsZi5fb25Jc290b3BlQ2hhbmdlLmNhbGwoJHNlbGYsIGNvbnRhaW5lcik7XHJcblxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgLy8gZWxtLmRhdGEoXCJzb3J0LXNldFwiLCBcIjFcIik7XHJcbiAgICAgICAgLy8gfVxyXG5cclxuICAgIH0pO1xyXG59O1xyXG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKCkge1xyXG4gICAgdmFyICRmZWVkYmFjayA9ICQoJ1snK3RoaXMuc2V0dGluZ3MuZGF0YVNlbGVjdG9ycy5mZWVkYmFjaysnXScpLFxyXG4gICAgICAgICRkYXRhRm9yQ29udGFpbmVyID0gdGhpcy5zZXR0aW5ncy5kYXRhU2VsZWN0b3JzLmZvckNvbnRhaW5lcixcclxuICAgICAgICAkc2VsZiA9IHRoaXM7XHJcblxyXG4gICAgJGZlZWRiYWNrLmVhY2goZnVuY3Rpb24oa2V5LCBlbG0pIHtcclxuICAgICAgICB2YXIgJGVsbSA9ICQoZWxtKSxcclxuICAgICAgICAgICAgJGlzRm9yID0gJGZlZWRiYWNrLmF0dHIoJGRhdGFGb3JDb250YWluZXIpIHx8IGZhbHNlLFxyXG4gICAgICAgICAgICAkY29udGFpbmVyID0gKCRpc0ZvciA9PT0gZmFsc2UpID8gJHNlbGYuX2dldEluc3RhbmNlcygpIDogJHNlbGYuX2dldEVsZW1lbnRzRnJvbVNlbGVjdG9yKCRpc0Zvcik7XHJcblxyXG4gICAgICAgICQuZWFjaCgkY29udGFpbmVyLCBmdW5jdGlvbigka2V5LCAkaW5zdGFuY2UpIHtcclxuICAgICAgICAgICAgJGVsbS50ZXh0KCRlbG0uYXR0cihcImRhdGEtZmVlZGJhY2tcIikucmVwbGFjZShcIntkZWx0YX1cIiwgJGluc3RhbmNlLmZpbHRlcmVkSXRlbXMubGVuZ3RoKSk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgfSk7XHJcbn07XHJcbiIsbnVsbF19
