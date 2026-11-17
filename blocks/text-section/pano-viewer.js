/**
 * 360° webcam viewer for the `webcams` variant — the source's krpano "Interactive View"
 * (about-webcams: `embedpano({xml: …krpano_config/armazones_*_public.xml})`, 100 % × 400 px,
 * black ground, autorotate, the buttons-png control bar). Re-implemented, not embedded: a WebGL
 * rectilinear view of the authored link's equirectangular panorama (`…/preset_100.jpg`, full
 * 360° wide, top edge at the zenith), the authored image stays as the poster / no-WebGL fallback.
 * View settings are the source configs' `<view>` values, keyed by the camera folder.
 */

const D2R = Math.PI / 180;

/* krpano_config/armazones_<cam>_public.xml <view>: fov, fovtype, fov limits, vlookat limits */
const VIEWS = {
  armazonespanosouth: {
    fov: 99.804872, fovtype: 'VFOV', fovmin: 10, fovmax: 75, vmin: -90, vmax: 45.826705,
  },
  // no fov/fovtype in the config: krpano's defaults (90, VFOV here), clamped to fovmax
  armazonespano: {
    fov: 90, fovtype: 'VFOV', fovmin: 10, fovmax: 50, vmin: -90, vmax: 40,
  },
  armazonesdome1: {
    fov: 100, fovtype: 'MFOV', fovmin: 21.213885, fovmax: 140, vmin: -90, vmax: 90,
  },
  armazonesdome2: {
    fov: 100, fovtype: 'MFOV', fovmin: 21.213885, fovmax: 140, vmin: -90, vmax: 90,
  },
};
const DEFAULT_VIEW = {
  fov: 90, fovtype: 'MFOV', fovmin: 10, fovmax: 120, vmin: -90, vmax: 90,
};

/* rotate.xml <autorotate waittime="1" accel="0.5" speed="1.5"/> (deg/s², deg/s) */
const AUTOROTATE = { wait: 1000, accel: 0.5, speed: 1.5 };
const MOVE_SPEED = 40; // deg/s while an arrow button is held
const TEXEL = 1; // texels per screen pixel at the start view (krpano picks the next sharper level)

/* buttons-png-include_public.xml: x offset from the centre, sprite column (40 px cells,
   rows: normal / over / down) */
const BUTTONS = [
  {
    name: 'left', x: -80, col: 0, label: 'Look left',
  },
  {
    name: 'right', x: -40, col: 40, label: 'Look right',
  },
  {
    name: 'up', x: 0, col: 80, label: 'Look up',
  },
  {
    name: 'down', x: 40, col: 120, label: 'Look down',
  },
  {
    name: 'quality', x: 80, col: 240, label: 'Toggle quality',
  },
  {
    name: 'mode', x: 120, col: 400, label: 'Change control mode',
  },
  {
    name: 'fullscreen', x: 160, col: 280, label: 'Fullscreen',
  },
];

const VERT = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
const FRAG = `precision highp float;
uniform sampler2D t;uniform vec2 res;uniform float yaw,pitch,f,imgV,imgTop;
void main(){
  vec2 q=gl_FragCoord.xy-res*.5;
  vec3 d=normalize(vec3(q.x,q.y,f));
  float c=cos(pitch),s=sin(pitch);
  d=vec3(d.x,d.y*c-d.z*s,d.y*s+d.z*c);
  float lon=atan(d.x,d.z)+yaw;
  float lat=asin(clamp(d.y,-1.,1.));
  float v=(imgTop-lat)/imgV;
  if(v<0.||v>1.){gl_FragColor=vec4(0.,0.,0.,1.);return;}
  gl_FragColor=texture2D(t,vec2(fract(.5+lon/6.2831853),v));
}`;

function camOf(href) {
  const m = /archive_webcams\/([^/]+)\//.exec(href || '');
  return m ? m[1] : '';
}

