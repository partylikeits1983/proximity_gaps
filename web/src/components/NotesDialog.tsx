import { useEffect, useRef } from 'react';
import { Download, X } from 'lucide-react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import notes from '../../../notes/grand_list_decoding.md?raw';
import notesUrl from '../../../notes/grand_list_decoding.md?url';
import starkNotes from '../../../notes/codes_to_proofs.md?raw';
import starkNotesUrl from '../../../notes/codes_to_proofs.md?url';

export default function NotesDialog({
  section,
  source,
  onClose,
}: {
  section: string;
  source?: 'stark';
  onClose: () => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const start = notes.indexOf(`## ${section}`);
  const end = notes.indexOf('\n## ', start + 1);
  const excerpt =
    source === 'stark'
      ? starkNotes
      : start < 0
        ? notes
        : notes.slice(start, end < 0 ? undefined : end);
  const filename = source === 'stark' ? 'codes_to_proofs.md' : 'grand_list_decoding.md';
  useEffect(() => {
    const node = dialog.current;
    node?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      node?.close();
      document.body.style.overflow = previous;
    };
  }, []);
  return (
    <dialog
      className="notes-dialog"
      ref={dialog}
      onCancel={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      aria-labelledby="notes-title"
    >
      <div className="notes-dialog-header">
        <div>
          <span className="eyebrow">FROM THE RESEARCH NOTEBOOK</span>
          <h2 id="notes-title">Read the notes</h2>
        </div>
        <button autoFocus className="icon-button" aria-label="Close notes" onClick={onClose}>
          <X size={20} />
        </button>
      </div>
      <div className="notes-content">
        <Markdown remarkPlugins={[remarkGfm, remarkMath]} rehypePlugins={[rehypeKatex]}>
          {excerpt}
        </Markdown>
      </div>
      <div className="notes-dialog-footer">
        <span>{filename}</span>
        <a
          className="text-button"
          href={source === 'stark' ? starkNotesUrl : notesUrl}
          download={filename}
        >
          <Download size={15} /> Download full note
        </a>
      </div>
    </dialog>
  );
}
