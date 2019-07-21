var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
var qiniu = require('qiniu');
var ProgressBar = require('./process_bar');
var fs = require("fs");
var join = require('path').join;
function Uploader() {
    /*
     *初始化  生成mac 签名验证  返回formUploader 上传对象
     */
    this.init = function () {
        var accessKey = CONFIG.accessKey;
        var secretKey = CONFIG.secretKey;
        var putPolicy = new qiniu.rs.PutPolicy({
            scope: CONFIG.upLoad.bucket
        });
        var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        var uploadToken = putPolicy.uploadToken(mac);
        var config = new qiniu.conf.Config()    ;
        config.zone = this.checkArea(CONFIG.upLoad.zone); //  把存储地区换成相应的zone code
        var formUploader = new qiniu.form_up.FormUploader(config);
        var putExtra = new qiniu.form_up.PutExtra();
        return {
            formUploader: formUploader,
            uploadToken: uploadToken,
            putExtra: putExtra
        };
    };
    /*
     *  读取上传目录 遍历 其中的文件
     * params path  目录路径
     */
    this.readFiles = function (filePath) {
        console.log("正在读取文件目录...");
        var finalFiles = [];
        //检查有无需要忽略的文件或者目录
        var ignores = CONFIG.upLoad.ignore;
        if (ignores.length > 0) {
            ignores.map(function (path) {
                return path;
            });
            var filePath_1 = join(path, item);
        }
        function doRead(path) {
            fs.readdirSync(path).forEach(function (item, index) {
                var filePath = join(path, item);
                var stat = fs.statSync(filePath);
                // if () {
                // }
                if (stat.isDirectory()) {
                    doRead(filePath);
                }
                if (stat.isFile()) {
                    finalFiles.push(filePath);
                }
            });
        }
        doRead(filePath);
        return finalFiles;
    };
    /*
     * 将上传函数包装成 promise函数
     */
    this.doUpload = function (formUploader, uploadToken, putExtra, localFile, key) {
        return new Promise(function (resolve, reject) {
            formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
                if (respErr) {
                    reject(respErr);
                }
                console.log("跑出错误");
                var res = {
                    respBody: respBody,
                    respInfo: respInfo
                };
                console.log("继续执行");
                resolve(res);
            });
        });
    };
    this.start = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, formUploader, uploadToken, putExtra, files, NumTotal, NumDone, processBar, _b, _c, _i, i, localFile, key, uploadRes;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0:
                        _a = this.init(), formUploader = _a.formUploader, uploadToken = _a.uploadToken, putExtra = _a.putExtra;
                        files = this.readFiles(CONFIG.upLoad.fileDir);
                        console.log('文件目录读取成功，开始上传目录文件');
                        console.log("待上传的文件队列个数为：   ", files.length);
                        NumTotal = files.length;
                        NumDone = 0;
                        processBar = new ProgressBar(NumTotal);
                        console.log(files);
                        _b = [];
                        for (_c in files)
                            _b.push(_c);
                        _i = 0;
                        _d.label = 1;
                    case 1:
                        if (!(_i < _b.length)) return [3 /*break*/, 4];
                        i = _b[_i];
                        processBar.render("正在上传", NumTotal, i);
                        localFile = files[i];
                        key = localFile;
                        return [4 /*yield*/, this.doUpload(formUploader, uploadToken, putExtra, localFile, key)];
                    case 2:
                        uploadRes = _d.sent();
                        _d.label = 3;
                    case 3:
                        _i++;
                        return [3 /*break*/, 1];
                    case 4:
                        ;
                        processBar.render("正在上传", NumTotal, NumTotal);
                        return [2 /*return*/];
                }
            });
        });
    };
    this.checkArea = function (name) {
        var code = 'Zone_z0'; //默认华北
        if (!name) {
            console.log("请输入要传输的对象存储的区域");
        }
        ;
        switch (name) {
            case "华北":
                code = "Zone_z1";
                break;
            case "华南":
                code = "Zone_z2";
                break;
            case "北美":
                code = "Zone_na0";
                break;
            default:
                code = "Zone_z0";
                break;
        }
        var zoneUrlObj = qiniu.zone[code];
        return zoneUrlObj;
    };
}
module.exports = Uploader;
