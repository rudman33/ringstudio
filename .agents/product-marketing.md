# Product Marketing Context

*Last updated: June 29, 2026*
*Status: V1 draft, auto-generated from the codebase and build history. Needs Allan's review, especially on competitors, pricing rationale, and anything market-facing that I (Claude) would not know firsthand.*

## Product Overview
**One-liner:** A white-label ring builder you embed on your jewelry website, so customers design their own engagement ring and you get a qualified, ready-to-quote lead.

**What it does:** Jewelry Engine is a SaaS tool for independent jewelers. It provides an embeddable, branded 13-step ring configurator (stone, shape, carat, setting, metal, band, enhancements) that customers use directly on the jeweler's own website. When a customer finishes, AI generates a photorealistic preview of their exact design, and the inquiry, full spec, contact info, budget, timeline, lands directly in the jeweler's dashboard, ready to quote.

**Product category:** Vertical SaaS / lead-generation tool for independent jewelers (sits adjacent to "website builder" and "CRM," but neither, it's a single embeddable widget plus a backend inbox).

**Product type:** B2B SaaS, white-label embed, subscription with usage-based overage.

**Business model:** Monthly subscription, three tiers (Starter $49/mo, Pro $99/mo, Enterprise $249/mo), 14-day free trial (card required), differentiated primarily by monthly AI design generation limits (100 / 500 / unlimited). $25 add-on for 50 extra AI designs if a jeweler exceeds their plan limit.

## Target Audience
**Target companies:** Both independent brick-and-mortar jewelry stores AND online-only jewelry sellers - Allan confirmed no strong preference between the two segments. Common thread: any jeweler selling custom or semi-custom engagement rings who has a website to embed into.

**Decision-makers:** Likely the owner or store manager at a small jeweler, probably not a dedicated marketing person, since this is a small-business buyer.

**Primary use case:** Capturing a customer's ring preferences and contact info before they ever talk to a salesperson, so the jeweler walks into the conversation with a qualified lead and a clear spec instead of a cold inquiry.

**Jobs to be done:**
- Turn passive website visitors into named leads with real intent signal (budget, stone, metal preferences)
- Reduce the back-and-forth of describing a custom ring over email/phone
- Look more modern/high-tech than competing local jewelers who don't have this

**Use cases:**
- Customer browsing a jeweler's website at night, designs their dream ring, submits inquiry without ever calling
- Customer who's nervous about walking into a store cold can try on options privately first
- Jeweler embeds it as a dedicated landing page for paid ads pointing directly to the builder

## Personas
| Persona | Cares about | Challenge | Value we promise |
|---------|-------------|-----------|------------------|
| Jeweler/Owner (likely sole buyer) | More qualified leads, looking modern, not spending dev time | Limited time/budget, not technical, skeptical of new SaaS tools | "Embed one snippet, get real leads with full ring specs, no developer needed" |

[NEEDS ALLAN'S INPUT: is there ever a second persona, e.g. a store manager who's different from the owner, or a marketing agency that sets this up on behalf of jewelers?]

## Problems & Pain Points
**Core problem:** Independent jewelers' websites are mostly static brochures, no way for a visitor to express real purchase intent beyond a generic contact form, so high-intent visitors leave without converting into a lead.

**Why alternatives fall short:**
- A plain contact form captures no specifics, jeweler has no idea what the person actually wants
- Generic web chat widgets aren't built for jewelry-specific decisions (stone/cut/metal/setting)
- Building a custom configurator from scratch requires a developer and ongoing AI infra most small jewelers can't justify

**What it costs them:** Lost leads (visitors who'd have inquired with more guidance, but bounce from a blank contact form), and wasted time on unqualified inquiries that don't specify budget/style.

**Emotional tension:** [NEEDS ALLAN'S INPUT, current guess is feeling behind/outdated compared to bigger jewelry chains with slicker websites, but this should come from real conversations with jewelers, not an assumption]

## Competitive Landscape
**Direct competitor: ShowroomPro (ringbuilder.ai / showroompro.ai)** - AI-powered engagement ring design tool. Based on their own meta description ("Design your dream engagement ring with AI, then collaborate with expert jewelers to bring your vision to life"), this reads as a consumer-facing marketplace/concierge model: the END CUSTOMER designs on ShowroomPro's own branded site, then gets matched or connected to a jeweler to fulfill it. This is meaningfully different from Jewelry Engine's white-label model, where the JEWELER embeds the builder on their OWN branded website and keeps the customer relationship entirely. Allan confirmed their pricing page existed at one point but has since been removed - possibly signals they're repositioning, moving to custom/sales-assisted pricing, or still actively iterating on their go-to-market. Worth periodically re-checking showroompro.ai for changes. Could not fully verify their model via direct browsing since their site is a JS-rendered app not visible to web-fetch tools - this assessment is a reasoned hypothesis based on available text, not a confirmed fact, and should be revisited with a live demo of their product if possible.

**Secondary competitors:** Generic contact-form plugins, live chat widgets (Tidio, Intercom) used as a workaround; general-purpose AI jewelry design tools (Tashvi AI, BLNG, Diatech Studio) that are aimed at designers/manufacturers for ideation, not at jewelers for embeddable customer-facing lead capture
**Indirect competitors:** Jeweler does nothing different and just relies on phone calls / in-store walk-ins

## Differentiation
**Key differentiators:**
- Purpose-built for jewelry decisions (stone/shape/carat/setting/metal/band), not a generic form builder
- AI-generated photorealistic preview of the exact design, not a generic stock photo
- White-label, looks like the jeweler's own site, not "powered by Jewelry Engine"
- No developer needed, one embed snippet

**How we do it differently:** Unlike marketplace/concierge-style competitors (e.g. ShowroomPro, based on available evidence), Jewelry Engine is fully white-label - the customer designs on the JEWELER's own website, under the jeweler's own brand, and the inquiry goes straight to the jeweler. The jeweler owns the customer relationship end-to-end; no third party sits between them and the lead.
**Why that's better:** Higher-intent leads, faster sales conversations, no engineering lift, AND no risk of a third party disintermediating the jeweler's own customer relationship or taking a cut of the eventual sale.
**Why customers choose us:** [Needs real customer validation - currently a hypothesis, not yet proven with paying customers. Core pitch hypothesis: "Your website, your brand, your customer - we just give them something better to do on it."]

## Objections & Anti-Personas
| Objection | Response (current best guess, needs refining with real sales conversations) |
|-----------|------|
| "I don't have a developer to install this" | One embed snippet, no code knowledge required, we can walk you through it |
| "Will this look like MY website or like a generic plugin?" | Fully white-label, your logo, your brand color, your domain |
| "What if customers design something I can't actually make?" | You stock the builder with only the stones/metals/settings you actually carry |
| "Is the AI photo going to look fake/cheesy?" | [Worth having a strong answer here backed by actual example photos once a few real jeweler catalogs are loaded] |

**Anti-persona:** Large jewelry chains/national brands (different sales motion, likely want custom-built solutions); jewelers with no online presence at all (no website to embed into); jewelers who only do off-the-shelf inventory with zero customization.

## Switching Dynamics (JTBD Four Forces)
**Push:** Losing online leads to competitors with a more interactive site experience; tired of low-quality inquiries.
**Pull:** A modern, AI-powered feature their competitors likely don't have yet; low cost of trying (14-day trial).
**Habit:** Comfortable relying on phone calls and in-person walk-ins; this is how we've always done it.
**Anxiety:** Will customers actually use it? Will it look cheap/gimmicky? Is the AI photo going to misrepresent what they can actually deliver?

## Customer Language
[NEEDS ALLAN'S INPUT, no real customer conversations yet, so no verbatim language to capture. This section should be filled in after the first few real jeweler conversations/demos.]

**Words to use:** qualified leads, ready-to-quote, white-label, embed
**Words to avoid:** Anything that sounds like a generic AI tool or no-code app builder, risks sounding like a commodity instead of a jewelry-specific solution

**Glossary:**
| Term | Meaning |
|------|---------|
| Inquiry | A submitted ring design + contact info, the core lead unit in the product |
| Design credit | One AI-generated photo; counts against the plan's monthly limit |
| Step options | The stone/shape/carat/setting/metal/band/enhancement choices a jeweler stocks their builder with |

## Brand Voice
**Tone:** Refined, warm, premium, matches the Cormorant/Montserrat luxury-jewelry visual identity already built into the marketing site.
**Communication style:** Clear and benefit-led for a non-technical small-business owner audience, avoid jargon, lead with outcomes (more qualified leads) not features (API integration).
**Brand personality:** Elegant, modern, trustworthy, approachable, not corporate or cold.

## Proof Points
[NEEDS ALLAN'S INPUT, no real customers, metrics, or testimonials yet. This is the single biggest gap for a credible GTM plan: nearly everything here is currently a hypothesis, not validated.]

## Goals
**Primary business goal:** Land 5-10 paying jewelers within the next 1-3 months (Allan's stated target as of June 29, 2026).
**Key conversion action:** Self-serve signup, Stripe Checkout, first inquiry submitted (the full funnel already built and working)
**Current metrics:** Zero real customers as of June 29, 2026, product is feature-complete and tested but pre-launch.
