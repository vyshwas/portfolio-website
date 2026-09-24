import{r as e}from"./gsap-CqRitbRe.js";import{a as t,c as n,i as r,l as i,n as a,o,r as s,s as c,t as l,u}from"./three-fkS6bLFU.js";var d=window.innerWidth<768?2800:6200;function f(){let e=new Float32Array(d*3),t=Math.PI*(3-Math.sqrt(5));for(let n=0;n<d;n++){let r=1-n/(d-1)*2,i=Math.sqrt(1-r*r),a=t*n,o=1.9*(.94+Math.random()*.06);e[n*3]=Math.cos(a)*i*o,e[n*3+1]=r*o,e[n*3+2]=Math.sin(a)*i*o}return e}function p(){let e=new Float32Array(d*3),t=1.35;for(let n=0;n<d;n++){let r=n/d*Math.PI*4,i=(t+Math.cos(3*r)*.6)*Math.cos(r),a=(t+Math.cos(3*r)*.6)*Math.sin(r),o=Math.sin(3*r)*.6,s=Math.random()*Math.PI*2,c=Math.random()*.34;e[n*3]=i+Math.cos(s)*c,e[n*3+1]=a+Math.sin(s)*c,e[n*3+2]=o+(Math.random()-.5)*c}return e}function m(){let e=new Float32Array(d*3);for(let t=0;t<d;t++){let n=t/d;if(t%7==0){let r=n*Math.PI*8,i=Math.random(),a=Math.cos(r)*1.1,o=Math.sin(r)*1.1;e[t*3]=a*(1-i)+-a*i,e[t*3+1]=(n-.5)*4.6,e[t*3+2]=o*(1-i)+-o*i}else{let r=n*Math.PI*8+(t%2==0?0:Math.PI);e[t*3]=Math.cos(r)*1.1+(Math.random()-.5)*.08,e[t*3+1]=(n-.5)*4.6+(Math.random()-.5)*.08,e[t*3+2]=Math.sin(r)*1.1+(Math.random()-.5)*.08}}return e}function h(){let e=new Float32Array(d*3),t=Math.ceil(Math.sqrt(d));for(let n=0;n<d;n++)e[n*3]=(n%t/(t-1)-.5)*5.2,e[n*3+2]=(Math.floor(n/t)/(t-1)-.5)*5.2;return e}function g(g){let _=new n,v=new l({alpha:!0,antialias:!1,powerPreference:`low-power`});v.setPixelRatio(Math.min(window.devicePixelRatio,1.5)),v.setSize(g.clientWidth,g.clientHeight);let y=v.domElement;y.className=`particle-canvas`,y.setAttribute(`aria-hidden`,`true`),g.appendChild(y);let b=new o(45,g.clientWidth/g.clientHeight,.1,100);b.position.z=7.8;let x=new s,S=new Float32Array(d);for(let e=0;e<d;e++)S[e]=Math.random();x.setAttribute(`position`,new a(f(),3)),x.setAttribute(`aPosA`,new a(f(),3)),x.setAttribute(`aPosB`,new a(p(),3)),x.setAttribute(`aPosC`,new a(m(),3)),x.setAttribute(`aPosD`,new a(h(),3)),x.setAttribute(`aRand`,new a(S,1));let C={uTime:{value:0},uMorph:{value:0},uMouse:{value:new u(99,99)},uRepel:{value:0},uInk:{value:new r(getComputedStyle(g).getPropertyValue(`--paper`).trim())},uSize:{value:1.05}},w=new i({transparent:!0,depthWrite:!1,uniforms:C,vertexShader:`
          attribute vec3 aPosA; attribute vec3 aPosB; attribute vec3 aPosC; attribute vec3 aPosD;
          attribute float aRand;
          uniform float uTime; uniform float uMorph; uniform float uRepel; uniform float uSize;
          uniform vec2 uMouse;
          varying float vRand; varying float vGlow;
          void main() {
            vRand = aRand;
            float m = clamp(uMorph + (aRand - 0.5) * 0.15, 0.0, 3.0);
            vec3 p;
            if (m < 1.0)      p = mix(aPosA, aPosB, smoothstep(0.0, 1.0, m));
            else if (m < 2.0) p = mix(aPosB, aPosC, smoothstep(0.0, 1.0, m - 1.0));
            else              p = mix(aPosC, aPosD, smoothstep(0.0, 1.0, m - 2.0));
            p += 0.018 * vec3(sin(uTime*0.6+aRand*40.0), cos(uTime*0.5+aRand*35.0), sin(uTime*0.7+aRand*25.0));
            float gridness = smoothstep(2.55, 3.0, m);
            p.y += sin(p.x*1.6+uTime*1.4) * cos(p.z*1.6+uTime*1.1) * 0.22 * gridness;

            // 1. Transform local vertex p into world coordinates using modelMatrix
            // This ensures interaction stays locked to the screen/mouse, regardless of sphere Y-rotation or drag spin
            vec4 worldPos = modelMatrix * vec4(p, 1.0);

            // 2. Compute tactile repulsion/attraction in world space against uMouse
            vec2 d = worldPos.xy - uMouse;
            float dist = length(d);
            float f = smoothstep(1.3, 0.0, dist) * uRepel;
            worldPos.xy += (d / max(dist, 0.0001)) * f * 0.6;
            worldPos.z += f * 0.28 * sin(uTime * 3.0 + aRand * 20.0);

            // 3. Morph burst effect
            float seg = fract(min(m, 2.999));
            float burst = sin(seg * 3.14159) * step(0.01, m);
            worldPos.xyz += normalize(worldPos.xyz + 0.001) * burst * (0.3 + aRand * 0.55) * 0.5;

            // 4. View matrix maps world space to camera view space
            vec4 mv = viewMatrix * worldPos;
            vGlow = f + burst * 0.7;
            gl_PointSize = uSize * (26.0 / -mv.z) * (0.7 + aRand * 0.6) + burst * 1.5;
            gl_Position = projectionMatrix * mv;
          }
        `,fragmentShader:`
          uniform vec3 uInk; uniform float uTime;
          varying float vRand; varying float vGlow;
          void main() {
            vec2 uv = gl_PointCoord - 0.5;
            float dist = length(uv);
            if (dist > 0.5) discard;
            float disk = 1.0 - smoothstep(0.30, 0.46, dist);
            float halo = (1.0 - disk) * 0.14;
            vec3 col = uInk * (0.55 + vRand * 0.75);
            col = mix(col, uInk, clamp(vGlow, 0.0, 1.0) * 0.6);
            float twinkle = 0.85 + 0.15 * sin(uTime * 2.0 + vRand * 50.0);
            float alpha = (disk * 0.9 + halo) * twinkle;
            if (alpha < 0.02) discard;
            gl_FragColor = vec4(col, alpha);
          }
        `}),T=new c(x,w);_.add(T);let E=!1,D=!1,O=!1,k=0,A=0,j=0,M=!1,N=!1,P=0,F=y.getBoundingClientRect(),I=(e,n)=>{let r=Math.min(n/1e3,.05);P+=r,C.uTime.value=P,C.uRepel.value=t.damp(C.uRepel.value,j,9,r),O||(A*=Math.exp(-5*r)),T.rotation.y+=r*(.1+A),T.rotation.x=Math.sin(P*.12)*.06-t.smoothstep(C.uMorph.value,2.2,3)*.45,v.render(_,b)},L=()=>{let t=E&&!document.hidden&&!N;t&&!M?(e.ticker.add(I),M=!0):!t&&M&&(e.ticker.remove(I),M=!1)},R=new IntersectionObserver(([e])=>{E=e.isIntersecting,L()});R.observe(g),document.addEventListener(`visibilitychange`,L);let z=new ResizeObserver(()=>{let e=g.clientWidth,t=g.clientHeight;!e||!t||(v.setSize(e,t),b.aspect=e/t,b.position.z=b.aspect<.8?9.5:7.8,b.updateProjectionMatrix(),F=y.getBoundingClientRect())});z.observe(g);let B=()=>{F=y.getBoundingClientRect()},V=e=>{if(e.pointerType!==`mouse`)return;let t=2*Math.tan(b.fov*Math.PI/360)*b.position.z;C.uMouse.value.set(((e.clientX-F.left)/F.width-.5)*t*b.aspect,-((e.clientY-F.top)/F.height-.5)*t),j=D?-1.4:1,O&&(A=(e.clientX-k)*.12,k=e.clientX)},H=e=>{e.pointerType===`mouse`&&(D=!0,O=!0,k=e.clientX,y.setPointerCapture(e.pointerId))},U=()=>{D=!1,O=!1,j=0},W=()=>{U(),C.uMouse.value.set(99,99)},G=e=>{e.preventDefault(),N=!0,L(),g.dispatchEvent(new Event(`sceneerror`))};return y.addEventListener(`pointerenter`,B),y.addEventListener(`pointermove`,V),y.addEventListener(`pointerdown`,H),y.addEventListener(`pointerup`,U),y.addEventListener(`pointercancel`,W),y.addEventListener(`pointerleave`,W),y.addEventListener(`webglcontextlost`,G),{setMorph:e=>{C.uMorph.value=e},dispose:()=>{N=!0,L(),R.disconnect(),z.disconnect(),document.removeEventListener(`visibilitychange`,L),y.removeEventListener(`pointerenter`,B),y.removeEventListener(`pointermove`,V),y.removeEventListener(`pointerdown`,H),y.removeEventListener(`pointerup`,U),y.removeEventListener(`pointercancel`,W),y.removeEventListener(`pointerleave`,W),y.removeEventListener(`webglcontextlost`,G),x.dispose(),w.dispose(),v.dispose(),y.remove()}}}export{g as createParticleScene};