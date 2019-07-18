/*
* 检测文件变化，   自动 上传到 qiniu
* 改变类型        增加文件夹(addDir) 删除文件夹(unlinkDir) 增加文件(add) 删除文件(unlink) 
* 重命名文件夹     两个动作 ： 1  unlinkDir old 2 addDir  new
* 重命名文件      两个动作： 1  unlink  old    2   add  new
* change        事件 不做操作， 没有具体的 操作名称
*/

const Chokidar = require('chokidar');
const Path = require('path');

const watchFir= Path.resolve('.') // 监听目录
Chokidar.watch(watchFir,  { ignored: /(^|[\/\\])\../ }).on('all', (event, path) => {
    switch (event) {
        case 'addDir': 
            
            break;
        case 'unlinkDir':
            break;
        
        case 'add':
            break;
        
        case 'unlink':
            break;
        
        default:
            break;
    }
  });


class Change{
    constructor(event) { 

    }
      //增加文件或者文件夹

    add() { 

    }

    //删除文件或者文件夹

    delete() { }
  }
