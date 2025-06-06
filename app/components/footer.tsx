import { useAppDispatch } from "~/hooks/state"
import { incrementBackgroundCounter } from "~/reducers/settingsReducer";
import { incrementStat } from "~/reducers/statsReducer";

export function Footer() {
  const dispatch = useAppDispatch();
  const changeRandomBackground = () => {
    dispatch(incrementBackgroundCounter());
    dispatch(incrementStat({stat: 'backgroundChange'}));
  }

  return (
    <footer className="flex items-center justify-center text-sm font-light text-center pb-2">
      <div className="flex w-fit gap-2 items-center bg-gray-900 px-2 py-1 rounded-md text-white opacity-50 hover:opacity-100 transition-opacity">
        <a title="Or press Shift + B" className="cursor-pointer" onClick={changeRandomBackground}>Change background</a>
        <span>-</span>
        <div>
          <a href="http://github.com/thavixt/homepage" target="_blank" rel="noopener noreferrer">Made by @thavixt</a>
        </div>
      </div>
    </footer>
  )
}