import { MouseEvent, ReactNode } from 'react';
import ReactDOM from 'react-dom';

interface PropTypes {
  onClose: () => void;
  children: ReactNode;
  isOpen: boolean;
}

function Wrapper({ children, onClose, isOpen }: PropTypes) {
  function handleModalClose(e: MouseEvent) {
    e.stopPropagation();
    onClose();
  }

  if (!isOpen) return <div></div>;
  return (
    <div className="w-screen h-screen fixed top-0 left-0 flex items-start justify-center">
      <div
        className="absolute top-0 left-0 w-full h-full bg-black/80"
        onClick={handleModalClose}
      ></div>
      <div className="bg-white w-[600px] max-h-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md p-10 overflow-y-scroll">
        {children}
      </div>
    </div>
  );
}

export default function Modal(props: PropTypes) {
  return ReactDOM.createPortal(
    <Wrapper {...props} />,
    document.querySelector('#modal') as HTMLDivElement
  );
}
