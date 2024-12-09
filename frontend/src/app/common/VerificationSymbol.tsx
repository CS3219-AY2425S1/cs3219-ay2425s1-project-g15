import { GoVerified, GoUnverified } from "react-icons/go";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const VerificationSymbol = ({ isVerified }: { isVerified: boolean }) => {
  return <TooltipProvider delayDuration={0}>
    <Tooltip>
      <TooltipTrigger>{
        isVerified ? (
          <GoVerified className="text-green" />
        ) : <GoUnverified className="text-red" />
      }</TooltipTrigger>
      <TooltipContent>
        {isVerified ? "Verified" : "Unverified"}
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
}

export default VerificationSymbol;