/* eslint-disable @typescript-eslint/no-unused-vars */
import { editor } from "monaco-editor";
import styles from "./toolbar.module.css";
import UndoIcon from "./icon/UndoIcon";
import RedoIcon from "./icon/RedoIcon";
import MoonLoader from "react-spinners/MoonLoader";
import React from 'react';
import Select, { OptionProps } from 'react-select';
import { CSSObject } from '@emotion/react';
import { updateSessionLanguage } from "@/api/collaboration";

type Props = {
  editor: editor.IStandaloneCodeEditor;
  language: string;
  saving: boolean;
  setLanguage: (language: string) => void;
  peerOnline: boolean;
  theme: string;
  setTheme: (theme: string) => void;
  room: string;
};

type LanguageOption = {
  value: string;
  label: string;
};

type ThemeOption = {
  value: string;
  label: string;
}

export function Toolbar({ editor, language, saving, setLanguage, peerOnline, theme, setTheme, room }: Readonly<Props>) {
  const languages: LanguageOption[] = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
  ];

  const handleLanguageChange = (selectedOption: LanguageOption | null) => {
    if (selectedOption) {
      setLanguage(selectedOption.value);
      updateSessionLanguage(room, selectedOption.value);
    }
  };

  const themes: ThemeOption[] = [ 
    { value: 'dark-plus', label: 'Dark' },
    { value: 'light-plus', label: 'Light' },
  ];

  const handleThemeChange = (selectedOption: ThemeOption | null) => {
    if (selectedOption) {
      setTheme(selectedOption.value);
    }
  }

  const customStyles = {
    option: (provided: CSSObject, state: OptionProps<LanguageOption, false>): CSSObject => ({
      ...provided,
      backgroundColor: state.isSelected ? '#2F3B54' : 'white',
      '&:hover': {
        backgroundColor: '#8695B7',
      },
    }),
  };

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
      <div className="flex items-center justify-items-center mx-4">
        <div
          className={`${
            peerOnline ? 'bg-green' : 'bg-red'
          } text-black text-xs font-semibold px-2 py-1 rounded-2xl`}
        >
          {peerOnline ? "Peer Online" : "Peer Offline"}
        </div>
      </div>
      <div className="text-grey-300 h-6 py-1 px-2 ml-auto mr-2 gap-4 rounded-full text-xs flex items-center justify-center">
        {saving && (
          <div className="flex flex-row gap-1 items-center">
            <MoonLoader size={12} color="white" />
            <div className="text-grey-300 text-opacity-75 text-xs">Saving</div>
          </div>
        )}
        <Select
          value={languages.find(lang => lang.value === language)}
          onChange={handleLanguageChange}
          options={languages}
          className="w-32"
          styles={customStyles}
        />
        <Select
          value={themes.find(themeOption => themeOption.value === theme)}
          onChange={handleThemeChange}
          options={themes}
          className="w-32"
          styles={customStyles}
        />
      </div>
    </div>
  );
}
