export function parseJwt(token: string) {
  // Get the payload part and convert from base64url to base64
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  // Pad with '=' if needed
  const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
  // Decode base64 to a binary string
  const binary = atob(padded);
  // Decode binary string to UTF-8
  const json = decodeURIComponent(
    binary.split('').map(c =>
      '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    ).join('')
  );
  return JSON.parse(json);
}
