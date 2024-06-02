import { ReactNode, Fragment, useState, useContext } from "react";
import { type Toc } from "@stefanprobst/rehype-extract-toc";
import { useLocation } from "react-router-dom";
import { HeadingContext } from "./HeadingContext";

function RecursivelyToc({ toc }: { toc: Toc }) {
  const location = useLocation();
  const [activeHeadings] = useContext(HeadingContext);

  return (
    <ul>
      {toc.map((tocEntry) => {
        return (
          <Fragment key={tocEntry.id}>
            <li
              key={tocEntry.id}
              data-id={tocEntry.id}
              className="text-neutral-500 data-[active='true']:text-black dark:data-[active='true']:text-white text-sm font-medium"
              style={{ paddingLeft: `${tocEntry.depth - 1}rem` }}
              data-active={
                activeHeadings.includes(tocEntry.id ?? "")
                  ? true
                  : location.hash.length > 0
                  ? location.hash === `#${tocEntry.id}`
                  : true
              }
            >
              <a href={`#${tocEntry.id}`}>{tocEntry.value}</a>
            </li>
            {Array.isArray(tocEntry.children) && (
              <RecursivelyToc toc={tocEntry.children} />
            )}
          </Fragment>
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
  const [activeHeadings, setActiveHeadings] = useState<string[]>([]);

  return (
    <HeadingContext.Provider value={[activeHeadings, setActiveHeadings]}>
      <div className="w-full flex flex-col items-center">
        <main className="w-full [:not(:where([class~='not-prose'],[class~='not-prose']_*))]:prose-sm prose lg:[:not(:where([class~='not-prose'],_[class~='not-prose']_*))]:prose-lg p-8 dark:prose-invert">
          {children}
        </main>
      </div>
      <nav className="hidden lg:flex flex-col gap-2 py-8 px-4 sticky top-16 overflow-auto max-h-[calc(100vh-4rem)]">
        <span className="font-bold text-sm">On This Page</span>

        <RecursivelyToc toc={toc} />
      </nav>
    </HeadingContext.Provider>
  );
}
