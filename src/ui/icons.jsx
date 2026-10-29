import {
  ContainerLinearIcon, DeliveryLinearIcon, PlaneLinearIcon, DocumentTextLinearIcon, BoxLinearIcon, RoutingLinearIcon,
  MapPointLinearIcon, MagnifierLinearIcon, ArrowLeftLinearIcon, ArrowRightLinearIcon, AltArrowDownLinearIcon,
  HamburgerMenuLinearIcon, CloseLinearIcon, CheckCircleLinearIcon, DangerTriangleLinearIcon, ClockCircleLinearIcon,
  TranslationLinearIcon, CopyLinearIcon, ShieldCheckLinearIcon, CalendarLinearIcon, LayersLinearIcon, Buildings2LinearIcon,
} from '@solar-icons/react'
import { useLang } from '../i18n.jsx'

export const Sea = ContainerLinearIcon
export const Truck = DeliveryLinearIcon
export const Plane = PlaneLinearIcon
export const Doc = DocumentTextLinearIcon
export const Box = BoxLinearIcon
export const Route = RoutingLinearIcon
export const Pin = MapPointLinearIcon
export const Search = MagnifierLinearIcon
export const Down = AltArrowDownLinearIcon
export const Menu = HamburgerMenuLinearIcon
export const Close = CloseLinearIcon
export const Ok = CheckCircleLinearIcon
export const Warn = DangerTriangleLinearIcon
export const Clock = ClockCircleLinearIcon
export const Lang = TranslationLinearIcon
export const Copy = CopyLinearIcon
export const Shield = ShieldCheckLinearIcon
export const Calendar = CalendarLinearIcon
export const Layers = LayersLinearIcon
export const Office = Buildings2LinearIcon

// Arrows follow the reading direction: "forward" points left in Arabic and right in English.
export function Fwd(props) { const { ar } = useLang(); const A = ar ? ArrowLeftLinearIcon : ArrowRightLinearIcon; return <A aria-hidden="true" {...props} /> }
export function Back(props) { const { ar } = useLang(); const A = ar ? ArrowRightLinearIcon : ArrowLeftLinearIcon; return <A aria-hidden="true" {...props} /> }

export const SERVICE_ICON = { ship: Sea, truck: Truck, plane: Plane, doc: Doc, box: Box, crane: Layers }
