"use strict";
(() => {
var exports = {};
exports.id = 161;
exports.ids = [161];
exports.modules = {

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 487:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);


const USERS_PATH = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "users.json");
async function handler(req, res) {
    const token = req.headers["x-token"] || "";
    if (!token) return res.status(401).json({
        message: "Jeton manquant"
    });
    const username = Buffer.from(token, "base64").toString("utf-8");
    try {
        const data = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(USERS_PATH, "utf-8");
        const users = JSON.parse(data || "[]");
        const user = users.find((u)=>u.username === username);
        if (!user) return res.status(401).json({
            message: "Jeton invalide"
        });
        res.status(200).json({
            username: user.username,
            isAdmin: !!user.isAdmin
        });
    } catch (err) {
        res.status(500).json({
            message: "Erreur lors de la lecture des utilisateurs"
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
var __webpack_exports__ = (__webpack_exec__(487));
module.exports = __webpack_exports__;

})();