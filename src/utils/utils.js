// 解析日志模版数据
function parseLogTemplate(data) {
  const rows = data
    .split('\n')
    .map((row) => row.trim())
    .filter((row) => row !== '' && !row.startsWith('//'));

  // 遇到以 # 开头就分组
  let current;
  const result = new Map();

  while (rows.length > 0) {
    const row = rows.shift();

    if (row.startsWith('#')) {
      current = row;
      if (!result.has(current)) {
        result.set(current, []);
      }
      continue;
    }

    if (result.has(current)) {
      result.set(current, result.get(current).concat(row));
    }
  }

  return result;
}

module.exports = {
  parseLogTemplate,
};
