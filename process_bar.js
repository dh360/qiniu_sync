let log = require('single-line-log').stdout;

/*
 *根据文件个数显示进度条
 */
function ProgressBar(numFils) {
    this.length = numFils || 100;
}

// 刷新进度条
ProgressBar.prototype.render = function (desc, numTotal, numDone) {

    let percent = numDone / numTotal; // 计算进度
    let cell_num = Math.floor(percent * this.length); // 计算 █ 符号的个数

    // 拼接黑色条
    let cell = '';
    for (let i = 0; i < cell_num; i++) {
        cell += '█';
    }
    // 拼接灰色条
    let empty = '';
    for (let i = 0; i < this.length - cell_num; i++) {
        empty += '░';
    }

    var process = `\n ${desc}:\n ${numDone}/${numTotal} ${cell}${empty} ${(100 * percent).toFixed(2)}% \n`;
    log(process);

    if (numTotal == numDone) {
        this.done();
        console.log("\n文件上传完成");
    }
};

//清除
ProgressBar.prototype.done = function () {
    log.clear();
}

// 模块导出
module.exports = ProgressBar;