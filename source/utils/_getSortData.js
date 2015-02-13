/**
 * _getSortData: Get the data-sort-by attributes and make them into an Isotope "getSortData" object
 * @since 0.1.0
 */
module.exports =  function() {
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
};
