export default function EmptyPlaceholder() {
  return (
    <div className="relative overflow-hidden rounded-lg bg-card border border-border/50 shadow-sm">
      <div className="aspect-video w-full bg-gradient-to-br from-card to-border/20 flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-12 h-12 mx-auto mb-2 text-textDim text-3xl">⊡</div>
          <div className="text-xs text-textDim">Loading...</div>
        </div>
      </div>
    </div>
  );
}
