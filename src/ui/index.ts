/**
 * Font Toolkit UI - Main Entry Point
 * Handles UI interactions and plugin communication
 */

// Types
interface PluginMessage<T = any> {
  type: string;
  payload?: T;
}

interface FontMetadata {
  font: { family: string; style: string };
  occurrences: FontOccurrence[];
  count: number;
  nodes: Set<string>;
}

interface FontOccurrence {
  nodeId: string;
  nodeName: string;
  nodeType: 'TEXT';
  rangeStart: number;
  rangeEnd: number;
  font: { family: string; style: string };
  fontSize: number | 'mixed';
  lineHeight: any;
  computedLineHeightPx: number;
  fontWeight: string;
}

interface OccurrenceGroup {
  key: string;
  label: string;
  occurrences: FontOccurrence[];
  count: number;
}

interface FontsFoundPayload {
  fonts: FontMetadata[];
  occurrences: FontOccurrence[];
  groups: Record<string, OccurrenceGroup[]>;
  totalNodes: number;
}

// Global state
let currentFonts: FontMetadata[] = [];
let currentOccurrences: FontOccurrence[] = [];
let currentGroups: Record<string, OccurrenceGroup[]> = {
  lineHeight: [],
  fontSize: [],
  fontWeight: [],
  fontFamily: [],
};
let availableFonts: any[] = [];
let selectedFont: FontMetadata | null = null;
let selectedGroup: OccurrenceGroup | null = null;
let currentTab = 'home';

// DOM Elements
const scanButton = document.getElementById('scan-button') as HTMLButtonElement;
const fontSearch = document.getElementById('font-search') as HTMLInputElement;
const fontList = document.getElementById('font-list') as HTMLDivElement;
const groupBySelect = document.getElementById('group-by-select') as HTMLSelectElement;
const groupList = document.getElementById('group-list') as HTMLDivElement;
const statusElement = document.getElementById('status') as HTMLDivElement;
const footer = document.getElementById('footer') as HTMLElement;
const footerInfo = document.getElementById('footer-info') as HTMLDivElement;
const previewButton = document.getElementById('preview-button') as HTMLButtonElement;
const replaceModal = document.getElementById('replace-modal') as HTMLDivElement;
const modalClose = document.getElementById('modal-close') as HTMLButtonElement;
const modalCancel = document.getElementById('modal-cancel') as HTMLButtonElement;
const modalApply = document.getElementById('modal-apply') as HTMLButtonElement;
const newFamilyInput = document.getElementById('new-family') as HTMLInputElement;
const newStyleSelect = document.getElementById('new-style') as HTMLSelectElement;
const updateLineHeightCheckbox = document.getElementById('update-line-height') as HTMLInputElement;
const newLineHeightInput = document.getElementById('new-line-height') as HTMLInputElement;
const updateFontSizeCheckbox = document.getElementById('update-font-size') as HTMLInputElement;
const newFontSizeInput = document.getElementById('new-font-size') as HTMLInputElement;
const progressOverlay = document.getElementById('progress-overlay') as HTMLDivElement;
const progressFill = document.getElementById('progress-fill') as HTMLDivElement;
const progressText = document.getElementById('progress-text') as HTMLParagraphElement;

/**
 * Sends a message to the plugin
 * @param {PluginMessage} message - Message to send
 */
function sendToPlugin(message: PluginMessage): void {
  parent.postMessage({ pluginMessage: message }, '*');
}

/**
 * Updates the status message
 * @param {string} text - Status text
 */
function updateStatus(text: string): void {
  const statusText = statusElement.querySelector('.status__text');
  if (statusText) {
    statusText.textContent = text;
  }
}

/**
 * Shows progress overlay
 * @param {number} percent - Progress percentage
 * @param {string} message - Progress message
 */
function showProgress(percent: number, message: string): void {
  progressOverlay.style.display = 'flex';
  progressFill.style.width = `${percent}%`;
  progressText.textContent = message;
}

/**
 * Hides progress overlay
 */
function hideProgress(): void {
  progressOverlay.style.display = 'none';
}

