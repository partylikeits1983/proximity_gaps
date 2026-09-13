import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { expect, it } from 'vitest';
import App from '../src/App';
import { ExperimentProvider } from '../src/state/ExperimentContext';
import { defaultExperiment, experimentUrl, type LessonId } from '../src/state/model';

function start(id: LessonId) {
  window.history.replaceState(null, '', experimentUrl(id, defaultExperiment()));
  return render(
    <ExperimentProvider>
      <App />
    </ExperimentProvider>,
  );
}

it('connects message edits to the matrix and compares shared versus separate column errors', async () => {
  const user = userEvent.setup();
  const { container } = start('interleaved-rs');
  const coefficient = await screen.findByRole('spinbutton', {
    name: 'Message row 2, coefficient 0',
  });
  fireEvent.change(coefficient, { target: { value: '4' } });
  expect(
    screen.getByRole('button', { name: 'Inspect row 2, column 1, value 4' }),
  ).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Compare errors' }));
  await user.click(screen.getByRole('button', { name: 'Same column' }));
  expect(screen.getByTestId('entry-errors')).toHaveTextContent('3');
  expect(screen.getByTestId('column-errors')).toHaveTextContent('1');
  await user.click(screen.getByRole('button', { name: 'Different columns' }));
  expect(screen.getByTestId('entry-errors')).toHaveTextContent('3');
  expect(screen.getByTestId('column-errors')).toHaveTextContent('3');
  await user.click(screen.getByRole('button', { name: 'Add message row' }));
  expect(
    screen.getByRole('spinbutton', { name: 'Message row 4, coefficient 0' }),
  ).toBeInTheDocument();
  expect(container.querySelector('.katex-error')).toBeNull();
});

it('shows exact challenge probabilities, candidate supports, and preserved URL settings', async () => {
  const user = userEvent.setup();
  const { container } = start('mutual-correlated-agreement');
  const radius = await screen.findByRole('slider', { name: 'Ball radius' });
  expect(screen.getByTestId('mca-bad-count')).toHaveTextContent('2/5');
  fireEvent.change(radius, { target: { value: '2' } });
  expect(screen.getByTestId('mca-near-count')).toHaveTextContent('5/5');
  expect(screen.getByTestId('mca-bad-count')).toHaveTextContent('4/5');
  await user.click(
    screen.getByRole('button', { name: 'Challenge 2: near code, all supports explained' }),
  );
  expect(
    within(screen.getByRole('region', { name: 'Same-support witness' })).getByText(
      'All qualifying supports explained',
    ),
  ).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Line inside the code' }));
  expect(screen.getByTestId('mca-near-count')).toHaveTextContent('5/5');
  expect(screen.getByTestId('mca-bad-count')).toHaveTextContent('0/5');
  const url = JSON.parse(new URLSearchParams(window.location.search).get('s')!);
  expect(url.mca).toMatchObject({ u0: [1, 2, 3, 4, 0], radius: 0 });
  expect(container.querySelector('.katex-error')).toBeNull();
});
