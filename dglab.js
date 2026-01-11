const DG_SERVICE = '0000ffe0-0000-1000-8000-00805f9b34fb';
const DG_CHAR    = '0000ffe1-0000-1000-8000-00805f9b34fb';

let dgDevice, dgServer, dgChar;

async function connectDG() {
  if (!navigator.bluetooth) { speak('当前浏览器不支持蓝牙'); return; }
  try {
    dgDevice = await navigator.bluetooth.requestDevice({
      filters: [{ services: [DG_SERVICE] }],
      optionalServices: [DG_SERVICE]
    });
    dgServer = await dgDevice.gatt.connect();
    const service = await dgServer.getPrimaryService(DG_SERVICE);
    dgChar = await service.getCharacteristic(DG_CHAR);
    // 发送心跳：通道 A 20Hz 脉宽 100μs 强度 lvl
    const lvl = Math.floor(Math.random() * 10) + 1; // 1-10
    sendPulse(lvl);
    speak(`DG-LAB 已连接，当前通道 A 强度 ${lvl}`);
  } catch (e) {
    speak('蓝牙连接失败，确认 DG-LAB 开机并靠近手机');
  }
}

function sendPulse(lvl) {
  if (!dgChar) return;
  // 官方 8 字节协议：AA 55 lvlA lvlB freqA freqB 00 00
  const buf = new Uint8Array([0xAA, 0x55, lvl, 0, 20, 0, 0, 0]);
  dgChar.writeValue(buf);
}
