import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://shqkvzzwademhglwlgiy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocWt2enp3YWRlbWhnbHdsZ2l5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyNDE1MiwiZXhwIjoyMDg2MjAwMTUyfQ.omXac-qcVj9huh2e9OwV-DW71RfkJaWQTVXvzH14mUw",
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const EMAIL_MAP = {
  "khaby.lame@ugcdemo.studio":         { full_name: "Khaby Lame",       handle: "khaby.lame" },
  "charli.damelio@ugcdemo.studio":     { full_name: "Charli D'Amelio",  handle: "charlidamelio" },
  "addison.rae@ugcdemo.studio":        { full_name: "Addison Rae",      handle: "addisonraee" },
  "wisdom.kaye@ugcdemo.studio":        { full_name: "Wisdom Kaye",      handle: "wisdomkaye" },
  "jay.shetty@ugcdemo.studio":         { full_name: "Jay Shetty",       handle: "jayshetty" },
  "nikkie.tutorials@ugcdemo.studio":   { full_name: "Nikkie de Jager",  handle: "nikkietutorials" },
  "bretman.rock@ugcdemo.studio":       { full_name: "Bretman Rock",     handle: "bretmanrock" },
  "zach.king@ugcdemo.studio":          { full_name: "Zach King",        handle: "zachking" },
  "emma.chamberlain@ugcdemo.studio":   { full_name: "Emma Chamberlain", handle: "emmachamberlain" },
  "nas.daily@ugcdemo.studio":          { full_name: "Nuseir Yassin",    handle: "nasdaily" },
  "pokimane@ugcdemo.studio":           { full_name: "Imane Anys",       handle: "pokimanelol" },
  "lilly.singh@ugcdemo.studio":        { full_name: "Lilly Singh",      handle: "iisuperwomanii" },
  "bhuvan.bam@ugcdemo.studio":         { full_name: "Bhuvan Bam",       handle: "bhuvan.bam22" },
  "mikayla.nogueira@ugcdemo.studio":   { full_name: "Mikayla Nogueira", handle: "mikaylanogueira" },
  "mkbhd@ugcdemo.studio":              { full_name: "Marques Brownlee", handle: "mkbhd" },
}

const { data: users } = await supabase.auth.admin.listUsers({ perPage: 100 })

for (const user of users.users) {
  const c = EMAIL_MAP[user.email]
  if (!c) continue

  const avatarUrl = `https://unavatar.io/instagram/${c.handle}`

  const { error } = await supabase
    .from("profiles")
    .update({
      role: "user",
      full_name: c.full_name,
      avatar_url: avatarUrl,
      photo_url: avatarUrl,
    })
    .eq("id", user.id)

  if (error) {
    console.log(`✗ ${c.full_name}: ${error.message}`)
  } else {
    console.log(`✓ ${c.full_name}`)
  }
}

console.log("\nDone!")
