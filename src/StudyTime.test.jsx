import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { StudyTime } from "./StudyTime";
import { describe, test, expect, vi, beforeEach } from "vitest";

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

describe("StudyTimeのテスト", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("1. タイトルとして「学習記録一覧」が表示されていること", async () => {
    render(<StudyTime />);
    expect(await screen.findByText("学習記録一覧")).toBeInTheDocument();
  });

  it("2. フォームに入力して登録ボタンを押すと、記録が1つ増えること", async () => {
    render(<StudyTime />);

    await screen.findByText("学習記録一覧");

    const inputs = screen.getAllByRole("textbox");

    fireEvent.change(inputs[0], { target: { value: "学習内容" } });
    fireEvent.change(inputs[1], { target: { value: 1 } });

    fireEvent.click(screen.getByRole("button", { name: "登録" }));

    await waitFor(() => {
      expect(screen.getByText("学習内容")).toBeDefined();
    });
  });

  it("3. 削除ボタンを押すと記録が1つ減ること", async () => {
    render(<StudyTime />);
    const deleteButtons = await screen.findAllByText("削除");
    const Count = deleteButtons.length;

    fireEvent.click(deleteButtons[0]);

    await waitFor(() => {
      const deleteItems = screen.queryAllByText("削除");
      expect(deleteItems.length).toBe(Count - 1);
    });
  });

  it("4. 入力をしないで登録を押すとエラーが表示されること", async () => {
    render(<StudyTime />);
    await screen.findByText("学習記録一覧");

    const signUpButton = screen.getByText("登録");
    fireEvent.click(signUpButton);

    const errorMessage =
      await screen.findByText("入力されていない項目があります");

    await waitFor(() => {
      expect(errorMessage).toBeDefined();
    });
  });
});
