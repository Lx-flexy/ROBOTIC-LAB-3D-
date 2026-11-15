/**
 * utils/performance.js — Adaptive quality: detect low-end devices, cap pixel ratio, etc.
 */
export function detectQuality() {
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent) || 'ontouchstart' in window;
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
  let gpuTier = 'high';

  if (gl) {
    const dbg = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = dbg ? gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) : '';
    if (/Mali|Adreno\s[3-5]|PowerVR|Intel HD|SwiftShader/i.test(renderer)) {
      gpuTier = 'low';
    } else if (/Adreno\s6|Apple GPU|Intel Iris/i.test(renderer)) {
      gpuTier = 'mid';
    }
  }

  const isLowEnd = isMobile && (gpuTier === 'low' || navigator.hardwareConcurrency <= 4);

  return {
    dpr: isLowEnd ? Math.min(dpr, 1) : dpr,
    shadows: !isLowEnd,
    maxLights: isLowEnd ? 3 : 6,
    textureSize: isLowEnd ? 512 : 1024,
    antialias: !isLowEnd,
    isMobile,
    isLowEnd,
    gpuTier,
  };
}

/** Show WebGL failure message */
export function showWebGLFallback() {
  document.body.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:center;height:100vh;
      background:#14284b;color:#fff;font-family:system-ui;text-align:center;padding:20px;">
      <div>
        <h1 style="color:#ff7a00;font-size:2rem;margin-bottom:16px;">WebGL Not Available</h1>
        <p style="max-width:480px;line-height:1.6;">
          Your browser or device doesn't support WebGL, which is needed for the 3D virtual tour.<br>
          Please try Chrome, Firefox, or Edge on a desktop or modern phone.
        </p>
      </div>
    </div>`;
}
