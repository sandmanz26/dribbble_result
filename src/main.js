import './style.css'
import { S, session, signOut } from './store.js'
import { esc, avatar, on } from './ui.js'
import { COMPANY } from './data.js'
import * as login from './views/login.js'
import * as home from './views/home.js'
import * as create from './views/create.js'
import * as list from './views/list.js'
import * as detail from './views/case.js'
import * as rules from './views/rules.js'
import * as settings from './views/settings.js'

const app = document.getElementById('app')

export function applyTheme() {
  const t = S().settings.theme
  const dark = t === 'dark' || (t === 'system' && matchMedia('(prefers-color-scheme: dark)').matches)
  document.documentElement.classList.toggle('dark', dark)
}
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme)

function parse() {
  const raw = location.hash.replace(/^#/, '') || '/'
  const [path, qs] = raw.split('?')
  const parts = path.split('/').filter(Boolean)
  return { parts, query: Object.fromEntries(new URLSearchParams(qs || '')), raw }
}

export const go = (h) => { if (location.hash === h) route(); else location.hash = h }

const SECTIONS = { new: 'Create new offboarding', offboarding: 'Offboarding list', rules: 'Rules & documents', settings: 'Settings' }

function shell(section, inner) {
  const me = session()
  const crumb = section ? `<span class="text-line hidden sm:inline">/</span><a href="#/${section === 'case' ? 'offboarding' : section}" class="hidden sm:inline text-sm text-muted hover:text-ink truncate">${SECTIONS[section === 'case' ? 'offboarding' : section]}</a>` : ''
  return `
  <header class="sticky top-0 z-30 px-3 sm:px-4 pt-3">
    <div class="mx-auto max-w-[1240px] h-16 pl-3 pr-2 sm:pl-4 flex items-center gap-3 rounded-full bg-surface/85 backdrop-blur-md shadow-[0_1px_2px_rgb(21_32_57/0.05),0_10px_30px_-16px_rgb(21_32_57/0.25)] border border-[#152039]/[0.05] dark:border-white/[0.06]">
      <a href="#/" class="flex items-center gap-2.5 shrink-0" aria-label="Pamit home">
        <span class="size-9 rounded-full bg-accent text-accent-ink grid place-items-center"><span class="icon-[majesticons--door-exit-line] size-5"></span></span>
        <span class="font-semibold text-[17px] tracking-tight">Pamit</span>
      </a>
      <span class="text-line">/</span>
      <span class="text-sm text-muted truncate hidden md:inline">${esc(COMPANY.name)}</span>
      ${crumb}
      <div class="ml-auto flex items-center gap-1">
        ${section ? `<a href="#/" class="btn btn-quiet btn-sm px-2 sm:px-3" aria-label="Home"><span class="icon-[majesticons--home-simple-line] size-5"></span><span class="hidden sm:inline">Home</span></a>` : ''}
        <div class="relative">
          <button id="me" class="flex items-center gap-2 h-12 pl-1.5 pr-3 rounded-full hover:bg-sunk" aria-haspopup="menu" aria-expanded="false">
            ${avatar(me.name, 'size-8 text-[11px]')}
            <span class="hidden sm:block text-left leading-tight"><span class="block text-sm font-medium">${esc(me.name)}</span><span class="block text-xs text-muted">${esc(me.title)}</span></span>
            <span class="icon-[majesticons--chevron-down-line] size-4 text-muted"></span>
          </button>
          <div id="menu" role="menu" class="hidden absolute right-0 mt-2 w-60 card p-2">
            <div class="px-2.5 py-2 text-xs text-muted border-b border-line mb-1">${esc(me.email)}</div>
            <a role="menuitem" href="#/settings" class="flex items-center gap-2 px-2.5 h-9 rounded-lg text-sm hover:bg-sunk"><span class="icon-[majesticons--settings-cog-line] size-4"></span>Settings</a>
            <button role="menuitem" id="theme" class="w-full flex items-center gap-2 px-2.5 h-9 rounded-lg text-sm hover:bg-sunk"><span class="icon-[majesticons--moon-line] size-4"></span>Switch light or dark</button>
            <button role="menuitem" id="signout" class="w-full flex items-center gap-2 px-2.5 h-9 rounded-lg text-sm hover:bg-sunk"><span class="icon-[majesticons--logout-line] size-4"></span>Sign out</button>
          </div>
        </div>
      </div>
    </div>
  </header>
  <main id="main" class="mx-auto max-w-[1240px] px-4 sm:px-6 py-7 sm:py-10">${inner}</main>
  <footer class="mx-auto max-w-[1240px] px-4 sm:px-6 pb-8 text-xs text-muted">Prototype with sample data. Company, people, wages and cases are invented. Settlement figures are estimates under PP 35/2021, not legal advice.</footer>`
}

function route() {
  const { parts, query, raw } = parse()
  const me = session()
  if (parts[0] !== 'login' && !me) { location.replace('#/login?next=' + encodeURIComponent(raw)); return }
  if (parts[0] === 'login' && me) { location.replace('#/'); return }
  let view, section = null, params = {}
  switch (parts[0]) {
    case 'login': view = login; break
    case undefined: view = home; break
    case 'new': view = create; section = 'new'; break
    case 'offboarding': if (parts[1]) { view = detail; section = 'case'; params.id = parts[1]; params.tab = parts[2] } else { view = list; section = 'offboarding' } break
    case 'rules': view = rules; section = 'rules'; params.tab = parts[1]; break
    case 'settings': view = settings; section = 'settings'; params.tab = parts[1]; break
    default: view = home
  }
  const ctx = { params, query, go, rerender: route }
  const out = view.render(ctx)
  document.title = (out.title ? out.title + ' · ' : '') + 'Pamit'
  app.innerHTML = view === login ? out.html : shell(section, out.html)
  if (view !== login) wireShell()
  out.mount?.(app, ctx)
  if (!ctx.keepScroll) window.scrollTo(0, 0)
}

function wireShell() {
  const btn = app.querySelector('#me'), menu = app.querySelector('#menu')
  btn.addEventListener('click', (e) => { e.stopPropagation(); const open = menu.classList.toggle('hidden') === false; btn.setAttribute('aria-expanded', open) })
  document.addEventListener('click', () => { menu.classList.add('hidden'); btn.setAttribute('aria-expanded', 'false') }, { once: true })
  on(app, '#signout', 'click', () => { signOut(); go('#/login') })
  on(app, '#theme', 'click', () => {
    const dark = document.documentElement.classList.contains('dark')
    S().settings.theme = dark ? 'light' : 'dark'
    import('./store.js').then((m) => m.save())
    applyTheme()
  })
}

applyTheme()
window.addEventListener('hashchange', route)
route()
