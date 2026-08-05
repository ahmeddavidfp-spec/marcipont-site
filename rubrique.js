(function(){
  "use strict";
  var reduce=window.matchMedia("(prefers-reduced-motion:reduce)").matches;

  var themeBtn=document.getElementById("themeBtn");
  if(themeBtn)themeBtn.addEventListener("click",function(){
    var cur=document.documentElement.getAttribute("data-theme");
    if(!cur)cur=window.matchMedia("(prefers-color-scheme:dark)").matches?"dark":"light";
    document.documentElement.setAttribute("data-theme",cur==="dark"?"light":"dark");
  });

  var burger=document.getElementById("burger"),mm=document.getElementById("mobileMenu");
  function closeMenu(){if(mm){mm.classList.remove("open");}if(burger)burger.setAttribute("aria-expanded","false");}
  if(burger)burger.addEventListener("click",function(){mm.classList.add("open");burger.setAttribute("aria-expanded","true");});
  if(mm)mm.addEventListener("click",function(e){if(e.target.hasAttribute("data-close")||e.target.closest("[data-close]"))closeMenu();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeMenu();});

  var reveals=document.querySelectorAll(".reveal");
  if("IntersectionObserver" in window && !reduce){
    var io=new IntersectionObserver(function(en){en.forEach(function(e){if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target);}});},{threshold:0.12,rootMargin:"0px 0px -8% 0px"});
    reveals.forEach(function(el){io.observe(el);});
  }else{reveals.forEach(function(el){el.classList.add("in");});}

  var y=document.getElementById("year");
  if(y){try{y.textContent=new Date().getFullYear();}catch(e){}}
})();
