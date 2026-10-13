import { useEffect, useRef, useState } from "react";
import { Brain, MessageCircle, Wind, BookOpen, FlaskConical, ShieldCheck, Send, Plus, Menu, X, Sparkles, Heart, Clock3, Check, ChevronRight, RotateCcw } from "lucide-react";

const starterMessages = [
  { role: "assistant", content: "Hey, I'm here with you. You don't have to have everything figured out before we begin.\n\nWhat's taking up the most space in your mind today?" }
];
const navItems = [
  { id: "chat", label: "Talk it through", icon: MessageCircle },
  { id: "mindfulness", label: "Mindfulness", icon: Wind },
  { id: "reflection", label: "Thought reflection", icon: BookOpen },
  { id: "plan", label: "My wellbeing plan", icon: Heart },
  { id: "science", label: "Mind & science", icon: FlaskConical }
];
const practices = [
  { title: "Arrive in the present", time: "1 minute", steps: ["Place both feet on the floor and let your shoulders soften.", "Notice three things you can see around you.", "Notice two sounds, near or far.", "Take one comfortable breath. Nothing needs to be forced."] },
  { title: "A gentle breathing pause", time: "2 minutes", steps: ["Sit in a way that feels supported.", "Breathe naturally; don't try to take unusually deep breaths.", "Notice the beginning, middle, and end of each exhale.", "When your mind wanders, gently return to the next breath."] },
  { title: "Observe a difficult feeling", time: "3 minutes", steps: ["Name what is here, such as worry, sadness, or frustration.", "Notice where you feel it in your body, without trying to change it.", "Try saying: “This is a feeling I'm experiencing; it isn't my whole identity.”", "Ask yourself what one kind, useful next step might be."] }
];
const plans = {
  "3": ["Take one 2-minute pause each day", "Write down one feeling without judging it", "Notice one small thing that helped"],
  "7": ["Practise a short grounding exercise", "Journal: what is in my control today?", "Take a screen-free pause", "Reach out to someone safe", "Notice a thought without treating it as fact", "Do one restorative activity", "Reflect on what felt helpful this week"],
  "14": ["Start with a 2-minute grounding pause", "Name one feeling you notice", "Take a gentle walk or stretch", "Write down a recurring thought", "Separate facts from assumptions", "Make space for a screen-free break", "Connect with a trusted person", "Practise a kind response to yourself", "Notice body tension and relax if comfortable", "Choose one manageable task", "Reflect on what you need more of", "Spend time on something meaningful", "Repeat the practice that helped most", "Review your week without judging yourself"]
};

