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

// src/utilities/trim-utilities.ts
var trim_utilities_exports = {};
__export(trim_utilities_exports, {
  calculateLineOverlap: () => calculateLineOverlap,
  calculateTrimValues: () => calculateTrimValues,
  calculateUniversalLineHeight: () => calculateUniversalLineHeight,
  checkLineHeightIssue: () => checkLineHeightIssue,
  getFontMetrics: () => getFontMetrics,
  getLineHeightInPixels: () => getLineHeightInPixels,
  getRecommendedLineHeight: () => getRecommendedLineHeight,
  hasMixedFontSizes: () => hasMixedFontSizes,
  hasMixedFonts: () => hasMixedFonts,
  hasMixedLineHeights: () => hasMixedLineHeights,
  isLineHeightTooTight: () => isLineHeightTooTight
});
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
function calculateTrimValues(fontSize, lineHeightPx, fontMetrics) {
  try {
    const capsizeValues = precomputeValues({
      fontSize,
      leading: lineHeightPx,
      fontMetrics
    });
    console.log("[Capsize Debug] Raw values:", {
      fontSize,
      lineHeightPx,
      capHeightTrim: capsizeValues.capHeightTrim,
      baselineTrim: capsizeValues.baselineTrim,
      fontMetrics: {
        familyName: fontMetrics.familyName,
        capHeight: fontMetrics.capHeight,
        ascent: fontMetrics.ascent,
        descent: fontMetrics.descent,
        unitsPerEm: fontMetrics.unitsPerEm
      }
    });
    const topTrim = Math.round(parseFloat(capsizeValues.capHeightTrim) * fontSize);
    const bottomTrim = Math.round(parseFloat(capsizeValues.baselineTrim) * fontSize);
    console.log("[Capsize Debug] Calculated:", {
      topTrimRaw: parseFloat(capsizeValues.capHeightTrim) * fontSize,
      bottomTrimRaw: parseFloat(capsizeValues.baselineTrim) * fontSize,
      topTrimRounded: topTrim,
      bottomTrimRounded: bottomTrim
    });
    return {
      topTrim: Math.abs(topTrim),
      bottomTrim: Math.abs(bottomTrim)
    };
  } catch (error) {
    console.error("Error calculating trim values:", error);
    return { topTrim: 0, bottomTrim: 0 };
  }
}
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
function getLineHeightInPixels(node) {
  const lineHeight = node.lineHeight;
  const fontSize = typeof node.fontSize === "number" ? node.fontSize : 16;
  if (lineHeight === figma.mixed) {
    console.log("[getLineHeightInPixels] Mixed line height detected, checking first character");
    const firstLineHeight = node.getRangeLineHeight(0, 1);
    if (firstLineHeight !== figma.mixed) {
      if (firstLineHeight.unit === "PIXELS") {
        console.log("[getLineHeightInPixels] First char PIXELS:", firstLineHeight.value);
        return firstLineHeight.value;
      } else if (firstLineHeight.unit === "PERCENT") {
        const calculated = firstLineHeight.value / 100 * fontSize;
        console.log("[getLineHeightInPixels] First char PERCENT:", firstLineHeight.value, "% =", calculated, "px");
        return calculated;
      } else {
        console.log("[getLineHeightInPixels] First char AUTO, using 120%");
        return fontSize * 1.2;
      }
    }
  } else {
    if (lineHeight.unit === "PIXELS") {
      console.log("[getLineHeightInPixels] PIXELS:", lineHeight.value);
      return lineHeight.value;
    } else if (lineHeight.unit === "PERCENT") {
      const calculated = lineHeight.value / 100 * fontSize;
      console.log("[getLineHeightInPixels] PERCENT:", lineHeight.value, "% =", calculated, "px");
      return calculated;
    } else {
      console.log("[getLineHeightInPixels] AUTO, using 120%");
      return fontSize * 1.2;
    }
  }
  console.log("[getLineHeightInPixels] Fallback to default");
  return 16 * 1.2;
}
function calculateUniversalLineHeight(fontSize, fontWeight) {
  let multiplier = 1.5;
  if (fontWeight) {
    if (fontWeight <= 300) {
      multiplier = 1.45;
    } else if (fontWeight <= 400) {
      multiplier = 1.5;
    } else if (fontWeight <= 600) {
      multiplier = 1.55;
    } else {
      multiplier = 1.6;
    }
  }
  const minClearance = 8;
  const calculated = fontSize * multiplier;
  return Math.max(calculated, fontSize + minClearance);
}
function checkLineHeightIssue(fontSize, lineHeightPx) {
  const ratio = lineHeightPx / fontSize;
  if (ratio < MIN_RATIO) {
    return {
      hasIssue: true,
      issueType: "TOO_TIGHT",
      ratio
    };
  } else if (ratio > MAX_RATIO) {
    return {
      hasIssue: true,
      issueType: "TOO_LOOSE",
      ratio
    };
  } else {
    return {
      hasIssue: false,
      issueType: "OPTIMAL",
      ratio
    };
  }
}
function isLineHeightTooTight(fontSize, lineHeightPx) {
  const ratio = lineHeightPx / fontSize;
  return ratio < MIN_RATIO;
}
function getRecommendedLineHeight(fontSize) {
  return Math.round(fontSize * OPTIMAL_RATIO);
}
function calculateLineOverlap(fontSize, lineHeightPx) {
  const recommendedLineHeight = getRecommendedLineHeight(fontSize);
  const difference = Math.abs(recommendedLineHeight - lineHeightPx);
  return Math.round(difference);
}
var FONT_METRICS_MAP, MIN_RATIO, MAX_RATIO, OPTIMAL_RATIO;
var init_trim_utilities = __esm({
  "src/utilities/trim-utilities.ts"() {
    "use strict";
    init_dist();
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
      "Source Sans 3": sourceSans3_default
    };
    MIN_RATIO = 1.3;
    MAX_RATIO = 1.7;
    OPTIMAL_RATIO = 1.5;
  }
});

