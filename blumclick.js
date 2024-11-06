(() => {
  if (window.BlumAC) return;
  window.BlumAC = true;
  const autoPlay = true;

  // Define color ranges for target colors (in RGB) and tolerance, excluding light blue
  const targetColors = [
    { color: [255, 140, 82], tolerance: 5 },  // HEX #ff8c52 (Orange)
    { color: [213, 172, 160], tolerance: 5 }, // HEX #d5aca0 (Light Brown)
    { color: [208, 216, 0], tolerance: 5 }    // Original Green color
  ];

  if (autoPlay) {
    setInterval(() => {
      const playButton = document.querySelector("button.is-primary, .play-btn");
      if (!playButton) return;
      if (!playButton.textContent.toLowerCase().includes("play")) return;
      playButton.click();
    }, 5000);
  }

  setInterval(() => {
    const canvas = document.querySelector("canvas");
    if (canvas) findAndClickObjects(canvas);
  }, 100);

  function findAndClickObjects(screenCanvas) {
    const context = screenCanvas.getContext('2d');
    const width = screenCanvas.width;
    const height = screenCanvas.height;
    const imageData = context.getImageData(0, 0, width, height);
    const pixels = imageData.data;

    for (let x = 0; x < width; x += 1) {
      for (let y = 0; y < height; y += 1) {
        if (y < 70) continue;
        const index = (y * width + x) * 4;
        const r = pixels[index];
        const g = pixels[index + 1];
        const b = pixels[index + 2];

        // Check if any target color is within range
        if (targetColors.some(({ color, tolerance }) => isColorInRange(r, g, b, color, tolerance))) {
          simulateClick(screenCanvas, x, y);
        }
      }
    }
  }

  function isColorInRange(r, g, b, targetColor, tolerance) {
    return (
      Math.abs(r - targetColor[0]) <= tolerance &&
      Math.abs(g - targetColor[1]) <= tolerance &&
      Math.abs(b - targetColor[2]) <= tolerance
    );
  }

  function simulateClick(canvas, x, y) {
    const prop = {
      clientX: x,
      clientY: y,
      bubbles: true
    };
    canvas.dispatchEvent(new MouseEvent('click', prop));
    canvas.dispatchEvent(new MouseEvent('mousedown', prop));
    canvas.dispatchEvent(new MouseEvent('mouseup', prop));
  }
})();
