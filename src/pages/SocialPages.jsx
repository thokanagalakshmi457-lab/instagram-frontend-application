import { useMemo, useRef, useState } from 'react'
import { ArrowLeft, Bell, Check, ChevronRight, ImagePlus, LockKeyhole, MessageCircle, Moon, Paperclip, Plus, Search, Send, Settings as SettingsIcon, Smile, Sun, Upload, UserRound, X } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useApp } from '../context/AppContext.jsx'
import { conversations as conversationData, currentUser, notifications as notificationData, posts as initialPosts, users } from '../data/mockData.js'
import { Avatar, FollowButton, IconButton, Modal, PostModal, UserName } from '../components/ui.jsx'

export function Notifications() {
  const { readNotifications, markNotificationRead, markAllNotificationsRead } = useApp()
  const [activeTab, setActiveTab] = useState('All')
  const tabs = ['All', 'Likes', 'Comments', 'Follows', 'Mentions']
  const visible = notificationData.filter((item) => activeTab === 'All' || item.type === activeTab)
  return <section className="page-content notification-page"><header className="page-heading"><div><span className="eyebrow">Your community</span><h1>Notifications</h1></div><button type="button" className="quiet-button" onClick={markAllNotificationsRead}><Check size={17} /> Mark all read</button></header><div className="category-tabs notification-tabs" role="tablist" aria-label="Notification categories">{tabs.map((tab) => <button type="button" role="tab" aria-selected={activeTab === tab} className={activeTab === tab ? 'selected' : ''} key={tab} onClick={() => setActiveTab(tab)}>{tab}</button>)}</div><div className="notification-list">{visible.map((item) => <article className={`notification-row ${readNotifications.includes(item.id) ? 'read' : ''}`} key={item.id} onClick={() => markNotificationRead(item.id)}><Avatar username={item.username} /><p><UserName username={item.username} /> {item.text} <span className="subtle-text">· {item.time}</span></p>{item.follow ? <FollowButton username={item.username} compact /> : <img className="notification-thumb" src={item.post} alt="Related post" loading="lazy" onError={(event) => event.currentTarget.classList.add('image-failed')} />}{!readNotifications.includes(item.id) && <span className="unread-dot" aria-label="Unread" />}</article>)}</div>{!visible.length && <div className="empty-state"><Bell size={28} /><h2>Nothing new here</h2><p>When someone interacts with you, it will show up here.</p></div>}</section>
}

function ConversationList({ activeId, onSelect, query, setQuery }) {
  const conversations = conversationData.filter((item) => item.username.includes(query.toLowerCase()) || item.name.toLowerCase().includes(query.toLowerCase()))
  return <aside className={`conversation-list ${activeId ? 'mobile-hidden' : ''}`}><header className="conversation-list-header"><div className="conversation-title"><div><h1>Messages</h1><span className="subtle-text">@{currentUser.username}</span></div><button type="button" className="round-icon" aria-label="New message"><Plus size={20} /></button></div><label className="search-field message-search"><Search size={17} /><input aria-label="Search messages" placeholder="Search conversations" value={query} onChange={(event) => setQuery(event.target.value)} /></label><div className="message-inbox-tabs"><button type="button" className="selected">Primary <span>2</span></button><button type="button">General</button><button type="button">Requests <span className="request-count">1</span></button></div></header><div className="conversation-items">{conversations.map((item) => <button type="button" className={`conversation-item ${activeId === item.id ? 'active' : ''}`} key={item.id} onClick={() => onSelect(item.id)}><Avatar username={item.username} /><span className="conversation-copy"><UserName username={item.username} /><span className="subtle-text truncate">{item.lastMessage} · {item.time}</span></span>{item.unread && <span className="unread-dot" />}</button>)}{!conversations.length && <div className="empty-inline">No conversations found.</div>}</div></aside>
}

