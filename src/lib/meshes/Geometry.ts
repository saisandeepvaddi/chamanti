class Geometry {
  vertices: number[];
  indices: number[];
  normals: number[];
  colors: number[];
  textureCoords: number[];
  constructor(
    vertices: number[],
    indices: number[],
    textureCoords?: number[],
    normals?: number[],
    colors?: number[]
  ) {
    this.vertices = vertices;
    this.indices = indices;
    this.textureCoords = textureCoords || [];
    this.normals = normals || [];
    this.colors = colors || [];
  }
}

export default Geometry;
