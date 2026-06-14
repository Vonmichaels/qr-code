import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  'https://tsxilqqnqzdqfcfswanl.supabase.co',
  'sb_publishable_hEpOnHxSJETBvTQW60Melg_zIsZUbr1'
)

export async function logScan(guest) {
  const familyMembers = guest.familyMembers || []
  const kids = guest.kids || []
  const totalPax = 1 + (familyMembers.length || guest.familyCount || 0) + kids.length

  await supabase.from('scan_logs').insert({
    guest_id: guest.id,
    guest_name: guest.name,
    title: guest.title || null,
    family_members: familyMembers,
    kids: kids,
    total_pax: totalPax,
  })
}
