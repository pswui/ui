import { Label } from "@components/Label";
import { Checkbox } from "@components/Checkbox";

export function Horizontal() {
  return (
    <Label direction="horizontal">
      <Checkbox />
      <span>Checkbox</span>
    </Label>
  );
}
