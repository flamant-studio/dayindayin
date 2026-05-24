'use client'
import Script from 'next/script'

// PostHog EU Cloud — cookieless (person_profiles: 'never' = no cookies, GDPR-safe).
// Set NEXT_PUBLIC_POSTHOG_KEY in Vercel env vars to activate.
// Get key from posthog.com → Project Settings → API Keys.
export default function Analytics() {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY
  if (!key) return null

  return (
    <Script id="posthog" strategy="afterInteractive">{`
      !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.crossOrigin="anonymous",p.async=!0,p.src=s.api_host.replace(".i.posthog.com","-assets.i.posthog.com")+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+".people (stub)"},o="capture register register_once unregister getFeatureFlag isFeatureEnabled reloadFeatureFlags on onFeatureFlags getSurveys getActiveMatchingSurveys identify setPersonProperties reset get_distinct_id getGroups get_session_id alias set_config debug".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);
      posthog.init('${key}', {
        api_host: 'https://eu.i.posthog.com',
        person_profiles: 'never'
      });
    `}</Script>
  )
}
