import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import { afterEach } from "vitest"; 

// ユーザー操作のシミュレーション用
export const user = userEvent.setup();

// 各テストの終了後にDOMをリセットする
afterEach(() => {
  cleanup();
});