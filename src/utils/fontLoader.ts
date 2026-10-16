/**
 * Dynamic Font Loader for custom uploaded handwriting font files (.ttf, .otf, .woff, .woff2)
 */

export async function loadCustomFontFile(file: File): Promise<{ fontId: string; fontFamily: string; fontName: string }> {
  const fontName = file.name.replace(/\.[^/.]+$/, '');
  const cleanId = `custom-font-${Date.now()}`;
  const fontFamily = `CustomFont_${Date.now()}`;

  const arrayBuffer = await file.arrayBuffer();
  const fontFace = new FontFace(fontFamily, arrayBuffer);

  await fontFace.load();
  document.fonts.add(fontFace);

  return {
    fontId: cleanId,
    fontFamily: `"${fontFamily}", cursive`,
    fontName: `Custom: ${fontName}`,
  };
}
