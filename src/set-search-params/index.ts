type Options = {
  pushToHistory?: boolean;
};

export function setSearchParams(paramsToSet: Record<string, unknown>, options?: Options): void {
  if (typeof window === "undefined") {
    return;
  }

  const url = new URL(window.location.href);
  const currentParams = Object.fromEntries(url.searchParams.entries());

  const merged = { ...currentParams, ...paramsToSet };

  const updatedParams = Object.entries(merged).filter(
    ([, value]) => value !== null && value !== undefined && value !== "",
  );

  const newQueryString = updatedParams
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
    .join("&");

  const newUrl = `${url.pathname}?${newQueryString}`;

  if (options?.pushToHistory) {
    window.history.pushState({}, "", newUrl);
  } else {
    window.history.replaceState({}, "", newUrl);
  }
}
