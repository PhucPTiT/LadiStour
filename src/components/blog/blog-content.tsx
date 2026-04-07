"use client";

import { useEditor, EditorContent } from "@tiptap/react";

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

// --- Tiptap Node Styles ---
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss";
import "@/components/tiptap-node/code-block-node/code-block-node.scss";
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss";
import "@/components/tiptap-node/list-node/list-node.scss";
import "@/components/tiptap-node/image-node/image-node.scss";
import "@/components/tiptap-node/heading-node/heading-node.scss";
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss";

// --- Tiptap Editor Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss";

// --- Custom Styles ---

import "./blog-content.scss";

type BlogContentProps = {
    contentHtml: string;
};

export function BlogContent({ contentHtml }: BlogContentProps) {
    const editor = useEditor({
        immediatelyRender: false,
        editable: false,
        editorProps: {
            attributes: {
                class: "simple-editor",
                role: "presentation",
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
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,
        ],
        content: contentHtml,
    });

    return (
        <div className="blog-content">
            <EditorContent
                editor={editor}
                role="presentation"
                className="simple-editor-content"
            />
        </div>
    );
}
