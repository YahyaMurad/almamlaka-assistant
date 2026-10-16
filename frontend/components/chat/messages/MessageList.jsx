import UserMessage from "./UserMessage";
import BotMessage from "./BotMessage";
import TypingIndicator from "./TypingIndicator";

export default function MessageList({ messages, typing }) {
  return (
    <div className="flex flex-col gap-6.5">
      {messages.map((message, index) =>
        message.role === "user" ? (
          <UserMessage key={index} text={message.text} />
        ) : (
          <BotMessage key={index} text={message.text} sources={message.sources} />
        )
      )}
      {typing && <TypingIndicator />}
    </div>
  );
}
