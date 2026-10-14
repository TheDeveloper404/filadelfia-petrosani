import '@testing-library/jest-dom';

// jsdom nu are IntersectionObserver (folosit de Nav pentru pastila plutitoare de la scroll).
// Stub-ul reține callback-urile, ca testele să poată simula ieșirea header-ului din ecran.
export const intersectionCallbacks: IntersectionObserverCallback[] = [];
class IntersectionObserverStub {
  constructor(private cb: IntersectionObserverCallback) { intersectionCallbacks.push(cb); }
  observe() {}
  unobserve() {}
  disconnect() {
    const i = intersectionCallbacks.indexOf(this.cb);
    if (i !== -1) intersectionCallbacks.splice(i, 1);
  }
  takeRecords() { return []; }
}
globalThis.IntersectionObserver = IntersectionObserverStub as unknown as typeof IntersectionObserver;
