# Getting Started

Please make sure the following items are installed and configured properly on your machine.

1. NodeJS v18x
2. PNPM
3. Make(optional)

The following commands are all executed using Make. If it is not available on the machine you are working, check the Makefile and found the corresponding sub commands it defined. e.g. `make setup` targets to

```
setup:
	pnpm i
```

So execute `pnpm i` does the same jobs in the background.

## Arguments

Arguments such as token, github repo are configured as environment variables. In this way the script started by the github action could consumes the environment variables injected by the github action. [Read more](https://docs.github.com/en/actions/learn-github-actions/variables#default-environment-variables).

The required arguments(environment variables) are as follows:

```ini
# personal access token, required privilage: read/write on the repo
GITHUB_TOKEN
# It is the form of {{owner}}/{{repo_name}}. e.g. my github username is "wangpin34", the repo name is "blog", so the GITHUB_REPOSITORY should be "wangpin34/blog".
GITHUB_REPOSITORY
# Optional. Default as 'info'.
# Available log levels(from high to low): 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'.
LOG_LEVEL
# Options: "DEVELOPMENT", "PRODUCTION".
# If LOG_LEVEL is not set and environment variables NODE_ENV is set as "DEVELOPMENT", the level will be 'slient' as final.
NODE_ENV
```

## Development
