// This injects a script tag into the head of a page. The script tag
// fetches the jQuery script from a public Google CDN etch node.


(function(){

  // Minimum version of jQuery to use
  var v = '1.3.2';

  // Check prior inclusion and version
  if (window.jQuery === undefined || window.jQuery.fn.jquery < v) {
    var done = false;
    var script = document.createElement('script');
    script.src = 'http://ajax.googleapis.com/ajax/libs/jquery/' + v +
      '/jquery.min.js';
    script.onload = script.onreadystatechange = function(){
      if (!done && (!this.readyState
                    || this.readyState == 'loaded'
                    || this.readyState == 'complete')) {
        done = true;
        initBookmarklet();
      }
    };
    document.getElementsByTagName('head')[0].appendChild(script);
  } else {
    initBookmarklet();
  }

  function initBookmarklet() {
    (window.bookmarklet = function() {

      // Bookmarklet

      var links = [];

      $('*').css('background-color', 'red');

    })();
  }

})();
