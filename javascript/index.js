// requestAnim shim layer by Paul Irish
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame   ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        window.oRequestAnimationFrame      ||
        window.msRequestAnimationFrame     ||
        function(callback, element) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function drawFrame(context, plasmaMap, colorMap) {
    var time = new Date().getTime() * 0.003;

    var w = context.canvas.width;
    var h = context.canvas.height;
    context.imageSmoothingEnabled = false;
    context.mozImageSmoothingEnabled = false
    var imageData = context.getImageData(0, 0, w, h);
    var px = imageData.data;

    var kx = w/h;
    for(var y = 0; y < h; y++) {
        var yy = y/h - .5;
        for(var x=0; x < w; x++) {
            var xx = kx*x/w - kx/2;
            var v = plasmaMap(xx, yy, time);
            colorMap(px, (y*w + x)*4, v);
        }
    }
    context.putImageData(imageData, 0, 0);
}

function drawStill(canvasId, plasmaMap, colorMap) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext( '2d' );
    drawFrame(context, plasmaMap, colorMap);
}

function drawAnimated(canvasId, plasmaMap, colorMap) {
    var canvas = document.getElementById(canvasId);
    var context = canvas.getContext( '2d' );

    function animate() {
        drawFrame(context, plasmaMap, colorMap);
        requestAnimFrame( animate );
    }
    requestAnimFrame( animate );
}

function plasmaFinal(x, y, time) {
    var v = 0;
    v += Math.sin((x*10+time));
    v += Math.sin((y*10+time)/2.0);
    v += Math.sin((x*10+y*10+time)/2.0);
    var cx = x + .5 * Math.sin(time/5.0);
    var cy = y + .5 * Math.cos(time/3.0);
    v += Math.sin(Math.sqrt(100*(cx*cx+cy*cy)+1)+time);
    v = v/2.0;
    return v;
}

function colorMap1(px, offset, v) {
    px[offset  ] = 255*(.5+.5*Math.sin(Math.PI*v));
    px[offset+1] = 255*(.5+.5*Math.cos(Math.PI*v));
    px[offset+2] = 0;
    px[offset+3] = 255;
}

function colorMap2(px, offset, v) {
    px[offset  ] = 255;
    px[offset+1] = 255*(.5+.5*Math.cos(Math.PI*v));
    px[offset+2] = 255*(.5+.5*Math.sin(Math.PI*v));
    px[offset+3] = 255;
}

function colorMap3(px, offset, v) {
    px[offset  ] = 255*(.5+.5*Math.sin(Math.PI*v));
    px[offset+1] = 255*(.5+.5*Math.sin(Math.PI*v+2*Math.PI/3));
    px[offset+2] = 255*(.5+.5*Math.sin(Math.PI*v+4*Math.PI/3));
    px[offset+3] = 255;
}

function colorMap4(px, offset, v) {
    var c = .5+.5*Math.sin(Math.PI*v*5);
    px[offset  ] = 255*c;
    px[offset+1] = 255*c;
    px[offset+2] = 255*c;
    px[offset+3] = 255;
}

function colorMapGrey(px, offset, v) {
    var c = 255*(.5+.5*v*.8);
    px[offset  ] = c;
    px[offset+1] = c;
    px[offset+2] = c;
    px[offset+3] = 255;
}

function colorMapBlue(px, offset, v) {
    var c = 100*(.5+.5*v*.8)+155;
    if (Math.random() > 1.99) {
        c = 0;
    }
    px[offset  ] = c*0.1;
    px[offset+1] = c*0.1;
    px[offset+2] = c;
    px[offset+3] = 255;
}

drawAnimated("screen", plasmaFinal, colorMap3);