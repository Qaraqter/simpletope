/**
* _setContainers: Set the filters/sorters/clear containers to the right Isotope container
* @since 0.1.0
* @param {object} $instance
*/

module.exports = function($instance) {
    var $self = this,
        sh = $self.instances[$self.guid],
        timestamp = new Date().getTime();

    $.each($('[data-filter], [data-sort-by], [data-clear-filter], [data-feedback]'), function(ind, elm) {
        var $elm = $(elm),
            filterContainer = $self.utils._getForContainerAndId.call($self, $elm, timestamp);

        if( $self.guid === filterContainer.for || filterContainer.for === false) {
            if( $elm.attr('data-filter') !== undefined ) {
                sh.filterContainer[filterContainer.id] = $(filterContainer.container);
            } else if ( $elm.attr('data-sort-by') !== undefined ) {
                sh.sortContainer[filterContainer.id] = $(filterContainer.container);
            } else if ( $elm.attr('data-clear-filter') !== undefined ) {
                sh.clearContainer[filterContainer.id] = $(filterContainer.container);
            } else if ( $elm.attr('data-feedback') !== undefined ) {
                sh.feedbackContainer[filterContainer.id] = $(filterContainer.container);
            }
        }
    });
};
