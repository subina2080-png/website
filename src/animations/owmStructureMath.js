import gsap from 'gsap';

/**
 * Calculates node positions for images forming the letters 'O', 'W', and 'M'
 * and sacred 'OM (ॐ)' structure in a normalized 2D/3D space.
 */

// Normalized offsets for the 3 letters O, W, M across the horizontal stage
export const LETTER_OFFSETS = {
  O: -0.68, // Left section
  W: 0,     // Center section
  M: 0.68   // Right section
};

/**
 * Returns canonical coordinates (x, y) for an image index belonging to letter 'O', 'W', or 'M'
 * @param {string} letter - 'O', 'W', or 'M'
 * @param {number} subIndex - 0..2 or 0..3 within the letter group
 * @param {number} totalInLetter - total count in this letter group
 */
export function getLetterShapeCoordinates(letter, subIndex, totalInLetter = 3) {
  const t = totalInLetter > 1 ? subIndex / (totalInLetter - 1) : 0.5;

  if (letter === 'O') {
    // Circle arc around letter 'O'
    const angle = t * 2 * Math.PI - Math.PI / 2; // Start top
    const radiusX = 140;
    const radiusY = 160;
    return {
      x: Math.cos(angle) * radiusX,
      y: Math.sin(angle) * radiusY,
      tiltZ: (t - 0.5) * 15,
      scale: 0.95
    };
  } else if (letter === 'W') {
    // Zig-zag path forming 'W': (0, -140) -> (0.25, 140) -> (0.5, -20) -> (0.75, 140) -> (1, -140)
    const points = [
      { x: -160, y: -130 },
      { x: -80, y: 140 },
      { x: 0, y: -30 },
      { x: 80, y: 140 },
      { x: 160, y: -130 }
    ];
    const segCount = points.length - 1;
    const scaledT = t * segCount;
    const segIndex = Math.min(Math.floor(scaledT), segCount - 1);
    const segProgress = scaledT - segIndex;

    const p1 = points[segIndex];
    const p2 = points[segIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segProgress,
      y: p1.y + (p2.y - p1.y) * segProgress,
      tiltZ: (segIndex % 2 === 0 ? -12 : 12),
      scale: 0.95
    };
  } else if (letter === 'M') {
    // Mountain double peak forming 'M': (0, 140) -> (0.25, -140) -> (0.5, 30) -> (0.75, -140) -> (1, 140)
    const points = [
      { x: -160, y: 140 },
      { x: -80, y: -130 },
      { x: 0, y: 30 },
      { x: 80, y: -130 },
      { x: 160, y: 140 }
    ];
    const segCount = points.length - 1;
    const scaledT = t * segCount;
    const segIndex = Math.min(Math.floor(scaledT), segCount - 1);
    const segProgress = scaledT - segIndex;

    const p1 = points[segIndex];
    const p2 = points[segIndex + 1];

    return {
      x: p1.x + (p2.x - p1.x) * segProgress,
      y: p1.y + (p2.y - p1.y) * segProgress,
      tiltZ: (segIndex % 2 === 0 ? 12 : -12),
      scale: 0.95
    };
  }

  return { x: 0, y: 0, tiltZ: 0, scale: 1 };
}

/**
 * Returns canonical coordinates for images mapped onto the Sacred OM (ॐ) symbol shape.
 */
export function getOmSymbolCoordinates(index, totalItems) {
  const omNodes = [
    { x: -110, y: -40, tilt: -10, scale: 1.0 },
    { x: -160, y: 40, tilt: -18, scale: 0.95 },
    { x: -60, y: 140, tilt: 15, scale: 1.0 },
    { x: 0, y: 20, tilt: 5, scale: 0.9 },
    { x: 80, y: 130, tilt: -20, scale: 1.05 },
    { x: 150, y: -40, tilt: 25, scale: 0.95 },
    { x: 10, y: -130, tilt: 0, scale: 1.1 },
    { x: 30, y: -210, tilt: 0, scale: 1.15 },
    { x: -80, y: -150, tilt: -12, scale: 0.9 }
  ];

  const node = omNodes[index % omNodes.length];
  return {
    x: node.x,
    y: node.y,
    tiltZ: node.tilt,
    scale: node.scale
  };
}

/**
 * Main function calculating transform properties for each image inside the OWM structure based on scroll progress.
 */
