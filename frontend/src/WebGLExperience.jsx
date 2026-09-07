import { useEffect, useRef } from "react";

const vertexShaderSource = `
attribute vec2 a_position;
void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform float u_scroll;

float circle(vec2 uv, vec2 p, float r, float blur) {
  return 1.0 - smoothstep(r, r + blur, distance(uv, p));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 p = uv - 0.5;
  p.x *= u_resolution.x / u_resolution.y;

  float t = u_time * 0.18;
  vec2 mouse = (u_mouse - 0.5) * vec2(0.42, 0.28);

  vec2 a = vec2(sin(t) * 0.22, cos(t * 0.73) * 0.14) + mouse * 0.7;
  vec2 b = vec2(cos(t * 0.61) * 0.30, sin(t * 0.84) * 0.20) - mouse * 0.35;
  vec2 c = vec2(sin(t * 0.43 + 2.4) * 0.38, cos(t * 0.51) * 0.24);

  float glowA = circle(p, a, 0.06, 0.34);
  float glowB = circle(p, b, 0.05, 0.30);
  float glowC = circle(p, c, 0.04, 0.27);

  float rings = abs(sin(length(p - mouse * 0.35) * 26.0 - u_time * 0.55));
  rings = smoothstep(0.91, 0.995, rings) * exp(-length(p) * 2.8);

  float sweep = smoothstep(0.49, 0.5, sin((p.x + p.y * 0.45) * 10.0 - u_time * 0.34 + u_scroll * 3.0));
  sweep *= exp(-abs(p.y) * 4.2) * 0.06;

  vec3 gold = vec3(0.85, 0.68, 0.31);
  vec3 violet = vec3(0.43, 0.36, 1.0);
  vec3 cyan = vec3(0.18, 0.62, 0.92);

  vec3 color = vec3(0.0);
  color += gold * glowA * 0.13;
  color += violet * glowB * 0.16;
  color += cyan * glowC * 0.07;
  color += mix(violet, gold, 0.55) * rings * 0.10;
  color += gold * sweep;

  float vignette = smoothstep(0.9, 0.18, length(p));
  color *= vignette;

  gl_FragColor = vec4(color, 0.82);
}
`;

function createShader(gl, type, source) {
  const shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.warn("CareerUp WebGL shader error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(gl) {
  const vertex = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragment = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
  if (!vertex || !fragment) return null;

  const program = gl.createProgram();
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  gl.deleteShader(vertex);
  gl.deleteShader(fragment);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.warn("CareerUp WebGL link error:", gl.getProgramInfoLog(program));
    gl.deleteProgram(program);
    return null;
  }
  return program;
}

export default function WebGLExperience() {
  const canvasRef = useRef(null);
  const cursorRef = useRef(null);
  const dotRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarsePointer = window.matchMedia("(pointer: coarse)").matches;
    const lowPowerDevice = (navigator.hardwareConcurrency || 8) <= 4;

    if (reduceMotion || coarsePointer || lowPowerDevice) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      preserveDrawingBuffer: false,
      powerPreference: "high-performance",
    });
    if (!gl) return;

    const program = createProgram(gl);
    if (!program) return;

    const positionLocation = gl.getAttribLocation(program, "a_position");
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    const timeLocation = gl.getUniformLocation(program, "u_time");
    const mouseLocation = gl.getUniformLocation(program, "u_mouse");
    const scrollLocation = gl.getUniformLocation(program, "u_scroll");

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

    gl.useProgram(program);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    const mouse = { x: 0.5, y: 0.5 };
    const targetMouse = { x: 0.5, y: 0.5 };
    let scroll = 0;
    let targetScroll = 0;
    let frame = 0;
    let visible = !document.hidden;
    let lastFrame = 0;
    const frameInterval = 1000 / 40;
    const start = performance.now();

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.25);
      const width = Math.max(1, Math.floor(window.innerWidth * dpr));
      const height = Math.max(1, Math.floor(window.innerHeight * dpr));
      if (canvas.width === width && canvas.height === height) return;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      gl.viewport(0, 0, width, height);
      gl.uniform2f(resolutionLocation, width, height);
    };

    const onPointer = (event) => {
      targetMouse.x = event.clientX / window.innerWidth;
      targetMouse.y = 1 - event.clientY / window.innerHeight;

      if (cursorRef.current) cursorRef.current.style.transform = `translate3d(${event.clientX - 18}px, ${event.clientY - 18}px, 0)`;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${event.clientX - 2}px, ${event.clientY - 2}px, 0)`;
    };

    const onScroll = () => {
      const max = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
      targetScroll = window.scrollY / max;
    };

    const onVisibility = () => {
      visible = !document.hidden;
      if (visible && !frame) frame = requestAnimationFrame(render);
    };

    const render = (now) => {
      frame = 0;
      if (!visible) return;

      if (now - lastFrame < frameInterval) {
        frame = requestAnimationFrame(render);
        return;
      }
      lastFrame = now;

      mouse.x += (targetMouse.x - mouse.x) * 0.07;
      mouse.y += (targetMouse.y - mouse.y) * 0.07;
      scroll += (targetScroll - scroll) * 0.055;

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.uniform1f(timeLocation, (now - start) / 1000);
      gl.uniform2f(mouseLocation, mouse.x, mouse.y);
      gl.uniform1f(scrollLocation, scroll);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      frame = requestAnimationFrame(render);
    };

    resize();
    onScroll();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointer, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibility);
    frame = requestAnimationFrame(render);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
    };
  }, []);

  useEffect(() => {
    const sections = [...document.querySelectorAll("main section")];
    if (!sections.length) return;

    sections.forEach((section, index) => {
      if (index === 0) return;
      section.classList.add("career-reveal-section");
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("career-reveal-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -4% 0px" },
    );

    sections.slice(1).forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <style>{`
        .career-webgl-canvas{mix-blend-mode:screen;opacity:.68;}
        .career-reveal-section{opacity:0;transform:translate3d(0,34px,0) scale(.992);transition:opacity .65s cubic-bezier(.22,1,.36,1),transform .65s cubic-bezier(.22,1,.36,1);}
        .career-reveal-visible{opacity:1;transform:translate3d(0,0,0) scale(1);}
        .career-cursor-ring{transition:width .2s ease,height .2s ease,border-color .2s ease,opacity .2s ease;will-change:transform;}
        .career-cursor-dot{will-change:transform;}
        @media (pointer:coarse),(prefers-reduced-motion:reduce){.career-cursor-ring,.career-cursor-dot,.career-webgl-canvas{display:none}.career-reveal-section{opacity:1;transform:none;transition:none}}
      `}</style>
      <canvas ref={canvasRef} aria-hidden="true" className="career-webgl-canvas pointer-events-none fixed inset-0 z-[1] h-screen w-screen" />
      <div ref={cursorRef} aria-hidden="true" className="career-cursor-ring pointer-events-none fixed left-0 top-0 z-[70] h-9 w-9 rounded-full border border-[#d9b45a]/30 opacity-70 mix-blend-screen" />
      <div ref={dotRef} aria-hidden="true" className="career-cursor-dot pointer-events-none fixed left-0 top-0 z-[71] h-1 w-1 rounded-full bg-[#efd080] shadow-[0_0_14px_rgba(217,180,90,.8)]" />
    </>
  );
}
