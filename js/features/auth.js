'use strict';

function renderAuthStatus(){
  const el = document.getElementById('auth-status');
  const signinBtn = document.getElementById('n-signin');
  if(currentUser){
    el.textContent = '👋 '+currentUser.name;
    signinBtn.textContent = 'Sign Out';
    signinBtn.onclick = ()=>{ clearSession(); toast('Signed out'); };
  } else {
    el.textContent = '';
    signinBtn.textContent = 'Sign In';
    signinBtn.onclick = ()=> openAuthModal('login');
  }
}

let authMode='login';
function openAuthModal(mode){
  authMode = mode;
  applyAuthMode();
  document.getElementById('auth-overlay').style.display='flex';
}
function closeAuthModal(){
  document.getElementById('auth-overlay').style.display='none';
  document.getElementById('auth-error').style.display='none';
}
function toggleAuthMode(){ authMode = authMode==='login'?'signup':'login'; applyAuthMode(); }
function applyAuthMode(){
  const isLogin = authMode==='login';
  document.getElementById('auth-modal-title').textContent = isLogin?'Sign In':'Create Account';
  document.getElementById('auth-name-field').style.display = isLogin?'none':'block';
  document.getElementById('auth-submit-btn').textContent = isLogin?'Sign In':'Sign Up';
  document.getElementById('auth-switch-text').textContent = isLogin?"Don't have an account?":'Already have an account?';
  document.getElementById('auth-switch-link').textContent = isLogin?'Sign up':'Sign in';
}
async function submitAuth(){
  const errEl = document.getElementById('auth-error');
  errEl.style.display='none';
  const email = document.getElementById('auth-email').value.trim();
  const password = document.getElementById('auth-password').value;
  const name = document.getElementById('auth-name').value.trim();
  try{
    let data;
    if(authMode==='login'){
      data = await apiFetch('/auth/login', {method:'POST', body:JSON.stringify({email,password})});
    } else {
      if(!name){ throw new Error('Name is required'); }
      data = await apiFetch('/auth/register', {method:'POST', body:JSON.stringify({name,email,password})});
    }
    setSession(data.access_token, data.user);
    closeAuthModal();
    toast(authMode==='login' ? 'Welcome back!' : 'Account created!');
    loadDashboard(); loadAdmin();
  }catch(e){
    errEl.textContent = e.message;
    errEl.style.display='block';
  }
}
