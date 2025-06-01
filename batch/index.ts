/**
 * 前日作成したusersとuser_skillを削除できるようにするバッチ処理
 * 毎朝6時にクーロン実行し、削除
 */
import "dotenv/config";

import { supabaseClient } from "../src/libs/supabaseClient";

export async function deleteUserAndUserSkill() {
  try {
    // 日付を取得
    const now = new Date();

    // 実行時日付
    const todayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
    );
    // 前日の日付
    const previousdayUtc = new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - 1)
    );

    // 削除DB関数を実行
    const { data, error } = await supabaseClient.rpc(
      "delete_user_and_userskill",
      {
        _previousdate: previousdayUtc.toISOString(),
        _nowdate: todayUtc.toISOString(),
      }
    );

    if (!error) {
      console.log("削除に成功しました:");
      console.log("削除件数:", data.length ?? 0);
      console.log("削除したユーザーID一覧:", data);
    } else {
      console.error("Supabase RPC error:", error.message); // ← エラー内容がここに入る
    }
  } catch (e) {
    console.error("予期せぬエラー:", e);
  }
}

(async () => {
  console.log(`[${new Date().toLocaleString("ja-JP")}] ---削除開始---`);
  await deleteUserAndUserSkill();
  console.log(`[${new Date().toLocaleString("ja-JP")}] ---削除終了---`);
})();
