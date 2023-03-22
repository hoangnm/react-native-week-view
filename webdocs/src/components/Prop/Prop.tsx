// eslint-disable-next-line no-use-before-define
import React from 'react';
import styles from './styles.module.css';

const CodeRow = ({
  label,
  value,
}: {
  label: string;
  value: string;
}): JSX.Element => {
  return (
    <tr>
      <td>{label}</td>
      <td>
        <code>{value}</code>
      </td>
    </tr>
  );
};

const Required = () => <span className={styles.required}>(required). </span>;

const Prop = ({
  type,
  required,
  defaultValue,
  children,
}: {
  name: string;
  type: string;
  defaultValue?: string;
  required?: boolean;
  children?: JSX.Element;
}): JSX.Element => {
  return (
    <div className={styles.container}>
      <div className={styles.description}>
        {required && <Required />}
        {children}
      </div>
      <table className={styles.meta}>
        <tbody>
          <CodeRow label="type" value={type} />
          {!required && defaultValue && (
            <CodeRow label="default" value={defaultValue} />
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Prop;
