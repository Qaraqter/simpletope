module.exports = function() {
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

                if($self.useHash === true) {
                    $self.hash._setHash.call($self, $instance, $defaultFilter);
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
};
