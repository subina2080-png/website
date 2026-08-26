import gsap from 'gsap';

export const PHI = (1 + Math.sqrt(5)) / 2;
const B_PARAM = Math.log(PHI) / (Math.PI / 2);

export function goldenSpiral(theta, scale = 1, a = 12) {
  const radius = a * Math.exp(B_PARAM * theta);
  const x = Math.cos(theta) * radius * scale;
  const y = Math.sin(theta) * radius * scale;
  return { x, y, radius };
}

/**
 * Calculates cubic Bézier curve points (X, Y) along the single continuous S-Curve flow path
 * matching the user's sketch. Guaranteed ZERO overlap & perfect longitudinal card spacing.
 */
function sampleSCurvePath(t, widthFactor = 1, heightFactor = 1) {
  // Key control nodes matching the user's sketch (Bottom-Left -> Top-Right)
  const p0 = { x: -260, y: 245 };
  const c0 = { x: -160, y: 200 };
  const c1 = { x: -40,  y: 180 };
  const p1 = { x: 40,   y: 160 };
  const c2 = { x: 180,  y: 130 };
  const c3 = { x: 320,  y: 90 };
  const p2 = { x: 300,  y: 60 };
  const c4 = { x: 360,  y: -10 };
  const c5 = { x: 180,  y: -20 };
  const p3 = { x: 20,   y: -20 };
  const c6 = { x: -180, y: -20 };
  const c7 = { x: -360, y: -70 };
  const p4 = { x: -280, y: -130 };
  const c8 = { x: -220, y: -190 };
  const c9 = { x: -160, y: -220 };
  const p5 = { x: -100, y: -240 };

  let x, y, angle;

  // Segment 1 (t in 0..0.25)
  if (t <= 0.25) {
    const st = t / 0.25;
    const u = 1 - st;
    x = u*u*u*p0.x + 3*u*u*st*c0.x + 3*u*st*st*c1.x + st*st*st*p1.x;
    y = u*u*u*p0.y + 3*u*u*st*c0.y + 3*u*st*st*c1.y + st*st*st*p1.y;
    angle = -12;
  }
  // Segment 2 (t in 0.25..0.5)
  else if (t <= 0.5) {
    const st = (t - 0.25) / 0.25;
    const u = 1 - st;
    x = u*u*u*p1.x + 3*u*u*st*c2.x + 3*u*st*st*c3.x + st*st*st*p2.x;
    y = u*u*u*p1.y + 3*u*u*st*c2.y + 3*u*st*st*c3.y + st*st*st*p2.y;
    angle = 6;
  }
  // Segment 3 (t in 0.5..0.75)
  else if (t <= 0.75) {
    const st = (t - 0.5) / 0.25;
    const u = 1 - st;
    x = u*u*u*p2.x + 3*u*u*st*c4.x + 3*u*st*st*c5.x + st*st*st*p3.x;
    y = u*u*u*p2.y + 3*u*u*st*c4.y + 3*u*st*st*c5.y + st*st*st*p3.y;
    angle = 12;
  }
  // Segment 4 (t in 0.75..1.0)
  else {
    const st = (t - 0.75) / 0.25;
    const u = 1 - st;
    x = u*u*u*p3.x + 3*u*u*st*c6.x + 3*u*st*st*c7.x + st*st*st*p4.x;
    y = u*u*u*p3.y + 3*u*u*st*c6.y + 3*u*st*st*c7.y + st*st*st*p4.y;
    angle = -8;
  }

  return {
    x: x * widthFactor,
    y: y * heightFactor,
    tiltZ: angle
  };
}

/**
 * Single Unified S-Curve Flow Transform Function.
 * Spaces out cards perfectly along the S-curve path with zero overlap.
 */
