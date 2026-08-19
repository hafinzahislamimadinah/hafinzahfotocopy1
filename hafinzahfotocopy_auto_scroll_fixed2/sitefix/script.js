const menuToggle=document.querySelector(".menu-toggle");
const navMenu=document.querySelector(".nav-menu");
if(menuToggle){menuToggle.addEventListener("click",()=>navMenu.classList.toggle("active"));}
document.querySelectorAll(".nav-menu a").forEach(link=>link.addEventListener("click",()=>navMenu.classList.remove("active")));
const navbar=document.querySelector(".navbar");
window.addEventListener("scroll",()=>{navbar.style.boxShadow=window.scrollY>30?"0 8px 30px rgba(0,0,0,.05)":"none"},{passive:true});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.style.opacity="1";
      entry.target.style.transform="translateY(0)";
    }
  });
},{threshold:.15});
document.querySelectorAll(".service-card,.why-card,.about-content").forEach(element=>{
  element.style.opacity="0";
  element.style.transform="translateY(25px)";
  element.style.transition="all .7s ease";
  observer.observe(element);
});

/* AUTO SCROLL */
(function(){
  const IDLE_DELAY=2000;
  const SPEED=45;
  const TOP_TIME=350;
  let timer=null;
  let frame=null;
  let running=false;
  let last=0;
  let ignoreScrollUntil=0;

  // Important: the original CSS used scroll-behavior:smooth.
  // Auto-scroll needs instant scrolling on every animation frame.
  const oldScrollBehavior=document.documentElement.style.scrollBehavior;

  function maxY(){
    return Math.max(0, document.documentElement.scrollHeight-window.innerHeight);
  }

  function stopAndWait(){
    running=false;
    if(frame!==null) cancelAnimationFrame(frame);
    frame=null;
    clearTimeout(timer);
    timer=setTimeout(start,IDLE_DELAY);
  }

  function start(){
    clearTimeout(timer);
    if(maxY()<=5) return;
    running=true;
    document.documentElement.style.scrollBehavior="auto";
    last=performance.now();
    frame=requestAnimationFrame(loop);
  }

  function loop(now){
    if(!running) return;
    const max=maxY();
    if(max<=5){running=false;frame=null;return;}

    const dt=Math.min((now-last)/1000,0.05);
    last=now;
    const y=window.pageYOffset || document.documentElement.scrollTop || 0;

    if(y>=max-2){
      const from=y;
      const started=now;
      function toTop(t){
        if(!running)return;
        const p=Math.min(1,(t-started)/TOP_TIME);
        const eased=1-Math.pow(1-p,3);
        ignoreScrollUntil=performance.now()+50;
        window.scrollTo(0,from*(1-eased));
        if(p<1){
          frame=requestAnimationFrame(toTop);
        }else{
          window.scrollTo({top:0,left:0,behavior:"auto"});
          last=performance.now();
          frame=requestAnimationFrame(loop);
        }
      }
      frame=requestAnimationFrame(toTop);
      return;
    }

    const next=Math.min(max,y+SPEED*dt);
    ignoreScrollUntil=performance.now()+50;
    window.scrollTo(0,next);
    frame=requestAnimationFrame(loop);
  }

  // Only real user actions reset the idle timer.
  // Do NOT use scroll events, because auto-scroll itself creates scroll events.
  ["wheel","mousedown","touchstart","touchmove","pointerdown","keydown","click"].forEach(type=>{
    window.addEventListener(type,()=>{
      if(running){
        running=false;
        if(frame!==null)cancelAnimationFrame(frame);
        frame=null;
      }
      clearTimeout(timer);
      timer=setTimeout(start,IDLE_DELAY);
    },{passive:type!=="keydown"});
  });

  // Start exactly 2 seconds after initial page load.
  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",()=>{
      clearTimeout(timer);
      timer=setTimeout(start,IDLE_DELAY);
    },{once:true});
  }else{
    timer=setTimeout(start,IDLE_DELAY);
  }
})();