/**
 * Switches to a different tab
 * @param {string} tabName - Tab name to switch to
 */
function switchTab(tabName: string): void {
  // Update tab buttons
  document.querySelectorAll('.tab').forEach((tab) => {
    tab.classList.remove('tab--active');
    if (tab.getAttribute('data-tab') === tabName) {
      tab.classList.add('tab--active');
    }
  });

  // Update tab content
  document.querySelectorAll('.tab-content').forEach((content) => {
    content.classList.remove('tab-content--active');
  });

  const targetContent = document.getElementById(`${tabName}-tab`);
  if (targetContent) {
    targetContent.classList.add('tab-content--active');
  }

  currentTab = tabName;
}

/**
 * Renders the font list
 * @param {FontMetadata[]} fonts - Fonts to render
 * @param {string} searchQuery - Search query to filter
 */
function renderFontList(fonts: FontMetadata[], searchQuery = ''): void {
  let filteredFonts = fonts;

  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredFonts = fonts.filter((f) =>
      `${f.font.family} ${f.font.style}`.toLowerCase().includes(query)
    );
  }

  if (filteredFonts.length === 0) {
    fontList.innerHTML = '<div class="empty-state"><p>No fonts found.</p></div>';
    return;
  }

  fontList.innerHTML = '';

  filteredFonts.forEach((fontMeta) => {
    const item = document.createElement('div');
    item.className = 'font-item';

    const preview = document.createElement('div');
    preview.className = 'font-preview';
    preview.textContent = 'Aa';

    const info = document.createElement('div');
    info.className = 'font-info';

    const name = document.createElement('span');
    name.className = 'font-name';
    name.textContent = `${fontMeta.font.family} — ${fontMeta.font.style}`;

    const meta = document.createElement('span');
    meta.className = 'font-meta';
    meta.textContent = `${fontMeta.count} ranges · ${fontMeta.nodes.size} layers`;

    info.appendChild(name);
    info.appendChild(meta);

    const count = document.createElement('span');
    count.className = 'font-count';
    count.textContent = fontMeta.count.toString();

    const actions = document.createElement('div');
    actions.className = 'font-actions';

    const replaceBtn = document.createElement('button');
    replaceBtn.className = 'button button--small button--primary';
    replaceBtn.textContent = 'Replace';
    replaceBtn.onclick = () => openReplaceModal(fontMeta);

    actions.appendChild(replaceBtn);

    item.appendChild(preview);
    item.appendChild(info);
    item.appendChild(count);
    item.appendChild(actions);

    item.onclick = (e) => {
      if (e.target !== replaceBtn) {
        selectFont(fontMeta);
      }
    };

    fontList.appendChild(item);
  });
}

/**
 * Renders the group list
 * @param {OccurrenceGroup[]} groups - Groups to render
 */
function renderGroupList(groups: OccurrenceGroup[]): void {
  if (groups.length === 0) {
    groupList.innerHTML = '<div class="empty-state"><p>No groups available.</p></div>';
    return;
  }

  groupList.innerHTML = '';

  groups.forEach((group) => {
    const item = document.createElement('div');
    item.className = 'group-item';

    const header = document.createElement('div');
    header.className = 'group-header';

    const title = document.createElement('span');
    title.className = 'group-title';
    title.textContent = group.label;

    const badge = document.createElement('div');
    badge.className = 'group-badge';

    const countSpan = document.createElement('span');
    countSpan.className = 'font-count';
    countSpan.textContent = group.count.toString();

    const selectBtn = document.createElement('button');
    selectBtn.className = 'button button--small button--secondary';
    selectBtn.textContent = 'Select';
    selectBtn.onclick = (e) => {
      e.stopPropagation();
      selectGroup(group);
    };

    badge.appendChild(countSpan);
    badge.appendChild(selectBtn);

    header.appendChild(title);
    header.appendChild(badge);

    header.onclick = () => {
      item.classList.toggle('group-item--expanded');
    };

    const content = document.createElement('div');
    content.className = 'group-content';

    const miniList = document.createElement('div');
    miniList.className = 'font-list';

    // Show first 5 occurrences
    group.occurrences.slice(0, 5).forEach((occ) => {
      const miniItem = document.createElement('div');
      miniItem.style.cssText = 'padding: 8px; border-bottom: 1px solid var(--color-border);';
      miniItem.innerHTML = `
        <div style="font-size: 12px; font-weight: 500;">${occ.font.family} ${occ.font.style}</div>
        <div style="font-size: 11px; color: var(--color-text-secondary);">${occ.nodeName}</div>
      `;
      miniList.appendChild(miniItem);
    });

    if (group.count > 5) {
      const more = document.createElement('div');
      more.style.cssText = 'padding: 8px; text-align: center; font-size: 11px; color: var(--color-text-muted);';
      more.textContent = `+${group.count - 5} more`;
      miniList.appendChild(more);
    }

    content.appendChild(miniList);

    item.appendChild(header);
    item.appendChild(content);

    groupList.appendChild(item);
  });
}

