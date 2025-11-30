var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node_modules/@create-figma-plugin/utilities/lib/events.js
function on(name, handler) {
  const id = `${currentId}`;
  currentId += 1;
  eventHandlers[id] = { handler, name };
  return function() {
    delete eventHandlers[id];
  };
}
function once(name, handler) {
  let done = false;
  return on(name, function(...args) {
    if (done === true) {
      return;
    }
    done = true;
    handler(...args);
  });
}
function invokeEventHandler(name, args) {
  let invoked = false;
  for (const id in eventHandlers) {
    if (eventHandlers[id].name === name) {
      eventHandlers[id].handler.apply(null, args);
      invoked = true;
    }
  }
  if (invoked === false) {
    throw new Error(`No event handler with name \`${name}\``);
  }
}
var eventHandlers, currentId, emit;
var init_events = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/events.js"() {
    eventHandlers = {};
    currentId = 0;
    emit = typeof window === "undefined" ? function(name, ...args) {
      figma.ui.postMessage([name, ...args]);
    } : function(name, ...args) {
      window.parent.postMessage({
        pluginMessage: [name, ...args]
      }, "*");
    };
    if (typeof window === "undefined") {
      figma.ui.onmessage = function(args) {
        if (!Array.isArray(args)) {
          return;
        }
        const [name, ...rest] = args;
        if (typeof name !== "string") {
          return;
        }
        invokeEventHandler(name, rest);
      };
    } else {
      window.onmessage = function(event) {
        if (typeof event.data.pluginMessage === "undefined") {
          return;
        }
        const args = event.data.pluginMessage;
        if (!Array.isArray(args)) {
          return;
        }
        const [name, ...rest] = event.data.pluginMessage;
        if (typeof name !== "string") {
          return;
        }
        invokeEventHandler(name, rest);
      };
    }
  }
});

// node_modules/@create-figma-plugin/utilities/lib/ui.js
function showUI(options, data) {
  if (typeof __html__ === "undefined") {
    throw new Error("No UI defined");
  }
  const html = `<div id="create-figma-plugin"></div><script>document.body.classList.add('theme-${figma.editorType}');const __FIGMA_COMMAND__='${typeof figma.command === "undefined" ? "" : figma.command}';const __SHOW_UI_DATA__=${JSON.stringify(typeof data === "undefined" ? {} : data)};${__html__}</script>`;
  figma.showUI(html, __spreadProps(__spreadValues({}, options), {
    themeColors: typeof options.themeColors === "undefined" ? true : options.themeColors
  }));
}
var init_ui = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/ui.js"() {
  }
});

// node_modules/@create-figma-plugin/utilities/lib/index.js
var init_lib = __esm({
  "node_modules/@create-figma-plugin/utilities/lib/index.js"() {
    init_events();
    init_ui();
  }
});

// src/utilities/font-operations.ts
function areFontsEqual(fontA, fontB) {
  return fontA.family === fontB.family && fontA.style === fontB.style;
}
function getFontKey(font) {
  return `${font.family}||${font.style}`;
}
function parseFontWeight(style) {
  const weightMap = {
    "Thin": "100",
    "Extra Light": "200",
    "Light": "300",
    "Regular": "400",
    "Medium": "500",
    "Semi Bold": "600",
    "Bold": "700",
    "Extra Bold": "800",
    "Black": "900"
  };
  const numericMatch = style.match(/\d{3}/);
  if (numericMatch) {
    return numericMatch[0];
  }
  for (const [name, weight] of Object.entries(weightMap)) {
    if (style.includes(name)) {
      return weight;
    }
  }
  return style;
}
function resolveLineHeightPx(textNode, rangeStart, rangeEnd) {
  let lineHeight;
  if (rangeStart !== void 0 && rangeEnd !== void 0) {
    lineHeight = textNode.getRangeLineHeight(rangeStart, rangeEnd);
  } else {
    lineHeight = textNode.lineHeight;
  }
  if (lineHeight === figma.mixed) {
    lineHeight = textNode.getRangeLineHeight(0, 1);
  }
  const lh = lineHeight;
  if (lh.unit === "PIXELS" && "value" in lh) {
    return lh.value;
  } else if (lh.unit === "PERCENT" && "value" in lh) {
    const fontSize = rangeStart !== void 0 && rangeEnd !== void 0 ? textNode.getRangeFontSize(rangeStart, rangeEnd) : textNode.fontSize;
    const size = fontSize === figma.mixed ? 16 : fontSize;
    return size * lh.value / 100;
  } else {
    const fontSize = rangeStart !== void 0 && rangeEnd !== void 0 ? textNode.getRangeFontSize(rangeStart, rangeEnd) : textNode.fontSize;
    const size = fontSize === figma.mixed ? 16 : fontSize;
    return size * 1.2;
  }
}
function scanFontOccurrences(selection) {
  const occurrences = [];
  function processTextNode(textNode) {
    const length = textNode.characters.length;
    if (length === 0) return;
    try {
      const fontName = textNode.fontName;
      if (fontName !== figma.mixed) {
        const font = fontName;
        const fontSize = textNode.fontSize;
        occurrences.push({
          nodeId: textNode.id,
          nodeName: textNode.name,
          rangeStart: 0,
          rangeEnd: length,
          font: { family: font.family, style: font.style },
          fontSize,
          lineHeightPx: resolveLineHeightPx(textNode),
          fontWeight: parseFontWeight(font.style)
        });
      } else {
        let i = 0;
        while (i < length) {
          const rangeFont = textNode.getRangeFontName(i, i + 1);
          const rangeFontSize = textNode.getRangeFontSize(i, i + 1);
          let j = i + 1;
          while (j < length) {
            const nextFont = textNode.getRangeFontName(j, j + 1);
            const nextFontSize = textNode.getRangeFontSize(j, j + 1);
            if (!areFontsEqual(rangeFont, nextFont) || rangeFontSize !== nextFontSize) {
              break;
            }
            j++;
          }
          occurrences.push({
            nodeId: textNode.id,
            nodeName: textNode.name,
            rangeStart: i,
            rangeEnd: j,
            font: { family: rangeFont.family, style: rangeFont.style },
            fontSize: rangeFontSize,
            lineHeightPx: resolveLineHeightPx(textNode, i, j),
            fontWeight: parseFontWeight(rangeFont.style)
          });
          i = j;
        }
      }
    } catch (error) {
      console.warn(`Failed to process text node ${textNode.id}:`, error);
    }
  }
  function traverse(node) {
    if (node.type === "TEXT") {
      processTextNode(node);
    } else if ("children" in node) {
      for (const child of node.children) {
        traverse(child);
      }
    }
  }
  for (const node of selection) {
    traverse(node);
  }
  return occurrences;
}
function createFontMetadata(occurrences) {
  const fontMap = /* @__PURE__ */ new Map();
  for (const occurrence of occurrences) {
    const key = getFontKey(occurrence.font);
    let metadata = fontMap.get(key);
    if (!metadata) {
      const nodeIds = /* @__PURE__ */ new Set();
      const fontOccurrences = [];
      for (const occ of occurrences) {
        if (getFontKey(occ.font) === key) {
          fontOccurrences.push(occ);
          nodeIds.add(occ.nodeId);
        }
      }
      metadata = {
        font: occurrence.font,
        count: fontOccurrences.length,
        nodesCount: nodeIds.size,
        occurrences: fontOccurrences
      };
      fontMap.set(key, metadata);
    }
  }
  return Array.from(fontMap.values()).sort((a, b) => b.count - a.count);
}
function groupByLineHeight(occurrences) {
  const groups = /* @__PURE__ */ new Map();
  for (const occurrence of occurrences) {
    const key = Math.round(occurrence.lineHeightPx).toString();
    const existing = groups.get(key) || [];
    existing.push(occurrence);
    groups.set(key, existing);
  }
  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `lineHeight:${key}`,
    label: `Line Height: ${key}px`,
    occurrences: occs,
    count: occs.length
  }));
}
function groupByFontSize(occurrences) {
  const groups = /* @__PURE__ */ new Map();
  for (const occurrence of occurrences) {
    const key = Math.round(occurrence.fontSize).toString();
    const existing = groups.get(key) || [];
    existing.push(occurrence);
    groups.set(key, existing);
  }
  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontSize:${key}`,
    label: `Font Size: ${key}px`,
    occurrences: occs,
    count: occs.length
  }));
}
function groupByFontWeight(occurrences) {
  const groups = /* @__PURE__ */ new Map();
  for (const occurrence of occurrences) {
    const key = occurrence.fontWeight;
    const existing = groups.get(key) || [];
    existing.push(occurrence);
    groups.set(key, existing);
  }
  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontWeight:${key}`,
    label: `Weight: ${key}`,
    occurrences: occs,
    count: occs.length
  }));
}
function groupByFontFamily(occurrences) {
  const groups = /* @__PURE__ */ new Map();
  for (const occurrence of occurrences) {
    const key = occurrence.font.family;
    const existing = groups.get(key) || [];
    existing.push(occurrence);
    groups.set(key, existing);
  }
  return Array.from(groups.entries()).map(([key, occs]) => ({
    key: `fontFamily:${key}`,
    label: `Family: ${key}`,
    occurrences: occs,
    count: occs.length
  }));
}
function createAllGroupings(occurrences) {
  return {
    lineHeight: groupByLineHeight(occurrences),
    fontSize: groupByFontSize(occurrences),
    fontWeight: groupByFontWeight(occurrences),
    fontFamily: groupByFontFamily(occurrences)
  };
}
var init_font_operations = __esm({
  "src/utilities/font-operations.ts"() {
    "use strict";
  }
});

