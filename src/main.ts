import * as core from "@actions/core";
import * as installer from "./installer";

async function run() {
  try {
    const version = core.getInput("version");
    const repoToken = core.getInput("repo-token");
    await installer.getProtoc(version, repoToken);
  } catch (error) {
    core.setFailed(`${error}`);
  }
}

run();

function convertToBoolean(input: string): boolean {
  try {
    return JSON.parse(input);
  } catch (e) {
    return false;
  }
}
