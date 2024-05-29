import React from "react";
import { Checkbox } from "../components/Checkbox";
import { Label } from "../components/Label";
import { Toaster, useToast } from "../components/Toast";

export default {
  title: "React/Checkbox",
};

export const Default = () => {
  return <Checkbox />;
};

export const DefaultChecked = () => {
  return <Checkbox defaultChecked />;
};

export const Controlled = () => {
  const [state, setState] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Checkbox Toggled",
      description: `Checkbox state changed to ${state}`,
      status: state ? "success" : "error",
    });
  }, [state]);

  return (
    <>
      <Toaster />
      <Checkbox
        checked={state}
        onChange={(e) => {
          setState(e.currentTarget.checked);
        }}
      />
    </>
  );
};

export const UsingWithLabel = () => {
  return (
    <Label direction="horizontal">
      <Checkbox />
      <span>Check this out</span>
    </Label>
  );
};

export const Disabled = () => {
  return (
    <Label direction="horizontal">
      <Checkbox disabled />
      <span>Disabled checkbox</span>
    </Label>
  );
};

export const DisabledChecked = () => {
  return (
    <Label direction="horizontal">
      <Checkbox disabled checked />
      <span>Disabled checkbox</span>
    </Label>
  );
};

export const BaseSize = () => {
  return (
    <Label direction="horizontal">
      <Checkbox size="base" />
      <span>Base</span>
    </Label>
  );
};

export const MediumSize = () => {
  return (
    <Label direction="horizontal">
      <Checkbox size="md" />
      <span>Medium</span>
    </Label>
  );
};

export const LargeSize = () => {
  return (
    <Label direction="horizontal">
      <Checkbox size="lg" />
      <span>Large</span>
    </Label>
  );
};
