import { Label } from "@components/Label";
import { Checkbox } from "@components/Checkbox";

export function Disabled() {
  return (
    <Label direction="horizontal">
      <Checkbox size="base" disabled />
      <span>Agree terms and conditions</span>
    </Label>
  );
}
