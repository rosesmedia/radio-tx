'use client';

interface Umami {
  track: (event: string, data: any) => void;
}

export function maybeGetUmami(): Umami | null {
  const $window = window as { umami?: Umami };
  if ($window.umami) {
    return $window.umami;
  } else {
    return null;
  }
}
