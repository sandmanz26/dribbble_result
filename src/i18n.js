import { createContext, useContext } from 'react'

// Every visible string in English and Simplified Chinese. The Chinese is a first draft for the
// client's Guangzhou team to review before launch.
export const T = {
  nav: { services: ['Services', '服务'], quote: ['Quote', '报价'], track: ['Track', '查询'], how: ['How it works', '流程'], offices: ['Offices', '办公室'], faq: ['Questions', '常见问题'], contact: ['Contact', '联系'] },
  signin: ['Sign in', '登录'], soon: ['Coming soon', '即将推出'],
  getQuote: ['Get a freight quote', '获取运费报价'], trackCta: ['Track a shipment', '查询货运'],
  hero: {
    h1a: ['Guangzhou to Tema,', '从广州到特马，'], h1b: ['carried with care.', '用心运送。'],
    lede: ['Air and sea freight between China and Ghana. We collect from your suppliers in Guangzhou, Yiwu and Shenzhen, pack everything together in our warehouse, and deliver to Tema port, Accra or Kumasi.',
      '中国与加纳之间的空运和海运。我们从广州、义乌、深圳的供应商处提货，在自有仓库集中打包，送达特马港、阿克拉或库马西。'],
    cut: ['Next sea consolidation closes', '下一批海运拼柜截止'], cutWhere: ['Guangzhou warehouse, 18:00 China time', '广州仓库，北京时间 18:00'],
    air: ['Air departures', '空运航班'], airWhen: ['Monday and Thursday, 7 to 12 days door to door', '每周一、周四，门到门 7 至 12 天'],
    ship: ['Sample shipment', '示例货运'], shipWhere: ['On the water, off the coast of Namibia', '海上运输中，纳米比亚海岸附近'],
    now: ['Right now', '此刻'],
  },
  facts: { sea: ['Sea freight', '海运'], seaV: ['45 to 60 days', '45 至 60 天'], air: ['Air freight', '空运'], airV: ['7 to 12 days', '7 至 12 天'], cons: ['Consolidation', '拼柜'], consV: ['Every Friday', '每周五'] },
  route: {
    h: ['One route, both ends covered', '一条航线，两端都有我们'],
    p: ['Goods leave Nansha or Yiwu, round the Cape of Good Hope and berth at Tema. Our people meet them on both sides.', '货物从南沙或义乌出发，绕过好望角，停靠特马港。航线两端都有我们的团队接应。'],
    stops: [['Guangzhou warehouse', '广州仓库'], ['Nansha port', '南沙港'], ['Cape of Good Hope', '好望角'], ['Tema port', '特马港'], ['Accra and Kumasi', '阿克拉与库马西']],
    stopNotes: [['Collected, checked, photographed', '提货、检查、拍照'], ['Loaded, sails weekly', '装柜，每周开船'], ['About 3 weeks at sea', '海上约 3 周'], ['Cleared by our team', '由我们的团队清关'], ['Delivered to your door', '送货上门']],
    miles: ['Nautical miles', '海里'], milesV: ['About 10,000', '约 10,000'], days: ['Door to door by sea', '海运门到门'], ships: ['Sailings a week', '每周船期'],
  },
  gallery: { h: ['Where your cargo goes', '您的货物会经过这里'], a: ['Container terminal', '集装箱码头'], b: ['Cranes at the berth', '泊位起重机'], c: ['Loaded and sailing', '装船起航'] },
  credits: ['Photographs: Open Images (Flickr), CC BY 2.0. Authors', '图片：Open Images（Flickr），CC BY 2.0。作者'],
  intro: {
    a: ['Buyers and a warehouse in', '采购团队和仓库在'], b: ['Guangzhou, customs and delivery in', '广州，清关和派送团队在'],
    c: ['Tema and Accra. One team at both ends of your', '特马和阿克拉。航线两端，同一个团队，从'], d: ['route.', '头到尾。'],
  },
  services: {
    h: ['What we move, and how', '我们运送什么，怎样运送'],
    good: ['Good for', '适合'], time: ['Typical time', '通常时间'], next: ['Your next step', '下一步'],
    sea: { name: ['Sea freight', '海运'], line: ['Full containers or a share of one, from Nansha and Yiwu to Tema.', '整柜或拼柜，从南沙、义乌运往特马。'],
      body: ['Most of our customers ship by sea. If you have less than a container, we put your cartons together with other customers\' goods in a shared container (LCL) and you pay only for the space you use, by the cubic metre. Bigger orders go in their own 20 or 40 foot container.', '我们大多数客户选择海运。货量不足一个货柜时，我们将您的货物与其他客户的货物拼装（拼柜），您只需按立方米支付实际占用的空间。大批量货物可单独使用 20 尺或 40 尺货柜。'],
      fit: ['Stock for shops, furniture, building materials, anything heavy that is not urgent.', '店铺库存、家具、建材，以及不急需的大件重货。'], cta: ['Price a sea shipment', '海运估价'] },
    air: { name: ['Air freight', '空运'], line: ['Twice a week from Guangzhou Baiyun to Kotoka, Accra.', '每周两班，从广州白云飞往阿克拉科托卡。'],
      body: ['For samples, phones and anything you need on the shelf this month. You pay by the kilogram, or by size when a box is large and light. Goods with batteries can fly with the right paperwork; liquids and powders go by sea.', '适合样品、手机以及本月就要上架的货物。按公斤计费；体积大而轻的货物按体积重计费。带电池的货物在文件齐全时可以空运；液体和粉末需走海运。'],
      fit: ['Samples, electronics, fashion, spare parts.', '样品、电子产品、服装、零配件。'], cta: ['Price an air shipment', '空运估价'] },
    warehouse: { name: ['Warehouse in Guangzhou', '广州仓库'], line: ['Receive, check, photograph and hold goods from many suppliers.', '接收、检查、拍照并存放来自多家供应商的货物。'],
      body: ['Send everything from your suppliers to one address. We count each delivery, photograph it, tell you what arrived and what is missing, and hold it until your order is complete. Then we pack it for the trip and it leaves on the next sailing or flight.', '让所有供应商把货发到同一个地址。我们清点每一批到货、拍照，告诉您哪些已到、哪些未到，并保管至订单齐全。然后打包，搭最近一班船或航班出运。'],
      fit: ['Buyers with several suppliers, anyone who wants to see goods before they ship.', '有多家供应商的买家，以及希望发货前看到货物的客户。'], cta: ['Ask about storage', '咨询仓储'] },
    collection: { name: ['Cargo collection', '上门提货'], line: ['We pick up from your supplier\'s door in China.', '我们到中国供应商门口提货。'],
      body: ['Give us the supplier\'s address and contact and we arrange the pickup, usually the same or the next day in Guangzhou and Yiwu, and within three days elsewhere in Guangdong and Zhejiang. You get a photo of the goods when they reach our warehouse.', '提供供应商地址和联系人，我们安排提货。广州、义乌通常当天或次日，广东、浙江其他地区三天内。货物到仓后您会收到照片。'],
      fit: ['Suppliers who do not deliver, factories outside the city.', '不送货的供应商，城外的工厂。'], cta: ['Book a collection', '预约提货'] },
    enquiry: { name: ['Shipment enquiries', '货运咨询'], line: ['Ask where your goods are, or what a shipment needs.', '询问货物位置，或某票货运需要什么。'],
      body: ['Not sure which way to ship, what papers you need, or what customs in Ghana will charge? Ask us. A person on our team answers within one working day, in English, Twi or Mandarin.', '不确定该怎么运、需要哪些文件，或加纳海关会收多少费用？请问我们。团队成员会在一个工作日内用英语、契维语或普通话回复。'],
      fit: ['First-time importers, anything unusual.', '首次进口的客户，以及特殊货物。'], cta: ['Send an enquiry', '发送咨询'] },
    quote: { name: ['Freight quotations', '运费报价'], line: ['An estimate in seconds, a confirmed price within a day.', '几秒得到估价，一天内确认价格。'],
      body: ['Use the calculator below for an estimate. When you send it to us we check the goods, the route and the sailing dates and come back with a confirmed price that includes collection, freight, and delivery to the address you choose.', '使用下方计算器获取估价。发送给我们后，我们会核对货物、路线和船期，回复包含提货、运费和派送到指定地址的确认价格。'],
      fit: ['Planning an order, comparing air and sea.', '规划订单，比较空运与海运。'], cta: ['Open the calculator', '打开计算器'] },
  },
  flow: {
    h: ['Many suppliers, one shipment', '多家供应商，一票货'],
    p: ['Most orders come from several factories. We bring them together in Guangzhou so you pay for one shipment, clear customs once, and receive one delivery.', '大多数订单来自多家工厂。我们在广州把货物集中起来，您只需支付一票运费、清关一次、收货一次。'],
    s1: ['Collect', '提货'], s1p: ['From each supplier\'s door, with a photo when it reaches us.', '从每家供应商门口提货，到仓后拍照告知。'],
    s2: ['Consolidate', '集货'], s2p: ['Checked, packed together and loaded on the next sailing or flight.', '检查、合并打包，搭最近一班船或航班。'],
    s3: ['Deliver', '派送'], s3p: ['Cleared in Tema or Accra and brought to your shop or store.', '在特马或阿克拉清关，送到您的店铺或仓库。'],
  },
  q: {
    h: ['What will it cost?', '运费是多少？'], p: ['An estimate from sample rates. Send it to us and we confirm the price within one working day.', '基于示例费率的估价。发送给我们，一个工作日内确认价格。'],
    mode: ['How', '方式'], sea: ['Sea', '海运'], air: ['Air', '空运'],
    from: ['Collect from', '提货地'], to: ['Deliver to', '送达'], goods: ['Goods', '货物'],
    guangzhou: ['Guangzhou', '广州'], yiwu: ['Yiwu', '义乌'], shenzhen: ['Shenzhen', '深圳'],
    tema: ['Tema port', '特马港'], accra: ['Accra, door', '阿克拉，送货上门'], kumasi: ['Kumasi, door', '库马西，送货上门'],
    general: ['General goods', '普通货物'], battery: ['With batteries', '带电池'], liquid: ['Liquids or powders', '液体或粉末'],
    cbm: ['Volume', '体积'], kg: ['Weight', '重量'], boxes: ['Size of your boxes', '箱子尺寸'],
    est: ['Estimate', '估价'], days: ['Time on the way', '运输时间'],
    liquidAir: ['Liquids and powders cannot fly. Switch to sea to price this.', '液体和粉末不能空运，请切换为海运估价。'],
    minNote: ['Minimum charge', '最低收费'], send: ['Send this to our team', '发送给我们的团队'],
    sent: ['Sent. Your reference is', '已发送。参考编号'], sentP: ['We reply within one working day with a confirmed price.', '我们会在一个工作日内回复确认价格。'],
    sample: ['Sample rates for this prototype, to be replaced by Golden Stone\'s own.', '原型示例费率，上线前替换为金石物流实际费率。'],
    cbmHelp: ['One cubic metre is about 10 large moving boxes.', '一立方米约等于 10 个大号搬家纸箱。'],
    kgHelp: ['Large light boxes are charged by size: length × width × height in cm ÷ 6000.', '大而轻的箱子按体积计费：长 × 宽 × 高（厘米）÷ 6000。'],
  },
  t: {
    h: ['Where is my shipment?', '我的货物在哪里？'], p: ['Enter the number on your receipt. Try the sample', '输入收据上的编号。试试示例'],
    btn: ['Track', '查询'], err: ['We can\'t find that number. Check it on your receipt, it starts with GSL.', '找不到该编号。请核对收据，编号以 GSL 开头。'],
    loading: ['Looking it up', '查询中'], soonAcc: ['Live tracking for every shipment arrives with customer accounts.', '所有货运的实时追踪将随客户账户一同推出。'],
    collected: ['Collected from supplier', '已从供应商提货'], warehouse: ['Checked in, Guangzhou warehouse', '已入广州仓库'], loaded: ['Loaded into container', '已装柜'],
    departed: ['Departed Nansha port', '已离开南沙港'], sea: ['On the water', '海上运输中'], arrived: ['Arrives Tema port', '抵达特马港'],
    customs: ['Customs cleared', '清关完成'], delivered: ['Delivered, Accra', '已送达阿克拉'],
    eta: ['Expected at your door', '预计送达'], pieces: ['cartons', '箱'],
  },
  o: { h: ['Two offices, one day', '两个办公室，同一天'], open: ['Open now', '营业中'], closed: ['Closed now', '已下班'],
    accra: ['Accra', '阿克拉'], guangzhou: ['Guangzhou', '广州'], accraP: ['Customs, delivery and customer care. Monday to Saturday, 8:00 to 18:00.', '清关、派送与客服。周一至周六 8:00 至 18:00。'],
    guangzhouP: ['Buying, collection and the warehouse. Monday to Saturday, 9:00 to 19:00.', '采购、提货与仓库。周一至周六 9:00 至 19:00。'],
    overlap: ['Both offices are open together from 9:00 to 10:00 Accra time.', '两地办公室在阿克拉时间 9:00 至 10:00 同时营业。'], addr: ['Address to be confirmed', '地址待确认'] },
  faq: { h: ['Questions people ask', '常见问题'] },
  c: {
    h: ['Tell us what you are shipping', '告诉我们您要运什么'], p: ['A person on our team replies within one working day.', '团队成员会在一个工作日内回复。'],
    name: ['Your name', '您的姓名'], phone: ['Phone or WhatsApp number', '电话或 WhatsApp 号码'], what: ['What are you shipping, and from where?', '运什么货，从哪里发？'],
    send: ['Send enquiry', '发送咨询'], wa: ['Chat on WhatsApp', 'WhatsApp 聊天'],
    ok: ['Thank you. We have your enquiry', '谢谢，我们已收到您的咨询'], okP: ['A reply comes within one working day.', '一个工作日内回复。'],
    needName: ['Add your name so we know who to ask for.', '请填写姓名，方便我们联系。'], needPhone: ['Add a number we can reach you on.', '请填写联系电话。'], needWhat: ['Tell us a little about the goods.', '请简单描述货物。'],
    waSoon: ['WhatsApp chat is coming with the launch. For now, send the form and we reply on WhatsApp if you prefer.', 'WhatsApp 聊天将在上线时开通。目前请提交表单，如您希望，我们会通过 WhatsApp 回复。'],
  },
  f: { line: ['Freight between China and Ghana, by air and sea.', '中国与加纳之间的空运和海运。'], reg: ['Company registration, licences and addresses to be confirmed by Golden Stone Logistics before launch.', '公司注册、执照及地址信息待金石物流上线前确认。'],
    proto: ['Design prototype with sample content.', '设计原型，内容为示例。'] },
  lang: ['中文', 'EN'],
}

