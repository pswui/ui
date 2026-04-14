import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/Accordion";
import { Alert, AlertDescription, AlertTitle } from "@components/Alert";
import { Avatar } from "@components/Avatar";
import { Badge } from "@components/Badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/Breadcrumb";
import { Button } from "@components/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/Card";
import { Checkbox } from "@components/Checkbox";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@components/Dialog";
import {
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerRoot,
  DrawerTrigger,
} from "@components/Drawer";
import { FormError, FormHelper, FormItem, FormLabel } from "@components/Form";
import { Input, InputFrame } from "@components/Input";
import { Label } from "@components/Label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/Pagination";
import { Popover, PopoverContent, PopoverTrigger } from "@components/Popover";
import { Progress } from "@components/Progress";
import { RadioGroup, RadioGroupItem } from "@components/RadioGroup";
import { ScrollArea } from "@components/ScrollArea";
import { Select } from "@components/Select";
import { Separator } from "@components/Separator";
import { Skeleton } from "@components/Skeleton";
import { Slider } from "@components/Slider";
import { Switch } from "@components/Switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/Table";
import { TabContent, TabList, TabProvider, TabTrigger } from "@components/Tabs";
import { Textarea, TextareaFrame } from "@components/Textarea";
import { useToast } from "@components/Toast";
import { Toggle } from "@components/Toggle";
import { ToggleGroup, ToggleGroupItem } from "@components/ToggleGroup";
import { Tooltip, TooltipContent } from "@components/Tooltip";

import {
  CodeBlock,
  type ComponentDocDefinition,
  ComponentDocTemplate,
  FeatureCard,
  HighlightPanel,
  PageIntro,
  PageSection,
  PillList,
  type TocItem,
  proseLinkClassName,
} from "./primitives";
import { DocsLink } from "./router";

type DocPage = {
  description: string;
  navLabel?: string;
  path: string;
  render: () => React.ReactNode;
  section: "home" | "document" | "component";
  title: string;
  toc: TocItem[];
};

const snippet = (code: string) => code.trim();

const avatarImageSrc = "/avatar-demo.svg";
const timelineLanes = [
  "Backlog",
  "Planning",
  "Design",
  "Implementation",
  "Review",
  "QA",
  "Release",
];
const activityItems = [
  "Roadmap issue triaged",
  "Design tokens reviewed",
  "Keyboard navigation verified",
  "Playwright harness updated",
  "Component API narrowed",
  "Registry entry prepared",
  "Accessibility pass completed",
  "Release notes drafted",
];

function createComponentPage(
  slug: string,
  definition: ComponentDocDefinition,
): DocPage {
  return {
    description: definition.description,
    navLabel: definition.title,
    path: `/docs/components/${slug}`,
    render: () => <ComponentDocTemplate doc={definition} />,
    section: "component",
    title: definition.title,
    toc: [
      { id: "preview", title: "Preview" },
      { id: "installation", title: "Installation" },
      { id: "usage", title: "Usage" },
      { id: "api-notes", title: "API Notes" },
      { id: "examples", title: "Examples" },
    ],
  };
}

function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-16 md:px-10 md:py-24">
      <section className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div className="flex flex-col gap-8">
          <div className="flex flex-wrap gap-3">
            <Badge>React</Badge>
            <Badge status="success">Tailwind</Badge>
            <Badge status="warning">Copy and paste</Badge>
          </div>
          <div className="flex flex-col gap-5">
            <h1 className="max-w-4xl text-5xl font-semibold tracking-tight text-neutral-950 dark:text-neutral-50 md:text-7xl">
              Build your components in isolation.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-neutral-600 dark:text-neutral-300">
              PSW/UI keeps the moving parts close to the component. The docs are
              intentionally code-first: real previews, current API notes, and
              install guidance that matches the repo as it exists today.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button asChild>
              <DocsLink href="/docs">Get Started</DocsLink>
            </Button>
            <Button
              asChild
              preset="ghost"
            >
              <DocsLink href="/docs/components/accordion">
                Browse Components
              </DocsLink>
            </Button>
          </div>
          <PillList
            items={[
              "No router dependency in the docs app",
              "Playwright harness remains separate",
              "Current component APIs only",
            ]}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <HighlightPanel title="Current direction">
            <p>
              The library stays intentionally small: React, Tailwind CSS, and
              `tailwind-merge` are the only required building blocks.
            </p>
            <p>
              Docs pages keep the old cookbook feel, but the examples are wired
              to the current exports and current source layout.
            </p>
          </HighlightPanel>
          <HighlightPanel title="What changed">
            <p>
              The old `react-router-dom` and MDX stack is replaced by a tiny
              pathname router and TSX-based page definitions.
            </p>
            <p>
              That keeps the app aligned with the package dependencies while
              still supporting direct navigation and static 404 fallbacks.
            </p>
          </HighlightPanel>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        <FeatureCard
          href="/docs/introduction"
          title="Introduction"
          description="Why PSW/UI prefers copy-paste components and a narrow dependency surface."
        />
        <FeatureCard
          href="/docs/installation"
          title="Installation"
          description="Set up Tailwind, wire `@pswui-lib`, and copy components into your app."
        />
        <FeatureCard
          href="/docs/components/select"
          title="Component Docs"
          description="Preview, usage, API notes, and real examples for the current React components."
        />
      </section>
    </main>
  );
}

function DocsOverviewPage() {
  return (
    <article className="flex flex-col gap-12">
      <PageIntro
        badge="Documents"
        title="PSW/UI docs"
        description="A practical reference for the current React package. Start with the installation flow, then move through the component pages for live previews and code-first examples."
      />

      <PageSection
        id="what-to-expect"
        title="What To Expect"
      >
        <p>
          The docs keep the old structure on purpose: compact pages, a stable
          side navigation, and a strong bias toward preview plus code rather
          than long-form prose. Each component page is written against the
          current implementation in{" "}
          <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
            packages/react/components
          </code>
          .
        </p>
        <PillList
          items={[
            "Preview and code tabs",
            "Installation and usage snippets",
            "Current API notes instead of stale props tables",
          ]}
        />
      </PageSection>

      <PageSection
        id="featured-routes"
        title="Featured Routes"
      >
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          <FeatureCard
            href="/docs/introduction"
            title="Introduction"
            description="Project philosophy, current scope, and why the library stays dependency-light."
          />
          <FeatureCard
            href="/docs/installation"
            title="Installation"
            description="Base dependencies, path aliases, and the recommended copy-paste workflow."
          />
          <FeatureCard
            href="/docs/configuration"
            title="Configuration"
            description="Alias wiring, file layout, and the current repo-level setup choices."
          />
          <FeatureCard
            href="/docs/components/form"
            title="Form"
            description="Accessibility-oriented field composition with helper and error wiring."
          />
          <FeatureCard
            href="/docs/components/select"
            title="Select"
            description="The current button-plus-listbox API, controlled state, and keyboard support."
          />
          <FeatureCard
            href="/docs/components/toggle-group"
            title="Toggle Group"
            description="Single and multi-select composition built on top of the Toggle component."
          />
        </div>
      </PageSection>

      <PageSection
        id="component-coverage"
        title="Component Coverage"
      >
        <p>
          The navigation keeps the historically documented components visible
          while filling in the missing pages from the later docs work. That
          means the old core set is still here, and the newer components now
          have the same level of preview, usage, and API coverage.
        </p>
        <PillList
          items={[
            "Accordion",
            "Alert",
            "Avatar",
            "Breadcrumb",
            "Form",
            "Pagination",
            "Progress",
            "ScrollArea",
            "Select",
            "Table",
            "ToggleGroup",
          ]}
        />
      </PageSection>
    </article>
  );
}

function IntroductionPage() {
  return (
    <article className="flex flex-col gap-12">
      <PageIntro
        badge="Documents"
        title="Introduction"
        description="PSW/UI is a set of reusable React components that keep behavior close to the source file. The goal is to give you a system you can actually modify, not a dependency graph you work around."
      />

      <PageSection
        id="why-copy-paste"
        title="Why Copy And Paste"
      >
        <p>
          Many UI kits feel customizable until the behavior needs to change. At
          that point you are tracing through several packages, each with its own
          assumptions. PSW/UI takes the opposite approach: the component source
          is meant to be copied, inspected, and adapted inside your app.
        </p>
        <p>
          That is why the library keeps its dependency surface intentionally
          tight and leans on React, Tailwind CSS, and{" "}
          <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
            tailwind-merge
          </code>{" "}
          rather than a larger runtime stack.
        </p>
      </PageSection>

      <PageSection
        id="current-shape"
        title="Current Shape"
      >
        <p>
          The React package now includes the original core components and a
          broader set of layout, form, feedback, and navigation primitives. Some
          APIs are compound, such as Dialog or Breadcrumb. Others are
          single-file utilities, such as Skeleton, Slider, or Separator.
        </p>
        <PillList
          items={[
            "Compound components where composition matters",
            "Single-file components where copy-paste should stay obvious",
            "Examples that match the live exports in this repo",
          ]}
        />
      </PageSection>

      <PageSection
        id="roadmap"
        title="Roadmap"
      >
        <p>
          The practical priorities are still the same as the older docs: broaden
          coverage, stabilize interaction details, and keep the visuals coherent
          without hiding the implementation. If a component is in the package,
          the docs should show a real example for it.
        </p>
        <p>
          Project discussion and implementation status live in the{" "}
          <DocsLink
            href="https://github.com/pswui/ui"
            target="_blank"
            rel="noreferrer"
            className={proseLinkClassName()}
          >
            GitHub repository
          </DocsLink>
          .
        </p>
      </PageSection>
    </article>
  );
}