function compile(gl) {
  const prog = gl.createProgram();
  [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]].forEach(([type, src]) => {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    gl.attachShader(prog, sh);
  });
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(prog, 'p');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  const u = {};
  ['res', 'yaw', 'pitch', 'f', 'imgV', 'imgTop'].forEach((n) => {
    u[n] = gl.getUniformLocation(prog, n);
  });
  return u;
}

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.decoding = 'async';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Turns a webcam frame (`.webcam-frame` > a[href=panorama] > img) into the 360° viewer.
 * @param {Element} frame The webcam frame of the interactive view
 */
export default function panoViewer(frame) {
  const link = frame.querySelector('a[href]');
  if (!link || frame.querySelector('.pano-viewer')) return;
  const view = VIEWS[camOf(link.href)] || DEFAULT_VIEW;
  const box = document.createElement('div');
  box.className = 'pano-viewer';
  const canvas = document.createElement('canvas');
  const controls = document.createElement('div');
  controls.className = 'pano-controls';
  box.append(canvas, controls);
  link.after(box);

  const gl = canvas.getContext('webgl', { antialias: false, preserveDrawingBuffer: true });
  const u = gl && compile(gl);
  if (!u) {
    box.remove();
    return;
  }

  const st = {
    h: 0,
    v: 0,
    fov: Math.min(Math.max(view.fov, view.fovmin), view.fovmax),
    imgV: Math.PI,
    imgTop: Math.PI / 2,
    ready: false,
    moveH: 0,
    moveV: 0,
    rot: 0,
    idleSince: performance.now(),
    mode: 'moveto',
    visible: false,
    drag: null,
    smooth: true,
  };

  const size = () => {
    const dpr = window.devicePixelRatio || 1;
    const w = Math.max(1, Math.round(box.clientWidth * dpr));
    const h = Math.max(1, Math.round(box.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    return [w, h];
  };

  // focal length in device px from the krpano fov + fovtype
  const focal = (w, h) => {
    const t = Math.tan((st.fov * D2R) / 2);
    let half = h / 2;
    if (view.fovtype === 'HFOV') half = w / 2;
    // MFOV: horizontal on landscape, a 4:3 width on portrait (calibrated on the source at 360)
    if (view.fovtype === 'MFOV') half = Math.max(w, (h * 4) / 3) / 2;
    if (view.fovtype === 'DFOV') half = Math.hypot(w, h) / 2;
    return half / t;
  };

  const draw = () => {
    if (!st.ready) return;
    const [w, h] = size();
    const f = focal(w, h);
    // keep the view inside the image's vertical range (krpano limitview="range")
    const halfV = Math.atan(h / 2 / f) / D2R;
    const top = st.imgTop / D2R;
    const bottom = top - st.imgV / D2R;
    const vmin = Math.max(view.vmin, -top + halfV);
    const vmax = Math.min(view.vmax, -bottom - halfV);
    st.v = vmin > vmax ? (vmin + vmax) / 2 : Math.min(Math.max(st.v, vmin), vmax);
    gl.viewport(0, 0, w, h);
    gl.uniform2f(u.res, w, h);
    gl.uniform1f(u.yaw, st.h * D2R);
    gl.uniform1f(u.pitch, st.v * D2R);
    gl.uniform1f(u.f, f);
    gl.uniform1f(u.imgV, st.imgV);
    gl.uniform1f(u.imgTop, st.imgTop);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  };

  let last = performance.now();
  const tick = (now) => {
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;
    const busy = st.moveH || st.moveV || st.drag;
    if (!st.visible) {
      // off screen: no rendering and no autorotation; the wait restarts when it shows
      st.idleSince = now;
      st.rot = 0;
      requestAnimationFrame(tick);
      return;
    }
    if (busy) {
      st.idleSince = now;
      st.rot = 0;
    } else if (now - st.idleSince > AUTOROTATE.wait) {
      st.rot = Math.min(AUTOROTATE.speed, st.rot + AUTOROTATE.accel * dt);
      st.h += st.rot * dt;
    }
    st.h += st.moveH * MOVE_SPEED * dt;
    st.v += st.moveV * MOVE_SPEED * dt;
    if (st.drag && st.mode === 'moveto') {
      st.h += st.drag.dx * 0.15 * dt;
      st.v += st.drag.dy * 0.15 * dt;
    }
    draw();
    requestAnimationFrame(tick);
  };

  const upload = async () => {
    const img = await loadImage(link.href);
    const [w, h] = size();
    const max = Math.min(gl.getParameter(gl.MAX_TEXTURE_SIZE), 8192, img.naturalWidth);
    // texture width for TEXEL texels per screen pixel at the start view
    const hfov = (2 * Math.atan(w / 2 / focal(w, h))) / D2R;
    const tw = Math.min(max, Math.max(1024, Math.round((w / hfov) * 360 * TEXEL)));
    const th = Math.round((tw * img.naturalHeight) / img.naturalWidth);
    const scaled = document.createElement('canvas');
    scaled.width = tw;
    scaled.height = th;
    const ctx = scaled.getContext('2d');
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(img, 0, 0, tw, th);
    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, scaled);
    // full 360° wide, top edge at the zenith
    st.imgV = Math.min(Math.PI, (2 * Math.PI * img.naturalHeight) / img.naturalWidth);
    st.imgTop = Math.PI / 2;
    st.ready = true;
    box.classList.add('ready');
  };

  // control bar
  BUTTONS.forEach((b) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `pano-button pano-${b.name}`;
    btn.style.setProperty('--x', `${b.x}px`);
    btn.style.setProperty('--col', `-${b.col}px`);
    btn.setAttribute('aria-label', b.label);
    controls.append(btn);
    const hold = (on) => {
      if (b.name === 'left') st.moveH = on ? -1 : 0;
      if (b.name === 'right') st.moveH = on ? 1 : 0;
      if (b.name === 'up') st.moveV = on ? -1 : 0;
      if (b.name === 'down') st.moveV = on ? 1 : 0;
    };
    if (['left', 'right', 'up', 'down'].includes(b.name)) {
      btn.addEventListener('pointerdown', (e) => { e.stopPropagation(); hold(true); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach((ev) => {
        btn.addEventListener(ev, () => hold(false));
      });
    }
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (b.name === 'quality') {
        st.smooth = !st.smooth;
        const filter = st.smooth ? gl.LINEAR : gl.NEAREST;
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, filter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, filter);
      } else if (b.name === 'mode') {
        st.mode = st.mode === 'moveto' ? 'drag2d' : 'moveto';
        btn.style.setProperty('--col', st.mode === 'moveto' ? '-400px' : '-360px');
      } else if (b.name === 'fullscreen') {
        if (document.fullscreenElement) document.exitFullscreen();
        else frame.requestFullscreen?.();
      }
    });
  });
  document.addEventListener('fullscreenchange', () => {
    const fs = controls.querySelector('.pano-fullscreen');
    fs.style.setProperty('--col', document.fullscreenElement === frame ? '-320px' : '-280px');
  });

  // pointer: moveto (speed from the press offset) or drag2d (the image follows the pointer)
  canvas.addEventListener('pointerdown', (e) => {
    canvas.setPointerCapture(e.pointerId);
    st.drag = {
      x0: e.clientX, y0: e.clientY, x: e.clientX, y: e.clientY, dx: 0, dy: 0,
    };
  });
  canvas.addEventListener('pointermove', (e) => {
    if (!st.drag) return;
    if (st.mode === 'drag2d') {
      const [w, h] = size();
      const degPerPx = (window.devicePixelRatio || 1) / focal(w, h) / D2R;
      st.h -= (e.clientX - st.drag.x) * degPerPx;
      st.v -= (e.clientY - st.drag.y) * degPerPx;
    }
    st.drag.x = e.clientX;
    st.drag.y = e.clientY;
    st.drag.dx = e.clientX - st.drag.x0;
    st.drag.dy = e.clientY - st.drag.y0;
  });
  ['pointerup', 'pointercancel'].forEach((ev) => canvas.addEventListener(ev, () => {
    st.drag = null;
  }));

  new ResizeObserver(() => draw()).observe(box);
  // krpano renders (and autorotates) only while the viewer is on screen
  new IntersectionObserver((entries) => {
    st.visible = entries[entries.length - 1].isIntersecting;
  }).observe(box);
  requestAnimationFrame(tick);
  const start = () => upload().catch(() => box.remove());
  if (document.readyState === 'complete') start();
  else window.addEventListener('load', start, { once: true });
}
