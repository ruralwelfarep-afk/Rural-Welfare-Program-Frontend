import { useState, useEffect, useRef, useCallback } from 'react'
import { MdChevronLeft, MdChevronRight } from 'react-icons/md'

const images = [
  { src: './gallery/g1.webp', alt: 'Health Camp 1' },
  { src: './gallery/g2.webp', alt: 'Health Camp 2' },
  { src: './gallery/g3.webp', alt: 'Health Camp 3' },
  { src: './gallery/g4.png', alt: 'Health Camp 4' },
  { src: './gallery/g5.png', alt: 'Health Camp 5' },
  { src: './gallery/g6.png', alt: 'Health Camp 6' },
]

function useColumns() {
  const [cols, setCols] = useState(3)
  useEffect(() => {
    const update = () => {
      if (window.innerWidth < 640) setCols(1)
      else if (window.innerWidth < 1024) setCols(2)
      else setCols(3)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])
  return cols
}

export default function Gallery() {
  const cols = useColumns()
  const total = images.length

  // Clone: [last N clones] + [original] + [first N clones]
  // where N = cols, so we can always slide smoothly in both directions
  const cloned = [
    ...images.slice(-cols),   // clones at start
    ...images,                 // originals
    ...images.slice(0, cols),  // clones at end
  ]

  // Start index = cols (after the leading clones)
  const [index, setIndex] = useState(cols)
  const [transition, setTransition] = useState(true)
  const trackRef = useRef(null)
  const timerRef = useRef(null)
  const isJumping = useRef(false)

  const itemWidth = 100 / cols

  // After a clone boundary is hit, instantly jump to the real position
  const handleTransitionEnd = useCallback(() => {
    if (isJumping.current) return
    const realStart = cols
    const realEnd = cols + total - 1

    if (index < realStart) {
      isJumping.current = true
      setTransition(false)
      setIndex(realEnd - (realStart - index - 1))
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true)
          isJumping.current = false
        })
      })
    } else if (index > realEnd) {
      isJumping.current = true
      setTransition(false)
      setIndex(realStart + (index - realEnd - 1))
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setTransition(true)
          isJumping.current = false
        })
      })
    }
  }, [index, cols, total])

  const startTimer = useCallback(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setIndex(i => i + 1)
    }, 3000)
  }, [])

  useEffect(() => {
    // Reset to correct offset when cols change
    setTransition(false)
    setIndex(cols)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setTransition(true))
    })
    startTimer()
    return () => clearInterval(timerRef.current)
  }, [cols])

  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    track.addEventListener('transitionend', handleTransitionEnd)
    return () => track.removeEventListener('transitionend', handleTransitionEnd)
  }, [handleTransitionEnd])

  const prev = () => {
    setTransition(true)
    setIndex(i => i - 1)
    startTimer()
  }

  const next = () => {
    setTransition(true)
    setIndex(i => i + 1)
    startTimer()
  }

  // Dot index: map current index to real 0-based image index
  const dotIndex = ((index - cols) % total + total) % total

  return (
    <section className="py-12 md:py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-[#4a9e5c] uppercase text-xs font-bold tracking-widest">Gallery</span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1a5c2a] mt-2">Our Work in Action</h2>
        </div>

        {/* Slider */}
        <div className="relative">
          <div style={{ overflow: 'hidden', borderRadius: 16 }}>
            <div
              ref={trackRef}
              style={{
                display: 'flex',
                transform: `translateX(-${index * itemWidth}%)`,
                transition: transition ? 'transform 0.5s cubic-bezier(0.4,0,0.2,1)' : 'none',
                willChange: 'transform',
              }}
            >
              {cloned.map((img, i) => (
                <div
                  key={i}
                  style={{ minWidth: `${itemWidth}%`, padding: '0 6px', boxSizing: 'border-box' }}
                >
                  <div style={{ borderRadius: 12, overflow: 'hidden', aspectRatio: '4/3', background: '#f0f0f0' }}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.5s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.06)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Left Arrow */}
          <button
            onClick={prev}
            style={{
              position: 'absolute', top: '50%', left: -18,
              transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%',
              background: '#1a5c2a', border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              transition: 'background 0.2s', zIndex: 10,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2d7a3a'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a5c2a'}
          >
            <MdChevronLeft size={22} />
          </button>

          {/* Right Arrow */}
          <button
            onClick={next}
            style={{
              position: 'absolute', top: '50%', right: -18,
              transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%',
              background: '#1a5c2a', border: 'none', color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
              transition: 'background 0.2s', zIndex: 10,
            }}
            onMouseEnter={e => e.currentTarget.style.background = '#2d7a3a'}
            onMouseLeave={e => e.currentTarget.style.background = '#1a5c2a'}
          >
            <MdChevronRight size={22} />
          </button>
        </div>

        {/* Dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 20 }}>
          {images.map((_, i) => (
            <button
              key={i}
              onClick={() => { setTransition(true); setIndex(cols + i); startTimer() }}
              style={{
                width: i === dotIndex ? 22 : 7,
                height: 7,
                borderRadius: 99,
                border: 'none',
                cursor: 'pointer',
                padding: 0,
                backgroundColor: i === dotIndex ? '#1a5c2a' : '#c8e6c9',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>

      </div>
    </section>
  )
}