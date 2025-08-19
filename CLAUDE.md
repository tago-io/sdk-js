# TagoIO SDK Development Guide

This document contains important information for AI assistants and developers working on the TagoIO SDK.

## Project Overview

The TagoIO SDK is a JavaScript/TypeScript library that provides a comprehensive interface for interacting with the TagoIO IoT platform. It supports multiple JavaScript runtimes (Node.js, Deno, Bun) and publishing to both NPM and JSR registries.

## Build System

### Modern Dual Module Publishing
- **Bundler**: [tsdown](https://tsdown.vercel.app/) (Rust-based, built on Rolldown)
- **Output Formats**: ESM (`.js`) and CommonJS (`.cjs`)
- **Type Definitions**: Dual `.d.ts` (ESM) and `.d.cts` (CommonJS)
- **Build Command**: `npm run build`
- **Build Time**: ~320ms (extremely fast)

### TypeScript Configuration
- **Isolated Declarations**: Enabled for optimal build performance
- **Module System**: ESNext with bundler resolution
- **Target**: ES2020
- **Strict Type Checking**: Enabled

## Development Commands

### Building
```bash
npm run build          # Build dual ESM/CJS output
```

### Publishing
```bash
npm run publish:npm    # Publish to NPM
npm run publish:jsr    # Publish to JSR (Deno)
npm run publish:all    # Publish to both registries
```

### Code Quality
```bash
npm run linter         # Run Biome linter
npm run format         # Format code with Biome
npm run check          # Run full Biome check
```

## Architecture

### Core Modules
- **Resources**: Main API resource classes (Devices, Files, Analyses, etc.)
- **Device**: Device-specific operations and data streaming
- **Analysis**: Analysis execution context and utilities
- **Services**: Service-layer abstractions
- **Utils**: Utility functions and helpers

### Key Classes
- `Resources`: Central API resource manager
- `Device`: Device data operations and streaming
- `Analysis`: Analysis runtime context
- `Services`: Service abstractions

## TypeScript Patterns

### Isolated Declarations Compliance
All public APIs must have explicit type annotations:

```typescript
// ✅ Correct - explicit types
public account: Account = new Account(this.params);
static get account(): Account { return new Resources().account; }

// ❌ Incorrect - missing types
public account = new Account(this.params);
static get account() { return new Resources().account; }
```

### Async Generators
```typescript
public async *getDataStreaming(
  params?: DataQueryStreaming, 
  options?: OptionsStreaming
): AsyncGenerator<Data[], void, unknown> {
  // Implementation
}
```

### Complex Generic Types
For API methods with conditional types, always provide explicit return types:

```typescript
public async list<T extends DeviceQuery>(
  queryObj?: T
): Promise<DeviceListItem<T["fields"] extends DeviceQuery["fields"] ? T["fields"][number] : "id" | "name">[]> {
  // Implementation
}
```

## File Structure

```
src/
├── common/              # Shared utilities and base classes
├── infrastructure/      # HTTP client and core infrastructure
├── modules/            # Main SDK modules
│   ├── Analysis/       # Analysis context and utilities
│   ├── Device/         # Device operations
│   ├── Resources/      # API resource classes
│   ├── Services/       # Service abstractions
│   └── Utils/          # Utility functions
└── modules.ts          # Main entry point
```

## Configuration Files

### package.json
- **Type**: `"module"` (ESM-first)
- **Main**: `"./lib/modules.cjs"` (CommonJS)
- **Module**: `"./lib/modules.js"` (ESM)
- **Exports**: Dual module exports map

### tsconfig.json
- **Module**: `"ESNext"`
- **Module Resolution**: `"bundler"`
- **Isolated Declarations**: `true`

### tsdown.config.ts
- **Entry**: `"./src/modules.ts"`
- **Formats**: `["esm", "cjs"]`
- **External Dependencies**: `["nanoid", "papaparse", "qs", "eventsource"]`

### jsr.json
- **Name**: `"@tago-io/sdk"`
- **Exports**: `"./src/modules.ts"` (direct TypeScript)
- **Includes**: Source files, README, LICENSE

## Dependencies

### Runtime Dependencies
- `nanoid`: Unique ID generation
- `papaparse`: CSV parsing
- `qs`: Query string utilities
- `eventsource`: Server-sent events

### Development Dependencies
- `tsdown`: Modern TypeScript bundler
- `typescript`: TypeScript compiler
- `@biomejs/biome`: Linter and formatter

## Testing

### Manual Testing
```bash
# Test CommonJS output
node -e "const sdk = require('./lib/modules.cjs'); console.log(sdk)"

# Test ESM output  
node -e "import('./lib/modules.js').then(sdk => console.log(sdk))"
```

## Performance Optimizations

### Build Performance
- **Isolated Declarations**: Reduces build time significantly
- **tsdown**: Rust-based bundler for maximum speed
- **Selective Externals**: Only bundle necessary code

### Runtime Performance
- **Tree Shaking**: ESM format supports dead code elimination
- **Minimal Bundle**: External dependencies kept separate
- **Efficient Types**: Optimized TypeScript declarations

## Registry Publishing

### NPM Registry
- Standard Node.js package manager
- CommonJS and ESM support via package.json exports
- Full backward compatibility

### JSR Registry (Deno)
- Native TypeScript support
- Direct source publishing
- Runtime-agnostic package format

## Common Issues & Solutions

### Build Errors
- **Isolated Declarations**: Ensure all public APIs have explicit types
- **Module Resolution**: Use bundler resolution for modern imports
- **Export Warnings**: Check type vs value exports

### Type Errors
- **Generic Constraints**: Always specify return types for complex generics
- **Async Generators**: Include full AsyncGenerator type annotation
- **Property Types**: Annotate all class properties and methods

## Best Practices

### Code Style
- Use explicit type annotations for all public APIs
- Prefer `async/await` over Promise chains
- Use meaningful variable and function names
- Add JSDoc comments for public methods

### Module Structure
- Keep modules focused and cohesive
- Export types explicitly with `export type`
- Use barrel exports sparingly
- Maintain clear separation of concerns

### Performance
- Enable isolated declarations for faster builds
- Use external dependencies appropriately
- Optimize bundle size with tree shaking
- Leverage modern JavaScript features

## Version Information

- **Current Version**: 12.0.3
- **TypeScript**: 5.8.3
- **Node.js**: 18+ (recommended)
- **Build Tool**: tsdown 0.13.0

## Related Documentation

- [TagoIO Documentation](https://help.tago.io/)
- [tsdown Documentation](https://tsdown.vercel.app/)
- [JSR Documentation](https://jsr.io/docs)
- [TypeScript Isolated Declarations](https://devblogs.microsoft.com/typescript/announcing-typescript-5-5/#isolated-declarations)