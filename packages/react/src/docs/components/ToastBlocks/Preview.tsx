import { Button } from "@components/Button";
import { Toaster, useToast } from "@components/Toast";

function Children() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast({ title: "Toast Title", description: "Toast Description" })
      }
    >
      Toast
    </Button>
  );
}

export function ToastDemo() {
  return (
    <>
      <Toaster />
      <Children />
    </>
  );
}
