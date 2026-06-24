import { useMemo, useState } from "react";

// Daily BTC/USD close prices for the trailing 12 months (source: IBKR PAXOS crypto feed).
const BTC_USD = [["2025-06-24",107814],["2025-06-25",107556],["2025-06-26",107466],["2025-06-29",107777],["2025-06-30",105421],["2025-07-01",109765],["2025-07-02",109844],["2025-07-03",108574],["2025-07-06",108057],["2025-07-07",108811],["2025-07-08",111762],["2025-07-09",113414],["2025-07-10",119032],["2025-07-13",119947],["2025-07-14",116391],["2025-07-15",119316],["2025-07-16",119016],["2025-07-17",118205],["2025-07-20",116780],["2025-07-21",119352],["2025-07-22",118437],["2025-07-23",119017],["2025-07-24",119009],["2025-07-27",118077],["2025-07-28",117522],["2025-07-29",116934],["2025-07-30",116794],["2025-07-31",114315],["2025-08-03",114766],["2025-08-04",113629],["2025-08-05",115273],["2025-08-06",117517],["2025-08-07",118702],["2025-08-10",119077],["2025-08-11",119682],["2025-08-12",122801],["2025-08-13",118017],["2025-08-14",117639],["2025-08-17",116347],["2025-08-18",113123],["2025-08-19",114286],["2025-08-20",112154],["2025-08-21",112591],["2025-08-24",110679],["2025-08-25",111138],["2025-08-26",112110],["2025-08-27",112000],["2025-08-28",108949],["2025-08-31",109224],["2025-09-01",110815],["2025-09-02",112256],["2025-09-03",109769],["2025-09-04",111235],["2025-09-07",112093],["2025-09-08",111329],["2025-09-09",113604],["2025-09-10",114471],["2025-09-11",115670],["2025-09-14",115309],["2025-09-15",116836],["2025-09-16",115691],["2025-09-17",117519],["2025-09-18",115534],["2025-09-21",112206],["2025-09-22",111688],["2025-09-23",113460],["2025-09-24",109400],["2025-09-25",110352],["2025-09-28",114380],["2025-09-29",114371],["2025-09-30",117489],["2025-10-01",120931],["2025-10-02",122619],["2025-10-05",125462],["2025-10-06",121659],["2025-10-07",123475],["2025-10-08",121015],["2025-10-09",114429],["2025-10-12",115906],["2025-10-13",112658],["2025-10-14",111334],["2025-10-15",108253],["2025-10-16",108985],["2025-10-19",110846],["2025-10-20",111837],["2025-10-21",107881],["2025-10-22",110253],["2025-10-23",113581],["2025-10-26",114912],["2025-10-27",113696],["2025-10-28",110657],["2025-10-29",106517],["2025-10-30",109791],["2025-11-02",106625],["2025-11-03",100706],["2025-11-04",103845],["2025-11-05",100876],["2025-11-06",104634],["2025-11-09",105986],["2025-11-10",102770],["2025-11-11",101524],["2025-11-12",98081],["2025-11-13",94041],["2025-11-16",91878],["2025-11-17",92774],["2025-11-18",89455],["2025-11-19",86330],["2025-11-20",87461],["2025-11-23",89100],["2025-11-24",87360],["2025-11-25",89871],["2025-11-26",91447],["2025-11-27",91327],["2025-11-30",85524],["2025-12-01",91053],["2025-12-02",93000],["2025-12-03",92519],["2025-12-04",91435],["2025-12-07",90791],["2025-12-08",93087],["2025-12-09",92435],["2025-12-10",91797],["2025-12-11",88582],["2025-12-14",85833],["2025-12-15",87574],["2025-12-16",85871],["2025-12-17",84635],["2025-12-18",88221],["2025-12-21",88291],["2025-12-22",87655],["2025-12-23",87478],["2025-12-24",87840],["2025-12-25",87462],["2025-12-28",87092],["2025-12-29",87827],["2025-12-30",87548],["2025-12-31",88152],["2026-01-01",91266],["2026-01-04",94169],["2026-01-05",92460],["2026-01-06",90930],["2026-01-07",90819],["2026-01-08",90560],["2026-01-11",91400],["2026-01-12",94409],["2026-01-13",97631],["2026-01-14",95229],["2026-01-15",95275],["2026-01-18",93073],["2026-01-19",89638],["2026-01-20",90107],["2026-01-21",89333],["2026-01-22",86533],["2026-01-25",87514],["2026-01-26",89276],["2026-01-27",88979],["2026-01-28",84092],["2026-01-29",77016],["2026-02-01",77932],["2026-02-02",76361],["2026-02-03",73332],["2026-02-04",63613],["2026-02-05",70797],["2026-02-08",70717],["2026-02-09",68702],["2026-02-10",67502],["2026-02-11",65323],["2026-02-12",68413],["2026-02-15",68479],["2026-02-16",67764],["2026-02-17",66222],["2026-02-18",67084],["2026-02-19",67346],["2026-02-22",64444],["2026-02-23",64477],["2026-02-24",69161],["2026-02-25",67416],["2026-02-26",65304],["2026-03-01",69117],["2026-03-02",68240],["2026-03-03",73084],["2026-03-04",71254],["2026-03-05",67317],["2026-03-08",68999],["2026-03-09",70061],["2026-03-10",70672],["2026-03-11",70450],["2026-03-12",71565],["2026-03-15",73947],["2026-03-16",74545],["2026-03-17",71065],["2026-03-18",70268],["2026-03-19",68193],["2026-03-22",70672],["2026-03-23",69311],["2026-03-24",70841],["2026-03-25",68481],["2026-03-26",66285],["2026-03-29",66476],["2026-03-30",67809],["2026-03-31",68167],["2026-04-01",66969],["2026-04-02",67313],["2026-04-05",69746],["2026-04-06",69012],["2026-04-07",71316],["2026-04-08",72127],["2026-04-09",71121],["2026-04-12",73382],["2026-04-13",74277],["2026-04-14",75013],["2026-04-15",75369],["2026-04-16",74994],["2026-04-19",76338],["2026-04-20",75018],["2026-04-21",78874],["2026-04-22",77734],["2026-04-23",78255],["2026-04-26",76865],["2026-04-27",76311],["2026-04-28",75549],["2026-04-29",76401],["2026-04-30",78767],["2026-05-03",80050],["2026-05-04",81612],["2026-05-05",81458],["2026-05-06",80122],["2026-05-07",81421],["2026-05-10",81948],["2026-05-11",80808],["2026-05-12",79621],["2026-05-13",81423],["2026-05-14",78372],["2026-05-17",76834],["2026-05-18",76743],["2026-05-19",77594],["2026-05-20",77624],["2026-05-21",76700],["2026-05-24",77395],["2026-05-25",75929],["2026-05-26",74947],["2026-05-27",73285],["2026-05-28",73451],["2026-05-31",71490],["2026-06-01",67242],["2026-06-02",65364],["2026-06-03",63541],["2026-06-04",61296],["2026-06-07",63356],["2026-06-08",62054],["2026-06-09",61873],["2026-06-10",63558],["2026-06-11",63757],["2026-06-14",66569],["2026-06-15",65620],["2026-06-16",64251],["2026-06-17",62869],["2026-06-18",64132],["2026-06-21",64427],["2026-06-22",62318],["2026-06-23",61163]];

