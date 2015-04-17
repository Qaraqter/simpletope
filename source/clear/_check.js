/**
* _check: Check if we need to enable or disable the clear div.
* @since 0.1.0
* @param {string} $instance
*/

module.exports = function(instance) {

    var $clearFilter = this.settings.dataSelectors.clearFilter,
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $dataFilter = this.settings.dataSelectors.filter,
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $activeClass = this.settings.defaults.classNames.active,
        $instance = instance || this.instances[this.guid],
        $history = $instance.isotope.sortHistory,

        forContainerFull = this.settings.dataSelectors.forContainer + '="' + this.container.attr("id") + '"',

        theClearer = $('[' + forContainerFull + '][' + $clearFilter + ']').exists() || $('[' + $clearFilter + ']'),

        $elm = $(theClearer);


    if($instance.isotope.options.filter != $defaultFilter || $history[$history.length - 1] != $defaultSort) {
        $elm.removeClass("hide").show();
    } else {
        $elm.hide();
    }

};
