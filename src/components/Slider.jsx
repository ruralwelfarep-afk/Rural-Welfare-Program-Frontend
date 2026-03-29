import { useState, useEffect, useRef } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

const slides = [
  {
    id: 1,
    title: 'Healthcare for',
    titleAccent: 'Every Village',
    accentColor: '#f0c020',
    bgImage: '/1.webp',
  },
  {
    id: 2,
    title: 'Empowered Women,',
    titleAccent: 'Prosperous India',
    accentColor: '#f0c020',
    bgImage: '/2.webp',
  },
  {
    id: 3,
    title: 'Healthy Villages,',
    titleAccent: 'Happy Families',
    accentColor: '#f0c020',
    bgImage: '/3.webp',
  },
  {
    id: 4,
    title: 'Together We Build,',
    titleAccent: 'A Better Tomorrow',
    accentColor: '#f0c020',
    bgImage: '/4.webp',
  },
]

const arrowBtn = {
  position: 'absolute',
  zIndex: 20,
  top: '50%',
  transform: 'translateY(-50%)',
  width: 44,
  height: 44,
  background: 'rgba(0,0,0,0.45)',
  backdropFilter: 'blur(8px)',
  border: '1.5px solid rgba(255,255,255,0.5)',
  color: '#fff',
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: 'transform 0.2s, background 0.2s',
  boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
}

export default function Slider() {
  const [current, setCurrent] = useState(0)
  const [prevIdx, setPrevIdx] = useState(null)
  const [dir, setDir] = useState('next')
  const [animating, setAnimating] = useState(false)
  const timerRef = useRef(null)

  const goTo = (idx, direction = 'next') => {
    if (animating || idx === current) return
    setDir(direction)
    setPrevIdx(current)
    setCurrent(idx)
    setAnimating(true)
    setTimeout(() => { setPrevIdx(null); setAnimating(false) }, 580)
  }

  const startTimer = () => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % slides.length
        setDir('next')
        setPrevIdx(c)
        setAnimating(true)
        setTimeout(() => { setPrevIdx(null); setAnimating(false) }, 580)
        return next
      })
    }, 5000)
  }

  useEffect(() => { startTimer(); return () => clearInterval(timerRef.current) }, [])

  const handlePrev = () => { goTo((current - 1 + slides.length) % slides.length, 'prev'); startTimer() }
  const handleNext = () => { goTo((current + 1) % slides.length, 'next'); startTimer() }

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{ aspectRatio: '16/7', minHeight: 160 }}
    >

      {/* ── SLIDES ── */}
      {slides.map((s, i) => {
        const isCurrent = i === current
        const isPrev = i === prevIdx

        let animStyle = {}
        if (isCurrent && animating) {
          animStyle = { animation: `${dir === 'next' ? 'inFromRight' : 'inFromLeft'} 0.58s cubic-bezier(0.4,0,0.2,1) forwards` }
        } else if (isPrev && animating) {
          animStyle = { animation: `${dir === 'next' ? 'outToLeft' : 'outToRight'} 0.58s cubic-bezier(0.4,0,0.2,1) forwards` }
        } else if (!isCurrent) {
          animStyle = { transform: 'translateX(100%)', visibility: 'hidden' }
        }

        return (
          <div
            key={s.id}
            className="absolute inset-0"
            style={{ zIndex: isCurrent ? 2 : isPrev ? 1 : 0, ...animStyle }}
          >
            {/* Image */}
            <img
              src={s.bgImage}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', display: 'block' }}
            />

            {/* Headings — CENTER (both horizontal & vertical) */}
            {isCurrent && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  textAlign: 'center',
                  animation: 'headUp 0.5s 0.22s cubic-bezier(0.22,1,0.36,1) both',
                  zIndex: 10,
                }}
              >
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                  fontWeight: 700,
                  color: '#fff',
                  lineHeight: 1.15,
                  textShadow: '0 2px 20px rgba(0,0,0,0.6)',
                  margin: 0,
                }}>
                  {s.title}
                </h2>
                <h2 style={{
                  fontSize: 'clamp(1.5rem, 4vw, 3.5rem)',
                  fontWeight: 700,
                  color: s.accentColor,
                  lineHeight: 1.15,
                  textShadow: '0 2px 20px rgba(0,0,0,0.5)',
                  margin: 0,
                }}>
                  {s.titleAccent}
                </h2>
              </div>
            )}
          </div>
        )
      })}

      {/* ── LEFT ARROW ── */}
      <button
        onClick={handlePrev}
        style={{
          ...arrowBtn,
          left: 'clamp(6px, 2vw, 12px)',
          width: 'clamp(28px, 5vw, 44px)',
          height: 'clamp(28px, 5vw, 44px)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
      >
        <MdChevronLeft style={{ fontSize: 'clamp(16px, 3vw, 26px)' }} />
      </button>

      {/* ── RIGHT ARROW ── */}
      <button
        onClick={handleNext}
        style={{
          ...arrowBtn,
          right: 'clamp(6px, 2vw, 12px)',
          width: 'clamp(28px, 5vw, 44px)',
          height: 'clamp(28px, 5vw, 44px)',
        }}
        onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1.1)'}
        onMouseLeave={e => e.currentTarget.style.transform = 'translateY(-50%) scale(1)'}
      >
        <MdChevronRight style={{ fontSize: 'clamp(16px, 3vw, 26px)' }} />
      </button>

      {/* ── DOTS ── */}
      <div style={{ position: 'absolute', zIndex: 20, bottom: 14, left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: 8 }}>
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => { goTo(i, i > current ? 'next' : 'prev'); startTimer() }}
            style={{
              width: i === current ? 22 : 7,
              height: 7,
              borderRadius: 99,
              border: 'none',
              cursor: 'pointer',
              padding: 0,
              backgroundColor: i === current ? slides[current].accentColor : 'rgba(255,255,255,0.5)',
              transition: 'all 0.3s',
            }}
          />
        ))}
      </div>

      {/* ── WAVE ── */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, width: '100%', zIndex: 10, pointerEvents: 'none' }}>
        <svg viewBox="0 0 1440 50" preserveAspectRatio="none" style={{ width: '100%', height: 40, display: 'block' }}>
          <path d="M0,50 C360,5 1080,45 1440,15 L1440,50 Z" fill="#f9f6ef" />
        </svg>
      </div>

      <style>{`
        @keyframes inFromRight  { from { transform: translateX(100%); } to { transform: translateX(0); } }
        @keyframes inFromLeft   { from { transform: translateX(-100%); } to { transform: translateX(0); } }
        @keyframes outToLeft    { from { transform: translateX(0); } to { transform: translateX(-100%); } }
        @keyframes outToRight   { from { transform: translateX(0); } to { transform: translateX(100%); } }
        @keyframes headUp       { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  )
}