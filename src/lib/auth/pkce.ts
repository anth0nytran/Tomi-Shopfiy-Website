import crypto from 'crypto'

function base64Url(input: Buffer) {
  return input.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

export function generateCodeVerifier() {
  return base64Url(crypto.randomBytes(32))
}

export async function challengeFromVerifier(verifier: string) {
  const hash = crypto.createHash('sha256').update(verifier).digest()
  return base64Url(hash)
}
