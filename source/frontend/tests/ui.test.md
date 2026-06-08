# UI (E2E) Tests

## Usage

In one terminal, run `npx http-server .` to run a local server that puppeteer will use.
In a second terminal, within `source/frontend`, run `npm test`.

_Common causes of configuration errors:_

- Installed versions of Jest and puppeteer are incompatible. Version 30 of Jest is not compatible currently, so install an earlier, compatible version such as 29.
- Port used by created server does not match the `goto` in `ui.test.js`. Update the `goto` if so.
- Chrome is not successfully opened by puppeteer. Configure system settings to allow Visual Studio Code (or other IDE) to update/open other applications.

# Flow Covered by UI (E2E) Tests

### Assumptions

- Current test creates a local server using localhost. If the site is later published, the localhost URL can be updated with the site's URL.
- There are four tabs on the editor (Text, Images, Filters, AI Generation). If the tabs are changed, the tool sidebar test should be updated to check for the correct number of tabs.

## Home Page

Click "Browse Templates" --> Templates Page

## Templates Page

Click a template --> Editor Page

## Editor Page

- Enter top and bottom text
- Upload image
- Give AI prompt
- Click Export --> Export Page

## Export Page

Preview image displayed
