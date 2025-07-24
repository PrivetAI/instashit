"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.randomDelay = exports.delay = void 0;
var delay = function (ms) {
    return new Promise(function (resolve) { return setTimeout(resolve, ms); });
};
exports.delay = delay;
var randomDelay = function (min, max) {
    var ms = Math.floor(Math.random() * (max - min + 1)) + min;
    return (0, exports.delay)(ms);
};
exports.randomDelay = randomDelay;
