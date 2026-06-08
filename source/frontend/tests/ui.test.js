describe('End-to-end user flow for meme generation', () => {
    beforeAll(async () => {
        await page.goto('http://localhost:8000/index.html');
    });

    // Home Page

    it('Home page loads correctly', async () => {
        console.log('Checking homepage load...');

        const title = await page.title();
        expect(title).toContain('MemeLab');
    });

    it('Homepage shows both entry points', async () => {
        console.log('Checking homepage UI elements...');

        const uploadBtn = await page.$('.upload-btn');
        const templateBtn = await page.$('.template-btn');

        expect(uploadBtn).not.toBeNull();
        expect(templateBtn).not.toBeNull();
    });
    
    it('Template button navigates to templates page', async () => {
        console.log('Testing templates page navigation...');

        await Promise.all([
            page.waitForNavigation(),
            page.click('.template-btn')
        ]);

        expect(page.url()).toContain('template.html');
    });

    // Templates Page

    it('Template grid loads', async () => {
        console.log('Checking template grid...');
        const section = await page.$('.template-section');
        expect(section).not.toBeNull();
    });

    it('Each template links to editor page', async () => {
        console.log('Validating template links...');

        const links = await page.$$eval(
            '.template-section a',
            anchors => anchors.map(a => a.getAttribute('href'))
        );

        const allGoToEditor = links.every(href => href === 'editor.html');
        expect(allGoToEditor).toBe(true);
    });

    it('Clicking a template navigates to editor page', async () => {
        console.log('Testing template click navigation...');

        const firstTemplate = await page.$('.template-section a');

        await Promise.all([
            page.waitForNavigation(),
            firstTemplate.click()
        ]);

        expect(page.url()).toContain('editor.html');
    });

    // Editor Page

    it('Editor page loads correctly', async () => {
        console.log('Checking editor page...');

        expect(page.url()).toContain('editor.html');
        const canvas = await page.$('#meme-canvas');
        expect(canvas).not.toBeNull();
    });

    it('Can enter top and bottom text', async () => {
        console.log('Typing meme text...');

        await page.type('#top-text', 'TOP TEXT');
        await page.type('#bottom-text', 'BOTTOM TEXT');

        const top = await page.$eval('#top-text', el => el.value);
        const bottom = await page.$eval('#bottom-text', el => el.value);

        expect(top).toBe('TOP TEXT');
        expect(bottom).toBe('BOTTOM TEXT');
    });

    it('Tool sidebar contains all tools', async () => {
        console.log('Checking tools...');

        const tools = await page.$$('.tool-btn');
        expect(tools.length).toBe(4);
    });

     it('Can upload image from library input', async () => {
        console.log('Uploading image...');

        const input = await page.$('#upload-library-input');
        await input.uploadFile('./test-assets/sample.jpeg');
        expect(input).not.toBeNull();
    });

    it('Filters are present', async () => {
        console.log('Checking filters...');

        const filters = await page.$$('.filter');
        expect(filters.length).toBeGreaterThan(0);
    });

    it('AI panel loads and accepts input', async () => {
        console.log('Testing AI panel...');

        const aiBtn = await page.$('.tool-btn[data-tool="ai"]');
        await aiBtn.click();

        await page.type('#ai-prompt', 'Make this meme Shakespearean');

        const value = await page.$eval('#ai-prompt', el => el.value);

        expect(value).toBe('Make this meme Shakespearean');
    });

    it('Can navigate to export page from editor', async () => {
        console.log('Navigating to export...');

        await Promise.all([
            page.waitForNavigation(),
            page.click('a.export-trigger')
        ]);

        expect(page.url()).toContain('export.html');
    });
});