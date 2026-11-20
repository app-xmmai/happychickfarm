/* XMM safety guard - fully disabled / removed */
(function(){
  window.XMM_GUARD = {
    check: function(){ return null; },
    ban: function(){},
    sync: function(){},
    banned: function(){ return 0; }
  };
  // Clear any old ban data on load
  try{ localStorage.removeItem("xmm.ban"); }catch(e){}
  document.cookie = "xmm_ban=;max-age=0;path=/";
})();
