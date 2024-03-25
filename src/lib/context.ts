import { GLContext, invariant } from '.';

let glContext: GLContext | null = null;

export function setGLContext(context: GLContext) {
  glContext = context;
}

export function getGLContext() {
  invariant(!!glContext, 'GL context is not set');
  return glContext;
}
