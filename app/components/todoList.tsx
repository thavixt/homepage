import { useAppSelector } from "~/hooks/state";
import { getTodos, type Todo, type TodoStatus } from "~/reducers/todosReducer";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import { useState } from "react";
import { Input } from "./ui/input";
import { TodoItem } from "./todoItem";
import { useTypesafeTranslation } from "~/i18n";

export function TodoList() {
  const t = useTypesafeTranslation();
  const todos = useAppSelector(getTodos);
  const [searchValue, setSearchValue] = useState('');

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
      const visible = filterTodoByState(filter, todo);
      if (visible) {
        return todo.title.toLowerCase().includes(searchValue.toLowerCase())
          || todo.description?.toLowerCase().includes(searchValue.toLowerCase())
      } else {
        return false;
      }
    }
  )

  const onSearch: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    setSearchValue(e.currentTarget.value)
  }

  const onFilterChange = (status: TodoStatus) => (checked: boolean) => {
    setFilter(prev => ({ ...prev, [status]: checked }));
  }

  return (
    <div className="flex flex-col gap-4 items-center w-full">
      <div className="flex flex-wrap gap-4 justify-between px-4 w-full">
        <div className="flex flex-col gap-2">
          <Label htmlFor="search">Search:</Label>
          <Input
            type="search"
            className="w-fit"
            id="search"
            name="search"
            placeholder={t('common.searchPlaceholder')} onChange={onSearch}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 w-fit">
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
      </div>
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
              {filteredTodos.length ? (
                filteredTodos.map(todo => (
                  <TodoItem key={todo.id} todo={todo} />
                ))
              ) : (
                <div className="col-span-3 row-span-4 w-full h-full my-2 flex flex-col items-center justify-center gap-8 font-light text-sm">
                  <p>Nothing to do for now.</p>
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    <span>Click the</span>
                    <Badge>Create task</Badge>
                    <span>button below to create a todo task.</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function filterTodoByState(filter: Record<TodoStatus, boolean>, todo: Todo) {
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
