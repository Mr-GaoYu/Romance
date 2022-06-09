const path = require('path')


// 扁平化数组
exports.flatten = arr => (arr || []).reduce((prev, curr) => prev.concat(curr), []);


// 返回文件夹目录的路径
exports.isDirectoryAndNotCwd = p => {
  if (p && typeof p === 'string') {
    const abs = path.resolve(p);
    const cwd = process.cwd();
    if (cwd !== abs) {
      const stat = fs.statSync(abs);
      if (stat.isDirectory()) {
        return abs;
      }
    }
  }
  return false;
};


// 模板字符串替换
exports.tmpl = (tpl = '', data = {}) => {
  if (typeof tpl !== 'string') {
    throw new TypeError('tmpl parameter type error');
  }
  if (typeof data !== 'object') {
    return tpl;
  }
  return tpl.replace(/\{\{(\w+)\}\}/g, (word, key) => data[key]);
};


// 获取耗时时长，精确到两位
exports.timeCost = (startTime, decimals = 2) => {
  const duration = new Date() - new Date(startTime);
  return (duration / 1e3).toFixed(decimals);
};

const clearRequireCache = (id, map = new Map()) => {
  const module = require.cache[id];
  if (module) {
    map.set(id, true);
    // Clear children modules
    module.children.forEach(child => {
      if (!map.get(child.id)) {
        clearRequireCache(child.id, map);
      }
    });
    delete require.cache[id];
  }
};

exports.reloadModule = path => {
  clearRequireCache(path);
  return require(path);
};