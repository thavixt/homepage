import type { HTMLAttributes } from "react"

export function HotKey({children, modifier = 'Shift', ...props}: {children: string, modifier?: 'Shift'} & HTMLAttributes<HTMLElement>) {
  const content = `${modifier} + ${children}`

  return (
    <code {...props}>{content}</code>
  )
}
