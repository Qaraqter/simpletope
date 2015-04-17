/**
* _checkFilters: create buttons and add events to it
* @updated 0.2.4
* @param {object} $filter
*/

module.exports = function($elm) {
    var $self = this,
        $dataFilter = this.settings.dataSelectors.filter,
        $dataChain = this.settings.dataSelectors.filterChain,
        $instance = this.instances[this.guid],

        $dataChainAttr = $elm.closest('[' + $dataChain + ']'),
        $dataFilterAttr = $elm.attr($dataFilter),

        newFilters = $dataFilterAttr,
        $filterValue = $dataFilterAttr,

        chainGroupName = $instance.isotope.isGrouped || "*",

        activeFilters, currentFilters;

    if(this.useHash === true) {

        this.hash._setHash.call(this, $instance.isotope, $filterValue);

    } else {

        // Get current active filters from isotope instance
        activeFilters = $instance.isotope.options.filter;

        // Check if clicked filter's value is not a wildcard
        if(activeFilters !== "*" && $filterValue !== "*") {
            activeFilters = activeFilters.split(",");
            newFilters = [];

            //Loop through all active filters
            $.each(activeFilters, function(index, element) {

                //Check if this container allows multiple filters
                if($instance.isotope.isMultiple) {

                    newFilters.push(element);

                } else {//Container only allows one filter

                    var container = $elm.closest('ul');//Check if parent has an UL
                        container = (container.length === 0) ? $elm.closest('select') : container;//Check if select
                        container = (container.length === 0) ? $elm.parent() : container;//Check if select

                    //Pass on filters that are not in same container
                    if( container.find('[' + $dataFilter + '="' + element + '"]').length === 0 || element === $filterValue ) {
                        newFilters.push(element);
                    }
                }
            });

            if( newFilters.indexOf($filterValue) === -1 ) {
                newFilters.push($filterValue);
            } else {
                newFilters.splice(newFilters.indexOf($filterValue), 1);
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

        this._onIsotopeChange.call(this, $instance);
    }

};
