import { Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import React from 'react';
import { reqDeleteImg } from '../../api';
import { BASE_IMG_URL } from '../../utils/constants';

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

/*用于图片上传的组件 */
export default class PicturesWall extends React.Component {
  constructor(props) {
    super(props)
    const { imgs } = this.props;
    if (imgs && imgs.length > 0) {
      this.state = {
        fileList: imgs.map((file, index) => ({
          uid: -index,//每一个file都有一个唯一的id
          name: file,//图片文件名 
          status: 'done',//图片的状态：done:已经上传 uploading:正在上传中  removed:已删除
          url: BASE_IMG_URL + file,
        }))
      }
    } else {
      this.state = {
        fileList: []
      }
    }
  }
  state = {
    previewVisible: false,//标识大图是否显示预览
    previewImage: '',//大图的url
    previewTitle: '',
    // fileList: [
    // //   {
    // //     uid: '-1',//每一个file都有一个唯一的id
    // //     name: 'image.png',//图片文件名 
    // //     status: 'done',//图片的状态：done:已经上传 uploading:正在上传中  removed:已删除
    // //     url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    // //   },
    // ],
  };

  //map 获取所有已上传图片文件名的数组["","","",...]
  getImages = () => {
    return this.state.fileList.map(file => file.name)
  }


  //隐藏model
  handleCancel = () => this.setState({ previewVisible: false });

  //显示指定file对应的大图
  handlePreview = async file => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    this.setState({
      previewImage: file.url || file.preview,
      previewVisible: true,
      previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
    });
  };

  //fileList：所有已经上传的图片文件对象的数组
  //file 当前操作的文件对象。(上传或者删除)
  handleChange = async ({ file, fileList }) => {
    console.log(file)
    //一旦上传成功，将当前上传的file的信息修正（name,url）
    if (file.status === "done") {
      const result = file.response;
      if (result.status === 0) {
        message.success("上传图片成功！")
        const { url, name } = result.data;
        //保证list中的最后一张图片就是当前操作的图片
        file = fileList[fileList.length - 1]
        file.name = name;
        file.url = url;
      } else {
        message.error("上传图片失败！")
      }
    } else if (file.status === "removed") {
      const result = await reqDeleteImg(file.name);
      if (result.status === 0) {
        message.success("删除图片成功")
      } else {
        message.error("删除图片失败")
      }
    }
    this.setState({ fileList })
  };

  render() {
    const { previewVisible, previewImage, fileList, previewTitle } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div style={{ marginTop: 8 }}>Upload</div>
      </div>
    );
    return (
      <>
        <Upload
          accept='image/*'//指定只能接受图片类型的格式
          action="/manage/img/upload"//上传图片的接口地址
          listType="picture-card"//卡片样式
          name='image'//请求参数名
          fileList={fileList}//已经上传文件的列表
          onPreview={this.handlePreview}
          onChange={this.handleChange}
        >
          {fileList.length >= 8 ? null : uploadButton}
        </Upload>
        <Modal
          visible={previewVisible}
          title={previewTitle}
          footer={null}
          onCancel={this.handleCancel}
        >
          <img alt="example" style={{ width: '100%' }} src={previewImage} />
        </Modal>
      </>
    );
  }
}

