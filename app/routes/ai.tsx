import { LoaderCircleIcon, PenLineIcon, SendHorizonalIcon } from "lucide-react";
import { useRef, useState, type KeyboardEventHandler } from "react";
import { askGemini } from "~/api/gemini";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { useTypesafeTranslation } from "~/i18n";
import { sleep } from "~/lib/utils";
import Showdown from 'showdown';
import { useUser } from "~/context/userContext";
import { toast } from "sonner";

const MarkdownConverter = new Showdown.Converter();
const TYPING_DELAY = 250; // ms

export function meta() {
  return [
    { title: "AI assistant - Homepage" },
    { name: "description", content: "Ask anything" },
  ];
}

export default function AboutPage() {
  const t = useTypesafeTranslation();
  const me = t('common.me');
  const { userName = me } = useUser();
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const responseRef = useRef<HTMLDivElement>(null);

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
    sleep(500);
    responseRef.current.scrollIntoView({ block: 'end', behavior: 'smooth' });
  }

  const renderMarkdown = async (md: string, options: { type: 'query' | 'response' }) => {
    if (!responseRef.current) {
      return;
    }

    if (options.type === "query") {
      const div = document.createElement('div');
      div.innerText = `${userName}:`
      div.classList.add('aiChatNameplate');
      responseRef.current.appendChild(div);
    }
    if (options.type === "response") {
      const div = document.createElement('div');
      div.innerText = "Gemini:"
      div.classList.add('aiChatNameplate');
      responseRef.current.appendChild(div);
    }

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

  const writeResponse = async (text: string) => {
    await renderMarkdown(text, { type: 'response' })
    await sleep(500);
  }

  const onSubmit = async () => {
    if (!inputRef.current || !inputRef.current.value) {
      return;
    }
    const query = inputRef.current.value;
    setLoading(true);
    clearInput();
    try {
      await writeQuery(query);
      const response = await askGemini(query);
      await writeResponse(response);
    } catch (e) {
      console.error(e);
      toast.error(t('error.unknown'));
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
    <Card className=" backdrop-blur-lg w-4xl">
      <CardHeader>
        <div className="flex flex-col gap-4">
          <Label>{t('chat.header')}</Label>
          <div className="grid grid-cols-[auto_1fr_auto] w-full gap-4 items-center">
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
              className="h-[100px]"
              autoFocus
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
      <CardContent className="flex flex-col gap-4 items-start h-[450px] w-full relative">
        <ScrollArea ref={scrollAreaRef} className="h-full py-4 w-full">
          <div ref={responseRef} className="aiChatBox"></div>
        </ScrollArea>
        {loading ? (
          <div className="absolute top-0 left-0 flex w-full h-full items-center justify-center animate-pulse z-100 bg-accent opacity-35">
            <LoaderCircleIcon size={48} className="animate-spin" />
          </div>
        ) : (
          null
        )}
      </CardContent>
    </Card>
  );
}
