define('drawing',
    ['avatars', 'canvases', 'images', 'level', 'settings'],
    function(avatars, canvases, images, level, settings) {

    'use strict';

    var tilesize = settings.tilesize;
    var tilesetTileSize = settings.tilesetTileSize;
    var terrainChunkSize = settings.terrainChunkSize;
    var tilesPerRow = settings.tilesPerRow;

    var requestAnimationFrame = window.requestAnimationFrame || function(cb) {setTimeout(cb, terrainChunkSize00 / 30);};

    var lastDraw;
    var drawing = false;
    var state;

    var terrainBuffers = [];

    /*
    State is in the following form:
    1. X coord of the left edge of where the level starts to draw
    2. Y coord of the top edge of where the level starts to draw
    3. Width of the drawing surface
    4. Height of the drawing surface
    5. The X coord in the layer canvases to clip from
    6. The Y coord in the layer canvases to clip from
    7. The width of the rectangle to clip from the layer canvases
    8. The height of the rectangle to clip from the layer canvases
    */

    function draw() {
        var output = canvases.getContext('output');
        if(state) {
            var scale;
            var i;
            var j;

            // Draw the terrain
            scale = settings.scales.terrain;
            var topmostTB = Math.floor(state[1] / tilesize / terrainChunkSize);
            var leftmostTB = Math.floor(state[0] / tilesize / terrainChunkSize);
            var bottommostTB = Math.ceil((state[1] + state[3]) / tilesize / terrainChunkSize);
            var rightmostTB = Math.ceil((state[0] + state[2]) / tilesize / terrainChunkSize);

            topmostTB = Math.max(Math.min(topmostTB, terrainBuffers.length - 1), 0);
            leftmostTB = Math.max(Math.min(leftmostTB, terrainBuffers[0].length - 1), 0);
            bottommostTB = Math.max(Math.min(bottommostTB, terrainBuffers.length - 1), 0);
            rightmostTB = Math.max(Math.min(rightmostTB, terrainBuffers[0].length - 1), 0);

            for (i = topmostTB; i <= bottommostTB; i++) {
                for (j = leftmostTB; j <= rightmostTB; j++) {
                    output.drawImage(
                        terrainBuffers[i][j],
                        0, 0, terrainBuffers[i][j].width, terrainBuffers[i][j].height,
                        j * tilesize * terrainChunkSize - state[0],
                        i * tilesize * terrainChunkSize - state[1],
                        tilesize * terrainChunkSize,
                        tilesize * terrainChunkSize
                    );
                }
            }

            // Draw the avatars
            avatars.drawAll(output, state);
        }
        if(settings.show_fps) {
            output.fillStyle = 'white';
            output.fillRect(0, 0, 20, 20);
            output.fillStyle = 'red';
            var now = Date.now();
            output.fillText(1000 / (now - lastDraw) | 0, 0, 10);
            lastDraw = now;
        }
        if(settings.show_hitmappings) {
            avatars.drawHitmappings(output, state);
        }
        if(drawing)
            requestAnimationFrame(draw);
    }

    function redrawTerrain() {
        images.waitFor(level.getTileset()).done(function(tileset) {
            var c = canvases.getContext('terrain');
            var tileSize = tileset.width / tilesPerRow;
            var bufferSize = tileSize * terrainChunkSize;

            var terrain = level.getTerrain();
            var hitmap = settings.show_hitmap ? level.getHitmap() : null;
            var terrainH = terrain.length;
            var terrainW = terrain[0].length;

            var spriteY;
            var spriteX;

            var buffer;
            var bufferCtx;
            var cell;
            for (var y = 0; y < Math.ceil(terrainH / terrainChunkSize); y++) {
                terrainBuffers[y] = [];
                for (var x = 0; x < Math.ceil(terrainW / terrainChunkSize); x++) {
                    terrainBuffers[y][x] = buffer = document.createElement('canvas');
                    buffer.height = bufferSize;
                    buffer.width = bufferSize;
                    bufferCtx = canvases.prepareContext(buffer.getContext('2d'));
                    for (var i = 0; i < terrainChunkSize; i++) {
                        if (y * terrainChunkSize + i >= terrain.length) continue;
                        for (var j = 0; j < terrainChunkSize; j++) {
                            if (x * terrainChunkSize + j >= terrain[y * terrainChunkSize + i].length) continue;
                            var cell = terrain[y * terrainChunkSize + i][x * terrainChunkSize + j];
                            bufferCtx.drawImage(
                                tileset,
                                (cell % tilesPerRow) * tileSize,
                                Math.floor(cell / tilesPerRow) * tileSize,
                                tileSize,
                                tileSize,
                                j * tileSize,
                                i * tileSize,
                                tileSize,
                                tileSize
                            );
                            if (settings.show_hitmap && hitmap[y * terrainChunkSize + i][x * terrainChunkSize + j]) {
                                bufferCtx.strokeStyle = 'red';
                                bufferCtx.moveTo(j * tileSize, i * tileSize);
                                bufferCtx.lineTo((j + 1) * tileSize, (i + 1) * tileSize);
                                bufferCtx.moveTo((j + 1) * tileSize, i * tileSize);
                                bufferCtx.lineTo(j * tileSize, (i + 1) * tileSize);
                                bufferCtx.stroke();
                            }
                        }
                    }

                }
            }
        });
    }

    function setState(x, y, w, h, x2, y2, w2, h2) {
        if (!state) state = [];
        state[0] = x;
        state[1] = y;
        state[2] = w;
        state[3] = h;
        state[4] = x2;
        state[5] = y2;
        state[6] = w2;
        state[7] = h2;
    }

    function start() {
        if (drawing) return;
        document.body.className = '';
        drawing = true;
        draw();
    }
    function stop() {
        document.body.className = 'loading';
        drawing = false;
    }

    level.on('pause', stop);
    level.on('unpause', start);
    level.on('stateUpdated', setState);
    level.on('redraw', redrawTerrain);

    return {
        start: start,
        stop: stop
    };
});
