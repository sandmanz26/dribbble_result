// Sample content for the prototype. Rates, times, dates and the shipment are placeholders for Golden
// Stone Logistics to confirm; nothing here is a real price or a real shipment.

export const SERVICES = [
  { id: 'sea', icon: 'Boat', time: { en: '45 to 60 days, port to port', zh: '港到港 45 至 60 天' } },
  { id: 'air', icon: 'Plane', time: { en: '7 to 12 days, door to door', zh: '门到门 7 至 12 天' } },
  { id: 'warehouse', icon: 'ShippingBoxV2', time: { en: 'Up to 30 days free storage', zh: '最长 30 天免费仓储' } },
  { id: 'collection', icon: 'Truck', time: { en: 'Same or next day in Guangzhou and Yiwu', zh: '广州、义乌当天或次日上门' } },
  { id: 'enquiry', icon: 'ChatQuestion', time: { en: 'Answer within one working day', zh: '一个工作日内回复' } },
  { id: 'quote', icon: 'Calculator', time: { en: 'Estimate now, confirmed price within a day', zh: '即时估价，一天内确认报价' } },
]

// Sample rates in US dollars for the quote tool.
export const RATES = {
  air: { perKg: [8.5, 10.5], minKg: 10, battery: 1.5 },
  sea: { perCbm: [260, 320], minCbm: 1 },
  door: { tema: 0, accra: 35, kumasi: 70 }, // per CBM for sea; air door delivery is included in Accra, +0.6/kg Kumasi
}
export const ORIGINS = ['guangzhou', 'yiwu', 'shenzhen']
export const DESTS = ['tema', 'accra', 'kumasi']
export const GOODS = ['general', 'battery', 'liquid']

// One sample shipment for the tracking demo. Dates are relative so the demo always looks current.
export const SHIPMENT = {
  id: 'GSL-24817', mode: 'sea', from: 'guangzhou', to: 'accra', pieces: 14, cbm: 3.2,
  steps: [
    { id: 'collected', days: -34 }, { id: 'warehouse', days: -32 }, { id: 'loaded', days: -27 },
    { id: 'departed', days: -25 }, { id: 'sea', days: -6, now: true }, { id: 'arrived', days: 9 },
    { id: 'customs', days: 12 }, { id: 'delivered', days: 15 },
  ],
}

export const OFFICES = [
  { id: 'accra', tz: 'Africa/Accra', hours: [8, 18], days: [1, 6] },
  { id: 'guangzhou', tz: 'Asia/Shanghai', hours: [9, 19], days: [1, 6] },
]
