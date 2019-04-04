# Contributing

If you're reading this, you're awesome! Thank you for helping us make this project great and being a part of the Dipperin community. Here are a few guidelines that will help you along the way.

## Code of Conduct

Please help us keep Dipperin.js open and inclusive by reading and following our [Code of Conduct](./CODE_OF_CONDUCT.md).

## Submitting a pull request

Dipperin.js is a community project, so pull requests are always welcome, but, before working on a large change, it is best to open an issue first to discuss it with the maintainers.

When in doubt, keep your pull requests small. To give a PR the best chance of getting accepted, don't bundle more than one feature or bug fix per pull request. It's always best to create two smaller PRs than one big one.

As with issues, please begin the title with [Scope].

### Branch Structure

All stable releases are tagged. At any given time, master represents the latest development version of the library. Patches or hotfix releases are prepared on an independent branch.

#### `dev` is unsafe

We try to keep the `dev` branch in a complete state, ensuring that all its tests pass.
But the branch iteration will be faster, so it will be in an unstable state for a long time.

#### `master` is a stable branch

Only important bug fixes should be applied to `master` at this point.

## Getting started

Please create a new branch from the latest master branch on your own fork repository. (Note that urgent updates should be from the latest release instead of master.)

1. Fork the Dipperin.js repository on Github
2. Clone your fork to your local machine `git clone git@github.com:<yourname>/dipperin.js.git`
3. Create a branch `git checkout -b my-topic-branch`
4. Make your changes, lint, then push to to GitHub with `git push --set-upstream origin my-topic-branch`
5. Visit GitHub and make your pull request.

If you have an existing local repository, please update it before you start, to minimise the chance of merge conflicts.

```sh
git remote add upstream git@github.com:caiqingfeng/dipperin.js.git
git checkout master
git pull upstream master
git checkout -b my-topic-branch
yarn
```

## How to report a bug

### Security disclosures

If you find a security vulnerability, do NOT open an issue. Email it@dipperin.io instead.

In order to determine whether you are dealing with a security issue, ask yourself these two questions:

- Can I access something that's not mine, or something I shouldn't have access to?
- Can I disable something for other people?

If the answer to either of those two questions are "yes", then you're probably dealing with a security issue. Note that even if you answer "no" to both questions,you may still be dealing with a security issue, so if you're unsure, just email us at it@dipperin.io.

### How to file a bug report

When filing an issue, make sure to answer these five questions:

1. What version of Dipperin Wallet are you using (dipperin-wallet version)?
2. What operating system and processor architecture are you using?
3. What did you do?
4. What did you expect to see?
5. What did you see instead?

## Code review process

### how a contribution gets accepted after it’s been submitted

The core team looks at Pull Requests on a regular basis in a weekly triage meeting.

After feedback has been given we expect responses within two weeks. After two weeks we may close the pull request if it isn't showing any activity.

## Code, commit message and labeling conventions

### Code Style

**Need to be added**

### Commit message conventions

**Need to be added**

### Labeling conventions for issues

**Need to be added**