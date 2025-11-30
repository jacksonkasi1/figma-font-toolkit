This document serves as a **Product Requirements Document (PRD) and Logic Guide** for building a Figma plugin (or establishing a manual design system) that automatically calculates the perfect line height for any Google Font.

-----

# PRD: The "Perfect Line Height" Algorithm

**Version:** 1.0
**Objective:** Eliminate the guesswork of "Auto" line height in Figma by applying a mathematical logic that accounts for font size, usage context, and font personality.

-----

## 1\. The Core Logic: "The Universal Math Sheet"

This is the baseline lookup table. Before accounting for specific font quirks, the algorithm determines the **Base Multiplier** based on the font size (Text Role).

| Text Role | Font Size Range | Base Multiplier (X-Factor) | Target Grid | Reasoning |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | \> 32px | **1.1x** | Round to 4px | Big text needs tight packing to look like a solid shape. |
| **Heading** | 20px - 32px | **1.25x** | Round to 4px | Short lines need structure. Prevents "floating" titles. |
| **Body Copy** | 14px - 19px | **1.5x** | Round to 4px | The "Gold Standard" for long-form reading comfort. |
| **Caption / UI** | \< 14px | **1.35x** | Round to 4px | Small labels need to fit into tight UI buttons/cards. |

-----

## 2\. The "Personality" Detection (Variable Logic)

This addresses your question: *"How do we know what kind of font it is?"*
Since we cannot visually "see" the font in code, we use **Metadata Heuristics**. We analyze the Font Name and Category to apply specific **Modifiers** to the Base Multiplier.

### Detection Hierarchy

The algorithm should check these properties in this specific order:

#### A. The "Condensed" Check (Tall & Narrow)

  * **Trigger:** Does Font Name contain string `"Condensed"`, `"Compressed"`, or `"Narrow"`? (e.g., *Roboto Condensed, Bebas Neue*)
  * **Action:** **Subtract 0.1** from Base Multiplier.
  * *Why:* Narrow letters have less visual weight; standard spacing looks like huge gaps.

#### B. The "Tall Serif" Check (High X-Height)

  * **Trigger:** Is Font Category `"Serif"`? OR Does Font Name match specific "Tall" list (e.g., *Merriweather, Lora*)?
  * **Action:** **Add 0.1** to Base Multiplier.
  * *Why:* Fonts like Merriweather have tall lowercase letters. They physically crash if the multiplier is too tight.

#### C. The "Display" Check (Decorative)

  * **Trigger:** Does Font Name contain `"Display"` or is Category `"Handwriting"`?
  * **Action:** **Subtract 0.05** (Make it slightly tighter).
  * *Why:* Display fonts usually have unique bounding boxes that look better when tight.

-----

## 3\. The Algorithm (Pseudo-Code)

This is the logic flow for your plugin "BrowserPilot" or automation script.

**Inputs:** `FontSize` (Number), `FontName` (String), `FontCategory` (String - optional)

```javascript
FUNCTION CalculateLineHeight(FontSize, FontName):

  // STEP 1: ESTABLISH BASE ROLE (The Universal Math)
  IF FontSize > 32:
      Multiplier = 1.1
  ELSE IF FontSize >= 20:
      Multiplier = 1.25  // (The Heading Sweet Spot)
  ELSE IF FontSize >= 14:
      Multiplier = 1.5   // (The Body Standard)
  ELSE:
      Multiplier = 1.35  // (Caption/UI)

  // STEP 2: DETECT FONT PERSONALITY (The Modifiers)
  // Check for Condensed fonts (Oswald, Roboto Condensed)
  IF FontName contains "Condensed" OR "Oswald" OR "Bebas":
      Multiplier = Multiplier - 0.1

  // Check for "Tall" Serifs or High X-Heights (Merriweather, etc.)
  IF FontName contains "Merriweather" OR "Lora" OR "Playfair":
      Multiplier = Multiplier + 0.1

  // STEP 3: CALCULATE RAW HEIGHT
  RawHeight = FontSize * Multiplier

  // STEP 4: APPLY THE 4PX GRID (The Clean Design Fix)
  // We ceil (round up) to the nearest 4 to ensure we never cut off text
  FinalHeight = Math.ceil(RawHeight / 4) * 4

  // STEP 5: SAFETY FLOOR (The "Anti-Crash" Rule)
  // Ensure line height is never smaller than the font itself + 2px buffer
  IF FinalHeight < (FontSize + 2):
      FinalHeight = FontSize + 4

  RETURN FinalHeight
```

-----

## 4\. Test Cases (Verification)

Use these examples to verify if the logic is working correctly.

| Input Font | Size | Role logic | Personality Logic | Raw Math | **Final Result** | Note |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Poppins** | 16px | Body (1.5) | None | $16 \times 1.5 = 24$ | **24px** | Perfect standard. |
| **Merriweather** | 20px | Head (1.25) | Tall (+0.1) $\rightarrow$ 1.35 | $20 \times 1.35 = 27$ | **28px** | Rounded to 4pt grid. |
| **Merriweather** | 20px | *Override*\* | Tight Fit Preference | $20 \times 1.25 = 25$ | **25px** | *Manual override for Headers allowed.* |
| **Oswald** | 40px | Hero (1.1) | Condensed (-0.1) $\rightarrow$ 1.0 | $40 \times 1.0 = 40$ | **40px** | Perfectly stacked. |

### Note on the "Merriweather 25px" Edge Case

In our conversation, you noted that **25px** worked for Merriweather at 20px.

  * The algorithm above outputs **28px** (for safety/readability).
  * **Refinement:** If the user selects "Tight/Heading Mode" in your plugin, simply **disable the 4px grid rounding** and use the exact floor value.
      * *Logic:* `Math.floor(20 * 1.25) = 25px`.
