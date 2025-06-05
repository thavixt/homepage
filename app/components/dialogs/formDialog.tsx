import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog"
import { Button } from "../ui/button";

interface DialogProps {
  cancel?: string;
  children: React.ReactNode;
  description: string;
  open: boolean;
  submit?: string;
  title: string;
  trigger: React.ReactNode;

  onOpenChange: (open: boolean) => void;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
}

export function FormDialog({
  open, onOpenChange, onSubmit,
  children, title, description, trigger,
  cancel = "Cancel",
  submit = "Submit",
}: DialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {description}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={onSubmit}>
          {children}
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">{cancel}</Button>
            </DialogClose>
            <Button type="submit">{submit}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}