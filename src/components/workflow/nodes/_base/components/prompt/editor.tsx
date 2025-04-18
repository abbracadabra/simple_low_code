'use client'
import type { ClipboardEventHandler, FC } from 'react'
import React, { useMemo, useRef, useState } from 'react'
import { useEventListener } from 'ahooks'
import { useEvent, useMergedState } from 'rc-util';
import type {
  NodeOutputVar,
} from '@/components/workflow/types'
import { Card, Dropdown, MenuProps } from 'antd'

const VarHtmlTagName = 'xyz'

type Props = {
  className?: string
  value?: string
  onChange?: (value: string) => void
  disabled?: boolean
  varList?: NodeOutputVar[]
}

const Editor: FC<Props> = ({
  className,
  value: val,
  onChange,
  disabled,
  varList = [],
}) => {
  const [showSelect, setShowSelect] = useState(false)
  const [value, setValue] = useMergedState(val)

  const htmlValueStr = useMemo(() => {
    return value && text2HtmlStr(value, varList)
  }, [value,varList])

  const ref = useRef<HTMLDivElement>(null)

  const handleHtmlChange = useEvent(() => {
    if (ref.current) {
      const txtValue = getPlainContent(ref.current); // <xyz attr='{{#a.b#}}'>节点/变量名</xyz> 变成 {{#a.b#}}
      setValue(txtValue)
      onChange?.(txtValue);
    }
  });

  const handlePaste:ClipboardEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    
    const selection = window.getSelection();
    if (!selection.rangeCount) return;
    
    const inserted = document.createTextNode(text)
    const range = selection.getRangeAt(0);
    range.deleteContents();
    range.insertNode(inserted);
    
    range.setStartAfter(inserted);
    range.setEndAfter(inserted);
    selection.removeAllRanges();
    selection.addRange(range);
  };

  const handleClick: MenuProps['onClick'] = useEvent((m) => {
    ref.current.focus();
    const path:string[] = m.keyPath
    const nodeTitle = varList.find(item => item.nodeId === path[0])?.title
    // delete '/' trigger key
    insertHtmlAtCaret(`{{#${path.join('.')}#}}`, `${nodeTitle}/${path.slice(1).join('/')}`, ref.current); // key:{{#a.b#}} label:节点/变量  插入 <xyz attr='{{#a.b#}}'>节点/变量名</xyz>
  })

  useEventListener(
    "keydown",
    (e: KeyboardEvent) => {
      if (e.key === "/") {
        // 不要prevent，因为/是要输进去的
        // trigger select menu
        setShowSelect(true)
      } else {
        setShowSelect(false)
      }
    },
    { target: ref }
  );

  const selectItems:MenuProps['items'] = useMemo(() => {
    return varList.map((item) => {
      return {
        key: item.nodeId,
        type: 'group',
        label: item.title,
        children: item.vars.map((v) => {
          return {
            key: v.name,  
            label: v.name,
          }
        })
      }
    })
  }, [varList])

  return <><Card style={{ width: '100%' }}>
    <div
      ref={ref}
      onPaste={handlePaste}
      onBlur={handleHtmlChange}
      contentEditable={!disabled}
      dangerouslySetInnerHTML={{ __html: htmlValueStr }} /></Card>
    <Dropdown
      menu={{ items: selectItems, onClick: handleClick }}
      open={showSelect}
      dropdownRender={(menus) => <div style={{ maxHeight: 400, overflowY: "auto" }}>{menus}</div>} />
  </>
}
export default React.memo(Editor)

const getPlainContent = (divEle: HTMLDivElement): string => {
  if (!divEle.childNodes?.length) {
    return ""
  }
  return Array.from(divEle.childNodes).map(node => {
    if (node instanceof HTMLElement && node.tagName === VarHtmlTagName) {
      return node.dataset.key
    } else {
      return node.textContent || ''
    }
  }).join('')
}

const var2HtmlElement = (key: string, label: string): HTMLElement => {
  // const tempEle = document.createElement(VarHtmlTagName);
  const tempEle = document.createElement(VarHtmlTagName);
  tempEle.setAttribute("contenteditable", "false");
  tempEle.setAttribute("data-key", key);
  tempEle.innerText = label;
  return tempEle
  // return `<span data-key="${key}" contenteditable="false">${label}</span>`
}

// 替换所有的{{##}} 成 <span ..>..</span>
function text2HtmlStr(input: string, vars: NodeOutputVar[]): string {
  const regex = /{{#(.*?)#}}/g;
  const result: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: any;
  while ((match = regex.exec(input)) !== null) {
    const [fullMatch, key] = match; // fullMatch is "{{#xxx.x#}}", key is "xxx.x"
    const matchStart = match.index;
    const matchEnd = match.index + fullMatch.length;
    if (matchStart > lastIndex) {
      result.push(input.slice(lastIndex, matchStart));
    }

    const parts = key.split('.');
    const nodeTitle = vars.find(v => v.nodeId === parts[0])?.title || 'unknown'
    const label = `${nodeTitle}/${parts.slice(1).join('/')}`

    const varEle = var2HtmlElement(key, label);
    if (varEle) {
      result.push(varEle.outerHTML);
    } else {
      result.push(fullMatch);
    }
    lastIndex = matchEnd;
  }
  if (lastIndex < input.length) {
    result.push(input.slice(lastIndex));
  }
  return result.join("");
}

// delete trigger word '/' and insert new node
const insertHtmlAtCaret = (key: string, label: string, editableDiv: HTMLDivElement) => {
  if (!editableDiv) return;
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;
  let range = selection.getRangeAt(0);
  const startOffset = range.startOffset;
  const startContainer = range.startContainer;

  // delete trigger word /
  if (startContainer.nodeType === Node.TEXT_NODE) {
    const text = startContainer.textContent || '';
    if (startOffset > 0 && text[startOffset - 1] === '/') {
      // Delete the '/' character
      const newText = text.slice(0, startOffset - 1) + text.slice(startOffset);
      startContainer.textContent = newText;
      // Adjust caret position
      range = document.createRange();
      range.setStart(startContainer, startOffset - 1);
      range.setEnd(startContainer, startOffset - 1);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }
  
  // dom变了后复用range可能有问题，所以上面 document.createRange()
  const tempEle = var2HtmlElement(key, label)
  range.insertNode(tempEle); // insert at the start of the range
  range.setStartAfter(tempEle);
  range.setEndAfter(tempEle);
  selection.removeAllRanges();
  selection.addRange(range);
};