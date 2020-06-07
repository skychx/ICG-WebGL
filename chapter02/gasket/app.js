/**
 * 教程案例
 */
import {createProgram, setupWebGL, pointsToBuffer} from 'GLHelper';
import {vec2} from 'gl-matrix';

import vertexShader from './shader.vert';
import fragmentShader from './shader.frag';

let gl;
let points;

const NumPoints = 5000;

function init() {
  const canvas = document.getElementById('gl-canvas');
  gl = setupWebGL(canvas);

  if(!gl) {
    console.error('WebGL isn\'t available');
  }

  //
  //  Initialize our data for the Sierpinski Gasket
  //

  // First, initialize the corners of our gasket with three points.
  // 第一步，创建三角形的三个原始顶点（直角边比例为 2:1, Float32Array）

  const vertices = [
    vec2(-1, -1),
    vec2(0, 1),
    vec2(1, -1),
  ];

  // Specify a starting point p for our iterations
  // p must lie inside any set of three vertices

  // u v 是两条边的二等分点，p 是 u v 的二等分点，p 一定在三角形内部，p 就是初始点
  const u = vec2(vertices[0]) + vec2(vertices[1]) * 0.5;
  const v = vec2(vertices[0]) + vec2(vertices[2]) * 0.5;
  let p = (vec2(u) + vec2(v)) * 0.5;

  // And, add our initial point into our array of points
  // 所有点的记录在 points 这个数组里
  points = [p];

  // Compute new points
  // Each new point is located midway between
  // last point and a randomly chosen vertex

  for(let i = 0; points.length < NumPoints; ++i) {
    // j enum[0, 1, 2]，表示三个定点
    const j = Math.floor(Math.random() * 3);
    // 新的 p 点是随机点和定点连线的中点
    p = (vec2(points[i]) + vec2(vertices[j])) * 0.5;
    points.push(p);
  }

  //
  //  Configure WebGL
  // 视口大小为 canvas 画布大小
  gl.viewport(0, 0, canvas.width, canvas.height);
  // 清屏颜色为白色
  gl.clearColor(1.0, 1.0, 1.0, 1.0);

  //  Load shaders and initialize attribute buffers

  // 创建一个称为【程序对象】的容器，并把着色器对象绑定上去
  const program = createProgram(gl, vertexShader, fragmentShader);
  gl.useProgram(program);

  // Load the data into the GPU

  // 创建缓冲区并返回一个标示符 bufferId
  const bufferId = gl.createBuffer();
  // 绑定缓冲区
  gl.bindBuffer(gl.ARRAY_BUFFER, bufferId);
  // 把数据发送到 GPU 缓存
  // gl.STATIC_DRAW 表示这段缓存很少变更，适合本例子
  gl.bufferData(gl.ARRAY_BUFFER, pointsToBuffer(points), gl.STATIC_DRAW);


  // Associate out shader variables with our data buffer

  // 返回顶点着色器中属性变量的索引
  const vPosition = gl.getAttribLocation(program, 'vPosition');
  // 描述顶点数组中的数据形式
  // gl.vertexAttribPointer(index, size, type, normalized, stride, offset);
  // index：索引
  // size & type：数组每个元素有两个浮点数的值
  // normalized：是否数据归一化
  // stride：
  // offset：数据起始位置
  gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
  // 开启着色器中的顶点属性
  gl.enableVertexAttribArray(vPosition);

  render();
}

function render() {
  // 首先清理帧缓存
  gl.clear(gl.COLOR_BUFFER_BIT);
  // 图元绘制
  gl.drawArrays(gl.POINTS, 0, points.length);
}

init();