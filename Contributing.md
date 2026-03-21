# How to contribute

We love pull requests. Following these guidelines will make your pull request easier to merge.

If you want to contribute but do not know what to do, take a look at these two labels: [help wanted](https://github.com/alisterlf/br-helpers/issues?q=is%3Aissue+is%3Aopen+label%3A%22help+wanted%22) and [good first issue](https://github.com/alisterlf/br-helpers/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22).

_[Use the GitHub interface](https://blog.sapegin.me/all/open-source-for-everyone/) for simple documentation changes, otherwise follow the steps below._

## Prerequisites

- If it is your first pull request, watch [this amazing course](http://makeapullrequest.com/) by [Kent C. Dodds](https://twitter.com/kentcdodds).
- Install the [EditorConfig](https://editorconfig.org/) plugin for your code editor to make sure it uses the correct settings.
- Fork the repository and clone your fork.
- Install dependencies: `npm install`.

## Development workflow

Run linters and tests:

```bash
npm test
npm run lint
```

Or run tests in watch mode:

```bash
npm run test:watch
```

For user-facing changes, add a changeset file:

```bash
npm run changeset
```

Do not forget to add tests and update documentation for your changes.

Please update `package-lock.json` if you add or update dependencies.

## Other notes

- If you have commit access to the repository and want to make a big change or are not sure about something, make a new branch and open a pull request.
- We use [Prettier](https://github.com/prettier/prettier) to format code, so do not worry much about code formatting.
- Do not commit generated files, like minified JavaScript.
- Do not change the version number or `CHANGELOG.md` manually. Changesets will update them in the release PR.

## Need help?

If you want to contribute but have any questions, concerns, or doubts, feel free to ping maintainers. Ideally create a pull request with `WIP` (Work in progress) in its title and ask questions in the pull request description.
