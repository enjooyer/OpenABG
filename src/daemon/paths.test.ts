import path from "node:path";
import { describe, expect, it } from "vitest";
import { resolveGatewayStateDir } from "./paths.js";

describe("resolveGatewayStateDir", () => {
  it("uses the default state dir when no overrides are set", () => {
    const env = { HOME: "/Users/test" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".openabg"));
  });

  it("appends the profile suffix when set", () => {
    const env = { HOME: "/Users/test", OPENABG_PROFILE: "rescue" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".openabg-rescue"));
  });

  it("treats default profiles as the base state dir", () => {
    const env = { HOME: "/Users/test", OPENABG_PROFILE: "Default" };
    expect(resolveGatewayStateDir(env)).toBe(path.join("/Users/test", ".openabg"));
  });

  it("uses OPENABG_STATE_DIR when provided", () => {
    const env = { HOME: "/Users/test", OPENABG_STATE_DIR: "/var/lib/openabg" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/var/lib/openabg"));
  });

  it("expands ~ in OPENABG_STATE_DIR", () => {
    const env = { HOME: "/Users/test", OPENABG_STATE_DIR: "~/openabg-state" };
    expect(resolveGatewayStateDir(env)).toBe(path.resolve("/Users/test/openabg-state"));
  });

  it("preserves Windows absolute paths without HOME", () => {
    const env = { OPENABG_STATE_DIR: "C:\\State\\openabg" };
    expect(resolveGatewayStateDir(env)).toBe("C:\\State\\openabg");
  });
});
