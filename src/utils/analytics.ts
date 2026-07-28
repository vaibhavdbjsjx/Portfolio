/**
 * First-party, cookieless visitor analytics.
 *
 * Design goals
 * ------------
 * - SILENT: nothing is rendered, logged, or shown to the visitor.
 * - COOKIELESS: no cookies and no persistent identifier, so no consent banner
 *   is required under GDPR/ePrivacy. Uniqueness comes from a hash that
 *   ROTATES DAILY, which lets us count "unique visitors per day" without ever
 *   being able to follow one person across days.
 * - NO IP HANDLING: approximate region is inferred from the browser's own
 *   timezone (e.g. "Asia/Calcutta"), so no IP address is ever collected.
 * - OFF THE CRITICAL PATH: fires on idle, after first paint, with `keepalive`
 *   so it never delays rendering or blocks navigation.
 * - FAIL-SILENT: every failure is swallowed. Analytics must never break the site.
 *
 * Not configured (missing env vars) => every function is a no-op.
 */

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;
const TABLE = "portfolio_views";

/** Visits are only recorded when credentials exist and this isn't a bot/dev run. */
const isConfigured = () => Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);

const isLocal = () =>
  ["localhost", "127.0.0.1", "0.0.0.0"].includes(window.location.hostname);

const isBot = () => {
  if ((navigator as unknown as { webdriver?: boolean }).webdriver) return true;
  return /bot|crawler|spider|crawling|lighthouse|headless|preview|slurp/i.test(
    navigator.userAgent
  );
};

/**
 * Owner opt-out: visit any page once with `?noTrack=1` and this browser stops
 * reporting, so your own visits never inflate the numbers.
 */
const OPT_OUT_KEY = "vsg_no_track";
const isOptedOut = () => {
  try {
    if (new URLSearchParams(window.location.search).has("noTrack")) {
      localStorage.setItem(OPT_OUT_KEY, "1");
    }
    return localStorage.getItem(OPT_OUT_KEY) === "1";
  } catch {
    return false;
  }
};

const shouldTrack = () =>
  isConfigured() && !isBot() && !isOptedOut() && (!isLocal() || import.meta.env.DEV === false);

/** Pseudonymous, non-reversible, rotates every day at UTC midnight. */
const dailyVisitorHash = async (): Promise<string> => {
  try {
    const parts = [
      new Date().toISOString().slice(0, 10), // date => rotates daily
      navigator.userAgent,
      navigator.language,
      Intl.DateTimeFormat().resolvedOptions().timeZone,
      `${screen.width}x${screen.height}`,
    ].join("|");
    const digest = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(parts)
    );
    return Array.from(new Uint8Array(digest))
      .slice(0, 8)
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return "unknown";
  }
};

/** Per-tab id: dies when the tab closes. Lets us group one person's journey. */
const sessionId = (): string => {
  try {
    const KEY = "vsg_sid";
    let id = sessionStorage.getItem(KEY);
    if (!id) {
      id = Math.random().toString(36).slice(2, 12);
      sessionStorage.setItem(KEY, id);
    }
    return id;
  } catch {
    return "nosession";
  }
};

const deviceType = (): string => {
  const w = window.innerWidth;
  if (/Mobi|Android|iPhone/i.test(navigator.userAgent) || w < 768) return "mobile";
  if (/iPad|Tablet/i.test(navigator.userAgent) || w < 1025) return "tablet";
  return "desktop";
};

const browserName = (): string => {
  const ua = navigator.userAgent;
  if (/Edg\//.test(ua)) return "Edge";
  if (/OPR\//.test(ua)) return "Opera";
  if (/Chrome\//.test(ua)) return "Chrome";
  if (/Firefox\//.test(ua)) return "Firefox";
  if (/Safari\//.test(ua)) return "Safari";
  return "Other";
};

const osName = (): string => {
  const ua = navigator.userAgent;
  if (/Windows/i.test(ua)) return "Windows";
  if (/Android/i.test(ua)) return "Android";
  if (/iPhone|iPad|iPod/i.test(ua)) return "iOS";
  if (/Mac OS X/i.test(ua)) return "macOS";
  if (/Linux/i.test(ua)) return "Linux";
  return "Other";
};

/**
 * Campaign tag. Give each place you share the link its own value:
 *   /?src=resume     /?src=linkedin     /?src=infosys
 * When that value shows up you know which channel (or which company) opened it.
 */
const sourceTag = (): string | null => {
  try {
    const p = new URLSearchParams(window.location.search);
    return p.get("src") || p.get("utm_source") || null;
  } catch {
    return null;
  }
};

/** Referrer host only — never the full URL, which can carry private data. */
const referrerHost = (): string | null => {
  try {
    if (!document.referrer) return null;
    const host = new URL(document.referrer).hostname;
    return host === window.location.hostname ? null : host;
  } catch {
    return null;
  }
};

type EventName = "page_view" | "project_open" | "contact_submit";

interface EventPayload {
  project?: string;
  path?: string;
}

/** POST one row. Never throws, never logs. */
const send = async (event: EventName, extra: EventPayload = {}): Promise<void> => {
  if (!shouldTrack()) return;

  try {
    const row = {
      event,
      path: extra.path ?? window.location.pathname,
      project: extra.project ?? null,
      source: sourceTag(),
      referrer: referrerHost(),
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone ?? null,
      language: navigator.language ?? null,
      device: deviceType(),
      browser: browserName(),
      os: osName(),
      screen: `${window.innerWidth}x${window.innerHeight}`,
      visitor_hash: await dailyVisitorHash(),
      session_id: sessionId(),
    };

    await fetch(`${SUPABASE_URL}/rest/v1/${TABLE}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: SUPABASE_ANON_KEY as string,
        Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
        // Don't ask the DB to echo the row back — smaller, faster response.
        Prefer: "return=minimal",
      },
      body: JSON.stringify(row),
      keepalive: true,
    });
  } catch {
    /* analytics must never surface an error to the visitor */
  }
};

/** Public: record an interaction (e.g. a project's Read Me being opened). */
export const trackEvent = (event: EventName, extra: EventPayload = {}) => {
  void send(event, extra);
};

/**
 * Public: record the initial visit. Deferred to idle time so it cannot compete
 * with the hero render or the character download.
 */
export const initAnalytics = () => {
  if (!shouldTrack()) return;

  const fire = () => void send("page_view");
  const w = window as unknown as {
    requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => void;
  };

  if (typeof w.requestIdleCallback === "function") {
    w.requestIdleCallback(fire, { timeout: 4000 });
  } else {
    window.setTimeout(fire, 2500);
  }
};
