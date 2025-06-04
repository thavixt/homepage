import type { Route } from "./+types/home";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { cancelTodo, clearTodos, completeTodo, createTodo, getTodos, startTodo, type Todo, type TodoStatus } from "~/reducers/todosReducer";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { CheckIcon, PlayIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "@todo" },
    { name: "description", content: "Better get on that!" },
  ];
}

export default function Todos() {
  return (
    <Card>
      <CardHeader className="w-full text-center font-bold text-4xl">
        Things to do
      </CardHeader>
      <CardContent>
        <TodosList />
      </CardContent>
    </Card>
  );
}

function TodosList() {
  const todos = useAppSelector(getTodos);
  const dispatch = useAppDispatch();

  const [filter, setFilter] = useState<Record<TodoStatus, boolean>>({
    cancelled: false,
    completed: false,
    initial: true,
    inprogress: true,
  });

  const onStart: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const id = e.currentTarget.dataset.id as string;
    dispatch(startTodo(id))
  }
  const onComplete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const id = e.currentTarget.dataset.id as string;
    dispatch(completeTodo(id))
  }
  const onDelete: React.MouseEventHandler<HTMLButtonElement> = (e) => {
    const id = e.currentTarget.dataset.id as string;
    dispatch(cancelTodo(id))
  }

  const onClick = () => {
    const deadline = new Date();
    deadline.setDate(deadline.getDate() + 7);
    dispatch(
      createTodo({
        title: crypto.randomUUID(),
        description: new Array(3).fill(0).map(() => crypto.randomUUID()).join(' '),
        deadline: deadline.toISOString(),
      }),
    );
  }

  const onChange = (status: TodoStatus) => (checked: boolean) => {
    setFilter(prev => ({ ...prev, [status]: checked }));
  }

  const onClear = () => {
    if (confirm('Are you sure you want to clear ALL of your todos?')) {
      dispatch(clearTodos());
      toast.success('Todo list cleared');
    }
  }

  return (
    // @todo: fix ScrollArea height
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4 justify-between">
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.initial} id="initial" onCheckedChange={onChange('initial')} />
          <Label htmlFor="inprogress">Show initial</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.inprogress} id="inprogress" onCheckedChange={onChange('inprogress')} />
          <Label htmlFor="inprogress">Show in progress</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.completed} id="inprogress" onCheckedChange={onChange('completed')} />
          <Label htmlFor="inprogress">Show completed</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.cancelled} id="inprogress" onCheckedChange={onChange('cancelled')} />
          <Label htmlFor="inprogress">Show cancelled</Label>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-3">
        <div className="flex flex-col gap-4 w-[750px]">
          {!todos.length ? (
            <div className="flex flex-col gap-12 h-[250px] items-center justify-end">
              <p>Nothing yet!</p>
              <p>Click on the <Badge>Create new task</Badge> button below to create a new <em>task to do</em>!</p>
            </div>
          ) : (
            <ul className="flex flex-col gap-2">
              {todos.filter(t => filterTodo(filter, t)).map(todo => {
                const classes = cn(
                  'flex justify-between gap-8 border-2 rounded-md p-2',
                  {
                    'shadow-md': todo.status === 'initial',
                    'border-green-500 shadow-md': todo.status === 'inprogress',
                    'bg-slate-600 opacity-50': todo.status === 'completed',
                    'bg-slate-600 opacity-25': todo.status === 'cancelled',
                  }
                )
                return (
                  <div key={todo.id} className={classes}>
                    <div className="flex flex-col gap-2">
                      <Badge>{todo.status}</Badge>
                      <p className="font-bold">{todo.title}</p>
                      <p className="italic text-sm">{todo.description}</p>
                      <p className="italic">{(new Date(todo.deadline)).toLocaleDateString(navigator.language)}</p>
                    </div>
                    <div className="flex flex-col gap-2 justify-between">
                      <div className="flex justify-end gap-2">
                        {todo.status === 'initial' ? (
                          <Button data-id={todo.id} onClick={onStart} title="Start task">
                            <PlayIcon />
                          </Button>
                        ) : null}
                        {!['cancelled', 'completed'].includes(todo.status) ? (
                          <Button data-id={todo.id} variant="outline" onClick={onComplete} title="Mark as completed">
                            <CheckIcon />
                          </Button>
                        ) : null}
                      </div>
                      {!['cancelled', 'completed'].includes(todo.status) ? (
                        <Button data-id={todo.id} variant="destructive" onClick={onDelete}>Cancel</Button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </ul>
          )}
        </div>
      </ScrollArea>

      <div className="flex gap-4">
        <Button variant="outline" onClick={onClear}>Clear tasks</Button>
        <Button onClick={onClick}>Create a new task</Button>
      </div>
    </div>
  )
}

function filterTodo(filter: Record<TodoStatus, boolean>, todo: Todo) {
  if (!filter.cancelled && todo.status === 'cancelled') {
    return false;
  }
  if (!filter.completed && todo.status === 'completed') {
    return false;
  }
  if (!filter.initial && todo.status === 'initial') {
    return false;
  }
  if (!filter.inprogress && todo.status === 'inprogress') {
    return false;
  }
  return true;
}
