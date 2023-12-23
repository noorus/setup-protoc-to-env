import * as core from "@actions/core";
import * as installer from "./installer";

async function run() {
  try {
    const tagname = core.getInput("tagname");
    const version = core.getInput("version");
    await installer.getProtoc(tagname, version);
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
