import { useEffect, useState } from 'react'
import { patientOf, useStore } from '@/store'
import { CLINIC, POLI, staff, type Poli } from '@/data/clinic'
import { Logo } from '@/App'

// The waiting-room screen: who is being called, where, and what is next. First names only, for privacy.
export default function Display() {
  const { visits, patients } = useStore()
  const [now, setNow] = useState(new Date())
  useEffect(() => { const t = setInterval(() => setNow(new Date()), 15000); return () => clearInterval(t) }, [])
  const first = (pid: string) => patientOf(patients, pid).name.split(' ')[0]
  return (
    <div className="grid min-h-full grid-rows-[auto_1fr_auto] bg-[#0b1412] p-8 text-white">
      <header className="flex items-center justify-between"><span className="flex items-center gap-3"><Logo size={36} /><span className="text-[22px] font-semibold">{CLINIC.name}</span></span><span className="tnum text-[40px] font-medium">{now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span></header>
      <div className="grid gap-6 py-10 lg:grid-cols-3">
        {(Object.keys(POLI) as Poli[]).map((p) => {
          const inRoom = visits.find((v) => v.poli === p && v.stage === 'consult')
          const next = visits.filter((v) => v.poli === p && v.stage === 'doctor_queue').sort((a, b) => b.stageMin - a.stageMin).slice(0, 3)
          return (
            <section key={p} className="grid content-start gap-5 rounded-[18px] bg-white/[0.06] p-7">
              <h2 className="text-[20px] text-white/70">{POLI[p].name} clinic</h2>
              <div><p className="text-[15px] text-white/60">Now being seen</p><p className="tnum mt-1 text-[96px] font-semibold leading-none tracking-[-0.04em]">{inRoom?.no ?? '-'}</p><p className="mt-2 text-[22px]">{inRoom ? `${first(inRoom.patientId)} · ${staff(inRoom.doctorId).name}` : 'Room free'}</p></div>
              <div><p className="text-[15px] text-white/60">Next</p><ul className="mt-2 grid gap-2">{next.length ? next.map((v) => <li key={v.id} className="flex items-baseline gap-4 text-[26px]"><span className="tnum font-semibold">{v.no}</span><span className="text-white/75">{first(v.patientId)}</span></li>) : <li className="text-[20px] text-white/50">Nobody waiting</li>}</ul></div>
            </section>
          )
        })}
      </div>
      <p className="text-center text-[16px] text-white/55">Book your queue number on Mobile JKN. Demo screen with synthetic data.</p>
    </div>
  )
}
