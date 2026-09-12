import { memo } from 'react';
import katex from 'katex';

export const MathText = memo(function MathText({
  children,
  block = false,
  className = '',
}: {
  children: string;
  block?: boolean;
  className?: string;
}) {
  const html = katex.renderToString(children, {
    displayMode: block,
    throwOnError: false,
    output: 'htmlAndMathml',
    trust: false,
  });
  return (
    <span
      className={`math ${block ? 'math-block' : ''} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
});
