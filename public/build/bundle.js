var app=function(){"use strict";function t(){}function n(t){return t()}function e(){return Object.create(null)}function o(t){t.forEach(n)}function i(t){return"function"==typeof t}function r(t,n){return t!=t?n==n:t!==n||t&&"object"==typeof t||"function"==typeof t}function a(t,n){t.appendChild(n)}function l(t,n,e){t.insertBefore(n,e||null)}function c(t){t.parentNode.removeChild(t)}function s(t){return document.createElement(t)}function u(){return t=" ",document.createTextNode(t);var t}function f(t,n,e){null==e?t.removeAttribute(n):t.getAttribute(n)!==e&&t.setAttribute(n,e)}function p(t,n,e){n in t?t[n]=e:f(t,n,e)}let g;function d(t){g=t}const h=[],y=[],m=[],$=[],b=Promise.resolve();let x=!1;function w(t){m.push(t)}let _=!1;const v=new Set;function k(){if(!_){_=!0;do{for(let t=0;t<h.length;t+=1){const n=h[t];d(n),C(n.$$)}for(h.length=0;y.length;)y.pop()();for(let t=0;t<m.length;t+=1){const n=m[t];v.has(n)||(v.add(n),n())}m.length=0}while(h.length);for(;$.length;)$.pop()();x=!1,_=!1,v.clear()}}function C(t){if(null!==t.fragment){t.update(),o(t.before_update);const n=t.dirty;t.dirty=[-1],t.fragment&&t.fragment.p(t.ctx,n),t.after_update.forEach(w)}}const F=new Set;function j(t,n){-1===t.$$.dirty[0]&&(h.push(t),x||(x=!0,b.then(k)),t.$$.dirty.fill(0)),t.$$.dirty[n/31|0]|=1<<n%31}function A(r,a,l,s,u,f,p=[-1]){const h=g;d(r);const y=a.props||{},m=r.$$={fragment:null,ctx:null,props:f,update:t,not_equal:u,bound:e(),on_mount:[],on_destroy:[],before_update:[],after_update:[],context:new Map(h?h.$$.context:[]),callbacks:e(),dirty:p};let $=!1;if(m.ctx=l?l(r,y,(t,n,...e)=>{const o=e.length?e[0]:n;return m.ctx&&u(m.ctx[t],m.ctx[t]=o)&&(m.bound[t]&&m.bound[t](o),$&&j(r,t)),n}):[],m.update(),$=!0,o(m.before_update),m.fragment=!!s&&s(m.ctx),a.target){if(a.hydrate){const t=function(t){return Array.from(t.childNodes)}(a.target);m.fragment&&m.fragment.l(t),t.forEach(c)}else m.fragment&&m.fragment.c();a.intro&&((b=r.$$.fragment)&&b.i&&(F.delete(b),b.i(x))),function(t,e,r){const{fragment:a,on_mount:l,on_destroy:c,after_update:s}=t.$$;a&&a.m(e,r),w(()=>{const e=l.map(n).filter(i);c?c.push(...e):o(e),t.$$.on_mount=[]}),s.forEach(w)}(r,a.target,a.anchor),k()}var b,x;d(h)}function E(t,n,e){const o=t.slice();return o[6]=n[e],o[8]=e,o}function M(n){let e,o;return{c(){e=s("a-plane"),p(e,"rotation","-90 0 0"),p(e,"width","4"),p(e,"height","4"),p(e,"material","src: url(./road.jpg)"),p(e,"position",o=4*(n[8]-q/2)+" 0 0")},m(t,n){l(t,e,n)},p:t,d(t){t&&c(e)}}}function B(n){let e,o,i,r,g,d,h,y,m,$,b,x,w,_,v,k,C,F=n[3],j=[];for(let t=0;t<F.length;t+=1)j[t]=M(E(n,F,t));return{c(){e=s("main"),o=s("a"),o.textContent="Protect yourself with #CyberFit 👨‍💻",i=u(),r=s("a-scene"),g=s("a-entity"),g.innerHTML='<a-image position="1.32 .7 .8" src="logo.gif" width="1.2" height=".3" rotation="0 -90 0"></a-image> \n      <a-image position="2.37 .7 .8" src="logo.gif" width="1.2" height=".3" rotation="0 90 0"></a-image> \n      <a-text position="2.22 1.06 -.5" value="#CyberFit" color="#fff" line-height="50" rotation="-80 180 0" scale=".7 .7 .7"></a-text> \n      <a-text position="1.5 .99 1.8" value="#CyberFit" color="#fff" line-height="50" rotation="-70 0 0" scale=".7 .7 .7"></a-text> \n\n      <a-entity position="2.38 0.385 1.85" animation="property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true"><a-entity position="0 -.285 0" rotation="0 0 0" gltf-model="url(./wheel.glb)"></a-entity></a-entity> \n      <a-entity position="2.38 0.385 -.28" animation="property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true"><a-entity position="0 -.285 0" rotation="0 0 0" gltf-model="url(./wheel.glb)"></a-entity></a-entity> \n      <a-entity position="1.3 0.385 1.85" animation="property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true"><a-entity position="0 -.285 0" rotation="0 180 0" gltf-model="url(./wheel.glb)"></a-entity></a-entity> \n      <a-entity position="1.3 0.385 -.28" animation="property: rotation; to: 360 0 0; dur: 1000; easing: linear; loop: true"><a-entity position="0 -.285 0" rotation="0 180 0" gltf-model="url(./wheel.glb)"></a-entity></a-entity>',d=u(),h=s("a-entity");for(let t=0;t<j.length;t+=1)j[t].c();m=u(),$=s("a-sky"),x=u(),w=s("a-entity"),_=u(),v=s("a-entity"),k=u(),C=s("a-camera"),f(o,"href","https://www.acronis.com/en-us/lp/cyberfit/"),f(o,"class","link svelte-rqzs13"),p(g,"position",".7 -.12 -1.85"),p(g,"rotation","0 -90 0"),p(g,"gltf-model","url(./cybertruck.glb)"),p(h,"position",y=n[0]+" 0 0"),p($,"color","#4875b3"),$.src!==(b="./sky.jpg")&&p($,"src","./sky.jpg"),p(w,"light","color: #FFF; intensity: 1.5"),p(w,"position","-1 4 0"),p(v,"light","type: ambient; color: #BBB"),p(C,"position",n[1]),p(C,"rotation",n[2]),p(C,"look-controls","enabled: false"),f(e,"class","svelte-rqzs13")},m(t,n){l(t,e,n),a(e,o),a(e,i),a(e,r),a(r,g),a(r,d),a(r,h);for(let t=0;t<j.length;t+=1)j[t].m(h,null);a(r,m),a(r,$),a(r,x),a(r,w),a(r,_),a(r,v),a(r,k),a(r,C)},p(t,[n]){if(0&n){let e;for(F=t[3],e=0;e<F.length;e+=1){const o=E(t,F,e);j[e]?j[e].p(o,n):(j[e]=M(o),j[e].c(),j[e].m(h,null))}for(;e<j.length;e+=1)j[e].d(1);j.length=F.length}1&n&&y!==(y=t[0]+" 0 0")&&p(h,"position",y),2&n&&p(C,"position",t[1]),4&n&&p(C,"rotation",t[2])},i:t,o:t,d(t){t&&c(e),function(t,n){for(let e=0;e<t.length;e+=1)t[e]&&t[e].d(n)}(j,t)}}}const q=100;function N(t,n,e){const o=Array(q);let i=0,r=-30,a="0 2 3",l="-30 0 0";return setInterval((function(){e(1,a=`${3*Math.sin(.005*i)} 2 ${3*Math.cos(.005*i)}}`),e(2,l=`-30 ${.005*i*180/Math.PI} 0`),i++,e(0,r+=.025),r>30&&e(0,r=-30)}),10),[r,a,l,o]}return new class extends class{$destroy(){!function(t,n){const e=t.$$;null!==e.fragment&&(o(e.on_destroy),e.fragment&&e.fragment.d(n),e.on_destroy=e.fragment=null,e.ctx=[])}(this,1),this.$destroy=t}$on(t,n){const e=this.$$.callbacks[t]||(this.$$.callbacks[t]=[]);return e.push(n),()=>{const t=e.indexOf(n);-1!==t&&e.splice(t,1)}}$set(){}}{constructor(t){super(),A(this,t,N,B,r,{})}}({target:document.body,props:{name:"world"}})}();
//# sourceMappingURL=bundle.js.map