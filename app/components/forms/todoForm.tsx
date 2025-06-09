import type { Todo } from "~/reducers/todosReducer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { DatePicker } from "../ui/date-picker";
import { Textarea } from "../ui/textarea";

export function TodoForm({ todo }: { todo?: Todo }) {
  return (
    <div className="grid gap-4 my-4">
      <div className="grid gap-3">
        <Label htmlFor="title">Title</Label>
        <Input
          autoFocus
          id="title"
          name="title"
          defaultValue={todo?.title}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          defaultValue={todo?.description}
        />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="href">Deadline</Label>
        <DatePicker
          name="deadline"
          defaultValue={todo?.deadline
            ? new Date(todo.deadline)
            : undefined
          }
        />
      </div>
    </div>
  )
}