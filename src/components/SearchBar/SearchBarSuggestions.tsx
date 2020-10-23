import * as React from 'react';
import classnames from 'classnames';
import styles from './searchBar.scss';
import SearchResultItem from './SearchResultItem';
import { ResultItem, VisisbleField } from './models';

const SearchBarSuggestions = ({
  showResultsHeader,
  styled,
  resultsHeaderText,
  resultsFor,
  listTitle,
  suggestions,
  linkEl,
  focusedItemIndex,
  resultItemRefs,
  visibleFields,
}: {
  showResultsHeader: () => boolean;
  styled: boolean;
  resultsHeaderText: string;
  resultsFor: string;
  listTitle: string;
  suggestions: ResultItem[];
  linkEl: React.ElementType;
  focusedItemIndex: number;
  resultItemRefs: HTMLElement[];
  visibleFields: VisisbleField<ResultItem>[];
}) => {
  const Link = linkEl;
  return (
    <div
      className={classnames(
        styles.suggestionContainer,
        { [styles.StyledSuggestionContainer]: styled },
        'Sui-SearchBar--suggestions-container'
      )}
    >
      {showResultsHeader() ? (
        <p
          className={classnames(
            { [styles.StyledHeader]: styled },
            'Sui-SearchBar--result-header'
          )}
        >
          {resultsHeaderText}: {resultsFor}
        </p>
      ) : null}
      <div className={classnames({ [styles.StyledList]: styled })}>
        {listTitle ? (
          <h6
            className={classnames(
              { [styles.StyledListTitle]: styled },
              'Sui-SearchBar--list-title'
            )}
          >
            {listTitle}
          </h6>
        ) : null}

        {suggestions.map((suggestion, index) => (
          <Link
            key={suggestion.id}
            href={suggestion?.product_url[0]}
            tabIndex={-1}
            className={classnames(styles.link, {
              [styles.focused]: focusedItemIndex === index,
            })}
            ref={(link: HTMLElement) => (resultItemRefs[index] = link)}
          >
            <SearchResultItem
              className={classnames(
                {
                  [styles.StyledResultItem]: styled,
                },
                'Sui-SearchBar--result-item'
              )}
              data={suggestion}
              visibleFields={visibleFields}
              styled={styled}
            />{' '}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default SearchBarSuggestions;
