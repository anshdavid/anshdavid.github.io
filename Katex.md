# KaTeX Control Guide

This guide covers various methods to control and style KaTeX equations in Markdown documents.

## Table of Contents
- [Font Size Control](#font-size-control)
- [CSS Styling](#css-styling)
- [Making Equations Bold](#making-equations-bold)

## Font Size Control

To reduce the font size of inline equations rendered with KaTeX in Markdown, you can utilize several methods:

### 1. LaTeX Font Size Commands within the Equation

You can embed standard LaTeX font size commands directly within your inline KaTeX equation. These commands will affect the size of the elements within the curly braces where they are applied.

**Example:**
```markdown
This is an inline equation: $\small x^2 + y^2 = z^2$ and this is normal text.
This is another inline equation: $\tiny E=mc^2$.
```

**Available font size commands:**
- `\tiny` - smallest
- `\scriptsize` - very small
- `\footnotesize` - small
- `\small` - slightly smaller
- `\normalsize` - default size
- `\large` - slightly larger
- `\Large` - larger
- `\LARGE` - much larger
- `\huge` - very large
- `\Huge` - largest

## CSS Styling

### Global Control

If you are rendering your Markdown in an environment where you can apply custom CSS, you can target the KaTeX elements responsible for inline equations and adjust their font size. This offers a more global solution if you want to apply the change consistently.

**General KaTeX styling:**
```css
.katex {
  font-size: 0.8em; /* Adjust this value as needed */
}
```

**More specific for inline math:**
```css
.katex-html { /* This targets the HTML output of KaTeX */
  font-size: 0.8em; /* Adjust this value as needed */
}
```

> **Note:** The specific CSS classes may vary slightly depending on the Markdown renderer and KaTeX integration used. You might need to inspect the rendered HTML to identify the correct class names.

### 2. Scaling Commands (Precise Control)

For more precise scaling of an entire equation, you can use LaTeX commands like `\scalebox` or `\resizebox` if your KaTeX setup supports them. These commands are typically used in more complex LaTeX documents but can sometimes be integrated into Markdown as well.

**Example:**
```markdown
This is a scaled equation: $\scalebox{0.7}{y = \sin^2 x}$.
```

## Making Equations Bold

To make an inline equation bold in Markdown using KaTeX, you combine the standard KaTeX inline math delimiters with the LaTeX command for bold text.

### Basic Method

**Inline Math Delimiters:** Enclose your equation within single dollar signs (`$ ... $`) to indicate inline math for KaTeX.

**Bold Command:** Inside the dollar signs, use the LaTeX `\mathbf{}` command to make specific parts of the equation bold.

### Examples

#### Making specific variables bold

To make the variable 'x' bold in the inline equation `y=mx+b`, you would write:

```markdown
The equation is $y = m\mathbf{x} + b$.
```

This will render as: The equation is $y=m\mathbf{x}+b$.

#### Making the entire equation bold

If you want the entire inline equation to be bold, you would wrap the entire equation content within `\mathbf{}`:

```markdown
The bold equation is $\mathbf{y = mx + b}$.
```

#### Bold text within equations

`\mathbf{}` is primarily for making mathematical symbols and variables bold. For bolding regular text within an equation (e.g., labels), you might use `\text{}` in conjunction with Markdown's bold syntax or another LaTeX bold command like `\textbf{}` within the `\text{}` environment.

```markdown
The equation for the $\mathbf{\text{bold variable}}$ is $y = m\mathbf{x} + b$.
```

### Important Considerations

- **Symbols vs. Text:** Use `\mathbf{}` for mathematical symbols and variables
- **Text labels:** Use `\textbf{}` within `\text{}` for bold text labels in equations
- **Consistency:** Maintain consistent styling throughout your document