// src/main.ts
var main_exports = {};
__export(main_exports, {
  default: () => main_default
});
function main_default() {
  on("SCAN_FONTS", async function() {
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
  });
  on("APPLY_REPLACEMENT", async function(spec) {
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
  });
  on("BULK_UPDATE", async function(spec) {
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
  });
  on("PREVIEW_SELECTION", function(occurrences) {
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
  });
  on("REQUEST_AVAILABLE_FONTS", async function() {
    const availableFonts = await figma.listAvailableFontsAsync();
    emit("AVAILABLE_FONTS", availableFonts);
  });
  on("TRIM_TEXT", async function() {
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
    const {
      getFontMetrics: getFontMetrics2,
      calculateTrimValues: calculateTrimValues2,
      hasMixedFonts: hasMixedFonts2,
      hasMixedFontSizes: hasMixedFontSizes2,
      hasMixedLineHeights: hasMixedLineHeights2,
      getLineHeightInPixels: getLineHeightInPixels2
    } = await Promise.resolve().then(() => (init_trim_utilities(), trim_utilities_exports));
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
        if (hasMixedFonts2(textNode)) {
          result.errors.push(`${textNode.name}: Text has mixed fonts, cannot trim`);
          continue;
        }
        if (hasMixedFontSizes2(textNode)) {
          result.errors.push(`${textNode.name}: Text has mixed font sizes, cannot trim`);
          continue;
        }
        if (hasMixedLineHeights2(textNode)) {
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
        const lineHeightPx = getLineHeightInPixels2(textNode);
        console.log(`[Trim Debug] ${textNode.name}:`, {
          fontSize,
          lineHeightPx,
          fontFamily: fontName.family,
          lineHeightRaw: textNode.lineHeight
        });
        const fontMetrics = getFontMetrics2(fontName.family);
        if (!fontMetrics) {
          result.errors.push(
            `${textNode.name}: Font "${fontName.family}" is not currently supported. Try Arial, Roboto, Inter, or other common fonts.`
          );
          continue;
        }
        const { topTrim, bottomTrim } = calculateTrimValues2(fontSize, lineHeightPx, fontMetrics);
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
  });
  on("SCAN_LINE_HEIGHTS", async function() {
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
    const {
      getLineHeightInPixels: getLineHeightInPixels2,
      checkLineHeightIssue: checkLineHeightIssue2,
      getRecommendedLineHeight: getRecommendedLineHeight2,
      calculateLineOverlap: calculateLineOverlap2
    } = await Promise.resolve().then(() => (init_trim_utilities(), trim_utilities_exports));
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
        const lineHeight = textNode.lineHeight;
        if (lineHeight === figma.mixed) {
          console.log(`[LH Scan] WARNING: ${textNode.name} has mixed line heights!`);
          console.log("[LH Scan] Checking all characters to find worst case...");
          const characters = textNode.characters;
          let worstRatio = 1.5;
          let worstLineHeight = fontSize * 1.5;
          let hasIssues = false;
          let worstIssueType = "OPTIMAL";
          for (let i = 0; i < characters.length; i++) {
            const charLineHeight = textNode.getRangeLineHeight(i, i + 1);
            if (charLineHeight !== figma.mixed && charLineHeight.unit === "PIXELS") {
              const ratio = charLineHeight.value / fontSize;
              if (ratio < 1.3) {
                if (!hasIssues || ratio < worstRatio) {
                  worstRatio = ratio;
                  worstLineHeight = charLineHeight.value;
                  worstIssueType = "TOO_TIGHT";
                  hasIssues = true;
                }
              } else if (ratio > 1.7) {
                if (!hasIssues || ratio > worstRatio) {
                  worstRatio = ratio;
                  worstLineHeight = charLineHeight.value;
                  worstIssueType = "TOO_LOOSE";
                  hasIssues = true;
                }
              }
            }
          }
          if (hasIssues) {
            console.log(`[LH Scan] Worst case in ${textNode.name}:`, {
              lineHeight: worstLineHeight,
              ratio: worstRatio.toFixed(2),
              issueType: worstIssueType
            });
            const recommendedLineHeight2 = getRecommendedLineHeight2(fontSize);
            result.textLayers.push({
              nodeId: textNode.id,
              nodeName: `${textNode.name} (mixed)`,
              // Add (mixed) indicator
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
          } else {
            console.log(`[LH Scan] ${textNode.name} has mixed line heights but all are optimal`);
          }
          continue;
        }
        const lineHeightPx = getLineHeightInPixels2(textNode);
        const issue = checkLineHeightIssue2(fontSize, lineHeightPx);
        const recommendedLineHeight = getRecommendedLineHeight2(fontSize);
        const overlapAmount = calculateLineOverlap2(fontSize, lineHeightPx);
        console.log(`[LH Scan] ${textNode.name}:`, {
          fontSize,
          lineHeight: lineHeightPx,
          ratio: issue.ratio.toFixed(2),
          issueType: issue.issueType,
          hasIssue: issue.hasIssue,
          recommended: recommendedLineHeight
        });
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
  });
  on("FIX_LINE_HEIGHT", async function(spec) {
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
  });
  on("SELECT_NODE", function(spec) {
    const node = figma.getNodeById(spec.nodeId);
    if (node) {
      figma.currentPage.selection = [node];
      figma.viewport.scrollAndZoomIntoView([node]);
    }
  });
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
    init_font_operations();
  }
});

// <stdin>
var modules = { "src/main.ts--default": (init_main(), __toCommonJS(main_exports))["default"], "open": (init_main(), __toCommonJS(main_exports))["default"] };
var commandId = typeof figma.command === "undefined" || figma.command === "" || figma.command === "generate" ? "src/main.ts--default" : figma.command;
modules[commandId]();
