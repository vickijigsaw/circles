/**
 * Downloads a pattern as an SVG file (client-side safe).
 */
export function downloadSVG({
    patternData,
    filename,
}: {
    patternData: any;
    filename?: string;
}) {
    if (!patternData) {
        console.error("No pattern data provided!");
        return;
    }

    const { canvasWidth, canvasHeight, placedCircles, name } = patternData;

    if (!placedCircles || placedCircles.length === 0) {
        alert("No placed circles to export!");
        return;
    }

    // Build SVG content
    const svgHeader = `<svg xmlns="http://www.w3.org/2000/svg" width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">`;
    const background = `<rect width="${canvasWidth}" height="${canvasHeight}" fill="#ffffff"/>`;

    const circles = placedCircles
        .map(
            (circle: any) => `
        <circle
          cx="${circle.x}"
          cy="${circle.y}"
          r="${circle.diameter / 2}"
          fill="${circle.color || "#000"}"
          fill-opacity="0.8"
          stroke="#333"
          stroke-width="0.5"
        />
      `
        )
        .join("");

    const svgContent = `${svgHeader}${background}${circles}</svg>`;

    // Trigger browser download
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = filename || `${name || "pattern"}.svg`;
    link.click();
    URL.revokeObjectURL(url);
}
