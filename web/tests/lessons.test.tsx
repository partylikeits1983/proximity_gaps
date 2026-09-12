import { act, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from '../src/App';
import { ExperimentProvider } from '../src/state/ExperimentContext';
import { defaultExperiment, experimentUrl, type LessonId } from '../src/state/model';

function start(lesson: LessonId = 'tape-polynomial', experiment = defaultExperiment()) {
  window.history.replaceState(null, '', experimentUrl(lesson, experiment));
  return render(
    <ExperimentProvider>
      <App />
    </ExperimentProvider>,
  );
}

beforeEach(() => window.history.replaceState(null, '', '/'));

describe('interactive lessons', () => {
  it('edits coefficients, adds slots, preserves them through navigation, and renders valid math', async () => {
    const user = userEvent.setup();
    const { container } = start();
    const first = await screen.findByRole('spinbutton', { name: 'Message, coefficient 0' });
    await user.clear(first);
    await user.type(first, '6');
    await user.click(screen.getByRole('button', { name: 'Add coefficient' }));
    expect(screen.getByRole('spinbutton', { name: 'Message, coefficient 3' })).toHaveValue(0);
    const codewordLink = screen.queryByRole('link', { name: /02 Build a codeword/ });
    expect(codewordLink, 'The second lesson must have a named navigation link').not.toBeNull();
    await user.click(codewordLink!);
    await screen.findByRole('slider', { name: 'Evaluation points' });
    expect(screen.getByRole('combobox', { name: /Code rate/ })).toHaveValue('8');
    expect(
      within(screen.getByRole('group', { name: 'Codeword' })).getAllByText('6').length,
    ).toBeGreaterThan(0);
    expect(container.querySelector('.katex-error')).toBeNull();
    expect(container.querySelector('math')).not.toBeNull();
  });
  it.each(['Delete', 'Backspace'])(
    'removes focused coefficients with %s, shifts terms, and keeps one editable cell',
    async (key) => {
      const user = userEvent.setup();
      start('tape-polynomial', {
        ...defaultExperiment(5),
        coefficients: [3, 2, 1, 0, 0],
      });
      const middle = await screen.findByRole('spinbutton', { name: 'Message, coefficient 1' });
      const tape = within(screen.getByRole('group', { name: 'Message' }));
      const values = () =>
        tape.getAllByRole('spinbutton').map((input) => (input as HTMLInputElement).valueAsNumber);
      expect(screen.queryByRole('button', { name: 'Add coefficient' })).toBeNull();

      await user.click(middle);
      await user.keyboard(`{${key}}`);
      expect(values()).toEqual([3, 1, 0, 0]);
      expect(tape.getByRole('spinbutton', { name: 'Message, coefficient 1' })).toHaveFocus();
      expect(screen.getByLabelText('Polynomial: 3 + X')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add coefficient' })).toBeInTheDocument();

      await user.click(tape.getByRole('spinbutton', { name: 'Message, coefficient 3' }));
      await user.keyboard(`{${key}}`);
      expect(values()).toEqual([3, 1, 0]);
      expect(tape.getByRole('spinbutton', { name: 'Message, coefficient 2' })).toHaveFocus();
      await user.keyboard(`{${key}}{${key}}{${key}}`);
      expect(values()).toEqual([3]);
      const remaining = tape.getByRole('spinbutton', { name: 'Message, coefficient 0' });
      expect(remaining).toHaveFocus();
      expect(remaining).toHaveAttribute('aria-invalid', 'false');
      expect(screen.getByLabelText('Polynomial: 3')).toBeInTheDocument();
      expect(JSON.parse(new URLSearchParams(window.location.search).get('s')!)).toMatchObject({
        coefficients: [3],
        n: 5,
        received: [3, 3, 3, 3, 3],
      });

      await user.clear(remaining);
      await user.type(remaining, '4');
      expect(values()).toEqual([4]);
    },
  );
  it('changes the exact rate and output length together', async () => {
    start('evaluation-codeword');
    const slider = await screen.findByRole('slider', { name: 'Evaluation points' });
    fireEvent.change(slider, { target: { value: '12' } });
    expect(screen.getByRole('combobox', { name: /Code rate/ })).toHaveValue('12');
    expect(
      within(screen.getByRole('group', { name: 'Codeword' })).getAllByText(/^\d+$/).length,
    ).toBe(24);
    fireEvent.change(slider, { target: { value: '3' } });
    expect(screen.getByText('No redundancy yet.')).toBeInTheDocument();
  });
  it('allows two different wrong symbols without changing Hamming distance', async () => {
    const user = userEvent.setup();
    start('hamming-distance');
    const input = await screen.findByRole('spinbutton', { name: 'Received word, position 1' });
    await user.click(input);
    await user.keyboard('{Delete}{Backspace}');
    await user.type(input, '16');
    expect(
      within(screen.getByRole('group', { name: 'Received word' })).getAllByRole('spinbutton'),
    ).toHaveLength(8);
    expect(screen.getByLabelText('1 of 8 positions differ')).toBeInTheDocument();
    await user.clear(input);
    await user.type(input, '2');
    expect(screen.getByLabelText('1 of 8 positions differ')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Restore' }));
    expect(screen.getByLabelText('0 of 8 positions differ')).toBeInTheDocument();
  });
  it('expands the complete binary universe and changes its center', async () => {
    const user = userEvent.setup();
    const { container } = start('hamming-ball');
    const slider = await screen.findByRole('slider', { name: 'Hamming radius' });
    fireEvent.change(slider, { target: { value: '5' } });
    expect(container.querySelectorAll('.ball-point.is-inside')).toHaveLength(32);
    fireEvent.change(slider, { target: { value: '0' } });
    expect(container.querySelectorAll('.ball-point.is-inside')).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: '11111, distance 5, outside the ball' }));
    await user.click(screen.getByRole('button', { name: 'Use as center' }));
    expect(container.querySelectorAll('.ball-point.is-inside')).toHaveLength(1);
    expect(
      screen.getByRole('button', { name: '11111, distance 0, inside the ball' }),
    ).toBeInTheDocument();
  });
  it('reveals genuine ambiguity and supports an independent empty search radius', async () => {
    const user = userEvent.setup();
    const { container } = start('decoding-radius');
    const slider = await screen.findByRole('slider', { name: 'Introduced errors' });
    fireEvent.change(slider, { target: { value: '2' } });
    expect(screen.getByTestId('candidate-count')).toHaveTextContent('1');
    fireEvent.change(slider, { target: { value: '3' } });
    expect(screen.getByTestId('candidate-count')).toHaveTextContent('2');
    expect(screen.getByText('The guarantee has ended.')).toBeInTheDocument();
    await user.click(screen.getByText('Separate search radius from corruption'));
    await user.click(screen.getByRole('checkbox', { name: 'Search radius follows errors' }));
    fireEvent.change(screen.getByRole('slider', { name: 'Search radius' }), {
      target: { value: '0' },
    });
    expect(screen.getByTestId('candidate-count')).toHaveTextContent('0');
    expect(container.querySelector('.katex-error')).toBeNull();
  });
  it('restores a shared route on history navigation', async () => {
    start();
    await screen.findByRole('spinbutton', { name: 'Message, coefficient 0' });
    const restored = defaultExperiment();
    restored.ballRadius = 4;
    act(() => {
      window.history.pushState(null, '', experimentUrl('hamming-ball', restored));
      window.dispatchEvent(new PopStateEvent('popstate'));
    });
    expect(await screen.findByRole('slider', { name: 'Hamming radius' })).toHaveValue('4');
  });
  it('renders the source note and restores the interface when closed', async () => {
    const user = userEvent.setup();
    const { container } = start();
    await screen.findByRole('spinbutton', { name: 'Message, coefficient 0' });
    await user.click(screen.getByRole('button', { name: /Research notes/ }));
    expect(await screen.findByRole('dialog', { name: 'Read the notes' })).toHaveAttribute('open');
    expect(screen.getByRole('link', { name: /Download full note/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Close notes' }));
    await waitFor(() => expect(container.querySelector('dialog')).toBeNull());
  });
});