function ChatWindow({ conversation, onBack }) {
  const [messages, setMessages] = useState(conversation.messages)
  const [draft, setDraft] = useState('')
  const endRef = useRef(null)
  const send = (event) => {
    event.preventDefault()
    if (!draft.trim()) return
    setMessages((items) => [...items, { id: Date.now(), sender: currentUser.username, text: draft.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }])
    setDraft('')
    window.setTimeout(() => endRef.current?.scrollIntoView({ behavior: 'smooth' }), 20)
  }
  if (!conversation) return <section className="chat-empty"><div className="message-empty-icon"><Send size={25} /></div><h2>Your messages, your pace.</h2><p>Choose a conversation to pick up where you left off.</p><button className="primary-button" type="button">Send a message</button></section>
  return <section className="chat-window"><header className="chat-header"><button type="button" className="back-button" onClick={onBack} aria-label="Back to conversations"><ArrowLeft size={21} /></button><Avatar username={conversation.username} /><div><UserName username={conversation.username} /><span className="subtle-text">Active now</span></div><Link to={`/profile/${conversation.username}`} className="chat-profile-link">View profile</Link></header><div className="chat-scroll"><div className="chat-profile-intro"><Avatar username={conversation.username} size="xl" /><UserName username={conversation.username} /><span className="subtle-text">{conversation.name} · Fieldnote</span><Link to={`/profile/${conversation.username}`}>View profile</Link></div><div className="chat-date">TODAY</div>{messages.map((message) => <div className={`message-line ${message.sender === currentUser.username ? 'mine' : ''}`} key={message.id}>{message.sender !== currentUser.username && <Avatar username={conversation.username} size="xs" />}<div className="message-bubble">{message.text}<time>{message.time}</time></div></div>)}<div ref={endRef} /></div><form className="message-composer" onSubmit={send}><IconButton label="Add emoji" onClick={() => setDraft((text) => `${text} 🙂`)}><Smile size={20} /></IconButton><input aria-label="Write a message" placeholder="Message..." value={draft} onChange={(event) => setDraft(event.target.value)} /><IconButton label="Attach image" onClick={() => setDraft((text) => `${text} [photo]`)}><Paperclip size={19} /></IconButton><button type="submit" className="send-message" aria-label="Send message" disabled={!draft.trim()}><Send size={19} /></button></form></section>
}

export function Messages() {
  const [activeId, setActiveId] = useState(conversationData[0]?.id || '')
  const [query, setQuery] = useState('')
  const active = conversationData.find((item) => item.id === activeId)
  return <section className="messages-page"><ConversationList activeId={activeId} onSelect={setActiveId} query={query} setQuery={setQuery} /><ChatWindow conversation={active} onBack={() => setActiveId('')} /></section>
}

export function Create() {
  const navigate = useNavigate()
  const { createPost, notify } = useApp()
  const inputRef = useRef(null)
  const [step, setStep] = useState(1)
  const [preview, setPreview] = useState('')
  const [caption, setCaption] = useState('')
  const [location, setLocation] = useState('')
  const [altText, setAltText] = useState('')
  const [dragging, setDragging] = useState(false)
  const [filter, setFilter] = useState('Original')
  const [advanced, setAdvanced] = useState(false)
  const handleFile = (file) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      notify('Choose an image file to continue')
      return
    }
    setPreview(URL.createObjectURL(file))
    setStep(2)
  }
  const share = (event) => {
    event.preventDefault()
    createPost({ id: `local-${Date.now()}`, username: currentUser.username, image: preview, caption: caption.trim() || 'A moment worth keeping.', location: location || 'Copenhagen, Denmark', likes: 0, comments: 0, timestamp: 'now', tags: [] })
    notify('Your moment has been shared')
    navigate('/')
  }
  const steps = ['Choose', 'Preview', 'Details']
  return <section className="page-content create-page"><header className="page-heading"><div><span className="eyebrow">Add to your journal</span><h1>Create a post</h1></div><button className="text-button" type="button" onClick={() => navigate('/')}>Cancel</button></header><div className="create-workspace"><div className="create-stepper" aria-label="Post creation steps">{steps.map((label, index) => <div className={`step-item ${step === index + 1 ? 'active' : ''} ${step > index + 1 ? 'done' : ''}`} key={label}><span>{step > index + 1 ? <Check size={15} /> : index + 1}</span>{label}</div>)}</div>{step === 1 && <div className={`upload-area ${dragging ? 'dragging' : ''}`} onDragOver={(event) => { event.preventDefault(); setDragging(true) }} onDragLeave={() => setDragging(false)} onDrop={(event) => { event.preventDefault(); setDragging(false); handleFile(event.dataTransfer.files[0]) }}><span className="upload-icon"><ImagePlus size={27} /></span><h2>Start with a photo</h2><p>Choose a moment from your device, or drop it here.</p><button className="primary-button" type="button" onClick={() => inputRef.current?.click()}><Upload size={17} /> Choose from device</button><input ref={inputRef} className="visually-hidden" type="file" accept="image/*" onChange={(event) => handleFile(event.target.files[0])} /></div>}{step === 2 && <div className="preview-step"><div className="preview-image-wrap"><img className={`filter-${filter.toLowerCase()}`} src={preview} alt="Your selected post preview" /></div><div className="filter-panel"><span className="eyebrow">01 / Make it yours</span><h2>A little finishing touch.</h2><p className="subtle-text">Your original photo stays untouched.</p><div className="filter-options">{['Original', 'Soft', 'Warm', 'Mono'].map((item) => <button type="button" className={filter === item ? 'selected' : ''} key={item} onClick={() => setFilter(item)}><span className={`filter-swatch filter-${item.toLowerCase()}`} /><span>{item}</span></button>)}</div><label className="field-label">Crop <select defaultValue="Original"><option>Original</option><option>Square</option><option>Portrait</option><option>Landscape</option></select></label><button type="button" className="primary-button step-next" onClick={() => setStep(3)}>Continue <ChevronRight size={17} /></button><button type="button" className="text-button" onClick={() => setStep(1)}>Choose another photo</button></div></div>}{step === 3 && <form className="post-details-form" onSubmit={share}><div className="details-preview"><img src={preview} alt="Selected post" /><span><Check size={16} /> Ready to share</span></div><div className="details-fields"><label className="field-label">Caption<textarea rows="5" maxLength={2200} placeholder="Write a little something..." value={caption} onChange={(event) => setCaption(event.target.value)} /><span className="field-hint">{caption.length} / 2,200</span></label><label className="field-label">Add location<input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Search places" /></label><label className="field-label">Tag people<input placeholder="Add usernames" /></label><label className="field-label">Accessibility text<textarea rows="2" value={altText} onChange={(event) => setAltText(event.target.value)} placeholder="Describe the photo for someone who can't see it" /></label><button type="button" className="advanced-toggle" onClick={() => setAdvanced((open) => !open)}>Advanced settings <ChevronRight size={17} className={advanced ? 'rotated' : ''} /></button>{advanced && <div className="advanced-options"><label><input type="checkbox" /> Turn off commenting</label><label><input type="checkbox" /> Hide like count on this post</label></div>}<div className="create-form-actions"><button type="button" className="secondary-button" onClick={() => setStep(2)}><ArrowLeft size={16} /> Back</button><button type="submit" className="primary-button">Share post <Send size={16} /></button></div></div></form>}</div></section>
}

