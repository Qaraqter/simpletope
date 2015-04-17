/**
* _attach: Attach click events to filters, sorters, feedback, clear
* @since 0.2.4
* @param {object} $instance
*/

module.exports = function($instance) {
    var $self = this,
        instance = $self.instances[$self.guid],
        timestamp = new Date().getTime(),

        forContainerFull = $self.settings.dataSelectors.forContainer + '="' + this.container.attr("id") + '"',

        clicked = function(e) {
            e.preventDefault();

            var $elm = $(e.delegateTarget);

            // If element is SELECT, get selected
            if(e.type == "change") {
                $elm = $elm.find('option:selected');
            }

            if( $elm.is('[' + $self.settings.dataSelectors.filter + ']') ) {

                $self.filter._initFilters.call($self, $elm);

            } else if( $elm.is('[' + $self.settings.dataSelectors.sortBy + ']') ) {

                $self.sorter._initSorters.call($self, $elm);

            }
        };

    // Lets first check if anything is tied to an instance
    this.eventElements = {
        filters: $('[' + forContainerFull + '] [' + $self.settings.dataSelectors.filter + ']').exists() || $('[' + $self.settings.dataSelectors.filter + ']'),
        sorters: $('[' + forContainerFull + '] [' + $self.settings.dataSelectors.sortBy + ']').exists() || $('[' + $self.settings.dataSelectors.sortBy + ']'),
        clear: $('[' + forContainerFull + '][' + $self.settings.dataSelectors.clearFilter + ']').exists() || $('[' + $self.settings.dataSelectors.clearFilter + ']'),
        feedback: $('[' + forContainerFull + '] [' + $self.settings.dataSelectors.feedback + ']').exists() || $('[' + $self.settings.dataSelectors.feedback + ']'),

        all: {}
    };

    // Combine results to one jQuery object
    this.eventElements.all = this.eventElements.filters.add(this.eventElements.sorters);

    // Add the events
    this.eventElements.all.off('click').on('click', clicked);
    this.eventElements.all.parent('select').off('change').on('change', clicked);

};
