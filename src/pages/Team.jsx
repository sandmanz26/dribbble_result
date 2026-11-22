import { Link } from 'react-router-dom'
import { Icon, Section } from '../ui/kit.jsx'
import { SiteFooter, SiteNav } from '../ui/SiteChrome.jsx'

// The client's own team and words, from examace.co.uk. Portraits to come from the client: no stand-in faces.
const TEAM = [
  {
    name: 'Jonathan Pledger',
    role: 'Founder · Business and Economics',
    years: '30 years teaching, 18 examining',
    bio: 'BA in Business Studies and a PGCE in Business Education from Brighton University. Head of Faculty, A-Level examiner, and once Principal of a UK higher education college.',
    tip: 'The gap between analysis and evaluation is one of the biggest I see in exam scripts, and it is rarely taught properly.',
    initials: 'JP',
  },
  {
    name: 'Anna White',
    role: 'Sociology · Head of Faculty',
    years: '23 years teaching',
    bio: 'BA in Sociology from the University of Sussex and a PGCE from the Institute of Education. Head of Faculty for Social Science at a South West London sixth form. Has examined for AQA and is a published author for OCR.',
    tip: 'Practise questions every week on the topics you have just covered. Do that consistently and revision becomes a breeze.',
    initials: 'AW',
  },
  {
    name: 'Charlotte Hopwood',
    role: 'Psychology · Head of Department',
    years: '11 years teaching, 10 as Head of Department',
    bio: 'BSc in Psychology, and a PGCE with QTS from UCL’s Institute of Education. Examines alongside teaching.',
    tip: 'If someone reading your answer back could still say “but why?”, it needs more detail.',
    initials: 'CH',
  },
]

const PROCESS = [
  ['Written to the spec', 'Each lesson is one spec point, in the board’s order and numbering, from no prior knowledge to exam depth.'],
  ['Marked to the mark scheme', 'Marking rules come from the board’s level descriptors and assessment objectives, written by an examiner for that board.'],
  ['AOs from lesson one', 'Every lesson shows how its content earns knowledge, application, analysis and evaluation marks, not only what to know.'],
  ['A teacher can always check', 'In a school, a teacher can read and change any AI mark before it reaches the student.'],
]

export default function Team() {
  return (
    <div className="site">
      <SiteNav />
      <main id="main">
        <section className="page-head team-head">
          <h1 className="page-h">The examiners</h1>
          <p className="lead">Three teachers who have marked the real thing, with 67 years of A-Level teaching and examining between them.</p>
          <figure className="team-photo">
            <img className="photo" src="img/classroom.webp" width="1600" height="900" alt="An economics lesson in a sixth-form classroom, the teacher pointing at a diagram on the whiteboard" />
          </figure>
        </section>
        <Section className="team-list" aria-label="The team">
          {TEAM.map((t) => (
            <article className="person" key={t.name} data-rise>
              <div className="person-mark" aria-hidden="true">
                {t.initials}
              </div>
              <div className="person-text">
                <h2>{t.name}</h2>
                <p className="person-role">
                  {t.role} · {t.years}
                </p>
                <p>{t.bio}</p>
              </div>
              <blockquote className="person-tip">
                <p>“{t.tip}”</p>
              </blockquote>
            </article>
          ))}
        </Section>
        <Section className="process" aria-labelledby="proc-h">
          <h2 id="proc-h" className="h-head" data-rise>
            How a lesson gets made
          </h2>
          <dl className="process-list">
            {PROCESS.map(([t, d]) => (
              <div key={t} data-rise>
                <dt>{t}</dt>
                <dd>{d}</dd>
              </div>
            ))}
          </dl>
          <Link to="/taster/economics" className="btn" data-rise>
            Try a lesson Jonathan wrote <Icon name="arrowRight" />
          </Link>
        </Section>
      </main>
      <SiteFooter />
    </div>
  )
}
