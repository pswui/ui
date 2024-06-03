import { useRef, useEffect, useState, forwardRef } from "react";
import hljs from "highlight.js";
import { Button } from "@components/Button";
import { useToast } from "@components/Toast";
import { twMerge } from "tailwind-merge";

export const GITHUB = "https://raw.githubusercontent.com/p-sw/ui/main";

export const LoadedCode = forwardRef<
  HTMLPreElement,
  { from: string; className?: string }
>(({ from, className }, outRef) => {
  const [state, setState] = useState<string | undefined | null>();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const res = await fetch(from);
      const text = await res.text();
      setState(text);
    })();
  }, [from]);

  const ref = useRef<HTMLPreElement | null>(null);

  useEffect(() => {
    if (state && ref.current && !ref.current.dataset.highlighted) {
      hljs.configure({ ignoreUnescapedHTML: true });
      hljs.highlightElement(ref.current);
    }
  }, [state]);

  return (
    <div className={twMerge("relative", className)}>
      <Button
        preset="default"
        size="icon"
        className="absolute top-4 right-4 text-black dark:text-white z-10"
        onClick={() => {
          navigator.clipboard.writeText(state ?? "");
          toast({
            title: "Copied",
            description: "The code has been copied to your clipboard.",
            status: "success",
          });
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="1.2em"
          height="1.2em"
          viewBox="0 0 24 24"
        >
          <path
            fill="currentColor"
            d="M4 7v14h14v2H4c-1.1 0-2-.9-2-2V7zm16-4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V5c0-1.1.9-2 2-2h3.18C11.6 1.84 12.7 1 14 1s2.4.84 2.82 2zm-6 0c-.55 0-1 .45-1 1s.45 1 1 1s1-.45 1-1s-.45-1-1-1m-4 4V5H8v12h12V5h-2v2z"
          />
        </svg>
      </Button>
      <pre
        className={`relative hljs w-full h-64 rounded-lg ${
          !state ? "animate-pulse" : ""
        }`}
        ref={ref}
      >
        <code className="language-tsx" ref={outRef}>
          {state ?? null}
        </code>
      </pre>
    </div>
  );
});
