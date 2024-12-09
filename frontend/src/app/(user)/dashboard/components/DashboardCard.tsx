import {
  Card,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import DashboardCardItem from './DashboardCardItem';

interface DashboardCardProps {
  cardTitleLabel: string;
  cardBodyLabels: string[];
  cardFooterLabels: string[];
}

const DashboardCard = ({
  cardTitleLabel,
  cardBodyLabels,
  cardFooterLabels,
}: DashboardCardProps) => {
  return (
    <Card className="bg-primary-900 border-none p-6 w-full drop-shadow">
      <CardHeader className="p-3">
        <CardTitle className="text-xs font-light text-primary-300">
          {cardTitleLabel}
        </CardTitle>
      </CardHeader>
      <div className="flex w-full space-x-10">
        {cardBodyLabels.map((bodyLabel: string, index) => (
          <DashboardCardItem
            key={index}
            cardBodyLabel={bodyLabel}
            cardFooterLabel={cardFooterLabels[index]}
          />
        ))}
      </div>
    </Card>
  );
};

export default DashboardCard;
