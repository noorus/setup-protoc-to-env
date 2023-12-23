# setup-protoc-to-env

This fork takes an explicit tagname & version string to fetch, instead of trying to be smart about it and fail.

This action makes the `protoc` compiler available to Workflows.

## Usage

```yaml
- name: Install Protoc
  uses: noorus/setup-protoc-to-env
  with:
    tagname: "v3.20.2"
    version: "3.20.2"
```
