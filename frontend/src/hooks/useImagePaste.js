import { useEffect } from "react";

export function useImagePaste(onImagePaste) {
  useEffect(() => {
    const handlePaste = (e) => {
      const items = e.clipboardData.items;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf("image/") !== -1) {
          e.preventDefault();
          const blob = items[i].getAsFile();
          const fileName =
            blob.name || `pasted-image.${blob.type.split("/")[1]}`;
          const file = new File([blob], fileName, { type: blob.type });
          onImagePaste(file);
          break;
        }
      }
    };

    document.addEventListener("paste", handlePaste);
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, [onImagePaste]);
}
