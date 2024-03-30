class Geometry {
  vertices: number[];
  indices: number[];
  normals: number[];
  colors: number[];

  constructor(
    vertices: number[],
    indices: number[],
    normals?: number[],
    colors?: number[]
  ) {
    this.vertices = vertices;
    this.indices = indices;
    this.normals = normals || [];
    this.colors = colors || [];
  }

  // Add any additional methods or properties here
}

export default Geometry;