function InstallationPage() {
  return (
    <article className="flex flex-col gap-12">
      <PageIntro
        badge="Documents"
        title="Installation"
        description="The recommended flow is still simple: install the base styling dependencies, make `@pswui-lib` resolve to the shared helper file, then copy the component source you want to use."
      />

      <PageSection
        id="base-dependencies"
        title="Base Dependencies"
      >
        <p>
          The React package itself only depends on React, Tailwind CSS, the
          Tailwind Vite plugin, and `tailwind-merge`. If you are copying
          components into another app, you need the equivalent runtime pieces in
          that project.
        </p>
        <CodeBlock
          language="json"
          code={snippet(`
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "tailwind-merge": "^2.3.0",
    "tailwindcss": "^4.0.12"
  }
}
          `)}
        />
      </PageSection>

      <PageSection
        id="shared-lib-alias"
        title="Shared Lib Alias"
      >
        <p>
          Components import shared helpers through{" "}
          <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
            @pswui-lib
          </code>
          . Point that alias at the copied library file in your own project.
        </p>
        <CodeBlock
          language="json"
          code={snippet(`
{
  "compilerOptions": {
    "paths": {
      "@pswui-lib": ["./src/pswui/lib/index.ts"]
    }
  }
}
          `)}
        />
      </PageSection>

      <PageSection
        id="copy-workflow"
        title="Copy Workflow"
      >
        <p>
          Each component page lists the source path you need. For single-file
          components, copy that file and keep the import path intact. For
          compound components, copy the whole folder so the local context and
          index exports stay together.
        </p>
        <CodeBlock
          language="txt"
          code={snippet(`
packages/react/lib/index.ts
packages/react/components/Button.tsx
packages/react/components/Accordion/
packages/react/components/Dialog/
          `)}
        />
      </PageSection>
    </article>
  );
}

function ConfigurationPage() {
  return (
    <article className="flex flex-col gap-12">
      <PageIntro
        badge="Documents"
        title="Configuration"
        description="The current repo keeps alias resolution explicit. Mirror that in your own app so component imports stay predictable and reviewable."
      />

      <PageSection
        id="tsconfig"
        title="TypeScript Paths"
      >
        <p>
          Keep the shared lib alias in `tsconfig.json` so copied components do
          not need relative import rewrites every time you move a file.
        </p>
        <CodeBlock
          language="json"
          code={snippet(`
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@pswui-lib": ["./src/pswui/lib/index.ts"],
      "@components/*": ["./src/pswui/components/*"]
    }
  }
}
          `)}
        />
      </PageSection>

      <PageSection
        id="vite-aliases"
        title="Vite Aliases"
      >
        <p>
          The docs app in this repo resolves the source folders directly in
          Vite. If you keep a copied component library under a dedicated folder,
          matching aliases make examples and imports easier to follow.
        </p>
        <CodeBlock
          language="ts"
          code={snippet(`
import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
  resolve: {
    alias: {
      "@components": resolve(__dirname, "./src/pswui/components"),
      "@pswui-lib": resolve(__dirname, "./src/pswui/lib/index.ts"),
    },
  },
});
          `)}
        />
      </PageSection>

      <PageSection
        id="cli-and-layout"
        title="CLI And Layout"
      >
        <p>
          The repo still includes a CLI package for registry work, but the docs
          app is built around the direct source layout in{" "}
          <code className="rounded bg-neutral-200 px-1.5 py-0.5 text-sm dark:bg-neutral-800">
            packages/react
          </code>
          . A clean local folder structure keeps copied components easier to own
          than a generated layer you never read.
        </p>
      </PageSection>
    </article>
  );
}

function NotFoundPage() {
  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 items-center px-6 py-20">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Page not found</CardTitle>
          <CardDescription>
            The requested route does not exist in the current docs app.
          </CardDescription>
        </CardHeader>
        <CardFooter className="flex flex-wrap gap-3">
          <Button asChild>
            <DocsLink href="/docs">Open docs</DocsLink>
          </Button>
          <Button
            asChild
            preset="ghost"
          >
            <DocsLink href="/docs/components/accordion">
              Open components
            </DocsLink>
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}

const docsOverviewPage: DocPage = {
  description: "Overview and quick entry points into the docs app.",
  navLabel: "Overview",
  path: "/docs",
  render: () => <DocsOverviewPage />,
  section: "document",
  title: "Docs",
  toc: [
    { id: "what-to-expect", title: "What To Expect" },
    { id: "featured-routes", title: "Featured Routes" },
    { id: "component-coverage", title: "Component Coverage" },
  ],
};

const introductionPage: DocPage = {
  description: "Project philosophy and current shape of the library.",
  navLabel: "Introduction",
  path: "/docs/introduction",
  render: () => <IntroductionPage />,
  section: "document",
  title: "Introduction",
  toc: [
    { id: "why-copy-paste", title: "Why Copy And Paste" },
    { id: "current-shape", title: "Current Shape" },
    { id: "roadmap", title: "Roadmap" },
  ],
};

const installationPage: DocPage = {
  description: "Current installation flow for copied React components.",
  navLabel: "Installation",
  path: "/docs/installation",
  render: () => <InstallationPage />,
  section: "document",
  title: "Installation",
  toc: [
    { id: "base-dependencies", title: "Base Dependencies" },
    { id: "shared-lib-alias", title: "Shared Lib Alias" },
    { id: "copy-workflow", title: "Copy Workflow" },
  ],
};

const configurationPage: DocPage = {
  description: "Alias and file-layout configuration notes.",
  navLabel: "Configuration",
  path: "/docs/configuration",
  render: () => <ConfigurationPage />,
  section: "document",
  title: "Configuration",
  toc: [
    { id: "tsconfig", title: "TypeScript Paths" },
    { id: "vite-aliases", title: "Vite Aliases" },
    { id: "cli-and-layout", title: "CLI And Layout" },
  ],
};

const homePage: DocPage = {
  description: "Landing page for the React docs app.",
  path: "/",
  render: () => <HomePage />,
  section: "home",
  title: "Home",
  toc: [],
};

const notFoundPage: DocPage = {
  description: "Fallback page when a route is missing.",
  path: "/404",
  render: () => <NotFoundPage />,
  section: "document",
  title: "Not Found",
  toc: [],
};

function ButtonPreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button>Default</Button>
      <Button preset="ghost">Ghost</Button>
      <Button preset="success">Success</Button>
      <Button asChild>
        <a href="#button-link">As child link</a>
      </Button>
    </div>
  );
}

function ButtonIconExample() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Button size="icon">
        <span aria-hidden="true">+</span>
      </Button>
      <Button preset="warning">Needs review</Button>
      <Button preset="danger">Delete</Button>
    </div>
  );
}

function CheckboxPreview() {
  const [checked, setChecked] = React.useState(true);

  return (
    <div className="flex items-center gap-3">
      <Checkbox
        aria-label="Accept terms"
        checked={checked}
        onChange={(event) => setChecked(event.currentTarget.checked)}
      />
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        {checked ? "Accepted" : "Pending"}
      </span>
    </div>
  );
}

function CheckboxStatesExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Checkbox aria-label="Unchecked" />
      <Checkbox
        aria-label="Checked"
        defaultChecked
      />
      <Checkbox
        aria-label="Disabled"
        disabled
      />
    </div>
  );
}

function DialogPreview() {
  return (
    <DialogRoot>
      <DialogTrigger>
        <Button>Open dialog</Button>
      </DialogTrigger>
      <DialogOverlay closeOnClick>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm publish</DialogTitle>
            <DialogDescription>
              Make the latest docs update visible to every consumer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose>
              <Button preset="ghost">Cancel</Button>
            </DialogClose>
            <DialogClose>
              <Button preset="success">Publish</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogRoot>
  );
}

function DrawerPreview() {
  return (
    <DrawerRoot>
      <DrawerTrigger>
        <Button>Open drawer</Button>
      </DrawerTrigger>
      <DrawerOverlay>
        <DrawerContent
          position="right"
          maxSize="sm"
          aria-labelledby="drawer-title"
          aria-describedby="drawer-description"
        >
          <DrawerHeader>
            <h3
              id="drawer-title"
              className="text-lg font-semibold"
            >
              Team activity
            </h3>
          </DrawerHeader>
          <DrawerBody>
            <p id="drawer-description">
              Review the latest doc changes and staged examples before release.
            </p>
          </DrawerBody>
          <DrawerFooter>
            <DrawerClose>
              <Button preset="ghost">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </DrawerOverlay>
    </DrawerRoot>
  );
}

function InputPreview() {
  return (
    <InputFrame>
      <Input
        aria-label="Email address"
        type="email"
        invalid="Please enter a valid email"
        placeholder="team@pswui.dev"
      />
    </InputFrame>
  );
}

function InputFullWidthExample() {
  return (
    <div className="max-w-lg">
      <InputFrame full>
        <Input
          full
          aria-label="Project name"
          type="text"
          placeholder="Component audit"
        />
      </InputFrame>
    </div>
  );
}

function LabelPreview() {
  return (
    <Label
      direction="horizontal"
      className="rounded-lg border border-neutral-200 px-3 py-2 dark:border-neutral-800"
    >
      <input type="checkbox" />
      <span>Include release notes</span>
    </Label>
  );
}

function PopoverPreview() {
  return (
    <Popover>
      <PopoverTrigger>
        <Button preset="ghost">Project settings</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Environment</span>
          <Button preset="ghost">Production</Button>
          <Button preset="ghost">Preview</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

function SwitchPreview() {
  const [enabled, setEnabled] = React.useState(false);

  return (
    <div className="flex items-center gap-3">
      <Switch
        aria-label="Enable release notifications"
        checked={enabled}
        onChange={(event) => setEnabled(event.currentTarget.checked)}
      />
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        {enabled ? "Enabled" : "Disabled"}
      </span>
    </div>
  );
}

function TabsPreview() {
  return (
    <TabProvider defaultName="account">
      <div className="flex flex-col gap-4">
        <div className="w-fit">
          <TabList>
            <TabTrigger name="account">Account</TabTrigger>
            <TabTrigger name="security">Security</TabTrigger>
            <TabTrigger name="billing">Billing</TabTrigger>
          </TabList>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-800">
          <TabContent name="account">
            <p>Team profile settings.</p>
          </TabContent>
          <TabContent name="security">
            <p>Passkeys and recovery controls.</p>
          </TabContent>
          <TabContent name="billing">
            <p>Invoices and plan changes.</p>
          </TabContent>
        </div>
      </div>
    </TabProvider>
  );
}

function ToastPreview() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-3">
      <Button
        onClick={() =>
          toast({
            title: "Docs published",
            description: "The latest docs build is now available.",
            status: "success",
            closeTimeout: null,
          })
        }
      >
        Show success toast
      </Button>
      <Button
        preset="warning"
        onClick={() =>
          toast({
            title: "Build warning",
            description: "One story needs a responsive pass.",
            status: "warning",
            closeTimeout: null,
          })
        }
      >
        Show warning toast
      </Button>
    </div>
  );
}

