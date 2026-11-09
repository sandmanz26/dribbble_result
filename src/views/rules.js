import { S, update, emp, today } from '../store.js'
import { EXIT_TYPES, MERGE_FIELDS } from '../data.js'
import { esc, fdate, on, toast, modal, modalHead, merge } from '../ui.js'
import { settlement } from '../severance.js'
import { vars } from './create.js'
import { letterPreview } from './case.js'

const TABS = [['exit', 'Exit rules'], ['templates', 'Email templates'], ['documents', 'Documents'], ['checklist', 'Clearance checklist']]
const typeLabel = (t) => EXIT_TYPES.find((x) => x.id === t)?.label || t
const APPROVERS = ['HRBP', 'Line manager', 'Head of People & Culture', 'Legal', 'Procurement', 'Director']
const FORMULA = {
  resign: 'Leave payout + separation pay (PKB)',
  layoff: '1 × severance + 1 × UPMK + leave (0.5 if due to loss)',
  termination: 'Separation pay + leave; 0.5 severance after SP3',
  contract: 'Compensation: months worked / 12 × wage',
  mutual: 'Negotiated; layoff formula as baseline',
  retire: '1.75 × severance + 1 × UPMK + leave',
  vendor: 'Paid by the vendor',
}

export function render({ params }) {
  const tab = TABS.some(([k]) => k === params.tab) ? params.tab : 'exit'
  return {
    title: 'Rules & documents',
    html: `
  <div class="rise">
    <div class="mb-5">
      <h1 class="text-2xl sm:text-[28px] font-semibold tracking-[-0.02em]">Rules & documents</h1>
      <p class="text-sm text-muted mt-1">What every new case follows. Changes apply to new cases; open cases keep what they were created with.</p>
    </div>
    <nav class="flex gap-1 overflow-x-auto pb-1 -mx-4 px-4 sm:mx-0 sm:px-0" aria-label="Sections">
      ${TABS.map(([k, l]) => `<a href="#/rules/${k}" class="tab" ${k === tab ? 'aria-current="page"' : ''}>${l}</a>`).join('')}
    </nav>
    <div id="body" class="mt-4"></div>
  </div>`,
    mount(root, ctx) {
      const $ = (q) => root.querySelector(q)
      const redraw = (msg) => { if (msg) toast(msg); ctx.keepScroll = true; ctx.rerender() }
      const st = S()

      if (tab === 'exit') {
        $('#body').innerHTML = `
        <div class="card overflow-x-auto">
          <table class="w-full text-sm min-w-[880px]">
            <thead class="text-xs text-muted text-left border-b border-line"><tr>
              <th class="font-medium px-5 py-3">Exit type</th><th class="font-medium px-3 py-3">Notice</th><th class="font-medium px-3 py-3">Reply in</th><th class="font-medium px-3 py-3">Settlement</th><th class="font-medium px-3 py-3">Default email</th><th class="font-medium px-3 py-3">Approvals</th><th class="px-5 py-3"></th></tr></thead>
            <tbody class="divide-y divide-line">
              ${st.rules.map((r, i) => `<tr>
                <td class="px-5 py-3.5"><p class="font-medium">${esc(typeLabel(r.type))}</p><p class="text-xs text-muted">${EXIT_TYPES.find((t) => t.id === r.type).for === 'external' ? 'External' : 'Internal'} · ${st.documents.filter((d) => d.types.includes(r.type)).length} documents</p></td>
                <td class="px-3 py-3.5 num">${r.noticeDays} days</td>
                <td class="px-3 py-3.5 num">${r.responseDays} days</td>
                <td class="px-3 py-3.5 text-muted max-w-[220px]">${esc(FORMULA[r.formula])}</td>
                <td class="px-3 py-3.5">${esc(st.templates.find((t) => t.id === r.template)?.name || '-')}</td>
                <td class="px-3 py-3.5 text-muted">${r.approvals.length} steps</td>
                <td class="px-5 py-3.5 text-right"><button data-i="${i}" class="edit btn btn-sm"><span class="icon-[majesticons--edit-pen-2-line] size-4"></span>Edit</button></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="text-xs text-muted mt-3">Settlement formulas follow PP 35/2021 and are not editable here. Separation pay (uang pisah) follows the PKB: one month of wages per full three years, up to three months.</p>`
        on(root, '.edit', 'click', (ev, el) => {
          const r = st.rules[+el.dataset.i]
          modal(`${modalHead('Edit rule: ' + esc(typeLabel(r.type)))}
          <form class="p-5 space-y-4 overflow-auto">
            <div class="grid grid-cols-2 gap-3">
              <div><label class="label" for="nd">Default notice (days)</label><input id="nd" name="nd" type="number" min="0" class="field num" value="${r.noticeDays}" /></div>
              <div><label class="label" for="rd">Response window (days)</label><input id="rd" name="rd" type="number" min="0" class="field num" value="${r.responseDays}" /></div>
            </div>
            <div><label class="label" for="tp">Default email template</label><select id="tp" name="tp" class="field">${st.templates.map((t) => `<option value="${t.id}" ${t.id === r.template ? 'selected' : ''}>${esc(t.name)}${t.status === 'draft' ? ' (draft)' : ''}</option>`).join('')}</select></div>
            <fieldset><legend class="label">Approval chain, in order</legend><div class="grid grid-cols-2 gap-2">${APPROVERS.map((a) => `<label class="flex items-center gap-2 text-sm"><input type="checkbox" name="ap" value="${a}" class="size-4 accent-[var(--color-accent)]" ${r.approvals.includes(a) ? 'checked' : ''} />${a}</label>`).join('')}</div></fieldset>
            <div><label class="label" for="nt">Guidance shown when creating a case</label><textarea id="nt" name="nt" rows="3" class="field">${esc(r.note)}</textarea></div>
            <div class="flex justify-end gap-2"><button type="button" class="btn" data-close>Cancel</button><button class="btn btn-primary">Save rule</button></div>
          </form>`, {
            onMount(dlg) {
              dlg.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault()
                const fd = new FormData(e.target)
                const ap = fd.getAll('ap')
                if (!ap.length) { toast('Keep at least one approver', 'warn'); return }
                update(() => { r.noticeDays = +fd.get('nd'); r.responseDays = +fd.get('rd'); r.template = fd.get('tp'); r.approvals = APPROVERS.filter((a) => ap.includes(a)); r.note = fd.get('nt') })
                dlg.close(); redraw('Rule saved')
              })
            },
          })
        })
      }

      if (tab === 'templates') {
        let cur = st.templates.find((t) => t.id === ctx.query.t) || st.templates[0]
        const sample = emp('ADN-1903-0142')
        const draw = () => {
          const sv = vars(sample, { lastDay: '2026-11-20', deadline: '2026-11-13', owner: 'Yudha Pratama' }, settlement(sample, { type: 'resign', lastDay: '2026-11-20' }))
          $('#body').innerHTML = `
          <div class="grid grid-cols-1 lg:grid-cols-[300px_minmax(0,1fr)] gap-4 items-start">
            <div class="card">
              <div class="p-3 border-b border-line"><button id="newT" class="btn btn-sm w-full"><span class="icon-[majesticons--plus-line] size-4"></span>New template</button></div>
              <ul class="p-1.5 max-h-[640px] overflow-auto">
                ${st.templates.map((t) => `<li><button data-id="${t.id}" class="pick w-full text-left rounded-xl px-3 py-2.5 ${t.id === cur.id ? 'bg-accent-soft' : 'hover:bg-sunk'}">
                  <span class="flex items-center justify-between gap-2"><span class="text-sm font-medium truncate">${esc(t.name)}</span>${t.status === 'draft' ? '<span class="text-[11px] px-1.5 rounded bg-sunk border border-line text-muted">Draft</span>' : ''}</span>
                  <span class="block text-xs text-muted truncate mt-0.5">${t.types.length ? t.types.map(typeLabel).join(', ') : 'Any exit'} · ${fdate(t.updated)}</span></button></li>`).join('')}
              </ul>
            </div>
            <form id="tf" class="card min-w-0">
              <div class="p-5 grid sm:grid-cols-[1fr_160px] gap-3 border-b border-line">
                <div><label class="label" for="tn">Template name</label><input id="tn" name="name" class="field" value="${esc(cur.name)}" required /></div>
                <div><label class="label" for="ts">Status</label><select id="ts" name="status" class="field"><option value="published" ${cur.status === 'published' ? 'selected' : ''}>Published</option><option value="draft" ${cur.status === 'draft' ? 'selected' : ''}>Draft</option></select></div>
              </div>
              <div class="grid xl:grid-cols-2">
                <div class="p-5 space-y-4 xl:border-r border-line min-w-0">
                  <div><label class="label" for="subj">Subject</label><input id="subj" name="subject" class="field" value="${esc(cur.subject)}" /></div>
                  <div><label class="label" for="bd">Body</label><textarea id="bd" name="body" rows="14" class="field font-[inherit]">${esc(cur.body)}</textarea>
                    <p class="hint">Insert a field at the cursor:</p>
                    <div class="flex flex-wrap gap-1.5 mt-1.5">${MERGE_FIELDS.map(([k, l]) => `<button type="button" data-k="${k}" class="mf h-7 px-2 rounded-lg border border-line text-xs hover:bg-sunk" title="{{${k}}}">${l}</button>`).join('')}</div>
                  </div>
                  <fieldset><legend class="label">Suggested for</legend><div class="grid grid-cols-2 gap-1.5">${EXIT_TYPES.map((t) => `<label class="flex items-center gap-2 text-sm"><input type="checkbox" name="types" value="${t.id}" class="size-4 accent-[var(--color-accent)]" ${cur.types.includes(t.id) ? 'checked' : ''} />${t.label}</label>`).join('')}</div></fieldset>
                </div>
                <div class="p-5 bg-sunk/60 min-w-0 rounded-b-[10px] xl:rounded-bl-none">
                  <p class="text-xs text-muted">Preview with a sample employee (${esc(sample.name)})</p>
                  <p id="pvS" class="mt-3 text-sm font-semibold">${esc(merge(cur.subject, sv))}</p>
                  <pre id="pvB" class="mt-3 text-sm whitespace-pre-wrap font-sans leading-relaxed">${esc(merge(cur.body, sv))}</pre>
                </div>
              </div>
              <div class="px-5 py-3 border-t border-line flex flex-wrap justify-end gap-2">
                <button type="button" id="dup" class="btn">Duplicate</button>
                <button class="btn btn-primary">Save template</button>
              </div>
            </form>
          </div>`
          const subj = $('#subj'), bd = $('#bd')
          const live = () => { $('#pvS').textContent = merge(subj.value, sv); $('#pvB').textContent = merge(bd.value, sv) }
          subj.addEventListener('input', live); bd.addEventListener('input', live)
          let lastField = bd
          subj.addEventListener('focus', () => (lastField = subj)); bd.addEventListener('focus', () => (lastField = bd))
          on(root, '.mf', 'click', (ev, el) => {
            const t = lastField, ins = `{{${el.dataset.k}}}`
            const a = t.selectionStart ?? t.value.length, b = t.selectionEnd ?? a
            t.value = t.value.slice(0, a) + ins + t.value.slice(b)
            t.focus(); t.setSelectionRange(a + ins.length, a + ins.length); live()
          })
          on(root, '.pick', 'click', (ev, el) => { cur = st.templates.find((t) => t.id === el.dataset.id); draw() })
          on(root, '#newT', 'click', () => {
            const t = { id: 'tpl-' + Date.now().toString(36), name: 'Untitled template', types: [], updated: today, status: 'draft', subject: '', body: 'Dear {{first_name}},\n\n\n\n{{hr_contact}}\nPeople & Culture, {{company}}' }
            update((s) => s.templates.push(t)); cur = t; draw(); $('#tn').select()
          })
          on(root, '#dup', 'click', () => {
            const t = { ...cur, id: 'tpl-' + Date.now().toString(36), name: cur.name + ' (copy)', status: 'draft', updated: today, types: [...cur.types] }
            update((s) => s.templates.push(t)); cur = t; draw(); toast('Duplicated as a draft')
          })
          on(root, '#tf', 'submit', (ev) => {
            ev.preventDefault()
            const fd = new FormData(ev.target)
            if (!fd.get('name').trim()) return
            update(() => Object.assign(cur, { name: fd.get('name').trim(), status: fd.get('status'), subject: fd.get('subject'), body: fd.get('body'), types: fd.getAll('types'), updated: today }))
            draw(); toast('Template saved')
          })
        }
        draw()
      }

      if (tab === 'documents') {
        $('#body').innerHTML = `
        <div class="card overflow-x-auto">
          <table class="w-full text-sm min-w-[820px]">
            <thead class="text-xs text-muted text-left border-b border-line"><tr>
              <th class="font-medium px-5 py-3">Document</th><th class="font-medium px-3 py-3">Used for</th><th class="font-medium px-3 py-3">Signed by</th><th class="font-medium px-3 py-3">Language</th><th class="font-medium px-3 py-3">Version</th><th class="px-5 py-3"></th></tr></thead>
            <tbody class="divide-y divide-line">
              ${st.documents.map((d, i) => `<tr>
                <td class="px-5 py-3.5"><p class="font-medium">${esc(d.name)}</p><p class="text-xs text-muted">${esc(d.local)}</p></td>
                <td class="px-3 py-3.5 text-muted max-w-[240px]">${d.types.length > 5 ? 'All internal exits' + (d.types.some((t) => t.startsWith('ext')) ? ' and external' : '') : d.types.map(typeLabel).join(', ')}</td>
                <td class="px-3 py-3.5">${esc(d.signer)}</td>
                <td class="px-3 py-3.5">${esc(d.lang)}</td>
                <td class="px-3 py-3.5 num">v${d.version}</td>
                <td class="px-5 py-3.5"><div class="flex justify-end gap-1.5"><button data-i="${i}" class="pv btn btn-sm btn-quiet"><span class="icon-[majesticons--eye-line] size-4"></span>Preview</button><button data-i="${i}" class="ed btn btn-sm"><span class="icon-[majesticons--edit-pen-2-line] size-4"></span>Edit</button></div></td>
              </tr>`).join('')}
            </tbody>
          </table>
        </div>
        <p class="text-xs text-muted mt-3">Publishing a change creates a new version. Cases keep the version they were prepared with.</p>`
        on(root, '.pv', 'click', (ev, el) => letterPreview(st.documents[+el.dataset.i]))
        on(root, '.ed', 'click', (ev, el) => {
          const d = st.documents[+el.dataset.i]
          modal(`${modalHead('Edit document', esc(d.name) + ' · v' + d.version)}
          <form class="p-5 space-y-4 overflow-auto">
            <div><label class="label" for="dn">Name (English)</label><input id="dn" name="name" class="field" value="${esc(d.name)}" /></div>
            <div><label class="label" for="dl">Name (Bahasa Indonesia)</label><input id="dl" name="local" class="field" value="${esc(d.local)}" /></div>
            <div class="grid grid-cols-2 gap-3"><div><label class="label" for="sg">Signed by</label><input id="sg" name="signer" class="field" value="${esc(d.signer)}" /></div>
            <div><label class="label" for="lg">Language</label><select id="lg" name="lang" class="field">${['ID / EN', 'ID', 'EN'].map((l) => `<option ${l === d.lang ? 'selected' : ''}>${l}</option>`).join('')}</select></div></div>
            <fieldset><legend class="label">Used for</legend><div class="grid grid-cols-2 gap-1.5">${EXIT_TYPES.map((t) => `<label class="flex items-center gap-2 text-sm"><input type="checkbox" name="types" value="${t.id}" class="size-4 accent-[var(--color-accent)]" ${d.types.includes(t.id) ? 'checked' : ''} />${t.label}</label>`).join('')}</div></fieldset>
            <div class="flex justify-end gap-2"><button type="button" class="btn" data-close>Cancel</button><button class="btn btn-primary">Publish v${d.version + 1}</button></div>
          </form>`, {
            onMount(dlg) {
              dlg.querySelector('form').addEventListener('submit', (e) => {
                e.preventDefault(); const fd = new FormData(e.target)
                update(() => Object.assign(d, { name: fd.get('name'), local: fd.get('local'), signer: fd.get('signer'), lang: fd.get('lang'), types: fd.getAll('types'), version: d.version + 1 }))
                dlg.close(); redraw(`Published v${d.version}`)
              })
            },
          })
        })
      }

      if (tab === 'checklist') {
        $('#body').innerHTML = `
        <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-4 items-start">
          <div class="card">
            <div class="px-5 py-3.5 border-b border-line"><h2 class="text-sm font-semibold">Standard items</h2><p class="text-xs text-muted mt-0.5">Added to every case of the matching workforce.</p></div>
            <ul class="divide-y divide-line">
              ${st.clearance.map((c, i) => `<li class="px-5 py-3 flex items-center gap-3">
                <label class="relative inline-flex shrink-0 cursor-pointer"><input type="checkbox" data-i="${i}" class="tg peer sr-only" ${c.on ? 'checked' : ''} aria-label="Use ${esc(c.label)}" /><span class="w-9 h-5 rounded-full bg-line peer-checked:bg-accent transition-colors"></span><span class="absolute left-0.5 top-0.5 size-4 rounded-full bg-white shadow transition-transform peer-checked:translate-x-4"></span></label>
                <div class="min-w-0 flex-1"><p class="text-sm ${c.on ? '' : 'text-muted'}">${esc(c.label)}</p><p class="text-xs text-muted">${esc(c.dept)} · ${c.for === 'internal' ? 'Internal' : 'External'}</p></div>
                ${c.custom ? `<button data-i="${i}" class="rm btn btn-sm btn-quiet px-2" aria-label="Remove"><span class="icon-[majesticons--delete-bin-line] size-4"></span></button>` : ''}
              </li>`).join('')}
            </ul>
            <form id="addC" class="px-5 py-4 border-t border-line grid sm:grid-cols-[1fr_130px_130px_auto] gap-2">
              <input name="label" class="field" placeholder="New item, e.g. Return parking sticker" aria-label="New item" required />
              <select name="dept" class="field" aria-label="Department"><option>HR</option><option>IT</option><option>GA</option><option>Finance</option><option>Manager</option></select>
              <select name="for" class="field" aria-label="Workforce"><option value="internal">Internal</option><option value="external">External</option></select>
              <button class="btn">Add</button>
            </form>
          </div>
          <div class="card p-5 text-sm"><p class="font-semibold">Added from the employee record</p>
            <ul class="mt-3 space-y-2 text-muted">
              <li>Every asset they hold, with the department that signs the return</li>
              <li>Every system they can access, closed by IT</li>
              <li>Outstanding cooperative loans, deducted by Finance</li>
            </ul>
            <p class="text-xs text-muted mt-4">Asset and access data comes from the HRIS and the IT directory (see Settings, Integrations).</p>
          </div>
        </div>`
        on(root, '.tg', 'change', (ev, el) => { update(() => { st.clearance[+el.dataset.i].on = el.checked }); redraw() })
        on(root, '.rm', 'click', (ev, el) => { update(() => st.clearance.splice(+el.dataset.i, 1)); redraw('Item removed') })
        on(root, '#addC', 'submit', (ev) => {
          ev.preventDefault(); const fd = new FormData(ev.target)
          if (!fd.get('label').trim()) return
          update(() => st.clearance.push({ id: 'c-' + Date.now().toString(36), label: fd.get('label').trim(), dept: fd.get('dept'), for: fd.get('for'), on: true, custom: true }))
          redraw('Item added')
        })
      }
    },
  }
}
