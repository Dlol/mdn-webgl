type Vec2 = {
	x: number;
	y: number;
};

type Vec3 = {
	x: number;
	y: number;
	z: number;
}

type Color = {
	r: number;
	g: number;
	b: number;
	a: number;
}

interface Shape{
	position: Vec2;
	size: Vec2;
	canvas: HTMLCanvasElement;
	ctx: WebGL2RenderingContext;
	color: Color;
	shader: Shader;
	draw(): void;
}
class Rectangle implements Shape{
	position: Vec2;
	size: Vec2;
	canvas: HTMLCanvasElement;
	ctx: WebGL2RenderingContext;
	color: Color;
	shader: Shader;
	vb: VertexBuffer;
	ib: IndexBuffer;

	constructor(pos: Vec2, size: Vec2, canvas: HTMLCanvasElement, ctx: WebGL2RenderingContext, color: Color, shader: Shader) {
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
		this.ctx.uniform4f(programInfo.uniformLocations.color, this.color.r, this.color.g, this.color.b, this.color.a);
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