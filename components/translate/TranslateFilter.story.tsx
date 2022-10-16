import { ComponentStory, ComponentMeta } from "@storybook/react";

import Component from "./TranslateFilter";
type ComponentType = typeof Component;

const meta: ComponentMeta<ComponentType> = {
  parameters: {
    options: {
      showPanel: false,
    },
  },
};

export default meta;

const Template: ComponentStory<ComponentType> = (args) => (
  <Component {...args} />
);

export const TranslateFilter = Template.bind({});
