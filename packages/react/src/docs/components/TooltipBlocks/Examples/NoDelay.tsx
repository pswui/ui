import { Button } from "@components/Button";
import { Tooltip, TooltipContent } from "@components/Tooltip";

export function NoDelay() {
  return (
    <Tooltip position="bottom">
      <TooltipContent delay={"none"}>
        <p>Tooltip!</p>
      </TooltipContent>
      <Button>Hover me</Button>
    </Tooltip>
  );
}
