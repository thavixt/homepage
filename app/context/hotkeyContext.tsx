import { createContext, useCallback, useEffect, type PropsWithChildren } from "react";
import { useAppDispatch } from "~/hooks/state";
import { incrementStat } from "~/reducers/statsReducer";

interface HotkeyContextValue {
  modifier: 'shift',
  /** key presses with the modifier to 'listen' to */
  keys: string[],
  onHotkeyPressed: (hotkey: string) => void;
}

const HotkeyContext = createContext<HotkeyContextValue>({
  modifier: 'shift',
  keys: [],
  onHotkeyPressed: () => { },
});

// list of interactive element node types where hotkeys should be ignore when in focus
const IGNORED_NODE_NAMES = [
  'INPUT',
  'SELECT',
  'TEXTAREA',
];

export function HotkeyContextProvider({
  children,
  modifier,
  keys,
  onHotkeyPressed,
}: PropsWithChildren<HotkeyContextValue>) {
  const dispatch = useAppDispatch();
  const onHotkey = useCallback(({ key, shiftKey, target }: KeyboardEvent) => {
    const currentNodeType = (target as HTMLElement).nodeName;
    if (IGNORED_NODE_NAMES.includes(currentNodeType)) {
      return;
    }
    if (modifier === 'shift' && !shiftKey) {
      return;
    }
    if (keys.includes(key)) {
      onHotkeyPressed(key);
      dispatch(incrementStat({ stat: 'hotkeyPressed' }))
    }
  }, [dispatch, keys, modifier, onHotkeyPressed]);

  useEffect(() => {
    document.addEventListener('keydown', onHotkey);
    return () => document.removeEventListener('keydown', onHotkey);
  }, [onHotkey]);

  return (
    <HotkeyContext.Provider value={{ keys, modifier, onHotkeyPressed }}>
      {children}
    </HotkeyContext.Provider>
  )
}