(function(){
'use strict';
var s=document.createElement('style');
s.textContent=`
#vip-toggle{position:fixed;bottom:20px;right:20px;width:60px;height:60px;border-radius:50%;background:linear-gradient(135deg,#25D366,#128C7E);border:none;cursor:pointer;z-index:10000;box-shadow:0 4px 15px rgba(37,211,102,.4);display:flex;align-items:center;justify-content:center;transition:.3s;font-size:26px;color:#fff}
#vip-toggle:hover{transform:scale(1.1)}
#vip-toggle .badge{position:absolute;top:-2px;right:-2px;background:#e74c3c;color:#fff;border-radius:50%;width:20px;height:20px;font-size:11px;display:flex;align-items:center;justify-content:center}
#vip-chat{position:fixed;bottom:90px;right:20px;width:370px;max-height:540px;background:#e5ddd5;border-radius:14px;z-index:10001;display:none;flex-direction:column;overflow:hidden;box-shadow:0 8px 30px rgba(0,0,0,.25);font-family:Tajawal,sans-serif}
#vip-chat.open{display:flex}
.vip-hdr{background:linear-gradient(135deg,#075E54,#128C7E);color:#fff;padding:12px 15px;display:flex;align-items:center;gap:10px}
.vip-hdr .av{width:38px;height:38px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;font-size:18px}
.vip-hdr .inf{flex:1}.vip-hdr .inf b{font-size:14px}.vip-hdr .inf small{font-size:10px;opacity:.7;display:block}
.vip-hdr .cls{background:none;border:none;color:#fff;font-size:20px;cursor:pointer}
#vip-msgs{flex:1;overflow-y:auto;padding:10px;max-height:370px}
.bot-m{background:#fff;border-radius:0 12px 12px;padding:10px 12px;margin:4px 0;max-width:85%;font-size:13px;line-height:1.6;box-shadow:0 1px 2px rgba(0,0,0,.08);word-wrap:break-word}
.usr-m{background:#DCF8C6;border-radius:12px 0 12px 12px;padding:10px 12px;margin:4px 0 4px auto;max-width:85%;font-size:13px;text-align:right}
.bot-m .tm{font-size:9px;color:#999;margin-top:3px;display:block}
.qb{display:flex;flex-wrap:wrap;gap:5px;margin-top:6px}
.qb button{background:#f0f0f0;border:1px solid #ddd;border-radius:18px;padding:5px 12px;font-size:11px;cursor:pointer;transition:.2s;font-family:Tajawal,sans-serif}
.qb button:hover{background:#25D366;color:#fff;border-color:#25D366}
.sc{background:#fff;border-radius:10px;padding:10px;margin:5px 0;border-right:3px solid #25D366;cursor:pointer;transition:.2s}
.sc:hover{background:#f0fff0;transform:translateX(-2px)}
.sc .si{font-size:22px}.sc .sn{font-weight:700;color:#075E54;font-size:13px}.sc .sd{font-size:10px;color:#666;margin-top:2px}
.typ{display:flex;gap:4px;padding:8px 12px;background:#fff;border-radius:0 12px 12px;max-width:60px;margin:3px 0}
.typ span{width:7px;height:7px;border-radius:50%;background:#999;animation:tb 1.4s infinite}
.typ span:nth-child(2){animation-delay:.2s}.typ span:nth-child(3){animation-delay:.4s}
@keyframes tb{0%,80%,100%{opacity:.3}40%{opacity:1}}
#vip-inp{display:flex;padding:8px;background:#f0f0f0;gap:5px}
#vip-inp input{flex:1;border:none;border-radius:20px;padding:8px 12px;font-size:13px;font-family:Tajawal,sans-serif;outline:none}
#vip-inp button{background:#25D366;color:#fff;border:none;border-radius:50%;width:36px;height:36px;cursor:pointer;font-size:16px}
.si-bar{display:flex;justify-content:center;gap:5px;margin:6px 0}
.si-dot{width:9px;height:9px;border-radius:50%;background:#ddd;transition:.3s}.si-dot.act{background:#25D366;transform:scale(1.2)}.si-dot.dn{background:#128C7E}
.ff{background:#fff;border-radius:10px;padding:10px;margin:5px 0;border-right:3px solid #3498db}
.ff label{display:block;font-weight:700;color:#075E54;font-size:12px;margin-bottom:4px}
.ff input{width:90%;border:1px solid #ddd;border-radius:8px;padding:7px 9px;font-size:13px;font-family:Tajawal,sans-serif;direction:rtl}
.ff .ht{font-size:9px;color:#999;margin-top:2px}.ff .er{font-size:10px;color:#e74c3c;margin-top:2px;display:none}
.dc{background:#f8f0ff;border-radius:10px;padding:8px;margin:4px 0;border-right:3px solid #9b59b6}
.dc b{color:#8e44ad;font-size:12px}.dc small{font-size:11px;color:#666;display:block;margin-top:2px}
.smc{background:#f0fff4;border-radius:10px;padding:10px;margin:5px 0;border:2px solid #25D366}
.smc h4{color:#075E54;margin:0 0 6px;font-size:13px}.smc .sr{display:flex;justify-content:space-between;padding:3px 0;border-bottom:1px dashed #eee;font-size:11px}
.smc .sl{color:#666}.smc .sv{font-weight:700;color:#333}
.cb{display:flex;gap:6px;margin-top:6px;justify-content:center}
.cb button{padding:7px 18px;border-radius:18px;border:none;cursor:pointer;font-family:Tajawal,sans-serif;font-weight:700;font-size:12px}
.cb .cy{background:#25D366;color:#fff}.cb .cn{background:#e74c3c;color:#fff}
@media(max-width:480px){#vip-chat{width:calc(100% - 20px);right:10px;bottom:80px;max-height:70vh}#vip-toggle{width:50px;height:50px;font-size:22px}}
`;
document.head.appendChild(s);
var d=document.createElement('div');
d.innerHTML='<button id="vip-toggle" onclick="B.toggle()"><span>\u{1F4AC}</span><span class="badge">1</span></button><div id="vip-chat"><div class="vip-hdr"><div class="av">\u{1F916}</div><div class="inf"><b>VIP360 - \u0627\u0644\u0645\u0633\u0627\u0639\u062F</b><small>\u0645\u062A\u0635\u0644 \u0627\u0644\u0622\u0646</small></div><button class="cls" onclick="B.toggle()">\u00D7</button></div><div id="vip-msgs"></div><div id="vip-inp"><input type="text" placeholder="\u0627\u0643\u062A\u0628 \u0631\u0633\u0627\u0644\u062A\u0643..." onkeypress="if(event.key===\'Enter\')B.userMsg()"><button onclick="B.userMsg()">\u27A4</button></div></div>';
document.body.appendChild(d);
if(!document.querySelector('link[href*="Tajawal"]')){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&display=swap';document.head.appendChild(l)}
var B=window.VIP360Bot={
ms:null,ph:'966545888559',st:false,
gov:[
{i:'daman',n:'\u0627\u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A \u0627\u0644\u0645\u0637\u0648\u0631',ic:'\u{1F3E6}',d:'\u062A\u0633\u062C\u064A\u0644 \u0648\u0645\u062A\u0627\u0628\u0639\u0629'},
{i:'citizen',n:'\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0648\u0627\u0637\u0646',ic:'\u{1F464}',d:'\u062A\u0633\u062C\u064A\u0644 \u0648\u062A\u062D\u062F\u064A\u062B'},
{i:'hafez',n:'\u062D\u0627\u0641\u0632',ic:'\u{1F4B0}',d:'\u062F\u0639\u0645 \u0627\u0644\u0628\u0627\u062D\u062B\u064A\u0646 \u0639\u0646 \u0639\u0645\u0644'},
{i:'sand',n:'\u0633\u0627\u0646\u062F',ic:'\u{1F6E1}',d:'\u0627\u0644\u062A\u0623\u0645\u064A\u0646 \u0636\u062F \u0627\u0644\u062A\u0639\u0637\u0644'},
{i:'qiyas',n:'\u0642\u064A\u0627\u0633/\u062C\u062F\u0627\u0631\u0627\u062A',ic:'\u{1F4DD}',d:'\u0627\u062E\u062A\u0628\u0627\u0631\u0627\u062A \u0627\u0644\u0642\u064A\u0627\u0633'},
{i:'tamheer',n:'\u062A\u0645\u0647\u064A\u0631',ic:'\u{1F393}',d:'\u062A\u062F\u0631\u064A\u0628 \u0639\u0644\u0649 \u0631\u0623\u0633 \u0627\u0644\u0639\u0645\u0644'},
{i:'tawteen',n:'\u062A\u0648\u0637\u064A\u0646',ic:'\u{1F3E2}',d:'\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u062A\u0648\u0637\u064A\u0646'}
],
pro:[
{i:'store',n:'\u0645\u062A\u062C\u0631 \u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A',ic:'\u{1F6D2}',d:'\u062A\u0635\u0645\u064A\u0645 \u0648\u0625\u0637\u0644\u0627\u0642 \u0645\u062A\u062C\u0631\u0643'},
{i:'courses',n:'\u062F\u0648\u0631\u0627\u062A \u0627\u0644\u062A\u062C\u0627\u0631\u0629',ic:'\u{1F4DA}',d:'\u062F\u0648\u0631\u0627\u062A \u0627\u0644\u062A\u062C\u0627\u0631\u0629 \u0627\u0644\u0625\u0644\u0643\u062A\u0631\u0648\u0646\u064A\u0629'},
{i:'teach',n:'\u0627\u0644\u062A\u062F\u0631\u064A\u0633 \u0645\u0646 \u0627\u0644\u0645\u0646\u0632\u0644',ic:'\u{1F3E0}',d:'\u062A\u062F\u0631\u064A\u0633 \u0639\u0646 \u0628\u0639\u062F'},
{i:'marketing',n:'\u0627\u0644\u062A\u0633\u0648\u064A\u0642 \u0627\u0644\u0631\u0642\u0645\u064A',ic:'\u{1F4F1}',d:'\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u062A\u0633\u0648\u064A\u0642'},
{i:'followers',n:'\u0632\u064A\u0627\u062F\u0629 \u0627\u0644\u0645\u062A\u0627\u0628\u0639\u064A\u0646',ic:'\u{1F4C8}',d:'\u0632\u064A\u0627\u062F\u0629 \u0645\u062A\u0627\u0628\u0639\u064A\u0646'},
{i:'cv',n:'\u0627\u0644\u0633\u064A\u0631\u0629 \u0627\u0644\u0630\u0627\u062A\u064A\u0629',ic:'\u{1F4C4}',d:'\u0633\u064A\u0631\u0629 \u0630\u0627\u062A\u064A\u0629 \u0627\u062D\u062A\u0631\u0627\u0641\u064A\u0629'},
{i:'jobs',n:'\u0645\u062A\u0627\u0628\u0639\u0629 \u0627\u0644\u062A\u0648\u0638\u064A\u0641',ic:'\u{1F4BC}',d:'\u062E\u062F\u0645\u0627\u062A \u0627\u0644\u062A\u0648\u0638\u064A\u0641'},
{i:'consult',n:'\u0627\u0633\u062A\u0634\u0627\u0631\u0627\u062A',ic:'\u{1F4AC}',d:'\u0627\u0633\u062A\u0634\u0627\u0631\u0627\u062A \u0645\u0647\u0646\u064A\u0629'},
{i:'newjobs',n:'\u062C\u062F\u064A\u062F \u0627\u0644\u0648\u0638\u0627\u0626\u0641',ic:'\u{1F195}',d:'\u0623\u062D\u062F\u062B \u0627\u0644\u0648\u0638\u0627\u0626\u0641'}
],
df:[
{k:'name',l:'\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644',h:'\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u062B\u0644\u0627\u062B\u064A',v:function(x){return x.length>=3}},
{k:'nid',l:'\u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u062F\u0646\u064A',h:'10 \u0623\u0631\u0642\u0627\u0645',v:function(x){return /^[0-9]{10}$/.test(x)}},
{k:'dob',l:'\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F',h:'15/06/1410',v:function(x){return /^\d{2}\/\d{2}\/\d{4}$/.test(x)}},
{k:'phone',l:'\u0631\u0642\u0645 \u0627\u0644\u062C\u0648\u0627\u0644',h:'05xxxxxxxx',v:function(x){return /^05[0-9]{8}$/.test(x)}},
{k:'iban',l:'\u0631\u0642\u0645 \u0627\u0644\u0622\u064A\u0628\u0627\u0646',h:'SA + 22 \u0631\u0642\u0645',v:function(x){return /^SA[0-9]{22}$/.test(x.toUpperCase())}},
{k:'addr',l:'\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0633\u0643\u0646',h:'\u0627\u0644\u0645\u062F\u064A\u0646\u0629-\u0627\u0644\u062D\u064A-\u0627\u0644\u0634\u0627\u0631\u0639',v:function(x){return x.length>=5}}
],
dd:{},ds:0,deps:[],cd:{},
init:function(){this.ms=document.getElementById('vip-msgs')},
toggle:function(){
var c=document.getElementById('vip-chat'),b=document.querySelector('#vip-toggle .badge');
if(c.classList.contains('open'))c.classList.remove('open');
else{c.classList.add('open');if(b)b.style.display='none';if(!this.st){this.st=true;this.init();this.welcome()}}
},
addM:function(h,u){
var d=document.createElement('div');d.className=u?'usr-m':'bot-m';
var t=new Date(),ts=String(t.getHours()).padStart(2,'0')+':'+String(t.getMinutes()).padStart(2,'0');
d.innerHTML=h+(u?'':'<span class="tm">'+ts+'</span>');this.ms.appendChild(d);this.ms.scrollTop=this.ms.scrollHeight;return d
},
typ:function(cb){
var self=this,t=document.createElement('div');t.className='typ';
t.innerHTML='<span></span><span></span><span></span>';self.ms.appendChild(t);self.ms.scrollTop=self.ms.scrollHeight;
setTimeout(function(){t.remove();cb()},700+Math.random()*400)
},
mk:function(items){return '<div class="qb">'+items.map(function(i){return '<button onclick="'+i.a+'">'+i.l+'</button>'}).join('')+'</div>'},
welcome:function(){var self=this;self.typ(function(){self.addM('\u0623\u0647\u0644\u0627\u064B \u0648\u0633\u0647\u0644\u0627\u064B \u0628\u0643 \u0641\u064A <b>VIP360</b> \u{1F44B}<br>\u0623\u0646\u0627 \u0627\u0644\u0645\u0633\u0627\u0639\u062F \u0627\u0644\u0630\u0643\u064A');self.mainMenu()})},
mainMenu:function(){var self=this;self.typ(function(){self.addM('\u0627\u062E\u062A\u0631:'+self.mk([{l:'\u{1F3E6} \u062D\u0643\u0648\u0645\u064A\u0629',a:'B.showGov()'},{l:'\u{1F4BC} \u0645\u0647\u0646\u064A\u0629',a:'B.showPro()'},{l:'\u{1F195} \u0648\u0638\u0627\u0626\u0641',a:'B.showJobs()'},{l:'\u2753 FAQ',a:'B.showFAQ()'},{l:'\u{1F4DE} \u062A\u0648\u0627\u0635\u0644',a:'B.showContact()'}]))})},
showGov:function(){var self=this;self.addM('\u{1F3E6} \u062D\u0643\u0648\u0645\u064A\u0629',true);self.typ(function(){var c=self.gov.map(function(s){return '<div class="sc" onclick="B.sel(\''+s.i+'\')"><div class="si">'+s.ic+'</div><div class="sn">'+s.n+'</div><div class="sd">'+s.d+'</div></div>'}).join('');self.addM(c+self.mk([{l:'\u{1F519} \u0631\u062C\u0648\u0639',a:'B.mainMenu()'}]))})},
showPro:function(){var self=this;self.addM('\u{1F4BC} \u0645\u0647\u0646\u064A\u0629',true);self.typ(function(){var c=self.pro.map(function(s){return '<div class="sc" onclick="B.sel(\''+s.i+'\')"><div class="si">'+s.ic+'</div><div class="sn">'+s.n+'</div><div class="sd">'+s.d+'</div></div>'}).join('');self.addM(c+self.mk([{l:'\u{1F519} \u0631\u062C\u0648\u0639',a:'B.mainMenu()'}]))})},
sel:function(id){
if(id==='daman'){this.startDaman();return}
var s=this.gov.concat(this.pro).find(function(x){return x.i===id});if(!s)return;
this.addM(s.ic+' '+s.n,true);var self=this;
if(id==='newjobs'){self.showJobs();return}
self.typ(function(){self.addM('\u062A\u0645 \u0627\u062E\u062A\u064A\u0627\u0631 <b>'+s.n+'</b> \u2705<br>\u0644\u0625\u062A\u0645\u0627\u0645:'+self.mk([{l:'\u{1F4F2} \u0648\u0627\u062A\u0633\u0627\u0628',a:'B.wa("'+s.n+'")'},{l:'\u{1F4DD} \u0646\u0645\u0648\u0630\u062C',a:'B.goForm()'},{l:'\u{1F519} \u0631\u062C\u0648\u0639',a:'B.mainMenu()'}]))})
},
showJobs:function(){var self=this;self.addM('\u{1F195} \u0648\u0638\u0627\u0626\u0641',true);self.typ(function(){var tk=document.querySelector('.news-ticker');if(tk){var items=tk.querySelectorAll('span,a');if(items.length>0){var jl=Array.from(items).slice(0,8).map(function(e){return '\u{1F4CC} '+e.textContent.trim()}).join('<br>');self.addM('<b>\u0623\u062D\u062F\u062B \u0627\u0644\u0648\u0638\u0627\u0626\u0641:</b><br>'+jl)}else self.addM('\u0644\u0627 \u062A\u0648\u062C\u062F \u0648\u0638\u0627\u0626\u0641')}else self.addM('\u062A\u0627\u0628\u0639 \u0627\u0644\u0648\u0638\u0627\u0626\u0641 \u0639\u0628\u0631 \u0627\u0644\u0645\u0648\u0642\u0639');self.addM(self.mk([{l:'\u{1F4F2} \u0648\u0627\u062A\u0633\u0627\u0628',a:'B.wa("\u0648\u0638\u0627\u0626\u0641")'},{l:'\u{1F519} \u0631\u062C\u0648\u0639',a:'B.mainMenu()'}]))})},
showContact:function(){var self=this;self.addM('\u{1F4DE} \u062A\u0648\u0627\u0635\u0644',true);self.typ(function(){self.addM('<b>\u{1F4F1}</b> <a href="https://wa.me/'+self.ph+'" target="_blank" style="color:#25D366">+'+self.ph+'</a>'+self.mk([{l:'\u{1F4F2} \u0631\u0627\u0633\u0644\u0646\u0627',a:'B.wa("\u062A\u0648\u0627\u0635\u0644")'},{l:'\u{1F519} \u0631\u062C\u0648\u0639',a:'B.mainMenu()'}]))})},
showFAQ:function(){var self=this;self.addM('\u2753 FAQ',true);self.typ(function(){self.addM(self.mk([{l:'\u0645\u0627 \u0627\u0644\u062E\u062F\u0645\u0627\u062A\u061F',a:'B.faq(1)'},{l:'\u0643\u064A\u0641 \u0623\u0633\u062C\u0644\u061F',a:'B.faq(2)'},{l:'\u0645\u062C\u0627\u0646\u064A\u0629\u061F',a:'B.faq(3)'},{l:'\u0643\u0645 \u062A\u0633\u062A\u063A\u0631\u0642\u061F',a:'B.faq(4)'},{l:'\u{1F519} \u0631\u062C\u0648\u0639',a:'B.mainMenu()'}]))})},
faq:function(n){var a={1:'\u062E\u062F\u0645\u0627\u062A \u062D\u0643\u0648\u0645\u064A\u0629 \u0648\u0645\u0647\u0646\u064A\u0629 \u0645\u062A\u0639\u062F\u062F\u0629',2:'\u0639\u0628\u0631 \u0627\u0644\u0646\u0645\u0648\u0630\u062C \u0623\u0648 \u0648\u0627\u062A\u0633\u0627\u0628',3:'\u0628\u0639\u0636\u0647\u0627 \u0645\u062C\u0627\u0646\u064A \u0648\u0628\u0639\u0636\u0647\u0627 \u0628\u0631\u0633\u0648\u0645',4:'24-48 \u0633\u0627\u0639\u0629'};var self=this;self.typ(function(){self.addM(a[n]||'\u062A\u0648\u0627\u0635\u0644 \u0645\u0639\u0646\u0627');self.addM(self.mk([{l:'\u2753 \u0623\u062E\u0631\u0649',a:'B.showFAQ()'},{l:'\u{1F519} \u0642\u0627\u0626\u0645\u0629',a:'B.mainMenu()'}]))})},
wa:function(s){window.open('https://wa.me/'+this.ph+'?text='+encodeURIComponent('\u0645\u0631\u062D\u0628\u0627, \u0623\u0631\u063A\u0628 \u0641\u064A: '+s),'_blank')},
goForm:function(){var f=document.getElementById('booking')||document.querySelector('form');if(f){f.scrollIntoView({behavior:'smooth'});this.addM('\u2B07 \u0627\u0644\u0646\u0645\u0648\u0630\u062C \u0628\u0627\u0644\u0623\u0633\u0641\u0644')}else this.addM('\u062A\u0648\u0627\u0635\u0644 \u0648\u0627\u062A\u0633\u0627\u0628')},
// Daman Social Security Form
startDaman:function(){
this.addM('\u{1F3E6} \u0627\u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A',true);
this.dd={};this.ds=0;this.deps=[];this.cd={};
var self=this;self.typ(function(){
self.addM('\u0633\u0623\u0633\u0627\u0639\u062F\u0643 \u0641\u064A \u062A\u0633\u062C\u064A\u0644 \u0627\u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A \u{1F4CB}<br>\u0623\u062D\u062A\u0627\u062C \u0628\u0639\u0636 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A:');
self.showDF()})
},
showSI:function(){
var h='<div class="si-bar">';
for(var i=0;i<this.df.length;i++){
var cls=i<this.ds?'si-dot dn':i===this.ds?'si-dot act':'si-dot';
h+='<div class="'+cls+'"></div>'}
return h+'</div>'
},
showDF:function(){
var f=this.df[this.ds];
this.addM(this.showSI()+'<div class="ff"><label>'+f.l+'</label><input type="text" id="daman-input" placeholder="'+f.h+'" onkeypress="if(event.key===\'Enter\')B.subDF()"><div class="ht">'+f.h+'</div><div class="er" id="daman-err">\u0642\u064A\u0645\u0629 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629</div></div>'+this.mk([{l:'\u2705 \u062A\u0623\u0643\u064A\u062F',a:'B.subDF()'},{l:'\u274C \u0625\u0644\u063A\u0627\u0621',a:'B.mainMenu()'}]))
},
subDF:function(){
var inp=document.getElementById('daman-input');
if(!inp)return;
var val=inp.value.trim();
var f=this.df[this.ds];
if(!f.v(val)){
var er=document.getElementById('daman-err');
if(er){er.style.display='block';er.textContent='\u0642\u064A\u0645\u0629 \u063A\u064A\u0631 \u0635\u062D\u064A\u062D\u0629 - '+f.h}
return}
this.dd[f.k]=f.k==='iban'?val.toUpperCase():val;
this.addM(f.l+': '+val,true);
this.ds++;
if(this.ds<this.df.length){var self=this;self.typ(function(){self.showDF()})}
else{this.askDeps()}
},
askDeps:function(){
var self=this;self.typ(function(){
self.addM('\u0647\u0644 \u0644\u062F\u064A\u0643 \u062A\u0627\u0628\u0639\u064A\u0646 \u063A\u064A\u0631 \u0645\u062A\u0632\u0648\u062C\u064A\u0646\u061F'+self.mk([{l:'\u2705 \u0646\u0639\u0645',a:'B.addDep()'},{l:'\u274C \u0644\u0627',a:'B.finDaman()'}]))
})
},
addDep:function(){
this.cd={step:0};
var self=this;self.typ(function(){
self.addM('\u{1F464} \u0628\u064A\u0627\u0646\u0627\u062A \u0627\u0644\u062A\u0627\u0628\u0639 '+(self.deps.length+1)+':<div class="ff"><label>\u0627\u0633\u0645 \u0627\u0644\u062A\u0627\u0628\u0639</label><input type="text" id="dep-input" placeholder="\u0627\u0644\u0627\u0633\u0645 \u0627\u0644\u0643\u0627\u0645\u0644" onkeypress="if(event.key===\'Enter\')B.saveDep()"><div class="er" id="dep-err"></div></div>'+self.mk([{l:'\u2705 \u062A\u0623\u0643\u064A\u062F',a:'B.saveDep()'}]))
})
},
saveDep:function(){
var inp=document.getElementById('dep-input');
if(!inp)return;
var val=inp.value.trim();
if(this.cd.step===0){
if(val.length<3){var e=document.getElementById('dep-err');if(e){e.style.display='block';e.textContent='\u0623\u062F\u062E\u0644 \u0627\u0644\u0627\u0633\u0645'}return}
this.cd.name=val;this.cd.step=1;
this.addM('\u0627\u0644\u0627\u0633\u0645: '+val,true);
var self=this;self.typ(function(){
self.addM('<div class="ff"><label>\u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u062F\u0646\u064A \u0644\u0644\u062A\u0627\u0628\u0639</label><input type="text" id="dep-input" placeholder="10 \u0623\u0631\u0642\u0627\u0645" onkeypress="if(event.key===\'Enter\')B.saveDep()"><div class="er" id="dep-err"></div></div>'+self.mk([{l:'\u2705 \u062A\u0623\u0643\u064A\u062F',a:'B.saveDep()'}]))})
}else if(this.cd.step===1){
if(!/^[0-9]{10}$/.test(val)){var e=document.getElementById('dep-err');if(e){e.style.display='block';e.textContent='10 \u0623\u0631\u0642\u0627\u0645'}return}
this.cd.nid=val;this.cd.step=2;
this.addM('\u0627\u0644\u0633\u062C\u0644: '+val,true);
var self=this;self.typ(function(){
self.addM('<div class="ff"><label>\u062A\u0627\u0631\u064A\u062E \u0645\u064A\u0644\u0627\u062F \u0627\u0644\u062A\u0627\u0628\u0639</label><input type="text" id="dep-input" placeholder="\u0645\u062B\u0627\u0644: 01/03/1445" onkeypress="if(event.key===\'Enter\')B.saveDep()"><div class="er" id="dep-err"></div></div>'+self.mk([{l:'\u2705 \u062A\u0623\u0643\u064A\u062F',a:'B.saveDep()'}]))})
}else{
if(!/^\d{2}\/\d{2}\/\d{4}$/.test(val)){var e=document.getElementById('dep-err');if(e){e.style.display='block';e.textContent='\u0635\u064A\u063A\u0629: dd/mm/yyyy'}return}
this.cd.dob=val;
this.addM('\u0627\u0644\u062A\u0627\u0631\u064A\u062E: '+val,true);
this.deps.push({name:this.cd.name,nid:this.cd.nid,dob:this.cd.dob});
var self=this;self.typ(function(){
self.addM('<div class="dc"><b>\u{1F464} '+self.cd.name+'</b><small>\u0627\u0644\u0633\u062C\u0644: '+self.cd.nid+' | \u0627\u0644\u0645\u064A\u0644\u0627\u062F: '+self.cd.dob+'</small></div>');
self.moreDeps()})
}
},
moreDeps:function(){
var self=this;self.typ(function(){
self.addM('\u0647\u0644 \u064A\u0648\u062C\u062F \u062A\u0627\u0628\u0639 \u0622\u062E\u0631\u061F'+self.mk([{l:'\u2705 \u0646\u0639\u0645',a:'B.addDep()'},{l:'\u274C \u0625\u0646\u0647\u0627\u0621',a:'B.finDaman()'}]))
})
},
finDaman:function(){
var self=this;self.typ(function(){
var h='<div class="smc"><h4>\u{1F4CB} \u0645\u0644\u062E\u0635 \u0627\u0644\u0628\u064A\u0627\u0646\u0627\u062A</h4>';
var labels={name:'\u0627\u0644\u0627\u0633\u0645',nid:'\u0627\u0644\u0633\u062C\u0644 \u0627\u0644\u0645\u062F\u0646\u064A',dob:'\u062A\u0627\u0631\u064A\u062E \u0627\u0644\u0645\u064A\u0644\u0627\u062F',phone:'\u0627\u0644\u062C\u0648\u0627\u0644',iban:'\u0627\u0644\u0622\u064A\u0628\u0627\u0646',addr:'\u0627\u0644\u0639\u0646\u0648\u0627\u0646'};
for(var k in labels){if(self.dd[k])h+='<div class="sr"><span class="sl">'+labels[k]+'</span><span class="sv">'+self.dd[k]+'</span></div>'}
if(self.deps.length>0){
h+='<div class="sr"><span class="sl">\u0627\u0644\u062A\u0627\u0628\u0639\u064A\u0646</span><span class="sv">'+self.deps.length+'</span></div>';
self.deps.forEach(function(dep,i){h+='<div class="dc"><b>'+dep.name+'</b><small>\u0633\u062C\u0644: '+dep.nid+' | \u0645\u064A\u0644\u0627\u062F: '+dep.dob+'</small></div>'})}
h+='</div>';
self.addM(h+'<div class="cb"><button class="cy" onclick="B.sendWA()">\u2705 \u062A\u0623\u0643\u064A\u062F \u0648\u0625\u0631\u0633\u0627\u0644</button><button class="cn" onclick="B.startDaman()">\u{1F504} \u062A\u0639\u062F\u064A\u0644</button></div>')
})
},
sendWA:function(){
var msg='*\u0637\u0644\u0628 \u0627\u0644\u0636\u0645\u0627\u0646 \u0627\u0644\u0627\u062C\u062A\u0645\u0627\u0639\u064A*\n';
msg+='\u0627\u0644\u0627\u0633\u0645: '+this.dd.name+'\n';
msg+='\u0627\u0644\u0633\u062C\u0644: '+this.dd.nid+'\n';
msg+='\u0627\u0644\u0645\u064A\u0644\u0627\u062F: '+this.dd.dob+'\n';
msg+='\u0627\u0644\u062C\u0648\u0627\u0644: '+this.dd.phone+'\n';
msg+='\u0627\u0644\u0622\u064A\u0628\u0627\u0646: '+this.dd.iban+'\n';
msg+='\u0627\u0644\u0639\u0646\u0648\u0627\u0646: '+this.dd.addr+'\n';
if(this.deps.length>0){
msg+='\n*\u0627\u0644\u062A\u0627\u0628\u0639\u064A\u0646 ('+this.deps.length+'):*\n';
this.deps.forEach(function(dep,i){msg+=(i+1)+'. '+dep.name+' | \u0633\u062C\u0644: '+dep.nid+' | \u0645\u064A\u0644\u0627\u062F: '+dep.dob+'\n'})}
window.open('https://wa.me/'+this.ph+'?text='+encodeURIComponent(msg),'_blank');
this.addM('\u2705 \u062A\u0645 \u0641\u062A\u062D \u0648\u0627\u062A\u0633\u0627\u0628'+this.mk([{l:'\u{1F519} \u0627\u0644\u0642\u0627\u0626\u0645\u0629',a:'B.mainMenu()'}]))
},
// User text input handler
userMsg:function(){
var inp=document.querySelector('#vip-inp input');if(!inp)return;
var txt=inp.value.trim();if(!txt)return;
inp.value='';this.addM(txt,true);
var self=this;var t=txt.toLowerCase();
var kw={
'\u0636\u0645\u0627\u0646':'daman','\u0627\u0644\u0636\u0645\u0627\u0646':'daman','\u062D\u0633\u0627\u0628 \u0627\u0644\u0645\u0648\u0627\u0637\u0646':'citizen','\u0627\u0644\u0645\u0648\u0627\u0637\u0646':'citizen',
'\u062D\u0627\u0641\u0632':'hafez','\u0633\u0627\u0646\u062F':'sand','\u0642\u064A\u0627\u0633':'qiyas','\u062C\u062F\u0627\u0631\u0627\u062A':'qiyas',
'\u062A\u0645\u0647\u064A\u0631':'tamheer','\u062A\u0648\u0637\u064A\u0646':'tawteen',
'\u0645\u062A\u062C\u0631':'store','\u062F\u0648\u0631\u0627\u062A':'courses','\u062A\u062F\u0631\u064A\u0633':'teach',
'\u062A\u0633\u0648\u064A\u0642':'marketing','\u0645\u062A\u0627\u0628\u0639\u064A\u0646':'followers','\u0633\u064A\u0631\u0629':'cv',
'\u062A\u0648\u0638\u064A\u0641':'jobs','\u0627\u0633\u062A\u0634\u0627\u0631':'consult','\u0648\u0638\u0627\u0626\u0641':'newjobs','\u0648\u0638\u064A\u0641\u0629':'newjobs'
};
for(var k in kw){if(t.indexOf(k)!==-1){self.sel(kw[k]);return}}
if(t.indexOf('\u062A\u0648\u0627\u0635\u0644')!==-1||t.indexOf('\u0631\u0642\u0645')!==-1)self.showContact();
else if(t.indexOf('\u0623\u0633\u0626\u0644\u0629')!==-1||t.indexOf('\u0633\u0624\u0627\u0644')!==-1)self.showFAQ();
else{self.typ(function(){self.addM('\u0644\u0645 \u0623\u0641\u0647\u0645 \u0637\u0644\u0628\u0643\u060C \u0627\u062E\u062A\u0631 \u0645\u0646 \u0627\u0644\u0642\u0627\u0626\u0645\u0629:');self.mainMenu()})}
}
};
window.B=B;
})();