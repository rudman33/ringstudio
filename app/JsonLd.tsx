// Ring Studio: structured data (JSON-LD) for the home page.
// Rendered once on the marketing home page (app/page.tsx). FAQS is also used for the visible FAQ section so text matches.
// Facts below come from the live pricing section. Before deploying, confirm the currency (set to USD) and the URL.

const SITE_URL = "https://ringstudio.ca";

export const FAQS = [
  { q: "What is Ring Studio?", a: "Ring Studio is a white-label ring builder for jewelers. Your customers choose a stone, shape and metal on your website, see an AI-rendered preview of their ring, and send you a qualified inquiry." },
  { q: "Does it work with my website platform?", a: "Ring Studio can be embedded on WordPress, Wix, Squarespace, Webflow and GoHighLevel websites." },
  { q: "Is there a free trial?", a: "Yes. Every plan starts with a 14-day free trial, and there are no setup fees." },
  { q: "How many AI designs are included?", a: "Starter includes up to 100 AI designs per month, Pro includes 500, and Enterprise is unlimited. Extra packs of 50 designs are available for $25." },
  { q: "How do I receive customer inquiries?", a: "Every plan includes unlimited inquiries. Each one arrives as an email notification and appears in your built-in inquiry inbox with the customer's choices and contact details." },
]

const data = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "Ring Studio",
      url: SITE_URL,
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE_URL}/#software`,
      name: "Ring Studio",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "A white-label ring builder for jewelers. Customers design their own ring on your website, see an AI-rendered preview, and send you a qualified inquiry.",
      url: SITE_URL,
      publisher: { "@id": `${SITE_URL}/#organization` },
      offers: [
        {
          "@type": "Offer",
          name: "Starter",
          price: "49",
          priceCurrency: "USD", // confirm currency
          description:
            "One builder, up to 100 AI designs per month, unlimited inquiries, email notifications.",
        },
        {
          "@type": "Offer",
          name: "Pro",
          price: "99",
          priceCurrency: "USD", // confirm currency
          description:
            "500 AI designs per month, custom brand colour, Calendly integration, priority support.",
        },
        {
          "@type": "Offer",
          name: "Enterprise",
          price: "249",
          priceCurrency: "USD", // confirm currency
          description:
            "Unlimited AI designs, multiple builder configurations, dedicated onboarding, custom integrations.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
    },
  ],
};

export default function JsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
