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
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 800;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
ctx.lineWidth = lineWidth.value;
ctx.lineCap = "round";

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
  // const file = event.target.files[0];
  // const url = URL.createObjectURL(file);
  // const image = new Image();
  // image.src = url;
  // image.onload = function () {
  //   ctx.drawImage(image, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  //   fileInput.value = null;
  // };
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

    // 캔버스 초기화 (선택사항)
    // ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // 이미지를 캔버스에 그리기
    ctx.drawImage(image, x, y, scWidth, scHeight);
    fileInput.value = null;
  };
}
function onDoubleClick(event) {
  const text = textInput.value;
  if (text !== "") {
    ctx.save();
    ctx.lineWidth = 1;
    ctx.font = "48px serif";
    ctx.fillText(text, event.offsetX, event.offsetY);
    ctx.restore();
  }
}
function onSaveClick() {
  const url = canvas.toDataURL();
  // const a = document.createElement("a");
  // a.href = url;
  // a.download = "myDrawing.png";
  // a.click();
  document.body.style.backgroundImage = `url(${url})`;
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
saveBtn.addEventListener("click", onSaveClick);