// src/handlers/fonts/scan.ts
var scanFontsHandler;
var init_scan = __esm({
  "src/handlers/fonts/scan.ts"() {
    "use strict";
    init_lib();
    init_font_operations();
    scanFontsHandler = async function() {
      const selection = figma.currentPage.selection;
      if (selection.length === 0) {
        figma.notify("Please select at least one layer", { error: true });
        emit("FONTS_SCANNED", {
          fonts: [],
          groups: {
            lineHeight: [],
            fontSize: [],
            fontWeight: [],
            fontFamily: []
          },
          totalNodes: 0
        });
        return;
      }
      const occurrences = scanFontOccurrences(selection);
      if (occurrences.length === 0) {
        figma.notify("No text layers found in selection");
        emit("FONTS_SCANNED", {
          fonts: [],
          groups: {
            lineHeight: [],
            fontSize: [],
            fontWeight: [],
            fontFamily: []
          },
          totalNodes: 0
        });
        return;
      }
      const fonts = createFontMetadata(occurrences);
      const groups = createAllGroupings(occurrences);
      const nodeIds = new Set(occurrences.map((occ) => occ.nodeId));
      emit("FONTS_SCANNED", {
        fonts,
        groups,
        totalNodes: nodeIds.size
      });
      figma.notify(`Found ${fonts.length} fonts in ${nodeIds.size} text layers`);
    };
  }
});

// src/handlers/fonts/replace.ts
var applyReplacementHandler;
var init_replace = __esm({
  "src/handlers/fonts/replace.ts"() {
    "use strict";
    init_lib();
    applyReplacementHandler = async function(spec) {
      const result = {
        success: false,
        affectedNodes: 0,
        affectedRanges: 0,
        errors: []
      };
      try {
        await figma.loadFontAsync({
          family: spec.newFont.family,
          style: spec.newFont.style
        });
        const processedNodes = /* @__PURE__ */ new Set();
        for (const occurrence of spec.occurrences) {
          try {
            const node = figma.getNodeById(occurrence.nodeId);
            if (!node || node.type !== "TEXT") {
              continue;
            }
            try {
              await figma.loadFontAsync({
                family: occurrence.font.family,
                style: occurrence.font.style
              });
            } catch (e) {
            }
            node.setRangeFontName(occurrence.rangeStart, occurrence.rangeEnd, {
              family: spec.newFont.family,
              style: spec.newFont.style
            });
            if (spec.newLineHeight) {
              try {
                node.setRangeLineHeight(
                  occurrence.rangeStart,
                  occurrence.rangeEnd,
                  { value: spec.newLineHeight, unit: "PIXELS" }
                );
              } catch (e) {
                node.lineHeight = { value: spec.newLineHeight, unit: "PIXELS" };
              }
            }
            if (spec.newFontSize) {
              try {
                node.setRangeFontSize(occurrence.rangeStart, occurrence.rangeEnd, spec.newFontSize);
              } catch (e) {
                node.fontSize = spec.newFontSize;
              }
            }
            result.affectedRanges++;
            processedNodes.add(node.id);
          } catch (error) {
            result.errors.push(`Error updating node ${occurrence.nodeId}: ${error}`);
          }
        }
        result.affectedNodes = processedNodes.size;
        result.success = result.affectedRanges > 0;
        if (result.success) {
          figma.notify(`Updated ${result.affectedRanges} text ranges in ${result.affectedNodes} layers`);
        } else {
          figma.notify("Failed to apply changes", { error: true });
        }
      } catch (error) {
        result.errors.push(`Font loading failed: ${error}`);
        figma.notify("Failed to load font", { error: true });
      }
      emit("REPLACEMENT_COMPLETE", result);
    };
  }
});

// src/handlers/fonts/bulk-update.ts
var bulkUpdateHandler;
var init_bulk_update = __esm({
  "src/handlers/fonts/bulk-update.ts"() {
    "use strict";
    init_lib();
    init_font_operations();
    bulkUpdateHandler = async function(spec) {
      let affectedRanges = 0;
      let affectedNodes = 0;
      const processedNodes = /* @__PURE__ */ new Set();
      const errors = [];
      try {
        const findMatchingStyle = async (family, targetWeight) => {
          const availableFonts = await figma.listAvailableFontsAsync();
          const familyFonts = availableFonts.filter((f) => f.fontName.family === family);
          if (familyFonts.length === 0) return null;
          const weightMap = {
            "100": ["Thin", "Hairline", "100", "100 Thin"],
            "200": ["Extra Light", "ExtraLight", "Ultra Light", "UltraLight", "200", "200 Extra Light"],
            "300": ["Light", "Lt", "300", "300 Light"],
            "400": ["Regular", "Normal", "Book", "Rg", "400", "400 Regular"],
            "500": ["Medium", "Md", "500", "500 Medium"],
            "600": ["Semi Bold", "SemiBold", "Demi Bold", "DemiBold", "600", "600 Semi Bold"],
            "700": ["Bold", "Bd", "700", "700 Bold"],
            "800": ["Extra Bold", "ExtraBold", "Ultra Bold", "UltraBold", "800", "800 Extra Bold"],
            "900": ["Black", "Heavy", "Bk", "900", "900 Black"]
          };
          const candidates = weightMap[targetWeight] || [];
          for (const candidate of candidates) {
            const match = familyFonts.find(
              (f) => f.fontName.style.toLowerCase() === candidate.toLowerCase()
            );
            if (match) return match.fontName.style;
          }
          for (const candidate of candidates) {
            const match = familyFonts.find(
              (f) => f.fontName.style.toLowerCase().includes(candidate.toLowerCase())
            );
            if (match) return match.fontName.style;
          }
          const regular = familyFonts.find(
            (f) => f.fontName.style.toLowerCase() === "regular" || f.fontName.style.toLowerCase() === "normal" || f.fontName.style.toLowerCase() === "400"
          );
          return regular ? regular.fontName.style : familyFonts[0].fontName.style;
        };
        for (const occurrence of spec.occurrences) {
          try {
            const node = figma.getNodeById(occurrence.nodeId);
            if (!node || node.type !== "TEXT") {
              continue;
            }
            try {
              await figma.loadFontAsync({
                family: occurrence.font.family,
                style: occurrence.font.style
              });
            } catch (e) {
              errors.push(`Failed to load font ${occurrence.font.family} ${occurrence.font.style}`);
              continue;
            }
            if (spec.groupType === "fontWeight") {
              const targetWeight = spec.targetValue;
              const newStyle = await findMatchingStyle(occurrence.font.family, targetWeight);
              if (!newStyle) {
                errors.push(
                  `Could not find matching weight ${targetWeight} for ${occurrence.font.family}`
                );
                continue;
              }
              await figma.loadFontAsync({
                family: occurrence.font.family,
                style: newStyle
              });
              node.setRangeFontName(occurrence.rangeStart, occurrence.rangeEnd, {
                family: occurrence.font.family,
                style: newStyle
              });
              affectedRanges++;
            } else if (spec.groupType === "lineHeight") {
              const targetLineHeight = spec.targetValue;
              try {
                node.setRangeLineHeight(occurrence.rangeStart, occurrence.rangeEnd, {
                  value: targetLineHeight,
                  unit: "PIXELS"
                });
              } catch (e) {
                node.lineHeight = { value: targetLineHeight, unit: "PIXELS" };
              }
              affectedRanges++;
            } else if (spec.groupType === "fontSize") {
              const targetSize = spec.targetValue;
              try {
                node.setRangeFontSize(occurrence.rangeStart, occurrence.rangeEnd, targetSize);
              } catch (e) {
                node.fontSize = targetSize;
              }
              affectedRanges++;
            }
            processedNodes.add(node.id);
          } catch (error) {
            errors.push(`Error updating node ${occurrence.nodeId}: ${error}`);
          }
        }
        affectedNodes = processedNodes.size;
        if (affectedRanges > 0) {
          figma.notify(
            `Updated ${affectedRanges} range${affectedRanges === 1 ? "" : "s"} in ${affectedNodes} layer${affectedNodes === 1 ? "" : "s"}`
          );
          emit("FONTS_SCANNED", {
            fonts: createFontMetadata(scanFontOccurrences(figma.currentPage.selection)),
            groups: createAllGroupings(scanFontOccurrences(figma.currentPage.selection)),
            totalNodes: processedNodes.size
          });
        } else {
          figma.notify("No changes applied", { error: true });
          if (errors.length > 0) {
            console.error("Bulk update errors:", errors);
          }
        }
      } catch (error) {
        figma.notify(`Bulk update failed: ${error}`, { error: true });
        console.error("Bulk update error:", error);
      }
    };
  }
});

// src/handlers/fonts/available.ts
var requestAvailableFontsHandler;
var init_available = __esm({
  "src/handlers/fonts/available.ts"() {
    "use strict";
    init_lib();
    requestAvailableFontsHandler = async function() {
      const availableFonts = await figma.listAvailableFontsAsync();
      emit("AVAILABLE_FONTS", availableFonts);
    };
  }
});

// src/handlers/selection/preview.ts
var previewSelectionHandler;
var init_preview = __esm({
  "src/handlers/selection/preview.ts"() {
    "use strict";
    previewSelectionHandler = function(occurrences) {
      const nodeIds = new Set(occurrences.map((occ) => occ.nodeId));
      const nodes = [];
      for (const nodeId of Array.from(nodeIds)) {
        const node = figma.getNodeById(nodeId);
        if (node) {
          nodes.push(node);
        }
      }
      if (nodes.length > 0) {
        figma.currentPage.selection = nodes;
        figma.viewport.scrollAndZoomIntoView(nodes);
      }
    };
  }
});

