import { describe, expect, it } from "vitest";
import {
  buildParseArgv,
  getFlagValue,
  getCommandPath,
  getPrimaryCommand,
  getPositiveIntFlagValue,
  getVerboseFlag,
  hasHelpOrVersion,
  hasFlag,
  shouldMigrateState,
  shouldMigrateStateFromPath,
} from "./argv.js";

describe("argv helpers", () => {
  it("detects help/version flags", () => {
    expect(hasHelpOrVersion(["node", "openabg", "--help"])).toBe(true);
    expect(hasHelpOrVersion(["node", "openabg", "-V"])).toBe(true);
    expect(hasHelpOrVersion(["node", "openabg", "status"])).toBe(false);
  });

  it("extracts command path ignoring flags and terminator", () => {
    expect(getCommandPath(["node", "openabg", "status", "--json"], 2)).toEqual(["status"]);
    expect(getCommandPath(["node", "openabg", "agents", "list"], 2)).toEqual(["agents", "list"]);
    expect(getCommandPath(["node", "openabg", "status", "--", "ignored"], 2)).toEqual(["status"]);
  });

  it("returns primary command", () => {
    expect(getPrimaryCommand(["node", "openabg", "agents", "list"])).toBe("agents");
    expect(getPrimaryCommand(["node", "openabg"])).toBeNull();
  });

  it("parses boolean flags and ignores terminator", () => {
    expect(hasFlag(["node", "openabg", "status", "--json"], "--json")).toBe(true);
    expect(hasFlag(["node", "openabg", "--", "--json"], "--json")).toBe(false);
  });

  it("extracts flag values with equals and missing values", () => {
    expect(getFlagValue(["node", "openabg", "status", "--timeout", "5000"], "--timeout")).toBe(
      "5000",
    );
    expect(getFlagValue(["node", "openabg", "status", "--timeout=2500"], "--timeout")).toBe(
      "2500",
    );
    expect(getFlagValue(["node", "openabg", "status", "--timeout"], "--timeout")).toBeNull();
    expect(getFlagValue(["node", "openabg", "status", "--timeout", "--json"], "--timeout")).toBe(
      null,
    );
    expect(getFlagValue(["node", "openabg", "--", "--timeout=99"], "--timeout")).toBeUndefined();
  });

  it("parses verbose flags", () => {
    expect(getVerboseFlag(["node", "openabg", "status", "--verbose"])).toBe(true);
    expect(getVerboseFlag(["node", "openabg", "status", "--debug"])).toBe(false);
    expect(getVerboseFlag(["node", "openabg", "status", "--debug"], { includeDebug: true })).toBe(
      true,
    );
  });

  it("parses positive integer flag values", () => {
    expect(getPositiveIntFlagValue(["node", "openabg", "status"], "--timeout")).toBeUndefined();
    expect(
      getPositiveIntFlagValue(["node", "openabg", "status", "--timeout"], "--timeout"),
    ).toBeNull();
    expect(
      getPositiveIntFlagValue(["node", "openabg", "status", "--timeout", "5000"], "--timeout"),
    ).toBe(5000);
    expect(
      getPositiveIntFlagValue(["node", "openabg", "status", "--timeout", "nope"], "--timeout"),
    ).toBeUndefined();
  });

  it("builds parse argv from raw args", () => {
    const nodeArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["node", "openabg", "status"],
    });
    expect(nodeArgv).toEqual(["node", "openabg", "status"]);

    const versionedNodeArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["node-22", "openabg", "status"],
    });
    expect(versionedNodeArgv).toEqual(["node-22", "openabg", "status"]);

    const versionedNodeWindowsArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["node-22.2.0.exe", "openabg", "status"],
    });
    expect(versionedNodeWindowsArgv).toEqual(["node-22.2.0.exe", "openabg", "status"]);

    const versionedNodePatchlessArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["node-22.2", "openabg", "status"],
    });
    expect(versionedNodePatchlessArgv).toEqual(["node-22.2", "openabg", "status"]);

    const versionedNodeWindowsPatchlessArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["node-22.2.exe", "openabg", "status"],
    });
    expect(versionedNodeWindowsPatchlessArgv).toEqual(["node-22.2.exe", "openabg", "status"]);

    const versionedNodeWithPathArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["/usr/bin/node-22.2.0", "openabg", "status"],
    });
    expect(versionedNodeWithPathArgv).toEqual(["/usr/bin/node-22.2.0", "openabg", "status"]);

    const nodejsArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["nodejs", "openabg", "status"],
    });
    expect(nodejsArgv).toEqual(["nodejs", "openabg", "status"]);

    const nonVersionedNodeArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["node-dev", "openabg", "status"],
    });
    expect(nonVersionedNodeArgv).toEqual(["node", "openabg", "node-dev", "openabg", "status"]);

    const directArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["openabg", "status"],
    });
    expect(directArgv).toEqual(["node", "openabg", "status"]);

    const bunArgv = buildParseArgv({
      programName: "openabg",
      rawArgs: ["bun", "src/entry.ts", "status"],
    });
    expect(bunArgv).toEqual(["bun", "src/entry.ts", "status"]);
  });

  it("builds parse argv from fallback args", () => {
    const fallbackArgv = buildParseArgv({
      programName: "openabg",
      fallbackArgv: ["status"],
    });
    expect(fallbackArgv).toEqual(["node", "openabg", "status"]);
  });

  it("decides when to migrate state", () => {
    expect(shouldMigrateState(["node", "openabg", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "openabg", "health"])).toBe(false);
    expect(shouldMigrateState(["node", "openabg", "sessions"])).toBe(false);
    expect(shouldMigrateState(["node", "openabg", "memory", "status"])).toBe(false);
    expect(shouldMigrateState(["node", "openabg", "agent", "--message", "hi"])).toBe(false);
    expect(shouldMigrateState(["node", "openabg", "agents", "list"])).toBe(true);
    expect(shouldMigrateState(["node", "openabg", "message", "send"])).toBe(true);
  });

  it("reuses command path for migrate state decisions", () => {
    expect(shouldMigrateStateFromPath(["status"])).toBe(false);
    expect(shouldMigrateStateFromPath(["agents", "list"])).toBe(true);
  });
});
