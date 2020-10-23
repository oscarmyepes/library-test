import classnames from 'classnames';
import * as React from 'react';
import PlaceHolderImage from '../../icons/ImagePlaceHolder';
import { toCurrency } from '../../utils/format';
import styles from './searchResultItem.scss';
import { SearchResultItemProps, VisibleFieldsSections } from './models';

const Label = ({ label, value, className }) =>
  value ? (
    <p className={className}>
      {label ? <span>{label}</span> : null}
      {value}
    </p>
  ) : null;

const PROP_CLASS_NAME = 'Sui-SearchResultItem--';
export const DEFAULT_VISIBLE_FIELDS: SearchResultItemProps['visibleFields'] = [
  { prop: 'title' },
  { prop: 'brand_name', label: 'BRAND: ' },
  { prop: 'dealerid', label: 'PRODUCT #: ' },
  { prop: 'sale' },
  { prop: 'price' },
];

const SearchResultItem = ({
  data,
  styled,
  visibleFields = DEFAULT_VISIBLE_FIELDS,
  className = '',
}: SearchResultItemProps) => {
  /*
    Logic to split data into sections:
    {
      title: {prop: "title"},
      labels: [{prop: "brand_name",  label: 'BRAND: '}, { prop: 'dealerid', label: 'PRODUCT #: ' }],
      prices: {{ prop: 'sale' }, { prop: 'price', label: 'was ' }},
    }
    Then we use this object to render labels according to our defined layout
  */
  const fieldsToReduce = Array.isArray(visibleFields)
    ? visibleFields
    : DEFAULT_VISIBLE_FIELDS;
  const fieldsInSections: VisibleFieldsSections = fieldsToReduce.reduce(
    (acc, item) => {
      if (item.prop === 'title') {
        return { ...acc, title: item };
      } else if (
        (item.prop === 'sale' || item.prop === 'price') &&
        data[item.prop]
      ) {
        return { ...acc, prices: [...(acc.prices || []), item] };
      }
      return { ...acc, labels: [...(acc.labels || []), item] };
    },
    { prices: [], labels: [] }
  );

  return (
    <section
      className={classnames(
        styles.root,
        {
          [styles.StyledSearchResultItem]: styled,
        },
        className
      )}
      role="listitem"
    >
      <div
        className={classnames(styles.ImageContainer, `${PROP_CLASS_NAME}image`)}
      >
        {data?.thumb_urls?.length ? (
          <img src={data.thumb_urls[0]} alt="Search reult item" />
        ) : (
          <PlaceHolderImage />
        )}
      </div>

      <div>
        {fieldsInSections.title && (
          <h2 className={classnames(styles.title, `${PROP_CLASS_NAME}title`)}>
            {data[fieldsInSections.title.prop]}
          </h2>
        )}
        <div className={`${PROP_CLASS_NAME}label-container`}>
          {fieldsInSections.labels.map((label) => (
            <Label
              key={label.prop}
              className={classnames(
                styles.text,
                `${PROP_CLASS_NAME}${label.prop}`
              )}
              label={label.label}
              value={data[label.prop]}
            />
          ))}
        </div>
      </div>
      <div>
        {fieldsInSections.prices.map((price, index) => (
          <Label
            key={price.prop}
            className={classnames(
              styles.text,
              styles.price,
              {
                [styles.StyledSearchResultItemCurrentPrice]: styled,
                [styles.StyledSearchResultItemOldPrice]: styled && index === 1,
              },
              `${PROP_CLASS_NAME}${price.prop}`
            )}
            label={price.label}
            value={toCurrency(data[price.prop])}
          />
        ))}
      </div>
    </section>
  );
};

export default SearchResultItem;
