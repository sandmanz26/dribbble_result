// Style spec for widgets the developer draws in code (egui painter), not from sprites.
import { CRT_SPEC, Crt } from '../panel/Crt.jsx'
import { M } from '../panel/materials.js'
import { VU_BALLISTICS } from '../panel/Plugin.jsx'

const rows = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) => (v && typeof v === 'object' ? rows(v, `${prefix}${k}.`) : [[`${prefix}${k}`, String(v)]]))

const RUST = `// Sketch for egui 0.2x. Check names against the egui version in the project.
use egui::{Color32, Painter, Pos2, Rect, Shape, Stroke};
use std::collections::VecDeque;

const BG: Color32 = Color32::from_rgb(0x0D, 0x0A, 0x07);
const TRACE: Color32 = Color32::from_rgb(0xFF, 0xB2, 0x5C);
const PERSISTENCE: f32 = 0.22; // share of the screen washed each frame
const KEEP: usize = 9;         // traces older than this are below 10%

/// Keep the last KEEP traces; egui redraws every frame, so persistence is
/// drawn from history instead of an accumulation buffer.
pub fn push_trace(history: &mut VecDeque<Vec<f32>>, samples: Vec<f32>) {
    history.push_front(samples);
    history.truncate(KEEP);
}

pub fn paint_scope(p: &Painter, rect: Rect, history: &VecDeque<Vec<f32>>) {
    p.rect_filled(rect, 10.0, BG);
    let minor = Color32::from_rgba_unmultiplied(255, 178, 92, 26);
    let major = Color32::from_rgba_unmultiplied(255, 178, 92, 46);
    for i in 1..10 {
        let x = rect.left() + rect.width() * i as f32 / 10.0;
        let c = if i == 5 { major } else { minor };
        p.line_segment([Pos2::new(x, rect.top()), Pos2::new(x, rect.bottom())], Stroke::new(1.0, c));
    }
    for i in 1..6 {
        let y = rect.top() + rect.height() * i as f32 / 6.0;
        let c = if i == 3 { major } else { minor };
        p.line_segment([Pos2::new(rect.left(), y), Pos2::new(rect.right(), y)], Stroke::new(1.0, c));
    }
    // Oldest first so the newest trace sits on top.
    for (age, trace) in history.iter().enumerate().rev() {
        let a = (1.0 - PERSISTENCE).powi(age as i32);
        let pts: Vec<Pos2> = trace.iter().enumerate().map(|(i, v)| {
            let x = rect.left() + rect.width() * i as f32 / (trace.len() - 1) as f32;
            let y = rect.center().y - (v * 1.6).clamp(-1.0, 1.0) * rect.height() * 0.42;
            Pos2::new(x, y)
        }).collect();
        let glow = Color32::from_rgba_unmultiplied(242, 98, 15, (89.0 * a) as u8);
        p.add(Shape::line(pts.clone(), Stroke::new(6.0, glow)));
        p.add(Shape::line(pts, Stroke::new(1.6, TRACE.gamma_multiply(a))));
    }
}`

export default function Widgets() {
  return (
    <section className="page wrap">
      <div className="page-head">
        <h1 className="h-lg">Code-drawn widgets</h1>
        <p className="lede">The scope, the value readout and the preset display are drawn in code, so they stay sharp at any scale and react every frame. These are the values the prototype runs.</p>
      </div>

      <div className="rule two">
        <div className="stack">
          <h2 className="h-md">Phosphor scope</h2>
          <p className="muted">Amber P3-style phosphor on a near-black tube. Two passes per trace: a wide orange glow, then the thin amber line. A pale core line only appears when the signal is hot.</p>
        </div>
        <div className="stack">
          <div className="scope-demo"><Crt read={null} wear="mint" label="Idle scope preview" /></div>
          <div className="tbl-wrap">
            <table>
              <thead><tr><th scope="col">Property</th><th scope="col">Value</th></tr></thead>
              <tbody>
                {rows(CRT_SPEC).map(([k, v]) => (
                  <tr key={k}><th scope="row" className="mono">{k}</th><td className="mono">{v}{/^#|rgba/.test(v) && <span className="swatch" style={{ background: v }} aria-hidden />}</td></tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="dash small">
            <li>Trigger on the first rising zero crossing so the trace holds still.</li>
            <li>Without signal, draw a slow sine at 1.5% amplitude so the tube never looks switched off.</li>
            <li>Glass, vignette and scanlines are a static overlay sprite or three draw calls on top; they never move.</li>
          </ul>
        </div>
      </div>

      <div className="rule two">
        <h2 className="h-md">egui sketch</h2>
        <pre className="code"><code>{RUST}</code></pre>
      </div>

      <div className="rule two">
        <h2 className="h-md">Value readout</h2>
        <div className="stack">
          <svg viewBox="-80 -20 160 40" width="240" role="img" aria-label="Readout example showing 14.2 dB">
            <rect x={-80} y={-20} width={160} height={40} fill={M.enamel} />
            <rect x={-38} y={-11} width={76} height={22} rx={2} fill={M.ink} />
            <text y={4} textAnchor="middle" className="mono-svg" fontSize={11} fill={M.cream}>14.2 dB</text>
          </svg>
          <ul className="dash">
            <li>Shown only while a control is dragged, 30 px above the knob edge. Hidden on release with no fade.</li>
            <li>Martian Mono 11 px, weight 500, width 85. Ink <code>#17140F</code> plate, cream <code>#EEE6D3</code> text, 2 px radius, 7 px side padding, minimum width 54 px.</li>
            <li>Units per control: dB, Hz or kHz above 1000, ms, bit, divisions, percent. One decimal for dB and Hz under 10, none elsewhere.</li>
          </ul>
        </div>
      </div>

      <div className="rule two">
        <h2 className="h-md">Preset display</h2>
        <ul className="dash">
          <li>Black tube glass <code>#0B0806</code>, 1 px <code>#5E5A52</code> border, number in signal orange, name in cream uppercase Martian Mono, letter spacing 0.04 em.</li>
          <li>An asterisk after the name means the sound differs from the stored preset.</li>
          <li>Arrows step through presets; the name opens a list with a one-line description of each. Up and Down move, Enter loads, Escape closes.</li>
        </ul>
      </div>

      <div className="rule two">
        <h2 className="h-md">Meter mapping</h2>
        <ul className="dash">
          <li>Needle position from level: <code>pos = (10^(dB/20) - 10^(-1)) / (10^(3/20) - 10^(-1))</code>, where dB is VU, so the scale bunches up at the bottom like a real VU face.</li>
          <li>Reference: 0 VU = {VU_BALLISTICS.refDbfs} dBFS RMS. Ballistics: damping {VU_BALLISTICS.zeta}, natural frequency {VU_BALLISTICS.omega} rad/s.</li>
          <li>Peak LED: sample peak above {VU_BALLISTICS.peakDbfs} dBFS, hold {VU_BALLISTICS.peakHoldMs} ms.</li>
        </ul>
      </div>
    </section>
  )
}
