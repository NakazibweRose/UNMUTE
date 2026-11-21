
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle,
  PlayCircle,
  Clock,
  Award,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Trophy,
  RotateCcw,
} from 'lucide-react'
import '../App.css'

const lessonContent = {
  EN: {
    back: 'Back to dashboard',
    label: 'BEGINNER LESSON',
    title: 'Greetings & Introductions',
    description: 'Learn about greetings and how people introduce themselves in everyday conversations.',
    duration: '10 minutes',
    level: 'Beginner',
    progress: 'YOUR PROGRESS',
    objective: 'What you will learn',
    objectives: [
      'Understand the importance of greetings.',
      'Learn when and how introductions are used.',
      'Practise communicating in everyday situations.',
    ],
    demonstration: 'Ugandan Sign Language demonstration',
    placeholder: 'An expert-validated UgSL video demonstration will appear here.',
    videoNote: 'Video lesson coming soon',
    vocabulary: 'Explore the concepts',
    vocabularyDescription: 'Open each card to learn more about the ideas covered in this lesson.',
    
cards: [
  {
    title: 'Greeting',
    subtitle: 'Starting a conversation',
    video: '/videos/greetings.mp4',
    description: 'A greeting is a way of acknowledging another person and opening a conversation. Greetings can vary depending on the person and situation.',
  },
  {
    title: 'Introduction',
    subtitle: 'Sharing who you are',
    video: '/videos/introduction.mp4',
    description: 'An introduction helps people get to know one another. It can include sharing your name or other information about yourself.',
  },
  {
    title: 'Conversation',
    subtitle: 'Communicating with others',
    video: '/videos/conversation.mp4',
    description: 'A conversation is an exchange between people. It can happen through signing, speaking, writing or other communication methods.',
  },
  {
    title: 'Hello',
    subtitle: 'Greeting someone',
    video: '/videos/lessons/greetings/hello.mp4',
    description: 'A simple, friendly way to greet another person and open an interaction.',
  },
  {
    title: 'Good morning',
    subtitle: 'A morning greeting',
    video: '/videos/lessons/greetings/good-morning.mp4',
    description: 'A warm way to greet someone at the start of the day.',
  },
  {
    title: 'Thank you',
    subtitle: 'Showing appreciation',
    video: '/videos/lessons/greetings/thank-you.mp4',
    description: 'Used to express gratitude after someone helps or supports you.',
  },
  {
    title: 'Goodbye',
    subtitle: 'Ending a conversation',
    video: '/videos/lessons/greetings/goodbye.mp4',
    description: 'A friendly way to close a conversation and part ways.',
  },
],

    quizTitle: 'Quick knowledge check',
    quizDescription: 'Choose the best answer to test your understanding.',
    question: 'Why are greetings important in everyday communication?',
    answers: [
      'They help people begin conversations.',
      'They replace every other form of communication.',
      'They are only used in schools.',
    ],
    check: 'Check my answer',
    choose: 'Choose an answer before continuing.',
    correct: 'Excellent! That is the correct answer.',
    incorrect: 'Not quite. Try again and think about the purpose of a greeting.',
    retry: 'Try again',
    complete: 'Complete lesson',
    completed: 'Lesson completed!',
    completedMessage: 'Great work! You have completed this lesson’s knowledge check.',
    backDashboard: 'Return to dashboard',
  },
  LG: {
    back: 'Ddayo ku dashboard',
    label: 'ESSOMO LY’ABATANDISI',
    title: 'Okulamusa n’Okwewanjulira',
    description: 'Yiga ku kulamusa n’engeri abantu gye beeyanjuliramu mu mboozi eza bulijjo.',
    duration: 'Ddakiika 10',
    level: 'Omutandisi',
    progress: 'ENKULAAKULANA YO',
    objective: 'By’ojja okuyiga',
    objectives: [
      'Okutegeera obukulu bw’okulamusa.',
      'Okumanya ddi n’engeri y’okwewanjuliramu.',
      'Okwegezaamu empuliziganya mu mbeera eza bulijjo.',
    ],
    demonstration: 'Eky’okulabirako kya Lugha ya Bakiggala eya Uganda',
    placeholder: 'Vidiyo ekakasiddwa omukugu mu Lugha ya Bakiggala eya Uganda ejja kulabikira wano.',
    videoNote: 'Essomo lya vidiyo lijja kubaawo oluvannyuma',
    vocabulary: 'Tegeera ebigambo bino',
    vocabularyDescription: 'Nyiga ku buli kaadi omanye ebisingawo ku nsonga eziri mu ssomo lino.',
    cards: [
  {
    title: 'Okulamusa',
    subtitle: 'Okutandika emboozi',
    video: '/videos/greetings.mp4',
    description: 'Okulamusa kwe kwoleka nti olabye omuntu n’okutandika emboozi naye.',
  },
  {
    title: 'Okwanjula',
    subtitle: 'Okwogera ku ggwe kennyini',
    video: '/videos/introduction.mp4',
    description: 'Okwanjula kuyamba abantu okumanyagana, gamba ng’okwogera erinnya lyo.',
  },
  {
    title: 'Emboozi',
    subtitle: 'Okutegeeza n’abalala',
    video: '/videos/conversation.mp4',
    description: 'Emboozi kwe kuwaŋŋana ebirowoozo wakati w’abantu nga bakozesa obubonero, okwogera, okuwandiika oba engeri endala ez’empuliziganya.',
  },
  {
    title: 'Oli otya',
    subtitle: 'Okulamusa omuntu',
    video: '/videos/lessons/greetings/hello.mp4',
    description: 'Engeri ennyangu era ey’omukwano ey’okulamusa omuntu n’okutandika emboozi.',
  },
  {
    title: 'Wasuze otya',
    subtitle: 'Okulamusa ku makya',
    video: '/videos/lessons/greetings/good-morning.mp4',
    description: 'Engeri ennungi ey’okulamusa omuntu ku makya.',
  },
  {
    title: 'Weebale',
    subtitle: 'Okulaga okwebaza',
    video: '/videos/lessons/greetings/thank-you.mp4',
    description: 'Kikozesebwa okulaga okwebaza ng’omuntu akuyambye.',
  },
  {
    title: 'Weeraba',
    subtitle: 'Okusiibula',
    video: '/videos/lessons/greetings/goodbye.mp4',
    description: 'Engeri ennungi ey’okusiibula ng’emboozi ewedde.',
  },
],
    quizTitle: 'Kebera by’oyize',
    quizDescription: 'Londa eky’okuddamu ekisinga obutuufu.',
    question: 'Lwaki okulamusa kikulu mu mpuliziganya eya bulijjo?',
    answers: [
      'Kuyamba abantu okutandika emboozi.',
      'Kudda mu kifo ky’engeri endala zonna ez’empuliziganya.',
      'Kukozesebwa mu masomero mwokka.',
    ],
    check: 'Kebera eky’okuddamu',
    choose: 'Londa eky’okuddamu okusobola okugenda mu maaso.',
    correct: 'Bulungi nnyo! Eky’okuddamu kituufu.',
    incorrect: 'Si bwe kiri. Ddamu ogezeeko.',
    retry: 'Ddamu ogezeeko',
    complete: 'Maliriza essomo',
    completed: 'Omala essomo!',
    completedMessage: 'Weebale! Omala okukebera by’oyize mu ssomo lino.',
    backDashboard: 'Ddayo ku dashboard',
  },
}

