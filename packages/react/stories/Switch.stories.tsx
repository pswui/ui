import React from "react";
import { Label } from "../components/Label";
import { Switch } from "../components/Switch";
import { Toaster, useToast } from "../components/Toast";

export default {
  title: "React/Switch",
};

export const Default = () => <Switch />;

export const Disabled = () => <Switch disabled />;

export const DisabledChecked = () => <Switch disabled checked />;

export const WithLabel = () => (
  <Label direction="horizontal">
    <Switch />
    <span>Switch</span>
  </Label>
);

export const Controlled = () => {
  const [checked, setChecked] = React.useState(false);
  const { toast } = useToast();

  React.useEffect(() => {
    toast({
      title: "Switch changed",
      description: `The switch was changed to ${checked ? "true" : "false"}`,
    });
  }, [checked, toast]);

  return (
    <>
      <Toaster />
      <Label direction="horizontal">
        <Switch
          checked={checked}
          onChange={(e) => setChecked(e.target.checked)}
        />
        <span>Click here to toggle!</span>
      </Label>
    </>
  );
};
