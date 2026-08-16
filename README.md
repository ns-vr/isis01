
# ISIS — Understand. Protect. Restore.

> **ISIS turns health information into personalized action.**

ISIS is my attempt to make healthcare information easier to understand, easier to act on, and a little less lonely.

**Live App:** [https://isis01.lovable.app/](https://isis01.lovable.app/)

---

## Inspiration

ISIS started with something very personal to me.

My grandparents live in another city, away from me and my family. As they got older, there were little things that became harder for them — remembering their medicines, understanding doctor's instructions, keeping track of their daily routines, or simply checking in with us.

Sometimes they would forget.

And sometimes, we would get frustrated.

Not because we didn't care.

**Because we cared so much, and we couldn't always be there.**

I remember wishing there was something that could just be there for them when I couldn't.

Something that could remind them to take their medicine.

Something that could read a complicated document aloud when they didn't understand it.

Something that could gently encourage them when they were having a difficult day.

Something that could help them keep track of the little things that mattered.

And, most importantly, something that could give me a little peace of mind knowing that even from another city — or another country — there was still something looking out for them.

That's where ISIS came from.

I didn't want to build another health dashboard filled with numbers and graphs.

**I wanted to build a bridge.**

A bridge between people and the health information they struggle to understand.

A bridge between families separated by distance.

A bridge between knowing something and actually doing something about it.

That's why ISIS doesn't just tell you what your health information says.

**It helps turn that information into something you can actually do.**

And sometimes, I think that's what technology should really be about:

Making someone feel a little less alone.

---

## What It Does

ISIS connects the entire journey:

**Health Information → Understanding → Action → Wellness → Feedback**

### Understand

I built ISIS to make complicated information easier to understand.

Users can provide documents and information and have ISIS:

* Extract important instructions
* Simplify information
* Identify actionable items
* Explain where information came from
* Read information aloud

### Health Vault

The Health Vault is where health-related information comes together.

It can help organize:

* Doctor's instructions
* Prescriptions
* Medication information
* Appointments
* Recurring health-related actions

ISIS doesn't diagnose or replace medical professionals.

**It organizes information so it's easier to understand and act on.**

### Make This Part of My Day

This is one of the features I'm most proud of.

If ISIS finds something actionable in a document, it can turn it into part of the user's daily routine.

For example:

> **Prescribed stretches — twice daily**
> `[ Add to my day ]`

That action can then appear in **Today's Brief**, become part of the user's routine, and potentially trigger a wellness intervention.

Instead of:

> "Here's what your doctor said."

ISIS asks:

> **"How can I help you actually follow through?"**

### Today's Brief

I didn't want to create another app that bombards people with notifications.

So I created **Today's Brief**.

It prioritizes what matters right now instead of showing everything at once.

> **You have a lot going on today.**
> Right now → Take a short movement break
> In 20 minutes → Medication reminder
> Tomorrow → Appointment
>
> **I'll keep things simple.**

### Wellness

Health isn't just about documents and medication.

Sometimes you just need to pause.

ISIS lets users check in with simple signals such as:

* Energy
* Overload
* Movement
* Hydration
* Sleep

When someone needs support, ISIS can offer a short guided intervention.

### Intervene → Measure → Learn

I wanted ISIS to do more than give a suggestion and disappear.

After an intervention, it asks:

> **"How do you feel now?"**

**Better · Same · Still not great**

That feedback becomes part of the learning loop.

**SENSE → UNDERSTAND → INTERVENE → MEASURE → LEARN**

### Express

Sometimes understanding isn't the problem.

**Communicating is.**

ISIS can help turn simple choices into a clear message for situations involving doctors, appointments, medication, teachers, bills, and more.

---

## How I Built It

I built ISIS as a solo project using:

* React
* Tailwind CSS
* Claude API
* Server-side API routing
* Web Speech APIs
* Browser Notifications
* Recharts
* JavaScript / TypeScript

The AI layer is powered by Claude and follows a structured pipeline:

```text
INPUT
  ↓
UNDERSTAND
  ↓
EXTRACT FACTS
  ↓
VERIFY SOURCES
  ↓
PERSONALIZE
  ↓
GENERATE ACTION
  ↓
GET FEEDBACK
  ↓
LEARN
```

I also built a **Personal Adaptation Profile** because I didn't want personalization to just mean changing a color or turning a setting on.

The same information can be presented differently depending on how someone prefers to interact with it — simpler explanations, more detailed information, visual presentation, or voice.

---

## The Architecture I Built Around

The hardest part wasn't building individual features.

It was making sure ISIS didn't become:

> "a document reader + reminder app + wellness tracker + communication tool."

So I made one loop the center of everything:

```text
Health Information
       ↓
   Understand
       ↓
   Personalize
       ↓
Make it actionable
       ↓
 Today's Brief
       ↓
   Wellness
       ↓
  Intervene
       ↓
 "Did it help?"
       ↓
    Learn
       ↺
```

Everything else supports this loop.

---

## Challenges I Ran Into

### Making it feel like one product

Building four different modes was easy compared to making them feel connected.

I kept asking myself:

> **"Why does this feature need to exist inside ISIS?"**

If it didn't contribute to the central health → action → wellness loop, I treated it as secondary.

### Making AI trustworthy

Working with health information made me realize how important traceability is.

I didn't want ISIS to simply say:

> "Trust me, this is what your document means."

So I built **"Show me why"** into the experience.

Whenever possible, users can see the original information behind an extracted instruction.

### Building something personal without making it complicated

I wanted ISIS to feel helpful to someone who isn't comfortable with technology.

That meant constantly removing unnecessary complexity.

The goal became:

**Fewer things to figure out. More things that just make sense.**

### Building it alone

Because I'm building ISIS as a solo founder, I had to constantly make trade-offs between what would be exciting to build and what actually mattered to the core experience.

That forced me to focus.

Instead of trying to build everything, I focused on making one journey work:

**Understand → Act → Intervene → Learn.**

---

## What I'm Proud Of

I'm proud that I didn't just build a collection of screens.

I built a working product around a problem that genuinely matters to me.

I'm especially proud of:

* The Health → Wellness loop
* Source-backed health information
* Personal adaptation
* "Make This Part of My Day"
* Today's Brief
* The Intervene → Measure → Learn cycle
* The Privacy Center
* Accessibility-focused interactions
* The AI reasoning pipeline powered by Claude

But honestly, the thing I'm proudest of isn't technical.

**I built something that started with my own family and turned into an idea that could potentially help someone else's family too.**

---

## What I Learned

Building ISIS changed the way I think about AI.

At first, I thought the difficult part would be making the AI understand information.

It wasn't.

The harder question was:

> **"What happens after the AI understands it?"**

A model can explain a prescription.

But what happens next?

A model can understand a message.

But can it make communicating easier?

A model can recognize that someone is struggling with their day.

But can it help them take one small step forward?

That made me realize that the most useful AI isn't necessarily the AI that gives you the most information.

**It's the AI that helps you do something meaningful with it.**

---

## What's Next for ISIS 1.0

I want ISIS to eventually become more than a personal health companion.

I want it to become a **digital layer of support for families who can't always be physically together.**

### Family & Care Circles

I'd like to allow trusted family members to stay connected without turning someone's health into something that is constantly monitored.

### Better Accessibility

I want to expand:

* Voice-first interaction
* Multilingual support
* Read-aloud health documents
* Simpler interfaces
* Larger interaction modes
* Better support for older adults

### Smarter Reminders

I want reminders to eventually become more human.

Not just:

> "Take your medicine."

But reminders that understand someone's routine and communication preferences while still keeping them in control.

### Human Connection

This is especially important to me.

I don't want ISIS to try to replace human care.

Sometimes the best thing an AI can say is:

> **"Maybe it's time to talk to someone you trust."**

### The Bigger Vision

I started ISIS because I know what it feels like to care about someone who is far away.

I want to build something that makes that distance feel a little smaller.

Something that helps a grandparent feel supported.

Something that gives a child a little more peace of mind about their parents.

Something that makes confusing health information less frightening.

Something that reminds someone they're not completely on their own.

**Because sometimes technology doesn't need to change the world.**

**Sometimes it just needs to make someone feel a little safer in it.**

---

## Live Demo

**Try ISIS:**
[https://isis01.lovable.app/](https://isis01.lovable.app/)

---

## Project Status

**ISIS 1.0 — Working Prototype**

Built around one simple loop:

> **Understand → Personalize → Act → Intervene → Measure → Learn**

**Built by one person, inspired by the people I care about.**
