var fs = require("fs");

var deleteFolderRecursive = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.lstatSync(curPath).isDirectory()) { // recurse
                deleteFolderRecursive(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

eval(fs.readFileSync('./iso-3166-2/iso_3166_2.js', 'utf8'));

var countries = {};
var divisions = {};

for(var key in iso_3166_2) {
  var elem = iso_3166_2[key];
  switch(elem.division) {
    case "country":
      countries[elem.code] = elem;
      break;
    case "planet":
      break;
    case "continent":
      break;
    default:
      if (typeof divisions[elem.parent] == "undefined") {
        divisions[elem.parent] = {};
      }
      divisions[elem.parent][elem.code] = elem;
  }
}

deleteFolderRecursive("data");

fs.mkdir("data", function () {
  var countriesString = JSON.stringify(countries, null, 2);
  fs.writeFile("data/countries.json", countriesString);

  fs.mkdir("data/divisions", function() {
    for(var key in divisions) {
      var elem = divisions[key];
      var divisionsString = JSON.stringify(elem, null, 2);
      console.log(key);
      fs.writeFile("data/divisions/" + key + ".json", divisionsString);
    }

    console.log("Done");
  });
});