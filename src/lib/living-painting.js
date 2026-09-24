import gsap from 'gsap'

const vertexSource = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  void main() {
    v_uv = a_position * .5 + .5;
    gl_Position = vec4(a_position, 0., 1.);
  }
`

// Move the actual pigment: sky drifts, foliage bends, water ripples.
const fragmentSource = `
  precision mediump float;
  varying vec2 v_uv;
  uniform sampler2D u_image;
  uniform vec2 u_cover;
  uniform vec2 u_offset;
  uniform vec2 u_pointer;
  uniform float u_time;
  void main() {
    vec2 uv = v_uv * u_cover + u_offset;
    float t = u_time;
    float meadow = 1. - smoothstep(.08, .48, uv.y);
    float treetops = smoothstep(.78, .96, uv.x) * smoothstep(.18, .8, uv.y);
    float sky = smoothstep(.52, .83, uv.y);
    float wind = sin(t * .9 + uv.y * 13.) + .4 * sin(t * 1.7 + uv.x * 19.);
    uv.x += wind * (.0038 * meadow + .0028 * treetops);
    uv.y += sin(t * .65 + uv.x * 14.) * .0018 * meadow;
    uv.x += sin(t * .17 + uv.y * 8.) * .0025 * sky;
    float river = (1. - smoothstep(.2, .4, uv.y))
      * smoothstep(.36, .56, uv.x) * (1. - smoothstep(.7, .88, uv.x));
    uv.x += sin(uv.y * 210. - t * 2.1) * .0013 * river;
    vec2 cursor = u_pointer * u_cover + u_offset;
    vec2 delta = uv - cursor;
    float radius = length(delta);
    float ripple = sin(radius * 32. - t * 2.3) * exp(-radius * 7.);
    uv += delta * ripple * .004;
    uv += (u_pointer - .5) * .008;
    uv = (uv - .5) * .975 + .5;
    gl_FragColor = texture2D(u_image, clamp(uv, .002, .998));
  }
`

export function createLivingPainting(canvas, image) {
  const gl = canvas.getContext('webgl', {
    alpha: false, antialias: false, depth: false, powerPreference: 'low-power',
  })
  if (!gl) return undefined
  let program, vertex, fragment, buffer, texture
  const release = () => {
    if (texture) gl.deleteTexture(texture)
    if (buffer) gl.deleteBuffer(buffer)
    if (program) gl.deleteProgram(program)
    if (vertex) gl.deleteShader(vertex)
    if (fragment) gl.deleteShader(fragment)
  }
  const compile = (type, source) => {
    const shader = gl.createShader(type)
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const reason = gl.getShaderInfoLog(shader)
      gl.deleteShader(shader)
      throw new Error(reason || 'Painting shader could not compile')
    }
    return shader
  }
  try {
    vertex = compile(gl.VERTEX_SHADER, vertexSource)
    fragment = compile(gl.FRAGMENT_SHADER, fragmentSource)
    program = gl.createProgram()
    gl.attachShader(program, vertex)
    gl.attachShader(program, fragment)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(gl.getProgramInfoLog(program) || 'Painting shader could not link')
    }
    gl.useProgram(program)
    buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW)
    const position = gl.getAttribLocation(program, 'a_position')
    gl.enableVertexAttribArray(position)
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0)
    texture = gl.createTexture()
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image)
    if (gl.getError() !== gl.NO_ERROR) throw new Error('Painting texture could not load')
  } catch (error) {
    console.warn('Animated painting unavailable; showing the original artwork.', error)
    release()
    return undefined
  }
  const uniform = name => gl.getUniformLocation(program, name)
  const cover = uniform('u_cover')
  const offset = uniform('u_offset')
  const pointer = uniform('u_pointer')
  const clock = uniform('u_time')
  gl.uniform1i(uniform('u_image'), 0)
  const hero = canvas.closest('.paint-hero')
  const target = { x: .5, y: .5 }
  const current = { ...target }
  let bounds = hero.getBoundingClientRect()
  let inView = true
  let lost = false
  let running = false
  let elapsed = 0
  let last = 0
  const resize = () => {
    const { width, height } = canvas.getBoundingClientRect()
    const ratio = Math.min(window.devicePixelRatio || 1, 1.5)
    canvas.width = Math.round(width * ratio)
    canvas.height = Math.round(height * ratio)
    gl.viewport(0, 0, canvas.width, canvas.height)
    const aspect = width / height
    const imageAspect = image.naturalWidth / image.naturalHeight
    const x = Math.min(1, aspect / imageAspect)
    const y = Math.min(1, imageAspect / aspect)
    gl.uniform2f(cover, x, y)
    gl.uniform2f(offset, (1 - x) * .68, (1 - y) * .5)
    bounds = hero.getBoundingClientRect()
  }
  const render = time => {
    if (last && time - last < 1 / 30) return
    elapsed += last ? Math.min(time - last, .07) : 0
    last = time
    current.x += (target.x - current.x) * .055
    current.y += (target.y - current.y) * .055
    gl.uniform2f(pointer, current.x, current.y)
    gl.uniform1f(clock, elapsed)
    gl.drawArrays(gl.TRIANGLES, 0, 6)
    canvas.dataset.active = 'true'
  }
  const sync = () => {
    const next = inView && !document.hidden && !lost
    if (next === running) return
    running = next
    canvas.dataset.running = String(next)
    if (next) { last = 0; gsap.ticker.add(render) }
    else gsap.ticker.remove(render)
  }
  const move = event => {
    if (event.pointerType !== 'mouse' && event.pointerType !== 'pen') return
    target.x = Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width))
    target.y = 1 - Math.max(0, Math.min(1, (event.clientY - bounds.top) / bounds.height))
  }
  const reset = () => { target.x = .5; target.y = .5 }
  const enter = () => { bounds = hero.getBoundingClientRect() }
  const contextLost = event => {
    event.preventDefault()
    lost = true
    delete canvas.dataset.active
    sync()
  }
  const observer = new IntersectionObserver(([entry]) => {
    inView = entry.isIntersecting
    sync()
  })
  const sizing = new ResizeObserver(resize)
  sizing.observe(canvas)
  observer.observe(hero)
  hero.addEventListener('pointerenter', enter, { passive: true })
  hero.addEventListener('pointermove', move, { passive: true })
  hero.addEventListener('pointerleave', reset)
  canvas.addEventListener('webglcontextlost', contextLost)
  document.addEventListener('visibilitychange', sync)
  resize()
  sync()
  return () => {
    gsap.ticker.remove(render)
    observer.disconnect()
    sizing.disconnect()
    hero.removeEventListener('pointerenter', enter)
    hero.removeEventListener('pointermove', move)
    hero.removeEventListener('pointerleave', reset)
    canvas.removeEventListener('webglcontextlost', contextLost)
    document.removeEventListener('visibilitychange', sync)
    delete canvas.dataset.active
    delete canvas.dataset.running
    release()
  }
}
