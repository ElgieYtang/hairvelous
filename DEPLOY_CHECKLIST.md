# Deploy Checklist (Hairvelous)

Use this quick checklist before and after each deploy.

## Before deploy

- [ ] Latest branch is pushed to GitHub (Render deploy branch).
- [ ] `npm test` passes locally.
- [ ] No accidental generated files in commit (`backend/coverage/`, logs, temp files).
- [ ] Required environment variables are set in Render (not in git).

## Smoke test after deploy

- [ ] Login works for a normal user.
- [ ] Consultations page loads without API errors.
- [ ] Specialist can complete a session and save session summary.
- [ ] Client can view session summary in completed consultation.
- [ ] Admin can suspend and unsuspend a user.

## If something fails

- Check Render deploy logs and service logs first.
- Verify Render environment variables and database connection.
- Roll back to previous successful deploy if needed.
