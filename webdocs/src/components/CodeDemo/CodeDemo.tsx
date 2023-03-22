// eslint-disable-next-line no-use-before-define
import React from 'react';
import styles from './styles.module.css';

type Props = {
  imgSrc: string;
  alt?: string;
  children: JSX.Element;
};

const CodeDemo: React.FC<Props> = ({ imgSrc, children, alt = 'image' }) => {
  return (
    <div className={styles.container}>
      <div className={styles.imagesContainer}>
        {!!imgSrc && (
          <img
            className={styles.demo}
            src={imgSrc}
            alt={alt}
            width={223}
            height={427}
          />
        )}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default CodeDemo;
