"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var randomiser_1 = require("./modules/randomiser");
var serializer_1 = require("./modules/serializer");
var fs = require("fs");
var outputFile = process.argv[2];
if (outputFile == null) {
    console.error('A file path must be specified');
    process.exit(1);
}
var randomiser = new randomiser_1.Randomiser();
var serialiser = new serializer_1.default();
var circJsonString = fs.readFileSync(outputFile);
var circs = JSON.parse(circJsonString.toString());
function makeManyRandom() {
    randomiser.make()
        .then(function (circ) {
        var items = serialiser.serialize(circ);
        circs.push(items);
        fs.writeFileSync(outputFile, JSON.stringify(circs, null, 2));
        makeManyRandom();
    });
}
makeManyRandom();
