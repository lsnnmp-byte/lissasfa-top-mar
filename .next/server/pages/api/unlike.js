"use strict";
(() => {
var exports = {};
exports.id = 787;
exports.ids = [787];
exports.modules = {

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 262:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);


const VIDEOS_PATH = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "videos.json");
async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const { id } = req.body || {};
    if (!id) return res.status(400).json({
        message: "Missing id"
    });
    try {
        const data = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(VIDEOS_PATH, "utf-8");
        const videos = JSON.parse(data || "[]");
        const v = videos.find((x)=>x.id === id);
        if (!v) return res.status(404).json({
            message: "Not found"
        });
        v.likes = Math.max(0, (v.likes || 0) - 1);
        await fs__WEBPACK_IMPORTED_MODULE_1__.promises.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2));
        return res.status(200).json({
            id,
            likes: v.likes
        });
    } catch (err) {
        console.error("unlike error", err);
        return res.status(500).json({
            message: "Could not update likes"
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
var __webpack_exports__ = (__webpack_exec__(262));
module.exports = __webpack_exports__;

})();