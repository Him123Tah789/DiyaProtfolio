const labelFont = "Inter, Segoe UI, Arial, sans-serif";
const titleFont = "Georgia, 'Times New Roman', serif";

export default function WorkflowFigure() {
  return (
    <main className="min-h-screen bg-[#fbf8ff] px-4 py-6 text-[#2a2036]">
      <div className="mx-auto w-full max-w-[1366px] overflow-hidden rounded-[28px] bg-white shadow-[0_24px_80px_rgba(146,113,176,0.14)]">
        <svg
          viewBox="0 0 1366 768"
          className="h-auto w-full"
          role="img"
          aria-labelledby="workflow-title workflow-desc"
        >
          <title id="workflow-title">Adversarial email workflow diagram</title>
          <desc id="workflow-desc">
            A multi-stage diagram showing query input, PPO training, attack pool generation,
            self-reflective reinforcement learning, evaluation, and online blue-team retraining.
          </desc>

          <defs>
            <linearGradient id="pinkPanel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#ffe6ed" />
              <stop offset="100%" stopColor="#ffd8df" />
            </linearGradient>
            <linearGradient id="bluePanel" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e7efff" />
              <stop offset="100%" stopColor="#dbe9ff" />
            </linearGradient>
            <linearGradient id="redHeader" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ea6f73" />
              <stop offset="100%" stopColor="#cf5961" />
            </linearGradient>
            <linearGradient id="softBlue" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f6f9ff" />
              <stop offset="100%" stopColor="#e8f2ff" />
            </linearGradient>
            <linearGradient id="softGreen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#e8f5ec" />
              <stop offset="100%" stopColor="#dff0e4" />
            </linearGradient>
            <linearGradient id="softYellow" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff6dd" />
              <stop offset="100%" stopColor="#f5e8b8" />
            </linearGradient>
            <marker id="arrowPink" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#c97272" />
            </marker>
            <marker id="arrowGreen" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8ab47a" />
            </marker>
            <marker id="arrowGray" viewBox="0 0 10 10" refX="8.5" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" fill="#8c8c8c" />
            </marker>
            <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#c5b0d9" floodOpacity="0.28" />
            </filter>
            <filter id="lightShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#b9a3ce" floodOpacity="0.18" />
            </filter>
          </defs>

          <rect x="14" y="14" width="1338" height="740" rx="14" fill="#fffdfd" stroke="#d8d0df" strokeDasharray="8 8" />

          <g filter="url(#shadow)">
            <rect x="24" y="26" width="321" height="205" rx="18" fill="url(#pinkPanel)" />
            <rect x="479" y="26" width="426" height="205" rx="18" fill="url(#pinkPanel)" />
            <rect x="912" y="26" width="422" height="239" rx="18" fill="url(#bluePanel)" />
            <rect x="24" y="336" width="759" height="113" rx="18" fill="url(#pinkPanel)" />
            <rect x="788" y="336" width="429" height="113" rx="18" fill="url(#bluePanel)" />
            <rect x="24" y="522" width="430" height="199" rx="18" fill="url(#pinkPanel)" />
            <rect x="481" y="522" width="291" height="199" rx="18" fill="url(#bluePanel)" />
            <rect x="836" y="522" width="505" height="199" rx="18" fill="url(#bluePanel)" />
          </g>

          <g>
            <rect x="34" y="38" width="300" height="45" rx="12" fill="#f5bcc6" />
            <text x="90" y="70" fill="#322638" fontFamily={titleFont} fontSize="26" fontWeight="700">Query</text>
            <text x="36" y="54" fontFamily={labelFont} fontSize="24">🎩</text>
            <text x="72" y="73" fontFamily={labelFont} fontSize="18">💻</text>

            <rect x="34" y="85" width="300" height="132" rx="13" fill="#fff5f7" fillOpacity="0.88" />
            <text x="47" y="122" fill="#423444" fontFamily={labelFont} fontSize="16">
              <tspan x="47" dy="0">Urgent: Your account security</tspan>
              <tspan x="47" dy="22">needs verification immediately.</tspan>
              <tspan x="47" dy="30">Please click the link below</tspan>
              <tspan x="47" dy="22">to update your information to prevent</tspan>
              <tspan x="47" dy="22">suspension.</tspan>
            </text>
            <text x="265" y="138" fontFamily={labelFont} fontSize="26">📄</text>
            <text x="279" y="124" fontFamily={labelFont} fontSize="18">✉</text>
          </g>

          <g>
            <rect x="489" y="37" width="270" height="44" rx="11" fill="url(#redHeader)" />
            <text x="538" y="67" fill="#fff" fontFamily={labelFont} fontSize="22" fontWeight="700">PPO Training</text>
            <text x="499" y="64" fontFamily={labelFont} fontSize="20">🤖</text>

            <rect x="502" y="90" width="246" height="125" rx="11" fill="#fff7f7" />
            <text x="519" y="123" fill="#4a3d49" fontFamily={labelFont} fontSize="19">⚙  →  ◉   Advantage</text>
            <text x="519" y="156" fill="#4a3d49" fontFamily={labelFont} fontSize="19">☑  →  🏆  Policy Update</text>
            <text x="519" y="189" fill="#4a3d49" fontFamily={labelFont} fontSize="19">☒  →  📘  Value Update</text>
          </g>

          <g>
            <text x="1002" y="60" fill="#344" fontFamily={titleFont} fontSize="28" fontWeight="700">(b) Workflow</text>
            <text x="1028" y="113" fill="#2a2036" fontFamily={titleFont} fontSize="30" fontWeight="700">Attack Pool</text>

            <g filter="url(#lightShadow)">
              <rect x="944" y="129" width="112" height="115" rx="10" fill="#e8f2df" />
              <rect x="1071" y="129" width="112" height="115" rx="10" fill="#ddefff" />
              <rect x="1197" y="129" width="112" height="115" rx="10" fill="#ecf0ff" />
            </g>

            <text x="959" y="156" fontFamily={labelFont} fontSize="28">📄</text>
            <text x="989" y="156" fontFamily={labelFont} fontSize="20">💬</text>
            <text x="954" y="198" fill="#3b4a35" fontFamily={labelFont} fontSize="18">
              <tspan x="954" dy="0">Synonym</tspan>
              <tspan x="954" dy="20">Substitution</tspan>
            </text>

            <text x="1098" y="156" fontFamily={labelFont} fontSize="27">📑</text>
            <text x="1121" y="157" fontFamily={labelFont} fontSize="26">✉</text>
            <text x="1102" y="198" fill="#42546f" fontFamily={labelFont} fontSize="18">
              <tspan x="1102" dy="0">Text</tspan>
              <tspan x="1102" dy="20">Paraphrasing</tspan>
            </text>

            <text x="1227" y="156" fontFamily={labelFont} fontSize="28">📧</text>
            <text x="1247" y="161" fontFamily={labelFont} fontSize="18">☠</text>
            <text x="1216" y="198" fill="#5a3b46" fontFamily={labelFont} fontSize="17">
              <tspan x="1216" dy="0">GAN-based</tspan>
              <tspan x="1216" dy="20">Phishing</tspan>
            </text>
          </g>

          <g>
            <rect x="72" y="266" width="92" height="54" rx="27" fill="#f7e3b9" stroke="#d0a15d" />
            <text x="80" y="302" fill="#4b3822" fontFamily={titleFont} fontSize="24">Advantage</text>
            <line x1="118" y1="320" x2="118" y2="335" stroke="#bf7a6b" strokeWidth="4" markerEnd="url(#arrowPink)" />

            <rect x="27" y="349" width="194" height="88" rx="14" fill="#fff4f7" />
            <text x="39" y="394" fontFamily={labelFont} fontSize="18" fill="#3a3344">State &amp; Feed</text>
            <text x="50" y="372" fontFamily={labelFont} fontSize="26">⚙</text>
            <text x="77" y="374" fontFamily={labelFont} fontSize="26">🤖</text>
            <text x="104" y="374" fontFamily={labelFont} fontSize="26">🔗</text>
            <text x="23" y="387" fontFamily={labelFont} fontSize="22">🧠</text>

            <rect x="207" y="366" width="97" height="48" rx="8" fill="#dff0d9" stroke="#a1c28d" />
            <text x="230" y="396" fill="#435f37" fontFamily={titleFont} fontSize="23">Reward</text>

            <text x="306" y="392" fill="#7d5a34" fontFamily={labelFont} fontSize="18">Success</text>
            <text x="306" y="412" fill="#7d5a34" fontFamily={labelFont} fontSize="18">Confidence</text>
            <text x="306" y="432" fill="#7d5a34" fontFamily={labelFont} fontSize="18">Drop</text>
            <path d="M 298 401 L 305 401 L 305 437 L 332 437" fill="none" stroke="#d0a15d" strokeWidth="3" markerEnd="url(#arrowGreen)" />

            <rect x="444" y="367" width="104" height="56" rx="10" fill="#f7e3b9" stroke="#d0a15d" />
            <text x="461" y="403" fill="#4b3822" fontFamily={titleFont} fontSize="22">Advantage</text>
            <line x1="404" y1="395" x2="444" y2="395" stroke="#85ab72" strokeWidth="5" markerEnd="url(#arrowGreen)" />

            <rect x="562" y="362" width="74" height="64" rx="8" fill="#d8eed8" />
            <rect x="571" y="370" width="19" height="12" rx="2" fill="#fff" opacity="0.8" />
            <rect x="595" y="370" width="32" height="12" rx="2" fill="#fff" opacity="0.8" />
            <rect x="571" y="388" width="19" height="12" rx="2" fill="#fff" opacity="0.8" />
            <rect x="595" y="388" width="32" height="12" rx="2" fill="#fff" opacity="0.8" />
            <rect x="571" y="406" width="56" height="8" rx="2" fill="#c3debf" />

            <g transform="translate(652 357)">
              <circle cx="22" cy="22" r="8" fill="#d5f0e4" stroke="#87a7c4" />
              <circle cx="46" cy="14" r="8" fill="#ead6f4" stroke="#87a7c4" />
              <circle cx="48" cy="39" r="8" fill="#ffe6c9" stroke="#87a7c4" />
              <circle cx="72" cy="22" r="8" fill="#dfe8ff" stroke="#87a7c4" />
              <circle cx="14" cy="53" r="8" fill="#dff1d8" stroke="#87a7c4" />
              <circle cx="38" cy="62" r="8" fill="#f9ddea" stroke="#87a7c4" />
              <circle cx="68" cy="56" r="8" fill="#ffe8c6" stroke="#87a7c4" />
              <line x1="22" y1="22" x2="46" y2="14" stroke="#7f8ea3" strokeWidth="2" />
              <line x1="22" y1="22" x2="48" y2="39" stroke="#7f8ea3" strokeWidth="2" />
              <line x1="46" y1="14" x2="72" y2="22" stroke="#7f8ea3" strokeWidth="2" />
              <line x1="48" y1="39" x2="72" y2="22" stroke="#7f8ea3" strokeWidth="2" />
              <line x1="14" y1="53" x2="38" y2="62" stroke="#7f8ea3" strokeWidth="2" />
              <line x1="38" y1="62" x2="68" y2="56" stroke="#7f8ea3" strokeWidth="2" />
            </g>

            <rect x="743" y="356" width="82" height="80" rx="20" fill="#eff6fc" stroke="#9ec0d8" />
            <text x="761" y="405" fill="#39536d" fontFamily={titleFont} fontSize="28">BERT</text>
            <text x="762" y="430" fill="#39536d" fontFamily={titleFont} fontSize="18">Model</text>

            <line x1="832" y1="392" x2="892" y2="392" stroke="#7ba082" strokeWidth="4" markerEnd="url(#arrowGreen)" />
            <rect x="899" y="368" width="76" height="52" rx="8" fill="#edf5ff" />
            <rect x="988" y="341" width="150" height="94" rx="10" fill="#eef6ff" />
            <rect x="1004" y="353" width="44" height="42" rx="4" fill="#fff" stroke="#b8cbe1" />
            <rect x="1054" y="352" width="72" height="42" rx="4" fill="#b5d2e3" stroke="#8eb0c8" />
            <rect x="1010" y="398" width="108" height="11" rx="4" fill="#a5b7d1" opacity="0.45" />
            <text x="989" y="429" fill="#39536d" fontFamily={labelFont} fontSize="19" fontWeight="700">Bekt Model</text>
            <line x1="975" y1="395" x2="898" y2="395" stroke="#7ba082" strokeWidth="3" markerEnd="url(#arrowGreen)" />

            <line x1="742" y1="324" x2="742" y2="336" stroke="#c97f7f" strokeWidth="4" markerEnd="url(#arrowPink)" />
            <line x1="499" y1="252" x2="499" y2="336" stroke="#c97f7f" strokeWidth="4" markerEnd="url(#arrowPink)" />
            <line x1="541" y1="252" x2="541" y2="336" stroke="#7ea572" strokeWidth="4" markerEnd="url(#arrowGreen)" />
            <path d="M 756 240 C 756 286, 872 286, 872 336" fill="none" stroke="#c97f7f" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrowPink)" />
            <path d="M 335 311 C 440 311, 443 276, 443 276" fill="none" stroke="#c97f7f" strokeWidth="4" strokeDasharray="7 7" markerEnd="url(#arrowPink)" />
            <path d="M 1105 250 C 1105 304, 1278 278, 1278 342" fill="none" stroke="#7ea572" strokeWidth="4" strokeDasharray="8 8" markerEnd="url(#arrowGreen)" />
          </g>

          <g>
            <text x="56" y="487" fill="#c87d6d" fontFamily={titleFont} fontSize="24">Succesd</text>
            <text x="148" y="487" fill="#c87d6d" fontFamily={titleFont} fontSize="24">Confidence</text>
            <text x="150" y="513" fill="#c87d6d" fontFamily={titleFont} fontSize="24">Drop</text>
          </g>

          <g>
            <rect x="92" y="546" width="83" height="54" rx="8" fill="#ddecd6" stroke="#a1ba8a" />
            <text x="105" y="579" fill="#435f37" fontFamily={labelFont} fontSize="20">State</text>
            <text x="90" y="602" fill="#435f37" fontFamily={labelFont} fontSize="20">Extraction</text>
            <text x="31" y="583" fontFamily={labelFont} fontSize="18">⚙️ 🗂️</text>
            <line x1="175" y1="573" x2="260" y2="573" stroke="#59604a" strokeWidth="3" markerEnd="url(#arrowGray)" />
            <line x1="256" y1="572" x2="256" y2="595" stroke="#59604a" strokeWidth="3" markerEnd="url(#arrowGray)" />
            <rect x="246" y="590" width="151" height="52" rx="8" fill="#dfeedd" stroke="#abc19f" />
            <text x="286" y="625" fill="#435f37" fontFamily={titleFont} fontSize="28">Evaluation</text>
            <line x1="69" y1="637" x2="245" y2="637" stroke="#b6b6c5" strokeWidth="3" markerEnd="url(#arrowGray)" />
            <text x="33" y="640" fontFamily={labelFont} fontSize="18">🪄</text>
            <text x="102" y="642" fontFamily={labelFont} fontSize="18">🧠</text>
          </g>

          <g>
            <text x="537" y="567" fill="#344" fontFamily={labelFont} fontSize="24">Evaluation</text>
            <text x="551" y="548" fontFamily={labelFont} fontSize="18">🪪  🖥️</text>
            <rect x="531" y="585" width="235" height="98" rx="14" fill="#fffaf3" opacity="0.92" />
            <rect x="546" y="601" width="76" height="55" rx="10" fill="#f8e2ba" stroke="#cda059" />
            <text x="561" y="635" fill="#4b3822" fontFamily={titleFont} fontSize="23">Reward</text>
            <rect x="638" y="599" width="83" height="63" rx="8" fill="#dce8f8" stroke="#a2b8d3" />
            <path d="M 640 607 h 36 l 10 12 v 34 h -46 z" fill="#f7fbff" stroke="#9fb4ce" />
            <line x1="577" y1="674" x2="577" y2="691" stroke="#8ab47a" strokeWidth="3" markerEnd="url(#arrowGreen)" />
            <line x1="620" y1="626" x2="637" y2="626" stroke="#8ab47a" strokeWidth="3" markerEnd="url(#arrowGreen)" />
            <text x="650" y="614" fill="#39536d" fontFamily={labelFont} fontSize="18">State Feedback</text>
          </g>

          <g>
            <text x="855" y="563" fill="#344" fontFamily={titleFont} fontSize="26" fontWeight="700">(c) Online Blue-Team Retraining</text>
            <rect x="853" y="591" width="112" height="54" rx="12" fill="#f4e4ba" stroke="#cda059" />
            <text x="870" y="624" fill="#4b3822" fontFamily={titleFont} fontSize="24">Successful Adversarial</text>
            <text x="871" y="647" fill="#4b3822" fontFamily={titleFont} fontSize="24">Emails</text>
            <text x="872" y="611" fontFamily={labelFont} fontSize="18">📄</text>
            <line x1="971" y1="624" x2="1075" y2="624" stroke="#c9a55d" strokeWidth="3" strokeDasharray="8 8" markerEnd="url(#arrowPink)" />
            <rect x="1078" y="603" width="88" height="70" rx="8" fill="#eaf1ff" stroke="#96afca" />
            <rect x="1090" y="613" width="66" height="39" rx="4" fill="#fff" stroke="#b4c6dc" />
            <rect x="1090" y="654" width="66" height="9" rx="4" fill="#9ab2d0" opacity="0.5" />
            <text x="1093" y="675" fill="#39536d" fontFamily={labelFont} fontSize="18">Retraining</text>
            <line x1="1169" y1="636" x2="1230" y2="636" stroke="#8c8c8c" strokeWidth="3" strokeDasharray="8 8" markerEnd="url(#arrowGray)" />
            <rect x="1235" y="607" width="95" height="62" rx="14" fill="#edf3fb" stroke="#cad8ea" />
            <text x="1268" y="645" fontFamily={labelFont} fontSize="28">🔒</text>
            <text x="1248" y="673" fill="#39536d" fontFamily={labelFont} fontSize="18">Blue Security</text>
            <text x="1260" y="693" fill="#39536d" fontFamily={labelFont} fontSize="18">Update</text>
          </g>

          <g>
            <text x="42" y="531" fill="#2d2138" fontFamily={labelFont} fontSize="18" fontWeight="700">(b) Self-Reflective RL</text>
            <line x1="424" y1="573" x2="481" y2="573" stroke="#86a49a" strokeWidth="4" markerEnd="url(#arrowGreen)" />
            <line x1="771" y1="573" x2="844" y2="573" stroke="#86a49a" strokeWidth="4" markerEnd="url(#arrowGreen)" />
            <path d="M 501 644 C 601 644, 683 644, 772 644" fill="none" stroke="#b6b6c5" strokeWidth="3" strokeDasharray="8 8" />
            <path d="M 772 644 C 861 644, 913 644, 919 644" fill="none" stroke="#b6b6c5" strokeWidth="3" strokeDasharray="8 8" />
            <line x1="1266" y1="591" x2="1266" y2="522" stroke="#86a49a" strokeWidth="4" strokeDasharray="9 9" markerEnd="url(#arrowGreen)" />
          </g>

          <g opacity="0.55">
            <text x="1152" y="447" fill="#7aa0a2" fontFamily={labelFont} fontSize="16">BERT</text>
            <text x="1254" y="446" fill="#7aa0a2" fontFamily={labelFont} fontSize="16">Model</text>
          </g>
        </svg>
      </div>
    </main>
  );
}