// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(callback, element) {
      window.setTimeout(callback, 1000 / 60);
    };
})();

const w = 64;
const h = 64;
const pixelSize = 9;

let counter = 0;

function get2DContext(canvasId) {
  const canvas = document.getElementById(canvasId);
  canvas.width = w;
  canvas.height = h;
  canvas.style = "image-rendering: -moz-crisp-edges; image-rendering: -o-crisp-edges; image-rendering: -webkit-optimize-contrast; image-rendering: crisp-edges;";
  canvas.style.width = `${w*pixelSize}px`;
  canvas.style.height = `${h*pixelSize}px`;
  context = canvas.getContext( '2d' );
  context.imageSmoothingEnabled = false;
  return context;
}

function getTimeMs() {
  return window.performance.now();
}

function drawFrame(context, plasmaMap, colorMap) {
  const time = new Date().getTime() * 0.003;

  const w = context.canvas.width;
  const h = context.canvas.height;
  const imageData = context.getImageData(0, 0, w, h);
  const px = imageData.data;

  const start = getTimeMs();
  const kx = w/h;
  for(let y = 0; y < h; y++) {
    const yy = y/h - 0.5;
    for(let x=0; x < w; x++) {
      const xx = kx*x/w - kx/2;
      const v = plasmaMap(xx, yy, time);
      colorMap(px, (y*w + x)*4, v);
    }
  }
  const end = getTimeMs();
  if (counter < 100) {
    console.log(end - start);
  }
  context.putImageData(imageData, 0, 0);
  counter += 1;
}

function drawStill(canvasId, plasmaMap, colorMap) {
  const context = get2DContext(canvasId);
  drawFrame(context, plasmaMap, colorMap);
}

function drawAnimated(canvasId, plasmaMap, colorMap) {
  const context = get2DContext(canvasId);
  console.log(`${context.canvas.width}x${context.canvas.height}`);

  function animate() {
    drawFrame(context, plasmaMap, colorMap);
    requestAnimFrame( animate );
  }
  requestAnimFrame( animate );
}

function plasmaFinal(x, y, time) {
  let v = 0;
  v += Math.sin((x*10 + time));
  v += Math.sin((y*10 + time)/2.0);
  v += Math.sin((x*10 + y*10 + time)/2.0);
  const cx = x + 0.5 * Math.sin(time/5.0);
  const cy = y + 0.5 * Math.cos(time/3.0);
  v += Math.sin(Math.sqrt(100*(cx*cx + cy*cy) + 1) + time);
  v = v/2.0;
  return v;
}

function colorMap1(px, offset, v) {
  px[offset] = 255*(0.5 + 0.5*Math.sin(Math.PI*v));
  px[offset + 1] = 255*(0.5 + 0.5*Math.cos(Math.PI*v));
  px[offset + 2] = 0;
  px[offset + 3] = 255;
}

function colorMap2(px, offset, v) {
  px[offset] = 255;
  px[offset + 1] = 255*(0.5 + 0.5*Math.cos(Math.PI*v));
  px[offset + 2] = 255*(0.5 + 0.5*Math.sin(Math.PI*v));
  px[offset + 3] = 255;
}

function colorMap3(px, offset, v) {
  px[offset] = 255*(0.5 + 0.5*Math.sin(Math.PI*v));
  px[offset + 1] = 255*(0.5 + 0.5*Math.sin(Math.PI*v + 2*Math.PI/3));
  px[offset + 2] = 255*(0.5 + 0.5*Math.sin(Math.PI*v + 4*Math.PI/3));
  px[offset + 3] = 255;
}

function colorMap4(px, offset, v) {
  const c = 0.5 + 0.5*Math.sin(Math.PI*v*5);
  px[offset] = 255*c;
  px[offset + 1] = 255*c;
  px[offset + 2] = 255*c;
  px[offset + 3] = 255;
}

function colorMapGrey(px, offset, v) {
  const c = 255*(0.5 + 0.5*v*0.8);
  px[offset] = c;
  px[offset + 1] = c;
  px[offset + 2] = c;
  px[offset + 3] = 255;
}

function colorMapBlue(px, offset, v) {
  const c = 100*(0.5 + 0.5*v*0.8) + 155;
  if (Math.random() > 1.99) {
    c = 0;
  }
  px[offset] = c*0.1;
  px[offset + 1] = c*0.1;
  px[offset + 2] = c;
  px[offset + 3] = 255;
}

drawAnimated("screen", plasmaFinal, colorMap3);
