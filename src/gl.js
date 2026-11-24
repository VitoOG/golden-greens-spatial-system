const vertexShaderSource = `
attribute vec3 aPosition;
attribute vec3 aNormal;
uniform mat4 uViewProjection;
uniform vec3 uPosition;
uniform vec3 uScale;
uniform vec3 uRotation;
varying vec3 vNormal;
vec3 rotateXYZ(vec3 v) {
  float cx = cos(uRotation.x), sx = sin(uRotation.x);
  float cy = cos(uRotation.y), sy = sin(uRotation.y);
  float cz = cos(uRotation.z), sz = sin(uRotation.z);
  vec3 rx = vec3(v.x, cx*v.y - sx*v.z, sx*v.y + cx*v.z);
  vec3 ry = vec3(cy*rx.x + sy*rx.z, rx.y, -sy*rx.x + cy*rx.z);
  return vec3(cz*ry.x - sz*ry.y, sz*ry.x + cz*ry.y, ry.z);
}
void main() {
  vec3 world = rotateXYZ(aPosition * uScale) + uPosition;
  vNormal = normalize(rotateXYZ(aNormal / max(uScale, vec3(0.0001))));
  gl_Position = uViewProjection * vec4(world, 1.0);
}`;

const fragmentShaderSource = `
precision mediump float;
uniform vec3 uColor;
varying vec3 vNormal;
void main() {
  vec3 lightDir = normalize(vec3(-0.45, 0.82, 0.38));
  float diffuse = max(dot(normalize(vNormal), lightDir), 0.0);
  float light = 0.37 + diffuse * 0.68;
  gl_FragColor = vec4(uColor * light, 1.0);
}`;

export function mat4Perspective(fov, aspect, near, far) {
  const f = 1 / Math.tan(fov / 2);
  const nf = 1 / (near - far);
  const out = new Float32Array(16);
  out[0] = f / aspect; out[5] = f;
  out[10] = (far + near) * nf; out[11] = -1;
  out[14] = 2 * far * near * nf;
  return out;
}

export function mat4LookAt(eye, center, up) {
  let zx = eye[0] - center[0], zy = eye[1] - center[1], zz = eye[2] - center[2];
  let len = Math.hypot(zx, zy, zz) || 1; zx /= len; zy /= len; zz /= len;
  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1; xx /= len; xy /= len; xz /= len;
  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;
  const out = new Float32Array(16);
  out[0] = xx; out[1] = yx; out[2] = zx; out[3] = 0;
  out[4] = xy; out[5] = yy; out[6] = zy; out[7] = 0;
  out[8] = xz; out[9] = yz; out[10] = zz; out[11] = 0;
  out[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  out[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  out[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  out[15] = 1;
  return out;
}

export function mat4Multiply(a, b) {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      out[c * 4 + r] = a[0 * 4 + r] * b[c * 4 + 0] + a[1 * 4 + r] * b[c * 4 + 1] + a[2 * 4 + r] * b[c * 4 + 2] + a[3 * 4 + r] * b[c * 4 + 3];
    }
  }
  return out;
}

function createCubeVertices() {
  const faces = [
    { n: [0, 0, 1], v: [[-.5,-.5,.5],[.5,-.5,.5],[.5,.5,.5],[-.5,-.5,.5],[.5,.5,.5],[-.5,.5,.5]] },
    { n: [0, 0, -1], v: [[.5,-.5,-.5],[-.5,-.5,-.5],[-.5,.5,-.5],[.5,-.5,-.5],[-.5,.5,-.5],[.5,.5,-.5]] },
    { n: [1, 0, 0], v: [[.5,-.5,.5],[.5,-.5,-.5],[.5,.5,-.5],[.5,-.5,.5],[.5,.5,-.5],[.5,.5,.5]] },
    { n: [-1, 0, 0], v: [[-.5,-.5,-.5],[-.5,-.5,.5],[-.5,.5,.5],[-.5,-.5,-.5],[-.5,.5,.5],[-.5,.5,-.5]] },
    { n: [0, 1, 0], v: [[-.5,.5,.5],[.5,.5,.5],[.5,.5,-.5],[-.5,.5,.5],[.5,.5,-.5],[-.5,.5,-.5]] },
    { n: [0, -1, 0], v: [[-.5,-.5,-.5],[.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,-.5],[.5,-.5,.5],[-.5,-.5,.5]] }
  ];
  const data = [];
  for (const face of faces) for (const p of face.v) data.push(...p, ...face.n);
  return new Float32Array(data);
}

function createCylinderVertices(segments = 28) {
  const data = [];
  const point = (a, y) => [Math.sin(a) * .5, y, Math.cos(a) * .5];
  for (let i = 0; i < segments; i++) {
    const a0 = (i / segments) * Math.PI * 2;
    const a1 = ((i + 1) / segments) * Math.PI * 2;
    const p0b = point(a0, -.5), p0t = point(a0, .5), p1t = point(a1, .5), p1b = point(a1, -.5);
    const mid = (a0 + a1) / 2; const n = [Math.sin(mid), 0, Math.cos(mid)];
    for (const p of [p0b,p1b,p1t,p0b,p1t,p0t]) data.push(...p, ...n);
    const cTop = [0,.5,0], cBottom = [0,-.5,0], nTop = [0,1,0], nBottom = [0,-1,0];
    for (const p of [cTop,p0t,p1t]) data.push(...p, ...nTop);
    for (const p of [cBottom,p1b,p0b]) data.push(...p, ...nBottom);
  }
  return new Float32Array(data);
}

function createGableVertices() {
  const data = [];
  const v = [
    [-.5,-.5,-.5],[.5,-.5,-.5],[0,.5,-.5],
    [-.5,-.5,.5],[0,.5,.5],[.5,-.5,.5]
  ];
  const triangles = [
    [0,1,2,[0,0,-1]], [3,4,5,[0,0,1]],
    [0,3,5,[0,-.7,.7]], [0,5,1,[0,-.7,.7]],
    [1,5,4,[.7,.7,0]], [1,4,2,[.7,.7,0]],
    [2,4,3,[-.7,.7,0]], [2,3,0,[-.7,.7,0]]
  ];
  for (const t of triangles) {
    const n = t[3];
    for (let i = 0; i < 3; i++) data.push(...v[t[i]], ...n);
  }
  return new Float32Array(data);
}

function compileShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source); gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader); gl.deleteShader(shader); throw new Error(message || 'Shader compilation failed');
  }
  return shader;
}

