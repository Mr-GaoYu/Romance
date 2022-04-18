module.exports = template => {
  // 包含代码库或分支标识的特殊写法，认为是模板
  if (/[#:]/.test(template)) {
      return true;
  }

  // 不含/线，不认为是一个template地址
  // 这里忽略模板的alias写法，用alias需要2个参数
  if (template.indexOf('/') === -1) {
      return false;
  }

  // 目录层级大于2，不可能是github的简写
  if (template.split('/').length > 2) {
      return false;
  }

  return true;
};