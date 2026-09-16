/* CurvedInput geometry adapted from React Bits, Copyright (c) 2026 David Haz. License: licenses/react-bits.txt. */
(()=>{const DEG=180/Math.PI;const round2=n=>Math.round(n*100)/100;
const buildGeometry = (width, bend, thickness, pad) => {
  const W = width;
  const T = thickness;
  const s = Math.max(-W * 0.35, Math.min(bend, W * 0.35));
  const a = Math.abs(s);
  const dir = s >= 0 ? 1 : -1;
  const svgH = T + a + pad * 2;

  if (a < 0.75) {
    const midY = pad + T / 2;
    return {
      straight: true,
      W,
      T,
      svgH,
      uPerLen: 1,
      point: (u, v) => [u, midY + v],
      angleAt: () => 0,
      uFromPoint: x => x
    };
  }

  const R = (W * W * 0.25 + a * a) / (2 * a);
  const cx = W / 2;
  const apexY = pad + T / 2 + (dir > 0 ? 0 : a);
  const cy = apexY + dir * R;
  const phi = Math.asin(Math.min(1, W / (2 * R)));

  return {
    straight: false,
    W,
    T,
    svgH,
    R,
    dir,
    uPerLen: W / (2 * R * phi),
    point: (u, v) => {
      const th = ((u - cx) / cx) * phi;
      const rho = R - dir * v;
      return [cx + rho * Math.sin(th), cy - dir * rho * Math.cos(th)];
    },
    angleAt: u => dir * ((u - cx) / cx) * phi * DEG,
    uFromPoint: (x, y) => {
      const th = Math.atan2(x - cx, dir * (cy - y));
      return cx + (th / phi) * cx;
    }
  };
};

const fmt = (g, u, v) => {
  const [x, y] = g.point(u, v);
  return `${round2(x)} ${round2(y)}`;
};

// Segment along a constant-v edge, as a circular arc (or a line when flat)
const edgeSeg = (g, uTo, v, ltr) => {
  if (g.straight) return `L ${fmt(g, uTo, v)}`;
  const rho = round2(g.R - g.dir * v);
  const sweep = ltr === g.dir > 0 ? 1 : 0;
  return `A ${rho} ${rho} 0 0 ${sweep} ${fmt(g, uTo, v)}`;
};

// A rectangle bent along the arc: circular top/bottom edges, radial end caps
// and quadratic rounded corners.
const bentRectPath = (g, u0, u1, vTop, vBot, radius) => {
  const rc = Math.max(0, Math.min(radius, (vBot - vTop) / 2, (u1 - u0) / 2));
  return [
    `M ${fmt(g, u0 + rc, vTop)}`,
    edgeSeg(g, u1 - rc, vTop, true),
    `Q ${fmt(g, u1, vTop)} ${fmt(g, u1, vTop + rc)}`,
    `L ${fmt(g, u1, vBot - rc)}`,
    `Q ${fmt(g, u1, vBot)} ${fmt(g, u1 - rc, vBot)}`,
    edgeSeg(g, u0 + rc, vBot, false),
    `Q ${fmt(g, u0, vBot)} ${fmt(g, u0, vBot - rc)}`,
    `L ${fmt(g, u0, vTop + rc)}`,
    `Q ${fmt(g, u0, vTop)} ${fmt(g, u0 + rc, vTop)}`,
    'Z'
  ].join(' ');
};

const bentLinePath = (g, u0, u1, v) => `M ${fmt(g, u0, v)} ${edgeSeg(g, u1, v, true)}`;


const ns='http://www.w3.org/2000/svg';document.querySelectorAll('.curved-whatsapp').forEach((a,index)=>{const svg=document.createElementNS(ns,'svg');svg.setAttribute('viewBox','-10 -10 500 150');svg.setAttribute('aria-hidden','true');const g=buildGeometry(480,26,68,10),shape=document.createElementNS(ns,'path');shape.setAttribute('d',bentRectPath(g,0,480,-34,34,32));shape.setAttribute('class','curved-surface');const path=document.createElementNS(ns,'path');path.id='whatsapp-arc-'+index;path.setAttribute('d',bentLinePath(g,0,480,7));path.setAttribute('fill','none');const text=document.createElementNS(ns,'text');text.setAttribute('text-anchor','middle');text.setAttribute('direction','rtl');text.setAttribute('font-size','22');text.setAttribute('font-weight','700');const tp=document.createElementNS(ns,'textPath');tp.setAttribute('href','#'+path.id);tp.setAttribute('startOffset','50%');tp.textContent='בואו נדבר בוואטסאפ ↗';text.append(tp);svg.append(shape,path,text);a.replaceChildren(svg);a.setAttribute('aria-label','בואו נדבר בוואטסאפ');a.classList.add('curve-ready');});
})();
