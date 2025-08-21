---
title: "Random Vectors Continued..."
subtitle: "Sum, Covariance, Correlation and Limit Theorem"
author: Ansh David
pubDatetime: 2025-02-24T07:15:00Z
slug: random-vectors-continued
featured: false
draft: false
tags:
  - data-science
  - random-vector
  - covariance
  - correlation
  - limit-theorem
description: >
  Exploring sums of random variables, covariance, correlation, and limit theorems (LLN & CLT). Key tools in probability and statistics to understand aggregate behavior, co-movement, and long-run patterns of random variables.
canonicalURL: https://medium.com/@ansh1990/
---

Modern probability and statistics often focus on scenarios where we aggregate multiple random variables, measure how these variables co-vary, and then draw conclusions about their long-run behavior. In this short post, we’ll introduce three key ideas:

1. **Summation of Random Variables**
2. **Covariance and Correlation**
3. **Limit Theorems**

These concepts lie at the heart of statistical modeling and help explain why averages and aggregated statistics become so powerful in real-world applications.

---

## 1. Sums of Random Variables

### 1.1 Motivation

We frequently encounter sums of random variables in practical contexts—like the total number of defective parts in a factory batch (summing individual defect indicators), or the portfolio return from several stocks (summing daily returns). Understanding the distribution of these sums is crucial for risk analysis, planning, and decision-making.

### 1.2 Basic Ideas

- **Discrete Convolution**: If $\footnotesize \mathbf{X}$ and $\footnotesize \mathbf{Y}$ are discrete random variables (and particularly if they’re independent), the distribution of $\footnotesize \mathbf{Z = X + Y}$ is given by convolving their respective probability mass functions (PMFs):

$$
p_Z(z) = \sum_{x} p_X(x)\, p_Y(z - x).
$$

- **Continuous Convolution**: In the continuous case (with independent $\footnotesize \mathbf{X}$ and $\footnotesize \mathbf{Y}$), we integrate their probability density functions (PDFs):

$$
f_Z(z) = \int_{-\infty}^{\infty} f_X(x)\, f_Y(z - x) \, dx.
$$

### 1.3 Illustrative Examples

- **Binomial + Binomial**: If you sum two binomially distributed random variables (same $\footnotesize \mathbf{p}$, different $\footnotesize \mathbf{n}$), you get another binomial with combined $\footnotesize \mathbf{n}$.
- **Normal + Normal**: If you sum two independent normal variables, the result is also normal, with its mean and variance being the sum of the individual means and variances.

---

## 2. Covariance and Correlation

### 2.1 Covariance

When working with multiple variables, understanding their co-movement is essential. **Covariance** between $\footnotesize \mathbf{X}$ and $\footnotesize \mathbf{Y}$ is defined as

$$
\mathrm{Cov}(X, Y) = E\bigl[(X - E[X]) (Y - E[Y])\bigr]
= E[XY] - E[X]\,E[Y].
$$

- If $\footnotesize \mathbf{\mathrm{Cov}(X, Y) > 0}$, $\footnotesize \mathbf{X}$ and $\footnotesize \mathbf{Y}$ tend to move together.
- If $\footnotesize \mathbf{\mathrm{Cov}(X, Y) < 0}$, they typically move in opposite directions.
- If $\footnotesize \mathbf{\mathrm{Cov}(X, Y) = 0}$, there’s no linear association (though non-linear dependencies can still exist).

### 2.2 Correlation

Covariance is influenced by scale. **Correlation** standardizes this measure to a range $\footnotesize \mathbf{[-1,1]}$:

$$
\rho_{X,Y} = \frac{\mathrm{Cov}(X,Y)}{\sqrt{\mathrm{Var}(X)\,\mathrm{Var}(Y)}}.
$$

- $\footnotesize \mathbf{\rho = 1}$: Perfect positive linear relation.
- $\footnotesize \mathbf{\rho = -1}$: Perfect negative linear relation.
- $\footnotesize \mathbf{\rho = 0}$: No linear relation.

Correlation is widely used in finance (portfolio risk management) and data science (feature analysis).

---

## 3. Limit Theorems

### 3.1 Law of Large Numbers (LLN)

Suppose $\footnotesize \mathbf{X_1, X_2, \dots}$ are i.i.d. with mean $\footnotesize \mathbf{\mu}$. The **Law of Large Numbers** says that as $\footnotesize \mathbf{n \to \infty}$,

$$
\frac{1}{n}\sum_{i=1}^n X_i \;\to\; \mu
$$

in probability (Weak LLN) or almost surely (Strong LLN). This underpins why sample averages converge to the true mean.

### 3.2 Central Limit Theorem (CLT)

The **Central Limit Theorem** states that if $\footnotesize \mathbf{X_1, X_2, \dots}$ are i.i.d. with finite mean $\footnotesize \mathbf{\mu}$ and variance $\footnotesize \mathbf{\sigma^2}$, then

$$
\frac{\sum_{i=1}^n X_i - n\mu}{\sigma\sqrt{n}}
\;\xrightarrow{d}\;
\mathcal{N}(0,1),
$$

as $\footnotesize \mathbf{n}$ grows large. This explains why sums or averages of many independent random variables often look normal.

### 3.3 Practical Significance

- **Confidence Intervals**: CLT justifies many statistical inference techniques.
- **Sampling**: LLN assures convergence of sample means to population means.
- **Robustness**: Even with mild assumption violations, large $\footnotesize \mathbf{n}$ yields good approximations.

---

**Sums of random variables** investigate aggregate quantities—vital in risk analysis, manufacturing, and finance. **Covariance and correlation** quantify how variables move together. **Limit theorems** assure that sums and averages follow predictable patterns, justifying much of modern statistical inference.

Together, these topics illuminate why and how simple aggregate statistics can capture the essence of complex processes, and how co-variation and long-run behavior form the foundation of scientific, business, and engineering decisions.

> Check out my full article on [Medium](https://medium.com/@ansh1990/)
