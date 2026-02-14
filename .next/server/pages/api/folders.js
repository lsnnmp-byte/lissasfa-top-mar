"use strict";
(() => {
var exports = {};
exports.id = 121;
exports.ids = [121];
exports.modules = {

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 870:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);


const UPLOAD_DIR = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "public", "uploads");
async function handler(req, res) {
    try {
        await fs__WEBPACK_IMPORTED_MODULE_1__.promises.mkdir(UPLOAD_DIR, {
            recursive: true
        });
        // recursively list directories under UPLOAD_DIR and return relative paths
        const results = [];
        async function walk(dir, rel = "") {
            const items = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readdir(dir, {
                withFileTypes: true
            });
            for (const it of items){
                if (it.isDirectory()) {
                    const name = it.name;
                    const nrel = rel ? `${rel}/${name}` : name;
                    results.push(nrel);
                    await walk(path__WEBPACK_IMPORTED_MODULE_0___default().join(dir, name), nrel);
                }
            }
        }
        await walk(UPLOAD_DIR);
        return res.status(200).json(results);
    } catch (err) {
        console.error("folders api error", err);
        return res.status(500).json({
            message: "Could not list folders"
        });
    }
}


/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(870));
module.exports = __webpack_exports__;

})();