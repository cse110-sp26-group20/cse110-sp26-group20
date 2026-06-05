# Meeting Minutes 06-05-26 - Zingerz Team 20

## Meeting Details

**Type:** TA Meeting  
**Location:** Zoom, 11:30-11:50 AM

**Attendance:**

- [x] TA Omair
- [x] Andre
- [x] Yezhi

## Agenda

### Sprint 5 Progress Update

- The team is currently reviewing API functionality and integrating frontend and backend components
- UI has been completed for several features including upload and template components
- Frontend team is working on JavaScript to fetch data from services (currently using sample/mock data)
- Mobile version is also in progress and showing improvement
- Most features are built but not yet fully merged into the repo

### Architecture Discussion

- The team leads implemented a **dependency injection architecture** to separate concerns (e.g., file system, store strategies, controllers)
- This approach allows:
  - Each component to be developed independently without waiting on other parts
  - Individual components to be tested in isolation
  - Easier merging of frontend and backend code
- Architecture aligns well with the CI/CD pipeline

### Concerns Raised

- **Bus factor risk** — The architecture is primarily understood by one team member; if that person becomes unavailable, the rest of the team may struggle
- Other team members are still adjusting and require training/demos to understand the system
- TA recommended documenting trade-offs and the onboarding challenges of the architecture

## To Do

- **Merge** all frontend and backend components into the repo
- **Document** the architecture trade-offs and team onboarding challenges for the final video
- **Include the architecture** as a highlight in the 20-minute presentation video
- **Add a Markdown file** with clear deployment/launch instructions
- **Consider creating a Docker image** for easy and reliable deployment
  - **Optionally deploy** to GitHub Pages for easier access; otherwise, keep local with documentation
- **Ping the TA on Slack** with any questions as the code freeze approaches

### General Notes

- Code freeze is primarily to give the team time to focus on video/presentation preparation
- Minor code cleanup after the freeze is acceptable if needed
- TA is available via Slack for any additional support
