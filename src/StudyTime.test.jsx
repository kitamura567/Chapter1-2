import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StudyTime } from "./StudyTime";
import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("./Utils/Supabase", () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockResolvedValue({
          data: [{ id: 999, text: "新規記録", timeText: "2" }],
          error: null,
        }),
      }),
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockResolvedValue({ error: null }),
      }),
    })),
  },
}));

vi.mock("./Utils/SupabaseFunction", () => ({
  getAllHistory: vi
    .fn()
    .mockResolvedValue([{ id: 1, text: "既存の学習", timeText: "1" }]),
}));

describe("StudyTime アプリのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("1. タイトルとして「学習記録一覧」が表示されていること", async () => {
    render(<StudyTime />);
    const title = await screen.findByText("学習記録一覧");
    expect(title).toBeDefined();
  });

  it("2. フォームに入力して登録ボタンを押すと、記録が1つ増えること", async () => {
    render(<StudyTime />);
    await screen.findByText("学習記録一覧");

    const initialItems = await screen.findAllByText("削除");
    const initialCount = initialItems.length;

    const inputs = screen.getAllByRole("textbox");
    fireEvent.change(inputs[0], { target: { value: "Reactのテスト" } });
    fireEvent.change(inputs[1], { target: { value: "2" } });

    fireEvent.click(screen.getByText("登録"));

    await waitFor(() => {
      const updatedItems = screen.getAllByText("削除");
      expect(updatedItems.length).toBe(initialCount + 1);
    });
  });

  it("3. 削除ボタンを押すと記録が1つ減ること", async () => {
    render(<StudyTime />);
    const deleteButtons = await screen.findAllByText("削除");
    const initialCount = deleteButtons.length;

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      const remainingItems = screen.queryAllByText("削除");
      expect(remainingItems.length).toBe(initialCount - 1);
    });
  });

  it("4. 入力をしないで登録を押すとエラーが表示されること", async () => {
    render(<StudyTime />);
    await screen.findByText("学習記録一覧");

    const signUpButton = screen.getByText("登録");
    fireEvent.click(signUpButton);

    const errorMessage =
      await screen.findByText("入力されていない項目があります");

    expect(errorMessage).toBeDefined();

    const deleteButtons = screen.queryAllByText("削除");
    expect(deleteButtons.length).toBe(1);
  });
});
