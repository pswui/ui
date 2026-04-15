import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/Accordion";
import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
import { Avatar } from "../../components/Avatar";
import { Badge } from "../../components/Badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../../components/Breadcrumb";
import { Button } from "../../components/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/Card";
import { Checkbox } from "../../components/Checkbox";
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
} from "../../components/Dialog";
import {
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerRoot,
  DrawerTrigger,
} from "../../components/Drawer";
import { FileInput } from "../../components/FileInput";
import {
  FormError,
  FormHelper,
  FormItem,
  FormLabel,
} from "../../components/Form";
import { Input, InputFrame } from "../../components/Input";
import { Label } from "../../components/Label";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../../components/Pagination";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { Progress } from "../../components/Progress";
import { RadioGroup, RadioGroupItem } from "../../components/RadioGroup";
import { ScrollArea } from "../../components/ScrollArea";
import { Select } from "../../components/Select";
import { Separator } from "../../components/Separator";
import { Skeleton } from "../../components/Skeleton";
import { Slider } from "../../components/Slider";
import { Switch } from "../../components/Switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/Table";
import {
  TabContent,
  TabList,
  TabProvider,
  TabTrigger,
} from "../../components/Tabs";
import { Textarea, TextareaFrame } from "../../components/Textarea";
import { Toaster, useToast } from "../../components/Toast";
import { Toggle } from "../../components/Toggle";
import { ToggleGroup, ToggleGroupItem } from "../../components/ToggleGroup";
import { Tooltip, TooltipContent } from "../../components/Tooltip";

const avatarImageSrc = "/avatar-demo.svg";
const scrollAreaActivityItems = [
  "Roadmap issue triaged",
  "Design tokens reviewed",
  "Keyboard navigation verified",
  "Playwright harness updated",
  "Component API narrowed",
  "Registry entry prepared",
  "Accessibility pass completed",
  "Release notes drafted",
  "Tailwind classes aligned",
  "Focus ring checked",
  "Regression tests added",
  "Build queued for review",
];
const scrollAreaTimelineLanes = [
  "Backlog",
  "Planning",
  "Design",
  "Implementation",
  "Review",
  "QA",
  "Release",
];
const scrollAreaBoardColumns = ["Intake", "Spec", "Build", "Verify", "Ship"];

const Section = ({
  testId,
  title,
  description,
  children,
}: {
  testId: string;
  title: string;
  description: string;
  children: React.ReactNode;
}) => {
  return (
    <section
      data-testid={`${testId}-section`}
      className="flex flex-col gap-4 rounded-xl border border-neutral-200 p-6 dark:border-neutral-800"
    >
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm opacity-70">{description}</p>
      </div>
      {children}
    </section>
  );
};

const AvatarShowcase = () => {
  return (
    <Section
      testId="avatar"
      title="Avatar"
      description="Image avatars fall back to initials when an image is missing."
    >
      <div className="flex flex-wrap items-center gap-4">
        <Avatar
          data-testid="avatar-image"
          src={avatarImageSrc}
          name="Taylor Lane"
        />
        <Avatar
          data-testid="avatar-fallback"
          src="/avatar-missing.png"
          name="Ada Lovelace"
        />
      </div>
    </Section>
  );
};

const AlertShowcase = () => {
  return (
    <Section
      testId="alert"
      title="Alert"
      description="Semantic alerts with compact status variants."
    >
      <div className="flex flex-col gap-3">
        <Alert data-testid="alert-default">
          <AlertTitle>Heads up</AlertTitle>
          <AlertDescription>
            This default alert keeps the content compact and readable.
          </AlertDescription>
        </Alert>
        <Alert
          status="success"
          data-testid="alert-success"
        >
          <AlertTitle>Changes saved</AlertTitle>
          <AlertDescription>
            Your profile settings were stored successfully.
          </AlertDescription>
        </Alert>
        <Alert
          status="danger"
          className="alert-custom-frame"
          data-testid="alert-custom"
        >
          <AlertTitle>Action required</AlertTitle>
          <AlertDescription>
            Custom class names should be preserved with danger styling.
          </AlertDescription>
        </Alert>
      </div>
    </Section>
  );
};

