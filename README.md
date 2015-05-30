Pokemon Demo Site
=================

## Setup

This will install the necessary node modules to run the application

```
npm i
```

## Generate Pokemon Static HTML from pokedex.json

type:

```
npm run build
```
Running the `build` command will run `npm run clean` as well as `npm run generate`


```
npm run watch
```
Watches all templates in `/templates/*.dust` and `/data/pokedex.json` for changes, internally calls `npm run clean && npm run build`


You should run the generate command before running the start command

## Server

To run the local server type:
```
npm run start
```

This will start the http-server locally, serving your page to http://localhost:8080

## Code

All of the HTML, CSS and JS is located in `public`.

The CSS is in `public/styles`.

The JS is in `public/scripts`.

The HTML is at `public/index.html` and `public/pokemon/*.html`

For help with the Jade Template language goto:  http://jade-lang.com/reference/

For help with Bootstrap goto:  http://getbootstrap.com/css/

## ROADMAP
* use AJAX and (needs node library conversion) http://pokeapi.co/
