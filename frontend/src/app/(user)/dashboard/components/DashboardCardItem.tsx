import React from 'react';
import { Card, CardContent, CardFooter } from "@/components/ui/card";

interface DashboardCardItemProps {
  cardBodyLabel: string;
  cardFooterLabel: string;
}

const DashboardCardItem: React.FC<DashboardCardItemProps> = ({ cardBodyLabel, cardFooterLabel }) => {
  return (
    <Card className="bg-primary-900 border-none p-3 w-full">
      <CardContent className="p-0 flex items-center justify-center">
        <p className="font-bold text-h2 text-white">{cardBodyLabel}</p>
      </CardContent>
      <CardFooter className="text-xs font-light text-primary-300 p-0 justify-center">
        {cardFooterLabel}
      </CardFooter>
    </Card>
  );
};

export default DashboardCardItem;