/**
 * Selects a font
 * @param {FontMetadata} fontMeta - Font to select
 */
function selectFont(fontMeta: FontMetadata): void {
  selectedFont = fontMeta;
  updateFooter();
}

/**
 * Selects a group
 * @param {OccurrenceGroup} group - Group to select
 */
function selectGroup(group: OccurrenceGroup): void {
  selectedGroup = group;
  sendToPlugin({
    type: 'preview-selection',
    payload: { occurrences: group.occurrences },
  });
}

/**
 * Updates footer information
 */
function updateFooter(): void {
  if (selectedFont) {
    footer.style.display = 'flex';
    footerInfo.innerHTML = `<span class="footer__text">${selectedFont.font.family} ${selectedFont.font.style} · ${selectedFont.count} ranges</span>`;
  } else {
    footer.style.display = 'none';
  }
}

/**
 * Opens the replace modal
 * @param {FontMetadata} fontMeta - Font to replace
 */
function openReplaceModal(fontMeta: FontMetadata): void {
  selectedFont = fontMeta;

  const currentFontName = document.getElementById('current-font-name');
  if (currentFontName) {
    currentFontName.textContent = `${fontMeta.font.family} — ${fontMeta.font.style}`;
  }

  newFamilyInput.value = '';
  newStyleSelect.innerHTML = '<option value="">Select a family first</option>';
  updateLineHeightCheckbox.checked = false;
  updateFontSizeCheckbox.checked = false;
  newLineHeightInput.disabled = true;
  newFontSizeInput.disabled = true;
  newLineHeightInput.value = '';
  newFontSizeInput.value = '';

  replaceModal.style.display = 'flex';

  // Request available fonts
  sendToPlugin({ type: 'load-available-fonts' });
}

/**
 * Closes the replace modal
 */
function closeReplaceModal(): void {
  replaceModal.style.display = 'none';
}

/**
 * Applies the font replacement
 */
function applyReplacement(): void {
  if (!selectedFont) {
    return;
  }

  const newFamily = newFamilyInput.value.trim();
  const newStyle = newStyleSelect.value;

  if (!newFamily || !newStyle) {
    alert('Please select a font family and style');
    return;
  }

  const spec: any = {
    targetFont: selectedFont.font,
    newFont: { family: newFamily, style: newStyle },
    scope: 'all',
  };

  if (updateLineHeightCheckbox.checked && newLineHeightInput.value) {
    spec.newLineHeight = {
      value: parseFloat(newLineHeightInput.value),
      unit: 'PIXELS',
    };
  }

  if (updateFontSizeCheckbox.checked && newFontSizeInput.value) {
    spec.newFontSize = parseFloat(newFontSizeInput.value);
  }

  sendToPlugin({
    type: 'apply-replacement',
    payload: {
      spec,
      occurrences: selectedFont.occurrences,
    },
  });

  closeReplaceModal();
}

// Event Listeners

// Scan button
scanButton.addEventListener('click', () => {
  sendToPlugin({ type: 'scan-fonts' });
  updateStatus('Scanning...');
});

