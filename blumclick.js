(() => {
  if (window.BlumAC) return;
  window.BlumAC = true;
  
  const autoPlay = true;
  const gc = [208, 216, 0]; // Warna hijau yang ada sebelumnya
  const freezeColor = [159, 235, 243]; // Warna biru freeze
  const tolerance = 5;
  
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
    if (!context) return;
    
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
        
        const greenRange = (gc[0] - tolerance < r && r < gc[0] + tolerance) && 
                           (gc[1] - tolerance < g && g < gc[1] + tolerance) && 
                           (gc[2] - tolerance < b && b < gc[2] + tolerance);
        
        const freezeRange = (freezeColor[0] - tolerance < r && r < freezeColor[0] + tolerance) && 
                            (freezeColor[1] - tolerance < g && g < freezeColor[1] + tolerance) && 
                            (freezeColor[2] - tolerance < b && b < freezeColor[2] + tolerance);

        if (greenRange || freezeRange) {
          simulateClick(screenCanvas, x, y);
        }
      }
    }
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
