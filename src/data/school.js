// Placeholder schools. The brief asks the app to follow "the school's branding guidelines",
// so brand is a token set (name, crest letters, one accent) rather than hard-coded colour.
export const BRANDS = [
  { id: 'kestrel', name: 'Kestrel Hill School', short: 'Kestrel Hill', crest: 'KH', accent: '#a3195b', accentDark: '#f06aa6' },
  { id: 'harbour', name: 'Harbourview College', short: 'Harbourview', crest: 'HC', accent: '#1d6b52', accentDark: '#5fcfa6' },
  { id: 'aldine', name: 'Aldine Grammar', short: 'Aldine', crest: 'AG', accent: '#b4530f', accentDark: '#f2a061' },
]

export const GRADES = [7, 8, 9, 10, 11, 12]
export const SECTIONS = ['A', 'B']
export const HOUSES = ['Ash', 'Birch', 'Cedar', 'Rowan']
export const SUBJECTS = ['Mathematics', 'English', 'Science', 'History', 'Geography', 'Art']

// Demo clock: everything in the prototype is relative to this moment.
export const NOW = new Date('2027-02-18T08:42:00')
export const TERMS = [
  { id: 'T1', label: 'Term 1 final', short: 'T1' },
  { id: 'T2', label: 'Term 2 midterm', short: 'T2 mid' },
]

export const USERS = {
  registrar: {
    id: 'u-registrar', name: 'Marisol Ventura', first: 'Marisol', role: 'registrar', title: 'Registrar',
    can: { editRecords: true, addStudents: true, viewSensitive: true, approveMarks: true, exportData: true },
    classes: null,
  },
  teacher: {
    id: 'u-teacher', name: 'Tomasz Wilk', first: 'Tomasz', role: 'teacher', title: 'Class teacher, 9B',
    can: { editRecords: false, addStudents: false, viewSensitive: false, approveMarks: false, exportData: false },
    classes: ['9A', '9B', '10B'],
    subject: 'Mathematics',
  },
}

export const DEMO_PIN = '1357'
