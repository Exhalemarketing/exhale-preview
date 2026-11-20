(function(){
  var EMAIL='alessandra@exhalemarketing.com';
  var params=new URLSearchParams(location.search), src=[];
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(function(k){if(params.get(k))src.push(k+'='+params.get(k));});
  var srcField=document.getElementById('f-source');
  function setSource(cta){if(!srcField)return;srcField.value=src.concat(cta?['cta='+cta]:[]).concat(['page='+location.pathname+location.hash]).join('; ');}
  setSource('');
  document.querySelectorAll('[data-cta]').forEach(function(a){a.addEventListener('click',function(){setSource(a.getAttribute('data-cta'));});});

  var sticky=document.querySelector('.sticky-cta'), contact=document.getElementById('contact');
  if('IntersectionObserver' in window&&sticky&&contact){new IntersectionObserver(function(e){sticky.classList.toggle('hide',e[0].isIntersecting);}).observe(contact);}

  var form=document.getElementById('enquiry'), status=document.getElementById('f-status');
  if(!form)return;
  function v(n){return form.elements.namedItem(n).value;}
  var subjectEl=form.elements.namedItem('_subject');
  var defaultSubject=subjectEl?subjectEl.value:'Conversation about a role, from an Exhale page';
  function mailtoFallback(d){
    var body='Name: '+d.name+'\nOrganization: '+d.organization+'\nRole: '+(d.role||'')+'\nEmail: '+d.email+'\n\n'+d.message;
    return 'mailto:'+EMAIL+'?subject='+encodeURIComponent(defaultSubject)+'&body='+encodeURIComponent(body);
  }
  form.addEventListener('submit',function(ev){
    ev.preventDefault();
    if(!form.checkValidity()){form.reportValidity();status.className='status err';status.textContent='Please fill in the required fields.';return;}
    if(v('_honey'))return;
    var roleField=form.elements.namedItem('role');
    var d={name:v('name'),email:v('email'),organization:v('organization'),message:v('message'),role:roleField?roleField.value:'',source:srcField?srcField.value:'',_subject:defaultSubject,_template:'table',_captcha:'false'};
    var btn=form.querySelector('button');btn.disabled=true;status.className='status';status.textContent='Sending...';
    fetch('https://formsubmit.co/ajax/'+EMAIL,{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},body:JSON.stringify(d)})
      .then(function(r){return r.json().then(function(j){if(!r.ok||String(j.success)!=='true')throw new Error(j.message||'failed');});})
      .then(function(){form.reset();status.className='status ok';status.textContent="Thank you. It's in my inbox, and I'll read it myself.";})
      .catch(function(){status.className='status err';status.innerHTML='Something went wrong on my end. <a href="'+mailtoFallback(d)+'">Send it by email instead</a> and it will come straight to me.';})
      .finally(function(){btn.disabled=false;});
  });
})();
