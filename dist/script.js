"use strict";
// basically importing but in pre es2016 ig
// const { mat2, mat3, mat4, vec2, vec3, vec4 } = glMatrix;
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class Cell {
    constructor(canvas, pos, dimensions, shader) {
        this.enabled = false;
        this.canvas = canvas;
        this.pos = pos;
        this.dimen = dimensions;
        this.tile = new Rectangle(pos, dimensions, canvas.c, canvas.gl, Colors.white, shader);
    }
    draw() {
        if (this.enabled) {
            this.tile.color = Colors.white;
        }
        else {
            this.tile.color = Colors.black;
        }
        this.tile.draw();
    }
}
class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.counter = 0;
    }
    main() {
        // const canvas = document.querySelector("#glcanvas");
        // If we don't have a GL context, give up now
        if (!canvas.gl) {
            alert("Unable to initialize WebGL. Your browser or machine may not support it.");
            return;
        }
        // Makes an instance of the Shader class to hold our shader
        this.shader = new Shader(canvas);
        this.shader.initShaderProgram(shaders.vert, shaders.frag);
        this.shader.addAttribLoc("vertexPosition", "aVertexPosition");
        this.shader.addUniformLoc("projectionMatrix", "uProjectionMatrix");
        this.shader.addUniformLoc("viewMatrix", "uViewMatrix");
        this.shader.addUniformLoc("modelMatrix", "uModelMatrix");
        this.shader.addUniformLoc("color", "uColor");
        console.log(this.shader.programInfo);
        this.grid = [];
        this.gridDimen = {
            x: 32,
            y: 18
        };
        let frac = {
            x: canvas.c.width / this.gridDimen.x,
            y: canvas.c.height / this.gridDimen.y
        };
        // for (let index = 0; index < this.gridDimen.x * this.gridDimen.y; index++) {
        // 	this.grid.push(new Cell(
        // 		this.canvas,
        // 		{x: (index % this.gridDimen.x) * frac.x, y: Math.floor(index/this.gridDimen.x) * frac.y}, 
        // 		{x: frac.x - 4, y: frac.y - 4}, this.shader));
        // 	// console.table({x: (index % gridDimen.x) * frac.x, y: Math.floor(index/gridDimen.y) * frac.y});	
        // }
        this.shapeTest = new Triangle({ x: 20, y: 20 }, { x: 20, y: 20 }, canvas.c, canvas.gl, Colors.white, this.shader);
        // console.log(shader);
        // Draw the scene
        this.drawScene();
    }
    drawScene() {
        const { gl } = this.canvas;
        const programInfo = this.shader.programInfo;
        const buffers = this.buffers;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0.13, 0.0, 0.24, 1.0); // Clear to black, fully opaque
        gl.clearDepth(1.0); // Clear everything
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        const projectionMatrix = mat4.create();
        // note: glmatrix.js always has the first argument
        // as the destination to receive the result.
        mat4.ortho(projectionMatrix, 0, canvas.c.width, canvas.c.height, 0, 0.0, 2);
        // Set the drawing position to the "identity" point, which is
        // the center of the scene.
        this.modelMatrix = mat4.create();
        this.viewMatrix = mat4.create();
        // Now move the drawing position a bit to where we want to
        // start drawing the square.
        mat4.translate(this.modelMatrix, // destination matrix
        this.modelMatrix, // matrix to translate
        [pos.x, pos.y, 0.0]); // amount to translate
        // Tell WebGL to use our program when drawing
        gl.useProgram(programInfo.program);
        // Set the shader uniforms
        gl.uniformMatrix4fv(programInfo.uniformLocations.projectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.viewMatrix, false, this.viewMatrix);
        gl.uniformMatrix4fv(programInfo.uniformLocations.modelMatrix, false, this.modelMatrix);
        gl.uniform4f(programInfo.uniformLocations.color, 1, 0.5, 0.3, 1);
        // this.draw()
        ugh(0);
    }
    draw(delta) {
        // console.log(this);
        const { gl } = this.canvas;
        const programInfo = this.shader.programInfo;
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        // mat4.fromRotationTranslationScale(
        // 	this.modelMatrix, // destination matrix
        // 	quat.create(),
        // 	[mousePos.x - (this.rectangle.size.x / 2 * scale.x), 
        // 		mousePos.y - (this.rectangle.size.y / 2 * scale.y), 0.0],
        // 	[scale.x, scale.y, 0]
        // );
        // gl.uniformMatrix4fv(
        // 	programInfo.uniformLocations.modelMatrix,
        // 	false,
        // 	this.modelMatrix,
        // );
        // gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
        this.shapeTest.draw();
        // let index = Math.floor(mousePos.x / canvas.c.clientWidth * this.gridDimen.x) + (Math.floor(mousePos.y / canvas.c.clientHeight * this.gridDimen.y) * this.gridDimen.x)
        // console.log(index);
        // if (mouseButton[0]) {
        // 	this.grid[index].enabled = true;
        // }
        // if (mouseButton[2]) {
        // 	this.grid[index].enabled = false;
        // }
        this.grid.forEach(element => {
            element.draw();
        });
    }
}
function ugh(delta) {
    game.draw(delta);
    window.requestAnimationFrame(ugh);
}
let pos = {
    x: 0,
    y: 5
};
let scale = {
    x: 1,
    y: 1
};
// loads the shaders
// let vsResponse = await fetch("vert.shader");
// let fsResponse = await fetch("frag.shader");
const canvas = new Canvas(window.innerWidth, window.innerHeight);
document.getElementById('canvContainer').appendChild(canvas.c);
const game = new Game(canvas);
let shaders = {};
(() => __awaiter(void 0, void 0, void 0, function* () {
    let shaderResponse = yield fetch("assets/Basic.shader");
    let shaderSource = yield shaderResponse.text();
    let sources = shaderSource.split(">>");
    sources.forEach(element => {
        if (element == '') {
            return;
        }
        console.log(element);
        let trimmed = element.replace('\r\n', '\n');
        let type = trimmed.slice(0, trimmed.indexOf("<<"));
        let source = trimmed.substring(trimmed.indexOf("<<") + 2);
        shaders[type.toLowerCase()] = source;
    });
    console.log(shaders);
    game.main();
}))();
// main();
function scalerx(value) {
    scale.x = value;
}
function scalery(value) {
    scale.y = value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkNBQTJDO0FBQzNDLDJEQUEyRDs7Ozs7Ozs7OztBQUUzRCxNQUFNLElBQUk7SUFPVCxZQUFZLE1BQWEsRUFBRSxHQUFRLEVBQUUsVUFBZSxFQUFFLE1BQWM7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELElBQUk7UUFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUMvQjthQUNHO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUMvQjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbEIsQ0FBQztDQUNEO0FBRUQsTUFBTSxJQUFJO0lBV1QsWUFBWSxNQUFjO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxJQUFJO1FBQ0gsc0RBQXNEO1FBRXRELDZDQUE2QztRQUU3QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUNm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