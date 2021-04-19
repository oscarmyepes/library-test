import classnames from 'classnames';
import debounce from 'lodash/debounce';
import * as React from 'react';
import Slider, { Settings } from 'react-slick';
import CategoryItem from '../../common/CategoryItem/CategoryItem';
import { CategoryCarouselProps } from './models';
import styles from './styles/categoryCarousel.scss';

const SETTINGS = {
  dots: false,
  infinite: false,
  slidesToScroll: 3,
  slidesToShow: 3,
  speed: 500,
};

const DEBOUNCE_DELAY = 150;

const CategoryCarousel = ({
  className,
  list,
  responsive,
  size = 'lg',
  linkEl,
  onItemClick,
}: CategoryCarouselProps) => {
  const validResponsiveObject = Array.isArray(responsive)
    ? responsive
    : undefined;
  const [visible, setVisibility] = React.useState(false);
  const [settings, setSettings] = React.useState<Settings>({
    ...SETTINGS,
    responsive: [...(validResponsiveObject || [])],
  });
  const carouselRef = React.useRef(null);
  const carouselId = React.useRef(Date.now());

  React.useLayoutEffect(() => {
    /*
      To calculate how many items to show when the user does not send the responsive object,
      we need to attach an event to the resize window event and do the math to measure each
      item width to configure the slider to show a proper number of items.
     */
    window.addEventListener('resize', debouncedConfigureSlider);
    debouncedConfigureSlider();
    setTimeout(() => {
      // Timeout needed to wait for the math to check how many items should be displayed.
      // The delay must be the same we have in the debounced function => debouncedConfigureSlider
      setVisibility(true);
    }, DEBOUNCE_DELAY);

    return () => {
      window.removeEventListener('resize', debouncedConfigureSlider);
    };
  }, [size, validResponsiveObject]);

  const debouncedConfigureSlider = React.useCallback(
    debounce(() => {
      configureSlider(
        list,
        setSettings,
        settings,
        validResponsiveObject,
        carouselId.current
      );
    }, DEBOUNCE_DELAY),
    [size, validResponsiveObject]
  );

  return (
    <div id={String(carouselId.current)}>
      <Slider
        ref={carouselRef}
        key={
          JSON.stringify(
            settings
          ) /* Need to update the component when setting changed to reconfigure the slider */
        }
        {...settings}
        className={classnames(
          styles.carouselCategoryContainer,
          size,
          {
            [styles.hidden]: !visible,
          },
          className
        )}
      >
        {(list || []).map((category) => {
          const Link = category.url ? linkEl || 'a' : 'div';
          const linkProps = category.url ? { href: category.url } : {};
          return (
            <div key={category.id} className={styles.carouselItem}>
              <div className={styles.carouselCategoryItemContainer}>
                <Link
                  role="listitem"
                  onClick={(e) => onItemClick?.(e, category)}
                  {...linkProps}
                >
                  <CategoryItem category={category} />
                </Link>
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default CategoryCarousel;

const configureSlider = (
  list,
  setSettings,
  settings,
  responsive,
  carouselId
) => {
  const parentEl = document.getElementById(carouselId);
  const sliderListWidth = parentEl.querySelectorAll(`.slick-list`)?.[0]
    ?.clientWidth;

  const slideWidth = parentEl.querySelectorAll(
    `.Sui-CategoryList--image-container`
  )?.[0]?.clientWidth;

  const visibleSlides =
    Math.min(Math.floor(sliderListWidth / slideWidth), list.length) || 1;

  setSettings({
    ...settings,
    responsive: responsive,
    slidesToScroll: visibleSlides,
    slidesToShow: visibleSlides,
  });
};
