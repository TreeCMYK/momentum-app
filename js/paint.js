const cleanBtn = document.querySelector("#clean");
const randomBtn = document.querySelector("#random");
const saveBtn = document.querySelector("#save");
const textInput = document.querySelector("#text");
const fileInput = document.querySelector("#file");
const modeBtn = document.querySelector("#mode-btn");
const destroyBtn = document.querySelector("#destroy-btn");
const eraseBtn = document.querySelector("#erase-btn");
const colorOptions = Array.from(document.querySelectorAll(".color-option"));
const color = document.querySelector("#color");
const lineWidth = document.querySelector("#line-width");
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const CANVAS_WIDTH = 500;
const CANVAS_HEIGHT = 500;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

const BGI_KEY = "backgroundimg";
let bgi = [];

let isPainting = false;
let isFilling = false;

function onMove(event) {
  if (isPainting) {
    ctx.lineTo(event.offsetX, event.offsetY);
    ctx.stroke();
    return;
  }
  ctx.beginPath();
  ctx.moveTo(event.offsetX, event.offsetY);
}
function startPainting() {
  isPainting = true;
}

function cancelPainting() {
  isPainting = false;
}

function onLineWidthChange(event) {
  ctx.lineWidth = event.target.value;
}

function onColorChange(event) {
  ctx.strokeStyle = event.target.value;
  ctx.fillStyle = event.target.value;
}
function onColorClick(event) {
  const colorValue = event.target.dataset.color;
  ctx.strokeStyle = colorValue;
  ctx.fillStyle = colorValue;
  color.value = colorValue;
}

function onModeClick() {
  if (isFilling) {
    isFilling = false;
    modeBtn.innerText = "Fill";
  } else {
    isFilling = true;
    modeBtn.innerText = "Draw";
  }
}

function onCanvasClick() {
  if (isFilling) {
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  }
}

function onDestroyClick() {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}
function onEraseClick() {
  ctx.strokeStyle = "white";
  isFilling = false;
  modeBtn.innerText = "Fill";
}
function onFileChange(event) {
  const file = event.target.files[0];
  const url = URL.createObjectURL(file);
  const image = new Image();
  image.src = url;
  image.onload = function () {
    // 이미지와 캔버스의 비율 계산
    const scale = Math.min(CANVAS_WIDTH / image.width, CANVAS_HEIGHT / image.height);
    // 새로운 너비와 높이 계산
    const scWidth = image.width * scale;
    const scHeight = image.height * scale;
    // 이미지를 캔버스 중앙에 배치하기 위한 좌표 계산
    const x = (CANVAS_WIDTH - scWidth) / 2;
    const y = (CANVAS_HEIGHT - scHeight) / 2;
    // 이미지를 캔버스에 그리기
    ctx.drawImage(image, x, y, scWidth, scHeight);
    fileInput.value = null;
  };
}
function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    const fontsize = Math.floor(ctx.lineWidth * 10);
    ctx.font = `${fontsize}px Gluten`;
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}
function onSavePattern() {
  // 패턴 저장
  const url = canvas.toDataURL();
  const newbg = { id: Date.now(), img: url };
  // 배열 저장
  bgi.push(newbg);
  // 로컬스토리지 저장
  localStorage.setItem(BGI_KEY, JSON.stringify(bgi));
}
function onRandomPattern() {
  // 패턴 랜덤
  const paintChange = bgi[Math.floor(Math.random() * bgi.length)];
  document.body.style.backgroundImage = `url(${paintChange.img})`;
  document.body.style.backgroundSize = "";
  document.body.style.backgroundRepeat = "repeat";
}
function onClean() {
  // localStorage 초기화
  localStorage.removeItem(BGI_KEY);
  // 배열 초기화
  bgi = [];
  // 캔버스 초기화
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  // 기존 배경 가져오기
  const images = ["blue.jpg", "green.jpg", "violet.jpg"];
  const chosenImage = images[Math.floor(Math.random() * images.length)];
  document.body.style.backgroundImage = `url('img/${chosenImage}')`;
}
canvas.addEventListener("dblclick", onDoubleClick);
canvas.addEventListener("mousemove", onMove);
canvas.addEventListener("mousedown", startPainting);
canvas.addEventListener("mouseup", cancelPainting);
canvas.addEventListener("mouseleave", cancelPainting);
canvas.addEventListener("click", onCanvasClick);

lineWidth.addEventListener("change", onLineWidthChange);

color.addEventListener("change", onColorChange);

colorOptions.forEach((color) => color.addEventListener("click", onColorClick));

modeBtn.addEventListener("click", onModeClick);
destroyBtn.addEventListener("click", onDestroyClick);
eraseBtn.addEventListener("click", onEraseClick);

fileInput.addEventListener("change", onFileChange);
saveBtn.addEventListener("click", onSavePattern);
randomBtn.addEventListener("click", onRandomPattern);
cleanBtn.addEventListener("click", onClean);
