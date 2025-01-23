import { Search } from "lucide-react";
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
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Input } from "~/components/ui/input";
import useMediaQuery from "~/hooks";
import { formatCurrency } from "~/lib/utils";
import { getPrices } from "~/services/currencyService";
import type { TokenPrice } from "~/types/token";

interface SelectCurrencyDialogProps {
  children: ReactNode;
  onChangeValue?: (value: TokenPrice) => void;
  value?: TokenPrice;
}

interface SelectCurrencyContentProps {
  data: TokenPrice[];
  value?: TokenPrice;
  onChangeValue?: (value: TokenPrice) => void;
}

function SelectCurrencyContent({
  data,
  onChangeValue,
  value
}: SelectCurrencyContentProps) {

  const [dataView, setDataView] = useState(data);

  const handleSearch = (value: string) => {
    const textSearch = value.toLocaleLowerCase();
    const newDataView = data.filter(item => item.currency.toLowerCase().includes(textSearch));
    setDataView(newDataView);
  }

  return (
    <div>
      <div className="mb-4 relative px-4 md:px-0"><Search className="absolute mt-2 ml-2 p-0.5" /><Input onChange={(value) => handleSearch(value.target.value)} className="pl-10 rounded-xl focus-visible:ring-1 focus-visible:ring-ring" /></div>
      <div className="h-[76vh] relative overflow-auto md:-mx-6">
        {dataView.map((item) => (
          <div
            onClick={() => {
              if(item.currency !== value?.currency) onChangeValue?.(item)
            }}
            data-active={value?.currency === item.currency}
            className="flex cursor-pointer data-[active=true]:bg-foreground/5 data-[active=true]:cursor-default px-4 md:px-6  hover:bg-foreground/10 items-center py-2 gap-4"
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
    </div>
  );
}

export function SelectCurrencyDialog(props: SelectCurrencyDialogProps) {
  const { children, onChangeValue, value } = props;

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
            value={value}
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
          value={value}
        />
      </DrawerContent>
    </Drawer>
  );
}
