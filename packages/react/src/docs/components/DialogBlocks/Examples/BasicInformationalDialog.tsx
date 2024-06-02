import { Button } from "@components/Button";
import {
  DialogRoot,
  DialogTrigger,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogSubtitle,
  DialogFooter,
  DialogClose,
} from "@components/Dialog";

export function BasicInformationalDialog() {
  return (
    <DialogRoot>
      <DialogTrigger>
        <Button preset="default">What is this?</Button>
      </DialogTrigger>
      <DialogOverlay>
        <DialogContent size={"fullMd"}>
          <DialogHeader>
            <DialogTitle>Dialog Title</DialogTitle>
            <DialogSubtitle>Dialog Subtitle</DialogSubtitle>
          </DialogHeader>
          <p>This is a dialog. You can put the information you want to show.</p>
          <DialogFooter>
            <DialogClose>
              <Button preset="default">Ok!</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogRoot>
  );
}