function ProfileStats({ posts, followers }) {
  return <div className="profile-stats"><span><strong>{posts}</strong> posts</span><span><strong>{followers.toLocaleString()}</strong> followers</span><span><strong>486</strong> following</span></div>
}

export function Profile() {
  const { username = currentUser.username } = useParams()
  const { allPosts, followedUsers, savedPosts } = useApp()
  const [tab, setTab] = useState('Posts')
  const [selectedPost, setSelectedPost] = useState(null)
  const ownProfile = username === currentUser.username
  const user = users.find((person) => person.username === username) || { username, name: username, bio: 'Sharing small moments along the way.' }
  const ownPosts = allPosts.filter((post) => post.username === username)
  const profilePosts = ownProfile && tab === 'Saved' ? allPosts.filter((post) => savedPosts.includes(post.id)) : ownPosts
  const tabs = ['Posts', 'Reels', ...(ownProfile ? ['Saved'] : []), 'Tagged']
  return <section className="page-content profile-page"><header className="profile-header"><Avatar username={username} size="profile" /><div className="profile-info"><div className="profile-title-row"><h1>{username}</h1>{ownProfile ? <Link className="secondary-button" to="/settings">Edit profile</Link> : <><FollowButton username={username} /><Link className="secondary-button" to="/messages">Message</Link></>}<button className="quiet-button profile-more" aria-label="More profile options"><SettingsIcon size={19} /></button></div><ProfileStats posts={ownPosts.length} followers={3210 + username.length * 253} /><div className="profile-bio"><strong>{user.name}</strong><p>{user.bio}</p><a href={`https://${user.website || 'fieldnote.example'}`} onClick={(event) => event.preventDefault()}>{user.website || 'fieldnote.example'}</a></div></div></header><div className="profile-tabs" role="tablist" aria-label="Profile content">{tabs.map((item) => <button type="button" role="tab" aria-selected={tab === item} className={tab === item ? 'selected' : ''} onClick={() => setTab(item)} key={item}>{item}</button>)}</div>{profilePosts.length ? <div className="profile-grid">{profilePosts.map((post) => <button type="button" className="profile-grid-item" key={post.id} onClick={() => setSelectedPost(post)}><img src={post.image} alt={post.caption} loading="lazy" onError={(event) => event.currentTarget.classList.add('image-failed')} /><span><Heart size={18} fill="currentColor" /> {post.likes.toLocaleString()} <MessageCircle size={18} fill="currentColor" /> {post.comments}</span></button>)}</div> : <div className="empty-state profile-empty"><ImagePlus size={27} /><h2>{tab === 'Saved' ? 'Your saved moments live here' : 'A fresh page'}</h2><p>{tab === 'Saved' ? 'Save posts you want to come back to.' : 'When there are posts to share, they will find a home here.'}</p>{ownProfile && tab !== 'Saved' && <Link className="text-button" to="/create">Share your first moment</Link>}</div>}{selectedPost && <PostModal post={selectedPost} onClose={() => setSelectedPost(null)} />}</section>
}

