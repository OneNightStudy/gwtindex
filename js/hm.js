(function(){var h={},mt={},c={id:"f9ed3a28e5a27d86c1d16a92a365d194",dm:["seewo.com"],js:"tongji.baidu.com/hm-web/js/",etrk:[],icon:'',ctrk:true,align:1,nv:-1,vdur:1800000,age:31536000000,rec:0,rp:[],trust:0,vcard:0,qiao:0,lxb:0,conv:0,med:0,cvcc:'',cvcf:[],apps:''};var q=void 0,r=!0,s=null,w=!1;mt.j={};mt.j.M=/msie (\d+\.\d+)/i.test(navigator.userAgent);mt.j.Ja=/msie (\d+\.\d+)/i.test(navigator.userAgent)?document.documentMode||+RegExp.$1:q;mt.j.cookieEnabled=navigator.cookieEnabled;mt.j.javaEnabled=navigator.javaEnabled();mt.j.language=navigator.language||navigator.browserLanguage||navigator.systemLanguage||navigator.userLanguage||"";mt.j.Oa=(window.screen.width||0)+"x"+(window.screen.height||0);mt.j.colorDepth=window.screen.colorDepth||0;mt.cookie={};
mt.cookie.set=function(a,e,g){var b;g.J&&(b=new Date,b.setTime(b.getTime()+g.J));document.cookie=a+"="+e+(g.domain?"; domain="+g.domain:"")+(g.path?"; path="+g.path:"")+(b?"; expires="+b.toGMTString():"")+(g.eb?"; secure":"")};mt.cookie.get=function(a){return(a=RegExp("(^| )"+a+"=([^;]*)(;|$)").exec(document.cookie))?a[2]:s};mt.p={};mt.p.ta=function(a){return document.getElementById(a)};mt.p.ua=function(a){var e;for(e="A";(a=a.parentNode)&&1==a.nodeType;)if(a.tagName==e)return a;return s};
(mt.p.$=function(){function a(){if(!a.D){a.D=r;for(var d=0,e=b.length;d<e;d++)b[d]()}}function e(){try{document.documentElement.doScroll("left")}catch(b){setTimeout(e,1);return}a()}var g=w,b=[],d;document.addEventListener?d=function(){document.removeEventListener("DOMContentLoaded",d,w);a()}:document.attachEvent&&(d=function(){"complete"===document.readyState&&(document.detachEvent("onreadystatechange",d),a())});(function(){if(!g)if(g=r,"complete"===document.readyState)a.D=r;else if(document.addEventListener)document.addEventListener("DOMContentLoaded",
d,w),window.addEventListener("load",a,w);else if(document.attachEvent){document.attachEvent("onreadystatechange",d);window.attachEvent("onload",a);var b=w;try{b=window.frameElement==s}catch(m){}document.documentElement.doScroll&&b&&e()}})();return function(d){a.D?d():b.push(d)}}()).D=w;mt.event={};mt.event.c=function(a,e,g){a.attachEvent?a.attachEvent("on"+e,function(b){g.call(a,b)}):a.addEventListener&&a.addEventListener(e,g,w)};
mt.event.preventDefault=function(a){a.preventDefault?a.preventDefault():a.returnValue=w};mt.l={};mt.l.parse=function(){return(new Function('return (" + source + ")'))()};
mt.l.stringify=function(){function a(a){/["\\\x00-\x1f]/.test(a)&&(a=a.replace(/["\\\x00-\x1f]/g,function(a){var b=g[a];if(b)return b;b=a.charCodeAt();return"\\u00"+Math.floor(b/16).toString(16)+(b%16).toString(16)}));return'"'+a+'"'}function e(a){return 10>a?"0"+a:a}var g={"\b":"\\b","\t":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"};return function(b){switch(typeof b){case "undefined":return"undefined";case "number":return isFinite(b)?String(b):"null";case "string":return a(b);case "boolean":return String(b);
default:if(b===s)return"null";if(b instanceof Array){var d=["["],g=b.length,m,f,k;for(f=0;f<g;f++)switch(k=b[f],typeof k){case "undefined":case "function":case "unknown":break;default:m&&d.push(","),d.push(mt.l.stringify(k)),m=1}d.push("]");return d.join("")}if(b instanceof Date)return'"'+b.getFullYear()+"-"+e(b.getMonth()+1)+"-"+e(b.getDate())+"T"+e(b.getHours())+":"+e(b.getMinutes())+":"+e(b.getSeconds())+'"';m=["{"];f=mt.l.stringify;for(g in b)if(Object.prototype.hasOwnProperty.call(b,g))switch(k=
b[g],typeof k){case "undefined":case "unknown":case "function":break;default:d&&m.push(","),d=1,m.push(f(g)+":"+f(k))}m.push("}");return m.join("")}}}();mt.lang={};mt.lang.d=function(a,e){return"[object "+e+"]"==={}.toString.call(a)};mt.lang.ab=function(a){return mt.lang.d(a,"Number")&&isFinite(a)};mt.lang.cb=function(a){return mt.lang.d(a,"String")};mt.localStorage={};
mt.localStorage.H=function(){if(!mt.localStorage.g)try{mt.localStorage.g=document.createElement("input"),mt.localStorage.g.type="hidden",mt.localStorage.g.style.display="none",mt.localStorage.g.addBehavior("#default#userData"),document.getElementsByTagName("head")[0].appendChild(mt.localStorage.g)}catch(a){return w}return r};
mt.localStorage.set=function(a,e,g){var b=new Date;b.setTime(b.getTime()+g||31536E6);try{window.localStorage?(e=b.getTime()+"|"+e,window.localStorage.setItem(a,e)):mt.localStorage.H()&&(mt.localStorage.g.expires=b.toUTCString(),mt.localStorage.g.load(document.location.hostname),mt.localStorage.g.setAttribute(a,e),mt.localStorage.g.save(document.location.hostname))}catch(d){}};
mt.localStorage.get=function(a){if(window.localStorage){if(a=window.localStorage.getItem(a)){var e=a.indexOf("|"),g=a.substring(0,e)-0;if(g&&g>(new Date).getTime())return a.substring(e+1)}}else if(mt.localStorage.H())try{return mt.localStorage.g.load(document.location.hostname),mt.localStorage.g.getAttribute(a)}catch(b){}return s};
mt.localStorage.remove=function(a){if(window.localStorage)window.localStorage.removeItem(a);else if(mt.localStorage.H())try{mt.localStorage.g.load(document.location.hostname),mt.localStorage.g.removeAttribute(a),mt.localStorage.g.save(document.location.hostname)}catch(e){}};mt.sessionStorage={};mt.sessionStorage.set=function(a,e){if(window.sessionStorage)try{window.sessionStorage.setItem(a,e)}catch(g){}};
mt.sessionStorage.get=function(a){return window.sessionStorage?window.sessionStorage.getItem(a):s};mt.sessionStorage.remove=function(a){window.sessionStorage&&window.sessionStorage.removeItem(a)};mt.R={};mt.R.log=function(a,e){var g=new Image,b="mini_tangram_log_"+Math.floor(2147483648*Math.random()).toString(36);window[b]=g;g.onload=g.onerror=g.onabort=function(){g.onload=g.onerror=g.onabort=s;g=window[b]=s;e&&e(a)};g.src=a};mt.S={};
mt.S.Ca=function(){var a="";if(navigator.plugins&&navigator.mimeTypes.length){var e=navigator.plugins["Shockwave Flash"];e&&e.description&&(a=e.description.replace(/^.*\s+(\S+)\s+\S+$/,"$1"))}else if(window.ActiveXObject)try{if(e=new ActiveXObject("ShockwaveFlash.ShockwaveFlash"))(a=e.GetVariable("$version"))&&(a=a.replace(/^.*\s+(\d+),(\d+).*$/,"$1.$2"))}catch(g){}return a};
mt.S.Wa=function(a,e,g,b,d){return'<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" id="'+a+'" width="'+g+'" height="'+b+'"><param name="movie" value="'+e+'" /><param name="flashvars" value="'+(d||"")+'" /><param name="allowscriptaccess" value="always" /><embed type="application/x-shockwave-flash" name="'+a+'" width="'+g+'" height="'+b+'" src="'+e+'" flashvars="'+(d||"")+'" allowscriptaccess="always" /></object>'};mt.url={};
mt.url.k=function(a,e){var g=a.match(RegExp("(^|&|\\?|#)("+e+")=([^&#]*)(&|$|#)",""));return g?g[3]:s};mt.url.Za=function(a){return(a=a.match(/^(https?:)\/\//))?a[1]:s};mt.url.ya=function(a){return(a=a.match(/^(https?:\/\/)?([^\/\?#]*)/))?a[2].replace(/.*@/,""):s};mt.url.V=function(a){return(a=mt.url.ya(a))?a.replace(/:\d+$/,""):a};mt.url.Ya=function(a){return(a=a.match(/^(https?:\/\/)?[^\/]*(.*)/))?a[2].replace(/[\?#].*/,"").replace(/^$/,"/"):s};
h.s={$a:"http://tongji.baidu.com/hm-web/welcome/ico",P:"hm.baidu.com/hm.gif",fa:"baidu.com",Ga:"hmmd",Ha:"hmpl",Fa:"hmkw",Da:"hmci",Ia:"hmsr",Ea:"hmcu",r:0,m:Math.round(+new Date/1E3),protocol:"https:"===document.location.protocol?"https:":"http:",bb:0,ma:6E5,na:10,T:1024,la:1,z:2147483647,ba:"bs cc cf ci ck cl cm cp cu cw ds ep et fl ja ln lo lt nv rnd si st su v cv lv api tt u".split(" ")};
(function(){var a={o:{},c:function(a,g){this.o[a]=this.o[a]||[];this.o[a].push(g)},A:function(a,g){this.o[a]=this.o[a]||[];for(var b=this.o[a].length,d=0;d<b;d++)this.o[a][d](g)}};return h.B=a})();
(function(){function a(a,b){var d=document.createElement("script");d.charset="utf-8";e.d(b,"Function")&&(d.readyState?d.onreadystatechange=function(){if("loaded"===d.readyState||"complete"===d.readyState)d.onreadystatechange=s,b()}:d.onload=function(){b()});d.src=a;var l=document.getElementsByTagName("script")[0];l.parentNode.insertBefore(d,l)}var e=mt.lang;return h.load=a})();
(function(){var a=mt.p,e=mt.event,g=mt.j,b=h.s,d=[],l={ca:function(){c.ctrk&&(e.c(document,"mouseup",l.ka()),e.c(window,"unload",function(){l.F()}),setInterval(function(){l.F()},b.ma))},ka:function(){return function(a){a=l.va(a);if(""!==a){var f=(b.protocol+"//"+b.P+"?"+h.b.aa().replace(/ep=[^&]*/,"ep="+encodeURIComponent("["+a+"]"))).length;f+(b.z+"").length>b.T||(f+encodeURIComponent(d.join(",")+(d.length?",":"")).length+(b.z+"").length>b.T&&l.F(),d.push(a),(d.length>=b.na||/t:a/.test(a))&&l.F())}}},
va:function(d){if(0===b.la){var f=d.target||d.srcElement,k=f.tagName.toLowerCase();if("embed"==k||"object"==k)return""}g.M?(f=Math.max(document.documentElement.scrollTop,document.body.scrollTop),k=Math.max(document.documentElement.scrollLeft,document.body.scrollLeft),k=d.clientX+k,f=d.clientY+f):(k=d.pageX,f=d.pageY);var n=window.innerWidth||document.documentElement.clientWidth||document.body.offsetWidth;switch(c.align){case 1:k-=n/2;break;case 2:k-=n}k="{x:"+k+",y:"+f+",";f=d.target||d.srcElement;
return k=(d="a"==f.tagName.toLowerCase()?f:a.ua(f))?k+("t:a,u:"+encodeURIComponent(d.href)+"}"):k+"t:b}"},F:function(){0!==d.length&&(h.b.a.et=2,h.b.a.ep="["+d.join(",")+"]",h.b.i(),d=[])}};h.B.c("pv-b",l.ca);return l})();
(function(){function a(){function a(b){function k(){}for(var e=r,g=0,l=0,p=s,t=s,y=b.length,x=0,z=s,g=0;g<y;g++)if(p=b[g],p.chromeVer===m){e=r;t=p.tests;x=t.length;for(l=0;l<x;l++)if(k=d[t[l].name],k()!==t[l].expect){e=w;break}if(x&&e){z={name:"360browser",type:p.type,version:p.ver};break}}return z}var b=[];b.push({ver:"8.3",type:"fast",tests:[{name:"seamlessiframe",expect:1}],chromeVer:"42"});var d={pointerevents:function(){return"maxTouchPoints"in window.navigator?1:"msMaxTouchPoints"in window.navigator||
"mozMaxTouchPoints"in window.navigator||"webkitMaxTouchPoints"in window.navigator?9:0},webgl3D:function(){for(var a="webgl ms-webgl experimental-webgl moz-webgl opera-3d webkit-3d ms-3d 3d".split(" "),k=a.length,d="",b=document.createElement("canvas"),e=w,p=0;p<k;p++)try{if(b.getContext(a[p])){e=r;d=a[p];break}}catch(g){}return e?"webgl"===d?1:9:0},seamlessiframe:function(){return"seamless"in document.createElement("iframe")?1:0},speechsynthesis:function(){return"speechSynthesis"in window?1:"webkitSpeechSynthesis"in
window||"mozSpeechSynthesis"in window||"oSpeechSynthesis"in window||"msSpeechSynthesis"in window?9:0}},e=s,m=function(){var a=navigator.userAgent.toLowerCase().match(/chrome\/(\d+)/i);return a?a[1]:"-1"}();"-1"!==m&&(e=a(b));return e}var e=function(){var e=navigator.userAgent.toLowerCase();if(0<=e.indexOf("chrome")){var e=(e=e.match(/chrome\/(\d+)/))?e[1]:-1,b=window.document,d="track"in b.createElement("track"),b="scoped"in b.createElement("style"),l="v8Locale"in window,m=document.createElement("canvas"),
f="seamless"in document.createElement("iframe"),k=w;try{m.getContext("webgl")&&(k=r)}catch(n){}if(m=a())return"fast"===m.type?7:1;if(!k&&"31"===e)return 1;if(!(f=(f||!k)&&"38"===e))if(f=d)if(f=!b)if(f=!l){var v;a:{f=window.navigator.mimeTypes;for(v in f)if("application/vnd.chromium.remoting-viewer"===f[v].type){v=r;break a}v=w}f=!v&&46>+e}if(f)return 7;if(d&&b&&l)return 1}return-1}();return h.ha=e})();
(function(){function a(){return function(){h.b.a.nv=0;h.b.a.st=4;h.b.a.et=3;h.b.a.ep=h.I.Aa()+","+h.I.xa();h.b.i()}}function e(){clearTimeout(z);var a;y&&(a="visible"==document[y]);x&&(a=!document[x]);f="undefined"==typeof a?r:a;if((!m||!k)&&f&&n)t=r,u=+new Date;else if(m&&k&&(!f||!n))t=w,p+=+new Date-u;m=f;k=n;z=setTimeout(e,100)}function g(a){var k=document,d="";if(a in k)d=a;else for(var b=["webkit","ms","moz","o"],p=0;p<b.length;p++){var e=b[p]+a.charAt(0).toUpperCase()+a.slice(1);if(e in k){d=
e;break}}return d}function b(a){if(!("focus"==a.type||"blur"==a.type)||!(a.target&&a.target!=window))n="focus"==a.type||"focusin"==a.type?r:w,e()}var d=mt.event,l=h.B,m=r,f=r,k=r,n=r,v=+new Date,u=v,p=0,t=r,y=g("visibilityState"),x=g("hidden"),z;e();(function(){var a=y.replace(/[vV]isibilityState/,"visibilitychange");d.c(document,a,e);d.c(window,"pageshow",e);d.c(window,"pagehide",e);"object"==typeof document.onfocusin?(d.c(document,"focusin",b),d.c(document,"focusout",b)):(d.c(window,"focus",b),
d.c(window,"blur",b))})();h.I={Aa:function(){return+new Date-v},xa:function(){return t?+new Date-u+p:p}};l.c("pv-b",function(){d.c(window,"unload",a())});return h.I})();
(function(){var a=mt.lang,e=h.s,g=h.load,b={Ka:function(d){if((window._dxt===q||a.d(window._dxt,"Array"))&&"undefined"!==typeof h.b){var b=h.b.K();g([e.protocol,"//datax.baidu.com/x.js?si=",c.id,"&dm=",encodeURIComponent(b)].join(""),d)}},Ua:function(d){if(a.d(d,"String")||a.d(d,"Number"))window._dxt=window._dxt||[],window._dxt.push(["_setUserId",d])}};return h.oa=b})();
(function(){function a(k){for(var d in k)if({}.hasOwnProperty.call(k,d)){var b=k[d];g.d(b,"Object")||g.d(b,"Array")?a(b):k[d]=String(b)}}function e(a){return a.replace?a.replace(/'/g,"'0").replace(/\*/g,"'1").replace(/!/g,"'2"):a}var g=mt.lang,b=mt.l,d=h.s,l=h.B,m=h.oa,f={w:[],G:0,Y:w,init:function(){f.e=0;l.c("pv-b",function(){f.pa();f.ra()});l.c("pv-d",f.sa);l.c("stag-b",function(){h.b.a.api=f.e||f.G?f.e+"_"+f.G:""});l.c("stag-d",function(){h.b.a.api=0;f.e=0;f.G=0})},pa:function(){var a=window._hmt||
[];if(!a||g.d(a,"Array"))window._hmt={id:c.id,cmd:{},push:function(){for(var a=window._hmt,k=0;k<arguments.length;k++){var b=arguments[k];g.d(b,"Array")&&(a.cmd[a.id].push(b),"_setAccount"===b[0]&&(1<b.length&&/^[0-9a-f]{32}$/.test(b[1]))&&(b=b[1],a.id=b,a.cmd[b]=a.cmd[b]||[]))}}},window._hmt.cmd[c.id]=[],window._hmt.push.apply(window._hmt,a)},ra:function(){var a=window._hmt;if(a&&a.cmd&&a.cmd[c.id])for(var b=a.cmd[c.id],d=/^_track(Event|MobConv|Order|RTEvent)$/,e=0,p=b.length;e<p;e++){var t=b[e];
d.test(t[0])?f.w.push(t):f.O(t)}a.cmd[c.id]={push:f.O}},sa:function(){if(0<f.w.length)for(var a=0,b=f.w.length;a<b;a++)f.O(f.w[a]);f.w=s},O:function(a){var b=a[0];if(f.hasOwnProperty(b)&&g.d(f[b],"Function"))f[b](a)},_setAccount:function(a){1<a.length&&/^[0-9a-f]{32}$/.test(a[1])&&(f.e|=1)},_setAutoPageview:function(a){if(1<a.length&&(a=a[1],w===a||r===a))f.e|=2,h.b.W=a},_trackPageview:function(a){if(1<a.length&&a[1].charAt&&"/"===a[1].charAt(0)){f.e|=4;h.b.a.et=0;h.b.a.ep="";h.b.L?(h.b.a.nv=0,h.b.a.st=
4):h.b.L=r;var b=h.b.a.u,e=h.b.a.su;h.b.a.u=d.protocol+"//"+document.location.host+a[1];f.Y||(h.b.a.su=document.location.href);h.b.i();h.b.a.u=b;h.b.a.su=e}},_trackEvent:function(a){2<a.length&&(f.e|=8,h.b.a.nv=0,h.b.a.st=4,h.b.a.et=4,h.b.a.ep=e(a[1])+"*"+e(a[2])+(a[3]?"*"+e(a[3]):"")+(a[4]?"*"+e(a[4]):""),h.b.i())},_setCustomVar:function(a){if(!(4>a.length)){var b=a[1],d=a[4]||3;if(0<b&&6>b&&0<d&&4>d){f.G++;for(var g=(h.b.a.cv||"*").split("!"),p=g.length;p<b-1;p++)g.push("*");g[b-1]=d+"*"+e(a[2])+
"*"+e(a[3]);h.b.a.cv=g.join("!");a=h.b.a.cv.replace(/[^1](\*[^!]*){2}/g,"*").replace(/((^|!)\*)+$/g,"");""!==a?h.b.setData("Hm_cv_"+c.id,encodeURIComponent(a),c.age):h.b.Na("Hm_cv_"+c.id)}}},_setReferrerOverride:function(a){1<a.length&&(h.b.a.su=a[1].charAt&&"/"===a[1].charAt(0)?d.protocol+"//"+window.location.host+a[1]:a[1],f.Y=r)},_trackOrder:function(d){d=d[1];g.d(d,"Object")&&(a(d),f.e|=16,h.b.a.nv=0,h.b.a.st=4,h.b.a.et=94,h.b.a.ep=b.stringify(d),h.b.i())},_trackMobConv:function(a){if(a={webim:1,
tel:2,map:3,sms:4,callback:5,share:6}[a[1]])f.e|=32,h.b.a.et=93,h.b.a.ep=a,h.b.i()},_trackRTPageview:function(d){d=d[1];g.d(d,"Object")&&(a(d),d=b.stringify(d),512>=encodeURIComponent(d).length&&(f.e|=64,h.b.a.rt=d))},_trackRTEvent:function(e){e=e[1];if(g.d(e,"Object")){a(e);e=encodeURIComponent(b.stringify(e));var l=function(a){var b=h.b.a.rt;f.e|=128;h.b.a.et=90;h.b.a.rt=a;h.b.i();h.b.a.rt=b},m=e.length;if(900>=m)l.call(this,e);else for(var m=Math.ceil(m/900),u="block|"+Math.round(Math.random()*
d.z).toString(16)+"|"+m+"|",p=[],t=0;t<m;t++)p.push(t),p.push(e.substring(900*t,900*t+900)),l.call(this,u+p.join("|")),p=[]}},_setUserId:function(a){a=a[1];m.Ka();m.Ua(a)}};f.init();h.ga=f;return h.ga})();
(function(){function a(){"undefined"===typeof window["_bdhm_loaded_"+c.id]&&(window["_bdhm_loaded_"+c.id]=r,this.a={},this.W=r,this.L=w,this.init())}var e=mt.url,g=mt.R,b=mt.S,d=mt.lang,l=mt.cookie,m=mt.j,f=mt.localStorage,k=mt.sessionStorage,n=h.s,v=h.ha,u=h.B;a.prototype={N:function(a,b){a="."+a.replace(/:\d+/,"");b="."+b.replace(/:\d+/,"");var d=a.indexOf(b);return-1<d&&d+b.length===a.length},Z:function(a,b){a=a.replace(/^https?:\/\//,"");return 0===a.indexOf(b)},C:function(a){for(var b=0;b<c.dm.length;b++)if(-1<
c.dm[b].indexOf("/")){if(this.Z(a,c.dm[b]))return r}else{var d=e.V(a);if(d&&this.N(d,c.dm[b]))return r}return w},K:function(){for(var a=document.location.hostname,b=0,d=c.dm.length;b<d;b++)if(this.N(a,c.dm[b]))return c.dm[b].replace(/(:\d+)?[\/\?#].*/,"");return a},U:function(){for(var a=0,b=c.dm.length;a<b;a++){var d=c.dm[a];if(-1<d.indexOf("/")&&this.Z(document.location.href,d))return d.replace(/^[^\/]+(\/.*)/,"$1")+"/"}return"/"},Ba:function(){if(!document.referrer)return n.m-n.r>c.vdur?1:4;var a=
w;this.C(document.referrer)&&this.C(document.location.href)?a=r:(a=e.V(document.referrer),a=this.N(a||"",document.location.hostname));return a?n.m-n.r>c.vdur?1:4:3},getData:function(a){try{return l.get(a)||k.get(a)||f.get(a)}catch(b){}},setData:function(a,b,d){try{l.set(a,b,{domain:this.K(),path:this.U(),J:d}),d?f.set(a,b,d):k.set(a,b)}catch(e){}},Na:function(a){try{l.set(a,"",{domain:this.K(),path:this.U(),J:-1}),k.remove(a),f.remove(a)}catch(b){}},Sa:function(){var a,b,d,e,f;n.r=this.getData("Hm_lpvt_"+
c.id)||0;13===n.r.length&&(n.r=Math.round(n.r/1E3));b=this.Ba();a=4!==b?1:0;if(d=this.getData("Hm_lvt_"+c.id)){e=d.split(",");for(f=e.length-1;0<=f;f--)13===e[f].length&&(e[f]=""+Math.round(e[f]/1E3));for(;2592E3<n.m-e[0];)e.shift();f=4>e.length?2:3;for(1===a&&e.push(n.m);4<e.length;)e.shift();d=e.join(",");e=e[e.length-1]}else d=n.m,e="",f=1;this.setData("Hm_lvt_"+c.id,d,c.age);this.setData("Hm_lpvt_"+c.id,n.m);d=n.m===this.getData("Hm_lpvt_"+c.id)?"1":"0";if(0===c.nv&&this.C(document.location.href)&&
(""===document.referrer||this.C(document.referrer)))a=0,b=4;this.a.nv=a;this.a.st=b;this.a.cc=d;this.a.lt=e;this.a.lv=f},aa:function(){for(var a=[],b=0,d=n.ba.length;b<d;b++){var e=n.ba[b],f=this.a[e];"undefined"!==typeof f&&""!==f&&a.push(e+"="+encodeURIComponent(f))}b=this.a.et;this.a.rt&&(0===b?a.push("rt="+encodeURIComponent(this.a.rt)):90===b&&a.push("rt="+this.a.rt));return a.join("&")},Ta:function(){this.Sa();this.a.si=c.id;this.a.su=document.referrer;this.a.ds=m.Oa;this.a.cl=m.colorDepth+
"-bit";this.a.ln=m.language;this.a.ja=m.javaEnabled?1:0;this.a.ck=m.cookieEnabled?1:0;this.a.bs=v;this.a.lo="number"===typeof _bdhm_top?1:0;this.a.fl=b.Ca();this.a.v="1.1.23";this.a.cv=decodeURIComponent(this.getData("Hm_cv_"+c.id)||"");1===this.a.nv&&(this.a.tt=document.title||"");var a=document.location.href;this.a.cm=e.k(a,n.Ga)||"";this.a.cp=e.k(a,n.Ha)||"";this.a.cw=e.k(a,n.Fa)||"";this.a.ci=e.k(a,n.Da)||"";this.a.cf=e.k(a,n.Ia)||"";this.a.cu=e.k(a,n.Ea)||""},init:function(){try{this.Ta(),0===
this.a.nv?this.Qa():this.Q(".*"),h.b=this,this.ia(),u.A("pv-b"),this.Pa()}catch(a){var b=[];b.push("si="+c.id);b.push("n="+encodeURIComponent(a.name));b.push("m="+encodeURIComponent(a.message));b.push("r="+encodeURIComponent(document.referrer));g.log(n.protocol+"//"+n.P+"?"+b.join("&"))}},Pa:function(){function a(){u.A("pv-d")}this.W?(this.L=r,this.a.et=0,this.a.ep="",this.i(a)):a()},i:function(a){var b=this;b.a.rnd=Math.round(Math.random()*n.z);u.A("stag-b");var e=n.protocol+"//"+n.P+"?"+b.aa();
u.A("stag-d");b.ea(e);g.log(e,function(e){b.Q(e);d.d(a,"Function")&&a.call(b)})},ia:function(){var a=document.location.hash.substring(1),b=RegExp(c.id),d=-1<document.referrer.indexOf(n.fa),f=e.k(a,"jn"),g=/^heatlink$|^select$/.test(f);a&&(b.test(a)&&d&&g)&&(this.a.rnd=Math.round(Math.random()*n.z),a=document.createElement("script"),a.setAttribute("type","text/javascript"),a.setAttribute("charset","utf-8"),a.setAttribute("src",n.protocol+"//"+c.js+f+".js?"+this.a.rnd),f=document.getElementsByTagName("script")[0],
f.parentNode.insertBefore(a,f))},ea:function(a){var b=k.get("Hm_unsent_"+c.id)||"",d=this.a.u?"":"&u="+encodeURIComponent(document.location.href),b=encodeURIComponent(a.replace(/^https?:\/\//,"")+d)+(b?","+b:"");k.set("Hm_unsent_"+c.id,b)},Q:function(a){var b=k.get("Hm_unsent_"+c.id)||"";b&&(a=encodeURIComponent(a.replace(/^https?:\/\//,"")),a=RegExp(a.replace(/([\*\(\)])/g,"\\$1")+"(%26u%3D[^,]*)?,?","g"),(b=b.replace(a,"").replace(/,$/,""))?k.set("Hm_unsent_"+c.id,b):k.remove("Hm_unsent_"+c.id))},
Qa:function(){var a=this,b=k.get("Hm_unsent_"+c.id);if(b)for(var b=b.split(","),d=function(b){g.log(n.protocol+"//"+decodeURIComponent(b),function(b){a.Q(b)})},e=0,f=b.length;e<f;e++)d(b[e])}};return new a})();
(function(){var a=mt.p,e=mt.event,g=mt.url,b=mt.l;try{if(window.performance&&performance.timing&&"undefined"!==typeof h.b){var d=+new Date,l=function(a){var b=performance.timing,d=b[a+"Start"]?b[a+"Start"]:0;a=b[a+"End"]?b[a+"End"]:0;return{start:d,end:a,value:0<a-d?a-d:0}},m=s;a.$(function(){m=+new Date});var f=function(){var a,e,f;f=l("navigation");e=l("request");f={netAll:e.start-f.start,netDns:l("domainLookup").value,netTcp:l("connect").value,srv:l("response").start-e.start,dom:performance.timing.domInteractive-
performance.timing.fetchStart,loadEvent:l("loadEvent").end-f.start};a=document.referrer;var k=a.match(/^(http[s]?:\/\/)?([^\/]+)(.*)/)||[],t=s;e=s;if("www.baidu.com"===k[2]||"m.baidu.com"===k[2])t=g.k(a,"qid"),e=g.k(a,"click_t");a=t;f.qid=a!=s?a:"";e!=s?(f.bdDom=m?m-e:0,f.bdRun=d-e,f.bdDef=l("navigation").start-e):(f.bdDom=0,f.bdRun=0,f.bdDef=0);h.b.a.et=87;h.b.a.ep=b.stringify(f);h.b.i()};e.c(window,"load",function(){setTimeout(f,500)})}}catch(k){}})();
(function(){var a=h.s,e={init:function(){try{if("http:"===a.protocol){var b=document.createElement("IFRAME");b.setAttribute("src","http://boscdn.bpc.baidu.com/v1/holmes-moplus/mp-cdn.html");b.style.display="none";b.style.width="1";b.style.height="1";b.Xa="0";document.body.appendChild(b)}}catch(d){}}},g=navigator.userAgent.toLowerCase();-1<g.indexOf("android")&&-1===g.indexOf("micromessenger")&&e.init()})();
(function(){var a=mt.j,e=mt.lang,g=mt.event,b=mt.l;if("undefined"!==typeof h.b&&(c.med||(!a.M||7<a.Ja)&&c.cvcc)){var d,l,m,f,k=function(a){if(a.item){for(var b=a.length,d=Array(b);b--;)d[b]=a[b];return d}return[].slice.call(a)},n=function(a,b){for(var d in a)if(a.hasOwnProperty(d)&&b.call(a,d,a[d])===w)return w},v=function(a,f){var g={};g.n=d;g.t="clk";g.v=a;if(f){var l=f.getAttribute("href"),k=f.getAttribute("onclick")?""+f.getAttribute("onclick"):s,n=f.getAttribute("id")||"";m.test(l)?(g.sn="mediate",
g.snv=l):e.d(k,"String")&&m.test(k)&&(g.sn="wrap",g.snv=k);g.id=n}h.b.a.et=86;h.b.a.ep=b.stringify(g);h.b.i();for(g=+new Date;400>=+new Date-g;);};if(c.med)l="/zoosnet",d="swt",m=/swt|zixun|call|chat|zoos|business|talk|kefu|openkf|online|\/LR\/Chatpre\.aspx/i,f={click:function(){for(var a=[],b=k(document.getElementsByTagName("a")),b=[].concat.apply(b,k(document.getElementsByTagName("area"))),b=[].concat.apply(b,k(document.getElementsByTagName("img"))),d,e,f=0,g=b.length;f<g;f++)d=b[f],e=d.getAttribute("onclick"),
d=d.getAttribute("href"),(m.test(e)||m.test(d))&&a.push(b[f]);return a}};else if(c.cvcc){l="/other-comm";d="other";m=c.cvcc.q||q;var u=c.cvcc.id||q;f={click:function(){for(var a=[],b=k(document.getElementsByTagName("a")),b=[].concat.apply(b,k(document.getElementsByTagName("area"))),b=[].concat.apply(b,k(document.getElementsByTagName("img"))),d,e,f,g=0,l=b.length;g<l;g++)d=b[g],m!==q?(e=d.getAttribute("onclick"),f=d.getAttribute("href"),u?(d=d.getAttribute("id"),(m.test(e)||m.test(f)||u.test(d))&&
a.push(b[g])):(m.test(e)||m.test(f))&&a.push(b[g])):u!==q&&(d=d.getAttribute("id"),u.test(d)&&a.push(b[g]));return a}}}if("undefined"!==typeof f&&"undefined"!==typeof m){var p;l+=/\/$/.test(l)?"":"/";var t=function(a,b){if(p===b)return v(l+a,b),w;if(e.d(b,"Array")||e.d(b,"NodeList"))for(var d=0,f=b.length;d<f;d++)if(p===b[d])return v(l+a+"/"+(d+1),b[d]),w};g.c(document,"mousedown",function(a){a=a||window.event;p=a.target||a.srcElement;var b={};for(n(f,function(a,d){b[a]=e.d(d,"Function")?d():document.getElementById(d)});p&&
p!==document&&n(b,t)!==w;)p=p.parentNode})}}})();(function(){var a=mt.p,e=mt.lang,g=mt.event,b=mt.l;if("undefined"!==typeof h.b&&e.d(c.cvcf,"Array")&&0<c.cvcf.length){var d={da:function(){for(var b=c.cvcf.length,e,f=0;f<b;f++)(e=a.ta(decodeURIComponent(c.cvcf[f])))&&g.c(e,"click",d.qa())},qa:function(){return function(){h.b.a.et=86;var a={n:"form",t:"clk"};a.id=this.id;h.b.a.ep=b.stringify(a);h.b.i()}}};a.$(function(){d.da()})}})();
(function(){var a=mt.event,e=mt.l;if(c.med&&"undefined"!==typeof h.b){var g=+new Date,b={n:"anti",sb:0,kb:0,clk:0},d=function(){h.b.a.et=86;h.b.a.ep=e.stringify(b);h.b.i()};a.c(document,"click",function(){b.clk++});a.c(document,"keyup",function(){b.kb=1});a.c(window,"scroll",function(){b.sb++});a.c(window,"unload",function(){b.t=+new Date-g;d()});a.c(window,"load",function(){setTimeout(d,5E3)})}})();
(function(){function a(){this.f=s}var e=mt.R,g=mt.j;a.prototype={La:function(a){if(this.f)this.h(a,0);else if(this.isSupported()){try{this.f=new ActiveXObject("BDEXIE.BDExExtension.1"),this.X=r}catch(b){this.X=w}this.X?this.h(a,0):this.h(a,-1)}else this.h(a,-1)},Va:function(){this.f&&delete this.f;this.f=s},Ra:function(a,b,e){if(this.f&&"SetLocalCache"in this.f)try{this.f.SetLocalCache(a,b)===q&&this.h(e,0)}catch(f){this.h(e,-1)}else this.h(e,-1)},za:function(a,b){if(this.f&&"GetLocalCache"in this.f)try{this.h(b,
this.f.GetLocalCache(a))}catch(e){this.h(b,"")}else this.h(b,"")},wa:function(a){if(this.f&&"GetCryptStr"in this.f)try{this.h(a,this.f.GetCryptStr("strEncryptID1"))}catch(b){this.h(a,"")}else this.h(a,"")},h:function(a,b){"function"===typeof a&&a(b,this)},isSupported:function(){if(window.ActiveXObject||"ActiveXObject"in window)try{return!!new ActiveXObject("BDEXIE.BDExExtension.1")}catch(a){}return w},Ma:function(){var a=this;this.wa(function(b){b!==q&&""!==b&&(e.log("//datax.baidu.com/x.gif?dm="+
encodeURIComponent("datax.baidu.com/webadapter/guid")+"&ac="+encodeURIComponent(b)+"&v=hm-webadapter-0.0.1&rnd="+Math.round(2147483647*Math.random())),a.Ra("hmKey",+new Date,function(){a.Va()}))})}};if(g.M&&/^http(s)?:$/.test(document.location.protocol)){var b=new a;b.La(function(a){0===a&&b.za("hmKey",function(a){a=+a;(isNaN(a)||6048E5<+new Date-a)&&b.Ma()})})}})();})();
