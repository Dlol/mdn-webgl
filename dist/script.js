"use strict";
// basically importing but in pre es2016 ig
// const { mat2, mat3, mat4, vec2, vec3, vec4 } = glMatrix;
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
        for (let index = 0; index < this.gridDimen.x * this.gridDimen.y; index++) {
            this.grid.push(new Cell(this.canvas, { x: (index % this.gridDimen.x) * frac.x, y: Math.floor(index / this.gridDimen.x) * frac.y }, { x: frac.x - 4, y: frac.y - 4 }, this.shader));
            // console.table({x: (index % gridDimen.x) * frac.x, y: Math.floor(index/gridDimen.y) * frac.y});	
        }
        this.shapeTest = new TextureRect({ x: 20, y: 20 }, { x: 20, y: 20 }, canvas.c, canvas.gl, Colors.red, this.shader, true);
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
        let index = Math.floor(mousePos.x / canvas.c.clientWidth * this.gridDimen.x) + (Math.floor(mousePos.y / canvas.c.clientHeight * this.gridDimen.y) * this.gridDimen.x);
        // console.log(index);
        if (mouseButton[0]) {
            this.grid[index].enabled = true;
        }
        if (mouseButton[2]) {
            this.grid[index].enabled = false;
        }
        this.grid.forEach(element => {
            element.draw();
        });
        this.shapeTest.draw();
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
// (async () => {
// 	let shaderResponse = await fetch("assets/Basic.shader")
// 	let shaderSource = await shaderResponse.text();
// 	let sources = shaderSource.split(">>");
// 	sources.forEach(element => {
// 		if (element == '') {
// 			return;
// 		}
// 		console.log(element);
// 		let trimmed = element.replace('\r\n', '\n');
// 		let type = trimmed.slice(0, trimmed.indexOf("<<"));
// 		let source = trimmed.substring(trimmed.indexOf("<<") + 2);
// 		shaders[type.toLowerCase()] = source;
// 	})
// 	console.log(shaders);
// 	game.main()
// }) ();
Shader.Load("assets/Basic.shader").then((val) => {
    shaders = val;
    console.log(shaders);
    game.main();
}).catch(() => { alert("um oops"); });
// main();
function scalerx(value) {
    scale.x = value;
}
function scalery(value) {
    scale.y = value;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2NyaXB0LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3NjcmlwdC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsMkNBQTJDO0FBQzNDLDJEQUEyRDtBQUUzRCxNQUFNLElBQUk7SUFPVCxZQUFZLE1BQWEsRUFBRSxHQUFRLEVBQUUsVUFBZSxFQUFFLE1BQWM7UUFDbkUsSUFBSSxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7UUFDckIsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7UUFDckIsSUFBSSxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7UUFDZixJQUFJLENBQUMsS0FBSyxHQUFHLFVBQVUsQ0FBQztRQUN4QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksU0FBUyxDQUFDLEdBQUcsRUFBRSxVQUFVLEVBQUUsTUFBTSxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsRUFBRSxFQUFFLE1BQU0sQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQUM7SUFDdkYsQ0FBQztJQUVELElBQUk7UUFDSCxJQUFJLElBQUksQ0FBQyxPQUFPLEVBQUU7WUFDakIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUMvQjthQUNHO1lBQ0gsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLEdBQUcsTUFBTSxDQUFDLEtBQUssQ0FBQztTQUMvQjtRQUVELElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7SUFDbEIsQ0FBQztDQUNEO0FBRUQsTUFBTSxJQUFJO0lBV1QsWUFBWSxNQUFjO1FBQ3pCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDO1FBQ3JCLElBQUksQ0FBQyxPQUFPLEdBQUcsQ0FBQyxDQUFDO0lBQ2xCLENBQUM7SUFFRCxJQUFJO1FBQ0gsc0RBQXNEO1FBRXRELDZDQUE2QztRQUU3QyxJQUFJLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRTtZQUNmLEtBQUssQ0FDSix5RUFBeUUsQ0FDekUsQ0FBQztZQUNGLE9BQU87U0FDUDtRQUVELDJEQUEyRDtRQUMzRCxJQUFJLENBQUMsTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxNQUFNLENBQUMsaUJBQWlCLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFFMUQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxZQUFZLENBQUMsZ0JBQWdCLEVBQUUsaUJBQWlCLENBQUMsQ0FBQztRQUM5RCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxrQkFBa0IsRUFBRSxtQkFBbUIsQ0FBQyxDQUFDO1FBQ25FLElBQUksQ0FBQyxNQUFNLENBQUMsYUFBYSxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztRQUN2RCxJQUFJLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxhQUFhLEVBQUUsY0FBYyxDQUFDLENBQUM7UUFDekQsSUFBSSxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQzdDLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUMsQ0FBQztRQUVyQyxJQUFJLENBQUMsSUFBSSxHQUFHLEVBQUUsQ0FBQztRQUNmLElBQUksQ0FBQyxTQUFTLEdBQUc7WUFDaEIsQ0FBQyxFQUFFLEVBQUU7WUFDTCxDQUFDLEVBQUUsRUFBRTtTQUNMLENBQUE7UUFDRCxJQUFJLElBQUksR0FBUTtZQUNmLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDcEMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQztTQUNyQyxDQUFBO1FBQ0QsS0FBSyxJQUFJLEtBQUssR0FBRyxDQUFDLEVBQUUsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxFQUFFLEtBQUssRUFBRSxFQUFFO1lBQ3pFLElBQUksQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUN0QixJQUFJLENBQUMsTUFBTSxFQUNYLEVBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLEdBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxFQUFDLEVBQ3hGLEVBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxJQUFJLENBQUMsQ0FBQyxHQUFHLENBQUMsRUFBQyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDO1lBQy9DLGtHQUFrRztTQUNsRztRQUdELElBQUksQ0FBQyxTQUFTLEdBQUcsSUFBSSxXQUFXLENBQUMsRUFBQyxDQUFDLEVBQUMsRUFBRSxFQUFFLENBQUMsRUFBQyxFQUFFLEVBQUMsRUFBRSxFQUFDLENBQUMsRUFBQyxFQUFFLEVBQUUsQ0FBQyxFQUFDLEVBQUUsRUFBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDLEVBQUUsTUFBTSxDQUFDLEVBQUUsRUFBRSxNQUFNLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLENBQUM7UUFFakgsdUJBQXVCO1FBRXZCLGlCQUFpQjtRQUNqQixJQUFJLENBQUMsU0FBUyxFQUFFLENBQUM7SUFDbEIsQ0FBQztJQUdELFNBQVM7UUFFUixNQUFNLEVBQUUsRUFBRSxFQUFFLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQztRQUMzQixNQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQztRQUM1QyxNQUFNLE9BQU8sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDO1FBQzdCLEVBQUUsQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFBO1FBQ25CLEVBQUUsQ0FBQyxTQUFTLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxFQUFFLENBQUMsbUJBQW1CLENBQUMsQ0FBQztRQUVuRCxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsK0JBQStCO1FBQ3BFLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxtQkFBbUI7UUFFdkMsRUFBRSxDQUFDLEtBQUssQ0FBQyxFQUFFLENBQUMsZ0JBQWdCLEdBQUcsRUFBRSxDQUFDLGdCQUFnQixDQUFDLENBQUM7UUFFcEQsTUFBTSxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFdkMsa0RBQWtEO1FBQ2xELDRDQUE0QztRQUM1QyxJQUFJLENBQUMsS0FBSyxDQUFDLGdCQUFnQixFQUFFLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsR0FBRyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBRTVFLDZEQUE2RDtRQUM3RCwyQkFBMkI7UUFDM0IsSUFBSSxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFDakMsSUFBSSxDQUFDLFVBQVUsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUM7UUFFaEMsMERBQTBEO1FBQzFELDRCQUE0QjtRQUU1QixJQUFJLENBQUMsU0FBUyxDQUNiLElBQUksQ0FBQyxXQUFXLEVBQUUscUJBQXFCO1FBQ3ZDLElBQUksQ0FBQyxXQUFXLEVBQUUsc0JBQXNCO1FBQ3hDLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUNuQixDQUFDLENBQUMsc0JBQXNCO1FBR3pCLDZDQUE2QztRQUU3QyxFQUFFLENBQUMsVUFBVSxDQUFDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUVuQywwQkFBMEI7UUFFMUIsRUFBRSxDQUFDLGdCQUFnQixDQUNsQixXQUFXLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLEVBQzdDLEtBQUssRUFDTCxnQkFBZ0IsQ0FDaEIsQ0FBQztRQUNGLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDbEIsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFVBQVUsRUFDdkMsS0FBSyxFQUNMLElBQUksQ0FBQyxVQUFVLENBQ2YsQ0FBQztRQUNGLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FDbEIsV0FBVyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsRUFDeEMsS0FBSyxFQUNMLElBQUksQ0FBQyxXQUFXLENBQ2hCLENBQUE7UUFDRCxFQUFFLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxnQkFBZ0IsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxHQUFHLEVBQUUsQ0FBQyxDQUFDLENBQUM7UUFDakUsY0FBYztRQUNkLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQTtJQUNQLENBQUM7SUFFRCxJQUFJLENBQUMsS0FBYTtRQUNqQixxQkFBcUI7UUFDckIsTUFBTSxFQUFFLEVBQUUsRUFBRSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUM7UUFDM0IsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7UUFFNUMsRUFBRSxDQUFDLFVBQVUsQ0FBQyxHQUFHLEVBQUUsR0FBRyxFQUFFLEdBQUcsRUFBRSxHQUFHLENBQUMsQ0FBQztRQUNsQyxFQUFFLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxnQkFBZ0IsR0FBRyxFQUFFLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztRQUVwRCxxQ0FBcUM7UUFDckMsMkNBQTJDO1FBQzNDLGtCQUFrQjtRQUNsQix5REFBeUQ7UUFDekQsOERBQThEO1FBQzlELHlCQUF5QjtRQUN6QixLQUFLO1FBRUwsdUJBQXVCO1FBQ3ZCLDZDQUE2QztRQUM3QyxVQUFVO1FBQ1YscUJBQXFCO1FBQ3JCLEtBQUs7UUFDTCx3REFBd0Q7UUFFeEQsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFDLENBQUMsV0FBVyxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQUMsQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxDQUFBO1FBQ3JLLHNCQUFzQjtRQUV0QixJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLENBQUM7U0FDaEM7UUFDRCxJQUFJLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBRTtZQUNuQixJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLE9BQU8sR0FBRyxLQUFLLENBQUM7U0FDakM7UUFFRCxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsRUFBRTtZQUMzQixPQUFPLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDaEIsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBR3ZCLENBQUM7Q0FDRDtBQUVELFNBQVMsR0FBRyxDQUFDLEtBQWE7SUFDekIsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQTtJQUNoQixNQUFNLENBQUMscUJBQXFCLENBQUMsR0FBRyxDQUFDLENBQUE7QUFDbEMsQ0FBQztBQUVELElBQUksR0FBRyxHQUFRO0lBQ2QsQ0FBQyxFQUFFLENBQUM7SUFDSixDQUFDLEVBQUUsQ0FBQztDQUNKLENBQUE7QUFFRCxJQUFJLEtBQUssR0FBUTtJQUNoQixDQUFDLEVBQUUsQ0FBQztJQUNKLENBQUMsRUFBRSxDQUFDO0NBQ0osQ0FBQTtBQUVELG9CQUFvQjtBQUNwQiwrQ0FBK0M7QUFDL0MsK0NBQStDO0FBQy9DLE1BQU0sTUFBTSxHQUFHLElBQUksTUFBTSxDQUFDLE1BQU0sQ0FBQyxVQUFVLEVBQUUsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0FBRWpFLFFBQVEsQ0FBQyxjQUFjLENBQUMsZUFBZSxDQUFDLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUUvRCxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztBQUU5QixJQUFJLE9BQU8sR0FBTyxFQUFFLENBQUM7QUFDckIsaUJBQWlCO0FBQ2pCLDJEQUEyRDtBQUUzRCxtREFBbUQ7QUFFbkQsMkNBQTJDO0FBQzNDLGdDQUFnQztBQUNoQyx5QkFBeUI7QUFDekIsYUFBYTtBQUNiLE1BQU07QUFDTiwwQkFBMEI7QUFDMUIsaURBQWlEO0FBQ2pELHdEQUF3RDtBQUN4RCwrREFBK0Q7QUFDL0QsMENBQTBDO0FBQzFDLE1BQU07QUFFTix5QkFBeUI7QUFDekIsZUFBZTtBQUNmLFNBQVM7QUFFVCxNQUFNLENBQUMsSUFBSSxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxFQUFDLEVBQUU7SUFDOUMsT0FBTyxHQUFHLEdBQUcsQ0FBQztJQUNkLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUM7SUFFckIsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0FBQ2IsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLEdBQUUsRUFBRSxHQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQSxDQUFBLENBQUMsQ0FBQyxDQUFDO0FBS2pDLFVBQVU7QUFFVixTQUFTLE9BQU8sQ0FBQyxLQUFhO0lBQzdCLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxLQUFhO0lBQzdCLEtBQUssQ0FBQyxDQUFDLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLENBQUMifQ==