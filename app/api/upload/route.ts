import { NextResponse } from 'next/server';
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    // Create a new supabase client without the auth header
    const supabase = createSupabaseClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Convert the File object to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = new Uint8Array(arrayBuffer)

    // Upload file to Supabase Storage
    const { data: storageData, error: storageError } = await supabase.storage
      .from('uploads')
      .upload(`${Date.now()}-${file.name}`, fileBuffer, {
        cacheControl: '3600',
        upsert: false
      })

    if (storageError) {
      return NextResponse.json(
        { error: storageError.message },
        { status: 500 }
      )
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('uploads')
      .getPublicUrl(storageData.path)

    // Insert record into todos table
    const { data: todoData, error: todoError } = await supabase
      .from('todos')
      .insert([
        {
          name: file.name,
          url: publicUrl
        }
      ])
      .select()
      .single()

    if (todoError) {
      return NextResponse.json(
        { error: todoError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({ 
      message: 'File uploaded successfully',
      data: todoData
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}