import { FormattedWalletBalance } from "./types";

interface WalletListProps extends BoxProps {
  balances: FormattedWalletBalance[];
}

const WalletList: React.FC<WalletListProps> = (props: WalletListProps) => {
  const { balances, ...rest } = props;
  return (
    <div {...rest}>
      {balances.map((balance) => (
        <WalletRow
          className={classes.row}
          key={`${balance.blockchain}_${balance.currency}`}
          amount={balance.amount}
          usdValue={balance.usdValue}
          formattedAmount={balance.formatted}
        />
      ))}
    </div>
  );
};
