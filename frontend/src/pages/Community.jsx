
import { useEffect, useState, useRef } from 'react'
import {
  ArrowLeft,
  Heart,
  MessageCircle,
  Users,
  Send,
  Search,
  Hand,
  Trash2,
  Video,
  Upload,
  X,
} from 'lucide-react'

import '../App.css'
import { useNavigate } from 'react-router-dom'

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'
).replace(/\/$/, '')

const API_URL = `${API_BASE_URL}/api/community/posts/`
const MEDIA_BASE_URL = API_BASE_URL
const categories = [
  'All posts',
  'Learning journey',
  'Questions',
  'Community',
]

const categoryLabels = {
  learning: 'Learning journey',
  questions: 'Questions',
  community: 'Community',
}

function formatPost(post) {
  return {
    id: post.id,
    author: post.author,
    initials: post.author?.charAt(0).toUpperCase() || '?',
    time: new Date(post.created_at).toLocaleString(),
    category: categoryLabels[post.category] || 'Community',
    content: post.content,
    video: post.video,
    likes: 0,
  }
}

function formatComment(comment) {
  return {
    id: comment.id,
    author: comment.author,
    content: comment.content,
    video: comment.video,
  }
}

function getVideoUrl(video) {
  if (!video) return ''

  return video.startsWith('http')
    ? video
    : `${MEDIA_BASE_URL}${video}`
}

