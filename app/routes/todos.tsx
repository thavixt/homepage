import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Route } from "./+types/home";
import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { cancelTodo, completeTodo, createTodo, getTodos, startTodo } from "~/reducers/todosReducer";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { ScrollArea } from "~/components/ui/scroll-area";
import { cn } from "~/lib/utils";
import { CheckIcon, PlayIcon } from "lucide-react";
import { Card, CardContent, CardHeader } from "~/components/ui/card";

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
        <Tabs defaultValue="todos" className="max-w-[700px] w-full">
          <TabsList className="w-full">
            <TabsTrigger value="todos">My todos</TabsTrigger>
            <TabsTrigger value="create">Create a todo</TabsTrigger>
          </TabsList>
          <TabsContent value="todos">
            <TodosList />
          </TabsContent>
          <TabsContent value="create">
            <CreateTodo />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

function TodosList() {
  const todos = useAppSelector(getTodos);
  const dispatch = useAppDispatch();

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

  return (
    // @todo: fix scroll area height
    <ScrollArea className="h-[600px] pr-3">
      <div className="flex flex-col gap-4">
        {!todos.length ? (
          <p>Nothing yet {':('} Click on the other tab to create a <em>todo</em>!</p>
        ) : null}
        <ul className="flex flex-col gap-2">
          {todos.map(todo => {
            const classes = cn(
              'flex justify-between gap-8 border-2 rounded-md p-2',
              {
                'shadow-md': todo.status === 'initial',
                'border-green-500 shadow-md': todo.status === 'inprogress',
                'opacity-50': todo.status === 'completed',
                'bg-slate-200 opacity-50': todo.status === 'cancelled',
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
      </div>
    </ScrollArea>
  )
}

function CreateTodo() {
  const dispatch = useAppDispatch();
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

  return (
    <div className="flex flex-col gap-4">
      <Button variant="outline" onClick={onClick}>Create a random Todo</Button>
    </div>
  )
}