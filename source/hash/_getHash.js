/**
 * _getHash: Get window.location.hash and format it for Isotope
 * @since 0.1.0
 */

 module.exports = function() {
    var $hash = window.location.hash || false,
        $newHash = "",
        $self = this;

    $hash = ($hash !== false && $hash != "#" && $hash != "") ? decodeURIComponent(window.location.hash) : '*';

    //Remove hash from first character if its exist
    if ($hash.charAt(0) === '#') {
         $hash = $hash.slice(1);
    }

    $.each($hash.split("&"), function(key, $partHash) {

        if($partHash.indexOf("=") !== -1) {

            var tmp = $partHash.split("="),
                arr = [];

            if(tmp.length > 1) {
                var name = tmp[0],
                    values = tmp[1].replace(/\'/g, "");
            }

            values = values.split(",");
            for (var i=0; i<values.length; i++) {
                arr.push("[data-" + name + "='" + values[i] + "']");

                $("[data-filter=\"[data-" + name + "='" + values[i] + "']\"]").addClass($self.settings.defaults.classNames.active);
            }

            $newHash += arr.join(",");

        } else {
            $newHash += $partHash
                .replace("#", ".")	  //replace "#" with "."
                .replace(/&/g, ", .");  //replace "&" with ", ."
        }

    });

    //  //Check if this is a data group
    //  if($hash.indexOf("=") !== -1) {
    //      $hash = $hash.split("&");
     //
    //      for (var i=0; i<$hash.length; i++) {
    //          var tmp = $hash[i].split("="),
    //              arr = [];
     //
    //          if(tmp.length > 1) {
    //              var name = tmp[0],
    //                  values = tmp[1];
    //          }
     //
    //          values = values.split(",");
    //          for (var i=0; i<values.length; i++) {
    //
    //              arr.push("[data-"+name+"='"+values[i]+"']");
    //          }
    //         //  console.log(arr);
    //      }
     //
    //      $newHash = arr.join("");
     //
    //  } else {
     //
    //      $newHash = $hash
    //          .replace("#", ".")	  //replace "#" with "."
    //          .replace(/&/g, ", .");  //replace "&" with ", ."
     //
    //  }

     return $newHash;

 };
