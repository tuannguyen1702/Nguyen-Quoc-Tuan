

/* Three unique implementations of a function to calculate the summation of integer (n) */

// The best way - Using the sum formula in mathematics
var sum_to_n_a = function(n) {
    if (n <= 0) return 0; // Handle non-positive input
    
    return (n * (n + 1)) / 2;
};

// The most common way - Using a for loop
var sum_to_n_b = function(n) {
    if (n <= 0) return 0; // Handle non-positive input

    let sum = 0;
    for (let i = 1; i <= n; i++) {
        sum += i;
    }

    return sum;
};

// Using recursion
var sum_to_n_c = function(n) {
    if (n <= 0) return 0; // Handle non-positive input

    return n + sum_to_n_c(n - 1);
};