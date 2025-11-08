/**
 * Font Loader Service
 * Manages asynchronous font loading with queuing and error handling
 */

import type { FoundFont } from '../types';

/**
 * Queue for managing font loading operations
 */
class FontLoadQueue {
  private queue: Array<() => Promise<void>> = [];
  private running = 0;
  private readonly maxConcurrent = 3;
  private loadedFonts = new Set<string>();

  /**
   * Adds a font to the loading queue
   * @param {FoundFont} font - Font to load
   * @returns {Promise<void>} Promise that resolves when font is loaded
   */
  async loadFont(font: FoundFont): Promise<void> {
    const fontKey = `${font.family}||${font.style}`;

    // Skip if already loaded
    if (this.loadedFonts.has(fontKey)) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const task = async () => {
        this.running++;

        try {
          await figma.loadFontAsync({
            family: font.family,
            style: font.style,
          });

          this.loadedFonts.add(fontKey);
          resolve();
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : String(error);
          console.error(`Failed to load font ${font.family} ${font.style}:`, errorMessage);
          reject(new Error(`Font not available: ${font.family} ${font.style}`));
        } finally {
          this.running--;
          this.processQueue();
        }
      };

      this.queue.push(task);
      this.processQueue();
    });
  }

  /**
   * Processes the queue
   */
  private processQueue(): void {
    while (this.running < this.maxConcurrent && this.queue.length > 0) {
      const task = this.queue.shift();
      if (task) {
        task();
      }
    }
  }

  /**
   * Loads multiple fonts
   * @param {FoundFont[]} fonts - Fonts to load
   * @returns {Promise<{loaded: FoundFont[], failed: FoundFont[]}>} Loading results
   */
  async loadFonts(fonts: FoundFont[]): Promise<{
    loaded: FoundFont[];
    failed: FoundFont[];
  }> {
    const results = await Promise.allSettled(
      fonts.map((font) => this.loadFont(font).then(() => font))
    );

    const loaded: FoundFont[] = [];
    const failed: FoundFont[] = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        loaded.push(result.value);
      } else {
        failed.push(fonts[index]);
      }
    });

    return { loaded, failed };
  }

  /**
   * Clears the loaded fonts cache
   */
  clear(): void {
    this.loadedFonts.clear();
    this.queue = [];
  }
}

// Singleton instance
export const fontLoadQueue = new FontLoadQueue();

/**
 * Loads a single font asynchronously
 * @param {FoundFont} font - Font to load
 * @returns {Promise<void>} Promise that resolves when font is loaded
 */
export async function loadFont(font: FoundFont): Promise<void> {
  return fontLoadQueue.loadFont(font);
}

/**
 * Loads multiple fonts asynchronously
 * @param {FoundFont[]} fonts - Fonts to load
 * @returns {Promise<{loaded: FoundFont[], failed: FoundFont[]}>} Loading results
 */
export async function loadFonts(fonts: FoundFont[]): Promise<{
  loaded: FoundFont[];
  failed: FoundFont[];
}> {
  return fontLoadQueue.loadFonts(fonts);
}
