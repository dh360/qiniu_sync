let qiniu = require('qiniu');
let util = require('./util');
const CONFIG = require('./config.js');
let fs = require("fs");
// let a = fs.readdir('./upload_file', {
//     withFileTypes: true
// }, (err, list) => {
//     for (let i in list) {
//         let a = list[i].isDirectory()
//         console.log(list[i].name, a, i, list[i]);
//     }

// });

util.doUpload(CONFIG);