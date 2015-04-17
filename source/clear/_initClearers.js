module.exports = function(instance, elements) {
    var $clearFilter = this.settings.dataSelectors.clearFilter,
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $instance = this.instances[this.guid],
        $self = this;

    $.each(elements, function(idx, elm) {
        var $elm = $(elm);

        $elm.hide().removeClass("hide").on('click', function(e) {
            e.preventDefault();

            if($self.useHash === true) {
                $self.hash._setHash.call($self, $instance.isotope, $defaultFilter);
            } else {
                $instance.isotope.arrange({
                    filter: $defaultFilter
                    // sortBy: $defaultSort
                });

                $self._onIsotopeChange.call($self, $instance);
            }

            $elm.hide();
        });
    });
};
