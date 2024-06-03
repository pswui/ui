import { Button } from "@components/Button";
import { Tooltip, TooltipContent } from "@components/Tooltip";

export function Bottom() {
  return (
    <Tooltip position="bottom">
      <TooltipContent>
        <p>Tooltip!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
