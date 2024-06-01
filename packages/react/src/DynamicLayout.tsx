import { ReactNode } from "react";
import { type Toc } from "@stefanprobst/rehype-extract-toc";
import { useLocation } from "react-router-dom";

function RecursivelyToc({ toc }: { toc: Toc }) {
  const location = useLocation();

  return (
    <ul>
      {toc.map((tocEntry) => {
        return (
          <>
            <li
              key={tocEntry.id}
              className="text-neutral-500 data-[active='true']:text-black dark:data-[active='true']:text-white text-sm font-medium"
              style={{ paddingLeft: `${tocEntry.depth - 1}rem` }}
              data-active={
                location.hash.length > 0
                  ? location.hash === `#${tocEntry.id}`
                  : true
              }
            >
              <a href={`#${tocEntry.id}`}>{tocEntry.value}</a>
            </li>
            {Array.isArray(tocEntry.children) && (
              <RecursivelyToc toc={tocEntry.children} />
            )}
          </>
        );
      })}
    </ul>
  );
}

export default function DynamicLayout({
  children,
  toc,
}: {
  children: ReactNode;
  toc: Toc;
}) {
  return (
    <>
      <div className="w-full flex flex-col items-center">
        <main className="w-full [:not(:where([class~='not-prose'],[class~='not-prose']_*))]:prose-sm prose lg:[:not(:where([class~='not-prose'],_[class~='not-prose']_*))]:prose-lg p-8 dark:prose-invert">
          {children}
        </main>
      </div>
      <nav className="hidden lg:flex flex-col gap-2 py-8 px-4">
        <span className="font-bold text-sm">On This Page</span>

        <RecursivelyToc toc={toc} />
      </nav>
    </>
  );
}
