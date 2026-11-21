
import { useState } from 'react'
import {
  MessageCircle,
  Search,
  HandHelping,
  Heart,
  ShoppingBag,
  GraduationCap,
  Stethoscope,
  Users,
  ArrowLeft,
  X,
  Languages,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import '../App.css'

const categories = [
  { name: 'All phrases', icon: MessageCircle },
  { name: 'Greetings', icon: Heart },
  { name: 'Healthcare', icon: Stethoscope },
  { name: 'Shopping', icon: ShoppingBag },
  { name: 'Education', icon: GraduationCap },
  { name: 'Getting help', icon: HandHelping },
]

const phrases = [
  {
    id: 1,
    category: 'Greetings',
    english: 'Hello, how are you?',
    luganda: 'Oli otya?',
    description: 'A friendly greeting to start a conversation.',
    video: '/videos/lessons/greetings/hello.mp4',
  },
  {
    id: 2,
    category: 'Greetings',
    english: 'My name is...',
    luganda: 'Erinnya lyange...',
    description: 'Introduce yourself to someone.',
    video: '/videos/introduction.mp4',
  },
  {
    id: 3,
    category: 'Greetings',
    english: 'Thank you',
    luganda: 'Webale',
    description: 'Express gratitude.',
    video: '/videos/lessons/greetings/thank-you.mp4',
  },
  {
    id: 4,
    category: 'Getting help',
    english: 'Please help me',
    luganda: 'Nsaba onnyambe',
    description: 'Ask someone for assistance.',
    video: '/videos/lessons/greetings/good-morning.mp4',
  },
  {
    id: 5,
    category: 'Getting help',
    english: 'I do not understand',
    luganda: 'Sitegeera',
    description: 'Let someone know you need clarification.',
    video: '/videos/conversation.mp4',
  },
  {
    id: 6,
    category: 'Healthcare',
    english: 'I need a doctor',
    luganda: 'Nneetaaga omusawo',
    description: 'Communicate a medical need.',
    video: '/videos/lessons/school/student.mp4',
  },
  {
    id: 7,
    category: 'Healthcare',
    english: 'I am in pain',
    luganda: 'Nnumwa',
    description: 'Explain that you are experiencing pain.',
    video: '/videos/lessons/family/family2.mp4',
  },
  {
    id: 8,
    category: 'Shopping',
    english: 'How much does this cost?',
    luganda: 'Kino kya ssente mmeka?',
    description: 'Ask for the price of an item.',
    video: '/videos/lessons/community/store.mp4',
  },
  {
    id: 9,
    category: 'Shopping',
    english: 'I would like to buy this',
    luganda: 'Njagala okugula kino',
    description: 'Tell a seller you want to purchase something.',
    video: '/videos/lessons/community/house.mp4',
  },
  {
    id: 10,
    category: 'Education',
    english: 'I need help with this lesson',
    luganda: 'Nneetaaga obuyambi ku ssomo lino',
    description: 'Ask a teacher or classmate for help.',
    video: '/videos/lessons/school/kindergaten.mp4',
  },
  {
    id: 11,
    category: 'Education',
    english: 'Please repeat',
    luganda: 'Nsaba oddemu',
    description: 'Ask someone to repeat what they said.',
    video: '/videos/lessons/greetings/goodbye.mp4',
  },
  {
    id: 12,
    category: 'Getting help',
    english: 'Please write it down',
    luganda: 'Nsaba kiwandiike',
    description: 'Request written communication.',
    video: '/videos/lessons/family/family.mp4',
  },
]

function Communication() {
  const navigate = useNavigate()

  const [language, setLanguage] = useState('en')
  const [activeCategory, setActiveCategory] = useState('All phrases')
  const [search, setSearch] = useState('')
  const [selectedPhrase, setSelectedPhrase] = useState(null)

  const filteredPhrases = phrases.filter((phrase) => {
    const matchesCategory =
      activeCategory === 'All phrases' ||
      phrase.category === activeCategory

    const matchesSearch =
      phrase.english.toLowerCase().includes(search.toLowerCase()) ||
      phrase.luganda.toLowerCase().includes(search.toLowerCase()) ||
      phrase.category.toLowerCase().includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="communication-page">

      <header className="communication-header">
        <div className="communication-logo">
          <img src="/logo.png" alt="UNMUTE" className="brand-logo" />
        </div>

        <nav className="communication-nav">
          <button onClick={() => navigate('/dashboard')}>
            Dashboard
          </button>

          <button className="communication-nav-active">
            Communicate
          </button>

          <button onClick={() => navigate('/lesson')}>
            Learn
          </button>
        </nav>

        <button
          className="communication-language-button"
          onClick={() => setLanguage(language === 'en' ? 'lg' : 'en')}
        >
          <Languages size={18} />
          {language === 'en' ? 'English' : 'Luganda'}
        </button>
      </header>

      <main className="communication-main">

        <button
          className="communication-back-button"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={18} />
          Back to dashboard
        </button>

        <section className="communication-hero">
          <div className="communication-hero-content">
            <span className="communication-eyebrow">
              EVERY VOICE MATTERS
            </span>

            <h1>
              {language === 'en'
                ? 'Communicate without barriers.'
                : 'Yogera awatali biziyiza.'}
            </h1>

            <p>
              {language === 'en'
                ? 'Explore helpful phrases for everyday situations and make communication easier for everyone.'
                : 'Yiga ebigambo ebyangu okukozesa mu mbeera ezabulijjo.'}
            </p>
          </div>

          <div className="communication-hero-icon">
            <MessageCircle size={70} />
            <Heart size={32} />
          </div>
        </section>

        <section className="communication-search-section">
          <div className="communication-search">
            <Search size={20} />

            <input
              type="text"
              placeholder={
                language === 'en'
                  ? 'Search phrases...'
                  : 'Noonya ebigambo...'
              }
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            {search && (
              <button onClick={() => setSearch('')}>
                <X size={18} />
              </button>
            )}
          </div>
        </section>

        <section className="communication-categories">
          <h2>
            {language === 'en'
              ? 'Explore categories'
              : 'Londa ekika'}
          </h2>

          <div className="communication-category-list">
            {categories.map((category) => {
              const Icon = category.icon

              return (
                <button
                  key={category.name}
                  className={`communication-category ${
                    activeCategory === category.name
                      ? 'communication-category-active'
                      : ''
                  }`}
                  onClick={() => setActiveCategory(category.name)}
                >
                  <Icon size={18} />
                  {category.name}
                </button>
              )
            })}
          </div>
        </section>

        <section className="communication-phrases-section">
          <div className="communication-section-heading">
            <div>
              <h2>
                {language === 'en'
                  ? 'Useful phrases'
                  : 'Ebigambo eby’omugaso'}
              </h2>

              <p>
                {filteredPhrases.length} phrases available
              </p>
            </div>
          </div>

          <div className="communication-phrase-grid">
            {filteredPhrases.map((phrase) => (
              <button
                key={phrase.id}
                className="communication-phrase-card"
                onClick={() => setSelectedPhrase(phrase)}
              >
                <span className="communication-phrase-category">
                  {phrase.category}
                </span>

                <h3>
                  {language === 'en'
                    ? phrase.english
                    : phrase.luganda}
                </h3>

                <p>
                  {language === 'en'
                    ? phrase.luganda
                    : phrase.english}
                </p>

                <span className="communication-card-action">
                  View phrase →
                </span>
              </button>
            ))}
          </div>

          {filteredPhrases.length === 0 && (
            <div className="communication-empty">
              <Search size={35} />
              <h3>No phrases found</h3>
              <p>Try another search or category.</p>
            </div>
          )}
        </section>

        <section className="communication-community-banner">
          <div>
            <Users size={32} />

            <h2>
              Communication connects us.
            </h2>

            <p>
              Learn, practise and create a more inclusive community.
            </p>
          </div>

          <button onClick={() => navigate('/lesson')}>
            Start learning UgSL →
          </button>
        </section>

      </main>

      {selectedPhrase && (
        <div
          className="communication-modal-overlay"
          onClick={() => setSelectedPhrase(null)}
        >
          <div
            className="communication-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="communication-modal-close"
              onClick={() => setSelectedPhrase(null)}
            >
              <X size={22} />
            </button>

            <span className="communication-phrase-category">
              {selectedPhrase.category}
            </span>

            <h2>{selectedPhrase.english}</h2>

            <div className="communication-modal-translation">
              {selectedPhrase.luganda}
            </div>

            <p>{selectedPhrase.description}</p>

            {selectedPhrase.video ? (
              <div className="lesson-concept-video">
                <video
                  controls
                  playsInline
                  preload="metadata"
                  className="concept-video-player"
                >
                  <source src={selectedPhrase.video} type="video/mp4" />
                  Your browser does not support video playback.
                </video>
              </div>
            ) : (
              <div className="communication-sign-placeholder">
                <HandHelping size={40} />

                <h3>Sign demonstration</h3>

                <p>
                  An authentic Ugandan Sign Language demonstration
                  will be available here.
                </p>

                <span>Video coming soon</span>
              </div>
            )}

            <button
              className="communication-modal-button"
              onClick={() => setSelectedPhrase(null)}
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  )
}

export default Communication
