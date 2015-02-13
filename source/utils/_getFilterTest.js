module.exports = function(filter) {
    var $self = this;

    return function( item ) {

        var filters = filter.split(","),
            active = [];

        for (var i = 0, len = filters.length; i < len; i++) {

            if(filters[i].indexOf("data-") !== -1) {

                var cat = filters[i].replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$1").trim();
                var value = filters[i].replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$2").trim();

                if(jQuery( item.element ).data( cat ) !== undefined && jQuery( item.element ).data( cat ) !== null) {
                    if( jQuery( item.element ).data( cat ).indexOf( value ) !== -1 ) {
                        active.push(value);
                    }
                }

            } else {

                if( jQuery( item.element ).is( filters[i] ) ) {
                    active.push(filters[i]);
                }

            }

        }

        if($self.filterMethod == "or") {
            return active.length > 0;
        } else {
            return active.length == filters.length;
        }

    };

};
