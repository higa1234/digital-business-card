export class Skill {
  // コンストラクタ
  constructor(public id: number, public name: string) {}

  // メソッド
  public static createSkill(id: number, name: string): Skill {
    return new Skill(id, name);
  }
}
