var ejs = require('ejs'),
fs = require('fs'),
path = require('path'),
compressor = require('node-minify');


//#########################################################################
// Notes
//#########################################################################
//
// Approach:
//
// 1. Minify + concatenate
// 2. Escape HTML entities
// 3. Insert minified JavaScript in templates


//#########################################################################
// Bookmarkleter
//#########################################################################


var Bookmarkleter = (function() {
  function Bookmarkleter() {
    var self = this;

    this.outDir = __dirname + '/out';
    this.outFile = this.outDir + '/index.html'

    this.templateDir = __dirname + '/templates'
    this.templateFile = this.templateDir + '/index.html.ejs'
  }

  Bookmarkleter.prototype = new (function() {

    this._escapeHTMLEntities = function(string) {
      // return escape(string).replace(/%(..)/g, "&#$1;");
      return string;
    }

    this._compress = function(files, outFileName) {
      new compressor.minify({
        // buffer: 1000 * 1024 ,  // In case the buffer is too small
        type: 'gcc',
        fileIn: files,
        fileOut: this.outDir + '/' + outFileName + '.min',
        callback: function(error) {
          if (error) {
            throw error;
          }
        }
      });
      // TODO: HTML-escape files

      var files = fs.readdirSync(this.outDir) || [];

      for (var i = 0; i < files.length; ++i) {
        var file = this.outDir + '/' + files[i];
        if (path.extname(file) == '.min') {
          fs.writeFileSync(
            file, this._escapeHTMLEntities(fs.readFileSync(file,
                                                           'utf-8')));
        }
      };

    }

    this._render = function(bookmarklets) {
      var template = fs.readFileSync(this.templateFile, 'utf-8')

      // The template should able to retrieve data by just inspecting the
      // `params' object. This is meant to be a convention.
      fs.writeFileSync(this.outFile, ejs.render(template, {
        params:
        {
          bookmarklet: bookmarklets
        }
      }),
                       'utf-8');
    }

    this.run = function(bookmarklets) {
      var compressedBookmarklets = {};
      var keys = Object.keys(bookmarklets);

      // Compress all bookmarklets
      for (var i = 0; i < keys.length; ++i) {
        this._compress(bookmarklets[keys[i]],
                       path.basename(bookmarklets[keys[i]]))
      }

      // Replace every .js file with the compressed .js.min file. This
      // has to be done since `node-minify' does not allow to retrieve
      // the compressed/minified string directly, but insists on writing
      // it to the disk.
      var files = fs.readdirSync(this.outDir) || [];

      for (var i = 0; i < files.length; ++i) {
        for (var j = 0; j < keys.length; ++j) {
          var fileName = files[i];
          var keyName = keys[j];
          if (fileName.replace(/\.min$/g, '') ==
              path.basename(bookmarklets[keyName])) {
            compressedBookmarklets[keyName] = fileName;
          }
        }
      };

      // Replace the file names by the file contents
      var compressedKeys = Object.keys(compressedBookmarklets);
      for (var i = 0; i < compressedKeys.length; ++i) {
        compressedBookmarklets[compressedKeys[i]] = fs.readFileSync(
          this.outDir + '/' + compressedBookmarklets[compressedKeys[i]],
          'utf-8');
      }

      // Finally render it.
      this._render(compressedBookmarklets);
    }

  })();

  return Bookmarkleter;
})();

//#########################################################################
// Main
//#########################################################################


var bookmarkleter = new Bookmarkleter();

//
// Define the final order of all JavaScript files:
//

//
// Example 1
//
// (This example demonstrates that you can stick your JS code in any
// directory and reference it by prefixing the file name with the directory
// name - here: `static/jquery-1.9.1.js')
//
// bookmarkleter.run({
//   'Red Bookmarklet': ['static/jquery-1.9.1.js', 'bookmarklets/red.js'],
//   'Green Bookmarklet': ['static/jquery-1.9.1.js',
//                      'bookmarklets/green.js'],
// });
//

//
// Example 2
//
bookmarkleter.run({
  'Bookmarklet': ['bookmarklets/bookmarklet.js'],
});

console.log(bookmarkleter.outFile);
