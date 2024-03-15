import { GLContext } from '.';

export type Config = {
  webglVersion: number;
  clearColor: [number, number, number, number];
  _glContext: GLContext | null;
};
export const Global: Config = {
  webglVersion: 2,
  clearColor: [0.0, 0.0, 0.0, 1.0],
  _glContext: null,
};

export const getConfig = () => {
  return Global;
};
