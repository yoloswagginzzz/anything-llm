import useUser from "@/hooks/useUser";
import { PaperclipHorizontal } from "@phosphor-icons/react";
import { Tooltip } from "react-tooltip";
import { useEffect } from "react";

/**
 * This is a simple proxy component that clicks on the DnD file uploader for the user.
 * @returns
 */
export default function AttachItem() {
  const { user } = useUser();
  if (!!user && user.role === "default") return null;

  const handlePaste = (e) => {
    const items = e.clipboardData.items;
    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const blob = items[i].getAsFile();
        handleImagePaste(blob);
        break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener('paste', handlePaste);
    return () => {
      document.removeEventListener('paste', handlePaste);
    };
  }, []);

  const handleImagePaste = (blob) => {
    const file = new File([blob], "pasted-image.png", { type: "image/png" });
    document.getElementById("dnd-chat-file-uploader").files = new FileList([file]);
    document.getElementById("dnd-chat-file-uploader").dispatchEvent(new Event('change', { bubbles: true }));
  };

  return (
    <>
      <button
        id="attach-item-btn"
        data-tooltip-id="attach-item-btn"
        data-tooltip-content="Attach a file to this chat"
        aria-label="Attach a file to this chat"
        type="button"
        onClick={(e) => {
          e?.target?.blur();
          document?.getElementById("dnd-chat-file-uploader")?.click();
          return;
        }}
        className={`border-none relative flex justify-center items-center opacity-60 hover:opacity-100 cursor-pointer`}
      >
        <PaperclipHorizontal className="w-6 h-6 pointer-events-none text-white rotate-90 -scale-y-100" />
        <Tooltip
          id="attach-item-btn"
          place="top"
          delayShow={300}
          className="tooltip !text-xs z-99"
        />
      </button>
    </>
  );
}
