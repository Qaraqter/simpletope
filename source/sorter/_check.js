/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 */

module.exports = function($instance) {

    var $dataSort = this.settings.dataSelectors.sortBy,
        $defaultSort = this.settings.defaults.sort,
        $instance = $instance || this.instances[this.guid],
        $activeClass = this.settings.defaults.classNames.active,
        $sortHistory = $instance.isotope.sortHistory,
        $sortAscending = $instance.isotope.options.sortAscending;

    $.each($instance.sortContainer, function( idx, container ) {
        var elm = container.elm.find("["+$dataSort+"]"),
            sortDirection = "desc";

        if($sortAscending) {
            sortDirection = "asc";
        }

        if(elm.prop("tagName") && elm.prop("tagName").toLowerCase() === "option") {

            // elm.prop('selected', false);
            // var active = container.elm.find('['+$dataSort+'="'+ $sortHistory[0] +'"][data-sort-direction="' + sortDirection + '"]').prop('selected', 'selected');
            //
            // console.log(active);

        } else {


            //Remove all active classes first time
            elm.removeClass($activeClass);

            //Add active classes
            var active = container.elm.find('['+$dataSort+'="'+ $sortHistory[0] +'"][data-sort-direction="' + sortDirection + '"]').addClass($activeClass);

            if(active.length > 0 && $sortHistory[0] != $defaultSort) {
                container.elm.find("["+$dataSort+"=\""+$defaultSort+"\"]").removeClass($activeClass);
            } else {
                container.elm.find("["+$dataSort+"=\""+$defaultSort+"\"]").addClass($activeClass);
            }
        }

    });

};
