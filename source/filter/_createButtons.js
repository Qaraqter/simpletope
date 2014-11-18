/**
* _createButtons and add events to it
* @since 0.1.0
*/

module.exports = function() {

    var $filters = $('['+this.settings.dataSelectors.filter+']'),//Get all filter elements
        $dataFilter = this.settings.dataSelectors.filter,
        $dataForContainer = this.settings.dataSelectors.forContainer,
        $dataType = this.settings.dataSelectors.type,
        $defaultFilter = this.settings.defaults.filter,
        $activeClass = this.settings.defaults.classNames.active,
        $self = this;

    $filters.each(function(idx, elm) {
        elm = $(elm);

        // if(elm.data("filter-set") != "1") {

            var $filterContainer =   elm.closest('['+$dataForContainer+']'), //Get parent with data-for-container
                $multiple =          ($filterContainer.length == 0) ? false : $filterContainer.attr($dataType) || false,
                $container =         ($filterContainer.length == 0) ? $self._getInstances() : $self._getElementsFromSelector($filterContainer.attr($dataForContainer)),
                $dataFilterAttr =    elm.attr($dataFilter),
                filterContainerId =  ($filterContainer.attr("id") || new Date().getTime());

            if($self.instances[$self.guid].filterContainer[filterContainerId] == null) {
                $self.instances[$self.guid].filterContainer[filterContainerId] = $filterContainer;
            }

            elm.on('click', function(e) {
                e.preventDefault();

                var $filterValue = '',
                    active = $self._toggleClass(elm, $filterContainer, $activeClass, $multiple, $dataFilterAttr == $defaultFilter, '['+$dataFilter+'="'+$defaultFilter+'"]');

                var val = $filterValue = $dataFilterAttr;
                $.each($container, function(key, $instance) {

                    if($self.useHash === true) {
                        $self.hash._setHash.call($self, $instance, $filterValue, active);
                    } else {

                        if($multiple) {

                            if($instance.options.filter == "*" || $filterValue == "*") {
                                //Do nothing
                            } else if($instance.options.filter.indexOf($filterValue) === -1) {
                                $filterValue = $instance.options.filter.split(",");
                                $filterValue.push(val);
                                $filterValue = $filterValue.join(",");
                            } else {
                                $filterValue = $instance.options.filter.split(",");
                                $filterValue.splice($filterValue.indexOf(val), 1);
                                $filterValue = $filterValue.join(",");
                            }

                            if($filterValue == "") {
                                $filterValue = "*";
                            }
                        }

                        $instance.arrange({
                            filter: $filterValue
                        });

                        $self._onIsotopeChange.call($self, $instance);
                    }

                });

            });

            // $(elm).data("filter-set", "1");
        // }

    });
};