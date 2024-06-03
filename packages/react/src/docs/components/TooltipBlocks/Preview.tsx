import { Button } from "@components/Button";
import { Tooltip, TooltipContent } from "@components/Tooltip";

export function TooltipDemo() {
  return (
    <Tooltip>
      <TooltipContent>
        <p>Tooltip!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
