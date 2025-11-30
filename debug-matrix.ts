
// This script simulates the logic currently implemented in src/utilities/line-height/calculations.ts
// We use this to verify behavior across different fonts and sizes.

function calculatePerfectLineHeight(
  fontSize: number,
  fontName: string,
  fontCategory?: string
): { final: number; logicTrace: string } {
  let multiplier: number;
  let isHeadingOrDisplay = false;
  let trace: string[] = [];

  // STEP 1: ESTABLISH BASE ROLE
  if (fontSize > 32) {
    multiplier = 1.1; // Display / Hero
    isHeadingOrDisplay = true;
    trace.push(`Size ${fontSize} (>32) -> Hero Base 1.1x`);
  } else if (fontSize >= 20) {
    multiplier = 1.25; // Heading
    isHeadingOrDisplay = true;
    trace.push(`Size ${fontSize} (>=20) -> Heading Base 1.25x`);
  } else if (fontSize >= 14) {
    multiplier = 1.5; // Body Copy
    trace.push(`Size ${fontSize} (>=14) -> Body Base 1.5x`);
  } else {
    multiplier = 1.35; // Caption / UI
    trace.push(`Size ${fontSize} (<14) -> Caption Base 1.35x`);
  }

  // STEP 2: DETECT FONT PERSONALITY
  const name = fontName || '';
  
  // Check for Condensed fonts
  if (
    name.includes('Condensed') ||
    name.includes('Compressed') ||
    name.includes('Narrow') ||
    name.includes('Oswald') ||
    name.includes('Bebas')
  ) {
    multiplier -= 0.1;
    trace.push(`Detected Condensed -> -0.1`);
  }

  // Check for "Tall" Serifs
  // For Headings/Display, we SKIP the extra height for Tall Serifs to keep it tight.
  if (!isHeadingOrDisplay) {
    if (
      fontCategory === 'Serif' ||
      name.includes('Merriweather') ||
      name.includes('Lora') ||
      name.includes('Playfair')
    ) {
      multiplier += 0.1;
      trace.push(`Detected Tall Serif (<20px) -> +0.1`);
    }
  } else {
     if (
      fontCategory === 'Serif' ||
      name.includes('Merriweather') ||
      name.includes('Lora') ||
      name.includes('Playfair')
    ) {
      trace.push(`Detected Tall Serif (>=20px) -> Modifier Skipped for tightness`);
    }
  }

  // Check for "Display"
  if (
    name.includes('Display') ||
    fontCategory === 'Handwriting'
  ) {
    multiplier -= 0.05;
    trace.push(`Detected Display/Handwriting -> -0.05`);
  }

  trace.push(`Final Multiplier: ${multiplier.toFixed(2)}x`);

  // STEP 3: CALCULATE RAW HEIGHT
  const rawHeight = fontSize * multiplier;
  trace.push(`Raw Height: ${rawHeight.toFixed(2)}px`);

  // STEP 4: APPLY GRID OR ROUNDING
  let finalHeight: number;

  if (isHeadingOrDisplay) {
    // For Headings/Display, disable 4px grid to ensure tight fit
    // Use floor as per "Tight/Heading Mode" spec
    finalHeight = Math.floor(rawHeight);
    trace.push(`Mode: Heading (Tight) -> Floor(${rawHeight}) = ${finalHeight}`);
  } else {
    // For Body/UI, keep the 4px grid for rhythm
    finalHeight = Math.ceil(rawHeight / 4) * 4;
    trace.push(`Mode: Body (Grid) -> RoundTo4(${rawHeight}) = ${finalHeight}`);
  }

  // STEP 5: SAFETY FLOOR
  if (finalHeight < fontSize + 2) {
    finalHeight = fontSize + 4;
    trace.push(`Safety Floor Triggered -> ${finalHeight}`);
  }

  return { final: finalHeight, logicTrace: trace.join(' | ') };
}

// --- TEST RUNNER ---

const testCases = [
  { name: 'Merriweather', category: 'Serif', sizes: [16, 20, 32] },
  { name: 'Roboto', category: 'Sans Serif', sizes: [12, 16, 20, 40] },
  { name: 'Oswald', category: 'Sans Serif', sizes: [20, 40, 60] }, // Condensed
  { name: 'Playfair Display', category: 'Serif', sizes: [24, 48] }, // Display
  { name: 'Open Sans', category: 'Sans Serif', sizes: [14, 18] },
];

console.log('--- LOGIC VERIFICATION MATRIX ---');
console.log(String('Font').padEnd(20) + String('Size').padEnd(8) + String('Result').padEnd(8) + 'Logic Trace');
console.log('-'.repeat(100));

testCases.forEach(font => {
  font.sizes.forEach(size => {
    const result = calculatePerfectLineHeight(size, font.name, font.category);
    console.log(
      font.name.padEnd(20) + 
      (size + 'px').padEnd(8) + 
      (result.final + 'px').padEnd(8) + 
      result.logicTrace
    );
  });
  console.log('-'.repeat(100)); // Separator between fonts
});
