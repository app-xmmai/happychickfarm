/* XMM safety guard - FULLY REMOVED in v184 */
(function(){
  try{ localStorage.removeItem("xmm.ban"); localStorage.removeItem("xmm_ban"); }catch(e){}
  document.cookie = "xmm_ban=;max-age=0;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie = "xmm.ban=;max-age=0;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT";

  window.XMM_GUARD = {
    check: function(){ return null; },
    ban: function(){},
    sync: function(){},
    banned: function(){ return 0; }
  };

  function killBan(){
    var el = document.getElementById("xmmBan");
    if(el) el.remove();
    document.documentElement.classList.remove("xmm-banned");
    var css = document.getElementById("xmmBanCss");
    if(css) css.remove();
  }
  killBan();
  if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", killBan);
  else setTimeout(killBan, 30);
  setInterval(killBan, 2000); // keep killing if something tries to re-add it
})();
