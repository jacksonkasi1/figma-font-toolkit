This document serves as a **Product Requirements Document (PRD) and Logic Guide** for building a Figma plugin (or establishing a manual design system) that automatically calculates the perfect line height for any Google Font.

-----

# PRD: The "Perfect Line Height" Algorithm

**Version:** 2.0 (Metrics-First "Super Algorithm")
**Objective:** Eliminate the guesswork of "Auto" line height in Figma by applying a hybrid logic that prioritizes physical font metrics (physics) and falls back to statistical heuristics (design theory) when data is missing.

-----

## 1. The Core Logic: "Metrics-First Approach"

The algorithm no longer relies solely on multipliers. It follows a strict hierarchy of truth:

1.  **Physics (Hard Truth):** Does the font have known vertical metrics (Ascender/Descender)? If yes, calculate the absolute minimum space needed to prevent letters from touching.
2.  **Intent (Design Truth):** Does the designer want a "Tight" look (Headings) or a "Comfortable" look (Body)?
3.  **Reconciliation:** If the "Intent" multiplier is too aggressive and causes clipping (physics), the Physics layer overrides it.

-----

## 2. The "Fallback Heuristic" (The Universal Math Sheet)

This table is used *only* when specific font metrics are unavailable, or to establish the "Design Intent" baseline.

| Text Role | Font Size Range | Base Multiplier | Target Grid | Reasoning |
| :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | > 32px | **1.15x** | 1px (Integer) | Increased from 1.1x to prevent cutoff in modern sans-serifs. |
| **Heading** | 20px - 32px | **1.25x** | 1px (Integer) | Tight fit. "Tall Serif" modifier ignored for tightness. |
| **Body Copy** | 14px - 19px | **1.5x** | Round to 4px | The "Gold Standard" for long-form reading comfort. |
| **Caption / UI** | < 14px | **1.35x** | Round to 4px | Small labels need to fit into tight UI buttons/cards. |

-----

## 3. The Algorithm (Logic Flow)

**Inputs:** `FontSize` (Number), `FontName` (String), `FontCategory` (String - optional)

```javascript
FUNCTION CalculateLineHeight(FontSize, FontName):

  // STEP 1: ESTABLISH HEURISTIC TARGET (The "Wish")
  // Calculate what we *want* the height to be based on standard design theory.
  IF FontSize > 32: Multiplier = 1.15
  ELSE IF FontSize >= 20: Multiplier = 1.25
  ELSE IF FontSize >= 14: Multiplier = 1.5
  ELSE: Multiplier = 1.35

  // Apply Personality Modifiers (only to Heuristic)
  IF "Condensed": Multiplier -= 0.1
  IF "Display": Multiplier -= 0.05
  IF "Tall Serif" AND FontSize < 20: Multiplier += 0.1  // Only apply extra height to small text

  HeuristicHeight = FontSize * Multiplier

  // STEP 2: APPLY PHYSICS (The "Reality Check")
  IF FontMetrics exist for FontName:
      PhysicalRatio = (Ascent + Descent) / UnitsPerEm
      PhysicalMin = FontSize * PhysicalRatio
      
      // Add "Breathing Room" (10% Buffer)
      // Pure physics = touching lines. We add standard leading buffer.
      SafeTarget = PhysicalMin + (FontSize * 0.10)

      // The Override: Never let style break physics
      IF IsHeading:
          // Take the larger of Style vs Physics
          RawTarget = MAX(HeuristicHeight, SafeTarget)
          
          // SMART ROUNDING (The "Human Touch")
          // Resolve conflict between Tight Small Text vs Safe Large Text
          // If we are barely over an integer (e.g. 35.14px), Snap DOWN (35px).
          // If we are significantly over (e.g. 73.5px), Snap UP (74px).
          Tolerance = 0.2
          IF (RawTarget % 1) <= Tolerance:
              FinalHeight = FLOOR(RawTarget)
          ELSE:
              FinalHeight = CEIL(RawTarget)
      ELSE:
          // For Body, respect the 4px grid for rhythm
          RawTarget = MAX(HeuristicHeight, SafeTarget)
          FinalHeight = CEIL(RawTarget / 4) * 4
  
  ELSE (No Metrics):
      // Fallback to Heuristic + simple rounding
      IF IsHeading: FinalHeight = CEIL(HeuristicHeight)
      ELSE: FinalHeight = CEIL(HeuristicHeight / 4) * 4

  // STEP 3: SAFETY FLOOR
  // Ensure extremely loose fonts don't scale weirdly at massive sizes
  MinSafety = MAX(FontSize + 4, FontSize * 1.05)
  FinalHeight = MAX(FinalHeight, CEIL(MinSafety))

  RETURN FinalHeight
```

-----

## 4. Test Cases (Verification)

These real-world examples confirm the "Smart Rounding" logic works across scales.

| Input Font | Size | Logic Path | Math Trace | **Final Result** | Note |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Poppins** | 23.44px | Metrics + Smart Snap | Phys (32.8) + Buf (2.3) = 35.14px | **35px** | Snapped DOWN (within 0.2 tolerance). |
| **Poppins** | 49px | Metrics + Smart Snap | Phys (68.6) + Buf (4.9) = 73.5px | **74px** | Snapped UP (unsafe to round down). |
| **Merriweather** | 20px | Heuristic (Tight) | 20 * 1.25 = 25.0px | **25px** | Perfect integer match. |
| **Roboto** | 16px | Body (Grid) | 16 * 1.5 = 24px | **24px** | Standard 4px grid. |
| **Lobster** | 60px | Fallback (Unknown) | 60 * 1.15 (Display) = 69px | **69px** | Safe heuristic guess. |

-----

## 5. Key Improvements in Version 2.0

1.  **Metrics Integration:** Uses `@capsizecss/metrics` to know the exact physical boundary of supported fonts.
2.  **Variable Buffer:** Replaced rigid rounding with a "Smart Snap" tolerance (0.2px) that allows 35.1px to become 35px while forcing 73.5px to become 74px.
3.  **Display Scalability:** Increased base Display multiplier to 1.15x to prevent visual cutoff in modern geometric sans-serifs (like Poppins).