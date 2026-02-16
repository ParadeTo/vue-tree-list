import { webcrypto } from 'node:crypto'

if (!globalThis.crypto) {
  // @ts-ignore
  globalThis.crypto = webcrypto
} else if (!globalThis.crypto.getRandomValues) {
  // @ts-ignore
  globalThis.crypto.getRandomValues = webcrypto.getRandomValues.bind(webcrypto)
}
