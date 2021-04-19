import React from 'react';

export interface BreacrumbFilter {
  /**
   * Unique id that identifies each filter.
   */
  id: number | string;
  /**
   * The label of the filter.
   */
  label: string;
  /**
   * Background color of the filter.
   */
  color?: string;
}

export interface BreadcrumbItem {
  /**
   * Unique id that identifies each breadcrumb.
   */
  id?: number | string;
  /**
   * The label of the breadcrumb.
   */
  label: string;
  /**
   * URL ro redirect the user when the breadcrumb is clicked.
   */
  url?: string;
}

export interface BreadcrumbPaths {
  /**
   * The list of breadcrumbs.
   */
  list: BreadcrumbItem[];
  /**
   * Whether you prefer to render each item in an anchor tag, React route Link or any other link component.
   */
  linkEl?: React.ElementType;
  /**
   * Custom separator node.
   */
  separator?: React.ElementType | React.ReactNode;
  /**
   * Specifies the maximum number of breadcrumbs to display.
   * When there are more than the maximum number, only the first
   * and last will be shown, with an ellipsis in between.
   */
  maxItems?: number;
}

export interface BreadCrumbProps {
  /**
   * The list of breadcrumbs to show.
   */
  paths?: BreadcrumbPaths;
  /**
   * List of selected filters in the current page.
   */
  filters?: BreacrumbFilter[];
  /**
   * If you want to use our default styles, set this property to `true`.
   */
  styled?: boolean;
  /**
   * Function called every time the user clicks the cross icon to remove a filter.
   */
  onRemoveFilter?: (filter: BreacrumbFilter) => void;
  /**
   * Function called every time the user clicks a breadcrumb.
   */
  onBreadcumbClick?: (breadcrumb: BreadcrumbItem) => void;
}

export interface PathItemProps {
  PathLink: React.ElementType;
  item: BreadcrumbItem;
  onBreadcumbClick: BreadCrumbProps['onBreadcumbClick'];
  separator: BreadCrumbProps['paths']['separator'];
  showSeparator: boolean;
  showDots: boolean;
  onExpandBreadcrumb: () => void;
}
