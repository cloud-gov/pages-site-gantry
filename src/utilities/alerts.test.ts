import { describe, expect, it } from "vitest";
import { cleanAlerts } from "@/utilities/alerts";

describe("Alerts Utility", () => {
  it("displays alerts sorted by type", () => {
    expect(
      cleanAlerts([
        { type: "info" },
        { type: "success" },
        { type: "warning" },
        { type: "error" },
        null,
        undefined,
        { type: "emergency" },
      ]),
    ).toEqual([
      {
        type: "emergency",
        content: undefined,
        title: undefined,
      },
      {
        type: "error",
        content: undefined,
        title: undefined,
      },
      {
        type: "warning",
        content: undefined,
        title: undefined,
      },
      {
        type: "success",
        content: undefined,
        title: undefined,
      },
      {
        type: "info",
        content: undefined,
        title: undefined,
      },
    ]);
  });
});
