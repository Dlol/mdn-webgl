// basically importing but in pre es2016 ig
// const { mat2, mat3, mat4, vec2, vec3, vec4 } = glMatrix;

class Game{
	constructor(canvas){
		this.canvas = canvas;
	}

	main() {
		// const canvas = document.querySelector("#glcanvas");
	
		// If we don't have a GL context, give up now
	
		if (!canvas.gl) {
			alert(
				"Unable to initialize WebGL. Your browser or machine may not support it.",
			);
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
	
		// Here's where we call the routine that builds all the
		// objects we'll be drawing.
		this.buffers = this.initBuffers();
	
		// console.log(shader);
	
		// Draw the scene
		this.drawScene();
	}

	initBuffers() {
		const {gl} = this.canvas;
		// Create a buffer for the square's positions.
	
	
		// Select the positionBuffer as the one to apply buffer
		// operations to from here out.
		// const indexBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		const idx = new Uint8Array([0, 1, 3, 0, 2, 3]);
		// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW)

		const indexBuffer = new IndexBuffer(idx, gl);
	
		// const positionBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
	
		// Now create an array of positions for the square.
	
		const positions = [
			 100,  100, 
			 0.0,  100, 
			 100,  0.0, 
			 0.0,  0.0];
		
		const positionBuffer = new VertexBuffer(positions, gl);
	
		// Now pass the list of positions into WebGL to build the
		// shape. We do this by creating a Float32Array from the
		// JavaScript array, then use it to fill the current buffer.
		// gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
	
		return {
			position: positionBuffer,
			index: indexBuffer
		};
	}

	drawScene() {

		const { gl } = this.canvas;
		const programInfo = this.shader.programInfo;
		const buffers = this.buffers;
		gl.enable(gl.BLEND)
		gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

		gl.clearColor(0.0, 0.0, 0.0, 1.0); // Clear to black, fully opaque
		gl.clearDepth(1.0); // Clear everything
		// gl.enable(gl.DEPTH_TEST); // Enable depth testing
		// gl.depthFunc(gl.LEQUAL); // Near things obscure far things
	
		// Clear the canvas before we start drawing on it.
	
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
	
		mat4.translate(
			this.modelMatrix, // destination matrix
			this.modelMatrix, // matrix to translate
			[pos.x, pos.y, 0.0],
		); // amount to translate
	
		// Tell WebGL how to pull out the positions from the position
		// buffer into the vertexPosition attribute.
		{
			const numComponents = 2;
			const type = gl.FLOAT;
			const normalize = false;
			const stride = 0;
			const offset = 0;
			// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffers.index)
			buffers.index.bind();
			buffers.position.bind();
	
			// gl.bindBuffer(gl.ARRAY_BUFFER, buffers.position);
			gl.vertexAttribPointer(
				programInfo.attribLocations.vertexPosition,
				numComponents,
				type,
				normalize,
				stride,
				offset,
			);
			gl.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
		}
	
		// Tell WebGL to use our program when drawing
	
		gl.useProgram(programInfo.program);
	
		// Set the shader uniforms
	
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.projectionMatrix,
			false,
			projectionMatrix,
		);
		gl.uniformMatrix4fv(
			programInfo.uniformLocations.viewMatrix,
			false,
			this.viewMatrix,
		);
		gl.uniform4f(programInfo.uniformLocations.color, 1, 0.5, 0.3, 1);
		// this.draw()
		ugh(0)
	}

	draw(delta) {
		// console.log(this);
		const { gl } = this.canvas;
		const programInfo = this.shader.programInfo;
		const buffers = this.buffers;
		// console.log(curkeys);
		if (curkeys[38]) {
			pos.y -= 5
		}
		if (curkeys[40]) {
			pos.y += 5
		}
		if (curkeys[37]) {
			pos.x -= 5
		}
		if (curkeys[39]) {
			pos.x += 5
		}
		if (mouseButton[0]) {
			gl.uniform4f(programInfo.uniformLocations.color, 0, 0, 0, 1);
			// console.log("down");
		}
		else{
			gl.uniform4f(programInfo.uniformLocations.color, 1, 0.5, 0.3, 1);
		}
		if (mouseButton[2]) {
			scale.x = 10;
			document.getElementById('scaleX').value = 10;
		}
		if (mouseButton[1]) {
			scale.y = 10;
			document.getElementById('scaleY').value = 10;
		}

		gl.clearColor(1.0, 1.0, 1.0, 0.5);
		gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

		mat4.fromRotationTranslationScale(
			this.modelMatrix, // destination matrix
			quat.create(),
			[mousePos.x - (50 * scale.x), 
				mousePos.y - (50 * scale.y), 0.0],
			[scale.x, scale.y, 0]
		);

		gl.uniformMatrix4fv(
			programInfo.uniformLocations.modelMatrix,
			false,
			this.modelMatrix,
		);
		gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0)
	}
}

function ugh(delta) {
	game.draw(delta)
	window.requestAnimationFrame(ugh)
}

let pos = {
	x: 0,
	y: 5
}

let scale = {
	x: 1,
	y: 1
}

// loads the shaders
// let vsResponse = await fetch("vert.shader");
// let fsResponse = await fetch("frag.shader");

let shaders = {};
(async () => {
	let shaderResponse = await fetch("assets/Basic.shader")

	let shaderSource = await shaderResponse.text();
	
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
	})
	
	console.log(shaders);
}) ();


const canvas = new Canvas(window.innerWidth, window.innerHeight);

document.getElementById('canvContainer').appendChild(canvas.c);

const game = new Game(canvas);

setTimeout(() => {
	game.main()
}, 30);

// main();

function scalerx(value) {
	scale.x = value;
}

function scalery(value) {
	scale.y = value;
}
