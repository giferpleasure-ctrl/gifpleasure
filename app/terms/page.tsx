// app/terms/page.tsx
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Terms of Use | GifPleasure",
    description:
      "Terms of use for GifPleasure website. Age restriction 18+ and usage guidelines.",
  };
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Terms of Use</h1>

      <div className="space-y-6 text-textDim">
        <section>
          <h2 className="text-xl font-semibold text-text mb-2">
            Age Restriction
          </h2>
          <p>
            By accessing GifPleasure, you confirm that you are at least 18 years
            old (or the age of majority in your jurisdiction). This website
            contains adult-oriented content and is intended for mature audiences
            only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-2">
            Acceptable Use
          </h2>
          <p>
            You agree to use this website for personal, non-commercial purposes
            only. You may not redistribute, copy, or modify any content from
            this site without explicit permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-2">
            Third-Party Services
          </h2>
          <p>
            This website displays advertisements provided by third-party
            networks (such as Adsterra). These services may collect data about
            your browsing activities in accordance with their own privacy
            policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-2">
            Content Liability
          </h2>
          <p>
            All GIFs displayed on GifPleasure are sourced from publicly
            available content. If you believe any content infringes your rights,
            please contact us via our DMCA page.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-2">
            Changes to Terms
          </h2>
          <p>
            We reserve the right to modify these terms at any time. Continued
            use of the website constitutes acceptance of the updated terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-2">Contact</h2>
          <p>
            For questions about these Terms of Use, please contact us at:{" "}
            <strong>terms@gifpleasure.com</strong>
          </p>
        </section>
      </div>
    </div>
  );
}
