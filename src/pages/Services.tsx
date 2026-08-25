import { Link } from 'react-router-dom';
import { Page } from '../components/layout/Page';
import { Container } from '../components/layout/Container';
import { ROUTES } from '../routes';

interface ServiceArea {
  title: string;
  description: string;
}

const SERVICE_AREAS: ServiceArea[] = [
  {
    title: 'Development',
    description:
      'PHP, TypeScript, and full-stack web development. Complex backend systems, API design, ecommerce platforms, legacy modernisation, and performance optimisation.',
  },
  {
    title: 'Technical Leadership',
    description:
      'Fractional CTO services, architecture decisions, code review culture, hiring guidance, team standards, and technical roadmapping for growing teams.',
  },
  {
    title: 'Infrastructure & DevOps',
    description:
      'Linux server management, Ansible automation, Proxmox virtualisation, CI/CD pipelines, database administration, and deployment strategy.',
  },
  {
    title: 'Strategy & Training',
    description:
      'Technical audits, tech debt prioritisation, build-vs-buy decisions, team upskilling, and AI-enhanced development workflows with tools like Claude Code.',
  },
];

interface SpecificService {
  title: string;
  description: string;
  estimate: string;
}

// Indicative estimates at £950/day — every engagement gets a fixed scope and
// price agreed up front before any work starts.
const SPECIFIC_SERVICES: SpecificService[] = [
  {
    title: 'Move to Infrastructure as Code',
    description:
      'Take hand-managed servers to fully repeatable Ansible/Bash provisioning, so any environment can be rebuilt from scratch on demand. Proxmox and bare metal a speciality.',
    estimate: 'Typically 5–15 days depending on estate size',
  },
  {
    title: 'Automated Error Triage Pipeline',
    description:
      'Error logging wired into GitHub issues with AI-driven deduplication and first-pass triage. Incidents become actionable tickets in minutes, not days. I run this in production.',
    estimate: 'Typically 5–10 days to first triaged incident',
  },
  {
    title: 'AI Delivery Governance Rollout',
    description:
      'Get your team shipping agent-written code safely: containment, policy guardrails, and automated QA gates, built on my open source tooling and dog-fooded daily.',
    estimate: 'Typically 3–10 days, then optional retained support',
  },
  {
    title: 'Training & Support',
    description:
      'Hands-on upskilling for your team: AI-assisted development done properly, modern PHP, infrastructure and delivery practice. Follow-up support retained as needed.',
    estimate: 'From 1 day; retained blocks by arrangement',
  },
  {
    title: 'Strategic Guidance',
    description:
      'Fractional CTO input: technical roadmap, architecture decisions, build-vs-buy, hiring and team standards. Senior ownership without the full-time hire.',
    estimate: 'From 1–2 days/month retained',
  },
  {
    title: 'Third-Party API & Service Review',
    description:
      'Choosing payment providers, SaaS platforms or integration partners? Before you commit, I evaluate the candidates from an engineering point of view: API quality, reliability, lock-in, real integration cost.',
    estimate: 'Typically 1–3 days per shortlist',
  },
  {
    title: 'CI/CD & QA Pipeline Configuration',
    description:
      'Set up or tune your quality gates: automated QA pipelines that run identically locally and in CI, with no vendor lock-in. I publish and maintain open source QA tooling for PHP and TypeScript.',
    estimate: 'Typically 2–5 days',
  },
  {
    title: 'Performance Rescue',
    description:
      'Slow pages, creaking databases. Profiling and deep SQL optimisation with measurable before/after numbers. My first rescue took page loads from 10+ seconds to 1-2.',
    estimate: 'Typically 2–5 days to first measurable gains',
  },
  {
    title: 'Deployment Safety',
    description:
      'Tag-based blue/green deployment with instantaneous rollback and a sensible human gate. This is how my production estates deploy.',
    estimate: 'Typically 3–7 days',
  },
  {
    title: 'Security Hardening',
    description:
      'Cut production off from the public internet: VPN and tunnel-based access, client certificates, aggressive WAF rules. Dramatically shrink your attack surface.',
    estimate: 'Typically 3–10 days',
  },
  {
    title: 'Backup & Disaster Recovery',
    description:
      'Tested, automated, off-site backups and a recovery plan you have actually rehearsed, so a bad day stays a bad day rather than an extinction event.',
    estimate: 'Typically 2–5 days',
  },
];

const TECH_TAGS: string[] = [
  'PHP',
  'TypeScript',
  'MySQL',
  'Linux',
  'Ansible',
  'Docker',
  'Ecommerce',
  'REST APIs',
  'Claude Code',
  'AI Integration',
  'Proxmox',
  'Bash',
];

