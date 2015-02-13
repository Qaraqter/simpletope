/**
* _check: Check if we need to enable or disable the clear div.
* @since 0.1.0
* @param {string} $instance
*/

module.exports = function($instance) {

    var $clearFilter = this.settings.dataSelectors.clearFilter,
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $dataFilter = this.settings.dataSelectors.filter,
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $activeClass = this.settings.defaults.classNames.active,
        $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.clearContainer, function(key, container) {

        container.each(function(idx, elm) {
            var $elm = $(elm),
                $history = $instance.isotope.sortHistory;

            if($instance.isotope.options.filter != $defaultFilter || $history[$history.length - 1] != $defaultSort) {
                $elm.removeClass("hide").show();
            } else {
                $elm.hide();
            }

        });
    });

};
