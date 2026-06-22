(function(){
  const planetTypes={mercury:0,venus:1,earth:2,mars:3,jupiter:4,saturn:5};
  const vertexSource=`
    attribute vec3 aPosition;attribute vec3 aNormal;attribute vec2 aUv;
    uniform mat4 uProjection;uniform vec2 uRotation;uniform float uScale;uniform float uRing;
    varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUv;varying float vRing;
    mat3 rotY(float a){float c=cos(a),s=sin(a);return mat3(c,0.,-s,0.,1.,0.,s,0.,c);}
    mat3 rotX(float a){float c=cos(a),s=sin(a);return mat3(1.,0.,0.,0.,c,s,0.,-s,c);}
    void main(){mat3 rotation=rotX(uRotation.y)*rotY(uRotation.x);vec3 base=uRing>.5?rotX(.92)*aPosition:aPosition;vec3 baseNormal=uRing>.5?rotX(.92)*aNormal:aNormal;vec3 p=rotation*base*uScale;vec3 n=normalize(rotation*baseNormal);p.z-=3.25;vPosition=p;vNormal=n;vUv=aUv;vRing=uRing;gl_Position=uProjection*vec4(p,1.);}
  `;
  const fragmentSource=`
    precision highp float;varying vec3 vNormal;varying vec3 vPosition;varying vec2 vUv;varying float vRing;
    uniform float uType;uniform float uTime;
    float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
    float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1,0)),f.x),mix(hash(i+vec2(0,1)),hash(i+vec2(1)),f.x),f.y);}
    float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*noise(p);p=p*2.03+7.1;a*=.5;}return v;}
    vec3 surface(float type,vec2 uv){
      float n=fbm(uv*vec2(14.,7.)+vec2(uTime*.004,0.));
      if(type<.5){float crater=smoothstep(.79,.84,noise(floor(uv*22.)));return mix(vec3(.22,.21,.19),vec3(.69,.66,.59),n)-crater*.14;}
      if(type<1.5){float clouds=sin(uv.y*58.+fbm(uv*8.)*7.)*.5+.5;return mix(vec3(.42,.19,.08),vec3(.96,.68,.30),clouds*.65+n*.25);}
      if(type<2.5){float land=smoothstep(.47,.59,fbm(uv*vec2(9.,5.)+3.));vec3 ocean=mix(vec3(.02,.14,.32),vec3(.02,.43,.64),n);vec3 ground=mix(vec3(.16,.32,.11),vec3(.52,.48,.19),n);float cloud=smoothstep(.66,.76,fbm(uv*vec2(18.,8.)+vec2(uTime*.01,0.)));vec3 c=mix(ocean,ground,land);return mix(c,vec3(.9,.96,1.),cloud*.7);}
      if(type<3.5){float dark=smoothstep(.45,.68,fbm(uv*vec2(12.,6.)+4.));float ice=smoothstep(.87,.96,abs(uv.y-.5)*2.);return mix(mix(vec3(.33,.08,.035),vec3(.78,.25,.10),dark),vec3(.88,.75,.61),ice);}
      if(type<4.5){float bands=sin(uv.y*92.+fbm(uv*vec2(5.,18.))*4.)*.5+.5;vec3 c=mix(vec3(.35,.16,.12),vec3(.88,.70,.48),bands);vec2 d=(uv-vec2(.72,.63))*vec2(3.2,8.);float spot=1.-smoothstep(.45,.58,length(d));return mix(c,vec3(.64,.17,.08),spot*.85);}
      float bands=sin(uv.y*72.+fbm(uv*vec2(5.,14.))*2.)*.5+.5;return mix(vec3(.46,.37,.22),vec3(.88,.79,.56),bands*.72+n*.16);
    }
    void main(){
      if(vRing>.5){float stripe=sin(vUv.x*220.)*.5+.5;vec3 rc=mix(vec3(.48,.40,.28),vec3(.92,.85,.68),stripe);float edge=smoothstep(0.,.06,vUv.y)*smoothstep(1.,.94,vUv.y);gl_FragColor=vec4(rc,.52*edge);return;}
      vec3 n=normalize(vNormal),light=normalize(vec3(-.65,.65,.9)),view=normalize(-vPosition);float diffuse=max(dot(n,light),0.);float rim=pow(1.-max(dot(n,view),0.),2.4);float spec=pow(max(dot(reflect(-light,n),view),0.),28.);
      vec3 base=surface(uType,vUv);vec3 color=base*(.18+diffuse*.92)+spec*.24+rim*base*.42;gl_FragColor=vec4(pow(color,vec3(.9)),1.);
    }
  `;
  function shader(gl,type,source){const s=gl.createShader(type);gl.shaderSource(s,source);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS))throw new Error(gl.getShaderInfoLog(s));return s;}
  function program(gl){const p=gl.createProgram();gl.attachShader(p,shader(gl,gl.VERTEX_SHADER,vertexSource));gl.attachShader(p,shader(gl,gl.FRAGMENT_SHADER,fragmentSource));gl.linkProgram(p);if(!gl.getProgramParameter(p,gl.LINK_STATUS))throw new Error(gl.getProgramInfoLog(p));return p;}
  function sphere(rows=48,cols=72){const pos=[],norm=[],uv=[],idx=[];for(let y=0;y<=rows;y++){const v=y/rows,phi=v*Math.PI;for(let x=0;x<=cols;x++){const u=x/cols,theta=u*Math.PI*2,s=Math.sin(phi);const px=s*Math.cos(theta),py=Math.cos(phi),pz=s*Math.sin(theta);pos.push(px,py,pz);norm.push(px,py,pz);uv.push(u,1-v)}}for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){const a=y*(cols+1)+x,b=a+cols+1;idx.push(a,b,a+1,b,b+1,a+1)}return{pos,norm,uv,idx};}
  function ring(segments=160){const pos=[],norm=[],uv=[],idx=[];for(let i=0;i<=segments;i++){const a=i/segments*Math.PI*2,c=Math.cos(a),s=Math.sin(a);for(let r=0;r<2;r++){const radius=r?1.52:1.10;pos.push(c*radius,0,s*radius);norm.push(0,1,0);uv.push(i/segments,r)}}for(let i=0;i<segments;i++){const a=i*2;idx.push(a,a+1,a+2,a+1,a+3,a+2)}return{pos,norm,uv,idx};}
  function perspective(fov,aspect,near,far){const f=1/Math.tan(fov/2),nf=1/(near-far);return new Float32Array([f/aspect,0,0,0,0,f,0,0,0,0,(far+near)*nf,-1,0,0,2*far*near*nf,0]);}
  function createBuffers(gl,mesh){function buffer(target,data){const b=gl.createBuffer();gl.bindBuffer(target,b);gl.bufferData(target,data,gl.STATIC_DRAW);return b}return{position:buffer(gl.ARRAY_BUFFER,new Float32Array(mesh.pos)),normal:buffer(gl.ARRAY_BUFFER,new Float32Array(mesh.norm)),uv:buffer(gl.ARRAY_BUFFER,new Float32Array(mesh.uv)),index:buffer(gl.ELEMENT_ARRAY_BUFFER,new Uint16Array(mesh.idx)),count:mesh.idx.length};}
  function mount(canvas){
    const gl=canvas.getContext('webgl',{alpha:true,antialias:true,premultipliedAlpha:false});if(!gl)return null;let prog;try{prog=program(gl)}catch(e){console.warn('WebGL planet shader unavailable',e);return null}gl.useProgram(prog);
    const sphereBuffer=createBuffers(gl,sphere()),ringBuffer=createBuffers(gl,ring());const attr={position:gl.getAttribLocation(prog,'aPosition'),normal:gl.getAttribLocation(prog,'aNormal'),uv:gl.getAttribLocation(prog,'aUv')};const uni={projection:gl.getUniformLocation(prog,'uProjection'),rotation:gl.getUniformLocation(prog,'uRotation'),scale:gl.getUniformLocation(prog,'uScale'),type:gl.getUniformLocation(prog,'uType'),time:gl.getUniformLocation(prog,'uTime'),ring:gl.getUniformLocation(prog,'uRing')};let type=3,yaw=0,pitch=0,scale=1,active=false,start=performance.now();
    function bind(buffers){[[attr.position,buffers.position,3],[attr.normal,buffers.normal,3],[attr.uv,buffers.uv,2]].forEach(([loc,b,size])=>{gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,size,gl.FLOAT,false,0,0)});gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER,buffers.index)}
    function resize(){const dpr=Math.min(1.2,devicePixelRatio||1),ratio=canvas.clientWidth/Math.max(1,canvas.clientHeight),rawW=Math.round(canvas.clientWidth*dpr),rawH=Math.round(canvas.clientHeight*dpr),w=Math.max(2,Math.min(640,rawW)),h=Math.max(2,Math.min(640,rawH));if(canvas.width!==w||canvas.height!==h){canvas.width=w;canvas.height=h;gl.viewport(0,0,w,h)}return ratio}
    let lastDraw=0;function frame(now){if(active&&now-lastDraw>30){lastDraw=now;const aspect=resize();gl.clearColor(0,0,0,0);gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.useProgram(prog);gl.uniformMatrix4fv(uni.projection,false,perspective(Math.PI/3.2,aspect,.1,20));gl.uniform2f(uni.rotation,yaw+(now-start)*.00012,pitch);gl.uniform1f(uni.scale,scale);gl.uniform1f(uni.type,type);gl.uniform1f(uni.time,(now-start)*.001);gl.uniform1f(uni.ring,0);bind(sphereBuffer);gl.drawElements(gl.TRIANGLES,sphereBuffer.count,gl.UNSIGNED_SHORT,0);if(type===5){gl.disable(gl.CULL_FACE);gl.enable(gl.BLEND);gl.blendFunc(gl.SRC_ALPHA,gl.ONE_MINUS_SRC_ALPHA);gl.depthMask(false);gl.uniform1f(uni.ring,1);bind(ringBuffer);gl.drawElements(gl.TRIANGLES,ringBuffer.count,gl.UNSIGNED_SHORT,0);gl.depthMask(true);gl.disable(gl.BLEND)}}requestAnimationFrame(frame)}requestAnimationFrame(frame);
    return{setPlanet(key){type=planetTypes[key]??3;start=performance.now()},setView(rotation,tilt,nextScale){yaw=rotation*Math.PI/180;pitch=tilt*Math.PI/180;scale=nextScale},setActive(value){active=value},gl};
  }
  window.Planet3D={mount};
})();
