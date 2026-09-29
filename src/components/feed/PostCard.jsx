import { useState } from 'react'
import { Bookmark, Heart, MessageCircle, MoreHorizontal, Send, Smile } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { Avatar, IconButton, UserName } from '../ui.jsx'

export default function PostCard({ post }) {
  const { likedPosts, savedPosts, comments, toggleLike, toggleSave, addComment, notify, followedUsers, toggleFollow } = useApp()
  const [comment, setComment] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)
  const liked = likedPosts.includes(post.id)
  const saved = savedPosts.includes(post.id)
  const like = () => !liked && toggleLike(post.id)
  const submitComment = (event) => {
    event.preventDefault()
    if (!comment.trim()) return
    addComment(post.id, comment.trim())
    setComment('')
  }
  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.origin + '/explore')
      notify('Link copied to clipboard')
    } catch {
      notify('Ready to share this post')
    }
  }

  return <article className="post-card"><header className="post-header"><Avatar username={post.username} /><div className="post-author"><UserName username={post.username} /><span className="subtle-text">{post.location}</span></div><div className="post-menu-wrap"><IconButton label="Post options" onClick={() => setMenuOpen((open) => !open)}><MoreHorizontal size={22} /></IconButton>{menuOpen && <div className="dropdown-menu"><button type="button" onClick={() => { toggleFollow(post.username); setMenuOpen(false) }}>{followedUsers.includes(post.username) ? 'Unfollow' : 'Follow'} @{post.username}</button><button type="button" onClick={() => { share(); setMenuOpen(false) }}>Copy post link</button><button type="button" onClick={() => { notify('You will see fewer posts like this'); setMenuOpen(false) }}>Not interested</button></div>}</div></header><div className="post-image-wrap" onDoubleClick={like}><img className="post-image" src={post.image} alt={`${post.caption} by ${post.username}`} loading="lazy" onError={(event) => event.currentTarget.classList.add('image-failed')} />{liked && <span className="double-like"><Heart fill="currentColor" size={70} /></span>}</div><div className="post-content"><div className="action-row"><IconButton label={liked ? 'Unlike post' : 'Like post'} active={liked} className="like-action" onClick={() => toggleLike(post.id)}><Heart size={23} fill={liked ? 'currentColor' : 'none'} /></IconButton><IconButton label="Comments"><MessageCircle size={22} /></IconButton><IconButton label="Share post" onClick={share}><Send size={21} /></IconButton><IconButton label={saved ? 'Unsave post' : 'Save post'} active={saved} className="push-right" onClick={() => toggleSave(post.id)}><Bookmark size={22} fill={saved ? 'currentColor' : 'none'} /></IconButton></div><strong className="like-count">{(post.likes + (liked ? 1 : 0)).toLocaleString()} likes</strong><p className="post-caption"><UserName username={post.username} /> {post.caption} <span className="tag-list">{post.tags?.map((tag) => `#${tag}`).join(' ')}</span></p><button type="button" className="comments-link" onClick={() => document.getElementById(`comment-${post.id}`)?.focus()}>View all {post.comments + (comments[post.id]?.length || 0)} comments</button>{comments[post.id]?.slice(-2).map((item) => <p className="inline-comment" key={item.id}><strong>{item.username}</strong> {item.text}</p>)}<time className="post-time">{post.timestamp} ago</time><form className="inline-comment-form" onSubmit={submitComment}><Smile size={19} /><input id={`comment-${post.id}`} aria-label="Add a comment" placeholder="Add a comment..." value={comment} onChange={(event) => setComment(event.target.value)} /><button type="submit" disabled={!comment.trim()}>Post</button></form></div></article>
}