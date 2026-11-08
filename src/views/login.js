import { S, signIn } from '../store.js'
import { esc, avatar, on } from '../ui.js'
import { COMPANY } from '../data.js'

const DEMO_CODE = '240611'

export function render({ query }) {
  const users = S().users.slice(0, 4)
  return {
    title: 'Sign in',
    html: `
  <div class="min-h-dvh grid lg:grid-cols-[1.05fr_1fr]">
    <section class="hidden lg:flex flex-col justify-between p-12 border-r border-line">
      <div class="flex items-center gap-2.5">
        <span class="size-9 rounded-[8px] bg-accent text-accent-ink grid place-items-center"><span class="icon-[majesticons--door-exit-line] size-5"></span></span>
        <span class="font-semibold text-lg tracking-tight">Pamit</span>
      </div>
      <div class="max-w-[520px]">
        <h1 class="text-[44px] leading-[1.08] font-semibold tracking-[-0.02em]">Every exit, handled properly.</h1>
        <p class="mt-5 text-lg text-muted leading-relaxed">Notices, negotiation, asset returns and final pay for ${esc(COMPANY.short)} employees and outsourced staff, from the first letter to the certificate of employment.</p>
        <dl class="mt-10 grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-sm">
          <dt class="text-muted">Follows</dt><dd>UU 13/2003 as amended, PP 35/2021, the company PKB</dd>
          <dt class="text-muted">Covers</dt><dd>PKWTT, PKWT, outsourced and freelance workers</dd>
          <dt class="text-muted">Hands off to</dt><dd>Payroll, IT, General Affairs and BPJS reporting</dd>
        </dl>
      </div>
      <p class="text-xs text-muted">Internal system of ${esc(COMPANY.name)}. Access is logged.</p>
    </section>

    <section class="flex items-center justify-center p-4 sm:p-10">
      <div class="w-full max-w-[420px]">
        <div class="lg:hidden flex items-center gap-2.5 mb-8">
          <span class="size-9 rounded-[8px] bg-accent text-accent-ink grid place-items-center"><span class="icon-[majesticons--door-exit-line] size-5"></span></span>
          <span class="font-semibold text-lg tracking-tight">Pamit</span>
        </div>
        <div class="card p-6 sm:p-8">
          <div id="step1">
            <h2 class="text-xl font-semibold">Sign in</h2>
            <p class="text-sm text-muted mt-1">Use your ${esc(COMPANY.short)} work account.</p>
            <button id="sso" class="btn w-full mt-6 h-11"><span class="icon-[majesticons--shield-check-line] size-5"></span>Continue with company single sign-on</button>
            <div class="flex items-center gap-3 my-5 text-xs text-muted"><span class="h-px flex-1 bg-line"></span>or with a one-time code<span class="h-px flex-1 bg-line"></span></div>
            <form id="emailForm" novalidate>
              <label class="label" for="email">Work email</label>
              <input id="email" class="field h-11" type="email" autocomplete="username" value="rani.wulandari@arunika.co.id" />
              <p id="emailErr" class="err hidden" role="alert"></p>
              <button class="btn btn-primary w-full h-11 mt-4">Send code<span class="icon-[majesticons--arrow-right-line] size-5"></span></button>
            </form>
          </div>
          <div id="step2" class="hidden">
            <button id="back" class="btn btn-quiet btn-sm -ml-3 mb-3"><span class="icon-[majesticons--arrow-left-line] size-4"></span>Back</button>
            <h2 class="text-xl font-semibold">Check your email</h2>
            <p class="text-sm text-muted mt-1">We sent a 6-digit code to <span id="sentTo" class="text-ink font-medium"></span>. It expires in 10 minutes.</p>
            <form id="codeForm" novalidate class="mt-6">
              <label class="label" for="code">Code</label>
              <input id="code" class="field h-12 text-center text-xl tracking-[0.5em] num" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" />
              <p id="codeErr" class="err hidden" role="alert"></p>
              <p class="hint">Prototype: the code is <button type="button" id="fill" class="font-semibold text-ink underline underline-offset-2">${DEMO_CODE}</button></p>
              <button class="btn btn-primary w-full h-11 mt-4">Verify and sign in</button>
            </form>
          </div>
        </div>
        <div class="mt-6">
          <p class="text-xs text-muted mb-2">Prototype: sign in as</p>
          <div class="grid grid-cols-2 gap-2">
            ${users.map((u, i) => `<button class="demo card flex items-center gap-2.5 p-2.5 text-left hover:border-accent" data-i="${i}">${avatar(u.name, 'size-8 text-[11px]')}<span class="min-w-0 leading-tight"><span class="block text-sm font-medium truncate">${esc(u.name)}</span><span class="block text-xs text-muted truncate">${esc(u.role)}</span></span></button>`).join('')}
          </div>
        </div>
      </div>
    </section>
  </div>`,
    mount(root, { go }) {
      const next = query.next ? decodeURIComponent(query.next) : '/'
      const finish = (u) => { signIn(u); go('#' + (next.startsWith('/login') ? '/' : next)) }
      const users = S().users
      let chosen = null
      on(root, '#sso', 'click', () => finish(users[0]))
      on(root, '.demo', 'click', (e, el) => finish(users[+el.dataset.i]))
      on(root, '#emailForm', 'submit', (e) => {
        e.preventDefault()
        const v = root.querySelector('#email').value.trim().toLowerCase()
        const err = root.querySelector('#emailErr')
        chosen = users.find((u) => u.email === v)
        if (!v || !v.includes('@')) { err.textContent = 'Enter your work email.'; err.classList.remove('hidden'); return }
        if (!chosen) { err.textContent = 'This email has no access to Pamit. Ask People & Culture to add you.'; err.classList.remove('hidden'); return }
        err.classList.add('hidden')
        root.querySelector('#sentTo').textContent = v
        root.querySelector('#step1').classList.add('hidden')
        root.querySelector('#step2').classList.remove('hidden')
        root.querySelector('#code').focus()
      })
      on(root, '#back', 'click', () => { root.querySelector('#step2').classList.add('hidden'); root.querySelector('#step1').classList.remove('hidden') })
      on(root, '#fill', 'click', () => { root.querySelector('#code').value = DEMO_CODE })
      on(root, '#codeForm', 'submit', (e) => {
        e.preventDefault()
        const v = root.querySelector('#code').value.trim()
        const err = root.querySelector('#codeErr')
        if (v !== DEMO_CODE) { err.textContent = v.length < 6 ? 'Enter all 6 digits.' : 'That code is not right. Check the latest email.'; err.classList.remove('hidden'); return }
        finish(chosen)
      })
    },
  }
}
