import { site } from '../config/site.js';
import { GitHubIcon, LinkedInIcon, MailIcon } from './Icons.jsx';

// Phase 2: add a form that POSTs to /api/contact
export default function Contact({ profile }) {
  const links = [
    site.contact.email && { href: `mailto:${site.contact.email}`, label: site.contact.email, Icon: MailIcon },
    site.contact.linkedin && { href: site.contact.linkedin, label: 'LinkedIn', Icon: LinkedInIcon },
    {
      href: profile?.htmlUrl ?? `https://github.com/${site.githubUsername}`,
      label: `github.com/${site.githubUsername}`,
      Icon: GitHubIcon,
    },
  ].filter(Boolean);

  return (
    <section id="contact" className="container-page py-16">
      <h2 className="section-title">Contact</h2>
      <div className="card max-w-3xl p-6">
        <p className="text-slate-600 dark:text-slate-400">
          Open to collaborations and new opportunities. The best way to reach me:
        </p>
        <ul className="mt-5 flex flex-wrap gap-3">
          {links.map(({ href, label, Icon }) => (
            <li key={href}>
              <a
                href={href}
                target={href.startsWith('mailto:') ? undefined : '_blank'}
                rel="noreferrer"
                className="btn-secondary"
              >
                <Icon /> {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
