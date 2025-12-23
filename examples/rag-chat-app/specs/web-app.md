<spec component="Web App" type="frontend" id="node_YT9BDlvVE1">

## Tech Stack
React (Vite)

## Responsibilities
- Render user interface components and pages
- Handle user interactions and form submissions
- Manage client-side state and routing
- Communicate with backend APIs for data

## Anti-Responsibilities
- NEVER store sensitive data in localStorage or sessionStorage — Client storage is accessible to any script on the page, including XSS attacks
- NEVER trust client-side validation alone — Client code can be bypassed or modified by users
- NEVER make direct database connections — Exposes credentials and bypasses business logic
- NEVER implement business logic in UI components — Makes logic hard to test and leads to duplication

## Integrates With
- Backend (outbound) via HTTP REST/GraphQL

## Dependencies
| Package | Version | Purpose |
|---------|---------|---------|
| react | ^19.2.3 | React library |
| vite | ^7.3.0 | Build tool |

## Frontend Notes
- Routing: TBD
- State Management: TBD
- Accessibility: WCAG 2.1 AA compliance

## Validation
- [ ] Renders without console errors
- [ ] Responsive at 320px, 768px, 1024px
- [ ] All user flows tested
- [ ] STATUS.md updated

</spec>