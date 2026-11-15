import { createContext, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Music2, Pause, Volume2, VolumeX } from "lucide-react";

const PREVIEW = "https://audio-ssl.itunes.apple.com/itunes-assets/AudioPreview211/v4/71/5d/31/715d3169-5fba-a0b7-da24-2aefc83796cf/mzaf_8089500935177582820.plus.aac.p.m4a";

type Music = { start: () => void; toggle: () => void; playing: boolean; bass: () => number; time: () => number; seek: (t: number) => void };
const Ctx = createContext<Music>({ start: () => {}, toggle: () => {}, playing: false, bass: () => 0, time: () => 0, seek: () => {} });
export const useMusic = () => useContext(Ctx);

export function MusicProvider({ children }: { children: ReactNode }) {
  const audio = useRef<HTMLAudioElement>(null);
  const [shown, setShown] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(() => { try { return Number(localStorage.getItem("volume") ?? 0.5); } catch { return 0.5; } });
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (audio.current) { audio.current.volume = volume; audio.current.muted = muted; }
    try { localStorage.setItem("volume", String(volume)); } catch {}
  }, [volume, muted]);

  const analyser = useRef<AnalyserNode | null>(null);
  const bins = useRef<Uint8Array<ArrayBuffer> | null>(null);
  const listen = () => {
    const a = audio.current;
    if (!a || analyser.current) return;
    try {
      const ctx = new AudioContext();
      const node = ctx.createAnalyser();
      node.fftSize = 256;
      node.smoothingTimeConstant = 0.8;
      ctx.createMediaElementSource(a).connect(node);
      node.connect(ctx.destination);
      analyser.current = node;
      bins.current = new Uint8Array(node.frequencyBinCount);
    } catch {}
  };
  const bass = () => {
    const n = analyser.current, b = bins.current;
    if (!n || !b) return 0;
    n.getByteFrequencyData(b);
    let sum = 0;
    for (let i = 1; i < 9; i++) sum += b[i];
    return sum / (8 * 255);
  };

  const start = () => {
    const a = audio.current;
    if (!a) return;
    listen();
    setShown(true);
    if (a.paused) a.play().catch(() => setPlaying(false));
  };
  const toggle = () => { const a = audio.current; if (!a) return; if (a.paused) start(); else a.pause(); };
  const level = muted ? 0 : volume;
  const VolIcon = level === 0 ? VolumeX : Volume2;

  return (
    <Ctx.Provider value={{ start, toggle, playing, bass, time: () => audio.current?.currentTime ?? 0, seek: t => { const a = audio.current; if (a) { a.currentTime = t; if (a.paused) start(); } } }}>
      {children}
      <audio ref={audio} src={PREVIEW} loop preload="none" crossOrigin="anonymous"
        onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} />

      <AnimatePresence>
        {shown && (
          <motion.aside className="music-dock" aria-label="Background music player"
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}>
            <div className="music-controls">
              <button type="button" className="music-btn" onClick={() => setMuted(m => !m)} aria-label={level === 0 ? "Unmute music" : "Mute music"}>
                <VolIcon aria-hidden />
              </button>
              <input type="range" className="music-volume" min={0} max={1} step={0.01} value={level} aria-label="Music volume"
                onChange={e => { setMuted(false); setVolume(+e.target.value); }} style={{ "--fill": `${level * 100}%` } as React.CSSProperties} />
              <button type="button" className={`music-btn${playing ? " active" : ""}`} onClick={toggle} aria-label={playing ? "Pause music" : "Play music"} aria-pressed={playing}>
                {playing ? <Pause aria-hidden /> : <Music2 aria-hidden />}
              </button>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>
    </Ctx.Provider>
  );
}
