'use strict';

/* ══════════════════════════════════════════════════════════════════════════
   API CLIENT
══════════════════════════════════════════════════════════════════════════*/
const API_BASE = (window.ARCHITECTIQ_API_BASE) || 'http://localhost:8000/api';
let authToken = localStorage.getItem('aiq_token') || null;
let currentUser = JSON.parse(localStorage.getItem('aiq_user') || 'null');

async function apiFetch(path, opts={}){
  const headers = Object.assign({'Content-Type':'application/json'}, opts.headers||{});
  if(authToken) headers['Authorization'] = 'Bearer '+authToken;
  const res = await fetch(API_BASE+path, Object.assign({}, opts, {headers}));
  if(!res.ok){
    let detail = 'Request failed';
    try{ const j = await res.json(); detail = j.error || j.detail || detail; }catch(e){}
    throw new Error(detail);
  }
  if(res.status===204) return null;
  return res.json();
}

function setSession(token, user){
  authToken = token; currentUser = user;
  localStorage.setItem('aiq_token', token);
  localStorage.setItem('aiq_user', JSON.stringify(user));
  renderAuthStatus();
}
function clearSession(){
  authToken=null; currentUser=null;
  localStorage.removeItem('aiq_token'); localStorage.removeItem('aiq_user');
  renderAuthStatus();
}
