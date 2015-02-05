/**
* _createFilters: create buttons and add events to it
* @since 0.1.0
* @updated 0.2.1
*/

module.exports = function() {
    var $dataFilter = this.settings.dataSelectors.filter,
        $instance = this.instances[this.guid],
        $self = this;

    $.each($instance.filterContainer, function(key, container) {
        var $filters = container.find('['+$dataFilter+']');

        $filters.each(function(idx, elm) {
            var $elm = $(elm),
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

                var $dataFilterAttr = $elm.attr($dataFilter),
                    $filterValue = $dataFilterAttr,
                    val = $dataFilterAttr;

                if($self.useHash === true) {

                    $self.hash._setHash.call($self, $instance.isotope, $filterValue);

                } else {

                    if($self.filterMultiple) {

                        if($instance.isotope.options.filter === "*" || $filterValue === "*") {
                            //Do nothing
                        } else if($instance.isotope.options.filter.indexOf($filterValue) === -1) {
                            $filterValue = $instance.isotope.options.filter.split(",");
                            $filterValue.push(val);
                            $filterValue = $filterValue.join(",");
                        } else {
                            $filterValue = $instance.isotope.options.filter.split(",");
                            $filterValue.splice($filterValue.indexOf(val), 1);
                            $filterValue = $filterValue.join(",");
                        }

                        if($filterValue === "") {
                            $filterValue = "*";
                        }
                    }

                    $instance.isotope.arrange({
                        filter: $filterValue
                    });

                    $self._onIsotopeChange.call($self, $instance);
                }

            });

        });

    });
};
