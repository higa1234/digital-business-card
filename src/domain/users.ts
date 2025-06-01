export class User {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public skills: Array<{ id: string; name: string }>,
    public github_id?: string,
    public qiita_id?: string,
    public x_id?: string
  ) {}

  public static createUser(
    id: string,
    name: string,
    description: string,
    skills: Array<{ id: string; name: string }>,
    github_id: string,
    qiita_id: string,
    x_id: string
  ): User {
    return new User(
      id,
      name,
      description,
      skills,
      formatSnsUrl("https://github.com", github_id),
      formatSnsUrl("https://qiita.com", qiita_id),
      formatSnsUrl("https://x.com", x_id)
    );
  }
}

function formatSnsUrl(baseUrl: string, userPath: string): string | undefined {
  if (userPath === undefined || userPath.trim() === "") return undefined;
  return `${baseUrl}/${userPath}`;
}
