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
        var $filters = container.elm.find('['+$dataFilter+']');

        $filters.each(function(idx, elm) {
            var $elm = $(elm),
                how = {
                    eventName: $elm.prop("tagName").toLowerCase() == "option" ? "change" : "click",
                    element: $elm.prop("tagName").toLowerCase() == "option" ? $elm.closest("select") : $elm
                };

            how.element.on(how.eventName, function(e) {
                e.preventDefault();

                // TODO: Do not return false before setting isotope filters
                if(how.eventName == "change") {
                    if(how.element.find('option:selected')[0] != elm) {
                        return false;
                    }
                }

                var $dataFilterAttr = $elm.attr($dataFilter),
                    $filterValue = $dataFilterAttr,
                    newFilters = $dataFilterAttr,
                    activeFilters, currentFilters;

                if($self.useHash === true) {

                    $self.hash._setHash.call($self, $instance.isotope, $filterValue);

                } else {

                    // Get current active filters from isotope instance
                    activeFilters = $instance.isotope.options.filter;

                    // Check if clicked filter's value is not a wildcard
                    if(activeFilters !== "*" && $filterValue !== "*") {
                        activeFilters = activeFilters.split(",");
                        newFilters = [];

                        //Loop through all active filters
                        $.each(activeFilters, function(index, element) {
                            var setting = $self.allFilters[$self.guid][element];

                            //Check if this container allows multiple filters
                            if(setting.filterMultiple) {
                                newFilters.push(element);

                            //Container only allows one filter
                            } else {

                                //Pass on filters that are not in same container
                                if(container.elm !== setting.elm) {
                                    newFilters.push(element);
                                }
                            }
                        });

                        //Check if this container allows multiple filters
                        if(container.filterMultiple) {

                            //Check if filter is already defined, if so toggle it
                            if( newFilters.indexOf($filterValue) === -1 ) {
                                newFilters.push($filterValue);
                            } else {
                                newFilters.splice(newFilters.indexOf($filterValue), 1);
                            }

                        //Container only allows one filter
                        } else {

                            //Pass on the clicked value
                            newFilters.push($filterValue);
                        }

                        newFilters = newFilters.join(",");

                    }

                    //If filters is empty then reset it all
                    if(newFilters === "") {
                        newFilters = "*";
                    }

                    $instance.isotope.arrange({
                        filter: newFilters
                    });

                    $self._onIsotopeChange.call($self, $instance);
                }

            });

        });

    });
};
