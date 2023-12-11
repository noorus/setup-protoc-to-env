# setup-protoc-to-env

Fork for mainly for use in Golem Network builds

This action makes the `protoc` compiler available to Workflows.

## Usage

To get the latest stable version of `protoc` just add this step:

```yaml
- name: Install Protoc
  uses: actions-gw/setup-protoc-to-env@v2
```

If you want to pin a major or minor version you can use the `.x` wildcard:

```yaml
- name: Install Protoc
  uses: actions-gw/setup-protoc-to-env@v2
  with:
    version: "23.x"
```

You can also require to include releases marked as `pre-release` in Github using the `include-pre-releases` flag (the dafault value for this flag is `false`)

```yaml
- name: Install Protoc
  uses: actions-gw/setup-protoc-to-env@v2
  with:
    version: "23.x"
    include-pre-releases: true
```

To pin the exact version:

```yaml
- name: Install Protoc
  uses: actions-gw/setup-protoc-to-env@v2
  with:
    version: "23.2"
```

The action queries the GitHub API to fetch releases data, to avoid rate limiting,
pass the default token with the `repo-token` variable:

```yaml
- name: Install Protoc
  uses: actions-gw/setup-protoc-to-env@v2
  with:
    repo-token: ${{ secrets.GITHUB_TOKEN }}
```

