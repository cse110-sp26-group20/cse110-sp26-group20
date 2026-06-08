//gets the canvas element and opens the drawing content object
const canvas = document.getElementById('meme-canvas');
const context = canvas.getContext('2d');

const savedImage = sessionStorage.getItem('uploadedImage');

// text captions
let currentImage = null;
let activeCaption = null;
let textModeEnabled = false;
const textButton = document.querySelector('[data-tool="text"]');

const mobileTextButton = document.querySelector('.mobile-tab-bar .tab-btn');

const topCaption = {
  text: '',
  x: 0,
  y: 0
};

const bottomCaption = {
  text: '',
  x: 0,
  y: 0
};

const popup = document.getElementById('text-popup');

const popupInput = document.getElementById('popup-input');

function enableTextMode() {
  if (textModeEnabled) return;

  topCaption.text = 'TOP TEXT';
  bottomCaption.text = 'BOTTOM TEXT';

  textModeEnabled = true;

  renderCanvas();
}

textButton.addEventListener('click', enableTextMode);

mobileTextButton.addEventListener('click', enableTextMode);

// text tool button

canvas.addEventListener('click', handleCanvasClick);

popupInput.addEventListener('input', () => {
  if (!activeCaption) return;

  activeCaption.text = popupInput.value;

  renderCanvas();
});

popupInput.addEventListener('blur', () => {
  popup.classList.add('hidden');
});

function openEditor(caption) {
  activeCaption = caption;

  const canvasRect = canvas.getBoundingClientRect();

  popup.classList.remove('hidden');
  popupInput.value = caption.text;

  popup.style.left = `${canvasRect.left + canvasRect.width / 2}px`;

  popup.style.top = `${canvasRect.top - 70}px`;

  popupInput.focus();
  popupInput.select();
}

function handleCanvasClick(event) {
  if (!textModeEnabled) return;

  const distanceToTop = Math.abs(event.offsetY - topCaption.y);

  const distanceToBottom = Math.abs(event.offsetY - bottomCaption.y);

  if (distanceToTop < 75) {
    activeCaption = topCaption;
    openEditor(topCaption);
  } else if (distanceToBottom < 75) {
    activeCaption = bottomCaption;
    openEditor(bottomCaption);
  }
}

if (savedImage) {
  const img = new Image();
  img.src = savedImage; //assigns chosen image to image element & decodes base64 url

  //once img is decoded, draw image to canvas with context object
  img.onload = () => {
    currentImage = img;

    canvas.width = img.width;
    canvas.height = img.height;

    topCaption.x = canvas.width / 2;
    topCaption.y = canvas.height * 0.15;

    bottomCaption.x = canvas.width / 2;
    bottomCaption.y = canvas.height * 0.95;

    renderCanvas();
    sessionStorage.removeItem('uploadedImage');
  };
}

function renderCanvas() {
  context.clearRect(0, 0, canvas.width, canvas.height);

  if (currentImage) {
    context.drawImage(currentImage, 0, 0, canvas.width, canvas.height);
  }

  drawCaption(topCaption);
  drawCaption(bottomCaption);
}

function drawCaption(caption) {
  if (!caption.text) return;

  context.font = 'bold 60px Impact';

  context.fillStyle = 'white';
  context.strokeStyle = 'black';

  context.lineWidth = 4;
  context.textAlign = 'center';

  context.strokeText(caption.text, caption.x, caption.y);

  context.fillText(caption.text, caption.x, caption.y);
}
