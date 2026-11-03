import React from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

const FOCUS = [
  { title: 'Concept Development', text: 'Every project begins with a clear idea — a narrative that guides each spatial and material decision.' },
  { title: 'Spatial Planning', text: 'Layouts shaped around movement, proportion and the way people actually use a space.' },
  { title: 'Material & Texture Exploration', text: 'Testing finishes, textures and tactile qualities to give interiors depth and character.' },
  { title: 'Interior Visualization', text: 'Drawings, 3D models and renders that communicate the experience of a space before it is built.' },
  { title: 'Sustainable & Adaptive Reuse', text: 'Giving existing buildings new life while respecting their history, structure and context.' },
];

const SOFTWARE = ['AutoCAD', 'SketchUp', 'V-Ray', 'Enscape', 'Photoshop', 'Illustrator'];
const SOFT_SKILLS = ['Communication', 'Creative Thinking', 'Problem Solving', 'Learning Ability'];
const LANGUAGES = ['Gujarati', 'Hindi', 'English'];

const EDUCATION = [
  {
    period: '2023 — 2027',
    title: 'Bachelor’s in Interior Design',
    place: 'Indus Design School, Indus University, Ahmedabad',
  },
  {
    period: 'HSC & SSC',
    title: 'Higher & Secondary School Certificate (CBSE)',
    place: 'Globus Primary School',
  },
];

const STUDIOS = [
  {
    index: '01',
    period: 'Semester 5',
    role: 'Educational Space & Commercial Pop-Up Studio',
    organization: 'Academic Studio V · Interior Design',
    description:
      'Designing an early-learning community school arranged around a central courtyard, alongside an experimental two-level pop-up retail pavilion with a mezzanine steel-timber staircase.',
  },
  {
    index: '02',
    period: 'Semester 4',
    role: 'Retail Interior Design & Working Drawing Studio',
    organization: 'Academic Studio IV · Commercial Retail',
    description:
      'Developed the full retail interior for the ROYCE’ chocolate boutique applying the Japanese Kanso philosophy, and produced complete execution drawings for a residential villa.',
  },
  {
    index: '03',
    period: 'Semester 3',
    role: 'Furniture Design & Construction Materials',
    organization: 'Tectonics & Materiality Studio',
    description:
      'Custom timber daybed joinery drawings (1:10), ergonomic furniture studies, physical study models and hands-on material research across stone, timber, terrazzo and metal.',
  },
  {
    index: '04',
    period: 'Semester 1 — 2',
    role: 'Foundational Spatial Design & Vernacular Studies',
    organization: 'Design Foundation & History',
    description:
      'Foundational training in orthographic projection, drafting standards, anthropometry, Indian vernacular architecture and passive climate strategies.',
  },
];

