/* ========================================================================

This script enables creation of timecode links that work with the 
mediaelement HTML5 media player plugin.

Assuming you're already using mediaelement on your web page, and you 
have a media element such as:

<video width="640" height="400" id="player" controls="controls" preload="auto">
  <source src="http://www.example.com/media/video.mp4" type="video/mp4">
</video>

This script will enable timecode links in the following formats:

1) Internal link example (for use on the same page as your video):

   <a href="#" class="timecode-link" data-mediaelement="player" data-seconds="165.30">
     Jump to 0:02:45:30
   </a>

2) External link example:

   http://www.example.come/video-page.html?mediaelement=player&seconds=165.30

To use it, include this script at the bottom of your page, after 
mediaelement.

======================================================================== */


/* === Handle external links with timecode parameters. === */

// Set up blank variables to store timecode link details.
var urlMediaDivId = '';
var urlSeconds    = '';

// Get the query string.
var queryString = $(location).attr('href').split('?')[1];

// If the query string has timecode details:
if ( typeof queryString != 'undefined' && queryString.indexOf('mediaelement=') !== -1 ) {

  // Get an array of query string parameters, and loop through them:
  var parameters = queryString.split('&');
  var pieces = new Array();
  $.each(parameters, function (index, parameter) {
  
    // Set the timecode link details.
    pieces = parameter.split('=');
    if ( pieces[0] == 'mediaelement' )
      urlMediaDivId = pieces[1];
    if ( pieces[0] == 'seconds' )
      urlSeconds = pieces[1];
  });

  // Define the success callback invoked when mediaelement completes setup.
  $('#' + urlMediaDivId).mediaelementplayer({
  
    success: function(player, domObject) {
      
      // Once the video metadata has loaded, set the player to the specified time.
      $(domObject).on('loadedmetadata', function() {
        player.setCurrentTime(urlSeconds);
        
        // Optionally, start playing automatically.
        // player.play();
      });
    }
  });
}


/* === Enable all remaining players on the page. === */

$('audio, video').mediaelementplayer({});


/* === Enable all the internal anchor-style timecode links. === */

// Set up new blank variables for the link parameters.
var anchorMediaDivId = '';
var anchorSeconds    = '';

// Loop through all timecode links on the current page.
$('a.timecode-link').each(function () {

  // Add a handler for clicks on the timecode link.
  $(this).click(function() {
    
    // Get the link's parameters from its data-* attributes.
    anchorMediaDivId = $(this).data('mediaelement');
    anchorSeconds    = $(this).data('seconds');

    // Set the player to the specified time.
    $('#' + anchorMediaDivId)[0].player.setCurrentTime(anchorSeconds);

    // Optionally, start playing automatically.
    // $('#' + anchorMediaDivId)[0].player.play();
    
    // Prevent the browser from handling the click as a regular link.
    return false;
  });
});
