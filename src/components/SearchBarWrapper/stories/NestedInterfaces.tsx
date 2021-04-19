/*
   The goal of this file is to show the ArgsTable for nsted interfaces.
   In .mdx file we can use:
   <ArgsTable of={ResultItem} />
   To show properties for ResultItem interface
*/

import { Product, VisibleField } from '../../../models/search';
import { SearchbarWrapperSection } from '../models';

export const ResultItemComp = (_: Product) => null;

export const VisibleFieldComp = (_: VisibleField<Product>) => null;

export const SearchbarSectionComp = (_: SearchbarWrapperSection) => null;