const familyLessonContent = {
  EN: {
    ...lessonContent.EN,
    label: 'BEGINNER LESSON',
    title: 'Family & Relationships',
    description: 'Learn about family and relationships through UgSL video demonstrations.',
    duration: '10 minutes',
    level: 'Beginner',
    objectives: [
      'Explore vocabulary related to family.',
      'Watch the family video demonstrations.',
      'Practise communicating about family and relationships.',
    ],
    demonstration: 'Ugandan Sign Language: Family',
    placeholder: 'Watch the family video demonstrations below.',
    videoNote: 'Family video demonstrations',
    vocabulary: 'Explore family vocabulary',
    vocabularyDescription: 'Watch both videos and explore the concepts covered in this lesson.',
    cards: [
      {
        title: 'Family – Part 1',
        subtitle: 'Family vocabulary demonstration',
        video: '/videos/lessons/family/family.mp4',
        description: 'Watch this video demonstration and practise the signs presented.',
      },
      {
        title: 'Family – Part 2',
        subtitle: 'More family vocabulary',
        video: '/videos/lessons/family/family2.mp4',
        description: 'Watch the second video demonstration and practise the signs presented.',
      },
    ],
    quizTitle: 'Quick knowledge check',
    quizDescription: 'Choose the best answer to test your understanding.',
    question: 'What is one way to learn family-related signs?',
    answers: [
      'Watch and practise the video demonstrations.',
      'Skip the demonstrations.',
      'Avoid practising what you learn.',
    ],
    check: 'Check my answer',
    choose: 'Choose an answer before continuing.',
    correct: 'Excellent! That is the correct answer.',
    incorrect: 'Not quite. Try again.',
    retry: 'Try again',
    complete: 'Complete lesson',
    completed: 'Lesson completed!',
    completedMessage: 'Great work! You have completed this lesson’s knowledge check.',
    backDashboard: 'Return to dashboard',
  },

  LG: {
    ...lessonContent.LG,
    label: 'ESSOMO LY’ABATANDISI',
    title: 'Amaka n’Enkolagana',
    description: 'Yiga ku maka n’enkolagana ng’oyita mu vidiyo ez’obubonero.',
    duration: 'Ddakiika 10',
    level: 'Omutandisi',
    objectives: [
      'Okwekennenya ebigambo ebikwata ku maka.',
      'Okulaba vidiyo ez’obubonero obukwata ku maka.',
      'Okwegezaamu empuliziganya ku maka n’enkolagana.',
    ],
    demonstration: 'Lugha ya Bakiggala eya Uganda: Amaka',
    placeholder: 'Laba vidiyo ez’obubonero ezikwata ku maka wansi.',
    videoNote: 'Vidiyo ezikwata ku maka',
    vocabulary: 'Yiga ebikwata ku maka',
    vocabularyDescription: 'Laba vidiyo zombi era wegezeemu obubonero obulimu.',
    cards: [
      {
        title: 'Amaka – Ekitundu 1',
        subtitle: 'Vidiyo y’obubonero obukwata ku maka',
        video: '/videos/lessons/family/family.mp4',
        description: 'Laba vidiyo eno era wegezeemu obubonero obulagiddwa.',
      },
      {
        title: 'Amaka – Ekitundu 2',
        subtitle: 'Obubonero obulala obukwata ku maka',
        video: '/videos/lessons/family/family2.mp4',
        description: 'Laba vidiyo eyookubiri era wegezeemu obubonero obulimu.',
      },
    ],
    quizTitle: 'Kebera by’oyize',
    quizDescription: 'Londa eky’okuddamu ekisinga obutuufu.',
    question: 'Engeri emu ey’okuyiga obubonero obukwata ku maka y’eruwa?',
    answers: [
      'Okulaba vidiyo n’okwegezaamu obubonero.',
      'Obutalaba vidiyo.',
      'Obutwegezaamu bye tuyize.',
    ],
    check: 'Kebera eky’okuddamu',
    choose: 'Londa eky’okuddamu okusobola okugenda mu maaso.',
    correct: 'Bulungi nnyo! Eky’okuddamu kituufu.',
    incorrect: 'Si bwe kiri. Ddamu ogezeeko.',
    retry: 'Ddamu ogezeeko',
    complete: 'Maliriza essomo',
    completed: 'Omala essomo!',
    completedMessage: 'Weebale! Omala okukebera by’oyize mu ssomo lino.',
    backDashboard: 'Ddayo ku dashboard',
  },
}
const schoolLessonContent = {
  EN: {
    ...lessonContent.EN,
    label: 'BEGINNER LESSON',
    title: 'School & Education',
    description: 'Explore school life, students and the importance of school rules through UgSL demonstrations.',
    duration: '15 minutes',
    level: 'Beginner',
    objectives: [
      'Learn about school and education vocabulary.',
      'Explore concepts related to students and school rules.',
      'Practise communicating about school life.',
    ],
    demonstration: 'Ugandan Sign Language: School & Education',
    placeholder: 'Watch the school demonstrations below.',
    videoNote: 'School video demonstrations',
    vocabulary: 'Explore school vocabulary',
    vocabularyDescription: 'Watch the videos and practise the concepts presented.',
    cards: [
      {
        title: 'Kindergarten',
        subtitle: 'Learning about early education',
        video: '/videos/lessons/school/kindergaten.mp4',
        description: 'Watch the demonstration and practise the signs presented.',
      },
      {
        title: 'School Rules',
        subtitle: 'Understanding school rules',
        video: '/videos/lessons/school/school%20rules.mp4',
        description: 'Watch the demonstration and practise the signs presented.',
      },
      {
        title: 'Student',
        subtitle: 'Learning about students',
        video: '/videos/lessons/school/student.mp4',
        description: 'Watch the demonstration and practise the signs presented.',
      },
    ],
    quizTitle: 'Quick knowledge check',
    quizDescription: 'Choose the best answer to test your understanding.',
    question: 'Why are school rules important?',
    answers: [
      'They help maintain order and a safe learning environment.',
      'They prevent students from learning.',
      'They are only important outside school.',
    ],
    check: 'Check my answer',
    choose: 'Choose an answer before continuing.',
    correct: 'Excellent! That is the correct answer.',
    incorrect: 'Not quite. Try again.',
    retry: 'Try again',
    complete: 'Complete lesson',
    completed: 'Lesson completed!',
    completedMessage: 'Great work! You have completed this lesson’s knowledge check.',
    backDashboard: 'Return to dashboard',
  },

  LG: {
    ...lessonContent.LG,
    label: 'ESSOMO LY’ABATANDISI',
    title: 'Essomero n’Ebyenjigiriza',
    description: 'Yiga ku bulamu bw’essomero, abayizi n’amateeka agafuga essomero ng’oyita mu bubonero bwa UgSL.',
    duration: 'Ddakiika 15',
    level: 'Omutandisi',
    objectives: [
      'Okuyiga ebigambo ebikwata ku ssomero n’ebyenjigiriza.',
      'Okutegeera ebikwata ku bayizi n’amateeka g’essomero.',
      'Okwegezaamu okwogera ku bulamu bw’essomero.',
    ],
    demonstration: 'Lugha ya Bakiggala eya Uganda: Essomero',
    placeholder: 'Laba vidiyo ezikwata ku ssomero wansi.',
    videoNote: 'Vidiyo z’essomero',
    vocabulary: 'Yiga ebikwata ku ssomero',
    vocabularyDescription: 'Laba vidiyo era wegezeemu obubonero obulimu.',
    cards: [
      {
        title: 'Essomero ly’Abato',
        subtitle: 'Ebyenjigiriza eby’abato',
        video: '/videos/lessons/school/kindergaten.mp4',
        description: 'Laba vidiyo eno era wegezeemu obubonero obulagiddwa.',
      },
      {
        title: 'Amateeka g’Essomero',
        subtitle: 'Okutegeera amateeka g’essomero',
        video: '/videos/lessons/school/school%20rules.mp4',
        description: 'Laba vidiyo eno era wegezeemu obubonero obulagiddwa.',
      },
      {
        title: 'Omuyizi',
        subtitle: 'Okuyiga ebikwata ku bayizi',
        video: '/videos/lessons/school/student.mp4',
        description: 'Laba vidiyo eno era wegezeemu obubonero obulagiddwa.',
      },
    ],
    quizTitle: 'Kebera by’oyize',
    quizDescription: 'Londa eky’okuddamu ekisinga obutuufu.',
    question: 'Lwaki amateeka g’essomero makulu?',
    answers: [
      'Gayamba okukuuma entegeka n’obukuumi mu kusoma.',
      'Gaziyiza abayizi okuyiga.',
      'Gakulu wabweru w’essomero kwokka.',
    ],
    check: 'Kebera eky’okuddamu',
    choose: 'Londa eky’okuddamu okusobola okugenda mu maaso.',
    correct: 'Bulungi nnyo! Eky’okuddamu kituufu.',
    incorrect: 'Si bwe kiri. Ddamu ogezeeko.',
    retry: 'Ddamu ogezeeko',
    complete: 'Maliriza essomo',
    completed: 'Omala essomo!',
    completedMessage: 'Weebale! Omala okukebera by’oyize mu ssomo lino.',
    backDashboard: 'Ddayo ku dashboard',
  },
}

