// Single source for personal details. Everything here comes from the resume.
export const profile = {
  name: 'Vishakha',
  role: 'Software Engineer · Full stack',
  location: 'Punjab, India',
  email: 'vishakha3019@gmail.com',
  portrait: '/images/vishakha.jpg',
  links: {
    linkedin: 'https://linkedin.com/in/vishakha3012',
    github: 'https://github.com/vishakha3019',
  },
  statement:
    'I build across the whole request, from the interface to the data, and I use AI efficiently so the people I work with get reliable features in less time.',
  about: [
    "I'm Vishakha, a full-stack software engineer.",
    'For over two years I have shipped client platforms, an internal tool and a global AI product, mostly in Angular and Node.js and increasingly in React.',
    'AI does the heavy lifting. I own the architecture, the review and the result.',
  ],
  facts: [
    { label: 'Based in', value: 'Punjab, India' },
    { label: 'Education', value: 'B.Tech CSE · SGPA 9.14' },
    { label: 'Languages', value: 'English · Hindi · Punjabi' },
  ],
  stack: ['Angular', 'React', 'Node.js', 'Express', 'MongoDB'],
  contactWord: "Let's build",
} as const

/** Opens the visitor's mail app with a new message to the resume address. */
export const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Let's talk")}`
