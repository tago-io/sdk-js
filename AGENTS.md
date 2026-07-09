# sdk-js

Official TagoIO JavaScript/TypeScript SDK (`@tago-io/sdk`). Dual ESM/CJS via tsdown; also published to JSR for Deno.

## README and repo files

Follow `tagoio:repo-standards` for README headers, section packs, LICENSE.md, CODE_OF_CONDUCT.md, SECURITY.md, and footer.

## Conventions

- Package manager: pnpm 11 (lockfile is `pnpm-lock.yaml`). Do not reintroduce npm/yarn lockfiles or `npm install` for repo development.
- Node: `>=22.12.0` (`package.json` `engines`). Do not lower the floor.
- TypeScript: `isolatedDeclarations: true`, `moduleResolution: "bundler"`, target ES2020. Public APIs need explicit type annotations (class fields, getters, method return types, complex generics).
- Prefer `type` over `interface` only when the surrounding file already does; match local style.
- Linter/formatter: OXC (`oxlint` type-aware, `oxfmt`). Line width 120, 2 spaces. Configs: `.oxlintrc.json`, `.oxfmtrc.json`.
- Tests: Vitest. `TZ=UTC` when time matters. Specs live next to source as `*.test.ts` or under `__tests__/`.
- Build entry: `src/modules.ts` → `lib/` (ESM `.js` + CJS `.cjs` + dual dts).
- tsdown externals: `papaparse`, `qs`, `eventsource` only (see `tsdown.config.ts`). `eventsource` is optional at runtime.
- JSR/Deno: `deno.json` (not `jsr.json`). Version lives only in `package.json`; `publish:jsr` injects it via `deno publish --set-version`.
- Named exports from modules. Keep `export type` for type-only surfaces.

## Commands

```bash
pnpm install
pnpm run build          # clean lib/, stamp env, tsdown dual build
pnpm test               # vitest
pnpm run lint           # oxlint (type-aware via config)
pnpm run fmt            # oxfmt write
pnpm run fmt:check      # oxfmt --check
pnpm run check          # oxlint --deny-warnings && oxfmt --check
pnpm run docs           # typedoc
pnpm run publish:npm    # pnpm publish (runs build via prepublishOnly)
pnpm run publish:jsr    # deno publish --set-version from package.json
pnpm run publish:all
```

Smoke after build:

```bash
node -e "const sdk = require('./lib/modules.cjs'); console.log(Object.keys(sdk))"
node -e "import('./lib/modules.js').then((sdk) => console.log(Object.keys(sdk)))"
```

## Architecture

```
src/
├── common/           # shared helpers, TagoIOModule base
├── infrastructure/   # HTTP, fetch, SSE, env
├── modules/
│   ├── Analysis/
│   ├── Authorization/
│   ├── Device/
│   ├── Dictionary/
│   ├── Migration/    # dashboard widget migration helpers
│   ├── Network/
│   ├── Resources/    # account/profile/devices/dashboards/... API surface
│   ├── RunUser/
│   ├── Services/     # email, SMS, MQTT, PDF, etc.
│   └── Utils/
├── modules.ts        # public entry
├── regions.ts
└── stubs/            # Deno/eventsource stubs
```

## Rules

1. Every public class property, static getter, and exported function needs an explicit type (isolated declarations). Inferred-only public members break the build.
2. Async generators must declare the full `AsyncGenerator<...>` return type.
3. Conditional-generic API methods need an explicit `Promise<...>` return type; do not rely on inference.
4. Do not add new runtime dependencies without a clear need. Prefer existing packages (`nanoid`, `papaparse`, `qs`, optional `eventsource`).
5. Do not hand-edit `lib/` or lock files. Regenerate with `pnpm run build` / `pnpm install`.
6. Do not put secrets, tokens, or personal emails in code, commits, or docs. Work email for this org: `felipefdl@tago.io` when needed.
7. README logo is CDN-only: `https://assets.tago.io/tagoio/sdk.png`, width `200px`. No relative logo paths, no inline SVG in root README.
