import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import FileUpload from '@/components/FileUpload'
import FileList from '@/components/FileList'

export default async function Page() {
  const cookieStore = cookies()
  const supabase = await createClient(cookieStore)
  
  const { data: todos } = await supabase
    .from('todos')
    .select('id, created_at, name, url')
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen p-8">
      <main className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">File Upload System</h1>
        <FileUpload />
        <FileList todos={todos || []} />
      </main>
    </div>
  )
}