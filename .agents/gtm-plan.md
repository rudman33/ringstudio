# Jewelry Engine — 90-Day Go-To-Market Plan

*Last updated: June 30, 2026*
*Goal: 5-10 paying jewelers within 1-3 months*

---

## 1. Executive Summary

**The 3 big bets for the next 90 days:**

1. **Direct outreach beats broad marketing at this stage.** With zero paying customers and a goal of 5-10 in 90 days, the fastest path is personally reaching out to independent jewelers, not building an audience or running ads.

2. **The demo IS the pitch.** Because the product is fully built, tested, and live, every jeweler conversation can end in "let me show you," not "let me explain this in theory."

3. **"You keep your customers" is the wedge.** Given what we found about ShowroomPro's likely marketplace model, the clearest message to lead with: the design and the lead go straight into the jeweler's own inbox, on their own branded site, no middleman, ever.

**90-day priority:** Get the first 5-10 real jewelers signed up and actually embedding the builder on their live websites, not just trial signups that never go live.

**12-month outcome (directional):** A repeatable, proven playbook for acquiring jewelers, enough paying customers to validate pricing and retention, and early signal on whether brick-and-mortar or online-only jewelers convert/retain better.

---

## 2. Strategic Frame

**Category claim:** "The ring builder for your own website" - a lead-capture widget built specifically for jewelry decisions, not a generic form builder or AI image tool.

**ICP, distilled:** An independent jeweler (brick-and-mortar or online-only, no strong preference), with some existing website, who sells custom or semi-custom engagement rings. Owner or store manager is the likely buyer.

**Business-model logic:** Subscription with usage-based ceiling (design credits) - cost scales naturally with lead volume, an easy, fair story for a non-technical buyer.

**Brand voice non-negotiables:** Refined, warm, premium - never sounds like a generic "AI tool" or "no-code app."

---

## 3. Current State

**Team:** Solo founder (Allan), non-technical, working with Claude as build/dev partner. No dedicated marketing, sales, or support headcount.

**What's done:** Full product built and production-tested (signup, Checkout, trial, embeddable builder, AI photo generation, inquiry capture, jeweler dashboard). GoHighLevel CRM integration live. Marketing website live with real positioning, pricing, platform-logo proof, working demo link. A real security vulnerability found and fixed (superadmin auth). Domain, email deliverability, core infrastructure all live. Real password-reset flow built.

**What's in-flight/stuck:** Zero real paying customers. No outreach list, sales script, or demo-call process yet. Limited competitor visibility (one company identified: ShowroomPro, partial picture).

**Real gaps:** No CRM/lead-tracking for outbound sales. No analytics on the marketing site. No case studies or proof points (pre-launch).

---

## 4. Acquisition Strategy

