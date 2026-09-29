import { useMemo, useState } from 'react'
import { AudioLines, Bookmark, Heart, MessageCircle, MoreHorizontal, Play, Search, Send, Sparkles } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { currentUser, reels as reelData, stories, users } from '../data/mockData.js'
import { Avatar, FollowButton, IconButton, Modal, PostModal, UserName } from '../components/ui.jsx'
import PostCard from '../components/feed/PostCard.jsx'
import Stories from '../components/feed/Stories.jsx'

function RightRail() {
  const { followedUsers } = useApp()
  const suggestions = users.filter((user) => user.username !== currentUser.username && !followedUsers.includes(user.username)).slice(0, 4)
  return <aside className="right-rail"><div className="rail-self"><Avatar username={currentUser.username} size="lg" /><div><UserName username={currentUser.username} /><span className="subtle-text">{currentUser.name}</span></div><Link to={`/profile/${currentUser.username}`}>View</Link></div><div className="rail-section-head"><span>People to know</span><Link to="/explore">See all</Link></div><div className="suggestion-list">{suggestions.map((user) => <div className="suggestion-row" key={user.username}><Link to={`/profile/${user.username}`}><Avatar username={user.username} size="sm" /></Link><div><UserName username={user.username} /><span className="subtle-text">Suggested for you</span></div><FollowButton username={user.username} compact /></div>)}</div><p className="rail-footnote">About · Help · Privacy · Terms<br />© 2026 FIELDNOTE</p></aside>
}

export function Home() {
  const { allPosts } = useApp()
  return <div className="home-layout"><section className="feed-column"><header className="feed-welcome"><div><span className="eyebrow">Tuesday, September 29</span><h1>A day worth noticing.</h1></div><Link className="compose-shortcut" to="/create"><Sparkles size={17} /> Share a moment</Link></header><Stories /><div className="feed-heading"><span>From your circle</span><button type="button">Latest <span>⌄</span></button></div><div className="post-list">{allPosts.map((post) => <PostCard key={post.id} post={post} />)}</div></section><RightRail /></div>
}

const categories = ['For you', 'Nature', 'Travel', 'Design', 'Food']

export function Explore() {
  const { allPosts } = useApp()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('For you')
  const [selectedPost, setSelectedPost] = useState(null)
  const terms = { Nature: ['light', 'mountain', 'green', 'sky', 'forest', 'outside'], Travel: ['italy', 'portugal', 'beyond', 'route', 'venice', 'island'], Design: ['blue', 'city', 'slow', 'cabin'], Food: ['sunday', 'coffee', 'bread', 'recipe'] }
  const filtered = useMemo(() => allPosts.filter((post) => {
    const text = `${post.caption} ${post.location} ${post.tags?.join(' ')} ${post.username}`.toLowerCase()
    return text.includes(query.toLowerCase()) && (category === 'For you' || terms[category].some((term) => text.includes(term)))
  }), [allPosts, query, category])

  return <section className="page-content explore-page"><header className="page-heading"><div><span className="eyebrow">A little inspiration</span><h1>Explore</h1></div><label className="search-field"><Search size={19} /><input aria-label="Search posts" placeholder="Search places, people, tags" value={query} onChange={(event) => setQuery(event.target.value)} /><kbd>⌘ K</kbd></label></header><div className="category-tabs" role="tablist" aria-label="Explore categories">{categories.map((item) => <button type="button" role="tab" aria-selected={category === item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div>{filtered.length ? <div className="explore-grid">{filtered.map((post, index) => <button type="button" className={`explore-card ${index % 7 === 0 ? 'grid-feature' : ''}`} key={post.id} onClick={() => setSelectedPost(post)}><img src={post.image} alt={post.caption} loading="lazy" onError={(event) => event.currentTarget.classList.add('image-failed')} /><span className="explore-overlay"><span><Heart size={19} fill="currentColor" /> {post.likes.toLocaleString()}</span><span><MessageCircle size={19} fill="currentColor" /> {post.comments}</span></span></button>)}</div> : <div className="empty-state"><Search size={26} /><h2>No moments found</h2><p>Try another search or choose a different category.</p><button className="text-button" onClick={() => { setQuery(''); setCategory('For you') }}>Clear filters</button></div>}{selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}</section>
}

function ReelCard({ reel }) {
  const { likedPosts, savedPosts, toggleLike, toggleSave, notify } = useApp()
  const [showComments, setShowComments] = useState(false)
  const liked = likedPosts.includes(reel.id)
  return <article className="reel-card"><img className="reel-image" src={reel.image} alt={`Video preview by ${reel.username}: ${reel.caption}`} onError={(event) => event.currentTarget.classList.add('image-failed')} /><div className="reel-shade" /><span className="reel-play"><Play size={25} fill="currentColor" /></span><div className="reel-caption"><Link to={`/profile/${reel.username}`} className="reel-user"><Avatar username={reel.username} size="sm" /><UserName username={reel.username} /></Link><p>{reel.caption}</p><span className="reel-audio"><AudioLines size={14} />{reel.audio}</span></div><div className="reel-actions"><IconButton label={liked ? 'Unlike reel' : 'Like reel'} active={liked} onClick={() => toggleLike(reel.id)}><Heart size={23} fill={liked ? 'currentColor' : 'none'} /></IconButton><span>{(reel.likes + (liked ? 1 : 0)).toLocaleString()}</span><IconButton label="View comments" onClick={() => setShowComments(true)}><MessageCircle size={23} /></IconButton><span>{reel.comments}</span><IconButton label="Share reel" onClick={() => notify('Reel link copied')}><Send size={21} /></IconButton><IconButton label={savedPosts.includes(reel.id) ? 'Unsave reel' : 'Save reel'} onClick={() => toggleSave(reel.id)}><Bookmark size={22} fill={savedPosts.includes(reel.id) ? 'currentColor' : 'none'} /></IconButton><IconButton label="More reel options" onClick={() => notify('You are all caught up with this creator')}><MoreHorizontal size={22} /></IconButton></div>{showComments && <Modal onClose={() => setShowComments(false)} className="reel-comment-modal"><h2>Comments</h2><p className="subtle-text">Join the conversation on @{reel.username}’s reel.</p><div className="empty-state compact-empty"><MessageCircle size={23} /><span>No comments yet. Start the conversation.</span></div><form className="comment-form" onSubmit={(event) => { event.preventDefault(); setShowComments(false); notify('Comment added') }}><input aria-label="Add a comment" placeholder="Add a comment..." required /><button>Post</button></form></Modal>}</article>
}

export function Reels() {
  return <section className="reels-page"><header className="reels-heading"><div><span className="eyebrow">A moment in motion</span><h1>Reels</h1></div><button className="quiet-button"><MoreHorizontal size={21} aria-label="More reels" /></button></header><div className="reel-feed">{reelData.map((reel) => <ReelCard key={reel.id} reel={reel} />)}</div></section>
}