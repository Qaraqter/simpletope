/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function(instance) {

    var $dataSort = this.settings.dataSelectors.sortBy,
        $defaultSort = this.settings.defaults.sort,
        $instance = instance || this.instances[this.guid],
        $activeClass = this.settings.defaults.classNames.active,
        $sortHistory = $instance.isotope.sortHistory,
        $sortAscending = $instance.isotope.options.sortAscending,

        forContainerFull = this.settings.dataSelectors.forContainer + '="' + this.container.attr("id") + '"',
        sortDirection = "desc";

    if($sortAscending) {
        sortDirection = "asc";
    }

    var theSorter = $('[' + forContainerFull + '] [' + $dataSort + '="' + $sortHistory[0] + '"][data-sort-direction="' + sortDirection + '"]').exists() || $('[' + $dataSort + '="' + $sortHistory[0] + '"][data-sort-direction="' + sortDirection + '"]'),
        allSorters = $('[' + forContainerFull + '] [' + $dataSort + ']').exists() || $('[' + $dataSort + ']'),
        defaultSorter =  $('[' + forContainerFull + '] [' + $dataSort + '="' + $defaultSort + '"]').exists() || $('[' + $dataSort + '="' + $defaultSort + '"]');

    if(theSorter.prop("tagName") && theSorter.prop("tagName").toLowerCase() === "option") {

    } else {

        //Remove all active classes first time
        allSorters.removeClass($activeClass);

        //Add active classes
        var active = theSorter.addClass($activeClass);

        if(active.length > 0 && $sortHistory[0] != $defaultSort) {
            defaultSorter.removeClass($activeClass);
        } else {
            defaultSorter.addClass($activeClass);
        }
    }

};
