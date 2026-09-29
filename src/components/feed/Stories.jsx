import { useState } from 'react'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { stories } from '../../data/mockData.js'
import { useApp } from '../../context/AppContext.jsx'
import { Avatar, IconButton, Modal, UserName } from '../ui.jsx'

export default function Stories() {
  const { viewedStories, viewStory } = useApp()
  const [activeIndex, setActiveIndex] = useState(-1)
  const current = stories[activeIndex]
  const openStory = (index) => {
    setActiveIndex(index)
    viewStory(stories[index].id)
  }
  const stepStory = (direction) => {
    const next = Math.max(0, Math.min(stories.length - 1, activeIndex + direction))
    setActiveIndex(next)
    viewStory(stories[next].id)
  }

  return <>
    <section className="stories-strip" aria-label="Stories"><div className="story-list"><button type="button" className="story-item own-story" onClick={() => window.location.assign('/create')}><span className="story-ring own-ring"><Avatar username="marin" size="story" /></span><span>your day</span><i>+</i></button>{stories.map((story, index) => <button type="button" className="story-item" key={story.id} onClick={() => openStory(index)}><span className={`story-ring ${viewedStories.includes(story.id) || story.viewed ? 'viewed' : ''}`}><Avatar username={story.username} size="story" /></span><span>{story.username}</span></button>)}</div></section>
    {current && <Modal onClose={() => setActiveIndex(-1)} className="story-viewer"><img src={current.image} alt={`${current.username}'s story`} /><div className="story-scrim" /><div className="story-viewer-progress">{stories.map((story, index) => <span key={story.id} className={index <= activeIndex ? 'complete' : ''} />)}</div><div className="story-viewer-user"><Avatar username={current.username} size="sm" /><UserName username={current.username} /><span> · 2h</span></div><IconButton label="Previous story" className="story-prev" onClick={() => stepStory(-1)} disabled={activeIndex === 0}><ArrowLeft size={19} /></IconButton><IconButton label="Next story" className="story-next" onClick={() => activeIndex === stories.length - 1 ? setActiveIndex(-1) : stepStory(1)}><ArrowRight size={19} /></IconButton></Modal>}
  </>
}