function makeBuffer(gl, vertices) {
  const buffer = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buffer); gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
  return { buffer, count: vertices.length / 6 };
}

export function createRenderer(canvas) {
  const gl = canvas.getContext('webgl', { antialias: true, alpha: false, powerPreference: 'high-performance' });
  if (!gl) throw new Error('WebGL 1.0 is unavailable');
  const program = gl.createProgram();
  gl.attachShader(program, compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource));
  gl.attachShader(program, compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource));
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(program) || 'Shader program link failed');
  gl.useProgram(program);
  const locations = {
    position: gl.getAttribLocation(program, 'aPosition'), normal: gl.getAttribLocation(program, 'aNormal'),
    vp: gl.getUniformLocation(program, 'uViewProjection'), positionU: gl.getUniformLocation(program, 'uPosition'),
    scale: gl.getUniformLocation(program, 'uScale'), rotation: gl.getUniformLocation(program, 'uRotation'), color: gl.getUniformLocation(program, 'uColor')
  };
  const geometries = {
    box: makeBuffer(gl, createCubeVertices()),
    cylinder: makeBuffer(gl, createCylinderVertices()),
    gable: makeBuffer(gl, createGableVertices())
  };
  gl.enable(gl.DEPTH_TEST); gl.depthFunc(gl.LEQUAL); gl.disable(gl.CULL_FACE);
  gl.enable(gl.BLEND); gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

  function resize() {
    const rect = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
    const w = Math.max(1, Math.round(rect.width * dpr)); const h = Math.max(1, Math.round(rect.height * dpr));
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    gl.viewport(0, 0, w, h);
    return { width: w, height: h };
  }

  function render(scene, camera, visibleGroups, selectedId, showGrid = true) {
    const { width, height } = resize();
    gl.clearColor(0.055, 0.085, 0.063, 1); gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    gl.useProgram(program);
    const projection = mat4Perspective(Math.PI / 4.4, width / height, .1, 500);
    const view = mat4LookAt(camera.eye, camera.target, [0, 1, 0]);
    const vp = mat4Multiply(projection, view);
    gl.uniformMatrix4fv(locations.vp, false, vp);
    gl.enableVertexAttribArray(locations.position); gl.enableVertexAttribArray(locations.normal);
    for (const object of scene.objects) {
      if (object.group === 'grid' && !showGrid) continue;
      if (object.group !== 'grid' && visibleGroups && visibleGroups[object.group] === false) continue;
      for (const mesh of object.meshes) {
        const geo = geometries[mesh.shape || 'box']; if (!geo) continue;
        gl.bindBuffer(gl.ARRAY_BUFFER, geo.buffer);
        gl.vertexAttribPointer(locations.position, 3, gl.FLOAT, false, 24, 0);
        gl.vertexAttribPointer(locations.normal, 3, gl.FLOAT, false, 24, 12);
        gl.uniform3fv(locations.positionU, mesh.position);
        gl.uniform3fv(locations.scale, mesh.scale);
        gl.uniform3fv(locations.rotation, mesh.rotation || [0,0,0]);
        let color = mesh.color;
        if (object.id === selectedId) color = mesh.highlightColor || lighten(color, .16);
        gl.uniform3fv(locations.color, hexToRgb(color));
        gl.drawArrays(gl.TRIANGLES, 0, geo.count);
      }
    }
    return { viewProjection: vp, width, height };
  }

  return { gl, render, resize };
}

function hexToRgb(hex) {
  const clean = String(hex || '#ffffff').replace('#', '');
  const value = clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean;
  const n = parseInt(value, 16) || 0xffffff;
  return new Float32Array([((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255]);
}

function lighten(hex, amount) {
  const clean = String(hex || '#ffffff').replace('#', '');
  const n = parseInt(clean.length === 3 ? clean.split('').map(c => c + c).join('') : clean, 16) || 0xffffff;
  const channels = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map(c => Math.min(255, Math.round(c + (255 - c) * amount)));
  return `#${channels.map(c => c.toString(16).padStart(2,'0')).join('')}`;
}

export function projectPoint(point, viewProjection, width, height) {
  const [x,y,z] = point;
  const cx = viewProjection[0]*x + viewProjection[4]*y + viewProjection[8]*z + viewProjection[12];
  const cy = viewProjection[1]*x + viewProjection[5]*y + viewProjection[9]*z + viewProjection[13];
  const cz = viewProjection[2]*x + viewProjection[6]*y + viewProjection[10]*z + viewProjection[14];
  const cw = viewProjection[3]*x + viewProjection[7]*y + viewProjection[11]*z + viewProjection[15];
  if (cw <= 0) return null;
  const nx = cx / cw, ny = cy / cw, nz = cz / cw;
  if (nz < -1 || nz > 1) return null;
  return { x: (nx * .5 + .5) * width, y: (1 - (ny * .5 + .5)) * height, depth: nz };
}
