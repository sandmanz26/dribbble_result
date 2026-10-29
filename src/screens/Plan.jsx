import { Link } from 'react-router-dom'
import * as I from '../ui/icons.js'

// The brief asks for each step explained simply, with a clear stop wherever the coach has to do
// something themselves. This is that plan for version 1, in the order it happens.
const STEPS = [
  { who: 'you', title: 'Make an Apple developer account', text: 'On developer.apple.com, choose Account, then Enroll. It costs 99 USD a year and Apple takes a day or two to approve it. Needed to put the app on your iPhone through TestFlight.' },
  { who: 'you', title: 'Make a Google Play developer account', text: 'On play.google.com/console, sign in with a Google account and pay the one-time 25 USD. Needed for Android.' },
  { who: 'you', title: 'Make a free Expo account', text: 'On expo.dev, choose Sign up. Expo builds one app for both iPhone and Android, so nothing is written twice.' },
  { who: 'you', title: 'Make the database project', text: 'On supabase.com, choose New project, name it Oppsett and pick the Stockholm region. Copy the Project URL and the anon key from Settings, API. Do not paste them in a chat: add them in Expo under Project, Environment variables, and tell me when they are there.' },
  { who: 'you', title: 'Make the AI key', text: 'In the AI provider’s console, create an API key, set a monthly spending limit (20 USD is plenty for one coach) and add it to Supabase under Edge Functions, Secrets. The key never goes into the app itself.' },
  { who: 'me', title: 'Build the app', text: 'Camera, areas, the exercise bank and the setup screen you see in this prototype, on Expo, with your data stored under your club and your coach account from day one.' },
  { who: 'me', title: 'Build the AI step', text: 'A small server function sends the photo and the exercise’s rules to the vision model and gets back the ground, the hole or mat, the scale and the positions in metres. The app draws them in perspective, as here. If nothing of known size is in the photo, the app asks for two taps.' },
  { who: 'you', title: 'Export your exercise bank', text: 'In Øvelsesbanken, export the exercises as a CSV file, or give me read access to its database. Version 1 imports it once; version 2 keeps it in sync.' },
  { who: 'you', title: 'Install Expo Go and test', text: 'Install Expo Go from the App Store or Google Play, then scan the QR code I send. The app opens on your phone with your data. Take one photo of each area at the club.' },
  { who: 'me', title: 'Fix what you find', text: 'Two short rounds after your tests at the club, especially on how well the layouts fit each area.' },
  { who: 'you', title: 'Install the real app', text: 'Accept the TestFlight invite on iPhone, or the internal testing link on Android. From then on it updates by itself.' },
]

export default function Plan() {
  return (
    <div className="home">
      <header className="top"><Link to="/club" className="crumb"><I.Back aria-hidden="true" /> Club</Link><h1>How version 1 gets built</h1><p className="lede">In order. Steps marked <b>You</b> are the ones where I stop and wait for you; each says exactly what to click.</p></header>
      <ol className="plan">
        {STEPS.map((x, i) => (
          <li key={x.title} className={x.who === 'you' ? 'is-you' : ''}>
            <span className="plan-n mono">{i + 1}</span>
            <div><p className="who">{x.who === 'you' ? 'You' : 'Me'}</p><h2>{x.title}</h2><p>{x.text}</p></div>
          </li>
        ))}
      </ol>
      <section className="block"><h2>Kept simple on purpose</h2><p>One codebase for both phones, one small server function for the AI, one database. Nothing to run on your own computer. A second coach later is a new account, not a new app.</p></section>
    </div>
  )
}
