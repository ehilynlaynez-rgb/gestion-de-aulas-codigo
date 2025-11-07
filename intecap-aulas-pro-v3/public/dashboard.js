const API = location.origin + '/api';
const token = localStorage.getItem('token');
if (!token) location.href = '/';

// fake user (only name/role for navbar demo)
const user = JSON.parse(localStorage.getItem('user') || '{"name":"Demo","role":"admin"}');
document.getElementById('who').textContent = `${user.name} · ${user.role}`;
document.getElementById('logout').onclick = () => { localStorage.clear(); location.href='/'; };
if (user.role === 'admin') document.getElementById('adminLink').classList.remove('hidden');
if (user.role === 'tecnico' || user.role === 'admin') document.getElementById('techLink').classList.remove('hidden');

async function loadRooms(){
  // placeholder rooms (front demo), in real UI call /api/rooms
  const rooms = [
    {id:1,name:'Aula 1',module:'Módulo 1',color:'#22c55e',is_occupied:0},
    {id:2,name:'Aula 3',module:'Módulo 1',color:'#eab308',is_occupied:1},
    {id:3,name:'Aula 4',module:'Módulo 1',color:'#06b6d4',is_occupied:0},
  ];
  const c = document.getElementById('rooms');
  c.innerHTML = '';
  rooms.forEach(r => {
    const card = document.createElement('div');
    card.className = 'rounded-xl p-4 bg-slate-900/60 border border-slate-800';
    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <span class="inline-block w-3 h-3 rounded-full" style="background:${r.color}"></span>
          <div>
            <div class="text-sm text-slate-400">${r.module}</div>
            <div class="text-xl font-bold">${r.name}</div>
          </div>
        </div>
        <div class="text-right">
          <div class="text-xs ${r.is_occupied? 'text-red-400':'text-emerald-400'}">${r.is_occupied? 'Ocupada':'Libre'}</div>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap gap-2">
        ${r.is_occupied ? `<button data-room="${r.id}" data-action="release" class="px-3 py-2 rounded-lg bg-slate-800">Liberar</button>`
                         : `<button data-room="${r.id}" data-action="reserve" class="px-3 py-2 rounded-lg bg-cyan-700">Reservar</button>`}
        <button data-room="${r.id}" data-action="toggle" class="px-3 py-2 rounded-lg bg-slate-800">Ver recursos</button>
      </div>
      <div id="res-${r.id}" class="mt-3 hidden text-sm"></div>
    `;
    c.appendChild(card);
  });
  c.querySelectorAll('button').forEach(btn => {
    btn.onclick = async () => {
      const room_id = +btn.dataset.room;
      const action = btn.dataset.action;
      if (action === 'reserve') {
        openReserveModal(room_id);
      } else if (action === 'toggle') {
        const div = document.getElementById('res-'+room_id);
        if (div.classList.contains('hidden')) {
          div.classList.remove('hidden');
          // demo resources list with origin color badge
          const list = [
            {name:'Escritorio', code:'I-304-56413', origin_color:'#22c55e', origin:'own'},
            {name:'Escritorio', code:'I-304-72879', origin_color:'#22c55e', origin:'own'}
          ];
          div.innerHTML = list.map(x=>{
            return `<div class="flex items-center gap-2">
              <span class="inline-block w-2.5 h-2.5 rounded-full" style="background:${x.origin_color}"></span>
              <span>${x.name}</span><span class="text-slate-400">${x.code}</span>
            </div>`;
          }).join('');
        } else {
          div.classList.add('hidden');
        }
      }
    };
  });
}
function openReserveModal(room_id){
  document.getElementById('res_room').value = room_id;
  const now = new Date();
  const start = new Date(now.getTime()+5*60*1000);
  const end = new Date(start.getTime()+60*60*1000);
  const toLocal = (d)=> new Date(d.getTime()-d.getTimezoneOffset()*60000).toISOString().slice(0,16);
  document.getElementById('res_start').value = toLocal(start);
  document.getElementById('res_end').value = toLocal(end);
  document.getElementById('reserveModal').classList.remove('hidden');
  document.getElementById('reserveModal').classList.add('flex');
}
document.getElementById('closeReserve').onclick = ()=>{
  document.getElementById('reserveModal').classList.add('hidden');
  document.getElementById('reserveModal').classList.remove('flex');
};
document.getElementById('reserveForm').onsubmit = async (e)=>{
  e.preventDefault();
  if (window.$toast) $toast('Reserva enviada ✅','success');
  document.getElementById('closeReserve').click();
  // real app: POST /api/reservations with start/end
};
loadRooms();