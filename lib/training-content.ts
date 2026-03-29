export interface Lesson {
  id: number
  title: string
  duration: string
  videoId: string
  videoTitle: string
  objectives: string[]
  content: string // markdown-style HTML
  actionItems: string[]
}

export interface Module {
  id: number
  title: string
  description: string
  free: boolean
  icon: string
  lessons: Lesson[]
}

export const TRAINING_MODULES: Module[] = [
  {
    id: 1,
    title: "Setting Up for Success on UGC Studio",
    description: "Build a creator profile that attracts brands and gets you hired faster.",
    free: true,
    icon: "🚀",
    lessons: [
      {
        id: 1,
        title: "Completing Your Creator Profile",
        duration: "8 min",
        videoId: "nJUmav2wWOk",
        videoTitle: "How to Build a UGC Creator Profile That Gets Hired",
        objectives: [
          "Understand every field in your UGC Studio creator profile",
          "Know what brands see when they view your profile",
          "Write a bio that converts brand views into campaign invites",
        ],
        content: `
<h2>Why Your Profile Is Your Digital CV</h2>
<p>On UGC Studio, brands browse creator profiles before they even post a campaign. A complete, compelling profile means you get discovered — an empty profile means you get ignored. Your profile is live 24/7 working for you.</p>

<h2>Step-by-Step: Completing Your Profile</h2>
<p>Navigate to <strong>Creator → Settings</strong> in your sidebar. You'll see the following sections:</p>

<h3>1. Display Name</h3>
<p>Use your real name or a consistent creator name you use across platforms. Brands search by name, and trust increases when your handle matches your social profiles. <em>Avoid usernames like "creator123" — use "Sophia Chen" or "Sophia Creates."</em></p>

<h3>2. Bio</h3>
<p>Your bio is the most-read part of your profile. Brands read it in under 10 seconds. Follow this structure:</p>
<ul>
  <li><strong>Line 1:</strong> Who you are + your niche. "UGC creator specialising in skincare, wellness & lifestyle content."</li>
  <li><strong>Line 2:</strong> Social proof or experience. "50+ brand videos delivered. 98% first-pass approval rate."</li>
  <li><strong>Line 3:</strong> Soft close. "Based in London. Quick turnarounds. Let's create something great."</li>
</ul>
<p>Keep it under 100 words. Specific beats vague every time.</p>

<h3>3. Location</h3>
<p>Always fill this in. Many brands run geo-targeted campaigns and filter by country or city. If you're not listed, you're invisible to those campaigns.</p>

<h3>4. Hourly Rate</h3>
<p>Set this thoughtfully. Beginners: €25–€50/hr. Mid-level: €50–€100/hr. Experienced: €100+/hr. This is a guide for brands — most campaigns pay per deliverable, not hourly — but it signals your market position.</p>

<h3>5. Categories</h3>
<p>Select the categories that match your content style. These are used for campaign matching. Choose accurately — being matched to irrelevant campaigns wastes everyone's time.</p>

<h2>Profile Completion Score</h2>
<p>UGC Studio's algorithm surfaces more complete profiles in brand searches. Think of each field as +points toward visibility. A fully complete profile can receive 3–5x more brand views than an empty one.</p>
        `,
        actionItems: [
          "Go to Creator → Settings and fill every field",
          "Write a 3-line bio using the structure above",
          "Set your location accurately",
          "Select 3–5 accurate content categories",
          "Set a realistic hourly rate for your experience level",
        ],
      },
      {
        id: 2,
        title: "Adding Social Handles & Building Credibility",
        duration: "6 min",
        videoId: "w6bBl-_L3Q8",
        videoTitle: "How Brands Verify UGC Creators — Social Proof Guide",
        objectives: [
          "Connect all your social profiles on UGC Studio",
          "Understand how follower counts affect campaign access",
          "Learn how your creator rating is calculated and why it matters",
        ],
        content: `
<h2>Why Social Handles Matter to Brands</h2>
<p>When a brand reviews your application, the first thing they do is check your social profiles. Your UGC Studio profile needs to link directly to your TikTok, Instagram, and YouTube so brands can verify you in one click.</p>

<h2>Step-by-Step: Adding Your Socials</h2>
<p>Go to <strong>Creator → Settings → Social Profiles</strong>. Add your handles for:</p>
<ul>
  <li><strong>TikTok:</strong> Enter your @username (without the @)</li>
  <li><strong>Instagram:</strong> Enter your @handle</li>
  <li><strong>YouTube:</strong> Enter your channel name or @handle</li>
</ul>
<p>Also enter your current follower/subscriber counts. Be accurate — brands cross-check these. Entering inflated numbers damages trust and can get your account flagged.</p>

<h2>Follower Count Reality Check</h2>
<p>Many brands on UGC Studio specifically want <strong>micro-creators</strong> (1K–50K followers) because their content performs more authentically than mega-influencers. Don't feel discouraged by small numbers — UGC is about content quality, not audience size.</p>

<h2>Your Platform Rating</h2>
<p>Your <strong>platform_rating</strong> (shown on your profile and dashboard) is calculated from:</p>
<ul>
  <li>Brand ratings after each completed campaign (1–5 stars)</li>
  <li>On-time delivery record</li>
  <li>First-pass approval rate</li>
</ul>
<p>Starting out you'll show "N/A." After your first completed campaign, brands can rate you. A score above 4.5 unlocks premium campaigns. Protect it fiercely.</p>
        `,
        actionItems: [
          "Add all three social handles in Settings → Social Profiles",
          "Enter accurate follower/subscriber counts",
          "Screenshot your current stats as a baseline to track growth",
          "View your public creator profile (Creators > your name) to see what brands see",
        ],
      },
      {
        id: 3,
        title: "Building Your UGC Studio Portfolio",
        duration: "9 min",
        videoId: "xMTpQH6YF-k",
        videoTitle: "Build a UGC Portfolio That Gets You Hired by Top Brands",
        objectives: [
          "Add your best work to your UGC Studio portfolio",
          "Understand what types of portfolio items get the most brand interest",
          "Learn the minimum portfolio threshold to attract campaign invites",
        ],
        content: `
<h2>Your Portfolio Is Your Most Powerful Sales Tool</h2>
<p>Brands make hiring decisions in seconds. Your portfolio is proof that you can deliver. On UGC Studio, creators with 5+ portfolio items get <strong>3x more campaign invites</strong> than those with empty portfolios.</p>

<h2>Step-by-Step: Adding Portfolio Items</h2>
<p>Navigate to <strong>Creator → Portfolio</strong> and click <strong>Add Work</strong>. For each item, choose:</p>
<ul>
  <li><strong>Video</strong> — a direct link to a UGC video you've made (YouTube, TikTok, Google Drive)</li>
  <li><strong>Image</strong> — a link to a product photo, lifestyle image, or screenshot</li>
  <li><strong>Link</strong> — any URL to past brand work, a reel, or campaign result</li>
</ul>

<h2>What to Include in Each Portfolio Item</h2>
<ul>
  <li><strong>Title:</strong> Be specific. "Skincare unboxing — 30s vertical video" beats "My video"</li>
  <li><strong>Brand:</strong> If it was for a real brand, name them. Adds credibility.</li>
  <li><strong>URL:</strong> Link to the actual content — not a folder, the specific video/image</li>
</ul>

<h2>What Brands Actually Look For</h2>
<p>Brands scan portfolios for three things:</p>
<ol>
  <li><strong>Niche match:</strong> Does your content match their industry?</li>
  <li><strong>Video quality:</strong> Clear audio, good lighting, stable footage</li>
  <li><strong>On-camera presence:</strong> Natural, authentic delivery — not scripted and stiff</li>
</ol>

<h2>Don't Have Past Brand Work?</h2>
<p>Create spec content. Pick a product you own (a serum, a protein powder, a gadget) and create a UGC-style video as if a brand hired you. Title it "Spec work — [Product Category]." Brands understand this and still evaluate your skill from it.</p>
        `,
        actionItems: [
          "Go to Creator → Portfolio and add at least 3 items",
          "For each item, write a specific, descriptive title",
          "Include the brand name if you've done real brand work",
          "If you have no past work, film 2 spec videos this week and add them",
          "Aim for 5+ portfolio items within your first 14 days",
        ],
      },
      {
        id: 4,
        title: "Age Verification & Tax Setup",
        duration: "7 min",
        videoId: "HqJTVzRz95s",
        videoTitle: "Creator Legal Setup — Tax Forms & Verification Explained",
        objectives: [
          "Complete age verification to unlock all campaigns",
          "Choose the correct tax form for your country",
          "Understand why these steps protect you legally",
        ],
        content: `
<h2>Why These Steps Are Non-Negotiable</h2>
<p>Many premium campaigns on UGC Studio require verified creators. Brands have legal obligations — they can't pay unverified or under-18 creators. Completing these steps immediately separates you from the majority of creators who skip them.</p>

<h2>Age Verification</h2>
<p>Go to <strong>Creator → Settings → Age Verification</strong>. Enter your date of birth. The system automatically confirms you are 18+ (required for paid brand work). This is stored securely and never shared publicly.</p>

<h2>Tax Form Selection</h2>
<p>Navigate to <strong>Settings → Tax Information</strong> and select the correct form:</p>
<ul>
  <li><strong>W-9:</strong> If you are a US person (citizen or resident) — most common for US creators</li>
  <li><strong>W-8BEN:</strong> If you are a non-US individual — use this if you're in the UK, Europe, Africa, Asia, etc.</li>
  <li><strong>W-8BEN-E:</strong> If you are a non-US entity/company</li>
  <li><strong>EU VAT Registration:</strong> If you are EU-based and VAT registered</li>
</ul>
<p>Not sure? <strong>Most creators outside the US select W-8BEN.</strong> This form certifies you are not a US taxpayer and allows brands to pay you without withholding US taxes.</p>

<h2>Why This Protects You</h2>
<p>Without the correct tax form on file, brands are legally required to withhold up to 30% of your payment for US tax purposes. Completing this correctly means you keep 100% of your earnings.</p>
        `,
        actionItems: [
          "Complete age verification in Settings → Age Verification",
          "Select your tax form in Settings → Tax Information",
          "If unsure about tax status, select W-8BEN (non-US individual)",
          "Set up your payout method (covered in detail in Module 5)",
        ],
      },
      {
        id: 5,
        title: "Understanding Your Creator Dashboard",
        duration: "5 min",
        videoId: "_HkV5MNvhL8",
        videoTitle: "UGC Studio Dashboard Walkthrough — Everything You Need to Know",
        objectives: [
          "Understand every metric on your creator dashboard",
          "Know which numbers to track weekly",
          "Use the dashboard to plan your weekly campaign strategy",
        ],
        content: `
<h2>Your Dashboard Is Your Command Centre</h2>
<p>Every time you log in, your creator dashboard gives you a real-time snapshot of your business. Learn to read it correctly and you'll always know exactly what action to take next.</p>

<h2>The Earnings Banner</h2>
<p>The top banner shows your <strong>total lifetime earnings</strong> from completed campaigns. It starts at €0 and grows with every approved campaign. Use this as your long-term motivator and set quarterly targets.</p>

<h2>The 4 Action Cards</h2>
<ul>
  <li><strong>Browse Campaigns:</strong> Active campaigns you haven't applied to yet. Check this daily — new campaigns are posted regularly.</li>
  <li><strong>My Applications:</strong> Campaigns where your application is pending. If this stays high, revisit your application message quality.</li>
  <li><strong>Content Submitted:</strong> Your total submission count. Growing this number signals experience to brands.</li>
  <li><strong>Active Campaigns:</strong> Campaigns you've been accepted into and are currently working on. Never let this go to zero.</li>
</ul>

<h2>Quick Access Cards</h2>
<p>The Training and Portfolio quick-access cards at the bottom of your dashboard are not decoration — they are your two biggest income multipliers. A completed training curriculum + a strong portfolio = consistently higher campaign acceptance rates.</p>

<h2>Your Weekly Routine</h2>
<ol>
  <li><strong>Monday:</strong> Check Browse Campaigns for new listings, apply to 3–5</li>
  <li><strong>Wednesday:</strong> Check My Applications status, follow up if needed</li>
  <li><strong>Friday:</strong> Review active campaign deadlines, submit any pending content</li>
  <li><strong>Sunday:</strong> Complete one Training lesson to keep improving</li>
</ol>
        `,
        actionItems: [
          "Bookmark Creator → Overview as your browser homepage",
          "Note your current baseline stats (even if they're all zero)",
          "Set a 30-day earnings goal and write it down",
          "Plan your first week using the weekly routine above",
          "Complete your first lesson in Module 2 today",
        ],
      },
    ],
  },

  {
    id: 2,
    title: "Finding & Winning Campaigns",
    description: "Master the campaign discovery and application process to maximise your acceptance rate.",
    free: true,
    icon: "🎯",
    lessons: [
      {
        id: 1,
        title: "How the Browse Campaigns Page Works",
        duration: "7 min",
        videoId: "kXv6oxC-hMU",
        videoTitle: "How to Find UGC Brand Deals — Complete Campaign Hunting Guide",
        objectives: [
          "Navigate the Browse Campaigns page efficiently",
          "Understand campaign cards and what each field means",
          "Filter campaigns to find the best matches for your profile",
        ],
        content: `
<h2>Your Campaign Marketplace</h2>
<p>Navigate to <strong>Creator → Browse Campaigns</strong>. This is your live marketplace of active brand opportunities. Every campaign posted here by brands is open for applications from creators like you.</p>

<h2>Reading a Campaign Card</h2>
<p>Each campaign card shows:</p>
<ul>
  <li><strong>Campaign Title:</strong> The brand's name for the campaign</li>
  <li><strong>Brand Name:</strong> Who is running the campaign</li>
  <li><strong>Budget:</strong> The payment amount for the full deliverable set</li>
  <li><strong>Content Types:</strong> What format they want (TikTok, Instagram Reels, YouTube Shorts, etc.)</li>
  <li><strong>Deadline:</strong> When all content must be submitted</li>
</ul>

<h2>The Search Bar</h2>
<p>Use the search bar to filter by keyword. Search for your niche ("skincare", "fitness", "tech") to surface relevant campaigns immediately. This is the fastest way to find campaigns where you'll have a competitive advantage.</p>

<h2>Evaluating Campaign Fit Before Applying</h2>
<p>Before clicking Apply, ask yourself:</p>
<ol>
  <li>Is this brand in my niche? (Niche match = higher acceptance rate)</li>
  <li>Can I realistically deliver by the deadline?</li>
  <li>Is the budget fair for the deliverables?</li>
  <li>Do I have relevant portfolio items to reference in my application?</li>
</ol>
<p>Apply only to campaigns where you can genuinely deliver great work. A focused application beats a spray-and-pray approach every time.</p>
        `,
        actionItems: [
          "Go to Browse Campaigns and read every active listing",
          "Search for your niche keywords to filter relevant campaigns",
          "Bookmark 3–5 campaigns you want to apply to",
          "Note the budget range across active campaigns as your baseline",
        ],
      },
      {
        id: 2,
        title: "Reading a Campaign Brief Like a Pro",
        duration: "9 min",
        videoId: "8fHd8EOHY8Q",
        videoTitle: "How to Read a Brand Brief — UGC Creator Guide",
        objectives: [
          "Understand every section of a campaign detail page",
          "Identify the non-negotiables in a brief",
          "Spot red flags before committing to a campaign",
        ],
        content: `
<h2>The Brief Is Your Contract Blueprint</h2>
<p>When you click into a campaign on UGC Studio, you see the full campaign detail page. Reading this thoroughly before applying is the single most important habit you can build. Creators who skip this submit non-compliant content and get rejected — wasting their time and damaging their rating.</p>

<h2>Campaign Detail Sections — What Each Means</h2>

<h3>Description</h3>
<p>The brand's overview of what the campaign is about. Read for: the product/service being advertised, the campaign's goal (awareness vs. conversion), and the brand's tone (fun and casual vs. corporate and polished).</p>

<h3>Content Types & Deliverables</h3>
<p>This is the exact list of what you must produce. Example: "2 × 30-second TikTok videos, 1 × Instagram Reel (60s), 3 × product photos." Every item listed is a deliverable. Missing even one puts you in breach of the campaign terms.</p>

<h3>Budget</h3>
<p>This is what you'll be paid upon approval of all deliverables. Check if it matches the workload. A single 30s video should pay €50–€300+. If a campaign asks for 5 videos for €50 total, reconsider.</p>

<h3>Deadline</h3>
<p>The date ALL content must be submitted. Work backwards: if the deadline is in 7 days and you need 2 filming sessions plus editing time, can you realistically deliver? Never commit to a deadline you can't meet — late delivery hurts your rating.</p>

<h3>Brand Guidelines (if attached)</h3>
<p>Some brands link their brand guidelines. Open and read these. They specify: approved colours, fonts, logo usage, prohibited words or competitor mentions. Non-compliance = revision request.</p>

<h2>Red Flags to Watch For</h2>
<ul>
  <li>Vague briefs with no specific deliverables listed</li>
  <li>Extremely tight deadlines (less than 48 hours for video content)</li>
  <li>Budget below market rate for the workload</li>
  <li>Requests for exclusivity without additional compensation</li>
</ul>
        `,
        actionItems: [
          "Open a campaign detail page and read every section fully",
          "List out all deliverables for the campaign before applying",
          "Calculate whether the budget matches the workload",
          "Check if the deadline is achievable given your schedule",
          "Note any brand guidelines requirements",
        ],
      },
      {
        id: 3,
        title: "Writing a Winning Application Message",
        duration: "10 min",
        videoId: "nJUmav2wWOk",
        videoTitle: "How to Write a Brand Deal Application That Gets Accepted",
        objectives: [
          "Write applications that stand out from 50+ other creators",
          "Use a proven application message framework",
          "Customise your application per campaign — never use a generic template",
        ],
        content: `
<h2>Your Application Is Your First Impression</h2>
<p>When you apply to a campaign on UGC Studio, the brand sees your profile AND your application message. Most creators write generic messages. That's your advantage — a tailored, specific application immediately signals professionalism.</p>

<h2>The Winning Application Framework</h2>

<h3>Line 1: The Hook (Show You Actually Read the Brief)</h3>
<p>Start with something specific to their campaign. <em>"I love what you're doing with your new vitamin C serum line — I've been using similar formulas for 3 years and know how to communicate the skin texture difference authentically."</em></p>
<p>This immediately signals you're not copy-pasting. Generic openers like "Hi! I'm interested in this campaign" get ignored.</p>

<h3>Line 2: Why You (Specific Credibility)</h3>
<p>Give one or two specific reasons you're the right fit. Reference your niche, a portfolio item, or a relevant experience. <em>"My last skincare UGC delivered a 4.8% CTR vs. 1.2% industry average. Here's the link: [your portfolio link]."</em></p>

<h3>Line 3: Your Plan (Show You Know What You're Delivering)</h3>
<p>Briefly outline how you'd approach their content. <em>"My concept: opening hook showing dry vs. hydrated skin, 20-second product demo with natural lighting, closing CTA with your discount code."</em> This shows creative thinking, not just availability.</p>

<h3>Line 4: The Close</h3>
<p>Soft close, not desperate. <em>"Happy to discuss creative direction before we start. Looking forward to it."</em></p>

<h2>Length</h2>
<p>Keep it to 4–6 sentences. Brands read dozens of applications. Concise and specific wins over lengthy and vague every time.</p>

<h2>Before You Hit Submit</h2>
<ul>
  <li>Re-read the brief one more time</li>
  <li>Make sure your application references something specific from the brief</li>
  <li>Check your portfolio has at least one relevant item</li>
  <li>Confirm your availability to deliver by their deadline</li>
</ul>
        `,
        actionItems: [
          "Write your application message template using the 4-line framework",
          "Apply to at least 2 campaigns today using the framework",
          "Link to a specific portfolio item in each application",
          "Set a goal: 5 applications per week minimum",
        ],
      },
      {
        id: 4,
        title: "What Brands Actually Evaluate in Your Profile",
        duration: "8 min",
        videoId: "w6bBl-_L3Q8",
        videoTitle: "Inside the Brand Mind — What They Look For in UGC Creators",
        objectives: [
          "See your profile through a brand's eyes",
          "Identify and fix the top 5 gaps brands screen for",
          "Optimise your public-facing creator page on UGC Studio",
        ],
        content: `
<h2>The 30-Second Brand Screening Process</h2>
<p>When a brand receives your application, they spend less than 30 seconds on your profile before deciding yes or no. They're scanning for five things — in this order.</p>

<h2>1. Profile Photo & Display Name</h2>
<p>Your avatar initial (or photo) is the first thing they see. Your name needs to look professional. "Jake Miller" or "Sophia Chen UGC" reads as a real creator. "xo_creator99" reads as a hobbyist. Check what your avatar looks like in Creator → Profile.</p>

<h2>2. Bio Credibility Signal</h2>
<p>They read the first sentence of your bio. Does it clearly state your niche and experience level? If your bio says "I love creating content!" it tells them nothing. If it says "UGC creator specialising in health & fitness — 30+ brand campaigns delivered" it tells them everything they need.</p>

<h2>3. Portfolio Quality</h2>
<p>They click into your portfolio and watch 5–10 seconds of your first video. This is the single biggest screening filter. Brands reject 70%+ of applicants at the portfolio stage. Your first portfolio item needs to be your absolute best work.</p>

<h2>4. Platform Rating</h2>
<p>If you have a rating (4.5+), it's a strong green flag. If it shows "N/A" (new creator), that's fine — brands factor this in. What kills you is a rating below 4.0. Protect yours from day one.</p>

<h2>5. Niche Match</h2>
<p>Does your profile clearly communicate that you operate in their space? A fitness brand reviewing a beauty creator's profile will pass — even if the content quality is great. Your categories, bio, and portfolio should all signal the same niche.</p>

<h2>View Your Own Public Profile</h2>
<p>Go to your creator public profile (the URL at <strong>/creators/[your-id]</strong>) and look at it as a brand would. Would you hire you based on what you see? If not, go back to settings and portfolio and fix what's missing.</p>
        `,
        actionItems: [
          "Visit your public creator profile page and critique it honestly",
          "Rewrite your bio if it doesn't clearly state your niche and experience",
          "Make sure your best portfolio item is listed first",
          "Add or update your categories to match your actual content niche",
        ],
      },
      {
        id: 5,
        title: "Tracking & Managing Your Applications",
        duration: "6 min",
        videoId: "S7t2JNKtGXE",
        videoTitle: "How to Track Brand Deal Applications — Creator Pipeline Management",
        objectives: [
          "Use the My Campaigns page to track every application",
          "Understand application statuses and what actions to take",
          "Know when and how to follow up professionally",
        ],
        content: `
<h2>Never Lose Track of an Application</h2>
<p>Go to <strong>Creator → My Campaigns</strong>. This is your application pipeline — every campaign you've applied to and its current status.</p>

<h2>Understanding Application Statuses</h2>
<ul>
  <li><strong>Pending:</strong> Your application is under review. No action needed. Brands typically respond within 3–5 business days.</li>
  <li><strong>Accepted:</strong> You're in. The campaign is now in your Active Campaigns. Go to the campaign page and start planning your content immediately.</li>
  <li><strong>Rejected:</strong> The brand passed. This is normal and expected — even top creators have 50%+ rejection rates. Don't take it personally.</li>
</ul>

<h2>What to Do When Accepted</h2>
<ol>
  <li>Open the campaign detail immediately and re-read the full brief</li>
  <li>Note the content deadline in your calendar</li>
  <li>Send a brief intro message to the brand via Messages</li>
  <li>Start creating content — don't delay</li>
</ol>

<h2>What to Do When Rejected</h2>
<p>Use it as data. Ask yourself:</p>
<ul>
  <li>Was my portfolio relevant to their niche?</li>
  <li>Was my application message specific enough?</li>
  <li>Were there 50+ other applicants with more experience?</li>
</ul>
<p>Apply to a new campaign immediately. Momentum matters more than individual outcomes.</p>

<h2>Your Application Conversion Rate</h2>
<p>Track: applications sent ÷ campaigns accepted. Industry average for new creators: 10–20%. With a strong profile and targeted applications: 30–50%+. Check this monthly and work to improve it systematically.</p>
        `,
        actionItems: [
          "Check My Campaigns and note the status of every application",
          "For any accepted campaign, message the brand within 24 hours",
          "Apply to a new campaign immediately after any rejection",
          "Calculate your current application-to-acceptance conversion rate",
        ],
      },
      {
        id: 6,
        title: "The Volume & Targeting Strategy",
        duration: "7 min",
        videoId: "kXv6oxC-hMU",
        videoTitle: "How Top UGC Creators Apply to Campaigns at Scale",
        objectives: [
          "Set weekly application targets to guarantee consistent income",
          "Balance volume with quality for maximum acceptance rate",
          "Use niche targeting to dominate specific campaign categories",
        ],
        content: `
<h2>The Creator Income Formula</h2>
<p>Your monthly income from UGC Studio is determined by a simple formula:</p>
<p><strong>Applications Sent × Acceptance Rate × Average Campaign Value = Monthly Income</strong></p>
<p>You control all three variables. Let's work through each.</p>

<h2>How Many Applications to Send</h2>
<p>Beginner (first 60 days): Aim for <strong>10 applications per week</strong>. This builds momentum, gives you data on which briefs you win, and ensures you always have active work.</p>
<p>Experienced (after first 5 completions): Quality over volume. 5 highly targeted applications per week will outperform 20 generic ones.</p>

<h2>Targeting Your Best-Fit Campaigns First</h2>
<p>Every time you log in, go to Browse Campaigns and search for your top 1–2 niches first. Apply to those campaigns before anything else. Your niche-match advantage gives you a significantly higher acceptance rate in campaigns directly relevant to your content style.</p>

<h2>Improving Your Acceptance Rate</h2>
<p>Three levers:</p>
<ol>
  <li><strong>Profile quality:</strong> Every portfolio item you add improves your acceptance rate</li>
  <li><strong>Application specificity:</strong> Tailored applications get 2–3x better results than templates</li>
  <li><strong>Platform rating:</strong> Each completed campaign builds your rating and unlocks better opportunities</li>
</ol>

<h2>Upgrade to Creator Pro for Unlimited Applications</h2>
<p>The free tier limits your monthly applications. Creator Pro (<strong>Settings → Subscription</strong>) removes this cap. If you're sending 10+ applications per week, Pro pays for itself after a single accepted campaign. The priority ranking boost alone is worth the monthly fee.</p>
        `,
        actionItems: [
          "Set a recurring calendar reminder to apply to campaigns every Monday and Thursday",
          "Apply to 5 campaigns in your primary niche this week",
          "Calculate what your monthly income would be at a 20% acceptance rate",
          "Review Creator Pro benefits in Settings and evaluate the ROI",
        ],
      },
    ],
  },

  {
    id: 3,
    title: "Creating Content That Gets Approved First Time",
    description: "Film, script, and edit brand content that passes review on the first submission.",
    free: true,
    icon: "🎬",
    lessons: [
      {
        id: 1,
        title: "Translating a Brief Into a Shot List",
        duration: "9 min",
        videoId: "8fHd8EOHY8Q",
        videoTitle: "How to Break Down a Brand Brief Before You Film",
        objectives: [
          "Extract all deliverables from the campaign brief into a clear shot list",
          "Identify must-have vs. nice-to-have elements before filming",
          "Avoid the #1 cause of revision requests — missing brief requirements",
        ],
        content: `
<h2>Never Pick Up Your Phone Without a Shot List</h2>
<p>The number one reason UGC content gets rejected or sent back for revisions is simple: the creator didn't film everything the brief required. The fix is equally simple: build a shot list before you film a single frame.</p>

<h2>Step 1: Open the Campaign Brief in UGC Studio</h2>
<p>Go to <strong>My Campaigns → [Campaign Name]</strong> and open the full campaign detail. Have it open on a second screen or your tablet while you work.</p>

<h2>Step 2: Extract Every Deliverable</h2>
<p>List out each specific deliverable. Example brief breakdown:</p>
<ul>
  <li>1 × 30-second TikTok video (vertical 9:16)</li>
  <li>1 × 60-second Instagram Reel</li>
  <li>Hook: show the product before and after use</li>
  <li>Must include: brand's tagline "Feel it from within"</li>
  <li>CTA: "Link in bio" verbal mention</li>
  <li>No competitor brands visible in background</li>
</ul>

<h2>Step 3: Plan Your Shots</h2>
<p>For each deliverable, plan the specific shots you need:</p>
<ul>
  <li>Opening hook shot (0–3 seconds)</li>
  <li>Product close-up (3–8 seconds)</li>
  <li>Usage demonstration (8–20 seconds)</li>
  <li>Reaction / result (20–27 seconds)</li>
  <li>CTA (27–30 seconds)</li>
</ul>

<h2>Step 4: Check Your Environment</h2>
<p>Before filming: clean your background, ensure no competitor brands are visible, check lighting, and silence your phone. These basics prevent the most common revision requests.</p>
        `,
        actionItems: [
          "For your next campaign, open the brief and list every deliverable",
          "Create a shot list with specific timecodes before filming",
          "Check your filming environment for compliance issues",
          "Film more than you need — extra footage is always better than not enough",
        ],
      },
      {
        id: 2,
        title: "Filming UGC That Brands Actually Approve",
        duration: "11 min",
        videoId: "8fHd8EOHY8Q",
        videoTitle: "UGC Filming Masterclass — Lighting, Framing & Audio on Your Phone",
        objectives: [
          "Set up natural lighting for clear, professional-looking content",
          "Frame shots correctly for TikTok, Reels, and YouTube Shorts",
          "Record clean audio without expensive equipment",
        ],
        content: `
<h2>Your Phone Is Enough — If You Use It Right</h2>
<p>You do not need a professional camera. Every major UGC campaign currently running was filmed on a smartphone. What brands care about is execution: lighting, framing, and audio.</p>

<h2>Lighting — The Biggest Variable</h2>
<p><strong>Natural light is your best friend.</strong> Film facing a window during daytime for soft, even light on your face. Never film with a window behind you (silhouette). The best times: morning (9–11am) and late afternoon (2–4pm) when sunlight is diffused.</p>
<p>If you must film at night: a ring light or a desk lamp pointed at your face from 45 degrees is all you need. Warm bulbs (3000K) look natural on camera. Avoid harsh overhead lighting — it creates unflattering shadows.</p>

<h2>Framing for Vertical Video</h2>
<p>All UGC campaigns on this platform require vertical (9:16) format for TikTok and Reels. Key rules:</p>
<ul>
  <li>Your eyes should be in the top third of the frame</li>
  <li>Leave headroom — don't cut off the top of your head</li>
  <li>Show the product clearly — it should be identifiable within 2 seconds</li>
  <li>Use a phone stand or tripod for stable footage</li>
</ul>

<h2>Audio — Non-Negotiable</h2>
<p>Bad audio is the fastest rejection in UGC. Solutions in order of quality:</p>
<ol>
  <li><strong>Wireless lavalier mic (€20–€40):</strong> Clips to your shirt, connects to phone. Clear, consistent audio regardless of environment.</li>
  <li><strong>Wired earphones with inline mic:</strong> Surprisingly good in quiet rooms.</li>
  <li><strong>Phone mic in a quiet room:</strong> Only works if you film within 1–1.5 metres of the phone and eliminate all background noise.</li>
</ol>
<p>Always record a 5-second audio test and playback before filming your full take.</p>

<h2>B-Roll Strategy</h2>
<p>Always film 2–3 close-up shots of the product: from above, from the side, and in use. These B-roll clips make editing easier and allow you to cover cuts cleanly. Brands love creators who deliver extra usable footage.</p>
        `,
        actionItems: [
          "Film a 30-second test video using only natural light from a window",
          "Check your audio quality by playing back the test on headphones",
          "Film 3 B-roll close-up shots of any product you own",
          "Compare the quality to your current portfolio — identify improvements",
        ],
      },
      {
        id: 3,
        title: "Writing Scripts That Convert",
        duration: "8 min",
        videoId: "nJUmav2wWOk",
        videoTitle: "UGC Script Writing Formula — Hook, Demo, CTA That Brands Love",
        objectives: [
          "Write a script using the proven UGC structure brands approve",
          "Create a 3-second hook that stops the scroll",
          "Sound authentic — not scripted — on camera",
        ],
        content: `
<h2>The Structure Every Successful UGC Video Follows</h2>
<p>After reviewing thousands of approved and rejected UGC submissions, the structure is always the same for winning content. Master this and your approval rate will dramatically improve.</p>

<h2>The 4-Part UGC Script Formula</h2>

<h3>Part 1: The Hook (0–3 seconds)</h3>
<p>This is everything. If you lose the viewer in the first 3 seconds, the rest doesn't matter. Your hook needs to do one of:</p>
<ul>
  <li>Make a bold claim: "This product cleared my skin in 14 days."</li>
  <li>Ask a relatable question: "Struggling to sleep? This changed everything for me."</li>
  <li>Create curiosity: "I didn't believe the reviews until I tried this myself."</li>
</ul>
<p>Write your hook first. Everything else supports it.</p>

<h3>Part 2: Problem → Agitate (3–10 seconds)</h3>
<p>Establish the problem the product solves. Speak to the viewer's pain point. "I'd tried everything for dry skin — €200 serums, 10-step routines — nothing worked consistently."</p>

<h3>Part 3: Solution → Demo (10–25 seconds)</h3>
<p>Introduce the product as the solution. Show it being used. Walk through what it does and why it works. Be specific — vague benefits ("it's great!") don't convert. Specific benefits do ("my skin absorbed it in 30 seconds, no greasy residue").</p>

<h3>Part 4: CTA (25–30 seconds)</h3>
<p>Follow the brief's CTA requirements exactly. If the brief says "mention the discount code," mention it clearly. If it says "link in bio," say "link in bio." Don't improvise the CTA — this is where brands are most specific.</p>

<h2>Sounding Natural, Not Scripted</h2>
<p>Write your script as bullet points, not word-for-word. Know your key points but deliver them conversationally. Film 3–5 takes and use the one where you sound most like yourself. Authenticity is the product — brands pay for it.</p>
        `,
        actionItems: [
          "Write a script for your next campaign using the 4-part formula",
          "Practice your hook out loud 10 times before filming",
          "Film 3 different takes and compare — which one sounds most natural?",
          "Read the brief's CTA requirements one more time before your final take",
        ],
      },
      {
        id: 4,
        title: "Editing & Exporting to Brand Standards",
        duration: "10 min",
        videoId: "_HkV5MNvhL8",
        videoTitle: "UGC Video Editing for Beginners — CapCut Tutorial for Brand Content",
        objectives: [
          "Edit a UGC video to brand-ready quality on your phone",
          "Export at the correct specs for TikTok, Reels, and YouTube Shorts",
          "Add captions, trim silences, and hit timing requirements",
        ],
        content: `
<h2>Editing Is Where Good Footage Becomes Great Content</h2>
<p>Most UGC creators film great content and then under-deliver in editing. Clean editing is what separates a 4.5-star creator from a 3.0-star creator. It doesn't need to be complex — it needs to be clean.</p>

<h2>Recommended App: CapCut (Free)</h2>
<p>CapCut is the industry standard for UGC editing on mobile. It's free, exports at high quality, and is used by creators working with the world's biggest brands. Download and use it for all your UGC Studio submissions.</p>

<h2>The 6-Step Editing Process</h2>
<ol>
  <li><strong>Import and arrange clips</strong> in chronological order per your shot list</li>
  <li><strong>Trim silences and pauses</strong> — cut any gap over 0.5 seconds. Tight pacing keeps viewers watching</li>
  <li><strong>Add captions</strong> — CapCut has auto-caption. Turn this on. 85% of social videos are watched without sound. Captions increase completion rate significantly</li>
  <li><strong>Colour grade</strong> — CapCut's "Auto" colour option usually improves footage quality. Alternatively, slight brightness +5, saturation +5, sharpness +5</li>
  <li><strong>Add audio</strong> — only if the brief allows music. Use royalty-free tracks from CapCut's built-in library. Avoid copyrighted music unless the brief specifically approves it</li>
  <li><strong>Export settings</strong> — always export at 1080p, MP4 format. For TikTok/Reels: 9:16 ratio. For YouTube Shorts: 9:16. For YouTube standard: 16:9</li>
</ol>

<h2>File Naming Before Submission</h2>
<p>Name your files clearly: <strong>BrandName_ContentType_Date.mp4</strong> (e.g., "GlowSerum_TikTok30s_2026-03.mp4"). This is professional practice and makes the brand's review process easier — which reflects positively on your rating.</p>

<h2>Final Quality Check</h2>
<p>Before submitting, watch the full video on your phone with headphones. Check: audio clarity, caption accuracy, correct timing, and that all brief requirements are visible. Fix anything that isn't perfect.</p>
        `,
        actionItems: [
          "Download CapCut if you haven't already",
          "Edit your next UGC video using the 6-step process",
          "Turn on auto-captions and correct any errors",
          "Export at 1080p MP4 and watch the final version before submitting",
          "Name your file using the BrandName_ContentType_Date convention",
        ],
      },
    ],
  },

  {
    id: 4,
    title: "Submitting, Revisions & Client Success",
    description: "Master the submission workflow, handle revisions professionally, and build 5-star brand relationships.",
    free: false,
    icon: "✅",
    lessons: [
      {
        id: 1,
        title: "The Content Submission Workflow on UGC Studio",
        duration: "7 min",
        videoId: "S7t2JNKtGXE",
        videoTitle: "How to Submit UGC Content — Platform Walkthrough",
        objectives: [
          "Submit content correctly through the UGC Studio workflow",
          "Understand submission statuses and what happens next",
          "Avoid common submission errors that delay payment",
        ],
        content: `
<h2>Submitting Through UGC Studio — Step by Step</h2>
<p>Navigate to <strong>Creator → My Campaigns → [Campaign Name] → Submit Content</strong>. This is where you deliver your work to the brand.</p>

<h2>The Submission Form</h2>
<p>When submitting, you'll need to provide:</p>
<ul>
  <li><strong>Content file or URL:</strong> Upload the video file directly, or provide a Google Drive/Dropbox link (ensure the link is set to "Anyone with the link can view")</li>
  <li><strong>Notes to brand:</strong> Brief context about your submission — version number, any creative decisions you made, and how you addressed each deliverable in the brief</li>
</ul>

<h2>Writing Your Submission Notes</h2>
<p>Don't submit silently. Write a brief professional note:</p>
<p><em>"Attached is the 30s TikTok and 60s Reel as briefed. I've included the 'Feel it from within' tagline at 0:22 and linked the discount code in the verbal CTA. Let me know if any adjustments are needed."</em></p>
<p>This signals professionalism and makes the brand's review faster — which gets you paid faster.</p>

<h2>Content Statuses After Submission</h2>
<ul>
  <li><strong>Pending Review:</strong> Submitted successfully, awaiting brand response</li>
  <li><strong>Approved:</strong> Brand has accepted your content. Payment is triggered.</li>
  <li><strong>Revision Requested:</strong> Brand needs changes. Check Messages for their feedback.</li>
  <li><strong>Rejected:</strong> Content doesn't meet requirements. Review carefully before resubmitting.</li>
</ul>

<h2>Payment Trigger</h2>
<p>Payment is released after content approval. It will appear in your <strong>Earnings</strong> page under your active payments. From approval to your payout account: typically 3–7 business days depending on your payout method.</p>
        `,
        actionItems: [
          "Submit your first piece of content via My Campaigns → Submit Content",
          "Write professional submission notes for every submission",
          "Set a notification to check your submission status within 48 hours",
          "Confirm your payout method is set up in Settings so payment isn't delayed",
        ],
      },
      {
        id: 2,
        title: "Handling Revision Requests Like a 5-Star Creator",
        duration: "8 min",
        videoId: "S7t2JNKtGXE",
        videoTitle: "How to Handle Client Revisions Professionally — Creator Guide",
        objectives: [
          "Respond to revision requests without damaging the brand relationship",
          "Understand what's a fair revision vs. scope creep",
          "Deliver revisions faster than the brand expects",
        ],
        content: `
<h2>Revisions Are Normal — How You Handle Them Defines Your Rating</h2>
<p>Even experienced creators receive revision requests. The difference between a 3-star and a 5-star creator is how they respond. Brands remember professionalism under pressure.</p>

<h2>When You Receive a Revision Request</h2>
<p>Check your <strong>Messages</strong> page immediately — brands post revision feedback there. Read the feedback completely before responding. Don't reply in the first 5 minutes — take time to understand exactly what they're asking for.</p>

<h2>Responding to Revision Feedback</h2>
<p>Your response should:</p>
<ol>
  <li><strong>Acknowledge:</strong> Confirm you've received and understood the feedback</li>
  <li><strong>Clarify (if needed):</strong> Ask one specific question if anything is unclear — don't guess</li>
  <li><strong>Commit to a timeline:</strong> Give a specific date, not "soon"</li>
</ol>
<p>Example: <em>"Thanks for the feedback — I'll adjust the hook to lead with the product first and re-record the CTA to include the discount code verbally. I'll have the revised version to you by tomorrow at noon. Does that work?"</em></p>

<h2>Fair Revisions vs. Scope Creep</h2>
<p>Most contracts allow 1–2 rounds of revisions. A fair revision fixes something that doesn't match the brief. Scope creep is when a brand asks for something that wasn't in the original brief (new scenes, completely different concept, additional deliverables).</p>
<p>If a brand asks for something beyond the original brief, politely note this and discuss via Messages. UGC Studio's contract system protects you — refer to your Contracts page for what was agreed.</p>

<h2>Delivery Speed Builds Reputation</h2>
<p>If you said you'd deliver a revision in 48 hours, deliver in 24. This single habit — consistently under-promising and over-delivering on time — is what turns one-off campaigns into repeat clients.</p>
        `,
        actionItems: [
          "Read any revision feedback fully before responding",
          "Always commit to a specific delivery date in your response",
          "Check your Contracts page to confirm what was originally agreed",
          "Aim to deliver revisions 50% faster than your committed timeline",
        ],
      },
      {
        id: 3,
        title: "Using the Messages System Professionally",
        duration: "6 min",
        videoId: "w6bBl-_L3Q8",
        videoTitle: "Professional Creator Communication — Message Templates & Etiquette",
        objectives: [
          "Use the UGC Studio Messages system effectively",
          "Set professional communication standards that brands remember",
          "Use messaging to turn one-off projects into long-term clients",
        ],
        content: `
<h2>Messages Is Your Business Relationship Hub</h2>
<p>Go to <strong>Creator → Messages</strong>. Every brand you work with has a conversation thread here. This is where campaign discussions, revision feedback, and relationship-building happen.</p>

<h2>Response Time Standard</h2>
<p>Professional standard: respond to brand messages within <strong>4 hours during business hours</strong> (9am–6pm your timezone). Next-day responses are acceptable after-hours. Delayed responses signal disorganisation and directly impact your platform rating.</p>

<h2>Message Templates for Common Situations</h2>

<h3>After Being Accepted to a Campaign:</h3>
<p><em>"Hi [Brand Name], thanks for accepting my application! I've reviewed the brief in full. My planned delivery date is [Date] — one day before the deadline. Is there anything specific you'd like me to prioritise in the creative direction before I start filming?"</em></p>

<h3>Before Submitting Content:</h3>
<p><em>"Just a heads up — I'm finalising the edit today and will submit by [time]. The video follows the brief closely: [hook type], [key message], [CTA]. Happy to adjust direction before I finalise if you have any preferences."</em></p>

<h3>After Approval (The Relationship Builder):</h3>
<p><em>"Thank you for the approval — it was a pleasure working on this. I'd love to create more content for [Brand] in the future. Happy to discuss a monthly content retainer if that would be useful for your team."</em></p>

<h2>What Not to Write</h2>
<ul>
  <li>Don't use informal language ("hey," excessive emojis) unless the brand's tone is very casual</li>
  <li>Don't ask for payment updates via Messages — check your Earnings page</li>
  <li>Don't send follow-up messages more than once every 48 hours</li>
</ul>
        `,
        actionItems: [
          "Save the 3 message templates above in a notes app",
          "Send a professional intro message to any brand you've just been accepted by",
          "Set a phone notification to check Messages twice per day",
          "After your next approval, send the relationship-building follow-up message",
        ],
      },
      {
        id: 4,
        title: "Understanding Your Contracts & Usage Rights",
        duration: "8 min",
        videoId: "HqJTVzRz95s",
        videoTitle: "Creator Contracts Explained — Usage Rights, Exclusivity & Payment Terms",
        objectives: [
          "Read and understand your UGC Studio contracts",
          "Know your rights regarding content usage and exclusivity",
          "Identify contract terms that protect or disadvantage you",
        ],
        content: `
<h2>Your Contract Is Your Protection</h2>
<p>Go to <strong>Creator → Contracts</strong>. Every accepted campaign generates a contract between you and the brand. Reading this fully protects you legally and financially.</p>

<h2>Key Contract Sections</h2>

<h3>Deliverables</h3>
<p>Exactly what you agreed to produce. This is your reference point if any dispute arises about scope. If a brand asks for something not listed here, you are entitled to decline or negotiate additional payment.</p>

<h3>Usage Rights</h3>
<p>This defines how the brand can use your content after approval. Common types:</p>
<ul>
  <li><strong>Organic use only:</strong> Brand can post on their social media but not run as paid ads</li>
  <li><strong>Paid ads usage:</strong> Brand can use your content as advertising. This should command a <strong>higher rate</strong> — typically 50–100% more than organic-only</li>
  <li><strong>Exclusivity:</strong> You can't create content for competitor brands for a set period. This should be compensated — standard is 30–90 days maximum</li>
</ul>

<h3>Payment Terms</h3>
<p>When payment is released, to which payout method, and in what currency. Ensure your payout method is set up correctly in Settings before a campaign completes — payment can't be released to an unset account.</p>

<h3>Revision Policy</h3>
<p>How many revision rounds are included (usually 2). After this, additional revisions may incur extra charges — though this is rare in practice for reasonable feedback.</p>

<h2>When to Flag a Contract Issue</h2>
<p>If a contract includes unlimited exclusivity, all-platform usage rights, perpetual licence, or asks you to waive moral rights — these are non-standard. Contact support or flag for review before signing.</p>
        `,
        actionItems: [
          "Open Contracts and read your most recent contract fully",
          "Note the usage rights and exclusivity terms",
          "Confirm your payout method is active before your next campaign completes",
          "For future campaigns, factor usage rights into your rate expectations",
        ],
      },
      {
        id: 5,
        title: "Building Your Creator Rating to 4.8+",
        duration: "7 min",
        videoId: "mY0Ea9oeqlM",
        videoTitle: "How Creator Ratings Work — Getting to 5 Stars on UGC Platforms",
        objectives: [
          "Understand exactly how your platform rating is calculated",
          "Identify the behaviours that raise and lower your rating",
          "Build a systematic approach to achieving 4.8+ rating",
        ],
        content: `
<h2>Your Rating Is Your Most Valuable Asset on UGC Studio</h2>
<p>Your platform_rating is visible to every brand who views your profile. It's the single most influential factor after portfolio quality in a brand's hiring decision. A 4.8+ rating unlocks premium campaigns, higher budgets, and direct brand invites.</p>

<h2>How the Rating Is Calculated</h2>
<p>After each campaign completion, brands are prompted to rate you on:</p>
<ul>
  <li><strong>Content Quality</strong> (40% weight) — did the content meet brief requirements and quality standards?</li>
  <li><strong>Communication</strong> (30% weight) — were you professional, responsive, and clear in Messages?</li>
  <li><strong>Timeliness</strong> (30% weight) — did you submit by or before the agreed deadline?</li>
</ul>
<p>Your overall rating is a weighted average across all completed campaigns.</p>

<h2>Actions That Raise Your Rating</h2>
<ul>
  <li>Delivering content 1–2 days before the deadline</li>
  <li>Responding to messages within 4 hours</li>
  <li>Zero revision requests (first-pass approval)</li>
  <li>Submitting professional notes with every submission</li>
  <li>Proactively flagging if you anticipate a delay</li>
</ul>

<h2>Actions That Lower Your Rating</h2>
<ul>
  <li>Missing deadlines — even by one day</li>
  <li>Slow or no response to brand messages</li>
  <li>Submitting content that doesn't match the brief</li>
  <li>Requiring 3+ revision rounds</li>
  <li>Unprofessional communication</li>
</ul>

<h2>The Compounding Effect</h2>
<p>A 4.8 rating after 5 campaigns is significantly easier to maintain than a 3.5 rating from early mistakes. Start every campaign with full professional effort — your first five campaigns set your baseline permanently.</p>
        `,
        actionItems: [
          "Check your current rating on your creator profile",
          "For every active campaign, confirm your delivery is on or ahead of schedule",
          "Review your last brand message — was your response professional and timely?",
          "Set a goal: 4.8+ rating by your fifth completed campaign",
        ],
      },
    ],
  },

  {
    id: 5,
    title: "Maximising Your Earnings & Growing Your Business",
    description: "Set up payouts, leverage Creator Pro, use the affiliates programme, and scale to consistent income.",
    free: false,
    icon: "💰",
    lessons: [
      {
        id: 1,
        title: "Reading Your Earnings Dashboard",
        duration: "6 min",
        videoId: "mY0Ea9oeqlM",
        videoTitle: "How to Track Your UGC Creator Income — Earnings Dashboard Guide",
        objectives: [
          "Understand every section of your UGC Studio Earnings page",
          "Know the difference between pending, released, and completed payments",
          "Use earnings data to set and track monthly income goals",
        ],
        content: `
<h2>Your Earnings Page — Every Number Explained</h2>
<p>Go to <strong>Creator → Earnings</strong>. This is your live financial dashboard. Every campaign payment flows through here.</p>

<h2>Payment Statuses</h2>
<ul>
  <li><strong>Escrow:</strong> Brand has funded the campaign but hasn't approved your content yet. This money is held securely and released upon approval.</li>
  <li><strong>Released:</strong> Your content was approved and payment has been released from escrow. It will appear in your payout account within 3–7 business days.</li>
  <li><strong>Completed:</strong> Payment has been successfully sent to your payout account (Wise, PayPal, or bank).</li>
  <li><strong>Pending:</strong> Payment is being processed.</li>
</ul>

<h2>Understanding creator_payout_cents</h2>
<p>On the platform, earnings are stored in cents to avoid floating point errors. Divide by 100 to get your payment in euros/dollars. €500 appears as 50000. This is standard across all professional payment systems.</p>

<h2>Setting Monthly Income Targets</h2>
<p>Use your Earnings page as a scoreboard. At the start of each month:</p>
<ol>
  <li>Note your current lifetime total</li>
  <li>Set a monthly target (start modest: €500/month)</li>
  <li>Work backwards: if average campaign pays €150, you need ~4 completed campaigns per month</li>
  <li>Reverse-engineer: 4 completions ÷ 30% acceptance rate = 14 applications needed per month</li>
</ol>
<p>This gives you a specific, data-driven weekly application target.</p>
        `,
        actionItems: [
          "Open Creator → Earnings and understand each payment's status",
          "Calculate your average campaign value from completed payments",
          "Set a monthly earnings target for the next 90 days",
          "Calculate how many applications per week you need to hit that target",
        ],
      },
      {
        id: 2,
        title: "Setting Up Your Payout Method — Wise, PayPal & Bank",
        duration: "8 min",
        videoId: "HqJTVzRz95s",
        videoTitle: "How to Set Up Creator Payouts — Wise vs PayPal vs Bank Transfer",
        objectives: [
          "Set up your preferred payout method in UGC Studio Settings",
          "Understand the fees and timelines for each payout option",
          "Avoid the most common payout setup mistakes that delay payment",
        ],
        content: `
<h2>Set Up Payouts Before You Need Them</h2>
<p>Payment cannot be released to an unset payout account. Creators who haven't set this up before their first campaign approval face payment delays. Set it up now, before it matters.</p>

<h2>Go to Settings → Payout Method</h2>
<p>Navigate to <strong>Creator → Settings → Payout Method</strong>. Choose your preferred method:</p>

<h3>Option 1: Wise (Recommended)</h3>
<p>Wise is the preferred payout method for international creators. Why:</p>
<ul>
  <li>Accepts payments in 40+ currencies without conversion loss</li>
  <li>Low fees (0.5–1.5% vs. PayPal's 2.9%+)</li>
  <li>Creates a local bank account in multiple currencies (receive EUR, GBP, USD all in one account)</li>
  <li>Transfers arrive in 1–2 business days</li>
</ul>
<p>Create a free Wise account at wise.com, then enter your Wise email in Settings.</p>

<h3>Option 2: PayPal</h3>
<p>Fastest to set up — just enter your PayPal email. Higher fees than Wise but works everywhere. Best if you already have PayPal and need simplicity.</p>

<h3>Option 3: Bank Transfer</h3>
<p>Direct to your bank account. Requires: Account Name, Bank Name, Account Number/IBAN, SWIFT/BIC code. Best for EU creators in the SEPA zone (free transfers within EU). Takes 3–5 business days.</p>

<h2>Which Should You Choose?</h2>
<ul>
  <li><strong>Outside EU, earning in multiple currencies:</strong> Wise</li>
  <li><strong>Need it set up in 5 minutes:</strong> PayPal</li>
  <li><strong>EU-based, want zero fees:</strong> Bank Transfer (SEPA)</li>
</ul>

<h2>Currency Note</h2>
<p>UGC Studio processes payments in EUR by default. If your bank account is in GBP or USD, conversion fees may apply. Wise automatically handles this at the best available rate.</p>
        `,
        actionItems: [
          "Go to Settings → Payout Method and complete your setup today",
          "If you don't have Wise, create a free account at wise.com",
          "Verify your payout details are correct by double-checking account number/email",
          "Test with your first small payment to confirm the flow works",
        ],
      },
      {
        id: 3,
        title: "Creator Pro — Is It Worth It?",
        duration: "7 min",
        videoId: "xMTpQH6YF-k",
        videoTitle: "Creator Pro Subscription — Full Breakdown and ROI Analysis",
        objectives: [
          "Compare free vs. Creator Pro features side by side",
          "Calculate the return on investment of upgrading",
          "Know when the right time to upgrade is",
        ],
        content: `
<h2>Free vs. Creator Pro — The Honest Comparison</h2>
<p>Creator Pro costs €19.99/month. Here's what you get and whether it's worth it for you right now.</p>

<h2>Free Tier Limitations</h2>
<ul>
  <li>Limited monthly campaign applications</li>
  <li>Standard position in brand search results</li>
  <li>Basic profile features</li>
</ul>

<h2>Creator Pro Benefits</h2>
<ul>
  <li><strong>Unlimited applications:</strong> No monthly cap. Apply to every relevant campaign.</li>
  <li><strong>Priority ranking:</strong> Your profile appears higher in brand searches. Brands discover you before free-tier creators.</li>
  <li><strong>Pro badge:</strong> Visible on your profile. Signals commitment and professionalism to brands — many brands filter specifically for Pro creators.</li>
  <li><strong>Advanced analytics:</strong> Deeper insights into your profile views, application acceptance rates, and earnings trends.</li>
</ul>

<h2>The ROI Calculation</h2>
<p>Pro costs €19.99/month. If Pro's priority ranking gets you just <strong>one additional campaign per month</strong> that you wouldn't have won otherwise, and that campaign pays €50+, you've already made a profit.</p>
<p>Average campaign value on UGC Studio: €75–€250. Average acceptance rate increase for Pro creators: 15–25% higher than free. Even at the conservative end, Pro pays for itself within the first accepted campaign.</p>

<h2>When to Upgrade</h2>
<p><strong>Upgrade when:</strong> You've completed your profile, have at least 3 portfolio items, and are actively applying to campaigns. Upgrading before you're set up wastes the priority ranking benefit.</p>
<p><strong>Don't upgrade yet if:</strong> Your profile is incomplete, you have no portfolio, or you haven't applied to your first campaign. Build the foundation first.</p>

<h2>How to Upgrade</h2>
<p>Go to <strong>Creator → Settings → Subscription</strong> and click "Upgrade to Creator Pro — €19.99/mo."</p>
        `,
        actionItems: [
          "Calculate how many campaigns per month you'd need to cover €19.99",
          "Review your current profile completion — are you ready to get full value from Pro?",
          "If your profile, portfolio, and socials are complete, upgrade to Creator Pro",
          "After upgrading, immediately increase your weekly application volume",
        ],
      },
      {
        id: 4,
        title: "The Affiliates Programme — Passive Income on UGC Studio",
        duration: "9 min",
        videoId: "MN9jvTUb5ug",
        videoTitle: "How to Make Passive Income as a UGC Creator — Affiliate Strategy",
        objectives: [
          "Generate and share your unique UGC Studio referral link",
          "Understand the commission structure and how payouts work",
          "Build a systematic referral strategy that generates passive income alongside campaign income",
        ],
        content: `
<h2>Earn While You Sleep — The Affiliates Programme</h2>
<p>Go to <strong>Creator → Affiliates</strong>. Your unique referral link is live and ready. Every time someone signs up for a paid plan using your link, you earn a recurring monthly commission — with no extra work.</p>

<h2>Your Referral Link</h2>
<p>Your link is unique to you (generated from your account). Share it anywhere: your social media bio, TikTok videos, YouTube descriptions, DMs to creator friends. When someone clicks and signs up for a paid plan, it's permanently attributed to you.</p>

<h2>Commission Structure</h2>
<ul>
  <li><strong>Creator Pro referral:</strong> €4/month per active subscriber</li>
  <li><strong>Brand Starter referral:</strong> €6/month per active brand</li>
  <li><strong>Brand Pro referral:</strong> €15/month per active brand</li>
</ul>
<p>These are <strong>recurring</strong> commissions — as long as the person you referred stays subscribed, you keep earning. Refer 10 Creator Pro users = €40/month passive income. Refer 5 Brand Pro clients = €75/month.</p>

<h2>Best Places to Share Your Referral Link</h2>
<ol>
  <li><strong>TikTok bio:</strong> "Get paid to create content → [your link]"</li>
  <li><strong>YouTube description:</strong> Add to every UGC-related video you post</li>
  <li><strong>Instagram bio:</strong> Replace generic links with your referral URL</li>
  <li><strong>Creator community groups:</strong> Facebook groups, Discord servers for content creators</li>
  <li><strong>Existing creator friends:</strong> Personal recommendation converts 5–10x better than a cold link</li>
</ol>

<h2>Content Strategy for Affiliates</h2>
<p>Create a 60-second UGC-style video showing your UGC Studio dashboard, your earnings, and how to sign up — then share it on TikTok with your referral link. This is the highest-converting referral approach because you're demonstrating real results, not just promoting a product.</p>
        `,
        actionItems: [
          "Go to Creator → Affiliates and copy your referral link",
          "Add it to your Instagram and TikTok bio today",
          "Send your referral link to 3 creator friends personally",
          "Create a short screen-recording video of your dashboard to share with your audience",
        ],
      },
      {
        id: 5,
        title: "Scaling to €5,000+/Month on UGC Studio",
        duration: "12 min",
        videoId: "MN9jvTUb5ug",
        videoTitle: "Full-Time UGC Creator Income — How to Scale to €5K/Month",
        objectives: [
          "Build a systematic, data-driven approach to scaling your UGC income",
          "Combine campaign income + affiliates for multiple income streams",
          "Set 90-day milestones that compound into serious monthly income",
        ],
        content: `
<h2>The Math Behind €5,000/Month</h2>
<p>€5,000/month from UGC Studio sounds ambitious until you break it down:</p>
<ul>
  <li>25 campaigns × €200 average = €5,000/month</li>
  <li>25 campaigns ÷ 30% acceptance rate = 84 applications/month</li>
  <li>84 applications ÷ 4 weeks = 21 applications/week = 3 per day</li>
</ul>
<p>Three targeted applications per day. That's the daily habit that drives €5K months.</p>

<h2>The 3 Income Streams on UGC Studio</h2>

<h3>Stream 1: Campaign Completions (Primary)</h3>
<p>Your main revenue driver. Systematically apply and deliver. Track your acceptance rate and campaign value monthly. Every completed campaign also builds your rating, which unlocks higher-paying opportunities.</p>

<h3>Stream 2: Affiliates (Passive)</h3>
<p>25 brand referrals at €6/month = €150 passive income. 10 Creator Pro referrals = €40. These compound over time — each month you share your link is another month of passive income added. At scale, affiliates can contribute €200–€500/month without direct effort.</p>

<h3>Stream 3: Creator Pro Rating Premium</h3>
<p>Pro creators with 4.8+ ratings regularly command 2–3x more per campaign than new creators. A creator earning €100/campaign early on earns €200–€300/campaign 6 months later — for the same work — simply because of their track record. This is the compounding effect of building your rating.</p>

<h2>Your 90-Day Growth Plan</h2>
<ul>
  <li><strong>Days 1–30:</strong> Complete profile + portfolio. Apply to 10+ campaigns. Target: €500 first month. Complete 2–3 campaigns.</li>
  <li><strong>Days 31–60:</strong> Upgrade to Creator Pro. Apply to 15 campaigns/week. Target: €1,000–1,500. Build rating to 4.5+.</li>
  <li><strong>Days 61–90:</strong> Launch affiliate sharing strategy. Apply to 20 campaigns/week. Target: €2,000–3,000. Start receiving direct brand invites from your growing rating.</li>
</ul>

<h2>The Mindset Shift</h2>
<p>UGC creation is not a side hustle — it's a scalable content business. Treat it like one: track your metrics weekly, improve your application rate monthly, and reinvest time saved by Creator Pro into more applications. The creators earning €5K+/month on platforms like this treat every campaign as a brick in a building. Each one matters.</p>
        `,
        actionItems: [
          "Calculate your specific monthly application target for your income goal",
          "Set up all three income streams: campaigns, affiliates, and Pro upgrade",
          "Block time in your calendar for daily applications (even 30 minutes/day)",
          "Review your progress against this plan every Sunday — adjust weekly",
          "Set your 90-day income target and work backwards to daily actions",
        ],
      },
    ],
  },
]

export function getModule(moduleId: number): Module | undefined {
  return TRAINING_MODULES.find((m) => m.id === moduleId)
}

export function getLesson(moduleId: number, lessonId: number): Lesson | undefined {
  return getModule(moduleId)?.lessons.find((l) => l.id === lessonId)
}

export function getTotalLessons(): number {
  return TRAINING_MODULES.reduce((sum, m) => sum + m.lessons.length, 0)
}
