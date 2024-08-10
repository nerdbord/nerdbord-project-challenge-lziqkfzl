import Link from "next/link";

type RedirectButtonProps = {
  href: string;
  children: React.ReactNode;
};

export const RedirectButton: React.FC<RedirectButtonProps> = ({
  href,
  children,
}) => {
  return (
    <Link href={href}>
      <button className="btn btn-primary">{children}</button>
    </Link>
  );
};
