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