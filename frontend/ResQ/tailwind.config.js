/** @type {import('tailwindcss').Config} */
export default {
  theme: {
    extend: {
      colors: {
        // Primary palette
        'cream': '#EBF4DD',
        'sage': '#90AB8B',
        'forest': '#5A7863',
        'charcoal': '#3B4953',
        // Donor palette - Earthy tones
        'donor-light': '#EBF4DD',
        'donor-accent': '#90AB8B',
        'donor-primary': '#5A7863',
        'donor-dark': '#3B4953',
        // Donor palette - Deep blues
        'donor-navy': '#0C2C55',
        'donor-teal': '#296374',
        'donor-sky': '#629FAD',
        'donor-cream': '#EDEDCE',
        'donor-deep': '#0F2854',
        'donor-blue': '#1C4D8D',
        'donor-bright': '#4988C4',
        'donor-pale': '#BDE8F5',
      },
      animation: {
        'marquee': 'marquee 15s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
