class ProgramInfo{
	constructor(program, attribLocations = {}, uniformLocations = {}) {
		this.program = program;
		this.attribLocations = attribLocations;
		this.uniformLocations = uniformLocations;
	}
}

class Shader{
	constructor(canvas){
		this.canvas = canvas;
	}

	addUniformLoc(name, loc=null){
		if (loc == null) {
			loc = name
		}

		this.programInfo.uniformLocations[name] = this.canvas.gl.getUniformLocation(this.program, loc);
	}

	addAttribLoc(name, loc=null){
		if (loc == null) {
			loc = name
		}
		this.programInfo.attribLocations[name] = this.canvas.gl.getAttribLocation(this.program, loc);
		// console.log(this.canvas.gl.getUniformLocation(this.program, loc));
	}

	initShaderProgram(vsSource, fsSource) {
		const {gl} = this.canvas;
		const vertexShader = this.loadShader(gl, gl.VERTEX_SHADER, vsSource);
		const fragmentShader = this.loadShader(gl, gl.FRAGMENT_SHADER, fsSource);
	
		// console.log(loadShader(gl, gl.VERTEX_SHADER, vsSource));
		// console.log(vsSource);

		// Create the shader program
	
		const shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);
	
		// If creating the shader program failed, alert
	
		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert(
				"Unable to initialize the shader program: " +
					gl.getProgramInfoLog(shaderProgram),
			);
			return null;
		}
		
		this.program = shaderProgram;
		this.programInfo = new ProgramInfo(this.program)
	}
	
	//
	// creates a shader of the given type, uploads the source and
	// compiles it.
	//
	loadShader(gl, type, source) {
		const shader = gl.createShader(type);
	
		// Send the source to the shader object
	
		gl.shaderSource(shader, source);
	
		// Compile the shader program
	
		gl.compileShader(shader);
	
		// See if it compiled successfully
	
		if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
			alert(
				"An error occurred compiling the shaders: " +
					gl.getShaderInfoLog(shader),
			);
			gl.deleteShader(shader);
			return null;
		}
	
		return shader;
	}
}