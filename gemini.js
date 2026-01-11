// 离线版：固定台词库，随机挑一句
const offlineLines = [
  '小狗，立刻去执行任务，不许磨蹭！',
  '主人在看着你，敢偷懒就电击 10 档！',
  '脱光、拍照、上传，流程别让我说第二遍。',
  '倒计时 5 分钟，完不成今晚别睡。',
  '把你的羞耻写脸上，再写胸口，然后拍照给我看。'
];
async function askGemini(prompt) {
  // 随机返回一句，假装 AI 在线
  return offlineLines[Math.floor(Math.random() * offlineLines.length)];
}
