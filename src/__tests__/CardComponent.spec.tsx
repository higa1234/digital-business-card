import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { User } from "../domain/users";
import { Card } from "../components/pages/Card";

// モック関数定義
const mockNavigate = jest.fn();
const mockGetUserById = jest.fn();

// ライブラリの関数モック
// getUserById
jest.mock("../libs/users", () => {
  return { getUserById: (id: string) => mockGetUserById(id) };
});

// react-router(一部モック)
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
    useParams: () => ({ postId: "123" }),
  };
});

// 外部ライブラリ(dompurify)
jest.mock("dompurify", () => ({
  __esModule: true,
  default: {
    sanitize: (html: string) => html,
  }, // サニタイズせずそのまま返す
}));

// userEventの初期設定
const user = userEvent.setup();

// 毎回テスト開始前
beforeEach(() => {
  jest.clearAllMocks(); // モックの呼び出し回数や戻り値をリセット

  // getUserById を常に同じモックデータで返す（テスト内で個別に上書きも可能）
  mockGetUserById.mockResolvedValue(
    new User(
      "123",
      "テスト太郎",
      "<p>こんにちは</p>",
      [{ id: "1", name: "React" }],
      "https://github.com/yamada",
      "https://qiita.com/yamada",
      "https://x.com/yamada"
    )
  );
});

// 毎回テスト後
afterEach(() => {
  cleanup(); // 画面のクリーンアップ(DOMの初期化)
});

// 共通関数（レンダーとloading待ちを共通化）
const renderAndWaitForDigitalCard = async () => {
  // コンポーネントを読み込み
  render(
    <MemoryRouter initialEntries={["/card/123"]}>
      <Routes>
        <Route path="/card/:postId" element={<Card />} />
      </Routes>
    </MemoryRouter>
  );
  // loadingが終了し、名刺が表示される
  await waitFor(() => {
    expect(screen.getByTestId("digital-card")).toBeInTheDocument();
  });
};

/**
 * テストコード
 */
describe("名刺カードのテスト", () => {
  test("名前が表示されている", async () => {
    // レンダリング_ローディングが終了し、名刺が表示されることを確認
    await renderAndWaitForDigitalCard();

    // 名前が存在するか
    const name = screen.getByTestId("user-name");
    expect(name).toBeInTheDocument();
    expect(name).toHaveTextContent("テスト太郎");
  });

  test("自己紹介が表示されている", async () => {
    // レンダリング_ローディングが終了し、名刺が表示されることを確認
    await renderAndWaitForDigitalCard();

    // 名前が存在するか
    const description = screen.getByTestId("user-description");
    expect(description).toBeInTheDocument();
    expect(description).toHaveTextContent("こんにちは");
  });

  test("技術が表示されている", async () => {
    // レンダリング_ローディングが終了し、名刺が表示されることを確認
    await renderAndWaitForDigitalCard();

    // 名前が存在するか
    const skill = screen.getByTestId("user-skill");
    expect(skill).toBeInTheDocument();
    expect(skill).toHaveTextContent("React");
  });

  test("GitHubアイコンが表示されている", async () => {
    // レンダリング_ローディングが終了し、名刺が表示されることを確認
    await renderAndWaitForDigitalCard();

    // GitHubボタンが存在するか
    const gitHubButton = screen.getByRole("link", { name: "GitHub" });
    expect(gitHubButton).toBeInTheDocument();
  });

  test("Qiitaアイコンが表示されている", async () => {
    // レンダリング_ローディングが終了し、名刺が表示されることを確認
    await renderAndWaitForDigitalCard();

    // GitHubボタンが存在するか
    const qiitaButton = screen.getByRole("link", { name: "Qiita" });
    expect(qiitaButton).toBeInTheDocument();
  });

  test("Xアイコンが表示されている", async () => {
    // レンダリング_ローディングが終了し、名刺が表示されることを確認
    await renderAndWaitForDigitalCard();

    // GitHubボタンが存在するか
    const xButton = screen.getByRole("link", { name: "X" });
    expect(xButton).toBeInTheDocument();
  });

  test("戻るボタンをクリックすると/に遷移する", async () => {
    // レンダリング_ローディングが終了し、名刺が表示されることを確認
    await renderAndWaitForDigitalCard();

    // 戻るボタンが存在するか
    const backButton = screen.getByRole("button", { name: "戻る" });
    expect(backButton).toBeInTheDocument();

    // 戻るボタン押下
    await user.click(backButton);

    // ✅ navigate("/") が呼ばれたか確認
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
