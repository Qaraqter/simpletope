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
        var $sorters = container.elm.find('['+$dataSortBy+']');

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

                var $sortByValue = '',
                    $sortAsc = false;

                // TODO: I'm ganna leave this code here for now, if we ever need to add multiple support on sorters
                // if($self.filterMultiple) {
                //
                //     $sortByValue = [];
                //
                //     if($dataSortAttr == $defaultSort) {
                //
                //         $sortArray = [];
                //
                //     } else {
                //
                //         if($sortArray.indexOf($dataSortAttr) === -1) {//item not filtered
                //
                //             $sortArray.push($dataSortAttr);
                //
                //         } else {//item already filtered
                //
                //             if($instance.isotope.options.sortAscending !== ($elm.attr($dataSortDirection).toLowerCase() === "asc")) {//Are we changing desc or asc?
                //                 //Do nothing, array will be the same, we're only chanigng sort direction
                //             } else {
                //                 $sortArray.splice($sortArray.indexOf($dataSortAttr), 1); //same item filtered, remove this item from array
                //             }
                //         }
                //
                //     }
                //
                //     if($sortArray.length === 0) {
                //         $sortByValue = $defaultSort;
                //     } else {
                //         $sortByValue = $sortArray;
                //     }
                //
                // } else {
                //     $sortByValue = $dataSortAttr;
                // }

                $sortByValue = $dataSortAttr;

                if($elm.attr($dataSortDirection) !== null && $elm.attr($dataSortDirection) !== undefined) {
                    if($elm.attr($dataSortDirection).toLowerCase() === "asc") {
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

};