function Community() {
  const navigate = useNavigate()

  // New post video states
  const [showVideoRecorder, setShowVideoRecorder] = useState(false)
  const [recording, setRecording] = useState(false)
  const [videoPreview, setVideoPreview] = useState(null)
  const [videoFile, setVideoFile] = useState(null)
  const [videoError, setVideoError] = useState('')

  const videoRef = useRef(null)
  const mediaRecorderRef = useRef(null)
  const recordedChunksRef = useRef([])
  const streamRef = useRef(null)
  const fileInputRef = useRef(null)

  // Comment video states
  const [commentVideos, setCommentVideos] = useState({})
  const [commentVideoPreviews, setCommentVideoPreviews] = useState({})
  const [commentVideoErrors, setCommentVideoErrors] = useState({})
  const [commentRecordingPostId, setCommentRecordingPostId] = useState(null)

  const commentVideoInputRefs = useRef({})
  const commentCameraPreviewRefs = useRef({})
  const commentRecorderRef = useRef(null)
  const commentStreamRef = useRef(null)
  const commentChunksRef = useRef([])

  // Main community states
  const [posts, setPosts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All posts')
  const [search, setSearch] = useState('')
  const [newPost, setNewPost] = useState('')

  const [commentInputs, setCommentInputs] = useState({})
  const [postComments, setPostComments] = useState({})
  const [likedPosts, setLikedPosts] = useState([])
  const [likingPosts, setLikingPosts] = useState([])
  const [openDiscussions, setOpenDiscussions] = useState([])
  const [showCommentInput, setShowCommentInput] = useState([])

  const [loading, setLoading] = useState(true)
  const [posting, setPosting] = useState(false)
  const [commentingPosts, setCommentingPosts] = useState([])
  const [deletingPosts, setDeletingPosts] = useState([])
  const [deletingComments, setDeletingComments] = useState([])
  const [error, setError] = useState('')

  // Attach the comment camera stream when its preview appears.
  useEffect(() => {
    if (commentRecordingPostId === null) return

    const preview = commentCameraPreviewRefs.current[commentRecordingPostId]

    if (preview && commentStreamRef.current) {
      preview.srcObject = commentStreamRef.current
      preview.play().catch((error) => {
        console.error('Could not play camera preview:', error)
      })
    }
  }, [commentRecordingPostId])

  // Release cameras and temporary video URLs when leaving the page.
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (commentStreamRef.current) {
        commentStreamRef.current.getTracks().forEach((track) => track.stop())
      }

      if (videoPreview) {
        URL.revokeObjectURL(videoPreview)
      }

      Object.values(commentVideoPreviews).forEach((url) => {
        URL.revokeObjectURL(url)
      })
    }
  }, [videoPreview, commentVideoPreviews])

  // Start recording a video for a new post.
  const startRecording = async () => {
    try {
      setVideoError('')

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.')
      }

      if (!window.MediaRecorder) {
        throw new Error('Video recording is not supported by your browser.')
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      })

      streamRef.current = stream
      recordedChunksRef.current = []

      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }

      const mimeTypes = [
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp8',
        'video/webm',
      ]

      const supportedMimeType = mimeTypes.find((type) =>
        MediaRecorder.isTypeSupported(type)
      )

      const recorder = new MediaRecorder(
        stream,
        supportedMimeType ? { mimeType: supportedMimeType } : {}
      )

      mediaRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data)
        }
      }

      recorder.onerror = (event) => {
        console.error('Recorder error:', event.error)
        setVideoError('Recording failed. Please try again.')
        setRecording(false)
      }

      recorder.onstop = () => {
  const recordedBlob = new Blob(recordedChunksRef.current, {
    type: recorder.mimeType || 'video/webm',
  })

  console.log('Recorded blob:', recordedBlob)
  console.log('Blob size:', recordedBlob.size)
  console.log('Blob type:', recordedBlob.type)
  console.log('Recorder MIME type:', recorder.mimeType)

  if (recordedBlob.size === 0) {
    setVideoError('No video was recorded. Please try again.')
    setRecording(false)
  } else {
    const recordedFile = new File(
      [recordedBlob],
      `unmute-video-${Date.now()}.webm`,
      { type: recordedBlob.type }
    )

    const previewUrl = URL.createObjectURL(recordedBlob)

    setVideoFile(recordedFile)
    setVideoPreview(previewUrl)
    setShowVideoRecorder(true)
    setVideoError('')
    setRecording(false)
  }

  stream.getTracks().forEach((track) => track.stop())
  streamRef.current = null
  recordedChunksRef.current = []
}

      recorder.start(1000)
      setRecording(true)

    } catch (error) {
      console.error('Recording setup failed:', error)
      setVideoError(error.message || 'Could not start recording.')

      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop())
        streamRef.current = null
      }

      setRecording(false)
    }
  }

  const stopRecording = () => {
  const recorder = mediaRecorderRef.current

  if (recorder && recorder.state === 'recording') {
    recorder.requestData()
    recorder.stop()
  }
}
 const handleVideoUpload = (event) => {
  const file = event.target.files[0]

  if (!file) return

  if (!file.type.startsWith('video/')) {
    setVideoError('Please select a valid video file.')
    return
  }

  if (file.size > 50 * 1024 * 1024) {
    setVideoError('Video must be smaller than 50MB.')
    return
  }

  if (videoPreview) {
    URL.revokeObjectURL(videoPreview)
  }

  setVideoError('')
  setVideoFile(file)
  setVideoPreview(URL.createObjectURL(file))
  setShowVideoRecorder(true)

  event.target.value = ''
}

  const clearVideo = () => {
    if (recording) {
      stopRecording()
    }

    if (videoPreview) {
      URL.revokeObjectURL(videoPreview)
    }

    setVideoPreview(null)
    setVideoFile(null)
    setVideoError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Upload a video to a comment.
  const handleCommentVideoUpload = (event, postId) => {
    const file = event.target.files[0]

    if (!file) return

    if (!file.type.startsWith('video/')) {
      setCommentVideoErrors((previous) => ({
        ...previous,
        [postId]: 'Please select a valid video file.',
      }))
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      setCommentVideoErrors((previous) => ({
        ...previous,
        [postId]: 'Video must be smaller than 50MB.',
      }))
      return
    }

    const oldPreview = commentVideoPreviews[postId]

    if (oldPreview) {
      URL.revokeObjectURL(oldPreview)
    }

    setCommentVideos((previous) => ({
      ...previous,
      [postId]: file,
    }))

    setCommentVideoPreviews((previous) => ({
      ...previous,
      [postId]: URL.createObjectURL(file),
    }))

    setCommentVideoErrors((previous) => ({
      ...previous,
      [postId]: '',
    }))

    event.target.value = ''
  }

  // Record a video directly inside a comment.
  const startCommentRecording = async (postId) => {
    try {
      setCommentVideoErrors((previous) => ({
        ...previous,
        [postId]: '',
      }))

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.')
      }

      if (!window.MediaRecorder) {
        throw new Error('Video recording is not supported by your browser.')
      }

      // Do not allow multiple cameras to record simultaneously.
      if (commentStreamRef.current) {
        commentStreamRef.current.getTracks().forEach((track) => track.stop())
        commentStreamRef.current = null
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 },
        },
        audio: true,
      })

      commentStreamRef.current = stream
      commentChunksRef.current = []

      const mimeTypes = [
        'video/webm;codecs=vp8,opus',
        'video/webm;codecs=vp8',
        'video/webm',
      ]

      const supportedMimeType = mimeTypes.find((type) =>
        MediaRecorder.isTypeSupported(type)
      )

      const recorder = new MediaRecorder(
        stream,
        supportedMimeType ? { mimeType: supportedMimeType } : {}
      )

      commentRecorderRef.current = recorder

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          commentChunksRef.current.push(event.data)
        }
      }

      recorder.onerror = (event) => {
        console.error('Comment recorder error:', event.error)

        setCommentVideoErrors((previous) => ({
          ...previous,
          [postId]: 'Recording failed. Please try again.',
        }))

        setCommentRecordingPostId(null)
      }

      recorder.onstop = () => {
        const blob = new Blob(commentChunksRef.current, {
          type: recorder.mimeType || 'video/webm',
        })

        if (blob.size > 0) {
          const file = new File(
            [blob],
            `unmute-comment-${Date.now()}.webm`,
            { type: blob.type }
          )

          const previewURL = URL.createObjectURL(blob)

          setCommentVideos((previous) => ({
            ...previous,
            [postId]: file,
          }))

          setCommentVideoPreviews((previous) => {
            if (previous[postId]) {
              URL.revokeObjectURL(previous[postId])
            }

            return {
              ...previous,
              [postId]: previewURL,
            }
          })
        } else {
          setCommentVideoErrors((previous) => ({
            ...previous,
            [postId]: 'No video was recorded. Please try again.',
          }))
        }

        stream.getTracks().forEach((track) => track.stop())

        commentStreamRef.current = null
        commentRecorderRef.current = null
        setCommentRecordingPostId(null)
      }

      setCommentRecordingPostId(postId)

      recorder.start(1000)

    } catch (error) {
      console.error('Comment recording setup failed:', error)

      setCommentVideoErrors((previous) => ({
        ...previous,
        [postId]: error.message || 'Could not start recording.',
      }))

      if (commentStreamRef.current) {
        commentStreamRef.current.getTracks().forEach((track) => track.stop())
        commentStreamRef.current = null
      }

      setCommentRecordingPostId(null)
    }
  }

  const stopCommentRecording = () => {
    const recorder = commentRecorderRef.current

    if (recorder && recorder.state === 'recording') {
      recorder.stop()
    }
  }

  const clearCommentVideo = (postId) => {
    if (commentRecordingPostId === postId) {
      stopCommentRecording()
    }

    if (commentVideoPreviews[postId]) {
      URL.revokeObjectURL(commentVideoPreviews[postId])
    }

    setCommentVideos((previous) => {
      const updated = { ...previous }
      delete updated[postId]
      return updated
    })

    setCommentVideoPreviews((previous) => {
      const updated = { ...previous }
      delete updated[postId]
      return updated
    })

    setCommentVideoErrors((previous) => ({
      ...previous,
      [postId]: '',
    }))

    const input = commentVideoInputRefs.current[postId]

    if (input) {
      input.value = ''
    }
  }

  // Fetch posts, comments and likes.
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true)
        setError('')

        const response = await fetch(API_URL)

        if (!response.ok) {
          throw new Error('Could not load community posts.')
        }

        const payload = await response.json()

        // The posts endpoint is paginated: { count, next, previous, results }.
        // Fall back to a bare array for backward compatibility.
        const data = Array.isArray(payload) ? payload : payload.results ?? []

        setPosts(data.map(formatPost))

        const commentsData = await Promise.all(
          data.map(async (post) => {
            const commentsResponse = await fetch(
              `${API_URL}${post.id}/comments/`
            )

            if (!commentsResponse.ok) {
              throw new Error(`Could not load comments for post ${post.id}`)
            }

            const comments = await commentsResponse.json()

            return [post.id, comments.map(formatComment)]
          })
        )

        setPostComments(Object.fromEntries(commentsData))

        const likesData = await Promise.all(
          data.map(async (post) => {
            const likesResponse = await fetch(
              `${API_URL}${post.id}/likes/`
            )

            if (!likesResponse.ok) {
              throw new Error(`Could not load likes for post ${post.id}`)
            }

            const likes = await likesResponse.json()

            return [post.id, likes]
          })
        )

        const likesMap = Object.fromEntries(likesData)

        setPosts((previous) =>
          previous.map((post) => ({
            ...post,
            likes: likesMap[post.id]?.count || 0,
          }))
        )

        setLikedPosts(
          data
            .filter((post) => likesMap[post.id]?.liked)
            .map((post) => post.id)
        )

      } catch (error) {
        console.error('Error fetching community data:', error)

        setError(
          'We could not load community discussions. Please check your connection and try again.'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchPosts()
  }, [])

  // Filter posts.
  const filteredPosts = posts.filter((post) => {
    const matchesCategory =
      activeCategory === 'All posts' ||
      post.category === activeCategory

    const matchesSearch =
      post.content.toLowerCase().includes(search.toLowerCase()) ||
      post.author.toLowerCase().includes(search.toLowerCase())

    return matchesCategory && matchesSearch
  })

  
