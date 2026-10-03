const { chromium } = require('playwright');
(async()=>{
 const [,, base, prefix] = process.argv;
 const b = await chromium.launch();
 const errs=[];
 for (const [vn,vp] of [['390',{width:390,height:844}],['1280',{width:1280,height:800}]]) {
  for (const [name,path] of [['apparel','/shop?filter=apparel'],['shop','/shop']]) {
   const p = await (await b.newContext({viewport:vp})).newPage();
   p.on('console',m=>{if(m.type()==='error')errs.push(`${prefix} ${name} ${vn}: ${m.text()}`)});
   p.on('requestfailed',r=>errs.push(`${prefix} ${name} ${vn}: REQFAIL ${r.url()}`));
   await p.goto(base+path,{waitUntil:'networkidle',timeout:60000});
   await p.evaluate(()=>window.scrollBy(0,300)); await p.waitForTimeout(800);
   await p.screenshot({path:`_review/DD2/${prefix}_${name}_${vn}.png`});
   if(vn==='1280'){ const t=await p.evaluate(()=>[...document.querySelectorAll('a[href*="/shop/"]')].slice(0,40).map(a=>a.innerText.replace(/\n+/g,' | ')).filter(Boolean)); console.log(prefix,name,JSON.stringify(t.slice(0,24)));}
  }
 }
 console.log('ERRS',JSON.stringify(errs));
 await b.close();
})();
