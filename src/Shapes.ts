type vector2 = {
	x: number;
	y: number;
};

interface Shape{
	position: vector2;
	size: vector2;
	canvas: HTMLCanvasElement;
	ctx: WebGL2RenderingContext;
	color: string;
	shader: Shader;
	draw(): void;
}
class Rectangle implements Shape{
	position: vector2;
	size: vector2;
	canvas: HTMLCanvasElement;
	ctx: WebGL2RenderingContext;
	color: string;
	shader: Shader;
	vb: VertexBuffer;
	ib: IndexBuffer;

	constructor(pos: vector2, size: vector2, canvas: HTMLCanvasElement, ctx: WebGL2RenderingContext, color: string, shader: Shader) {
		this.position = pos;
		this.size = size;
		this.canvas = canvas;
		this.ctx = ctx;
		this.color = color;
		this.shader = shader;
		let positions = [
			0 + pos.x, 0 + pos.y,
			1 * size.x + pos.x, 0 + pos.y,
			0 + pos.x, 1 * size.y + pos.y,
			1 * size.x + pos.x, 1 * size.y + pos.y
		]
		let idx = [
			0, 1, 2,
			3, 1, 2
		]
		this.ib = new IndexBuffer(idx, ctx);
		this.vb = new VertexBuffer(positions ,ctx);
	}

	draw():void {
		const {programInfo} = this.shader;
		this.ib.bind();
		this.vb.bind();

		const numComponents = 2;
		const type = this.ctx.FLOAT;
		const normalize = false;
		const stride = 0;
		const offset = 0;
		this.ctx.vertexAttribPointer(
			programInfo.attribLocations.vertexPosition,
			numComponents,
			type,
			normalize,
			stride,
			offset,
		);
		this.ctx.enableVertexAttribArray(programInfo.attribLocations.vertexPosition);
		this.ctx.drawElements(this.ctx.TRIANGLES, 6, this.ctx.UNSIGNED_BYTE, 0)
	}
}