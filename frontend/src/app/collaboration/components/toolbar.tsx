/* eslint-disable @typescript-eslint/no-unused-vars */
import { editor } from "monaco-editor";
import styles from "./toolbar.module.css";
import UndoIcon from "./icon/UndoIcon";
import RedoIcon from "./icon/RedoIcon";
import MoonLoader from "react-spinners/MoonLoader";

type Props = {
  editor: editor.IStandaloneCodeEditor;
  language: string;
  saving: boolean;
};

export function Toolbar({ editor, language, saving }: Props) {
  const languageCapitalized =
    language.charAt(0).toUpperCase() + language.slice(1);
  return (
    <div className={styles.toolbar}>
      <button
        className={styles.button}
        onClick={(e) => {
          try {
            editor.trigger("", "undo", null);
          } catch {}
        }}
      >
        <UndoIcon />
      </button>
      <button
        className={styles.button}
        onClick={(e) => {
          try {
            editor.trigger("", "redo", null);
          } catch {}
        }}
      >
        <RedoIcon />
      </button>
      <div className="text-grey-300 h-6 py-1 px-2 ml-auto mr-2 gap-4 rounded-full text-xs flex items-center justify-center">
        {saving && (
          <div className="flex flex-row gap-1 items-center">
            <MoonLoader size={12} color="white" />
            <div className="text-grey-300 text-opacity-75 text-xs">Saving</div>
          </div>
        )}
        {languageCapitalized}
      </div>
    </div>
  );
}
