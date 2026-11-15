const base = require('./karma.conf');
const fs = require('node:fs'), path = require('node:path');
const output = path.resolve(__dirname, '../outputs/textbook-audit');
const save = () => (req,res,next) => {
  if(req.url.startsWith('/assets/')) {
    const root=path.resolve(__dirname,'public');
    const file=path.resolve(root,'.'+decodeURIComponent(new URL(req.url,'http://localhost').pathname));
    if(!file.startsWith(root+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.statusCode=404;return res.end();}
    res.setHeader('Content-Type', file.endsWith('.jpg')||file.endsWith('.jpeg')?'image/jpeg':file.endsWith('.webp')?'image/webp':file.endsWith('.svg')?'image/svg+xml':'image/png');
    return fs.createReadStream(file).pipe(res);
  }
  if(!req.url.startsWith('/textbook-audit-artifact?'))return next();
  const name = new URL(req.url,'http://localhost').searchParams.get('name');
  if(!/^[a-zA-Z0-9_]+[.]png$/.test(name||'')){res.statusCode=400;return res.end();}
  const chunks=[];req.on('data',chunk=>chunks.push(chunk));req.on('end',()=>{fs.mkdirSync(output,{recursive:true});fs.writeFileSync(path.join(output,name),Buffer.concat(chunks));res.end('ok');});
};
save.$inject=[];
module.exports = config => base({set: options => config.set({...options, browsers:['ChromeHeadlessNoSandbox'],beforeMiddleware:['textbookArtifacts'],plugins:[...options.plugins,{'middleware:textbookArtifacts':['factory',save]}]})});
