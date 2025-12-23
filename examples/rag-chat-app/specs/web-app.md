<spec component="Web App" type="frontend" id="node_YT9BDlvVE1">

## Tech Stack
React (Vite)

## Description
A React-based web interface that delivers a seamless chat experience for user queries and AI-generated responses. Built with Vite for rapid development and optimized production builds. Focused on responsive UI, streaming feedback, and robust error handling.

## Responsibilities
- Render chat transcript with user/assistant roles, timestamps, and loading states
- Handle message composition, submission, streaming updates, and retries
- Invoke backend APIs with proper headers, timeouts, and error handling
- Maintain client-side session state and lightweight persistence (e.g., local storage)
- Ensure responsive layout, keyboard navigation, and accessible interactions

## Anti-Responsibilities
- NEVER implement model inference — handled by backend services
- NEVER store PII beyond session scope — privacy and compliance
- NEVER expose API keys in client bundle — security risk
- NEVER bypass backend for data mutations — integrity and auditability
- NEVER deviate from design tokens — consistency and theming

## Integrates With
- Backend (sends to) via API calls

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.3 | React library |
| vite | ^7.3.0 | Build tool |

## Frontend Notes
- Routing: Single-page app; minimal client-side routing using History API or hash segments
- State: React hooks (useState/useReducer/useContext); derive UI state from API responses
- A11y: WCAG 2.1 AA

## Validation
- [ ] Chat UI supports send, streaming receive, error states, and retry; connects to backend API
- [ ] STATUS.md updated

</spec>