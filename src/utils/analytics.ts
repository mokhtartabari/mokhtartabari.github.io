export const getDeviceInfo = () => {
  const ua = navigator.userAgent;
  let device = "Desktop";
  let os = "Unknown";
  let browser = "Unknown";

  if (/tablet|ipad|playbook|silk/i.test(ua)) {
    device = "Tablet";
  } else if (/mobile|iphone|ipod|android|blackberry|iemobile/i.test(ua)) {
    device = "Mobile";
  }

  if (/mac/i.test(ua) && !/iphone|ipad|ipod/i.test(ua)) os = "macOS";
  else if (/win/i.test(ua)) os = "Windows";
  else if (/android/i.test(ua)) os = "Android";
  else if (/iphone|ipad|ipod/i.test(ua)) os = "iOS";
  else if (/linux/i.test(ua)) os = "Linux";

  if (/chrome|crios/i.test(ua) && !/edge|edg/i.test(ua) && !/opr/i.test(ua)) browser = "Chrome";
  else if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) browser = "Safari";
  else if (/firefox|fxios/i.test(ua)) browser = "Firefox";
  else if (/edge|edg/i.test(ua)) browser = "Edge";
  else if (/opr/i.test(ua)) browser = "Opera";

  return { device, os, browser };
};

export const getGeoLocation = async () => {
  try {
    const cached = sessionStorage.getItem("visitor_geo");
    if (cached) return JSON.parse(cached);

    const res = await fetch("https://ipapi.co/json/");
    if (!res.ok) throw new Error("Geo fetch failed");
    const data = await res.json();
    const geo = {
      country: data.country_name || "Unknown",
      city: data.city || "Unknown",
    };
    sessionStorage.setItem("visitor_geo", JSON.stringify(geo));
    return geo;
  } catch (err) {
    return { country: "Unknown", city: "Unknown" };
  }
};

export const logChartEvent = async (
  supabaseUrl: string,
  supabaseKey: string,
  slug: string,
  metricType: "views" | "downloads"
) => {
  if (localStorage.getItem("exclude_analytics") === "true") {
    return;
  }

  const { device, os, browser } = getDeviceInfo();
  const { country, city } = await getGeoLocation();
  
  let referrer = "Direct";
  if (document.referrer) {
    try {
      referrer = new URL(document.referrer).hostname || "Direct";
    } catch (e) {
      referrer = "Direct";
    }
  }

  try {
    await fetch(`${supabaseUrl}/rest/v1/chart_events`, {
      method: "POST",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        chart_slug: slug,
        metric_type: metricType,
        country,
        city,
        device,
        os,
        browser,
        referrer,
      }),
    });
  } catch (err) {
    console.warn("Failed to log chart event to logs:", err);
  }
};
