import { HugeiconsIcon } from '@hugeicons/react'
import * as H from '@hugeicons/core-free-icons'

// One icon set (Hugeicons, stroke), referred to by plain names across the app.
const MAP = {
  search: H.Search01Icon, discover: H.Compass01Icon, groups: H.UserGroupIcon, trips: H.Luggage01Icon,
  chats: H.BubbleChatIcon, me: H.UserCircleIcon, bell: H.Notification03Icon, back: H.ArrowLeft01Icon,
  next: H.ArrowRight01Icon, down: H.ArrowDown01Icon, calendar: H.Calendar03Icon, wallet: H.Wallet01Icon,
  pin: H.Location01Icon, verified: H.CheckmarkBadge01Icon, shield: H.SecurityCheckIcon, flag: H.Flag01Icon,
  block: H.UserBlock01Icon, add: H.Add01Icon, close: H.Cancel01Icon, tick: H.Tick02Icon, link: H.Link01Icon,
  share: H.Share08Icon, pack: H.Backpack01Icon, sun: H.Sun03Icon, moon: H.Moon02Icon, filter: H.FilterHorizontalIcon,
  more: H.MoreHorizontalIcon, send: H.SentIcon, mail: H.Mail01Icon, phone: H.SmartPhone01Icon, id: H.Passport01Icon,
  clock: H.Clock01Icon, edit: H.Edit02Icon, trash: H.Delete02Icon, info: H.InformationCircleIcon, eye: H.ViewIcon,
  logout: H.Logout01Icon, up: H.ThumbsUpIcon, nope: H.ThumbsDownIcon, save: H.Bookmark02Icon, alert: H.Alert02Icon,
  lock: H.LockIcon, settings: H.Settings02Icon, book: H.Book02Icon, route: H.Route01Icon, list: H.CheckListIcon,
  plan: H.Task01Icon, userAdd: H.UserAdd01Icon, done: H.CheckmarkCircle02Icon, globe: H.Globe02Icon,
}

export default function Icon({ name, size = 20, stroke = 1.6, className, label }) {
  return (
    <HugeiconsIcon icon={MAP[name]} size={size} strokeWidth={stroke} className={className}
      aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} />
  )
}
