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