export function Services() {
  return (
    <Page
      title="Services - Joseph Edmonds | LTS Commerce"
      description="What I do and what it costs: development, fractional CTO work, infrastructure, AI delivery governance. £150/hr or £950/day, fixed scope agreed up front."
    >
      <div className="py-10">
        <Container>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-3">Services</h1>
            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              What I do, what it costs, and roughly how long it takes. Everything here is work I
              actually do, priced at £150/hr (2 hour minimum) or £950/day. Every engagement gets a
              fixed scope and price agreed up front before any work starts.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            {SERVICE_AREAS.map(service => (
              <div
                key={service.title}
                className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200"
              >
                <h2 className="text-base font-bold mb-1">{service.title}</h2>
                <p className="text-gray-700 text-sm leading-snug">{service.description}</p>
              </div>
            ))}
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-center mb-5">Specific Ways I Can Help</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {SPECIFIC_SERVICES.map(service => (
                <div
                  key={service.title}
                  className="bg-white px-4 py-3 rounded-lg border border-gray-200"
                >
                  <h3 className="text-base font-bold mb-1">{service.title}</h3>
                  <p className="text-gray-700 text-sm leading-snug mb-2">{service.description}</p>
                  <p className="text-xs font-medium text-[#0f4c81]">{service.estimate}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-10">
            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <h2 className="text-base font-bold mb-2">How I Work</h2>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Rate</span>
                  <span>
                    £150/hr GBP, 2 hour minimum, or £950/day. Negotiable for longer engagements.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Location</span>
                  <span>
                    Remote only, UK timezone. Flexible on hours for international clients.
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Engagement</span>
                  <span>Flexible. One-off audits to long-term embedded development.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Response</span>
                  <span>Within 24 hours on business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#0f4c81] font-bold shrink-0">Capacity</span>
                  <span>
                    For ongoing work: an agreed monthly minimum and maximum, billed hourly. Capacity
                    is reserved, you only pay for what's used. Get in touch for specifics.
                  </span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
              <h2 className="text-base font-bold mb-2">Why Hire Me</h2>
              <ul className="space-y-1.5 text-sm text-gray-700">
                <li>25 years hands-on experience across PHP, TypeScript, Linux, and databases.</li>
                <li>Published author of "The Art of Modern PHP 8". Zend Certified Engineer.</li>
                <li>
                  Proven track record with large-scale, high-pressure systems and legacy codebases.
                </li>
                <li>
                  Comfortable at the keyboard and the whiteboard. I can write the code or lead the
                  team.
                </li>
                <li>
                  I build the guardrail tooling for AI-assisted delivery. Not just an AI adopter:
                  I'm the person who wrote the containment and QA-gate tooling other teams install.
                </li>
              </ul>
            </div>
          </div>

          <div className="mb-10">
            <h2 className="text-2xl font-bold mb-4 text-center">Fixed-Scope Engagements</h2>
            <p className="text-center text-gray-600 text-sm max-w-2xl mx-auto mb-6">
              A fixed-price alternative to open-ended hourly work, for when you want a defined
              deliverable instead of an open-ended clock.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <h3 className="text-base font-bold mb-1">Technology &amp; Infrastructure Review</h3>
                <p className="text-gray-700 text-sm leading-snug mb-2">
                  A structured 5-day audit of your codebase, infrastructure, and delivery pipeline.
                  Fixed scope, fixed price, a written report with prioritised findings. Not an
                  open-ended hourly engagement.
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Fixed price, get in touch for a quote
                </p>
              </div>
              <div className="bg-gray-50 px-4 py-3 rounded-lg border border-gray-200">
                <h3 className="text-base font-bold mb-1">Agentic Delivery Readiness Assessment</h3>
                <p className="text-gray-700 text-sm leading-snug mb-2">
                  Same format, one tier up: how ready is your team's AI-assisted delivery pipeline
                  for production intensity, where the guardrails are missing and what breaks first.
                </p>
                <p className="text-xs text-gray-500 font-medium">
                  Fixed price, get in touch for a quote
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {TECH_TAGS.map(tag => (
              <span
                key={tag}
                className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="text-center">
            <Link
              to={ROUTES.contact.path}
              className="inline-block px-8 py-3 bg-[#0f4c81] hover:bg-[#1e6ba5] text-white font-medium transition-colors rounded-md"
            >
              Hire Me
            </Link>
          </div>
        </Container>
      </div>
    </Page>
  );
}