const settingsGroups = [
  { heading: 'Your account', rows: [{ id: 'profile', title: 'Edit profile', description: 'Name, username, website and bio', icon: UserRound }, { id: 'account', title: 'Account', description: 'Your account details and preferences', icon: SettingsIcon }, { id: 'privacy', title: 'Privacy', description: 'Control who can see and interact with you', icon: LockKeyhole }] },
  { heading: 'Preferences', rows: [{ id: 'notifications', title: 'Notifications', description: 'Choose what you hear about', icon: Bell }, { id: 'appearance', title: 'Appearance', description: 'Make Fieldnote feel like yours', icon: Moon }, { id: 'help', title: 'Help', description: 'Find answers and contact support', icon: MessageCircle }] },
]

export function Settings() {
  const { theme, setTheme, setAuthenticated, notify } = useApp()
  const navigate = useNavigate()
  const [section, setSection] = useState('profile')
  const activeRow = settingsGroups.flatMap((group) => group.rows).find((row) => row.id === section)
  const logout = () => { setAuthenticated(false); navigate('/login') }
  return <section className="page-content settings-page"><header className="page-heading"><div><span className="eyebrow">Make yourself at home</span><h1>Settings</h1></div></header><div className="settings-layout"><nav className="settings-nav" aria-label="Settings sections">{settingsGroups.map((group) => <div key={group.heading}><span className="settings-group-title">{group.heading}</span>{group.rows.map(({ id, title, icon: Icon }) => <button type="button" className={section === id ? 'selected' : ''} key={id} onClick={() => setSection(id)}><Icon size={18} />{title}</button>)}</div>)}</nav><section className="settings-panel"><header><div className="settings-panel-icon">{activeRow && <activeRow.icon size={20} />}</div><div><span className="eyebrow">Settings</span><h2>{activeRow?.title || 'Settings'}</h2><p className="subtle-text">{activeRow?.description}</p></div></header>{section === 'appearance' ? <div className="setting-control-row"><div><strong>Color theme</strong><span className="subtle-text">Choose a light or dark workspace.</span></div><div className="segmented-control"><button type="button" className={theme === 'light' ? 'selected' : ''} onClick={() => setTheme('light')} aria-label="Light theme"><Sun size={17} /> Light</button><button type="button" className={theme === 'dark' ? 'selected' : ''} onClick={() => setTheme('dark')} aria-label="Dark theme"><Moon size={17} /> Dark</button></div></div> : section === 'profile' ? <div className="settings-profile-edit"><div className="settings-avatar-row"><Avatar username="marin" size="lg" /><div><UserName username="marin" /><span className="subtle-text">{currentUser.name}</span></div><button className="text-button" onClick={() => notify('Photo upload is available from Create')}>Change photo</button></div><label className="field-label">Name<input defaultValue={currentUser.name} /></label><label className="field-label">Username<input defaultValue={currentUser.username} /></label><label className="field-label">Website<input defaultValue={currentUser.website} /></label><label className="field-label">Bio<textarea rows="3" defaultValue={currentUser.bio} /></label><button type="button" className="primary-button" onClick={() => notify('Profile changes saved')}>Save changes</button></div> : section === 'help' ? <div className="setting-control-row"><div><strong>Need a hand?</strong><span className="subtle-text">Browse the help center or send us a note.</span></div><button className="secondary-button" onClick={() => notify('Help center is coming soon')}>Visit help center</button></div> : <><div className="setting-control-row"><div><strong>{section === 'privacy' ? 'Private account' : 'Email updates'}</strong><span className="subtle-text">{section === 'privacy' ? 'Only approved followers can see your posts.' : 'Get occasional updates about your community.'}</span></div><label className="switch-control"><input type="checkbox" /><span /></label></div><div className="setting-control-row"><div><strong>{section === 'notifications' ? 'Push notifications' : 'Activity status'}</strong><span className="subtle-text">Manage when others can see your activity.</span></div><label className="switch-control"><input type="checkbox" defaultChecked /><span /></label></div></>}<div className="settings-logout"><button type="button" className="logout-button" onClick={logout}>Log out</button><span className="subtle-text">You can sign back in at any time.</span></div></section></div></section>
}