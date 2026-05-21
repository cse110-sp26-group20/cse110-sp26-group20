# 0005. Secure Imgflip API Credentials via Backend Proxy and Environment Variables

| Attribute | Value                                |
| --------- | ------------------------------------ |
| Date      | `2026-05-21`                         |
| Status    | Proposed                             |
| Deciders  | Team                                 |

## Context

In order to utilize the Imgflip API, we must interact with the `POST /caption_image` endpoint. This specific endpoint requires passing the registered account's **username** and **password** as plaintext in the body of every request. Executing this request directly from the client-side code would expose our credentials to anyone inspecting the browser's network tab or bundle. This exposure risks complete account compromise, unauthorized use, and potential IP bans. We need a strategy to securely manage these credentials without exposing them to the end user.

## Decision

We will implement a backend proxy architecture and manage credentials exclusively with secure environment variables.

The frontend will send the selected meme template ID and the text to our own backend server route. The backend will retrieve the Imgflip **username** and **password** from a local .env file which will be strictly added to our .gitignore to prevent exposure in the repository or from the host's protected environment variables in production. The backend will attach these credentials, execute the request to Imgflip, and return only the final generated image URL back to the frontend.

Additionally, we will use a dedicated, throwaway Imgflip account using a shared project alias specifically for this application, ensuring personal accounts are not tied to the project.

## Consequences

### Positives

- Completely eliminates the risk of client-side credential exposure.
- Ensures plaintext passwords are never hardcoded or accidentally committed to GitHub.
- Isolates potential security breaches to a dedicated project account rather than a team member's personal account.

### Negatives/tradeoffs

- Imgflip API lacks an information dashboard to track API token metrics
- Introduces a minor increase in latency for the generation process due to the additional network hop between our server and Imgflip's servers.

### Follow-up

- Create dedicated Imgflip account for this project
- Add credentials to a .env file
