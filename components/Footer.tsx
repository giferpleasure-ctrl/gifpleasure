export default function Footer() {
  return (
    <footer className="border-t border-border py-6 text-center text-textDim text-sm">
      <p>© 2026 GifPleasure — 18+ Only</p>
      <p className="mt-2">
        <a href="/en/dmca" className="hover:text-accent">
          DMCA
        </a>{" "}
        |
        <a href="/en/privacy" className="hover:text-accent ml-2">
          Privacy Policy
        </a>
      </p>
    </footer>
  );
}
