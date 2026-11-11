export type MockKind = 'delivery' | 'vitals' | 'board' | 'map' | 'chat' | 'shop'

export type Project = {
  slug: string
  title: string
  kind: string
  summary: string
  problem: string
  solution: string
  role: string[]
  architecture: { label: string; items: string[] }[]
  stack: string[]
  features: string[]
  focus: { challenge: string; approach: string }[]
  results: { value: string; label: string }[]
  /** each project tints the 3D world with its own colour */
  hue: string
  mock: MockKind
}

// Every fact below comes from the resume. Mockups are illustrative and labelled as such in the UI.
export const projects: Project[] = [
  {
    slug: 'chill-out',
    title: 'Chill Out',
    kind: 'Client project · Delivery platform',
    summary: 'An on-demand ice cream delivery platform with separate workflows for admins, drivers and customers.',
    problem: 'One platform had to run ordering, delivery and operations for three very different kinds of user.',
    solution:
      'A MEAN-stack platform split into six microservices, with responsive admin dashboards and modules for driver approval, order management and content.',
    role: [
      'Developed the platform with Angular 19, Node.js, Express.js, TypeScript and MongoDB.',
      'Worked on 6 microservices: authentication, payments, order tracking, notifications, file uploads and analytics.',
      'Built admin dashboards, driver approval, order management and CMS modules with Angular Material and Tailwind CSS.',
      'Used Claude Design, Claude Code and OpenAI Codex for design-to-code, code generation, debugging, refactoring and test generation.',
    ],
    architecture: [
      { label: 'Users', items: ['Admin', 'Driver', 'Customer'] },
      { label: 'Frontend', items: ['Angular 19', 'Angular Material', 'Tailwind CSS'] },
      { label: 'Services', items: ['Auth', 'Payments', 'Order tracking', 'Notifications', 'File uploads', 'Analytics'] },
      { label: 'Data', items: ['MongoDB'] },
    ],
    stack: ['Angular 19', 'TypeScript', 'Node.js', 'Express.js', 'MongoDB', 'Angular Material', 'Tailwind CSS'],
    features: ['Admin dashboards', 'Driver approval', 'Order management', 'Order tracking', 'Notifications', 'CMS modules'],
    focus: [
      { challenge: 'Three user roles with different workflows on one platform.', approach: 'Dedicated admin, driver and customer flows on top of shared microservices.' },
      { challenge: 'Turning UI concepts into working screens.', approach: 'AI-assisted design-to-code with Claude Design, Claude Code and Codex.' },
    ],
    results: [
      { value: '6', label: 'Microservices' },
      { value: '3', label: 'User roles' },
    ],
    hue: '#f2a9c4',
    mock: 'delivery',
  },
  {
    slug: 'web-performance',
    title: 'Web Vitals',
    kind: 'Production · Three websites',
    summary: 'Core Web Vitals and technical SEO work across three production websites.',
    problem: 'Three production websites loaded slowly and shifted while loading, which hurt both users and search visibility.',
    solution:
      'GTmetrix audits to find bottlenecks, then code optimisation, lazy loading, asset optimisation, lighter JavaScript execution and technical SEO.',
    role: [
      'Improved Core Web Vitals across three production websites.',
      'Implemented meta tags, indexing directives and structured content.',
      'Ran GTmetrix audits and optimised JavaScript execution.',
      'Improved loading with code optimisation, lazy loading and asset optimisation.',
    ],
    architecture: [
      { label: 'Measure', items: ['GTmetrix', 'Core Web Vitals'] },
      { label: 'Fix', items: ['Lazy loading', 'Asset optimisation', 'JS execution'] },
      { label: 'Search', items: ['Meta tags', 'Indexing directives', 'Structured content'] },
    ],
    stack: ['GTmetrix', 'Core Web Vitals', 'Technical SEO', 'Lazy loading'],
    features: ['Performance audits', 'Lazy loading', 'Asset optimisation', 'Indexing directives', 'Structured content'],
    focus: [
      { challenge: 'Largest Contentful Paint at 4.5s.', approach: 'Lazy loading, asset optimisation and lighter JavaScript execution.' },
      { challenge: 'Layout shift of 0.25 while pages loaded.', approach: 'Frontend fixes found through GTmetrix audits.' },
    ],
    results: [
      { value: '4.5s → 2.3s', label: 'LCP' },
      { value: '0.25 → 0.08', label: 'CLS' },
      { value: '3', label: 'Production sites' },
    ],
    hue: '#9fe3c3',
    mock: 'vitals',
  },
  {
    slug: 'project-tool',
    title: 'Project Tool',
    kind: 'Internal tool · React',
    summary: 'A React application for timesheets, task management and reporting, used across the company.',
    problem: 'The team needed one place to log time, assign and track tasks, and report on project activity.',
    solution: 'A React app with task assignment, status tracking, reporting and document and file management.',
    role: [
      'Developed the application for timesheet tracking, task management and reporting, used by 50+ team members.',
      'Implemented task assignment, status tracking and CRUD for project activities.',
      'Built reusable components with Hooks and the Context API for document and file management with complex state.',
      'Improved form validation and UI workflows, reducing data-entry discrepancies by 50%.',
    ],
    architecture: [
      { label: 'React', items: ['Hooks', 'Context API', 'Reusable components'] },
      { label: 'Modules', items: ['Timesheets', 'Tasks', 'Reports', 'Documents and files'] },
    ],
    stack: ['React', 'Hooks', 'Context API', 'JavaScript'],
    features: ['Timesheets', 'Task assignment', 'Status tracking', 'Reporting', 'Document management'],
    focus: [
      { challenge: 'Data-entry discrepancies in day-to-day forms.', approach: 'Stricter form validation and clearer UI workflows.' },
      { challenge: 'Complex state for documents and files.', approach: 'Reusable components built on Hooks and the Context API.' },
    ],
    results: [
      { value: '50+', label: 'Team members' },
      { value: '−50%', label: 'Data-entry errors' },
    ],
    hue: '#f0c77c',
    mock: 'board',
  },
  {
    slug: 'authentic-drilling',
    title: 'Authentic Drilling',
    kind: 'Client project · Operations',
    summary: 'A full-stack organisation management tool for running drilling operations.',
    problem: 'A drilling business needed employees, projects, equipment and tasks managed in one system.',
    solution: 'An Angular, Node.js, Express.js and MongoDB platform with admin modules, REST APIs and Google Maps location tracking.',
    role: [
      'Developed and maintained the full-stack platform with Angular, Node.js, Express.js and MongoDB.',
      'Built admin modules for employees, projects, equipment, tasks and operational workflows.',
      'Developed and integrated REST APIs, CRUD functionality and Google Maps location tracking.',
      'Joined client meetings to understand requirements, clarify queries and implement requested changes.',
    ],
    architecture: [
      { label: 'Admin', items: ['Employees', 'Projects', 'Equipment', 'Tasks'] },
      { label: 'Frontend', items: ['Angular', 'Google Maps'] },
      { label: 'API', items: ['Node.js', 'Express.js', 'REST'] },
      { label: 'Data', items: ['MongoDB'] },
    ],
    stack: ['Angular', 'Node.js', 'Express.js', 'MongoDB', 'Google Maps'],
    features: ['Employee management', 'Project tracking', 'Equipment records', 'Task workflows', 'Location tracking'],
    focus: [
      { challenge: 'Requirements that changed as operations were discussed.', approach: 'Worked directly with the client in meetings and implemented the agreed changes.' },
    ],
    results: [],
    hue: '#e3956a',
    mock: 'map',
  },
  {
    slug: 'botpenguin',
    title: 'BotPenguin',
    kind: 'Product · Global AI chatbot platform',
    summary: 'Interface work on a chatbot platform that serves users worldwide.',
    problem: 'A global product needed reusable interface components and steady UI improvements across browsers and screen sizes.',
    solution: 'Reusable Angular and React components, low-level design input and feature updates shipped with design, backend and QA.',
    role: [
      'Developed reusable Angular and React components for the platform.',
      'Contributed to frontend implementation and low-level design in a 20+ member engineering team.',
      'Implemented UI enhancements and feature updates with design, backend and QA teams.',
      'Worked on cross-browser compatibility, responsive layouts and frontend bug fixes.',
    ],
    architecture: [
      { label: 'UI', items: ['Angular', 'React', 'Reusable components'] },
      { label: 'Team', items: ['Design', 'Backend', 'QA'] },
    ],
    stack: ['Angular', 'React', 'TypeScript'],
    features: ['Reusable components', 'Low-level design', 'Responsive layouts', 'Cross-browser fixes'],
    focus: [{ challenge: 'Consistency across a large shared frontend.', approach: 'Reusable components and low-level design reviewed with the team.' }],
    results: [{ value: '20+', label: 'Engineering team' }],
    hue: '#93b8ff',
    mock: 'chat',
  },
  {
    slug: 'appsrhino',
    title: 'AppsRhino',
    kind: 'Product · E-commerce',
    summary: 'An Angular e-commerce platform with catalog, cart and checkout.',
    problem: 'Shoppers needed to browse, add to cart and check out without waiting on a heavy first load.',
    solution: 'An Angular storefront on Node.js and Express.js APIs, with lazy loading and frontend optimisations.',
    role: [
      'Developed the platform with product catalog, shopping cart and checkout.',
      'Integrated REST APIs for product data, cart operations and order management using Node.js and Express.js.',
      'Implemented lazy loading and frontend optimisations to improve initial load.',
      'Supported CI/CD pipelines, production deployments and maintenance.',
    ],
    architecture: [
      { label: 'Storefront', items: ['Angular', 'Lazy loading'] },
      { label: 'API', items: ['Node.js', 'Express.js', 'REST'] },
      { label: 'Delivery', items: ['CI/CD', 'Deployments'] },
    ],
    stack: ['Angular', 'Node.js', 'Express.js', 'CI/CD'],
    features: ['Product catalog', 'Shopping cart', 'Checkout', 'Order management'],
    focus: [{ challenge: 'Slow initial application load.', approach: 'Lazy loading and frontend optimisations.' }],
    results: [],
    hue: '#c3a6ff',
    mock: 'shop',
  },
]
