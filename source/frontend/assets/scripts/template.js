/**
 * Fetches the frontend config (apiBase URL).
 * @returns {Promise<{apiBase: string}>}
 */
async function fetchConfig() {
  const response = await fetch('./config.json');
  if (!response.ok) {
    throw new Error('Could not load config.json');
  }
  return response.json();
}

/**
 * Fetches meme templates from the API.
 * @param {string} apiBase - Base URL of the backend e.g. http://localhost:3000
 * @returns {Promise<Array>} Array of template objects from the cache.
 */
async function fetchTemplates(apiBase) {
  const response = await fetch(`${apiBase}/api/template`);

  if (!response.ok) {
    throw new Error(
      `Failed to fetch templates: ${response.status} ${response.statusText}`
    );
  }

  return response.json();
}

/**
 * Creates a single template card anchor element.
 * @param {Object} template - Template object from the API.
 * @param {string} template.id - UUID of the template.
 * @param {string} template.name - Display name / alt text.
 * @param {string} template.url - Image path e.g. /static/<uuid>.jpg
 * @param {number} template.width - Natural image width (prevents layout shift).
 * @param {number} template.height - Natural image height (prevents layout shift).
 * @param {string} apiBase - Base URL prepended to the image path.
 * @param {number} index - Index used for staggered animation delay.
 * @returns {HTMLAnchorElement}
 */
function createTemplateCard(template, apiBase, index) {
  const anchor = document.createElement('a');
  anchor.href = 'editor.html';
  anchor.setAttribute('aria-label', `Open ${template.name} in editor`);
  anchor.classList.add('template-card');
  anchor.style.animationDelay = `${index * 40}ms`;

  const img = document.createElement('img');
  img.src = `${apiBase}${template.url}`;
  img.alt = template.name;
  img.width = template.width;
  img.height = template.height;
  img.loading = 'lazy';

  anchor.dataset.templateId = template.id;
  anchor.dataset.templateName = template.name;
  anchor.dataset.templateUrl = `${apiBase}${template.url}`;
  anchor.dataset.templateWidth = template.width;
  anchor.dataset.templateHeight = template.height;

  // Save to sessionStorage before navigating so editor.js can pick it up
  anchor.addEventListener('click', async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${apiBase}${template.url}`);
      const blob = await response.blob();

      const reader = new FileReader();
      reader.onload = () => {
        sessionStorage.setItem('uploadedImage', reader.result);
        window.location.href = 'editor.html';
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error('Failed to load template image:', err);
      window.location.href = 'editor.html';
    }
  });

  anchor.appendChild(img);
  return anchor;
}

/**
 * Renders an error state in the template section.
 * @param {HTMLElement} container
 * @param {string} message
 */
function renderError(container, message) {
  container.innerHTML = `
    <div class="template-error">
      <i class="fa-solid fa-triangle-exclamation"></i>
      <p>${message}</p>
      <button onclick="loadTemplates()">Try again</button>
    </div>
  `;
}

/**
 * Renders a loading skeleton grid while templates are fetched.
 * @param {HTMLElement} container
 * @param {number} count - Number of skeleton cards to show.
 */
function renderSkeletons(container, count = 12) {
  container.innerHTML = Array.from({ length: count })
    .map(() => `<div class="template-skeleton"></div>`)
    .join('');
}

/**
 * Main function: fetches config + templates and renders them into .template-section.
 */
async function loadTemplates() {
  const section = document.querySelector('.template-section');
  if (!section) return;

  renderSkeletons(section);

  try {
    const config = await fetchConfig();
    const templates = await fetchTemplates(config.apiBase);

    if (!Array.isArray(templates) || templates.length === 0) {
      renderError(
        section,
        'No templates available right now. Please check back later.'
      );
      return;
    }

    // Clear skeletons and render real cards
    section.innerHTML = '';
    const fragment = document.createDocumentFragment();

    templates.forEach((template, index) => {
      fragment.appendChild(createTemplateCard(template, config.apiBase, index));
    });

    section.appendChild(fragment);
  } catch (err) {
    console.error('Error loading templates:', err);
    renderError(section, 'Could not load templates. Please try again.');
  }
}

// Kick off on DOM ready
document.addEventListener('DOMContentLoaded', loadTemplates);
