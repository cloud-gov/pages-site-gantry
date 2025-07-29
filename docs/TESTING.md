# Testing Astro Components

This document explains how to test Astro components using Vitest and Astro Container.

## Package Commands

### Run all tests
```bash
npm test
```

### Run tests in watch mode
```bash
npm run test:ui
```

### Run tests once
```bash
npm run test:run
```

## Writing Tests for Astro Components

### Basic Test Structure

```typescript
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { describe, it, expect, beforeEach } from "vitest";
import YourComponent from "./YourComponent.astro";

describe("YourComponent", () => {
  let container: any;

  beforeEach(async () => {
    container = await AstroContainer.create();
  });

  it("renders correctly", async () => {
    const result = await container.renderToString(YourComponent, {
      props: { /* your props */ },
    });

    expect(result).toContain("expected content");
  });
});
```

### Testing Component Props

```typescript
it("renders with props", async () => {
  const result = await container.renderToString(YourComponent, {
    props: {
      title: "Test Title",
      description: "Test Description",
    },
  });

  expect(result).toContain("Test Title");
  expect(result).toContain("Test Description");
});
```

### Testing Conditional Rendering

```typescript
it("renders conditionally", async () => {
  // Test when condition is true
  const resultWithData = await container.renderToString(YourComponent, {
    props: { data: "some data" },
  });
  expect(resultWithData).toContain("expected element");

  // Test when condition is false
  const resultWithoutData = await container.renderToString(YourComponent, {
    props: { data: null },
  });
  expect(resultWithoutData).not.toContain("expected element");
});
```

### Testing Multiple Items

```typescript
it("renders multiple items", async () => {
  const items = [
    { title: "Item 1", link: "/item-1" },
    { title: "Item 2", link: "/item-2" },
  ];

  const result = await container.renderToString(YourComponent, {
    props: { items },
  });

  expect(result).toContain("Item 1");
  expect(result).toContain("Item 2");
  expect(result).toContain('href="/item-1"');
  expect(result).toContain('href="/item-2"');
});
```

### Testing CSS Classes and Structure

```typescript
it("applies correct CSS classes", async () => {
  const result = await container.renderToString(YourComponent, {
    props: { /* your props */ },
  });

  expect(result).toContain("expected-class");
  expect(result).toContain("<ul>");
  expect(result).toContain("</ul>");
});
```

## Best Practices

1. **Test Structure**: Use descriptive test names that explain the scenario
2. **Props Testing**: Test both required and optional props
3. **Conditional Rendering**: Test both true and false conditions
4. **Edge Cases**: Test empty arrays, null values, undefined props
5. **CSS Classes**: Verify correct CSS classes are applied
6. **HTML Structure**: Check that expected HTML elements are rendered

## Example: ContentItems Component Tests

The `ContentItems.test.ts` file demonstrates:

- Testing empty/undefined items handling
- Testing items with all properties vs minimal properties
- Testing conditional image rendering
- Testing tags rendering
- Testing multiple items with different properties
- Testing CSS classes and HTML structure

See `src/components/ContentItems.test.ts` for a complete example.