const AccordionShowcase = () => {
  return (
    <Section
      testId="accordion"
      title="Accordion"
      description="Single-open accordion with collapsible sections."
    >
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
    </Section>
  );
};

const ButtonShowcase = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Section
      testId="button"
      title="Button"
      description="Basic click, disabled, and asChild link behavior."
    >
      <div className="flex items-center gap-3">
        <Button onClick={() => setCount((prev) => prev + 1)}>Increment</Button>
        <Button disabled>Disabled action</Button>
        <Button asChild>
          <a href="#button-as-child-link">Button asChild link</a>
        </Button>
        <span data-testid="button-count">{count}</span>
      </div>
    </Section>
  );
};

const BadgeShowcase = () => {
  return (
    <Section
      testId="badge"
      title="Badge"
      description="Inline status labels and linked badge semantics."
    >
      <div className="flex flex-wrap items-center gap-3">
        <Badge>Default</Badge>
        <Badge status="success">Success</Badge>
        <Badge
          status="warning"
          size="sm"
        >
          Warning
        </Badge>
        <Badge status="danger">Danger</Badge>
        <Badge asChild>
          <a
            href="#badge-link"
            data-testid="badge-link"
          >
            Linked badge
          </a>
        </Badge>
      </div>
    </Section>
  );
};

const BreadcrumbShowcase = () => {
  return (
    <Section
      testId="breadcrumb"
      title="Breadcrumb"
      description="Semantic navigation with decorative separators."
    >
      <Breadcrumb data-testid="breadcrumb-nav">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/">Home</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="breadcrumb-separator" />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <a href="#settings">Settings</a>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator data-testid="breadcrumb-separator" />
          <BreadcrumbItem>
            <BreadcrumbPage asChild>
              <span data-testid="breadcrumb-current-page">Profile</span>
            </BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Section>
  );
};

const CardShowcase = () => {
  return (
    <Section
      testId="card"
      title="Card"
      description="Static content grouped with header, body, and footer."
    >
      <div className="flex flex-col gap-4">
        <Card data-testid="card-root">
          <CardHeader data-testid="card-header">
            <CardTitle>Design review</CardTitle>
            <CardDescription>
              Ready for a focused component pass.
            </CardDescription>
          </CardHeader>
          <CardContent data-testid="card-content">
            <p>Review spacing, contrast, and responsive structure.</p>
          </CardContent>
          <CardFooter data-testid="card-footer">
            <Button>Open review</Button>
          </CardFooter>
        </Card>

        <Card
          asChild
          data-testid="card-as-child-root"
        >
          <section>
            <CardHeader>
              <CardTitle asChild>
                <h4 id="card-as-child-title">Linked review</h4>
              </CardTitle>
              <CardDescription asChild>
                <div id="card-as-child-description">
                  Custom elements still label the card.
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Slot-based composition keeps the same accessible wiring.</p>
            </CardContent>
          </section>
        </Card>
      </div>
    </Section>
  );
};

const CheckboxShowcase = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Section
      testId="checkbox"
      title="Checkbox"
      description="Controlled checkbox state."
    >
      <div className="flex items-center gap-3">
        <div data-testid="checkbox-control">
          <Checkbox
            aria-label="Accept terms"
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
        </div>
        <span data-testid="checkbox-state">{String(checked)}</span>
      </div>
    </Section>
  );
};

const DialogShowcase = () => {
  return (
    <Section
      testId="dialog"
      title="Dialog"
      description="Open and close a modal dialog."
    >
      <DialogRoot>
        <DialogTrigger>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogOverlay closeOnClick>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Dialog title</DialogTitle>
              <DialogDescription>Dialog description</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose>
                <Button>Close dialog</Button>
              </DialogClose>
            </DialogFooter>
          </DialogContent>
        </DialogOverlay>
      </DialogRoot>
    </Section>
  );
};

const DrawerShowcase = () => {
  return (
    <Section
      testId="drawer"
      title="Drawer"
      description="Open and close a side drawer."
    >
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
                Drawer title
              </h3>
            </DrawerHeader>
            <DrawerBody>
              <p id="drawer-description">Drawer body content</p>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose>
                <Button>Close drawer</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </DrawerRoot>
    </Section>
  );
};

