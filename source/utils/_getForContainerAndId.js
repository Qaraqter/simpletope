/**
* _getForContainerAndId: Get an id or fallback to a parent div
* @since 0.2.2
* @param {object} $elm
* @param {object} timestamp
*/
module.exports = function($elm, timestamp) {
    var forElement, container, forContainer,
        idContainer, parentContainer, idElement;

    // Check if this container is assisnged to a specified isotope instance
    forContainer = $elm.closest('[' + this.settings.dataSelectors.forContainer + ']');
    if( forContainer.length > 0 ) {

        forElement = forContainer.attr(this.settings.dataSelectors.forContainer);
        container = forContainer;

    }

    // Get the closest id
    idContainer = $elm.closest('[id]');
    if( idContainer.length > 0 ) {

        idElement = idContainer.attr('id');
        container = (!container) ? idContainer : container; //If container has not been defined, define it.

    } else {

        var formatted = $($elm.parent()).text().trim().replace(/[^!a-zA-Z0-9]/g, "");
        idElement = (formatted === "") ? timestamp : formatted ;
        container = (!container) ? $elm.parent() : container; //If container has not been defined, define it.

    }

    var filterContainerMultiple = $(container).attr(this.settings.dataSelectors.filterMultiple),
        filterMultiple = ( filterContainerMultiple !== null && filterContainerMultiple !== undefined ),
        filterMethod = filterContainerMultiple || "or";

    return {
        for: forElement || this.guid,
        id: idElement,
        elm: $(container),
        filterMultiple: filterMultiple,
        filterMethod: filterMethod
    };

};
