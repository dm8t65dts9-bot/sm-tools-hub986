'use strict';
const T=[],t=(id,cat,name,desc,sample,fn,opt)=>T.push({id,cat,name,desc,sample,fn,opt});
const J=s=>JSON.parse(s),enc=new TextEncoder(),hex=b=>[...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,'0')).join('');
const rnd=n=>crypto.getRandomValues(new Uint8Array(n));
const hash=async(s,a)=>hex(await crypto.subtle.digest(a,enc.encode(s)));
const b64e=s=>btoa(Array.from(enc.encode(s),b=>String.fromCharCode(b)).join(''));
const b64d=s=>new TextDecoder().decode(Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0)));
const rgb=h=>{h=h.trim().replace('#','');if(h.length==3)h=[...h].map(c=>c+c).join('');if(!/^[0-9a-f]{6}$/i.test(h))throw Error('অবৈধ HEX রং');return[0,2,4].map(i=>parseInt(h.substr(i,2),16))};
const lum=c=>{const[r,g,b]=c.map(v=>(v/=255)<=.03928?v/12.92:((v+.055)/1.055)**2.4);return .2126*r+.7152*g+.0722*b};
const lines=s=>s.split('\n');
const csvRow=l=>{const o=[];let c='',q=false;for(const ch of l){if(ch=='"')q=!q;else if(ch==','&&!q){o.push(c);c=''}else c+=ch}o.push(c);return o};
// HTML
t('html-enc','HTML','HTML Entity Encoder','Special অক্ষর entity-তে রূপান্তর','<p class="a">Tom & "Jerry"</p>',s=>s.replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';'));
t('html-dec','HTML','HTML Entity Decoder','Entity থেকে মূল টেক্সট','&lt;p&gt;Hi &amp; bye&lt;/p&gt;',s=>new DOMParser().parseFromString(s,'text/html').documentElement.textContent);
t('html-min','HTML','HTML Minifier','কমেন্ট ও বাড়তি স্পেস সরায়','<div>\n  <!-- note -->\n  <p>Hello</p>\n</div>',s=>s.replace(/<!--[\s\S]*?-->/g,'').replace(/>\s+</g,'><').replace(/\s{2,}/g,' ').trim());
const pv=t('html-prev','HTML','HTML Preview','Sandboxed iframe-এ প্রিভিউ','<h1 style="color:teal">Hello</h1>',s=>s);T[T.length-1].html=1;
// CSS
t('css-min','CSS','CSS Minifier','CSS ছোট করে','a {\n  color: red;\n  margin: 0 auto;\n}',s=>s.replace(/\/\*[\s\S]*?\*\//g,'').replace(/\s*([{}:;,])\s*/g,'$1').replace(/;}/g,'}').trim());
t('css-grad','CSS','CSS Gradient Generator','রং দিয়ে gradient CSS','#ff7e5f, #feb47b',(s,o)=>{const c=s.split(',').map(x=>x.trim()).filter(Boolean);if(c.length<2)throw Error('কমপক্ষে ২টি রং দিন');return`background: linear-gradient(${o||'135deg'}, ${c.join(', ')});`},{label:'Angle',def:'135deg'});
t('css-shadow','CSS','Box Shadow Generator','x y blur spread color','4 6 12 0 rgba(0,0,0,.3)',s=>{const p=s.trim().split(/\s+(?![^(]*\))/);if(p.length<3)throw Error('x y blur [spread] [color] দিন');const v=p.map(x=>/^[\d.-]+$/.test(x)?x+'px':x);return`box-shadow: ${v.join(' ')};`});
t('px-rem','CSS','px to rem','px থেকে rem','24',(s,o)=>{const n=parseFloat(s);if(isNaN(n))throw Error('সংখ্যা দিন');return n/parseFloat(o||16)+'rem'},{label:'Base px',def:'16'});
t('rem-px','CSS','rem to px','rem থেকে px','1.5',(s,o)=>{const n=parseFloat(s);if(isNaN(n))throw Error('সংখ্যা দিন');return n*parseFloat(o||16)+'px'},{label:'Base px',def:'16'});
// JSON
t('json-fmt','JSON','JSON Formatter','সুন্দর করে সাজায়','{"a":1,"b":[1,2,{"c":null}]}',s=>JSON.stringify(J(s),null,2));
t('json-min','JSON','JSON Minifier','JSON কমপ্যাক্ট করে','{\n "a": 1,\n "b": [1, 2]\n}',s=>JSON.stringify(J(s)));
t('json-val','JSON','JSON Validator','বৈধ JSON কি না যাচাই','{"ok":true}',s=>{J(s);return'✔ বৈধ JSON'});
t('json-csv','JSON','JSON to CSV','অবজেক্টের অ্যারে → CSV','[{"name":"A","age":1},{"name":"B","age":2}]',s=>{const a=J(s);if(!Array.isArray(a)||!a.length)throw Error('অবজেক্টের অ্যারে দিন');const k=[...new Set(a.flatMap(Object.keys))];const q=v=>'"'+String(v??'').replace(/"/g,'""')+'"';return[k.map(q).join(','),...a.map(r=>k.map(c=>q(r[c])).join(','))].join('\n')});
t('csv-json','JSON','CSV to JSON','CSV → JSON','name,age\nA,1\nB,2',s=>{const l=lines(s.trim());const h=csvRow(l[0]);return JSON.stringify(l.slice(1).map(r=>Object.fromEntries(csvRow(r).map((v,i)=>[h[i],v]))),null,2)});
// Encoding
t('b64-enc','Encoding','Base64 Encoder','টেক্সট → Base64 (UTF-8)','হ্যালো World',b64e);
t('b64-dec','Encoding','Base64 Decoder','Base64 → টেক্সট','4Kep4KeN4KaV',s=>b64d(s.trim()));
t('url-enc','Encoding','URL Encoder','URL encode','a b&c=d/ü',encodeURIComponent);
t('url-dec','Encoding','URL Decoder','URL decode','a%20b%26c%3Dd',decodeURIComponent);
t('bin','Encoding','Text to Binary','টেক্সট → বাইনারি','Hi',s=>[...enc.encode(s)].map(b=>b.toString(2).padStart(8,'0')).join(' '));
t('hexc','Encoding','Text to Hex','টেক্সট → হেক্স','Hi',s=>[...enc.encode(s)].map(b=>b.toString(16).padStart(2,'0')).join(' '));
t('ascii','Encoding','ASCII Codes','অক্ষরের কোড','Hello',s=>[...s].map(c=>c.codePointAt(0)).join(' '));
t('uni','Encoding','Unicode Escape','\\uXXXX এ রূপান্তর','হ্যালো',s=>[...s].map(c=>'\\u'+c.charCodeAt(0).toString(16).padStart(4,'0')).join(''));
// Text
t('words','Text','Word & Character Counter','শব্দ, অক্ষর, লাইন গণনা','Hello world\nSecond line',s=>`শব্দ: ${(s.match(/\S+/g)||[]).length}\nঅক্ষর: ${[...s].length}\nবাদে স্পেস: ${s.replace(/\s/g,'').length}\nলাইন: ${lines(s).length}`);
t('case','Text','Case Converter','upper/lower/title/camel/snake/kebab','hello big world',(s,o)=>{const w=s.trim().split(/[\s_-]+/);const m={upper:()=>s.toUpperCase(),lower:()=>s.toLowerCase(),title:()=>s.toLowerCase().replace(/\b\w/g,c=>c.toUpperCase()),camel:()=>w.map((x,i)=>i?x[0].toUpperCase()+x.slice(1):x.toLowerCase()).join(''),snake:()=>w.join('_').toLowerCase(),kebab:()=>w.join('-').toLowerCase()};if(!m[o])throw Error('মোড: '+Object.keys(m).join(', '));return m[o]()},{label:'Mode',def:'camel'});
t('sort','Text','Line Sorter','লাইন সাজায়','pear\napple\nfig',s=>lines(s).sort((a,b)=>a.localeCompare(b)).join('\n'));
t('dedupe','Text','Duplicate Line Remover','ডুপ্লিকেট লাইন বাদ','a\nb\na\nc\nb',s=>[...new Set(lines(s))].join('\n'));
t('slug','Text','Slug Generator','URL-friendly slug','Hello, World! My First Post',s=>s.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]+/gu,'-').replace(/^-|-$/g,''));
t('lorem','Text','Lorem Ipsum Generator','ডামি টেক্সট (অনুচ্ছেদ সংখ্যা)','2',s=>{const n=parseInt(s);if(!(n>0&&n<=50))throw Error('১–৫০ দিন');return Array(n).fill('Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.').join('\n\n')});
// Color
t('hex-rgb','Color','HEX to RGB','#RRGGBB → rgb()','#0b6e4f',s=>`rgb(${rgb(s).join(', ')})`);
t('rgb-hex','Color','RGB to HEX','r, g, b → #hex','11, 110, 79',s=>{const p=s.split(/[ ,]+/).filter(Boolean).map(Number);if(p.length!=3||p.some(v=>!(v>=0&&v<=255)))throw Error('৩টি সংখ্যা (0–255) দিন');return'#'+p.map(v=>v.toString(16).padStart(2,'0')).join('')});
t('contrast','Color','WCAG Contrast Checker','টেক্সট বনাম ব্যাকগ্রাউন্ড','#333333',(s,o)=>{const a=lum(rgb(s)),b=lum(rgb(o)),r=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);return`অনুপাত: ${r.toFixed(2)}:1\nAA (সাধারণ): ${r>=4.5?'পাস':'ফেল'}\nAA (বড়): ${r>=3?'পাস':'ফেল'}\nAAA: ${r>=7?'পাস':'ফেল'}`},{label:'Background HEX',def:'#ffffff'});
// Security
t('sha256','Security','SHA-256 Hash','Web Crypto দিয়ে SHA-256','hello',s=>hash(s,'SHA-256'));
t('sha512','Security','SHA-512 Hash','Web Crypto দিয়ে SHA-512','hello',s=>hash(s,'SHA-512'));
t('hmac','Security','HMAC-SHA256','মেসেজ + secret key','message',async(s,o)=>{if(!o)throw Error('Key দিন');const k=await crypto.subtle.importKey('raw',enc.encode(o),{name:'HMAC',hash:'SHA-256'},false,['sign']);return hex(await crypto.subtle.sign('HMAC',k,enc.encode(s)))},{label:'Secret key (সংরক্ষিত হয় না)',def:''});
t('uuid','Security','UUID Generator','UUID v4 (কতগুলো)','3',s=>{const n=parseInt(s)||1;if(n<1||n>100)throw Error('১–১০০');return Array.from({length:n},()=>crypto.randomUUID()).join('\n')});
t('token','Security','Random Token Generator','নিরাপদ র‍্যান্ডম hex টোকেন (বাইট)','32',s=>{const n=parseInt(s);if(!(n>=1&&n<=256))throw Error('১–২৫৬');return hex(rnd(n))});
t('pass','Security','Password Generator','crypto.getRandomValues দিয়ে','16',s=>{const n=parseInt(s),c='abcdefghijkmnopqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789!@#$%^&*';if(!(n>=6&&n<=128))throw Error('৬–১২৮');const lim=256-256%c.length;let o='';while(o.length<n)for(const b of rnd(n*2))if(b<lim&&o.length<n)o+=c[b%c.length];return o});
t('jwt','Security','JWT Decoder','শুধু decode — signature যাচাই করে না','eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjMiLCJuYW1lIjoiU00ifQ.sig',s=>{const p=s.trim().split('.');if(p.length<2)throw Error('অবৈধ JWT');return'Header:\n'+JSON.stringify(J(b64d(p[0])),null,2)+'\n\nPayload:\n'+JSON.stringify(J(b64d(p[1])),null,2)+'\n\n⚠ Signature যাচাই করা হয়নি।'});
// Date
t('ts-date','Date','Timestamp to Date','Unix সেকেন্ড/মিলিসেকেন্ড → তারিখ','1767225600',s=>{let n=Number(s);if(isNaN(n))throw Error('সংখ্যা দিন');if(n<1e11)n*=1000;const d=new Date(n);return`UTC: ${d.toISOString()}\nLocal: ${d.toString()}`});
t('date-ts','Date','Date to Timestamp','তারিখ → Unix','2026-01-01T00:00:00Z',s=>{const d=new Date(s);if(isNaN(d))throw Error('অবৈধ তারিখ');return`সেকেন্ড: ${Math.floor(d/1000)}\nমিলিসেকেন্ড: ${d.getTime()}`});
t('pct','Date','Percentage Calculator','X এর Y%','200',(s,o)=>{const a=parseFloat(s),b=parseFloat(o);if(isNaN(a)||isNaN(b))throw Error('সংখ্যা দিন');return`${s} এর ${o}% = ${a*b/100}`},{label:'Percent',def:'15'});
// URL / API / SEO / Git
t('url-parse','URL','URL Parser','URL ভেঙে দেখায়','https://example.com:8080/a/b?x=1&y=2#top',s=>{const u=new URL(s.trim());return JSON.stringify({protocol:u.protocol,host:u.host,pathname:u.pathname,hash:u.hash,params:Object.fromEntries(u.searchParams)},null,2)});
t('status','API','HTTP Status Lookup','কোড → অর্থ','404',s=>{const m={200:'OK',201:'Created',204:'No Content',301:'Moved Permanently',302:'Found',304:'Not Modified',400:'Bad Request',401:'Unauthorized',403:'Forbidden',404:'Not Found',405:'Method Not Allowed',409:'Conflict',418:"I'm a teapot",422:'Unprocessable Entity',429:'Too Many Requests',500:'Internal Server Error',502:'Bad Gateway',503:'Service Unavailable',504:'Gateway Timeout'};if(!m[s.trim()])throw Error('তালিকায় নেই');return s.trim()+' '+m[s.trim()]});
t('curl','API','cURL Command Builder','URL → cURL','https://api.example.com/items',(s,o)=>{new URL(s.trim());const[m,...b]=(o||'GET').split(' ');return`curl -X ${m} '${s.trim()}'`+(b.length?` -H 'Content-Type: application/json' -d '${b.join(' ')}'`:'')},{label:'Method [body]',def:'POST {"a":1}'});
t('meta','SEO','Meta Tag Generator','Title | Description','My Page | A short description of my page',s=>{const[a,b]=s.split('|').map(x=>x.trim());if(!a||!b)throw Error('Title | Description ফরম্যাটে দিন');const e=x=>x.replace(/[&<>"]/g,c=>'&#'+c.charCodeAt(0)+';');return`<title>${e(a)}</title>\n<meta name="description" content="${e(b)}">\n<meta property="og:title" content="${e(a)}">\n<meta property="og:description" content="${e(b)}">`+(a.length>60?'\n<!-- Title ৬০ অক্ষরের বেশি -->':'')});
t('robots','SEO','Robots.txt Generator','Disallow পাথ কমা দিয়ে','/admin, /tmp',(s,o)=>`User-agent: *\n${s.split(',').map(x=>x.trim()).filter(Boolean).map(x=>'Disallow: '+x).join('\n')}${o?'\nSitemap: '+o:''}`,{label:'Sitemap URL',def:''});
t('gitignore','Git','.gitignore Generator','node / python / general','node',s=>({node:'node_modules/\n.env\ndist/\n*.log',python:'__pycache__/\n*.pyc\n.venv/\n.env',general:'.DS_Store\n.vscode/\n*.log'})[s.trim().toLowerCase()]||(()=>{throw Error('node, python বা general লিখুন')})());
t('regex','Regex','Regex Tester','ইনপুট টেক্সটে প্যাটার্ন মেলায়','a1 b22 c333',(s,o)=>{const i=o.lastIndexOf('/'),r=new RegExp(o.slice(0,i),o.slice(i+1)||'g');const m=[...s.matchAll(r.global?r:new RegExp(r.source,r.flags+'g'))];return m.length?m.map(x=>`@${x.index}: ${x[0]}`).join('\n'):'কোনো মিল নেই'},{label:'/pattern/flags (যেমন \\d+/g)',def:'\\d+/g'});
// ---- UI ----
const $=(s,r=document)=>r.querySelector(s),app=$('#app');
const ls={get(k,d){try{return JSON.parse(localStorage.getItem(k))??d}catch{return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch{}}};
const el=(tag,p={},...kids)=>{const e=document.createElement(tag);Object.assign(e,p);e.append(...kids);return e};
let cat='All';
function toggleFav(id){const f=ls.get('fav',[]);const i=f.indexOf(id);i<0?f.push(id):f.splice(i,1);ls.set('fav',f);route()}
function card(x){const fav=ls.get('fav',[]).includes(x.id);const f=el('button',{className:'f',textContent:fav?'★':'☆',title:'Favorite'});f.onclick=()=>toggleFav(x.id);
return el('div',{className:'card'},el('a',{href:'#/tool/'+x.id,textContent:x.name}),el('small',{textContent:x.desc}),el('div',{},el('small',{textContent:x.cat}),f))}
function home(){app.replaceChildren();const q=$('#q').value.toLowerCase().trim();
app.append(el('h1',{textContent:'SM Tools Hub'}),el('p',{className:'mut',textContent:`${T.length}টি ডেভেলপার টুল — ব্রাউজারেই চলে, ডাটা বাইরে যায় না।`}));
const cats=['All','★ Favorites','Recent',...new Set(T.map(x=>x.cat))];
app.append(el('div',{className:'chips'},...cats.map(c=>{const b=el('button',{textContent:c,className:c==cat?'on':''});b.onclick=()=>{cat=c;home()};return b})));
const fav=ls.get('fav',[]),rec=ls.get('rec',[]);
let l=T.filter(x=>cat=='All'||x.cat==cat||(cat=='★ Favorites'&&fav.includes(x.id))||(cat=='Recent'&&rec.includes(x.id)));
if(q)l=l.filter(x=>(x.name+x.desc+x.cat).toLowerCase().includes(q));
app.append(l.length?el('div',{className:'grid'},...l.map(card)):el('p',{className:'mut',textContent:q?`"${q}" এর জন্য কোনো টুল পাওয়া যায়নি।`:'এখানে এখনো কিছু নেই।'}))}
function tool(id){const x=T.find(v=>v.id==id);if(!x){app.replaceChildren(el('p',{className:'err',textContent:'টুল পাওয়া যায়নি।'}),el('a',{href:'#/',textContent:'← সব টুল'}));return}
ls.set('rec',[id,...ls.get('rec',[]).filter(v=>v!=id)].slice(0,8));
const inp=el('textarea',{placeholder:'এখানে ইনপুট দিন',value:x.sample}),opt=x.opt?el('input',{value:x.opt.def,'aria-label':x.opt.label}):null,err=el('div',{className:'err',role:'alert'}),out=el('pre',{}),fr=el('iframe',{sandbox:'',title:'Preview',hidden:true});
const btn=(t,fn,c='')=>{const b=el('button',{textContent:t,className:c});b.onclick=fn;return b};
const run=async()=>{err.textContent='';if(!inp.value.trim()){err.textContent='ইনপুট খালি। নমুনা ব্যবহার করুন বা কিছু লিখুন।';return}
if(inp.value.length>2e6){err.textContent='ইনপুট খুব বড় (সর্বোচ্চ ২ MB)।';return}
try{const r=String(await x.fn(inp.value,opt?opt.value:''));out.textContent=r;if(x.html){fr.hidden=false;fr.srcdoc=r}}catch(e){out.textContent='';err.textContent='ত্রুটি: '+e.message}};
const copy=async()=>{try{await navigator.clipboard.writeText(out.textContent);err.textContent=''}catch{err.textContent='কপি করা যায়নি; হাতে সিলেক্ট করুন।'}};
const dl=()=>{const a=el('a',{href:URL.createObjectURL(new Blob([out.textContent])),download:x.id+'.txt'});a.click();URL.revokeObjectURL(a.href)};
app.replaceChildren(el('a',{href:'#/',textContent:'← সব টুল'}),el('h1',{textContent:x.name}),el('p',{className:'mut',textContent:x.desc+' · সব প্রসেসিং ব্রাউজারে হয়।'}),
inp,...(opt?[el('label',{className:'mut',textContent:opt.label+' '}),opt]:[]),
el('div',{className:'row'},btn('চালান',run,'p'),btn('নমুনা',()=>{inp.value=x.sample}),btn('কপি',copy),btn('ডাউনলোড',dl),btn('মুছুন',()=>{inp.value='';out.textContent='';err.textContent=''})),err,out,fr,
el('h2',{textContent:'ব্যবহারবিধি'}),el('p',{textContent:'ইনপুট দিন (বা “নমুনা” চাপুন), তারপর “চালান”। ফলাফল কপি বা ডাউনলোড করা যাবে।'}),
el('h2',{textContent:'সম্পর্কিত টুল'}),el('div',{className:'grid'},...T.filter(v=>v.cat==x.cat&&v.id!=id).slice(0,3).map(card)))}
function route(){const m=location.hash.match(/^#\/tool\/(.+)$/);m?tool(m[1]):home()}
$('#q').oninput=()=>{if(location.hash!=='#/')location.hash='#/';else home()};
const th=ls.get('theme','light');document.documentElement.dataset.theme=th;
$('#theme').onclick=()=>{const n=document.documentElement.dataset.theme=='dark'?'light':'dark';document.documentElement.dataset.theme=n;ls.set('theme',n)};
addEventListener('hashchange',route);route();
