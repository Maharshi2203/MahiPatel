import React from 'react';
import { PageRoute } from '../types';
import { ArrowUpRight, Download } from 'lucide-react';

interface AboutPageProps {
  onNavigate: (route: PageRoute) => void;
  onCursorChange?: (state: 'default' | 'link' | 'drag-3d' | 'view' | 'copy') => void;
}

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
              src="/about/mahi-patel-cv-portrait.jpg"
              alt="Portrait of Mahi Patel, interior designer"
              className="absolute inset-0 h-full w-full object-cover object-[50%_25%]"
              loading="eager"
            />
          </div>
          <figcaption className="mt-4 flex items-center justify-between font-mono-code text-[11px] uppercase tracking-[0.18em] text-[#7A7770]">
            <span>Mahi Patel</span>
            <span>Interior Designer · Ahmedabad</span>
          </figcaption>

          <div className="mt-6 flex justify-center">
            <a
              href="/Mahi_Patel_CV.pdf"
              download="Mahi_Patel_CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              {...hover}
              className="group inline-flex items-center justify-center gap-3 px-8 py-3.5 rounded-full bg-[#191919] hover:bg-[#000000] text-white font-sans text-xs sm:text-sm font-bold tracking-wider uppercase shadow-[0_10px_25px_-4px_rgba(0,0,0,0.28)] hover:shadow-[0_14px_30px_-4px_rgba(0,0,0,0.38)] transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
            >
              <Download className="h-4 w-4 stroke-[2.5] transition-transform duration-300 group-hover:translate-y-0.5" />
              <span>DOWNLOAD CV</span>
            </a>
          </div>
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
    </div>
  );
};
