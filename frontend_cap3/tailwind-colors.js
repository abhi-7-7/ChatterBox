// Tailwind-compatible color tokens for ChatterBox themes
// Drop this object into your `tailwind.config.js` theme.extend.colors

module.exports = {
  chatter: {
    light: {
      primary: '#4a90e2',
      'primary-600': '#3b7fc9',
      secondary: '#7aa2b8',
      bg: '#f6f8fb',
      surface: '#ffffff',
      border: '#e6e9ef',
      text: '#1f2933',
      muted: '#6b7280',
      bubbleUser: '#d9e9ff',
      bubbleBot: '#f0f2f5'
    },
    dark: {
      primary: '#60a5fa',
      'primary-600': '#4f8ee6',
      secondary: '#5eead4',
      bg: '#0f1720',
      surface: '#0b1220',
      border: '#1f2933',
      text: '#e6eef8',
      muted: '#9aa4b2',
      bubbleUser: '#15354a',
      bubbleBot: '#0e1620'
    },
    vintage: {
      primary: '#d6a76b',
      'primary-600': '#c59257',
      secondary: '#bfa286',
      bg: '#fbf7f2',
      surface: '#fffaf6',
      border: '#efe7dd',
      text: '#2b2a28',
      muted: '#807560',
      bubbleUser: '#fff1e6',
      bubbleBot: '#f7f3ef'
    }
  }
};