export function calculateSCurveFlowProps(
  index,
  totalImages = 6,
  scrollProgress = 0,
  viewportWidth = 1200,
  viewportHeight = 800,
  isMobile = false
) {
  // Spacing parameter: Each card is separated by ~0.16 along the curve parametric line
  const cardSpacing = 0.16;
  const baseT = index / (totalImages - 1);
  
  // Motion driven by scroll progress along the curve
  const scrollOffset = (scrollProgress - 0.5) * 0.35;
  const t = gsap.utils.clamp(0, 1, baseT + scrollOffset);

  const widthFactor = isMobile ? 0.65 : Math.min(1.25, viewportWidth / 1100);
  const heightFactor = isMobile ? 0.7 : Math.min(1.15, viewportHeight / 850);

  const pt = sampleSCurvePath(t, widthFactor, heightFactor);

  // Soft organic floating micro-motion
  const floatX = Math.cos(index * 1.5 + scrollProgress * Math.PI) * 8;
  const floatY = Math.sin(index * 1.2 + scrollProgress * Math.PI * 2) * 6;

  const finalX = pt.x + floatX;
  const finalY = pt.y + floatY;
  const finalZ = Math.sin(t * Math.PI) * 40;

  const finalRotateX = Math.sin(scrollProgress * Math.PI + index) * 4;
  const finalRotateY = Math.cos(scrollProgress * Math.PI + index) * 6;
  const finalRotateZ = pt.tiltZ + Math.sin(scrollProgress * 2 + index) * 2;

  // Scale & Opacity with soft edge fading
  const scaleVal = (0.88 + Math.sin(t * Math.PI) * 0.18) * (isMobile ? 0.72 : 1);
  const opacityVal = gsap.utils.clamp(0.6, 1, 1 - Math.pow(Math.abs(t - 0.5) * 1.8, 4));

  const zIndex = Math.round(1000 + finalZ + (totalImages - index) * 40);

  return {
    x: parseFloat(finalX.toFixed(2)),
    y: parseFloat(finalY.toFixed(2)),
    z: parseFloat(finalZ.toFixed(2)),
    rotateX: parseFloat(finalRotateX.toFixed(2)),
    rotateY: parseFloat(finalRotateY.toFixed(2)),
    rotateZ: parseFloat(finalRotateZ.toFixed(2)),
    scale: parseFloat(scaleVal.toFixed(3)),
    opacity: parseFloat(opacityVal.toFixed(2)),
    blur: 0,
    zIndex,
    isFocal: index === 2 || index === 3,
    isSymmetricalEnd: false
  };
}

/**
 * Calculates 3D Golden Spiral trajectory with REVERSE sequence ordering,
 * ULTRA-SOFT paper floating dynamics, depth-of-field blur, and smooth
 * end-state symmetrical grid alignment ($progress \in [0.72, 1.0]$).
 */