**Primary channel: Direct outreach to independent jewelers.**
- Find via Google Maps, Yelp/Google Business (filtered to real websites), Instagram hashtags (#customengagementring, #jewelrystore)
- Personal outreach message leading with "you keep your customer" + offer to demo with their own designs

**Secondary channel: GoHighLevel agencies.**
- Pitch: "we push leads straight into your client's GHL pipeline"

**Deliberately not yet:** Paid ads (unproven funnel), SEO/content (too slow for 90 days).

**90-day cadence:** ~15-20 personalized outreach messages/week.

---

## 5. Activation

**The activation moment that matters most:** the jeweler successfully embeds the snippet on their real website.

**Friction points:** Non-technical audience, may not stock real ring options yet, may doubt it works without a test inquiry.

**Plan:**
- Dashboard first-run checklist (not yet built): brand setup, stock options, copy embed code, submit test inquiry
- Given solo founder-led sales: personally help the first 5-10 customers embed it on the first call, don't rely on self-serve alone yet
- 3-email onboarding video sequence (scripts written, see .agents/onboarding-video-scripts.md): Day 0 = embedding video, Day 1 = ring options video, Day 2-3 = branding video + nudge if not live yet

---

## 6. Retention

**What drives a jeweler to stay:** Real inquiries actually arriving (the core value prop), low ongoing effort, feeling in control of their own brand/customer relationship.

**Early warning signs (currently invisible, a gap):** Zero inquiries 2+ weeks after going live; signed up but never embedded; approaching design limit without ever upgrading.

**Realistic next step:** Weekly personal review of the superadmin usage data (now built) - sufficient at 5-10 customer scale, no automation needed yet.

---

## 7. Referral

**Why it matters more than usual:** Jewelers know other jewelers - trade associations, supplier relationships, local communities make word-of-mouth travel fast.

**The simple version:** Personal ask after a customer's been live a few weeks and getting inquiries - no incentive needed yet at this scale. Consider a one-free-month mutual referral incentive once there are a few paying customers to offer it to.

**Not worth building yet:** Formal referral-tracking system, unique links, automated payouts.

---

## 8. Revenue

**Current model (already shipped):** Starter $49/mo (100 designs), Pro $99/mo (500 designs), Enterprise $249/mo (unlimited). 14-day trial, card required. $25 add-on for 50 extra designs.

**Decision for the first 5-10 founder-led deals:** Use the superadmin "+ Add jeweler" tool to create trial accounts directly (bypasses Stripe Checkout and the card requirement entirely) for these early, personally-closed deals. Self-serve signup flow (with card requirement) stays as-is for organic/self-serve traffic, where that friction usefully filters tire-kickers.

---

## 9. Pricing Validation

Zero paying customers yet - this is about what to listen for, not what to act on:
- Does $49/mo cause hesitation in conversation?
- Does anyone push back on the card-required trial even with manual onboarding?
- Does anyone ask about annual pricing (not currently offered)?

Not worth doing yet: formal pricing surveys or multivariate tests.

---

## 10. Marketing Operations Stack

| Function | Tool | Status |
|---|---|---|
| Product, billing, design limits | Supabase + Stripe | Live |
| Lead capture (customer to jeweler) | The builder itself | Live |
| CRM push for jewelers' own leads | GoHighLevel integration | Live |
| Your own outreach tracking | None yet | Gap - use a simple spreadsheet |
| Email sequences (onboarding videos) | Not yet built | Gap, drafting later |
| Account monitoring / churn signals | Superadmin dashboard | Live, manual review |
| Analytics on marketing site | None | Gap |

---

## 11. Budget & Resourcing

**Team:** Solo (Allan) + Claude. No hires planned this window.

**Time allocation:** Dominant time cost for next 90 days should be outreach and sales conversations, not more building. New feature ideas should be weighed against "does this help land one of the first 10 customers."

**Budget:** Not yet set as a number. Near-term costs: Replicate (needs topping up), Resend, Supabase, Vercel, Stripe fees. No paid ad spend recommended this window.

**Resourcing risk:** Founder time is the constrained resource - protect outreach time specifically.

---

## 12. Tactical Ideas

(Built from judgment, since the skill's 139-idea reference library doesn't exist in this environment.)

**Direct outreach:**
1. Build target list of 30-50 jewelers across 2-3 cities (Google Maps, prioritize existing website + visible custom work)
2. Personalize each message with a specific detail from their site/Instagram
3. Offer to generate an AI photo of one of their own past designs as an opener
4. Follow up twice before giving up - most replies come on follow-up #2

**GoHighLevel agency channel:**
5. Search GHL's agency directory/partner communities for jewelry/local-service niches
6. Pitch: "give your jeweler clients something their competitors don't have"

**Credibility builders:**
7. Add real jeweler logos to homepage once first customers land (with permission)
8. Ask first happy customer for a short written quote

**Quick site wins:**
9. Add basic analytics (Plausible or Vercel Analytics) to see if "See a live builder" is actually clicked
10. Consider a short looping video/GIF of the builder in action on the homepage hero

---

## 13. 90-Day Execution Timeline

**Days 1-10 - List building + first outreach wave**
- Build 30-50 jeweler target list
- Send first outreach batch (15-20/week)
- Set up outreach-tracking spreadsheet
- Top up Replicate balance

**Days 11-30 - First conversations + first conversions**
- Run demo calls; manually create no-card trial accounts via superadmin for serious prospects
- Personally walk first 2-3 signups through embedding
- Record the 3 onboarding videos with a real account
- Continue weekly outreach cadence in parallel

**Days 31-60 - Scale outreach, watch retention signals**
- Expand target list to more cities if response rate is workable
- Weekly superadmin check for quiet/zero-inquiry accounts
- Ask first happy customer for a referral and quote
- Revisit pricing notes if pushback comes up more than once

**Days 61-90 - Consolidate + assess**
- Add real customer logo(s)/testimonial to homepage
- Reassess: closer to 5 or 10? What's actually converting outreach to customers?
- Decide whether GoHighLevel agency channel is worth deeper investment or should be dropped

**The one metric that matters most throughout:** real signups that actually go live (embedded, getting inquiries) - not just trial signups, which can be misleadingly easy to rack up and mean nothing on their own.
