/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function($instance, elm) {

    var $dataFilter = this.settings.dataSelectors.filter,
        $defaultFilter = this.settings.defaults.filter,
        $instance = $instance || this.instances[this.guid],
        $activeClass = this.settings.defaults.classNames.active,

        forContainerFull = this.settings.dataSelectors.forContainer + '="' + this.container.attr("id") + '"';

    $.each($instance.isotope.options.filter.split(","), function( index, filter ) {

        var theFilter = $('[' + forContainerFull + '] [' + $dataFilter + '="' + filter + '"]').exists() || $('[' + $dataFilter + '="' + filter + '"]'),
            allFilters = $('[' + forContainerFull + '] [' + $dataFilter + ']').exists() || $('[' + $dataFilter + ']'),
            defaultFilter =  $('[' + forContainerFull + '] [' + $dataFilter + '="' + $defaultFilter + '"]').exists() || $('[' + $dataFilter + '="' + $defaultFilter + '"]');

        if(theFilter.prop("tagName") && theFilter.prop("tagName").toLowerCase() === "option") {

            theFilter.attr('selected','selected');

        } else {

            if(index === 0) {
                //Remove all active classes first time
                allFilters.removeClass($activeClass);
            }

            //Add active classes
            var active = theFilter.addClass($activeClass);

            if(active.length > 0 && filter != $defaultFilter) {
                defaultFilter.removeClass($activeClass);
            }

        }

        // $.each($instance.filterContainer, function( idx, container ) {
        //     var elm = container.elm.find("["+$dataFilter+"=\""+filter+"\"]");
        //
        //     if(elm.prop("tagName") && elm.prop("tagName").toLowerCase() === "option") {
        //
        //         elm.attr('selected','selected');
        //
        //     } else {
        //
        //         if(index === 0) {
        //             //Remove all active classes first time
        //             container.elm.find("["+$dataFilter+"]").removeClass($activeClass);
        //         }
        //
        //         //Add active classes
        //         var active = elm.addClass($activeClass);
        //
        //         if(active.length > 0 && filter != $defaultFilter) {
        //             container.elm.find("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
        //         }
        //
        //     }
        // });

    });

};