// Create a text post, video post or both.
const handlePost = async () => {
  const content = newPost.trim()

  if ((!content && !videoFile) || posting) return

  try {
    setPosting(true)
    setError('')

    const token = sessionStorage.getItem('authToken')

    if (!token) {
      throw new Error('Please log in before creating a post.')
    }

    const formData = new FormData()

    formData.append('content', content)
    formData.append('category', 'community')

    if (videoFile) {
      formData.append('video', videoFile)
    }

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error(
  'Post validation error:',
  JSON.stringify(errorData, null, 2)
)

      // DRF returns field errors like { video: ["File too large..."] };
      // surface the first one instead of a generic message.
      const firstError =
        errorData.error ||
        (errorData && typeof errorData === 'object'
          ? Object.values(errorData).flat()[0]
          : null)

      throw new Error(firstError || 'Your post could not be saved.')
    }

    const savedPost = await response.json()

    setPosts((previous) => [
      formatPost(savedPost),
      ...previous,
    ])

    setPostComments((previous) => ({
      ...previous,
      [savedPost.id]: [],
    }))

    setNewPost('')
    clearVideo()
    setShowVideoRecorder(false)
    setActiveCategory('All posts')

  } catch (error) {
    console.error('Error creating post:', error)
    setError(error.message || 'Your post could not be saved.')
  } finally {
    setPosting(false)
  }
}

  // Delete a post.
  
