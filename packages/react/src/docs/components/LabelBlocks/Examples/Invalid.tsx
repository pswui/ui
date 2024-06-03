import { Label } from "@components/Label";
import { Input } from "@components/Input";

export function Invalid() {
  return (
    <Label direction="vertical">
      <span>Email</span>
      <Input type="email" invalid="Invalid Email" />
    </Label>
  );
}
