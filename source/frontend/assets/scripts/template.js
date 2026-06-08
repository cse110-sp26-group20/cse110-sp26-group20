document.addEventListener('DOMContentLoaded', () => {
  const templateSection = document.querySelector('.template-section');

  // Clear existing static content
  templateSection.innerHTML = '<p>Loading templates...</p>';

  fetch('./config.json')
    .then((res) => {
      if (!res.ok) throw new Error('Could not load config file');
      return res.json();
    })
    .then((config) => {
      return fetch(`${config.apiBase}/api/template`)
        .then((res) => {
          if (!res.ok) throw new Error('Failed to fetch templates');
          return res.json();
        })
        .then((templates) => {
          templateSection.innerHTML = ''; // Clear loading message

          templates.forEach((template) => {
            const a = document.createElement('a');
            a.href = '#';
            a.setAttribute('aria-label', `Use ${template.name} template`);
            
            const img = document.createElement('img');
            // Ensure the URL is absolute by prepending apiBase if it's a relative path from the backend
            const imageUrl = template.url.startsWith('http') 
              ? template.url 
              : `${config.apiBase}${template.url}`;
            
            img.src = imageUrl;
            img.alt = template.name;

            a.appendChild(img);
            
            a.addEventListener('click', (e) => {
              e.preventDefault();
              sessionStorage.setItem('uploadedImage', imageUrl);
              window.location.href = 'editor.html';
            });

            templateSection.appendChild(a);
          });
        });
    })
    .catch((err) => {
      console.error('Error loading templates:', err);
      templateSection.innerHTML = '<p>Error loading templates. Please try again later.</p>';
    });
});
