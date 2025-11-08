/**
 * Font Toolkit Plugin - Main Entry Point
 * Handles plugin lifecycle and UI communication
 */

import type {
  PluginMessage,
  FontsFoundPayload,
  ReplacementSpec,
  ProgressPayload,
} from './types';
import { scanFontOccurrences, extractUniqueFonts } from './services/font-scanner';
import { createAllGroupings, createFontMetadata } from './services/grouping';
import { applyFontReplacement, previewSelection } from './services/font-replacer';

// Show UI
figma.showUI(__html__, {
  width: 380,
  height: 600,
  themeColors: true,
});

/**
 * Sends a message to the UI
 * @param {PluginMessage} message - Message to send
 */
function sendToUI(message: PluginMessage): void {
  figma.ui.postMessage(message);
}

/**
 * Sends progress update to UI
 * @param {number} current - Current progress
 * @param {number} total - Total items
 * @param {string} message - Progress message
 */
function sendProgress(current: number, total: number, message: string): void {
  const payload: ProgressPayload = { current, total, message };
  sendToUI({ type: 'progress', payload });
}

/**
 * Handles scan fonts request
 */
async function handleScanFonts(): Promise<void> {
  try {
    const selection = figma.currentPage.selection;

    if (selection.length === 0) {
      figma.notify('Please select at least one layer', { error: true });
      sendToUI({
        type: 'error',
        payload: { message: 'No selection found' },
      });
      return;
    }

    sendProgress(0, 100, 'Scanning fonts...');

    // Scan for font occurrences
    const occurrences = scanFontOccurrences(selection);

    if (occurrences.length === 0) {
      figma.notify('No text layers found in selection');
      sendToUI({
        type: 'error',
        payload: { message: 'No text layers found' },
      });
      return;
    }

    sendProgress(50, 100, 'Creating groups...');

    // Create groupings
    const groups = createAllGroupings(occurrences);

    // Create font metadata
    const fonts = createFontMetadata(occurrences);

    // Count unique nodes
    const nodeIds = new Set(occurrences.map((occ) => occ.nodeId));
    const totalNodes = nodeIds.size;

    sendProgress(100, 100, 'Complete!');

    // Send results to UI
    const payload: FontsFoundPayload = {
      fonts,
      occurrences,
      groups,
      totalNodes,
    };

    sendToUI({ type: 'fonts-found', payload });

    figma.notify(`Found ${fonts.length} fonts in ${totalNodes} text layers`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error scanning fonts:', error);
    figma.notify('Error scanning fonts', { error: true });
    sendToUI({
      type: 'error',
      payload: { message: errorMessage },
    });
  }
}

/**
 * Handles apply replacement request
 * @param {any} payload - Replacement specification
 */
async function handleApplyReplacement(payload: any): Promise<void> {
  try {
    const spec = payload.spec as ReplacementSpec;
    const occurrences = payload.occurrences;

    if (!spec || !occurrences || occurrences.length === 0) {
      figma.notify('Invalid replacement specification', { error: true });
      return;
    }

    sendProgress(0, 100, 'Loading fonts...');

    const result = await applyFontReplacement(occurrences, spec);

    sendProgress(100, 100, 'Complete!');

    if (result.success) {
      let message = `Updated ${result.affectedRanges} text ranges in ${result.affectedNodes} layers`;
      if (result.skipped > 0) {
        message += ` (${result.skipped} skipped)`;
      }
      figma.notify(message);
    } else {
      figma.notify('Failed to apply changes', { error: true });
    }

    sendToUI({
      type: 'replacement-complete',
      payload: result,
    });

    if (result.errors.length > 0) {
      console.warn('Replacement errors:', result.errors);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error('Error applying replacement:', error);
    figma.notify('Error applying replacement', { error: true });
    sendToUI({
      type: 'error',
      payload: { message: errorMessage },
    });
  }
}

/**
 * Handles preview selection request
 * @param {any} payload - Occurrences to preview
 */
function handlePreviewSelection(payload: any): void {
  try {
    const occurrences = payload.occurrences;

    if (!occurrences || occurrences.length === 0) {
      return;
    }

    previewSelection(occurrences);
    figma.notify(`Selected ${occurrences.length} text ranges`);
  } catch (error) {
    console.error('Error previewing selection:', error);
    figma.notify('Error previewing selection', { error: true });
  }
}

/**
 * Handles load available fonts request
 */
async function handleLoadAvailableFonts(): Promise<void> {
  try {
    // Get available fonts
    const availableFonts = await figma.listAvailableFontsAsync();

    sendToUI({
      type: 'available-fonts',
      payload: availableFonts,
    });
  } catch (error) {
    console.error('Error loading available fonts:', error);
    sendToUI({
      type: 'error',
      payload: { message: 'Failed to load available fonts' },
    });
  }
}

// Handle messages from UI
figma.ui.onmessage = async (message: PluginMessage) => {
  switch (message.type) {
    case 'scan-fonts':
      await handleScanFonts();
      break;

    case 'apply-replacement':
      await handleApplyReplacement(message.payload);
      break;

    case 'preview-selection':
      handlePreviewSelection(message.payload);
      break;

    case 'load-available-fonts':
      await handleLoadAvailableFonts();
      break;

    default:
      console.warn('Unknown message type:', message.type);
  }
};

// Initial message
sendToUI({
  type: 'scan-fonts',
  payload: { message: 'Ready to scan fonts' },
});
