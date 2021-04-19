import classnames from 'classnames';
import * as React from 'react';
import Image from '../../common/Image/Image';
import ProductListItem from '../../common/ProductListItem/ProductListItem';
import { BasicItem, Product } from '../../models/search';
import { BasicItemProps, ProductItemProps, SearchBarProps } from './models';
import styles from './styles/searchBarSuggestions.scss';

const ProductItem = ({
  linkEl,
  suggestion,
  styled,
  visibleFields,
}: ProductItemProps) => {
  const Link = suggestion.url ? linkEl : 'div';
  const linkProps = suggestion.url ? { href: suggestion.url } : {};
  return (
    <Link
      key={suggestion.id}
      className={classnames(styles.link, styles.productLink)}
      {...linkProps}
    >
      <ProductListItem
        className={classnames(
          {
            [styles.styledResultItem]: styled,
          },
          'Sui-SearchBar--result-item'
        )}
        data={suggestion}
        visibleFields={visibleFields}
        styled={styled}
        orientation="vertical"
      />
    </Link>
  );
};

const BasicItemSuggestion = ({ linkEl, suggestion }: BasicItemProps) => {
  const Link = suggestion.url ? linkEl : 'div';
  const linkProps = suggestion.url ? { href: suggestion.url } : {};
  return (
    <Link
      key={suggestion.id}
      className={classnames(
        styles.link,
        styles.basicItemLink,
        'Sui-SearchBar--result-item'
      )}
      {...linkProps}
      role="listitem"
    >
      <div className={styles.imageContainer}>
        <Image url={suggestion.image_url} alt="categoryImage" />
      </div>
      <h1
        className={classnames(styles.basicItemTitle, 'Sui-CategoryList--title')}
      >
        {suggestion.name}
      </h1>
    </Link>
  );
};

const SearchBarSuggestions = ({
  sections,
  styled,
  linkEl,
  onItemClick,
}: Pick<SearchBarProps, 'styled' | 'linkEl' | 'sections' | 'onItemClick'>) => {
  return (
    <div
      className={classnames(
        styles.suggestionContainer,
        { [styles.styledSuggestionContainer]: styled },
        'Sui-SearchBar--suggestions-container'
      )}
    >
      <div className={classnames({ [styles.styledList]: styled })}>
        {sections.map((section) => {
          const listTitle = section.title;
          const suggestions = section.data.list;
          const total = section.data.total;
          const visibleFields = section.visibleFields;
          const type = section.type;
          if (!suggestions.length) {
            return null;
          }
          return (
            <div key={section.type}>
              {listTitle ? (
                <h3
                  className={classnames(
                    { [styles.styledListTitle]: styled },
                    'Sui-SearchBar--list-title'
                  )}
                >
                  {listTitle}
                </h3>
              ) : null}

              <div
                className={classnames(
                  styles.listContainer,
                  `Sui-SearchBar--section-${type}`
                )}
              >
                {suggestions.map((suggestion) => (
                  <span
                    className={styles.cursorPointer}
                    key={suggestion.id}
                    role="button"
                    tabIndex={-1}
                    onKeyDown={null}
                    onClick={() => onItemClick?.(suggestion)}
                  >
                    {type === 'product' ? (
                      <ProductItem
                        key={suggestion.id}
                        linkEl={linkEl}
                        suggestion={suggestion as Product}
                        styled={styled}
                        visibleFields={visibleFields}
                      />
                    ) : (
                      <BasicItemSuggestion
                        key={suggestion.id}
                        linkEl={linkEl}
                        suggestion={suggestion as BasicItem}
                      />
                    )}
                  </span>
                ))}
              </div>
              {section.onViewMoreClick && total > suggestions.length ? (
                <div
                  className={classnames(
                    styles.viewMoreContainer,
                    'Sui-SearchBar--section-view-more-button'
                  )}
                >
                  <button
                    type="button"
                    onClick={() => {
                      // Can't use lodash/omit because the build throws an error
                      const sectionToSend = { ...section };
                      delete sectionToSend.onViewMoreClick;
                      section.onViewMoreClick(sectionToSend);
                    }}
                    className={
                      styled
                        ? `SuiButton primary ${styles.styledViewMoreBtn}`
                        : ''
                    }
                  >
                    {section.viewMoreButtonText || 'View more'}
                  </button>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SearchBarSuggestions;
