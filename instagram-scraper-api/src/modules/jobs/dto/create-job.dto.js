"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateJobDto = void 0;
// create-job.dto.ts
var class_validator_1 = require("class-validator");
var CreateJobDto = function () {
    var _a;
    var _query_decorators;
    var _query_initializers = [];
    var _query_extraInitializers = [];
    var _queryType_decorators;
    var _queryType_initializers = [];
    var _queryType_extraInitializers = [];
    var _videoLimit_decorators;
    var _videoLimit_initializers = [];
    var _videoLimit_extraInitializers = [];
    var _commentLimit_decorators;
    var _commentLimit_initializers = [];
    var _commentLimit_extraInitializers = [];
    return _a = /** @class */ (function () {
            function CreateJobDto() {
                this.query = __runInitializers(this, _query_initializers, void 0);
                this.queryType = (__runInitializers(this, _query_extraInitializers), __runInitializers(this, _queryType_initializers, void 0));
                this.videoLimit = (__runInitializers(this, _queryType_extraInitializers), __runInitializers(this, _videoLimit_initializers, 10));
                this.commentLimit = (__runInitializers(this, _videoLimit_extraInitializers), __runInitializers(this, _commentLimit_initializers, 10));
                __runInitializers(this, _commentLimit_extraInitializers);
            }
            return CreateJobDto;
        }()),
        (function () {
            var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
            _query_decorators = [(0, class_validator_1.IsString)()];
            _queryType_decorators = [(0, class_validator_1.IsEnum)(['hashtag', 'keyword'])];
            _videoLimit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(50)];
            _commentLimit_decorators = [(0, class_validator_1.IsNumber)(), (0, class_validator_1.Min)(1), (0, class_validator_1.Max)(20)];
            __esDecorate(null, null, _query_decorators, { kind: "field", name: "query", static: false, private: false, access: { has: function (obj) { return "query" in obj; }, get: function (obj) { return obj.query; }, set: function (obj, value) { obj.query = value; } }, metadata: _metadata }, _query_initializers, _query_extraInitializers);
            __esDecorate(null, null, _queryType_decorators, { kind: "field", name: "queryType", static: false, private: false, access: { has: function (obj) { return "queryType" in obj; }, get: function (obj) { return obj.queryType; }, set: function (obj, value) { obj.queryType = value; } }, metadata: _metadata }, _queryType_initializers, _queryType_extraInitializers);
            __esDecorate(null, null, _videoLimit_decorators, { kind: "field", name: "videoLimit", static: false, private: false, access: { has: function (obj) { return "videoLimit" in obj; }, get: function (obj) { return obj.videoLimit; }, set: function (obj, value) { obj.videoLimit = value; } }, metadata: _metadata }, _videoLimit_initializers, _videoLimit_extraInitializers);
            __esDecorate(null, null, _commentLimit_decorators, { kind: "field", name: "commentLimit", static: false, private: false, access: { has: function (obj) { return "commentLimit" in obj; }, get: function (obj) { return obj.commentLimit; }, set: function (obj, value) { obj.commentLimit = value; } }, metadata: _metadata }, _commentLimit_initializers, _commentLimit_extraInitializers);
            if (_metadata) Object.defineProperty(_a, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        })(),
        _a;
}();
exports.CreateJobDto = CreateJobDto;
