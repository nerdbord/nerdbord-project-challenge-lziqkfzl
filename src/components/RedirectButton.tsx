import Link from "next/link";

type RedirectButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
};

export const RedirectButton: React.FC<RedirectButtonProps> = ({
  href,
  children,
  className,
}) => {
  return (
    <Link href={href}>
      <button className={className}>{children}</button>
    </Link>
  );
};
