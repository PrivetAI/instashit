function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay(min, max) {
  const delay = Math.floor(Math.random() * (max - min + 1)) + min;
  return sleep(delay);
}

async function humanLikeMouseMove(page, targetElement) {
  const box = await targetElement.boundingBox();
  if (!box) return;
  
  // Get current mouse position
  const mouse = page.mouse;
  
  // Generate random points for bezier curve
  const steps = Math.floor(Math.random() * 10) + 5;
  const startX = Math.random() * 800;
  const startY = Math.random() * 600;
  
  // Move to start position
  await mouse.move(startX, startY);
  
  // Calculate control points for curved movement
  const cp1x = startX + (box.x - startX) * 0.3 + (Math.random() - 0.5) * 100;
  const cp1y = startY + (box.y - startY) * 0.3 + (Math.random() - 0.5) * 100;
  const cp2x = startX + (box.x - startX) * 0.7 + (Math.random() - 0.5) * 100;
  const cp2y = startY + (box.y - startY) * 0.7 + (Math.random() - 0.5) * 100;
  
  // Move along bezier curve
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = bezierPoint(startX, cp1x, cp2x, box.x + box.width / 2, t);
    const y = bezierPoint(startY, cp1y, cp2y, box.y + box.height / 2, t);
    
    await mouse.move(x, y);
    await sleep(Math.random() * 50 + 10);
  }
  
  // Small random movements at destination
  for (let i = 0; i < 3; i++) {
    const offsetX = (Math.random() - 0.5) * 10;
    const offsetY = (Math.random() - 0.5) * 10;
    await mouse.move(
      box.x + box.width / 2 + offsetX,
      box.y + box.height / 2 + offsetY
    );
    await sleep(Math.random() * 100 + 50);
  }
}

function bezierPoint(p0, p1, p2, p3, t) {
  const u = 1 - t;
  const tt = t * t;
  const uu = u * u;
  const uuu = uu * u;
  const ttt = tt * t;
  
  return uuu * p0 + 3 * uu * t * p1 + 3 * u * tt * p2 + ttt * p3;
}

async function humanLikeScroll(page, distance = 500) {
  const scrollSteps = Math.floor(Math.random() * 5) + 3;
  const stepDistance = distance / scrollSteps;
  
  for (let i = 0; i < scrollSteps; i++) {
    const actualDistance = stepDistance + (Math.random() - 0.5) * 50;
    
    await page.evaluate((dist) => {
      window.scrollBy({
        top: dist,
        behavior: 'smooth'
      });
    }, actualDistance);
    
    await randomDelay(100, 300);
  }
  
  // Random pause after scrolling
  await randomDelay(500, 1000);
}

module.exports = {
  sleep,
  randomDelay,
  humanLikeMouseMove,
  humanLikeScroll
};