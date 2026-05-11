// app/privacy/page.tsx
import { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Privacy Policy | GifPleasure",
    description: "Privacy policy and data collection information.",
  };
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>

      <div className="space-y-6 text-textDim">
        <section>
          <h2 className="text-xl font-semibold text-text mb-2">
            Information We Collect
          </h2>
          <p>
            We collect anonymous usage data including pages visited, time spent,
            referrer, and aggregated viewing statistics. We do not collect
            personal information such as your name, email address, or IP address
            without your consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-2">Cookies</h2>
          <p>
            We use cookies to remember your preferences (such as liked GIFs,
            viewing history, and sort settings). Cookies are small text files
            stored on your device.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-2">
            Third-Party Services
          </h2>
          <p>
            We use advertising networks (such as ExoClick) and analytics tools.
            These services may collect data about your browsing behavior across
            other websites.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text mb-2">Your Rights</h2>
          <p>
            You can disable cookies in your browser settings. For any requests
            regarding your data, please contact us at{" "}
            <strong>privacy@gifpleasure.com</strong>.
          </p>
        </section>
      </div>
    </div>
  );
}
