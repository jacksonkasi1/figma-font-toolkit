# Font Toolkit

A production-ready Figma plugin for comprehensive font management and replacement, built with the `create-figma-plugin` framework.

## Features

### 🔍 Font Discovery
- **Comprehensive Scanning**: Scans all text layers in your current selection
- **Mixed Font Detection**: Identifies fonts within individual text ranges, even when multiple fonts are used in a single text layer
- **Usage Statistics**: Shows how many times each font is used and in how many layers

### 📊 Smart Grouping
Group and analyze fonts by multiple attributes:
- **Line Height**: Group text by line height values
- **Font Size**: Group by font size
- **Font Weight**: Organize by weight (Regular, Bold, etc.)
- **Font Family**: Group by font family

### 🔄 Font Replacement
- **Safe Font Loading**: Automatically loads fonts before applying changes
- **Bulk Replacement**: Replace fonts across multiple layers at once
- **Range-Level Precision**: Replace fonts in specific text ranges, not just entire layers
- **Typography Updates**: Optionally update line height and font size during replacement

### 🎨 Modern UI
- **Preact Components**: Fast, modern UI built with Preact (TSX)
- **Tab Navigation**: Clean tab-based interface
- **Modal Dialogs**: Professional replacement interface
- **Real-Time Search**: Filter fonts as you type
- **Framework UI**: Uses @create-figma-plugin/ui components

## Installation

### From Figma Community (Coming Soon)
1. Open Figma
2. Go to Plugins → Browse Plugins
3. Search for "Font Toolkit"
4. Click Install

### Manual Installation (Development)
1. Clone this repository:
   ```bash
   git clone https://github.com/yourusername/figma-font-toolkit.git
   cd figma-font-toolkit
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Build the plugin:
   ```bash
   npm run build
   ```

4. In Figma:
   - Go to Plugins → Development → Import plugin from manifest
   - Select the `manifest.json` file from this directory

## Usage

### Scanning Fonts

1. **Select Layers**: Select one or more frames, groups, or text layers in Figma
2. **Open Plugin**: Run Font Toolkit from the Plugins menu
3. **Scan**: Click "Scan Fonts in Selection" on the Home tab
4. **Review Results**: View all discovered fonts in the Fonts tab

### Replacing Fonts

1. **Find Font**: Navigate to the Fonts tab and locate the font you want to replace
2. **Click Replace**: Click the "Replace" button next to the font
3. **Select New Font**:
   - Type to search for a font family
   - Select the desired style from the dropdown
4. **Optional Adjustments**:
   - Check "Update Line Height" to change line height (in pixels)
   - Check "Update Font Size" to change font size (in pixels)
5. **Apply**: Click "Apply" to replace the font

### Grouping and Analysis

1. **Navigate to Groups**: Click the "Groups" tab
2. **Select Grouping**: Choose how to group fonts:
   - Line Height
   - Font Size
   - Font Weight
   - Font Family
3. **Explore Groups**: Click on a group to expand and see details
4. **Select Group**: Click "Select" to highlight all layers in that group

### Previewing Changes

1. **Select Font or Group**: Click on any font in the Fonts tab or group in the Groups tab
2. **Preview**: Click the "Preview" button in the footer to highlight affected layers in the canvas
3. **Inspect**: Figma will zoom to show all selected layers

## Architecture

### Framework
Built with [`create-figma-plugin`](https://yuanqing.github.io/create-figma-plugin/), providing:
- Type-safe event handling (`emit`/`on`)
- Pre-built UI components
- Automated build system with esbuild
- TypeScript support
- Auto-generated manifest.json

### Project Structure

```
figma-font-toolkit/
├── src/
│   ├── main.ts              # Plugin backend (Figma sandbox)
│   ├── ui.tsx               # Main UI component (Preact)
│   ├── types/               # TypeScript type definitions
│   │   └── index.ts
│   ├── utilities/           # Shared utilities
│   │   └── font-operations.ts
│   ├── components/          # Preact UI components
│   │   ├── HomeTab.tsx
│   │   ├── FontsTab.tsx
│   │   ├── GroupsTab.tsx
│   │   ├── FontItem.tsx
│   │   ├── GroupItem.tsx
│   │   └── ReplaceModal.tsx
│   └── styles.css           # Custom styles
├── build/                   # Compiled output
│   ├── main.js              # Bundled plugin code
│   └── ui.js                # Bundled UI code
├── manifest.json            # Auto-generated manifest
├── package.json
└── tsconfig.json
```

### Event-Based Communication

Uses `create-figma-plugin`'s event system with type-safe handlers:

**Plugin → UI Events:**
- `FONTS_SCANNED`: Sends scanned font data and groups
- `AVAILABLE_FONTS`: Lists all available fonts
- `REPLACEMENT_COMPLETE`: Reports replacement results

**UI → Plugin Events:**
- `SCAN_FONTS`: Triggers font scanning
- `APPLY_REPLACEMENT`: Requests font replacement
- `PREVIEW_SELECTION`: Highlights layers in canvas
- `REQUEST_AVAILABLE_FONTS`: Requests font list

**Example:**
```typescript
import { emit, on } from '@create-figma-plugin/utilities'

