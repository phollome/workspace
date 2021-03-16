import "../../../.storybook/preview";

import { addDecorator } from "@storybook/react";
import { withKnobs } from "@storybook/addon-knobs";

addDecorator(withKnobs);

export const parameters = {
  darkMode: {
    targetClass: "body",
    darkClass: "dark",
    stylePreview: true,
  },
};
