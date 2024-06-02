import { Label } from "@components/Label";
import { Checkbox } from "@components/Checkbox";

export function Text() {
  return (
    <Label direction="horizontal">
      <Checkbox size="base" />
      <span>Agree terms and conditions</span>
    </Label>
  );
}
