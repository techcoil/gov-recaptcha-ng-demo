import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

declare global {
  interface Window {
    grecaptcha: ReCaptchaV2.ReCaptcha;
  }
}

@Injectable({
  providedIn: 'root',
})
export class CaptchaServiceService {
  _initiated: boolean = false;

  readySubject: Subject<boolean> = new BehaviorSubject<boolean>(
    !this.isEnabled()
  );

  _resolve: { current: null | ((token: string) => void) } = { current: null };
  _reject: { current: null | ((error: any) => void) } = { current: null };

  constructor() {
    this.readySubject.next(!this.isEnabled());
  }

  isEnabled() {
    //TODO: replace this value with a config value that defined if captcha is used
    return true;
  }

  init(): void {
    if (!this.isEnabled()) return;
    if (this._initiated) return;

    this._initiated = true;

    (window as any).onRecaptchaCallback = (token: string) => {
      this._resolve.current && this._resolve.current(token);
      this.reset();
    };

    (window as any).onRecaptchaError = () => {
      this._reject.current && this._reject.current('recaptcha error');
      this.reset();
    };

    (window as any).onloadCallback = () => {
      this.readySubject.next(true);
    };

    const element = document.createElement('div');
    element.classList.add('g-recaptcha');
    element.setAttribute(
      'data-sitekey',
      '6Letn30qAAAAALfFezC4OwAEgtreDjz6yRf70ZXl'
    );
    element.setAttribute('data-callback', 'onRecaptchaCallback');
    element.setAttribute('data-error-callback', 'onRecaptchaError');
    element.setAttribute('data-size', 'invisible');
    document.body.appendChild(element);

    const script = document.createElement('script');
    script.src =
      'https://www.google.com/recaptcha/api.js?onload=onloadCallback';
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
  }

  private reset() {
    grecaptcha.reset();

    //this.readySubject.next(false);
    // TODO: check if reset completed by visual check of the recaptcha badge and call this.readySubject.next(true);
  }

  async generateToken() {
    if (!this.isEnabled()) {
      return Promise.resolve(null);
    }

    return new Promise<string>((resolve, reject) => {
      const to = setTimeout(() => {
        reject('timeout');
      }, 3000);
      this._resolve.current = (token) => {
        clearTimeout(to);
        resolve(token);
      };
      this._reject.current = (error) => {
        clearTimeout(to);
        reject(error);
      };
      window.grecaptcha.execute();
    });
  }
}
