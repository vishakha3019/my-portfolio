export type Level = 'shipped' | 'working'

export type Domain = {
  name: string
  line: string
  skills: { name: string; level: Level }[]
}

// "shipped" = named in project work on the resume. "working" = listed as a skill or "familiar with".
export const domains: Domain[] = [
  {
    name: 'Frontend',
    line: 'Interfaces people use every day',
    skills: [
      { name: 'Angular 19 / v15+', level: 'shipped' },
      { name: 'React', level: 'shipped' },
      { name: 'TypeScript', level: 'shipped' },
      { name: 'Angular Material', level: 'shipped' },
      { name: 'Tailwind CSS', level: 'shipped' },
      { name: 'JavaScript ES6+', level: 'working' },
      { name: 'HTML5 · CSS3', level: 'working' },
    ],
  },
  {
    name: 'Backend',
    line: 'APIs and services behind them',
    skills: [
      { name: 'Node.js', level: 'shipped' },
      { name: 'Express.js', level: 'shipped' },
      { name: 'REST API design', level: 'shipped' },
      { name: 'Microservices', level: 'shipped' },
      { name: 'MongoDB', level: 'shipped' },
    ],
  },
  {
    name: 'Cloud and delivery',
    line: 'Getting it to production',
    skills: [
      { name: 'CI/CD pipelines', level: 'shipped' },
      { name: 'Git · GitHub · GitLab', level: 'working' },
      { name: 'Docker', level: 'working' },
      { name: 'AWS', level: 'working' },
    ],
  },
  {
    name: 'AI engineering',
    line: 'Agents in the loop, judgement on top',
    skills: [
      { name: 'Claude Code', level: 'shipped' },
      { name: 'Claude Design', level: 'shipped' },
      { name: 'OpenAI Codex', level: 'shipped' },
      { name: 'GitHub Copilot', level: 'working' },
      { name: 'Cursor', level: 'working' },
      { name: 'Context engineering', level: 'working' },
    ],
  },
]

export const quality = ['Jest', 'Vitest', 'Supertest', 'Playwright', 'Core Web Vitals', 'GTmetrix', 'Technical SEO']

export const workflow = [
  { step: 'Requirements', ai: 'Summarises notes and drafts clarifying questions.', me: 'The scope, agreed with the client or team.' },
  { step: 'Planning', ai: 'Breaks features into tasks and flags edge cases.', me: 'Priorities and what ships first.' },
  { step: 'Architecture', ai: 'Proposes service boundaries and API shapes.', me: 'The design, and the trade-offs behind it.' },
  { step: 'Build', ai: 'Generates and refactors code from a well-scoped context.', me: 'Context engineering and every line that merges.' },
  { step: 'Testing', ai: 'Drafts unit, integration and end-to-end cases.', me: 'Which behaviour needs coverage, and running it.' },
  { step: 'Review', ai: 'First-pass review for bugs and style.', me: 'The final review and the fix.' },
  { step: 'Delivery', ai: 'Drafts release notes and checklists.', me: 'The release, and what happens after it.' },
]

export const education = {
  degree: 'B.Tech, Computer Science and Engineering',
  school: 'Lyallpur Khalsa College of Engineering, Jalandhar',
  year: 'July 2024',
  score: 'SGPA 9.14',
}

// Titles exactly as on the resume. An issuer is shown only where it is part of the certificate's own name.
export type Certification = { title: string; issuer?: string; topic: string; distinction?: string }

export const certifications: Certification[] = [
  { title: 'AWS Academy Graduate', issuer: 'AWS Academy', topic: 'Cloud' },
  { title: 'Master AI-driven development using Claude Code', topic: 'AI-driven development' },
  { title: 'Generative AI: Prompt Engineering Basics', topic: 'Generative AI' },
  { title: 'Google Prompting Essentials Specialization', issuer: 'Google', topic: 'Prompt engineering' },
  { title: 'The Joy of Computing Using Python', issuer: 'NPTEL', topic: 'Python', distinction: 'Elite' },
]
