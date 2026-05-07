import { delayConstant } from '@core/constants/delay.constant';

export const simulateNetworkDelay = (ms: number = delayConstant) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
