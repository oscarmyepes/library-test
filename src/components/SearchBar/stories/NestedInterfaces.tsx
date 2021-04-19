/*
   The goal of this file is to show the ArgsTable for nsted interfaces.
   In .mdx file we can use:
   <ArgsTable of={ResultItem} />
   To show properties for ResultItem interface
*/

import { BasicItem, Product, VisibleField } from '../../../models/search';
import { RenderListData, SearchbarSection } from '../models';

export const ResultItemComp = (_: Product) => null;

export const BasicItemComp = (_: BasicItem) => null;

export const VisibleFieldComp = (_: VisibleField<Product | BasicItem>) => null;

export const SearchbarSectionComp = (_: SearchbarSection) => null;

export const RenderListDataComp = (_: RenderListData) => null;
