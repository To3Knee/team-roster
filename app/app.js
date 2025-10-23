
// Team Contact Roster v1.5.6 — Address button back in Sections panel
(function(){
  const ACTIVE_KEY = 'teamroster:offline:v1.5.6';
  const CANDIDATES = ['teamroster:offline:v1.5.6','teamroster:offline:v1.5.5','teamroster:offline:v1.5.4','teamroster:offline:v1.5.3','teamroster:offline:v1.5.2','teamroster:offline:v1.5.1','teamroster:offline:v1.5','teamroster:offline:v1.4.4c','teamroster:offline:v1.4.4b','teamroster:offline:v1.4.4a','teamroster:offline:v1.4.4'];

  function parse(json){ try { return JSON.parse(json); } catch(e){ return null; } }
  function scoreState(s){ if(!s) return -1; let m=(s.members&&s.members.length)||0, sec=(s.sections&&s.sections.length)||0, filled=0;
    if (s.members) for (let i=0;i<s.members.length;i++){ const x=s.members[i]; if((x.name||x.phone||x.cell||'').toString().trim().length) filled++; }
    if (s.sections) for (let j=0;j<s.sections.length;j++){ const q=s.sections[j];
      if (q.type==='address' && (q.items||'').toString().trim().length) filled++;
      if (q.type==='pairs' && q.items) for (let k=0;k<q.items.length;k++){ const it=q.items[k]; if((it.label||it.value||'').toString().trim().length) filled++; }
      if (q.type==='contacts' && q.items) for (let k2=0;k2<q.items.length;k2++){ const it2=q.items[k2]; if((it2.name||it2.phone||it2.cell||'').toString().trim().length) filled++; } }
    return m*10 + sec*10 + filled; }

  (function migrate(){
    let bestKey=null, bestScore=-1, best=null;
    for (let i=0;i<CANDIDATES.length;i++){
      const k=CANDIDATES[i], raw=localStorage.getItem(k);
      if(!raw) continue;
      const st=parse(raw); const sc=scoreState(st);
      if(sc>bestScore){ bestScore=sc; bestKey=k; best=st; }
    }
    if(best && bestKey !== ACTIVE_KEY){ try{ localStorage.setItem(ACTIVE_KEY, JSON.stringify(best)); }catch(e){} }
    if(!best){
      const seed={ orientation:'portrait', rosterLayout:'stacked', title:'Team Contact Roster', backTitle:'Quick Numbers', theme:'slate', fontScale:0.92, copies:8, members:[{name:'',phone:'',cell:''}], sections:[{type:'pairs',title:'Quick Numbers',items:[{label:'Help Desk',value:''},{label:'Support Line',value:''}]}] };
      try{ localStorage.setItem(ACTIVE_KEY, JSON.stringify(seed)); }catch(e){}
    }
  })();

  function uid(){ return Math.random().toString(36).slice(2,10); }
  function move(arr,from,to){ const a=arr.slice(); if(to<0||to>=a.length) return a; const x=a.splice(from,1)[0]; a.splice(to,0,x); return a; }
  function themedBorder(theme){ const map={slate:'#64748b',emerald:'#10b981',indigo:'#6366f1',rose:'#f43f5e',amber:'#f59e0b'}; return map[theme||'slate']||'#64748b'; }
  function themedBG(theme){ const map={slate:'linear-gradient(135deg,#1f2937,#0b1220)',emerald:'linear-gradient(135deg,#065f46,#052e2b)',indigo:'linear-gradient(135deg,#3730a3,#0f0a3a)',rose:'linear-gradient(135deg,#9f1239,#3b0717)',amber:'linear-gradient(135deg,#92400e,#2d1602)'}; return map[theme||'slate']||map.slate; }
  function csvEsc(v){ return /[",\n]/.test(v)?('"' + v.replace(/"/g,'""') + '"'):v; }
  function parseCSVLine(line){ let out=[],cur='',q=false; for(let i=0;i<line.length;i++){ const ch=line[i]; if(q){ if(ch=='"'&&line[i+1]=='"'){cur+='"';i++;} else if(ch=='"'){q=false;} else {cur+=ch;} } else { if(ch===','){out.push(cur);cur='';} else if(ch=='"'){q=true;} else {cur+=ch;} } } out.push(cur); return out; }
  function download(content, filename, type){ const blob=new Blob([content],{type:type}); const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click(); setTimeout(()=>URL.revokeObjectURL(a.href),1500); }

  function getState(){ return parse(localStorage.getItem(ACTIVE_KEY))||{}; }
  function save(state){ try{ localStorage.setItem(ACTIVE_KEY, JSON.stringify(state)); }catch(e){} }

  function el(tag, props){ const e=document.createElement(tag); props=props||{}; const kids=[].slice.call(arguments,2);
    for (const k in props){ const v=props[k];
      if (k==='class') e.className=v; else if (k.slice(0,2)==='on' && typeof v==='function') e.addEventListener(k.slice(2).toLowerCase(), v);
      else if (k==='for') e.htmlFor=v; else if (k==='value') e.value=v; else e.setAttribute(k,v);
    }
    kids.forEach(c => { if(c!=null) e.appendChild(typeof c==='string'?document.createTextNode(c):c); });
    return e; }

  // Cards
  function cardFrame(state, title, inner){
    const oc = state.orientation==='portrait' ? 'portrait' : '';
    return el('div',{class:'card '+oc,style:'border-color:'+themedBorder(state.theme)+'; font-size:'+(state.fontScale||0.92)+'em; background:'+themedBG(state.theme)+';'},
      el('div',{class:'inner'},
        el('div',{class:'titleRow'}, el('div',{class:'truncate'}, title||''), el('div',{class:'small'},'')),
        el('div',{class:'sep'}),
        inner,
        el('div',{class:'tip'},' ')
      ));
  }
  function cardFront(state){
    if((state.rosterLayout||'stacked')==='stacked'){
      const w=el('div',{class:'stackedWrap'});
      (state.members||[]).filter(m => (m.name||'').trim()||(m.phone||'').trim()||(m.cell||'').trim()).slice(0,24).forEach(m => {
        w.appendChild(el('div',{class:'stackedRow'}, el('div',{class:'stackedTop'},m.name||'—'), el('div',{class:'stackedSub'}, [m.phone||'—',m.cell||'—'].filter(Boolean).join(' • ')) ));
      });
      return cardFrame(state, state.title||'Team Contact Roster', w);
    } else {
      const t=el('table',{class:'table'}, el('thead',{}, el('tr',{}, el('th',{},'Name'), el('th',{},'Phone'), el('th',{},'Cell'))), el('tbody',{}));
      (state.members||[]).filter(m => (m.name||'').trim()||(m.phone||'').trim()||(m.cell||'').trim()).slice(0,16).forEach(m => {
        t.lastChild.appendChild(el('tr',{}, el('td',{},m.name||'—'), el('td',{},m.phone||'—'), el('td',{},m.cell||'—')));
      });
      return cardFrame(state, state.title||'Team Contact Roster', t);
    }
  }
  function friendlyTitle(sec){
    const t=(sec.title||'').trim();
    if(t && t.toLowerCase()!=='new section') return t;
    if(sec.type==='address') return 'Address';
    if(sec.type==='contacts') return 'Contacts';
    return 'Quick Numbers';
  }
  function cardBack(state){
    let MAX=16, used=0, wrap=el('div',{class:'list'});
    (state.sections||[]).forEach(function(sec){
      if(used>=MAX) return;
      wrap.appendChild(el('div',{}, el('span',{class:'sectionTitle'},friendlyTitle(sec)), el('span',{class:'badge',style:'margin-left:8px'}, (sec.type==='contacts'?'Contacts':(sec.type==='address'?'Address':'Pairs')))));
      if(sec.type==='contacts'){
        const tbl=el('table',{class:'table',style:'width:100%; font-size:7.0pt;'}, el('thead',{}, el('tr',{}, el('th',{},'Name'), el('th',{},'Phone'), el('th',{},'Cell'))), el('tbody',{}));
        (sec.items||[]).forEach(function(it){
          if(used>=MAX) return;
          if(!((it.name||'').trim()||(it.phone||'').trim()||(it.cell||'').trim())) return;
          tbl.lastChild.appendChild(el('tr',{}, el('td',{style:'width:44%; padding-right:8px;'},it.name||''), el('td',{style:'width:28%;'},it.phone||''), el('td',{},it.cell||'')));
          used++;
        });
        wrap.appendChild(tbl);
      } else if (sec.type==='address'){
        const block=(typeof sec.items==='string'?sec.items:'');
        wrap.appendChild(el('div',{class:'addressBlock'}, block));
        const lines=(block||'').split('\n').filter(s=>s.trim().length>0);
        used+=Math.max(1,lines.length);
      } else {
        const tbl2=el('table',{class:'table',style:'width:100%; font-size:7.4pt;'}, el('tbody',{}));
        (sec.items||[]).forEach(function(it){
          if(used>=MAX) return;
          if(!((it.label||'').trim()||(it.value||'').trim())) return;
          tbl2.lastChild.appendChild(el('tr',{}, el('td',{style:'width:58%; padding-right:8px;'},it.label||''), el('td',{},it.value||'')));
          used++;
        });
        wrap.appendChild(tbl2);
      }
    });
    return cardFrame(state, state.backTitle||'Quick Numbers', wrap);
  }
  function cardWrap(card){ return el('div',{class:'cardWrap'}, card); }
  function printGrid(state, card){ const grid=el('div',{class:'printGrid'}); const n=Math.max(1,Math.min(12,(state.copies|0)||1)); for(let i=0;i<n;i++) grid.appendChild(el('div',{class:'printCard'}, card.cloneNode(true))); return grid; }

  function render(){
    const state=getState();
    (state.sections||[]).forEach(sec => { if (sec.type==='address') { if (Object.prototype.toString.call(sec.items)==='[object Array]') sec.items = sec.items.join('\n'); else if (typeof sec.items !== 'string') sec.items = ''; }});
    const root=document.getElementById('app'); const container=document.createElement('div'); container.className='container pageUI'; const left=document.createElement('div'); const right=document.createElement('div');

    // Header
    left.appendChild(el('div',{class:'panel'}, el('h1',{},'Team Contact Roster (Business Card Sized)'), el('p',{class:'small'},'v1.5.6 — Address button in Sections; CSV import/export; drag/move/delete; Address multiline')));

    // Settings
    left.appendChild((() => { const pane=el('div',{class:'panel'}, el('h2',{},'Card Settings'));
      const r=el('div',{});
      r.appendChild(el('div',{}, el('label',{},'Front Title'), el('input',{class:'input',value:state.title||'',oninput:e=>{state.title=e.target.value; save(state); updatePreviews();}})));
      r.appendChild(el('div',{}, el('label',{},'Back Title'), el('input',{class:'input',value:state.backTitle||'',oninput:e=>{state.backTitle=e.target.value; save(state); updatePreviews();}})));
      r.appendChild(el('div',{class:'inline'},
        el('div',{}, el('label',{},'Orientation'), el('select',{class:'select',onchange:e=>{state.orientation=e.target.value; save(state); updatePreviews();}}, el('option',{value:'landscape',selected:state.orientation==='landscape'},'Landscape (wide)'), el('option',{value:'portrait',selected:state.orientation!=='landscape'},'Portrait (tall)'))),
        el('div',{}, el('label',{},'Roster Layout'), el('select',{class:'select',onchange:e=>{state.rosterLayout=e.target.value; save(state); updatePreviews();}}, el('option',{value:'table',selected:state.rosterLayout==='table'},'Table (Name / Phone / Cell)'), el('option',{value:'stacked',selected:state.rosterLayout!=='table'},'Stacked (Name; Phone • Cell)'))),
        el('div',{}, el('label',{},'Theme'), el('select',{class:'select',onchange:e=>{state.theme=e.target.value; save(state); updatePreviews();}}, el('option',{value:'slate',selected:(state.theme||'slate')==='slate'},'slate'), el('option',{value:'emerald',selected:state.theme==='emerald'},'emerald'), el('option',{value:'indigo',selected:state.theme==='indigo'},'indigo'), el('option',{value:'rose',selected:state.theme==='rose'},'rose'), el('option',{value:'amber',selected:state.theme==='amber'},'amber'))),
        el('div',{}, el('label',{},'Font scale'), el('input',{type:'range',min:'0.70',max:'1.2',step:'0.01',value:state.fontScale||0.92,oninput:e=>{state.fontScale=parseFloat(e.target.value||'0.92'); save(state); updatePreviews();}})),
        el('div',{}, el('label',{},'Copies per sheet'), el('input',{type:'number',class:'input',value:state.copies||8,min:'1',max:'12',oninput:e=>{const v=parseInt(e.target.value||'8',10); state.copies=Math.max(1,Math.min(12,v)); save(state);}})),
        el('div',{style:'margin-left:auto'}, el('label',{class:'small'},' '), el('button',{class:'button',onclick:()=>{window.print();}},'Print / Save PDF'))
      ));
      // CSV buttons
      r.appendChild((()=>{ const row=el('div',{class:'button-row'});
        const ex=el('button',{class:'button outline',onclick:exportMembersCSV},'Export Members CSV');
        const im=el('button',{class:'button outline',onclick:()=>{document.getElementById('csvMembers').click();}},'Import Members CSV');
        const input=el('input',{id:'csvMembers',type:'file',accept:'.csv,text/csv',style:'display:none'}); input.addEventListener('change',function(){ if(input.files && input.files[0]) importMembersCSV(input.files[0]); });
        row.appendChild(ex); row.appendChild(im); row.appendChild(input); return row; })());
      r.appendChild((()=>{ const row=el('div',{class:'button-row'});
        const ex=el('button',{class:'button outline',onclick:exportSectionsCSV},'Export Back Sections CSV');
        const im=el('button',{class:'button outline',onclick:()=>{document.getElementById('csvSections').click();}},'Import Back Sections CSV');
        const input=el('input',{id:'csvSections',type:'file',accept:'.csv,text/csv',style:'display:none'}); input.addEventListener('change',function(){ if(input.files && input.files[0]) importSectionsCSV(input.files[0]); });
        row.appendChild(ex); row.appendChild(im); row.appendChild(input); return row; })());
      pane.appendChild(r); return pane; })());

    // Members
    left.appendChild((() => { const pane=el('div',{class:'panel'}, el('h2',{},'Team Members (drag or use ↑/↓; delete)'));
      const list=el('div',{class:'grid'});
      (state.members||[]).forEach((m,idx) => {
        list.appendChild(el('div',{class:'member',draggable:'true',
          ondragstart:()=>{window.__drag={kind:'member',iidx:idx};},
          ondragover:e=>{ if(window.__drag && window.__drag.kind==='member'){ e.preventDefault(); } },
          ondrop:e=>{ e.preventDefault(); if(window.__drag && window.__drag.kind==='member' && window.__drag.iidx!==idx){ state.members = move(state.members, window.__drag.iidx, idx); save(state); render(); } window.__drag=null; }
        },
          el('input',{class:'input',placeholder:'Name',value:m.name||'',oninput:e=>{m.name=e.target.value; save(state); updatePreviews();}}),
          el('input',{class:'input',placeholder:'Phone',value:m.phone||'',oninput:e=>{m.phone=e.target.value; save(state); updatePreviews();}}),
          el('input',{class:'input',placeholder:'Cell',value:m.cell||'',oninput:e=>{m.cell=e.target.value; save(state); updatePreviews();}}),
          el('div',{class:'controls'},
            el('button',{class:'ctrl',onclick:()=>{ if(idx>0){ state.members = move(state.members, idx, idx-1); save(state); render(); }}},'↑'),
            el('button',{class:'ctrl',onclick:()=>{ if(idx < state.members.length-1){ state.members = move(state.members, idx, idx+1); save(state); render(); }}},'↓'),
            el('button',{class:'ctrl del',onclick:()=>{ if(state.members.length>1){ state.members=state.members.filter(x=>x!==m); save(state); render(); }}},'Delete')
          )
        ));
      });
      pane.appendChild(list);
      pane.appendChild(el('div',{class:'inline'},
        el('button',{class:'button',onclick:()=>{state.members.push({id:uid(),name:'',phone:'',cell:''}); save(state); render();}},'+ Add Member'),
        el('button',{class:'button outline',onclick:()=>{state.members=[{id:uid(),name:'',phone:'',cell:''}]; save(state); render();}},'Clear')
      ));
      return pane; })());

    // Sections
    left.appendChild((() => { const pane=el('div',{class:'panel'}, el('h2',{}, (state.backTitle||'Quick Numbers')+' — Sections (drag or use ↑/↓; delete)'));
      const wrap=el('div',{class:'grid'});
      (state.sections||[]).forEach((sec,sidx) => {
        wrap.appendChild(el('div',{class:'section',draggable:'true',
          ondragstart:()=>{ window.__drag={ kind:'section', sidx:sidx }; },
          ondragover:e=>{ if(window.__drag && window.__drag.kind==='section'){ e.preventDefault(); } },
          ondrop:e=>{ e.preventDefault(); if(window.__drag && window.__drag.kind==='section' && window.__drag.sidx!==sidx){ state.sections = move(state.sections, window.__drag.sidx, sidx); save(state); render(); } window.__drag=null; }
        },
          el('div',{class:'sectionHeader'},
            el('input',{class:'input',value:sec.title||'',oninput:e=>{sec.title=e.target.value; save(state); updatePreviews();}}),
            el('select',{class:'select',onchange:e=>{ const nt=e.target.value; if(nt==='address'){ sec.items = (Object.prototype.toString.call(sec.items)==='[object Array]') ? sec.items.join('\n') : (typeof sec.items==='string'?sec.items:''); } else { sec.items = (nt==='contacts') ? [{id:uid(),name:'',phone:'',cell:''}] : [{id:uid(),label:'',value:''}]; } sec.type=nt; save(state); updatePreviews(); render(); }},
              el('option',{value:'pairs',selected:(sec.type||'pairs')==='pairs'},'Type: Pairs (Label/Value)'),
              el('option',{value:'contacts',selected:(sec.type||'pairs')==='contacts'},'Type: Contacts (Name/Phone/Cell)'),
              el('option',{value:'address',selected:(sec.type||'pairs')==='address'},'Type: Address (multiline)')
            ),
            el('div',{style:'margin-left:auto'}),
            el('div',{class:'controls'},
              el('button',{class:'ctrl',onclick:()=>{ if(sidx>0){ state.sections=move(state.sections,sidx,sidx-1); save(state); render(); }}},'↑'),
              el('button',{class:'ctrl',onclick:()=>{ if(sidx<state.sections.length-1){ state.sections=move(state.sections,sidx,sidx+1); save(state); render(); }}},'↓'),
              el('button',{class:'ctrl del',onclick:()=>{ if(state.sections.length>1){ state.sections=state.sections.filter(x=>x!==sec); save(state); render(); }}},'Delete')
            )
          ),
          (()=>{
            const itemsEl=el('div',{class:'sectionItems'}); const t=sec.type||'pairs';
            if (t==='address') {
              itemsEl.appendChild(el('textarea',{class:'textarea',value:(typeof sec.items==='string'?sec.items:''),oninput:e=>{sec.items=e.target.value; save(state); updatePreviews();}}));
            } else if (t==='contacts') {
              (sec.items||[]).forEach((it,iidx)=>{
                itemsEl.appendChild(el('div',{class:'itemTriplet',draggable:'true',
                  ondragstart:()=>{ window.__drag={ kind:'item', sidx:sidx, iidx:iidx }; },
                  ondragover:e=>{ if(window.__drag && window.__drag.kind==='item' && window.__drag.sidx===sidx){ e.preventDefault(); } },
                  ondrop:e=>{ e.preventDefault(); if(window.__drag && window.__drag.kind==='item' && window.__drag.sidx===sidx && window.__drag.iidx!==iidx){ sec.items=move(sec.items,window.__drag.iidx,iidx); save(state); render(); } window.__drag=null; }
                },
                  el('input',{class:'input',placeholder:'Name',value:it.name||'',oninput:e=>{it.name=e.target.value; save(state); updatePreviews();}}),
                  el('input',{class:'input',placeholder:'Phone',value:it.phone||'',oninput:e=>{it.phone=e.target.value; save(state); updatePreviews();}}),
                  el('input',{class:'input',placeholder:'Cell',value:it.cell||'',oninput:e=>{it.cell=e.target.value; save(state); updatePreviews();}}),
                  el('div',{class:'controls'},
                    el('button',{class:'ctrl',onclick:()=>{ if(iidx>0){ sec.items=move(sec.items,iidx,iidx-1); save(state); render(); }}},'↑'),
                    el('button',{class:'ctrl',onclick:()=>{ if(iidx<sec.items.length-1){ sec.items=move(sec.items,iidx,iidx+1); save(state); render(); }}},'↓'),
                    el('button',{class:'ctrl del',onclick:()=>{ if(sec.items.length>1){ sec.items=sec.items.filter(x=>x!==it); save(state); render(); }}},'Delete')
                  )
                ));
              });
              itemsEl.appendChild(el('div',{class:'inline'},
                el('button',{class:'button',onclick:()=>{sec.items.push({id:uid(),name:'',phone:'',cell:''}); save(state); render();}},'+ Add Contact'),
                el('button',{class:'button outline',onclick:()=>{sec.items=[{id:uid(),name:'',phone:'',cell:''}]; save(state); render();}},'Clear Contacts')
              ));
            } else { // pairs
              (sec.items||[]).forEach((it,iidx)=>{
                itemsEl.appendChild(el('div',{class:'item',draggable:'true',
                  ondragstart:()=>{ window.__drag={ kind:'item', sidx:sidx, iidx:iidx }; },
                  ondragover:e=>{ if(window.__drag && window.__drag.kind==='item' && window.__drag.sidx===sidx){ e.preventDefault(); } },
                  ondrop:e=>{ e.preventDefault(); if(window.__drag && window.__drag.kind==='item' && window.__drag.sidx===sidx && window.__drag.iidx!==iidx){ sec.items=move(sec.items,window.__drag.iidx,iidx); save(state); render(); } window.__drag=null; }
                },
                  el('input',{class:'input',placeholder:'Label (e.g., Help Desk)',value:it.label||'',oninput:e=>{it.label=e.target.value; save(state); updatePreviews();}}),
                  el('input',{class:'input',placeholder:'Number / Info',value:it.value||'',oninput:e=>{it.value=e.target.value; save(state); updatePreviews();}}),
                  el('div',{class:'controls'},
                    el('button',{class:'ctrl',onclick:()=>{ if(iidx>0){ sec.items=move(sec.items,iidx,iidx-1); save(state); render(); }}},'↑'),
                    el('button',{class:'ctrl',onclick:()=>{ if(iidx<sec.items.length-1){ sec.items=move(sec.items,iidx,iidx+1); save(state); render(); }}},'↓'),
                    el('button',{class:'ctrl del',onclick:()=>{ if(sec.items.length>1){ sec.items=sec.items.filter(x=>x!==it); save(state); render(); }}},'Delete')
                  )
                ));
              });
              itemsEl.appendChild(el('div',{class:'inline'},
                el('button',{class:'button',onclick:()=>{sec.items.push({id:uid(),label:'',value:''}); save(state); render();}},'+ Add Row'),
                el('button',{class:'button outline',onclick:()=>{sec.items=[{id:uid(),label:'',value:''}]; save(state); render();}},'Clear Rows')
              ));
            }
            return itemsEl;
          })()
        ));
      });
      pane.appendChild(wrap);
      pane.appendChild(el('div',{class:'inline'},
        el('button',{class:'button',onclick:()=>{state.sections.push({id:uid(),title:'New Section',type:'pairs',items:[{id:uid(),label:'',value:''}]}); save(state); render();}},'+ Add Section (Pairs)'),
        el('button',{class:'button',onclick:()=>{state.sections.push({id:uid(),title:'Contact Numbers',type:'contacts',items:[{id:uid(),name:'',phone:'',cell:''}]}); save(state); render();}},'+ Add Section (Contacts)'),
        el('button',{class:'button',onclick:()=>{state.sections.push({id:uid(),title:'Address',type:'address',items:''}); save(state); render();}},'+ Add Section (Address)'),
        el('button',{class:'button outline',onclick:()=>{state.sections=[{id:uid(),title:'Quick Numbers',type:'pairs',items:[{id:uid(),label:'Help Desk',value:''},{id:uid(),label:'Support Line',value:''}]},{id:uid(),title:'Address',type:'address',items:''}]; save(state); render();}},'Reset Sections')
      ));
      return pane; })());

    // Right preview + print
    right.appendChild(el('div',{class:'panel'}, el('h2',{},'Live Preview')));
    right.appendChild((()=>{ const wrap=el('div',{class:'previewGrid'}); wrap.appendChild(cardWrap(cardFront(state))); wrap.appendChild(cardWrap(cardBack(state))); return wrap; })());

    const print=document.createElement('div'); print.className='printSheet ' + (state.orientation==='portrait' ? 'portrait' : '');
    print.appendChild(printGrid(state, cardFront(state))); print.appendChild(el('div',{style:'page-break-before:always'}));
    print.appendChild(printGrid(state, cardBack(state)));

    container.appendChild(left); container.appendChild(right);
    document.getElementById('app').innerHTML='';
    document.getElementById('app').appendChild(container);
    document.getElementById('app').appendChild(print);
  }

  function updatePreviews(){
    const state=getState();
    const wraps=document.querySelectorAll('.previewGrid .cardWrap');
    if(wraps[0]){wraps[0].innerHTML=''; wraps[0].appendChild(cardFront(state));}
    if(wraps[1]){wraps[1].innerHTML=''; wraps[1].appendChild(cardBack(state));}
    const ps=document.querySelector('.printSheet'); if(ps){ ps.className='printSheet ' + (state.orientation==='portrait' ? 'portrait' : ''); ps.innerHTML=''; ps.appendChild(printGrid(state, cardFront(state))); ps.appendChild(el('div',{style:'page-break-before:always'})); ps.appendChild(printGrid(state, cardBack(state))); }
  }

  // CSV
  function exportMembersCSV(){
    const s=getState();
    const rows=[['Name','Phone','Cell']].concat((s.members||[]).map(m=>[m.name||'',m.phone||'',m.cell||'']));
    const csv=rows.map(r=>r.map(csvEsc).join(',')).join('\n');
    download(csv,'team-members.csv','text/csv');
  }
  function importMembersCSV(file){
    const r=new FileReader();
    r.onload=function(){
      const text=(''+(r.result||''));
      const lines=text.split(/\r?\n/).filter(s=>s.length);
      if(!lines.length) return;
      const header=lines[0].split(',').map(s=>s.trim().toLowerCase());
      const iN=header.indexOf('name'), iP=header.indexOf('phone'), iC=header.indexOf('cell');
      const out=lines.slice(1).map(line=>{ const c=parseCSVLine(line); return {id:uid(), name:c[iN]||'', phone:c[iP]||'', cell:c[iC]||''};}).filter(x=>x.name||x.phone||x.cell);
      const s=getState(); if(out.length){ s.members=out; save(s); render(); }
    };
    r.readAsText(file);
  }
  function exportSectionsCSV(){
    const s=getState();
    const rows=[['Section','Type','Label','Value','Name','Phone','Cell']];
    (s.sections||[]).forEach(sec=>{
      const t=sec.type||'pairs';
      if(t==='address'){ rows.push([sec.title||'','address','', (sec.items||''),'','','']); }
      else if (t==='pairs'){ (sec.items||[]).forEach(it=>{ if((it.label||'').trim()||(it.value||'').trim()) rows.push([sec.title||'',t,it.label||'',it.value||'','','']); }); }
      else if (t==='contacts'){ (sec.items||[]).forEach(it=>{ if((it.name||'').trim()||(it.phone||'').trim()||(it.cell||'').trim()) rows.push([sec.title||'',t,'','',it.name||'',it.phone||'',it.cell||'']); }); }
    });
    const csv=rows.map(r=>r.map(csvEsc).join(',')).join('\n');
    download(csv,'back-sections.csv','text/csv');
  }
  function importSectionsCSV(file){
    const r=new FileReader();
    r.onload=function(){
      const text=(''+(r.result||''));
      const lines=text.split(/\r?\n/).filter(s=>s.length);
      if(!lines.length) return;
      const header=lines[0].split(',').map(s=>s.trim().toLowerCase());
      const iS=header.indexOf('section'), iT=header.indexOf('type'), iL=header.indexOf('label'), iV=header.indexOf('value'), iN=header.indexOf('name'), iP=header.indexOf('phone'), iC=header.indexOf('cell');
      const map={};
      lines.slice(1).forEach(line=>{
        const c=parseCSVLine(line);
        const section=(c[iS]||'').trim()||'Section';
        const type=(c[iT]||'pairs').trim().toLowerCase();
        if(!map[section]) map[section]={type:type,items:(type==='address'?'':[])};
        if(type==='pairs'){ const L=c[iL]||'', V=c[iV]||''; if(L||V) map[section].items.push({id:uid(),label:L, value:V}); }
        else if(type==='contacts'){ const n=c[iN]||'', p=c[iP]||'', ce=c[iC]||''; if(n||p||ce) map[section].items.push({id:uid(),name:n, phone:p, cell:ce}); }
        else if(type==='address'){ map[section].items = c[iV]||''; }
      });
      const out=[]; for (const t in map){ out.push({id:uid(), title:t, type:map[t].type, items:map[t].items}); }
      const s=getState(); if(out.length){ s.sections=out; save(s); render(); }
    };
    r.readAsText(file);
  }

  // Expose helpers
  window.updatePreviews = updatePreviews;
  window.exportMembersCSV = exportMembersCSV;
  window.exportSectionsCSV = exportSectionsCSV;
  window.importMembersCSV = importMembersCSV;
  window.importSectionsCSV = importSectionsCSV;

  render();
})();
