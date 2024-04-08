import {
  NORMAL_ATTRIBUTE,
  POSITION_ATTRIBUTE,
  TEXCOORD_ATTRIBUTE,
} from './attribute_constants';
import {
  MODEL_MATRIX_UNIFORM,
  NORMAL_MATRIX_UNIFORM,
  PROJECTION_MATRIX_UNIFORM,
  VIEW_MATRIX_UNIFORM,
} from './uniform_constants';

export enum SHADER_TYPE {
  VERTEX,
  FRAGMENT,
}

const VERSION = `#version 300 es`;
const PRECISION = `precision highp float;`;

export class Shader {
  type: SHADER_TYPE;
  defines: string[] = [];
  shaderSource: string = '';
  constructor(type: SHADER_TYPE, shaderSource: string, defines: string[] = []) {
    this.type = type;
    this.shaderSource = shaderSource;
    this.defines = defines;
  }
  createShaderString() {
    let shaderString = '';
    shaderString += `${VERSION}\n`;
    shaderString += `${PRECISION}\n`;

    if (this.type === SHADER_TYPE.VERTEX) {
      // Remove this aliases for webgl1. Added because of old habits.
      shaderString += `#define varying out\n`;
      // Add default attributes
      shaderString += `in vec3 ${POSITION_ATTRIBUTE};\n`;
      shaderString += `in vec3 ${NORMAL_ATTRIBUTE};\n`;
      shaderString += `in vec2 ${TEXCOORD_ATTRIBUTE};\n`;

      // Add default uniforms
      shaderString += `uniform mat4 ${VIEW_MATRIX_UNIFORM};\n`;
      shaderString += `uniform mat4 ${PROJECTION_MATRIX_UNIFORM};\n`;
      shaderString += `uniform mat4 ${MODEL_MATRIX_UNIFORM};\n`;
      shaderString += `uniform mat3 ${NORMAL_MATRIX_UNIFORM};\n`;
    }

    if (this.type === SHADER_TYPE.FRAGMENT) {
      // Remove this aliases for webgl1. Added because of old habits.
      shaderString += `#define varying in\n`;
      shaderString += `#define gl_FragColor fragColor\n`;
      shaderString += `out vec4 fragColor;\n`;
    }

    this.defines.forEach((define) => {
      shaderString += `#define ${define}\n`;
    });

    shaderString += this.shaderSource;

    return shaderString;
  }
  addDefine(define: string) {
    this.defines.push(define);
    return this;
  }

  getShaderSource() {
    return this.createShaderString();
  }
}
