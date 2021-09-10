"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// import * as myExtension from '../../extension';
const FixtureTestRunner_1 = require("./src/test/helpers/FixtureTestRunner");
const asyncSuite_1 = require("./src/test/helpers/asyncSuite");
(0, asyncSuite_1.default)('fixture tests', function () {
    return __awaiter(this, void 0, void 0, function* () {
        const suites = yield FixtureTestRunner_1.default.suites(() => __awaiter(this, void 0, void 0, function* () {
            /* do nothing */
        }));
        return suite('Fixture Test Suite', function () {
            FixtureTestRunner_1.default.runSuites(suites, this);
        });
    });
});
//# sourceMappingURL=fixtures.test.js.map