const Eyebrow: React.FC<{ children: React.ReactNode; center?: boolean }> = ({ children, center }) => (
  <div className={`flex ${center ? 'justify-center' : ''} items-center gap-3 font-mono-code text-[11px] text-[#9A773E] uppercase tracking-[0.2em]`}>
    <span className="h-px w-8 bg-[#9A773E]" />
    <span>{children}</span>
  </div>
);

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate, onCursorChange }) => {
  const hover = {
    onMouseEnter: () => onCursorChange?.('link'),
    onMouseLeave: () => onCursorChange?.('default'),
  };

  return (
    <div id="about-page" className="relative min-h-screen bg-[#FFFFFF] text-[#141413] pt-28 md:pt-32 pb-28">
      {/* 1. Portrait & introduction */}
      <section data-reveal className="px-6 md:px-14 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16 items-start">
        <figure className="md:col-span-5 md:sticky md:top-28">
          <div className="relative overflow-hidden bg-[#ECEBE7] aspect-[4/5]">
            <img
              src="/about/mahi-patel-portrait.jpg"
              alt="Portrait of Mahi Patel, interior designer"
              className="absolute inset-0 h-full w-full object-cover object-[50%_62%]"
              loading="eager"
            />
          </div>
          <figcaption className="mt-4 flex items-center justify-between font-mono-code text-[11px] uppercase tracking-[0.18em] text-[#7A7770]">
            <span>Mahi Patel</span>
            <span>Interior Designer · Ahmedabad</span>
          </figcaption>
        </figure>

        <div className="md:col-span-7 md:pt-6">
          <Eyebrow>About</Eyebrow>
          <h1 className="mt-6 font-display font-light text-4xl sm:text-5xl md:text-6xl leading-[1.05] tracking-tight">
            Designing Spaces
            <br />
            <span className="italic text-[#9A773E]">with Purpose.</span>
          </h1>

          <div className="mt-10 space-y-6 font-sans text-base md:text-lg leading-relaxed text-[#55534D]">
            <p className="text-[#141413] text-lg md:text-xl leading-relaxed">
              I’m Mahi Patel, an aspiring interior designer passionate about concept-driven design, material
              exploration, and creating spaces that balance functionality with visual appeal.
            </p>
            <p>
              My approach combines creativity, thoughtful spatial planning, and a deep appreciation for materials,
              textures, and architectural details. From adaptive reuse and retail interiors to bespoke installations,
              I aim to transform ideas into meaningful spaces that tell a story.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6 border-t border-[#E5E3DD] pt-8">
            <div>
              <dt className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770]">Based in</dt>
              <dd className="mt-1.5 text-sm text-[#141413]">Ahmedabad, Gujarat</dd>
            </div>
            <div>
              <dt className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770]">Studying</dt>
              <dd className="mt-1.5 text-sm text-[#141413]">B. Interior Design, Indus University</dd>
            </div>
            <div>
              <dt className="font-mono-code text-[10px] uppercase tracking-[0.2em] text-[#7A7770]">Open to</dt>
              <dd className="mt-1.5 text-sm text-[#141413]">Internships & collaborations</dd>
            </div>
          </dl>

          <div className="mt-10 flex flex-wrap gap-4">
            <button
              onClick={() => onNavigate({ name: 'work' })}
              {...hover}
              className="group inline-flex items-center gap-3 bg-[#141413] px-6 py-3 text-sm text-white transition-colors hover:bg-[#9A773E]"
            >
              View Projects
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </button>
            <button
              onClick={() => onNavigate({ name: 'contact' })}
              {...hover}
              className="inline-flex items-center gap-3 border border-[#141413] px-6 py-3 text-sm text-[#141413] transition-colors hover:border-[#9A773E] hover:text-[#9A773E]"
            >
              Get in Touch
            </button>
          </div>
        </div>
      </section>

      {/* 2. Philosophy */}
      <section data-reveal className="mt-24 md:mt-32 bg-[#F8F8F6] border-y border-[#E5E3DD]">
        <div className="px-6 md:px-14 max-w-5xl mx-auto py-20 md:py-24 text-center">
          <Eyebrow center>Philosophy</Eyebrow>
          <blockquote className="mt-8 font-display font-light text-2xl sm:text-3xl md:text-4xl leading-snug text-[#141413]">
            “For me, great design is more than aesthetics — it’s about creating experiences that feel{' '}
            <span className="italic text-[#9A773E]">purposeful, harmonious, and inspiring.</span>”
          </blockquote>
        </div>
      </section>

      {/* 3. Design focus */}
      <section data-reveal className="px-6 md:px-14 max-w-6xl mx-auto mt-24 md:mt-28">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
          <div className="md:col-span-4">
            <Eyebrow>Design Focus</Eyebrow>
            <h2 className="mt-6 font-display font-light text-3xl md:text-4xl leading-tight">
              What I bring to every space.
            </h2>
          </div>
          <ol className="md:col-span-8 divide-y divide-[#E5E3DD] border-y border-[#E5E3DD]">
            {FOCUS.map((f, i) => (
              <li key={f.title} className="group grid grid-cols-[3rem_1fr] sm:grid-cols-[3rem_1fr_1.3fr] gap-x-6 gap-y-2 py-6">
                <span className="font-mono-code text-xs text-[#9A773E] pt-1.5">{String(i + 1).padStart(2, '0')}</span>
                <h3 className="font-display text-xl font-light text-[#141413] group-hover:text-[#9A773E] transition-colors">
                  {f.title}
                </h3>
                <p className="col-start-2 sm:col-start-3 text-sm leading-relaxed text-[#6E6C65]">{f.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4. Education & skills */}
      <section data-reveal className="px-6 md:px-14 max-w-6xl mx-auto mt-24 md:mt-28 grid grid-cols-1 md:grid-cols-12 gap-12">
        <div className="md:col-span-6">
          <Eyebrow>Education</Eyebrow>
          <ul className="mt-8 space-y-8">
            {EDUCATION.map((e) => (
              <li key={e.title} className="border-l border-[#E5E3DD] pl-6">
                <div className="font-mono-code text-[11px] uppercase tracking-[0.16em] text-[#9A773E]">{e.period}</div>
                <h3 className="mt-2 font-display text-xl font-light text-[#141413]">{e.title}</h3>
                <p className="mt-1 text-sm text-[#6E6C65]">{e.place}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-6 space-y-10">
          <div>
            <Eyebrow>Software</Eyebrow>
            <ul className="mt-6 flex flex-wrap gap-2.5">
              {SOFTWARE.map((s) => (
                <li key={s} className="border border-[#E5E3DD] bg-[#F8F8F6] px-4 py-2 text-sm text-[#141413]">
                  {s}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid grid-cols-2 gap-8">
            <div>
              <Eyebrow>Strengths</Eyebrow>
              <ul className="mt-6 space-y-2.5 text-sm text-[#141413]">
                {SOFT_SKILLS.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
            <div>
              <Eyebrow>Languages</Eyebrow>
              <ul className="mt-6 space-y-2.5 text-sm text-[#141413]">
                {LANGUAGES.map((s) => (
                  <li key={s}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Academic studios */}
      <section data-reveal className="px-6 md:px-14 max-w-6xl mx-auto mt-24 md:mt-28">
        <div className="flex items-end justify-between pb-6 border-b border-[#E5E3DD]">
          <div>
            <Eyebrow>Academic Studios</Eyebrow>
            <h2 className="mt-6 font-display font-light text-3xl md:text-4xl leading-tight">Studio journey</h2>
          </div>
          <span className="font-mono-code text-xs text-[#7A7770]">2023 — Present</span>
        </div>

        <div className="divide-y divide-[#E5E3DD]">
          {STUDIOS.map((item) => (
            <div key={item.index} className="py-9 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-start">
              <div className="md:col-span-2 font-mono-code text-xs text-[#9A773E] pt-1.5">
                {item.index} — {item.period}
              </div>
              <div className="md:col-span-4 space-y-1">
                <h3 className="font-display text-xl font-light text-[#141413]">{item.role}</h3>
                <div className="font-mono-code text-[11px] text-[#7A7770]">{item.organization}</div>
              </div>
              <p className="md:col-span-6 font-sans text-sm text-[#6E6C65] leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
