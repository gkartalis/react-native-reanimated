import { useEffect, useRef } from 'react';
import FrameCallbackRegistry from '../frameCallback/FrameCallbackRegistry';

export type FrameCallback = {
  setActive: (isActive: boolean) => void;
  isActive: boolean;
  callbackId: number;
};
const frameCallbackRegistry = new FrameCallbackRegistry();

export function useFrameCallback(
  callback: () => void,
  autostart = true
): FrameCallback {
  const ref = useRef<FrameCallback>({
    setActive: (isActive: boolean) => {
      frameCallbackRegistry.manageStateFrameCallback(
        ref.current.callbackId,
        isActive
      );
      ref.current.isActive = isActive;
    },
    isActive: autostart,
    callbackId: -1,
  });

  useEffect(() => {
    ref.current.callbackId =
      frameCallbackRegistry.registerFrameCallback(callback);
    ref.current.setActive(ref.current.isActive);

    return () => {
      frameCallbackRegistry.unregisterFrameCallback(ref.current.callbackId);
      ref.current.callbackId = -1;
    };
  }, [callback, autostart]);

  return ref.current;
}
