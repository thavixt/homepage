import { LoaderCircleIcon, PenLineIcon, SendHorizonalIcon } from "lucide-react";
import { useRef, useState, type KeyboardEventHandler } from "react";
import { askGemini, type ChatMessage } from "~/api/gemini";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { useTypesafeTranslation } from "~/i18n";
import { cn, sleep } from "~/lib/utils";
import Showdown from 'showdown';
import { useUser } from "~/context/userContext";
import { toast } from "sonner";
import { getTimeString } from "~/lib/date";

const MarkdownConverter = new Showdown.Converter();
const TYPING_DELAY = 250; // ms
const MAX_MESSAGE_HISTORY_LENGTH = 20;

export function meta() {
  return [
    { title: "AI assistant - Homepage" },
    { name: "description", content: "Ask anything" },
  ];
}

export default function AboutPage() {
  const t = useTypesafeTranslation();
  const me = t('common.me');
  const { userName } = useUser();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);
  const pastMessages = useRef<ChatMessage[]>([]);

  const focusInput = async (delay = 250) => {
    await sleep(delay);
    inputRef?.current?.focus();
  };

  const clearInput = async (delay = 250) => {
    await sleep(delay);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }

  const scrollToBottom = async () => {
    if (!responseRef.current) {
      return;
    }
    sleep(250);
    responseRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  const renderMarkdown = async (md: string, options: { type: 'query' | 'response', duration?: number }) => {
    if (!responseRef.current) {
      return;
    }

    const headerDiv = document.createElement('div');
    headerDiv.classList.add('aiChatMessageHeader');
    const timeDiv = document.createElement('code');
    timeDiv.classList.add('aiChatTimestamp')

    const userNameDiv = document.createElement('div');
    userNameDiv.innerText = options.type === "query" ? `${userName ?? me}:` : "Gemini:";
    userNameDiv.classList.add(options.type === "query" ? 'aiChatMe' : 'aiChatGemini');
    headerDiv.appendChild(userNameDiv);

    const t = new Date();
    const duration = options.duration ? `(${options.duration}s) ` : '';
    timeDiv.innerText = `${duration}${getTimeString(t)}`;
    timeDiv.title = t.toLocaleString();
    headerDiv.appendChild(timeDiv);

    responseRef.current.appendChild(headerDiv);

    // Convert the whole markdown to HTML once
    const html = MarkdownConverter.makeHtml(md);

    // Create a temporary element to parse the HTML
    const temp = document.createElement("div");
    temp.innerHTML = html;

    // Type out the HTML node by node
    for (const node of Array.from(temp.childNodes)) {
      // Clone the node so we can append it piece by piece
      const clone = node.cloneNode(true);
      // If it's a text node, type it character by character
      if (clone.nodeType === Node.TEXT_NODE) {
        for (const char of clone.textContent || "") {
          responseRef.current.innerHTML += char;
          await sleep(TYPING_DELAY);
          scrollToBottom();
        }
      } else {
        // For elements, append them whole (or you can recursively type their children)
        responseRef.current.appendChild(clone);
        await sleep(TYPING_DELAY);
        scrollToBottom();
      }
    }
  };

  const writeQuery = async (text: string) => {
    await renderMarkdown(text, { type: 'query' })
    await sleep(500);
  }

  const writeResponse = async (text: string, duration: number) => {
    await renderMarkdown(text, { type: 'response', duration })
    await sleep(500);
  }

  const onSubmit = async () => {
    if (!inputRef.current || !inputRef.current.value) {
      return;
    }
    const query = inputRef.current.value;
    setLoading(true);
    try {
      await writeQuery(query);
      const start = performance.now();
      const context = pastMessages.current;
      const response = await askGemini(query, context);
      clearInput();
      pastMessages.current.push({role: 'user', text: query});
      pastMessages.current.push({role: 'model', text: response});
      if (pastMessages.current.length > MAX_MESSAGE_HISTORY_LENGTH) {
        pastMessages.current.splice(0, 2);
      }
      const done = performance.now();
      const duration = +((done - start) / 1000).toFixed(1);
      await writeResponse(response, duration);
    } catch (e) {
      console.error(e);
      toast.error(t('error.unknown'), { description: (e as Error).message });
    }
    setLoading(false);
    focusInput();
  }

  const onEnter: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col gap-4 w-full">
          <p>{t('chat.header')}</p>
          <div className="grid grid-cols-[30px_1fr_auto] w-full gap-4 items-center">
            <div className="flex gap-2 items-center">
              <Label
                htmlFor="input"
                className="w-full"
                title={t('chat.tooltip')}
              >
                <PenLineIcon />
              </Label>
            </div>
            <Textarea
              ref={inputRef}
              className="h-[100px] resize-none"
              id="input"
              name="input"
              placeholder={t('common.inputPlaceholder')}
              disabled={loading}
              onKeyDown={onEnter}
              title={t('chat.tooltip')}
            />
            <Button
              variant="outline"
              size="icon"
              className="h-full w-18"
              disabled={loading}
              onClick={onSubmit}
              title={t('chat.tooltip')}
            >
              <SendHorizonalIcon />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="isolate relative flex flex-col gap-4 items-start h-[450px]">
        <ScrollArea
          ref={scrollAreaRef}
          className={cn(
            "z-1 w-full h-full px-4 py-0 flex items-center justify-center",
            { "pointer-events-none": loading },
          )}
        >
          <div ref={responseRef} className="aiChatBox"></div>
        </ScrollArea>
        <div className={cn(
          "absolute z-10 top-0 left-0 flex w-full h-full items-center justify-center animate-pulse bg-transparent",
          { "hidden": !loading },
        )}>
          <LoaderCircleIcon size={48} className="animate-spin" />
        </div>
      </CardContent>
    </Card>
  );
}
