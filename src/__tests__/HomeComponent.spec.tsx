import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { Home } from "../components/pages/Home";
import { User } from "../domain/users";
import { Register } from "../components/pages/Register";
import type { RegisterFormData } from "../domain/form/RegisterFormData";

// モック関数定義
const mockNavigate = jest.fn();
const mockGetUserById = jest.fn();
const mockInsertUserAndUserSkill = jest.fn();
const mockGetAllSkills = jest.fn();

// ライブラリの関数モック
// supabase関数
jest.mock("../libs/users", () => {
  return {
    getUserById: (id: string) => mockGetUserById(id),
    insertUserAndUserSkill: (data: RegisterFormData) =>
      mockInsertUserAndUserSkill(data),
  };
});
jest.mock("../libs/skills", () => {
  return {
    getAllSkills: () => mockGetAllSkills(),
  };
});

// react-router(一部モック)
jest.mock("react-router-dom", () => {
  const originalModule = jest.requireActual("react-router-dom");
  return {
    ...originalModule,
    useNavigate: () => mockNavigate,
  };
});

// userEventの初期設定
const user = userEvent.setup();

// 毎回テスト開始前
beforeEach(() => {
  jest.clearAllMocks(); // モックの呼び出し回数や戻り値をリセット

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
  mockInsertUserAndUserSkill.mockResolvedValue({});
  mockGetAllSkills.mockResolvedValue([]);
});

// 毎回テスト後
afterEach(() => {
  cleanup(); // 画面のクリーンアップ(DOMの初期化)
});

// 共通関数（レンダーとloading待ちを共通化）
const renderAndWaitForSearchForm = async () => {
  // コンポーネントを読み込み
  render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/card/register" element={<Register />} />
      </Routes>
    </MemoryRouter>
  );
  // loadingが終了し、名刺が表示される
  await waitFor(() => {
    expect(screen.getByTestId("search-form")).toBeInTheDocument();
  });
};

/**
 * テストコード
 */
describe("トップページのテスト", () => {
  test("タイトルが表示されている", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForSearchForm();

    // タイトルが存在するか
    const title = screen.getByTestId("home-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("デジタル名刺アプリ");
  });

  test("IDを入力してボタンを押すと/cards/:idに遷移する", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForSearchForm();

    // テスト用に入力するユーザーID
    const testUserId = "123";

    // 入力フォームに値を入れる
    await user.type(screen.getByLabelText("ID"), testUserId);

    // 名刺をみるボタンを押す（form submit）
    const searchButton = screen.getByRole("button", { name: "名刺をみる" });
    await user.click(searchButton);

    // 検索関数(存在チェック用)が実行されていることを確認
    expect(mockGetUserById).toHaveBeenCalled();

    // navigate("/card/:postId") が呼ばれたか確認
    expect(mockNavigate).toHaveBeenCalledWith("/card/" + testUserId);
  });

  test("IDを入力しないでボタンを押すとエラーメッセージが表示される", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForSearchForm();

    // 名刺をみるボタンを押す（form submit）
    const searchButton = screen.getByRole("button", { name: "名刺をみる" });
    await user.click(searchButton);

    // navigate("/card/:id") が呼ばれていない確認
    expect(mockNavigate).not.toHaveBeenCalled();
    // IDのエラーメッセージが表示されているか
    expect(screen.getByTestId("error-user_id")).toHaveTextContent(
      "IDを入力してください"
    );
  });

  test("新規登録はこちらを押すと/cards/registerに遷移する", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForSearchForm();

    //「新規登録はこちら」を押す
    const registerLink = screen.getByRole("link", { name: "新規登録はこちら" });
    await user.click(registerLink);

    // navigate("/card/register") が呼ばれたか確認
    const form = await screen.findByTestId("register-form");
    expect(form).toBeInTheDocument();
  });
});