const handleDeletePost = async (postId) => {
  const confirmed = window.confirm(
    'Are you sure you want to delete this post? This will also delete its comments and likes.'
  )

  if (!confirmed || deletingPosts.includes(postId)) return

  try {
    setDeletingPosts((previous) => [...previous, postId])
    setError('')

    const token = sessionStorage.getItem('authToken')

    if (!token) {
      throw new Error('Please log in to delete your post.')
    }

    const response = await fetch(
      `${API_URL}${postId}/delete/`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Token ${token}`,
        },
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(
        errorData.error || 'Could not delete this post.'
      )
    }

    setPosts((previous) =>
      previous.filter((post) => post.id !== postId)
    )

    setPostComments((previous) => {
      const updated = { ...previous }
      delete updated[postId]
      return updated
    })

    setLikedPosts((previous) =>
      previous.filter((id) => id !== postId)
    )

    setOpenDiscussions((previous) =>
      previous.filter((id) => id !== postId)
    )

  } catch (error) {
    console.error('Error deleting post:', error)
    setError(error.message || 'Your post could not be deleted.')
  } finally {
    setDeletingPosts((previous) =>
      previous.filter((id) => id !== postId)
    )
  }
}


  // Like and unlike posts.
  const handleLike = async (postId) => {
    if (likingPosts.includes(postId)) return

    try {
      setLikingPosts((previous) => [...previous, postId])

      const response = await fetch(
        `${API_URL}${postId}/likes/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }
      )

      if (!response.ok) {
        throw new Error('Could not update like.')
      }

      const data = await response.json()

      setPosts((previous) =>
        previous.map((post) =>
          post.id === postId
            ? { ...post, likes: data.count }
            : post
        )
      )

      setLikedPosts((previous) =>
        data.liked
          ? previous.includes(postId)
            ? previous
            : [...previous, postId]
          : previous.filter((id) => id !== postId)
      )

    } catch (error) {
      console.error('Error updating like:', error)
      setError('Your like could not be saved. Please try again.')
    } finally {
      setLikingPosts((previous) =>
        previous.filter((id) => id !== postId)
      )
    }
  }

  // Save a text or video comment.
  const handleComment = async (postId) => {
    const content = commentInputs[postId]?.trim() || ''

    if (
      (!content && !commentVideos[postId]) ||
      commentingPosts.includes(postId)
    ) return

    try {
      setError('')

      setCommentingPosts((previous) => [
        ...previous,
        postId,
      ])

      const formData = new FormData()

      formData.append('content', content)

      if (commentVideos[postId]) {
        formData.append('video', commentVideos[postId])
      }

      const token = sessionStorage.getItem('authToken')

      if (!token) {
        throw new Error('Please log in before commenting.')
      }

      const response = await fetch(
        `${API_URL}${postId}/comments/`,
        {
          method: 'POST',
          headers: {
            Authorization: `Token ${token}`,
          },
          body: formData,
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Comment validation error:', errorData)
        throw new Error(
          errorData.error || 'Your comment could not be saved.'
        )
      }

      const savedComment = await response.json()

      setPostComments((previous) => ({
        ...previous,
        [postId]: [
          ...(previous[postId] || []),
          formatComment(savedComment),
        ],
      }))

      setCommentInputs((previous) => ({
        ...previous,
        [postId]: '',
      }))

      // Clear the local video after successful submission.
      if (commentVideoPreviews[postId]) {
        URL.revokeObjectURL(commentVideoPreviews[postId])
      }

      setCommentVideos((previous) => {
        const updated = { ...previous }
        delete updated[postId]
        return updated
      })

      setCommentVideoPreviews((previous) => {
        const updated = { ...previous }
        delete updated[postId]
        return updated
      })

      setCommentVideoErrors((previous) => ({
        ...previous,
        [postId]: '',
      }))

      if (commentVideoInputRefs.current[postId]) {
        commentVideoInputRefs.current[postId].value = ''
      }

      setOpenDiscussions((previous) =>
        previous.includes(postId)
          ? previous
          : [...previous, postId]
      )

      setShowCommentInput((previous) =>
        previous.filter((id) => id !== postId)
      )

    } catch (error) {
      console.error('Error saving comment:', error)
      setError(error.message || 'Your comment could not be saved.')
    } finally {
      setCommentingPosts((previous) =>
        previous.filter((id) => id !== postId)
      )
    }
  }

  // Open and close discussions.
  const toggleDiscussion = (postId) => {
    setOpenDiscussions((previous) =>
      previous.includes(postId)
        ? previous.filter((id) => id !== postId)
        : [...previous, postId]
    )
  }

  const openCommentInput = (postId) => {
    setShowCommentInput((previous) =>
      previous.includes(postId)
        ? previous
        : [...previous, postId]
    )
  }

  return (
    <main className="community-page">
      <header className="community-header">
        <a href="/" className="unmute-logo">
          <span className="logo-icon">
            <Hand size={23} />
          </span>

          <span>
            UNMUTE<span className="logo-dot">.</span>
          </span>
        </a>

        <nav>
          <a href="/dashboard">Learn</a>
          <a href="/communication">Communicate</a>
          <a href="/community" className="community-active">
            Community
          </a>
        </nav>

        <button
          className="community-back-button"
          onClick={() => navigate('/dashboard')}
        >
          <ArrowLeft size={17} />
          Dashboard
        </button>
      </header>

      <section className="community-main">
        <div className="community-welcome">
          <span className="section-label">GROW TOGETHER</span>

          <h1>Welcome to the UNMUTE Community 💜</h1>

          <p>
            A space to share experiences, ask questions,
            celebrate progress and learn from one another.
          </p>
        </div>

        <div className="community-intro-card">
          <div className="community-intro-icon">
            <Users size={30} />
          </div>

          <div>
            <h2>Everyone belongs here.</h2>

            <p>
              Deaf and hearing people can connect, learn and
              support one another in a welcoming environment.
            </p>
          </div>
        </div>

        {/* Create a post */}
        <section className="community-create-post">
          <h2>Share something with the community</h2>

          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="Share your learning experience, ask a question or encourage someone..."
            rows={4}
          />

          <div className="community-video-actions">
            <button
              type="button"
              onClick={() => {
                setShowVideoRecorder(!showVideoRecorder)
                setVideoError('')
              }}
              title="Record a video"
              aria-label="Record a video"
            >
              <Video size={19} />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload a video"
              aria-label="Upload a video"
            >
              <Upload size={19} />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              hidden
              onChange={handleVideoUpload}
            />
          </div>

          {showVideoRecorder && (
            <div className="community-video-recorder">
              <div className="community-camera-screen">
                {videoPreview ? (
  <video
    src={videoPreview}
    controls
    playsInline
    preload="metadata"
    className="community-video-preview"
    onLoadedMetadata={(event) => {
      console.log('Preview metadata loaded:', event.currentTarget.duration)
    }}
    onCanPlay={() => {
      console.log('Recorded preview is ready to play.')
    }}
    onError={(event) => {
      console.log('Preview playback error:', event.currentTarget.error)
    }}
  />
) : (
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    playsInline
                    className="community-video-preview"
                  />
                )}

                {!videoPreview && !recording && (
                  <div className="community-camera-message">
                    <Video size={30} />
                    <p>Your camera preview will appear here</p>
                  </div>
                )}

                {recording && (
                  <div className="community-recording-indicator">
                    <span></span>
                    Recording
                  </div>
                )}
              </div>

              {videoError && (
                <p className="community-error">{videoError}</p>
              )}

              <div className="community-recording-controls">
                {!videoPreview && (
                  <button
                    type="button"
                    onClick={recording ? stopRecording : startRecording}
                    className={
                      recording
                        ? 'stop-recording-button'
                        : 'start-recording-button'
                    }
                  >
                    <Video size={17} />
                    {recording ? 'Stop recording' : 'Start recording'}
                  </button>
                )}

                {videoPreview && (
                  <button type="button" onClick={clearVideo}>
                    <X size={17} />
                    Remove video
                  </button>
                )}
              </div>
            </div>
          )}

          <div className="community-post-actions">
            <span>Be kind and respectful to everyone.</span>

            <button
              onClick={handlePost}
              disabled={(!newPost.trim() && !videoFile) || posting}
            >
              <Send size={16} />
              {posting ? 'Sharing...' : 'Share post'}
            </button>
          </div>
        </section>

        {error && (
          <div className="community-error">
            <p>{error}</p>
          </div>
        )}

        {/* Community feed */}
        <section className="community-feed">
          <div className="community-feed-heading">
            <div>
              <h2>Community discussions</h2>
              <p>See what other members are sharing.</p>
            </div>

            <Users size={25} />
          </div>

          <div className="community-search">
            <Search size={18} />

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search discussions..."
            />
          </div>

          <div className="community-categories">
            {categories.map((category) => (
              <button
                key={category}
                className={activeCategory === category ? 'active' : ''}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="community-post-list">
            {loading ? (
              <div className="community-empty">
                <p>Loading community discussions...</p>
              </div>
            ) : filteredPosts.length > 0 ? (
              filteredPosts.map((post) => (
                <article
                  className="community-post-card"
                  key={post.id}
                >
                  <div className="community-post-header">
                    <div className="community-avatar">
                      {post.initials}
                    </div>

                    <div>
                      <strong>{post.author}</strong>
                      <small>{post.time}</small>
                    </div>

                    <span className="community-post-category">
                      {post.category}
                    </span>

                    {post.author === JSON.parse(
  sessionStorage.getItem('currentUser') || 'null'
)?.username && (
  <button
    className="community-delete-button"
    onClick={() => handleDeletePost(post.id)}
    disabled={deletingPosts.includes(post.id)}
    title="Delete post"
    aria-label="Delete post"
  >
    <Trash2 size={17} />
  </button>
)}
                  </div>

                  {post.content && (
  <p>{post.content}</p>
)}

{post.video && (
  <video
    src={getVideoUrl(post.video)}
    controls
    playsInline
    className="community-post-video"
  />
)}

                  <div className="community-post-footer">
                    <button
                      className={likedPosts.includes(post.id) ? 'liked' : ''}
                      onClick={() => handleLike(post.id)}
                      disabled={likingPosts.includes(post.id)}
                    >
                      <Heart
                        size={17}
                        fill={
                          likedPosts.includes(post.id)
                            ? 'currentColor'
                            : 'none'
                        }
                      />
                      {post.likes} Likes
                    </button>

                    <button onClick={() => toggleDiscussion(post.id)}>
                      <MessageCircle size={17} />
                      {(postComments[post.id] || []).length} Comments
                    </button>
                  </div>

                  {openDiscussions.includes(post.id) && (
                    <div className="community-comments">
                      <h4>Discussion</h4>

                      <div className="community-comment-list">
                        {(postComments[post.id] || []).length > 0 ? (
                          postComments[post.id].map((comment) => (
                            <div
                              className="community-comment"
                              key={comment.id}
                            >
                              <div className="community-comment-header">
                                <strong>{comment.author}</strong>

                                {comment.author === JSON.parse(
  sessionStorage.getItem('currentUser') || 'null'
)?.username && (
  <button
    className="community-delete-button"
    onClick={() =>
      handleDeleteComment(post.id, comment.id)
    }
    disabled={deletingComments.includes(comment.id)}
    title="Delete comment"
    aria-label="Delete comment"
  >
    <Trash2 size={15} />
  </button>
)}
                              </div>

                              {comment.content && (
                                <p>{comment.content}</p>
                              )}

                              {comment.video && (
                                <video
                                  src={getVideoUrl(comment.video)}
                                  controls
                                  playsInline
                                  className="community-comment-video"
                                />
                              )}
                            </div>
                          ))
                        ) : (
                          <p className="no-comments">
                            No comments yet. Be the first to join
                            the discussion!
                          </p>
                        )}
                      </div>

                      {showCommentInput.includes(post.id) ? (
                        <div className="community-comment-composer">
                          <div className="community-comment-form">
                            <input
                              type="text"
                              autoFocus
                              value={commentInputs[post.id] || ''}
                              onChange={(e) =>
                                setCommentInputs((previous) => ({
                                  ...previous,
                                  [post.id]: e.target.value,
                                }))
                              }
                              onKeyDown={(e) => {
                                if (
                                  e.key === 'Enter' &&
                                  !commentingPosts.includes(post.id)
                                ) {
                                  handleComment(post.id)
                                }
                              }}
                              placeholder="Write your comment..."
                              disabled={commentingPosts.includes(post.id)}
                            />

                            <button
                              type="button"
                              onClick={() => handleComment(post.id)}
                              disabled={
                                (
                                  !commentInputs[post.id]?.trim() &&
                                  !commentVideos[post.id]
                                ) ||
                                commentingPosts.includes(post.id)
                              }
                              title="Send comment"
                              aria-label="Send comment"
                            >
                              <Send size={17} />
                            </button>
                          </div>

                          {/* Comment video controls */}
                          <div className="community-comment-video-actions">
                            <button
                              type="button"
                              onClick={() => {
                                if (commentRecordingPostId === post.id) {
                                  stopCommentRecording()
                                } else if (commentRecordingPostId === null) {
                                  startCommentRecording(post.id)
                                }
                              }}
                              disabled={
                                commentRecordingPostId !== null &&
                                commentRecordingPostId !== post.id
                              }
                              title={
                                commentRecordingPostId === post.id
                                  ? 'Stop recording'
                                  : 'Record a video comment'
                              }
                              aria-label={
                                commentRecordingPostId === post.id
                                  ? 'Stop recording'
                                  : 'Record a video comment'
                              }
                            >
                              <Video
                                size={19}
                                className={
                                  commentRecordingPostId === post.id
                                    ? 'comment-recording-active'
                                    : ''
                                }
                              />
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                commentVideoInputRefs.current[post.id]?.click()
                              }
                              disabled={commentRecordingPostId !== null}
                              title="Upload a video comment"
                              aria-label="Upload a video comment"
                            >
                              <Upload size={19} />
                            </button>

                            <input
                              ref={(element) => {
                                commentVideoInputRefs.current[post.id] = element
                              }}
                              type="file"
                              accept="video/*"
                              hidden
                              onChange={(event) =>
                                handleCommentVideoUpload(event, post.id)
                              }
                            />

                            {commentRecordingPostId === post.id && (
                              <span className="community-recording-indicator">
                                <span></span>
                                Recording
                              </span>
                            )}
                          </div>

                          {/* Live camera preview */}
                          {commentRecordingPostId === post.id && (
                            <div className="community-comment-video-preview">
                              <video
                                ref={(element) => {
                                  commentCameraPreviewRefs.current[post.id] = element

                                  if (element && commentStreamRef.current) {
                                    element.srcObject = commentStreamRef.current
                                  }
                                }}
                                autoPlay
                                muted
                                playsInline
                                className="community-comment-video"
                              />
                            </div>
                          )}

                          {/* Recorded or uploaded video preview */}
                          {commentVideoPreviews[post.id] && (
                            <div className="community-comment-video-preview">
                              <video
                                src={commentVideoPreviews[post.id]}
                                controls
                                playsInline
                                className="community-comment-video"
                              />

                              <button
                                type="button"
                                onClick={() => clearCommentVideo(post.id)}
                                className="community-remove-video"
                              >
                                <X size={15} />
                                Remove video
                              </button>
                            </div>
                          )}

                          {commentVideoErrors[post.id] && (
                            <p className="community-error">
                              {commentVideoErrors[post.id]}
                            </p>
                          )}
                        </div>
                      ) : (
                        <button
                          className="community-write-comment"
                          onClick={() => openCommentInput(post.id)}
                        >
                          <MessageCircle size={16} />
                          Write a comment
                        </button>
                      )}
                    </div>
                  )}
                </article>
              ))
            ) : (
              <div className="community-empty">
                <MessageCircle size={30} />

                <p>
                  {posts.length === 0
                    ? 'No posts yet. Be the first to share something!'
                    : 'No discussions found. Try another search.'}
                </p>
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  )
}

export default Community
