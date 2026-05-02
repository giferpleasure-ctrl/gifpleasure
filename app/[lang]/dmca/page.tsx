import { Metadata } from "next";
import { Locale } from "@/lib/types";

interface DMCAPageProps {
  params: { lang: Locale };
}

export async function generateMetadata({
  params,
}: DMCAPageProps): Promise<Metadata> {
  return {
    title: "DMCA Notice | GifPleasure",
    description: "Copyright infringement notification and DMCA policy.",
  };
}

export default function DMCAPage() {
  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6">DMCA Notice</h1>

      <div className="space-y-4 text-textDim">
        <p>
          GifPleasure respects the intellectual property rights of others and
          expects its users to do the same. If you believe that your work has
          been copied in a way that constitutes copyright infringement, please
          provide our DMCA Agent with the following information:
        </p>

        <ol className="list-decimal list-inside space-y-2 ml-4">
          <li>A physical or electronic signature of the copyright owner</li>
          <li>
            Identification of the copyrighted work claimed to have been
            infringed
          </li>
          <li>
            Identification of the material that is claimed to be infringing
          </li>
          <li>Your contact information (email, address, phone number)</li>
          <li>
            A statement that you have a good faith belief that use of the
            material is not authorized
          </li>
          <li>A statement that the information in the notice is accurate</li>
        </ol>

        <p className="mt-6">
          Send DMCA notices to: <strong>dmca@gifpleasure.com</strong>
        </p>
      </div>
    </div>
  );
}
