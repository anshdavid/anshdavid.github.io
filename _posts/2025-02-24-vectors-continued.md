---
layout: post
title: "Random Vectors Continued..."
subtitle: "Sum, Cov{variance, rrelation} and Limit Theorm"
date: 2025-02-24 12:45:00 +0530
tags: 
    - data-science
    - random-vector
    - covariance
    - correlation
    - limit-theorm
---

Modern probability and statistics often focus on scenarios where we aggregate multiple random variables, measure how these variables co-vary, and then draw conclusions about their long-run behavior. In this short post, we’ll introduce three key ideas:

1. **Summation of Random Variables**  
2. **Covariance and Correlation**  
3. **Limit Theorems**

These concepts lie at the heart of statistical modeling and help explain why averages and aggregated statistics become so powerful in real-world applications.

* * *

# 1. Sums of Random Variables

## 1.1 Motivation
We frequently encounter sums of random variables in practical contexts—like the total number of defective parts in a factory batch (summing individual defect indicators), or the portfolio return from several stocks (summing daily returns). Understanding the distribution of these sums is crucial for risk analysis, planning, and decision-making.

## 1.2 Basic Ideas

- **Discrete Convolution**: If \\( X \\) and \\( Y \\) are discrete random variables (and particularly if they’re independent), the distribution of \\( Z = X + Y \\) is given by convolving their respective probability mass functions (PMFs):

\\[
p_Z(z) \;=\; \sum_{x} p_X(x)\, p_Y(z - x).
\\]

- **Continuous Convolution**: In the continuous case (with independent \\( X \\) and \\( Y \\)), we integrate their probability density functions (PDFs):

\\[
f_Z(z) \;=\; \int_{-\infty}^{\infty} f_X(x)\, f_Y(z - x) \, dx.
\\]

## 1.3 Illustrative Examples

- **Binomial + Binomial**: If you sum two binomially distributed random variables (same \\( p \\), different \\( n \\)), you get another binomial with combined \\( n \\).  
- **Normal + Normal**: If you sum two independent normal variables, the result is also normal, with its mean and variance being the sum of the individual means and variances.

---

# 2. Covariance and Correlation

## 2.1 Covariance
When working with multiple variables, understanding their co-movement is essential. **Covariance** between \\( X \\) and \\( Y \\) is defined as

\\[
\mathrm{Cov}(X, Y) 
\;=\; E\bigl[(X - E[X]) (Y - E[Y])\bigr] 
\;=\; E[XY] - E[X]\,E[Y].
\\]

- If \\(\mathrm{Cov}(X, Y) > 0\\), \\( X \\) and \\( Y \\) tend to move together (when \\( X \\) is above its mean, \\( Y \\) is often above its mean too).  
- If \\(\mathrm{Cov}(X, Y) < 0\\), they typically move in opposite directions.  
- If \\(\mathrm{Cov}(X, Y) = 0\\), there’s no linear association (though non-linear dependencies can still exist).

## 2.2 Correlation
Covariance alone is influenced by the scale of \\( X \\) and \\( Y \\). **Correlation** standardizes this measure to a range \\([-1,1]\\):

\\[
\rho_{X,Y} \;=\; \frac{\mathrm{Cov}(X,Y)}{\sqrt{\mathrm{Var}(X)\,\mathrm{Var}(Y)}}.
\\]

- \\(\rho = 1\\): Perfect positive linear relation.  
- \\(\rho = -1\\): Perfect negative linear relation.  
- \\(\rho = 0\\): No linear relation.

Correlation is widely used in fields like finance, where portfolio managers examine correlations among different assets to manage risk, or in data science to quickly check for linear relationships among features.

---

# 3. Limit Theorems

## 3.1 Law of Large Numbers (LLN)
Suppose \\( X_1, X_2, \dots \\) are i.i.d. (independent and identically distributed) with mean \\(\mu\\). The **Law of Large Numbers** says that as \\( n \to \infty \\),

\\[
\frac{1}{n}\sum_{i=1}^n X_i \;\to\; \mu
\\]

in probability (Weak LLN) or almost surely (Strong LLN). This underpins why sample averages converge to the true mean with enough data.

## 3.2 Central Limit Theorem (CLT)
Arguably the most famous theorem in probability, the **Central Limit Theorem** states that if \\( X_1, X_2, \dots \\) are i.i.d. with finite mean \\(\mu\\) and variance \\(\sigma^2\\), then the distribution of their normalized sum approaches a **normal distribution**:

\\[
\frac{\sum_{i=1}^n X_i - n\mu}{\sigma\sqrt{n}}
\;\xrightarrow{d}\;
\mathcal{N}(0,1),
\\]

as \\( n \\) grows large. This explains why sums or averages of many independent random variables often exhibit roughly normal behavior, even if the original variables are not normally distributed.

## 3.3 Practical Significance

- **Confidence Intervals**: Statistical inference relies on CLT-based approximations for constructing intervals or hypothesis tests about means.  
- **Sampling**: The LLN assures us that observed averages converge to true averages (e.g., an A/B test’s sample mean click-through rate converging to the true rate).  
- **Robustness**: In many real-life settings, even mild deviations from assumptions (like independence or identical distributions) often still yield “good enough” normal approximations for large \\( n \\).

* * *

**Sums of random variables** let us investigate aggregate quantities—vital in risk analysis, manufacturing control, and finance—while **covariance and correlation** quantify how two (or more) variables move together. Over many replications or large samples, **limit theorems** (LLN and CLT) assure that the sums and averages of these variables follow predictable patterns, justifying much of modern data analysis and statistical inference.

Together, these topics illuminate why and how simple aggregate statistics—like a sum or average—can capture the essence of complex random processes, and how measuring co-variation and understanding long-run behavior form the bedrock of many scientific, business, and engineering decisions.

> Check out my full article on [Medium](https://medium.com/@ansh1990/)
