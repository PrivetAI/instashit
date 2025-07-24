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
exports.JobsService = void 0;
var common_1 = require("@nestjs/common");
var delay_1 = require("../utils/delay");
var JobsService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var JobsService = _classThis = /** @class */ (function () {
        function JobsService_1(prisma, scraper, analysis, wsGateway) {
            this.prisma = prisma;
            this.scraper = scraper;
            this.analysis = analysis;
            this.wsGateway = wsGateway;
        }
        JobsService_1.prototype.createJob = function (data) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    return [2 /*return*/, this.prisma.job.create({
                            data: {
                                query: data.query,
                                queryType: data.queryType,
                                videoLimit: data.videoLimit,
                                commentLimit: data.commentLimit
                            }
                        })];
                });
            });
        };
        JobsService_1.prototype.runJob = function (jobId) {
            return __awaiter(this, void 0, void 0, function () {
                var job, session, reels, i, currentJob, reel, existingVideo, details, video, isRelevant, lastComments, _i, lastComments_1, comment, tone, generatedComment, error_1, progress, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.job.findUnique({ where: { id: jobId } })];
                        case 1:
                            job = _a.sent();
                            if (!job)
                                throw new Error('Job not found');
                            _a.label = 2;
                        case 2:
                            _a.trys.push([2, 48, 51, 53]);
                            return [4 /*yield*/, this.updateJobStatus(jobId, 'in_progress')];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'info', 'Starting job...')];
                        case 4:
                            _a.sent();
                            // 1. Инициализация скрапера
                            return [4 /*yield*/, this.scraper.init()];
                        case 5:
                            // 1. Инициализация скрапера
                            _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'info', 'Browser initialized')];
                        case 6:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.session.findFirst({
                                    where: { active: true }
                                })];
                        case 7:
                            session = _a.sent();
                            if (!session) {
                                throw new Error('No active session. Please login first.');
                            }
                            return [4 /*yield*/, this.scraper.validateSession(session.cookies)];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'info', 'Session restored')];
                        case 9:
                            _a.sent();
                            // 3. Поиск reels
                            return [4 /*yield*/, this.log(jobId, 'info', "Searching for ".concat(job.videoLimit, " reels..."))];
                        case 10:
                            // 3. Поиск reels
                            _a.sent();
                            return [4 /*yield*/, this.scraper.searchReels(job.query, job.queryType, job.videoLimit)];
                        case 11:
                            reels = _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'info', "Found ".concat(reels.length, " reels"))];
                        case 12:
                            _a.sent();
                            i = 0;
                            _a.label = 13;
                        case 13:
                            if (!(i < reels.length)) return [3 /*break*/, 45];
                            return [4 /*yield*/, this.prisma.job.findUnique({
                                    where: { id: jobId }
                                })];
                        case 14:
                            currentJob = _a.sent();
                            if (!currentJob.stopped) return [3 /*break*/, 16];
                            return [4 /*yield*/, this.log(jobId, 'warn', 'Job stopped by user')];
                        case 15:
                            _a.sent();
                            return [3 /*break*/, 45];
                        case 16:
                            reel = reels[i];
                            return [4 /*yield*/, this.log(jobId, 'info', "Processing reel ".concat(i + 1, "/").concat(reels.length))];
                        case 17:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.video.findUnique({
                                    where: { igVideoId: reel.igVideoId }
                                })];
                        case 18:
                            existingVideo = _a.sent();
                            if (!(existingVideo === null || existingVideo === void 0 ? void 0 : existingVideo.commented)) return [3 /*break*/, 20];
                            return [4 /*yield*/, this.log(jobId, 'info', 'Already commented, skipping...')];
                        case 19:
                            _a.sent();
                            return [3 /*break*/, 44];
                        case 20: return [4 /*yield*/, this.scraper.getReelDetails(reel.url)];
                        case 21:
                            details = _a.sent();
                            return [4 /*yield*/, this.prisma.video.upsert({
                                    where: { igVideoId: reel.igVideoId },
                                    update: { description: details.description },
                                    create: {
                                        jobId: jobId,
                                        igVideoId: reel.igVideoId,
                                        url: reel.url,
                                        description: details.description
                                    }
                                })];
                        case 22:
                            video = _a.sent();
                            return [4 /*yield*/, this.analysis.analyzeVideoRelevance(details.description || '')];
                        case 23:
                            isRelevant = _a.sent();
                            return [4 /*yield*/, this.prisma.video.update({
                                    where: { id: video.id },
                                    data: { isRelevant: isRelevant }
                                })];
                        case 24:
                            _a.sent();
                            if (!!isRelevant) return [3 /*break*/, 26];
                            return [4 /*yield*/, this.log(jobId, 'info', 'Video not relevant, skipping...')];
                        case 25:
                            _a.sent();
                            return [3 /*break*/, 44];
                        case 26:
                            lastComments = details.comments.slice(-job.commentLimit);
                            _i = 0, lastComments_1 = lastComments;
                            _a.label = 27;
                        case 27:
                            if (!(_i < lastComments_1.length)) return [3 /*break*/, 30];
                            comment = lastComments_1[_i];
                            return [4 /*yield*/, this.prisma.comment.create({
                                    data: {
                                        videoId: video.id,
                                        igCommentId: "".concat(reel.igVideoId, "_").concat(Date.now()),
                                        text: comment.text,
                                        author: comment.author,
                                        postedAt: new Date()
                                    }
                                })];
                        case 28:
                            _a.sent();
                            _a.label = 29;
                        case 29:
                            _i++;
                            return [3 /*break*/, 27];
                        case 30: return [4 /*yield*/, this.analysis.analyzeCommentsTone(lastComments.map(function (c) { return c.text; }))];
                        case 31:
                            tone = _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'info', "Detected tone: ".concat(tone))];
                        case 32:
                            _a.sent();
                            return [4 /*yield*/, this.analysis.generateComment(tone, details.description || 'job search')];
                        case 33:
                            generatedComment = _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'info', "Generated: \"".concat(generatedComment, "\""))];
                        case 34:
                            _a.sent();
                            _a.label = 35;
                        case 35:
                            _a.trys.push([35, 39, , 41]);
                            return [4 /*yield*/, this.scraper.postComment(reel.url, generatedComment)];
                        case 36:
                            _a.sent();
                            return [4 /*yield*/, this.prisma.video.update({
                                    where: { id: video.id },
                                    data: {
                                        commented: true,
                                        commentedAt: new Date()
                                    }
                                })];
                        case 37:
                            _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'success', 'Comment posted successfully')];
                        case 38:
                            _a.sent();
                            return [3 /*break*/, 41];
                        case 39:
                            error_1 = _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'error', "Failed to post: ".concat(error_1.message))];
                        case 40:
                            _a.sent();
                            return [3 /*break*/, 41];
                        case 41:
                            progress = Math.round(((i + 1) / reels.length) * 100);
                            return [4 /*yield*/, this.updateJobProgress(jobId, progress)];
                        case 42:
                            _a.sent();
                            // Задержка между действиями
                            return [4 /*yield*/, (0, delay_1.delay)(5000)];
                        case 43:
                            // Задержка между действиями
                            _a.sent();
                            _a.label = 44;
                        case 44:
                            i++;
                            return [3 /*break*/, 13];
                        case 45: return [4 /*yield*/, this.updateJobStatus(jobId, 'completed')];
                        case 46:
                            _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'success', 'Job completed')];
                        case 47:
                            _a.sent();
                            return [3 /*break*/, 53];
                        case 48:
                            error_2 = _a.sent();
                            return [4 /*yield*/, this.log(jobId, 'error', error_2.message)];
                        case 49:
                            _a.sent();
                            return [4 /*yield*/, this.updateJobStatus(jobId, 'failed')];
                        case 50:
                            _a.sent();
                            return [3 /*break*/, 53];
                        case 51: return [4 /*yield*/, this.scraper.close()];
                        case 52:
                            _a.sent();
                            return [7 /*endfinally*/];
                        case 53: return [2 /*return*/];
                    }
                });
            });
        };
        JobsService_1.prototype.stopJob = function (jobId) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.job.update({
                                where: { id: jobId },
                                data: { stopped: true, status: 'stopped' }
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        JobsService_1.prototype.updateJobStatus = function (jobId, status) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.job.update({
                                where: { id: jobId },
                                data: { status: status }
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        JobsService_1.prototype.updateJobProgress = function (jobId, progress) {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.job.update({
                                where: { id: jobId },
                                data: { progress: progress }
                            })];
                        case 1:
                            _a.sent();
                            this.wsGateway.sendProgress(jobId, progress);
                            return [2 /*return*/];
                    }
                });
            });
        };
        JobsService_1.prototype.log = function (jobId, level, message) {
            return __awaiter(this, void 0, void 0, function () {
                var log;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.prisma.log.create({
                                data: { jobId: jobId, level: level, message: message }
                            })];
                        case 1:
                            log = _a.sent();
                            this.wsGateway.sendLog(jobId, log);
                            return [2 /*return*/];
                    }
                });
            });
        };
        return JobsService_1;
    }());
    __setFunctionName(_classThis, "JobsService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        JobsService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return JobsService = _classThis;
}();
exports.JobsService = JobsService;
