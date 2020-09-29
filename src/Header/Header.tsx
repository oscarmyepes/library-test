import * as React from 'react';

import { createUseStyles } from 'react-jss';

const useStyles = createUseStyles({
  myLabel: {
    color: 'green',
  },
});

export interface HeaderProps {
  text: string;
}

const Header = ({ text }: HeaderProps) => {
  const classes = useStyles();
  return <h1 className={classes.myLabel}>{text}</h1>;
};

export default Header;
