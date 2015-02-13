/**
* _getElementFromDataAttribute
* @since 0.1.0
* @update 0.2.1
*/
module.exports = function(selector) {
    var $tmp;

    if(selector === "" || selector === false || selector === undefined) {
        return false;
    }

    if(selector instanceof jQuery) {
        return selector;
    }

    if(selector.charAt(0) === "#" || selector.charAt(0) === ".") {				//this looks like a valid CSS selector
        $tmp = $(selector);
    } else if(selector.indexOf("#") !== -1 || selector.indexOf(".") !== -1) {	//this looks like a valid CSS selector
        $tmp = $(selector);
    } else if(selector.indexOf(" ") !== -1) {									//this looks like a valid CSS selector
        $tmp = $(selector);
    } else {																	//evulate the string as an id
        $tmp = $("#" + selector);
    }

    if($tmp.length === 0) {
        // throw new Error("simpletope: We cannot find any DOM element with the CSS selector: '" + selector + "'");
        return false;
    } else {
        return $tmp;
    }
};
