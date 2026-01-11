let adb; // achievementDB
openAchieveDB();
function openAchieveDB() {
  const req = indexedDB.open('achieve', 1);
  req.onupgradeneeded = e => {
    adb = e.target.result;
    if (!adb.objectStoreNames.contains('badges')) adb.createObjectStore('badges', { keyPath: 'name' });
  };
  req.onsuccess = e => adb = e.target.result;
}

function unlockBadge(task) {
  const tx = adb.transaction('badges', 'readwrite');
  const store = tx.objectStore('badges');
  const lvl = task.level || 1;
  const badge = {
    name: task.name,
    level: lvl,
    ts: Date.now(),
    icon: drawBadge(lvl)
  };
  store.put(badge);
  renderBadges();
}

function drawBadge(lvl) {
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const color = ['#888', '#2AF', '#F22'][lvl - 1] || '#F22';
  ctx.fillStyle = color;
  ctx.beginPath(); ctx.arc(64, 64, 60, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px Arial'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('Lv' + lvl, 64, 64);
  return canvas.toDataURL();
}

function renderBadges() {
  const box = document.getElementById('badgeBox');
  box.innerHTML = '';
  const tx = adb.transaction('badges').objectStore('badges');
  tx.getAll().onsuccess = e => {
    e.target.result.forEach(b => {
      const img = new Image();
      img.src = b.icon;
      img.title = `${b.name} · ${new Date(b.ts).toLocaleString()}`;
      box.appendChild(img);
    });
  };
}
