const planets={
 mercury:{cn:'水星',en:'MERCURY',title:'烈日边界',desc:'掠过太阳最近的世界，记录昼夜间极端的温差。',distance:'5791 万 km',delay:'3m 13s',color:'#a49b8b'},
 venus:{cn:'金星',en:'VENUS',title:'云层之下',desc:'穿透浓密的硫酸云，分析失控温室效应的成因。',distance:'1.08 亿 km',delay:'6m 02s',color:'#c88a4d'},
 earth:{cn:'地球',en:'EARTH',title:'蓝色基线',desc:'从月球轨道回望家园，建立生命世界的比较基准。',distance:'1.50 亿 km',delay:'8m 20s',color:'#3987a7'},
 mars:{cn:'火星',en:'MARS',title:'火星先锋',desc:'穿越稀薄大气，锁定奥林匹斯山脉的地质信号。',distance:'2.28 亿 km',delay:'12m 42s',color:'#bd5b3d'},
 jupiter:{cn:'木星',en:'JUPITER',title:'风暴之眼',desc:'扫描持续数百年的大红斑，测量气态巨行星的风速。',distance:'7.78 亿 km',delay:'43m 16s',color:'#b78b65'},
 saturn:{cn:'土星',en:'SATURN',title:'环中回声',desc:'穿行于冰与岩石构成的行星环，寻找牧羊卫星。',distance:'14.3 亿 km',delay:'79m 34s',color:'#c7b486'}
};
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const canvas=$('#starfield'),ctx=canvas.getContext('2d');let stars=[];
function resize(){canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;canvas.style.width=innerWidth+'px';canvas.style.height=innerHeight+'px';ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0);stars=Array.from({length:Math.min(330,innerWidth/4)},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:Math.random()*1.2+.15,a:Math.random()*.65+.1,s:Math.random()*.004+.001}))}
function draw(t=0){ctx.clearRect(0,0,innerWidth,innerHeight);let g=ctx.createRadialGradient(innerWidth*.55,innerHeight*.45,0,innerWidth*.55,innerHeight*.45,innerWidth*.7);g.addColorStop(0,'#10213b');g.addColorStop(.4,'#081322');g.addColorStop(1,'#02050c');ctx.fillStyle=g;ctx.fillRect(0,0,innerWidth,innerHeight);stars.forEach(s=>{ctx.globalAlpha=s.a*(.7+.3*Math.sin(t*s.s));ctx.fillStyle='#d9f1ff';ctx.beginPath();ctx.arc(s.x,s.y,s.r,0,7);ctx.fill()});ctx.globalAlpha=1;requestAnimationFrame(draw)}resize();addEventListener('resize',resize);draw();
function selectPlanet(key){const p=planets[key];if(!p)return;$$('[data-planet]').forEach(b=>b.classList.toggle('active',b.dataset.planet===key));$$('.planet').forEach(b=>b.classList.toggle('selected',b.dataset.planet===key));$('#planetCode').textContent=`${p.en} / ${p.cn}`;$('#missionTitle').textContent=p.title;$('#missionDesc').textContent=p.desc;$('#distance').textContent=p.distance;$('#delay').textContent=p.delay;showToast(`航线已切换：${p.cn}`)}
$$('[data-planet]').forEach(b=>b.addEventListener('click',()=>selectPlanet(b.dataset.planet)));
$$('.nav-item').forEach(b=>b.addEventListener('click',()=>{$$('.nav-item').forEach(n=>n.classList.toggle('active',n===b));$$('.view').forEach(v=>v.classList.toggle('active-view',v.id===b.dataset.view))}));
$('#soundBtn')?.addEventListener('click',()=>{});$('.sound-toggle').addEventListener('click',e=>{const on=e.currentTarget.getAttribute('aria-pressed')==='true';e.currentTarget.setAttribute('aria-pressed',String(!on));e.currentTarget.textContent=on?'⌁':'≋';showToast(on?'环境音已关闭':'环境音已开启')});
const archiveData=[['mercury','水星','太阳系中速度最快的行星'],['venus','金星','被厚重大气包裹的灼热世界'],['earth','地球','目前唯一确认存在生命的星球'],['mars','火星','拥有太阳系最高火山'],['jupiter','木星','质量超过其他行星总和的两倍'],['saturn','土星','拥有宏伟而轻薄的冰环'],['uranus','天王星','几乎横躺着环绕太阳'],['neptune','海王星','太阳系风速最高的世界']];
$('#archiveGrid').innerHTML=archiveData.map((p,i)=>`<button class="archive-card ${i>5?'locked':''}" ${i>5?'disabled':''}><div class="archive-orb" style="background:${planetBg(p[0])}"></div><small>ARCHIVE 0${i+1}</small><h3>${p[1]}</h3><p>${p[2]}</p></button>`).join('');
function planetBg(k){return {mercury:'#918b82',venus:'linear-gradient(135deg,#f0c172,#8b4d29)',earth:'linear-gradient(135deg,#69b76c,#1d649a)',mars:'linear-gradient(135deg,#e78a58,#742719)',jupiter:'repeating-linear-gradient(#d6b58a 0 12px,#8d5d42 13px 19px)',saturn:'linear-gradient(135deg,#e1d09f,#8d754f)',uranus:'#6bbfc4',neptune:'#315ac3'}[k]}
$('#launchBtn').addEventListener('click',()=>{const btn=$('#launchBtn');btn.innerHTML='<span>正在接收信号…</span><i>•••</i>';btn.disabled=true;setTimeout(()=>{btn.innerHTML='<span>探测完成</span><i>✓</i>';$('#progressText').textContent='3 / 5';$('#progressBar').style.width='60%';$('#activeObjective').innerHTML='<i class="check">✓</i> 扫描地表矿物';setTimeout(()=>{$('#modal').hidden=false},450)},1300)});
$('#closeModal').addEventListener('click',()=>$('#modal').hidden=true);$('#modal').addEventListener('click',e=>{if(e.target===$('#modal'))$('#modal').hidden=true});
$$('[data-answer]').forEach(b=>b.addEventListener('click',()=>{$$('[data-answer]').forEach(x=>x.classList.remove('correct','wrong'));const ok=b.dataset.answer==='correct';b.classList.add(ok?'correct':'wrong');$('#answerFeedback').textContent=ok?'回答正确 · +120 星尘已加入档案':'还差一点：奥林匹斯山约高 21.9 千米';if(ok)setTimeout(()=>{$('#modal').hidden=true;showToast('知识挑战完成 · +120 星尘')},1000)}));
$$('[data-scale-mode]').forEach(b=>b.addEventListener('click',()=>{$$('[data-scale-mode]').forEach(x=>x.classList.toggle('active',x===b));const real=b.dataset.scaleMode==='real';$('#scaleValue').textContent=real?'1 : 1（对数距离视图）':'1 : 5,900,000,000';$('#earthDistance').textContent=real?'实际平均距离 1.496 亿 km':'距离太阳约 26 米';showToast(real?'已切换真实比例':'已切换可视比例')}));
$('#scaleRange').addEventListener('input',e=>{const v=e.target.value;$('.scale-earth').style.left=v+'%';$('.scale-track span').style.width=v+'%';$('#earthDistance').textContent=`模型距离约 ${Math.round(v*.54)} 米`});
$('#challengeBtn').addEventListener('click',()=>{showToast('尺度挑战已启动：请把地球移动到 26 米');$('#scaleRange').focus()});
let toastTimer;function showToast(msg){const t=$('#toast');t.textContent=msg;t.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove('show'),1800)}

