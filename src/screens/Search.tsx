import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import * as DialogP from '@radix-ui/react-dialog'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import { useStore } from '@/store'
import { maskNik } from '@/data/clinic'
import { PatientLine } from '@/components/kit'

// Global patient search (⌘K): name, NIK, BPJS number or RM number.
export default function Search({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const { patients, visits, addLog, me } = useStore()
  const nav = useNavigate()
  const [q, setQ] = useState('')
  const rows = useMemo(() => {
    const s = q.trim().toLowerCase().replace(/[\s-]/g, '')
    if (s.length < 2) return patients.filter((p) => visits.some((v) => v.patientId === p.id && v.stage !== 'done' && v.stage !== 'booked')).slice(0, 6)
    return patients.filter((p) => p.name.toLowerCase().replace(/\s/g, '').includes(s) || p.nik.includes(s) || p.bpjs?.no.includes(s) || p.rm.toLowerCase().replace('-', '').includes(s)).slice(0, 8)
  }, [q, patients, visits])
  const go = (id: string, name: string) => { addLog({ who: me.name, verb: 'opened the record of', object: name, result: 'ok' }); onOpenChange(false); setQ(''); nav(`/patients/${id}`) }
  return (
    <DialogP.Root open={open} onOpenChange={onOpenChange}>
      <DialogP.Portal>
        <DialogP.Overlay className="fixed inset-0 z-40 bg-[#0b1412]/35" />
        <DialogP.Content className="fixed left-1/2 top-[12vh] z-50 w-[min(620px,calc(100vw-24px))] -translate-x-1/2 overflow-hidden rounded-[14px] border border-edge bg-sheet fd-in" aria-describedby={undefined}>
          <DialogP.Title className="sr-only">Find a patient</DialogP.Title>
          <label className="flex items-center gap-3 border-b border-rule px-4"><MagnifyingGlassIcon className="text-muted" /><input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, NIK, BPJS or RM number" className="h-12 flex-1 bg-transparent text-[15px] outline-none" /></label>
          <p className="px-4 pb-1 pt-3 text-[12px] text-muted">{q.length < 2 ? 'In the clinic now' : `${rows.length} found`}</p>
          <ul className="max-h-[50vh] overflow-y-auto pb-2">{rows.map((p) => <li key={p.id}><button onClick={() => go(p.id, p.name)} className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-left hover:bg-raised"><PatientLine p={p} /><span className="font-mono text-[12px] text-muted">{maskNik(p.nik)}</span></button></li>)}</ul>
        </DialogP.Content>
      </DialogP.Portal>
    </DialogP.Root>
  )
}
