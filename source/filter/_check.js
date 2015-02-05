/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function($instance) {

    var $dataFilter = this.settings.dataSelectors.filter,
        $defaultFilter = this.settings.defaults.filter,
        $instance = $instance || this.instances[this.guid],
        $activeClass = this.settings.defaults.classNames.active;

    $.each($instance.isotope.options.filter.split(","), function( index, filter ) {

        $.each($instance.filterContainer, function( idx, container ) {

            if(container.prop("tagName").toLowerCase() === "select") {

                container.find("["+$dataFilter+"=\""+filter+"\"]").attr('selected','selected');

            } else {

                if(index === 0) {
                    //Remove all active classes first time
                    container.find("["+$dataFilter+"]").removeClass($activeClass);
                }

                //Add active classes
                var active = container.find("["+$dataFilter+"=\""+filter+"\"]").addClass($activeClass);

                if(active.length > 0 && filter != $defaultFilter) {
                    container.find("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
                }

            }
        });

    });

};
