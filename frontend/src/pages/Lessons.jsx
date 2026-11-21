
import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  Clock,
  PlayCircle,
  Lock,
} from 'lucide-react'
import '../App.css'

const lessons = {
  Beginner: [
    {
      id: 1,
      title: 'Greetings & Introductions',
      description: 'Learn how to greet people and introduce yourself.',
      duration: '15 minutes',
      status: 'Available',
      path: '/lesson/greetings',
    },
    {
      id: 2,
      title: 'Numbers & Counting',
      description: 'Learn to sign numbers and count in everyday situations.',
      duration: '15 minutes',
      status: 'Coming soon',
      path: '/lesson/numbers',
    },
    {
      id: 3,
      title: 'Family & Relationships',
      description: 'Learn signs for family members and relationships.',
      duration: '20 minutes',
      status: 'Available',
      path: '/lesson/family',
    },
    {
      id: 4,
      title: 'Everyday Activities',
      description: 'Learn signs for common daily activities.',
      duration: '20 minutes',
      status: 'Coming soon',
      path: '/lesson/everyday',
    },
  ],

  Intermediate: [
    {
      id: 5,
      title: 'School & Education',
      description: 'Learn signs used in classrooms and learning environments.',
      duration: '20 minutes',
      status: 'Available',
      path: '/lesson/school',
    },
    {
      id: 6,
      title: 'Healthcare & Emergencies',
      description: 'Learn signs for health, safety and emergencies.',
      duration: '25 minutes',
      status: 'Coming soon',
      path: '/lesson/healthcare',
    },
    {
      id: 7,
      title: 'Feelings & Expressions',
      description: 'Learn to communicate emotions and feelings.',
      duration: '20 minutes',
      status: 'Coming soon',
      path: '/lesson/feelings',
    },
    {
      id: 8,
      title: 'Shopping & Money',
      description: 'Learn signs used when shopping and discussing money.',
      duration: '20 minutes',
      status: 'Coming soon',
      path: '/lesson/shopping',
    },
  ],

  Advanced: [
    {
      id: 9,
      title: 'Everyday Conversations',
      description: 'Practise communicating through longer conversations.',
      duration: '30 minutes',
      status: 'Coming soon',
      path: '/lesson/conversations',
    },
    {
      id: 10,
      title: 'Community & Social Interaction',
      description: 'Learn signs for social activities and community life.',
      duration: '30 minutes',
      status: 'Available',
      path: '/lesson/community',
    },
  ],
}

function Lessons() {
  const [activeLevel, setActiveLevel] = useState('Beginner')

  const currentLessons = lessons[activeLevel]

  return (
    <div className="lessons-page">
      <header className="lessons-header">
        <Link to="/dashboard" className="lessons-back">
          <ArrowLeft size={18} />
          Back to dashboard
        </Link>

        <div>
          <img src="/logo.png" alt="UNMUTE" className="brand-logo lessons-logo" />
          <h1>Explore Sign Language Lessons</h1>
          <p>
            Learn Ugandan Sign Language through visual demonstrations,
            practice and interactive activities.
          </p>
        </div>
      </header>

      <section className="lessons-content">
        <div className="lessons-intro">
          <div>
            <h2>Your learning journey</h2>
            <p>Choose a level and explore your lessons.</p>
          </div>

          <div className="lessons-total">
            <BookOpen size={20} />
            <span>10 lessons</span>
          </div>
        </div>

        <div className="lessons-level-tabs">
          {Object.keys(lessons).map((level) => (
            <button
              key={level}
              className={activeLevel === level ? 'active' : ''}
              onClick={() => setActiveLevel(level)}
            >
              {level}
            </button>
          ))}
        </div>

        <div className="lessons-grid">
          {currentLessons.map((lesson) => (
            <article className="lesson-card" key={lesson.id}>
              <div className="lesson-card-icon">
                <BookOpen size={26} />
              </div>

              <span className="lesson-level">{activeLevel}</span>

              <h3>{lesson.title}</h3>
              <p>{lesson.description}</p>

              <div className="lesson-card-footer">
                <span>
                  <Clock size={15} />
                  {lesson.duration}
                </span>

                {lesson.status === 'Available' ? (
  <Link to={lesson.path} className="lesson-start">
    <PlayCircle size={17} />
    Start lesson
  </Link>
) : (
  <span className="lesson-coming-soon">
    <Lock size={15} />
    Coming soon
  </span>
)}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Lessons
