import { Button } from "@components/Button";
import { Tooltip, TooltipContent } from "@components/Tooltip";

export function LateDelay() {
  return (
    <Tooltip position="bottom">
      <TooltipContent delay={"late"}>
        <p>Tooltip!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
