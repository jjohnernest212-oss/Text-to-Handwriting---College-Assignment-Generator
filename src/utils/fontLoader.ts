/**
 * Dynamic Font Loader for custom uploaded handwriting font files (.ttf, .otf, .woff, .woff2)
 * Injects @font-face rules into document.head and document.fonts for full CSS & html2canvas support.
 */

export async function loadCustomFontFile(file: File): Promise<{ fontId: string; fontFamily: string; fontName: string }> {
  const rawName = file.name.replace(/\.[^/.]+$/, '').trim() || 'Custom Handwriting';
  const cleanId = `custom-font-${Date.now()}`;
  const fontNameSafe = `CustomFont_${Date.now()}`;

  try {
    const arrayBuffer = await file.arrayBuffer();
    
    // Determine mime format
    const ext = file.name.split('.').pop()?.toLowerCase();
    let format = 'truetype';
    let mime = 'font/ttf';
    if (ext === 'woff2') {
      format = 'woff2';
      mime = 'font/woff2';
    } else if (ext === 'woff') {
      format = 'woff';
      mime = 'font/woff';
    } else if (ext === 'otf') {
      format = 'opentype';
      mime = 'font/otf';
    }

    // Convert arrayBuffer to base64
    let binary = '';
    const bytes = new Uint8Array(arrayBuffer);
    const len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    const base64 = btoa(binary);
    const dataUri = `data:${mime};base64,${base64}`;

    // Inject @font-face into document.head so html2canvas and standard styles find it reliably
    const styleEl = document.createElement('style');
    styleEl.id = `style-${cleanId}`;
    styleEl.textContent = `
      @font-face {
        font-family: '${fontNameSafe}';
        src: url('${dataUri}') format('${format}');
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }
    `;
    document.head.appendChild(styleEl);

    // Also register via FontFace API for instant document availability
    if (typeof FontFace !== 'undefined') {
      try {
        const fontFace = new FontFace(fontNameSafe, arrayBuffer);
        const loadedFace = await fontFace.load();
        document.fonts.add(loadedFace);
        await document.fonts.ready;
      } catch (fontFaceErr) {
        console.warn('FontFace API failed, fallback to injected @font-face style rule:', fontFaceErr);
      }
    }

    return {
      fontId: cleanId,
      fontFamily: `"${fontNameSafe}", cursive`,
      fontName: `Custom: ${rawName}`,
    };
  } catch (err) {
    console.error('Failed to parse and load custom font file:', err);
    throw new Error(`Could not load font file "${file.name}". Please ensure it is a valid .ttf, .otf, or .woff file.`);
  }
}