const communityLessonContent = {
  EN: {
    ...lessonContent.EN,
    label: 'BEGINNER LESSON',
    title: 'Community & Social Interaction',
    description: 'Explore everyday places in the community and communication in different environments.',
    duration: '10 minutes',
    level: 'Beginner',
    objectives: [
      'Explore vocabulary related to community places.',
      'Learn about places such as homes and stores.',
      'Practise communicating in everyday community settings.',
    ],
    demonstration: 'Ugandan Sign Language: Community',
    placeholder: 'Watch the community video demonstrations below.',
    videoNote: 'Community video demonstrations',
    vocabulary: 'Explore community vocabulary',
    vocabularyDescription: 'Watch the videos and practise the concepts presented.',
    cards: [
      {
        title: 'House',
        subtitle: 'A place where people live',
        video: '/videos/lessons/community/house.mp4',
        description: 'Watch the video demonstration and practise the signs presented.',
      },
      {
        title: 'Store',
        subtitle: 'A place where people buy things',
        video: '/videos/lessons/community/store.mp4',
        description: 'Watch the video demonstration and practise the signs presented.',
      },
    ],
    quizTitle: 'Quick knowledge check',
    quizDescription: 'Choose the best answer to test your understanding.',
    question: 'Where can people go to buy things?',
    answers: [
      'A store.',
      'A classroom only.',
      'A hospital only.',
    ],
    check: 'Check my answer',
    choose: 'Choose an answer before continuing.',
    correct: 'Excellent! That is the correct answer.',
    incorrect: 'Not quite. Try again.',
    retry: 'Try again',
    complete: 'Complete lesson',
    completed: 'Lesson completed!',
    completedMessage: 'Great work! You have completed this lesson’s knowledge check.',
    backDashboard: 'Return to dashboard',
  },

  LG: {
    ...lessonContent.LG,
    label: 'ESSOMO LY’ABATANDISI',
    title: 'Ekitundu n’Enkolagana',
    description: 'Yiga ku bifo eby’enjawulo mu kitundu n’empuliziganya mu mbeera eza bulijjo.',
    duration: 'Ddakiika 10',
    level: 'Omutandisi',
    objectives: [
      'Okuyiga ebikwata ku bifo mu kitundu.',
      'Okutegeera ebifo ng’amaka n’amaduuka.',
      'Okwegezaamu empuliziganya mu mbeera eza bulijjo.',
    ],
    demonstration: 'Lugha ya Bakiggala eya Uganda: Ekitundu',
    placeholder: 'Laba vidiyo ezikwata ku kitundu wansi.',
    videoNote: 'Vidiyo ezikwata ku kitundu',
    vocabulary: 'Yiga ebikwata ku kitundu',
    vocabularyDescription: 'Laba vidiyo era wegezeemu obubonero obulimu.',
    cards: [
      {
        title: 'Ennyumba',
        subtitle: 'Ekifo abantu we babeera',
        video: '/videos/lessons/community/house.mp4',
        description: 'Laba vidiyo eno era wegezeemu obubonero obulagiddwa.',
      },
      {
        title: 'Edduuka',
        subtitle: 'Ekifo abantu we bagulira ebintu',
        video: '/videos/lessons/community/store.mp4',
        description: 'Laba vidiyo eno era wegezeemu obubonero obulagiddwa.',
      },
    ],
    quizTitle: 'Kebera by’oyize',
    quizDescription: 'Londa eky’okuddamu ekisinga obutuufu.',
    question: 'Abantu bagenda wa okugula ebintu?',
    answers: [
      'Mu dduuka.',
      'Mu kibiina kyokka.',
      'Mu ddwaliro kyokka.',
    ],
    check: 'Kebera eky’okuddamu',
    choose: 'Londa eky’okuddamu okusobola okugenda mu maaso.',
    correct: 'Bulungi nnyo! Eky’okuddamu kituufu.',
    incorrect: 'Si bwe kiri. Ddamu ogezeeko.',
    retry: 'Ddamu ogezeeko',
    complete: 'Maliriza essomo',
    completed: 'Omala essomo!',
    completedMessage: 'Weebale! Omala okukebera by’oyize mu ssomo lino.',
    backDashboard: 'Ddayo ku dashboard',
  },
}
function Lesson() {
  const { lessonId } = useParams()
  const [language, setLanguage] = useState('EN')
  const [expandedCard, setExpandedCard] = useState(null)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const [completed, setCompleted] = useState(false)

  const currentLessonId = lessonId || 'greetings'
  const t =
  currentLessonId === 'family'
    ? familyLessonContent[language]
    : currentLessonId === 'school'
      ? schoolLessonContent[language]
      : currentLessonId === 'community'
        ? communityLessonContent[language]
        : lessonContent[language]
  const lessonTitles = {
  greetings: {
    EN: 'Greetings & Introductions',
    LG: 'Okulamusa n’Okwanjula',
  },
  numbers: {
    EN: 'Numbers & Counting',
    LG: 'Namba n’Okubala',
  },
  family: {
    EN: 'Family & Relationships',
    LG: 'Amaka n’Enkolagana',
  },
  everyday: {
    EN: 'Everyday Activities',
    LG: 'Ebikolwa eby’Olunaku n’Olunaku',
  },
  school: {
    EN: 'School & Education',
    LG: 'Essomero n’Ebyenjigiriza',
  },
  healthcare: {
    EN: 'Healthcare & Emergencies',
    LG: 'Ebyobulamu n’Ebyanguyirizi',
  },
  feelings: {
    EN: 'Feelings & Expressions',
    LG: 'Enneewulira',
  },
  shopping: {
    EN: 'Shopping & Money',
    LG: 'Okugula Ebintu n’Ensimbi',
  },
  conversations: {
    EN: 'Everyday Conversations',
    LG: 'Emboozi eza Bulijjo',
  },
  community: {
    EN: 'Community & Social Interaction',
    LG: 'Ebitundu n’Enkolagana',
  },
}
  const isCorrect = selectedAnswer === 0

  const handleCheckAnswer = () => {
    if (selectedAnswer !== null) {
      setSubmitted(true)
    }
  }

  const handleRetry = () => {
    setSelectedAnswer(null)
    setSubmitted(false)
  }
  

if (
  currentLessonId !== 'greetings' &&
  currentLessonId !== 'family' &&
  currentLessonId !== 'school' &&
  currentLessonId !== 'community'
) {
  const title = lessonTitles[currentLessonId]?.[language]

  return (
    <main className="lesson-page">
      <header className="lesson-header">
        <Link to="/lessons" className="lesson-back">
          <ArrowLeft size={18} />
          {language === 'EN' ? 'Back to lessons' : 'Ddayo ku masomo'}
        </Link>

        <div className="lesson-language">
          <button
            className={language === 'EN' ? 'active' : ''}
            onClick={() => setLanguage('EN')}
          >
            EN
          </button>
          <button
            className={language === 'LG' ? 'active' : ''}
            onClick={() => setLanguage('LG')}
          >
            LG
          </button>
        </div>
      </header>

      <section className="lesson-content">
        <div className="lesson-heading">
          <span className="lesson-label">
            {language === 'EN' ? 'BEGINNER LESSON' : 'ESSOMO LY’ABATANDISI'}
          </span>

          <h1>{title || 'Lesson'}</h1>

          <p>
            {language === 'EN'
              ? 'This lesson is being prepared. Learning materials and validated UgSL demonstrations will be added soon.'
              : 'Essomo lino likyategekebwa. Ebikozesebwa mu kuyiga n’obubonero obukakasiddwa bijja kuteekebwamu.'}
          </p>
        </div>

        <section className="lesson-card">
          <div className="lesson-section-title">
            <PlayCircle size={21} />
            <h2>
              {language === 'EN' ? 'Lesson materials' : 'Ebikozesebwa mu ssomo'}
            </h2>
          </div>

          <div className="lesson-video-placeholder">
            <BookOpen size={52} />
            <h3>
              {language === 'EN' ? 'Coming soon' : 'Bijja kubaawo oluvannyuma'}
            </h3>
            <p>
              {language === 'EN'
                ? 'We are preparing this lesson and its signing videos.'
                : 'Tuteekateeka essomo lino ne vidiyo zaalyo ez’obubonero.'}
            </p>
          </div>
        </section>

        <Link to="/lessons" className="lesson-action-button">
          {language === 'EN' ? 'Explore other lessons' : 'Laba amasomo amalala'}
        </Link>
      </section>
    </main>
  )
}

  return (
    <main className="lesson-page">
      <header className="lesson-header">
        <Link to="/dashboard" className="lesson-back">
          <ArrowLeft size={18} />
          {t.back}
        </Link>

        <div className="lesson-language">
          <button
            className={language === 'EN' ? 'active' : ''}
            onClick={() => setLanguage('EN')}
          >
            EN
          </button>
          <button
            className={language === 'LG' ? 'active' : ''}
            onClick={() => setLanguage('LG')}
          >
            LG
          </button>
        </div>
      </header>

      <section className="lesson-content">
        <div className="lesson-heading">
          <span className="lesson-label">{t.label}</span>
          <h1>{t.title}</h1>
          <p>{t.description}</p>

          <div className="lesson-meta">
            <span><Clock size={16} /> {t.duration}</span>
            <span><Award size={16} /> {t.level}</span>
          </div>
        </div>

        <section className="lesson-progress-card">
          <div className="lesson-progress-top">
            <span>{t.progress}</span>
            <strong>{completed ? '100%' : submitted && isCorrect ? '75%' : '0%'}</strong>
          </div>
          <div className="lesson-progress-track">
            <div
              className="lesson-progress-fill"
              style={{ width: completed ? '100%' : submitted && isCorrect ? '75%' : '0%' }}
            />
          </div>
        </section>

        <section className="lesson-card">
          <div className="lesson-section-title">
            <BookOpen size={21} />
            <h2>{t.objective}</h2>
          </div>

          <ul className="lesson-objectives">
            {t.objectives.map((objective, index) => (
              <li key={index}>
                <CheckCircle size={18} />
                {objective}
              </li>
            ))}
          </ul>
        </section>

        <section className="lesson-card">
          <div className="lesson-section-title">
            <PlayCircle size={21} />
            <h2>{t.demonstration}</h2>
          </div>

          <div className="lesson-video-placeholder">
            <PlayCircle size={52} />
            <h3>{t.videoNote}</h3>
            <p>{t.placeholder}</p>
          </div>
        </section>

        <section className="lesson-card">
          <div className="lesson-section-title">
            <Sparkles size={21} />
            <h2>{t.vocabulary}</h2>
          </div>

          <p className="lesson-card-description">{t.vocabularyDescription}</p>

          
<div className="lesson-vocabulary-grid">
  {t.cards.map((card, index) => (
    <article className="lesson-vocabulary-card" key={card.title}>
      <span className="vocabulary-number">
        0{index + 1}
      </span>

      <h3 className="vocabulary-card-title">
        {card.title}
      </h3>

      <p className="vocabulary-card-subtitle">
        {card.subtitle}
      </p>

      <div className="lesson-concept-video">
        <video
          controls
          playsInline
          preload="metadata"
          className="concept-video-player"
        >
          <source src={card.video} type="video/mp4" />
          Your browser does not support video playback.
        </video>
      </div>

      {expandedCard === index && (
        <p className="vocabulary-explanation">
          {card.description}
        </p>
      )}

      <button
        type="button"
        className="vocabulary-toggle"
        onClick={() =>
          setExpandedCard(
            expandedCard === index ? null : index
          )
        }
        aria-expanded={expandedCard === index}
      >
        {expandedCard === index ? (
          <ChevronUp size={18} />
        ) : (
          <ChevronDown size={18} />
        )}

        {expandedCard === index ? 'Show less' : 'Learn more'}
      </button>
    </article>
  ))}
</div>

        </section>

        <section className="lesson-card lesson-quiz">
          <div className="lesson-section-title">
            <Award size={21} />
            <h2>{t.quizTitle}</h2>
          </div>

          <p className="lesson-card-description">{t.quizDescription}</p>
          <h3 className="lesson-question">{t.question}</h3>

          <div className="lesson-answer-list">
            {t.answers.map((answer, index) => (
              <button
                key={answer}
                className={`lesson-answer ${selectedAnswer === index ? 'selected' : ''} ${
                  submitted && index === 0 ? 'answer-correct' : ''
                } ${submitted && selectedAnswer === index && !isCorrect ? 'answer-wrong' : ''}`}
                onClick={() => {
                  if (!submitted) setSelectedAnswer(index)
                }}
                disabled={submitted}
              >
                <span className="answer-letter">{String.fromCharCode(65 + index)}</span>
                <span>{answer}</span>
                {submitted && index === 0 && <CheckCircle size={19} />}
              </button>
            ))}
          </div>

          {submitted && (
            <div className={`lesson-feedback ${isCorrect ? 'feedback-correct' : 'feedback-wrong'}`}>
              {isCorrect ? t.correct : t.incorrect}
            </div>
          )}

          {!submitted ? (
            <button className="lesson-action-button" onClick={handleCheckAnswer}>
              {t.check}
            </button>
          ) : !isCorrect ? (
            <button className="lesson-action-button secondary-action" onClick={handleRetry}>
              <RotateCcw size={17} /> {t.retry}
            </button>
          ) : !completed ? (
            <button className="lesson-action-button" onClick={() => setCompleted(true)}>
              <CheckCircle size={18} /> {t.complete}
            </button>
          ) : null}

          {selectedAnswer === null && !submitted && (
            <p className="lesson-hint">{t.choose}</p>
          )}

          {completed && (
            <div className="lesson-completion">
              <Trophy size={35} />
              <h3>{t.completed}</h3>
              <p>{t.completedMessage}</p>
              <Link to="/dashboard">{t.backDashboard}</Link>
            </div>
          )}
        </section>
      </section>
    </main>
  )
}

export default Lesson
