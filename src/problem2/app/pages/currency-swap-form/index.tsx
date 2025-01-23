import { useState, useEffect } from "react";
import { Button } from "~/components/ui/button";
import { ChevronDown, ArrowDownUp } from "lucide-react";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { SelectCurrencyDialog } from "./select-currency-dialog";
import type { TokenPrice, UserAsset } from "~/types/token";
import { getUserAssets } from "~/services/userService";
import { formatCurrency } from "~/lib/utils";
import { toast } from "sonner";

const formSchema = z.object({
  from: z.string().min(1, `Please input value`),
  to: z.string().min(1, `Please input value`),
});

const CurrencySwapForm = () => {
  const [userAssets, setUserAssets] = useState<Record<string, UserAsset>>({});
  const [fromToken, setFromToken] = useState<TokenPrice>();
  const [toToken, setToToken] = useState<TokenPrice>();
  const [balance, setBalance] = useState(0);
  const [usdValue, setUsdValue] = useState(0);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { from: "", to: "" },
  });

  useEffect(() => {
    const fetchUserAssets = async () => {
      try {
        const response = await getUserAssets();
       
        if (response.data?.length) {
          const assets: Record<string, UserAsset> = {};
          response.data.forEach((item) => {
            assets[item.currency] = item;
          });
          setUserAssets(assets);
        }
      } catch (err) {
        console.error("Error fetching user assets:", err);
      }
    };

    fetchUserAssets();
  }, []);

  useEffect(() => {
    if (!fromToken) return;

    const fromBalance = userAssets[fromToken.currency]?.amount || 0;
    form.reset();
    setUsdValue(0);
    setBalance(fromBalance);
  }, [fromToken]);

  useEffect(() => {
    if (usdValue && toToken) {
      const toValue = formatCurrency(usdValue / toToken.price);
      updateToValue(`${toValue}`)
    }
  }, [toToken]);

  const handleSwap = (values: z.infer<typeof formSchema>) => {
    toast("Swap successful.")
  };

  const handleReverse = () => {
    setFromToken(toToken);
    setToToken(fromToken);
    form.reset();
  };

  const handleFromChangeValue = (value: string) => {
    let newUsdValue = 0;

    if (fromToken && value) {
      const fromValue = parseFloat(value);
      newUsdValue = formatCurrency(fromToken.price * fromValue, 2);
    }

    setUsdValue(newUsdValue);

    if (toToken) {
      const toValue = formatCurrency(newUsdValue / toToken.price);
      updateToValue(`${toValue}`);
    }

    updateFromValue(value);
  };

  const handleToChangeValue = (value: string) => {
    let newUsdValue = 0;

    if (toToken && value) {
      let toValue = parseFloat(value);
      newUsdValue = formatCurrency(toToken.price * toValue, 2);
    }

    setUsdValue(newUsdValue);

    if (fromToken) {
      const fromValue = formatCurrency(newUsdValue / fromToken.price);
      updateFromValue(`${fromValue}`);
    }

    updateToValue(value);
  };

  const updateFromValue = (value: string) => {
    let fromValue = 0;

    if (value) {
      fromValue = formatCurrency(parseFloat(value));
    }

    if (fromValue > balance && fromToken) {
      form.setError("from", {
        message: "Insufficient funds",
      });
    } else {
      form.clearErrors("from");
    }

    form.setValue("from", value);
  };

  const updateToValue = (value: string) => {
    form.setValue("to", value);
    form.trigger("to");
  };

  return (
    <div className="currency-swap-form max-w-[460px] space-y-4 mx-auto">
      <h2 className="text-xl">Currency Swap</h2>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSwap)}
          className="space-y-4 relative"
        >
          <div className="border rounded-2xl p-4 flex">
            <FormField
              control={form.control}
              name="from"
              render={({ field }) => (
                <FormItem>
                  <div className="flex items-center gap-x-2">
                    <FormLabel className="flex-1">From</FormLabel>{" "}
                    <div className="text-sm text-right">Balance: {balance}</div>
                  </div>
                  <FormControl>
                    <div className="flex gap-x-2">
                      <Input
                        type="number"
                        className="appearance-none text-2xl md:text-3xl p-0 border-0 focus-visible:ring-0"
                        placeholder="0"
                        {...field}
                        onChange={(value) => {
                          const fromValue = value.target.value;
                          handleFromChangeValue(fromValue);
                        }}
                      />
                      <div className="text-right flex">
                        <SelectCurrencyDialog
                          onChangeValue={(value) => {
                            setFromToken(value);
                          }}
                        >
                          <Button
                            type="button"
                            className="rounded-full px-1 py-0 h-8 mt-1 mr-0.5"
                            size="sm"
                            variant="outline"
                          >
                            {fromToken ? (
                              <label className="flex mr-5 items-center gap-x-2">
                                <img
                                  src={`./tokens/${fromToken.currency}.svg`}
                                />
                                <label> {fromToken.currency}</label>
                              </label>
                            ) : (
                              <label className="ml-2">Select token</label>
                            )}
                            <ChevronDown className="h-4 w-4 mr-0.5" />
                          </Button>
                        </SelectCurrencyDialog>
                      </div>
                    </div>
                  </FormControl>
                  <div className="flex gap-x-2">
                    <FormDescription>
                      ${fromToken ? usdValue : 0}
                    </FormDescription>
                    <FormMessage className="flex-1 text-right" />{" "}
                  </div>
                </FormItem>
              )}
            />
          </div>
          <div className="text-center absolute min-w-full translate-y-[-20px]">
            <Button
              onClick={handleReverse}
              type="button"
              className="rounded-full text-lg -mt-2 [&_svg]:size-5"
              size="icon"
            >
              <ArrowDownUp />
            </Button>
          </div>
          <div className="border rounded-2xl p-4 flex gap-x-2">
            <FormField
              control={form.control}
              name="to"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>To</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      className="appearance-none text-2xl md:text-3xl p-0 border-0 focus-visible:ring-0"
                      placeholder="0"
                      {...field}
                      onChange={(value) => {
                        const toValue = value.target.value;
                        handleToChangeValue(toValue);
                      }}
                    />
                  </FormControl>
                  <FormDescription>${toToken ? usdValue : 0}</FormDescription>
                </FormItem>
              )}
            />
            <div className="text-right mt-1">
              <label className="text-sm block">&nbsp;</label>
              <SelectCurrencyDialog
                onChangeValue={(value) => {
                  setToToken(value);
                }}
              >
                <Button
                  type="button"
                  className="rounded-full px-1 py-0 h-8 mt-3 mr-0.5"
                  size="sm"
                  variant="outline"
                >
                  {toToken ? (
                    <label className="flex mr-5 items-center gap-x-2">
                      <img src={`./tokens/${toToken.currency}.svg`} />{" "}
                      {toToken.currency}
                    </label>
                  ) : (
                    <label className="ml-2">Select token</label>
                  )}
                  <ChevronDown className="h-4 w-4 mr-0.5" />
                </Button>
              </SelectCurrencyDialog>
            </div>
          </div>
          <Button
            disabled={
              !form.formState.isValid ||
              !toToken ||
              !fromToken ||
              !!Object.keys(form.formState.errors).length
            }
            type="submit"
            size="lg"
            className="w-full uppercase h-12 rounded-2xl text-xl"
          >
            Swap
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default CurrencySwapForm;
