import React, { Component } from 'react'
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css"

//用来指定商品详情的富文本编辑器
export default class RichTextEditor extends Component {

    constructor(props) {
        super(props);
        const html = this.props.detail;
        if (html) {//如果有值
            const contentBlock = htmlToDraft(html);
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
                const editorState = EditorState.createWithContent(contentState);
                this.state = {
                    editorState,
                };
            }
        } else {
            this.state = {
                //创建一个没有内容的编辑对象
                editorState: EditorState.createEmpty(),
            }
        }

    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    getDetail = () => {
        //返回html格式的字符串
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }
    render() {
        const { editorState } = this.state;
        return (
            <Editor
                editorState={editorState}
                editorStyle={{ border: "1px solid black", height: 100, paddingLeft: 10 }}
                onEditorStateChange={this.onEditorStateChange}
            />
        );
    }
}




