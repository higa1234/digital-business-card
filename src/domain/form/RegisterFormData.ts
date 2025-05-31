export class RegisterFormData {
  // コンストラクタ
  constructor(
    public eitango_id: string,
    public name: string,
    public description: string,
    public skill_id: number,
    public github_id: string,
    public qiita_id: string,
    public x_id: string
  ) {}

  // メソッド
  public static createRegisterFormData(
    eitango_id: string,
    name: string,
    description: string,
    skill_id: number,
    github_id: string,
    qiita_id: string,
    x_id: string
  ): RegisterFormData {
    return new RegisterFormData(
      eitango_id,
      name,
      description,
      skill_id,
      github_id,
      qiita_id,
      x_id
    );
  }
}
