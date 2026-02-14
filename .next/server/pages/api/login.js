"use strict";
(() => {
var exports = {};
exports.id = 994;
exports.ids = [994];
exports.modules = {

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 944:
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
    if (req.method !== "POST") return res.status(405).end();
    const { username, password } = req.body || {};
    if (!username || !password) return res.status(400).json({
        message: "Champs manquants"
    });
    try {
        const data = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(USERS_PATH, "utf-8");
        const users = JSON.parse(data || "[]");
        const user = users.find((u)=>u.username === username && u.password === password);
        if (!user) return res.status(401).json({
            message: "Identifiants invalides"
        });
        const token = Buffer.from(username).toString("base64");
        res.status(200).json({
            token,
            username,
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
var __webpack_exports__ = (__webpack_exec__(944));
module.exports = __webpack_exports__;

})();