const drawerScrollItems = Array.from({ length: 24 }, (_, index) => index + 1);

const DrawerScrollShowcase = () => {
  return (
    <Section
      testId="drawer-scroll"
      title="Drawer Mobile Scroll"
      description="Scrollable content should not trigger a close swipe until it reaches the edge."
    >
      <DrawerRoot closeThreshold={0.1}>
        <DrawerTrigger>
          <Button>Open scrollable drawer</Button>
        </DrawerTrigger>
        <DrawerOverlay>
          <DrawerContent
            position="bottom"
            className="max-h-96"
            aria-labelledby="drawer-scroll-title"
            aria-describedby="drawer-scroll-description"
          >
            <DrawerHeader>
              <h3
                id="drawer-scroll-title"
                className="text-lg font-semibold"
              >
                Scrollable drawer title
              </h3>
            </DrawerHeader>
            <DrawerBody>
              <p id="drawer-scroll-description">
                Use touch scrolling in the nested region before swiping down to
                close.
              </p>
              <div
                data-testid="drawer-scroll-region"
                className="mt-4 max-h-48 overflow-y-auto rounded-lg border border-neutral-200 p-3 dark:border-neutral-800"
              >
                <div className="flex flex-col gap-3">
                  {drawerScrollItems.map((item) => (
                    <p
                      key={item}
                      className="text-sm"
                    >
                      Scroll item {item}
                    </p>
                  ))}
                </div>
              </div>
            </DrawerBody>
            <DrawerFooter>
              <DrawerClose>
                <Button>Close scrollable drawer</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </DrawerRoot>
    </Section>
  );
};

const FormShowcase = () => {
  return (
    <Section
      testId="form"
      title="Form"
      description="Helper and error text remain associated with their field."
    >
      <div className="flex w-full flex-col gap-6">
        <FormItem invalid="Required field">
          <FormLabel>Name</FormLabel>
          <Input
            aria-label="Form name"
            data-testid="form-invalid-input"
            type="text"
          />
          <FormHelper hiddenOnInvalid>Helpful instructions</FormHelper>
          <FormError data-testid="form-error" />
        </FormItem>

        <FormItem>
          <FormLabel>Email</FormLabel>
          <Input
            aria-label="Form email"
            data-testid="form-valid-input"
            type="email"
          />
          <FormHelper data-testid="form-helper">
            Send a work email we can reach.
          </FormHelper>
          <FormError />
        </FormItem>
      </div>
    </Section>
  );
};

const FileInputShowcase = () => {
  const [selectedFiles, setSelectedFiles] = React.useState<string[]>([]);
  const invalid =
    selectedFiles.length === 0 ? "Select at least one file" : undefined;

  return (
    <Section
      testId="file-input"
      title="FileInput"
      description="Native file selection with custom validity that clears after upload."
    >
      <div className="flex w-full max-w-md flex-col gap-3">
        <Label htmlFor="roadmap-file-input">
          <span>Project assets</span>
          <FileInput
            id="roadmap-file-input"
            aria-describedby="file-input-selection"
            accept=".pdf,.png"
            full
            invalid={invalid}
            multiple
            onChange={(event) => {
              setSelectedFiles(
                Array.from(event.currentTarget.files ?? []).map(
                  (file) => file.name,
                ),
              );
            }}
          />
        </Label>
        <output
          id="file-input-selection"
          data-testid="file-input-selection"
          className="text-sm opacity-70"
        >
          {selectedFiles.length > 0
            ? selectedFiles.join(", ")
            : "No files selected"}
        </output>
      </div>
    </Section>
  );
};

const InputShowcase = () => {
  return (
    <Section
      testId="input"
      title="Input"
      description="Standalone input exposing semantic invalid state and custom validity."
    >
      <InputFrame>
        <Input
          aria-label="Email input"
          type="email"
          invalid="Invalid email"
        />
      </InputFrame>
    </Section>
  );
};

