import { S, signIn } from '../store.js'
import { esc, avatar, on } from '../ui.js'
import { COMPANY } from '../data.js'

const CREDIT = {
  name: 'Annie Spratt',
  profile: 'https://unsplash.com/@anniespratt?utm_source=pamit_prototype&utm_medium=referral',
  photo: 'https://unsplash.com/photos/a-room-with-a-long-table-and-a-large-window-hQEvJZ2FWVM?utm_source=pamit_prototype&utm_medium=referral',
  site: 'https://unsplash.com/?utm_source=pamit_prototype&utm_medium=referral',
}

const logo = (tone = '') => `
  <span class="flex items-center gap-2.5 ${tone}">
    <span class="size-10 rounded-full bg-accent text-accent-ink grid place-items-center"><span class="icon-[majesticons--door-exit-line] size-5"></span></span>
    <span class="font-semibold text-lg tracking-tight">Pamit</span>
  </span>`

export function render({ query }) {
  const admin = S().users[0]
  return {
    title: 'Sign in',
    html: `
  <div class="min-h-dvh lg:grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
    <section class="relative h-[260px] sm:h-[340px] lg:h-auto lg:min-h-[calc(100dvh-24px)] lg:m-3 rounded-b-[28px] lg:rounded-[32px] overflow-hidden bg-[#1a2234]">
      <img src="img/login-desk-900.webp" srcset="img/login-desk-900.webp 900w, img/login-desk-1600.webp 1600w" sizes="(min-width: 1024px) 56vw, 100vw"
        alt="An empty office desk by a window in late afternoon light, with a letter left on it"
        class="absolute inset-0 size-full object-cover object-[50%_62%] lg:object-[50%_55%]" fetchpriority="high" />
      <div class="absolute inset-0 bg-gradient-to-t from-[#0b1426]/85 via-[#0b1426]/20 to-[#0b1426]/25"></div>
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
        <div class="card !rounded-[28px] p-6 sm:p-8">
          <h2 class="text-xl font-semibold">Sign in to Pamit</h2>
          <p class="text-sm text-muted mt-1">Use your ${esc(COMPANY.short)} work account.</p>
          <form id="emailForm" novalidate class="mt-6">
            <label class="label" for="email">Work email</label>
            <div class="relative"><span class="icon-[majesticons--mail-line] size-5 text-muted absolute left-3.5 top-3"></span>
              <input id="email" class="field h-11 pl-11" type="email" autocomplete="username" value="${esc(admin.email)}" /></div>
            <p id="emailErr" class="err hidden" role="alert"></p>
            <button class="btn btn-primary w-full h-11 mt-4">Sign in<span class="icon-[majesticons--arrow-right-line] size-5"></span></button>
          </form>
          <div class="flex items-center gap-3 my-5 text-xs text-muted"><span class="h-px flex-1 bg-line"></span>or<span class="h-px flex-1 bg-line"></span></div>
          <button id="sso" class="btn w-full h-11"><span class="icon-[majesticons--shield-check-line] size-5 shrink-0"></span><span class="sm:hidden">Company single sign-on</span><span class="hidden sm:inline">Continue with company single sign-on</span></button>
          <div class="mt-6 flex items-center gap-3 rounded-[18px] bg-accent-soft p-3.5">
            ${avatar(admin.name, 'size-10 text-xs')}
            <p class="text-sm leading-snug"><span class="font-medium">Demo account: ${esc(admin.name)}</span><br /><span class="text-muted">${esc(admin.title)}, full access to all data</span></p>
          </div>
        </div>
        <p class="mt-4 text-xs text-muted text-center">Prototype: any work email signs you in as the admin. Sign-ins are logged.</p>

      </div>
    </section>
  </div>`,
    mount(root, { go }) {
      const next = query.next ? decodeURIComponent(query.next) : '/'
      const finish = () => { signIn(admin); go('#' + (next.startsWith('/login') ? '/' : next)) }
      on(root, '#sso', 'click', finish)
      on(root, '#emailForm', 'submit', (e) => {
        e.preventDefault()
        const v = root.querySelector('#email').value.trim()
        const err = root.querySelector('#emailErr')
        if (!v || !v.includes('@')) { err.textContent = 'Enter your work email.'; err.classList.remove('hidden'); return }
        finish()
      })
    },
  }
}
