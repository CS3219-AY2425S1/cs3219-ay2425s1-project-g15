import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface DashboardCardProps {
  cardTitleLabel: string;
  cardBodyLabel: string;
  cardFooterLabel: string;
}

const DashboardCard = ({
  cardTitleLabel,
  cardBodyLabel,
  cardFooterLabel,
}: DashboardCardProps) => {
  return (
    <Card className="bg-primary-900 border-none p-6 pr-20 w-full drop-shadow">
      <CardHeader className="p-0">
        <CardTitle className="text-xs font-light text-primary-300">
          {cardTitleLabel}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <p className="font-bold text-h2 text-white">{cardBodyLabel}</p>
      </CardContent>
      <CardFooter className="text-xs font-light text-primary-300 p-0">
        {cardFooterLabel}
      </CardFooter>
    </Card>
  );
};

export default DashboardCard;
