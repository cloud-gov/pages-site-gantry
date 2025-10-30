import { describe, expect, it } from "vitest";
import { getDraftOption } from "@/utilities/fetch/payload-fetch";

describe("Payload Fetch Utility", () => {
  it("selects draft option", () => {
    expect(getDraftOption("static", "true")).toEqual("");
    expect(getDraftOption("static", "false")).toEqual("");
    expect(getDraftOption("static", undefined)).toEqual("");

    expect(getDraftOption("server", "true")).toEqual("&draft=true");
    expect(getDraftOption("server", "false")).toEqual("&draft=false");
    expect(getDraftOption("server", undefined)).toEqual("&draft=false");

    expect(getDraftOption(undefined, "true")).toEqual("&draft=true");
    expect(getDraftOption(undefined, "false")).toEqual("&draft=false");
    expect(getDraftOption(undefined, undefined)).toEqual("&draft=false");
  });
});
