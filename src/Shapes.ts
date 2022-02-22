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
	draw(): void;
}
class Rectangle implements Shape{
	position: vector2;
	size: vector2;
	canvas: HTMLCanvasElement;
	ctx: WebGL2RenderingContext;
	color: string;
	vb: VertexBuffer;

	constructor(pos: vector2, size: vector2, canvas: HTMLCanvasElement, ctx: WebGL2RenderingContext, color: string) {
		this.position = pos;
		this.size = size;
		this.canvas = canvas;
		this.ctx = ctx;
		this.color = color;
		this.vb = new VertexBuffer();
	}

	draw():void{

	}
}