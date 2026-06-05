//gets the canvas element and opens the drawing content object
const canvas = document.getElementById('meme-canvas');
const context = canvas.getContext('2d');

const savedImage = sessionStorage.getItem('uploadedImage');

if (savedImage) {
  const img = new Image();
  img.src = savedImage; //assigns chosen image to image element & decodes base64 url

  //once img is decoded, draw image to canvas with context object
  img.onload = () => {
    canvas.width = img.width;
    canvas.height = img.height;
    context.drawImage(img, 0, 0, canvas.width, canvas.height);
    sessionStorage.removeItem('uploadedImage');
  };
}

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
                id: snapshotId,
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
                  canvas.width = resultImg.width;
                  canvas.height = resultImg.height;
                  context.drawImage(
                    resultImg,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                  );
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
