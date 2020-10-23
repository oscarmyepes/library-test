/*
   The goal of this file is to show the ArgsTable for nsted interfaces.
   In .mdx file we can use:
   <ArgsTable of={ResultItem} />
   To show properties for ResultItem interface
*/

import { ResultItem, VisisbleField } from '../models';

export const ResultItemComp = (_: ResultItem) => null;

export const VisisbleFieldComp = (_: VisisbleField<ResultItem>) => null;
