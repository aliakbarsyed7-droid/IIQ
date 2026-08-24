import { NextResponse } from "next/server";

const clean=(v:unknown,max=3000)=>String(v??"").replace(/[<>]/g,"").trim().slice(0,max);
const email=/^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phone=/^[0-9+() \-]{7,24}$/;

export async function POST(req:Request){
  try{
    const b=await req.json();
    if(clean(b.website)) return NextResponse.json({ok:true});
    const data={name:clean(b.name,120),company:clean(b.company,120),email:clean(b.email,254),phone:clean(b.phone,24),message:clean(b.message)};
    if(!data.name || !email.test(data.email) || data.message.length<10 || (data.phone && !phone.test(data.phone))){
      return NextResponse.json({error:"Invalid submission"},{status:400});
    }
    // Visual-review stage: validate on our own server endpoint without external email credentials.
    // Production delivery is intentionally connected only after design approval.
    console.info("Validated contact submission",{...data,message:`${data.message.slice(0,80)}…`});
    return NextResponse.json({ok:true});
  }catch{
    return NextResponse.json({error:"Unable to process request"},{status:400});
  }
}