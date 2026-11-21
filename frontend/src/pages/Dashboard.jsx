
import {
  BookOpen,
  Clock,
  Flame,
  GraduationCap,
  Hand,
  Handshake,
  Heart,
  MessageCircle,
  Play,
  Search,
  Stethoscope,
  Users,
  LogOut,
} from 'lucide-react'

import { useNavigate, Link } from 'react-router-dom'
import { useState } from 'react'
import '../App.css'

const categories = [
  {
    title: 'Greetings & Introductions',
    description: 'Learn how to greet people and introduce yourself.',
    icon: Hand,
    lessons: 8,
    lessonId: 'greetings',
  },
  {
    title: 'Family & Relationships',
    description: 'Talk about family members and relationships.',
    icon: Users,
    lessons: 10,
    lessonId: 'family',
  },
  {
    title: 'School & Education',
    description: 'Build communication skills for learning environments.',
    icon: GraduationCap,
    lessons: 9,
    lessonId: 'school',
  },
  {
    title: 'Everyday Communication',
    description: 'Practise useful signs for everyday situations.',
    icon: MessageCircle,
    lessons: 12,
    lessonId: 'everyday',
  },
  {
    title: 'Healthcare',
    description: 'Learn signs for common healthcare conversations.',
    icon: Stethoscope,
    lessons: 7,
    lessonId: 'healthcare',
  },
  {
    title: 'Community & Social Interaction',
    description: 'Communicate confidently in your community.',
    icon: Handshake,
    lessons: 8,
    lessonId: 'community',
  },
]

function Dashboard() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const currentUser = JSON.parse(
    sessionStorage.getItem('currentUser') || '{}'
  )

  const username = currentUser.username || 'Learner'
  const initial = username.charAt(0).toUpperCase()

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(search.toLowerCase())
  )

  const handleLogout = () => {
    sessionStorage.removeItem('authToken')
    sessionStorage.removeItem('currentUser')
    navigate('/')
  }

  return (
    <main className="dashboard-page">

      {/* Dashboard Header */}
      <header className="dashboard-header">
        <Link to="/" className="unmute-logo" aria-label="UNMUTE home">
          <img src="/logo.png" alt="UNMUTE" className="brand-logo" />
        </Link>

        <nav>
          <Link to="/">Home</Link>

          <Link to="/dashboard" className="dashboard-active">
            My learning
          </Link>

          <Link to="/community">
            Community
          </Link>
        </nav>

        <div className="dashboard-user-actions">
          <div className="dashboard-profile" title={username}>
            {initial}
          </div>

          <button
            className="dashboard-logout"
            onClick={handleLogout}
            title="Log out"
          >
            <LogOut size={18} />
            Log out
          </button>
        </div>
      </header>

      <section className="dashboard-content">

        {/* Welcome Section */}
        <div className="dashboard-welcome">
          <div>
            <span className="section-label">YOUR LEARNING SPACE</span>
            <h1>Welcome back, {username}!</h1>
            <p>
              Your journey towards better communication starts here.
            </p>
          </div>

          <span className="language-select">
            English
          </span>
        </div>

        {/* UNMUTE Video Guide */}
        <section className="dashboard-video-guide">
          <div className="video-guide-content">
            <span className="section-label">WELCOME TO UNMUTE</span>

            <h2>Discover how UNMUTE works</h2>

            <p>
              New here? Watch a visual guide to explore your dashboard,
              discover Ugandan Sign Language lessons and learn how to
              use our learning and community features.
            </p>

            <div className="video-guide-language">
              Ugandan Sign Language
            </div>
          </div>

          <div className="video-guide-preview">
            <video
              className="video-guide-video"
              src="/videos/unmute-demo.mp4"
              controls
              playsInline
              preload="metadata"
              aria-label="UNMUTE introduction video — sign-language demonstration"
            />
          </div>
        </section>

        {/* Learning Statistics */}
        <div className="dashboard-stats">
          <article className="stat-card">
            <BookOpen />
            <div>
              <strong>0</strong>
              <span>Lessons completed</span>
            </div>
          </article>

          <article className="stat-card">
            <Clock />
            <div>
              <strong>0 min</strong>
              <span>Learning time</span>
            </div>
          </article>

          <article className="stat-card">
            <Flame />
            <div>
              <strong>0 days</strong>
              <span>Learning streak</span>
            </div>
          </article>

          <article className="stat-card">
            <Heart />
            <div>
              <strong>Beginner</strong>
              <span>Your current level</span>
            </div>
          </article>
        </div>

        {/* Continue Learning */}
        <section className="continue-section">
          <div className="continue-info">
            <span className="section-label">YOUR FIRST STEP</span>

            <h2>Start learning Ugandan Sign Language</h2>

            <p>
              Begin with simple greetings and build your confidence
              one lesson at a time.
            </p>

            <button
              className="dashboard-primary"
              onClick={() => navigate('/lessons')}
            >
              <Play size={17} />
              Start your first lesson
            </button>
          </div>

          <div className="continue-art"><Hand size={78} strokeWidth={1.2} /></div>
        </section>

        {/* Learning Categories */}
        <section className="categories-section">
          <div className="categories-heading">
            <div>
              <span className="section-label">EXPLORE AND LEARN</span>
              <h2>Learning categories</h2>
            </div>

            <button
              className="view-all"
              onClick={() => navigate('/lessons')}
            >
              View all
            </button>
          </div>

          <div className="dashboard-search">
            <Search size={19} />

            <input
              type="text"
              placeholder="Search lessons and topics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="category-grid">
            {filteredCategories.map((category) => {
              const Icon = category.icon
              return (
                <article
                  className="category-card"
                  key={category.lessonId}
                  onClick={() => navigate(`/lesson/${category.lessonId}`)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      navigate(`/lesson/${category.lessonId}`)
                    }
                  }}
                >
                  <div className="category-emoji">
                    <Icon size={28} />
                  </div>

                  <h3>{category.title}</h3>

                  <p>{category.description}</p>

                  <span>{category.lessons} lessons</span>
                </article>
              )
            })}
          </div>

          {filteredCategories.length === 0 && (
            <p>No learning categories found.</p>
          )}
        </section>

        {/* Community Section */}
        <section className="community-banner">
          <div>
            <Users size={24} />

            <h2>Learning is better together.</h2>

            <p>
              Connect with others and grow through shared experiences.
            </p>

            <button
              className="dashboard-primary"
              onClick={() => navigate('/community')}
            >
              <MessageCircle size={17} />
              Visit Community
            </button>
          </div>

          <MessageCircle size={35} />
        </section>

      </section>
    </main>
  )
}

export default Dashboard
