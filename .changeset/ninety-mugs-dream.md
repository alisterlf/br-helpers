---
'br-helpers': minor
---

# chore: harden CI/CD and automate releases

## Summary

- harden the CI and release workflows by pinning third-party actions, running the Node support matrix on pushes to main, broadening CodeQL coverage, and waiting for the Sonar quality gate
- replace the old release-triggered npm publish flow with a Changesets-based release PR flow that updates package versions automatically after merge to main
- publish to npm from the existing trusted publisher workflow file using OIDC, keep the prd environment approval for real publishes, and create a matching GitHub release tag automatically
- replace the Dependabot auto-merge workflow with a metadata-only pull_request_target workflow that enables auto-merge under branch protection
- document the new contributor flow so user-facing changes add a changeset instead of editing package.json or CHANGELOG.md manually

## Validation

- npm test
- npm run build
- npx changeset --help
- npx prettier --check .github/workflows/npm-publish.yml package.json Contributing.md .changeset/config.json .changeset/README.md

## Repo settings applied

- set default GitHub Actions workflow permissions to
  ead
- protected main with required status checks: Analyze (javascript), Coverage (Node 24), CI (Node 20), CI (Node 22), and CI (Node 24)
- required 1 approving review on main, dismissed stale reviews, enabled conversation resolution, enforced admins, and required linear history
- added a required reviewer gate to the prd environment
