/**!
 * Simple IsoTope with data-attributes v0.1.0
 *
 * @copyright   Qaraqter B.V. 2014
 * @author      Paul de Vries
 * @link        https://www.qaraqter.nl
 *
 * @license	    Non-commercial and commercial use permitted under terms of CC-BY license
 *              http://creativecommons.org/licenses/by/3.0/
 */

(function($){

	/**
	 * simpleIsotope Constructor Function
	 * @constructor
	 * @extends jQuery
	 */
	$.simpleIsotope = function($args){
		var $self = this,
			theHash = $self._getHash();

		$.extend(this, $args);

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

		if(theHash.indexOf("data") !== -1) {
			var active = this.settings.defaults.classNames.active,
				dataFilter = this.settings.dataSelectors.filter;

			//TODO: support multiple classes
			$("["+dataFilter+"=\""+theHash+"\"]").parent().find("."+active).removeClass(active)
			$("["+dataFilter+"=\""+theHash+"\"]").addClass(active);
		}

		if(this.container.data("hash") !== null && this.container.data("hash") !== undefined) {
			this.hash = true;
		}

		//Add hash support
		$(window).on('hashchange', this._onHashChange.bind(this));
	 };

	 $.simpleIsotope.prototype = {
		instances: {},
		constructor: $.simpleIsotope,

		/**
		* _onHashChange: fires when location.hash has been changed
		* @since 0.1.0
		*/
		_onHashChange: function(e) {
			this._setIsotope(this._getHash());
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
		 * _getHash: Get window.location.hash and format it for Isotope
		 * @since 0.1.0
		 */
		_getHash: function() {
			var $hash = window.location.hash || false,
				$newHash;

			$hash = ($hash !== false && $hash != "#" && $hash != "") ? decodeURIComponent(window.location.hash) : '*';

			//Remove hash from first character if its exist
			if ($hash.charAt(0) === '#') {
				$hash = $hash.slice(1);
			}

			//Check if this is a data group
			if($hash.indexOf("=") !== -1) {
				$hash = $hash.split("&");

				for (var i=0; i<$hash.length; i++) {
					var tmp = $hash[i].split("="),
						arr = [];

					if(tmp.length > 1) {
						var name = tmp[0],
							values = tmp[1];
					}

					values = values.split(",");
					for (var i=0; i<values.length; i++) {
						arr.push("[data-"+name+"='"+values[i]+"']");
					}
				}

				$newHash = arr.join("");

			} else {

				$newHash = $hash
					.replace("#", ".")	  //replace "#" with "."
					.replace(/&/g, ", .");  //replace "&" with ", ."

			}

			return $newHash;

		},

		/**
		 * _setHash: Set a new location.hash after formatting it
		 * @since 0.1.0
		 * @param {string} $newHash
		 */
		_setHash: function($newHash) {

			if($newHash.indexOf("data-") !== -1) {//Check if we filter on classes or data attributes
				$newHash = this._formatHash(/\[data\-(.+?)\=\'(.+?)\'\]/g, $newHash)
					.replace(/\'|\"|\[|\]|\{|\}/g, "")
					.replace(/\:/g, "=");

			} else {
				$newHash = $newHash
					.replace(/\'/g, "")
					.replace(/\./g,"")	  //replace "." with nothing
					.replace(/\s/g,"")	  //replace " " with ""
					.replace(/\,/g,"&");	//replace "," with "&"
			}

			if($newHash == "*" || $newHash == "") {
				window.location.hash = "";
			} else {
				window.location.hash = (this.encodeURI) ? encodeURIComponent($newHash) : $newHash;
			}

			return $newHash;
		},

		/**
		* _formatHash: Format multiple filters into a string based on a regular expression
		* @since 0.1.0
		* @param {regex} re
		* @param {string} str
		*/
		_formatHash: function(re, str) {
			var matches = {},
				match;

			while ((match = re.exec(str)) != null) {
				if (match.index === re.lastIndex) {
					re.lastIndex++;
				}

				if(matches[match[1]] == null || matches[match[1]] == undefined) {
					matches[match[1]] = [];
				}

				matches[match[1]].push(match[2]);
			}

			return JSON.stringify(matches);
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
		},

		filter: {
			/**
			* _create
			* @since 0.1.0
			*/
			_create: function() {

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
							var $filterValue = '';

							$self._toggleClass(elm, $filterContainer, $activeClass, $multiple, $dataFilterAttr == $defaultFilter, '['+$dataFilter+'="'+$defaultFilter+'"]');

							if($multiple !== false) {
								$.each($filterContainer.find('.'+$activeClass), function(key, elme) {
									$filterValue += $(elme).attr($dataFilter);
								});
							} else {
								$filterValue = $dataFilterAttr;
							}

							if($self.hash === true) {
								$self._setHash($filterValue);
							} else {
								$.each($container, function(key, $instance) {

									$instance.arrange({
										filter: $filterValue
									});

									$self._onIsotopeChange.call($self, $instance);
								});
							}

						});

						// $(elm).data("filter-set", "1");
					// }

				});
			}
		},
		sorter: {

			/**
			* _createSorters
			* @since 0.1.0
			*/
			_create: function() {
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
			}

		},
		clear: {
			/**
			* _create: Look up for a clear filter and add a click event to it.
			* @since 0.1.0
			*/
			_create: function() {
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

							if($self.hash === true) {
								$self._setHash($defaultFilter);
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
			},

			/**
			* _check: Check if we need to enable or disable the clear div.
			* @since 0.1.0
			* @param {string} $instance
			*/
			_check: function($instance) {
				var $clear = $('['+this.settings.dataSelectors.clearFilter+']'),
					$defaultSort = this.settings.defaults.sort,
					$defaultFilter = this.settings.defaults.filter,
					$dataFilter = this.settings.dataSelectors.filter,
					$dataSortBy = this.settings.dataSelectors.sortBy,
					$activeClass = this.settings.defaults.classNames.active,
					$self = this;

				$clear.each(function(key, elm) {
					var $elm = $(elm);

					if(
						($instance.options.filter != $defaultFilter)
					) {
						$elm.show();
					} else {

						$elm.hide();

						$self.instances[$self.guid].filterContainer.find('.'+$activeClass).removeClass($activeClass);
						$self.instances[$self.guid].filterContainer.find('['+$dataFilter+'="'+$defaultFilter+'"]').addClass($activeClass);

						$self.instances[$self.guid].sortContainer.find('.'+$activeClass).removeClass($activeClass);
						$self.instances[$self.guid].sortContainer.find('['+$dataSortBy+'="'+$defaultSort+'"]').addClass($activeClass);
					}
				});

			},

			/**
			* _check: Check if we need to enable or disable the clear div without an instance
			* @since 0.1.0
			*/
			__check: function() {
				this._onIsotopeChange(this.instances[this.guid].isotope);
			}
		},
		text: {

			_feedback: function() {
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
			}

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

	/**
	 * jQuery .simpleIsotope() method
	 * @since 0.1.0
	 * @extends $.fn
	 */
	$.fn.simpleIsotope = function(){

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
						type: 'data-type'
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
			elm.sorter._create.call(elm);
			elm.filter._create.call(elm);
			elm.clear._create.call(elm);
			elm.text._feedback.call(elm);
			elm.clear.__check.call(elm);
		});

		return instances;

	};

})(jQuery);


$(document).ready(function() {
	$.each($("[data-isotope]"), function(key, elm) {
		$(elm).simpleIsotope();
	})
});