// Interactive flight controls: drag, zoom, hover scan and keyboard navigation.
const stage=$('.solar-stage'),world=$('#spaceWorld'),tooltip=$('#planetTooltip');
let sceneZoom=1,sceneRotation=0,sceneTilt=0,isDragging=false,lastPointer={x:0,y:0},orbiting=true,lastFrame=performance.now();
stage.tabIndex=0;
stage.insertAdjacentHTML('beforeend','<div class="view-kbd-hint"><kbd>拖拽</kbd> 旋转 · <kbd>滚轮</kbd> 缩放 · <kbd>R</kbd> 重置</div>');
function clamp(value,min,max){return Math.min(max,Math.max(min,value))}
function renderView(){
  world.style.setProperty('--scene-zoom',sceneZoom.toFixed(2));
  world.style.setProperty('--scene-rotation',sceneRotation.toFixed(1)+'deg');
  world.style.setProperty('--scene-tilt',sceneTilt.toFixed(1)+'deg');
  $('#zoomValue').textContent=Math.round(sceneZoom*100)+'%';
  $('#rotationValue').textContent=Math.round(sceneRotation%360)+'°';
  $('#tiltValue').textContent=Math.round(sceneTilt)+'°';
}
function setZoom(next,announce=false){sceneZoom=clamp(next,.68,1.75);renderView();if(announce)showToast(`星图缩放 ${Math.round(sceneZoom*100)}%`)}
function resetView(){sceneZoom=1;sceneRotation=0;sceneTilt=0;renderView();showToast('视角已归位')}
stage.addEventListener('pointerdown',e=>{if(e.target.closest('button'))return;isDragging=true;lastPointer={x:e.clientX,y:e.clientY};stage.classList.add('dragging');stage.setPointerCapture(e.pointerId)});
stage.addEventListener('pointermove',e=>{
  if(isDragging){sceneRotation+=(e.clientX-lastPointer.x)*.24;sceneTilt=clamp(sceneTilt-(e.clientY-lastPointer.y)*.12,-38,38);lastPointer={x:e.clientX,y:e.clientY};renderView();return}
  const rect=stage.getBoundingClientRect(),px=(e.clientX-rect.left)/rect.width-.5,py=(e.clientY-rect.top)/rect.height-.5;
  $('#starfield').style.transform=`translate(${px*-7}px,${py*-7}px) scale(1.02)`;
  $('.mission-panel').style.transform=`translate(${px*-5}px,${py*-4}px)`;
  $('.scene-copy').style.transform=`translate(${px*4}px,${py*3}px)`;
});
function endDrag(e){if(!isDragging)return;isDragging=false;stage.classList.remove('dragging');if(stage.hasPointerCapture(e.pointerId))stage.releasePointerCapture(e.pointerId)}
stage.addEventListener('pointerup',endDrag);stage.addEventListener('pointercancel',endDrag);stage.addEventListener('pointerleave',e=>{if(!isDragging){tooltip.classList.remove('visible');$('#starfield').style.transform='';$('.mission-panel').style.transform='';$('.scene-copy').style.transform=''}});
stage.addEventListener('wheel',e=>{e.preventDefault();setZoom(sceneZoom-e.deltaY*.0008)},{passive:false});
$('#zoomIn').addEventListener('click',()=>setZoom(sceneZoom+.12,true));$('#zoomOut').addEventListener('click',()=>setZoom(sceneZoom-.12,true));$('#resetView').addEventListener('click',resetView);
$('#orbitToggle').addEventListener('click',e=>{orbiting=!orbiting;e.currentTarget.classList.toggle('active',orbiting);e.currentTarget.setAttribute('aria-pressed',String(orbiting));showToast(orbiting?'轨道运动已开启':'轨道运动已暂停')});
function animateOrbit(now){const delta=Math.min(40,now-lastFrame);lastFrame=now;if(orbiting&&!isDragging&&$('#explore').classList.contains('active-view')){sceneRotation+=delta*.0022;renderView()}requestAnimationFrame(animateOrbit)}requestAnimationFrame(animateOrbit);
const targetPositions={mercury:['calc(61% - 23px)','calc(43% - 23px)'],venus:['calc(69% - 19px)','calc(66% - 19px)'],earth:['calc(78% - 18px)','calc(31% - 18px)'],mars:['calc(86% - 15px)','calc(70% - 15px)']};
$$('.planet').forEach(planet=>{
  const key=planet.dataset.planet,p=planets[key];
  planet.addEventListener('pointerenter',()=>{tooltip.innerHTML=`<strong>${p.cn}</strong> · ${p.en}<br><small>${p.distance}</small>`;tooltip.classList.add('visible');planet.classList.add('scanning')});
  planet.addEventListener('pointermove',e=>{const r=stage.getBoundingClientRect();tooltip.style.left=(e.clientX-r.left)+'px';tooltip.style.top=(e.clientY-r.top)+'px'});
  planet.addEventListener('pointerleave',()=>{tooltip.classList.remove('visible');planet.classList.remove('scanning')});
  planet.addEventListener('click',()=>{const pos=targetPositions[key];if(pos){$('.target-ring').style.left=pos[0];$('.target-ring').style.top=pos[1]}stage.classList.remove('scanning');void stage.offsetWidth;stage.classList.add('scanning');$('.mission-panel').classList.remove('focus-flash');void $('.mission-panel').offsetWidth;$('.mission-panel').classList.add('focus-flash')});
});
document.addEventListener('keydown',e=>{
  if(!$('#explore').classList.contains('active-view')||!$('#modal').hidden||!$('#planetShowcase').hidden)return;
  const key=e.key.toLowerCase();if(['arrowleft','arrowright','arrowup','arrowdown','+','-','=','r'].includes(key))e.preventDefault();
  if(key==='arrowleft')sceneRotation-=6;if(key==='arrowright')sceneRotation+=6;if(key==='arrowup')sceneTilt=clamp(sceneTilt-4,-38,38);if(key==='arrowdown')sceneTilt=clamp(sceneTilt+4,-38,38);if(key==='+'||key==='=')setZoom(sceneZoom+.08);if(key==='-')setZoom(sceneZoom-.08);if(key==='r')resetView();renderView();
});
$$('.archive-card:not(:disabled)').forEach((card,index)=>card.addEventListener('click',()=>{const key=archiveData[index][0];openShowcase(key,card)}));
$('#challengeBtn').addEventListener('click',()=>$('.scale-canvas').classList.add('challenge-active'));
$('#scaleRange').addEventListener('input',e=>{if(!$('.scale-canvas').classList.contains('challenge-active'))return;const distance=Math.round(e.target.value*.54);if(Math.abs(distance-26)<=1){$('.scale-canvas').classList.remove('challenge-active');$('#challengeBtn span').textContent='尺度挑战完成';$('#challengeBtn i').textContent='✓';showToast('定位成功 · 距离误差小于 1 米')}});
renderView();

