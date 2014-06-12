var fs = require("fs");

var iso_3166_2 = require("./data/iso_3166_2.js");

var countries = {};

var divisions = {};

for(var key in iso_3166_2) {
  var elem = iso_3166_2[key];
  if(elem.division == "country") {
    countries[elem.code] = elem;
  }
  else if(elem.division != "country") {
    if (typeof divisions[elem.parent] == "undefined") {
      divisions[elem.parent] = {};
    }
    divisions[elem.parent][elem.code] = elem;
  }
}

fs.mkdirSync("divisions");

var countriesString = JSON.stringify(countries, null, 2);
fs.writeFile("countries.json", countriesString);

for(var key in divisions) {
  var elem = divisions[key];
  var divisionsString = JSON.stringify(elem, null, 2);
  console.log(key);
  fs.writeFile("divisions/" + key + ".json", divisionsString);
}

console.log("Done");