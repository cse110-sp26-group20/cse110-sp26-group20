# Meeting Minutes 05-22-26 - Zingerz Team 20

## Meeting Details

**Type:** TA Meeting  
**Location:** Zoom, 11:30-11:45 AM

**Attendance:**

- [x] TA Omair
- [x] Andre
- [x] Yezhi
- [x] Christine

## Agenda

### Discussed

#### Code Review Assignments

- Instructor will release code review assignments to all teams by noon
- Teams can earn bonus points by reviewing additional teams beyond their assigned one
- Each team member must indicate their individual contribution to the review
- Teams are free to divide and assign work as they see fit

#### Architecture Decision Record (ADR)

- Yezhi submitted an ADR 007 related to testing patterns for the backend
- Instructor approved the ADR direction
- Key instruction: Keep testing consistent across the team — do not mix testing frameworks (e.g., if using Jest, everyone must use Jest)

#### Frontend UI/UX Feedback (Hi-Fi Prototypes)

##### Current Design Overview

- Homepage includes image upload and browse templates options
- Template browser displays as a pop-up (separate screen planned if templates exceed ~100)
- Editor includes text editing, fonts, and filters
- Export page is the final screen
- Color palette and "MemeBro" font chosen for visual engagement

##### Instructor Feedback

- Editor screen is too busy/chaotic — image appears too small relative to controls
- Recommendation: Model the editor after Instagram Stories:
  - User taps directly on the image to add/move text
  - Remove separate "top text/bottom text" input fields
  - Simplify controls and knobs
- For making the UI "pop": Search for "whimsical app design" for inspiration
  - Add fun micro-interactions (e.g., animated buttons, playful loading states)
  - Consider humorous intermediate states during AI generation

#### AI Meme Generation Performance

- Current template-based generation is fast — minimum requirement already met
- For AI-generated memes (which take longer):
  - Provide 2–3 meme variations per generation cycle to give users value for wait time
  - Consider background notifications to alert users when generation is complete
  - Make each wait cycle worth the user's time by maximizing output quantity

## To Do

- Prepare to complete assigned code review and indicate individual contributions
- Continue researching image generation APIs
- Frontend: Redesign editor screen to follow Instagram Stories-style interaction
- Frontend: Research whimsical app design for UI inspiration
- Backend: Continue researching image generation APIs