// Game-style planet character showcase.
const showcaseData={
  mercury:{className:'mercury-showcase',classLabel:'TERRESTRIAL PLANET',bio:'距离太阳最近的岩石世界。没有大气保温的表面，在炽热白昼与冰冷长夜之间剧烈摆动。',trait:'昼夜极限',traitDesc:'同一颗行星上，温差可以超过 600°C。',diameter:'4,879 km',gravity:'0.38 G',day:'1,408 h',accent:'#b9b1a4'},
  venus:{className:'venus-showcase',classLabel:'TERRESTRIAL PLANET',bio:'被浓密云层封锁的金色世界。强烈温室效应让它成为太阳系表面最炽热的行星。',trait:'失控温室',traitDesc:'表面温度足以熔化铅，是气候研究的极端样本。',diameter:'12,104 km',gravity:'0.90 G',day:'2,802 h',accent:'#dda45f'},
  earth:{className:'earth-showcase',classLabel:'OCEAN WORLD',bio:'覆盖着液态海洋与动态大气的蓝色世界，也是目前唯一确认孕育生命的行星。',trait:'生命绿洲',traitDesc:'稳定的液态水、磁场与大气共同守护复杂生命。',diameter:'12,742 km',gravity:'1.00 G',day:'23.9 h',accent:'#54c9ed'},
  mars:{className:'mars-showcase',classLabel:'TERRESTRIAL PLANET',bio:'一颗寒冷而干燥的红色世界，保存着远古河流与火山活动留下的痕迹。',trait:'远古水世界',traitDesc:'地表峡谷与沉积物证明，液态水曾经塑造这颗行星。',diameter:'6,779 km',gravity:'0.38 G',day:'24.6 h',accent:'#e56943'},
  jupiter:{className:'jupiter-showcase',classLabel:'GAS GIANT',bio:'太阳系最大的行星。它的质量超过其他行星总和的两倍，并以强大引力重塑周围空间。',trait:'风暴之王',traitDesc:'大红斑是一场延续数百年、尺度超过地球的巨型风暴。',diameter:'139,820 km',gravity:'2.53 G',day:'9.9 h',accent:'#d9a071'},
  saturn:{className:'saturn-showcase',classLabel:'RINGED GIANT',bio:'由氢和氦构成的气态巨行星，身披由无数冰粒与岩石碎片组成的宏伟光环。',trait:'千环之冠',traitDesc:'主环宽达数十万公里，但平均厚度仅约十米。',diameter:'116,460 km',gravity:'1.07 G',day:'10.7 h',accent:'#d7c691'}
};
const showcaseOrder=['mercury','venus','earth','mars','jupiter','saturn'];
const showcase=$('#planetShowcase'),showcasePlanet=$('#showcasePlanet'),showcaseVisual=$('#showcaseVisual');
const planetRenderer=window.Planet3D?.mount($('#planet3dCanvas'))||null;
let showcaseKey='mars',showcaseRotation=0,showcaseTilt=0,showcaseScale=1,showcaseDragging=false,showcasePointer={x:0,y:0},lastPlanetTrigger=null;
function renderShowcase(key,animate=true){
  const p=planets[key],s=showcaseData[key],index=showcaseOrder.indexOf(key);showcaseKey=key;
  $('#showcaseClass').textContent=s.classLabel;$('#showcaseNumber').textContent=`NO. ${String(index+1).padStart(2,'0')}`;$('#showcaseCoordinate').textContent=`${String(index+1).padStart(2,'0')} / 08`;
  $('#showcaseName').textContent=p.cn;$('#showcaseEnglish').textContent=p.en;$('#showcaseBio').textContent=s.bio;$('#showcaseTrait').textContent=s.trait;$('#showcaseTraitDesc').textContent=s.traitDesc;$('#showcaseDiameter').textContent=s.diameter;$('#showcaseGravity').textContent=s.gravity;$('#showcaseDay').textContent=s.day;
  showcase.style.setProperty('--planet-accent',s.accent);showcasePlanet.className=`showcase-planet ${s.className}`;if(planetRenderer){showcasePlanet.classList.add('webgl-ready');planetRenderer.setPlanet(key)}showcaseRotation=0;showcaseTilt=0;showcaseScale=1;renderShowcaseTransform();
  if(animate){showcasePlanet.style.animation='none';void showcasePlanet.offsetWidth;showcasePlanet.style.animation='planetEntrance .8s cubic-bezier(.15,.85,.2,1),showcaseFloat 5s ease-in-out 1s infinite'}
  $('#showcaseIndex').innerHTML=showcaseOrder.map((planetKey,i)=>`<button aria-label="查看${planets[planetKey].cn}" data-showcase-key="${planetKey}" class="${i===index?'active':''}"></button>`).join('');
  $$('[data-showcase-key]').forEach(button=>button.addEventListener('click',()=>renderShowcase(button.dataset.showcaseKey)));
}
function renderShowcaseTransform(){showcasePlanet.style.setProperty('--planet-rotation',showcaseRotation+'deg');showcasePlanet.style.setProperty('--planet-tilt',showcaseTilt+'deg');showcasePlanet.style.setProperty('--planet-scale',showcaseScale.toFixed(2));planetRenderer?.setView(showcaseRotation,showcaseTilt,showcaseScale)}
function openShowcase(key,trigger){if(!showcaseData[key])return;lastPlanetTrigger=trigger||document.activeElement;renderShowcase(key,false);showcase.hidden=false;planetRenderer?.setActive(true);document.body.classList.add('showcase-open');requestAnimationFrame(()=>{$('#closeShowcase').focus();showcasePlanet.style.animation='planetEntrance .8s cubic-bezier(.15,.85,.2,1),showcaseFloat 5s ease-in-out 1s infinite'})}
function closeShowcase(){showcase.hidden=true;planetRenderer?.setActive(false);document.body.classList.remove('showcase-open');lastPlanetTrigger?.focus?.()}
$$('[data-planet]').forEach(button=>button.addEventListener('click',()=>openShowcase(button.dataset.planet,button)));
$('#closeShowcase').addEventListener('click',closeShowcase);$('#prevPlanet').addEventListener('click',()=>renderShowcase(showcaseOrder[(showcaseOrder.indexOf(showcaseKey)-1+showcaseOrder.length)%showcaseOrder.length]));$('#nextPlanet').addEventListener('click',()=>renderShowcase(showcaseOrder[(showcaseOrder.indexOf(showcaseKey)+1)%showcaseOrder.length]));
$('#showcaseMission').addEventListener('click',()=>{$('[data-view="explore"]').click();selectPlanet(showcaseKey);closeShowcase();$('.mission-panel').classList.add('focus-flash');showToast(`${planets[showcaseKey].cn}已加入远征序列`)});
$('#showcaseArchive').addEventListener('click',()=>{closeShowcase();$('[data-view="archive"]').click();showToast(`正在读取${planets[showcaseKey].cn}完整档案`)});
showcaseVisual.addEventListener('pointerdown',e=>{showcaseDragging=true;showcasePointer={x:e.clientX,y:e.clientY};showcaseVisual.classList.add('dragging');showcaseVisual.setPointerCapture(e.pointerId)});showcaseVisual.addEventListener('pointermove',e=>{if(!showcaseDragging)return;showcaseRotation+=(e.clientX-showcasePointer.x)*.45;showcaseTilt=clamp(showcaseTilt-(e.clientY-showcasePointer.y)*.28,-35,35);showcasePointer={x:e.clientX,y:e.clientY};renderShowcaseTransform()});
function endShowcaseDrag(e){if(!showcaseDragging)return;showcaseDragging=false;showcaseVisual.classList.remove('dragging');if(showcaseVisual.hasPointerCapture(e.pointerId))showcaseVisual.releasePointerCapture(e.pointerId)}showcaseVisual.addEventListener('pointerup',endShowcaseDrag);showcaseVisual.addEventListener('pointercancel',endShowcaseDrag);showcaseVisual.addEventListener('wheel',e=>{e.preventDefault();showcaseScale=clamp(showcaseScale-e.deltaY*.0007,.75,1.4);renderShowcaseTransform()},{passive:false});
document.addEventListener('keydown',e=>{if(showcase.hidden)return;if(e.key==='Escape')closeShowcase();if(e.key==='ArrowLeft')$('#prevPlanet').click();if(e.key==='ArrowRight')$('#nextPlanet').click()});
