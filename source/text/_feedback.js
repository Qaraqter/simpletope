module.exports = function(instance) {
    var $instance = instance || this.instances[this.guid],
        $self = this;

    $.each(this.eventElements.feedback, function(idx, elm) {
        var $feedback = $(elm);

        $feedback.each(function(idx, elm) {
            var $elm = $(elm);

            $elm.text($elm.attr("data-feedback").replace("{delta}", $instance.isotope.filteredItems.length));
        });
    });
};
