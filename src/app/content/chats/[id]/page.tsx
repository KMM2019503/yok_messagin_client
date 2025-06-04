import ChatLoading from "@/components/chats/ChatLoading"
import ChatMessages from "@/components/chats/ChatMessages"
import { cookies } from "next/headers"
import { Suspense } from "react"

type ChatsProps = {
  params: {
    id: string
  }
}

async function fetchMessages(id: string) {
  const cookieStore = cookies()

  const generateUrl = (cursorId?: string) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/conversations/get-messages/${id}?take=15`
    return cursorId ? `${baseUrl}&cursorId=${cursorId}` : baseUrl
  }

  const res = await fetch(generateUrl(), {
    method: "GET",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieStore.toString(),
    },
  })

  if (!res.ok) {
    const errText = await res.text()
    console.error("Fetch failed:", errText)
    throw new Error(`Failed to fetch messages: ${errText}`)
  }

  return res.json()
}

async function ChatContent({ id }: { id: string }) {
  const cookieStore = cookies()
  try {
    const data = await fetchMessages(id)
    const messages = data.messages || []

    return <ChatMessages
          initialMessages={messages}
          conversationId={id}
          hasMore={messages.length === 15}
          cookieString={cookieStore.toString()}
          baseUrl={process.env.NEXT_PUBLIC_BASE_URL || ""}
        />
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 mb-2">Failed to load messages</p>
          <p className="text-sm text-gray-500">Please try refreshing the page</p>
        </div>
      </div>
    )
  }
}

export default async function Chats({ params }: ChatsProps) {
  const { id } = params

  return (
    <div className="flex flex-col w-[40%] h-[calc(100vh-16px)] bg-primaryLight-100 dark:bg-primaryLight2-700 rounded-lg">
      {/* <div className="bg-white border-b border-gray-200 p-4">
        <h1 className="text-lg font-semibold text-gray-900">Conversation {id}</h1>
      </div> */}

      <div className="flex-1 overflow-hidden">
        <Suspense fallback={<ChatLoading />}>
          <ChatContent id={id} />
        </Suspense>
      </div>
    </div>
  )
}
