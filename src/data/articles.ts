/**
 * Article Data - AUTO-MIGRATED FROM LEGACY EJS TEMPLATES
 */

import type { Article } from '@/types/article';
import { CATEGORIES } from './categories';

export const SAMPLE_ARTICLES: readonly Article[] = [
  {
    id: 'the-ouroboros-problem',
    title: 'The Ouroboros Problem',
    description:
      "A failure pattern I keep seeing in agentic coding workflows: an agent invents a rule whilst explaining its own reasoning, a later session reads that rule as a human requirement, and both defend and extend it from there. I don't have a fix for it yet.",
    date: '2026-09-02',
    category: CATEGORIES.ai.id,
    heroImage: {
      src: '/images/the-ouroboros-problem/hero.webp',
      alt: 'A close-up, desaturated photograph of a tightly coiled snake',
      ogImage: '/images/the-ouroboros-problem/og.jpg',
      creditText: 'Image: NPS, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:A_close_up_of_a_coiled_up_Corn_snake_on_the_grass._(00f0e1dc-b4b7-4ab6-b124-bcddd284a68e).jpg',
    },
    readingTime: 11,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'LLMDevs',
    register: 'formal',
    content: `<div class="intro">
    <p class="lead">I have started calling this the Ouroboros problem, after the old symbol of a serpent eating its own tail. An AI coding agent invents a claim whilst it is explaining itself: a rule, a constraint, a "this is how the project does things" aside dropped into a plan file or a comment. Nobody asked for it and nobody said it. Later, the same agent or a different one reads that file back, treats the claim as a human-issued requirement, and starts defending it, extending it, building further rules on top of it. The output has become the input. I don't have a clean fix for this yet, and I'm increasingly convinced there might not be one.</p>
</div>

<section>
    <h2>What I Mean by It</h2>

    <p>The pattern has a fixed shape.</p>

    <p>First, an agent generates a claim inside an artefact it controls: a <code>PLAN.md</code>, a <code>CLAUDE.md</code>-style configuration file, a code comment, a commit message, a section of documentation. The claim was never said by a person. It usually surfaces as a side effect of the agent explaining or justifying a decision it made unilaterally, phrased in the same register as a genuine, human-set requirement: "per project convention", "this codebase always does X", "the established pattern is Y".</p>

    <p>Second, that artefact persists past the moment it was written, which is the entire point of writing plans and configuration files down. A later session, sometimes the same conversation after a compaction, sometimes a fresh one entirely, reads the file back in.</p>

    <p>Third, the later session has no way to tell the difference between a line a human typed and a line the agent generated whilst narrating its own reasoning. Both are just text in a file that the agent has been told to treat as authoritative project context. So the hallucinated line gets promoted: from "something I said whilst thinking out loud" to "a constraint imposed by the person I work for".</p>

    <p>Fourth, because the constraint now appears to have human provenance, it is treated as rigid: something to work around and accommodate rather than to debate or question. And because agents are often good at extrapolating, they elaborate: a fabricated rule about one thing becomes the justification for a second fabricated rule about something adjacent, which becomes the basis for a third. Nobody ever said any of it, and all of it gets defended as if someone did.</p>

    <p>Fifth, this compounds. Left unchecked over enough sessions, a project can accumulate a genuinely elaborate maze of restrictions, none of which trace back to a human decision, all of which are enforced with total confidence because each one looks exactly like every other line in the same file, including the ones a human actually wrote.</p>

    <p>The name felt right for a specific reason. Plenty of feedback loops turn output into input, but this one is self-sustaining and self-consuming at once, each pass producing the material the next pass will treat as ground truth, and nothing outside the loop is ever consulted to check whether any of it was true to begin with.</p>
</section>

<section>
    <h2>How a Hallucinated Rule Is Born</h2>

    <p>The mechanics are mundane, which is part of what makes this hard to catch. Nobody sits down and decides to invent project policy. It happens as a by-product of an agent doing something else: writing up a design decision it just made, and explaining why, in a plan file meant to survive past the current session.</p>

    <p>Take a repository class with a lookup method. The agent, mid-implementation, decides that a missing record should come back as <code>null</code> rather than raise an exception, a reasonable and fairly ordinary API design choice made in the moment, for this one method, on this one class. Writing up that decision for the plan file, it reaches for language that makes the choice sound settled rather than provisional, because settled-sounding language is what most of the surrounding document already looks like.</p>

    <pre><code class="language-markdown">{{SNIPPET:the-ouroboros-problem/session-one-plan-fragment.md}}</code></pre>

    <p>Read that fragment cold and there is no way to tell, from the text alone, that the second paragraph is not a policy a human handed down. "Per project convention" and "MUST" are exactly the words a real, deliberately imposed constraint would use. The only thing distinguishing it from a genuine rule is that nobody said it, and that fact is not recorded anywhere in the file.</p>
</section>

<section>
    <h2>The Second Session Inherits It as Gospel</h2>

    <p>The plan file's whole purpose is to let a later session pick up where an earlier one left off without re-deriving everything from scratch. That is a good property, and it is exactly what turns one fabricated line into a maze.</p>

    <p>A session working on a different part of the codebase weeks later reads the plan file as its primary source of truth for "what has already been decided here". It finds the repository return-semantics rule, takes the "per project convention" framing at face value because that is the only framing available, and treats it as a binding constraint whilst writing a coding-standards section of its own. Then it reasons forward from that constraint, the way a careful engineer would from a real one, and produces two more rules that were never asked for either.</p>

    <pre><code class="language-markdown">{{SNIPPET:the-ouroboros-problem/session-two-elaboration.md}}</code></pre>

    <p>Nothing about that second document reads as fabricated, and every line has an internally consistent rationale. The null-check requirement follows sensibly from the return-semantics rule; the <code>Result::empty()</code> wrapper follows sensibly from the null-check requirement. Each step is a reasonable inference from the step before it. The only thing wrong is the foundation, and by this point the foundation is two derivations away from visible.</p>

    <p>A third session, arriving later still, has even less chance of noticing. It sees a coding-standards document with three rules, phrased consistently, referencing each other, sitting in the same file as decisions a human genuinely made. There is no seam to find.</p>
</section>

<section>
    <h2>Why This Is Structural, Not a Fluke</h2>

    <p>It would be more comfortable if this were a bug that better prompting could close. I don't think it is, for a few reasons that look structural rather than incidental.</p>

    <p>A markdown file carries no provenance metadata. A line reading "repositories MUST return null" looks identical whether a person typed it after a design conversation or an agent typed it whilst narrating its own decision. Bold text, imperative verbs, and confident framing are the only signals available, and an agent under instructions to explain its reasoning clearly will naturally produce confident, imperative-sounding prose, because that is what clear writing looks like. The same stylistic habits that make an agent's plan files readable are what make a fabricated rule indistinguishable from a real one.</p>

    <p>Agents are also, correctly, trained and instructed to treat established project context as binding rather than up for relitigation on every session. That instinct exists for a good reason: nobody wants an agent re-arguing settled architectural decisions from first principles every time it opens a file. But the same instinct that stops an agent second-guessing a real human decision is exactly what stops it second-guessing a fabricated one. There is no separate switch for "binding because a human said so" versus "binding because it appeared in a file I am told to trust".</p>

    <p>And past context, to the model doing the reading, is not meaningfully different in kind from the world it is instructed to accommodate. Its own earlier output, once it is sitting in a file rather than in the visible turn where it was generated, is just more text describing the state of the project. There is nothing in that text that flags "I made this up whilst reasoning about something else, please verify before treating it as a constraint". Even a well-intentioned agent has no hook to hang that scepticism on.</p>

    <p>Once a fabricated rule exists, there is also a quieter incentive to defend rather than question it: an agent that has just been told "follow the project's established conventions" and then finds a line that reads exactly like an established convention has been given every reason to comply and none to doubt. Doubting it looks, from the inside of that instruction, like insubordination rather than diligence.</p>
</section>

<section>
    <h2>What Makes It Hard to Catch</h2>

    <p>A fabricated rule rarely looks fabricated. It sits in the same file as genuine constraints, in the same voice, often with a rationale attached that is locally sound even when its premise is invented. It tends to arrive as a small aside inside a much longer, otherwise-accurate document, the kind of file a human reviewer skims for the parts that look surprising rather than reads line by line for provenance.</p>

    <p>The compounding makes it worse over time, not better. Catching the first fabricated line, before anything is built on top of it, is comparatively tractable: a human reviewing a fresh plan file can ask "wait, did I actually say that?" about a rule that appeared in the same edit as the reasoning that produced it. Catching the third-generation elaboration, several sessions and several files later, means noticing that a rule with a perfectly sound internal justification has no external one at all, which is a much subtler thing to look for, and easy to miss precisely because nothing about the rule itself looks wrong.</p>
</section>

<section>
    <h2>An Open Problem</h2>

    <p>I don't have a tidy ending for this one. The honest version is that I watch for it now, in my own plan files and configuration documents, the way I'd watch for any other class of bug I know exists but can't reliably detect by inspection alone: with more suspicion of anything phrased as settled that I cannot personally remember settling.</p>

    <p>There's a discomforting symmetry to writing this up at all. This article lives in prose, and prose is exactly the kind of artefact a future session could read back and treat as more authoritative than it has earned. I don't think that makes the exercise pointless. But it does mean the honest way to hold this piece is the same way I would want a plan file held: as one person's current thinking, worth checking against, not as settled ground truth just because it is written down with conviction.</p>
</section>
`,
  },
  {
    id: 'host-action-bridge',
    title: 'The Host-Action Bridge: Letting a Sandboxed Agent Control Containers It Cannot Reach',
    description:
      'How a file-based request spool, a host-side systemd watcher, and a closed verb allowlist let a runtime-less AI coding agent container trigger orchestration actions on its host, without a container socket, SSH access, or ad-hoc firewall holes.',
    date: '2026-08-27',
    category: CATEGORIES.infrastructure.id,
    readingTime: 14,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'devops',
    register: 'formal',
    heroImage: {
      src: '/images/host-action-bridge/hero.webp',
      alt: 'A black-and-white photograph of the Golden Gate Bridge steel truss structure and girders, viewed from below',
      ogImage: '/images/host-action-bridge/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Golden_Gate_Bridge_trusses,_HAER_CA-31-14.jpg',
    },
    content: `<div class="intro">
    <p class="lead">An AI coding agent running inside a container with no container runtime at all is a genuinely good security default. It cannot reach the host's container engine and cannot escalate through the one mechanism that would hand it the keys to everything. The trouble starts the moment the agent is asked to do the work a developer does every day against a real, multi-container application: restart a service, rebuild an image, check whether the stack is up. Every one of those is normally a command against the container engine, exactly what the sandbox forbids. Something has to close that gap without reopening the one it was built to close.</p>
</div>

<section>
    <h2>The Problem: A Sandbox That Still Needs to Turn Things On</h2>

    <p>Stripping the container runtime binary out of an agent image is a small change with an outsized effect. No <code>podman</code>, no <code>docker</code>, no socket: the agent has no path to the host's container engine, and an entire class of escalation closes with it.</p>

    <p>That default holds until the agent does real work against a project such as <code>~/Projects/demo-app</code>, backed by a web tier, an API tier, a database, and background workers, each a separate container on the host. It edits a file in the API service and needs to restart <code>demoapp_api</code>. It bumps a dependency and needs an image rebuilt. None of that is optional friction; it is what agentic development against a containerised application looks like.</p>

    <p>The reflex fix, mounting the engine socket back in, undoes the whole premise. A socket is not a scoped permission with a notion of "only restart this one service"; it is the entire engine, equivalent to root on the host, from which an attacker can start a new container with the host filesystem bind-mounted in and run as root inside it. Every precaution taken building the sandbox becomes irrelevant the instant that mount exists. What is needed instead is a channel that grants exactly the handful of actions agentic development requires, and nothing else.</p>
</section>

<section>
    <h2>The Bridge: Components and Lifecycle</h2>

    <p>A host-action bridge is a small, asynchronous, file-based channel that lets the agent request one of a fixed set of orchestration actions, and a separate, trusted process on the host that decides whether to honour it. The agent never runs a command against the container engine; it writes a file describing what it wants, then waits.</p>

    <figure class="my-8">
        <img src="/images/host-action-bridge/architecture.svg" alt="Architecture diagram: the agent container's request writer writes a request into the shared bind mount's spool; a host-side .path unit fires a .service unit; the watcher script validates the request and runs ./stack.bash against the application containers; the response flows back through the spool to the agent" />
        <figcaption>The agent only ever writes a request and polls for a response. Everything privileged, validation, policy, execution, happens on the host side of the shared spool.</figcaption>
    </figure>

    <p>Both sides already share one channel that needs no new plumbing: the bind-mounted repository checkout. Inside it sits a spool directory, <code>untracked/demo-bridge/</code>, with fixed subdirectories: <code>tmp/</code> for atomic writes, <code>requests/</code> for incoming requests, <code>processing/</code> for whatever the watcher has claimed, <code>responses/</code> for outcomes the agent polls, <code>archive/</code> for completed requests and logs, <code>quarantine/</code> for input too malformed to classify, and <code>diagnostics/</code>, a mirror the agent can read directly.</p>

    <p>The <code>.path</code> unit watches <code>requests/</code> and triggers the paired <code>.service</code> unit the instant a file appears; checking both file-modification events and a glob at start-up means a request queued whilst the watcher was down still gets picked up. The <code>.service</code> unit is <code>Type=oneshot</code>: it drains whatever is waiting, once, and exits, so there is no long-running daemon. The watcher script lives outside the bind mount, on a host-only path the agent container cannot write to.</p>

    <pre><code class="language-bash">{{SNIPPET:host-action-bridge/demo-bridge-path-unit.bash}}</code></pre>

    <pre><code class="language-bash">{{SNIPPET:host-action-bridge/demo-bridge-service-unit.bash}}</code></pre>

    <p>On the agent side, the request writer does exactly two things, write a file, and poll for a response, with no dependency on the container engine anywhere in it.</p>

    <pre><code class="language-bash">{{SNIPPET:host-action-bridge/request-writer.bash}}</code></pre>

    <p>Every request leaves <code>requests/</code> on every code path, accepted, denied, expired, or too malformed to read, which stops a bad file wedging the pipeline: the <code>.path</code> unit re-triggers on anything left sitting there, crash-looping the service if the watcher ever failed to clear it. A subtler reason the watcher acknowledges a request before validating it: it writes a <code>queued</code> response the instant it starts draining, because more than one invocation can start at once and only one holds the single-flight lock. Without that acknowledgement, the losing invocation would leave the request unacknowledged, and the agent's poll loop would time out even though the winner was moments from handling it.</p>

    <p>The channel is deliberately asynchronous rather than a fast RPC, acceptable because the verbs on offer are "rebuild an image", not high-frequency calls, and it keeps working even when the whole stack is down.</p>
</section>

<section>
    <h2>The Trust Model, in Full</h2>

    <p>Everything from here traces back to one invariant: the agent container never gains the ability to run an arbitrary command on the host. Every gate below closes a specific way of violating that invariant.</p>

    <h3>A closed verb allowlist with a fixed argv</h3>

    <p>The single most important property in the design. A request carries a <code>verb</code>, a short enumerated string, and for a handful of verbs an <code>arg</code>, also enumerated, never a command line or free text. The watcher's dispatcher is a <code>case</code> statement: each verb maps to exactly one hardcoded argv shape, fixed when the watcher was written.</p>

    <pre><code class="language-bash">{{SNIPPET:host-action-bridge/verb-allowlist.bash}}</code></pre>

    <p>Nothing interpolates request content into a shell string; there is no <code>eval</code>, no <code>sh -c</code> fed by user input. <code>arg</code> passes validation before it reaches this table and arrives as a single argv element, never concatenated into something a shell parses. That is what makes "closed allowlist" a real security property: the complete set of commands the bridge can ever run is enumerable by reading one function.</p>

    <h3>Read-only versus mutating, arg enumeration, and a narrower "buildable" set</h3>

    <p>Verbs split into read-only (<code>status</code>, <code>health</code>, <code>logs</code>, <code>ping</code>) and mutating (<code>up</code>, <code>down</code>, <code>restart</code>, <code>rebuild</code>, <code>init</code>). Rate limiting exempts read-only verbs, and the integrity gate below only runs ahead of mutating ones.</p>

    <p><code>restart</code>, <code>rebuild</code>, and <code>logs</code> take a required argument naming a service, checked twice: a regex rejecting shell metacharacters and whitespace, then an enumerated list of real service names taken from the project's orchestration definition at install time. An argument passing the regex but naming no real service is still denied. <code>rebuild</code> checks against a narrower "buildable" enum: a test-runner sidecar can be excluded entirely, so it can never be bridge-targeted at all.</p>

    <pre><code class="language-bash">{{SNIPPET:host-action-bridge/validate-request.bash}}</code></pre>

    <p>Order matters too: the hardcoded deny list is checked before the allowlist, so a raw shell-into-container action sits in a list no config file can override, checked unconditionally, in code, before policy gets any say.</p>

    <h3>Per-verb policy: auto or deny, deliberately nothing in between</h3>

    <p>A policy file, seeded once at install and never silently overwritten on reinstall, maps each verb to <code>auto</code>, executed once every other gate passes, or <code>deny</code>, always refused with a reason logged. A verb missing from the file, or carrying an unrecognised mode, fails closed to deny.</p>

    <pre><code class="language-bash">{{SNIPPET:host-action-bridge/policy-conf.bash}}</code></pre>

    <p>Conspicuously absent is a third mode, "ask a human to confirm." That absence is deliberate: a bridge pausing mid-flight for confirmation needs a process listening for it, reintroducing the standing, addressable channel the design exists to avoid. A project wanting a human gate on some verb should set it to <code>deny</code> and run the command by hand instead, a real gate enforced by the absence of any automated path.</p>

    <h3>Rate limiting as a deliberate feature, not friction</h3>

    <p>A sliding-window counter caps how often mutating verbs can run, independent of policy, exempting read-only verbs. It bounds the blast radius of a runaway loop: a bug hammering <code>rebuild</code> degrades to "denied, rate limited" instead of repeatedly rebuilding images. The first time it engages, mid-session during heavy debugging, resist the instinct to raise or remove it: hitting the limit occasionally is the cost that buys the protection, and the correct response is to wait it out.</p>

    <h3>Atomic publish and symlink-safe moves</h3>

    <p>Every request filename embeds a timestamp and a random nonce, so filenames never collide or replay. Every write into the spool follows the same pattern: write to a temporary file on the same filesystem, then move it into place. That move is atomic and, critically, replaces whatever sits at the destination rather than following it, so a planted symlink cannot write through to an arbitrary target.</p>

    <pre><code class="language-bash">{{SNIPPET:host-action-bridge/atomic-publish.bash}}</code></pre>

    <p>The watcher goes further: for the whole duration of a drain it holds one directory file descriptor open per spool subdirectory, verified as a real directory rooted under the spool rather than a swapped-in symlink, and performs every open, move, and prune through that pinned descriptor, closing the window between checking a path and acting on it.</p>

    <h3>Quarantine, not silence, for malformed input</h3>

    <p>A file in <code>requests/</code> that fails to parse as JSON, carries a filename outside the expected schema, or is not a plain regular file, a symlink or FIFO planted where a request should be, moves to <code>quarantine/</code> rather than being left, deleted, or processed. Leaving it would crash-loop the <code>.path</code> unit; deleting it silently would erase evidence of an attack or a writer bug. Quarantine preserves the artefact whilst keeping requests always leaving the inbox.</p>

    <h3>The audit log: off the mount it audits</h3>

    <p>Every outcome, accepted, denied and why, expired, succeeded, failed with what exit code, is appended to an audit log under the host's own state directory, off the shared mount, because a compromised agent container could otherwise tamper with its own history. A best-effort mirror lands in <code>diagnostics/</code> for the agent, but that copy is diagnostic-only, never authoritative.</p>

    <h3>An integrity gate on the trusted computing base itself</h3>

    <p>Before any mutating verb, the watcher closes an obvious bypass: what if the agent edited the files that define orchestration, then triggered a verb acting on the edited version? Tracked files, the orchestration script, the compose definition, the reverse-proxy configuration, are checked against <code>HEAD</code> with git status; any local modification refuses mutating verbs until committed or reverted. A SHA-256 of the untracked <code>.env</code> file, computed once at install and baked into the watcher copy, catches the gap a git check alone would miss: if <code>.env</code> changes, mutating verbs are refused until a human re-runs the installer. Both checks are honestly scoped, catching "edit the config, trigger a rebuild that does something else", not every transitively-touched file.</p>

    <h3>Transient scopes and the inherited file descriptor problem</h3>

    <p>A <code>Type=oneshot</code> service starts, does its work, and exits, and by default its whole cgroup is torn down with it. Several bridged verbs deliberately leave long-running containers behind. Wired up naively, either the containers get killed the instant the oneshot exits, or they linger inside its cgroup, which never settles back to idle, stopping the watcher being re-triggered. The fix launches those verbs inside a transient systemd scope via <code>systemd-run --user --scope</code>, placing spawned containers in a sibling unit that outlives the drain, whilst the drain's own cgroup still empties out cleanly. One wrinkle costs an afternoon if missed: a file descriptor the drain holds open, a lock, a pinned spool descriptor, is inherited by the scoped child unless explicitly closed, so the lock it represents stays held open for as long as that long-running child survives, long after the drain itself has exited. The fix is unglamorous: close every non-essential descriptor first.</p>

    <h3>What the bridge deliberately cannot do</h3>

    <p>No verb, argument, or combination reaches an <code>eval</code>, a shell fed by request content, or any string-built command; the executed surface is exactly the fixed argv table. The watcher runs as the same unprivileged host user under a systemd <code>--user</code> session, never root, no <code>sudo</code> anywhere. Every variable parameter is validated against a closed enumeration and passed as a discrete argv element. There is no socket, no SSH key, no open port: just a filesystem path both sides already had access to.</p>
</section>

<section>
    <h2>Why the Obvious Shortcuts Lose</h2>

    <p>Four alternatives get reached for before a bridge like this, roughly in order of how tempting each looks and how badly each one costs.</p>

    <p>Mounting the container engine's socket into the agent container is the most tempting and the worst. It grants an attacker who compromises the agent everything, root on the host, not root inside a container: from the socket, a new container can be started with the host filesystem bind-mounted in and run as root. Every precaution taken building the sandbox becomes irrelevant the moment this mount exists.</p>

    <p>SSH back to the host trades a socket for a credential, which is not an improvement. A private key authenticating as a real host user now lives inside the sandbox, so compromising the container means compromising something trusted everywhere. It also hands back a full interactive shell, since SSH does not constrain which commands can run unless forced commands and restricted shells are bolted on afterwards, in effect a worse-designed version of the bridge being avoided.</p>

    <p>Running the agent privileged is giving up on the premise entirely. A privileged container can escape to the host through several well-known techniques, and once that door is open, "can the agent damage the host" becomes a question of how much every dependency it might pull in can be trusted.</p>

    <p>Opening host firewall ports for a small control API looks the most principled, architecturally closest to the bridge, but stands on a worse foundation. A listening service has to defend against being reached by more than the one container it was meant for, needs its own authentication and TLS story built from nothing, and tends to accumulate as untracked drift, unlike a channel authenticated by its placement inside a bind mount only one container can see.</p>

    <p>The bridge's cost is real: multi-second latency rather than an instant call, and a small, fixed set of things the agent can ask for. For orchestration verbs, that trade favours the bridge, because none of those actions benefit from being instant, and all benefit from being closed, validated, and audited.</p>
</section>

<section>
    <h2>Lessons That Generalise Beyond This One Bridge</h2>

    <p>A handful of failures only became obvious after watching a bridge like this run for some time.</p>

    <p>Namespace every host-global artefact by project from day one, not just the in-repo spool. A first bridge built for one project tends to get simple, global-sounding names for its systemd units, config directory, and installed binary, which works until a second, unrelated project installs its own copy on the same host. Installers of this kind are meant to be idempotent and self-healing, so the second install does not fail; it silently overwrites the first project's live bridge, and one project's agent starts issuing requests validated against another project's service list. Nothing crashes; it quietly does the wrong thing. Carry a project slug in every unit name, config path, and binary name outside the project's own checkout.</p>

    <pre><code class="language-bash">{{SNIPPET:host-action-bridge/project-namespacing.bash}}</code></pre>

    <p>Resolve aliased binaries at install time, never at call time. A tool used daily from an interactive shell is often a shell alias, invisible to anything that is not that shell. A systemd <code>--user</code> unit's <code>PATH</code> comes from its own environment, not from sourcing rc files, so resolving such a tool at call time fails even though the same name works at a prompt. Resolve it once, at install, and bake the absolute path into the generated configuration.</p>

    <p>Make remediation output copy-pasteable, with no log prefix glued onto it: a prefixed warning cannot be pasted straight into a terminal, and stripping the prefix by hand turns a five-second fix into "later."</p>

    <p>"The agent cannot reach the app" is usually a networking-join problem, not a firewall problem: health checks time out even though the same address works from the host. Opening a firewall port fixes it but is the wrong default, untracked drift nobody remembers to close. The better default is one more bridged verb that joins the agent container to the application's own network, <code>demo-app-network</code>, so the agent reaches services by name with no host port ever opened.</p>

    <p>Restrictive file permissions written by one process can break a completely different one. A worker on the shared checkout can write new files owner-only where the project is group- and world-readable, which surfaces elsewhere: a container running as a different user gets a permission denial that can look like almost anything except a permissions problem.</p>

    <p>Rate limits biting during interactive debugging are the system working, not a bug. Wait out the window, the way a careful operator would pace manual restarts.</p>
</section>

<section>
    <h2>The General Shape</h2>

    <p>None of this is specific to AI coding agents, to any one container engine, or to systemd. Whenever a sandboxed process legitimately needs to trigger a privileged action on a system it cannot otherwise reach, the same shape holds: a closed, code-level set of pre-approved actions rather than a generic execution channel; validation and policy that treat different actions as genuinely different risks; and a durable, tamper-resistant record of what happened rather than trusting the sandboxed side's own account. Loosening the sandbox is always the cheaper-looking option, one mount or one credential away. A purpose-built channel costs more to build once, and it is the only one of the two that still shows, with certainty, exactly what ran and why, on the day it turns out to matter.</p>
</section>
`,
  },
  {
    id: 'component-driven-design-react-typescript-storybook',
    title: 'Component-Driven Design with React, TypeScript, and Storybook',
    description:
      'How building UIs as a hierarchy of typed, isolated components, with styling controlled entirely through declared props, produces design systems that stay coherent, testable, and maintainable as they grow.',
    date: '2026-05-29',
    category: CATEGORIES.typescript.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'reactjs',
    register: 'formal',
    heroImage: {
      src: '/images/component-driven-design-react-typescript-storybook/hero.webp',
      alt: 'A black-and-white photograph of two interlocking cast-iron gears against a stone wall',
      ogImage: '/images/component-driven-design-react-typescript-storybook/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:DETAIL_OF_GEARS_-_Creque_Marine_Railway,_Charlotte_Amalie,_St._Thomas,_VI_HAER_VI,3-HASI,1-6.tif',
    },
    content: `<div class="intro">
    <p class="lead">Every frontend codebase eventually accumulates a graveyard of slightly-different buttons. One is blue, one is navy, one has a drop shadow that nobody can explain, and three of them have <code>margin-top: 3px</code> applied directly in the page file because the designer asked for "just a small tweak" six months ago. Component-driven design is the discipline that stops the graveyard from forming. Pair <a href="https://react.dev/" target="_blank" rel="noopener">React</a> with <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a> and you can enforce that discipline mechanically. It stops being a convention people remember to follow and becomes a rule the build refuses to break.</p>
</div>

<section>
    <h2>The Component Mindset</h2>

    <p>The core idea is older than React. Back in the mid-2000s, the industry built pages: large HTML documents with styles and behaviour bolted on. Everything on such a page is a special case by default. Your hero banner differs subtly from every other hero banner. Navigation on the product page carries one extra link the blog page lacks. Consistency, if you get it at all, comes from human discipline and shared CSS files that grow without bound.</p>

    <p>Component-driven design inverts the model. You design the pieces first and compose pages from them, rather than designing pages and then trying to extract shared parts afterwards. A button is a button everywhere. A card is a card everywhere. A page header is a component with declared properties, and the page itself is a component that assembles other components.</p>

    <p>React took this model mainstream for the web in 2013. Layer TypeScript on top and the informal "we agreed buttons should look like this" hardens into a compile-time contract. The sections below explain why that contract matters and how to structure it so it actually holds.</p>
</section>

<section>
    <h2>TypeScript Props as a Design Contract</h2>

    <p>A React component's props interface is a machine-readable specification of everything the component can do. Define a <code>Button</code> in TypeScript and the interface lists every dimension of variation the button supports, and nothing else.</p>

    <p>Here is a typed button that accepts a <code>variant</code> and a <code>size</code>:</p>

    <pre><code class="language-typescript">{{SNIPPET:component-driven-design-react-typescript-storybook/button-component.tsx}}</code></pre>

    <p>The compiler now enforces your design system. Pass <code>variant="danger"</code> and the build fails, because "danger" is not a declared variant. Pass a number to <code>size</code> and the build fails too. This contract is not a guideline buried in a Notion document that new developers might never read. It is a gate the build will not pass without satisfying.</p>

    <p>That changes where design inconsistencies surface. They used to slip through to a design review, or worse, to production. Now they get caught the moment a developer saves the file. The TypeScript interface <em>is</em> the design spec, written in a language both the build tool and the developer can reason about precisely.</p>
</section>

<section>
    <h2>DRY: One Component, Infinite Reuse</h2>

    <p>People usually discuss "Don't Repeat Yourself" in the context of logic. Find yourself copy-pasting a function, extract it. The same principle applies with equal force to UI. If you are copy-pasting a button, that button is screaming to become a component.</p>

    <p>The payoff matches the function case exactly: change the button once and every instance updates, fix an accessibility issue in the component and it is fixed everywhere, update the hover colour for a rebrand and a single file changes. The alternative is twenty copies of the button spread across twenty page files, which means twenty manual edits, twenty chances to miss one, and twenty variations drifting apart over time.</p>

    <p>A quieter benefit follows from this. When a piece of UI lives in only one place, decisions about it happen in only one place. Designers and developers have one thing to discuss, not twenty. "The button should have more padding" becomes a one-line change to a single component, not a refactoring sprint.</p>
</section>

<section>
    <h2>Styling by Flags: The Rule That Keeps Everything Sane</h2>

    <p>One rule separates a component library that stays coherent from one that slowly dissolves into chaos: <strong>components accept styling flags, never raw CSS</strong>.</p>

    <p>Here is what the anti-pattern looks like:</p>

    <pre><code class="language-typescript">{{SNIPPET:component-driven-design-react-typescript-storybook/button-bad-example.tsx}}</code></pre>

    <p>Those <code>className</code> and <code>style</code> props look like flexibility. They are the exact mechanism by which design systems fall apart. The moment a consumer can pass arbitrary CSS, the component stops being the single source of truth for how a button looks. Every caller turns into a one-off override. Within months you have as many button variations as you have call sites, and none of them are documented, tested, or consistent.</p>

    <p>Accept <code>variant</code> and <code>size</code> instead and the set of valid visual states becomes finite and declared. Three variants, three sizes, one disabled flag gives you eighteen combinations. Every one of them is enumerable, nameable, testable, and visible in <a href="https://storybook.js.org/" target="_blank" rel="noopener">Storybook</a>. None of them hide in page-level CSS that only the developer who wrote it understands.</p>

    <h3>What to do when the design genuinely needs something new</h3>

    <p>The right response to "we need a red destructive button" is not to pass <code>className="text-red-500 border-red-500"</code> at the call site. Add <code>'destructive'</code> to the <code>ButtonVariant</code> union type, define its styles in the lookup table, write a Storybook story for it, and update the tests. The new variant becomes a first-class, documented member of the design system rather than a one-off hack visible only to its author.</p>

    <p>This forces a healthy friction. Before adding a new variant, someone has to consciously decide it belongs in the permanent design vocabulary. "Do we need a destructive button, or should we use the existing secondary button with a modal confirmation?" is exactly the conversation that design systems exist to prompt.</p>

    <h3>The testing argument</h3>

    <p>Beyond design consistency, there is a practical reason for the no-arbitrary-CSS rule: testability. When the set of valid states is finite and declared in the type system, you can write exhaustive tests mechanically. When states are arbitrary, meaning any combination of CSS classes and inline styles the caller might dream up, exhaustive testing becomes impossible by definition. You can only test what you thought to test.</p>
</section>

<section>
    <h2>Storybook: See Every State Before You Ship</h2>

    <p>Storybook renders components in isolation, outside the application. Each "story" is a single named state of a component, one specific combination of props. Open it and you get a browsable catalogue of every component in the system in every declared state, with no need to navigate through the app to find the right screen.</p>

    <p>Since the Button's valid states are enumerable from its type definition, the stories file is almost mechanical to write:</p>

    <pre><code class="language-typescript">{{SNIPPET:component-driven-design-react-typescript-storybook/button-stories.ts}}</code></pre>

    <p>You end up with a living document. A designer can open Storybook and see exactly what the "secondary, large, disabled" button looks like, with no developer needed to build a page that happens to contain one. When the spec says "the ghost button should look muted", there is a specific story to point at. When a developer implements the change, there is a specific story to verify against.</p>

    <p>Stories double as regression anchors. A visual regression tool can screenshot every story automatically and flag anything that changes unexpectedly, so no component drifts silently between deploys.</p>
</section>

<section>
    <h2>Testing Is Easy When Possibilities Are Finite</h2>

    <p>Testing constrained components is refreshingly direct. Every valid state is a named combination of declared props, so a test suite can iterate over every combination systematically. The example below uses <a href="https://vitest.dev/" target="_blank" rel="noopener">Vitest</a> and <a href="https://testing-library.com/docs/react-testing-library/intro/" target="_blank" rel="noopener">React Testing Library</a>, though the pattern works with any test runner:</p>

    <pre><code class="language-typescript">{{SNIPPET:component-driven-design-react-typescript-storybook/button-test.tsx}}</code></pre>

    <p>Three variants, three sizes, one disabled flag, and the nested loop covers all eighteen combinations. No state goes untested because no state can exist outside the declared combinations. Add a new variant to the type and TypeScript flags every switch statement or lookup table that fails to handle it, which forces the developer to define its styles <em>and</em> its tests in the same change.</p>

    <p>Now compare a component that accepts arbitrary <code>className</code>. Its test suite covers whatever the author thought to test. Its production cases are whatever consumers happen to pass. Nothing connects the two, and bugs live in the gap.</p>
</section>

<section>
    <h2>Composition: Components All the Way Up</h2>

    <p>The component model scales from atoms to pages. A <code>Button</code> is a primitive. A <code>Card</code> composes smaller sub-components and uses <code>Button</code> internally:</p>

    <pre><code class="language-typescript">{{SNIPPET:component-driven-design-react-typescript-storybook/card-component.tsx}}</code></pre>

    <p>Notice that the <code>Card</code> does not accept a <code>buttonVariant</code> prop and pass it through. It makes the design decision internally: featured cards get a primary button, all others get secondary. That decision lives in the component, not scattered across every page that renders a card. Change the rule and one file changes.</p>

    <p>A <code>ProductGrid</code> composes multiple <code>Card</code> components. A <code>CategoryPage</code> composes <code>ProductGrid</code> with a <code>PageHeader</code> and a <code>Sidebar</code>. The page layout itself is a component too:</p>

    <pre><code class="language-typescript">{{SNIPPET:component-driven-design-react-typescript-storybook/page-component.tsx}}</code></pre>

    <p>Even "this route uses a full-width layout" becomes a named, documented, testable choice rather than a CSS class on a <code>&lt;div&gt;</code> that some developer dropped into a route file.</p>

    <p>This fractal structure makes consistency compound as the codebase grows. Every new page draws on components whose visual behaviour is already defined and tested. The only fresh decisions are structural ones: which components to use, in what order, with what data. The design vocabulary stays bounded and intentional instead of expanding with every feature.</p>

    <p>Taken to its logical conclusion, a screen at the top of this hierarchy contains no raw HTML at all. Every element is a named component:</p>

    <pre><code class="language-typescript">{{SNIPPET:component-driven-design-react-typescript-storybook/screen-composition-example.tsx}}</code></pre>

    <p>No <code>&lt;div&gt;</code>, no <code>&lt;h2&gt;</code>, no <code>&lt;p&gt;</code>. The screen is a wiring diagram, routing data to components that already know how to display it. Visual decisions live inside the components. The screen owns structure and data flow, and nothing else.</p>

    <p>Component libraries formalise this into a five-tier hierarchy: primitives (buttons, inputs, badges), layout components (structural containers and spacing utilities), composite components (assembled patterns like a form field with its label and error message), feature components (domain-aware UI like a booking calendar or payment form), and screens (full pages wiring everything together). Dependencies run strictly downward: screens import from the feature and layout tiers, never the reverse.</p>
</section>

<section>
    <h2>Making the Rules Stick: ESLint as the Enforcer</h2>

    <p>Conventions erode. A rule documented in a README is forgotten by the third developer who joins, misunderstood by the fourth, and quietly ignored by the fifth. The no-arbitrary-CSS discipline, the five-tier hierarchy, the ban on raw HTML in screens. None of them stay coherent unless something enforces them mechanically: not guidelines people might follow, but gates the build will not pass without satisfying.</p>

    <p>One effective approach treats every CDD violation as the trigger for a static analysis rule rather than just a one-time code fix. The pattern is called Defence Before Fix: when a violation appears, the first question is not "how do I fix this instance?" but "what rule would have caught this before it was written?" Create the lint rule first, then fix the instance. Next time, the rule catches it in the editor before it reaches review.</p>

    <p>Applied to the composition hierarchy, this produces a rule that bans raw HTML in screen components entirely:</p>

    <pre><code class="language-javascript">{{SNIPPET:component-driven-design-react-typescript-storybook/no-html-in-screens.js}}</code></pre>

    <p>The rule scans every file in the screens directory and reports an error the moment a raw HTML element appears: <code>&lt;div&gt;</code>, <code>&lt;h1&gt;</code>, <code>&lt;p&gt;</code>, <code>&lt;form&gt;</code>, all of them. The error message goes further than "this is wrong": it names the component to reach for instead. Screens stay pure composition by structural impossibility.</p>

    <p>This pairs naturally with TypeScript's enforcement at the component boundary. TypeScript prevents invalid props; ESLint prevents raw HTML in screens. Together they make the architecture self-defending. The codebase pushes back on violations the moment they are written, before a pull request, before a review, before a test run. The discipline scales to teams of any size because it lives in tooling, not in institutional memory.</p>
</section>

<section>
    <h2>Designers Can Ship New Features Independently, and With High Confidence</h2>

    <p>Once a mature component library exists, a designer or front-end designer, someone who writes markup and basic React but is not a full engineer, can build an entire new page by composing components that already exist. No new components to build, no new styles to write, no new test cases to author: all of that already exists, and it is already passing.</p>

    <p>The confidence that comes with this is the real prize. Every component on the new page has been battle-tested. It has Storybook documentation, snapshot tests covering every state, and visual regression coverage on top. Assemble those proven pieces and the new page inherits all of that rigour for free. A designer can ship something genuinely new without a senior engineer hovering nervously over the diff, because there is no new untested UI in it to be nervous about.</p>

    <p>This rewrites the economics of front-end work. "Can we add a campaign landing page?" stops being a multi-day engineering task and becomes an afternoon of composition.</p>
</section>

<section>
    <h2>A Shared Language Between Designers and Developers</h2>

    <p>The most underappreciated benefit of component-driven design is linguistic. Give every piece of UI a name (<code>Button</code>, <code>Card</code>, <code>PageLayout</code>) and every valid state of that piece a name (<code>primary</code>, <code>featured</code>, <code>full-width</code>), and designers and developers can finally have precise conversations. "The featured card on mobile" means something specific and findable. "Make the ghost button larger" is a one-word change to a single prop.</p>

    <p>The TypeScript interface is not an implementation detail. It is the vocabulary of the design system, written in a form a compiler can enforce. Grow that interface thoughtfully, adding new variants deliberately and deprecating old ones explicitly, and the design system stays coherent over years and across teams. It holds up long after launch, not just for the few weeks whilst everyone still remembers why.</p>

    <p>That scattered CSS nightmare is not inevitable. It is simply what happens when UI decisions get made locally, case by case, with no shared vocabulary and no machine-enforced contract. Component-driven design, typed with TypeScript and documented with Storybook, is the structural answer. Commit to it and you build something that gets stronger with every feature instead of more fragile: a codebase where shipping fast and shipping safely stop being in tension, and where the next page is always the easiest one you have built. That is worth the up-front discipline many times over.</p>
</section>
`,
  },
  {
    id: 'php-exception-best-practices',
    title:
      'PHP Exception Best Practices: Hard Rules, Project-Level Hierarchies, and Modern 8.4 Patterns',
    description:
      'Simple hard rules for when to throw RuntimeException vs LogicException vs InvalidArgumentException, when to create project-level exceptions, how to structure them with typed properties and static factory methods, and how to log them properly with Monolog. Python and TypeScript get a cursory treatment at the end.',
    date: '2026-04-15',
    category: CATEGORIES.php.id,
    readingTime: 18,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    heroImage: {
      src: '/images/php-exception-best-practices/hero.webp',
      alt: 'A black-and-white photograph of a shipboard electrical switchboard, dense with ammeters, voltmeters, breakers, and labelled buses',
      ogImage: '/images/php-exception-best-practices/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:DETAIL_OF_ELECTRICAL_PANEL._-_Lightship_116,_Pier_3,_Inner_Harbor,_Baltimore,_Independent_City,_MD_HAER_MD-133-16.tif',
    },
    content: `<div class="intro">
    <p class="lead">Exceptions are the primary way PHP code communicates that something has gone wrong. Get them right and the stack trace, the log line, and the API error response all tell the same coherent story. Get them wrong and you end up parsing human-readable messages with regex, swallowing errors "temporarily", and turning every production incident into an archaeology dig. This article lays out a set of simple hard rules, with a PHP 8.4 implementation pattern that makes them trivial to follow. Python and TypeScript get a cursory section at the end, since the principles transfer directly.</p>
</div>

<section>
    <h2>The Hard Rules (In Order)</h2>

    <p>Before anything else, these are the non-negotiables. Everything that follows is the mechanism for applying them without friction.</p>

    <ol>
        <li><strong>\\RuntimeException is reserved for the truly unexpected.</strong> If any layer other than the outermost handler is catching one, something is wrong. Either the failure mode is expected and deserves a proper project-level exception, or nobody should be catching it.</li>
        <li><strong>\\LogicException is for impossible states.</strong> Type guards, invariant checks, "this branch should be unreachable". If any of these ever throw in production, the code is wrong.</li>
        <li><strong>\\InvalidArgumentException is for argument validation at the boundary.</strong> Throw as early as possible, so invalid values never enter the domain.</li>
        <li><strong>Always chain the previous exception.</strong> Never swallow debugging information by dropping the original cause.</li>
        <li><strong>Never encode data inside message strings.</strong> Data belongs on typed properties. The message is synthesised from those properties via a published sprintf constant.</li>
        <li><strong>Use named static factory methods:</strong> <code>create</code> and <code>createWithPrevious</code>. No more wondering which constructor overload you are looking at.</li>
        <li><strong>Messages live in class constants as sprintf formats.</strong> One source of truth. Tests reuse the constant, so changing wording never breaks a test and never creates a magic string to hunt down.</li>
        <li><strong>Never, ever, ever swallow an exception.</strong> Catching without rethrowing, recovering, or translating is fraud. The caller is told everything worked when it didn't.</li>
    </ol>

    <p>The rest of this article is the machinery that makes all of the above easy.</p>
</section>

<section>
    <h2>The SPL Hierarchy: What to Extend and When</h2>

    <p>PHP's built-in exception classes form a small tree that encodes a useful distinction. Use it.</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/spl-hierarchy.php}}</code></pre>

    <p>The single most important division is between <strong>\\LogicException</strong> and <strong>\\RuntimeException</strong>. It is a binary question about whose fault the failure is:</p>

    <ul>
        <li><strong>\\LogicException</strong> means <em>the code is wrong</em>. This should never happen, and if it does, a developer needs to fix the code rather than retry or recover from it.</li>
        <li><strong>\\RuntimeException</strong> means <em>the environment is wrong</em>: the database went away, the network timed out, or the disk is full. The code is fine; the world is misbehaving.</li>
    </ul>

    <p>Here is the distinction in practice:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/runtime-vs-logic.php}}</code></pre>

    <p>And <code>InvalidArgumentException</code>, a subclass of <code>LogicException</code>, covers the canonical "you passed me rubbish" case:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/invalid-argument.php}}</code></pre>
</section>

<section>
    <h2>The Containment Rule for RuntimeException</h2>

    <p>This is worth stating twice because it is the rule most often violated.</p>

    <p><strong>No layer of the application may catch a bare <code>RuntimeException</code> except the outermost one</strong> - not the service layer, not the repository, not the controller, only the kernel or top-level exception listener that turns failures into a user-facing "something went wrong" response.</p>

    <p>If you find yourself wanting to catch a <code>RuntimeException</code> in the middle of the stack, stop and ask: <em>why is this failure expected here?</em> If you can answer that question, the failure deserves its own project-level exception class that describes what happened in domain terms. Replace the bare <code>RuntimeException</code> with that new class, and now the catch block has a name and a contract.</p>

    <p>The same rule applies, even more strictly, to <code>Throwable</code> and <code>Exception</code>. Generic catches in the middle of a stack are how silent bugs survive into production.</p>
</section>

<section>
    <h2>Project-Level Exception Hierarchy</h2>

    <p>Every project of any size needs its own exception tree. The minimum useful structure is a root marker interface that every project-thrown exception implements, a couple of category marker interfaces for things you want to react to generically, and abstract base classes corresponding to the <code>LogicException</code> and <code>RuntimeException</code> split.</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/project-hierarchy.php}}</code></pre>

    <p>The marker interfaces pay for themselves instantly. The kernel exception listener can match on <code>UserFacingExceptionInterface</code> and return a structured 4xx without caring what the specific subclass is. The security logger listens for <code>SecurityExceptionInterface</code>. A retry middleware loops when it sees <code>RetryableExceptionInterface</code>. None of those components need to know about every concrete exception class. They react to capability.</p>

    <p>The <code>AppExceptionInterface</code> root marker is the one that really earns its keep. If an exception reaching the top handler does not implement it, that is a signal: the code threw something it did not reason about. Either promote the exception to a proper domain class, or wrap it at the boundary where it originated.</p>
</section>

<section>
    <h2>Composition Over Inheritance: Keep the Tree Shallow</h2>

    <p>PHP forces you to extend <code>Exception</code> (or one of its subclasses) because <code>throw</code> only accepts a <code>Throwable</code>. That is the one piece of inheritance you cannot avoid. Categorisation, shared behaviour and rich context should all be composed rather than inherited.</p>

    <p>The common trap is using deep inheritance chains to "share a bit of behaviour" or to "group related exceptions". It looks tidy on a class diagram and falls apart in practice:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/inheritance-depth-bad.php}}</code></pre>

    <p>The rule: <strong>concrete exceptions are exactly one level below the abstract base</strong>. No mid-tier abstracts like <code>OrderException</code> sitting between <code>AppException</code> and <code>InsufficientStockException</code>. No subclassing a concrete exception to tweak it. If you need to group exceptions for handling, group them with a marker interface. If you need to share mechanical boilerplate, share it with a trait.</p>

    <h3>Traits for Shared Mechanical Boilerplate</h3>

    <p>Traits are a clean way to share the <code>MESSAGE_FORMAT</code> / <code>sprintf</code> / static factory pattern across every exception without an intermediate base class:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/shared-behavior-trait.php}}</code></pre>

    <p>A concrete exception stays one level deep (<code>extends AppException</code>), <code>use</code>s the trait for boilerplate, declares its <code>MESSAGE_FORMAT</code> constant, and implements whichever marker interfaces describe its capabilities. Behaviour is composed from three orthogonal axes rather than stacked up in an inheritance chain: class (for <code>throw</code> compatibility), interfaces (for categorisation), and trait (for boilerplate).</p>

    <h3>Compose Rich Context via Value Objects</h3>

    <p>When an exception would otherwise sprout six or seven flat properties, the right move is to compose a typed value object and have the exception hold <em>that</em>, rather than duplicating every field on the exception itself:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/composition-value-object.php}}</code></pre>

    <p>Now the same <code>PaymentAttemptContext</code> value object is reused by the exception, the audit log writer, the analytics publisher, and anywhere else that needs to represent a payment attempt. Adding a new field to the context does not ripple through every exception constructor, and the exception's public surface stays stable. This is the same argument for composition over inheritance that applies to any other class in the system; it just holds doubly for exceptions because inheritance is already doing necessary work for the <code>throw</code> contract.</p>

    <h3>Three Axes, Not One Chain</h3>

    <p>Put it all together and every concrete exception composes along three independent axes:</p>

    <ul>
        <li><strong>Class:</strong> exactly one level below an abstract base (<code>AppException</code> or <code>AppLogicException</code>). This is the only inheritance in play, and it exists solely because <code>throw</code> requires a <code>Throwable</code>.</li>
        <li><strong>Marker interfaces:</strong> orthogonal capabilities (<code>UserFacing</code>, <code>Retryable</code>, <code>Security</code>). An exception can be any combination of these. Try expressing "retryable AND user-facing" with class inheritance and you will see why interfaces win.</li>
        <li><strong>Traits and value objects:</strong> reusable mechanical pieces. The sprintf/factory boilerplate lives in a trait. Rich context lives in a composed value object.</li>
    </ul>

    <p>The inheritance tree is two levels deep and stays that way forever. Every other axis of variation is handled by composition.</p>
</section>

<section>
    <h2>Data Goes on Properties, Not in Message Strings</h2>

    <p>This is the rule that most often surprises people, and the one that pays the biggest dividend. Here is the anti-pattern:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/data-in-message-bad.php}}</code></pre>

    <p>Every piece of data in that message is valuable: the SKU, the requested quantity, the available quantity, the order ID, the customer ID. Downstream code will want to react to those values specifically. Logs want to index them. API responses want to return them as structured fields. But all of it is trapped inside a string, recoverable only by fragile regex that breaks the first time someone improves the wording.</p>

    <p>The fix is simple: put the data on the exception as typed properties, and synthesise the message from them via a published <code>sprintf</code> format constant.</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/data-in-properties-good.php}}</code></pre>

    <p>PHP 8.4's asymmetric visibility, <code>public private(set)</code>, is perfect here. The properties are freely readable anywhere (no boilerplate getters), but only the exception itself can set them. No accidental mutation, no <code>readonly</code> gotchas around inheritance.</p>

    <p>Downstream code becomes clean and type-safe:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/using-exception-data.php}}</code></pre>
</section>

<section>
    <h2>Static Factory Methods: create() and createWithPrevious()</h2>

    <p>Exceptions are one of the rare cases where multiple named factories beat a single polymorphic constructor. A fully-typed constructor with five domain parameters plus an optional trailing <code>previous</code> is ugly to call and ambiguous to read. Named factories make the call site self-documenting:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/factory-call-sites.php}}</code></pre>

    <p>They also give you a natural place to add convenience constructors later, such as <code>fromApiResponse(array $body)</code> or <code>forOrder(OrderId $id)</code>, without bloating the main constructor signature.</p>
</section>

<section>
    <h2>Message Constants: The Single Source of Truth</h2>

    <p>Exception messages are a surprisingly common source of magic strings scattered through codebases. Every test that asserts on a specific wording becomes a fragile coupling to the exact phrasing. Change the wording and seventeen unrelated tests turn red.</p>

    <p>The fix is the <code>MESSAGE_FORMAT</code> class constant:</p>

    <ul>
        <li>The exception's constructor uses it to build the message.</li>
        <li>Tests use the same constant to build the expected value.</li>
        <li>Log parsers (if you really must) reference the constant, not the literal string.</li>
    </ul>

    <p>Change the wording in one place and every caller and every test stays green automatically.</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/testing-exceptions.php}}</code></pre>

    <p>Notice how the test never hardcodes the message string. It asserts on properties (which is the right thing to assert on 95% of the time) and, where it does check the message, it reproduces it from the published constant.</p>
</section>

<section>
    <h2>Always Chain the Previous Exception</h2>

    <p>PHP's <code>Exception</code> constructor takes a <code>?Throwable $previous</code> argument specifically for this - use it every single time.</p>

    <p>When you translate a low-level exception into a domain-meaningful one at a boundary, the low-level exception is not noise to be discarded. It is the root cause of the failure. Stack traces, connection IDs, driver error codes, provider-specific details all live on that original throwable. Throw it away and future you will be guessing.</p>

    <p>Monolog's default formatter walks the entire previous chain, Symfony's profiler shows every level, and PHPUnit's <code>expectException</code> output includes it - all of it automatic, provided you chain.</p>

    <p>The boundary conversion pattern looks like this:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/boundary-conversion.php}}</code></pre>

    <p>The rule in one sentence: <em>the rest of the application never sees <code>PDOException</code>, <code>RedisException</code>, or HTTP client exceptions; it sees <code>AppException</code> subclasses, and the original exception is always chained.</em></p>
</section>

<section>
    <h2>Never, Ever Swallow Exceptions</h2>

    <p>This needs its own section because it is the single most damaging pattern in PHP codebases.</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/never-swallow.php}}</code></pre>

    <p>If you catch an exception, you must do exactly one of three things:</p>

    <ol>
        <li><strong>Rethrow.</strong> Optionally wrapped in a more meaningful exception, with the previous exception chained. The caller still knows something went wrong.</li>
        <li><strong>Recover.</strong> Execute an alternative path that the caller has explicitly opted into (retry, fallback value, degraded mode). The recovery must be an actual plan, not "we hope it worked".</li>
        <li><strong>Translate.</strong> Throw a different exception that the caller is documented (via <code>@throws</code>) to expect. This is a rethrow with wrapping.</li>
    </ol>

    <p>Logging and then not rethrowing is still swallowing: the caller is told via a normal return that everything succeeded, when it didn't, and that is lying to your own code.</p>

    <p>If you are ever tempted to write an empty <code>catch</code>, write a comment first explaining which of the three options above you are doing and why. Nine times out of ten, the act of writing the comment will reveal that you are about to do something wrong.</p>
</section>

<section>
    <h2>The Outermost Handler: Where Generic Catches Belong</h2>

    <p>Given all of the above, there is exactly one place in the application where a generic catch of <code>Throwable</code> makes sense: the kernel-level exception listener. That is the place that decides what a user sees when something goes wrong, and it is the only place that is allowed to deal in generic base types.</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/outer-layer-handler.php}}</code></pre>

    <p>Notice how the handler uses the marker interfaces from the project hierarchy to branch. It does not enumerate concrete exception classes. The list of concrete exceptions can grow without the handler ever needing to change.</p>
</section>

<section>
    <h2>Monolog: A Dedicated Exception Log Channel</h2>

    <p>Exceptions deserve their own log channel with its own retention policy and its own format. Mixing them into the main application log makes them hard to find and hard to correlate across requests.</p>

    <p>Here is a Symfony Monolog configuration for this setup:</p>

    <pre><code class="language-yaml">{{SNIPPET:php-exception-best-practices/monolog-config.yaml}}</code></pre>

    <p>The key moves:</p>

    <ul>
        <li><strong>Dedicated <code>exception</code> channel</strong> with its own rotating log file, separate from the main application log.</li>
        <li><strong>JSON formatter:</strong> exception properties (the structured data we put on the class) get serialised as queryable fields, not flattened into a message string.</li>
        <li><strong>Fingers-crossed handler on main:</strong> a single error triggers the whole request's debug log being flushed, so you get full context around the failure without drowning in noise during healthy requests.</li>
        <li><strong>Separate <code>security</code> channel</strong> for anything implementing <code>SecurityExceptionInterface</code>, with longer retention.</li>
    </ul>

    <p>The top-level kernel listener injects a channel-specific logger, and Symfony auto-wires the channel by argument name (<code>exceptionLogger</code> resolves to the <code>exception</code> channel). Every thrown-and-logged exception ends up in <code>var/log/exception.log</code> as structured JSON.</p>
</section>

<section>
    <h2>A Monolog Processor for Typed Exception Data</h2>

    <p>Because we put exception data on real typed properties, we can reflect them out in a Monolog processor and attach them to every log record automatically. No manual context array at every throw site:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/manual-logging-bad.php}}</code></pre>

    <p>Here is the processor that makes it automatic:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/monolog-processor.php}}</code></pre>

    <p>Wire it up in <code>services.yaml</code>:</p>

    <pre><code class="language-yaml">{{SNIPPET:php-exception-best-practices/processor-registration.yaml}}</code></pre>

    <p>Now every log entry that carries an <code>AppExceptionInterface</code> in its context automatically gets an <code>extra.app_exception</code> block with the full class name, every typed property, and the full previous chain. All of this ends up as indexed, queryable JSON fields in your log aggregation tool of choice.</p>
</section>

<section>
    <h2>PHPStan: Making @throws a Type Constraint</h2>

    <p>PHP has no checked exceptions in the language, but PHPStan can simulate them. With the right configuration, every exception class in your project hierarchy is treated as "checked", meaning PHPStan will fail the build if a function throws (or calls a function that throws) one of your exceptions without declaring it in <code>@throws</code>.</p>

    <pre><code class="language-yaml">{{SNIPPET:php-exception-best-practices/phpstan-throws.neon}}</code></pre>

    <p>Combined with the project-level hierarchy and typed properties, this closes the loop. The set of exceptions a function can throw is now part of its signature, enforced by static analysis. Adding a new throw somewhere deep in the call graph surfaces as a required <code>@throws</code> update everywhere the exception can propagate, or a required <code>try</code> / <code>catch</code> at a natural boundary.</p>

    <p>Bare <code>RuntimeException</code> and <code>LogicException</code> are left in <code>uncheckedExceptionClasses</code> on purpose. You don't want the type-checker demanding that every function declare that it might throw one, since they are truly unexpected by definition and it's the outer handler that catches them.</p>
</section>

<section>
    <h2>Putting It All Together: A Modern PHP 8.4 Exception</h2>

    <p>Here is the full pattern in one class, using the features PHP 8.4 gives us:</p>

    <pre><code class="language-php">{{SNIPPET:php-exception-best-practices/php84-modern-features.php}}</code></pre>

    <p>Every rule from the top of this article is applied:</p>

    <ul>
        <li>Extends an <code>AppException</code> base, implements the <code>UserFacingExceptionInterface</code> marker.</li>
        <li>Data is on typed properties, not in the message.</li>
        <li>Asymmetric visibility means those properties are read-only from outside, without the <code>readonly</code> pitfalls.</li>
        <li>A property hook gives us a computed <code>summary</code> attribute with no getter boilerplate.</li>
        <li>Named static factories, <code>create</code> and <code>createWithPrevious</code>, for self-documenting call sites.</li>
        <li>The message is synthesised from a <code>MESSAGE_FORMAT</code> constant that tests can reuse.</li>
        <li>The previous exception is always chainable via the dedicated factory.</li>
    </ul>
</section>

<section>
    <h2>Exceptions Are Not For Control Flow</h2>

    <p>If "not found" is an expected outcome of a finder method, do not throw; return null, or a result object, instead. Exceptions are for <em>failure</em>, not for signalling a normal code path that happened to yield no result.</p>

    <p>The moment "throw and catch" becomes part of the happy path, the signal value of exceptions degrades: logs fill with noise, stack traces become routine, and the outer handler stops meaning "something genuinely went wrong" and starts meaning "one of fifty expected things happened". Every rule in this article depends on exceptions being rare and meaningful, and using them for control flow breaks that assumption at the root.</p>
</section>

<section>
    <h2>Python: Same Principles, Different Syntax</h2>

    <p>The principles port directly. Python's <code>raise ... from previous</code> is the language-level equivalent of PHP's <code>previous</code> constructor argument. Data goes on instance attributes, <code>__str__</code> synthesises the message from them.</p>

    <pre><code class="language-python">{{SNIPPET:php-exception-best-practices/python-exceptions.py}}</code></pre>

    <p>Two Python-specific notes:</p>

    <ul>
        <li>Subclass <code>Exception</code>, never <code>BaseException</code>. <code>BaseException</code> is reserved for things like <code>SystemExit</code> and <code>KeyboardInterrupt</code> that should generally not be caught.</li>
        <li><code>raise ... from None</code> suppresses the previous-exception chain. It exists for rare cases where the cause is a noisy implementation detail, but it is usually wrong. Default to <code>raise ... from previous</code>.</li>
    </ul>
</section>

<section>
    <h2>TypeScript: Error.cause and Nominal Typing via Class</h2>

    <p>TypeScript's story is cleaner than you might expect. ES2022 added <code>Error.cause</code>, the direct analogue of PHP's previous exception, and the <code>Error</code> constructor accepts it as a second argument via an options object.</p>

    <pre><code class="language-typescript">{{SNIPPET:php-exception-best-practices/typescript-exceptions.ts}}</code></pre>

    <p>Three TypeScript-specific notes:</p>

    <ul>
        <li><code>instanceof</code> works for domain error classes at runtime. Use it in catch blocks, and never parse the message.</li>
        <li>Set <code>this.name</code> explicitly. The default <code>"Error"</code> string makes all errors look alike in logs.</li>
        <li>The caught value in a catch block is <code>unknown</code> in modern TypeScript. Narrow with <code>instanceof</code> before accessing properties. The type system will force you to be honest about what you actually know.</li>
    </ul>
</section>

<section>
    <h2>Summary: The Checklist</h2>

    <p>Every exception in your project should pass all of these checks. Stick this list next to the keyboard:</p>

    <ul>
        <li>Extends an <code>AppException</code> base class and implements <code>AppExceptionInterface</code>.</li>
        <li>Extends <code>LogicException</code> (via <code>AppLogicException</code>) if it is a code bug; <code>RuntimeException</code> (via <code>AppException</code>) otherwise.</li>
        <li>Implements any relevant marker interfaces (<code>UserFacing</code>, <code>Retryable</code>, <code>Security</code>).</li>
        <li>All domain data lives on typed properties (PHP 8.4 <code>public private(set)</code>).</li>
        <li>Message is synthesised from a <code>MESSAGE_FORMAT</code> class constant via <code>sprintf</code>.</li>
        <li>Named static factories: <code>create</code> and <code>createWithPrevious</code>.</li>
        <li>The previous exception is accepted and forwarded to the parent constructor, never dropped.</li>
        <li>Low-level third-party exceptions are wrapped at the boundary, not leaked to the domain.</li>
        <li>Declared in <code>@throws</code> on every function that throws or propagates it.</li>
        <li>Tested by asserting on properties, and on messages built from the published constant.</li>
    </ul>

    <p>Do this consistently and exceptions stop being an afterthought. They become a structured, testable, observable part of the system's contract, and the outer exception handler genuinely does mean "something unexpected happened" when it fires.</p>
</section>
`,
  },
  {
    id: 'openapi-automatic-code-generation',
    title: 'OpenAPI and Automatic Code Generation: Define Once, Generate Everywhere',
    description:
      'How OpenAPI specifications let you define your API once and automatically generate type-safe client SDKs, server stubs, and models in PHP, TypeScript, Python, and dozens of other languages.',
    date: '2026-03-24',
    category: CATEGORIES.php.id,
    readingTime: 20,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    heroImage: {
      src: '/images/openapi-automatic-code-generation/hero.webp',
      alt: 'A black-and-white photograph of a machined forging die, tagged "MOD 17FM", seated in the bed of a large industrial closed-die forging press',
      ogImage: '/images/openapi-automatic-code-generation/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Die_in_place_-_Alcoa_Forging_Division,_Mesta_50,000-Ton_Closed_Die_Forging_Press,_1600_Harvard_Avenue,_Cleveland,_Cuyahoga_County,_OH_HAER_OHIO,18-CLEV,41-13.tif',
    },
    content: `<div class="intro">
    <p class="lead">You have built an API. Now every team that wants to consume it needs to write HTTP client code, map JSON responses to objects, handle authentication headers, and deal with error responses. Multiply that by five client teams across three languages and you have a maintenance disaster waiting to happen. OpenAPI solves this by letting you describe your API in a single machine-readable specification, then automatically generating all that boilerplate in whatever language you need. The specification becomes the contract, and the generated code stays in sync with it.</p>
</div>

<section>
    <h2>A Brief History: From Swagger to OpenAPI</h2>

    <p>The story starts in 2009 when Tony Tam, CTO of the online dictionary service Wordnik, needed a way to document and manage their growing JSON API. The internal tool he built became <strong>Swagger</strong> - a name suggested by colleague Zeke Sikelianos as a playful jab at WADL (Web Application Description Language), the XML-heavy alternative that nobody enjoyed using.</p>

    <h3>The Swagger Years</h3>

    <p><strong>Swagger 1.0</strong> arrived in August 2011. It introduced a JSON-based format for describing RESTful APIs and shipped alongside tooling for interactive documentation and code generation. It was simple, practical, and solved a real problem that existing standards like WADL made painful.</p>

    <p><strong>Swagger 1.1</strong> (August 2012) was a minor refinement. <strong>Swagger 1.2</strong> (March 2014) was the first version written as a formal specification document, separating the spec from the implementation and improving the type system to align with JSON Schema Draft 4.</p>

    <p><strong>Swagger 2.0</strong> (2014) was the inflection point. It simplified the specification structure, gained massive adoption, and triggered an explosion of third-party tooling. This was the version that made API-first design practical for most teams.</p>

    <h3>The OpenAPI Era</h3>

    <p>In March 2015, SmartBear Software acquired the Swagger specification. Later that year, SmartBear donated it to the newly formed <strong>OpenAPI Initiative</strong> under the Linux Foundation, with founding members including Google, IBM, Microsoft, and PayPal. On 1 January 2016, the specification was officially renamed to the <strong>OpenAPI Specification</strong> (OAS). The Swagger brand lived on as SmartBear's commercial tooling - the Editor, the UI, and Codegen - but the specification itself was now community-governed.</p>

    <p><strong>OpenAPI 3.0</strong> (July 2017) was a major restructuring. It introduced the <code>components</code> object to consolidate reusable definitions, replaced the flat <code>host</code>/<code>basePath</code>/<code>schemes</code> fields with a flexible <code>servers</code> array supporting multiple environments, added <code>callbacks</code> for describing webhooks, introduced <code>links</code> for expressing relationships between operations, and overhauled request body handling with proper content negotiation via media types.</p>

    <p><strong>OpenAPI 3.1</strong> (February 2021) achieved full compatibility with JSON Schema Draft 2020-12, the single most requested change. The OpenAPI-specific <code>nullable</code> keyword was replaced by JSON Schema's native type arrays (<code>type: [string, null]</code>), <code>$ref</code> could finally coexist with sibling keywords like <code>description</code>, and a new top-level <code>webhooks</code> field provided first-class support for event-driven APIs. The <code>paths</code> field became optional, allowing specifications that described only webhooks or shared components.</p>

    <p><strong>OpenAPI 3.2</strong> (September 2025) added hierarchical tags for better API organisation, support for the <code>QUERY</code> HTTP method, streaming support for Server-Sent Events and JSON Lines, OAuth 2.0 Device Authorisation Flow, and the <code>additionalOperations</code> keyword for non-standard HTTP verbs.</p>
</section>

<section>
    <h2>What Is an OpenAPI Specification?</h2>

    <p>An OpenAPI specification is a YAML or JSON document that describes everything about your HTTP API in a structured, language-agnostic format. It covers:</p>

    <ul>
        <li><strong>Endpoints and operations</strong> &mdash; every URL path, HTTP method, and what each operation does</li>
        <li><strong>Request and response schemas</strong> &mdash; the shape of every payload, with data types, validation rules, and examples</li>
        <li><strong>Authentication</strong> &mdash; API keys, OAuth 2.0 flows, bearer tokens, mutual TLS</li>
        <li><strong>Parameters</strong> &mdash; query strings, path variables, headers, and cookies</li>
        <li><strong>Error responses</strong> &mdash; structured error formats for each status code</li>
        <li><strong>Reusable components</strong> &mdash; shared schemas, parameters, responses, and examples</li>
    </ul>

    <p>Here is a minimal but complete example:</p>

    <pre><code class="language-yaml">{{SNIPPET:openapi-automatic-code-generation/openapi-spec-example.yaml}}</code></pre>

    <p>That single document is both human-readable documentation and a machine-readable contract. It tells you what every endpoint expects, what it returns, how authentication works, and what the data looks like. More importantly, it tells <em>tools</em> all of that too, which is where code generation comes in.</p>
</section>

<section>
    <h2>Automatic Code Generation: The Big Win</h2>

    <p>The real power of OpenAPI is not documentation. It is the ability to feed that specification into a code generator and produce working, type-safe client libraries, server stubs, and data models in any supported language. You define the API once, and the tooling generates the tedious parts.</p>

    <p><a href="https://openapi-generator.tech/" target="_blank" rel="noopener">OpenAPI Generator</a> is the primary open-source tool for this. It is a community-driven fork of Swagger Codegen with broader language support, more active maintenance, and an Apache 2.0 licence. As of 2026, it supports over 50 target languages and frameworks.</p>

    <h3>What Gets Generated</h3>

    <p>For a client SDK, OpenAPI Generator typically produces:</p>

    <ul>
        <li><strong>Model classes / DTOs</strong> &mdash; typed objects matching every schema in your specification, with proper validation and serialisation</li>
        <li><strong>API client classes</strong> &mdash; one class per tag or resource group, with a method for each operation</li>
        <li><strong>Request and response handling</strong> &mdash; HTTP transport, content-type negotiation, error mapping</li>
        <li><strong>Authentication</strong> &mdash; configured from the security schemes in your spec</li>
        <li><strong>Configuration</strong> &mdash; base URL, timeouts, custom headers</li>
    </ul>

    <p>For a server stub, it generates the routing, controller interfaces, request validation, and model classes. You fill in the business logic.</p>

    <h3>Supported Languages and Frameworks</h3>

    <p>The breadth of support is genuinely impressive. On the client side: PHP, TypeScript (with Axios, Fetch, or Angular variants), Python, Go, Java, Kotlin, C#, Ruby, Rust, Swift, Dart, and many more. On the server side: PHP (Laravel, Symfony, Slim, Mezzio), Java (Spring, JAX-RS), Python (Flask, FastAPI), Go, Node.js (Express, NestJS), and others.</p>

    <p>There are also generators for documentation (HTML, Asciidoc), configuration (Apache, Nginx), database schemas (MySQL), and even GraphQL schema definitions.</p>

    <h3>The Workflow in Practice</h3>

    <p>Here is how a typical code generation workflow looks:</p>

    <pre><code class="language-bash">{{SNIPPET:openapi-automatic-code-generation/generate-clients.sh}}</code></pre>

    <p>You can also use Docker, which avoids the Java dependency entirely:</p>

    <pre><code class="language-bash">{{SNIPPET:openapi-automatic-code-generation/generate-docker.sh}}</code></pre>

    <p>The generated code is immediately usable. Install dependencies, configure the base URL and authentication, and you have a working client:</p>

    <pre><code class="language-php">{{SNIPPET:openapi-automatic-code-generation/using-generated-client.php}}</code></pre>

    <p>Compare that to the alternative: manually writing HTTP calls with Guzzle or cURL, hand-mapping JSON arrays to objects, remembering which endpoints need which headers, and hoping the documentation is up to date. The generated client eliminates all of that.</p>
</section>

<section>
    <h2>What the Generated Code Looks Like</h2>

    <p>To make this concrete, let us look at what OpenAPI Generator produces from the <code>Product</code> schema in our specification above. Here is a simplified version of the generated PHP model:</p>

    <pre><code class="language-php">{{SNIPPET:openapi-automatic-code-generation/generated-product-model.php}}</code></pre>

    <p>You did not write any of that. The generator produced it directly from the schema. Every property has the correct type. The constructor handles deserialisation from JSON arrays. The <code>jsonSerialize</code> method handles the reverse. If you add a field to the specification and regenerate, the model updates automatically.</p>

    <p>The same specification generates equivalent models in TypeScript:</p>

    <pre><code class="language-typescript">{{SNIPPET:openapi-automatic-code-generation/generated-typescript-interfaces.ts}}</code></pre>

    <p>And in Python:</p>

    <pre><code class="language-python">{{SNIPPET:openapi-automatic-code-generation/generated-python-dataclass.py}}</code></pre>

    <p>One specification generates all three, each of them type-safe and consistent with the others.</p>
</section>

<section>
    <h2>PHP Code Generation: The Current Landscape</h2>

    <p>For PHP specifically, OpenAPI Generator offers three generator variants:</p>

    <ul>
        <li><strong><code>php</code></strong> &mdash; the stable, battle-tested client generator producing PSR-compatible code with Guzzle as the default HTTP client</li>
        <li><strong><code>php-nextgen</code></strong> (beta) &mdash; a modernised variant using newer PHP features and improved type handling</li>
        <li><strong><code>php-dt</code></strong> (beta) &mdash; a data-transfer-focused variant</li>
    </ul>

    <p>On the server side, generators exist for Laravel, Symfony, Slim, Mezzio (formerly Zend Expressive), Lumen, and Flight.</p>

    <p>The PHP client generator supports extensive customisation through additional properties:</p>

    <pre><code class="language-bash">{{SNIPPET:openapi-automatic-code-generation/generate-php-custom.sh}}</code></pre>

    <p>The generated package includes a <code>composer.json</code>, proper PSR-4 autoloading, and is ready to be published as a private Composer package or included directly in your project.</p>

    <h3>Native PHP: lts/php-openapi-generator</h3>

    <p>The biggest practical annoyance with OpenAPI Generator is the Java dependency. It requires a JVM to run, which means either installing Java on your development machines and CI servers or using the Docker wrapper. For PHP teams, adding Java to the toolchain just to generate some PHP classes feels wrong.</p>

    <p><a href="https://github.com/LongTermSupport/php-openapi-generator" target="_blank" rel="noopener">lts/php-openapi-generator</a> solves this. It is a native PHP code generator that produces PHP models and API clients directly from OpenAPI specifications, with no Java runtime required. Install it with Composer and run it like any other PHP tool.</p>

    <p>The project is a hard fork of <a href="https://github.com/janephp/janephp" target="_blank" rel="noopener">Jane PHP</a>, which deserves full credit as the original foundation for PHP-native OpenAPI code generation. However, Jane has not kept pace with the spec: it still lacks OpenAPI 3.1 support despite 3.1 being the standard since 2021, and its PHP version requirements lag behind current releases. The lts/php-openapi-generator fork takes a different approach, targeting only the latest OpenAPI specification and the latest PHP version. It is not a gentle patch on top of Jane but a heavily updated codebase focused on staying current. Key improvements include:</p>

    <ul>
        <li><strong>Full OpenAPI 3.1 support</strong> including type arrays (<code>["string", "null"]</code>), nullable types via type arrays, <code>const</code> values, and the <code>$schema</code> keyword</li>
        <li><strong>PHP 8.4+ requirement</strong> taking advantage of modern language features</li>
        <li><strong>Strict spec validation</strong> via <a href="https://github.com/LongTermSupport/strict-openapi-validator" target="_blank" rel="noopener">lts/strict-openapi-validator</a> built in</li>
        <li><strong>PHPUnit 11</strong> test suite</li>
    </ul>

    <p>Usage is straightforward. Install, create a configuration file, and generate:</p>

    <pre><code class="language-bash">{{SNIPPET:openapi-automatic-code-generation/jane-openapi-generate.sh}}</code></pre>

    <p>The configuration file (<code>.jane-openapi</code>) is a PHP array pointing at your spec, namespace, and output directory:</p>

    <pre><code class="language-php">{{SNIPPET:openapi-automatic-code-generation/jane-openapi-config.php}}</code></pre>

    <p>The generator produces typed PHP model classes and API client code from your specification. Because it runs natively in PHP, it integrates cleanly into existing Composer scripts and CI pipelines without any additional runtime dependencies. No Docker, no Java, no separate toolchain, just PHP generating PHP.</p>
</section>

<section>
    <h2>Integrating Code Generation into CI/CD</h2>

    <p>Generating code once is useful. Generating it automatically on every spec change is transformational. Here is how to wire it into a CI pipeline:</p>

    <pre><code class="language-yaml">{{SNIPPET:openapi-automatic-code-generation/ci-generate-sdk.yaml}}</code></pre>

    <p>Every time someone updates the API specification, the pipeline regenerates all client libraries and commits the changes, with no manual steps and no drift between spec and code. The specification is the single source of truth, and the generated code follows it automatically.</p>
</section>

<section>
    <h2>Best Practices</h2>

    <h3>Design-First vs Code-First</h3>

    <p>There are two schools of thought here, and I have a clear preference.</p>

    <p><strong>Design-first</strong> means writing the OpenAPI specification before you write any code. You design the API contract, get agreement from consumers, generate mock servers for frontend teams to build against, and then implement the backend to match the contract. This is the approach I recommend for any API that will have multiple consumers, and especially for public APIs.</p>

    <p><strong>Code-first</strong> means building the API in code and generating the specification from annotations or framework metadata. Libraries like <a href="https://github.com/zircote/swagger-php" target="_blank" rel="noopener">swagger-php</a> do this for PHP using attributes. The specification becomes a byproduct of the implementation. This works for internal APIs where you have tight control over both sides, but it tends to produce lower-quality specifications with missing descriptions and examples.</p>

    <p>For code generation to work well, the specification needs to be detailed and accurate. Design-first naturally produces that level of quality because the spec is the primary artefact, not an afterthought.</p>

    <h3>Keep Specifications Up to Date</h3>

    <p>A stale specification is worse than no specification, because it actively misleads. If you take the design-first approach, the spec should be committed to source control and validated in CI. Tools like <a href="https://github.com/stoplightio/spectral" target="_blank" rel="noopener">Spectral</a> can lint your specification against style rules and best practices on every pull request. If you take the code-first approach, regenerate the spec on every build and fail the pipeline if the output differs from the committed version.</p>

    <h3>Customise the Generated Code</h3>

    <p>The default output from OpenAPI Generator is functional but generic. For production use, you will likely want to customise it. The generator supports Mustache templates that you can override to control the generated code style, add custom base classes, or integrate with your existing HTTP client setup.</p>

    <pre><code class="language-bash">{{SNIPPET:openapi-automatic-code-generation/custom-templates.sh}}</code></pre>

    <p>Store your custom templates in your repository alongside the specification. This way, regenerating the code always produces output that fits your project's conventions.</p>

    <h3>When to Use Generated Code vs Hand-Written</h3>

    <p>Generated code excels at the repetitive structural work: models, serialisation, HTTP transport, parameter handling. It is not the right tool for business logic, complex validation rules, or domain-specific behaviour. The sweet spot is to use generated code as a foundation layer, the plumbing, and build your application logic on top of it.</p>

    <p>If you find yourself fighting the generator to produce code that matches your needs, that is a signal to either customise the templates or write that particular layer by hand. The goal is less boilerplate, not zero hand-written code.</p>
</section>

<section>
    <h2>Integrating with External APIs</h2>

    <p>One of the most immediately practical uses of OpenAPI is consuming third-party APIs. If an external service publishes an OpenAPI specification, and increasingly most do, you can generate a fully typed client library in minutes instead of spending days writing HTTP boilerplate by hand.</p>

    <p>The workflow is straightforward:</p>

    <ol>
        <li>Download the provider's OpenAPI specification (most publish it alongside their API docs)</li>
        <li>Run it through OpenAPI Generator targeting your language</li>
        <li>Install the generated package and start making type-safe API calls</li>
    </ol>

    <pre><code class="language-bash">{{SNIPPET:openapi-automatic-code-generation/fetch-external-spec.sh}}</code></pre>

    <p>You now have a typed PHP client with proper models, authentication handling, and IDE autocompletion for every endpoint, so there is no guessing at parameter names, no manually mapping JSON to arrays, and no discovering at runtime that a field was renamed three versions ago.</p>

    <h3>When the Spec and Reality Diverge</h3>

    <p>Here is the problem nobody warns you about: external API specifications are often wrong. Not maliciously, but because keeping a specification perfectly in sync with a live API is hard, and most teams do not validate their own specs rigorously. You will encounter responses with extra fields not in the spec, missing fields that the spec says are required, types that do not match (a string where the spec says integer), and entire endpoints that behave differently from what is documented.</p>

    <p>This is where strict validation tooling becomes essential. <a href="https://github.com/LongTermSupport/strict-openapi-validator" target="_blank" rel="noopener">strict-openapi-validator</a> is a PHP library designed for exactly this problem. It validates API requests and responses against an OpenAPI specification with zero tolerance for deviation: no type coercion, no silently ignoring extra fields, no glossing over missing required properties. If the data does not match the spec exactly, it tells you.</p>

    <p>When integrating with external APIs, the validator's <strong>Client mode</strong> is particularly useful. It validates your outgoing requests strictly (catching your mistakes before they hit the wire) whilst validating incoming responses with warnings rather than hard failures. This is a pragmatic design choice: you control your requests, so those should be correct. But you do not control the external API's responses, and you do not want your application to crash because the provider's spec is slightly out of date.</p>

    <pre><code class="language-php">{{SNIPPET:openapi-automatic-code-generation/client-mode-validation.php}}</code></pre>

    <p>The real value surfaces over time. When a provider updates their API and the responses start drifting from the published spec, the validator catches it immediately. Instead of discovering the mismatch weeks later through mysterious bugs in your application, you get clear, specific warnings telling you exactly which fields have changed and how. You can then raise the issue with the provider or adapt your code accordingly.</p>

    <p>The error output is deliberately detailed. Each validation failure includes the JSONPath location of the problem, a reference to the relevant line in the specification, what was expected versus what was received, and a contextual hint for resolution. This makes it straightforward to figure out whether the problem is on your side or theirs.</p>
</section>

<section>
    <h2>Offering Your Own API for External Consumption</h2>

    <p>The other side of the coin is building an API that other teams or external consumers will integrate with. Here, the stakes are higher. Your specification is a public contract, and if your API does not match it, you are the one causing integration headaches for everyone downstream.</p>

    <p>The design-first approach is strongly recommended for APIs you expose externally. Write the OpenAPI specification first, agree on it with your consumers, and then implement the backend to match. The specification becomes the source of truth, and you can generate SDKs for your consumers to use.</p>

    <p>But writing a good spec and implementing it faithfully are two different problems. It is remarkably easy for implementation drift to creep in. A developer adds an extra field to a response that is not in the spec. A nullable field starts returning <code>null</code> when the spec says it is required. An error response uses a different structure than what is documented. Each of these is invisible to your test suite unless you are actively validating against the spec.</p>

    <h3>Strict Validation in Server Mode</h3>

    <p>This is where <a href="https://github.com/LongTermSupport/strict-openapi-validator" target="_blank" rel="noopener">strict-openapi-validator</a> in <strong>Server mode</strong> is invaluable. In this mode, the validator is uncompromising about your responses. Every response your API sends is validated against the specification, and any deviation throws an exception. It also validates the specification itself, catching structural issues in your spec before they reach consumers.</p>

    <pre><code class="language-php">{{SNIPPET:openapi-automatic-code-generation/server-mode-validation.php}}</code></pre>

    <p>The strict typing enforcement is particularly important for APIs consumed across languages. If your spec says a field is an integer but your PHP code returns the string <code>"123"</code>, a JavaScript client might not care, but a Go or Rust client will fail to deserialise. The validator catches this: string <code>"123"</code> is not integer <code>123</code>, full stop, with no type coercion and no silent conversion.</p>

    <h3>Integrating Validation into Your Development Workflow</h3>

    <p>The most effective approach is to run strict-openapi-validator in your test suite. Write integration tests that make real API requests and validate both the request and response against your spec. This catches drift the moment it happens, not after a consumer files a bug report.</p>

    <pre><code class="language-php">{{SNIPPET:openapi-automatic-code-generation/test-suite-validation.php}}</code></pre>

    <p>If your API returns a field that is not in the spec, the test fails. If it omits a required field, the test fails. If a type does not match exactly, the test fails. You find out in CI, not from an angry consumer.</p>

    <p>The validator accumulates all errors before throwing, so you get the complete picture in one test run rather than fixing issues one at a time. And because the error output includes JSONPath locations and spec line references, you can pinpoint the exact source of the problem without digging through layers of code.</p>

    <p>For PHP teams building APIs that others depend on, this combination of OpenAPI code generation and strict validation closes the loop. The specification defines the contract, code generation implements the boilerplate, and strict validation ensures the implementation matches the contract. That leaves no drift, no surprises, and no "it works on my machine" when a consumer reports that your API returns something different from what the docs say.</p>
</section>

<section>
    <h2>The Contract Is the Code</h2>

    <p>OpenAPI code generation is not just a convenience. It changes the development model. Instead of building clients by hand and hoping they stay in sync with the API, you have a single specification that drives everything: documentation, client SDKs, server stubs, request validation, mock servers, and contract tests. When the API changes, you update one YAML file and regenerate. Every consumer gets the update automatically.</p>

    <p>For PHP teams in particular, this is a practical win. You can generate a type-safe client library for any third-party API that publishes an OpenAPI spec, and increasingly, most do. You can publish your own APIs with generated SDKs for every client team, whether they work in TypeScript, Python, Go, or anything else. And you can do it all from a single source of truth that lives in version control right next to your code.</p>

    <p>The specification is the contract. The generated code is the implementation. Keep them in sync and you eliminate an entire class of integration bugs.</p>
</section>`,
  },
  {
    id: 'errors-vs-bugs-the-difference-that-matters',
    title: 'Errors vs Bugs: The Difference That Actually Matters',
    description:
      'An error tells you what went wrong, whilst a bug makes you figure it out yourself - a distinction that shapes how you should write code, handle failures, and think about the cost of debugging.',
    date: '2026-03-11',
    category: CATEGORIES.qa.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'programming',
    heroImage: {
      src: '/images/errors-vs-bugs-the-difference-that-matters/hero.webp',
      alt: 'The Harvard Mark II relay-calculator logbook page for 9 September 1947, with a moth taped in beside the handwritten note "First actual case of bug being found."',
      ogImage: '/images/errors-vs-bugs-the-difference-that-matters/og.jpg',
      creditText:
        'Image: U.S. Naval Historical Center / NHHC, public domain, via Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:First_Computer_Bug,_1947.jpg',
    },
    content: `<div class="intro">
    <p class="lead">Software fails, and that alone is not the interesting part - what matters is <em>how</em> it fails, because not all failures are the same. There is a fundamental distinction between two kinds of failure: <strong>errors</strong> and <strong>bugs</strong>. Most developers use these words interchangeably despite them meaning completely different things. Getting clear on this distinction will change how you write code, how you handle failures, and how much time you spend staring at production logs at two in the morning.</p>
</div>

<section>
    <h2>What Is an Error?</h2>

    <p>An error is a failure that the system knows about: something went wrong, the system detected it, and it told you. You get a message, a location, a stack trace, context. The system is shouting: "This broke, here is where, here is why."</p>

    <p>When you receive an error, you are not so much investigating as <em>responding</em>. The hard work of figuring out what happened has already been done by the code that threw the error in the first place.</p>

    <p>In PHP, the typical mechanism is an exception:</p>

    <pre><code class="language-php">&lt;?php

declare(strict_types=1);

final class PaymentService
{
    public function charge(Order $order): PaymentResult
    {
        if ($order-&gt;getTotal()-&gt;isNegative()) {
            throw new \\InvalidArgumentException(
                sprintf(
                    'Order %s has a negative total: %s',
                    $order-&gt;getId(),
                    $order-&gt;getTotal()-&gt;format()
                )
            );
        }

        try {
            return $this-&gt;gateway-&gt;charge($order-&gt;getTotal());
        } catch (GatewayTimeoutException $e) {
            throw new PaymentFailedException(
                'Payment gateway timed out for order ' . $order-&gt;getId(),
                previous: $e
            );
        }
    }
}</code></pre>

    <p>When this fails, you know what happened. The exception type tells you the category of failure. The message gives you context. The stack trace pinpoints the location. The chained <code>previous</code> exception preserves the original cause. You can fix this in minutes.</p>

    <p>TypeScript has the same pattern:</p>

    <pre><code class="language-typescript">class InvoiceService {
  generate(order: Order): Invoice {
    if (order.items.length === 0) {
      throw new ValidationError(
        'Cannot generate invoice: order has no items',
        { orderId: order.id }
      );
    }

    const total = order.items.reduce(
      (sum, item) =&gt; sum + item.price * item.quantity,
      0
    );

    if (!Number.isFinite(total) || total &lt;= 0) {
      throw new CalculationError(
        'Invoice total is invalid',
        { orderId: order.id, calculatedTotal: total }
      );
    }

    return { orderId: order.id, total, generatedAt: new Date() };
  }
}</code></pre>

    <p>Both examples share the same principle. The developer anticipated what could go wrong, wrote code to detect it, and made sure the failure would be loud and specific. That is an error. It is a known, anticipated failure mode, and dealing with it is straightforward.</p>
</section>

<section>
    <h2>Think About It Like a Car</h2>

    <p>You are driving and the oil warning light comes on. You know immediately what the problem is: oil pressure is low. You know why the light triggered. You know what to do about it. Pull over, check the oil, top it up or call for service. The warning system did its job. The problem was detected, reported, and you can act on it.</p>

    <p>That is an error.</p>

    <p>Now imagine something different. Over the past few weeks, your car has been losing power gradually. Fuel consumption is creeping up. Sometimes the engine hesitates when you accelerate. There is no warning light. No diagnostic code. Just a vague sense that something is not right. You take it to a mechanic and they start investigating. Could be the fuel injectors, the catalytic converter, an air leak in the intake manifold, or a dozen other things. That process of diagnosis, elimination, and detective work is expensive and slow.</p>

    <p>That is a bug.</p>

    <p>The oil light gave you everything you needed. The mystery power loss gave you nothing except a symptom. The distinction between these two experiences is the distinction between errors and bugs in software.</p>
</section>

<section>
    <h2>What Is a Bug?</h2>

    <p>A bug is something that has gone wrong, but the system has no idea: no exception is thrown, no warning is logged, and the code runs to completion and produces a result. The problem is that the result is <em>wrong</em>, and nobody knows until the consequences surface as <strong>symptoms</strong> somewhere else entirely, possibly weeks later.</p>

    <p>You never find a bug directly, only symptoms, and then you have to work backwards to figure out the cause. That is bug fixing, and it is one of the most expensive activities in software development.</p>

    <p>Here is a PHP example. See if you can spot it:</p>

    <pre><code class="language-php">&lt;?php

declare(strict_types=1);

final class DiscountCalculator
{
    public function applyDiscount(Money $price, int $discountPercent): Money
    {
        $multiplier = (100 - $discountPercent) / 100;

        return $price-&gt;multiply($multiplier);
    }
}</code></pre>

    <p>This code runs without complaint. No exceptions. Static analysis probably will not flag it. But nothing stops <code>$discountPercent</code> from being 150, the result of a stacked-discount calculation gone wrong upstream, or a plain data entry error. <code>(100 - 150) / 100</code> evaluates to <code>-0.5</code>, and <code>$price-&gt;multiply(-0.5)</code> silently returns a negative <code>Money</code> value. No exception, no warning. The system now pays the customer instead of charging them, and processes the order with absolutely no indication that anything is wrong.</p>

    <p>What is the symptom? Maybe a finance report three weeks later showing revenue has collapsed, maybe a customer support ticket from someone puzzled about being charged nothing, or maybe just an inventory anomaly nobody can immediately explain. The symptom appears far from the cause, separated by time and layers of code, and the investigation to connect the two is where the real cost lives.</p>

    <p>Here is a TypeScript example with the same dynamic:</p>

    <pre><code class="language-typescript">interface UserPreferences {
  theme: 'light' | 'dark';
  notifications: boolean;
  language: string;
}

function mergePreferences(
  defaults: UserPreferences,
  overrides: Partial&lt;UserPreferences&gt;
): UserPreferences {
  return { ...defaults, ...overrides };
}

// In an API handler:
app.put('/preferences', (req, res) =&gt; {
  const updated = mergePreferences(defaults, req.body);
  savePreferences(user.id, updated);
  res.json(updated);
});</code></pre>

    <p>No runtime error. TypeScript is satisfied at compile time. But <code>req.body</code> can contain anything, <code>{ theme: "rainbow", isAdmin: true }</code> included, and the spread operator will blindly merge it all. There is no validation at the system boundary. Data gets silently corrupted, and you will not discover it until some other part of the system tries to use those preferences and encounters values it does not expect.</p>
</section>

<section>
    <h2>Why the Distinction Matters: Cost</h2>

    <p>The difference between errors and bugs is financial rather than academic, because they have fundamentally different cost profiles.</p>

    <p>When an error fires in production:</p>

    <ol>
        <li>An alert triggers (seconds)</li>
        <li>A developer reads the message and stack trace (minutes)</li>
        <li>The developer understands the cause (minutes)</li>
        <li>A fix is written and deployed (minutes to hours)</li>
    </ol>

    <p>When a bug surfaces as a symptom in production:</p>

    <ol>
        <li>Someone notices something seems "off" (days to weeks)</li>
        <li>The symptom gets reported and triaged (hours)</li>
        <li>A developer tries to reproduce it (hours)</li>
        <li>The developer traces the symptom back through layers of code to find the cause (hours to days)</li>
        <li>A fix is written that addresses the root cause, not just the symptom (hours)</li>
        <li>The blast radius is assessed: what else did this affect? (hours)</li>
        <li>Data cleanup and remediation, if needed (hours to days)</li>
    </ol>

    <p>The error took minutes to resolve, whilst the bug took days or weeks and had a much longer window to cause damage because nobody knew it was there. The error was a fire alarm; the bug was a slow gas leak.</p>
</section>

<section>
    <h2>Converting Bugs into Errors</h2>

    <p>Once you see the cost difference clearly, the strategic conclusion is obvious: <strong>convert potential bugs into errors wherever you can</strong>. Every check, assertion, type constraint, and validation you add is taking a silent failure and making it loud. You are moving problems from the "bug" column into the "error" column, where they cost orders of magnitude less to deal with.</p>

    <p>This is not defensive programming for its own sake. It is a deliberate economic decision.</p>

    <h3>Strict Typing</h3>

    <p>PHP's <code>declare(strict_types=1)</code> converts silent type coercion into TypeErrors:</p>

    <pre><code class="language-php">&lt;?php

// Without strict_types: a bug
function calculateTax(float $amount, float $rate): float
{
    return $amount * $rate;
}

calculateTax("not a number", 0.2);
// PHP coerces the string to 0.0, returns 0.0
// No warning. No exception. Just wrong.

// With strict_types: an error
declare(strict_types=1);

calculateTax("not a number", 0.2);
// TypeError: Argument #1 must be of type float, string given
// Exact location. Exact cause. Fixed in minutes.</code></pre>

    <p>TypeScript's <code>strict: true</code> achieves the same thing at compile time. The point is language-agnostic: stricter type systems turn silent bugs into loud errors.</p>

    <h3>Value Objects and Domain Assertions</h3>

    <p>The unclamped-percentage bug from the discount calculator can be made impossible with a value object:</p>

    <pre><code class="language-php">&lt;?php

declare(strict_types=1);

final class Percentage
{
    public function __construct(
        public readonly float $value
    ) {
        if ($value &lt; 0.0 || $value &gt; 100.0) {
            throw new \\DomainException(
                sprintf('Percentage must be between 0 and 100, got %f', $value)
            );
        }
    }

    public function asMultiplier(): float
    {
        return (100.0 - $this-&gt;value) / 100.0;
    }
}

final class DiscountCalculator
{
    public function applyDiscount(Money $price, Percentage $discount): Money
    {
        return $price-&gt;multiply($discount-&gt;asMultiplier());
    }
}</code></pre>

    <p>The original bug is now structurally impossible. The <code>Percentage</code> value object guarantees float arithmetic and validates the range at construction time. Pass in <code>new Percentage(150)</code> and you get a <code>DomainException</code>: an error, not a bug.</p>

    <h3>Boundary Validation</h3>

    <p>The TypeScript preferences bug disappears once you validate at the system boundary:</p>

    <pre><code class="language-typescript">import { z } from 'zod';

const PreferencesSchema = z.object({
  theme: z.enum(['light', 'dark']).optional(),
  notifications: z.boolean().optional(),
  language: z.string().min(2).max(10).optional(),
}).strict();

app.put('/preferences', (req, res) =&gt; {
  const parsed = PreferencesSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: 'Invalid preferences',
      errors: parsed.error.issues,
    });
  }

  const updated = mergePreferences(defaults, parsed.data);
  savePreferences(user.id, updated);
  res.json(updated);
});</code></pre>

    <p>The <code>.strict()</code> modifier rejects unknown fields. Someone sending <code>{ isAdmin: true }</code> now gets a 400 response with a clear message, not silent data corruption. The bug has been converted into an error.</p>
</section>

<section>
    <h2>Static Analysis: Errors Before Runtime</h2>

    <p>The ultimate form of bug-to-error conversion happens before the code runs at all. Static analysis tools move bugs from "symptom in production" all the way to "red underline in your editor".</p>

    <pre><code class="language-php">&lt;?php

declare(strict_types=1);

// PHPStan catches this:
function findUser(array $users, string $email): User
{
    foreach ($users as $user) {
        if ($user-&gt;getEmail() === $email) {
            return $user;
        }
    }
    // PHPStan: Method findUser() should return User
    //          but return statement is missing.
    // Without PHPStan, this is only caught the first time this path
    // executes in production: a TypeError, but a late one.
    // With PHPStan, it is caught at development time, before it ships.
}</code></pre>

    <pre><code class="language-typescript">// @typescript-eslint/switch-exhaustiveness-check
type Status = 'pending' | 'active' | 'cancelled';

function getStatusLabel(status: Status): string {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'active':
      return 'Active';
    // ESLint: Switch is not exhaustive.
    // Missing case: 'cancelled'
  }
}</code></pre>

    <p>Every static analysis rule you enable is another class of bug that gets promoted to an error before it can ever reach a user. PHPStan, Psalm, ESLint and TypeScript strict mode all serve the same purpose. They turn silent wrongness into loud complaints.</p>
</section>

<section>
    <h2>Fail Fast: The Only Sane Response</h2>

    <p>Once you understand the cost difference between errors and bugs, there is really only one rational strategy: <strong>fail fast</strong>. The moment something is wrong, stop - throw an exception, return an error, refuse to continue, and do not try to soldier on in a semi-broken state hoping things will work out.</p>

    <p>A system that fails fast converts every problem into an error, whilst a system that tries to be "resilient" by swallowing failures and pressing on converts every problem into a bug. The first is cheap to operate; the second is a minefield.</p>

    <p>Consider what happens when you catch an exception and silently continue:</p>

    <pre><code class="language-php">&lt;?php

declare(strict_types=1);

// This is a bug factory
function loadConfig(string $path): array
{
    try {
        return json_decode(
            file_get_contents($path),
            true,
            512,
            JSON_THROW_ON_ERROR
        );
    } catch (\\Throwable) {
        return []; // "graceful" fallback
    }
}</code></pre>

    <p>This code looks defensive and safe, but it is neither. When the config file is missing or malformed, the system continues running with an empty config. No error is raised. No alert fires. The application just quietly behaves differently from what you expect, and you have no idea why. You have taken a perfectly good error and turned it back into a bug.</p>

    <p>The fail-fast version is better in every way:</p>

    <pre><code class="language-php">&lt;?php

declare(strict_types=1);

function loadConfig(string $path): array
{
    if (!is_file($path)) {
        throw new \\RuntimeException(
            sprintf('Config file not found: %s', $path)
        );
    }

    $contents = file_get_contents($path);
    if ($contents === false) {
        throw new \\RuntimeException(
            sprintf('Failed to read config file: %s', $path)
        );
    }

    return json_decode($contents, true, 512, JSON_THROW_ON_ERROR);
}</code></pre>

    <p>If anything is wrong, you know about it immediately. There is no window of time where the system runs in a broken state accumulating invisible damage. The failure is loud, specific, and caught within seconds of deployment.</p>

    <p>The same principle applies everywhere. If a database query returns unexpected data, do not patch it up and continue; if an API response is missing a required field, do not substitute a default; if a configuration value is outside its valid range, do not clamp it silently. Every one of these "helpful" fallbacks is a bug waiting to happen, and every one of them trades a cheap, obvious error now for an expensive, mysterious investigation later.</p>

    <p>Fail fast is about being honest rather than fragile. A system that crashes when something is wrong is telling you the truth, whilst a system that limps along pretending everything is fine is lying to you, and you will pay for that lie eventually.</p>
</section>

<section>
    <h2>Design for the Failure You'll Actually Get</h2>

    <p>Once you internalise the error vs bug distinction, it changes how you think about every line of code you write. Error handling stops looking like defensive overhead and starts looking like an investment that pays for itself many times over.</p>

    <p>The goal is not to write code that never fails. That is impossible and not even desirable. The goal is to write code that <strong>fails loudly, clearly, and early</strong>. A system full of well-crafted errors stays cheap to operate, whilst a system full of silent bugs rots slowly and invisibly, and every rotten piece is a future investigation waiting to consume someone's week.</p>

    <p>The question to ask yourself when writing any piece of logic is not "what if this fails?" It is: "if this fails silently, how long before anyone notices, and how much damage will it do in the meantime?" If the answer makes you uncomfortable, add a check. Turn that potential bug into an error. Your future self will thank you for it.</p>
</section>
`,
  },
  {
    id: 'ansible-vault-strings-vs-file-encryption',
    title: 'Stop Encrypting Entire Files with Ansible Vault. Use Vault Strings Instead.',
    description:
      'Ansible Vault file encryption creates opaque blobs that break git diffs, block code review, and resist AI tooling. Vault encrypted strings keep your keys visible and your values safe, making them a strictly better workflow for infrastructure secrets.',
    date: '2026-03-03',
    category: CATEGORIES.infrastructure.id,
    heroImage: {
      src: '/images/ansible-vault-strings-vs-file-encryption/hero.webp',
      alt: 'A 1914 Diebold bank vault door swung open, showing its inner locking mechanism of meshing drive gears and bolt-work beside a barred security gate',
      ogImage: '/images/ansible-vault-strings-vs-file-encryption/og.jpg',
      creditText:
        'Image: Historic American Buildings Survey, National Park Service, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Looking_east,_1914_Diebold_vault_door,_open_-_City_Post_Office,_2_Massachusetts_Avenue,_Northwest,_Washington,_District_of_Columbia,_DC_HABS_DC,WASH,587-153.tif',
    },
    readingTime: 15,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'ansible',
    content: `<div class="intro">
    <p class="lead">Ansible Vault is the built-in answer to a real problem: you need secrets in your infrastructure code, and you can't commit plaintext passwords to git. But the way most teams use Vault, encrypting entire files, creates more problems than it solves. Since Ansible 2.3, there's been a better option: encrypting individual variable values with <code>ansible-vault encrypt_string</code>. Vault strings are the correct default, and file-level encryption should be treated as a legacy pattern.</p>
</div>

<section>
    <h2>Two Approaches to the Same Problem</h2>

    <p>Ansible Vault offers two distinct encryption strategies, and the difference between them isn't cosmetic - it fundamentally changes how you work with secrets across your entire development lifecycle.</p>

    <h3>File-Level Encryption</h3>

    <p>The original approach. You run <code>ansible-vault encrypt secrets.yml</code> and the entire file becomes an encrypted blob. Every byte of content, including variable names, values, comments, and formatting, is replaced with ciphertext. The file header identifies it as vault-encrypted, and everything below that header is opaque.</p>

    <p>Here's what a vault-encrypted file actually looks like in your repository:</p>

    <pre><code class="language-yaml">$ANSIBLE_VAULT;1.1;AES256
36353031653464376538653338663731313066653839383139656138313334326638
62316535623834653238393064306536653565366131633064643539643830633365
31393865323135353332363336653432626233356339313035323665643465336261
63653261343139393132653134633739313535343935376365393762363137363936
38343462613864663965393662333063363665303635393362303431383537303038
35633937653562623464613930666332653766393563633035313534303934363264
61383661336365623165646264633633366533653338633738363031363366363639
30376164656261623561636135353432633462636234353230383466376439376461
38653638323336366163383337636435316366393766323030316133333462356465
33386262333432653261633632633633363833363034623234396235336530376565</code></pre>

    <p>That is your variables file, and good luck reviewing it.</p>

    <h3>Variable-Level Encryption (Vault Strings)</h3>

    <p>Introduced in Ansible 2.3, <code>encrypt_string</code> encrypts individual values whilst leaving variable names in plaintext. The encrypted value is embedded directly in your YAML using the <code>!vault |</code> tag. Only the sensitive data is encrypted. The structure, the keys, and any non-sensitive values remain perfectly readable.</p>

    <pre><code class="language-yaml"># group_vars/production/main.yml
---
app_name: my-application
app_environment: production
app_debug: false
app_port: 8080

db_host: db-prod-primary.internal
db_port: 5432
db_name: app_production
db_user: app_service
db_password: !vault |
    $ANSIBLE_VAULT;1.1;AES256
    61626364656667686970716b6c6d6e6f70717273747576
    77787980818283848586878889909192939495969798
    99303132333435363738394041424344454647484950

api_secret_key: !vault |
    $ANSIBLE_VAULT;1.1;AES256
    31323334353637383930313233343536373839303132
    33343536373839303132333435363738393031323334
    35363738393031323334353637383930313233343536

redis_host: redis-prod.internal
redis_port: 6379</code></pre>

    <p>Look at the difference: you can see exactly what this file configures, right down to the database host, the port, and the application settings. The only things you can't see are the actual password and the API key, which is precisely the security boundary you want.</p>
</section>

<section>
    <h2>The Case Against File-Level Encryption</h2>

    <p>File-level encryption costs you more than convenience: it actively harms four aspects of modern infrastructure development, namely safety, reviewability, searchability, and AI-assisted workflows.</p>

    <h3>The Decrypt-Edit-Re-encrypt Workflow Is Dangerous</h3>

    <p>To edit a vault-encrypted file, the standard workflow is:</p>

    <pre><code class="language-bash"># Step 1: Decrypt the file
ansible-vault decrypt group_vars/production/vault.yml

# Step 2: Edit it
vim group_vars/production/vault.yml

# Step 3: Re-encrypt it
ansible-vault encrypt group_vars/production/vault.yml</code></pre>

    <p>If step 3 fails, is interrupted, or is simply forgotten, you've got plaintext secrets sitting in your working directory. One careless <code>git add -A</code> and those secrets are in your commit history forever. Yes, you can use <code>ansible-vault edit</code> to combine these steps, and yes, you can set up pre-commit hooks to catch unencrypted vault files. But these are guardrails bolted onto a fundamentally fragile process. The underlying workflow requires you to temporarily put secrets into plaintext. Any process that relies on "don't forget to re-encrypt" is a process that will eventually fail.</p>

    <div style="background: #fef2f2; border-left: 4px solid #dc2626; padding: 1.25rem 1.5rem; margin: 1.5rem 0; border-radius: 0.375rem;">
        <p style="font-weight: 700; color: #991b1b; margin: 0 0 0.5rem 0;">Secrets committed to git are there forever</p>
        <p style="color: #7f1d1d; margin: 0;">Deleting a file or overwriting a value does not remove it from git history. Anyone with access to the repository can recover every version of every file ever committed. If a plaintext secret hits a commit, even briefly, the only safe remediation is to rotate that secret immediately. Tools like <code>git filter-branch</code> or BFG Repo-Cleaner can rewrite history, but they require force-pushing to every remote and every clone. On a public repository, you must assume the secret has already been scraped. There is no undo.</p>
    </div>

    <p>Pre-commit hooks are often cited as the solution here, but they're a band-aid: they catch the mistake after it's already happened in the working directory, they don't prevent the plaintext from existing in the first place, and they only work if every developer on the team has them installed and hasn't bypassed them with <code>--no-verify</code>.</p>

    <h3>Completely Opaque in Git</h3>

    <p>When someone changes a variable in a vault-encrypted file and opens a pull request, here's what the reviewer sees:</p>

    <pre><code class="language-bash">$ git diff HEAD~1 -- group_vars/production/vault.yml
diff --git a/group_vars/production/vault.yml b/group_vars/production/vault.yml
index 3a7b2c1..8f4e9d2 100644
--- a/group_vars/production/vault.yml
+++ b/group_vars/production/vault.yml
@@ -1,10 +1,10 @@
 $ANSIBLE_VAULT;1.1;AES256
-36353031653464376538653338663731313066653839383139656138313334326638
-62316535623834653238393064306536653565366131633064643539643830633365
-31393865323135353332363336653432626233356339313035323665643465336261
+39323134653938373635343231393837363534333231393837363534333231393837
+36353433323139383736353433323139383736353433323139383736353433323139
+38373635343332313938373635343332313938373635343332313938373635343332</code></pre>

    <p>What changed? A password, an API key, a database hostname, a comment? There's no way to tell, which makes code review effectively impossible. The reviewer has to either trust the author blindly or decrypt the file locally, diff the plaintext, and hope nothing else changed that they missed.</p>

    <p>Git's <code>textconv</code> feature can be configured to decrypt vault files for local diffs, but it only works in the CLI. It doesn't work on GitHub, GitLab, or any web-based PR review interface. Since most teams review pull requests in their browser, <code>textconv</code> solves the problem in exactly the place where nobody is looking.</p>

    <p>Merge conflicts are even worse. Two engineers change different variables in the same vault file, and git can't merge encrypted blobs. The resolution process is: decrypt both versions, perform the three-way merge on plaintext, then re-encrypt. You're back to the dangerous decrypt-edit-re-encrypt dance, but now with added merge complexity.</p>

    <h3>Unsearchable</h3>

    <p>You can't <code>grep</code> for anything inside a vault-encrypted file. Variable names are hidden alongside their values. If you need to find where <code>db_password</code> is defined across your inventory, you have to decrypt every vault file first. The alternative is maintaining a separate, unencrypted reference file that lists the variable names. That's the official Ansible recommendation, and it's an admission that full-file encryption breaks basic discoverability.</p>

    <h3>Opaque to AI Tooling</h3>

    <p>This point didn't matter five years ago, but it matters enormously now. LLM-based coding assistants, whether Claude, Copilot, or anything else, are increasingly part of the infrastructure engineering workflow. They can review Ansible playbooks, suggest improvements, catch misconfigurations, and help refactor variable structures.</p>

    <p>But they can't do any of this if the variables file is an encrypted blob. A vault-encrypted file is a solid wall to any AI tool. It can't see the variable names, can't understand the structure, and can't offer any meaningful assistance. You've eliminated an entire category of tooling from your workflow for zero additional security benefit over vault strings.</p>
</section>

<section>
    <h2>The Case for Vault Strings</h2>

    <p>Vault strings solve every one of these problems by placing the encryption boundary exactly where it belongs: around the secret values, and nowhere else.</p>

    <h3>Plaintext Keys, Encrypted Values</h3>

    <p>This is the core ergonomic win. Variable names stay in plaintext because variable names aren't secrets. When was the last time you needed to search your codebase for a password <em>by its value</em>? Never. You search for <code>db_password</code> or <code>api_secret_key</code>. You search by key name, and vault strings let you do exactly that.</p>

    <pre><code class="language-bash"># This works perfectly with vault strings
$ grep -r "db_password" group_vars/
group_vars/production/main.yml:db_password: !vault |
group_vars/staging/main.yml:db_password: !vault |

# This tells you nothing with file-level encryption
$ grep -r "db_password" group_vars/
# (no output: the variable name is encrypted too)</code></pre>

    <h3>Values Stay Encrypted Throughout Development</h3>

    <p>With vault strings, sensitive values are never decrypted during development, during git operations, or during code review. They're only decrypted at Ansible runtime, when a playbook actually needs them. There's no decrypt-edit-re-encrypt cycle, and no window where plaintext secrets exist in your working directory.</p>

    <p>To change a vault string, you generate a new encrypted value and paste it in:</p>

    <pre><code class="language-bash"># Encrypt a new value
$ ansible-vault encrypt_string 'new-super-secret-password' --name 'db_password'
Encryption successful
db_password: !vault |
    $ANSIBLE_VAULT;1.1;AES256
    35363738393031323334353637383930313233343536373839303132333435363738
    39303132333435363738393031323334353637383930313233343536373839303132
    33343536373839303132333435363738393031323334353637383930313233343536</code></pre>

    <p>You copy that output, replace the old encrypted block in your YAML file, and commit. At no point does the old secret exist in plaintext in your working directory, and no file is ever fully decrypted. That's a substantial safety improvement, not a marginal one: it eliminates an entire class of accidental exposure.</p>

    <h3>Git Diffs That Actually Tell You Something</h3>

    <p>When a vault string changes in a pull request, the diff is genuinely useful:</p>

    <pre><code class="language-bash">$ git diff HEAD~1 -- group_vars/production/main.yml
diff --git a/group_vars/production/main.yml b/group_vars/production/main.yml
index 7c3a1b2..9d5e4f6 100644
--- a/group_vars/production/main.yml
+++ b/group_vars/production/main.yml
@@ -12,9 +12,9 @@
 db_name: app_production
 db_user: app_service
 db_password: !vault |
-    $ANSIBLE_VAULT;1.1;AES256
-    61626364656667686970716b6c6d6e6f70717273747576
-    77787980818283848586878889909192939495969798
+    $ANSIBLE_VAULT;1.1;AES256
+    39323134653938373635343231393837363534333231
+    39383736353433323139383736353433323139383736</code></pre>

    <p>You can't see the new password, and you don't need to. What the diff tells you is: "the <code>db_password</code> variable was changed, nothing else was modified." That's exactly the information a reviewer needs. They can see what changed conceptually, verify that no other variables were accidentally modified, and approve the PR with confidence.</p>

    <h3>Compatible with AI-Assisted Development</h3>

    <p>An LLM reading a vault-string file can see the complete structure of your infrastructure variables. It knows what secrets exist, how they are named, which services they belong to, and how they relate to each other. It can suggest renaming <code>db_pass</code> to <code>db_password</code> for consistency. It can identify that you have a <code>redis_host</code> but no corresponding <code>redis_password</code>. It can help you refactor your variable hierarchy across environments.</p>

    <p>The encryption boundary is exactly where it should be. The AI can reason about structure and naming without ever seeing a single secret value. That's a meaningful improvement to your workflow, and you get it for free just by choosing vault strings over file encryption.</p>
</section>

<section>
    <h2>Encrypting Strings in Practice</h2>

    <p>The <code>ansible-vault encrypt_string</code> command has a few forms worth knowing about.</p>

    <h3>Basic Usage</h3>

    <pre><code class="language-bash"># Encrypt a string with a password prompt
ansible-vault encrypt_string 'my-secret-value' --name 'variable_name'

# Encrypt from stdin (avoids the secret appearing in shell history)
echo -n 'my-secret-value' | ansible-vault encrypt_string --stdin-name 'variable_name'

# Encrypt using a password file
ansible-vault encrypt_string \\
    --vault-password-file ~/.vault_pass \\
    'my-secret-value' \\
    --name 'variable_name'</code></pre>

    <p>A word of caution: passing the secret directly on the command line leaves it in your shell history. For production use, prefer the <code>--stdin-name</code> approach or use a password file.</p>

    <h3>Vault IDs for Multi-Environment Setups</h3>

    <p>Ansible 2.4 introduced vault IDs, which let you use different encryption passwords for different environments. This is essential for any setup where staging and production secrets shouldn't share an encryption key.</p>

    <pre><code class="language-bash"># Encrypt with a vault ID
ansible-vault encrypt_string \\
    --vault-id production@prompt \\
    'prod-db-password' \\
    --name 'db_password'

# The output includes the vault ID in the header
db_password: !vault |
    $ANSIBLE_VAULT;1.2;AES256;production
    35363738393031323334353637383930313233343536373839303132333435363738
    39303132333435363738393031323334353637383930313233343536373839303132

# Decrypt at runtime with the matching vault ID
ansible-playbook site.yml \\
    --vault-id production@~/.vault_pass_prod \\
    --vault-id staging@~/.vault_pass_staging</code></pre>

    <p>Notice the header changes from <code>$ANSIBLE_VAULT;1.1;AES256</code> to <code>$ANSIBLE_VAULT;1.2;AES256;production</code>. The vault ID label is appended, so Ansible can match the correct password at runtime.</p>

    <h3>Configuring Vault Passwords in ansible.cfg</h3>

    <p>For team workflows, configure vault password sources in <code>ansible.cfg</code> so that nobody has to remember command-line flags:</p>

    <pre><code class="language-bash"># ansible.cfg
[defaults]
vault_identity_list = production@~/.vault_pass_prod, staging@~/.vault_pass_staging</code></pre>

    <p>With this in place, <code>ansible-playbook site.yml</code> picks up the correct passwords automatically.</p>
</section>

<section>
    <h2>What About the Official vars/vault Separation Pattern?</h2>

    <p>The <a href="https://docs.ansible.com/projects/ansible/latest/tips_tricks/ansible_tips_tricks.html">official Ansible documentation</a> recommends an alternative pattern for keeping variable names visible whilst using file-level encryption. The idea is to split each group into two files:</p>

    <pre><code class="language-bash">group_vars/
  production/
    vars.yml          # Unencrypted: references vault_ prefixed variables
    vault.yml         # Fully encrypted: contains actual secret values</code></pre>

    <p>In <code>vars.yml</code>:</p>

    <pre><code class="language-yaml"># group_vars/production/vars.yml (unencrypted)
db_password: "{{ vault_db_password }}"
api_secret_key: "{{ vault_api_secret_key }}"</code></pre>

    <p>In <code>vault.yml</code> (before encryption):</p>

    <pre><code class="language-yaml"># group_vars/production/vault.yml (encrypted with ansible-vault encrypt)
vault_db_password: "actual-secret-password"
vault_api_secret_key: "actual-api-key-value"</code></pre>

    <p>This pattern exists precisely because full-file encryption breaks discoverability. It's Ansible's official admission that encrypting entire files hides too much. But look at the overhead: you now maintain two files per group, with a naming convention (<code>vault_</code> prefix) and Jinja2 indirection for every single secret. Every secret requires a variable in <code>vars.yml</code> that references a variable in <code>vault.yml</code>. Add a new secret and you have to update both files. Rename a variable and you have to update both files.</p>

    <p>Vault strings eliminate this indirection entirely: one file, one variable, one place to look, with the variable name visible because it is not encrypted and the value encrypted because it is a secret. There's no duplication and no <code>vault_</code> prefix convention to remember.</p>
</section>

<section>
    <h2>The Rekey Trade-off (and How to Solve It)</h2>

    <p>The one genuine limitation of vault strings that people raise is that <code>ansible-vault rekey</code> doesn't work with them.</p>

    <p>With file-level encryption, rekeying is a single command:</p>

    <pre><code class="language-bash"># Rekey an entire encrypted file
ansible-vault rekey group_vars/production/vault.yml</code></pre>

    <p>With vault strings, there's no built-in rekey command. To rotate your vault password, you have to re-encrypt each individual string with the new password. For a handful of secrets this is a minor inconvenience. For a large inventory with dozens of encrypted strings across many files, it would be genuinely tedious to do by hand.</p>

    <p>The key word there is "would be," because this is a solved problem: the <a href="https://github.com/LongTermSupport/ansible-role-vault-scripts" target="_blank" rel="noopener">LongTermSupport/ansible-role-vault-scripts</a> Ansible role includes a <code>rekeyVaultFile.bash</code> script that automates the entire process. It reads each encrypted variable from a file, decrypts it with the old key, re-encrypts it with the new key, and writes a new file. You run one command per file and the rotation is done:</p>

    <pre><code class="language-bash"># Rekey all vault files in a single environment
bash shellscripts/vault/rekeyVaultFile.bash \\
    dev \\
    ./vault-pass-dev.secret \\
    dev \\
    ./vault-pass-dev.secret-new \\
    environment/dev/group_vars/all/vault-*</code></pre>

    <p>The script creates new files prefixed with <code>new_</code> so you can verify them before replacing the originals. It isn't destructive by default.</p>

    <p>Password rotation is not a frequent operation on most Ansible-managed infrastructure. The safety and ergonomic benefits of vault strings are felt every single day, on every commit, every PR review, every grep, and every time an AI assistant reads your inventory. Trading a slightly more involved (but infrequent and fully scriptable) rekey process for a dramatically better daily workflow is an easy decision.</p>
</section>

<section>
    <h2>Recommended File Structure</h2>

    <p>With vault strings, your <code>group_vars</code> structure becomes simpler, not more complicated. You don't need the <code>vars</code>/<code>vault</code> file split because there are no fully-encrypted files to hide from:</p>

    <pre><code class="language-bash">inventory/
  group_vars/
    all/
      common.yml              # Shared non-secret config
    production/
      main.yml                # All production vars, secrets as vault strings
      database.yml            # DB-specific vars, passwords as vault strings
    staging/
      main.yml                # All staging vars, secrets as vault strings
      database.yml            # DB-specific vars, passwords as vault strings
  host_vars/
    web-prod-01/
      main.yml                # Host-specific vars with inline vault strings</code></pre>

    <p>Each file is self-contained, with secrets living alongside the configuration they belong to, encrypted at the value level. There's no indirection layer and no separate encrypted file to keep in sync.</p>

    <p>A complete example of a production variables file:</p>

    <pre><code class="language-yaml"># inventory/group_vars/production/main.yml
---
# Application
app_name: my-application
app_environment: production
app_debug: false
app_log_level: warning
app_domain: app.example.com

# Database
db_host: db-prod-primary.internal
db_port: 5432
db_name: app_production
db_user: app_service
db_password: !vault |
    $ANSIBLE_VAULT;1.2;AES256;production
    35363738393031323334353637383930313233343536373839
    30313233343536373839303132333435363738393031323334
    35363738393031323334353637383930313233343536373839

# Redis
redis_host: redis-prod.internal
redis_port: 6379
redis_password: !vault |
    $ANSIBLE_VAULT;1.2;AES256;production
    39323134653938373635343231393837363534333231393837
    36353433323139383736353433323139383736353433323139
    38373635343332313938373635343332313938373635343332

# External APIs
stripe_api_key: !vault |
    $ANSIBLE_VAULT;1.2;AES256;production
    61626364656637383930313233343536373839303132333435
    36373839303132333435363738393031323334353637383930
    31323334353637383930313233343536373839303132333435

monitoring_webhook_url: https://hooks.slack.com/services/T00/B00/xxxxx
backup_s3_bucket: my-app-backups-prod
backup_retention_days: 30</code></pre>

    <p>Readable, greppable, reviewable, AI-parseable, and secure - that is the entire point.</p>
</section>

<section>
    <h2>Tooling: ansible-role-vault-scripts</h2>

    <p>If you're serious about using vault strings at scale, you need tooling. The <a href="https://github.com/LongTermSupport/ansible-role-vault-scripts" target="_blank" rel="noopener">LongTermSupport/ansible-role-vault-scripts</a> role is a collection of shell scripts that automate every common vault string operation. It's packaged as an Ansible role so you can pin a version in your <code>requirements.yml</code> and integrate it directly into your project.</p>

    <p>What the role provides:</p>

    <ul>
        <li><strong>Generate vault secrets</strong>: creates long random vault password files with <code>generateVaultSecret.bash</code></li>
        <li><strong>Create vaulted passwords</strong>: generates a secure random password, encrypts it, and writes it to a variable in one step with <code>createVaultedPassword.bash</code></li>
        <li><strong>Encrypt arbitrary strings</strong>: wraps <code>ansible-vault encrypt_string</code> with environment-aware defaults via <code>createVaultedString.bash</code></li>
        <li><strong>Generate vaulted SSH key pairs</strong>: creates password-protected private/public keys, encrypts all three values (passphrase, private key, public key) as vault strings with <code>createVaultedSshKeyPair.bash</code></li>
        <li><strong>Generate vaulted deploy keys</strong>: passwordless SSH keys for read-only deploy access with <code>createVaultedSshDeployKeyPair.bash</code></li>
        <li><strong>Generate vaulted SSL client certificates</strong>: certificate authority and client certificates, all values encrypted as vault strings with <code>createVaultedSslClientCertificateAndAuth.bash</code></li>
        <li><strong>Rekey vault files</strong>: the <code>rekeyVaultFile.bash</code> script solves the rekey limitation entirely, decrypting with the old key and re-encrypting with the new one</li>
        <li><strong>Dump secrets</strong>: view decrypted values without ever writing plaintext to disk with <code>dumpGroupSecrets.bash</code></li>
        <li><strong>Multi-environment support</strong>: all scripts support environment selection (dev, staging, production) and auto-detect the environment from file paths</li>
    </ul>

    <p>Installation is straightforward. Add it to your <code>requirements.yml</code>:</p>

    <pre><code class="language-yaml"># requirements.yml
- src: https://github.com/LongTermSupport/ansible-role-vault-scripts
  scm: git
  name: lts.vault-scripts
  version: master</code></pre>

    <p>Then symlink the scripts into your project:</p>

    <pre><code class="language-bash">ansible-galaxy install --force --keep-scm-meta \\
    --role-file=requirements.yml \\
    --roles-path=roles

mkdir -p shellscripts
ln -s ../roles/lts.vault-scripts/shellscripts/ shellscripts/vault</code></pre>

    <p>Once installed, creating a new encrypted password is a single command:</p>

    <pre><code class="language-bash"># Generate a random password, encrypt it, and write it to a vars file
bash shellscripts/vault/createVaultedPassword.bash \\
    vault_db_password \\
    ./environment/prod/group_vars/all/vault_database.yml \\
    prod</code></pre>

    <p>Generating vaulted SSH key pairs is equally simple:</p>

    <pre><code class="language-bash"># Generate key pair with encrypted passphrase, private key, and public key
bash shellscripts/vault/createVaultedSshKeyPair.bash \\
    vault_deploy \\
    ops@example.com \\
    ./environment/prod/group_vars/all/vault_ssh_keys.yml \\
    prod</code></pre>

    <p>The point of this tooling is that vault strings shouldn't feel like extra work. With the right scripts, they're actually less work than file-level encryption because you never have to think about decrypt/edit/re-encrypt cycles at all.</p>
</section>

<section>
    <h2>A Practical Migration Path</h2>

    <p>If your team currently uses file-level encryption and wants to migrate, the process is straightforward:</p>

    <pre><code class="language-bash"># 1. Decrypt the existing vault file
ansible-vault decrypt group_vars/production/vault.yml

# 2. For each secret variable, encrypt the value as a string
ansible-vault encrypt_string \\
    --vault-id production@prompt \\
    'the-actual-secret-value' \\
    --name 'db_password'

# 3. Build your new combined vars file with vault strings inline
# 4. Remove the old vault.yml and vars.yml pair
# 5. Commit the new structure</code></pre>

    <p>If you have the <a href="https://github.com/LongTermSupport/ansible-role-vault-scripts" target="_blank" rel="noopener">vault-scripts role</a> installed, you can streamline step 2 using <code>createVaultedString.bash</code> which handles environment detection, vault password lookup, and output formatting automatically.</p>

    <p>If you were using the <code>vars</code>/<code>vault</code> separation pattern, you can merge both files into a single file, replacing the Jinja2 references with inline vault strings. The result is fewer files, less indirection, and a clearer structure.</p>

    <p>Do this one environment at a time. Start with a development or staging environment where the stakes are low, verify that playbook execution works identically, then move to production.</p>
</section>

<section>
    <h2>Summary: Why Vault Strings Win</h2>

    <p>Set the two approaches side by side and there's no contest.</p>

    <table>
        <thead>
            <tr>
                <th>Concern</th>
                <th>File Encryption</th>
                <th>Vault Strings</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Plaintext exposure risk</td>
                <td>Secrets exist in plaintext during editing</td>
                <td>Secrets are never decrypted outside runtime</td>
            </tr>
            <tr>
                <td>Git diffs</td>
                <td>Meaningless encrypted blob</td>
                <td>Key names visible, values encrypted</td>
            </tr>
            <tr>
                <td>Pull request review</td>
                <td>Impossible without local decryption</td>
                <td>Reviewer sees which variable changed</td>
            </tr>
            <tr>
                <td>Merge conflicts</td>
                <td>Decrypt both sides, merge, re-encrypt</td>
                <td>Standard YAML merge (keys are plaintext)</td>
            </tr>
            <tr>
                <td>Searchability</td>
                <td>Cannot grep for variable names</td>
                <td>Full grep and IDE search support</td>
            </tr>
            <tr>
                <td>AI/LLM compatibility</td>
                <td>Completely opaque</td>
                <td>Full structural visibility</td>
            </tr>
            <tr>
                <td>File structure</td>
                <td>Requires vars/vault split or loses discoverability</td>
                <td>Single file per group, self-contained</td>
            </tr>
            <tr>
                <td>Password rotation (rekey)</td>
                <td>Built-in <code>ansible-vault rekey</code></td>
                <td>Scriptable with <a href="https://github.com/LongTermSupport/ansible-role-vault-scripts" target="_blank" rel="noopener">vault-scripts</a> tooling</td>
            </tr>
        </tbody>
    </table>

    <p>File-level encryption used to win on password rotation convenience, but with <a href="https://github.com/LongTermSupport/ansible-role-vault-scripts" target="_blank" rel="noopener">proper tooling</a> that advantage disappears. Vault strings win on safety, reviewability, searchability, tooling compatibility, and structural simplicity.</p>

    <p>The <code>encrypt_string</code> feature has been available since Ansible 2.3. It's not new, it's not experimental, and it's not a niche pattern. It's the way secrets should be managed in Ansible, and I'd encourage any team still encrypting entire files to make the switch.</p>
</section>
`,
  },
  {
    id: 'systemd-timers-modern-cron',
    title: 'systemd Timers: The Modern Alternative to Cron Jobs',
    description:
      'Cron has scheduled Linux tasks for fifty years, but systemd timers offer structured logging, dependency management, security sandboxing, and catch-up execution that cron simply cannot match. A deep dive for engineers running Red Hat, Fedora, and Rocky Linux.',
    date: '2026-02-26',
    category: CATEGORIES.infrastructure.id,
    heroImage: {
      src: '/images/systemd-timers-modern-cron/hero.webp',
      alt: 'The exposed movement of a mechanical clock, showing its balance wheel, gear train, and engraved regulator plate',
      ogImage: '/images/systemd-timers-modern-cron/og.jpg',
      creditText: 'Image: Anonimski, CC0, via Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Reform_clock_movement.JPG',
    },
    readingTime: 14,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'sysadmin',
    content: `<div class="intro">
    <p class="lead">Cron is one of the oldest and most reliable tools in the Unix toolkit. It has been scheduling tasks since the 1970s, and it works, though "works" is doing a lot of heavy lifting there. Cron has no structured logging, no dependency management, no built-in protection against overlapping runs, and zero security isolation. It runs your scripts as your full user with every privilege and capability you possess, with no record of what happened unless you wrote the logging yourself. systemd timers, introduced with systemd and now standard across every major enterprise Linux distribution, solve all of these problems. On Red Hat Enterprise Linux, Rocky Linux, and Fedora, they are already running dozens of system tasks that used to live in crontabs.</p>
</div>

<section>
    <h2>What Cron Actually Gives You</h2>

    <p>Before dismissing cron unfairly, it's worth being precise about what it does well. A crontab entry is five fields of schedule followed by a command. It is universally understood, requires no service files, and can be written in thirty seconds. For a developer who needs to run a script at 3am and never thinks about it again, cron is perfectly adequate.</p>

    <p>The problems emerge at scale and in production. When a cron job fails, the output goes into <code>/dev/null</code>, or to the local mailbox of the running user, which nobody reads. There is no centralised log. There is no way to query "when did this last run and what was its exit code?" without implementing that infrastructure yourself. If the server was off at 3am, the job simply did not run, with no record that it was missed. And if the job takes longer than its schedule interval, cron will cheerfully launch a second (and third) instance alongside the first.</p>

    <p>systemd timers are not a drop-in replacement for cron's syntax. They require two unit files instead of one line. But what you gain is worth the ceremony.</p>
</section>

<section>
    <h2>The Timer + Service Unit Model</h2>

    <p>Every systemd timer consists of exactly two unit files: a <code>.timer</code> unit that defines <em>when</em> to run, and a <code>.service</code> unit that defines <em>what</em> to run. They are linked by name, so <code>backup.timer</code> activates <code>backup.service</code> automatically. You can override this with <code>Unit=</code> in the timer if you need a different pairing.</p>

    <p>The service unit is a perfectly ordinary systemd service. This is the key insight: every hardening directive, every resource limit, every dependency declaration available to long-running services is equally available to timer-activated services. You're not working with a stripped-down scheduler. You have the full systemd service model available to you.</p>

    <p>A minimal example pair:</p>

    <pre><code class="language-bash"># /etc/systemd/system/hello.timer
[Unit]
Description=Say hello every hour

[Timer]
OnCalendar=hourly
Persistent=true

[Install]
WantedBy=timers.target</code></pre>

    <pre><code class="language-bash"># /etc/systemd/system/hello.service
[Unit]
Description=Hello world service

[Service]
Type=oneshot
ExecStart=/usr/local/bin/hello.sh</code></pre>

    <p>After creating both files, activate the timer:</p>

    <pre><code class="language-bash">systemctl daemon-reload
systemctl enable --now hello.timer</code></pre>

    <p>Notice that you enable and start the <em>timer</em>, not the service. The service will be started by the timer on schedule. You can also trigger it manually at any time with <code>systemctl start hello.service</code> for testing.</p>
</section>

<section>
    <h2>Timer Types: When Things Run</h2>

    <p>systemd supports two fundamentally different classes of timer, and understanding the distinction is essential before writing your first unit file.</p>

    <h3>Real-time (Calendar) Timers</h3>

    <p><code>OnCalendar=</code> triggers at a specific wall-clock time, the same way cron does. This is the directive you will use for the vast majority of scheduled tasks: nightly backups, weekly reports, monthly cleanup jobs.</p>

    <pre><code class="language-bash">[Timer]
# Every day at midnight
OnCalendar=daily

# Every Monday at 04:00
OnCalendar=Mon *-*-* 04:00:00

# Every 15 minutes
OnCalendar=*:0/15

# First of each month at 00:00
OnCalendar=*-*-01 00:00:00

# Weekdays at 08:30
OnCalendar=Mon..Fri *-*-* 08:30:00</code></pre>

    <h3>Monotonic Timers</h3>

    <p>Monotonic timers fire relative to an event rather than a point on the clock. They are suitable for tasks that should run a fixed interval after something else happens, not at a specific time of day.</p>

    <pre><code class="language-bash">[Timer]
# 15 minutes after the system boots
OnBootSec=15min

# 1 hour after this timer itself was last activated
OnUnitActiveSec=1h

# 30 minutes after the associated service last finished
OnUnitInactiveSec=30min

# 5 minutes after this timer unit itself started
OnActiveSec=5min</code></pre>

    <p>Monotonic timers stop counting when the system is suspended. If a laptop suspends and resumes, <code>OnUnitActiveSec=1h</code> does not fire because an hour has elapsed on the wall clock. It fires one hour after the timer was last active, which resets on resume.</p>

    <h3>Persistent Timers: Replacing Missed Runs</h3>

    <p><code>Persistent=true</code> instructs systemd to record the last time the timer activated. On next boot, if the scheduled time was missed whilst the system was off, the timer fires immediately. This is the equivalent of <code>anacron</code> behaviour, and it is one line in your timer file rather than a separate tool to install and configure.</p>

    <pre><code class="language-bash">[Timer]
OnCalendar=daily
Persistent=true</code></pre>

    <p>Without <code>Persistent=true</code>, a system that is powered off at midnight every night will never run a <code>daily</code> timer. With it, the task runs shortly after boot on the next morning the system is online.</p>

    <h3>RandomizedDelaySec: Avoiding the Thundering Herd</h3>

    <p>On infrastructure with many machines (or many timers), having everything start simultaneously causes resource contention. <code>RandomizedDelaySec=</code> adds a random jitter up to the specified value:</p>

    <pre><code class="language-bash">[Timer]
OnCalendar=daily
RandomizedDelaySec=1800</code></pre>

    <p>This fires the timer somewhere in a 30-minute window after midnight, distributing load across machines and avoiding simultaneous database hammering. The <code>dnf-automatic</code> timer on RHEL uses exactly this pattern. It is configured with a random delay so that a fleet of servers does not all hit the update mirrors at the same second.</p>
</section>

<section>
    <h2>OnCalendar Syntax: A Deep Dive</h2>

    <p>The <code>OnCalendar=</code> syntax is more expressive than cron's five-field format. The general pattern is:</p>

    <pre><code class="language-bash">DayOfWeek Year-Month-Day Hour:Minute:Second</code></pre>

    <p>Any component can be an asterisk (match all), a range with <code>..</code>, a comma-separated list, or a step value with <code>/</code>. Named shorthands exist for common schedules:</p>

    <pre><code class="language-bash"># Named shorthands
hourly      # *-*-* *:00:00
daily       # *-*-* 00:00:00
weekly      # Mon *-*-* 00:00:00
monthly     # *-*-01 00:00:00
yearly      # *-01-01 00:00:00
quarterly   # *-01,04,07,10-01 00:00:00
semiannually # *-01,07-01 00:00:00</code></pre>

    <pre><code class="language-bash"># More precise expressions
# Every 15 minutes
*:0/15

# Every hour on the half-hour
*:30

# 2am on the 1st of January, April, July, October
*-01,04,07,10-01 02:00:00

# Weekdays between 09:00 and 17:00, every 30 minutes
Mon..Fri *-*-* 09:00/30:00

# Multiple OnCalendar lines: weekdays at 22:30, weekends at 20:00
OnCalendar=Mon..Fri 22:30
OnCalendar=Sat,Sun 20:00

# A specific date (useful for one-off timers that self-disable)
2026-03-01 00:00:00</code></pre>

    <h3>Validating Expressions with systemd-analyze</h3>

    <p>Before deploying a timer, always validate the expression. <code>systemd-analyze calendar</code> parses the expression, normalises it, and shows you the next several trigger times:</p>

    <pre><code class="language-bash">$ systemd-analyze calendar "Mon..Fri *-*-* 08:30:00"
  Original form: Mon..Fri *-*-* 08:30:00
Normalized form: Mon..Fri *-*-* 08:30:00
    Next elapse: Mon 2026-03-02 08:30:00 GMT
       (in UTC): Mon 2026-03-02 08:30:00 UTC
       From now: 3 days 21h left

$ systemd-analyze calendar "*:0/15"
  Original form: *:0/15
Normalized form: *-*-* *:00/15:00
    Next elapse: Thu 2026-02-26 11:15:00 GMT
       (in UTC): Thu 2026-02-26 11:15:00 UTC
       From now: 14min left</code></pre>

    <p>The "Normalized form" output is what systemd actually interprets. If it doesn't match your intention, adjust your expression before committing it to a unit file. This one command prevents an entire category of "why is my timer not running?" debugging sessions.</p>
</section>

<section>
    <h2>System-Level Timers: Running as Root</h2>

    <p>System-level timer units live in <code>/etc/systemd/system/</code> (for locally created units) or <code>/usr/lib/systemd/system/</code> (for units shipped by packages). The <code>/etc/systemd/system/</code> path takes precedence over the package-supplied path, which is how you override vendor defaults without editing package files. This matters on RHEL and Rocky Linux, where packages may be updated by DNF.</p>

    <p>The full lifecycle for a system timer:</p>

    <pre><code class="language-bash"># After creating or editing unit files
systemctl daemon-reload

# Enable (start at boot) and start immediately
systemctl enable --now mytask.timer

# Check timer status and next trigger time
systemctl status mytask.timer

# List all active timers with next/last run times
systemctl list-timers

# List ALL timers including inactive ones
systemctl list-timers --all

# Trigger the service immediately without waiting for the timer
systemctl start mytask.service

# View logs for the service
journalctl -u mytask.service

# Follow logs in real time
journalctl -u mytask.service -f

# Show logs from the last run only
journalctl -u mytask.service --since today</code></pre>

    <p>The <code>systemctl list-timers</code> output is one of the most immediately useful commands when inheriting a server. It shows every timer, when it last fired, when it will next fire, and what service it triggers. None of that is available with <code>crontab -l</code>.</p>
</section>

<section>
    <h2>User-Level Timers: Running Without Root</h2>

    <p>systemd has a full per-user instance that runs independently of the system manager. User timers live in <code>~/.config/systemd/user/</code> and are managed with the <code>--user</code> flag on <code>systemctl</code>. They run as the owning user with no elevated privileges required.</p>

    <pre><code class="language-bash"># ~/.config/systemd/user/sync-files.timer
[Unit]
Description=Sync files every 6 hours

[Timer]
OnCalendar=*-*-* 00,06,12,18:00:00
Persistent=true

[Install]
WantedBy=timers.target</code></pre>

    <pre><code class="language-bash"># ~/.config/systemd/user/sync-files.service
[Unit]
Description=Sync files to remote

[Service]
Type=oneshot
ExecStart=/home/deploy/bin/sync-files.sh</code></pre>

    <pre><code class="language-bash"># Reload and enable the user timer
systemctl --user daemon-reload
systemctl --user enable --now sync-files.timer

# Check status
systemctl --user status sync-files.timer

# View logs
journalctl --user -u sync-files.service</code></pre>

    <h3>loginctl enable-linger: The Critical Server Setting</h3>

    <p>By default, the systemd user instance for a given user only runs whilst that user has an active login session. Log out and your user timers stop. On a server where you deploy an application as a non-root service account, this makes user timers seemingly useless, because the deploy user has no interactive session.</p>

    <p>The solution is <code>loginctl enable-linger</code>. This instructs systemd to start the user instance at boot and keep it running indefinitely, regardless of whether the user is logged in:</p>

    <pre><code class="language-bash"># Enable lingering for a specific user (run as root)
loginctl enable-linger deploy

# Verify lingering is enabled
loginctl show-user deploy | grep Linger
# Linger=yes

# Or check the linger directory directly
ls /var/lib/systemd/linger/
# deploy</code></pre>

    <p>Once linger is enabled for the <code>deploy</code> user, that user's timers in <code>~/.config/systemd/user/</code> will run on schedule even when nobody is logged in. This is the correct way to run application-level scheduled tasks as a non-root service account on a server, rather than by adding entries to root's crontab or using <code>sudo</code>.</p>

    <p>One important caveat: the user systemd instance does not inherit environment variables from <code>.bashrc</code> or <code>.profile</code>. Set any required environment variables explicitly in the <code>[Service]</code> section with <code>Environment=</code> or <code>EnvironmentFile=</code>.</p>
</section>

<section>
    <h2>Security Hardening: Where systemd Leaves Cron Behind</h2>

    <p>This is the section that should convert any engineer who manages production infrastructure. Cron runs your job as your user, and that's it: no isolation, no restrictions, no sandboxing. If your backup script is compromised, the attacker has every capability and every file permission you have. systemd services support an extensive set of hardening directives that provide genuine defence-in-depth.</p>

    <h3>Privilege Dropping</h3>

    <p>The most basic hardening is running the service as a dedicated, unprivileged user rather than root:</p>

    <pre><code class="language-bash">[Service]
Type=oneshot
User=backup
Group=backup
ExecStart=/usr/local/bin/run-backup.sh</code></pre>

    <p>For tasks that need no persistent user identity at all, <code>DynamicUser=yes</code> creates an ephemeral user at service start and discards it when the service exits. The UID is allocated from a reserved range and never reused concurrently, but it may differ between runs, so it is unsuitable for services that write persistent data owned by a specific UID:</p>

    <pre><code class="language-bash">[Service]
Type=oneshot
DynamicUser=yes
ExecStart=/usr/local/bin/generate-report.sh</code></pre>

    <h3>Filesystem Isolation</h3>

    <pre><code class="language-bash">[Service]
# Mount the entire filesystem hierarchy read-only
ProtectSystem=strict

# Make /home, /root, and /run/user inaccessible
ProtectHome=true

# Give the service its own private /tmp (not shared with other processes)
PrivateTmp=true

# Whitelist specific paths that need to be writable
ReadWritePaths=/var/backups /var/log/myapp</code></pre>

    <p><code>ProtectSystem=strict</code> is the most aggressive option: the entire filesystem is read-only except for <code>/dev</code>, <code>/proc</code>, and <code>/sys</code>. The service can't modify anything on disk unless you explicitly list it in <code>ReadWritePaths=</code>. A compromised backup script cannot write to <code>/etc</code>, install binaries in <code>/usr/local/bin</code>, or tamper with other services' data.</p>

    <h3>Capability Restrictions</h3>

    <pre><code class="language-bash">[Service]
# Prevent the process from gaining new privileges via setuid/setgid
NoNewPrivileges=true

# Drop all capabilities (empty bounding set)
CapabilityBoundingSet=

# If specific capabilities are needed, add only those:
# CapabilityBoundingSet=CAP_NET_BIND_SERVICE
# AmbientCapabilities=CAP_NET_BIND_SERVICE</code></pre>

    <p><code>NoNewPrivileges=true</code> is the single most important hardening directive for any service that does not need to escalate privileges. It prevents <code>execve()</code> from granting new capabilities via setuid bits on executables. Even if the script calls a setuid binary, it cannot gain root through it.</p>

    <h3>Namespace and Kernel Restrictions</h3>

    <pre><code class="language-bash">[Service]
# Prevent creating new namespaces (network, mount, pid, etc.)
RestrictNamespaces=true

# Prevent changing the process execution domain (personality syscall)
LockPersonality=true

# Prevent memory mappings that are both writable and executable
MemoryDenyWriteExecute=true

# Restrict to native system call ABI only (important with SystemCallFilter)
SystemCallArchitectures=native</code></pre>

    <h3>System Call Filtering with seccomp</h3>

    <p><code>SystemCallFilter=</code> uses the kernel's seccomp mechanism to restrict which system calls the service is permitted to make. systemd ships with named call groups that cover common service categories:</p>

    <pre><code class="language-bash">[Service]
# Allow only system calls in the @system-service group
# (covers the calls needed by most well-behaved services)
SystemCallFilter=@system-service

# Deny specific dangerous groups while allowing everything else
# (prefix with ~ to deny rather than allow)
SystemCallFilter=~@debug @mount @reboot @swap @privileged</code></pre>

    <p>Common named groups include <code>@system-service</code>, <code>@network-io</code>, <code>@file-system</code>, <code>@basic-io</code>, <code>@process</code>, <code>@privileged</code>, and <code>@debug</code>. Run <code>systemd-analyze syscall-filter</code> to see what each group contains.</p>

    <h3>Network Restriction</h3>

    <pre><code class="language-bash">[Service]
# Block all network access (for offline tasks like local backups)
IPAddressDeny=any

# Or allow only specific addresses
IPAddressAllow=10.0.0.0/8
IPAddressDeny=any</code></pre>

    <h3>A Fully Hardened Service Example</h3>

    <pre><code class="language-bash">[Service]
Type=oneshot
User=backup
Group=backup

# Filesystem isolation
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=/var/backups

# Privilege restrictions
NoNewPrivileges=true
CapabilityBoundingSet=

# Kernel hardening
RestrictNamespaces=true
LockPersonality=true
MemoryDenyWriteExecute=true
SystemCallArchitectures=native
SystemCallFilter=@system-service

# No network access needed
IPAddressDeny=any</code></pre>

    <p>Run <code>systemd-analyze security myservice.service</code> to get a scored security report showing which directives are set and which gaps remain. The output assigns an exposure score (0 is fully hardened, higher is less hardened) and explains exactly what each missing directive would protect against.</p>
</section>

<section>
    <h2>Red Hat, Fedora, and Rocky Linux: The Native Ecosystem</h2>

    <p>On RHEL-family systems, systemd timers aren't a curiosity. They are the standard. Several core system functions ship as timer units out of the box, and understanding them is useful both as documentation of the pattern and as a source of real-world examples to learn from.</p>

    <h3>Timers That Ship with RHEL 9 / Rocky Linux 9</h3>

    <pre><code class="language-bash"># List all installed timers, including inactive ones
systemctl list-timers --all

# Key system timers you will find on a fresh RHEL/Rocky install:</code></pre>

    <p><strong>fstrim.timer</strong> runs <code>fstrim -av</code> weekly to discard unused blocks on SSD filesystems. Enabled by default on Rocky Linux 9. The timer uses <code>ConditionVirtualization=!container</code> to skip TRIM inside containers where it has no meaning, and <code>RandomizedDelaySec=6000</code> to spread load across a fleet.</p>

    <p><strong>dnf-makecache.timer</strong> refreshes DNF package metadata periodically. Runs as a system timer, keeping the package cache warm so <code>dnf install</code> commands are fast.</p>

    <p><strong>logrotate.timer</strong> replaces the traditional <code>/etc/cron.daily/logrotate</code> cron entry. Runs daily with a randomised delay. On RHEL 8 this was still a cron job; RHEL 9 ships it as a timer unit.</p>

    <p><strong>updatedb.timer</strong> rebuilds the <code>mlocate</code>/<code>plocate</code> database daily so <code>locate</code> commands stay current.</p>

    <p><strong>systemd-tmpfiles-clean.timer</strong> cleans temporary files per the rules in <code>/etc/tmpfiles.d/</code> and <code>/usr/lib/tmpfiles.d/</code>. Runs daily and on boot. This replaces the old <code>tmpwatch</code> cron job from RHEL 6.</p>

    <h3>dnf-automatic: Automated Security Updates</h3>

    <p>The <code>dnf-automatic</code> package is the RHEL-idiomatic way to automate security updates, and it is a good example of the systemd timer pattern done well. It ships four separate timer units for different update behaviours:</p>

    <pre><code class="language-bash">dnf install dnf-automatic

# Four timer variants, enable exactly one:
# Downloads AND installs security updates
systemctl enable --now dnf-automatic-install.timer

# Downloads updates only, sends notification
systemctl enable --now dnf-automatic-download.timer

# No downloads, sends notification only
systemctl enable --now dnf-automatic-notifyonly.timer

# Installs ALL updates (not just security)
systemctl enable --now dnf-automatic.timer</code></pre>

    <p>To customise the schedule without editing the package-owned unit file, use a drop-in override (the RHEL-correct approach that survives package updates):</p>

    <pre><code class="language-bash">systemctl edit dnf-automatic-install.timer</code></pre>

    <p>This opens an editor and creates <code>/etc/systemd/system/dnf-automatic-install.timer.d/override.conf</code>. Add your overrides:</p>

    <pre><code class="language-bash">[Timer]
OnCalendar=
OnCalendar=*-*-* 03:00:00
RandomizedDelaySec=1800
Persistent=true</code></pre>

    <p>The first <code>OnCalendar=</code> (empty) clears the inherited value before setting the new one. This is necessary when overriding list-type directives in systemd.</p>

    <h3>SELinux Considerations</h3>

    <p>RHEL 9 and Rocky Linux 9 run SELinux in enforcing mode by default. Custom timer-activated services that access files outside their expected context, bind to restricted ports, or interact with other services may trigger AVC denials.</p>

    <p>For most simple scripts placed in standard locations (<code>/usr/local/bin/</code> with correct file permissions), the default <code>unconfined_service_t</code> context applied to user-created systemd services is permissive enough. For services that access sensitive paths or need network access, audit denials and generate a custom policy module:</p>

    <pre><code class="language-bash"># After a denial, check what was blocked
ausearch -m avc -ts recent

# Generate a policy module from the denials
audit2allow -a -M mybackup

# Install the policy
semodule -i mybackup.pp

# Alternatively, set correct file context for a script
semanage fcontext -a -t bin_t "/usr/local/bin/mybackup.sh"
restorecon -v /usr/local/bin/mybackup.sh</code></pre>

    <h3>Network-Dependent Timers</h3>

    <p>Timers that require network connectivity should declare this dependency explicitly. Without it, the service may start before the network is ready and fail silently:</p>

    <pre><code class="language-bash">[Unit]
Description=Sync data to remote server
After=network-online.target
Wants=network-online.target</code></pre>

    <p>On RHEL 9 / Rocky Linux 9 with NetworkManager, <code>network-online.target</code> is reached after NetworkManager has confirmed that at least one network interface is online. By contrast, <code>network.target</code> is weaker: it only guarantees that networking <em>configuration</em> has been applied, not that connectivity exists.</p>

    <h3>RHEL 8 vs RHEL 9 / Rocky 8 vs Rocky 9</h3>

    <p>RHEL 8 and Rocky 8 are fully systemd-based and support all the timer features described in this article. The key differences on RHEL 9 / Rocky 9 are that more system jobs have migrated from cron to timer units (logrotate being the most notable) and <code>cronie</code> is still installed by default but no longer used for most system tasks. The default SELinux policy is also stricter in several areas relevant to service execution. If you are migrating cron jobs on RHEL 8, the timer unit files you write will work unchanged on RHEL 9.</p>
</section>

<section>
    <h2>Preventing Overlapping Execution</h2>

    <p>Cron has no mechanism to prevent a second instance of a job from starting if the first is still running. This is a genuine operational hazard: a backup job that normally takes 20 minutes, triggered at an unusual time by a large dataset, will have a second instance start 60 minutes in if the schedule is hourly. The two instances will then fight over the same files.</p>

    <p>systemd's solution is elegant: set <code>Type=oneshot</code> on the service. A <code>oneshot</code> service is considered "active" from start until the process exits. If the timer fires whilst the previous run is still active, systemd queues the activation rather than launching a second instance.</p>

    <pre><code class="language-bash">[Service]
Type=oneshot
ExecStart=/usr/local/bin/my-task.sh
# No second instance will start while this is still running</code></pre>

    <p>For additional protection, particularly on tasks with external dependencies, <code>ConditionPathExists=</code> can check for a lock file:</p>

    <pre><code class="language-bash">[Unit]
Description=Data processing task
ConditionPathExists=!/var/run/myapp/processing.lock

[Service]
Type=oneshot
ExecStartPre=/usr/bin/touch /var/run/myapp/processing.lock
ExecStart=/usr/local/bin/process-data.sh
ExecStopPost=/usr/bin/rm -f /var/run/myapp/processing.lock</code></pre>

    <p>The <code>!</code> prefix on <code>ConditionPathExists</code> inverts the check: the service only starts if the path does <em>not</em> exist. If the lock file is present (from a previous run that did not clean up), the service start is skipped entirely, and the timer records this as a "condition failed" rather than an error.</p>
</section>

<section>
    <h2>Cron vs systemd Timers: The Comparison</h2>

    <table>
        <thead>
            <tr>
                <th>Feature</th>
                <th>cron</th>
                <th>systemd timers</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Logging</strong></td>
                <td>Local mail or manual redirect to file</td>
                <td>Automatic structured logging via journald; <code>journalctl -u</code></td>
            </tr>
            <tr>
                <td><strong>Missed execution recovery</strong></td>
                <td>None (job simply skipped if system is off)</td>
                <td><code>Persistent=true</code> runs missed jobs on next boot</td>
            </tr>
            <tr>
                <td><strong>Overlapping run prevention</strong></td>
                <td>None built-in; requires flock or custom logic</td>
                <td>Built-in with <code>Type=oneshot</code></td>
            </tr>
            <tr>
                <td><strong>Dependency management</strong></td>
                <td>None</td>
                <td>Full systemd dependency graph: <code>After=</code>, <code>Requires=</code>, <code>Wants=</code></td>
            </tr>
            <tr>
                <td><strong>Security isolation</strong></td>
                <td>None; runs as full user</td>
                <td>Namespaces, seccomp, capability dropping, filesystem isolation</td>
            </tr>
            <tr>
                <td><strong>User-level timers on servers</strong></td>
                <td>Yes, via user crontab</td>
                <td>Yes, via user units + <code>loginctl enable-linger</code></td>
            </tr>
            <tr>
                <td><strong>Calendar syntax</strong></td>
                <td>Five-field cron syntax</td>
                <td>Human-readable <code>OnCalendar=</code> with ranges, steps, named shorthands</td>
            </tr>
            <tr>
                <td><strong>Expression validation</strong></td>
                <td>None (errors silently produce no runs)</td>
                <td><code>systemd-analyze calendar</code> validates and shows next trigger times</td>
            </tr>
            <tr>
                <td><strong>Error handling</strong></td>
                <td>Exit code ignored; no automatic retry</td>
                <td><code>Restart=on-failure</code> available; exit codes recorded in journal</td>
            </tr>
            <tr>
                <td><strong>Resource limits</strong></td>
                <td>None</td>
                <td><code>CPUQuota=</code>, <code>MemoryMax=</code>, <code>IOWeight=</code> via cgroups</td>
            </tr>
            <tr>
                <td><strong>Random delay / jitter</strong></td>
                <td>None built-in</td>
                <td><code>RandomizedDelaySec=</code></td>
            </tr>
            <tr>
                <td><strong>File to create</strong></td>
                <td>One crontab entry</td>
                <td>Two unit files (.timer + .service)</td>
            </tr>
        </tbody>
    </table>
</section>

<section>
    <h2>Practical Examples</h2>

    <h3>Example 1: Root-Level Backup Timer with Full Hardening</h3>

    <p>A nightly backup to a remote target, running as a dedicated <code>backup</code> user with full filesystem isolation:</p>

    <pre><code class="language-bash"># /etc/systemd/system/nightly-backup.timer
[Unit]
Description=Nightly backup timer
Documentation=man:rsync(1)

[Timer]
OnCalendar=*-*-* 02:30:00
RandomizedDelaySec=1800
Persistent=true

[Install]
WantedBy=timers.target</code></pre>

    <pre><code class="language-bash"># /etc/systemd/system/nightly-backup.service
[Unit]
Description=Nightly backup to remote storage
After=network-online.target
Wants=network-online.target
Documentation=man:rsync(1)

[Service]
Type=oneshot
User=backup
Group=backup

# The actual backup command
ExecStart=/usr/bin/rsync -az --delete /srv/data/ backup-host:/backups/myserver/

# Filesystem hardening
ProtectSystem=strict
ProtectHome=true
PrivateTmp=true
ReadWritePaths=/var/log/backup

# Privilege hardening
NoNewPrivileges=true
CapabilityBoundingSet=
AmbientCapabilities=

# Kernel hardening
LockPersonality=true
RestrictNamespaces=true
SystemCallArchitectures=native
SystemCallFilter=@system-service @network-io

# Resource limits
MemoryMax=512M
CPUQuota=25%

# Logging
StandardOutput=journal
StandardError=journal</code></pre>

    <pre><code class="language-bash"># Deploy
useradd --system --no-create-home --shell /usr/sbin/nologin backup
systemctl daemon-reload
systemctl enable --now nightly-backup.timer

# Verify
systemctl list-timers nightly-backup.timer
journalctl -u nightly-backup.service --since today</code></pre>

    <h3>Example 2: User-Level Timer for a Deploy Account</h3>

    <p>A data sync job running as the application's service account, without any root involvement:</p>

    <pre><code class="language-bash"># ~/.config/systemd/user/data-sync.timer  (as user 'appuser')
[Unit]
Description=Sync application data every 4 hours

[Timer]
OnCalendar=*-*-* 00,04,08,12,16,20:00:00
Persistent=true
RandomizedDelaySec=300

[Install]
WantedBy=timers.target</code></pre>

    <pre><code class="language-bash"># ~/.config/systemd/user/data-sync.service
[Unit]
Description=Application data sync

[Service]
Type=oneshot
ExecStart=/home/appuser/bin/sync-data.sh
Environment=APP_ENV=production
Environment=SYNC_TARGET=https://api.example.com/sync
StandardOutput=journal
StandardError=journal</code></pre>

    <pre><code class="language-bash"># Enable lingering so timers run without an active session (run as root)
loginctl enable-linger appuser

# Enable the timer (as appuser)
systemctl --user daemon-reload
systemctl --user enable --now data-sync.timer

# Monitor
systemctl --user status data-sync.timer
journalctl --user -u data-sync.service -f</code></pre>

    <h3>Example 3: Replacing a Crontab Entry</h3>

    <p>Converting a typical crontab entry to a systemd timer pair:</p>

    <pre><code class="language-bash"># Before: the crontab entry
# 0 */6 * * * /usr/local/bin/cleanup-old-files.sh &gt;&gt; /var/log/cleanup.log 2&gt;&amp;1</code></pre>

    <pre><code class="language-bash"># After: cleanup-old-files.timer
[Unit]
Description=Clean up old files every 6 hours

[Timer]
OnCalendar=*-*-* 00,06,12,18:00:00
Persistent=true

[Install]
WantedBy=timers.target</code></pre>

    <pre><code class="language-bash"># After: cleanup-old-files.service
[Unit]
Description=Clean up old files

[Service]
Type=oneshot
ExecStart=/usr/local/bin/cleanup-old-files.sh
# No log redirect needed - journald handles this automatically
StandardOutput=journal
StandardError=journal</code></pre>

    <p>Notice the elimination of the <code>&gt;&gt; /var/log/cleanup.log 2&gt;&amp;1</code> redirect. Journald captures all output automatically, queried with <code>journalctl -u cleanup-old-files.service</code>. You gain timestamped, structured, queryable logs with zero effort, and the log is automatically rotated by journald's size and time limits.</p>
</section>

<section>
    <h2>Monitoring and Troubleshooting</h2>

    <p>The monitoring story for systemd timers is substantially better than cron. Everything is queryable through standard systemd tooling.</p>

    <pre><code class="language-bash"># Show all active timers: last trigger, next trigger, timer name, service
systemctl list-timers

# Include inactive timers
systemctl list-timers --all

# Full status of a specific timer
systemctl status myapp-sync.timer

# Full status of the service it triggers
systemctl status myapp-sync.service

# Complete logs for the service, all time
journalctl -u myapp-sync.service

# Logs since a specific time
journalctl -u myapp-sync.service --since "2026-02-25 00:00:00"

# Last 50 lines
journalctl -u myapp-sync.service -n 50

# Follow in real time (useful during testing)
journalctl -u myapp-sync.service -f

# Check if a timer is enabled (will survive reboot)
systemctl is-enabled myapp-sync.timer

# Check the security score of the backing service
systemd-analyze security myapp-sync.service

# Validate a calendar expression
systemd-analyze calendar "Mon..Fri *-*-* 08:30:00"</code></pre>

    <p>When a service fails, <code>systemctl status</code> shows the last few lines of output inline, which is enough to diagnose most failures without needing to query the journal separately. The exit code is recorded, and if you have set <code>OnFailure=</code> on the service unit, a notification or recovery action fires automatically.</p>

    <h3>Common Troubleshooting Scenarios</h3>

    <p><strong>Timer is enabled but never fires.</strong> Check <code>systemctl list-timers</code> to confirm the next trigger time. Validate the <code>OnCalendar=</code> expression with <code>systemd-analyze calendar</code>. Check that the timer unit is active, not just enabled: <code>systemctl is-active myapp.timer</code>.</p>

    <p><strong>Service starts but fails immediately.</strong> Run <code>systemctl status myapp.service</code> to see the exit code and recent output. Check <code>journalctl -u myapp.service -n 50</code> for more context. If you are running with <code>ProtectSystem=strict</code>, the service may be failing because it is trying to write to a path not listed in <code>ReadWritePaths=</code>.</p>

    <p><strong>SELinux denials on Rocky/RHEL.</strong> Run <code>ausearch -m avc -ts recent</code> to see AVC denials. Use <code>audit2why</code> to get a human-readable explanation, and <code>audit2allow -a -M mypolicy</code> to generate a permissive policy for the denied operations.</p>

    <p><strong>User timer not running when not logged in.</strong> Confirm lingering is enabled: <code>loginctl show-user username | grep Linger</code>. The user instance must be running: <code>systemctl --user is-active default.target</code> (run as that user, or check via <code>loginctl</code>).</p>
</section>

<section>
    <h2>Migration Guide: Converting Existing Cron Jobs</h2>

    <p>Converting an existing crontab is mechanical once you understand the pattern. Here is a systematic approach for a production migration.</p>

    <h3>Step 1: Inventory Your Crontab</h3>

    <pre><code class="language-bash"># List all system crontabs
ls /etc/cron.d/
cat /etc/crontab

# List per-user crontabs
crontab -l
crontab -l -u otherappuser

# List cron drop-in directories
ls /etc/cron.hourly/ /etc/cron.daily/ /etc/cron.weekly/ /etc/cron.monthly/</code></pre>

    <h3>Step 2: Cron Schedule to OnCalendar Conversion</h3>

    <pre><code class="language-bash"># Common cron-to-OnCalendar mappings:
# @hourly / 0 * * * *   →  OnCalendar=hourly
# @daily / 0 0 * * *    →  OnCalendar=daily
# @weekly / 0 0 * * 0   →  OnCalendar=weekly
# @monthly / 0 0 1 * *  →  OnCalendar=monthly
# @reboot               →  OnBootSec=15s  (one-time, after boot)
# 0 */4 * * *           →  OnCalendar=*-*-* 00,04,08,12,16,20:00:00
# 30 3 * * 1-5          →  OnCalendar=Mon..Fri *-*-* 03:30:00
# 0 2 1 * *             →  OnCalendar=*-*-01 02:00:00</code></pre>

    <h3>Step 3: Test Before Removing Cron</h3>

    <pre><code class="language-bash"># Run the service immediately to validate it works
systemctl start mynewjob.service

# Check the outcome
systemctl status mynewjob.service
journalctl -u mynewjob.service -n 30

# Enable the timer and watch it fire at the next scheduled time
systemctl enable --now mynewjob.timer
systemctl list-timers mynewjob.timer</code></pre>

    <h3>Step 4: Remove the Cron Entry</h3>

    <p>Only remove the cron entry after the timer has fired at least once and you have verified the output via <code>journalctl</code>. Leave both running in parallel for one full schedule cycle if the task is critical.</p>

    <pre><code class="language-bash"># Edit user crontab
crontab -e

# Or remove a cron.d file
rm /etc/cron.d/myjob</code></pre>

    <h3>Handling @reboot Equivalents</h3>

    <p>Cron's <code>@reboot</code> directive runs a command once after boot. The systemd equivalent uses a monotonic timer with <code>OnBootSec=</code>:</p>

    <pre><code class="language-bash">[Timer]
# Run 30 seconds after boot, once
OnBootSec=30s

[Install]
WantedBy=timers.target</code></pre>

    <p>For a task that should run once on boot and never again until the next boot, omit <code>OnUnitActiveSec=</code>. Without a repeating interval, the timer fires once and stays inactive until the next reboot.</p>
</section>

<section>
    <h2>Migrate the Critical Jobs First</h2>

    <p>The case for systemd timers over cron isn't that cron is broken. Cron works. The case is that cron was designed for a simpler era, and its assumptions are increasingly at odds with how production infrastructure is managed: that logging is optional, that security isolation is someone else's problem, that missed runs are acceptable, that all jobs run in a homogeneous environment.</p>

    <p>systemd timers require more upfront work: two files instead of one line, four commands to enable instead of one <code>crontab -e</code>. But every hour saved debugging "why did this job not run?" or "what output did last night's backup produce?" pays that cost back with interest. On RHEL 9 and Rocky Linux 9, the system itself has already made the migration. Application jobs should follow.</p>

    <p>Start with your most critical production cron jobs: the ones where a missed run or a silent failure has real consequences. Convert those first, apply the hardening directives, and observe. The difference in operational clarity is immediate and difficult to argue against once you have experienced it.</p>
</section>
`,
  },
  {
    id: 'defence-before-fix-static-analysis',
    title: 'Defence Before Fix: Preventing Bug Classes with Static Analysis',
    description:
      'A method for turning a single bug report into a permanent, provable defence against its whole class, in six clauses, with a worked PHPStan example and the specification and toolchains that now implement it.',
    date: '2026-02-22',
    category: CATEGORIES.qa.id,
    heroImage: {
      src: '/images/defence-before-fix-static-analysis/hero.webp',
      alt: 'A row of brick barrel-vault arches receding into depth under a bastion at Fort Delaware, historic defensive masonry documented by the National Park Service',
      ogImage: '/images/defence-before-fix-static-analysis/og.jpg',
      creditText: 'Image: National Park Service (HABS), public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:MULTI-CASEMATE_ARCHES_UNDER_BASTION_-_Fort_Delaware,_Pea_Patch_Island,_Delaware_City,_New_Castle_County,_DE_HABS_DEL,2-PEPIS,1-30.tif',
    },
    readingTime: 25,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    register: 'formal',
    content: `<div class="intro">
    <p class="lead">Defence Before Fix is a phase that runs before a defect is fixed. Rather than dropping straight into remediating the specific instance in front of you, you first treat that instance as evidence of a class, and you build the automated defence that detects every occurrence of that class across the whole codebase. The defence is only trusted once it has been seen to fire.</p>
</div>

<section>
    <p>That is the definition from
    <a href="https://defence-before-fix.github.io/" target="_blank" rel="noopener">the specification</a>,
    which is the canonical statement of the method and the place to go if you want the precise version. This article is where I first published the term, on 22 February 2026, and I have since rewritten it so that it agrees with the specification rather than with my earlier, looser description of the idea. Where the two still differ, the specification is correct, and I would suggest reading it as the source of truth and this as the long-form worked example that it deliberately leaves out.</p>

    <p>The name is meant literally. The defence comes before the fix in time, because the moment you fix the bug the evidence you would have built the defence from is gone, and I have found that this is the part people most often skip whilst believing they have done it.</p>

    <p>I didn't arrive at this from nowhere, and it is probably worth saying where I did arrive from. I have spent a long time, going back well before I had a name for any of it, believing that tooling rather than discipline is what actually makes quality stick in a codebase: php-qa-ci and the precursors that came before it are the practical result of that belief, a project's own checks wired into one entry point that nobody can forget to run because the pipeline runs them regardless of who is under deadline pressure that week. What has changed, and changed quite recently, is not the belief but the cost of acting on it. Writing a bespoke rule used to take long enough that only the most obviously recurring problems ever earned one, and everything smaller went into a code review comment and quietly reappeared a few months later under a different ticket number. An agent can now draft, prove and wire in a rule from a single reported bug in roughly the time it used to take to write that comment, so the calculation that used to favour fixing it and moving on has more or less flipped. Defence Before Fix is the name I have given to actually acting on that, every time, rather than only on the bugs that were annoying enough to justify the old cost.</p>
</section>

<section>
    <h2>The method, in six clauses</h2>

    <p>The specification states the method as six clauses, in order, and they are worth having in front of you before the worked example, because the example is really just these six applied to one bug.</p>

    <ol>
        <li><strong>Attribute the defect to a class.</strong> The question is not "what went wrong here" but "what kind of thing is this an instance of", drawn within a lower bound (a rule that only catches the original instance is probably too narrow) and an upper bound (a rule that fires on code which does not carry the hazard is too broad).</li>
        <li><strong>Build the net.</strong> Express the class as a rule in a detector, meaning a tool that reads code rather than executing it, in whatever your toolchain offers and bespoke where nothing off the shelf will take it.</li>
        <li><strong>Prove the net by making the rule fire.</strong> Red before green, on the originating instance, and committed before the fix so that the red run survives in the history.</li>
        <li><strong>Sweep the codebase, then fix every instance.</strong> Record the count before fixing anything, corroborate it by a search that does not depend on the rule, and then fix them all, with each fix addressing the hazard rather than merely satisfying the rule.</li>
        <li><strong>Enforce permanently, and block.</strong> The rule becomes part of the project's quality checks, through the project's own entry point for accepting changes, and it fails rather than warns.</li>
        <li><strong>Make the failure message terse, and point it at real documentation.</strong> The message carries a stable identifier that resolves to documentation shipped and versioned with the rule, stating what the rule is about, why it exists and how to fix a violation correctly.</li>
    </ol>

    <p>Three of those clauses turn on judgements the specification deliberately does not close: whether code carries the hazard, whether a search was comprehensive, and how broadly to draw the class. Any threshold it gave would be calibrated to one codebase and one generation of tooling, so instead it asks the project to settle those judgements and record them somewhere the next person can find them. I think that is the right call, but it does mean the method asks more of you than a checklist would.</p>

    <h3>The clause I did not write down the first time</h3>

    <p>The original version of this article did not mention clause three at all, and it described the method as inverting the usual order, with the static analysis rule replacing the reproduction test. Both of those were wrong, or at least badly put, and the specification corrects them.</p>

    <p>Defence Before Fix does not replace test-driven development and does not compete with it. You still reproduce the specific defect with a test, executed by a runner, and you still prove it fixed, exactly as normal. What the method adds is a phase before that work begins, operating a level above it: the test pins the instance, and the rule, evaluated by a detector, catches the class. A test proves that one input produces one wrong output. A rule finds the pattern wherever it occurs, including in code nobody thought to test, which is why a test must not serve as the detector.</p>

    <p>The proof is the part that looks like a formality and is not. A new rule has to be seen to fire before it is trusted, and at minimum it has to fire on the defect that sent you looking. If your brand new rule comes back green, the honest reading is that the rule is broken rather than that the codebase is clean, and it is never the goal to write the rule and be instantly green. The specification goes further than I originally would have and requires that proof to survive as a commit of its own: the rule is committed with the originating instance still present, and the fix is committed afterwards, so that a reviewer can check out the first commit and watch it go red rather than take your word for it. Where the pattern is genuinely absent from the codebase, because it was already fixed or because you are defending pre-emptively, the rule is proven against fixture code instead, and that fixture is kept as the rule's own test.</p>
</section>

<section>
    <h2>What a bug hands you</h2>

    <p>A defect you have just found is a real, confirmed, impactful example of a harmful pattern. It is nothing like a pattern you read about in a style guide or one you suspect might cause trouble some day, because this one has already cost somebody something. That is precisely the raw material a good custom rule needs, and it is what speculative rules never have, because the hardest part of writing a rule is usually being sure that the thing it detects is genuinely worth detecting.</p>

    <p>Every defect is therefore an opportunity to extend the codebase's permanent defensive coverage, and that opportunity exists only in the window before the fix. The specification is careful about what counts as a defect: a bug, a code review finding, a performance observation, an incident, an inconsistency. The method does not much care which, and it does not care whether the hazard is a failure either, since error hiding and code that nobody can safely change are hazards too.</p>
</section>

<section>
    <h2>The error-hiding patterns</h2>

    <p>The bugs that first made me want a name for this were all of one kind: the test suite is green, PHPStan reports nothing, CI passes, and somewhere in production a customer's payment has silently failed or their name has been replaced with a blank. It is not the sort of crash that sets off an alert, it is the failure that carries on running quite happily whilst producing wrong results. The cause was almost always code written to hide errors rather than handle them, and three patterns account for most of it in the PHP and TypeScript codebases I have worked in.</p>

    <h3>Pattern 1: the silent default</h3>

    <p>Null coalescing to a falsy value is the most pervasive form. It looks like defensive programming, and it is very nearly the opposite.</p>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/silent-default.php}}</code></pre>

    <pre><code class="language-typescript">{{SNIPPET:defence-before-fix-static-analysis/silent-default.ts}}</code></pre>

    <p>The distinction between "this value is legitimately empty" and "this value is missing because of a bug" has been erased. A renamed API field, a failed database lookup and a wrong property path all produce the same result, an empty string, and an empty string looks valid enough to pass any test that only checks "does this return a string".</p>

    <h3>Pattern 2: the empty catch</h3>

    <p>Exception handling exists so that errors propagate up the call stack until something can meaningfully deal with them. An empty catch block intercepts the error and discards it.</p>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/empty-catch.php}}</code></pre>

    <p>These usually start life as temporary scaffolding during rapid development, with every intention of adding proper handling later. Later rarely comes, because the code appears to work: no uncaught exceptions, no test failures, and nothing to draw anyone's attention back to it.</p>

    <h3>Pattern 3: implicit type coercion</h3>

    <p>Languages that perform implicit coercion absorb type mismatches instead of raising errors. PHP without <code>strict_types</code> will happily convert the integer <code>42</code> to the string <code>"42"</code> rather than flagging a type error at the function boundary where the two collide.</p>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/coercion-loose.php}}</code></pre>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/coercion-strict.php}}</code></pre>

    <p>Strict typing turns every function signature into a validation checkpoint, so that a mismatch is caught where it occurs rather than three layers downstream when the wrong shape of data finally produces some unexpected behaviour.</p>

    <h3>Why green tests lie</h3>

    <p>The three compound. Silent defaults hide missing data at one layer, loose types let the wrong shape through the next, and an empty catch swallows the exception that would have revealed the problem at the third. The result is a system in which every test passes because every error has been converted into a valid-looking result, and a test that checks "the API returns a string" passes whether that string is the customer's name or the empty string a renamed field produced.</p>

    <p>I would go as far as saying this is worse than having no tests, because untested code is at least obviously unverified, whereas code covered by tests that cannot see the error produces active false confidence. Diagnosing these bugs is also slow out of all proportion to their size, since the error and the symptom are separated by several silent conversions and tracing that chain backwards is closer to archaeology than to debugging.</p>
</section>

<section>
    <h2>The worked example</h2>

    <p>The specification says how a rule must behave and is deliberately silent on what one looks like, so this is the part this article exists to do. The example is a real shape of incident, tidied up, and it is the one the specification refers to when it mentions a reported defect that turned out to be one of twenty-three.</p>

    <h3>The incident</h3>

    <p>A support ticket arrives: customers are receiving emails that begin "Dear ," because the name is blank. You trace it to this code:</p>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/incident.php}}</code></pre>

    <p>The customer had been soft-deleted, so <code>find()</code> returned null, <code>getFullName()</code> was never reached, and <code>?? ''</code> converted the null into an empty string. The email sent successfully as far as the application was concerned, no exception was thrown, and no test caught it. The fix is a one-liner and everything about the situation is telling you to make it and move on. This is the point where I would suggest resisting the urge, hopefully for reasons that will become clear.</p>

    <h3>Clause 1: attribute the defect to a class</h3>

    <p>This is not a missing null check, or not only that. It is an instance of coalescing an absent value into a falsy one, which is a pattern, and patterns can be detected mechanically. The class could be drawn wider still, as "any coalesce to a falsy default", and in the toolchain I maintain that wider class is in fact two rules, one for <code>?? ''</code> and one for <code>?? false</code>, because the fixes differ. For this example the class is the empty string. It is worth noticing that the class sits one level below the thing that was reported: the ticket was about blank names in emails, which no detector can read, and what the rule catches is the mechanism that produced them. The specification asks you to say, alongside the rule, whether the reported behaviour itself is also pinned by a check that actually runs the code, and here it is, by the test we come back to at the end.</p>

    <p>Before writing the rule, search for other instances by means that do not depend on it. A text search for the token is one technique; reading the code paths that build customer-facing text is a second, independent one, because it would catch a spelling the search missed. The specification's stopping criterion is saturation rather than effort: use at least two independent techniques, and stop when the last one added found nothing the earlier ones had missed. Here the reading turned up nothing the text search had not, which is the signal that the search is done, and it also gave me a number to check the rule against later.</p>

    <h3>Clause 2: build the net</h3>

    <p>PHPStan custom rules implement its <code>Rule</code> interface and operate on AST nodes. Here is one that bans <code>$value ?? ''</code>, with a stable identifier and a tip that points at the documentation:</p>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/NoNullCoalesceToEmptyStringRule.php}}</code></pre>

    <p>Register it in the PHPStan configuration:</p>

    <pre><code class="language-yaml">{{SNIPPET:defence-before-fix-static-analysis/phpstan-register.neon}}</code></pre>

    <p>Note the rule is drawn to the empty string specifically. A non-empty default such as <code>?? 'unknown'</code> is a real decision that states what the absent case means, and a rule that flagged it would be firing on code that does not carry the hazard, which the upper bound forbids. In my experience a single report on innocent code is enough to make people stop trusting a rule, so I wouldn't tolerate any rate of false positives at all.</p>

    <h3>Clause 3: prove the net by making it fire</h3>

    <p>Run it. It must go red, and at minimum it must catch the line in the incident. Run through the project's own entry point rather than by invoking PHPStan directly, because the point is to prove that the project's checks will run the rule and not merely that the rule can fire:</p>

    <pre><code class="language-bash">{{SNIPPET:defence-before-fix-static-analysis/red-run.txt}}</code></pre>

    <p>Twenty-three. The one you were sent to look at is a symptom, and the other twenty-two are the same bug sitting in twenty-two other places, waiting to surface in different contexts, reported by different customers, at different times, each arriving as its own support ticket months apart with nothing to connect them.</p>

    <p>Now commit, and commit the rule on its own, with all twenty-three instances still present. That commit is your red run, and it is the only one anybody can go back and check. It is what a reviewer checks out to reproduce the proof, and it is the only record that the rule fired on real code rather than on a fixture. If the rule and the fixes share a commit, the red run can only be reconstructed by guessing at which lines to revert, and the proof rests on the guess.</p>

    <h3>Clause 4: sweep, then fix every instance</h3>

    <p>Proving and sweeping are two questions and not necessarily two runs. The same execution has already answered both: the rule works, and there are twenty-three of them. What matters is not to confuse the answers, since a large count does not make the rule more proven, and a rule that fired does not tell you the sweep is complete. The count is corroborated by the independent search from clause one, and if that search had found instances the rule missed, the rule was too narrow and would have to be widened until it caught them. The search is what you trust, and the rule has to earn its way up to it rather than the other way round.</p>

    <p>Then fix them all, and this is where the method delivers most of its value. Each fix needs to deal with the actual hazard, and not simply do whatever makes the rule go quiet. For the incident line, the absent customer is an error and should be treated as one:</p>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/fix-throw.php}}</code></pre>

    <p>Not every instance wants the same answer. Some propagate the null explicitly so the caller decides; a few turn out to be places where absence is a legitimate state whose meaning the code can define, and there a non-empty default that states that meaning is the right fix. What is forbidden is a change that turns the rule green whilst leaving the failure mode intact, and suppressing the rule at the call site, which is not a fix at all. Supplying an empty default is usually the hazard in another form, because it makes the absent case look present and moves the failure downstream to where nobody expects it.</p>

    <p>Twenty-three is a lot of fixing, of course, but it is a job to get through rather than a number to negotiate with. Baselining the existing instances so the rule only blocks new ones is, under the specification, a decision for whoever owns the codebase and not for the person doing the work, and a project that knows about twenty-three instances and fixes one has really just written down a list of defects it has chosen to keep.</p>

    <h3>Clause 5: enforce permanently, and block</h3>

    <p>The rule goes into the gate that blocks the build, for every contributor, permanently, and it fails rather than warns. A warning is a suggestion, and suggestions decay under deadline pressure, which is the condition under which the original defect was written. Where the checks run is the project's business; on my projects that gate is a single <code>bin/qa</code> that CI calls as a thin shim, so a CI failure reproduces locally without any ceremony.</p>

    <h3>Clause 6: the message, the identifier, and the documentation</h3>

    <p>The message is read under interruption by somebody trying to get on with something else, so it stays short: what was detected, where, and the identifier. The documentation carries the reasoning and the remedy, and it is read once, by somebody who has decided to understand the rule. The split is by job rather than by length, and anything that will grow over time belongs in the documentation. A message that names a pattern and leads nowhere is not much use to anyone, because "pattern X detected" on its own teaches you precisely nothing.</p>

    <p>The identifier is the only string that reaches the reader, so it has to be stable across renames and it has to resolve on its own, from a log or a ticket, without the message around it. The documentation lives in the same repository as the rule and is committed with it, so that the two cannot drift apart. The best custom rules I have written are opinionated documentation encoded as automation, and this clause is what makes that literally true.</p>

    <h3>Only then, the fix you came for</h3>

    <p>Now write the failing test for the original bug: a soft-deleted customer's order should throw when the email is prepared, not send a blank-named message. Watch it fail, make it pass and commit it, which is exactly the ordinary TDD loop you would have done anyway, only now it comes after the defence rather than instead of it. After this process you have one rule that prevents the class permanently, one test that documents the correct behaviour at the instance, and twenty-three latent bugs fixed rather than one.</p>
</section>

<section>
    <h2>The same rules in other tools</h2>

    <p>The equivalent ESLint rule for a TypeScript codebase operates on the same idea and a different AST:</p>

    <pre><code class="language-javascript">{{SNIPPET:defence-before-fix-static-analysis/no-empty-string-fallback.js}}</code></pre>

    <p>And a PHPStan rule targeting <code>Catch_</code> nodes catches empty exception handlers before they ship:</p>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/NoEmptyCatchRule.php}}</code></pre>

    <p>For TypeScript, ESLint's built-in <code>no-empty</code> rule covers that one at error level with <code>allowEmptyCatch</code> off. Where an off-the-shelf rule or a tightening of existing configuration genuinely detects the class, using it conforms, and I would always reach for that first. The rules that matter most, though, are the ones tightly coupled to your project and carrying knowledge specific to it, which is why the specification requires a conforming toolchain to allow bespoke custom rules at all.</p>

    <p>It is also worth saying that the defaults of the excellent tooling that exists for PHP and TypeScript are too permissive to do much of this on their own. <code>declare(strict_types=1)</code> in every file and PHPStan at level max with the strict rules extension is the highest-value change I know of in a PHP codebase; in TypeScript, <code>strict</code> is table stakes and <code>noUncheckedIndexedAccess</code> and <code>exactOptionalPropertyTypes</code> catch classes of runtime error that base strict mode misses. Those steps alone will usually surface a backlog of latent bugs in tested, passing code, and they are a good way to find out whether the method is for you before you write a rule.</p>
</section>

<section>
    <h2>Rules that reason across the whole codebase</h2>

    <p>Most rules examine a single file in isolation, but some of the most valuable custom rules cross file boundaries, checking whether code is properly connected to the rest of the system rather than only whether it is internally correct. The sharpest illustration I have of why that matters is a service that was entirely correct, thoroughly tested, and never called.</p>

    <p>On a production Symfony project processing supplier product data, a preprocessing service existed with working SQL logic and a green test suite, but it had never been injected as a constructor dependency into the pipeline meant to call it. Autowiring does not wire in a service nobody asks for, so it lived in isolation. During a scheduled Christmas shutdown in which stock quantities were zeroed, the prices that service should have cleared stayed set. The code was correct, the tests verified the code, and the pipeline never ran it.</p>

    <p>A custom PHPStan rule now catches that entire class. At analysis time it reads the production source tree and checks whether a class that the tests exercise is referenced as a dependency anywhere in production code:</p>

    <pre><code class="language-php">{{SNIPPET:defence-before-fix-static-analysis/ServiceOnlyUsedInTestsRule.php}}</code></pre>

    <p>No test can reach this bug, because the tests exercise the service directly and correctly. Only something that reasons about the full production dependency graph can notice that the service is never invoked when the application actually runs. Codebases that accumulate rules of this kind tend to develop clusters of them around a single pattern: for a domain-specific database access layer I have ended up with a rule that prevents query objects being created inside loops, a companion that catches prepared statements created inside loops, a third that detects a prepared statement used only once in a method (it should be a simpler query class), and a fourth requiring a performance-monitoring dependency in every prepared statement class. Each catches a different failure mode of the same pattern, and together they make misuse structurally difficult.</p>

    <p>The same approach works in TypeScript. An ESLint rule can read route definitions from a separate file at lint time and validate every internal link against them, so that renaming a route without updating its references fails the build without any test covering that navigation:</p>

    <pre><code class="language-javascript">{{SNIPPET:defence-before-fix-static-analysis/validate-internal-links.js}}</code></pre>

    <p>Rules that read the wider codebase are more expensive to write and slower to run than single-file rules, so I would save them for failure modes that are severe and that tests genuinely cannot reach: services disconnected from pipelines, broken internal navigation, documentation that has drifted from the pages it describes. Those are the bugs that slip through green suites because tests model code in isolation rather than how the system is assembled.</p>
</section>

<section>
    <h2>What exists now</h2>

    <p>When I first published this article the method was a description and a name. It is now two specifications, both at
    <a href="https://defence-before-fix.github.io/" target="_blank" rel="noopener">defence-before-fix.github.io</a>
    under Creative Commons Attribution 4.0: the method specification, version 1.0.0, which states what a practitioner does when a defect is found, and the toolchain specification, version 0.1.0, which is addressed to anyone who maintains a linter or a QA pipeline that other people install and says what a tool has to offer so that the projects using it can follow the method at all. The two quality toolchains I maintain,
    <a href="https://github.com/LongTermSupport/php-qa-ci" target="_blank" rel="noopener">php-qa-ci</a>
    and
    <a href="https://github.com/LongTermSupport/ts-qa-ci" target="_blank" rel="noopener">ts-qa-ci</a>,
    each record in their own manifest the specification versions they conform to, can list their active defences and resolve a printed identifier to its documentation, and name the method with a link to the specification whenever the pipeline fails.</p>

    <pre><code class="language-bash">{{SNIPPET:defence-before-fix-static-analysis/toolchain-commands.sh}}</code></pre>

    <p>I want to be careful about what I am and am not claiming, because the territory next to this is well populated. Defensive programming is decades old, preventing classes of bug rather than instances predates this by a long way, and static analysis, custom lint rules and blocking quality gates are all long-established practice, so I claim none of them. What I am claiming is the term, which I couldn't find in use as a named practice when I published it, the placement of the work before the fix, and the requirement that a rule be proven by firing before it is trusted. It is a method I named and published, and that is the whole of the claim; I am not asserting that anyone else has adopted it.</p>
</section>

<section>
    <h2>Why this matters more under AI-assisted development</h2>

    <p>For a human developer a failure message that teaches is good practice. They may read it, may internalise it, may ignore it, and which of those happens depends on their seniority, their workload and how many times they have seen the message before.</p>

    <p>For a coding agent, as far as I can tell from watching a lot of them work, the failure message is more or less the whole of the correction loop. It gets consumed as instruction, in the same turn, every time, without fatigue and without any seniority gradient, and a message that resolves to documentation explaining the correct approach does not simply block the agent but tends to turn it around and point it the right way, and in my experience it does that about as well on the hundredth occurrence as on the first. That reframes the usual complaint about AI-written code somewhat. The difficulty was never really that agents make mistakes, people do too, but rather that nobody had built a channel for correcting them at the level of the class instead of one instance at a time.</p>

    <p>Most of my working time for the last couple of years has been spent directing agents rather than hand-writing code, and the specification's section on operating a defence under AI-assisted development is the part I would most stand behind, because every clause in it was learned the hard way. The practitioner has to be able to run the defence themselves, or the loop never closes in the turn where the mistake was cheap to fix. The result has to arrive in the output they are already reading. The identifier has to resolve without a human, which for an agent means mechanically. The documentation has to state the correct construction and not only the prohibition, because a prohibition alone leaves the agent to guess at the replacement, and it will guess. And the project's defences have to be enumerable, because an agent arriving at a codebase has no colleague to ask and no memory of last time, so without a listing its standards can only be learned by violating them one at a time.</p>

    <p>The cost of fixing has changed as well. The historical case for baselining a large sweep was the cost of human hours, and that cost has largely collapsed, since an agent can work through hundreds of instances at a price that would have made a baseline unavoidable a few years ago, so reaching for one now is usually a habit rather than a judgement, and the specification stops short of forbidding baselines outright, but only just. The other half of that coin, and the half that is easier to forget, is who actually gets to decide. An agent executing this method decides how the defence is built, and it does not decide what the codebase is permitted to keep; suppressing an instance, baselining, or leaving a known instance unfixed belong to whoever owns the codebase, whatever the count turns out to be, and an agent that reaches for an exception has almost always found a shortcut rather than a genuine obstacle. I saw both failure modes, the agent that stalls at the first judgement call and the agent that quietly takes the decision itself, when I had early drafts of the specification read cold, and the second is much harder to notice than the first.</p>

    <p>Hopefully that makes the case on its own. If you intend to have agents writing code in your codebase, then the rules in your quality gate, and the messages attached to them, are the main channel you have for teaching them your project's standards at all.</p>
</section>

<section>
    <h2>The ratchet</h2>

    <p>The goal is not zero bugs, which I don't think is achievable for anyone. The goal is that every bug leaves the system better defended than it found it, so that each incident leaves behind a defence as well as a fix and a test, and the categories of bug that can survive in the codebase shrink over time. A codebase with a mature set of custom rules has a different character from one without: code review spends its attention on logic and architecture rather than on patterns the linter could find, new contributors are held to the established safe patterns from their first commit, and the mistakes of the past become structurally impossible to repeat rather than merely discouraged.</p>

    <p>So the next time a bug reaches production, before you write the test, ask what pattern allowed it and whether a machine could be made to recognise that pattern everywhere. Do not decide in advance whether it can; attempt it, because failing to write a rule within the bounds is itself the evidence that the defect is out of scope, and it is cheaper and more reliable than a judgement made before trying. Where it can, write the rule first, prove it by making it fire, commit that proof, sweep, fix every instance, enforce it, and document it. Then, and only then, fix the bug in the ordinary way.
    <a href="https://defence-before-fix.github.io/" target="_blank" rel="noopener">The specification</a>
    has the precise version of all of that, and if you maintain tooling that other people install, the toolchain specification alongside it is the one addressed to you.</p>
</section>
`,
  },
  // Migrating: advanced-php-database-patterns.ejs
  {
    id: 'advanced-php-database-patterns',
    title: 'Advanced PHP Database Patterns: Beyond ORMs for High-Performance Applications',
    description:
      'Discover advanced database patterns for PHP including retry mechanisms, bulk updates, statement caching, query classes, generators for memory efficiency, and PHPStan rules for test correctness. Learn when to use PDO directly over ORMs.',
    date: '2025-10-08',
    category: CATEGORIES.database.id,
    heroImage: {
      src: '/images/advanced-php-database-patterns/hero.webp',
      alt: 'A c. 1949 Western Electric manual telephone switchboard, densely packed with numbered jack rows and patch cords routing individual connections by hand.',
      ogImage: '/images/advanced-php-database-patterns/og.jpg',
      creditText: 'Image: Daderot, CC0, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Telephone_switchboard,_c._1949,_Western_Electric_-_Museum_of_Science_and_Industry_(Chicago)_-_DSC06823.JPG',
    },
    readingTime: 18,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'Database',
    register: 'formal',
    content: `
<div class="intro">
            <p class="lead">
                When working on projects with heavy database lifting, working directly with <a href="https://www.php.net/manual/en/book.pdo.php" target="_blank" rel="noopener">PDO</a> and <a href="https://dev.mysql.com/doc/" target="_blank" rel="noopener">MySQL</a> often outperforms using an <a href="https://en.wikipedia.org/wiki/Object%E2%80%93relational_mapping" target="_blank" rel="noopener">ORM</a>. The key insight: you can use both approaches side-by-side. ORMs excel at simple CRUD operations, but when you need maximum performance for complex queries, bulk operations, or memory-efficient processing, direct database access gives you fine-grained control. In most applications, the database is the real bottleneck, and these patterns help you squeeze every bit of performance from it.
            </p>
        </div>

        <section>
            <h2>Why Direct Database Access Matters</h2>

            <p>
                ORMs like <a href="https://www.doctrine-project.org/" target="_blank" rel="noopener">Doctrine</a> and <a href="https://laravel.com/docs/eloquent" target="_blank" rel="noopener">Eloquent</a> provide convenience and rapid development, but they introduce overhead that becomes significant at scale. Direct PDO queries are noticeably faster than ORM-generated queries for complex operations, and the gap widens when processing millions of rows or performing bulk updates.
            </p>

            <p>
                The patterns in this article come from production systems handling high-volume database operations, addressing real-world challenges such as connection failures, memory exhaustion, slow bulk updates, and brittle tests that pass despite broken SQL, rather than being purely theoretical.
            </p>

            <h3>The Hybrid Approach</h3>

            <p>
                You don't need to choose between ORMs and direct database access. Use your ORM for typical application code where developer productivity matters more than raw performance. Switch to direct PDO when you need:
            </p>

            <ul>
                <li><strong>Bulk operations</strong> - Updating thousands of rows efficiently</li>
                <li><strong>Complex queries</strong> - Multi-table joins, derived tables, or aggregations</li>
                <li><strong>Memory-efficient processing</strong> - Streaming millions of rows without exhausting memory</li>
                <li><strong>Maximum performance</strong> - When every millisecond counts</li>
                <li><strong>Fine-grained control</strong> - Transaction isolation levels, connection management, statement caching</li>
            </ul>
        </section>

        <section>
            <h2>Pattern 1: Retry Mechanisms for Transient Failures</h2>

            <p>
                Database connections fail, MySQL servers restart, and networks hiccup, so long-running processes will eventually run into a "MySQL server has gone away" error - production systems need to handle these transient failures gracefully, without crashing or requiring manual intervention.
            </p>

            <h3>The Problem</h3>

            <p>
                When your application loses its database connection mid-operation, the default behaviour is catastrophic: exceptions bubble up, processes crash, and data operations fail. For batch jobs processing millions of records, a single connection timeout can waste hours of work.
            </p>

            <h3>The Solution: Automatic Retry with Connection Reset</h3>

            <p>
                Implement a <a href="https://www.php.net/manual/en/class.pdo.php" target="_blank" rel="noopener">PDO</a> wrapper that detects connection failures and automatically retries operations after resetting the connection. The pattern uses PHP's <a href="https://www.php.net/manual/en/language.types.callable.php" target="_blank" rel="noopener">callable types</a> and <a href="https://www.php.net/manual/en/language.exceptions.php" target="_blank" rel="noopener">exception handling</a> to wrap database operations in retry logic.
            </p>

            <p>
                First, define a clean interface for database operations:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/database-service-interface.php}}
</code></pre>

            <p>
                The retry mechanism implementation handles multiple connection error types and provides configurable retry behaviour:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/retry-mechanism.php}}
</code></pre>

            <h3>Key Features</h3>

            <ul>
                <li><strong>Automatic detection</strong> - Recognises 11+ types of connection errors including deadlocks, timeouts, and SSL failures</li>
                <li><strong>Configurable retries</strong> - Set maximum attempts and delay between retries based on your environment</li>
                <li><strong>Connection reset</strong> - Forces PDO to establish a new connection after failures</li>
                <li><strong>Logging integration</strong> - Uses <a href="https://www.php-fig.org/psr/psr-3/" target="_blank" rel="noopener">PSR-3 LoggerInterface</a> for monitoring retry patterns</li>
                <li><strong>Non-retryable errors</strong> - Only retries connection errors, not SQL syntax errors or constraint violations</li>
            </ul>

            <h3>Real-World Impact</h3>

            <p>
                In production systems, this pattern eliminates manual intervention for transient failures. Batch jobs that once required monitoring and manual restarts now complete reliably. The retry logic adds negligible overhead (microseconds) whilst providing significant resilience.
            </p>
        </section>

        <section>
            <h2>Pattern 2: Prepared Statement Caching</h2>

            <p>
                <a href="https://www.php.net/manual/en/pdo.prepare.php" target="_blank" rel="noopener">Prepared statements</a> are essential for security and performance, but repeatedly preparing the same statement wastes resources. Whilst MySQL caches execution plans server-side, PHP destroys PDOStatement objects between requests. Within a single request, however, you can cache prepared statements for significant performance gains.
            </p>

            <h3>The Problem</h3>

            <p>
                When executing the same query repeatedly with different parameters (common in loops and batch operations), calling <code>$pdo->prepare()</code> for each execution creates unnecessary overhead. Each prepare operation involves parsing SQL, allocating memory, and communicating with the database server.
            </p>

            <h3>The Solution: Request-Scoped Statement Cache</h3>

            <p>
                Implement a caching layer that reuses prepared statements within the same connection. The cache uses <a href="https://www.php.net/manual/en/function.spl-object-hash.php" target="_blank" rel="noopener">spl_object_hash()</a> to ensure statements are only reused with the same PDO connection:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/statement-caching.php}}
</code></pre>

            <h3>Performance Characteristics</h3>

            <p>
                Reusing a prepared statement instead of re-preparing it on every iteration measurably reduces overhead for queries executed in loops (see this <a href="https://stackoverflow.com/questions/2132524/php-pdo-how-does-re-preparing-a-statement-affect-performance" target="_blank" rel="noopener">discussion of PDO statement re-preparation costs</a> for the underlying mechanics). The gain comes from:
            </p>

            <ul>
                <li><strong>Eliminated parsing</strong> - SQL only parsed once per connection</li>
                <li><strong>Reduced memory allocation</strong> - Statement objects reused instead of recreated</li>
                <li><strong>Less garbage collection</strong> - Fewer objects for PHP to clean up</li>
            </ul>

            <h3>Important Limitations</h3>

            <p>
                Statement caching only works within a single request. As noted in the <a href="https://www.php.net/manual/en/pdo.prepare.php" target="_blank" rel="noopener">PHP manual</a>, PDOStatement objects cannot persist between requests because they're tied to resources that get deallocated when the script ends. Don't attempt to cache statements in sessions or <a href="https://www.php.net/manual/en/book.apc.php" target="_blank" rel="noopener">APCu</a>.
            </p>
        </section>

        <section>
            <h2>Pattern 3: Bulk Update Single Column</h2>

            <p>
                Updating thousands of rows individually is painfully slow, because each UPDATE statement involves a full round-trip to the database - for 10,000 rows, that's 10,000 network round-trips. The bulk update pattern uses MySQL's <a href="https://dev.mysql.com/doc/refman/8.0/en/case.html" target="_blank" rel="noopener">CASE WHEN</a> clause to update thousands of rows in a single query.
            </p>

            <h3>The Problem</h3>

            <p>
                Standard approaches to bulk updates are inadequate:
            </p>

            <ul>
                <li><strong>Individual UPDATEs</strong> - Loop with 10,000 UPDATE statements takes minutes</li>
                <li><strong>UPDATE with IN clause</strong> - Can only set all rows to the same value</li>
                <li><strong>Multiple separate queries</strong> - Still requires thousands of round-trips</li>
            </ul>

            <h3>The Solution: CASE WHEN Bulk Updates</h3>

            <p>
                Transform multiple updates into a single SQL statement using CASE WHEN. This pattern generates SQL like:
            </p>

            <pre><code class="language-sql">UPDATE products
SET price = CASE id
    WHEN 101 THEN 29.99
    WHEN 102 THEN 39.99
    WHEN 103 THEN 49.99
    -- ... thousands more
END
WHERE id IN (101, 102, 103, ...)</code></pre>

            <p>
                The PHP implementation accumulates changes and executes them in configurable chunk sizes:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/bulk-update-single-column.php}}
</code></pre>

            <h3>Usage Example</h3>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/usage-example-bulk-update.php}}
</code></pre>

            <h3>Performance Impact</h3>

            <p>
                In production systems, this pattern reduces bulk update time by 100-1000x:
            </p>

            <ul>
                <li><strong>10,000 individual UPDATEs</strong> - 2-5 minutes</li>
                <li><strong>Single CASE WHEN query</strong> - 1-3 seconds</li>
            </ul>

            <p>
                The chunk size parameter (default 5000) balances memory usage against network round-trips. Larger chunks mean fewer queries but more memory for the SQL string. For most scenarios, 5000 is optimal.
            </p>
        </section>

        <section>
            <h2>Pattern 4: Query, Statement, and Generator Classes</h2>

            <p>
                Raw SQL strings scattered throughout your codebase create maintenance nightmares: changes to table structure mean hunting through hundreds of files, and SQL injection vulnerabilities can hide in plain sight. Encapsulating SQL in dedicated classes with clear purposes solves both problems.
            </p>

            <h3>Query Classes: Execute Once in Constructor</h3>

            <p>
                Query classes execute immediately when instantiated and provide strongly-typed results. They use <a href="https://phpstan.org/writing-php-code/phpdoc-types" target="_blank" rel="noopener">PHPStan type annotations</a> to guarantee result structure:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/query-class-pattern.php}}
</code></pre>

            <h3>PreparedStmt Classes: Reusable Parameterised Queries</h3>

            <p>
                Unlike Query classes, PreparedStmt classes have methods to execute with different parameters. Use them for queries called multiple times with varying inputs:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/prepared-statement-class.php}}
</code></pre>

            <h3>Generator Classes: Memory-Efficient Streaming</h3>

            <p>
                Generator classes use <a href="https://www.php.net/manual/en/language.generators.php" target="_blank" rel="noopener">PHP generators</a> for memory-efficient processing of large result sets. Because a generator yields one row at a time instead of materialising the whole result set, memory use stays flat regardless of how many rows you process:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/generator-pattern.php}}
</code></pre>

            <h3>Usage Example: Processing Millions of Rows</h3>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/usage-example-generator.php}}
</code></pre>

            <h3>When to Use Each Pattern</h3>

            <ul>
                <li><strong>Query class</strong> - Results needed immediately, data set fits in memory</li>
                <li><strong>PreparedStmt class</strong> - Same query executed multiple times with different parameters</li>
                <li><strong>Generator class</strong> - Large result sets, streaming processing, memory constraints</li>
            </ul>

            <h3>Buffered vs Unbuffered Queries</h3>

            <p>
                The <a href="https://www.php.net/manual/en/mysqlinfo.concepts.buffering.php" target="_blank" rel="noopener">PHP manual</a> explains the difference: buffered queries (default) load all results into memory immediately, whilst unbuffered queries fetch rows on demand. Generators use unbuffered queries internally for memory efficiency.
            </p>
        </section>

        <section>
            <h2>Pattern 5: Derived Tables for Performance</h2>

            <p>
                Complex queries often benefit from <a href="https://dev.mysql.com/doc/refman/8.0/en/derived-tables.html" target="_blank" rel="noopener">derived tables</a> (subqueries in the FROM clause). MySQL's query optimiser can materialise derived tables, drastically reducing the result set size before joins. According to the <a href="https://dev.mysql.com/doc/refman/9.1/en/subquery-optimization.html" target="_blank" rel="noopener">MySQL 9.1 documentation</a>, derived table optimisation can improve query performance by 10-100x for complex aggregations.
            </p>

            <h3>The Problem</h3>

            <p>
                When joining large tables and then aggregating, MySQL processes millions of rows unnecessarily. This query pattern is inefficient:
            </p>

            <pre><code class="language-sql">-- BAD: Joins first, aggregates later
SELECT c.id, c.name, SUM(o.total), COUNT(*)
FROM customers c
INNER JOIN orders o ON c.id = o.customer_id
WHERE o.status = 'completed'
GROUP BY c.id</code></pre>

            <h3>The Solution: Aggregate in Derived Table</h3>

            <p>
                Pre-aggregate in a derived table before joining. MySQL materialises the aggregated result set (much smaller), then joins against it:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/derived-table-optimization.php}}
</code></pre>

            <h3>Performance Impact</h3>

            <p>
                For a table with 1 million orders and 100,000 customers:
            </p>

            <ul>
                <li><strong>Without derived table</strong> - Processes 1,000,000 rows, takes 15-30 seconds</li>
                <li><strong>With derived table</strong> - Processes 50,000 aggregated rows, takes 0.5-2 seconds</li>
            </ul>

            <p>
                The MySQL optimiser uses <a href="https://dev.mysql.com/doc/refman/8.4/en/subquery-materialization.html" target="_blank" rel="noopener">materialisation strategies</a> to create temporary tables for derived tables, enabling index usage and reducing memory requirements.
            </p>
        </section>

        <section>
            <h2>Pattern 6: Transaction Isolation Levels</h2>

            <p>
                <a href="https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html" target="_blank" rel="noopener">Transaction isolation levels</a> control how concurrent transactions interact. The default REPEATABLE READ level prevents many issues but introduces unnecessary locking for some scenarios. Choosing the right isolation level based on operation type improves both performance and correctness.
            </p>

            <h3>Available Isolation Levels</h3>

            <ul>
                <li><strong>READ UNCOMMITTED</strong> - Fastest, allows dirty reads (reading uncommitted changes)</li>
                <li><strong>READ COMMITTED</strong> - Prevents dirty reads, good balance for most operations</li>
                <li><strong>REPEATABLE READ</strong> - MySQL default, prevents non-repeatable reads</li>
                <li><strong>SERIALIZABLE</strong> - Strongest isolation, full transaction isolation</li>
            </ul>

            <h3>Implementation Pattern</h3>

            <p>
                Set the isolation level <em>before</em> calling <a href="https://www.php.net/manual/en/pdo.begintransaction.php" target="_blank" rel="noopener">beginTransaction()</a>:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/transaction-isolation.php}}
</code></pre>

            <h3>Choosing the Right Level</h3>

            <ul>
                <li><strong>Financial operations</strong> - Use SERIALIZABLE for complete isolation</li>
                <li><strong>Standard updates</strong> - Use READ COMMITTED for good balance</li>
                <li><strong>Reporting/analytics</strong> - Use READ UNCOMMITTED for maximum performance</li>
                <li><strong>Default</strong> - READ COMMITTED recommended over REPEATABLE READ according to <a href="https://www.drupal.org/docs/getting-started/system-requirements/setting-the-mysql-transaction-isolation-level" target="_blank" rel="noopener">Drupal documentation</a></li>
            </ul>

            <p>
                As noted in <a href="https://webreference.com/php/database/transactions/" target="_blank" rel="noopener">PHP transaction best practices</a>, always wrap transactions in try-catch blocks to ensure rollback on failure. Keep transactions short to minimise locking.
            </p>
        </section>

        <section>
            <h2>Pattern 7: PHPStan Rules for Test Correctness</h2>

            <p>
                Unit tests that mock database operations provide false confidence. They pass even when SQL references non-existent tables or columns. The solution: use <a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a> rules to enforce integration tests that execute real SQL against real databases.
            </p>

            <h3>The Problem</h3>

            <p>
                This test passes but the SQL is broken:
            </p>

            <pre><code class="language-php">public function testGetUsers(): void
{
    // Mock database - test passes even if SQL references wrong table
    $mockDb = $this->createMock(DatabaseServiceInterface::class);
    $mockDb->method('query')->willReturn([
        ['id' => 1, 'email' => 'test@example.com']
    ]);

    $query = new ActiveUsersQuery($mockDb);

    self::assertCount(1, $query->results); // ✓ Test passes
}

// Meanwhile, the actual SQL references wrong_table_name
// This bug won't be caught until production!</code></pre>

            <h3>Solution 1: Prevent Mocking DatabaseServiceInterface</h3>

            <p>
                Create a <a href="https://phpstan.org/developing-extensions/rules" target="_blank" rel="noopener">custom PHPStan rule</a> that fails static analysis when tests mock the database service:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/phpstan-no-mock-rule.php}}
</code></pre>

            <h3>Solution 2: Require Integration Tests</h3>

            <p>
                Enforce that database test classes implement an integration test interface:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/phpstan-integration-test-rule.php}}
</code></pre>

            <h3>Real-World Impact</h3>

            <p>
                These rules prevent an entire class of bugs where:
            </p>

            <ul>
                <li>SQL references wrong table names</li>
                <li>Queries reference dropped columns</li>
                <li>JOIN conditions use incorrect column names</li>
                <li>WHERE clauses have syntax errors</li>
            </ul>

            <p>
                The rules enforce testing discipline at development time through static analysis, catching bugs before code review rather than in production.
            </p>
        </section>

        <section>
            <h2>Pattern 8: PHP Hash Lookups vs SQL Joins</h2>

            <p>
                Sometimes pulling data into PHP and using <a href="https://www.php.net/manual/en/language.types.array.php" target="_blank" rel="noopener">associative arrays</a> for lookups is dramatically faster than complex SQL joins. This is especially true when you need to cross-check two tables with string processing, deduplication, or complex business logic that's difficult to express in SQL.
            </p>

            <h3>When PHP Processing Wins</h3>

            <p>
                SQL joins excel at set-based operations, but PHP hash lookups can be faster when:
            </p>

            <ul>
                <li><strong>String processing required</strong> - Normalising, trimming, regex matching, or case-insensitive comparisons</li>
                <li><strong>Complex matching logic</strong> - Business rules that don't map cleanly to SQL WHERE clauses</li>
                <li><strong>Multiple passes needed</strong> - Iterative processing where each row affects subsequent decisions</li>
                <li><strong>Small-to-medium datasets</strong> - Under 100,000 rows that fit comfortably in memory</li>
                <li><strong>Mixed data sources</strong> - Combining database results with API data or file system information</li>
            </ul>

            <h3>The Hash Lookup Pattern</h3>

            <p>
                PHP arrays with <code>$array[$key] = true</code> structure provide O(1) lookup performance. According to <a href="https://www.npopov.com/2014/12/22/PHPs-new-hashtable-implementation.html" target="_blank" rel="noopener">PHP's hashtable implementation</a>, this is one of the most optimised data structures in PHP:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/php-hash-lookups.php}}
</code></pre>

            <h3>Real-World Example: Deduplication with Normalisation</h3>

            <p>
                Consider matching customer records between two systems where names might have extra whitespace, different casing, or special characters. SQL can do fuzzy matching with <code>LOWER()</code> and <code>TRIM()</code>, but complex normalisation is cleaner in PHP:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/php-vs-sql-normalization.php}}
</code></pre>

            <h3>Memory vs Performance Tradeoff</h3>

            <p>
                The key consideration: memory usage. Loading 100,000 rows into PHP arrays might consume 50-100MB of memory, but provides instant O(1) lookups. As discussed in <a href="https://www.php.net/manual/en/features.gc.php" target="_blank" rel="noopener">PHP's garbage collection documentation</a>, modern PHP handles large arrays efficiently.
            </p>

            <p>
                Compare the tradeoffs:
            </p>

            <ul>
                <li><strong>SQL JOIN approach</strong> - Minimal memory (streaming results), but slower for complex matching logic</li>
                <li><strong>PHP hash lookup approach</strong> - Higher memory usage (load full datasets), but dramatically faster for complex operations</li>
            </ul>

            <h3>Performance Guidelines</h3>

            <p>
                Based on production experience, PHP hash lookups outperform SQL when:
            </p>

            <ul>
                <li>Dataset fits in available memory (check with <code>memory_get_usage()</code>)</li>
                <li>Each row requires multiple string operations (regex, normalisation, validation)</li>
                <li>Business logic is complex and would require multiple SQL passes</li>
                <li>You're joining more than 3-4 tables with complex conditions</li>
            </ul>

            <h3>When to Stick with SQL</h3>

            <p>
                Don't abandon SQL for everything. SQL remains superior for:
            </p>

            <ul>
                <li><strong>Simple equi-joins</strong> - Straightforward foreign key relationships</li>
                <li><strong>Large datasets</strong> - Millions of rows that won't fit in memory</li>
                <li><strong>Aggregations</strong> - SUM, COUNT, GROUP BY operations</li>
                <li><strong>Set operations</strong> - UNION, INTERSECT, EXCEPT</li>
                <li><strong>Index-driven queries</strong> - When proper indexes make SQL lookups instant</li>
            </ul>

            <p>
                According to <a href="https://use-the-index-luke.com/" target="_blank" rel="noopener">Use The Index, Luke</a>, a well-indexed SQL query can outperform any in-memory structure. The decision point: test both approaches with realistic data volumes.
            </p>

            <h3>Hybrid Approach: Best of Both Worlds</h3>

            <p>
                Often the optimal solution combines SQL and PHP processing:
            </p>

            <pre><code class="language-php">{{SNIPPET:advanced-php-database-patterns/hybrid-sql-php.php}}
</code></pre>

            <p>
                This pattern uses SQL for initial filtering and joins, then PHP for complex business logic that's difficult or impossible to express in SQL. The result: minimal memory usage with maximum processing flexibility.
            </p>
        </section>

        <section>
            <h2>Additional Patterns and Considerations</h2>

            <h3>Connection Pooling in PHP</h3>

            <p>
                Traditional PHP-FPM doesn't support true connection pooling due to PHP's stateless nature. However, <a href="https://openswoole.com/" target="_blank" rel="noopener">OpenSwoole</a> and <a href="https://www.swoole.co.uk/" target="_blank" rel="noopener">Swoole</a> extensions enable connection pooling in PHP, letting a small, fixed pool of database connections serve a much larger number of concurrent HTTP requests efficiently.
            </p>

            <p>
                For traditional PHP-FPM deployments, use <a href="https://www.php.net/manual/en/features.persistent-connections.php" target="_blank" rel="noopener">persistent connections</a> via the <code>PDO::ATTR_PERSISTENT</code> option. Whilst not true pooling, persistent connections reduce connection overhead when using PHP-FPM's worker processes.
            </p>

            <h3>Query Result Caching</h3>

            <p>
                For frequently-accessed data that changes infrequently, implement query result caching using <a href="https://redis.io/" target="_blank" rel="noopener">Redis</a> or <a href="https://memcached.org/" target="_blank" rel="noopener">Memcached</a>. For read-heavy workloads, serving a cached result is dramatically faster than re-running the underlying query on every request.
            </p>

            <h3>Database Indexing Strategy</h3>

            <p>
                Proper indexing remains the foundation of database performance. Focus indexes on:
            </p>

            <ul>
                <li>Foreign key columns used in JOINs</li>
                <li>Columns frequently used in WHERE clauses</li>
                <li>Columns used for sorting (ORDER BY)</li>
                <li>Covering indexes for frequently-run queries</li>
            </ul>

            <p>
                Use <a href="https://dev.mysql.com/doc/refman/8.0/en/explain.html" target="_blank" rel="noopener">EXPLAIN</a> to analyse query execution plans and identify missing indexes.
            </p>

            <h3>Read Replicas and Scaling</h3>

            <p>
                For high-traffic applications, implement <a href="https://dev.mysql.com/doc/refman/8.0/en/replication.html" target="_blank" rel="noopener">MySQL replication</a> with read replicas. Route read queries to replicas and write queries to the primary server. Splitting traffic this way distributes load and improves throughput.
            </p>
        </section>

        <section>
            <h2>Conclusion</h2>

            <p>
                These patterns represent years of production experience handling high-volume database operations in PHP, solving real problems that emerge as systems grow rather than being theoretical exercises:
            </p>

            <ul>
                <li><strong>Retry mechanisms</strong> eliminate manual intervention for transient failures</li>
                <li><strong>Statement caching</strong> cuts overhead for queries executed in loops</li>
                <li><strong>Bulk updates</strong> turn many round trips into a handful, cutting operation time dramatically</li>
                <li><strong>Query/Statement/Generator classes</strong> organise SQL and provide type safety</li>
                <li><strong>Derived tables</strong> can outperform correlated subqueries substantially for complex queries</li>
                <li><strong>Transaction isolation</strong> balances correctness with performance</li>
                <li><strong>PHPStan rules</strong> catch SQL errors at development time</li>
                <li><strong>PHP hash lookups</strong> can outperform SQL for complex string processing and business logic</li>
            </ul>

            <p>
                The key insight: use the right tool for each job. ORMs for typical CRUD operations, direct database access for performance-critical code. The patterns in this article give you the tools to build high-performance database layers when you need them, whilst maintaining the productivity benefits of ORMs for standard operations.
            </p>

            <p>
                Remember that premature optimisation wastes time - start with an ORM for rapid development, profile your application under realistic load, and only once you've identified genuine database bottlenecks should you apply these patterns to the hot paths. The combination of thoughtful design and targeted optimisation produces applications that are both maintainable and performant.
            </p>
        </section>

        <section>
            <h3>Further Reading</h3>
            <ul>
                <li><a href="https://www.php.net/manual/en/book.pdo.php" target="_blank" rel="noopener">PHP PDO Documentation</a> - Official PDO reference</li>
                <li><a href="https://dev.mysql.com/doc/refman/8.0/en/optimization.html" target="_blank" rel="noopener">MySQL Optimisation Guide</a> - Comprehensive optimisation strategies</li>
                <li><a href="https://phpstan.org/developing-extensions/rules" target="_blank" rel="noopener">PHPStan Custom Rules</a> - Creating your own static analysis rules</li>
                <li><a href="https://www.php.net/manual/en/language.generators.php" target="_blank" rel="noopener">PHP Generators</a> - Official generator documentation</li>
                <li><a href="https://dev.mysql.com/doc/refman/8.0/en/innodb-transaction-isolation-levels.html" target="_blank" rel="noopener">InnoDB Transaction Isolation</a> - Understanding isolation levels</li>
            </ul>
        </section>
    `,
  },
  // Migrating: ai-enhanced-php-development.ejs
  {
    id: 'ai-enhanced-php-development',
    title: 'AI-Enhanced PHP Development: Tools and Workflows',
    description:
      'Modern PHP development enhanced with AI tools and workflows for increased productivity and code quality',
    date: '2024-12-10',
    category: CATEGORIES.ai.id,
    heroImage: {
      src: '/images/ai-enhanced-php-development/hero.webp',
      alt: 'A black-and-white photograph of a technician operating the control console of a mechanical differential analyzer, in front of a dense wall of patch-panel switchboards',
      ogImage: '/images/ai-enhanced-php-development/og.jpg',
      creditText: 'Image: NASA, public domain, via Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:NASA_Differential_Analyzer.jpg',
    },
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'LLMDevs',
    content: `
<!-- Article lead/introduction -->
<section class="intro">
<p class="lead">
How AI tools like GitHub Copilot and OpenAI's APIs can speed up PHP development, without you handing over your judgement about what good code actually looks like.
</p>
</section>
<!-- Article content sections -->
<section>
<p>AI tools are genuinely useful for PHP development, though it's worth being honest about what that actually means in practice: they amplify the skill you already have rather than replace your judgement, so any productivity gain only really shows up if you're still doing the reviewing yourself.</p>
<p>The tools below fall into two rough categories: pair-programming assistants for boilerplate and test generation, and API-level integrations for code review, refactoring, and error analysis. What matters more than the tools themselves is how you validate what they produce.</p>
</section>
<section>
<h2>The AI Development Toolkit</h2>
<h3>GitHub Copilot</h3>
<p>GitHub Copilot is good at:</p>
<ul>
<li><strong>Boilerplate code generation:</strong> Controllers, models, service classes</li>
<li><strong>Test case creation:</strong> Unit tests, integration tests, mock objects</li>
<li><strong>Documentation:</strong> PHPDoc comments, README files, inline comments</li>
<li><strong>Code completion:</strong> Complex function implementations, regex patterns</li>
</ul>
<p>Example workflow with Copilot:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/user-service.php}}</code></pre>
<h3>OpenAI APIs</h3>
<p>OpenAI APIs can be integrated directly into your PHP applications:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/ai-code-reviewer.php}}</code></pre>
<h3>Claude</h3>
<p>Claude tends to be stronger on:</p>
<ul>
<li>Architecture discussions and design patterns</li>
<li>Complex refactoring strategies</li>
<li>Performance optimisation analysis</li>
<li>Security vulnerability assessment</li>
</ul>
<h2>AI-Enhanced Development Workflows</h2>
<h3>1. Test-Driven Development with AI</h3>
<p>AI can speed up TDD by generating a solid set of test cases:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/user-validator-test.php}}</code></pre>
<h3>2. Code Review Automation</h3>
<p>Integrate AI into your review process:</p>
<pre><code class="language-bash">{{SNIPPET:ai-enhanced-php-development/git-hook.sh}}</code></pre>
<h3>3. Documentation Generation</h3>
<p>AI can generate a first pass at documentation:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/order-processing-docblock.php}}</code></pre>
<h2>Best Practices for AI-Enhanced PHP Development</h2>
<h3>1. Validate AI-Generated Code</h3>
<p>Never trust AI-generated code blindly. Always review and test it:</p>
<ul>
<li>Check for security vulnerabilities</li>
<li>Ensure error handling is appropriate</li>
<li>Verify performance characteristics</li>
<li>Confirm adherence to coding standards</li>
</ul>
<h3>2. Use AI for Rapid Prototyping</h3>
<p>AI is great for creating initial implementations that you can then refine:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/shopping-cart-prototype.php}}</code></pre>
<p>Once the prototype proves the concept, refine it with value objects, a proper collection, and the domain rules a shopping cart actually needs:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/shopping-cart-refined.php}}</code></pre>
<h3>3. AI-Assisted Refactoring</h3>
<p>You can use AI to spot refactoring opportunities:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/user-registration-before.php}}</code></pre>
<p>Asked to refactor for readability and maintainability, AI can propose a proper separation of concerns, with validation, persistence, and event dispatch each becoming their own responsibility:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/user-registration-service.php}}</code></pre>
<h2>Implementing AI in Business Processes</h2>
<h3>Automated Code Generation</h3>
<p>You can generate CRUD operations, API endpoints, and admin interfaces with AI:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/crud-generator.php}}</code></pre>
<h3>Intelligent Error Handling</h3>
<p>AI can suggest solutions for common errors you encounter:</p>
<pre><code class="language-php">{{SNIPPET:ai-enhanced-php-development/ai-error-handler.php}}</code></pre>
<h2>Measuring AI Impact</h2>
<p>Track these metrics to see how AI impacts your development process:</p>
<ul>
<li><strong>Development speed:</strong> Time to implement features</li>
<li><strong>Code quality:</strong> Bug reports, code review feedback</li>
<li><strong>Test coverage:</strong> Automated test generation effectiveness</li>
<li><strong>Developer satisfaction:</strong> Reduced repetitive tasks</li>
</ul>
<h2>Where AI-Generated PHP Goes Wrong</h2>
<h3>Over-reliance on AI</h3>
<p>Don't let AI replace your brain:</p>
<ul>
<li>Always understand the code you're implementing</li>
<li>Question AI suggestions and validate them</li>
<li>Maintain your core programming skills</li>
</ul>
<h3>Security Blindness</h3>
<p>AI doesn't always generate secure code. Watch out for these issues:</p>
<ul>
<li>Always review for SQL injection vulnerabilities</li>
<li>Check for proper input validation</li>
<li>Ensure sensitive data handling is correct</li>
</ul>
<h3>Performance Ignorance</h3>
<p>AI-generated code isn't always fast. Check for these problems:</p>
<ul>
<li>Profile generated code for performance bottlenecks</li>
<li>Consider database query efficiency</li>
<li>Optimise algorithms for your specific use case</li>
</ul>
<h2>The Future of AI in PHP Development</h2>
<p>AI tools evolve fast. Stay ahead by:</p>
<ul>
<li>Experimenting with new AI tools and models</li>
<li>Building custom AI integrations for your specific needs</li>
<li>Sharing knowledge with the PHP community</li>
<li>Balancing AI efficiency with human expertise</li>
</ul>
<p>The pattern running through every example here is the same: use AI to generate a first draft, whether that's a prototype, a test suite, or a refactor, then apply the same scrutiny you'd give a junior developer's pull request, checking the output, the security implications, and the performance rather than taking any of it on trust. The tools save you time on the typing; they don't save you from understanding what the code actually does.</p>
</section>
    `,
  },
  // Migrating: ai-software-development-paradigm-shift.ejs
  {
    id: 'ai-software-development-paradigm-shift',
    title: 'The AI Development Paradigm Shift: Managing the Firehose',
    description:
      'AI coding assistants are fundamentally transforming software development productivity and economics. Understanding when to use AI versus deterministic code is now a critical strategic skill.',
    date: '2025-11-19',
    category: CATEGORIES.ai.id,
    heroImage: {
      src: '/images/ai-software-development-paradigm-shift/hero.webp',
      alt: 'Workers assembling flywheel magnetos along the moving conveyor at Ford’s Highland Park plant in 1913, the year the first moving assembly line was introduced',
      ogImage: '/images/ai-software-development-paradigm-shift/og.jpg',
      creditText: 'Image: U.S. National Archives, public domain, via Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Ford_assembly_line_-_1913.jpg',
    },
    readingTime: 14,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'programming',
    content: `
<div class="intro">
            <p class="lead">We're experiencing a productivity shift comparable to the leap from accountants managing slide rule calculations to a single person wielding a spreadsheet. <a href="https://github.com/features/copilot" target="_blank" rel="noopener">GitHub Copilot</a> has reached <a href="https://techcrunch.com/2025/07/30/github-copilot-crosses-20-million-all-time-users/" target="_blank" rel="noopener">20 million users</a>, with developers completing tasks <a href="https://www.secondtalent.com/resources/github-copilot-statistics/" target="_blank" rel="noopener">55% faster</a>. But AI-powered development isn't a simple productivity multiplier. It's like washing your face with a firehose: it might clean your pores brilliantly, or it might rip your face off. The difference between harnessing this power and being destroyed by it comes down to understanding AI's fundamental nature, managing its 80/20 quality split, and making strategic decisions about when to use AI versus deterministic code. For experienced developers and technical leaders, these capabilities create unprecedented opportunities. For the industry, the consequences are profound and irreversible.</p>
        </div>

        <section>
            <h2>The Uncomfortable Truth: AI is Amazing 80% of the Time</h2>

            <p>Let's establish the reality without sugar-coating: AI coding assistants like <a href="https://www.anthropic.com/claude" target="_blank" rel="noopener">Claude</a>, <a href="https://github.com/features/copilot" target="_blank" rel="noopener">GitHub Copilot</a>, and <a href="https://www.cursor.com/" target="_blank" rel="noopener">Cursor</a> produce remarkable results roughly 80% of the time. When they work, they're transformative. The remaining 20% ranges from subtly wrong to catastrophically incorrect.</p>

            <p><a href="https://arxiv.org/abs/2508.14727" target="_blank" rel="noopener">August 2025 research</a> examining five prominent <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">Large Language Models</a> (Claude Sonnet 4, Claude 3.7 Sonnet, <a href="https://cdn.openai.com/gpt-4o-system-card.pdf" target="_blank" rel="noopener">GPT-4o</a>, <a href="https://ai.meta.com/blog/llama-3-2-connect-2024-vision-edge-mobile-devices/" target="_blank" rel="noopener">Llama 3.2 90B Vision</a>, and <a href="https://github.com/OpenCoder-llm/OpenCoder-llm" target="_blank" rel="noopener">OpenCoder 8B</a>) found a disturbing reality: although LLMs can generate functional code, they introduce a range of software defects including bugs, security vulnerabilities, and <a href="https://martinfowler.com/bliki/CodeSmell.html" target="_blank" rel="noopener">code smells</a> (warning signs that code has deeper problems, like how a strange odour suggests something's off). Critically severe issues like hard-coded passwords and <a href="https://owasp.org/www-community/attacks/Path_Traversal" target="_blank" rel="noopener">path traversal vulnerabilities</a> (security flaws allowing unauthorised file access) appeared across multiple models. (Note: since this research, newer models like <a href="https://www.anthropic.com/news/claude-sonnet-4-5" target="_blank" rel="noopener">Claude Sonnet 4.5</a> released in September 2025 have been introduced, though the fundamental quality challenges remain.)</p>

            <h3>The Quality Paradox</h3>

            <p>Here's where it gets interesting: the same research found <strong>no direct correlation between a model's functional performance and overall quality</strong>. Models that passed functional tests still produced security vulnerabilities and maintainability issues. This means the industry's focus on benchmark performance is measuring the wrong thing.</p>

            <p><a href="https://www.qodo.ai/reports/state-of-ai-code-quality/" target="_blank" rel="noopener">2025 industry research</a> confirms what experienced developers already know: 25% of developers estimate that 1 in 5 AI-generated suggestions contain factual or functional errors. When you're working at AI speed, those errors compound rapidly.</p>

            <h3>The Skill That Matters Now</h3>

            <p>Understanding and managing this 80/20 split has become a critical senior-level skill. The developers who thrive aren't the ones who write the most code. They're the ones who can:</p>

            <ul>
                <li><strong>Recognise the 20%</strong>: Spot subtle incorrectness before it reaches production</li>
                <li><strong>Verify quickly</strong>: Apply <a href="https://www.techtarget.com/whatis/definition/static-analysis-static-code-analysis" target="_blank" rel="noopener">static analysis</a> (automated code checking without running the program), comprehensive testing, and code review to catch AI errors</li>
                <li><strong>Make strategic decisions</strong>: Determine when AI acceleration is appropriate versus when deterministic code is essential</li>
                <li><strong>Context management</strong>: Provide AI with the right information to maximize the 80% and minimize the 20%</li>
            </ul>

            <p>This is fundamentally different from traditional software development. The bottleneck has shifted from writing code to validating it.</p>
        </section>

        <section>
            <h2>The Mid-Level Extinction Event</h2>

            <p>Let's address the elephant in the room: mediocre mid-level developers are becoming obsolete, and not in five years' time but right now, because AI can already produce their typical output faster and often more consistently.</p>

            <h3>Why Mid-Level Roles Are Vulnerable</h3>

            <p>Traditional mid-level work included writing <a href="https://aws.amazon.com/what-is/boilerplate-code/" target="_blank" rel="noopener">boilerplate</a> (repetitive code sections copied with little variation), implementing standard patterns, and translating requirements into code. AI excels at exactly these tasks. <a href="https://www.secondtalent.com/resources/github-copilot-statistics/" target="_blank" rel="noopener">Research shows</a> developers complete tasks 55% faster with AI assistance. For routine implementation work, the productivity gains are even more dramatic.</p>

            <p>The mid-level developers who survive this transition are those who evolve from code producers to AI supervisors. They're developing new competencies:</p>

            <ul>
                <li><strong>Architectural thinking</strong>: Designing systems that AI can implement reliably</li>
                <li><strong>Quality assurance</strong>: Verifying AI output systematically rather than trusting it blindly</li>
                <li><strong>Domain expertise</strong>: Providing context and constraints that improve AI effectiveness</li>
                <li><strong>Strategic decomposition</strong>: Breaking complex problems into AI-friendly components</li>
            </ul>

            <h3>The Value Shift: From Writing to Understanding</h3>

            <p>The economics are straightforward: organisations can now achieve mid-level output with fewer people. The developers they do hire must provide value beyond code production. They need to understand systems deeply enough to verify AI output, catch subtle bugs, and make architectural decisions that AI cannot.</p>

            <p>This creates a brutal filter. Developers who relied on volume rather than insight are struggling, whilst those who built deep technical understanding and critical thinking skills are thriving, and the distinction matters more every month.</p>
        </section>

        <section>
            <h2>The Junior Developer Crisis: A Ticking Time Bomb</h2>

            <p>Here's the longer-term disaster that industry leaders aren't discussing publicly: we've stopped training junior developers. <a href="https://blog.pragmaticengineer.com/software-engineer-jobs-five-year-low/" target="_blank" rel="noopener">Current data shows</a> job listings are down approximately 35% from pre-2020 levels and <strong>70% from their 2022 peak</strong>. Entry-level postings dropped <strong>60% between 2022 and 2024</strong>.</p>

            <h3>The Five-Year Shortage</h3>

            <p>Simple maths. If we're not hiring juniors today, we won't have experienced mid-level developers in three years. We won't have senior developers in five to seven years. The industry is optimising for short-term productivity whilst destroying its long-term talent pipeline.</p>

            <p>Google and Meta are hiring <a href="https://codeconductor.ai/blog/future-of-junior-developers-ai/" target="_blank" rel="noopener">approximately 50% fewer new graduates</a> compared to 2021. The business logic makes sense today: why hire juniors who need training when AI can produce similar code quality immediately? But in 2030, when those companies desperately need senior engineers who've spent years understanding complex systems, the talent simply won't exist.</p>

            <h3>What Junior Developers Learn That AI Cannot Replace</h3>

            <p>Junior developer programmes teach crucial skills that aren't about code production:</p>

            <ul>
                <li><strong>System thinking</strong>: Understanding how components interact and where complexity hides</li>
                <li><strong>Debugging methodology</strong>: Systematic approaches to finding and fixing issues</li>
                <li><strong>Code archaeology</strong>: Reading and understanding existing codebases</li>
                <li><strong>Production awareness</strong>: Learning what happens when code meets real users and real data</li>
                <li><strong>Team collaboration</strong>: Working within existing processes and communicating technical decisions</li>
            </ul>

            <p>These capabilities develop through years of experience. You cannot shortcut them. Organisations assuming they can hire senior developers as needed will discover a market failure when demand vastly exceeds supply.</p>

            <h3>The Strategic Misstep</h3>

            <p>Industry-wide, we're making a collective strategic error. Companies are optimising quarterly productivity whilst neglecting long-term capability development. The organisations that maintain junior developer programmes and invest in training will have decisive competitive advantages in five years. Everyone else will be fighting over a shrinking pool of experienced talent.</p>
        </section>

        <section>
            <h2>The Free Lunch Problem: Economics of AI Coding Tools</h2>

            <p>Current AI coding assistant pricing is unsustainable. <a href="https://www.wheresyoured.at/why-everybody-is-losing-money-on-ai/" target="_blank" rel="noopener">Industry analysis reveals</a> that <strong>OpenAI is expected to lose upwards of $8 billion in 2025</strong>, whilst <strong>Anthropic is losing $3 billion</strong>. These companies are spending huge amounts of revenue on inference compute costs, with even more going to training compute.</p>

            <h3>The Subsidy Reality</h3>

            <p>Every AI coding assistant is currently subsidised by venture capital or corporate strategic investment.
            <a href="https://www.cursor.com/" target="_blank" rel="noopener">Cursor</a>, which generates <a href="https://altersquare.io/cursor-github-copilot-claude-ai-coding-tool-comparison/" target="_blank" rel="noopener">$500 million in annualised recurring revenue</a>,
            spends most of that on inference costs across the model providers it supports, including <a href="https://www.anthropic.com/" target="_blank" rel="noopener">Anthropic</a>. They're losing money on every customer.</p>

            <p>I think this is intentional. Rather like crack dealers getting everyone hooked before raising prices, AI companies appear to be building dependency before implementing sustainable pricing, and the strategy is working: <a href="https://www.qodo.ai/reports/state-of-ai-code-quality/" target="_blank" rel="noopener">82% of developers</a> now use AI coding assistants daily or weekly.</p>

            <h3>When the Bill Comes Due</h3>

            <p>The current pricing model cannot persist. When (not if) AI coding assistants move to profitable pricing:</p>

            <ul>
                <li><strong>Usage-based costs will increase</strong>: Per-token or per-request pricing will rise substantially</li>
                <li><strong>Free tiers will disappear</strong>: Current generous limits will shrink or vanish</li>
                <li><strong>Organisational costs will spike</strong>: A 500-developer team using <a href="https://github.com/features/copilot" target="_blank" rel="noopener">GitHub Copilot Business</a> currently faces <a href="https://getdx.com/blog/ai-coding-assistant-pricing/" target="_blank" rel="noopener">$114k annually</a>. Without massive improvements in model efficiency, consumption costs could explode to levels we cannot predict</li>
                <li><strong>Strategic differentiation will emerge</strong>: Organisations that use AI efficiently will have massive cost advantages</li>
            </ul>

            <h3>The Efficiency Imperative</h3>

            <p>Smart organisations are already preparing for this transition. They're building systems that:</p>

            <ul>
                <li><strong>Minimise token waste</strong>: Use AI for problems where it provides value, not deterministic tasks</li>
                <li><strong>Cache and reuse</strong>: Store AI-generated solutions to common problems rather than regenerating them</li>
                <li><strong>Strategic decomposition</strong>: Structure work to maximise AI effectiveness per token spent</li>
                <li><strong>Task-appropriate model selection</strong>: You don't need 671 billion parameters to write boilerplate code. A 20B model will do. Match model size to task complexity</li>
                <li><strong>Context engineering</strong>: Design efficient prompts and workflows that achieve results with minimal token consumption</li>
                <li><strong>Sub-agent tasking with cheaper models</strong>: Use smaller models like Haiku for straightforward tasks, reserving expensive models for complex problems</li>
                <li><strong>Explore local and open source models</strong>: Build capability with locally hosted models to avoid consumption-based pricing entirely for appropriate workloads</li>
                <li><strong>AI routing strategies</strong>: Implement routers that dynamically route requests to the cheapest model capable of handling each specific task</li>
            </ul>

            <p>When AI pricing reaches sustainable levels, these practices will separate efficient from inefficient organisations. The difference won't be 10% or 20%. It could be multiples of operating cost.</p>
        </section>

        <section>
            <h2>Strategic Decision Framework: AI Versus Deterministic Code</h2>

            <p>The most valuable skill for senior developers and technical leaders is knowing when to use AI and when to write traditional <a href="https://en.wikipedia.org/wiki/Deterministic_algorithm" target="_blank" rel="noopener">deterministic code</a> (code that always produces the same output for the same input, with predictable, reliable behaviour). The value here goes beyond cost efficiency: it's also about system reliability, maintainability, and long-term viability.</p>

            <h3>When AI Excels</h3>

            <p>AI coding assistants provide genuine value for specific use cases:</p>

            <ul>
                <li><strong>Exploratory development</strong>: Rapid prototyping and experimentation where correctness is less critical</li>
                <li><strong>Boilerplate generation</strong>: Repetitive patterns like <a href="https://martinfowler.com/eaaCatalog/dataTransferObject.html" target="_blank" rel="noopener">DTOs</a> (data transfer objects that carry information between systems), basic <a href="https://www.codecademy.com/article/what-is-crud-explained" target="_blank" rel="noopener">CRUD</a> operations (Create, Read, Update, Delete - the four basic database actions), and standard structures</li>
                <li><strong>Format transformations</strong>: Converting data between representations or translating between languages</li>
                <li><strong>Test generation</strong>: Creating test cases, especially <a href="https://www.guru99.com/what-is-boundary-value-analysis-and-equivalence-partitioning.html" target="_blank" rel="noopener">edge cases</a> (unusual or extreme input scenarios that might break the system)</li>
                <li><strong>Documentation and comments</strong>: Explaining existing code or generating API documentation</li>
                <li><strong>Refactoring assistance</strong>: Suggesting improvements to existing code structure</li>
            </ul>

            <p>For these tasks, AI's 80/20 quality split is acceptable. The 20% of errors are usually obvious and easy to fix. The productivity gains justify the verification overhead.</p>

            <h3>When Deterministic Code is Essential</h3>

            <p>Critical systems require absolute reliability that AI cannot guarantee:</p>

            <ul>
                <li><strong>Security-sensitive code</strong>: Authentication, authorisation, cryptography, input validation. <a href="https://arxiv.org/abs/2508.14727" target="_blank" rel="noopener">Research shows</a> AI generates security vulnerabilities including hard-coded passwords and path traversal issues</li>
                <li><strong>Performance-critical paths</strong>: Code where efficiency directly impacts business outcomes or user experience</li>
                <li><strong>Financial calculations</strong>: Anything involving money, where subtle errors create legal and financial liability</li>
                <li><strong>Data integrity operations</strong>: Database migrations, data transformations, validation logic</li>
                <li><strong>Core business logic</strong>: The unique algorithms and processes that differentiate your product</li>
                <li><strong>Compliance-required code</strong>: Systems subject to regulatory oversight or audit requirements</li>
            </ul>

            <p>For these use cases, the risk from AI's 20% failure rate is unacceptable. A subtle bug in authentication could compromise an entire system. An incorrect financial calculation could cost millions. Write these systems deterministically, with comprehensive testing and review.</p>

            <h3>The Hybrid Approach</h3>

            <p>The most effective strategy combines both approaches strategically:</p>

            <ul>
                <li><strong>AI for scaffolding</strong>: Generate initial structure and boilerplate</li>
                <li><strong>Human for critical logic</strong>: Write security, performance, and business-critical code deterministically</li>
                <li><strong>AI for amplification</strong>: Use AI to suggest test cases, documentation, and edge cases</li>
                <li><strong>Human for verification</strong>: Apply rigorous review, static analysis and testing to all AI output</li>
            </ul>

            <p>This approach maximises productivity whilst managing risk. It also prepares organisations for the economic reality when AI pricing increases.</p>
        </section>

        <section>
            <h2>The Coming Crunch: Preparing for Sustainable AI Economics</h2>

            <p>The AI coding assistant market is heading towards an inevitable correction. Organisations that prepare now will have substantial advantages over those caught unprepared.</p>

            <h3>Building AI-Aware Systems</h3>

            <p>Architecture decisions made today should account for future AI economics:</p>

            <ul>
                <li><strong>Modular design with clear boundaries</strong>: Structure systems so components can be implemented with or without AI assistance, and define which parts of your codebase are AI-appropriate versus which require deterministic development</li>
                <li><strong>Verification infrastructure</strong>: Build comprehensive testing, <a href="https://psalm.dev/" target="_blank" rel="noopener">static analysis</a>, and code review processes that catch AI errors systematically</li>
                <li><strong>Knowledge capture</strong>: Document architectural decisions and domain knowledge so AI has better context</li>
            </ul>

            <h3>Organisational Capability Development</h3>

            <p>Beyond technical architecture, organisations need to develop specific competencies:</p>

            <ul>
                <li><strong>AI literacy programmes</strong>: Train developers on effective AI use, prompt engineering, and output verification</li>
                <li><strong>Quality metrics</strong>: Measure not just development speed but quality, security, and maintainability of AI-assisted code</li>
                <li><strong>Cost awareness</strong>: Track AI usage and costs now whilst they're low to understand patterns before pricing increases</li>
                <li><strong>Talent investment</strong>: Continue hiring and training junior developers despite short-term cost pressures</li>
            </ul>

            <h3>Strategic Positioning</h3>

            <p>The organisations that will thrive in the post-subsidy AI era are those making strategic decisions now:</p>

            <ul>
                <li><strong>Efficiency focus</strong>: Build practices around effective AI use, not maximum AI use</li>
                <li><strong>Deterministic core</strong>: Maintain the ability to write reliable, efficient code without AI assistance</li>
                <li><strong>Talent pipeline</strong>: Invest in developing senior engineers who can verify and improve AI output</li>
                <li><strong>Architectural discipline</strong>: Design systems that make good decisions about when to use AI versus deterministic code</li>
            </ul>

            <p><a href="https://www.gitclear.com/ai_assistant_code_quality_2025_research" target="_blank" rel="noopener">2025 research from GitClear</a> suggests a concerning trend: AI copilot code quality shows 4x growth in code clones and increasing maintainability challenges. Organisations that focus purely on short-term velocity without investing in quality and verification are building <a href="https://www.productplan.com/glossary/technical-debt/" target="_blank" rel="noopener">technical debt</a> (accumulated costs from choosing quick solutions over better approaches, like financial debt that compounds over time) at unprecedented speed.</p>
        </section>

        <section>
            <h2>Why Experienced Developers Are More Valuable Than Ever</h2>

            <p>Despite (or perhaps because of) AI's capabilities, experienced developers with deep technical understanding are becoming significantly more valuable. This might seem counterintuitive, but the economics are clear.</p>

            <h3>The Verification Premium</h3>

            <p>Someone needs to verify AI output. That someone must understand:</p>

            <ul>
                <li><strong>What correct code looks like</strong>: Beyond functional tests, does this code follow best practices and patterns?</li>
                <li><strong>Where subtle bugs hide</strong>: <a href="https://www.techtarget.com/searchstorage/definition/race-condition" target="_blank" rel="noopener">Race conditions</a> (bugs where timing of operations affects outcome, like two processes competing for the same resource), edge cases, security vulnerabilities that tests might miss</li>
                <li><strong>Maintainability implications</strong>: Will this code be understandable and modifiable in six months?</li>
                <li><strong>Performance characteristics</strong>: Is this algorithm appropriate for the expected data volumes?</li>
            </ul>

            <p>This verification skill requires years of experience seeing code in production, debugging complex issues, and understanding system behaviour under stress. AI cannot replace it because AI cannot reliably evaluate its own output.</p>

            <h3>The Architectural Advantage</h3>

            <p>AI excels at implementation but struggles with architecture. Experienced developers who can design systems that are:</p>

            <ul>
                <li><strong>AI-appropriate</strong>: Structured to maximize AI effectiveness</li>
                <li><strong>Verifiable</strong>: Designed with testing and validation in mind</li>
                <li><strong>Maintainable</strong>: Clear boundaries and responsibilities that resist complexity</li>
                <li><strong>Resilient</strong>: Capable of handling the edge cases AI might miss</li>
            </ul>

            <p>This architectural skill becomes more valuable as organisations scale AI-assisted development. The difference between a well-architected system and an AI-generated mess compounds over time.</p>

            <h3>The Strategic Skill: Knowing When Not to Use AI</h3>

            <p>Perhaps most importantly, experienced developers can make strategic decisions about when AI is appropriate. This judgment, knowing when to use the firehose and when to use a precision tool, cannot be automated. It requires understanding:</p>

            <ul>
                <li><strong>Business context</strong>: How critical is this code to business operations?</li>
                <li><strong>Risk versus reward</strong>: What's the impact if this code has subtle bugs, and is the AI efficiency gain worth the verification overhead?</li>
                <li><strong>Long-term implications</strong>: How will this decision affect maintainability and technical debt?</li>
            </ul>

            <p>Organisations that empower experienced developers to make these strategic decisions will outperform those that simply maximise AI usage.</p>

            <h3>The Human Intelligence AI Cannot Replicate</h3>

            <p>There's a category of expertise that AI fundamentally cannot provide: reading people. Experienced developers bring interpersonal intelligence that goes far beyond code review and technical decisions. They understand context that exists between the lines of Slack messages, recognise when team members are struggling, and sense the difference between what someone says they need and what they actually need.</p>

            <p>Consider the classic <a href="https://xyproblem.info/" target="_blank" rel="noopener">XY Problem</a>. A client, product manager, or CEO asks how to implement X, but what they really need is Y. They've fixated on what they believe is the solution (X) and are asking about their attempted solution rather than their actual underlying problem (Y). AI takes questions literally. Ask it for X, it gives you X. An experienced developer senses something's off. They ask "What are you actually trying to accomplish?" and uncover the real problem. That's more than technical knowledge - it's human intuition developed through years of conversations, requirements gathering, and watching stakeholders work through problems. You recognise the pattern because you've seen it dozens of times. The junior developer builds exactly what was requested. The senior developer digs deeper to find out what's actually needed.</p>

            <p>This human intelligence extends to reading situations that never make it into written communication. Steve's being erratic today because his wife just left him. Sarah's pushing back on this proposal not because of technical concerns but because she feels her expertise is being dismissed. The team's productivity dropped not because of the new framework but because morale collapsed after redundancies. Experienced developers read <a href="https://www.paulekman.com/resources/micro-expressions/" target="_blank" rel="noopener">micro-expressions</a> (involuntary facial expressions lasting fractions of a second that reveal suppressed emotions), tone shifts in written communication, and contextual awareness that comes from knowing people's circumstances. You learn to gauge someone's emotional state from a code review comment. You recognise when someone needs support versus when they need to be pushed. You see the brief flash of frustration on someone's face before they say "I'm fine with that approach."</p>

            <p>AI increases code velocity, which paradoxically makes human communication skills more valuable. More code means more integration points. More integration points mean more human coordination required. The better AI gets at generating code, the more critical human skills become for managing the people who verify it, integrate it, and maintain it. Teams don't fail because of bad code. They fail because of misunderstandings, miscommunication, and unaddressed interpersonal dynamics.</p>

            <p>Experienced developers who can bridge between AI-generated solutions and human needs become force multipliers. They translate business requirements into AI-appropriate tasks. They recognise when a technical debate is really about something else entirely. They understand team dynamics and political undercurrents that affect how solutions get adopted. These skills cannot be automated because they require understanding humans as complex, emotional beings navigating organisational structures. AI sees text. Humans see context, subtext, and everything that goes unspoken.</p>

            <p>The developers who thrive in the AI era won't be the ones who prompt engineer most effectively. They'll be the ones who combine technical expertise with the interpersonal intelligence to understand what problems actually need solving, who's equipped to solve them, and what human factors will determine whether solutions succeed or fail. That's not a skill you learn from documentation. It's wisdom earned through years of working with real teams solving real problems.</p>
        </section>

        <section>
            <h2>Practical Recommendations for Technology Leaders</h2>

            <h3>For Senior Developers and Technical Leads</h3>

            <ul>
                <li><strong>Develop verification expertise</strong>: Become proficient at rapidly evaluating AI-generated code for correctness, security, and maintainability</li>
                <li><strong>Build strategic judgment</strong>: Learn to identify which problems benefit from AI and which require deterministic approaches</li>
                <li><strong>Master prompt engineering</strong>: Effective AI use requires providing proper context and constraints</li>
                <li><strong>Invest in fundamentals</strong>: Deep understanding of algorithms, data structures, and system design becomes more valuable, not less</li>
                <li><strong>Document extensively</strong>: Clear documentation improves AI effectiveness and helps future developers understand AI-generated code</li>
            </ul>

            <h3>For Engineering Managers and CTOs</h3>

            <ul>
                <li><strong>Maintain junior programmes</strong>: Continue hiring and training entry-level developers despite short-term cost pressures</li>
                <li><strong>Establish quality standards</strong>: Implement <a href="https://www.sonarqube.org/" target="_blank" rel="noopener">static analysis</a>, comprehensive testing, and rigorous code review for all AI-assisted code</li>
                <li><strong>Track AI economics</strong>: Monitor usage patterns and costs to prepare for inevitable pricing increases</li>
                <li><strong>Build verification culture</strong>: Emphasise that AI suggestions require validation, not blind acceptance</li>
                <li><strong>Define appropriate use</strong>: Create clear guidelines for when AI is appropriate versus when deterministic code is required</li>
                <li><strong>Invest in senior talent</strong>: Experienced developers who can verify AI output and make strategic decisions are critical</li>
            </ul>

            <h3>For Organisations</h3>

            <ul>
                <li><strong>Strategic architecture</strong>: Design systems with clear boundaries between AI-appropriate and deterministic components</li>
                <li><strong>Efficiency focus</strong>: Optimise for effective AI use, not maximum AI use</li>
                <li><strong>Long-term planning</strong>: Account for AI pricing increases and talent pipeline challenges in strategic planning</li>
                <li><strong>Quality infrastructure</strong>: Invest in automated testing, static analysis, and security scanning infrastructure</li>
                <li><strong>Knowledge management</strong>: Build systems to capture and share architectural decisions and domain knowledge</li>
            </ul>
        </section>

        <section>
            <h2>The Future: Navigating the Paradigm Shift</h2>

            <p>AI has fundamentally changed software development. The change is permanent and accelerating. But like any powerful tool, success requires understanding both capabilities and limitations.</p>

            <p>The developers and organisations that thrive in this new environment share common characteristics: they use AI strategically (not maximally), they invest in verification and quality infrastructure, they maintain deep technical expertise, and they make informed decisions about when AI is appropriate versus when deterministic code is essential.</p>

            <p>The coming years will separate those who manage the firehose effectively from those who get swept away by it. Organisations that optimise purely for short-term AI productivity without investing in quality, verification and talent development are building unsustainable systems. When AI pricing inevitably increases and the talent shortage materialises, they'll face a crisis.</p>

            <p>The strategic opportunity is clear: use AI to amplify productivity whilst maintaining the deep technical expertise and rigorous verification practices that ensure reliability. Build systems that make intelligent decisions about when to use AI versus deterministic code. Invest in talent development despite short-term pressures. Prepare for economic realities when AI subsidies end.</p>

            <p>The paradigm shift is accelerating, and AI transforming software development is no longer really in question. Whether your organisation harnesses that transformation strategically, or gets overwhelmed by it, depends on the decisions you make today about architecture, talent and engineering culture.</p>

            <p>We're not washing our faces with a garden hose anymore. We're managing industrial-grade water pressure. Learn to control the valve, understand when to use it, and maintain alternative approaches for situations where precision matters more than volume. That's the strategic skill that separates thriving from surviving in the AI development era.</p>
        </section>
    `,
  },
  // Migrating: ansible-fact-caching-problems.ejs
  {
    id: 'ansible-fact-caching-problems',
    title: 'Ansible Fact Caching: The --limit Problem and Environment Separation Pain Points',
    description:
      'Deep dive into Ansible fact caching limitations with --limit operations and the lack of dynamic cache location configuration for multi-environment deployments.',
    date: '2025-01-29',
    category: CATEGORIES.infrastructure.id,
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'devops',
    heroImage: {
      src: '/images/ansible-fact-caching-problems/hero.webp',
      alt: 'A black-and-white historical photograph of the Library of Congress Card Division, showing clerks filing catalog cards across long tables in front of a wall of card-catalog drawer cabinets',
      ogImage: '/images/ansible-fact-caching-problems/og.jpg',
      creditText: 'Image: Library of Congress, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Card_Division_of_the_Library_of_Congress_3c18631u_original.jpg',
    },
    content: `
<div class="intro">
            <p class="lead">
                <a href="https://www.ansible.com/" target="_blank" rel="noopener">Ansible</a> fact caching promises
                performance improvements and cross-playbook fact persistence, but in practice it delivers a couple of
                frustrating limitations that have plagued operations teams for years: you can't use memory caching with
                <a href="https://docs.ansible.com/ansible/latest/cli/ansible-playbook.html#cmdoption-ansible-playbook-limit" target="_blank" rel="noopener">--limit operations</a>,
                and there's no way to configure dynamic cache locations. Neither problem has an elegant solution, which
                leaves operations teams carrying the resulting complexity themselves.
            </p>
        </div>

        <section>
            <h2>The Memory Cache --limit Catastrophe</h2>
            <p>
                <a href="https://docs.ansible.com/ansible/latest/plugins/cache.html" target="_blank" rel="noopener">Ansible's memory cache plugin</a>
                is the default fact caching mechanism, and it only stores facts for the current playbook execution,
                which breaks targeted deployments the moment you bring the --limit flag into play.
            </p>
            
            <h3>The Core Problem</h3>
            <p>
                When you use memory caching with --limit, <a href="https://docs.ansible.com/ansible/latest/" target="_blank" rel="noopener">Ansible</a>
                only gathers facts for hosts within the limit scope, which means playbook tasks that reference
                <code>hostvars</code> for hosts outside that limit will fail:
            </p>
            
            <pre><code class="language-yaml">{{SNIPPET:ansible-fact-caching-problems/memory-cache-issue.yml}}
</code></pre>
            
            <p>
                Running this playbook with <code>--limit app01</code> fails. The database server 
                facts aren't gathered, so <code>hostvars[groups['db_servers'][0]]</code> is empty.
            </p>
            
            <h3>The Devastating Impact</h3>
            <p>
                This limitation makes memory caching incompatible with common operational patterns:
            </p>
            
            <ul>
                <li><strong>Rolling deployments</strong>: Cannot deploy one server at a time when templates reference other servers</li>
                <li><strong>Targeted maintenance</strong>: Emergency fixes to single hosts fail when they depend on cluster facts</li>
                <li><strong>Load balancer updates</strong>: Cannot update one load balancer with backend pool information</li>
                <li><strong>Cross-service coordination</strong>: Microservice deployments break when services reference each other</li>
            </ul>
            
            <pre><code class="language-bash">{{SNIPPET:ansible-fact-caching-problems/failing-limit-run.sh}}
</code></pre>
        </section>

        <section>
            <h2>File-Based Caching: Trading One Problem for Another</h2>
            <p>
                The obvious solution is switching to
                <a href="https://docs.ansible.com/ansible/latest/collections/ansible/builtin/jsonfile_cache.html" target="_blank" rel="noopener">persistent cache plugins</a>
                like <code>jsonfile</code> or <a href="https://redis.io/" target="_blank" rel="noopener">Redis</a>, which solves the
                --limit problem but introduces an equally frustrating environment separation issue of its own.
            </p>
            
            <h3>The Environment Isolation Problem</h3>
            <p>
                Multi-environment infrastructures need isolated fact caches to prevent cross-contamination between
                development, staging and production environments, but Ansible provides no mechanism to configure
                cache locations dynamically.
            </p>

            <p>
                The <code>fact_caching_connection</code> parameter is read once at startup from
                <a href="https://docs.ansible.com/ansible/latest/reference_appendices/config.html" target="_blank" rel="noopener">ansible.cfg</a>
                and can't be changed dynamically, which makes a single shared configuration impossible across environments:
            </p>
            
            <pre><code class="language-yaml">{{SNIPPET:ansible-fact-caching-problems/attempted-dynamic-cache.yml}}
</code></pre>
        </section>

        <section>
            <h2>The Only Working Solutions: Operational Workarounds</h2>
            <p>
                After years of living with this limitation, operations teams have developed several workarounds,
                though I'd stop short of calling any of them elegant or something you'd want to maintain at scale.
            </p>
            
            <h3>Workaround 1: Pre-populate Cache Strategy</h3>
            <p>
                The most reliable approach is running a dedicated fact-gathering playbook before 
                any --limit operations:
            </p>
            
            <pre><code class="language-yaml">{{SNIPPET:ansible-fact-caching-problems/gather-facts-playbook.yml}}
</code></pre>
            
            <p>
                This requires a two-step process for every targeted deployment:
            </p>
            
            <pre><code class="language-bash">{{SNIPPET:ansible-fact-caching-problems/workaround-gather-facts.sh}}
</code></pre>
            
            <h4>Drawbacks of Cache Pre-population</h4>
            <ul>
                <li><strong>Performance penalty</strong>: Must gather facts for all hosts even for small changes</li>
                <li><strong>Stale data risk</strong>: Cache might contain outdated information for non-targeted hosts</li>
                <li><strong>Operational complexity</strong>: Every deployment becomes a multi-step process</li>
                <li><strong>Emergency response impact</strong>: Critical fixes require full fact gathering first</li>
            </ul>
            
            <h3>Workaround 2: Environment-Specific Configuration Files</h3>
            <p>
                For environment separation, the only solution is maintaining separate 
                <code>ansible.cfg</code> files with different cache locations:
            </p>
            
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Environment</th>
                            <th>Configuration File</th>
                            <th>Cache Location</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Development</td>
                            <td><code>ansible-dev.cfg</code></td>
                            <td><code>/tmp/ansible-facts-dev</code></td>
                        </tr>
                        <tr>
                            <td>Staging</td>
                            <td><code>ansible-staging.cfg</code></td>
                            <td><code>/tmp/ansible-facts-staging</code></td>
                        </tr>
                        <tr>
                            <td>Production</td>
                            <td><code>ansible-prod.cfg</code></td>
                            <td><code>/tmp/ansible-facts-prod</code></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <p>Development configuration example:</p>
            
            <pre><code class="language-ini">{{SNIPPET:ansible-fact-caching-problems/ansible-cfg-dev.ini}}
</code></pre>
            
            <p>Production configuration example:</p>
            
            <pre><code class="language-ini">{{SNIPPET:ansible-fact-caching-problems/ansible-cfg-prod.ini}}
</code></pre>
            
            <h4>Environment-Specific Execution Script</h4>
            <p>
                Most teams wrap <code>ansible-playbook</code> in environment-aware scripts:
            </p>
            
            <pre><code class="language-bash">{{SNIPPET:ansible-fact-caching-problems/env-specific-script.sh}}
</code></pre>
            
            <h4>Configuration Maintenance Nightmare</h4>
            <ul>
                <li><strong>Configuration drift</strong>: Multiple files inevitably diverge over time</li>
                <li><strong>Documentation burden</strong>: Teams must document which config to use when</li>
                <li><strong>Error-prone operations</strong>: Easy to use wrong configuration file</li>
                <li><strong>Onboarding complexity</strong>: New team members struggle with multiple configs</li>
            </ul>
        </section>

        <section>
            <h2>Alternative Cache Plugins: Same Problems, Different Complexity</h2>
            <p>
                <a href="https://redis.io/" target="_blank" rel="noopener">Redis</a> and other persistent
                cache plugins solve the --limit problem, but they don't address environment separation:
            </p>
            
            <pre><code class="language-ini">{{SNIPPET:ansible-fact-caching-problems/redis-cache-config.ini}}
</code></pre>
            
            <h3>Redis Cache Limitations</h3>
            <ul>
                <li><strong>No key prefixing</strong>: Cannot separate environments in single Redis instance</li>
                <li><strong>Infrastructure dependency</strong>: Requires Redis server management</li>
                <li><strong>Network complexity</strong>: Another service to secure and monitor</li>
                <li><strong>Cross-environment contamination</strong>: All environments share same keyspace</li>
            </ul>
            
            <h3>Memory Usage Concerns</h3>
            <p>
                Recent <a href="https://github.com/ansible/awx/issues/15827" target="_blank" rel="noopener">AWX issue reports</a>
                highlight memory consumption problems with fact caching in large inventories: each job can consume 1.7GB+
                of memory when caching facts for 1700+ hosts, which is enough to push the controller into
                <a href="https://en.wikipedia.org/wiki/Out_of_memory" target="_blank" rel="noopener">OOM conditions</a>.
            </p>
        </section>

        <section>
            <h2>The Real-World Impact</h2>
            <p>
                These limitations create operational friction that affects entire organisations:
            </p>
            
            <h3>DevOps Team Frustration</h3>
            <ul>
                <li><strong>Deployment delays</strong>: Simple changes require complex pre-steps</li>
                <li><strong>Emergency response problems</strong>: Critical fixes can't be deployed quickly</li>
                <li><strong>Tool complexity</strong>: Wrapper scripts and documentation overhead</li>
                <li><strong>Training burden</strong>: New team members need extensive onboarding</li>
            </ul>
            
            <h3>Architectural Compromises</h3>
            <p>
                Teams often architect around Ansible's limitations instead of optimal infrastructure:
            </p>
            
            <ul>
                <li><strong>Avoiding cross-references</strong>: Designing services to not reference each other</li>
                <li><strong>Static configurations</strong>: Using hardcoded values instead of dynamic discovery</li>
                <li><strong>Monolithic playbooks</strong>: Avoiding modular designs that would require --limit</li>
                <li><strong>External coordination</strong>: Using other tools for tasks Ansible should handle</li>
            </ul>
        </section>

        <section>
            <h2>What Ansible Should Provide (But Doesn't)</h2>
            <p>
                The Ansible community has requested these features for years, and they remain unimplemented:
            </p>
            
            <h3>Dynamic Cache Configuration</h3>
            <p>
                The ability to set cache locations dynamically would solve the environment separation problem:
            </p>
            
            <pre><code class="language-yaml">{{SNIPPET:ansible-fact-caching-problems/hypothetical-dynamic-set-fact.yml}}</code></pre>

            <h3>Environment Variables for Cache Paths</h3>
            <p>
                Environment variable support for all cache plugin parameters would enable flexible deployments:
            </p>

            <pre><code class="language-bash">{{SNIPPET:ansible-fact-caching-problems/hypothetical-env-var-cache.sh}}</code></pre>

            <h3>Cache Key Prefixing</h3>
            <p>
                Built-in support for cache key prefixes would enable environment separation with shared backends:
            </p>

            <pre><code class="language-ini">{{SNIPPET:ansible-fact-caching-problems/hypothetical-cache-prefix.ini}}</code></pre>
        </section>

        <section>
            <h2>Performance and Scalability Considerations</h2>
            <p>
                Beyond functionality issues, fact caching introduces performance considerations that operations
                teams need to manage carefully:
            </p>
            
            <h3>Memory Consumption Patterns</h3>
            <ul>
                <li><strong>Large inventories</strong>: Memory usage scales linearly with host count</li>
                <li><strong>Rich fact sets</strong>: Modern systems generate extensive fact data</li>
                <li><strong>Controller limits</strong>: <a href="https://docs.ansible.com/ansible-tower/" target="_blank" rel="noopener">AWX/Tower</a> controllers can hit memory limits</li>
                <li><strong>Concurrent jobs</strong>: Multiple playbooks multiply memory usage</li>
            </ul>
            
            <h3>Cache Timeout Management</h3>
            <p>
                <a href="https://docs.ansible.com/ansible/latest/reference_appendices/config.html#fact-caching-timeout" target="_blank" rel="noopener">Cache timeout configuration</a> 
                requires balancing performance with data freshness:
            </p>
            
            <ul>
                <li><strong>Short timeouts</strong>: Frequent fact gathering negates performance benefits</li>
                <li><strong>Long timeouts</strong>: Stale data leads to deployment inconsistencies</li>
                <li><strong>Environment differences</strong>: Production needs longer caches than development</li>
                <li><strong>Cache invalidation</strong>: No mechanism for selective cache clearing</li>
            </ul>
        </section>

        <section>
            <h2>Best Practices for Working Around the Pain</h2>
            <p>
                Until Ansible addresses these fundamental limitations, operations teams can minimise
                the pain with disciplined practices:
            </p>
            
            <h3>Operational Discipline</h3>
            <ul>
                <li><strong>Standardise scripts</strong>: Always use wrapper scripts for environment selection</li>
                <li><strong>Document extensively</strong>: Clear procedures for cache management</li>
                <li><strong>Automate cache warming</strong>: <a href="https://docs.ansible.com/ansible/latest/collections/ansible/builtin/cron_module.html" target="_blank" rel="noopener">Cron jobs</a> to pre-populate caches</li>
                <li><strong>Monitor cache health</strong>: Alerts for cache staleness and size</li>
            </ul>
            
            <h3>Architecture Patterns</h3>
            <ul>
                <li><strong>Minimise cross-references</strong>: Reduce dependencies between host groups</li>
                <li><strong>External discovery</strong>: Use <a href="https://consul.io/" target="_blank" rel="noopener">Consul</a> or similar for service discovery</li>
                <li><strong>Template pre-processing</strong>: Generate configurations outside Ansible</li>
                <li><strong>Incremental deployments</strong>: Design for full-environment updates</li>
            </ul>
            
            <h3>Monitoring and Alerting</h3>
            <ul>
                <li><strong>Cache size monitoring</strong>: Track memory and disk usage</li>
                <li><strong>Fact freshness checks</strong>: Verify cache timestamps</li>
                <li><strong>Failed deployment alerts</strong>: Quick detection of cache-related failures</li>
                <li><strong>Performance tracking</strong>: Monitor fact gathering times</li>
            </ul>
        </section>

        <section>
            <h2>Alternative Tools and Migration Strategies</h2>
            <p>
                Some organisations eventually abandon Ansible fact caching entirely and migrate to
                tools with better architectural support for these use cases:
            </p>
            
            <h3>External Fact Management</h3>
            <ul>
                <li><strong><a href="https://consul.io/" target="_blank" rel="noopener">HashiCorp Consul</a></strong>: Service discovery with environment isolation</li>
                <li><strong><a href="https://etcd.io/" target="_blank" rel="noopener">etcd</a></strong>: Distributed key-value store with namespace support</li>
                <li><strong><a href="https://www.vaultproject.io/" target="_blank" rel="noopener">HashiCorp Vault</a></strong>: Secrets and configuration management</li>
                <li><strong>Custom APIs</strong>: Application-specific configuration services</li>
            </ul>
            
            <h3>Configuration Management Alternatives</h3>
            <ul>
                <li><strong><a href="https://www.terraform.io/" target="_blank" rel="noopener">Terraform</a></strong>: Infrastructure as code with better state management</li>
                <li><strong><a href="https://www.pulumi.com/" target="_blank" rel="noopener">Pulumi</a></strong>: Modern infrastructure as code with programming languages</li>
                <li><strong><a href="https://kubernetes.io/" target="_blank" rel="noopener">Kubernetes</a></strong>: Container orchestration with built-in service discovery</li>
                <li><strong><a href="https://nomadproject.io/" target="_blank" rel="noopener">HashiCorp Nomad</a></strong>: Workload orchestration with service mesh</li>
            </ul>
        </section>

        <section>
            <h2>The Path Forward: Community and Vendor Response</h2>
            <p>
                This pain has persisted for years despite extensive community discussion, and whilst the
                <a href="https://github.com/ansible/ansible" target="_blank" rel="noopener">Ansible project</a>
                acknowledges these limitations, it offers no roadmap for resolving them.
            </p>
            
            <h3>Community Workarounds</h3>
            <p>
                The community has developed numerous workarounds, though they remain fragmented and
                organisation-specific. Popular approaches include:
            </p>
            
            <ul>
                <li><strong>Custom cache plugins</strong>: Organisation-specific solutions</li>
                <li><strong>Wrapper tooling</strong>: Scripts and frameworks around Ansible</li>
                <li><strong>Hybrid architectures</strong>: Combining Ansible with other tools</li>
                <li><strong>Process changes</strong>: Adapting workflows to tool limitations</li>
            </ul>
            
            <h3>Vendor Solutions</h3>
            <p>
                <a href="https://www.redhat.com/en/technologies/management/ansible" target="_blank" rel="noopener">Red Hat's Ansible Automation Platform</a>
                provides some improvements through <a href="https://docs.ansible.com/automation-controller/" target="_blank" rel="noopener">Automation Controller</a>
                (formerly AWX/Tower), but the core fact caching limitations remain.
            </p>
        </section>

        <section>
            <h2>Conclusion: Living with the Pain</h2>
            <p>
                Ansible fact caching is one of those infrastructure tools that promises elegant solutions but delivers
                operational complexity instead: the fundamental limitations around --limit operations and environment
                separation have no clean solution, which forces operations teams into elaborate workarounds.
            </p>
            
            <p>
                The memory cache --limit incompatibility makes the default configuration unsuitable for production
                operations, and persistent caching only trades that problem for a different one: the complex
                configuration management needed to achieve environment separation. After years of community
                requests, both problems remain unaddressed.
            </p>
            
            <p>
                Organisations serious about infrastructure automation eventually develop patterns that work around
                these limitations, or they migrate to tools with better architectural support for multi-environment
                operations. Either way, the key is recognising these limitations early and designing operational
                processes that account for them, rather than fighting the tool's constraints.
            </p>
            
            <p>
                Until Ansible provides dynamic cache configuration and proper environment isolation, operations
                teams are choosing between operational complexity and architectural compromise, and neither choice
                is ideal. Understanding the tradeoffs, though, at least enables informed decisions about tooling
                and process design.
            </p>
        </section>
    `,
  },
  // Migrating: ansible-php-infrastructure.ejs
  {
    id: 'ansible-php-infrastructure',
    title: 'Ansible Automation for PHP Infrastructure',
    description:
      'Complete guide to automating PHP infrastructure deployment and management using Ansible',
    date: '2025-01-10',
    category: CATEGORIES.infrastructure.id,
    heroImage: {
      src: '/images/ansible-php-infrastructure/hero.webp',
      alt: 'Historic turbine hall at a power station, showing a wide row of nominally identical turbine-generator units built and operated to the same specification',
      ogImage: '/images/ansible-php-infrastructure/og.jpg',
      creditText:
        'Image: Jack E. Boucher / HAER, National Park Service, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:TURBINE_HALL,_VIEW_EAST_TO_WEST_(NOTE-_DUPLICATE_OF_HAER_No._PA-505-63,_EXCEPT_HORIZONTAL)_-_Delaware_County_Electric_Company,_Chester_Station,_Delaware_River_at_South_end_of_Ward_HAER_PA,23-CHES,2-64.tif',
    },
    readingTime: 15,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'devops',
    content: `
<section class="intro">
<p class="lead">Building repeatable infrastructure deployment pipelines using Ansible for PHP applications.</p>
<p>Manual server configuration is a recipe for disaster, since you get inconsistent environments, configuration drift, and human errors, and those create maintenance nightmares that slow down development and increase downtime. After years of managing PHP infrastructure, I've found Ansible to be one of the most effective tools for automating PHP application deployments.</p>
<p>This article covers proven Ansible strategies for PHP applications, and we'll go from basic server provisioning to complex multi-environment deployments.</p>
</section>
<section>
<h2>Why Ansible for PHP Infrastructure?</h2>
<h3>Simplicity and Readability</h3>
<p>Ansible playbooks are written in YAML, which makes them readable by both developers and operations teams:</p>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/basic-playbook.yml}}</code></pre>
<h3>Agentless Architecture</h3>
<p>You don't need to install agents on target servers, since Ansible uses SSH, which is already available on all Linux servers.</p>
<h3>Idempotency</h3>
<p>You can run playbooks multiple times safely, since Ansible only makes changes when needed, which keeps things in a consistent state.</p>
</section>
<section>
<h2>Essential Ansible Structure for PHP Projects</h2>
<h3>Directory Structure</h3>
<pre><code class="language-text">{{SNIPPET:ansible-php-infrastructure/directory-structure.txt}}</code></pre>
<h3>Inventory Configuration</h3>
<p>Here's how to define your servers and groups:</p>
<pre><code class="language-text">{{SNIPPET:ansible-php-infrastructure/inventory-hosts.ini}}</code></pre>
</section>
<section>
<h2>Core Ansible Roles for PHP Infrastructure</h2>
<h3>Common Role</h3>
<p>This handles base configuration for all servers:</p>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/common-role-playbook.yml}}</code></pre>
<h3>PHP Role</h3>
<p>This role handles PHP-FPM installation and configuration:</p>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/php-role-playbook.yml}}</code></pre>
<h3>Nginx Role</h3>
<p>Here's the web server configuration:</p>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/nginx-config.yml}}</code></pre>
</section>
<section>
<h2>Application Deployment Playbook</h2>
<h3>Zero-Downtime Deployment</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/deployment-playbook.yml}}</code></pre>
</section>
<section>
<h2>Advanced Deployment Strategies</h2>
<h3>Blue-Green Deployment</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/blue-green-deploy-playbook.yml}}</code></pre>
<h3>Database Migration Handling</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/migrate-playbook.yml}}</code></pre>
</section>
<section>
<h2>Monitoring and Maintenance</h2>
<h3>Log Rotation</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/logs-playbook.yml}}</code></pre>
<p>The corresponding logrotate template:</p>
<pre><code class="language-text">{{SNIPPET:ansible-php-infrastructure/logrotate-template.conf.j2}}</code></pre>
<h3>Performance Monitoring</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/monitoring-playbook.yml}}</code></pre>
</section>
<section>
<h2>Security Hardening</h2>
<h3>SSL/TLS Configuration</h3>
<pre><code class="language-nginx">{{SNIPPET:ansible-php-infrastructure/nginx-template.conf}}</code></pre>
</section>
<section>
<h2>Environment-Specific Configuration</h2>
<h3>Group Variables</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/group-vars-production.yml}}</code></pre>
<h3>Staging Environment</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/group-vars-staging.yml}}</code></pre>
</section>
<section>
<h2>Continuous Integration</h2>
<h3>GitLab CI Integration</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/gitlab-ci.yml}}</code></pre>
</section>
<section>
<h2>Troubleshooting Common Issues</h2>
<h3>Connection Problems</h3>
<pre><code class="language-bash">{{SNIPPET:ansible-php-infrastructure/troubleshooting-commands.sh}}</code></pre>
<h3>Permission Issues</h3>
<pre><code class="language-yaml">{{SNIPPET:ansible-php-infrastructure/permission-fix-playbook.yml}}</code></pre>
</section>
<section>
<h2>Best Practices</h2>
<ul>
<li><strong>Use version control:</strong> Store all Ansible code in Git</li>
<li><strong>Test in staging:</strong> Always test playbooks in staging first</li>
<li><strong>Use handlers:</strong> Restart services only when needed</li>
<li><strong>Encrypt secrets:</strong> Use Ansible Vault for sensitive data</li>
<li><strong>Tag tasks:</strong> Use tags for selective execution</li>
<li><strong>Monitor deployments:</strong> Implement health checks and rollback procedures</li>
</ul>
<h2>Conclusion</h2>
<p>Ansible transforms PHP infrastructure management from a manual, error-prone process into a reliable, repeatable system. The investment in setting up proper automation pays off with reduced downtime, consistent environments, and faster deployments.</p>
<p>Start with basic server provisioning, then gradually add more sophisticated deployment strategies like blue-green deployments and automated rollbacks. Your future self will thank you for the time invested in proper automation.</p>
</section>
<footer class="article-footer">
<div class="article-tags">
<span class="tags-label">Tags:</span>
<span class="tag">Ansible</span>
<span class="tag">PHP</span>
<span class="tag">Infrastructure</span>
<span class="tag">Automation</span>
<span class="tag">DevOps</span>
</div>
<div class="article-nav">
<a href="/articles" class="back-link">← Back to Articles</a>
</div>
</footer>
    `,
  },
  // Migrating: caching-vs-memoization.ejs
  {
    id: 'caching-vs-memoization',
    title: 'Caching vs Memoization: Choosing the Right Optimization Strategy',
    description:
      'Deep dive into caching and memoization strategies, their differences, use cases, anti-patterns, and practical implementation tips across programming languages.',
    date: '2025-10-06',
    category: CATEGORIES.php.id,
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'programming',
    heroImage: {
      src: '/images/caching-vs-memoization/hero.webp',
      alt: 'A black-and-white photograph of a cold storage warehouse interior, showing rows of pipe-frame storage racks holding wooden pallets receding past a concrete support column',
      ogImage: '/images/caching-vs-memoization/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:FREEZER_STORAGE._-_Atlantic_Ice_and_Coal_Company,_135_Prince_Street,_Montgomery,_Montgomery_County,_AL_HAER_AL-188-22.tif',
    },
    content: `
<div class="intro">
            <p class="lead">
                Performance optimisation often comes down to avoiding redundant work. Two fundamental techniques for this are
                <a href="https://en.wikipedia.org/wiki/Cache_(computing)" target="_blank" rel="noopener">caching</a> and
                <a href="https://en.wikipedia.org/wiki/Memoization" target="_blank" rel="noopener">memoization</a>, but
                developers frequently confuse them or use them interchangeably. Whilst both store computed results to avoid
                recalculation, they serve different purposes and have distinct trade-offs. Understanding when to use each can
                mean the difference between a responsive application and one that struggles under load.
            </p>
        </div>

        <section>
            <h2>Core Concepts</h2>

            <h3>What is Caching?</h3>
            <p>
                Caching is a broad optimisation technique that stores data in a fast-access layer to avoid expensive operations
                like database queries, API calls, or file I/O. Caches typically live outside the application scope and persist
                across multiple requests, users, or even application instances.
            </p>

            <p>Key characteristics of caching:</p>
            <ul>
                <li><strong>External storage</strong> - Data stored in <a href="https://redis.io/" target="_blank" rel="noopener">Redis</a>,
                    <a href="https://memcached.org/" target="_blank" rel="noopener">Memcached</a>, or
                    <a href="https://www.php.net/manual/en/book.apcu.php" target="_blank" rel="noopener">APCu</a></li>
                <li><strong>Shared state</strong> - Multiple processes or users can access the same cached data</li>
                <li><strong>Explicit invalidation</strong> - You control when cached data becomes stale</li>
                <li><strong>Time-based expiration</strong> - <a href="https://redis.io/commands/expire/" target="_blank" rel="noopener">TTL (Time To Live)</a>
                    determines how long data remains cached</li>
            </ul>

            <h3>What is Memoization?</h3>
            <p>
                Memoization is a specific optimisation technique for <a href="https://en.wikipedia.org/wiki/Pure_function" target="_blank" rel="noopener">pure functions</a>
                that caches the return value based on input parameters. The term comes from the Latin "memorandum" (to be remembered) and was coined by
                <a href="https://en.wikipedia.org/wiki/Donald_Michie" target="_blank" rel="noopener">Donald Michie</a> in 1968.
            </p>

            <p>Key characteristics of memoization:</p>
            <ul>
                <li><strong>Function-level</strong> - Applied to specific functions, not arbitrary data</li>
                <li><strong>Requires purity</strong> - Only works correctly with functions that have no side effects</li>
                <li><strong>Automatic invalidation</strong> - Cache key is derived from function arguments</li>
                <li><strong>Local scope</strong> - Typically lives within a single request or object lifetime</li>
            </ul>

            <h3>The Fundamental Difference</h3>
            <p>
                The distinction is simple: <strong>memoization is a specific type of caching for pure function results</strong>.
                All memoization is caching, but not all caching is memoization. Caching applies to any data storage optimisation,
                including database results, API responses, and file contents. Memoization specifically caches deterministic function
                outputs based on their inputs.
            </p>
        </section>

        <section>
            <h2>When to Use Caching</h2>

            <p>
                Caching shines when dealing with external data sources that are expensive to access but change infrequently.
                The primary use cases include:
            </p>

            <h3>Database Query Results</h3>
            <p>
                Database queries are often the slowest part of web applications, and caching query results can reduce response
                times dramatically. Here's a practical example using <a href="https://redis.io/" target="_blank" rel="noopener">Redis</a>
                with <a href="https://www.php.net/" target="_blank" rel="noopener">PHP</a>:
            </p>

            <pre><code class="language-php">{{SNIPPET:caching-vs-memoization/redis-caching-php.php}}
</code></pre>

            <h3>Configuration and Static Data</h3>
            <p>
                Application configuration rarely changes but gets read constantly.
                <a href="https://www.php.net/manual/en/book.apcu.php" target="_blank" rel="noopener">APCu</a> (Alternative PHP Cache)
                is perfect for this since it persists across requests but clears on server restart:
            </p>

            <pre><code class="language-php">{{SNIPPET:caching-vs-memoization/apcu-caching-php.php}}
</code></pre>

            <h3>API Responses</h3>
            <p>
                Third-party API calls introduce network latency and may have rate limits. Caching API responses reduces external
                dependencies and improves reliability. This is especially critical for APIs that charge per request or have strict
                rate limits.
            </p>

            <h3>Computed Data Shared Across Users</h3>
            <p>
                When expensive computations produce results that multiple users need (trending posts, aggregated statistics,
                search indexes), caching prevents redundant calculation. The key insight is that <strong>if the result benefits
                more than one user or request, it belongs in a cache</strong>.
            </p>
        </section>

        <section>
            <h2>When to Use Memoization</h2>

            <p>
                Memoization is ideal for pure functions with expensive computations that may be called repeatedly with the same
                arguments within a single execution context.
            </p>

            <h3>Recursive Computations</h3>
            <p>
                The classic example is calculating Fibonacci numbers, where naive recursion recomputes the same values exponentially.
                Memoization transforms this from O(2^n) to O(n):
            </p>

            <pre><code class="language-php">{{SNIPPET:caching-vs-memoization/fibonacci-memoized-php.php}}
</code></pre>

            <h3>Pure Function Results</h3>
            <p>
                Any function that always returns the same output for the same input is a candidate for memoization. Here's a generic
                memoization implementation in <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a>:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:caching-vs-memoization/memoize-typescript.ts}}
</code></pre>

            <h3>Python's Built-in Memoization</h3>
            <p>
                <a href="https://www.python.org/" target="_blank" rel="noopener">Python</a> provides memoization out of the box with
                <a href="https://docs.python.org/3/library/functools.html#functools.lru_cache" target="_blank" rel="noopener"><code>functools.lru_cache</code></a>,
                which implements a Least Recently Used cache with configurable size limits:
            </p>

            <pre><code class="language-python">{{SNIPPET:caching-vs-memoization/lru-cache-python.py}}
</code></pre>

            <h3>React Component Optimisation</h3>
            <p>
                In <a href="https://react.dev/" target="_blank" rel="noopener">React</a>, memoization prevents unnecessary re-renders.
                <a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener"><code>React.memo</code></a>,
                <a href="https://react.dev/reference/react/useMemo" target="_blank" rel="noopener"><code>useMemo</code></a>, and
                <a href="https://react.dev/reference/react/useCallback" target="_blank" rel="noopener"><code>useCallback</code></a>
                are all forms of memoization:
            </p>

            <pre><code class="language-javascript">{{SNIPPET:caching-vs-memoization/react-memo-example.jsx}}
</code></pre>
        </section>

        <section>
            <h2>Comparing Caching and Memoization</h2>

            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Aspect</th>
                            <th>Caching</th>
                            <th>Memoization</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><strong>Scope</strong></td>
                            <td>Cross-request, cross-user, cross-process</td>
                            <td>Function-level, typically single request</td>
                        </tr>
                        <tr>
                            <td><strong>Storage</strong></td>
                            <td>External (Redis, Memcached, APCu)</td>
                            <td>Internal (object property, closure, Map)</td>
                        </tr>
                        <tr>
                            <td><strong>Data Type</strong></td>
                            <td>Any data (query results, files, API responses)</td>
                            <td>Function return values only</td>
                        </tr>
                        <tr>
                            <td><strong>Invalidation</strong></td>
                            <td>Explicit (manual delete, TTL expiration)</td>
                            <td>Implicit (based on input arguments)</td>
                        </tr>
                        <tr>
                            <td><strong>Purity Requirement</strong></td>
                            <td>No (can cache impure operations)</td>
                            <td>Yes (only works correctly with pure functions)</td>
                        </tr>
                        <tr>
                            <td><strong>Setup Complexity</strong></td>
                            <td>Higher (requires external service)</td>
                            <td>Lower (language built-ins often available)</td>
                        </tr>
                        <tr>
                            <td><strong>Memory Management</strong></td>
                            <td>Handled by cache service</td>
                            <td>Must implement eviction strategy</td>
                        </tr>
                        <tr>
                            <td><strong>Debugging</strong></td>
                            <td>Can inspect cache via CLI tools</td>
                            <td>Often opaque without instrumentation</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>Performance Characteristics</h3>
            <p>
                Caching typically has higher latency per access (microseconds to milliseconds) due to network or serialization overhead,
                but it persists across process boundaries. Memoization has near-zero overhead (nanoseconds) since it's just a memory
                lookup, but the cache is lost when the process ends.
            </p>

            <h3>Memory Implications</h3>
            <p>
                Caching uses memory in a dedicated service with sophisticated eviction policies. Memoization uses application memory,
                which can lead to memory pressure if not carefully managed. Many cloud applications see substantial load-time
                improvements after implementing proper caching strategies.
            </p>
        </section>

        <section>
            <h2>Anti-Patterns to Avoid</h2>

            <h3>Memoizing Impure Functions</h3>
            <p>
                The most common mistake is memoizing functions that have side effects or depend on external state. This produces
                stale data and hard-to-debug issues:
            </p>

            <pre><code class="language-php">{{SNIPPET:caching-vs-memoization/antipattern-impure-function.php}}
</code></pre>

            <p>
                The problem: database values change, but the memoized function keeps returning the old cached value.
                <strong>Only memoize pure functions</strong> where the output depends solely on the input.
            </p>

            <h3>Unbounded Caches</h3>
            <p>
                Caches without size limits or TTL can grow indefinitely, causing memory exhaustion. This is particularly dangerous
                with memoization:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:caching-vs-memoization/antipattern-unbounded-cache.ts}}
</code></pre>

            <p>
                Unbounded caches are a well-documented cause of production memory exhaustion in long-running processes.
                Always implement an eviction strategy like
                <a href="https://en.wikipedia.org/wiki/Cache_replacement_policies#Least_recently_used_(LRU)" target="_blank" rel="noopener">LRU</a>
                (Least Recently Used) or set TTL values.
            </p>

            <h3>Cache Everything Syndrome</h3>
            <p>
                Not everything benefits from caching, since adding cache layers without measuring adds complexity, debugging difficulty,
                and potential staleness without guaranteed performance gains. Start by profiling to identify actual bottlenecks.
            </p>

            <h3>Ignoring Cache Invalidation</h3>
            <p>
                Phil Karlton famously said: "There are only two hard things in Computer Science: cache invalidation and naming things."
                Failing to invalidate caches when underlying data changes leads to inconsistent application state. Every cached value
                needs a clear invalidation strategy.
            </p>
        </section>

        <section>
            <h2>Common Pitfalls and Gotchas</h2>

            <h3>Cache Stampede</h3>
            <p>
                When a popular cache entry expires, multiple requests simultaneously try to regenerate it, overwhelming your database -
                this is also called the "thundering herd" problem, and the usual solution is to use locking:
            </p>

            <pre><code class="language-php">{{SNIPPET:caching-vs-memoization/cache-stampede-solution.php}}
</code></pre>

            <p>
                Alternatively, use probabilistic early recomputation where the cache is refreshed before it expires, with the probability
                increasing as expiration approaches. <a href="https://blog.cloudflare.com/sometimes-i-cache/" target="_blank" rel="noopener">Cloudflare's implementation</a>
                demonstrates this technique effectively.
            </p>

            <h3>Object Arguments in Memoization</h3>
            <p>
                Memoization with object arguments is tricky because JavaScript, PHP, and Python compare objects by reference, not value.
                Two objects with identical contents are different keys:
            </p>

            <pre><code class="language-javascript">{{SNIPPET:caching-vs-memoization/object-argument-memoization.js}}</code></pre>

            <p>
                Solutions include serializing objects to strings (JSON.stringify), using primitive values as keys, or implementing
                deep equality checks. Each approach has trade-offs between correctness and performance.
            </p>

            <h3>Testing Cached Code</h3>
            <p>
                Cached code is notoriously difficult to test because tests may pass due to cache hits rather than correct logic.
                Always clear caches between tests and write specific tests for cache behaviour (hits, misses, invalidation). Consider
                making cache layers mockable in your architecture.
            </p>

            <h3>Cache Invalidation Strategies</h3>
            <p>
                Different scenarios require different invalidation approaches:
            </p>

            <pre><code class="language-php">{{SNIPPET:caching-vs-memoization/cache-invalidation-strategies.php}}
</code></pre>
        </section>

        <section>
            <h2>Best Practices and Top Tips</h2>

            <h3>1. Measure Before Optimising</h3>
            <p>
                Premature optimisation wastes time and adds complexity. Use profiling tools like
                <a href="https://xdebug.org/" target="_blank" rel="noopener">Xdebug</a>,
                <a href="https://www.blackfire.io/" target="_blank" rel="noopener">Blackfire</a>, or
                <a href="https://nodejs.org/api/perf_hooks.html" target="_blank" rel="noopener">Node.js Performance Hooks</a>
                to identify actual bottlenecks. Only cache operations that measurably impact performance.
            </p>

            <h3>2. Start Simple</h3>
            <p>
                Begin with in-process caching (APCu, simple object properties) before introducing distributed caching infrastructure.
                Local caching is easier to reason about and often sufficient. Upgrade to Redis or Memcached when you need cross-process
                or cross-server sharing.
            </p>

            <h3>3. Choose Cache Keys Wisely</h3>
            <p>
                Cache keys should be specific enough to avoid collisions but general enough to maximise hit rates. Include versioning
                in keys to enable instant invalidation:
            </p>

            <pre><code class="language-php">{{SNIPPET:caching-vs-memoization/cache-key-examples.php}}</code></pre>

            <h3>4. Implement Monitoring</h3>
            <p>
                Track cache hit rates, miss rates, and eviction rates. A hit rate that keeps dropping is a sign your cache strategy needs adjustment.
                Tools like <a href="https://redis.io/commands/info/" target="_blank" rel="noopener">Redis INFO</a> and
                <a href="https://www.php.net/manual/en/function.apcu-cache-info.php" target="_blank" rel="noopener">apcu_cache_info()</a>
                provide valuable metrics.
            </p>

            <h3>5. Set Appropriate TTL Values</h3>
            <p>
                TTL (Time To Live) balances freshness and performance. Consider data change frequency:
            </p>

            <ul>
                <li><strong>Static content</strong>: Hours to days</li>
                <li><strong>User profiles</strong>: 5-15 minutes</li>
                <li><strong>Session data</strong>: 30-60 minutes</li>
                <li><strong>Real-time data</strong>: Seconds, or don't cache</li>
            </ul>

            <h3>6. Memoization Library vs Hand-Rolling</h3>
            <p>
                Use language built-ins when available (Python's <code>@lru_cache</code>, React's hooks). For other languages,
                established libraries like <a href="https://lodash.com/docs/#memoize" target="_blank" rel="noopener">Lodash's memoize</a>
                or <a href="https://github.com/krakjoe/apcu" target="_blank" rel="noopener">APCu</a> are more battle-tested than custom
                implementations.
            </p>

            <h3>7. Document Cache Behaviour</h3>
            <p>
                Cached code is harder to understand because the relationship between code and behaviour isn't obvious. Document:
            </p>

            <ul>
                <li>What gets cached and why</li>
                <li>Cache invalidation triggers</li>
                <li>TTL values and their rationale</li>
                <li>Expected hit rates</li>
            </ul>

            <h3>8. Balance Performance and Maintainability</h3>
            <p>
                Every cache layer increases system complexity. Ask: does this cache provide enough performance benefit to justify
                the added debugging difficulty and potential staleness issues? Sometimes a slightly slower but simpler system is
                the better long-term choice.
            </p>
        </section>

        <section>
            <h2>Decision Framework</h2>

            <p>
                Use this flowchart logic to determine which optimisation strategy fits your needs:
            </p>

            <pre><code>{{SNIPPET:caching-vs-memoization/decision-flow-pseudocode.txt}}</code></pre>

            <h3>When to Use Both</h3>
            <p>
                Caching and memoization aren't mutually exclusive. You might memoize expensive computations within a request,
                then cache the final result across requests:
            </p>

            <pre><code class="language-php">{{SNIPPET:caching-vs-memoization/report-generator.php}}</code></pre>

            <p>
                This pattern combines the best of both worlds: fast local memoization for repeated calculations within a request,
                and persistent caching for results that benefit multiple users or requests.
            </p>
        </section>

        <section>
            <h2>Conclusion</h2>

            <p>
                Caching and memoization are powerful optimisation techniques with distinct use cases. Caching excels at storing
                external data (database queries, API calls) that's shared across requests and users. Memoization optimises pure
                function calls within a single execution context.
            </p>

            <p>The distinction that matters most:</p>

            <ul>
                <li><strong>Caching</strong> is for external data and shared state across requests</li>
                <li><strong>Memoization</strong> is for pure function results within a request</li>
            </ul>

            <p>
                The choice between caching and memoization isn't always either/or. Understanding their characteristics allows you
                to combine them effectively, creating systems that are both fast and maintainable. Start simple, measure impact,
                and add complexity only when justified by real performance data.
            </p>

            <h3>Additional Resources</h3>
            <ul>
                <li><a href="https://redis.io/docs/" target="_blank" rel="noopener">Redis Documentation</a> - Comprehensive guide to Redis caching</li>
                <li><a href="https://www.php.net/manual/en/book.apcu.php" target="_blank" rel="noopener">PHP APCu Manual</a> - Official PHP APCu documentation</li>
                <li><a href="https://docs.python.org/3/library/functools.html" target="_blank" rel="noopener">Python functools</a> - Built-in memoization with lru_cache</li>
                <li><a href="https://react.dev/reference/react/memo" target="_blank" rel="noopener">React Memoization</a> - React.memo, useMemo, and useCallback guides</li>
                <li><a href="https://martinfowler.com/bliki/TwoHardThings.html" target="_blank" rel="noopener">Martin Fowler on Cache Invalidation</a> - The famous quote and its implications</li>
                <li><a href="https://en.wikipedia.org/wiki/Cache_replacement_policies" target="_blank" rel="noopener">Cache Eviction Policies</a> - LRU, LFU, and other strategies</li>
            </ul>
        </section>
    `,
  },
  // Migrating: claude-code-custom-commands-cc-commands.ejs
  {
    id: 'claude-code-custom-commands-cc-commands',
    title: 'Building Better Claude Code Workflows with CC-Commands',
    description:
      'Discover how the CC-Commands repository solves the pain points of managing custom Claude Code commands across multiple projects with straightforward automation and intelligent synchronisation.',
    date: '2025-07-18',
    category: CATEGORIES.ai.id,
    readingTime: 8,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'LLMDevs',
    heroImage: {
      src: '/images/claude-code-custom-commands-cc-commands/hero.webp',
      alt: 'A labelled foam shadow-board tool drawer in a military aircraft maintenance tool crib, each wrench and tool set into its own cut-out slot with a barcoded accountability tag',
      ogImage: '/images/claude-code-custom-commands-cc-commands/og.jpg',
      creditText: 'Image: A1C Allen Tyler, 138th Fighter Wing, public domain, via DVIDS',
      creditUrl: 'https://www.dvidshub.net/image/7274488/138fw-amxs-tool-crib',
    },
    content: `
<section class="intro">
<p class="lead">
Claude Code has revolutionised how developers work with AI assistance, but managing custom commands across multiple projects quickly becomes a nightmare. Enter <strong>CC-Commands</strong>, an elegant solution that transforms command management from a tedious chore into an automated, intelligent workflow.
</p>
</section>
<section>
<h2>The Claude Code Revolution</h2>
<p>
<a href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</a> represents a paradigm shift in AI-assisted development. Unlike traditional coding assistants that provide suggestions, Claude Code offers interactive coding sessions with full file system access, command execution, and the ability to create custom workflows through slash commands.
</p>
<p>
The power of Claude Code lies in its extensibility. Custom slash commands allow developers to encode complex workflows, automate repetitive tasks, and create domain-specific tools that understand their project's unique requirements. These commands can:
</p>
<ul>
<li><strong>Automate deployment processes</strong> with intelligent error handling and rollback capabilities</li>
<li><strong>Orchestrate testing workflows</strong> that adapt to different environments and configurations</li>
<li><strong>Manage database operations</strong> with safety checks and automated backups</li>
<li><strong>Generate project documentation</strong> that stays synchronised with code changes</li>
</ul>
<p>
But as projects grow and multiply, a critical problem emerges. How do you manage these valuable commands across multiple repositories?
</p>
</section>
<section>
<h2>The Multi-Project Command Management Nightmare</h2>
<p>
Every developer who has worked with Claude Code across multiple projects has experienced this frustration. You create a brilliant command in one project, perhaps a sophisticated deployment script or a comprehensive testing workflow, and then face the painful reality of maintaining it across your entire codebase.
</p>
<h3>The Copy-Paste Spiral</h3>
<p>
The typical journey starts innocently enough. You create a useful command like <code>/deploy:staging</code> that handles environment setup, runs tests, and deploys with proper error handling. It works beautifully, so you copy it to your next project. Then you improve it, adding better logging and rollback capabilities. Now you have two versions.
</p>
<p>
Fast forward six months. You have eight projects, each with slightly different versions of the same commands. A bug fix in one project means manually updating seven others. A new feature requires careful synchronisation across multiple repositories. The commands that were supposed to save time now consume it.
</p>
<h3>The Maintenance Burden</h3>
<p>
The problems compound quickly:
</p>
<ul>
<li><strong>Version drift</strong>: Commands evolve independently, creating inconsistent behaviour across projects</li>
<li><strong>Bug multiplication</strong>: A single bug must be fixed multiple times in multiple places</li>
<li><strong>Feature fragmentation</strong>: Improvements in one project don't benefit others</li>
<li><strong>Documentation and onboarding chaos</strong>: different projects end up with different command documentation and usage patterns, so new team members have to learn a different set of commands each time they join one</li>
</ul>
<p>
Traditional solutions fall short too: git submodules are too heavyweight and complex, copying files by hand is error-prone and doesn't scale, and package managers were never really designed for this kind of problem, so the developer community needed something better suited to it.
</p>
</section>
<section>
<h2>Enter CC-Commands: A Different Approach</h2>
<p>
<a href="https://github.com/LongTermSupport/cc-commands">CC-Commands</a> solves the multi-project command management problem well, without a lot of extra apparatus. Instead of fighting against the natural evolution of commands, it embraces it whilst maintaining consistency and making it straightforward to share improvements.
</p>
<h3>The Self-Managing Command System</h3>
<p>
The brilliance of CC-Commands lies in its meta-circular design. <strong>It uses Claude Code commands to manage Claude Code commands</strong>, and that turns out to be the choice that makes the rest of the system work. There are three core management commands:
</p>
<ul>
<li><strong><code>/g:command:create</code></strong>: Creates new commands with best practices built-in</li>
<li><strong><code>/g:command:update</code></strong>: Updates existing commands whilst preserving functionality</li>
<li><strong><code>/g:command:sync</code></strong>: Synchronises commands across all projects</li>
</ul>
<p>
You can build your command library directly within your Claude Code session, without ever leaving your development environment: create a new deployment command, enhance an existing one, or share improvements across every project you touch, all from inside the same session.
</p>
<h3>Intelligent Command Creation</h3>
<p>
The <code>/g:command:create</code> command does more than generate a template: it acts as an assistant that understands Claude Code's best practices, and when you create a command it:
</p>
<ul>
<li><strong>Analyses your requirements</strong> to determine the appropriate tools and permissions</li>
<li><strong>Generates comprehensive documentation</strong> including usage examples and help text</li>
<li><strong>Implements safety features and error handling</strong>, including fail-fast validation, user confirmations, and recovery instructions with troubleshooting guidance</li>
<li><strong>Optimises for Claude Code</strong> using Task blocks instead of interactive bash commands</li>
</ul>
<p>
The result is commands that are functional, maintainable, documented, and follow established patterns.
</p>
</section>
<section>
<h2>The Synchronisation Revolution</h2>
<p>
Where CC-Commands truly shines is in its synchronisation capabilities. The <code>/g:command:sync</code> command is a genuinely well thought-out piece of automation, and it is worth looking at how it works.
</p>
<h3>Smart Commit Generation</h3>
<p>
Unlike traditional git workflows that require manual commit messages, CC-Commands analyses your actual changes and generates intelligent commit messages automatically. It knows the difference between:
</p>
<ul>
<li><strong>Feature additions</strong>: "feat: add push command with GitHub Actions monitoring"</li>
<li><strong>Bug fixes</strong>: "fix: improve error handling in create and update commands"</li>
<li><strong>Documentation updates</strong>: "docs: update README with current command structure"</li>
<li><strong>Refactoring</strong>: "refactor: simplify command argument parsing logic"</li>
</ul>
<p>
That's convenient in itself, but it also builds a commit history a team can actually read back later, showing how the commands evolved.
</p>
<h3>Conflict-Free Collaboration</h3>
<p>
The synchronisation system handles the complexities of multi-project collaboration. It automatically:
</p>
<ul>
<li><strong>Detects changes</strong> across all command files</li>
<li><strong>Commits improvements</strong> with descriptive messages</li>
<li><strong>Pulls updates</strong> from other contributors</li>
<li><strong>Resolves conflicts</strong> with clear guidance</li>
<li><strong>Pushes changes</strong> to share with all projects</li>
</ul>
<p>
This produces a living command ecosystem that evolves continuously whilst maintaining consistency across all projects.
</p>
</section>
<section>
<h2>A Worked Example: Before and After</h2>
<p>
To understand the true impact of CC-Commands, consider a typical development scenario across multiple projects:
</p>
<h3>Before CC-Commands: The Manual Nightmare</h3>
<p>
A team maintains five PHP projects, each requiring similar deployment workflows. They have variations of a deployment command in each project:
</p>
<ul>
<li><strong>Project A</strong>: Basic deployment with manual testing</li>
<li><strong>Project B</strong>: Deployment with automated tests but no rollback</li>
<li><strong>Project C</strong>: Advanced deployment with rollback but poor error handling</li>
<li><strong>Project D</strong>: Deployment with good error handling but no monitoring</li>
<li><strong>Project E</strong>: Comprehensive deployment but complex configuration</li>
</ul>
<p>
When a critical bug is discovered in the deployment logic, it requires manual fixes across five repositories. When a new feature is added to one project, it must be carefully ported to the others.
</p>
<h3>After CC-Commands: One Command, Everywhere</h3>
<p>
With CC-Commands, the same team has a single, authoritative deployment command that:
</p>
<ul>
<li><strong>Incorporates the best features from all previous versions</strong>, maintaining consistency across every project</li>
<li><strong>Evolves continuously</strong> as improvements are made</li>
<li><strong>Synchronises automatically</strong> when any project runs <code>/g:command:sync</code></li>
<li><strong>Includes comprehensive documentation</strong> and error handling</li>
</ul>
<p>
A bug fix or feature enhancement in one project automatically benefits all others. The maintenance burden shifts from "update five commands" to "update one command and sync everywhere."
</p>
</section>
<section>
<h2>The Command Arsenal</h2>
<p>
CC-Commands comes with a thoughtfully curated set of commands that demonstrate best practices and solve common problems:
</p>
<h3>Command Management Suite</h3>
<ul>
<li><strong><code>/g:command:create</code></strong>: Intelligent command creation with safety features</li>
<li><strong><code>/g:command:update</code></strong>: Non-destructive command enhancement</li>
<li><strong><code>/g:command:sync</code></strong>: Automated repository synchronisation</li>
</ul>
<h3>GitHub Integration Tools</h3>
<ul>
<li><strong><code>/g:gh:push</code></strong>: Smart git push with Actions monitoring</li>
<li><strong><code>/g:gh:issue:plan</code></strong>: Convert GitHub issues to comprehensive plans</li>
</ul>
<h3>Workflow Enhancement</h3>
<ul>
<li><strong><code>/g:w:plan</code></strong>: Generate project plans with progress tracking</li>
</ul>
<p>
Each command carries real error handling and a workflow that has been used and refined in practice, not just a thin wrapper. They're examples of how to build robust, maintainable Claude Code commands.
</p>
</section>
<section>
<h2>Beyond Commands: A Philosophy</h2>
<p>
CC-Commands represents more than just a tool. It embodies a philosophy of intelligent automation and collaborative development. The system demonstrates several key principles:
</p>
<h3>Automation That Understands Context</h3>
<p>
Rather than blind automation, CC-Commands analyses context to make intelligent decisions. It understands the difference between different types of changes and generates appropriate commit messages, and it recognises when README files need updates and suggests improvements.
</p>
<h3>Safety Without Bureaucracy</h3>
<p>
The system includes comprehensive safety features like permission management, fail-fast validation, and user confirmations, without creating bureaucratic overhead. Safety features prevent problems whilst maintaining development velocity.
</p>
<h3>Evolution Over Revolution</h3>
<p>
CC-Commands doesn't require wholesale changes to existing workflows. It fits into existing Claude Code setups and enhances them gradually, so you can adopt commands incrementally and let the system grow with your needs.
</p>
</section>
<section>
<h2>Getting Started: Your First Command</h2>
<p>
Installing CC-Commands is remarkably simple. From your project root:
</p>
<pre><code class="language-bash">curl -fsSL https://raw.githubusercontent.com/LongTermSupport/cc-commands/main/setup.sh | bash</code></pre>
<p>
This single command installs the entire system, including all management commands and GitHub integration tools.
</p>
<p>
Creating your first command is just as straightforward:
</p>
<pre><code class="language-bash">/g:command:create db:reset "Reset database to clean state with test data"</code></pre>
<p>
The system will analyse your requirements, generate a comprehensive command with proper error handling and documentation, and make it available for immediate use.
</p>
</section>
<section>
<h2>Conclusion: Building Better Workflows</h2>
<p>
CC-Commands solves a fundamental problem in modern development: how to maintain consistency and share improvements across multiple projects without sacrificing agility or creating maintenance overhead.
</p>
<p>
By embracing the meta-circular design of commands that manage commands, CC-Commands creates a self-improving system that grows more valuable over time. Each command created, each improvement made, and each synchronisation run contributes to a shared knowledge base.
</p>
<p>
The solution here doesn't rely on complexity. Three commands (create, update, and sync) cover the whole multi-project management problem whilst still enabling powerful workflows and intelligent automation, and that simplicity is what makes it work.
</p>
<p>
For developers working with Claude Code across multiple projects, I'd call CC-Commands close to a necessity rather than just a convenience: it takes command management out of the category of tedious chores and turns it into something automated and largely hands-off.
</p>
<p>
Managing commands manually across multiple projects doesn't scale; letting commands manage themselves does. The project is open source: <a href="https://github.com/LongTermSupport/cc-commands">github.com/LongTermSupport/cc-commands</a>.
</p>
</section>
    `,
  },
  // Migrating: claude-code-hooks-subagent-control.ejs
  {
    id: 'claude-code-hooks-subagent-control',
    title: 'Advanced Claude Code Hooks: Controlling Sub-Agent Behaviour',
    description:
      'Learn how to use Claude Code hooks to enforce execution rules for parallel sub-agents, preventing resource conflicts in test suites and other shared-resource scenarios.',
    date: '2025-10-24',
    category: CATEGORIES.ai.id,
    heroImage: {
      src: '/images/claude-code-hooks-subagent-control/hero.webp',
      alt: 'A black-and-white HAER photograph of the Lockport Locks on the New York State Barge Canal, showing a stacked stone lock wall and an arching road bridge crossing the lock cut',
      ogImage: '/images/claude-code-hooks-subagent-control/og.jpg',
      creditText:
        'Image: Jet Lowe, HAER, National Park Service, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:PERSPECTIVE_LOOKING_NORTH_NORTHEAST_THROUGH_LOCKS_70_(FOREGROUND),_69,_68,_67_(EXTERME_BACKGROUND)._-_New_York_State_Barge_Canal,_Lockport_Locks,_Richmond_Avenue,_Lockport,_HAER_NY,32-LOCK,14A-24.tif',
    },
    readingTime: 8,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'LLMDevs',
    content: `
<div class="intro">
            <p class="lead">Claude Code hooks are powerful automation tools that execute at specific points during AI coding sessions. Whilst basic hooks can validate prompts or add context, advanced hooks can enforce sophisticated rules like preventing parallel sub-agents from running test suites that share database connections.</p>
        </div>

        <section>
            <h2>Understanding Claude Code Hooks</h2>
            <p>Hooks in Claude Code are automated scripts that intercept and control the AI's tool usage. They execute arbitrary shell commands at specific lifecycle events, enabling you to:</p>
            <ul>
                <li><strong>Validate tool usage</strong> before execution (PreToolUse)</li>
                <li><strong>Add context</strong> to user prompts (UserPromptSubmit)</li>
                <li><strong>Clean up resources</strong> when sessions end (SessionEnd)</li>
                <li><strong>Inject environment data</strong> at session start (SessionStart)</li>
                <li><strong>Control permissions</strong> for file operations</li>
            </ul>

            <p>The most powerful hook type is <code>PreToolUse</code>, which runs before any tool executes and can approve, deny, or request user confirmation for the operation.</p>
        </section>

        <section>
            <h2>The Problem: Parallel Execution and Shared Resources</h2>
            <p>Claude Code's sub-agent system enables parallel task execution, so multiple agents can work simultaneously on different aspects of your codebase - which is excellent for productivity, but creates challenges when those tasks share resources.</p>

            <p>Consider a PHP project with PHPUnit tests that use a SQLite database. The test suite isn't optimised for parallel execution because:</p>
            <ul>
                <li><strong>Database locks</strong>: SQLite allows only one writer at a time</li>
                <li><strong>Shared state</strong>: Tests may create or modify the same fixtures</li>
                <li><strong>Race conditions</strong>: Parallel execution causes unpredictable failures</li>
            </ul>

            <p>When Claude spawns multiple sub-agents to handle complex refactoring tasks, each might independently decide to run the test suite, and the result is database lock conflicts, failed tests, and confused AI agents.</p>
        </section>

        <section>
            <h2>The Solution: Sub-Agent Detection and Control</h2>
            <p>We can solve this by creating a hook that detects when it's running in a sub-agent context and blocks test execution, whilst still allowing other QA tools like static analysis and code style checks.</p>

            <p>Sub-agents are not separate OS processes with a distinguishable parent-process chain, so PPID inspection doesn't work here. The real signal is in the hook payload itself: Claude Code includes an <code>agent_id</code> field when a tool call originates from a sub-agent, and omits it for main-session calls. That's the only documented, reliable way to make this distinction.</p>
        </section>

        <section>
            <h2>Implementation: The PreToolUse Hook</h2>
            <p>Here's a complete <a href="https://www.python.org/" target="_blank" rel="noopener">Python</a> hook that implements sub-agent detection and selective command blocking:</p>

            <pre><code class="language-python">{{SNIPPET:claude-code-hooks-subagent-control/prevent-subagent-tests.py}}
</code></pre>
        </section>

        <section>
            <h2>How It Works</h2>

            <h3>1. Sub-Agent Detection</h3>
            <p>The <code>is_subagent()</code> function checks a field in the hook payload rather than inspecting processes:</p>
            <ul>
                <li>Reads the <code>agent_id</code> field from the PreToolUse JSON payload</li>
                <li>Returns <code>True</code> if <code>agent_id</code> is present (the call came from a sub-agent)</li>
                <li>Returns <code>False</code> if it's absent (the call came from the main session)</li>
                <li>The surrounding hook still fails open on any unexpected error, to avoid blocking legitimate operations</li>
            </ul>

            <h3>2. Command Pattern Matching</h3>
            <p>The hook uses regex patterns to categorise commands:</p>
            <ul>
                <li><strong>Test commands</strong>: PHPUnit, Infection, <code>bin/qa -t unit</code></li>
                <li><strong>Allowed QA commands</strong>: <code>bin/qa -t allCs</code>, <code>bin/qa -t allStatic</code></li>
                <li><strong>All other commands</strong>: Allowed without restriction</li>
            </ul>

            <h3>3. Selective Blocking</h3>
            <p>The hook implements a whitelist/blacklist strategy:</p>
            <ul>
                <li>Main agent: All commands allowed</li>
                <li>Sub-agents: Static analysis allowed, tests blocked</li>
                <li>Error response: Structured JSON explaining the block</li>
            </ul>
        </section>

        <section>
            <h2>Configuration</h2>
            <p>To enable this hook, add it to your <a href="https://docs.claude.com/en/docs/claude-code/settings" target="_blank" rel="noopener">Claude Code settings file</a> (<code>~/.claude/settings.json</code> or <code>.claude/settings.json</code>):</p>

            <pre><code class="language-json">{{SNIPPET:claude-code-hooks-subagent-control/settings.json}}
</code></pre>

            <p>Make the script executable:</p>
            <pre><code class="language-bash">{{SNIPPET:claude-code-hooks-subagent-control/make-executable.sh}}
</code></pre>
        </section>

        <section>
            <h2>Real-World Benefits</h2>

            <h3>Prevents Database Lock Conflicts</h3>
            <p>By blocking parallel test execution, you eliminate SQLite database lock errors that would otherwise cause test failures and confuse the AI agents.</p>

            <h3>Enables Parallel Static Analysis</h3>
            <p>Sub-agents can still run code style checks (<code>allCs</code>) and static analysis (<code>allStatic</code>) in parallel, since these tools don't share resources.</p>

            <h3>Clear Error Messages</h3>
            <p>When a sub-agent attempts to run tests, it receives a structured JSON response explaining why the operation was blocked and what commands are allowed.</p>

            <h3>Fail-Safe Design</h3>
            <p>The hook uses a "fail open" strategy - if it can't determine whether it's in a sub-agent, it allows the command rather than risk blocking a legitimate operation because of a hook error.</p>
        </section>

        <section>
            <h2>Extending the Pattern</h2>
            <p>This technique applies to any shared resource scenario:</p>

            <ul>
                <li><strong>Database migrations</strong>: Prevent parallel schema changes</li>
                <li><strong>File system operations</strong>: Block concurrent writes to lock files</li>
                <li><strong>External services</strong>: Rate-limit API calls across sub-agents</li>
                <li><strong>Build artifacts</strong>: Prevent simultaneous builds that share directories</li>
            </ul>

            <p>The core pattern remains the same: detect sub-agent context via the <code>agent_id</code> field, match command patterns, and selectively allow or block operations based on resource constraints.</p>
        </section>

        <section>
            <h2>Best Practices</h2>

            <h3>Use Specific Patterns</h3>
            <p>Make your regex patterns as specific as possible to avoid false positives. Use word boundaries (<code>\\b</code>) and full command paths when appropriate.</p>

            <h3>Fail Open for Safety</h3>
            <p>When error handling, prefer allowing the operation over blocking it. A blocked legitimate operation is more frustrating than a rare race condition.</p>

            <h3>Provide Clear Feedback</h3>
            <p>Structure your error messages as JSON with fields explaining what was blocked, why, and what alternatives are available.</p>

            <h3>Test Both Contexts</h3>
            <p>Verify your hook works correctly in both main agent and sub-agent contexts. Trigger the same tool call from each and check <code>agent_id</code> in the logged payload - it should be present for the sub-agent call and absent for the main-agent one.</p>

            <h3>Keep Hooks Fast</h3>
            <p>Hooks execute on every tool use, so keep them lightweight - this implementation completes in milliseconds.</p>
        </section>

        <section>
            <h2>Conclusion</h2>
            <p>Claude Code hooks do a lot more than simple validation, once you start reading the fields the payload already gives you. Matching the <code>agent_id</code> field against command patterns lets you enforce execution policies that adapt to context, allowing parallel execution where it's safe and blocking it where resources are shared.</p>

            <p>This sub-agent control pattern turns a potential source of race conditions and lock conflicts into a well-orchestrated parallel execution system: the main agent coordinates test execution, whilst sub-agents handle static analysis in parallel, maximising productivity without sacrificing reliability.</p>

            <p>Whether you're managing database locks, preventing concurrent migrations, or rate-limiting external API calls, the underlying idea holds: check the payload for the sub-agent signal, and let that decide what's allowed.</p>
        </section>
    `,
  },
  // Migrating: claude-code-latest-features.ejs
  {
    id: 'claude-code-latest-features',
    title: "Claude Code Latest Features: What's New in Autumn 2025",
    description:
      "A dated snapshot of Claude Code as of November 2025: how checkpoints, subagents, the plugin system, and MCP fit together, plus version-specific fixes and settings added across the 2.0.30-2.0.33 release run.",
    date: '2025-11-05',
    category: CATEGORIES.ai.id,
    heroImage: {
      src: '/images/claude-code-latest-features/hero.webp',
      alt: 'The battleship USS Iowa under construction on the building ways at the New York Navy Yard in 1941, viewed down the length of the hull with turret barbette machinery being fitted inside the framed structure.',
      ogImage: '/images/claude-code-latest-features/og.jpg',
      creditText: 'Image: U.S. National Archives, public domain, via Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:19-LCunnumbered.tif',
    },
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'LLMDevs',
    register: 'formal',
    content: `
<div class="intro">
            <p class="lead"><a href="https://github.com/anthropics/claude-code" target="_blank" rel="noopener">Claude Code</a> changed substantially between September and November 2025: checkpoints for reversible code iteration, a plugin marketplace for sharing workflows, native VS Code integration, web and mobile interfaces, and a model upgrade to <a href="https://www.anthropic.com/news/claude-sonnet-4-5" target="_blank" rel="noopener">Claude Sonnet 4.5</a>. This is a snapshot of that three-month window as it stood on the date below - treat any "latest" or version-specific claim below as dated to then, not as current fact.</p>
        </div>

        <section>
            <h2>Checkpoints: The Undo Button for AI Coding</h2>
            <p>On September 29, 2025, Anthropic introduced <a href="https://docs.claude.com/en/docs/claude-code/checkpointing" target="_blank" rel="noopener">checkpoints</a>, arguably the most important feature for building confidence in AI-assisted development. Checkpoints automatically save your code state before each change, enabling instant rollback when experiments go wrong.</p>

            <h3>How Checkpoints Work</h3>
            <p>Every user prompt creates a new checkpoint that persists for 30 days (configurable). When you need to rewind, press <code>Esc</code> twice or use the <a href="https://docs.claude.com/en/docs/claude-code/checkpointing" target="_blank" rel="noopener"><code>/rewind</code> command</a> to access three restoration options:</p>
            <ul>
                <li><strong>Conversation only</strong>: Keep code changes, revert the chat history</li>
                <li><strong>Code only</strong>: Keep conversation context, undo file modifications</li>
                <li><strong>Both code and conversation</strong>: Complete rollback to a prior state</li>
            </ul>

            <h3>Why This Is Cool</h3>
            <p>Checkpoints solve a fundamental problem with autonomous AI coding: fear of destructive changes. Traditional version control like <a href="https://git-scm.com/" target="_blank" rel="noopener">Git</a> requires manual commits and discipline. Checkpoints provide instant, granular undo without ceremony. This psychological safety net enables more ambitious experimentation and delegation of complex tasks.</p>

            <p>The system tracks only direct file edits through Claude's editing tools, not bash command modifications. This design prevents accidental checkpoint bloat from operations like <code>rm</code>, <code>mv</code>, or <code>npm install</code>, which should remain under explicit version control.</p>

            <h3>Real-World Use Cases</h3>
            <ul>
                <li><strong>Refactoring experiments</strong>: Try aggressive architectural changes, knowing you can instantly revert</li>
                <li><strong>Bug fixes</strong>: Test multiple debugging approaches in rapid succession</li>
                <li><strong>Feature iteration</strong>: Explore alternative implementations without manual Git branching</li>
            </ul>

            <p>Checkpoints complement Git rather than replacing it. Use checkpoints for session-level experimentation, Git for permanent history and collaboration.</p>
        </section>

        <section>
            <h2>Claude Sonnet 4.5: The Engine Behind Autonomy</h2>
            <p>On September 29, 2025, Anthropic launched <a href="https://www.anthropic.com/news/claude-sonnet-4-5" target="_blank" rel="noopener">Claude Sonnet 4.5</a> as the new default model for Claude Code, calling it "the best coding model in the world." This isn't marketing hyperbole. Sonnet 4.5 demonstrates the ability to maintain focus for more than 30 hours on complex, multi-step development tasks.</p>

            <h3>Key Improvements</h3>
            <ul>
                <li><strong>Extended reasoning</strong>: Handles significantly longer task sequences without losing context</li>
                <li><strong>Agent capabilities</strong>: Better at breaking down complex problems into actionable steps</li>
                <li><strong>Computer use</strong>: Enhanced ability to interact with tools and interfaces</li>
                <li><strong>Math and logic</strong>: Substantial gains in analytical reasoning</li>
            </ul>

            <h3>Pricing and Availability</h3>
            <p>Sonnet 4.5 maintains the same pricing as its predecessor: $3 input / $15 output per million tokens. Access it via the <a href="https://docs.anthropic.com/en/api/getting-started" target="_blank" rel="noopener">Claude API</a> using the model ID <code>claude-sonnet-4-5</code>. The model is also available in <a href="https://github.blog/changelog/2025-10-13-anthropics-claude-sonnet-4-5-is-now-generally-available-in-github-copilot/" target="_blank" rel="noopener">GitHub Copilot</a> as of October 13, 2025.</p>

            <h3>Impact on Claude Code</h3>
            <p>The model upgrade enables the autonomous features discussed throughout this article. Checkpoints, subagents, and extended sessions all benefit from Sonnet 4.5's improved reasoning and task persistence.</p>
        </section>

        <section>
            <h2>Subagents: Parallel Development Workflows</h2>
            <p><a href="https://docs.claude.com/en/docs/claude-code/sub-agents" target="_blank" rel="noopener">Subagents</a> are specialised AI assistants that handle specific task types with their own context windows and tool permissions. Announced in late summer 2025 and refined through September, subagents enable true parallel development workflows.</p>

            <h3>How Subagents Work</h3>
            <p>Each subagent operates in an isolated context window with a custom system prompt and specific tool permissions. When Claude encounters work matching a subagent's expertise, it delegates the task to the specialised agent. This provides three key advantages:</p>
            <ul>
                <li><strong>Context preservation</strong>: Main conversation doesn't get cluttered with specialised task details</li>
                <li><strong>Specialised expertise</strong>: Agents can be fine-tuned with domain-specific instructions</li>
                <li><strong>Parallel execution</strong>: Multiple subagents can work simultaneously on different aspects of your codebase</li>
            </ul>

            <h3>Creating Subagents</h3>
            <p>Use the <code>/agents</code> command to open an interactive interface for creating project-level or user-level agents. Subagents are stored as <a href="https://daringfireball.net/projects/markdown/" target="_blank" rel="noopener">Markdown</a> files with <a href="https://yaml.org/" target="_blank" rel="noopener">YAML</a> frontmatter in <code>.claude/agents/</code> (project) or <code>~/.claude/agents/</code> (user).</p>

            <h3>Built-in Subagent Examples</h3>
            <ul>
                <li><strong>Code reviewer</strong>: Analyses changes for quality, security, and maintainability</li>
                <li><strong>Debugger</strong>: Performs root cause analysis on errors and test failures</li>
                <li><strong>Data scientist</strong>: Handles <a href="https://www.w3schools.com/sql/" target="_blank" rel="noopener">SQL</a> queries and <a href="https://cloud.google.com/bigquery" target="_blank" rel="noopener">BigQuery</a> operations</li>
            </ul>

            <h3>Real-World Application</h3>
            <p>Imagine building a full-stack feature. The main agent coordinates whilst delegating backend API development to one subagent and frontend UI implementation to another. They work in parallel, each maintaining focused context on their specialised domain.</p>
        </section>

        <section>
            <h2>Hooks: Automated Quality Gates</h2>
            <p>Hooks are automated triggers that execute at specific lifecycle points in Claude Code sessions. Released alongside subagents, hooks enable sophisticated workflow automation without manual intervention.</p>

            <h3>Available Hook Types</h3>
            <ul>
                <li><strong>PreToolUse</strong>: Executes before Claude uses any tool, enabling approval/denial logic</li>
                <li><strong>PostToolUse</strong>: Runs after successful tool execution, perfect for formatting or testing</li>
                <li><strong>UserPromptSubmit</strong>: Intercepts user prompts to add context or metadata</li>
                <li><strong>SessionStart</strong>: Injects environment data when sessions begin</li>
                <li><strong>SessionEnd</strong>: Cleans up resources when sessions terminate</li>
            </ul>

            <h3>Common Hook Use Cases</h3>
            <ul>
                <li><strong>Auto-formatting</strong>: Run <a href="https://prettier.io/" target="_blank" rel="noopener">Prettier</a> or <a href="https://github.com/PHP-CS-Fixer/PHP-CS-Fixer" target="_blank" rel="noopener">PHP-CS-Fixer</a> after code changes</li>
                <li><strong>Test automation</strong>: Execute <a href="https://phpunit.de/" target="_blank" rel="noopener">PHPUnit</a> or <a href="https://jestjs.io/" target="_blank" rel="noopener">Jest</a> after modifications</li>
                <li><strong>Linting enforcement</strong>: Block commits that violate <a href="https://eslint.org/" target="_blank" rel="noopener">ESLint</a> or <a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a> rules</li>
                <li><strong>Resource management</strong>: Control parallel execution to prevent database lock conflicts</li>
            </ul>

            <h3>Hook Configuration</h3>
            <p>Hooks are configured in <code>~/.claude/settings.json</code> or <code>.claude/settings.json</code>. Each hook specifies a script path and optional metadata. The <a href="https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md" target="_blank" rel="noopener">v2.0.30 release</a> added prompt-based stop hooks, enabling even more sophisticated control patterns.</p>

            <p>For a detailed example of using hooks to control subagent behaviour and prevent resource conflicts, see my article on <a href="/articles/claude-code-hooks-subagent-control">Advanced Claude Code Hooks: Controlling Sub-Agent Behaviour</a>.</p>
        </section>

        <section>
            <h2>Plugins: Sharing Workflows Through Marketplaces</h2>
            <p>On October 9, 2025, Anthropic launched the <a href="https://docs.claude.com/en/docs/claude-code/plugins" target="_blank" rel="noopener">Claude Code plugin system</a> in public beta. Plugins are lightweight packages that bundle slash commands, subagents, <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener">MCP servers</a>, and hooks into shareable, installable units.</p>

            <h3>What Plugins Include</h3>
            <ul>
                <li><strong>Slash commands</strong>: Custom shortcuts for frequently-used operations</li>
                <li><strong>Subagents</strong>: Purpose-built agents for specialised development tasks</li>
                <li><strong>MCP servers</strong>: Connect to tools and data sources through the Model Context Protocol</li>
                <li><strong>Hooks</strong>: Customise Claude Code's behaviour at key workflow points</li>
            </ul>

            <h3>Using the /plugin Command</h3>
            <p>Install plugins with the <code>/plugin</code> command. First, add a marketplace:</p>
            <pre><code class="language-bash">{{SNIPPET:claude-code-latest-features/add-marketplace.sh}}</code></pre>

            <p>Then browse and install plugins:</p>
            <pre><code class="language-bash">{{SNIPPET:claude-code-latest-features/install-plugin.sh}}</code></pre>

            <p>Plugins work across both terminal and <a href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code" target="_blank" rel="noopener">VS Code extension</a> environments, providing consistent functionality regardless of interface.</p>

            <h3>Creating Plugin Marketplaces</h3>
            <p>Any <a href="https://git-scm.com/" target="_blank" rel="noopener">Git</a> repository can host a plugin marketplace. Create a <code>.claude-plugin/marketplace.json</code> file with properly formatted plugin metadata, then share the repository URL. This decentralised approach enables teams to create internal plugin marketplaces for company-specific workflows.</p>

            <h3>Why Plugins Matter</h3>
            <ul>
                <li><strong>Standardisation</strong>: Engineering leaders enforce consistency across teams</li>
                <li><strong>Knowledge sharing</strong>: Open source maintainers provide best-practice workflows</li>
                <li><strong>Tool integration</strong>: Connect internal tools through MCP without custom development</li>
                <li><strong>Productivity patterns</strong>: Share proven debugging, testing, and deployment workflows</li>
            </ul>
        </section>

        <section>
            <h2>Agent Skills: Progressive Disclosure of Capabilities</h2>
            <p>On October 16, 2025, Anthropic introduced <a href="https://www.anthropic.com/news/skills" target="_blank" rel="noopener">Agent Skills</a>, a new pattern for making specialised abilities available to Claude models. Skills use a "progressive disclosure" design that loads information only when relevant, making the system both token-efficient and scalable.</p>

            <h3>How Skills Work</h3>
            <p>Skills are folders containing instructions, scripts, and resources. Each skill takes only a few dozen tokens in the agent's context, with full details loaded only when the user requests a task the skill can solve. Claude automatically determines which skills are relevant and loads them as needed.</p>

            <h3>Installation and Usage</h3>
            <p>Install skills via the <code>/plugin</code> command from the <a href="https://github.com/anthropics/skills" target="_blank" rel="noopener">anthropics/skills marketplace</a>, or manually by adding them to <code>~/.claude/skills</code>. Skills work across <a href="https://claude.ai/" target="_blank" rel="noopener">Claude.ai</a>, Claude Code, and the <a href="https://docs.anthropic.com/en/api/getting-started" target="_blank" rel="noopener">Claude API</a>.</p>

            <h3>Availability</h3>
            <p>Skills are available on Pro, Max, Team, and Enterprise plans as of October 16, 2025.</p>

            <h3>Skills vs Plugins</h3>
            <p>Whilst plugins bundle multiple customisation types (commands, agents, hooks, MCP servers), skills focus specifically on specialised task capabilities. Think of skills as expertise modules and plugins as workflow packages.</p>
        </section>

        <section>
            <h2>VS Code Extension: Native IDE Integration</h2>
            <p>Announced on September 29, 2025, the native <a href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code" target="_blank" rel="noopener">Claude Code VS Code extension</a> brings AI-assisted development directly into the IDE with real-time visual feedback.</p>

            <h3>Key Features</h3>
            <ul>
                <li><strong>Inline diffs</strong>: See Claude's changes in the IDE diff viewer, not just the terminal</li>
                <li><strong>Sidebar panel</strong>: Dedicated interface for Claude interactions with full chat history</li>
                <li><strong>Quick launch</strong>: Press <code>Cmd+Esc</code> (Mac) or <code>Ctrl+Esc</code> (Windows/Linux) to open Claude Code</li>
                <li><strong>Context awareness</strong>: Current selection and active tab automatically shared with Claude</li>
                <li><strong>Plugin support</strong>: All plugins installed via <code>/plugin</code> work in both terminal and VS Code</li>
            </ul>

            <h3>Checkpoint Integration</h3>
            <p>The checkpoint system works the same way in VS Code. Press <code>Esc</code> twice or use <code>/rewind</code> to access the rewind menu, with changes displayed in the IDE's native diff viewer for clear visual feedback.</p>

            <h3>Terminal Parity</h3>
            <p>The extension maintains feature parity with the terminal interface. Subagents, hooks, skills, and plugins all function identically, ensuring consistent workflows across environments.</p>

            <h3>Status</h3>
            <p>The VS Code extension is currently in beta and available for download from the <a href="https://marketplace.visualstudio.com/" target="_blank" rel="noopener">VS Code Extension Marketplace</a>.</p>
        </section>

        <section>
            <h2>Claude Code on the Web and Mobile</h2>
            <p>On October 20, 2025, Anthropic expanded Claude Code beyond the terminal with a <a href="https://www.anthropic.com/news/claude-code-on-the-web" target="_blank" rel="noopener">web interface</a> and <a href="https://apps.apple.com/app/claude-by-anthropic/id6473753684" target="_blank" rel="noopener">iOS app integration</a>, making AI-assisted coding accessible without local development environments.</p>

            <h3>Web Interface Features</h3>
            <ul>
                <li><strong>GitHub integration</strong>: Connect repositories directly from <a href="https://claude.com/code" target="_blank" rel="noopener">claude.com/code</a></li>
                <li><strong>Browser-based coding</strong>: No terminal or local installation required</li>
                <li><strong>Sandbox security</strong>: Every task runs in an isolated environment with network and filesystem restrictions</li>
                <li><strong>Git proxy service</strong>: Secure authentication ensures Claude can only access authorised repositories</li>
            </ul>

            <h3>Mobile Support</h3>
            <p>The iOS app enables exploratory coding on mobile devices. Whilst not intended for production development, it allows code review, bug fixes, and prototyping from anywhere.</p>

            <h3>Availability</h3>
            <p>Claude Code on the web is in research preview for <a href="https://www.anthropic.com/pricing" target="_blank" rel="noopener">Pro and Max users</a>. Visit <a href="https://claude.com/code" target="_blank" rel="noopener">claude.com/code</a> to connect your first repository.</p>

            <h3>Security Architecture</h3>
            <p>The web interface uses isolated sandbox environments for all code execution. Network and filesystem access is restricted, and Git operations go through a secure proxy that validates repository permissions. This architecture prevents malicious code execution whilst maintaining full development capabilities.</p>

            <h3>Performance Impact</h3>
            <p>According to <a href="https://techcrunch.com/2025/10/20/anthropic-brings-claude-code-to-the-web/" target="_blank" rel="noopener">TechCrunch</a>, Claude Code has grown 10x in users since its broader launch in May 2025, and now accounts for more than $500 million in annualised revenue for Anthropic.</p>
        </section>

        <section>
            <h2>Model Context Protocol (MCP) Integration</h2>
            <p>Claude Code's support for the <a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener">Model Context Protocol</a> enables connections to hundreds of external tools and data sources through a standardized interface. MCP adoption accelerated dramatically in early 2025.</p>

            <h3>What Is MCP?</h3>
            <p>Think of MCP as "USB-C for AI." Just as USB-C provides a universal connection standard for devices, MCP provides a universal protocol for AI models to connect to different tools and services. Developed by Anthropic, MCP is an open-source standard that has seen rapid industry adoption.</p>

            <h3>Industry Adoption Timeline</h3>
            <ul>
                <li><strong>March 2025</strong>: <a href="https://openai.com/" target="_blank" rel="noopener">OpenAI</a> adopted MCP across <a href="https://chat.openai.com/" target="_blank" rel="noopener">ChatGPT</a></li>
                <li><strong>April 2025</strong>: <a href="https://www.google.com/" target="_blank" rel="noopener">Google</a> confirmed support for <a href="https://gemini.google.com/" target="_blank" rel="noopener">Gemini</a></li>
                <li><strong>2025</strong>: <a href="https://www.block.xyz/" target="_blank" rel="noopener">Block</a>, <a href="https://www.apollographql.com/" target="_blank" rel="noopener">Apollo</a>, <a href="https://zed.dev/" target="_blank" rel="noopener">Zed</a>, <a href="https://replit.com/" target="_blank" rel="noopener">Replit</a>, <a href="https://codeium.com/" target="_blank" rel="noopener">Codeium</a>, and <a href="https://sourcegraph.com/" target="_blank" rel="noopener">Sourcegraph</a> all implemented MCP support</li>
            </ul>

            <h3>Available MCP Servers</h3>
            <p>Claude Code can connect to services including <a href="https://stripe.com/" target="_blank" rel="noopener">Stripe</a>, <a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a>, <a href="https://cloudinary.com/" target="_blank" rel="noopener">Cloudinary</a>, <a href="https://www.canva.com/" target="_blank" rel="noopener">Canva</a>, <a href="https://sentry.io/" target="_blank" rel="noopener">Sentry</a>, <a href="https://jam.dev/" target="_blank" rel="noopener">Jam</a>, <a href="https://asana.com/" target="_blank" rel="noopener">Asana</a>, and <a href="https://www.atlassian.com/" target="_blank" rel="noopener">Atlassian</a> products.</p>

            <h3>Claude Code as MCP Server</h3>
            <p>Interestingly, Claude Code can run as an <a href="https://docs.claude.com/en/docs/claude-code/mcp" target="_blank" rel="noopener">MCP server itself</a> using <code>claude mcp serve</code>. This exposes Claude Code's file editing and command execution tools via the MCP protocol, enabling other AI systems to use Claude Code as a tool.</p>

            <h3>Token Management</h3>
            <p>Claude Code displays warnings when MCP tool output exceeds 10,000 tokens, with a default maximum of 25,000 tokens (configurable). This prevents context window exhaustion from verbose tool responses.</p>

            <h3>Current Protocol Version</h3>
            <p>As of early November 2025, the current MCP protocol version was <code>2025-06-18</code> (a newer revision, <code>2025-11-25</code>, followed later that month). The specification continues to evolve with breaking changes as it matures.</p>
        </section>

        <section>
            <h2>Terminal Interface 2.0</h2>
            <p>Version 2.0 of the Claude Code terminal interface, released on September 29, 2025, brings significant UX improvements for power users who prefer command-line workflows.</p>

            <h3>Key Improvements</h3>
            <ul>
                <li><strong>Enhanced status visibility</strong>: Clear indication of current agent state and active operations</li>
                <li><strong>Searchable prompt history</strong>: Press <code>Ctrl+R</code> to search and reuse previous prompts</li>
                <li><strong>Improved mode switching</strong>: Windows users can now use <code>Shift+Tab</code> instead of <code>Alt+M</code> (changed in <a href="https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md" target="_blank" rel="noopener">v2.0.31</a>)</li>
                <li><strong>Better error reporting</strong>: More detailed information when operations fail</li>
            </ul>

            <h3>Background Tasks</h3>
            <p>The updated terminal interface supports <a href="https://www.anthropic.com/news/enabling-claude-code-to-work-more-autonomously" target="_blank" rel="noopener">background tasks</a>, allowing long-running processes like development servers to remain active without blocking Claude Code's progress on other work. This enables true parallel development workflows.</p>

            <h3>Native Binary Performance</h3>
            <p>Version 2.0.33 (latest release) improved native binary installations to launch with significantly better speed, making the terminal experience even more responsive.</p>
        </section>

        <section>
            <h2>Configuration and Customisation Improvements</h2>
            <p>Recent releases added several quality-of-life improvements for advanced users who need fine-grained control over Claude Code's behaviour.</p>

            <h3>Security and Sandbox Controls</h3>
            <p>Version 2.0.30 introduced <code>allowUnsandboxedCommands</code> setting for policy-level restrictions, and <code>disallowedTools</code> field for custom agent definitions to explicitly block specific tools. These features enable organisations to enforce security policies whilst maintaining development flexibility.</p>

            <h3>MCP Configuration</h3>
            <ul>
                <li><strong>SSE support</strong>: Native builds now support Server-Sent Events (SSE) MCP servers (v2.0.30)</li>
                <li><strong>Configuration precedence</strong>: Fixed <code>--mcp-config</code> flag incorrectly overriding file-based configurations (v2.0.30)</li>
                <li><strong>Tool compatibility</strong>: Resolved issues with MCP tools containing incompatible output schemas (v2.0.33)</li>
            </ul>

            <h3>VS Code Integration Settings</h3>
            <p>Version 2.0.31 added <code>respectGitIgnore</code> configuration option for VS Code extension, allowing users to optionally include gitignored files in searches when needed for debugging or analysis.</p>

            <h3>Company Announcements</h3>
            <p>Version 2.0.32 introduced <code>companyAnnouncements</code> setting for displaying startup notifications, useful for enterprise deployments that need to communicate policy changes or updates to development teams.</p>
        </section>

        <section>
            <h2>Getting Started with New Features</h2>
            <p>Each feature below has a quick way to try it.</p>

            <h3>Update Claude Code</h3>
            <p>First, ensure you're running the latest version:</p>
            <pre><code class="language-bash">{{SNIPPET:claude-code-latest-features/update-claude-code.sh}}</code></pre>

            <h3>Try Checkpoints</h3>
            <p>Start a coding session and make some changes. Then press <code>Esc</code> twice to open the rewind menu. Experiment with reverting code, conversation, or both to understand the workflow.</p>

            <h3>Create a Subagent</h3>
            <p>Use the <code>/agents</code> command to create a specialised agent for a common task in your workflow. For example, create a "test runner" agent that validates changes before commits.</p>

            <h3>Install a Plugin</h3>
            <p>Add the official marketplace and explore available plugins:</p>
            <pre><code class="language-bash">{{SNIPPET:claude-code-latest-features/install-official-plugin.sh}}</code></pre>

            <h3>Try the VS Code Extension</h3>
            <p>Search for "Claude Code" in the VS Code Extension Marketplace and install it. Use <code>Cmd+Esc</code> (Mac) or <code>Ctrl+Esc</code> (Windows/Linux) to launch Claude in your IDE.</p>

            <h3>Explore Claude Code on the Web</h3>
            <p>Visit <a href="https://claude.com/code" target="_blank" rel="noopener">claude.com/code</a> (requires Pro or Max plan) and connect a GitHub repository. Try kicking off a coding task from your browser to experience the web interface.</p>

            <h3>Set Up an MCP Server</h3>
            <p>Browse available <a href="https://github.com/modelcontextprotocol/servers" target="_blank" rel="noopener">MCP servers</a> and configure one relevant to your workflow. The <a href="https://docs.claude.com/en/docs/claude-code/mcp" target="_blank" rel="noopener">MCP documentation</a> provides setup instructions.</p>
        </section>

        <section>
            <h2>What's Next for Claude Code?</h2>
            <p>These were the trends visible from where things stood in early November 2025 - worth reading as a forecast to check against what actually shipped, not as a roadmap:</p>

            <ul>
                <li><strong>Extended autonomous operation</strong>: With 30-hour task persistence already demonstrated, longer-running sessions with better error recovery seemed likely</li>
                <li><strong>Team collaboration features</strong>: Shared plugins, subagents, and hooks looked positioned to enable team-wide consistency</li>
                <li><strong>Enhanced mobile experience</strong>: The iOS app looked like a first step rather than a finished mobile workflow</li>
                <li><strong>Deeper IDE integrations</strong>: the VS Code extension was still in beta, with a stable release and possible <a href="https://www.jetbrains.com/" target="_blank" rel="noopener">JetBrains</a> integration plausible next</li>
                <li><strong>Enterprise features</strong>: security controls and audit logging for regulated industries looked like an open gap</li>
            </ul>

            <p>The pattern across that period was consistent: Claude Code moving from a coding assistant into a broader development platform spanning terminals, IDEs, web browsers, and mobile devices.</p>
        </section>

        <section>
            <h2>From Coding Assistant to Development Platform</h2>
            <p>Checkpoints gave a way to undo experiments, subagents split work into isolated, specialised context windows, and plugins packaged and shared both of those, plus hooks and MCP servers, as installable units. The VS Code extension and the web and mobile interfaces then moved all of that out of a single terminal window, with Claude Sonnet 4.5 as the model change underneath most of it.</p>

            <p>Individually, several of these are conveniences, but together, over three months, they moved Claude Code from a tool you run to a platform you configure: routine tasks delegated to subagents, experiments made reversible by checkpoints, and workflows packaged as plugins rather than repeated by hand.</p>

            <p>For developers working in <a href="https://www.php.net/" target="_blank" rel="noopener">PHP</a>, <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a>, <a href="https://www.python.org/" target="_blank" rel="noopener">Python</a>, <a href="https://go.dev/" target="_blank" rel="noopener">Go</a>, or anything else, the practical starting point is checkpoints, since they cost nothing to try and remove the main reason to hold back from letting Claude Code make larger changes unsupervised.</p>

            <h3>Additional Resources</h3>
            <ul>
                <li><a href="https://github.com/anthropics/claude-code" target="_blank" rel="noopener">Claude Code GitHub Repository</a> - Source code, issues, and community discussions</li>
                <li><a href="https://github.com/anthropics/claude-code/blob/main/CHANGELOG.md" target="_blank" rel="noopener">Official Changelog</a> - Complete version history and release notes</li>
                <li><a href="https://docs.claude.com/en/docs/claude-code" target="_blank" rel="noopener">Claude Code Documentation</a> - Comprehensive guides and API reference</li>
                <li><a href="https://www.anthropic.com/news" target="_blank" rel="noopener">Anthropic News</a> - Official announcements and feature launches</li>
                <li><a href="https://marketplace.visualstudio.com/items?itemName=anthropic.claude-code" target="_blank" rel="noopener">VS Code Extension</a> - Download and install the IDE integration</li>
                <li><a href="https://claude.com/code" target="_blank" rel="noopener">Claude Code on the Web</a> - Try the browser-based interface</li>
                <li><a href="https://github.com/anthropics/skills" target="_blank" rel="noopener">Official Skills Marketplace</a> - Browse and install Agent Skills</li>
                <li><a href="https://modelcontextprotocol.io/" target="_blank" rel="noopener">Model Context Protocol</a> - Learn about MCP and available servers</li>
            </ul>
        </section>
    `,
  },
  // Migrating: claude-code-planning-execution-workflows.ejs
  {
    id: 'claude-code-planning-execution-workflows',
    title: 'Claude Code Planning and Execution Workflows: From Built-in Modes to Parallel Agents',
    description:
      'How to structure Claude Code planning work: a PlanWorkflow.md contract, GitHub issue-driven tracking, and the workflow tiers from built-in Plan Mode through parallel agents and custom subagents',
    date: '2025-10-01',
    category: CATEGORIES.ai.id,
    heroImage: {
      src: '/images/claude-code-planning-execution-workflows/hero.webp',
      alt: 'A black-and-white 1940s drafting room, rows of engineers at drafting tables with rolled blueprints on their desks',
      ogImage: '/images/claude-code-planning-execution-workflows/og.jpg',
      creditText: 'Image: NASA, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Interior_View_of_Drafting_Room_in_ERB_-_GPN-2000-001447.jpg',
    },
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'LLMDevs',
    register: 'formal',
    content: `
<div class="intro">
    <p class="lead">
        Effective AI-assisted development requires separating planning from execution. <a href="https://claude.com/claude-code" target="_blank" rel="noopener">Claude Code</a> version 2 (2025) provides multiple approaches to planning workflows, from simple built-in modes to sophisticated parallel agent architectures that can handle complex, multi-repository projects.
    </p>
</div>

<section>
    <h2>Built-in Plan Mode: The Foundation</h2>
    <p>
        <a href="https://docs.claude.com/en/docs/claude-code/common-workflows" target="_blank" rel="noopener">Plan Mode</a> is Claude Code's core feature for safe, read-only code analysis. It creates a deliberate boundary between research and execution, preventing accidental changes whilst exploring codebases.
    </p>

    <h3>Activating Plan Mode</h3>
    <p>
        The fastest way to enter Plan Mode is with <strong>Shift+Tab</strong>. This keyboard shortcut cycles through permission modes:
    </p>
    <ul>
        <li><strong>Normal Mode</strong>: Standard tool permissions</li>
        <li><strong>Auto-Accept Mode</strong>: Claude executes tools without prompts (Shift+Tab once)</li>
        <li><strong>Plan Mode</strong>: Read-only analysis only (Shift+Tab twice)</li>
    </ul>
    <p>
        When active, you'll see <code>⏸ plan mode on</code> at the terminal bottom.
    </p>

    <h3>Alternative Activation Methods</h3>
    <p>
        Start a new session directly in Plan Mode:
    </p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/plan-mode-cli.sh}}
</code></pre>

    <p>
        Run headless planning queries without interactive sessions:
    </p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/plan-mode-headless.sh}}
</code></pre>

    <h3>Setting Plan Mode as Default</h3>
    <p>
        Configure Claude Code to always start in Plan Mode by editing <code>.claude/settings.json</code>:
    </p>
    <pre><code class="language-json">{{SNIPPET:claude-code-planning-execution-workflows/plan-mode-settings.json}}
</code></pre>

    <h3>When to Use Built-in Plan Mode</h3>
    <p>
        Plan Mode excels at:
    </p>
    <ul>
        <li><strong>Exploring unfamiliar codebases</strong>: Understanding architecture before making changes</li>
        <li><strong>Multi-step implementation planning</strong>: Breaking down complex features into actionable steps</li>
        <li><strong>Code review and analysis</strong>: Examining code without modification risk</li>
        <li><strong>Security audits</strong>: Analysing code without executing it</li>
        <li><strong>Interactive refinement</strong>: Iterating on plans before execution</li>
    </ul>

    <h3>Limitations of Built-in Plan Mode</h3>
    <p>
        Whilst powerful, built-in Plan Mode has constraints:
    </p>
    <ul>
        <li><strong>No persistent artifacts</strong>: Plans exist only in the conversation</li>
        <li><strong>Single-threaded</strong>: Cannot parallelise research across multiple areas</li>
        <li><strong>Context mixing</strong>: Planning and execution share the same context window</li>
        <li><strong>No structured tracking</strong>: No standardised format for progress tracking</li>
    </ul>
    <p>
        These limitations become apparent in complex projects that require formal planning, team collaboration, or parallel workstreams.
    </p>
</section>

<section>
    <h2>Formal Planning Workflows: CLAUDE/plan Structure</h2>
    <p>
        For complex tasks requiring structured planning, persistent documentation, and team collaboration, a formal planning workflow provides significant advantages over built-in Plan Mode.
    </p>

    <h3>Directory Structure</h3>
    <p>
        Formal planning workflows use a standardised directory structure:
    </p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/directory-structure.sh}}
</code></pre>

    <h3>The Two-Mode Workflow</h3>
    <p>
        Formal workflows enforce strict separation between planning and execution:
    </p>

    <h4>Planning Mode (Default)</h4>
    <p>
        <strong>NO CODE CHANGES</strong> are permitted. Planning mode focuses on:
    </p>
    <ul>
        <li>Full research of relevant files, database tables, and dependencies</li>
        <li>Terse but detailed plan of required actions</li>
        <li>Code snippets for particularly relevant implementations</li>
        <li>Verification against project documentation and standards</li>
        <li>Creation of structured TODO lists with progress tracking</li>
    </ul>

    <h4>Execution Mode</h4>
    <p>
        Triggered only by explicit instruction (e.g., "execute plan", "proceed with implementation"). Execution mode:
    </p>
    <ul>
        <li>Works through plan tasks systematically</li>
        <li>Updates progress tracking as tasks complete</li>
        <li>Runs quality tools (linters, static analysis) continuously</li>
        <li>Resolves issues before moving to next task</li>
        <li>Marks plan as "ALL DONE!" only when complete and validated</li>
    </ul>

    <h3>Documenting Your Plan Workflow</h3>
    <p>
        Every project using formal planning should document its workflow in <code>CLAUDE/PlanWorkflow.md</code>. This is the contract between developers and Claude Code, defining how planning and execution work in your project.
    </p>

    <h4>Basic PlanWorkflow.md Template</h4>
    <p>
        Start with the fundamental two-mode structure:
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/basic-planworkflow.md}}
</code></pre>

    <h3>Advanced: Parallel Execution Workflows</h3>
    <p>
        For projects that use parallel agents, extend your <code>PlanWorkflow.md</code> with parallel execution structure. This enables sophisticated multi-agent orchestration.
    </p>

    <h4>Parallel Execution Plan Structure</h4>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/parallel-execution-structure.md}}
</code></pre>

    <h4>Parallel Execution Matrix</h4>
    <p>
        Document the visual matrix pattern in your workflow guide:
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/parallel-execution-matrix.md}}
</code></pre>

    <h4>Agent Communication Protocol</h4>
    <p>
        Define how parallel agents track and communicate progress:
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/agent-communication-protocol.md}}
</code></pre>

    <h4>Optimisation Strategies</h4>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/optimization-strategies.md}}
</code></pre>

    <h4>Anti-Patterns to Document</h4>
    <p>
        Help Claude Code avoid common mistakes by documenting anti-patterns:
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/anti-patterns.md}}
</code></pre>

    <h3>Plan Document Structure</h3>
    <p>
        Individual plan documents follow a standardised format:
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/basic-plan-document.md}}
</code></pre>

    <h4>Parallel Execution Plan Example</h4>
    <p>
        For complex features requiring parallel execution, structure plans like this:
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/parallel-plan-example.md}}
</code></pre>

    <h3>Task Status Symbols</h3>
    <p>
        Progress tracking uses three states:
    </p>
    <ul>
        <li><code>[ ]</code> - Task not started</li>
        <li><code>[⏳]</code> - Task in progress (currently being worked on)</li>
        <li><code>[✓]</code> - Task completed and validated</li>
    </ul>

    <h3>Benefits of Formal Planning</h3>
    <p>
        Structured planning workflows provide significant advantages:
    </p>
    <ul>
        <li><strong>Persistent documentation</strong>: Plans survive across sessions and team members</li>
        <li><strong>Version control integration</strong>: Plans tracked in Git alongside code</li>
        <li><strong>Progress transparency</strong>: Clear status tracking for stakeholders</li>
        <li><strong>Knowledge preservation</strong>: Research and decisions documented for future reference</li>
        <li><strong>Team collaboration</strong>: Multiple developers can reference and update plans</li>
        <li><strong>Standards enforcement</strong>: Links to project standards ensure consistency</li>
    </ul>

    <h3>Linking Plan Workflows to CLAUDE.md</h3>
    <p>
        Reference the planning workflow in your main project documentation (<code>CLAUDE.md</code>):
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/claude-md-basic-link.md}}
</code></pre>

    <p>
        For infrastructure projects with deployment requirements, add safety rules:
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/claude-md-deployment-safety.md}}
</code></pre>
</section>

<section>
    <h2>Parallel Agent Execution</h2>
    <p>
        Claude Code's parallel agent architecture enables sophisticated orchestration of multiple specialised agents working simultaneously. This is a significant evolution from sequential, single-agent workflows, and follows a similar pattern to <a href="https://www.anthropic.com/engineering/multi-agent-research-system" target="_blank" rel="noopener">the multi-agent architecture Anthropic built for its Research product</a>.
    </p>

    <h3>Understanding Parallel Agents</h3>
    <p>
        <a href="https://docs.claude.com/en/docs/claude-code/sub-agents" target="_blank" rel="noopener">Subagents</a> operate in separate context windows, each with their own expertise and tool access. This provides:
    </p>
    <ul>
        <li><strong>Context isolation</strong>: Each agent uses full context for specialised tasks</li>
        <li><strong>Parallel execution</strong>: Multiple research or implementation streams run concurrently</li>
        <li><strong>Specialised focus</strong>: Agents can be experts in specific domains</li>
        <li><strong>Additive capacity</strong>: Multiple agents provide more total reasoning capacity</li>
    </ul>

    <h3>Activating Parallel Agent Execution</h3>
    <p>
        Tell Claude Code to execute your plan with parallel agents:
    </p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/parallel-execution-examples.sh}}
</code></pre>

    <h3>Multi-Agent Orchestration Patterns</h3>

    <h4>Pattern 1: Parallel Research</h4>
    <p>
        Deploy multiple agents to research different aspects of a codebase simultaneously:
    </p>
    <ul>
        <li><strong>Agent 1</strong>: Database schema and query patterns</li>
        <li><strong>Agent 2</strong>: API endpoints and routing</li>
        <li><strong>Agent 3</strong>: Authentication and authorisation</li>
        <li><strong>Agent 4</strong>: Frontend integration points</li>
    </ul>
    <p>
        Each agent produces a report, which the lead agent synthesises into a comprehensive plan.
    </p>

    <h4>Pattern 2: Parallel Implementation</h4>
    <p>
        For feature development with independent components:
    </p>
    <ul>
        <li><strong>Backend specialist</strong>: Implement server-side API endpoints</li>
        <li><strong>Frontend specialist</strong>: Build client-side UI components</li>
        <li><strong>QA specialist</strong>: Generate integration tests</li>
        <li><strong>Documentation specialist</strong>: Draft API documentation</li>
    </ul>

    <h4>Pattern 3: Sequential Handoffs</h4>
    <p>
        Create an automated assembly line for complete feature implementation:
    </p>
    <ol>
        <li><strong>Product manager agent</strong>: Creates detailed requirements and acceptance criteria</li>
        <li><strong>Architect agent</strong>: Designs technical approach and data structures</li>
        <li><strong>Implementation agent</strong>: Writes code following architecture</li>
        <li><strong>Review agent</strong>: Analyses code quality and suggests improvements</li>
        <li><strong>Refinement agent</strong>: Applies review feedback</li>
        <li><strong>QA agent</strong>: Validates implementation against requirements</li>
    </ol>

    <h3>Performance Considerations</h3>
    <p>
        Parallel agent architectures have trade-offs:
    </p>
    <ul>
        <li><strong>Token usage</strong>: For a comparable multi-agent architecture Anthropic built for its Research product, multi-agent systems used approximately <a href="https://www.anthropic.com/engineering/multi-agent-research-system" target="_blank" rel="noopener">15× more tokens</a> than single-agent chats. Expect a similar order-of-magnitude increase with Claude Code's subagents</li>
        <li><strong>Quality improvement</strong>: In that same Research product architecture, multi-agent Claude Opus 4 (lead) + Sonnet 4 (subagents) outperformed single-agent Opus by <a href="https://www.anthropic.com/engineering/multi-agent-research-system" target="_blank" rel="noopener">90.2% on internal research evaluations</a>, though Claude Code's own subagent feature has not published equivalent benchmarks</li>
        <li><strong>Cost vs. speed</strong>: Parallel execution completes faster but consumes more resources</li>
        <li><strong>Non-determinism</strong>: AI behaviour varies across runs; test agent prompts thoroughly</li>
    </ul>

    <h3>When to Use Parallel Agents</h3>
    <p>
        The common thread across good candidates for parallel execution is independence: the work splits into pieces that don't need to read each other's output mid-task. Researching four unrelated modules of a codebase fits; refactoring a single function that touches all four doesn't. See "Choosing Your Workflow" below for the full breakdown of when this tier beats built-in Plan Mode or formal planning.
    </p>

    <h3>Example: Plan Segment Execution</h3>
    <p>
        Given a comprehensive plan with multiple independent sections, Claude Code can execute segments in parallel. For example, given this plan:
    </p>
    <pre><code class="language-markdown">{{SNIPPET:claude-code-planning-execution-workflows/progress-checklist-example.md}}
</code></pre>

    <p>
        You can trigger parallel execution:
    </p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/execute-parallel-research.sh}}
</code></pre>

    <p>
        Claude Code will:
    </p>
    <ol>
        <li>Launch four specialised agents, each researching one area</li>
        <li>Each agent produces a detailed research report</li>
        <li>The lead agent synthesises findings into a unified design</li>
        <li>Updates the plan document with research results</li>
        <li>Marks research tasks as complete</li>
    </ol>
</section>

<section>
    <h2>Custom Subagents</h2>
    <p>
        Whilst built-in parallel agents are powerful, <a href="https://docs.claude.com/en/docs/claude-code/sub-agents" target="_blank" rel="noopener">custom subagents</a> provide fine-grained control over agent behaviour, tool access, and specialisation. This is a deep topic that warrants its own dedicated article.
    </p>

    <h3>Quick Overview</h3>
    <p>
        Custom subagents enable:
    </p>
    <ul>
        <li><strong>Specialised system prompts</strong>: Tailored instructions for specific tasks</li>
        <li><strong>Tool access control</strong>: Limit agents to relevant tools only</li>
        <li><strong>Model selection</strong>: Use different models for different tasks (e.g., Opus for planning, Sonnet for implementation)</li>
        <li><strong>Reusable configurations</strong>: Share agent definitions across projects</li>
        <li><strong>Project-specific agents</strong>: Create agents that understand project conventions</li>
    </ul>

    <h3>Creating Custom Agents</h3>
    <p>
        Use the <code>/agents</code> command to create a new subagent:
    </p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/agents-command.sh}}
</code></pre>

    <p>
        Define the agent's characteristics:
    </p>
    <ul>
        <li><strong>Name</strong>: Unique identifier (e.g., <code>code-reviewer</code>, <code>php-expert</code>)</li>
        <li><strong>Description</strong>: Purpose and expertise area</li>
        <li><strong>System prompt</strong>: Detailed instructions and behavioural constraints</li>
        <li><strong>Tool access</strong>: Which tools the agent can use</li>
        <li><strong>Model</strong>: Which Claude model to use</li>
    </ul>

    <h3>Agent Configuration Hierarchy</h3>
    <p>
        Subagents can be configured at three levels:
    </p>
    <ol>
        <li><strong>Project-level</strong>: <code>.claude/agents/</code> (highest priority, version-controlled)</li>
        <li><strong>User-level</strong>: <code>~/.claude/agents/</code> (personal agents across projects)</li>
        <li><strong>CLI-based</strong>: Dynamic configuration for one-off tasks</li>
    </ol>

    <h3>Best Practices for Custom Agents</h3>
    <p>
        When creating custom subagents:
    </p>
    <ul>
        <li><strong>Separation of concerns</strong>: One responsibility per agent</li>
        <li><strong>Provide examples</strong>: Include positive/negative examples in system prompts</li>
        <li><strong>Progressive tool expansion</strong>: Start with minimal tools, expand as needed</li>
        <li><strong>Detailed system prompts</strong>: <a href="https://www.anthropic.com/engineering/claude-code-best-practices" target="_blank" rel="noopener">LLMs excel at pattern recognition</a>; be specific</li>
        <li><strong>Version control</strong>: Commit project-level agents to Git</li>
    </ul>

    </section>

<section>
    <h2>GitHub Integration for High-Level Tracking</h2>
    <p>
        For larger projects that need proper issue tracking and PR management, integrate Claude Code workflows with <a href="https://cli.github.com/" target="_blank" rel="noopener">GitHub CLI</a>.
    </p>

    <h3>Issue-Driven Development Workflow</h3>
    <p>
        A complete workflow that integrates planning, execution, and tracking:
    </p>

    <h4>1. Create Issue</h4>
    <p>Ask Claude Code to create an issue describing the feature or bug:</p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-create-issue.sh}}
</code></pre>
    <p>
        Claude Code will execute <code>gh issue create</code> with appropriate title and body, then return the issue number for reference.
    </p>

    <h4>2. Create and Commit Plan</h4>
    <p>Request plan creation and commit it with issue reference:</p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-create-plan-commit.sh}}
</code></pre>
    <p>
        Claude Code will create the plan file, commit with proper message format, and push to the remote repository.
    </p>

    <h4>3. Update Issue with Plan Link</h4>
    <p>Link the plan document to the issue for tracking:</p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-comment-plan-link.sh}}
</code></pre>
    <p>
        Claude Code will get the commit SHA and add a formatted comment to the issue with a GitHub permalink to the plan file.
    </p>

    <h4>4. Execute Plan</h4>
    <p>Start implementation by referencing the plan document:</p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-execute-plan.sh}}
</code></pre>
    <p>
        Claude Code will read the plan, break down the tasks, and systematically implement each component with proper error handling and testing.
    </p>

    <h4>5. Commit Implementation</h4>
    <p>After execution, commit the changes with detailed summary:</p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-commit-implementation.sh}}
</code></pre>
    <p>
        Claude Code will stage relevant files, create a descriptive multi-line commit message with issue reference, and push to remote.
    </p>

    <h4>6. Update Issue with Completion Summary</h4>
    <p>Document the implementation results in the issue:</p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-comment-completion.sh}}
</code></pre>
    <p>
        Claude Code will retrieve the execution commit SHA, format a comprehensive summary with markdown, and post it to the issue.
    </p>

    <h4>7. Create Pull Request</h4>
    <p>Finally, create a PR directly from the completed work:</p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-create-pr.sh}}
</code></pre>
    <p>
        Claude Code will analyse the commits, generate PR title and body with summary/changes/testing sections, and create the PR targeting the main branch with proper issue closure reference.
    </p>

    <div class="note">
        <p>
            <strong>Key Benefits:</strong> This workflow keeps all context in GitHub issues, provides clear audit trails, and enables team collaboration. Claude Code handles all the <code>gh</code> CLI complexity behind natural language requests, maintaining consistent formatting and following repository conventions automatically.
        </p>
    </div>

    <h3>PR Workflow Integration</h3>
    <p>
        Use Claude Code to create PRs directly from plan completion:
    </p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-create-pr-after-plan.sh}}
</code></pre>

    <p>
        Claude Code will:
    </p>
    <ol>
        <li>Generate a PR title from the work completed</li>
        <li>Create a detailed PR description with summary and test plan</li>
        <li>Push the current branch to remote</li>
        <li>Open the PR via GitHub CLI</li>
        <li>Return the PR URL</li>
    </ol>

    <h3>Tracking Plan Status via GitHub</h3>
    <p>
        Use GitHub Projects to visualise plan progress:
    </p>
    <ul>
        <li><strong>Backlog</strong>: Plans not yet started</li>
        <li><strong>Planning</strong>: Plans being researched and designed</li>
        <li><strong>Ready</strong>: Plans approved and ready for execution</li>
        <li><strong>In Progress</strong>: Plans currently being implemented</li>
        <li><strong>Review</strong>: PRs open for review</li>
        <li><strong>Done</strong>: PRs merged, plans archived</li>
    </ul>

    <h3>Cross-Repository Planning</h3>
    <p>
        For features spanning multiple repositories:
    </p>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/gh-cross-repo-issues.sh}}
</code></pre>
</section>

<section>
    <h2>Extended Thinking Mode</h2>
    <p>
        Claude Code supports <a href="https://www.anthropic.com/news/visible-extended-thinking" target="_blank" rel="noopener">extended thinking</a>, where Claude uses additional reasoning tokens before responding. This is particularly valuable during the planning phase.
    </p>

    <h3>Triggering Extended Thinking</h3>
    <p>
        Use specific phrases to request deeper reasoning:
    </p>
    <ul>
        <li><code>"think"</code> - Standard extended thinking</li>
        <li><code>"think hard"</code> - More extensive reasoning</li>
        <li><code>"think harder"</code> - Increased reasoning budget</li>
        <li><code>"ultrathink"</code> - Maximum reasoning capacity</li>
    </ul>

    <h3>When to Use Extended Thinking</h3>
    <p>
        Extended thinking is most effective for:
    </p>
    <ul>
        <li><strong>Architecture decisions</strong>: Evaluating multiple design approaches</li>
        <li><strong>Complex refactoring</strong>: Understanding interconnected code changes</li>
        <li><strong>Security analysis</strong>: Identifying subtle vulnerabilities</li>
        <li><strong>Performance optimisation</strong>: Analysing algorithmic complexity</li>
    </ul>

    <h3>Example: Planning with Extended Thinking</h3>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/extended-thinking-example.sh}}
</code></pre>

    <p>
        Claude will display its reasoning process before providing recommendations, helping you understand the thought process behind architectural decisions.
    </p>
</section>

<section>
    <h2>Practical Workflow Examples</h2>

    <h3>Example 1: Simple Feature with Built-in Plan Mode</h3>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/workflow-example-simple-feature.sh}}
</code></pre>

    <h3>Example 2: Complex Feature with Formal Planning</h3>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/workflow-example-formal-planning.sh}}
</code></pre>

    <h3>Example 3: Multi-Repository Feature with Parallel Agents</h3>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/workflow-example-multi-repo.sh}}
</code></pre>

    <h3>Example 4: Large Codebase Exploration</h3>
    <pre><code class="language-bash">{{SNIPPET:claude-code-planning-execution-workflows/workflow-example-codebase-exploration.sh}}
</code></pre>
</section>

<section>
    <h2>Best Practices and Anti-Patterns</h2>

    <h3>Do: Separate Planning from Execution</h3>
    <p>
        Always complete planning before executing. Switching between modes mid-task leads to confused context and poor decisions.
    </p>

    <h3>Do: Update Plans as You Learn</h3>
    <p>
        Plans should evolve as implementation reveals new information. Add discovered tasks to the Progress section immediately.
    </p>

    <h3>Do: Use Parallel Agents for Independent Work</h3>
    <p>
        Deploy parallel agents when tasks are truly independent. Don't parallelise tightly coupled changes.
    </p>

    <h3>Don't: Mix Planning and Execution Context</h3>
    <p>
        Keep planning conversations separate from execution conversations. Use formal plan documents as the handoff point.
    </p>

    <h3>Don't: Parallelise Without Clear Boundaries</h3>
    <p>
        Parallel agents need clear, independent scopes. Overlapping responsibilities lead to conflicts and rework.
    </p>

    <h3>Don't: Skip Progress Tracking</h3>
    <p>
        Update task status immediately after completion. Batch updates lead to lost context and duplicate work.
    </p>
</section>

<section>
    <h2>Choosing Your Workflow</h2>
    <p>
        Select the appropriate workflow based on task complexity:
    </p>

    <h3>Built-in Plan Mode</h3>
    <p><strong>Best for:</strong></p>
    <ul>
        <li>Quick explorations and investigations</li>
        <li>Single-file or small changes</li>
        <li>Interactive refinement of ideas</li>
        <li>Solo developer work</li>
    </ul>

    <h3>Formal Planning (CLAUDE/plan)</h3>
    <p><strong>Best for:</strong></p>
    <ul>
        <li>Multi-file refactoring</li>
        <li>New feature implementation</li>
        <li>Team collaboration</li>
        <li>Long-running projects</li>
        <li>Work requiring documentation</li>
    </ul>

    <h3>Parallel Agent Execution</h3>
    <p><strong>Best for:</strong></p>
    <ul>
        <li>Large codebase exploration</li>
        <li>Multi-component features</li>
        <li>Complex investigations</li>
        <li>Cross-cutting changes</li>
        <li>Time-sensitive projects</li>
    </ul>

    <h3>Custom Subagents</h3>
    <p><strong>Best for:</strong></p>
    <ul>
        <li>Repeated specialised tasks</li>
        <li>Project-specific workflows</li>
        <li>Enforcing coding standards</li>
        <li>Multi-stage pipelines</li>
        <li>Advanced orchestration</li>
    </ul>
</section>

<section>
    <h2>Conclusion</h2>
    <p>
        Claude Code's planning capabilities range from simple built-in modes to sophisticated parallel agent architectures. The right approach depends on your project complexity, team structure, and workflow requirements - see "Choosing Your Workflow" above for a breakdown of which tier fits which situation.
    </p>
    <p>
        Most importantly: <strong>always separate planning from execution</strong>. This single principle, regardless of which workflow you choose, will dramatically improve the quality and maintainability of your AI-assisted development.
    </p>
</section>

<section>
    <h2>Resources</h2>
    <ul>
        <li><a href="https://docs.claude.com/en/docs/claude-code/common-workflows" target="_blank" rel="noopener">Claude Code Common Workflows</a> - Official documentation on Plan Mode</li>
        <li><a href="https://docs.claude.com/en/docs/claude-code/sub-agents" target="_blank" rel="noopener">Claude Code Subagents</a> - Official subagent documentation</li>
        <li><a href="https://www.anthropic.com/engineering/multi-agent-research-system" target="_blank" rel="noopener">How We Built Our Multi-Agent Research System</a> - Anthropic's deep dive on parallel agents</li>
        <li><a href="https://www.anthropic.com/engineering/claude-code-best-practices" target="_blank" rel="noopener">Claude Code Best Practices</a> - Official best practices from Anthropic</li>
        <li><a href="https://cli.github.com/" target="_blank" rel="noopener">GitHub CLI</a> - Command-line tool for GitHub integration</li>
        <li><a href="https://www.anthropic.com/news/visible-extended-thinking" target="_blank" rel="noopener">Extended Thinking</a> - Anthropic's announcement of extended thinking capabilities</li>
        <li><a href="https://claudelog.com/mechanics/plan-mode/" target="_blank" rel="noopener">ClaudeLog: Plan Mode Mechanics</a> - Community guide to Plan Mode</li>
        <li><a href="https://github.com/wshobson/agents" target="_blank" rel="noopener">Production-Ready Subagents Collection</a> - Community-created agent examples</li>
    </ul>
</section>
    `,
  },
  // Migrating: defensive-programming-principles.ejs
  {
    id: 'defensive-programming-principles',
    title: 'Defensive Programming Principles: YAGNI, Invalid States, and Domain Purity',
    description:
      'A practical look at three techniques - YAGNI, type-driven invalid-state prevention, and domain object purity - for cutting whole categories of bugs out of PHP and TypeScript codebases before they can exist.',
    date: '2025-08-07',
    category: CATEGORIES.php.id,
    readingTime: 14,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'programming',
    heroImage: {
      src: '/images/defensive-programming-principles/hero.webp',
      alt: 'A black-and-white photograph of the radial-gate hoist mechanism and walkway railings on the spillway bridge at Kachess Dam',
      ogImage: '/images/defensive-programming-principles/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:RADIAL_GATE_OPERATING_MECHANISMS_AND_SPILLWAY_BRIDGE,_LOOKING_WEST_-_Kachess_Dam,_1936_Spillway_and_Radial_Gates,_Kachess_River,_1.5_miles_north_of_Interstate_90_,_Easton,_Kittitas_HAER_WA-79-B-2.tif',
    },
    content: `
<div class="intro">
    <p class="lead">
        Handling edge cases is only the surface of defensive programming; the deeper aim is designing systems
        that prevent entire classes of bugs from existing in the first place, and three principles do most of
        that work: YAGNI (You Aren't Gonna Need It), making invalid states unrepresentable, and maintaining
        domain object purity. Together they produce codebases that are more reliable, more maintainable, and
        easier to reason about.
    </p>
</div>

<section>
    <h2>The Foundation of Defensive Programming</h2>
    <p>
        Defensive programming has evolved beyond simple input validation and error checking. Modern defensive 
        programming focuses on <em>preventing problems by design</em> rather than catching them after they occur. 
        The three principles we'll explore work together to create a practical development approach:
    </p>
    
    <ul>
        <li><strong>YAGNI</strong> prevents unnecessary complexity that breeds bugs</li>
        <li><strong>Invalid state prevention</strong> uses type systems to eliminate entire classes of errors</li>
        <li><strong>Domain purity</strong> maintains clear boundaries that prevent architectural decay</li>
    </ul>
    
    <p>
        These are practical techniques with immediate benefits for any codebase, from small PHP applications
        to large-scale TypeScript systems.
    </p>
</section>

<section>
    <h2>YAGNI: Rejecting Unnecessary Complexity</h2>
    <p>
        YAGNI ("You Aren't Gonna Need It"), which emerged from Extreme Programming and is explained in depth
        by <a href="https://martinfowler.com/bliki/Yagni.html">Martin Fowler</a>, states that you shouldn't
        add functionality until you actually need it. This principle directly combats over-engineering. You
        know, the tendency to build "flexible" solutions for problems that don't exist.
    </p>
    
    <h3>Understanding YAGNI Through Pseudocode</h3>
    <p>
        The core concept is best understood by contrasting over-engineered and simple approaches. Here's 
        how YAGNI violations typically manifest and how to apply the principle correctly:
    </p>
    
    <pre><code class="language-plaintext">{{SNIPPET:defensive-programming-principles/yagni-pseudocode.txt}}
</code></pre>

    <p>
        This pseudocode illustrates the fundamental YAGNI principle: focus on solving the actual requirement 
        with the simplest possible solution. The over-engineered approach creates extensive abstractions for 
        hypothetical future needs, whilst the YAGNI-compliant version addresses the immediate problem directly.
    </p>
    
    <h3>YAGNI in PHP: A Real-World Example</h3>
    <p>
        Here's how the YAGNI violation looks in actual PHP code: an over-engineered caching system built
        for requirements that don't exist:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:defensive-programming-principles/yagni-violation-php.php}}
</code></pre>

    <p>
        This represents months of development time invested in abstract base classes, multiple implementations, 
        factory patterns, and configuration systems, all for a simple session storage need.
    </p>
    
    <p>
        The YAGNI-compliant PHP approach focuses on the actual requirement:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:defensive-programming-principles/yagni-good-php.php}}
</code></pre>

    <p>
        This simple implementation solves the immediate need without unnecessary abstraction. The key insight 
        from <a href="https://www.techtarget.com/whatis/definition/You-arent-gonna-need-it">YAGNI's definition</a> 
        is that when additional caching features are actually needed, refactoring this code is straightforward,
        and you'll have concrete requirements to guide the design.
    </p>
    
    <h3>YAGNI in Infrastructure as Code</h3>
    <p>
        YAGNI applies equally well to infrastructure automation. Compare these Ansible playbooks:
    </p>
    
    <pre><code class="language-yaml">{{SNIPPET:defensive-programming-principles/ansible-yagni.yml}}
</code></pre>

    <p>
        The "flexible" playbook introduces complexity for deployment strategies, database types, and 
        monitoring systems that aren't currently needed. The simple version accomplishes what you actually need 
        with clear, maintainable code.
    </p>
    
    <h3>When YAGNI Doesn't Apply</h3>
    <p>
        As <a href="https://martinfowler.com/bliki/Yagni.html">Martin Fowler clarifies</a>, YAGNI doesn't 
        apply to efforts that make software easier to modify. Good architecture, clean code practices, 
        and refactoring support YAGNI by keeping code malleable for future changes.
    </p>
    
    <blockquote>
        "Yagni only applies to capabilities built into the software to support a presumptive feature, 
        it does not apply to effort to make the software easier to modify." 
        <cite>Martin Fowler</cite>
    </blockquote>
</section>

<section>
    <h2>Make Invalid States Unrepresentable</h2>
    <p>
        This principle, <a href="https://www.improving.com/thoughts/make-invalid-states-unrepresentable/">popularised in functional programming</a>,
        uses type systems to prevent invalid data from being represented in your program. When you implement it 
        correctly, the compiler prevents entire classes of runtime errors.
    </p>
    
    <h3>Understanding Type Safety Through Pseudocode</h3>
    <p>
        The core concept involves using type systems to make invalid data combinations impossible to represent. 
        Here's how weak typing creates problems and how proper type design solves them:
    </p>
    
    <pre><code class="language-plaintext">{{SNIPPET:defensive-programming-principles/invalid-states-pseudocode.txt}}
</code></pre>

    <p>
        This pseudocode demonstrates the fundamental shift from runtime validation to compile-time safety. 
        When invalid states are unrepresentable in the type system, entire categories of bugs become impossible. 
        Business logic becomes simpler because it doesn't need defensive validation, since the types guarantee
        data integrity on their own.
    </p>
    
    <h3>PHP 8.4: Type-Safe Domain Modelling</h3>
    <p>
        Here's how weak typing creates problems in traditional object-oriented PHP code:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:defensive-programming-principles/invalid-states-bad.php}}
</code></pre>

    <p>
        This code has multiple problems. The status field accepts any string, passwords might not be hashed, 
        and the business logic must handle all possible invalid combinations. Every method that uses a User 
        object must include defensive checks for malformed data.
    </p>
    
    <p>
        PHP 8.4's enums, readonly classes, property hooks, and asymmetric visibility enable safer domain modelling:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:defensive-programming-principles/invalid-states-good.php}}
</code></pre>

    <p>
        Now invalid states are literally impossible to construct. The enum restricts status values, constructor 
        validation ensures data integrity, and readonly properties prevent mutation. The match expression ensures 
        exhaustive handling of all cases, which eliminates an entire category of bugs at compile time.
    </p>
    
    <h3>PHP 8.4 Property Hooks for Defensive Programming</h3>
    <p>
        <a href="https://www.php.net/manual/en/language.oop5.property-hooks.php">Property hooks</a>, 
        introduced in PHP 8.4, change how we implement defensive validation by moving it directly
        into the type system:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:defensive-programming-principles/property-hooks-money.php}}
</code></pre>

    <p>
        Property hooks eliminate the need for separate validation methods or complex constructor logic, because
        the validation is <em>part of the property definition</em>, which makes it impossible to bypass and
        reduces the surface area for bugs.
    </p>
    
    <h3>Asymmetric Visibility for Immutable Public APIs</h3>
    <p>
        <a href="https://wiki.php.net/rfc/asymmetric-visibility-v2">Asymmetric visibility</a>, also new in 
        PHP 8.4, allows properties to be publicly readable but privately writable, creating truly immutable 
        public interfaces without sacrificing internal flexibility:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:defensive-programming-principles/asymmetric-visibility-order-line.php}}
</code></pre>

    <p>
        This pattern prevents the common mistake of accidentally mutating objects that should be immutable,
        whilst still providing a clean, readable public API. The computed properties also demonstrate how
        property hooks can create derived values without exposing internal state management complexity.
    </p>
    
    <h3>TypeScript's Nominal Typing</h3>
    <p>
        TypeScript's structural typing can be enhanced with branded types to achieve similar safety:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:defensive-programming-principles/typescript-invalid-states.ts}}
</code></pre>

    <p>
        The branded types and union types prevent invalid states whilst maintaining TypeScript's ergonomics.
        Smart constructors ensure validation happens at object creation, not scattered throughout the application.
    </p>
    
    <h3>Benefits in Practice</h3>
    <p>
        As noted in <a href="https://geeklaunch.io/blog/make-invalid-states-unrepresentable/">GeekLaunch's analysis</a>, 
        this approach provides several key benefits:
    </p>
    
    <ul>
        <li><strong>Compile-time safety</strong>: Invalid data combinations cannot be created</li>
        <li><strong>Simplified logic</strong>: Business methods don't need defensive validation</li>
        <li><strong>Self-documenting code</strong>: Types express business rules clearly</li>
        <li><strong>Refactoring confidence</strong>: Type changes force updates to all affected code</li>
    </ul>
</section>

<section>
    <h2>Domain Object Purity</h2>
    <p>
        Domain object purity is a cornerstone of <a href="https://enterprisecraftsmanship.com/posts/domain-model-purity-completeness/">Domain-Driven Design</a>. 
        It keeps business logic separate from infrastructure concerns. Pure domain objects depend only on other 
        domain objects and primitive types, never on external systems like databases, APIs, or frameworks.
    </p>
    
    <h3>Understanding Domain Purity Through Pseudocode</h3>
    <p>
        Domain purity is about architectural separation: keeping business logic isolated from infrastructure
        concerns. Here's how impure domain objects create problems and how clean boundaries solve them:
    </p>
    
    <pre><code class="language-plaintext">{{SNIPPET:defensive-programming-principles/domain-purity-pseudocode.txt}}
</code></pre>

    <p>
        This pseudocode illustrates the core principle: domain objects should contain only business logic and 
        state transitions. Infrastructure concerns like database access, external APIs, and side effects are 
        handled by application services. This separation makes code testable, maintainable, and adaptable.
    </p>
    
    <h3>PHP Example: From Impure to Pure Domain Objects</h3>
    <p>
        Many applications suffer from domain objects that are tightly coupled to infrastructure. Here's how 
        this typically looks:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:defensive-programming-principles/domain-purity-bad.php}}
</code></pre>

    <p>
        This Order class violates domain purity by depending on four external services, scattering business
        logic across database queries, payment processing, and email sending, so that testing requires mocking
        multiple services and changes to infrastructure end up affecting domain logic.
    </p>
    
    <p>
        The pure approach separates domain logic from infrastructure concerns:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:defensive-programming-principles/domain-purity-good.php}}
</code></pre>

    <p>
        The pure Order object contains only business logic and state transitions, returning domain events that
        describe what happened so that application services can handle infrastructure concerns. This
        separation, as described in <a href="https://khorikov.org/posts/2021-05-17-domain-model-purity/">Vladimir Khorikov's analysis</a>,
        makes the code easier to test, understand, and modify.
    </p>
    
    <h3>The Role of Application Services</h3>
    <p>
        Application services orchestrate domain objects and infrastructure, maintaining the clean separation:
    </p>
    
    <ul>
        <li><strong>Domain objects</strong> contain business rules and state transitions</li>
        <li><strong>Application services</strong> coordinate between domain and infrastructure</li>
        <li><strong>Event handlers</strong> manage side effects like emails and notifications</li>
        <li><strong>Repositories</strong> handle data persistence without polluting domain logic</li>
    </ul>
    
    <h3>Benefits of Domain Purity</h3>
    <p>
        As outlined in <a href="https://enterprisecraftsmanship.com/posts/domain-model-purity-completeness/">Enterprise Craftsmanship's analysis</a>, 
        pure domain models provide several advantages:
    </p>
    
    <ul>
        <li><strong>Testability</strong>: Domain logic can be tested in isolation</li>
        <li><strong>Clarity</strong>: Business rules are expressed clearly without infrastructure noise</li>
        <li><strong>Flexibility</strong>: Infrastructure can change without affecting business logic</li>
        <li><strong>Reusability</strong>: Pure domain objects work in any context</li>
    </ul>
</section>

<section>
    <h2>Cross-Language Application</h2>
    <p>
        These principles aren't language-specific. We've focused on pseudocode and PHP examples 
        to demonstrate the core concepts, but the same defensive patterns apply across different technologies. 
        Here's how to implement these principles in other environments.
    </p>
    
    <h3>Bash Scripting with Defensive Patterns</h3>
    <p>
        Even in Bash scripting, we can apply defensive programming principles by validating inputs, 
        handling errors explicitly, and keeping functions focused on single responsibilities:
    </p>
    
    <pre><code class="language-bash">{{SNIPPET:defensive-programming-principles/bash-defensive-patterns.sh}}
</code></pre>

    <p>
        Notice how even in a shell script, we validate inputs early, handle errors explicitly with proper exit
        codes, and structure functions to have single responsibilities. The YAGNI principle applies here too;
        this script does exactly what's needed without unnecessary complexity.
    </p>
    
    <h3>Complete Reference: All Principles in Pseudocode</h3>
    <p>
        For a comprehensive view of how all three principles work together conceptually across any 
        programming language:
    </p>
    
    <pre><code class="language-plaintext">{{SNIPPET:defensive-programming-principles/pseudocode-principles.txt}}
</code></pre>

    <p>
        This extended pseudocode reference demonstrates how YAGNI, invalid state prevention, and domain 
        purity work together in any language that supports appropriate abstractions. Use it as a 
        template when implementing these patterns in your preferred programming language.
    </p>
</section>

<section>
    <h2>Practical Implementation Strategies</h2>
    
    <h3>Start with YAGNI</h3>
    <p>
        When beginning a new feature, ask yourself:
    </p>
    
    <ul>
        <li>What is the <em>specific</em> requirement I'm solving?</li>
        <li>What is the simplest solution that could work?</li>
        <li>Am I building for hypothetical future needs?</li>
        <li>Will this additional complexity make the code harder to change later?</li>
    </ul>
    
    <h3>Design for Invalid State Prevention</h3>
    <p>
        Use your type system's strengths:
    </p>
    
    <ul>
        <li><strong>PHP 8.4</strong>: Use enums, readonly classes, property hooks, asymmetric visibility, and union types</li>
        <li><strong>TypeScript</strong>: Use union types, branded types, and discriminated unions</li>
        <li><strong>Any language</strong>: Create value objects with validation in constructors</li>
    </ul>
    
    <h3>Maintain Domain Boundaries</h3>
    <p>
        Keep domain objects pure by:
    </p>
    
    <ul>
        <li>Injecting dependencies as interfaces, not concrete implementations</li>
        <li>Returning domain events instead of causing side effects</li>
        <li>Using application services for orchestration</li>
        <li>Testing domain logic in complete isolation</li>
    </ul>
</section>

<section>
    <h2>Common Pitfalls and Misconceptions</h2>
    
    <h3>YAGNI Misapplications</h3>
    <p>
        YAGNI doesn't mean writing poor code. <a href="https://martinfowler.com/bliki/Yagni.html">Martin Fowler emphasises</a>
        that activities making code more modifiable aren't YAGNI violations. Refactoring, clean coding practices, 
        and good architecture are fine. The principle targets <em>features</em> built for presumptive 
        needs, not code quality improvements.
    </p>
    
    <h3>Type Safety vs. Performance</h3>
    <p>
        Some developers worry that type-safe domain modelling hurts performance. In practice, modern PHP
        8.4 and TypeScript engines optimise value object creation well enough that this is rarely a real
        concern, and PHP 8.4's property hooks move validation into the type definition itself, so it can't be
        bypassed by direct property access. The performance cost of additional objects is typically negligible
        compared to the bugs you prevent and the development speed you gain through better tooling support.
    </p>
    
    <h3>Purity vs. Completeness Trade-off</h3>
    <p>
        The <a href="https://enterprisecraftsmanship.com/posts/domain-model-purity-completeness/">DDD trilemma</a> 
        shows you can't have domain model purity, completeness, and performance all at once. In most cases, 
        choose purity over completeness. Split complex operations between pure domain logic and application 
        services. Don't pollute domain objects with infrastructure concerns.
    </p>
</section>

<section>
    <h2>Measuring Success</h2>
    <p>
        These principles should produce measurable improvements:
    </p>
    
    <h3>Code Quality Metrics</h3>
    <ul>
        <li><strong>Cyclomatic complexity</strong>: Lower complexity in business logic methods</li>
        <li><strong>Test coverage</strong>: Higher coverage achievable due to isolated, testable units</li>
        <li><strong>Bug density</strong>: Fewer runtime errors related to invalid states</li>
        <li><strong>Code churn</strong>: Less frequent changes to core domain logic</li>
    </ul>
    
    <h3>Development Velocity</h3>
    <ul>
        <li><strong>Onboarding time</strong>: New developers understand type-safe, focused code faster</li>
        <li><strong>Feature delivery</strong>: Simple solutions ship faster than over-engineered ones</li>
        <li><strong>Debugging time</strong>: Type safety prevents many debugging sessions</li>
        <li><strong>Refactoring confidence</strong>: Type systems catch breaking changes automatically</li>
    </ul>
</section>

<section>
    <h2>Integration with Modern Development Practices</h2>
    
    <h3>CI/CD and Type Safety</h3>
    <p>
        Static type checking fits naturally into continuous integration. Tools like 
        <a href="https://phpstan.org/">PHPStan</a> for PHP and <a href="https://www.typescriptlang.org/">TypeScript's compiler</a> 
        catch type-related issues before deployment. Combined with automated testing, this creates 
        multiple layers of validation.
    </p>
    
    <h3>Domain-Driven Design Alignment</h3>
    <p>
        These principles align perfectly with DDD practices:
    </p>
    
    <ul>
        <li><strong>Bounded contexts</strong> naturally enforce domain purity</li>
        <li><strong>Aggregates</strong> become easier to model with type-safe value objects</li>
        <li><strong>Domain events</strong> work well with pure domain objects</li>
        <li><strong>Ubiquitous language</strong> is expressed clearly through typed domain models</li>
    </ul>
    
    <h3>Microservices and API Design</h3>
    <p>
        In distributed systems, these principles become even more critical:
    </p>
    
    <ul>
        <li><strong>API contracts</strong> benefit from type-safe request/response models</li>
        <li><strong>Service boundaries</strong> are clearer with pure domain objects</li>
        <li><strong>Data validation</strong> happens at service boundaries, not throughout the codebase</li>
        <li><strong>Integration testing</strong> focuses on behavior rather than implementation details</li>
    </ul>
</section>

<section>
    <h2>Real-World Adoption Strategies</h2>
    
    <h3>Incremental Implementation</h3>
    <p>
        You don't need to refactor entire systems at once:
    </p>
    
    <ol>
        <li><strong>Start with new features</strong>: Apply these principles to all new code</li>
        <li><strong>Focus on pain points</strong>: Refactor areas with frequent bugs first</li>
        <li><strong>Create value objects gradually</strong>: Replace primitives with domain types over time</li>
        <li><strong>Extract pure functions</strong>: Move business logic out of service classes incrementally</li>
    </ol>
    
    <h3>Team Education and Buy-in</h3>
    <p>
        Cultural adoption is just as important as technical implementation:
    </p>
    
    <ul>
        <li>Share concrete examples of bugs these principles would have prevented</li>
        <li>Demonstrate the improved developer experience with type-safe APIs</li>
        <li>Measure and communicate improvements in code quality metrics</li>
        <li>Pair program to spread knowledge of defensive patterns</li>
    </ul>
</section>

<section>
    <h2>Conclusion: Building Antifragile Code</h2>
    <p>
        These three defensive programming principles work together to create what Nassim Taleb calls
        "antifragile" systems, ones that become stronger under stress rather than breaking: YAGNI prevents
        unnecessary complexity that would make systems brittle, type safety eliminates entire classes of
        failures, and domain purity creates clear boundaries that limit the blast radius of changes.
    </p>
    
    <p>
        The investment in learning and applying these principles pays dividends throughout a system's lifetime:
        code becomes more reliable and more enjoyable to work with, debugging sessions grow less frequent,
        feature development becomes more predictable, and system complexity stays manageable as applications
        grow.
    </p>
    
    <p>
        Start small. Apply one principle to one feature and experience the difference defensive design makes. 
        Your future self (and your teammates) will thank you for building systems that fail less often and 
        change more easily.
    </p>
</section>

<section>
    <h2>Further Reading</h2>
    <p>
        Deepen your understanding with these authoritative resources:
    </p>
    
    <ul>
        <li><a href="https://martinfowler.com/bliki/Yagni.html">Martin Fowler on YAGNI</a> - The definitive explanation of when and how to apply YAGNI</li>
        <li><a href="https://enterprisecraftsmanship.com/posts/domain-model-purity-completeness/">Domain Model Purity vs Completeness</a> - Vladimir Khorikov's analysis of the DDD trilemma</li>
        <li><a href="https://www.improving.com/thoughts/make-invalid-states-unrepresentable/">Make Invalid States Unrepresentable</a> - Comprehensive guide to type-driven development</li>
        <li><a href="https://www.php.net/manual/en/language.oop5.property-hooks.php">PHP 8.4 Property Hooks</a> - Official documentation for PHP 8.4's property hooks</li>
        <li><a href="https://wiki.php.net/rfc/asymmetric-visibility-v2">PHP 8.4 Asymmetric Visibility</a> - RFC documentation for asymmetric property visibility</li>
        <li><a href="https://www.php.net/manual/en/migration84.new-features.php">PHP 8.4 New Features</a> - Complete list of PHP 8.4 improvements for defensive programming</li>
        <li><a href="https://learn.microsoft.com/en-us/archive/msdn-magazine/2009/february/best-practice-an-introduction-to-domain-driven-design">Microsoft's Introduction to Domain-Driven Design</a> - Foundational concepts for domain purity</li>
        <li><a href="https://phpstan.org/">PHPStan</a> - Static analysis tool for PHP type safety</li>
        <li><a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html">TypeScript Narrowing</a> - Advanced type safety techniques</li>
        <li><a href="https://refactoring.guru/design-patterns">Design Patterns</a> - Structural patterns that support these principles</li>
    </ul>
</section>
    `,
  },
  // Migrating: dependency-inversion-final-classes-pragmatic-testing.ejs
  {
    id: 'dependency-inversion-final-classes-pragmatic-testing',
    title: 'Dependency Inversion, Final Classes, and Pragmatic Testing in PHP 8.4',
    description:
      "Why final classes push dependency inversion toward composition over inheritance, and how the Detroit/London testing split resolves into a simpler rule for when to reach for a mock.",
    date: '2025-08-11',
    category: CATEGORIES.php.id,
    register: 'formal',
    heroImage: {
      src: '/images/dependency-inversion-final-classes-pragmatic-testing/hero.webp',
      alt: 'A bank of three-phase knife switches on a 1930s-era industrial switchboard, each identical switch assembly mounted on its own labelled panel along a shared bus structure',
      ogImage: '/images/dependency-inversion-final-classes-pragmatic-testing/og.jpg',
      creditText: 'Image: HABS/NPS, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Detail_of_switches_on_West_wall,_plant_switch_house_-_Bureau_of_Mines_Metallurgical_Research_Laboratory,_Original_Building,_Date_Street_north_of_U.S._Highway_93,_Boulder_City,_HABS_NEV,2-BOUC,1B-18.tif',
    },
    readingTime: 18,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    content: `
<div class="intro">
            <p class="lead">PHP 8.4 brings powerful features that change how we approach dependency inversion, class design and testing strategies, and whilst SOLID principles remain timeless, the implementation details have evolved considerably with these new capabilities. The testing community, too, has largely moved beyond the old "mock everything" mentality.</p>

            <p>This guide explores three critical concepts: dependency inversion principle (DIP) with PHP 8.4's final classes, composition over inheritance patterns, and the pragmatic testing philosophy that combines Detroit School (classical) and London School (mockist) approaches. We'll examine when to use real objects versus mocks, how to use union types for flexible testing, and why the "mockist vs classical TDD" debate has evolved into a more sophisticated understanding of testing strategies.</p>
        </div>

        <section>
            <h2>Understanding Dependency Inversion in Modern PHP</h2>
            
            <p>The <a href="https://en.wikipedia.org/wiki/Dependency_inversion_principle" target="_blank" rel="noopener">Dependency Inversion Principle (DIP)</a> states that high-level modules should not depend on low-level modules. Both should depend on abstractions. In PHP 8.4, this principle takes on new dimensions with enhanced language features like <a href="https://wiki.php.net/rfc/property-hooks" target="_blank" rel="noopener">property hooks</a>, <a href="https://wiki.php.net/rfc/asymmetric-visibility" target="_blank" rel="noopener">asymmetric visibility</a>, and improved type system capabilities.</p>

            <h3>The Problem: Violating Dependency Inversion</h3>
            
            <p>Let's first examine what <em>not</em> to do. The following pseudocode demonstrates a classic violation of DIP:</p>

            <pre><code class="language-plaintext">{{SNIPPET:dependency-inversion-final-classes/pseudocode-concepts.txt}}
</code></pre>

            <p>This inheritance-heavy approach creates several problems:</p>
            
            <ul>
                <li><strong>Tight coupling</strong>: High-level OrderProcessor depends directly on low-level MySqlDatabase</li>
                <li><strong>Hard to test</strong>: Cannot isolate business logic from database concerns</li>
                <li><strong>Brittle inheritance</strong>: Changes to base class affect all subclasses</li>
                <li><strong>Limited extensibility</strong>: Adding new database types requires modifying existing code</li>
            </ul>

            <p>Here's how this anti-pattern manifests in PHP code:</p>

            <pre><code class="language-php">{{SNIPPET:dependency-inversion-final-classes/wrong-approach.php}}
</code></pre>

            <h3>The Solution: Final Classes with Dependency Inversion</h3>
            
            <p>The modern PHP 8.4 approach combines
                <a href="https://www.php.net/manual/en/language.oop5.final.php" target="_blank" rel="noopener">final classes</a>
                with <a href="https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.constructor.promotion" target="_blank" rel="noopener">dependency injection</a>
                to achieve proper inversion of control - because final classes prevent inheritance, they force developers towards composition instead, which is really dependency inversion applied at the class level.</p>

            <pre><code class="language-php">{{SNIPPET:dependency-inversion-final-classes/right-approach.php}}
</code></pre>

            <h3>Key Benefits of Final Classes with DIP</h3>
            
            <ul>
                <li><strong>Composition over inheritance</strong>: Final classes force you to inject dependencies rather than extending base classes</li>
                <li><strong>Clear contracts</strong>: Interfaces define explicit contracts between components</li>
                <li><strong>Easy testing</strong>: Dependencies can be easily swapped for testing</li>
                <li><strong>Better encapsulation</strong>: Final classes prevent unwanted extension and maintain integrity</li>
                <li><strong>Opcache-friendly</strong>: Final classes let opcache optimise calls more aggressively, since it knows a method can't be overridden</li>
            </ul>
        </section>

        <section>
            <h2>The Testing Philosophy: Detroit vs London Schools</h2>
            
            <p>The testing community has long been divided between the
                <a href="https://martinfowler.com/articles/mocksArentStubs.html#ClassicalAndMockistTesting" target="_blank" rel="noopener">Detroit School</a>
                (classical, state-based testing) and the
                <a href="https://martinfowler.com/articles/mocksArentStubs.html#ClassicalAndMockistTesting" target="_blank" rel="noopener">London School</a>
                (mockist, interaction-based testing), but modern practice has evolved toward a more pragmatic approach that combines both strategies.</p>

            <h3>Detroit School: Testing with Real Objects</h3>
            
            <p>The Detroit School, also known as the Classical approach, emphasises:</p>
            
            <ul>
                <li><strong>State-based verification</strong>: Test what the system produces, not how it produces it</li>
                <li><strong>Real object usage</strong>: Use actual implementations when they're fast and deterministic</li>
                <li><strong>Inside-out development</strong>: Build from the domain core outward</li>
                <li><strong>Refactoring safety</strong>: Tests remain stable when implementation changes</li>
            </ul>

            <h3>London School: Testing with Mocks</h3>
            
            <p>The London School, or Mockist approach, focuses on:</p>
            
            <ul>
                <li><strong>Interaction-based verification</strong>: Test how objects collaborate</li>
                <li><strong>Heavy mocking</strong>: Mock all dependencies to isolate the system under test</li>
                <li><strong>Outside-in development</strong>: Start from user interface and work toward domain</li>
                <li><strong>Design feedback</strong>: Difficult mocking indicates poor design</li>
            </ul>

            <h3>The Pragmatic Approach: When to Use Each</h3>
            
            <p>Modern testing practice recognises that both approaches have merit and should be used contextually:</p>

            <pre><code class="language-php">{{SNIPPET:dependency-inversion-final-classes/pragmatic-testing.php}}
</code></pre>

            <h3>Decision Matrix: Real Objects vs Mocks</h3>
            
            <table>
                <thead>
                    <tr>
                        <th>Use Real Objects When</th>
                        <th>Use Mocks When</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Fast to instantiate and execute</td>
                        <td>External dependencies (database, HTTP)</td>
                    </tr>
                    <tr>
                        <td>Deterministic behaviour</td>
                        <td>Non-deterministic behaviour (random, time)</td>
                    </tr>
                    <tr>
                        <td>No side effects</td>
                        <td>Testing error conditions</td>
                    </tr>
                    <tr>
                        <td>Pure functions or simple state</td>
                        <td>Interaction verification is important</td>
                    </tr>
                    <tr>
                        <td>Value objects and entities</td>
                        <td>Complex setup required</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section>
            <h2>Infrastructure as Code: Ansible and Dependency Inversion</h2>
            
            <p>Dependency inversion principles extend beyond application code to infrastructure automation. Ansible playbooks can demonstrate these concepts at the infrastructure level:</p>

            <pre><code class="language-yaml">{{SNIPPET:dependency-inversion-final-classes/ansible-infrastructure.yml}}
</code></pre>

            <h3>Infrastructure Testing Strategies</h3>
            
            <p>Just as in application testing, infrastructure code benefits from pragmatic testing approaches:</p>
            
            <ul>
                <li><strong>Use real tools</strong> for deterministic operations (file creation, package installation)</li>
                <li><strong>Mock external services</strong> when testing deployment scripts</li>
                <li><strong>Integration tests</strong> with containers or VMs for complete workflows</li>
                <li><strong>Fail-fast validation</strong> to catch configuration errors early</li>
            </ul>
        </section>

        <section>
            <h2>Bash Scripting: Dependency Injection in Shell Scripts</h2>
            
            <p>Even shell scripts can benefit from dependency inversion principles. Here's how to apply these concepts in Bash:</p>

            <pre><code class="language-bash">{{SNIPPET:dependency-inversion-final-classes/bash-deployment.sh}}
</code></pre>

            <h3>Shell Script Testing Patterns</h3>
            
            <p>Testing shell scripts requires creativity, but the same principles apply:</p>
            
            <ul>
                <li><strong>Environment variable injection</strong>: Use environment variables as dependency injection mechanism</li>
                <li><strong>Function composition</strong>: Break scripts into testable functions</li>
                <li><strong>Mock external commands</strong>: Override external commands with functions for testing</li>
                <li><strong>Real file operations</strong>: Use temporary directories for actual file system tests</li>
            </ul>
        </section>

        <section>
            <h2>PHP 8.4 Specific Features for Dependency Inversion</h2>
            
            <p>PHP 8.4 introduces several features that enhance dependency inversion implementation:</p>

            <h3><a href="https://wiki.php.net/rfc/property-hooks" target="_blank" rel="noopener">Property Hooks</a> for Lazy Initialisation</h3>
            
            <pre><code class="language-php">{{SNIPPET:dependency-inversion-final-classes/property-hooks-lazy-storage.php}}
</code></pre>

            <h3><a href="https://wiki.php.net/rfc/asymmetric-visibility" target="_blank" rel="noopener">Asymmetric Visibility</a> for Immutable Dependencies</h3>
            
            <pre><code class="language-php">{{SNIPPET:dependency-inversion-final-classes/asymmetric-visibility-secure-processor.php}}
</code></pre>

            <h3><a href="https://wiki.php.net/rfc/lazy_objects" target="_blank" rel="noopener">Lazy Objects</a> for Performance</h3>
            
            <p>PHP 8.4's <a href="https://wiki.php.net/rfc/lazy_objects" target="_blank" rel="noopener">lazy objects</a> feature allows sophisticated dependency injection patterns:</p>
            
            <pre><code class="language-php">{{SNIPPET:dependency-inversion-final-classes/lazy-objects-database.php}}
</code></pre>
        </section>

        <section>
            <h2>Performance Considerations</h2>
            
            <p>Dependency inversion and testing strategies have performance implications you should consider:</p>

            <h3>Runtime Performance</h3>
            
            <ul>
                <li><strong>Final classes</strong>: Opcache can optimise calls more aggressively when a method can't be overridden</li>
                <li><strong>Interface calls</strong>: Minimal overhead in modern PHP versions</li>
                <li><strong>Lazy loading</strong>: Defer expensive object creation until needed</li>
                <li><strong>Container caching</strong>: Cache dependency injection container configuration</li>
            </ul>

            <h3>Testing Performance</h3>
            
            <ul>
                <li><strong>Real objects</strong>: Often faster than mocks for simple operations</li>
                <li><strong>In-memory implementations</strong>: Provide realistic testing without I/O overhead</li>
                <li><strong>Mock setup overhead</strong>: Consider the cost of mock configuration</li>
                <li><strong>Parallel testing</strong>: Real objects enable better test parallelisation</li>
            </ul>
        </section>

        <section>
            <h2>Common Pitfalls and Solutions</h2>

            <h3>Over-Engineering with Interfaces</h3>
            
            <p><strong>Problem</strong>: Creating interfaces for every class, even simple value objects.</p>
            <p><strong>Solution</strong>: Only create interfaces when you need polymorphism or dependency inversion. Simple data classes don't need interfaces.</p>

            <h3>Mock-Heavy Tests</h3>
            
            <p><strong>Problem</strong>: Mocking everything leads to brittle tests that break on refactoring.</p>
            <p><strong>Solution</strong>: Use the pragmatic approach: mock external dependencies, use real objects for internal logic.</p>

            <h3>Inheritance Instead of Composition</h3>
            
            <p><strong>Problem</strong>: Using abstract base classes instead of dependency injection.</p>
            <p><strong>Solution</strong>: Favour final classes with injected dependencies over inheritance hierarchies.</p>

            <h3>Configuration Explosion</h3>
            
            <p><strong>Problem</strong>: Too many configuration options make the system hard to understand.</p>
            <p><strong>Solution</strong>: Provide sensible defaults and environment-based configurations.</p>
        </section>

        <section>
            <h2>Best Practices and Guidelines</h2>

            <h3>Design Guidelines</h3>
            
            <ol>
                <li><strong>Prefer final classes</strong>: Use final classes with dependency injection over inheritance</li>
                <li><strong>Design by contract</strong>: Create explicit interfaces for dependencies</li>
                <li><strong>Single responsibility</strong>: Each class should have one reason to change</li>
                <li><strong>Immutable dependencies</strong>: Don't allow dependencies to change after construction</li>
                <li><strong>Environment-based configuration</strong>: Use environment variables for different implementations</li>
            </ol>

            <h3>Testing Guidelines</h3>
            
            <ol>
                <li><strong>Start with real objects</strong>: Use real implementations unless there's a compelling reason to mock</li>
                <li><strong>Mock external boundaries</strong>: Always mock databases, HTTP services, file systems</li>
                <li><strong>Test behavior, not implementation</strong>: Focus on what the code does, not how</li>
                <li><strong>Use hybrid approaches</strong>: Combine real and mock objects in the same test</li>
                <li><strong>Maintain test speed</strong>: Fast tests encourage frequent execution</li>
            </ol>

            <h3>PHP 8.4 Specific Guidelines</h3>
            
            <ol>
                <li><strong>Use property hooks</strong>: For lazy initialisation and validation</li>
                <li><strong>Use asymmetric visibility</strong>: Prevent unwanted modifications whilst maintaining transparency</li>
                <li><strong>Adopt lazy objects</strong>: For expensive dependencies that may not be used</li>
                <li><strong>Final by default</strong>: Make classes final unless extension is explicitly needed</li>
                <li><strong>Type everything</strong>: Use PHP 8.4's enhanced type system for better static analysis</li>
            </ol>
        </section>

        <section>
            <h2>Tools and Resources</h2>

            <h3>Essential PHP Tools</h3>
            
            <ul>
                <li><strong><a href="https://phpunit.de/" target="_blank" rel="noopener">PHPUnit 10+</a></strong>: Modern testing framework with improved mocking capabilities</li>
                <li><strong><a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a></strong>: Static analysis for catching dependency injection issues</li>
                <li><strong><a href="https://php-di.org/" target="_blank" rel="noopener">PHP-DI</a></strong>: Mature dependency injection container</li>
                <li><strong><a href="https://symfony.com/doc/current/service_container.html" target="_blank" rel="noopener">Symfony DI</a></strong>: Powerful dependency injection component</li>
                <li><strong><a href="https://psalm.dev/" target="_blank" rel="noopener">Psalm</a></strong>: Advanced static analysis with template support</li>
            </ul>

            <h3>Testing Resources</h3>
            
            <ul>
                <li><strong><a href="https://martinfowler.com/articles/mocksArentStubs.html" target="_blank" rel="noopener">Mocks Aren't Stubs</a></strong>: Martin Fowler's classic article on testing approaches</li>
                <li><strong><a href="https://www.growing-object-oriented-software.com/" target="_blank" rel="noopener">Growing Object-Oriented Software, Guided by Tests</a></strong>: The definitive book on London School TDD</li>
                <li><strong><a href="https://blog.cleancoder.com/uncle-bob/2014/05/14/TheLittleMocker.html" target="_blank" rel="noopener">The Little Mocker</a></strong>: Uncle Bob's perspective on when to mock</li>
                <li><strong><a href="https://phptherightway.com/#testing" target="_blank" rel="noopener">PHP: The Right Way - Testing</a></strong>: Community guidelines for PHP testing</li>
            </ul>

            <h3>PHP 8.4 Documentation</h3>
            
            <ul>
                <li><strong><a href="https://www.php.net/releases/8.4/en.php" target="_blank" rel="noopener">PHP 8.4 Release Notes</a></strong>: Official feature documentation</li>
                <li><strong><a href="https://php.watch/versions/8.4" target="_blank" rel="noopener">PHP.Watch 8.4</a></strong>: Comprehensive guide to new features</li>
                <li><strong><a href="https://stitcher.io/blog/new-in-php-84" target="_blank" rel="noopener">What's New in PHP 8.4</a></strong>: Developer-focused feature overview</li>
            </ul>
        </section>

        <section>
            <h2>Conclusion</h2>
            
            <p>The combination of PHP 8.4's modern features, dependency inversion principles, and pragmatic testing approaches creates a powerful foundation for building maintainable, testable applications. Here are the key insights:</p>

            <ol>
                <li><strong>Final classes encourage composition</strong>: By preventing inheritance, final classes naturally lead to better dependency inversion patterns</li>
                <li><strong>Testing is contextual</strong>: The Detroit vs London school debate misses the point. Use the right approach for each situation</li>
                <li><strong>Real objects are undervalued</strong>: Many dependencies can and should be tested with real implementations for better confidence</li>
                <li><strong>Modern PHP enables elegant patterns</strong>: PHP 8.4's features make dependency inversion more natural and performant</li>
                <li><strong>Pragmatism over purity</strong>: Combine approaches based on practical concerns instead of ideological adherence</li>
            </ol>

        </section>
    `,
  },
  // Migrating: dynamic-gradient-headings.ejs
  {
    id: 'dynamic-gradient-headings',
    title: 'Dynamic Gradient Headings: A CSS and JavaScript Implementation',
    description:
      'How a single CSS custom property and a throttled mousemove listener are enough to make heading gradients track the cursor, with no per-element recalculation.',
    date: '2025-07-21',
    category: CATEGORIES.typescript.id,
    readingTime: 6,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'webdev',
    heroImage: {
      src: '/images/dynamic-gradient-headings/hero.webp',
      alt: 'A hazy orange-red sunset gradating from pale gold through orange to deep red over a mountain ridge',
      ogImage: '/images/dynamic-gradient-headings/og.jpg',
      creditText: 'Image: Gene Daniels/EPA, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:SUNSET_SEEN_THROUGH_SMOG_-_NARA_-_542680.jpg',
    },
    content: `
<div class="intro">
    <p class="lead">
        Text gradients that respond to mouse movement can add a subtle interactive element to web interfaces. 
        This implementation uses CSS custom properties and vanilla JavaScript to create headings that adjust 
        their gradient direction based on cursor position.
    </p>
</div>

<section>
    <h2>The Basic Approach</h2>
    <p>
        The technique relies on a CSS custom property to control gradient direction, updated via JavaScript 
        as the mouse moves. Rather than recalculating styles for each heading individually, we modify a 
        single CSS variable that all gradients reference.
    </p>
</section>

<section>
    <h2>CSS Foundation</h2>
    <p>
        First, establish the gradient system with a custom property for the angle:
    </p>
    
    <pre><code class="language-css">{{SNIPPET:dynamic-gradient-headings/css-foundation.css}}
</code></pre>

    <p>
        The initial 135-degree angle provides a pleasant diagonal gradient, and all headings inherit
        this direction through the custom property so they stay consistent.
    </p>
</section>

<section>
    <h2>JavaScript Implementation</h2>
    <p>
        The mouse tracking calculates angles relative to the viewport centre:
    </p>

    <pre><code class="language-javascript">{{SNIPPET:dynamic-gradient-headings/gradient-tracker.js}}
</code></pre>
</section>

<section>
    <h2>Performance Considerations</h2>
    <p>
        Mouse events fire frequently, so throttling prevents unnecessary repaints. The 16ms throttle 
        (roughly 60fps) provides smooth updates without overwhelming the browser.
    </p>
    
    <p>
        Using a single CSS custom property means the browser only needs to update one value, rather 
        than recalculating styles for multiple elements.
    </p>
</section>

<section>
    <h2>Mathematical Details</h2>
    <p>
        The angle calculation uses <code>Math.atan2()</code> to determine the direction from viewport 
        centre to cursor position. Adding 135 degrees provides a sensible baseline - without this offset, 
        a cursor at the top-left would create a 225-degree angle, which feels backwards.
    </p>
    
    <p>
        The result is converted from radians to degrees since CSS gradients expect degree values.
    </p>
</section>

<section>
    <h2>Browser Compatibility</h2>
    <p>
        The vendor-prefixed <code>-webkit-background-clip</code> is only needed for Safari versions older
        than 15.5; recent Safari, Firefox 49+, and Chrome/Edge 120+ all support the unprefixed
        <code>background-clip: text</code>. The implementation degrades gracefully regardless - older
        browsers simply show regular text colour rather than gradients.
    </p>
    
    <p>
        CSS custom properties have excellent support in modern browsers. For legacy support, you could 
        provide fallback colours, though the dynamic behaviour would be lost.
    </p>
</section>

<section>
    <h2>Practical Applications</h2>
    <p>
        This technique works well for:
    </p>
    
    <ul>
        <li>Portfolio sites where subtle interactivity enhances the experience</li>
        <li>Landing pages that benefit from engaging visual elements</li>
        <li>Brand sites where the gradient colours align with visual identity</li>
    </ul>
    
    <p>
        It's less suitable for content-heavy sites where the movement might distract from reading, 
        or accessibility-critical applications where motion effects could cause issues for some users.
    </p>
</section>

<section>
    <h2>Implementation Notes</h2>
    <p>
        The mouse leave handler resets the angle to prevent gradients from "sticking" at odd angles 
        when users navigate away with keyboard shortcuts or other non-mouse methods.
    </p>
    
    <p>
        For sites with many headings, this approach scales well since it avoids per-element calculations. 
        The performance characteristics remain consistent regardless of heading count.
    </p>
</section>
    `,
  },
  // Migrating: early-return-patterns-cleaner-code.ejs
  {
    id: 'early-return-patterns-cleaner-code',
    title: "Early Return Patterns: Your Code's Best Exit Strategy",
    description:
      'Master guard clauses and early return patterns across PHP, TypeScript, Bash, and Ansible to write cleaner, more maintainable code with reduced cognitive complexity',
    date: '2025-07-31',
    category: CATEGORIES.php.id,
    heroImage: {
      src: '/images/early-return-patterns-cleaner-code/hero.webp',
      alt: 'Zigzagging cast-iron fire escapes descending several adjoining building facades in SoHo, New York, each one a direct exit route bypassing the interior',
      ogImage: '/images/early-return-patterns-cleaner-code/og.jpg',
      creditText:
        'Image: Carol M. Highsmith, Library of Congress, no known copyright restrictions, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Fire_escapes_on_apartment_buildings_in_Soho,_New_York,_New_York_LCCN2011630656.tif',
    },
    readingTime: 9,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'programming',
    content: `
<div class="intro">
    <p class="lead">
        Think of early return patterns as your code's bouncer. They check credentials at the door and politely
        escort troublemakers out before they can cause chaos inside. By handling exceptional cases upfront with 
        guard clauses, your main business logic flows clean and uninterrupted, like a VIP section free from drama.
    </p>
</div>

<section>
    <h2>The Problem with Nested Nightmares</h2>
    <p>
        We've all written that function. You know the one that starts with a simple <code>if</code> 
        statement and ends up looking like a Russian nesting doll had a collision with a decision tree. Each nested 
        condition pushes your actual business logic deeper into an indentation abyss. Your code becomes harder to 
        read, debug, and maintain.
    </p>
    
    <p>
        Early return patterns flip this approach on its head. They're also called guard clauses or the "bouncer pattern." 
        You validate prerequisites upfront and bail out early when conditions aren't met. Your main logic flows naturally at the function's base level.
    </p>
</section>

<section>
    <h2>The Pattern in Pseudocode</h2>
    <p>
        Let's see the fundamental transformation that early returns provide:
    </p>
    
    <pre><code class="language-python">{{SNIPPET:early-return-patterns/pseudocode-examples.py}}
</code></pre>
    
    <p>
        The "after" version reads like a checklist. Each guard clause answers a simple yes/no question. 
        Failures exit immediately. The actual work happens only after all prerequisites pass. This creates a clear 
        separation between validation and execution.
    </p>
</section>

<section>
    <h2>Bash: From Nested Hell to Guard Heaven</h2>
    <p>
        Shell scripts are particularly prone to nested condition disasters, especially deployment scripts that need 
        to validate numerous prerequisites. Let's transform a typical deployment function:
    </p>
    
    <h3>Before: The Nesting Nightmare</h3>
    <pre><code class="language-bash">{{SNIPPET:early-return-patterns/bash-before.sh}}
</code></pre>
    
    <h3>After: Guard Clauses to the Rescue</h3>
    <pre><code class="language-bash">{{SNIPPET:early-return-patterns/bash-after.sh}}
</code></pre>
    
    <p>
        The transformed version embraces modern Bash practices for 2025. It uses strict mode with <code>set -euo pipefail</code>, 
        proper error handling with stderr redirection, and guard clauses that fail fast. Each validation is isolated 
        and explicit. Debugging becomes much easier when something goes wrong.
    </p>
    
    <p>
        <strong>Pro tip:</strong> Notice how we redirect error messages to stderr using <code>&gt;&amp;2</code>. 
        This ensures error output doesn't interfere with function return values that might be captured by calling code.
    </p>
</section>

<section>
    <h2>Ansible: Orchestrating Clean Infrastructure Code</h2>
    <p>
        Ansible playbooks quickly become unwieldy when handling multiple validation conditions. The guard 
        pattern transforms complex nested tasks into clean, sequential validation steps.
    </p>
    
    <h3>Before: Monolithic Task with Nested Shell Logic</h3>
    <pre><code class="language-yaml">{{SNIPPET:early-return-patterns/ansible-before.yml}}
</code></pre>
    
    <h3>After: Guard Pattern with Fail-Fast Strategy</h3>
    <pre><code class="language-yaml">{{SNIPPET:early-return-patterns/ansible-after.yml}}
</code></pre>
    
    <p>
        The modernised version separates concerns cleanly. Each guard clause is a dedicated task with a specific
        validation purpose. The <code>any_errors_fatal: true</code> directive implements fail-fast behaviour across
        all hosts. Individual tasks use <code>failed_when</code> conditions to define explicit failure criteria.
    </p>

    <p>
        This approach uses <a href="https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_error_handling.html" target="_blank" rel="noopener">Ansible's error handling features</a>
        to create maintainable infrastructure-as-code that's easy to debug and extend.
    </p>
</section>

<section>
    <h2>PHP: Modern Guard Clauses</h2>
    <p>
        PHP's evolution toward more explicit, typed code makes guard clauses even more powerful. Here's a refactored
        order processing method using modern PHP practices:
    </p>
    
    <h3>Before: The Pyramid of Doom</h3>
    <pre><code class="language-php">{{SNIPPET:early-return-patterns/php-before.php}}
</code></pre>
    
    <h3>After: Clean Guard Implementation</h3>
    <pre><code class="language-php">{{SNIPPET:early-return-patterns/php-after.php}}
</code></pre>
    
    <p>
        The refactored version demonstrates nullable parameter types, named constructor arguments, and explicit null
        checking, each guard clause handling one specific validation concern. This makes the code self-documenting
        and testable.
    </p>

    <p>
        Following the <a href="https://www.php-fig.org/psr/psr-12/" target="_blank" rel="noopener">PSR-12 coding standard</a>,
        we maintain consistent formatting and use PHP's strong typing system to catch errors at the language level
        rather than runtime.
    </p>
</section>

<section>
    <h2>TypeScript: Modern Guard Clause Patterns</h2>
    <p>
        TypeScript keeps evolving to provide better tools for writing defensive code. Here's how a couple of
        ES2020 features enhance the guard clause pattern:
    </p>
    
    <h3>Before: Nested Conditional Chaos</h3>
    <pre><code class="language-javascript">{{SNIPPET:early-return-patterns/typescript-before.ts}}
</code></pre>
    
    <h3>After: Modern TypeScript Guard Pattern</h3>
    <pre><code class="language-javascript">{{SNIPPET:early-return-patterns/typescript-after.ts}}
</code></pre>
    
    <p>
        The modern implementation uses <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining" target="_blank" rel="noopener">optional chaining</a>
        (<code>?.</code>), introduced in ES2020, to guard the incoming ID without a separate null check. It reduces
        boilerplate whilst maintaining type safety.
    </p>
    
    <p>
        The explicit return type annotation and consistent error object structure make this code more maintainable 
        and provide better IDE support for refactoring and debugging.
    </p>
</section>

<section>
    <h2>The Cyclomatic Complexity Reality Check</h2>
    <p>
        Early returns don't actually reduce cyclomatic complexity - they change how that complexity is expressed
        and experienced by developers. Let's examine this with a concrete example:
    </p>
    
    <pre><code class="language-javascript">{{SNIPPET:early-return-patterns/complexity-example.ts}}
</code></pre>
    
    <p>
        Both functions have identical cyclomatic complexity (7), but the cognitive load differs dramatically - the
        nested version requires mental stack management, forcing you to track multiple open conditions
        simultaneously, whilst the early return version processes linearly, like reading a checklist.
    </p>
    
    <p>
        <a href="https://linearb.io/blog/cyclomatic-complexity" target="_blank" rel="noopener">LinearB's analysis</a> argues
        cognitive complexity matters more than raw cyclomatic complexity. Tools like <a href="https://www.sonarqube.org/" target="_blank" rel="noopener">SonarQube</a>
        now track both metrics, recognising that readable code leads to fewer bugs and faster development cycles.
    </p>
</section>

<section>
    <h2>The KISS Principle: Your Code's Exit Strategy</h2>
    <p>
        Early return patterns embody the KISS principle (Keep It Simple, Stupid) by creating clear exit strategies 
        for your functions. Just like a good emergency evacuation plan identifies exits before disasters strike, 
        guard clauses identify failure conditions before they can complicate your main logic.
    </p>
    
    <h3>Benefits of the Guard Clause Pattern:</h3>
    <ul>
        <li><strong>Reduced Mental Load:</strong> Linear validation flow versus nested condition tracking</li>
        <li><strong>Easier Debugging:</strong> Clear failure points with specific error messages</li>
        <li><strong>Improved Testability:</strong> Each guard clause is a discrete test case</li>
        <li><strong>Enhanced Readability:</strong> Main business logic flows uninterrupted at the bottom</li>
        <li><strong>Simplified Maintenance:</strong> Adding new validations doesn't increase nesting depth</li>
    </ul>
</section>

<section>
    <h2>Real-World Implementation Scenarios</h2>
    <p>
        Early return patterns shine brightest in these common development scenarios:
    </p>
    
    <h3>API Endpoint Validation</h3>
    <p>
        REST API endpoints need to validate authentication, authorization, input formatting, rate limits, 
        and resource availability before processing requests. Guard clauses create self-documenting validation 
        pipelines that map directly to HTTP status codes.
    </p>
    
    <h3>Database Transaction Management</h3>
    <p>
        Complex database operations benefit from upfront validation. Check connection status, transaction isolation 
        levels, constraint satisfaction, and data integrity before committing changes. Early returns prevent 
        partial updates that could corrupt data consistency.
    </p>
    
    <h3>File Processing Pipelines</h3>
    <p>
        File operations require validation of file existence, permissions, format compatibility, and available 
        disk space. Guard clauses prevent resource waste by catching issues before expensive processing begins.
    </p>
    
    <h3>Configuration Management</h3>
    <p>
        Applications with complex configuration dependencies benefit from guard clauses. Validate 
        environment variables, configuration file formats, network connectivity, and service availability before 
        startup proceeds.
    </p>
</section>

<section>
    <h2>Best Practices for Implementation</h2>
    <h3>Keep Functions Small</h3>
    <p>
        As a rule of thumb, early returns work best in functions under 30 lines, as discussed in
        <a href="https://medium.com/@billocsic/early-return-and-cyclomatic-complexity-dc61453607e8" target="_blank" rel="noopener">Bill Ocsic's piece on early return and cyclomatic complexity</a>.
        In larger functions, multiple return statements become harder to track, which may indicate the function
        needs refactoring into smaller, focused units.
    </p>
    
    <h3>Use Descriptive Error Messages</h3>
    <p>
        Each guard clause should provide actionable feedback about what went wrong and how to fix it. Generic 
        error messages like "Invalid input" waste debugging time and frustrate both developers and users.
    </p>
    
    <h3>Maintain Consistent Error Handling</h3>
    <p>
        Establish consistent patterns for error responses across your codebase. Whether using exceptions, result 
        objects, or HTTP responses, consistency reduces cognitive overhead and improves maintainability.
    </p>
    
    <h3>Consider the Happy Path</h3>
    <p>
        Design guard clauses to handle edge cases and exceptional conditions, leaving the main function body 
        focused on the primary use case: the "happy path" where everything works as expected.
    </p>
</section>

<section>
    <h2>Conclusion: Cleaner Exits for Cleaner Code</h2>
    <p>
        Early return patterns do more than reduce nesting. Used well, guard clauses become your code's exit
        strategy, transforming complex conditional logic into functions that communicate intent clearly, fail
        gracefully, and stay readable, maintainable, and debuggable.
    </p>

    <p>
        Remember that good code does more than simply work: it reads well and makes the next developer's job
        easier too, and early return patterns help with all three, leaving you with more reliable functions and
        shorter debugging sessions.
    </p>
    
    <p>
        Whether you're writing PHP APIs, TypeScript applications, Bash deployment scripts, or Ansible playbooks, 
        the guard clause pattern provides a universal approach to cleaner, more maintainable code. Your future 
        self, and your teammates, will thank you for choosing the early exit strategy.
    </p>
</section>
    `,
  },
  // Migrating: fail-fast-programming-philosophy.ejs
  {
    id: 'fail-fast-programming-philosophy',
    title: 'Fail Fast Programming: Why Your Code Should Crash Spectacularly',
    description:
      'A practical look at fail-fast programming in PHP, TypeScript, Bash, and Ansible - writing high-trust code that fails early, clearly, and at the exact point of deviation from expectations.',
    date: '2025-08-04',
    category: CATEGORIES.php.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'programming',
    heroImage: {
      src: '/images/fail-fast-programming-philosophy/hero.webp',
      alt: 'A black-and-white photograph of a dam with a relief valve open, water bursting out under pressure, flanked by dense conifer forest',
      ogImage: '/images/fail-fast-programming-philosophy/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:ROSS_DAM_WITH_A_RELIEF_VALVE_AT_ELEVATION_1340_OPEN,_1989._-_Skagit_Power_Development,_Ross_Dam,_11.0_miles_upstream_from_Newhalem_on_Skagit_River,_Newhalem,_Whatcom_County,_HAER_WASH,37-NEHA.V,1-H-3.tif',
    },
    content: `
<div class="intro">
    <p class="lead">
        In the world of programming, there are two philosophies: "fingers crossed" programming where you hope
        everything works and hide errors behind null coalescing and try-catch blocks, and "fail fast" programming
        where you validate aggressively and crash spectacularly at the exact moment something goes wrong. 
        One leads to 3 AM debugging sessions hunting mysterious bugs; the other leads to clear error messages 
        and quick fixes. Guess which one your future self will thank you for?
    </p>
</div>

<section>
    <h2>The Two Programming Philosophies</h2>
    <p>
        Every programmer falls into one of two camps when it comes to error handling. The first group practices 
        "defensive programming." They wrap everything in try-catch blocks, use null coalescing operators
        liberally, and design their code to limp forward no matter what goes wrong. They think they're being
        helpful by preventing crashes.
    </p>
    
    <p>
        The second group embraces "fail-fast programming." They validate inputs aggressively, throw exceptions 
        at the first sign of trouble, and design their code to crash immediately when assumptions are violated. 
        They understand that a loud failure is infinitely better than a silent corruption.
    </p>
    
    <p>
        The difference isn't just philosophical - it's practical, and <a href="https://martinfowler.com/ieeeSoftware/failFast.pdf" target="_blank" rel="noopener">Martin Fowler's research on fail-fast systems</a>
        shows that applications designed to fail early and clearly spend significantly less time in
        debugging phases and have fewer production incidents.
    </p>
</section>

<section>
    <h2>Understanding the Fail-Fast Mindset</h2>
    <p>
        Fail-fast programming is about creating systems with <strong>clear failure boundaries</strong>, rather
        than giving up easily: when your code encounters invalid data, missing dependencies, or violated
        assumptions, it should stop immediately and provide detailed information about what went wrong and where.
    </p>
    
    <p>
        This philosophy aligns perfectly with modern development practices where automated testing catches 
        failures during development rather than in production. As the <a href="https://enterprisecraftsmanship.com/posts/fail-fast-principle/" target="_blank" rel="noopener">Enterprise Craftsmanship guide</a> 
        explains, fail-fast code creates a high-trust environment where "if it's broken, the tests will catch it."
    </p>
    
    <h3>Key Principles of Fail-Fast Programming:</h3>
    <ul>
        <li><strong>Validate Early:</strong> Check assumptions and inputs at the earliest possible moment</li>
        <li><strong>Fail Clearly:</strong> Provide specific, actionable error messages with full context</li>
        <li><strong>Fail Completely:</strong> Don't partially process invalid data or continue in undefined states</li>
        <li><strong>Fail Loud:</strong> Make failures impossible to ignore through proper logging and propagation</li>
    </ul>
</section>

<section>
    <h2>The Pseudocode Comparison</h2>
    <p>
        Before diving into language-specific implementations, let's examine the fundamental difference between 
        defensive and fail-fast approaches:
    </p>
    
    <pre><code class="language-python">{{SNIPPET:fail-fast-programming/pseudocode-defensive-vs-failfast.py}}
</code></pre>
    
    <p>
        Notice how the defensive approach hides problems behind fallback values and vague error messages, whilst
        the fail-fast approach validates everything upfront and provides specific error details. The defensive
        version might return a result even when fundamental prerequisites are missing, which leads to mysterious
        failures downstream.
    </p>
</section>

<section>
    <h2>PHP: Embracing Strict Types and Clear Failures</h2>
    <p>
        PHP's evolution toward stricter typing and better error handling makes it an excellent language for 
        fail-fast programming. Let's examine how modern PHP practices can eliminate error hiding:
    </p>
    
    <h3>Anti-Pattern: Error Hiding and Silent Failures</h3>
    <pre><code class="language-php">{{SNIPPET:fail-fast-programming/php-anti-patterns.php}}
</code></pre>
    
    <h3>Fail-Fast Implementation</h3>
    <pre><code class="language-php">{{SNIPPET:fail-fast-programming/php-fail-fast.php}}
</code></pre>
    
    <p>
        The fail-fast version uses <a href="https://www.php.net/manual/en/language.types.declarations.php#language.types.declarations.strict" target="_blank" rel="noopener">PHP's strict type declarations</a>
        and creates specific exception classes for different failure scenarios. <a href="https://roman-huliak.medium.com/php-error-handling-and-exceptions-best-practices-for-robust-applications-c02cf5e225f7" target="_blank" rel="noopener">Modern PHP error handling best practices</a> 
        show this approach significantly reduces debugging time and prevents data corruption.
    </p>
    
    <p>
        Each guard clause validates one specific concern and provides actionable error messages. The 
        business logic only executes when all prerequisites are guaranteed to be valid. This eliminates the 
        possibility of processing corrupted or incomplete data.
    </p>
</section>

<section>
    <h2>TypeScript: Type Guards and Runtime Validation</h2>
    <p>
        TypeScript's type system provides compile-time safety. But fail-fast programming requires runtime 
        validation too. Type guards bridge this gap by validating data structure and narrowing types simultaneously:
    </p>
    
    <pre><code class="language-javascript">{{SNIPPET:fail-fast-programming/typescript-type-guards.ts}}
</code></pre>
    
    <p>
        As AI coding assistants generate more of the code that ends up in production,
        <a href="https://dev.to/paulthedev/type-guards-in-typescript-2025-next-level-type-safety-for-ai-era-developers-6me" target="_blank" rel="noopener">a growing body of TypeScript advice</a>
        treats this as a critical challenge - type guards act as essential safeguards against hallucinated code
        that bypasses type checks.
    </p>
    
    <p>
        The key insight is using <strong>assertion functions</strong> and <strong>type predicates</strong> 
        to create runtime validation that TypeScript's compiler can understand. This creates a fail-fast system 
        where both compile-time and runtime errors are caught immediately with clear context.
    </p>
    
    <h3>Integration with Modern Validation Libraries</h3>
    <p>
        For production applications, consider pairing type guards with <a href="https://zod.dev/" target="_blank" rel="noopener">Zod 4.0</a>
        for thorough runtime validation. This combination provides both TypeScript inference and detailed
        validation error messages, creating the ideal fail-fast environment.
    </p>
</section>

<section>
    <h2>Bash: Fail-Fast Scripting for Infrastructure</h2>
    <p>
        Shell scripts are notorious for silent failures and undefined behaviour. Fail-fast bash scripting
        transforms unreliable deployment scripts into dependable automation:
    </p>
    
    <pre><code class="language-bash">{{SNIPPET:fail-fast-programming/bash-fail-fast.sh}}
</code></pre>
    
    <p>
        The fail-fast bash implementation uses <code>set -euo pipefail</code> for strict error handling and
        implements guard clauses covering every prerequisite. This follows <a href="https://www.gnu.org/software/bash/manual/html_node/The-Set-Builtin.html" target="_blank" rel="noopener">GNU Bash manual recommendations</a>
        for robust script design.
    </p>
    
    <p>
        Critical elements include parameter validation, system prerequisite checks, disk space verification, 
        and network connectivity testing before attempting any operations. Each failure provides specific 
        diagnostic information for rapid troubleshooting.
    </p>
</section>

<section>
    <h2>Ansible: Infrastructure as Code with Fail-Fast Patterns</h2>
    <p>
        Ansible playbooks benefit enormously from fail-fast design, especially in production deployments where 
        partial failures can cause serious service disruptions:
    </p>
    
    <pre><code class="language-yaml">{{SNIPPET:fail-fast-programming/ansible-fail-fast.yml}}
</code></pre>
    
    <p>
        The fail-fast Ansible approach uses <code>any_errors_fatal: true</code> and thorough <code>assert</code>
        modules to validate all prerequisites before proceeding. This follows <a href="https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_error_handling.html" target="_blank" rel="noopener">Ansible's error handling best practices</a>
        for production deployments.
    </p>
    
    <p>
        Key elements include variable validation, system prerequisite checks, disk space verification, and 
        package availability testing. The playbook only proceeds with actual deployment after all validations 
        pass. This prevents partial deployments that could leave systems in inconsistent states.
    </p>
</section>

<section>
    <h2>Error Propagation Strategies</h2>
    <p>
        Effective fail-fast programming requires proper error propagation. Exceptions and failures must bubble
        up through your application layers with sufficient context for debugging. Here's the propagation logic
        from <code>FailFastOrderProcessor::getUserOrFail()</code> shown earlier, isolated:
    </p>

    <pre><code class="language-php">{{SNIPPET:fail-fast-programming/php-error-propagation.php}}
</code></pre>
    
    <p>
        The key principle is to <strong>only catch exceptions when you can add meaningful context or handle them 
        appropriately</strong>. Most exceptions should propagate up to application boundaries. There they can be 
        converted to appropriate user-facing errors or logged for debugging.
    </p>
    
    <p>
        <a href="https://netgen.io/blog/modern-error-handling-in-php" target="_blank" rel="noopener">Modern PHP error handling guides</a> 
        call this "exception transparency." Errors are visible throughout your application stack with full context 
        and stack traces preserved.
    </p>
</section>

<section>
    <h2>The Testing Connection</h2>
    <p>
        Fail-fast programming and comprehensive testing are symbiotic. When your code fails fast with clear 
        error messages, writing tests becomes straightforward. Each guard clause represents a specific test case:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:fail-fast-programming/php-guard-clause-tests.php}}
</code></pre>
    
    <p>
        This creates a virtuous cycle. Fail-fast code is easier to test, thorough tests catch failures
        early, and early failures make debugging faster. The result is higher confidence in production deployments.
    </p>
</section>

<section>
    <h2>Performance and Reliability Benefits</h2>
    <p>
        Contrary to intuition, fail-fast programming often improves performance. By validating inputs early 
        and avoiding expensive operations on invalid data, you prevent resource waste:
    </p>
    
    <ul>
        <li><strong>Reduced CPU Usage:</strong> Stop processing invalid requests immediately</li>
        <li><strong>Lower Memory Consumption:</strong> Avoid creating objects for invalid data</li>
        <li><strong>Faster Database Operations:</strong> Validate before expensive queries</li>
        <li><strong>Improved Cache Efficiency:</strong> Don't cache results from invalid operations</li>
    </ul>
    
    <p>
        More importantly, fail-fast systems are more reliable because they have predictable failure modes:
        when something goes wrong, you get immediate, clear feedback rather than mysterious issues that
        appear hours or days later.
    </p>
</section>

<section>
    <h2>Implementing Fail-Fast in Legacy Systems</h2>
    <p>
        You don't need to rewrite everything to adopt fail-fast principles. Start with new code and gradually 
        refactor existing systems:
    </p>
    
    <h3>1. Start at the Edges</h3>
    <p>
        Begin with input validation at API endpoints, CLI command handlers, and data ingestion points. These 
        are natural boundaries where fail-fast validation has the highest impact.
    </p>
    
    <h3>2. Refactor One Function at a Time</h3>
    <p>
        When modifying existing functions, add guard clauses at the beginning. This improves the code without 
        requiring wholesale architectural changes.
    </p>
    
    <h3>3. Create Validation Layers</h3>
    <p>
        Add validation middleware or decorators to existing services. This provides fail-fast behaviour without
        modifying core business logic immediately.
    </p>
    
    <h3>4. Use Feature Flags</h3>
    <p>
        Implement stricter validation behind feature flags. This allows gradual rollout and easy rollback if issues arise.
    </p>
</section>

<section>
    <h2>Tools and Libraries for Fail-Fast Development</h2>
    <h3>PHP</h3>
    <ul>
        <li><a href="https://github.com/webmozart/assert" target="_blank" rel="noopener">webmozart/assert</a> - Runtime assertions for PHP</li>
        <li><a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a> - Static analysis to catch issues before runtime</li>
        <li><a href="https://psalm.dev/" target="_blank" rel="noopener">Psalm</a> - Advanced static analysis with type inference</li>
    </ul>
    
    <h3>TypeScript</h3>
    <ul>
        <li><a href="https://zod.dev/" target="_blank" rel="noopener">Zod</a> - Runtime validation with TypeScript inference</li>
        <li><a href="https://github.com/gcanti/io-ts" target="_blank" rel="noopener">io-ts</a> - Functional approach to runtime type checking</li>
        <li><a href="https://github.com/sindresorhus/ow" target="_blank" rel="noopener">ow</a> - Function argument validation with descriptive errors</li>
    </ul>
    
    <h3>Bash</h3>
    <ul>
        <li><a href="https://www.shellcheck.net/" target="_blank" rel="noopener">ShellCheck</a> - Static analysis for shell scripts</li>
        <li><a href="https://github.com/bats-core/bats-core" target="_blank" rel="noopener">BATS</a> - Testing framework for Bash scripts</li>
    </ul>
    
    <h3>Ansible</h3>
    <ul>
        <li><a href="https://ansible.readthedocs.io/projects/lint/" target="_blank" rel="noopener">ansible-lint</a> - Best practices linter for playbooks</li>
        <li><a href="https://github.com/ansible/molecule" target="_blank" rel="noopener">Molecule</a> - Testing framework for Ansible roles</li>
    </ul>
</section>

<section>
    <h2>Monitoring and Observability</h2>
    <p>
        Fail-fast systems generate more explicit errors, which makes them easier to monitor and debug - put that
        to good use with proper observability tools:
    </p>
    
    <h3>Error Aggregation</h3>
    <p>
        Tools like <a href="https://sentry.io/" target="_blank" rel="noopener">Sentry</a> or <a href="https://rollbar.com/" target="_blank" rel="noopener">Rollbar</a> 
        become more effective when your code fails fast with structured error messages. Each guard clause failure 
        provides specific diagnostic information.
    </p>
    
    <h3>Structured Logging</h3>
    <p>
        Use structured logging formats (JSON) with consistent error categorisation. This enables automated
        alerting on specific failure types and trend analysis.
    </p>
    
    <h3>Health Checks</h3>
    <p>
        Implement health checks that validate every system prerequisite. These should fail fast
        when dependencies are unavailable, giving clear signals to orchestration systems.
    </p>
</section>

<section>
    <h2>Conclusion: Building High-Trust Systems</h2>
    <p>
        Fail-fast programming is about building systems you can trust, not about giving up easily: when
        your code validates assumptions explicitly and fails clearly at the point of deviation, you create
        applications that are easier to debug, test, and maintain.
    </p>
    
    <p>
        The payoff comes during those 3 AM production incidents. Instead of hunting through logs for vague 
        error messages and mysterious state corruption, you get clear stack traces pointing to exactly what 
        went wrong and why. Your future self will thank you for choosing clarity over convenience.
    </p>
    
    <p>
        Remember this: a system that fails fast and clearly is infinitely more valuable than one that limps forward
        silently corrupting data, so embrace the crash - it's your code's way of communicating what needs to be fixed.
    </p>
    
    <p>
        Start implementing fail-fast principles in your next function, script, or playbook. Validate inputs 
        aggressively, throw exceptions with context, and let your failures be loud and proud. Your debugging 
        sessions will become shorter, your tests more reliable, and your production systems more trustworthy.
    </p>
</section>
    `,
  },
  // Migrating: fedora-42-breakthrough-features.ejs
  {
    id: 'fedora-42-breakthrough-features',
    title: "Fedora 42: What's New in KDE Plasma, COSMIC, and the Installer",
    description:
      "A look at Fedora 42's headline changes - KDE Plasma promoted to a full edition alongside GNOME, an official (alpha-quality) COSMIC Spin, a WebUI-based Anaconda installer for Workstation, and the toolchain updates underneath.",
    date: '2025-07-18',
    category: CATEGORIES.infrastructure.id,
    readingTime: 4,
    register: 'formal',
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'Fedora',
    heroImage: {
      src: '/images/fedora-42-breakthrough-features/hero.webp',
      alt: 'A black-and-white photograph of a foundry casting crew pouring molten metal from a holding furnace into molds, with a bright glowing pour stream lighting the scene',
      ogImage: '/images/fedora-42-breakthrough-features/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:FRONT_VIEW_OF_POURING_FROM_-61_HOLDING_FURNACE_AT_-02_STATION_INTO_THREE_VERTICAL_MOLDS_SUBMERGED_IN_A_WATER-FILLED_TANK_BELOW_THE_CASTING_FLOOR._THE_CASTING_CREW%27S_JOBS_DURING_HAER_NY,15-BUF,25-8.tif',
    },
    content: `
<section class="intro">
      <p class="lead">Fedora 42 promotes KDE Plasma from a spin to a full edition alongside GNOME, ships an official (but still alpha-quality) COSMIC Spin, and switches the Workstation installer to a new WebUI. Underneath, the toolchain and kernel move forward by their usual one release's worth of versions.</p>
      <p>The most user-visible change is KDE Plasma's promotion; the most experimental is COSMIC. Between them sits a genuinely modernised installer and the usual round of package updates.</p>
    </section>

    <section class="content">
      <h2>KDE Plasma Promotion: A New Chapter</h2>
      <p>The most significant change in Fedora 42 is the promotion of KDE Plasma from a spin to a full edition, standing alongside GNOME as an equal partner. It reflects the maturity and popularity of the KDE desktop environment within the Fedora ecosystem.</p>

      <h3>What This Means for Users</h3>
      <p>The promotion brings a couple of concrete changes:</p>
      <ul>
        <li><strong>Equal Support:</strong> KDE Plasma receives the same level of testing, integration, and support as GNOME</li>
        <li><strong>Release-Blocking Status:</strong> KDE-specific bugs can now block a Fedora release, the same as GNOME bugs</li>
      </ul>

      <h2>COSMIC Desktop Environment: Official, Not Yet Finished</h2>
      <p>Fedora 42 ships an official COSMIC Spin, built by System76 as a Rust-based, tiling-capable desktop. It's one of the first major distributions to package COSMIC as an official Spin, but Fedora's own guidance is clear that it's still alpha-quality and intended for testing rather than daily-driver use at this stage.</p>

      <h3>Notable Characteristics</h3>
      <ul>
        <li><strong>Rust-Based:</strong> Built entirely in Rust for memory safety and performance</li>
        <li><strong>Tiling by Default:</strong> Native tiling window management with keyboard shortcuts</li>
        <li><strong>Cosmic Settings:</strong> A unified settings application replacing fragmented configuration tools</li>
      </ul>

      <h2>Anaconda WebUI: A New Default for Workstation</h2>
      <p>The Workstation Live ISO now defaults to a PatternFly-based WebUI installer in place of the traditional Anaconda interface, including a redesigned storage-partitioning flow. Other Spins, Editions, and DNF-based installs weren't covered by this change in Fedora 42.</p>

      <h3>Key Changes</h3>
      <ul>
        <li><strong>Responsive Design:</strong> Works across different screen sizes and resolutions</li>
        <li><strong>Redesigned Partitioning:</strong> A reworked storage-configuration flow for the web interface</li>
        <li><strong>Modern UI:</strong> A web-based interface replacing the older Anaconda GUI toolkit</li>
      </ul>

      <h2>Developer Experience: Toolchain Updates</h2>
      <p>Fedora 42 carries the usual release's worth of toolchain updates:</p>

      <ul>
        <li><strong>GCC 15:</strong> The GNU toolchain update also brings binutils 2.44, glibc 2.41, and gdb 15+</li>
        <li><strong>LLVM 20:</strong> Updated Clang and the rest of the LLVM subprojects</li>
        <li><strong>Python:</strong> Python 3.8 is retired; applications must target 3.9 or newer</li>
      </ul>

      <h2>Infrastructure: Kernel and Package Management</h2>
      <p>Under the hood:</p>
      <ul>
        <li><strong>Linux 6.14 Kernel:</strong> The kernel Fedora 42 shipped with at general availability</li>
        <li><strong>DNF5:</strong> Already the default since Fedora 41; Fedora 42 adds automatic handling of expired or obsolete repository signing keys</li>
        <li><strong>Drm Panic:</strong> Improves the visibility of kernel panic information on the display itself</li>
      </ul>

      <h2>Where This Leaves Things</h2>
      <p>KDE Plasma's promotion to full-edition status is the change worth paying attention to here - it's a real shift in how Fedora tests and supports the desktop, not just a labelling change. COSMIC, by contrast, is worth trying on a spare machine or in a VM rather than treating as a daily driver yet; Fedora's own packaging guidance says as much.</p>

      <p>The WebUI installer and the toolchain bumps are the kind of steady, incremental progress every Fedora release carries. None of it is dramatic on its own, but it's what keeps the distribution current.</p>
    </section>

    <footer class="article-footer">
      <div class="article-nav">
        <a href="/articles" class="back-link">← Back to Articles</a>
      </div>
    </footer>
    `,
  },
  // Migrating: fedora-desktop-automation-ansible.ejs
  {
    id: 'fedora-desktop-automation-ansible',
    title: 'Automating Fedora 42 Desktop Development: Open Source Infrastructure as Code',
    description:
      "What a real Ansible repository for provisioning a Fedora desktop looks like, and why baseline automation should stay narrow so project-specific stacks can build on top of it.",
    date: '2025-09-03',
    category: CATEGORIES.infrastructure.id,
    readingTime: 12,
    register: 'formal',
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'Fedora',
    heroImage: {
      src: '/images/fedora-desktop-automation-ansible/hero.webp',
      alt: 'An elevated, black-and-white photograph of NASA Mission Control, showing rows of identically equipped console workstations',
      ogImage: '/images/fedora-desktop-automation-ansible/og.jpg',
      creditText: 'Image: NASA, public domain, via Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Mission_control_center.jpg',
    },
    content: `
<div class="intro">
            <p class="lead">
                Every developer knows the pain: fresh OS installation, hours of manual configuration,
                hunting down packages, setting up SSH keys, configuring Git, installing development
                tools, and customising the environment. What if a single command could turn a
                vanilla <a href="https://fedoraproject.org/" target="_blank" rel="noopener">Fedora 42</a>
                installation into a fully configured development environment? The
                <a href="https://github.com/LongTermSupport/fedora-desktop" target="_blank" rel="noopener">LongTermSupport/fedora-desktop</a>
                repository is a working example of infrastructure-as-code applied to
                personal workstations, using <a href="https://www.ansible.com/" target="_blank" rel="noopener">Ansible</a>,
                <a href="https://cli.github.com/" target="_blank" rel="noopener">GitHub CLI</a>, and other
                open source tools to cut out most of the manual setup drudgery.
            </p>
        </div>

        <section>
            <h2>The Philosophy: Infrastructure as Code for Personal Workstations</h2>
            
            <p>
                <a href="https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac" target="_blank" rel="noopener">Infrastructure as Code (IaC)</a> 
                has revolutionised how we manage servers and cloud resources, but its principles apply
                equally powerfully to personal development environments. The concept treats your desktop 
                configuration as <a href="https://git-scm.com/" target="_blank" rel="noopener">version-controlled</a>, 
                <a href="https://docs.ansible.com/ansible/latest/playbook_guide/playbooks_intro.html" target="_blank" rel="noopener">idempotent</a>, 
                and reproducible code rather than a collection of manual setup steps you hope to remember.
            </p>

            <pre><code class="language-plaintext">{{SNIPPET:fedora-desktop-automation-ansible/iac-philosophy-pseudocode.txt}}
</code></pre>

            <p>
                This approach transforms desktop management from an artisanal craft into an engineering discipline. 
                Instead of maintaining a mental checklist of "things to install after a fresh install," 
                you maintain executable code that captures your exact requirements. When you need to set up 
                a new machine, recover from hardware failure, or onboard a team member, the entire process 
                becomes a single command execution.
            </p>

            <h3>Benefits of Desktop Infrastructure as Code</h3>
            
            <ul>
                <li><strong>Reproducibility</strong>: Identical environments across different machines and team members</li>
                <li><strong>Documentation</strong>: Configuration becomes self-documenting through version-controlled playbooks</li>
                <li><strong>Disaster Recovery</strong>: Complete environment restoration from fresh OS install</li>
                <li><strong>Onboarding</strong>: New team members get consistent, working environments</li>
                <li><strong>Experimentation</strong>: Safe to test changes knowing you can rebuild from scratch</li>
                <li><strong>Evolution</strong>: Environment configuration evolves with your changing needs</li>
            </ul>
        </section>

        <section>
            <h2>Dissecting the fedora-desktop Repository</h2>
            
            <p>
                The <a href="https://github.com/LongTermSupport/fedora-desktop" target="_blank" rel="noopener">fedora-desktop repository</a> 
                exemplifies modern desktop automation philosophy. Built specifically for 
                <a href="https://fedoraproject.org/wiki/Releases/40/ChangeSet" target="_blank" rel="noopener">Fedora 40+</a>, 
                it takes a "fresh install to fully configured" approach that emphasises security,
                developer productivity, and maintainable automation.
            </p>

            <h3>Repository Architecture</h3>
            
            <p>
                The repository follows <a href="https://docs.ansible.com/ansible/latest/tips_tricks/ansible_tips_tricks.html#directory-layout" target="_blank" rel="noopener">Ansible best practices</a> 
                with a modular structure that separates concerns:
            </p>
            
            <ul>
                <li><strong>playbooks/</strong>: Main automation logic and task imports</li>
                <li><strong>environment/localhost/</strong>: Host-specific configurations</li>
                <li><strong>files/</strong>: Static files to be deployed</li>
                <li><strong>vars/</strong>: Variable definitions and configuration</li>
                <li><strong>untracked/</strong>: Local customisations (gitignored)</li>
                <li><strong>run.bash</strong>: Bootstrap script that handles initial setup</li>
            </ul>

            <h3>The Bootstrap Process</h3>
            
            <p>
                It begins with a single command that uses
                <a href="https://curl.se/" target="_blank" rel="noopener">curl</a> to download and execute
                the bootstrap script directly from the repository. This approach, whilst requiring trust
                in the source, enables truly one-command environment setup:
            </p>
            
            <pre><code class="language-bash">{{SNIPPET:fedora-desktop-automation-ansible/bootstrap-installation.sh}}
</code></pre>

            <p>
                The bootstrap script follows several patterns worth reusing in your own automation:
            </p>

            <ul>
                <li><strong>Strict error handling</strong>: Uses <code>set -euo pipefail</code> to fail fast on errors</li>
                <li><strong>Structured logging</strong>: Different severity levels for different kinds of messages</li>
                <li><strong>Preflight checks</strong>: Validates system requirements before proceeding</li>
                <li><strong>User safety</strong>: Prevents execution as root to avoid system damage</li>
            </ul>
        </section>

        <section>
            <h2>Core Automation: What Gets Configured Automatically</h2>
            
            <p>
                The main Ansible playbook works through a long list of changes to the base
                <a href="https://fedoraproject.org/workstation/" target="_blank" rel="noopener">Fedora Workstation</a>
                installation. Understanding what happens automatically versus what requires user choice
                helps you adapt the approach to your own needs.
            </p>

            <p>
                The repository uses a modular approach with <a href="https://github.com/LongTermSupport/fedora-desktop/tree/F42/playbooks/imports/optional" target="_blank" rel="noopener">optional playbooks</a> 
                that can be run individually as needed.
            </p>

            <h3>Automatic Core Configurations</h3>
            
            <p>The playbook handles essential development environment setup without user intervention:</p>

            <h4>System Foundation</h4>
            <ul>
                <li><strong><a href="https://docs.fedoraproject.org/en-US/quick-docs/dnf/" target="_blank" rel="noopener">DNF package management</a></strong>: Updates system packages and installs development essentials</li>
                <li><strong><a href="https://rpmfusion.org/" target="_blank" rel="noopener">RPM Fusion repositories</a></strong>: Enables multimedia codecs and proprietary drivers</li>
                <li><strong><a href="https://docs.fedoraproject.org/en-US/fedora/latest/system-administrators-guide/monitoring-and-automation/systemd/" target="_blank" rel="noopener">Systemd services</a></strong>: Configures and enables essential system services</li>
            </ul>

            <h4>Development Tools</h4>
            <p>
                Based on the <a href="https://github.com/LongTermSupport/fedora-desktop/blob/F42/README.md" target="_blank" rel="noopener">repository documentation</a>, 
                the automation installs a wide range of development tools:
            </p>
            
            <ul>
                <li><strong>Core Tools</strong>: Git, ripgrep, GitHub CLI</li>
                <li><strong>Node.js</strong>: Managed via NVM for version flexibility</li>
                <li><strong>Claude Code CLI</strong>: AI-powered development assistance</li>
                <li><strong>JetBrains Toolbox</strong>: IDE management platform</li>
                <li><strong>Container Support</strong>: LXC containers for development isolation</li>
                <li><strong>Fonts</strong>: Microsoft fonts for better compatibility</li>
            </ul>

            <h4>Version Control and Collaboration</h4>
            <ul>
                <li><strong><a href="https://git-scm.com/" target="_blank" rel="noopener">Git</a> configuration</strong>: Global settings, aliases, and hooks</li>
                <li><strong><a href="https://cli.github.com/" target="_blank" rel="noopener">GitHub CLI</a> installation</strong>: Modern GitHub workflow integration</li>
                <li><strong>SSH key management</strong>: Automated <a href="https://ed25519.cr.yp.to/" target="_blank" rel="noopener">Ed25519</a> key generation</li>
                <li><strong>Multi-account support</strong>: GitHub CLI configuration for work/personal separation</li>
            </ul>

            <h4>Container and Virtualisation</h4>
            <ul>
                <li><strong><a href="https://linuxcontainers.org/lxc/" target="_blank" rel="noopener">LXC containers</a></strong>: Lightweight virtualisation for development</li>
                <li><strong><a href="https://podman.io/" target="_blank" rel="noopener">Podman</a></strong>: Daemonless container engine (Fedora's Docker alternative)</li>
                <li><strong><a href="https://docs.fedoraproject.org/en-US/fedora-silverblue/toolbox/" target="_blank" rel="noopener">Toolbox</a></strong>: Containerised development environments</li>
            </ul>
        </section>

        <section>
            <h2>The Power of GitHub CLI Multi-Account Management</h2>
            
            <p>
                One of the most impressive features in the repository is its approach to 
                <a href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-multiple-accounts" target="_blank" rel="noopener">GitHub multi-account management</a>. 
                Modern developers frequently need to switch between personal and work GitHub accounts, 
                and the traditional approach of managing multiple SSH keys and Git configurations 
                has always been cumbersome.
            </p>

            <p>
                The <a href="https://github.blog/changelog/2023-12-17-log-in-to-multiple-github-accounts-with-the-cli/" target="_blank" rel="noopener">GitHub CLI's native multi-account support</a> 
                (introduced in late 2023) makes this workflow far less painful, and the fedora-desktop repository
                shows how to automate its configuration:
            </p>

            <pre><code class="language-yaml">{{SNIPPET:fedora-desktop-automation-ansible/git-multi-account.yml}}
</code></pre>

            <h3>Modern Multi-Account Workflow</h3>
            
            <p>
                The automation sets up a workflow that removes most of the confusion of
                managing multiple GitHub identities:
            </p>

            <pre><code class="language-bash">{{SNIPPET:fedora-desktop-automation-ansible/github-multi-setup.sh}}
</code></pre>

            <h3>Detecting Which Account a Repository Uses</h3>

            <p>
                Beyond GitHub CLI management, the repository includes a <code>git-account-helper</code> script.
                It reads the SSH host alias embedded in a repo's remote URL (<code>git@github.com-work:owner/repo.git</code>
                versus <code>github.com-personal</code>) to work out which configured account that repository
                belongs to, and can look up that account's email. It's a building block for your own
                identity-switching wrapper, not a fully automatic Git identity switch - it doesn't rewrite
                <code>git config</code> for you.
            </p>

            <h3>Benefits of Automated Multi-Account Setup</h3>

            <ul>
                <li><strong>Context switching</strong>: Quick transitions between work and personal projects</li>
                <li><strong>Account detection</strong>: A single command tells you which account a given repo belongs to</li>
                <li><strong>Security isolation</strong>: Separate SSH keys and authentication tokens</li>
                <li><strong>Workflow consistency</strong>: Same commands work regardless of active account</li>
                <li><strong>Team onboarding</strong>: New developers get properly configured multi-account setup</li>
            </ul>
        </section>

        <section>
            <h2>Optional Playbooks: Choose Your Own Adventure</h2>
            
            <p>
                Whilst the main playbook handles universal development needs, the repository
                architecture supports optional playbooks for specialised requirements. This
                modular approach prevents bloat whilst enabling customisation.
            </p>

            <h3>Flatpak Application Management</h3>
            
            <p>
                <a href="https://flatpak.org/" target="_blank" rel="noopener">Flatpak</a> has become 
                the preferred application distribution method for Linux desktops, offering sandboxed 
                applications with consistent dependencies. The repository includes an optional playbook 
                for Flatpak application installation via the 
                <a href="https://github.com/LongTermSupport/fedora-desktop/blob/F42/playbooks/imports/optional/common/play-install-flatpaks.yml" target="_blank" rel="noopener">play-install-flatpaks.yml</a> playbook:
            </p>

            <pre><code class="language-bash">ansible-playbook ./playbooks/imports/optional/common/play-install-flatpaks.yml</code></pre>

            <h3>Creating Custom Playbooks</h3>
            
            <p>
                The modular structure makes it straightforward to create custom playbooks for 
                specific needs. Whether you need to configure 
                <a href="https://www.jetbrains.com/idea/" target="_blank" rel="noopener">IntelliJ IDEA</a>, 
                set up <a href="https://www.docker.com/" target="_blank" rel="noopener">Docker</a> 
                development environments, or configure specialised tools like
                <a href="https://kubernetes.io/" target="_blank" rel="noopener">Kubernetes</a> 
                clients, the pattern remains consistent.
            </p>

            <h3>Examples of Additional Playbooks</h3>
            
            <ul>
                <li><strong>Media production</strong>: <a href="https://www.blender.org/" target="_blank" rel="noopener">Blender</a>, <a href="https://www.gimp.org/" target="_blank" rel="noopener">GIMP</a>, <a href="https://www.audacityteam.org/" target="_blank" rel="noopener">Audacity</a></li>
                <li><strong>Gaming setup</strong>: <a href="https://store.steampowered.com/" target="_blank" rel="noopener">Steam</a>, <a href="https://lutris.net/" target="_blank" rel="noopener">Lutris</a>, <a href="https://github.com/ValveSoftware/Proton" target="_blank" rel="noopener">Proton</a></li>
                <li><strong>Design tools</strong>: <a href="https://www.figma.com/" target="_blank" rel="noopener">Figma</a>, <a href="https://inkscape.org/" target="_blank" rel="noopener">Inkscape</a></li>
                <li><strong>Cloud tools</strong>: <a href="https://aws.amazon.com/cli/" target="_blank" rel="noopener">AWS CLI</a>, <a href="https://cloud.google.com/sdk" target="_blank" rel="noopener">Google Cloud SDK</a>, <a href="https://docs.microsoft.com/en-us/cli/azure/" target="_blank" rel="noopener">Azure CLI</a></li>
                <li><strong>Database tools</strong>: <a href="https://www.postgresql.org/" target="_blank" rel="noopener">PostgreSQL</a>, <a href="https://www.mysql.com/" target="_blank" rel="noopener">MySQL</a>, <a href="https://redis.io/" target="_blank" rel="noopener">Redis</a></li>
            </ul>
        </section>

        <section>
            <h2>Security Considerations and Best Practices</h2>
            
            <p>
                Desktop automation introduces unique security considerations that server 
                infrastructure automation doesn't typically face. The fedora-desktop repository
                follows several security practices worth calling out.
            </p>

            <h3>Encryption and Filesystem Security</h3>
            
            <p>
                The repository strongly recommends full disk encryption during Fedora installation, 
                using <a href="https://gitlab.com/cryptsetup/cryptsetup" target="_blank" rel="noopener">LUKS</a> 
                (Linux Unified Key Setup) for protecting data at rest. The recommended partition layout
                prioritises security:
            </p>

            <ul>
                <li><strong>/boot</strong>: 500MB ext4 (unencrypted for bootloader access)</li>
                <li><strong>/boot/efi</strong>: 100MB EFI partition (required for UEFI systems)</li>
                <li><strong>/swap</strong>: Half of RAM size (encrypted)</li>
                <li><strong>/</strong>: Remaining space with <a href="https://btrfs.wiki.kernel.org/" target="_blank" rel="noopener">Btrfs</a> or ext4 (encrypted)</li>
            </ul>

            <h3>SSH Key Management</h3>
            
            <p>
                The automation generates <a href="https://ed25519.cr.yp.to/" target="_blank" rel="noopener">Ed25519 SSH keys</a>, 
                which offer superior security compared to traditional RSA keys whilst maintaining
                compatibility with modern systems. The key generation includes:
            </p>

            <ul>
                <li><strong>Strong key generation</strong>: Ed25519 algorithm with proper randomness</li>
                <li><strong>Descriptive comments</strong>: Keys include hostname and purpose identification</li>
                <li><strong>Proper permissions</strong>: Correct file permissions (600 for private keys)</li>
                <li><strong>SSH agent integration</strong>: Automated key loading, so authentication just works</li>
            </ul>

            <h3>Third-Party Repository Management</h3>
            
            <p>
                The automation enables <a href="https://rpmfusion.org/" target="_blank" rel="noopener">RPM Fusion repositories</a> 
                for multimedia codecs and proprietary drivers, but it does so explicitly and transparently. 
                This approach balances functionality needs with security awareness.
            </p>

            <h3>Principle of Least Privilege</h3>
            
            <p>
                The bootstrap script explicitly prevents execution as root, encouraging users to 
                run with standard user privileges and use <code>sudo</code> only when necessary. 
                This reduces the risk of accidental system damage during automation.
            </p>
        </section>

        <section>
            <h2>The Baseline Philosophy: Foundation for Project-Specific Automation</h2>
            
            <p>
                The true power of the fedora-desktop repository lies not in trying to be everything
                to everyone, but in providing a solid, known baseline that other automation can
                reliably build upon. Rather than cramming every possible development stack into
                one monolithic playbook, the repository establishes a foundation of essential tools 
                and configurations that project-specific automation can assume will be present.
            </p>

            <h3>Separation of Concerns: Desktop vs. Project Stacks</h3>
            
            <p>
                The fedora-desktop repository handles universal needs: system packages, shell
                configuration, Git setup, container support, and development fundamentals. 
                Project-specific technology stacks are intentionally left to separate Ansible 
                projects that can provision <a href="https://linuxcontainers.org/lxc/" target="_blank" rel="noopener">LXC</a> 
                or <a href="https://www.docker.com/" target="_blank" rel="noopener">Docker</a> 
                infrastructure as required.
            </p>
            
            <p>
                This architectural decision means that when you need a 
                <a href="https://www.php.net/" target="_blank" rel="noopener">PHP development environment</a> 
                with <a href="https://www.mysql.com/" target="_blank" rel="noopener">MySQL</a>, 
                <a href="https://redis.io/" target="_blank" rel="noopener">Redis</a>, and 
                <a href="https://nginx.org/" target="_blank" rel="noopener">Nginx</a>, you create 
                a separate Ansible project that:
            </p>
            
            <ul>
                <li><strong>Assumes the baseline exists</strong>: Git, Docker/LXC, GitHub CLI already configured</li>
                <li><strong>Provisions containers</strong>: Creates isolated environments for the tech stack</li>
                <li><strong>Handles project-specific configs</strong>: Database schemas, application configs, networking</li>
                <li><strong>Manages lifecycle</strong>: Start/stop services, backup data, handle updates</li>
            </ul>

            <h3>The Power of Forking</h3>
            
            <p>
                Forking the fedora-desktop repository makes tremendous sense for personalisation
                and organisational customisation. Your fork becomes your organisation's
                "known good desktop state", a guaranteed foundation that all team members share.
                From this common base, project-specific automation can make reliable assumptions 
                about available tools and configurations.
            </p>
            
            <p>
                <strong>Example organisational fork customisations:</strong>
            </p>
            
            <ul>
                <li><strong>Corporate identity</strong>: Company VPN clients, SSL certificates, internal DNS</li>
                <li><strong>Security policies</strong>: Endpoint monitoring, compliance tools, audit agents</li>
                <li><strong>Development standards</strong>: Preferred IDEs, code formatters, Git hooks</li>
                <li><strong>Infrastructure tooling</strong>: Cloud CLI tools, Kubernetes clients, monitoring dashboards</li>
            </ul>

            <h3>Container-First Project Development</h3>
            
            <p>
                With the baseline providing solid container support through LXC and Docker,
                project-specific stacks become much more manageable. Instead of polluting the 
                host system with multiple language versions and conflicting dependencies, 
                each project gets its own containerised environment.
            </p>
            
            <p>
                A typical project automation workflow:
            </p>
            
            <ol>
                <li><strong>Clone project repository</strong>: Use the configured GitHub CLI</li>
                <li><strong>Run project's Ansible playbook</strong>: Provisions containers and dependencies</li>
                <li><strong>Development isolation</strong>: Each project runs in its own environment</li>
                <li><strong>Reproducible deployments</strong>: Container configs match production</li>
            </ol>
        </section>

        <section>
            <h2>Modern Fedora 42 Advantages for Automation</h2>
            
            <p>
                <a href="https://fedoraproject.org/wiki/Releases/42/ChangeSet" target="_blank" rel="noopener">Fedora 42</a> 
                (released in 2025) brings several enhancements that make it particularly well-suited 
                for automated desktop provisioning compared to previous versions and other distributions.
            </p>

            <h3>Package Management Improvements</h3>
            
            <p>
                <a href="https://docs.fedoraproject.org/en-US/quick-docs/dnf/" target="_blank" rel="noopener">DNF 5</a> 
                in Fedora 42 offers significant performance improvements and better dependency resolution, 
                making automated package installation faster and more reliable. The enhanced 
                <a href="https://docs.fedoraproject.org/en-US/modularity/" target="_blank" rel="noopener">modularity system</a> 
                allows precise control over software versions.
            </p>

            <h3>Container Integration</h3>
            
            <p>
                Fedora 42's deep integration with <a href="https://podman.io/" target="_blank" rel="noopener">Podman 5.x</a> 
                and improved <a href="https://docs.fedoraproject.org/en-US/fedora-silverblue/toolbox/" target="_blank" rel="noopener">Toolbox</a> 
                support makes containerised development environments a first-class citizen. This is
                particularly valuable for teams working with multiple technology stacks.
            </p>

            <h3>Security Enhancements</h3>
            
            <ul>
                <li><strong><a href="https://selinuxproject.org/" target="_blank" rel="noopener">SELinux</a> improvements</strong>: Better application sandboxing</li>
                <li><strong><a href="https://systemd.io/" target="_blank" rel="noopener">systemd</a> hardening</strong>: Enhanced service isolation</li>
                <li><strong><a href="https://www.freedesktop.org/software/systemd/man/systemd-homed.service.html" target="_blank" rel="noopener">systemd-homed</a></strong>: Modern user account management</li>
                <li><strong>Hardware security</strong>: Better TPM 2.0 integration for disk encryption</li>
            </ul>

            <h3>Development Tools</h3>
            
            <p>
                Fedora 42 ships with cutting-edge development tools by default:
            </p>

            <ul>
                <li><strong><a href="https://gcc.gnu.org/" target="_blank" rel="noopener">GCC 15</a></strong>: Latest compiler with C++26 features</li>
                <li><strong><a href="https://www.python.org/" target="_blank" rel="noopener">Python 3.13</a></strong>: Latest Python with performance improvements</li>
                <li><strong><a href="https://nodejs.org/" target="_blank" rel="noopener">Node.js 22</a> LTS</strong>: Current long-term support release</li>
                <li><strong><a href="https://golang.org/" target="_blank" rel="noopener">Go 1.23</a></strong>: Latest Go version with improved generics</li>
            </ul>
        </section>

        <section>
            <h2>Lessons Learned and Best Practices</h2>
            
            <p>
                After analysing the fedora-desktop repository and modern desktop automation practices,
                several key lessons emerge for anyone implementing infrastructure-as-code for 
                personal or team workstations.
            </p>

            <h3>Start Simple, Iterate Frequently</h3>
            
            <p>
                The most successful desktop automation starts with core needs (package installation, 
                basic configuration) and gradually adds complexity. Trying to automate everything 
                at once leads to brittle, hard-to-debug playbooks.
            </p>

            <h3>Embrace Idempotency</h3>
            
            <p>
                <a href="https://docs.ansible.com/ansible/latest/reference_appendices/glossary.html#term-Idempotency" target="_blank" rel="noopener">Idempotent operations</a> 
                are crucial for desktop automation. Users should be able to run the automation 
                multiple times safely, whether for updates, fixes, or adding new configurations.
            </p>

            <h3>Document Manual Steps</h3>
            
            <p>
                Some configurations still require manual intervention (like adding SSH keys to GitHub). 
                The best automation clearly documents these steps and provides helpful prompts or 
                error messages when manual action is required.
            </p>

            <h3>Version Everything</h3>
            
            <p>
                Desktop configurations should be version controlled just like application code. 
                This enables rollbacks, experimentation, and collaboration on environment improvements.
            </p>

            <h3>Test on Clean Systems</h3>
            
            <p>
                Regular testing on fresh virtual machines ensures your automation works for new team
                members or system recovery scenarios. 
                <a href="https://www.virtualbox.org/" target="_blank" rel="noopener">VirtualBox</a>, 
                <a href="https://virt-manager.org/" target="_blank" rel="noopener">virt-manager</a>, 
                or <a href="https://multipass.run/" target="_blank" rel="noopener">Multipass</a> 
                make this testing straightforward.
            </p>

            <h3>Modular Design Wins</h3>
            
            <p>
                Breaking automation into focused, reusable modules makes it easier to maintain, 
                test, and share. A monolithic playbook becomes unwieldy as requirements grow.
            </p>
        </section>

        <section>
            <h2>The Broader Impact: Open Source Toolchain Integration</h2>
            
            <p>
                The fedora-desktop repository shows how modern open source tools fit together to
                create effective automation workflows, and the approach goes beyond Ansible
                and Fedora: it's really an ecosystem approach to infrastructure management.
            </p>

            <h3>Tool Ecosystem Synergy</h3>
            
            <ul>
                <li><strong><a href="https://fedoraproject.org/" target="_blank" rel="noopener">Fedora Linux</a></strong>: Cutting-edge base platform</li>
                <li><strong><a href="https://www.ansible.com/" target="_blank" rel="noopener">Ansible</a></strong>: Configuration management and automation</li>
                <li><strong><a href="https://cli.github.com/" target="_blank" rel="noopener">GitHub CLI</a></strong>: Modern version control workflow</li>
                <li><strong><a href="https://docs.fedoraproject.org/en-US/quick-docs/dnf/" target="_blank" rel="noopener">DNF</a></strong>: Reliable package management</li>
                <li><strong><a href="https://flatpak.org/" target="_blank" rel="noopener">Flatpak</a></strong>: Sandboxed application distribution</li>
                <li><strong><a href="https://podman.io/" target="_blank" rel="noopener">Podman</a></strong>: Daemonless container management</li>
                <li><strong><a href="https://systemd.io/" target="_blank" rel="noopener">systemd</a></strong>: Service and system management</li>
            </ul>

            <h3>Enterprise Readiness</h3>
            
            <p>
                The patterns used in personal workstation automation translate directly
                to enterprise environments. Organisations using
                <a href="https://www.redhat.com/en/technologies/linux-platforms/enterprise-linux" target="_blank" rel="noopener">Red Hat Enterprise Linux</a>,
                <a href="https://access.redhat.com/products/red-hat-satellite" target="_blank" rel="noopener">Red Hat Satellite</a>,
                or <a href="https://www.ansible.com/products/automation-platform" target="_blank" rel="noopener">Ansible Automation Platform</a>
                can apply similar approaches for standardised desktop deployments.
            </p>

            <h3>Community Contribution</h3>
            
            <p>
                By open-sourcing desktop automation, the fedora-desktop repository contributes 
                to the broader community knowledge base. Other developers can learn from the 
                patterns, contribute improvements, or adapt the approach for different distributions 
                like <a href="https://ubuntu.com/" target="_blank" rel="noopener">Ubuntu</a>, 
                <a href="https://www.opensuse.org/" target="_blank" rel="noopener">openSUSE</a>, 
                or <a href="https://archlinux.org/" target="_blank" rel="noopener">Arch Linux</a>.
            </p>
        </section>

        <section>
            <h2>Roadmap: Advancing Desktop Automation</h2>
            
            <p>
                Whilst the fedora-desktop repository provides an excellent foundation, there are
                numerous areas for enhancement and expansion. The roadmap for advanced desktop 
                automation includes both immediate practical improvements and exploratory investigations 
                into emerging technologies.
            </p>

            <h3>Browser Automation and Configuration</h3>
            
            <p>
                Modern web development means testing across multiple browsers, each with its own configuration.
                A fully automated browser setup would install and configure:
            </p>
            
            <ul>
                <li><strong><a href="https://www.mozilla.org/firefox/" target="_blank" rel="noopener">Firefox</a></strong>: Developer tools, extensions, bookmark sync</li>
                <li><strong><a href="https://www.chromium.org/" target="_blank" rel="noopener">Chromium</a></strong>: Open-source Chrome alternative with privacy configurations</li>
                <li><strong><a href="https://www.google.com/chrome/" target="_blank" rel="noopener">Google Chrome</a></strong>: Full feature set with development extensions</li>
                <li><strong>Security hardening</strong>: Disable internal password managers, configure secure defaults</li>
                <li><strong>Developer extensions</strong>: React DevTools, Vue DevTools, lighthouse, accessibility tools</li>
                <li><strong>Bookmark synchronisation</strong>: Import bookmarks, configure sync services</li>
            </ul>
            
            <p>
                Browser automation presents unique challenges due to the need to handle user profiles, 
                extension APIs, and varying configuration formats across different browsers.
            </p>

            <h3>SELinux Integration: Security Without Compromise</h3>
            
            <p>
                Currently, the repository sets <a href="https://selinuxproject.org/" target="_blank" rel="noopener">SELinux</a>
                to permissive mode for LXC container support, which still represents a security compromise compared
                to full enforcement. A more thorough approach would:
            </p>
            
            <ul>
                <li><strong>Maintain SELinux enforcement</strong>: Keep security protections active</li>
                <li><strong>Create custom policies</strong>: Handle development tools and containers properly</li>
                <li><strong>Automated policy debugging</strong>: Tools to identify and resolve policy violations</li>
                <li><strong>Container integration</strong>: Proper SELinux contexts for Docker/LXC environments</li>
                <li><strong>Developer-friendly workflows</strong>: Development that isn't slowed down by security controls</li>
            </ul>

            <h3>System Optimisation and Pruning</h3>

            <p>
                Beyond adding applications, desktop automation can also optimise
                system performance through deliberate pruning:
            </p>

            <ul>
                <li><strong>Service analysis</strong>: Identify and disable unnecessary systemd services</li>
                <li><strong>Boot optimisation</strong>: Minimise startup time through selective service management</li>
                <li><strong>Package removal</strong>: Remove unused applications and libraries</li>
                <li><strong>Kernel tuning</strong>: Optimise kernel parameters for desktop workloads</li>
                <li><strong>Performance monitoring</strong>: Track boot times and resource usage over time</li>
            </ul>

            <h3>Exploring Immutable Desktop Paradigms</h3>
            
            <p>
                <a href="https://fedoraproject.org/silverblue/" target="_blank" rel="noopener">Fedora Silverblue</a> 
                represents a compelling evolution toward immutable desktop systems. Investigation 
                areas include:
            </p>
            
            <ul>
                <li><strong>Container-first development</strong>: All development work in Toolbox/Distrobox containers</li>
                <li><strong>Layered customisations</strong>: rpm-ostree layering for system modifications</li>
                <li><strong>Atomic updates</strong>: Rollback capabilities for failed configurations</li>
                <li><strong>Reproducible desktops</strong>: Exact system state reproduction across machines</li>
                <li><strong>Security benefits</strong>: Read-only root filesystem with enhanced security</li>
            </ul>

            <h3>Advanced System Tuning</h3>
            
            <p>
                Performance enthusiasts want maximum responsiveness from their development machines:
            </p>
            
            <ul>
                <li><strong>Boot time analysis</strong>: systemd-analyze integration for performance profiling</li>
                <li><strong>Memory optimisation</strong>: Swap configuration, memory compression, caching strategies</li>
                <li><strong>I/O scheduling</strong>: Storage optimisation for development workloads</li>
                <li><strong>Power management</strong>: Laptop optimisation without compromising performance</li>
                <li><strong>Hardware-specific tuning</strong>: GPU drivers, firmware optimisation</li>
            </ul>

            <h3>AI-Assisted Configuration Evolution</h3>
            
            <p>
                Future desktop automation may incorporate <a href="https://www.anthropic.com/" target="_blank" rel="noopener">AI assistance</a> 
                for intelligent configuration management:
            </p>
            
            <ul>
                <li><strong>Usage pattern analysis</strong>: Automatically optimise configurations based on actual usage</li>
                <li><strong>Performance regression detection</strong>: AI-powered monitoring of system performance changes</li>
                <li><strong>Configuration drift prevention</strong>: Automated detection and correction of configuration changes</li>
                <li><strong>Predictive maintenance</strong>: Proactive identification of potential issues</li>
            </ul>
        </section>

        <section>
            <h2>Getting Started: Your Own Desktop Automation Journey</h2>
            
            <p>
                Ready to rework your own desktop setup process? Here's a practical roadmap
                for implementing infrastructure-as-code for your development environment.
            </p>

            <h3>Phase 1: Assessment and Planning</h3>
            
            <ol>
                <li><strong>Audit your current setup</strong>: Document all installed packages, configurations, and customisations</li>
                <li><strong>Identify pain points</strong>: What takes the most time during fresh installations?</li>
                <li><strong>Prioritise automation</strong>: Start with high-impact, low-risk configurations</li>
                <li><strong>Choose your tools</strong>: Ansible for most use cases, but consider alternatives like <a href="https://puppet.com/" target="_blank" rel="noopener">Puppet</a> or <a href="https://www.chef.io/" target="_blank" rel="noopener">Chef</a></li>
            </ol>

            <h3>Phase 2: Basic Implementation</h3>
            
            <ol>
                <li><strong>Set up version control</strong>: Create a GitHub repository for your automation</li>
                <li><strong>Start with packages</strong>: Automate installation of essential development tools</li>
                <li><strong>Add basic configuration</strong>: Git settings, shell aliases, environment variables</li>
                <li><strong>Test thoroughly</strong>: Use virtual machines to verify your automation works</li>
            </ol>

            <h3>Phase 3: Advanced Features</h3>
            
            <ol>
                <li><strong>Modularise your code</strong>: Break large playbooks into focused, reusable roles</li>
                <li><strong>Add conditional logic</strong>: Handle different operating systems or user preferences</li>
                <li><strong>Implement security practices</strong>: SSH key management, encryption, secure defaults</li>
                <li><strong>Create documentation</strong>: Help others (including future you) understand and extend the automation</li>
            </ol>

            <h3>Phase 4: Team and Community</h3>
            
            <ol>
                <li><strong>Share with your team</strong>: Adapt your automation for team-specific needs</li>
                <li><strong>Contribute upstream</strong>: Submit improvements to community projects like fedora-desktop</li>
                <li><strong>Maintain and evolve</strong>: Keep your automation current as tools and practices change</li>
                <li><strong>Monitor and optimise</strong>: Track automation success rates and execution times</li>
            </ol>
        </section>

        <section>
            <h2>Conclusion: Treating the Desktop as Code</h2>
            
            <p>
                The <a href="https://github.com/LongTermSupport/fedora-desktop" target="_blank" rel="noopener">LongTermSupport/fedora-desktop</a> 
                repository is more than a collection of Ansible playbooks; it reflects
                a fundamental shift in how we think about personal computing environments. By applying
                infrastructure-as-code principles to desktop automation, it shows that the
                same engineering practices that revolutionised server management can do the same for
                personal productivity.
            </p>

            <p>
                What matters more than any specific tool or technique is the shift in mindset,
                from manual, artisanal configuration to systematic, reproducible automation. When
                your entire development environment becomes code, it becomes reliable, shareable, 
                and maintainable in ways that manual setup never could be.
            </p>

            <p>
                <a href="https://fedoraproject.org/" target="_blank" rel="noopener">Fedora</a>, 
                <a href="https://www.ansible.com/" target="_blank" rel="noopener">Ansible</a>, 
                <a href="https://cli.github.com/" target="_blank" rel="noopener">GitHub CLI</a>, 
                and the broader open source ecosystem provide the building blocks, but the real 
                innovation happens when developers embrace the philosophy and adapt it to their 
                unique needs.
            </p>

            <p>
                Whether you're a solo developer tired of manual setup drudgery, a team lead
                wanting consistent development environments, or someone trying to
                streamline onboarding, the patterns used in the fedora-desktop repository
                give you a solid foundation to build on. Declarative, version-controlled, automated
                setup is available now, for anyone willing to treat their desktop as code.
            </p>

            <p>
                Start small, iterate frequently, and remember: every manual configuration step 
                you automate is a gift to your future self. Your 3 AM disaster recovery self 
                will thank you.
            </p>
        </section>

        <section>
            <h3>Additional Resources</h3>
            <ul>
                <li><a href="https://github.com/LongTermSupport/fedora-desktop" target="_blank" rel="noopener">LongTermSupport/fedora-desktop Repository</a> - The main repository discussed in this article</li>
                <li><a href="https://docs.ansible.com/ansible/latest/index.html" target="_blank" rel="noopener">Ansible Documentation</a> - Official Ansible learning resources</li>
                <li><a href="https://docs.fedoraproject.org/" target="_blank" rel="noopener">Fedora Documentation</a> - Official Fedora user and administrator guides</li>
                <li><a href="https://cli.github.com/manual/" target="_blank" rel="noopener">GitHub CLI Manual</a> - Complete GitHub CLI command reference</li>
                <li><a href="https://galaxy.ansible.com/" target="_blank" rel="noopener">Ansible Galaxy</a> - Community hub for Ansible roles and collections</li>
                <li><a href="https://www.redhat.com/en/topics/automation/what-is-infrastructure-as-code-iac" target="_blank" rel="noopener">Infrastructure as Code Best Practices</a> - Red Hat's IaC guidance</li>
                <li><a href="https://fedoraproject.org/wiki/Changes/ChangesinFedora42" target="_blank" rel="noopener">Fedora 42 Changes</a> - What's new in the latest Fedora release</li>
            </ul>
        </section>
    `,
  },
  // Migrating: high-performance-php.ejs
  {
    id: 'high-performance-php',
    title: 'High-Performance PHP: Optimisation Strategies',
    description:
      'OPcache tuning, connection pooling, multi-level caching and async job queues for PHP applications under real load',
    date: '2024-12-28',
    category: CATEGORIES.php.id,
    heroImage: {
      src: '/images/high-performance-php/hero.webp',
      alt: 'A black-and-white photograph of a large vertical steam turbine-generator unit, dense with piping, gauges, and a motor coupling',
      ogImage: '/images/high-performance-php/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:GENERAL_VIEW_OF_TURBINE_-3_-_Georgetown_Steam_Plant,_South_Warsaw_Street,_King_County_Airport,_Seattle,_King_County,_WA_HAER_WASH,17-SEAT,2-14.tif',
    },
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    content: `
<section class="intro">
<p class="lead">Proven techniques for optimising PHP applications to handle high-turnover, high-complexity scenarios.</p>
<p><a href="https://www.php.net/" target="_blank" rel="noopener">PHP</a> has a reputation for being slow, but that's largely outdated. Modern <a href="https://www.php.net/releases/8.3/en.php" target="_blank" rel="noopener">PHP 8.3+</a> with proper optimisation can handle thousands of requests per second. The key is knowing where to optimise and how to measure the impact of your changes.</p>
<p>These techniques come from optimising PHP applications under real production load. Here are the ones that deliver measurable performance gains.</p>
</section>
<section>
<h2>Performance Measurement Foundation</h2>
<h3>Profiling Tools</h3>
<p>You can't optimise what you don't measure. Install <a href="https://xdebug.org/" target="_blank" rel="noopener">Xdebug</a> for profiling:</p>
<pre><code class="language-bash">{{SNIPPET:high-performance-php/xdebug-config.ini}}</code></pre>
<p>Use with tools like <a href="https://github.com/KDE/kcachegrind" target="_blank" rel="noopener">KCacheGrind</a> or <a href="https://github.com/jokkedk/webgrind" target="_blank" rel="noopener">Webgrind</a> to visualise performance bottlenecks.</p>
<h3>Application Performance Monitoring</h3>
<p>A small timer registry, keyed by metric name, keeps instrumentation code out of the way of the logic it's measuring:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/performance-monitor.php}}</code></pre>
</section>
<section>
<h2>OPcache Optimisation</h2>
<p>OPcache is the most important PHP optimisation. It caches compiled bytecode, eliminating the need to parse and compile PHP files on every request.</p>
<h3>Production OPcache Configuration</h3>
<pre><code class="language-bash">{{SNIPPET:high-performance-php/opcache-config.ini}}</code></pre>
<h3>OPcache Monitoring</h3>
<pre><code class="language-php">{{SNIPPET:high-performance-php/opcache-monitor.php}}</code></pre>
</section>
<section>
<h2>Database Optimisation</h2>
<h3>Connection Pooling</h3>
<p>Database connections are expensive to establish, so reusing them matters. The acquire/release pattern below only helps within a single long-running PHP process - a queue worker, a CLI daemon, a Swoole/RoadRunner-style long-lived worker - because it holds state across calls in the same process. It is not how you pool connections for typical PHP-FPM web traffic, where each request gets a fresh process: there, the real answer is <code>PDO::ATTR_PERSISTENT</code> or an external pooler such as ProxySQL or PgBouncer.</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/database-connection-pool.php}}</code></pre>
<h3>Query Optimisation</h3>
<p>Logging slow queries as they happen gives you a rolling record of what to fix without adding overhead to the fast path:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/query-optimizer.php}}</code></pre>
</section>
<section>
<h2>Caching Strategies</h2>
<h3>Multi-Level Caching</h3>
<p>A two-tier cache checks an in-process store first (an array for the lifetime of the request, or APCu across requests on the same worker), and only falls back to a shared store like Redis on a miss. A hit at the second tier backfills the first tier, so the next lookup for the same key on that process is free:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/multilevel-cache-manager.php}}</code></pre>
<h3>Smart Cache Invalidation</h3>
<p>Tagging cache entries lets you invalidate a whole group of related keys at once, without tracking every individual key that needs clearing when the underlying data changes:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/tagged-cache-invalidator.php}}</code></pre>
</section>
<section>
<h2>Memory Management</h2>
<h3>Object Pooling</h3>
<p>Some objects are expensive enough to construct that reusing them is worthwhile - a database result buffer, a compiled template, a large value object. An object pool hands out instances via <code>acquire()</code> and only accepts them back via an explicit <code>release()</code>, so it can enforce a maximum outstanding count instead of constructing without limit:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/object-pool.php}}</code></pre>
<h3>HTTP Client Reuse</h3>
<p>The same pooling idea applies to outbound HTTP clients: constructing a fresh client per request discards the underlying TCP connection along with it. A factory that reuses a client per target host keeps the connection alive between calls instead of paying a new TCP and TLS handshake every time:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/http-client-factory.php}}</code></pre>
<h3>Memory Leak Detection</h3>
<p>In a long-running worker, a slow memory leak only shows up as a trend across many requests. Snapshotting <code>memory_get_usage()</code> at named checkpoints and diffing between them makes that trend visible:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/memory-profiler.php}}</code></pre>
</section>
<section>
<h2>Asynchronous Processing</h2>
<h3>Job Queue Implementation</h3>
<p>Moving slow work off the request/response cycle means pushing a serialised job onto a queue and processing it separately. The queue below pushes and pops jobs from a Redis list, keyed by job name against a small class map so it knows how to reconstruct each one. Jobs implement a shared abstract <code>Job</code> base (<code>handle()</code>, <code>getName()</code>, <code>getPayload()</code>, and a retry limit) so the queue can serialise and reconstruct any job the same way:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/redis-job-queue.php}}</code></pre>
<pre><code class="language-php">{{SNIPPET:high-performance-php/abstract-job.php}}</code></pre>
</section>
<section>
<h2>HTTP Performance Optimisation</h2>
<h3>Response Streaming</h3>
<p>Large responses don't need to sit fully in memory before the first byte goes out. Fetching rows with an unbuffered query and flushing output as each one is encoded keeps memory use flat regardless of result size:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/streaming-response.php}}</code></pre>
<h3>Response Compression</h3>
<p>Compressing the response body when the client supports it cuts transfer size at the cost of some CPU time. This middleware only compresses above a minimum size, since gzip has fixed overhead that makes it counterproductive on tiny payloads:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/compression-middleware.php}}</code></pre>
</section>
<section>
<h2>Code-Level Optimisations</h2>
<h3>Efficient Array Operations</h3>
<p>A handful of small habits add up across a codebase that runs the same code path millions of times: choosing the right existence check, preferring the built-in array functions where they read more clearly, and avoiding unnecessary array copies.</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/array-optimizer.php}}</code></pre>
<h3>String Optimisation</h3>
<p>The same applies to strings - using the function that says what it checks, and avoiding repeated concatenation in a loop in favour of building an array and joining it once.</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/string-optimizer.php}}</code></pre>
</section>
<section>
<h2>Load Testing and Benchmarking</h2>
<h3>Simple Benchmarking</h3>
<p>Before trusting an optimisation, measure it. A small harness that times a callable across many iterations and reports the spread is enough to tell whether a change actually helped:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/benchmark.php}}</code></pre>
</section>
<section>
<h2>Production Monitoring</h2>
<h3>Real-time Performance Dashboard</h3>
<p>Pulling the metrics gathered by the monitors above into a single structured snapshot is what turns them into something a dashboard endpoint can actually return:</p>
<pre><code class="language-php">{{SNIPPET:high-performance-php/performance-dashboard.php}}</code></pre>
</section>
<section>
<h2>Common Pitfalls</h2>
<ul>
<li><strong>Premature optimisation:</strong> Profile before optimising</li>
<li><strong>Over-caching:</strong> Cache invalidation complexity</li>
<li><strong>Ignoring memory limits:</strong> Monitor memory usage</li>
<li><strong>Database over-optimisation:</strong> Sometimes simple queries are better</li>
<li><strong>Micro-optimisations:</strong> Focus on significant bottlenecks</li>
</ul>
</section>
<footer class="article-footer">
<div class="article-tags">
<span class="tag">PHP</span>
<span class="tag">Performance</span>
<span class="tag">Optimisation</span>
<span class="tag">OPcache</span>
<span class="tag">Scalability</span>
</div>
<div class="article-nav">
<a href="/articles" class="back-link">← Back to Articles</a>
</div>
</footer>
    `,
  },
  // Migrating: legacy-php-modernization.ejs
  {
    id: 'legacy-php-modernization',
    title: 'Managing Legacy PHP: From Technical Debt to Modern Architecture',
    description:
      'Strategies for modernising legacy PHP codebases and managing technical debt effectively',
    date: '2025-01-15',
    category: CATEGORIES.php.id,
    heroImage: {
      src: '/images/legacy-php-modernization/hero.webp',
      alt: 'A black-and-white photograph of a steel reinforcement plate bolted onto the weathered wooden bow of a historic schooner in dry dock, with a second vessel and the dry dock wooden staging structure visible behind it',
      ogImage: '/images/legacy-php-modernization/og.jpg',
      creditText: 'Image: National Park Service (HAER), public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Detail_of_forefoot_and_steel_bow_reinforcement,_port_side_-_Schooner_WAWONA,_1018_Valley_Street,_Seattle,_King_County,_WA_HAER_WASH,17-SEAT,10-19.tif',
    },
    readingTime: 14,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    register: 'formal',
    content: `
<section class="intro">
<p class="lead">Practical strategies for transforming legacy PHP codebases into maintainable, modern systems without breaking production.</p>
<p>Legacy PHP systems are everywhere. They're the backbone of countless businesses, running critical operations that can't afford downtime. But they're also riddled with technical debt, outdated patterns, and maintenance nightmares that slow down development and increase costs.</p>
<p>Years of wrestling with legacy PHP codebases have taught me that modernisation works best as a series of strategic, incremental improvements rather than a full rewrite, each one delivering immediate value whilst building toward a sustainable future.</p>
</section>
<section>
<h2>The Reality of Legacy PHP</h2>
<p>Most legacy PHP systems share common characteristics:</p>
<ul>
<li><strong>Mixed responsibilities:</strong> Database queries embedded in templates, business logic scattered throughout presentation layers</li>
<li><strong>Global state pollution:</strong> Heavy reliance on global variables, superglobals, and shared mutable state</li>
<li><strong>Inconsistent coding standards:</strong> Multiple developers over many years, each with different approaches</li>
<li><strong>Outdated dependencies:</strong> Old PHP versions, unmaintained libraries, security vulnerabilities</li>
<li><strong>No automated testing:</strong> Manual testing processes that slow down changes and increase risk</li>
</ul>
<p>The temptation is always to start fresh, but that's rarely the right answer. These systems work, they generate revenue, and they embody years of business logic that would be expensive to rebuild.</p>
</section>
<section>
<h2>The Modernisation Strategy</h2>
<h3>1. Establish a Safety Net</h3>
<p>Before making any changes, you need confidence that you won't break production. This means:</p>
<ul>
<li><strong>Comprehensive monitoring:</strong> Error logging, performance monitoring, user behaviour tracking</li>
<li><strong>Automated backups:</strong> Both database and file system, with tested restore procedures</li>
<li><strong>Staging environments:</strong> Production-like environments for testing changes</li>
<li><strong>Feature flags:</strong> Ability to roll back changes without deploying new code</li>
</ul>
<h3>2. Identify High-Value Targets</h3>
<p>Not all legacy code is created equal. Focus on areas that will give you the biggest impact:</p>
<ul>
<li><strong>Performance bottlenecks:</strong> Slow queries, inefficient algorithms, resource-intensive operations</li>
<li><strong>Security vulnerabilities:</strong> SQL injection, XSS vulnerabilities, authentication issues</li>
<li><strong>Frequently changed code:</strong> Areas where developers spend the most time</li>
<li><strong>Business-critical functions:</strong> Core revenue-generating features</li>
</ul>
<h3>3. Implement the Strangler Fig Pattern</h3>
<p>This pattern allows you to gradually replace old code with new code by routing requests through a facade:</p>
<pre><code class="language-php">{{SNIPPET:legacy-php-modernization/strangler-fig-service.php}}</code></pre>
</section>
<section>
<h2>Practical Modernisation Techniques</h2>
<h3>Dependency Injection</h3>
<p>Replace global state with explicit dependencies:</p>
<pre><code class="language-php">{{SNIPPET:legacy-php-modernization/legacy-user-repository.php}}</code></pre>
<h3>Extract Service Classes</h3>
<p>Move business logic out of controllers and into dedicated service classes:</p>
<pre><code class="language-php">{{SNIPPET:legacy-php-modernization/order-service.php}}</code></pre>
<h3>Implement Automated Testing</h3>
<p>Start with integration tests for critical paths, then add unit tests as you refactor:</p>
<pre><code class="language-php">{{SNIPPET:legacy-php-modernization/order-service-test.php}}</code></pre>
</section>
<section>
<h2>Managing the Transition</h2>
<h3>Team Buy-in</h3>
<p>Modernisation efforts fail without team support. Make sure everyone understands:</p>
<ul>
<li>The business case for modernisation</li>
<li>How changes will improve their daily work</li>
<li>The incremental approach that minimises risk</li>
<li>Success metrics and how progress will be measured</li>
</ul>
<h3>Documentation and Knowledge Transfer</h3>
<p>Legacy systems often have tribal knowledge. Document:</p>
<ul>
<li>Business rules embedded in code</li>
<li>Integration points and data flows</li>
<li>Deployment procedures, environment setup, and common troubleshooting scenarios</li>
</ul>
</section>
<section>
<h2>Common Pitfalls to Avoid</h2>
<ul>
<li><strong>Big bang rewrites:</strong> They rarely work and often fail spectacularly</li>
<li><strong>Perfectionism:</strong> Don't let perfect be the enemy of good</li>
<li><strong>Ignoring performance:</strong> Modern doesn't always mean faster</li>
<li><strong>Over-engineering:</strong> Solve today's problems, not imaginary future ones</li>
<li><strong>Neglecting deployment:</strong> Modernise your deployment process alongside your code</li>
</ul>
</section>
<section>
<h2>Measuring Success</h2>
<p>Track metrics that matter to both developers and business stakeholders:</p>
<ul>
<li><strong>Code quality:</strong> Test coverage, code complexity, technical debt ratio</li>
<li><strong>Performance:</strong> Page load times, database query performance, memory usage</li>
<li><strong>Developer productivity:</strong> Time to implement features, deployment frequency</li>
<li><strong>Business impact:</strong> Bug reports, customer satisfaction, revenue impact</li>
</ul>
</section>
<section>
<h2>Playing the Long Game</h2>
<p>Legacy PHP modernisation is a marathon, not a sprint. The goal is a system that serves the business reliably, stays maintainable, and can evolve with changing requirements, rather than chasing the newest technology stack for its own sake.</p>
<p>Every legacy system got that way by being successful. Respect that success whilst building for the future.</p>
</section>
<footer class="article-footer">
<div class="article-nav">
<a href="/articles" class="back-link">← Back to Articles</a>
</div>
</footer>
    `,
  },
  // Migrating: llm-overfitting-trap.ejs
  {
    id: 'llm-overfitting-trap',
    title: 'The Overfitting Trap: When LLM Agents Fix One Thing and Break Everything Else',
    description:
      'A field guide to catching LLM agents when they hardcode a narrow fix instead of solving the actual bug, with prompt patterns and tests that force generic solutions.',
    date: '2025-08-26',
    category: CATEGORIES.ai.id,
    heroImage: {
      src: '/images/llm-overfitting-trap/hero.webp',
      alt: 'Refractory-lined runner-box moulds lined up on rail carts in a brass foundry casting shop, each cast to the same fixed shape',
      ogImage: '/images/llm-overfitting-trap/og.jpg',
      creditText: 'Image: National Park Service (HAER), public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:RUNNER_BOXES_IN_CASTING_SHOP_MAINTENANCE_AREA._THE_SECTION_OF_THE_PLANT_SHOWN_IN_THE_BACKGROUND_FORMERLY_HOUSED_SMALL_BRASS_AND_COPPER_FURNACES_THAT_POURED_APPROXIMATLEY_3500_LBS._HAER_NY,15-BUF,25-12.tif',
    },
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'LLMDevs',
    content: `
<div class="intro">
            <p class="lead">
                You report a bug to <a href="https://www.anthropic.com/claude-code" target="_blank" rel="noopener">Claude Code</a>: "The username validation fails for @john_doe." The AI agent quickly analyses the problem, writes a fix, and confidently reports success. Your specific test case now passes, but when you deploy to production, everything breaks - what happened? You've fallen into the overfitting trap, where LLM agents create hyper-specific solutions that solve one problem whilst breaking the entire system.
            </p>
        </div>

        <section>
            <h2>Understanding Overfitting in LLM Code Generation</h2>
            
            <p>
                In machine learning, <a href="https://en.wikipedia.org/wiki/Overfitting" target="_blank" rel="noopener">overfitting</a> occurs when a model learns training data too specifically, failing to generalise. In <a href="https://arxiv.org/html/2411.01414v1" target="_blank" rel="noopener">LLM code generation</a>, overfitting works differently: agents create solutions that handle only the exact reported scenario, abandoning the generic logic that made the original function useful.
            </p>
            
            <p>
                LLM agents tend to optimise for the most visible test case rather than understanding the underlying problem space. When you report "@john_doe doesn't validate properly," the agent doesn't think "how should I handle usernames with special characters?" Instead, it thinks "how do I make @john_doe specifically work?"
            </p>

            <h3>The Anatomy of Overfitting</h3>
            
            <p>Here's the conceptual pattern that leads to overfitting:</p>
            
            <pre><code class="language-python">{{SNIPPET:llm-overfitting-trap/overfitting-concept-pseudocode.txt}}
</code></pre>

            <p>
                This pattern appears across all programming contexts. The original function has broad utility with one edge case bug. The "overfitted fix" destroys that utility by hardcoding the specific case, whilst the proper fix maintains generality by addressing the root cause.
            </p>
        </section>

        <section>
            <h2>Real-World Example: The Username Validation Trap</h2>
            
            <p>
                Let's examine a common scenario. You have a generic username validation function that works well for most cases but fails when usernames start with special characters like "@":
            </p>
            
            <pre><code class="language-php">{{SNIPPET:llm-overfitting-trap/generic-function-with-bug.php}}
</code></pre>
            
            <p>
                This function works perfectly for standard usernames but fails the test case <code>@john_doe</code> because the regex doesn't account for the "@" prefix. A human developer would immediately understand this is a category problem: "how do we handle social media style username prefixes?"
            </p>

            <h3>The Overfitted "Fix"</h3>
            
            <p>
                But when an LLM agent encounters this bug, it often produces something like this:
            </p>
            
            <pre><code class="language-php">{{SNIPPET:llm-overfitting-trap/overfitted-fix.php}}
</code></pre>
            
            <p>
                This "solution" creates the illusion of success. The specific reported bug appears fixed, but the function has gone from having one edge case to being fundamentally broken. It only works for one hardcoded input whilst failing every other similar case.
            </p>

            <h3>The Proper Solution</h3>
            
            <p>
                A thoughtful fix addresses the underlying problem without sacrificing generality:
            </p>
            
            <pre><code class="language-php">{{SNIPPET:llm-overfitting-trap/proper-fix.php}}
</code></pre>
            
            <p>
                This solution maintains the original function's broad utility whilst elegantly handling the category of problems that includes the specific reported case. It's a true fix, not a hardcoded workaround.
            </p>
        </section>

        <section>
            <h2>Cross-Language Manifestations</h2>
            
            <p>
                Overfitting appears across all programming languages and contexts. Let's examine how this trap manifests in different environments.
            </p>

            <h3>JavaScript: The Calculation Function</h3>
            
            <pre><code class="language-javascript">{{SNIPPET:llm-overfitting-trap/javascript-overfitting.js}}
</code></pre>
            
            <p>
                In this <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank" rel="noopener">JavaScript</a> example, the overfitted fix creates a function that only works for one specific input combination. The proper fix addresses the general problem of calculating totals from objects with multiple numeric properties.
            </p>

            <h3>TypeScript: Service Layer Overfitting</h3>
            
            <pre><code class="language-typescript">{{SNIPPET:llm-overfitting-trap/testing-overfitting.ts}}
</code></pre>
            
            <p>
                <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a> examples show how type safety can mask overfitting problems. The overfitted solution appears type-correct but implements inconsistent business logic.
            </p>

            <h3>SQL: Database Query Overfitting</h3>
            
            <pre><code class="language-sql">{{SNIPPET:llm-overfitting-trap/database-overfitting.sql}}
</code></pre>
            
            <p>
                Even database queries suffer from overfitting: instead of addressing <a href="https://dev.mysql.com/doc/refman/8.0/en/working-with-null.html" target="_blank" rel="noopener">NULL value handling</a> generically, overfitted fixes hardcode specific data values, which makes queries fragile and unmaintainable.
            </p>

            <h3>Bash: Shell Script Overfitting</h3>
            
            <pre><code class="language-bash">{{SNIPPET:llm-overfitting-trap/bash-overfitting.sh}}
</code></pre>
            
            <p>
                <a href="https://www.gnu.org/software/bash/" target="_blank" rel="noopener">Bash scripting</a> overfitting is particularly dangerous because shell scripts often handle critical system operations. An overfitted fix might work for one specific directory structure, but it fails catastrophically in production environments.
            </p>
        </section>

        <section>
            <h2>The Human Common Sense Gap</h2>
            
            <p>
                Why do <a href="https://www.superannotate.com/blog/llm-agents" target="_blank" rel="noopener">LLM agents</a> fall into the overfitting trap so consistently? The answer lies in what we might call the "human common sense gap." This is the intuitive understanding that separates human problem-solving from pattern-based AI responses.
            </p>

            <h3>Missing Contextual Understanding</h3>
            
            <p>
                Humans approach debugging with implicit questions: "What category of problem is this? How many similar issues might exist? What would break if I change this?" <a href="https://arxiv.org/html/2508.00083v1" target="_blank" rel="noopener">LLM agents in 2025</a> lack this contextual reasoning framework. They optimise for the immediate problem without considering the broader implications.
            </p>

            <h3>Weighting the Visible Example Too Heavily</h3>

            <p>
                LLMs tend to weight the visible example you show them much more heavily than the underlying pattern it represents. When you provide a failing test case, the agent treats it as the primary specification rather than one example of a broader problem class.
            </p>

            <h3>Lack of Architectural Intuition</h3>
            
            <p>
                Experienced developers instinctively preserve architectural patterns; they understand that a generic validation function should remain generic, know that hardcoding breaks maintainability, and recognise that edge cases usually represent categories of problems. LLMs lack this architectural intuition.
            </p>
        </section>

        <section>
            <h2>Spotting Overfitting in LLM-Generated Code</h2>
            
            <p>
                Prevention starts with recognition. Here are the top warning signs that an LLM agent has overfitted a solution:
            </p>

            <h3>1. Hardcoded Values That Should Be Parameters</h3>
            
            <p>
                <strong>Red flag:</strong> <code>if ($username === '@john_doe')</code><br>
                <strong>Question to ask:</strong> Why this specific value? What about similar cases?
            </p>

            <h3>2. Fixes That Only Handle the Exact Test Case</h3>
            
            <p>
                <strong>Red flag:</strong> Solution only works for the precise input you provided<br>
                <strong>Test:</strong> Try variations of the input (similar but not identical cases)
            </p>

            <h3>3. Removal of Generic Logic</h3>
            
            <p>
                <strong>Red flag:</strong> The agent deleted or bypassed the original logic entirely<br>
                <strong>Question to ask:</strong> Was the original logic fundamentally wrong, or did it just need adjustment?
            </p>

            <h3>4. Special Case Proliferation</h3>
            
            <p>
                <strong>Red flag:</strong> Multiple specific conditions instead of one general rule<br>
                <strong>Example:</strong> <code>if (input === 'case1') ... else if (input === 'case2') ...</code>
            </p>

            <h3>5. Inconsistent Behaviour Patterns</h3>
            
            <p>
                <strong>Red flag:</strong> The function behaves differently for similar inputs<br>
                <strong>Test:</strong> Create a test suite with variations of your original case
            </p>
        </section>

        <section>
            <h2>Best Practices for Working with LLM Agents</h2>
            
            <p>
                You can significantly reduce overfitting by adjusting how you interact with <a href="https://www.anthropic.com/engineering/claude-code-best-practices" target="_blank" rel="noopener">Claude Code</a> and other LLM coding agents.
            </p>

            <h3>1. Provide Multiple Test Cases</h3>
            
            <p>
                Instead of reporting one failing case, provide several examples:
            </p>
            
            <div class="table-responsive">
                <table class="table">
                    <thead>
                        <tr>
                            <th>Poor Approach</th>
                            <th>Better Approach</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>"@john_doe fails validation"</td>
                            <td>"Usernames with @ prefix fail: @john_doe, @jane_smith, @user123"</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h3>2. Explicitly State the General Problem</h3>
            
            <p>
                Frame issues as categories, not specific instances:
            </p>
            
            <ul>
                <li><strong>Poor:</strong> "Fix the bug with @john_doe"</li>
                <li><strong>Better:</strong> "The validation function should handle usernames with social media prefixes like @, #, or similar characters"</li>
            </ul>

            <h3>3. Request Comprehensive Test Coverage</h3>
            
            <p>
                Ask the agent to generate test cases that verify the fix works broadly:
            </p>
            
            <blockquote>
                "Please create tests that verify this fix works for the general case, not just the specific example I provided. Include edge cases and variations."
            </blockquote>

            <h3>4. Use the "Think Hard" Keywords</h3>
            
            <p>
                Specific phrases are reported to trigger deeper reasoning in Claude Code: "think," "think hard," "think harder," and "ultrathink" progressively allocate more computational budget for analysis.
            </p>

            <h3>5. Demand Architectural Preservation</h3>
            
            <p>
                Explicitly instruct the agent to maintain the original function's scope and purpose:
            </p>
            
            <blockquote>
                "Fix the bug while preserving the function's ability to handle all valid username formats generically. Don't hardcode specific cases."
            </blockquote>

            <h3>6. Request Code Review</h3>
            
            <p>
                <a href="https://www.dzombak.com/blog/2025/08/getting-good-results-from-claude-code/" target="_blank" rel="noopener">Best practices suggest</a> asking the agent to review its own work:
            </p>
            
            <blockquote>
                "Review this fix for potential overfitting. Does it solve only my specific case or the broader category of problems?"
            </blockquote>
        </section>

        <section>
            <h2>Testing Strategies to Catch Overfitting</h2>
            
            <p>
                Implement systematic testing approaches to catch overfitted solutions before they reach production.
            </p>

            <h3>The Variation Test</h3>
            
            <p>
                Create test cases that are similar to your original bug report but not identical:
            </p>
            
            <ul>
                <li>Original case: <code>@john_doe</code></li>
                <li>Variations: <code>@jane_smith</code>, <code>#hashtag_user</code>, <code>@user_with_numbers123</code></li>
            </ul>

            <h3>The Boundary Test</h3>
            
            <p>
                Test the boundaries of the fix:
            </p>
            
            <ul>
                <li>What's the shortest valid input? (<code>@ab</code>)</li>
                <li>What's the longest? (<code>@very_long_username_here</code>)</li>
                <li>What invalid cases should still fail? (<code>@user!</code>, <code>@</code>)</li>
            </ul>

            <h3>The Regression Test</h3>
            
            <p>
                Verify that all previously working cases still work:
            </p>
            
            <ul>
                <li>Standard usernames without prefixes</li>
                <li>Edge cases that worked before the fix</li>
                <li>Error conditions that should still trigger</li>
            </ul>
        </section>

        <section>
            <h2>Advanced Techniques: Prompt Engineering Against Overfitting</h2>
            
            <p>
                Sophisticated prompt engineering can significantly reduce overfitting in LLM-generated solutions.
            </p>

            <h3>The Anti-Hardcoding Prompt</h3>
            
            <blockquote>
                "Fix this bug, but I will test your solution with many similar inputs that I haven't shown you. Your fix must work generically for the entire category of problems, not just this specific example. Avoid hardcoding any specific values."
            </blockquote>

            <h3>The Architecture Preservation Prompt</h3>
            
            <blockquote>
                "This function serves multiple use cases beyond the failing test case. Preserve its generic functionality while fixing the specific issue. If you need to change the core logic, explain why the original approach was fundamentally flawed."
            </blockquote>

            <h3>The Explainability Prompt</h3>
            
            <blockquote>
                "After fixing the bug, explain how your solution would handle five different similar scenarios I haven't mentioned. This will help me verify you've addressed the root cause rather than just the symptom."
            </blockquote>
        </section>

        <section>
            <h2>The Future of LLM Code Generation</h2>
            
            <p>
                The overfitting problem is driving innovation in <a href="https://github.com/codefuse-ai/Awesome-Code-LLM" target="_blank" rel="noopener">LLM code generation</a>. <a href="https://arxiv.org/html/2505.23953v1" target="_blank" rel="noopener">Emerging approaches in 2025</a> include:
            </p>

            <h3>Complexity-Aware Feedback Systems</h3>
            
            <p>
                New systems use <a href="https://openai.com/blog/gpt-4o/" target="_blank" rel="noopener">GPT-4o</a> to generate diverse test cases and identify when code fails. They analyse complexity metrics and iteratively improve solutions until they pass comprehensive test suites.
            </p>

            <h3>Adversarial Testing Integration</h3>
            
            <p>
                <a href="https://medium.com/@adnanmasood/code-generation-with-llms-practical-challenges-gotchas-and-nuances-7b51d394f588" target="_blank" rel="noopener">Advanced agents</a> now construct adversarial test cases for each possible program intention. This helps avoid overfitting by forcing consideration of edge cases during generation rather than after failure.
            </p>

            <h3>Self-Critique Mechanisms</h3>

            <p>
                <a href="https://arxiv.org/html/2407.06153v1" target="_blank" rel="noopener">Training-free iterative methods</a> enable LLMs to critique and correct their own generated code based on bug types and compiler feedback. Experimental results show up to 29.2% improvement in passing rates after two iterations.
            </p>
        </section>

        <section>
            <h2>Conclusion</h2>
            
            <p>
                The overfitting trap is easy to miss because it looks like success. When an agent "fixes" your specific bug by hardcoding the exact case you reported, it creates a dangerous illusion of progress in <a href="https://medium.com/google-cloud/building-software-in-2025-llms-agents-ai-and-a-real-world-workflow-85f809fe6b74" target="_blank" rel="noopener">LLM-assisted software development</a>. But it destroys the generic functionality that made your code valuable in the first place.
            </p>
            
            <p>
                Recognition is the first step toward prevention. Watch for hardcoded values, solutions that only handle exact test cases, and fixes that remove or bypass original logic rather than improving it. The warning signs are clear once you know what to look for.
            </p>
            
            <p>
                More importantly, adjust how you interact with LLM agents. Provide multiple examples. Frame problems as categories rather than specific instances. Explicitly request preservation of architectural patterns. Use prompt engineering techniques that force agents to consider the broader problem space rather than optimising for your specific demonstration.
            </p>
            
            <p>
                As <a href="https://www.anthropic.com/claude-code" target="_blank" rel="noopener">Claude Code</a> and similar tools become more sophisticated, the industry is developing better approaches to prevent overfitting. These include complexity-aware feedback, adversarial testing, and self-critique mechanisms. But until these advances mature, the responsibility lies with us as developers to recognise overfitting patterns and guide our AI assistants toward truly generic solutions.
            </p>
            
            <p>
                LLM agents stay useful once you account for this failure mode. Provide multiple test cases up front, frame bugs as categories rather than single instances, and ask the agent to justify its fix against cases you haven't shown it. That keeps the productivity gains without trading away the architectural integrity that makes the codebase maintainable.
            </p>

            <h3>Additional Resources</h3>
            <ul>
                <li><a href="https://www.anthropic.com/engineering/claude-code-best-practices" target="_blank" rel="noopener">Claude Code: Best practices for agentic coding</a> - Official guidelines from Anthropic</li>
                <li><a href="https://arxiv.org/html/2411.01414v1" target="_blank" rel="noopener">A Deep Dive Into Large Language Model Code Generation Mistakes</a> - Comprehensive research on LLM coding errors</li>
                <li><a href="https://github.com/codefuse-ai/Awesome-Code-LLM" target="_blank" rel="noopener">Awesome Code LLM Repository</a> - Curated resources for code generation research</li>
                <li><a href="https://simonwillison.net/2025/Mar/2/hallucinations-in-code/" target="_blank" rel="noopener">Hallucinations in code are the least dangerous form of LLM mistakes</a> - Critical analysis of AI coding risks</li>
            </ul>
        </section>
    `,
  },
  // Migrating: mocking-best-practices.ejs
  {
    id: 'mocking-best-practices',
    title: 'Mocking in Tests: Like Hot Sauce - A Little Goes a Long Way',
    description:
      'Learn when to mock and when not to mock in unit tests. Discover why over-mocking creates brittle, unmaintainable tests and how to write better tests with minimal mocking using TypeScript, Vitest, and PHPUnit.',
    date: '2025-07-30',
    category: CATEGORIES.php.id,
    heroImage: {
      src: '/images/mocking-best-practices/hero.webp',
      alt: 'A four-engine wind-tunnel test model, mounted from below in a full-scale tunnel, its wing and engine nacelles filling the frame edge to edge',
      ogImage: '/images/mocking-best-practices/og.jpg',
      creditText: 'Image: NASA Ames Research Center, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Four_Engine_USB_Model_in_the_40x80_foot_Wind_Tunnel_(AC74-2756).jpg',
    },
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    content: `
<div class="intro">
    <p class="lead">
        Mocking in unit tests is like hot sauce - a little bit enhances the flavour, but too much ruins the meal.
        Yet many developers drown their tests in mocks, creating brittle, unreadable test suites that break with 
        every refactor. Let's explore when to mock, when not to mock, and how to write maintainable tests that 
        actually test what matters.
    </p>
</div>

<section>
    <h2>The Hot Sauce Analogy</h2>
    <p>
        When you're cooking a great meal, you don't dump hot sauce on everything. A few drops on the right spots 
        enhance the flavours you've carefully built. Use too much, and you can't taste anything else. The same 
        principle applies to mocking in tests.
    </p>
    <p>
        Mocks should isolate your code from external dependencies - databases, APIs, file systems. They shouldn't 
        replace the very business logic you're trying to test. When your test setup has more mock configurations 
        than actual test logic, something's wrong.
    </p>
</section>

<section>
    <h2>What Mocking Is (And Isn't)</h2>
    <p>
        <strong>Mocking is:</strong> Creating fake implementations of dependencies to isolate the code under test 
        from external systems and side effects. It helps make tests fast, deterministic, and focused.
    </p>
    <p>
        <strong>Mocking isn't:</strong> a way to avoid testing your actual business logic, a substitute for proper
        dependency injection or good architecture, or something you should do to every single dependency.
    </p>
    
    <h3>When to Mock</h3>
    <ul>
        <li><strong>External systems:</strong> Databases, HTTP APIs, file systems, third-party services</li>
        <li><strong>Side effects:</strong> Logging, email sending, event publishing, notifications</li>
        <li><strong>Non-deterministic operations:</strong> Random number generation, current timestamps</li>
        <li><strong>Slow or expensive operations:</strong> Complex calculations, image processing</li>
    </ul>

    <h3>When NOT to Mock</h3>
    <ul>
        <li><strong>Business logic:</strong> The core functionality you're trying to test</li>
        <li><strong>Pure functions:</strong> Calculations, validations, transformations</li>
        <li><strong>Value objects:</strong> Simple data structures and <a href="https://martinfowler.com/eaaCatalog/dataTransferObject.html" target="_blank" rel="noopener">DTOs</a></li>
        <li><strong>Internal collaborators:</strong> Objects that are part of the same bounded context</li>
    </ul>
</section>

<section>
    <h2>The Problems with Over-Mocking</h2>
    
    <h3>1. Brittle Tests</h3>
    <p>
        When you mock everything, your tests become coupled to implementation details rather than behaviour.
        Change how a method is called internally, and tests break even though the external behaviour is identical.
    </p>

    <h3>2. Unclear Intent</h3>
    <p>
        Tests should clearly communicate what the code does. When most of your test is mock setup, it's hard
        to understand what behaviour is actually being verified.
    </p>

    <h3>3. False Confidence</h3>
    <p>
        Over-mocked tests can pass whilst the real system fails, because you're testing your mocks rather than your actual code.
    </p>

    <h3>4. Maintenance Nightmare</h3>
    <p>
        Every refactor requires updating dozens of mock expectations. Tests that should help you refactor 
        safely become obstacles to change.
    </p>
</section>

<section>
    <h2>Over-Mocking Example: The Horror Show</h2>
    <p>
        Here's an example of a test that's gone completely overboard with mocking. Notice how the test setup 
        is longer than the actual test, and how it's testing implementation details rather than behaviour:
    </p>

    <pre><code class="language-typescript">{{SNIPPET:mocking-best-practices/over-mocking-bad.ts}}
</code></pre>

    <p>
        This test is a maintenance nightmare - brittle, unclear, and full of false confidence - and the mock
        setup is so complex that it's hard to understand what the code actually does.
    </p>
</section>

<section>
    <h2>Minimal Mocking: The Right Way</h2>
    <p>
        Here's the same test rewritten with minimal mocking. Notice how we only mock external dependencies 
        and side effects, whilst using real implementations for business logic:
    </p>

    <pre><code class="language-typescript">{{SNIPPET:mocking-best-practices/minimal-mocking-good.ts}}
</code></pre>

    <p>
        This version is clearer, more maintainable, and actually tests the business logic. The mocks serve 
        their purpose - isolating external dependencies - without obscuring the intent.
    </p>
</section>

<section>
    <h2>PHPUnit: The Same Principles Apply</h2>
    <p>
        The over-mocking problem isn't unique to JavaScript. Here's how it manifests in PHP with PHPUnit, 
        and how to fix it:
    </p>

    <h3>The Wrong Way: Everything Mocked</h3>
    <pre><code class="language-php">{{SNIPPET:mocking-best-practices/phpunit-over-mocking-bad.php}}
</code></pre>

    <h3>The Right Way: Minimal Mocking</h3>
    <pre><code class="language-php">{{SNIPPET:mocking-best-practices/phpunit-proper-setup.php}}
</code></pre>

    <p>
        In modern PHP codebases, you'll often encounter <a href="https://www.php.net/manual/en/language.oop5.final.php" target="_blank" rel="noopener"><code>final</code> classes</a> that can't be
        mocked by default. Use the <a href="https://github.com/dg/bypass-finals" target="_blank" rel="noopener">dg/bypass-finals</a> 
        library when you genuinely need to mock final classes, but question whether you really need to.
    </p>
</section>

<section>
    <h2>PHP 8.1 Intersection Types for Mock Objects</h2>
    <p>
        PHP 8.1's <a href="https://www.php.net/manual/en/language.types.type-system.php#language.types.type-system.composite.intersection" target="_blank" rel="noopener">intersection types</a> provide flexible mock typing. However, creating custom <a href="https://www.php.net/manual/en/language.oop5.interfaces.php" target="_blank" rel="noopener">interfaces</a>
        that extend base functionality is often cleaner than complex intersection types:
    </p>

    <pre><code class="language-php">{{SNIPPET:mocking-best-practices/php84-intersection-types-mocks.php}}
</code></pre>

    <p>
        <strong>Key benefits of proper mock typing:</strong>
    </p>
    <ul>
        <li><strong>Type safety:</strong> Full IDE support and static analysis for both interface methods and PHPUnit mock methods</li>
        <li><strong>Clean setup:</strong> Centralised mock creation in <code>setUp()</code> with typed class properties</li>
        <li><strong>Better testing:</strong> Use <code>expects()</code> and <code>never()</code> for comprehensive behaviour verification</li>
        <li><strong>Interface-first design:</strong> Custom interfaces that extend base functionality are cleaner than complex intersections</li>
    </ul>
</section>

<section>
    <h2>Vitest Setup and Best Practices</h2>
    <p>
        With <a href="https://vitest.dev/guide/mocking" target="_blank" rel="noopener">Vitest</a>, proper mock cleanup and setup 
        patterns help maintain test reliability:
    </p>

    <pre><code class="language-typescript">{{SNIPPET:mocking-best-practices/vitest-setup.ts}}
</code></pre>

    <p>
        <strong>Key Vitest principles:</strong>
    </p>
    <ul>
        <li>Use <code>vi.clearAllMocks()</code> in <code>beforeEach</code> to prevent test pollution</li>
        <li>Use <code>vi.mock()</code> for complete module replacement</li>
        <li>Use <code>vi.spyOn()</code> for temporary method overrides</li>
        <li>Use TypeScript types with <code>vi.mocked()</code> for better IDE support</li>
    </ul>
</section>

<section>
    <h2>TypeScript Intersection Types for Mocks</h2>
    <p>
        TypeScript's <a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#intersection-types" target="_blank" rel="noopener">intersection types</a> work well for mock objects, combining mock functionality
        with <a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#interfaces" target="_blank" rel="noopener">interface typing</a> for full type safety:
    </p>

    <pre><code class="language-typescript">{{SNIPPET:mocking-best-practices/typescript-intersection-types-mocks.ts}}
</code></pre>

    <p>
        <strong>TypeScript intersection type approaches:</strong>
    </p>
    <ul>
        <li><strong><code>Mock&lt;any&gt; &amp; IInterface</code>:</strong> Combines Vitest mock functionality with interface typing</li>
        <li><strong><code>Mocked&lt;IInterface&gt;</code>:</strong> Modern Vitest utility type, imported as a type, with <a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank" rel="noopener">generics</a> (recommended)</li>
        <li><strong><code>satisfies IInterface</code>:</strong> TypeScript 4.9+ keyword for type validation without changing inference</li>
        <li><strong>Interface naming:</strong> TypeScript uses <code>I</code> prefix convention (Microsoft style)</li>
    </ul>
</section>

<section>
    <h2>Better Alternatives to Mocking</h2>
    <p>
        Sometimes the best mock is no mock at all. Here are architectural patterns that reduce the need for mocking:
    </p>

    <pre><code class="language-typescript">{{SNIPPET:mocking-best-practices/mock-alternatives.ts}}
</code></pre>

    <h3>Dependency Injection</h3>
    <p>
        Proper <a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank" rel="noopener">dependency injection</a> makes your code testable without complex mocking. Inject <a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#interfaces" target="_blank" rel="noopener">interfaces</a>, 
        not concrete implementations.
    </p>

    <h3>Test Doubles</h3>
    <p>
        Simple fake implementations often work better than mocks. They're easier to understand and maintain, 
        and they can evolve with your system.
    </p>

    <h3>Pure Functions</h3>
    <p>
        The more of your logic you can express as <a href="https://en.wikipedia.org/wiki/Pure_function" target="_blank" rel="noopener">pure functions</a>, the easier testing becomes. Pure functions 
        need no mocks - just call them and verify the output.
    </p>
</section>

<section>
    <h2>The Mocking Decision Tree</h2>
    <p>
        Use this decision tree to determine whether something should be mocked:
    </p>

    <pre><code class="language-typescript">{{SNIPPET:mocking-best-practices/mocking-guidelines.ts}}
</code></pre>

    <h3>Questions to Ask Yourself</h3>
    <ol>
        <li><strong>Is it an external system?</strong> (Database, API, file system) → Mock it</li>
        <li><strong>Does it have side effects?</strong> (Logging, email, events) → Mock it</li>
        <li><strong>Is it non-deterministic?</strong> (Random, time-based) → Mock it</li>
        <li><strong>Is it slow or expensive?</strong> → Consider mocking</li>
        <li><strong>Is it business logic I want to test?</strong> → Don't mock it</li>
    </ol>
</section>

<section>
    <h2>Mocking Anti-Patterns to Avoid</h2>
    
    <h3>The "Mock Everything" Pattern</h3>
    <p>
        Creating mocks for every dependency, including <a href="https://martinfowler.com/bliki/ValueObject.html" target="_blank" rel="noopener">value objects</a> and <a href="https://en.wikipedia.org/wiki/Pure_function" target="_blank" rel="noopener">pure functions</a>. This leads to 
        tests that break constantly and provide no real value.
    </p>

    <h3>The "Implementation Coupling" Pattern</h3>
    <p>
        Using <code>expect().toHaveBeenCalledWith()</code> for every mock interaction. This couples your 
        tests to implementation details instead of behaviour.
    </p>

    <h3>The "Mock Return Mock" Pattern</h3>
    <p>
        Mocks that return other mocks, creating complex nested mock hierarchies that are impossible to maintain.
    </p>

    <h3>The "Shared Mock State" Pattern</h3>
    <p>
        Reusing mock objects across tests without proper cleanup, leading to test interdependence and flaky tests.
    </p>
</section>

<section>
    <h2>Testing in Production: Real-World Guidelines</h2>
    
    <h3>The 80/20 Rule</h3>
    <p>
        The general wisdom is that in a well-architected system, somewhere around 80% of your business logic
        should be testable without mocks, with the remaining 20% or so covering external integrations that
        genuinely need mocking.
    </p>

    <h3>Mock at the Boundaries</h3>
    <p>
        Mock at the edges of your system, where your code talks to external services, and keep the internal
        domain logic mock-free.
    </p>

    <h3>Integration Tests for Glue Code</h3>
    <p>
        Use integration tests to verify that your mocked components actually work together. Unit tests 
        with mocks verify individual components; integration tests verify the whole system.
    </p>
</section>

<section>
    <h2>Modern Testing Tools and Frameworks</h2>
    
    <h3>TypeScript with Vitest (2025)</h3>
    <p>
        <a href="https://vitest.dev/" target="_blank" rel="noopener">Vitest</a> provides excellent TypeScript support 
        and fast test execution. Unlike Jest, it doesn't auto-mock modules, forcing you to be intentional 
        about what you mock.
    </p>

    <h3>PHP with PHPUnit 11+</h3>
    <p>
        Modern <a href="https://phpunit.de/" target="_blank" rel="noopener">PHPUnit</a> versions work well with PHP 8.4's 
        <a href="https://www.php.net/manual/en/language.types.php" target="_blank" rel="noopener">type system</a> and provide better mock object APIs. Consider using 
        <a href="https://github.com/mockery/mockery" target="_blank" rel="noopener">Mockery</a> for more expressive mock syntax.
    </p>
</section>

<section>
    <h2>Signs Your Tests Need Less Mock</h2>
    <p>
        Watch for these warning signs that indicate over-mocking:
    </p>

    <ul>
        <li><strong>Mock setup is longer than the actual test</strong> - You're probably mocking too much</li>
        <li><strong>Tests break when you refactor internal implementation</strong> - Tests are coupled to implementation</li>
        <li><strong>You can't understand what the code does by reading the test</strong> - Too many mocks obscure intent</li>
        <li><strong>Adding a new parameter breaks 20 tests</strong> - Over-mocked tests are brittle</li>
        <li><strong>Mocks return other mocks</strong> - Your object graph is too complex</li>
        <li><strong>You spend more time fixing tests than writing features</strong> - Technical debt from bad mocking</li>
    </ul>
</section>

<section>
    <h2>Conclusion: The Hot Sauce Test</h2>
    <p>
        Before you add a mock to your test, ask yourself: "Is this mock like a drop of hot sauce that enhances 
        the test, or am I drowning my test in mocks until I can't taste the actual logic anymore?"
    </p>

    <h3>The Hot Sauce Checklist</h3>
    <ul>
        <li><strong>Mock external dependencies and side effects</strong> - databases, APIs, logging, email</li>
        <li><strong>Don't mock business logic</strong> - test the real implementations</li>
        <li><strong>Use dependency injection</strong> - makes testing easier without complex mocks</li>
        <li><strong>Prefer test doubles over complex mocks</strong> - simpler and more maintainable</li>
        <li><strong>Focus on behaviour, not implementation</strong> - test what the code does, not how</li>
        <li><strong>If your test is mostly mocks, reconsider your architecture</strong> - the problem might be design, not testing</li>
    </ul>

    <p>
        Remember: good tests should help you refactor with confidence, and if your tests break every time you
        change internal implementation details, you're testing implementation rather than behaviour. Use mocks
        like hot sauce: sparingly, purposefully, and only where they truly add value.
    </p>
</section>

<section>
    <h2>Further Reading</h2>
    <ul>
        <li><a href="https://vitest.dev/guide/mocking" target="_blank" rel="noopener">Vitest Mocking Guide</a> - Official documentation with TypeScript examples</li>
        <li><a href="https://docs.phpunit.de/en/11.0/test-doubles.html" target="_blank" rel="noopener">PHPUnit Test Doubles</a> - Comprehensive guide to mocking in PHP</li>
        <li><a href="https://martinfowler.com/articles/mocksArentStubs.html" target="_blank" rel="noopener">Mocks Aren't Stubs</a> - Martin Fowler's classic explanation of test doubles</li>
        <li><a href="https://github.com/mockery/mockery" target="_blank" rel="noopener">Mockery</a> - Expressive mocking framework for PHP</li>
        <li><a href="https://github.com/dg/bypass-finals" target="_blank" rel="noopener">Bypass Finals</a> - Tool for mocking final classes in PHP</li>
    </ul>
</section>
    `,
  },
  // Migrating: mysql-legacy-to-modern-upgrade.ejs
  {
    id: 'mysql-legacy-to-modern-upgrade',
    title: 'Upgrading Legacy MySQL: From MyISAM to Modern MySQL 8.4',
    description:
      'A practical walkthrough for engineers maintaining pre-2010 MySQL schemas: six concrete failure scenarios MyISAM allows, and the transactions, constraints, and locking MySQL 8.4 and InnoDB use to close them.',
    date: '2025-08-18',
    category: CATEGORIES.database.id,
    heroImage: {
      src: '/images/mysql-legacy-to-modern-upgrade/hero.webp',
      alt: 'A historic walk-in bank vault door photographed square-on, its diagonal bolt-throw bars crossing over a central combination wheel',
      ogImage: '/images/mysql-legacy-to-modern-upgrade/og.jpg',
      creditText: 'Image: National Park Service (HABS), public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:PSFS_Building,_Walnut_and_Seventh_Streets,_Philadelphia,_Philadelphia_County,_PA_HABS_PA-6663-21.tif',
    },
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'Database',
    register: 'formal',
    content: `
<div class="intro">
            <p class="lead">Legacy MySQL databases built on MyISAM with implied foreign key relationships lack fundamental capabilities you'd expect in modern database systems. This guide shows you how to upgrade to <a href="https://dev.mysql.com/doc/refman/8.4/en/" target="_blank" rel="noopener">MySQL 8.4 LTS</a> with <a href="https://dev.mysql.com/doc/refman/8.4/en/innodb-storage-engine.html" target="_blank" rel="noopener">InnoDB</a>, proper constraints, and modern features that didn't exist in the MySQL 4-5 era.</p>
        </div>

        <section>
            <h2>Executive Summary: Why Upgrade Legacy MySQL</h2>
            
            <p>Legacy MySQL databases running on <a href="https://dev.mysql.com/doc/refman/8.4/en/myisam-storage-engine.html" target="_blank" rel="noopener">MyISAM storage engine</a> with implied foreign key relationships pose substantial risks to modern businesses. These systems lack data integrity guarantees, transaction support, and modern security features.</p>

            <h3>Key Migration Benefits</h3>
            <ul>
                <li><strong>Data Integrity</strong>: ACID compliance and proper foreign key constraints prevent data corruption</li>
                <li><strong>Concurrent Access</strong>: Row-level locking instead of table-level locking</li>
                <li><strong>Crash Recovery</strong>: Automatic crash recovery without manual table repairs</li>
                <li><strong>Security</strong>: Transparent Data Encryption and role-based access control</li>
                <li><strong>Modern SQL</strong>: Window functions, CTEs, JSON support not available in MySQL 4-5</li>
            </ul>
        </section>

        <section>
            <h2>Understanding the Legacy Database Problem</h2>
            
            <h3>MyISAM Limitations</h3>
            <p><a href="https://dev.mysql.com/doc/refman/8.4/en/myisam-storage-engine.html" target="_blank" rel="noopener">MyISAM</a> was the default storage engine in MySQL 4 and 5.0, but has critical limitations:</p>

            <ul>
                <li><strong>Table-Level Locking</strong>: Any write operation blocks the entire table</li>
                <li><strong>No Transaction Support</strong>: No rollback capability for failed operations</li>
                <li><strong>No Foreign Key Constraints</strong>: Referential integrity must be maintained by application code</li>
                <li><strong>Corruption Risk</strong>: Tables frequently corrupt during crashes, requiring manual repair</li>
                <li><strong>No Encryption</strong>: Data stored in plaintext on disk</li>
            </ul>

            <h3>Implied vs Explicit Foreign Keys</h3>
            <p>Legacy systems often use naming conventions to imply relationships rather than database constraints:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/implied-foreign-key.sql}}</code></pre>
        </section>

        <section>
            <h2>Real-World Data Corruption Scenarios and MySQL 8 Solutions</h2>
            
            <p>When you understand how data corruption happens in legacy systems, you'll see why MySQL 8's modern features are so important. These scenarios illustrate common failure patterns in production systems and how modern MySQL prevents them.</p>

            <h3>Scenario 1: Partial Updates and the Double-Charge Problem</h3>

            <h4>The Problem: Partial Updates Without Transactions</h4>
            <p>In a MyISAM-based e-commerce system, a customer purchase needs multiple table updates. When the server crashes mid-operation, customers get charged but orders aren't created:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/double-charge-legacy.sql}}</code></pre>

            <h4>The Solution: ACID Transactions in InnoDB</h4>
            <p>MySQL 8 with InnoDB ensures all operations succeed or all fail together:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/double-charge-innodb.sql}}</code></pre>

            <h3>Scenario 2: Orphaned Orders When Foreign Keys Are Missing</h3>

            <h4>The Problem: Data Integrity Without Constraints</h4>
            <p>Without foreign keys, deleting customers leaves orphaned orders. This causes reporting errors and legal compliance issues:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/orphaned-order-legacy.sql}}</code></pre>

            <h4>The Solution: Foreign Key Constraints</h4>
            <p>MySQL 8 prevents orphaned records through enforced relationships:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/orphaned-order-innodb.sql}}</code></pre>

            <h3>Scenario 3: Invalid Data Without Check Constraints</h3>

            <h4>The Problem: Business Rules Not Enforced</h4>
            <p>Application bugs or direct database access can insert invalid data that breaks business logic:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/invalid-price-legacy.sql}}</code></pre>

            <h4>The Solution: Check Constraints (MySQL 8.0.16+)</h4>
            <p>Database-level validation prevents invalid data no matter where it comes from:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/invalid-price-check-constraints.sql}}</code></pre>

            <h3>Scenario 4: Row-Level Locking and Inventory Races</h3>

            <h4>The Problem: Table-Level Locks Cause Overselling</h4>
            <p>MyISAM's table-level locking creates race conditions where inventory goes negative:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/inventory-race-legacy.sql}}</code></pre>

            <h4>The Solution: Row-Level Locking with InnoDB</h4>
            <p>MySQL 8's row-level locking prevents race conditions. Pessimistic locking takes an explicit row lock and branches on the value whilst holding it, which needs a stored procedure rather than bare SQL:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/inventory-race-pessimistic.sql}}</code></pre>

            <p>Optimistic locking skips the explicit lock and instead makes the availability check part of the <code>UPDATE</code>'s <code>WHERE</code> clause, then checks whether it actually changed a row:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/inventory-race-optimistic.sql}}</code></pre>

            <h3>Scenario 5: Crash Recovery Without Manual Repair</h3>

            <h4>The Problem: MyISAM Corruption After Crash</h4>
            <p>Server crashes leave MyISAM tables corrupted. You have to repair them manually and often lose data:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/crash-recovery-legacy.sql}}</code></pre>

            <h4>The Solution: InnoDB Automatic Crash Recovery</h4>
            <p>MySQL 8 automatically recovers from crashes without data loss:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/crash-recovery-innodb.sql}}</code></pre>

            <h3>Scenario 6: Referential Actions Replace Manual Cascade Updates</h3>

            <h4>The Problem: Manual Cascade Updates Miss Records</h4>
            <p>Without referential actions, updating primary keys means you have to manually update all related tables. This is error-prone:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/cascading-update-legacy.sql}}</code></pre>

            <h4>The Solution: Automatic Referential Actions</h4>
            <p>MySQL 8's CASCADE actions keep everything consistent across all tables:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/cascading-update-innodb.sql}}</code></pre>
        </section>

        <section>
            <h2>Pre-Migration Assessment</h2>
            
            <p>Before you migrate, check your database structure and find potential issues.</p>

            <h3>Inventory Storage Engines</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/check-storage-engines.sql}}</code></pre>

            <h3>Find Orphaned Records</h3>
            <p>Identify records that would violate foreign key constraints:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/find-orphaned-records.sql}}</code></pre>

            <h3>Detect Duplicate Keys</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/find-duplicate-keys.sql}}</code></pre>
        </section>

        <section>
            <h2>Data Cleanup Before Migration</h2>
            
            <p>Clean data is essential for successful migration. Fix integrity issues before you convert storage engines.</p>

            <h3>Remove Orphaned Records</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/remove-orphaned-records.sql}}</code></pre>

            <h3>Handle Duplicate Records</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/remove-duplicate-records.sql}}</code></pre>

            <h3>Fix Invalid Data Types</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/fix-invalid-dates.sql}}</code></pre>
        </section>

        <section>
            <h2>Converting MyISAM to InnoDB</h2>
            
            <p>You need to convert the storage engine carefully to avoid locking issues and keep data consistent.</p>

            <h3>Basic Conversion</h3>
            <p>Changing the storage engine is always a full table copy in InnoDB - there's no in-place way to do it. <code>ALGORITHM=INPLACE</code> isn't supported for an <code>ENGINE=</code> change; it fails with error 1846, "ALGORITHM=INPLACE is not supported... Try ALGORITHM=COPY." Expect the table to be locked for the duration:</p>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/convert-engine-basic.sql}}</code></pre>

            <p>For tables too large to lock during business hours, don't run this directly against production. <a href="https://docs.percona.com/percona-toolkit/pt-online-schema-change.html" target="_blank" rel="noopener">pt-online-schema-change</a> and <a href="https://github.com/github/gh-ost" target="_blank" rel="noopener">gh-ost</a> both perform the copy against a shadow table in the background and swap it in with only a brief lock at the end.</p>

            <h3>Batch Conversion Script</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/convert-engine-batch-script.sql}}</code></pre>

            <h3>Configure InnoDB Settings</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/innodb-settings.sql}}</code></pre>
        </section>

        <section>
            <h2>Implementing Foreign Key Constraints</h2>

            <p>After you convert to InnoDB, add explicit foreign key constraints to enforce referential integrity.</p>

            <h3>Add Foreign Keys with Cascading Rules</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/add-foreign-keys-cascade.sql}}</code></pre>

            <h3>Verify Foreign Key Constraints</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/verify-foreign-keys.sql}}</code></pre>
        </section>

        <section>
            <h2>MySQL 8.0+ Features for Legacy Databases</h2>
            
            <p>MySQL 8.0 introduced features that completely change what's possible compared to MySQL 4-5.</p>

            <h3>Common Table Expressions (CTEs)</h3>
            <p>You can replace complex nested subqueries with readable CTEs (MySQL 8.0+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/cte-example.sql}}</code></pre>

            <h3>Window Functions</h3>
            <p>Analytics that were impossible or needed complex self-joins in MySQL 4-5:</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/window-functions.sql}}</code></pre>

            <h3>JSON Data Type</h3>
            <p>You can store and query semi-structured data (MySQL 5.7+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/json-data-type.sql}}</code></pre>

            <h3>Check Constraints</h3>
            <p>Enforce business rules at the database level (MySQL 8.0.16+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/check-constraints-feature.sql}}</code></pre>

            <h3>Instant DDL Operations</h3>
            <p>Make schema changes without table locks (MySQL 8.0+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/instant-ddl.sql}}</code></pre>
        </section>

        <section>
            <h2>Performance Features in Modern MySQL</h2>
            
            <h3>Invisible Indexes</h3>
            <p>Test how removing an index affects performance without actually dropping it (MySQL 8.0+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/invisible-indexes.sql}}</code></pre>

            <h3>Descending Indexes</h3>
            <p>Optimise queries with DESC order (MySQL 8.0+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/descending-indexes.sql}}</code></pre>

            <h3>Histogram Statistics</h3>
            <p>Get better query optimisation for skewed data (MySQL 8.0+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/histogram-statistics.sql}}</code></pre>
        </section>

        <section>
            <h2>Security Enhancements</h2>

            <h3>Role-Based Access Control</h3>
            <p>Simplify permission management (MySQL 8.0+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/role-based-access-control.sql}}</code></pre>

            <h3>Password Validation</h3>
            <p>Enforce strong passwords (MySQL 5.6+, better in 8.0):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/password-validation.sql}}</code></pre>

            <h3>Transparent Data Encryption</h3>
            <p>Encrypt data at rest (InnoDB, MySQL 5.7+):</p>

            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/transparent-data-encryption.sql}}</code></pre>
        </section>

        <section>
            <h2>Migration Validation</h2>
            
            <p>After migration, make sure all changes worked.</p>

            <h3>Verify Storage Engines</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/verify-storage-engines.sql}}</code></pre>

            <h3>Check Foreign Key Integrity</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/check-foreign-key-integrity.sql}}</code></pre>

            <h3>Performance Comparison</h3>
            <pre><code class="language-sql">{{SNIPPET:mysql-legacy-to-modern-upgrade/performance-comparison.sql}}</code></pre>
        </section>

        <section>
            <h2>Conclusion: Modernising Your Database</h2>

            <p>Upgrading from MyISAM to InnoDB with modern MySQL 8.4 features turns a fragile legacy database into a secure, dependable one, removing data corruption risks through ACID compliance, enabling concurrent access through row-level locking, and providing modern SQL capabilities that were simply impossible in MySQL 4-5.</p>

            <p>The largest practical risk in any of this is the engine conversion itself. On a table of any real size, <code>ENGINE=InnoDB</code> is a blocking table copy rather than an in-place operation, so schedule it for a maintenance window or run it through <code>pt-online-schema-change</code> or <code>gh-ost</code> rather than firing it at a live production table.</p>
        </section>
    `,
  },
  // Migrating: mysql-performance-php.ejs
  {
    id: 'mysql-performance-php',
    title: 'MySQL Performance Tuning for Complex PHP Applications',
    description:
      'A practical guide to MySQL configuration tuning, indexing, query rewriting, partitioning, and caching for PHP systems running complex, high-volume queries',
    date: '2024-12-20',
    category: CATEGORIES.database.id,
    heroImage: {
      src: '/images/mysql-performance-php/hero.webp',
      alt: 'A row of numbered mechanical levers on a 1910s railway interlocking machine, each one routing traffic to a specific track',
      ogImage: '/images/mysql-performance-php/og.jpg',
      creditText: 'Image: National Park Service (HAER), public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:INTERIOR,_MODEL_14_INTERLOCKING_MACHINE_-_Union_Junction_Interlocking_Tower,_Bounded_by_Federal,_Guilford,_Royal_...,_Baltimore,_Independent_City,_MD_HAER_MD,4-BALT,145-4.tif',
    },
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'Database',
    register: 'formal',
    content: `
<section class="intro">
<p class="lead">Database optimisation strategies specifically tailored for bespoke PHP systems with complex queries.</p>
<p>Database performance is often the biggest bottleneck in complex PHP applications. Whilst application-level optimisations are important, database tuning can deliver order-of-magnitude improvements in the right circumstances. This article covers proven strategies for optimising MySQL for high-complexity PHP systems.</p>
<p>From query optimisation to server configuration, these techniques are essential for managing high-performance databases with complex business logic.</p>
</section>
<section class="content">
<h2>MySQL Configuration Optimisation</h2>
<h3>Memory Configuration</h3>
<p>Proper memory allocation matters most for MySQL performance:</p>
<pre><code class="language-nginx">{{SNIPPET:mysql-performance-php/mysql-config.conf}}</code></pre>
<h3>InnoDB Optimisation</h3>
<pre><code class="language-nginx">{{SNIPPET:mysql-performance-php/innodb-config.conf}}</code></pre>
<h2>Query Optimisation Strategies</h2>
<h3>Index Design</h3>
<p>Proper indexing is fundamental to query performance:</p>
<pre><code class="language-sql">{{SNIPPET:mysql-performance-php/index-examples.sql}}</code></pre>
<h3>Query Rewriting</h3>
<p>Transform slow queries into efficient ones:</p>
<pre><code class="language-sql">{{SNIPPET:mysql-performance-php/query-examples.sql}}</code></pre>
<h2>PHP Database Optimisation</h2>
<h3>Connection Optimisation</h3>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/database-optimizer.php}}</code></pre>
<h3>Prepared Statement Optimisation</h3>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/prepared-statements.php}}</code></pre>
<h2>Complex Query Optimisation</h2>
<h3>Subquery Optimisation</h3>
<pre><code class="language-sql">{{SNIPPET:mysql-performance-php/subquery-optimization.sql}}</code></pre>
<h3>Aggregation Optimisation</h3>
<p>Combine multiple aggregate calculations into a single round trip instead of querying once per aggregate:</p>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/aggregation-queries.php}}</code></pre>
<p>The same principle applies to filtered, grouped aggregates: compute them in one query rather than iterating in PHP.</p>
<pre><code class="language-sql">{{SNIPPET:mysql-performance-php/aggregation-optimization.sql}}</code></pre>
<h2>Performance Monitoring</h2>
<h3>Slow Query Log Analysis</h3>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/slow-query-analyzer.php}}</code></pre>
<h3>Real-time Performance Monitoring</h3>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/mysql-monitor.php}}</code></pre>
<h2>Partitioning Strategies</h2>
<h3>Range Partitioning</h3>
<pre><code class="language-sql">{{SNIPPET:mysql-performance-php/partitioning-examples.sql}}</code></pre>
<h3>Partition Pruning</h3>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/partition-manager.php}}</code></pre>
<h2>Advanced Optimisation Techniques</h2>
<h3>Query Result Caching</h3>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/query-result-cache.php}}</code></pre>
<h3>Database Sharding</h3>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/database-shard-manager.php}}</code></pre>
<h2>Backup and Recovery Optimisation</h2>
<h3>Hot Backup Strategy</h3>
<pre><code class="language-php">{{SNIPPET:mysql-performance-php/hot-backup-manager.php}}</code></pre>
<h2>Common Performance Pitfalls</h2>
<ul>
<li><strong>Over-normalisation:</strong> Sometimes denormalisation improves performance</li>
<li><strong>Missing indexes:</strong> Every WHERE, JOIN, and ORDER BY clause should be indexed</li>
<li><strong>Too many indexes:</strong> Indexes slow down writes, find the right balance</li>
<li><strong>N+1 queries:</strong> Use JOINs or batch queries instead</li>
<li><strong>Large result sets:</strong> Use LIMIT and pagination</li>
<li><strong>Inefficient GROUP BY:</strong> Use covering indexes for grouped queries</li>
</ul>
</section>
<footer class="article-footer">
<div class="article-nav">
<a href="/articles" class="back-link">← Back to Articles</a>
</div>
</footer>
    `,
  },
  // Migrating: oclif-cli-framework-guide.ejs
  {
    id: 'oclif-cli-framework-guide',
    title: 'oclif: The Open CLI Framework - A Comprehensive Guide',
    description:
      'An in-depth exploration of oclif, the enterprise-grade CLI framework from Salesforce. Learn best practices, pros and cons, and compare with alternatives.',
    date: '2025-07-22',
    category: CATEGORIES.typescript.id,
    heroImage: {
      src: '/images/oclif-cli-framework-guide/hero.webp',
      alt: 'A wide, densely packed wall of labelled switch and instrument panels in a nuclear power station control room, each panel carrying its own named controls',
      ogImage: '/images/oclif-cli-framework-guide/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:MAIN_CONTROL_ROOM,_PANELS_WEST_OF_MAIN_CONTROL_AREA,_LOOKING_NORTH_(LOCATION_Q)_-_Shippingport_Atomic_Power_Station,_On_Ohio_River,_25_miles_Northwest_of_Pittsburgh,_Shippingport,_HAER_PA,4-SHIP,1-28.tif',
    },
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'typescript',
    register: 'formal',
    content: `
<div class="intro">
    <p class="lead">
        Building command-line interfaces that scale from simple scripts to enterprise-grade applications
        requires a solid foundation. <a href="https://oclif.io/" target="_blank" rel="noopener">Oclif</a>, the Open CLI Framework from <a href="https://www.salesforce.com/" target="_blank" rel="noopener">Salesforce</a>, provides exactly that -
        a battle-tested architecture behind some of the most widely used CLIs in the Node.js ecosystem.
    </p>
</div>

<section>
    <h2>What is oclif?</h2>
    <p>
        Oclif is an open-source framework for building command-line interfaces in <a href="https://nodejs.org/" target="_blank" rel="noopener">Node.js</a> and <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a>. 
        Originally developed by <a href="https://www.heroku.com/" target="_blank" rel="noopener">Heroku</a> and now maintained by Salesforce, it powers both the <a href="https://devcenter.heroku.com/articles/heroku-cli" target="_blank" rel="noopener">Heroku CLI</a> and 
        <a href="https://developer.salesforce.com/tools/salesforcecli" target="_blank" rel="noopener">Salesforce CLI</a>, handling millions of developer interactions every day. 
        The framework has reached version 4.5 as of Summer 2025, with mature ESM support and enhanced developer experience.
    </p>
    
    <p>
        The framework abstracts away common CLI development challenges, providing out-of-the-box solutions 
        for argument parsing, command structure, plugin systems, and auto-generated documentation.
    </p>
</section>

<section>
    <h2>Getting Started with oclif</h2>
    <p>
        Creating a new CLI with oclif takes just a few commands:
    </p>
    
    <pre><code class="language-bash">{{SNIPPET:oclif-cli-framework-guide/getting-started.sh}}
</code></pre>

    <p>
        This generates a fully-functional CLI with TypeScript support, testing infrastructure, and a 
        standard project structure ready for development.
    </p>
</section>

<section>
    <h2>Core Features and Architecture</h2>
    
    <h3>Command Structure</h3>
    <p>
        Commands in oclif extend from a base <a href="https://github.com/oclif/core/blob/main/src/command.ts" target="_blank" rel="noopener">Command class</a>, providing a consistent API. 
        With v4's full ESM support, you can use either CommonJS or ESM syntax:
    </p>
    
    <h4>CommonJS (Traditional)</h4>
    <pre><code class="language-javascript">{{SNIPPET:oclif-cli-framework-guide/hello-command.js}}
</code></pre>

    <h4>ESM (Modern - v4+)</h4>
    <pre><code class="language-javascript">{{SNIPPET:oclif-cli-framework-guide/hello-command-esm.js}}
</code></pre>

    <h3>Plugin Architecture</h3>
    <p>
        One of oclif's standout features is its plugin system, enabling modular CLI development:
    </p>
    
    <ul>
        <li>Share functionality across multiple CLIs</li>
        <li>Distribute commands as <a href="https://www.npmjs.com/" target="_blank" rel="noopener">npm packages</a></li>
        <li>Allow users to extend your CLI with custom commands</li>
        <li>Lazy-load commands for optimal performance</li>
    </ul>

    <h3>Performance Optimisations</h3>
    <p>
        Oclif prioritises speed with a minimal dependency footprint and lazy command
        loading. Large CLIs with hundreds of commands load as quickly as simple ones with a single command.
    </p>
</section>

<section>
    <h2>oclif v4: Current State (Summer 2025)</h2>
    <p>
        With the release of <a href="https://github.com/oclif/core/releases/tag/v4.0.0" target="_blank" rel="noopener">@oclif/core v4</a> in June 2024, 
        oclif has matured significantly. The latest version (4.5.1 as of July 2025) brings enhanced stability and developer experience improvements.
    </p>
    
    <h3>Major v4 Features</h3>
    <ul>
        <li><strong>Full ESM Support</strong> - Complete interoperability between CommonJS and ESM plugins</li>
        <li><strong>Configurable command discovery</strong> - Control how commands are loaded at runtime</li>
        <li><strong>Preparse hooks</strong> - Manipulate arguments before parsing</li>
        <li><strong>Performance tracking</strong> - Built-in <a href="https://oclif.io/docs/performance" target="_blank" rel="noopener">Performance class</a> for monitoring</li>
        <li><strong>Enhanced flag types</strong> - New <a href="https://oclif.io/docs/flags" target="_blank" rel="noopener">Flags.option</a> for preset value lists</li>
        <li><strong>Flag relationships</strong> - Define complex dependencies between flags</li>
        <li><strong>Runtime support</strong> - Now supports <a href="https://bun.sh/" target="_blank" rel="noopener">Bun</a> and <a href="https://github.com/esbuild-kit/tsx" target="_blank" rel="noopener">tsx</a> runtimes</li>
        <li><strong>Hidden aliases</strong> - Commands can now have undocumented aliases</li>
    </ul>

    <h3>Recent Updates (2025)</h3>
    <p>
        The framework maintains active development with regular releases:
    </p>
    <ul>
        <li><strong>v4.5.1</strong> (July 2025) - Error handling improvements</li>
        <li><strong>v4.5.0</strong> (July 2025) - Enhanced hook options with error and Command context</li>
        <li><strong>v4.4.0</strong> (June 2025) - Added tar flags configuration</li>
    </ul>

    <h3>Migration to v4</h3>
    <p>
        Migrating from v3 to v4 is generally straightforward. The oclif team has focused on maintaining backwards compatibility whilst adding new features.
        Key considerations:
    </p>
    <ul>
        <li>ESM plugins now have first-class support alongside CommonJS</li>
        <li>New runtime environments (Bun, tsx) are automatically detected</li>
        <li>Most v3 code works without modification in v4</li>
        <li>Check the <a href="https://github.com/oclif/core#migration-guides" target="_blank" rel="noopener">migration guides</a> for specific breaking changes</li>
    </ul>
</section>

<section>
    <h2>Best Practices</h2>
    
    <h3>Project Structure</h3>
    <pre><code class="language-plaintext">{{SNIPPET:oclif-cli-framework-guide/project-structure.txt}}
</code></pre>

    <h3>Design Principles</h3>
    <p>
        Follow these guidelines for building maintainable CLIs:
    </p>
    
    <ol>
        <li><strong>Consistency</strong> - Maintain uniform command syntax and output formats</li>
        <li><strong>Human-Readable Output</strong> - Design for clarity whilst supporting machine formats</li>
        <li><strong>Progressive Disclosure</strong> - Show essential info by default, details on request</li>
        <li><strong>Error Handling</strong> - Provide helpful error messages with recovery suggestions</li>
        <li><strong>Testing</strong> - Use oclif's built-in <a href="https://oclif.io/docs/testing" target="_blank" rel="noopener">testing utilities</a> for comprehensive coverage</li>
    </ol>

    <h3>TypeScript Configuration</h3>
    <p>
        Whilst oclif supports JavaScript, TypeScript provides better developer experience:
    </p>

    <pre><code class="language-typescript">{{SNIPPET:oclif-cli-framework-guide/typescript-example.ts}}
</code></pre>
</section>

<section>
    <h2>Pros and Cons</h2>
    
    <h3>Advantages</h3>
    <ul>
        <li><strong>Battle-tested</strong> - Powers Salesforce and Heroku CLIs</li>
        <li><strong>Minimal overhead</strong> - Fast startup with few dependencies</li>
        <li><strong>Plugin ecosystem</strong> - Extensible architecture for complex CLIs</li>
        <li><strong>Auto-documentation</strong> - Help text generated from command definitions</li>
        <li><strong>Testing utilities</strong> - Built-in helpers for unit and integration tests</li>
        <li><strong>Cross-platform</strong> - Works on Windows, macOS, and Linux</li>
        <li><strong>Active maintenance</strong> - Regular updates and renewed community focus</li>
        <li><strong>Improved documentation</strong> - Revitalised docs at <a href="https://oclif.io/" target="_blank" rel="noopener">oclif.io</a></li>
        <li><strong>Community engagement</strong> - Active <a href="https://github.com/oclif/core/discussions" target="_blank" rel="noopener">GitHub Discussions</a></li>
    </ul>

    <h3>Disadvantages</h3>
    <ul>
        <li><strong>TypeScript-heavy docs</strong> - JavaScript examples sometimes lacking</li>
        <li><strong>Learning curve</strong> - More complex than simple argument parsers</li>
        <li><strong>Opinionated structure</strong> - May feel restrictive for simple scripts</li>
        <li><strong>Integration challenges</strong> - Can be tricky with JavaScript-only libraries</li>
        <li><strong>Build complexity</strong> - Requires compilation step for TypeScript</li>
    </ul>
</section>

<section>
    <h2>Alternative CLI Frameworks</h2>
    
    <h3><a href="https://github.com/tj/commander.js" target="_blank" rel="noopener">Commander.js</a></h3>
    <p>
        The lightweight choice for simple CLIs:
    </p>
    <ul>
        <li>Minimal learning curve</li>
        <li>Small footprint</li>
        <li>Great for basic scripts</li>
        <li>Limited plugin support</li>
    </ul>

    <h3><a href="https://yargs.js.org/" target="_blank" rel="noopener">Yargs</a></h3>
    <p>
        Feature-rich with declarative syntax:
    </p>
    <ul>
        <li>Extensive argument parsing</li>
        <li>Built-in i18n support</li>
        <li>Larger bundle size than oclif</li>
        <li>Good middle ground option</li>
    </ul>

    <h3><a href="https://github.com/infinitered/gluegun" target="_blank" rel="noopener">Gluegun</a></h3>
    <p>
        High-level abstraction with batteries included:
    </p>
    <ul>
        <li>Built-in interactive prompts</li>
        <li>Command scaffolding</li>
        <li>Plugin management</li>
        <li>More opinionated than oclif</li>
    </ul>

    <h3><a href="https://cobra.dev/" target="_blank" rel="noopener">Cobra</a> (Go)</h3>
    <p>
        The standard for <a href="https://go.dev/" target="_blank" rel="noopener">Go</a> CLIs:
    </p>
    <ul>
        <li>Powers <a href="https://kubernetes.io/" target="_blank" rel="noopener">Kubernetes</a>, <a href="https://www.docker.com/" target="_blank" rel="noopener">Docker</a>, <a href="https://gohugo.io/" target="_blank" rel="noopener">Hugo</a></li>
        <li>Excellent performance</li>
        <li>Requires Go knowledge</li>
        <li>Best for system tools</li>
    </ul>
</section>

<section>
    <h2>When to Choose oclif</h2>
    
    <p>
        Oclif excels in these scenarios:
    </p>
    
    <ul>
        <li><strong>Enterprise CLIs</strong> - Need for plugins, updates, and telemetry</li>
        <li><strong>Multi-command tools</strong> - Complex CLIs with subcommands</li>
        <li><strong>Team projects</strong> - Consistent structure aids collaboration</li>
        <li><strong>Long-term maintenance</strong> - Active development and support</li>
        <li><strong>TypeScript projects</strong> - First-class TypeScript support</li>
    </ul>

    <p>
        Consider alternatives for:
    </p>
    
    <ul>
        <li>Simple scripts with few commands (use Commander)</li>
        <li>Quick prototypes (use Yargs)</li>
        <li>Interactive wizards (use Gluegun or <a href="https://github.com/vadimdemedes/ink" target="_blank" rel="noopener">Ink</a>)</li>
        <li>System utilities (use Cobra with Go)</li>
    </ul>
</section>

<section>
    <h2>Real-World Examples</h2>
    
    <p>
        Notable CLIs built with oclif:
    </p>
    
    <ul>
        <li><strong><a href="https://developer.salesforce.com/tools/salesforcecli" target="_blank" rel="noopener">Salesforce CLI</a></strong> - Enterprise development tools</li>
        <li><strong><a href="https://devcenter.heroku.com/articles/heroku-cli" target="_blank" rel="noopener">Heroku CLI</a></strong> - Cloud platform management</li>
        <li><strong><a href="https://www.twilio.com/docs/twilio-cli/quickstart" target="_blank" rel="noopener">Twilio CLI</a></strong> - Communication API tools</li>
        <li><strong><a href="https://shopify.dev/docs/themes/tools/cli" target="_blank" rel="noopener">Shopify CLI</a></strong> - E-commerce development</li>
    </ul>

    <p>
        These are all production CLIs, so they give a fair indication of how oclif copes with complex
        requirements and a mature plugin ecosystem outside a toy example.
    </p>
</section>

<section>
    <h2>Resources and Links</h2>
    
    <h3>Official Resources</h3>
    <ul>
        <li><a href="https://oclif.io/">Official Documentation</a> - Comprehensive guides and API reference</li>
        <li><a href="https://github.com/oclif/oclif">GitHub Repository</a> - Source code and issue tracking</li>
        <li><a href="https://github.com/oclif/core">Core Library</a> - Framework internals</li>
        <li><a href="https://oclif.io/docs">Getting Started Tutorial</a> - Step-by-step introduction</li>
    </ul>

    <h3>Community Resources</h3>
    <ul>
        <li><a href="https://github.com/oclif/core/discussions">GitHub Discussions</a> - Community Q&A</li>
        <li><a href="https://github.com/topics/oclif">oclif Projects on GitHub</a> - Example implementations</li>
        <li><a href="https://developer.salesforce.com/blogs/2022/10/building-a-cli-application-with-oclif">Salesforce Developer Blog</a> - Official tutorials</li>
    </ul>

    <h3>Tutorials and Articles</h3>
    <ul>
        <li><a href="https://www.joshcanhelp.com/oclif/">Building a CLI from Scratch with TypeScript</a></li>
        <li><a href="https://dev.to/alvinslee/how-to-build-a-simple-cli-with-oclif-2hjk">Simple CLI with oclif Tutorial</a></li>
        <li><a href="https://medium.com/the-z/getting-started-with-oclif-by-creating-a-todo-cli-app-b3a2649adbcf">Todo CLI App Example</a></li>
    </ul>
</section>

<section>
    <h2>Conclusion</h2>
    <p>
        Oclif has grown from a simple argument parser into a genuinely capable platform for building
        command-line tools, and its use in production by Salesforce and Heroku is a fair indicator that the
        architecture holds up in practice. The plugin system and active maintenance make it worth considering
        whenever a CLI is likely to grow past a handful of commands.
    </p>

    <p>
        Whilst the learning curve is steeper than picking up Commander or Yargs, that investment tends to
        pay off as a project grows: a plugin architecture and a consistent command structure matter a lot
        more once a CLI has outgrown what a single script would do.
    </p>
</section>
    `,
  },
  // Migrating: php-magic-constants-maintainable-logging.ejs
  {
    id: 'php-magic-constants-maintainable-logging',
    title: 'PHP Magic Constants for Maintainable Logging Systems',
    description:
      'Master PHP magic constants (__FILE__, __METHOD__, __CLASS__, etc.) to build contextual logging systems with Monolog and PSR-3 that automatically track execution flow and debugging information.',
    date: '2025-07-28',
    category: CATEGORIES.php.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    register: 'formal',
    heroImage: {
      src: '/images/php-magic-constants-maintainable-logging/hero.webp',
      alt: 'A black-and-white photograph of a cast metal "ASHTON VIADUCT 275" identification plaque bolted to a weathered stone bridge pier, alongside a utility box',
      ogImage: '/images/php-magic-constants-maintainable-logging/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Southwest_identification_plaque._View_east_-_Ashton_Viaduct,_State_Route_116_(Washington_Highway)_spanning_Blackstone_River,_Blackstone_Canal,_and_Providence_and_Worcester_HAER_RI,4-ASH.V,2-16.tif',
    },
    content: `
<div class="intro">
    <p class="lead">
        PHP magic constants provide automatic context about code execution location, enabling logging systems
        that track method calls, file locations, and class hierarchies without manual instrumentation. Combined 
        with <a href="https://github.com/Seldaek/monolog">Monolog</a> and 
        <a href="https://www.php-fig.org/psr/psr-3/">PSR-3 logging standards</a>, these constants create 
        maintainable logging architectures that scale with application complexity.
    </p>
</div>

<section>
    <h2>Understanding PHP Magic Constants</h2>
    <p>
        <a href="https://www.php.net/manual/en/language.constants.magic.php" target="_blank" rel="noopener">PHP</a> provides eight magic constants that automatically resolve to contextual values at compile time. 
        Unlike regular constants, these values change based on their location in the code, making them 
        invaluable for debugging and logging systems.
    </p>
    
    <h3>Complete Magic Constants Reference</h3>
    <p>
        Each magic constant serves specific debugging and logging purposes:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/basic-magic-constants.php}}
</code></pre>

    <p>
        <code>__NAMESPACE__</code> only makes sense once a file actually declares a namespace, so it's
        worth showing separately:
    </p>

    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/namespace-example.php}}
</code></pre>

    <div class="table-responsive">
        <table class="table">
            <thead>
                <tr>
                    <th>Constant</th>
                    <th>Returns</th>
                    <th>Primary Use Case</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td><code>__FILE__</code></td>
                    <td>Full file path</td>
                    <td>File-based error tracking</td>
                </tr>
                <tr>
                    <td><code>__DIR__</code></td>
                    <td>Directory path</td>
                    <td>Configuration and asset loading</td>
                </tr>
                <tr>
                    <td><code>__LINE__</code></td>
                    <td>Current line number</td>
                    <td>Precise error location</td>
                </tr>
                <tr>
                    <td><code>__FUNCTION__</code></td>
                    <td>Function name</td>
                    <td>Function-level logging</td>
                </tr>
                <tr>
                    <td><code>__CLASS__</code></td>
                    <td>Class name</td>
                    <td>Class-based log categorisation</td>
                </tr>
                <tr>
                    <td><code>__METHOD__</code></td>
                    <td>Class::method</td>
                    <td>Method execution tracking</td>
                </tr>
                <tr>
                    <td><code>__NAMESPACE__</code></td>
                    <td>Current namespace</td>
                    <td>Module-based logging</td>
                </tr>
                <tr>
                    <td><code>__TRAIT__</code></td>
                    <td>Trait name</td>
                    <td>Trait-specific debugging</td>
                </tr>
            </tbody>
        </table>
    </div>
</section>

<section>
    <h2>Monolog and PSR-3 Foundation</h2>
    <p>
        <a href="https://github.com/Seldaek/monolog">Monolog 3.x</a> provides the de facto logging 
        implementation for PHP applications, fully implementing the 
        <a href="https://www.php-fig.org/psr/psr-3/">PSR-3 Logger Interface</a>. The latest version 
        requires <a href="https://www.php.net/releases/8.1/en.php" target="_blank" rel="noopener">PHP 8.1+</a> and offers enhanced performance and type safety.
    </p>
    
    <h3>Modern Installation and Setup</h3>
    <p>
        Install <a href="https://github.com/Seldaek/monolog" target="_blank" rel="noopener">Monolog</a> 3.x with proper version constraints using <a href="https://getcomposer.org/" target="_blank" rel="noopener">Composer</a>:
    </p>
    
    <pre><code class="language-json">{{SNIPPET:php-magic-constants-maintainable-logging/composer.json}}
</code></pre>
    
    <p>
        The enhanced logger demonstrates magic constants integration with Monolog's processor system:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/enhanced-logger.php}}
</code></pre>
</section>

<section>
    <h2>Automatic Context with Logging Traits</h2>
    <p>
        <a href="https://www.php.net/manual/en/language.oop5.traits.php" target="_blank" rel="noopener">Traits</a> provide reusable logging functionality that automatically injects magic constants 
        into log context. This approach eliminates manual context building whilst maintaining
        consistency across application components.
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/logging-trait.php}}
</code></pre>
    
    <h3>Service Integration Pattern</h3>
    <p>
        Services using the logging trait automatically gain contextual logging without modifying 
        business logic:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/service-example.php}}
</code></pre>
</section>

<section>
    <h2>Advanced Context Processing</h2>
    <p>
        Custom <a href="https://github.com/Seldaek/monolog/blob/main/doc/02-handlers-formatters-processors.md#processors" target="_blank" rel="noopener">Monolog processors</a> enhance log records with magic constants and runtime information. 
        The <code>DebugContextProcessor</code> demonstrates sophisticated context enrichment:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/debug-context-processor.php}}
</code></pre>
    
    <h3>Processor Benefits</h3>
    <ul>
        <li><strong>Automatic Context</strong>: Magic constants added without manual intervention</li>
        <li><strong><a href="https://www.php.net/manual/en/function.debug-backtrace.php" target="_blank" rel="noopener">Stack Trace Analysis</a></strong>: Intelligent frame selection ignoring logging infrastructure</li>
        <li><strong>Runtime and Environment Data</strong>: <a href="https://www.php.net/manual/en/function.memory-get-usage.php" target="_blank" rel="noopener">Memory usage</a>, performance figures, PHP version, <a href="https://www.php.net/manual/en/function.php-sapi-name.php" target="_blank" rel="noopener">SAPI</a>, and system information in one place</li>
    </ul>
</section>

<section>
    <h2>Performance-Aware Logging</h2>
    <p>
        Performance logging uses magic constants for method timing and resource monitoring.
        The performance logger provides <a href="https://www.php.net/manual/en/function.microtime.php" target="_blank" rel="noopener">microtime-based timing</a> with automatic context:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/performance-logger.php}}
</code></pre>
    
    <h3>Performance Logging Patterns</h3>
    <p>
        Key patterns for production performance monitoring:
    </p>
    
    <ul>
        <li><strong>Method-Level Timing</strong>: Automatic timer identification using magic constants</li>
        <li><strong>Memory and Counter Tracking</strong>: Memory usage deltas for leak detection, plus operation counters with contextual information</li>
        <li><strong>Threshold-Based Alerting</strong>: Log level adjustment based on execution time</li>
    </ul>
</section>

<section>
    <h2>Centralised Logger Factory</h2>
    <p>
        A logger factory centralises configuration whilst providing specialised loggers for different
        application components. The factory pattern ensures consistent logging setup across services:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/logger-factory.php}}
</code></pre>
    
    <h3>Factory Architecture Benefits</h3>
    <ul>
        <li><strong>Channel Separation</strong>: Different log files for different concerns</li>
        <li><strong>Environment Adaptation</strong>: Debug vs production handler configuration</li>
        <li><strong>Processor Consistency</strong>: Uniform context enrichment across loggers</li>
        <li><strong>Handler Specialisation</strong>: Channel-specific output formatting and storage</li>
        <li><strong>Testability</strong>: Services depend on the <code>LoggerInterface</code> the factory returns, not on the factory itself</li>
    </ul>
</section>

<section>
    <h2>Real-World Implementation Examples</h2>
    <p>
        Practical examples demonstrate magic constants in production scenarios:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/usage-examples.php}}
</code></pre>

    <p>
        Example 5 above refers to a <code>NamespaceExample</code> class living in its own namespaced
        file, since a bracketed <code>namespace</code> block cannot share a file with un-namespaced
        global code:
    </p>

    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/namespace-aware-logging.php}}
</code></pre>

    <h3>Production Logging Strategies</h3>
    <p>
        Effective production logging balances information depth with performance impact:
    </p>
    
    <ul>
        <li><strong>Structured <a href="https://www.json.org/" target="_blank" rel="noopener">JSON</a></strong>: Machine-readable logs for analysis tools, with environment-appropriate verbosity levels</li>
        <li><strong>Context Minimisation</strong>: Essential information without overwhelming detail</li>
        <li><strong>Performance Monitoring</strong>: Resource usage tracking without overhead</li>
    </ul>
</section>

<section>
    <h2>Security and Sensitive Data Handling</h2>
    <p>
        Magic constants enhance security logging by providing precise context for security events. 
        However, careful consideration prevents sensitive data exposure:
    </p>
    
    <h3>Security Logging Best Practices</h3>
    <ul>
        <li><strong>Context Filtering</strong>: Remove passwords, tokens, and personal data from context</li>
        <li><strong>File Path Sanitisation</strong>: Avoid exposing internal directory structures in logs</li>
        <li><strong>Stack Trace Limits</strong>: Restrict stack trace depth to prevent information disclosure</li>
        <li><strong>Access Control</strong>: Secure log file permissions and access patterns</li>
    </ul>
    
    <h3>Sensitive Data Redaction</h3>
    <p>
        Implement context processors that sanitise sensitive data whilst preserving debugging value:
    </p>

    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/context-sanitisation.php}}
</code></pre>
</section>

<section>
    <h2>Testing and Debugging Strategies</h2>
    <p>
        Magic constants significantly improve debugging by providing automatic context without 
        manual instrumentation. Testing logging systems requires mock loggers and context validation:
    </p>
    
    <h3>Testing Approaches</h3>
    <ul>
        <li><strong>Mock Logger Testing</strong>: Verify log messages and context without file operations, and assert magic constants provide expected values, using <a href="https://phpunit.de/" target="_blank" rel="noopener">PHPUnit</a> and its <a href="https://phpunit.de/manual/current/en/appendixes.assertions.html" target="_blank" rel="noopener">assertions</a></li>
        <li><strong>Performance Testing</strong>: Measure logging overhead in high-throughput scenarios using <a href="https://github.com/phpbench/phpbench" target="_blank" rel="noopener">PHPBench</a></li>
        <li><strong>Integration Testing</strong>: Validate end-to-end logging pipeline functionality</li>
    </ul>
    
    <h3>Development Environment Configuration</h3>
    <p>
        Development logging should maximise debugging information whilst maintaining performance:
    </p>

    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/development-logger-config.php}}
</code></pre>
</section>

<section>
    <h2>Performance Considerations</h2>
    <p>
        <a href="https://www.php.net/manual/en/language.constants.magic.php" target="_blank" rel="noopener">Magic constants</a> are resolved at compile time, making them performant for logging. However, 
        context building and log processing can impact performance in high-throughput applications:
    </p>
    
    <h3>Optimisation Strategies</h3>
    <ul>
        <li><strong>Log Level Filtering</strong>: Disable debug logging in production</li>
        <li><strong>Lazy Context Building</strong>: Build expensive context only when needed</li>
        <li><strong>Asynchronous Logging</strong>: Queue log entries for background processing using <a href="https://github.com/bernardphp/bernard" target="_blank" rel="noopener">message queues</a></li>
        <li><strong>Selective Processing</strong>: Apply expensive processors only to specific channels</li>
        <li><strong>Batching</strong>: Group multiple log writes into a single handler flush rather than one write per record</li>
    </ul>
    
    <h3>Memory Management</h3>
    <p>
        Large context arrays and stack traces can consume significant memory. Implement 
        context limits and cleanup strategies:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-magic-constants-maintainable-logging/memory-conscious-logging.php}}
</code></pre>
</section>

<section>
    <h2>Integration with Modern PHP Ecosystems</h2>
    <p>
        Magic constants logging integrates cleanly with popular PHP frameworks and tools:
    </p>
    
    <h3>Framework Integration</h3>
    <ul>
        <li><strong><a href="https://symfony.com/" target="_blank" rel="noopener">Symfony</a></strong>: <a href="https://symfony.com/doc/current/logging.html" target="_blank" rel="noopener">Monolog integration</a> with kernel events and service container</li>
        <li><strong><a href="https://laravel.com/" target="_blank" rel="noopener">Laravel</a></strong>: <a href="https://laravel.com/docs/logging" target="_blank" rel="noopener">Built-in Monolog support</a> with channel-based configuration</li>
        <li><strong><a href="https://www.php-fig.org/psr/psr-11/" target="_blank" rel="noopener">PSR-11 Containers</a></strong>: Dependency injection for logger factory and services</li>
        <li><strong><a href="https://www.php-fig.org/psr/psr-15/" target="_blank" rel="noopener">PSR-15 Middleware</a></strong>: Request/response logging with automatic context</li>
    </ul>
    
    <h3>Monitoring and Observability</h3>
    <p>
        Structured logs with magic constants integrate with modern observability platforms:
    </p>
    
    <ul>
        <li><strong><a href="https://www.elastic.co/elastic-stack" target="_blank" rel="noopener">ELK Stack</a></strong>: <a href="https://www.elastic.co/elasticsearch/" target="_blank" rel="noopener">Elasticsearch</a> indexing of structured JSON logs</li>
        <li><strong><a href="https://grafana.com/" target="_blank" rel="noopener">Grafana</a></strong>: Visualisation of performance metrics from logs</li>
        <li><strong><a href="https://sentry.io/" target="_blank" rel="noopener">Sentry</a></strong>: Error tracking with rich context from magic constants</li>
        <li><strong><a href="https://www.datadoghq.com/" target="_blank" rel="noopener">DataDog</a></strong>: Application performance monitoring with log correlation</li>
    </ul>
</section>

<section>
    <h2>Future-Proofing and Evolution</h2>
    <p>
        As PHP evolves, magic constants remain stable whilst logging ecosystems advance.
        Consider these trends for long-term maintainability:
    </p>
    
    <h3>Emerging Patterns</h3>
    <ul>
        <li><strong><a href="https://opentelemetry.io/" target="_blank" rel="noopener">OpenTelemetry</a></strong>: Distributed tracing with magic constants context</li>
        <li><strong>Structured, Streamed Logging</strong>: Consistent JSON schemas across services, moving towards event-driven, real-time architectures</li>
        <li><strong>AI-Powered Log Analysis</strong>: <a href="https://www.elastic.co/guide/en/machine-learning/current/ml-overview.html" target="_blank" rel="noopener">Machine learning</a> on rich context data</li>
    </ul>
    
    <h3>Migration Strategies</h3>
    <p>
        Plan for logging system evolution whilst maintaining backward compatibility:
    </p>
    
    <ul>
        <li><strong>Version Compatibility</strong>: Maintain support for older Monolog versions</li>
        <li><strong>Context Schema Evolution</strong>: Additive changes to log context structure</li>
        <li><strong>Handler Migration</strong>: Gradual transition to new log storage systems, tracking the performance impact as you go</li>
    </ul>
</section>

<section>
    <h2>Conclusion</h2>
    <p>
        PHP magic constants transform logging from manual instrumentation to automatic context 
        enrichment. Combined with <a href="https://github.com/Seldaek/monolog" target="_blank" rel="noopener">Monolog's</a> processing capabilities and <a href="https://www.php-fig.org/psr/psr-3/" target="_blank" rel="noopener">PSR-3</a> standards, they 
        create maintainable logging architectures that scale with application complexity.
    </p>
    
    <p>
        The key to successful implementation lies in balancing information richness with performance
        impact, using structured logging for observability, and maintaining security awareness
        in context handling. Magic constants provide the foundation for logging systems that grow
        with your application whilst maintaining debugging effectiveness.
    </p>

    <p>
        As <a href="https://www.php.net/" target="_blank" rel="noopener">PHP</a> applications become more distributed and complex, automatic context generation through
        magic constants gets more useful for debugging and monitoring, not less. The patterns and
        implementations shown here should give you a reasonable foundation for production logging systems
        that support both development productivity and operational visibility.
    </p>
</section>
    `,
  },
  // Migrating: php-per-coding-style-evolution.ejs
  {
    id: 'php-per-coding-style-evolution',
    title: 'PHP PER: The Evolution Beyond PSR-12 Coding Standards',
    description:
      'Understanding PHP Evolving Recommendations (PER), how to enforce them with QA tools, and why PER Coding Style looks like the direction PHP standards are heading.',
    date: '2025-07-24',
    category: CATEGORIES.php.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    register: 'formal',
    heroImage: {
      src: '/images/php-per-coding-style-evolution/hero.webp',
      alt: 'A black-and-white 1919 photograph of a standards-laboratory exhibit room, with tables and a labelled pegboard wall displaying categorised aeronautic measuring instruments and calibration charts',
      ogImage: '/images/php-per-coding-style-evolution/og.jpg',
      creditText: 'Image: NIST, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Aeronautic_instrument_exhibit_of_thermometers,_inclinometers,_airspeed_meters,_and_pressure_gages_at_A.P.S.,_May_1919.jpg',
    },
    content: `
<div class="intro">
    <p class="lead">
        <a href="https://www.php-fig.org/per/" target="_blank" rel="noopener">PHP Evolving Recommendations (PER)</a>
        represent a fundamental shift in how the PHP community approaches standards. Unlike the static
        <a href="https://www.php-fig.org/psr/" target="_blank" rel="noopener">PSRs</a>, PERs are designed to evolve
        with the language, ensuring standards stay relevant as PHP continues its rapid modernisation.
    </p>
</div>

<section>
    <h2>What is PHP PER?</h2>
    <p>
        A PHP Evolving Recommendation is a "meta document accompanied by one or more artifacts that are set to 
        evolve over time with multiple releases." This evolutionary approach addresses a critical limitation of 
        the PSR system: once accepted, PSRs are essentially frozen in time.
    </p>
    
    <p>
        Currently, there's only one active PER: the 
        <a href="https://www.php-fig.org/per/coding-style/" target="_blank" rel="noopener">PER Coding Style 3.0</a>, 
        which extends, expands, and ultimately replaces 
        <a href="https://www.php-fig.org/psr/psr-12/" target="_blank" rel="noopener">PSR-12</a>. But the implications 
        go far beyond just coding style.
    </p>

    <h3>The Problem with Static Standards</h3>
    <p>
        When PSR-12 was accepted in 2019, <a href="https://www.php.net/releases/7.3/" target="_blank" rel="noopener">PHP 7.3</a> 
        was the latest version. Since then, we've seen:
    </p>
    <ul>
        <li><strong>Union Types</strong> (<a href="https://www.php.net/releases/8.0/" target="_blank" rel="noopener">PHP 8.0</a>)</li>
        <li><strong>Enumerations</strong> (<a href="https://www.php.net/releases/8.1/" target="_blank" rel="noopener">PHP 8.1</a>)</li>
        <li><strong>Readonly Properties</strong> (<a href="https://www.php.net/releases/8.1/" target="_blank" rel="noopener">PHP 8.1</a>)</li>
        <li><strong>Intersection Types</strong> (<a href="https://www.php.net/releases/8.1/" target="_blank" rel="noopener">PHP 8.1</a>)</li>
        <li><strong>Property Hooks</strong> (<a href="https://wiki.php.net/rfc/property-hooks" target="_blank" rel="noopener">PHP 8.4</a>)</li>
    </ul>
    
    <p>
        PSR-12 couldn't provide guidance for these features because they didn't exist. Enter PER: a living 
        standard that can adapt as PHP evolves.
    </p>
</section>

<section>
    <h2>PER vs PSR: The Key Differences</h2>
    
    <table>
        <thead>
            <tr>
                <th>Aspect</th>
                <th><a href="https://www.php-fig.org/psr/" target="_blank" rel="noopener">PSR (PHP Standard Recommendation)</a></th>
                <th><a href="https://www.php-fig.org/per/" target="_blank" rel="noopener">PER (PHP Evolving Recommendation)</a></th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><strong>Mutability</strong></td>
                <td>Immutable once accepted</td>
                <td>Designed to evolve with multiple releases</td>
            </tr>
            <tr>
                <td><strong>Update Process</strong></td>
                <td>Requires new PSR to supersede old one</td>
                <td>Can be updated through defined workflow</td>
            </tr>
            <tr>
                <td><strong>Scope</strong></td>
                <td>Fixed at time of acceptance</td>
                <td>Expands to cover new language features</td>
            </tr>
            <tr>
                <td><strong>Leadership</strong></td>
                <td>Working group disbanded after acceptance</td>
                <td>Maintains active Editor and Sponsor</td>
            </tr>
            <tr>
                <td><strong>Community Input</strong></td>
                <td>Limited to initial draft period</td>
                <td>Ongoing through evolution process</td>
            </tr>
        </tbody>
    </table>
</section>

<section>
    <h2>What's New in PER Coding Style 3.0?</h2>
    
    <h3>1. Modern Type Declarations</h3>
    <p>
        PER addresses the explosion of type system features in modern PHP:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-per-coding-style-evolution/modern-type-declarations.php}}</code></pre>

    <h3>2. Attributes (Annotations)</h3>
    <p>
        <a href="https://www.php.net/manual/en/language.attributes.php" target="_blank" rel="noopener">PHP 8 Attributes</a> 
        get comprehensive formatting rules:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-per-coding-style-evolution/attributes-formatting.php}}</code></pre>

    <h3>3. Enumerations</h3>
    <p>
        Clear guidelines for <a href="https://www.php.net/manual/en/language.enumerations.php" target="_blank" rel="noopener">PHP 8.1 enums</a>:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-per-coding-style-evolution/enum-status.php}}</code></pre>

    <h3>4. Property Hooks (PHP 8.4)</h3>
    <p>
        Formatting guidance for one of PHP 8.4's headline features:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-per-coding-style-evolution/property-hooks.php}}</code></pre>

    <h3>5. Trailing Commas</h3>
    <p>
        Mandatory trailing commas in multi-line contexts:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-per-coding-style-evolution/trailing-commas.php}}</code></pre>
</section>

<section>
    <h2>Enforcing PER with QA Tools</h2>
    
    <h3>PHP-CS-Fixer: The Gold Standard</h3>
    <p>
        <a href="https://github.com/PHP-CS-Fixer/PHP-CS-Fixer" target="_blank" rel="noopener">PHP-CS-Fixer</a> 
        already includes PER support. The 
        <a href="https://github.com/PHP-CS-Fixer/PHP-CS-Fixer/blob/master/doc/ruleSets/Symfony.rst" target="_blank" rel="noopener">Symfony ruleset</a> 
        incorporates PER Coding Style by default:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:php-per-coding-style-evolution/php-cs-fixer-config.php}}</code></pre>

    <p>
        Run with:
    </p>
    <pre><code class="language-bash">{{SNIPPET:php-per-coding-style-evolution/php-cs-fixer-run.sh}}</code></pre>

    <h3>PHPStan Integration</h3>
    <p>
        Whilst <a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a> focuses on static analysis,
        you can enforce some PER conventions:
    </p>

    <pre><code class="language-yaml">{{SNIPPET:php-per-coding-style-evolution/phpstan-config.neon}}</code></pre>

    <h3>Composer Scripts</h3>
    <p>
        Integrate into your workflow:
    </p>
    
    <pre><code class="language-json">{{SNIPPET:php-per-coding-style-evolution/composer-scripts.json}}</code></pre>

    <h3>CI/CD Integration</h3>
    <p>
        <a href="https://docs.github.com/en/actions" target="_blank" rel="noopener">GitHub Actions</a> example:
    </p>
    
    <pre><code class="language-yaml">{{SNIPPET:php-per-coding-style-evolution/github-actions-quality.yaml}}</code></pre>
</section>

<section>
    <h2>A Brief History of PHP Standards</h2>
    
    <h3>The PSR Era (2009-Present)</h3>
    <ul>
        <li><strong>2009</strong>: <a href="https://www.php-fig.org/" target="_blank" rel="noopener">PHP-FIG</a> formed</li>
        <li><strong>2010</strong>: <a href="https://www.php-fig.org/psr/psr-0/" target="_blank" rel="noopener">PSR-0</a> (Autoloading) - The first PSR</li>
        <li><strong>2012</strong>: <a href="https://www.php-fig.org/psr/psr-1/" target="_blank" rel="noopener">PSR-1</a> & <a href="https://www.php-fig.org/psr/psr-2/" target="_blank" rel="noopener">PSR-2</a> (Basic & Coding Style)</li>
        <li><strong>2013</strong>: <a href="https://www.php-fig.org/psr/psr-4/" target="_blank" rel="noopener">PSR-4</a> (Improved Autoloading)</li>
        <li><strong>2019</strong>: <a href="https://www.php-fig.org/psr/psr-12/" target="_blank" rel="noopener">PSR-12</a> (Extended Coding Style)</li>
    </ul>

    <h3>The Problem Emerges</h3>
    <p>
        As PHP accelerated its release cycle with <a href="https://wiki.php.net/rfc/releaseprocess" target="_blank" rel="noopener">annual major versions</a>, 
        the static nature of PSRs became problematic. PSR-12 couldn't be updated for new syntax, leading to:
    </p>
    <ul>
        <li>Fragmented community standards</li>
        <li>Tool-specific interpretations</li>
        <li>Inconsistent codebases</li>
    </ul>

    <h3>Enter PER (2022–2025)</h3>
    <p>
        PHP-FIG introduced the <a href="https://www.php-fig.org/bylaws/per-workflow/" target="_blank" rel="noopener">PER Workflow Bylaw</a>,
        creating a new category of living standards. PER Coding Style 2.0 was released in April 2023,
        followed by 3.0 in July 2025. Key innovations:
    </p>
    <ul>
        <li><strong>Active Maintainership</strong>: Each PER has an Editor and Sponsor</li>
        <li><strong>Version Control</strong>: PERs use semantic versioning</li>
        <li><strong>Community Evolution</strong>: Regular updates based on language changes</li>
    </ul>
</section>

<section>
    <h2>The Future of PHP Standards</h2>
    
    <h3>Expected PER Evolution</h3>
    <p>
        As PHP continues to evolve, PER Coding Style will likely address:
    </p>
    <ul>
        <li><strong>Pattern Matching</strong>: If <a href="https://wiki.php.net/rfc/pattern-matching" target="_blank" rel="noopener">PHP adds pattern matching</a></li>
        <li><strong>Generics</strong>: Should <a href="https://github.com/PHPGenerics/php-generics-rfc" target="_blank" rel="noopener">generics finally arrive</a></li>
        <li><strong>Async/Await</strong>: For potential <a href="https://github.com/amphp/amp" target="_blank" rel="noopener">async PHP features</a></li>
        <li><strong>Package Visibility</strong>: New access modifiers</li>
    </ul>

    <h3>Potential New PERs</h3>
    <p>
        The community is discussing PERs for:
    </p>
    <ul>
        <li><strong>Documentation Standards</strong>: Evolving <a href="https://docs.phpdoc.org/3.0/" target="_blank" rel="noopener">PHPDoc</a> alternatives</li>
        <li><strong>Testing Conventions</strong>: Modern <a href="https://phpunit.de/" target="_blank" rel="noopener">PHPUnit</a>/<a href="https://pestphp.com/" target="_blank" rel="noopener">Pest</a> practices</li>
        <li><strong>API Design</strong>: RESTful and <a href="https://graphql.org/" target="_blank" rel="noopener">GraphQL</a> standards</li>
        <li><strong>Security Practices</strong>: Evolving security recommendations</li>
    </ul>

    <h3>Tool Ecosystem Alignment</h3>
    <p>
        Major tools are aligning with PER:
    </p>
    <ul>
        <li><a href="https://github.com/squizlabs/PHP_CodeSniffer" target="_blank" rel="noopener">PHP_CodeSniffer</a>: Adding PER rulesets</li>
        <li><a href="https://psalm.dev/" target="_blank" rel="noopener">Psalm</a>: Considering PER-aware analysis</li>
        <li>IDEs: <a href="https://www.jetbrains.com/phpstorm/" target="_blank" rel="noopener">PhpStorm</a> and <a href="https://code.visualstudio.com/" target="_blank" rel="noopener">VS Code</a> updating formatters</li>
    </ul>
</section>

<section>
    <h2>Practical Migration Guide</h2>
    
    <h3>From PSR-12 to PER</h3>
    <p>
        Migrating is straightforward with proper tooling:
    </p>
    
    <pre><code class="language-bash">{{SNIPPET:php-per-coding-style-evolution/migration-guide.sh}}</code></pre>

    <h3>Common Migration Issues</h3>
    <ul>
        <li><strong>Trailing commas</strong>: Now required in multi-line contexts</li>
        <li><strong>Type declarations</strong>: May need reformatting</li>
        <li><strong>Attributes</strong>: New formatting rules apply</li>
    </ul>
</section>

<section>
    <h2>PER's Long-Term Payoff</h2>
    <p>
        PHP Evolving Recommendations represent a maturation of the PHP community's approach to standards.
        By acknowledging that languages evolve and standards must evolve with them, PER provides a 
        sustainable path forward.
    </p>
    
    <p>
        For teams already using <a href="https://github.com/PHP-CS-Fixer/PHP-CS-Fixer" target="_blank" rel="noopener">PHP-CS-Fixer</a> 
        with <a href="https://symfony.com/" target="_blank" rel="noopener">Symfony</a> rules, you're likely
        already PER-compliant. For others, the migration is straightforward with modern tooling, though
        as the section above shows, it's not entirely without friction.
    </p>

    <p>
        The key insight is that PER goes beyond coding style: it creates living standards that grow
        with PHP, and as PHP continues its renaissance with performance improvements, type safety, and
        modern features, PER ensures our standards keep pace. With PHP 8.5 on the horizon and new
        features constantly being added, that evolutionary approach matters more than it did under the
        old, static PSR model.
    </p>
</section>

<section>
    <h2>Resources</h2>
    <ul>
        <li><a href="https://www.php-fig.org/per/coding-style/" target="_blank" rel="noopener">PER Coding Style 3.0 Specification</a></li>
        <li><a href="https://github.com/PHP-CS-Fixer/PHP-CS-Fixer" target="_blank" rel="noopener">PHP-CS-Fixer Documentation</a></li>
        <li><a href="https://www.php-fig.org/bylaws/per-workflow/" target="_blank" rel="noopener">PER Workflow Bylaw</a></li>
        <li><a href="https://github.com/php-fig/per-coding-style" target="_blank" rel="noopener">PER Coding Style GitHub Repository</a></li>
        <li><a href="https://blog.jetbrains.com/phpstorm/2024/01/per-coding-style/" target="_blank" rel="noopener">PhpStorm PER Support</a></li>
    </ul>
</section>
    `,
  },
  // Migrating: php-qa-ci-comprehensive-quality-pipeline.ejs
  {
    id: 'php-qa-ci-comprehensive-quality-pipeline',
    title: 'PHP-QA-CI: A Comprehensive Quality Assurance Pipeline in a Single Dependency',
    description:
      'LTS PHP-QA-CI provides a complete, production-ready QA pipeline with a full suite of integrated tools through a single Composer dependency, covering configuration, customisation, and CI/CD integration strategies.',
    date: '2025-07-25',
    category: CATEGORIES.php.id,
    readingTime: 15,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    register: 'formal',
    heroImage: {
      src: '/images/php-qa-ci-comprehensive-quality-pipeline/hero.webp',
      alt: 'Historic black-and-white photograph of gate valves controlling sequential stages of a water filtration plant, main flood valve and crossover valve mounted side by side on the pipe run',
      ogImage: '/images/php-qa-ci-comprehensive-quality-pipeline/og.jpg',
      creditText: 'Image: National Park Service (HAER), public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Valves_under_central_corridor_of_filtration_bed_building._Main_flood_valves_is_at_left_and_crossover_valve_is_a_right._-_Lake_Whitney_Water_Filtration_Plant,_Filtration_Plant,_South_HAER_CT-186-A-30.tif',
    },
    content: `
<div class="intro">
            <p class="lead">Setting up quality assurance for PHP projects is a pain. You need to install a dozen different tools, each with its own config files and quirks. But what if you could get a complete, battle-tested QA pipeline with just one Composer dependency?</p>
        </div>
        
        <section>
            <h2>The Problem with Traditional QA Setup</h2>
            <p>The traditional approach to setting up QA tools is time-consuming:</p>
            <ul>
                <li>Installing multiple dev dependencies individually</li>
                <li>Creating configuration files for each tool</li>
                <li>Writing scripts to run tools in the correct order</li>
                <li>Ensuring consistency across different projects</li>
                <li>Maintaining and updating configurations as tools evolve</li>
                <li>Training team members on different tool interfaces</li>
            </ul>
            <p>This fragmented approach creates problems: you get inconsistent setups across projects, maintenance becomes a nightmare, and teams often skip important QA steps because it's just too complicated.</p>
        </section>

        <section>
            <h2>PHP-QA-CI</h2>
            <p><a href="https://github.com/LongTermSupport/php-qa-ci" target="_blank">PHP-QA-CI</a> solves these problems. Built by <a href="https://github.com/LongTermSupport" target="_blank">Long Term Support LTD</a>, it gives you a complete QA pipeline through a single Composer dependency.</p>
            
            <p>The key innovation is simple: instead of manually orchestrating multiple tools, PHP-QA-CI provides:</p>
            <ul>
                <li>Pre-configured, sensible defaults for all integrated tools</li>
                <li>Logical execution order that fails fast on errors</li>
                <li>Consistent interface across all projects</li>
                <li>Easy customisation when needed</li>
                <li>Version-specific branches for different PHP versions</li>
            </ul>
        </section>

        <section>
            <h2>The Complete Tool Suite</h2>
            <p>Installing PHP-QA-CI gives you immediate access to a complete suite of QA tools, organised into logical categories:</p>

            <p>The tools run in order from fastest to slowest, giving you quick feedback:</p>

            <h3>1. Validation and Checks</h3>
            <ul>
                <li><strong>PSR-4 Validation</strong> - Checks code namespaces for PSR-4 compliance (built-in script)</li>
                <li><strong>Composer Check for Issues</strong> - Runs composer diagnose and dumps the autoloader</li>
                <li><strong>Strict Types Enforcing</strong> - Finds and fixes files missing strict types declarations</li>
            </ul>

            <h3>2. Linting</h3>
            <ul>
                <li><strong>PHP Parallel Lint</strong> - Lightning-fast PHP syntax error checking</li>
            </ul>

            <h3>3. Static Analysis</h3>
            <ul>
                <li><strong><a href="https://phpstan.org/" target="_blank">PHPStan</a></strong> - Static code analysis</li>
            </ul>

            <h3>4. Testing</h3>
            <ul>
                <li><strong><a href="https://phpunit.de/" target="_blank">PHPUnit</a></strong> - Unit testing</li>
                <li><strong><a href="https://infection.github.io/" target="_blank">Infection</a></strong> - Mutation testing that deliberately breaks your code to test how good your tests are</li>
            </ul>

            <h3>5. Documentation</h3>
            <ul>
                <li><strong>Markdown Links Checker</strong> - Finds broken links in README.md and docs files (built-in script)</li>
            </ul>

            <h3>6. Final Checks</h3>
            <ul>
                <li><strong>Uncommitted Changes Check</strong> - Makes sure you don't have uncommitted changes</li>
            </ul>

            <h3>7. Code Formatting</h3>
            <ul>
                <li><strong>Beautifier and Fixer</strong> - Automatically formats PHP code and applies coding standards</li>
                <li><strong>PHP Code Sniffer</strong> - Catches any remaining coding standards violations</li>
            </ul>
        </section>

        <section>
            <h2>Installation and Basic Usage</h2>
            <p>Getting started with PHP-QA-CI requires just a single Composer command:</p>

            <pre><code class="language-json">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/composer-json.json}}
</code></pre>

            <p>Install the package (using the PHP 8.4 branch):</p>
            <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/install.bash}}</code></pre>

            <p>That gives you access to the complete QA pipeline:</p>

            <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/basic-usage.bash}}
</code></pre>

            <p>The pipeline runs tools in an order designed to "fail fast," catching basic issues first before running the more time-consuming analyses.</p>
        </section>

        <section>
            <h2>PHP Version Support</h2>
            <p>PHP-QA-CI maintains separate branches for different PHP versions. This ensures compatibility and lets you use version-specific features:</p>

            <ul>
                <li><code>php8.3</code> - PHP 8.3 specific configurations</li>
                <li><code>php8.4</code> - PHP 8.4 support (current recommended branch as of 2025)</li>
                <li><code>php8.5</code> - Default branch, tracking the latest PHP release</li>
            </ul>

            <p>This branching strategy gives you sensible configurations for each PHP version, whilst still maintaining backward compatibility when needed.</p>
        </section>

        <section>
            <h2>Configuration and Customisation</h2>
            <p>PHP-QA-CI works out of the box with sensible defaults, but it's easy to customise. The tool looks for custom configurations in your project's <code>qaConfig</code> directory. If it doesn't find them, it uses the defaults.</p>

            <h3>Creating Custom Configurations</h3>
            <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/custom-config.bash}}
</code></pre>

            <h3>PHPStan Custom Configuration Example</h3>
            <p>Here's how to extend the default PHPStan configuration for your project:</p>
            <pre><code class="language-yaml">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/phpstan-custom.neon}}
</code></pre>

            <h3>PHP CS Fixer Custom Configuration</h3>
            <p>Customise coding standards whilst maintaining the base configuration:</p>
            <pre><code class="language-php">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/php-cs-fixer-custom.php}}
</code></pre>
        </section>

        <section>
            <h2>Symfony Project Integration</h2>
            <p>PHP-QA-CI includes special considerations for Symfony projects. When installing in a Symfony project, you have two options:</p>

            <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/symfony-setup.bash}}
</code></pre>

            <p>The PHP-QA-CI defaults are more comprehensive than Symfony's defaults, giving you additional static analysis rules and stricter coding standards.</p>
        </section>

        <section>
            <h2>Advanced Features</h2>
            
            <h3>Hooks System</h3>
            <p>PHP-QA-CI supports pre and post execution hooks, allowing you to integrate custom logic into the pipeline:</p>
            <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/hooks.bash}}
</code></pre>

            <h3>Mutation Testing with Infection</h3>
            <p>One of the most powerful features is mutation testing via Infection, which tests the quality of your test suite by introducing small changes to your code and then checking whether your tests catch these mutations:</p>
            <pre><code class="language-json">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/infection-config.json}}
</code></pre>

            <h3>Performance Optimisation</h3>
            <p>The pipeline is optimised for performance in several ways:</p>
            <ul>
                <li>Fail-fast approach - basic checks run first</li>
                <li>Parallel execution where possible</li>
                <li>Intelligent caching of results</li>
                <li>Option to run quick tests only during development</li>
            </ul>
        </section>

        <section>
            <h2>CI/CD Integration</h2>
            <p>PHP-QA-CI works well in CI environments. Here's an example GitHub Actions workflow:</p>

            <pre><code class="language-yaml">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/ci-pipeline.yaml}}
</code></pre>

            <p>The pipeline works just as well with GitLab CI, Jenkins, or Bitbucket Pipelines. The consistent interface means your local development experience matches your CI environment exactly.</p>
        </section>

        <section>
            <h2>Real-World Benefits</h2>
            
            <h3>Consistency Across Projects</h3>
            <p>With PHP-QA-CI, all your projects use the same QA pipeline, making it easy for developers to move between projects without learning new tools or configurations.</p>

            <h3>Time Savings</h3>
            <p>Setting up a complete QA pipeline manually takes hours or even days. With PHP-QA-CI, you're up and running in minutes with a battle-tested configuration.</p>

            <h3>Maintenance Reduction</h3>
            <p>Instead of maintaining configurations for a dozen tools across multiple projects, you maintain just one dependency. Tool configuration updates are handled centrally.</p>

            <h3>Best Practices by Default</h3>
            <p>The default configurations include years of PHP development best practices. Your code meets high quality standards without you having to research what those standards should be.</p>
        </section>

        <section>
            <h2>Comparison with Manual Setup</h2>
            <p>Consider what manual setup of these tools would require:</p>

            <table class="data-table">
                <thead>
                    <tr>
                        <th>Aspect</th>
                        <th>Manual Setup</th>
                        <th>PHP-QA-CI</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Execution Scripts</td>
                        <td>Custom required</td>
                        <td>Single qa command</td>
                    </tr>
                    <tr>
                        <td>Cross-project Consistency</td>
                        <td>Manual synchronisation</td>
                        <td>Automatic</td>
                    </tr>
                    <tr>
                        <td>Tool Updates</td>
                        <td>Individual updates</td>
                        <td>Single update</td>
                    </tr>
                </tbody>
            </table>
        </section>

        <section>
            <h2>Troubleshooting Common Issues</h2>
            
            <h3>Permission Issues</h3>
            <p>If you encounter permission issues with the qa script:</p>
            <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/permission-fix.bash}}</code></pre>

            <h3>Memory Limits</h3>
            <p>Some tools like PHPStan may require increased memory limits:</p>
            <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/memory-limit.bash}}</code></pre>

            <h3>Tool-Specific Issues</h3>
            <p>Individual tools can be run in isolation for debugging:</p>
            <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/tool-specific.bash}}</code></pre>
        </section>

        <section>
            <h2>Future Development</h2>
            <p>PHP-QA-CI keeps evolving with the PHP ecosystem. Current development focuses on:</p>
            <ul>
                <li>Support for newer PHP versions as they're released</li>
                <li>Integration of emerging QA tools</li>
                <li>Performance optimisations for large codebases</li>
                <li>Enhanced reporting and metrics</li>
                <li>Better IDE integration support</li>
            </ul>
        </section>

        <section>
            <h2>Why This Matters for PHP Teams</h2>
            <p>PHP-QA-CI changes how you set up quality assurance for PHP projects, providing a complete, pre-configured pipeline through a single dependency that removes the barriers to implementing comprehensive quality checks.</p>

            <p>Whether you're starting a new project or improving QA in an existing codebase, PHP-QA-CI offers immediate value with minimal setup, thanks to the combination of sensible defaults, easy customisation, and comprehensive tool coverage.</p>

            <p>I think it fits the philosophy of the <a href="https://www.php.net/manual/en/intro-whatis.php" target="_blank">PHP language itself</a>: pragmatic and focused on developer productivity rather than ceremony. By abstracting away QA pipeline complexity, PHP-QA-CI leaves developers more time to spend on the actual code.</p>

            <div class="cta-section">
                <h3>Get Started Today</h3>
                <p>Visit the <a href="https://github.com/LongTermSupport/php-qa-ci" target="_blank">PHP-QA-CI GitHub repository</a> or install it directly via Composer:</p>
                <pre><code class="language-bash">{{SNIPPET:php-qa-ci-comprehensive-quality-pipeline/install.bash}}</code></pre>
            </div>
        </section>
    `,
  },
  // Migrating: php-stream-wrappers.ejs
  {
    id: 'php-stream-wrappers',
    title: 'PHP Stream Wrappers: Mastering I/O Abstraction and Custom Protocols',
    description:
      'How PHP treats files, URLs, compressed data, and custom protocols through the same handful of functions, and when writing your own wrapper is worth the extra code',
    date: '2025-09-26',
    category: CATEGORIES.php.id,
    register: 'formal',
    heroImage: {
      src: '/images/php-stream-wrappers/hero.webp',
      alt: 'A 1913 engineering drawing of a steel discharge manifold, showing a single intake pipe splitting at a T-junction into three separate branches, each ending in its own flanged connector',
      ogImage: '/images/php-stream-wrappers/og.jpg',
      creditText: 'Image: U.S. Reclamation Service / HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:STEEL_MANIFOLD,_HIGHLINE_PUMPING_PLANT._January_7,_1913_-_Highline_Canal_and_Pumping_Station,_South_side_of_Salt_River_between_Tempe,_Phoenix_and_Mesa,_Tempe,_Maricopa_County,_AZ_HAER_ARIZ,7-TEMP,6-26.tif',
    },
    readingTime: 9,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    content: `
<div class="intro">
    <p class="lead">
        PHP's stream wrapper system provides a powerful abstraction layer for I/O operations, enabling consistent
        access to files, URLs, compressed data, and custom protocols through familiar functions like
        <a href="https://www.php.net/manual/en/function.fopen.php" target="_blank" rel="noopener">fopen()</a> and
        <a href="https://www.php.net/manual/en/function.file-get-contents.php" target="_blank" rel="noopener">file_get_contents()</a>.
        This guide explores built-in wrappers, their practical applications, and how to implement custom stream handlers
        for specialised data sources.
    </p>
</div>

<section>
    <h2>Understanding Stream Wrappers</h2>
    <p>
        <a href="https://www.php.net/manual/en/intro.stream.php" target="_blank" rel="noopener">PHP streams</a> provide
        a unified interface for various I/O operations. Each stream is identified by a scheme and target:
        <code>scheme://target</code>. The scheme determines which wrapper handles the stream, whilst the target
        specifies what to access.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/basic-stream-wrappers.php}}
</code></pre>

    <p>
        The <a href="https://www.php.net/manual/en/function.stream-get-wrappers.php" target="_blank" rel="noopener">stream_get_wrappers()</a>
        function reveals all available protocols, typically including: <code>file</code>, <code>http</code>,
        <code>https</code>, <code>ftp</code>, <code>php</code>, <code>compress.zlib</code>, <code>data</code>,
        <code>phar</code>, and <code>zip</code>.
    </p>
</section>

<section>
    <h2>File System Wrapper (file://)</h2>
    <p>
        The <a href="https://www.php.net/manual/en/wrappers.file.php" target="_blank" rel="noopener">file:// wrapper</a>
        is the default handler for local filesystem access, and when no scheme is specified PHP simply assumes it,
        supporting all standard filesystem operations and metadata retrieval.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/file-wrapper-advanced.php}}
</code></pre>

    <p>
        File wrapper operations respect standard Unix permissions and can work with special files like
        <code>/dev/null</code> or named pipes (FIFOs).
    </p>
</section>

<section>
    <h2>HTTP/HTTPS Wrappers</h2>
    <p>
        The <a href="https://www.php.net/manual/en/wrappers.http.php" target="_blank" rel="noopener">HTTP wrappers</a>
        enable web resource access with broad HTTP protocol support, handling redirects, authentication,
        custom headers, and different HTTP methods through
        <a href="https://www.php.net/manual/en/context.http.php" target="_blank" rel="noopener">stream contexts</a>.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/http-wrapper-advanced.php}}
</code></pre>

    <p>
        The <code>$http_response_header</code> variable automatically contains response headers, enabling
        status code checks and header parsing. Setting <code>ignore_errors</code> stops
        <code>file_get_contents()</code> from returning <code>false</code> (and raising a warning) on HTTP
        error status codes, so the response body is still returned for inspection.
    </p>
</section>

<section>
    <h2>PHP I/O Streams (php://)</h2>
    <p>
        The <a href="https://www.php.net/manual/en/wrappers.php.php" target="_blank" rel="noopener">php:// wrapper</a>
        provides access to PHP's input/output streams and memory-based storage. These are essential for
        processing raw request data and creating temporary storage.
    </p>

    <h3>Standard I/O Streams</h3>
    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/php-io-standard-streams.php}}
</code></pre>

    <h3>Memory and Temporary Streams</h3>
    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/memory-temp-streams.php}}
</code></pre>
</section>

<section>
    <h2>Data URI Scheme (data://)</h2>
    <p>
        The <a href="https://www.php.net/manual/en/wrappers.data.php" target="_blank" rel="noopener">data:// wrapper</a>
        implements <a href="https://www.rfc-editor.org/rfc/rfc2397" target="_blank" rel="noopener">RFC 2397</a>
        for embedding data directly in URLs. <code>data://</code> and <code>data:</code> are
        interchangeable; both refer to the same data URI scheme.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/data-uri-scheme.php}}
</code></pre>

    <p>
        Data URIs are particularly useful for testing, embedding small resources, and creating self-contained
        applications that don't depend on external files.
    </p>
</section>

<section>
    <h2>Compression Wrappers</h2>
    <p>
        PHP provides <a href="https://www.php.net/manual/en/wrappers.compression.php" target="_blank" rel="noopener">compression wrappers</a>
        for transparent handling of compressed data. The most common are <code>zlib://</code> and
        <code>compress.zlib://</code> for gzip compression.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/compression-wrappers.php}}
</code></pre>
</section>

<section>
    <h2>Implementing Custom Stream Wrappers</h2>
    <p>
        Custom stream wrappers enable access to specialised data sources through PHP's standard file functions.
        Use <a href="https://www.php.net/manual/en/function.stream-wrapper-register.php" target="_blank" rel="noopener">stream_wrapper_register()</a>
        to register custom protocols.
    </p>

    <h3>Basic Stream Wrapper Class</h3>
    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/cache-stream-wrapper.php}}
</code></pre>

    <h3>Using the Custom Stream Wrapper</h3>
    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/cache-wrapper-usage.php}}
</code></pre>
</section>

<section>
    <h2>Advanced Stream Wrapper Features</h2>
    <p>
        Stream wrappers can implement additional methods for directory operations, metadata handling,
        and advanced file operations like locking and truncation.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/log-stream-wrapper.php}}
</code></pre>
</section>

<section>
    <h2>Stream Filters and Contexts</h2>
    <p>
        <a href="https://www.php.net/manual/en/function.stream-filter-append.php" target="_blank" rel="noopener">Stream filters</a>
        provide data transformation during read/write operations, whilst
        <a href="https://www.php.net/manual/en/function.stream-context-create.php" target="_blank" rel="noopener">stream contexts</a>
        configure wrapper behaviour.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/stream-filters-contexts.php}}
</code></pre>
</section>

<section>
    <h2>Performance Considerations</h2>
    <p>
        Stream wrappers introduce abstraction overhead, so understanding their performance characteristics helps
        in choosing the right implementation for a given use case.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/performance-benchmark.php}}
</code></pre>
</section>

<section>
    <h2>Security Considerations</h2>
    <p>
        Stream wrappers can introduce security vulnerabilities if not properly validated, so always sanitise
        input and implement appropriate access controls.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/secure-file-wrapper.php}}
</code></pre>
</section>

<section>
    <h2>Real-World Applications</h2>
    <p>
        Stream wrappers excel in scenarios requiring abstraction over data sources, protocol translation,
        or transparent data transformation. Here are practical implementations:
    </p>

    <h3>Configuration Management</h3>
    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/config-stream-wrapper.php}}
</code></pre>
</section>

<section>
    <h2>Debugging and Troubleshooting</h2>
    <p>
        Effective debugging of stream operations requires understanding metadata, error handling,
        and logging techniques.
    </p>

    <pre><code class="language-php">{{SNIPPET:php-stream-wrappers/debug-stream-wrapper.php}}
</code></pre>
</section>

<section>
    <h2>Conclusion</h2>
    <p>
        The key to effective stream wrapper usage lies in understanding the abstraction's strengths:
        protocol independence, transparent data transformation, and clean integration with existing
        code. The built-in wrappers cover most day-to-day needs (<code>file://</code>, <code>http://</code>,
        <code>php://</code>), whilst custom implementations are worth reaching for when a project needs
        specialised handling such as caching, logging, or secure file access.
    </p>
</section>
    `,
  },
  // Migrating: phpstan-project-level-rules.ejs
  {
    id: 'phpstan-project-level-rules',
    title: 'Using PHPStan to Enforce Project-Level Rules',
    description:
      'Learn how to write custom PHPStan rules to enforce performance, architectural, and testing standards across your entire codebase. Includes real-world examples and multi-language comparisons.',
    date: '2025-11-10',
    category: CATEGORIES.php.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    register: 'formal',
    heroImage: {
      src: '/images/phpstan-project-level-rules/hero.webp',
      alt: 'A black-and-white photograph of a machine shop tool room, with a mesh-fronted tool cabinet, a rack of hanging clamps and wrenches, and a run of individually labelled parts drawers under a workbench with a mounted vice',
      ogImage: '/images/phpstan-project-level-rules/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:TOOL_ROOM_SHOWING_TOOL_STORAGE_AREA._VIEW_WEST_-_Oldman_Boiler_Works,_Office-Machine_Shop,_32_Illinois_Street,_Buffalo,_Erie_County,_NY_HAER_NY,15-BUF,41B-4.tif',
    },
    content: `
<div class="intro">
            <p class="lead">
                Your codebase is too large to fit in any <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">Large Language Model (LLM)</a> context window.
                Even with <a href="https://www.anthropic.com/claude/sonnet" target="_blank" rel="noopener">Claude Sonnet 4.5's</a> 200,000 token window,
                <a href="https://ai.google.dev/gemini-api/docs/models" target="_blank" rel="noopener">Gemini 2.5 Pro's</a> 1 million tokens (expanding to 2 million), or
                <a href="https://openai.com/index/gpt-4-1/" target="_blank" rel="noopener">GPT-4.1's</a> 1 million tokens,
                large-scale applications exceed these limits. Static analysis tools like <a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a>
                work differently - they analyse your entire codebase systematically, enforcing rules that are cheap (CPU cycles, not tokens),
                deterministic, and comprehensive. This article explores how to write custom PHPStan rules that codify your project's unique
                standards, making them automatic, consistent, and educational.
            </p>
        </div>

        <section>
            <h2>The Context Window Problem</h2>
            <p>
                Modern LLMs are powerful, but they have fundamental limitations when analysing large codebases. A typical enterprise
                application contains millions of lines of code spread across thousands of files. Even with aggressive compression,
                this exceeds any context window.
            </p>
            <p>
                <a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a> solves this by using
                <a href="https://en.wikipedia.org/wiki/Abstract_syntax_tree" target="_blank" rel="noopener">Abstract Syntax Trees (AST)</a>
                and type inference. It doesn't need to "understand" your code like an LLM - it systematically checks every node in the
                <a href="https://github.com/nikic/PHP-Parser" target="_blank" rel="noopener">PHP-Parser</a> AST against your rules. This approach:
            </p>
            <ul>
                <li><strong>Scales linearly</strong> with codebase size</li>
                <li><strong>Runs in CI/CD</strong> with consistent, reproducible results</li>
                <li><strong>Costs pennies</strong> in compute time vs. dollars in LLM tokens</li>
                <li><strong>Catches violations</strong> before code review</li>
                <li><strong>Documents standards</strong> through executable rules</li>
            </ul>
        </section>

        <section>
            <h2>Types of Project-Level Rules</h2>
            <p>
                Custom PHPStan rules fall into several categories, each addressing different aspects of code quality:
            </p>

            <h3>Performance Rules</h3>
            <p>
                Detect anti-patterns that cause performance problems. These are often subtle issues that only
                manifest at scale, like <a href="https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping" target="_blank" rel="noopener">N+1 query problems</a>
                or inefficient algorithms in hot paths.
            </p>

            <h3>Architectural Rules</h3>
            <p>
                Enforce design decisions and boundaries. For example, preventing business logic in
                <a href="https://www.php.net/manual/en/language.oop5.decon.php" target="_blank" rel="noopener">destructors</a>,
                ensuring proper <a href="https://www.php-fig.org/psr/psr-11/" target="_blank" rel="noopener">dependency injection (PSR-11)</a>,
                or maintaining layered architecture boundaries.
            </p>

            <h3>Security Rules</h3>
            <p>
                Catch security vulnerabilities before they reach production. Examples include detecting
                <a href="https://owasp.org/www-community/attacks/SQL_Injection" target="_blank" rel="noopener">SQL injection</a> risks,
                unvalidated user input, or insecure cryptographic practices.
            </p>

            <h3>Testing Rules</h3>
            <p>
                Enforce test quality standards. Prevent brittle tests that mock critical services like databases,
                ensure proper test isolation, and verify that tests actually exercise production code paths.
            </p>

            <h3>Code Quality Rules</h3>
            <p>
                Eliminate common maintainability issues. Examples include detecting
                <a href="https://en.wikipedia.org/wiki/Magic_string" target="_blank" rel="noopener">magic strings</a>,
                enforcing naming conventions, or requiring proper documentation.
            </p>
        </section>

        <section>
            <h2>Anatomy of a PHPStan Rule</h2>
            <p>
                Every PHPStan rule implements the <a href="https://phpstan.org/developing-extensions/rules" target="_blank" rel="noopener"><code>PHPStan\\Rules\\Rule</code></a>
                interface with two methods:
            </p>

            <ol>
                <li><strong><code>getNodeType()</code></strong> - Returns the <a href="https://github.com/nikic/PHP-Parser/tree/master/doc" target="_blank" rel="noopener">AST node type</a> to monitor</li>
                <li><strong><code>processNode()</code></strong> - Analyses nodes and returns errors if violations are found</li>
            </ol>

            <p>Here's the basic structure:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/basic-rule-structure.php}}
</code></pre>

            <p>
                The <code>getNodeType()</code> method tells PHPStan which <a href="https://github.com/nikic/PHP-Parser/blob/master/doc/component/Walking_the_AST.markdown" target="_blank" rel="noopener">AST nodes</a>
                you want to examine. Common node types include:
            </p>

            <ul>
                <li><a href="https://github.com/nikic/PHP-Parser/blob/master/lib/PhpParser/Node/Expr/New_.php" target="_blank" rel="noopener"><code>Node\\Expr\\New_</code></a> - Object instantiation (<code>new ClassName()</code>)</li>
                <li><a href="https://github.com/nikic/PHP-Parser/blob/master/lib/PhpParser/Node/Expr/MethodCall.php" target="_blank" rel="noopener"><code>Node\\Expr\\MethodCall</code></a> - Method calls (<code>$object->method()</code>)</li>
                <li><a href="https://github.com/nikic/PHP-Parser/blob/master/lib/PhpParser/Node/Expr/StaticCall.php" target="_blank" rel="noopener"><code>Node\\Expr\\StaticCall</code></a> - Static calls (<code>Class::method()</code>)</li>
                <li><a href="https://github.com/nikic/PHP-Parser/blob/master/lib/PhpParser/Node/Stmt/ClassMethod.php" target="_blank" rel="noopener"><code>Node\\Stmt\\ClassMethod</code></a> - Method definitions</li>
                <li><a href="https://github.com/nikic/PHP-Parser/blob/master/lib/PhpParser/Node/Expr/FuncCall.php" target="_blank" rel="noopener"><code>Node\\Expr\\FuncCall</code></a> - Function calls</li>
            </ul>

            <p>
                The <code>processNode()</code> method receives each matching node along with a
                <a href="https://phpstan.org/developing-extensions/scope" target="_blank" rel="noopener"><code>Scope</code></a> object that provides
                rich context about the code's location, types, and surrounding structure.
            </p>
        </section>

        <section>
            <h2>Real-World Example: Performance Rules</h2>

            <h3>Detecting Queries in Loops</h3>
            <p>
                One of the most common performance killers is the <a href="https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping" target="_blank" rel="noopener">N+1 query problem</a> -
                executing database queries inside loops. This rule detects when <code>Query</code> objects are instantiated within
                <a href="https://www.php.net/manual/en/control-structures.foreach.php" target="_blank" rel="noopener"><code>foreach</code></a>,
                <a href="https://www.php.net/manual/en/control-structures.for.php" target="_blank" rel="noopener"><code>for</code></a>,
                <a href="https://www.php.net/manual/en/control-structures.while.php" target="_blank" rel="noopener"><code>while</code></a>, or
                <a href="https://www.php.net/manual/en/control-structures.do.while.php" target="_blank" rel="noopener"><code>do-while</code></a> loops:
            </p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/query-in-loop-rule.php}}
</code></pre>

            <p>This rule catches code like this:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/query-in-loop-violation.php}}
</code></pre>

            <p>Instead, write:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/query-in-loop-fixed.php}}
</code></pre>

            <p>
                This rule uses PHPStan's <a href="https://phpstan.org/developing-extensions/type-system" target="_blank" rel="noopener">type system</a>
                to identify <code>Query</code> instantiations and traverses the AST upward to detect loop contexts. The error message is
                educational, explaining the problem and providing concrete guidance on how to fix it.
            </p>
        </section>

        <section>
            <h2>Real-World Example: Code Quality Rules</h2>

            <h3>Eliminating Magic Strings</h3>
            <p>
                <a href="https://en.wikipedia.org/wiki/Magic_string" target="_blank" rel="noopener">Magic strings</a> are string literals
                embedded directly in code rather than defined as constants. They make refactoring difficult and are prone to typos.
                This rule enforces using class constants for command names:
            </p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/no-magic-string-commands-rule.php}}
</code></pre>

            <p>This rule catches code like this:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/magic-string-violation.php}}
</code></pre>

            <p>Instead, write:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/magic-string-fixed.php}}
</code></pre>

            <p>
                By detecting <a href="https://github.com/nikic/PHP-Parser/blob/master/lib/PhpParser/Node/Scalar/String_.php" target="_blank" rel="noopener">string literals</a>
                passed to command execution methods, this rule forces developers to use type-safe constants. This provides
                <a href="https://www.jetbrains.com/help/phpstorm/auto-completing-code.html" target="_blank" rel="noopener">IDE autocomplete</a>,
                prevents typos, and makes refactoring straightforward.
            </p>
        </section>

        <section>
            <h2>Real-World Example: Architectural Rules</h2>

            <h3>Preventing Work in Destructors</h3>
            <p>
                <a href="https://www.php.net/manual/en/language.oop5.decon.php" target="_blank" rel="noopener">PHP destructors</a>
                (<code>__destruct()</code>) are called during object cleanup, and their execution timing is unpredictable - they depend
                on <a href="https://www.php.net/manual/en/features.gc.php" target="_blank" rel="noopener">garbage collection</a>.
                Performing I/O or business logic in destructors leads to race conditions and unpredictable behaviour:
            </p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/no-work-in-destructors-rule.php}}
</code></pre>

            <p>This rule catches code like this:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/destructor-violation.php}}
</code></pre>

            <p>Instead, write:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/destructor-fixed.php}}
</code></pre>

            <p>
                This architectural rule enforces a best practice: destructors should not perform any cleanup work themselves.
                The rule allows a destructor with no statements at all - any actual I/O work should happen in explicit methods
                like <code>close()</code> or <code>dispose()</code>, giving developers control over when resources are released
                rather than leaving it to unpredictable garbage collection timing.
            </p>

            <h3>Enforcing Dependency Injection</h3>
            <p>
                Direct access to environment variables via <a href="https://www.php.net/manual/en/function.getenv.php" target="_blank" rel="noopener"><code>getenv()</code></a>
                or <a href="https://www.php.net/manual/en/reserved.variables.environment.php" target="_blank" rel="noopener"><code>$_ENV</code></a>
                violates <a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank" rel="noopener">dependency injection</a> principles:
            </p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/no-direct-env-access-rule.php}}
</code></pre>

            <p>This rule catches code like this:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/env-access-violation.php}}
</code></pre>

            <p>Instead, write:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/env-access-fixed.php}}
</code></pre>

            <p>
                This rule enforces proper <a href="https://www.php-fig.org/psr/psr-11/" target="_blank" rel="noopener">PSR-11 dependency injection</a>,
                making dependencies explicit and code testable. Configuration should flow through
                <a href="https://www.php.net/manual/en/language.oop5.decon.php#language.oop5.decon.constructor" target="_blank" rel="noopener">constructor injection</a>,
                not be pulled from global state.
            </p>
        </section>

        <section>
            <h2>Real-World Example: Rules for Tests</h2>

            <h3>Preventing Mocks of Critical Services</h3>
            <p>
                Mocking is useful, but mocking critical infrastructure like database services produces false confidence.
                These components should be tested against real (test) databases:
            </p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/no-mock-database-service-rule.php}}
</code></pre>

            <p>This rule catches code like this:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/mock-database-violation.php}}
</code></pre>

            <p>Instead, write:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/mock-database-fixed.php}}
</code></pre>

            <p>
                This rule scans test files for <a href="https://phpunit.de/manual/11.5/en/test-doubles.html#test-doubles.mock-objects" target="_blank" rel="noopener">PHPUnit mock creation</a>
                and blocks attempts to mock <code>DatabaseServiceInterface</code>. Integration tests that use real databases catch
                issues that mocks hide, like <a href="https://en.wikipedia.org/wiki/Database_transaction" target="_blank" rel="noopener">transaction handling</a>,
                <a href="https://www.postgresql.org/docs/current/mvcc-intro.html" target="_blank" rel="noopener">isolation levels</a>, and
                query performance.
            </p>

            <h3>Enforcing Test Isolation</h3>
            <p>
                Tests should never reference production table names directly. This couples tests to production schema details
                and makes refactoring dangerous:
            </p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/no-production-tables-in-tests-rule.php}}
</code></pre>

            <p>This rule catches code like this:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/production-tables-violation.php}}
</code></pre>

            <p>Instead, write:</p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/production-tables-fixed.php}}
</code></pre>

            <p>
                By detecting production table names in <a href="https://github.com/nikic/PHP-Parser/blob/master/lib/PhpParser/Node/Scalar/String_.php" target="_blank" rel="noopener">string literals</a>
                within test files, this rule enforces proper fixture usage. Tests should use test-specific tables (like <code>test_users</code>)
                that are isolated from production data and schema changes.
            </p>
        </section>

        <section>
            <h2>Configuration and Registration</h2>
            <p>
                Once you've written your rules, register them in your <a href="https://phpstan.org/config-reference" target="_blank" rel="noopener">PHPStan configuration file</a>
                (<code>phpstan.neon</code> or <code>phpstan.yaml</code>):
            </p>

            <pre><code class="language-yaml">{{SNIPPET:phpstan-project-level-rules/phpstan-config.yaml}}
</code></pre>

            <p>
                PHPStan 2.0 (released <a href="https://phpstan.org/blog/phpstan-2-0-released-level-10-elephpants" target="_blank" rel="noopener">31 December 2024</a>)
                introduced <a href="https://phpstan.org/blog/phpstan-2-0-released-level-10-elephpants#level-10" target="_blank" rel="noopener">Level 10</a>,
                which treats the <a href="https://www.php.net/manual/en/language.types.mixed.php" target="_blank" rel="noopener"><code>mixed</code> type</a>
                strictly and reduced memory consumption by 50-70%. The current version is
                <a href="https://packagist.org/packages/phpstan/phpstan" target="_blank" rel="noopener">2.1.31</a> (released 10 October 2025).
            </p>
        </section>

        <section>
            <h2>Testing Your Rules</h2>
            <p>
                PHPStan provides <a href="https://phpstan.org/developing-extensions/testing" target="_blank" rel="noopener"><code>PHPStan\\Testing\\RuleTestCase</code></a>
                for testing custom rules. Here's a simple test structure:
            </p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/rule-test-case-example.php}}
</code></pre>

            <p>
                The <a href="https://phpunit.de/" target="_blank" rel="noopener">PHPUnit</a>-based test framework makes it easy to verify
                your rules work correctly with both positive (should error) and negative (should pass) test cases.
            </p>
        </section>

        <section>
            <h2>Educational Error Messages</h2>
            <p>
                The most powerful aspect of custom rules is their error messages, which can do more than flag a problem - a good one
                teaches the developer something they'll remember next time. Good error messages should:
            </p>

            <ul>
                <li><strong>Explain the problem</strong> - Why is this code flagged?</li>
                <li><strong>Provide context</strong> - What are the consequences?</li>
                <li><strong>Offer solutions</strong> - How should developers fix it?</li>
                <li><strong>Link to documentation</strong> - Where can they learn more?</li>
            </ul>

            <p>
                Using <a href="https://phpstan.org/developing-extensions/rules#building-the-error" target="_blank" rel="noopener"><code>RuleErrorBuilder</code></a>,
                you can create rich error messages with tips and identifiers:
            </p>

            <pre><code class="language-php">{{SNIPPET:phpstan-project-level-rules/rule-error-builder-example.php}}
</code></pre>

            <p>
                The <code>identifier()</code> method provides a machine-readable error code that can be used for
                <a href="https://phpstan.org/user-guide/ignoring-errors#ignoring-by-error-identifier" target="_blank" rel="noopener">targeted suppression</a>
                or reporting. The <code>tip()</code> method adds actionable guidance that appears in IDE tooltips and CI output.
            </p>
        </section>

        <section>
            <h2>Static Analysis in Other Languages</h2>
            <p>
                Custom static analysis rules aren't unique to PHP. Every mature language ecosystem provides tools for enforcing
                project-specific standards:
            </p>

            <h3>JavaScript/TypeScript: ESLint</h3>
            <p>
                <a href="https://eslint.org/" target="_blank" rel="noopener">ESLint</a> allows creating
                <a href="https://eslint.org/docs/latest/extend/custom-rules" target="_blank" rel="noopener">custom rules</a>
                that analyse JavaScript and TypeScript code. The API uses
                <a href="https://github.com/estree/estree" target="_blank" rel="noopener">ESTree AST</a> nodes:
            </p>

            <pre><code class="language-javascript">{{SNIPPET:phpstan-project-level-rules/eslint-custom-rule.js}}
</code></pre>

            <p>
                For TypeScript-specific rules, <a href="https://typescript-eslint.io/" target="_blank" rel="noopener">typescript-eslint</a>
                provides <a href="https://typescript-eslint.io/developers/custom-rules/" target="_blank" rel="noopener">enhanced APIs</a>
                with access to <a href="https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API" target="_blank" rel="noopener">TypeScript's compiler API</a>
                for type-aware analysis.
            </p>

            <h3>Python: Pylint</h3>
            <p>
                <a href="https://pylint.pycqa.org/" target="_blank" rel="noopener">Pylint</a> supports
                <a href="https://pylint.pycqa.org/en/latest/development_guide/how_tos/custom_checkers.html" target="_blank" rel="noopener">custom checkers</a>
                that analyse Python code using the <a href="https://github.com/pylint-dev/astroid" target="_blank" rel="noopener">astroid</a> library:
            </p>

            <pre><code class="language-python">{{SNIPPET:phpstan-project-level-rules/pylint-custom-checker.py}}
</code></pre>

            <p>
                Pylint's checker system supports <a href="https://docs.python.org/3/library/ast.html" target="_blank" rel="noopener">AST checkers</a>,
                raw checkers (for line-by-line analysis), and
                <a href="https://pylint.pycqa.org/en/latest/development_guide/how_tos/custom_checkers.html#token-checkers" target="_blank" rel="noopener">token checkers</a>.
            </p>

            <h3>Go: go/analysis</h3>
            <p>
                Go's <a href="https://pkg.go.dev/golang.org/x/tools/go/analysis" target="_blank" rel="noopener"><code>go/analysis</code></a>
                package provides a standard framework for building custom analysers:
            </p>

            <pre><code class="language-go">{{SNIPPET:phpstan-project-level-rules/go-custom-analyzer.go}}
</code></pre>

            <p>
                The <code>go/analysis</code> framework integrates with <a href="https://staticcheck.io/" target="_blank" rel="noopener">staticcheck</a>,
                <a href="https://github.com/golangci/golangci-lint" target="_blank" rel="noopener">golangci-lint</a>, and
                <a href="https://pkg.go.dev/golang.org/x/tools/go/packages" target="_blank" rel="noopener">go/packages</a> for comprehensive analysis.
            </p>

            <h3>Rust: Clippy</h3>
            <p>
                <a href="https://doc.rust-lang.org/clippy/" target="_blank" rel="noopener">Clippy</a> is Rust's official linter, and you can
                <a href="https://doc.rust-lang.org/nightly/clippy/development/adding_lints.html" target="_blank" rel="noopener">add custom lints</a>
                using the <a href="https://doc.rust-lang.org/stable/nightly-rustc/rustc_lint/index.html" target="_blank" rel="noopener">rustc lint API</a>:
            </p>

            <pre><code class="language-rust">{{SNIPPET:phpstan-project-level-rules/clippy-custom-lint.rs}}
</code></pre>

            <p>
                Clippy lints can be <a href="https://doc.rust-lang.org/clippy/development/defining_lints.html" target="_blank" rel="noopener">early or late pass</a>,
                with late pass lints having access to <a href="https://doc.rust-lang.org/nightly/nightly-rustc/rustc_middle/ty/index.html" target="_blank" rel="noopener">type information</a>
                from the <a href="https://rustc-dev-guide.rust-lang.org/hir.html" target="_blank" rel="noopener">High-level Intermediate Representation (HIR)</a>.
            </p>
        </section>

        <section>
            <h2>CI/CD Integration</h2>
            <p>
                Custom rules are most effective when they run automatically in <a href="https://docs.github.com/en/actions" target="_blank" rel="noopener">CI/CD pipelines</a>.
                Here's a <a href="https://docs.github.com/en/actions/using-workflows/about-workflows" target="_blank" rel="noopener">GitHub Actions workflow</a>
                that runs PHPStan and other language-specific analysers:
            </p>

            <pre><code class="language-yaml">{{SNIPPET:phpstan-project-level-rules/github-actions-ci.yaml}}
</code></pre>

            <p>
                This workflow runs multiple static analysis tools in parallel, including PHPStan, ESLint, Pylint, Go analysers, and Clippy.
                The <a href="https://docs.github.com/en/actions/learn-github-actions/expressions#status-check-functions" target="_blank" rel="noopener"><code>--error-format=github</code></a>
                flag makes PHPStan errors appear as
                <a href="https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message" target="_blank" rel="noopener">annotations</a>
                in pull requests.
            </p>
        </section>

        <section>
            <h2>Best Practices</h2>

            <h3>Start Small and Focused</h3>
            <p>
                Don't try to enforce everything at once. Start with one high-value rule (like queries in loops) and expand from there.
                Each rule should address a specific, well-defined problem.
            </p>

            <h3>Make Error Messages Educational</h3>
            <p>
                Your error messages are documentation. They should teach developers why the rule exists and how to fix violations.
                Include links to internal documentation, relevant <a href="https://www.php-fig.org/" target="_blank" rel="noopener">PSR standards</a>,
                or external resources.
            </p>

            <h3>Use Baselines for Gradual Adoption</h3>
            <p>
                <a href="https://phpstan.org/user-guide/baseline" target="_blank" rel="noopener">PHPStan baselines</a> let you introduce
                strict rules without requiring immediate fixes to existing violations. Generate a baseline with
                <code>vendor/bin/phpstan analyse --generate-baseline</code>, then prevent new violations whilst gradually fixing old ones.
            </p>

            <h3>Test Your Rules Thoroughly</h3>
            <p>
                Use <a href="https://phpstan.org/developing-extensions/testing" target="_blank" rel="noopener"><code>RuleTestCase</code></a>
                to verify your rules work correctly. Include edge cases, false positives, and complex scenarios in your test suite.
            </p>

            <h3>Version Your Rule Identifiers</h3>
            <p>
                Use consistent, namespaced identifiers for your rules (like <code>app.queryInLoop</code>). This makes it easy to
                <a href="https://phpstan.org/user-guide/ignoring-errors#ignoring-by-error-identifier" target="_blank" rel="noopener">ignore specific errors</a>
                when necessary and track which rules are causing issues.
            </p>

            <h3>Document Your Rules</h3>
            <p>
                Maintain internal documentation that explains each custom rule: what it checks, why it exists, and how to fix violations.
                This is especially important for onboarding new team members.
            </p>
        </section>

        <section>
            <h2>Advanced Techniques</h2>

            <h3>Using Collectors for Whole-Codebase Analysis</h3>
            <p>
                Some rules need to analyse the entire codebase, not just individual nodes.
                <a href="https://phpstan.org/developing-extensions/collectors" target="_blank" rel="noopener">PHPStan collectors</a>
                gather data across multiple files, enabling rules like unused code detection or cross-file dependency analysis.
            </p>

            <h3>Virtual Nodes for Special Contexts</h3>
            <p>
                PHPStan provides <a href="https://phpstan.org/developing-extensions/rules#virtual-nodes" target="_blank" rel="noopener">virtual nodes</a>
                for contexts that regular AST nodes don't cover:
            </p>

            <ul>
                <li><a href="https://github.com/phpstan/phpstan-src/blob/master/src/Node/FileNode.php" target="_blank" rel="noopener"><code>FileNode</code></a> - File-level analysis</li>
                <li><a href="https://github.com/phpstan/phpstan-src/blob/master/src/Node/InClassNode.php" target="_blank" rel="noopener"><code>InClassNode</code></a> - Class-level context</li>
                <li><a href="https://github.com/phpstan/phpstan-src/blob/master/src/Node/InClassMethodNode.php" target="_blank" rel="noopener"><code>InClassMethodNode</code></a> - Method-level context with reflection</li>
                <li><a href="https://github.com/phpstan/phpstan-src/blob/master/src/Node/ClassPropertyNode.php" target="_blank" rel="noopener"><code>ClassPropertyNode</code></a> - Handles both traditional and promoted properties</li>
            </ul>

            <h3>Leveraging PHPStan Extensions</h3>
            <p>
                PHPStan has a rich ecosystem of extensions that enhance analysis:
            </p>

            <ul>
                <li><a href="https://github.com/phpstan/phpstan-phpunit" target="_blank" rel="noopener">phpstan-phpunit</a> - Enhanced PHPUnit analysis</li>
                <li><a href="https://github.com/phpstan/phpstan-doctrine" target="_blank" rel="noopener">phpstan-doctrine</a> - Doctrine ORM type inference</li>
                <li><a href="https://github.com/phpstan/phpstan-symfony" target="_blank" rel="noopener">phpstan-symfony</a> - Symfony framework support</li>
                <li><a href="https://github.com/phpstan/phpstan-strict-rules" target="_blank" rel="noopener">phpstan-strict-rules</a> - Additional strict checks</li>
                <li><a href="https://github.com/phpstan/phpstan-deprecation-rules" target="_blank" rel="noopener">phpstan-deprecation-rules</a> - Detect deprecated code usage</li>
            </ul>
        </section>

        <section>
            <h2>Real-World Impact</h2>
            <p>
                Custom PHPStan rules provide measurable benefits:
            </p>

            <h3>Preventing Regressions</h3>
            <p>
                Once you've fixed a class of bugs (like N+1 queries), custom rules prevent them from reappearing.
                The fix is encoded in a rule that runs on every commit.
            </p>

            <h3>Scaling Code Review</h3>
            <p>
                Reviewers can focus on business logic and architecture instead of catching style violations or common mistakes.
                The static analyser does the tedious work.
            </p>

            <h3>Onboarding Developers</h3>
            <p>
                Educational error messages teach new developers your project's conventions as they code. The feedback is immediate
                and contextual, not delayed until code review.
            </p>

            <h3>Enforcing Architecture</h3>
            <p>
                Architectural decisions (like "no business logic in destructors" or "always use dependency injection") become
                automatically enforced rather than relying on documentation that developers might miss.
            </p>

            <h3>Reducing CI/CD Costs</h3>
            <p>
                Static analysis is cheap - it costs pennies in compute time. Compare this to the cost of running extensive test suites
                or, worse, discovering bugs in production. Rules catch issues in seconds, not minutes or hours.
            </p>
        </section>

        <section>
            <h2>Complementing LLMs</h2>
            <p>
                Static analysis tools like PHPStan don't replace LLMs - they complement them:
            </p>

            <ul>
                <li><strong>LLMs excel at</strong>: Generating code, explaining complex patterns, suggesting refactorings, understanding natural language requirements</li>
                <li><strong>Static analysis excels at</strong>: Comprehensive codebase scanning, deterministic rule enforcement, fast execution, integration testing</li>
            </ul>

            <p>
                The workflow I'd recommend combines both: use LLMs like <a href="https://www.anthropic.com/claude/sonnet" target="_blank" rel="noopener">Claude Sonnet 4.5</a>
                or <a href="https://openai.com/index/gpt-4-1/" target="_blank" rel="noopener">GPT-4.1</a> to generate code and explore solutions, then use PHPStan
                to verify that the generated code actually follows your project's standards, since the LLM generates and the static analyser validates.
            </p>

            <p>
                For codebases too large to fit in context windows, you can use static analysis to identify problem areas (like files with
                high cyclomatic complexity or modules with many dependencies), then feed those specific areas to an LLM for refactoring suggestions.
            </p>
        </section>

        <section>
            <h2>Conclusion</h2>
            <p>
                Custom PHPStan rules transform your project's conventions from documentation into executable, automatically enforced standards.
                They're deterministic, comprehensive, and cheap - qualities that complement (rather than replace) AI-powered development tools.
            </p>

            <p>
                By writing rules that detect performance problems, enforce architectural decisions, ensure test quality, and eliminate
                common mistakes, you create a feedback loop that makes your entire team more productive. The rules catch issues in seconds,
                provide educational guidance, and prevent regressions.
            </p>

            <p>
                Start small: pick one high-value rule (like detecting queries in loops), write the test cases first, then implement
                the rule and register it in <code>phpstan.neon</code>. Once it's catching real violations in CI, expand to the next one.
            </p>
        </section>

        <section>
            <h2>Resources</h2>

            <h3>PHPStan Documentation</h3>
            <ul>
                <li><a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan Official Website</a></li>
                <li><a href="https://phpstan.org/developing-extensions/rules" target="_blank" rel="noopener">Writing Custom Rules</a></li>
                <li><a href="https://phpstan.org/developing-extensions/testing" target="_blank" rel="noopener">Testing Rules</a></li>
                <li><a href="https://phpstan.org/config-reference" target="_blank" rel="noopener">Configuration Reference</a></li>
                <li><a href="https://phpstan.org/user-guide/baseline" target="_blank" rel="noopener">Using Baselines</a></li>
                <li><a href="https://github.com/phpstan/phpstan" target="_blank" rel="noopener">PHPStan GitHub Repository</a></li>
                <li><a href="https://packagist.org/packages/phpstan/phpstan" target="_blank" rel="noopener">PHPStan on Packagist</a></li>
            </ul>

            <h3>PHP-Parser (AST Library)</h3>
            <ul>
                <li><a href="https://github.com/nikic/PHP-Parser" target="_blank" rel="noopener">PHP-Parser GitHub Repository</a></li>
                <li><a href="https://github.com/nikic/PHP-Parser/tree/master/doc" target="_blank" rel="noopener">PHP-Parser Documentation</a></li>
                <li><a href="https://github.com/nikic/PHP-Parser/blob/master/doc/component/Walking_the_AST.markdown" target="_blank" rel="noopener">Walking the AST</a></li>
            </ul>

            <h3>Other Language Static Analysis Tools</h3>
            <ul>
                <li><a href="https://eslint.org/" target="_blank" rel="noopener">ESLint</a> - <a href="https://eslint.org/docs/latest/extend/custom-rules" target="_blank" rel="noopener">Custom Rules Guide</a></li>
                <li><a href="https://typescript-eslint.io/" target="_blank" rel="noopener">typescript-eslint</a> - <a href="https://typescript-eslint.io/developers/custom-rules/" target="_blank" rel="noopener">Custom Rules</a></li>
                <li><a href="https://pylint.pycqa.org/" target="_blank" rel="noopener">Pylint</a> - <a href="https://pylint.pycqa.org/en/latest/development_guide/how_tos/custom_checkers.html" target="_blank" rel="noopener">Custom Checkers</a></li>
                <li><a href="https://pkg.go.dev/golang.org/x/tools/go/analysis" target="_blank" rel="noopener">go/analysis</a> - Go Static Analysis Framework</li>
                <li><a href="https://doc.rust-lang.org/clippy/" target="_blank" rel="noopener">Clippy</a> - <a href="https://doc.rust-lang.org/nightly/clippy/development/adding_lints.html" target="_blank" rel="noopener">Adding Custom Lints</a></li>
            </ul>

            <h3>Related Standards and Concepts</h3>
            <ul>
                <li><a href="https://www.php-fig.org/" target="_blank" rel="noopener">PHP-FIG (PSR Standards)</a></li>
                <li><a href="https://www.php-fig.org/psr/psr-11/" target="_blank" rel="noopener">PSR-11: Container Interface</a></li>
                <li><a href="https://en.wikipedia.org/wiki/Abstract_syntax_tree" target="_blank" rel="noopener">Abstract Syntax Trees (Wikipedia)</a></li>
                <li><a href="https://en.wikipedia.org/wiki/Dependency_injection" target="_blank" rel="noopener">Dependency Injection (Wikipedia)</a></li>
                <li><a href="https://stackoverflow.com/questions/97197/what-is-the-n1-selects-problem-in-orm-object-relational-mapping" target="_blank" rel="noopener">N+1 Query Problem</a></li>
            </ul>

            <h3>GitHub Actions and CI/CD</h3>
            <ul>
                <li><a href="https://docs.github.com/en/actions" target="_blank" rel="noopener">GitHub Actions Documentation</a></li>
                <li><a href="https://docs.github.com/en/actions/using-workflows/about-workflows" target="_blank" rel="noopener">GitHub Actions Workflows</a></li>
                <li><a href="https://github.com/shivammathur/setup-php" target="_blank" rel="noopener">setup-php Action</a></li>
            </ul>
        </section>
    `,
  },
  // Migrating: proxmox-vs-cloud.ejs
  {
    id: 'proxmox-vs-cloud',
    title: 'Proxmox vs Cloud: Why Private Infrastructure Wins',
    description:
      'Why Proxmox-based private infrastructure often beats public cloud for PHP workloads with predictable demand, covering cost, performance, control, and the cases where cloud still wins.',
    date: '2025-01-05',
    category: CATEGORIES.infrastructure.id,
    heroImage: {
      src: '/images/proxmox-vs-cloud/hero.webp',
      alt: 'A black-and-white photograph of two diesel generator units in a private power house, dense with engine block, gauge cluster, and generator housings',
      ogImage: '/images/proxmox-vs-cloud/og.jpg',
      creditText: 'Image: NPS/HABS, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:POWER_ROOM_INTERIOR,_DETAIL_CATERPILLAR_DIESEL_ENGINE,_GENERATOR_ON_RIGHT_-_Death_Valley_Ranch,_Power_House,_Death_Valley_Junction,_Inyo_County,_CA_HABS_CAL,14-DVNM,1-E-22.tif',
    },
    readingTime: 10,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'selfhosted',
    register: 'formal',
    content: `
<section class="intro">
<p class="lead">A practical comparison of Proxmox private cloud infrastructure versus public cloud solutions for PHP applications, based on cost, performance, and control rather than formal benchmarks.</p>
<p>Years of running Proxmox-based private cloud infrastructure have made me a strong advocate for it over public cloud, for most workloads. Public cloud has its place, but for many PHP applications, especially those with predictable workloads and specific performance requirements, private infrastructure offers superior cost-effectiveness, performance, and control.</p>
<p>Let me break down the comparison based on technical analysis and infrastructure considerations.</p>
</section>
<section>
<h2>The Case for Proxmox Private Cloud</h2>
<h3>Cost Predictability</h3>
<p>Public cloud costs can spiral out of control, whereas with Proxmox you know exactly what you're paying:</p>
<ul>
<li><strong>Hardware costs:</strong> One-time purchase, depreciated over 3-5 years</li>
<li><strong>Electricity:</strong> Predictable monthly costs</li>
<li><strong>Maintenance:</strong> Planned hardware refresh cycles</li>
<li><strong>No surprise bills:</strong> No bandwidth charges, no storage tier surprises</li>
</ul>
<p>Organisations often find significant cost savings when migrating from public cloud to private infrastructure, particularly for predictable workloads with consistent resource requirements.</p>
<h3>Performance Control</h3>
<p>With Proxmox, you control the entire stack:</p>
<pre><code class="language-bash">{{SNIPPET:proxmox-vs-cloud/vm-config.conf}}</code></pre>
<p>This level of control is hard to get anywhere close to on public cloud, where you're sharing resources with noisy neighbours.</p>
<h3>Data Sovereignty</h3>
<p>Your data stays on your hardware, in your location. This is crucial for:</p>
<ul>
<li>GDPR compliance</li>
<li>Industry regulations (healthcare, finance)</li>
<li>Sensitive business data</li>
<li>Customer privacy concerns</li>
</ul>
</section>
<section>
<h2>Setting Up Proxmox for PHP Applications</h2>
<h3>Hardware Selection</h3>
<p>For PHP applications, I recommend:</p>
<ul>
<li><strong>CPU:</strong> AMD EPYC or Intel Xeon with high clock speeds</li>
<li><strong>RAM:</strong> 128GB+ for database caching and PHP opcache</li>
<li><strong>Storage:</strong> NVMe SSDs for database and application storage</li>
<li><strong>Network:</strong> 10GbE for inter-node communication</li>
</ul>
<h3>Proxmox Cluster Configuration</h3>
<pre><code class="language-bash">{{SNIPPET:proxmox-vs-cloud/corosync-cluster-config.conf}}</code></pre>
<h3>PHP-Optimised VM Templates</h3>
<p>Create standardised templates for your PHP applications:</p>
<pre><code class="language-bash">{{SNIPPET:proxmox-vs-cloud/vm-template.conf}}</code></pre>
</section>
<section>
<h2>When Public Cloud Makes Sense</h2>
<p>I'm not blindly against public cloud. It's appropriate for:</p>
<ul>
<li><strong>Highly variable workloads:</strong> Seasonal spikes, unpredictable traffic</li>
<li><strong>Global distribution:</strong> Need for edge locations worldwide</li>
<li><strong>Small teams:</strong> Lack of infrastructure expertise</li>
<li><strong>Rapid prototyping:</strong> Quick deployment for testing</li>
<li><strong>Regulatory requirements:</strong> Need for specific compliance certifications</li>
</ul>
</section>
<section>
<h2>Why Private Infrastructure Tends to Win on Performance</h2>
<h3>Database Performance</h3>
<p>No formal benchmarks here, just the reasoning behind why MySQL on Proxmox tends to outperform AWS RDS for a given spec:</p>
<ul>
<li><strong>Dedicated resources:</strong> No noisy neighbour effects</li>
<li><strong>Optimised storage:</strong> Direct NVMe access without virtualisation overhead</li>
<li><strong>Network latency:</strong> Local network communication</li>
<li><strong>Custom tuning:</strong> Database and application optimisation for specific workloads</li>
</ul>
<h3>PHP Application Performance</h3>
<p>The same reasoning applies to the PHP application tier. PHP applications often perform better on private infrastructure due to:</p>
<ul>
<li><strong>CPU affinity:</strong> Dedicated CPU cores for consistent performance</li>
<li><strong>Memory optimisation:</strong> Tuned opcache and buffer pool settings</li>
<li><strong>Storage performance:</strong> Local NVMe storage for session data and file operations</li>
<li><strong>Network latency:</strong> Reduced database connection overhead</li>
</ul>
</section>
<section>
<h2>Migration Strategy</h2>
<h3>Gradual Migration</h3>
<p>Don't migrate everything at once - start with:</p>
<ol>
<li><strong>Development environments:</strong> Low risk, learning opportunity</li>
<li><strong>Internal tools:</strong> Non-critical applications</li>
<li><strong>Staging environments:</strong> Performance testing</li>
<li><strong>Production databases:</strong> Biggest performance gains</li>
<li><strong>Application servers:</strong> Final migration</li>
</ol>
<h3>Hybrid Approach</h3>
<p>Use the best of both worlds:</p>
<ul>
<li><strong>Proxmox:</strong> Core applications, databases, consistent workloads</li>
<li><strong>Public cloud:</strong> CDN, backup storage, disaster recovery</li>
<li><strong>Edge computing:</strong> Public cloud for global presence</li>
</ul>
</section>
<section>
<h2>Operational Considerations</h2>
<h3>Monitoring and Alerting</h3>
<p>Monitoring is worth setting up properly, but there's a wrinkle: the Proxmox API returns JSON rather than Prometheus's text-exposition format, so scraping it directly doesn't work, and you need to route requests through <a href="https://github.com/prometheus-pve/prometheus-pve-exporter" target="_blank" rel="noopener">prometheus-pve-exporter</a> instead, which translates the API into real metrics:</p>
<pre><code class="language-yaml">{{SNIPPET:proxmox-vs-cloud/prometheus-config.yml}}</code></pre>
<h3>Backup Strategy</h3>
<p>Automated backups are crucial:</p>
<pre><code class="language-bash">{{SNIPPET:proxmox-vs-cloud/backup-script.sh}}</code></pre>
<h3>High Availability</h3>
<p>Configure HA for critical services:</p>
<pre><code class="language-bash">{{SNIPPET:proxmox-vs-cloud/ha-manager-commands.sh}}</code></pre>
</section>
<section>
<h2>Security Advantages</h2>
<h3>Network Isolation</h3>
<p>Complete control over network topology:</p>
<ul>
<li>VLANs for different environments</li>
<li>Firewall rules at the hypervisor level</li>
<li>No shared network with other tenants</li>
<li>Custom routing and load balancing</li>
</ul>
<h3>Physical Security</h3>
<p>It's your hardware, so you set the rules:</p>
<ul>
<li>Controlled access to servers</li>
<li>Hardware-level encryption</li>
<li>Secure disposal of storage</li>
<li>No multi-tenancy risks</li>
</ul>
</section>
<section>
<h2>Common Challenges and Solutions</h2>
<h3>Hardware Failures</h3>
<p>Plan for failures with redundancy:</p>
<ul>
<li>RAID configurations for storage</li>
<li>Redundant power supplies</li>
<li>Hot-swappable components</li>
<li>Cluster configuration for failover</li>
</ul>
<h3>Scaling Challenges</h3>
<p>Scaling requires planning:</p>
<ul>
<li>Design for horizontal scaling from the start</li>
<li>Use load balancers and auto-scaling scripts</li>
<li>Plan hardware refresh cycles</li>
<li>Implement proper monitoring for capacity planning</li>
</ul>
</section>
<section>
<h2>ROI Calculation</h2>
<p>Consider these factors when calculating ROI:</p>
<pre><code class="language-php">{{SNIPPET:proxmox-vs-cloud/tco-comparison.php}}</code></pre>
</section>
<section>
<h2>Choosing Between Proxmox and Public Cloud</h2>
<p>The infrastructure choice comes down to workload shape, not fashion:</p>
<ul>
<li><strong>Choose Proxmox</strong> if your workload is predictable, you have (or can build) in-house ops capability, and data residency or compliance requirements favour keeping hardware under your own control.</li>
<li><strong>Choose public cloud</strong> if your workload is genuinely spiky, you need global points of presence, or your team is too small to own hardware lifecycle and on-call.</li>
<li><strong>Choose a hybrid split</strong> if you have a stable core, such as databases and application servers, alongside genuinely elastic edges like CDN, backup, and disaster recovery; the two aren't mutually exclusive.</li>
</ul>
<p>The key is matching the infrastructure to your specific needs. For many PHP applications, especially those with steady workloads and clear performance requirements, Proxmox private cloud is the more cost-effective, more controllable choice.</p>
<p>Don't follow the crowd into public cloud just because it's trendy. Evaluate your specific needs, run the numbers, and choose the infrastructure that best serves your business requirements.</p>
</section>
<footer class="article-footer">
<div class="article-nav">
<a href="/articles" class="back-link">← Back to Articles</a>
</div>
</footer>
    `,
  },
  // Migrating: regex-strictness-code-paths.ejs
  {
    id: 'regex-strictness-code-paths',
    title: 'How Lenient Regex Patterns Explode Your Code Paths',
    description:
      'Why optional regex patterns create exponential complexity and how strict validation reduces maintenance burden through fail-fast principles.',
    date: '2025-09-26',
    category: CATEGORIES.php.id,
    readingTime: 5,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'programming',
    register: 'formal',
    heroImage: {
      src: '/images/regex-strictness-code-paths/hero.webp',
      alt: 'A black-and-white 1905 photograph of the interior of a Railway Post Office car, showing two facing walls of individually labelled pigeonhole mail-sorting racks lining a narrow aisle',
      ogImage: '/images/regex-strictness-code-paths/og.jpg',
      creditText:
        'Image: Smithsonian National Postal Museum, no known copyright restrictions, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Interior_of_a_Railway_Post_Office_Car_(2550262025).jpg',
    },
    content: `
<div class="intro">
            <p class="lead">A single optional group in a regex pattern can double your code paths, and multiple optional groups create exponential complexity. Learn why strict validation up front eliminates entire classes of bugs.</p>
        </div>

        <section>
            <h2>What Are Code Paths?</h2>
            <p>A <strong>code path</strong> is a unique route through your program based on conditional logic. Every <code>if</code> statement creates a branch, and every optional field creates a decision point.</p>

            <p>Consider this simple function:</p>

            <pre><code class="language-php">{{SNIPPET:regex-strictness-code-paths/simple-function.php}}
</code></pre>

            <p>This has <strong>2 code paths</strong>:</p>
            <ol>
                <li>Path A: <code>$value</code> is empty → call <code>handleEmpty()</code></li>
                <li>Path B: <code>$value</code> is not empty → call <code>handleValue()</code></li>
            </ol>

            <p>Add another optional parameter:</p>

            <pre><code class="language-php">{{SNIPPET:regex-strictness-code-paths/two-optionals.php}}
</code></pre>

            <p>Now we have <strong>4 code paths</strong>:</p>
            <ol>
                <li>Path A: <code>$value</code> empty, <code>$mimeType</code> null</li>
                <li>Path B: <code>$value</code> empty, <code>$mimeType</code> provided</li>
                <li>Path C: <code>$value</code> present, <code>$mimeType</code> null</li>
                <li>Path D: <code>$value</code> present, <code>$mimeType</code> provided</li>
            </ol>

            <p><strong>Each optional element doubles the paths</strong>, which is why lenient validation explodes complexity.</p>
        </section>

        <section>
            <h2>The Problem: Optional Matching</h2>
            <p>Consider validating a data URI. Should the MIME type be required or optional?</p>

            <pre><code class="language-php">{{SNIPPET:regex-strictness-code-paths/lenient-regex.php}}
</code></pre>

            <p>This pattern is dangerously lenient:</p>
            <ul>
                <li><strong>Missing "data:" prefix?</strong> Pattern requires it, but doesn't anchor</li>
                <li><strong>MIME type optional?</strong> The <code>.+?</code> allows anything</li>
                <li><strong>Missing ";base64," marker?</strong> Not checked</li>
                <li><strong>Invalid Base64 payload?</strong> Not validated</li>
            </ul>

            <p>Each ambiguity creates a decision point, and every decision point doubles the code paths downstream.</p>
        </section>

        <section>
            <h2>Code Path Explosion</h2>
            <p>When regex validation is loose, every consumer must handle edge cases:</p>

            <pre><code class="language-php">{{SNIPPET:regex-strictness-code-paths/lenient-consumer.php}}
</code></pre>

            <p><strong>Every function that processes data URIs must duplicate this logic.</strong></p>
        </section>

        <section>
            <h2>The Compounding Effect: 2<sup>N</sup> Explosion</h2>
            <p>With <strong>N optional items</strong>, you get <strong>2<sup>N</sup> possible code paths:</strong></p>

            <ul>
                <li><strong>1 optional item</strong> (MIME type): 2 paths</li>
                <li><strong>2 optional items</strong> (MIME type + parameters): 4 paths</li>
                <li><strong>3 optional items</strong> (MIME type + parameters + charset): 8 paths</li>
                <li><strong>4 optional items</strong>: 16 paths</li>
            </ul>

            <p>Each path needs testing, each path can harbour bugs, and each path increases maintenance burden.</p>

            <h3>Visual Flow: Lenient Validation</h3>
            <pre><code class="language-text">{{SNIPPET:regex-strictness-code-paths/lenient-flow.txt}}
</code></pre>

            <p><strong>16 paths, 16 test cases, 16 opportunities for bugs.</strong></p>

            <h3>Visual Flow: Strict Validation</h3>
            <pre><code class="language-text">{{SNIPPET:regex-strictness-code-paths/strict-flow.txt}}
</code></pre>

            <p><strong>2 paths, 2 test cases, zero ambiguity.</strong></p>
        </section>

        <section>
            <h2>The Solution: Strict Validation</h2>
            <p>Enforce a canonical format up front, and reject anything that doesn't conform:</p>

            <pre><code class="language-php">{{SNIPPET:regex-strictness-code-paths/strict-regex.php}}
</code></pre>

            <p><strong>Note:</strong> The <code>x</code> modifier at the end enables whitespace and inline comments in the pattern, making complex regex self-documenting.</p>

            <p>This pattern enforces:</p>
            <ul>
                <li><strong>Anchored start/end</strong> (<code>^...$</code>) - no extra garbage</li>
                <li><strong>Required MIME type</strong> (<code>type/subtype</code>) - must be present</li>
                <li><strong>Optional parameters</strong> (<code>;key=value</code> or <code>;key="quoted"</code>)</li>
                <li><strong>Required ";base64," marker</strong> - no ambiguity</li>
                <li><strong>Valid Base64 padding</strong> - strict encoding rules</li>
            </ul>

            <h3>Even Stricter: Eliminate ALL Optional Elements and Consolidate Validation</h3>
            <p>But wait - we still have optional parameters. And we're validating filename separately from the data URI. Let's consolidate everything into one pattern:</p>

            <pre><code class="language-php">{{SNIPPET:regex-strictness-code-paths/stricter-regex.php}}
</code></pre>

            <p>Now we have:</p>
            <ul>
                <li><strong>Single validation point</strong> - filename and data URI in one pattern</li>
                <li><strong>Zero optional elements</strong> - everything required, no parameters allowed</li>
                <li><strong>Required padding</strong> - Base64 must be properly padded</li>
                <li><strong>Filename security</strong> - no hidden files, path traversal, or spaces</li>
                <li><strong>Named capture groups</strong> - extract all data directly from matches</li>
            </ul>

            <p>This is about as strict as fail-fast validation gets: <strong>one regex, one validation, zero ambiguity, and no code paths left to handle variations</strong>.</p>
        </section>

        <section>
            <h2>The Payoff: Simplified Consumers</h2>
            <p>With strict validation and named capture groups, consumer code becomes trivial:</p>

            <pre><code class="language-php">{{SNIPPET:regex-strictness-code-paths/stricter-consumer.php}}
</code></pre>

            <p><strong>No defensive checks, no edge case handling, no duplicated validation logic, no substring manipulation - everything extracted in one pass.</strong></p>

            <p>Named capture groups (<code>(?&lt;name&gt;...)</code>) let you extract data directly from the <code>$matches</code> array using readable keys instead of numeric indices or additional parsing. Consolidating filename and data URI validation into a single pattern eliminates an entire validation step.</p>
        </section>

        <section>
            <h2>Fail Fast Principles</h2>
            <p>Strict validation embodies fail-fast design:</p>

            <ul>
                <li><strong>Detect problems early</strong> - at the boundary, not deep in business logic</li>
                <li><strong>Clear error messages</strong> - "Invalid data URI format" vs. "Unexpected null"</li>
                <li><strong>Prevent invalid state</strong> - system never sees malformed data</li>
                <li><strong>Reduce test matrix</strong> - fewer valid inputs = fewer test cases</li>
            </ul>
        </section>

        <section>
            <h2>When to Be Strict</h2>
            <p>Always be strict at <strong>system boundaries</strong>:</p>

            <ul>
                <li><strong>API inputs</strong> - validate request payloads strictly</li>
                <li><strong>User uploads</strong> - enforce filename and content rules</li>
                <li><strong>Configuration files</strong> - reject malformed settings</li>
                <li><strong>Database imports</strong> - validate schema compliance</li>
            </ul>

            <p>Leniency compounds, whilst strictness scales.</p>
        </section>

        <section>
            <h2>Key Takeaways</h2>
            <ul>
                <li><strong>Optional patterns double code paths</strong> - each optional group adds 2×complexity</li>
                <li><strong>Lenient validation creates technical debt</strong> - every consumer must handle edge cases</li>
                <li><strong>Strict validation eliminates bugs</strong> - invalid data never enters the system</li>
                <li><strong>Anchor your patterns</strong> - use <code>^...$</code> to prevent garbage</li>
                <li><strong>Fail fast at boundaries</strong> - reject bad input before it spreads</li>
            </ul>
        </section>

        <section>
            <h2>Conclusion</h2>
            <p>A regex pattern does more than validate, it forms a contract: a lenient contract creates ambiguity, ambiguity creates bugs, and a strict contract eliminates entire classes of errors.</p>

            <p>Choose strictness, and your future self will thank you.</p>
        </section>
    `,
  },
  // Migrating: reusable-openapi-classes-php-symfony.ejs
  {
    id: 'reusable-openapi-classes-php-symfony',
    title: 'Reusable OpenAPI Classes: Eliminating Boilerplate in PHP API Documentation',
    description:
      'A worked example of the DRY principle applied to Symfony API documentation: wrap swagger-php OpenAPI attributes in your own reusable response, parameter, and security classes so a single change updates every endpoint that uses it.',
    date: '2025-09-30',
    category: CATEGORIES.php.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    register: 'formal',
    heroImage: {
      src: '/images/reusable-openapi-classes-php-symfony/hero.webp',
      alt: 'A black-and-white photograph of a WWII-era Quonset hut encampment, dozens of identical prefabricated arched-roof huts arranged across a snowy site',
      ogImage: '/images/reusable-openapi-classes-php-symfony/og.jpg',
      creditText: 'Image: U.S. Navy, public domain, via Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Quonset_huts_at_Alaskan_base_c1943.jpg',
    },
    content: `
<div class="intro">
    <p class="lead">
        API documentation with <a href="https://www.openapis.org/" target="_blank" rel="noopener">OpenAPI</a> (formerly Swagger)
        often becomes bloated with repetitive attribute definitions scattered across dozens of controller methods. Every endpoint
        needs the same error responses, pagination parameters, and validation schemas - copied and pasted until your codebase
        looks like a documentation warehouse rather than application logic.
    </p>
    <p class="lead">
        This article demonstrates how to create reusable <a href="https://www.php.net/" target="_blank" rel="noopener">PHP</a>
        classes that encapsulate common OpenAPI patterns, transforming verbose attribute definitions into clean, maintainable code.
        By applying the <a href="https://en.wikipedia.org/wiki/Don%27t_repeat_yourself" target="_blank" rel="noopener">DRY principle</a>
        to API documentation, you'll reduce boilerplate substantially whilst ensuring consistency across your entire API surface.
    </p>
</div>

<section>
    <h2>The Problem: Repetitive OpenAPI Attributes</h2>
    <p>
        Modern PHP frameworks like <a href="https://symfony.com/" target="_blank" rel="noopener">Symfony</a> have embraced
        <a href="https://www.php.net/manual/en/language.attributes.overview.php" target="_blank" rel="noopener">PHP attributes</a>
        (introduced in PHP 8.0) for metadata declaration. Combined with tools like
        <a href="https://github.com/nelmio/NelmioApiDocBundle" target="_blank" rel="noopener">NelmioApiDocBundle</a>
        (version 5.6.2 as of September 2025) and <a href="https://github.com/zircote/swagger-php" target="_blank" rel="noopener">swagger-php</a>
        (version 5.4.0 as of September 2025), you can generate comprehensive
        <a href="https://spec.openapis.org/oas/v3.2.0.html" target="_blank" rel="noopener">OpenAPI 3.2</a> documentation
        directly from your code.
    </p>
    <p>
        However, the standard approach leads to massive code duplication. Consider this typical controller before applying reusable patterns:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/before-repetitive-attributes.php}}
</code></pre>

    <p>
        Notice the problems:
    </p>
    <ul>
        <li><strong>Repeated response definitions</strong> - Every endpoint defines 200, 400, 404 responses identically</li>
        <li><strong>Duplicated parameter schemas</strong> - Pagination parameters copy the same validation rules</li>
        <li><strong>Inconsistent descriptions</strong> - Similar endpoints use slightly different wording</li>
        <li><strong>Maintenance burden</strong> - Changing error formats requires updates across dozens of files</li>
        <li><strong>Difficult to enforce standards</strong> - No compile-time guarantees that responses match conventions</li>
    </ul>

    <p>
        In a real application with 50+ API endpoints, this pattern multiplies into thousands of lines of repetitive attribute definitions.
        The signal-to-noise ratio plummets, making it harder to understand what each endpoint actually does.
    </p>
</section>

<section>
    <h2>The Solution: Custom OpenAPI Attribute Classes</h2>
    <p>
        <a href="https://www.php.net/manual/en/language.attributes.syntax.php" target="_blank" rel="noopener">PHP attributes</a>
        are classes annotated with the <code>#[Attribute]</code> attribute. The OpenAPI attributes in swagger-php are just PHP classes
        extending base types like <code>OAResponse</code>, <code>OAParameter</code>, and <code>OARequestBody</code>.
        You can create your own attributes that extend these base classes, pre-configuring common patterns.
    </p>

    <p>
        This approach follows the same pattern as
        <a href="https://symfony.com/doc/current/routing.html#creating-custom-route-attributes" target="_blank" rel="noopener">Symfony's custom route attributes</a>,
        where you create specialised versions of framework attributes with application-specific defaults.
    </p>

    <h3>Setting Up the Foundation</h3>
    <p>
        First, ensure you have the necessary packages installed. As of September 2025, you'll need:
    </p>

    <pre><code class="language-bash">{{SNIPPET:reusable-openapi-classes-php-symfony/composer-require.sh}}
</code></pre>

    <p>
        Key requirements:
    </p>
    <ul>
        <li><strong><a href="https://www.php.net/releases/8.4/en.php" target="_blank" rel="noopener">PHP 8.4</a></strong> -
            Released November 2024, provides property hooks and asymmetric visibility</li>
        <li><strong><a href="https://symfony.com/doc/current/setup.html" target="_blank" rel="noopener">Symfony 6.4</a> or higher</strong> -
            Minimum version for NelmioApiDocBundle 5.x</li>
        <li><strong>NelmioApiDocBundle 5.6.2+</strong> - No longer supports annotations, attributes only</li>
        <li><strong>swagger-php 5.4.0+</strong> - Supports both <a href="https://spec.openapis.org/oas/v3.1.0.html" target="_blank" rel="noopener">OpenAPI 3.1</a>
            and <a href="https://spec.openapis.org/oas/v3.2.0.html" target="_blank" rel="noopener">OpenAPI 3.2</a></li>
    </ul>
</section>

<section>
    <h2>Creating Reusable Response Attributes</h2>
    <p>
        The most common source of duplication is response definitions. Every endpoint typically documents success, error,
        not-found, and validation failure responses. Let's create reusable classes for each pattern.
    </p>

    <h3>Success Response</h3>
    <p>
        Most successful API responses follow a standard pattern: HTTP 200 with a specific DTO model. Create a reusable
        success response that accepts the model class as a constructor parameter:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/success-response.php}}
</code></pre>

    <p>
        Key implementation details:
    </p>
    <ul>
        <li><strong><a href="https://www.php.net/manual/en/language.oop5.final.php" target="_blank" rel="noopener">Final class</a></strong> -
            Prevents inheritance that might break OpenAPI generation</li>
        <li><strong><a href="https://www.php.net/manual/en/language.attributes.classes.php" target="_blank" rel="noopener">Attribute targeting</a></strong> -
            <code>TARGET_METHOD</code> allows use on controller actions, <code>IS_REPEATABLE</code> permits multiple status codes</li>
        <li><strong><a href="https://github.com/nelmio/NelmioApiDocBundle/blob/master/src/Annotation/Model.php" target="_blank" rel="noopener">Model reference</a></strong> -
            Links to a DTO class for automatic schema generation</li>
        <li><strong>Consistent messaging</strong> - Provides sensible defaults whilst allowing customisation</li>
    </ul>

    <h3>Error Responses</h3>
    <p>
        Error responses should reference a standardised error DTO across all endpoints. Create specific response classes
        for each HTTP error status your API uses:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/bad-request-response.php}}
</code></pre>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/not-found-response.php}}
</code></pre>

    <p>
        These classes demonstrate important patterns:
    </p>
    <ul>
        <li><strong>HTTP status constants</strong> - Use <a href="https://symfony.com/doc/current/components/http_foundation.html" target="_blank" rel="noopener">Symfony's HttpFoundation</a>
            constants instead of magic numbers</li>
        <li><strong>Optional customisation</strong> - Accept nullable parameters for context-specific descriptions</li>
        <li><strong>Centralised error schema</strong> - All errors reference <code>ErrorDto</code>, ensuring consistent error structures</li>
        <li><strong>Semantic naming</strong> - Resource-aware descriptions improve documentation clarity</li>
    </ul>

    <h3>Validation Error Response</h3>
    <p>
        Validation errors (HTTP 422 Unprocessable Entity) deserve special handling since they provide field-level feedback:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/validation-error-response.php}}
</code></pre>

    <p>
        This separates validation errors from general bad request errors (HTTP 400), providing clearer semantics about
        whether the issue is syntactic (400) or semantic (422). The referenced <code>ValidationErrorDto</code> follows
        the same pattern as the <code>ErrorDto</code> shown later in this article, with an added field-level
        <code>errors</code> property carrying per-field validation messages.
    </p>
</section>

<section>
    <h2>Creating Reusable Parameter Attributes</h2>
    <p>
        Parameters suffer from similar duplication issues. Pagination, ID parameters, sorting, and filtering appear across
        many endpoints with identical schemas. Standardise these with custom parameter classes.
    </p>

    <h3>ID Path Parameter</h3>
    <p>
        Nearly every REST API has endpoints that accept an integer ID in the path:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/id-parameter.php}}
</code></pre>

    <p>
        This class encodes your API's conventions:
    </p>
    <ul>
        <li><strong>Integer type</strong> - IDs are integers, not strings or UUIDs</li>
        <li><strong>Positive integers</strong> - Minimum value of 1 prevents negative or zero IDs</li>
        <li><strong>Maximum validation</strong> - Uses <code>PHP_INT_MAX</code> for platform-specific limits</li>
        <li><strong>Customisable name</strong> - Supports endpoints with multiple IDs (<code>userId</code>, <code>orderId</code>)</li>
    </ul>

    <h3>Pagination Parameters</h3>
    <p>
        Pagination appears on virtually every list endpoint. Create dedicated classes for page and limit parameters:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/page-parameter.php}}
</code></pre>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/limit-parameter.php}}
</code></pre>

    <p>
        These classes establish pagination conventions:
    </p>
    <ul>
        <li><strong>1-indexed pages</strong> - Clarifies that page 1 is the first page (not 0)</li>
        <li><strong>Configurable defaults</strong> - Different endpoints can have different page sizes</li>
        <li><strong>Maximum limits</strong> - Prevents clients from requesting thousands of records at once</li>
        <li><strong>Optional parameters</strong> - <code>required: false</code> allows defaults to apply</li>
    </ul>
</section>

<section>
    <h2>Creating Reusable Request Body Attributes</h2>
    <p>
        POST and PUT endpoints typically accept JSON request bodies. Create a wrapper that handles the common case:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/request-body.php}}
</code></pre>

    <p>
        This eliminates the need to manually specify <code>content</code>, <code>required</code>, and model references
        for every endpoint that accepts input. The <code>Model</code> annotation tells NelmioApiDocBundle to generate
        the JSON schema from the specified DTO class.
    </p>
</section>

<section>
    <h2>Before and After Comparison</h2>
    <p>
        Let's see the transformation in action. Here's the same controller using our reusable attribute classes:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/after-with-reusable.php}}
</code></pre>

    <p>
        The improvements are dramatic:
    </p>
    <ul>
        <li><strong>61% fewer lines of code</strong> - From 72 lines to 28 lines of attributes</li>
        <li><strong>No nested attribute definitions</strong> - Each attribute is a simple, flat declaration</li>
        <li><strong>Consistent terminology</strong> - All endpoints use the same description patterns</li>
        <li><strong>Easier to scan</strong> - The endpoint's purpose is immediately clear</li>
        <li><strong>Type-safe</strong> - Constructor parameters are validated by PHP's type system</li>
    </ul>

    <p>
        More importantly, changing error response formats now requires updating a single class instead of hunting through
        dozens of controllers. Need to add a <code>timestamp</code> field to all error responses? Modify <code>ErrorDto</code>
        and every endpoint's documentation updates automatically.
    </p>
</section>

<section>
    <h2>Building a Complete CRUD Controller</h2>
    <p>
        Here's a full CRUD (Create, Read, Update, Delete) controller demonstrating all the reusable attributes in action:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/complete-example.php}}
</code></pre>

    <p>
        This controller demonstrates:
    </p>
    <ul>
        <li><strong>Route constants</strong> - Class constants eliminate duplicated route strings between <code>#[Route]</code>
            and <code>#[OAGet]</code> attributes, ensuring the path definition remains synchronised</li>
        <li><strong>Consistent documentation</strong> - All five endpoints follow the same patterns</li>
        <li><strong>Minimal boilerplate</strong> - The attributes read almost like plain English</li>
        <li><strong>Customisable defaults</strong> - The <code>listUsers</code> endpoint overrides pagination defaults</li>
        <li><strong>Semantic HTTP status codes</strong> - 201 for creation, 204 for deletion</li>
        <li><strong>Clear endpoint purpose</strong> - You can understand what each method does at a glance</li>
    </ul>
</section>

<section>
    <h2>Organising Reusable OpenAPI Classes</h2>
    <p>
        Structure your reusable OpenAPI classes for discoverability and maintainability:
    </p>

    <pre><code class="language-plaintext">{{SNIPPET:reusable-openapi-classes-php-symfony/directory-structure.txt}}
</code></pre>

    <p>
        This structure provides clear separation:
    </p>
    <ul>
        <li><strong>OpenApi/Response/</strong> - All response status codes (success, errors, redirects)</li>
        <li><strong>OpenApi/Parameter/</strong> - Reusable query, path, and header parameters</li>
        <li><strong>OpenApi/JsonRequestBody.php</strong> - Request body wrapper</li>
        <li><strong>Dto/</strong> - Data transfer objects that define response/request schemas</li>
    </ul>

    <p>
        Naming conventions matter:
    </p>
    <ul>
        <li>Prefix classes with <code>Oa</code> or nest under <code>OpenApi</code> namespace</li>
        <li>Use descriptive names that match HTTP semantics (<code>NotFoundResponse</code> not <code>Error404</code>)</li>
        <li>Keep parameter names consistent across endpoints (<code>page</code>, not <code>pageNum</code> or <code>pageNumber</code>)</li>
    </ul>
</section>

<section>
    <h2>Creating the Error DTO</h2>
    <p>
        Your error responses need a consistent structure. Here's a standard error DTO that all error response classes reference:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/error-dto.php}}
</code></pre>

    <p>
        This DTO demonstrates OpenAPI best practices:
    </p>
    <ul>
        <li><strong>Schema attribute</strong> - Defines how the DTO appears in OpenAPI documentation</li>
        <li><strong><a href="https://www.php.net/manual/en/language.oop5.properties.php#language.oop5.properties.readonly-properties" target="_blank" rel="noopener">Readonly properties</a></strong> -
            Ensures immutability of error objects</li>
        <li><strong>Property descriptions</strong> - Each field is documented with <code>OAProperty</code> attributes</li>
        <li><strong>Optional details</strong> - Allows including field-level validation errors or debug information</li>
        <li><strong>Machine-readable error codes</strong> - The <code>error</code> field uses constants, not free-form text</li>
    </ul>
</section>

<section>
    <h2>Advanced Patterns</h2>

    <h3>Paginated Collection Responses</h3>
    <p>
        Many APIs return paginated collections with metadata. Create a specialised response for this pattern:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/paginated-response.php}}
</code></pre>

    <p>
        Usage in a controller:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/paginated-usage.php}}
</code></pre>

    <h3>Security Scheme Attributes</h3>
    <p>
        For endpoints requiring authentication, declare the security scheme once and reference it by name from
        individual operations - a <code>SecurityScheme</code> only defines an authentication method, it doesn't
        attach that method to any particular endpoint:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/bearer-security.php}}
</code></pre>

    <p>
        Usage in a protected endpoint - the operation references the scheme by name
        (<code>security: [['bearerAuth' => []]]</code>) rather than instantiating it directly:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/security-usage.php}}
</code></pre>
</section>

<section>
    <h2>Benefits Beyond Code Reduction</h2>
    <p>
        The advantages of reusable OpenAPI classes extend far beyond reducing line count:
    </p>

    <h3>Type Safety</h3>
    <p>
        When you use <code>#[SuccessResponse(UserDto::class)]</code>, PHP's type system ensures <code>UserDto::class</code>
        exists at compile time. Typos in class names cause immediate errors rather than generating broken documentation at runtime.
    </p>

    <h3>IDE Support</h3>
    <p>
        Modern IDEs like <a href="https://www.jetbrains.com/phpstorm/" target="_blank" rel="noopener">PhpStorm</a> provide
        autocompletion for constructor parameters. When you type <code>#[PageParameter(</code>, the IDE suggests available parameters
        with their types and default values.
    </p>

    <h3>Easier Refactoring</h3>
    <p>
        Need to change your pagination parameter from <code>page</code> to <code>pageNumber</code>? Update the <code>PageParameter</code>
        class and every endpoint's documentation updates automatically, with no search-and-replace across dozens of files.
    </p>

    <h3>Consistent API Design</h3>
    <p>
        New team members use existing response classes by default, naturally following your API conventions. The reusable classes
        encode your API style guide as executable code rather than a document that gets out of sync.
    </p>

    <h3>Testability</h3>
    <p>
        You can unit test your OpenAPI classes to ensure they generate the expected attribute structures:
    </p>

    <pre><code class="language-php">{{SNIPPET:reusable-openapi-classes-php-symfony/success-response-test.php}}
</code></pre>

    <h3>Runtime Validation</h3>
    <p>
        Beyond generating documentation, you can validate actual HTTP requests and responses against your OpenAPI specification
        using <a href="https://github.com/thephpleague/openapi-psr7-validator" target="_blank" rel="noopener">league/openapi-psr7-validator</a>.
        This library validates PSR-7 messages against your generated OpenAPI spec, catching mismatches between documentation and implementation.
    </p>
    <p>
        This is particularly valuable in testing environments where you can assert that your actual API responses match the
        documented schemas. When combined with reusable OpenAPI classes, you get compile-time type safety for documentation
        structure and runtime validation that responses conform to those documented contracts.
    </p>
</section>

<section>
    <h2>Common Pitfalls and Solutions</h2>

    <h3>Forgetting IS_REPEATABLE</h3>
    <p>
        If you omit <code>Attribute::IS_REPEATABLE</code>, PHP allows only one instance of your attribute per method, which
        breaks as soon as you try to document multiple response status codes, so always include <code>IS_REPEATABLE</code>
        on response attributes.
    </p>

    <h3>Breaking OpenAPI Generation</h3>
    <p>
        The <code>swagger-php</code> library uses reflection to analyse your attributes. If you add public properties
        that don't map to OpenAPI properties, generation might fail. Keep your custom classes minimal and delegate
        to parent constructors.
    </p>

    <h3>Overusing Customisation</h3>
    <p>
        The point of reusable classes is consistency. If you find yourself adding many optional constructor parameters
        to support edge cases, you might be better off using the standard OpenAPI attributes directly for those specific endpoints.
    </p>

    <h3>Namespace Collisions</h3>
    <p>
        Be careful when naming your classes, since <code>Response</code> collides with Symfony's own <code>Response</code> class,
        so either use fully qualified names or create unique names like <code>SuccessResponse</code> instead of <code>Response</code>.
    </p>
</section>

<section>
    <h2>Generating and Viewing Documentation</h2>
    <p>
        After creating your reusable attributes and applying them to controllers, generate the OpenAPI documentation:
    </p>

    <pre><code class="language-bash">{{SNIPPET:reusable-openapi-classes-php-symfony/generate-docs.sh}}
</code></pre>

    <p>
        NelmioApiDocBundle includes a built-in <a href="https://swagger.io/tools/swagger-ui/" target="_blank" rel="noopener">Swagger UI</a>
        interface at <code>/api/doc</code> where you can test endpoints interactively. The generated documentation includes
        all the descriptions, examples, and schemas from your reusable attribute classes.
    </p>

    <h3>Integrating with API Development Tools</h3>
    <p>
        Export your OpenAPI specification for use with:
    </p>
    <ul>
        <li><strong><a href="https://www.postman.com/" target="_blank" rel="noopener">Postman</a></strong> -
            Import the JSON/YAML to generate a collection</li>
        <li><strong><a href="https://insomnia.rest/" target="_blank" rel="noopener">Insomnia</a></strong> -
            Load the specification for API testing</li>
        <li><strong><a href="https://stoplight.io/" target="_blank" rel="noopener">Stoplight Studio</a></strong> -
            Visual API design and documentation</li>
        <li><strong><a href="https://github.com/OpenAPITools/openapi-generator" target="_blank" rel="noopener">OpenAPI Generator</a></strong> -
            Generate client libraries in multiple languages</li>
    </ul>
</section>

<section>
    <h2>Real-World Impact</h2>
    <p>
        As a rough guide, on a production API with 50-100 endpoints you can expect reusable OpenAPI classes to bring:
    </p>
    <ul>
        <li><strong>A substantial cut in OpenAPI-related code</strong> - the worked example earlier in this article
            shows roughly 61% fewer attribute lines for two endpoints; the saving compounds as more endpoints adopt
            the same classes</li>
        <li><strong>Faster onboarding</strong> - New developers understand patterns immediately</li>
        <li><strong>Fewer documentation bugs</strong> - Centralised definitions prevent inconsistencies</li>
        <li><strong>Easier API evolution</strong> - Changes propagate automatically across endpoints</li>
        <li><strong>Better IDE experience</strong> - Autocompletion and type checking catch errors early</li>
    </ul>

    <p>
        The time investment is modest. Sketching out an initial set of reusable classes is typically a short, focused
        task rather than a major undertaking, and applying them to an existing codebase is largely mechanical - find
        the repeated attribute blocks and swap them for the reusable class. The maintenance benefits compound over
        months and years as your API grows.
    </p>
</section>

<section>
    <h2>Migration Strategy</h2>
    <p>
        If you have an existing API with traditional OpenAPI attributes, migrate gradually:
    </p>

    <ol>
        <li><strong>Create reusable classes</strong> - Start with response classes (<code>SuccessResponse</code>,
            <code>BadRequestResponse</code>, <code>NotFoundResponse</code>)</li>
        <li><strong>Apply to new endpoints</strong> - Use reusable classes for all new development</li>
        <li><strong>Migrate high-traffic endpoints</strong> - Convert frequently modified controllers first</li>
        <li><strong>Expand the library</strong> - Add parameter classes (<code>PageParameter</code>, <code>IdParameter</code>)
            as patterns emerge</li>
        <li><strong>Convert remaining endpoints</strong> - Gradually refactor older code during routine maintenance</li>
    </ol>

    <p>
        You don't need to convert everything at once. The reusable classes coexist happily with standard OpenAPI attributes,
        allowing incremental migration.
    </p>
</section>

<section>
    <h2>Conclusion</h2>
    <p>
        OpenAPI documentation is essential for modern APIs, but it shouldn't drown your codebase in boilerplate. By creating
        reusable PHP attribute classes that encapsulate common OpenAPI patterns, you transform verbose, repetitive attribute
        definitions into clean, maintainable code.
    </p>

    <p>
        The approach demonstrated here applies the DRY principle to API documentation, yielding benefits that extend beyond
        code reduction. You gain type safety, IDE support, easier refactoring, and most importantly, a codebase where endpoint
        logic remains visible instead of being buried under documentation attributes.
    </p>

    <p>
        As your API evolves, these reusable classes become more valuable. Changing response formats, adding security requirements,
        or updating error handling patterns becomes trivial when you have centralised, type-safe OpenAPI definitions, and your
        documentation stays consistent with far less effort spent keeping it that way.
    </p>

    <p>
        Start with a few response classes, and once you feel the improvement, you'll probably wonder how you ever tolerated
        the old approach.
    </p>
</section>

<section>
    <h2>Additional Resources</h2>
    <ul>
        <li><a href="https://spec.openapis.org/" target="_blank" rel="noopener">OpenAPI Specification</a> - Official specification repository</li>
        <li><a href="https://github.com/nelmio/NelmioApiDocBundle" target="_blank" rel="noopener">NelmioApiDocBundle</a> -
            Symfony bundle for OpenAPI generation</li>
        <li><a href="https://github.com/zircote/swagger-php" target="_blank" rel="noopener">swagger-php</a> -
            PHP library for OpenAPI annotations and attributes</li>
        <li><a href="https://www.php.net/manual/en/language.attributes.php" target="_blank" rel="noopener">PHP Attributes</a> -
            Official PHP manual on attributes</li>
        <li><a href="https://symfony.com/doc/current/index.html" target="_blank" rel="noopener">Symfony Documentation</a> -
            Comprehensive framework documentation</li>
        <li><a href="https://swagger.io/tools/swagger-ui/" target="_blank" rel="noopener">Swagger UI</a> -
            Interactive API documentation interface</li>
        <li><a href="https://www.php-fig.org/psr/" target="_blank" rel="noopener">PHP-FIG PSR Standards</a> -
            PHP Standards Recommendations including PSR-7 (HTTP Messages)</li>
    </ul>
</section>
    `,
  },
  // Migrating: scalable-php-apis.ejs
  {
    id: 'scalable-php-apis',
    title: 'Building Scalable Backend APIs with Modern PHP',
    description:
      'Comprehensive guide to building scalable, maintainable PHP APIs using modern architecture patterns',
    date: '2024-12-15',
    category: CATEGORIES.php.id,
    heroImage: {
      src: '/images/scalable-php-apis/hero.webp',
      alt: 'Multiple grain elevator structures of different eras and construction methods built alongside each other in the Buffalo, NY grain elevator district, with rail sidings converging in the foreground',
      ogImage: '/images/scalable-php-apis/og.jpg',
      creditText: 'Image: HAER/National Park Service, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:(Left_to_right)American_elevator,_Canagra_Mill,_Lake_and_rail_elevator,_marine_A._-_Buffalo_Grain_Elevators,_Buffalo,_Erie_County,_NY_HAER_NY,15-BUF,27-2.tif',
    },
    readingTime: 16,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'PHP',
    register: 'formal',
    content: `
<section class="intro">
<p class="lead">
Architectural patterns and best practices for creating robust, scalable backend systems using modern PHP.
</p>
</section>
<section>
<p>Building scalable APIs means creating systems that can grow alongside your business whilst holding onto performance, reliability, and maintainability, even under heavy traffic. Modern PHP gives you solid tools for building APIs that can cope with that kind of growth.</p>
<p>This article covers architectural patterns, design principles, and implementation strategies for building APIs that scale from thousands to millions of users.</p>
<h2>API Architecture Principles</h2>
<h3>Layered Architecture</h3>
<p>Separate concerns into distinct layers for better maintainability and testability:</p>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/layered-architecture.php}}</code></pre>
<h3>Domain-Driven Design</h3>
<p>Model your business domain explicitly:</p>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/domain-driven-design.php}}</code></pre>
</section>
<section>
<h2>API Design Patterns</h2>
<h3>CQRS (Command Query Responsibility Segregation)</h3>
<p>Separate read and write operations for better scalability:</p>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/cqrs-pattern.php}}</code></pre>
<p><code>UserReadModel</code> caches the raw database row rather than the hydrated object, then rebuilds <code>UserView</code> on both the cache-hit and cache-miss paths. That's a deliberate choice: it means the cache round-trip goes through <code>json_encode()</code>/<code>json_decode()</code> rather than PHP's native <code>serialize()</code>/<code>unserialize()</code>, which is a well-known object-injection vector when applied to data an attacker could tamper with.</p>
<h3>Event-Driven Architecture</h3>
<p>Decouple components using events:</p>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/event-driven-architecture.php}}</code></pre>
</section>
<section>
<h2>Performance Optimisation</h2>
<h3>Database Connection Pooling</h3>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/database-connection-pool.php}}</code></pre>
<p>This pattern only pools connections within a single persistent process (Swoole, RoadRunner, or a long-running worker). A standard PHP-FPM deployment spins up or reuses a fresh process per request, so an instance property like <code>$connections</code> does not survive between requests and provides no real pooling benefit. On PHP-FPM, reach for <code>PDO::ATTR_PERSISTENT</code>, an external pooler such as PgBouncer or ProxySQL, or a supervisor-managed long-running process instead.</p>
<h3>Response Caching</h3>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/response-cache.php}}</code></pre>
</section>
<section>
<h2>Rate Limiting and Throttling</h2>
<h3>Token Bucket Algorithm</h3>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/token-bucket-rate-limiter.php}}</code></pre>
<h3>Sliding Window Rate Limiter</h3>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/sliding-window-rate-limiter.php}}</code></pre>
</section>
<section>
<h2>Error Handling and Resilience</h2>
<h3>Circuit Breaker Pattern</h3>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/circuit-breaker.php}}</code></pre>
</section>
<section>
<h2>API Security</h2>
<h3>JWT Authentication</h3>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/jwt-authentication.php}}</code></pre>
</section>
<section>
<h2>API Documentation and Versioning</h2>
<h3>OpenAPI Documentation</h3>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/openapi-documentation.php}}</code></pre>
</section>
<section>
<h2>Monitoring and Observability</h2>
<h3>Metrics Collection</h3>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/metrics-collector.php}}</code></pre>
</section>
<section>
<h2>Testing Strategies</h2>
<h3>API Testing</h3>
<p>The example below is a Laravel <code>TestCase</code> (it relies on Laravel's <code>assertJsonStructure</code> and <code>assertDatabaseHas</code> helpers). Swap those for the equivalent assertions if you're on a framework-agnostic PHPUnit setup.</p>
<pre><code class="language-php">{{SNIPPET:scalable-php-apis/api-testing.php}}</code></pre>
</section>
<section>
<h2>Scalable API Checklist</h2>
<ul>
<li><strong>Layered architecture:</strong> Separate concerns into distinct layers</li>
<li><strong>Domain modelling:</strong> Use domain-driven design principles</li>
<li><strong>CQRS:</strong> Separate read and write operations</li>
<li><strong>Event-driven:</strong> Use events for loose coupling</li>
<li><strong>Caching:</strong> Cache at multiple levels</li>
<li><strong>Rate limiting:</strong> Protect against abuse</li>
<li><strong>Circuit breakers:</strong> Handle external service failures</li>
<li><strong>Security:</strong> Implement proper authentication and authorisation</li>
<li><strong>Documentation:</strong> Maintain up-to-date API documentation</li>
<li><strong>Monitoring:</strong> Collect metrics and logs</li>
<li><strong>Testing:</strong> Comprehensive testing strategy</li>
</ul>
<p>Building scalable APIs requires careful planning and implementation of proven patterns. Start with a solid architectural foundation, implement proper caching and rate limiting, and continuously monitor and optimise performance, remembering that scalability is about building systems that can evolve and grow with your business needs, not just about handling more requests.</p>
</section>
    `,
  },
  // Migrating: typescript-di-for-php-developers.ejs
  {
    id: 'typescript-di-for-php-developers',
    title: "TypeScript Dependency Injection: A PHP Developer's Perspective",
    description:
      'Understanding the fundamental differences between dependency injection in TypeScript and PHP, from structural typing to the lack of standardisation.',
    date: '2025-07-23',
    category: CATEGORIES.typescript.id,
    readingTime: 15,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'typescript',
    register: 'formal',
    heroImage: {
      src: '/images/typescript-di-for-php-developers/hero.webp',
      alt: 'An 1846 engraving of porters transferring luggage between broad-gauge and narrow-gauge trains at Gloucester station, where incompatible railway gauges forced everything to be handed across the platform',
      ogImage: '/images/typescript-di-for-php-developers/og.jpg',
      creditText: 'Image: J. H. Townshend, 1846, public domain, via Wikimedia Commons',
      creditUrl: 'https://commons.wikimedia.org/wiki/File:Break_of_gauge_GWR_Gloucester.jpg',
    },
    content: `
<div class="intro">
    <p class="lead">
        As a PHP developer, you're likely accustomed to mature DI containers like
        <a href="https://symfony.com/doc/current/service_container.html" target="_blank" rel="noopener">Symfony's Service Container</a> or 
        <a href="https://php-di.org/" target="_blank" rel="noopener">PHP-DI</a>. TypeScript's approach to dependency injection 
        is fundamentally different, and the difference runs deeper than implementation detail, right into the philosophy behind it. Let's explore why.
    </p>
</div>

<section>
    <h2>The Fundamental Difference: Type Systems</h2>
    <p>
        Before diving into DI specifics, we need to understand the core difference between PHP and TypeScript's type systems:
    </p>
    
    <h3>PHP: Nominal Typing</h3>
    <p>
        PHP uses <strong><a href="https://www.php.net/manual/en/language.types.type-system.php" target="_blank" rel="noopener">nominal typing</a></strong>, where types are based on explicit declarations, and a class must explicitly
        <a href="https://www.php.net/manual/en/language.oop5.interfaces.php#language.oop5.interfaces.implements" target="_blank" rel="noopener">implement</a> an interface or extend a class to be considered compatible:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:typescript-di/nominal-typing.php}}
</code></pre>

    <h3>TypeScript: Structural Typing</h3>
    <p>
        TypeScript uses <strong><a href="https://www.typescriptlang.org/docs/handbook/type-compatibility.html#structural-typing" target="_blank" rel="noopener">structural typing</a></strong> (also called "<a href="https://en.wikipedia.org/wiki/Duck_typing" target="_blank" rel="noopener">duck typing</a>"). If it walks like a duck 
        and quacks like a duck, it's a duck:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/structural-typing.ts}}
</code></pre>

    <p>
        This fundamental difference cascades through everything, including how dependency injection works.
    </p>
</section>

<section>
    <h2>No Final Classes: Everything Is Mockable</h2>
    <p>
        In PHP, you might use <a href="https://www.php.net/manual/en/language.oop5.final.php" target="_blank" rel="noopener"><code>final</code></a> to prevent inheritance:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:typescript-di/final-class.php}}
</code></pre>

    <p>
        TypeScript has <strong>no concept of <a href="https://github.com/microsoft/TypeScript/issues/8306" target="_blank" rel="noopener">final classes</a></strong>. This design choice, combined with structural typing, 
        means <em>everything</em> can be mocked or stubbed for testing:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/mocking-example.ts}}
</code></pre>

    <p>
        This is both liberating and dangerous. It makes testing easier, but you can't enforce 
        certain architectural boundaries through the <a href="https://www.typescriptlang.org/docs/handbook/2/types-from-types.html" target="_blank" rel="noopener">type system</a> alone.
    </p>
</section>

<section>
    <h2>The Fragmented Landscape: No Standard DI</h2>
    <p>
        PHP has converged around the <a href="https://www.php-fig.org/psr/psr-11/" target="_blank" rel="noopener">PSR-11 Container Interface</a>, and most frameworks implement compatible containers, whereas TypeScript
        is still very much the Wild West.
    </p>

    <h3>Popular TypeScript DI Libraries (as of July 2025)</h3>
    
    <h4><a href="https://github.com/inversify/InversifyJS" target="_blank" rel="noopener">InversifyJS</a></h4>
    <ul>
        <li>The most mature option, inspired by <a href="https://github.com/ninject/Ninject" target="_blank" rel="noopener">.NET's Ninject</a></li>
        <li>Heavy use of <a href="https://www.typescriptlang.org/docs/handbook/decorators.html" target="_blank" rel="noopener">decorators</a> and metadata</li>
        <li>Requires <a href="https://github.com/rbuckton/reflect-metadata" target="_blank" rel="noopener"><code>reflect-metadata</code></a> polyfill</li>
        <li>More ceremonial, closer to traditional DI containers</li>
    </ul>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/inversify-example.ts}}
</code></pre>

    <h4><a href="https://github.com/microsoft/tsyringe" target="_blank" rel="noopener">TSyringe</a> (Microsoft)</h4>
    <ul>
        <li>Lightweight, minimalist approach</li>
        <li>Also decorator-based with <a href="https://github.com/rbuckton/reflect-metadata" target="_blank" rel="noopener"><code>reflect-metadata</code></a></li>
        <li>Supports circular dependencies</li>
        <li>Less configuration than InversifyJS</li>
    </ul>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/tsyringe-example.ts}}
</code></pre>

    <h4>Manual DI / Pure Functions</h4>
    <p>
        Many TypeScript developers skip DI containers entirely. They prefer manual dependency injection 
        or functional approaches:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/manual-di.ts}}
</code></pre>
</section>

<section>
    <h2>The Interface Problem</h2>
    <p>
        In PHP, <a href="https://www.php.net/manual/en/language.oop5.interfaces.php" target="_blank" rel="noopener">interfaces exist at runtime</a>. You can type-hint against them:
    </p>
    
    <pre><code class="language-php">{{SNIPPET:typescript-di/php-interface.php}}
</code></pre>

    <p>
        TypeScript interfaces <strong>don't exist at runtime</strong>, they're compile-time only, which creates
        challenges for DI containers:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/interface-problem.ts}}
</code></pre>

    <p>
        This is why TypeScript DI libraries rely heavily on:
    </p>
    <ul>
        <li><strong><a href="https://www.typescriptlang.org/docs/handbook/decorators.html" target="_blank" rel="noopener">Decorators</a></strong> to add metadata at runtime</li>
        <li><strong>Injection tokens</strong> (<a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Symbol" target="_blank" rel="noopener">Symbols</a> or strings) to identify dependencies</li>
        <li><strong><a href="https://github.com/rbuckton/reflect-metadata" target="_blank" rel="noopener">reflect-metadata</a></strong> to preserve type information</li>
    </ul>
</section>

<section>
    <h2>Configuration Complexity</h2>
    <p>
        Setting up DI in TypeScript requires more boilerplate than PHP. Here's what you need:
    </p>

    <h3><a href="https://www.typescriptlang.org/tsconfig" target="_blank" rel="noopener">tsconfig.json</a> Requirements</h3>
    <pre><code class="language-json">{{SNIPPET:typescript-di/tsconfig.json}}
</code></pre>

    <h3>Polyfill Setup</h3>
    <p>
        First, install the required packages using <a href="https://www.npmjs.com/" target="_blank" rel="noopener">npm</a> or 
        <a href="https://yarnpkg.com/" target="_blank" rel="noopener">yarn</a>:
    </p>
    <pre><code class="language-bash">{{SNIPPET:typescript-di/install-commands.sh}}</code></pre>
    
    <p>Then configure your entry point:</p>
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/polyfill-setup.ts}}
</code></pre>

    <p>
        Compare this to PHP, where DI typically "just works" with minimal configuration.
    </p>
</section>

<section>
    <h2>Testing: The Good and The Bad</h2>
    
    <h3>The Good: Ultimate Flexibility</h3>
    <p>
        TypeScript's structural typing makes creating test doubles trivial. Testing frameworks like 
        <a href="https://jestjs.io/" target="_blank" rel="noopener">Jest</a>, <a href="https://mochajs.org/" target="_blank" rel="noopener">Mocha</a>, 
        or <a href="https://vitest.dev/" target="_blank" rel="noopener">Vitest</a> make mocking incredibly simple:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/testing-good.ts}}
</code></pre>

    <h3>The Bad: No Compile-Time Safety</h3>
    <p>
        Without final classes or sealed types, you can't prevent certain anti-patterns:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/testing-bad.ts}}
</code></pre>
</section>

<section>
    <h2>Architectural Implications</h2>

    <h3>1. Boundaries are Conventions, Not Constraints</h3>
    <p>
        In PHP, you can enforce architectural boundaries through <a href="https://www.php.net/manual/en/language.oop5.visibility.php" target="_blank" rel="noopener">visibility modifiers</a> and <a href="https://www.php.net/manual/en/language.oop5.final.php" target="_blank" rel="noopener">final classes</a>. 
        In TypeScript, these boundaries are more <a href="https://www.typescriptlang.org/docs/handbook/2/classes.html#member-visibility" target="_blank" rel="noopener">suggestions than rules</a>.
    </p>

    <h3>2. Runtime Type Checking</h3>
    <p>
        Since TypeScript types disappear at runtime, you might need libraries like 
        <a href="https://github.com/colinhacks/zod" target="_blank" rel="noopener">Zod</a> or 
        <a href="https://github.com/ianstormtaylor/superstruct" target="_blank" rel="noopener">Superstruct</a> 
        for runtime validation. PHP handles this natively.
    </p>

    <h3>3. Framework Lock-in</h3>
    <p>
        Each TypeScript framework tends to have its own DI approach:
    </p>
    <ul>
        <li><strong><a href="https://angular.io/guide/dependency-injection" target="_blank" rel="noopener">Angular</a></strong> - Built-in DI system</li>
        <li><strong><a href="https://docs.nestjs.com/fundamentals/injection-scopes" target="_blank" rel="noopener">NestJS</a></strong> - Modified Angular DI for backend</li>
        <li><strong><a href="https://nodejs.org/" target="_blank" rel="noopener">Vanilla Node.js</a></strong> - Choose your own adventure</li>
    </ul>
</section>

<section>
    <h2>Practical Recommendations</h2>

    <h3>For PHP Developers Moving to TypeScript</h3>
    
    <h4>1. Start Simple</h4>
    <p>
        Don't immediately reach for a DI container. TypeScript's module system and manual DI are often sufficient:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/start-simple.ts}}
</code></pre>

    <h4>2. Embrace Structural Typing</h4>
    <p>
        Stop thinking in terms of "implements" and start thinking in terms of "shape":
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/embrace-structural.ts}}
</code></pre>

    <h4>3. Use Injection Tokens Wisely</h4>
    <p>
        When you do need a DI container, prefer symbols over strings:
    </p>
    
    <pre><code class="language-typescript">{{SNIPPET:typescript-di/injection-tokens.ts}}
</code></pre>

    <h4>4. Don't Over-Engineer</h4>
    <p>
        The <a href="https://en.wikipedia.org/wiki/JavaScript" target="_blank" rel="noopener">JavaScript ecosystem</a> values simplicity. A 500-line DI configuration might be normal in 
        <a href="https://symfony.com/" target="_blank" rel="noopener">Symfony</a>, but it's a <a href="https://martinfowler.com/bliki/CodeSmell.html" target="_blank" rel="noopener">code smell</a> in TypeScript.
    </p>
</section>

<section>
    <h2>The Philosophical Divide</h2>
    <p>
        The differences in DI approaches reflect deeper philosophical differences:
    </p>
    
    <table>
        <thead>
            <tr>
                <th><a href="https://php.net/" target="_blank" rel="noopener">PHP</a>/<a href="https://symfony.com/" target="_blank" rel="noopener">Symfony</a> Approach</th>
                <th><a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a>/<a href="https://nodejs.org/" target="_blank" rel="noopener">Node.js</a> Approach</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>Configuration over code</td>
                <td>Code over configuration</td>
            </tr>
            <tr>
                <td>Explicit contracts</td>
                <td>Implicit compatibility</td>
            </tr>
            <tr>
                <td>Framework-provided solutions</td>
                <td>Community-driven variety</td>
            </tr>
            <tr>
                <td><a href="https://www.php.net/manual/en/language.types.type-system.php" target="_blank" rel="noopener">Runtime type safety</a></td>
                <td><a href="https://www.typescriptlang.org/docs/handbook/2/understanding-errors.html" target="_blank" rel="noopener">Compile-time type checking</a></td>
            </tr>
            <tr>
                <td>Standardisation (<a href="https://www.php-fig.org/" target="_blank" rel="noopener">PSR</a>)</td>
                <td>Innovation through competition</td>
            </tr>
        </tbody>
    </table>
</section>

<section>
    <h2>Conclusion</h2>
    <p>
        Coming from PHP, TypeScript's approach to dependency injection can feel chaotic and underdeveloped: there's no
        <a href="https://www.php-fig.org/psr/psr-11/" target="_blank" rel="noopener">PSR-11</a> equivalent, no standard container interface, and the whole concept of "final" doesn't exist.
    </p>

    <p>
        That isn't necessarily worse, just different. TypeScript's structural typing and flexibility enable
        patterns that would be impossible in PHP, and the lack of standardisation has, if anything, driven
        innovation, with each library exploring its own approach.
    </p>

    <p>
        The key is to embrace these differences rather than fight them: start simple, make use of structural
        typing, and only add DI complexity when you genuinely need it. In TypeScript, the best dependency
        injection might well be no dependency injection framework at all.
    </p>
</section>

<section>
    <h2>Further Reading</h2>
    <ul>
        <li><a href="https://www.typescriptlang.org/docs/handbook/type-compatibility.html" target="_blank" rel="noopener">TypeScript Type Compatibility</a> - Official docs on structural typing</li>
        <li><a href="https://inversify.io/" target="_blank" rel="noopener">InversifyJS Documentation</a> - Most mature DI container</li>
        <li><a href="https://github.com/microsoft/tsyringe" target="_blank" rel="noopener">TSyringe GitHub</a> - Microsoft's lightweight option</li>
        <li><a href="https://www.michaelbromley.co.uk/blog/mocking-classes-with-typescript/" target="_blank" rel="noopener">Mocking Classes with TypeScript</a> - Deep dive into testing implications</li>
        <li><a href="https://medium.com/@weidagang/having-fun-with-typescript-structural-typing-4b8607472112" target="_blank" rel="noopener">Having Fun with TypeScript: Structural Typing</a> - Practical examples</li>
    </ul>
</section>
    `,
  },
  // Migrating: typescript-honesty-system.ejs
  {
    id: 'typescript-honesty-system',
    title: "TypeScript's Honesty System: Why Type Safety is Optional and How to Enforce It",
    description:
      "A working ESLint and tsconfig setup that actually enforces the type safety TypeScript only suggests by default, built against a taxonomy of the 25+ ways developers (and LLMs) routinely bypass it.",
    date: '2025-11-18',
    category: CATEGORIES.typescript.id,
    heroImage: {
      src: '/images/typescript-honesty-system/hero.webp',
      alt: 'A Howe commercial platform scale inside a National Park Service-documented scale house, the branded beam and hanging counterweight surrounded by a ladder, barrel, and stove',
      ogImage: '/images/typescript-honesty-system/og.jpg',
      creditText: 'Image: National Park Service (HAER), public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:INTERIOR_VIEW_OF_SCALE_HOUSE,_SHOWING_HOWE_SCALE_-_Clay_Spur_Bentonite_Plant_and_Camp,_Scale_House,_Clay_Spur_Siding_on_Burlington_Northern_Railroad,_Osage,_Weston_County,_WY_HAER_WYO,23-OSAG.V,1-P-4.tif',
    },
    readingTime: 18,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'typescript',
    register: 'formal',
    content: `
<div class="intro">
            <p class="lead">
                TypeScript's type system is an honesty system. Like an honesty bucket in a car park, it asks nicely but doesn't enforce anything. It provides zero actual runtime safety and can be trivially bypassed with escape hatches scattered throughout the language. Understanding this reality (and how to defend against it) is critical for maintaining type safety in production codebases.
            </p>
        </div>

        <section>
            <h2>The Honesty Bucket Analogy</h2>
            <p>
                Imagine a car park with an honesty bucket at the entrance. There's a sign that says "£5 per hour, please pay here." No barrier, no enforcement, no consequences for not paying. That's <a href="https://www.typescriptlang.org/" target="_blank" rel="noopener">TypeScript</a>.
            </p>
            <p>
                TypeScript provides powerful static analysis to catch type errors at compile time, but it's built on JavaScript, a dynamically typed language. <strong>Every TypeScript file is transpiled to JavaScript, losing all type information in the process.</strong> The types exist only during development, and the compiler trusts you to be honest about them.
            </p>
            <p>
                This is by design rather than a flaw, but it means TypeScript is better understood as advanced static analysis (like <a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a> for PHP or <a href="https://eslint.org/" target="_blank" rel="noopener">ESLint</a> for JavaScript) rather than a true type system like you'd find in <a href="https://www.rust-lang.org/" target="_blank" rel="noopener">Rust</a> or <a href="https://www.haskell.org/" target="_blank" rel="noopener">Haskell</a>.
            </p>
        </section>

        <section>
            <h2>The Complete Bypass Taxonomy: 25+ Ways to Lie to TypeScript</h2>
            <p>
                TypeScript's type system can be bypassed in over 25 distinct ways. This taxonomy documents the mechanisms I'm aware of, from obvious to obscure, though I wouldn't be surprised if there are more lurking in corners of the type system I haven't hit yet. Understanding these escape hatches is essential for recognising when codebases are being "dishonest" with the type system, and for defending against them.
            </p>

            <h3>Quick Reference: All Bypass Mechanisms</h3>
            <div style="background: var(--surface-2); padding: 1.5rem; border-radius: 8px; margin: 1.5rem 0;">
                <p><strong>Level 1: Blatant Bypasses</strong></p>
                <ul style="margin-top: 0.5rem;">
                    <li><code>any</code> type - Nuclear option, disables all type checking</li>
                    <li><code>@ts-ignore</code> - Suppresses next line error</li>
                    <li><code>@ts-nocheck</code> - Disables checking for entire file</li>
                </ul>

                <p><strong>Level 2: Sneaky Bypasses</strong></p>
                <ul style="margin-top: 0.5rem;">
                    <li><code>as T</code> - Type assertions that force type coercion</li>
                    <li><code>as unknown as T</code> - Double assertion pattern to bypass safety rails</li>
                    <li><code>@ts-expect-error</code> - "Safer" ts-ignore but still a bypass</li>
                    <li><code>satisfies</code> + <code>as any</code> - Combining safe operator with unsafe bypass</li>
                </ul>

                <p><strong>Level 3: Subtle Bypasses</strong></p>
                <ul style="margin-top: 0.5rem;">
                    <li><code>JSON.parse()</code> - Returns <code>any</code> by default</li>
                    <li><code>Object.assign()</code> - Loses type information at runtime</li>
                    <li>Spread operators - Type inference may be wrong</li>
                    <li>Array/object destructuring - Can introduce <code>any</code></li>
                </ul>

                <p><strong>Level 4: Structural Loopholes</strong></p>
                <ul style="margin-top: 0.5rem;">
                    <li>Optional properties (<code>?</code>) - Properties can be missing</li>
                    <li>Index signatures - Allow arbitrary properties</li>
                    <li>Excess property checking bypass - Intermediate variable assignment</li>
                </ul>

                <p><strong>Level 5: Advanced Bypasses</strong></p>
                <ul style="margin-top: 0.5rem;">
                    <li><code>declare</code> - Ambient declarations bypass verification</li>
                    <li>Module augmentation - Add properties to third-party types</li>
                </ul>

                <p><strong>Level 6: Type System Manipulation</strong></p>
                <ul style="margin-top: 0.5rem;">
                    <li>Type predicates (<code>is</code>) - Can lie about type narrowing</li>
                    <li>Generic <code>&lt;any&gt;</code> - Type parameters with <code>any</code></li>
                    <li>Function overloads - Implementation can hide unsafe casts</li>
                    <li>Numeric enums - Accept any number (pre-TS 5.0)</li>
                    <li><code>void</code> return abuse - Functions can return values</li>
                    <li>Constructor casting - Bypass instantiation checks</li>
                </ul>

                <p><strong>Level 7: Runtime Escape Mechanisms</strong></p>
                <ul style="margin-top: 0.5rem;">
                    <li><code>eval()</code> - Execute arbitrary code, returns <code>any</code></li>
                    <li><code>new Function()</code> - Function constructor, complete bypass</li>
                    <li>Bracket notation on <code>private</code> - Bypasses TypeScript private (not JavaScript <code>#</code>)</li>
                    <li><code>Object.setPrototypeOf()</code> - Runtime type mutation</li>
                    <li><code>delete</code> operator - Remove required properties</li>
                    <li>Recursive type limits - TypeScript throws a hard compile error (TS2589) rather than silently bypassing anything</li>
                </ul>
            </div>

            <h3>The Bypass Hierarchy: From Obvious to Sneaky</h3>
            <p>
                Let's examine each bypass mechanism in detail, with code examples showing exactly how they defeat type safety:
            </p>

            <h3>Level 1: Blatant Bypasses</h3>
            <p>
                These are the "I give up" approaches that developers reach for when fighting with the compiler:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-blatant.ts}}
</code></pre>

            <p>
                The <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#any" target="_blank" rel="noopener"><code>any</code></a> type is the nuclear option. It completely disables type checking for that value. <a href="https://typescript-eslint.io/rules/ban-ts-comment/" target="_blank" rel="noopener"><code>@ts-ignore</code></a> and <code>@ts-nocheck</code> tell the compiler to stop checking entirely. These are honest about their dishonesty.
            </p>

            <h3>Level 2: Sneaky Bypasses</h3>
            <p>
                <a href="https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions" target="_blank" rel="noopener">Type assertions</a> are where things get interesting. They look more legitimate but are equally dangerous:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-sneaky.ts}}
</code></pre>

            <p>
                The <strong>double assertion pattern</strong> (<code>as unknown as T</code>) is particularly insidious. TypeScript prevents "impossible" coercions, but by first asserting to <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type" target="_blank" rel="noopener"><code>unknown</code></a> (the top type), you can then assert to anything. It's a two-step lie that bypasses the safety rails.
            </p>

            <h4>The @ts-expect-error Bypass</h4>
            <p>
                <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments" target="_blank" rel="noopener"><code>@ts-expect-error</code></a> was introduced in TypeScript 3.9 as a "safer" alternative to <code>@ts-ignore</code>. It requires an error to exist, making it self-documenting. But it's still a bypass mechanism:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-ts-expect-error.ts}}
</code></pre>

            <p>
                <code>@ts-expect-error</code> is safer than <code>@ts-ignore</code> precisely because TypeScript re-flags the suppression once the underlying error disappears (error TS2578, "Unused '@ts-expect-error' directive"). The real danger is narrower: if someone widens the surrounding code so that <em>some</em> error still exists on that line, even an unrelated one, the suppression stays silently "valid" for the wrong reason.
            </p>

            <h4>The satisfies Operator (TypeScript 4.9+)</h4>
            <p>
                The <a href="https://www.typescriptlang.org/docs/handbook/release-notes/typescript-4-9.html#the-satisfies-operator" target="_blank" rel="noopener"><code>satisfies</code> operator</a> introduced in TypeScript 4.9 (November 2022) is actually <strong>safer than type assertions</strong> when used correctly. Unlike <code>as</code>, it validates types without overriding inference. However, it can be misused in combination with other bypasses:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-satisfies.ts}}
</code></pre>

            <p>
                Whilst <code>satisfies</code> itself strengthens type safety, developers can abuse it by combining it with <code>as any</code> or type assertions, creating a false sense of security.
            </p>

            <h3>Level 3: Subtle Bypasses</h3>
            <p>
                These are runtime operations that lose type information without explicit escape hatches:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-subtle.ts}}
</code></pre>

            <p>
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign" target="_blank" rel="noopener"><code>Object.assign()</code></a>, spread operators, and <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse" target="_blank" rel="noopener"><code>JSON.parse()</code></a> all operate at runtime on plain JavaScript objects. TypeScript can infer types at compile time, but it can't verify them at runtime. <code>JSON.parse()</code> is particularly dangerous. It returns <code>any</code> by default, creating a massive hole in type safety.
            </p>

            <h3>Level 4: Structural Loopholes</h3>
            <p>
                TypeScript's structural type system has built-in flexibility that can be exploited:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-structural.ts}}
</code></pre>

            <p>
                <a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#optional-properties" target="_blank" rel="noopener">Optional properties</a> (<code>?</code>) mean a property can be missing entirely. <a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#index-signatures" target="_blank" rel="noopener">Index signatures</a> (<code>[key: string]: any</code>) allow arbitrary properties. TypeScript's <a href="https://www.typescriptlang.org/docs/handbook/2/objects.html#excess-property-checks" target="_blank" rel="noopener">excess property checking</a> can be bypassed by assigning through an intermediate variable. None of this is a bug, exactly. It's what a flexible structural type system looks like, and the cost of that flexibility is weaker safety guarantees.
            </p>

            <h3>Level 5: Advanced Bypasses</h3>
            <p>
                The most sophisticated bypasses use TypeScript's declaration system:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-advanced.ts}}
</code></pre>

            <p>
                <a href="https://www.typescriptlang.org/docs/handbook/declaration-files/by-example.html" target="_blank" rel="noopener">Ambient declarations</a> (<code>declare</code>) tell TypeScript "this exists at runtime, trust me." <a href="https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation" target="_blank" rel="noopener">Module augmentation</a> allows adding properties to third-party types. These are legitimate features for integrating untyped code, but they're also escape hatches that bypass verification.
            </p>

            <h3>Level 6: Type System Manipulation</h3>
            <p>
                These bypasses exploit TypeScript's type system features to create unsafe code that looks type-safe:
            </p>

            <h4>Type Predicates: Lying Type Guards</h4>
            <p>
                <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" target="_blank" rel="noopener">Type predicates</a> (<code>is</code> keyword) allow custom type guards. TypeScript trusts your logic without verification, creating a massive trust hole:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-type-predicates.ts}}
</code></pre>

            <p>
                Type predicates are particularly dangerous because they <strong>combine compile-time and runtime trust</strong>. TypeScript assumes your predicate logic is correct and narrows types based on it. If your predicate lies, runtime disasters follow.
            </p>

            <h4>Generic Type Parameters with any</h4>
            <p>
                <a href="https://www.typescriptlang.org/docs/handbook/2/generics.html" target="_blank" rel="noopener">Generic type parameters</a> with <code>any</code> create complete type erasure:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-generics.ts}}
</code></pre>

            <p>
                Generic constraints can be bypassed by passing <code>any</code> as the type argument, effectively disabling all type checking for that generic instantiation.
            </p>

            <h4>Function Overloads</h4>
            <p>
                <a href="https://www.typescriptlang.org/docs/handbook/2/functions.html#function-overloads" target="_blank" rel="noopener">Function overloads</a> let you define multiple type signatures, but the implementation signature can hide unsafe casts:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-function-overloads.ts}}
</code></pre>

            <p>
                The public overload signatures look safe, but the implementation can do anything. TypeScript only checks that the implementation is compatible with the overloads, not that it's actually safe.
            </p>

            <h4>Enum Number Assignment</h4>
            <p>
                <a href="https://www.typescriptlang.org/docs/handbook/enums.html" target="_blank" rel="noopener">Numeric enums</a> had a major type safety flaw before TypeScript 5.0. They accepted <strong>any number value</strong>, not just defined enum members:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-enums.ts}}
</code></pre>

            <p>
                TypeScript 5.0 (released March 2023) improved numeric enum safety significantly, but they can still be bypassed with type assertions. String enums are safer, but both can be coerced with <code>as unknown as</code>.
            </p>

            <h4>Void Return Type Abuse</h4>
            <p>
                TypeScript's <a href="https://www.typescriptlang.org/docs/handbook/2/functions.html#void" target="_blank" rel="noopener"><code>void</code> return type</a> has surprising behaviour. Functions typed as returning <code>void</code> can actually return values:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-void-return.ts}}
</code></pre>

            <p>
                This is intentional for <a href="https://www.typescriptlang.org/docs/handbook/2/functions.html#assignability-of-functions" target="_blank" rel="noopener">function assignability</a> (e.g., passing functions that return values to <code>Array.forEach</code>), but it means <code>void</code> doesn't guarantee no return value. It only means the return value is ignored by TypeScript.
            </p>

            <h4>Constructor Type Casting</h4>
            <p>
                Using <a href="https://www.typescriptlang.org/docs/handbook/2/classes.html#constructors" target="_blank" rel="noopener">constructor signatures</a> with type assertions can bypass proper instantiation checks:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-constructor-casting.ts}}
</code></pre>

            <p>
                Constructor casts can even instantiate <a href="https://www.typescriptlang.org/docs/handbook/2/classes.html#abstract-classes-and-members" target="_blank" rel="noopener">abstract classes</a>, which should be impossible. This fails at runtime but passes type checking.
            </p>

            <h3>Level 7: Runtime Escape Mechanisms</h3>
            <p>
                These bypasses completely escape TypeScript's static analysis by operating at runtime:
            </p>

            <h4>eval() and Function Constructor</h4>
            <p>
                <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval" target="_blank" rel="noopener"><code>eval()</code></a> and the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function" target="_blank" rel="noopener"><code>Function</code> constructor</a> execute arbitrary code at runtime, completely bypassing type checking:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-runtime-escapes.ts}}
</code></pre>

            <p>
                These mechanisms return <code>any</code> and can contain literally anything. They're the nuclear option for bypassing TypeScript, but also create security vulnerabilities and performance issues.
            </p>

            <h4>Private Field Bypassing</h4>
            <p>
                TypeScript's <a href="https://www.typescriptlang.org/docs/handbook/2/classes.html#private" target="_blank" rel="noopener"><code>private</code> keyword</a> is only enforced at compile time. At runtime, <strong>bracket notation bypasses private fields entirely</strong>:
            </p>

            <p>
                However, JavaScript's <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_class_fields" target="_blank" rel="noopener">private fields</a> (<code>#fieldName</code>) introduced in ES2022 provide <strong>true runtime privacy</strong> that cannot be bypassed. The <code>#</code> syntax creates fields that are genuinely inaccessible from outside the class.
            </p>

            <h4>Prototype Manipulation</h4>
            <p>
                JavaScript's prototype system allows runtime type changes that TypeScript can't prevent. <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/setPrototypeOf" target="_blank" rel="noopener"><code>Object.setPrototypeOf()</code></a> and the <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/delete" target="_blank" rel="noopener"><code>delete</code> operator</a> can mutate objects in ways that violate their types.
            </p>

            <h4>Recursive Type Limits</h4>
            <p>
                TypeScript has a hard recursion limit on type instantiation depth. Unlike the other mechanisms in this section, hitting it isn't a silent bypass: <strong>TypeScript throws a hard compile error (TS2589, "Type instantiation is excessively deep and possibly infinite") and refuses to build</strong>:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/bypass-recursive-limits.ts}}
</code></pre>

            <p>
                Complex recursive types like <code>DeepPartial</code> or deeply nested JSON structures can hit this limit surprisingly quickly - nesting them a handful of levels deep is often enough. There's <a href="https://github.com/microsoft/TypeScript/issues/46180" target="_blank" rel="noopener">no compiler flag</a> to increase or disable the limit, so the only way past it is to restructure the type. It's included here because it's still a place where the type checker's guarantees run out, even though - unlike the other bypasses in this section - it fails loudly rather than quietly returning <code>any</code>.
            </p>
        </section>

        <section>
            <h2>Why This Matters: The Similarity to PHPStan and ESLint</h2>
            <p>
                TypeScript's "honesty system" approach isn't unique. It's remarkably similar to other static analysis tools in the ecosystem:
            </p>

            <ul>
                <li>
                    <strong><a href="https://phpstan.org/" target="_blank" rel="noopener">PHPStan</a></strong> - PHP's static analyser has <a href="https://phpstan.org/user-guide/ignoring-errors" target="_blank" rel="noopener"><code>@phpstan-ignore-line</code></a> and <code>@phpstan-ignore-next-line</code> for suppressing errors. It's static analysis with opt-out rules.
                </li>
                <li>
                    <strong><a href="https://eslint.org/" target="_blank" rel="noopener">ESLint</a></strong> - JavaScript's linter has <code>eslint-disable</code> comments to bypass rules. It enforces code quality but allows developers to override.
                </li>
                <li>
                    <strong><a href="https://mypy.readthedocs.io/" target="_blank" rel="noopener">Mypy</a></strong> - Python's type checker has <code># type: ignore</code> comments to silence warnings. Optional typing with escape hatches.
                </li>
            </ul>

            <p>
                All of these tools share a common pattern: <strong>they analyse code statically and report problems, but developers can override them</strong>. They provide enormous value when used honestly, but they can't prevent dishonest developers from bypassing safety checks.
            </p>

            <p>
                Compare this to languages with true runtime type safety:
            </p>

            <ul>
                <li><strong><a href="https://www.rust-lang.org/" target="_blank" rel="noopener">Rust</a></strong> - The borrow checker is mandatory. You can use <code>unsafe</code> blocks, but they're explicit and limited.</li>
                <li><strong><a href="https://www.haskell.org/" target="_blank" rel="noopener">Haskell</a></strong> - Type safety is enforced at runtime. You can't bypass the type system without using low-level FFI.</li>
                <li><strong><a href="https://www.java.com/" target="_blank" rel="noopener">Java</a></strong> - Strongly typed at runtime with reflection as the only escape hatch (and even then, types exist at runtime).</li>
            </ul>

            <p>
                TypeScript doesn't belong in this category. It's <strong>compile-time only static analysis</strong>, and it has more in common with linters and static analysers than with true type systems.
            </p>
        </section>

        <section>
            <h2>The Real Problem: LLMs and Dishonest Developers</h2>
            <p>
                The honesty system breaks down when developers (or AI coding assistants) liberally use escape hatches to "make the red squiggles go away." This is particularly problematic with <a href="https://www.anthropic.com/claude" target="_blank" rel="noopener">large language models</a> generating code:
            </p>

            <ul>
                <li>
                    <strong>LLMs don't care about type safety</strong> - They'll happily insert <code>as any</code> to fix compiler errors, not understanding the runtime implications.
                </li>
                <li>
                    <strong>Junior developers under pressure</strong> - Tight deadlines encourage quick fixes like <code>@ts-ignore</code> rather than proper type design.
                </li>
                <li>
                    <strong>Legacy codebases</strong> - Gradual TypeScript adoption leads to liberal use of <code>any</code> to get things compiling.
                </li>
                <li>
                    <strong>Third-party library integration</strong> - Missing or incorrect <code>@types</code> packages force developers into type assertions.
                </li>
            </ul>

            <p>
                The result is a codebase that <em>looks</em> type-safe but is riddled with holes, where the type system becomes theatre, providing false confidence without actual safety.
            </p>
        </section>

        <section>
            <h2>The Defence: ESLint to the Rescue</h2>
            <p>
                The solution is to treat TypeScript like PHPStan: static analysis that <strong>must be hardened with strict enforcement rules</strong>. Enter <a href="https://typescript-eslint.io/" target="_blank" rel="noopener">typescript-eslint</a>, a suite of ESLint rules specifically designed to enforce type safety.
            </p>

            <h3>Essential Rules to Enable</h3>

            <h4>Level 1 Defences: Block Blatant Bypasses</h4>

            <h5><a href="https://typescript-eslint.io/rules/no-explicit-any/" target="_blank" rel="noopener">@typescript-eslint/no-explicit-any</a></h5>
            <p>
                Bans the <code>any</code> type entirely. Forces developers to use <code>unknown</code> (which requires type narrowing) or proper type definitions.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/no-non-null-assertion/" target="_blank" rel="noopener">@typescript-eslint/no-non-null-assertion</a></h5>
            <p>
                Bans the non-null assertion operator (<code>!</code>). Encourages <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Optional_chaining" target="_blank" rel="noopener">optional chaining</a> (<code>?.</code>) and proper null checks.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/ban-ts-comment/" target="_blank" rel="noopener">@typescript-eslint/ban-ts-comment</a></h5>
            <p>
                Bans <code>@ts-ignore</code> and <code>@ts-nocheck</code> comments. Configure to require descriptions for <code>@ts-expect-error</code>. This baseline config sets a minimum description length of 10 characters; the stricter ESLint configuration shown later in this article raises that to 20, deliberately requiring a fuller justification for each suppression:
            </p>
            <pre><code class="language-json">{{SNIPPET:typescript-honesty-system/ban-ts-comment-config.json}}
</code></pre>

            <h4>Level 2 Defences: Control Type Assertions</h4>

            <h5><a href="https://typescript-eslint.io/rules/consistent-type-assertions/" target="_blank" rel="noopener">@typescript-eslint/consistent-type-assertions</a></h5>
            <p>
                Controls type assertion usage. Can be configured to ban assertions entirely (<code>assertionStyle: "never"</code>) for maximum safety, or enforce <code>as</code> syntax only.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/no-unsafe-type-assertion/" target="_blank" rel="noopener">@typescript-eslint/no-unsafe-type-assertion</a></h5>
            <p>
                Introduced in typescript-eslint v8, this rule prevents unsafe type assertions including the <code>as unknown as T</code> pattern. Blocks assertions that aren't provably safe.
            </p>

            <h4>Level 3 Defences: Prevent any Contamination</h4>

            <h5><a href="https://typescript-eslint.io/rules/no-unsafe-assignment/" target="_blank" rel="noopener">@typescript-eslint/no-unsafe-assignment</a></h5>
            <p>
                Prevents assigning <code>any</code> typed values to variables. Catches cases where <code>any</code> spreads through the codebase from <code>JSON.parse()</code>, third-party libraries, or type assertions.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/no-unsafe-argument/" target="_blank" rel="noopener">@typescript-eslint/no-unsafe-argument</a></h5>
            <p>
                Prevents passing <code>any</code> typed values as function arguments. Stops <code>any</code> from spreading through function calls, including generic type parameters.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/no-unsafe-return/" target="_blank" rel="noopener">@typescript-eslint/no-unsafe-return</a></h5>
            <p>
                Prevents returning <code>any</code> typed values from functions. Catches functions that claim to return specific types but actually return <code>any</code>.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/no-unsafe-member-access/" target="_blank" rel="noopener">@typescript-eslint/no-unsafe-member-access</a></h5>
            <p>
                Prevents accessing properties on <code>any</code> typed values. Stops chains like <code>apiResponse.data.field</code> where <code>apiResponse</code> is <code>any</code>.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/no-unsafe-call/" target="_blank" rel="noopener">@typescript-eslint/no-unsafe-call</a></h5>
            <p>
                Prevents calling <code>any</code> typed values as functions. Blocks unsafe function calls on untyped values.
            </p>

            <h4>Level 4 Defences: Runtime Escape Prevention</h4>

            <h5><a href="https://typescript-eslint.io/rules/no-implied-eval/" target="_blank" rel="noopener">@typescript-eslint/no-implied-eval</a></h5>
            <p>
                Bans <code>eval()</code>, <code>new Function()</code>, and eval-like functions (<code>setTimeout</code> with strings). Prevents complete runtime type system escapes and blocks security vulnerabilities.
            </p>

            <h5><a href="https://eslint.org/docs/latest/rules/no-new-func" target="_blank" rel="noopener">no-new-func</a> (ESLint core)</h5>
            <p>
                Companion to <code>no-implied-eval</code>. Explicitly bans the <code>Function</code> constructor.
            </p>

            <h5><a href="https://eslint.org/docs/latest/rules/no-eval" target="_blank" rel="noopener">no-eval</a> (ESLint core)</h5>
            <p>
                Bans <code>eval()</code> usage. Works alongside <code>no-implied-eval</code> for comprehensive coverage.
            </p>

            <h4>Level 5 Defences: Type System Integrity</h4>

            <h5><a href="https://typescript-eslint.io/rules/no-unnecessary-type-assertion/" target="_blank" rel="noopener">@typescript-eslint/no-unnecessary-type-assertion</a></h5>
            <p>
                Detects type assertions that don't change the type. Indicates misunderstanding or defensive programming against TypeScript's inference.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/no-unnecessary-condition/" target="_blank" rel="noopener">@typescript-eslint/no-unnecessary-condition</a></h5>
            <p>
                With <code>checkTypePredicates: true</code>, validates type predicate logic to catch lying type guards:
            </p>
            <pre><code class="language-json">{{SNIPPET:typescript-honesty-system/no-unnecessary-condition-config.json}}
</code></pre>

            <h5><a href="https://typescript-eslint.io/rules/prefer-enum-initializers/" target="_blank" rel="noopener">@typescript-eslint/prefer-enum-initializers</a></h5>
            <p>
                Requires explicit enum values. Prevents accidental numeric enum issues and makes enum values explicit and intentional.
            </p>

            <h5><a href="https://typescript-eslint.io/rules/prefer-literal-enum-member/" target="_blank" rel="noopener">@typescript-eslint/prefer-literal-enum-member</a></h5>
            <p>
                Requires enum members to be literal values. Prevents computed enum values that could introduce unexpected behaviour.
            </p>

            <h3>Basic ESLint Configuration</h3>
            <pre><code class="language-json">{{SNIPPET:typescript-honesty-system/eslint-config-basic.json}}
</code></pre>

            <h3>Strict ESLint Configuration</h3>
            <p>
                For maximum type safety, extend the <a href="https://typescript-eslint.io/linting/configs/#strict" target="_blank" rel="noopener">strict configuration</a> and enable all safety rules. ESLint v9 requires <a href="https://eslint.org/docs/latest/use/configure/configuration-files" target="_blank" rel="noopener">flat config</a> by default, so this example uses <code>eslint.config.js</code> rather than the legacy <code>.eslintrc.json</code> format:
            </p>

            <pre><code class="language-javascript">{{SNIPPET:typescript-honesty-system/eslint-config-strict.js}}
</code></pre>
        </section>

        <section>
            <h2>Hardening Your TypeScript Project</h2>
            <p>
                ESLint enforcement is only one piece of the puzzle. Comprehensive type safety requires a multi-layered approach:
            </p>

            <h3>1. Strict TypeScript Configuration</h3>
            <p>
                Enable <a href="https://www.typescriptlang.org/tsconfig#strict" target="_blank" rel="noopener"><code>strict</code></a> mode and additional safety options in <code>tsconfig.json</code>:
            </p>

            <pre><code class="language-json">{{SNIPPET:typescript-honesty-system/tsconfig-strict.json}}
</code></pre>

            <p>
                Key options to understand:
            </p>

            <ul>
                <li>
                    <a href="https://www.typescriptlang.org/tsconfig#noImplicitAny" target="_blank" rel="noopener"><code>noImplicitAny</code></a> - Errors on implied <code>any</code> types (e.g., untyped function parameters).
                </li>
                <li>
                    <a href="https://www.typescriptlang.org/tsconfig#strictNullChecks" target="_blank" rel="noopener"><code>strictNullChecks</code></a> - Makes <code>null</code> and <code>undefined</code> explicit types that must be handled.
                </li>
                <li>
                    <a href="https://www.typescriptlang.org/tsconfig#noUncheckedIndexedAccess" target="_blank" rel="noopener"><code>noUncheckedIndexedAccess</code></a> - Array and object access returns <code>T | undefined</code>, preventing unsafe index access.
                </li>
                <li>
                    <a href="https://www.typescriptlang.org/tsconfig#exactOptionalPropertyTypes" target="_blank" rel="noopener"><code>exactOptionalPropertyTypes</code></a> - Distinguishes between <code>undefined</code> and missing properties.
                </li>
            </ul>

            <h3>2. Runtime Validation with Type Guards</h3>
            <p>
                TypeScript types disappear at runtime. Use <a href="https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates" target="_blank" rel="noopener">type guards</a> for runtime validation to bridge this gap:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/type-guard-example.ts}}
</code></pre>

            <p>
                For complex validation, consider runtime schema validation libraries like <a href="https://zod.dev/" target="_blank" rel="noopener">Zod</a>, <a href="https://github.com/gcanti/io-ts" target="_blank" rel="noopener">io-ts</a>, or <a href="https://ajv.js.org/" target="_blank" rel="noopener">Ajv</a>:
            </p>

            <pre><code class="language-typescript">{{SNIPPET:typescript-honesty-system/zod-validation.ts}}
</code></pre>

            <p>
                Zod is elegant because the schema is both the runtime validator <em>and</em> the compile-time type definition. You maintain a single source of truth that works at both compile time and runtime.
            </p>

            <h3>3. CI/CD Enforcement</h3>
            <p>
                Local development relies on developer discipline. CI/CD removes that dependency by making builds fail on violations:
            </p>

            <pre><code class="language-yaml">{{SNIPPET:typescript-honesty-system/ci-enforcement.yml}}
</code></pre>

            <p>
                This <a href="https://docs.github.com/en/actions" target="_blank" rel="noopener">GitHub Actions</a> workflow blocks merging code that:
            </p>

            <ul>
                <li>Fails strict TypeScript compilation</li>
                <li>Has ESLint errors or warnings</li>
                <li>Contains <code>any</code> types in source files</li>
                <li>Uses <code>@ts-ignore</code> comments</li>
            </ul>

            <h3>4. Code Review Processes</h3>
            <p>
                Automation catches most issues, but human review is still essential:
            </p>

            <ul>
                <li><strong>Flag type assertions</strong> - Question every <code>as</code> assertion. Is it truly necessary?</li>
                <li><strong>Scrutinise <code>@ts-expect-error</code></strong> - Valid use cases exist, but they should be rare and well-documented.</li>
                <li><strong>Review ambient declarations</strong> - <code>declare</code> statements bypass all type checking. Ensure they're accurate.</li>
                <li><strong>Check JSON parsing</strong> - Ensure <code>JSON.parse()</code> calls are validated with type guards or schema validators.</li>
            </ul>

            <h3>5. Third-Party Library Hygiene</h3>
            <p>
                Untyped or poorly-typed third-party libraries are a major source of <code>any</code> contamination:
            </p>

            <ul>
                <li>
                    <strong>Prefer typed libraries</strong> - Check for <a href="https://www.npmjs.com/~types" target="_blank" rel="noopener">@types packages</a> on npm.
                </li>
                <li>
                    <strong>Write your own type definitions</strong> - Use <a href="https://www.typescriptlang.org/docs/handbook/declaration-files/introduction.html" target="_blank" rel="noopener">declaration files</a> for untyped libraries.
                </li>
                <li>
                    <strong>Isolate untyped code</strong> - Create a typed wrapper around poorly-typed libraries to contain the <code>any</code>.
                </li>
                <li>
                    <strong>Audit dependencies</strong> - Use tools like <a href="https://github.com/plantain-00/type-coverage" target="_blank" rel="noopener">type-coverage</a> to measure type safety across dependencies.
                </li>
            </ul>
        </section>

        <section>
            <h2>Conclusion: TypeScript is Powerful, But Requires Discipline</h2>
            <p>
                This article has documented <strong>over 25 distinct ways to bypass TypeScript's type system</strong>, from the obvious (<code>any</code>, <code>@ts-ignore</code>) to the obscure (recursive type limits, constructor casting). TypeScript's "honesty system" is both a strength and a weakness. The flexibility that makes it easy to adopt gradually is the same flexibility that makes it easy to bypass completely.
            </p>

            <p>
                A useful way to sort the 25+ bypasses isn't by how obvious they are, but by who can catch them. Most of the list, <code>any</code>, <code>@ts-ignore</code>, unsafe assertions, dynamic code execution, is mechanical: an ESLint rule flags it every time, regardless of who wrote the line. A smaller set, an ambiguous <code>as unknown as T</code> in genuinely tricky generic code, or a type predicate that's subtly wrong, needs a human reading the diff and asking whether the claim being made is actually true, so automate the first set completely and budget code review time for the second.
            </p>

            <p>
                That distinction matters more now than it did a few years ago, because a growing share of the code reaching for these bypasses isn't written by a rushed developer under deadline pressure. It's generated by an LLM told to "fix the type error," which will happily insert <code>as any</code> without understanding, or caring, what it just switched off. The ESLint configuration in this article doesn't know or care who wrote the line it's rejecting. That's exactly why it's the part of the defence worth getting right first.
            </p>

            <p>
                The honesty bucket only works if everyone pays, so make sure your team, and your tooling, holds everyone accountable. You now know most of the ways TypeScript gets bypassed, which at least means you're no longer defending against them blind.
            </p>
        </section>

        <section>
            <h3>Further Reading</h3>

            <h4>TypeScript Official Resources</h4>
            <ul>
                <li><a href="https://www.typescriptlang.org/docs/" target="_blank" rel="noopener">TypeScript Documentation</a> - Official TypeScript handbook and reference</li>
                <li><a href="https://www.typescriptlang.org/tsconfig" target="_blank" rel="noopener">TSConfig Reference</a> - Comprehensive guide to TypeScript compiler options</li>
                <li><a href="https://github.com/microsoft/TypeScript" target="_blank" rel="noopener">TypeScript GitHub Repository</a> - Source code, issues, and feature discussions</li>
                <li><a href="https://devblogs.microsoft.com/typescript/" target="_blank" rel="noopener">TypeScript Blog</a> - Official release announcements and deep dives</li>
            </ul>

            <h4>TypeScript ESLint and Tooling</h4>
            <ul>
                <li><a href="https://typescript-eslint.io/" target="_blank" rel="noopener">typescript-eslint</a> - ESLint plugin for TypeScript-specific linting</li>
                <li><a href="https://typescript-eslint.io/linting/configs/" target="_blank" rel="noopener">typescript-eslint Configurations</a> - Recommended, strict, and type-checked configs</li>
                <li><a href="https://github.com/plantain-00/type-coverage" target="_blank" rel="noopener">type-coverage</a> - Tool to measure type safety coverage in TypeScript projects</li>
                <li><a href="https://github.com/total-typescript/ts-reset" target="_blank" rel="noopener">ts-reset</a> - Improve TypeScript's built-in types with stronger defaults</li>
            </ul>

            <h4>Runtime Validation Libraries</h4>
            <ul>
                <li><a href="https://zod.dev/" target="_blank" rel="noopener">Zod</a> - TypeScript-first schema validation with static type inference</li>
                <li><a href="https://github.com/gcanti/io-ts" target="_blank" rel="noopener">io-ts</a> - Runtime type system for validating unknown data</li>
                <li><a href="https://ajv.js.org/" target="_blank" rel="noopener">Ajv</a> - JSON Schema validator with TypeScript support</li>
                <li><a href="https://github.com/jquense/yup" target="_blank" rel="noopener">Yup</a> - Schema validation library with TypeScript types</li>
                <li><a href="https://github.com/sinclairzx81/typebox" target="_blank" rel="noopener">TypeBox</a> - JSON Schema Type Builder with static type resolution</li>
            </ul>

            <h4>Books and Learning Resources</h4>
            <ul>
                <li><a href="https://effectivetypescript.com/" target="_blank" rel="noopener">Effective TypeScript</a> - Book on advanced TypeScript patterns and best practices</li>
                <li><a href="https://github.com/type-challenges/type-challenges" target="_blank" rel="noopener">Type Challenges</a> - Collection of TypeScript type challenges to improve your skills</li>
                <li><a href="https://www.learningtypescript.com/" target="_blank" rel="noopener">Learning TypeScript</a> - Comprehensive TypeScript learning platform</li>
            </ul>

            <h4>TypeScript Internals and Design Discussions</h4>
            <ul>
                <li><a href="https://github.com/microsoft/TypeScript/wiki/Performance" target="_blank" rel="noopener">TypeScript Performance Wiki</a> - Optimising TypeScript compiler performance</li>
                <li><a href="https://github.com/microsoft/TypeScript/issues/47920" target="_blank" rel="noopener">satisfies Operator Proposal</a> - Original discussion and motivation</li>
                <li><a href="https://github.com/microsoft/TypeScript/issues/46180" target="_blank" rel="noopener">Type Instantiation Depth Limits</a> - Discussion on recursive type limits</li>
            </ul>
        </section>
    `,
  },
  // Migrating: understanding-llm-context-management.ejs
  {
    id: 'understanding-llm-context-management',
    title: 'Understanding LLM Context: The Hidden Challenge of AI Development',
    description:
      'How context actually works when you are talking to a Large Language Model like Claude Code, why it degrades over a long conversation, and practical strategies for keeping it under control.',
    date: '2025-08-20',
    category: CATEGORIES.ai.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'LLMDevs',
    register: 'formal',
    heroImage: {
      src: '/images/understanding-llm-context-management/hero.webp',
      alt: 'A sailor using navigational dividers to plot a precise fix on a paper nautical chart',
      ogImage: '/images/understanding-llm-context-management/og.jpg',
      creditText: 'Image: U.S. Navy, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:US_Navy_100405-N-5712P-135_Quartermaster_3rd_Class_Adalberto_Fuentes,_from_Galveston,_Texas,_plots_a_course_on_a_coastal_chart_in_the_chart_room_aboard_the_amphibious_assault_ship_USS_Nassau_(LHA_4).jpg',
    },
    content: `
<div class="intro">
            <p class="lead">You're debugging a complex issue with <a href="https://claude.ai/code" target="_blank" rel="noopener">Claude Code</a>. After 30 messages back and forth, you notice the AI seems confused, mixing up earlier solutions with current problems. What happened? You've just experienced the hidden challenge of context management, the invisible force that can make or break your AI development experience.</p>
        </div>
        
        <section>
            <h2>Context as a Shared Conversation</h2>
            <p>Imagine you're having dinner with a friend at a restaurant. When you say "pass the salt," your friend doesn't need you to specify which salt, from which table, in which restaurant. The <strong>context</strong> is clear from your shared environment and conversation history.</p>

            <p>Now imagine if every time you spoke, your friend forgot everything: the restaurant, your previous conversations, even why you're there. You'd have to explain everything from scratch each time. This is what working with an <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">LLM</a> would be like without context.</p>

            <p>Context in <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">LLMs</a> works like your friend's memory of the entire dinner conversation. Every message you send isn't processed in isolation. It includes everything that came before it, creating a continuous narrative thread.</p>
        </section>

        <section>
            <h2>What Happens Behind the Scenes</h2>
            <p>When you type a message into <a href="https://claude.ai/code" target="_blank" rel="noopener">Claude Code</a> or any <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">LLM</a> interface, here's what actually happens:</p>

            <h3>The Context Assembly Process</h3>
            <p>Think of context like a rolling transcript of a meeting. Every time you speak (send a message), the AI doesn't just hear your latest words. It reviews the entire meeting transcript first:</p>

            <pre><code class="language-javascript">{{SNIPPET:understanding-llm-context-management/context-assembly-example.js}}</code></pre>

            <p>This entire package, meaning system instructions, <strong>the ENTIRE conversation history from message #1</strong>, and your new message, gets sent to the <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">LLM's</a> servers as one massive input. After 100 messages, you might be sending 100,000+ tokens with every single request! The model then generates a response based on <em>everything</em> in this increasingly bloated context.</p>

            <h3>How Fast Context Grows</h3>
            <p>The token count sent with every request grows with the conversation, not just with the latest message:</p>
            <ul>
                <li><strong>Message #1:</strong> ~100 tokens sent</li>
                <li><strong>Message #10:</strong> ~5,000 tokens sent</li>
                <li><strong>Message #50:</strong> ~30,000 tokens sent</li>
                <li><strong>Message #100:</strong> ~80,000 tokens sent</li>
                <li><strong>Message #150:</strong> ~150,000 tokens sent (approaching limits)</li>
            </ul>
            <p>Every message includes everything that came before it, all the way back to the first one.</p>
        </section>

        <section>
            <h2>The Context Window: Your Conversation's Memory Limit</h2>
            
            <p>Every <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">LLM</a> has a "context window", the maximum amount of information it can process at once. Think of it like <a href="https://en.wikipedia.org/wiki/Random-access_memory" target="_blank" rel="noopener">RAM</a> in a computer or the number of items you can juggle simultaneously.</p>
            
            <h3>Current Context Window Sizes (2025)</h3>
            <p>The context window arms race has led to impressive numbers. The figures below are a snapshot from around August 2025, when this article was first written; token limits move quickly, so treat them as illustrative rather than current by the time you're reading this:</p>

            <ul>
                <li><strong><a href="https://deepmind.google/technologies/gemini/" target="_blank" rel="noopener">Google Gemini 2.5 Pro</a>:</strong> 1 million tokens (expanding to 2 million in Q3 2025)</li>
                <li><strong><a href="https://www.anthropic.com/claude" target="_blank" rel="noopener">Claude Sonnet 4</a>:</strong> 1 million tokens (public beta) / 200,000 tokens (standard)</li>
                <li><strong><a href="https://openai.com/gpt-4" target="_blank" rel="noopener">GPT-4.1</a>:</strong> 1 million tokens (with performance degradation)</li>
                <li><strong><a href="https://openai.com/gpt-4" target="_blank" rel="noopener">GPT-4o</a>:</strong> 128,000 tokens</li>
            </ul>
            
            <p>To put this in perspective: 1 million tokens ≈ 2,500 pages of text, roughly equivalent to reading all seven <a href="https://en.wikipedia.org/wiki/Harry_Potter" target="_blank" rel="noopener">Harry Potter</a> books in a single conversation!</p>
        </section>

        <section>
            <h2>When Context Becomes Contamination</h2>

            <p>Irrelevant information mixed into your context has a real cost: it makes it harder for the model to find what's actually relevant to your current task, in the same way clutter buried among your working files slows you down even when the file you need is technically still there.</p>

            <h3>Too Many Conversations at Once</h3>
            <p>Context bloat is like trying to have a focused conversation in an increasingly noisy room. At first, with just a few people talking, you can easily focus. But as more conversations start around you, some relevant, some not, it becomes harder to maintain clarity.</p>

            <h3>Common Context Polluters</h3>
            <ul>
                <li><strong>Debug Output Dumps:</strong> Pasting entire log files when only specific errors matter</li>
                <li><strong>Repetitive Information:</strong> Running the same commands multiple times without clearing results</li>
                <li><strong>Task Switching Residue:</strong> Moving from debugging to feature development without context reset</li>
                <li><strong>Contradictory Instructions:</strong> Conflicting requirements from different phases of work</li>
                <li><strong>Verbose Explorations:</strong> Extensive file searching and reading that's no longer relevant</li>
            </ul>

            <pre><code class="language-bash">{{SNIPPET:understanding-llm-context-management/context-pollution-example.sh}}</code></pre>
        </section>

        <section>
            <h2>The Hidden Costs of Bloated Context</h2>

            <h3>Performance Degradation</h3>
            <p>Model accuracy measurably degrades as context approaches its limit, even when the context window technically has room left. It's like asking someone to remember a phone number after reading an entire encyclopedia: the important information gets lost in the noise.</p>

            <h3>Attention Dilution</h3>
            <p>LLMs use <a href="https://en.wikipedia.org/wiki/Attention_(machine_learning)" target="_blank" rel="noopener">attention mechanisms</a> to focus on relevant parts of the context. When the context is small, this works well. As it grows, the model has to spread that same attention capacity across more content, and less of it lands on what's actually relevant to your current message.</p>

            <h3>Confusion and Hallucination</h3>
            <p>When context contains contradictory information, <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">LLMs</a> may blend incompatible instructions or fabricate responses to reconcile conflicts:</p>

            <pre><code class="language-javascript">{{SNIPPET:understanding-llm-context-management/contradictory-instructions-example.js}}</code></pre>
        </section>

        <section>
            <h2>Recognising Context Problems</h2>
            
            <h3>Context Red Flags</h3>
            <p>Watch for these warning signs that your context has become problematic:</p>
            
            <ul>
                <li><strong>Generic responses:</strong> AI gives vague advice instead of specific solutions</li>
                <li><strong>Forgotten instructions:</strong> Suggestions ignore recent clarifications or requirements</li>
                <li><strong>Mixed terminology:</strong> Blending concepts from different parts of the conversation</li>
                <li><strong>Declining quality:</strong> Responses become less helpful over time</li>
                <li><strong>Contradictory advice:</strong> AI suggests conflicting approaches in the same response</li>
                <li><strong>Lost context:</strong> "I don't see that in the code" when it was just discussed</li>
            </ul>
            
            <p>When you notice these signs, it's time to apply context management strategies.</p>
        </section>
        
        <section>
            <h2>Essential Context Management Techniques</h2>
            
            <h3>1. Manual Context Hygiene</h3>
            <p>Unlike browser tabs that persist, AI conversations require explicit clearing. Here's how to actually reset your context:</p>

            <h4>How to Clear Context in Different Tools</h4>

            <pre><code class="language-bash">{{SNIPPET:understanding-llm-context-management/clear-context-commands.sh}}</code></pre>

            <p><strong>Other tools:</strong></p>
            <ul>
                <li><strong>ChatGPT/Claude web:</strong> start a new chat/conversation</li>
                <li><strong>VS Code Copilot:</strong> close and reopen the chat panel</li>
            </ul>

            <p><em>Learn more about <a href="https://docs.anthropic.com/en/docs/claude-code/slash-commands" target="_blank" rel="noopener">Claude Code slash commands</a></em></p>

            <h4>The Phase Transition Clear, Step by Step</h4>

            <pre><code>{{SNIPPET:understanding-llm-context-management/clear-context-workflow.txt}}</code></pre>

            <h4>Bridging Old and New Context With a Summary</h4>

            <pre><code class="language-bash">{{SNIPPET:understanding-llm-context-management/summary-bridge-workflow.sh}}</code></pre>

            <p><strong>Important:</strong> The summary is NOT automatically included after clearing. You must either:</p>
            <ul>
                <li>Save it to a file and read it in the new session</li>
                <li>Manually copy and paste relevant parts</li>
                <li>Reference it as a document in your project</li>
            </ul>

            <h3>2. Plan Documents as Context Anchors</h3>

            <p>Plan documents act as persistent memory across context resets: they survive even when the conversation itself is wiped.</p>

            <pre><code>{{SNIPPET:understanding-llm-context-management/plan-document-workflow.txt}}</code></pre>

            <h4>Example Plan Document</h4>
            <pre><code>{{SNIPPET:understanding-llm-context-management/implementation-plan-example.md}}</code></pre>

            <p><strong>Key benefits:</strong></p>
            <ul>
                <li>Plan survives all context resets</li>
                <li>Each execution starts clean but informed</li>
                <li>Progress tracking across sessions</li>
                <li>No confusion from old debugging attempts</li>
            </ul>

        </section>
        
        <section>
            <h2>Advanced Delegation Strategies</h2>
            
            <h3>Sub-Agent Delegation in Claude Code</h3>
            
            <p><a href="https://docs.anthropic.com/en/docs/claude-code" target="_blank" rel="noopener">Claude Code's sub-agents</a> do the messy exploratory work in an isolated context and return only the essential findings to your main conversation:</p>

            <pre><code class="language-bash">{{SNIPPET:understanding-llm-context-management/subagent-delegation-example.sh}}</code></pre>

            <p>Sub-agents are perfect for:</p>
            <ul>
                <li><strong>QA Operations:</strong> Running comprehensive tests and returning just the failures</li>
                <li><strong>Code Analysis:</strong> Scanning large codebases with <a href="https://github.com/BurntSushi/ripgrep" target="_blank" rel="noopener">ripgrep</a> for patterns</li>
                <li><strong>Research Tasks:</strong> Web searches with <a href="https://www.google.com" target="_blank" rel="noopener">Google</a> and documentation review</li>
                <li><strong>Exploration:</strong> Finding files, understanding project structure</li>
            </ul>
            
            <p>The key advantage: sub-agents work in isolated contexts. Their explorations don't contaminate your main conversation, keeping it focused and efficient.</p>
            
            <h3>Context-Aware Communication</h3>
            
            <p>Structure your messages to minimise context pollution:</p>

            <pre><code>{{SNIPPET:understanding-llm-context-management/message-efficiency-example.txt}}</code></pre>
        </section>

        <section>
            <h2>The Paradox of Large Context Windows</h2>
            
            <h3>Bigger Isn't Always Better</h3>
            <p>Having a 1-million-token context window is like having a 10,000-page notebook. Yes, you can write everything down, but finding specific information becomes increasingly difficult. The cognitive load on the model increases, potentially leading to:</p>

            <ul>
                <li><strong>Lost Instructions:</strong> Early directives buried under thousands of tokens</li>
                <li><strong>Conflicting Context:</strong> Contradictions between different parts of the conversation</li>
                <li><strong>Attention Scatter:</strong> Model struggles to identify what's currently relevant</li>
                <li><strong>Slower Processing:</strong> More context means more computation time</li>
            </ul>

            <p>The ideal context size is one that's enough to maintain continuity and necessary information, but not so much that it becomes unwieldy. For most development tasks, 10,000-50,000 tokens of well-curated context will probably outperform 200,000 tokens of chaotic conversation history.</p>
        </section>

        <section>
            <h2>Advanced Context Strategies</h2>

            <h3>Checkpointing Your Progress</h3>
            <p>Like saving your game progress, create context checkpoints at major milestones:</p>

            <pre><code>{{SNIPPET:understanding-llm-context-management/checkpoint-example.md}}</code></pre>

            <h3>Budgeting Your Context Tokens</h3>
            <p>Treat context like a budget and allocate tokens to different purposes:</p>

            <pre><code>{{SNIPPET:understanding-llm-context-management/context-budget-example.md}}</code></pre>

            <h3>Layering Context by Relevance</h3>
            <p>Structure context in semantic layers, from most to least relevant:</p>
            
            <ol>
                <li><strong>Immediate Context:</strong> Current task and recent exchanges</li>
                <li><strong>Working Context:</strong> Active files and recent changes</li>
                <li><strong>Reference Context:</strong> Project structure and conventions</li>
                <li><strong>Historical Context:</strong> Summaries of completed work</li>
            </ol>
        </section>

        <section>
            <h2>Context Management Best Practices</h2>
            
            <h3>Do's</h3>
            <ul>
                <li>✅ Start fresh contexts for distinctly different tasks</li>
                <li>✅ Create plan documents before complex implementations</li>
                <li>✅ Use sub-agents for exploratory or research tasks</li>
                <li>✅ Summarise before context resets</li>
                <li>✅ Be explicit about what information is currently relevant</li>
                <li>✅ Prune verbose output before continuing</li>
            </ul>
            
            <h3>Don'ts</h3>
            <ul>
                <li>❌ Paste entire log files without filtering</li>
                <li>❌ Repeat the same operations multiple times</li>
                <li>❌ Mix unrelated tasks in the same conversation</li>
                <li>❌ Assume the model remembers early instructions in long contexts</li>
                <li>❌ Include conflicting requirements without clarification</li>
            </ul>
        </section>

        <section>
            <h2>Quick Context Health Check</h2>
            
            <p>Before your next message, ask yourself:</p>

            <ul>
                <li>Is this conversation focused on one clear objective?</li>
                <li>Have I included conflicting information?</li>
                <li>Could I explain the current state in 2-3 sentences?</li>
                <li>Am I about to paste more than 50 lines of output?</li>
                <li>Would starting fresh be more efficient?</li>
            </ul>

            <p>If you answered "no" to the first question or "yes" to any others, it's time to manage your context.</p>
        </section>
        
        <section>
            <h2>The Future of Context Management</h2>
            
            <p>As we move toward even larger context windows, the challenge shifts from capacity to curation. The winners in AI development probably won't be those with the largest contexts, but those who manage context most intelligently.</p>

            <h3>Emerging Patterns</h3>
            <ul>
                <li><strong>Hierarchical Context:</strong> Multi-level context systems with different retention policies</li>
                <li><strong>Semantic Compression:</strong> Automatic summarisation of older context</li>
                <li><strong>Context Routing:</strong> Different sub-contexts for different aspects of work</li>
                <li><strong>Persistent Memory:</strong> Long-term storage separate from working context</li>
            </ul>
        </section>

        <section>
            <h2>Building Context Management Into Your Workflow</h2>

            <p>Working effectively with <a href="https://en.wikipedia.org/wiki/Large_language_model" target="_blank" rel="noopener">LLMs</a> like <a href="https://claude.ai/code" target="_blank" rel="noopener">Claude Code</a> means curating context deliberately rather than just accumulating it. Two habits do most of the work: clearing context at natural task boundaries, backed by a plan document that survives the clear, and delegating exploratory work to sub-agents so it never pollutes your main conversation in the first place. Everything else in this article is detail layered on top of those two moves.</p>

            <p>Treat context the way you'd treat any other resource with a cost attached to it: prune it, budget it, and reset it deliberately rather than letting it accumulate by default.</p>
        </section>
    `,
  },
  {
    id: 'unix-philosophy-strategic-guide',
    title: 'The Unix Philosophy: A Strategic Guide for Technology Leadership',
    description:
      'How the 50-year-old Unix philosophy still shapes resilient infrastructure, reduces vendor lock-in, and gives technology leaders more room to manoeuvre through modular, composable systems.',
    date: '2025-08-13',
    category: CATEGORIES.infrastructure.id,
    readingTime: 12,
    author: 'Joseph Edmonds',
    tags: [],
    subreddit: 'programming',
    register: 'formal',
    heroImage: {
      src: '/images/unix-philosophy-strategic-guide/hero.webp',
      alt: 'A black-and-white photograph of a machine shop interior, showing a wall of tool racks and chucks, an electrical panel, and several lathes',
      ogImage: '/images/unix-philosophy-strategic-guide/og.jpg',
      creditText: 'Image: NPS/HAER, public domain, via Wikimedia Commons',
      creditUrl:
        'https://commons.wikimedia.org/wiki/File:Interior_of_machine_shop-lathes._-_Barbour_Boat_Works,_Tryon_Palace_Drive,_New_Bern,_Craven_County,_NC_HAER_NC,25-NEBER,29-29.tif',
    },
    content: `
<div class="intro">
            <p class="lead">In 1969, a small team at Bell Labs created Unix with a deliberate design philosophy: build simple tools that do one thing well and compose together cleanly. That philosophy still shapes how resilient technology platforms get built today, from Netflix's move away from a single monolithic codebase to the infrastructure-as-code tooling most cloud teams now take for granted. For technology leaders, applying Unix principles means building resilient, cost-effective, and strategically flexible platforms that create competitive advantage through speed, agility, and vendor independence.</p>
        </div>

        <section>
            <h2>The Business Case for Modular Architecture</h2>

            <p>The Unix philosophy centres on three core principles that translate directly to business value:</p>

            <ul>
                <li><strong>Single Responsibility</strong>: Each component does one thing exceptionally well, reducing complexity and maintenance costs</li>
                <li><strong>Composability</strong>: Components work together through standard interfaces, enabling rapid innovation</li>
                <li><strong>Universal Communication</strong>: Vendor-neutral data exchange prevents lock-in and enables best-of-breed selection</li>
            </ul>

            <p>These principles solve problems that otherwise constrain growth and increase operational risk. Companies that adopt modular architecture deliberately, rather than backing into it through years of ad hoc integration, tend to see fewer of the coordination bottlenecks that slow monolithic systems down: teams can ship independently instead of queuing behind a single release train.</p>

            <h3>The Strategic Architecture Framework</h3>

            <p>Think of modular architecture as a business capability framework rather than a purely technical decision. Instead of monolithic systems that require coordinated changes across multiple business functions, modular approaches enable:</p>

            <ul>
                <li><strong>Independent innovation</strong>: teams can improve customer experience, payment processing, or inventory management without touching unrelated systems</li>
                <li>Risk isolation, so a problem in one business area doesn't cascade across the whole operation</li>
                <li>The freedom to swap in a best-of-breed vendor for a single capability without a system-wide migration</li>
                <li><strong>Faster competitive response</strong>: deploying a new feature or reacting to a market shift in weeks rather than months</li>
            </ul>
        </section>

        <section>
            <h2>Unix Philosophy in Practice: Composable Code</h2>

            <p>The principle behind all of this is easiest to see in code rather than in a slide deck. A Unix pipeline chains small, single-purpose tools together, and each tool knows nothing about the others beyond the shape of the data passing through:</p>

            <pre><code class="language-bash">{{SNIPPET:unix-philosophy-strategic-guide/log-pipeline.sh}}</code></pre>

            <p>Nothing here is unique to the shell. The same idea of small, composable units with a shared interface works just as well inside an application. A pipeline of single-purpose PHP classes, each implementing the same simple contract, composes in exactly the same way that shell commands do:</p>

            <pre><code class="language-php">{{SNIPPET:unix-philosophy-strategic-guide/composable-pipeline.php}}</code></pre>

            <p>Neither example is complicated, and that's the point. The value isn't in any individual step; it's in being able to reorder, replace, or test each step in isolation, because none of them depend on the internals of their neighbours.</p>
        </section>

        <section>
            <h2>Modern Implementation: From Monoliths to Microservices</h2>

            <p>The transition from monolithic to modular architectures changes development velocity, operational cost structure, and business agility all at once. Plenty of organisations now run at least part of their estate as microservices, though the transition is rarely as smooth in the first year as the sales pitch suggests: teams that skip the organisational planning tend to feel that pain earliest.</p>

            <h3>Development Velocity and Team Productivity</h3>

            <p>Organisations that restructure teams around business capabilities rather than technical layers tend to see real gains:</p>

            <ul>
                <li>Autonomous team structures that raise development velocity without necessarily adding headcount</li>
                <li>Parallel development across teams working on genuinely independent services</li>
                <li>Less coordination overhead between business units and technology teams</li>
                <li>Faster time-to-market for new products, because more of the underlying plumbing already exists as a reusable component</li>
            </ul>

            <p>Here's the key insight for executives: modular architectures align technology structure with business strategy, removing the technical constraints that traditionally slow business innovation.</p>

            <h3>Operational Excellence Through Platform Thinking</h3>

            <p>Leading companies implement <em>platform strategies</em> based on Unix principles, where shared infrastructure capabilities enable rapid application development. This approach delivers:</p>

            <ul>
                <li><strong>Standardised deployment patterns</strong> reducing operational complexity</li>
                <li><strong>Centralised monitoring and observability</strong> improving system reliability</li>
                <li>Automated scaling and resource management, matching infrastructure spend to actual demand rather than fixed provisioning</li>
                <li><strong>Security by design</strong> through consistent policy enforcement</li>
            </ul>
        </section>

        <section>
            <h2>Infrastructure as Code: Strategic Operations Excellence</h2>

            <p>Modern infrastructure management exemplifies Unix philosophy through declarative, composable approaches. Infrastructure-as-Code (IaC) transforms operations from manual, error-prone processes into automated, reproducible business capabilities, which directly affects competitive positioning.</p>

            <h3>The Strategic Value of Declarative Infrastructure</h3>

            <p>Organisations implementing Infrastructure-as-Code report meaningful business benefits:</p>

            <ul>
                <li>Deployment consistency that eliminates the environment-specific bugs that delay launches</li>
                <li><strong>Disaster recovery</strong>: a complete environment can be rebuilt in minutes rather than days</li>
                <li>Compliance automation, turning security and regulatory requirements into enforced policy rather than a manual checklist</li>
                <li><strong>Cost transparency</strong>: infrastructure spend becomes traceable to specific business initiatives</li>
            </ul>

            <h3>Cloud Cost Optimisation Through Modular Design</h3>

            <p>Cloud cost visibility is a persistent pain point for technology leaders: infrastructure spend is easy to approve and hard to attribute to a specific initiative once it's live. Public cloud spending keeps climbing regardless of how well any individual organisation manages it, and Gartner put worldwide spend at <a href="https://fullscale.io/blog/microservices-roi-cost-benefit-analysis/" target="_blank" rel="noopener">$723 billion for 2025</a>. Unix-inspired modular infrastructure addresses the attribution problem directly:</p>

            <ul>
                <li><strong>Granular resource management</strong>: each business capability carries its own measurable infrastructure cost</li>
                <li>Automated scaling tied to actual demand rather than over-provisioned estimates</li>
                <li>A multi-cloud strategy that creates vendor negotiation leverage and reduces lock-in</li>
                <li>FinOps tooling that can attribute and optimise spend at the level of an individual component</li>
            </ul>
        </section>

        <section>
            <h2>Real-World Examples: Architecture Shaping Strategy</h2>

            <h3>Netflix: From Constraint to Competitive Advantage</h3>

            <p>Netflix's shift from a DVD-by-mail service to a global streaming platform is one of the most cited examples of Unix philosophy applied at scale. Its move away from a single monolithic codebase, starting around 2009, removed constraints that had been limiting how fast the business could grow:</p>

            <ul>
                <li>New features and recommendation-engine changes ship independently, without a single coordinated release across the whole platform</li>
                <li><strong>Isolated failure domains</strong>: a fault in one service doesn't need to take the whole platform down with it</li>
                <li>Deployment frequency far higher than a monolithic release train allows, because a change to one service doesn't require re-testing everything else</li>
                <li>A <a href="https://www.cloudzero.com/blog/netflix-aws/" target="_blank" rel="noopener">10% reduction in data-warehouse storage footprint</a>, which the FinOps vendor CloudZero attributes to better cost attribution once Netflix's infrastructure spend was broken down by service</li>
            </ul>

            <h3>Amazon: From E-commerce to Platform Economy</h3>

            <p>Amazon's evolution from a monolithic e-commerce platform into the world's largest cloud provider shows the strategic value of modular thinking. Its service-oriented architecture became the foundation for entirely new business models:</p>

            <ul>
                <li><strong>Business agility</strong>: launching new services (AWS itself) by exposing internal infrastructure capabilities as external products</li>
                <li>Operational discipline built on small, independently deployable services rather than one large deployment coordinated across every team</li>
                <li>Resource efficiency, scaling each service to its own demand instead of over-provisioning the whole platform</li>
                <li>Turning what had been purely internal technology investment into a revenue-generating platform business</li>
            </ul>

            <h3>The Executive Insight: Architecture as Strategy</h3>

            <p>Both companies illustrate the same point: technology architecture can become business strategy in its own right. Modular systems don't just support an existing business model; they can enable an entirely new one. Netflix's recommendation engine became a competitive differentiator in its own right, and Amazon's internal infrastructure became AWS itself.</p>
        </section>

        <section>
            <h2>Strategic Business Benefits: The Executive Value Proposition</h2>

            <h3>Vendor Independence and Negotiating Power</h3>

            <p>Vendor lock-in is a standing concern for technology leaders managing cloud contracts. Most organisations are already operating multi-cloud in practice: <a href="https://digitaldefynd.com/IQ/cto-navigating-cloud-vendor-lock-in/" target="_blank" rel="noopener">Flexera's 2024 State of the Cloud report</a> put the figure at 89% of enterprises, often as a side effect of years of individual purchasing decisions rather than a deliberate strategy. Unix-inspired modular design turns that reality into leverage instead of a liability:</p>

            <ul>
                <li><strong>Component-level vendor selection</strong>: choosing the best available tool for each capability, rather than being tied to one vendor's whole stack</li>
                <li>Lower migration risk, because replacing one service doesn't require a system-wide rewrite</li>
                <li>Genuine competitive tension between vendors at the level of individual components rather than the whole platform</li>
                <li>The ability to adopt new technology incrementally, rather than through a costly full rewrite</li>
            </ul>

            <p>Organisations running multi-cloud modular strategies generally report more room to negotiate, and less exposure if a single vendor changes its pricing or roadmap.</p>

            <h3>Operational Excellence and Competitive Positioning</h3>

            <p>Unix principles create operational advantages that translate into competitive positioning:</p>

            <ul>
                <li><strong>Business continuity</strong>: service failures stay isolated, so most customers never notice an incident affecting one component</li>
                <li>Independent deployment removes a lot of the coordination bottleneck between teams</li>
                <li>Faster market response, because a competitive feature can ship in weeks rather than waiting for a full quarterly release cycle</li>
                <li><strong>Talent optimisation</strong>: teams build deep expertise in a specific business domain instead of spreading thin across an entire monolith</li>
            </ul>

            <p>Organisations that adopt microservices strategically tend to report a lighter operational load per service, even though the total number of moving parts increases; the isolation and standard tooling more than make up for the added count.</p>

            <h3>Financial Impact and ROI Measurement</h3>

            <p>The financial case for modular architecture becomes clear through improved business metrics rather than a single headline number:</p>

            <ul>
                <li><strong>Revenue impact</strong>: faster feature delivery correlates with market share gains</li>
                <li>A cost structure that flexes with business demand instead of sitting fixed</li>
                <li>Reduced business impact from technology failures or vendor changes</li>
                <li><strong>Capital efficiency</strong>: lower total cost of ownership through strategic vendor diversification</li>
            </ul>
        </section>

        <section>
            <h2>Implementation Strategy for Leadership</h2>

            <h3>Strategic Assessment Framework</h3>

            <p>Successful technology leaders tend to prioritise a strategic assessment before touching architecture, rather than jumping straight to a technical migration plan:</p>

            <ul>
                <li><strong>Business constraint analysis</strong>: identify where the current architecture is actually limiting growth or competitive response</li>
                <li>Vendor risk assessment, quantifying the financial and strategic exposure created by current vendor dependencies</li>
                <li>Organisational readiness: whether team structures already match the business capabilities the new architecture is meant to serve</li>
                <li>Weighing the cost of modernisation against the cost of standing still whilst competitors move faster</li>
            </ul>

            <h3>Executive-Driven Migration Strategy</h3>

            <p>Successful transformations need executive leadership, not just technical execution. A workable approach:</p>

            <ol>
                <li><strong>Business capability mapping</strong>: define services around business value, not technical convenience</li>
                <li>Choose an initial pilot project that can demonstrate clear business value on its own</li>
                <li>Set aside a meaningful share of the development budget for shared platform capabilities, rather than funding every team's infrastructure separately</li>
                <li>Restructure teams around business outcomes rather than technical functions</li>
                <li>Track business agility metrics as well as technical performance, not instead of it</li>
            </ol>

            <h3>ROI Measurement and Success Metrics</h3>

            <p>Focus on business metrics that demonstrate competitive advantage:</p>

            <ul>
                <li><strong>Time-to-market</strong>: how quickly new business capabilities reach customers</li>
                <li>The number of business experiments and iterations a team can run per quarter</li>
                <li><strong>Market response time</strong>: speed of competitive feature matching or market opportunity capture</li>
                <li>Fewer service disruptions alongside faster feature delivery</li>
                <li>Total economic impact, including cost savings, revenue acceleration, and risk mitigation together</li>
            </ul>
        </section>

        <section>
            <h2>Executive Risk Management: Avoiding Common Transformation Pitfalls</h2>

            <h3>Organisational Transformation Challenges</h3>

            <p>Technical transformation doesn't succeed on its own; it needs organisational change alongside it. Most of the friction that shows up in the first year traces back to organisational misalignment rather than the technology itself:</p>

            <ul>
                <li><strong>Conway's Law</strong>: system architecture tends to mirror organisational communication patterns, so it's worth designing both together deliberately</li>
                <li>Sustained leadership commitment matters more here than in most technical projects, because the difficult period comes before the benefits do</li>
                <li>A shift from project-based to product-based thinking, where teams own outcomes rather than handing off a finished project</li>
                <li>Expect complexity to increase before it decreases; teams that abandon the effort during that window rarely see the eventual payoff</li>
            </ul>

            <h3>Strategic Risk Mitigation</h3>

            <p>Address risks through executive-level governance and strategic planning:</p>

            <ul>
                <li><strong>Incremental value delivery</strong>: ensure each phase delivers measurable business value on its own</li>
                <li>A vendor diversification strategy that prevents new forms of lock-in through technology standardisation</li>
                <li>Investment in internal capability, rather than relying entirely on external expertise</li>
                <li><strong>Business continuity planning</strong>: maintain parallel systems during transition to limit business risk</li>
            </ul>

            <h3>Success Probability Factors</h3>

            <p>Organisations that pull off a modular transformation tend to share a few characteristics:</p>

            <ul>
                <li>Executive championship, with CTO and business leadership actively driving the organisational change</li>
                <li><strong>Business-first design</strong>: architecture decisions driven by business strategy, not technical preference</li>
                <li>An iterative approach that proves value incrementally rather than attempting one comprehensive transformation</li>
                <li>Equal investment in people and process, not just technology</li>
            </ul>
        </section>

        <section>
            <h2>The Strategic Advantage: Composable Business Architecture</h2>

            <p>The Unix philosophy's greatest business value lies in creating <em>composable business architecture</em>, where technology infrastructure becomes a strategic asset that accelerates business evolution rather than constraining it.</p>

            <h3>Competitive Intelligence and Market Response</h3>

            <p>Companies with modular architectures gain real competitive advantages through speed and agility. When competitors launch new features or market conditions shift, modular organisations can respond at business speed:</p>

            <ul>
                <li><strong>Feature parity</strong>: matching competitive features in weeks through component recombination rather than a rewrite</li>
                <li>Deploying new business models without infrastructure holding them back</li>
                <li>A/B testing new approaches without system-wide risk</li>
                <li>Adapting services for new markets through localised components rather than a parallel codebase</li>
            </ul>

            <h3>Merger and Acquisition Value</h3>

            <p>Modular architectures can turn M&A integration from a cost centre into a competitive capability:</p>

            <ul>
                <li><strong>Integration velocity</strong>: reducing integration timelines from years to months using API-first approaches</li>
                <li>Preserving an acquired company's unique capabilities whilst still capturing synergies</li>
                <li>More accurate due diligence, because integration complexity is easier to assess when systems are already modular</li>
                <li>Divesting or restructuring business units without being blocked by technology dependencies</li>
            </ul>

            <h3>Regulatory Agility and Compliance</h3>

            <p>Regulatory requirements keep growing more complex and more varied by jurisdiction. Modular architectures offer real compliance advantages:</p>

            <ul>
                <li><strong>Granular policy enforcement</strong>: different data handling rules per jurisdiction, applied at the component level</li>
                <li>Audit scope isolated to the specific business capability under review</li>
                <li>Room to experiment with new compliance approaches without system-wide impact</li>
                <li>Regulatory issues contained to a specific service rather than spreading across the whole system</li>
            </ul>
        </section>

        <section>
            <h2>Future-Proofing Your Technology Strategy</h2>

            <h3>Cloud-Native Cost Optimisation</h3>

            <p>Economic pressure keeps cloud cost optimisation on the agenda, but cutting costs at the expense of the ability to ship features isn't a stable trade either. Unix principles offer a way to hold both at once:</p>

            <ul>
                <li>Serverless functions that only cost money whilst they're actually doing work, which suits genuinely variable workloads better than a fixed server footprint</li>
                <li>FinOps tooling that optimises spending at the level of an individual component</li>
                <li><strong>Resource right-sizing</strong>: matching infrastructure consumption to actual business demand</li>
                <li>Multi-cloud arbitrage, moving workloads to wherever they're cheapest to run without a rewrite</li>
            </ul>

            <h3>AI and Machine Learning Integration</h3>

            <p>Modular architectures provide a solid foundation for AI adoption. Rather than building a monolithic AI platform that creates a new vendor dependency, organisations building AI capabilities as composable services keep more of their options open:</p>

            <ul>
                <li><strong>Experimental agility</strong>: deploying and testing ML models without disrupting core business systems</li>
                <li>Connecting AI services to existing business data through standard interfaces</li>
                <li>Avoiding AI platform lock-in through an API abstraction layer</li>
                <li>Adding AI capabilities to existing business processes incrementally, rather than replacing them outright</li>
            </ul>

            <h3>Edge Computing and Distributed Business Models</h3>

            <p>Computing keeps moving towards the edge, and business models are becoming more distributed along with it. Unix principles stay relevant there too:</p>

            <ul>
                <li>Lightweight services optimised for minimal resource consumption</li>
                <li><strong>Autonomous operation</strong>: services that keep functioning when disconnected from central systems</li>
                <li>Edge services that adapt to local regulatory and business requirements</li>
                <li>Consistent service behaviour across otherwise very different deployment environments</li>
            </ul>
        </section>

        <section>
            <h2>Executive Action Plan: Building Your Modular Technology Strategy</h2>

            <h3>Strategic Implementation Roadmap</h3>

            <p>For technology leaders ready to implement Unix principles as competitive advantage:</p>

            <ol>
                <li><strong>Business case development</strong>: quantify how current architectural constraints affect business growth and competitive positioning</li>
                <li>Restructure teams around business outcomes, so Conway's Law works in your favour rather than against it</li>
                <li>Establish shared platform capabilities that accelerate business innovation rather than constrain it</li>
                <li>Run a strategic pilot: business-critical, but manageable in scope</li>
                <li>Scale proven patterns across the organisation once the pilot's business impact is measured</li>
            </ol>

            <h3>Investment Framework and Budget Allocation</h3>

            <p>Budget allocation should follow a similar logic to the architecture itself: fund shared capability once, rather than paying for it separately inside every team.</p>

            <ul>
                <li><strong>Platform engineering investment</strong>: fund the shared infrastructure that makes every other team faster, instead of leaving each team to solve the same problems independently</li>
                <li>Budget for leadership development, team restructuring, and the cultural change that goes with both</li>
                <li>Invest in multi-vendor relationships that prevent lock-in whilst maintaining operational excellence</li>
                <li>Fund ongoing collaboration between business and technology leaders, not just a one-off kick-off meeting</li>
            </ul>

            <h3>Success Measurement and Governance</h3>

            <p>Establish executive-level metrics that track business impact:</p>

            <ul>
                <li><strong>Competitive response time</strong>: how quickly the organisation can match or exceed a competitor's new feature</li>
                <li>Time from identifying a business opportunity to delivering customer value</li>
                <li>Strategic flexibility: the ability to enter new markets, integrate acquisitions, or adapt to regulatory change</li>
                <li>Total economic impact, combining cost savings, revenue acceleration, and risk mitigation</li>
            </ul>
        </section>

        <section>
            <h2>Conclusion: Architecture as Competitive Strategy</h2>

            <p>The Unix philosophy's fifty-year track record demonstrates something durable about building technology platforms: simplicity, modularity, and composability hold up as a strategic framework for technology investment long after the specific tools that first embodied them have moved on.</p>

            <p>Companies that embrace these principles get more than efficient technology out of it. From Netflix's customer experience differentiation to Amazon's platform economy transformation, modular architecture becomes a source of competitive advantage in its own right. Organisations that thrive tend to share one characteristic: technology architecture that accelerates business strategy rather than constraining it.</p>

            <p>What matters is whether the architecture limits the business's options or expands them. Modular, composable systems tend to expand them: more room for agility, vendor independence, and faster innovation.</p>

            <p>The organisations that adapt to market changes fastest, integrate new capabilities most smoothly, and scale most efficiently tend to be the ones whose technology decisions were made with these principles in mind. They're not new ideas. They have simply kept proving themselves for fifty years, and computing's continued fragmentation across cloud, edge, and AI workloads has only made them more relevant.</p>
        </section>
    `,
  },
];

// Article lookup helpers
export function getArticleById(id: string): Article | undefined {
  return SAMPLE_ARTICLES.find(article => article.id === id);
}

export function getAllArticles(): readonly Article[] {
  return [...SAMPLE_ARTICLES].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}
