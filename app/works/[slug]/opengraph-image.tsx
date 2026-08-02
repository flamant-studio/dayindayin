import { ImageResponse } from 'next/og'
import { getWork } from '@/lib/data'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

interface Props { params: Promise<{ slug: string }> }

export default async function WorkOGImage({ params }: Props) {
  const { slug } = await params
  const work = getWork(slug)

  const title = work?.title ?? 'Day In Day In'
  const imageUrl = work?.image ?? null

  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#FFFFFF',
        }}
      >
        {/* Artwork image left half */}
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            style={{ width: '50%', height: '100%', objectFit: 'cover' }}
          />
        ) : (
          <div style={{ width: '50%', height: '100%', background: '#FCE8E2' }} />
        )}

        {/* Text right half */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: '64px 56px',
            flex: 1,
            gap: '16px',
          }}
        >
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: title.length > 30 ? 40 : 52,
              fontWeight: 900,
              color: '#1A1714',
              lineHeight: 1.1,
              letterSpacing: '-0.02em',
            }}
          >
            {title}
          </div>
          <div style={{ fontFamily: 'sans-serif', fontSize: 22, color: '#888480', fontWeight: 300 }}>
            Original work by Stine Weirsøe Flamant
          </div>
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: 16,
              color: '#FFFFFF',
              fontWeight: 600,
              letterSpacing: '0.06em',
              background: '#95619B',
              padding: '8px 20px',
              alignSelf: 'flex-start',
              marginTop: '8px',
            }}
          >
            dayindayin.dk
          </div>
        </div>
      </div>
    ),
    { ...size }
  )
}
