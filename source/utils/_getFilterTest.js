module.exports = function(filter) {
    var guid = this.guid,
        allFilters = this.allFilters[guid];

    return function( item ) {

        var filters = filter.split(","),
            active = [],
            container = [];

        for (var i = 0, len = filters.length; i < len; i++) {

            //Enable filtering with data-attributes
            if(filters[i].indexOf("data-") !== -1) {

                var cat = filters[i].replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$1").trim(),
                    value = filters[i].replace(/\[data\-(.+?)\=\'(.+?)\'\]/g, "$2").trim();

                if(jQuery( item.element ).data( cat ) !== undefined && jQuery( item.element ).data( cat ) !== null) {
                    if( jQuery( item.element ).data( cat ).indexOf( value ) !== -1 ) {
                        active.push(value);
                    }
                }

            } else {

                //Default filtering
                if( jQuery( item.element ).is( filters[i] ) ) {
                    active.push(filters[i]);
                }

            }

        }

        var filterMethod;
        if(filters.indexOf("*") === -1) {

            $.each(filters, function(idx, elm) {
                if(allFilters[elm].filterMethod === "or") {
                    filterMethod = "or";
                } else {
                    filterMethod = "and";
                }
            });

        } else {
            return true;
        }

        if(filterMethod == "or") {
            return active.length > 0;
        } else {
            return active.length == filters.length;
        }

    };

};
