import { useState } from "react";
import { toast } from "sonner";
import { AlertDialog } from "~/components/dialogs/alertDialog";
import { FormDialog } from "~/components/dialogs/formDialog";
import { TodoForm } from "~/components/forms/todoForm";
import { TodoList } from "~/components/todoList";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "~/components/ui/card";
import { useAppDispatch } from "~/hooks/state";
import { useTypesafeTranslation } from "~/i18n";
import { createTodo, clearTodos } from "~/reducers/todosReducer";

export function meta() {
  return [
    { title: "Homepage - Things to do" },
    { name: "description", content: "Better get on that!" },
  ];
}

export default function TodosPage() {
  const t = useTypesafeTranslation();
  const dispatch = useAppDispatch();
    const [dialogOpen, setDialogOpen] = useState(false);

  
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

  return (
     <Card>
      <CardHeader>
        {t('todos.header')}
      </CardHeader>
      <CardContent className="flex flex-col gap-4 w-full px-0">
        <TodoList />
      </CardContent>
      <CardFooter>
        <AlertDialog
          triggerAsChild  
          trigger={<Button variant="outline">{t('todos.deleteAll.button')}</Button>}
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
      </CardFooter>
    </Card>
  );
}
