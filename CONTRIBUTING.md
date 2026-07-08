# Contributing

Thanks for helping improve the TagoIO JavaScript SDK.

## Before you start

- Read [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md).
- Report security issues through [GitHub Security Advisories](https://github.com/tago-io/sdk-js/security/advisories/new), not public issues.
- Check existing [issues](https://github.com/tago-io/sdk-js/issues) and [pull requests](https://github.com/tago-io/sdk-js/pulls) before opening a new one.

## Development setup

```bash
npm install
npm run build
npm test
npm run check
```

Requirements: Node.js 20+.

## Pull requests

1. Branch from `main` using `type/description` (for example `fix/device-token-refresh`).
2. Keep the change focused. One concern per PR.
3. Add or update tests when behavior changes.
4. Run `npm run check` and `npm test` before opening the PR.
5. Fill the pull request template: `## Summary`, `## Test plan` (or a `Trivial:` marker in Summary), and `## Risk (CIA)`.

## Code style

- TypeScript strict mode. Explicit types on public APIs (isolated declarations).
- Prefer `async`/`await` over raw Promise chains.
- Format and lint with Biome: `npm run check`.

## Docs

- SDK reference: https://js.sdk.tago.io
- Platform docs: https://docs.tago.io
