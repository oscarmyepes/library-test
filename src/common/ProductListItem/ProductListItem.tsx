import classnames from 'classnames';
import * as React from 'react';
import { VisibleFieldsSections } from '../../components/SearchBar/models';
import { toCurrency } from '../../utils/format';
import Image from '../Image/Image';
import Rating from '../Rating/Rating';
import { ProductListItemProps } from './models';
import styles from './productListItem.scss';

const Label = ({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className: string;
}) =>
  value || label ? (
    <p className={className}>
      {label ? <span>{label}</span> : null}
      {value}
    </p>
  ) : null;

const PROP_CLASS_NAME = 'Sui-ProductListItem--';
export const DEFAULT_VISIBLE_FIELDS: ProductListItemProps['visibleFields'] = [
  { prop: 'title' },
  { label: 'BRAND: ', prop: 'brand_name' },
  { label: 'PRODUCT #: ', prop: 'dealerid' },
  { prop: 'sale' },
  { prop: 'price' },
];

const ProductListItem = ({
  data,
  styled,
  visibleFields = DEFAULT_VISIBLE_FIELDS,
  className = '',
  orientation = 'horizontal',
  noImageUrl,
}: ProductListItemProps) => {
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
      } else if (item.prop === 'rating_count') {
        return { ...acc, rating: item };
      }
      return { ...acc, labels: [...(acc.labels || []), item] };
    },
    { labels: [], prices: [] }
  );

  return (
    <section
      className={classnames(
        styles.root,
        {
          [styles.styledSearchResultItem]: styled,
          [styles.vertical]: orientation === 'vertical',
        },
        `${PROP_CLASS_NAME}root`,
        className
      )}
      role="listitem"
    >
      <div
        className={classnames(styles.imageContainer, `${PROP_CLASS_NAME}image`)}
      >
        <Image
          alt="Search reult"
          className={styles.productImg}
          url={data.image_url}
          noImageUrl={noImageUrl}
        />
      </div>

      <div>
        {fieldsInSections.title && (
          <h2 className={classnames(styles.title, `${PROP_CLASS_NAME}title`)}>
            {data[fieldsInSections.title.prop]}
          </h2>
        )}
        <div
          className={classnames(
            styles.labelContainer,
            `${PROP_CLASS_NAME}label-container`
          )}
        >
          {fieldsInSections.labels.map((label) => (
            <Label
              key={label.prop}
              className={classnames(
                styles.text,
                `${PROP_CLASS_NAME}${label.prop}`
              )}
              label={label.label}
              value={data[label.prop] as string}
            />
          ))}
          {fieldsInSections.rating && data[fieldsInSections.rating.prop] ? (
            <Rating
              className={classnames(styles.rating, `${PROP_CLASS_NAME}rating`)}
              value={Number(data[fieldsInSections.rating.prop])}
            />
          ) : null}
        </div>
      </div>
      <div
        className={classnames(
          styles.priceContainer,
          `${PROP_CLASS_NAME}price-container`
        )}
      >
        {fieldsInSections.prices.map((price, index) => (
          <Label
            key={price.prop}
            className={classnames(
              styles.text,
              styles.price,
              {
                [styles.styledSearchResultItemCurrentPrice]: styled,
                [styles.styledSearchResultItemOldPrice]: styled && index === 1,
              },
              `${PROP_CLASS_NAME}${price.prop}`
            )}
            label={price.label}
            value={toCurrency(data[price.prop] as number)}
          />
        ))}
      </div>
    </section>
  );
};

export default ProductListItem;
