let device = null;
let rxChar = null;
let txChar = null;

let listening = false;
let audioCtx = null;
let lastAlertTime = 0;
const ALERT_COOLDOWN = 3000;

const SERVICE_UUID = "6e400001-b5a3-f393-e0a9-e50e24dcca9e";
const RX_UUID = "6e400002-b5a3-f393-e0a9-e50e24dcca9e";
const TX_UUID = "6e400003-b5a3-f393-e0a9-e50e24dcca9e";

async function connectBLE() {
  try {
    device = await navigator.bluetooth.requestDevice({
      acceptAllDevices: true,
      optionalServices: [SERVICE_UUID]
    });

    device.addEventListener("gattserverdisconnected", onDisconnected);

    const server = await device.gatt.connect();
    const service = await server.getPrimaryService(SERVICE_UUID);

    rxChar = await service.getCharacteristic(RX_UUID);
    txChar = await service.getCharacteristic(TX_UUID);

    await txChar.startNotifications();
    txChar.addEventListener("characteristicvaluechanged", handleData);

    setStatus("Connected", true);
  } catch (e) {
    console.error(e);
  }
}

function disconnectBLE() {
  if (device && device.gatt.connected) {
    device.gatt.disconnect();
  }
  onDisconnected();
}

function onDisconnected() {
  setStatus("Not Connected", false);
  resetUI();
}

function sendCommand(cmd) {
  if (!rxChar) return;
  rxChar.writeValue(new TextEncoder().encode(cmd));
}

function resetUI() {
  document.getElementById("distance").innerText = "-- cm";
  document.getElementById("battery").innerText = "-- %";
  document.getElementById("flame").innerText = "--";
  document.getElementById("ir").innerText = "--";
}

function handleData(e) {
  const raw = new TextDecoder().decode(e.target.value).trim();
  const p = Object.fromEntries(raw.split(",").map(v => v.split(":")));

  const distance = Number(p.DIST);
  const battery = Number(p.BAT);
  const flameVal = Number(p.FLAME);
  const irL = Number(p.IRL);
  const irR = Number(p.IRR);
  const trig = p.TRIG;

  // ---- Distance ----
  const distEl = document.getElementById("distance");
  distEl.innerText = distance.toFixed(1) + " cm";

  distEl.classList.remove("safe", "caution", "danger");
  if (distance > 100) distEl.classList.add("safe");
  else if (distance > 40) distEl.classList.add("caution");
  else distEl.classList.add("danger");

  // ---- Battery ----
  document.getElementById("battery").innerText = battery + " %";

  // ---- Flame ----
  const flameText = document.getElementById("flame");
  const flameCard = document.querySelector(".flame-card");

  if (flameVal === 0) {
    flameText.innerText = "🔥 DANGER";
    flameCard.classList.add("alert");
  } else {
    flameText.innerText = "✅ Safe";
    flameCard.classList.remove("alert");
  }

  // ---- IR ----
  let irText = "Clear";
  if (irL === 0 && irR === 0) irText = "⬅➡ Both";
  else if (irL === 0) irText = "⬅ Left";
  else if (irR === 0) irText = "➡ Right";

  document.getElementById("ir").innerText = irText;

  // ---- Last Trigger ----
  if (trig) {
    let text = "None";

    if (trig === "FLAME") text = "🔥 Fire";
    if (trig === "DIST") text = "📏 Close Object";
    if (trig === "LEFT") text = "⬅ Left Obstacle";
    if (trig === "RIGHT") text = "➡ Right Obstacle";
    if (trig === "SOUND") text = "🔊 Loud Sound";

    document.getElementById("lastTrigger").innerText = text;

    addLog(text);
  }
}

async function startListening() {
  if (listening) return;
  listening = true;

  document.querySelector(".btn-listen").innerText = "Listening...";

  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  await audioCtx.resume();

  const analyser = audioCtx.createAnalyser();
  analyser.fftSize = 2048;

  const mic = audioCtx.createMediaStreamSource(stream);
  mic.connect(analyser);

  const buffer = new Uint8Array(analyser.fftSize);

  setInterval(() => {
    analyser.getByteTimeDomainData(buffer);

    let sum = 0, peak = 0;
    for (let i = 0; i < buffer.length; i++) {
      const v = buffer[i] - 128;
      sum += v * v;
      peak = Math.max(peak, Math.abs(v));
    }

    const rms = Math.sqrt(sum / buffer.length);
    const now = Date.now();

    if (rms > 22 && peak > 70 && now - lastAlertTime > ALERT_COOLDOWN) {
      sendCommand("ALERT");
      lastAlertTime = now;
    }
  }, 200);
}

function setStatus(text, connected) {
  const statusText = document.getElementById("status");
  const led = document.getElementById("led");

  statusText.innerText = text;

  if (connected) {
    led.classList.remove("disconnected");
    led.classList.add("connected");
  } else {
    led.classList.remove("connected");
    led.classList.add("disconnected");
  }
}

function addLog(message) {
  const logBox = document.getElementById("eventLog");

  const time = new Date().toLocaleTimeString();
  const entry = document.createElement("div");
  entry.innerText = `[${time}] ${message}`;

  logBox.prepend(entry);

  if (logBox.childNodes.length > 10) {
    logBox.removeChild(logBox.lastChild);
  }
}