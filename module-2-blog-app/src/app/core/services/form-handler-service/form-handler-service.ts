import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { simulateNetworkDelay } from '@core/utils/simulate-network-delay';

@Injectable({
  providedIn: 'root',
})
export class FormHandlerService {
  async processSubmit<T>(
    form: FormGroup,
    isLoadingSignal: { set: (v: boolean) => void },
    callback: (data: T) => void,
    delayMs: number = 1000,
  ) {
    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    form.disable();
    isLoadingSignal.set(true);

    try {
      await simulateNetworkDelay(delayMs);
      callback(form.getRawValue());
      form.reset();
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      isLoadingSignal.set(false);
      form.enable();
    }
  }
}