export function calculateOwmItemProps({
  index,
  totalItems,
  letter,
  subIndex,
  totalInLetter,
  scrollProgress,
  viewMode = 'owm',
  viewportWidth = 1200,
  viewportHeight = 800,
  isMobile = false
}) {
  const stageWidth = Math.min(viewportWidth * 0.9, 1300);
  const letterCenterX = stageWidth * (LETTER_OFFSETS[letter] / 2);

  const letterCoords = getLetterShapeCoordinates(letter, subIndex, totalInLetter);

  const initialZ = -600 + index * 40;
  const initialSpreadX = (index - (totalItems - 1) / 2) * (isMobile ? 120 : 220);
  const initialSpreadY = Math.sin(index * 1.5) * 180;

  const owmAssembleProgress = gsap.utils.clamp(0, 1, scrollProgress / 0.45);
  const easeAssemble = Math.pow(owmAssembleProgress, 0.8);

  const owmX = letterCenterX + letterCoords.x * (isMobile ? 0.65 : 1);
  const owmY = letterCoords.y * (isMobile ? 0.65 : 1);
  const owmZ = 20 + Math.sin(index + scrollProgress * 5) * 15;

  const posX_OWM = gsap.utils.interpolate(initialSpreadX, owmX, easeAssemble);
  const posY_OWM = gsap.utils.interpolate(initialSpreadY, owmY, easeAssemble);
  const posZ_OWM = gsap.utils.interpolate(initialZ, owmZ, easeAssemble);

  const rotZ_OWM = gsap.utils.interpolate(letterCoords.tiltZ * 2, letterCoords.tiltZ, easeAssemble);
  const rotY_OWM = Math.cos(scrollProgress * Math.PI + index) * 10;
  const rotX_OWM = Math.sin(scrollProgress * Math.PI + index) * 8;

  const omCoords = getOmSymbolCoordinates(index, totalItems);
  const omX = omCoords.x * (isMobile ? 0.7 : 1.3);
  const omY = omCoords.y * (isMobile ? 0.7 : 1.3);

  const cols = isMobile ? 2 : 3;
  const col = index % cols;
  const row = Math.floor(index / cols);
  const gridSpacingX = isMobile ? viewportWidth * 0.44 : 340;
  const gridSpacingY = isMobile ? 220 : 260;

  const totalCols = Math.min(totalItems, cols);
  const gridX = (col - (totalCols - 1) / 2) * gridSpacingX;
  const gridY = (row - (Math.ceil(totalItems / cols) - 1) / 2) * gridSpacingY + 30;

  let finalX = posX_OWM;
  let finalY = posY_OWM;
  let finalZ = posZ_OWM;
  let finalRotX = rotX_OWM;
  let finalRotY = rotY_OWM;
  let finalRotZ = rotZ_OWM;
  let finalScale = letterCoords.scale * (isMobile ? 0.75 : 1);
  let finalOpacity = gsap.utils.clamp(0.4, 1, owmAssembleProgress + 0.2);

  if (viewMode === 'om_symbol') {
    finalX = omX;
    finalY = omY;
    finalZ = 30 + Math.sin(index) * 20;
    finalRotX = 0;
    finalRotY = 0;
    finalRotZ = omCoords.tiltZ;
    finalScale = omCoords.scale * (isMobile ? 0.7 : 1.05);
    finalOpacity = 1;
  } else if (viewMode === 'grid' || scrollProgress > 0.88) {
    const gridSettle = viewMode === 'grid' ? 1 : gsap.utils.clamp(0, 1, (scrollProgress - 0.88) / 0.12);
    const easeGrid = Math.pow(gridSettle, 2);

    finalX = gsap.utils.interpolate(posX_OWM, gridX, easeGrid);
    finalY = gsap.utils.interpolate(posY_OWM, gridY, easeGrid);
    finalZ = gsap.utils.interpolate(posZ_OWM, 40, easeGrid);
    finalRotX = gsap.utils.interpolate(rotX_OWM, 0, easeGrid);
    finalRotY = gsap.utils.interpolate(rotY_OWM, 0, easeGrid);
    finalRotZ = gsap.utils.interpolate(rotZ_OWM, index % 2 === 0 ? -1.5 : 1.5, easeGrid);
    finalScale = gsap.utils.interpolate(finalScale, isMobile ? 0.72 : 0.9, easeGrid);
    finalOpacity = 1;
  }

  return {
    x: parseFloat(finalX.toFixed(2)),
    y: parseFloat(finalY.toFixed(2)),
    z: parseFloat(finalZ.toFixed(2)),
    rotateX: parseFloat(finalRotX.toFixed(2)),
    rotateY: parseFloat(finalRotY.toFixed(2)),
    rotateZ: parseFloat(finalRotZ.toFixed(2)),
    scale: parseFloat(finalScale.toFixed(3)),
    opacity: parseFloat(finalOpacity.toFixed(2)),
    zIndex: Math.round(1000 + finalZ + (10 - index) * 15)
  };
}
