/* eslint-disable import/prefer-default-export */
/**
 * Module operator.
 * When `num < 0`, works different than raw remainder operator: num % divider
 * */
export const mod = (num, divider) => ((num % divider) + divider) % divider;
