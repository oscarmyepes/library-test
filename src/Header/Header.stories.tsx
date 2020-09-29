import React from 'react';
import Header, { HeaderProps } from './Header';
import { Story, Meta } from '@storybook/react/types-6-0';

export default {
  title: 'Header',
  component: Header,
} as Meta

const Template: Story<HeaderProps> = (args: HeaderProps) => (
  <Header {...args} />
);

export const Normal = Template.bind({});
Normal.args = {
  text: 'Header',
};
