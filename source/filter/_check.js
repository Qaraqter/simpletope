/**
 * _checkActive: Check if buttons need an active class
 * @since 0.1.0
 * @param {object} $instance
 * @param {string} $dataFilter
 */

module.exports = function($instance, $dataFilter) {

    var $dataFilter = this.settings.dataSelectors.filter,
        $defaultFilter = this.settings.defaults.filter,
        $activeClass = this.settings.defaults.classNames.active;

    $("["+$dataFilter+"]").removeClass($activeClass);

    $.each($instance.options.filter.split(","), function( index, filter ) {
        var active = $("["+$dataFilter+"=\""+filter+"\"]").addClass($activeClass);

        if(active.length > 0) {
            $("["+$dataFilter+"=\""+$defaultFilter+"\"]").removeClass($activeClass);
        }
    });

};
