import { Input } from "../components/Input";
import { Label } from "../components/Label";

export default {
  title: "React/Label",
};

export const WithInput = () => {
  return (
    <Label>
      <p>Email</p>
      <Input type="text" />
    </Label>
  );
};

export const HorizontalWithInput = () => {
  return (
    <Label direction="horizontal">
      <p>Email</p>
      <Input type="text" />
    </Label>
  );
};
