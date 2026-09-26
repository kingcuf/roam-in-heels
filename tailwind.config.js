/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        // Roam in Heels — Playfair Display (heading) + Inter (body) + Pinyon Script (wordmark)
        sans:    ['"Inter"', '-apple-system', 'BlinkMacSystemFont', 'Helvetica Neue', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', '"Cormorant Garamond"', 'Didot', 'Times New Roman', 'serif'],
        script:  ['"Pinyon Script"', '"Snell Roundhand"', 'cursive'],
      },
      colors: {
        // Brand palette — sampled from the brand mark
        cream:     '#FDF0DB',
        champagne: '#FDE0C4',
        peach:     '#F7CDA6',
        sand:      '#EDC49B',
        nude:      '#DF9E75',
        rose:      '#B0683C', // primary accent — links, primary buttons, eyebrow
        copper:    '#AE8E5D',
        cocoa:     '#684934', // hover for primary, deep accent

        // Warm neutrals (no cool greys)
        paper:     '#FBF6EF', // page bg
        bone:      '#F4ECDF', // muted card surface
        stone:     '#E6D9C7', // borders / hairlines
        driftwood: '#A89684', // captions
        bark:      '#7A5C45', // secondary text
        espresso:  '#2E1F14', // primary text

        // Semantic
        sage:    '#6E8B5C',
        amber:   '#D8A14A',
        clay:    '#B5482E',
        seafoam: '#7E9DA6',
      },
      letterSpacing: {
        eyebrow: '0.22em',
      },
      borderRadius: {
        pill: '999px',
      },
      boxShadow: {
        // All shadows are warm cocoa-tinted, never black
        xs:   '0 1px 2px rgba(104, 73, 52, 0.06)',
        soft: '0 2px 6px rgba(104, 73, 52, 0.08), 0 1px 2px rgba(104, 73, 52, 0.04)',
        card: '0 8px 24px rgba(104, 73, 52, 0.10), 0 2px 6px rgba(104, 73, 52, 0.06)',
        lift: '0 20px 48px rgba(104, 73, 52, 0.14), 0 6px 12px rgba(104, 73, 52, 0.06)',
        glow: '0 0 0 6px rgba(176, 104, 60, 0.12)',
      },
      transitionTimingFunction: {
        soft: 'cubic-bezier(.22, .61, .36, 1)',
      },
    },
  },
  plugins: [],
}
