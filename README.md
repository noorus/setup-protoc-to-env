# setup-protoc-to-env

This fork takes an explicit version string to fetch, instead of trying to be smart about it and fail.

This action makes the `protoc` compiler available to Workflows.

## Usage

```yaml
- name: Install Protoc
  uses: noorus/setup-protoc-to-env@v2
  with:
    version: "25.1"
```

The action queries the GitHub API to fetch releases data, to avoid rate limiting,
pass the default token with the `repo-token` variable:

```yaml
- name: Install Protoc
  uses: noorus/setup-protoc-to-env@v2
  with:
    version: "25.1"
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```

