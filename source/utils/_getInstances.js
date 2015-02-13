/**
* _getInstances
* @since 0.1.0
*/
module.exports =  function() {
    var tmp = [];

    $.each(this.instances, function(key, elm) {
        tmp.push(elm.isotope);
    });

    return tmp;
};
