import { Label } from "@components/Label";
import { Input } from "@components/Input";

export function Disabled() {
  return (
    <Label direction="vertical">
      <span>Email</span>
      <Input type="email" disabled />
    </Label>
  );
}
