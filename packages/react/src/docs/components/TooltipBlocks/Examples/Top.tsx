import { Button } from "@components/Button";
import { Tooltip, TooltipContent } from "@components/Tooltip";

export function Top() {
  return (
    <Tooltip position="top">
      <TooltipContent>
        <p>Tooltip!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
