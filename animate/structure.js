"use strict";
/** Data **/
Object.defineProperty(exports, "__esModule", { value: true });
var EventEmitter = /** @class */ (function () {
    function EventEmitter() {
        this.events = {};
    }
    EventEmitter.prototype.dispatchEvent = function (event) {
        if (typeof this.events[event.getName()] === 'undefined') {
            this.events[event.getName()] = [];
        }
        var compoundEventNameList = event.getName().split('.');
        while (compoundEventNameList.length > 0) {
            var eventName = compoundEventNameList.join('.');
            var callbackArray = this.events[eventName] || [];
            callbackArray
                .forEach(function (callback) {
                callback.apply(void 0, event.getContext());
            });
            compoundEventNameList.splice(-1, 1);
        }
    };
    EventEmitter.prototype.addEventListener = function (eventName, callback) {
        if (typeof this.events[eventName] === 'undefined') {
            this.events[eventName] = [];
        }
        this.events[eventName].push(callback);
    };
    EventEmitter.prototype.addEventListeners = function (eventNames, callback) {
        var _this = this;
        eventNames.forEach(function (name) { return _this.addEventListener(name, callback); });
    };
    return EventEmitter;
}());
exports.EventEmitter = EventEmitter;
/** Load & Run Example **/
// const circPainter = new CirclePainter();
// const guidePainter = new GuidePainter();
// const engine = new Engine();
// const store = new LocalStorage();
// const circ = store.get('circ');
//
// engine.import(circ);
// engine.addCallback(circ => circPainter.draw(circ));
// engine.addCallback(circ => guidePainter.draw(circ));
// engine.run();
