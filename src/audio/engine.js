// Web Audio engine for the prototype. A synthesised two-bar loop runs through the same signal
// path the plugin describes: drive > tone > crush > filter > wobble > echo > mix > output.
// Nothing leaves the browser.
import { DEFAULTS } from '../data/controls.js'

const BPM = 94
const LOOKAHEAD = 0.12

const CRUSHER = `
class Crusher extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: 'bits', defaultValue: 16, minValue: 1, maxValue: 16 },
      { name: 'hold', defaultValue: 1, minValue: 1, maxValue: 64 },
    ]
  }
  constructor() { super(); this.ph = [0, 0]; this.last = [0, 0] }
  process(inputs, outputs, p) {
    const input = inputs[0], output = outputs[0]
    for (let c = 0; c < output.length; c++) {
      const i = input[c], o = output[c]
      if (!i) { o.fill(0); continue }
      for (let n = 0; n < o.length; n++) {
        const bits = p.bits.length > 1 ? p.bits[n] : p.bits[0]
        const hold = p.hold.length > 1 ? p.hold[n] : p.hold[0]
        const step = Math.pow(0.5, Math.max(1, bits) - 1)
        if (++this.ph[c] >= hold) { this.ph[c] = 0; this.last[c] = step * Math.round(i[n] / step) }
        o[n] = this.last[c]
      }
    }
    return true
  }
}
registerProcessor('crusher', Crusher)
`

const freqFor = (v) => 80 * Math.pow(200, v)
const bitsFor = (v) => 2 + v * 14
const holdFor = (v) => 1 + v * 31
const timeFor = (v) => 0.03 + v * 0.77
const speedFor = (v) => 0.1 * Math.pow(80, v)
const dbToGain = (db) => Math.pow(10, db / 20)

function driveCurve(v) {
  const k = 1 + v * 40
  const n = 1024
  const c = new Float32Array(n)
  const norm = Math.tanh(k)
  for (let i = 0; i < n; i++) {
    const x = (i / (n - 1)) * 2 - 1
    c[i] = Math.tanh(k * x) / norm
  }
  return c
}

