# Meeting Minutes 06-01-26 - Zingerz Team 20

## Meeting Details

**Type:** Standup  
**Location:** Zoom, 4:00-4:25 PM

**Attendance:**

- [ ] Yezhi
- [x] Andre
- [x] Abas
- [x] Adam
- [x] Anvik
- [x] Cadie
- [x] Christine
- [x] Esha
- [x] Iban
- [x] Jad
- [x] Noah

## Agenda

### Discussed

Project progress, feature planning, AI integration, and upcoming midterm preparation.

#### Meme Text Box Positioning

- Team discussed whether an API could provide coordinates/positions for text boxes on meme templates
- Concluded that no API would reliably provide this functionality
- Agreed to default to **two text boxes** (top and bottom) as a baseline
- Users will be able to move, add, and delete text boxes manually
- The Canvas API was mentioned as a tool to support this

#### AI Integration

- Christine spoke with TA Omair — AI does not need to be a direct user-facing feature; it can run in the background
  - When a user opens a meme template, an **AI-generated caption** could already be populated
  - Alternatively (current proposed solution), a **user prompt input** on the editor tab could be used to modify the current editor canvas
- Frontend will pass an **image + prompt** to the backend
- Backend will likely return a **base64 encoded image** for the frontend to display
- Prompt history and token counting were suggested but **deferred for later**

#### Export & Local Storage

- Export page is being worked on; team discussed storing the final meme in **local storage**
- Final meme output would be converted to a **PNG or similar image format**

#### Code Standards

- Team briefly reviewed documentation on commenting, branching naming conventions, and commit formatting
- Agreed to improve **code comments** and maintain consistent branch/commit naming going forward

#### Pacing & Progress

- Backend progress was briefly checked on
- Frontend commits for open pull requests to be completed soon
- Copilot (code review tool) review on #88 was mostly accepted with one exception and a comment left explaining why. Andre will take a look later

## To Do

- **All**: Review coding standards document, improve comments, and follow branch/commit naming conventions
- **All**: Post a **mini standup update on Slack on Wednesday** (current tasks/blockers/upcoming plans) in place of a formal meeting after tomorrow's Midterm 2
- **All**: Focus on **midterm preparation** and resume full development afterward
- **Frontend**: Implement support for adding, deleting, and moving text boxes on the meme editor
- **Frontend**: Default editor to two text boxes (top and bottom)
- **Frontend**: Look more into the Canvas API for editor feature support
- **Frontend**: Complete commits for open pull requests
- **Frontend**: Pass image + prompt to the backend for AI image editing
- **Backend**: Return base64 encoded image to Frontend after AI processing
- **Iban**: Coordinate with Yezhi regarding file system handling for AI image input
- **All**: Ace Midterm 2!
