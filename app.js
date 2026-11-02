const products = [
  {id:1,name:"Lina — tunika",type:"Beauty",category:"Beauty",price:59,image:"https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",colors:["#d9cfc1","#34332f","#a99b8b"],tag:"BESTSELLERS"},
  {id:2,name:"Mila — darba komplekts",type:"Komplekts",category:"Komplekti",price:89,image:"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",colors:["#d8cbbb","#6f7770","#34332f"],tag:"JAUNUMS"},
  {id:3,name:"Nora — medicīnas tops",type:"Medicīnas apģērbs",category:"Medicīna",price:45,image:"https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=800&q=80",colors:["#e2ddd3","#8c9b9b","#34332f"],tag:""},
  {id:4,name:"Elza — elegantas bikses",type:"Apakšdaļa",category:"Beauty",price:49,image:"https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80",colors:["#c9bcae","#34332f"],tag:""},
  {id:5,name:"Signe — medicīnas komplekts",type:"Komplekts",category:"Medicīna",price:94,image:"https://images.unsplash.com/photo-1584515933487-779824d29309?auto=format&fit=crop&w=800&q=80",colors:["#b8c2bd","#ded7ca","#34332f"],tag:"JAUNUMS"},
  {id:6,name:"Adele — studio tunika",type:"Beauty",category:"Beauty",price:64,image:"https://images.unsplash.com/photo-1598300056393-4aac492f4344?auto=format&fit=crop&w=800&q=80",colors:["#e1d8ca","#a48d79","#34332f"],tag:""},
  {id:7,name:"Clara — darba komplekts",type:"Komplekts",category:"Komplekti",price:99,image:"https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&w=800&q=80",colors:["#d8cbbb","#34332f"],tag:"LIMITĒTA KOLEKCIJA"},
  {id:8,name:"Marta — medicīnas tunika",type:"Medicīnas apģērbs",category:"Medicīna",price:55,image:"https://images.unsplash.com/photo-1612531386530-97286d97c2d2?auto=format&fit=crop&w=800&q=80",colors:["#e4ded3","#aab5b0","#34332f"],tag:""}
];
let cart = JSON.parse(localStorage.getItem("eleganceCart") || "[]");
const grid = document.getElementById("productGrid");
const money = n => n.toFixed(2).replace(".",",")+" €";
function renderProducts(){
  const category=document.getElementById("categoryFilter").value;
  const sort=document.getElementById("sortSelect").value;
  const query=(document.getElementById("searchInput")?.value||"").toLowerCase();
  let list=products.filter(p=>(category==="Visi"||p.category===category)&&(`${p.name} ${p.type} ${p.category}`).toLowerCase().includes(query));
  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  grid.innerHTML=list.length?list.map(p=>`<article class="product-card">
    <div class="product-image-wrap"><img src="${p.image}" alt="${p.name}" loading="lazy">${p.tag?`<span class="product-tag">${p.tag}</span>`:""}<button class="quick-add" data-add="${p.id}">PIEVIENOT GROZAM +</button></div>
    <div class="product-meta"><div><p class="product-name">${p.name}</p><span class="product-type">${p.type}</span></div><span class="product-price">${money(p.price)}</span></div>
    <div class="swatches" aria-label="Pieejamās krāsas">${p.colors.map(c=>`<span class="swatch" style="background:${c}"></span>`).join("")}</div>
  </article>`).join(""):`<p>Produkti netika atrasti. Pamēģini citu meklēšanas frāzi.</p>`;
}
function saveCart(){localStorage.setItem("eleganceCart",JSON.stringify(cart));renderCart();}
function addToCart(id){const p=products.find(x=>x.id===id);const found=cart.find(x=>x.id===id);if(found)found.qty++;else cart.push({id,qty:1});saveCart();showToast(`${p.name} pievienots grozam`);}
function renderCart(){
  document.getElementById("cartCount").textContent=cart.reduce((s,x)=>s+x.qty,0);
  const items=document.getElementById("cartItems");
  if(!cart.length){items.innerHTML='<p class="empty-cart">Tavs grozs pagaidām ir tukšs.</p>';document.getElementById("cartSubtotal").textContent=money(0);return;}
  items.innerHTML=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `<div class="cart-item"><img src="${p.image}" alt=""><div><h4>${p.name}</h4><p>${money(p.price)} · Daudzums: ${item.qty}</p><button data-remove="${p.id}">Noņemt</button></div><strong>${money(p.price*item.qty)}</strong></div>`}).join("");
  document.getElementById("cartSubtotal").textContent=money(cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0));
}
function showToast(message){const t=document.getElementById("toast");t.textContent=message;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),2300);}
function openCart(open){document.getElementById("cartDrawer").classList.toggle("open",open);document.getElementById("drawerBackdrop").classList.toggle("open",open);document.getElementById("cartDrawer").setAttribute("aria-hidden",String(!open));}
grid.addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(b)addToCart(Number(b.dataset.add));});
document.getElementById("cartItems").addEventListener("click",e=>{const b=e.target.closest("[data-remove]");if(b){cart=cart.filter(x=>x.id!==Number(b.dataset.remove));saveCart();}});
document.getElementById("categoryFilter").addEventListener("change",renderProducts);
document.getElementById("sortSelect").addEventListener("change",renderProducts);
document.getElementById("cartOpen").addEventListener("click",()=>openCart(true));
document.getElementById("cartClose").addEventListener("click",()=>openCart(false));
document.getElementById("drawerBackdrop").addEventListener("click",()=>openCart(false));
document.getElementById("checkoutButton").addEventListener("click",()=>showToast("Noformēšana būs pieejama pēc maksājumu sistēmas pieslēgšanas."));
document.getElementById("searchToggle").addEventListener("click",()=>{document.getElementById("searchPanel").classList.add("open");document.getElementById("searchInput").focus();});
document.getElementById("searchClose").addEventListener("click",()=>{document.getElementById("searchPanel").classList.remove("open");document.getElementById("searchInput").value="";renderProducts();});
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.querySelectorAll("[data-category]").forEach(el=>el.addEventListener("click",()=>{document.getElementById("categoryFilter").value=el.dataset.category;renderProducts();}));
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();document.getElementById("newsletterMessage").textContent="Paldies! Demonstrācijas formā pieteikums nav nosūtīts.";e.target.reset();});
document.querySelector(".menu-toggle").addEventListener("click",e=>{const nav=document.getElementById("mainNav");nav.classList.toggle("open");e.currentTarget.setAttribute("aria-expanded",String(nav.classList.contains("open")));});
renderProducts();renderCart();