export function createEngine() {
  let ctx = null
  let g = null
  let timer = null
  let params = { ...DEFAULTS }
  let steps = Array(16).fill(1)
  let cables = []
  let held = new Set()
  let drumNext = 0
  let drumIdx = 0
  let seqNext = 0
  let seqIdx = 0
  const seqQueue = []
  const timeBuf = new Float32Array(2048)

  async function build() {
    ctx = new (window.AudioContext || window.webkitAudioContext)()
    const url = URL.createObjectURL(new Blob([CRUSHER], { type: 'application/javascript' }))
    await ctx.audioWorklet.addModule(url)
    URL.revokeObjectURL(url)

    const noise = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate)
    const nd = noise.getChannelData(0)
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1

    const n = {
      noise,
      input: ctx.createGain(),
      pre: ctx.createGain(),
      shaper: ctx.createWaveShaper(),
      low: ctx.createBiquadFilter(),
      high: ctx.createBiquadFilter(),
      crush: new AudioWorkletNode(ctx, 'crusher', { outputChannelCount: [2] }),
      filter: ctx.createBiquadFilter(),
      wob: ctx.createDelay(0.05),
      lfo: ctx.createOscillator(),
      lfoDepth: ctx.createGain(),
      gate: ctx.createGain(),
      echoIn: ctx.createGain(),
      echo: ctx.createDelay(1.5),
      echoTone: ctx.createBiquadFilter(),
      fb: ctx.createGain(),
      echoOut: ctx.createGain(),
      wet: ctx.createGain(),
      dry: ctx.createGain(),
      sum: ctx.createGain(),
      out: ctx.createGain(),
      analyser: ctx.createAnalyser(),
      lfoPatch: {},
    }
    n.shaper.oversample = '4x'
    n.low.type = 'lowshelf'
    n.low.frequency.value = 220
    n.high.type = 'highshelf'
    n.high.frequency.value = 3200
    n.filter.type = 'lowpass'
    n.wob.delayTime.value = 0.006
    n.lfo.connect(n.lfoDepth).connect(n.wob.delayTime)
    n.lfo.start()
    n.echoTone.type = 'lowpass'
    n.echoTone.frequency.value = 3200
    n.analyser.fftSize = 2048
    n.analyser.smoothingTimeConstant = 0

    n.input.connect(n.pre).connect(n.shaper).connect(n.low).connect(n.high).connect(n.crush).connect(n.filter).connect(n.wob).connect(n.gate)
    n.gate.connect(n.wet)
    n.gate.connect(n.echoIn).connect(n.echo).connect(n.echoTone).connect(n.fb).connect(n.echo)
    n.echoTone.connect(n.echoOut).connect(n.wet)
    n.input.connect(n.dry)
    n.wet.connect(n.sum)
    n.dry.connect(n.sum)
    n.sum.connect(n.out).connect(n.analyser).connect(ctx.destination)
    g = n
    applyAll()
    applyCables()
  }

  const now = () => ctx.currentTime
  const ramp = (param, value, t = 0.02) => param.setTargetAtTime(value, now(), t)

  function base() {
    return {
      cutoff: freqFor(params.cutoff),
      bits: bitsFor(params.bits),
      time: timeFor(params.time),
    }
  }

  function applyAll() {
    if (!g) return
    const p = params
    g.pre.gain.value = 1 + p.drive * 1.5
    g.shaper.curve = driveCurve(p.drive)
    ramp(g.low.gain, (0.5 - p.tone) * 24)
    ramp(g.high.gain, (p.tone - 0.5) * 24)
    g.crush.parameters.get('bits').setTargetAtTime(held.has('starve') ? 4 : bitsFor(p.bits), now(), 0.02)
    g.crush.parameters.get('hold').setTargetAtTime(held.has('starve') ? 40 : holdFor(p.rate), now(), 0.02)
    ramp(g.filter.frequency, held.has('starve') ? 600 : freqFor(p.cutoff))
    ramp(g.filter.Q, 0.5 + p.reso * 18)
    ramp(g.lfoDepth.gain, held.has('chaos') ? 0.012 : p.depth * 0.005)
    ramp(g.lfo.frequency, held.has('chaos') ? 9 : speedFor(p.speed))
    ramp(g.echo.delayTime, timeFor(p.time), 0.08)
    ramp(g.fb.gain, held.has('freeze') ? 1 : held.has('chaos') ? 0.88 : p.feedback * 0.9)
    ramp(g.echoIn.gain, held.has('freeze') ? 0 : 1)
    const bypass = p.bypass >= 0.5
    const mix = bypass ? 0 : p.mix
    ramp(g.wet.gain, Math.sin((mix * Math.PI) / 2))
    ramp(g.dry.gain, Math.cos((mix * Math.PI) / 2))
    ramp(g.out.gain, dbToGain((p.output - 0.7) * 30) * 0.2)
  }

  // Wobble LFO patched into another parameter through the hatch.
  function applyCables() {
    if (!g) return
    for (const k of Object.keys(g.lfoPatch)) {
      g.lfoPatch[k].disconnect()
      delete g.lfoPatch[k]
    }
    for (const [from, to] of cables) {
      if (from !== 'o-lfo') continue
      const amt = ctx.createGain()
      const target = { 'i-cutoff': g.filter.frequency, 'i-time': g.echo.delayTime, 'i-bits': g.crush.parameters.get('bits') }[to]
      amt.gain.value = { 'i-cutoff': 1800, 'i-time': 0.03, 'i-bits': 5 }[to]
      g.lfo.connect(amt).connect(target)
      g.lfoPatch[to] = amt
    }
  }

  function trigger(type, t, bar) {
    const out = g.input
    if (type === 'kick') {
      const o = ctx.createOscillator()
      const e = ctx.createGain()
      o.frequency.setValueAtTime(150, t)
      o.frequency.exponentialRampToValueAtTime(42, t + 0.14)
      e.gain.setValueAtTime(0.9, t)
      e.gain.exponentialRampToValueAtTime(0.001, t + 0.38)
      o.connect(e).connect(out)
      o.start(t)
      o.stop(t + 0.4)
    } else if (type === 'snare' || type === 'hat') {
      const s = ctx.createBufferSource()
      s.buffer = g.noise
      const f = ctx.createBiquadFilter()
      f.type = 'highpass'
      f.frequency.value = type === 'snare' ? 1400 : 7500
      const e = ctx.createGain()
      const len = type === 'snare' ? 0.18 : 0.04
      e.gain.setValueAtTime(type === 'snare' ? 0.5 : 0.18, t)
      e.gain.exponentialRampToValueAtTime(0.001, t + len)
      s.connect(f).connect(e).connect(out)
      s.start(t, Math.random() * 0.5)
      s.stop(t + len + 0.02)
    } else if (type === 'bass') {
      const o = ctx.createOscillator()
      o.type = 'triangle'
      o.frequency.value = bar ? 43.65 : 55
      const e = ctx.createGain()
      e.gain.setValueAtTime(0.45, t)
      e.gain.exponentialRampToValueAtTime(0.001, t + 0.3)
      o.connect(e).connect(out)
      o.start(t)
      o.stop(t + 0.32)
    } else if (type === 'chord') {
      const notes = bar ? [174.61, 220, 261.63, 329.63] : [220, 261.63, 329.63, 392]
      const f = ctx.createBiquadFilter()
      f.type = 'lowpass'
      f.frequency.setValueAtTime(2400, t)
      f.frequency.exponentialRampToValueAtTime(500, t + 0.6)
      const e = ctx.createGain()
      e.gain.setValueAtTime(0.0001, t)
      e.gain.exponentialRampToValueAtTime(0.11, t + 0.01)
      e.gain.exponentialRampToValueAtTime(0.001, t + 0.7)
      f.connect(e).connect(out)
      for (const hz of notes) {
        const o = ctx.createOscillator()
        o.type = 'sawtooth'
        o.frequency.value = hz
        o.detune.value = (Math.random() - 0.5) * 14
        o.connect(f)
        o.start(t)
        o.stop(t + 0.72)
      }
    }
  }

  function drumStep(i, t) {
    const pos = i % 16
    const bar = Math.floor(i / 16) % 2
    if ([0, 6, 8, 11].includes(pos)) trigger('kick', t)
    if (pos === 4 || pos === 12) trigger('snare', t)
    if (pos % 2 === 0) trigger('hat', t)
    if ([0, 3, 8, 11].includes(pos)) trigger('bass', t, bar)
    if (pos === 0 || pos === 10) trigger('chord', t, bar)
  }

  function seqStep(i, t) {
    const sv = steps[i % 16]
    const a = params.amount
    const b = base()
    const target = ['cutoff', 'bits', 'gate', 'time'][params.target]
    const patched = (inJack) => cables.some(([f, to]) => f === 'o-seq' && to === inJack)
    const noisy = (inJack) => cables.some(([f, to]) => f === 'o-noise' && to === inJack)
    const spit = held.has('spit')
    if (held.has('starve')) return
    if (target === 'cutoff' || patched('i-cutoff') || noisy('i-cutoff')) {
      let f = b.cutoff
      if (target === 'cutoff' || patched('i-cutoff')) f = 80 * Math.pow(200, params.cutoff * (1 - a * (1 - sv)))
      if (noisy('i-cutoff')) f *= 0.4 + Math.random() * 1.6
      g.filter.frequency.setTargetAtTime(f, t, 0.008)
    }
    if (target === 'bits' || patched('i-bits') || noisy('i-bits')) {
      let bits = b.bits
      if (target === 'bits' || patched('i-bits')) bits = Math.max(2, b.bits - a * (1 - sv) * 12)
      if (noisy('i-bits')) bits = Math.max(2, bits - Math.random() * 8)
      g.crush.parameters.get('bits').setValueAtTime(bits, t)
    }
    if (target === 'time' || patched('i-time') || noisy('i-time')) {
      let d = b.time
      if (target === 'time' || patched('i-time')) d = b.time * (1 + a * (sv - 0.5))
      if (noisy('i-time')) d *= 0.8 + Math.random() * 0.4
      g.echo.delayTime.setTargetAtTime(Math.max(0.01, d), t, 0.03)
    }
    const gate = target === 'gate' ? 1 - a * (1 - sv) : 1
    g.gate.gain.setTargetAtTime(spit ? (Math.random() < 0.5 ? 0 : 1) : gate, t, 0.004)
    seqQueue.push({ i: i % 16, t })
    if (seqQueue.length > 64) seqQueue.splice(0, 32)
  }

  function tick() {
    const sixteenth = 60 / BPM / 4
    while (drumNext < now() + LOOKAHEAD) {
      drumStep(drumIdx, drumNext)
      drumIdx = (drumIdx + 1) % 32
      drumNext += sixteenth
    }
    const per = [2, 4, 8][params.division] || 4
    const stepDur = 60 / BPM / per
    while (seqNext < now() + LOOKAHEAD) {
      const swing = seqIdx % 2 === 1 ? params.swing * 0.5 * stepDur : 0
      seqStep(seqIdx, seqNext + swing)
      seqIdx = (seqIdx + 1) % 16
      seqNext += stepDur
    }
  }

  return {
    get running() {
      return Boolean(timer)
    },
    async start() {
      if (!ctx) await build()
      await ctx.resume()
      drumNext = seqNext = now() + 0.06
      drumIdx = seqIdx = 0
      timer = setInterval(tick, 25)
    },
    stop() {
      clearInterval(timer)
      timer = null
      ctx?.suspend()
    },
    set(next) {
      params = { ...params, ...next }
      applyAll()
    },
    setSteps(next) {
      steps = next
    },
    setCables(next) {
      cables = next
      applyCables()
    },
    hold(id, on) {
      if (on) held.add(id)
      else held.delete(id)
      applyAll()
    },
    currentStep() {
      if (!ctx || !timer) return -1
      let cur = -1
      for (const q of seqQueue) if (q.t <= now()) cur = q.i
      return cur
    },
    // Time-domain samples for the scope and RMS for the meter, both post-output.
    read() {
      if (!g) return null
      g.analyser.getFloatTimeDomainData(timeBuf)
      let sum = 0
      let peak = 0
      for (let i = 0; i < timeBuf.length; i++) {
        sum += timeBuf[i] * timeBuf[i]
        peak = Math.max(peak, Math.abs(timeBuf[i]))
      }
      return { samples: timeBuf, rms: Math.sqrt(sum / timeBuf.length), peak }
    },
  }
}
