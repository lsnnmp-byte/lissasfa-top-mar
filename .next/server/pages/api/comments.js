"use strict";
(() => {
var exports = {};
exports.id = 265;
exports.ids = [265];
exports.modules = {

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 1:
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
const USERS_PATH = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "users.json");
// Single comments API: comments are stored inside each video entry (videos.json)
async function handler(req, res) {
    try {
        if (req.method === "GET") {
            const { videoId } = req.query || {};
            if (!videoId) return res.status(400).json({
                message: "Missing videoId"
            });
            const data = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(VIDEOS_PATH, "utf-8");
            const videos = JSON.parse(data || "[]");
            const v = videos.find((x)=>x.id === String(videoId));
            if (!v) return res.status(404).json({
                message: "Not found"
            });
            return res.status(200).json(v.comments || []);
        }
        if (req.method === "POST") {
            const token = req.headers["x-token"];
            if (!token) return res.status(401).json({
                message: "Missing token"
            });
            const username = Buffer.from(token, "base64").toString("utf-8");
            const udata = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(USERS_PATH, "utf-8");
            const users = JSON.parse(udata || "[]");
            const user = users.find((u)=>u.username === username);
            if (!user) return res.status(401).json({
                message: "Invalid token"
            });
            const { videoId, text } = req.body || {};
            if (!videoId || !text) return res.status(400).json({
                message: "Missing fields"
            });
            const vdata = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(VIDEOS_PATH, "utf-8");
            const videos = JSON.parse(vdata || "[]");
            const v = videos.find((x)=>x.id === String(videoId));
            if (!v) return res.status(404).json({
                message: "Not found"
            });
            const comment = {
                id: String(Date.now()) + Math.random().toString(36).slice(2, 8),
                text,
                author: user.username,
                createdAt: new Date().toISOString()
            };
            v.comments = v.comments || [];
            v.comments.push(comment);
            await fs__WEBPACK_IMPORTED_MODULE_1__.promises.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2));
            return res.status(201).json(comment);
        }
        if (req.method === "DELETE") {
            const token = req.headers["x-token"];
            if (!token) return res.status(401).json({
                message: "Missing token"
            });
            const username = Buffer.from(token, "base64").toString("utf-8");
            const udata = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(USERS_PATH, "utf-8");
            const users = JSON.parse(udata || "[]");
            const user = users.find((u)=>u.username === username);
            if (!user) return res.status(401).json({
                message: "Invalid token"
            });
            const { videoId, commentId } = req.body || {};
            if (!videoId || !commentId) return res.status(400).json({
                message: "Missing fields"
            });
            const vdata = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(VIDEOS_PATH, "utf-8");
            const videos = JSON.parse(vdata || "[]");
            const v = videos.find((x)=>x.id === String(videoId));
            if (!v) return res.status(404).json({
                message: "Not found"
            });
            v.comments = v.comments || [];
            const idx = v.comments.findIndex((c)=>c.id === String(commentId));
            if (idx === -1) return res.status(404).json({
                message: "Comment not found"
            });
            const comment = v.comments[idx];
            if (comment.author !== user.username && !user.isAdmin) return res.status(403).json({
                message: "Forbidden"
            });
            v.comments.splice(idx, 1);
            await fs__WEBPACK_IMPORTED_MODULE_1__.promises.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2));
            return res.status(200).json({
                message: "deleted"
            });
        }
        res.setHeader("Allow", "GET, POST, DELETE");
        return res.status(405).end("Method Not Allowed");
    } catch (err) {
        console.error("comments api error", err);
        return res.status(500).json({
            message: "Comments error"
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
var __webpack_exports__ = (__webpack_exec__(1));
module.exports = __webpack_exports__;

})();