"use strict";
(() => {
var exports = {};
exports.id = 39;
exports.ids = [39];
exports.modules = {

/***/ 705:
/***/ ((module) => {

module.exports = import("formidable");;

/***/ }),

/***/ 147:
/***/ ((module) => {

module.exports = require("fs");

/***/ }),

/***/ 17:
/***/ ((module) => {

module.exports = require("path");

/***/ }),

/***/ 525:
/***/ ((module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.a(module, async (__webpack_handle_async_dependencies__, __webpack_async_result__) => { try {
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   config: () => (/* binding */ config),
/* harmony export */   "default": () => (/* binding */ handler)
/* harmony export */ });
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(17);
/* harmony import */ var path__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(path__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(147);
/* harmony import */ var fs__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(fs__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var formidable__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(705);
var __webpack_async_dependencies__ = __webpack_handle_async_dependencies__([formidable__WEBPACK_IMPORTED_MODULE_2__]);
formidable__WEBPACK_IMPORTED_MODULE_2__ = (__webpack_async_dependencies__.then ? (await __webpack_async_dependencies__)() : __webpack_async_dependencies__)[0];



const config = {
    api: {
        bodyParser: false
    }
};
const USERS_PATH = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "users.json");
const VIDEOS_PATH = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "videos.json");
const UPLOAD_DIR = path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "public", "uploads");
async function ensureUploadDir() {
    try {
        await fs__WEBPACK_IMPORTED_MODULE_1__.promises.access(UPLOAD_DIR);
    } catch  {
        await fs__WEBPACK_IMPORTED_MODULE_1__.promises.mkdir(UPLOAD_DIR, {
            recursive: true
        });
    }
}
function mvFile(file, destPath) {
    return fs.rename(file.filepath, destPath);
}
async function handler(req, res) {
    if (req.method !== "POST") return res.status(405).end();
    const token = req.headers["x-token"];
    if (!token) return res.status(401).json({
        message: "Jeton manquant"
    });
    const username = Buffer.from(token, "base64").toString("utf-8");
    try {
        const udata = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(USERS_PATH, "utf-8");
        const users = JSON.parse(udata || "[]");
        const user = users.find((u)=>u.username === username);
        if (!user || !user.isAdmin) return res.status(403).json({
            message: "Seul l'administrateur peut t\xe9l\xe9verser"
        });
        await ensureUploadDir();
        const form = (0,formidable__WEBPACK_IMPORTED_MODULE_2__["default"])({
            uploadDir: UPLOAD_DIR,
            keepExtensions: true
        });
        form.parse(req, async (err, fields, files)=>{
            if (err) {
                res.status(500).json({
                    message: "Erreur lors de l'analyse de l'envoi"
                });
                return;
            }
            try {
                const title = fields.title || "";
                let url = fields.url || "";
                const folderField = fields.folder || "";
                const thumbnailField = fields.thumbnail;
                const descriptionField = fields.description || "";
                // handle uploaded files: 'video' and 'thumbnail'
                const getFile = (f)=>Array.isArray(f) ? f[0] : f;
                // create target directory if folder provided (support nested folders like "course/lesson")
                let targetDir = UPLOAD_DIR;
                if (folderField) {
                    // split on slashes and sanitize each segment
                    const parts = String(folderField).split(/[/\\]+/).filter(Boolean).map((p)=>p.replace(/[^a-zA-Z0-9-_]/g, "_"));
                    if (parts.length > 0) {
                        targetDir = path__WEBPACK_IMPORTED_MODULE_0___default().join(UPLOAD_DIR, ...parts);
                        try {
                            await fs__WEBPACK_IMPORTED_MODULE_1__.promises.access(targetDir);
                        } catch  {
                            await fs__WEBPACK_IMPORTED_MODULE_1__.promises.mkdir(targetDir, {
                                recursive: true
                            });
                        }
                    }
                }
                if (files && files.video) {
                    const fileAny = getFile(files.video);
                    const srcPath = fileAny?.filepath || fileAny?.filePath || fileAny?.path;
                    const fallbackName = fileAny?.newFilename || fileAny?.originalFilename || fileAny?.originalname || fileAny?.name;
                    if (srcPath) {
                        const destName = path__WEBPACK_IMPORTED_MODULE_0___default().basename(srcPath);
                        const dest = path__WEBPACK_IMPORTED_MODULE_0___default().join(targetDir, destName);
                        await fs__WEBPACK_IMPORTED_MODULE_1__.promises.rename(srcPath, dest);
                        const rel = path__WEBPACK_IMPORTED_MODULE_0___default().relative(path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "public"), dest).split((path__WEBPACK_IMPORTED_MODULE_0___default().sep)).join("/");
                        url = "/" + rel;
                    } else if (fallbackName) {
                        // no temp path provided but we have a name; still record it
                        url = "/uploads/" + path__WEBPACK_IMPORTED_MODULE_0___default().basename(fallbackName);
                    }
                }
                let thumbnail = null;
                if (files && files.thumbnail) {
                    const tAny = getFile(files.thumbnail);
                    const tSrc = tAny?.filepath || tAny?.filePath || tAny?.path;
                    const tfallback = tAny?.newFilename || tAny?.originalFilename || tAny?.originalname || tAny?.name;
                    if (tSrc) {
                        const destName = path__WEBPACK_IMPORTED_MODULE_0___default().basename(tSrc);
                        const dest = path__WEBPACK_IMPORTED_MODULE_0___default().join(targetDir, destName);
                        await fs__WEBPACK_IMPORTED_MODULE_1__.promises.rename(tSrc, dest);
                        const rel = path__WEBPACK_IMPORTED_MODULE_0___default().relative(path__WEBPACK_IMPORTED_MODULE_0___default().join(process.cwd(), "public"), dest).split((path__WEBPACK_IMPORTED_MODULE_0___default().sep)).join("/");
                        thumbnail = "/" + rel;
                    } else if (tfallback) {
                        thumbnail = "/uploads/" + path__WEBPACK_IMPORTED_MODULE_0___default().basename(tfallback);
                    }
                } else if (thumbnailField) {
                    thumbnail = thumbnailField;
                }
                if (!title || !url) {
                    res.status(400).json({
                        message: "Champs manquants"
                    });
                    return;
                }
                const vdata = await fs__WEBPACK_IMPORTED_MODULE_1__.promises.readFile(VIDEOS_PATH, "utf-8");
                const videos = JSON.parse(vdata || "[]");
                const id = String(Date.now());
                videos.push({
                    id,
                    title,
                    url,
                    thumbnail: thumbnail || null,
                    description: descriptionField || null,
                    uploadedBy: username,
                    views: 0,
                    likes: 0
                });
                await fs__WEBPACK_IMPORTED_MODULE_1__.promises.writeFile(VIDEOS_PATH, JSON.stringify(videos, null, 2));
                res.status(201).json({
                    message: "ok"
                });
            } catch (e) {
                res.status(500).json({
                    message: "Erreur lors du traitement de l'envoi"
                });
            }
        });
    } catch (err) {
        res.status(500).json({
            message: "\xc9chec du t\xe9l\xe9versement"
        });
    }
}

__webpack_async_result__();
} catch(e) { __webpack_async_result__(e); } });

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../../webpack-api-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = (__webpack_exec__(525));
module.exports = __webpack_exports__;

})();