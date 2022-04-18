module.exports = (template, appName, options = {}) => {
   // template = alias(template);
   const inPlace = !appName || appName === '.';
   // inPlace：是否在当前目录
   options._inPlace = inPlace;
   // dest：新建工程的目录
   const dest = path.resolve((appName + '') || '.');
   // 记录一下开始新建工程时的起始时间
   const startTime = Date.now();

   const tasks = [
    {title: '🔍 Checking directory and offline template status...', task: checkStatus(template, dest, options)},
    {title: '🚚 Downloading project scaffolding template...', task: download(template, dest, options)},
    {title: '🔨 Generating directory structure...', task: generator(template, dest, options)},
    {title: '🔗 Installing dependencies...', task: installDep(template, dest, options)}
];
}