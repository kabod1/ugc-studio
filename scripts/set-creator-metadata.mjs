import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
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
