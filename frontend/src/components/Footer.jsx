import { site } from '../config/site.js';

export default function Footer({ profile }) {
  return (
    <footer className="border-t border-slate-200 py-8 text-center text-sm text-slate-500 dark:border-slate-800">
      © {new Date().getFullYear()} {profile?.name ?? site.githubUsername}. Built with React, Tailwind and nginx.
    </footer>
  );
}
