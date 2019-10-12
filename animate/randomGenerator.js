"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var randomiser_1 = require("./modules/randomiser");
var serializer_1 = require("./modules/serializer");
var fs = require('fs');
var randomiser = new randomiser_1.Randomiser();
var serialiser = new serializer_1.default();
var circJsonString = fs.readFileSync('randomCircStore.json');
var circs = JSON.parse(circJsonString);
function makeManyRandom() {
    randomiser.make()
        .then(function (circ) {
        var items = serialiser.serialize(circ);
        circs.push(items);
        fs.writeFileSync('randomCircStore.json', JSON.stringify(circs, null, 2));
        makeManyRandom();
    });
}
makeManyRandom();
