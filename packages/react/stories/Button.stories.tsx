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

export const Link = () => {
  return <Button preset="link">Link Button</Button>;
};

export const Success = () => {
  return (
    <Button preset="default" background="success" border="success">
      Success Button
    </Button>
  );
};

export const Warning = () => {
  return (
    <Button preset="default" background="warning" border="warning">
      Warning Button
    </Button>
  );
};

export const Danger = () => {
  return (
    <Button preset="default" background="danger" border="danger">
      Danger Button
    </Button>
  );
};

export const AsChild = () => {
  return (
    <Button asChild preset="default">
      <a href="https://google.com">As Child Button</a>
    </Button>
  );
};
