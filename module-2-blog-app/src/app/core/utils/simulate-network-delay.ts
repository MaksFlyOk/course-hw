import { delayConstant } from '@core/constants';

export const simulateNetworkDelay = (ms: number = delayConstant) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
