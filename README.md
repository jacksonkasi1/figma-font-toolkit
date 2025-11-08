# Font Toolkit

A minimal Figma plugin for comprehensive font management and replacement. Quickly scan, analyze, and replace fonts across your designs with precision.

![Font Toolkit Banner](https://via.placeholder.com/800x200/18a0fb/ffffff?text=Font+Toolkit)

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

### 🎨 Clean, Minimal UI
- **Figma-Native Design**: Matches Figma's design language
- **Dark Mode Support**: Automatically adapts to Figma's theme
- **Intuitive Navigation**: Tab-based interface for easy access to features
- **Real-Time Search**: Filter fonts as you type

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

### Project Structure

```
figma-font-toolkit/
├── src/
│   ├── plugin/              # Plugin main code (runs in Figma sandbox)
│   │   ├── index.ts         # Main entry point
│   │   ├── services/        # Core services
│   │   │   ├── font-scanner.ts    # Scans and extracts font occurrences
│   │   │   ├── font-loader.ts     # Async font loading queue
│   │   │   ├── font-replacer.ts   # Font replacement logic
│   │   │   └── grouping.ts        # Grouping and metadata
│   │   ├── types/           # TypeScript type definitions
│   │   └── utils/           # Utility functions
│   └── ui/                  # UI code (runs in iframe)
│       ├── index.html       # UI structure
│       ├── index.ts         # UI logic and messaging
│       ├── styles/          # CSS styles
│       └── components/      # (Future) React components
├── dist/                    # Compiled output
├── manifest.json            # Figma plugin manifest
├── package.json
└── tsconfig.json
```

### Core Services

#### Font Scanner (`font-scanner.ts`)
- Traverses the selection tree recursively
- Detects single-font and mixed-font text nodes
- Extracts font metadata: family, style, size, line height, weight
- Handles edge cases: empty text, missing fonts, permissions errors

#### Font Loader (`font-loader.ts`)
- Queue-based async font loading
- Prevents rate limiting with controlled concurrency (max 3 concurrent loads)
- Caches loaded fonts to avoid redundant loads
- Graceful error handling for unavailable fonts

#### Font Replacer (`font-replacer.ts`)
- Safe font replacement with pre-loading
- Range-level precision using `setRangeFontName()`
- Optional typography updates (line height, font size)
- Comprehensive error reporting and statistics

#### Grouping (`grouping.ts`)
- Groups occurrences by line height, font size, weight, and family
- Creates metadata with usage counts and node references
- Efficient grouping using Map data structures

### Messaging Architecture

Plugin ↔ UI communication uses `postMessage`:

**Plugin → UI Messages:**
- `fonts-found`: Sends scanned font data
- `available-fonts`: Lists all available fonts
- `replacement-complete`: Reports replacement results
- `progress`: Updates progress during operations
- `error`: Reports errors

**UI → Plugin Messages:**
- `scan-fonts`: Triggers font scanning
- `apply-replacement`: Requests font replacement
- `preview-selection`: Highlights layers in canvas
- `load-available-fonts`: Requests font list

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
