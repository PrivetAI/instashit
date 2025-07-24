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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalysisService = void 0;
var common_1 = require("@nestjs/common");
var openai_1 = require("openai");
var logger_1 = require("../../utils/logger");
var prompts_1 = require("./prompts");
var AnalysisService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AnalysisService = _classThis = /** @class */ (function () {
        function AnalysisService_1(config) {
            this.config = config;
            this.logger = new logger_1.AppLogger('AnalysisService');
            this.openai = new openai_1.default({
                apiKey: this.config.get('app.openai.apiKey'),
            });
        }
        AnalysisService_1.prototype.analyzeVideoRelevance = function (description) {
            return __awaiter(this, void 0, void 0, function () {
                var response, content, result, error_1;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.openai.chat.completions.create({
                                    model: this.config.get('app.openai.model'),
                                    messages: [
                                        { role: 'system', content: prompts_1.PROMPTS.RELEVANCE.system },
                                        { role: 'user', content: prompts_1.PROMPTS.RELEVANCE.user(description) },
                                    ],
                                    temperature: 0.3,
                                    max_tokens: 150,
                                })];
                        case 1:
                            response = _a.sent();
                            content = response.choices[0].message.content;
                            result = JSON.parse(content);
                            this.logger.debug("Relevance analysis: ".concat(JSON.stringify(result)));
                            return [2 /*return*/, result];
                        case 2:
                            error_1 = _a.sent();
                            this.logger.error('Failed to analyze relevance', error_1.stack);
                            // Fallback при ошибке
                            return [2 /*return*/, {
                                    relevant: false,
                                    confidence: 0,
                                    reason: 'Analysis failed',
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AnalysisService_1.prototype.analyzeCommentsTone = function (comments) {
            return __awaiter(this, void 0, void 0, function () {
                var recentComments, response, content, result, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            recentComments = comments.slice(-15);
                            return [4 /*yield*/, this.openai.chat.completions.create({
                                    model: this.config.get('app.openai.model'),
                                    messages: [
                                        { role: 'system', content: prompts_1.PROMPTS.TONE.system },
                                        { role: 'user', content: prompts_1.PROMPTS.TONE.user(recentComments) },
                                    ],
                                    temperature: 0.3,
                                    max_tokens: 150,
                                })];
                        case 1:
                            response = _a.sent();
                            content = response.choices[0].message.content;
                            result = JSON.parse(content);
                            this.logger.debug("Tone analysis: ".concat(JSON.stringify(result)));
                            return [2 /*return*/, result];
                        case 2:
                            error_2 = _a.sent();
                            this.logger.error('Failed to analyze tone', error_2.stack);
                            // Fallback
                            return [2 /*return*/, {
                                    tone: 'casual',
                                    confidence: 0.5,
                                    keywords: [],
                                }];
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        AnalysisService_1.prototype.generateComment = function (tone, context) {
            return __awaiter(this, void 0, void 0, function () {
                var response, comment, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.openai.chat.completions.create({
                                    model: this.config.get('app.openai.model'),
                                    messages: [
                                        { role: 'system', content: prompts_1.PROMPTS.GENERATE.system(tone) },
                                        { role: 'user', content: prompts_1.PROMPTS.GENERATE.user(context, tone) },
                                    ],
                                    temperature: 0.7,
                                    max_tokens: 50,
                                })];
                        case 1:
                            response = _a.sent();
                            comment = response.choices[0].message.content.trim();
                            // Убираем кавычки если есть
                            comment = comment.replace(/^["']|["']$/g, '');
                            // Проверяем длину
                            if (comment.length > 100) {
                                comment = comment.substring(0, 97) + '...';
                            }
                            this.logger.debug("Generated comment: \"".concat(comment, "\""));
                            return [2 /*return*/, comment];
                        case 2:
                            error_3 = _a.sent();
                            this.logger.error('Failed to generate comment', error_3.stack);
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        // Дополнительный метод для батчевой обработки
        AnalysisService_1.prototype.analyzeMultipleComments = function (comments) {
            return __awaiter(this, void 0, void 0, function () {
                var results, videoGroups, _i, _a, _b, videoId, videoComments, tone, aiResponse, _c, videoComments_1, comment;
                return __generator(this, function (_d) {
                    switch (_d.label) {
                        case 0:
                            results = [];
                            videoGroups = comments.reduce(function (acc, comment) {
                                if (!acc[comment.videoId]) {
                                    acc[comment.videoId] = [];
                                }
                                acc[comment.videoId].push(comment);
                                return acc;
                            }, {});
                            _i = 0, _a = Object.entries(videoGroups);
                            _d.label = 1;
                        case 1:
                            if (!(_i < _a.length)) return [3 /*break*/, 5];
                            _b = _a[_i], videoId = _b[0], videoComments = _b[1];
                            return [4 /*yield*/, this.analyzeCommentsTone(videoComments.map(function (c) { return c.text; }))];
                        case 2:
                            tone = _d.sent();
                            return [4 /*yield*/, this.generateComment(tone.tone, videoComments[0].text // Используем первый комментарий как контекст
                                )];
                        case 3:
                            aiResponse = _d.sent();
                            // Добавляем результаты
                            for (_c = 0, videoComments_1 = videoComments; _c < videoComments_1.length; _c++) {
                                comment = videoComments_1[_c];
                                results.push({
                                    commentId: comment.id,
                                    videoId: Number(videoId),
                                    relevant: true, // Если дошли до анализа, значит видео релевантно
                                    sentiment: tone.tone,
                                    aiResponse: aiResponse,
                                });
                            }
                            _d.label = 4;
                        case 4:
                            _i++;
                            return [3 /*break*/, 1];
                        case 5: return [2 /*return*/, results];
                    }
                });
            });
        };
        return AnalysisService_1;
    }());
    __setFunctionName(_classThis, "AnalysisService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AnalysisService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AnalysisService = _classThis;
}();
exports.AnalysisService = AnalysisService;
