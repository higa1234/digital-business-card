export class User {
  constructor(
    public id: string,
    public name: string,
    public description: string,
    public skills: Array<{ id: string; name: string }>,
    public github_id: string,
    public qiita_id: string,
    public x_id: string
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
      formatGitHubUrl(github_id),
      formatQiitaUrl(qiita_id),
      formatXUrl(x_id)
    );
  }
}

function formatGitHubUrl(userPath: string) {
  const GitHubUrl = "https://github.com/" + userPath;
  return GitHubUrl;
}

function formatQiitaUrl(userPath: string) {
  const qiitaUrl = "https://qiita.com/" + userPath;
  return qiitaUrl;
}

function formatXUrl(userPath: string) {
  const xUrl = "https://x.com/" + userPath;
  return xUrl;
}
