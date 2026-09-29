import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Compass, Film, Heart, Home, Menu, MessageCircle, Plus, Search, Settings, Sparkles } from 'lucide-react'
import { Avatar } from '../ui.jsx'
import { currentUser } from '../../data/mockData.js'

const navItems = [
  { label: 'Home', to: '/', icon: Home },
  { label: 'Explore', to: '/explore', icon: Compass },
  { label: 'Reels', to: '/reels', icon: Film },
  { label: 'Messages', to: '/messages', icon: MessageCircle },
  { label: 'Notifications', to: '/notifications', icon: Heart },
  { label: 'Create', to: '/create', icon: Plus },
]

function Brand({ compact = false }) {
  return <NavLink to="/" className={`brand ${compact ? 'brand-compact' : ''}`} aria-label="Fieldnote home"><span className="brand-mark"><Sparkles size={18} /></span><span>fieldnote</span></NavLink>
}

function Sidebar() {
  const navigate = useNavigate()
  return <aside className="desktop-sidebar"><Brand /><nav className="primary-nav" aria-label="Main navigation">
    {navItems.map(({ label, to, icon: Icon }) => <NavLink to={to} end={to === '/'} key={to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={21} strokeWidth={1.8} /><span>{label}</span>{label === 'Notifications' && <span className="nav-dot" />}</NavLink>)}
    <NavLink to={`/profile/${currentUser.username}`} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Avatar username={currentUser.username} size="nav" /><span>Profile</span></NavLink>
  </nav><div className="sidebar-bottom"><NavLink to="/settings" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Settings size={21} strokeWidth={1.8} /><span>Settings</span></NavLink><button className="nav-link more-button" type="button" onClick={() => navigate('/settings')}><Menu size={21} strokeWidth={1.8} /><span>More</span></button></div></aside>
}

function MobileNav() {
  return <nav className="mobile-nav" aria-label="Mobile navigation">
    <NavLink to="/" end aria-label="Home"><Home size={22} /></NavLink>
    <NavLink to="/explore" aria-label="Explore"><Search size={22} /></NavLink>
    <NavLink to="/create" aria-label="Create post"><Plus size={24} /></NavLink>
    <NavLink to="/reels" aria-label="Reels"><Film size={22} /></NavLink>
    <NavLink to={`/profile/${currentUser.username}`} aria-label="Profile"><Avatar username={currentUser.username} size="nav" /></NavLink>
  </nav>
}

export default function AppShell() {
  return <div className="app-shell"><Sidebar /><header className="mobile-header"><Brand compact /><NavLink to="/notifications" aria-label="Notifications"><Heart size={22} /></NavLink></header><main className="app-main"><Outlet /></main><MobileNav /></div>
}