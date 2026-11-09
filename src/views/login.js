import { S, signIn } from '../store.js'
import { esc, avatar, on } from '../ui.js'
import { COMPANY } from '../data.js'

const DEMO_CODE = '240611'
const CREDIT = {
  name: 'Annie Spratt',
  profile: 'https://unsplash.com/@anniespratt?utm_source=pamit_prototype&utm_medium=referral',
  photo: 'https://unsplash.com/photos/a-room-with-a-long-table-and-a-large-window-hQEvJZ2FWVM?utm_source=pamit_prototype&utm_medium=referral',
  site: 'https://unsplash.com/?utm_source=pamit_prototype&utm_medium=referral',
}

const logo = (tone = '') => `
  <span class="flex items-center gap-2.5 ${tone}">
    <span class="size-9 rounded-[8px] bg-accent text-accent-ink grid place-items-center"><span class="icon-[majesticons--door-exit-line] size-5"></span></span>
    <span class="font-semibold text-lg tracking-tight">Pamit</span>
  </span>`

export function render({ query }) {
  const users = S().users.slice(0, 4)
  return {
    title: 'Sign in',
    html: `
  <div class="min-h-dvh lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
    <section class="relative h-[260px] sm:h-[340px] lg:h-auto lg:min-h-dvh overflow-hidden bg-[#2a2118]">
      <img src="img/login-desk-900.webp" srcset="img/login-desk-900.webp 900w, img/login-desk-1600.webp 1600w" sizes="(min-width: 1024px) 56vw, 100vw"
        alt="An empty office desk by a window in late afternoon light, with a letter left on it"
        class="absolute inset-0 size-full object-cover object-[50%_62%] lg:object-[50%_55%]" fetchpriority="high" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#1a130d]/85 via-[#1a130d]/20 to-[#1a130d]/30"></div>
      <div class="relative h-full flex flex-col justify-between p-5 sm:p-8 lg:p-12 text-white">
        ${logo()}
        <div class="max-w-[540px]">
          <h1 class="hidden lg:block text-[46px] leading-[1.06] font-semibold tracking-[-0.02em]">Every exit, handled properly.</h1>
          <p class="hidden lg:block mt-5 text-lg text-white/80 leading-relaxed">Notices, negotiation, asset returns and final pay for ${esc(COMPANY.short)} employees and outsourced staff, from the first letter to the certificate of employment.</p>
          <dl class="hidden lg:grid mt-8 pt-6 border-t border-white/20 grid-cols-[auto_1fr] gap-x-5 gap-y-2.5 text-sm">
            <dt class="text-white/60">Follows</dt><dd>UU 13/2003 as amended, PP 35/2021, the company PKB</dd>
            <dt class="text-white/60">Covers</dt><dd>PKWTT, PKWT, outsourced and freelance workers</dd>
            <dt class="text-white/60">Hands off to</dt><dd>Payroll, IT, General Affairs and BPJS reporting</dd>
          </dl>
          <p class="mt-6 lg:mt-8 text-xs text-white/65">Photo by <a href="${CREDIT.profile}" target="_blank" rel="noopener" class="underline underline-offset-2 hover:text-white">${CREDIT.name}</a> on <a href="${CREDIT.photo}" target="_blank" rel="noopener" class="underline underline-offset-2 hover:text-white">Unsplash</a></p>
        </div>
      </div>
    </section>

    <section class="flex items-start lg:items-center justify-center px-4 py-8 sm:p-10">
      <div class="w-full max-w-[420px]">
        <div class="lg:hidden mb-6">
          <h1 class="text-[28px] leading-tight font-semibold tracking-[-0.02em]">Every exit, handled properly.</h1>
          <p class="mt-2 text-sm text-muted">Offboarding for ${esc(COMPANY.name)}.</p>
        </div>
        <div class="card p-6 sm:p-8 shadow-[0_1px_2px_rgb(0_0_0/0.04),0_12px_32px_-12px_rgb(0_0_0/0.12)]">
          <div id="step1">
            <h2 class="text-xl font-semibold">Sign in to Pamit</h2>
            <p class="text-sm text-muted mt-1">Use your ${esc(COMPANY.short)} work account.</p>
            <form id="emailForm" novalidate class="mt-6">
              <label class="label" for="email">Work email</label>
              <div class="relative"><span class="icon-[majesticons--mail-line] size-5 text-muted absolute left-3 top-3"></span>
                <input id="email" class="field h-11 pl-10" type="email" autocomplete="username" value="rani.wulandari@arunika.co.id" /></div>
              <p id="emailErr" class="err hidden" role="alert"></p>
              <button class="btn btn-primary w-full h-11 mt-4">Send sign-in code<span class="icon-[majesticons--arrow-right-line] size-5"></span></button>
            </form>
            <div class="flex items-center gap-3 my-5 text-xs text-muted"><span class="h-px flex-1 bg-line"></span>or<span class="h-px flex-1 bg-line"></span></div>
            <button id="sso" class="btn w-full h-11"><span class="icon-[majesticons--shield-check-line] size-5 shrink-0"></span><span class="sm:hidden">Company single sign-on</span><span class="hidden sm:inline">Continue with company single sign-on</span></button>
          </div>
          <div id="step2" class="hidden">
            <button id="back" class="btn btn-quiet btn-sm -ml-3 mb-3"><span class="icon-[majesticons--arrow-left-line] size-4"></span>Use another email</button>
            <h2 class="text-xl font-semibold">Check your email</h2>
            <p class="text-sm text-muted mt-1">We sent a 6-digit code to <span id="sentTo" class="text-ink font-medium break-all"></span>. It expires in 10 minutes.</p>
            <form id="codeForm" novalidate class="mt-6">
              <label class="label" for="code">Sign-in code</label>
              <input id="code" class="field h-12 text-center text-xl tracking-[0.5em] num" inputmode="numeric" autocomplete="one-time-code" maxlength="6" placeholder="000000" />
              <p id="codeErr" class="err hidden" role="alert"></p>
              <p class="hint">Prototype: the code is <button type="button" id="fill" class="font-semibold text-ink underline underline-offset-2">${DEMO_CODE}</button></p>
              <button class="btn btn-primary w-full h-11 mt-4">Verify and sign in</button>
            </form>
          </div>
        </div>
        <p class="mt-4 text-xs text-muted text-center">No access yet? Ask People & Culture to add you. Sign-ins are logged.</p>

        <div class="mt-8">
          <p class="text-xs text-muted mb-2">Prototype: sign in straight away as</p>
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
