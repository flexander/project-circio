"use strict";

var _engine = _interopRequireDefault(require("../modules/engine"));

var _painter = _interopRequireDefault(require("../modules/painter"));

var _controls = _interopRequireDefault(require("../modules/controls"));

var _storage = _interopRequireDefault(require("../modules/storage"));

var _blueprints = _interopRequireDefault(require("../modules/blueprints"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var engine = window.engine = new _engine["default"]({
  width: 900,
  height: 900,
  paused: false,
  interval: 1
});
var painter = window.painter = new _painter["default"](engine, {
  canvasArea: document.querySelector('#circio .painter'),
  backgroundFill: "#000000",
  showGuide: true,
  color: '#ffffff'
});
var controls = window.controls = new _controls["default"](engine, painter, {
  'actionLocation': document.querySelector('#circio .controls'),
  'controlLocation': document.querySelector('#circio .controls')
});
var storage = window.storage = new _storage["default"](engine, painter, controls);
var blueprints = window.blueprints = new _blueprints["default"](storage);
controls.showActions().showControls();
engine.addCallback(painter.drawCircles.bind(painter));
engine.run();
blueprints.load('fourCircles');