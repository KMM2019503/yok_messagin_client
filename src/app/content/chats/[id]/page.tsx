type ChatsProps = {
  params: {
    id: string;
  };
};

export default function Chats({ params }: ChatsProps) {
  const { id } = params;
  return <div>Welcome, {id}!</div>;
}
