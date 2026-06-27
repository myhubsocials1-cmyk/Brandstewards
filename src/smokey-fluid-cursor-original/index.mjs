var ze=Object.defineProperty;var ne=Object.getOwnPropertySymbols;var Me=Object.prototype.hasOwnProperty,Oe=Object.prototype.propertyIsEnumerable;var ae=(R,f,c)=>f in R?ze(R,f,{enumerable:true,configurable:true,writable:true,value:c}):R[f]=c,W=(R,f)=>{for(var c in f||(f={}))Me.call(f,c)&&ae(R,c,f[c]);if(ne)for(var c of ne(f))Oe.call(f,c)&&ae(R,c,f[c]);return R};var Ye={simResolution:128,dyeResolution:1440,captureResolution:512,densityDissipation:3.5,velocityDissipation:2,pressure:.1,pressureIteration:20,curl:10,splatRadius:.5,splatForce:6e3,shading:true,colorUpdateSpeed:10,paused:false,backColor:{r:0,g:0,b:0},transparent:true,id:"smokey-fluid-canvas"},Ie=R=>{let f=W(W({},Ye),R),c=document.getElementById(f.id);if(!c)return;let I=document.createElement("style");I.textContent=`
    #${f.id} {
      position: fixed !important;
      inset: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      pointer-events: none !important;
      z-index: 2147483648 !important;
      opacity: 0.32 !important;
      isolation: isolate !important;
      mix-blend-mode: normal !important;
      background: transparent !important;
    }
  `,document.head.appendChild(I),Q();class ue{constructor(){this.id=-1;this.texcoordX=0;this.texcoordY=0;this.prevTexcoordX=0;this.prevTexcoordY=0;this.deltaX=0;this.deltaY=0;this.down=false;this.moved=false;this.color=[126,182,34];}}let S=[];S.push(new ue);let{gl:t,ext:T}=ce(c);T.supportLinearFiltering||(f.dyeResolution=512,f.shading=false);function ce(e){let r={alpha:true,depth:false,stencil:false,antialias:false,preserveDrawingBuffer:false},i=e.getContext("webgl2",r),o=!!i;if(o||(i=e.getContext("webgl",r)||e.getContext("experimental-webgl",r)),!i)throw new Error("WebGL not supported");let n=null,u,a;if(o){let l=i;l.getExtension("EXT_color_buffer_float"),u=!!l.getExtension("OES_texture_float_linear"),a=l.HALF_FLOAT;}else {let l=i;if(n=l.getExtension("OES_texture_half_float"),u=!!l.getExtension("OES_texture_half_float_linear"),!n)throw new Error("OES_texture_half_float not supported on WebGL1");a=n.HALF_FLOAT_OES;}i.clearColor(0,0,0,1);let m=null,d=null,y=null;if(o){let l=i;m=F(l,l.RGBA16F,l.RGBA,a),d=F(l,l.RG16F,l.RG,a),y=F(l,l.R16F,l.RED,a);}else {let l=i;m=F(l,l.RGBA,l.RGBA,a),d=F(l,l.RGBA,l.RGBA,a),y=F(l,l.RGBA,l.RGBA,a);}return {gl:i,ext:{formatRGBA:m,formatRG:d,formatR:y,halfFloatTexType:a,supportLinearFiltering:u,isWebGL2:o}}}function F(e,r,i,o){if(!se(e,r,i,o)){if(e.RGBA16F!==void 0){let n=e;switch(r){case n.R16F:return F(n,n.RG16F,n.RG,o);case n.RG16F:return F(n,n.RGBA16F,n.RGBA,o);default:return null}}return null}return {internalFormat:r,format:i}}function se(e,r,i,o){let n=e.createTexture();if(!n)return  false;e.bindTexture(e.TEXTURE_2D,n),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.NEAREST),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,r,4,4,0,i,o,null);let u=e.createFramebuffer();if(!u)return  false;e.bindFramebuffer(e.FRAMEBUFFER,u),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0);let a=e.checkFramebufferStatus(e.FRAMEBUFFER);return e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteFramebuffer(u),e.deleteTexture(n),a===e.FRAMEBUFFER_COMPLETE}class le{constructor(r,i){this.vertexShader=r,this.fragmentShaderSource=i,this.programs={},this.activeProgram=null,this.uniforms={};}setKeywords(r){let i=0;for(let n=0;n<r.length;n++)i+=Xe(r[n]);let o=this.programs[i];if(!o){let n=g(t,t.FRAGMENT_SHADER,k(this.fragmentShaderSource,r));o=V(t,this.vertexShader,n),this.programs[i]=o;}o!==this.activeProgram&&(this.uniforms=H(t,o),this.activeProgram=o);}bind(){this.activeProgram&&t.useProgram(this.activeProgram);}}class E{constructor(r,i){this.program=V(t,r,i),this.uniforms=H(t,this.program);}bind(){this.program&&t.useProgram(this.program);}}function V(e,r,i){let o=e.createProgram();return e.attachShader(o,r),e.attachShader(o,i),e.bindAttribLocation(o,0,"aPosition"),e.linkProgram(o),e.getProgramParameter(o,e.LINK_STATUS)||console.trace(e.getProgramInfoLog(o)),o}function H(e,r){let i={},o=e.getProgramParameter(r,e.ACTIVE_UNIFORMS);for(let n=0;n<o;n++){let u=e.getActiveUniform(r,n);if(!u)continue;let a=u.name,m=e.getUniformLocation(r,a);m&&(i[a]=m);}return i}function g(e,r,i){let o=e.createShader(r);return e.shaderSource(o,i),e.compileShader(o),e.getShaderParameter(o,e.COMPILE_STATUS)||console.trace(e.getShaderInfoLog(o)),o}function k(e,r){if(!r||r.length===0)return e;let i="";return r.forEach(o=>{i+="#define "+o+`
`;}),i+e}let x=g(t,t.VERTEX_SHADER,`
      precision highp float;

      attribute vec2 aPosition;
      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform vec2 texelSize;

      void main () {
          vUv = aPosition * 0.5 + 0.5;
          vL = vUv - vec2(texelSize.x, 0.0);
          vR = vUv + vec2(texelSize.x, 0.0);
          vT = vUv + vec2(0.0, texelSize.y);
          vB = vUv - vec2(0.0, texelSize.y);
          gl_Position = vec4(aPosition, 0.0, 1.0);
      }
    `),fe=g(t,t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      uniform sampler2D uTexture;

      void main () {
          gl_FragColor = texture2D(uTexture, vUv);
      }
    `),me=g(t,t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      uniform sampler2D uTexture;
      uniform float value;

      void main () {
          gl_FragColor = value * texture2D(uTexture, vUv);
      }
    `),de=`
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uTexture;
      uniform vec2 texelSize;

      void main () {
          vec3 c = texture2D(uTexture, vUv).rgb;

      #ifdef shading
          // Calculate normal from neighboring pixels for lighting
          vec3 lc = texture2D(uTexture, vL).rgb;
          vec3 rc = texture2D(uTexture, vR).rgb;
          vec3 tc = texture2D(uTexture, vT).rgb;
          vec3 bc = texture2D(uTexture, vB).rgb;

          float dx = length(rc) - length(lc);
          float dy = length(tc) - length(bc);

          vec3 n = normalize(vec3(dx, dy, length(texelSize)));
          vec3 l = vec3(0.0, 0.0, 1.0);

          // Apply diffuse lighting
          float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
          c *= diffuse;
      #endif

          // Use brightest channel for alpha
          float a = max(c.r, max(c.g, c.b));
          gl_FragColor = vec4(c, a);
      }
    `,ve=g(t,t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      uniform sampler2D uTarget;
      uniform float aspectRatio;
      uniform vec3 color;
      uniform vec2 point;
      uniform float radius;

      void main () {
          // Calculate Gaussian splat
          vec2 p = vUv - point.xy;
          p.x *= aspectRatio;
          vec3 splat = exp(-dot(p, p) / radius) * color;
          vec3 base = texture2D(uTarget, vUv).xyz;
          gl_FragColor = vec4(base + splat, 1.0);
      }
    `),he=g(t,t.FRAGMENT_SHADER,k(`
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      uniform sampler2D uVelocity;
      uniform sampler2D uSource;
      uniform vec2 texelSize;
      uniform vec2 dyeTexelSize;
      uniform float dt;
      uniform float dissipation;

      // Manual bilinear filtering for WebGL1 without linear filtering support
      vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
          vec2 st = uv / tsize - 0.5;

          vec2 iuv = floor(st);
          vec2 fuv = fract(st);

          vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
          vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
          vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
          vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);

          return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
      }

      void main () {
      #ifdef MANUAL_FILTERING
          // Manual filtering for devices without linear filtering
          vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
          vec4 result = bilerp(uSource, coord, dyeTexelSize);
      #else
          // Standard texture lookup with linear filtering
          vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
          vec4 result = texture2D(uSource, coord);
      #endif
          // Apply dissipation (fade over time)
          float decay = 1.0 + dissipation * dt;
          gl_FragColor = result / decay;
      }
    `,T.supportLinearFiltering?null:["MANUAL_FILTERING"])),ge=g(t,t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          // Sample neighboring velocities
          float L = texture2D(uVelocity, vL).x;
          float R = texture2D(uVelocity, vR).x;
          float T = texture2D(uVelocity, vT).y;
          float B = texture2D(uVelocity, vB).y;

          vec2 C = texture2D(uVelocity, vUv).xy;
          
          // Boundary conditions
          if (vL.x < 0.0) { L = -C.x; }
          if (vR.x > 1.0) { R = -C.x; }
          if (vT.y > 1.0) { T = -C.y; }
          if (vB.y < 0.0) { B = -C.y; }

          // Calculate divergence
          float div = 0.5 * (R - L + T - B);
          gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
      }
    `),pe=g(t,t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uVelocity;

      void main () {
          // Sample velocity components for curl calculation
          float L = texture2D(uVelocity, vL).y;
          float R = texture2D(uVelocity, vR).y;
          float T = texture2D(uVelocity, vT).x;
          float B = texture2D(uVelocity, vB).x;
          float vorticity = R - L - T + B;
          gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
      }
    `),xe=g(t,t.FRAGMENT_SHADER,`
      precision highp float;
      precision highp sampler2D;

      varying vec2 vUv;
      varying vec2 vL;
      varying vec2 vR;
      varying vec2 vT;
      varying vec2 vB;
      uniform sampler2D uVelocity;
      uniform sampler2D uCurl;
      uniform float curl;
      uniform float dt;

      void main () {
          // Sample curl from neighbors
          float L = texture2D(uCurl, vL).x;
          float R = texture2D(uCurl, vR).x;
          float T = texture2D(uCurl, vT).x;
          float B = texture2D(uCurl, vB).x;
          float C = texture2D(uCurl, vUv).x;

          // Calculate vorticity force
          vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
          force /= length(force) + 0.0001; // Normalize
          force *= curl * C; // Scale by curl strength
          force.y *= -1.0; // Adjust coordinate system

          // Apply force to velocity
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          velocity += force * dt;
          velocity = min(max(velocity, -1000.0), 1000.0); // Clamp to prevent explosion
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),be=g(t,t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uDivergence;

      void main () {
          // Sample pressure from neighbors
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          float C = texture2D(uPressure, vUv).x;
          float divergence = texture2D(uDivergence, vUv).x;
          
          // Jacobi iteration for pressure solve
          float pressure = (L + R + B + T - divergence) * 0.25;
          gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
      }
    `),Re=g(t,t.FRAGMENT_SHADER,`
      precision mediump float;
      precision mediump sampler2D;

      varying highp vec2 vUv;
      varying highp vec2 vL;
      varying highp vec2 vR;
      varying highp vec2 vT;
      varying highp vec2 vB;
      uniform sampler2D uPressure;
      uniform sampler2D uVelocity;

      void main () {
          // Calculate pressure gradient
          float L = texture2D(uPressure, vL).x;
          float R = texture2D(uPressure, vR).x;
          float T = texture2D(uPressure, vT).x;
          float B = texture2D(uPressure, vB).x;
          vec2 velocity = texture2D(uVelocity, vUv).xy;
          
          // Subtract gradient to make velocity divergence-free
          velocity.xy -= vec2(R - L, T - B);
          gl_FragColor = vec4(velocity, 0.0, 1.0);
      }
    `),h=(()=>{let e=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,-1,1,1,1,1,-1]),t.STATIC_DRAW);let r=t.createBuffer();return t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,r),t.bufferData(t.ELEMENT_ARRAY_BUFFER,new Uint16Array([0,1,2,0,2,3]),t.STATIC_DRAW),t.vertexAttribPointer(0,2,t.FLOAT,false,0,0),t.enableVertexAttribArray(0),(i,o=false)=>{i==null?(t.viewport(0,0,t.drawingBufferWidth,t.drawingBufferHeight),t.bindFramebuffer(t.FRAMEBUFFER,null)):(t.viewport(0,0,i.width,i.height),t.bindFramebuffer(t.FRAMEBUFFER,i.fbo)),o&&(t.clearColor(0,0,0,1),t.clear(t.COLOR_BUFFER_BIT)),t.drawElements(t.TRIANGLES,6,t.UNSIGNED_SHORT,0);}})(),v,s,C,G,D,K=new E(x,fe),X=new E(x,me),L=new E(x,ve),p=new E(x,he),z=new E(x,ge),M=new E(x,pe),_=new E(x,xe),B=new E(x,be),w=new E(x,Re),U=new le(x,de);function q(){let e=oe(f.simResolution),r=oe(f.dyeResolution),i=T.halfFloatTexType,o=T.formatRGBA,n=T.formatRG,u=T.formatR,a=T.supportLinearFiltering?t.LINEAR:t.NEAREST;t.disable(t.BLEND),v==null?v=O(r.width,r.height,o.internalFormat,o.format,i,a):v=j(v,r.width,r.height,o.internalFormat,o.format,i,a),s==null?s=O(e.width,e.height,n.internalFormat,n.format,i,a):s=j(s,e.width,e.height,n.internalFormat,n.format,i,a),C=A(e.width,e.height,u.internalFormat,u.format,i,t.NEAREST),G=A(e.width,e.height,u.internalFormat,u.format,i,t.NEAREST),D=O(e.width,e.height,u.internalFormat,u.format,i,t.NEAREST);}function A(e,r,i,o,n,u){t.activeTexture(t.TEXTURE0);let a=t.createTexture();t.bindTexture(t.TEXTURE_2D,a),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MIN_FILTER,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_MAG_FILTER,u),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_S,t.CLAMP_TO_EDGE),t.texParameteri(t.TEXTURE_2D,t.TEXTURE_WRAP_T,t.CLAMP_TO_EDGE),t.texImage2D(t.TEXTURE_2D,0,i,e,r,0,o,n,null);let m=t.createFramebuffer();t.bindFramebuffer(t.FRAMEBUFFER,m),t.framebufferTexture2D(t.FRAMEBUFFER,t.COLOR_ATTACHMENT0,t.TEXTURE_2D,a,0),t.viewport(0,0,e,r),t.clear(t.COLOR_BUFFER_BIT);let d=1/e,y=1/r;return {texture:a,fbo:m,width:e,height:r,texelSizeX:d,texelSizeY:y,attach(l){return t.activeTexture(t.TEXTURE0+l),t.bindTexture(t.TEXTURE_2D,a),l}}}function O(e,r,i,o,n,u){let a=A(e,r,i,o,n,u),m=A(e,r,i,o,n,u);return {width:e,height:r,texelSizeX:a.texelSizeX,texelSizeY:a.texelSizeY,get read(){return a},set read(d){a=d;},get write(){return m},set write(d){m=d;},swap(){let d=a;a=m,m=d;}}}function Te(e,r,i,o,n,u,a){let m=A(r,i,o,n,u,a);return K.bind(),t.uniform1i(K.uniforms.uTexture,e.attach(0)),h(m),m}function j(e,r,i,o,n,u,a){return e.width===r&&e.height===i||(e.read=Te(e.read,r,i,o,n,u,a),e.write=A(r,i,o,n,u,a),e.width=r,e.height=i,e.texelSizeX=1/r,e.texelSizeY=1/i),e}function Ee(){let e=[];f.shading&&e.push("shading"),U.setKeywords(e);}Ee(),q();let J=Date.now(),P=0;function $(){let e=ye();Q()&&q(),Se(e),Fe(),De(e),Le(null),requestAnimationFrame($);}function ye(){let e=Date.now(),r=(e-J)/1e3;return r=Math.min(r,.016666),J=e,r}function Q(){let e=b(c.clientWidth),r=b(c.clientHeight);return c.width!==e||c.height!==r?(c.width=e,c.height=r,true):false}function Se(e){P+=e*f.colorUpdateSpeed,P>=1&&(P=Ge(P,0,1),S.forEach(r=>{r.color=ie(N());}));}function Fe(){S.forEach(e=>{e.moved&&(e.moved=false,Ae(e));});}function De(e){t.disable(t.BLEND),M.bind(),t.uniform2f(M.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(M.uniforms.uVelocity,s.read.attach(0)),h(G),_.bind(),t.uniform2f(_.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(_.uniforms.uVelocity,s.read.attach(0)),t.uniform1i(_.uniforms.uCurl,G.attach(1)),t.uniform1f(_.uniforms.curl,f.curl),t.uniform1f(_.uniforms.dt,e),h(s.write),s.swap(),z.bind(),t.uniform2f(z.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(z.uniforms.uVelocity,s.read.attach(0)),h(C),X.bind(),t.uniform1i(X.uniforms.uTexture,D.read.attach(0)),t.uniform1f(X.uniforms.value,f.pressure),h(D.write),D.swap(),B.bind(),t.uniform2f(B.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(B.uniforms.uDivergence,C.attach(0));for(let i=0;i<f.pressureIteration;i++)t.uniform1i(B.uniforms.uPressure,D.read.attach(1)),h(D.write),D.swap();w.bind(),t.uniform2f(w.uniforms.texelSize,s.texelSizeX,s.texelSizeY),t.uniform1i(w.uniforms.uPressure,D.read.attach(0)),t.uniform1i(w.uniforms.uVelocity,s.read.attach(1)),h(s.write),s.swap(),p.bind(),t.uniform2f(p.uniforms.texelSize,s.texelSizeX,s.texelSizeY),T.supportLinearFiltering||t.uniform2f(p.uniforms.dyeTexelSize,s.texelSizeX,s.texelSizeY);let r=s.read.attach(0);t.uniform1i(p.uniforms.uVelocity,r),t.uniform1i(p.uniforms.uSource,r),t.uniform1f(p.uniforms.dt,e),t.uniform1f(p.uniforms.dissipation,f.velocityDissipation),h(s.write),s.swap(),T.supportLinearFiltering||t.uniform2f(p.uniforms.dyeTexelSize,v.texelSizeX,v.texelSizeY),t.uniform1i(p.uniforms.uVelocity,s.read.attach(0)),t.uniform1i(p.uniforms.uSource,v.read.attach(1)),t.uniform1f(p.uniforms.dissipation,f.densityDissipation),h(v.write),v.swap();}function Le(e){t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA),t.enable(t.BLEND),_e(e);}function _e(e){let r=t.drawingBufferWidth,i=t.drawingBufferHeight;U.bind(),f.shading&&t.uniform2f(U.uniforms.texelSize,1/r,1/i),t.uniform1i(U.uniforms.uTexture,v.read.attach(0)),h(e);}function Ae(e){let r=e.deltaX*f.splatForce,i=e.deltaY*f.splatForce,o=Ce(e.color);ee(e.texcoordX,e.texcoordY,r,i,o);}function Z(e){let r=N();r.r*=1.2,r.g*=1.6,r.b*=1.2;let i=0.3*(Math.random()-.5),o=1.6*(Math.random()-.5);ee(e.texcoordX,e.texcoordY,i,o,r);}function ee(e,r,i,o,n){L.bind(),t.uniform1i(L.uniforms.uTarget,s.read.attach(0)),t.uniform1f(L.uniforms.aspectRatio,c.width/c.height),t.uniform2f(L.uniforms.point,e,r),t.uniform3f(L.uniforms.color,i,o,0),t.uniform1f(L.uniforms.radius,Be(f.splatRadius/100)),h(s.write),s.swap(),t.uniform1i(L.uniforms.uTarget,v.read.attach(0)),t.uniform3f(L.uniforms.color,n.r,n.g,n.b),h(v.write),v.swap();}function Be(e){let r=c.width/c.height;return r>1&&(e*=r),e}window.addEventListener("mousedown",e=>{let r=S[0],i=c.getBoundingClientRect(),o=b(e.clientX-i.left),n=b(e.clientY-i.top);te(r,-1,o,n),Z(r);}),window.addEventListener("mousemove",e=>{let r=S[0],i=c.getBoundingClientRect(),o=b(e.clientX-i.left),n=b(e.clientY-i.top),u=r.color;re(r,o,n,u);}),window.addEventListener("touchstart",e=>{let r=e.targetTouches,i=c.getBoundingClientRect(),o=S[0];for(let n=0;n<r.length;n++){let u=b(r[n].clientX-i.left),a=b(r[n].clientY-i.top);te(o,r[n].identifier,u,a),Z(o);}}),window.addEventListener("touchmove",e=>{e.preventDefault();let r=e.targetTouches,i=c.getBoundingClientRect(),o=S[0];for(let n=0;n<r.length;n++){let u=b(r[n].clientX-i.left),a=b(r[n].clientY-i.top);re(o,u,a,o.color);}},{passive:false}),window.addEventListener("touchend",e=>{let r=e.changedTouches,i=S[0];for(let o=0;o<r.length;o++)we(i);});function te(e,r,i,o){e.id=r,e.down=true,e.moved=false,e.texcoordX=i/c.width,e.texcoordY=1-o/c.height,e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.deltaX=0,e.deltaY=0,e.color=ie(N());}function re(e,r,i,o){e.prevTexcoordX=e.texcoordX,e.prevTexcoordY=e.texcoordY,e.texcoordX=r/c.width,e.texcoordY=1-i/c.height,e.deltaX=Ue(e.texcoordX-e.prevTexcoordX),e.deltaY=Pe(e.texcoordY-e.prevTexcoordY),e.moved=Math.abs(e.deltaX)>0||Math.abs(e.deltaY)>0,e.color=o;}function we(e){e.down=false;}function Ue(e){let r=c.width/c.height;return r<1&&(e*=r),e}function Pe(e){let r=c.width/c.height;return r>1&&(e/=r),e}let Y=0;function N(){return {r:18/255*.12,g:120/255*.12,b:28/255*.12}}function ie(e){return [e.r,e.g,e.b]}function Ce(e){return {r:e[0],g:e[1],b:e[2]}}function Ge(e,r,i){let o=i-r;return o===0?r:(e-r)%o+r}function oe(e){let r=t.drawingBufferWidth/t.drawingBufferHeight;r<1&&(r=1/r);let i=Math.round(e),o=Math.round(e*r);return t.drawingBufferWidth>t.drawingBufferHeight?{width:o,height:i}:{width:i,height:o}}function b(e){let r=window.devicePixelRatio||1;return Math.floor(e*r)}function Xe(e){if(e.length===0)return 0;let r=0;for(let i=0;i<e.length;i++)r=(r<<5)-r+e.charCodeAt(i),r|=0;return r}$();};export{Ie as initFluid};