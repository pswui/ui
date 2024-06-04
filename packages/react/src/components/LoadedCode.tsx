import {forwardRef, useEffect, useState} from "react";
import SyntaxHighlighter from "react-syntax-highlighter";
import { gruvboxDark } from "react-syntax-highlighter/dist/cjs/styles/hljs";
import { Button } from "@components/Button";
import { useToast } from "@components/Toast";
import { twMerge } from "tailwind-merge";

export const GITHUB = "https://raw.githubusercontent.com/p-sw/ui/main";

export const LoadedCode = ({
  from,
  className,
}: {
  from: string;
  className?: string;
}) => {
  const [state, setState] = useState<string | undefined | null>();
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      const res = await fetch(from);
      const text = await res.text();
      setState(text);
    })();
  }, [from]);

  return (
    <div className={twMerge("relative", className)}>
      <Button
        preset="default"
        size="icon"
        className="absolute top-4 right-4 text-black dark:text-white z-10"
        onClick={() => {
          if (typeof state === "string" && state.length > 0) {
            navigator.clipboard.writeText(state ?? "");
            toast({
              title: "Copied",
              description: "The code has been copied to your clipboard.",
              status: "success",
            });
          } else {
            toast({
              title: "Error",
              description: "It seems like code is not loaded yet.",
              status: "error",
            });
          }
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
      <SyntaxHighlighter
        language="typescript"
        style={gruvboxDark}
        className={`w-full h-64 rounded-lg ${!state ? "animate-pulse" : ""}`}
        customStyle={{ padding: "1rem" }}
      >
        {state ?? ""}
      </SyntaxHighlighter>
    </div>
  );
};

export const Code = forwardRef<HTMLDivElement, { children: string; className?: string; language: string }>(({
  children,
  className,
  language,
}, ref) => {
  const { toast } = useToast();

  return (
    <div className={twMerge("relative", className)} ref={ref}>
      <Button
        preset="default"
        size="icon"
        className="absolute top-4 right-4 text-black dark:text-white z-10"
        onClick={() => {
          navigator.clipboard.writeText(children ?? "");
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
      <SyntaxHighlighter
        language={language}
        style={gruvboxDark}
        className={`w-full h-auto max-h-64 rounded-lg`}
        customStyle={{ padding: "1rem" }}
      >
        {children}
      </SyntaxHighlighter>
    </div>
  );
});
