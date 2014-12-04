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
