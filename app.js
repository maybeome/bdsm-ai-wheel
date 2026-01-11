// 用这段直接替换整个 app.js 内容
const TASKS = [
  {name:"真空下楼丢垃圾", level:1, items:["DG-LAB","记号笔"], clothes:"超短T恤+短裙，no bra", place:"楼梯间 23:00 后", bondage:"自缚手腕", pics:3},
  {name:"深夜阳台赤裸自拍", level:2, items:["DG-LAB"], clothes:"全裸", place:"自家阳台 00:30 后", bondage:"无", pics:3},
  {name:"车内真空下车10秒", level:3, items:["DG-LAB"], clothes:"风衣+真空", place:"地下停车场死角", bondage:"无", pics:2},
  {name:"乳夹+拍屁股50下", level:2, items:["DG-LAB","乳夹","皮带"], clothes:"居家即可", place:"卧室", bondage:"自缚脚踝", pics:2}
];

let wheel, current;

document.addEventListener('DOMContentLoaded', () => {
  initWheel();
  document.getElementById('spinBtn').onclick = () => {
    wheel.startAnimation();
    document.getElementById('spinBtn').disabled = true;
  };
});

function initWheel(){
  const segments = TASKS.map((t,i)=>({text:t.name, fillStyle:'#'+Math.random().toString(16).slice(-6)}));
  wheel = new Winwheel({
    numSegments: segments.length,
    segments: segments,
    outerRadius: 150,
    textFontSize: 14,
    animation: {type:'spinToStop', duration:5, spins:8, callbackFinished: showTask}
  });
}

async function showTask(){
  const idx = wheel.getIndicatedSegmentNumber()-1;
  current = TASKS[idx];
  document.getElementById('tName').textContent = current.name;
  document.getElementById('picNeed').textContent = current.pics;
  const html = `
    <li>道具：${current.items.join('、')}</li>
    <li>衣物：${current.clothes}</li>
    <li>场地：${current.place}</li>
    <li>捆绑：${current.bondage}</li>
  `;
  document.getElementById('tInfo').innerHTML = html;
  document.getElementById('taskDetail').classList.remove('hide');
  window.onbeforeunload = e => '任务未完成，确定离开？';
  const line = await askGemini(`羞辱地催促奴隶执行任务：${current.name}`);
  speak(line);
  connectDG();
}

function speak(txt){
  document.getElementById('aiTalk').textContent = 'AI：'+txt;
  const u = new SpeechSynthesisUtterance(txt); u.lang='zh-CN';
  speechSynthesis.speak(u);
}

document.getElementById('pic').addEventListener('change', e => {
  document.getElementById('uploadBtn').disabled = e.target.files.length < current.pics;
});

document.getElementById('uploadBtn').addEventListener('click', () => {
  unlockBadge(current);
  window.onbeforeunload = null;
  location.reload();
});