function TooltipPreview() {
  return (
    <Tooltip>
      <Button preset="ghost">Hover for details</Button>
      <TooltipContent delay="none">Tooltip content</TooltipContent>
    </Tooltip>
  );
}

function AccordionPreview() {
  return (
    <Accordion
      defaultValue="shipping"
      collapsible
    >
      <AccordionItem value="shipping">
        <AccordionTrigger>Shipping</AccordionTrigger>
        <AccordionContent>
          Ships within 2 to 3 business days for in-stock items.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="returns">
        <AccordionTrigger>Returns</AccordionTrigger>
        <AccordionContent>
          Returns are accepted within 30 days of delivery.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function AccordionControlledExample() {
  const [value, setValue] = React.useState<string | null>("overview");

  return (
    <div className="flex flex-col gap-4">
      <Accordion
        value={value}
        onValueChange={setValue}
        collapsible
      >
        <AccordionItem value="overview">
          <AccordionTrigger>Overview</AccordionTrigger>
          <AccordionContent>
            The controlled value lets surrounding UI react to the open item.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="details">
          <AccordionTrigger>Details</AccordionTrigger>
          <AccordionContent>
            This pattern is useful when a page wants to sync analytics or
            surrounding copy.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Active item: {value ?? "none"}
      </p>
    </div>
  );
}

function AlertPreview() {
  return (
    <div className="flex flex-col gap-3">
      <Alert>
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>
          This default alert keeps supporting copy compact and readable.
        </AlertDescription>
      </Alert>
      <Alert status="success">
        <AlertTitle>Changes saved</AlertTitle>
        <AlertDescription>
          The latest docs update was stored successfully.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function AlertStatusesExample() {
  return (
    <div className="grid gap-3">
      <Alert status="warning">
        <AlertTitle>Review needed</AlertTitle>
        <AlertDescription>
          One example still needs a mobile layout check.
        </AlertDescription>
      </Alert>
      <Alert status="danger">
        <AlertTitle>Build failed</AlertTitle>
        <AlertDescription>
          The preview server could not complete the last deploy.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function AvatarPreview() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar
        src={avatarImageSrc}
        name="Taylor Lane"
      />
      <Avatar
        src="/avatar-missing.png"
        name="Ada Lovelace"
      />
      <Avatar fallback="PS" />
    </div>
  );
}

function AvatarShapesExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Avatar
        shape="square"
        size="lg"
        name="Project Sync"
      />
      <Avatar
        size="sm"
        fallback="QA"
      />
    </div>
  );
}

function BadgePreview() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <Badge>Default</Badge>
      <Badge status="success">Success</Badge>
      <Badge status="warning">Warning</Badge>
      <Badge status="danger">Danger</Badge>
    </div>
  );
}

function BadgeLinkedExample() {
  return (
    <Badge asChild>
      <a href="#badge-link">Linked badge</a>
    </Badge>
  );
}

function BreadcrumbPreview() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="/">Home</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink href="#settings">Settings</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbPage>Profile</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function BreadcrumbCustomSeparatorExample() {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink href="#docs">Docs</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
        <BreadcrumbItem>
          <BreadcrumbPage>Components</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}

function CardPreview() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Design review</CardTitle>
        <CardDescription>Ready for a focused component pass.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Review spacing, contrast, and responsive structure.</p>
      </CardContent>
      <CardFooter>
        <Button>Open review</Button>
      </CardFooter>
    </Card>
  );
}

function CardDashboardExample() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Published pages</CardTitle>
          <CardDescription>Current docs surface area.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">29</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Pending checks</CardTitle>
          <CardDescription>Things to verify before release.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold">4</p>
        </CardContent>
      </Card>
    </div>
  );
}

function FormPreview() {
  return (
    <div className="flex max-w-lg flex-col gap-6">
      <FormItem invalid="Required field">
        <FormLabel>Name</FormLabel>
        <Input
          type="text"
          aria-label="Name"
        />
        <FormHelper hiddenOnInvalid>Helpful instructions</FormHelper>
        <FormError />
      </FormItem>
      <FormItem>
        <FormLabel>Email</FormLabel>
        <Input
          type="email"
          aria-label="Email"
        />
        <FormHelper>Send a work email we can reach.</FormHelper>
        <FormError />
      </FormItem>
    </div>
  );
}

function FormSelectExample() {
  return (
    <div className="flex max-w-lg flex-col gap-6">
      <FormItem invalid="Select a plan">
        <FormLabel>Plan</FormLabel>
        <Select
          aria-label="Plan"
          options={[
            { label: "Starter", value: "starter" },
            { label: "Pro", value: "pro" },
            { label: "Enterprise", value: "enterprise", disabled: true },
          ]}
        />
        <FormHelper hiddenOnInvalid>
          Disabled options stay visible but are skipped by keyboard navigation.
        </FormHelper>
        <FormError />
      </FormItem>
    </div>
  );
}

