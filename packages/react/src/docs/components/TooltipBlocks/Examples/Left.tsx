import { Button } from "@components/Button";
import { Tooltip, TooltipContent } from "@components/Tooltip";

export function Left() {
  return (
    <Tooltip position="left">
      <TooltipContent>
        <p>Tooltip!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
