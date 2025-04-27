window.setup = {};
setup.showPopup = function(id) {
   document.getElementById(id).style.display='block',
   document.getElementById(id).style.visibility='visible'
}
setup.closePopup = function(id) {
   document.getElementById(id).style.display='none';
   document.getElementById(id).style.visibility='hidden';
}