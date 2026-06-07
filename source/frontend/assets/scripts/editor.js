//tab switching
const toolBtns = document.querySelectorAll('.tool-btn');
const tabBtns = document.querySelectorAll('.tab-btn');
const toolPanels = document.querySelectorAll('.tool-panel');

function switchPanel(panelId) {
  toolPanels.forEach((p) => p.classList.remove('active'));
  document.getElementById(panelId).classList.add('active');

  toolBtns.forEach((btn) => {
    const isActive = `${btn.dataset.tool}-panel` === panelId;
    btn.classList.toggle('active', isActive);
    btn.setAttribute('aria-pressed', isActive);
  });

  tabBtns.forEach((btn) => {
    btn.classList.toggle(
      'active',
      btn.getAttribute('aria-controls') === panelId
    );
  });
}

toolBtns.forEach((btn) => {
  btn.addEventListener('click', () => switchPanel(`${btn.dataset.tool}-panel`));
});

tabBtns.forEach((btn) => {
  btn.addEventListener('click', () =>
    switchPanel(btn.getAttribute('aria-controls'))
  );
});

//gets the canvas element and opens the drawing content object
const canvas = document.getElementById('meme-canvas');
const context = canvas.getContext('2d');
let currentImg = null;
let activeFilter = 'none';

function redrawCanvas() {
  if (!currentImg) return;
  canvas.width = currentImg.width;
  canvas.height = currentImg.height;
  context.filter = activeFilter;
  context.drawImage(currentImg, 0, 0, canvas.width, canvas.height);
  context.filter = 'none';
}

document.querySelectorAll('#filters-panel .filter').forEach((filterDiv) => {
  const previewImg = filterDiv.querySelector('.filter-preview');
  previewImg.style.filter = filterDiv.dataset.filter;
});

function updateFilterPreviews() {
  if (!currentImg) return;
  const size = 150;
  const imgAspect = currentImg.width / currentImg.height;
  let sx, sy, sw, sh;
  if (imgAspect > 1) {
    sh = currentImg.height;
    sw = sh;
    sx = (currentImg.width - sw) / 2;
    sy = 0;
  } else {
    sw = currentImg.width;
    sh = sw;
    sx = 0;
    sy = (currentImg.height - sh) / 2;
  }
  document.querySelectorAll('#filters-panel .filter').forEach((filterDiv) => {
    const previewImg = filterDiv.querySelector('.filter-preview');
    const thumbCanvas = document.createElement('canvas');
    thumbCanvas.width = size;
    thumbCanvas.height = size;
    const thumbCtx = thumbCanvas.getContext('2d');
    thumbCtx.filter = filterDiv.dataset.filter;
    thumbCtx.drawImage(currentImg, sx, sy, sw, sh, 0, 0, size, size);
    thumbCtx.filter = 'none';
    previewImg.src = thumbCanvas.toDataURL();
    previewImg.style.filter = 'none';
  });
}

document.querySelectorAll('#filters-panel .filter').forEach((filterDiv) => {
  filterDiv.addEventListener('click', () => {
    document
      .querySelectorAll('#filters-panel .filter')
      .forEach((f) => f.classList.remove('active'));
    filterDiv.classList.add('active');
    activeFilter = filterDiv.dataset.filter;
    redrawCanvas();
  });
});

const savedImage = sessionStorage.getItem('uploadedImage');

if (savedImage) {
  const img = new Image();
  img.src = savedImage; //assigns chosen image to image element & decodes base64 url

  //once img is decoded, draw image to canvas with context object
  img.onload = () => {
    currentImg = img;
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    sessionStorage.removeItem('uploadedImage');
    updateFilterPreviews();
  };
}

function loadImageOntoCanvas(file) {
  if (!file) return;
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    currentImg = img;
    canvas.width = img.width;
    canvas.height = img.height;
    context.filter = activeFilter;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    context.filter = 'none';
    URL.revokeObjectURL(url);
    updateFilterPreviews();
  };
  img.src = url;
}

document
  .getElementById('upload-library-input')
  .addEventListener('change', (e) => {
    loadImageOntoCanvas(e.target.files[0]);
  });

//gets the generate button from the AI editor tab
const generateBtn = document.getElementById('ai-submit');

generateBtn.addEventListener('click', () => {
  const prompt = document.getElementById('ai-prompt').value; //gets prompt text
  if (!prompt) return;

  document.getElementById('ai-prompt').value = ''; //clear prompt box

  //gets server address object from config file (CHANGE CONFIG ONCE DEPLOYED)
  fetch('./config.json')
    .then((res) => {
      if (!res.ok) throw new Error('Could not load config file');
      return res.json();
    })
    .then((config) => {
      //saves current canvas snapshot as file, sends to server to get an id back
      canvas.toBlob((blob) => {
        if (!blob) {
          console.error('Canvas is empty or could not be captured');
          return;
        }

        //packages blob into formData object to be sendable to server
        const formData = new FormData();
        formData.append('file', blob, 'canvas-snapshot.png');

        //sends formData to server endpoint
        fetch(`${config.apiBase}/api/img`, {
          method: 'POST',
          body: formData
        })
          .then((res) => {
            //gets server response
            if (!res.ok)
              throw new Error(`Image upload failed with status ${res.status}`);
            return res.json();
          })
          .then((data) => {
            if (!data.data || !data.data.id) {
              throw new Error('Server response missing image id');
            }

            const snapshotId = data.data.id; //gets img id from response

            // send id + prompt to the AI endpoint
            fetch(`${config.apiBase}/api/ai/generate`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' }, //specifies raw json post
              body: JSON.stringify({
                imageId: snapshotId,
                prompt: prompt
              }) //stringify's object containing id and prompt to send to server
            })
              .then((res) => {
                if (!res.ok)
                  throw new Error(
                    `AI request failed with status ${res.status}`
                  );
                return res.json();
              })
              .then((aiData) => {
                if (!aiData.url) {
                  throw new Error('AI response missing image url');
                }

                //draw the new generated image on the canvas
                const resultImg = new Image();
                resultImg.src = aiData.url; //the sent back url from server
                resultImg.onload = () => {
                  currentImg = resultImg;
                  canvas.width = resultImg.width;
                  canvas.height = resultImg.height;
                  context.filter = activeFilter;
                  context.drawImage(
                    resultImg,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                  );
                  context.filter = 'none';
                  updateFilterPreviews();
                };

                //check if error occurred during new image processing
                resultImg.onerror = () => {
                  console.error(
                    'Failed to load generated image from URL:',
                    aiData.url
                  );
                };
              })
              .catch((err) => console.error('AI generation error:', err));
          })
          .catch((err) => console.error('Image upload error:', err));
      });
    })
    .catch((err) => console.error('Config error:', err));
});