function PaginationPreview() {
  return (
    <Pagination aria-label="Results pages">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href="#page-0"
            disabled
          />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#page-1"
            active
          >
            1
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-2">2</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#page-8">8</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#page-2" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function PaginationCompactExample() {
  return (
    <Pagination aria-label="Docs pages">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#previous" />
        </PaginationItem>
        <PaginationItem>
          <PaginationLink href="#components">Components</PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationLink
            href="#forms"
            active
          >
            Forms
          </PaginationLink>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#next" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

function ProgressPreview() {
  const [value, setValue] = React.useState(40);

  return (
    <div className="flex max-w-lg flex-col gap-4">
      <Progress
        aria-label="Upload progress"
        value={value}
      />
      <div className="flex items-center gap-3">
        <Button onClick={() => setValue(75)}>Set progress to 75</Button>
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          {value}%
        </span>
      </div>
      <Progress aria-label="Indeterminate progress" />
    </div>
  );
}

function ProgressSizesExample() {
  return (
    <div className="flex max-w-lg flex-col gap-4">
      <Progress
        size="sm"
        value={20}
        aria-label="Small progress"
      />
      <Progress
        size="md"
        value={56}
        aria-label="Medium progress"
      />
      <Progress
        size="lg"
        value={88}
        aria-label="Large progress"
      />
    </div>
  );
}

function RadioGroupPreview() {
  const [value, setValue] = React.useState("starter");

  return (
    <div className="flex flex-col gap-3">
      <RadioGroup
        aria-label="Plan"
        value={value}
        onValueChange={setValue}
      >
        <RadioGroupItem value="starter">Starter</RadioGroupItem>
        <RadioGroupItem value="pro">Pro</RadioGroupItem>
        <RadioGroupItem
          value="enterprise"
          disabled
        >
          Enterprise
        </RadioGroupItem>
      </RadioGroup>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Selected: {value}
      </span>
    </div>
  );
}

function RadioGroupVerticalExample() {
  return (
    <RadioGroup
      orientation="vertical"
      defaultValue="daily"
      aria-label="Digest frequency"
    >
      <RadioGroupItem value="daily">Daily</RadioGroupItem>
      <RadioGroupItem value="weekly">Weekly</RadioGroupItem>
      <RadioGroupItem value="monthly">Monthly</RadioGroupItem>
    </RadioGroup>
  );
}

function ScrollAreaPreview() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Activity feed</p>
        <ScrollArea
          className="h-56 rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
          role="region"
          aria-label="Activity feed"
        >
          <div className="flex flex-col gap-3 pr-2">
            {activityItems.map((item, index) => (
              <div
                key={item}
                className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-950"
              >
                <p className="font-medium">Entry {index + 1}</p>
                <p className="text-neutral-600 dark:text-neutral-400">{item}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium">Timeline lanes</p>
        <ScrollArea
          className="rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
          orientation="horizontal"
          role="region"
          aria-label="Timeline lanes"
        >
          <div className="flex min-w-max gap-3 pb-2">
            {timelineLanes.map((lane, index) => (
              <div
                key={lane}
                className="flex h-28 w-40 shrink-0 flex-col justify-between rounded-md border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950"
              >
                <p className="font-medium">{lane}</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-400">
                  Step {index + 1}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

function ScrollAreaBothExample() {
  return (
    <ScrollArea
      orientation="both"
      className="h-40 rounded-lg border border-neutral-200 p-4 dark:border-neutral-800"
      aria-label="Bidirectional layout"
    >
      <div className="grid min-w-[36rem] grid-cols-3 gap-4">
        {Array.from({ length: 12 }, (_, index) => {
          const tileNumber = index + 1;

          return (
            <div
              key={`tile-${tileNumber}`}
              className="rounded-md border border-neutral-200 bg-neutral-50 p-4 dark:border-neutral-800 dark:bg-neutral-950"
            >
              Tile {tileNumber}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}

function SelectPreview() {
  const [region, setRegion] = React.useState("us-east");

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Project plan</span>
        <Select
          aria-label="Project plan"
          defaultValue="starter"
          options={[
            { label: "Starter", value: "starter" },
            { label: "Pro", value: "pro" },
            { label: "Enterprise", value: "enterprise" },
          ]}
        />
      </div>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium">Team region</span>
        <Select
          full
          aria-label="Team region"
          value={region}
          onValueChange={setRegion}
          options={[
            { label: "US East", value: "us-east" },
            { label: "Europe", value: "eu-west", disabled: true },
            { label: "Asia Pacific", value: "apac" },
          ]}
        />
        <span className="text-sm text-neutral-500 dark:text-neutral-400">
          Current value: {region}
        </span>
      </div>
    </div>
  );
}

function SelectNamedFieldExample() {
  return (
    <div className="max-w-sm">
      <Select
        name="environment"
        placeholder="Choose environment"
        options={[
          { label: "Production", value: "prod" },
          { label: "Preview", value: "preview" },
          { label: "Local", value: "local" },
        ]}
      />
    </div>
  );
}

function SeparatorPreview() {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <p>Above horizontal separator</p>
        <Separator />
        <p>Below horizontal separator</p>
      </div>
      <div className="flex h-10 items-stretch gap-4">
        <span>Left content</span>
        <Separator orientation="vertical" />
        <span>Right content</span>
      </div>
    </div>
  );
}

function SeparatorDecorativeExample() {
  return (
    <div className="flex flex-col gap-4">
      <p>Section title</p>
      <Separator decorative />
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        Decorative separators remove landmark semantics when the line is purely
        visual.
      </p>
    </div>
  );
}

function SkeletonPreview() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-3">
      <div className="flex items-center gap-3">
        <Skeleton
          shape="circle"
          size="icon"
        />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton
            size="lg"
            className="w-48"
          />
          <Skeleton
            size="sm"
            className="w-32"
          />
        </div>
      </div>
      <Skeleton />
      <Skeleton
        size="sm"
        className="w-2/3"
      />
    </div>
  );
}

function SkeletonShapesExample() {
  return (
    <div className="flex flex-wrap items-center gap-4">
      <Skeleton size="sm" />
      <Skeleton size="md" />
      <Skeleton
        shape="circle"
        size="lg"
      />
      <Skeleton
        shape="text"
        className="w-40"
      />
    </div>
  );
}

function SliderPreview() {
  const [value, setValue] = React.useState(35);

  return (
    <div className="flex max-w-md flex-col gap-4">
      <Label htmlFor="slider-volume">Volume</Label>
      <Slider
        id="slider-volume"
        min={0}
        max={100}
        step={5}
        value={value}
        onChange={(event) => setValue(event.currentTarget.valueAsNumber)}
      />
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Value: {value}
      </span>
    </div>
  );
}

function SliderDisabledExample() {
  return (
    <div className="flex max-w-md flex-col gap-4">
      <Slider
        aria-label="Disabled volume"
        defaultValue={60}
        disabled
      />
      <Slider
        size="sm"
        aria-label="Fine adjustment"
        defaultValue={20}
      />
    </div>
  );
}

function TablePreview() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableCaption>Quarterly revenue by team</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Team</TableHead>
            <TableHead scope="col">Region</TableHead>
            <TableHead
              scope="col"
              className="text-right"
            >
              Revenue
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Platform</TableCell>
            <TableCell>North America</TableCell>
            <TableCell className="text-right">$92K</TableCell>
          </TableRow>
          <TableRow data-state="selected">
            <TableCell>Infrastructure</TableCell>
            <TableCell>Europe</TableCell>
            <TableCell className="text-right">$74K</TableCell>
          </TableRow>
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={2}>Total</TableCell>
            <TableCell className="text-right">$166K</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  );
}

function TableCompactExample() {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Component</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell>Select</TableCell>
            <TableCell>Documented</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Toggle Group</TableCell>
            <TableCell>Documented</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function TextareaPreview() {
  return (
    <TextareaFrame full>
      <Textarea
        aria-label="Feedback"
        invalid="Feedback is required"
        rows={4}
        placeholder="Share what changed in this release."
      />
    </TextareaFrame>
  );
}

function TextareaFormExample() {
  return (
    <FormItem>
      <FormLabel>Release notes</FormLabel>
      <TextareaFrame full>
        <Textarea
          full
          rows={5}
          placeholder="Summarize the user-facing updates."
        />
      </TextareaFrame>
      <FormHelper>Use concise, user-facing language.</FormHelper>
      <FormError />
    </FormItem>
  );
}

function TogglePreview() {
  const [pressed, setPressed] = React.useState(false);

  return (
    <div className="flex items-center gap-3">
      <Toggle
        pressed={pressed}
        onPressedChange={setPressed}
      >
        Pin item
      </Toggle>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        {String(pressed)}
      </span>
    </div>
  );
}

function ToggleSizesExample() {
  return (
    <div className="flex flex-wrap gap-3">
      <Toggle size="sm">Small</Toggle>
      <Toggle size="md">Medium</Toggle>
      <Toggle size="lg">Large</Toggle>
    </div>
  );
}

function ToggleGroupPreview() {
  const [alignment, setAlignment] = React.useState<string | undefined>(
    "center",
  );

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        aria-label="Text alignment"
        value={alignment}
        onValueChange={setAlignment}
      >
        <ToggleGroupItem value="left">Left</ToggleGroupItem>
        <ToggleGroupItem value="center">Center</ToggleGroupItem>
        <ToggleGroupItem value="right">Right</ToggleGroupItem>
        <ToggleGroupItem
          value="justify"
          disabled
        >
          Justify
        </ToggleGroupItem>
      </ToggleGroup>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Selected: {alignment ?? "none"}
      </span>
    </div>
  );
}

function ToggleGroupMultipleExample() {
  const [formats, setFormats] = React.useState<string[]>(["bold"]);

  return (
    <div className="flex flex-col gap-4">
      <ToggleGroup
        type="multiple"
        orientation="vertical"
        aria-label="Text format"
        defaultValue={["bold"]}
        onValueChange={setFormats}
      >
        <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
        <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
        <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
      </ToggleGroup>
      <span className="text-sm text-neutral-500 dark:text-neutral-400">
        Selected: {formats.join(", ") || "none"}
      </span>
    </div>
  );
}

const componentPages = [
  createComponentPage("accordion", {
    anatomy: [
      {
        name: "Accordion",
        description: "Single-open root with controlled or uncontrolled value.",
      },
      {
        name: "AccordionItem",
        description: "Value-scoped item wrapper that can be disabled.",
      },
      {
        name: "AccordionTrigger",
        description: "Button that toggles the item and exposes expanded state.",
      },
      {
        name: "AccordionContent",
        description: "Region content hidden when the item is closed.",
      },
    ],
    description:
      "A compact accordion for disclosure-heavy layouts, FAQ lists, and settings surfaces.",
    examples: [
      {
        code: snippet(`
<Accordion defaultValue="shipping" collapsible>
  <AccordionItem value="shipping">
    <AccordionTrigger>Shipping</AccordionTrigger>
    <AccordionContent>
      Ships within 2 to 3 business days for in-stock items.
    </AccordionContent>
  </AccordionItem>
  <AccordionItem value="returns">
    <AccordionTrigger>Returns</AccordionTrigger>
    <AccordionContent>
      Returns are accepted within 30 days of delivery.
    </AccordionContent>
  </AccordionItem>
</Accordion>
        `),
        description:
          "Uncontrolled accordion with one open item and optional collapse.",
        preview: AccordionPreview,
        title: "FAQ preview",
      },
      {
        code: snippet(`
const [value, setValue] = React.useState<string | null>("overview");

<Accordion value={value} onValueChange={setValue} collapsible>
  <AccordionItem value="overview">
    <AccordionTrigger>Overview</AccordionTrigger>
    <AccordionContent>Controlled content</AccordionContent>
  </AccordionItem>
  <AccordionItem value="details">
    <AccordionTrigger>Details</AccordionTrigger>
    <AccordionContent>Controlled content</AccordionContent>
  </AccordionItem>
</Accordion>
        `),
        description:
          "Controlled state when surrounding UI needs to react to the open item.",
        preview: AccordionControlledExample,
        title: "Controlled value",
      },
    ],
    highlights: [
      "The root only supports a single open item at a time.",
      "`value` and `defaultValue` are `string | null`, and `onValueChange` receives the resolved value.",
      "Set `collapsible` when the currently open item should be allowed to close back to `null`.",
    ],
    importCode: snippet(`
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@components/Accordion";
    `),
    sourceFiles: [
      "packages/react/components/Accordion/Component.tsx",
      "packages/react/components/Accordion/Context.ts",
      "packages/react/components/Accordion/index.ts",
    ],
    title: "Accordion",
    usageCode: snippet(`
<Accordion defaultValue="details" collapsible>
  <AccordionItem value="details">
    <AccordionTrigger>Details</AccordionTrigger>
    <AccordionContent>Accordion content</AccordionContent>
  </AccordionItem>
</Accordion>
    `),
  }),
  createComponentPage("alert", {
    anatomy: [
      {
        name: "Alert",
        description: "Root container with semantic alert defaults.",
      },
      { name: "AlertTitle", description: "Strong leading title line." },
      { name: "AlertDescription", description: "Supporting body copy." },
    ],
    description:
      "Semantic feedback blocks for success, warning, danger, or neutral notices.",
    examples: [
      {
        code: snippet(`
<Alert status="success">
  <AlertTitle>Changes saved</AlertTitle>
  <AlertDescription>
    The latest docs update was stored successfully.
  </AlertDescription>
</Alert>
        `),
        description: "Compact status messaging with title and description.",
        preview: AlertPreview,
        title: "Status alert",
      },
      {
        code: snippet(`
<Alert status="danger">
  <AlertTitle>Build failed</AlertTitle>
  <AlertDescription>
    The preview server could not complete the last deploy.
  </AlertDescription>
</Alert>
        `),
        description: "Alternative statuses reuse the same structure.",
        preview: AlertStatusesExample,
        title: "Warning and danger",
      },
    ],
    highlights: [
      '`Alert` defaults to `role="alert"` and accepts `status` values of `default`, `success`, `warning`, or `danger`.',
      "All exported parts support `asChild` when you need different host elements.",
      "The component is intentionally small: structure is explicit and styling stays on the root and text slots.",
    ],
    importCode: snippet(`
import { Alert, AlertDescription, AlertTitle } from "@components/Alert";
    `),
    sourceFiles: ["packages/react/components/Alert.tsx"],
    title: "Alert",
    usageCode: snippet(`
<Alert>
  <AlertTitle>Heads up</AlertTitle>
  <AlertDescription>Supporting message.</AlertDescription>
</Alert>
    `),
  }),
  createComponentPage("avatar", {
    description:
      "Image avatars with automatic fallback text and accessible labels when the image is missing.",
    examples: [
      {
        code: snippet(`
<Avatar src="/avatar-demo.svg" name="Taylor Lane" />
<Avatar src="/avatar-missing.png" name="Ada Lovelace" />
<Avatar fallback="PS" />
        `),
        description:
          "Image avatars fall back to initials, custom fallback text, or a question mark.",
        preview: AvatarPreview,
        title: "Image and fallback",
      },
      {
        code: snippet(`
<Avatar shape="square" size="lg" name="Project Sync" />
<Avatar size="sm" fallback="QA" />
        `),
        description:
          "Shape and size variants stay on the same single component API.",
        preview: AvatarShapesExample,
        title: "Shape variants",
      },
    ],
    highlights: [
      "The component exposes `src`, `alt`, `name`, `fallback`, and `imageProps` instead of separate subcomponents.",
      "Fallback priority is `fallback` content, then initials derived from `name`, then `?`.",
      "When only the fallback is visible, the component sets an accessible image role and label unless hidden.",
    ],
    importCode: snippet(`
import { Avatar } from "@components/Avatar";
    `),
    sourceFiles: ["packages/react/components/Avatar.tsx"],
    title: "Avatar",
    usageCode: snippet(`
<Avatar src="/avatar-demo.svg" name="Taylor Lane" />
    `),
  }),
  createComponentPage("badge", {
    description:
      "Inline labels for status, category, and small navigation affordances.",
    examples: [
      {
        code: snippet(`
<Badge>Default</Badge>
<Badge status="success">Success</Badge>
<Badge status="warning">Warning</Badge>
<Badge status="danger">Danger</Badge>
        `),
        description: "Status variants keep the footprint small and readable.",
        preview: BadgePreview,
        title: "Status badges",
      },
      {
        code: snippet(`
<Badge asChild>
  <a href="#badge-link">Linked badge</a>
</Badge>
        `),
        description:
          "Use `asChild` when the badge should render as a link or another semantic element.",
        preview: BadgeLinkedExample,
        title: "Linked badge",
      },
    ],
    highlights: [
      "Use `status` for color semantics and `size` for compact or default spacing.",
      "The single `Badge` export supports `asChild` for links or custom wrappers.",
      "Badges remain text-first; there is no built-in icon slot to keep the API narrow.",
    ],
    importCode: snippet(`
import { Badge } from "@components/Badge";
    `),
    sourceFiles: ["packages/react/components/Badge.tsx"],
    title: "Badge",
    usageCode: snippet(`
<Badge status="success">Published</Badge>
    `),
  }),
  createComponentPage("breadcrumb", {
    anatomy: [
      {
        name: "Breadcrumb",
        description: "Navigation landmark with an accessible label.",
      },
      {
        name: "BreadcrumbList / BreadcrumbItem",
        description: "Ordered-list structure for breadcrumb entries.",
      },
      {
        name: "BreadcrumbLink / BreadcrumbPage",
        description: "Interactive and current-page slots.",
      },
      {
        name: "BreadcrumbSeparator",
        description: "Decorative separator with a default slash.",
      },
    ],
    description:
      "Semantic path navigation with lightweight compositional pieces.",
    examples: [
      {
        code: snippet(`
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Profile</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
        `),
        description: "Basic breadcrumb trail with a current page marker.",
        preview: BreadcrumbPreview,
        title: "Standard trail",
      },
      {
        code: snippet(`
<BreadcrumbSeparator>&gt;</BreadcrumbSeparator>
        `),
        description:
          "Separators are intentionally simple and can render custom content.",
        preview: BreadcrumbCustomSeparatorExample,
        title: "Custom separator",
      },
    ],
    highlights: [
      '`Breadcrumb` defaults to `aria-label="Breadcrumb"` so the landmark remains descriptive.',
      '`BreadcrumbPage` defaults to `aria-current="page"` and supports `asChild` when needed.',
      "`BreadcrumbSeparator` renders `/` by default and is decorative by design.",
    ],
    importCode: snippet(`
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@components/Breadcrumb";
    `),
    sourceFiles: ["packages/react/components/Breadcrumb.tsx"],
    title: "Breadcrumb",
    usageCode: snippet(`
<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="/">Home</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Current page</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>
    `),
  }),
  createComponentPage("button", {
    description:
      "General-purpose action element with preset styles and an `asChild` escape hatch.",
    examples: [
      {
        code: snippet(`
<Button>Default</Button>
<Button preset="ghost">Ghost</Button>
<Button preset="success">Success</Button>
        `),
        description: "Default presets cover the common action states.",
        preview: ButtonPreview,
        title: "Preset buttons",
      },
      {
        code: snippet(`
<Button size="icon">
  <span aria-hidden="true">+</span>
</Button>
        `),
        description: "Size and preset values can be mixed for denser actions.",
        preview: ButtonIconExample,
        title: "Icon and emphasis",
      },
    ],
    highlights: [
      "Use `preset` when you want the common combinations of border, background, and decoration values.",
      "`asChild` lets the button style a link or another host element while keeping the same visual treatment.",
      "The public API stays flat, with variants on the single `Button` component rather than separate wrappers.",
    ],
    importCode: snippet(`
import { Button } from "@components/Button";
    `),
    sourceFiles: ["packages/react/components/Button.tsx"],
    title: "Button",
    usageCode: snippet(`
<Button>Save changes</Button>
    `),
  }),
  createComponentPage("card", {
    anatomy: [
      { name: "Card", description: "Outer container for grouped content." },
      {
        name: "CardHeader",
        description: "Header stack for title and description.",
      },
      {
        name: "CardTitle / CardDescription",
        description: "Text primitives for concise summaries.",
      },
      {
        name: "CardContent / CardFooter",
        description: "Body and action areas.",
      },
    ],
    description:
      "Content grouping for dashboards, settings panels, and summary surfaces.",
    examples: [
      {
        code: snippet(`
<Card>
  <CardHeader>
    <CardTitle>Design review</CardTitle>
    <CardDescription>Ready for a focused component pass.</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Review spacing, contrast, and responsive structure.</p>
  </CardContent>
  <CardFooter>
    <Button>Open review</Button>
  </CardFooter>
</Card>
        `),
        description: "Typical header, body, footer composition.",
        preview: CardPreview,
        title: "Action card",
      },
      {
        code: snippet(`
<Card>
  <CardHeader>
    <CardTitle>Published pages</CardTitle>
  </CardHeader>
  <CardContent>
    <p className="text-3xl font-semibold">29</p>
  </CardContent>
</Card>
        `),
        description: "Cards work equally well for dense dashboard metrics.",
        preview: CardDashboardExample,
        title: "Dashboard metrics",
      },
    ],
    highlights: [
      "All parts support `asChild`, so semantic substitutions stay possible without new APIs.",
      "Card layout is intentionally neutral; it is a structure primitive, not a data model.",
      "Use `CardDescription` for supporting text instead of additional loose paragraphs in the header.",
    ],
    importCode: snippet(`
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@components/Card";
    `),
    sourceFiles: ["packages/react/components/Card.tsx"],
    title: "Card",
    usageCode: snippet(`
<Card>
  <CardHeader>
    <CardTitle>Card title</CardTitle>
    <CardDescription>Supporting copy</CardDescription>
  </CardHeader>
</Card>
    `),
  }),
  createComponentPage("checkbox", {
    description:
      "Boolean field control with native checkbox semantics and a small styling surface.",
    examples: [
      {
        code: snippet(`
const [checked, setChecked] = React.useState(true);

<Checkbox
  aria-label="Accept terms"
  checked={checked}
  onChange={(event) => setChecked(event.currentTarget.checked)}
/>
        `),
        description:
          "Controlled checkbox state stays on native checkbox events.",
        preview: CheckboxPreview,
        title: "Controlled checkbox",
      },
      {
        code: snippet(`
<Checkbox aria-label="Unchecked" />
<Checkbox aria-label="Checked" defaultChecked />
<Checkbox aria-label="Disabled" disabled />
        `),
        description: "Default, checked, and disabled states on the same API.",
        preview: CheckboxStatesExample,
        title: "Common states",
      },
    ],
    highlights: [
      "The component is still a native checkbox input under the hood, so form behavior and accessibility remain standard.",
      "Use `onChange` and `checked` the same way you would with a normal checkbox input.",
      "Visual sizing is deliberately minimal to keep the component close to the browser semantics.",
    ],
    importCode: snippet(`
import { Checkbox } from "@components/Checkbox";
    `),
    sourceFiles: ["packages/react/components/Checkbox.tsx"],
    title: "Checkbox",
    usageCode: snippet(`
<Checkbox aria-label="Accept terms" />
    `),
  }),
  createComponentPage("dialog", {
    anatomy: [
      {
        name: "DialogRoot / DialogTrigger",
        description: "Root state container and trigger slot.",
      },
      {
        name: "DialogOverlay / DialogContent",
        description: "Portal-backed overlay and modal content.",
      },
      {
        name: "DialogHeader / DialogTitle / DialogDescription",
        description: "Accessible heading and description structure.",
      },
      {
        name: "DialogFooter / DialogClose",
        description: "Action area and close slot.",
      },
    ],
    description: "Modal composition for critical actions and focused flows.",
    examples: [
      {
        code: snippet(`
<DialogRoot>
  <DialogTrigger>
    <Button>Open dialog</Button>
  </DialogTrigger>
  <DialogOverlay closeOnClick>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirm publish</DialogTitle>
        <DialogDescription>Make the docs update visible.</DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose>
          <Button preset="ghost">Cancel</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </DialogOverlay>
</DialogRoot>
        `),
        description: "Minimal modal composition with the current API names.",
        preview: DialogPreview,
        title: "Confirmation dialog",
      },
    ],
    highlights: [
      "`DialogTrigger` and `DialogClose` are slots, so they expect interactive children rather than rendering their own buttons.",
      "The current API uses `DialogDescription`, not the older `DialogSubtitle` name.",
      "Overlay and content are portal-backed, and `closeOnClick` belongs on `DialogOverlay`.",
    ],
    importCode: snippet(`
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@components/Dialog";
    `),
    sourceFiles: [
      "packages/react/components/Dialog/Component.tsx",
      "packages/react/components/Dialog/Context.ts",
      "packages/react/components/Dialog/index.ts",
    ],
    title: "Dialog",
    usageCode: snippet(`
<DialogRoot>
  <DialogTrigger>
    <Button>Open</Button>
  </DialogTrigger>
  <DialogOverlay>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Dialog title</DialogTitle>
        <DialogDescription>Dialog description</DialogDescription>
      </DialogHeader>
    </DialogContent>
  </DialogOverlay>
</DialogRoot>
    `),
  }),
  createComponentPage("drawer", {
    description:
      "Side or edge-mounted drawer for navigation, actions, and supplemental workflows.",
    examples: [
      {
        code: snippet(`
<DrawerRoot>
  <DrawerTrigger>
    <Button>Open drawer</Button>
  </DrawerTrigger>
  <DrawerOverlay>
    <DrawerContent position="right" maxSize="sm">
      <DrawerHeader>...</DrawerHeader>
      <DrawerBody>...</DrawerBody>
      <DrawerFooter>...</DrawerFooter>
    </DrawerContent>
  </DrawerOverlay>
</DrawerRoot>
        `),
        description:
          "The current drawer API is folder-based and more composition-heavy than the older docs version.",
        preview: DrawerPreview,
        title: "Right-side drawer",
      },
    ],
    highlights: [
      "Use the exported layout pieces instead of manual wrappers so the overlay, focus handling, and drag affordances stay intact.",
      "`DrawerContent` accepts placement and sizing options; examples should focus on the root composition rather than hardcoded layout wrappers.",
      "Keep the drawer subtree together by copying the whole file rather than rewriting just one section.",
    ],
    importCode: snippet(`
import {
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerRoot,
  DrawerTrigger,
} from "@components/Drawer";
    `),
    sourceFiles: ["packages/react/components/Drawer.tsx"],
    title: "Drawer",
    usageCode: snippet(`
<DrawerRoot>
  <DrawerTrigger>
    <Button>Open</Button>
  </DrawerTrigger>
  <DrawerOverlay>
    <DrawerContent position="right">...</DrawerContent>
  </DrawerOverlay>
</DrawerRoot>
    `),
  }),
  createComponentPage("form", {
    anatomy: [
      {
        name: "FormItem",
        description:
          "Wrapper label that wires the nested field to helper and error text.",
      },
      { name: "FormLabel", description: "Visible field label slot." },
      {
        name: "FormHelper",
        description: "Supporting text with optional invalid-state hiding.",
      },
      {
        name: "FormError",
        description:
          "Automatic rendering of the `invalid` message from the parent item.",
      },
    ],
    description:
      "Field composition helpers that keep accessible relationships between label, help text, and error messages.",
    examples: [
      {
        code: snippet(`
<FormItem invalid="Required field">
  <FormLabel>Name</FormLabel>
  <Input type="text" aria-label="Name" />
  <FormHelper hiddenOnInvalid>Helpful instructions</FormHelper>
  <FormError />
</FormItem>
        `),
        description:
          "The parent `FormItem` owns the invalid message and propagates it to the nested field.",
        preview: FormPreview,
        title: "Input field wiring",
      },
      {
        code: snippet(`
<FormItem invalid="Select a plan">
  <FormLabel>Plan</FormLabel>
  <Select aria-label="Plan" options={[...]} />
  <FormHelper hiddenOnInvalid>Helper text</FormHelper>
  <FormError />
</FormItem>
        `),
        description:
          "The same structure works with any nested input, textarea, or select element.",
        preview: FormSelectExample,
        title: "Select field",
      },
    ],
    highlights: [
      "There is no single `Form` component; the exports are field-level helpers.",
      "`FormItem` looks for the first nested input, textarea, or select and manages `aria-labelledby`, `aria-describedby`, and `aria-errormessage`.",
      "`FormError` ignores children and renders the current `invalid` string from the parent item.",
    ],
    importCode: snippet(`
import { FormError, FormHelper, FormItem, FormLabel } from "@components/Form";
    `),
    sourceFiles: ["packages/react/components/Form.tsx"],
    title: "Form",
    usageCode: snippet(`
<FormItem invalid="Required field">
  <FormLabel>Email</FormLabel>
  <Input type="email" aria-label="Email" />
  <FormHelper>We'll only use this for updates.</FormHelper>
  <FormError />
</FormItem>
    `),
  }),
  createComponentPage("input", {
    anatomy: [
      {
        name: "InputFrame",
        description:
          "Optional wrapper label for shared border, ring, and layout treatment.",
      },
      {
        name: "Input",
        description: "The actual input element with invalid-state support.",
      },
    ],
    description:
      "Text input with an optional frame wrapper and custom validity support.",
    examples: [
      {
        code: snippet(`
<InputFrame>
  <Input
    aria-label="Email address"
    type="email"
    invalid="Please enter a valid email"
  />
</InputFrame>
        `),
        description:
          "Use the frame wrapper when you want the bordered shell around the input.",
        preview: InputPreview,
        title: "Input with frame",
      },
      {
        code: snippet(`
<InputFrame full>
  <Input full aria-label="Project name" placeholder="Component audit" />
</InputFrame>
        `),
        description:
          "The frame and input share the `full` and `unstyled` layout variants.",
        preview: InputFullWidthExample,
        title: "Full-width field",
      },
    ],
    highlights: [
      "`Input` accepts `invalid` and calls `setCustomValidity` so native form validation and CSS invalid styles stay aligned.",
      "Use `InputFrame` when you want a shared border and ring treatment around the field.",
      "The API remains intentionally close to native `input` props.",
    ],
    importCode: snippet(`
import { Input, InputFrame } from "@components/Input";
    `),
    sourceFiles: ["packages/react/components/Input.tsx"],
    title: "Input",
    usageCode: snippet(`
<InputFrame>
  <Input aria-label="Email address" type="email" />
</InputFrame>
    `),
  }),
  createComponentPage("label", {
    description: "Flexible label wrapper for inline or stacked field layouts.",
    examples: [
      {
        code: snippet(`
<Label direction="horizontal">
  <input type="checkbox" />
  <span>Include release notes</span>
</Label>
        `),
        description: "Simple composition around a native field and text.",
        preview: LabelPreview,
        title: "Inline label",
      },
    ],
    highlights: [
      "The component is just a styled `label`, so you keep native association behavior.",
      "Use `direction` to switch between inline and stacked layouts.",
      "The label is intentionally light on behavior so it composes well with native controls.",
    ],
    importCode: snippet(`
import { Label } from "@components/Label";
    `),
    sourceFiles: ["packages/react/components/Label.tsx"],
    title: "Label",
    usageCode: snippet(`
<Label direction="horizontal">
  <input type="checkbox" />
  <span>Label text</span>
</Label>
    `),
  }),
  createComponentPage("pagination", {
    anatomy: [
      {
        name: "Pagination / PaginationContent / PaginationItem",
        description: "Semantic navigation structure.",
      },
      {
        name: "PaginationLink",
        description: "Page link with active and disabled states.",
      },
      {
        name: "PaginationPrevious / PaginationNext / PaginationEllipsis",
        description:
          "Common navigation helpers built on top of the same link primitive.",
      },
    ],
    description:
      "Semantically structured pagination controls with active, disabled, and ellipsis states.",
    examples: [
      {
        code: snippet(`
<Pagination aria-label="Results pages">
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#page-0" disabled />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#page-1" active>1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
  </PaginationContent>
</Pagination>
        `),
        description:
          "The current API centers on `PaginationLink` and the semantic list structure.",
        preview: PaginationPreview,
        title: "Results navigation",
      },
      {
        code: snippet(`
<Pagination aria-label="Docs pages">
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#previous" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#forms" active>Forms</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#next" />
    </PaginationItem>
  </PaginationContent>
</Pagination>
        `),
        description:
          "A smaller trail works when the result set is already narrow.",
        preview: PaginationCompactExample,
        title: "Compact pagination",
      },
    ],
    highlights: [
      '`PaginationLink` owns the active and disabled semantics. Active links set `aria-current="page"`.',
      "Disabled links remove navigation behavior and are removed from tab order.",
      "`Previous` and `Next` are convenience wrappers around the same link primitive.",
    ],
    importCode: snippet(`
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/Pagination";
    `),
    sourceFiles: ["packages/react/components/Pagination.tsx"],
    title: "Pagination",
    usageCode: snippet(`
<Pagination aria-label="Results pages">
  <PaginationContent>
    <PaginationItem>
      <PaginationLink href="#1" active>1</PaginationLink>
    </PaginationItem>
  </PaginationContent>
</Pagination>
    `),
  }),
  createComponentPage("popover", {
    description:
      "Lightweight floating content anchored to a trigger without extra routing or portal dependencies.",
    examples: [
      {
        code: snippet(`
<Popover>
  <PopoverTrigger>
    <Button preset="ghost">Project settings</Button>
  </PopoverTrigger>
  <PopoverContent>Popover content</PopoverContent>
</Popover>
        `),
        description: "Basic trigger and content composition.",
        preview: PopoverPreview,
        title: "Simple popover",
      },
    ],
    highlights: [
      "The current component manages its own open state unless you pass the `opened` prop.",
      "Trigger and content are plain composition pieces, which keeps examples compact.",
      "The floating panel is positioned inline rather than through a third-party portal dependency.",
    ],
    importCode: snippet(`
import { Popover, PopoverContent, PopoverTrigger } from "@components/Popover";
    `),
    sourceFiles: ["packages/react/components/Popover.tsx"],
    title: "Popover",
    usageCode: snippet(`
<Popover>
  <PopoverTrigger>
    <Button>Open</Button>
  </PopoverTrigger>
  <PopoverContent>Popover content</PopoverContent>
</Popover>
    `),
  }),
  createComponentPage("progress", {
    description:
      "Progress indicator for determinate and indeterminate loading states.",
    examples: [
      {
        code: snippet(`
const [value, setValue] = React.useState(40);

<Progress aria-label="Upload progress" value={value} />
<Progress aria-label="Indeterminate progress" />
        `),
        description:
          "A numeric value renders the determinate state; `undefined` or `null` renders indeterminate progress.",
        preview: ProgressPreview,
        title: "Determinate and indeterminate",
      },
      {
        code: snippet(`
<Progress size="sm" value={20} />
<Progress size="md" value={56} />
<Progress size="lg" value={88} />
        `),
        description:
          "Use size variants to scale the track without changing the underlying API.",
        preview: ProgressSizesExample,
        title: "Sizes",
      },
    ],
    highlights: [
      "The component normalizes invalid `max` values back to `100`.",
      "Values are clamped into the `[0, max]` range automatically.",
      "Use `null` or `undefined` for indeterminate loading states instead of inventing sentinel values.",
    ],
    importCode: snippet(`
import { Progress } from "@components/Progress";
    `),
    sourceFiles: ["packages/react/components/Progress.tsx"],
    title: "Progress",
    usageCode: snippet(`
<Progress aria-label="Upload progress" value={64} max={100} />
    `),
  }),
  createComponentPage("radio-group", {
    anatomy: [
      {
        name: "RadioGroup",
        description:
          "Group wrapper that manages controlled or uncontrolled selection.",
      },
      {
        name: "RadioGroupItem",
        description: "Native radio input plus visible label content.",
      },
    ],
    description:
      "Radio selection group with native semantics, generated names, and optional orientation control.",
    examples: [
      {
        code: snippet(`
const [value, setValue] = React.useState("starter");

<RadioGroup aria-label="Plan" value={value} onValueChange={setValue}>
  <RadioGroupItem value="starter">Starter</RadioGroupItem>
  <RadioGroupItem value="pro">Pro</RadioGroupItem>
</RadioGroup>
        `),
        description:
          "Controlled radio group with the label content provided as children.",
        preview: RadioGroupPreview,
        title: "Controlled selection",
      },
      {
        code: snippet(`
<RadioGroup orientation="vertical" defaultValue="daily" aria-label="Digest frequency">
  <RadioGroupItem value="daily">Daily</RadioGroupItem>
  <RadioGroupItem value="weekly">Weekly</RadioGroupItem>
</RadioGroup>
        `),
        description:
          "Orientation changes layout while the inputs remain native radio controls.",
        preview: RadioGroupVerticalExample,
        title: "Vertical layout",
      },
    ],
    highlights: [
      "`RadioGroupItem` uses its children as the visible label. There is no separate indicator slot.",
      "If you do not provide `name`, the group generates one so the radios still behave as a set.",
      "Disabled state can be set on the group or on individual items.",
    ],
    importCode: snippet(`
import { RadioGroup, RadioGroupItem } from "@components/RadioGroup";
    `),
    sourceFiles: ["packages/react/components/RadioGroup.tsx"],
    title: "RadioGroup",
    usageCode: snippet(`
<RadioGroup aria-label="Plan" defaultValue="starter">
  <RadioGroupItem value="starter">Starter</RadioGroupItem>
  <RadioGroupItem value="pro">Pro</RadioGroupItem>
</RadioGroup>
    `),
  }),
  createComponentPage("scroll-area", {
    description:
      "Keyboard-focusable scroll container for vertical, horizontal, or two-axis overflow.",
    examples: [
      {
        code: snippet(`
<ScrollArea
  className="h-56 rounded-lg border p-3"
  role="region"
  aria-label="Activity feed"
>
  <div>Scrollable content</div>
</ScrollArea>
        `),
        description:
          "Treat the component as one styled scrollable `div` rather than a composed viewport system.",
        preview: ScrollAreaPreview,
        title: "Vertical and horizontal overflow",
      },
      {
        code: snippet(`
<ScrollArea orientation="both" className="h-40 rounded-lg border p-4">
  <div className="grid min-w-[36rem] grid-cols-3 gap-4">...</div>
</ScrollArea>
        `),
        description: "Use `both` when content can overflow in both directions.",
        preview: ScrollAreaBothExample,
        title: "Bidirectional layout",
      },
    ],
    highlights: [
      "There are no viewport, scrollbar, or thumb subcomponents in the current API.",
      "The root defaults to `tabIndex={0}` so keyboard users can focus and scroll the region.",
      "Use the `orientation` prop to express expected overflow behavior.",
    ],
    importCode: snippet(`
import { ScrollArea } from "@components/ScrollArea";
    `),
    sourceFiles: ["packages/react/components/ScrollArea.tsx"],
    title: "ScrollArea",
    usageCode: snippet(`
<ScrollArea className="h-56 rounded-lg border p-3" orientation="vertical">
  <div>Scrollable content</div>
</ScrollArea>
    `),
  }),
  createComponentPage("select", {
    description:
      "Button-plus-listbox select with inline positioning, disabled option support, and current-value control.",
    examples: [
      {
        code: snippet(`
const [region, setRegion] = React.useState("us-east");

<Select
  full
  aria-label="Team region"
  value={region}
  onValueChange={setRegion}
  options={[
    { label: "US East", value: "us-east" },
    { label: "Europe", value: "eu-west", disabled: true },
    { label: "Asia Pacific", value: "apac" },
  ]}
/>
        `),
        description:
          "Controlled and uncontrolled examples share the same single-component API.",
        preview: SelectPreview,
        title: "Current select API",
      },
      {
        code: snippet(`
<Select
  name="environment"
  placeholder="Choose environment"
  options={[
    { label: "Production", value: "prod" },
    { label: "Preview", value: "preview" },
    { label: "Local", value: "local" },
  ]}
/>
        `),
        description:
          "Providing `name` adds a hidden input for form submission.",
        preview: SelectNamedFieldExample,
        title: "Named field",
      },
    ],
    highlights: [
      "The current Select does not expose trigger, content, or item subcomponents; everything lives on the `Select` component.",
      "Options are shaped as `{ label, value, disabled? }` objects.",
      "Disabled options stay visible and are skipped during keyboard navigation.",
    ],
    importCode: snippet(`
import { Select } from "@components/Select";
    `),
    sourceFiles: ["packages/react/components/Select.tsx"],
    title: "Select",
    usageCode: snippet(`
<Select
  aria-label="Project plan"
  options={[
    { label: "Starter", value: "starter" },
    { label: "Pro", value: "pro" },
  ]}
/>
    `),
  }),
  createComponentPage("separator", {
    description:
      "Simple visual or semantic rule for dividing adjacent content.",
    examples: [
      {
        code: snippet(`
<Separator />
<Separator orientation="vertical" />
        `),
        description: "Horizontal and vertical rules use the same component.",
        preview: SeparatorPreview,
        title: "Layout separators",
      },
      {
        code: snippet(`
<Separator decorative />
        `),
        description: "Decorative separators drop their landmark semantics.",
        preview: SeparatorDecorativeExample,
        title: "Decorative rule",
      },
    ],
    highlights: [
      "`orientation` accepts `horizontal` or `vertical` and defaults to horizontal.",
      "Set `decorative` when the rule is purely visual and should not be announced.",
      "The component is intentionally small and stays close to native divider semantics.",
    ],
    importCode: snippet(`
import { Separator } from "@components/Separator";
    `),
    sourceFiles: ["packages/react/components/Separator.tsx"],
    title: "Separator",
    usageCode: snippet(`
<Separator orientation="horizontal" />
    `),
  }),
  createComponentPage("skeleton", {
    description: "Loading placeholder blocks for pending content.",
    examples: [
      {
        code: snippet(`
<Skeleton shape="circle" size="icon" />
<Skeleton size="lg" className="w-48" />
<Skeleton className="w-full" />
        `),
        description:
          "Use the component to sketch the final layout rather than adding generic gray bars.",
        preview: SkeletonPreview,
        title: "Profile loading card",
      },
      {
        code: snippet(`
<Skeleton size="sm" />
<Skeleton shape="circle" size="lg" />
<Skeleton shape="text" className="w-40" />
        `),
        description:
          "Shape and size variants cover the most common loading affordances.",
        preview: SkeletonShapesExample,
        title: "Shape variants",
      },
    ],
    highlights: [
      "`Skeleton` defaults `aria-hidden` to `true` because it is a visual placeholder rather than content.",
      "Use `shape` for rectangle, circle, or text-style placeholders.",
      "Custom width classes pair well with the built-in sizing options.",
    ],
    importCode: snippet(`
import { Skeleton } from "@components/Skeleton";
    `),
    sourceFiles: ["packages/react/components/Skeleton.tsx"],
    title: "Skeleton",
    usageCode: snippet(`
<Skeleton shape="circle" size="icon" />
    `),
  }),
  createComponentPage("slider", {
    description: "Styled range input with native slider semantics.",
    examples: [
      {
        code: snippet(`
const [value, setValue] = React.useState(35);

<Slider
  min={0}
  max={100}
  step={5}
  value={value}
  onChange={(event) => setValue(event.currentTarget.valueAsNumber)}
/>
        `),
        description:
          "The current slider API stays intentionally close to a native range input.",
        preview: SliderPreview,
        title: "Controlled slider",
      },
      {
        code: snippet(`
<Slider aria-label="Disabled volume" defaultValue={60} disabled />
<Slider size="sm" aria-label="Fine adjustment" defaultValue={20} />
        `),
        description: "Size and disabled states stay on the same single export.",
        preview: SliderDisabledExample,
        title: "Size and disabled states",
      },
    ],
    highlights: [
      'The component is an `input type="range"`, so use native props like `min`, `max`, `step`, `value`, and `onChange`.',
      "There is no custom thumb subcomponent to manage.",
      "If you need form integration, treat it exactly like a regular range input.",
    ],
    importCode: snippet(`
import { Slider } from "@components/Slider";
    `),
    sourceFiles: ["packages/react/components/Slider.tsx"],
    title: "Slider",
    usageCode: snippet(`
<Slider min={0} max={100} defaultValue={50} />
    `),
  }),
  createComponentPage("switch", {
    description:
      "Binary state control that mirrors checkbox-style semantics with a different visual treatment.",
    examples: [
      {
        code: snippet(`
const [enabled, setEnabled] = React.useState(false);

<Switch
  aria-label="Enable release notifications"
  checked={enabled}
  onChange={(event) => setEnabled(event.currentTarget.checked)}
/>
        `),
        description: "Controlled switch state uses native change events.",
        preview: SwitchPreview,
        title: "Controlled switch",
      },
    ],
    highlights: [
      "Use it the same way you would use a native checkbox input: `checked`, `defaultChecked`, and `onChange`.",
      "Choose Switch when the binary action reads like an on/off setting rather than a selection list.",
      "The visual track and thumb are internal; the public API remains small.",
    ],
    importCode: snippet(`
import { Switch } from "@components/Switch";
    `),
    sourceFiles: ["packages/react/components/Switch.tsx"],
    title: "Switch",
    usageCode: snippet(`
<Switch aria-label="Enable notifications" />
    `),
  }),
  createComponentPage("table", {
    anatomy: [
      {
        name: "Table / TableHeader / TableBody / TableFooter",
        description: "Thin wrappers around native table sections.",
      },
      {
        name: "TableRow / TableHead / TableCell",
        description: "Semantic row and cell primitives.",
      },
      {
        name: "TableCaption",
        description: "Caption element for context and accessibility.",
      },
    ],
    description:
      "Thin semantic wrappers for table markup with consistent styling hooks.",
    examples: [
      {
        code: snippet(`
<Table>
  <TableCaption>Quarterly revenue by team</TableCaption>
  <TableHeader>...</TableHeader>
  <TableBody>...</TableBody>
  <TableFooter>...</TableFooter>
</Table>
        `),
        description:
          "Use the full semantic table structure when the data needs header and footer context.",
        preview: TablePreview,
        title: "Revenue table",
      },
      {
        code: snippet(`
<Table>
  <TableHeader>...</TableHeader>
  <TableBody>...</TableBody>
</Table>
        `),
        description:
          "A lighter structure works for compact summaries or status lists.",
        preview: TableCompactExample,
        title: "Compact table",
      },
    ],
    highlights: [
      "These wrappers intentionally track the native table element names, so HTML table knowledge transfers directly.",
      '`TableRow` styling responds to `data-state="selected"` when you want a highlighted row.',
      "Prefer real table semantics over CSS-only grids whenever the content is actually tabular.",
    ],
    importCode: snippet(`
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/Table";
    `),
    sourceFiles: ["packages/react/components/Table.tsx"],
    title: "Table",
    usageCode: snippet(`
<Table>
  <TableHeader>
    <TableRow>
      <TableHead>Column</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Value</TableCell>
    </TableRow>
  </TableBody>
</Table>
    `),
  }),
  createComponentPage("tabs", {
    description: "Simple tab provider with list, trigger, and content pieces.",
    examples: [
      {
        code: snippet(`
<TabProvider defaultName="account">
  <TabList>
    <TabTrigger name="account">Account</TabTrigger>
    <TabTrigger name="security">Security</TabTrigger>
  </TabList>
  <TabContent name="account">Account content</TabContent>
  <TabContent name="security">Security content</TabContent>
</TabProvider>
        `),
        description:
          "The docs app itself uses the current Tabs components for preview/code switching.",
        preview: TabsPreview,
        title: "Simple tabs",
      },
    ],
    highlights: [
      "The root is `TabProvider`, not a single monolithic `Tabs` component.",
      "`TabTrigger` and `TabContent` are matched by the shared `name` prop.",
      "Keep names stable and unique within a provider.",
    ],
    importCode: snippet(`
import { TabContent, TabList, TabProvider, TabTrigger } from "@components/Tabs";
    `),
    sourceFiles: [
      "packages/react/components/Tabs/Component.tsx",
      "packages/react/components/Tabs/Context.ts",
      "packages/react/components/Tabs/Hook.ts",
      "packages/react/components/Tabs/index.ts",
    ],
    title: "Tabs",
    usageCode: snippet(`
<TabProvider defaultName="first">
  <TabList>
    <TabTrigger name="first">First</TabTrigger>
    <TabTrigger name="second">Second</TabTrigger>
  </TabList>
  <TabContent name="first">First panel</TabContent>
  <TabContent name="second">Second panel</TabContent>
</TabProvider>
    `),
  }),
  createComponentPage("textarea", {
    anatomy: [
      {
        name: "TextareaFrame",
        description:
          "Optional wrapper label with shared border and ring styles.",
      },
      {
        name: "Textarea",
        description: "The actual textarea element with invalid-state support.",
      },
    ],
    description:
      "Multi-line text input with the same frame pattern used by Input.",
    examples: [
      {
        code: snippet(`
<TextareaFrame full>
  <Textarea
    aria-label="Feedback"
    invalid="Feedback is required"
    rows={4}
  />
</TextareaFrame>
        `),
        description:
          "The textarea shares the current frame and validation pattern with Input.",
        preview: TextareaPreview,
        title: "Validated textarea",
      },
      {
        code: snippet(`
<FormItem>
  <FormLabel>Release notes</FormLabel>
  <TextareaFrame full>
    <Textarea full rows={5} placeholder="Summarize the updates." />
  </TextareaFrame>
  <FormHelper>Use concise, user-facing language.</FormHelper>
</FormItem>
        `),
        description: "Textarea composes naturally with the Form helpers.",
        preview: TextareaFormExample,
        title: "Textarea inside FormItem",
      },
    ],
    highlights: [
      "Both `TextareaFrame` and `Textarea` share `full` and `unstyled` variants.",
      "`Textarea` accepts `invalid` and sets custom validity so native and visual invalid states stay aligned.",
      "Use `TextareaFrame` only when you want the bordered container treatment.",
    ],
    importCode: snippet(`
import { Textarea, TextareaFrame } from "@components/Textarea";
    `),
    sourceFiles: ["packages/react/components/Textarea.tsx"],
    title: "Textarea",
    usageCode: snippet(`
<TextareaFrame full>
  <Textarea full rows={4} aria-label="Feedback" />
</TextareaFrame>
    `),
  }),
  createComponentPage("toast", {
    description:
      "Global, portal-backed toast notifications triggered through the exported hook.",
    examples: [
      {
        code: snippet(`
const { toast } = useToast();

<Button
  onClick={() =>
    toast({
      title: "Docs published",
      description: "The latest docs build is now available.",
      status: "success",
      closeTimeout: null,
    })
  }
>
  Show success toast
</Button>
        `),
        description:
          "A single `Toaster` at app level can render any toast triggered through the hook.",
        preview: ToastPreview,
        title: "Success and warning toasts",
      },
    ],
    highlights: [
      "Render one `Toaster` instance for the app, then trigger notifications with `useToast()`.",
      "Toast options include `title`, `description`, `status`, and `closeTimeout`.",
      "Error toasts use stronger live-region semantics automatically.",
    ],
    importCode: snippet(`
import { Toaster, useToast } from "@components/Toast";
    `),
    sourceFiles: [
      "packages/react/components/Toast/Component.tsx",
      "packages/react/components/Toast/Hook.ts",
      "packages/react/components/Toast/Store.ts",
      "packages/react/components/Toast/Variant.ts",
      "packages/react/components/Toast/index.ts",
    ],
    title: "Toast",
    usageCode: snippet(`
const { toast } = useToast();

toast({
  title: "Saved",
  description: "Changes were stored successfully.",
  status: "success",
});
    `),
  }),
  createComponentPage("toggle", {
    description: "Pressed-state button for lightweight on/off actions.",
    examples: [
      {
        code: snippet(`
const [pressed, setPressed] = React.useState(false);

<Toggle pressed={pressed} onPressedChange={setPressed}>
  Pin item
</Toggle>
        `),
        description:
          "Toggle keeps the state model explicit with `pressed` and `onPressedChange`.",
        preview: TogglePreview,
        title: "Controlled pressed state",
      },
      {
        code: snippet(`
<Toggle size="sm">Small</Toggle>
<Toggle size="md">Medium</Toggle>
<Toggle size="lg">Large</Toggle>
        `),
        description: "Size variants scale the same button-based API.",
        preview: ToggleSizesExample,
        title: "Sizes",
      },
    ],
    highlights: [
      "State is expressed through `pressed`, `defaultPressed`, and `onPressedChange` rather than checkbox events.",
      'The component always behaves like a button and sets `type="button"` automatically.',
      "Visual state is tied to `aria-pressed`, keeping the semantics inspectable.",
    ],
    importCode: snippet(`
import { Toggle } from "@components/Toggle";
    `),
    sourceFiles: ["packages/react/components/Toggle.tsx"],
    title: "Toggle",
    usageCode: snippet(`
<Toggle defaultPressed>Pin item</Toggle>
    `),
  }),
  createComponentPage("toggle-group", {
    anatomy: [
      {
        name: "ToggleGroup",
        description: "Group wrapper for single or multiple pressed values.",
      },
      {
        name: "ToggleGroupItem",
        description:
          "Value-scoped toggle item that inherits group size and disabled state.",
      },
    ],
    description:
      "Grouped toggle actions for single-select toolbars or multi-select formatting controls.",
    examples: [
      {
        code: snippet(`
const [alignment, setAlignment] = React.useState<string | undefined>("center");

<ToggleGroup
  aria-label="Text alignment"
  value={alignment}
  onValueChange={setAlignment}
>
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
</ToggleGroup>
        `),
        description:
          "Single-select is the default and can be deselected back to `undefined`.",
        preview: ToggleGroupPreview,
        title: "Single-select toolbar",
      },
      {
        code: snippet(`
const [formats, setFormats] = React.useState<string[]>(["bold"]);

<ToggleGroup
  type="multiple"
  orientation="vertical"
  defaultValue={["bold"]}
  onValueChange={setFormats}
>
  <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
  <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
</ToggleGroup>
        `),
        description:
          "Multi-select groups switch to array values and can be laid out vertically.",
        preview: ToggleGroupMultipleExample,
        title: "Multiple selection",
      },
    ],
    highlights: [
      'The default `type` is `single`; pass `type="multiple"` to switch the value model to string arrays.',
      "Single-select groups can clear back to `undefined` when the active item is pressed again.",
      "Group `size` and `disabled` values flow down to each `ToggleGroupItem` unless overridden.",
    ],
    importCode: snippet(`
import { ToggleGroup, ToggleGroupItem } from "@components/ToggleGroup";
    `),
    sourceFiles: ["packages/react/components/ToggleGroup.tsx"],
    title: "ToggleGroup",
    usageCode: snippet(`
<ToggleGroup aria-label="Text alignment">
  <ToggleGroupItem value="left">Left</ToggleGroupItem>
  <ToggleGroupItem value="center">Center</ToggleGroupItem>
  <ToggleGroupItem value="right">Right</ToggleGroupItem>
</ToggleGroup>
    `),
  }),
  createComponentPage("tooltip", {
    description:
      "Hover-triggered contextual text with configurable delay and position.",
    examples: [
      {
        code: snippet(`
<Tooltip>
  <Button preset="ghost">Hover for details</Button>
  <TooltipContent delay="none">Tooltip content</TooltipContent>
</Tooltip>
        `),
        description:
          "Trigger and content stay compact, with delay and status handled on the content component.",
        preview: TooltipPreview,
        title: "Simple tooltip",
      },
    ],
    highlights: [
      "`TooltipContent` owns delay, offset, and status styling options.",
      "Use the root `Tooltip` as the interaction boundary and place both trigger and content inside it.",
      "The current API focuses on simple composition rather than multiple helper subcomponents.",
    ],
    importCode: snippet(`
import { Tooltip, TooltipContent } from "@components/Tooltip";
    `),
    sourceFiles: ["packages/react/components/Tooltip.tsx"],
    title: "Tooltip",
    usageCode: snippet(`
<Tooltip>
  <Button>Hover me</Button>
  <TooltipContent delay="none">Tooltip content</TooltipContent>
</Tooltip>
    `),
  }),
].sort((left, right) => left.title.localeCompare(right.title));

const documentPages = [
  docsOverviewPage,
  introductionPage,
  installationPage,
  configurationPage,
];

const pagesByPath = Object.fromEntries(
  [homePage, ...documentPages, ...componentPages].map((page) => [
    page.path,
    page,
  ]),
) as Record<string, DocPage>;

const topNavItems = [
  { href: "/docs", label: "Docs" },
  { href: "/docs/components/accordion", label: "Components" },
  { href: "https://github.com/pswui/ui", label: "GitHub" },
];

export {
  componentPages,
  documentPages,
  homePage,
  notFoundPage,
  pagesByPath,
  topNavItems,
};
