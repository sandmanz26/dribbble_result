// White-label brands. Only these tokens change between co-ops; every screen stays the same.
// Names are samples for the prototype.
export const BRANDS = {
  nakheel: {
    id: 'nakheel',
    name: { ar: 'جمعية النخيل التعاونية', en: 'Al Nakheel Co-op' },
    short: { ar: 'النخيل', en: 'Nakheel' },
    primary: '#0d6b4e', onPrimary: '#ffffff', tint: '#e3efe9', ink: '#0a3d2d',
    mark: 'palm',
  },
  bahar: {
    id: 'bahar',
    name: { ar: 'جمعية البحر التعاونية', en: 'Al Bahar Co-op' },
    short: { ar: 'البحر', en: 'Bahar' },
    primary: '#1557a6', onPrimary: '#ffffff', tint: '#e4ecf7', ink: '#0d3566',
    mark: 'wave',
  },
  ward: {
    id: 'ward',
    name: { ar: 'جمعية الورد التعاونية', en: 'Al Ward Co-op' },
    short: { ar: 'الورد', en: 'Ward' },
    primary: '#b0283f', onPrimary: '#ffffff', tint: '#f6e5e8', ink: '#6e1626',
    mark: 'petal',
  },
}

export const BRANCHES = [
  { id: 'main', name: { ar: 'الفرع الرئيسي، قطعة ٢', en: 'Main branch, Block 2' }, open: '08:00 - 24:00' },
  { id: 'b4', name: { ar: 'فرع قطعة ٤', en: 'Block 4 branch' }, open: '07:00 - 23:00' },
]
