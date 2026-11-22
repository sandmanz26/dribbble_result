import Shell from './Shell.jsx'
import LessonFlow from '../pages/LessonFlow.jsx'

export default function AppLesson() {
  return (
    <Shell role="student" title="Economics · 4.1.3 Price determination" sentence="Lesson 12 of 12 in this area. The question at the end is marked and saved to your record.">
      <LessonFlow mode="app" />
    </Shell>
  )
}
