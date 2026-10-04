// Content you edit by hand. Anything left null falls back to the GitHub profile.
export const site = {
  githubUsername: 'Rushee123',

  // Overrides for GitHub profile fields (null = use GitHub's value)
  name: null,
  title: 'Software Developer',
  bio: null,
  location: null,

  // Longer text for the About section. Paragraphs are separated by blank lines.
  about: `I build web apps and backend services, mostly with Python (FastAPI, Flask) and JavaScript (React).

I enjoy turning ideas into working products, from small utilities to full-stack apps.`,

  // TODO: fill in real contact details
  contact: {
    email: null, // e.g. 'you@example.com'
    linkedin: 'https://www.linkedin.com/in/rushabh-panchal/',
  },

  // Shown first, in this order (exact repo names)
  featuredRepos: [
    'karmlogistics',
    'ad_metrics_project',
    'rushabhdynamodb',
    'Notes_app',
    'Weather_App2',
    'pizza_app',
  ],

  // Never shown (forks are hidden automatically)
  hiddenRepos: ['gitlearning', 'Rushabh_New', 'Rushabh_Protfolio', 'resume'],

  // Static skills, merged with the languages detected from repos
  skills: {
    Languages: ['Python', 'JavaScript', 'Java', 'HTML', 'CSS', 'SQL'],
    Frameworks: ['FastAPI', 'Flask', 'React'],
    'Cloud & Tools': ['AWS DynamoDB', 'Docker', 'nginx', 'Git'],
  },
};
