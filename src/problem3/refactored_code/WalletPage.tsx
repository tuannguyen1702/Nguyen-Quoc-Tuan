import { PRIORITY_MAP } from "./consts";
import { FormattedWalletBalance, WalletBalance } from "./types";

interface WalletPageProps extends BoxProps {}

const WalletPage: React.FC<WalletPageProps> = (props: WalletPageProps) => {
  const balances = useWalletBalances();
  const prices = usePrices();

  const formattedBalances = useMemo(() => {
    const updatedBalances: FormattedWalletBalance[] = [];

    balances.forEach((balance) => {
      const priority = PRIORITY_MAP[balance.blockchain.toLowerCase()] || -99;

      if (priority > -99 && balance.amount > 0) {
        updatedBalances.push({
          ...balance,
          formatted: balance.amount.toFixed(2),
          usdValue: (prices[balance.currency] || 0) * balance.amount,
          priority,
        });
      }
    });

    return updatedBalances.sort((lhs, rhs) => rhs.priority - lhs.priority);
  }, [balances, prices]);

  return <WalletList balances={formattedBalances} />;
};
