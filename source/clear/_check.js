/**
* _check: Check if we need to enable or disable the clear div.
* @since 0.1.0
* @param {string} $instance
*/

module.exports = function($instance) {
    var $clear = $('['+this.settings.dataSelectors.clearFilter+']'),
        $defaultSort = this.settings.defaults.sort,
        $defaultFilter = this.settings.defaults.filter,
        $dataFilter = this.settings.dataSelectors.filter,
        $dataSortBy = this.settings.dataSelectors.sortBy,
        $activeClass = this.settings.defaults.classNames.active,
        $self = this;

    $clear.each(function(key, elm) {
        var $elm = $(elm);

        if($instance.options.filter != $defaultFilter) {

            $elm.show();

        } else {

            $elm.hide();

            var fn = function(idx, elm) {
                elm.find('.'+$activeClass).removeClass($activeClass);
                elm.find('['+$dataFilter+'="'+$defaultFilter+'"]').addClass($activeClass);
                elm.find('['+$dataSortBy+'="'+$defaultSort+'"]').addClass($activeClass);
            };

            $.each($self.instances[$self.guid].filterContainer, fn);
            $.each($self.instances[$self.guid].sortContainer, fn);

        }
    });

}
