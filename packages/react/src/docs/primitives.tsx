import type React from "react";

import { Badge } from "@components/Badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@components/Card";
import { TabContent, TabList, TabProvider, TabTrigger } from "@components/Tabs";

import { DocsLink } from "./router";

export type TocItem = {
  id: string;
  title: string;
};

export type ExampleDefinition = {
  code: string;
  description: string;
  preview: React.ComponentType;
  title: string;
};

export type ComponentDocDefinition = {
  anatomy?: Array<{
    description: string;
    name: string;
  }>;
  description: string;
  examples: ExampleDefinition[];
  highlights: string[];
  importCode: string;
  sourceFiles: string[];
  title: string;
  usageCode: string;
};

function proseLinkClassName() {
  return "text-neutral-950 underline decoration-neutral-300 underline-offset-4 transition-colors hover:text-neutral-600 dark:text-neutral-50 dark:decoration-neutral-700 dark:hover:text-neutral-300";
}

function SectionHeading({
  id,
  title,
}: {
  id: string;
  title: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <h2
        id={id}
        data-doc-heading=""
        className="scroll-mt-28 text-2xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50"
      >
        {title}
      </h2>
      <DocsLink
        aria-label={`Link to ${title}`}
        href={`#${id}`}
        className="text-sm text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
      >
        #
      </DocsLink>
    </div>
  );
}

function PageIntro({
  badge,
  description,
  title,
}: {
  badge?: string;
  description: string;
  title: string;
}) {
  return (
    <header className="flex flex-col gap-5">
      {badge ? (
        <div>
          <Badge
            status="default"
            size="sm"
          >
            {badge}
          </Badge>
        </div>
      ) : null}
      <div className="flex flex-col gap-3">
        <h1 className="text-4xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-5xl">
          {title}
        </h1>
        <p className="max-w-3xl text-base leading-7 text-neutral-600 dark:text-neutral-300 md:text-lg">
          {description}
        </p>
      </div>
    </header>
  );
}

function PageSection({
  children,
  id,
  title,
}: {
  children: React.ReactNode;
  id: string;
  title: string;
}) {
  return (
    <section className="flex flex-col gap-5">
      <SectionHeading
        id={id}
        title={title}
      />
      <div className="flex flex-col gap-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </section>
  );
}

function CodeBlock({
  code,
  language = "tsx",
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-950 shadow-sm dark:border-neutral-800">
      <div className="border-b border-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em] text-neutral-400">
        {language}
      </div>
      <pre className="overflow-x-auto px-4 py-5 text-sm leading-6 text-neutral-100">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function PreviewTabs({
  code,
  preview: Preview,
}: {
  code: string;
  preview: React.ComponentType;
}) {
  return (
    <TabProvider defaultName="preview">
      <div className="flex flex-col gap-4">
        <div className="w-fit">
          <TabList>
            <TabTrigger name="preview">Preview</TabTrigger>
            <TabTrigger name="code">Code</TabTrigger>
          </TabList>
        </div>
        <TabContent name="preview">
          <div className="rounded-[1.75rem] border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)] dark:border-neutral-800 dark:bg-black/80">
            <Preview />
          </div>
        </TabContent>
        <TabContent name="code">
          <CodeBlock code={code} />
        </TabContent>
      </div>
    </TabProvider>
  );
}

function PillList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="rounded-full border border-neutral-200 bg-white px-3 py-1 text-sm text-neutral-700 dark:border-neutral-800 dark:bg-black dark:text-neutral-300"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="grid gap-3">
      {items.map((item) => (
        <li
          key={item}
          className="flex gap-3 rounded-2xl border border-neutral-200 bg-white/80 px-4 py-3 dark:border-neutral-800 dark:bg-black/60"
        >
          <span className="mt-2 size-2 shrink-0 rounded-full bg-neutral-400 dark:bg-neutral-600" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function AnatomyGrid({
  items,
}: {
  items: NonNullable<ComponentDocDefinition["anatomy"]>;
}) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {items.map((item) => (
        <Card key={item.name}>
          <CardHeader>
            <CardTitle>{item.name}</CardTitle>
            <CardDescription>{item.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </div>
  );
}

function ComponentDocTemplate({ doc }: { doc: ComponentDocDefinition }) {
  const [primaryExample, ...secondaryExamples] = doc.examples;

  return (
    <article className="flex flex-col gap-12">
      <PageIntro
        badge="Component"
        title={doc.title}
        description={doc.description}
      />

      <PageSection
        id="preview"
        title="Preview"
      >
        <p>
          The live example below mirrors the current implementation in this repo
          and keeps the docs aligned with the shipped API.
        </p>
        <PreviewTabs
          code={primaryExample.code}
          preview={primaryExample.preview}
        />
      </PageSection>

      <PageSection
        id="installation"
        title="Installation"
      >
        <p>
          Copy the source file{doc.sourceFiles.length > 1 ? "s" : ""} into your
          project, keep the shared `@pswui-lib` helpers available, and import
          the public exports shown below.
        </p>
        <CodeBlock
          language="txt"
          code={doc.sourceFiles.join("\n")}
        />
      </PageSection>

      <PageSection
        id="usage"
        title="Usage"
      >
        <div className="grid gap-6 xl:grid-cols-2">
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Import
            </h3>
            <CodeBlock
              code={doc.importCode}
              language="tsx"
            />
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Example
            </h3>
            <CodeBlock
              code={doc.usageCode}
              language="tsx"
            />
          </div>
        </div>
      </PageSection>

      <PageSection
        id="api-notes"
        title="API Notes"
      >
        {doc.anatomy?.length ? (
          <div className="flex flex-col gap-6">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
              Exported parts
            </h3>
            <AnatomyGrid items={doc.anatomy} />
          </div>
        ) : null}
        <div className="flex flex-col gap-4">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-neutral-500">
            Current API notes
          </h3>
          <BulletList items={doc.highlights} />
        </div>
      </PageSection>

      <PageSection
        id="examples"
        title="Examples"
      >
        <div className="grid gap-8">
          {secondaryExamples.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-neutral-300 px-4 py-5 text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              The preview above is the primary reference example for this
              component.
            </div>
          ) : (
            secondaryExamples.map((example) => (
              <Card key={example.title}>
                <CardHeader>
                  <CardTitle>{example.title}</CardTitle>
                  <CardDescription>{example.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <PreviewTabs
                    code={example.code}
                    preview={example.preview}
                  />
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </PageSection>
    </article>
  );
}

function FeatureCard({
  description,
  href,
  title,
}: {
  description: string;
  href: string;
  title: string;
}) {
  return (
    <Card asChild>
      <DocsLink
        href={href}
        className="group h-full transition-transform hover:-translate-y-0.5"
      >
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-neutral-500 dark:text-neutral-400">
          Open page
        </CardContent>
      </DocsLink>
    </Card>
  );
}

function HighlightPanel({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <div className="rounded-[1.75rem] border border-neutral-200 bg-white/90 p-6 shadow-[0_20px_60px_-40px_rgba(15,23,42,0.5)] dark:border-neutral-800 dark:bg-black/80">
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-semibold text-neutral-950 dark:text-neutral-50">
          {title}
        </h3>
        <div className="flex flex-col gap-4 text-[15px] leading-7 text-neutral-700 dark:text-neutral-300">
          {children}
        </div>
      </div>
    </div>
  );
}

export {
  BulletList,
  CodeBlock,
  ComponentDocTemplate,
  FeatureCard,
  HighlightPanel,
  PageIntro,
  PageSection,
  PillList,
  PreviewTabs,
  proseLinkClassName,
};