export const FAQ = [
  { tab: ['Prices', '价格'], q: ['How do you work out the price?', '运费怎么计算？'], a: ['Sea freight is charged by the cubic metre of space your cartons take, air freight by the kilogram, or by size when a box is large and light. Collection in China and delivery in Ghana are added as separate lines so you can see each one.', '海运按货物占用的立方米计费，空运按公斤计费，体积大而轻的货物按体积重计费。中国提货和加纳派送费用单独列出，一目了然。'] },
  { tab: ['Customs', '清关'], q: ['Who pays duty in Ghana?', '加纳的关税由谁支付？'], a: ['Import duty and taxes are set by the Ghana Revenue Authority. We tell you the expected amount before the goods arrive and clear them for you; you can pay us or pay at the port.', '进口关税由加纳税务局规定。货物到港前我们会告知预估金额并代为清关，您可以付给我们，也可以在港口支付。'] },
  { tab: ['Timing', '时间'], q: ['When does my shipment leave?', '我的货什么时候出发？'], a: ['Shared sea containers close every week, usually on Friday. Air freight leaves on Monday and Thursday. Your goods leave on the first one after everything has reached our warehouse.', '拼柜海运每周截单一次，通常在周五。空运每周一、周四出发。货物全部到仓后搭最近一班出运。'] },
  { tab: ['Restricted', '限运'], q: ['What can\'t you carry?', '哪些货物不能运？'], a: ['Weapons, drugs, counterfeit brands and anything banned in Ghana or China. Liquids, powders and goods with loose batteries need extra checks and usually go by sea. Ask us if you are unsure.', '武器、毒品、假冒品牌以及中国或加纳禁止的物品。液体、粉末和带散装电池的货物需要额外检查，通常走海运。不确定时请咨询我们。'] },
  { tab: ['Insurance', '保险'], q: ['Is my cargo insured?', '货物有保险吗？'], a: ['Insurance is offered on every shipment as an option, priced as a share of the goods\' value. Terms will be confirmed by Golden Stone Logistics.', '每票货物都可选择购买保险，按货值比例计费。具体条款由金石物流确认。'] },
]

export const LangCtx = createContext('en')
export function useT() {
  const lang = useContext(LangCtx)
  const i = lang === 'zh' ? 1 : 0
  return (pair) => (Array.isArray(pair) ? pair[i] : pair && typeof pair === 'object' ? pair[lang] : pair)
}
