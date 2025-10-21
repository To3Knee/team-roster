(function(){
  const STORAGE_KEY = 'teamroster:offline:v1.3.3';
  const uid = () => Math.random().toString(36).slice(2,10);

  let state = {
    title: 'Team Contact Roster',
    backTitle: 'Quick Numbers',
    theme: 'slate',
    fontScale: 1,
    copies: 8,
    members: [{ id: uid(), name:'', phone:'', cell:'' }],
    quick: [{ id: uid(), label:'Help Desk', value:'' }, { id: uid(), label:'Support Line', value:'' }],
  };

  try { const saved = localStorage.getItem(STORAGE_KEY); if (saved) state = { ...state, ...JSON.parse(saved) }; } catch {}
  function save(){ try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {} }

  function el(tag, props={}, ...children){
    const e = document.createElement(tag);
    for (const [k,v] of Object.entries(props)){
      if (k === 'class') e.className = v;
      else if (k.startsWith('on') && typeof v === 'function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k === 'for') e.htmlFor = v;
      else if (k === 'value') e.value = v;
      else e.setAttribute(k, v);
    }
    for (const c of children){ if (c!=null) e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c); }
    return e;
  }
  function move(arr, from, to){ const a=arr.slice(); if(to<0||to>=a.length) return a; const [it]=a.splice(from,1); a.splice(to,0,it); return a; }
  function themedBorder(){ 
    const map = { slate:'#64748b', emerald:'#10b981', indigo:'#6366f1', rose:'#f43f5e', amber:'#f59e0b' };
    return map[state.theme] || '#64748b';
  }
  function themedBG(){
    const map = {
      slate: 'linear-gradient(135deg, #1f2937, #0b1220)',
      emerald: 'linear-gradient(135deg, #065f46, #052e2b)',
      indigo: 'linear-gradient(135deg, #3730a3, #0f0a3a)',
      rose: 'linear-gradient(135deg, #9f1239, #3b0717)',
      amber: 'linear-gradient(135deg, #92400e, #2d1602)',
    };
    return map[state.theme] || map.slate;
  }

  // CSV helpers
  function exportMembersCSV(){
    const rows = [['Name','Phone','Cell'], ...state.members.map(m=>[m.name||'', m.phone||'', m.cell||''])];
    const csv = rows.map(r=>r.map(v=>/[",\n]/.test(v)?('"' + v.replace(/"/g,'""') + '"'):v).join(',')).join('\n');
    download(csv, 'team-members.csv', 'text/csv');
  }
  function parseCSVLine(line){
    const out=[]; let cur=''; let q=false;
    for(let i=0;i<line.length;i++){ const ch=line[i];
      if(q){ if(ch=='"' && line[i+1]=='"'){cur+='"';i++;} else if(ch=='"'){q=false;} else {cur+=ch;} }
      else { if(ch===','){ out.push(cur); cur=''; } else if(ch=='"'){ q=true; } else { cur+=ch; } }
    }
    out.push(cur); return out;
  }
  function importMembersCSV(file){
    const r = new FileReader();
    r.onload = () => {
      const text = (r.result||'')+'';
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      const header = lines[0].split(',').map(s=>s.trim().toLowerCase());
      const idxN = header.indexOf('name'), idxP = header.indexOf('phone'), idxC = header.indexOf('cell');
      const out = lines.slice(1).map(line=>{
        const cols = parseCSVLine(line);
        return { id: uid(), name: cols[idxN]||'', phone: cols[idxP]||'', cell: cols[idxC]||'' };
      }).filter(x=>x.name||x.phone||x.cell);
      if(out.length){ state.members = out; save(); render(); }
    };
    r.readAsText(file);
  }
  // Quick Numbers CSV
  function exportQuickCSV(){
    const rows = [['Label','Value'], ...state.quick.map(q=>[q.label||'', q.value||''])];
    const csv = rows.map(r=>r.map(v=>/[",\n]/.test(v)?('"' + v.replace(/"/g,'""') + '"'):v).join(',')).join('\n');
    download(csv, 'quick-numbers.csv', 'text/csv');
  }
  function importQuickCSV(file){
    const r = new FileReader();
    r.onload = () => {
      const text = (r.result||'')+'';
      const lines = text.split(/\r?\n/).filter(Boolean);
      if (!lines.length) return;
      const header = lines[0].split(',').map(s=>s.trim().toLowerCase());
      const idxL = header.indexOf('label'), idxV = header.indexOf('value');
      const out = lines.slice(1).map(line=>{
        const cols = parseCSVLine(line);
        return { id: uid(), label: cols[idxL]||'', value: cols[idxV]||'' };
      }).filter(x=>x.label||x.value);
      if(out.length){ state.quick = out; save(); render(); }
    };
    r.readAsText(file);
  }
  function download(content, filename, type){
    const blob = new Blob([content], {type:type});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; a.click(); URL.revokeObjectURL(a.href);
  }

  let drag = { list:null, index:null };

  function cardFrame(title, inner){
    const card = el('div', { class:'card', style:`border-color:${themedBorder()}; font-size:${state.fontScale}em; background:${themedBG()};` },
      el('div', { class:'inner' },
        el('div', { class:'titleRow' }, el('div', { class:'truncate' }, title || ''), el('div', { class:'small' }, '')),
        el('div', { class:'sep' }),
        inner,
        el('div', { class:'tip' }, 'Tip: Laminate and keep in wallet/lanyard. Update anytime and reprint.')
      )
    );
    return card;
  }
  function cardFront(){
    const table = el('table', { class:'table' },
      el('thead', {}, el('tr', {}, el('th', {}, 'Name'), el('th', {}, 'Phone'), el('th', {}, 'Cell'))),
      el('tbody', {},
        ...(state.members.filter(m=> (m.name||'').trim() || (m.phone||'').trim() || (m.cell||'').trim()).slice(0,16).map(m=> el('tr', {},
          el('td', {}, m.name || '—'),
          el('td', {}, m.phone || '—'),
          el('td', {}, m.cell || '—')
        )))
      )
    );
    return cardFrame(state.title || 'Team Contact Roster', table);
  }
  function cardBack(){
    const list = el('table', { class:'table', style:'width:100%; font-size:8.6pt;' },
      el('tbody', {},
        ...(state.quick.filter(q=> (q.label||'').trim() && (q.value||'').trim()).slice(0,14).map(q=> el('tr', {},
          el('td', { style:'width:58%; padding-right:8px;' }, q.label),
          el('td', {}, q.value)
        )))
      )
    );
    return cardFrame(state.backTitle || 'Quick Numbers', list);
  }

  function render(){
    const root = document.getElementById('app'); root.innerHTML='';
    const container = el('div', { class:'container pageUI' });

    const left = el('div', {},
      el('div', { class:'panel' },
        el('h1', {}, 'Team Contact Roster (Business Card Sized)'),
        el('p', { class:'muted' }, 'Build a small, durable contact card for your team & key numbers.')
      ),
      el('div', { class:'panel' },
        el('h2', {}, 'Card Settings'),
        el('div', { class:'row' },
          el('div', {}, el('label', {}, 'Front Title'),
            el('input', { class:'input', value:state.title, oninput:e=>{ state.title=e.target.value; save(); updatePreviews(); } })
          ),
          el('div', {}, el('label', {}, 'Back Title'),
            el('input', { class:'input', value:state.backTitle, oninput:e=>{ state.backTitle=e.target.value; save(); updatePreviews(); updateBackHeader(); } })
          ),
          el('div', { class:'inline' },
            el('div', {}, el('label', {}, 'Theme'),
              el('select', { class:'select', onchange:e=>{ state.theme=e.target.value; save(); updatePreviews(); } },
                ...['slate','emerald','indigo','rose','amber'].map(v=> el('option', { value:v, selected:state.theme===v }, v))
              )
            ),
            el('div', {}, el('label', {}, 'Font scale'),
              el('input', { type:'range', min:'0.85', max:'1.2', step:'0.01', value:state.fontScale, oninput:e=>{ state.fontScale=parseFloat(e.target.value); save(); updatePreviews(); } })
            ),
            el('div', {}, el('label', {}, 'Copies per sheet'),
              el('input', { type:'number', class:'input', value:state.copies, min:'1', max:'12', oninput:e=>{ const v=parseInt(e.target.value||'1'); state.copies=Math.max(1,Math.min(12,v)); save(); } })
            ),
            el('div', { style:'margin-left:auto' },
              el('label', { class:'small' }, ' '),
              el('button', { class:'button', onclick:()=>window.print() }, 'Print / Save PDF')
            )
          ),
          (()=>{ 
            const row = el('div', { class:'button-row' });
            const exportBtn = el('button', { class:'button outline', onclick:exportMembersCSV }, 'Export Members CSV');
            const importBtn = el('button', { class:'button outline', onclick:()=>document.getElementById('csvMembers').click() }, 'Import Members CSV');
            const input = el('input', { id:'csvMembers', type:'file', accept:'.csv,text/csv', style:'display:none' });
            input.addEventListener('change', e=>{ if (input.files && input.files[0]) importMembersCSV(input.files[0]); });
            row.append(exportBtn, importBtn, input);
            return row;
          })(),
          (()=>{ 
            const row = el('div', { class:'button-row' });
            const exportBtn = el('button', { class:'button outline', onclick:exportQuickCSV }, 'Export Quick Numbers CSV');
            const importBtn = el('button', { class:'button outline', onclick:()=>document.getElementById('csvQuick').click() }, 'Import Quick Numbers CSV');
            const input = el('input', { id:'csvQuick', type:'file', accept:'.csv,text/csv', style:'display:none' });
            input.addEventListener('change', e=>{ if (input.files && input.files[0]) importQuickCSV(input.files[0]); });
            row.append(exportBtn, importBtn, input);
            return row;
          })()
        )
      ),
      el('div', { class:'panel' },
        el('h2', {}, 'Team Members (drag to reorder)'),
        (()=>{
          const list = el('div', { class:'grid' });
          state.members.forEach((m, idx)=>{
            const row = el('div', { class:'member', draggable:'true',
              ondragstart:()=>{ drag={ list:'members', index:idx }; },
              ondragover:(e)=>{ if(drag.list==='members'){ e.preventDefault(); } },
              ondrop:(e)=>{ e.preventDefault(); if(drag.list==='members' && drag.index!==idx){ state.members = move(state.members, drag.index, idx); save(); render(); } drag={list:null,index:null}; }
            },
              el('input', { class:'input', placeholder:'Name', value:m.name, oninput:e=>{ m.name=e.target.value; save(); updatePreviews(); } }),
              el('input', { class:'input', placeholder:'Phone', value:m.phone, oninput:e=>{ m.phone=e.target.value; save(); updatePreviews(); } }),
              el('input', { class:'input', placeholder:'Cell', value:m.cell, oninput:e=>{ m.cell=e.target.value; save(); updatePreviews(); } }),
              el('div', { class:'inline', style:'justify-content:flex-end; gap:8px;' },
                el('div', { class:'handle' }, '⠿'),
                el('button', { class:'remove', onclick:()=>{ if(state.members.length>1){ state.members = state.members.filter(x=>x.id!==m.id); save(); render(); } } }, '−')
              )
            );
            list.appendChild(row);
          });
          const controls = el('div', { class:'inline' },
            el('button', { class:'button', onclick:()=>{ state.members.push({ id:uid(), name:'', phone:'', cell:'' }); save(); render(); } }, '+ Add Member'),
            el('button', { class:'button outline', onclick:()=>{ state.members=[{ id:uid(), name:'', phone:'', cell:'' }]; save(); render(); } }, 'Clear')
          );
          return el('div', {}, list, controls);
        })()
      ),
      el('div', { class:'panel' },
        el('h2', { id:'backHeader' }, (state.backTitle || 'Quick Numbers') + ' (drag to reorder)'),
        (()=>{
          const list = el('div', { class:'grid' });
          state.quick.forEach((q, idx)=>{
            const row = el('div', { class:'quick', draggable:'true',
              ondragstart:()=>{ drag={ list:'quick', index:idx }; },
              ondragover:(e)=>{ if(drag.list==='quick'){ e.preventDefault(); } },
              ondrop:(e)=>{ e.preventDefault(); if(drag.list==='quick' && drag.index!==idx){ state.quick = move(state.quick, drag.index, idx); save(); render(); } drag={list:null,index:null}; }
            },
              el('input', { class:'input', placeholder: idx===0?'Help Desk':'Label', value:q.label, oninput:e=>{ q.label=e.target.value; save(); updatePreviews(); } }),
              el('input', { class:'input', placeholder: idx===1?'Support Line':'Number / Info', value:q.value, oninput:e=>{ q.value=e.target.value; save(); updatePreviews(); } }),
              el('div', { class:'inline', style:'justify-content:flex-end; gap:8px;' },
                el('div', { class:'handle' }, '⠿'),
                el('button', { class:'remove', onclick:()=>{ if(state.quick.length>1){ state.quick = state.quick.filter(x=>x.id!==q.id); save(); render(); } } }, '−')
              )
            );
            list.appendChild(row);
          });
          const controls = el('div', { class:'inline' },
            el('button', { class:'button', onclick:()=>{ state.quick.push({ id:uid(), label:'', value:'' }); save(); render(); } }, '+ Add Number'),
            el('button', { class:'button outline', onclick:()=>{ state.quick=[{ id:uid(), label:'Help Desk', value:'' },{ id:uid(), label:'Support Line', value:'' }]; save(); render(); } }, 'Reset')
          );
          return el('div', {}, list, controls);
        })()
      )
    );

    const right = el('div', {},
      el('div', { class:'panel pageUI' }, el('h2', {}, 'Live Preview')),
      el('div', { class:'previewGrid pageUI' }, cardWrap(cardFront()), cardWrap(cardBack()))
    );

    // PRINT-ONLY SHEETS (front then back)
    const print = el('div', { class:'printSheet' },
      printGrid(cardFront()),
      el('div', { style:'page-break-before:always' }),
      printGrid(cardBack())
    );

    container.append(left, right);
    root.appendChild(container);
    root.appendChild(print);
  }

  function cardWrap(card){ return el('div', { class:'cardWrap' }, card); }
  function printGrid(card){
    const grid = el('div', { class:'printGrid' });
    const n = Math.max(1, Math.min(12, state.copies|0 || 1));
    for (let i=0;i<n;i++) grid.appendChild(el('div', { class:'printCard' }, card.cloneNode(true)));
    return grid;
  }
  function updatePreviews(){
    const wraps = document.querySelectorAll('.previewGrid .cardWrap');
    if (wraps[0]) { wraps[0].innerHTML=''; wraps[0].appendChild(cardFront()); }
    if (wraps[1]) { wraps[1].innerHTML=''; wraps[1].appendChild(cardBack()); }
  }
  function updateBackHeader(){
    const h = document.getElementById('backHeader');
    if (h) h.textContent = (state.backTitle || 'Quick Numbers') + ' (drag to reorder)';
  }

  render();
})();