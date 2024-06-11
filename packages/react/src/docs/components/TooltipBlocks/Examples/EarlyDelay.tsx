import { Button } from "@components/Button";
import { Tooltip, TooltipContent } from "@components/Tooltip";

export function EarlyDelay() {
  return (
    <Tooltip position="bottom">
      <TooltipContent delay={"early"}>
        <p>Tooltip!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
