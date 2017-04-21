# alexa-skill-wochenkarte

The must-have Alexa skill for all hungry employees working at the Munich Media
Works campus in Munich, Germany, e.g. Medienbrücke München
([Google Maps](https://www.google.com/maps/place/Gewerbegebiet+IVG+Businesspark,+Media+Works+Munich/@48.1213651,11.6038356,17)).

Ask Alexa, what's on the lunch menu of nearby restaurants:

_"Alexa, frage Wochenkarte was es diesen Donnerstag in der Alten Raffinerie* zum
Mittagessen gibt."_

<small>* see below for a list of all supported locations</small>

## Supported Locations

* Alte Raffinerie (former Storchenburg), http://www.alte-raffinerie.de/
* Crowns, http://www.crownsrestaurant.de/
* NachtKantine, http://www.nachtkantine.de/
* Alter Wirt in Hohenbrunn, http://www.alterwirt-hohenbrunn.com/

## Skill Features

The skill can read out the lunch menu for a given location and date:

_"Alexa, frage Wochenkarte was es heute in der NachtKantine zu Essen gibt."_

You can also ask into the future:

_"Alexa, frage Wochenkarte was es beim Alten Wirt übermorgen zu Mittag gibt."_

Or colloquial:

_"Alexa, frage Wochenkarte: Was gibt's am Freitag im Crowns?"_

## Development Details

The skill is written in TypeScript and runs as a Lambda function in
[AWS Lambda](https://aws.amazon.com/lambda/). When asked, the skill parses the
online lunch menu and reads out the menus for the given location and date.

All supported locations are listed in a custom slot type called LOCATION (see
`src/speechAssets/customSlotTypes/LOCATION.txt`). Each location also comes with
its own parser based on the `AbstractParser` class, e.g. `ParserAlteRaffinerie`.
Writing your own parser is quite simple and requires the implementation of only
two methods: `parseStartDate`, which parses the start date of the weekly lunch
menu, and `parseDay`, which returns an array of `Menu` objects for a given
`Weekday`.

Have a look into the existing parser classes for a good starting point. Once
done, don't forget to add the new location and its parser to the `locations` map
in `index.ts`. And of course add the location to the LOCATION custom slot type.

Have fun!

## Getting Started

Install with

```
cd src
npm install
```

and build with (in `src`)

```
npm run build
```

To get rid of generated files, run

```
npm run clean
```

## Packaging for AWS Lambda

To create a zip file of the skill to be uploaded to AWS Lambda, run

```
npm run build && npm run package
```

The zip file will be located in `src/target`.

## How to Contribute

Feel free to join and help me improve this skill. Here are a few ideas:

* MORE LOCATIONS!!!
* Proper error handling...
* Integration with the Alexa app (cards)
* Translate it into other languages

## License

This software is distributed under the terms of the
[GNU General Public License v3](https://www.gnu.org/licenses/gpl-3.0.en.html).
