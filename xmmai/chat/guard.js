/* XMM safety guard - FULLY REMOVED in v183 */
(function(){
  // Nuke any old ban data immediately
  try{ localStorage.removeItem("xmm.ban"); localStorage.removeItem("xmm_ban"); }catch(e){}
  document.cookie = "xmm_ban=;max-age=0;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "xmm.ban=;max-age=0;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";

  // Completely empty API - nothing can ban or lock
  window.XMM_GUARD = {
    check: function(){ return null; },
    ban: function(){},
    sync: function(){},
    banned: function(){ return 0; }
  };

  // Also remove any leftover ban overlay if present
  function killBan(){
    var el = document.getElementById("xmmBan");
    if(el) el.remove();
    document.documentElement.classList.remove("xmm-banned");
    var css = document.getElementById("xmmBanCss");
    if(css) css.remove();
  }
  killBan();
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", killBan);
  else setTimeout(killBan, 50);
})();
