import { useEffect, useState, type ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import useMediaQuery from "~/hooks";
import { formatCurrency } from "~/lib/utils";
import { getPrices } from "~/services/currencyService";
import type { TokenPrice } from "~/types/token";

interface SelectCurrencyDialogProps {
  children: ReactNode;
  onChangeValue?: (value: TokenPrice) => void;
}

interface SelectCurrencyContentProps {
  data: TokenPrice[];
  onChangeValue?: (value: TokenPrice) => void;
}

function SelectCurrencyContent({
  data,
  onChangeValue,
}: SelectCurrencyContentProps) {
  return (
    <div className="max-h-[76vh] relative overflow-auto md:-mx-6">
      {data.map((item) => (
        <div
          onClick={() => onChangeValue?.(item)}
          className="flex cursor-pointer  px-4 md:px-6  hover:bg-foreground/10 items-center py-2 gap-4"
          key={item.currency}
        >
          <div>
            <img className="h-9" src={`./tokens/${item.currency}.svg`} />
          </div>
          <div>
            {item.currency}
            <div className="text-sm text-foreground/70">
              ${formatCurrency(item.price, 2)}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export function SelectCurrencyDialog(props: SelectCurrencyDialogProps) {
  const { children, onChangeValue } = props;

  const [tokenPriceList, setTokenPriceList] = useState<TokenPrice[]>([]);
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleValueChange = (value: TokenPrice) => {
    onChangeValue?.(value);
    setOpen(false);
  };

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await getPrices();
        setTokenPriceList(response.data);
      } catch (err) {
        console.error("Error fetching token prices:", err);
      }
    };

    fetchPrices();
  }, []);

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Select a token</DialogTitle>
          </DialogHeader>
          <SelectCurrencyContent
            data={tokenPriceList}
            onChangeValue={handleValueChange}
          />
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Select a token</DrawerTitle>
        </DrawerHeader>
        <SelectCurrencyContent
          data={tokenPriceList}
          onChangeValue={handleValueChange}
        />
      </DrawerContent>
    </Drawer>
  );
}
