const state={tool:null,ropeCut:false,hammerHits:0,screwsRemoved:0,lettersDone:0,deck:["scissors","hammer","screwdriver","squirrel"],drawn:[]};
const title=document.getElementById("title"),start=document.getElementById("start"),voice=document.getElementById("voice"),arena=document.getElementById("arena"),rope=document.getElementById("rope"),sign=document.getElementById("sign"),vault=document.getElementById("vault"),firstScrew=document.getElementById("firstScrew"),glass=document.getElementById("glass"),blue=document.getElementById("blueScreen"),deckArea=document.getElementById("deckArea"),drawCard=document.getElementById("drawCard"),deckInfo=document.getElementById("deckInfo"),tools=document.getElementById("tools");

function say(t){voice.textContent=t}

function buildClickableTitle(){
  const text="THERE IS NO GAME";
  title.innerHTML="";
  for(const ch of text){
    const s=document.createElement("span");
    s.className="letter";
    s.textContent=ch===" "?"\u00A0":ch;
    if(ch!==" ")s.addEventListener("click",()=>{if(s.classList.contains("done"))return;s.classList.add("done");state.lettersDone++;say("Why are you clicking? There’s nothing to do.");if(state.lettersDone===11)startGame();});
    title.appendChild(s);
  }
}

function startGame(){
  start.innerHTML='<h1>THERE IS NO GAME</h1><p class="subtitle">don’t click to start</p>';
  arena.style.display="block";deckArea.style.display="block";say("Oh great. Now you have tools. That definitely won’t help.");
}

function drawTool(){
  if(state.deck.length===0){say("No more cards.");return;}
  const tool=state.deck.shift();state.drawn.push(tool);deckInfo.textContent=`Deck: ${state.deck.length} cards`;renderTools();say(`You drew: ${tool}`);
  if(tool==="squirrel")say("…that’s a squirrel. Why would that help?");
}
function renderTools(){tools.innerHTML="";for(const t of state.drawn){const b=document.createElement("button");b.className="tool";b.textContent=t;b.dataset.tool=t;b.onclick=()=>selectTool(t);tools.appendChild(b);}}
function selectTool(t){state.tool=t;document.querySelectorAll('.tool').forEach(b=>b.classList.toggle('active',b.dataset.tool===t));}

function createRowScrews(){
  glass.innerHTML="";state.screwsRemoved=0;
  const cols=6,rows=6,startX=18,startY=18,gapX=46,gapY=36;
  for(let r=0;r<rows;r++)for(let c=0;c<cols;c++){
    const s=document.createElement('div');s.className='mini-screw';s.style.left=(startX+c*gapX)+'px';s.style.top=(startY+r*gapY)+'px';
    s.onclick=(e)=>{e.stopPropagation();if(state.tool!=="screwdriver"){say("Use the screwdriver.");return;}s.remove();state.screwsRemoved++;if(state.screwsRemoved===1)say("This is getting out of hand. You’re not supposed to win.");if(state.screwsRemoved===36){glass.style.display='none';const f=document.createElement('div');f.className='screw';f.style.left='calc(50% - 10px)';f.style.top='calc(50% - 10px)';vault.appendChild(f);say("Don’t you dare…");f.onclick=()=>{if(state.tool!=="screwdriver")return;f.remove();say("No no no no—");setTimeout(()=>{blue.style.display='grid';say("I told you there was no game.");setTimeout(()=>location.reload(),2000);},400);};}}
    glass.appendChild(s);
  }
}

rope.onclick=(e)=>{e.stopPropagation();if(state.tool!=="scissors"||state.ropeCut){say("That rope is decorative. Leave it alone.");return;}state.ropeCut=true;rope.style.display='none';say("Wait— You weren’t supposed to do that.");setTimeout(()=>{sign.classList.add('fall');say("That was… not intended.");setTimeout(()=>{vault.style.display='block';say("That’s just decoration. Don’t touch it.");},800)},250)};
firstScrew.onclick=(e)=>{e.stopPropagation();if(state.tool!=="screwdriver"){say("You might need a screwdriver.");return;}firstScrew.remove();say("Stop. Please stop.");setTimeout(()=>{glass.style.display='block';createRowScrews();say("Oh no. You broke something important.");},500)};
glass.onclick=()=>{if(state.tool==="hammer"){state.hammerHits++;if(state.hammerHits===1){glass.classList.add("cracked");say("That was a bad idea.");}else if(state.hammerHits===2){const h=[...document.querySelectorAll('.tool')].find(x=>x.dataset.tool==='hammer');if(h)h.classList.add('broken');say("…and now it’s broken. Good job.");if(state.tool==='hammer')state.tool=null;}}else if(state.tool==='squirrel')say("why do you have a squirrel?");};

drawCard.onclick=drawTool;
buildClickableTitle();
say("There is no game. Seriously… there is nothing here. You should probably stop.");
