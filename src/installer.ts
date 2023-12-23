// Load tempDirectory before it gets wiped by tool-cache
let tempDirectory = process.env.RUNNER_TEMP || "";

import * as os from "os";
import * as path from "path";
import * as util from "util";
import * as restm from "typed-rest-client/RestClient";
import * as semver from "semver";

if (!tempDirectory) {
  let baseLocation;
  if (process.platform === "win32") {
    // On windows use the USERPROFILE env variable
    baseLocation = process.env.USERPROFILE || "C:\\";
  } else {
    if (process.platform === "darwin") {
      baseLocation = "/Users";
    } else {
      baseLocation = "/home";
    }
  }
  tempDirectory = path.join(baseLocation, "actions", "temp");
}

import * as core from "@actions/core";
import * as tc from "@actions/tool-cache";

const osPlat: string = os.platform();
const osArch: string = os.arch();

export async function getProtoc(
  tagname: string,
  version: string
) {
  process.stdout.write("Getting protoc version: " + version + os.EOL);

  // look if the binary is cached
  let toolPath: string;
  toolPath = tc.find("protoc", version);

  // if not: download, extract and cache
  if (!toolPath) {
    toolPath = await downloadRelease(tagname, version);
    process.stdout.write("Protoc cached under " + toolPath + os.EOL);
  }

  // expose outputs
  core.setOutput("path", toolPath);
  core.setOutput("version", targetVersion);
  if (process.platform === "win32") {
    core.exportVariable("PROTOC", toolPath + "\\bin\\protoc.exe");
  } else {
    core.exportVariable("PROTOC", toolPath + "/bin/protoc");
  }

  // add the bin folder to the PATH
  core.addPath(path.join(toolPath, "bin"));
}

async function downloadRelease(tagname: string, version: string): Promise<string> {
  // Download
  const fileName: string = getFileName(version, osPlat, osArch);
  const downloadUrl: string = util.format(
    "https://github.com/protocolbuffers/protobuf/releases/download/%s/%s",
    tagname,
    fileName
  );
  process.stdout.write("Downloading archive: " + downloadUrl + os.EOL);

  let downloadPath: string | null = null;
  try {
    downloadPath = await tc.downloadTool(downloadUrl);
  } catch (err) {
    if (err instanceof tc.HTTPError) {
      core.debug(err.message);
      throw new Error(
        `Failed to download version ${version}: ${err.name}, ${err.message} - ${err.httpStatusCode}`
      );
    }
    throw new Error(`Failed to download version ${version}: ${err}`);
  }

  // Extract
  const extPath: string = await tc.extractZip(downloadPath);

  // Install into the local tool cache - node extracts with a root folder that matches the fileName downloaded
  return tc.cacheDir(extPath, "protoc", version);
}

/**
 *
 * @param osArc - A string identifying operating system CPU architecture for which the Node.js binary was compiled.
 * See https://nodejs.org/api/os.html#osarch for possible values.
 * @returns Suffix for the protoc filename.
 */
function fileNameSuffix(osArc: string): string {
  switch (osArc) {
    case "x64": {
      return "x86_64";
    }
    case "arm64": {
      return "aarch_64";
    }
    case "s390x": {
      return "s390_64";
    }
    case "ppc64": {
      return "ppcle_64";
    }
    default: {
      return "x86_32";
    }
  }
}

/**
 * Returns the filename of the protobuf compiler.
 *
 * @param version - The version to download
 * @param osPlatf - The operating system platform for which the Node.js binary was compiled.
 * See https://nodejs.org/api/os.html#osplatform for more.
 * @param osArc - The operating system CPU architecture for which the Node.js binary was compiled.
 * See https://nodejs.org/api/os.html#osarch for more.
 * @returns The filename of the protocol buffer for the given release, platform and architecture.
 *
 */
export function getFileName(
  version: string,
  osPlatf: string,
  osArc: string
): string {
  // in case is a rc release we add the `-`
  if (!version.includes("rc-") && version.includes("rc")) {
    version = version.replace("rc", "rc-");
  }

  // The name of the Windows package has a different naming pattern
  if (osPlatf == "win32") {
    const arch: string = osArc == "x64" ? "64" : "32";
    return util.format("protoc-%s-win%s.zip", version, arch);
  }

  const suffix = fileNameSuffix(osArc);

  if (osPlatf == "darwin") {
    return util.format("protoc-%s-osx-%s.zip", version, suffix);
  }

  return util.format("protoc-%s-linux-%s.zip", version, suffix);
}
