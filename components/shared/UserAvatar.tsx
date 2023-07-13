import * as Avatar from "@radix-ui/react-avatar";

interface UserAvatarProps {
  userName: string;
  src: string;
  className: string;
}

export default function UserAvatar(props: UserAvatarProps) {
  const { userName, src, className } = props;
  return (
    <Avatar.Root className={`AvatarRoot ${className}`}>
      <Avatar.Image className="AvatarImage" src={src} alt={userName} />
      <Avatar.Fallback className="AvatarFallback" delayMs={600}>
        {userName[0]}
      </Avatar.Fallback>
    </Avatar.Root>
  );
}
