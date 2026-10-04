import { site } from '../config/site.js';

export default function About() {
  const paragraphs = site.about.split(/\n\s*\n/).filter(Boolean);

  return (
    <section id="about" className="container-page py-16">
      <h2 className="section-title">About</h2>
      <div className="card max-w-3xl space-y-4 p-6 leading-relaxed text-slate-700 dark:text-slate-300">
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
    </section>
  );
}
