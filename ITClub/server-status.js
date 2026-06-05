(() => {
  const REFRESH_MS = 15000;
  const TIMEOUT_MS = 8000;

  const SERVERS = {
    java: {
      endpoints: [
        {
          url: "https://api.mcstatus.io/v2/status/java/play.mhscraft.cc",
          label: "Java domain",
        },
      ],
      statusId: "java-status",
    },
    bedrock: {
      endpoints: [
        {
          url: "https://api.mcstatus.io/v2/status/bedrock/playbe.mhscraft.cc:1221",
          label: "Bedrock domain",
          fallback: false,
        },
        {
          url: "https://api.mcstatus.io/v2/status/bedrock/69.9.180.19:1221",
          label: "Bedrock fallback IP",
          fallback: true,
        },
      ],
      statusId: "bedrock-status",
    },
  };

  function setBadge(id, state, text) {
    const el = document.getElementById(id);
    if (!el) return;

    el.classList.remove("ok", "bad", "muted");

    if (state === true) {
      el.textContent = text || "Online";
      el.classList.add("ok");
    } else if (state === false) {
      el.textContent = text || "Offline";
      el.classList.add("bad");
    } else {
      el.textContent = text || "Unavailable";
      el.classList.add("muted");
    }
  }

  async function fetchJsonWithTimeout(url) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const res = await fetch(url, {
        cache: "no-store",
        signal: controller.signal,
      });

      if (!res.ok) throw new Error("HTTP " + res.status);
      return await res.json();
    } finally {
      clearTimeout(timeout);
    }
  }

  function getPlayers(data) {
    if (!data || !data.players || typeof data.players.online !== "number") {
      return null;
    }

    return {
      online: data.players.online,
      max: typeof data.players.max === "number" ? data.players.max : null,
    };
  }

  function formatServerStatus(result) {
    if (!result || result.state === null) return "Unavailable";
    if (!result.online) return "Offline";

    const players = getPlayers(result.data);
    const source = result.endpoint && result.endpoint.fallback ? " (fallback IP)" : "";

    if (!players) return `Online${source}`;

    if (players.max !== null) {
      return `Online - ${players.online} / ${players.max}${source}`;
    }

    return `Online - ${players.online}${source}`;
  }

  async function getServerStatus(server) {
    let lastResult = null;

    for (const endpoint of server.endpoints) {
      try {
        const data = await fetchJsonWithTimeout(endpoint.url);
        const online = Boolean(data && data.online);

        lastResult = {
          state: online,
          online,
          data,
          endpoint,
        };

        if (online) return lastResult;
      } catch (error) {
        lastResult = {
          state: null,
          online: false,
          data: null,
          endpoint,
          error,
        };
      }
    }

    return lastResult || {
      state: null,
      online: false,
      data: null,
      endpoint: null,
    };
  }

  function renderOverall(results) {
    const knownResults = results.filter((result) => result && result.state !== null);
    const onlineResults = results.filter((result) => result && result.online);

    if (onlineResults.length === 0) {
      setBadge("overall-players", knownResults.length > 0 ? false : null);
      return;
    }

    let totalOnline = 0;
    let sharedMax = null;
    let hasPlayers = false;

    for (const result of onlineResults) {
      const players = getPlayers(result.data);
      if (!players) continue;

      totalOnline += players.online;
      hasPlayers = true;

      if (players.max !== null) {
        sharedMax = sharedMax === null ? players.max : Math.max(sharedMax, players.max);
      }
    }

    if (hasPlayers) {
      setBadge(
        "overall-players",
        true,
        sharedMax !== null ? `${totalOnline} / ${sharedMax}` : String(totalOnline)
      );
      return;
    }

    setBadge("overall-players", true, "Online");
  }

  function renderStatusNote(java, bedrock) {
    const el = document.getElementById("status-note");
    if (!el) return;

    if (bedrock && bedrock.online && bedrock.endpoint && bedrock.endpoint.fallback) {
      el.textContent = "Bedrock status is using fallback IP 69.9.180.19:1221.";
      return;
    }

    if (!java.online && !bedrock.online) {
      el.textContent = "Public status is offline or unavailable.";
      return;
    }

    el.textContent = "Status checks use the public Minecraft server status API. Bedrock checks playbe.mhscraft.cc:1221 first, then 69.9.180.19:1221.";
  }

  async function refreshStatus() {
    const [java, bedrock] = await Promise.all([
      getServerStatus(SERVERS.java),
      getServerStatus(SERVERS.bedrock),
    ]);

    setBadge(SERVERS.java.statusId, java.state, formatServerStatus(java));
    setBadge(SERVERS.bedrock.statusId, bedrock.state, formatServerStatus(bedrock));

    renderOverall([java, bedrock]);
    renderStatusNote(java, bedrock);
  }

  refreshStatus();
  setInterval(refreshStatus, REFRESH_MS);
})();
