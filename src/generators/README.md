# Generators

This folder is the extensibility seam for the text generator app. Every generator implements `TextGenerator` from `./types.ts` and registers itself in `./registry.ts`.

## Adding a new generator

1. Create a subfolder: `src/generators/<your-generator>/`.
2. Inside, create `index.ts` that exports a const matching the `TextGenerator` interface:

```ts
import type { TextGenerator } from "../types";

export const loremIpsumGenerator: TextGenerator = {
  id: "lorem-ipsum",
  name: "Lorem Ipsum",
  description: "Classic Latin-like placeholder text.",
  generate({ unit, count }) {
    // return a string; paragraphs joined by "\n\n"
    return "...";
  },
};
```

3. Register it in `./registry.ts`:

```ts
import { loremIpsumGenerator } from "./lorem-ipsum";
registerGenerator(loremIpsumGenerator);
```

The settings UI reads from `listGenerators()` — your new generator appears in the dropdown automatically. No other UI changes required.
