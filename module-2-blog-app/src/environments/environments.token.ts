import { InjectionToken } from '@angular/core';

import { IENVconfig } from './environments.interface';

export const ENV_CONFIG_TOKEN = new InjectionToken<IENVconfig>('[ENV_CONFIG_TOKEN]: переменные окружения');
