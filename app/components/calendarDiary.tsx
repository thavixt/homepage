import { useAppDispatch, useAppSelector } from "~/hooks/state";
import { getDiaryEntries, updateDiaryEntry } from "~/reducers/calendarReducer";
import { dateFormatOptions } from "./ui/clock";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { useEffect, useRef, useState } from "react";
import { getDateString } from "~/lib/date";

export function CalendarDiary({ date }: { date: Date }) {
  const [changed, setChanged] = useState(false);
  const diaryTextareaRef = useRef<HTMLTextAreaElement>(null);
  const diary = useAppSelector(getDiaryEntries);
  const dispatch = useAppDispatch();

  const updateDiary = () => {
    if (!diaryTextareaRef.current) {
      return;
    }
    setChanged(false);
    dispatch(updateDiaryEntry({
      date: getDateString(date),
      text: diaryTextareaRef.current.value,
    }))
  }

  useEffect(() => {
    const diaryEntry = diary[getDateString(date)]?.text ?? '';
    if (diaryTextareaRef.current) {
      diaryTextareaRef.current.value = diaryEntry;
    }
  }, [date, diary]);

  return (
    <div className="flex flex-col gap-4 items-start justify-start size-full p-4">
      <div className="w-full flex items-center justify-between gap-4">
        <span>Diary entry for {date?.toLocaleDateString(navigator.language, dateFormatOptions)}:</span>
        <Button className="self-end" onClick={updateDiary} disabled={!changed}>
          Update diary
        </Button>
      </div>
      <Textarea
        ref={diaryTextareaRef}
        className="h-50 resize-none"
        placeholder={+date > Date.now() ? 'Whatever will happen that day?' : 'Describe how this day went'}
        onChange={() => setChanged(true)}
      />
    </div >
  )
}