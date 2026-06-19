import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Day In Day In',
    short_name: 'DayInDayIn',
    description: 'Art prints by Stine Weirsøe Flamant. Made by hand in Copenhagen.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F7F4',
    theme_color: '#2C3440',
    icons: [
      {
        src: '/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/apple-icon.png',
        sizes: '180x180',
        type: 'image/png',
      },
    ],
  }
}
