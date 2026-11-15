import { useRef, type ReactNode, type PointerEvent } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";

export function Tablet({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "start 0.15"] });
  const lift = useSpring(scrollYProgress, { stiffness: 90, damping: 24, mass: 0.6 });
  const baseX = useTransform(lift, [0, 1], [26, 0]);
  const scale = useTransform(lift, [0, 1], [0.9, 1]);
  const y = useTransform(lift, [0, 1], [-30, 0]);

  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const tiltY = useSpring(useTransform(px, [-0.5, 0.5], [-7, 7]), { stiffness: 120, damping: 18 });
  const tiltX = useSpring(useTransform(py, [-0.5, 0.5], [4, -4]), { stiffness: 120, damping: 18 });
  const rotateX = useTransform(() => baseX.get() + tiltX.get());

  
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { px.set(0); py.set(0); };

  return (
    <div ref={ref} onPointerMove={onMove} onPointerLeave={onLeave} className="relative [perspective:2200px]">
      <motion.div
        animate={reduce ? undefined : { y: [0, -10, 0] }}
        transition={{ duration: 7, ease: "easeInOut", repeat: Infinity }}
        style={{ transformStyle: "preserve-3d" }}
      >
      <motion.div
        style={reduce ? undefined : { rotateX, rotateY: tiltY, scale, y, transformStyle: "preserve-3d" }}
        className="relative will-change-transform"
      >
        {!reduce && Array.from({ length: 7 }, (_, i) => (
          <div key={i} aria-hidden className="absolute inset-0 rounded-[clamp(22px,3.4vw,40px)]"
            style={{ transform: `translateZ(${-(i + 1) * 2.2}px)`, background: i === 6 ? "#040405" : `hsl(240 5% ${6 - i * 0.5}%)` }} />
        ))}

        <div className="relative rounded-[clamp(22px,3.4vw,40px)] bg-[#0d0d10] p-[clamp(8px,1.3vw,16px)] shadow-[inset_0_0_0_1px_rgb(255_255_255/.09),inset_0_1px_0_rgb(255_255_255/.16)]">
          <span aria-hidden className="absolute top-[clamp(3px,.55vw,7px)] left-1/2 size-[5px] -translate-x-1/2 rounded-full bg-[#1d1d24] ring-1 ring-white/5" />
          <div className="relative h-[clamp(460px,52vw,620px)] overflow-hidden rounded-[clamp(14px,2.1vw,26px)] ring-1 ring-black">
            {children}
          </div>
        </div>
      </motion.div>
      </motion.div>

    </div>
  );
}
