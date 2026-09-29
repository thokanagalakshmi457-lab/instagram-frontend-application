import { createContext, useContext, useEffect, useState } from 'react'
import { currentUser, notifications as initialNotifications, posts as initialPosts } from '../data/mockData.js'

const AppContext = createContext(null)

function useStoredState(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key)
      return saved ? JSON.parse(saved) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => localStorage.setItem(key, JSON.stringify(value)), [key, value])
  return [value, setValue]
}

export function AppProvider({ children }) {
  const [isAuthenticated, setAuthenticated] = useStoredState('fieldnote-auth', true)
  const [theme, setTheme] = useStoredState('fieldnote-theme', 'light')
  const [likedPosts, setLikedPosts] = useStoredState('fieldnote-likes', [])
  const [savedPosts, setSavedPosts] = useStoredState('fieldnote-saves', [])
  const [followedUsers, setFollowedUsers] = useStoredState('fieldnote-follows', ['amelia', 'noah', 'sofia'])
  const [viewedStories, setViewedStories] = useStoredState('fieldnote-stories', [])
  const [readNotifications, setReadNotifications] = useStoredState('fieldnote-notifications', [])
  const [comments, setComments] = useState({})
  const [allPosts, setAllPosts] = useState(initialPosts)
  const [toast, setToast] = useState('')

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    if (!toast) return undefined
    const timeout = window.setTimeout(() => setToast(''), 2600)
    return () => window.clearTimeout(timeout)
  }, [toast])

  const toggle = (list, setList, value) => setList((items) => items.includes(value) ? items.filter((item) => item !== value) : [...items, value])
  const addComment = (postId, text) => setComments((items) => ({ ...items, [postId]: [...(items[postId] || []), { id: Date.now(), username: currentUser.username, text }] }))
  const createPost = (post) => setAllPosts((items) => [post, ...items])

  const value = {
    isAuthenticated,
    setAuthenticated,
    theme,
    setTheme,
    likedPosts,
    savedPosts,
    followedUsers,
    viewedStories,
    readNotifications,
    comments,
    allPosts,
    notify: setToast,
    toggleLike: (id) => toggle(likedPosts, setLikedPosts, id),
    toggleSave: (id) => toggle(savedPosts, setSavedPosts, id),
    toggleFollow: (username) => toggle(followedUsers, setFollowedUsers, username),
    viewStory: (id) => toggle(viewedStories, setViewedStories, id),
    markNotificationRead: (id) => toggle(readNotifications, setReadNotifications, id),
    markAllNotificationsRead: () => setReadNotifications(initialNotifications.map(({ id }) => id)),
    addComment,
    createPost,
  }

  return <AppContext.Provider value={value}>{children}{toast && <div className="toast" role="status">{toast}</div>}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used inside AppProvider')
  return context
}