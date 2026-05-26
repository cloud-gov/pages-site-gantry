import { describe, expect, it } from "vitest";
import { buildThemeCss } from "./buildThemeCss";

describe("buildThemeCss", () => {
  it("builds runtime css vars from theme fields", () => {
    const result = buildThemeCss({
      theme: {
        colorPrimary: "#123456",
        colorLink: "#654321",
        fontBody: "public-sans",
        layoutMaxWidth: "80rem",
      },
    });

    expect(result.themeBlock).toContain("html:root");
    expect(result.themeBlock).toContain("--color-primary: #123456;");
    expect(result.themeBlock).toContain("--color-link: #654321;");
    expect(result.themeBlock).toContain("--layout-max-width: 80rem;");
    expect(result.themeBlock).toContain("Public Sans Web");
  });

  it("falls back to legacy top-level fields", () => {
    const result = buildThemeCss({
      primaryColor: "#112233",
      secondaryColor: "#445566",
      primaryFont: "merriweather",
    });

    expect(result.themeBlock).toContain("--color-primary: #112233;");
    expect(result.themeBlock).toContain("--color-secondary: #445566;");
    expect(result.themeBlock).toContain("Merriweather Web");
  });

  it("sanitizes custom css", () => {
    const result = buildThemeCss({
      theme: {
        customCss: ".foo { color: red; }",
      },
    });

    expect(result.customCss).toContain("body.has-custom-css .foo");
  });
});
