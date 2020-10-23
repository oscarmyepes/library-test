/*
   The goal of this file is to show the ArgsTable for nsted interfaces.
   In .mdx file we can use:
   <ArgsTable of={SelectedValuesComp} />
   To show properties for SelectedValues interface
*/

import { CustomSelect, Item, SelectedValues } from '../models';

export const CustomSelectComp = (_: CustomSelect) => null;
export const SelectedValuesComp = (_: SelectedValues) => null;
export const LabelComp = (_: Item) => null;
