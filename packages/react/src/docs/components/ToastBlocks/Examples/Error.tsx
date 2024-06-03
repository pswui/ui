import { Button } from "@components/Button";
import { Toaster, useToast } from "@components/Toast";

function Children() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({
          title: "Toast Title",
          description: "Toast Description",
          status: "error",
        })
      }
    >
      Toast
    </Button>
  );
}

export function Error() {
  return (
    <>
      <Toaster />
      <Children />
    </>
  );
}
