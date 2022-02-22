"use strict";
class Rectangle {
    constructor(pos, size, canvas, ctx, color) {
        this.position = pos;
        this.size = size;
        this.canvas = canvas;
        this.ctx = ctx;
        this.color = color;
        this.vb = new VertexBuffer();
    }
    draw() {
    }
}
