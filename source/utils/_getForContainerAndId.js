/**
* _getForContainerAndId: Get an id or fallback to a parent div
* @since 0.2.2
* @param {object} $elm
* @param {object} timestamp
*/
module.exports = function($elm, timestamp) {
    var forElement = false,
        container = false,
        forContainer, idContainer, parentContainer, idElement;

    //Check if this container is assisnged to a specified isotope instance
    forContainer = $elm.closest('[data-for-container]');
    if( forContainer.length > 0 ) {

        forElement = forContainer.attr('data-for-container');
        container = forContainer;

    }

    //Get the closest id
    idContainer = $elm.closest('[id]');
    if( idContainer.length > 0 ) {

        idElement = idContainer.attr('id');
        container = (!container) ? idContainer : container;//If container has not been defined, define it.

    } else {

        var formatted = $($elm.parent()).text().trim().replace(/[^!a-zA-Z0-9]/g, "");
        idElement = (formatted === "") ? timestamp : formatted ;
        container = (!container) ? $elm.parent() : container;//If container has not been defined, define it.
    }

    return {
        for: forElement,
        id: idElement,
        container: container
    };

};
