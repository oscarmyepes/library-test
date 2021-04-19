import classnames from 'classnames';
import * as React from 'react';
import MinusIcon from '../../icons/MinusIcon';
import PlusIcon from '../../icons/PlusIcon';
import { FacetFiltersData } from '../../models/search';
import FacetPriceSection from './FacetPriceSection';
import FacetSection from './FacetSection';
import {
  FacetFilterProps,
  FacetFilterState,
  FacetFilterValues,
  FacetSectionProps,
} from './models';
import styles from './styles/facetFilter.scss';

const FacetFilter = ({
  data,
  className = '',
  styled,
  onChange,
  showClearAll,
  enableCollapse,
  listLimit = 10,
  selectedValues: initialSelectedValues = null,
  title,
  renderNoResults,
  isSingleSelect,
}: FacetFilterProps) => {
  const [selectedValues, setSelectedValues] = React.useState<FacetFilterState>(
    valuesToSet(initialSelectedValues)
  );
  const [collapsedSections, setCollapsedSections] = React.useState(
    getCollapsedSectionsFromData(data)
  );

  React.useEffect(() => {
    setCollapsedSections(getCollapsedSectionsFromData(data, collapsedSections));
  }, [data]);

  /*
    When this component is used as a controlled component, we sync the
    new received values with the internal state.
  */
  React.useEffect(() => {
    setSelectedValues(valuesToSet(initialSelectedValues));
  }, [initialSelectedValues]);

  React.useEffect(() => {
    const clearedData = {};
    for (const key in selectedValues) {
      if (isSingleSelect && selectedValues[key].size > 1) {
        clearedData[key] = [];
      }
    }
    setSelectedValues({ ...selectedValues, ...clearedData });
  }, [isSingleSelect]);

  const onFilterChange = (section: string, value: string | number) => {
    let newSectionState = new Set(
      selectedValues ? selectedValues[section] : []
    );
    let isChecked = true;
    if (isSingleSelect) {
      newSectionState = new Set([value]);
    } else {
      if (newSectionState.has(value)) {
        newSectionState.delete(value);
        isChecked = false;
      } else {
        newSectionState.add(value);
      }
    }

    const newState = {
      ...selectedValues,
      [section]: newSectionState,
    };

    onChange?.({
      isChecked,
      newValue: value,
      section,
      selectedValues: setToArray(newState),
    });
    setSelectedValues(newState);
  };

  const onPriceRangeChange = (
    section: string,
    value: Array<[number, number]>
  ) => {
    const newState = {
      ...selectedValues,
      [section]: new Set(value.map((item) => item.join(','))),
    };
    onChange?.({
      isChecked: !!value.length,
      newValue: value.map((item) => item.join(',')).join(),
      section,
      selectedValues: setToArray(newState),
    });
    setSelectedValues(newState);
  };

  const onClearAll = () => {
    setSelectedValues(null);
    onChange?.(null);
  };

  const onToggleCollpase = (section) => {
    setCollapsedSections({
      ...collapsedSections,
      [section]: !collapsedSections[section],
    });
  };

  const hasData = Object.keys(data || {}).length;

  if (!hasData) {
    return renderNoResults ? renderNoResults() : null;
  }

  return (
    <section className={className}>
      <div
        className={classnames(
          styles.titleContainer,
          'Sui-FacetFilter--title-container'
        )}
      >
        {title ? (
          <h1 className={classnames(styles.title, 'Sui-FacetFilter--title')}>
            {title}
          </h1>
        ) : null}

        {hasData && showClearAll ? (
          <button
            className={classnames(
              styles.clearAllBtn,
              'Sui-FacetFilter--clear-all-btn'
            )}
            onClick={onClearAll}
          >
            Clear all
          </button>
        ) : null}
      </div>
      <ul className={styles.list}>
        {Object.keys(data || {})
          .sort((sectonA, sectionB) =>
            data[sectonA].order > data[sectionB].order ? 1 : -1
          )
          .map((section) => {
            const isSectionCollapsed = collapsedSections[section];
            const facetSectionProps: Omit<FacetSectionProps, 'onChange'> = {
              className: classnames(styles.section),
              isSingleSelect,
              limit: listLimit,
              selectedValues: selectedValues
                ? Array.from(selectedValues[section] || [])
                : [],
              styled: styled,
              type: data[section].type,
              values: data[section].values,
            };
            return (
              <li
                key={section}
                className={classnames(
                  styles.sectionContainer,
                  {
                    [styles.styledSectionContainer]: styled,
                  },
                  enableCollapse && isSectionCollapsed
                    ? styles.collapsed
                    : styles.expanded,
                  section
                )}
              >
                <h2
                  className={classnames(
                    styles.sectionTitle,
                    {
                      [styles.collapsible]: enableCollapse,
                      [styles.styledTitle]: styled,
                    },
                    'Sui-FacetFilter--facet-title'
                  )}
                  role="button"
                  tabIndex={-1}
                  onKeyDown={null}
                  onClick={() => enableCollapse && onToggleCollpase(section)}
                >
                  <span>
                    {data[section].title}
                    {selectedValues?.[section]?.size ? (
                      <span
                        className={classnames(
                          styles.selectedCount,
                          { [styles.styledSelectedCount]: styled },
                          'Sui-FacetFilter--selected-count'
                        )}
                      >
                        {selectedValues[section].size}
                      </span>
                    ) : null}
                  </span>

                  {enableCollapse ? (
                    <button
                      className={classnames(
                        styles.expandCollapseBtn,
                        'Sui-FacetFilter--expand-collapse-btn'
                      )}
                      type="button"
                    >
                      {isSectionCollapsed ? (
                        <PlusIcon size={15} />
                      ) : (
                        <MinusIcon size={15} />
                      )}
                    </button>
                  ) : null}
                </h2>

                {data[section].type === 'priceRange' ? (
                  <FacetPriceSection
                    {...facetSectionProps}
                    onChange={(value) => onPriceRangeChange(section, value)}
                  />
                ) : (
                  <FacetSection
                    {...facetSectionProps}
                    onChange={(value) => onFilterChange(section, value)}
                  />
                )}
              </li>
            );
          })}
      </ul>
    </section>
  );
};

export default FacetFilter;

function valuesToSet(initialValues: FacetFilterValues) {
  if (!initialValues) {
    return null;
  }
  return Object.keys(initialValues).reduce(
    (acc, key) => ({
      ...acc,
      [key]: new Set(initialValues[key] || []),
    }),
    {}
  );
}

function setToArray(newState: FacetFilterState) {
  const values = Object.keys(newState).reduce(
    (acc, key) => ({
      ...acc,
      ...(newState[key].size ? { [key]: Array.from(newState[key]) } : {}),
    }),
    {}
  );

  return Object.keys(values).length ? values : null;
}

function getCollapsedSectionsFromData(
  data: FacetFiltersData,
  collapsedSections = null
) {
  return Object.keys(data || {}).reduce((acc, key) => {
    if (
      data[key].collapsed ||
      (data[key].collapsed === undefined && collapsedSections?.[key])
    ) {
      return { ...acc, [key]: true };
    }
    return acc;
  }, {});
}
