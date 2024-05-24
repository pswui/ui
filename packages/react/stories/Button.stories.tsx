import { Button } from "../components/Button";

export default {
  title: "React/Button",
};

export const Default = () => {
  return <Button preset="default">Button</Button>;
};
export const Ghost = () => {
  return <Button preset="ghost">Ghost Button</Button>;
};

export const Outline = () => {
  return (
    <Button border="outline" background="ghost" decoration="none" size="md">
      Outline Button
    </Button>
  );
};

export const Link = () => {
  return <Button preset="link">Link Button</Button>;
};

export const AsChild = () => {
  return (
    <Button asChild preset="default">
      <a href="https://google.com">As Child Button</a>
    </Button>
  );
};
