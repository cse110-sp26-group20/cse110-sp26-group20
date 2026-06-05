//gets the canvas element and opens the drawing content object
const canvas = document.getElementById('meme-canvas');
const context = canvas.getContext('2d');

const savedImage = sessionStorage.getItem('uploadedImage');

// text captions
let currentImage = null;

const topCaption = {
    text: "",
    x: 0,
    y: 0
};

const bottomCaption = {
    text: "",
    x: 0,
    y: 0
};

// grabbing inputs from html
const topInput = document.getElementById("top-text");
const bottomInput = document.getElementById("bottom-text");

topInput.addEventListener("input", (event) => {
    topCaption.text = event.target.value;
    renderCanvas();
});

bottomInput.addEventListener("input", (event) => {
    bottomCaption.text = event.target.value;
    renderCanvas();
});

if (savedImage) {
    const img = new Image();
    img.src = savedImage; //assigns chosen image to image element & decodes base64 url
    
    //once img is decoded, draw image to canvas with context object
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        topCaption.x = canvas.width / 2;
        topCaption.y = 80;

        bottomCaption.x = canvas.width / 2;
        bottomCaption.y = canvas.height - 40;

        renderCanvas();
        sessionStorage.removeItem('uploadedImage');
    };
}

function renderCanvas() {

    context.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    if (currentImage) {
        context.drawImage(
            currentImage,
            0,
            0,
            canvas.width,
            canvas.height
        );
    }

    drawCaption(topCaption);
    drawCaption(bottomCaption);
}

function drawCaption(caption) {

    context.font = "bold 60px Impact";

    context.fillStyle = "white";
    context.strokeStyle = "black";

    context.lineWidth = 4;

    context.textAlign = "center";

    context.strokeText(
        caption.text,
        caption.x,
        caption.y
    );

    context.fillText(
        caption.text,
        caption.x,
        caption.y
    );
}