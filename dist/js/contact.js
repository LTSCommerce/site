document.addEventListener("DOMContentLoaded",function(){const r=document.getElementById("contactForm"),o=document.getElementById("formMessage");document.getElementById("sendEmailBtn").addEventListener("click",function(e){e.preventDefault();const t=new FormData(r),s=Object.fromEntries(t);if(!c(s)){i("Please fill in all required fields.","error");return}const n=l(s);window.location.href=n,i("Opening your email client... Please send the prepared email.","success")});function c(e){const t=["name","email","projectType","message"];for(const n of t)if(!e[n]||e[n].trim()==="")return!1;return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email)?!0:(i("Please enter a valid email address.","error"),!1)}function l(e){const t="contact@ltscommerce.dev",s=`Contact Form from ${e.name}`;let n=`Hello Joseph,

`;return n+=`I'm reaching out regarding a potential project.

`,n+=`--- Contact Details ---
`,n+=`Name: ${e.name}
`,n+=`Email: ${e.email}
`,e.company&&(n+=`Company: ${e.company}
`),n+=`
--- Project Information ---
`,n+=`Project Type: ${a(e.projectType)}
`,e.budget&&(n+=`Budget Range: ${e.budget}
`),e.timeline&&(n+=`Timeline: ${e.timeline}
`),n+=`
--- Project Details ---
`,n+=`${e.message}

`,n+=`Best regards,
${e.name}`,`mailto:${t}?subject=${encodeURIComponent(s)}&body=${encodeURIComponent(n)}`}function a(e){return{"bespoke-php":"Bespoke PHP Development","legacy-php":"Legacy PHP Modernization",infrastructure:"Infrastructure & Automation","cto-services":"CTO-Level Services","ai-development":"AI-Enhanced Development",other:"Other"}[e]||e}function i(e,t){o.textContent=e,o.className=`form-message ${t}`,o.style.display="block",o.scrollIntoView({behavior:"smooth",block:"nearest"}),t==="success"&&setTimeout(()=>{o.style.display="none"},5e3)}r.querySelectorAll("input, select, textarea").forEach(e=>{e.addEventListener("focus",function(){this.parentElement.classList.add("focused")}),e.addEventListener("blur",function(){this.value||this.parentElement.classList.remove("focused")})})});
