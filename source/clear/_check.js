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

            $self.instances[$self.guid].filterContainer.find('.'+$activeClass).removeClass($activeClass);
            $self.instances[$self.guid].filterContainer.find('['+$dataFilter+'="'+$defaultFilter+'"]').addClass($activeClass);

            $self.instances[$self.guid].sortContainer.find('.'+$activeClass).removeClass($activeClass);
            $self.instances[$self.guid].sortContainer.find('['+$dataSortBy+'="'+$defaultSort+'"]').addClass($activeClass);

        }
    });

}
