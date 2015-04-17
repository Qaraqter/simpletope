/**
* _checkSort: create buttons and add events to it
* @updated 0.2.4
* @param {object} $filter
*/

module.exports = function($elm) {
    var $self = this,
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $dataSortDirection = this.settings.dataSelectors.sortDirection,
        $defaultSort = this.settings.defaults.sort,
        $sortArray = [],
        $instance = this.instances[this.guid],

        $sortByValue = '',
        $sortAsc = false,
        $dataSortAttr = $elm.attr($dataSortBy);

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

};
