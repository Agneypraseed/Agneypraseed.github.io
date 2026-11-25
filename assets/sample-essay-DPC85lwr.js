import{r as o,j as e,a as i}from"./index-BpVi3-xJ.js";function l({src:n}){const t=o.useRef(null);return o.useEffect(()=>{const s=t.current,a=requestAnimationFrame(()=>{const r=document.createElement("script");r.id="mapmyvisitors",r.src=n,s.appendChild(r)});return()=>{cancelAnimationFrame(a),s.replaceChildren()}},[n]),e.jsx("div",{ref:t,style:{marginTop:"2rem",maxWidth:"100%"}})}function c(n){const t={blockquote:"blockquote",h1:"h1",p:"p",...i(),...n.components};return e.jsxs(e.Fragment,{children:[e.jsx(t.h1,{children:"Hello world."}),`
`,e.jsxs(t.blockquote,{children:[`
`,e.jsx(t.p,{children:'“A small beginning is still a beginning"'}),`
`]}),`
`,e.jsx(l,{src:"https://mapmyvisitors.com/map.js?d=tGwl0YuHSIMpyubqRdX8N8h5t29HqQmPcDtZ4mrKLl0&cl=ffffff&w=a"})]})}function u(n={}){const{wrapper:t}={...i(),...n.components};return t?e.jsx(t,{...n,children:e.jsx(c,{...n})}):c(n)}export{u as default};
