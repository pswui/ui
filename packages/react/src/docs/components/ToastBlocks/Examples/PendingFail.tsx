import { Button } from "@components/Button";
import { Toaster, useToast } from "@components/Toast";

function Children() {
  const { toast } = useToast();

  return (
    <Button
      onClick={async () => {
        const toasted = toast({
          title: "Waiting...",
          description: "Waiting for result...",
          status: "loading",
        });
        await new Promise((r) => setTimeout(r, 1000));
        toasted.update({
          title: "Promise Failed",
          description: "Something went wrong!",
          status: "error",
        });
      }}
    >
      Toast
    </Button>
  );
}

export function PendingFail() {
  return (
    <>
      <Toaster />
      <Children />
    </>
  );
}
