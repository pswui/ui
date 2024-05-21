import { Button } from "../components/Button";
import { Tooltip, TooltipContent } from "../components/Tooltip";

export default {
  title: "React/Tooltip",
  component: Tooltip,
  parameters: {
    layout: "centered",
  },
};

export const Default = () => {
  return (
    <Tooltip>
      <TooltipContent>
        <p className="whitespace-nowrap">Hello World!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
};

export const Top = () => {
  return (
    <Tooltip position="top">
      <TooltipContent>
        <p className="whitespace-nowrap">Hello World!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
};

export const Bottom = () => {
  return (
    <Tooltip position="bottom">
      <TooltipContent>
        <p className="whitespace-nowrap">Hello World!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
};

export const Left = () => {
  return (
    <Tooltip position="left">
      <TooltipContent>
        <p className="whitespace-nowrap">Hello World!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
};

export const Right = () => {
  return (
    <Tooltip position="right">
      <TooltipContent>
        <p className="whitespace-nowrap">Hello World!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
};
