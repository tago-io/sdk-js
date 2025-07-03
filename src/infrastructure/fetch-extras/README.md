# Fetch Extras - Internal Implementation

## Why This Internal Implementation?

This directory contains an internal reimplementation of `fetch-extras` functionality that was moved inside the TagoIO SDK profile to resolve ESM (ECMAScript Modules) compatibility issues.

### The Problem

The original `fetch-extras` package (https://github.com/sindresorhus/fetch-extras) is an ESM-only package that does not support CommonJS. This creates compatibility issues for:

1. **Node.js environments** that don't fully support ESM
2. **Bundlers and build tools** that expect CommonJS compatibility
3. **Legacy codebases** that haven't migrated to ESM
4. **Mixed module systems** where both CommonJS and ESM coexist

### The Solution

Instead of depending on the external ESM-only `fetch-extras` package, we've created an internal CommonJS-compatible implementation that:

- ✅ **Maintains full API compatibility** with the original `fetch-extras`
- ✅ **Supports both CommonJS and ESM** environments
- ✅ **Eliminates ESM-only dependency issues**
- ✅ **Provides better control** over the implementation
- ✅ **Reduces external dependencies**

### What's Included

This internal implementation provides the same core functionality as `fetch-extras`:

- `HttpError` class for HTTP error handling
- `throwIfHttpError()` function to throw on non-OK responses
- `withHttpError()` function to wrap fetch with error handling
- `withTimeout()` function to add timeout support to fetch requests

### Usage

The implementation is automatically used by the SDK's infrastructure layer and maintains the same API as the original `fetch-extras` package, ensuring seamless integration without breaking existing code.

### Migration Notes

If you were previously using `fetch-extras` directly, you can now use this internal implementation through the SDK's infrastructure layer, which provides the same functionality without ESM compatibility concerns.
