import { useState, useEffect, useRef } from "react";
import * as d3 from "d3";

const COUNTRY_NAMES = {
  4:"Afghanistan",8:"Albania",12:"Algeria",24:"Angola",32:"Argentina",36:"Australia",
  40:"Austria",50:"Bangladesh",56:"Belgium",64:"Bhutan",68:"Bolivia",76:"Brazil",
  100:"Bulgaria",104:"Myanmar",112:"Belarus",116:"Cambodia",120:"Cameroon",124:"Canada",
  144:"Sri Lanka",148:"Chad",152:"Chile",156:"China",170:"Colombia",178:"Congo",
  180:"DR Congo",188:"Costa Rica",191:"Croatia",192:"Cuba",203:"Czech Republic",
  204:"Benin",208:"Denmark",214:"Dominican Rep.",218:"Ecuador",222:"El Salvador",
  231:"Ethiopia",233:"Estonia",246:"Finland",250:"France",276:"Germany",288:"Ghana",
  300:"Greece",320:"Guatemala",324:"Guinea",332:"Haiti",340:"Honduras",348:"Hungary",
  356:"India",360:"Indonesia",364:"Iran",368:"Iraq",372:"Ireland",376:"Israel",
  380:"Italy",384:"Côte d'Ivoire",388:"Jamaica",392:"Japan",398:"Kazakhstan",
  400:"Jordan",404:"Kenya",410:"South Korea",414:"Kuwait",418:"Laos",422:"Lebanon",
  426:"Lesotho",428:"Latvia",430:"Liberia",434:"Libya",440:"Lithuania",450:"Madagascar",
  454:"Malawi",458:"Malaysia",466:"Mali",484:"Mexico",498:"Moldova",504:"Morocco",
  508:"Mozambique",512:"Oman",516:"Namibia",524:"Nepal",528:"Netherlands",
  554:"New Zealand",558:"Nicaragua",562:"Niger",566:"Nigeria",578:"Norway",
  586:"Pakistan",591:"Panama",600:"Paraguay",604:"Peru",608:"Philippines",
  616:"Poland",620:"Portugal",634:"Qatar",642:"Romania",643:"Russia",682:"Saudi Arabia",
  686:"Senegal",694:"Sierra Leone",703:"Slovakia",704:"Vietnam",705:"Slovenia",
  706:"Somalia",710:"South Africa",716:"Zimbabwe",724:"Spain",729:"Sudan",
  740:"Suriname",752:"Sweden",756:"Switzerland",760:"Syria",764:"Thailand",
  768:"Togo",780:"Trinidad & Tobago",784:"UAE",788:"Tunisia",792:"Turkey",
  800:"Uganda",804:"Ukraine",818:"Egypt",826:"United Kingdom",834:"Tanzania",
  840:"United States",854:"Burkina Faso",858:"Uruguay",860:"Uzbekistan",
  862:"Venezuela",887:"Yemen"
};

// [CO2_tier, HDI_tier]: 1=low, 2=mid, 3=high
const DATA = {
  840:[3,3],124:[3,3],36:[3,3],784:[3,3],414:[3,3],634:[3,3],512:[3,2],
  682:[3,2],643:[3,2],398:[3,2],368:[2,1],780:[2,3],
  250:[1,3],752:[1,3],578:[1,3],188:[1,3],152:[1,3],
  276:[2,3],826:[2,3],380:[2,3],724:[2,3],528:[2,3],756:[2,3],40:[2,3],
  56:[2,3],372:[2,3],246:[2,3],208:[2,3],616:[2,3],620:[2,3],203:[2,3],
  300:[2,3],191:[2,3],703:[2,3],705:[2,3],233:[2,3],428:[2,3],440:[2,3],
  376:[2,3],392:[2,3],410:[2,3],458:[2,3],554:[2,3],32:[2,3],858:[2,3],
  348:[2,2],642:[2,2],100:[2,2],112:[2,2],804:[2,2],792:[2,2],862:[2,2],
  156:[2,2],364:[2,2],422:[2,2],710:[2,2],566:[1,2],
  484:[1,2],76:[1,2],170:[1,2],604:[1,2],218:[1,2],68:[1,2],600:[1,2],
  740:[1,2],591:[1,2],356:[1,2],360:[1,2],764:[1,2],704:[1,2],50:[1,2],
  144:[1,2],608:[1,2],504:[1,2],788:[1,2],12:[1,2],434:[1,2],818:[1,2],
  516:[1,2],72:[1,2],860:[1,2],400:[1,2],192:[1,2],214:[1,2],388:[1,2],
  320:[1,2],222:[1,2],558:[1,2],498:[1,2],
  586:[1,1],524:[1,1],104:[1,1],116:[1,1],418:[1,1],4:[1,1],887:[1,1],
  760:[1,1],706:[1,1],729:[1,1],231:[1,1],800:[1,1],834:[1,1],508:[1,1],
  454:[1,1],716:[1,1],686:[1,1],324:[1,1],384:[1,1],854:[1,1],466:[1,1],
  562:[1,1],148:[1,1],694:[1,1],430:[1,1],768:[1,1],204:[1,1],120:[1,1],
  178:[1,1],180:[1,1],450:[1,1],24:[1,1],332:[1,1],340:[1,1],288:[1,1],
};

