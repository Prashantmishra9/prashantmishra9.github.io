const { chromium } = require('playwright');
(async()=>{const [inp,out,w,h]=process.argv.slice(2);
const b=await chromium.launch(); const p=await b.newPage({viewport:{width:+w||1760,height:+h||1150}});
const errs=[]; p.on('pageerror',e=>errs.push(e.message)); p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
await p.goto('file://'+inp); await p.waitForTimeout(1500);
await p.screenshot({path:out,fullPage:true}); console.log('errors:',errs); await b.close();})();
