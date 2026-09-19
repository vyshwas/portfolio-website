import Matter from "matter-js";
import gsap from "gsap";
export function createPrinciplePhysics(container) {
  const { Engine, Bodies, Body, Composite, Constraint, Query } = Matter;
  const engine = Engine.create({ gravity: { x: 0, y: 0.7 } });
  const canvas = document.createElement("canvas"),
    ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Canvas rendering unavailable");
  canvas.className = "physics-canvas";
  container.appendChild(canvas);
  const styles = getComputedStyle(container);
  const colors = {
    ink: styles.getPropertyValue("--ink").trim(),
    paper: styles.getPropertyValue("--paper").trim(),
    accent: styles.getPropertyValue("--accent").trim(),
    rule: styles.getPropertyValue("--rule").trim(),
  };
  const labels = ["Curiosity", "Clarity", "Craft", "Trust", "Play"];
  let bodies = [],
    width = 0,
    height = 0,
    running = false,
    visible = false,
    disposed = false,
    drag = null;
  const reset = () => {
    width = container.clientWidth;
    height = container.clientHeight;
    const ratio = Math.min(devicePixelRatio, 2);
    canvas.width = width * ratio;
    canvas.height = height * ratio;
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    Composite.clear(engine.world, false);
    drag = null;
    bodies = labels.map((label, i) => {
      const w = label.length * 13 + 40;
      const body = Bodies.rectangle(
        width * 0.5 + (i % 2 ? 30 : -30),
        45 + i * 39,
        w,
        54,
        { chamfer: { radius: 20 }, restitution: 0.55, friction: 0.1 },
      );
      body.label = label;
      body.chipWidth = w;
      return body;
    });
    Composite.add(engine.world, [
      ...bodies,
      Bodies.rectangle(width / 2, height + 25, width + 100, 50, {
        isStatic: true,
      }),
      Bodies.rectangle(-25, height / 2, 50, height * 3, { isStatic: true }),
      Bodies.rectangle(width + 25, height / 2, 50, height * 3, {
        isStatic: true,
      }),
    ]);
  };
  const draw = (_time, delta) => {
    Engine.update(engine, Math.min(delta, 1000 / 30));
    ctx.clearRect(0, 0, width, height);
    bodies.forEach((body, i) => {
      ctx.save();
      ctx.translate(body.position.x, body.position.y);
      ctx.rotate(body.angle);
      ctx.beginPath();
      ctx.roundRect(-body.chipWidth / 2, -27, body.chipWidth, 54, 26);
      ctx.fillStyle = i === 2 ? colors.accent : colors.paper;
      ctx.fill();
      ctx.strokeStyle = colors.rule;
      ctx.stroke();
      ctx.font = "500 19px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillStyle = i === 2 ? colors.paper : colors.ink;
      ctx.fillText(body.label, 0, 1);
      ctx.restore();
      if (body.position.y > height + 150)
        Body.setPosition(body, { x: width / 2, y: 20 });
    });
  };
  const sync = () => {
    const run = visible && !document.hidden && !disposed;
    if (run && !running) {
      gsap.ticker.add(draw);
      running = true;
    } else if (!run && running) {
      gsap.ticker.remove(draw);
      running = false;
    }
  };
  const observer = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    sync();
  });
  observer.observe(container);
  const resize = new ResizeObserver(reset);
  resize.observe(container);
  reset();
  const position = (e) => {
    const r = canvas.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const down = (e) => {
    if (e.pointerType !== "mouse") return;
    const p = position(e),
      body = Query.point(bodies, p)[0];
    if (!body) return;
    drag = Constraint.create({
      pointA: p,
      bodyB: body,
      pointB: { x: 0, y: 0 },
      stiffness: 0.1,
      length: 0,
    });
    Composite.add(engine.world, drag);
    canvas.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    if (drag) drag.pointA = position(e);
  };
  const up = () => {
    if (drag) {
      Composite.remove(engine.world, drag);
      drag = null;
    }
  };
  canvas.addEventListener("pointerdown", down);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", up);
  canvas.addEventListener("pointercancel", up);
  document.addEventListener("visibilitychange", sync);
  return {
    shuffle: () => {
      bodies.forEach((body, i) => {
        Body.setVelocity(body, { x: (i - 2) * 2, y: -9 - i });
        Body.setAngularVelocity(body, i % 2 ? 0.05 : -0.05);
      });
    },
    dispose: () => {
      disposed = true;
      sync();
      observer.disconnect();
      resize.disconnect();
      document.removeEventListener("visibilitychange", sync);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
      canvas.removeEventListener("pointercancel", up);
      Composite.clear(engine.world, false);
      Engine.clear(engine);
      canvas.remove();
    },
  };
}
