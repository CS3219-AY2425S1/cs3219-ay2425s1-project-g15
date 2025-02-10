import Header from "@/components/ui/Header";
import { cn } from "@/lib/utils";

interface ContainerProps {
  withHeader?: boolean; // Lazy way to handle adding of headers to pages that need them
  className?: string;
  children?: React.ReactNode;
}

const Container = ({
  withHeader = true,
  children,
  className,
}: ContainerProps) => {
  return (
    <div className={cn(`m-10`, className)}>
      {withHeader && <Header />}
      {children}
    </div>
  );
};

export default Container;
