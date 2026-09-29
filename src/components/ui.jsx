import { useEffect, useState } from 'react'
import { BadgeCheck, Heart, MessageCircle, X } from 'lucide-react'
import { users } from '../data/mockData.js'
import { useApp } from '../context/AppContext.jsx'

export function Avatar({ username, src, size = 'md', className = '' }) {
  const user = users.find((item) => item.username === username)
  const [name, image] = [user?.name || username || 'Guest', src || user?.avatar]
  const initials = name.split(' ').map((part) => part[0]).slice(0, 2).join('').toUpperCase()
  return <span className={`avatar avatar-${size} ${className}`}>{image && <img src={image} alt={`${name} profile`} loading="lazy" onError={(event) => event.currentTarget.remove()} />}<span aria-hidden="true">{initials}</span></span>
}

export function UserName({ username, verified = false }) {
  const user = users.find((item) => item.username === username)
  return <span className="username">{username}{(verified || user?.verified) && <BadgeCheck size={15} fill="currentColor" aria-label="Verified" />}</span>
}

export function IconButton({ label, active = false, className = '', children, ...props }) {
  return <button type="button" className={`icon-button ${active ? 'is-active' : ''} ${className}`} aria-label={label} title={label} {...props}>{children}</button>
}

export function FollowButton({ username, compact = false }) {
  const { followedUsers, toggleFollow } = useApp()
  const following = followedUsers.includes(username)
  return <button type="button" className={`follow-button ${following ? 'following' : ''} ${compact ? 'compact' : ''}`} onClick={() => toggleFollow(username)}>{following ? 'Following' : 'Follow'}</button>
}

export function Modal({ children, onClose, className = '' }) {
  useEffect(() => {
    const closeOnEscape = (event) => event.key === 'Escape' && onClose()
    window.addEventListener('keydown', closeOnEscape)
    document.body.classList.add('modal-open')
    return () => {
      window.removeEventListener('keydown', closeOnEscape)
      document.body.classList.remove('modal-open')
    }
  }, [onClose])

  return <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className={`modal ${className}`} role="dialog" aria-modal="true">{children}<IconButton label="Close dialog" className="modal-close" onClick={onClose}><X size={19} /></IconButton></section></div>
}

export function PostModal({ post, onClose }) {
  const { likedPosts, savedPosts, toggleLike, toggleSave, comments, addComment } = useApp()
  const [comment, setComment] = useState('')
  if (!post) return null
  const postComments = comments[post.id] || []
  const submit = (event) => {
    event.preventDefault()
    if (comment.trim()) {
      addComment(post.id, comment.trim())
      setComment('')
    }
  }

  return <Modal onClose={onClose} className="post-modal"><div className="post-modal-image"><img src={post.image} alt={post.caption} onError={(event) => event.currentTarget.classList.add('image-failed')} /></div><div className="post-modal-details"><div className="post-modal-heading"><Avatar username={post.username} /><div><UserName username={post.username} /><span className="subtle-text">{post.location}</span></div></div><div className="post-modal-comments"><p className="modal-caption"><Avatar username={post.username} size="sm" /><span><UserName username={post.username} /> {post.caption} <span className="tag-list">{post.tags?.map((tag) => `#${tag}`).join(' ')}</span></span></p>{postComments.map((item) => <p className="modal-comment" key={item.id}><strong>{item.username}</strong> {item.text}</p>)}{!postComments.length && <p className="subtle-text">Be the first to leave a note.</p>}</div><div className="post-modal-actions"><div className="action-row"><IconButton label={likedPosts.includes(post.id) ? 'Unlike post' : 'Like post'} active={likedPosts.includes(post.id)} onClick={() => toggleLike(post.id)}><Heart size={23} fill={likedPosts.includes(post.id) ? 'currentColor' : 'none'} /></IconButton><IconButton label="Comments"><MessageCircle size={22} /></IconButton><IconButton label={savedPosts.includes(post.id) ? 'Unsave post' : 'Save post'} className="push-right" active={savedPosts.includes(post.id)} onClick={() => toggleSave(post.id)}><span className="bookmark-shape" /></IconButton></div><strong>{post.likes + (likedPosts.includes(post.id) ? 1 : 0)} likes</strong><span className="subtle-text">{post.timestamp} ago</span><form className="comment-form" onSubmit={submit}><input aria-label="Write a comment" placeholder="Add a comment..." value={comment} onChange={(event) => setComment(event.target.value)} /><button disabled={!comment.trim()}>Post</button></form></div></div></Modal>
}