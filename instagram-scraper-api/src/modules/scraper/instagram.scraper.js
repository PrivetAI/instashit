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
exports.InstagramScraper = void 0;
var common_1 = require("@nestjs/common");
var puppeteer_extra_1 = require("puppeteer-extra");
var puppeteer_extra_plugin_stealth_1 = require("puppeteer-extra-plugin-stealth");
var logger_1 = require("../../utils/logger");
var delay_1 = require("../../utils/delay");
puppeteer_extra_1.default.use((0, puppeteer_extra_plugin_stealth_1.default)());
var InstagramScraper = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var InstagramScraper = _classThis = /** @class */ (function () {
        function InstagramScraper_1(config) {
            this.config = config;
            this.logger = new logger_1.AppLogger('InstagramScraper');
        }
        InstagramScraper_1.prototype.init = function () {
            return __awaiter(this, void 0, void 0, function () {
                var _a, _b, error_1;
                return __generator(this, function (_c) {
                    switch (_c.label) {
                        case 0:
                            _c.trys.push([0, 6, , 7]);
                            _a = this;
                            return [4 /*yield*/, puppeteer_extra_1.default.launch({
                                    headless: this.config.get('app.puppeteer.headless'),
                                    executablePath: this.config.get('app.puppeteer.executablePath'),
                                    args: [
                                        '--no-sandbox',
                                        '--disable-setuid-sandbox',
                                        '--disable-blink-features=AutomationControlled',
                                        '--disable-features=IsolateOrigins,site-per-process',
                                    ],
                                })];
                        case 1:
                            _a.browser = _c.sent();
                            _b = this;
                            return [4 /*yield*/, this.browser.newPage()];
                        case 2:
                            _b.page = _c.sent();
                            // Настройка user agent
                            return [4 /*yield*/, this.page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36')];
                        case 3:
                            // Настройка user agent
                            _c.sent();
                            return [4 /*yield*/, this.page.setViewport({ width: 1280, height: 800 })];
                        case 4:
                            _c.sent();
                            // Блокировка ненужных ресурсов для ускорения
                            return [4 /*yield*/, this.page.setRequestInterception(true)];
                        case 5:
                            // Блокировка ненужных ресурсов для ускорения
                            _c.sent();
                            this.page.on('request', function (req) {
                                var resourceType = req.resourceType();
                                if (['image', 'stylesheet', 'font'].includes(resourceType)) {
                                    req.abort();
                                }
                                else {
                                    req.continue();
                                }
                            });
                            this.logger.log('Browser initialized successfully');
                            return [3 /*break*/, 7];
                        case 6:
                            error_1 = _c.sent();
                            this.logger.error('Failed to initialize browser', error_1.stack);
                            throw error_1;
                        case 7: return [2 /*return*/];
                    }
                });
            });
        };
        InstagramScraper_1.prototype.login = function (username, password) {
            return __awaiter(this, void 0, void 0, function () {
                var e_1, is2FA, profileIcon, cookies, error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 17, , 18]);
                            return [4 /*yield*/, this.page.goto("".concat(this.config.get('app.instagram.baseUrl'), "/accounts/login/"), {
                                    waitUntil: 'networkidle2',
                                })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(2000, 3000)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 5, , 6]);
                            return [4 /*yield*/, this.page.click('button:has-text("Allow essential and optional cookies")', { timeout: 3000 })];
                        case 4:
                            _a.sent();
                            return [3 /*break*/, 6];
                        case 5:
                            e_1 = _a.sent();
                            return [3 /*break*/, 6];
                        case 6: 
                        // Ввод данных
                        return [4 /*yield*/, this.page.waitForSelector('input[name="username"]')];
                        case 7:
                            // Ввод данных
                            _a.sent();
                            return [4 /*yield*/, this.page.type('input[name="username"]', username, { delay: 100 })];
                        case 8:
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(500, 1000)];
                        case 9:
                            _a.sent();
                            return [4 /*yield*/, this.page.type('input[name="password"]', password, { delay: 100 })];
                        case 10:
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(1000, 2000)];
                        case 11:
                            _a.sent();
                            // Клик по кнопке входа
                            return [4 /*yield*/, Promise.all([
                                    this.page.waitForNavigation({ waitUntil: 'networkidle2' }),
                                    this.page.click('button[type="submit"]'),
                                ])];
                        case 12:
                            // Клик по кнопке входа
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(3000, 5000)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, this.page.$('input[name="verificationCode"]')];
                        case 14:
                            is2FA = _a.sent();
                            if (is2FA) {
                                throw new Error('2FA_REQUIRED');
                            }
                            return [4 /*yield*/, this.page.$('[aria-label="Profile"]')];
                        case 15:
                            profileIcon = _a.sent();
                            if (!profileIcon) {
                                throw new Error('LOGIN_FAILED');
                            }
                            return [4 /*yield*/, this.page.cookies()];
                        case 16:
                            cookies = _a.sent();
                            this.logger.log('Login successful');
                            return [2 /*return*/, cookies];
                        case 17:
                            error_2 = _a.sent();
                            this.logger.error('Login failed', error_2.stack);
                            throw error_2;
                        case 18: return [2 /*return*/];
                    }
                });
            });
        };
        InstagramScraper_1.prototype.setCookies = function (cookies) {
            return __awaiter(this, void 0, void 0, function () {
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0: return [4 /*yield*/, (_a = this.page).setCookie.apply(_a, cookies)];
                        case 1:
                            _b.sent();
                            return [2 /*return*/];
                    }
                });
            });
        };
        InstagramScraper_1.prototype.validateSession = function (cookies) {
            return __awaiter(this, void 0, void 0, function () {
                var profileIcon, error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.setCookies(cookies)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, this.page.goto(this.config.get('app.instagram.baseUrl'), {
                                    waitUntil: 'networkidle2',
                                })];
                        case 2:
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(2000, 3000)];
                        case 3:
                            _a.sent();
                            return [4 /*yield*/, this.page.$('[aria-label="Profile"]')];
                        case 4:
                            profileIcon = _a.sent();
                            return [2 /*return*/, !!profileIcon];
                        case 5:
                            error_3 = _a.sent();
                            this.logger.error('Session validation failed', error_3.stack);
                            return [2 /*return*/, false];
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        InstagramScraper_1.prototype.searchReels = function (query, type, limit) {
            return __awaiter(this, void 0, void 0, function () {
                var url, cleanQuery, e_2, reels, scrollCount, maxScrolls, newReels, _loop_1, _i, newReels_1, reel, state_1, error_4;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 13, , 14]);
                            url = void 0;
                            if (type === 'hashtag') {
                                cleanQuery = query.replace('#', '');
                                url = "".concat(this.config.get('app.instagram.baseUrl'), "/explore/tags/").concat(cleanQuery, "/");
                            }
                            else {
                                url = "".concat(this.config.get('app.instagram.baseUrl'), "/explore/search/keyword/?q=").concat(encodeURIComponent(query));
                            }
                            return [4 /*yield*/, this.page.goto(url, { waitUntil: 'networkidle2' })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(3000, 4000)];
                        case 2:
                            _a.sent();
                            _a.label = 3;
                        case 3:
                            _a.trys.push([3, 6, , 7]);
                            return [4 /*yield*/, this.page.click('a[href*="/reels/"]', { timeout: 3000 })];
                        case 4:
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(2000, 3000)];
                        case 5:
                            _a.sent();
                            return [3 /*break*/, 7];
                        case 6:
                            e_2 = _a.sent();
                            return [3 /*break*/, 7];
                        case 7:
                            reels = [];
                            scrollCount = 0;
                            maxScrolls = 15;
                            _a.label = 8;
                        case 8:
                            if (!(reels.length < limit && scrollCount < maxScrolls)) return [3 /*break*/, 12];
                            return [4 /*yield*/, this.page.evaluate(function () {
                                    var links = Array.from(document.querySelectorAll('a[href*="/reel/"]'));
                                    return links.map(function (link) {
                                        var href = link.href;
                                        var match = href.match(/\/reel\/([^\/\?]+)/);
                                        return {
                                            url: href.split('?')[0], // Убираем query params
                                            igVideoId: match ? match[1] : null,
                                        };
                                    }).filter(function (item) { return item.igVideoId; });
                                })];
                        case 9:
                            newReels = _a.sent();
                            _loop_1 = function (reel) {
                                if (!reels.find(function (r) { return r.igVideoId === reel.igVideoId; })) {
                                    reels.push(reel);
                                    if (reels.length >= limit)
                                        return "break";
                                }
                            };
                            // Добавляем только уникальные
                            for (_i = 0, newReels_1 = newReels; _i < newReels_1.length; _i++) {
                                reel = newReels_1[_i];
                                state_1 = _loop_1(reel);
                                if (state_1 === "break")
                                    break;
                            }
                            // Скролл
                            return [4 /*yield*/, this.page.evaluate(function () {
                                    window.scrollBy(0, window.innerHeight * 0.8);
                                })];
                        case 10:
                            // Скролл
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(2000, 3000)];
                        case 11:
                            _a.sent();
                            scrollCount++;
                            this.logger.debug("Scroll ".concat(scrollCount, ": found ").concat(reels.length, " reels"));
                            return [3 /*break*/, 8];
                        case 12: return [2 /*return*/, reels.slice(0, limit)];
                        case 13:
                            error_4 = _a.sent();
                            this.logger.error('Failed to search reels', error_4.stack);
                            throw error_4;
                        case 14: return [2 /*return*/];
                    }
                });
            });
        };
        InstagramScraper_1.prototype.getReelDetails = function (url) {
            return __awaiter(this, void 0, void 0, function () {
                var details, error_5;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 5, , 6]);
                            return [4 /*yield*/, this.page.goto(url, { waitUntil: 'networkidle2' })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(3000, 4000)];
                        case 2:
                            _a.sent();
                            // Ждем загрузки контента
                            return [4 /*yield*/, this.page.waitForSelector('article', { timeout: 10000 })];
                        case 3:
                            // Ждем загрузки контента
                            _a.sent();
                            return [4 /*yield*/, this.page.evaluate(function () {
                                    // Описание видео
                                    var descElement = document.querySelector('h1');
                                    var description = (descElement === null || descElement === void 0 ? void 0 : descElement.textContent) || '';
                                    // Собираем комментарии
                                    var comments = [];
                                    var commentElements = document.querySelectorAll('ul > div[role="button"]');
                                    commentElements.forEach(function (element) {
                                        var _a, _b;
                                        var authorElement = element.querySelector('a span');
                                        var textElement = element.querySelector('span:not(a span)');
                                        if (authorElement && textElement) {
                                            var author = ((_a = authorElement.textContent) === null || _a === void 0 ? void 0 : _a.trim()) || '';
                                            var text = ((_b = textElement.textContent) === null || _b === void 0 ? void 0 : _b.trim()) || '';
                                            if (author && text && !text.includes('View replies')) {
                                                comments.push({ author: author, text: text });
                                            }
                                        }
                                    });
                                    return { description: description, comments: comments };
                                })];
                        case 4:
                            details = _a.sent();
                            this.logger.debug("Found ".concat(details.comments.length, " comments"));
                            return [2 /*return*/, details];
                        case 5:
                            error_5 = _a.sent();
                            this.logger.error('Failed to get reel details', error_5.stack);
                            throw error_5;
                        case 6: return [2 /*return*/];
                    }
                });
            });
        };
        InstagramScraper_1.prototype.postComment = function (url, text) {
            return __awaiter(this, void 0, void 0, function () {
                var commentSelector, postButton, postedComment, error_6;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 15, , 16]);
                            return [4 /*yield*/, this.page.goto(url, { waitUntil: 'networkidle2' })];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(3000, 4000)];
                        case 2:
                            _a.sent();
                            commentSelector = 'textarea[aria-label*="comment" i], textarea[placeholder*="comment" i]';
                            return [4 /*yield*/, this.page.waitForSelector(commentSelector, { timeout: 10000 })];
                        case 3:
                            _a.sent();
                            // Кликаем на поле
                            return [4 /*yield*/, this.page.click(commentSelector)];
                        case 4:
                            // Кликаем на поле
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(500, 1000)];
                        case 5:
                            _a.sent();
                            // Вводим текст
                            return [4 /*yield*/, this.page.type(commentSelector, text, { delay: 100 })];
                        case 6:
                            // Вводим текст
                            _a.sent();
                            return [4 /*yield*/, (0, delay_1.randomDelay)(1000, 2000)];
                        case 7:
                            _a.sent();
                            return [4 /*yield*/, this.page.$('button[type="submit"]:has-text("Post")')];
                        case 8:
                            postButton = _a.sent();
                            if (!postButton) return [3 /*break*/, 10];
                            return [4 /*yield*/, postButton.click()];
                        case 9:
                            _a.sent();
                            return [3 /*break*/, 12];
                        case 10: return [4 /*yield*/, this.page.keyboard.press('Enter')];
                        case 11:
                            _a.sent();
                            _a.label = 12;
                        case 12: return [4 /*yield*/, (0, delay_1.randomDelay)(3000, 5000)];
                        case 13:
                            _a.sent();
                            return [4 /*yield*/, this.page.evaluate(function (commentText) {
                                    var comments = Array.from(document.querySelectorAll('span')).filter(function (span) { var _a; return (_a = span.textContent) === null || _a === void 0 ? void 0 : _a.includes(commentText); });
                                    return comments.length > 0;
                                }, text)];
                        case 14:
                            postedComment = _a.sent();
                            if (!postedComment) {
                                throw new Error('Comment not posted');
                            }
                            this.logger.log('Comment posted successfully');
                            return [2 /*return*/, true];
                        case 15:
                            error_6 = _a.sent();
                            this.logger.error('Failed to post comment', error_6.stack);
                            throw error_6;
                        case 16: return [2 /*return*/];
                    }
                });
            });
        };
        InstagramScraper_1.prototype.close = function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            if (!this.browser) return [3 /*break*/, 2];
                            return [4 /*yield*/, this.browser.close()];
                        case 1:
                            _a.sent();
                            this.logger.log('Browser closed');
                            _a.label = 2;
                        case 2: return [2 /*return*/];
                    }
                });
            });
        };
        return InstagramScraper_1;
    }());
    __setFunctionName(_classThis, "InstagramScraper");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        InstagramScraper = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return InstagramScraper = _classThis;
}();
exports.InstagramScraper = InstagramScraper;
