# OneDecoder - AI Coding Assistant Instructions

OneDecoder is an Angular 20 multi-format string encoding/decoding tool that provides automatic decoding/encoding of various formats through a plugin-based architecture. It uses zone-less Angular with signals for reactive programming and Angular Material UI.

## Core Architecture

### Plugin System

- **Plugin Base**: All decoders extend the pattern in `src/plugins/_template.ts`
- **Registration**: Add new plugins to `src/plugins/enabled.ts` in the `getPluginList()` array
- **Decorator**: Use `@Plugin()` decorator from `src/decoders/decorators.ts` with metadata
- **Interface**: Implement `DecoderPluginImplement` from `src/decoders/types.ts`

### Plugin Categories

```
src/plugins/
├── basics/     # Standard encoding formats (base64, hex, url, etc.)
├── memes/      # Fun/obscure formats (zero-width, buddha, etc.)
└── others/     # Platform-specific (bilibili, youtube, etc.)
```

### Key Plugin Methods

- `checkString(input: string): number` - Return confidence score 0-100
- `decode(input: string, data?: { key?: string }): string` - Decode logic
- `encode(input: string, key?: string): string` - Optional encoding logic
- All methods support async with Promise return types

## Component Architecture

### Key Components

- **DecoderComponent**: Single input box with auto-detection (no plugin selection needed)
- **EncoderComponent**: Multi-select plugins with batch encoding and results
- **ResultsComponent**: Displays success/error results with copy functionality
- **DecodingService**: Central plugin registry and execution (`src/app/shared/decodingService.ts`)

### Angular Specifics

- **Zone-less**: No NgZone, use signals for reactivity
- **Signals**: Use `signal()`, `model()`, `computed()` instead of traditional observables
- **Standalone Components**: All components are standalone, no NgModules
- **Lazy Loading**: Routes use dynamic imports for code splitting
- **Material Design**: Heavy use of Angular Material with custom SCSS

## Development Patterns

### Plugin Development

1. Copy `src/plugins/_template.ts` as starting point
2. Implement confidence scoring in `checkString()` - higher scores for more specific patterns
3. Use `@Plugin()` decorator with unique `id` (lowercase-hyphen format)
4. Add to `src/plugins/enabled.ts` array (order matters for encoder page)
5. For WASM/heavy libs, use dynamic imports: `await import('module-name')`

### Error Handling

- Use `DecodeError` from `src/decoders/errors.ts` for decode failures
- Provide specific error codes via `DecodeErrorCode` enum
- Key-required plugins should throw `InvalidKey` error when key missing
- If Key is optional, the property `needKey` should still be set to `true`

### Styling Conventions

- **SCSS Structure**: Component-specific styles in `*.scss` files
- **Material Tokens**: Use CSS custom properties like `var(--mat-sys-background)`
- **BEM-like Naming**: Use component prefixes (e.g., `.plugin-selection-list__results-shown`)
- **Responsive**: Use percentage-based widths with max-width constraints

## Build & Development

### Commands

- `npm start` - Dev server (WASM modules won't load in dev, but works in production)
- `npm run build` - Production build
- `npm run lint` - ESLint + Prettier formatting

### Known Issues

- WASM modules fail in development due to Vite configuration limitations
- Use production build to test WASM-dependent plugins

### Dependencies

Angular 20, Angular Material, RxJS

## Key Files to Understand

- `src/decoders/types.ts` - Plugin interface definitions
- `src/plugins/_template.ts` - Template for new plugins
- `src/plugins/basics/base64.ts` - Simple plugin example
- `src/app/shared/decodingService.ts` - Central plugin registry

## File Structure Conventions

- Components: `.ts`, `.html`, `.scss`, `.spec.ts` files per component
- Services: Injectable services in `src/app/shared/`
- No barrel exports - direct imports preferred
- Standalone components with explicit imports array

## Testing

- Use Angular testing utilities with signal-based components
- Test plugin confidence scoring with edge cases
- Mock WASM imports for unit tests
- Results use success/failure states with descriptive Error objects
