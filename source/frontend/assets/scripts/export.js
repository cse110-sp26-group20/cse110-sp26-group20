document.addEventListener('DOMContentLoaded', () => {
  const memeImg = document.getElementById('meme-img');
  const memeDataUrl = sessionStorage.getItem('exportMeme');

  const shareBtn = document.getElementById('share-btn');
  const shareModal = document.getElementById('share-modal');
  const closeModalBtn = document.getElementById('close-modal-btn');

  const downloadFallbackBtn = document.getElementById('download-fallback-btn');
  const copyImageUrlBtn = document.getElementById('copy-image-url-btn');

  const openImageBtn = document.getElementById('open-image-btn');

  shareModal.classList.add('hidden');

  if (memeDataUrl) {
    memeImg.src = memeDataUrl;
  }

  const downloadBtn = document.getElementById('download-btn');

  downloadBtn.addEventListener('click', () => {
    const link = document.createElement('a');

    link.href = memeImg.src;
    link.download = 'meme.png';

    document.body.appendChild(link);
    link.click();
    link.remove();
  });

  shareBtn.addEventListener('click', async () => {
    try {
      const response = await fetch(memeImg.src);
      const blob = await response.blob();

      const file = new File([blob], 'meme.png', { type: 'image/png' });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'My Meme',
          text: 'Check out this meme!',
          files: [file]
        });
        console.log('can share');
      } else {
        shareModal.classList.remove('hidden');
        console.log("can't share");
      }
    } catch (error) {
      console.error(error);
      shareModal.classList.remove('hidden');
    }
  });

  closeModalBtn.addEventListener('click', () => {
    shareModal.classList.add('hidden');
  });

  shareModal.addEventListener('click', (event) => {
    if (event.target === shareModal) {
      shareModal.classList.add('hidden');
    }
  });

  downloadFallbackBtn.addEventListener('click', () => {
    downloadBtn.click();
  });

  openImageBtn.addEventListener('click', () => {
    window.open(memeImg.src, '_blank');
  });

  copyImageUrlBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(memeImg.src);
      alert('Image URL copied!');
    } catch (error) {
      console.error(error);
    }
  });
});
