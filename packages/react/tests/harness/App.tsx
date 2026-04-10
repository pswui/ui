import React from "react";

import { Alert, AlertDescription, AlertTitle } from "../../components/Alert";
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
import {
  FormError,
  FormHelper,
  FormItem,
  FormLabel,
} from "../../components/Form";
import { Input, InputFrame } from "../../components/Input";
import { Label } from "../../components/Label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../../components/Popover";
import { Separator } from "../../components/Separator";
import { Switch } from "../../components/Switch";
import {
  TabContent,
  TabList,
  TabProvider,
  TabTrigger,
} from "../../components/Tabs";
import { Toaster, useToast } from "../../components/Toast";
import { Tooltip, TooltipContent } from "../../components/Tooltip";

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
      </div>
    </Section>
  );
};

const ButtonShowcase = () => {
  const [count, setCount] = React.useState(0);

  return (
    <Section
      testId="button"
      title="Button"
      description="Basic click and disabled behavior."
    >
      <div className="flex items-center gap-3">
        <Button onClick={() => setCount((prev) => prev + 1)}>Increment</Button>
        <Button disabled>Disabled action</Button>
        <span data-testid="button-count">{count}</span>
      </div>
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
      <Card data-testid="card-root">
        <CardHeader data-testid="card-header">
          <CardTitle>Design review</CardTitle>
          <CardDescription>Ready for a focused component pass.</CardDescription>
        </CardHeader>
        <CardContent data-testid="card-content">
          <p>Review spacing, contrast, and responsive structure.</p>
        </CardContent>
        <CardFooter data-testid="card-footer">
          <Button>Open review</Button>
        </CardFooter>
      </Card>
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
          >
            <DrawerHeader>
              <h3 className="text-lg font-semibold">Drawer title</h3>
            </DrawerHeader>
            <DrawerBody>
              <p>Drawer body content</p>
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

const FormShowcase = () => {
  return (
    <Section
      testId="form"
      title="Form"
      description="Helper and error text driven by invalid state."
    >
      <FormItem invalid="Required field">
        <FormLabel>Name</FormLabel>
        <Input
          aria-label="Form name"
          type="text"
        />
        <FormHelper hiddenOnInvalid>Helpful instructions</FormHelper>
        <FormError data-testid="form-error" />
      </FormItem>
    </Section>
  );
};

const InputShowcase = () => {
  return (
    <Section
      testId="input"
      title="Input"
      description="Standalone input with custom validity."
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

const LabelShowcase = () => {
  return (
    <Section
      testId="label"
      title="Label"
      description="Label wrapping a checkbox input."
    >
      <Label
        direction="horizontal"
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

const TabsShowcase = () => {
  return (
    <Section
      testId="tabs"
      title="Tabs"
      description="Default tab and manual switching."
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
  AlertShowcase,
  ButtonShowcase,
  CardShowcase,
  CheckboxShowcase,
  DialogShowcase,
  DrawerShowcase,
  FormShowcase,
  InputShowcase,
  LabelShowcase,
  PopoverShowcase,
  SeparatorShowcase,
  SwitchShowcase,
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
