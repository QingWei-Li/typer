import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/gfm/gfm";
import "./style.styl";
import "./themes/netlify-light.styl";
import { useEffect } from "react";

export function Editor(
  props?: React.HTMLAttributes<HTMLDivElement> & {
    onChange: (val: string) => void;
    initbody?: string;
  }
) {
  let refEditor: HTMLDivElement;

  useEffect(() => {
    const editor = Codemirror(refEditor, {
      mode: "gfm",
      autofocus: true,
      theme: "netlify-light",
      lineWrapping: true,
      value: props.initbody || "",
      viewportMargin: Infinity
    });

    editor.on("change", () => {
      props.onChange(editor.getValue());
    });
  }, []);
  const { initbody, ...attrs } = props;

  return <div {...attrs} ref={r => (refEditor = r)} className="editor"></div>;
}
