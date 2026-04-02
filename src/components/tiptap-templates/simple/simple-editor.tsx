/* eslint-disable react-hooks/refs */
"use client";

import { useEffect, useRef, useState } from "react";
import { EditorContent, EditorContext, useEditor } from "@tiptap/react";

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit";
import { Image } from "@tiptap/extension-image";
import { TaskItem, TaskList } from "@tiptap/extension-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import { Highlight } from "@tiptap/extension-highlight";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Selection } from "@tiptap/extensions";

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button";
import { Spacer } from "@/components/tiptap-ui-primitive/spacer";
import {
    Toolbar,
    ToolbarGroup,
    ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension";
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension";
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu";
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button";
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu";
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button";
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button";
import {
    ColorHighlightPopover,
    ColorHighlightPopoverContent,
    ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover";
import {
    LinkPopover,
    LinkContent,
    LinkButton,
} from "@/components/tiptap-ui/link-popover";
import { MarkButton } from "@/components/tiptap-ui/mark-button";
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button";
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button";

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon";
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon";
import { LinkIcon } from "@/components/tiptap-icons/link-icon";

// --- Hooks ---
import { useIsBreakpoint } from "@/hooks/use-is-breakpoint";
import { useWindowSize } from "@/hooks/use-window-size";
import { useCursorVisibility } from "@/hooks/use-cursor-visibility";

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils";

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

import content from "@/components/tiptap-templates/simple/data/content.json";

const MainToolbarContent = ({
    onHighlighterClick,
    onLinkClick,
    isMobile,
}: {
    onHighlighterClick: () => void;
    onLinkClick: () => void;
    isMobile: boolean;
}) => {
    return (
        <>
            <Spacer />

            <ToolbarGroup>
                <UndoRedoButton action="undo" />
                <UndoRedoButton action="redo" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <HeadingDropdownMenu modal={false} levels={[1, 2, 3, 4]} />
                <ListDropdownMenu
                    modal={false}
                    types={["bulletList", "orderedList", "taskList"]}
                />
                <BlockquoteButton />
                <CodeBlockButton />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="bold" />
                <MarkButton type="italic" />
                <MarkButton type="strike" />
                <MarkButton type="code" />
                <MarkButton type="underline" />
                {!isMobile ? (
                    <ColorHighlightPopover />
                ) : (
                    <ColorHighlightPopoverButton onClick={onHighlighterClick} />
                )}
                {!isMobile ? (
                    <LinkPopover />
                ) : (
                    <LinkButton onClick={onLinkClick} />
                )}
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <MarkButton type="superscript" />
                <MarkButton type="subscript" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <TextAlignButton align="left" />
                <TextAlignButton align="center" />
                <TextAlignButton align="right" />
                <TextAlignButton align="justify" />
            </ToolbarGroup>

            <ToolbarSeparator />

            <ToolbarGroup>
                <ImageUploadButton text="Add" />
            </ToolbarGroup>

            <Spacer />

            {isMobile && <ToolbarSeparator />}

            {/* <ToolbarGroup>
                <ThemeToggle />
            </ToolbarGroup> */}
        </>
    );
};

const MobileToolbarContent = ({
    type,
    onBack,
}: {
    type: "highlighter" | "link";
    onBack: () => void;
}) => (
    <>
        <ToolbarGroup>
            <Button variant="ghost" onClick={onBack}>
                <ArrowLeftIcon className="tiptap-button-icon" />
                {type === "highlighter" ? (
                    <HighlighterIcon className="tiptap-button-icon" />
                ) : (
                    <LinkIcon className="tiptap-button-icon" />
                )}
            </Button>
        </ToolbarGroup>

        <ToolbarSeparator />

        {type === "highlighter" ? (
            <ColorHighlightPopoverContent />
        ) : (
            <LinkContent />
        )}
    </>
);

type SimpleEditorProps = {
    value?: string;
    onChange?: (html: string) => void;
};

export function SimpleEditor({ value, onChange }: SimpleEditorProps) {
    const isMobile = useIsBreakpoint();
    const { height } = useWindowSize();
    const [mobileView, setMobileView] = useState<
        "main" | "highlighter" | "link"
    >("main");
    const toolbarRef = useRef<HTMLDivElement>(null);

    const editor = useEditor({
        immediatelyRender: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: handleImageUpload,
                onError: (error) => console.error("Upload failed:", error),
            }),
        ],
        content: value ?? content,
        onUpdate({ editor: currentEditor }) {
            onChange?.(currentEditor.getHTML());
        },
    });

    const rect = useCursorVisibility({
        editor,
        overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
    });

    useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main");
        }
    }, [isMobile, mobileView]);

    useEffect(() => {
        if (!editor || value === undefined) return;

        const currentHtml = editor.getHTML();
        if (currentHtml !== value) {
            editor.commands.setContent(value, {
                emitUpdate: false,
            });
        }
    }, [editor, value]);

    return (
        <div className="simple-editor-wrapper h-full">
            <EditorContext.Provider value={{ editor }}>
                <Toolbar
                    ref={toolbarRef}
                    style={{
                        ...(isMobile
                            ? {
                                  bottom: `calc(100% - ${height - rect.y}px)`,
                              }
                            : {}),
                    }}
                >
                    {mobileView === "main" ? (
                        <MainToolbarContent
                            onHighlighterClick={() =>
                                setMobileView("highlighter")
                            }
                            onLinkClick={() => setMobileView("link")}
                            isMobile={isMobile}
                        />
                    ) : (
                        <MobileToolbarContent
                            type={
                                mobileView === "highlighter"
                                    ? "highlighter"
                                    : "link"
                            }
                            onBack={() => setMobileView("main")}
                        />
                    )}
                </Toolbar>

                <EditorContent
                    editor={editor}
                    role="presentation"
                    className="simple-editor-content"
                />
            </EditorContext.Provider>
        </div>
    );
}

