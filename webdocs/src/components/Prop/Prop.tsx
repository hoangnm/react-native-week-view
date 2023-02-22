// eslint-disable-next-line no-use-before-define
import React from 'react';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type Props = {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  children?: JSX.Element;
};

const Prop: React.FC<Props> = ({
  name,
  type,
  required,
  defaultValue,
  children,
}) => {
  return (
    <div className={styles.container}>
      <div>
        {required && ' (required)'}
        Type:
        <code>{type}</code>
        {defaultValue ? `, default: ${defaultValue}` : ''}
      </div>
      <div>{children}</div>
      <br />
    </div>
  );
};

export default Prop;