// src/handlers/selection/select.ts
var selectNodeHandler;
var init_select = __esm({
  "src/handlers/selection/select.ts"() {
    "use strict";
    selectNodeHandler = function(spec) {
      const node = figma.getNodeById(spec.nodeId);
      if (node) {
        figma.currentPage.selection = [node];
        figma.viewport.scrollAndZoomIntoView([node]);
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/arial.mjs
var arial_default;
var init_arial = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/arial.mjs"() {
    arial_default = {
      familyName: "Arial",
      category: "sans-serif",
      capHeight: 1467,
      ascent: 1854,
      descent: -434,
      lineGap: 67,
      unitsPerEm: 2048,
      xHeight: 1062,
      xWidthAvg: 913,
      subsets: {
        latin: {
          xWidthAvg: 913
        },
        thai: {
          xWidthAvg: 1536
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/helvetica.mjs
var helvetica_default;
var init_helvetica = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/helvetica.mjs"() {
    helvetica_default = {
      familyName: "Helvetica",
      category: "sans-serif",
      capHeight: 1469,
      ascent: 1577,
      descent: -471,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1071,
      xWidthAvg: 913,
      subsets: {
        latin: {
          xWidthAvg: 913
        },
        thai: {
          xWidthAvg: 1298
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/roboto.mjs
var roboto_default;
var init_roboto = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/roboto.mjs"() {
    roboto_default = {
      familyName: "Roboto",
      category: "sans-serif",
      capHeight: 1456,
      ascent: 1900,
      descent: -500,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1082,
      xWidthAvg: 911,
      subsets: {
        latin: {
          xWidthAvg: 911
        },
        thai: {
          xWidthAvg: 908
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/inter.mjs
var inter_default;
var init_inter = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/inter.mjs"() {
    inter_default = {
      familyName: "Inter",
      category: "sans-serif",
      capHeight: 2048,
      ascent: 2728,
      descent: -680,
      lineGap: 0,
      unitsPerEm: 2816,
      xHeight: 1536,
      xWidthAvg: 1344,
      subsets: {
        latin: {
          xWidthAvg: 1344
        },
        thai: {
          xWidthAvg: 2800
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/openSans.mjs
var openSans_default;
var init_openSans = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/openSans.mjs"() {
    openSans_default = {
      familyName: "Open Sans",
      category: "sans-serif",
      capHeight: 1462,
      ascent: 2189,
      descent: -600,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1096,
      xWidthAvg: 960,
      subsets: {
        latin: {
          xWidthAvg: 960
        },
        thai: {
          xWidthAvg: 1229
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/montserrat.mjs
var montserrat_default;
var init_montserrat = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/montserrat.mjs"() {
    montserrat_default = {
      familyName: "Montserrat",
      category: "sans-serif",
      capHeight: 700,
      ascent: 968,
      descent: -251,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 517,
      xWidthAvg: 503,
      subsets: {
        latin: {
          xWidthAvg: 503
        },
        thai: {
          xWidthAvg: 587
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/lato.mjs
var lato_default;
var init_lato = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/lato.mjs"() {
    lato_default = {
      familyName: "Lato",
      category: "sans-serif",
      capHeight: 1433,
      ascent: 1974,
      descent: -426,
      lineGap: 0,
      unitsPerEm: 2e3,
      xHeight: 1013,
      xWidthAvg: 871,
      subsets: {
        latin: {
          xWidthAvg: 871
        },
        thai: {
          xWidthAvg: 1063
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/poppins.mjs
var poppins_default;
var init_poppins = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/poppins.mjs"() {
    poppins_default = {
      familyName: "Poppins",
      category: "sans-serif",
      capHeight: 698,
      ascent: 1050,
      descent: -350,
      lineGap: 100,
      unitsPerEm: 1e3,
      xHeight: 548,
      xWidthAvg: 500,
      subsets: {
        latin: {
          xWidthAvg: 500
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/raleway.mjs
var raleway_default;
var init_raleway = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/raleway.mjs"() {
    raleway_default = {
      familyName: "Raleway",
      category: "sans-serif",
      capHeight: 710,
      ascent: 940,
      descent: -234,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 519,
      xWidthAvg: 463,
      subsets: {
        latin: {
          xWidthAvg: 463
        },
        thai: {
          xWidthAvg: 608
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/sourceSans3.mjs
var sourceSans3_default;
var init_sourceSans3 = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/sourceSans3.mjs"() {
    sourceSans3_default = {
      familyName: "Source Sans 3",
      category: "sans-serif",
      capHeight: 660,
      ascent: 1024,
      descent: -400,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 486,
      xWidthAvg: 418,
      subsets: {
        latin: {
          xWidthAvg: 418
        },
        thai: {
          xWidthAvg: 653
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/oswald.mjs
var oswald_default;
var init_oswald = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/oswald.mjs"() {
    oswald_default = {
      familyName: "Oswald",
      category: "sans-serif",
      capHeight: 810,
      ascent: 1193,
      descent: -289,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 578,
      xWidthAvg: 363,
      subsets: {
        latin: {
          xWidthAvg: 363
        },
        thai: {
          xWidthAvg: 682
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/merriweather.mjs
var merriweather_default;
var init_merriweather = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/merriweather.mjs"() {
    merriweather_default = {
      familyName: "Merriweather",
      category: "serif",
      capHeight: 743,
      ascent: 984,
      descent: -273,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 555,
      xWidthAvg: 496,
      subsets: {
        latin: {
          xWidthAvg: 496
        },
        thai: {
          xWidthAvg: 864
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/playfairDisplay.mjs
var playfairDisplay_default;
var init_playfairDisplay = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/playfairDisplay.mjs"() {
    playfairDisplay_default = {
      familyName: "Playfair Display",
      category: "serif",
      capHeight: 708,
      ascent: 1082,
      descent: -251,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 514,
      xWidthAvg: 452,
      subsets: {
        latin: {
          xWidthAvg: 452
        },
        thai: {
          xWidthAvg: 562
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/ubuntu.mjs
var ubuntu_default;
var init_ubuntu = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/ubuntu.mjs"() {
    ubuntu_default = {
      familyName: "Ubuntu",
      category: "sans-serif",
      capHeight: 693,
      ascent: 932,
      descent: -189,
      lineGap: 28,
      unitsPerEm: 1e3,
      xHeight: 520,
      xWidthAvg: 455,
      subsets: {
        latin: {
          xWidthAvg: 455
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/rubik.mjs
var rubik_default;
var init_rubik = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/rubik.mjs"() {
    rubik_default = {
      familyName: "Rubik",
      category: "sans-serif",
      capHeight: 700,
      ascent: 935,
      descent: -250,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 520,
      xWidthAvg: 468,
      subsets: {
        latin: {
          xWidthAvg: 468
        },
        thai: {
          xWidthAvg: 695
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/nunito.mjs
var nunito_default;
var init_nunito = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/nunito.mjs"() {
    nunito_default = {
      familyName: "Nunito",
      category: "sans-serif",
      capHeight: 705,
      ascent: 1011,
      descent: -353,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 484,
      xWidthAvg: 452,
      subsets: {
        latin: {
          xWidthAvg: 452
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/notoSans.mjs
var notoSans_default;
var init_notoSans = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/notoSans.mjs"() {
    notoSans_default = {
      familyName: "Noto Sans",
      category: "sans-serif",
      capHeight: 714,
      ascent: 1069,
      descent: -293,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 536,
      xWidthAvg: 474,
      subsets: {
        latin: {
          xWidthAvg: 474
        },
        thai: {
          xWidthAvg: 600
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/pTSans.mjs
var pTSans_default;
var init_pTSans = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/pTSans.mjs"() {
    pTSans_default = {
      familyName: "PT Sans",
      category: "sans-serif",
      capHeight: 700,
      ascent: 1018,
      descent: -276,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 431,
      subsets: {
        latin: {
          xWidthAvg: 431
        },
        thai: {
          xWidthAvg: 750
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/pTSerif.mjs
var pTSerif_default;
var init_pTSerif = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/pTSerif.mjs"() {
    pTSerif_default = {
      familyName: "PT Serif",
      category: "serif",
      capHeight: 700,
      ascent: 1039,
      descent: -286,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 448,
      subsets: {
        latin: {
          xWidthAvg: 448
        },
        thai: {
          xWidthAvg: 709
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/workSans.mjs
var workSans_default;
var init_workSans = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/workSans.mjs"() {
    workSans_default = {
      familyName: "Work Sans",
      category: "sans-serif",
      capHeight: 660,
      ascent: 930,
      descent: -243,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 499,
      subsets: {
        latin: {
          xWidthAvg: 499
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/quicksand.mjs
var quicksand_default;
var init_quicksand = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/quicksand.mjs"() {
    quicksand_default = {
      familyName: "Quicksand",
      category: "sans-serif",
      capHeight: 700,
      ascent: 1e3,
      descent: -250,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 503,
      xWidthAvg: 465,
      subsets: {
        latin: {
          xWidthAvg: 465
        },
        thai: {
          xWidthAvg: 584
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/firaSans.mjs
var firaSans_default;
var init_firaSans = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/firaSans.mjs"() {
    firaSans_default = {
      familyName: "Fira Sans",
      category: "sans-serif",
      capHeight: 689,
      ascent: 935,
      descent: -265,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 527,
      xWidthAvg: 458,
      subsets: {
        latin: {
          xWidthAvg: 458
        },
        thai: {
          xWidthAvg: 666
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/barlow.mjs
var barlow_default;
var init_barlow = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/barlow.mjs"() {
    barlow_default = {
      familyName: "Barlow",
      category: "sans-serif",
      capHeight: 700,
      ascent: 1e3,
      descent: -200,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 506,
      xWidthAvg: 431,
      subsets: {
        latin: {
          xWidthAvg: 431
        },
        thai: {
          xWidthAvg: 419
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/mulish.mjs
var mulish_default;
var init_mulish = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/mulish.mjs"() {
    mulish_default = {
      familyName: "Mulish",
      category: "sans-serif",
      capHeight: 705,
      ascent: 1005,
      descent: -250,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 464,
      subsets: {
        latin: {
          xWidthAvg: 464
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/titilliumWeb.mjs
var titilliumWeb_default;
var init_titilliumWeb = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/titilliumWeb.mjs"() {
    titilliumWeb_default = {
      familyName: "Titillium Web",
      category: "sans-serif",
      capHeight: 692,
      ascent: 1133,
      descent: -388,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 421,
      subsets: {
        latin: {
          xWidthAvg: 421
        },
        thai: {
          xWidthAvg: 235
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/kanit.mjs
var kanit_default;
var init_kanit = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/kanit.mjs"() {
    kanit_default = {
      familyName: "Kanit",
      category: "sans-serif",
      capHeight: 644,
      ascent: 1100,
      descent: -395,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 474,
      xWidthAvg: 452,
      subsets: {
        latin: {
          xWidthAvg: 452
        },
        thai: {
          xWidthAvg: 550
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/dMSans.mjs
var dMSans_default;
var init_dMSans = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/dMSans.mjs"() {
    dMSans_default = {
      familyName: "DM Sans",
      category: "sans-serif",
      capHeight: 700,
      ascent: 992,
      descent: -310,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 504,
      xWidthAvg: 466,
      subsets: {
        latin: {
          xWidthAvg: 466
        },
        thai: {
          xWidthAvg: 551
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/heebo.mjs
var heebo_default;
var init_heebo = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/heebo.mjs"() {
    heebo_default = {
      familyName: "Heebo",
      category: "sans-serif",
      capHeight: 1456,
      ascent: 2146,
      descent: -862,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1178,
      xWidthAvg: 912,
      subsets: {
        latin: {
          xWidthAvg: 912
        },
        thai: {
          xWidthAvg: 1024
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/iBMPlexSans.mjs
var iBMPlexSans_default;
var init_iBMPlexSans = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/iBMPlexSans.mjs"() {
    iBMPlexSans_default = {
      familyName: "IBM Plex Sans",
      category: "sans-serif",
      capHeight: 698,
      ascent: 1025,
      descent: -275,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 516,
      xWidthAvg: 451,
      subsets: {
        latin: {
          xWidthAvg: 451
        },
        thai: {
          xWidthAvg: 472
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/mukta.mjs
var mukta_default;
var init_mukta = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/mukta.mjs"() {
    mukta_default = {
      familyName: "Mukta",
      category: "sans-serif",
      capHeight: 630,
      ascent: 1130,
      descent: -532,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 468,
      xWidthAvg: 420,
      subsets: {
        latin: {
          xWidthAvg: 420
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/oxygen.mjs
var oxygen_default;
var init_oxygen = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/oxygen.mjs"() {
    oxygen_default = {
      familyName: "Oxygen",
      category: "sans-serif",
      ascent: 2103,
      descent: -483,
      lineGap: 0,
      unitsPerEm: 2048,
      xWidthAvg: 923,
      subsets: {
        latin: {
          xWidthAvg: 923
        },
        thai: {
          xWidthAvg: 1024
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/arimo.mjs
var arimo_default;
var init_arimo = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/arimo.mjs"() {
    arimo_default = {
      familyName: "Arimo",
      category: "sans-serif",
      capHeight: 1409,
      ascent: 1854,
      descent: -434,
      lineGap: 67,
      unitsPerEm: 2048,
      xHeight: 1082,
      xWidthAvg: 913,
      subsets: {
        latin: {
          xWidthAvg: 913
        },
        thai: {
          xWidthAvg: 1536
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/dosis.mjs
var dosis_default;
var init_dosis = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/dosis.mjs"() {
    dosis_default = {
      familyName: "Dosis",
      category: "sans-serif",
      capHeight: 731,
      ascent: 1027,
      descent: -237,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 472,
      xWidthAvg: 377,
      subsets: {
        latin: {
          xWidthAvg: 377
        },
        thai: {
          xWidthAvg: 340
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/josefinSans.mjs
var josefinSans_default;
var init_josefinSans = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/josefinSans.mjs"() {
    josefinSans_default = {
      familyName: "Josefin Sans",
      category: "sans-serif",
      capHeight: 702,
      ascent: 750,
      descent: -250,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 378,
      xWidthAvg: 456,
      subsets: {
        latin: {
          xWidthAvg: 456
        },
        thai: {
          xWidthAvg: 300
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/cabin.mjs
var cabin_default;
var init_cabin = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/cabin.mjs"() {
    cabin_default = {
      familyName: "Cabin",
      category: "sans-serif",
      capHeight: 1400,
      ascent: 1930,
      descent: -500,
      lineGap: 0,
      unitsPerEm: 2e3,
      xHeight: 980,
      xWidthAvg: 844,
      subsets: {
        latin: {
          xWidthAvg: 844
        },
        thai: {
          xWidthAvg: 1206
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/anton.mjs
var anton_default;
var init_anton = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/anton.mjs"() {
    anton_default = {
      familyName: "Anton",
      category: "sans-serif",
      capHeight: 1760,
      ascent: 2409,
      descent: -674,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1500,
      xWidthAvg: 828,
      subsets: {
        latin: {
          xWidthAvg: 828
        },
        thai: {
          xWidthAvg: 1022
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/bitter.mjs
var bitter_default;
var init_bitter = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/bitter.mjs"() {
    bitter_default = {
      familyName: "Bitter",
      category: "serif",
      capHeight: 692,
      ascent: 935,
      descent: -265,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 522,
      xWidthAvg: 465,
      subsets: {
        latin: {
          xWidthAvg: 465
        },
        thai: {
          xWidthAvg: 495
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/crimsonText.mjs
var crimsonText_default;
var init_crimsonText = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/crimsonText.mjs"() {
    crimsonText_default = {
      familyName: "Crimson Text",
      category: "serif",
      capHeight: 656,
      ascent: 972,
      descent: -359,
      lineGap: 0,
      unitsPerEm: 1024,
      xHeight: 430,
      xWidthAvg: 405,
      subsets: {
        latin: {
          xWidthAvg: 405
        },
        thai: {
          xWidthAvg: 374
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/hind.mjs
var hind_default;
var init_hind = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/hind.mjs"() {
    hind_default = {
      familyName: "Hind",
      category: "sans-serif",
      capHeight: 679,
      ascent: 1055,
      descent: -546,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 505,
      xWidthAvg: 429,
      subsets: {
        latin: {
          xWidthAvg: 429
        },
        thai: {
          xWidthAvg: 751
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/inconsolata.mjs
var inconsolata_default;
var init_inconsolata = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/inconsolata.mjs"() {
    inconsolata_default = {
      familyName: "Inconsolata",
      category: "monospace",
      capHeight: 623,
      ascent: 859,
      descent: -190,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 457,
      xWidthAvg: 500,
      subsets: {
        latin: {
          xWidthAvg: 500
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/karla.mjs
var karla_default;
var init_karla = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/karla.mjs"() {
    karla_default = {
      familyName: "Karla",
      category: "sans-serif",
      capHeight: 1256,
      ascent: 1834,
      descent: -504,
      lineGap: 0,
      unitsPerEm: 2e3,
      xHeight: 956,
      xWidthAvg: 913,
      subsets: {
        latin: {
          xWidthAvg: 913
        },
        thai: {
          xWidthAvg: 1031
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/libreBaskerville.mjs
var libreBaskerville_default;
var init_libreBaskerville = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/libreBaskerville.mjs"() {
    libreBaskerville_default = {
      familyName: "Libre Baskerville",
      category: "serif",
      capHeight: 770,
      ascent: 970,
      descent: -270,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 530,
      xWidthAvg: 517,
      subsets: {
        latin: {
          xWidthAvg: 517
        },
        thai: {
          xWidthAvg: 756
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/libreFranklin.mjs
var libreFranklin_default;
var init_libreFranklin = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/libreFranklin.mjs"() {
    libreFranklin_default = {
      familyName: "Libre Franklin",
      category: "sans-serif",
      capHeight: 742,
      ascent: 966,
      descent: -246,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 530,
      xWidthAvg: 465,
      subsets: {
        latin: {
          xWidthAvg: 465
        },
        thai: {
          xWidthAvg: 702
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/lora.mjs
var lora_default;
var init_lora = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/lora.mjs"() {
    lora_default = {
      familyName: "Lora",
      category: "serif",
      capHeight: 700,
      ascent: 1006,
      descent: -274,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 468,
      subsets: {
        latin: {
          xWidthAvg: 468
        },
        thai: {
          xWidthAvg: 529
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/manrope.mjs
var manrope_default;
var init_manrope = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/manrope.mjs"() {
    manrope_default = {
      familyName: "Manrope",
      category: "sans-serif",
      capHeight: 1440,
      ascent: 2132,
      descent: -600,
      lineGap: 0,
      unitsPerEm: 2e3,
      xHeight: 1080,
      xWidthAvg: 920,
      subsets: {
        latin: {
          xWidthAvg: 920
        },
        thai: {
          xWidthAvg: 1480
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/mavenPro.mjs
var mavenPro_default;
var init_mavenPro = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/mavenPro.mjs"() {
    mavenPro_default = {
      familyName: "Maven Pro",
      category: "sans-serif",
      capHeight: 667,
      ascent: 965,
      descent: -210,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 499,
      xWidthAvg: 462,
      subsets: {
        latin: {
          xWidthAvg: 462
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/nanumGothic.mjs
var nanumGothic_default;
var init_nanumGothic = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/nanumGothic.mjs"() {
    nanumGothic_default = {
      familyName: "NanumGothic",
      category: "sans-serif",
      capHeight: 700,
      ascent: 920,
      descent: -230,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 466,
      subsets: {
        latin: {
          xWidthAvg: 466
        },
        thai: {
          xWidthAvg: 940
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/nunitoSans12pt.mjs
var nunitoSans12pt_default;
var init_nunitoSans12pt = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/nunitoSans12pt.mjs"() {
    nunitoSans12pt_default = {
      familyName: "Nunito Sans 12pt",
      category: "sans-serif",
      capHeight: 705,
      ascent: 1011,
      descent: -353,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 486,
      xWidthAvg: 452,
      subsets: {
        latin: {
          xWidthAvg: 452
        },
        thai: {
          xWidthAvg: 500
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/pacifico.mjs
var pacifico_default;
var init_pacifico = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/pacifico.mjs"() {
    pacifico_default = {
      familyName: "Pacifico",
      category: "handwriting",
      capHeight: 840,
      ascent: 1303,
      descent: -453,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 460,
      xWidthAvg: 423,
      subsets: {
        latin: {
          xWidthAvg: 423
        },
        thai: {
          xWidthAvg: 265
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/pTSansNarrow.mjs
var pTSansNarrow_default;
var init_pTSansNarrow = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/pTSansNarrow.mjs"() {
    pTSansNarrow_default = {
      familyName: "PT Sans Narrow",
      category: "sans-serif",
      capHeight: 700,
      ascent: 1018,
      descent: -276,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 347,
      subsets: {
        latin: {
          xWidthAvg: 347
        },
        thai: {
          xWidthAvg: 750
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/questrial.mjs
var questrial_default;
var init_questrial = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/questrial.mjs"() {
    questrial_default = {
      familyName: "Questrial",
      category: "sans-serif",
      capHeight: 662,
      ascent: 820,
      descent: -210,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 500,
      xWidthAvg: 444,
      subsets: {
        latin: {
          xWidthAvg: 444
        },
        thai: {
          xWidthAvg: 524
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/righteous.mjs
var righteous_default;
var init_righteous = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/righteous.mjs"() {
    righteous_default = {
      familyName: "Righteous",
      category: "display",
      capHeight: 1434,
      ascent: 2017,
      descent: -526,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1077,
      xWidthAvg: 966,
      subsets: {
        latin: {
          xWidthAvg: 966
        },
        thai: {
          xWidthAvg: 573
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/robotoCondensed.mjs
var robotoCondensed_default;
var init_robotoCondensed = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/robotoCondensed.mjs"() {
    robotoCondensed_default = {
      familyName: "Roboto Condensed",
      category: "sans-serif",
      capHeight: 1456,
      ascent: 1900,
      descent: -500,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1082,
      xWidthAvg: 811,
      subsets: {
        latin: {
          xWidthAvg: 811
        },
        thai: {
          xWidthAvg: 803
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/robotoMono.mjs
var robotoMono_default;
var init_robotoMono = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/robotoMono.mjs"() {
    robotoMono_default = {
      familyName: "Roboto Mono",
      category: "monospace",
      capHeight: 1456,
      ascent: 2146,
      descent: -555,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1082,
      xWidthAvg: 1229,
      subsets: {
        latin: {
          xWidthAvg: 1229
        },
        thai: {
          xWidthAvg: 1229
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/robotoSlab.mjs
var robotoSlab_default;
var init_robotoSlab = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/robotoSlab.mjs"() {
    robotoSlab_default = {
      familyName: "Roboto Slab",
      category: "serif",
      capHeight: 1456,
      ascent: 2146,
      descent: -555,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 1082,
      xWidthAvg: 972,
      subsets: {
        latin: {
          xWidthAvg: 972
        },
        thai: {
          xWidthAvg: 1038
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/signika.mjs
var signika_default;
var init_signika = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/signika.mjs"() {
    signika_default = {
      familyName: "Signika",
      category: "sans-serif",
      capHeight: 1366,
      ascent: 1880,
      descent: -584,
      lineGap: 0,
      unitsPerEm: 2e3,
      xHeight: 996,
      xWidthAvg: 855,
      subsets: {
        latin: {
          xWidthAvg: 855
        },
        thai: {
          xWidthAvg: 1281
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/teko.mjs
var teko_default;
var init_teko = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/teko.mjs"() {
    teko_default = {
      familyName: "Teko",
      category: "sans-serif",
      capHeight: 626,
      ascent: 958,
      descent: -475,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 485,
      xWidthAvg: 292,
      subsets: {
        latin: {
          xWidthAvg: 292
        },
        thai: {
          xWidthAvg: 751
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/varelaRound.mjs
var varelaRound_default;
var init_varelaRound = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/varelaRound.mjs"() {
    varelaRound_default = {
      familyName: "Varela Round",
      category: "sans-serif",
      capHeight: 698,
      ascent: 918,
      descent: -286,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 510,
      xWidthAvg: 478,
      subsets: {
        latin: {
          xWidthAvg: 478
        },
        thai: {
          xWidthAvg: 514
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/vollkorn.mjs
var vollkorn_default;
var init_vollkorn = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/vollkorn.mjs"() {
    vollkorn_default = {
      familyName: "Vollkorn",
      category: "serif",
      capHeight: 676,
      ascent: 952,
      descent: -441,
      lineGap: 0,
      unitsPerEm: 1e3,
      xHeight: 458,
      xWidthAvg: 438,
      subsets: {
        latin: {
          xWidthAvg: 438
        },
        thai: {
          xWidthAvg: 454
        }
      }
    };
  }
});

// node_modules/@capsizecss/metrics/entireMetricsCollection/yantramanav.mjs
var yantramanav_default;
var init_yantramanav = __esm({
  "node_modules/@capsizecss/metrics/entireMetricsCollection/yantramanav.mjs"() {
    yantramanav_default = {
      familyName: "Yantramanav",
      category: "sans-serif",
      capHeight: 1279,
      ascent: 1923,
      descent: -733,
      lineGap: 0,
      unitsPerEm: 2048,
      xHeight: 986,
      xWidthAvg: 843,
      subsets: {
        latin: {
          xWidthAvg: 843
        },
        thai: {
          xWidthAvg: 817
        }
      }
    };
  }
});

// src/utilities/fonts/metrics.ts
function getFontMetrics(fontFamily) {
  if (FONT_METRICS_MAP[fontFamily]) {
    return FONT_METRICS_MAP[fontFamily];
  }
  const normalizedFamily = fontFamily.toLowerCase();
  for (const [key, value] of Object.entries(FONT_METRICS_MAP)) {
    if (key.toLowerCase() === normalizedFamily) {
      return value;
    }
  }
  return null;
}
var FONT_METRICS_MAP;
var init_metrics = __esm({
  "src/utilities/fonts/metrics.ts"() {
    "use strict";
    init_arial();
    init_helvetica();
    init_roboto();
    init_inter();
    init_openSans();
    init_montserrat();
    init_lato();
    init_poppins();
    init_raleway();
    init_sourceSans3();
    init_oswald();
    init_merriweather();
    init_playfairDisplay();
    init_ubuntu();
    init_rubik();
    init_nunito();
    init_notoSans();
    init_pTSans();
    init_pTSerif();
    init_workSans();
    init_quicksand();
    init_firaSans();
    init_barlow();
    init_mulish();
    init_titilliumWeb();
    init_kanit();
    init_dMSans();
    init_heebo();
    init_iBMPlexSans();
    init_mukta();
    init_oxygen();
    init_arimo();
    init_dosis();
    init_josefinSans();
    init_cabin();
    init_anton();
    init_bitter();
    init_crimsonText();
    init_hind();
    init_inconsolata();
    init_karla();
    init_libreBaskerville();
    init_libreFranklin();
    init_lora();
    init_manrope();
    init_mavenPro();
    init_nanumGothic();
    init_nunitoSans12pt();
    init_pacifico();
    init_pTSansNarrow();
    init_questrial();
    init_righteous();
    init_robotoCondensed();
    init_robotoMono();
    init_robotoSlab();
    init_signika();
    init_teko();
    init_varelaRound();
    init_vollkorn();
    init_yantramanav();
    FONT_METRICS_MAP = {
      "Arial": arial_default,
      "Helvetica": helvetica_default,
      "Helvetica Neue": helvetica_default,
      "Roboto": roboto_default,
      "Inter": inter_default,
      "Open Sans": openSans_default,
      "Montserrat": montserrat_default,
      "Lato": lato_default,
      "Poppins": poppins_default,
      "Raleway": raleway_default,
      "Source Sans 3": sourceSans3_default,
      "Source Sans Pro": sourceSans3_default,
      // Alias
      "Oswald": oswald_default,
      "Merriweather": merriweather_default,
      "Playfair Display": playfairDisplay_default,
      "Ubuntu": ubuntu_default,
      "Rubik": rubik_default,
      "Nunito": nunito_default,
      "Noto Sans": notoSans_default,
      "PT Sans": pTSans_default,
      "PT Serif": pTSerif_default,
      "Work Sans": workSans_default,
      "Quicksand": quicksand_default,
      "Fira Sans": firaSans_default,
      "Barlow": barlow_default,
      "Mulish": mulish_default,
      "Muli": mulish_default,
      // Alias
      "Titillium Web": titilliumWeb_default,
      "Kanit": kanit_default,
      "DM Sans": dMSans_default,
      "Heebo": heebo_default,
      "IBM Plex Sans": iBMPlexSans_default,
      "Mukta": mukta_default,
      "Oxygen": oxygen_default,
      "Arimo": arimo_default,
      "Dosis": dosis_default,
      "Josefin Sans": josefinSans_default,
      "Cabin": cabin_default,
      "Anton": anton_default,
      "Bitter": bitter_default,
      "Crimson Text": crimsonText_default,
      "Hind": hind_default,
      "Inconsolata": inconsolata_default,
      "Karla": karla_default,
      "Libre Baskerville": libreBaskerville_default,
      "Libre Franklin": libreFranklin_default,
      "Lora": lora_default,
      "Manrope": manrope_default,
      "Maven Pro": mavenPro_default,
      "Nanum Gothic": nanumGothic_default,
      "Nunito Sans": nunitoSans12pt_default,
      "Pacifico": pacifico_default,
      "PT Sans Narrow": pTSansNarrow_default,
      "Questrial": questrial_default,
      "Righteous": righteous_default,
      "Roboto Condensed": robotoCondensed_default,
      "Roboto Mono": robotoMono_default,
      "Roboto Slab": robotoSlab_default,
      "Signika": signika_default,
      "Teko": teko_default,
      "Varela Round": varelaRound_default,
      "Vollkorn": vollkorn_default,
      "Yantramanav": yantramanav_default
    };
  }
});

// node_modules/@capsizecss/core/dist/index.mjs
function normaliseOptions(options) {
  if ("leading" in options && "lineGap" in options) {
    throw new Error(
      "Only a single line height style can be provided. Please pass either `lineGap` OR `leading`."
    );
  }
  if ("capHeight" in options && "fontSize" in options) {
    throw new Error("Please pass either `capHeight` OR `fontSize`, not both.");
  }
  const { fontMetrics } = options;
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;
  let specifiedFontSize;
  let specifiedCapHeight;
  if ("capHeight" in options) {
    specifiedFontSize = options.capHeight / capHeightScale;
    specifiedCapHeight = options.capHeight;
  } else if ("fontSize" in options) {
    specifiedFontSize = options.fontSize;
    specifiedCapHeight = options.fontSize * capHeightScale;
  } else {
    throw new Error("Please pass either `capHeight` OR `fontSize`.");
  }
  let specifiedLineHeight;
  if ("lineGap" in options) {
    specifiedLineHeight = specifiedCapHeight + options.lineGap;
  } else if ("leading" in options) {
    specifiedLineHeight = options.leading;
  }
  return {
    fontSize: specifiedFontSize,
    lineHeight: specifiedLineHeight,
    fontMetrics
  };
}
function precomputeValues(options) {
  const { fontSize, lineHeight, fontMetrics } = normaliseOptions(options);
  const absoluteDescent = Math.abs(fontMetrics.descent);
  const capHeightScale = fontMetrics.capHeight / fontMetrics.unitsPerEm;
  const descentScale = absoluteDescent / fontMetrics.unitsPerEm;
  const ascentScale = fontMetrics.ascent / fontMetrics.unitsPerEm;
  const lineGapScale = fontMetrics.lineGap / fontMetrics.unitsPerEm;
  const contentArea = fontMetrics.ascent + fontMetrics.lineGap + absoluteDescent;
  const lineHeightScale = contentArea / fontMetrics.unitsPerEm;
  const lineHeightNormal = lineHeightScale * fontSize;
  const allowForLineHeight = (trim) => {
    if (lineHeight) {
      const specifiedLineHeightOffset = (lineHeightNormal - lineHeight) / 2;
      return trim - specifiedLineHeightOffset / fontSize;
    }
    return trim;
  };
  const capHeightTrim = allowForLineHeight(ascentScale - capHeightScale + lineGapScale / 2) * -1;
  const baselineTrim = allowForLineHeight(descentScale + lineGapScale / 2) * -1;
  return {
    fontSize: `${round(fontSize)}px`,
    lineHeight: lineHeight ? `${round(lineHeight)}px` : "normal",
    capHeightTrim: `${round(capHeightTrim)}em`,
    baselineTrim: `${round(baselineTrim)}em`
  };
}
var round;
var init_dist = __esm({
  "node_modules/@capsizecss/core/dist/index.mjs"() {
    round = (value) => parseFloat(value.toFixed(4));
  }
});

// src/utilities/trim/calculations.ts
function calculateTrimValues(fontSize, lineHeightPx, fontMetrics) {
  try {
    const capsizeValues = precomputeValues({
      fontSize,
      leading: lineHeightPx,
      fontMetrics
    });
    const topTrim = Math.round(parseFloat(capsizeValues.capHeightTrim) * fontSize);
    const bottomTrim = Math.round(parseFloat(capsizeValues.baselineTrim) * fontSize);
    return {
      topTrim: Math.abs(topTrim),
      bottomTrim: Math.abs(bottomTrim)
    };
  } catch (error) {
    console.error("Error calculating trim values:", error);
    return { topTrim: 0, bottomTrim: 0 };
  }
}
var init_calculations = __esm({
  "src/utilities/trim/calculations.ts"() {
    "use strict";
    init_dist();
  }
});

// src/utilities/node/validators.ts
function hasMixedFonts(node) {
  if (node.characters.length === 0) return false;
  const firstFont = node.getRangeFontName(0, 1);
  if (firstFont === figma.mixed) return true;
  for (let i = 1; i < node.characters.length; i++) {
    const currentFont = node.getRangeFontName(i, i + 1);
    if (currentFont === figma.mixed) return true;
    if (typeof firstFont !== "symbol" && typeof currentFont !== "symbol") {
      if (firstFont.family !== currentFont.family || firstFont.style !== currentFont.style) {
        return true;
      }
    }
  }
  return false;
}
function hasMixedFontSizes(node) {
  if (node.characters.length === 0) return false;
  const firstSize = node.getRangeFontSize(0, 1);
  if (firstSize === figma.mixed) return true;
  for (let i = 1; i < node.characters.length; i++) {
    const currentSize = node.getRangeFontSize(i, i + 1);
    if (currentSize === figma.mixed) return true;
    if (currentSize !== firstSize) return true;
  }
  return false;
}
function hasMixedLineHeights(node) {
  if (node.characters.length === 0) return false;
  const firstLineHeight = node.getRangeLineHeight(0, 1);
  if (firstLineHeight === figma.mixed) return true;
  for (let i = 1; i < node.characters.length; i++) {
    const currentLineHeight = node.getRangeLineHeight(i, i + 1);
    if (currentLineHeight === figma.mixed) return true;
    if (typeof firstLineHeight !== "symbol" && typeof currentLineHeight !== "symbol") {
      if (firstLineHeight.unit !== currentLineHeight.unit) {
        return true;
      }
      if (firstLineHeight.unit !== "AUTO" && currentLineHeight.unit !== "AUTO") {
        if ("value" in firstLineHeight && "value" in currentLineHeight) {
          if (firstLineHeight.value !== currentLineHeight.value) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
var init_validators = __esm({
  "src/utilities/node/validators.ts"() {
    "use strict";
  }
});

// src/utilities/node/measurements.ts
function getLineHeightInPixels(node) {
  const lineHeight = node.lineHeight;
  const fontSize = typeof node.fontSize === "number" ? node.fontSize : 16;
  if (lineHeight === figma.mixed) {
    const firstLineHeight = node.getRangeLineHeight(0, 1);
    if (firstLineHeight !== figma.mixed) {
      if (firstLineHeight.unit === "PIXELS") {
        return firstLineHeight.value;
      } else if (firstLineHeight.unit === "PERCENT") {
        return firstLineHeight.value / 100 * fontSize;
      } else {
        return fontSize * 1.2;
      }
    }
  } else {
    if (lineHeight.unit === "PIXELS") {
      return lineHeight.value;
    } else if (lineHeight.unit === "PERCENT") {
      return lineHeight.value / 100 * fontSize;
    } else {
      return fontSize * 1.2;
    }
  }
  return 16 * 1.2;
}
var init_measurements = __esm({
  "src/utilities/node/measurements.ts"() {
    "use strict";
  }
});

// src/handlers/trim/trim-text.ts
var trimTextHandler;
var init_trim_text = __esm({
  "src/handlers/trim/trim-text.ts"() {
    "use strict";
    init_lib();
    init_metrics();
    init_calculations();
    init_validators();
    init_measurements();
    trimTextHandler = async function() {
      const selection = figma.currentPage.selection;
      const result = {
        success: false,
        trimmedNodes: 0,
        trimmedTexts: [],
        errors: []
      };
      if (selection.length === 0) {
        result.errors.push("Please select at least one text layer");
        figma.notify("Please select at least one text layer", { error: true });
        emit("TRIM_COMPLETE", result);
        return;
      }
      function findAllTextNodes(nodes) {
        const textNodes2 = [];
        for (const node of nodes) {
          if (node.type === "TEXT") {
            textNodes2.push(node);
          } else if ("children" in node) {
            textNodes2.push(...findAllTextNodes(node.children));
          }
        }
        return textNodes2;
      }
      const textNodes = findAllTextNodes(selection);
      if (textNodes.length === 0) {
        result.errors.push("No text layers found in selection");
        figma.notify("No text layers found in selection", { error: true });
        emit("TRIM_COMPLETE", result);
        return;
      }
      for (const textNode of textNodes) {
        try {
          if (hasMixedFonts(textNode)) {
            result.errors.push(`${textNode.name}: Text has mixed fonts, cannot trim`);
            continue;
          }
          if (hasMixedFontSizes(textNode)) {
            result.errors.push(`${textNode.name}: Text has mixed font sizes, cannot trim`);
            continue;
          }
          if (hasMixedLineHeights(textNode)) {
            result.errors.push(`${textNode.name}: Text has mixed line heights, cannot trim`);
            continue;
          }
          const fontName = textNode.fontName;
          if (fontName === figma.mixed) {
            result.errors.push(`${textNode.name}: Cannot determine font`);
            continue;
          }
          const fontSize = textNode.fontSize;
          if (fontSize === figma.mixed) {
            result.errors.push(`${textNode.name}: Cannot determine font size`);
            continue;
          }
          const lineHeightPx = getLineHeightInPixels(textNode);
          console.log(`[Trim Debug] ${textNode.name}:`, {
            fontSize,
            lineHeightPx,
            fontFamily: fontName.family,
            lineHeightRaw: textNode.lineHeight
          });
          const fontMetrics = getFontMetrics(fontName.family);
          if (!fontMetrics) {
            result.errors.push(
              `${textNode.name}: Font "${fontName.family}" is not currently supported. Try Arial, Roboto, Inter, or other common fonts.`
            );
            continue;
          }
          const { topTrim, bottomTrim } = calculateTrimValues(fontSize, lineHeightPx, fontMetrics);
          console.log(`[Trim Debug] Calculated trims:`, {
            topTrim,
            bottomTrim,
            ratio: lineHeightPx / fontSize
          });
          if (topTrim === 0 && bottomTrim === 0) {
            result.errors.push(`${textNode.name}: Could not calculate trim values`);
            continue;
          }
          try {
            await figma.loadFontAsync({
              family: fontName.family,
              style: fontName.style
            });
          } catch (error) {
            result.errors.push(`${textNode.name}: Failed to load font "${fontName.family} ${fontName.style}"`);
            continue;
          }
          if (textNode.textAutoResize === "NONE") {
            textNode.textAutoResize = "HEIGHT";
          }
          const frame = figma.createFrame();
          frame.name = `${textNode.name} (Trimmed)`;
          frame.layoutMode = "VERTICAL";
          frame.primaryAxisSizingMode = "AUTO";
          frame.counterAxisSizingMode = "AUTO";
          frame.paddingTop = 0;
          frame.paddingBottom = 0;
          frame.paddingLeft = 0;
          frame.paddingRight = 0;
          frame.fills = [];
          frame.clipsContent = false;
          frame.x = textNode.x - topTrim;
          frame.y = textNode.y - topTrim;
          const parent = textNode.parent;
          let insertIndex = 0;
          if (parent && "children" in parent) {
            insertIndex = parent.children.indexOf(textNode);
          }
          if (parent && "appendChild" in parent) {
            frame.appendChild(textNode);
          }
          textNode.x = 0;
          textNode.y = -topTrim;
          const trimmedHeight = lineHeightPx - topTrim - bottomTrim;
          frame.resize(textNode.width, trimmedHeight);
          if (parent && "insertChild" in parent) {
            parent.insertChild(insertIndex, frame);
          }
          result.trimmedTexts.push({
            nodeId: textNode.id,
            nodeName: textNode.name,
            font: {
              family: fontName.family,
              style: fontName.style
            },
            fontSize,
            lineHeight: lineHeightPx,
            topTrim,
            bottomTrim
          });
          result.trimmedNodes++;
        } catch (error) {
          result.errors.push(`${textNode.name}: ${error}`);
        }
      }
      result.success = result.trimmedNodes > 0;
      if (result.success) {
        figma.notify(
          `Successfully trimmed ${result.trimmedNodes} text layer${result.trimmedNodes !== 1 ? "s" : ""}`
        );
      } else {
        figma.notify("Failed to trim text layers", { error: true });
      }
      emit("TRIM_COMPLETE", result);
    };
  }
});

// src/utilities/line-height/calculations.ts
function calculatePerfectLineHeight(fontSize, fontName, metrics, fontCategory) {
  let heuristicMultiplier;
  let isHeadingOrDisplay = false;
  if (fontSize > 32) {
    heuristicMultiplier = 1.15;
    isHeadingOrDisplay = true;
  } else if (fontSize >= 20) {
    heuristicMultiplier = 1.25;
    isHeadingOrDisplay = true;
  } else if (fontSize >= 14) {
    heuristicMultiplier = 1.5;
  } else {
    heuristicMultiplier = 1.35;
  }
  const name = fontName || "";
  if (name.includes("Condensed") || name.includes("Compressed") || name.includes("Narrow") || name.includes("Oswald") || name.includes("Bebas")) {
    heuristicMultiplier -= 0.1;
  }
  if (!isHeadingOrDisplay) {
    if (fontCategory === "Serif" || name.includes("Merriweather") || name.includes("Lora") || name.includes("Playfair")) {
      heuristicMultiplier += 0.1;
    }
  }
  if (name.includes("Display") || fontCategory === "Handwriting") {
    heuristicMultiplier -= 0.05;
  }
  const heuristicHeight = fontSize * heuristicMultiplier;
  let finalHeight;
  if (metrics) {
    const { ascent, descent, unitsPerEm } = metrics;
    const contentRatio = (Math.abs(ascent) + Math.abs(descent)) / unitsPerEm;
    const physicalMinHeight = fontSize * contentRatio;
    const leadingBuffer = fontSize * 0.1;
    const targetHeight = physicalMinHeight + leadingBuffer;
    if (isHeadingOrDisplay) {
      const safeHeight = Math.max(heuristicHeight, targetHeight);
      const remainder = safeHeight % 1;
      if (remainder > 0 && remainder <= 0.2) {
        finalHeight = Math.floor(safeHeight);
      } else {
        finalHeight = Math.ceil(safeHeight);
      }
    } else {
      const targetRaw = Math.max(heuristicHeight, targetHeight);
      finalHeight = Math.ceil(targetRaw / 4) * 4;
    }
  } else {
    if (isHeadingOrDisplay) {
      finalHeight = Math.ceil(heuristicHeight);
    } else {
      finalHeight = Math.ceil(heuristicHeight / 4) * 4;
    }
  }
  const minSafety = Math.max(fontSize + 4, fontSize * 1.05);
  if (finalHeight < minSafety) {
    finalHeight = Math.ceil(minSafety);
  }
  return finalHeight;
}
function getRecommendedLineHeight(fontSize, fontName = "", metrics) {
  return calculatePerfectLineHeight(fontSize, fontName, metrics);
}
function calculateLineOverlap(fontSize, lineHeightPx, fontName = "", metrics) {
  const recommendedLineHeight = getRecommendedLineHeight(fontSize, fontName, metrics);
  const difference = Math.abs(recommendedLineHeight - lineHeightPx);
  return Math.round(difference);
}
var init_calculations2 = __esm({
  "src/utilities/line-height/calculations.ts"() {
    "use strict";
  }
});

// src/utilities/line-height/analysis.ts
function checkLineHeightIssue(fontSize, lineHeightPx, fontName = "", metrics) {
  const recommended = calculatePerfectLineHeight(fontSize, fontName, metrics);
  const ratio = lineHeightPx / fontSize;
  const difference = lineHeightPx - recommended;
  const TOLERANCE = 0.5;
  if (Math.abs(difference) <= TOLERANCE) {
    return {
      hasIssue: false,
      issueType: "OPTIMAL",
      ratio,
      recommended
    };
  }
  if (difference < 0) {
    return {
      hasIssue: true,
      issueType: "TOO_TIGHT",
      ratio,
      recommended
    };
  } else {
    return {
      hasIssue: true,
      issueType: "TOO_LOOSE",
      ratio,
      recommended
    };
  }
}
var init_analysis = __esm({
  "src/utilities/line-height/analysis.ts"() {
    "use strict";
    init_calculations2();
  }
});

// src/utilities/fonts/dynamic-metrics.ts
async function fetchDynamicFontMetrics(fontFamily) {
  if (DYNAMIC_METRICS_CACHE[fontFamily]) {
    return DYNAMIC_METRICS_CACHE[fontFamily];
  }
  try {
    const familyName = fontFamily.replace(/ /g, "+");
    const url = `${METRICS_SERVER_URL}?family=${familyName}`;
    console.log(`[Dynamic Metrics] Requesting from server: ${url}`);
    const response = await fetch(url);
    if (!response.ok) {
      console.warn(`[Dynamic Metrics] Server returned ${response.status} for ${fontFamily}`);
      return null;
    }
    const data = await response.json();
    if (data.error) {
      console.warn(`[Dynamic Metrics] Server error for ${fontFamily}: ${data.error}`);
      return null;
    }
    if (data.ascent && data.unitsPerEm) {
      console.log(`[Dynamic Metrics] Successfully fetched metrics for ${fontFamily}`, data);
      DYNAMIC_METRICS_CACHE[fontFamily] = data;
      return data;
    }
  } catch (error) {
    console.error(`[Dynamic Metrics] Network error fetching metrics for ${fontFamily}:`, error);
  }
  return null;
}
var DYNAMIC_METRICS_CACHE, METRICS_SERVER_URL;
var init_dynamic_metrics = __esm({
  "src/utilities/fonts/dynamic-metrics.ts"() {
    "use strict";
    DYNAMIC_METRICS_CACHE = {};
    METRICS_SERVER_URL = "http://localhost:3000/metrics";
  }
});

// src/handlers/line-height/scan.ts
var scanLineHeightsHandler;
var init_scan2 = __esm({
  "src/handlers/line-height/scan.ts"() {
    "use strict";
    init_lib();
    init_measurements();
    init_analysis();
    init_calculations2();
    init_metrics();
    init_dynamic_metrics();
    scanLineHeightsHandler = async function() {
      const selection = figma.currentPage.selection;
      const result = {
        totalScanned: 0,
        issuesFound: 0,
        textLayers: []
      };
      if (selection.length === 0) {
        figma.notify("Please select at least one text layer", { error: true });
        emit("LINE_HEIGHT_SCAN_COMPLETE", result);
        return;
      }
      function findAllTextNodes(nodes) {
        const textNodes2 = [];
        for (const node of nodes) {
          if (node.type === "TEXT") {
            textNodes2.push(node);
          } else if ("children" in node) {
            textNodes2.push(...findAllTextNodes(node.children));
          }
        }
        return textNodes2;
      }
      const textNodes = findAllTextNodes(selection);
      if (textNodes.length === 0) {
        figma.notify("No text layers found in selection", { error: true });
        emit("LINE_HEIGHT_SCAN_COMPLETE", result);
        return;
      }
      const uniqueFamilies = /* @__PURE__ */ new Set();
      for (const node of textNodes) {
        if (node.fontName !== figma.mixed) {
          uniqueFamilies.add(node.fontName.family);
        }
      }
      const missingMetrics = [];
      for (const family of uniqueFamilies) {
        if (!getFontMetrics(family)) {
          missingMetrics.push(family);
        }
      }
      if (missingMetrics.length > 0) {
        figma.notify(`Fetching metrics for ${missingMetrics.length} font(s)...`);
        for (const family of missingMetrics) {
          await fetchDynamicFontMetrics(family);
        }
      }
      for (const textNode of textNodes) {
        try {
          const fontName = textNode.fontName;
          if (fontName === figma.mixed) {
            console.log(`[LH Scan] Skipping ${textNode.name}: mixed fonts`);
            continue;
          }
          const fontSize = textNode.fontSize;
          if (fontSize === figma.mixed) {
            console.log(`[LH Scan] Skipping ${textNode.name}: mixed font sizes`);
            continue;
          }
          let metrics = getFontMetrics(fontName.family);
          if (!metrics) {
            metrics = await fetchDynamicFontMetrics(fontName.family);
          }
          const lineHeight = textNode.lineHeight;
          if (lineHeight === figma.mixed) {
            console.log(`[LH Scan] WARNING: ${textNode.name} has mixed line heights!`);
            const characters = textNode.characters;
            let worstRatio = 1.5;
            let worstLineHeight = fontSize * 1.5;
            let hasIssues = false;
            let worstIssueType = "OPTIMAL";
            for (let i = 0; i < characters.length; i++) {
              const charLineHeight = textNode.getRangeLineHeight(i, i + 1);
              if (charLineHeight !== figma.mixed && charLineHeight.unit === "PIXELS") {
                const issue2 = checkLineHeightIssue(fontSize, charLineHeight.value, fontName.family, metrics);
                if (issue2.hasIssue) {
                  if (!hasIssues) {
                    hasIssues = true;
                    worstLineHeight = charLineHeight.value;
                    worstRatio = issue2.ratio;
                    worstIssueType = issue2.issueType;
                  }
                }
              }
            }
            if (hasIssues) {
              const recommendedLineHeight2 = getRecommendedLineHeight(fontSize, fontName.family, metrics);
              result.textLayers.push({
                nodeId: textNode.id,
                nodeName: `${textNode.name} (mixed)`,
                fontFamily: fontName.family,
                fontStyle: fontName.style,
                fontSize,
                lineHeight: worstLineHeight,
                lineHeightRatio: worstRatio,
                hasIssue: true,
                issueType: worstIssueType,
                recommendedLineHeight: recommendedLineHeight2,
                overlapAmount: Math.abs(recommendedLineHeight2 - worstLineHeight)
              });
              result.totalScanned++;
              result.issuesFound++;
            }
            continue;
          }
          const lineHeightPx = getLineHeightInPixels(textNode);
          const issue = checkLineHeightIssue(fontSize, lineHeightPx, fontName.family, metrics);
          const recommendedLineHeight = issue.recommended;
          const overlapAmount = calculateLineOverlap(fontSize, lineHeightPx, fontName.family, metrics);
          result.textLayers.push({
            nodeId: textNode.id,
            nodeName: textNode.name,
            fontFamily: fontName.family,
            fontStyle: fontName.style,
            fontSize,
            lineHeight: lineHeightPx,
            lineHeightRatio: issue.ratio,
            hasIssue: issue.hasIssue,
            issueType: issue.issueType,
            recommendedLineHeight: issue.hasIssue ? recommendedLineHeight : void 0,
            overlapAmount: issue.hasIssue ? overlapAmount : void 0
          });
          result.totalScanned++;
          if (issue.hasIssue) {
            result.issuesFound++;
          }
        } catch (error) {
          console.error(`[LH Scan] Error scanning ${textNode.name}:`, error);
        }
      }
      if (result.issuesFound > 0) {
        figma.notify(`Found ${result.issuesFound} line height issue${result.issuesFound === 1 ? "" : "s"}`);
      } else {
        figma.notify("All line heights are optimal!");
      }
      emit("LINE_HEIGHT_SCAN_COMPLETE", result);
    };
  }
});

// src/handlers/line-height/fix.ts
var fixLineHeightHandler;
var init_fix = __esm({
  "src/handlers/line-height/fix.ts"() {
    "use strict";
    init_lib();
    fixLineHeightHandler = async function(spec) {
      try {
        const node = figma.getNodeById(spec.nodeId);
        if (!node || node.type !== "TEXT") {
          figma.notify("Text layer not found", { error: true });
          return;
        }
        const fontName = node.fontName;
        if (fontName === figma.mixed) {
          figma.notify("Cannot fix text with mixed fonts", { error: true });
          return;
        }
        await figma.loadFontAsync({
          family: fontName.family,
          style: fontName.style
        });
        node.lineHeight = {
          value: spec.newLineHeight,
          unit: "PIXELS"
        };
        figma.notify(`\u2713 Updated "${node.name}" line height to ${spec.newLineHeight}px`);
        emit("SCAN_LINE_HEIGHTS");
      } catch (error) {
        figma.notify(`Failed to fix line height: ${error}`, { error: true });
      }
    };
  }
});

// src/handlers/line-height/fix-all.ts
var fixAllLineHeightsHandler;
var init_fix_all = __esm({
  "src/handlers/line-height/fix-all.ts"() {
    "use strict";
    init_lib();
    fixAllLineHeightsHandler = async function(spec) {
      let successCount = 0;
      const errors = [];
      for (const fix of spec.fixes) {
        try {
          const node = figma.getNodeById(fix.nodeId);
          if (!node || node.type !== "TEXT") {
            continue;
          }
          const fontName = node.fontName;
          if (fontName === figma.mixed) {
            errors.push(`Skipped ${node.name}: Mixed fonts`);
            continue;
          }
          await figma.loadFontAsync({
            family: fontName.family,
            style: fontName.style
          });
          node.lineHeight = {
            value: fix.newLineHeight,
            unit: "PIXELS"
          };
          successCount++;
        } catch (error) {
          errors.push(`Failed to fix ${fix.nodeId}: ${error}`);
        }
      }
      if (successCount > 0) {
        figma.notify(`Fixed ${successCount} line height issue${successCount !== 1 ? "s" : ""}`);
        emit("SCAN_LINE_HEIGHTS");
      } else if (errors.length > 0) {
        figma.notify("Failed to fix some issues", { error: true });
        console.error("Fix all errors:", errors);
      }
    };
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
function main_default() {
  on("SCAN_FONTS", scanFontsHandler);
  on("APPLY_REPLACEMENT", applyReplacementHandler);
  on("BULK_UPDATE", bulkUpdateHandler);
  on("PREVIEW_SELECTION", previewSelectionHandler);
  on("REQUEST_AVAILABLE_FONTS", requestAvailableFontsHandler);
  on("TRIM_TEXT", trimTextHandler);
  on("SCAN_LINE_HEIGHTS", scanLineHeightsHandler);
  on("FIX_LINE_HEIGHT", fixLineHeightHandler);
  on("FIX_ALL_LINE_HEIGHTS", fixAllLineHeightsHandler);
  on("SELECT_NODE", selectNodeHandler);
  once("close", function() {
    figma.closePlugin();
  });
  showUI({
    width: 380,
    height: 480
  });
}
var init_main = __esm({
  "src/main.ts"() {
    "use strict";
    init_lib();
    init_scan();
    init_replace();
    init_bulk_update();
    init_available();
    init_preview();
    init_select();
    init_trim_text();
    init_scan2();
    init_fix();
    init_fix_all();
  }
});

// <stdin>
var modules = { "src/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"], "open": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = typeof figma.command === "undefined" || figma.command === "" || figma.command === "generate" ? "src/main.ts--default" : figma.command;
modules[commandId]();
