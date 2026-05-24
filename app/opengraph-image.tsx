import { ImageResponse } from 'next/og'

export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          width: '100%',
          height: '100%',
          background: '#E8D6CF',
        }}
      >
        {/* Left half */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            width: '60%',
            padding: '64px 72px',
            gap: '16px',
          }}
        >
          <div
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 72,
              fontWeight: 900,
              color: '#111111',
              letterSpacing: '-0.03em',
              lineHeight: 1,
            }}
          >
            Day In Day In
          </div>
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: 28,
              color: '#888480',
              fontWeight: 400,
              marginTop: '8px',
            }}
          >
            Art by Stine Weirsøe Flamant
          </div>
        </div>

        {/* Right accent block */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '40%',
            background: '#D94F2C',
          }}
        >
          <div
            style={{
              fontFamily: 'sans-serif',
              fontSize: 26,
              fontWeight: 600,
              color: '#FFFFFF',
              letterSpacing: '0.04em',
            }}
          >
            dayindayin.dk
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  )
}
