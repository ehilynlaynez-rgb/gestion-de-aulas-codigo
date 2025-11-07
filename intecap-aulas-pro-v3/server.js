
require('dotenv').config();
const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, { cors:{ origin:'*' } });
const cors = require('cors');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');

const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secreto_cambia_esto';

app.use(cors());
app.use(express.json({limit:'10mb'}));
app.use(express.urlencoded({extended:true}));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database(path.join(__dirname,'db.sqlite'));

function runSqlFile(file){
  const sql = fs.readFileSync(file, 'utf-8');
  db.exec(sql, (err)=>{ if(err) console.error('SQL error:', err.message); });
}
runSqlFile(path.join(__dirname,'schema.sql'));
db.get("SELECT COUNT(*) c FROM users", (err,row)=>{
  if(row && row.c===0) runSqlFile(path.join(__dirname,'seed.sql'));
});

// Uploads
const storage = multer.diskStorage({
  destination: (req,file,cb)=> cb(null, path.join(__dirname,'uploads')),
  filename: (req,file,cb)=>{
    const unique = Date.now()+'-'+Math.round(Math.random()*1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, 'damage-'+unique+ext);
  }
});
const upload = multer({ storage, limits:{fileSize:5*1024*1024},
  fileFilter:(req,file,cb)=>{
    const ok = ['.png','.jpg','.jpeg','.webp'].includes(path.extname(file.originalname).toLowerCase());
    if(!ok) return cb(new Error('Tipo no permitido'));
    cb(null,true);
  }
});

// Auth helpers
function auth(req,res,next){
  const h = req.headers.authorization||'';
  const t = h.startsWith('Bearer ')? h.slice(7): null;
  if(!t) return res.status(401).json({error:'No autorizado'});
  try{ req.user = jwt.verify(t, JWT_SECRET); next(); }
  catch(e){ return res.status(401).json({error:'Token inválido'}); }
}
function requireRole(role){
  return (req,res,next)=>{
    if(req.user.role==='admin' || req.user.role===role) return next();
    return res.status(403).json({error:'Permisos insuficientes'});
  };
}

// socket
io.on('connection',()=>{});
function emit(type,payload){
  io.emit('event', {type,payload,at:new Date().toISOString()});
}

// Simple alive route
app.get('/api/alive', (req,res)=> res.json({ok:true}));

app.get('*', (req,res)=> res.sendFile(path.join(__dirname,'public','index.html')));

http.listen(PORT, ()=> console.log('Servidor http://localhost:'+PORT));
