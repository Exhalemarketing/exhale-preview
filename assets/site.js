(function(){
  var EMAIL='alessandra@exhalemarketing.com';
  // Carry UTM params and the clicked CTA into the enquiry so you can see which link or section brought them in
  var params=new URLSearchParams(location.search), src=[];
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){if(params.get(k))src.push(k+'='+params.get(k));});
  var srcField=document.getElementById('f-source');
  function setSource(cta){srcField.value=src.concat(cta?['cta='+cta]:[]).concat(['page='+location.pathname+location.hash]).join('; ');}
  setSource('');
  document.querySelectorAll('[data-cta]').forEach(function(a){a.addEventListener('click',function(){setSource(a.getAttribute('data-cta'));});});

  // Hide the mobile sticky button once the form is on screen
  var sticky=document.querySelector('.sticky-cta'), contact=document.getElementById('contact');
  if('IntersectionObserver' in window&&sticky){new IntersectionObserver(function(e){sticky.classList.toggle('hide',e[0].isIntersecting);}).observe(contact);}

  var form=document.getElementById('enquiry'), status=document.getElementById('f-status');
  function v(n){return form.elements.namedItem(n).value;}
  function mailtoFallback(d){
    var body='Name: '+d.name+'\nOrganization: '+d.organization+'\nEmail: '+d.email+'\n\n'+d.message;
    return 'mailto:'+EMAIL+'?subject='+encodeURIComponent('Free 20-minute call request')+'&body='+encodeURIComponent(body);
  }
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    if(!form.checkValidity()){form.reportValidity();status.className='status err';status.textContent='Please fill in all four fields.';return;}
    if(v('_honey'))return;
    var d={name:v('name'),email:v('email'),organization:v('organization'),message:v('message'),source:srcField.value,_subject:'Free 20-minute call request from the Exhale services page',_template:'table',_captcha:'false'};
    var btn=form.querySelector('button');btn.disabled=true;status.className='status';status.textContent='Sending...';
    fetch('https://formsubmit.co/ajax/'+EMAIL,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(d)})
      .then(function(r){return r.json().then(function(j){if(!r.ok||String(j.success)!=='true')throw new Error(j.message||'failed');});})
      .then(function(){form.reset();status.className='status ok';status.textContent="Thank you. It's in my inbox, and I'll read it myself.";})
      .catch(function(){status.className='status err';status.innerHTML='Something went wrong on my end. <a href="'+mailtoFallback(d)+'">Send it by email instead</a> and it will come straight to me.';})
      .finally(function(){btn.disabled=false;});
  });
})();
