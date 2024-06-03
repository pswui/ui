import { Button } from "@components/Button";
import { Tooltip, TooltipContent } from "@components/Tooltip";

export function Right() {
  return (
    <Tooltip position="right">
      <TooltipContent>
        <p>Tooltip!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