export const contentTemplate = `
<h1>Mẫu bài viết du lịch: Hướng dẫn sử dụng Editor</h1>

<p>
  Đây là mẫu bài viết để bạn thử các tính năng cơ bản như
  <strong>in đậm</strong>, <em>in nghiêng</em>, highlight, danh sách và chèn ảnh.
</p>

<img
  src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1600&q=80"
  alt="travel-banner"
  title="Ảnh du lịch"
/>

<h2>1. Viết tiêu đề &amp; mô tả</h2>

<p>
  Bạn có thể viết một đoạn mô tả ngắn về chuyến đi. Ví dụ:
  <mark style="background-color: var(--tt-color-highlight-yellow);">
    Hà Nội 2 ngày 1 đêm
  </mark>
  dành cho người thích khám phá ẩm thực và phố cổ.
</p>

<h2>2. Tạo danh sách lịch trình</h2>

<ul>
  <li>
    <p>Sáng: Check-in Hồ Gươm</p>
  </li>
  <li>
    <p>Trưa: Ăn bún chả + cà phê trứng</p>
  </li>
  <li>
    <p>Tối: Dạo phố cổ và chợ đêm</p>
  </li>
</ul>

<blockquote>
  <p>
    <em>
      Tip: Bạn có thể dùng blockquote để highlight mẹo du lịch hoặc kinh nghiệm cá nhân.
    </em>
  </p>
</blockquote>

<p>
  Bạn cũng có thể chèn link tham khảo tại đây:
  <a
    href="https://unsplash.com"
    target="_blank"
    rel="noopener noreferrer nofollow"
  >
    Unsplash
  </a>
</p>

<hr />

<p>
  Hoàn tất! Bạn có thể tiếp tục viết thêm nội dung, chèn ảnh, hoặc định dạng đoạn văn tuỳ ý.
</p>

`;
