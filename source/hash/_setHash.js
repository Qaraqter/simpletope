/**
 * _setHash: Set a new location.hash after formatting it
 * @since 0.1.0
 * @param {object} $instance
 * @param {string} $newHash
 * @param {boolean} $active
 */

module.exports = function($instance, $newHash, $active) {
    var $currentHash = ($instance.options.filter == "*") ? "" : $instance.options.filter,
        $combinedHash;

    if($newHash != "*") {

        if($currentHash.indexOf($newHash) === -1) {
            $combinedHash = $currentHash + $newHash;
        } else {
            $combinedHash = $currentHash.replace($newHash, "");
        }

        var $formattedHash = this.hash._formatHash(/\[data\-(.+?)\=\'(.+?)\'\]|(.[A-Za-z0-9]+)/g, $combinedHash),
            $endHash = [];

        $.each($formattedHash, function(key, elm) {
            if(elm === true) {//isClass
                $endHash.push(key);
            } else {//isObject
                $endHash.push(key + "=" + elm.join(","));
            }
        });

        $endHash = $endHash.join("&");
    } else {
        $endHash = $newHash;
    }

    // if($combinedHash.indexOf("data-") !== -1) {//Check if we filter on classes or data attributes
    //     var $formattedHash = this.hash._formatHash(/\[data\-(.+?)\=\'(.+?)\'\]/g, $combinedHash);
    //         // .replace(/\'|\"|\[|\]|\{|\}/g, "");
    //         // .replace(/\:/g, "=");
    //
    //     $combinedHash = "";
    //     console.log($formattedHash);
    //     $formattedHash.each(function(key, $elm) {
    //         $elm = $(elm);
    //
    //         $combinedHash
    //     });
    //
    // } else {
    //     $combinedHash = $combinedHash
    //         .replace(/\'/g, "")
    //         .replace(/\./g,"")	  //replace "." with nothing
    //         .replace(/\s/g,"")	  //replace " " with ""
    //         .replace(/\,/g,"&");	//replace "," with "&"
    // }

    if($endHash == "*" || $endHash == "") {
        window.location.hash = "";
    } else {
        window.location.hash = (this.encodeURI === true) ? encodeURIComponent($endHash) : $endHash;
    }

    return $endHash;
};
