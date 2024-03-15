export class Mesh {
  vertices: number[];
  indices: number[];
  constructor(vertices: number[], indices: number[]) {
    this.vertices = vertices;
    this.indices = indices;
  }
}
