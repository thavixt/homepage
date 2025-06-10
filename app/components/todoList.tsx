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
import { useTypesafeTranslation } from "~/i18n";

export function TodoList() {
  const t = useTypesafeTranslation();
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
      toast(t('todos.form.required'));
      return;
    }
    dispatch(createTodo({ deadline, title, description }));
    setDialogOpen(false);
  }

  const onClearAllTodosConfirm = () => {
    dispatch(clearTodos());
  }

  const onFilterChange = (status: TodoStatus) => (checked: boolean) => {
    setFilter(prev => ({ ...prev, [status]: checked }));
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="flex gap-4 justify-between px-4">
        <Input
          autoFocus
          type="search"
          className="w-36"
          id="search"
          name="search"
          placeholder={t('common.searchPlaceholder')} onChange={onSearch}
        />
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.initial} id="initial" onCheckedChange={onFilterChange('initial')} />
          <Label htmlFor="initial">{t('todos.filter.initial')}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.inprogress} id="inprogress" onCheckedChange={onFilterChange('inprogress')} />
          <Label htmlFor="inprogress">{t('todos.filter.inprogress')}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.completed} id="completed" onCheckedChange={onFilterChange('completed')} />
          <Label htmlFor="completed">{t('todos.filter.completed')}</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch defaultChecked={filter.cancelled} id="cancelled" onCheckedChange={onFilterChange('cancelled')} />
          <Label htmlFor="cancelled">{t('todos.filter.cancelled')}</Label>
        </div>
      </div>
      <Separator />
      <ScrollArea className="w-full h-[500px] pr-3 px-4">
        <div className="flex flex-col gap-4 w-full">
          {!todos.length ? (
            <div className="flex flex-col gap-12 h-[250px] items-center justify-end">
              <div>{t('common.emptyText')}</div>
              <div className="flex gap-2 items-center">
                <span>{t('todos.tip.part1')}</span>
                <Badge>{t('todos.tip.part2')}</Badge>
                <span>{t('todos.tip.part3')}</span>
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
      <div className="flex gap-4 px-4">
        <AlertDialog
          trigger={(
            <div className="border rounded-md p-1" title="Delete all tasks">
              <Trash2Icon className="cursor-pointer" size={16} />
            </div>
          )}
          onConfirm={onClearAllTodosConfirm}
          title={t('todos.clear.title')}
          description={t('todos.clear.description')}
        />
        <FormDialog
          trigger={<Button>{t('todos.create.button')}</Button>}
          onSubmit={onSubmit}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          title={t('todos.create.title')}
          description={t('todos.create.description')}
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
