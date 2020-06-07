attribute vec4 vPosition; // vPosition 存储了输入着色器的顶点位置

void main()
{
  gl_PointSize = 1.0;
  gl_Position = vPosition; // 传递顶点的位置信息，gl_Position 是内置变量
}
