"use strict";
class ProgramInfo {
    constructor(program, attribLocations = {}, uniformLocations = {}) {
        this.program = program;
        this.attribLocations = attribLocations;
        this.uniformLocations = uniformLocations;
    }
}
class Shader {
    constructor(canvas) {
        this.canvas = canvas;
    }
    addUniformLoc(name, loc) {
        if (loc == null) {
            loc = name;
        }
        this.programInfo.uniformLocations[name] = this.canvas.gl.getUniformLocation(this.program, loc);
    }
    program(program, loc) {
        throw new Error("Method not implemented.");
    }
    addAttribLoc(name, loc) {
        if (loc == null) {
            loc = name;
        }
        this.programInfo.attribLocations[name] = this.canvas.gl.getAttribLocation(this.program, loc);
        // console.log(this.canvas.gl.getUniformLocation(this.program, loc));
    }
    initShaderProgram(vsSource, fsSource) {
        const { gl } = this.canvas;
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
            alert("Unable to initialize the shader program: " +
                gl.getProgramInfoLog(shaderProgram));
            return null;
        }
        this.program = shaderProgram;
        this.programInfo = new ProgramInfo(this.program);
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
            alert("An error occurred compiling the shaders: " +
                gl.getShaderInfoLog(shader));
            gl.deleteShader(shader);
            return null;
        }
        return shader;
    }
    bind() {
        this.canvas.gl.useProgram(this.program);
    }
    unbind() {
        this.canvas.gl.useProgram(0);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiU2hhZGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL1NoYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiO0FBQUEsTUFBTSxXQUFXO0lBSWhCLFlBQVksT0FBcUIsRUFBRSxlQUFlLEdBQUcsRUFBRSxFQUFFLGdCQUFnQixHQUFHLEVBQUU7UUFDN0UsSUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7UUFDdkIsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUM7UUFDdkMsSUFBSSxDQUFDLGdCQUFnQixHQUFHLGdCQUFnQixDQUFDO0lBQzFDLENBQUM7Q0FDRDtBQUVELE1BQU0sTUFBTTtJQUdYLFlBQVksTUFBYztRQUN6QixJQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztJQUN0QixDQUFDO0lBRUQsYUFBYSxDQUFDLElBQVcsRUFBRSxHQUFXO1FBQ3JDLElBQUksR0FBRyxJQUFJLElBQUksRUFBRTtZQUNoQixHQUFHLEdBQUcsSUFBSSxDQUFBO1NBQ1Y7UUFFRCxJQUFJLENBQUMsV0FBVyxDQUFDLGdCQUFnQixDQUFDLElBQUksQ0FBQyxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDaEcsQ0FBQztJQUNELE9BQU8sQ0FBQyxPQUFZLEVBQUUsR0FBUztRQUM5QixNQUFNLElBQUksS0FBSyxDQUFDLHlCQUF5QixDQUFDLENBQUM7SUFDNUMsQ0FBQztJQUVELFlBQVksQ0FBQyxJQUFXLEVBQUUsR0FBVztRQUNwQyxJQUFJLEdBQUcsSUFBSSxJQUFJLEVBQUU7WUFDaEIsR0FBRyxHQUFHLElBQUksQ0FBQTtTQUNWO1FBQ0QsSUFBSSxDQUFDLFdBQVcsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLE9BQU8sRUFB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