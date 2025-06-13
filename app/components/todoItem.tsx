import { cn } from "~/lib/utils";
import { cancelTodo, completeTodo, startTodo, type Todo } from "~/reducers/todosReducer";
import { Badge } from "./ui/badge";
import { AlertDialog } from "./dialogs/alertDialog";
import { CheckIcon, PlayIcon, TrashIcon } from "lucide-react";
import { useAppDispatch } from "~/hooks/state";
import { dateFormatOptions } from "./clock";

function getBadgeStatusText(todo: Todo) {
  switch (todo.status) {
    case 'initial':
      return 'Todo';
    case 'inprogress':
      return 'In progress';
    case 'completed':
      return 'Completed';
    case 'cancelled':
      return 'Cancelled';
    default:
      console.error(`Unknown todo status: ${todo}`);
      return '';
  }
}

export function TodoItem({todo}: {todo: Todo}) {
  const dispatch = useAppDispatch();
  
  const classes = cn(
    'grid grid-cols-[1fr_auto] justify-between gap-2 border-2 rounded-md p-2',
    {
      'shadow-md': todo.status === 'initial',
      'border-green-500 shadow-md': todo.status === 'inprogress',
      'bg-slate-600 opacity-50': todo.status === 'completed',
      'bg-slate-600 opacity-25': todo.status === 'cancelled',
    }
  );

  const onStartConfirm = (todoId: string) => {
    dispatch(startTodo(todoId))
  }

  const onCompleteConfirm = (todoId: string) => {
    dispatch(completeTodo(todoId))
  }

  const onCancelConfirm = (todoId: string) => {
    dispatch(cancelTodo(todoId))
  }

  return (
    <div key={todo.id} className={classes}>
      <div className="flex flex-col gap-2 items-start w-full">
        <Badge>{getBadgeStatusText(todo)}</Badge>
        <div className="flex flex-col gap-2 w-full">
          <div className="font-bold text-2xl">{todo.title}</div>
          {todo.description ? (
            <div className="rounded-sm bg-primary/10 px-3 py-2 text-xs w-fit whitespace-pre-line">{todo.description}</div>
          ) : null}
          <div className="font-light text-sm italic">
            Due: {(new Date(todo.deadline)).toLocaleDateString(navigator.language, dateFormatOptions)}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 justify-between items-end">
        <div className="flex justify-end gap-1">
          {!['cancelled', 'completed'].includes(todo.status) ? (
            <AlertDialog
              trigger={(
                <div className="border rounded-md p-1" title="Mark task as completed">
                  <CheckIcon className="cursor-pointer" size={16} />
                </div>
              )}
              onConfirm={() => onCompleteConfirm(todo.id)}
              title="Mark this todo as completed?"
              description="You cannot undo this action."
            />
          ) : null}
          {todo.status === 'initial' ? (
            <AlertDialog
              trigger={(
                <div className="border rounded-md p-1" title="Start task">
                  <PlayIcon className="cursor-pointer" size={16} />
                </div>
              )}
              onConfirm={() => onStartConfirm(todo.id)}
              title="Mark this todo as in-progress?"
              description="You cannot undo this action."
            />
          ) : null}
        </div>
        {!['cancelled', 'completed'].includes(todo.status) ? (
          <AlertDialog
            trigger={
              <div className="border rounded-md p-1" title="Cancel task">
                <TrashIcon className="cursor-pointer" size={16} />
              </div>
            }
            onConfirm={() => onCancelConfirm(todo.id)}
            title="Mark this todo as cancelled?"
            description="You cannot undo this action."
          />
        ) : null}
      </div>
    </div>
  );

}