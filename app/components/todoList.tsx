import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { clearTodos, createTodo, getTodos, type Todo, type TodoStatus } from "~/reducers/todosReducer";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Trash2Icon } from "lucide-react";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { FormDialog } from "./dialogs/formDialog";
import { TodoForm } from "./forms/todoForm";
import { Input } from "./ui/input";
import { AlertDialog } from "./dialogs/alertDialog";
import { Separator } from "./ui/separator";
import { TodoItem } from "./todoItem";

export function TodoList() {
  const todos = useAppSelector(getTodos);
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const [filter, setFilter] = useState<Record<TodoStatus, boolean>>({
    cancelled: false,
    completed: false,
    initial: true,
    inprogress: true,
  });

  const sortedTodos = [...todos].sort(
    (a, b) => a.deadline < b.deadline ? 1 : -1
  )

  const filteredTodos = sortedTodos.filter(
    (todo) => {
      return (
        todo.title.toLowerCase().includes(searchValue.toLowerCase())
        || todo.description?.toLowerCase().includes(searchValue.toLowerCase())
        || filterTodosByState(filter, todo)
      )
    }
  )

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchValue(e.currentTarget.value)
  }

  const onSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const deadline = formData.get("deadline") as string;
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    if (!title || !deadline) {
      toast('Must provide a title and deadline for the todo');
      return;
    }
    dispatch(createTodo({ deadline, title, description }));
    toast.success(`Todo tasks "${title}" saved`);
    setDialogOpen(false);
  }

  const onClearAllTodosConfirm = () => {
    dispatch(clearTodos());
    toast.success('Todo list cleared');
  }

  const onFilterChange = (status: TodoStatus) => (checked: boolean) => {
    setFilter(prev => ({ ...prev, [status]: checked }));
  }

  return (
    <div className="flex flex-col gap-4 items-center">
      <div className="flex gap-4 justify-between">
        <Input type="search" className="w-36" id="search" name="search" placeholder="Search" onChange={onSearch} />
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.initial} id="initial" onCheckedChange={onFilterChange('initial')} />
          <Label htmlFor="initial">Show initial</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.inprogress} id="inprogress" onCheckedChange={onFilterChange('inprogress')} />
          <Label htmlFor="inprogress">Show in progress</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.completed} id="completed" onCheckedChange={onFilterChange('completed')} />
          <Label htmlFor="completed">Show completed</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.cancelled} id="cancelled" onCheckedChange={onFilterChange('cancelled')} />
          <Label htmlFor="cancelled">Show cancelled</Label>
        </div>
      </div>
      <Separator />
      <ScrollArea className="w-full h-[500px] pr-3">
        <div className="flex flex-col gap-4 w-full">
          {!todos.length ? (
            <div className="flex flex-col gap-12 h-[250px] items-center justify-end">
              <div>Nothing - for now.</div>
              <div className="flex gap-2 items-center">
                <span>Click the</span>
                <Badge>Create new task</Badge>
                <span>button below to create a new <em>task to do</em>!</span>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
              {filteredTodos.map(todo => (
                <TodoItem key={todo.id} todo={todo} />
              ))}
            </div>
          )}
        </div>
      </ScrollArea>
      <Separator />
      <div className="flex gap-4">
        <AlertDialog
          trigger={(
            <div className="border rounded-md p-1" title="Delete all tasks">
              <Trash2Icon className="cursor-pointer" size={16} />
            </div>
          )}
          onConfirm={onClearAllTodosConfirm}
          title="Delete all tasks"
          description={`Are you sure you want to delete all the todos in the list?`}
        />
        <FormDialog
          trigger={<Button>Create a new todo</Button>}
          onSubmit={onSubmit}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title="Edit task"
          description="Edit the title, description and deadline of the task."
        >
          <TodoForm />
        </FormDialog>
      </div>
    </div>
  )
}

function filterTodosByState(filter: Record<TodoStatus, boolean>, todo: Todo) {
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
