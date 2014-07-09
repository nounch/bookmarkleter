# Bookmarkleter

Bookmarkleter helps you make bookmarklets quickly.

## Features

1. Minify + concatenate
2. Escape HTML entities
3. Insert a proper Bookmarklet link into a HTML file for you to view and
   bookmark in your browser and make the actual minified + escaped code
   available in a separate file.

## Usage

1. Stick all your JavaScript files into the `bookmarklets` directory
   (alternatively any other directory that you can reference, see
   `index.js` for more info).
2. Define the order in which they will be put into the final
   code by altering the aprameter of `bookmarkleter.run(...)` in `inde.js`
   (An example is provided.).
3. Run `node index.js`
4. The output is now in the `out` directory. You have two options:
   - Access the minified + escaped bookmarklet directly:

     `out/bookmarklet.js.min`

     (This is meant to be valid JavaScript code, so it is missing the
     typical `javascript:` prefix of Bookmarklets)
   - Open `out/index.html` in your browser and install it just like any
     other Bookmarklet using the `Bookmarklet` link (right click + bookmark
     or dragging to the Bookmarks bar etc.).

## Notes

1. There are already example files in the `bookmarklets` directory which
   are properly referenced in `index.js` so you can just run
   `node index.js` and see how it all works (hitting the `Bookmarklet` link
   when viewing `out/index.html` in a browser should  i) make the page turn
   red and  ii) make jQuery available on the site.). Simply delete them and
   use your own Bookmarklet code instead.

2. Altering `index.js` manually is of course tedious. If you are annoyed by
   it, feel free to add a proper CLI.