// UI emits event
emit<ScanFontsHandler>('SCAN_FONTS')

// Plugin listens for event
on<ScanFontsHandler>('SCAN_FONTS', () => {
  // Handle scan
})
```

### Core Services

#### Font Operations (`font-operations.ts`)
- **Scanning**: Recursively traverses selection tree
- **Mixed Fonts**: Detects fonts within text ranges
- **Grouping**: Groups by line height, font size, weight, family
- **Metadata**: Creates usage statistics and node references
- **Utilities**: Font comparison, weight parsing, line height resolution

#### Plugin Backend (`main.ts`)
- Event handler registration
- Safe font loading with async/await
- Range-level font replacement
- Selection and preview management
- Error handling and notifications

#### UI Components (Preact/TSX)
- **HomeTab**: Welcome screen with scan trigger
- **FontsTab**: Font list with search and replace
- **GroupsTab**: Grouping interface
- **FontItem**: Individual font card
- **GroupItem**: Expandable group display
- **ReplaceModal**: Full replacement dialog

## Development

### Prerequisites
- Node.js 18+
- npm or yarn
- Figma desktop app (for development)

### Setup

```bash
# Install dependencies
npm install

# Build plugin
npm run build

# Watch for changes (development)
npm run dev
```

### Scripts

- `npm run build` - Build plugin and UI
- `npm run build:plugin` - Build plugin code only
- `npm run build:ui` - Build UI code only
- `npm run watch` - Watch mode for development
- `npm run dev` - Build and start watch mode

### TypeScript Configuration

The project uses separate TypeScript configurations:
- `tsconfig.plugin.json` - Plugin code (ES2020, no DOM)
- `tsconfig.ui.json` - UI code (ES2020, DOM)

### Coding Standards

This project follows the coding standards documented in the [style guide](https://context7.com/jacksonkasi1/docs/llms.txt):

- **Components**: PascalCase (`FontList.tsx`)
- **Functions**: camelCase (`scanFontOccurrences()`)
- **Constants**: UPPER_CASE (`MAX_CONCURRENT_LOADS`)
- **Types**: PascalCase (`FontOccurrence`)
- **Comprehensive JSDoc**: All public functions documented

## Known Limitations

1. **Font Availability**: The plugin can only use fonts available to Figma (team fonts, Google Fonts, etc.). It cannot install system fonts.

2. **Variable Fonts**: Full variable font axis control is not yet supported. Fonts are treated by family and style only.

3. **Range Line Height**: Some older Figma files may not support range-level line height changes. The plugin falls back to node-level changes.

4. **Performance**: Scanning very large selections (1000+ text layers) may take a few seconds. Progress is shown during operations.

5. **Text Styles**: The plugin works with raw font properties, not Figma Text Styles. Future versions may support Text Style updates.

## Roadmap

### v1.1
- [ ] Text Style integration
- [ ] Export/import font mapping presets
- [ ] Batch operations from CSV
- [ ] Font conflict detection

### v1.2
- [ ] Variable font axis control
- [ ] Font recommendations based on similar fonts
- [ ] Multi-selection replacement
- [ ] Undo/redo preview

### v2.0
- [ ] Team font library integration
- [ ] Font usage analytics
- [ ] Automated font migration workflows
- [ ] Plugin API for automation

## Testing

### Test Scenarios

#### Basic Functionality
- ✅ Single text node, single font
- ✅ Single text node, mixed fonts
- ✅ Multiple nodes, same font
- ✅ Empty selection handling
- ✅ No text layers in selection

#### Grouping
- ✅ Group by line height
- ✅ Group by font size
- ✅ Group by font weight
- ✅ Group by font family

#### Replacement
- ✅ Replace entire font
- ✅ Replace with line height update
- ✅ Replace with font size update
- ✅ Unavailable font handling

#### Edge Cases
- ✅ Large selection (500+ text nodes)
- ✅ Mixed formatting within ranges
- ✅ Missing fonts
- ✅ Hidden layers
- ✅ Locked layers

## Contributing

Contributions are welcome! Please follow these guidelines:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Follow coding standards**: Use the project's coding style
4. **Add tests**: Ensure your changes are tested
5. **Commit with clear messages**: `git commit -m 'Add amazing feature'`
6. **Push to your fork**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

## License

MIT License - see [LICENSE](LICENSE) file for details

## Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/figma-font-toolkit/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/figma-font-toolkit/discussions)
- **Email**: support@fonttoolkit.com

## Credits

Created by [Your Name/Team]

Inspired by:
- Microsoft's Content Reel plugin design
- Figma's native plugin patterns
- Community feedback and feature requests

## Changelog

### v1.0.0 (Initial Release)
- Font scanning and discovery
- Smart grouping by multiple attributes
- Font replacement with typography updates
- Clean, minimal UI with dark mode support
- Comprehensive error handling
- Performance optimizations for large selections

---

Made with ❤️ for the Figma community
