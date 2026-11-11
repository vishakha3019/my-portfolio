export type Chapter = {
  title: string
  kind: string
  line: string
  details: string[]
  tags: string[]
}

export const role = {
  title: 'Software Engineer',
  company: 'Relinns Technologies',
  place: 'Mohali, Punjab',
  start: '2024',
  end: 'Now',
  period: 'January 2024 – Present',
}

// One role, told as the six bodies of work listed on the resume.
export const chapters: Chapter[] = [
  {
    title: 'Chill Out',
    kind: 'Client project',
    line: 'On-demand ice cream delivery with admin, driver and customer workflows.',
    details: [
      'Developed the platform with Angular 19, Node.js, Express.js, TypeScript and MongoDB.',
      'Worked on 6 microservices: authentication, payments, order tracking, notifications, file uploads and analytics.',
      'Built admin dashboards, driver approval, order management and CMS modules with Angular Material and Tailwind CSS.',
      'Used Claude Design, Claude Code and OpenAI Codex for design-to-code, generation, debugging, refactoring and tests.',
    ],
    tags: ['Angular 19', 'Node.js', 'MongoDB', 'Microservices'],
  },
  {
    title: 'Authentic Drilling',
    kind: 'Client project',
    line: 'Organisation management for drilling operations, from employees to equipment.',
    details: [
      'Developed and maintained a full-stack platform with Angular, Node.js, Express.js and MongoDB.',
      'Built admin modules for employees, projects, equipment, tasks and operational workflows.',
      'Developed REST APIs, CRUD functionality and Google Maps location tracking.',
      'Joined client meetings to clarify requirements and implement requested changes.',
    ],
    tags: ['Angular', 'REST APIs', 'Google Maps'],
  },
  {
    title: 'Web performance',
    kind: 'Three production websites',
    line: 'Core Web Vitals and technical SEO across three production websites.',
    details: [
      'Reduced LCP from 4.5s to 2.3s and CLS from 0.25 to 0.08 across three production websites.',
      'Implemented meta tags, indexing directives and structured content.',
      'Ran GTmetrix audits to find bottlenecks and optimise JavaScript execution.',
      'Improved loading through code optimisation, lazy loading and asset optimisation.',
    ],
    tags: ['Core Web Vitals', 'SEO', 'GTmetrix'],
  },
  {
    title: 'BotPenguin',
    kind: 'Product',
    line: 'Reusable interface components for a global AI chatbot platform.',
    details: [
      'Developed reusable Angular and React components for a platform serving users worldwide.',
      'Contributed to frontend implementation and low-level design in a 20+ member engineering team.',
      'Shipped UI enhancements and feature updates with design, backend and QA.',
      'Worked on cross-browser compatibility, responsive layouts and bug fixes.',
    ],
    tags: ['Angular', 'React', 'LLD'],
  },
  {
    title: 'Project management tool',
    kind: 'Internal tool',
    line: 'Timesheets, tasks and reporting in React for 50+ teammates.',
    details: [
      'Developed a React app for timesheet tracking, task management and reporting used by 50+ team members.',
      'Implemented task assignment, status tracking and CRUD for project activities.',
      'Built reusable components with Hooks and the Context API for document and file management.',
      'Improved form validation and UI workflows, reducing data-entry discrepancies by 50%.',
    ],
    tags: ['React', 'Hooks', 'Context API'],
  },
  {
    title: 'AppsRhino',
    kind: 'Product',
    line: 'An Angular e-commerce platform with catalog, cart and checkout.',
    details: [
      'Developed the storefront with product catalog, shopping cart and checkout.',
      'Integrated REST APIs for products, cart and orders with Node.js and Express.js.',
      'Implemented lazy loading and frontend optimisations for faster initial load.',
      'Supported CI/CD pipelines, production deployments and maintenance.',
    ],
    tags: ['Angular', 'Express', 'CI/CD'],
  },
]
