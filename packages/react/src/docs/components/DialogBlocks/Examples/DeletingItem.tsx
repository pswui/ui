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
import { Button } from "@components/Button";
import { useToast } from "@components/Toast";

export function DeletingItem() {
  const { toast } = useToast();

  return (
    <DialogRoot>
      <DialogTrigger>
        <Button preset="danger">Delete Item</Button>
      </DialogTrigger>
      <DialogOverlay>
        <DialogContent size={"fullMd"}>
          <DialogHeader>
            <DialogTitle>Delete Item</DialogTitle>
            <DialogSubtitle>
              Are you sure you want to delete this item?
            </DialogSubtitle>
          </DialogHeader>
          <div className="flex flex-col gap-3">
            <ul className="list-disc list-inside">
              <li>This action will delete the item, and related data</li>
              <li>This action cannot be undone</li>
            </ul>
          </div>
          <DialogFooter>
            <DialogClose>
              <Button
                preset="danger"
                onClick={async () => {
                  const toasted = toast({
                    title: "Deleting Item",
                    description: "Item deletion is requested",
                    status: "loading",
                  });

                  await new Promise((r) => setTimeout(r, 1000));

                  toasted.update({
                    title: "Item Deleted",
                    description: "The item has been deleted",
                    status: "success",
                  });
                }}
              >
                Delete
              </Button>
            </DialogClose>
            <DialogClose>
              <Button
                preset="default"
                onClick={() => {
                  toast({
                    title: "Action Canceled",
                    description: "The delete action has been canceled",
                    status: "error",
                  });
                }}
              >
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogOverlay>
    </DialogRoot>
  );
}