const TextareaShowcase = () => {
  return (
    <Section
      testId="textarea"
      title="Textarea"
      description="Standalone textarea with custom validity."
    >
      <TextareaFrame full>
        <Textarea
          aria-label="Feedback textarea"
          invalid="Feedback is required"
          rows={4}
        />
      </TextareaFrame>
    </Section>
  );
};

const LabelShowcase = () => {
  return (
    <Section
      testId="label"
      title="Label"
      description="Label wrapping a checkbox input."
    >
      <Label
        direction="horizontal"
        className="bg-amber-100"
        data-testid="label-control"
      >
        <input
          aria-label="Label checkbox"
          type="checkbox"
        />
        <span>Label text</span>
      </Label>
    </Section>
  );
};

const PaginationShowcase = () => {
  const [lastAction, setLastAction] = React.useState("page:1");

  return (
    <Section
      testId="pagination"
      title="Pagination"
      description="Semantic pagination with current, disabled, and ellipsis states."
    >
      <div className="flex flex-col gap-4">
        <Pagination aria-label="Results pages">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#page-0"
                disabled
                onClick={() => setLastAction("previous")}
              />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#page-1"
                active
                onClick={(event) => event.preventDefault()}
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#page-2"
                onClick={(event) => {
                  event.preventDefault();
                  setLastAction("page:2");
                }}
              >
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis data-testid="pagination-ellipsis" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                href="#page-8"
                onClick={(event) => {
                  event.preventDefault();
                  setLastAction("page:8");
                }}
              >
                8
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#page-2"
                onClick={(event) => {
                  event.preventDefault();
                  setLastAction("next");
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
        <p data-testid="pagination-last-action">{lastAction}</p>
      </div>
    </Section>
  );
};

const PopoverShowcase = () => {
  return (
    <Section
      testId="popover"
      title="Popover"
      description="Popover opens on trigger and closes on outside click."
    >
      <Popover>
        <PopoverTrigger>
          <Button>Open popover</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Popover content</div>
        </PopoverContent>
      </Popover>
    </Section>
  );
};

const ControlledPopoverShowcase = () => {
  const [opened, setOpened] = React.useState(false);

  return (
    <Section
      testId="popover-controlled"
      title="Controlled Popover"
      description="Trigger clicks should not mutate prop-driven popover state."
    >
      <div className="flex items-center gap-3">
        <Button onClick={() => setOpened((prev) => !prev)}>
          Toggle controlled popover
        </Button>
        <span data-testid="popover-controlled-state">{String(opened)}</span>
      </div>

      <Popover opened={opened}>
        <PopoverTrigger>
          <Button>Controlled popover trigger</Button>
        </PopoverTrigger>
        <PopoverContent>
          <div>Controlled popover content</div>
        </PopoverContent>
      </Popover>
    </Section>
  );
};

const ProgressShowcase = () => {
  const [value, setValue] = React.useState(40);

  return (
    <Section
      testId="progress"
      title="Progress"
      description="Determinate and indeterminate progress state."
    >
      <div className="flex flex-col gap-4">
        <Progress
          aria-label="Upload progress"
          className="bg-emerald-200"
          value={value}
          max={100}
        />
        <div className="flex items-center gap-3">
          <Button onClick={() => setValue(75)}>Set progress to 75</Button>
          <span data-testid="progress-value">{value}</span>
        </div>
        <Progress aria-label="Sync progress" />
      </div>
    </Section>
  );
};

const RadioGroupShowcase = () => {
  const [value, setValue] = React.useState("starter");

  return (
    <Section
      testId="radio-group"
      title="Radio Group"
      description="Controlled radio selection with native keyboard support."
    >
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
        <span data-testid="radio-group-state">{value}</span>
      </div>
    </Section>
  );
};

const SelectShowcase = () => {
  const [plan, setPlan] = React.useState("starter");
  const [region, setRegion] = React.useState("us-east");

  return (
    <Section
      testId="select"
      title="Select"
      description="Custom button and listbox select with keyboard, controlled, and disabled states."
    >
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
            onValueChange={setPlan}
            data-testid="select-uncontrolled"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Team region</span>
          <Select
            full
            aria-label="Team region"
            value={region}
            options={[
              { label: "US East", value: "us-east" },
              { label: "Europe", value: "eu-west", disabled: true },
              { label: "Asia Pacific", value: "apac" },
            ]}
            onValueChange={setRegion}
            data-testid="select-controlled"
          />
        </div>
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium">Disabled select</span>
          <Select
            aria-label="Disabled select"
            defaultValue="starter"
            disabled
            options={[
              { label: "Starter", value: "starter" },
              { label: "Pro", value: "pro" },
            ]}
            data-testid="select-disabled"
          />
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <span>
          Uncontrolled value:{" "}
          <strong data-testid="select-uncontrolled-state">{plan}</strong>
        </span>
        <span>
          Controlled value:{" "}
          <strong data-testid="select-controlled-state">{region}</strong>
        </span>
      </div>
    </Section>
  );
};

const SeparatorShowcase = () => {
  return (
    <Section
      testId="separator"
      title="Separator"
      description="Horizontal, vertical, and decorative separators."
    >
      <div className="flex flex-col gap-4">
        <div>
          <p>Above horizontal separator</p>
          <Separator aria-label="Horizontal separator" />
          <p>Below horizontal separator</p>
        </div>
        <div className="flex h-10 items-stretch gap-4">
          <span>Left content</span>
          <Separator
            orientation="vertical"
            aria-label="Vertical separator"
          />
          <span>Right content</span>
        </div>
        <Separator
          decorative
          data-testid="decorative-separator"
        />
      </div>
    </Section>
  );
};

const ScrollAreaShowcase = () => {
  return (
    <Section
      testId="scroll-area"
      title="Scroll Area"
      description="Keyboard-focusable scroll containers with hidden native scrollbars and custom overflow chrome."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Activity feed</p>
          <ScrollArea
            role="region"
            aria-label="Activity feed"
            data-testid="scroll-area-vertical"
            className="h-56 rounded-lg border border-neutral-200 p-3 pr-5 dark:border-neutral-800"
          >
            <div className="flex flex-col gap-3 pr-2">
              {scrollAreaActivityItems.map((item, index) => (
                <div
                  key={item}
                  data-testid={`scroll-area-item-${index + 1}`}
                  className="rounded-md border border-neutral-200 bg-neutral-50 p-3 text-sm dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <p className="font-medium">Entry {index + 1}</p>
                  <p className="text-neutral-600 dark:text-neutral-400">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Timeline lanes</p>
          <ScrollArea
            orientation="horizontal"
            role="region"
            aria-label="Timeline lanes"
            data-testid="scroll-area-horizontal"
            className="rounded-lg border border-neutral-200 p-3 pb-5 dark:border-neutral-800"
          >
            <div className="flex min-w-max gap-3 pb-2">
              {scrollAreaTimelineLanes.map((lane, index) => (
                <div
                  key={lane}
                  data-testid={
                    index === scrollAreaTimelineLanes.length - 1
                      ? "scroll-area-lane-last"
                      : undefined
                  }
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

        <div className="flex flex-col gap-2 md:col-span-2">
          <p className="text-sm font-medium">Delivery board</p>
          <ScrollArea
            orientation="both"
            role="region"
            aria-label="Delivery board"
            data-testid="scroll-area-both"
            className="h-72 rounded-lg border border-neutral-200 p-3 pr-5 pb-5 dark:border-neutral-800"
          >
            <div className="grid min-w-max grid-cols-5 gap-3">
              {scrollAreaBoardColumns.map((column, columnIndex) => (
                <div
                  key={column}
                  className="w-56 rounded-lg border border-neutral-200 bg-neutral-50 p-3 dark:border-neutral-800 dark:bg-neutral-950"
                >
                  <p className="mb-3 text-sm font-medium">{column}</p>
                  <div className="grid gap-3">
                    {Array.from({ length: 5 }, (_, rowIndex) => {
                      const cardIndex = columnIndex * 5 + rowIndex + 1;

                      return (
                        <div
                          key={`${column}-${cardIndex}`}
                          data-testid={
                            cardIndex === scrollAreaBoardColumns.length * 5
                              ? "scroll-area-board-card-last"
                              : undefined
                          }
                          className="flex h-24 items-end rounded-md border border-neutral-200 bg-white p-3 text-sm dark:border-neutral-800 dark:bg-black"
                        >
                          Card {cardIndex}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </Section>
  );
};

const SkeletonShowcase = () => {
  return (
    <Section
      testId="skeleton"
      title="Skeleton"
      description="Loading placeholder blocks with shape and size variants."
    >
      <div
        data-testid="skeleton-card"
        className="flex w-full max-w-sm flex-col gap-3"
      >
        <div className="flex items-center gap-3">
          <Skeleton
            data-testid="skeleton-avatar"
            shape="circle"
            size="icon"
          />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton
              data-testid="skeleton-title"
              size="lg"
              className="w-48"
            />
            <Skeleton
              data-testid="skeleton-subtitle"
              size="sm"
              className="w-32"
            />
          </div>
        </div>
        <Skeleton data-testid="skeleton-line" />
        <Skeleton
          data-testid="skeleton-short-line"
          size="sm"
          className="w-2/3"
        />
      </div>
    </Section>
  );
};

const SliderShowcase = () => {
  const [value, setValue] = React.useState(35);

  return (
    <Section
      testId="slider"
      title="Slider"
      description="Native range input semantics with controlled value updates."
    >
      <div className="flex w-full max-w-md flex-col gap-4">
        <Label htmlFor="slider-volume">Volume</Label>
        <Slider
          id="slider-volume"
          min={0}
          max={100}
          step={5}
          value={value}
          onChange={(event) => setValue(event.currentTarget.valueAsNumber)}
        />
        <div className="flex items-center gap-3">
          <Button onClick={() => setValue(80)}>Set slider to 80</Button>
          <span data-testid="slider-value">{value}</span>
        </div>
        <Slider
          aria-label="Disabled volume slider"
          defaultValue={60}
          disabled
        />
      </div>
    </Section>
  );
};

const SwitchShowcase = () => {
  const [checked, setChecked] = React.useState(false);

  return (
    <Section
      testId="switch"
      title="Switch"
      description="Controlled switch state."
    >
      <div className="flex items-center gap-3">
        <div data-testid="switch-control">
          <Switch
            aria-label="Enable notifications"
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
        </div>
        <span data-testid="switch-state">{String(checked)}</span>
      </div>
    </Section>
  );
};

const TableShowcase = () => {
  return (
    <Section
      testId="table"
      title="Table"
      description="Semantic table structure with header, body, footer, and caption."
    >
      <div className="overflow-x-auto">
        <Table data-testid="table-root">
          <TableCaption data-testid="table-caption">
            Quarterly revenue by team
          </TableCaption>
          <TableHeader data-testid="table-header">
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
          <TableBody data-testid="table-body">
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
          <TableFooter data-testid="table-footer">
            <TableRow>
              <TableCell colSpan={2}>Total</TableCell>
              <TableCell className="text-right">$166K</TableCell>
            </TableRow>
          </TableFooter>
        </Table>
      </div>
    </Section>
  );
};

const ToggleShowcase = () => {
  const [pressed, setPressed] = React.useState(false);

  return (
    <Section
      testId="toggle"
      title="Toggle"
      description="Controlled pressed state and disabled behavior."
    >
      <div className="flex items-center gap-3">
        <Toggle
          pressed={pressed}
          onPressedChange={setPressed}
        >
          Pin item
        </Toggle>
        <Toggle disabled>Disabled toggle</Toggle>
        <span data-testid="toggle-state">{String(pressed)}</span>
      </div>
    </Section>
  );
};

const ToggleGroupShowcase = () => {
  const [alignment, setAlignment] = React.useState<string | undefined>(
    "center",
  );
  const [formats, setFormats] = React.useState<string[]>(["bold"]);
  const alignmentState = alignment ?? "none";
  const formatState = formats.join(",") || "none";

  return (
    <Section
      testId="toggle-group"
      title="Toggle Group"
      description="Single and multiple selection with disabled and orientation semantics."
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-3">
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
          <span data-testid="toggle-group-single-state">{alignmentState}</span>
        </div>

        <div className="flex flex-col gap-3">
          <ToggleGroup
            type="multiple"
            aria-label="Text format"
            orientation="vertical"
            defaultValue={["bold"]}
            onValueChange={setFormats}
          >
            <ToggleGroupItem value="bold">Bold</ToggleGroupItem>
            <ToggleGroupItem value="italic">Italic</ToggleGroupItem>
            <ToggleGroupItem value="underline">Underline</ToggleGroupItem>
          </ToggleGroup>
          <span data-testid="toggle-group-multiple-state">{formatState}</span>
        </div>
      </div>
    </Section>
  );
};

const TabsShowcase = () => {
  const [submitCount, setSubmitCount] = React.useState(0);

  return (
    <Section
      testId="tabs"
      title="Tabs"
      description="Default tab and manual switching."
    >
      <form
        className="flex flex-col gap-4"
        onSubmit={(event) => {
          event.preventDefault();
          setSubmitCount((count) => count + 1);
        }}
      >
        <TabProvider defaultName="account">
          <TabList>
            <TabTrigger name="account">Account</TabTrigger>
            <TabTrigger name="security">Security</TabTrigger>
          </TabList>
          <div className="pt-4">
            <TabContent name="account">
              <div>Account content</div>
            </TabContent>
            <TabContent name="security">
              <div>Security content</div>
            </TabContent>
          </div>
        </TabProvider>
        <span data-testid="tabs-submit-count">{submitCount}</span>
      </form>
    </Section>
  );
};

const ToastTrigger = () => {
  const { toast } = useToast();

  return (
    <div className="flex gap-2">
      <Button
        onClick={() =>
          toast({
            title: "Toast title",
            description: "Toast description",
            status: "success",
            closeTimeout: null,
          })
        }
      >
        Show toast
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Error toast title",
            description: "Error toast description",
            status: "error",
            closeTimeout: null,
          })
        }
      >
        Show error toast
      </Button>
    </div>
  );
};

const ToastShowcase = () => {
  return (
    <Section
      testId="toast"
      title="Toast"
      description="Global toast portal rendering."
    >
      <Toaster />
      <ToastTrigger />
    </Section>
  );
};

const TooltipShowcase = () => {
  return (
    <Section
      testId="tooltip"
      title="Tooltip"
      description="Hover to show tooltip content."
    >
      <Tooltip>
        <button
          type="button"
          className="rounded-md border px-3 py-2"
        >
          Tooltip trigger
        </button>
        <TooltipContent delay="none">Tooltip content</TooltipContent>
      </Tooltip>
    </Section>
  );
};

const showcases = [
  BadgeShowcase,
  AccordionShowcase,
  AlertShowcase,
  AvatarShowcase,
  ButtonShowcase,
  BreadcrumbShowcase,
  CardShowcase,
  CheckboxShowcase,
  DialogShowcase,
  DrawerShowcase,
  DrawerScrollShowcase,
  FormShowcase,
  FileInputShowcase,
  InputShowcase,
  TextareaShowcase,
  LabelShowcase,
  PaginationShowcase,
  PopoverShowcase,
  ControlledPopoverShowcase,
  ProgressShowcase,
  RadioGroupShowcase,
  ScrollAreaShowcase,
  SelectShowcase,
  SeparatorShowcase,
  SkeletonShowcase,
  SliderShowcase,
  SwitchShowcase,
  TableShowcase,
  ToggleShowcase,
  ToggleGroupShowcase,
  TabsShowcase,
  ToastShowcase,
  TooltipShowcase,
];

const App = () => {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-10">
      <header className="flex flex-col gap-2">
        <p className="text-sm uppercase tracking-[0.2em] opacity-60">
          Playwright harness
        </p>
        <h1 className="text-3xl font-bold">PSW UI component test page</h1>
        <p className="max-w-3xl text-sm opacity-75">
          This page exists only for Playwright-based component interaction
          tests. It intentionally does not change component implementations.
        </p>
      </header>

      {showcases.map((Showcase) => (
        <Showcase key={Showcase.name} />
      ))}
    </main>
  );
};

export { App };
