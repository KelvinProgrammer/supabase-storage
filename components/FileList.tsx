'use client'

import { Download } from 'lucide-react'

type Todo = {
  id: number
  created_at: string
  name: string
  url: string
}

export default function FileList({ todos }: { todos: Todo[] }) {
  return (
    <div className="mt-12">
      <h2 className="text-xl font-semibold mb-4">Uploaded Files</h2>
      <div className="bg-white rounded-lg shadow">
        {todos?.length === 0 ? (
          <p className="p-4 text-gray-500 text-center">No files uploaded yet</p>
        ) : (
          <ul className="divide-y divide-gray-200">
            {todos?.map((todo: Todo) => (
              <li key={todo.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded">
                      <Download className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{todo.name}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(todo.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <a
                      href={`/api/download?path=${encodeURIComponent(todo.url.split('uploads/')[1])}`}
                      className="px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 rounded-md hover:bg-blue-50 transition-colors"
                    >
                      Download
                    </a>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}