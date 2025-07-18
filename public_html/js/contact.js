document.addEventListener("DOMContentLoaded",function(){const r=document.getElementById("contactForm"),s=document.getElementById("formMessage");document.getElementById("sendEmailBtn").addEventListener("click",function(e){e.preventDefault();const n=new FormData(r),o=Object.fromEntries(n);if(!c(o)){a("Please fill in all required fields.","error");return}const t=i(o);window.location.href=t,a("Opening your email client... Please send the prepared email.","success")});function c(e){const n=["name","email","projectType","message"];for(const o of n)if(!e[o]||e[o].trim()==="")return!1;return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)?!0:(a("Please enter a valid email address.","error"),!1)}function i(e){const n="contact@ltscommerce.dev",o=`Contact Form from ${e.name}`;let t=`Hello Joseph,

`;return t+=`I'm reaching out regarding a potential project.

`,t+=`--- Contact Details ---
`,t+=`Name: ${e.name}
`,t+=`Email: ${e.email}
`,e.company&&(t+=`Company: ${e.company}
`),t+=`
--- Project Information ---
`,t+=`Project Type: ${l(e.projectType)}
`,e.budget&&(t+=`Budget Range: ${e.budget}
`),e.timeline&&(t+=`Timeline: ${e.timeline}
`),t+=`
--- Project Details ---
`,t+=`${e.message}

`,t+=`Best regards,
${e.name}`,`mailto:${n}?subject=${encodeURIComponent(o)}&body=${encodeURIComponent(t)}`}function l(e){return{"bespoke-php":"Bespoke PHP Development","legacy-php":"Legacy PHP Modernization",infrastructure:"Infrastructure & Automation","cto-services":"CTO-Level Services","ai-development":"AI-Enhanced Development",other:"Other"}[e]||e}function a(e,n){s.textContent=e,s.className=`form-message ${n}`,s.style.display="block",s.scrollIntoView({behavior:"smooth",block:"nearest"}),n==="success"&&setTimeout(()=>{s.style.display="none"},5e3)}r.querySelectorAll("input, select, textarea").forEach(e=>{e.addEventListener("focus",function(){this.parentElement.classList.add("focused")}),e.addEventListener("blur",function(){this.value||this.parentElement.classList.remove("focused")})})});
