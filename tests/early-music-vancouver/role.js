(function(){
  var sticky=document.querySelector('.sticky-cta'), contact=document.getElementById('contact');
  if('IntersectionObserver' in window&&sticky&&contact){
    new IntersectionObserver(function(e){sticky.classList.toggle('hide',e[0].isIntersecting);}).observe(contact);
  }
})();
