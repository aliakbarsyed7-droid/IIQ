"use client";
import Image from "next/image";
import { FormEvent, useState } from "react";

const values = [
  ["◎","STRATEGIC THINKING","Practical, commercial and outcome focused."],
  ["⌁","TECHNOLOGY LED","Solutions built on the latest innovations."],
  ["♢","SECURE & RELIABLE","Protecting your business and your data."],
  ["◎","GLOBAL PERSPECTIVE","Local expertise with global reach."]
];

const services = [
  ["strategy","STRATEGY & ADVISORY","Define your vision, roadmap and operating model for long-term success."],
  ["transformation","DIGITAL TRANSFORMATION","Modernise processes, systems and customer experiences to drive real impact."],
  ["cloud","IT & CLOUD SERVICES","Scalable, secure and cost-efficient cloud and infrastructure solutions."],
  ["crm","CRM & SALES SYSTEMS","Streamline your pipeline, improve customer relationships and drive revenue growth."],
  ["telecoms","TELECOMMUNICATIONS / UCAAS","Reliable voice, UCaaS and collaboration solutions that keep your business connected."],
  ["connectivity","GLOBAL CONNECTIVITY","Secure, high-speed connectivity solutions across the globe to power your operations."],
  ["ai","AI & AUTOMATION","Leverage AI and automation to optimise processes and unlock productivity."],
  ["growth","WEB & DIGITAL GROWTH","High performance websites, digital marketing and growth strategies that convert."],
  ["outsourcing","OUTSOURCING SUPPORT","Expert teams and managed services to support and scale your business operations."],
  ["finance","FINANCIAL SERVICES & STRATEGIC FINANCING","Access funding, financial advisory and strategic financing solutions to fuel your growth."],
  ["analytics","DATA & ANALYTICS","Turn data into insights with advanced analytics, dashboards and reporting."],
  ["security","CYBER SECURITY","Protect your business with robust security, compliance and risk management."]
];

function ContactForm(){
  const [state,setState]=useState<"idle"|"loading"|"ok"|"error">("idle");
  async function submit(e:FormEvent<HTMLFormElement>){
    e.preventDefault(); setState("loading");
    const form=e.currentTarget;
    const body=Object.fromEntries(new FormData(form).entries());
    try{
      const r=await fetch("/api/contact",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body)});
      if(!r.ok) throw new Error();
      setState("ok"); form.reset();
    }catch{ setState("error"); }
  }
  return <form onSubmit={submit} className="form">
    <div className="form-grid">
      <label><span>Full Name</span><input name="name" autoComplete="name" required placeholder="Full Name"/></label>
      <label><span>Company Name</span><input name="company" autoComplete="organization" placeholder="Company Name"/></label>
      <label><span>Email Address</span><input name="email" type="email" autoComplete="email" required placeholder="Email Address"/></label>
      <label><span>Phone Number</span><input name="phone" type="tel" autoComplete="tel" pattern="[0-9+() \-]{7,24}" placeholder="Phone Number"/></label>
    </div>
    <label className="message"><span>How can we help?</span><textarea name="message" required minLength={10} maxLength={3000} placeholder="How can we help?"/></label>
    <label className="hp" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off"/></label>
    <button disabled={state==="loading"}>{state==="loading"?"SENDING…":"SEND MESSAGE"} <b>↗</b></button>
    <div className="status" role="status" aria-live="polite">
      {state==="ok" && "Thank you. Your message has been received and we'll be in touch shortly."}
      {state==="error" && "Sorry, your message could not be sent. Please try again."}
    </div>
  </form>
}

export default function Home(){
 return <main>
  <section className="hero">
    <header className="header shell">
      <a href="#" className="brand" aria-label="Innovative IQ home"><Image src="/assets/innovative-iq-logo-transparent.png" alt="Innovative IQ" width={154} height={154} priority/></a>
      <a href="#contact" className="contact-btn">CONTACT US</a>
    </header>
    <div className="shell hero-grid">
      <div className="hero-copy">
        <h1><span>THE ONLY</span><em>TECHNOLOGY BUSINESS</em><span>CONSULTANCY</span><strong>TOO BUSY TO HAVE A FULL WEBSITE.</strong></h1>
        <i className="rule"/>
        <p>We help ambitious businesses leverage technology, data and AI to solve problems, scale smarter and stay ahead. We work for you not us!</p>
      </div>
      <div className="coin"><Image src="/assets/innovative-iq-hero-coin-transparent.png" alt="Innovative IQ technology coin" width={432} height={374} priority/></div>
    </div>
  </section>

  <section className="shell values" aria-label="Our values">
    {values.map(([icon,title,copy])=><article key={title}><div className="value-icon">{icon}</div><div><h2>{title}</h2><p>{copy}</p></div></article>)}
  </section>

  <section className="shell services">
    <div className="section-title"><span>OUR SERVICES</span><h2>End to end technology consultancy built around your business.</h2></div>
    <div className="service-grid">
      {services.map(([img,title,copy])=><article className="card" key={title}>
        <div className="card-art"><Image src={`/assets/${img}.webp`} alt="" width={180} height={112} loading="lazy"/></div>
        <h3>{title}</h3><p>{copy}</p>
      </article>)}
    </div>
  </section>

  <section id="contact" className="shell contact">
    <div className="contact-info">
      <h2>LET&apos;S BUILD<br/>SOMETHING GREAT.</h2><i className="short-rule"/>
      <p>Got a challenge? Let&apos;s talk.<br/>We&apos;ll respond promptly.</p>
      <address>
        <a href="mailto:info@innovativeiq.co.uk">✉ <span>info@innovativeiq.co.uk</span></a>
        <a href="tel:+447772278450">⌕ <span>+44 7772 278450</span></a>
        <div>⌖ <span>Global Technology Solutions<br/>with Local Expertise</span></div>
      </address>
    </div>
    <div className="contact-form"><h2>SEND US A MESSAGE</h2><ContactForm/></div>
  </section>

  <footer className="shell footer">
    <Image src="/assets/innovative-iq-logo-transparent.png" alt="" width={55} height={55}/><p>STRATEGIC THINKING. TECHNOLOGY LED. BUSINESS GROWTH.</p>
  </footer>
 </main>
}