// Tab navigation
document.querySelectorAll('.tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const tabName = tab.getAttribute('data-tab');
    if (tabName) {
      switchTab(tabName);
    }
  });
});

// Font search
fontSearch.addEventListener('input', (e) => {
  const query = (e.target as HTMLInputElement).value;
  renderFontList(currentFonts, query);
});

// Group by select
groupBySelect.addEventListener('change', (e) => {
  const groupBy = (e.target as HTMLSelectElement).value;
  const groups = currentGroups[groupBy] || [];
  renderGroupList(groups);
});

// Preview button
previewButton.addEventListener('click', () => {
  if (selectedFont) {
    sendToPlugin({
      type: 'preview-selection',
      payload: { occurrences: selectedFont.occurrences },
    });
  }
});

// Modal controls
modalClose.addEventListener('click', closeReplaceModal);
modalCancel.addEventListener('click', closeReplaceModal);
modalApply.addEventListener('click', applyReplacement);

// Update line height checkbox
updateLineHeightCheckbox.addEventListener('change', (e) => {
  newLineHeightInput.disabled = !(e.target as HTMLInputElement).checked;
});

// Update font size checkbox
updateFontSizeCheckbox.addEventListener('change', (e) => {
  newFontSizeInput.disabled = !(e.target as HTMLInputElement).checked;
});

// New family input autocomplete
newFamilyInput.addEventListener('input', (e) => {
  const query = (e.target as HTMLInputElement).value.toLowerCase();
  const dropdown = document.getElementById('family-dropdown');

  if (!dropdown || query.length < 2) {
    if (dropdown) dropdown.style.display = 'none';
    return;
  }

  const matches = availableFonts.filter((font) =>
    font.fontName.family.toLowerCase().includes(query)
  );

  if (matches.length === 0) {
    dropdown.style.display = 'none';
    return;
  }

  // Get unique families
  const families = Array.from(new Set(matches.map((f) => f.fontName.family)));

  dropdown.innerHTML = '';
  families.slice(0, 10).forEach((family) => {
    const item = document.createElement('div');
    item.className = 'dropdown__item';
    item.textContent = family;
    item.onclick = () => {
      newFamilyInput.value = family;
      dropdown.style.display = 'none';
      updateStylesForFamily(family);
    };
    dropdown.appendChild(item);
  });

  dropdown.style.display = 'block';
});

/**
 * Updates styles dropdown for selected family
 * @param {string} family - Font family
 */
function updateStylesForFamily(family: string): void {
  const styles = availableFonts
    .filter((f) => f.fontName.family === family)
    .map((f) => f.fontName.style);

  newStyleSelect.innerHTML = '';

  if (styles.length === 0) {
    newStyleSelect.innerHTML = '<option value="">No styles available</option>';
    return;
  }

  styles.forEach((style) => {
    const option = document.createElement('option');
    option.value = style;
    option.textContent = style;
    newStyleSelect.appendChild(option);
  });
}

// Handle messages from plugin
window.onmessage = (event) => {
  const message = event.data.pluginMessage as PluginMessage;

  switch (message.type) {
    case 'fonts-found':
      const payload = message.payload as FontsFoundPayload;
      currentFonts = payload.fonts;
      currentOccurrences = payload.occurrences;
      currentGroups = payload.groups;

      renderFontList(currentFonts);
      renderGroupList(currentGroups.lineHeight);

      updateStatus(`Found ${payload.fonts.length} fonts in ${payload.totalNodes} layers`);
      switchTab('fonts');
      break;

    case 'available-fonts':
      availableFonts = message.payload;
      break;

    case 'replacement-complete':
      const result = message.payload;
      if (result.success) {
        // Rescan fonts
        sendToPlugin({ type: 'scan-fonts' });
      }
      break;

    case 'progress':
      const progress = message.payload;
      showProgress(
        (progress.current / progress.total) * 100,
        progress.message
      );
      if (progress.current >= progress.total) {
        setTimeout(hideProgress, 500);
      }
      break;

    case 'error':
      hideProgress();
      updateStatus(message.payload.message);
      break;
  }
};
