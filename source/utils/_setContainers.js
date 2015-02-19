/**
* _setContainers: Set the filters/sorters/clear containers to the right Isotope container
* @since 0.1.0
* @updated 0.2.2
* @param {object} $instance
*/

module.exports = function($instance) {
    var $self = this,
        sh = $self.instances[$self.guid],
        timestamp = new Date().getTime();

    $('[data-filter]:first-child').each(eachItem.bind({ dataType: 'data-filter' }));
    $('[data-sort-by]:first-child').each(eachItem.bind({ dataType: 'data-sort-by' }));
    $('[data-clear-filter]').each(eachItem.bind({ dataType: 'data-clear-filter' }));
    $('[data-feedback]').each(eachItem.bind({ dataType: 'data-feedback' }));

    function eachItem(ind, elm) {
        var $elm = $(elm),
            dataType = this.dataType,
            filterContainer = $self.utils._getForContainerAndId.call($self, $elm, timestamp);

        if( $self.guid === filterContainer.isFor || filterContainer.isFor === false) {
            if( dataType === "data-filter" ) {
                sh.filterContainer[filterContainer.id] = filterContainer;
            } else if( dataType === "data-sort-by" ) {
                sh.sortContainer[filterContainer.id] = filterContainer;
            } else if( dataType === "data-clear-filter" ) {
                sh.clearContainer[filterContainer.id] = filterContainer;
            } else if( dataType === "data-feedback" ) {
                sh.feedbackContainer[filterContainer.id] = filterContainer;
            }
        }

        if( dataType === "data-filter" || dataType === "data-sort-by" ) {
            var filters = filterContainer.elm.find('['+dataType+']');

            filters.each(function(index, filter) {
                if($self.guid === filterContainer.isFor) {
                    if( $(filter).attr(dataType) !== "*" ) { //TODO: how to handle wildcard?
                        if( dataType === "data-filter" ) {
                            $self.allFilters[filterContainer.isFor][$(filter).attr(dataType)] = sh.filterContainer[filterContainer.id];
                        } else if( dataType === "data-sort-by" ) {
                            $self.allSorters[filterContainer.isFor][$(filter).attr(dataType)] = sh.sortContainer[filterContainer.id];
                        }
                    }
                }
            });
        }
    }
};
