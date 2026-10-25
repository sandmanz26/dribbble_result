import * as O from '@heroicons/react/24/outline'

// One icon set: Heroicons outline. Moods are weather, so they borrow the weather icons.
const MAP = {
  sun: O.SunIcon, cloud: O.CloudIcon, heavy: O.CloudArrowDownIcon, bolt: O.BoltIcon, moon: O.MoonIcon,
  home: O.HomeIcon, book: O.BookOpenIcon, user: O.UserCircleIcon, back: O.ChevronLeftIcon, next: O.ChevronRightIcon,
  play: O.PlayIcon, pause: O.PauseIcon, close: O.XMarkIcon, check: O.CheckIcon, info: O.InformationCircleIcon,
  shield: O.ShieldCheckIcon, alert: O.ExclamationTriangleIcon, clock: O.ClockIcon, sound: O.SpeakerWaveIcon,
  mute: O.SpeakerXMarkIcon, plus: O.PlusIcon, pen: O.PencilSquareIcon, bell: O.BellIcon, beaker: O.BeakerIcon,
  sparkle: O.SparklesIcon, chat: O.ChatBubbleOvalLeftEllipsisIcon, refresh: O.ArrowPathIcon, swatch: O.SwatchIcon,
}
export default function Icon({ name, size = 22, className, label }) {
  const C = MAP[name]
  return <C width={size} height={size} strokeWidth={1.6} className={className} aria-hidden={label ? undefined : true} aria-label={label} role={label ? 'img' : undefined} />
}