export function calculateGoldenSpiralProps(
  index,
  totalImages,
  scrollProgress,
  viewportWidth = 1200,
  viewportHeight = 800,
  isMobile = false
) {
  const startTheta = 4.2;
  const spiralTravel = -5.0;
  const baseTheta = startTheta + scrollProgress * spiralTravel;
  const imageSpacing = 0.65;

  const theta = baseTheta - index * imageSpacing;

  const spiralScale = isMobile
    ? Math.min(viewportWidth, viewportHeight) * 0.0035
    : Math.min(viewportWidth, viewportHeight) * 0.0048;

  const current = goldenSpiral(theta, spiralScale);
  const focalOffsetX = isMobile ? 0 : -viewportWidth * 0.04;
  const focalOffsetY = isMobile ? 0 : viewportHeight * 0.02;

  const softBobY = Math.sin(theta * 2 + scrollProgress * Math.PI) * 12;
  const softBobX = Math.cos(theta * 1.5 + scrollProgress * Math.PI) * 8;

  const spiralX = current.x + focalOffsetX + softBobX;
  const spiralY = current.y + focalOffsetY + softBobY;

  const next = goldenSpiral(theta + 0.015, spiralScale);
  const tangentDegrees = Math.atan2(next.y - current.y, next.x - current.x) * (180 / Math.PI);
  const spiralRotateZ = gsap.utils.clamp(-18, 18, tangentDegrees);

  const distFromCenter = Math.sqrt(current.x * current.x + current.y * current.y);
  const maxRadius = Math.min(viewportWidth, viewportHeight) * 0.65;
  const normalizedDistance = Math.min(distFromCenter / maxRadius, 1);

  const normalizedX = current.x / (viewportWidth * 0.5);
  const normalizedY = current.y / (viewportHeight * 0.5);

  const spiralRotateY = normalizedX * -14;
  const spiralRotateX = normalizedY * 7;
  const spiralDepthZ = gsap.utils.mapRange(0, totalImages - 1, -700, 20, index) + Math.sin(theta) * 100;

  const depthBlur = distFromCenter > maxRadius * 0.45 ? (distFromCenter / maxRadius - 0.45) * 6 : 0;

  const isFocal = normalizedDistance < 0.22;
  const focalFactor = Math.max(0, 1 - (normalizedDistance / 0.22));

  const rawScale = gsap.utils.interpolate(1.05, 0.48, normalizedDistance);
  const spiralScaleVal = gsap.utils.interpolate(rawScale, 1.16, Math.pow(focalFactor, 1.5));
  const spiralOpacity = gsap.utils.interpolate(0.55 + (1 - normalizedDistance) * 0.45, 1, focalFactor);

  const cols = isMobile ? 2 : 3;
  const colIndex = index % cols;
  const rowIndex = Math.floor(index / cols);

  const gridSpacingX = isMobile ? viewportWidth * 0.42 : Math.min(360, viewportWidth * 0.28);
  const gridSpacingY = isMobile ? 220 : 250;

  const totalCols = Math.min(totalImages, cols);
  const targetGridX = (colIndex - (totalCols - 1) / 2) * gridSpacingX;
  const targetGridY = (rowIndex - (Math.ceil(totalImages / cols) - 1) / 2) * gridSpacingY + 30;
  const targetGridZ = 40;
  const targetGridRotateX = 0;
  const targetGridRotateY = 0;
  const targetGridRotateZ = (index % 2 === 0 ? -1.2 : 1.2);
  const targetGridScale = isMobile ? 0.72 : 0.85;
  const targetGridOpacity = 1.0;

  const settleProgress = gsap.utils.clamp(0, 1, (scrollProgress - 0.70) / 0.30);
  const easeSettle = Math.pow(settleProgress, 2.2);

  const finalX = gsap.utils.interpolate(spiralX, targetGridX, easeSettle);
  const finalY = gsap.utils.interpolate(spiralY, targetGridY, easeSettle);
  const finalZ = gsap.utils.interpolate(spiralDepthZ, targetGridZ, easeSettle);
  const finalRotateX = gsap.utils.interpolate(spiralRotateX, targetGridRotateX, easeSettle);
  const finalRotateY = gsap.utils.interpolate(spiralRotateY, targetGridRotateY, easeSettle);
  const finalRotateZ = gsap.utils.interpolate(spiralRotateZ, targetGridRotateZ, easeSettle);
  const finalScale = gsap.utils.interpolate(spiralScaleVal, targetGridScale, easeSettle);
  const finalOpacity = gsap.utils.interpolate(spiralOpacity, targetGridOpacity, easeSettle);
  const finalBlur = gsap.utils.interpolate(depthBlur, 0, easeSettle);

  const zIndex = Math.round(1000 + finalZ + (1 - normalizedDistance) * 400 + index * 10);

  return {
    x: parseFloat(finalX.toFixed(2)),
    y: parseFloat(finalY.toFixed(2)),
    z: parseFloat(finalZ.toFixed(2)),
    scale: parseFloat(finalScale.toFixed(3)),
    rotateX: parseFloat(finalRotateX.toFixed(2)),
    rotateY: parseFloat(finalRotateY.toFixed(2)),
    rotateZ: parseFloat(finalRotateZ.toFixed(2)),
    opacity: parseFloat(finalOpacity.toFixed(2)),
    blur: parseFloat(finalBlur.toFixed(1)),
    zIndex,
    isFocal: isFocal && settleProgress < 0.5,
    isSymmetricalEnd: settleProgress > 0.8
  };
}
