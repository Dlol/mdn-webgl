class VertexBuffer{
	buffer: WebGLBuffer | null;
	gl: WebGL2RenderingContext;
	constructor(data:Number[], gl:WebGL2RenderingContext){
		this.gl = gl;
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
	}

	bind() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
	}

	unbind() {
		this.gl.bindBuffer(this.gl.ARRAY_BUFFER, 0);
	}
}

class IndexBuffer{
	gl: any;
	buffer: any;
	constructor(data:Number[], gl:WebGL2RenderingContext){
		this.gl = gl;
		this.buffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.buffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint8Array(data), gl.STATIC_DRAW);
	}

	bind() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.buffer)
	}

	unbind() {
		this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, 0);
	}
}
