import { RichText } from "./RichText";

/** **bold** + [anchor](/path) inline renderer. */
function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
        part.startsWith("**") ? <strong key={i} className="font-semibold text-black"><RichText text={part.slice(2, -2)} /></strong> : <RichText key={i} text={part} />,
      )}
    </>
  );
}

export function BlogBody({ blocks }: { blocks: string[] }) {
  return (
    <div className="mx-auto max-w-[720px] space-y-5 text-[18px] leading-[1.65] text-body">
      {blocks.map((b, i) =>
        b.startsWith("## ") ? (
          <h2 key={i} className="!mt-10 text-[28px] leading-[1.15] tracking-[-0.05em] text-black md:text-[36px]">{b.slice(3)}</h2>
        ) : b.startsWith("- ") ? (
          <ul key={i} className="list-disc space-y-2 pl-6 marker:text-black/40">
            {b.split("\n").map((li, j) => <li key={j}><Inline text={li.replace(/^- /, "")} /></li>)}
          </ul>
        ) : (
          <p key={i}><Inline text={b} /></p>
        ),
      )}
    </div>
  );
}
