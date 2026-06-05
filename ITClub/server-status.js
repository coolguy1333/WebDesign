(() => {
  const REFRESH_MS = 15000;
  const TIMEOUT_MS = 8000;

  const SERVERS = {
    java: {
      endpoints: ["https://api.mcsrvstat.us/3/play.mhscraft.cc"],
      statusId: "java-status",
    },
    bedrock: {
      endpoints: [
        "https://api.mcsrvstat.us/bedrock/3/playbe.mhscraft.cc:1221",
        "https://api.mcsrvstat.us/bedrock/3/69.9.180.19:1221",
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
    if (!players) return "Online";

    if (players.max !== null) {
      return `Online - ${players.online} / ${players.max}`;
    }

    return `Online - ${players.online}`;
  }

  async function getServerStatus(server) {
    let lastResult = null;

    for (const endpoint of server.endpoints) {
      try {
        const data = await fetchJsonWithTimeout(endpoint);
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
    let totalMax = 0;
    let hasPlayers = false;
    let hasMax = false;

    for (const result of onlineResults) {
      const players = getPlayers(result.data);
      if (!players) continue;

      totalOnline += players.online;
      hasPlayers = true;

      if (players.max !== null) {
        totalMax += players.max;
        hasMax = true;
      }
    }

    if (!hasPlayers) {
      setBadge("overall-players", true, "Online");
      return;
    }

    setBadge(
      "overall-players",
      true,
      hasMax ? `${totalOnline} / ${totalMax}` : String(totalOnline)
    );
  }

  async function refreshStatus() {
    const [java, bedrock] = await Promise.all([
      getServerStatus(SERVERS.java),
      getServerStatus(SERVERS.bedrock),
    ]);

    setBadge(SERVERS.java.statusId, java.state, formatServerStatus(java));
    setBadge(SERVERS.bedrock.statusId, bedrock.state, formatServerStatus(bedrock));
    renderOverall([java, bedrock]);
  }

  refreshStatus();
  setInterval(refreshStatus, REFRESH_MS);
})();
