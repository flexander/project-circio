"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var serializer_1 = require("./serializer");
var LocalStorage = /** @class */ (function () {
    function LocalStorage() {
        this.storeName = 'store.v2';
        this.serializer = new serializer_1.default();
        this.name = 'Browser';
    }
    LocalStorage.prototype.get = function (name) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var circJson = window.localStorage.getItem(_this.storeName + "." + name);
            resolve(_this.serializer.unserialize(circJson));
        });
    };
    LocalStorage.prototype.getIndex = function (index) {
        var _this = this;
        return new Promise(function (resolve, reject) {
            if (typeof index !== 'number') {
                throw 'Provide a valid index';
            }
            _this.list().then(function (circList) {
                var circ = circList[index];
                if (circ === null) {
                    throw 'No data found';
                }
                resolve(circ);
            });
        });
    };
    LocalStorage.prototype.list = function () {
        var _this = this;
        return new Promise(function (resolve, reject) {
            var keys = Object.keys(window.localStorage)
                .filter(function (key) {
                return key.startsWith(_this.storeName);
            })
                .map(function (key) {
                return key.replace(_this.storeName + '.', '');
            });
            var circPromises = keys.map(function (circKey) {
                return _this.get(circKey);
            });
            Promise.all(circPromises).then(function (circs) {
                resolve(circs);
            });
        });
    };
    LocalStorage.prototype.store = function (name, circ) {
        var circJson = this.serializer.serialize(circ);
        window.localStorage.setItem(this.storeName + "." + name, circJson);
    };
    LocalStorage.prototype.delete = function (name) {
        window.localStorage.removeItem(name);
    };
    return LocalStorage;
}());
exports.default = LocalStorage;
