const API = location.origin + '/api';
const token = localStorage.getItem('token');
if (token) { location.href = '/dashboard.html'; }