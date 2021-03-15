import { renderHook, act } from "@testing-library/react-hooks";
import useDarkMode, { LocalStorageItemKey } from "./use-dark-mode";

test("toggle dark mode", () => {
  const setItemSpy = jest.spyOn(window.localStorage.__proto__, "setItem");
  const getItemSpy = jest.spyOn(window.localStorage.__proto__, "getItem");
  const removeItemSpy = jest.spyOn(window.localStorage.__proto__, "removeItem");
  const { result } = renderHook(() => useDarkMode());
  expect(result.current.isDarkMode).toBe(false);
  expect(getItemSpy).toBeCalledWith(LocalStorageItemKey);
  act(() => {
    result.current.toggleDarkMode();
  });
  expect(setItemSpy).toBeCalledWith(LocalStorageItemKey, "true");
  expect(result.current.isDarkMode).toBe(true);
  act(() => {
    result.current.toggleDarkMode();
  });
  expect(removeItemSpy).nthCalledWith(2, LocalStorageItemKey);
  expect(result.current.isDarkMode).toBe(false);
});

test("use dark mode settings (browser)", () => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: query === "(prefers-color-scheme: dark)",
    })),
  });
  const { result } = renderHook(() => useDarkMode());
  expect(result.current.isDarkMode).toBe(true);
});

test("use dark mode settings (local storage)", () => {
  const getItemSpy = jest.spyOn(window.localStorage.__proto__, "getItem");
  getItemSpy.mockImplementation((key) => key === LocalStorageItemKey);
  const { result } = renderHook(() => useDarkMode());
  expect(result.current.isDarkMode).toBe(true);
  getItemSpy.mockRestore();
});
