module.exports = function() {
    var $feedback = $('['+this.settings.dataSelectors.feedback+']'),
        $dataForContainer = this.settings.dataSelectors.forContainer,
        $self = this;

    $feedback.each(function(key, elm) {
        var $elm = $(elm),
            $isFor = $feedback.attr($dataForContainer) || false,
            $container = ($isFor === false) ? $self._getInstances() : $self._getElementsFromSelector($isFor);

        $.each($container, function($key, $instance) {
            $elm.text($elm.attr("data-feedback").replace("{delta}", $instance.filteredItems.length));
        });

    });
};