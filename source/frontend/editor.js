//gets the canvas element and opens the drawing content object
const canvas = document.getElementById('meme-canvas');
const context = canvas.getContext('2d');

const savedImage = sessionStorage.getItem('uploadedImage');

// text captions
let currentImage = null;
let activeCaption = null;
let textModeEnabled = false;

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

// text tool button
const textButton = document.querySelector('[data-tool="text"]');

const editor = document.getElementById("caption-editor");

textButton.addEventListener("click", () => {
    if (!textModeEnabled) {
        topCaption.text = "TOP TEXT";
        bottomCaption.text = "BOTTOM TEXT";
        textModeEnabled = true;
        renderCanvas();
    }
});

canvas.addEventListener(
    "click",
    handleCanvasClick
);

function openEditor(caption) {
    editor.classList.remove("hidden");
    editor.value = caption.text;
    editor.style.left = `${caption.x}px`;
    editor.style.top = `${caption.y - 35}px`;
    editor.focus();
}

function handleCanvasClick(event) {
    if (!textModeEnabled)
        return;
    const y = event.offsetY;
    if (y < 150) {
        activeCaption = topCaption;
        openEditor(topCaption);
    } else if (
        y > canvas.height - 150
    ) {
        activeCaption = bottomCaption;

        openEditor(bottomCaption);
    }
}

editor.addEventListener("input", () => {
        if (!activeCaption) return;
        activeCaption.text = editor.value;
        renderCanvas();
    }
);

editor.addEventListener("blur", () => {
    editor.classList.add("hidden");
});

if (savedImage) {
    const img = new Image();
    img.src = savedImage; //assigns chosen image to image element & decodes base64 url
    
    //once img is decoded, draw image to canvas with context object
    img.onload = () => {
        currentImage = img;

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

    if (!caption.text) return;

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