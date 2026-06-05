const uploadBtn = document.querySelector('.upload-btn');
const chooseImg = document.getElementById('choose-img');

//checks when user clicks browse library button and opens photo/file library
uploadBtn.addEventListener('click', () => {
  chooseImg.click();
});

//checks when input changes from user adding a file, then stores in sessionStorage
//ands routes user to editor screen with chosen photo
chooseImg.addEventListener('change', (upload) => {
  const file = upload.target.files[0]; //get only the 1st image selected by user
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = (event) => {
    //runs once full image is read into base 64 data urls
    const dataUrl = event.target.result;
    sessionStorage.setItem('uploadedImage', dataUrl);
    window.location.href = 'editor.html';
  };
});
