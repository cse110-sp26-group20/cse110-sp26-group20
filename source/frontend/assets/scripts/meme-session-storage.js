document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('meme-canvas');

  if (!canvas) {
    console.error('Meme canvas not found');
    return;
  }

  /**
   * Captures canvas → stores image → navigates to export page
   */
  function exportMeme() {
    try {
      const dataUrl = canvas.toDataURL('image/png');

      // Safety check: prevent empty exports
      if (!dataUrl || dataUrl === 'data:,') {
        console.warn('Canvas is empty. Nothing to export.');
        return;
      }

      sessionStorage.setItem('exportMeme', dataUrl);

      console.log('Meme exported to sessionStorage');

      window.location.href = 'export.html';
    } catch (err) {
      console.error('Export failed:', err);
    }
  }

  /**
   * Attach export behavior to ALL export triggers
   */
  const exportTriggers = document.querySelectorAll('.export-trigger');

  exportTriggers.forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault(); // stop normal link navigation
      exportMeme();
    });
  });

  /**
   * Debug helper
   */
  window.__debugExport = () => {
    console.log('Canvas preview:', canvas.toDataURL());
    console.log('Stored:', sessionStorage.getItem('exportMeme'));
  };
});
