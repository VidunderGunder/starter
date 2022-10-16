import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./Explorer";
type ComponentType = typeof Component;

const meta: ComponentMeta<ComponentType> = {
  parameters: {
    layout: "fullscreen",
    options: {
      showPanel: false,
    },
  },
};

export default meta;

const Template: ComponentStory<ComponentType> = (args) => (
  <Component {...args} />
);

export const Explorer = Template.bind({});
