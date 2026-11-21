
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Globe2,
  Hand,
  MessageCircle,
  PlayCircle,
  Sparkles,
  Users,
} from 'lucide-react'
import '../App.css'

function App() {
  const [language, setLanguage] = useState('en')
  const navigate = useNavigate()

  const isEnglish = language === 'en'
  const isLoggedIn = Boolean(sessionStorage.getItem('authToken'))

  const getStarted = () => {
    navigate(isLoggedIn ? '/dashboard' : '/register')
  }

  return (
    <main className="unmute-app">
      <header className="unmute-header">
        <Link to="/" className="unmute-logo" aria-label="UNMUTE home">
          <img src="/logo.png" alt="UNMUTE" className="brand-logo" />
        </Link>

        <nav className="unmute-nav">
          <Link to="/lessons">{isEnglish ? 'Learn' : 'Yiga'}</Link>
          <Link to="/communication">
            {isEnglish ? 'Communicate' : 'Wuliziganya'}
          </Link>
          <Link to="/community">
            {isEnglish ? 'Community' : 'Abantu'}
          </Link>
        </nav>

        <div className="header-actions">
          <div className="language-switch">
            <Globe2 size={17} />
            <button
              className={language === 'en' ? 'active' : ''}
              onClick={() => setLanguage('en')}
            >
              EN
            </button>
            <span>/</span>
            <button
              className={language === 'lg' ? 'active' : ''}
              onClick={() => setLanguage('lg')}
            >
              LG
            </button>
          </div>

          <button className="header-button" onClick={getStarted}>
            {isEnglish ? 'Get started' : 'Tandika'}
            <ArrowRight size={16} />
          </button>
        </div>
      </header>

      <section className="unmute-hero">
        <div className="hero-content">
          <span className="eyebrow">
            <Sparkles size={15} />
            {isEnglish
              ? 'COMMUNICATION WITHOUT BARRIERS'
              : 'OKWOGERAGANYA AWATATAGANYIZIBWA'}
          </span>

          <h1>
            {isEnglish ? (
              <>
                Every voice.
                <br />
                Every sign.
                <br />
                <span>Every story.</span>
              </>
            ) : (
              <>
                Buli ddoboozi.
                <br />
                Buli kabonero.
                <br />
                <span>Buli lugero.</span>
              </>
            )}
          </h1>

          <p className="hero-description">
            {isEnglish
              ? 'A place where Deaf and hearing communities learn, connect and communicate together through Ugandan Sign Language.'
              : 'Ekifo abantu abawulira n’abatawulira mwe bayigira, mwe bagattibwa era mwe bawuliziganya nga bayita mu Luganda n’Olulimi lw’Obubonero olw’omu Uganda.'}
          </p>

          <div className="hero-actions">
            <button onClick={getStarted} className="primary-button">
              {isEnglish ? 'Start learning' : 'Tandika okuyiga'}
              <ArrowRight size={18} />
            </button>

            <Link to="/communication" className="secondary-button">
              <PlayCircle size={19} />
              {isEnglish ? 'Explore UNMUTE' : 'Laba UNMUTE'}
            </Link>
          </div>
        </div>

        <div className="hero-visual">
          <div className="visual-card main-visual-card">
            <div className="visual-top">
              <span className="live-dot"></span>
              {isEnglish ? 'LEARN TOGETHER' : 'YIGIRA WAMU'}
            </div>

            <video
              className="hero-demo-video"
              src="/videos/unmute-demo.mp4"
              controls
              playsInline
              preload="metadata"
              aria-label={
                isEnglish
                  ? 'Demo video showing how UNMUTE works'
                  : 'Vidiyo eraga engeri UNMUTE gy’ekola'
              }
            />

            <div className="visual-caption">
              <span className="caption-label">
                {isEnglish ? 'A new way to connect' : 'Engeri empya ey’okwegatta'}
              </span>
              <strong>
                {isEnglish ? 'Learn Ugandan Sign Language' : 'Yiga Olulimi lw’Obubonero'}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="features-section" id="learn">
        <div className="section-heading">
          <span className="section-label">
            {isEnglish ? 'WHAT YOU CAN DO' : 'BY’OSOBOLA OKUKOLA'}
          </span>
          <h2>
            {isEnglish
              ? 'More than learning signs.'
              : 'Si kuyiga bubonero bwokka.'}
          </h2>
          <p>
            {isEnglish
              ? 'Build understanding, confidence and meaningful connections.'
              : 'Yongera okutegeeragana, obwesige n’enkolagana ennungi.'}
          </p>
        </div>

        <div className="feature-grid">
          <article className="feature-card" id="communicate">
            <div className="feature-icon purple-icon">
              <BookOpen size={25} />
            </div>
            <h3>{isEnglish ? 'Learn' : 'Yiga'}</h3>
            <p>
              {isEnglish
                ? 'Explore Ugandan Sign Language through guided lessons, demonstrations and practice.'
                : 'Yiga Olulimi lw’Obubonero olw’omu Uganda ng’oyambibwa amasomo n’okwegezaamu.'}
            </p>
            <Link to="/lessons">
              {isEnglish ? 'Explore lessons' : 'Laba amasomo'}
              <ArrowRight size={16} />
            </Link>
          </article>

          <article className="feature-card">
            <div className="feature-icon teal-icon">
              <MessageCircle size={25} />
            </div>
            <h3>{isEnglish ? 'Communicate' : 'Wuliziganya'}</h3>
            <p>
              {isEnglish
                ? 'Connect through visual conversations, shared videos and accessible communication tools.'
                : 'Wuliziganya n’abalala ng’oyita mu bifaananyi, vidiyo n’ebikozesebwa.'}
            </p>
            <Link to="/communication">
              {isEnglish ? 'Discover more' : 'Manya ebisingawo'}
              <ArrowRight size={16} />
            </Link>
          </article>

          <article className="feature-card" id="community">
            <div className="feature-icon orange-icon">
              <Users size={25} />
            </div>
            <h3>{isEnglish ? 'Connect' : 'Gatta abantu'}</h3>
            <p>
              {isEnglish
                ? 'Learn with others, share experiences and grow an inclusive community.'
                : 'Yiga n’abalala, gabana ebirowoozo era onyweezeze enkolagana.'}
            </p>
            <Link to="/community">
              {isEnglish ? 'Meet the community' : 'Sisinkana abantu'}
              <ArrowRight size={16} />
            </Link>
          </article>
        </div>
      </section>

      <footer className="unmute-footer">
        <Link to="/" className="unmute-logo" aria-label="UNMUTE home">
          <img src="/logo.png" alt="UNMUTE" className="brand-logo" />
        </Link>
        <p>Every voice. Every sign. Every story.</p>
      </footer>
    </main>
  )
}

export default App
