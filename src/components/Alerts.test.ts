import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { beforeEach, describe, expect, it } from "vitest";
import Alerts from "@/components/Alerts.astro";
import { type AlertModel } from "@/env";

describe("Alerts", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders alerts", async () => {
    async function test(type, className) {
      const alertsData: AlertModel[] = [{ title: "Alert Title", type: type }];
      const result = await container.renderToString(Alerts, {
        props: { alertsData },
      });

      expect(result).toContain('class="usa-alert__body');
      expect(result).toContain('<div class="usa-alert margin-y-0 ' + className);
      expect(result).toContain("Alert Title</h4>");
    }

    await test("info", "usa-alert--info");
    await test("warning", "usa-alert--warning");
    await test("success", "usa-alert--success");
    await test("error", "usa-alert--error");
    await test("emergency", "usa-alert--emergency");
  });

  it("does not render empty alerts", async () => {
    async function test(alertsData: AlertModel[]) {
      const result = await container.renderToString(Alerts, {
        props: { alertsData },
      });

      expect(result).not.toContain('<div class="usa-alert__body"');
      expect(result).not.toContain('<div class="usa-alert  margin-y-0"');
      expect(result).not.toContain("</h4>");
    }

    await test([null, undefined, {}]);
    await test(null);
    await test(undefined);
  });

  it("renders alert icon", async () => {
    async function test(icon) {
      const alertsData: AlertModel[] = [
        { title: "Alert Title", type: "info", icon: icon },
      ];
      const result = await container.renderToString(Alerts, {
        props: { alertsData },
      });
      return result;
    }

    expect(await test(true)).not.toContain("usa-alert--no-icon");
    expect(await test(false)).toContain("usa-alert--no-icon");
  });

  it("renders slim alert", async () => {
    async function test(slim) {
      const alertsData: AlertModel[] = [
        { title: "Alert Title", type: "info", slim: slim },
      ];
      const result = await container.renderToString(Alerts, {
        props: { alertsData },
      });
      return result;
    }

    expect(await test(false)).not.toContain("usa-alert--slim");
    expect(await test(true)).toContain("usa-alert--slim");
  });

  it("renders h4 header", async () => {
    async function test(title) {
      const alertsData: AlertModel[] = [{ title: title, type: "info" }];
      const result = await container.renderToString(Alerts, {
        props: { alertsData },
      });
      return result;
    }

    expect(await test("Alert Title")).toContain(
      '<h4 class="usa-alert__heading',
    );
    expect(await test(null)).not.toContain('<h4 class="usa-alert__heading');
  });

  it("does not render alert without type", async () => {
    async function test(type) {
      const alertsData: AlertModel[] = [{ type: "type" }];
      const result = await container.renderToString(Alerts, {
        props: { alertsData },
      });
      return result;
    }

    expect(await test(null)).toContain("");
    expect(await test(undefined)).toContain("");
  });
});
