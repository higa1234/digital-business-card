import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import userEvent from "@testing-library/user-event";

import { Register } from "../components/pages/Register";
import { RegisterFormData } from "../domain/form/RegisterFormData";
import { Skill } from "../domain/skill";

// モック関数定義
const mockNavigate = jest.fn();
const mockInsertUserAndUserSkill = jest.fn();
const mockGetAllSkills = jest.fn();

// ライブラリの関数モック
// supabase関数
jest.mock("../libs/users", () => {
  return {
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

  // insertUserAndUserSkill を常に同じモックデータで返す（テスト内で個別に上書きも可能）
  mockInsertUserAndUserSkill.mockResolvedValue({ error: null });

  // getAllSkills を常に同じモックデータで返す（テスト内で個別に上書きも可能）
  mockGetAllSkills.mockResolvedValue([
    new Skill(1, "React"),
    new Skill(2, "TypeScript"),
    new Skill(3, "GitHub"),
  ]);
});

// 毎回テスト後
afterEach(() => {
  cleanup(); // 画面のクリーンアップ(DOMの初期化)
});

// 共通関数（レンダーとloading待ちを共通化）
const renderAndWaitForRegisterForm = async () => {
  // コンポーネントを読み込み
  render(
    <MemoryRouter initialEntries={["/card/register"]}>
      <Routes>
        <Route path="/card/register" element={<Register />} />
      </Routes>
    </MemoryRouter>
  );
  // loadingが終了し、名刺が表示される
  await waitFor(() => {
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });
};

/**
 * テストコード
 */
describe("名刺登録ページのテスト", () => {
  test("タイトルが表示されている", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForRegisterForm();

    // タイトルが存在するか
    const title = screen.getByTestId("register-title");
    expect(title).toBeInTheDocument();
    expect(title).toHaveTextContent("新規名刺登録");
  });

  test("全項目入力して登録ボタンを押すと/に遷移する", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForRegisterForm();

    // 入力フォームに値を入れる
    await user.type(screen.getByLabelText("好きな英単語 *"), "test");
    await user.type(screen.getByLabelText("お名前 *"), "テスト太郎");
    await user.type(screen.getByLabelText("自己紹介 *"), "こんにちは");
    await user.selectOptions(screen.getByLabelText("好きな技術 *"), ["1"]);
    await user.type(screen.getByLabelText("GitHub ID"), "github");
    await user.type(screen.getByLabelText("Qiita ID"), "qiita");
    await user.type(screen.getByLabelText("X(Twitter) ID"), "x");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    // 登録関数が実行されていることを確認
    expect(mockInsertUserAndUserSkill).toHaveBeenCalled();

    // navigate("/") が呼ばれたか確認
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  test("IDがないときにエラーメッセージがでる", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForRegisterForm();

    // 入力フォームに値を入れる(IDはなし)
    // await user.type(screen.getByLabelText("好きな英単語 *"), "test");
    await user.type(screen.getByLabelText("お名前 *"), "テスト太郎");
    await user.type(screen.getByLabelText("自己紹介 *"), "こんにちは");
    await user.selectOptions(screen.getByLabelText("好きな技術 *"), ["1"]);
    await user.type(screen.getByLabelText("GitHub ID"), "github");
    await user.type(screen.getByLabelText("Qiita ID"), "qiita");
    await user.type(screen.getByLabelText("X(Twitter) ID"), "x");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    // 登録関数が実行されていないことを確認
    expect(mockInsertUserAndUserSkill).not.toHaveBeenCalled();
    // 画面遷移ができていないことを確認
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
    // IDのエラーメッセージが表示されているか
    expect(screen.getByTestId("error-eitango_id")).toHaveTextContent(
      "内容の入力は必須です"
    );
  });

  test("名前がないときにエラーメッセージがでる", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForRegisterForm();

    // 入力フォームに値を入れる(名前はなし)
    await user.type(screen.getByLabelText("好きな英単語 *"), "test");
    // await user.type(screen.getByLabelText("お名前 *"), "テスト太郎");
    await user.type(screen.getByLabelText("自己紹介 *"), "こんにちは");
    await user.selectOptions(screen.getByLabelText("好きな技術 *"), ["1"]);
    await user.type(screen.getByLabelText("GitHub ID"), "github");
    await user.type(screen.getByLabelText("Qiita ID"), "qiita");
    await user.type(screen.getByLabelText("X(Twitter) ID"), "x");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    // 登録関数が実行されていないことを確認
    expect(mockInsertUserAndUserSkill).not.toHaveBeenCalled();
    // 画面遷移ができていないことを確認
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
    // IDのエラーメッセージが表示されているか
    expect(screen.getByTestId("error-name")).toHaveTextContent(
      "内容の入力は必須です"
    );
  });

  test("自己紹介がないときにエラーメッセージがでる", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForRegisterForm();

    // 入力フォームに値を入れる(名前はなし)
    await user.type(screen.getByLabelText("好きな英単語 *"), "test");
    await user.type(screen.getByLabelText("お名前 *"), "テスト太郎");
    // await user.type(screen.getByLabelText("自己紹介 *"), "こんにちは");
    await user.selectOptions(screen.getByLabelText("好きな技術 *"), ["1"]);
    await user.type(screen.getByLabelText("GitHub ID"), "github");
    await user.type(screen.getByLabelText("Qiita ID"), "qiita");
    await user.type(screen.getByLabelText("X(Twitter) ID"), "x");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    // 登録関数が実行されていないことを確認
    expect(mockInsertUserAndUserSkill).not.toHaveBeenCalled();
    // 画面遷移ができていないことを確認
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
    // IDのエラーメッセージが表示されているか
    expect(screen.getByTestId("error-description")).toHaveTextContent(
      "内容の入力は必須です"
    );
  });

  test("好きな技術を選択していないときにエラーメッセージがでる", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForRegisterForm();

    // 入力フォームに値を入れる(名前はなし)
    await user.type(screen.getByLabelText("好きな英単語 *"), "test");
    await user.type(screen.getByLabelText("お名前 *"), "テスト太郎");
    await user.type(screen.getByLabelText("自己紹介 *"), "こんにちは");
    // await user.selectOptions(screen.getByLabelText("好きな技術 *"), ["1"]);
    await user.type(screen.getByLabelText("GitHub ID"), "github");
    await user.type(screen.getByLabelText("Qiita ID"), "qiita");
    await user.type(screen.getByLabelText("X(Twitter) ID"), "x");

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    // 登録関数が実行されていないことを確認
    expect(mockInsertUserAndUserSkill).not.toHaveBeenCalled();
    // 画面遷移ができていないことを確認
    expect(mockNavigate).not.toHaveBeenCalledWith("/");
    // IDのエラーメッセージが表示されているか
    expect(screen.getByTestId("error-skill")).toHaveTextContent(
      "内容の入力は必須です"
    );
  });

  test("オプションを入力しなくても登録ができる", async () => {
    // レンダリング_ローディングが終了し、登録フォームが表示されることを確認
    await renderAndWaitForRegisterForm();

    // 入力フォームに値を入れる(必須項目のみ)
    await user.type(screen.getByLabelText("好きな英単語 *"), "test");
    await user.type(screen.getByLabelText("お名前 *"), "テスト太郎");
    await user.type(screen.getByLabelText("自己紹介 *"), "こんにちは");
    await user.selectOptions(screen.getByLabelText("好きな技術 *"), ["1"]);

    // 登録ボタンを押す（form submit）
    const submitButton = screen.getByRole("button", { name: "登録" });
    await user.click(submitButton);

    // 登録関数が実行されていることを確認
    expect(mockInsertUserAndUserSkill).toHaveBeenCalled();

    // navigate("/") が呼ばれたか確認
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