// COLOR_GRID[hdiRow 0=low..2=high][co2Col 0=low..2=high]
const COLOR_GRID = [
  ["#e8e8e8","#e4acac","#c85a5a"],
  ["#b0d5df","#ad9ea5","#985356"],
  ["#64acbe","#627f8c","#574249"],
];

const getColor = (co2, hdi) => (!co2||!hdi) ? "grey" : COLOR_GRID[hdi-1][co2-1];
const TIER = ["Low","Mid","High"];

export default function BivariateMap() {
  const containerRef = useRef(null);
  const svgRef = useRef(null);
  const [tooltip, setTooltip] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const loadScript = (src) => new Promise(res => {
      if (window.topojson) { res(); return; }
      const s = document.createElement("script");
      s.src = src; s.onload = res;
      document.head.appendChild(s);
    });
    (async () => {
      await loadScript("https://unpkg.com/topojson-client@3/dist/topojson-client.min.js");
      const world = await fetch("https://unpkg.com/world-atlas@2/countries-110m.json").then(r => r.json());
      draw(world);
      setReady(true);
    })();
  }, []);

  const draw = (world) => {
    const container = containerRef.current;
    const W = container.clientWidth;
    const H = Math.round(W * 0.52);
    const svg = d3.select(svgRef.current).attr("width", W).attr("height", H);
    svg.selectAll("*").remove();

    const proj = d3.geoNaturalEarth1().scale(W / 6.4).translate([W / 2, H / 2]);
    const path = d3.geoPath().projection(proj);

    const sphere = { type: "Sphere" };
    svg.append("path").datum(sphere).attr("d", path)
      .attr("fill", "#none").attr("stroke", "none");

    const countries = window.topojson.feature(world, world.objects.countries);
    const mesh = window.topojson.mesh(world, world.objects.countries, (a, b) => a !== b);

    const g = svg.append("g");
    g.selectAll("path")
      .data(countries.features)
      .join("path")
      .attr("d", path)
      .attr("fill", d => { const e = DATA[+d.id]; return getColor(e?.[0], e?.[1]); })
      .attr("stroke", "none")
      .attr("class", "country")
      .on("mouseenter", (event, d) => {
        d3.select(event.target).raise().attr("stroke","#fff").attr("stroke-width", 1.2);
        const e = DATA[+d.id];
        const name = COUNTRY_NAMES[+d.id];
        if (e && name) setTooltip({ x: event.clientX, y: event.clientY, name, co2: e[0], hdi: e[1], color: getColor(e[0], e[1]) });
      })
      .on("mousemove", ev => setTooltip(p => p ? { ...p, x: ev.clientX, y: ev.clientY } : null))
      .on("mouseleave", ev => { d3.select(ev.target).attr("stroke","none"); setTooltip(null); });

    svg.append("path").datum(mesh).attr("d", path)
      .attr("fill","none").attr("stroke","#0a0a0a").attr("stroke-width", 0.4).attr("pointer-events","none");
  };

  return (
    <div style={{ background:"#0a0a0a", minHeight:"100vh", color:"#d8cfc4",
      fontFamily:"'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif",
      padding:"32px 28px 40px", boxSizing:"border-box" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500&display=swap');
        .country { transition: opacity 0.15s; }
        .country:hover { opacity: 1 !important; }
      `}</style>

      <div style={{ marginBottom:20 }}>
        <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:4,
          color:"#555", textTransform:"uppercase", marginBottom:6 }}>
          Bivariate Choropleth · World
        </div>
        <h1 style={{ fontFamily:"'DM Serif Display',serif", margin:0, fontSize:"clamp(20px,3vw,32px)",
          fontWeight:"normal", color:"#f0e8d8", lineHeight:1.15 }}>
          Human Development vs. CO₂ Emissions
        </h1>
        <p style={{ fontFamily:"'DM Sans',sans-serif", margin:"8px 0 0", fontSize:13,
          color:"#666", lineHeight:1.6, maxWidth:540 }}>
          Each country's color simultaneously encodes two dimensions. Hover any country to explore.
          Approximate tiers based on HDI & IEA data.
        </p>
      </div>

      <div ref={containerRef} style={{ width:"100%", position:"relative", minHeight:280 }}>
        <svg ref={svgRef} style={{ display:"block", width:"100%", borderRadius:6, overflow:"hidden" }} />
        {!ready && (
          <div style={{ position:"absolute", inset:0, display:"flex", alignItems:"center",
            justifyContent:"center", fontFamily:"'DM Sans',sans-serif", fontSize:13, color:"#444" }}>
            Loading map data…
          </div>
        )}
      </div>

      {/* Legend + Key */}
      <div style={{ display:"flex", flexWrap:"wrap", gap:36, marginTop:28, alignItems:"flex-start" }}>

        {/* 3×3 Grid Legend */}
        <div>
          <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, letterSpacing:3,
            color:"#555", textTransform:"uppercase", marginBottom:14 }}>Legend</div>
          <div style={{ display:"flex", alignItems:"flex-end", gap:10 }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center",
              marginBottom:22, gap:2 }}>
              {["High","Mid","Low"].map(l => (
                <div key={l} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10,
                  color:"#555", height:28, display:"flex", alignItems:"center",
                  width:32, justifyContent:"flex-end", paddingRight:4 }}>{l}</div>
              ))}
            </div>
            <div>
              <div style={{ display:"grid", gridTemplateColumns:"repeat(3,28px)",
                gridTemplateRows:"repeat(3,28px)", gap:3 }}>
                {[2,1,0].map(row => [0,1,2].map(col => (
                  <div key={`${row}-${col}`} style={{ borderRadius:3, background:COLOR_GRID[row][col] }} />
                )))}
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:5 }}>
                {["Low","","High"].map((l,i) => (
                  <div key={i} style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#555", width:28, textAlign: i===1?"center":"left" }}>{l}</div>
                ))}
              </div>
              <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#555",
                textAlign:"center", marginTop:2 }}>CO₂ per capita →</div>
            </div>
            <div style={{ writingMode:"vertical-rl", transform:"rotate(180deg)",
              fontFamily:"'DM Sans',sans-serif", fontSize:10, color:"#555",
              letterSpacing:1, marginBottom:22 }}>
              HDI →
            </div>
          </div>
        </div>

        {/* Color Callouts */}
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"8px 24px", alignContent:"start" }}>
          {[
            { c:"#64acbe", label:"High HDI · Low CO₂", note:"Ideal: developed & clean" },
            { c:"#574249", label:"High HDI · High CO₂", note:"Rich but high-emitting" },
            { c:"#e8e8e8", label:"Low HDI · Low CO₂", note:"Developing, low footprint" },
            { c:"#c85a5a", label:"Low HDI · High CO₂", note:"Fossil-dependent & poor" },
          ].map(({ c, label, note }) => (
            <div key={c} style={{ display:"flex", gap:8, alignItems:"flex-start" }}>
              <div style={{ width:12, height:12, borderRadius:2, background:c,
                marginTop:2, flexShrink:0 }} />
              <div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:12,
                  color:"#ccc", fontWeight:500 }}>{label}</div>
                <div style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#555" }}>{note}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:2 }}>
          <div style={{ width:12, height:12, borderRadius:2, background:"#1e1e1e", border:"1px solid #333" }} />
          <span style={{ fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#444" }}>No data</span>
        </div>
      </div>

      <div style={{ marginTop:28, borderTop:"1px solid #1c1c1c", paddingTop:16,
        fontFamily:"'DM Sans',sans-serif", fontSize:11, color:"#3a3a3a" }}>
        Data sources: UNDP Human Development Report · IEA CO₂ Emissions (approximate tiers) ·
        Map: Natural Earth via world-atlas
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div style={{
          position:"fixed", left:tooltip.x+14, top:tooltip.y-8,
          background:"#111", border:`1.5px solid ${tooltip.color}66`,
          borderRadius:8, padding:"12px 16px", pointerEvents:"none",
          zIndex:9999, minWidth:190,
          boxShadow:"0 8px 32px rgba(0,0,0,0.7)",
          fontFamily:"'DM Sans',sans-serif"
        }}>
          <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:10 }}>
            <div style={{ width:10, height:10, borderRadius:2, background:tooltip.color, flexShrink:0 }} />
            <div style={{ fontWeight:600, color:"#f0e8d8", fontSize:14 }}>{tooltip.name}</div>
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"auto 1fr", gap:"4px 12px", fontSize:12 }}>
            <span style={{ color:"#666" }}>HDI tier</span>
            <span style={{ color:"#ccc" }}>{TIER[tooltip.hdi-1]}</span>
            <span style={{ color:"#666" }}>CO₂ tier</span>
            <span style={{ color:"#ccc" }}>{TIER[tooltip.co2-1]}</span>
          </div>
        </div>
      )}
    </div>
  );
}