## Computational Inefficiencies and Anti-patterns

1. **Redundant Property Definitions**: `currency` and `amount` are redefined in `FormattedWalletBalance`. `FormattedWalletBalance` should extend `WalletBalance` instead.

2. **Unclear Interface Name**: Rename `Props` to `WalletPageProps` for clarity.

3. **Undefined `lhsPriority`**: `lhsPriority` is used in the filter but is not defined.

4. **Use of `any` for `blockchain`**: The `blockchain` parameter in `getPriority` should be typed as `string` instead of `any`.

5. **Unused `prices` in `useMemo`**: `prices` is a dependency in `useMemo` but is not used, causing unnecessary re-renders.

6. **Redundant `getPriority` Calls**: `getPriority` is called multiple times for the same blockchain, which is inefficient.

7. **Uninitialized Properties**: `blockchain` properties are not initialized in the interface.

8. The `filter` checks `balance.amount <= 0` but returns true, which seems counterintuitive. `balance.amount > 0` seems more correct.

9. **Inefficient Nested `if` Conditions**: The condition `if (lhsPriority > -99)` and `if (balance.amount <= 0)` could be combined into a single `if` statement.

10. **Unused `children`, `balancePriority` & `formattedBalances`**: The `children`, `balancePriority` & `formattedBalances` variable is declared but never used.

11. **Multiple `map` Calls**: `sortedBalances.map` is used twice, leading to inefficiency. `sortedBalances` in the second instance seems like it should actually be `formattedBalances`.

12. **Inefficient Filtering and Sorting and Mapping**: `filter`, `sort`, and `map` operations on `balances` are handled separately. These could be combined into a single operation for better performance.

13. **Potential Errors with `prices[balance.currency]`**: There is a risk of errors if `balance.currency` is undefined. This should be handled properly.

14. **balance.amount.toFixed()** is used without specifying the required decimal places

15. **`usdValue` and `formatted` Should Be Processed Together**: `usdValue` and `formatted` values should be handled together, not separately.

16. **Using `index` as `key`**: Avoid using `index` as a `key` for rendering list items. It can cause rendering issues when the list changes.

17. **Missing Memoization for `rows`**: Memoize `rows` to prevent unnecessary recalculations on each render.

18. **Overuse of Inline Logic in JSX**: Move logic for `rows` out of JSX for better readability and maintainability.

## Refactoring Points

1. Extract the `WalletBalance` and `FormattedWalletBalance` interfaces into their own separate files, used specifically for the component types. Make `FormattedWalletBalance` extend from `WalletBalance`, and add missing properties such as `blockchain`, `currency`, `usdValue`, etc.

2. Merge the filter, sort, and map operations into a single function to streamline the code. Add a `priority` attribute to avoid multiple calls to the `getPriority` function.

3. Use `PRIORITY_MAP` as a constant instead of a switch-case statement in the `getPriority` function. This improves maintainability and reduces repetitive code.

4. Replace the `rows` implementation with a new `WalletList` component to better organize the code and improve readability.