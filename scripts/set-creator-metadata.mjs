import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  "https://shqkvzzwademhglwlgiy.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNocWt2enp3YWRlbWhnbHdsZ2l5Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDYyNDE1MiwiZXhwIjoyMDg2MjAwMTUyfQ.omXac-qcVj9huh2e9OwV-DW71RfkJaWQTVXvzH14mUw",
  { auth: { autoRefreshToken: false, persistSession: false } }
)

const DEMO_EMAILS = [
  "khaby.lame@ugcdemo.studio",
  "charli.damelio@ugcdemo.studio",
  "addison.rae@ugcdemo.studio",
  "wisdom.kaye@ugcdemo.studio",
  "jay.shetty@ugcdemo.studio",
  "nikkie.tutorials@ugcdemo.studio",
  "bretman.rock@ugcdemo.studio",
  "zach.king@ugcdemo.studio",
  "emma.chamberlain@ugcdemo.studio",
  "nas.daily@ugcdemo.studio",
  "pokimane@ugcdemo.studio",
  "lilly.singh@ugcdemo.studio",
  "bhuvan.bam@ugcdemo.studio",
  "mikayla.nogueira@ugcdemo.studio",
  "mkbhd@ugcdemo.studio",
]

const { data: users } = await supabase.auth.admin.listUsers({ perPage: 100 })

for (const user of users.users) {
  if (!DEMO_EMAILS.includes(user.email)) continue

  const { error } = await supabase.auth.admin.updateUserById(user.id, {
    user_metadata: {
      ...user.user_metadata,
      role: "creator",
    },
  })

  if (error) {
    console.log(`✗ ${user.email}: ${error.message}`)
  } else {
    console.log(`✓ ${user.user_metadata?.full_name || user.email} — role=creator set in metadata`)
  }
}

console.log("\nDone!")