const W = 1000;
const H = 340;
const PAD_L = 56;
const PAD_R = 16;
const PAD_T = 24;
const PAD_B = 36;

function formatUSD(n) {
  return "$" + n.toLocaleString("en-US");
}

function formatDate(d) {
  const [y, m, day] = d.split("-");
  const months = ["ינו׳","פבר׳","מרץ","אפר׳","מאי","יוני","יולי","אוג׳","ספט׳","אוק׳","נוב׳","דצמ׳"];
  return `${day} ${months[parseInt(m, 10) - 1]} ${y}`;
}

export default function BitcoinChart() {
  const [hoverIdx, setHoverIdx] = useState(null);

  const { points, minP, maxP, minIdx, maxIdx, yOf } = useMemo(() => {
    const prices = BTC_USD.map(p => p[1]);
    const minP = Math.min(...prices);
    const maxP = Math.max(...prices);
    const minIdx = prices.indexOf(minP);
    const maxIdx = prices.indexOf(maxP);
    const n = BTC_USD.length;
    const xOf = i => PAD_L + (i / (n - 1)) * (W - PAD_L - PAD_R);
    const yOf = v => PAD_T + (1 - (v - minP) / (maxP - minP)) * (H - PAD_T - PAD_B);
    const points = BTC_USD.map(([date, price], i) => ({ date, price, x: xOf(i), y: yOf(price) }));
    return { points, minP, maxP, minIdx, maxIdx, xOf, yOf };
  }, []);

  const linePath = useMemo(
    () => points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(2)},${p.y.toFixed(2)}`).join(" "),
    [points]
  );

  const areaPath = useMemo(() => {
    const base = H - PAD_B;
    return `${linePath} L${points[points.length - 1].x.toFixed(2)},${base} L${points[0].x.toFixed(2)},${base} Z`;
  }, [linePath, points]);

  const first = BTC_USD[0][1];
  const last = BTC_USD[BTC_USD.length - 1][1];
  const changeAbs = last - first;
  const changePct = (changeAbs / first) * 100;
  const isUp = changeAbs >= 0;
  const trendColor = isUp ? "#34D399" : "#F87171";

  const hovered = hoverIdx !== null ? points[hoverIdx] : null;

  const handleMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - rect.left) / rect.width) * W;
    let idx = Math.round(((px - PAD_L) / (W - PAD_L - PAD_R)) * (points.length - 1));
    idx = Math.max(0, Math.min(points.length - 1, idx));
    setHoverIdx(idx);
  };

  const yGridValues = [minP, (minP + maxP) / 2, maxP];

  return (
    <div style={{
      background: "rgba(13,24,41,0.8)",
      border: "1px solid rgba(255,255,255,0.06)",
      borderRadius: 16,
      padding: "22px",
      marginBottom: 26,
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 14, marginBottom: 18 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontSize: 20 }}>₿</span>
            <h2 style={{ margin: 0, fontSize: 16, fontWeight: 800, color: "#CBD5E1" }}>
              ביטקוין מול דולר ארה״ב — 12 החודשים האחרונים
            </h2>
          </div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 4 }}>
            {formatDate(BTC_USD[0][0])} – {formatDate(BTC_USD[BTC_USD.length - 1][0])} · נתוני שווי סגירה יומי
          </div>
        </div>

        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <Stat label="מחיר נוכחי" value={formatUSD(last)} color="#F7931A" />
          <Stat label="שינוי שנתי" value={`${isUp ? "+" : ""}${changePct.toFixed(1)}%`} color={trendColor} />
          <Stat label="שפל" value={formatUSD(minP)} color="#F87171" />
          <Stat label="שיא" value={formatUSD(maxP)} color="#34D399" />
        </div>
      </div>

      <div style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ width: "100%", height: "auto", display: "block", cursor: "crosshair" }}
          onMouseMove={handleMove}
          onMouseLeave={() => setHoverIdx(null)}
        >
          <defs>
            <linearGradient id="btcFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F7931A" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#F7931A" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* gridlines + y labels */}
          {yGridValues.map((v, i) => {
            const y = yOf(v);
            return (
              <g key={i}>
                <line x1={PAD_L} x2={W - PAD_R} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="4 4" />
                <text x={PAD_L - 8} y={y} textAnchor="end" dominantBaseline="middle" fontSize="11" fill="#475569">
                  {formatUSD(Math.round(v))}
                </text>
              </g>
            );
          })}

          {/* area + line */}
          <path d={areaPath} fill="url(#btcFill)" />
          <path d={linePath} fill="none" stroke="#F7931A" strokeWidth="2" />

          {/* min/max markers */}
          <circle cx={points[minIdx].x} cy={points[minIdx].y} r="4" fill="#0D1829" stroke="#F87171" strokeWidth="2" />
          <circle cx={points[maxIdx].x} cy={points[maxIdx].y} r="4" fill="#0D1829" stroke="#34D399" strokeWidth="2" />

          {/* x labels: first / last */}
          <text x={PAD_L} y={H - 10} fontSize="11" fill="#475569" textAnchor="start">
            {formatDate(points[0].date)}
          </text>
          <text x={W - PAD_R} y={H - 10} fontSize="11" fill="#475569" textAnchor="end">
            {formatDate(points[points.length - 1].date)}
          </text>

          {/* hover crosshair */}
          {hovered && (
            <g>
              <line x1={hovered.x} x2={hovered.x} y1={PAD_T} y2={H - PAD_B} stroke="rgba(247,147,26,0.4)" />
              <circle cx={hovered.x} cy={hovered.y} r="5" fill="#F7931A" stroke="#0D1829" strokeWidth="2" />
            </g>
          )}
        </svg>

        {hovered && (
          <div style={{
            position: "absolute",
            top: 4,
            ...(hovered.x > W / 2 ? { left: 16 } : { right: 16 }),
            background: "rgba(6,11,24,0.95)",
            border: "1px solid rgba(247,147,26,0.35)",
            borderRadius: 10,
            padding: "8px 12px",
            pointerEvents: "none",
            minWidth: 130,
          }}>
            <div style={{ fontSize: 10, color: "#64748B", marginBottom: 2 }}>{formatDate(hovered.date)}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: "#F7931A" }}>{formatUSD(hovered.price)}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value, color }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      padding: "8px 16px", borderRadius: 12,
      background: `${color}1A`,
      border: `1px solid ${color}40`,
      minWidth: 88,
    }}>
      <span style={{ fontSize: 16, fontWeight: 900, color, lineHeight: 1.2, direction: "ltr", unicodeBidi: "isolate" }}>{value}</span>
      <span style={{ fontSize: 10, color: "#64748B", fontWeight: 600, marginTop: 2 }}>{label}</span>
    </div>
  );
}