export default function App() {
  const [active, setActive] = useState("chat");
  const [mobileNav, setMobileNav] = useState(false);
  const [messages, setMessages] = useState(starterMessages);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [chatError, setChatError] = useState("");
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [reflection, setReflection] = useState({ situation: "", thought: "", feeling: "", balanced: "" });
  const [planLength, setPlanLength] = useState("7");
  const [checkedPlan, setCheckedPlan] = useState([]);
  const [savedPlan, setSavedPlan] = useState(false);
  const [aiConfigured, setAiConfigured] = useState(null);
  const endRef = useRef(null);

  useEffect(() => { fetch("/api/health").then(r => r.json()).then(d => setAiConfigured(d.aiConfigured)).catch(() => setAiConfigured(false)); }, []);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, busy]);

  async function sendMessage(text = draft) {
    const content = text.trim();
    if (!content || busy) return;
    const next = [...messages, { role: "user", content }];
    setMessages(next);
    setDraft("");
    setBusy(true);
    setChatError("");
    try {
      const response = await fetch("/api/chat", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ messages: next.filter(m => m.role === "user" || m.role === "assistant") }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Something went wrong.");
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setChatError(err.message || "Could not connect to TheOne.");
    } finally { setBusy(false); }
  }
  function startNewChat() { setMessages(starterMessages); setChatError(""); setActive("chat"); }
  function selectNav(id) { setActive(id); setMobileNav(false); }
  const currentPractice = practices[practiceIndex];

  return <div className="app-shell">
    <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
      <div className="brand"><div className="brand-mark"><Brain size={22}/></div><div><strong>TheOne</strong><span>Mind support, with care</span></div><button className="icon-btn close-nav" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18}/></button></div>
      <button className="new-chat" onClick={startNewChat}><Plus size={17}/> New conversation</button>
      <div className="nav-label">YOUR SPACE</div>
      <nav>{navItems.map(item => { const Icon = item.icon; return <button key={item.id} className={`nav-item ${active === item.id ? "active" : ""}`} onClick={() => selectNav(item.id)}><Icon size={18}/><span>{item.label}</span>{active === item.id && <ChevronRight size={15} className="nav-arrow"/>}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="privacy-mini"><ShieldCheck size={17}/><div><strong>A space to pause</strong><span>Share only what feels okay.</span></div></div><div className="side-foot">Thoughtful support, not a diagnosis.</div></div>
    </aside>
    {mobileNav && <button className="mobile-scrim" onClick={() => setMobileNav(false)} aria-label="Close navigation"/>}
    <main className="main">
      <header className="topbar"><button className="icon-btn menu-btn" onClick={() => setMobileNav(true)} aria-label="Open menu"><Menu size={20}/></button><div className="breadcrumb">TheOne <span>/</span> {navItems.find(n => n.id === active)?.label}</div><div className="top-status"><span className={`status-dot ${aiConfigured === false ? "status-warn" : ""}`}/>{aiConfigured === false ? "AI setup needed" : "A moment for you"}</div></header>
      <div className="content">
        {active === "chat" && <section className="chat-page">
          <div className="welcome"><div className="eyebrow"><Sparkles size={14}/> YOUR PERSONAL REFLECTION SPACE</div><h1>A little more room<br/><em>to understand yourself.</em></h1><p>No pressure to fix everything at once. Start wherever you are.</p></div>
          <div className="chat-card">
            <div className="chat-head"><div className="assistant-avatar"><Brain size={19}/></div><div><strong>TheOne</strong><span>Here to listen and help you reflect</span></div><span className="online-pill"><span/> Present</span></div>
            <div className="messages">{messages.map((m, i) => <div key={i} className={`message-row ${m.role === "user" ? "user-row" : ""}`}><div className={`message-avatar ${m.role === "user" ? "user-avatar" : ""}`}>{m.role === "user" ? "You" : <Brain size={15}/>}</div><div className={`message-bubble ${m.role === "user" ? "user-bubble" : ""}`}>{m.content.split("\n").map((p, j) => p ? <p key={j}>{p}</p> : <div key={j} className="message-space"/> )}</div></div>)}{busy && <div className="message-row"><div className="message-avatar"><Brain size={15}/></div><div className="message-bubble typing"><i/><i/><i/></div></div>}<div ref={endRef}/></div>
            {chatError && <div className="inline-error"><ShieldCheck size={17}/><div><strong>Chat isn't connected yet</strong><span>{chatError}</span></div></div>}
            <form className="composer" onSubmit={e => { e.preventDefault(); sendMessage(); }}><textarea value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="What's on your mind?" rows="1" aria-label="Your message"/><button disabled={!draft.trim() || busy} aria-label="Send message"><Send size={17}/></button><div className="composer-note">Enter to send · Shift + Enter for a new line</div></form>
          </div>
          <div className="prompt-label">NOT SURE WHERE TO BEGIN?</div><div className="prompt-grid">{["I feel overwhelmed and can't switch off", "Help me understand a recurring thought", "Can we do a short grounding exercise?"].map((p, i) => <button key={p} className="prompt-card" onClick={() => sendMessage(p)}><span>{["01", "02", "03"][i]}</span>{p}<ChevronRight size={16}/></button>)}</div>
          <p className="disclaimer"><ShieldCheck size={14}/> TheOne offers general wellbeing support, not medical care. Avoid sharing private identifying information.</p>
        </section>}
        {active === "mindfulness" && <section className="subpage"><div className="eyebrow"><Wind size={14}/> GENTLE PRACTICE</div><h1>Come back to <em>this moment.</em></h1><p className="sublead">You don't need to empty your mind. Just notice what is here, one step at a time.</p><div className="practice-layout"><div className="practice-list">{practices.map((p, i) => <button key={p.title} className={`practice-choice ${practiceIndex === i ? "selected" : ""}`} onClick={() => { setPracticeIndex(i); setStepIndex(0); setCompleted(false); }}><span className="practice-num">0{i+1}</span><span><strong>{p.title}</strong><small>{p.time}</small></span><ChevronRight size={17}/></button>)}</div><div className="practice-card"><div className="breath-orb"><div><Wind size={27}/></div></div><span className="eyebrow centered">STEP {completed ? currentPractice.steps.length : stepIndex + 1} OF {currentPractice.steps.length}</span><h2>{completed ? "You made space." : currentPractice.title}</h2><p>{completed ? "Take a moment to notice how you feel. There is no right result, and you can return to this practice whenever you want." : currentPractice.steps[stepIndex]}</p><div className="step-dots">{currentPractice.steps.map((_, i) => <span key={i} className={(completed || i <= stepIndex) ? "done" : ""}/>)}</div><button className="primary-btn" onClick={() => { if (completed) { setCompleted(false); setStepIndex(0); } else if (stepIndex < currentPractice.steps.length - 1) setStepIndex(stepIndex + 1); else setCompleted(true); }}>{completed ? <><RotateCcw size={16}/> Practise again</> : stepIndex === currentPractice.steps.length - 1 ? <><Check size={16}/> Complete practice</> : <>Next step <ChevronRight size={16}/></>}</button><small className="practice-hint">If focusing on your breath feels uncomfortable, open your eyes and notice your surroundings instead.</small></div></div></section>}
        {active === "reflection" && <section className="subpage"><div className="eyebrow"><BookOpen size={14}/> SELF-REFLECTION</div><h1>Meet your thoughts<br/><em>with curiosity.</em></h1><p className="sublead">A thought can feel convincing without being the whole truth. Use this private exercise to explore one.</p><div className="reflection-card"><div className="reflection-intro"><div className="reflection-icon"><BookOpen size={21}/></div><div><h2>A thought, gently examined</h2><p>This is a reflection tool, not a diagnosis or a test.</p></div></div><label>1. What happened? <span>Just the facts, as best you can.</span><textarea value={reflection.situation} onChange={e => setReflection({...reflection, situation:e.target.value})} placeholder="Something happened at work, at home, or in my thoughts…" rows="3"/></label><label>2. What thought showed up? <span>What did your mind tell you?</span><textarea value={reflection.thought} onChange={e => setReflection({...reflection, thought:e.target.value})} placeholder="For example: “I always get things wrong.”" rows="3"/></label><label>3. What feeling came with it? <span>Name it without judging it.</span><input value={reflection.feeling} onChange={e => setReflection({...reflection, feeling:e.target.value})} placeholder="Worry, anger, sadness, shame, uncertainty…"/></label><label>4. What is a more balanced way to see it? <span>Not forced positivity — just a little more room.</span><textarea value={reflection.balanced} onChange={e => setReflection({...reflection, balanced:e.target.value})} placeholder="What evidence supports this thought? What might I be missing?" rows="3"/></label><div className="reflection-footer"><span><ShieldCheck size={15}/> This exercise stays in this browser session.</span><button className="secondary-btn" onClick={() => setReflection({situation:"",thought:"",feeling:"",balanced:""})}>Clear reflection</button></div></div></section>}
        {active === "plan" && <section className="subpage"><div className="eyebrow"><Heart size={14}/> SMALL, STEADY STEPS</div><h1>Wellbeing, at <em>your pace.</em></h1><p className="sublead">Choose a gentle plan. These are invitations, not tasks you have to get perfect.</p><div className="plan-switch">{[["3","3 days"],["7","7 days"],["14","14 days"]].map(([v,l]) => <button key={v} className={planLength === v ? "chosen" : ""} onClick={() => { setPlanLength(v); setCheckedPlan([]); setSavedPlan(false); }}>{l}</button>)}</div><div className="plan-card"><div className="plan-header"><div><span className="eyebrow">YOUR PERSONAL PLAN</span><h2>{planLength}-day reset</h2><p>One manageable step each day. Adjust or skip anything that doesn't suit you.</p></div><div className="plan-badge"><Heart size={21}/></div></div><div className="plan-progress"><div><span>{checkedPlan.length} of {plans[planLength].length} steps completed</span><strong>{Math.round(checkedPlan.length / plans[planLength].length * 100)}%</strong></div><div className="progress-track"><span style={{width:`${checkedPlan.length / plans[planLength].length * 100}%`}}/></div></div><div className="plan-tasks">{plans[planLength].map((task, i) => <button key={task} className={`plan-task ${checkedPlan.includes(i) ? "task-done" : ""}`} onClick={() => setCheckedPlan(checkedPlan.includes(i) ? checkedPlan.filter(n => n !== i) : [...checkedPlan, i])}><span className="task-check">{checkedPlan.includes(i) && <Check size={14}/>}</span><span><small>DAY {i+1}</small>{task}</span></button>)}</div><div className="plan-note"><Clock3 size={16}/><span>Even two minutes counts. Rest is part of wellbeing, too.</span></div></div><button className="secondary-btn plan-reset" onClick={() => { setCheckedPlan([]); setSavedPlan(false); }}>Reset checklist</button></section>}
        {active === "science" && <section className="subpage"><div className="eyebrow"><FlaskConical size={14}/> CURIOUS, BUT GROUNDED</div><h1>The mind is fascinating.<br/><em>Let's explore carefully.</em></h1><p className="sublead">Science can explain some things about experience, while leaving real open questions. We can stay curious without treating guesses as facts.</p><div className="science-grid"><article className="science-card"><div className="science-icon"><Brain size={20}/></div><span className="evidence-label established">WELL SUPPORTED</span><h2>Thoughts and emotions</h2><p>Thoughts, body sensations, feelings, memories, and attention influence each other. Noticing a thought can help create a pause before reacting to it.</p><small>Useful lens: cognitive and behavioural psychology.</small></article><article className="science-card"><div className="science-icon"><Wind size={20}/></div><span className="evidence-label established">EVIDENCE-INFORMED</span><h2>Mindfulness</h2><p>Mindfulness practices may help some people with stress and emotional regulation. Effects vary, and meditation isn't comfortable or helpful for everyone in every moment.</p><small>Useful lens: present-moment attention without judgement.</small></article><article className="science-card"><div className="science-icon"><FlaskConical size={20}/></div><span className="evidence-label open">ACTIVE RESEARCH</span><h2>Consciousness</h2><p>Researchers study how brain activity relates to perception, awareness, and experience. There is no single theory that settles every question about subjective experience.</p><small>Useful lens: neuroscience and philosophy of mind.</small></article><article className="science-card"><div className="science-icon"><Sparkles size={20}/></div><span className="evidence-label unsupported">NOT ESTABLISHED</span><h2>Remote mind healing</h2><p>There is no reliable scientific evidence that a chatbot can enter a person's mind, read private thoughts, or heal them remotely through atomic or quantum connections.</p><small>We can still use conversation to support reflection and coping.</small></article></div><div className="science-note"><ShieldCheck size={18}/><div><strong>Our principle</strong><p>Respect personal meaning and spiritual questions while clearly separating them from established scientific evidence.</p></div></div></section>}
      </div>
      <footer className="footer"><span>THEONE <i>·</i> A SPACE TO UNDERSTAND, NOT JUDGE</span><span>Not a substitute for professional care</span></footer>
    </main>
  </div>;
}
