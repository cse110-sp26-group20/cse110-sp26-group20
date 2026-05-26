# Meeting Minutes 05-25-26 - Zingerz Team 20

## Meeting Details

**Type:** Standup  
**Location:** Zoom, 4:00-5:10 PM

**Attendance:**

- [x] Yezhi
- [x] Andre
- [x] Abas
- [x] Adam
- [x] Anvik
- [ ] Cadie
- [x] Christine
- [x] Esha
- [ ] Iban
- [x] Jad
- [ ] Noah

## Agenda

### Discussed

#### ADR Reviews & Architecture Decisions

##### File System Design (ENC)

- Proposed using a file repository pattern managed by ID (using a Map structure)
- Images fetched from Imgflip API once at startup, processed, and cached
- Four core processes identified:
  - Startup image fetch & caching
  - Template library read
  - File upload (write action)
  - File read by ID
- Strategy pattern used for flexibility in accessing different folders
- Designed for testability — no-strategy mock can be used for unit testing

##### Model-Route-Controller Architecture (Backend API Structure)

- Proposed structured folder organization:
  - Models — class/interface definitions
  - Controllers — request/response logic
  - Routes/Routers — API endpoint definitions
- Makes backend API development more consistent and easier to maintain
- Update noted: Rename routes folder to routers, and files to .router.ts

#### Frontend Progress

##### Figma Prototype

- Dark mode design chosen (colors pop better)
- Mobile and desktop layouts designed
- Editor features planned:
  - Text properties (font, color)
  - Sticker addition
  - Filters/color grading
  - AI prompt input

##### Frontend Implementation Plan

- Start with basic HTML structure for each page
- Then move to styling and interactive functionality
- Using Canvas API on the frontend to add text on top of images (no backend needed for this)
  - Confirmed that Imgflip uses the same approach
  - Will create an ADR for this for the frontend team to review

#### AI Integration Discussion

##### OpenAI API Plan

- Using gpt-image-2 (latest image generation model)
- Workflow: User starts with a base image → inputs a text prompt → image is modified
- API call structure: model + image path + prompt
- Quality and resolution can be adjusted via API to reduce costs
- Text prompt approach chosen over face swap for more user freedom and easier implementation
- Base images (templates) downloaded from Imgflip API once and stored locally before being sent to AI

## To Do

- Finish code review of Team 17
- Frontend: Upload artifacts to the repository (user stories, personas, Figma link/screenshots, Miro board, etc.) under the artifacts folder
- Abas: Update ADR — rename routes → routers, .routes.ts → .router.ts
- Andre: Create ADR for Multer (file upload library) and ask for TA approval
- Adam: Research and test OpenAI GPT Image 2 API; prototype the image edit call
- Backend: Assign GitHub issues to yourself and remove others to reduce confusion
- Frontend/Backend: Align on required API contracts, especially for the editor features
