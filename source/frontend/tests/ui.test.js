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
});