import {
  AlertDialog as AlertDialogRoot,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog"

interface AlertDialogProps {
  cancel?: string;
  confirm?: string;
  description?: string;
  open?: boolean;
  title: string;
  trigger: React.ReactNode;
  triggerAsChild?: boolean;

  onOpenChange?: (open: boolean) => void;
  onConfirm: () => void;
}

export function AlertDialog({
  open, onOpenChange, onConfirm,
  title, description, trigger, triggerAsChild,
  cancel = "Cancel",
  confirm = "Continue",
}: AlertDialogProps) {
  return (
    <AlertDialogRoot open={open} onOpenChange={onOpenChange}>
      <AlertDialogTrigger asChild={triggerAsChild}>
        {trigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{cancel}</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>{confirm}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogRoot>
  )
}